import { makeClient, getActiveProvider } from './ai-client.js'

export async function transcribeAudio(audioPath: string, userId?: number): Promise<string> {
  const provider = await getActiveProvider('audio', userId)
  if (!provider) throw new Error('No AI provider configured for audio')
  const client = makeClient(provider.apiKey, provider.baseURL)
  const fs = await import('node:fs')
  const result = await client.audio.transcriptions.create({
    model: provider.modelId,
    file: fs.createReadStream(audioPath),
  })
  return result.text ?? ''
}
