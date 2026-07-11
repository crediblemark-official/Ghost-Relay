import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { db } from '@ghost/database'

async function authAndOwner(req: FastifyRequest, reply: FastifyReply) {
  const user = await db.user.findUnique({ where: { id: req.userId } })
  if (!user) {
    reply.status(401).send({ detail: 'Invalid or expired session' })
    return
  }
  if (user.role !== 'owner') {
    reply.status(403).send({ detail: 'Platform owner access required' })
    return
  }
}

export async function adminModule(app: FastifyInstance): Promise<void> {
  // Untuk owner login: cek role user (hanya auth, tanpa requireOwner)
  app.get('/admin/check', { preHandler: [app.authenticate] }, async (req: FastifyRequest) => {
    const user = await db.user.findUnique({ where: { id: req.userId } })
    return { role: user?.role ?? 'user' }
  })

  app.get('/admin/workspaces', { preHandler: [app.authenticate, authAndOwner] }, async () => {
    const workspaces = await db.workspace.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const ownerIds = [...new Set(workspaces.map(w => w.ownerId))]
    const owners = ownerIds.length > 0
      ? await db.user.findMany({ where: { id: { in: ownerIds } }, select: { id: true, name: true, email: true } })
      : []
    const ownerMap = new Map(owners.map(o => [o.id, o]))

    const workspaceIds = workspaces.map(w => w.id)
    const memberCounts = workspaceIds.length > 0
      ? await db.$queryRaw<{ workspaceId: string; count: bigint }[]>`
          SELECT workspace_id as "workspaceId", COUNT(*)::bigint as count
          FROM workspace_members
          WHERE workspace_id IN (${workspaceIds.join(',')})
          GROUP BY workspace_id
        `
      : []
    const countMap = new Map(memberCounts.map(r => [r.workspaceId, Number(r.count)]))

    return {
      workspaces: workspaces.map(w => ({
        id: w.id,
        name: w.name,
        owner: ownerMap.get(w.ownerId) ?? null,
        memberCount: countMap.get(w.id) ?? 0,
        inviteCode: w.inviteCode,
        createdAt: w.createdAt,
      })),
    }
  })

  app.get('/admin/users', { preHandler: [app.authenticate, authAndOwner] }, async () => {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const userIds = users.map(u => u.id)
    const memberCounts = userIds.length > 0
      ? await db.$queryRaw<{ userId: string; count: bigint }[]>`
          SELECT user_id as "userId", COUNT(*)::bigint as count
          FROM workspace_members
          WHERE user_id IN (${userIds.join(',')})
          GROUP BY user_id
        `
      : []
    const countMap = new Map(memberCounts.map(r => [r.userId, Number(r.count)]))

    return {
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        workspaceCount: countMap.get(u.id) ?? 0,
        createdAt: u.createdAt,
      })),
    }
  })
}
