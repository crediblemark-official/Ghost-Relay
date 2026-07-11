import { createFileRoute, redirect } from '@tanstack/react-router'
import { LandingPage } from '@/components/landing/LandingPage'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = useAuthStore.getState().token
    if (token) {
      throw redirect({ to: '/chat' })
    }
  },
  component: LandingPage,
})
