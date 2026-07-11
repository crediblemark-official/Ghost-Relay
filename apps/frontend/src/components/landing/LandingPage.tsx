import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Ghost, Shield, ArrowRight, Play, Search, FileText, Mic,
  MessageSquare, Sparkles, Lock, Check, Server,
  Layers, Bot, Send, Inbox, BarChart3, Brain
} from 'lucide-react'

export function LandingPage() {
  const [simulatorScenario, setSimulatorScenario] = useState<'vn' | 'query' | null>(null)
  const [simulatorStep, setSimulatorStep] = useState(0)

  useEffect(() => {
    if (!simulatorScenario) return
    setSimulatorStep(1)
    const t1 = setTimeout(() => setSimulatorStep(2), 1500)
    const t2 = setTimeout(() => setSimulatorStep(3), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [simulatorScenario])

  return (
    <div className="min-h-screen text-slate-900 overflow-x-hidden bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp .6s ease-out both }
        @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite }
        @keyframes slide-in { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <Ghost className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Ghost Relay</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '#features', label: 'Fitur' },
              { href: '#how-it-works', label: 'Cara Kerja' },
              { href: '#security', label: 'Keamanan' },
            ].map(n => (
              <a key={n.href} href={n.href} className="px-4 py-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">Masuk</Link>
            <Link to="/register" className="text-[13px] font-semibold bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-slate-900/10">
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Gradient orbs */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-violet-200/30 via-fuchsia-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[200px] left-[-200px] w-[500px] h-[500px] bg-gradient-to-br from-violet-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[150px] right-[-200px] w-[400px] h-[400px] bg-gradient-to-bl from-orange-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute h-full w-full rounded-full bg-violet-400 opacity-75" /><span className="relative rounded-full h-1.5 w-1.5 bg-violet-500" /></span>
            Human → AI → Human Coordination
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Koordinasi Tim
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">Tanpa Scroll Chat.</span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Satu dasbor untuk semua pesan dari WhatsApp, Telegram, dan Slack.
            Voice note ditranskripsi otomatis, dokumen terarsip pintar, dan AI menjawab pertanyaan berulang secara mandiri.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-slate-900/15 hover:-translate-y-0.5">
              Mulai Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-sm text-center transition-all hover:bg-slate-50">
              Lihat Fitur
            </a>
          </div>
        </div>

        {/* ─── PRODUCT SHOWCASE: Actual /chat UI ─── */}
        <div className="relative max-w-5xl mx-auto mt-20 rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden fade-up" style={{ animationDelay: '.2s' }}>
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="flex-1 text-center text-[11px] font-medium text-slate-400">Ghost Relay — Tim Dev</span>
            <span className="w-11" />
          </div>
          {/* 3-col layout */}
          <div className="flex h-[400px]">
            {/* Left: ChannelList */}
            <div className="w-52 border-r border-slate-100 bg-slate-50/60 flex flex-col shrink-0">
              <div className="p-3 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input disabled placeholder="Cari..." className="w-full h-8 rounded-lg bg-white pl-8 pr-3 text-xs border border-slate-200 outline-none text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">Saluran</p>
                  {[
                    { name: 'WhatsApp', color: 'bg-emerald-500', active: true },
                    { name: 'Telegram', color: 'bg-sky-500' },
                    { name: 'Slack', color: 'bg-violet-500' },
                  ].map(c => (
                    <div key={c.name} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs cursor-default ${c.active ? 'bg-violet-50 font-semibold text-slate-800' : 'text-slate-500'}`}>
                      <span className={`h-2 w-2 rounded-full ${c.color}`} />
                      {c.name}
                    </div>
                  ))}
                </div>
                <div className="h-px bg-slate-200" />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">Tim</p>
                  {['Andi (Backend)', 'Budi (PM)', 'Citra (Frontend)'].map(m => (
                    <div key={m} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                      {m}
                    </div>
                  ))}
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 bg-violet-50/60">
                  <Bot className="h-3.5 w-3.5 text-violet-600" />
                  AI Assistant
                  <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
            {/* Center: Chat */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="h-11 border-b border-slate-100 flex items-center px-4 gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-800"># WhatsApp</span>
                <span className="text-[10px] text-slate-400">· Tim Dev</span>
              </div>
              <div className="flex-1 overflow-hidden px-4 py-3 space-y-3">
                {/* Incoming */}
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-1.5 px-1 mb-0.5">
                    <span className="text-[11px] font-medium text-slate-600">Budi</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 font-bold">WA</span>
                  </div>
                  <div className="max-w-[75%] bg-slate-100 border border-slate-200/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="text-[12px] text-slate-700 leading-relaxed">Frontend tolong perbaiki responsive LP, backend tambah schema DB user settings</p>
                  </div>
                </div>
                {/* AI reply — task decomposition */}
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1.5 px-1 mb-0.5">
                    <span className="text-[10px] font-semibold text-violet-600">AI Assistant</span>
                  </div>
                  <div className="max-w-[80%] bg-slate-100 border border-slate-200/60 rounded-2xl rounded-tr-sm px-3.5 py-2.5">
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-1.5">Tugas Terstruktur</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold">FRONTEND</span>
                        <span className="text-[11px] text-slate-600">Revisi responsive landing page</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">BACKEND</span>
                        <span className="text-[11px] text-slate-600">Tambah schema DB user settings</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Incoming 2 */}
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-1.5 px-1 mb-0.5">
                    <span className="text-[11px] font-medium text-slate-600">Andi</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-sky-200 bg-sky-50 text-sky-600 font-bold">TG</span>
                  </div>
                  <div className="max-w-[75%] bg-slate-100 border border-slate-200/60 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="text-[12px] text-slate-700">Kunci API staging server apa ya?</p>
                  </div>
                </div>
                {/* AI auto-reply */}
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1.5 px-1 mb-0.5">
                    <span className="text-[10px] font-semibold text-violet-600">AI Assistant</span>
                  </div>
                  <div className="max-w-[80%] bg-slate-100 border border-slate-200/60 rounded-2xl rounded-tr-sm px-3.5 py-2.5">
                    <p className="text-[12px] text-slate-700 leading-relaxed">
                      Berdasarkan diskusi dengan <strong>@Budi</strong> pada 2 Juli: kunci API staging adalah{' '}
                      <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-[11px]">staging_token_abc</code>
                    </p>
                    <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-200/50">
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">MEMORY HIT</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Pill input */}
              <div className="px-4 pb-4 pt-1">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                  <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><span className="text-slate-400 text-sm">+</span></div>
                  <div className="flex-1 text-[12px] text-slate-400">Tanyakan apa saja</div>
                  <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Mic className="h-3.5 w-3.5 text-slate-400" /></div>
                </div>
              </div>
            </div>
            {/* Right: KnowledgeVault */}
            <div className="w-56 border-l border-slate-100 bg-white flex flex-col shrink-0">
              <div className="p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input disabled placeholder="Cari file..." className="w-full h-8 rounded-lg bg-slate-50 pl-8 pr-3 text-xs border border-slate-200 outline-none text-slate-400" />
                </div>
                {[
                  { folder: 'Dokumen_Teknis', files: ['schema.prisma', 'api-docs.pdf'], emoji: '📄' },
                  { folder: 'Laporan', files: ['report-2juli.md'], emoji: '📊' },
                  { folder: 'Lainnya', files: ['design-mockup.png'], emoji: '📁' },
                ].map(g => (
                  <div key={g.folder}>
                    <div className="flex items-center gap-1.5 px-1 mb-1">
                      <span className="text-xs">{g.emoji}</span>
                      <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">{g.folder}</span>
                      <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 rounded-full font-bold">{g.files.length}</span>
                    </div>
                    {g.files.map(f => (
                      <div key={f} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] text-slate-500 hover:bg-slate-50">
                        <FileText className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative border-y border-slate-100 bg-slate-50/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.04), transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(236,72,153,0.03), transparent 50%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(249,115,22,0.03), transparent 50%)' }} />
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Mic, label: 'Voice Note Diproses', value: '100%', sub: 'otomatis via Whisper' },
            { icon: Search, label: 'Waktu Pencarian', value: '<10 detik', sub: 'dari 5 menit sebelumnya' },
            { icon: MessageSquare, label: 'Pertanyaan Berulang', value: '-90%', sub: 'dengan auto-reply AI' },
            { icon: Shield, label: 'Enkripsi', value: 'AES-256', sub: 'GCM untuk semua kredensial' },
          ].map((s, i) => (
            <div key={i} className="text-center space-y-1">
              <s.icon className="h-5 w-5 text-violet-500 mx-auto" />
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs font-medium text-slate-600">{s.label}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="relative py-24 overflow-hidden">
        <div className="absolute top-[-200px] right-[-150px] w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-200px] left-[-150px] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.03), transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Fitur Utama</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Semua yang Tim Butuhkan</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">Lima modul yang bekerja bersama untuk menghilangkan friction dari koordinasi tim async.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Mic, title: 'Smart Voice Processing', desc: 'Transkripsi Whisper otomatis, ringkasan 1-2 kalimat, dekomposisi tugas per divisi, dan voice command.', color: 'violet' },
              { icon: FileText, title: 'Knowledge Vault', desc: 'Upload drag-and-drop multi-file, ekstrak teks otomatis, klasifikasi folder via AI, pencarian semantik.', color: 'emerald' },
              { icon: MessageSquare, title: 'Auto-Reply & Memory', desc: 'Jawaban otomatis berbasis memori chat, anti-spam, citation dengan nama pengirim dan tanggal.', color: 'orange' },
              { icon: Server, title: 'Multi-Platform Gateway', desc: 'WhatsApp (Baileys), Telegram Bot API, Slack Bot — satu inbox terpadu untuk semua pesan.', color: 'sky' },
              { icon: BarChart3, title: 'Laporan Harian', desc: 'Ringkasan aktivitas 24 jam via AI, export markdown, kirim via email ke manajemen.', color: 'rose' },
              { icon: Lock, title: 'Keamanan Enterprise', desc: 'AES-256-GCM untuk kredensial, HMAC-SHA256 untuk webhook Slack, verifikasi token Telegram.', color: 'slate' },
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-1">
                <div className={`h-10 w-10 rounded-xl bg-${f.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`h-5 w-5 text-${f.color}-600`} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (Interactive Simulator) ─── */}
      <section id="how-it-works" className="relative py-24 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.04), transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 70% 70%, rgba(59,130,246,0.03), transparent 60%)' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Cara Kerja</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dari Pesan Masuk ke Tugas Terstruktur</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">Klik salah satu skenario untuk melihat alur nyata pemrosesan pesan oleh AI.</p>
          </div>

          {/* Triggers */}
          <div className="flex justify-center gap-3 mb-8">
            <button onClick={() => { setSimulatorScenario('vn'); setSimulatorStep(0) }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${simulatorScenario === 'vn' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              <Mic className="h-4 w-4" /> Voice Note Revisi
            </button>
            <button onClick={() => { setSimulatorScenario('query'); setSimulatorStep(0) }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${simulatorScenario === 'query' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              <MessageSquare className="h-4 w-4" /> Tanya Kunci API
            </button>
          </div>

          {/* Mini Chat Window */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="h-11 border-b border-slate-100 flex items-center px-4 gap-2 bg-white shrink-0">
              <span className="text-xs font-semibold text-slate-800"># {simulatorScenario === 'vn' ? 'WhatsApp' : 'Telegram'}</span>
              <span className="text-[10px] text-slate-400">· Tim Dev</span>
            </div>
            <div className="min-h-[300px] px-4 py-4 space-y-4 bg-slate-50/30">
              {!simulatorScenario ? (
                <div className="flex items-center justify-center h-[260px]">
                  <div className="text-center space-y-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto"><Layers className="h-7 w-7 text-slate-300" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Pilih skenario di atas</p>
                      <p className="text-xs text-slate-400 mt-0.5">Simulasi alur pesan akan muncul di sini</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step 1: Incoming */}
                  <div style={{ animation: simulatorStep >= 1 ? 'slide-in .5s ease both' : 'none', opacity: simulatorStep >= 1 ? 1 : 0 }}>
                    <div className="flex items-center gap-1.5 px-1 mb-1">
                      <span className="text-[11px] font-medium text-slate-600">{simulatorScenario === 'vn' ? 'Budi' : 'Andi'}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-bold ${simulatorScenario === 'vn' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-sky-200 bg-sky-50 text-sky-600'}`}>{simulatorScenario === 'vn' ? 'WA' : 'TG'}</span>
                    </div>
                    <div className="max-w-[70%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      {simulatorScenario === 'vn' ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-violet-600 flex items-center justify-center shrink-0"><Play className="h-3 w-3 text-white fill-current pl-0.5" /></div>
                            <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-0 bg-violet-500 rounded-full" /></div>
                            <span className="text-[10px] text-slate-400">0:18</span>
                          </div>
                          <p className="text-[11px] text-slate-500 italic">"Frontend revisi padding LP, backend tambah schema DB user..."</p>
                        </div>
                      ) : (
                        <p className="text-[12px] text-slate-700">Kunci API staging server apa ya?</p>
                      )}
                    </div>
                  </div>

                  {/* Step 2: AI Processing */}
                  <div style={{ animation: simulatorStep >= 2 ? 'slide-in .5s ease both' : 'none', opacity: simulatorStep >= 2 ? 1 : 0 }}>
                    <div className="flex items-center gap-1.5 px-1 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      <span className="text-[11px] font-semibold text-violet-600">AI Assistant</span>
                    </div>
                    {simulatorStep === 2 ? (
                      <div className="max-w-[70%] bg-white border border-slate-200 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="text-[10px] text-slate-400">{simulatorScenario === 'vn' ? 'Memproses voice note...' : 'Mencari di memori chat...'}</p>
                      </div>
                    ) : (
                      <div className="max-w-[80%] bg-white border border-slate-200 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm space-y-1.5">
                        {[
                          simulatorScenario === 'vn' ? 'Transkripsi Whisper selesai' : 'Pencarian memori selesai',
                          simulatorScenario === 'vn' ? 'Tugas didekomposisi per divisi' : 'Jawaban ditemukan dari chat Budi',
                          simulatorScenario === 'vn' ? 'Ringkasan 1-2 kalimat dibuat' : 'Citation dengan nama & tanggal',
                        ].map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {t}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 3: Response */}
                  <div style={{ animation: simulatorStep >= 3 ? 'slide-in .5s ease both' : 'none', opacity: simulatorStep >= 3 ? 1 : 0 }}>
                    <div className="flex items-center gap-1.5 px-1 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      <span className="text-[11px] font-semibold text-violet-600">AI Assistant</span>
                    </div>
                    <div className="max-w-[85%] bg-white border border-slate-200 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                      {simulatorScenario === 'vn' ? (
                        <div className="space-y-2.5">
                          <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Tugas Terstruktur</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2"><span className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold shrink-0">FRONTEND</span><span className="text-[11px] text-slate-600">Revisi responsive landing page</span></div>
                            <div className="flex items-center gap-2"><span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold shrink-0">BACKEND</span><span className="text-[11px] text-slate-600">Tambah schema DB user settings</span></div>
                          </div>
                          <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                            <span className="text-[8px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-bold">WHISPER ASR</span>
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">DEADLINE: 3 Juli</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[12px] text-slate-700 leading-relaxed">
                            Berdasarkan diskusi dengan <strong>@Budi</strong> pada 2 Juli: kunci API staging adalah{' '}
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">staging_token_abc</code>
                          </p>
                          <div className="flex gap-1.5 pt-2 border-t border-slate-100">
                            <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">MEMORY HIT</span>
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">ANTI-SPAM: 2/5</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Pill input */}
            <div className="border-t border-slate-100 bg-white px-4 pb-3 pt-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><span className="text-slate-400 text-sm">+</span></div>
                <div className="flex-1 text-[12px] text-slate-400">{simulatorScenario ? 'Menunggu input...' : 'Tanyakan apa saja'}</div>
                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Mic className="h-3.5 w-3.5 text-slate-400" /></div>
              </div>
            </div>
          </div>

          {/* Step indicators */}
          {simulatorScenario && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {[{ n: 1, l: 'Pesan Masuk', I: Inbox }, { n: 2, l: 'AI Memproses', I: Brain }, { n: 3, l: 'Respons', I: Send }].map(({ n, l, I }, i) => (
                <div key={n} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${simulatorStep >= n ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-400'}`}>
                    <I className="h-3 w-3" /> {l}
                  </div>
                  {i < 2 && <div className={`w-6 h-px ${simulatorStep > n ? 'bg-violet-300' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── SECURITY ─── */}
      <section id="security" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.05), transparent 70%)' }} />
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-violet-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-gradient-to-tl from-emerald-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
              <Shield className="h-8 w-8 text-violet-600" />
            </div>
            <div className="space-y-3 text-left">
              <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest">Keamanan</p>
              <h2 className="text-xl font-bold text-slate-900">AES-256-GCM + HMAC-SHA256</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Seluruh kredensial API (WhatsApp, Telegram, Slack) dienkripsi AES-256-GCM dengan PBKDF2 key derivation.
                Webhook Slack diverifikasi HMAC-SHA256 dengan replay protection. Telegram menggunakan secret token verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15), transparent 60%)' }} />
        <div className="absolute top-[-100px] left-1/4 w-[600px] h-[300px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] right-1/4 w-[400px] h-[200px] bg-gradient-to-t from-fuchsia-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Siap Koordinasi Tanpa Scroll Chat?</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Transkripsi voice note otomatis, auto-reply cerdas, knowledge vault terstruktur, dan laporan harian — semua dalam satu dasbor.
          </p>
          <div className="pt-2">
            <Link to="/register" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-slate-100 transition-all hover:shadow-xl hover:shadow-white/10">
              Mulai Gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center"><Ghost className="h-3.5 w-3.5 text-white" /></div>
            <span className="text-xs font-bold text-slate-800">Ghost Relay</span>
          </div>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Ghost Relay. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
