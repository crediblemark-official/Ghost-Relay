import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Database, Monitor, Palette, CheckSquare, Cpu, User, 
  Clock, Search, CheckCircle2, PlayCircle, RefreshCw, Filter, ListTodo
} from 'lucide-react'

export const Route = createFileRoute('/board')({
  component: BoardPage,
})

interface Task {
  id: string
  messageId: number
  taskIndex: number
  divisi: 'backend' | 'frontend' | 'desain' | 'qa' | 'devops' | 'general'
  deskripsi: string
  prioritas: 'tinggi' | 'sedang' | 'rendah'
  status: 'todo' | 'in_progress' | 'done'
  deadline: string | null
  senderName: string
  timestamp: string
}

function BoardPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterDivisi, setFilterDivisi] = useState<string>('all')
  const [filterPrioritas, setFilterPrioritas] = useState<string>('all')
  const [draggingOverColumn, setDraggingOverColumn] = useState<string | null>(null)

  // Fetch all tasks from backend
  const { data, isLoading, refetch, isFetching } = useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks'),
  })

  // Mutation to update task status
  const updateStatusMutation = useMutation({
    mutationFn: (args: { messageId: number; taskIndex: number; status: 'todo' | 'in_progress' | 'done' }) =>
      api.put('/tasks/status', args),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Status tugas diperbarui', {
        description: `Tugas dipindahkan ke status ${res.task.status === 'in_progress' ? 'Dalam Pengerjaan' : res.task.status === 'done' ? 'Selesai' : 'Siap Dikerjakan'}`,
      })
    },
    onError: () => {
      toast.error('Gagal memperbarui status tugas')
    },
  })

  const handleUpdateStatus = (messageId: number, taskIndex: number, status: 'todo' | 'in_progress' | 'done') => {
    updateStatusMutation.mutate({ messageId, taskIndex, status })
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, messageId: number, taskIndex: number) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ messageId, taskIndex }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggingOverColumn !== columnId) {
      setDraggingOverColumn(columnId)
    }
  }

  const handleDragLeave = () => {
    setDraggingOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: 'todo' | 'in_progress' | 'done') => {
    e.preventDefault()
    setDraggingOverColumn(null)
    try {
      const rawData = e.dataTransfer.getData('application/json')
      if (!rawData) return
      const { messageId, taskIndex } = JSON.parse(rawData)
      handleUpdateStatus(messageId, taskIndex, columnId)
    } catch (err) {
      console.error('Failed to parse drag data', err)
    }
  }

  const tasks = data?.tasks || []

  // Filter tasks based on searches & filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
                          task.senderName.toLowerCase().includes(search.toLowerCase())
    const matchesDivisi = filterDivisi === 'all' || task.divisi === filterDivisi
    const matchesPrioritas = filterPrioritas === 'all' || task.prioritas === filterPrioritas
    return matchesSearch && matchesDivisi && matchesPrioritas
  })

  const getTasksByStatus = (status: 'todo' | 'in_progress' | 'done') => {
    return filteredTasks.filter(t => t.status === status)
  }

  // Helper icons and styles
  const getDivisiIcon = (divisi: string) => {
    switch (divisi) {
      case 'backend': return <Database className="h-3.5 w-3.5" />
      case 'frontend': return <Monitor className="h-3.5 w-3.5" />
      case 'desain': return <Palette className="h-3.5 w-3.5" />
      case 'qa': return <CheckSquare className="h-3.5 w-3.5" />
      case 'devops': return <Cpu className="h-3.5 w-3.5" />
      default: return <User className="h-3.5 w-3.5" />
    }
  }

  const getDivisiColor = (divisi: string) => {
    switch (divisi) {
      case 'backend': return 'text-blue-500 border-blue-500/20 bg-blue-500/5'
      case 'frontend': return 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5'
      case 'desain': return 'text-pink-500 border-pink-500/20 bg-pink-500/5'
      case 'qa': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
      case 'devops': return 'text-amber-500 border-amber-500/20 bg-amber-500/5'
      default: return 'text-muted-foreground border-border bg-muted/5'
    }
  }

  const getPrioritasBadge = (prioritas: string) => {
    switch (prioritas) {
      case 'tinggi':
        return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20">🔴 Tinggi</span>
      case 'sedang':
        return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">🟡 Sedang</span>
      default:
        return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">🟢 Rendah</span>
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  const columns = [
    {
      id: 'todo' as const,
      title: 'Siap Dikerjakan',
      subtitle: 'Tugas baru yang diurai AI',
      color: 'border-t-slate-500',
      icon: <ListTodo className="h-4 w-4 text-slate-500" />,
      bg: 'bg-card/45'
    },
    {
      id: 'in_progress' as const,
      title: 'Sedang Dikerjakan',
      subtitle: 'Tugas dalam pengerjaan aktif',
      color: 'border-t-blue-500',
      icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
      bg: 'bg-blue-500/[0.015]'
    },
    {
      id: 'done' as const,
      title: 'Selesai',
      subtitle: 'Tugas yang telah rampung',
      color: 'border-t-emerald-500',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      bg: 'bg-emerald-500/[0.015]'
    }
  ]

  return (
    <div className="flex flex-1 flex-col bg-background min-h-screen">
      {/* Top Banner Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/40 backdrop-blur-md px-8 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Papan Kanban Tugas <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">AI-Generated</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Ekstraksi tugas otomatis dari transkrip voice note menggunakan Qwen LLM. Geser kartu untuk mengubah status pengerjaan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => refetch()} 
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Papan"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Action Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border bg-card/10 px-8 py-4">
        {/* Search */}
        <div className="relative w-72 max-w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari deskripsi tugas atau pembuat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          {/* Divisi */}
          <select
            value={filterDivisi}
            onChange={(e) => setFilterDivisi(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            <option value="all">Semua Divisi</option>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
            <option value="desain">Desain</option>
            <option value="qa">QA</option>
            <option value="devops">DevOps</option>
            <option value="general">Umum (General)</option>
          </select>

          {/* Prioritas */}
          <select
            value={filterPrioritas}
            onChange={(e) => setFilterPrioritas(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            <option value="all">Semua Prioritas</option>
            <option value="tinggi">Tinggi</option>
            <option value="sedang">Sedang</option>
            <option value="rendah">Rendah</option>
          </select>
        </div>
      </div>

      {/* Main Board Columns Area */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20 gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs">Mengambil daftar tugas...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-8 bg-muted/20">
          <div className="flex gap-6 h-full min-w-[900px] items-stretch">
            {columns.map(col => {
              const columnTasks = getTasksByStatus(col.id)
              const isOver = draggingOverColumn === col.id

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`flex flex-col w-1/3 rounded-xl border border-border bg-card/65 backdrop-blur-md overflow-hidden transition-all duration-200 border-t-4 ${col.color} ${col.bg} ${
                    isOver ? 'ring-2 ring-primary/40 border-primary scale-[1.01]' : ''
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/30">
                    <div className="flex items-center gap-2">
                      {col.icon}
                      <h2 className="text-xs font-bold text-foreground">{col.title}</h2>
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-semibold text-muted-foreground">
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[calc(100vh-270px)]">
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/80 rounded-lg">
                        <ListTodo className="h-6 w-6 opacity-20 mb-2" />
                        <span className="text-[10px]">Belum ada tugas di kolom ini</span>
                      </div>
                    ) : (
                      columnTasks.map(task => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.messageId, task.taskIndex)}
                          className="group relative flex flex-col p-4 rounded-xl border border-border bg-card hover:bg-accent/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-l-3 border-l-primary/30"
                        >
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            {/* Divisi Badge */}
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold tracking-tight uppercase ${getDivisiColor(task.divisi)}`}>
                              {getDivisiIcon(task.divisi)}
                              {task.divisi}
                            </span>
                            {/* Prioritas Badge */}
                            {getPrioritasBadge(task.prioritas)}
                          </div>

                          {/* Task Description */}
                          <p className="text-xs text-foreground font-medium leading-relaxed mb-3.5">
                            {task.deskripsi}
                          </p>

                          {/* Info Footer */}
                          <div className="flex flex-col gap-1.5 pt-3 border-t border-border/40 text-[10px] text-muted-foreground">
                            {/* Deadline */}
                            {task.deadline ? (
                              <div className="flex items-center gap-1 text-amber-500 font-medium">
                                <Clock className="h-3 w-3" />
                                <span>Tenggat: {formatDate(task.deadline)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 opacity-60">
                                <Clock className="h-3 w-3" />
                                <span>Tanpa Tenggat Waktu</span>
                              </div>
                            )}

                            {/* Original Sender & Date */}
                            <div className="flex items-center justify-between opacity-80 pt-0.5">
                              <span>Oleh: <strong className="text-foreground/90">{task.senderName}</strong></span>
                              <span>{formatDate(task.timestamp)}</span>
                            </div>
                          </div>

                          {/* Mobile Quick Action Status Changer */}
                          <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 bg-background/95 border border-border p-1 rounded-md shadow-sm">
                            {task.status !== 'todo' && (
                              <button
                                onClick={() => handleUpdateStatus(task.messageId, task.taskIndex, 'todo')}
                                className="p-1 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-colors"
                                title="Kembalikan ke Siap Dikerjakan"
                              >
                                <ListTodo className="h-3 w-3" />
                              </button>
                            )}
                            {task.status !== 'in_progress' && (
                              <button
                                onClick={() => handleUpdateStatus(task.messageId, task.taskIndex, 'in_progress')}
                                className="p-1 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-colors"
                                title="Pindahkan ke Sedang Dikerjakan"
                              >
                                <PlayCircle className="h-3 w-3" />
                              </button>
                            )}
                            {task.status !== 'done' && (
                              <button
                                onClick={() => handleUpdateStatus(task.messageId, task.taskIndex, 'done')}
                                className="p-1 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-colors"
                                title="Pindahkan ke Selesai"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
