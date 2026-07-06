import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { api } from '@/lib/api'

export function DailyReportsCard() {
  const handleGenerate = async () => {
    const res = await api.post<{ report: string }>('/reports/generate')
    alert(res.report)
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold flex items-center text-slate-800">
          <FileText className="h-5 w-5 inline mr-2 text-rose-500" />
          Daily Reports
        </h3>
      </div>
      <div className="pt-2">
        <p className="text-sm text-slate-500 mb-4">
          Generate AI-powered daily activity summaries from message histories across all connected channels.
        </p>
        <Button
          size="sm"
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors"
          onClick={handleGenerate}
        >
          Generate Today's Report
        </Button>
      </div>
    </div>
  )
}
