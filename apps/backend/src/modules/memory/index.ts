import type { FastifyInstance } from 'fastify'
import { handleSearchMemory } from './handlers.js'

export async function memoryModule(app: FastifyInstance): Promise<void> {
  app.post('/memory/search', { preHandler: [app.authenticate] }, handleSearchMemory)
}
