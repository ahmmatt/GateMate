

<?php $__env->startSection('title', 'SecureGate | E-Ticket'); ?>

<?php $__env->startSection('styles'); ?>
<style>
    .qr-pattern {
        background-image: radial-gradient(#271815 1px, transparent 0);
        background-size: 12px 12px;
    }
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
    }
    @keyframes pulse-soft {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    .animate-pulse-soft {
        animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
<div class="py-8 w-full">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Side: Ticket QR Section -->
            <div class="lg:col-span-7 flex flex-col gap-6">
                <!-- Event Header -->
                <div class="flex flex-col gap-1">
                    <h1 class="font-headline-lg text-headline-lg md:text-headline-lg font-bold tracking-tight"><?php echo e($transaction->event->title ?? 'Unknown Event'); ?></h1>
                    <div class="flex items-center gap-4 text-secondary mt-1">
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">calendar_today</span>
                            <span class="font-body-md text-body-md">
                                <?php echo e(\Carbon\Carbon::parse($transaction->event->start_date)->translatedFormat('d M Y')); ?>

                            </span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">location_on</span>
                            <span class="font-body-md text-body-md">
                                <?php if($transaction->event->location_type === 'online'): ?>
                                    Virtual Meeting (Online)
                                <?php else: ?>
                                    <?php echo e(!empty($transaction->event->venue_name) ? $transaction->event->venue_name . ', ' : ''); ?>

                                    <?php echo e($transaction->event->city ?? ''); ?>

                                <?php endif; ?>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- QR Ticket Card -->
                <div class="bg-white border border-[#EBEBEB] rounded-[14px] p-8 flex flex-col items-center gap-6 shadow-sm relative">
                    <!-- QR Placeholder -->
                    <div class="w-64 h-64 bg-white border-2 border-on-surface p-4 flex items-center justify-center relative">
                        <div class="w-full h-full relative flex items-center justify-center">
                            <!-- Injected QR Rendering Logic -->
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=<?php echo e(urlencode($transaction->order_id)); ?>&color=000000&bgcolor=ffffff" 
                                 alt="QR Code" 
                                 class="w-full h-full object-contain relative z-10" style="padding: 0.25rem;">
                            <div class="absolute inset-0 opacity-10 qr-pattern"></div>
                        </div>
                        
                        <!-- Decorative corners -->
                        <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                        <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                        <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                    </div>
                    
                    <div class="text-center flex flex-col gap-2">
                        <p class="font-label-md text-label-md text-secondary tracking-widest uppercase">TICKET ID</p>
                        <p class="font-headline-sm text-headline-sm font-bold tracking-wider"><?php echo e($transaction->order_id); ?></p>
                    </div>

                    <!-- Details Section -->
                    <div class="w-full border-t border-[#EBEBEB] pt-6 grid grid-cols-2 gap-y-5 gap-x-4">
                        <div class="flex flex-col gap-1">
                            <p class="font-caption text-caption text-secondary">Attendee</p>
                            <p class="font-body-md text-body-md font-medium"><?php echo e($transaction->user->full_name ?? 'Peserta'); ?></p>
                        </div>
                        <div class="flex flex-col gap-1 text-right">
                            <p class="font-caption text-caption text-secondary">Tier</p>
                            <div class="flex justify-end">
                                <span class="bg-[#FFF0EE] text-[#B83020] px-3 py-0.5 rounded-[10px] font-label-md text-label-md">
                                    <?php echo e($transaction->ticketTier->tier_name ?? '-'); ?>

                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="font-caption text-caption text-secondary">Start Time</p>
                            <p class="font-body-md text-body-md font-medium"><?php echo e(\Carbon\Carbon::parse($transaction->event->start_time)->format('H:i')); ?></p>
                        </div>
                        <div class="flex flex-col gap-1 text-right">
                            <p class="font-caption text-caption text-secondary">End Time</p>
                            <p class="font-body-md text-body-md font-medium"><?php echo e(\Carbon\Carbon::parse($transaction->event->end_time)->format('H:i')); ?></p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="font-caption text-caption text-secondary">Seat/Section</p>
                            <p class="font-body-md text-body-md font-medium">Free Seating</p>
                        </div>
                        <div class="flex flex-col gap-1 text-right">
                            <p class="font-caption text-caption text-secondary">Status</p>
                            <div class="flex items-center justify-end gap-1.5 text-tertiary">
                                <span class="material-symbols-outlined text-[16px]">check_circle</span>
                                <span class="font-body-md text-body-md font-medium">Active</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 flex items-center gap-2 text-on-surface-variant bg-surface-container px-4 py-3 rounded-xl w-full justify-center">
                        <span class="material-symbols-outlined text-sm">info</span>
                        <p class="font-body-md text-body-md">Tunjukkan QR ini ke panitia di pintu masuk</p>
                    </div>
                </div>
            </div>

            <!-- Right Side: Networking Hub Section -->
            <div class="lg:col-span-5 flex flex-col gap-6">
                <div class="flex items-center justify-between">
                    <h2 class="font-headline-md text-headline-md font-bold">Networking Hub</h2>
                    <span class="bg-primary text-on-primary px-2 py-0.5 rounded-full font-label-md text-[10px]">STAGE 5</span>
                </div>

                <!-- AI Vibe Bio Setup Card -->
                <div class="bg-white border border-[#EBEBEB] rounded-[14px] p-card-padding flex flex-col gap-4">
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                            <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                        </div>
                        <div class="flex flex-col">
                            <h3 class="font-headline-sm text-headline-sm font-bold">AI Vibe Bio Setup</h3>
                            <p class="font-body-md text-body-md text-secondary">Let AI craft your professional networking persona.</p>
                        </div>
                    </div>
                    <button class="w-full py-[10px] px-[22px] rounded-full font-body-md font-medium transition-all flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-90 cursor-pointer" onclick="openVibeModal()">
                        Isi Vibe Bio
                    </button>
                </div>

                <!-- AI Matchmaking Card -->
                <div class="bg-[#FFF0EE] border border-outline-variant rounded-[14px] p-card-padding flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <h3 class="font-headline-sm text-headline-sm font-bold text-[#B83020]">AI Matchmaking</h3>
                        <p class="font-body-md text-body-md text-on-surface-variant">We've found potential partners for your industry.</p>
                    </div>
                    <?php
                        $hasVibeBio = !empty($myAttendee) && !empty($myAttendee->vibe_bio);
                    ?>
                    <button class="w-full border py-[10px] px-[22px] rounded-full font-body-md font-medium transition-all <?php echo e($hasVibeBio ? 'border-primary text-primary hover:bg-primary hover:text-white' : 'border-outline-variant text-outline bg-surface-container-lowest cursor-not-allowed'); ?>" 
                            <?php if($hasVibeBio): ?> onclick="openMatchmakingModal()" <?php else: ?> disabled title="Silakan isi Vibe Bio terlebih dahulu" <?php endif; ?>>
                        Mulai Pencocokan AI
                    </button>
                </div>

                <!-- Daftar Peserta Preview (Static Preview from Code 1) -->
                <div class="flex flex-col gap-4">
                    <h3 class="font-label-md text-label-md text-secondary tracking-widest uppercase">Daftar Peserta Preview</h3>
                    <div class="flex flex-col gap-2">
                        <!-- Attendee 1 -->
                        <div class="bg-white border border-[#EBEBEB] rounded-[14px] p-3 flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <img alt="Attendee" class="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuy8Mgb-y-2mtPSKihZW4SLUn5uTCNkS9AqjYy8L0ViUnjWGb_9Oq4_RGaxVTRjGYNpuCb2tktQm_yjhb1Vai5SjGuCRlgJzP8O6v9AF_AL13KZW50X3N2Hf5_nVCekYWkaAzFpPegFbYDWORkn4NwdJ-U91oyflGrxiJ2dzBfd8m0x0arQ422gCCy-MpytgKQU-tsvNCc9bhNxyp5Z78IRB4YqzUlKQriu6PxTvf7AJCr0PySPRCBH7nceXcWS-vZYywRx4R4yCs">
                                <div class="flex flex-col">
                                    <p class="font-body-md text-body-md font-bold">Sarah Chen</p>
                                    <p class="font-caption text-caption text-secondary">Lead AI Architect at NeuraLink</p>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                        </div>
                        <!-- Attendee 2 -->
                        <div class="bg-white border border-[#EBEBEB] rounded-[14px] p-3 flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <img alt="Attendee" class="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDisOJq7N40c_etBWMPgGndDVCM5kvPWQ7EVTmPQ8hnsw3C2HvZZOC_l_nraVXCh6uH-iTLKG9fZjLhEIYFDCRuF3_e98nai0EUHOrc1m-CwRJzq6XrT_hDy8gKhsNjf0q_qGS17AdS9fmRyGcfR_4HhaW3RJu2GvxBASd32243LLeCVNRAFd7ufv1r-Mq8KBUciNjuGQIMV9wQQAdJfLNMGVSWkaC1Pyunv4-RHEUlrfjR-aon2Ql0Vn3d6xIZBZry87uDX5cRUJ0">
                                <div class="flex flex-col">
                                    <p class="font-body-md text-body-md font-bold">Marcus Thorne</p>
                                    <p class="font-caption text-caption text-secondary">Venture Partner, Peak Capital</p>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">chevron_right</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- AI MATCHMAKING OVERLAY (KODE 2)          -->
    <!-- ========================================== -->
    <div id="matchmakingModal" class="fixed inset-0 z-50 hidden items-center justify-center p-6 bg-black/10 backdrop-blur-[2px]">
        <!-- Glassmorphic Modal -->
        <div class="w-full max-w-md bg-white/90 backdrop-blur-[16px] border border-white/50 rounded-[22px] shadow-xl overflow-hidden">
            <div class="p-8 flex flex-col items-center text-center relative z-10">
                <!-- Headline -->
                <h3 class="font-headline-md text-headline-md mb-8 text-on-surface">Mencari Partner Networking...</h3>
                
                <!-- Dynamic Loading Ring -->
                <div class="relative w-32 h-32 mb-10 flex items-center justify-center">
                    <!-- Outer Ring -->
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="45" stroke="#FFF0EE" stroke-width="6"></circle>
                        <circle class="animate-spin-slow" cx="50" cy="50" fill="none" r="45" stroke="#F04E37" stroke-dasharray="283" stroke-dashoffset="100" stroke-width="6"></circle>
                    </svg>
                    <!-- Inner Icon -->
                    <div class="bg-surface-container-low rounded-full w-20 h-20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[40px] text-primary animate-pulse-soft" style="font-variation-settings: 'FILL' 1;">psychology</span>
                    </div>
                </div>

                <!-- Status Messages -->
                <div class="w-full space-y-3 mb-10">
                    <div class="flex items-center gap-3 bg-surface-container/50 px-4 py-3 rounded-[14px] border border-outline-variant/30">
                        <span class="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span class="text-body-md text-on-surface">Analyzing interests...</span>
                    </div>
                    <div class="flex items-center gap-3 bg-surface-container/50 px-4 py-3 rounded-[14px] border border-outline-variant/30">
                        <div class="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <span class="text-body-md text-on-surface">Scanning attendee pool...</span>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-3 opacity-40">
                        <span class="material-symbols-outlined text-secondary text-[20px]">radio_button_unchecked</span>
                        <span class="text-body-md text-secondary">Matching criteria...</span>
                    </div>
                </div>

                <!-- Batal Button -->
                <button class="w-full border border-primary text-primary py-[10px] px-[22px] rounded-full font-medium hover:bg-surface-container-low transition-colors" onclick="closeMatchmakingModal()">
                    Batal
                </button>
            </div>
            <!-- Atmospheric Accent -->
            <div class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 z-0"></div>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- POPUP VIBE BIO (KODE 3)                  -->
    <!-- ========================================== -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-container-padding transition-opacity duration-300 <?php echo e($errors->has('vibe_bio') ? '' : 'hidden'); ?>" id="vibe-modal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <!-- Modal Card -->
        <div class="relative w-full max-w-[480px] bg-white rounded-[14px] shadow-2xl overflow-hidden border-[0.5px] border-[#EBEBEB] animate-in fade-in zoom-in duration-300">
            <form action="<?php echo e(route('ticket.vibe', $transaction->id)); ?>" method="POST">
                <?php echo csrf_field(); ?>
                <div class="p-8 flex flex-col gap-6">
                    <?php if($errors->has('vibe_bio')): ?>
                        <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            <?php echo e($errors->first('vibe_bio')); ?>

                        </div>
                    <?php endif; ?>
                    <!-- Header -->
                    <div class="flex flex-col gap-2">
                        <div class="w-12 h-12 rounded-full bg-[#FFF0EE] flex items-center justify-center mb-2">
                            <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">psychology</span>
                        </div>
                        <h2 class="font-headline-md text-headline-md font-bold text-on-surface">Buat Vibe Bio Kamu</h2>
                        <p class="font-body-md text-body-md text-secondary">Biarkan AI kami membantu peserta lain mengenalmu lebih baik melalui profil singkat yang relevan.</p>
                    </div>
                    <!-- Form Field -->
                    <div class="flex flex-col gap-2">
                        <label class="font-label-md text-label-md text-on-surface-variant" for="vibe-bio">Bio Deskripsi</label>
                        <textarea name="vibe_bio" id="vibe-bio" class="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] p-4 text-body-md focus:ring-0 focus:border-[#F04E37] transition-colors resize-none placeholder:text-on-surface-variant/50" placeholder="Ceritakan minat atau tujuanmu hadir di event ini agar kami bisa mencocokkanmu dengan peserta lain..." rows="4"><?php echo e(old('vibe_bio', $myAttendee->vibe_bio ?? '')); ?></textarea>
                    </div>
                    
                    <div class="flex flex-col gap-2 hidden">
                        <input type="checkbox" name="looking_for_match" value="1" checked>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" class="flex-1 bg-[#F04E37] text-white py-[10px] px-[22px] rounded-[22px] font-body-md font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <span>Simpan</span>
                            <span class="material-symbols-outlined text-[18px]">check</span>
                        </button>
                        <button type="button" class="flex-1 bg-transparent border border-[#F04E37] text-[#F04E37] py-[10px] px-[22px] rounded-[22px] font-body-md font-medium hover:bg-[#FFF0EE] active:scale-[0.98] transition-all" onclick="closeVibeModal()">
                            Batal
                        </button>
                    </div>
                </div>
                <!-- Cosmetic Detail: Subtle Pattern Footer -->
                <div class="h-1 bg-gradient-to-r from-[#F04E37]/10 via-[#F04E37] to-[#F04E37]/10"></div>
            </form>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- HASIL MATCHMAKING (KODE 4)                 -->
    <!-- ========================================== -->
    <div id="matchmakingResultModal" class="fixed inset-0 z-50 hidden bg-background text-on-surface flex-col min-h-screen overflow-y-auto w-full">
        <!-- TopNavBar -->
        <nav class="w-full top-0 sticky z-50 bg-white/80 backdrop-blur-[16px] border-b border-outline-variant">
            <div class="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
                <div class="font-headline-md text-headline-md font-extrabold text-primary cursor-pointer">
                    SecureGate
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="closeMatchmakingResultModal()" class="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors text-2xl">close</button>
                </div>
            </div>
        </nav>
        <main class="flex-grow">
            <!-- Hero Section -->
            <section class="bg-surface-container-low py-12 md:py-16">
                <div class="max-w-[1280px] mx-auto px-container-padding text-center">
                    <div class="inline-flex items-center gap-2 mb-4 bg-surface-container-highest px-4 py-1.5 rounded-full">
                        <span class="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                        <span class="font-label-md text-label-md text-primary uppercase tracking-wider">AI Powered</span>
                    </div>
                    <h1 class="font-headline-lg md:text-headline-lg font-bold text-on-surface mb-2">Temukan Teman Sefrekuensi</h1>
                    <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Hasil Pencocokan AI berdasarkan minat, riwayat acara, dan preferensi koneksi Anda.</p>
                </div>
            </section>
            
            <!-- Results Section -->
            <section class="max-w-[1280px] mx-auto px-container-padding -mt-8 mb-16">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-gap-default">
                    <?php if(isset($otherAttendees) && $otherAttendees->isNotEmpty()): ?>
                        <?php $__currentLoopData = $otherAttendees; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $match): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php
                                $attName = $match->user?->full_name ?? 'Peserta';
                                $attPic = !empty($match->user?->profile_picture) ? asset('Media/uploads/' . $match->user->profile_picture) : 'https://ui-avatars.com/api/?name=' . urlencode($attName) . '&background=4ade80&color=fff';
                                $attIg = !empty($match->ig_handle) ? ltrim($match->ig_handle, '@') : null;
                                $vibeBio = !empty($match->vibe_bio) ? $match->vibe_bio : 'Belum ada bio.';
                                $isBestMatch = $index === 0;
                            ?>
                            
                            <!-- Card -->
                            <div class="bg-white <?php echo e($isBestMatch ? 'border-2 border-primary' : 'border-[0.5px] border-outline-variant'); ?> p-6 rounded-[14px] shadow-sm flex flex-col items-center relative transform hover:-translate-y-1 transition-all duration-300">
                                <?php if($isBestMatch): ?>
                                <div class="absolute -top-3 bg-primary text-on-primary px-3 py-1 rounded-full text-caption font-bold shadow-sm flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                    Best Match
                                </div>
                                <div class="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface-container">
                                <?php else: ?>
                                <div class="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container">
                                <?php endif; ?>
                                    <img alt="<?php echo e($attName); ?>" src="<?php echo e($attPic); ?>" class="w-full h-full object-cover">
                                </div>
                                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-1"><?php echo e($attName); ?></h3>
                                <div class="bg-surface-container-low px-2 py-0.5 rounded-full mb-3">
                                    <span class="text-[11px] font-medium text-primary">Peserta Event</span>
                                </div>
                                <p class="font-body-md text-body-md text-on-surface-variant text-center mb-6 line-clamp-3">
                                    <?php echo e($vibeBio); ?>

                                </p>
                                <div class="flex flex-col items-center gap-2 mb-4">
                                    <?php if($attIg): ?>
                                    <a href="https://instagram.com/<?php echo e($attIg); ?>" target="_blank" class="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                                        <span class="material-symbols-outlined text-[18px]">camera</span>
                                        <span class="font-label-md text-label-md"><?php echo e('@' . $attIg); ?></span>
                                    </a>
                                    <?php endif; ?>
                                </div>
                                <button class="mt-auto w-full py-2.5 px-6 border border-primary text-primary font-medium rounded-full hover:bg-[#d63b27] hover:text-white transition-all flex items-center justify-center gap-2" onclick="openChatModal('<?php echo e(addslashes($attName)); ?>', '<?php echo e($attPic); ?>', '<?php echo e(addslashes(preg_replace('/\s+/', ' ', $vibeBio))); ?>')">
                                    <span class="material-symbols-outlined text-[18px]">chat</span> Say Hello
                                </button>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <?php else: ?>
                        <div class="col-span-full text-center py-12">
                            <span class="material-symbols-outlined text-[48px] text-secondary mb-4">group_off</span>
                            <h3 class="font-headline-md text-headline-md text-on-surface mb-2">Belum Ada Partner</h3>
                            <p class="text-secondary">Saat ini belum ada peserta lain yang masuk ke sistem Matchmaking.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </section>
            
            <!-- Additional Options -->
            <section class="max-w-[1280px] mx-auto px-container-padding pb-16">
                <div class="bg-white border-[0.5px] border-outline-variant rounded-[14px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div>
                        <h4 class="font-headline-sm text-headline-sm text-on-surface mb-1">Bukan yang Anda cari?</h4>
                        <p class="font-body-md text-body-md text-on-surface-variant">Update preferensi minat Anda untuk hasil pencocokan yang lebih akurat.</p>
                    </div>
                    <button class="whitespace-nowrap px-8 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-opacity" onclick="closeMatchmakingResultModal(); openVibeModal();">
                        Perbarui Preferensi
                    </button>
                </div>
            </section>
        </main>
    </div>

    <!-- ========================================== -->
    <!-- CHAT OVERLAY (KODE 5)                      -->
    <!-- ========================================== -->
    <div id="chatModal" class="fixed inset-0 z-[60] hidden bg-background text-on-surface flex-col min-h-screen overflow-hidden w-full">
        <!-- TopAppBar Execution -->
        <header class="bg-surface border-b-[0.5px] border-outline-variant flex justify-between items-center w-full px-container-padding h-16 sticky top-0 z-50">
            <div class="flex items-center gap-8">
                <span class="font-headline-md text-headline-md font-bold text-primary">SecureGate</span>
                <nav class="hidden md:flex gap-6">
                    <button onclick="closeChatModal()" class="text-secondary hover:bg-surface-container-low transition-colors duration-200 font-label-md text-label-md px-3 py-2 rounded-lg flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">arrow_back</span> Back to Matches</button>
                    <a class="text-primary font-bold transition-all font-label-md text-label-md px-3 py-2 rounded-lg bg-surface-container-low" href="#">Chat</a>
                </nav>
            </div>
            <div class="flex items-center gap-4">
                <button class="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
                <button class="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">settings</button>
                <div class="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
                    <?php
                        $userProfilePath = !empty(Auth::user()->profile_picture) 
                            ? asset('Media/uploads/' . Auth::user()->profile_picture)
                            : 'https://ui-avatars.com/api/?name=' . urlencode(Auth::user()->full_name ?? 'Peserta') . '&background=4ade80&color=fff';
                    ?>
                    <img alt="User profile" src="<?php echo e($userProfilePath); ?>"/>
                </div>
            </div>
        </header>
        <main class="flex-1 flex overflow-hidden">
            <!-- Left Pane: Conversations -->
            <aside class="hidden lg:flex w-80 lg:w-96 bg-surface-container-lowest border-r-[0.5px] border-outline-variant flex-col h-full">
                <div class="p-container-padding">
                    <h2 class="font-headline-sm text-headline-sm text-on-surface mb-4">Messages</h2>
                    <div class="relative mb-6">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                        <input class="w-full bg-surface border-outline-variant border-[0.5px] rounded-xl py-2 pl-10 pr-4 text-body-md font-body-md focus:border-primary focus:ring-0 transition-all" placeholder="Search conversations..." type="text"/>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto chat-scroll">
                    <!-- Best Match Chat -->
                    <div class="flex items-center gap-3 p-4 bg-surface-container border-r-2 border-primary cursor-pointer group transition-all">
                        <div class="relative h-12 w-12 flex-shrink-0">
                            <img id="active-chat-pic-aside" alt="Chat User" class="h-full w-full rounded-full object-cover border border-outline-variant" src="https://ui-avatars.com/api/?name=Chat&background=4ade80&color=fff"/>
                            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-baseline">
                                <h3 id="active-chat-name-aside" class="font-label-md text-label-md text-primary font-bold truncate">Peserta</h3>
                                <span class="text-[10px] text-outline">Just now</span>
                            </div>
                            <p class="text-body-md text-body-md text-on-surface truncate">Hello! I'm interested in networking...</p>
                        </div>
                    </div>
                </div>
            </aside>
            <!-- Right Pane: Chat Window -->
            <section class="flex-1 flex flex-col bg-white">
                <!-- Header -->
                <header class="h-16 border-b-[0.5px] border-outline-variant px-container-padding flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div class="flex items-center gap-3">
                        <button onclick="closeChatModal()" class="md:hidden material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all mr-2">arrow_back</button>
                        <div class="h-10 w-10 rounded-full overflow-hidden border border-outline-variant">
                            <img id="active-chat-pic" alt="User" src="https://ui-avatars.com/api/?name=Chat&background=4ade80&color=fff"/>
                        </div>
                        <div>
                            <h2 id="active-chat-name" class="font-headline-sm text-headline-sm text-on-surface leading-tight">Peserta</h2>
                            <p id="active-chat-role" class="text-[11px] text-secondary font-medium">Online</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">call</button>
                        <button class="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">videocam</button>
                        <button class="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-all">info</button>
                    </div>
                </header>
                <!-- Messages Area -->
                <div id="chat-messages-area" class="flex-1 overflow-y-auto p-container-padding flex flex-col gap-4 chat-scroll bg-surface/30">
                    <!-- Date Divider -->
                    <div class="flex justify-center my-4">
                        <span class="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-bold text-outline uppercase tracking-wider">Today</span>
                    </div>
                    <!-- Received Message -->
                    <div class="flex flex-col items-start gap-1 max-w-[70%]">
                        <div class="bg-surface-container p-3 rounded-2xl rounded-tl-none border border-outline-variant/30">
                            <p class="text-body-md text-on-surface">Hello! I'm interested in networking.</p>
                        </div>
                        <span class="text-[10px] text-outline ml-1">Just now</span>
                    </div>
                </div>
                <!-- Input Area -->
                <footer class="p-container-padding bg-white border-t-[0.5px] border-outline-variant">
                    <div class="max-w-4xl mx-auto flex items-end gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 shadow-sm focus-within:border-primary transition-all">
                        <button class="material-symbols-outlined text-outline hover:text-primary p-2 transition-colors">add_circle</button>
                        <button class="material-symbols-outlined text-outline hover:text-primary p-2 transition-colors">attach_file</button>
                        <textarea id="chat-input-textarea" class="flex-1 bg-transparent border-none focus:ring-0 text-body-md font-body-md py-2 resize-none max-h-32" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' placeholder="Write a message..." rows="1"></textarea>
                        <button onclick="sendChatMessage()" class="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
                            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">send</span>
                        </button>
                    </div>
                    <p class="text-[11px] text-center text-outline mt-3 font-medium">End-to-end encrypted by SecureGate Protocol</p>
                </footer>
            </section>
        </main>
    </div>

    <?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
    <!-- JavaScript Triggers -->
    <script>
        function openMatchmakingModal() {
            var modal = document.getElementById('matchmakingModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Simulate AI matching process for 3 seconds, then show results
            setTimeout(function() {
                closeMatchmakingModal();
                openMatchmakingResultModal();
            }, 3000);
        }

        function closeMatchmakingModal() {
            var modal = document.getElementById('matchmakingModal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
        
        function openMatchmakingResultModal() {
            var modal = document.getElementById('matchmakingResultModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMatchmakingResultModal() {
            var modal = document.getElementById('matchmakingResultModal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        function openVibeModal() {
            var modal = document.getElementById('vibe-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function closeVibeModal() {
            var modal = document.getElementById('vibe-modal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
        
        // Simple textarea focus effect
        const textarea = document.getElementById('vibe-bio');
        if (textarea) {
            textarea.addEventListener('focus', () => {
                textarea.parentElement.querySelector('label').style.color = '#F04E37';
            });
            textarea.addEventListener('blur', () => {
                textarea.parentElement.querySelector('label').style.color = '';
            });
        }
        
        function openChatModal(name, pic, role) {
            // Update active chat header
            document.getElementById('active-chat-name').innerText = name;
            document.getElementById('active-chat-pic').src = pic;
            
            // Update aside panel
            document.getElementById('active-chat-name-aside').innerText = name;
            document.getElementById('active-chat-pic-aside').src = pic;
            
            if (role) {
                var briefRole = role.length > 30 ? role.substring(0, 30) + '...' : role;
                document.getElementById('active-chat-role').innerText = briefRole + ' • Online';
            } else {
                document.getElementById('active-chat-role').innerText = 'Online';
            }
            
            var modal = document.getElementById('chatModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Auto scroll to bottom
            const chatContainer = document.getElementById('chat-messages-area');
            if(chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function closeChatModal() {
            var modal = document.getElementById('chatModal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }

        function sendChatMessage() {
            const textarea = document.getElementById('chat-input-textarea');
            if (textarea.value.trim() !== '') {
                const msg = textarea.value;
                textarea.value = '';
                textarea.style.height = 'auto';
                
                const chatContainer = document.getElementById('chat-messages-area');
                const msgDiv = document.createElement('div');
                msgDiv.className = 'flex flex-col items-end gap-1 ml-auto max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300';
                msgDiv.innerHTML = `
                    <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm">
                        <p class="text-body-md">${msg}</p>
                    </div>
                    <div class="flex items-center gap-1 mr-1">
                        <span class="text-[10px] text-outline">Just now</span>
                        <span class="material-symbols-outlined text-[12px] text-outline">done</span>
                    </div>
                `;
                chatContainer.appendChild(msgDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const chatTextarea = document.getElementById('chat-input-textarea');
            if(chatTextarea) {
                chatTextarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                    }
                });
            }
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\JVC26\gatemate\resources\views/tickets/e_ticket.blade.php ENDPATH**/ ?>