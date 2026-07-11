import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useCallback, useEffect } from 'react'
import { ChatList } from '@/components/chat/ChatList'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChannelList } from '@/components/sidebar/ChannelList'
import { KnowledgeVault } from '@/components/sidebar/KnowledgeVault'
import { useMessages, useSendMessage, useUploadVoice, useVoiceCommand } from '@/hooks/useMessages'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAiChat } from '@/hooks/useAiChat'
import { VoiceRecorder } from '@/components/chat/VoiceRecorder'
import { MemorySearch } from '@/components/chat/MemorySearch'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Trash2, Search, Sparkles } from 'lucide-react'
import type { Message } from '@/types'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('all')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [showRecorder, setShowRecorder] = useState(false)
  const [clearingChat, setClearingChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(
    activeChannel !== 'all' ? activeChannel : undefined,
    searchQuery,
    activeChannel === 'web' ? activeSessionId : undefined,
  )
  const messages = data?.pages.flatMap((p) => p.messages) ?? []

  // Track whether title has been generated for this session
  const titleGeneratedRef = useRef<Set<string>>(new Set())

  // AI streaming chat — persist AI response setelah streaming selesai
  const ragSourcesRef = useRef<string[]>([])
  const aiChat = useAiChat({
    sessionId: activeSessionId,
    onFinish: (content) => {
      if (!content) return
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      api.post('/messages/send', {
        platform: 'web',
        receiver_id: '',
        content,
        session_id: activeSessionId ?? undefined,
        sender_id: 'ai-assistant',
        sender_name: 'Asisten AI',
        is_outgoing: false,
        rag_sources: ragSourcesRef.current,
      })

      // Generate AI title for first exchange in session
      if (activeSessionId && !titleGeneratedRef.current.has(activeSessionId)) {
        titleGeneratedRef.current.add(activeSessionId)
        api.post(`/sessions/${activeSessionId}/generate-title`, {}).then(() => {
          queryClient.invalidateQueries({ queryKey: ['sessions'] })
        }).catch(() => {})
      }
    },
  })
  ragSourcesRef.current = aiChat.ragSources

  // Gabungkan pesan reguler dengan streaming AI message
  const displayMessages: Message[] = aiChat.isStreaming
    ? [
        ...messages,
        {
          id: 'ai-streaming',
          userId: '',
          platform: 'web',
          senderId: 'ai-assistant',
          senderName: 'Asisten AI',
          content: aiChat.streamingContent || '...',
          messageType: 'text',
          timestamp: new Date(),
          isOutgoing: false,
          ragSources: aiChat.ragSources,
        },
      ]
    : messages

  const sentinelRef = useRef<HTMLDivElement>(null)

  // Scroll ke pesan spesifik dari URL hash
  useEffect(() => {
    if (messages.length === 0) return
    const hash = window.location.hash
    if (!hash || !hash.startsWith('#message-')) return
    const msgId = hash.replace('#message-', '')
    const el = document.getElementById(`message-${msgId}`)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-primary/40', 'rounded-lg', 'transition-all', 'duration-1000')
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-primary/40')
        }, 2000)
        window.history.replaceState(null, '', '/chat')
      }, 400)
    }
  }, [messages])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const sendMutation = useSendMessage()
  const voiceMutation = useUploadVoice()
  const voiceCommandMutation = useVoiceCommand()

  // Create new session
  const handleNewSession = useCallback(async () => {
    try {
      const res = await api.post<{ id: string }>('/sessions', {})
      setActiveSessionId(res.id)
      setActiveChannel('web')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    } catch {
      // fallback: just reset
      setActiveSessionId(null)
      setActiveChannel('web')
    }
  }, [queryClient])

  // Select existing session
  const handleSelectSession = useCallback((sessionId: string | null) => {
    setActiveSessionId(sessionId)
    if (sessionId) setActiveChannel('web')
  }, [])

  // Select channel (not session)
  const handleSelectChannel = useCallback((channelId: string) => {
    if (channelId !== 'web') {
      setActiveSessionId(null)
    }
    setActiveChannel(channelId)
  }, [])

  const handleClearChat = useCallback(async () => {
    const msg = activeSessionId
      ? 'Hapus semua pesan di sesi ini?'
      : 'Hapus semua pesan di chat ini? Tindakan ini tidak bisa dibatalkan.'
    if (!window.confirm(msg)) return
    setClearingChat(true)
    try {
      if (activeSessionId) {
        // Delete the whole session
        await api.delete(`/sessions/${activeSessionId}`, { silent: true })
        setActiveSessionId(null)
        queryClient.invalidateQueries({ queryKey: ['sessions'] })
      } else {
        await api.post('/messages/clear', {}, { silent: true })
      }
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success(activeSessionId ? 'Sesi berhasil dihapus' : 'Semua pesan berhasil dihapus')
    } catch {
      // error sudah di-handle oleh api.ts
    } finally {
      setClearingChat(false)
    }
  }, [queryClient, setClearingChat, activeSessionId])

  const handleSend = useCallback(
    (content: string, files?: File[]) => {
      const platform = activeChannel === 'all' ? 'web' : activeChannel

      // 1. Upload files first if any
      if (files && files.length > 0) {
        for (const file of files) {
          const fd = new FormData()
          fd.append('file', file)
          fetch('/api/files/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('ghost_token')?.replace(/^"|"$/g, '') || ''}` },
            body: fd,
          }).catch(() => {})
        }
      }

      // 2. Simpan pesan user ke backend
      sendMutation.mutate({
        platform,
        receiver_id: platform === 'web' ? '' : '1',
        content,
        session_id: activeSessionId ?? undefined,
      })

      // 3. Kirim ke AI streaming endpoint untuk response
      aiChat.sendMessage(content)
    },
    [activeChannel, activeSessionId, sendMutation, aiChat],
  )

  const handleVoice = async (blob: Blob) => {
    try {
      await voiceCommandMutation.mutateAsync(blob)
    } catch {
      voiceMutation.mutate(blob)
    }
    setShowRecorder(false)
  }

  // Label channel aktif
  const channelLabel =
    activeSessionId
      ? 'AI Assistant'
      : activeChannel === 'all'
        ? 'Semua Pesan'
        : activeChannel === 'web'
          ? 'AI Assistant'
          : activeChannel.charAt(0).toUpperCase() + activeChannel.slice(1)

  return (
    <>
      <ChannelList
        activeId={activeChannel}
        activeSessionId={activeSessionId}
        onSelect={handleSelectChannel}
        onSelectSession={handleSelectSession}
        collapsed={leftCollapsed}
        onNewSession={handleNewSession}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ===== Chat Header ===== */}
        <div className="flex h-14 items-center justify-between border-b border-border bg-card/90 backdrop-blur-sm px-4 gap-3 shrink-0">
          {/* Left side */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLeftCollapsed(!leftCollapsed)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={leftCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
            >
              {leftCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <div className="flex flex-col leading-none">
              <h1 className="text-[13px] font-semibold text-foreground">{channelLabel}</h1>
              {aiChat.isStreaming && (
                <span className="text-[10px] text-primary flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  AI sedang merespons...
                </span>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Search toggle */}
            <div className="flex items-center gap-1.5">
              {showSearch ? (
                <div className="flex items-center gap-1.5 fade-slide-in">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Cari pesan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
                      className="h-7 w-52 rounded-lg border border-input bg-background pl-7 pr-3 text-xs outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => { setShowSearch(false); setSearchQuery('') }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="Cari pesan"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            <MemorySearch />

            {/* Clear chat */}
            <button
              onClick={handleClearChat}
              disabled={clearingChat || messages.length === 0}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
              title={activeSessionId ? 'Hapus sesi ini' : 'Hapus semua pesan'}
            >
              {clearingChat ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>

            <div className="h-4 w-px bg-border mx-0.5" />

            <button
              onClick={() => setRightCollapsed(!rightCollapsed)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={rightCollapsed ? 'Buka Knowledge Vault' : 'Tutup Knowledge Vault'}
            >
              {rightCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ===== Chat Body ===== */}
        {isLoading ? (
          <div className="flex flex-1 flex-col gap-4 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 max-w-[65%]">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className={`h-14 w-full rounded-xl ${i % 2 === 0 ? '' : 'ml-auto'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive text-lg">⚠</span>
              </div>
              <p className="text-sm font-medium text-destructive">Gagal memuat pesan</p>
              <p className="text-xs text-muted-foreground">Periksa koneksi server</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div ref={sentinelRef} className="h-4" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/50" />
              </div>
            )}
            <ChatList messages={displayMessages} />
          </div>
        )}

        {/* ===== Input Area ===== */}
        {showRecorder ? (
          <div className="flex items-center justify-center gap-4 border-t border-border bg-card/90 backdrop-blur-sm p-4">
            <VoiceRecorder onComplete={handleVoice} />
            <button
              onClick={() => setShowRecorder(false)}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              Batal
            </button>
          </div>
        ) : (
          <ChatInput
            onSend={handleSend}
            onVoiceRecord={() => setShowRecorder(true)}
            streamingStatus={aiChat.isStreaming ? aiChat.status : undefined}
            onStopStreaming={aiChat.stop}
          />
        )}
      </div>
      <KnowledgeVault collapsed={rightCollapsed} />
    </>
  )
}
