import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';
import BannerSlider from '../../components/BannerSlider';
import Navbar from '../../components/Navbar';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [terdekatCity, setTerdekatCity] = useState('Makassar');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topCategories = [
    { id: 'Technology', label: 'Teknologi', icon: 'computer' },
    { id: 'Music', label: 'Musik', icon: 'music_note' },
    { id: 'Sports', label: 'Olahraga', icon: 'sports_soccer' },
    { id: 'Education', label: 'Pendidikan', icon: 'school' },
    { id: 'Business', label: 'Bisnis', icon: 'work' }
  ];

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          const available = ['Jakarta', 'Bandung', 'Yogyakarta', 'Bali', 'Surabaya', 'Makassar', 'Medan', 'Semarang'];
          if (available.includes(data.city)) {
            setTerdekatCity(data.city);
          } else {
            setTerdekatCity('Jakarta');
          }
        }
      })
      .catch(() => setTerdekatCity('Jakarta'));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return { month: '', day: '', weekday: '' };
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
      day: d.toLocaleDateString('id-ID', { day: '2-digit' }),
      weekday: d.toLocaleDateString('id-ID', { weekday: 'short' }).substring(0,3).toUpperCase()
    };
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'FREE';
    return 'Rp ' + Number(price).toLocaleString('id-ID');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) navigate(`/discover?search=${encodeURIComponent(q)}`);
    else navigate('/discover');
  };

  return (
    <div className="bg-white text-on-surface antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* 🚀 NAVBAR */}
      <Navbar />

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="pt-20 pb-16 space-y-12">

        {/* Section 1: Hero Banner */}
        <section className="w-full overflow-hidden max-w-[1280px] mx-auto px-container-padding">
          <BannerSlider />
        </section>

        {/* Section 2: Rekomendasi Event */}
        <section className="space-y-6">
          <div className="max-w-[1280px] mx-auto px-container-padding flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-headline-md">Rekomendasi Untukmu</h2>
              <p className="text-on-surface-variant text-body-md">Event pilihan yang mungkin kamu sukai</p>
            </div>
            <Link to="/discover" className="text-[#B22110] font-medium flex items-center gap-1 hover:underline">
              Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar px-[calc((100vw-1280px)/2+1.5rem)] pb-4">
            {loading ? (
              <div className="flex gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="min-w-[280px] h-[300px] bg-white rounded-[14px] border-[0.5px] border-border-light animate-pulse" />
                ))}
              </div>
            ) : events.slice(0, 4).map((ev) => (
              <div key={ev.id || ev.id_event} className="min-w-[280px] max-w-[280px] bg-white rounded-[14px] border-[0.5px] border-border-light overflow-hidden event-card-shadow group cursor-pointer flex flex-col shrink-0" onClick={() => navigate(isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login')}>
                <div className="relative overflow-hidden aspect-[2048/768]">
                  <img alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#B22110]">{ev.category?.name || 'EVENT'}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-body-md line-clamp-1 mb-2">{ev.title}</h3>
                  <div className="space-y-1 mt-auto">
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-caption">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{formatDate(ev.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-caption">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="truncate">{ev.location_type === 'online' ? 'Online Event' : `${ev.city || ''}${ev.city ? ', ' : ''}${ev.location_details || ''}`}</span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border-light flex justify-between items-center">
                    <span className="text-[#B22110] font-bold">{formatPrice(ev.ticket_tiers ? Math.min(...ev.ticket_tiers.map(t => Number(t.price))) : 0)}</span>
                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Event Pilihan + Sidebar */}
        <section className="max-w-[1280px] mx-auto px-container-padding grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#B22110] text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_today</span>
                <h2 className="text-headline-md">Event Pilihan</h2>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-caption font-bold bg-white rounded-md shadow-sm">Populer</button>
                <button className="px-4 py-1.5 text-caption font-medium text-on-surface-variant">Minggu Ini</button>
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-xl border border-border-light animate-pulse" />
                ))
              ) : events.slice(0, 3).map((item) => {
                const dateInfo = formatShortDate(item.start_date);
                return (
                  <div key={item.id || item.id_event} className="flex items-center gap-6 p-4 rounded-xl border-[0.5px] border-border-light card-hover group cursor-pointer transition-all" onClick={() => navigate(isAuthenticated ? `/events/${item.id || item.id_event}` : '/login')}>
                    <div className="w-16 flex flex-col items-center border-r border-border-light pr-6 shrink-0">
                      <span className="text-caption font-bold text-on-surface-variant">{dateInfo.month}</span>
                      <span className="text-2xl font-bold text-[#B22110]">{dateInfo.day}</span>
                      <span className="text-caption text-on-surface-variant">{dateInfo.weekday}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-50 text-[#B22110]">{item.category?.name || 'EVENT'}</span>
                      </div>
                      <h3 className="font-bold text-body-md truncate">{item.title}</h3>
                      <p className="text-caption text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm">location_on</span> {item.location_type === 'online' ? 'Online Event' : `${item.city || ''}${item.city ? ', ' : ''}${item.location_details || ''}`}
                      </p>
                    </div>
                      <div className="w-40 aspect-[2048/768] rounded-lg overflow-hidden flex-shrink-0">
                        <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} />
                      </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => navigate('/discover')} className="w-full py-3 border border-border-light rounded-xl text-body-md font-medium text-on-surface-variant hover:bg-gray-50 transition-colors">
              Muat Lebih Banyak
            </button>
          </div>

          {/* Sidebar Promo */}
          <div className="space-y-8">
            <div className="w-full rounded-[14px] overflow-hidden border-[0.5px] border-border-light shadow-sm h-[600px]">
              <img
                alt="GateAI Matchmaking Poster"
                className="w-full h-full object-cover"
                src="public/gateai.png"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Kategori Event */}
        <section className="max-w-[1280px] mx-auto px-container-padding space-y-6">
          <h2 className="text-headline-md">Telusuri Kategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCategories.map(({ id, icon, label }) => (
              <div key={label} className="flex flex-col items-center justify-center p-6 border-[0.5px] border-border-light rounded-xl bg-white card-hover cursor-pointer space-y-3 transition-colors hover:border-[#B22110]/50" onClick={() => navigate('/discover?category=' + id)}>
                <span className="material-symbols-outlined text-[#B22110] text-3xl">{icon}</span>
                <span className="text-caption font-bold text-on-surface">{label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center p-6 border-[0.5px] border-border-light rounded-xl bg-white cursor-pointer space-y-3 transition-colors hover:border-[#B22110]/50" onClick={() => navigate('/discover')}>
              <span className="material-symbols-outlined text-[#B22110] text-3xl">grid_view</span>
              <span className="text-caption font-bold text-on-surface">Semua Kategori</span>
            </div>
          </div>
        </section>

        {/* Section 5: Event Terdekat */}
        <section className="space-y-6">
          <div className="max-w-[1280px] mx-auto px-container-padding flex items-center gap-4">
            <h2 className="text-headline-md">Event Terdekat</h2>
            <div className="relative">
              <div onClick={() => setShowCityDropdown(!showCityDropdown)} className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full border border-border-light cursor-pointer transition-colors">
                <span className="text-[12px]">📍</span>
                <span className="text-caption font-bold">{terdekatCity}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-border-light rounded-xl shadow-lg z-50 py-2 overflow-hidden">
                  {['Jakarta', 'Bandung', 'Yogyakarta', 'Bali', 'Surabaya', 'Makassar', 'Medan', 'Semarang'].map(c => (
                    <div key={c} onClick={() => { setTerdekatCity(c); setShowCityDropdown(false); }} className={`px-4 py-2 text-caption cursor-pointer hover:bg-gray-50 ${terdekatCity === c ? 'font-bold text-[#B22110] bg-[#B22110]/5' : 'text-on-surface'}`}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar px-[calc((100vw-1280px)/2+1.5rem)] pb-4">
            {events.filter(e => e.city === terdekatCity).length > 0 ? (
              events.filter(e => e.city === terdekatCity).map((ev) => (
                <div key={ev.id || ev.id_event} className="min-w-[280px] max-w-[280px] space-y-3 group cursor-pointer shrink-0" onClick={() => navigate(isAuthenticated ? `/events/${ev.id || ev.id_event}` : '/login')}>
                  <div className="rounded-xl overflow-hidden border border-border-light aspect-[2048/768]">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" src={ev.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400'} alt={ev.title} />
                  </div>
                  <div>
                    <h4 className="font-bold text-body-md truncate">{ev.title}</h4>
                    <p className="text-caption text-on-surface-variant truncate">{ev.location_details || ev.city || 'TBA'}, {formatShortDate(ev.start_date).day} {formatShortDate(ev.start_date).month}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 px-4 w-full text-center text-secondary border border-dashed border-border-light rounded-xl">
                Belum ada event terdekat di {terdekatCity}.
              </div>
            )}
          </div>
        </section>

        {/* Section 6: Kota Populer */}
        <section className="max-w-[1280px] mx-auto px-container-padding space-y-6">
          <h2 className="text-headline-md">Eksplor Kota Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Jakarta',    count: '120+', img: '/icon_jakarta_monas.png',          alt: 'Jakarta Monas' },
              { name: 'Bandung',    count: '85+',  img: '/icon_bandung_gedung_sate.png',     alt: 'Bandung Gedung Sate' },
              { name: 'Yogyakarta', count: '64+',  img: '/icon_yogyakarta_tugu.png',         alt: 'Tugu Yogyakarta' },
              { name: 'Bali',       count: '92+',  img: '/icon_bali_temple.png',             alt: 'Bali Temple' },
              { name: 'Surabaya',   count: '78+',  img: '/icon_surabaya_sura_baya.png',      alt: 'Surabaya' },
              { name: 'Makassar',   count: '45+',  img: '/icon_makassar_phinisi.png',        alt: 'Makassar Phinisi' },
              { name: 'Medan',      count: '38+',  img: '/icon_medan_istana_maimun.png',     alt: 'Medan Istana Maimun' },
              { name: 'Semarang',   count: '52+',  img: '/icon_semarang_lawang_sewu.png',    alt: 'Semarang Lawang Sewu' },
            ].map(({ name, count, img, alt }) => (
              <div key={name} className="bg-white rounded-[14px] border-[0.5px] border-outline-variant p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform h-40" onClick={() => navigate('/city/' + name)}>
                <div className="w-16 h-16 flex items-center justify-center">
                  <img alt={alt} className="w-full h-full object-contain" src={img} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#B22110] text-body-md">{name}</p>
                  <p className="text-caption text-secondary">{count} Event</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Organizer CTA */}
        <section className="bg-surface-container-low/30 py-20 border-y border-border-light">
          <div className="max-w-[1280px] mx-auto px-container-padding">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-on-surface mb-4 leading-tight">Kelola Event dengan Lebih Aman &amp; Transparan</h2>
                <p className="text-body-lg text-secondary">Bergabunglah sebagai mitra penyelenggara SecureGate dan nikmati kemudahan manajemen tiket dengan sistem keamanan berlapis.</p>
              </div>
              <button
                onClick={() => navigate('/organizer-register')}
                className="px-8 py-3 border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all rounded-[22px] whitespace-nowrap"
              >
                Daftar Jadi Penyelenggara
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-gap-default">
              {[
                { icon: 'analytics', title: 'Real-time Analytics', desc: 'Pantau penjualan tiket dan data kehadiran peserta secara instan melalui dashboard yang intuitif.' },
                { icon: 'verified_user', title: 'Sistem Anti-Fraud', desc: 'Teknologi verifikasi wajah dan QR code unik memastikan tidak ada tiket palsu di event Anda.' },
                { icon: 'payments', title: 'Pencairan Dana Cepat', desc: 'Proses penyelesaian pembayaran yang transparan dan terjadwal langsung ke akun perusahaan Anda.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-8 bg-white rounded-2xl shadow-sm border border-border-light hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-coral-red mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <h3 className="text-headline-sm mb-3">{title}</h3>
                  <p className="text-body-md text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section className="max-w-[1280px] mx-auto px-container-padding">
          <div className="bg-primary-container/20 rounded-3xl p-12 flex flex-col items-center text-center gap-6 border border-primary/10">
            <h2 className="text-headline-lg text-primary">Siap untuk Pengalaman Baru?</h2>
            <p className="text-body-lg text-on-surface-variant max-w-xl">
              Gabung dengan ribuan pengguna lainnya yang telah mempercayakan SecureGate untuk urusan tiket mereka. Cepat, Aman, dan Tanpa Ribet.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? '/discover' : '/register')}
              className="bg-primary text-white px-8 py-3 rounded-[22px] font-bold hover:bg-primary-container transition-all"
            >
              Mulai Sekarang
            </button>
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="w-full py-16 bg-[#F9F9F9] border-t border-border-light">
        <div className="max-w-[1280px] mx-auto px-container-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <span className="font-bold text-headline-sm text-secondary">SecureGate</span>
              <p className="text-on-surface-variant text-body-md leading-relaxed">Platform terpercaya untuk pembelian tiket digital dengan keamanan berlapis dan transparansi total.</p>
              <div className="flex gap-4">
                {['public', 'share', 'mail'].map((icon) => (
                  <a key={icon} href="#" className="w-10 h-10 rounded-full bg-white border border-border-light flex items-center justify-center text-on-surface-variant hover:text-coral-red transition-all">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-on-surface">Tentang Kami</h4>
              <ul className="space-y-3 text-on-surface-variant text-body-md">
                {['Profil Perusahaan', 'Karir', 'Blog', 'Terms of Service'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-coral-red transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-on-surface">Informasi</h4>
              <ul className="space-y-3 text-on-surface-variant text-body-md">
                {['Pusat Bantuan', 'Panduan Keamanan', 'Privacy Policy', 'FAQ'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-coral-red transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-on-surface">Kategori Event</h4>
              <ul className="space-y-3 text-on-surface-variant text-body-md">
                {['Konser Musik', 'Olahraga & Fitness', 'Pameran Seni', 'Workshop & Seminar'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-coral-red transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-caption text-on-surface-variant">© 2024 SecureGate. Utilitarian Clarity. All rights reserved.</p>
            <div className="flex gap-8 text-caption font-medium text-on-surface-variant">
              {['Instagram', 'X / Twitter', 'TikTok'].map((s) => (
                <a key={s} href="#" className="hover:text-on-surface transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── BOTTOM NAV (mobile) ──────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-border-light flex justify-around items-center px-2 py-3">
        <Link to="/" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>home</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/discover" className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-medium">Discover</span>
        </Link>
        <Link to={isAuthenticated ? '/my-tickets' : '/login'} className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="text-[10px] font-medium">Tickets</span>
        </Link>
        <Link to={isAuthenticated ? '/wallet' : '/login'} className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[10px] font-medium">Wallet</span>
        </Link>
        <Link to={isAuthenticated ? '/profile' : '/login'} className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
