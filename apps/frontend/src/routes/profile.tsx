import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { ArrowLeft, Save, Key, User as UserIcon, Briefcase, Users2, MessageSquare, BookOpen } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

const TONE_OPTIONS = [
  { id: 'casual', label: 'Kasual ☕', desc: 'Gaya santai, ramah, bersahabat, namun tetap sopan.' },
  { id: 'professional', label: 'Formal 💼', desc: 'Sangat sopan, formal, menggunakan bahasa baku yang rapi.' },
  { id: 'concise', label: 'Singkat Padat ⚡', desc: 'Sangat ringkas, langsung ke inti obrolan, tanpa basa-basi.' },
  { id: 'technical', label: 'Teknis 💻', desc: 'Fokus pada detail data, kode program, dan data implementasi.' },
]

function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const [name, setName] = useState(user?.name ?? '')
  const [position, setPosition] = useState(user?.position ?? '')
  const [department, setDepartment] = useState(user?.department ?? '')
  const [tonePreference, setTonePreference] = useState(user?.tonePreference ?? 'casual')
  const [bio, setBio] = useState(user?.bio ?? '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setPosition(user.position ?? '')
      setDepartment(user.department ?? '')
      setTonePreference(user.tonePreference ?? 'casual')
      setBio(user.bio ?? '')
    }
  }, [user])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleSaveProfile = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const updated = await api.post<any>('/auth/update-profile', {
        name,
        position,
        department,
        tonePreference,
        bio,
      })
      setUser({ ...user!, ...updated })
      setMessage('Profil tim personal Anda berhasil diperbarui!')
      setMessageType('success')
    } catch (e: any) {
      setMessage(e.message || 'Gagal memperbarui profil.')
      setMessageType('error')
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return
    setChangingPassword(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      })
      setMessage('Password berhasil diperbarui!')
      setMessageType('success')
      setCurrentPassword('')
      setNewPassword('')
    } catch (e: any) {
      setMessage(e.message || 'Gagal memperbarui password.')
      setMessageType('error')
    }
    setChangingPassword(false)
  }

  return (
    <div className="flex flex-1 bg-background text-foreground min-h-screen overflow-y-auto">
      <div className="flex flex-1 w-full p-8">
        <div className="w-full space-y-6 pb-12">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate({ to: '/chat' })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-extrabold tracking-tight">Profil Personal Tim</h1>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`rounded-xl border px-4 py-3 text-sm animate-in fade-in duration-200 ${
              messageType === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}>
              {message}
            </div>
          )}

          {/* Widescreen Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column - Main Forms (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Account & Team Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserIcon className="h-4 w-4 text-indigo-500" /> Informasi Peran & Organisasi Tim
                  </CardTitle>
                  <CardDescription>
                    Detail identitas dan tanggung jawab Anda dalam tim kerja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Nama Lengkap</label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nama Anda"
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Jabatan / Posisi Kerja</label>
                      <div className="relative">
                        <Input
                          value={position}
                          onChange={e => setPosition(e.target.value)}
                          placeholder="Contoh: Lead Frontend Engineer"
                          className="pl-8 text-xs h-9"
                        />
                        <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-500">Departemen / Divisi</label>
                    <div className="relative">
                      <Input
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder="Contoh: Engineering, Product, Marketing"
                        className="pl-8 text-xs h-9"
                      />
                      <Users2 className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Personalization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-indigo-500" /> Personalisasi Asisten AI
                  </CardTitle>
                  <CardDescription>
                    Atur bagaimana AI asisten merespons dan memahami instruksi personal dari Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Communication Tone */}
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-semibold text-slate-500">Gaya Komunikasi AI</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {TONE_OPTIONS.map(opt => {
                        const active = tonePreference === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setTonePreference(opt.id)}
                            className={`text-left p-3 rounded-lg border text-xs transition-all ${
                              active
                                ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 ring-1 ring-indigo-500'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            <div className="font-semibold text-xs mb-1">{opt.label}</div>
                            <div className="text-[10px] text-slate-400 leading-relaxed">{opt.desc}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bio Context */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Arahan Khusus & Konteks Personal
                      </label>
                      <span className="text-[9px] text-slate-400">Menyediakan riwayat/fokus tugas untuk AI</span>
                    </div>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Contoh: Saya memimpin tim backend. Mohon berikan ringkasan teknis yang fokus pada skema database dan optimasi query PostgreSQL saat memberikan penjelasan."
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Save Profile Button */}
                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving || !name.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 text-xs h-9 shadow-sm"
                    >
                      <Save className="h-4 w-4 mr-1.5" />
                      {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Summary & Security (Span 1) */}
            <div className="space-y-6">
              
              {/* Profile Card Summary */}
              <Card className="overflow-hidden border-indigo-100 bg-indigo-50/10">
                <div className="h-2 bg-indigo-600 w-full" />
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl mb-4 border border-indigo-200 shadow-sm animate-pulse-slow">
                    {name ? name.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base leading-snug">{name || 'Nama Pengguna'}</h3>
                  <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                  
                  <div className="mt-4 flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-dashed border-slate-200/60">
                      <span className="text-slate-400">Hak Akses:</span>
                      <span className="font-bold uppercase text-[10px] tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {user?.role || 'Member'}
                      </span>
                    </div>
                    {position && (
                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-dashed border-slate-200/60">
                        <span className="text-slate-400">Jabatan:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[150px] text-right">{position}</span>
                      </div>
                    )}
                    {department && (
                      <div className="flex items-center justify-between text-xs py-1.5 border-b border-dashed border-slate-200/60">
                        <span className="text-slate-400">Departemen:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[150px] text-right">{department}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs py-1.5">
                      <span className="text-slate-400">Tone AI Aktif:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[10px]">
                        {TONE_OPTIONS.find(t => t.id === tonePreference)?.label || 'Kasual ☕'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password update */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Key className="h-4 w-4 text-indigo-500" /> Keamanan Akun
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Perbarui kata sandi akun personal tim Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-500">Kata Sandi Saat Ini</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-500">Kata Sandi Baru</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="pt-1">
                    <Button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={changingPassword || !currentPassword || !newPassword}
                      variant="outline"
                      className="w-full text-xs h-8 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                    >
                      {changingPassword ? 'Memperbarui...' : 'Ubah Kata Sandi'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
