import { createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createRootRouteWithContext<{
  isAuthenticated: boolean
}>()({
  beforeLoad: ({ location }) => {
    const token = useAuthStore.getState().token
    const publicPaths = ['/', '/login', '/index.html']
    const isPublic = publicPaths.includes(location.pathname) || 
                     location.pathname.startsWith('/invite/') || 
                     location.pathname.startsWith('/reset-password')

    console.log('[DEBUG __root beforeLoad]', { token, pathname: location.pathname, isPublic })
    if (!token && !isPublic) {
      console.log('[DEBUG __root Redirecting to /login]')
      throw redirect({ to: '/login' })
    }
  },
  component: () => <AppLayout />,
})
