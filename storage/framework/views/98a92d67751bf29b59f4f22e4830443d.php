<?php $__env->startSection('styles'); ?>
<style>

        
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-nav { backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.8); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .bg-brand-coral::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.15) 0%, transparent 50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .bg-brand-coral:hover::before {
            opacity: 1;
        }
        .coral-shadow {
            box-shadow: 0 10px 30px -10px rgba(178, 33, 16, 0.3);
        }
        
        #reader video { border-radius: 14px!important; width: 100%; }
        #reader img { display: none!important; }
        .navbar { z-index: 50; }
    
</style>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
<script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="<?php echo e(config('services.midtrans.client_key')); ?>"></script>
<script>

        // -- Balance Card Interaction
        document.querySelector('.bg-brand-coral').addEventListener('mousemove', (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });

        // -- Topup Modal Logic
        const topupModal = document.getElementById('topup-modal');
        function toggleTopupModal() {
            if (topupModal.classList.contains('hidden')) {
                topupModal.classList.remove('hidden');
                topupModal.classList.add('flex');
            } else {
                topupModal.classList.add('hidden');
                topupModal.classList.remove('flex');
            }
        }

        function setAmount(val, element) {
            const input = document.getElementById('amountInput');
            input.value = val;
            
            document.querySelectorAll('.chip-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white', 'border-primary');
                btn.classList.add('border-outline-variant', 'text-on-surface-variant');
            });
            element.classList.add('bg-primary', 'text-white', 'border-primary');
            element.classList.remove('border-outline-variant', 'text-on-surface-variant');
        }

        function formatAndClearChips(inputElement) {
            let val = inputElement.value.replace(/[^0-9]/g, '');
            if (val.length > 0) {
                inputElement.value = parseInt(val).toLocaleString('id-ID');
            }
            document.querySelectorAll('.chip-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white', 'border-primary');
                btn.classList.add('border-outline-variant', 'text-on-surface-variant');
            });
        }

        async function processTopup() {
            const rawVal = document.getElementById('amountInput').value.replace(/[^0-9]/g, '');
            const amount = parseInt(rawVal);
            if (isNaN(amount) || amount < 10000) {
                alert('Minimal top-up adalah Rp 10.000');
                return;
            }

            const btnPay = document.getElementById('btnPayTopup');
            btnPay.disabled = true;
            btnPay.innerText = 'Memproses...';

            try {
                const res = await fetch('/wallet/topup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({ amount: amount })
                });

                const data = await res.json();
                if (res.ok && data.snap_token) {
                    snap.pay(data.snap_token, {
                        onSuccess: function(result){ alert('Berhasil!'); window.location.reload(); },
                        onPending: function(result){ alert('Menunggu pembayaran!'); window.location.reload(); },
                        onError: function(result){ alert('Pembayaran gagal!'); btnPay.disabled=false; btnPay.innerText='Lanjutkan Pembayaran'; },
                        onClose: function(){ btnPay.disabled=false; btnPay.innerText='Lanjutkan Pembayaran'; }
                    });
                } else {
                    alert(data.message || 'Gagal memproses.');
                    btnPay.disabled = false;
                    btnPay.innerText = 'Lanjutkan Pembayaran';
                }
            } catch (err) {
                alert('Koneksi bermasalah.');
                btnPay.disabled = false;
                btnPay.innerText = 'Lanjutkan Pembayaran';
            }
        }

        // -- Scanner Modal Logic
        const scannerModal = document.getElementById('scanner-modal');
        let html5QrcodeScanner = null;

        function toggleScannerModal() {
            scannerModal.classList.remove('hidden');
            scannerModal.classList.add('flex');
        }

        function stopScanner() {
            scannerModal.classList.add('hidden');
            scannerModal.classList.remove('flex');
            if (html5QrcodeScanner) {
                html5QrcodeScanner.stop().catch(() => {});
            }
            document.getElementById('btnStartScan').style.display = 'flex';
        }

        function startScanner() {
            const btn = document.getElementById('btnStartScan');
            btn.style.display = 'none';

            html5QrcodeScanner = new Html5Qrcode('reader', { verbose: false });

            Html5Qrcode.getCameras().then(devices => {
                if (!devices || !devices.length) {
                    alert('Tidak ada kamera yang terdeteksi.');
                    btn.style.display = 'flex';
                    return;
                }
                let cameraId = devices[0].id;
                for (const d of devices) {
                    if (d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment')) {
                        cameraId = d.id; break;
                    }
                }
                html5QrcodeScanner.start(cameraId, { fps: 15, qrbox: { width: 250, height: 250 } }, onScanSuccess)
                    .catch(err => {
                        alert('Gagal memulai kamera.');
                        btn.style.display = 'flex';
                    });
            }).catch(() => {
                alert('Kamera diblokir.');
                btn.style.display = 'flex';
            });
        }

        function onScanSuccess(decodedText) {
            try {
                const data = JSON.parse(decodedText);
                const tenantId = data.id ?? data.tenant_id;
                const tenantName = data.tenant_name ?? ('Tenant ' + tenantId);
                const amount   = data.amount ?? null;

                if (!tenantId) {
                    alert('QR tidak valid.');
                    return;
                }

                stopScanner();
                openCheckout(tenantId, tenantName, amount);

            } catch (e) {
                alert('Format QR tidak dikenali.');
            }
        }

        // -- Checkout Modal Logic
        const checkoutModal = document.getElementById('checkout-modal');
        function openCheckout(tenantId, tenantName, amount) {
            checkoutModal.classList.remove('hidden');
            checkoutModal.classList.add('flex');

            document.getElementById('checkout-tenant-name').innerText = tenantName;
            document.getElementById('checkout-tenant-id').innerText = 'ID: ' + tenantId;
            document.getElementById('checkout-form').action = '/wallet/pay/' + tenantId;

            const amountInput = document.getElementById('checkout-amount');
            if (amount) {
                amountInput.value = amount;
                amountInput.readOnly = true;
                amountInput.classList.add('bg-surface-container-low', 'opacity-80');
            } else {
                amountInput.value = '';
                amountInput.readOnly = false;
                amountInput.classList.remove('bg-surface-container-low', 'opacity-80');
            }
        }

        function closeCheckout() {
            checkoutModal.classList.add('hidden');
            checkoutModal.classList.remove('flex');
        }
    
</script>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
<main class="pt-24 pb-12 px-container-padding max-w-[1280px] mx-auto">
        
        <?php if(session('success')): ?>
            <div class="mb-4 bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
                <span class="material-symbols-outlined">check_circle</span>
                <?php echo e(session('success')); ?>

            </div>
        <?php endif; ?>
        <?php if($errors->any()): ?>
            <div class="mb-4 bg-[#FFF0EE] border border-primary text-primary px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
                <span class="material-symbols-outlined">error</span>
                <?php echo e($errors->first()); ?>

            </div>
        <?php endif; ?>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gap-default items-start">
            <!-- Main Wallet Section -->
            <div class="lg:col-span-8 flex flex-col gap-gap-default">
                <!-- Balance Card -->
                <div class="bg-brand-coral rounded-[22px] p-8 text-white relative overflow-hidden flex flex-col gap-6 shadow-sm" style="--x: 541px; --y: 170px;">
                    <div class="absolute top-0 right-0 p-4 opacity-10">
                        <span class="material-symbols-outlined !text-[120px]" data-icon="account_balance_wallet">account_balance_wallet</span>
                    </div>
                    <div class="z-10">
                        <p class="font-label-md text-label-md opacity-80 uppercase tracking-wider mb-2">Total Saldo</p>
                        <h1 class="font-headline-lg text-headline-lg font-bold">Rp <?php echo e(number_format($user->wallet_balance, 0, ',', '.')); ?></h1>
                    </div>
                    <div class="flex z-10">
                        <button onclick="toggleTopupModal()" class="bg-white text-brand-coral px-[22px] py-[10px] rounded-[22px] font-label-md text-label-md font-bold transition-all hover:bg-surface-container-low active:scale-95">
                            Top Up
                        </button>
                    </div>
                </div>

                <!-- Action Row -->
                <div class="flex gap-4">
                    <button onclick="toggleTopupModal()" class="flex-1 flex items-center justify-center gap-2 border border-brand-coral text-brand-coral bg-transparent rounded-[22px] px-[22px] py-[10px] font-label-md text-label-md font-bold hover:bg-surface-container-low transition-all active:scale-95">
                        <span class="material-symbols-outlined text-[20px]" data-icon="add_circle">add_circle</span>
                        Top Up
                    </button>
                    <button onclick="toggleScannerModal()" class="flex-1 flex items-center justify-center gap-2 border border-brand-coral text-brand-coral bg-transparent rounded-[22px] px-[22px] py-[10px] font-label-md text-label-md font-bold hover:bg-surface-container-low transition-all active:scale-95">
                        <span class="material-symbols-outlined text-[20px]" data-icon="qr_code_scanner">qr_code_scanner</span>
                        Scan QR / Bayar
                    </button>
                </div>

                <!-- Transaction History -->
                <div class="bg-surface-container-lowest rounded-card border border-[#EBEBEB] p-6 flex flex-col gap-gap-tight">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-headline-sm text-headline-sm text-on-surface">Riwayat Transaksi</h3>
                        <button class="text-primary font-label-md text-label-md hover:underline">Lihat Semua</button>
                    </div>
                    <div class="flex flex-col">
                        <?php $__empty_1 = true; $__currentLoopData = $transactions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tx): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <?php 
                                $isIncome = in_array($tx->type, ['topup', 'ticket_refund', 'tenant_revenue']); 
                                $txName = 'Pembayaran Tiket';
                                if ($tx->type === 'topup') $txName = 'Top-up Saldo';
                                elseif ($tx->type === 'ticket_refund') $txName = 'Refund Tiket';
                                elseif ($tx->type === 'tenant_revenue') $txName = 'Pendapatan Tenant';
                                elseif ($tx->type === 'payment') $txName = 'Pembayaran QR';
                                elseif ($tx->type === 'withdrawal') $txName = 'Penarikan Dana';
                            ?>
                            <div class="flex items-center justify-between py-4 border-b border-[#EBEBEB] hover:bg-[#F9F9F9] transition-colors px-2 -mx-2 rounded-lg">
                                <div class="flex items-center gap-4">
                                    <?php if($isIncome): ?>
                                        <div class="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                                            <span class="material-symbols-outlined text-[#2E7D32]" data-icon="north_east">north_east</span>
                                        </div>
                                    <?php else: ?>
                                        <div class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                                            <span class="material-symbols-outlined text-brand-coral" data-icon="south_west">south_west</span>
                                        </div>
                                    <?php endif; ?>
                                    <div>
                                        <p class="font-body-lg text-body-lg font-medium text-on-surface"><?php echo e($txName); ?></p>
                                        <p class="font-caption text-caption text-secondary"><?php echo e($tx->created_at->format('d M Y, H:i')); ?></p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-body-lg text-body-lg font-bold <?php echo e($isIncome ? 'text-[#2E7D32]' : 'text-brand-coral'); ?>">
                                        <?php echo e($isIncome ? '+' : '-'); ?>Rp <?php echo e(number_format($tx->amount, 0, ',', '.')); ?>

                                    </p>
                                    <p class="font-caption text-caption text-secondary" style="text-transform: capitalize;"><?php echo e($tx->status); ?></p>
                                </div>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <div class="text-center py-8 text-secondary">
                                Belum ada riwayat transaksi.
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Sidebar Widgets -->
            <div class="lg:col-span-4 flex flex-col gap-gap-default">
                <!-- Promo Card -->
                <div class="bg-surface-container-lowest rounded-card border border-[#EBEBEB] p-4 flex flex-col gap-4">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface">Promo Spesial</h3>
                    <div class="rounded-lg overflow-hidden relative aspect-[16/9]">
                        <img alt="Concert Promo" class="w-full h-full object-cover" src="<?php echo e(asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif')); ?>">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex items-end">
                            <p class="text-white font-label-md text-label-md">Cashback 20% Tiket Konser!</p>
                        </div>
                    </div>
                </div>

                <!-- Security Info -->
                <div class="bg-[#FFF0EE] rounded-card p-4 border border-[#F9DCD7] flex gap-4">
                    <span class="material-symbols-outlined text-brand-coral" data-icon="shield_lock" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
                    <div>
                        <p class="font-body-md text-body-md font-bold text-on-surface mb-1">Keamanan Terjamin</p>
                        <p class="font-caption text-caption text-on-surface-variant">Transaksi dilindungi dengan enkripsi end-to-end dan otentikasi dua faktor.</p>
                    </div>
                </div>

                <!-- Quick Settings -->
                <div class="bg-surface-container-lowest rounded-card border border-[#EBEBEB] p-6 flex flex-col gap-4">
                    <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Pengaturan Wallet</h3>
                    <div class="flex flex-col gap-1">
                        <button class="flex items-center justify-between w-full py-3 text-left hover:bg-[#F9F9F9] transition-colors rounded-lg px-2 -mx-2 group">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-secondary group-hover:text-primary transition-colors" data-icon="credit_card">credit_card</span>
                                <span class="font-body-md text-body-md text-on-surface">Metode Pembayaran</span>
                            </div>
                            <span class="material-symbols-outlined text-secondary text-[18px]" data-icon="chevron_right">chevron_right</span>
                        </button>
                        <button class="flex items-center justify-between w-full py-3 text-left hover:bg-[#F9F9F9] transition-colors rounded-lg px-2 -mx-2 group">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-secondary group-hover:text-primary transition-colors" data-icon="lock">lock</span>
                                <span class="font-body-md text-body-md text-on-surface">Ubah PIN Wallet</span>
                            </div>
                            <span class="material-symbols-outlined text-secondary text-[18px]" data-icon="chevron_right">chevron_right</span>
                        </button>
                        <button class="flex items-center justify-between w-full py-3 text-left hover:bg-[#F9F9F9] transition-colors rounded-lg px-2 -mx-2 group">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-secondary group-hover:text-primary transition-colors" data-icon="notifications">notifications</span>
                                <span class="font-body-md text-body-md text-on-surface">Notifikasi Transaksi</span>
                            </div>
                            <div class="w-10 h-5 bg-primary rounded-full relative">
                                <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    

    

    
    <div class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm transition-opacity duration-300" id="topup-modal">
        <div class="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
            <div class="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
                <h2 class="font-headline-sm text-headline-sm text-on-surface">Top Up Balance</h2>
                <button class="text-on-surface-variant hover:text-primary transition-colors" onclick="toggleTopupModal()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-6">
                <div class="relative mb-8">
                    <div class="text-center mb-2 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Enter Amount</div>
                    <div class="flex items-center justify-center gap-2 border-b-2 border-outline-variant focus-within:border-primary transition-all pb-2">
                        <span class="text-headline-md font-bold text-on-surface-variant">Rp</span>
                        <input class="bg-transparent border-none focus:ring-0 text-[40px] font-bold text-on-surface w-full max-w-[280px] text-center p-0 placeholder:text-surface-variant" id="amountInput" placeholder="0" type="text" value="100.000" oninput="formatAndClearChips(this)">
                    </div>
                </div>
                <div class="mb-10">
                    <div class="flex flex-wrap justify-center gap-3">
                        <button class="chip-btn px-6 py-3 rounded-full border border-outline-variant font-label-md text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95" onclick="setAmount('50.000', this)">Rp 50.000</button>
                        <button class="chip-btn active px-6 py-3 rounded-full bg-primary text-white border border-primary font-label-md text-label-md transition-all active:scale-95 shadow-sm" onclick="setAmount('100.000', this)">Rp 100.000</button>
                        <button class="chip-btn px-6 py-3 rounded-full border border-outline-variant font-label-md text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95" onclick="setAmount('200.000', this)">Rp 200.000</button>
                        <button class="chip-btn px-6 py-3 rounded-full border border-outline-variant font-label-md text-label-md text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95" onclick="setAmount('500.000', this)">Rp 500.000</button>
                    </div>
                </div>
                <div class="mb-8">
                    <div class="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">Payment Method</div>
                    <div class="flex items-center justify-between p-4 bg-surface-container-low border border-[#EBEBEB] rounded-[10px] cursor-pointer hover:bg-surface-container transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-outline-variant p-1">
                                <img alt="Midtrans" class="w-full h-auto grayscale opacity-80" src="https://midtrans.com/assets/img/midtrans-logo.svg">
                            </div>
                            <div>
                                <div class="font-headline-sm text-headline-sm">Midtrans</div>
                                <div class="font-caption text-caption text-on-surface-variant">Virtual Account, CC, E-wallet</div>
                            </div>
                        </div>
                        <span class="material-symbols-outlined text-primary">check_circle</span>
                    </div>
                </div>
                <button id="btnPayTopup" onclick="processTopup()" class="w-full bg-[#F04E37] text-white py-4 rounded-full font-headline-sm text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all coral-shadow">
                    Lanjutkan Pembayaran
                </button>
            </div>
        </div>
    </div>

    
    <div class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm transition-opacity duration-300" id="scanner-modal">
        <div class="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
            <div class="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
                <h2 class="font-headline-sm text-headline-sm text-on-surface">Scan QR Code</h2>
                <button class="text-on-surface-variant hover:text-primary transition-colors" onclick="stopScanner()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-6 flex flex-col items-center">
                <div class="text-sm text-secondary mb-4 text-center">Arahkan kamera ke QR tagihan tenant untuk membayar.</div>
                <div id="reader" class="w-full overflow-hidden rounded-[14px] border border-outline-variant bg-surface-container"></div>
                <button id="btnStartScan" class="mt-6 w-full py-3 bg-surface-container-high text-on-surface rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors" onclick="startScanner()">
                    <span class="material-symbols-outlined">camera</span> Aktifkan Kamera
                </button>
            </div>
        </div>
    </div>

    
    <div class="fixed inset-0 z-[100] hidden items-center justify-center p-4 bg-on-background/60 backdrop-blur-sm transition-opacity duration-300" id="checkout-modal">
        <div class="relative bg-surface-container-lowest w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-[#EBEBEB]">
            <div class="p-6 border-b border-[#EBEBEB] flex justify-between items-center bg-white">
                <h2 class="font-headline-sm text-headline-sm text-on-surface">Konfirmasi Pembayaran</h2>
                <button class="text-on-surface-variant hover:text-primary transition-colors" onclick="closeCheckout()">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-6 space-y-6">
                <!-- Tenant Summary -->
                <div class="flex items-start gap-4 p-4 bg-surface rounded-[14px] border border-[#EBEBEB]">
                    <div class="w-16 h-16 rounded-[10px] bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                        <span class="material-symbols-outlined text-3xl text-primary">store</span>
                    </div>
                    <div>
                        <p class="font-headline-sm text-headline-sm" id="checkout-tenant-name">Tenant Name</p>
                        <div class="flex gap-2 mt-1">
                            <span class="px-2 py-0.5 bg-[#FFF0EE] text-[#B83020] rounded-[6px] text-[10px] font-bold" id="checkout-tenant-id">ID: 0</span>
                        </div>
                    </div>
                </div>
                
                <form id="checkout-form" method="POST" action="">
                    <?php echo csrf_field(); ?>
                    <!-- Financial Breakdown -->
                    <div class="space-y-4">
                        <div class="relative">
                            <div class="text-sm font-bold text-on-surface-variant mb-2">Nominal Pembayaran</div>
                            <div class="flex items-center gap-2 border border-outline-variant rounded-lg p-3 focus-within:border-primary">
                                <span class="font-bold text-on-surface-variant">Rp</span>
                                <input type="number" name="amount" id="checkout-amount" class="w-full bg-transparent border-none p-0 focus:ring-0 font-bold" placeholder="0" required>
                            </div>
                        </div>

                        <div class="h-[0.5px] bg-[#EBEBEB]"></div>
                        
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-on-surface-variant font-body-md text-body-md flex items-center gap-2">
                                    <span class="material-symbols-outlined text-sm">account_balance_wallet</span>
                                    Saldo Saat Ini
                                </span>
                                <span class="font-medium text-on-surface">Rp <?php echo e(number_format($user->wallet_balance, 0, ',', '.')); ?></span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full mt-6 bg-[#F04E37] text-white py-3.5 rounded-full font-headline-sm text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all coral-shadow flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">verified_user</span>
                        Bayar Sekarang
                    </button>
                </form>
            </div>
        </div>
    </div>

    
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\JVC26\gatemate\resources\views/wallet/index.blade.php ENDPATH**/ ?>