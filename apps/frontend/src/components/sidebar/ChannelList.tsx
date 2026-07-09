import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Bot, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { TeamList } from './TeamList'

interface PlatformConnection {
  id: number
  platform: string
  platformUserId: string | null
  isActive: boolean
}

interface ChannelListProps {
  activeId?: string
  onSelect?: (id: string) => void
  collapsed?: boolean
}

// Warna platform yang konsisten
const PLATFORM_COLORS: Record<string, { dot: string; badge: string }> = {
  whatsapp: { dot: 'bg-emerald-500', badge: 'text-emerald-500 bg-emerald-500/10' },
  telegram: { dot: 'bg-sky-500', badge: 'text-sky-500 bg-sky-500/10' },
  slack: { dot: 'bg-violet-500', badge: 'text-violet-500 bg-violet-500/10' },
}

const DEFAULT_PLATFORM = { dot: 'bg-muted-foreground', badge: 'text-muted-foreground bg-muted' }

function getPlatformLabel(platform: string): string {
  const map: Record<string, string> = {
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    slack: 'Slack',
  }
  return map[platform.toLowerCase()] || platform
}

export function ChannelList({ activeId = 'all', onSelect, collapsed }: ChannelListProps) {
  const { data: connections = [], isLoading, isError } = useQuery<PlatformConnection[]>({
    queryKey: ['platforms'],
    queryFn: () => api.get('/settings/platforms', { silent: true }),
    staleTime: 30000,
  })

  const activeConnections = connections.filter((c: PlatformConnection) => c.isActive)

  return (
    <aside className={cn(
      "hidden w-60 flex-col border-r border-border bg-sidebar md:flex transition-all duration-300 overflow-hidden shrink-0",
      collapsed && "w-0 border-r-0 md:w-0"
    )}>
      {/* Sidebar Header — "Semua Pesan" */}
      <div className="flex h-14 items-center border-b border-border px-3">
        <button
          onClick={() => onSelect?.('all')}
          className={cn(
            'sidebar-active-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150',
            activeId === 'all'
              ? 'bg-primary/8 text-primary font-semibold'
              : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground'
          )}
        >
          <Layers className={cn("h-4 w-4 shrink-0", activeId === 'all' ? 'text-primary' : 'text-muted-foreground')} />
          <span className="truncate">Semua Pesan</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">

        {/* === Saluran Tim === */}
        <div className="space-y-1">
          <div className="px-2 pb-1">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              Saluran
            </p>
          </div>
          <div className="space-y-0.5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))
            ) : isError ? (
              <div className="flex items-center gap-2 px-3 py-2 text-destructive/80">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs">Gagal memuat saluran</span>
              </div>
            ) : activeConnections.length === 0 ? (
              <div className="px-3 py-2 text-[11px] text-muted-foreground/60 italic leading-relaxed">
                Belum ada saluran aktif.<br />
                Hubungkan di Pengaturan.
              </div>
            ) : (
              activeConnections.map((conn: PlatformConnection) => {
                const colors = PLATFORM_COLORS[conn.platform.toLowerCase()] || DEFAULT_PLATFORM
                const isActive = activeId === conn.platform
                return (
                  <button
                    key={conn.id}
                    onClick={() => onSelect?.(conn.platform)}
                    className={cn(
                      'sidebar-active-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150',
                      isActive
                        ? 'bg-primary/8 text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground'
                    )}
                  >
                    {/* Status dot */}
                    <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', colors.dot)} />
                    <span className="truncate flex-1 text-[13px]">
                      {conn.platformUserId || getPlatformLabel(conn.platform)}
                    </span>
                    {/* Platform badge pill */}
                    <span className={cn(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0',
                      colors.badge
                    )}>
                      {conn.platform.slice(0, 2)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 mx-1" />

        {/* === Anggota Tim === */}
        <TeamList collapsed={collapsed} />

        {/* Divider */}
        <div className="h-px bg-border/60 mx-1" />

        {/* === Asisten AI === */}
        <div className="space-y-1">
          <div className="px-2 pb-1">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              Asisten AI
            </p>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onSelect?.('web')}
              className={cn(
                'sidebar-active-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-all duration-150',
                activeId === 'web'
                  ? 'bg-primary/8 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground'
              )}
            >
              <Bot className={cn("h-4 w-4 shrink-0", activeId === 'web' ? 'text-primary' : 'text-muted-foreground')} />
              <span className="flex-1 truncate">AI Assistant</span>
              {/* Online indicator */}
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" style={{ boxShadow: '0 0 6px oklch(0.6 0.22 264 / 70%)' }} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
