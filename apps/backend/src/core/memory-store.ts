import { db } from '@ghost/database'

export interface QueryResult {
  id: string
  content: string
  metadata: Record<string, string>
  similarity: number
}

class PersistentVectorStore {
  private vecToSQL(vec: number[]): string {
    return `[${vec.join(',')}]`
  }

  async addChat(
    id: string,
    embedding: number[],
    document: string,
    metadata: Record<string, string>,
  ): Promise<void> {
    const vecStr = this.vecToSQL(embedding)
    const dim = embedding.length
    const metaJson = JSON.stringify(metadata)

    await db.$executeRawUnsafe(
      `INSERT INTO embeddings (reference_id, collection, document, embedding, metadata, user_id, created_at)
       VALUES ($1, 'chat_memory', $2, '${vecStr}'::vector(${dim}), $3::jsonb, $4, NOW())
       ON CONFLICT (reference_id, collection)
       DO UPDATE SET document = $2, embedding = '${vecStr}'::vector(${dim}), metadata = $3::jsonb`,
      id, document, metaJson, metadata.userId ?? '',
    )
  }

  async searchChat(
    queryEmbedding: number[],
    topK: number,
    where?: Record<string, string>,
  ): Promise<QueryResult[]> {
    const vecStr = this.vecToSQL(queryEmbedding)
    const dim = queryEmbedding.length

    let metaFilter = ''
    const params: any[] = [topK]
    let paramIdx = 2

    if (where?.workspaceId) {
      metaFilter = `AND metadata->>'workspaceId' = $${paramIdx++}`
      params.push(where.workspaceId)
    } else if (where?.userId) {
      metaFilter = `AND user_id = $${paramIdx++}`
      params.push(where.userId)
    }

    const sql = `
      SELECT reference_id as id, document as content, metadata,
             1 - (embedding <=> '${vecStr}'::vector(${dim})) as similarity
      FROM embeddings
      WHERE collection = 'chat_memory' ${metaFilter}
      ORDER BY embedding <=> '${vecStr}'::vector(${dim})
      LIMIT $1
    `

    const rows = await db.$queryRawUnsafe<any>(sql, ...params)
    return rows.map((row: any) => ({
      id: row.id,
      content: row.content,
      metadata: (row.metadata ?? {}) as Record<string, string>,
      similarity: Number(row.similarity),
    }))
  }

  async addFile(
    id: string,
    embedding: number[],
    document: string,
    metadata: Record<string, string>,
  ): Promise<void> {
    const vecStr = this.vecToSQL(embedding)
    const dim = embedding.length
    const metaJson = JSON.stringify(metadata)

    await db.$executeRawUnsafe(
      `INSERT INTO embeddings (reference_id, collection, document, embedding, metadata, user_id, created_at)
       VALUES ($1, 'knowledge_vault', $2, '${vecStr}'::vector(${dim}), $3::jsonb, $4, NOW())
       ON CONFLICT (reference_id, collection)
       DO UPDATE SET document = $2, embedding = '${vecStr}'::vector(${dim}), metadata = $3::jsonb`,
      id, document, metaJson, metadata.userId ?? '',
    )
  }

  async searchVault(
    queryEmbedding: number[],
    topK: number,
    where?: { workspaceIds?: string[]; userId?: string },
  ): Promise<QueryResult[]> {
    const vecStr = this.vecToSQL(queryEmbedding)
    const dim = queryEmbedding.length
    const { workspaceIds, userId } = where ?? {}

    let metaFilter = ''
    const params: any[] = [topK + 20]
    let paramIdx = 2

    if (workspaceIds && workspaceIds.length > 0) {
      const wsPlaceholders = workspaceIds.map(() => `$${paramIdx++}`).join(',')
      metaFilter = `AND metadata->>'workspaceId' IN (${wsPlaceholders})`
      params.push(...workspaceIds)
    } else if (userId) {
      metaFilter = `AND user_id = $${paramIdx++}`
      params.push(userId)
    }

    const sql = `
      SELECT reference_id as id, document as content, metadata,
             1 - (embedding <=> '${vecStr}'::vector(${dim})) as similarity
      FROM embeddings
      WHERE collection = 'knowledge_vault' ${metaFilter}
      ORDER BY embedding <=> '${vecStr}'::vector(${dim})
      LIMIT $1
    `

    const rows = await db.$queryRawUnsafe<any>(sql, ...params)
    return rows.slice(0, topK).map((row: any) => ({
      id: row.id,
      content: row.content,
      metadata: (row.metadata ?? {}) as Record<string, string>,
      similarity: Number(row.similarity),
    }))
  }

  async remove(id: string): Promise<void> {
    await db.$executeRawUnsafe(
      `DELETE FROM embeddings WHERE reference_id = $1 AND collection = 'knowledge_vault'`,
      id,
    )
  }
}

export const memoryStore = new PersistentVectorStore()
