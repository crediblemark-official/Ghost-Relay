import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Clipboard, Mail, RefreshCw, Calendar, 
  FileText, MessageSquare, AlertCircle, Sparkles
} from 'lucide-react'

export const Route = createFileRoute('/things-matter')({
  component: ThingsMatterPage,
})

interface ReportResponse {
  report: string
  messageCount: number
  date: string
}

function ThingsMatterPage() {
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Set default date to local YYYY-MM-DD
  useEffect(() => {
    const today = new Date()
    const offset = today.getTimezoneOffset()
    const localToday = new Date(today.getTime() - (offset * 60 * 1000))
    setSelectedDate(localToday.toISOString().split('T')[0])
  }, [])

  // Query to fetch 5W1H report
  const { data, isLoading, refetch, isFetching } = useQuery<ReportResponse>({
    queryKey: ['things-matter-report', selectedDate],
    queryFn: () => api.get(`/reports/things-matter?date=${selectedDate}`),
    enabled: !!selectedDate,
  })

  // Mutation to send report via email
  const emailMutation = useMutation({
    mutationFn: (args: { date: string; report: string }) =>
      api.post('/reports/email', args),
    onSuccess: (res: any) => {
      if (res?.success) {
        toast.success('Laporan berhasil dikirim', {
          description: 'Laporan 5W1H telah dikirim ke email Anda.',
        })
      } else {
        toast.error('Gagal mengirim email', {
          description: res?.error || 'Pastikan SMTP/email provider sudah dikonfigurasi di Settings.',
        })
      }
    },
    onError: () => {
      toast.error('Gagal mengirim email laporan')
    },
  })

  const handleCopy = () => {
    if (!data?.report) return
    navigator.clipboard.writeText(data.report)
    toast.success('Laporan disalin', {
      description: 'Laporan 5W1H telah disalin ke clipboard Anda.',
    })
  }

  const handleEmailSend = () => {
    if (!data?.report || !selectedDate) return
    emailMutation.mutate({ date: selectedDate, report: data.report })
  }

  // Simple Markdown to HTML formatter to render headings and bullets
  const renderMarkdown = (text: string) => {
    if (!text) return ''
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('###')) {
        return <h4 key={i} className="text-xs font-bold text-foreground mt-4 mb-1.5 uppercase tracking-wide border-b border-border/50 pb-0.5">{trimmed.replace('###', '').trim()}</h4>
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={i} className="text-sm font-bold text-foreground mt-5 mb-2 border-b border-border pb-1">{trimmed.replace('##', '').trim()}</h3>
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={i} className="text-base font-bold text-foreground mt-6 mb-3">{trimmed.replace('#', '').trim()}</h2>
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return (
          <li key={i} className="text-xs text-muted-foreground list-disc ml-4 my-1 leading-relaxed">
            {trimmed.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        )
      }
      // Simple bold match replacement
      if (trimmed === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-xs text-muted-foreground leading-relaxed my-1.5">{trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
    })
  }

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      {/* Header Banner */}
      <div className="shrink-0 border-b border-border bg-card/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 px-5 py-2.5">
          {/* Left Section: Title & Description */}
          <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
            <h1 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Things & Matter <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">5W1H Report</span>
            </h1>
            <div className="hidden md:block h-3.5 w-px bg-border" />
            <p className="text-[11px] text-muted-foreground">
              Laporan harian otomatis berformat 5W1H diurai dari log aktivitas koordinasi obrolan tim.
            </p>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Calendar Picker */}
            <div className="relative flex items-center">
              <Calendar className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-8 pl-8 pr-2.5 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all cursor-pointer"
              />
            </div>

            <div className="hidden sm:block h-3.5 w-px bg-border" />

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              disabled={!data?.report || isLoading}
              className="flex h-8 items-center gap-1.5 px-3 rounded-lg border border-border bg-card hover:bg-accent text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors"
              title="Salin Laporan"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Salin</span>
            </button>

            {/* Email Button */}
            <button
              onClick={handleEmailSend}
              disabled={!data?.report || isLoading || emailMutation.isPending}
              className="flex h-8 items-center gap-1.5 px-3 rounded-lg border border-border bg-card hover:bg-accent text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors"
              title="Kirim ke Email"
            >
              <Mail className={`h-3.5 w-3.5 ${emailMutation.isPending ? 'animate-pulse' : ''}`} />
              <span>Kirim Email</span>
            </button>

            {/* Regenerate/Refresh */}
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

      {/* Main Content Pane */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20 gap-3">
          <RefreshCw className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs">Menganalisis log obrolan & membuat laporan 5W1H via Qwen LLM...</p>
        </div>
      ) : (
        <div className="flex-1 bg-muted/20 overflow-y-auto">
          <div className="max-w-6xl w-full mx-auto px-5 py-5 flex flex-col md:flex-row gap-5 items-stretch min-h-[calc(100vh-170px)]">
            
            {/* Left Column: Summary Info card */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
              <div className="p-4 rounded-lg border border-border bg-card/65 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Statistik Hari Ini</span>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Pesan:</span>
                    <span className="font-semibold text-foreground">{data?.messageCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal Laporan:</span>
                    <span className="font-semibold text-foreground">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-semibold text-foreground">5W1H (Bahasa Indonesia)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/65 shadow-sm text-[11px] text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-primary" /> Apa itu 5W1H?
                </p>
                Metode analisis terstruktur yang mengidentifikasi: **What** (apa), **Who** (siapa), **Where** (di mana), **When** (kapan), **Why** (mengapa), dan **How** (bagaimana) dalam proses koordinasi tim Anda.
              </div>
            </div>

            {/* Right Column: Dynamic Report Paper Sheet */}
            <div className="flex-1 flex flex-col rounded-lg border border-border bg-card/85 backdrop-blur-md shadow-sm overflow-hidden min-h-[500px]">
              {/* Paper Header */}
              <div className="px-6 py-4 border-b border-border bg-card/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h2 className="text-xs font-bold text-foreground">Draft Laporan 5W1H</h2>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {selectedDate}.md
                </span>
              </div>

              {/* Paper Body */}
              <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap select-text selection:bg-primary/20 bg-background/5">
                {data?.messageCount === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                    <MessageSquare className="h-8 w-8 opacity-20 mb-2" />
                    <p className="text-xs">Tidak ada aktivitas pesan obrolan untuk tanggal {selectedDate}.</p>
                  </div>
                ) : (
                  <div className="max-w-none prose prose-sm prose-slate dark:prose-invert">
                    {renderMarkdown(data?.report || '')}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}
