import type { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '@ghost/database'
import { env } from '@ghost/config'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { memoryStore } from '../../core/memory-store.js'
import { loadWhatsAppCredentials } from '../../core/platform-credentials.js'
import { getUserIdForPlatform, processFileWebhook, triggerAutoReply, socketIO } from './shared.js'
import { timingSafeEqual, createHmac } from 'node:crypto'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

export async function handleWhatsAppVerify(req: FastifyRequest, reply: FastifyReply) {
  const query = req.query as Record<string, string>
  if (query['hub.verify_token'] === env.WHATSAPP_VERIFY_TOKEN) {
    reply.type('text/plain').send(query['hub.challenge'] ?? '')
    return
  }
  return { status: 'verification_failed' }
}

export async function handleWhatsAppWebhook(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as Record<string, unknown>

  const entry = ((body.entry as Record<string, unknown>[])?.[0]) ?? {}
  const changes = ((entry.changes as Record<string, unknown>[])?.[0]) ?? {}
  const value = (changes.value as Record<string, unknown>) ?? {}
  const metadata = (value.metadata as Record<string, unknown>) ?? {}
  const businessPhone = String(metadata.display_phone_number ?? metadata.phone_number_id ?? '')

  const waCreds = await loadWhatsAppCredentials(businessPhone)

  const signature = req.headers['x-hub-signature-256'] as string
  if (waCreds.appSecret) {
    if (!signature) { reply.status(403).send({ detail: 'Missing signature' }); return }
    const rawBody = JSON.stringify(req.body)
    const expected = 'sha256=' + createHmac('sha256', waCreds.appSecret).update(rawBody).digest('hex')
    if (!safeCompare(signature, expected)) {
      reply.status(403).send({ detail: 'Invalid signature' }); return
    }
  }

  try {
    const msgs = (value.messages as Record<string, unknown>[]) ?? []
    if (!msgs.length) return { status: 'ignored' }

    const waMsg = msgs[0]!
    const contact = ((value.contacts as Record<string, unknown>[])?.[0]) ?? {}
    const senderName = ((contact.profile as Record<string, unknown>)?.name as string) ?? ''
    const senderId = waMsg.from as string ?? ''
    const textContent = ((waMsg.text as Record<string, unknown>)?.body as string) ?? ''
    const msgType = waMsg.type as string ?? 'text'
    const userId = await getUserIdForPlatform('whatsapp', businessPhone)

    const message = await db.message.create({
      data: {
        userId,
        platform: 'whatsapp',
        senderId,
        senderName,
        content: textContent,
        messageType: msgType,
        platformMessageId: waMsg.id as string ?? '',
        isOutgoing: false,
      }
    })

    if (['image', 'document', 'audio', 'video'].includes(msgType)) {
      try {
        const mediaPart = waMsg[msgType] as Record<string, unknown> | undefined
        const mediaId = mediaPart?.id as string ?? ''
        if (mediaId && waCreds.accessToken && waCreds.phoneNumberId) {
          const mediaResp = await fetch(`https://graph.facebook.com/v23.0/${mediaId}`, {
            headers: { Authorization: `Bearer ${waCreds.accessToken}` },
          })
          const mediaData = await mediaResp.json() as Record<string, unknown>
          const mediaUrl = mediaData.url as string ?? ''
          const mimeType = mediaData.mime_type as string ?? 'application/octet-stream'
          const fname = (mediaPart?.filename as string) ?? `whatsapp_${mediaId}`
          if (mediaUrl) {
            const fid = await processFileWebhook(userId, mediaUrl, fname, mimeType, {
              Authorization: `Bearer ${waCreds.accessToken}`,
            })
            if (fid) {
              await db.message.update({
                where: { id: message.id },
                data: { fileId: fid }
              })
            }
          }
        }
      } catch { /* file skip */ }
    }

    try {
      const embedding = await generateEmbedding(textContent, userId)
      await memoryStore.addChat(String(message.id), embedding, textContent, {
        sender: senderName,
        platform: 'whatsapp',
        timestamp: '',
        userId: String(userId),
      })
    } catch { /* memory skip */ }

    try {
      socketIO.to(`user:${userId}`).emit('new_message', message)
    } catch { /* ws skip */ }

    if (textContent) triggerAutoReply('whatsapp', senderName, textContent, userId, waCreds)
  } catch (err) { console.error('WhatsApp webhook error:', err) }

  return { status: 'ok' }
}
