import { Sparkles } from 'lucide-react'

const PURPOSES = [
  { value: 'Sinkronisasi Tim & Koordinasi Developer', label: '💻 Sinkronisasi Tim & Koordinasi Developer' },
  { value: 'Manajemen Proyek Kreatif & Desain', label: '🎨 Manajemen Proyek Kreatif & Desain' },
  { value: 'Operasional Bisnis & Customer Support', label: '📞 Operasional Bisnis & Customer Support' },
  { value: 'Lainnya / Umum', label: '🚀 Lainnya / Umum' },
]

const fieldCls = 'w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-indigo-400 transition-colors'

interface Props {
  purpose: string
  context: string
  onPurposeChange: (v: string) => void
  onContextChange: (v: string) => void
}

export function StepPersonalize({ purpose, context, onPurposeChange, onContextChange }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 text-indigo-600">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-semibold text-slate-800">Personalisasi Ruang Kerja</h3>
      </div>
      <p className="text-xs text-slate-500">
        Bantu AI kami memahami tujuan workspace Anda agar hasil ekstraksi rangkuman audio dan pembuatan laporan harian menjadi jauh lebih akurat.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">Fokus / Tujuan Utama</label>
        <select
          value={purpose}
          onChange={e => onPurposeChange(e.target.value)}
          className={`${fieldCls} h-10`}
        >
          {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">Konteks Pekerjaan / Deskripsi Proyek</label>
        <textarea
          placeholder="Jelaskan secara singkat proyek atau tugas yang sedang dikerjakan agar AI dapat memahaminya."
          value={context}
          onChange={e => onContextChange(e.target.value)}
          rows={4}
          className={`${fieldCls} p-3 resize-none placeholder-slate-400`}
        />
      </div>
    </div>
  )
}
