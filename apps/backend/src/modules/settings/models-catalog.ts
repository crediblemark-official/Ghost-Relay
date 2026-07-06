import type { FastifyRequest, FastifyReply } from 'fastify'

let catalogCache: any = null
let catalogLastFetched = 0
const CACHE_TTL = 3600 * 1000 // 1 hour

async function fetchCatalog() {
  const now = Date.now()
  if (!catalogCache || now - catalogLastFetched > CACHE_TTL) {
    try {
      const res = await fetch('https://models.dev/catalog.json')
      if (res.ok) {
        catalogCache = await res.json()
        catalogLastFetched = now
      }
    } catch (err) {
      console.error('Failed to fetch models.dev catalog:', err)
    }
  }
  return catalogCache
}

export async function handleFetchModels(req: FastifyRequest, reply: FastifyReply) {
  const { apiKey, baseUrl } = req.body as { apiKey: string; baseUrl: string }
  if (!apiKey || !baseUrl) {
    reply.status(400).send({ detail: 'API Key and Base URL are required' })
    return
  }
  try {
    let url = baseUrl
    if (!url.endsWith('/models') && !url.endsWith('/models/')) {
      url = url.endsWith('/') ? `${url}models` : `${url}/models`
    }

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
    if (!res.ok) {
      throw new Error(`Provider returned status ${res.status}`)
    }
    const data = (await res.json()) as any
    const models = data.data ? data.data.map((m: any) => m.id) : []
    return { models }
  } catch (err: any) {
    reply.status(500).send({ detail: err.message || 'Failed to fetch models' })
  }
}

export async function handleModelsCatalog() {
  const catalog = await fetchCatalog()
  if (!catalog || !catalog.providers) {
    return { providers: [] }
  }
  const providers = Object.values(catalog.providers).map((p: any) => {
    return {
      id: p.id,
      name: p.name,
      api: p.api || '',
      models: p.models ? Object.keys(p.models) : []
    }
  })
  return { providers }
}
