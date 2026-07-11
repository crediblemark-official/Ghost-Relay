/**
 * Qwen Cloud (DashScope) native client.
 * Primary AI provider — built-in, no DB configuration needed.
 * Just set DASHSCOPE_API_KEY in environment.
 */
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel, EmbeddingModel } from 'ai'

const QWEN_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

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

export function getQwenApiKey(): string | null {
  return process.env.DASHSCOPE_API_KEY || null
}

export function isQwenAvailable(): boolean {
  return !!getQwenApiKey()
}

export function createQwenClient(apiKey?: string): ReturnType<typeof createOpenAI> {
  const key = apiKey || getQwenApiKey() || ''
  if (cachedClient && cachedApiKey === key) return cachedClient
  cachedClient = createOpenAI({
    apiKey: key,
    baseURL: QWEN_BASE_URL,
  })
  cachedApiKey = key
  return cachedClient
}

export function getQwenChatModel(modelId?: string): LanguageModel {
  const client = createQwenClient()
  return client.chat(modelId || QWEN_MODELS.chat)
}

export function getQwenEmbeddingModel(modelId?: string): EmbeddingModel {
  const client = createQwenClient()
  return client.textEmbeddingModel(modelId || QWEN_MODELS.embedding)
}

/**
 * Transcribe audio via Qwen Cloud STT (qwen3-asr-flash).
 * Uses OpenAI-compatible /chat/completions with input_audio content part.
 */
export async function qwenTranscribe(
  audioBuffer: Buffer,
  mediaType: string,
  apiKey?: string,
): Promise<string> {
  const key = apiKey || getQwenApiKey()
  if (!key) throw new Error('DASHSCOPE_API_KEY not set')

  const audioBase64 = audioBuffer.toString('base64')
  const dataUri = `data:${mediaType};base64,${audioBase64}`

  const res = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: QWEN_MODELS.stt,
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
export async function qwenHealthCheck(apiKey?: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const key = apiKey || getQwenApiKey()
    if (!key) return { ok: false, error: 'DASHSCOPE_API_KEY not set' }

    const res = await fetch(`${QWEN_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${key}` },
    })

    if (res.ok) return { ok: true }
    return { ok: false, error: `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
