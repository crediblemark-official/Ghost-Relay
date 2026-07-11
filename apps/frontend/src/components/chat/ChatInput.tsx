import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Mic, Square, ArrowUp, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
} from '@/components/ai-elements/prompt-input'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface ChatInputProps {
  onSend: (content: string, files?: File[]) => void
  onVoiceRecord: () => void
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed && selectedFiles.length === 0) return
    onSend(trimmed, selectedFiles.length > 0 ? [...selectedFiles] : undefined)
    setValue('')
    setSelectedFiles([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, selectedFiles, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isStreaming = streamingStatus === 'streaming' || streamingStatus === 'submitted'
  const hasText = value.trim().length > 0
  const canSend = hasText || selectedFiles.length > 0

  return (
    <div className="border-t border-border/50 bg-background px-4 pb-4 pt-3">
      {/* Pill container */}
      <div className={cn(
        'flex items-end gap-2 rounded-full border bg-card px-3 py-2 shadow-sm transition-all duration-200',
        'focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10',
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
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              <Image className="mr-2 size-4" /> Upload file
            </DropdownMenuItem>
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
            e.target.value = ''
          }}
        />

        {/* Selected file chips */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedFiles.map((file, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {file.name}
                <button
                  type="button"
                  onClick={() => setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="rounded-full hover:bg-secondary-foreground/20 p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

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

        {/* Mic icon — langsung buka VoiceRecorder, tidak inline record */}
        <button
          type="button"
          onClick={onVoiceRecord}
          className="shrink-0 mb-0.5 h-7 w-7 flex items-center justify-center rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-accent"
          title="Voice note"
        >
          <Mic className="h-4 w-4" />
        </button>

        {/* Send / Stop Streaming button */}
        {(canSend || isStreaming) && (
          <button
            type="button"
            onClick={isStreaming ? onStopStreaming : handleSend}
            disabled={!canSend && !isStreaming}
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

      {/* Hint footer */}
      <p className="mt-1.5 text-center text-[10px] text-muted-foreground/30 select-none">
        Enter untuk kirim · Shift+Enter baris baru
      </p>
    </div>
  )
}
