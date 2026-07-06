import type { FastifyInstance } from 'fastify'
import { handleAuthRequest } from './handlers.js'

export async function authModule(app: FastifyInstance): Promise<void> {
  app.all('/*', handleAuthRequest)
}
