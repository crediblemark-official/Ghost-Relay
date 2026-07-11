import { db } from '@ghost/database'

/**
 * Resolve the workspace ID for a given user.
 * Checks membership first, then ownership.
 * Returns null if the user has no workspace.
 */
export async function resolveWorkspaceId(userId: string): Promise<string | null> {
  const member = await db.workspaceMember.findFirst({
    where: { userId },
    select: { workspaceId: true },
  })
  if (member) return member.workspaceId

  const owned = await db.workspace.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  })
  return owned?.id ?? null
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

/**
 * Find the first workspace where the user is a member.
 * Returns the workspace or null.
 */
export async function findWorkspaceByMember(userId: string) {
  const member = await db.workspaceMember.findFirst({
    where: { userId },
    select: { workspaceId: true },
  })
  if (!member) return null
  return db.workspace.findUnique({ where: { id: member.workspaceId } })
}

/**
 * Find the first workspace where the user has a specific role (e.g. 'admin').
 */
export async function findWorkspaceByMemberRole(userId: string, role: string) {
  const member = await db.workspaceMember.findFirst({
    where: { userId, role },
    select: { workspaceId: true },
  })
  if (!member) return null
  return db.workspace.findUnique({ where: { id: member.workspaceId } })
}
