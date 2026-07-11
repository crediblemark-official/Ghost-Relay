import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): { invite?: string } => ({
    invite: search.invite as string | undefined,
  }),
  beforeLoad: () => {
    const token = useAuthStore.getState().token
    if (token) throw redirect({ to: '/chat' })
  },
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const searchInvite = Route.useSearch().invite
  const [invite] = useState(() => searchInvite || sessionStorage.getItem('pending_invite'))
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let authToken = ''
      const { data, error: err } = await authClient.signUp.email(
        { email, password, name },
        {
          onSuccess: (ctx) => {
            authToken = ctx.response.headers.get('set-auth-token') || ''
          },
        }
      )
      if (err) {
        throw new Error(err.message || 'Registration failed')
      }
      if (data && authToken) {
        setToken(authToken)
        setUser({
          id: String(data.user.id),
          email: data.user.email,
          name: data.user.name,
          role: (data.user as any).role,
        })
        if (invite) {
          try {
            const result = await api.post<{ status: string; workspaceName?: string }>('/settings/invite/accept', { code: invite }, { silent: true })
            if (result.status === 'already_member') {
              toast.info('Anda sudah menjadi anggota tim ini')
            } else if (result.status === 'ok') {
              toast.success('Berhasil bergabung ke ' + (result.workspaceName || 'tim'))
            }
            sessionStorage.removeItem('pending_invite')
          } catch {
            toast.error('Gagal menerima undangan. Setelah menyelesaikan onboarding, buka tautan undangan lagi untuk mencoba ulang.')
          }
        }
        navigate({ to: invite ? '/chat' : '/onboarding' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your team on Ghost Relay"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 pr-11 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span className="shrink-0 mt-0.5 text-red-400">⚠</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="relative w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:from-violet-700 hover:to-violet-800 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  )
}
