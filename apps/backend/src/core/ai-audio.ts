import { generateText } from 'ai'
import { getLanguageModel, getActiveProvider } from './ai-client.js'
import { isQwenAvailable, qwenTranscribe } from './qwen-client.js'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'

const TRANSCRIPTION_PROMPT =
  'Transcribe this audio message exactly as spoken, in the original language. ' +
  'Return ONLY the transcription text — no punctuation normalization, no speaker labels, no summary.'

/**
 * Transcribe audio using direct OpenAI-compatible API call.
 * Used for non-Qwen providers (DashScope input_audio format, OpenAI Whisper, etc.)
 */
async function transcribeViaAPI(
  apiKey: string,
  baseURL: string,
  modelId: string,
  audioBuffer: Buffer,
  mediaType: string,
): Promise<string> {
  const audioBase64 = audioBuffer.toString('base64')
  const dataUri = `data:${mediaType};base64,${audioBase64}`

  const url = `${baseURL.replace(/\/+$/, '')}/chat/completions`

  console.log(`[AUDIO] Direct API call: url=${url}, model=${modelId}`)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: TRANSCRIPTION_PROMPT },
            {
              type: 'input_audio',
              input_audio: { data: dataUri },
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Audio API error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json() as any
  return (data.choices?.[0]?.message?.content ?? '').trim()
}

/**
 * Audio transcription — priority:
 * 1. Qwen Cloud native STT (qwen3-asr-flash) — best quality, dedicated model
 * 2. Qwen Cloud chat model (qwen3.7-plus) — multimodal fallback
 * 3. User-configured provider (OpenAI/Gemini) — via direct API or AI SDK
 */
export async function transcribeAudio(audioPath: string, userId?: string): Promise<string> {
  const fs = await import('node:fs')

  let processedAudioPath = audioPath
  let wasTranscoded = false
  const ext = audioPath.split('.').pop()?.toLowerCase() ?? 'webm'
  const isWebm = ext === 'webm'

  // Transcode webm → wav for non-Google providers
  const model = await getLanguageModel(userId)
  const isGoogle = model?.modelId.includes('gemini') ?? false

  if (isWebm && !isGoogle) {
    const tempWavPath = join(tmpdir(), `${randomUUID()}.wav`)
    try {
      const ffmpeg = await (import('@ffmpeg-installer/ffmpeg') as any)
      const ffmpegPath = ffmpeg.default?.path || ffmpeg.path || 'ffmpeg'
      execSync(`"${ffmpegPath}" -i "${audioPath}" -acodec pcm_s16le -ar 16000 -ac 1 "${tempWavPath}" -y`, { stdio: 'ignore' })
      processedAudioPath = tempWavPath
      wasTranscoded = true
    } catch (ffmpegErr) {
      console.warn(`[AUDIO] ffmpeg conversion failed, trying original:`, ffmpegErr)
    }
  }

  const audioBuffer = fs.readFileSync(processedAudioPath)
  const finalExt = processedAudioPath.split('.').pop()?.toLowerCase() ?? 'wav'
  const mediaType = finalExt === 'webm' ? 'audio/webm' : finalExt === 'mp3' ? 'audio/mpeg' : 'audio/wav'

  console.log(`[AUDIO] transcribeAudio: qwen=${isQwenAvailable()}, model=${model?.modelId}, mediaType=${mediaType}, size=${audioBuffer.length}`)

  try {
    // 1. Qwen Cloud native STT (dedicated speech-to-text model)
    if (isQwenAvailable()) {
      try {
        const text = await qwenTranscribe(audioBuffer, mediaType)
        if (text) {
          console.log(`[AUDIO] Qwen STT success: "${text.slice(0, 80)}..."`)
          return text
        }
      } catch (err) {
        console.warn(`[AUDIO] Qwen STT failed, trying chat model:`, (err as Error).message)
      }

      // 2. Qwen Cloud chat model (multimodal)
      if (model) {
        try {
          const { text } = await generateText({
            model: model.model,
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'file', data: audioBuffer, mediaType: mediaType as any },
                  { type: 'text', text: TRANSCRIPTION_PROMPT },
                ],
              },
            ],
          })
          if (text?.trim()) {
            console.log(`[AUDIO] Qwen chat transcription success`)
            return text.trim()
          }
        } catch (err) {
          console.warn(`[AUDIO] Qwen chat transcription failed:`, (err as Error).message)
        }
      }
    }

    // 3. User-configured providers (OpenAI/Gemini via direct API or AI SDK)
    if (isGoogle && model) {
      const { text } = await generateText({
        model: model.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'file', data: audioBuffer, mediaType: mediaType as any },
              { type: 'text', text: TRANSCRIPTION_PROMPT },
            ],
          },
        ],
      })
      return (text ?? '').trim()
    }

    // OpenAI-compatible: direct API call with input_audio format
    const provider = await getActiveProvider('chat', userId)
    if (provider) {
      return await transcribeViaAPI(provider.apiKey, provider.baseURL, provider.modelId, audioBuffer, mediaType)
    }

    throw new Error(
      'No AI provider configured for audio transcription. ' +
      'Set DASHSCOPE_API_KEY in environment or add a provider in Settings → AI Providers.'
    )
  } finally {
    if (wasTranscoded) {
      try { fs.unlinkSync(processedAudioPath) } catch {}
    }
  }
}
