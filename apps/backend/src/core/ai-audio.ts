import { generateText } from 'ai'
import { getLanguageModel } from './ai-client.js'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'

const TRANSCRIPTION_PROMPT =
  'Transcribe this audio message exactly as spoken, in the original language. ' +
  'Return ONLY the transcription text — no punctuation normalization, no speaker labels, no summary.'

/**
 * Audio transcription — using Vercel AI SDK `generateText()` with a multimodal chat model.
 * Supports GPT-4o, Gemini, Qwen-audio, or any model that accepts audio input.
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

  // OpenAI-compatible / DashScope audio models only support wav/mp3 in AI SDK. Transcode webm.
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

    const { text } = await generateText({
      model: model.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              data: audioBuffer,
              mediaType: mediaType as any,
            },
            {
              type: 'text',
              text: TRANSCRIPTION_PROMPT,
            },
          ],
        },
      ],
    })

    if (wasTranscoded) {
      fs.unlinkSync(processedAudioPath)
    }

    return (text ?? '').trim()
  } catch (err: any) {
    if (wasTranscoded) {
      fs.unlinkSync(processedAudioPath)
    }

    // Some providers return 400/404 for unsupported content types
    if (err?.statusCode === 404 || err?.statusCode === 400 || err?.status === 404 || err?.status === 400) {
      throw new Error(
        `Audio input not supported by model "${model.modelId ?? 'unknown'}". ` +
        `Use a model that supports audio (GPT-4o, Gemini Flash/Pro, or Qwen-audio). ` +
        `Check your provider in Settings → AI Providers.`
      )
    }
    throw err
  }
}
