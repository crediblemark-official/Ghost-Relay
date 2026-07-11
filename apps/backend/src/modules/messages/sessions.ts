import type { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '@ghost/database'
import { generateText } from 'ai'
import { getLanguageModel } from '../../core/ai-client.js'
import { generateEmbedding } from '../../core/ai-embedding.js'
import { memoryStore } from '../../core/memory-store.js'

export async function handleGetSessions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.userId
    const sessions = await db.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    const sessionIds = sessions.map(s => s.id)
    if (sessionIds.length === 0) return { sessions: [] }

    const lastMessages = await db.$queryRaw<{ session_id: string; content: string; timestamp: Date }[]>`
      SELECT DISTINCT ON (session_id) session_id, content, timestamp
      FROM messages
      WHERE session_id IN (${sessionIds.join(',')})
      ORDER BY session_id, timestamp DESC
    `
    const lastMsgMap = new Map(lastMessages.map(m => [m.session_id, m]))

    const counts = await db.$queryRaw<{ session_id: string; count: bigint }[]>`
      SELECT session_id, COUNT(*)::bigint as count
      FROM messages
      WHERE session_id IN (${sessionIds.join(',')})
      GROUP BY session_id
    `
    const countMap = new Map(counts.map(c => [c.session_id, Number(c.count)]))

    return {
      sessions: sessions.map(s => ({
        ...s,
        messages: lastMsgMap.has(s.id) ? [lastMsgMap.get(s.id)] : [],
        _count: { messages: countMap.get(s.id) ?? 0 },
      })),
    }
  } catch (err) {
    reply.status(500).send({ detail: 'Failed to fetch sessions' })
  }
}

export async function handleCreateSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.userId
    const session = await db.chatSession.create({
      data: {
        userId,
        title: 'New Chat',
      },
    })
    return session
  } catch (err) {
    reply.status(500).send({ detail: 'Failed to create session' })
  }
}

export async function handleDeleteSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.userId
    const { id } = req.params as { id: string }
    const session = await db.chatSession.findFirst({
      where: { id, userId },
    })
    if (!session) {
      reply.status(404).send({ detail: 'Session not found' })
      return
    }
    // Delete all messages in session first, then session
    await db.message.deleteMany({ where: { sessionId: id } })
    await db.chatSession.delete({ where: { id } })
    return { status: 'ok' }
  } catch (err) {
    reply.status(500).send({ detail: 'Failed to delete session' })
  }
}

export async function handleRenameSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.userId
    const { id } = req.params as { id: string }
    const { title } = req.body as { title: string }
    if (!title || title.trim().length === 0) {
      reply.status(400).send({ detail: 'Title is required' })
      return
    }
    if (title.trim().length > 200) {
      reply.status(400).send({ detail: 'Title must be 200 characters or fewer' })
      return
    }
    const session = await db.chatSession.findFirst({
      where: { id, userId },
    })
    if (!session) {
      reply.status(404).send({ detail: 'Session not found' })
      return
    }
    const updated = await db.chatSession.update({
      where: { id },
      data: { title: title.trim() },
    })
    return updated
  } catch (err) {
    reply.status(500).send({ detail: 'Failed to rename session' })
  }
}

export async function handleGenerateTitle(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.userId
    const { id } = req.params as { id: string }
    const session = await db.chatSession.findFirst({
      where: { id, userId },
    })
    if (!session) {
      reply.status(404).send({ detail: 'Session not found' })
      return
    }

    const messages = await db.message.findMany({
      where: { sessionId: id, isOutgoing: true },
      orderBy: { timestamp: 'asc' },
      take: 3,
      select: { content: true },
    })

    const userMessages = messages
      .filter(m => m.content)
      .map(m => m.content)
      .join('\n')

    if (!userMessages) {
      return { title: 'New Chat' }
    }

    const lm = await getLanguageModel(userId)
    if (!lm) {
      // Fallback: gunakan 40 karakter pertama
      const fallback = userMessages.length > 40 ? userMessages.slice(0, 40) + '...' : userMessages
      await db.chatSession.update({ where: { id }, data: { title: fallback } })
      return { title: fallback }
    }

    const { text } = await generateText({
      model: lm.model,
      system: `Buat judul SINGKAT (maksimal 5 kata, tanpa tanda baca di akhir) untuk percakapan chat berikut.
Judul harus menggambarkan inti/topik percakapan.
Contoh jawaban yang benar: "Rencana Rapat Tim Marketing", "Analisis Penjualan Q3", "Debug Server Error"
JANGAN gunakan tanda kutip atau titik di akhir judul. Hanya judul saja.`,
      prompt: userMessages,
      temperature: 0.3,
      maxOutputTokens: 20,
    })

    const title = text.trim().replace(/['"`.]+$/g, '').slice(0, 60) || 'New Chat'
    await db.chatSession.update({ where: { id }, data: { title } })
    return { title }
  } catch (err) {
    console.error('[sessions] generate-title error:', err)
    // Fallback: jangan gagal, return title default
    return { title: 'New Chat' }
  }
}

export async function handleSummarizeSession(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.userId
    const { id } = req.params as { id: string }
    const session = await db.chatSession.findFirst({
      where: { id, userId },
    })
    if (!session) {
      reply.status(404).send({ detail: 'Session not found' })
      return
    }

    const messages = await db.message.findMany({
      where: { sessionId: id },
      orderBy: { timestamp: 'asc' },
      select: { content: true, senderName: true, isOutgoing: true, senderId: true },
    })

    if (messages.length < 2) {
      return { summary: null }
    }

    const conversation = messages
      .filter(m => m.content)
      .map(m => {
        const role = m.senderId === 'ai-assistant' ? 'AI' : (m.senderName || 'User')
        return `${role}: ${m.content}`
      })
      .join('\n')

    const lm = await getLanguageModel(userId)
    if (!lm) {
      return { summary: null }
    }

    // Jika ada summary lama, gabungkan dengan percakapan baru
    const prevSummary = session.summary
    const prompt = prevSummary
      ? `Summary sebelumnya:\n${prevSummary}\n\nPercakapan baru:\n${conversation}\n\nGabungkan summary di atas dengan percakapan baru. Buat summary yang lebih lengkap dalam Bahasa Indonesia, maksimal 150 kata. Fokus pada: topik utama, keputusan penting, tugas/tindakan, dan preferensi user.`
      : `Ringkas percakapan berikut dalam Bahasa Indonesia, maksimal 150 kata.\nFokus pada: topik utama, keputusan penting, tugas/tindakan, dan preferensi user.\n\n${conversation}`

    const { text } = await generateText({
      model: lm.model,
      system: 'Kamu adalah asisten yang merangkum percakapan. Buat ringkasan yang padat dan informatif. Gunakan poin-poin jika perlu.',
      prompt,
      temperature: 0.2,
      maxOutputTokens: 300,
    })

    const summary = text.trim()
    if (summary) {
      await db.chatSession.update({ where: { id }, data: { summary } })
    }
    return { summary }
  } catch (err) {
    console.error('[sessions] summarize error:', err)
    return { summary: null }
  }
}

/**
 * Retrieve pesan-pesan relevan dari session lain menggunakan vector search.
 * Digunakan oleh stream.ts untuk inject konteks ke AI.
 */
export async function retrieveRelevantMessages(
  userId: string,
  currentSessionId: string,
  query: string,
  topK: number = 5,
): Promise<{ content: string; sessionId: string; title: string }[]> {
  try {
    const queryEmbedding = await generateEmbedding(query, userId)
    const results = await memoryStore.searchChat(queryEmbedding, topK + 10, { userId })

    // Filter: exclude pesan dari session saat ini
    const relevant: { content: string; sessionId: string; title: string }[] = []
    const seen = new Set<string>()

    for (const r of results) {
      if (r.similarity < 0.3) break
      if (r.metadata.sessionId === currentSessionId) continue
      if (seen.has(r.id)) continue
      seen.add(r.id)
      relevant.push({
        content: r.content.slice(0, 500),
        sessionId: r.metadata.sessionId || '',
        title: r.metadata.sessionTitle || '',
      })
      if (relevant.length >= topK) break
    }

    return relevant
  } catch {
    return []
  }
}
