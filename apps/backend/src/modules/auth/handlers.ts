import type { FastifyRequest, FastifyReply } from 'fastify'
import { auth } from '../../core/auth.js'
import { db } from '@ghost/database'

export async function handleAuthRequest(request: FastifyRequest, reply: FastifyReply) {
  const method = request.method
  const headers = new Headers()
  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        headers.append(key, v)
      }
    } else if (value) {
      headers.set(key, value)
    }
  }

  const url = `${request.protocol}://${request.hostname}${request.url}`
  let body: string | undefined = undefined
  if (['POST', 'PUT', 'PATCH'].includes(method) && request.body) {
    body = JSON.stringify(request.body)
  }

  const webReq = new Request(url, {
    method,
    headers,
    body,
  })

  try {
    const webRes = await auth.handler(webReq)

    reply.status(webRes.status)
    webRes.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        reply.header(key, value)
      }
    })

    return reply.send(await webRes.text())
  } catch (err) {
    console.error(`[AUTH] Error handling ${method} ${request.url}:`, err)
    reply.status(500).send({ error: 'Internal authentication error' })
  }
}

export async function handleUpdateProfile(request: any) {
  const userId = request.user?.id
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const { name, position, department, tonePreference, bio } = request.body as {
    name?: string
    position?: string
    department?: string
    tonePreference?: string
    bio?: string
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(position !== undefined ? { position: position || null } : {}),
      ...(department !== undefined ? { department: department || null } : {}),
      ...(tonePreference !== undefined ? { tonePreference: tonePreference || 'casual' } : {}),
      ...(bio !== undefined ? { bio: bio || null } : {}),
    },
  })

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
    position: updatedUser.position,
    department: updatedUser.department,
    tonePreference: updatedUser.tonePreference,
    bio: updatedUser.bio,
  }
}
