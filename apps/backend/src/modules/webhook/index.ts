import type { FastifyInstance } from 'fastify'
import { setSocketIO } from './shared.js'
import { handleTelegramWebhook } from './telegram.js'
import { handleWhatsAppVerify, handleWhatsAppWebhook } from './whatsapp.js'
import { handleSlackWebhook } from './slack.js'

export async function webhookModule(app: FastifyInstance): Promise<void> {
  // Inisialisasi socketIO instance agar bisa digunakan oleh sub-handlers
  setSocketIO(app.io)

  app.post('/webhook/telegram', handleTelegramWebhook)
  app.get('/webhook/whatsapp', handleWhatsAppVerify)
  app.post('/webhook/whatsapp', handleWhatsAppWebhook)
  app.post('/webhook/slack', handleSlackWebhook)
}
