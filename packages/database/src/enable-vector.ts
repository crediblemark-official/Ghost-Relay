import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
try {
  await db.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector')
  console.log('pgvector extension enabled')
} catch (e) {
  console.warn('Could not enable pgvector extension (may already exist or no permission):', (e as Error).message)
} finally {
  await db.$disconnect()
}
