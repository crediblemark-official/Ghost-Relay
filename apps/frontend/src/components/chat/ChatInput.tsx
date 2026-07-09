import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Mic, AudioWaveform, Square, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
} from '@/components/ai-elements/prompt-input'

interface ChatInputProps {
  onSend: (content: string) => void
  onVoiceRecord: () => void
  isRecording?: boolean
  streamingStatus?: string
  onStopStreaming?: () => void
}

export function ChatInput({
  onSend,
  onVoiceRecord,
  streamingStatus,
  onStopStreaming,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Voice record (inline, tanpa modal)
  const startVoice = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        setIsVoiceRecording(false)
        onVoiceRecord()
      }
      recorder.start()
      setIsVoiceRecording(true)
    } catch {
      // mic tidak tersedia
    }
  }, [onVoiceRecord])

  const stopVoice = useCallback(() => {
    mediaRecorderRef.current?.stop()
  }, [])

  const isStreaming = streamingStatus === 'streaming' || streamingStatus === 'submitted'
  const hasText = value.trim().length > 0

  return (
    <div className="border-t border-border/50 bg-background px-4 pb-4 pt-3">
      {/* Pill container */}
      <div className={cn(
        'flex items-end gap-2 rounded-full border bg-card px-3 py-2 shadow-sm transition-all duration-200',
        'focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10',
        isVoiceRecording && 'border-destructive/40 ring-2 ring-destructive/10',
      )}>

        {/* + Attachment button */}
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger
            tooltip="Tambah file"
            className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent mb-0.5"
          >
            <Plus className="h-4 w-4" />
          </PromptInputActionMenuTrigger>
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments label="Upload file" />
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan apa saja"
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none min-h-[28px] max-h-[160px] py-1 leading-relaxed"
        />

        {/* Mic icon (inline kanan) */}
        <button
          type="button"
          onClick={isVoiceRecording ? stopVoice : startVoice}
          className={cn(
            'shrink-0 mb-0.5 h-7 w-7 flex items-center justify-center rounded-full transition-all',
            isVoiceRecording
              ? 'text-destructive animate-pulse'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
          title={isVoiceRecording ? 'Stop recording' : 'Voice note'}
        >
          <Mic className="h-4 w-4" />
        </button>

        {/* Send / Stop Streaming button */}
        {(hasText || isStreaming) && (
          <button
            type="button"
            onClick={isStreaming ? onStopStreaming : handleSend}
            disabled={!hasText && !isStreaming}
            className={cn(
              'shrink-0 mb-0.5 h-7 w-7 flex items-center justify-center rounded-full transition-all',
              isStreaming
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {isStreaming ? (
              <Square className="h-3 w-3 fill-current" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Voice recording button — amber circle luar (style screenshot) */}
      {isVoiceRecording && (
        <div className="flex items-center justify-center mt-2 gap-2 fade-slide-in">
          <button
            type="button"
            onClick={stopVoice}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-colors"
            style={{ boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)' }}
          >
            <AudioWaveform className="h-5 w-5 animate-pulse" />
          </button>
          <span className="text-xs text-muted-foreground animate-pulse">Merekam...</span>
        </div>
      )}

      {/* Hint footer */}
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground/30 select-none">
        Enter untuk kirim · Shift+Enter baris baru
      </p>
    </div>
  )
}
