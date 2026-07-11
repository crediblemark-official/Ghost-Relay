import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { ArrowLeft, Save, Key, User as UserIcon, Mail, Briefcase, Users2, MessageSquare, BookOpen } from 'lucide-react'

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
      <div className="flex flex-1 max-w-2xl w-full mx-auto p-8">
        <div className="w-full space-y-6 pb-12">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate({ to: '/chat' })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-extrabold tracking-tight">Profil Personal Tim</h1>
          </div>

          {message && (
            <div className={`rounded-xl border px-4 py-3 text-sm animate-in fade-in duration-200 ${
              messageType === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}>
              {message}
            </div>
          )}

          {/* Account & Team Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserIcon className="h-4 w-4 text-indigo-500" /> Informasi Akun & Peran Tim
              </CardTitle>
              <CardDescription>
                Detail akun dan peran Anda dalam organisasi tim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-slate-50/50 p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-slate-600">{user?.email}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider rounded px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 ml-auto">
                  {user?.role || 'Member'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">Nama Lengkap</label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama Anda"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500">Jabatan / Peran Tim</label>
                  <div className="relative">
                    <Input
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      placeholder="Contoh: Lead Frontend Engineer"
                      className="pl-8 text-xs h-8"
                    />
                    <Briefcase className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
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
                    className="pl-8 text-xs h-8"
                  />
                  <Users2 className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Communication Personalization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-indigo-500" /> Personalisasi Komunikasi AI
              </CardTitle>
              <CardDescription>
                Atur gaya bahasa dan preferensi AI asisten saat berbicara kepada Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gaya Bicara Options */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-500">Gaya Bahasa Asisten</label>
                <div className="grid grid-cols-2 gap-3">
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

              {/* Bio / Custom Instructions */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Catatan & Konteks Personal untuk AI
                  </label>
                  <span className="text-[9px] text-slate-400">Dipakai AI untuk memahami profil Anda</span>
                </div>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Contoh: Saya memimpin tim backend. Mohon berikan ringkasan teknis yang fokus pada skema database dan optimasi query PostgreSQL saat memberikan penjelasan."
                  className="min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Save Button for Profile & Personalization */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving || !name.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 text-xs h-8"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  {saving ? 'Menyimpan...' : 'Simpan Semua Profil'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4 text-indigo-500" /> Ubah Kata Sandi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Kata sandi saat ini"
                  className="h-8 text-xs"
                />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Kata sandi baru"
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={changingPassword || !currentPassword || !newPassword}
                  variant="outline"
                  className="text-xs h-8"
                >
                  {changingPassword ? 'Memperbarui...' : 'Ubah Kata Sandi'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
