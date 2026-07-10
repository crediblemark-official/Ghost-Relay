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
    { id: 1, text: 'Ubah skema database tabel user_settings', team: 'Backend', done: false },
    { id: 2, text: 'Sesuaikan padding & responsive layout LP', team: 'Frontend', done: true },
  ])

  // Simple typing simulation for RAG Search bento card
  useEffect(() => {
    const text = 'Kunci API staging server tim'
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

  return (
    <div className="min-h-screen text-[#0f172a] selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden font-body bg-[#fafbfc]">
      
      {/* Import Premium Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-heading { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Elegant Sunset Glow Gradient Background Wrapper */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-[#ffffff] via-[#fffbf7] via-[#fff5f6] via-[#faf6ff] to-[#f8fafc] -z-20" />
      
      {/* Fine Blueprint Lines Overlay */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none -z-10 opacity-40" />

      {/* Decorative Orbs with Blur */}
      <div className="absolute top-[100px] left-1/4 w-[450px] h-[450px] bg-orange-100/30 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse duration-[7s]" />
      <div className="absolute top-[220px] right-1/4 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse duration-[5s]" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 shadow-md shadow-purple-600/10">
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
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/10 px-5 py-2.5 rounded-xl text-xs font-bold transition-all transform hover:-translate-y-0.5"
            >
              Mulai Konsol
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Centered & Balanced Layout */}
      <section className="relative pt-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Sparkle badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-slate-600 text-xs font-semibold shadow-sm backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Human → AI → Human Coordination Hub</span>
        </div>

        {/* Large Centered Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] font-heading max-w-4xl mx-auto uppercase">
          Jembatan Koordinasi Asinkron <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">Tim Anda Tanpa Scroll Chat.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-body">
          Ghost Relay menghubungkan WhatsApp, Telegram, dan Slack sebagai gateway asisten AI. Kami membantu tim pengembang mengonversi instruksi suara panjang menjadi tugas terstruktur, mengarsipkan dokumen otomatis, dan mengotomatiskan auto-reply secara mandiri.
        </p>

        {/* Action Buttons (Pill-shaped CTA) */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-3">
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-full font-bold transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10 transform hover:-translate-y-0.5"
          >
            Mulai Konsol <ArrowRight className="h-4 w-4" />
          </Link>
          
          {/* White Pill with gradient border */}
          <div className="relative p-[1.2px] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 w-full sm:w-auto hover:opacity-95 active:scale-95 transition-all">
            <a 
              href="#features" 
              className="block w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 rounded-full font-bold transition-all text-xs text-center"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Product Showcase: Clean Collaborative Inbox UI (Cut off at the bottom) */}
        <div className="relative max-w-4xl mx-auto rounded-t-2xl border-t border-x border-slate-200/80 bg-white shadow-2xl overflow-hidden mt-16 h-[340px]">
          
          {/* Mock Dashboard Window Header */}
          <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5 border-b border-slate-200/60">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 font-heading tracking-wider">GHOST_RELAY_CONSOLE</div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2 rounded-full font-bold">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gateway Aktif</span>
            </div>
          </div>

          {/* Inside Dashboard Layout */}
          <div className="grid grid-cols-12 h-full text-left font-body">
            
            {/* Left Nav Pane */}
            <div className="col-span-3 border-r border-slate-100 bg-slate-50/50 p-4 space-y-4">
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-[10px] font-bold">AK</div>
                <span className="text-[10px] font-bold text-slate-700">Alicia Koch</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-2 py-1.5 bg-slate-200/50 text-[10px] font-bold text-slate-800 rounded">
                  <span>📥 Kotak Masuk</span>
                  <span className="bg-slate-300 px-1.5 rounded-full text-[9px]">12</span>
                </div>
                <div className="px-2 py-1.5 text-[10px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
                  📁 Basis Pengetahuan
                </div>
                <div className="px-2 py-1.5 text-[10px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
                  ⚙️ Pengaturan
                </div>
              </div>
            </div>

            {/* Middle List Pane */}
            <div className="col-span-4 border-r border-slate-100 p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari pesan..." 
                  disabled
                  className="w-full bg-slate-50 rounded-lg pl-8 pr-3 py-1.5 text-[10px] border border-slate-100 outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <div className="p-2.5 bg-purple-50/30 border border-purple-100 rounded-lg">
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span className="font-bold text-purple-700">WhatsApp Gateway</span>
                    <span>14:02</span>
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-800 mt-1">Budi (Project Manager)</h4>
                  <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">Voice Note: 0:18 detik...</p>
                </div>
                <div className="p-2.5 hover:bg-slate-50/50 border border-transparent rounded-lg cursor-pointer">
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>Telegram Gateway</span>
                    <span>13:51</span>
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-600 mt-1">John (Backend Dev)</h4>
                  <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">Memperbarui skema migration database...</p>
                </div>
              </div>
            </div>

            {/* Right Detail Pane */}
            <div className="col-span-5 p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">Hasil Transkripsi AI</span>
              </div>

              {/* Mock Audio Player */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <button className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                  <Play className="h-2.5 w-2.5 fill-current pl-0.5" />
                </button>
                <div className="h-1 bg-purple-200 rounded-full flex-1" />
                <span className="text-[9px] text-slate-400">0:18 VN</span>
              </div>

              <div className="space-y-2.5">
                {simulatedTasks.map((t) => (
                  <div 
                    key={t.id} 
                    onClick={() => toggleTask(t.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                      t.done ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-purple-50/30 border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                      t.done ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-300'
                    }`}>
                      {t.done && <Check className="h-2.5 w-2.5 animate-scale-in" />}
                    </div>
                    <div>
                      <span className="text-[8px] font-bold uppercase text-purple-600 tracking-wider block mb-0.5">TIM {t.team}</span>
                      <p className={`text-[10px] text-slate-800 leading-normal ${t.done ? 'line-through text-slate-400' : ''}`}>
                        {t.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Fade out mask at the bottom of the fold */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Features Grid Details */}
      <section id="features" className="py-24 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              SISTEM ASINKRON YANG BEBAS DISTRAKSI
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Fokus penuh pada baris kode Anda tanpa terganggu mendengarkan berkas suara berulang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl border border-slate-200/70 bg-[#fafbfc]/50 hover:bg-[#fafbfc] hover:shadow-xl hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300"
              >
                <div className="h-11 w-11 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-heading">{f.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Layout Section */}
      <section id="bento" className="py-24 bg-[#fafbfc] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              PUSAT MANAJEMEN VAULT DOKUMEN
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-body">
              Akses berkas, dokumen koordinasi, dan arsip percakapan tim dengan cepat.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[230px]">
            
            {/* Card 1: Voice Task Splitter (Large - 2/3 width) */}
            <div className="md:col-span-8 p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Transkripsi Audio</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Voice Note Task Splitter</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-lg">
                  Instruksi suara di Telegram/WA dipotong-potong secara otomatis oleh AI menjadi kartu tugas terpisah per divisi di Slack. Anda tidak perlu memutarnya manual.
                </p>
              </div>

              {/* Visual Audio Waveform Simulation */}
              <div className="h-16 w-full flex items-end gap-1.5 border-t border-slate-100 pt-3">
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
            <div className="md:col-span-4 p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-pink-600 bg-pink-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Keamanan</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">AES-256-GCM</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
                  Semua token platform dan file verifikasi dienkripsi penuh di level database menggunakan kunci simetris yang aman.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="h-4 w-4 text-pink-500" />
                  <span className="text-[10px] tracking-wider font-bold">Kredensial Aman</span>
                </div>
                <div className="text-[9px] bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  ACTIVE
                </div>
              </div>
            </div>

            {/* Card 3: Knowledge Vault (Small - 1/3 width) */}
            <div className="md:col-span-4 p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Dokumen</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Anti-Scroll Vault</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
                  Gambar mockup, berkas invoice, dan rujukan file chat terindeks otomatis ke kategori folder tanpa tertimbun pesan baru.
                </p>
              </div>

              {/* Directory Mockup */}
              <div className="border-t border-slate-100 pt-3.5 text-xs space-y-2 text-slate-500">
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
            <div className="md:col-span-8 p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-cyan-600 bg-cyan-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-heading">Memori Pencarian</span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Auto-Reply RAG</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-lg">
                  AI mendeteksi pertanyaan tim yang berulang-ulang di grup komunikasi dan membalas otomatis dengan merujuk berkas/data yang pernah dibagikan.
                </p>
              </div>

              {/* RAG Typing Search Bar Simulation */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs shadow-sm">
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

      {/* How it Works / Workflow Pipeline (Horizontal Steps Card) */}
      <section id="workflow" className="py-24 bg-white border-t border-slate-200">
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
                activeStep === 1 ? 'border-purple-600 bg-white shadow-xl' : 'border-slate-200/80 bg-[#fafbfc]/50 hover:bg-[#fafbfc]'
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
                activeStep === 2 ? 'border-purple-600 bg-white shadow-xl' : 'border-slate-200/80 bg-[#fafbfc]/50 hover:bg-[#fafbfc]'
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
                activeStep === 3 ? 'border-purple-600 bg-white shadow-xl' : 'border-slate-200/80 bg-[#fafbfc]/50 hover:bg-[#fafbfc]'
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
      <section id="security" className="py-20 border-t border-slate-200 bg-[#fafbfc]">
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
      <section className="py-28 text-center relative border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-[40px] font-black tracking-tight text-slate-900 leading-tight font-heading uppercase">
            Mulai Sinkronisasi Tim Sekarang
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Kurangi distraksi tumpukan chat, lompati voice note berulang, dan kelola basis pengetahuan kerja tim Anda secara modern.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all text-xs transform hover:-translate-y-0.5">
              Hubungkan Dasbor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-[#fafbfc]">
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
