import type { FastifyInstance } from 'fastify'
import { setSocketIO, handleProcessVoice, handleVoiceCommand, handleVoiceCommandText, handleGetVoiceStatus } from './handlers.js'

export async function voiceModule(app: FastifyInstance): Promise<void> {
  setSocketIO(app.io)

  app.post('/voice/process', { preHandler: [app.authenticate] }, handleProcessVoice)
  app.post('/voice/command', { preHandler: [app.authenticate] }, handleVoiceCommand)
  app.post('/voice/command-text', { preHandler: [app.authenticate] }, handleVoiceCommandText)
  app.get('/voice/status/:id', { preHandler: [app.authenticate] }, handleGetVoiceStatus)
}
