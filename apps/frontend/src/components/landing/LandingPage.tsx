import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { 
  Ghost, 
  Shield, 
  ArrowRight, 
  Play, 
  Search,
  FileText,
  Mic,
  MessageSquare,
  Sparkles,
  Zap,
  Lock,
  Check
} from 'lucide-react'

export function LandingPage() {
  const [typedQuery, setTypedQuery] = useState('')
  const [activeStep, setActiveStep] = useState(1)
  const [simulatedTasks, setSimulatedTasks] = useState([
    { id: 1, text: 'Revisi warna logo ke monokrom', team: 'Design', done: false },
    { id: 2, text: 'Fix API endpoint auth login', team: 'Backend', done: false },
  ])

  const features = [
    {
      icon: <Mic className="h-5 w-5 text-purple-600" />,
      title: "Dekomposisi Voice Note",
      desc: "Ghost Relay otomatis mengonversi catatan suara panjang dari grup chat menjadi transkrip ringkas dan memecah instruksi menjadi kartu tugas divisi."
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-indigo-600" />,
      title: "Gateway Chat Terintegrasi",
      desc: "Hubungkan WhatsApp, Telegram, dan Slack sebagai gateway input asisten AI untuk memproses ide, file, dan tugas tim secara asinkron."
    },
    {
      icon: <Zap className="h-5 w-5 text-pink-600" />,
      title: "Auto-Reply Cerdas (RAG)",
      desc: "Menjawab pertanyaan berulang klien di saluran chat secara otomatis menggunakan basis pengetahuan dari percakapan lama."
    },
    {
      icon: <FileText className="h-5 w-5 text-emerald-600" />,
      title: "Basis Data Dokumen",
      desc: "Semua berkas invoice, mockup, dan dokumen penting di grup chat terindeks rapi di dasbor tanpa perlu scroll riwayat pesan."
    },
    {
      icon: <Sparkles className="h-5 w-5 text-amber-600" />,
      title: "Perintah Suara Dasbor",
      desc: "Gunakan fitur rekam suara dari dasbor kerja Anda untuk mendistribusikan instruksi penting ke berbagai grup komunikasi eksternal."
    },
    {
      icon: <Shield className="h-5 w-5 text-cyan-600" />,
      title: "Enkripsi Kredensial",
      desc: "Keamanan data token API platform Anda terjamin penuh menggunakan standar enkripsi simetris AES-256-GCM."
    }
  ]

  // Simple typing simulation for RAG Search bento card
  useEffect(() => {
    const text = 'URL staging server tim'
    let index = 0
    const interval = setInterval(() => {
      setTypedQuery(text.slice(0, index))
      index++
      if (index > text.length + 5) {
        index = 0
      }
    }, 180)
    return () => clearInterval(interval)
  }, [])

  const toggleTask = (id: number) => {
    setSimulatedTasks(tasks => 
      tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    )
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0f172a] selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden font-body">
      
      {/* Import Premium Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-heading { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Grid Blueprint Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1.2px,transparent_1.2px),linear-gradient(to_bottom,#e2e8f0_1.2px,transparent_1.2px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-70" />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[80px] left-[-100px] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[6s]" />
      <div className="absolute top-[300px] right-[-100px] w-[450px] h-[450px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[8s]" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <Ghost className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 font-heading">
              Ghost Relay
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-500 uppercase tracking-wider font-heading">
            <a href="#features" className="hover:text-purple-600 transition-colors">Fitur</a>
            <a href="#bento" className="hover:text-purple-600 transition-colors">Pusat Kerja</a>
            <a href="#workflow" className="hover:text-purple-600 transition-colors">Aliran</a>
            <a href="#security" className="hover:text-purple-600 transition-colors">Keamanan</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[13px] font-bold text-slate-700 hover:text-purple-600 transition-colors px-3 py-2">
              Masuk
            </Link>
            <Link 
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/10 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5"
            >
              Mulai Konsol
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Left-Right Split (Asymmetric premium layout) */}
      <section className="relative pt-20 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Headline and Call-To-Action */}
        <div className="lg:col-span-5 text-left space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold tracking-wide uppercase font-heading">
            <Sparkles className="h-3.5 w-3.5 animate-spin duration-[3s]" />
            <span>Human → AI → Human Coordination</span>
          </div>

          <h1 className="text-4xl sm:text-[52px] font-black tracking-tight text-slate-950 leading-[1.08] font-heading uppercase">
            Jembatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">Komunikasi Tim</span> Tanpa Scroll Chat.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-body">
            Ghost Relay adalah sistem koordinasi asinkron yang menghubungkan platform pesan instan Anda (WhatsApp, Telegram, Slack) sebagai gateway pribadi menuju basis pengetahuan kerja. AI merapikan ide, mengekstrak dokumen, dan mendelegasikan tugas ke grup target secara instan.
          </p>

          {/* Value Props Checklist with modern check icons */}
          <div className="space-y-3 font-body text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 border border-purple-200">
                <Check className="h-3 w-3 text-purple-600" />
              </div>
              <span>Konversi instan voice note panjang menjadi task list divisi</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 border border-purple-200">
                <Check className="h-3 w-3 text-purple-600" />
              </div>
              <span>Berkas mockup & dokumen chat otomatis terarsip rapi</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 border border-purple-200">
                <Check className="h-3 w-3 text-purple-600" />
              </div>
              <span>Auto-reply otomatis menjawab pertanyaan berulang di grup</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/login" className="px-7 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transform hover:-translate-y-0.5">
              Hubungkan Gateway <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#bento" className="px-7 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-bold transition-all text-xs shadow-sm">
              Lihat Demo Basis Kerja
            </a>
          </div>
        </div>

        {/* Right Column: Layered, Floating Visual Isometric UI Mockup */}
        <div className="lg:col-span-7 relative h-[450px] w-full flex items-center justify-center">
          
          {/* Main Back Layer: Dasbor Dashboard Frame */}
          <div className="absolute top-[20px] left-[20px] w-[90%] sm:w-[85%] rounded-2xl border border-slate-200/80 bg-white shadow-xl overflow-hidden pointer-events-none transform -rotate-1 scale-95 origin-bottom-left transition-transform duration-500 hover:rotate-0">
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <div className="text-[10px] font-bold text-slate-400 font-heading tracking-wider">DASBOR KONTROL AI</div>
              <span className="w-6" />
            </div>
            <div className="p-4 space-y-3 bg-[#fafafa]">
              <div className="h-6 bg-slate-200/50 rounded w-1/3" />
              <div className="h-20 bg-slate-100/50 rounded flex items-center justify-center text-[11px] text-slate-400">
                Pusat Aktivitas Gateway
              </div>
            </div>
          </div>

          {/* Front Left Layer: Floating Chat Bubble (WhatsApp Gateway) */}
          <div className="absolute left-0 bottom-[60px] w-[260px] sm:w-[290px] rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 transform translate-x-4 -translate-y-4 hover:translate-y-[-20px] transition-transform duration-300 z-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">WhatsApp Gateway</span>
              <span className="text-[9px] text-slate-400 font-medium">Budi (PM)</span>
            </div>
            <div className="mt-3 flex items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <Play className="h-2.5 w-2.5 fill-current pl-0.5" />
              </div>
              <div className="h-1 bg-purple-600 rounded-full flex-1" />
              <span className="text-[9px] text-slate-400">0:18 VN</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic font-sans leading-normal">
              "Tolong monokromkan logo desainnya ya, dan API endpoint dicoba test."
            </p>
          </div>

          {/* Front Right Layer: Floating AI Dispatch Output Card */}
          <div className="absolute right-0 top-[40px] w-[260px] sm:w-[290px] rounded-2xl bg-white border border-purple-100 shadow-2xl p-4 transform -translate-x-4 translate-y-4 hover:translate-y-[10px] transition-transform duration-300 z-20">
            <div className="flex items-center gap-1.5 pb-2 border-b border-purple-500/10">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-[10px] font-bold text-purple-900 font-heading">AI TASK_DISPATCH</span>
            </div>
            
            <div className="mt-3 space-y-2.5">
              {simulatedTasks.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTask(t.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                    t.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-purple-50/40 border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                    t.done ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-300'
                  }`}>
                    {t.done && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase text-purple-600 tracking-wider block leading-none mb-0.5">TEAM {t.team}</span>
                    <p className={`text-[10px] text-slate-800 leading-normal font-sans ${t.done ? 'line-through text-slate-400' : ''}`}>
                      {t.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Flow Pipeline (Custom visual flow diagram) */}
      <section className="py-8 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-sm shrink-0">
            <h4 className="text-sm font-bold text-purple-700 uppercase tracking-wider font-heading mb-1">// Jalur Komunikasi Asinkron</h4>
            <p className="text-xs text-slate-500 font-sans">Pesan dikonversi otomatis dari gateway eksternal dan dialirkan sebagai tugas terstruktur.</p>
          </div>
          
          {/* SVG Pipeline */}
          <div className="flex-1 w-full max-w-xl h-16 relative flex items-center justify-between px-4 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-bold">
              <span>Gateways</span>
            </div>
            
            <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-emerald-500 via-purple-600 to-indigo-600 relative rounded-full">
              <span className="absolute h-2 w-2 rounded-full bg-purple-400 top-[-2px] left-1/4 animate-ping" />
              <span className="absolute h-2 w-2 rounded-full bg-indigo-400 top-[-2px] left-2/3 animate-ping" />
            </div>

            <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 text-[10px] font-bold text-purple-700">
              <Sparkles className="h-3 w-3 text-purple-600" />
              <span>Ghost AI Relay</span>
            </div>

            <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 relative rounded-full">
              <span className="absolute h-2 w-2 rounded-full bg-indigo-400 top-[-2px] left-1/2 animate-ping" />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-bold">
              <span>Task Board</span>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid Layout Section */}
      <section id="bento" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">
              Pusat Manajemen Berkas & Vault AI
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Seluruh aset percakapan dikelompokkan secara cerdas agar mudah diekstrak sewaktu-waktu.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[230px]">
            
            {/* Card 1: Voice Task Splitter (Large - 2/3 width) */}
            <div className="md:col-span-8 p-8 rounded-3xl border border-slate-200/80 bg-[#f8fafc]/40 hover:bg-[#f8fafc]/80 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Transkripsi Audio</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Audio Task Decomposition</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-lg">
                  Menganalisis file pesan suara, membuang jeda hening, lalu memecah isinya secara terstruktur menjadi daftar to-do list bagi masing-masing divisi tim pengembang.
                </p>
              </div>

              {/* Visual Audio Waveform Simulation */}
              <div className="h-16 w-full flex items-end gap-1.5 border-t border-slate-200/60 pt-3">
                {[4, 8, 12, 5, 9, 14, 20, 12, 6, 8, 15, 24, 18, 9, 12, 16, 22, 10, 4, 9, 14, 6, 12, 18, 9, 5, 8, 12, 6, 11, 4, 9, 15, 7, 10, 4].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-slate-200 group-hover:bg-purple-600 rounded-full transition-all duration-300"
                    style={{ height: `${height * 3.5}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Security Credentials (Small - 1/3 width) */}
            <div className="md:col-span-4 p-8 rounded-3xl border border-slate-200/80 bg-[#f8fafc]/40 hover:bg-[#f8fafc]/80 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-pink-600 bg-pink-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Kredensial</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">AES-256-GCM</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
                  Semua token platform dan file verifikasi dienkripsi penuh di level database menggunakan kunci simetris yang aman.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="h-4 w-4 text-pink-500" />
                  <span className="text-[10px] tracking-wider font-bold">Token Hashed</span>
                </div>
                <div className="text-[9px] bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Terenkripsi
                </div>
              </div>
            </div>

            {/* Card 3: Knowledge Vault (Small - 1/3 width) */}
            <div className="md:col-span-4 p-8 rounded-3xl border border-slate-200/80 bg-[#f8fafc]/40 hover:bg-[#f8fafc]/80 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Dokumen</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Anti-Scroll Vault</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
                  Gambar mockup, berkas invoice, dan rujukan file chat terindeks otomatis ke kategori folder tanpa tertimbun pesan baru.
                </p>
              </div>

              {/* Directory Mockup */}
              <div className="border-t border-slate-200/60 pt-3.5 text-xs space-y-2 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">📁</span>
                  <span className="font-bold text-slate-700">/UI_Mockups_V3</span>
                </div>
                <div className="flex items-center gap-1.5 pl-4">
                  <span>📄</span>
                  <span className="text-slate-500 text-[11px] font-sans">dashboard-redesign.pdf</span>
                </div>
              </div>
            </div>

            {/* Card 4: RAG Auto-Reply (Large - 2/3 width) */}
            <div className="md:col-span-8 p-8 rounded-3xl border border-slate-200/80 bg-[#f8fafc]/40 hover:bg-[#f8fafc]/80 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-cyan-600 bg-cyan-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Memori Pencarian</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Auto-Reply RAG</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-lg">
                  AI mendeteksi pertanyaan tim yang berulang-ulang di grup komunikasi dan membalas otomatis dengan merujuk berkas/data yang pernah dibagikan.
                </p>
              </div>

              {/* RAG Typing Search Bar Simulation */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs shadow-sm">
                <div className="flex items-center gap-2.5 text-slate-500 w-full pr-4">
                  <Search className="h-4 w-4 text-cyan-600 animate-pulse" />
                  <span className="text-slate-800 font-sans font-medium">
                    {typedQuery}<span className="animate-ping">|</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Kecocokan AI: <strong className="text-cyan-600">97.8%</strong></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid Details */}
      <section id="features" className="py-24 border-t border-slate-200/60 bg-[#f8fafc]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">
              Asisten AI Asinkron Khusus Tim
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Fokus penuh pada pekerjaan utama tanpa terdistraksi mendengarkan berkas suara panjang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl border border-slate-200/70 bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300"
              >
                <div className="h-11 w-11 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-heading">{f.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Pipeline (Horizontal Steps Card) */}
      <section id="workflow" className="py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 font-heading uppercase">
              Langkah Integrasi Platform
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Hanya butuh beberapa menit untuk menyambungkan bot dan basis pengetahuan Anda.
            </p>
          </div>

          {/* Steps Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div 
              onClick={() => setActiveStep(1)}
              className={`p-8 rounded-3xl border transition-all cursor-pointer ${
                activeStep === 1 ? 'border-purple-600 bg-white shadow-xl' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-4">Langkah 01</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Hubungkan Gateway</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                Pindai kode QR untuk menyinkronkan WhatsApp, atau masukkan token API Telegram / Slack ke dalam sistem secara aman.
              </p>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => setActiveStep(2)}
              className={`p-8 rounded-3xl border transition-all cursor-pointer ${
                activeStep === 2 ? 'border-purple-600 bg-white shadow-xl' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-4">Langkah 02</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Latih Knowledge Vault</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                Unggah dokumen pendukung tim langsung dari komputer atau teruskan berkas gambar/PDF lewat chat grup Telegram.
              </p>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => setActiveStep(3)}
              className={`p-8 rounded-3xl border transition-all cursor-pointer ${
                activeStep === 3 ? 'border-purple-600 bg-white shadow-xl' : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-4">Langkah 03</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Asisten AI Aktif</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                AI di latar belakang otomatis memecah voice note tim, mengekstrak aset dokumen, dan membalas chat berulang.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Security Info Card */}
      <section id="security" className="py-20 border-t border-slate-200/60 bg-[#f8fafc]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <Shield className="h-7 w-7 text-purple-600" />
            </div>
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block font-heading">Enkripsi Tingkat Tinggi</span>
              <h2 className="text-base font-bold text-slate-900 font-heading">Kunci Enkripsi AES-256-GCM Terisolasi</h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                Setiap token API dan session file WhatsApp Anda diamankan penuh di level database. Data dilindungi menggunakan algoritma enkripsi simetris AES-256-GCM, memastikan integritas dan privasi data koordinasi tim Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 text-center relative border-t border-slate-200/60 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight font-heading uppercase">
            Mulai Sinkronisasi Tim Sekarang
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Kurangi distraksi tumpukan chat, lompati voice note berulang, dan kelola basis pengetahuan kerja tim Anda secara modern.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all text-xs transform hover:-translate-y-0.5">
              Hubungkan Dasbor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/60 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">
              <Ghost className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-800 font-heading">Ghost Relay</span>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Ghost Relay. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Hubungi Kami</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
