import type { FastifyInstance } from 'fastify'
import { handleGetDailyReport, handleGenerateReport, handleEmailReport } from './handlers.js'

export async function reportsModule(app: FastifyInstance): Promise<void> {
  app.get('/reports/daily', { preHandler: [app.authenticate] }, handleGetDailyReport)
  app.post('/reports/generate', { preHandler: [app.authenticate] }, handleGenerateReport)
  app.post('/reports/email', { preHandler: [app.authenticate] }, handleEmailReport)
}
