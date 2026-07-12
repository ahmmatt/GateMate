import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowRight,
  BarChart2, ShieldCheck, CreditCard,
  Music, Trophy, Sparkles, BookOpen, Image, Wrench,
  MapPin, Calendar, Ticket,
  Home as HomeIcon, Compass, Wallet, User,
} from 'lucide-react'

/* ── Data ──────────────────────────────────────────── */
const features = [
  {
    icon: BarChart2,
    title: 'Real-time analytics',
    desc: 'Pantau penjualan tiket dan data kehadiran peserta secara instan melalui dashboard yang intuitif.',
  },
  {
    icon: ShieldCheck,
    title: 'Sistem anti-fraud',
    desc: 'Teknologi verifikasi wajah dan QR code unik memastikan tidak ada tiket palsu di event Anda.',
  },
  {
    icon: CreditCard,
    title: 'Pencairan dana cepat',
    desc: 'Proses penyelesaian pembayaran yang transparan dan terjadwal langsung ke akun perusahaan Anda.',
  },
]

const categories = [
  { icon: Music,    label: 'Konser' },
  { icon: Trophy,   label: 'Sport' },
  { icon: Sparkles, label: 'Festival' },
  { icon: BookOpen, label: 'Seminar' },
  { icon: Image,    label: 'Pameran' },
  { icon: Wrench,   label: 'Workshop' },
]

const formatPrice = (price) =>
  price === 0
    ? 'Gratis'
    : `Rp ${price.toLocaleString('id-ID')}`

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const sisa = (event) => event.maxAttendees - event.soldTickets

/* ── Component ─────────────────────────────────────── */
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  // TODO: Ganti dengan fetch dari API → eventService.getAll({ category: selectedCategory })
  // useEffect(() => { eventService.getAll().then(res => setEvents(res.data.data)) }, [selectedCategory])
  const trendingEvents = []

  return (
    <div className="bg-[#fff8f6] text-[#271815]">

      

      {/* ════════════════════════════════════════════
          SECTION 2 — Hero Split Layout
      ════════════════════════════════════════════ */}
      <section className="relative px-6 py-16 md:py-24 max-w-[1280px] mx-auto overflow-hidden transition-all duration-700">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left — Text */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
            <h1 className="text-[24px] md:text-[32px] font-bold leading-tight text-[#271815] max-w-md">
              Temukan event terbaikmu
            </h1>
            <p className="text-[15px] text-[#5f5e5e] leading-relaxed max-w-lg">
              Platform tiket digital paling aman dan transparan untuk konser, festival, dan seminar eksklusif. Dapatkan akses instan ke pengalaman tak terlupakan.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to="/events"
                className="rounded-full px-[22px] py-[10px] bg-[#b22110] text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
              >
                Jelajahi event
              </Link>
              <Link
                to="/register"
                className="rounded-full px-[22px] py-[10px] text-sm font-medium text-[#b22110] hover:bg-[#fff0ee] active:scale-95 transition-all"
                style={{ border: '1px solid #b22110' }}
              >
                Daftar gratis
              </Link>
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="w-full md:w-1/2 relative">
            <div
              className="aspect-[4/3] rounded-xl overflow-hidden"
              style={{ border: '0.5px solid #EBEBEB', boxShadow: '0 20px 60px rgba(178,33,16,0.12)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80"
                alt="Event konser besar dengan panggung megah dan lampu sorot"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-6 -left-6 bg-[#ffe2dd] p-4 rounded-xl hidden md:block"
              style={{ border: '0.5px solid rgba(227,190,184,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#b22110] flex items-center justify-center text-white flex-shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#b22110]">Tiket terjamin</p>
                  <p className="text-[10px] text-[#5f5e5e]">Keamanan gate 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — Trending Sekarang (Dipindah ke atas)
      ════════════════════════════════════════════ */}
      <section className="py-16 overflow-hidden transition-all duration-700">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-[#271815]">
              Trending sekarang {selectedCategory && `- ${selectedCategory}`}
            </h2>
            <Link
              to="/events"
              className="text-xs font-medium text-[#b22110] hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {/* Horizontal scroll cards */}
          <div
            className="flex gap-5 overflow-x-auto pb-8 -mx-6 px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingEvents.length > 0 ? (
              trendingEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
                  style={{ border: '0.5px solid #EBEBEB' }}
                >
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute top-3 right-3 px-2 py-1 rounded-[10px]"
                      style={{ background: 'rgba(255,248,246,0.9)', backdropFilter: 'blur(4px)' }}
                    >
                      <span className="text-[11px] font-bold text-[#b22110]">Trending</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-[#271815] line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-1 text-[#5f5e5e]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.city}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#5f5e5e]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div
                      className="mt-2 pt-2 flex justify-between items-center"
                      style={{ borderTop: '0.5px solid rgba(227,190,184,0.3)' }}
                    >
                      <span className="text-base font-semibold text-[#b22110]">
                        {formatPrice(event.price)}
                      </span>
                      <span
                        className="px-2 py-1 rounded-[10px] text-[11px] font-medium text-[#b22110]"
                        style={{ background: '#fff0ee' }}
                      >
                        Sisa {sisa(event)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-sm text-[#5f5e5e] px-2 py-4">Belum ada event trending untuk kategori ini.</div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — Kategori (Dipindah ke bawah)
      ════════════════════════════════════════════ */}
      <section className="bg-white py-16 transition-all duration-700">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl font-semibold text-[#271815]">Kategori</h2>
              <p className="text-sm text-[#5f5e5e] mt-1">Cari berdasarkan minat dan hobi Anda</p>
            </div>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-medium text-[#b22110] hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map(({ icon: Icon, label }) => {
              const isSelected = selectedCategory === label
              return (
                <button
                  key={label}
                  onClick={() => setSelectedCategory(isSelected ? null : label)}
                  className={`group flex flex-col items-center gap-3 p-6 rounded-[14px] transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#fff0ee] border-[#b22110]' 
                      : 'bg-white border-[#EBEBEB] hover:border-[#b22110]'
                  }`}
                  style={{ border: `0.5px solid ${isSelected ? '#b22110' : '#EBEBEB'}` }}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform ${
                    isSelected 
                      ? 'bg-[#b22110] text-white' 
                      : 'bg-[#fff0ee] text-[#b22110] group-hover:scale-110'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-[#b22110]' : 'text-[#271815]'}`}>{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5 — Organizer CTA (ulang, persis referensi)
      ════════════════════════════════════════════ */}
      <section
        className="py-20 transition-all duration-700"
        style={{ background: 'rgba(255,240,238,0.3)', borderTop: '0.5px solid rgba(227,190,184,0.2)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[32px] font-bold leading-tight tracking-tight text-[#271815] mb-4">
                Kelola event dengan lebih aman &amp; transparan
              </h2>
              <p className="text-[15px] text-[#5f5e5e] leading-relaxed">
                Bergabunglah sebagai mitra penyelenggara GateMate dan nikmati kemudahan manajemen tiket dengan sistem keamanan berlapis.
              </p>
            </div>
            <Link
              to="/register"
              className="flex-shrink-0 rounded-full px-8 py-3 text-sm font-medium text-[#b22110] hover:bg-[#b22110] hover:text-white transition-all duration-200"
              style={{ border: '2px solid #b22110' }}
            >
              Daftar jadi penyelenggara
            </Link>
          </div>

          {/* Feature Cards Duplicate */}
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title + '-2'}
                className="p-8 bg-white rounded-2xl group hover:border-[#b22110]/50 transition-colors cursor-default"
                style={{ border: '0.5px solid rgba(227,190,184,0.2)' }}
              >
                <div className="w-12 h-12 bg-[#ffdad4]/20 rounded-xl flex items-center justify-center text-[#b22110] mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#271815] mb-3">{f.title}</h3>
                <p className="text-sm text-[#5f5e5e] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 6 — Final CTA "Siap untuk Pengalaman Baru?"
      ════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 transition-all duration-700">
        <div
          className="rounded-3xl p-12 flex flex-col items-center text-center gap-6"
          style={{ background: 'rgba(255,218,212,0.2)', border: '1px solid rgba(178,33,16,0.1)' }}
        >
          <h2 className="text-[32px] font-bold leading-tight tracking-tight text-[#b22110]">
            Siap untuk pengalaman baru?
          </h2>
          <p className="text-[15px] text-[#5b403c] leading-relaxed max-w-xl">
            Gabung dengan ribuan pengguna lainnya yang telah mempercayakan GateMate untuk urusan tiket mereka. Cepat, aman, dan tanpa ribet.
          </p>
          <div className="flex gap-4">
            <Link
              to="/register"
              className="rounded-full px-8 py-3 bg-[#b22110] text-white text-sm font-medium hover:opacity-90 transition-all"
            >
              Mulai sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          BOTTOM NAV — Mobile Only
      ════════════════════════════════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 rounded-t-xl"
        style={{
          background: 'rgba(255,248,246,0.85)',
          backdropFilter: 'blur(12px)',
          borderTop: '0.5px solid rgba(227,190,184,0.3)',
        }}
      >
        {[
          { icon: HomeIcon,  label: 'Home',      to: '/',           active: true  },
          { icon: Compass, label: 'Discover',    to: '/events',     active: false },
          { icon: Ticket,  label: 'My tickets',  to: '/user/tickets', active: false },
          { icon: Wallet,  label: 'Wallet',      to: '/user/wallet', active: false },
          { icon: User,    label: 'Profile',     to: '/login',      active: false },
        ].map(({ icon: Icon, label, to, active }) => (
          <Link
            key={label}
            to={to}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-colors ${
              active
                ? 'text-[#b22110] bg-[#ffdad4]/20'
                : 'text-[#5f5e5e]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-0.5">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom nav spacer on mobile */}
      <div className="md:hidden h-20" />
    </div>
  )
}