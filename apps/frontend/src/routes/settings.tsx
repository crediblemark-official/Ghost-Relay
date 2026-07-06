import { createFileRoute } from '@tanstack/react-router'
import { AIProvidersCard } from '@/components/settings/AIProvidersCard'
import { PlatformsCard } from '@/components/settings/PlatformsCard'
import { DailyReportsCard } from '@/components/settings/DailyReportsCard'
import { SystemConfigCard } from '@/components/settings/SystemConfigCard'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col p-8 overflow-y-auto bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-4xl w-full mx-auto space-y-8 pb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">
            Manage your workspace configuration, AI agents, platform channels, and system variables.
          </p>
        </div>

        <AIProvidersCard />
        <PlatformsCard />
        <DailyReportsCard />
        <SystemConfigCard />
      </div>
    </div>
  )
}
