import type { FastifyInstance } from 'fastify'
import { setSocketIO, handleGetMessages, handleSendMessage, handleSearchMessages, handleClearMessages, handleDeleteMessage, handleGetTasks, handleUpdateTaskStatus } from './handlers.js'
import { handleGetSessions, handleCreateSession, handleDeleteSession, handleRenameSession, handleGenerateTitle, handleSummarizeSession } from './sessions.js'

export async function messagesModule(app: FastifyInstance): Promise<void> {
  setSocketIO(app.io)

  // Session routes
  app.get('/sessions', { preHandler: [app.authenticate] }, handleGetSessions)
  app.post('/sessions', { preHandler: [app.authenticate] }, handleCreateSession)
  app.delete('/sessions/:id', { preHandler: [app.authenticate] }, handleDeleteSession)
  app.patch('/sessions/:id', { preHandler: [app.authenticate] }, handleRenameSession)
  app.post('/sessions/:id/generate-title', { preHandler: [app.authenticate] }, handleGenerateTitle)
  app.post('/sessions/:id/summarize', { preHandler: [app.authenticate] }, handleSummarizeSession)

  // Message routes
  app.get('/messages', { preHandler: [app.authenticate] }, handleGetMessages)
  app.post('/messages/send', { preHandler: [app.authenticate] }, handleSendMessage)
  app.post('/messages/search', { preHandler: [app.authenticate] }, handleSearchMessages)
  app.post('/messages/clear', { preHandler: [app.authenticate] }, handleClearMessages)
  app.delete('/messages/:id', { preHandler: [app.authenticate] }, handleDeleteMessage)

  // Task routes
  app.get('/tasks', { preHandler: [app.authenticate] }, handleGetTasks)
  app.put('/tasks/status', { preHandler: [app.authenticate] }, handleUpdateTaskStatus)
}
