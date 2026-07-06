import { Input } from '@/components/ui/input'
import { Briefcase } from 'lucide-react'

interface Props {
  workspaceName: string
  onChange: (name: string) => void
}

export function StepWorkspace({ workspaceName, onChange }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 text-indigo-600">
        <Briefcase className="h-5 w-5" />
        <h3 className="font-semibold text-slate-800">Buat Workspace Baru</h3>
      </div>
      <p className="text-xs text-slate-500">
        Workspace adalah wadah kolaborasi utama untuk menyatukan percakapan dari WhatsApp, Telegram, Slack, dan mengintegrasikan agen AI Anda.
      </p>
      <div className="space-y-2 mt-4">
        <label className="text-xs font-medium text-slate-500">Nama Workspace</label>
        <Input
          placeholder="Contoh: Tim Developer Ghost, Startup Alpha, dll."
          value={workspaceName}
          onChange={e => onChange(e.target.value)}
          className="bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-400"
        />
      </div>
    </div>
  )
}
