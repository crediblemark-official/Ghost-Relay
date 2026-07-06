import type { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@ghost/config'
import { getSetting, setSetting, deleteSetting, invalidateCache } from '../../core/db-settings.js'

export const EDITABLE_KEYS = ['STORAGE_DIR']

const envDefaults: Record<string, string> = {
  STORAGE_DIR: env.STORAGE_DIR,
}

export async function handleGetEnv() {
  const result: { key: string; value: string; source: string }[] = []
  for (const key of EDITABLE_KEYS) {
    const dbVal = await getSetting(key)
    const envVal = envDefaults[key]
    if (dbVal !== null) {
      result.push({ key, value: dbVal, source: 'db' })
    } else if (envVal) {
      result.push({ key, value: envVal, source: 'env' })
    } else {
      result.push({ key, value: '', source: 'builtin' })
    }
  }
  return result
}

export async function handlePostEnv(req: FastifyRequest, reply: FastifyReply) {
  const { key, value } = req.body as { key: string; value?: string }
  if (!EDITABLE_KEYS.includes(key)) {
    reply.status(400).send({ detail: `Key '${key}' is not editable` })
    return
  }
  await setSetting(key, value ?? '')
  invalidateCache()
  return { status: 'ok', key, value }
}

export async function handleDeleteEnv(req: FastifyRequest, reply: FastifyReply) {
  const { key } = req.params as { key: string }
  if (!EDITABLE_KEYS.includes(key)) {
    reply.status(400).send({ detail: `Key '${key}' is not editable` })
    return
  }
  await deleteSetting(key)
  invalidateCache()
  return { status: 'ok', key }
}
