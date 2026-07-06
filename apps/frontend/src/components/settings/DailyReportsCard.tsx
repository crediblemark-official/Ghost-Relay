import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { api } from '@/lib/api'

export function DailyReportsCard() {
  const handleGenerate = async () => {
    const res = await api.post<{ report: string }>('/reports/generate')
    alert(res.report)
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 px-6 py-4">
        <CardTitle className="text-lg font-bold flex items-center text-slate-800">
          <FileText className="h-5 w-5 inline mr-2 text-rose-500" />
          Daily Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  )
}
