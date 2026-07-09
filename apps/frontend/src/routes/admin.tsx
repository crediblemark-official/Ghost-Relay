import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Building2, Calendar, MessageSquare, Settings, ArrowRight, Shield } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const user = useAuthStore(s => s.user)

  const { data: workspaces, isLoading: wsLoading } = useQuery<{
    id: string
    name: string
    owner: { name: string; email: string }
    memberCount: number
    createdAt: string
  }[]>({
    queryKey: ['admin-workspaces'],
    queryFn: () => api.get<{ workspaces: { id: string; name: string; owner: { name: string; email: string }; memberCount: number; createdAt: string }[] }>('/admin/workspaces').then(r => r.workspaces),
    retry: false,
  })

  const { data: users, isLoading: usersLoading } = useQuery<{ id: string; name: string; email: string }[]>({
    queryKey: ['admin-users'],
    queryFn: () => api.get<{ users: { id: string; name: string; email: string }[] }>('/admin/users').then(r => r.users),
    retry: false,
  })

  if (!user) return null

  return (
    <div className="flex flex-1 bg-background text-foreground min-h-screen overflow-y-auto">
      <div className="flex flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="space-y-7 w-full">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                  <Shield className="h-4 w-4 text-amber-500" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Platform-wide overview · Signed in as <span className="font-medium text-foreground/80">{user.name}</span>
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<Building2 className="h-5 w-5 text-primary" />}
              label="Workspaces"
              value={wsLoading ? null : workspaces?.length ?? 0}
              accent="primary"
            />
            <StatCard
              icon={<Users className="h-5 w-5 text-emerald-500" />}
              label="Total Users"
              value={usersLoading ? null : users?.length ?? 0}
              accent="emerald"
            />
          </div>

          {/* Workspace List */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Workspaces</h2>
              <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                {wsLoading ? '—' : `${workspaces?.length ?? 0} total`}
              </span>
            </div>
            {wsLoading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {(workspaces ?? []).map((w: {
                  id: string
                  name: string
                  owner: { name: string; email: string }
                  memberCount: number
                  createdAt: string
                }) => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-accent/30 transition-colors">
                    <div>
                      <div className="text-[13px] font-medium text-foreground">{w.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {w.owner.name}
                        <span className="mx-1.5 text-border">·</span>
                        <span>{w.memberCount} member{w.memberCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
                {(workspaces ?? []).length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-muted-foreground/60">
                    Belum ada workspace terdaftar
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[9px] font-semibold tracking-widest text-muted-foreground/50 uppercase">Quick Links</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex gap-3">
              {[
                { to: '/chat', label: 'Main Chat', icon: MessageSquare },
                { to: '/settings', label: 'Settings', icon: Settings },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex flex-1 items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 hover:border-primary/20 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    <span className="text-[13px]">{link.label}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Komponen reusable stat card
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number | null
  accent: 'primary' | 'emerald'
}) {
  const ringClass = accent === 'primary' ? 'ring-primary/15 bg-primary/5' : 'ring-emerald-500/15 bg-emerald-500/5'

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ring-1 ${ringClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground tabular-nums">
          {value === null ? (
            <Skeleton className="h-7 w-10" />
          ) : (
            value
          )}
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  )
}
