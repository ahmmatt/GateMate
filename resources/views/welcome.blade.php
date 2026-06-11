@extends('layouts.app')

@section('title', 'GateMate - Temukan Event Terbaikmu')

@section('styles')
<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        vertical-align: middle;
    }
    .coral-pill { border-radius: 22px; }
    .card-shadow { border: 0.5px solid #EBEBEB; }
</style>
@endsection

@section('content')
<!-- Hero Section -->
<section class="relative px-container-padding py-16 md:py-24 max-w-[1280px] mx-auto overflow-hidden">
    <div class="flex flex-col md:flex-row items-center gap-12">
        <div class="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
            <h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background max-w-md">
                Temukan event terbaikmu
            </h1>
            <p class="font-body-lg text-body-lg text-secondary max-w-lg">
                Platform tiket digital paling aman dan transparan untuk konser, festival, dan seminar eksklusif. Dapatkan akses instan ke pengalaman tak terlupakan.
            </p>
            <div class="flex flex-wrap gap-4 mt-2">
                <a href="{{ route('discover') }}" class="coral-pill px-[22px] py-[10px] bg-primary text-on-primary font-body-md text-body-md hover:opacity-90 active:scale-95 transition-all text-center">
                    Jelajahi Event
                </a>
                <a href="{{ route('signup') }}" class="coral-pill px-[22px] py-[10px] border border-primary text-primary font-body-md text-body-md hover:bg-surface-container-low active:scale-95 transition-all text-center">
                    Daftar Gratis
                </a>
            </div>
        </div>
        <div class="w-full md:w-1/2 relative">
            <div class="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl card-shadow">
                <img alt="Featured Event" class="w-full h-full object-cover" data-alt="A high-energy music festival scene with a massive stage, vibrant atmospheric lighting in shades of deep red and white, and a silhouetted crowd enjoying the performance." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjKeZM_B8HohGvQEC3d1OUmzJKmSPx-nIzmeLNZRf3D_-AtDD9xsKiJDMaU6MQLVatj1b1fhG6xgZ6GXJOpP1bWHQfxTlDeAUeeNDV5gwoMCT-SGBDJ39KZKiKKkqqpg7EA6w-SCbHanimRVZrBDSSXTTtd6SwkrDagyHql5O54MA95FXyJ_lT8bFhMuWGQS5wsUbBKq2OTCgWvtFdt_9tZwXWpncyw80_NnWtqgvbCKK7jjFRK_6lFu7N-wqau-hqyq-k9KCtcVI"/>
            </div>
            <!-- Decorative Floating Element -->
            <div class="absolute -bottom-6 -left-6 bg-surface-container-high p-4 rounded-xl shadow-lg border border-outline-variant/30 hidden md:block">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">confirmation_number</span>
                    </div>
                    <div>
                        <p class="font-label-md text-label-md text-primary-fixed-variant">Tiket Terjamin</p>
                        <p class="text-[10px] text-secondary">Keamanan Gate 100%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Kategori Section -->
<section class="bg-surface-container-lowest py-16">
    <div class="max-w-[1280px] mx-auto px-container-padding">
        <div class="flex justify-between items-end mb-8">
            <div>
                <h2 class="font-headline-md text-headline-md text-on-surface">Kategori</h2>
                <p class="font-body-md text-body-md text-secondary">Cari berdasarkan minat dan hobi Anda</p>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gap-default">
            <!-- Category Item -->
            <a href="{{ route('discover', ['category' => 'Konser']) }}" class="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                <div class="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">music_note</span>
                </div>
                <span class="font-body-md text-body-md font-medium">Konser</span>
            </a>
            <a href="{{ route('discover', ['category' => 'Sport']) }}" class="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                <div class="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">sports_soccer</span>
                </div>
                <span class="font-body-md text-body-md font-medium">Sport</span>
            </a>
            <a href="{{ route('discover', ['category' => 'Festival']) }}" class="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                <div class="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">festival</span>
                </div>
                <span class="font-body-md text-body-md font-medium">Festival</span>
            </a>
            <a href="{{ route('discover', ['category' => 'Seminar']) }}" class="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                <div class="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">school</span>
                </div>
                <span class="font-body-md text-body-md font-medium">Seminar</span>
            </a>
            <a href="{{ route('discover', ['category' => 'Pameran']) }}" class="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                <div class="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">gallery_thumbnail</span>
                </div>
                <span class="font-body-md text-body-md font-medium">Pameran</span>
            </a>
            <a href="{{ route('discover', ['category' => 'Workshop']) }}" class="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer">
                <div class="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">construction</span>
                </div>
                <span class="font-body-md text-body-md font-medium">Workshop</span>
            </a>
        </div>
    </div>
</section>

<!-- Trending Sekarang Section -->
<section class="py-16 overflow-hidden">
    <div class="max-w-[1280px] mx-auto px-container-padding">
        <div class="flex justify-between items-center mb-8">
            <h2 class="font-headline-md text-headline-md text-on-surface">Trending Sekarang</h2>
            <a class="font-label-md text-label-md text-primary hover:underline" href="{{ route('discover') }}">Lihat Semua</a>
        </div>
        <div class="flex gap-gap-default overflow-x-auto no-scrollbar pb-8 -mx-container-padding px-container-padding">
            <!-- Event Card 1 -->
            <a href="{{ route('discover') }}" class="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden card-shadow group cursor-pointer hover:shadow-lg transition-shadow block">
                <div class="h-48 relative overflow-hidden">
                    <img alt="Music Festival" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-R23g0xqmyCnV2kyGdLbIHqaBfGDjJC4v4e7sZrx2y1kh-VANneEcHfHiYSp8hSojhtvLFoK-B-mRYaeXNrDFz9RyB-5M-TeXuBX-mQ7n7-oSTmazzPj6WA_6l58dt2Ht0kH59Clv9ilB-9sISAN65TisSSsqZssq77b9EzlAOR3LP0jt-QFUOnRHXwt9Bc5qZF7C06KDxwY38RKAlbCrZAZSNVTu2DhyDjW3ND4i-4laIxxl2Zn3eEapj0BWZzwwpQosYZTJyzk"/>
                    <div class="absolute top-3 right-3 bg-surface-container-low/90 backdrop-blur px-2 py-1 rounded-[10px]">
                        <span class="font-caption text-caption text-primary font-bold">Trending</span>
                    </div>
                </div>
                <div class="p-3 flex flex-col gap-2">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1">Electronic Dream Festival 2024</h3>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                        <span class="font-body-md text-body-md">Jakarta</span>
                    </div>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span class="font-body-md text-body-md">15 Okt 2024</span>
                    </div>
                    <div class="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <span class="font-headline-sm text-headline-sm text-primary">Rp 450.000</span>
                        <span class="bg-surface-container-low text-primary-fixed-variant px-2 py-1 rounded-[10px] text-[11px] font-medium">Sisa 20</span>
                    </div>
                </div>
            </a>
            <!-- Event Card 2 -->
            <a href="{{ route('discover') }}" class="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden card-shadow group cursor-pointer hover:shadow-lg transition-shadow block">
                <div class="h-48 relative overflow-hidden">
                    <img alt="Tech Seminar" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU1JEPzWYntEVZ2-5eHxBbdgS2bTQc6jjfsnirHgb_1RosnmlJlAnX_jG-JX_CxrsYCGCLX4EYlhz7P08C641U58cXGwP9hCOi7dOfHMDXkIWWSOPvu-i8RKtfvbeS9s06DgdzucM5s019cWx8Z9Te0h0_d0NDv4YgLggix8l4rv-bbVAwfpSQxo8Zp0eSLd662Uie-W5LgIxqDJa02_tzrSWSLRlz0A475dAlTFCgljxJE5FZsrvg5bVrY7iGVZeP8SCHJADHFeA"/>
                </div>
                <div class="p-3 flex flex-col gap-2">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1">AI Revolution Indonesia</h3>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                        <span class="font-body-md text-body-md">Bandung</span>
                    </div>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span class="font-body-md text-body-md">22 Nov 2024</span>
                    </div>
                    <div class="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <span class="font-headline-sm text-headline-sm text-primary">Rp 250.000</span>
                        <span class="bg-surface-container-low text-primary-fixed-variant px-2 py-1 rounded-[10px] text-[11px] font-medium">Sisa 50</span>
                    </div>
                </div>
            </a>
            <!-- Event Card 3 -->
            <a href="{{ route('discover') }}" class="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden card-shadow group cursor-pointer hover:shadow-lg transition-shadow block">
                <div class="h-48 relative overflow-hidden">
                    <img alt="Sport Event" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiofYmOlkeHdee3akjenkzZRxo0dMi12F4Wpc5Jn0qScLOTl2FQcO5hA84tO9fZdUXocp2mU2kC6Uvs2FxAMmvWgHphj29YquwrlnMdHj1blpYdEkd5zK7TWAyOoXVIJIzXQ0J_Ju-41nOcpysPZnxN4HKvNFAYopRVim5SsCxf9OvI8Az4pECpLcn8BhyXm7no77036wDb5o4gGBPY9wHGxA8f6vlrine5Z2_k2RzeT5j24cx1oF7BEVm-If37g5748qCIcPZOz4"/>
                </div>
                <div class="p-3 flex flex-col gap-2">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1">National Basketball Cup</h3>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                        <span class="font-body-md text-body-md">Surabaya</span>
                    </div>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span class="font-body-md text-body-md">05 Des 2024</span>
                    </div>
                    <div class="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <span class="font-headline-sm text-headline-sm text-primary">Rp 150.000</span>
                        <span class="bg-surface-container-low text-primary-fixed-variant px-2 py-1 rounded-[10px] text-[11px] font-medium">Sisa 100</span>
                    </div>
                </div>
            </a>
            <!-- Event Card 4 -->
            <a href="{{ route('discover') }}" class="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden card-shadow group cursor-pointer hover:shadow-lg transition-shadow block">
                <div class="h-48 relative overflow-hidden">
                    <img alt="Cultural Festival" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPy_CQdc2eaVp3XD_7q70UCzMbLXsPDckkv0V9PXKHKjakCr6-OHmK4Yh5T0Q_Fy-BNz41zuATXh6alPUotENPLZXjYa7JnRGk1xY6PhslybyIOtO61gou1zsCLrNTN_Bru0jRxqGr5KUqF_QM88V2c7q4cGJuhuUzVOFkLN1EGOUFLLZBuwzG6I2nFOopJp-Ny_uxEfMUsUoWL7HGCWZtjJB1Ct-9xfU-AZ_XHiHbIq8as4g8IIho-9WA7QeaxWxQJ7FxqxP1z7c"/>
                </div>
                <div class="p-3 flex flex-col gap-2">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-1">Pasar Malam Modern 2.0</h3>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">location_on</span>
                        <span class="font-body-md text-body-md">Bali</span>
                    </div>
                    <div class="flex items-center gap-1 text-secondary">
                        <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span class="font-body-md text-body-md">12 Jan 2025</span>
                    </div>
                    <div class="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
                        <span class="font-headline-sm text-headline-sm text-primary">Rp 75.000</span>
                        <span class="bg-surface-container-low text-primary-fixed-variant px-2 py-1 rounded-[10px] text-[11px] font-medium">Terbatas</span>
                    </div>
                </div>
            </a>
        </div>
    </div>
</section>

<!-- Organizer Section -->
<section class="bg-surface-container-low/30 py-20 border-y border-outline-variant/20">
    <div class="max-w-[1280px] mx-auto px-container-padding">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div class="max-w-2xl">
                <h2 class="font-headline-lg text-headline-lg text-on-surface mb-4">Kelola Event dengan Lebih Aman &amp; Transparan</h2>
                <p class="font-body-lg text-body-lg text-secondary">Bergabunglah sebagai mitra penyelenggara GateMate dan nikmati kemudahan manajemen tiket dengan sistem keamanan berlapis.</p>
            </div>
            <a href="{{ route('organizer.register') }}" class="coral-pill px-8 py-3 border-2 border-primary text-primary font-body-md text-body-md hover:bg-primary hover:text-on-primary transition-all font-bold text-center">
                Daftar Jadi Penyelenggara
            </a>
        </div>
        <div class="grid md:grid-cols-3 gap-gap-default">
            <!-- Feature 1 -->
            <div class="p-8 bg-white rounded-2xl card-shadow border border-outline-variant/20 hover:border-primary/50 transition-colors group">
                <div class="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-3">Real-time Analytics</h3>
                <p class="font-body-md text-body-md text-secondary">Pantau penjualan tiket dan data kehadiran peserta secara instan melalui dashboard yang intuitif.</p>
            </div>
            <!-- Feature 2 -->
            <div class="p-8 bg-white rounded-2xl card-shadow border border-outline-variant/20 hover:border-primary/50 transition-colors group">
                <div class="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-3">Sistem Anti-Fraud</h3>
                <p class="font-body-md text-body-md text-secondary">Teknologi verifikasi wajah dan QR code unik memastikan tidak ada tiket palsu di event Anda.</p>
            </div>
            <!-- Feature 3 -->
            <div class="p-8 bg-white rounded-2xl card-shadow border border-outline-variant/20 hover:border-primary/50 transition-colors group">
                <div class="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">payments</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-3">Pencairan Dana Cepat</h3>
                <p class="font-body-md text-body-md text-secondary">Proses penyelesaian pembayaran yang transparan dan terjadwal langsung ke akun perusahaan Anda.</p>
            </div>
        </div>
    </div>
</section>

<!-- Final CTA Section -->
<section class="max-w-[1280px] mx-auto py-16">
    <div class="bg-primary-container/20 rounded-3xl p-12 flex flex-col items-center text-center gap-6 border border-primary/10">
        <h2 class="font-headline-lg text-headline-lg text-primary">Siap untuk Pengalaman Baru?</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Gabung dengan ribuan pengguna lainnya yang telah mempercayakan GateMate untuk urusan tiket mereka. Cepat, Aman, dan Tanpa Ribet.
        </p>
        <div class="flex gap-4">
            <a href="{{ route('discover') }}" class="coral-pill px-8 py-3 bg-primary text-on-primary font-body-md text-body-md hover:bg-primary/90 transition-all text-center">
                Mulai Sekarang
            </a>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script>
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Simple animation on scroll reveal
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-4');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-4');
        observer.observe(section);
    });
</script>
@endsection
