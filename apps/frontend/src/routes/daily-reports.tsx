import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { 
  BarChart3, Send, Inbox, Mic, RefreshCw, 
  Brain, ChevronLeft, ChevronRight, AlertCircle, 
  Copy, Check, Mail, Sparkles
} from 'lucide-react'

export const Route = createFileRoute('/daily-reports')({
  component: DailyReportsPage,
})

interface DailyStats {
  date: string
  totalMessages: number
  platforms: Record<string, number>
  outboundCount: number
  inboundCount: number
  voiceNotes: number
  summary: string | null
}

const PLATFORM_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  slack: 'Slack',
  web: 'Web',
}

const PLATFORM_COLORS: Record<string, string> = {
  whatsapp: 'bg-green-500/10 text-green-600 border-green-500/20',
  telegram: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  slack: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  web: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatDateID(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function DailyReportsPage() {
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()))
  const [reportContent, setReportContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Fetch report stats for date
  const { data: stats, isLoading, isError, refetch, isFetching } = useQuery<DailyStats>({
    queryKey: ['daily-report', selectedDate],
    queryFn: () => api.get(`/reports/daily?date=${selectedDate}`, { silent: true }),
  })

  // Set initial text if backend already generated summary
  useEffect(() => {
    if (stats?.summary) {
      setReportContent(stats.summary)
    } else {
      setReportContent(null)
    }
  }, [stats])

  // AI Summary Generator mutation
  const generateMutation = useMutation({
    mutationFn: () => api.post<{ report: string; messageCount: number }>('/reports/generate'),
    onSuccess: (data) => {
      setReportContent(data.report)
      toast.success('Ringkasan AI berhasil dibuat!')
    },
    onError: () => {
      toast.error('Gagal membuat ringkasan AI')
    }
  })

  // Email sender mutation
  const emailMutation = useMutation({
    mutationFn: () => api.post('/reports/email', { date: selectedDate, report: reportContent }),
    onSuccess: () => {
      toast.success('Laporan harian dikirim ke email Anda.')
    },
    onError: () => {
      toast.error('Gagal mengirim laporan ke email')
    },
  })

  const copyToClipboard = async () => {
    if (!reportContent) return
    try {
      await navigator.clipboard.writeText(reportContent)
      setCopied(true)
      toast.success('Ringkasan disalin ke clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin ringkasan')
    }
  }

  const changeDay = (delta: number) => {
    const d = new Date(selectedDate + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + delta)
    setSelectedDate(formatDate(d))
    setReportContent(null)
  }

  const goToday = () => {
    setSelectedDate(formatDate(new Date()))
    setReportContent(null)
  }

  const isToday = selectedDate === formatDate(new Date())

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      {/* Header Banner */}
      <div className="shrink-0 border-b border-border/60 bg-gradient-to-r from-primary/5 via-background to-background backdrop-blur-md relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
        <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 px-5 py-2.5">
          {/* Left Section: Title & Description */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Laporan Harian <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold font-sans uppercase">Daily Reports</span>
            </h1>
            <div className="hidden md:block h-3.5 w-px bg-border" />
            <p className="text-[11px] text-muted-foreground">
              Log data statistik aktivitas platform harian tim dan ringkasan otomatis kecerdasan AI.
            </p>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Day Navigation */}
            <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg p-0.5">
              <button
                onClick={() => changeDay(-1)}
                className="rounded p-1 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Hari Sebelumnya"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-semibold text-foreground px-1">
                {formatDateID(selectedDate)}
              </span>
              <button
                onClick={() => changeDay(1)}
                disabled={isToday}
                className="rounded p-1 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
                title="Hari Berikutnya"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {!isToday && (
              <button
                onClick={goToday}
                className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-semibold text-primary transition-colors"
              >
                Hari Ini
              </button>
            )}

            <div className="hidden sm:block h-3.5 w-px bg-border" />

            {/* Copy */}
            <button
              onClick={copyToClipboard}
              disabled={!reportContent}
              className="flex h-8 items-center gap-1.5 px-3 rounded-lg border border-border bg-card hover:bg-accent text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors"
              title="Salin Ringkasan"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            {/* Email */}
            <button
              onClick={() => emailMutation.mutate()}
              disabled={!reportContent || emailMutation.isPending}
              className="flex h-8 items-center gap-1.5 px-3 rounded-lg border border-border bg-card hover:bg-accent text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors"
              title="Kirim Laporan ke Email"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Kirim Email</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
              title="Muat Ulang"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20 gap-3">
          <RefreshCw className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs">Mengambil data statistik laporan...</p>
        </div>
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-red-500 py-20 gap-2">
          <AlertCircle className="h-8 w-8" />
          <p className="text-xs font-semibold">Gagal memuat data laporan harian.</p>
        </div>
      ) : stats ? (
        <div className="flex-1 bg-muted/20 overflow-y-auto">
          <div className="max-w-6xl w-full mx-auto px-5 py-5 flex flex-col md:flex-row gap-5 items-stretch min-h-[calc(100vh-170px)]">
            
            {/* Left Column: Stats & Platform Breakdown */}
            <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Total messages */}
                <div className="p-3 rounded-lg border border-border bg-card/65 shadow-sm flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">Total</p>
                    <p className="text-base font-bold text-foreground">{stats.totalMessages}</p>
                  </div>
                </div>

                {/* Sent messages */}
                <div className="p-3 rounded-lg border border-border bg-card/65 shadow-sm flex items-center gap-3">
                  <Send className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">Terkirim</p>
                    <p className="text-base font-bold text-foreground">{stats.outboundCount}</p>
                  </div>
                </div>

                {/* Received messages */}
                <div className="p-3 rounded-lg border border-border bg-card/65 shadow-sm flex items-center gap-3">
                  <Inbox className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">Diterima</p>
                    <p className="text-base font-bold text-foreground">{stats.inboundCount}</p>
                  </div>
                </div>

                {/* Voice notes count */}
                <div className="p-3 rounded-lg border border-border bg-card/65 shadow-sm flex items-center gap-3">
                  <Mic className="h-5 w-5 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">VN (Suara)</p>
                    <p className="text-base font-bold text-foreground">{stats.voiceNotes}</p>
                  </div>
                </div>
              </div>

              {/* Platform breakdown */}
              {Object.keys(stats.platforms).length > 0 && (
                <div className="p-4 rounded-lg border border-border bg-card/65 shadow-sm space-y-3">
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wide block">Rincian Saluran</span>
                  <div className="h-px bg-border" />
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.platforms).map(([platform, count]) => (
                      <span
                        key={platform}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-tight ${PLATFORM_COLORS[platform] || 'bg-muted text-muted-foreground'}`}
                      >
                        {PLATFORM_LABELS[platform] || platform}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state alert */}
              {stats.totalMessages === 0 && !reportContent && (
                <div className="p-4 rounded-lg border border-border bg-card/65 shadow-sm text-center text-xs text-muted-foreground flex flex-col items-center justify-center py-10">
                  <AlertCircle className="h-5 w-5 text-muted-foreground/40 mb-2" />
                  Tidak ada aktivitas pengiriman obrolan pada tanggal ini.
                </div>
              )}
            </div>

            {/* Right Column: AI Summary Sheet */}
            <div className="flex-1 flex flex-col rounded-lg border border-border bg-card/85 backdrop-blur-md shadow-sm overflow-hidden min-h-[500px]">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-border bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-rose-500" />
                  <h2 className="text-xs font-bold text-foreground">Ringkasan Otomatis AI (AI Summary)</h2>
                </div>
                {stats.totalMessages > 0 && !reportContent && (
                  <button
                    disabled={generateMutation.isPending}
                    onClick={() => generateMutation.mutate()}
                    className="flex h-7 items-center gap-1 px-2.5 rounded border border-rose-200 bg-rose-500/5 hover:bg-rose-500/10 text-[10px] text-rose-600 font-bold uppercase transition-colors"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Menganalisis...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>Buat Ringkasan</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Panel Body */}
              <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap select-text selection:bg-rose-500/10 bg-background/5">
                {reportContent ? (
                  <div className="max-w-none text-xs text-muted-foreground leading-relaxed">
                    <p className="bg-muted/30 border border-border/60 p-4 rounded-lg text-foreground font-medium text-xs shadow-sm bg-gradient-to-br from-rose-50/20 to-orange-50/20">
                      {reportContent}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                    <Brain className="h-8 w-8 opacity-20 mb-2" />
                    <p className="text-xs">Laporan ringkasan AI belum dibuat untuk hari ini.</p>
                    {stats.totalMessages > 0 && (
                      <p className="text-[10px] text-muted-foreground/60 mt-1">Silakan klik tombol "Buat Ringkasan" di atas untuk menganalisis aktivitas.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  )
}
