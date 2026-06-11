<!DOCTYPE html>
<html class="light" lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>GateMate - Event Saya</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface-variant": "#5b403c",
                    "surface-container-high": "#e9e8e7",
                    "secondary-fixed": "#e5e2e1",
                    "error-container": "#ffdad6",
                    "surface-dim": "#dbdad9",
                    "surface-container-highest": "#e4e2e2",
                    "on-tertiary-fixed": "#001f27",
                    "on-tertiary-container": "#f9fdff",
                    "surface": "#fbf9f8",
                    "surface-bright": "#fbf9f8",
                    "tertiary": "#006579",
                    "on-secondary": "#ffffff",
                    "on-secondary-container": "#656464",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-fixed": "#400200",
                    "primary-fixed-dim": "#ffb4a7",
                    "on-error-container": "#93000a",
                    "on-secondary-fixed": "#1c1b1b",
                    "primary-fixed": "#ffdad4",
                    "tertiary-container": "#007f99",
                    "primary-container": "#d63b27",
                    "error": "#ba1a1a",
                    "inverse-on-surface": "#f2f0f0",
                    "secondary": "#5f5e5e",
                    "primary": "#b22110",
                    "background": "#fbf9f8",
                    "outline-variant": "#e3beb8",
                    "outline": "#8f706a",
                    "on-surface": "#1b1c1c",
                    "surface-container": "#efeded",
                    "inverse-primary": "#ffb4a7",
                    "secondary-fixed-dim": "#c8c6c5",
                    "on-primary-container": "#fffbff",
                    "on-primary": "#ffffff",
                    "tertiary-fixed": "#b2ebff",
                    "on-secondary-fixed-variant": "#474646",
                    "tertiary-fixed-dim": "#68d4f3",
                    "surface-variant": "#e4e2e2",
                    "on-primary-fixed-variant": "#910900",
                    "surface-tint": "#b62413",
                    "on-tertiary": "#ffffff",
                    "on-error": "#ffffff",
                    "on-tertiary-fixed-variant": "#004e5e",
                    "secondary-container": "#e5e2e1",
                    "on-background": "#1b1c1c",
                    "inverse-surface": "#303031",
                    "surface-container-low": "#f5f3f3"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "sidebar-width": "240px",
                    "stack-sm": "8px",
                    "stack-md": "16px",
                    "page-padding": "24px",
                    "max-container": "1200px",
                    "gutter": "16px",
                    "stack-lg": "24px"
            },
            "fontFamily": {
                    "body-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "h1": ["Inter"],
                    "h1-mobile": ["Inter"],
                    "h2": ["Inter"],
                    "caption": ["Inter"],
                    "h3": ["Inter"]
            },
            "fontSize": {
                    "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                    "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "h1": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                    "h1-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "500"}],
                    "h2": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                    "caption": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
                    "h3": ["20px", {"lineHeight": "28px", "fontWeight": "500"}]
            }
          },
        },
      }
    </script>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #fbf9f8;
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      /* Custom Scrollbar for industrial precision */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #fbf9f8; }
      ::-webkit-scrollbar-thumb { background: #e3beb8; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #8f706a; }
    </style>
</head>
<body class="bg-background text-on-surface">

@php
    $adminName = Auth::user()->full_name;
    $adminId = Auth::user()->id_user;
@endphp

<!-- Mobile Top Bar -->
<header class="flex justify-between items-center px-page-padding h-16 w-full bg-surface border-b-[0.5px] border-outline-variant md:hidden fixed top-0 z-[60]">
    <span class="font-h1-mobile text-h1-mobile font-bold text-primary">GateMate</span>
    <button class="active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-primary">menu</span>
    </button>
</header>

<!-- Side Navigation (Desktop) -->
<aside class="w-sidebar-width h-screen fixed left-0 top-0 bg-surface border-r-[0.5px] border-outline-variant hidden md:flex flex-col py-page-padding z-40">
    <div class="px-6 mb-10">
        <h2 class="font-h2 text-h2 font-black text-on-surface">GateMate</h2>
        <p class="font-caption text-caption text-secondary">Organizer</p>
    </div>
    <nav class="flex-1 space-y-1">
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.dashboard') }}">
            <span class="material-symbols-outlined mr-3">dashboard</span>
            <span class="font-body-sm text-body-sm">Dashboard</span>
        </a>
        <a class="flex items-center px-6 py-3 border-l-4 border-primary bg-primary-fixed text-primary font-bold transition-colors cursor-pointer" href="{{ route('admin.events.index') }}">
            <span class="material-symbols-outlined mr-3">event</span>
            <span class="font-body-sm text-body-sm">Event Saya</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.scanner') }}">
            <span class="material-symbols-outlined mr-3">qr_code_scanner</span>
            <span class="font-body-sm text-body-sm">Scanner</span>
        </a>
        <a class="flex items-center px-6 py-3 text-secondary hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80" href="{{ route('admin.finance') }}">
            <span class="material-symbols-outlined mr-3">payments</span>
            <span class="font-body-sm text-body-sm">Keuangan</span>
        </a>
    </nav>
    <div class="px-6 mt-auto space-y-1">
        <a class="flex items-center py-3 text-secondary hover:text-on-surface transition-colors cursor-pointer" href="#">
            <span class="material-symbols-outlined mr-3">help</span>
            <span class="font-body-sm text-body-sm">Bantuan</span>
        </a>
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
</aside>

<!-- Main Content Canvas -->
<main class="md:ml-sidebar-width min-h-screen pt-16 md:pt-0 pb-20 md:pb-0">
    <div class="max-w-max-container mx-auto p-page-padding">
        
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        @endif
        @if(session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span class="block sm:inline">{{ session('error') }}</span>
            </div>
        @endif

        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h2 class="font-h1 text-h1 text-on-surface">Event Saya</h2>
                <p class="font-body-sm text-body-sm text-secondary">Kelola semua tiket dan jadwal acara Anda di sini.</p>
            </div>
            <a href="{{ route('admin.events.create') }}" class="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-none">
                <span class="material-symbols-outlined font-bold text-[20px]">add</span>
                <span class="font-label-lg text-label-lg font-normal">Event Baru</span>
            </a>
        </div>

        <!-- Bento Filter Bar (Custom Utility) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="col-span-1 md:col-span-2 relative">
                <form action="{{ route('admin.events.index') }}" method="GET" class="w-full">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input name="search" value="{{ request('search') }}" class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm focus:border-primary-container focus:ring-0 transition-colors" placeholder="Cari nama event..." type="text"/>
                </form>
            </div>
            <div class="flex space-x-2 overflow-x-auto pb-1">
                <a href="{{ route('admin.events.index') }}" class="px-4 py-2 {{ !request('status') ? 'bg-primary text-on-primary' : 'bg-surface border-[0.5px] border-outline-variant text-secondary hover:bg-surface-container' }} rounded-lg text-label-md shrink-0 transition-colors">Semua</a>
                <a href="{{ route('admin.events.index', ['status' => 'active']) }}" class="px-4 py-2 {{ request('status') === 'active' ? 'bg-primary text-on-primary' : 'bg-surface border-[0.5px] border-outline-variant text-secondary hover:bg-surface-container' }} rounded-lg text-label-md shrink-0 transition-colors">Active</a>
                <a href="{{ route('admin.events.index', ['status' => 'ended']) }}" class="px-4 py-2 {{ request('status') === 'ended' ? 'bg-primary text-on-primary' : 'bg-surface border-[0.5px] border-outline-variant text-secondary hover:bg-surface-container' }} rounded-lg text-label-md shrink-0 transition-colors">Ended</a>
            </div>
        </div>

        <!-- Events Table Container -->
        <div class="bg-surface border-[0.5px] border-outline-variant rounded-xl overflow-hidden overflow-x-auto">
            @if($events->isEmpty())
                <div class="text-center py-16 px-4">
                    <span class="material-symbols-outlined text-5xl text-outline-variant mb-4">calendar_month</span>
                    <h3 class="font-h3 text-h3 text-on-surface mb-2">Belum Ada Event</h3>
                    <p class="font-body-sm text-body-sm text-secondary mb-6">Mulai buat event pertama Anda dan jual tiket dengan aman.</p>
                    <a href="{{ route('admin.events.create') }}" class="inline-flex items-center justify-center space-x-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-none">
                        <span class="material-symbols-outlined font-bold">add</span>
                        <span class="font-label-md text-label-md font-bold uppercase tracking-wider">Buat Event Pertama</span>
                    </a>
                </div>
            @else
            <table class="w-full text-left border-collapse min-w-[800px]">
                <thead class="bg-surface-container-low border-b-[0.5px] border-outline-variant">
                    <tr>
                        <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Poster</th>
                        <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Nama Event</th>
                        <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Kategori</th>
                        <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Tanggal</th>
                        <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight">Status</th>
                        <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-tight text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y-[0.5px] divide-outline-variant">
                    
                    @foreach($events as $event)
                    @php
                        $banner = !empty($event->banner_image)
                            ? asset('Media/uploads/'.$event->banner_image)
                            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
                        
                        $isEnded = $event->status !== 'active';
                        $rowClass = $isEnded ? 'hover:bg-surface-container-lowest transition-colors opacity-70' : 'hover:bg-surface-container-lowest transition-colors';
                    @endphp
                    <tr class="{{ $rowClass }}">
                        <td class="px-6 py-4">
                            <div class="w-12 h-16 rounded overflow-hidden bg-surface-container-high {{ $isEnded ? 'grayscale' : '' }}">
                                <img src="{{ $banner }}" class="w-full h-full object-cover" alt="Banner Event">
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <p class="font-body-sm text-body-sm font-bold text-on-surface">{{ $event->title }}</p>
                            <p class="text-caption text-secondary">{{ $event->city ?? $event->location_type }}</p>
                        </td>
                        <td class="px-6 py-4">
                            <span class="bg-surface-container-high px-2 py-1 rounded text-caption text-on-surface-variant">{{ $event->category }}</span>
                        </td>
                        <td class="px-6 py-4">
                            <p class="font-body-sm text-body-sm text-on-surface">{{ \Carbon\Carbon::parse($event->start_date)->format('d M Y') }}</p>
                            <p class="text-caption text-secondary">{{ \Carbon\Carbon::createFromTimeString($event->start_time)->format('H:i') }} WIB</p>
                        </td>
                        <td class="px-6 py-4">
                            @if($event->status === 'active')
                                <span class="px-3 py-1 rounded-full text-caption font-bold bg-[#DCFCE7] text-[#15803D]">Active</span>
                            @else
                                <span class="px-3 py-1 rounded-full text-caption font-bold bg-error-container text-error">Ended</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end space-x-1">
                                <a href="{{ route('admin.events.show', $event->id_event) }}" class="p-2 text-primary hover:bg-primary-fixed rounded transition-colors" title="Detail">
                                    <span class="material-symbols-outlined text-[18px]">visibility</span>
                                </a>

                                <form action="{{ route('admin.events.destroy', $event->id_event) }}" method="POST" class="inline" onsubmit="return confirm('Hapus event ini? Tindakan ini tidak bisa dibatalkan.')">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="p-2 text-error hover:bg-error-container rounded transition-colors" title="Hapus">
                                        <span class="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach

                </tbody>
            </table>
            @endif
        </div>
        
        <!-- Pagination -->
        @if($events->hasPages())
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-between border-t-[0.5px] border-outline-variant pt-4 gap-4">
            <span class="text-caption text-secondary">Menampilkan {{ $events->firstItem() }}-{{ $events->lastItem() }} dari {{ $events->total() }} Event</span>
            <div class="flex space-x-2">
                @if($events->onFirstPage())
                    <button class="p-2 border-[0.5px] border-outline-variant rounded-lg disabled:opacity-30" disabled>
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                @else
                    <a href="{{ $events->previousPageUrl() }}" class="p-2 border-[0.5px] border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                        <span class="material-symbols-outlined">chevron_left</span>
                    </a>
                @endif

                @foreach($events->getUrlRange(1, $events->lastPage()) as $page => $url)
                    @if($page == $events->currentPage())
                        <button class="px-4 py-2 bg-primary-fixed text-primary font-bold rounded-lg text-label-md">{{ $page }}</button>
                    @else
                        <a href="{{ $url }}" class="px-4 py-2 hover:bg-surface-container rounded-lg text-label-md transition-colors">{{ $page }}</a>
                    @endif
                @endforeach

                @if($events->hasMorePages())
                    <a href="{{ $events->nextPageUrl() }}" class="p-2 border-[0.5px] border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </a>
                @else
                    <button class="p-2 border-[0.5px] border-outline-variant rounded-lg disabled:opacity-30" disabled>
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                @endif
            </div>
        </div>
        @endif

    </div>
</main>

<!-- Mobile Bottom Navigation -->
<nav class="fixed bottom-0 w-full z-50 md:hidden bg-surface border-t-[0.5px] border-outline-variant flex justify-around items-center h-16 pb-safe">
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

<!-- Micro-interaction Scripts -->
<script>
    // Search highlight interaction
    const searchInput = document.querySelector('input[type="text"]');
    if(searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('ring-1', 'ring-primary-container');
        });
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('ring-1', 'ring-primary-container');
        });
    }

    // Row interaction simulation removed because buttons need direct interaction
    // We let normal anchors handle navigation.
</script>
</body>
</html>
