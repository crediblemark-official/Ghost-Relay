import type { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '@ghost/database'
import { listAvailableModels } from '../../core/ai-models.js'
import { resolveProviderBaseUrl, makeOpenAIProvider } from '../../core/ai-client.js'
import { validate, sendValidationError, ValidationError } from '../../core/validation.js'
import { encrypt, decrypt } from '../../core/encryption.js'
import { aiProviderCreateSchema, aiProviderUpdateSchema } from '@ghost/shared'
import { findWorkspaceByMember, findWorkspaceByMemberRole } from '../../core/workspace.js'
import {
  searchModels,
  getModelFamilies,
  searchProviders,
  getProviderModels,
} from '../../core/models-dev.js'
import { isQwenAvailable, QWEN_MODELS, getQwenApiKey, getQwenBaseUrl } from '../../core/qwen-client.js'
import { setSetting, deleteSetting } from '../../core/db-settings.js'

function maskKey(encrypted: string): string {
  try {
    const plain = decrypt(encrypted)
    if (!plain) return ''
    if (plain.length <= 8) return '***'
    return plain.slice(0, 4) + '***' + plain.slice(-4)
  } catch {
    return '***'
  }
}

export async function handleGetProviders(req: FastifyRequest) {
  // personal providers
  const personal = await db.aIProvider.findMany({
    where: { userId: req.userId, scope: 'personal' },
  })
  // workspace providers (cari via workspaceId, bukan scope — mencover data lama)
  const ws = await findWorkspaceByMember(req.userId)
  const wsProviders = ws
    ? await db.aIProvider.findMany({ where: { workspaceId: ws.id } })
    : []
  // global providers (dari owner)
  const globalProviders = await db.aIProvider.findMany({
    where: { scope: 'global' },
  })

  const seen = new Set(personal.map(p => `${p.providerType}:${p.name}`))
  const merged = [
    ...personal.map(p => ({ ...p, apiKey: maskKey(p.apiKey), scope: 'personal' as const })),
    ...globalProviders
      .filter(p => !seen.has(`${p.providerType}:${p.name}`))
      .map(p => ({ ...p, apiKey: maskKey(p.apiKey), scope: 'global' as const })),
    ...wsProviders
      .filter(p => !seen.has(`${p.providerType}:${p.name}`))
      .map(p => ({ ...p, apiKey: maskKey(p.apiKey), scope: 'workspace' as const })),
  ]
  return merged
}

export async function handleCreateProvider(req: FastifyRequest, reply: FastifyReply) {
  let body: {
    provider_type: string; name: string; api_base_url: string
    api_key?: string; model_id: string; is_active?: boolean; scope?: string
  }
  try {
    body = validate(aiProviderCreateSchema, req.body)
  } catch (err) {
    if (err instanceof ValidationError) return sendValidationError(reply, err)
    throw err
  }
  const { provider_type, name, api_base_url, api_key, model_id, is_active = true, scope = 'personal' } = body
  const encryptedKey = encrypt(api_key ?? '')
  let apiBaseUrl = (api_base_url || '').trim().replace(/\/+$/, '')
  if (apiBaseUrl === 'https://api.openai.com') {
    apiBaseUrl = 'https://api.openai.com/v1'
  }

  // resolve workspaceId jika scope = 'workspace'
  let workspaceId: string | null = null
  if (scope === 'workspace') {
    const ws = await findWorkspaceByMemberRole(req.userId, 'admin')
    if (!ws) {
      reply.status(403).send({ detail: 'You are not a workspace admin.' })
      return
    }
    workspaceId = ws.id
  }

  try {
    const provider = await db.aIProvider.create({
      data: {
        userId: req.userId,
        providerType: provider_type,
        name,
        apiBaseUrl: apiBaseUrl,
        apiKey: encryptedKey,
        modelId: model_id,
        isActive: is_active,
        scope,
        workspaceId,
      }
    })
    reply.status(201).send({ ...provider, apiKey: maskKey(provider.apiKey) })
  } catch (dbErr) {
    console.error('DATABASE ERROR IN handleCreateProvider:', dbErr)
    throw dbErr
  }
}

export async function handleUpdateProvider(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  let body: Record<string, unknown>
  try {
    body = validate(aiProviderUpdateSchema, req.body)
  } catch (err) {
    if (err instanceof ValidationError) return sendValidationError(reply, err)
    throw err
  }
  const user = await db.user.findUnique({ where: { id: req.userId } })
  const isOwner = user?.role === 'owner'
  const existing = await db.aIProvider.findFirst({
    where: isOwner ? { id: Number(id) } : { id: Number(id), userId: req.userId },
  })
  if (!existing) {
    reply.status(404).send({ detail: 'Provider not found' })
    return
  }
  const updateData: Record<string, any> = {}
  if (body.name !== undefined) updateData.name = String(body.name)
  if (body.model_id !== undefined) updateData.modelId = String(body.model_id)
  if (body.is_active !== undefined) updateData.isActive = Boolean(body.is_active)
  if (body.api_key !== undefined) {
    updateData.apiKey = encrypt(String(body.api_key))
  }
  
  if (body.api_base_url !== undefined) {
    let apiBaseUrl = String(body.api_base_url).trim().replace(/\/+$/, '')
    if (apiBaseUrl === 'https://api.openai.com') {
      apiBaseUrl = 'https://api.openai.com/v1'
    }
    updateData.apiBaseUrl = apiBaseUrl
  }
  if (body.scope !== undefined) {
    updateData.scope = body.scope
    if (body.scope === 'workspace') {
      const ws = await findWorkspaceByMemberRole(req.userId, 'admin')
      if (!ws) {
        reply.status(403).send({ detail: 'You are not a workspace admin.' })
        return
      }
      updateData.workspaceId = ws.id
    } else if (body.scope === 'personal' || body.scope === 'global') {
      updateData.workspaceId = null
    }
  }

  const updated = await db.aIProvider.update({
    where: isOwner ? { id: Number(id) } : { id: Number(id), userId: req.userId },
    data: updateData,
  })
  reply.send({ ...updated, apiKey: maskKey(updated.apiKey) })
}

export async function handleDeleteProvider(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  const user = await db.user.findUnique({ where: { id: req.userId } })
  const isOwner = user?.role === 'owner'
  const existing = await db.aIProvider.findFirst({
    where: isOwner ? { id: Number(id) } : { id: Number(id), userId: req.userId },
  })
  if (!existing) {
    reply.status(404).send({ detail: 'Provider not found' })
    return
  }
  await db.aIProvider.delete({
    where: isOwner ? { id: Number(id) } : { id: Number(id), userId: req.userId },
  })
  reply.status(204).send()
}

export async function handleGetProviderModels(req: FastifyRequest) {
  const models = await listAvailableModels(req.userId)
  return { models }
}

export async function handleBrowseModels(req: FastifyRequest): Promise<{ models: any[]; families: string[]; total: number }> {
  const { query, family } = req.query as { query?: string; family?: string }
  const models = await searchModels(query, family)
  const families = await getModelFamilies()
  return { models, families, total: models.length }
}

export async function handleBrowseProviders(req: FastifyRequest): Promise<{ providers: any[]; total: number }> {
  const { query } = req.query as { query?: string }
  const providers = await searchProviders(query)
  return { providers, total: providers.length }
}

export async function handleBrowseProviderModels(req: FastifyRequest): Promise<{ providerId: string; models: any[]; total: number }> {
  const { id } = req.params as { id: string }
  const models = await getProviderModels(id)
  return { providerId: id, models, total: models.length }
}

export async function handleTestProvider(req: FastifyRequest) {
  const { api_base_url, api_key, name, model_id } = req.body as { api_base_url: string; api_key?: string; name?: string; model_id?: string }
  const baseURL = await resolveProviderBaseUrl(api_base_url, name)
  try {
    // List models via openai-compatible /v1/models endpoint (Vercel AI SDK tidak punya fungsi ini)
    const modelsUrl = `${baseURL.replace(/\/+$/, '')}/models`

    // Google Gemini API pake x-goog-api-key, bukan Bearer token
    const isGoogle = (name ?? '').toLowerCase().includes('google') ||
                     (name ?? '').toLowerCase().includes('gemini') ||
                     baseURL.includes('generativelanguage.googleapis.com')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (isGoogle) {
      headers['x-goog-api-key'] = api_key ?? ''
    } else {
      headers['Authorization'] = `Bearer ${api_key ?? ''}`
    }

    const res = await fetch(modelsUrl, { headers })
    if (!res.ok) {
      return { status: 'error', detail: `HTTP ${res.status}: ${await res.text()}` }
    }
    const json = await res.json() as Record<string, any>

    // Google native API returns { models: [{ name: "models/gemini-...", ...}] }
    // OpenAI-compatible returns { data: [{ id: "gemini-...", ...}] }
    let models: { id: string }[]
    if (json.models) {
      models = (json.models as { name?: string }[]).map(m => ({
        id: (m.name ?? '').replace(/^models\//, ''),
      }))
    } else if (json.data) {
      models = json.data as { id: string }[]
    } else {
      models = []
    }

    return {
      status: 'ok',
      modelsCount: models.length,
      models: models.slice(0, 10).map((m) => m.id),
    }
  } catch (err) {
    console.error('Provider test error:', err)
    return { status: 'error', detail: 'Failed to test provider. Check credentials and URL.' }
  }
}

/**
 * Qwen Cloud status — built-in provider, checks DASHSCOPE_API_KEY
 */
export async function handleQwenStatus(request: any) {
  const userId = request.user?.id
  const configured = await isQwenAvailable(userId)
  return {
    configured,
    modelsCount: configured ? Object.keys(QWEN_MODELS).length : 0,
  }
}

export async function handleGetQwenConfig(request: any) {
  const userId = request.user?.id
  const key = await getQwenApiKey(userId)
  const { getSetting } = await import('../../core/db-settings.js')
  const scope = await getSetting('qwen_scope') || 'international'
  const chatModel = await getSetting('qwen_chat_model') || QWEN_MODELS.chat
  const audioModel = await getSetting('qwen_audio_model') || QWEN_MODELS.stt
  return {
    apiKey: key ? 'sk-••••••••' + key.slice(-4) : '',
    configured: !!key,
    scope,
    chatModel,
    audioModel,
  }
}

export async function handlePostQwenConfig(request: any, reply: any) {
  const { apiKey, chatModel, audioModel, scope } = request.body as {
    apiKey?: string; chatModel?: string; audioModel?: string; scope?: string
  }

  if (apiKey !== undefined) {
    if (apiKey === '') {
      await deleteSetting('qwen_api_key')
    } else if (!apiKey.startsWith('sk-••••••••')) {
      await setSetting('qwen_api_key', encrypt(apiKey))
    }
  }

  if (chatModel !== undefined) {
    await setSetting('qwen_chat_model', chatModel)
  }

  if (audioModel !== undefined) {
    await setSetting('qwen_audio_model', audioModel)
  }

  if (scope !== undefined) {
    await setSetting('qwen_scope', scope)
  }

  return { status: 'ok', message: 'Qwen configuration updated' }
}

export async function handleGetQwenModels(request: any) {
  const userId = request.user?.id
  const key = await getQwenApiKey(userId)
  const fallbackModels = Object.values(QWEN_MODELS)
  if (!key) {
    return { models: fallbackModels }
  }

  const baseUrl = await getQwenBaseUrl(userId)
  try {
    const url = baseUrl.endsWith('/') ? `${baseUrl}models` : `${baseUrl}/models`
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${key}`
      }
    })
    if (!res.ok) {
      throw new Error(`Status ${res.status}`)
    }
    const data = await res.json() as any
    const models = data.data ? data.data.map((m: any) => m.id) : []

    // Gabungkan dengan fallback models dan urutkan
    const uniqueModels = Array.from(new Set([...models, ...fallbackModels]))
    return { models: uniqueModels }
  } catch (err) {
    console.warn('[QWEN] Failed to fetch live models list from DashScope:', err)
    return { models: fallbackModels }
  }
}
