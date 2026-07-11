import type { FastifyRequest, FastifyReply } from 'fastify'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { memoryStore } from '../../core/memory-store.js'
import { validate, sendValidationError, ValidationError } from '../../core/validation.js'
import { memorySearchSchema } from '@ghost/shared'

export async function handleSearchMemory(req: FastifyRequest, reply: FastifyReply) {
  let body: { query: string; top_k?: number }
  try {
    body = validate(memorySearchSchema, req.body)
  } catch (err) {
    if (err instanceof ValidationError) return sendValidationError(reply, err)
    throw err
  }
  const { query, top_k = 3 } = body
  let queryEmbedding: number[]
  try {
    queryEmbedding = await generateEmbedding(query, req.userId)
  } catch (err) {
    reply.status(400).send({ detail: (err as Error).message || 'AI provider not configured for embedding' })
    return
  }

  const searchWhere: Record<string, string> = req.workspaceId
    ? { workspaceId: req.workspaceId }
    : { userId: String(req.userId) }
  const matches = await memoryStore.searchChat(queryEmbedding, Math.min(top_k, 50), searchWhere)
  const results = matches.map(m => ({
    content: m.content,
    sender: m.metadata.sender ?? '',
    platform: m.metadata.platform ?? '',
    similarity: m.similarity,
  }))
  return { query, results }
}
