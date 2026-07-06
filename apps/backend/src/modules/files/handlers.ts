import type { FastifyRequest, FastifyReply } from 'fastify'
import type { Server as SocketIOServer } from 'socket.io'
import { db } from '@ghost/database'
import { env } from '@ghost/config'
import { join } from 'node:path'
import { writeFile, readFile, mkdir, access } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { sanitizeFilename, isAllowedMimeType, MAX_FILE_SIZE, extractText } from '../../core/file-utils.js'
import { classifyFolder } from '../../core/ai-classify.js'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { memoryStore } from '../../core/memory-store.js'
import { eventBus } from '../../core/event-bus.js'
import { validate, sendValidationError, ValidationError } from '../../core/validation.js'
import { fileSearchSchema } from '@ghost/shared'

export let socketIO: SocketIOServer

export function setSocketIO(io: SocketIOServer) {
  socketIO = io
}

export async function handleGetFiles(req: FastifyRequest) {
  const { page = '1', page_size = '50', folder } = req.query as Record<string, string>
  const pageNum = Math.max(1, Number(page))
  const limit = Math.min(200, Math.max(1, Number(page_size)))
  const offset = (pageNum - 1) * limit
  const userId = req.userId

  const filter: any = { userId }
  if (folder) filter.folder = folder

  const rows = await db.file.findMany({
    where: filter,
    orderBy: { uploadedAt: 'desc' },
    skip: offset,
    take: limit,
  })

  return rows.map(r => ({
    ...r,
    sizeBytes: Number(r.sizeBytes)
  }))
}

export async function handleUploadFile(req: FastifyRequest, reply: FastifyReply) {
  const data = await req.file()
  if (!data) {
    reply.status(400).send({ detail: 'No file provided' })
    return
  }

  const buffer = await data.toBuffer()
  const mimeType = data.mimetype ?? 'application/octet-stream'
  const filename = data.filename ?? 'unnamed'

  if (!isAllowedMimeType(mimeType) && mimeType !== 'application/octet-stream') {
    reply.status(400).send({ detail: `File type '${mimeType}' is not allowed` })
    return
  }

  if (buffer.length === 0) {
    reply.status(400).send({ detail: 'File is empty' })
    return
  }
  if (buffer.length > MAX_FILE_SIZE) {
    reply.status(413).send({ detail: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB` })
    return
  }

  const userDir = join(env.STORAGE_DIR, String(req.userId))
  await mkdir(userDir, { recursive: true })

  const safeName = `${randomUUID().replace(/-/g, '')}_${sanitizeFilename(filename)}`
  const filePath = join(userDir, safeName)
  await writeFile(filePath, buffer)

  const file = await db.file.create({
    data: {
      userId: req.userId,
      originalName: sanitizeFilename(filename),
      storageUrl: filePath,
      fileType: mimeType,
      sizeBytes: BigInt(buffer.length),
    }
  })

  indexFileInBackground(file.id)

  reply.status(201).send({
    ...file,
    sizeBytes: Number(file.sizeBytes)
  })
}

export async function handleSearchFiles(req: FastifyRequest, reply: FastifyReply) {
  let body: { query: string; limit?: number }
  try {
    body = validate(fileSearchSchema, req.body)
  } catch (err) {
    if (err instanceof ValidationError) return sendValidationError(reply, err)
    throw err
  }
  const { query, limit = 10 } = body
  const userId = req.userId
  const matches = await memoryStore.searchVault(
    await generateEmbedding(query, userId),
    Math.min(limit, 50),
    { userId: String(userId) },
  )

  const fileIds = matches.map(m => Number(m.id)).filter(id => !Number.isNaN(id))
  const fileMap = new Map<number, any>()
  if (fileIds.length > 0) {
    const fileRows = await db.file.findMany({
      where: {
        userId,
        id: { in: fileIds },
      },
    })
    for (const f of fileRows) {
      fileMap.set(f.id, f)
    }
  }
  const results = matches.map(m => {
    const fileId = Number(m.id)
    const file = !Number.isNaN(fileId) ? fileMap.get(fileId) : undefined
    if (file) {
      return {
        id: file.id,
        userId: file.userId,
        originalName: file.originalName,
        storageUrl: file.storageUrl,
        fileType: file.fileType,
        folder: file.folder ?? 'Lainnya',
        sizeBytes: Number(file.sizeBytes),
        uploadedAt: file.uploadedAt.toISOString(),
        extractedText: (m.content ?? '').slice(0, 500),
      }
    }
    return {
      id: fileId,
      userId,
      originalName: String(m.metadata.filename ?? ''),
      storageUrl: '',
      fileType: '',
      folder: String(m.metadata.folder ?? 'Lainnya'),
      sizeBytes: 0,
      uploadedAt: new Date().toISOString(),
      extractedText: (m.content ?? '').slice(0, 500),
    }
  })

  reply.send(results)
}

export async function handleDownloadFile(req: FastifyRequest, reply: FastifyReply) {
  const { fileId } = req.params as { fileId: string }
  const file = await db.file.findFirst({
    where: {
      id: Number(fileId),
      userId: req.userId,
    },
  })
  if (!file) {
    reply.status(404).send({ detail: 'File not found' })
    return
  }
  try {
    await access(file.storageUrl)
  } catch {
    reply.status(404).send({ detail: 'File not found on disk' })
    return
  }
  const content = await readFile(file.storageUrl)
  reply.header('Content-Type', file.fileType || 'application/octet-stream')
  reply.header('Content-Disposition', `attachment; filename="${file.originalName}"`)
  reply.send(content)
}

export async function indexFileInBackground(fileId: number): Promise<void> {
  try {
    const file = await db.file.findFirst({ where: { id: fileId } })
    if (!file) return
    const extracted = await extractText(file.storageUrl, file.originalName)
    const folder = await classifyFolder(file.originalName, '')
    await db.file.update({
      where: { id: fileId },
      data: { folder, extractedText: extracted.slice(0, 5000) }
    })
    const embedding = await generateEmbedding(extracted || file.originalName, file.userId)
    await memoryStore.addFile(String(fileId), embedding, extracted || file.originalName, {
      filename: file.originalName,
      folder,
      userId: String(file.userId),
    })
    try {
      socketIO.to(`user:${file.userId}`).emit('file_indexed', { fileId, status: 'completed', folder })
    } catch { /* ws skip */ }
    eventBus.emit('file:indexed', { fileId, status: 'completed', folder })
  } catch (err) {
    console.error('File indexing failed:', err)
  }
}
