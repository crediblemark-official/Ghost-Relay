import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Brain, Globe, FileText, Settings as SettingsIcon, Link as LinkIcon, Bot,
  MessageSquare, User, Bell, Shield, ArrowRight, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { AIProvidersCard } from '@/components/settings/AIProvidersCard'
import { PlatformsCard } from '@/components/settings/PlatformsCard'
import { DailyReportsCard } from '@/components/settings/DailyReportsCard'
import { SystemConfigCard } from '@/components/settings/SystemConfigCard'
import { InviteCard } from '@/components/settings/InviteCard'
import { AutoReplyCard } from '@/components/settings/AutoReplyCard'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<'ai' | 'platforms' | 'reports' | 'invite' | 'auto-reply' | 'system'>('ai')

  const tabs = [
    { id: 'ai', label: 'AI Providers', icon: Brain, description: 'LLM, embeddings, providers' },
    { id: 'platforms', label: 'Platforms', icon: Globe, description: 'Telegram, WhatsApp, Slack' },
    { id: 'reports', label: 'Daily Reports', icon: FileText, description: 'Cron & delivery settings' },
    { id: 'invite', label: 'Team Invite', icon: LinkIcon, description: 'Share invite link' },
    { id: 'auto-reply', label: 'Auto Reply', icon: Bot, description: 'AI auto-reply toggle' },
    { id: 'system', label: 'System Config', icon: SettingsIcon, description: 'Environment variables' },
  ] as const

  const quickLinks = [
    { to: '/chat', label: 'Main Chat', icon: MessageSquare, description: 'Back to conversations' },
    { to: '/profile', label: 'Profile', icon: User, description: 'Edit name & password' },
    { to: '/notifications', label: 'Notifications', icon: Bell, description: 'View all notifications' },
    ...(user?.role === 'owner' ? [{ to: '/admin' as const, label: 'Admin Dashboard', icon: Shield, description: 'Workspace & user overview' }] : []),
  ]

  return (
    <div className="flex flex-1 bg-background text-foreground min-h-screen overflow-y-auto">
      <div className="flex flex-1 max-w-6xl w-full mx-auto p-8 gap-8">

        {/* ===== Left Sidebar ===== */}
        <div className="w-60 shrink-0 space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              Configure workspace, AI models, daily reports, and credentials.
            </p>
          </div>

          {/* Settings Nav */}
          <nav className="space-y-0.5">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`sidebar-active-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/8 text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate">{tab.label}</div>
                    <div className={`text-[10px] font-normal mt-0.5 truncate ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                      {tab.description}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-primary shrink-0" />}
                </button>
              )
            })}
          </nav>

          {/* Quick Links */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-1 pb-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Quick Links</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <nav className="space-y-0.5">
              {quickLinks.map(link => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 text-muted-foreground hover:bg-accent/60 hover:text-foreground group"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] truncate">{link.label}</div>
                      <div className="text-[10px] text-muted-foreground/50 font-normal mt-0.5 truncate">{link.description}</div>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-all -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* ===== Right: Tab Content ===== */}
        <div className="flex-1 min-w-0 space-y-5">
          {activeTab === 'ai' && (
            <div className="animate-in fade-in slide-in-from-right-3 duration-200">
              <AIProvidersCard />
            </div>
          )}
          {activeTab === 'platforms' && (
            <div className="animate-in fade-in slide-in-from-right-3 duration-200">
              <PlatformsCard />
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="animate-in fade-in slide-in-from-right-3 duration-200">
              <DailyReportsCard />
            </div>
          )}
          {activeTab === 'invite' && (
            <div className="animate-in fade-in slide-in-from-right-3 duration-200">
              <InviteCard />
            </div>
          )}
          {activeTab === 'auto-reply' && (
            <div className="animate-in fade-in slide-in-from-right-3 duration-200">
              <AutoReplyCard />
            </div>
          )}
          {activeTab === 'system' && (
            <div className="animate-in fade-in slide-in-from-right-3 duration-200">
              <SystemConfigCard />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
