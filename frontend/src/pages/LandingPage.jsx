import { Link } from 'react-router-dom';
import { Fingerprint, Laptop, Ban, Zap, Wallet, CheckCircle2, User, Briefcase, QrCode } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-secondary font-sans relative overflow-x-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-coral-400/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-coral-500/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="glass sticky top-4 mx-4 md:mx-auto max-w-6xl z-50 px-6 py-4 flex items-center justify-between rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">Gate<span className="text-coral-500">Mate</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 font-medium text-secondary hover:text-coral-600 transition-colors">
            <User className="w-4 h-4" /> Masuk
          </Link>
          <Link to="/partner-login" className="flex items-center gap-2 px-5 py-2 font-medium bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all shadow-md">
            <Briefcase className="w-4 h-4" /> Partner Login
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 md:py-32 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full glass border border-coral-200 text-coral-600 font-medium text-sm mb-6">
            Era Baru Manajemen Acara
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
            Tiket Bukan Sekadar Akses.<br/>
            <span className="text-gradient">Ini Identitas Anda.</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary/70 mb-10 max-w-2xl leading-relaxed">
            Menggabungkan profil personal dan QR Code dinamis. Mustahil dipalsukan, bebas calo. 
            Satu ekosistem canggih untuk Penyelenggara Acara dan Penikmat Hiburan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="px-8 py-4 font-semibold text-lg bg-primary text-white rounded-2xl shadow-lg shadow-coral-500/30 hover:bg-coral-600 hover:-translate-y-1 transition-all">
              Cari Event (User)
            </Link>
            <Link to="/partner-register" className="px-8 py-4 font-semibold text-lg glass text-secondary rounded-2xl hover:bg-white/80 hover:-translate-y-1 transition-all border border-secondary/10">
              Buat Event (Partner)
            </Link>
          </div>
        </section>

        {/* Feature Split 1 */}
        <section className="py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-coral-100 text-coral-600 flex items-center justify-center">
              <Fingerprint className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">Satu Tiket.<br/>Satu Identitas.</h2>
            <p className="text-lg text-secondary/70">
              Ucapkan selamat tinggal pada pemalsuan tiket. Di GateMate, tiket terikat langsung dengan foto profil dan email Anda. Saat di-scan, wajah Anda adalah bukti kepemilikan sah.
            </p>
            <ul className="space-y-3 pt-2">
              {['Kode QR Unik', 'Verifikasi visual otomatis bagi petugas', 'Check-in instan tanpa perlu cetak tiket fisik'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-secondary/80 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-coral-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex justify-center">
            {/* Mockup Ticket */}
            <div className="glass w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl shadow-coral-500/10 border border-white/50 relative transform hover:-translate-y-2 transition-transform duration-500">
              <div className="bg-gradient-to-br from-coral-500 to-coral-600 p-6 text-white">
                <div className="text-sm font-medium opacity-80 mb-1">Konser Musik 2026</div>
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider">VIP TICKET</div>
              </div>
              <div className="p-8 flex flex-col items-center bg-white/60">
                <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
                  <User className="w-10 h-10 text-secondary/40" />
                </div>
                <h3 className="text-xl font-bold text-secondary text-center">Ahmad Mubasysyir</h3>
                <p className="text-secondary/60 text-sm text-center mb-6">mubasysyirahmd@gmail.com</p>
                <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-sm border border-secondary/10 flex items-center justify-center">
                  <QrCode className="w-full h-full text-secondary" />
                </div>
              </div>
              <div className="bg-surface/50 border-t border-white/40 p-4 text-center text-sm font-medium text-secondary/60 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Aman & Terenkripsi
              </div>
            </div>
          </div>
        </section>

        {/* Feature Split 2 */}
        <section className="py-20 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative flex justify-center order-2 md:order-1">
            {/* Mockup Admin */}
            <div className="glass-dark w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative transform hover:-translate-y-2 transition-transform duration-500">
              <div className="p-4 border-b border-white/10 flex items-center gap-2 text-sm font-medium text-white/80">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Kamera Scanner Aktif
              </div>
              <div className="h-48 bg-black/40 relative flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-coral-500/50 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-coral-500 animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              </div>
              <div className="p-6 bg-green-500/10 border-t border-green-500/20 flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-lg">Ahmad Mubasysyir - VIP</h4>
                  <p className="text-green-400 font-medium text-sm">Valid & Approved</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Laptop className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">Kontrol Penuh<br/>di Tangan Kreator.</h2>
            <p className="text-lg text-secondary/70">
              Sebagai Event Creator, Anda memiliki akses ke Dashboard super canggih. Atur jadwal, jenis tiket, kapasitas, hingga formulir kustom. Pantau pendapatan dan check-in secara real-time.
            </p>
            <ul className="space-y-3 pt-2">
              {['Buat halaman Event dengan dukungan 3D/Video', 'Sistem approval manual untuk acara eksklusif', 'Payout pendapatan yang transparan'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-secondary/80 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-24">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center mb-6">
                <Ban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anti-Calo System</h3>
              <p className="text-secondary/70 leading-relaxed">Karena tiket adalah identitas wajah, calo tidak bisa memborong dan menjual kembali tiket secara bebas di luar platform.</p>
            </div>
            <div className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Check-in</h3>
              <p className="text-secondary/70 leading-relaxed">Cukup pindai kode QR dalam hitungan detik. Aplikasi Scanner mendeteksi tiket valid secara instan tanpa internet lemot.</p>
            </div>
            <div className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-coral-100 text-coral-600 flex items-center justify-center mb-6">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Payout</h3>
              <p className="text-secondary/70 leading-relaxed">Dana penjualan tiket masuk ke sistem dengan aman, dan dapat ditarik langsung oleh Kreator setelah acara selesai.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary/10 bg-surface/50 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Gate<span className="text-coral-500">Mate</span></h2>
            <p className="text-secondary/60 mt-1">The Future of Event Management.</p>
          </div>
          <div className="flex gap-6 text-sm font-medium text-secondary/60">
            <a href="#" className="hover:text-coral-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-coral-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-coral-500 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Dummy component for ShieldCheck since it's used inside the mockup
function ShieldCheck(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
