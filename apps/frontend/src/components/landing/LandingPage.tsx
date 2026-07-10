import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { 
  Ghost, 
  Shield, 
  ArrowRight, 
  Play, 
  Search,
  CheckCircle2,
  FileText,
  Clock,
  Mic,
  MessageSquare,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react'

export function LandingPage() {
  const [typedQuery, setTypedQuery] = useState('')

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
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      
      {/* Light Blueprint Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none -z-10" />

      {/* Subtle Background Glows */}
      <div className="absolute top-[100px] left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
              <Ghost className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              Ghost Relay
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-600">
            <a href="#features" className="hover:text-purple-600 transition-colors">Fitur</a>
            <a href="#bento" className="hover:text-purple-600 transition-colors">Pusat Dokumen</a>
            <a href="#workflow" className="hover:text-purple-600 transition-colors">Cara Kerja</a>
            <a href="#security" className="hover:text-purple-600 transition-colors">Keamanan</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-bold text-slate-700 hover:text-purple-600 transition-colors px-3 py-2">
              Masuk
            </Link>
            <Link 
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm px-4 py-2 rounded-lg text-xs font-bold transition-all"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Left-Right Split (Asymmetric layout) */}
      <section className="relative pt-16 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline and Call-To-Action */}
        <div className="lg:col-span-5 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Asisten AI & Pusat Koordinasi Tim</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            Hubungkan Asisten AI Anda ke WhatsApp, Telegram, dan Slack.
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Ghost Relay adalah jembatan komunikasi asinkron yang mengubah instruksi suara panjang menjadi pembagian tugas divisi, menyalin berkas penting otomatis, dan menjawab pertanyaan berulang tim secara mandiri.
          </p>

          {/* Quick Checklist */}
          <ul className="text-sm space-y-3 text-slate-600">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              <span>Voice note panjang dikonversi jadi tugas divisi</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              <span>Mockup dan berkas chat otomatis tersimpan di folder dasbor</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
              <span>Jawaban otomatis pertanyaan tim via database memori AI</span>
            </li>
          </ul>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/login" className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all text-xs flex items-center gap-2 shadow-lg shadow-purple-600/10">
              Coba Demo Gratis <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold transition-all text-xs shadow-sm">
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Right Column: High-Fidelity Workspace Dashboard Preview Card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            {/* Mock Dashboard Window Header */}
            <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <div className="text-xs font-bold text-slate-500 tracking-wide">
                Aktivitas Gateway
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Gateway Terhubung</span>
              </div>
            </div>

            {/* Dashboard Workspace Body */}
            <div className="p-5 sm:p-6 space-y-5">
              
              {/* WhatsApp Message Source Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">WhatsApp Gateway</span>
                    <span className="text-xs font-bold text-slate-800">Manajer Proyek (Budi)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">14:02 WIB</span>
                </div>
                
                {/* Audio Wave Player Simulation */}
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-100">
                  <button className="h-7 w-7 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-purple-700 transition-colors">
                    <Play className="h-3 w-3 fill-current pl-0.5" />
                  </button>
                  <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-purple-600" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 0:24
                  </span>
                </div>
              </div>

              {/* AI Transcription Result Card */}
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/70 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-900">Hasil Analisis & Pembagian Tugas AI</span>
                </div>
                
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  "Ubah palet warna mockup desain ke monokrom, dan pastikan backend memperbaiki endpoint login sebelum deployment sore ini."
                </p>

                <div className="pt-2 border-t border-purple-100 grid grid-cols-2 gap-4">
                  <div className="p-2 bg-white rounded border border-purple-100/50">
                    <span className="text-[10px] font-bold text-pink-600 block uppercase">Divisi Desain</span>
                    <span className="text-[11px] text-slate-700 font-medium">Revisi warna mockup ke monokrom</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-purple-100/50">
                    <span className="text-[10px] font-bold text-indigo-600 block uppercase">Divisi Backend</span>
                    <span className="text-[11px] text-slate-700 font-medium">Fix endpoint auth login</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Maksimalkan Waktu Kerja Fokus Tanpa Gangguan
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Biarkan asisten AI mendistribusikan koordinasi tim Anda secara asinkron lewat saluran chat favorit Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl border border-slate-100 bg-[#f8fafc]/50 hover:bg-[#f8fafc] hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200/80 flex items-center justify-center mb-5 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Layout Section */}
      <section id="bento" className="py-20 border-t border-slate-200 bg-[#f8fafc]/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Pusat Dokumen & Integrasi Cerdas
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Akses cepat berkas, dokumen memori, dan otomasi pencarian AI tim Anda.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">
            
            {/* Card 1: Voice Task Splitter (Large - 2/3 width) */}
            <div className="md:col-span-8 p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full font-bold uppercase">Hasil Transkripsi Suara</span>
                <h3 className="text-base font-bold text-slate-900">Pembagian Tugas Otomatis</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg">
                  Catatan suara PM Anda diproses, dianalisis intents-nya, dan diteruskan menjadi task list yang sesuai ke grup pengembang terkait.
                </p>
              </div>

              {/* Visual Audio Waveform Simulation */}
              <div className="h-16 w-full flex items-end gap-1 border-t border-slate-100 pt-3">
                {[4, 8, 12, 5, 9, 14, 20, 12, 6, 8, 15, 24, 18, 9, 12, 16, 22, 10, 4, 9, 14, 6, 12, 18, 9, 5, 8, 12, 6, 11, 4, 9, 15].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-slate-200 group-hover:bg-purple-600 rounded transition-all duration-300"
                    style={{ height: `${height * 3}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Security Credentials (Small - 1/3 width) */}
            <div className="md:col-span-4 p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full font-bold uppercase">Keamanan</span>
                <h3 className="text-base font-bold text-slate-900">Enkripsi AES-256</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Seluruh token API, verify token webhook, dan session file Anda dienkripsi penuh di level database.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Lock className="h-4 w-4 text-pink-500" />
                  <span className="text-[10px] tracking-wider font-bold">Kredensial Terenkripsi</span>
                </div>
                <div className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">
                  AMAN
                </div>
              </div>
            </div>

            {/* Card 3: Knowledge Vault (Small - 1/3 width) */}
            <div className="md:col-span-4 p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold uppercase">Penyimpanan File</span>
                <h3 className="text-base font-bold text-slate-900">Anti-Scroll Dokumen</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Berkas penting dikumpulkan rapi di dalam dasbor berdasarkan topik diskusi grup chat.
                </p>
              </div>

              {/* Mock Directory Tree UI */}
              <div className="border-t border-slate-100 pt-3.5 text-xs space-y-1.5 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">📁</span>
                  <span className="font-semibold text-slate-700">/kontrak_klien</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">📁</span>
                  <span className="font-semibold text-slate-700">/desain_mockup</span>
                </div>
                <div className="flex items-center gap-1.5 pl-4">
                  <span>📄</span>
                  <span className="text-slate-500 text-[11px]">mockup-v3.png (1.2MB)</span>
                </div>
              </div>
            </div>

            {/* Card 4: RAG Auto-Reply (Large - 2/3 width) */}
            <div className="md:col-span-8 p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-full font-bold uppercase">Memori Percakapan</span>
                <h3 className="text-base font-bold text-slate-900">Auto-Reply RAG</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg">
                  AI mendeteksi pertanyaan berulang di grup, memindai basis data percakapan lama, dan membalas otomatis dengan rujukan data yang tepat.
                </p>
              </div>

              {/* RAG Search Bar Simulation */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500 w-full pr-4">
                  <Search className="h-4 w-4 text-cyan-600" />
                  <input 
                    type="text" 
                    placeholder="Mencari file atau kredensial di Vault..." 
                    value={typedQuery}
                    onChange={(e) => setTypedQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 w-full"
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Kecocokan: <strong className="text-cyan-600">98%</strong></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works / Workflow Section */}
      <section id="workflow" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Mulai Koordinasi dengan Mudah
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Menghubungkan asisten AI ke platform komunikasi Anda hanya butuh 3 langkah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest block mb-3">Langkah 01</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Hubungkan Gateway</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Scan kode QR untuk menghubungkan WhatsApp pribadi, atau tambahkan token API Telegram dan Slack Anda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest block mb-3">Langkah 02</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Unggah Basis Dokumen</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Kirim file referensi di chat atau unggah berkas PDF/Excel secara langsung ke halaman dasbor basis pengetahuan Anda.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest block mb-3">Langkah 03</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">Aktifkan Asisten</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Asisten AI aktif otomatis melacak tugas, mengekstrak data percakapan, dan melayani auto-reply kontekstual.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-slate-200 bg-[#f8fafc]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-2 text-left">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">Standar Keamanan Tinggi</span>
              <h2 className="text-base font-bold text-slate-900">Kredensial API Terenkripsi AES-256-GCM</h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Keamanan adalah prioritas kami. Semua token API Telegram/Slack serta data otentikasi WhatsApp dilindungi dengan enkripsi simetris AES-256-GCM. Kunci enkripsi disimpan di variabel server yang terisolasi sepenuhnya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center relative border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Mulai Gunakan Ghost Relay Hari Ini
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Optimalkan koordinasi tim asinkron dan bebaskan diri dari distraksi tumpukan chat yang tak kunjung habis.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold inline-flex items-center gap-2 shadow-lg shadow-purple-600/10 transition-all text-xs">
              Mulai Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-600">
              <Ghost className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-800">Ghost Relay</span>
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
