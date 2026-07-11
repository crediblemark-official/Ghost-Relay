import { db } from '@ghost/database'

const CACHE_TTL = 30_000 // 30 detik
let cache: Record<string, string | null> = {}
let cacheLoadedAt = 0
let loadPromise: Promise<void> | null = null

async function loadCache(): Promise<void> {
  if (loadPromise) return loadPromise
  const now = Date.now()
  if (cacheLoadedAt && (now - cacheLoadedAt) < CACHE_TTL) return

  loadPromise = (async () => {
    try {
      const rows = await db.systemSetting.findMany({
        where: { isActive: true },
      })
      cache = {}
      for (const row of rows) {
        cache[row.key] = row.value
      }
    } catch { /* ignore */ }
    cacheLoadedAt = Date.now()
    loadPromise = null
  })()
  return loadPromise
}

export async function getSetting(key: string, fallback?: string): Promise<string | null> {
  await loadCache()
  return cache[key] ?? fallback ?? null
}

export async function setSetting(key: string, value: string): Promise<void> {
  const existing = await db.systemSetting.findFirst({
    where: { key },
  })
  if (existing) {
    await db.systemSetting.update({
      where: { key },
      data: { value },
    })
  } else {
    await db.systemSetting.create({
      data: { key, value },
    })
  }
  cache[key] = value
}

export async function deleteSetting(key: string): Promise<void> {
  await db.systemSetting.delete({
    where: { key },
  }).catch(() => {})
  delete cache[key]
  cacheLoadedAt = 0
}

export function invalidateCache(): void {
  cacheLoadedAt = 0
  cache = {}
}
