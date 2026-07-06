import type { FastifyInstance } from 'fastify'
import { handleGetEnv, handlePostEnv, handleDeleteEnv } from './env.js'
import { handleOnboarding } from './onboarding.js'
import { handleFetchModels, handleModelsCatalog } from './models-catalog.js'

export async function settingsModule(app: FastifyInstance): Promise<void> {
  app.get('/settings/env', { preHandler: [app.authenticate] }, handleGetEnv)
  app.post('/settings/env', { preHandler: [app.authenticate] }, handlePostEnv)
  app.delete('/settings/env/:key', { preHandler: [app.authenticate] }, handleDeleteEnv)

  app.post('/settings/onboarding', { preHandler: [app.authenticate] }, handleOnboarding)
  app.post('/settings/fetch-models', { preHandler: [app.authenticate] }, handleFetchModels)
  app.get('/settings/models-catalog', { preHandler: [app.authenticate] }, handleModelsCatalog)
}
