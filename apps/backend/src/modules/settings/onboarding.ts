import type { FastifyRequest, FastifyReply } from 'fastify'
import { setSetting, invalidateCache } from '../../core/db-settings.js'
import { encrypt } from '../../core/encryption.js'
import { db } from '@ghost/database'

export async function handleOnboarding(req: FastifyRequest, reply: FastifyReply) {
  const {
    workspaceName,
    workspacePurpose,
    workspaceContext,
    invitedEmails,
    aiProvider,
    aiApiKey,
    aiModel,
    aiEmbeddingModel,
    aiAudioModel,
    aiBaseUrl,
  } = req.body as any

  await setSetting('workspace_name', workspaceName || '')
  await setSetting('workspace_purpose', workspacePurpose || '')
  await setSetting('workspace_context', workspaceContext || '')
  await setSetting('workspace_invited_emails', Array.isArray(invitedEmails) ? invitedEmails.join(',') : '')

  if (aiProvider && aiApiKey) {
    const types = ['chat', 'embedding', 'audio']
    for (const type of types) {
      const existing = await db.aIProvider.findFirst({
        where: {
          userId: req.userId,
          providerType: type
        }
      })

      let modelId = aiModel || ''
      if (type === 'embedding') {
        modelId = aiEmbeddingModel || ''
      } else if (type === 'audio') {
        modelId = aiAudioModel || ''
      }

      const payload = {
        userId: req.userId,
        providerType: type,
        name: aiProvider,
        apiBaseUrl: aiBaseUrl || '',
        apiKey: encrypt(aiApiKey),
        modelId,
        isActive: true
      }

      if (existing) {
        await db.aIProvider.update({
          where: { id: existing.id },
          data: payload
        })
      } else {
        await db.aIProvider.create({
          data: payload
        })
      }
    }
  }

  invalidateCache()
  return { status: 'ok' }
}
