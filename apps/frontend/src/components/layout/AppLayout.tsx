import { Outlet, useMatch } from '@tanstack/react-router'
import { Navigation } from './Navigation'
import { useSocketEvents } from '@/hooks/useSocketEvents'

export function AppLayout() {
  const isLogin = useMatch({ from: '/login', shouldThrow: false }) !== undefined
  const isRegister = useMatch({ from: '/register', shouldThrow: false }) !== undefined
  const isLanding = useMatch({ from: '/', shouldThrow: false }) !== undefined
  const isInvite = useMatch({ from: '/invite/$code', shouldThrow: false }) !== undefined
  const isReset = useMatch({ from: '/reset-password', shouldThrow: false }) !== undefined
  const isOnboarding = useMatch({ from: '/onboarding', shouldThrow: false }) !== undefined

  // Socket events harus aktif di semua halaman (notifikasi, real-time, etc.)
  useSocketEvents()

  if (isLogin || isRegister || isLanding || isInvite || isReset || isOnboarding) {
    return <Outlet />
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
