<!DOCTYPE html>
<html class="light" lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Verifikasi Organizer | SecureGate Superadmin</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fcf9f8;
        }
        .coral-underline {
            position: relative;
        }
        .coral-underline::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #F04E37;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #F5F5F7;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #EBEBEB;
            border-radius: 10px;
        }
    </style>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-high": "#ebe7e7",
                        "error": "#ba1a1a",
                        "on-error": "#ffffff",
                        "secondary": "#5d5e60",
                        "background": "#fcf9f8",
                        "on-error-container": "#93000a",
                        "primary-fixed": "#ffdad4",
                        "on-primary-fixed": "#400200",
                        "on-secondary-fixed-variant": "#454749",
                        "surface-container-highest": "#e5e2e1",
                        "surface-container": "#f0edec",
                        "surface-dim": "#dcd9d9",
                        "on-background": "#1c1b1b",
                        "secondary-fixed-dim": "#c6c6c8",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#616365",
                        "inverse-surface": "#313030",
                        "primary": "#b22110",
                        "primary-fixed-dim": "#ffb4a7",
                        "on-surface": "#1c1b1b",
                        "surface-container-lowest": "#ffffff",
                        "on-secondary": "#ffffff",
                        "surface-bright": "#fcf9f8",
                        "primary-container": "#d63b27",
                        "secondary-fixed": "#e2e2e4",
                        "tertiary": "#5b5c5c",
                        "tertiary-fixed-dim": "#c6c6c7",
                        "on-surface-variant": "#5b403c",
                        "outline": "#8f706a",
                        "tertiary-container": "#737575",
                        "on-tertiary-fixed": "#1a1c1c",
                        "on-secondary-fixed": "#1a1c1d",
                        "on-primary": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "on-tertiary-container": "#fcfcfc",
                        "on-primary-fixed-variant": "#910900",
                        "on-primary-container": "#fffbff",
                        "secondary-container": "#dfdfe1",
                        "surface-variant": "#e5e2e1",
                        "inverse-primary": "#ffb4a7",
                        "tertiary-fixed": "#e2e2e2",
                        "surface-tint": "#b62413",
                        "surface-container-low": "#f6f3f2",
                        "outline-variant": "#e3beb8",
                        "inverse-on-surface": "#f3f0ef",
                        "surface": "#fcf9f8",
                        "on-tertiary-fixed-variant": "#454747"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "container-padding": "24px",
                        "stack-lg": "32px",
                        "stack-md": "16px",
                        "stack-sm": "8px",
                        "gutter": "24px",
                        "sidebar-width": "240px",
                        "content-max-width": "1200px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Inter"],
                        "label-md": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-md": ["Inter"],
                        "headline-xl": ["Inter"],
                        "body-lg": ["Inter"],
                        "label-sm": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg": ["22px", {"lineHeight": "30px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                        "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                        "body-md": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
                        "headline-md": ["18px", {"lineHeight": "26px", "fontWeight": "500"}],
                        "headline-xl": ["28px", {"lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                        "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-w-[1280px]">
    <!-- Sidebar Navigation Shell -->
    <aside class="fixed left-0 top-0 h-full w-[240px] border-r border-surface-container-high bg-surface-container-lowest dark:bg-surface-dim flex flex-col justify-between py-stack-lg z-50">
        <div class="flex flex-col">
            <div class="px-6 mb-10">
                <span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">SecureGate</span>
                <p class="font-label-md text-label-md text-secondary mt-1">Superadmin</p>
            </div>
            <nav class="flex flex-col space-y-1">
                <a href="{{ route('superadmin.dashboard') }}" class="flex items-center gap-3 px-6 py-3 {{ request()->routeIs('superadmin.dashboard') ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' : 'text-secondary hover:text-on-surface hover:bg-surface-container-low active:opacity-80' }} transition-colors duration-200 cursor-pointer">
                    <span class="material-symbols-outlined">dashboard</span>
                    <span class="font-body-md text-body-md">Dashboard</span>
                </a>
                <a href="{{ route('superadmin.organizers') }}" class="flex items-center gap-3 px-6 py-3 {{ request()->routeIs('superadmin.organizers') ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' : 'text-secondary hover:text-on-surface hover:bg-surface-container-low active:opacity-80' }} transition-colors duration-200 cursor-pointer">
                    <span class="material-symbols-outlined">verified_user</span>
                    <span class="font-body-md text-body-md">Verifikasi Organizer</span>
                </a>
                <a href="{{ route('superadmin.withdrawals') }}" class="flex items-center gap-3 px-6 py-3 {{ request()->routeIs('superadmin.withdrawals') || request()->routeIs('superadmin.withdraw.*') ? 'border-l-4 border-primary bg-surface-container text-primary font-medium' : 'text-secondary hover:text-on-surface hover:bg-surface-container-low active:opacity-80' }} transition-colors duration-200 cursor-pointer">
                    <span class="material-symbols-outlined">account_balance_wallet</span>
                    <span class="font-body-md text-body-md">Penarikan Dana</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-6 py-3 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:opacity-80">
                    <span class="material-symbols-outlined">settings</span>
                    <span class="font-body-md text-body-md">Pengaturan</span>
                </a>
            </nav>
        </div>
        <div class="px-6">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="flex items-center gap-3 text-primary w-full py-3 px-4 border border-primary hover:bg-primary/5 transition-colors duration-200 rounded-full font-medium">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="font-body-md text-body-md font-medium">Keluar</span>
                </button>
            </form>
        </div>
    </aside>

    <!-- Header / Top Bar -->
    <header class="flex justify-between items-center h-16 px-container-padding ml-[240px] bg-surface dark:bg-background border-b border-surface-container-high sticky top-0 z-40">
        <div class="flex flex-col">
            <h1 class="font-headline-md text-headline-md text-primary font-bold">Organizer</h1>
        </div>
        <div class="flex items-center gap-6">
            <button class="text-secondary hover:text-primary transition-colors active:scale-90 relative">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button class="text-secondary hover:text-primary transition-colors active:scale-90">
                <span class="material-symbols-outlined">help_outline</span>
            </button>
            <div class="w-8 h-8 rounded-full overflow-hidden border border-surface-container-high">
                <img alt="Superadmin Profile Picture" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJLgqZ7huCwAmO6EbUl11EQYpwf-9GYsonHzQiLLkNQWiCJ9FgTv4oDi89JYqhMRjYFALJdqhpsAjM5QG4ZgPhfqH-J6eTIvPXUhnN6N1TOvAHVUBdP9ST_MW_QFqO1l9voIx3JcdQT0y6tUDGPDCbL_EAO_Bq7ZZ2ZgkTwOMP080DQkjaWusuTdQwjGpK0eeS2VP73KAZ86plT9s1iUPMj96EZmBkoYrlSzO1ADs0hJ7i0alxywjBejYHOLC2_O4LU2inaA8WWnA"/>
            </div>
        </div>
    </header>

    <!-- Main Content Canvas -->
    <main class="ml-[240px] min-h-screen p-container-padding">
        <div class="max-w-[1200px] mx-auto">

            @if(session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong class="font-bold">Berhasil!</strong>
                    <span class="block sm:inline">{{ session('success') }}</span>
                </div>
            @endif

            <!-- Page Identity & Header -->
            <div class="mb-8">
                <h2 class="font-headline-xl text-headline-xl text-on-surface">Verifikasi Organizer</h2>
                <p class="font-body-lg text-body-lg text-secondary">Kelola dan verifikasi penyelenggara platform untuk menjaga keamanan ekosistem.</p>
            </div>

            <!-- Dashboard Controls -->
            <div class="bg-surface-container-lowest border border-surface-container-high rounded-xl mb-6 overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 gap-4">
                    <!-- Tabs -->
                    <div class="flex items-center gap-8 border-b border-surface-container-high md:border-none">
                        <button class="font-label-md text-label-md py-3 text-primary coral-underline font-semibold">Semua Data</button>
                    </div>
                    <!-- Search Bar -->
                    <div class="relative w-full md:w-80">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
                        <input class="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-none rounded-[10px] focus:ring-1 focus:ring-primary text-body-md font-body-md placeholder:text-secondary" placeholder="Cari nama atau organisasi..." type="text"/>
                    </div>
                </div>
            </div>

            <!-- Data Table Card -->
            <div class="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden">
                <div class="overflow-x-auto custom-scrollbar">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#F5F5F7] border-b border-surface-container-high">
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Nama &amp; Organizer</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Kontak</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Media Sosial</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Dokumen</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Tgl Daftar</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-surface-container-high">
                            @forelse($organizers as $org)
                            <tr class="hover:bg-[#F9F9F9] transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                                            <img alt="User Avatar" class="w-full h-full object-cover" src="{{ $org->profile_image ?? 'https://ui-avatars.com/api/?name='.urlencode($org->full_name).'&background=EBE7E7&color=1C1B1B' }}"/>
                                        </div>
                                        <div>
                                            <p class="font-body-md text-body-md font-semibold text-on-surface">{{ $org->full_name }}</p>
                                            <p class="font-label-sm text-label-sm text-secondary">{{ $org->organization_name ?? '-' }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <p class="font-body-md text-body-md text-on-surface">{{ $org->email }}</p>
                                        <p class="font-label-sm text-label-sm text-secondary">{{ $org->phone ?? '-' }}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <span class="material-symbols-outlined text-[18px] text-secondary">alternate_email</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    @if($org->ktp_document)
                                    <button class="flex items-center gap-2 text-primary hover:underline font-label-md text-label-md view-ktp-btn" data-url="{{ asset('storage/' . $org->ktp_document) }}">
                                        <span class="material-symbols-outlined text-[18px]">description</span>
                                        Lihat KTP
                                    </button>
                                    @else
                                    <span class="text-secondary text-label-md">Tidak ada</span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 font-body-md text-body-md text-on-surface">{{ $org->created_at->format('d M Y') }}</td>
                                <td class="px-6 py-4">
                                    @if(!$org->is_verified_organizer)
                                    <span class="px-3 py-1 rounded-[10px] bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm inline-flex items-center gap-1">
                                        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        Menunggu
                                    </span>
                                    @else
                                    <span class="px-3 py-1 rounded-[10px] bg-secondary-container text-on-secondary-container font-label-sm text-label-sm inline-flex items-center gap-1">
                                        <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                        Terverifikasi
                                    </span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 text-right">
                                    @if(!$org->is_verified_organizer)
                                    <div class="flex items-center justify-end gap-2">
                                        <form action="{{ route('superadmin.organizers.approve', $org->id_user) }}" method="POST">
                                            @csrf
                                            <button type="submit" class="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity">Verifikasi</button>
                                        </form>
                                        <button type="button" class="text-error border border-error px-4 py-1.5 rounded-full font-label-md text-label-md hover:bg-error/5 transition-colors btn-reject-trigger" data-action="{{ route('superadmin.organizers.reject', $org->id_user) }}" data-name="{{ $org->full_name }}" data-org="{{ $org->organization_name ?? '-' }}" data-type="reject">Tolak</button>
                                    </div>
                                    @else
                                    <button type="button" class="text-error border border-error/30 bg-transparent px-4 py-1.5 rounded-full font-label-md text-label-md hover:bg-error/5 transition-colors btn-reject-trigger" data-action="{{ route('superadmin.organizers.reject', $org->id_user) }}" data-name="{{ $org->full_name }}" data-org="{{ $org->organization_name ?? '-' }}" data-type="revoke">Cabut Akses</button>
                                    @endif
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="7">
                                    <div class="flex flex-col items-center justify-center py-20 px-6 w-full">
                                        <div class="relative mb-6">
                                            <div class="w-24 h-24 bg-[#FFF0EE] rounded-2xl flex items-center justify-center">
                                                <span class="material-symbols-outlined text-primary text-[48px] opacity-40">how_to_reg</span>
                                            </div>
                                            <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-surface-container-high">
                                                <span class="material-symbols-outlined text-[18px] text-green-600 font-bold">check_circle</span>
                                            </div>
                                        </div>
                                        <h3 class="font-headline-md text-headline-md text-primary font-medium mb-2 text-center">Tidak ada organizer yang menunggu verifikasi</h3>
                                        <p class="font-body-md text-body-md text-secondary text-center max-w-sm">Semua pengajuan baru akan muncul di sini untuk Anda tinjau.</p>
                                    </div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="px-6 py-4 bg-[#FFFFFF] border-t border-surface-container-high flex items-center justify-between">
                    <p class="font-label-sm text-label-sm text-secondary">Menampilkan {{ $organizers->firstItem() ?? 0 }} sampai {{ $organizers->lastItem() ?? 0 }} dari {{ $organizers->total() }} organizer</p>
                    <div class="flex items-center gap-2">
                        @if ($organizers->hasPages())
                            {{ $organizers->links('pagination::tailwind') }}
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Modal Background (Hidden by default) -->
    <div class="fixed inset-0 bg-black/50 z-[100] hidden items-center justify-center p-6" id="ktp-modal">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
            <button class="absolute top-4 right-4 text-secondary hover:text-on-surface" onclick="toggleModal('ktp-modal')">
                <span class="material-symbols-outlined">close</span>
            </button>
            <h3 class="font-headline-md text-headline-md mb-6">Verifikasi Dokumen KTP</h3>
            <div class="aspect-[1.6/1] bg-surface-container rounded-xl overflow-hidden mb-6 border border-surface-container-high">
                <img id="ktp-preview-image" class="w-full h-full object-contain" alt="KTP Document" src=""/>
            </div>
            <div class="flex justify-end gap-3">
                <button class="px-6 py-2 border border-surface-container-high rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors" onclick="toggleModal('ktp-modal')">Tutup</button>
            </div>
        </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 hidden items-center justify-center p-6" id="modal-backdrop">
        <!-- Confirmation Modal -->
        <div class="bg-white w-full max-w-[440px] rounded-[16px] overflow-hidden border border-surface-container-high animate-in fade-in zoom-in duration-300" id="rejection-modal">
            <!-- Modal Header -->
            <div class="px-8 pt-8 pb-4 text-center">
                <div class="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-error text-[32px]">warning</span>
                </div>
                <h3 class="font-headline-lg text-headline-lg text-on-surface mb-2" id="rejection-modal-title">Konfirmasi Penolakan</h3>
                <p class="text-secondary font-body-md" id="rejection-modal-text">Apakah Anda yakin ingin menolak pengajuan verifikasi organizer ini?</p>
            </div>
            <!-- Modal Body (Identity Card) -->
            <div class="px-8 pb-6">
                <div class="bg-[#F5F5F7] rounded-[12px] p-4 flex flex-col gap-2 border-[0.5px] border-surface-container-high">
                    <div class="flex justify-between items-center">
                        <span class="text-secondary font-label-sm">Organizer</span>
                        <span class="font-body-md font-semibold text-on-surface" id="reject-org-name">Budi Santoso</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-secondary font-label-sm">Organisasi</span>
                        <span class="font-body-md font-semibold text-on-surface" id="reject-org-orgname">Sporta Indonesia</span>
                    </div>
                </div>
                <!-- Warning Box -->
                <div class="mt-4 bg-[#FEF2F2] border-[0.5px] border-[#FEE2E2] p-4 rounded-[12px] flex gap-3">
                    <span class="material-symbols-outlined text-[#EF4444] text-[20px]">info</span>
                    <p class="text-[#EF4444] font-body-md leading-relaxed text-[13px]">
                        Tindakan ini akan menghapus akun dan seluruh data pengajuan organizer ini secara permanen.
                    </p>
                </div>
            </div>
            <!-- Modal Footer -->
            <form id="reject-form" action="" method="POST" class="px-8 pb-8 flex flex-col gap-3">
                @csrf
                <button type="submit" class="w-full bg-[#EF4444] text-white py-3 px-6 rounded-full font-headline-md hover:bg-[#DC2626] transition-all duration-200 active:scale-[0.98]" id="btn-reject">
                    Ya, Tolak &amp; Hapus
                </button>
                <button type="button" class="w-full bg-transparent border border-surface-container-high text-secondary py-3 px-6 rounded-full font-headline-md hover:bg-[#F9F9F9] transition-all duration-200 active:scale-[0.98]" id="btn-cancel">
                    Batal
                </button>
            </form>
        </div>
    </div>

    <script>
        // KTP Modal script
        function toggleModal(id, imgUrl = null) {
            const modal = document.getElementById(id);
            if (imgUrl) {
                document.getElementById('ktp-preview-image').src = imgUrl;
            }
            if (modal.classList.contains('hidden')) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            } else {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }

        document.querySelectorAll('.view-ktp-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const imgUrl = e.currentTarget.getAttribute('data-url');
                toggleModal('ktp-modal', imgUrl);
            });
        });

        // Rejection Modal script
        const rejectModal = document.getElementById('rejection-modal');
        const rejectBackdrop = document.getElementById('modal-backdrop');
        const btnCancel = document.getElementById('btn-cancel');
        const rejectForm = document.getElementById('reject-form');
        const rejectOrgName = document.getElementById('reject-org-name');
        const rejectOrgOrgname = document.getElementById('reject-org-orgname');
        const rejectModalText = document.getElementById('rejection-modal-text');
        const btnReject = document.getElementById('btn-reject');

        function closeRejectModal() {
            rejectModal.classList.remove('zoom-in');
            rejectModal.classList.add('zoom-out', 'fade-out');
            rejectBackdrop.classList.add('fade-out');
            setTimeout(() => {
                rejectBackdrop.classList.add('hidden');
                rejectBackdrop.classList.remove('flex');
                rejectModal.classList.remove('zoom-out', 'fade-out');
                rejectBackdrop.classList.remove('fade-out');
            }, 300);
        }

        document.querySelectorAll('.btn-reject-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                const name = e.currentTarget.getAttribute('data-name');
                const org = e.currentTarget.getAttribute('data-org');
                const type = e.currentTarget.getAttribute('data-type');

                rejectForm.action = action;
                rejectOrgName.textContent = name;
                rejectOrgOrgname.textContent = org;
                
                const titleElement = document.getElementById('rejection-modal-title');
                
                if(type === 'revoke') {
                    titleElement.textContent = 'Cabut Akses Organizer';
                    rejectModalText.textContent = 'Apakah Anda yakin ingin mencabut status verifikasi dan seluruh akses organizer ini?';
                    btnReject.innerHTML = 'Ya, Cabut Akses';
                } else {
                    titleElement.textContent = 'Konfirmasi Penolakan';
                    rejectModalText.textContent = 'Apakah Anda yakin ingin menolak pengajuan verifikasi organizer ini?';
                    btnReject.innerHTML = 'Ya, Tolak & Hapus';
                }

                rejectBackdrop.classList.remove('hidden');
                rejectBackdrop.classList.add('flex');
            });
        });

        btnCancel.addEventListener('click', closeRejectModal);
        
        rejectBackdrop.addEventListener('click', (e) => {
            if (e.target === rejectBackdrop) closeRejectModal();
        });

        rejectForm.addEventListener('submit', () => {
            btnReject.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses...</span>';
        });
    </script>
</body>
</html>
