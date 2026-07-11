import { db } from '@ghost/database'

/**
 * Resolve the workspace ID for a given user.
 * Checks ownership first, then membership.
 * Returns null if the user has no workspace.
 */
export async function resolveWorkspaceId(userId: string): Promise<string | null> {
  const owned = await db.workspace.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  })
  if (owned) return owned.id

  const member = await db.workspace.findFirst({
    where: { members: { some: { userId } } },
    select: { id: true },
  })
  return member?.id ?? null
}

/**
 * Resolve ALL workspace IDs the user has access to (owned + member).
 */
export async function resolveAllWorkspaceIds(userId: string): Promise<string[]> {
  const owned = await db.workspace.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  })

  const memberships = await db.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  })

  const ids = new Set<string>()
  if (owned) ids.add(owned.id)
  for (const m of memberships) ids.add(m.workspaceId)
  return Array.from(ids)
}
