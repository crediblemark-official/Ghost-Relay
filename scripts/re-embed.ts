import { PrismaClient } from '../node_modules/.bun/@prisma+client@6.19.3/node_modules/@prisma/client/index.js'
import { embed } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { decrypt } from '../apps/backend/src/core/encryption.js'

const db = new PrismaClient({ datasources: { db: { url: 'postgresql://ghost:changeme@localhost:5433/ghost_relay' } } })

async function reEmbed() {
  const providers = await db.$queryRawUnsafe(
    `SELECT api_key, model_id FROM ai_providers WHERE provider_type = 'embedding' AND is_active = true LIMIT 1`
  )
  if (!providers.length) { console.log('No embedding provider'); process.exit(1) }

  const apiKey = decrypt(providers[0].api_key)
  const modelId = providers[0].model_id || 'gemini-embedding-001'

  const google = createGoogleGenerativeAI({ apiKey })
  const model = google.embedding(modelId)

  const rows = await db.$queryRawUnsafe(`SELECT id, document FROM embeddings WHERE embedding IS NULL`)
  console.log(`Re-embedding ${rows.length} documents with model ${modelId}...`)

  let ok = 0, fail = 0
  for (const row of rows) {
    try {
      const text = (row.document || '').slice(0, 8000)
      if (!text.trim()) { fail++; continue }
      const { embedding } = await embed({ model, value: text })
      const vecStr = `[${embedding.join(',')}]`
      await db.$executeRawUnsafe(`UPDATE embeddings SET embedding = $1::vector WHERE id = $2`, vecStr, row.id)
      ok++
      if (ok % 10 === 0) console.log(`  ${ok}/${rows.length}`)
    } catch (e: any) {
      console.error(`  Fail ${row.id}:`, e.message?.slice(0, 100))
      fail++
    }
  }
  console.log(`Done! ${ok} ok, ${fail} failed`)
  const c = await db.$queryRawUnsafe(`SELECT count(*) as total, count(embedding) as with_vec FROM embeddings`)
  console.log('Verify:', c[0])
  await db.$disconnect()
}

reEmbed().catch(console.error)
