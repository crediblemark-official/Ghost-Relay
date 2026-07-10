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
  Check,
  Server,
  Activity,
  Layers
} from 'lucide-react'

export function LandingPage() {
  const [typedQuery, setTypedQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'voice' | 'vault' | 'gateway' | 'security'>('voice')
  const [simulatedTasks, setSimulatedTasks] = useState([
    { id: 1, text: 'Ubah skema database tabel user_settings', team: 'Backend', done: false },
    { id: 2, text: 'Sesuaikan padding & responsive layout LP', team: 'Frontend', done: true },
  ])
  
  // Simulator State
  const [simulatorScenario, setSimulatorScenario] = useState<'vn' | 'query' | null>(null)
  const [simulatorStep, setSimulatorStep] = useState(0)

  // RAG Search typing simulation
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

  // Flow Simulator Steps Effect
  useEffect(() => {
    if (!simulatorScenario) return
    setSimulatorStep(1)
    
    const t1 = setTimeout(() => setSimulatorStep(2), 1500)
    const t2 = setTimeout(() => setSimulatorStep(3), 3200)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [simulatorScenario])

  const toggleTask = (id: number) => {
    setSimulatedTasks(tasks => 
      tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    )
  }

  return (
    <div className="min-h-screen text-[#0f172a] selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden font-body bg-[#fafbfc]">
      
      {/* Import Premium Google Fonts & Advanced Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-heading { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        .pulse-glow { animation: pulseGlow 2s infinite ease-in-out; }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradientShift 6s ease infinite;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: floatSlow 5s ease-in-out infinite;
        }

        @keyframes dashFlow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-dash-flow {
          stroke-dasharray: 6, 4;
          animation: dashFlow 1.5s linear infinite;
        }
      `}</style>

      {/* Sunset Glow Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-gradient-to-b from-[#ffffff] via-[#fffbf7] via-[#fff5f6] via-[#faf6ff] to-[#f8fafc] -z-20" />
      
      {/* Fine Blueprint Lines Overlay */}
      <div className="absolute top-0 inset-x-0 h-[650px] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_65%,transparent_100%)] pointer-events-none -z-10 opacity-40" />

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
            <a href="#features-hub" className="hover:text-purple-600 transition-colors">Fitur Kerja</a>
            <a href="#simulator" className="hover:text-purple-600 transition-colors">Simulatur Aliran</a>
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-gradient">Tim Anda Tanpa Scroll Chat.</span>
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
              href="#features-hub" 
              className="block w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 rounded-full font-bold transition-all text-xs text-center"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Product Showcase: Clean Collaborative Inbox UI (Cut off at the bottom) */}
        <div className="relative max-w-4xl mx-auto rounded-t-2xl border-t border-x border-slate-200/80 bg-white shadow-2xl overflow-hidden mt-16 h-[320px] animate-float">
          
          {/* Mock Dashboard Window Header */}
          <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5 border-b border-slate-200/60">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 font-heading tracking-wider">GHOST_RELAY_CONSOLE</div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
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
                      {t.done && <Check className="h-2.5 w-2.5" />}
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

      {/* Section 1: The Core Enterprise Feature Hub (Tabbed High-Density Control Center) */}
      <section id="features-hub" className="py-24 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Tab Controls & High-Density Feature Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block font-heading">ENTERPRISE_CONTROL_CENTER</span>
              <h2 className="text-3xl font-black text-slate-900 font-heading uppercase">
                Fitur Utama Pengelolaan
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
                Pilih tab kontrol di bawah untuk memverifikasi modul pemrosesan data asinkron kami.
              </p>
            </div>

            {/* Vertical Custom Tabs */}
            <div className="space-y-3 pt-4">
              
              {/* Tab 1: Voice Engine */}
              <div 
                onClick={() => setActiveTab('voice')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                  activeTab === 'voice' ? 'bg-purple-50/50 border-purple-200 shadow-sm' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mic className={`h-4 w-4 ${activeTab === 'voice' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider font-heading">01. Dekomposisi Suara</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">
                  Transkripsi voice note otomatis via ASR Whisper dan dekomposisi to-do list per divisi.
                </p>
              </div>

              {/* Tab 2: Document Vault */}
              <div 
                onClick={() => setActiveTab('vault')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                  activeTab === 'vault' ? 'bg-purple-50/50 border-purple-200 shadow-sm' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`h-4 w-4 ${activeTab === 'vault' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider font-heading">02. Knowledge Vault & RAG</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">
                  Pencarian semantik berkas PDF/mockup dan penjawab otomatis pesan berulang.
                </p>
              </div>

              {/* Tab 3: API Gateway */}
              <div 
                onClick={() => setActiveTab('gateway')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                  activeTab === 'gateway' ? 'bg-purple-50/50 border-purple-200 shadow-sm' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Server className={`h-4 w-4 ${activeTab === 'gateway' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider font-heading">03. API & Webhook Integrator</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">
                  Modul gateway WhatsApp (Baileys), bot Telegram, dan Slack App dalam satu portal.
                </p>
              </div>

              {/* Tab 4: Compliance & Encryption */}
              <div 
                onClick={() => setActiveTab('security')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                  activeTab === 'security' ? 'bg-purple-50/50 border-purple-200 shadow-sm' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className={`h-4 w-4 ${activeTab === 'security' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider font-heading">04. Kriptografi & Kepatuhan</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">
                  Perlindungan simetris AES-256-GCM dan verifikasi tanda tangan HMAC webhook.
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Preview Screen */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50/30 p-6 min-h-[380px] flex items-center justify-center">
            
            {/* View 1: Voice Engine Preview */}
            {activeTab === 'voice' && (
              <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-md p-6 space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Voice Transcriber Active</span>
                  <Activity className="h-4 w-4 text-purple-600 animate-pulse" />
                </div>

                <div className="space-y-2 bg-[#fafafa] p-3 rounded-lg border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Catatan Suara Masuk (Telegram)</span>
                  <div className="flex items-center gap-2 py-1 bg-white px-2.5 rounded border border-slate-200">
                    <Play className="h-3 w-3 text-purple-600" />
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-purple-600 pulse-glow" />
                    </div>
                    <span className="text-[10px] text-slate-400">0:14</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/30 rounded-lg border border-purple-100/50 space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
                  <strong>Transkripsi:</strong> "Frontend tolong perbaiki responsive di landingpage bagian bento, backend tambah schema database user."
                  <div className="pt-2 border-t border-purple-100/50 flex gap-2">
                    <span className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold">FRONTEND</span>
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">BACKEND</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Vault & RAG Search */}
            {activeTab === 'vault' && (
              <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-md p-6 space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Knowledge Vault</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Vector DB</span>
                </div>

                {/* Simulated search */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2.5 text-slate-500 w-full">
                    <Search className="h-4 w-4 text-emerald-600" />
                    <span className="text-slate-800 font-medium">{typedQuery}<span className="animate-ping">|</span></span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/20 rounded-lg border border-emerald-100/60 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                    <span>Dokumen Terkait: server-config.txt</span>
                    <span className="text-emerald-600">Skor: 98.4%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans leading-normal">
                    "Konfigurasi staging IP di-set ke 172.30.155.229. DB berjalan di port 5433."
                  </p>
                </div>
              </div>
            )}

            {/* View 3: API Gateway Integrations */}
            {activeTab === 'gateway' && (
              <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-md p-6 space-y-4 animate-fade-in text-left">
                <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">API Connection Manager</span>
                  <span className="text-[9px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">API GATEWAY</span>
                </div>

                <div className="space-y-2.5 font-sans">
                  <div className="flex items-center justify-between p-2 bg-[#fafafa] rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-800">WhatsApp (Baileys Service)</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#fafafa] rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Telegram Bot API</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#fafafa] rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Slack App Webhook</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">ONLINE</span>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Cryptography compliance */}
            {activeTab === 'security' && (
              <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-md p-6 space-y-4 animate-fade-in text-left">
                <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">Encryption Audit Log</span>
                  <Lock className="h-4 w-4 text-pink-600" />
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-slate-300 font-mono text-[9px] leading-relaxed space-y-1">
                  <div className="text-slate-500">// AUDIT LOG VERIFICATION</div>
                  <div>[14:10:22] - Initialized AES-256-GCM cipher</div>
                  <div>[14:10:23] - Decrypted token using encryption key... <span className="text-emerald-400">SUCCESS</span></div>
                  <div>[14:10:25] - Webhook received from WhatsApp gateway</div>
                  <div>[14:10:25] - Verifying signature (HMAC-SHA256)... <span className="text-emerald-400">VALID</span></div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Section 2: "Stealth Mode" Flow Simulator (The "Special Taste" Interactivity) */}
      <section id="simulator" className="py-24 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
              <Zap className="h-3.5 w-3.5" />
              <span>Simulasi Interaktif Aliran Pesan</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 font-heading uppercase">
              Bagaimana Aliran Relasi Berjalan?
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto font-sans leading-relaxed">
              Klik salah satu skenario di bawah ini untuk melihat bagaimana Ghost Relay mendistribusikan pesan dari gateway ke dasbor AI dalam hitungan detik.
            </p>
          </div>

          {/* Scenario Triggers */}
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                setSimulatorScenario('vn')
                setSimulatorStep(0)
              }}
              className={`px-5 py-3 rounded-xl border text-xs font-bold transition-all ${
                simulatorScenario === 'vn' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Skenario A: Kirim Voice Note Revisi
            </button>
            <button 
              onClick={() => {
                setSimulatorScenario('query')
                setSimulatorStep(0)
              }}
              className={`px-5 py-3 rounded-xl border text-xs font-bold transition-all ${
                simulatorScenario === 'query' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Skenario B: Klien Tanya Staging URL
            </button>
          </div>

          {/* Simulator Visual Flow Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 min-h-[220px] flex items-center justify-center relative shadow-sm">
            
            {!simulatorScenario ? (
              <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                <Layers className="h-8 w-8 text-slate-300 animate-bounce" />
                <span>Pilih skenario di atas untuk memulai simulasi visual asinkron.</span>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-left font-sans text-xs">
                
                {/* Step 1: Input Gateway */}
                <div className={`p-4 rounded-xl border transition-all duration-500 ${
                  simulatorStep >= 1 ? 'border-purple-200 bg-purple-50/10 shadow-sm opacity-100 scale-100' : 'border-slate-100 bg-[#fafafa] opacity-40 scale-95'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800">1. Input Gateway</span>
                    <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold font-heading">GATEWAY</span>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {simulatorScenario === 'vn' ? (
                      <>
                        <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                          <Mic className="h-3.5 w-3.5" />
                          <span>Voice Note Budi (18s)</span>
                        </div>
                        <p className="text-[10px] text-slate-500">"Frontend revisi padding, backend fix endpoint."</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Pesan WhatsApp Klien</span>
                        </div>
                        <p className="text-[10px] text-slate-500">"Kunci API server testing apa?"</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 2: Ghost AI Relay */}
                <div className={`p-4 rounded-xl border transition-all duration-500 relative ${
                  simulatorStep >= 2 ? 'border-purple-300 bg-purple-50/30 shadow-md opacity-100 scale-100' : 'border-slate-100 bg-[#fafafa] opacity-40 scale-95'
                }`}>
                  {simulatorStep === 1 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold animate-pulse">Menunggu data di-relay...</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-purple-800 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      <span>2. Ghost AI Relay</span>
                    </span>
                    <span className="text-[8px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold font-heading">AI_PROCESS</span>
                  </div>
                  <div className="mt-3 space-y-1 text-[10px] text-slate-600">
                    {simulatorScenario === 'vn' ? (
                      <>
                        <div>✓ Transkripsi audio selesai.</div>
                        <div className="text-purple-600">✓ Memecah tugas menjadi 2 divisi.</div>
                      </>
                    ) : (
                      <>
                        <div>✓ Menghitung kosinus kemiripan...</div>
                        <div className="text-emerald-600">✓ Berkas "credential.txt" ditemukan.</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 3: Output Dispatch */}
                <div className={`p-4 rounded-xl border transition-all duration-500 relative ${
                  simulatorStep >= 3 ? 'border-indigo-200 bg-indigo-50/10 shadow-sm opacity-100 scale-100' : 'border-slate-100 bg-[#fafafa] opacity-40 scale-95'
                }`}>
                  {simulatorStep < 3 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold animate-pulse">Menunggu pemrosesan AI...</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-indigo-900">3. Output Dispatch</span>
                    <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold font-heading">RELAY</span>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {simulatorScenario === 'vn' ? (
                      <>
                        <div className="text-[10px] text-slate-800">
                          <strong>Tugas dikirim ke Slack #dev:</strong>
                          <ul className="list-disc pl-3 text-[9px] text-slate-500 mt-1">
                            <li>Frontend: revisi padding</li>
                            <li>Backend: fix endpoint login</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] text-slate-800">
                          <strong>Auto-Reply terkirim ke klien:</strong> <br />
                          <span className="text-slate-500 italic">"Kunci API: staging_token_abc. (Rujukan: @Andi 2 Juli)"</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* Security Info Card */}
      <section id="security" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-slate-50/50 p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <Shield className="h-7 w-7 text-purple-600" />
            </div>
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block font-heading">Kepatuhan Kriptografi Enterprise</span>
              <h2 className="text-base font-bold text-slate-900 font-heading">AES-256-GCM + Penandatanganan HMAC Webhook</h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                Keamanan adalah prioritas utama. Seluruh kredensial API dan verification secret diamankan menggunakan algoritma enkripsi simetris AES-256-GCM. Webhook masuk diverifikasi menggunakan tanda tangan HMAC-SHA256 untuk memblokir spoofing data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 text-center relative border-t border-slate-200 bg-slate-50/30">
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
      <footer className="py-12 border-t border-slate-200 bg-[#f8fafc]">
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
