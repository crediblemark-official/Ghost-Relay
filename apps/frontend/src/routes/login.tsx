import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { invite?: string } => ({
    invite: search.invite as string | undefined,
  }),
  beforeLoad: () => {
    const token = useAuthStore.getState().token
    if (token) throw redirect({ to: '/chat' })
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const searchInvite = Route.useSearch().invite
  const [invite] = useState(() => searchInvite || sessionStorage.getItem('pending_invite'))
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const [mode, setMode] = useState<'login' | 'forgot' | 'owner'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleOwnerActivate = () => {
    setMode('owner')
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'forgot') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: err } = await (authClient as any).forgetPassword({ email })
        if (err) throw new Error(err.message || 'Failed to send reset link')
        setSuccess('Cek console server untuk link reset password (development mode).')
        setLoading(false)
        return
      }
      let authToken = ''
      const { data, error: err } = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: (ctx) => {
            authToken = ctx.response.headers.get('set-auth-token') || ''
          },
        }
      )
      if (err) throw new Error(err.message || 'Incorrect email or password')
      if (data && authToken) {
        setToken(authToken)
        setUser({
          id: String(data.user.id),
          email: data.user.email,
          name: data.user.name,
          role: (data.user as any).role,
        })

        if (mode === 'owner') {
          const check = await api.get<{ role: string }>('/admin/check')
          if (check.role !== 'owner') {
            await authClient.signOut()
            setToken(null)
            setUser(null)
            throw new Error('Akun ini bukan platform owner.')
          }
          navigate({ to: '/admin' })
          return
        }

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
            toast.error('Gagal menerima undangan. Setelah login, buka tautan undangan lagi untuk mencoba ulang.')
          }
        }
        navigate({ to: '/chat' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={mode === 'forgot' ? 'Reset your password' : mode === 'owner' ? 'Owner Access' : 'Sign in to your workspace'}
      subtitle={
        mode === 'forgot' ? "We'll send a reset link to your email"
        : mode === 'owner' ? 'Platform administrator access only'
        : 'Enter your credentials to continue'
      }
      ownerMode={mode === 'owner'}
      enableOwnerEasterEgg
      onOwnerActivate={handleOwnerActivate}
      footer={
        mode === 'forgot' || mode === 'owner' ? (
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            ← Back to sign in
          </button>
        ) : (
          <>
            No account?{' '}
            <Link to="/register" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
              Create one
            </Link>
          </>
        )
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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

        {mode !== 'forgot' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
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
        )}

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span className="shrink-0 mt-0.5 text-red-400">⚠</span>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            <span className="shrink-0 mt-0.5 text-emerald-400">✓</span>
            {success}
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
              {mode === 'login' ? 'Sign In' : mode === 'owner' ? 'Owner Sign In' : 'Send Reset Link'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  )
}
