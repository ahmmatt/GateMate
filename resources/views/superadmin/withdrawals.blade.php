<!DOCTYPE html>
<html class="light" lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Penarikan Dana | SecureGate Superadmin</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fcf9f8;
        }
        .coral-accent-line {
            height: 3px;
            background-color: #b22110;
            border-radius: 4px 4px 0 0;
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
<body class="bg-surface">
    <!-- SideNavBar -->
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

    <!-- TopAppBar -->
    <header class="flex justify-between items-center h-16 px-container-padding ml-[240px] bg-surface dark:bg-background border-b border-surface-container-high sticky top-0 z-40">
        <div class="flex items-center">
            <h2 class="font-headline-md text-headline-md text-primary dark:text-primary-fixed">Penarikan Dana</h2>
        </div>
        <div class="flex items-center gap-4">
            <button class="p-2 text-secondary hover:text-primary transition-colors scale-95 active:scale-90">
                <span class="material-symbols-outlined">notifications</span>
            </button>
            <button class="p-2 text-secondary hover:text-primary transition-colors scale-95 active:scale-90">
                <span class="material-symbols-outlined">help_outline</span>
            </button>
            <div class="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden border border-surface-container-high">
                <img alt="Superadmin Profile Picture" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDob1GzOzzBJAQz3_l1CX5R_vep7ph5BMEMBKOXSKfoeumHbzFwqDAIzQW0WJ8wbi4zxJFaEw--55jH4xagFwQtnLH_gf949kW90syWeXlyaffhLVvCz8srL6O6kztzXNFjOD9En8oSEes5KvjXL41her8lmRfwv_idIjeATWgAz6HQraAfPLPdwdeNccyux6m6TohzHTn99wEYz3rr6aV4RSgsJ_3g77H72v2MbaBPLlbuzfMwcQquvMK0dIrO8V41m0pstrJ-Gew"/>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="ml-[240px] p-container-padding">
        <div class="max-w-[1200px] mx-auto space-y-gutter">

            @if(session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Berhasil!</strong>
                    <span class="block sm:inline">{{ session('success') }}</span>
                </div>
            @endif

            @if($errors->any())
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">Gagal!</strong>
                    <span class="block sm:inline">{{ $errors->first() }}</span>
                </div>
            @endif

            <!-- Header Text Block -->
            <section>
                <h3 class="font-headline-lg text-headline-lg text-on-surface">Riwayat dan eksekusi pencairan organizer</h3>
                <p class="text-secondary font-body-md text-body-md">Kelola seluruh permintaan penarikan saldo dari mitra organizer event.</p>
            </section>

            <!-- Summary Bento/Hero Card -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div class="md:col-span-2 bg-surface-container-lowest border border-surface-container-high rounded-[14px] p-8 flex flex-col justify-center relative overflow-hidden">
                    <div class="relative z-10">
                        <p class="text-secondary font-label-md text-label-md uppercase tracking-wider mb-2">Total Sudah Dicairkan</p>
                        <h4 class="text-[36px] font-bold text-primary">Rp {{ number_format($totalWithdrawnSuccess, 0, ',', '.') }}</h4>
                    </div>
                    <!-- Subtle background decoration -->
                    <div class="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                        <span class="material-symbols-outlined text-[240px]">payments</span>
                    </div>
                </div>
                <div class="bg-primary text-on-primary rounded-[14px] p-8 flex flex-col justify-between">
                    <div>
                        <p class="font-label-md text-label-md opacity-80 uppercase tracking-wider mb-2">Tertunda (Pending)</p>
                        <h4 class="text-[28px] font-bold">{{ $pendingCount }} Permintaan</h4>
                    </div>
                    <button class="w-full mt-4 bg-white text-primary font-label-md text-label-md py-3 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2" onclick="window.scrollTo({ top: document.getElementById('table-section').offsetTop, behavior: 'smooth' })">
                        Proses Sekarang
                        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            </section>

            <!-- Filters & Tabs -->
            <section class="space-y-stack-md">
                <div class="flex items-center justify-between border-b border-surface-container-high">
                    <div class="flex gap-8">
                        <div class="relative">
                            <button class="pb-3 text-primary font-body-md text-body-md font-medium">Semua Transaksi</button>
                            <div class="absolute bottom-0 left-0 w-full coral-accent-line"></div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Table Section -->
            <section id="table-section" class="bg-surface-container-lowest border border-surface-container-high rounded-[14px] overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-[#F5F5F7] border-b border-surface-container-high">
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary">Nama Organizer</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary">Nama Event</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary text-right">Jumlah Penarikan</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary">Tanggal Pengajuan</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary">Status</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary">Tanggal Eksekusi</th>
                                <th class="px-6 py-4 font-label-md text-label-md text-secondary">Dieksekusi Oleh</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-surface-container-high">
                            @forelse($withdrawals as $withdrawal)
                            <tr class="hover:bg-[#F9F9F9] transition-colors">
                                <td class="px-6 py-4 font-body-md text-body-md text-on-surface">{{ $withdrawal->user->full_name ?? 'Unknown Organizer' }}</td>
                                <td class="px-6 py-4 font-body-md text-body-md text-secondary">{{ optional($withdrawal->user->event)->title ?? 'Global/Unknown Event' }}</td>
                                <td class="px-6 py-4 font-body-md text-body-md text-primary font-bold text-right">Rp {{ number_format($withdrawal->amount, 0, ',', '.') }}</td>
                                <td class="px-6 py-4 font-body-md text-body-md text-secondary">{{ $withdrawal->created_at->format('d M Y') }}</td>
                                <td class="px-6 py-4">
                                    @if($withdrawal->status === 'pending_superadmin')
                                        <div class="flex gap-2">
                                            <button type="button" class="px-3 py-1.5 bg-[#E6F4EA] text-[#008542] rounded-full text-label-sm font-label-sm hover:bg-[#d1ecd7] transition-colors border border-[#008542] btn-withdraw-trigger" 
                                                    data-action="{{ route('superadmin.withdraw.execute', $withdrawal->id) }}" 
                                                    data-org="{{ $withdrawal->user->full_name ?? 'Unknown Organizer' }}" 
                                                    data-event="{{ optional($withdrawal->user->event)->title ?? 'Global/Unknown Event' }}" 
                                                    data-amount="Rp {{ number_format($withdrawal->amount, 0, ',', '.') }}">Setujui</button>
                                            <form action="{{ route('superadmin.withdraw.reject', $withdrawal->id) }}" method="POST" onsubmit="return confirm('Tolak penarikan ini?');">
                                                @csrf
                                                <button type="submit" class="px-3 py-1.5 bg-[#FCE8E8] text-[#D92D20] rounded-full text-label-sm font-label-sm hover:bg-[#fad4d4] transition-colors border border-[#D92D20]">Tolak</button>
                                            </form>
                                        </div>
                                    @elseif($withdrawal->status === 'success')
                                        <span class="px-2.5 py-1 bg-[#E6F4EA] text-[#008542] rounded-full text-label-sm font-label-sm">Selesai</span>
                                    @else
                                        <span class="px-2.5 py-1 bg-[#FCE8E8] text-[#D92D20] rounded-full text-label-sm font-label-sm">Ditolak</span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 font-body-md text-body-md text-secondary">
                                    {{ $withdrawal->status === 'success' || $withdrawal->status === 'failed' ? $withdrawal->updated_at->format('d M Y, H:i') : '-' }}
                                </td>
                                <td class="px-6 py-4">
                                    @if($withdrawal->status === 'success' || $withdrawal->status === 'failed')
                                        <div class="flex items-center gap-2">
                                            <div class="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
                                                <span class="material-symbols-outlined text-[16px] text-secondary">shield_person</span>
                                            </div>
                                            <span class="font-body-md text-body-md text-on-surface">Superadmin</span>
                                        </div>
                                    @else
                                        -
                                    @endif
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="7">
                                    <div class="flex flex-col items-center justify-center py-24 text-center px-6">
                                        <div class="relative mb-6">
                                            <div class="w-24 h-24 bg-[#FFF0EE] rounded-3xl flex items-center justify-center">
                                                <span class="material-symbols-outlined text-primary text-[48px]">inbox</span>
                                            </div>
                                            <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E6F4EA] border-4 border-white rounded-full flex items-center justify-center">
                                                <span class="material-symbols-outlined text-[#008542] text-[20px] font-bold">check</span>
                                            </div>
                                        </div>
                                        <h4 class="text-primary font-medium text-headline-md mb-2">Tidak ada penarikan yang menunggu eksekusi</h4>
                                        <p class="text-secondary font-body-md max-w-sm mx-auto">Semua permintaan pencairan dana dari organizer akan muncul di daftar ini.</p>
                                    </div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="p-6 flex items-center justify-between border-t border-surface-container-high">
                    <p class="font-label-md text-label-md text-secondary">Menampilkan {{ $withdrawals->firstItem() ?? 0 }} sampai {{ $withdrawals->lastItem() ?? 0 }} dari {{ $withdrawals->total() }} transaksi</p>
                    <div class="flex items-center gap-2">
                        @if ($withdrawals->hasPages())
                            {{ $withdrawals->links('pagination::tailwind') }}
                        @endif
                    </div>
                </div>
            </section>

            <!-- Decorative Info Grid -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div class="p-6 rounded-[14px] bg-[#F5F5F7] border border-surface-container-high flex gap-4">
                    <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary border border-surface-container-high">
                        <span class="material-symbols-outlined">security</span>
                    </div>
                    <div>
                        <h5 class="font-headline-md text-headline-md text-on-surface mb-1">Keamanan Verifikasi</h5>
                        <p class="text-secondary font-body-md text-body-md">Setiap penarikan dana di atas Rp 100.000.000 memerlukan verifikasi dua faktor dari Superadmin utama.</p>
                    </div>
                </div>
                <div class="p-6 rounded-[14px] bg-[#F5F5F7] border border-surface-container-high flex gap-4">
                    <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary border border-surface-container-high">
                        <span class="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                        <h5 class="font-headline-md text-headline-md text-on-surface mb-1">SLA Pencairan</h5>
                        <p class="text-secondary font-body-md text-body-md">Permintaan yang diajukan sebelum pukul 14:00 WIB akan diproses pada hari kerja yang sama.</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Modal Backdrop Overlay -->
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] hidden" id="modalOverlay">
        <!-- Confirmation Modal -->
        <div class="bg-white w-full max-w-[520px] rounded-[16px] border-[0.5px] border-surface-container-high p-8 animate-in fade-in zoom-in duration-300" id="withdraw-modal-content">
            <!-- Modal Header -->
            <div class="flex justify-between items-start mb-6">
                <h2 class="font-headline-lg text-headline-lg font-bold text-on-surface">Konfirmasi Eksekusi Penarikan</h2>
                <button type="button" class="text-secondary hover:text-on-surface transition-colors" onclick="closeModal()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <!-- Modal Content -->
            <form id="withdraw-form" action="" method="POST">
                @csrf
                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="font-label-md text-label-md text-secondary mb-1 uppercase tracking-tight">Organizer</p>
                            <p class="font-body-lg text-body-lg font-semibold text-on-surface" id="modal-org-name">-</p>
                        </div>
                        <div>
                            <p class="font-label-md text-label-md text-secondary mb-1 uppercase tracking-tight">Event</p>
                            <p class="font-body-lg text-body-lg font-semibold text-on-surface" id="modal-event-name">-</p>
                        </div>
                    </div>
                    <div class="py-4 border-y border-surface-container-high">
                        <p class="font-label-md text-label-md text-secondary mb-2 uppercase tracking-tight">Nominal Penarikan</p>
                        <p class="font-headline-xl text-[32px] font-bold text-[#F04E37]" id="modal-amount">-</p>
                    </div>
                    <div class="flex gap-3 bg-primary-fixed/30 p-4 rounded-xl items-start">
                        <span class="material-symbols-outlined text-primary mt-0.5">info</span>
                        <p class="font-body-md text-body-md text-on-surface-variant">
                            Pastikan transfer manual ke rekening organizer telah dilakukan sebelum mengkonfirmasi eksekusi ini.
                        </p>
                    </div>
                    <div class="space-y-2">
                        <label class="font-label-md text-label-md text-secondary uppercase tracking-tight" for="transfer_note">Catatan Transfer (opsional)</label>
                        <input class="w-full bg-[#F5F5F7] border-none rounded-[10px] py-3 px-4 font-body-md focus:ring-1 focus:ring-primary focus:bg-white transition-all" name="transfer_note" id="transfer_note" placeholder="Contoh: No. Referensi Bank 88219..." type="text"/>
                    </div>
                </div>
                <!-- Modal Actions -->
                <div class="flex gap-3 mt-10">
                    <button type="button" class="flex-1 py-[10px] px-[22px] border border-[#F04E37] text-[#F04E37] font-body-md font-semibold rounded-[22px] hover:bg-primary-fixed transition-colors" onclick="closeModal()">
                        Batal
                    </button>
                    <button type="submit" class="flex-1 py-[10px] px-[22px] bg-[#F04E37] text-white font-body-md font-semibold rounded-[22px] hover:bg-[#D93B26] transition-all shadow-sm active:scale-95" id="btn-confirm-execute">
                        Konfirmasi Eksekusi
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        const modal = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('withdraw-modal-content');
        
        function closeModal() {
            modalContent.classList.remove('zoom-in');
            modalContent.classList.add('zoom-out', 'fade-out');
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
                
                modalContent.classList.remove('zoom-out', 'fade-out');
                modal.classList.remove('fade-out');
            }, 200);
        }

        document.querySelectorAll('.btn-withdraw-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                const org = e.currentTarget.getAttribute('data-org');
                const eventName = e.currentTarget.getAttribute('data-event');
                const amount = e.currentTarget.getAttribute('data-amount');

                document.getElementById('withdraw-form').action = action;
                document.getElementById('modal-org-name').textContent = org;
                document.getElementById('modal-event-name').textContent = eventName;
                document.getElementById('modal-amount').textContent = amount;

                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.classList.add('overflow-hidden');
            });
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.getElementById('withdraw-form').addEventListener('submit', () => {
            const btn = document.getElementById('btn-confirm-execute');
            btn.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses...</span>';
            btn.classList.add('opacity-80', 'cursor-not-allowed');
        });
    </script>
</body>
</html>
