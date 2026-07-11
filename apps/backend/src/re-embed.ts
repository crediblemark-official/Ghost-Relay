import { PrismaClient } from '../../../node_modules/.bun/@prisma+client@6.19.3/node_modules/@prisma/client/index.js'
import { embed } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { decrypt } from './core/encryption.js'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) { console.error('DATABASE_URL env var is required'); process.exit(1) }
const db = new PrismaClient({ datasources: { db: { url: dbUrl } } })

async function reEmbed() {
  const providers: any[] = await db.$queryRawUnsafe(
    `SELECT api_key, model_id FROM ai_providers WHERE provider_type = 'embedding' AND is_active = true LIMIT 1`
  ) as any[]
  if (!providers.length) { console.log('No embedding provider'); process.exit(1) }

  const apiKey = decrypt(providers[0].api_key)
  const modelId = providers[0].model_id || 'gemini-embedding-001'

  console.log(`Model: ${modelId}`)

  const google = createGoogleGenerativeAI({ apiKey })
  const model = google.embedding(modelId)

  // Get actual dimension from first test
  const { embedding: testEmb } = await embed({ model, value: 'test' })
  const dim = testEmb.length
  console.log(`Embedding dimension: ${dim}`)

  const rows: any[] = await db.$queryRawUnsafe(`SELECT id, document FROM embeddings WHERE embedding IS NULL`) as any[]
  console.log(`Re-embedding ${rows.length} documents...`)

  let ok = 0, fail = 0
  for (const row of rows) {
    try {
      const text = (row.document || '').slice(0, 8000)
      if (!text.trim()) { fail++; continue }
      const { embedding } = await embed({ model, value: text })
      
      // Escape single quotes in vector string for SQL
      const vecStr = `[${embedding.join(',')}]`
      
      // Use template literal to avoid Prisma parameterized query issues with vector type
      await db.$executeRawUnsafe(
        `UPDATE embeddings SET embedding = '${vecStr}'::vector(${dim}) WHERE id = ${row.id}`
      )
      ok++
      if (ok % 10 === 0) console.log(`  ${ok}/${rows.length}`)
    } catch (e: any) {
      console.error(`  Fail ${row.id}:`, e.message?.slice(0, 150))
      fail++
    }
  }
  console.log(`Done! ${ok} ok, ${fail} failed`)
  const c: any[] = await db.$queryRawUnsafe(`SELECT count(*) as total, count(embedding) as with_vec FROM embeddings`) as any[]
  console.log('Verify:', c[0])
  await db.$disconnect()
}

reEmbed().catch(console.error)
