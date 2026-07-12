<!DOCTYPE html>
<html class="light" lang="id" style="">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Buat Event Baru - GateMate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    "surface": "#fbf9f8",
                    "primary": "#b22110",
                    "surface-container-lowest": "#ffffff",
                    "surface-container": "#efeded",
                    "primary-container": "#d63b27",
                    "on-surface": "#1b1c1c",
                    "surface-container-low": "#f5f3f3",
                    "outline": "#8f706a",
                    "outline-variant": "#e3beb8",
                    "secondary": "#5f5e5e",
                    "on-primary": "#ffffff",
                    "error": "#ba1a1a",
                    "surface-container-highest": "#e4e2e2",
                    "surface-container-high": "#e9e8e7",
                    "primary-fixed": "#ffdad4",
                    "secondary-fixed": "#e5e2e1",
                    "on-secondary-fixed": "#1c1b1b",
                    "on-secondary-fixed-variant": "#474646"
                },
                fontFamily: {
                    "h3": ["Inter"],
                    "h2": ["Inter"],
                    "body-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "caption": ["Inter"],
                    "body-lg": ["Inter"],
                    "h1": ["Inter"]
                },
                fontSize: {
                    "h3": ["20px", { "lineHeight": "28px", "fontWeight": "500" }],
                    "h2": ["24px", { "lineHeight": "32px", "fontWeight": "500" }],
                    "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                    "label-md": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
                    "caption": ["11px", { "lineHeight": "14px", "fontWeight": "400" }],
                    "body-lg": ["15px", { "lineHeight": "24px", "fontWeight": "400" }],
                    "h1": ["32px", { "lineHeight": "40px", "fontWeight": "500" }]
                },
                spacing: {
                    "page-padding": "24px",
                    "stack-sm": "8px",
                    "stack-md": "16px",
                    "stack-lg": "24px",
                    "gutter": "16px",
                    "sidebar-width": "240px"
                }
            }
        }
    }
</script>
<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    input[type="checkbox"]:checked { background-color: #b22110; border-color: #b22110; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .toggle-switch { transition: all 0.2s ease-in-out; }
</style>
</head>
<body class="bg-surface font-body-lg text-on-surface">

<!-- We will keep the Sidebar empty in this payload, and patch it with python script to match dashboard -->
<!-- Side Navigation Bar -->
<nav class="fixed left-0 top-0 h-screen w-[240px] flex flex-col py-stack-lg border-r border-outline-variant bg-surface z-40 hidden md:flex">
    <div class="px-gutter mb-10">
        <h2 class="font-h2 text-h2 font-black text-primary">GateMate</h2>
        <p class="font-caption text-caption text-secondary">Organizer</p>
    </div>
    <ul class="flex-1 space-y-1">
        <li>
            <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.dashboard') }}">
                <span class="material-symbols-outlined mr-3">dashboard</span>
                <span class="font-body-sm text-body-sm">Dashboard</span>
            </a>
        </li>
        <li>
            <a class="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer" href="{{ route('admin.events.index') }}">
                <span class="material-symbols-outlined mr-3">event</span>
                <span class="font-body-sm text-body-sm">Event Saya</span>
            </a>
        </li>
        <li>
            <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.scanner') }}">
                <span class="material-symbols-outlined mr-3">qr_code_scanner</span>
                <span class="font-body-sm text-body-sm">Scanner</span>
            </a>
        </li>
        <li>
            <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.finance') }}">
                <span class="material-symbols-outlined mr-3">payments</span>
                <span class="font-body-sm text-body-sm">Keuangan</span>
            </a>
        </li>
        <li>
        </li>
    </ul>
    <div class="px-gutter mt-auto space-y-1">
        <div class="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div class="flex items-center">
                @if (!empty(auth()->user()->profile_picture))
                    <img alt="Organizer Profile" class="w-8 h-8 rounded-full object-cover bg-surface-container-high" src="{{ asset('Media/uploads/' . auth()->user()->profile_picture) }}"/>
                @else
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{{ strtoupper(substr(auth()->user()->full_name ?? 'O', 0, 1)) }}</div>
                @endif
                <div class="ml-2 overflow-hidden">
                    <p class="font-label-md text-label-md font-bold truncate">{{ auth()->user()->full_name ?? 'Organizer' }}</p>
                    <p class="font-caption text-caption text-secondary">ID: SG-{{ auth()->user()->id_user ?? '1' }}</p>
                </div>
            </div>
            <form action="{{ route('logout') }}" method="POST" class="inline">
                @csrf
                <button type="submit" class="text-primary active:opacity-70 mt-1">
                    <span class="material-symbols-outlined text-[20px]">logout</span>
                </button>
            </form>
        </div>
    </div>
</nav>
<!-- Bottom Navigation Mobile -->
<nav class="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.dashboard') }}">
        <span class="material-symbols-outlined">grid_view</span>
        <span class="font-label-md text-label-md">Dashboard</span>
    </a>
    <a class="flex flex-col items-center text-primary font-bold active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.events.index') }}">
        <span class="material-symbols-outlined">confirmation_number</span>
        <span class="font-label-md text-label-md">Events</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.scanner') }}">
        <div class="bg-primary -mt-8 p-3 rounded-full text-on-primary shadow-lg active:scale-90 transition-transform">
            <span class="material-symbols-outlined">center_focus_weak</span>
        </div>
        <span class="font-label-md text-label-md mt-1">Scan</span>
    </a>
    <a class="flex flex-col items-center text-secondary active:bg-surface-container-low px-4 py-1 transition-colors" href="{{ route('admin.finance') }}">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span class="font-label-md text-label-md">Finance</span>
    </a>
</nav>

<!-- Top App Bar -->
<header class="fixed top-0 right-0 left-0 md:left-[240px] h-16 flex justify-between items-center px-gutter bg-surface border-b border-outline-variant z-40">
    <div class="flex items-center gap-4">
        <button class="md:hidden p-2 text-secondary">
            <span class="material-symbols-outlined">menu</span>
        </button>
        <h2 class="font-h3 text-h3 text-on-surface">Buat Event Baru</h2>
    </div>
    <div class="flex items-center gap-stack-md">
        <button class="hover:bg-surface-container-low rounded-full p-2 transition-all">
            <span class="material-symbols-outlined">notifications</span>
        </button>
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm hidden sm:flex">
            {{ strtoupper(substr(auth()->user()->full_name ?? 'O', 0, 1)) }}
        </div>
    </div>
</header>

<!-- Main Content -->
<main class="pt-20 pb-24 md:ml-[240px] min-h-screen">
<form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    
    @if($errors->any())
        <div class="max-w-[800px] mx-auto px-gutter mb-4">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong class="font-bold">Oops!</strong>
                <span class="block sm:inline">{{ $errors->first() }}</span>
            </div>
        </div>
    @endif

    <div class="max-w-[800px] mx-auto px-gutter py-stack-lg">
        <!-- Step Navigation -->
        <div class="mb-stack-lg flex overflow-x-auto no-scrollbar gap-stack-lg border-b border-outline-variant">
            <button type="button" class="pb-3 whitespace-nowrap px-2 hover:text-on-surface border-b-2 border-primary text-primary font-bold" onclick="showTab('tab-info')">Informasi Dasar</button>
            <button type="button" class="pb-3 whitespace-nowrap px-2 text-secondary hover:text-on-surface" onclick="showTab('tab-jadwal')">Jadwal & Lokasi</button>
            <button type="button" class="pb-3 whitespace-nowrap px-2 text-secondary hover:text-on-surface" onclick="showTab('tab-tiket')">Tiket</button>
            <button type="button" class="pb-3 whitespace-nowrap px-2 text-secondary hover:text-on-surface" onclick="showTab('tab-lanjut')">Pengaturan Lanjut</button>
        </div>

        <!-- Tab: Informasi Dasar -->
        <div class="tab-content space-y-stack-lg block" id="tab-info">
            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                <h3 class="font-h3 text-h3 mb-stack-md">Informasi Dasar</h3>
                <div class="space-y-stack-md">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Judul Event</label>
                        <input name="title" value="{{ old('title') }}" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Contoh: Jakarta Tech Conference 2024" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Kategori</label>
                        <select name="category" required class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all">
                            <option value="">Pilih Kategori</option>
                            <option value="Technology">Teknologi</option>
                            <option value="Music">Musik</option>
                            <option value="Sports">Olahraga</option>
                            <option value="Education">Pendidikan</option>
                            <option value="Business">Bisnis</option>
                            <option value="Other">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Poster Event</label>
                        <div class="relative group cursor-pointer border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-low h-48 flex flex-col items-center justify-center overflow-hidden">
                            <input type="file" name="banner_image" accept="image/*" required onchange="previewImage(this, 'banner-preview')" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10">
                            <img id="banner-preview" class="absolute inset-0 w-full h-full object-cover hidden z-0">
                            <span class="material-symbols-outlined text-4xl text-secondary mb-2 relative z-10">image</span>
                            <p class="text-secondary font-body-sm relative z-10">Klik atau seret gambar ke sini</p>
                            <p class="text-caption text-secondary mt-1 relative z-10">Rasio 16:9 direkomendasikan (Maks 5MB)</p>
                        </div>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Deskripsi Event</label>
                        <div class="border border-outline-variant rounded-lg overflow-hidden">
                            <textarea name="description" class="w-full border-none bg-surface p-4 focus:ring-0" placeholder="Jelaskan detail event anda kepada calon pembeli..." rows="6">{{ old('description') }}</textarea>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Tab: Jadwal & Lokasi -->
        <div class="tab-content space-y-stack-lg hidden" id="tab-jadwal">
            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                <h3 class="font-h3 text-h3 mb-stack-md">Jadwal & Lokasi</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-stack-md">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Mulai</label>
                        <div class="flex gap-2">
                            <input name="start_date" value="{{ old('start_date') }}" required class="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="date"/>
                            <input name="start_time" value="{{ old('start_time') }}" required class="w-32 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="time"/>
                        </div>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Berakhir</label>
                        <div class="flex gap-2">
                            <input name="end_date" value="{{ old('end_date') }}" required class="flex-1 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="date"/>
                            <input name="end_time" value="{{ old('end_time') }}" required class="w-32 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-3 py-2" type="time"/>
                        </div>
                    </div>
                </div>
                <div class="mb-stack-md">
                    <label class="block font-label-md text-label-md text-secondary mb-2">Tipe Lokasi</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input checked class="text-primary focus:ring-0" name="location_type" type="radio" value="offline" onchange="toggleLoc()"/>
                            <span class="font-body-sm">Venue Fisik</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input class="text-primary focus:ring-0" name="location_type" type="radio" value="online" onchange="toggleLoc()"/>
                            <span class="font-body-sm">Online / Virtual</span>
                        </label>
                    </div>
                </div>
                
                <div class="space-y-stack-md" id="physical-venue-fields">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Alamat Lengkap</label>
                        <textarea name="location_details" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Masukkan Alamat Lengkap Venue" rows="3">{{ old('location_details') }}</textarea>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Nama Venue / Kota</label>
                        <input name="venue_name" value="{{ old('venue_name') }}" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all mb-2" placeholder="Contoh: Istora Senayan" type="text"/>
                        <input name="city" value="{{ old('city') }}" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Contoh: Jakarta" type="text"/>
                    </div>
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Kode Embed Maps (Iframe)</label>
                        <textarea name="maps_link" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Paste kode <iframe src='...'></iframe> di sini" rows="3">{{ old('maps_link') }}</textarea>
                        <p class="font-caption text-secondary mt-1">Buka Google Maps > Klik Bagikan (Share) > Pilih Sematkan Peta (Embed a map) > Salin HTML.</p>
                    </div>
                </div>
                
                <div class="space-y-stack-md hidden" id="virtual-venue-fields">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-1">Link Meeting</label>
                        <input name="location_details" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Zoom, Google Meet, atau Link Streaming" type="url" disabled/>
                    </div>
                </div>
            </section>
        </div>

        <!-- Tab: Tiket -->
        <div class="tab-content space-y-stack-lg hidden" id="tab-tiket">
            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                <div class="flex justify-between items-center mb-stack-md">
                    <h3 class="font-h3 text-h3">Manajemen Tiket</h3>
                    <button type="button" onclick="alert('Anda dapat menambahkan lebih banyak tier tiket (seperti VIP, VVIP) setelah event ini selesai dibuat dan dipublikasikan.')" class="flex items-center gap-2 text-primary font-bold hover:bg-primary-fixed/30 px-3 py-1.5 rounded transition-colors">
                        <span class="material-symbols-outlined text-[20px]">add</span>
                        <span class="text-sm">Tambah Tier</span>
                    </button>
                </div>
                <p class="font-caption text-secondary mb-4">Konfigurasi tier tiket pertama Anda. Tier tiket tambahan dapat ditambahkan nanti melalui halaman kelola event.</p>
                <div class="space-y-6">
                    <div class="p-5 bg-surface rounded-lg border border-outline-variant">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block font-label-md text-label-md text-secondary mb-1">Nama Tiket</label>
                                    <input name="tier_name" required value="{{ old('tier_name', 'Regular Ticket') }}" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm" type="text"/>
                                </div>
                                <div>
                                    <label class="block font-label-md text-label-md text-secondary mb-1">Harga (IDR)</label>
                                    <input name="price" required value="{{ old('price', 150000) }}" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm" type="number"/>
                                </div>
                                <div>
                                    <label class="block font-label-md text-label-md text-secondary mb-1">Stok</label>
                                    <input name="quota" required value="{{ old('quota', 500) }}" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded px-3 py-2 text-sm" type="number"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg mb-stack-lg">
                <h3 class="font-h3 text-h3 mb-stack-md">Kapasitas Event</h3>
                <div class="space-y-stack-md">
                    <div>
                        <label class="block font-label-md text-label-md text-secondary mb-2">Tipe Kapasitas</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input class="text-primary focus:ring-0" name="capacity_type" type="radio" value="unlimited" onchange="toggleCap()"/>
                                <span class="font-body-sm">Tidak Terbatas</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input checked class="text-primary focus:ring-0" name="capacity_type" type="radio" value="limited" onchange="toggleCap()"/>
                                <span class="font-body-sm">Terbatas</span>
                            </label>
                        </div>
                    </div>
                    <div class="space-y-stack-md border-t border-outline-variant pt-stack-md" id="limited-capacity-settings">
                        <div>
                            <label class="block font-label-md text-label-md text-secondary mb-3">Pengaturan Tempat Duduk</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label class="relative flex flex-col p-4 border border-primary bg-primary-fixed/30 rounded-lg cursor-pointer seat-config-label" onclick="selectSeatConfig(this)">
                                    <input checked class="absolute top-4 right-4 text-primary focus:ring-0" name="seat_assignment" type="radio" value="bebas"/>
                                    <span class="material-symbols-outlined text-primary mb-2">event_seat</span>
                                    <span class="font-label-md font-bold">Pilih Kursi Mandiri</span>
                                    <span class="text-caption text-secondary">User selects their own seat from a map</span>
                                </label>
                                <label class="relative flex flex-col p-4 border border-outline-variant hover:border-primary transition-colors rounded-lg cursor-pointer seat-config-label" onclick="selectSeatConfig(this)">
                                    <input class="absolute top-4 right-4 text-primary focus:ring-0" name="seat_assignment" type="radio" value="pilih"/>
                                    <span class="material-symbols-outlined text-secondary mb-2">edit_square</span>
                                    <span class="font-label-md font-bold">Input Pengaturan Seat</span>
                                    <span class="text-caption text-secondary">Organizer manually inputs seat numbers</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block font-label-md text-label-md text-secondary mb-1">Total Kapasitas</label>
                            <input name="max_capacity" value="{{ old('max_capacity') }}" class="w-full md:w-1/3 bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-0 transition-all" placeholder="Contoh: 1000" type="number"/>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Tab: Pengaturan Lanjut -->
        <div class="tab-content space-y-stack-lg hidden" id="tab-lanjut">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                <section class="bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-lg">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="material-symbols-outlined text-primary">admin_panel_settings</span>
                        <h3 class="font-h3 text-h3">Privasi & Izin</h3>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-start justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                            <div class="pr-4">
                                <h4 class="font-label-md font-bold">Persetujuan Peserta</h4>
                                <p class="font-caption text-secondary">Setiap peserta harus mendapatkan persetujuan penyelenggara.</p>
                            </div>
                            <div class="toggle-container relative inline-block w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer mt-1 flex-shrink-0" onclick="toggleApproval(this)">
                                <input type="checkbox" name="require_approval" id="require_approval" value="1" class="hidden">
                                <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-0 toggle-dot shadow-md"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    </div>

    <!-- Footer Actions -->
    <footer class="fixed bottom-0 right-0 left-0 md:left-[240px] bg-surface border-t border-outline-variant px-gutter py-4 flex justify-between items-center z-40">
        <div class="hidden sm:block">
            <p class="font-caption text-secondary">Akan disimpan sebagai Publik</p>
        </div>
        <div class="flex gap-4 w-full sm:w-auto">
            <button type="submit" class="w-full sm:w-auto px-8 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
                Publikasikan Event
            </button>
        </div>
    </footer>
</form>
</main>

<script>
    function showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
        document.getElementById(tabId).classList.remove('hidden');
        
        const buttons = document.querySelectorAll('button[onclick^="showTab"]');
        buttons.forEach(btn => {
            if(btn.getAttribute('onclick').includes(tabId)) {
                btn.className = "pb-3 whitespace-nowrap px-2 hover:text-on-surface border-b-2 border-primary text-primary font-bold";
            } else {
                btn.className = "pb-3 whitespace-nowrap px-2 text-secondary hover:text-on-surface";
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function previewImage(input, previewId) {
        const file = input.files[0];
        if (file) {
            const preview = document.getElementById(previewId);
            preview.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
        }
    }

    function toggleLoc() {
        const isOffline = document.querySelector('input[name="location_type"][value="offline"]').checked;
        document.getElementById('physical-venue-fields').classList.toggle('hidden', !isOffline);
        document.getElementById('virtual-venue-fields').classList.toggle('hidden', isOffline);
        
        const physInput = document.getElementById('physical-venue-fields').querySelectorAll('textarea, input');
        const virtInput = document.getElementById('virtual-venue-fields').querySelectorAll('input');
        
        physInput.forEach(i => i.disabled = !isOffline);
        virtInput.forEach(i => i.disabled = isOffline);
    }
    
    function toggleCap() {
        const isLimited = document.querySelector('input[name="capacity_type"][value="limited"]').checked;
        document.getElementById('limited-capacity-settings').classList.toggle('hidden', !isLimited);
    }

    function toggleApproval(container) {
        const dot = container.querySelector('.toggle-dot');
        const checkbox = container.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
            dot.classList.remove('translate-x-0');
            dot.classList.add('translate-x-6');
            container.classList.replace('bg-gray-300', 'bg-primary');
        } else {
            dot.classList.remove('translate-x-6');
            dot.classList.add('translate-x-0');
            container.classList.replace('bg-primary', 'bg-gray-300');
        }
    }

    function selectSeatConfig(selectedElement) {
        document.querySelectorAll('.seat-config-label').forEach(el => {
            el.classList.remove('border-primary', 'bg-primary-fixed/30');
            el.classList.add('border-outline-variant');
            el.querySelector('.material-symbols-outlined').classList.replace('text-primary', 'text-secondary');
        });
        
        selectedElement.classList.remove('border-outline-variant');
        selectedElement.classList.add('border-primary', 'bg-primary-fixed/30');
        selectedElement.querySelector('.material-symbols-outlined').classList.replace('text-secondary', 'text-primary');
        
        selectedElement.querySelector('input').checked = true;
    }

    // Initialize toggles on page load
    document.addEventListener('DOMContentLoaded', () => {
        toggleLoc();
        toggleCap();
    });
</script>
</body>
</html>
