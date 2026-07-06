import { makeClient, getActiveProvider } from './ai-client.js'

export async function generateEmbedding(text: string, userId?: number): Promise<number[]> {
  const provider = await getActiveProvider('embedding', userId)
  if (!provider) throw new Error('No AI provider configured for embedding')
  const client = makeClient(provider.apiKey, provider.baseURL)
  const result = await client.embeddings.create({
    model: provider.modelId,
    input: text,
  })
  return result.data[0]?.embedding ?? []
}
