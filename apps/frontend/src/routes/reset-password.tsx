import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This password reset link is invalid or expired."
        footer={
          <Link to="/login" className="text-violet-600 hover:underline font-medium">
            ← Back to sign in
          </Link>
        }
      >
        <div className="text-center text-xs text-red-500">Token tidak valid.</div>
      </AuthLayout>
    )
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await authClient.resetPassword({ newPassword: password, token })
      if (err) throw new Error(err.message || 'Failed to reset password')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        title="Password reset!"
        subtitle="Your password has been successfully reset."
        footer={
          <button
            onClick={() => navigate({ to: '/login' })}
            className="text-violet-600 hover:underline font-medium"
          >
            Sign in →
          </button>
        }
      >
        <div className="text-center text-xs text-emerald-600">
          Password berhasil direset! Silakan masuk dengan password baru Anda.
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your new password below."
      footer={
        <Link to="/login" className="text-violet-600 hover:underline font-medium">
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            <span className="shrink-0 mt-0.5">⚠</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="relative w-full h-9 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  )
}
