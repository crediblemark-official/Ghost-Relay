import { Outlet, useMatch } from '@tanstack/react-router'
import { Navigation } from './Navigation'

export function AppLayout() {
  const isLogin = useMatch({ from: '/login', shouldThrow: false }) !== undefined
  const isLanding = useMatch({ from: '/', shouldThrow: false }) !== undefined
  const isInvite = useMatch({ from: '/invite/$code', shouldThrow: false }) !== undefined
  const isReset = useMatch({ from: '/reset-password', shouldThrow: false }) !== undefined

  if (isLogin || isLanding || isInvite || isReset) {
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
