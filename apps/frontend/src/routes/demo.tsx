import { createFileRoute } from '@tanstack/react-router'
import Home from "@/components/ui/hero-ascii"

export const Route = createFileRoute('/demo')({
  component: DemoOne,
})

export default function DemoOne() {
  return (
    <div className="w-screen h-screen">
      <Home />
    </div>
  )
}
