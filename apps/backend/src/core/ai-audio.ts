import { transcribe } from 'ai'
import { getAudioModel } from './ai-client.js'

/**
 * Audio transcription — menggunakan Vercel AI SDK `transcribe()`.
 * Provider harus support audio (OpenAI Whisper, Groq Whisper, dll.).
 */
export async function transcribeAudio(audioPath: string, userId?: string): Promise<string> {
  const audio = await getAudioModel(userId)
  if (!audio) {
    throw new Error(
      'No AI provider configured for audio transcription. ' +
      'Add an audio provider in Settings → AI Providers (e.g. OpenAI with Whisper model).'
    )
  }

  const fs = await import('node:fs')
  const audioBuffer = fs.readFileSync(audioPath)

  try {
    const { text } = await transcribe({
      model: audio.model,
      audio: audioBuffer,
    })
    return text ?? ''
  } catch (err: any) {
    if (err?.statusCode === 404 || err?.status === 404) {
      throw new Error(
        `Audio transcription endpoint not found for model "${audio.modelId}". ` +
        `The provider may not support audio transcription. ` +
        `Check your audio model and provider in Settings → AI Providers.`
      )
    }
    throw err
  }
}
