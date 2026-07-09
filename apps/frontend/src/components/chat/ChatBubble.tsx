import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import type { Message as MessageType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import { Loader2, Trash2, Sparkles } from 'lucide-react'

interface ChannelMeta {
  id: string
  platform: string
  label: string
  color: string
}

// Warna per-platform — konsisten dengan ChannelList
const PLATFORM_BADGE: Record<string, string> = {
  whatsapp: 'border-emerald-500/20 bg-emerald-500/8 text-emerald-500',
  telegram: 'border-sky-500/20 bg-sky-500/8 text-sky-500',
  slack: 'border-violet-500/20 bg-violet-500/8 text-violet-500',
  web: 'border-primary/20 bg-primary/8 text-primary',
}

const PLATFORM_LABELS: Record<string, string> = {
  whatsapp: 'WA',
  telegram: 'TG',
  slack: 'SL',
  web: 'WEB',
}

interface ChatBubbleProps {
  message: MessageType
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const queryClient = useQueryClient()
  const [deleting, setDeleting] = useState(false)
  const { data: channels = [] } = useQuery<ChannelMeta[]>({
    queryKey: ['platform-meta'],
    queryFn: () => api.get('/settings/platforms/meta', { silent: true }),
    staleTime: 60000,
  })

  const meta = channels.find((c) => c.platform === message.platform)
  const platformLabel = meta?.label || PLATFORM_LABELS[message.platform] || message.platform.toUpperCase()
  const platformBadgeClass = PLATFORM_BADGE[message.platform] || 'border-border bg-muted text-muted-foreground'

  const isOutgoing = message.isOutgoing
  const isAssistant = message.senderId === 'ai-assistant'
  const isVoiceNote = message.messageType === 'voice_note'
  const isProcessing = isVoiceNote && (message.content || '').toLowerCase().includes('processing')
  const isVoiceProcessed = message.messageType === 'voice_processed'

  const handleDelete = async () => {
    if (!window.confirm('Hapus pesan ini?')) return
    setDeleting(true)
    try {
      await api.delete(`/messages/${message.id}`, { silent: true })
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success('Pesan berhasil dihapus')
    } catch {
      // error handled by api.ts
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="group relative">
      {/* Delete button — muncul saat hover */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150 flex h-6 w-6 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive disabled:opacity-30"
        title="Hapus pesan"
      >
        {deleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
      </button>

      <Message
        from={isOutgoing ? 'user' : 'assistant'}
        className={cn(isVoiceNote && 'opacity-80')}
      >
        {/* Platform badge + sender name untuk pesan incoming dari platform */}
        {!isOutgoing && !isAssistant && (
          <div className="flex items-center gap-1.5 px-0.5 mb-1">
            <span className="text-[11px] font-semibold text-foreground/80">
              {message.senderName}
            </span>
            <Badge
              variant="outline"
              className={cn('text-[9px] font-bold px-1.5 py-0 h-4 rounded uppercase tracking-wide', platformBadgeClass)}
            >
              {platformLabel}
            </Badge>
          </div>
        )}

        {/* AI assistant label */}
        {isAssistant && (
          <div className="flex items-center gap-1.5 px-0.5 mb-1">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-primary/10">
              <Sparkles className="h-2.5 w-2.5 text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-primary">
              {message.senderName}
            </span>
          </div>
        )}

        <MessageContent>
          {isProcessing ? (
            <span className="italic text-muted-foreground text-sm flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin shrink-0" />
              {message.content}
            </span>
          ) : isVoiceProcessed ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          ) : (
            <MessageResponse>{message.content}</MessageResponse>
          )}

          {/* RAG Source badges */}
          {isAssistant && message.ragSources && message.ragSources.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-primary/10">
              <span className="text-[9px] text-muted-foreground/60 w-full font-medium uppercase tracking-wider">Sumber</span>
              {message.ragSources.map((src) => (
                <Badge
                  key={src}
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 h-4 border-primary/20 bg-primary/5 text-primary/70 font-normal"
                >
                  {src}
                </Badge>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <span className="text-[10px] text-muted-foreground/40 self-end mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </MessageContent>
      </Message>
    </div>
  )
}
