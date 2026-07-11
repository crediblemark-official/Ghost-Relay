import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useCallback, useEffect, type DragEvent } from 'react'
import { Folder, FileText, Download, Upload, Loader2, X, FileImage, FileType as FileTypeIcon, AlertCircle, Search, SearchX, TriangleAlert, Lock, Globe, ChevronDown, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { File as FileType } from '@/types'

const MAX_FILE_SIZE = 50 * 1024 * 1024

const FOLDER_COLORS: Record<string, string> = {
  Kontrak: 'text-red-500',
  Desain: 'text-pink-500',
  Dokumen_Teknis: 'text-blue-500',
  Laporan: 'text-green-500',
  Lainnya: 'text-gray-500',
}
const DEFAULT_COLOR = 'text-gray-500'

function isImage(mime: string) { return mime.startsWith('image/') }
function isPdf(mime: string) { return mime === 'application/pdf' }

function ScopeBadge({ scope }: { scope: string }) {
  const isPrivate = scope === 'private'
  return (
    <Badge className={cn(
      'text-[9px] px-1.5 py-0 border shrink-0 gap-0.5',
      isPrivate ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
    )}>
      {isPrivate ? <Lock className="h-2 w-2" /> : <Globe className="h-2 w-2" />}
      {isPrivate ? 'Pribadi' : 'Workspace'}
    </Badge>
  )
}

function ScopeToggle({ fileId, currentScope, onSaved }: { fileId: number; currentScope: string; onSaved: () => void }) {
  const [scope, setScope] = useState(currentScope)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const toggle = async (newScope: string) => {
    if (newScope === scope) return
    setScope(newScope)
    setSaving(true); setSaved(false)
    try {
      await api.patch(`/files/${fileId}/access`, { accessScope: newScope })
      setSaving(false); setSaved(true); onSaved()
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setScope(currentScope); setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => toggle('workspace')}
        disabled={saving}
        className={cn(
          'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-all',
          scope === 'workspace' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-background text-muted-foreground border-border hover:bg-accent'
        )}
      >
        <Globe className="h-2.5 w-2.5" /> Workspace
      </button>
      <button
        type="button"
        onClick={() => toggle('private')}
        disabled={saving}
        className={cn(
          'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-all',
          scope === 'private' ? 'bg-violet-500 text-white border-violet-600' : 'bg-background text-muted-foreground border-border hover:bg-accent'
        )}
      >
        <Lock className="h-2.5 w-2.5" /> Pribadi
      </button>
      {saving && <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground" />}
      {saved && <span className="text-[10px] text-emerald-600 font-medium">Tersimpan</span>}
    </div>
  )
}

export function KnowledgeVault({ collapsed }: { collapsed?: boolean }) {
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileType | null>(null)
  const [uploadScope, setUploadScope] = useState<'workspace' | 'private'>('workspace')
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scopeMenuRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  // Close scope menu on outside click
  useEffect(() => {
    if (!scopeMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (scopeMenuRef.current && !scopeMenuRef.current.contains(e.target as Node)) setScopeMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [scopeMenuOpen])

  const { data: files = [], isLoading, isError } = useQuery<FileType[]>({
    queryKey: ['files'],
    queryFn: () => api.get('/files', { silent: true }),
    enabled: !collapsed,
  })

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
    if (searchInputRef.current) { searchInputRef.current.value = ''; searchInputRef.current.focus() }
  }, [])

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['files'] })
    queryClient.invalidateQueries({ queryKey: ['files-search'] })
  }, [queryClient])

  const doUpload = async (file: File, scope?: 'workspace' | 'private') => {
    const s = scope || uploadScope
    if (file.size > MAX_FILE_SIZE) { setUploadError(`File "${file.name}" terlalu besar (maks 50 MB)`); return }
    setUploadError(''); setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.post('/files/upload', formData, { headers: { 'X-Access-Scope': s } })
      invalidateAll()
    } catch (err) { console.error('Upload failed:', err) }
    finally { setUploading(false) }
  }

  const doUploadMultiple = async (files: FileList | File[], scope?: 'workspace' | 'private') => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return
    if (fileArray.length === 1) { doUpload(fileArray[0], scope); return }
    const s = scope || uploadScope
    setUploadError(''); setUploading(true)
    let failed = 0
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) { failed++; continue }
      try {
        const formData = new FormData()
        formData.append('file', file)
        await api.post('/files/upload', formData, { headers: { 'X-Access-Scope': s } })
      } catch { failed++ }
    }
    invalidateAll(); setUploading(false)
    if (failed > 0) setUploadError(`${failed} dari ${fileArray.length} file gagal diunggah`)
  }

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) doUploadMultiple(e.dataTransfer.files) }

  const handleDelete = async (fileId: number) => {
    if (!confirm('Hapus file ini?')) return
    setDeleting(true)
    try {
      await api.delete(`/files/${fileId}`)
      setPreviewFile(null)
      invalidateAll()
    } catch (err) { console.error('Delete failed:', err) }
    finally { setDeleting(false) }
  }

  // Group files by scope
  const workspaceFiles = files.filter(f => f.accessScope !== 'private')
  const privateFiles = files.filter(f => f.accessScope === 'private')

  const workspaceFolders = workspaceFiles.reduce<Record<string, FileType[]>>((acc, file) => {
    const folder = file.folder || 'Lainnya'
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(file)
    return acc
  }, {})

  const privateFolders = privateFiles.reduce<Record<string, FileType[]>>((acc, file) => {
    const folder = file.folder || 'Lainnya'
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(file)
    return acc
  }, {})

  // Keep previewFile in sync
  useEffect(() => {
    if (!previewFile) return
    const fresh = files.find(f => f.id === previewFile.id)
    if (fresh) setPreviewFile(fresh)
  }, [files])

  const renderFolderGroup = (folderName: string, folderFiles: FileType[]) => (
    <div key={folderName} className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Folder className={'h-3.5 w-3.5 ' + (FOLDER_COLORS[folderName] || DEFAULT_COLOR)} />
        <span className="text-xs font-medium">{folderName}</span>
        <Badge variant="secondary" className="text-[10px]">{folderFiles.length}</Badge>
      </div>
      <div className="ml-5 space-y-0.5">
        {folderFiles.map((file) => (
          <div key={file.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent cursor-pointer" onClick={() => setPreviewFile(file)}>
            {isImage(file.fileType) ? <FileImage className="h-3 w-3 text-muted-foreground shrink-0" /> : <FileText className="h-3 w-3 text-muted-foreground shrink-0" />}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs truncate">{file.originalName}</span>
              <span className="text-[10px] text-muted-foreground">{file.uploaderName}</span>
            </div>
            <a href={'/api/files/download/' + file.id} download className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
              <Download className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSearchResults = () => (
    <div className="p-3">
      {isSearching ? (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Mencari...</span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <SearchX className="h-5 w-5" /><span className="text-xs text-center">Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;</span>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground mb-2">{searchResults.length} hasil</p>
          {searchResults.map((file) => (
            <div key={file.id} className="rounded-lg border border-border p-2 hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => setPreviewFile(file)}>
              <div className="flex items-center gap-2 mb-1">
                {isImage(file.fileType) ? <FileImage className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                <span className="text-xs font-medium truncate flex-1">{file.originalName}</span>
                <ScopeBadge scope={file.accessScope} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground">{file.uploaderName}</span>
                <Badge variant="outline" className="text-[10px]">{file.folder}</Badge>
              </div>
              {file.extractedText && <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mt-1">{file.extractedText}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-xl p-6 text-center space-y-4 bg-card/40 mx-2 select-none min-h-[220px]">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Upload className="h-5 w-5" /></div>
      <div className="space-y-1 px-2">
        <p className="text-xs font-semibold text-foreground">Unggah Dokumen Anda</p>
        <p className="text-[11px] text-muted-foreground leading-normal">Tarik & lepas file di sini</p>
      </div>
      <div className="flex flex-col gap-2 w-full pt-2">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all" style={{ boxShadow: '0 0 12px oklch(0.6 0.22 264 / 20%)' }}>
          <Upload className="h-3.5 w-3.5" /> Pilih File
        </button>
        <button type="button" onClick={() => searchInputRef.current?.focus()} className="w-full h-8 rounded-lg border border-border bg-background text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-accent transition-all">
          <Search className="h-3.5 w-3.5" /> Cari File
        </button>
      </div>
    </div>
  )

  const scopeLabel = uploadScope === 'workspace' ? 'Workspace' : 'Pribadi'
  const ScopeIcon = uploadScope === 'workspace' ? Globe : Lock

  return (
    <aside className={cn(
      "flex w-72 flex-col border-l border-border bg-card transition-all duration-300 overflow-hidden shrink-0",
      collapsed && "w-0 border-l-0"
    )}>
      {/* Search & Upload */}
      <div className="p-3 pb-2 flex items-center gap-2 border-b border-border bg-card">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari file..."
            className="h-8 w-full pl-8 pr-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Upload button with scope dropdown */}
        <div className="relative flex shrink-0" ref={scopeMenuRef}>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="h-8 px-2 flex items-center justify-center gap-1 rounded-l-lg border border-r-0 border-border bg-primary text-primary-foreground text-[10px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            title={`Unggah ke ${scopeLabel}`}>
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={() => setScopeMenuOpen(!scopeMenuOpen)} disabled={uploading}
            className="h-8 w-7 flex items-center justify-center rounded-r-lg border border-border bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
            title="Pilih target unggahan">
            <ChevronDown className={cn("h-3 w-3 transition-transform", scopeMenuOpen && "rotate-180")} />
          </button>

          {scopeMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-border bg-popover shadow-lg p-1 fade-slide-in">
              <button
                type="button"
                onClick={() => { setUploadScope('workspace'); setScopeMenuOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                  uploadScope === 'workspace' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'hover:bg-accent'
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Workspace</span>
                {uploadScope === 'workspace' && <span className="ml-auto text-emerald-500">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => { setUploadScope('private'); setScopeMenuOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                  uploadScope === 'private' ? 'bg-violet-50 text-violet-700 font-medium' : 'hover:bg-accent'
                )}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Pribadi</span>
                {uploadScope === 'private' && <span className="ml-auto text-violet-500">✓</span>}
              </button>
              <div className="h-px bg-border my-1" />
              <p className="px-2.5 py-1 text-[10px] text-muted-foreground leading-tight">
                {uploadScope === 'workspace' ? 'Semua anggota bisa melihat' : 'Hanya Anda yang bisa melihat'}
              </p>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" className="hidden"
          onChange={(e) => { if (e.target.files?.length) doUploadMultiple(e.target.files); e.target.value = '' }}
          disabled={uploading} multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.md,.png,.jpg,.jpeg,.gif,.webp,.mp3,.wav,.ogg,.mp4,.webm"
        />
      </div>

      {uploadError && (
        <div className="mx-3 mt-2 flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-1.5 text-[11px] text-destructive fade-slide-in">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate flex-1">{uploadError}</span>
          <button onClick={() => setUploadError('')} className="text-destructive/60 hover:text-destructive"><X className="h-3 w-3" /></button>
        </div>
      )}

      {/* File Preview */}
      {previewFile && (
        <div className="border-b border-border p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium truncate flex-1">{previewFile.originalName}</span>
            <ScopeToggle fileId={Number(previewFile.id)} currentScope={previewFile.accessScope} onSaved={invalidateAll} />
            <button onClick={() => handleDelete(Number(previewFile.id))} disabled={deleting} className="text-muted-foreground hover:text-destructive transition-colors" title="Hapus file">
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </button>
            <button onClick={() => setPreviewFile(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-muted-foreground">oleh {previewFile.uploaderName}</span>
          </div>
          {isImage(previewFile.fileType) ? (
            <img src={`/api/files/download/${previewFile.id}`} alt={previewFile.originalName} className="max-h-48 w-full object-contain rounded border" />
          ) : isPdf(previewFile.fileType) ? (
            <iframe src={`/api/files/download/${previewFile.id}`} className="w-full h-48 rounded border" title={previewFile.originalName} />
          ) : (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-xs border rounded">
              <FileTypeIcon className="h-8 w-8 mr-2" /> Preview tidak tersedia
            </div>
          )}
          <a href={`/api/files/download/${previewFile.id}`} download className="flex items-center justify-center gap-1 mt-2 text-xs text-primary hover:underline">
            <Download className="h-3 w-3" /> Download
          </a>
        </div>
      )}

      {/* File List */}
      <ScrollArea className="flex-1" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className={cn(
          'p-3 min-h-full transition-colors flex flex-col',
          (files.length === 0 || dragOver) && 'justify-center',
          dragOver && 'bg-primary/5'
        )}>
          {dragOver ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary bg-primary/5 rounded-xl p-8 text-center space-y-2 animate-pulse min-h-[220px] mx-2">
              <Upload className="h-8 w-8 text-primary" />
              <p className="text-xs font-semibold text-primary">Lepaskan file di sini</p>
              <div className="flex items-center gap-1.5 text-[11px] text-primary/70">
                <ScopeIcon className="h-3 w-3" />
                <span>Masuk ke: <strong>{scopeLabel}</strong></span>
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-3 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}><div className="flex items-center gap-2 mb-2"><Skeleton className="h-4 w-4" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-6 rounded-full" /></div>
                  <div className="ml-6 space-y-1"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-3/4" /></div></div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground">
              <AlertCircle className="h-5 w-5" /><span className="text-xs">Gagal memuat vault</span>
            </div>
          ) : searchQuery ? (
            renderSearchResults()
          ) : files.length === 0 ? (
            renderEmpty()
          ) : (
            <>
              {workspaceFiles.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-foreground">File Workspace</span>
                    <Badge variant="secondary" className="text-[10px]">{workspaceFiles.length}</Badge>
                  </div>
                  {Object.entries(workspaceFolders).map(([folderName, folderFiles]) => renderFolderGroup(folderName, folderFiles))}
                </div>
              )}

              {privateFiles.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lock className="h-3.5 w-3.5 text-violet-500" />
                    <span className="text-xs font-semibold text-foreground">File Pribadi</span>
                    <Badge variant="secondary" className="text-[10px]">{privateFiles.length}</Badge>
                  </div>
                  {Object.entries(privateFolders).map(([folderName, folderFiles]) => renderFolderGroup(folderName, folderFiles))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
