import OpenAI from 'openai'
import { getActiveProvider } from './ai-client.js'

/**
 * Audio transcription — masih pakai openai SDK karena Vercel AI SDK
 * belum punya dukungan audio/transcriptions.
 */
export async function transcribeAudio(audioPath: string, userId?: string): Promise<string> {
  const provider = await getActiveProvider('audio', userId)
  if (!provider) throw new Error('No AI provider configured for audio transcription. Add an audio provider in Settings → AI Providers.')

  const client = new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseURL || undefined,
    timeout: 60000,
  })

  const fs = await import('node:fs')
  try {
    const result = await client.audio.transcriptions.create({
      model: provider.modelId,
      file: fs.createReadStream(audioPath),
    })
    return result.text ?? ''
  } catch (err: any) {
    if (err?.status === 404) {
      throw new Error(
        `Audio transcription endpoint not found for provider "${provider.baseURL}". ` +
        `The provider may not support audio transcription. Check your audio model ID ("${provider.modelId}") and base URL in Settings → AI Providers.`
      )
    }
    throw err
  }
}
