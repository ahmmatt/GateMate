@extends('layouts.app')

@section('styles')
<style>
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .pill-radius { border-radius: 22px; }
    .card-radius { border-radius: 14px; }
    .input-radius { border-radius: 10px; }
    
    /* Custom scrollbar for a cleaner utilitarian look */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #EBEBEB; border-radius: 10px; }
    
    /* Fallback colors just in case they are not in global tailwind.config */
    .bg-coral-red { background-color: #F04E37 !important; }
    .text-coral-red { color: #F04E37 !important; }
    .hover\:border-coral-red\/30:hover { border-color: rgba(240, 78, 55, 0.3) !important; }
    .bg-coral-light { background-color: #FFF0EE !important; }
    .text-coral-dark { color: #B83020 !important; }
    .border-divider { border-color: #EBEBEB !important; }
    .bg-surface-f5 { background-color: #F5F5F7 !important; }
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
@endsection

@section('content')
<main class="pt-16 pb-20">
    <!-- Hero Section: Full-width Poster (16:9) -->
    <section class="w-full relative aspect-video md:aspect-[21/9] lg:aspect-[3/1] bg-surface-variant overflow-hidden">
        @php
        $bannerSrc = (!empty($event->banner_image) && $event->banner_image !== 'default-banner.jpg')
            ? asset('Media/uploads/' . $event->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
        @endphp
        <img class="w-full h-full object-cover" alt="Banner {{ $event->title }}" src="{{ $bannerSrc }}">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
    
    <div class="max-w-[1280px] mx-auto px-container-padding mt-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gap-default">
            
            <!-- Left Column: Main Info & Details -->
            <div class="lg:col-span-8 flex flex-col gap-gap-default">
                
                <!-- Header Info -->
                <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <span class="bg-coral-light text-coral-dark px-3 py-1 rounded-[10px] font-label-md text-[11px] uppercase tracking-wider">{{ $event->category }}</span>
                    </div>
                    <h1 class="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{{ $event->title }}</h1>
                    <div class="flex flex-wrap items-center gap-6 text-on-surface-variant py-2">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-[20px]" data-icon="calendar_today">calendar_today</span>
                            <span class="font-body-md text-body-md">{{ \Carbon\Carbon::parse($event->start_date)->translatedFormat('d M Y') }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-[20px]" data-icon="location_on">location_on</span>
                            <span class="font-body-md text-body-md">{{ $event->venue_name ?? $event->city ?? 'Lokasi Online' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-[20px]" data-icon="schedule">schedule</span>
                            <span class="font-body-md text-body-md">{{ \Carbon\Carbon::createFromFormat('H:i:s', $event->start_time)->format('H:i') }} - Selesai WIB</span>
                        </div>
                    </div>
                    <p class="font-body-md text-on-surface-variant">Oleh: {{ $event->admin->organization_name ?? $event->admin->full_name }}</p>
                </div>
                
                <!-- Description -->
                <div class="bg-surface-container-lowest border border-divider card-radius p-6 flex flex-col gap-4">
                    <h2 class="font-headline-sm text-headline-sm text-on-surface">Tentang Event</h2>
                    <div class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                        <p style="white-space: pre-wrap;">{{ $event->description ?: 'Tidak ada deskripsi yang tersedia.' }}</p>
                    </div>
                </div>
                
                <!-- Map Section -->
                <div class="flex flex-col gap-4">
                    <h2 class="font-headline-sm text-headline-sm text-on-surface px-1">Lokasi</h2>
                    
                    @if($event->maps_link)
                        @php
                            $embedUrl = $event->maps_link;
                            $isEmbed = false;
                            if(strpos($embedUrl, '<iframe') !== false) {
                                preg_match('/src="([^"]+)"/', $embedUrl, $matches);
                                if(isset($matches[1])) {
                                    $embedUrl = $matches[1];
                                    $isEmbed = true;
                                }
                            } elseif (strpos($embedUrl, '/embed/') !== false) {
                                $isEmbed = true;
                            }
                        @endphp
                        
                        @if($isEmbed)
                            <div class="w-full h-64 bg-surface-f5 border border-divider rounded-[14px] overflow-hidden group relative">
                                <iframe 
                                    src="{{ $embedUrl }}" 
                                    width="100%" 
                                    height="100%" 
                                    style="border:0;" 
                                    allowfullscreen="" 
                                    loading="lazy" 
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                                <a href="{{ $event->maps_link }}" target="_blank" class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 card-radius border border-divider flex items-center gap-2 hover:bg-white transition-colors cursor-pointer" style="text-decoration:none;">
                                    <span class="material-symbols-outlined text-coral-red" data-icon="directions" data-weight="fill" style="font-variation-settings: 'FILL' 1;">directions</span>
                                    <span class="font-label-md text-label-md text-on-surface">Buka di Maps</span>
                                </a>
                            </div>
                        @else
                            <div class="w-full h-64 bg-surface-f5 border border-divider rounded-[14px] overflow-hidden group relative cursor-pointer flex flex-col items-center justify-center text-on-surface-variant">
                                <span class="material-symbols-outlined mb-2 text-coral-red" style="font-size: 40px;">location_on</span>
                                <p class="font-body-md">Peta tidak dapat ditampilkan langsung.</p>
                                <a href="{{ $event->maps_link }}" target="_blank" class="mt-4 bg-white/90 backdrop-blur-md px-4 py-2 card-radius border border-divider flex items-center gap-2 hover:bg-white transition-colors" style="text-decoration:none;">
                                    <span class="material-symbols-outlined text-coral-red" data-icon="directions" data-weight="fill" style="font-variation-settings: 'FILL' 1;">directions</span>
                                    <span class="font-label-md text-label-md text-on-surface">Buka di Maps</span>
                                </a>
                            </div>
                        @endif
                    @else
                        <div class="w-full h-64 bg-surface-f5 border border-divider rounded-[14px] overflow-hidden group relative flex flex-col items-center justify-center text-on-surface-variant">
                            <span class="material-symbols-outlined mb-2 opacity-50" style="font-size: 40px;">map</span>
                            <p class="font-body-md">Penyelenggara belum melampirkan tautan peta.</p>
                        </div>
                    @endif
                    
                    <p class="text-on-surface-variant font-body-md text-body-md px-1">{{ $event->location_details ?: 'Lokasi lengkap tidak tersedia.' }}</p>
                </div>
                
            </div>
            
            <!-- Right Column: Ticket Tiers -->
            <div class="lg:col-span-4">
                <div class="sticky top-24 flex flex-col gap-gap-tight">
                    <h2 class="font-headline-sm text-headline-sm text-on-surface px-1">Pilih Tiket</h2>
                    
                    {{-- ── UI Logger: Debug Panel Visual ── --}}
                    <div id="ui-logger" style="background: #1e1e1e; color: #4ade80; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; border: 1px solid #333; line-height: 1.6; display:none;">[Sistem Siap] Menunggu interaksi...</div>

                    @if($event->ticketTiers->isEmpty())
                        <div class="bg-white border border-divider card-radius p-card-padding flex flex-col gap-3 items-center justify-center text-center py-10">
                            <span class="material-symbols-outlined text-secondary text-4xl mb-2">confirmation_number</span>
                            <h3 class="font-headline-sm text-on-surface">Tiket Belum Tersedia</h3>
                            <p class="font-caption text-on-surface-variant">Belum ada tiket untuk event ini.</p>
                        </div>
                    @else
                        @auth
                            @foreach($event->ticketTiers as $tier)
                                <div class="bg-white border border-divider card-radius p-card-padding flex flex-col gap-3 transition-all hover:border-coral-red/30">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="font-headline-sm text-headline-sm text-on-surface">{{ $tier->tier_name }}</h3>
                                            <p class="font-caption text-caption text-on-surface-variant">Akses event khusus</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between mt-2">
                                        <span class="font-headline-md text-headline-md text-on-surface">Rp {{ number_format($tier->price, 0, ',', '.') }}</span>
                                        <a href="javascript:void(0)" class="bg-coral-red text-white px-6 py-2 pill-radius font-label-md text-label-md hover:bg-opacity-90 active:scale-95 transition-all text-center" 
                                           onclick="document.getElementById('checkout-modal-{{ $tier->id_tier ?? $tier->id }}').classList.remove('hidden'); return false;" style="text-decoration:none;">Beli Tiket</a>
                                    </div>
                                
                                <!-- Modal Popup Checkout untuk Tier ini -->
                                <div id="checkout-modal-{{ $tier->id_tier ?? $tier->id }}" class="fixed inset-0 z-50 flex items-center justify-center p-4 hidden">
                                    <div class="modal-overlay absolute inset-0 bg-[#fff8f6]/80 backdrop-blur-md" onclick="this.closest('.fixed').classList.add('hidden')"></div>
                                    <div class="relative bg-white border border-outline-variant rounded-[14px] shadow-2xl w-full max-w-[520px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                                        <!-- Modal Header -->
                                        <div class="px-6 py-5 border-b border-outline-variant flex justify-between items-center bg-white">
                                            <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Konfirmasi Pembelian</h2>
                                            <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors" onclick="this.closest('.fixed').classList.add('hidden')">close</button>
                                        </div>
                                        
                                        <form action="{{ route('checkout.process') }}" method="POST" onsubmit="processCheckout(event, this)">
                                            @csrf
                                            <input type="hidden" name="event_id" value="{{ $event->id_event ?? $event->id }}">
                                            <input type="hidden" name="tier_id" value="{{ $tier->id_tier ?? $tier->id }}">
                                            
                                            <!-- Modal Content -->
                                            <div class="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                                                <!-- Selected Ticket -->
                                                <div class="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex justify-between items-center">
                                                    <div>
                                                        <p class="text-caption font-medium text-primary mb-1">Tiket Terpilih</p>
                                                        <h4 class="font-headline-sm text-headline-sm text-on-surface">{{ $tier->tier_name }}</h4>
                                                    </div>
                                                    <p class="font-headline-sm text-headline-sm text-primary font-bold">Rp {{ number_format($tier->price, 0, ',', '.') }}</p>
                                                </div>
                                                
                                                <!-- Additional Questions Section -->
                                                @if($event->customQuestions && $event->customQuestions->count() > 0)
                                                    <div class="space-y-4">
                                                        <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Informasi Tambahan</h3>
                                                        @foreach($event->customQuestions as $question)
                                                            <div class="space-y-2">
                                                                <label class="font-label-md text-label-md text-on-surface-variant">{{ $question->question_text }}</label>
                                                                <textarea name="answers[{{ $question->id_question }}]" class="w-full bg-surface-f5 border border-divider rounded-[10px] p-3 text-body-md font-body-md focus:ring-1 focus:ring-coral-red focus:border-coral-red outline-none transition-all resize-none h-24" placeholder="Tuliskan jawaban Anda di sini..." required></textarea>
                                                            </div>
                                                        @endforeach
                                                    </div>
                                                @endif
                                                
                                                <!-- Payment Summary -->
                                                <div class="pt-4 border-t border-outline-variant">
                                                    <div class="flex justify-between items-center mb-1">
                                                        <span class="text-body-md font-body-md text-secondary">Total Tagihan</span>
                                                        <span class="text-headline-md font-headline-md text-primary font-extrabold">Rp {{ number_format($tier->price, 0, ',', '.') }}</span>
                                                    </div>
                                                    <p class="text-caption font-caption text-secondary">Termasuk pajak dan biaya layanan.</p>
                                                </div>
                                            </div>
                                            
                                            <!-- Modal Footer Actions -->
                                            <div class="px-6 py-5 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row gap-3">
                                                <button type="submit" class="flex-1 bg-coral-red text-white font-body-md text-body-md font-bold py-3 px-6 rounded-full hover:opacity-90 active:opacity-80 transition-all">
                                                    Lanjutkan ke Pembayaran
                                                </button>
                                                <button type="button" class="sm:w-32 border border-coral-red text-coral-red font-body-md text-body-md font-bold py-3 px-6 rounded-full hover:bg-coral-red/10 active:opacity-80 transition-all" onclick="this.closest('.fixed').classList.add('hidden')">
                                                    Batal
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        @endforeach
                        @else
                            <div class="bg-white border border-divider card-radius p-card-padding flex flex-col gap-3 items-center text-center py-8">
                                <span class="material-symbols-outlined text-secondary text-4xl mb-2">lock</span>
                                <h3 class="font-headline-sm text-on-surface">Login untuk membeli tiket</h3>
                                <a href="{{ route('signin') }}" class="mt-2 bg-coral-red text-white px-6 py-2 pill-radius font-label-md text-label-md hover:bg-opacity-90 active:scale-95 transition-all" style="text-decoration:none;">Masuk Sekarang</a>
                            </div>
                        @endauth
                    @endif
                    
                    <!-- Info Card -->
                    <div class="mt-4 p-4 rounded-xl bg-surface-container border border-outline-variant flex gap-3">
                        <span class="material-symbols-outlined text-primary" data-icon="info">info</span>
                        <p class="font-caption text-caption text-on-surface-variant">
                            Tiket bersifat digital dan akan langsung terbit di menu "My Tickets" setelah pembayaran diverifikasi secara otomatis.
                        </p>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </div>
</main>
@endsection


@section('scripts')
<script>
    // Simple Hover Effect Script from User HTML
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    /**
     * Intercept form submission to process checkout via AJAX
     */
    async function processCheckout(event, form) {
        event.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const oriHTML = submitBtn.innerHTML;
        
        // Change button state
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';

        // Show loading
        Swal.fire({
            title: 'Memproses Pembayaran...',
            text: 'Harap tunggu, saldo Anda sedang diproses.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const formData = new FormData(form);
            const dataObj = Object.fromEntries(formData.entries());
            
            const res = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(dataObj)
            });

            const data = await res.json();

            // KYC Face Verification Blocker
            if (data.status === 'needs_verification') {
                Swal.close();
                window.location.href = data.redirect_url;
                return;
            }

            // Checkout Success
            if (data.status === 'success') {
                await Swal.fire({
                    title: 'Pembelian Berhasil! 🎉',
                    html: `<p style="color:#374151">${data.message}</p>
                           <p style="font-size:.85rem;color:#6b7280;margin-top:8px">E-Ticket telah dikirim ke email Anda.</p>`,
                    icon: 'success',
                    confirmButtonText: 'Lihat Tiket Saya →',
                    confirmButtonColor: '#F04E37',
                    allowOutsideClick: false,
                });
                window.location.href = data.redirect_url;
                return;
            }

            // Insufficient Balance
            if (data.status === 'insufficient_balance') {
                const balFmt = new Intl.NumberFormat('id-ID').format(data.current_balance || 0);
                const reqFmt = new Intl.NumberFormat('id-ID').format(data.required_amount || 0);
                const balResult = await Swal.fire({
                    title: 'Saldo Tidak Cukup! 💸',
                    html: `
                        <div style="text-align:center;padding:4px 0">
                            <p style="color:#374151;margin-bottom:16px">Uang di wallet Anda tidak cukup untuk membeli tiket ini.</p>
                            <div style="display:flex;justify-content:center;gap:24px;margin-bottom:16px">
                                <div style="text-align:center">
                                    <div style="font-size:.75rem;color:#94a3b8;text-transform:uppercase;margin-bottom:4px">Saldo Anda</div>
                                    <div style="font-size:1.1rem;font-weight:700;color:#ef4444">Rp ${balFmt}</div>
                                </div>
                                <div style="text-align:center">
                                    <div style="font-size:.75rem;color:#94a3b8;text-transform:uppercase;margin-bottom:4px">Harga Tiket</div>
                                    <div style="font-size:1.1rem;font-weight:700;color:#6366f1">Rp ${reqFmt}</div>
                                </div>
                            </div>
                            <p style="font-size:.85rem;color:#94a3b8">Silakan Top Up wallet Anda terlebih dahulu.</p>
                        </div>
                    `,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '💳 Top Up Sekarang',
                    cancelButtonText: 'Nanti Saja',
                    confirmButtonColor: '#F04E37',
                    cancelButtonColor: '#94a3b8',
                });
                if (balResult.isConfirmed) {
                    window.location.href = '{{ route("wallet.index") }}';
                }
                return;
            }

            // Ticket Sold Out
            if (data.status === 'error' && data.message && data.message.includes('habis')) {
                Swal.fire({
                    title: 'Tiket Habis!',
                    text: data.message,
                    icon: 'error',
                    confirmButtonColor: '#F04E37',
                });
                return;
            }

            // General Error
            Swal.fire({
                title: 'Terjadi Kesalahan',
                text: data.message || 'Gagal memproses pembelian. Coba lagi.',
                icon: 'error',
                confirmButtonColor: '#F04E37',
            });

        } catch(err) {
            console.error(err);
            Swal.fire({
                title: 'Koneksi Terputus',
                text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
                icon: 'error',
                confirmButtonColor: '#F04E37',
            });
        } finally {
            submitBtn.innerHTML = oriHTML;
            submitBtn.disabled = false;
            submitBtn.style.pointerEvents = 'auto';
        }
    }
</script>
@endsection
