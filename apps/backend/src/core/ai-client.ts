import { createOpenAI, type OpenAIProvider } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import type { LanguageModel, EmbeddingModel, TranscriptionModel } from 'ai'
import { db } from '@ghost/database'
import { decrypt } from './encryption.js'
import { getAllProviders } from './models-dev.js'
import { findWorkspaceByMember } from './workspace.js'
import { isQwenAvailable, getQwenChatModel, getQwenEmbeddingModel } from './qwen-client.js'

const providerCache = new Map<string, { data: any; expiresAt: number }>()
const openaiClientCache = new Map<string, { data: OpenAIProvider; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Buat OpenAI-compatible provider (untuk listing models via /v1/models endpoint).
 */
export function makeOpenAIProvider(apiKey: string, baseURL: string): OpenAIProvider {
  const key = `${apiKey}:${baseURL}`
  const cached = openaiClientCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.data
  const trimmedUrl = (baseURL || '').trim()
  const p = createOpenAI({
    apiKey: apiKey || 'no-key',
    ...(trimmedUrl ? { baseURL: trimmedUrl } : {}),
  })
  openaiClientCache.set(key, { data: p, expiresAt: Date.now() + CACHE_TTL_MS })
  return p
}

/**
 * Buat provider SDK sesuai npm package dari catalog models.dev.
 */
function createProviderForNpm(
  npmPackage: string,
  apiKey: string,
  userBaseUrl: string | null,
): { chat: (modelId: string) => LanguageModel; embedding?: (modelId: string) => EmbeddingModel; transcription?: (modelId: string) => TranscriptionModel } {
  const cacheKey = `${npmPackage}:${apiKey}:${userBaseUrl ?? ''}`
  const cached = providerCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.data

  const userSetUrl = (userBaseUrl || '').trim()

  const withUrl = <T extends Record<string, unknown>>(opts: T): T => {
    if (!userSetUrl) return opts
    return { ...opts, baseURL: userSetUrl }
  }

  let result: { chat: (id: string) => LanguageModel; embedding?: (id: string) => EmbeddingModel; transcription?: (id: string) => TranscriptionModel }

  switch (npmPackage) {
    case '@ai-sdk/google': {
      const p = createGoogleGenerativeAI(withUrl({ apiKey: apiKey || 'no-key' }) as any)
      result = { chat: (id) => p.chat(id), embedding: (id) => p.embedding(id) }
      break
    }
    case '@ai-sdk/anthropic': {
      const p = createAnthropic(withUrl({ apiKey: apiKey || 'no-key' }) as any)
      result = { chat: (id) => p.chat(id) }
      break
    }
    default: {
      const p = createOpenAI(withUrl({ apiKey: apiKey || 'no-key' }))
      result = { chat: (id) => p.chat(id), embedding: (id) => p.textEmbeddingModel(id), transcription: (id) => p.transcription(id) }
      break
    }
  }

  providerCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS })
  return result
}

/**
 * Cari npm package untuk provider dari catalog models.dev.
 */
async function resolveNpmPackage(providerNameOrId: string): Promise<string | null> {
  try {
    const providers = await getAllProviders()
    const key = providerNameOrId.toLowerCase()
    const matched = Object.values(providers).find(
      p => p.id.toLowerCase() === key || p.name.toLowerCase() === key,
    )
    if (matched?.npm) return matched.npm
  } catch { /* noop */ }
  return null
}

async function findActiveProvider(userId: string, providerType: string) {
  // 1. user's personal provider
  let provider = await db.aIProvider.findFirst({
    where: { userId, providerType, isActive: true, scope: 'personal' },
  })
  if (provider) return provider
  // 2. workspace default
  const ws = await findWorkspaceByMember(userId)
  if (ws) {
    provider = await db.aIProvider.findFirst({
      where: { workspaceId: ws.id, providerType, isActive: true, scope: 'workspace' },
    })
  }
  if (provider) return provider
  // 3. global provider (dari owner)
  provider = await db.aIProvider.findFirst({
    where: { scope: 'global', providerType, isActive: true },
  })
  return provider
}

/**
 * Resolve user-configured provider from DB.
 */
async function resolveDbProvider(userId: string | undefined, providerType: string) {
  if (!userId) return null
  try {
    let provider = await findActiveProvider(userId, providerType)
    if (!provider && providerType === 'chat') {
      provider = await findActiveProvider(userId, 'audio')
    }
    if (provider) {
      const npm = await resolveNpmPackage(provider.name) ?? '@ai-sdk/openai-compatible'
      const sdk = createProviderForNpm(npm, decrypt(provider.apiKey), provider.apiBaseUrl)
      return { sdk, modelId: provider.modelId, provider }
    }
  } catch (err) {
    console.error(`[AI] resolveDbProvider(${providerType}) error:`, err)
  }
  return null
}

// ─── Public API: Qwen Cloud first, fallback to DB providers ──────────

/**
 * Get LanguageModel — Qwen Cloud first, then user-configured providers.
 */
export async function getLanguageModel(userId?: string): Promise<{ model: LanguageModel; modelId: string } | null> {
  // 1. User-configured providers (DB) - has highest precedence
  const dbResult = await resolveDbProvider(userId, 'chat')
  if (dbResult) {
    return { model: dbResult.sdk.chat(dbResult.modelId), modelId: dbResult.modelId }
  }

  // 2. Qwen Cloud (built-in fallback, configured via settings card)
  const qwenOk = await isQwenAvailable(userId)
  if (qwenOk) {
    try {
      const model = await getQwenChatModel(undefined, userId)
      return { model, modelId: 'qwen3.7-plus' }
    } catch (err) {
      console.warn('[AI] Qwen Cloud built-in fallback failed:', (err as Error).message)
    }
  }

  console.warn(`[AI] getLanguageModel: no provider found (userId=${userId})`)
  return null
}

/**
 * Get EmbeddingModel — DB providers first, then Qwen Cloud fallback.
 */
export async function getEmbeddingModel(userId?: string): Promise<{ model: EmbeddingModel; modelId: string } | null> {
  // 1. DB providers
  const dbResult = await resolveDbProvider(userId, 'embedding')
  if (dbResult && dbResult.sdk.embedding) {
    return { model: dbResult.sdk.embedding(dbResult.modelId), modelId: dbResult.modelId }
  }

  // 2. Qwen Cloud
  const qwenOk = await isQwenAvailable(userId)
  if (qwenOk) {
    try {
      const model = await getQwenEmbeddingModel(undefined, userId)
      return { model, modelId: 'text-embedding-v4' }
    } catch (err) {
      console.warn('[AI] Qwen Cloud embedding fallback failed:', (err as Error).message)
    }
  }

  return null
}

/**
 * Get VisionModel — same as LanguageModel (most modern LLMs support vision).
 */
export async function getVisionModel(userId?: string): Promise<{ model: LanguageModel; modelId: string } | null> {
  return getLanguageModel(userId)
}

/**
 * @deprecated Audio transcription now uses native Qwen STT API or chat model.
 */
export async function getAudioModel(userId?: string): Promise<{ model: TranscriptionModel; modelId: string } | null> {
  const dbResult = await resolveDbProvider(userId, 'audio')
  if (dbResult && dbResult.sdk.transcription) {
    return { model: dbResult.sdk.transcription(dbResult.modelId), modelId: dbResult.modelId }
  }
  return null
}

// ─── Utilities ───────────────────────────────────────────────────────

export async function resolveProviderBaseUrl(
  baseUrlFromUser: string | undefined | null,
  providerNameOrId?: string,
): Promise<string> {
  const url = (baseUrlFromUser || '').trim().replace(/\/+$/, '')
  if (url) return url

  const providerKey = (providerNameOrId || '').toLowerCase()
  try {
    const providers = await getAllProviders()
    const matched = Object.values(providers).find(
      p => p.id.toLowerCase() === providerKey || p.name.toLowerCase() === providerKey
    )
    if (matched?.api) return matched.api.trim().replace(/\/+$/, '')
  } catch { /* noop */ }

  return ''
}

/**
 * Get raw provider info for API calls.
 */
export async function getActiveProvider(
  providerType: string,
  userId?: string,
): Promise<{ apiKey: string; baseURL: string; modelId: string } | null> {
  if (!userId) return null
  try {
    const provider = await findActiveProvider(userId, providerType)
    if (provider) {
      const baseURL = await resolveProviderBaseUrl(provider.apiBaseUrl, provider.name)
      return { apiKey: decrypt(provider.apiKey), baseURL, modelId: provider.modelId }
    }
  } catch { /* noop */ }
  return null
}
