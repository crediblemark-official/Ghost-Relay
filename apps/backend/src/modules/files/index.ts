import type { FastifyInstance } from 'fastify'
import { setSocketIO, handleGetFiles, handleUploadFile, handleSearchFiles, handleDownloadFile, handleUpdateFileAccess, handleDeleteFile } from './handlers.js'

export async function filesModule(app: FastifyInstance): Promise<void> {
  setSocketIO(app.io)

  app.get('/files', { preHandler: [app.authenticate] }, handleGetFiles)
  app.post('/files/upload', { preHandler: [app.authenticate] }, handleUploadFile)
  app.post('/files/search', { preHandler: [app.authenticate] }, handleSearchFiles)
  app.get('/files/download/:fileId', { preHandler: [app.authenticate] }, handleDownloadFile)
  app.patch('/files/:fileId/access', { preHandler: [app.authenticate] }, handleUpdateFileAccess)
  app.delete('/files/:fileId', { preHandler: [app.authenticate] }, handleDeleteFile)
}
