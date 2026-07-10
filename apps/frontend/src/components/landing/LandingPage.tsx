import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { 
  Ghost, 
  Mic, 
  Shield, 
  Sparkles, 
  Brain, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Cpu, 
  Volume2
} from 'lucide-react'

export function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState<'gateway' | 'voice' | 'rag'>('gateway')

  const features = [
    {
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      title: "Platform Gateway",
      desc: "Gunakan WhatsApp, Telegram, dan Slack sebagai gateway instan untuk menyalurkan catatan pribadi, voice note, atau file ke asisten AI Anda."
    },
    {
      icon: <Mic className="h-6 w-6 text-indigo-400" />,
      title: "Smart Voice Processing",
      desc: "Kirim pesan suara via gateway untuk ditranskripsikan, diringkas, dan didekomposisi otomatis menjadi daftar tugas siap pakai."
    },
    {
      icon: <Brain className="h-6 w-6 text-pink-400" />,
      title: "Auto-Reply RAG",
      desc: "Asisten AI secara otomatis menjawab pertanyaan klien di Telegram/WhatsApp/Slack dengan referensi data histori percakapan."
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-400" />,
      title: "Knowledge Vault",
      desc: "Simpan dokumen (PDF, TXT, dll) secara terenkripsi untuk pencarian semantik dan melatih basis pengetahuan asisten RAG Anda."
    },
    {
      icon: <Volume2 className="h-6 w-6 text-amber-400" />,
      title: "Voice Command Dispatcher",
      desc: "Kirim instruksi suara dari mikrofon dasbor Anda untuk diteruskan atau didelegasikan sebagai pesan ke grup chat eksternal."
    },
    {
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: "AI Provider Agnostic",
      desc: "Bebas memilih provider model AI (OpenAI, Claude, Qwen, Gemini, Llama) sesuai kebutuhan performa dan keamanan data."
    }
  ]

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#08090d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <Ghost className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <span className="text-md font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Ghost Relay
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Fitur</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo Gateway</a>
            <a href="#workflow" className="hover:text-white transition-colors">Cara Kerja</a>
            <a href="#security" className="hover:text-white transition-colors">Keamanan</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[13px] font-semibold hover:text-white text-slate-300 transition-colors px-4 py-2">
              Masuk
            </Link>
            <Link 
              to="/login"
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-semibold text-white rounded-lg group bg-gradient-to-br from-purple-600 to-indigo-500 group-hover:from-purple-600 group-hover:to-indigo-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-indigo-800 transition-all cursor-pointer mt-2"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-[#08090d] rounded-md group-hover:bg-opacity-0">
                Mulai Sekarang
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="h-3 w-3" />
          <span>Jembatan Koordinasi Tim (Human → AI → Human)</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Hubungkan Asisten AI Anda ke <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">WhatsApp, Telegram, dan Slack.</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
          Ghost Relay adalah sistem komunikasi asinkron berbasis AI (Human → AI → Human) yang bertindak sebagai "Penerjemah & Pengorganisir" di tengah-tengah tim. Menghemat hingga 70% waktu koordinasi dengan mengubah instruksi suara menjadi tugas terstruktur, mengelompokkan berkas otomatis, dan menjawab pertanyaan berulang.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5">
            Mulai Demo Gratis <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center">
            Pelajari Fitur
          </a>
        </div>

        {/* Stats Grid from PRD success metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16 border-y border-white/5 py-5">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">70%</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">Waktu Koordinasi Terhemat</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">&lt; 10s</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">Pencarian File di Vault</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">90%</div>
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">Pertanyaan Berulang Terjawab</div>
          </div>
        </div>

        {/* Hero Interactive Screen Preview */}
        <div id="demo" className="relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-slate-950/40 p-2 sm:p-4 backdrop-blur-md shadow-2xl overflow-hidden">
          
          {/* Top Bar Decoration */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/5 px-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveDemoTab('gateway')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'gateway' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                Platform Gateway
              </button>
              <button 
                onClick={() => setActiveDemoTab('voice')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'voice' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                Voice Dispatcher
              </button>
              <button 
                onClick={() => setActiveDemoTab('rag')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'rag' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                RAG Auto-Reply
              </button>
            </div>
          </div>

          {/* Interactive Screen Body */}
          <div className="relative bg-[#0d0e15] rounded-xl p-4 sm:p-6 min-h-[300px] sm:min-h-[380px] text-left transition-all duration-300">
            
            {activeDemoTab === 'gateway' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Gateway Input: Catatan & Berkas Masuk</span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-medium">Relay Terenkripsi</span>
                </div>
                
                {/* Me to WhatsApp Self msg */}
                <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 relative">
                  <span className="absolute top-3 right-3 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">WhatsApp Gateway</span>
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-400 shrink-0 text-sm">
                    Me
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Owner ("Message Yourself")</h4>
                    <p className="text-[12px] text-slate-300 mt-1">Ide bisnis: Membuat sistem monitoring server terdistribusi dengan auto-healing script.</p>
                    <div className="mt-2.5 p-2 bg-purple-500/5 rounded-lg border border-purple-500/10 text-[10px] text-purple-300">
                      ⚡ <strong>Relayed:</strong> Catatan berhasil disimpan ke dalam basis data ide AI Anda.
                    </div>
                  </div>
                </div>

                {/* Telegram Bot Msg */}
                <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 relative">
                  <span className="absolute top-3 right-3 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">Telegram Gateway</span>
                  <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 shrink-0 text-sm">
                    TB
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Ghost Relay Bot</h4>
                    <p className="text-[12px] text-slate-300 mt-1">📎 <strong>Mengirim berkas:</strong> dokumen-proyek.pdf</p>
                    <div className="mt-2.5 p-2.5 bg-purple-500/5 rounded-lg border border-purple-500/10 flex items-center gap-3">
                      <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                      <p className="text-[11px] text-purple-300 leading-normal"><strong className="text-white">AI Indexer:</strong> "dokumen-proyek.pdf telah disimpan secara aman dan diindeks ke dalam **Knowledge Vault** Anda untuk RAG."</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'voice' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Voice Command & Task Dispatcher</span>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Dasbor Kontrol Suara (Mikrofon PC)</h4>
                      <p className="text-[10px] text-slate-500">Menerjemahkan suara ke aksi sistem</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/5">
                      "Kirim pesan ke grup pengembang Slack bahwa backend migrasi sudah selesai dijalankan."
                    </p>
                    
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <ChevronRight className="h-3 w-3 text-slate-500" />
                      <span>Mengidentifikasi intent: <strong className="text-purple-400">Relay Message</strong></span>
                    </div>

                    <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                        <span>Eksekusi Sukses via Slack Gateway:</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pl-5">
                        Relay ke Slack Channel <span className="text-pink-400">"#dev-alerts"</span>: <br />
                        <span className="text-slate-300">"Pemberitahuan: Backend migrasi sudah selesai dijalankan."</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'rag' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Auto-Reply Klien via Chat Gateway (RAG)</span>
                </div>
                
                <div className="space-y-3">
                  {/* Client Query on WA */}
                  <div className="flex gap-2 justify-start">
                    <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-sm">
                      <span className="text-[9px] text-emerald-400 block font-bold mb-1">WhatsApp Client</span>
                      Halo, jam berapa kantor Ghost Relay melayani konsultasi offline hari ini?
                    </div>
                  </div>

                  {/* AI Vault Searching */}
                  <div className="flex gap-2 items-center text-xs text-slate-500">
                    <Brain className="h-3.5 w-3.5 text-purple-500 animate-pulse" />
                    <span>Mencari kecocokan data RAG (jadwal-operasional.txt)...</span>
                  </div>

                  {/* AI Auto-Response relayed back to Client */}
                  <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 max-w-xl">
                    <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 shrink-0 text-xs">
                      🤖
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Ghost Auto-Reply (Relayed to Client WA)</h4>
                      <p className="text-[12px] text-slate-300 mt-1 leading-relaxed">
                        Halo! Sesuai dokumen <span className="text-emerald-400">jadwal-operasional.txt</span>, konsultasi offline dibuka setiap hari Senin - Jumat pukul 09:00 hingga 17:00 WIB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-t border-white/5 bg-slate-950/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              AI Workspace yang Terintegrasi Dengan Saluran Pesan Anda
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Jadikan Telegram, WhatsApp, dan Slack sebagai asisten input nirkabel Anda untuk menyimpan catatan, melatih database, dan mengontrol workflow asisten AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div 
                key={i}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl hover:shadow-purple-500/[0.02] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-md font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Section */}
      <section id="workflow" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Mulai Hanya dalam 3 Langkah Sederhana
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Menghubungkan asisten AI ke platform komunikasi Anda semudah memindai kode QR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 relative text-center md:text-left">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Hubungkan Gateway</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Scan kode QR untuk WhatsApp, atau masukkan token API Telegram / Slack Anda secara terenkripsi ke dalam platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative text-center md:text-left">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Latih Basis Pengetahuan</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Kirim dokumen referensi lewat gateway chat atau unggah langsung ke Knowledge Vault untuk melatih kecerdasan asisten AI.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative text-center md:text-left">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Mulai Interaksi & Auto-Reply</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Asisten AI siap memproses voice command Anda, mengarsipkan chat pribadi, atau menjawab otomatis pertanyaan dari klien Anda secara mandiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/5 bg-white/[0.01] p-8 sm:p-12 backdrop-blur-md flex flex-col md:flex-row items-center gap-10">
            <div className="h-20 w-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Shield className="h-10 w-10 text-purple-400" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Keamanan Kelas Enterprise</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Data Kredensial Gateway Terenkripsi Aman
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Kami memahami privasi dan kerahasiaan komunikasi Anda. Seluruh token gateway Telegram & Slack serta session file WhatsApp disimpan menggunakan enkripsi tingkat tinggi **AES-256-GCM**. Server Anda terlindungi dengan standar enkripsi asimetris dan firewall berlapis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hubungkan Asisten AI Anda Sekarang
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Mulai kelola basis pengetahuan dan otomatisasi asisten komunikasi Anda dengan gateway terbaik.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-10 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg shadow-white/5 transform hover:-translate-y-0.5 transition-all">
              Hubungkan Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#06070a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 ring-1 ring-purple-500/20">
              <Ghost className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <span className="text-[12px] font-bold text-slate-400">Ghost Relay</span>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} Ghost Relay. All rights reserved.
          </p>

          <div className="flex gap-6 text-[11px] text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Hubungi Kami</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
