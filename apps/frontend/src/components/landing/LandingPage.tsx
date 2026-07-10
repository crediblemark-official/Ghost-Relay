import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { 
  Ghost, 
  Shield, 
  ArrowRight, 
  Terminal, 
  Lock, 
  Play, 
  Search
} from 'lucide-react'

export function LandingPage() {
  const [typedQuery, setTypedQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 font-mono selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      
      {/* Blueprint Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Floating Accent Glows */}
      <div className="absolute top-[200px] left-[-100px] w-[350px] h-[350px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-[500px] right-[-100px] w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[70px] pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#07080a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-900 border border-white/10">
              <Ghost className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-white tracking-wider">GHOST_RELAY:~$</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <a href="#features" className="hover:text-white transition-colors">01. features</a>
            <a href="#bento" className="hover:text-white transition-colors">02. bento_grid</a>
            <a href="#workflow" className="hover:text-white transition-colors">03. workflow</a>
            <a href="#security" className="hover:text-white transition-colors">04. security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-bold hover:text-white text-slate-300 transition-colors px-3 py-1.5">
              [ Login ]
            </Link>
            <Link 
              to="/login"
              className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/20 px-3.5 py-1.5 rounded text-xs font-bold transition-all"
            >
              Start Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Left-Right Split (Asymmetric layout) */}
      <section className="relative pt-16 pb-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline and Call-To-Action */}
        <div className="lg:col-span-5 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-400 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>RELAY_STATUS: ON_AIR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1] uppercase">
            Jembatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Koordinasi Asinkron</span> Tanpa Scroll Chat.
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
            Tim terbagi di WhatsApp, Telegram, dan Slack? Biarkan AI bertindak sebagai perantara cerdas. Ghost Relay mengubah instruksi suara panjang menjadi pembagian tugas divisi, menyalin dokumen otomatis, dan mengotomatiskan auto-reply klien.
          </p>

          {/* Quick Pain Point Checklist */}
          <ul className="text-xs space-y-2 text-slate-500 border-l border-white/5 pl-4 py-1">
            <li className="flex items-center gap-2">
              <span className="text-purple-400">✓</span> VN 5 menit dikonversi jadi ringkasan & tugas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">✓</span> Dokumen di grup otomatis terkelompok di folder
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400">✓</span> Tanya jawab berulang dijawab otomatis oleh AI
            </li>
          </ul>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/login" className="px-6 py-3 bg-white text-black hover:bg-slate-200 rounded font-bold transition-all text-xs flex items-center gap-2 shadow-lg shadow-white/5">
              Akses Dasbor <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#bento" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded font-bold transition-all text-xs">
              cd ./bento_grid
            </a>
          </div>
        </div>

        {/* Right Column: High-Fidelity Workspace Terminal Simulation */}
        <div className="lg:col-span-7">
          <div className="rounded-lg border border-white/10 bg-[#0b0c10] shadow-2xl overflow-hidden">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between bg-[#111218] px-4 py-2.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-purple-400" />
                <span>workspace_terminal.log</span>
              </div>
              <span className="w-4" />
            </div>

            {/* Terminal Screen Container */}
            <div className="p-4 sm:p-5 text-[11px] leading-relaxed text-slate-300 space-y-4">
              <div className="text-slate-500">// INISIALISASI CONSOLE SERVER</div>
              
              <div className="flex gap-2">
                <span className="text-purple-400 font-bold">&gt;</span>
                <p>git log --oneline -n 1</p>
              </div>
              <div className="text-slate-500 pl-4 font-sans">
                ad0d36a (HEAD -&gt; master) fix: add BETTER_AUTH_SECRET configuration
              </div>

              <div className="flex gap-2">
                <span className="text-purple-400 font-bold">&gt;</span>
                <p>docker compose up -d --build</p>
              </div>
              <div className="pl-4 text-emerald-400 font-sans space-y-1">
                <div>[✔] Container ghost-relay-db-1  Healthy</div>
                <div>[✔] Container ghost-relay       Running (port 8000)</div>
              </div>

              <div className="border-t border-white/5 my-4 pt-3 text-slate-500">// MONITORING LIVE GATEWAY</div>

              {/* Telegram Gateway Incoming VN */}
              <div className="space-y-1.5 bg-white/[0.01] p-3 rounded border border-white/5">
                <div className="flex justify-between items-center text-[9px] text-slate-500">
                  <span className="text-blue-400 font-bold">[TELEGRAM_GATEWAY] Incoming Voice Note</span>
                  <span>14:32:01</span>
                </div>
                <div className="flex items-center gap-2 py-1 bg-black/40 px-2 rounded text-slate-400">
                  <Play className="h-3 w-3 text-purple-400" />
                  <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-purple-500 animate-pulse" />
                  </div>
                  <span>0:24s</span>
                </div>
                <div className="text-purple-300 text-[10px] pl-1 leading-normal font-sans">
                  <strong>Transcription (Whisper):</strong> "Tolong sampaikan ke bagian desain untuk mengganti palet warna logo ke monokrom, dan backend perbaiki API endpoint auth."
                </div>
                <div className="text-slate-400 text-[10px] pl-1 font-sans">
                  <strong>AI Action Splitter:</strong>
                  <ul className="list-disc pl-4 text-slate-500 space-y-0.5 mt-1">
                    <li><span className="text-pink-400">Design Team:</span> Ubah palet logo ke monokrom</li>
                    <li><span className="text-cyan-400">Backend Team:</span> Fix API endpoint auth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout Section */}
      <section id="bento" className="py-20 border-t border-white/5 bg-[#060709] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              // DATA_VAULT & ASYNCHRONOUS_COMMANDS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-sans">
              Asisten AI dan panel manajemen workspace dikelompokkan secara terstruktur.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">
            
            {/* Card 1: Voice Task Splitter (Large - 2/3 width) */}
            <div className="md:col-span-8 p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-purple-400 font-bold">// FEATURE_01</span>
                <h3 className="text-sm font-bold text-white uppercase">Voice Note Task Splitter</h3>
                <p className="text-slate-400 text-xs font-sans leading-relaxed max-w-lg">
                  Instruksi suara di Telegram/WA dipotong-potong secara otomatis oleh AI menjadi kartu tugas terpisah per divisi di Slack. Anda tidak perlu memutarnya manual.
                </p>
              </div>

              {/* Visual Audio Waveform Simulation */}
              <div className="h-16 w-full flex items-end gap-1 border-t border-white/5 pt-2">
                {[4, 8, 12, 5, 9, 14, 20, 12, 6, 8, 15, 24, 18, 9, 12, 16, 22, 10, 4, 9, 14, 6, 12, 18, 9, 5, 8, 12].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-white/10 group-hover:bg-purple-500/40 rounded transition-all duration-300"
                    style={{ height: `${height * 2}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Security Credentials (Small - 1/3 width) */}
            <div className="md:col-span-4 p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-pink-400 font-bold">// FEATURE_02</span>
                <h3 className="text-sm font-bold text-white uppercase">AES-256 Encryption</h3>
                <p className="text-slate-400 text-xs font-sans leading-relaxed">
                  Semua API token WhatsApp, Telegram, dan Slack dienkripsi secara asimetris dengan algoritma AES-256-GCM.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-1.5 text-slate-600">
                  <Lock className="h-4 w-4 text-pink-500" />
                  <span className="text-[10px] tracking-widest font-mono">HASHED_CREDENTIAL</span>
                </div>
                <div className="text-[9px] bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded font-bold">
                  SECURE
                </div>
              </div>
            </div>

            {/* Card 3: Knowledge Vault (Small - 1/3 width) */}
            <div className="md:col-span-4 p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-emerald-400 font-bold">// FEATURE_03</span>
                <h3 className="text-sm font-bold text-white uppercase">Anti-Scroll Vault</h3>
                <p className="text-slate-400 text-xs font-sans leading-relaxed">
                  Mockup, berkas invoice, dan tautan spreadsheet yang dibagikan otomatis tersimpan di folder dasbor yang rapi.
                </p>
              </div>

              {/* Mock Directory Tree UI */}
              <div className="border-t border-white/5 pt-3 text-[10px] space-y-1.5 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">📁</span>
                  <span>/kontrak_klien_a</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500">📁</span>
                  <span>/ui_mockup_v3</span>
                </div>
                <div className="flex items-center gap-1.5 pl-4">
                  <span>📄</span>
                  <span className="text-slate-400">dashboard-v3.png (1.2MB)</span>
                </div>
              </div>
            </div>

            {/* Card 4: RAG Auto-Reply (Large - 2/3 width) */}
            <div className="md:col-span-8 p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 transition-all flex flex-col justify-between overflow-hidden relative group">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] text-cyan-400 font-bold">// FEATURE_04</span>
                <h3 className="text-sm font-bold text-white uppercase">RAG Memory Search</h3>
                <p className="text-slate-400 text-xs font-sans leading-relaxed max-w-lg">
                  Mengintegrasikan Vector database untuk melacak histori chat lama. Saat anggota baru menanyakan 'staging database', AI mencocokkan kemiripan kosinus teks dan membalas instan.
                </p>
              </div>

              {/* RAG Search Bar Simulation */}
              <div className="bg-black/30 p-2 rounded border border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-slate-500">
                  <Search className="h-3 w-3 text-cyan-400" />
                  <input 
                    type="text" 
                    placeholder="Tanya basis pengetahuan..." 
                    value={typedQuery}
                    onChange={(e) => setTypedQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-slate-300 w-48"
                  />
                </div>
                <div className="text-slate-500">CONFIDENCE: <strong className="text-cyan-400">98.2%</strong></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works / Workflow Section */}
      <section id="workflow" className="py-20 border-t border-white/5 bg-[#07080a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              // HOW_IT_WORKS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-sans">
              Prosedur integrasi asisten AI ke gateway komunikasi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[12px] leading-relaxed">
            
            {/* Step 1 */}
            <div className="border border-white/5 rounded-lg p-5 bg-white/[0.01]">
              <div className="text-purple-400 font-bold mb-2">&gt; SCAN_QR_CONNECT</div>
              <h3 className="text-white font-bold mb-1 uppercase text-[13px]">1. Sambungkan Bot</h3>
              <p className="text-slate-500 font-sans">
                Scan kode QR untuk menghubungkan WhatsApp pribadi, daftarkan bot token Telegram, atau sambungkan Slack Webhook secara instan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-white/5 rounded-lg p-5 bg-white/[0.01]">
              <div className="text-purple-400 font-bold mb-2">&gt; FEED_AI_MEMORY</div>
              <h3 className="text-white font-bold mb-1 uppercase text-[13px]">2. Latih AI Vault</h3>
              <p className="text-slate-500 font-sans">
                Unggah dokumen pendukung tim ke dasbor, atau kirim langsung berkas PDF melalui gateway chat Telegram untuk diindeks AI.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-white/5 rounded-lg p-5 bg-white/[0.01]">
              <div className="text-purple-400 font-bold mb-2">&gt; RELAY_COORDINATION</div>
              <h3 className="text-white font-bold mb-1 uppercase text-[13px]">3. Jalankan Asisten</h3>
              <p className="text-slate-500 font-sans">
                Asisten RAG Anda otomatis aktif di latar belakang untuk menjawab chat berulang di grup, memecah voice note, dan menerima perintah suara.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 border-t border-white/5 bg-[#060709]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto rounded-lg border border-white/10 bg-white/[0.01] p-8 flex flex-col md:flex-row items-center gap-8 font-mono">
            <div className="h-12 w-12 rounded bg-[#111218] border border-white/10 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div className="space-y-2 text-left text-[12px]">
              <div className="text-purple-400 font-bold">// INTEGRITY_CHECK</div>
              <h2 className="text-sm font-bold text-white uppercase">Token & File Terenkripsi Sepenuhnya</h2>
              <p className="text-slate-500 font-sans leading-relaxed">
                Setiap data integrasi pihak ketiga dienkripsi menggunakan kunci simetris yang diturunkan dari salt unik di level database. File di Knowledge Vault terisolasi per pengguna dan terindeks di memori vektor yang aman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            Jalankan Ghost Relay Sekarang
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
            Solusi koordinasi asinkron Human-to-AI-to-Human terbaik untuk meminimalkan miskomunikasi tim Anda.
          </p>
          <div className="pt-4">
            <Link to="/login" className="px-8 py-3 bg-white hover:bg-slate-200 text-black rounded font-bold transition-all text-xs inline-flex items-center gap-2 shadow-lg shadow-white/5">
              Akses Dasbor [Enter] <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#040508]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 border border-white/10">
              <Ghost className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-400">GHOST_RELAY:~$</span>
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
