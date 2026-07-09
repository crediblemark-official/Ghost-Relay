import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck, ArrowLeft, Loader2, AlertCircle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { Notification } from '@/types'

const NOTIF_TYPES = [
  { value: '', label: 'All', count: true },
  { value: 'direct', label: 'Messages' },
  { value: 'broadcast', label: 'Broadcast' },
  { value: 'task', label: 'Tasks' },
] as const

// Warna per-tipe notifikasi — konsisten enterprise
const TYPE_STYLES: Record<string, { pill: string; dot: string }> = {
  broadcast: {
    pill: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  task: {
    pill: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    dot: 'bg-sky-500',
  },
  direct: {
    pill: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
}

const TYPE_LABELS: Record<string, string> = {
  broadcast: 'Broadcast',
  task: 'Task',
  direct: 'Message',
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = Date.now()
    const diff = now - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const queryClient = useQueryClient()
  const [filterType, setFilterType] = useState('')
  const [markingAll, setMarkingAll] = useState(false)
  const [markingIds, setMarkingIds] = useState<Set<number>>(new Set())

  const { data: notifications = [], isLoading, isError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications', { silent: true }),
    refetchOnWindowFocus: true,
  })

  const filtered = filterType
    ? notifications.filter((n) => n.type === filterType)
    : notifications

  const unreadCount = notifications.filter((n) => !n.readAt).length
  const filteredUnreadCount = filtered.filter((n) => !n.readAt).length

  const handleMarkRead = useCallback(async (id: number) => {
    setMarkingIds((prev) => new Set(prev).add(id))
    try {
      await api.post(`/notifications/${id}/read`, {}, { silent: true })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch { /* noop */ }
    setMarkingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [queryClient])

  const handleMarkAllRead = useCallback(async () => {
    setMarkingAll(true)
    try {
      await api.post('/notifications/all/read', {}, { silent: true })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch { /* noop */ }
    setMarkingAll(false)
  }, [queryClient])

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      {/* ===== Header ===== */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-card/90 backdrop-blur-sm px-5">
        <div className="flex items-center gap-3">
          <Link
            to="/chat"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h1 className="text-[14px] font-semibold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 text-primary px-1.5 text-[10px] font-semibold pulse-glow">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="text-[11px] gap-1.5 h-7 px-3"
            >
              {markingAll ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* ===== Filter Tabs ===== */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border bg-card/50">
        {NOTIF_TYPES.map((t) => {
          const isActive = filterType === t.value
          const unread = t.value === ''
            ? unreadCount
            : notifications.filter((n) => n.type === t.value && !n.readAt).length

          return (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition-all font-medium ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>{t.label}</span>
              {unread > 0 && (
                <span className={`text-[9px] px-1 py-0 rounded-full min-w-[14px] text-center ${
                  isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                }`}>
                  {unread}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ===== Content ===== */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-xs">Loading notifications...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Failed to load notifications</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Inbox className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium mt-1">
                {filterType ? 'No notifications of this type' : 'No notifications yet'}
              </p>
              <p className="text-[11px] text-muted-foreground/60 text-center max-w-48">
                AI and team member notifications will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((n) => {
              const typeStyle = TYPE_STYLES[n.type] || TYPE_STYLES['direct']
              const typeLabel = TYPE_LABELS[n.type] || n.type

              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-accent/20 ${
                    !n.readAt ? 'bg-primary/3' : ''
                  }`}
                >
                  {/* Unread indicator */}
                  <div className="mt-2 shrink-0">
                    <div
                      className={`h-2 w-2 rounded-full transition-all ${
                        !n.readAt ? `${typeStyle.dot} pulse-glow` : 'bg-border'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {/* Title + sender */}
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${typeStyle.pill}`}>
                            {typeLabel}
                          </span>
                          <span className="text-[13px] font-semibold text-foreground truncate">
                            {n.title}
                          </span>
                          {n.sender && (
                            <span className="text-[11px] text-muted-foreground shrink-0">
                              from <span className="font-medium text-foreground/70">{n.sender.name}</span>
                            </span>
                          )}
                        </div>

                        {/* Message body */}
                        {n.message && (
                          <p className="text-[12px] text-muted-foreground leading-relaxed whitespace-pre-wrap mt-1">
                            {n.message}
                          </p>
                        )}

                        {/* Time */}
                        <p className="text-[10px] text-muted-foreground/40 mt-2">
                          {formatDate(n.createdAt)}
                          {n.readAt && (
                            <span className="ml-2 text-primary/40">
                              · Read {formatDate(n.readAt)}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Mark read button */}
                      {!n.readAt && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          disabled={markingIds.has(n.id)}
                          className="shrink-0 flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 mt-0.5"
                          title="Mark as read"
                        >
                          {markingIds.has(n.id) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCheck className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ===== Footer Stats ===== */}
      {filtered.length > 0 && !isLoading && (
        <div className="border-t border-border bg-card/50 px-5 py-2">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
            {filterType && ` · filtered by ${filterType}`}
            {filteredUnreadCount > 0 && ` · ${filteredUnreadCount} unread`}
          </p>
        </div>
      )}
    </div>
  )
}
