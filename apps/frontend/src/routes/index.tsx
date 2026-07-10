import { createFileRoute, redirect } from '@tanstack/react-router'
import { LandingPage } from '@/components/landing/LandingPage'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = useAuthStore.getState().token
    console.log('[DEBUG index beforeLoad]', { token })
    if (token) {
      console.log('[DEBUG index Redirecting to /chat]')
      throw redirect({ to: '/chat' })
    }
  },
  component: LandingPage,
})
