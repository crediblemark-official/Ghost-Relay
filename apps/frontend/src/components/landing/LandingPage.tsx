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
  const [activeDemoTab, setActiveDemoTab] = useState<'inbox' | 'voice' | 'rag'>('inbox')

  const features = [
    {
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      title: "Universal Inbox",
      desc: "Satukan chat dari WhatsApp, Telegram, Slack, dan Web chat langsung ke dalam satu feed tunggal yang terintegrasi."
    },
    {
      icon: <Mic className="h-6 w-6 text-indigo-400" />,
      title: "Smart Voice Processing",
      desc: "Transkripsikan voice note secara otomatis, buat ringkasan cerdas, dan dekomposisi instruksi suara menjadi tugas siap pakai."
    },
    {
      icon: <Brain className="h-6 w-6 text-pink-400" />,
      title: "Auto-Reply RAG",
      desc: "Sistem kecerdasan buatan dapat membalas pesan secara kontekstual berdasarkan basis data histori percakapan."
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-400" />,
      title: "Knowledge Vault",
      desc: "Unggah dokumen pendukung untuk diindeks dan dicari secara semantik melalui semantic search bertenaga AI."
    },
    {
      icon: <Volume2 className="h-6 w-6 text-amber-400" />,
      title: "Voice Command",
      desc: "Kirim pesan ke platform eksternal atau grup hanya menggunakan instruksi suara langsung dari mikrofon PC Anda."
    },
    {
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: "AI Provider Agnostic",
      desc: "Bebas memilih provider model AI (OpenAI, Claude, Qwen, Gemini, Llama) sesuai dengan kebutuhan performa dan biaya."
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
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
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
          <span>Integrasi AI & Multi-Platform Generasi Baru</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Satu Dashboard. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Semua Saluran Pesan.</span> Bertenaga AI.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Satukan komunikasi dari Telegram, WhatsApp, Slack, dan Web chat secara real-time. Transkripsikan voice note, simpan memori pengetahuan, dan balas pesan otomatis dengan asisten kecerdasan buatan.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5">
            Mulai Demo Gratis <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center">
            Pelajari Fitur
          </a>
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
                onClick={() => setActiveDemoTab('inbox')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'inbox' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                Universal Inbox
              </button>
              <button 
                onClick={() => setActiveDemoTab('voice')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'voice' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                Voice AI
              </button>
              <button 
                onClick={() => setActiveDemoTab('rag')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'rag' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                RAG Memory
              </button>
            </div>
          </div>

          {/* Interactive Screen Body */}
          <div className="relative bg-[#0d0e15] rounded-xl p-4 sm:p-6 min-h-[300px] sm:min-h-[380px] text-left transition-all duration-300">
            
            {activeDemoTab === 'inbox' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Feed Pesan Masuk Terpadu</span>
                  <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">3 Saluran Aktif</span>
                </div>
                
                {/* Telegram Msg */}
                <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 relative">
                  <span className="absolute top-3 right-3 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">Telegram</span>
                  <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 shrink-0 text-sm">
                    JD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">John Doe (Klien A)</h4>
                    <p className="text-[12px] text-slate-300 mt-1">Halo Ghost, saya sudah mengirimkan mockup terbaru untuk aplikasi kita di grup. Tolong dicek ya.</p>
                  </div>
                </div>

                {/* WhatsApp Msg */}
                <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 relative">
                  <span className="absolute top-3 right-3 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">WhatsApp</span>
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-400 shrink-0 text-sm">
                    AL
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Alicia (Marketing)</h4>
                    <p className="text-[12px] text-slate-300 mt-1">🎙️ *Mengirimkan pesan suara (0:24)*</p>
                    <div className="mt-2.5 p-2.5 bg-purple-500/5 rounded-lg border border-purple-500/10 flex items-center gap-3">
                      <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <p className="text-[11px] text-purple-300 leading-normal"><strong className="text-white">AI Transcribe:</strong> "Tolong jadwalkan rapat besok jam 10 pagi bersama tim pengembangan untuk membahas rilis baru."</p>
                    </div>
                  </div>
                </div>

                {/* Slack Msg */}
                <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 relative">
                  <span className="absolute top-3 right-3 text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-semibold">Slack</span>
                  <div className="h-9 w-9 rounded-full bg-pink-500/10 flex items-center justify-center font-bold text-pink-400 shrink-0 text-sm">
                    DS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">#dev-alerts</h4>
                    <p className="text-[12px] text-slate-300 mt-1">Deployment prod server sukses dilakukan pada pukul 14:02. Semua servis terpantau sehat.</p>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'voice' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Pemrosesan Suara & Tugas AI</span>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Input Suara Diterima (WhatsApp / PC Mic)</h4>
                      <p className="text-[10px] text-slate-500">Durasi: 12 detik • Diproses via Whisper</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/5">
                      "Kirim pesan ke grup pengembang bahwa rapat mingguan diundur menjadi jam 2 siang ini."
                    </p>
                    
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <ChevronRight className="h-3 w-3 text-slate-500" />
                      <span>Mengidentifikasi intent: <strong className="text-purple-400">Task Dispatch</strong></span>
                    </div>

                    <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/10 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                        <span>Aksi AI Otomatis Dijalankan:</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal pl-5">
                        Pesan terkirim ke WhatsApp Group <span className="text-emerald-400">"Dev Team HQ"</span>: <br />
                        <span className="text-slate-300">"Pengumuman: Rapat mingguan diundur menjadi jam 2 siang ini."</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'rag' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Pencarian Semantik & Auto-Reply RAG</span>
                </div>
                
                <div className="space-y-3">
                  {/* User Query */}
                  <div className="flex gap-2 justify-end">
                    <div className="bg-purple-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-sm">
                      Berapa biaya langganan paket premium Ghost Relay dan fasilitas apa saja yang didapat?
                    </div>
                  </div>

                  {/* AI Vault Searching */}
                  <div className="flex gap-2 items-center text-xs text-slate-500">
                    <Brain className="h-3.5 w-3.5 text-purple-500 animate-pulse" />
                    <span>Mencari di Knowledge Vault (katalog-harga.pdf)...</span>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5 max-w-xl">
                    <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 shrink-0 text-xs">
                      🤖
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Asisten AI (Auto-Reply)</h4>
                      <p className="text-[12px] text-slate-300 mt-1 leading-relaxed">
                        Berdasarkan dokumen <span className="text-emerald-400">katalog-harga.pdf</span>, biaya paket Premium adalah Rp 150.000/bulan. Fasilitas mencakup:
                      </p>
                      <ul className="list-disc pl-4 text-[11px] text-slate-400 mt-1 space-y-1">
                        <li>Integrasi tanpa batas untuk Telegram & WhatsApp</li>
                        <li>Transkripsi voice note hingga 500 menit/bulan</li>
                        <li>Penyimpanan Knowledge Vault 5 GB</li>
                      </ul>
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
              Komunikasi yang Terstruktur Lebih Baik dengan AI
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Meninggalkan keruwetan mengelola puluhan platform chat secara manual. Asisten pintar kami membantu mengorganisasikan, menyarikan, dan merespons segala hal untuk Anda.
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
              <h3 className="text-lg font-bold text-white">Hubungkan Saluran</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Hubungkan WhatsApp dengan QR scan, daftarkan token bot Telegram, atau instal webhook Slack Anda dalam hitungan detik.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative text-center md:text-left">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Latih Asisten AI</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Unggah dokumen pendukung, SOP, atau instruksi kerja Anda ke dalam Vault untuk melatih ingatan asisten RAG internal.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative text-center md:text-left">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Delegasi & Kelola</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Gunakan dashboard inbox terpadu untuk memantau pesan masuk, transkripsi otomatis, dan jalankan kontrol suara.
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
                Data Anda Selalu Terenkripsi & Aman
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Kami memahami privasi dan kerahasiaan komunikasi Anda. Seluruh kredensial API, token integrasi pihak ketiga, dan history chat disimpan menggunakan enkripsi tingkat tinggi **AES-256-GCM**. Hanya Anda yang memegang kunci untuk membukanya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Siap Merevolusi Cara Anda Berkomunikasi?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Bergabunglah sekarang dan kelola semua pesan masuk dengan kepintaran buatan terbaik.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-10 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg shadow-white/5 transform hover:-translate-y-0.5 transition-all">
              Mulai Sekarang Gratis <ArrowRight className="h-4 w-4" />
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
