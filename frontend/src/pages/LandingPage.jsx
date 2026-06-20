import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) navigate(`/discover?search=${encodeURIComponent(q)}`);
    else navigate('/discover');
  };

  return (
    <div className="bg-white text-on-surface antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-border-light">
        <div className="flex justify-between items-center px-container-padding h-16 max-w-[1280px] mx-auto gap-gap-default">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all">
            <span className="font-headline-md text-headline-md font-bold text-primary">SecureGate</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:flex">
            <form onSubmit={handleSearch} className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                name="search"
                className="w-full bg-[#F5F5F7] border border-border-light rounded-[10px] pl-10 pr-4 py-2 text-body-md focus:border-[#B22110] focus:ring-0 transition-all outline-none"
                placeholder="Cari event..."
                type="text"
              />
            </form>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-primary font-bold border-b-2 border-primary py-5">Explore</Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-tickets" className="text-on-surface-variant hover:text-primary transition-colors py-5">My Tickets</Link>
                <Link to="/wallet" className="text-on-surface-variant hover:text-primary transition-colors py-5">Wallet</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors py-5">My Tickets</Link>
                <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors py-5">Wallet</Link>
              </>
            )}
          </nav>

          {/* CTA */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <Link to="/discover" className="bg-[#B22110] text-white px-[22px] py-[10px] rounded-[22px] font-medium hover:bg-primary-container transition-all active:scale-95">
                Jelajahi
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-[#B22110] text-white px-[22px] py-[10px] rounded-[22px] font-medium hover:bg-primary-container transition-all active:scale-95"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="pt-20 pb-16 space-y-12">

        {/* Section 1: Hero Banner */}
        <section className="max-w-[1280px] mx-auto px-container-padding">
          <div className="relative w-full h-[320px] rounded-banner bg-navy-dark overflow-hidden flex items-center justify-between px-16" style={{ backgroundColor: '#0F1E3D', borderRadius: '24px' }}>
            {/* Text */}
            <div className="space-y-6 max-w-lg z-10 text-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: '"FILL" 1' }}>stars</span>
                <span className="text-caption tracking-widest uppercase opacity-80">Eksklusif di SecureGate</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight">EVENT MINGGU INI</h1>
              <p className="text-white/70 text-body-lg">Temukan pengalaman terbaik dari konser musik hingga festival seni pilihan kurator kami.</p>
              <button
                onClick={() => navigate('/discover')}
                className="bg-white px-8 py-2.5 rounded-button font-bold hover:bg-gray-100 transition-all"
                style={{ color: '#0F1E3D' }}
              >
                Lihat Jadwal
              </button>
            </div>

            <div className="hidden lg:block relative h-full w-[400px]">
              <div className="absolute top-1/2 right-0 -translate-y-1/2 flex gap-4">
                <div className="w-56 h-80 rounded-2xl rotate-12 border border-white/20 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(240,78,55,0.9)' }}>
                  <span className="material-symbols-outlined text-white text-8xl mb-4">qr_code_2</span>
                  <div className="w-full border-t border-dashed border-white/30 my-4"></div>
                  <span className="text-white font-bold tracking-widest">SECURE PASS</span>
                </div>
                <div className="w-56 h-80 rounded-2xl -rotate-6 border border-white/20 flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="material-symbols-outlined text-8xl" style={{ color: 'rgba(255,255,255,0.2)' }}>confirmation_number</span>
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-8 h-1.5 bg-white rounded-full"></div>
              <div className="w-2 h-1.5 bg-white/30 rounded-full"></div>
              <div className="w-2 h-1.5 bg-white/30 rounded-full"></div>
            </div>
          </div>
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
            {[
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwogDwE_KfH1dkfAakghdm3mnxRTQH2Bw96PgS9foxPUOD0EWsNTphUau9Ir-lBNWRU8C5WpWccdDy2h4ts1Cf_ni9Q3tI6tCftglLKzALhfVg3qAO7h9o7zC1K7HaVGSGCKJR_-tdjXD08C9-jwbx6DUI1c1CEXnwmiwZBfONnF7QgyPpjPgkFgu9e-Jj_ykP-w5E3_h76mRkIzD_uMgwbYLgEQ9Bjf7Zh1JqV1UWGVdDjbeOVF8gMg467B17qF7e6BjhdYelyzQ', badge: 'MUSIK', title: 'Java Jazz Festival 2024', date: '24 - 26 Mei 2024', location: 'JIExpo Kemayoran', price: 'Mulai Rp 450rb' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm_wyNAgLNgKuDznlyxzcSLlU_qWLzwO215cAaETyP_dVu_aGRVKWkFwK05-S7qIEwwHkpEFLDrCFqSweFMSsCAWSdyyL8BZm5S-Sy4mkyYyPyRL-ia72XbULbPADCcWdZh5_Xd18EL1Zj4nJGE2S9LFyZakZQRU4m9DP9arDtwDtXFbJOXexRe-W5IwkdSeYc92TqbhivgaP7WcLDIyYK6bKMDETwpthDry3YPbYlnwAoMnStifoEb3tRWJhMMGuE9nfvE4mUO6c', badge: 'EXHIBITION', title: 'IndoTech Future Expo', date: '15 Juni 2024', location: 'ICE BSD City', price: 'Mulai Rp 75rb' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgC_BOreddC_gRmj4tg59-W_DQ9yvJVE22Gf81QzUzqmUF8sFUu6emm35LM6Hg1maUWUIqbqu26HC41k7-dX7Zj_KnEgB0XhZOQZeUJFMUXwjI-jLSwal-fAFHszpF48lDoeB0EL1a3P4Y_Se71D4OVbC1xCJ1Fw09litlAoVKL1aZ0CeUnx4TTtS3kg-nL4bAydYdxn2Gx7mp5Ult3b75kyPiFFji1BNFnpUrcfVHMg_UHxbLp7redAlQF805qgdhAvY9ZKPNW58', badge: 'PARTY', title: 'Echoes of Tomorrow', date: '01 Juni 2024', location: 'SCBD Jakarta', price: 'Mulai Rp 200rb' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfVHNmodW2e04wqWmeWpANV7gs3sXFMg-JRIWS7FCXQqEawXiYeFj1jRcmfYJSHm8pFxVFEIZSihXSoCfaIUX8sKFMWOsrVzTarfKqS6WK0e8qS4u54oFMbiVd5biLVaNtFdUO7NkODnEmU8eqZAPOxIT8kOxbD7cAM0z2fSgGCK5UjNKSL0w4LIGiIqy2hoXKZWs3hH7AhU3UUFFgfh7YnQhc51Wo86lMhFD5ha9_jC5gTq45AnFKn0RZoJiNt_d7YTTzlnmbqvQ', badge: 'WORKSHOP', title: 'UI/UX Design Masterclass', date: '10 Juli 2024', location: 'Kuningan City', price: 'FREE' },
            ].map((ev) => (
              <div key={ev.title} className="min-w-[280px] bg-white rounded-[14px] border-[0.5px] border-border-light overflow-hidden event-card-shadow group cursor-pointer" onClick={() => navigate('/discover')}>
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={ev.img} />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#B22110]">{ev.badge}</span>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-body-md line-clamp-1">{ev.title}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-caption">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant text-caption">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>{ev.location}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#B22110] font-bold">{ev.price}</span>
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
              {[
                { month: 'JUN', day: '20', weekday: 'SAB', badge: 'MUSIK', badgeColor: 'bg-red-50 text-[#B22110]', tag: '• Baru Saja Ditambah', title: 'Summer Sound Festival 2024', location: 'Stadion Utama GBK, Jakarta', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqaD5Sv0cEyS6bBR0gbrH3srFORlfItyKHScBU7ZZhMm_AiKyoD0nd5P8r7Dbu9hfmRJAt6Wtqp-7p4T7vhzR2-dkggjrtyCWTAqZZ3Eki1CzfD6tlntvEKJGM2Bq4B1wNd7G5l-GZaoa0kzxZspdhtoqhzd4Sg7hsr7SErIe3DctJZpS71PtLuY417JkHwoclPZmbAayHH4N5MvQw3ClAYfy4Yu_njkZm1NyzdOtM8fiCplId8Buq476gDG2qdx4CQdMlf2DWhsw' },
                { month: 'JUN', day: '25', weekday: 'SEL', badge: 'TECH', badgeColor: 'bg-blue-50 text-blue-600', tag: '• Trending #1', title: 'World AI Summit Jakarta', location: 'Ritz Carlton Mega Kuningan', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiTU9RA6_KIDfgbQwV9NNWN97YAiqeZkgChfYC6vVVQ0eezZjY8AF4o60PXLNAjem4-_ZbWQkBd8nY9G_D2sJkapC5xjvnF7h8kcFqOnRsDCG33kEFOQei3TvgS3IjOhSVGB6L_FHQkYPLB1LQvAlJLAq6nqloqTsA7K7MuLd5hQj4Bq0usNn6xPmx7pgHA3AmEPr5Cr2_7QI93f0po9Wz5FmwLsLGCuya9eD0K469roSJCc3k3VH4yd9fbVIWzMaGWrUQw1ihgYU' },
                { month: 'JUL', day: '02', weekday: 'MIN', badge: 'SPORTS', badgeColor: 'bg-green-50 text-green-600', tag: '', title: 'Jakarta International Marathon', location: 'Area Monas, Jakarta Pusat', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbYoSuMa9lVAsdtInRQI04UcsRVzfUMWBxaX6vNafmiYv4IgYkkST5AOOfF9IJO7NpWguUmoYoBBCckd1ha65I7laQwzGzAKWTB3-pArhVeR99SBrwt-hTuloUX6bgY3xE2JeEX2oG2QKc2yb31fsLpb52xFyzenDOiOmLPnLRS5dFyTEHmy4oh7P11-oP9md0UhaUGjJLJRcG5ehDYiB_eAIAxe4HNXZTHugRsYpScAXzYWr7i7nOLjuaKp39Ys0CbQyn6iF3Zxc' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-6 p-4 rounded-xl border-[0.5px] border-border-light card-hover group cursor-pointer transition-all" onClick={() => navigate('/discover')}>
                  <div className="w-16 flex flex-col items-center border-r border-border-light pr-6 shrink-0">
                    <span className="text-caption font-bold text-on-surface-variant">{item.month}</span>
                    <span className="text-2xl font-bold text-[#B22110]">{item.day}</span>
                    <span className="text-caption text-on-surface-variant">{item.weekday}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${item.badgeColor}`}>{item.badge}</span>
                      {item.tag && <span className="text-[10px] text-on-surface-variant">{item.tag}</span>}
                    </div>
                    <h3 className="font-bold text-body-md truncate">{item.title}</h3>
                    <p className="text-caption text-on-surface-variant flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-sm">location_on</span> {item.location}
                    </p>
                  </div>
                  <div className="w-40 aspect-[16/9] rounded-lg overflow-hidden flex-shrink-0">
                    <img alt={item.title} className="w-full h-full object-cover" src={item.img} />
                  </div>
                </div>
              ))}
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
            {[
              { icon: 'music_note', label: 'Musik' },
              { icon: 'palette', label: 'Pameran' },
              { icon: 'attractions', label: 'Wahana' },
              { icon: 'sports_soccer', label: 'Olahraga' },
              { icon: 'architecture', label: 'Workshop' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center justify-center p-6 border-[0.5px] border-border-light rounded-xl card-hover cursor-pointer space-y-3" onClick={() => navigate('/discover')}>
                <span className="material-symbols-outlined text-[#B22110] text-3xl">{icon}</span>
                <span className="text-caption font-bold">{label}</span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center p-6 border border-[#B22110] rounded-xl bg-white cursor-pointer space-y-3" onClick={() => navigate('/discover')}>
              <span className="material-symbols-outlined text-[#B22110] text-3xl">grid_view</span>
              <span className="text-caption font-bold text-[#B22110]">Semua Kategori</span>
            </div>
          </div>
        </section>

        {/* Section 5: Event Terdekat */}
        <section className="space-y-6">
          <div className="max-w-[1280px] mx-auto px-container-padding flex items-center gap-4">
            <h2 className="text-headline-md">Event Terdekat</h2>
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full border border-border-light cursor-pointer">
              <span className="text-[12px]">📍</span>
              <span className="text-caption font-bold">Makassar</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto hide-scrollbar px-[calc((100vw-1280px)/2+1.5rem)] pb-4">
            {[
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdBdOkSGZLD1jCcVTryAatjulS3GTlE-Jytc1gFBR7EYufORn2DlzlKZFZKcc8ICrcqViTgNldTEVtoAPdsSN4bbwNAdnl_8Y0osKzYV0Go55ufiJos04BqBq1QYk8zM1EcH7Kmt8FAS2NlZDDb8M0TYvbUHgg1f5kJUDdf-Evlm42Qij8QhArmfxTlJ6tvzuihqGQnV9nIEzRbi6cLx-T_A89GlodcyGABs4OImUA86D1av2WRWyccWbLrVeJDTt3X8cfuc5wQR0', title: 'Makassar Food Festival', sub: 'Losari, 22-23 Juni' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdgQDghL6u4x-QYYUidy5vjQ3RJiTXRtHuNcq9BoKTLeifzN4qBATalY8anFTk3np9PvdPnH6MSfTQXMWWQpKkdOw_oQoC6p4MzNSCGSM-fzrMEhWEAV-FJWBrLlrTdHHKUYYCJqT_UANBU1GpzwL-tGgYJoxjLkUvdnUq3S3uWI5fgd_H14_NHxUKTw2accdvZlDOwQcXZw6yubW2jUUCeRo76gZMeBmM-vyBruvXLFx7Pw6Zwz9Bu0u7-PtdLD1zA3pKBollNkQ', title: 'Sultan Hasanuddin Run', sub: 'Karebosi, 30 Juni' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIcUXiNfqL4uGP2PwIp4xn806-M8Kj4_-Sb0YBBMNaO6DWLKRl4US1hvolFG-rolRi99vZQ77dhVQ5vTyV7gF4tEcBf9IQeVWfCacBbq4IR71LT33Zkrv6jy1ZFdhvYGBlXmFeXww3GXT0OySqJdu_eUzjroOaqS1VXzaKzz2cIa2g_zzApDw4zygqnP_FFngJsQSja0hrWER4bvLRypwqg8QvrKnLJG9xr4lnYlXFT47qQhdUVvGl-5n3vtyPqtf_Nm5Mc1mjf-0', title: 'Phinisi Digital Art Show', sub: 'CCC, 05-07 Juli' },
              { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyjCTxlmF8vZnlP8AngJIrcap9E1AVUmPJXwSpG_lQbMUojzipNHPgjYlxRnmh50kkBBIzlnf7gnE4OZi5ltS0QuaVDW-CdZdaR-gMY-t-ZymEqNvyDnrlAP4CccBQRycmR5Fyg0DsP93dBBoUjUudTA05xBZKyzzXMiBnzoEx2S_EJ7Y9IxsR_VWVMkhuooGERnXXMowdrC0QVwmB4VkHgicL-miGPsn7EmAJTf3m305c1w-GWIh34JDUbALIQfgzx2VNO5x5mGI', title: 'Local Band Night', sub: 'Phinisi Point, Tiap Sabtu' },
            ].map((item) => (
              <div key={item.title} className="min-w-[240px] space-y-3 group cursor-pointer" onClick={() => navigate('/discover')}>
                <div className="rounded-xl overflow-hidden border border-border-light aspect-[16/9]">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" src={item.img} alt={item.title} />
                </div>
                <div>
                  <h4 className="font-bold text-body-md">{item.title}</h4>
                  <p className="text-caption text-on-surface-variant">{item.sub}</p>
                </div>
              </div>
            ))}
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
