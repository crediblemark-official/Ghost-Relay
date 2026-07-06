import type { FastifyInstance } from 'fastify'
import { setSocketIO, handleGetMessages, handleSendMessage, handleSearchMessages } from './handlers.js'

export async function messagesModule(app: FastifyInstance): Promise<void> {
  setSocketIO(app.io)

  app.get('/messages', { preHandler: [app.authenticate] }, handleGetMessages)
  app.post('/messages/send', { preHandler: [app.authenticate] }, handleSendMessage)
  app.post('/messages/search', { preHandler: [app.authenticate] }, handleSearchMessages)
}
