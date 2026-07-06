import type { FastifyInstance } from 'fastify'
import { handleGetDailyReport, handleGenerateReport } from './handlers.js'

export async function reportsModule(app: FastifyInstance): Promise<void> {
  app.get('/reports/daily', { preHandler: [app.authenticate] }, handleGetDailyReport)
  app.post('/reports/generate', { preHandler: [app.authenticate] }, handleGenerateReport)
}
