import { generateText } from 'ai'
import { getLanguageModel, getActiveProvider } from './ai-client.js'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'

const TRANSCRIPTION_PROMPT =
  'Transcribe this audio message exactly as spoken, in the original language. ' +
  'Return ONLY the transcription text — no punctuation normalization, no speaker labels, no summary.'

/**
 * Transcribe audio using direct OpenAI-compatible API call.
 * DashScope and other OpenAI-compatible providers expect `input_audio` content part,
 * not `file` content part that Vercel AI SDK sends.
 */
async function transcribeViaAPI(
  apiKey: string,
  baseURL: string,
  modelId: string,
  audioBuffer: Buffer,
  mediaType: string,
): Promise<string> {
  const audioBase64 = audioBuffer.toString('base64')
  const format = mediaType.includes('wav') ? 'wav' : mediaType.includes('mp3') ? 'mp3' : 'wav'

  const url = `${baseURL.replace(/\/+$/, '')}/chat/completions`

  console.log(`[AUDIO] Direct API call: url=${url}, model=${modelId}, format=${format}`)

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
              input_audio: { data: audioBase64, format },
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[AUDIO] API error ${res.status}:`, body)
    throw new Error(`Audio API error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json() as any
  return (data.choices?.[0]?.message?.content ?? '').trim()
}

/**
 * Audio transcription — uses Vercel AI SDK for native providers (Google/Gemini)
 * and direct API call for OpenAI-compatible providers (DashScope, OpenAI, etc.).
 */
export async function transcribeAudio(audioPath: string, userId?: string): Promise<string> {
  const fs = await import('node:fs')

  let processedAudioPath = audioPath
  let wasTranscoded = false
  const ext = audioPath.split('.').pop()?.toLowerCase() ?? 'webm'
  const isWebm = ext === 'webm'

  const model = await getLanguageModel(userId)
  if (!model) {
    throw new Error(
      'No AI provider configured. Add a provider in Settings → AI Providers (GPT-4o, Gemini, or Qwen-audio all support audio).'
    )
  }

  const isGoogle = model.modelId.includes('gemini')

  if (isWebm && !isGoogle) {
    const tempWavPath = join(tmpdir(), `${randomUUID()}.wav`)
    try {
      const ffmpeg = await (import('@ffmpeg-installer/ffmpeg') as any)
      const ffmpegPath = ffmpeg.default?.path || ffmpeg.path || 'ffmpeg'
      execSync(`"${ffmpegPath}" -i "${audioPath}" -acodec pcm_s16le -ar 16000 -ac 1 "${tempWavPath}" -y`, { stdio: 'ignore' })
      processedAudioPath = tempWavPath
      wasTranscoded = true
    } catch (ffmpegErr) {
      console.warn(`[AUDIO] ffmpeg conversion failed, trying original webm:`, ffmpegErr)
    }
  }

  try {
    const audioBuffer = fs.readFileSync(processedAudioPath)
    const finalExt = processedAudioPath.split('.').pop()?.toLowerCase() ?? 'wav'
    const mediaType = finalExt === 'webm' ? 'audio/webm' : finalExt === 'mp3' ? 'audio/mpeg' : 'audio/wav'

    console.log(`[AUDIO] transcribeAudio: model=${model.modelId}, mediaType=${mediaType}, bufferSize=${audioBuffer.length}, isGoogle=${isGoogle}`)

    // Gemini: use Vercel AI SDK (native audio support)
    if (isGoogle) {
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

    // OpenAI-compatible (DashScope, OpenAI, etc.): use direct API call
    const provider = await getActiveProvider('chat', userId)
    if (!provider) {
      throw new Error('No AI provider configured for direct API call.')
    }
    return await transcribeViaAPI(provider.apiKey, provider.baseURL, provider.modelId, audioBuffer, mediaType)
  } catch (err: any) {
    console.error(`[AUDIO] transcribeAudio error:`, err?.message ?? err)

    if (err?.statusCode === 404 || err?.statusCode === 400 || err?.status === 404 || err?.status === 400) {
      throw new Error(
        `Audio input not supported by model "${model.modelId ?? 'unknown'}". ` +
        `Use a model that supports audio (GPT-4o, Gemini Flash/Pro, or Qwen-audio). ` +
        `Check your provider in Settings → AI Providers.`
      )
    }
    throw err
  } finally {
    if (wasTranscoded) {
      try { fs.unlinkSync(processedAudioPath) } catch {}
    }
  }
}
