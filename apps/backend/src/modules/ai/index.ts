import type { FastifyInstance } from 'fastify'
import {
  handleGetProviders,
  handleCreateProvider,
  handleUpdateProvider,
  handleDeleteProvider,
  handleGetProviderModels,
  handleBrowseModels,
  handleBrowseProviders,
  handleBrowseProviderModels,
  handleTestProvider
} from './handlers.js'

export async function aiModule(app: FastifyInstance): Promise<void> {
  app.get('/ai/providers', { preHandler: [app.authenticate] }, handleGetProviders)
  app.post('/ai/providers', { preHandler: [app.authenticate] }, handleCreateProvider)
  app.put('/ai/providers/:id', { preHandler: [app.authenticate] }, handleUpdateProvider)
  app.delete('/ai/providers/:id', { preHandler: [app.authenticate] }, handleDeleteProvider)

  app.get('/ai/providers/models', { preHandler: [app.authenticate] }, handleGetProviderModels)
  app.get('/ai/models/browse', { preHandler: [app.authenticate] }, handleBrowseModels)
  app.get('/ai/providers/browse', { preHandler: [app.authenticate] }, handleBrowseProviders)
  app.get('/ai/providers/browse/:id/models', { preHandler: [app.authenticate] }, handleBrowseProviderModels)
  app.post('/ai/providers/test', { preHandler: [app.authenticate] }, handleTestProvider)
}
