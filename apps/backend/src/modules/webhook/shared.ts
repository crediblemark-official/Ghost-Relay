import type { Server as SocketIOServer } from 'socket.io'
import { db } from '@ghost/database'
import { env } from '@ghost/config'
import { join } from 'node:path'
import { writeFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { generateAutoReply } from '../../core/ai-chat.js'
import { memoryStore } from '../../core/memory-store.js'

export let socketIO: SocketIOServer

export function setSocketIO(io: SocketIOServer) {
  socketIO = io
}

export async function getUserIdForPlatform(platform: string, platformUserId?: string): Promise<number> {
  const conditions: any = { platform, isActive: true }
  if (platformUserId) {
    conditions.platformUserId = platformUserId
  }
  const conn = await db.platformConnection.findFirst({
    where: conditions,
  })
  if (!conn) {
    const detail = platformUserId
      ? `No active platform connection found for '${platform}' with id '${platformUserId}'`
      : `No active platform connection found for '${platform}'`
    throw new Error(detail)
  }
  return conn.userId
}

export async function processFileWebhook(
  userId: number,
  fileUrl: string,
  originalName: string,
  fileType: string,
  httpHeaders?: Record<string, string>,
): Promise<number | null> {
  try {
    const resp = await fetch(fileUrl, { headers: { ...httpHeaders } })
    if (!resp.ok) return null
    const content = Buffer.from(await resp.arrayBuffer())
    const ext = originalName.split('.').pop() ?? 'bin'
    const storageDir = join(env.STORAGE_DIR, String(userId))
    await mkdir(storageDir, { recursive: true })
    const storagePath = join(storageDir, `${randomUUID().replace(/-/g, '')}.${ext}`)
    await writeFile(storagePath, content)
    const file = await db.file.create({
      data: {
        userId,
        originalName,
        storageUrl: storagePath,
        fileType,
        sizeBytes: BigInt(content.length),
      }
    })
    return file.id
  } catch {
    return null
  }
}

export async function triggerAutoReply(
  platform: string,
  sender: string,
  question: string,
  userId: number,
  creds?: unknown,
): Promise<void> {
  try {
    const queryEmbedding = await generateEmbedding(question, userId)
    const matches = await memoryStore.searchChat(queryEmbedding, 3, { userId: String(userId) })
    const filtered = matches.filter(m => m.similarity >= 0.6)
    if (!filtered.length) return

    const context = filtered.map(m => m.content)
    const answer = await generateAutoReply(question, context)
    const best = filtered[0]!
    const meta = best.metadata as any
    const source = `${meta.sender ?? 'unknown'} di ${meta.platform ?? platform}`
    const autoReplyData = { status: 'found', answer, source, sender, platform, originalQuestion: question }

    try {
      socketIO.to(`user:${userId}`).emit('auto_reply', autoReplyData)
    } catch { /* ws skip */ }

    if (answer) {
      const cited = `${answer}\n\n— Sumber: ${source}`
      const { platformService } = await import('../../core/platform-service.js')
      await platformService.sendMessage(platform, sender, cited, creds as any)
    }
  } catch (err) {
    console.error('Auto reply failed:', err)
  }
}
