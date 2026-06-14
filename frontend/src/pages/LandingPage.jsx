import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Scroll-reveal animation (replaces the vanilla JS IntersectionObserver)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[data-reveal]');
    sections.forEach((section) => {
      section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50">
        <div className="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-gap-default">
            <span className="font-headline-md text-headline-md font-bold text-primary">SecureGate</span>
            <div className="hidden md:flex gap-6 ml-8">
              <a className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1" href="#">Explore</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="coral-pill px-6 py-2 bg-primary text-on-primary font-body-md text-body-md hover:bg-primary-container active:scale-95 transition-all duration-200"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section data-reveal className="relative px-container-padding py-16 md:py-24 max-w-[1280px] mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background max-w-md">
                Temukan event terbaikmu
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-lg">
                Platform tiket digital paling aman dan transparan untuk konser, festival, dan seminar eksklusif. Dapatkan akses instan ke pengalaman tak terlupakan.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <button className="coral-pill px-[22px] py-[10px] bg-primary text-on-primary font-body-md text-body-md hover:opacity-90 active:scale-95 transition-all">
                  Jelajahi Event
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="coral-pill px-[22px] py-[10px] border border-primary text-primary font-body-md text-body-md hover:bg-surface-container-low active:scale-95 transition-all"
                >
                  Daftar Gratis
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl card-shadow">
                <img
                  alt="Featured Event"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjKeZM_B8HohGvQEC3d1OUmzJKmSPx-nIzmeLNZRf3D_-AtDD9xsKiJDMaU6MQLVatj1b1fhG6xgZ6GXJOpP1bWHQfxTlDeAUeeNDV5gwoMCT-SGBDJ39KZKiKKkqqpg7EA6w-SCbHanimRVZrBDSSXTTtd6SwkrDagyHql5O54MA95FXyJ_lT8bFhMuWGQS5wsUbBKq2OTCgWvtFdt_9tZwXWpncyw80_NnWtqgvbCKK7jjFRK_6lFu7N-wqau-hqyq-k9KCtcVI"
                />
              </div>
              {/* Decorative Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-surface-container-high p-4 rounded-xl shadow-lg border border-outline-variant/30 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-primary-fixed-dim">Tiket Terjamin</p>
                    <p className="text-[10px] text-secondary">Keamanan Gate 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kategori Section */}
        <section data-reveal className="bg-surface-container-lowest py-16">
          <div className="max-w-[1280px] mx-auto px-container-padding">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Kategori</h2>
                <p className="font-body-md text-body-md text-secondary">Cari berdasarkan minat dan hobi Anda</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gap-default">
              {[
                { icon: 'music_note', label: 'Konser' },
                { icon: 'sports_soccer', label: 'Sport' },
                { icon: 'festival', label: 'Festival' },
                { icon: 'school', label: 'Seminar' },
                { icon: 'gallery_thumbnail', label: 'Pameran' },
                { icon: 'construction', label: 'Workshop' },
              ].map(({ icon, label }) => (
                <div key={label} className="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <span className="font-body-md text-body-md font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Sekarang Section */}
        <section data-reveal className="py-16 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-container-padding">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline-md text-headline-md text-on-surface">Trending Sekarang</h2>
              <a className="font-label-md text-label-md text-primary hover:underline" href="#">Lihat Semua</a>
            </div>
            <div className="flex gap-gap-default overflow-x-auto no-scrollbar pb-8 -mx-container-padding px-container-padding">
              {[
                {
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-R23g0xqmyCnV2kyGdLbIHqaBfGDjJC4v4e7sZrx2y1kh-VANneEcHfHiYSp8hSojhtvLFoK-B-mRYaeXNrDFz9RyB-5M-TeXuBX-mQ7n7-oSTmazzPj6WA_6l58dt2Ht0kH59Clv9ilB-9sISAN65TisSSsqZssq77b9EzlAOR3LP0jt-QFUOnRHXwt9Bc5qZF7C06KDxwY38RKAlbCrZAZSNVTu2DhyDjW3ND4i-4laIxxl2Zn3eEapj0BWZzwwpQosYZTJyzk',
                  alt: 'Music Festival',
                  badge: 'Trending',
                  title: 'Electronic Dream Festival 2024',
                  location: 'Jakarta',
                  date: '15 Okt 2024',
                  price: 'Rp 450.000',
                  stock: 'Sisa 20',
                },
                {
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU1JEPzWYntEVZ2-5eHxBbdgS2bTQc6jjfsnirHgb_1RosnmlJlAnX_jG-JX_CxrsYCGCLX4EYlhz7P08C641U58cXGwP9hCOi7dOfHMDXkIWWSOPvu-i8RKtfvbeS9s06DgdzucM5s019cWx8Z9Te0h0_d0NDv4YgLggix8l4rv-bbVAwfpSQxo8Zp0eSLd662Uie-W5LgIxqDJa02_tzrSWSLRlz0A475dAlTFCgljxJE5FZsrvg5bVrY7iGVZeP8SCHJADHFeA',
                  alt: 'Tech Seminar',
                  title: 'AI Revolution Indonesia',
                  location: 'Bandung',
                  date: '22 Nov 2024',
                  price: 'Rp 250.000',
                  stock: 'Sisa 50',
                },
                {
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiofYmOlkeHdee3akjenkzZRxo0dMi12F4Wpc5Jn0qScLOTl2FQcO5hA84tO9fZdUXocp2mU2kC6Uvs2FxAMmvWgHphj29YquwrlnMdHj1blpYdEkd5zK7TWAyOoXVIJIzXQ0J_Ju-41nOcpysPZnxN4HKvNFAYopRVim5SsCxf9OvI8Az4pECpLcn8BhyXm7no77036wDb5o4gGBPY9wHGxA8f6vlrine5Z2_k2RzeT5j24cx1oF7BEVm-If37g5748qCIcPZOz4',
                  alt: 'Sport Event',
                  title: 'National Basketball Cup',
                  location: 'Surabaya',
                  date: '05 Des 2024',
                  price: 'Rp 150.000',
                  stock: 'Sisa 100',
                },
                {
                  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPy_CQdc2eaVp3XD_7q70UCzMbLXsPDckkv0V9PXKHKjakCr6-OHmK4Yh5T0Q_Fy-BNz41zuATXh6alPUotENPLZXjYa7JnRGk1xY6PhslybyIOtO61gou1zsCLrNTN_Bru0jRxqGr5KUqF_QM88V2c7q4cGJuhuUzVOFkLN1EGOUFLLZBuwzG6I2nFOopJp-Ny_uxEfMUsUoWL7HGCWZtjJB1Ct-9xfU-AZ_XHiHbIq8as4g8IIho-9WA7QeaxWxQJ7FxqxP1z7c',
                  alt: 'Cultural Festival',
                  title: 'Pasar Malam Modern 2.0',
                  location: 'Bali',
                  date: '12 Jan 2025',
                  price: 'Rp 75.000',
                  stock: 'Terbatas',
                },
              ].map((event) => (
                <div key={event.title} className="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden card-shadow group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img
                      alt={event.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={event.img}
                    />
                    {event.badge && (
                      <div className="absolute top-3 right-3 bg-surface-container-low/90 backdrop-blur px-2 py-1 rounded-[10px]">
                        <span className="font-caption text-caption text-primary font-bold">{event.badge}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span className="font-body-md text-body-md">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      <span className="font-body-md text-body-md">{event.date}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                      <span className="font-headline-sm text-headline-sm text-primary">{event.price}</span>
                      <span className="bg-surface-container-low text-on-primary-fixed-variant px-2 py-1 rounded-[10px] text-[11px] font-medium">{event.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizer Section */}
        <section data-reveal className="bg-surface-container-low/30 py-20 border-y border-outline-variant/20">
          <div className="max-w-[1280px] mx-auto px-container-padding">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Kelola Event dengan Lebih Aman &amp; Transparan</h2>
                <p className="font-body-lg text-body-lg text-secondary">Bergabunglah sebagai mitra penyelenggara SecureGate dan nikmati kemudahan manajemen tiket dengan sistem keamanan berlapis.</p>
              </div>
              <button
                onClick={() => navigate('/organizer-register')}
                className="coral-pill px-8 py-3 border-2 border-primary text-primary font-body-md text-body-md hover:bg-primary hover:text-on-primary transition-all font-bold whitespace-nowrap"
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
                <div key={title} className="p-8 bg-white rounded-2xl card-shadow border border-outline-variant/20 hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{title}</h3>
                  <p className="font-body-md text-body-md text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section data-reveal className="max-w-[1280px] mx-auto px-container-padding py-16">
          <div className="bg-primary-container/20 rounded-3xl p-12 flex flex-col items-center text-center gap-6 border border-primary/10">
            <h2 className="font-headline-lg text-headline-lg text-primary">Siap untuk Pengalaman Baru?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Gabung dengan ribuan pengguna lainnya yang telah mempercayakan SecureGate untuk urusan tiket mereka. Cepat, Aman, dan Tanpa Ribet.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/register')}
                className="coral-pill px-8 py-3 bg-primary text-on-primary font-body-md text-body-md hover:bg-primary/90 transition-all"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-gap-tight px-container-padding py-8 max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">SecureGate</span>
            <p className="font-caption text-caption text-secondary">© 2024 SecureGate. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-caption text-caption text-secondary-fixed-dim hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Privacy Policy</a>
            <a className="font-caption text-caption text-secondary-fixed-dim hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Terms of Service</a>
            <a className="font-caption text-caption text-secondary-fixed-dim hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Help Center</a>
            <a className="font-caption text-caption text-secondary-fixed-dim hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Contact Us</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer transition-colors">language</span>
            <span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer transition-colors">share</span>
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface/80 backdrop-blur-md border-t border-outline-variant/30 rounded-t-xl">
        <Link to="/" className="flex flex-col items-center justify-center text-primary bg-primary-fixed/20 rounded-full px-3 py-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-md text-label-md">Home</span>
        </Link>
        <Link to="/discover" className="flex flex-col items-center justify-center text-secondary">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-label-md text-label-md">Discover</span>
        </Link>
        <Link to="/my-tickets" className="flex flex-col items-center justify-center text-secondary">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="font-label-md text-label-md">My Tickets</span>
        </Link>
        <Link to="/wallet" className="flex flex-col items-center justify-center text-secondary">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-label-md text-label-md">Wallet</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-secondary">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md text-label-md">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
