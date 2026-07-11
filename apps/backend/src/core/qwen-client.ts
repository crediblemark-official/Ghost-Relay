/**
 * Qwen Cloud (DashScope) native client.
 * Primary AI provider — built-in, no DB configuration needed.
 * Just set DASHSCOPE_API_KEY in environment.
 */
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel, EmbeddingModel } from 'ai'
import { db } from '@ghost/database'
import { decrypt } from './encryption.js'

import { getSetting } from './db-settings.js'

const QWEN_BASE_URL_INTL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
const QWEN_BASE_URL_CN   = 'https://dashscope.aliyuncs.com/compatible-mode/v1'

// Default ke international
const QWEN_BASE_URL = QWEN_BASE_URL_INTL

export const QWEN_MODELS = {
  chat: 'qwen3.7-plus',
  chatFast: 'qwen3.6-flash',
  chatMax: 'qwen3.7-max',
  embedding: 'text-embedding-v4',
  stt: 'qwen3-asr-flash',
  sttOmni: 'qwen3-omni-flash',
} as const

let cachedClient: ReturnType<typeof createOpenAI> | null = null
let cachedApiKey = ''

export async function getQwenApiKey(userId?: string): Promise<string | null> {
  // 1. Cek dari SystemSetting (konfigurasi mandiri Qwen Cloud)
  try {
    const keySetting = await getSetting('qwen_api_key')
    if (keySetting) {
      return decrypt(keySetting)
    }
  } catch (err) {
    console.error('[QWEN] Failed to read qwen_api_key from settings:', err)
  }

  // 2. Fallback: Cek dari DB AIProvider
  try {
    const provider = await db.aIProvider.findFirst({
      where: {
        OR: [
          { name: { in: ['Qwen', 'DashScope', 'qwen', 'dashscope'] } },
          { apiBaseUrl: { contains: 'dashscope' } },
          { apiBaseUrl: { contains: 'aliyuncs.com' } }
        ],
        isActive: true
      }
    })
    if (provider) {
      return decrypt(provider.apiKey)
    }
  } catch (err) {
    console.error('[QWEN] Failed to query Qwen API Key from DB:', err)
  }

  return null
}

export async function isQwenAvailable(userId?: string): Promise<boolean> {
  const key = await getQwenApiKey(userId)
  return !!key
}

export async function getQwenBaseUrl(userId?: string): Promise<string> {
  // Cek scope setting dulu
  try {
    const scope = await getSetting('qwen_scope')
    if (scope === 'china') {
      return QWEN_BASE_URL_CN
    }
    if (scope === 'international') {
      return QWEN_BASE_URL_INTL
    }
  } catch {}

  // Fallback: cek dari DB provider
  try {
    const provider = await db.aIProvider.findFirst({
      where: {
        OR: [
          { name: { in: ['Qwen', 'DashScope', 'qwen', 'dashscope'] } },
          { apiBaseUrl: { contains: 'dashscope' } },
          { apiBaseUrl: { contains: 'aliyuncs.com' } }
        ],
        isActive: true
      }
    })
    if (provider?.apiBaseUrl) {
      return provider.apiBaseUrl
    }
  } catch {}
  return QWEN_BASE_URL
}

export async function createQwenClient(apiKey?: string, userId?: string): Promise<ReturnType<typeof createOpenAI>> {
  const key = apiKey || await getQwenApiKey(userId) || ''
  const baseUrl = await getQwenBaseUrl(userId)

  if (cachedClient && cachedApiKey === key) return cachedClient
  cachedClient = createOpenAI({
    apiKey: key,
    baseURL: baseUrl,
  })
  cachedApiKey = key
  return cachedClient
}

export async function getQwenChatModel(modelId?: string, userId?: string): Promise<LanguageModel> {
  const client = await createQwenClient(undefined, userId)
  const resolvedModelId = modelId || await getSetting('qwen_chat_model') || QWEN_MODELS.chat
  return client.chat(resolvedModelId)
}

export async function getQwenEmbeddingModel(modelId?: string, userId?: string): Promise<EmbeddingModel> {
  const client = await createQwenClient(undefined, userId)
  return client.textEmbeddingModel(modelId || QWEN_MODELS.embedding)
}

/**
 * Transcribe audio via Qwen Cloud STT (qwen3-asr-flash or multimodal).
 * Uses OpenAI-compatible /chat/completions with input_audio content part.
 */
export async function qwenTranscribe(
  audioBuffer: Buffer,
  mediaType: string,
  apiKey?: string,
  userId?: string,
): Promise<string> {
  const key = apiKey || await getQwenApiKey(userId)
  if (!key) throw new Error('DASHSCOPE_API_KEY not set and no Qwen provider found in Settings')

  const baseUrl = await getQwenBaseUrl(userId)

  const chatModel = await getSetting('qwen_chat_model') || QWEN_MODELS.chat
  const normalized = chatModel.toLowerCase()
  const isMultimodal = (
    normalized.includes('omni') ||
    normalized.includes('audio') ||
    normalized.includes('vl') ||
    normalized.includes('vision')
  )

  const resolvedModel = isMultimodal
    ? chatModel
    : await getSetting('qwen_audio_model') || QWEN_MODELS.stt

  const audioBase64 = audioBuffer.toString('base64')
  const dataUri = `data:${mediaType};base64,${audioBase64}`

  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: resolvedModel,
      messages: [
        {
          role: 'user',
          content: [
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
    throw new Error(`Qwen STT error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json() as any
  return (data.choices?.[0]?.message?.content ?? '').trim()
}

/**
 * Health check — verify API key works.
 */
export async function qwenHealthCheck(apiKey?: string, userId?: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const key = apiKey || await getQwenApiKey(userId)
    if (!key) return { ok: false, error: 'DASHSCOPE_API_KEY not set and no Qwen provider found in Settings' }

    const baseUrl = await getQwenBaseUrl(userId)

    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/models`, {
      headers: { 'Authorization': `Bearer ${key}` },
    })

    if (res.ok) return { ok: true }
    return { ok: false, error: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
