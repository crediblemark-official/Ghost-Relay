import { createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createRootRouteWithContext<{
  isAuthenticated: boolean
}>()({
  beforeLoad: ({ location }) => {
    const token = useAuthStore.getState().token
    const publicPaths = ['/', '/login', '/register', '/index.html']
    const isPublic = publicPaths.includes(location.pathname) || 
                     location.pathname.startsWith('/invite/') || 
                     location.pathname.startsWith('/reset-password')

    if (!token && !isPublic) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <AppLayout />,
})
