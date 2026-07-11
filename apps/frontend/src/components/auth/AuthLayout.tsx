import { type ReactNode, useRef, useCallback } from 'react'
import { Ghost, Check } from 'lucide-react'

const APP_VERSION = '1.0.0'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  ownerMode?: boolean
  enableOwnerEasterEgg?: boolean
  onOwnerActivate?: () => void
}

const features = [
  'Voice note ditranskripsi otomatis',
  'Knowledge vault dengan pencarian semantik',
  'Auto-reply AI dengan memory chat',
  'Enkripsi AES-256-GCM untuk semua data',
]

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  ownerMode = false,
  enableOwnerEasterEgg = false,
  onOwnerActivate,
}: AuthLayoutProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleLongPressStart = useCallback(() => {
    if (!enableOwnerEasterEgg) return
    longPressTimer.current = setTimeout(() => {
      onOwnerActivate?.()
    }, 800)
  }, [enableOwnerEasterEgg, onOwnerActivate])

  const handleLongPressEnd = useCallback(() => {
    clearTimeout(longPressTimer.current)
  }, [])

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* ═══ LEFT PANEL — Branding ═══ */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 overflow-hidden">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-fuchsia-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top: Logo + brand */}
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <Ghost className="h-5.5 w-5.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Ghost Relay</span>
            </div>

            {/* Tagline */}
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Koordinasi Tim
              <br />
              <span className="text-violet-200">Tanpa Scroll Chat.</span>
            </h2>
            <p className="text-sm text-violet-200/70 leading-relaxed max-w-md mb-12">
              Satu dasbor untuk semua pesan dari WhatsApp, Telegram, dan Slack. AI menjawab pertanyaan berulang secara mandiri.
            </p>

            {/* Feature bullets */}
            <div className="space-y-3.5">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-white/10 shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-violet-100/80">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Version */}
          <p className="text-[11px] text-white/25 select-none">
            Ghost Relay v{APP_VERSION}
            {ownerMode && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-300/50">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Owner
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Form ═══ */}
      <div className="relative flex flex-1 items-center justify-center bg-white px-6 py-12">
        {/* Subtle background accents */}
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] bg-violet-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[380px]">
          {/* Mobile logo (visible on small screens only) */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 ring-1 ring-violet-100 select-none"
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              style={enableOwnerEasterEgg ? { cursor: 'pointer' } : undefined}
            >
              <Ghost className="h-6 w-6 text-violet-600" />
            </div>
          </div>

          {/* Desktop logo (visible on lg+ screens) */}
          <div className="hidden lg:flex flex-col items-center mb-8">
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-violet-100 select-none"
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              style={enableOwnerEasterEgg ? { cursor: 'pointer' } : undefined}
            >
              <Ghost className="h-5 w-5 text-violet-600" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-slate-900 mb-1">{title}</h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
            {ownerMode && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-amber-500 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-full">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Owner mode
              </div>
            )}
          </div>

          {/* Form slot */}
          {children}

          {/* Footer */}
          {footer && (
            <p className="mt-8 text-center text-sm text-slate-500">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
