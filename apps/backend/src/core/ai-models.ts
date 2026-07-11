import { getActiveProvider } from './ai-client.js'
import { isQwenAvailable, QWEN_MODELS } from './qwen-client.js'

/**
 * List all available AI models — Qwen Cloud first, then user-configured providers.
 */
export async function listAvailableModels(
  userId?: string,
): Promise<{ id: string; providerBaseURL: string; ownedBy: string; isDefault?: boolean }[]> {
  const results: { id: string; providerBaseURL: string; ownedBy: string; isDefault?: boolean }[] = []
  const seen = new Set<string>()
  const QWEN_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

  // 1. Qwen Cloud models (built-in, always listed if API key exists)
  if (isQwenAvailable()) {
    const qwenModels = [
      { id: QWEN_MODELS.chat, name: 'Qwen 3.7 Plus (Chat)' },
      { id: QWEN_MODELS.chatFast, name: 'Qwen 3.6 Flash (Fast)' },
      { id: QWEN_MODELS.chatMax, name: 'Qwen 3.7 Max (Reasoning)' },
      { id: QWEN_MODELS.embedding, name: 'Qwen Embedding V4' },
      { id: QWEN_MODELS.stt, name: 'Qwen ASR Flash (STT)' },
      { id: QWEN_MODELS.sttOmni, name: 'Qwen Omni Flash (STT)' },
    ]
    for (const m of qwenModels) {
      if (!seen.has(m.id)) {
        seen.add(m.id)
        results.push({ id: m.id, providerBaseURL: QWEN_BASE_URL, ownedBy: 'qwen-cloud', isDefault: true })
      }
    }
  }

  // 2. User-configured providers (DB)
  for (const ptype of ['chat', 'embedding', 'audio']) {
    const p = await getActiveProvider(ptype, userId)
    if (!p) continue
    const key = `${p.baseURL}:${p.modelId}`
    if (seen.has(key)) continue
    seen.add(key)

    try {
      const modelsUrl = `${p.baseURL.replace(/\/+$/, '')}/models`
      const res = await fetch(modelsUrl, {
        headers: { 'Authorization': `Bearer ${p.apiKey}` },
      })
      if (!res.ok) continue
      const json = await res.json() as { data?: { id: string; owned_by?: string }[] }
      for (const m of (json.data ?? [])) {
        const mkey = `${p.baseURL}:${m.id}`
        if (!seen.has(mkey)) {
          seen.add(mkey)
          results.push({ id: m.id, providerBaseURL: p.baseURL, ownedBy: m.owned_by ?? '' })
        }
      }
    } catch { /* skip */ }
  }

  return results.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1
    if (!a.isDefault && b.isDefault) return 1
    return a.id.localeCompare(b.id)
  })
}
