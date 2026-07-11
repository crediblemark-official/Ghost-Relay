import type { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '@ghost/database'
import { resolveAllWorkspaceIds } from '../../core/workspace.js'

export async function handleGetNotifications(req: FastifyRequest) {
  const notifications = await db.notification.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const senderIds = [...new Set(notifications.map(n => n.senderId))]
  const senders = senderIds.length > 0
    ? await db.user.findMany({ where: { id: { in: senderIds } }, select: { id: true, name: true, email: true } })
    : []
  const senderMap = new Map(senders.map(s => [s.id, s]))

  return notifications.map(n => ({
    ...n,
    sender: senderMap.get(n.senderId) ?? null,
  }))
}

export async function handleGetUnreadCount(req: FastifyRequest) {
  const count = await db.notification.count({
    where: { userId: req.userId, readAt: null },
  })
  return { count }
}

export async function handleMarkRead(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  if (id === 'all') {
    await db.notification.updateMany({
      where: { userId: req.userId, readAt: null },
      data: { readAt: new Date() },
    })
    return { status: 'ok' }
  }
  const notification = await db.notification.findFirst({
    where: { id: Number(id), userId: req.userId },
  })
  if (!notification) {
    reply.status(404).send({ detail: 'Notification not found' })
    return
  }
  await db.notification.update({
    where: { id: Number(id) },
    data: { readAt: new Date() },
  })
  return { status: 'ok' }
}

export async function handleSendNotification(req: FastifyRequest, reply: FastifyReply) {
  const { userId: targetUserId, type, title, message, link } = req.body as {
    userId: string
    type?: string
    title: string
    message?: string
    link?: string
  }

  // Input validation
  if (!targetUserId || typeof targetUserId !== 'string') {
    reply.status(400).send({ detail: 'userId is required' })
    return
  }
  if (!title || typeof title !== 'string' || title.length > 200) {
    reply.status(400).send({ detail: 'title is required (max 200 chars)' })
    return
  }
  const allowedTypes = ['info', 'broadcast', 'task', 'mention']
  if (type && !allowedTypes.includes(type)) {
    reply.status(400).send({ detail: `type must be one of: ${allowedTypes.join(', ')}` })
    return
  }

  // Authorization: target user must be in the same workspace
  const senderWorkspaces = await resolveAllWorkspaceIds(req.userId)
  const targetWorkspaces = await resolveAllWorkspaceIds(targetUserId)
  const sharedWorkspace = senderWorkspaces.some(ws => targetWorkspaces.includes(ws))
  if (!sharedWorkspace && req.userId !== targetUserId) {
    reply.status(403).send({ detail: 'Cannot send notifications to users outside your workspace' })
    return
  }

  const targetUser = await db.user.findUnique({ where: { id: targetUserId } })
  if (!targetUser) {
    reply.status(404).send({ detail: 'Target user not found' })
    return
  }
  const notif = await db.notification.create({
    data: {
      userId: targetUserId,
      senderId: req.userId,
      type: type || 'info',
      title,
      message,
      link,
    },
  })
  const server = req.server
  if ((server as any).emitToUser) {
    ;(server as any).emitToUser(targetUserId, 'new_notification', notif)
  }
  return { status: 'ok', id: notif.id }
}
