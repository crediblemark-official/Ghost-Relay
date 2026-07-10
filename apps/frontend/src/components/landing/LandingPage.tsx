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
  FileText, 
  Cpu, 
  Volume2
} from 'lucide-react'

export function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState<'gateway' | 'voice' | 'rag'>('gateway')

  const features = [
    {
      icon: <Mic className="h-6 w-6 text-indigo-400" />,
      title: "Task Splitter dari Voice Note",
      desc: "PM Anda hobi ngirim VN 5 menit? Ghost Relay otomatis mentranskrip, merangkum, dan memecah instruksinya jadi tugas terstruktur per divisi (Backend, Frontend, Design) di Slack/TG."
    },
    {
      icon: <Layers className="h-6 w-6 text-purple-400" />,
      title: "Chat sebagai Gateway AI",
      desc: "WhatsApp, Telegram, dan Slack hanya jembatan. Semua ide, catatan suara, dan file yang dikirim ke bot pribadi langsung tersimpan rapi di dashboard kerja Anda."
    },
    {
      icon: <Brain className="h-6 w-6 text-pink-400" />,
      title: "Auto-Reply Pertanyaan Berulang",
      desc: "Capek ditanya 'Mana staging URL?', 'Password database apa?'. AI otomatis menjawab pertanyaan berulang di grup chat berdasarkan riwayat percakapan lama."
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-400" />,
      title: "Anti-Scroll Knowledge Vault",
      desc: "Semua PDF, gambar mockup, dan link spreadsheet yang dikirim di chat otomatis terindeks. Anda bisa cari secara semantik tanpa perlu scroll chat ke atas."
    },
    {
      icon: <Volume2 className="h-6 w-6 text-amber-400" />,
      title: "Voice Command Dispatcher",
      desc: "Malas buka HP atau ngetik di keyboard? Cukup bicara di dasbor, AI akan meneruskan pesan atau koordinasi Anda ke grup WhatsApp tim secara asinkron."
    },
    {
      icon: <Cpu className="h-6 w-6 text-cyan-400" />,
      title: "AI Provider Bebas Pilih",
      desc: "Gunakan model LLM pilihan Anda sendiri—baik OpenAI, Claude, Qwen Cloud, maupun model lokal. Sesuaikan sendiri biaya dan tingkat akurasi."
    }
  ]

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 font-mono selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[500px] right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#06070a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Ghost className="h-4.5 w-4.5 text-purple-400" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              GHOST_RELAY$
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">./features</a>
            <a href="#demo" className="hover:text-white transition-colors">./interactive_demo</a>
            <a href="#workflow" className="hover:text-white transition-colors">./how_it_works</a>
            <a href="#security" className="hover:text-white transition-colors">./security</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold hover:text-white text-slate-300 transition-colors px-4 py-2">
              [ Login ]
            </Link>
            <Link 
              to="/login"
              className="bg-white text-black hover:bg-slate-200 px-4 py-2 rounded text-xs font-bold transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/5 text-slate-400 text-xs font-mono mb-8">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>HUMAN_TO_AI_TO_HUMAN_RELAY v1.0</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.2] mb-6">
          Capek dengerin voice note 5 menit & scroll chat cuma buat cari file?
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed mb-10 font-sans">
          Ghost Relay bertindak sebagai jembatan komunikasi asinkron tim Anda di WhatsApp, Telegram, dan Slack. Mengubah instruksi suara panjang menjadi pembagian tugas terstruktur, mengindeks file otomatis, dan menjawab pertanyaan tim yang berulang-ulang tanpa bantuan Anda.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/10">
            Mulai Tanpa HP <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded font-bold transition-all flex items-center justify-center">
            cd ./features
          </a>
        </div>

        {/* Stats Grid from PRD success metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-20 border-y border-white/5 py-6">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">70%</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-sans">VN & Scroll Chat Terpangkas</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">&lt; 10s</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-sans">Pencarian Staging URL / File</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">90%</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-sans">Q&A Berulang Terjawab Otomatis</div>
          </div>
        </div>

        {/* Hero Interactive Screen Preview */}
        <div id="demo" className="relative max-w-4xl mx-auto rounded-xl border border-white/10 bg-slate-950/20 p-2 sm:p-4 backdrop-blur-md shadow-2xl overflow-hidden">
          
          {/* Top Bar Decoration */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/5 px-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveDemoTab('gateway')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeDemoTab === 'gateway' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                1. Platform Gateway
              </button>
              <button 
                onClick={() => setActiveDemoTab('voice')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeDemoTab === 'voice' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                2. Voice Dispatcher
              </button>
              <button 
                onClick={() => setActiveDemoTab('rag')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeDemoTab === 'rag' ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                3. RAG Auto-Reply
              </button>
            </div>
          </div>

          {/* Interactive Screen Body */}
          <div className="relative bg-[#090a0f] rounded-lg p-4 sm:p-6 min-h-[300px] text-left font-mono">
            
            {activeDemoTab === 'gateway' && (
              <div className="space-y-4 animate-fade-in text-[12px]">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-slate-500">// LOG AKTIVITAS GATEWAY MASUK</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">ACTIVE_PULLING</span>
                </div>
                
                {/* Me to WhatsApp Self msg */}
                <div className="space-y-1 bg-white/[0.02] p-3 rounded border border-white/5 relative">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>FROM: Owner [WA Gateway]</span>
                    <span>TIMESTAMP: 14:02:11</span>
                  </div>
                  <p className="text-slate-200 mt-1">&gt; Ide bisnis: Membuat sistem monitoring server terdistribusi dengan auto-healing script.</p>
                  <div className="text-[10px] text-purple-400 pt-1 font-bold">
                    [SYSTEM]: Pesan di-relay dan dikelompokkan ke kategori ide bisnis.
                  </div>
                </div>

                {/* Telegram Bot Msg */}
                <div className="space-y-1 bg-white/[0.02] p-3 rounded border border-white/5 relative">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>FROM: John [TG Gateway]</span>
                    <span>TIMESTAMP: 14:03:52</span>
                  </div>
                  <p className="text-slate-200 mt-1">&gt; 📎 Mengirim file: mockup-dashboard-v3.pdf</p>
                  <div className="text-[10px] text-emerald-400 pt-1 font-bold">
                    [SYSTEM]: File diterima. Auto-index ke Folder: "Mockup Desain".
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'voice' && (
              <div className="space-y-4 animate-fade-in text-[12px]">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-slate-500">// SIMULASI DEKOMPOSISI PERINTAH SUARA</span>
                </div>
                
                <div className="p-4 bg-white/[0.02] rounded border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mic className="h-4 w-4 text-purple-400 shrink-0" />
                    <span>[INPUT_RECORDING]: 12 detik</span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded border border-white/5 text-slate-300">
                    "Kirim pesan ke grup pengembang Slack bahwa backend migrasi sudah selesai dijalankan."
                  </div>
                  
                  <div className="text-[11px] text-slate-500 space-y-1 pl-1">
                    <div>1. Analisis intents... <span className="text-purple-400">SUCCESS [RELAY_DISPATCH]</span></div>
                    <div>2. Memetakan target... <span className="text-pink-400">#dev-alerts (Slack)</span></div>
                  </div>

                  <div className="p-3 bg-purple-500/5 rounded border border-purple-500/10 space-y-1 text-[11px]">
                    <div className="font-bold text-white">[ACTION EXECUTED]:</div>
                    <p className="text-slate-400 pl-3">
                      Pesan terkirim ke Slack: <br />
                      <span className="text-slate-200">"Pemberitahuan: Backend migrasi sudah selesai dijalankan."</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'rag' && (
              <div className="space-y-4 animate-fade-in text-[12px]">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-slate-500">// AUTO-REPLY VIA WHATSAPP GATEWAY</span>
                </div>
                
                <div className="space-y-3">
                  {/* Client Query on WA */}
                  <div className="bg-white/5 p-3 rounded border border-white/5 max-w-md">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">CLIENT [WA Gateway]:</span>
                    URL staging dan kredensial testing-nya apa ya?
                  </div>

                  {/* AI Vault Searching */}
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pl-2">
                    <Brain className="h-3 w-3 text-purple-500" />
                    <span>Mencari kecocokan basis pengetahuan di Vault (database-credential.txt)...</span>
                  </div>

                  {/* AI Auto-Response relayed back to Client */}
                  <div className="bg-purple-950/20 p-3 rounded border border-purple-500/20 max-w-xl pl-4">
                    <span className="text-[10px] text-purple-400 font-bold block mb-1">GHOST_RELAY [AUTO_RESPONSE]:</span>
                    <p className="text-slate-300 leading-normal">
                      Staging URL: http://staging.ghost.local. <br />
                      Kredensial database telah dikirim terenkripsi ke DM Slack Anda. (Referensi: Chat @Andi pada 2 Juli).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-t border-white/5 bg-slate-950/10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Kurangi Kebiasaan Dengar VN & Scroll Chat Panjang
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-sans leading-relaxed">
              Jadikan Telegram, WhatsApp, dan Slack murni sebagai pintu masuk/keluar pesan. Biarkan AI memilah info teknis penting secara asinkron tanpa mengganggu workflow coding Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div 
                key={i}
                className="p-6 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="h-10 w-10 bg-white/5 rounded border border-white/10 flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Section */}
      <section id="workflow" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Setup Workspace dalam 3 Langkah
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-sans">
              Menghubungkan asisten AI ke platform komunikasi Anda semudah menyalin token.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-5 border border-white/5 rounded bg-white/[0.01]">
              <div className="text-[10px] text-purple-400 font-bold mb-2">// STEP_01</div>
              <h3 className="text-sm font-bold text-white mb-2">Pindai QR / Tambah Bot</h3>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Scan kode QR untuk WhatsApp, atau masukkan token API Telegram / Slack Anda secara terenkripsi ke dalam platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 border border-white/5 rounded bg-white/[0.01]">
              <div className="text-[10px] text-purple-400 font-bold mb-2">// STEP_02</div>
              <h3 className="text-sm font-bold text-white mb-2">Latih Vault Dokumen</h3>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Kirim dokumen referensi lewat gateway chat atau unggah langsung ke Knowledge Vault untuk melatih kecerdasan asisten AI.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 border border-white/5 rounded bg-white/[0.01]">
              <div className="text-[10px] text-purple-400 font-bold mb-2">// STEP_03</div>
              <h3 className="text-sm font-bold text-white mb-2">Bebas Gangguan Berulang</h3>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Asisten AI siap memproses voice command Anda, mengarsipkan chat pribadi, atau menjawab otomatis pertanyaan dari klien Anda secara mandiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-white/5 bg-[#06070a] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-lg border border-white/10 bg-white/[0.01] p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="h-14 w-14 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Shield className="h-7 w-7 text-purple-400" />
            </div>
            <div className="space-y-2 text-left">
              <span className="text-[10px] text-purple-400 font-bold block">// SECURE_STORAGE_CREDENTIAL</span>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Data Kredensial Gateway Terenkripsi AES-256-GCM
              </h2>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Kami sangat memprioritaskan keamanan. Seluruh token gateway Telegram & Slack serta session file WhatsApp disimpan menggunakan enkripsi tingkat tinggi **AES-256-GCM**. Kredensial tidak pernah dapat dilihat secara mentah oleh siapa pun termasuk administrator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Hubungkan Asisten AI Anda Sekarang
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
            Mulai kelola basis pengetahuan dan otomatisasi asisten komunikasi Anda dengan gateway terbaik.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-10 py-4 bg-white text-slate-950 hover:bg-slate-200 rounded font-bold inline-flex items-center gap-2 shadow-lg shadow-white/5 transition-all text-xs">
              Hubungkan Sekarang [Enter] <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#040508]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/5 border border-white/10">
              <Ghost className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-400">GHOST_RELAY$</span>
          </div>

          <p className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} Ghost Relay. All rights reserved.
          </p>

          <div className="flex gap-6 text-[10px] text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Hubungi Kami</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
