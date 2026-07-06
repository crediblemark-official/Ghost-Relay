import OpenAI from 'openai'
import { db } from '@ghost/database'
import { decrypt } from './encryption.js'
import { getAllProviders } from './models-dev.js'

const clientCache = new Map<string, OpenAI>()

export function makeClient(apiKey: string, baseURL: string): OpenAI {
  const key = `${apiKey}:${baseURL}`
  if (!clientCache.has(key)) {
    const config: { apiKey: string; baseURL?: string } = { apiKey }
    const trimmedUrl = (baseURL || '').trim()
    if (trimmedUrl) {
      config.baseURL = trimmedUrl
    }
    clientCache.set(key, new OpenAI(config))
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
      const resolvedBaseUrl = await resolveProviderBaseUrl(provider.apiBaseUrl, provider.name, provider.modelId)
      return {
        apiKey: decrypt(provider.apiKey),
        baseURL: resolvedBaseUrl,
        modelId: provider.modelId,
      }
    }
  } catch { /* noop */ }
  return null
}

export async function resolveProviderBaseUrl(
  baseUrlFromUser: string | undefined | null,
  providerNameOrId?: string,
  modelId?: string,
): Promise<string> {
  const url = (baseUrlFromUser || '').trim().replace(/\/+$/, '')
  if (url) {
    return url
  }

  const providerKey = (providerNameOrId || '').toLowerCase()

  // 1. Coba cari provider secara dinamis di catalog models.dev
  try {
    const providers = await getAllProviders()
    const matchedProvider = Object.values(providers).find(
      p => p.id.toLowerCase() === providerKey || p.name.toLowerCase() === providerKey
    )
    if (matchedProvider && matchedProvider.api) {
      return matchedProvider.api.trim().replace(/\/+$/, '')
    }
  } catch (err) {
    console.error('Error fetching providers catalog:', err)
  }

  return ''
}
