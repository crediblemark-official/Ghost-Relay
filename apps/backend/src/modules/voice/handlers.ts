import type { FastifyRequest, FastifyReply } from 'fastify'
import type { Server as SocketIOServer } from 'socket.io'
import { db } from '@ghost/database'
import { transcribeAudio } from '../../core/ai-audio.js'
import { summarizeText } from '../../core/ai-chat.js'
import { decomposeTasks, extractIntent } from '../../core/ai-classify.js'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { platformService } from '../../core/platform-service.js'
import { memoryStore } from '../../core/memory-store.js'
import { validate, sendValidationError, ValidationError } from '../../core/validation.js'
import { voiceCommandTextSchema } from '@ghost/shared'
import { writeFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'
import { resolveWorkspaceId } from '../../core/workspace.js'
import { eventBus } from '../../core/event-bus.js'
import { getSetting } from '../../core/db-settings.js'

export let socketIO: SocketIOServer

export function setSocketIO(io: SocketIOServer) {
  socketIO = io
}

export async function handleProcessVoice(req: FastifyRequest, reply: FastifyReply) {
  const data = await req.file()
  if (!data) {
    reply.status(400).send({ detail: 'No audio file provided' })
    return
  }
  const buffer = await data.toBuffer()
  const ext = data.filename?.split('.').pop() ?? 'webm'
  const tmpPath = join(tmpdir(), `${randomUUID()}.${ext}`)
  await writeFile(tmpPath, buffer)

  const user = await db.user.findFirst({ where: { id: req.userId } })
  const msg = await db.message.create({
    data: {
      userId: req.userId,
      platform: 'web',
      senderId: String(req.userId),
      senderName: user?.name ?? '',
      content: '[Voice note processing...]',
      messageType: 'voice_note',
      isOutgoing: true,
    }
  })

  processVoiceNote(req.userId, msg.id, tmpPath).catch(() => {}).finally(() => {
    unlink(tmpPath).catch(() => {})
  })

  reply.status(202).send({ id: msg.id, status: 'processing' })
}

export async function handleVoiceCommand(req: FastifyRequest, reply: FastifyReply) {
  try {
    const contentType = req.headers['content-type'] ?? ''
    let text: string | null = null

    if (contentType.includes('multipart')) {
      const data = await req.file()
      if (data) {
        const buffer = await data.toBuffer()
        const ext = data.filename?.split('.').pop() ?? 'webm'
        const tmpPath = join(tmpdir(), `${randomUUID()}.${ext}`)
        await writeFile(tmpPath, buffer)
        try {
          text = await transcribeAudio(tmpPath, req.userId)
        } finally {
          await unlink(tmpPath).catch(() => {})
        }
      }
    } else if (contentType.includes('json')) {
      const body = req.body as { text?: string }
      text = body.text ?? null
    }

    if (!text) {
      reply.status(400).send({ detail: 'No speech content' })
      return
    }

    const intent = await extractIntent(text, req.userId)

    // FP-4: voice command hanya auto-send jika diaktifkan oleh user
    const autoSend = await getSetting('voice_command_enabled', 'false')
    if (!intent.error && autoSend === 'true') {
      const platform = (intent.platform ?? 'All').toLowerCase()
      const messageText = intent.message ?? text
      const receiver = intent.receiver ?? ''
      if (platform !== 'all' && platform !== '') {
        await platformService.sendMessage(platform, receiver, messageText)
      }
    }

    reply.send({ status: 'ok', intent, original_text: text })
  } catch (err) {
    const msg = (err as Error).message ?? String(err)
    console.error(`[VOICE] Command error: ${msg}`)
    reply.status(500).send({ detail: `Voice command failed: ${msg}` })
  }
}

export async function handleVoiceCommandText(req: FastifyRequest, reply: FastifyReply) {
  try {
    let body: { text: string }
    try {
      body = validate(voiceCommandTextSchema, req.body)
    } catch (err) {
      if (err instanceof ValidationError) return sendValidationError(reply, err)
      throw err
    }
    const { text } = body
    if (!text) {
      reply.status(400).send({ detail: 'No text provided' })
      return
    }
    const intent = await extractIntent(text, req.userId)

    // FP-4: voice command hanya auto-send jika diaktifkan oleh user
    const autoSend = await getSetting('voice_command_enabled', 'false')
    if (!intent.error && autoSend === 'true') {
      const platform = (intent.platform ?? 'All').toLowerCase()
      const messageText = intent.message ?? text
      if (platform !== 'all' && platform !== '') {
        await platformService.sendMessage(platform, intent.receiver ?? '', messageText)
      }
    }
    reply.send({ status: 'ok', intent, original_text: text })
  } catch (err) {
    const msg = (err as Error).message ?? String(err)
    console.error(`[VOICE] Command text error: ${msg}`)
    reply.status(500).send({ detail: `Voice command failed: ${msg}` })
  }
}

export async function handleGetVoiceStatus(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  const msg = await db.message.findFirst({
    where: {
      id: Number(id),
      userId: req.userId,
    },
  })
  if (!msg) {
    reply.status(404).send({ detail: 'Voice note not found' })
    return
  }
  if (msg.messageType === 'voice_note') {
    reply.send({ id: msg.id, status: 'processing' })
    return
  }
  reply.send({ id: msg.id, status: 'completed', transcription: msg.content })
}

export async function processVoiceNote(userId: string, messageId: number, audioPath: string): Promise<void> {
  try {
    const rawText = await transcribeAudio(audioPath, userId)
    await unlink(audioPath).catch(() => {})

    if (!rawText) {
      await db.message.update({
        where: { id: messageId },
        data: { content: '[Voice note: no speech detected]', messageType: 'voice_processed' },
      })
      return
    }

    const summary = await summarizeText(rawText)
    const tasks = await decomposeTasks(rawText)

    let display = rawText
    if (summary) display = `📝 ${summary}\n\n${rawText}`
    const taskList = (tasks?.daftar_tugas as unknown[]) ?? []
    if (taskList.length > 0) {
      const taskLines = (taskList as Record<string, string>[]).map(t =>
        `  • [${t.prioritas ?? '?'}] ${t.divisi ?? 'general'}: ${t.deskripsi ?? ''}`
      )
      display += '\n\n📋 Tugas:\n' + taskLines.join('\n')
    }

    await db.message.update({
      where: { id: messageId },
      data: {
        content: display,
        messageType: 'voice_processed',
        metadata: {
          transcription: rawText,
          summary: summary || null,
          tasks: taskList.length > 0 ? {
            ringkasan: tasks?.ringkasan || summary || '',
            tanggal_deadline: tasks?.tanggal_deadline || null,
            daftar_tugas: taskList,
          } : null,
        } as any,
      },
    })

    try {
      socketIO?.to(`user:${userId}`).emit('voice_processed', { id: messageId, status: 'completed', transcription: rawText, summary })
    } catch { /* ws skip */ }

    eventBus.emit('voice:processed', { id: messageId, status: 'completed', transcription: rawText, summary })

    // FP-5: Send per-division notifications for decomposed tasks
    const taskItems = (tasks?.daftar_tugas as Record<string, string>[]) ?? []
    if (taskItems.length > 0) {
      const divisionChannelSetting = await getSetting('division_notification_channels', '{}') ?? '{}'
      let divisionChannels: Record<string, string> = {}
      try { divisionChannels = JSON.parse(divisionChannelSetting) } catch { /* noop */ }

      for (const task of taskItems) {
        const division = task.divisi ?? 'general'
        const channel = divisionChannels[division]
        if (channel) {
          const priorityEmoji = task.prioritas === 'tinggi' ? '🔴' : task.prioritas === 'sedang' ? '🟡' : '🟢'
          const notifText = `${priorityEmoji} [${division.toUpperCase()}] ${task.deskripsi}\nDeadline: ${tasks?.tanggal_deadline || 'Tidak ditentukan'}`
          try {
            await platformService.sendMessage(channel, '', notifText)
          } catch { /* platform skip */ }
        }
      }
    }

    try {
      const embedding = await generateEmbedding(rawText, userId)
      const wsId = await resolveWorkspaceId(userId)
      await memoryStore.addChat(String(messageId), embedding, rawText, {
        sender: 'User',
        platform: 'web',
        timestamp: String(Date.now()),
        userId: String(userId),
        ...(wsId ? { workspaceId: wsId } : {}),
      })
    } catch { /* memory skip */ }
  } catch (err) {
    console.error('Voice note processing failed:', err)
    await db.message.update({
      where: { id: messageId },
      data: { content: `[Voice note processing failed: ${(err as Error).message}]`, messageType: 'voice_processed' },
    }).catch(() => {})
  }
}
