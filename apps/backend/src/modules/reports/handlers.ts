import type { FastifyRequest } from 'fastify'
import { db } from '@ghost/database'
import { summarizeText } from '../../core/ai-chat.js'

export async function handleGetDailyReport(req: FastifyRequest) {
  const { date } = req.query as { date?: string }
  const now = new Date()
  const reportDate = date
    ? new Date(date + 'T00:00:00.000Z')
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const nextDay = new Date(reportDate)
  nextDay.setDate(nextDay.getDate() + 1)

  const rows = await db.message.findMany({
    where: {
      userId: req.userId,
      timestamp: {
        gte: reportDate,
        lt: nextDay,
      },
    },
  })

  const total = rows.length
  const platforms: Record<string, number> = {}
  let outbound = 0, inbound = 0, voiceNotes = 0

  for (const m of rows) {
    platforms[m.platform] = (platforms[m.platform] ?? 0) + 1
    if (m.isOutgoing) outbound++
    else inbound++
    if (m.messageType === 'voice_note' || m.messageType === 'voice_processed')
      voiceNotes++
  }

  let summary: string | null = null
  if (total > 0) {
    const platformStr = Object.entries(platforms).map(([p, c]) => `${p}: ${c}`).join(', ')
    summary = `Laporan ${reportDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}: ${total} pesan (${outbound} terkirim, ${inbound} diterima) dari ${platformStr}. Voice note: ${voiceNotes}.`
  }

  return {
    date: reportDate.toISOString().slice(0, 10),
    totalMessages: total,
    platforms,
    outboundCount: outbound,
    inboundCount: inbound,
    voiceNotes,
    summary,
  }
}

export async function handleGenerateReport(req: FastifyRequest) {
  const now = new Date()
  const reportDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const nextDay = new Date(reportDate)
  nextDay.setDate(nextDay.getDate() + 1)

  const rows = await db.message.findMany({
    where: {
      userId: req.userId,
      timestamp: {
        gte: reportDate,
        lt: nextDay,
      },
    },
  })

  if (!rows.length) return { report: 'Tidak ada aktivitas hari ini.', messageCount: 0 }

  const logLines = rows.map((m: any) => {
    const dir = m.isOutgoing ? '→' : '←'
    const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '??:??'
    return `[${time}] ${dir} [${m.platform}] ${m.senderName ?? ''}: ${m.content ?? '(voice/file)'}`
  })

  const chatLog = logLines.join('\n')
  let report = chatLog
  try {
    report = await summarizeText(`Buat ringkasan aktivitas harian tim dari log chat berikut:\n\n${chatLog}`)
  } catch { /* use raw log */ }

  return { report, messageCount: rows.length }
}

export async function handleEmailReport(req: FastifyRequest) {
  const { date, report } = req.body as { date?: string; report?: string }
  if (!report) {
    return { success: false, error: 'No report content' }
  }

  const user = await db.user.findUnique({ where: { id: req.userId } })
  if (!user?.email) {
    return { success: false, error: 'No email configured for user' }
  }

  // Build email content
  const reportDate = date || new Date().toISOString().slice(0, 10)
  const subject = `Ghost Relay - Laporan Harian ${reportDate}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e11d48;">Ghost Relay Daily Report</h2>
      <p style="color: #64748b;">${reportDate}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <div style="white-space: pre-wrap; line-height: 1.6; color: #334155;">${report}</div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Dikirim otomatis oleh Ghost Relay</p>
    </div>
  `

  try {
    // Try email service if configured
    if (process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY) {
      // Use available email provider
      const { sendEmail } = await import('../../core/email.js').catch(() => ({ sendEmail: null }))
      if (sendEmail) {
        await sendEmail({ to: user.email, subject, html })
        return { success: true }
      }
    }
    return { success: false, error: 'Email service not configured' }
  } catch (err) {
    return { success: false, error: 'Failed to send email' }
  }
}
