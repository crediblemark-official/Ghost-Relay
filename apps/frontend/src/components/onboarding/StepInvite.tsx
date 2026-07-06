import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Users, Check, Copy } from 'lucide-react'

interface Props {
  invitedEmailsStr: string
  onChange: (v: string) => void
}

export function StepInvite({ invitedEmailsStr, onChange }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + '/login')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 text-indigo-600">
        <Users className="h-5 w-5" />
        <h3 className="font-semibold text-slate-800">Undang Rekan Tim</h3>
      </div>
      <p className="text-xs text-slate-500">
        Undang rekan kerja Anda untuk bergabung ke dalam dashboard Ghost Relay ini guna memantau riwayat obrolan tim bersama-sama.
      </p>

      <div className="space-y-2 mt-4">
        <label className="text-xs font-medium text-slate-500">Alamat Email Anggota (pisahkan dengan koma)</label>
        <Input
          placeholder="budi@example.com, citra@example.com"
          value={invitedEmailsStr}
          onChange={e => onChange(e.target.value)}
          className="bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-400"
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-medium text-slate-500">Atau kirim tautan registrasi instan</label>
        <div className="flex gap-2">
          <Input
            readOnly
            value={window.location.origin + '/login'}
            className="bg-slate-50 border-slate-200 text-slate-400 select-all"
          />
          <Button
            variant="outline" size="icon"
            onClick={handleCopy}
            className="border-slate-200 text-slate-500 shrink-0 hover:bg-slate-100"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        {copied && <span className="text-[10px] text-green-500">Tautan berhasil disalin!</span>}
      </div>
    </div>
  )
}
