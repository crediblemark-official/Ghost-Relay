import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Brain, Globe, Settings as SettingsIcon, Link as LinkIcon, Bot, ArrowLeft
} from 'lucide-react'
import { AIProvidersCard } from '@/components/settings/AIProvidersCard'
import { PlatformsCard } from '@/components/settings/PlatformsCard'
import { SystemConfigCard } from '@/components/settings/SystemConfigCard'
import { InviteCard } from '@/components/settings/InviteCard'
import { AutoReplyCard } from '@/components/settings/AutoReplyCard'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'ai' | 'platforms' | 'invite' | 'auto-reply' | 'system'>('ai')

  const tabs = [
    { id: 'ai', label: 'AI Providers', icon: Brain },
    { id: 'platforms', label: 'Platforms', icon: Globe },
    { id: 'invite', label: 'Team Invite', icon: LinkIcon },
    { id: 'auto-reply', label: 'Auto Reply', icon: Bot },
    { id: 'system', label: 'System Config', icon: SettingsIcon },
  ] as const

  return (
    <div className="flex flex-1 bg-background text-foreground h-full overflow-y-auto">
      <div className="flex flex-1 max-w-5xl w-full mx-auto p-8 flex-col gap-6">

        {/* Top Header Navigation (like profile.tsx) */}
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Link to="/chat">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Kembali ke Chat">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Settings</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Konfigurasi model AI, platform chat, undangan tim, auto-reply, dan sistem.
            </p>
          </div>
        </div>

        {/* Vertical Sidebar layout */}
        <div className="flex flex-1 gap-8 items-start">

          {/* Left Column: Vertical tab menu */}
          <div className="w-48 shrink-0 space-y-1.5 sticky top-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 ${isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                    }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Column: Tab Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'ai' && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                <AIProvidersCard />
              </div>
            )}
            {activeTab === 'platforms' && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                <PlatformsCard />
              </div>
            )}
            {activeTab === 'invite' && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                <InviteCard />
              </div>
            )}
            {activeTab === 'auto-reply' && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                <AutoReplyCard />
              </div>
            )}
            {activeTab === 'system' && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-200">
                <SystemConfigCard />
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
