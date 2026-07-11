import type { FastifyRequest, FastifyReply } from 'fastify'
import type { Server as SocketIOServer } from 'socket.io'
import { db } from '@ghost/database'
import { env } from '@ghost/config'
import { join, resolve } from 'node:path'
import { writeFile, readFile, mkdir, access } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { sanitizeFilename, isAllowedMimeType, MAX_FILE_SIZE, extractText } from '../../core/file-utils.js'
import { classifyFolder, captionImage } from '../../core/ai-classify.js'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { memoryStore } from '../../core/memory-store.js'
import { eventBus } from '../../core/event-bus.js'
import { validate, sendValidationError, ValidationError } from '../../core/validation.js'
import { fileSearchSchema } from '@ghost/shared'
import { resolveAllWorkspaceIds } from '../../core/workspace.js'

export let socketIO: SocketIOServer

export function setSocketIO(io: SocketIOServer) {
  socketIO = io
}

export async function handleGetFiles(req: FastifyRequest) {
  const { page = '1', page_size = '50', folder } = req.query as Record<string, string>
  const pageNum = Math.max(1, Number(page))
  const limit = Math.min(200, Math.max(1, Number(page_size)))
  const offset = (pageNum - 1) * limit

  const workspaceIds = await resolveAllWorkspaceIds(req.userId)

  // Workspace files: accessScope='workspace' in same workspace
  // Private files: only own files with accessScope='private'
  const filter: any = {
    OR: [
      // Workspace-scoped files visible to all workspace members
      ...(workspaceIds.length > 0 ? [{ workspaceId: { in: workspaceIds }, accessScope: 'workspace' }] : []),
      // My own files only (both workspace and private — private already limited by userId)
      { userId: req.userId, accessScope: 'private' },
      // My own workspace files (deduplicated but needed for correctness)
      ...(workspaceIds.length > 0 ? [{ userId: req.userId, accessScope: 'workspace' }] : []),
    ],
  }
  if (folder) filter.folder = folder

  const rows = await db.file.findMany({
    where: filter,
    orderBy: { uploadedAt: 'desc' },
    skip: offset,
    take: limit,
  })

  const userIds = [...new Set(rows.map(r => r.userId))]
  const users = userIds.length > 0
    ? await db.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
    : []
  const userMap = new Map(users.map(u => [u.id, u]))

  return rows.map(r => ({
    id: r.id,
    userId: r.userId,
    uploaderName: userMap.get(r.userId)?.name || userMap.get(r.userId)?.email || 'Unknown',
    originalName: r.originalName,
    storageUrl: r.storageUrl,
    fileType: r.fileType,
    folder: r.folder,
    sizeBytes: Number(r.sizeBytes),
    uploadedAt: r.uploadedAt,
    extractedText: r.extractedText,
    accessScope: r.accessScope || 'workspace',
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

  const workspaceId = req.workspaceId
  const storageBase = workspaceId
    ? join(env.STORAGE_DIR, workspaceId, req.userId)
    : join(env.STORAGE_DIR, req.userId)
  await mkdir(storageBase, { recursive: true })

  const safeName = `${randomUUID().replace(/-/g, '')}_${sanitizeFilename(filename)}`
  const filePath = join(storageBase, safeName)
  await writeFile(filePath, buffer)

  const rawScope = (req.headers['x-access-scope'] as string) || 'workspace'
  const accessScope = rawScope === 'private' ? 'private' : 'workspace'

  const file = await db.file.create({
    data: {
      userId: req.userId,
      workspaceId: workspaceId || null,
      originalName: sanitizeFilename(filename),
      storageUrl: filePath,
      fileType: mimeType,
      sizeBytes: BigInt(buffer.length),
      accessScope,
    }
  })

  indexFileInBackground(file.id)

  reply.status(201).send({
    ...file,
    sizeBytes: Number(file.sizeBytes),
    accessScope: file.accessScope,
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

  const workspaceIds = await resolveAllWorkspaceIds(userId)

  const matches = await memoryStore.searchVault(
    await generateEmbedding(query, userId),
    Math.min(limit, 50),
    workspaceIds.length > 0 ? { workspaceIds } : { userId: String(userId) },
  )

  const fileIds = matches.map(m => Number(m.id)).filter(id => !Number.isNaN(id))
  const fileMap = new Map<number, any>()
  if (fileIds.length > 0) {
    const fileFilter: any = workspaceIds.length > 0
      ? { workspaceId: { in: workspaceIds }, id: { in: fileIds } }
      : { userId, id: { in: fileIds } }
    const fileRows = await db.file.findMany({
      where: fileFilter,
    })

    const fUserIds = [...new Set(fileRows.map(f => f.userId))]
    const fUsers = fUserIds.length > 0
      ? await db.user.findMany({ where: { id: { in: fUserIds } }, select: { id: true, name: true, email: true } })
      : []
    const fUserMap = new Map(fUsers.map(u => [u.id, u]))

    for (const f of fileRows) {
      fileMap.set(f.id, { ...f, _user: fUserMap.get(f.userId) ?? null })
    }
  }
  const currentUserId = String(userId)
  const results: any[] = []
  for (const m of matches) {
    const fileId = Number(m.id)
    const file = !Number.isNaN(fileId) ? fileMap.get(fileId) : undefined
      if (file) {
        // Private files: only show to owner
        if (file.accessScope === 'private' && file.userId !== currentUserId) continue
        results.push({
        id: file.id,
        userId: file.userId,
        uploaderName: (file as any)._user?.name || (file as any)._user?.email || 'Unknown',
        originalName: file.originalName,
        storageUrl: file.storageUrl,
        fileType: file.fileType,
        folder: file.folder ?? 'Lainnya',
        sizeBytes: Number(file.sizeBytes),
        uploadedAt: file.uploadedAt.toISOString(),
        extractedText: (m.content ?? '').slice(0, 500),
        accessScope: file.accessScope === 'private' ? 'private' : 'workspace',
      })
    } else {
      results.push({
        id: fileId,
        userId,
        uploaderName: 'Unknown',
        originalName: String(m.metadata.filename ?? ''),
        storageUrl: '',
        fileType: '',
        folder: String(m.metadata.folder ?? 'Lainnya'),
        sizeBytes: 0,
        uploadedAt: new Date().toISOString(),
        extractedText: (m.content ?? '').slice(0, 500),
        accessScope: 'all',
      })
    }
  }

  reply.send(results)
}

export async function handleDownloadFile(req: FastifyRequest, reply: FastifyReply) {
  const { fileId } = req.params as { fileId: string }
  const workspaceIds = await resolveAllWorkspaceIds(req.userId)
  const fileFilter: any = workspaceIds.length > 0
    ? { id: Number(fileId), workspaceId: { in: workspaceIds } }
    : { id: Number(fileId), userId: req.userId }
  const file = await db.file.findFirst({ where: fileFilter })
  if (!file) {
    reply.status(404).send({ detail: 'File not found' })
    return
  }
  const resolvedStorage = resolve(file.storageUrl)
  const storageRoot = resolve(env.STORAGE_DIR)
  if (!resolvedStorage.startsWith(storageRoot + '/') && resolvedStorage !== storageRoot) {
    reply.status(403).send({ detail: 'Access denied' })
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

export async function handleUpdateFileAccess(req: FastifyRequest, reply: FastifyReply) {
  const { fileId } = req.params as { fileId: string }
  const { accessScope } = (req.body ?? {}) as { accessScope?: string }

  if (!accessScope || (accessScope !== 'workspace' && accessScope !== 'private')) {
    reply.status(400).send({ detail: 'accessScope must be "workspace" or "private"' })
    return
  }

  const file = await db.file.findFirst({ where: { id: Number(fileId) } })
  if (!file) {
    reply.status(404).send({ detail: 'File not found' })
    return
  }

  // Authorization: only file owner can change access scope
  if (file.userId !== req.userId) {
    reply.status(403).send({ detail: 'Only the file owner can change access scope' })
    return
  }

  const updated = await db.file.update({
    where: { id: file.id },
    data: { accessScope },
  })

  return { id: updated.id, accessScope: updated.accessScope }
}

export async function indexFileInBackground(fileId: number): Promise<void> {
  try {
    const file = await db.file.findFirst({ where: { id: fileId } })
    if (!file) return
    let extracted = await extractText(file.storageUrl, file.originalName)

    // Use vision model for image files
    const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
    if (IMAGE_TYPES.includes(file.fileType) && !extracted) {
      try {
        const { readFile } = await import('node:fs/promises')
        const buffer = await readFile(file.storageUrl)
        const base64 = buffer.toString('base64')
        const caption = await captionImage(base64, file.fileType, file.userId)
        if (caption) extracted = caption
      } catch { /* fallback to empty */ }
    }

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
      ...(file.workspaceId ? { workspaceId: file.workspaceId } : {}),
    })
    try {
      socketIO?.to(`user:${file.userId}`).emit('file_indexed', { fileId, status: 'completed', folder })
    } catch { /* ws skip */ }
    eventBus.emit('file:indexed', { fileId, status: 'completed', folder })
  } catch (err) {
    console.error('File indexing failed:', err)
  }
}

export async function handleDeleteFile(req: FastifyRequest, reply: FastifyReply) {
  const { fileId } = req.params as { fileId: string }

  const workspaceIds = await resolveAllWorkspaceIds(req.userId)
  const fileFilter: any = workspaceIds.length > 0
    ? { id: Number(fileId), workspaceId: { in: workspaceIds } }
    : { id: Number(fileId), userId: req.userId }

  const file = await db.file.findFirst({ where: fileFilter })
  if (!file) {
    reply.status(404).send({ detail: 'File not found' })
    return
  }

  // Only owner or workspace admin can delete
  const isOwner = file.userId === req.userId
  if (!isOwner && file.workspaceId) {
    // Check if user is workspace admin
    const membership = await db.workspaceMember.findFirst({
      where: { workspaceId: file.workspaceId, userId: req.userId, role: 'admin' },
    })
    if (!membership) {
      reply.status(403).send({ detail: 'Only file owner or workspace admin can delete' })
      return
    }
  } else if (!isOwner) {
    reply.status(403).send({ detail: 'Only file owner can delete' })
    return
  }

  // Delete from disk
  try {
    const { unlink } = await import('node:fs/promises')
    await unlink(file.storageUrl)
  } catch { /* file may already be gone */ }

  // Delete from memory store
  try {
    await memoryStore.remove(String(file.id))
  } catch { /* memory cleanup best-effort */ }

  // Delete from DB
  await db.file.delete({ where: { id: file.id } })

  return { ok: true }
}
