import { makeClient, getActiveProvider } from './ai-client.js'

export async function listAvailableModels(
  userId?: number,
): Promise<{ id: string; providerBaseURL: string; ownedBy: string }[]> {
  const providers: { apiKey: string; baseURL: string }[] = []

  for (const ptype of ['chat', 'embedding', 'audio']) {
    const p = await getActiveProvider(ptype, userId)
    if (p) providers.push({ apiKey: p.apiKey, baseURL: p.baseURL })
  }

  // Deduplikasi berdasarkan baseURL
  const uniqueProviders = providers.filter(
    (p, i, arr) => arr.findIndex(x => x.baseURL === p.baseURL) === i
  )

  const seen = new Set<string>()
  const results: { id: string; providerBaseURL: string; ownedBy: string }[] = []

  for (const p of uniqueProviders) {
    try {
      const client = makeClient(p.apiKey, p.baseURL)
      const models = await client.models.list()
      for (const m of models.data) {
        const key = `${p.baseURL}:${m.id}`
        if (!seen.has(key)) {
          seen.add(key)
          results.push({
            id: m.id,
            providerBaseURL: p.baseURL,
            ownedBy: (m as any).owned_by as string ?? '',
          })
        }
      }
    } catch { /* skip provider jika error */ }
  }

  return results.sort((a, b) => a.id.localeCompare(b.id))
}
