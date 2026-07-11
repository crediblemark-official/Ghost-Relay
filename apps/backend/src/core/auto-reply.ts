import { generateEmbedding } from './ai-embedding.js'
import { generateAutoReply } from './ai-chat.js'
import { memoryStore, type QueryResult } from './memory-store.js'
import { db } from '@ghost/database'

export interface RagResult {
  hasMatch: boolean
  answer: string
  source: string
  cited: string
  context: string[]
  bestMatch: QueryResult | null
}

/**
 * Shared RAG pipeline: embed → search (chat + vault) → filter → generate.
 *
 * Mencari di dua koleksi:
 * 1. Chat memory — histori percakapan sebelumnya
 * 2. Knowledge vault — dokumen/file yang diupload (PDF, teks, dll)
 *
 * Citation format: "Berdasarkan diskusi dengan {sender} pada {date}..."
 */
export async function ragSearchAndReply(
  question: string,
  userId: string,
  workspaceId?: string,
): Promise<RagResult> {
  const emptyResult: RagResult = {
    hasMatch: false,
    answer: '',
    source: '',
    cited: '',
    context: [],
    bestMatch: null,
  }

  try {
    const queryEmbedding = await generateEmbedding(question, userId)

    // Search BOTH collections in parallel
    const vaultWhere = workspaceId
      ? { workspaceIds: [workspaceId] }
      : { userId: String(userId) }

    const [chatMatches, vaultMatches] = await Promise.all([
      memoryStore.searchChat(queryEmbedding, 5, { userId: String(userId) }),
      memoryStore.searchVault(queryEmbedding, 5, vaultWhere),
    ])

    // Combine & filter by similarity threshold
    const allMatches = [
      ...chatMatches.map(m => ({ ...m, _source: 'chat' as const })),
      ...vaultMatches.map(m => ({ ...m, _source: 'vault' as const })),
    ]
    const filtered = allMatches
      .filter((m) => m.similarity >= 0.6)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)

    if (!filtered.length) return emptyResult

    // Build context with source labels
    const context = filtered.map((m) => {
      const prefix = m._source === 'vault'
        ? `[Knowledge Vault: ${m.metadata.filename ?? 'dokumen'}]`
        : `[Chat: ${m.metadata.sender ?? 'unknown'} di ${m.metadata.platform ?? 'unknown'}]`
      return `${prefix}\n${m.content}`
    })

    const answer = await generateAutoReply(question, context, userId)
    const best = filtered[0]!

    // Build cited sumber — format sesuai PRD: "Berdasarkan diskusi dengan {sender} pada {date}"
    let source: string
    let citationText: string
    if (best._source === 'vault') {
      source = `Knowledge Vault: ${best.metadata.filename ?? 'dokumen'}`
      citationText = `Berdasarkan dokumen "${best.metadata.filename ?? 'dokumen'}"`
    } else {
      const sender = best.metadata.sender ?? 'unknown'
      const platform = best.metadata.platform ?? 'unknown'
      const timestamp = best.metadata.timestamp
      let dateStr = ''
      if (timestamp) {
        try {
          const d = new Date(timestamp)
          dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        } catch { /* skip */ }
      }
      source = `${sender} di ${platform}`
      citationText = dateStr
        ? `Berdasarkan diskusi dengan @${sender} pada ${dateStr}`
        : `Berdasarkan diskusi dengan @${sender}`
    }
    const cited = `${answer}\n\n— ${citationText}`

    // Log auto-reply untuk anti-spam tracking
    try {
      await db.autoReplyLog.create({
        data: {
          userId,
          question,
          answer,
          source,
          similarity: best.similarity,
        },
      })
    } catch { /* log skip */ }

    return {
      hasMatch: true,
      answer,
      source,
      cited,
      context,
      bestMatch: best,
    }
  } catch (err) {
    console.error('[ragSearchAndReply] Error:', err)
    return emptyResult
  }
}
