import OpenAI from 'openai'
import { db } from '@ghost/database'
import { decrypt } from './encryption.js'

const clientCache = new Map<string, OpenAI>()

export function makeClient(apiKey: string, baseURL: string): OpenAI {
  const key = `${apiKey}:${baseURL}`
  if (!clientCache.has(key)) {
    clientCache.set(key, new OpenAI({ apiKey, baseURL }))
  }
  return clientCache.get(key)!
}

export async function getActiveProvider(
  providerType: string,
  userId?: number,
): Promise<{ apiKey: string; baseURL: string; modelId: string } | null> {
  if (!userId) return null
  try {
    const provider = await db.aIProvider.findFirst({
      where: { userId, providerType, isActive: true },
    })
    if (provider) {
      return {
        apiKey: decrypt(provider.apiKey),
        baseURL: provider.apiBaseUrl,
        modelId: provider.modelId,
      }
    }
  } catch { /* noop */ }
  return null
}
