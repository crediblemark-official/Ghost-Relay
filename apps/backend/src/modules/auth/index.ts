import type { FastifyInstance } from 'fastify'
import { handleAuthRequest, handleUpdateProfile } from './handlers.js'

export async function authModule(app: FastifyInstance): Promise<void> {
  app.post('/auth/update-profile', { preHandler: [app.authenticate] }, handleUpdateProfile)
  app.all('/*', handleAuthRequest)
}
