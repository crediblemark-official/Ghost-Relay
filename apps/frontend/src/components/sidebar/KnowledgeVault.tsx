import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useCallback, useEffect, type DragEvent } from 'react'
import { Folder, FileText, Download, Upload, Loader2, X, FileImage, FileType as FileTypeIcon, AlertCircle, Search, SearchX, TriangleAlert } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { File as FileType } from '@/types'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

const FOLDER_COLORS: Record<string, string> = {
  Kontrak: 'text-red-500',
  Desain: 'text-pink-500',
  Dokumen_Teknis: 'text-blue-500',
  Laporan: 'text-green-500',
  Lainnya: 'text-gray-500',
}

const DEFAULT_COLOR = 'text-gray-500'

function isImage(mime: string): boolean {
  return mime.startsWith('image/')
}

function isPdf(mime: string): boolean {
  return mime === 'application/pdf'
}

export function KnowledgeVault({ collapsed }: { collapsed?: boolean }) {
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const { data: files = [], isLoading, isError } = useQuery<FileType[]>({
    queryKey: ['files'],
    queryFn: () => api.get('/files', { silent: true }),
  })

  // Search results — enabled only when searchQuery has text
  const { data: searchResults = [], isFetching: isSearching } = useQuery<FileType[]>({
    queryKey: ['files-search', searchQuery],
    queryFn: () => api.post('/files/search', { query: searchQuery, limit: 20 }, { silent: true }),
    enabled: searchQuery.length > 0,
  })

  const handleSearchChange = useCallback((value: string) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearchQuery(value), 300)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
      searchInputRef.current.focus()
    }
  }, [])

  const doUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File too large (max 50 MB)`)
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.post('/files/upload', formData)
      queryClient.invalidateQueries({ queryKey: ['files'] })
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    doUpload(file)
    e.target.value = ''
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) doUpload(file)
  }

  const folders = files.reduce<Record<string, FileType[]>>((acc, file) => {
    const folder = file.folder || 'Lainnya'
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(file)
    return acc
  }, {})

  return (
    <aside className={cn(
      "flex w-72 flex-col border-l border-border bg-card transition-all duration-300 overflow-hidden shrink-0",
      collapsed && "w-0 border-l-0"
    )}>
      {/* Sticky Search & Upload Bar */}
      <div className="p-3 pb-2 flex items-center gap-2 border-b border-border bg-card">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari file..."
            className="h-8 w-full pl-8 pr-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-95 disabled:opacity-50"
          title="Unggah file"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
          accept=".pdf,.doc,.docx,.txt,.csv,.md,.png,.jpg,.jpeg,.gif,.webp,.mp3,.wav,.ogg,.mp4,.webm"
        />
      </div>

      {uploadError && (
        <div className="mx-3 mt-2 flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-1.5 text-[11px] text-destructive fade-slide-in">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate flex-1">{uploadError}</span>
          <button onClick={() => setUploadError('')} className="text-destructive/60 hover:text-destructive">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {previewFile && (
        <div className="border-b border-border p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium truncate">{previewFile.originalName}</span>
            <button onClick={() => setPreviewFile(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
          {isImage(previewFile.fileType) ? (
            <img
              src={`/api/files/download/${previewFile.id}`}
              alt={previewFile.originalName}
              className="max-h-48 w-full object-contain rounded border"
            />
          ) : isPdf(previewFile.fileType) ? (
            <iframe
              src={`/api/files/download/${previewFile.id}`}
              className="w-full h-48 rounded border"
              title={previewFile.originalName}
            />
          ) : (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-xs border rounded">
              <FileTypeIcon className="h-8 w-8 mr-2" />
              Preview tidak tersedia
            </div>
          )}
          <a
            href={`/api/files/download/${previewFile.id}`}
            download
            className="flex items-center justify-center gap-1 mt-2 text-xs text-primary hover:underline"
          >
            <Download className="h-3 w-3" /> Download
          </a>
        </div>
      )}

      <ScrollArea
        className="flex-1"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            'p-3 min-h-full transition-colors flex flex-col',
            (Object.keys(folders).length === 0 || dragOver) && 'justify-center',
            dragOver && 'bg-primary/5'
          )}
        >
          {dragOver ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary bg-primary/5 rounded-xl p-8 text-center space-y-2 animate-pulse min-h-[220px] mx-2">
              <Upload className="h-8 w-8 text-primary" />
              <p className="text-xs font-semibold text-primary">Lepaskan file di sini untuk mengunggah</p>
            </div>
          ) : isLoading ? (
            <div className="p-3 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-6 rounded-full" />
                  </div>
                  <div className="ml-6 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs">Gagal memuat vault</span>
            </div>
          ) : searchQuery ? (
            <div className="p-3">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Mencari...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <SearchX className="h-5 w-5" />
                  <span className="text-xs text-center">
                    Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    {searchResults.length} hasil untuk &quot;{searchQuery}&quot;
                  </p>
                  {searchResults.map((file) => (
                    <div
                      key={file.id}
                      className="rounded-lg border border-border p-2 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => setPreviewFile(file)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isImage(file.fileType) ? (
                          <FileImage className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-xs font-medium truncate flex-1">
                          {file.originalName}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {file.folder}
                        </Badge>
                      </div>
                      {file.extractedText && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                          {file.extractedText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : Object.keys(folders).length === 0 ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-6 text-center space-y-4 bg-card/40 mx-2 select-none min-h-[220px]">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload className="h-5 w-5" />
              </div>
              <div className="space-y-1 px-2">
                <p className="text-xs font-semibold text-foreground">Unggah Dokumen Anda</p>
                <p className="text-[11px] text-muted-foreground leading-normal">Tarik & lepas file di sini untuk mengunggah otomatis</p>
              </div>
              <div className="flex flex-col gap-2 w-full pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ boxShadow: '0 0 12px oklch(0.6 0.22 264 / 20%)' }}
                >
                  <Upload className="h-3.5 w-3.5" /> Pilih File
                </button>
                <button
                  type="button"
                  onClick={() => searchInputRef.current?.focus()}
                  className="w-full h-8 rounded-lg border border-border bg-background text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-accent transition-all"
                >
                  <Search className="h-3.5 w-3.5" /> Cari File
                </button>
              </div>
            </div>
          ) : (
            Object.entries(folders).map(([folderName, folderFiles]) => (
              <div key={folderName} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Folder
                    className={'h-4 w-4 ' + (FOLDER_COLORS[folderName] || DEFAULT_COLOR)}
                  />
                  <span className="text-sm font-medium">{folderName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {folderFiles.length}
                  </Badge>
                </div>
                <div className="ml-6 space-y-1">
                  {folderFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    >
                      {isImage(file.fileType) ? (
                        <FileImage className="h-3 w-3 text-muted-foreground shrink-0" />
                      ) : (
                        <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-xs truncate flex-1">
                        {file.originalName}
                      </span>
                      <a
                        href={'/api/files/download/' + file.id}
                        download
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
