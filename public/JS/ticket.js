document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. DROPDOWN NAVBAR & PROFILE
       ========================================= */
    const profileTrigger = document.getElementById('profile-dropdown-trigger');
    const profileMenu = document.getElementById('profile-dropdown-menu');

    if (profileTrigger && profileMenu) {
        profileTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
        });

        window.addEventListener('click', function(e) {
            if (!profileTrigger.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.style.display = 'none';
            }
        });
    }

    /* =========================================
       2. NAVBAR SCROLL EFFECT
       ========================================= */
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }


    /* =========================================
       3. PEMILIHAN TIKET (TIER SELECTION)
       ========================================= */
    const ticketCards = document.querySelectorAll(".ticket-option-card");
    const selectedTierInput = document.getElementById("selected-tier-id");
    let currentPrice = 0;

    if (ticketCards.length > 0) {
        ticketCards.forEach(card => {
            card.addEventListener("click", function() {
                ticketCards.forEach(c => c.classList.remove("active-card"));
                this.classList.add("active-card");

                if (selectedTierInput) {
                    selectedTierInput.value = this.getAttribute("data-id");
                }
                currentPrice = parseInt(this.getAttribute("data-price")) || 0;
            });
        });
    }


    /* =========================================
       4. MODAL REGISTRASI & CHECKOUT
       ========================================= */
    const openModalBtn  = document.getElementById("open-register-modal");
    const closeModalBtn = document.getElementById("close-register-modal");
    const registerModal = document.getElementById("register-modal");
    const modalOverlay  = document.getElementById("modal-overlay");
    const step1Form     = document.getElementById("step-1-form");
    const step2Payment  = document.getElementById("step-2-payment");

    const closeModal = () => {
        if (registerModal) registerModal.style.display = "none";
        if (modalOverlay)  modalOverlay.style.display  = "none";
        document.body.style.overflow = "auto";

        if (step1Form)    step1Form.classList.remove("hidden-step");
        if (step2Payment) step2Payment.classList.add("hidden-step");
    };

    if (openModalBtn) {
        openModalBtn.addEventListener("click", (e) => {
            e.preventDefault();

            if (!selectedTierInput || !selectedTierInput.value) {
                alert("Please select a ticket category first!");
                return;
            }

            if (registerModal && modalOverlay) {
                registerModal.style.display = "block";
                modalOverlay.style.display  = "block";
                document.body.style.overflow = "hidden";
            }
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (modalOverlay)  modalOverlay.addEventListener("click", closeModal);


    /* =========================================
       5. PROSES PAYMENT — MIDTRANS SNAP AJAX
       ─────────────────────────────────────────
       PERUBAHAN KRITIS: Logic lama menggunakan
       form.submit() yang menyebabkan full-page
       redirect ke /checkout dan menampilkan JSON
       mentah di browser.

       Diganti: fetch() AJAX → Snap popup.
       ========================================= */
    const btnToPayment = document.getElementById("btn-to-payment");

    if (btnToPayment) {
        btnToPayment.addEventListener("click", async () => {

            const form = document.getElementById("checkout-form");
            if (!form) return;

            // Validasi form HTML5 tetap berjalan
            if (!form.reportValidity()) return;

            // Ambil nilai dari hidden input yang sudah diisi saat user pilih tier
            const tierId  = selectedTierInput ? selectedTierInput.value : null;
            const eventId = form.querySelector('input[name="id_event"]')
                              ? form.querySelector('input[name="id_event"]').value
                              : null;

            if (!tierId || !eventId) {
                alert("Pilih kategori tiket terlebih dahulu.");
                return;
            }

            // Kunci tombol agar tidak double-submit
            btnToPayment.disabled   = true;
            btnToPayment.textContent = "Memproses...";

            const csrfToken = document.querySelector('meta[name="csrf-token"]')
                                ? document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                                : form.querySelector('input[name="_token"]')
                                    ? form.querySelector('input[name="_token"]').value
                                    : '';

            try {
                // ── Kirim AJAX POST ke /checkout ──────────────────────────────
                const response = await fetch('/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept':       'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({
                        event_id: eventId,
                        tier_id:  tierId,
                    }),
                });

                // Baca sebagai teks dulu agar error 500 HTML ikut tertangkap
                const rawText = await response.text();
                console.log('[Checkout] Status:', response.status, '| Raw:', rawText.substring(0, 120));

                let data;
                try {
                    data = JSON.parse(rawText);
                } catch (parseErr) {
                    console.error('[Checkout] Respons bukan JSON:', rawText);
                    alert('Server mengembalikan respons tidak terduga. Lihat console (F12).');
                    return;
                }

                if (!response.ok) {
                    alert(data.message || 'Terjadi kesalahan server. Coba lagi.');
                    return;
                }

                if (!data.snap_token) {
                    alert('Gagal mendapatkan token pembayaran.');
                    return;
                }

                console.log('[Checkout] Token diterima:', data.snap_token.substring(0, 12) + '...');

                // ── Tutup modal dulu, lalu buka popup Midtrans ───────────────
                closeModal();

                window.snap.pay(data.snap_token, {
                    onSuccess: function (result) {
                        console.log('[Midtrans] Sukses:', result);
                        window.location.reload();
                    },
                    onPending: function (result) {
                        console.log('[Midtrans] Pending:', result);
                        alert('Silakan selesaikan pembayaran Anda.');
                    },
                    onError: function (result) {
                        console.error('[Midtrans] Error:', result);
                        alert('Pembayaran gagal. Silakan coba lagi.');
                    },
                    onClose: function () {
                        console.log('[Midtrans] Popup ditutup.');
                    },
                });

            } catch (networkErr) {
                console.error('[Checkout] Network error:', networkErr);
                alert('Koneksi bermasalah. Periksa jaringan Anda.');

            } finally {
                btnToPayment.disabled    = false;
                btnToPayment.textContent = 'Proceed to Payment';
            }
        });
    }


    /* =========================================
       6. HAMBURGER MENU (MOBILE)
       ========================================= */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.querySelector('.main-nav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');

            if (mainNav.classList.contains('active')) {
                hamburgerBtn.classList.remove('fa-bars');
                hamburgerBtn.classList.add('fa-xmark');
            } else {
                hamburgerBtn.classList.remove('fa-xmark');
                hamburgerBtn.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('active');
                hamburgerBtn.classList.remove('fa-xmark');
                hamburgerBtn.classList.add('fa-bars');
            }
        });
    }


    /* =========================================
       7. COPY LINK LOCATION
       ========================================= */
    const copyLinkBtn = document.getElementById('copy-link-btn');

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const urlToCopy = this.getAttribute('data-url');

            navigator.clipboard.writeText(urlToCopy).then(() => {
                this.classList.remove('fa-regular', 'fa-copy');
                this.classList.add('fa-solid', 'fa-check');
                this.style.color = '#22c55e';

                setTimeout(() => {
                    this.classList.remove('fa-solid', 'fa-check');
                    this.classList.add('fa-regular', 'fa-copy');
                    this.style.color = '';
                }, 2000);

            }).catch(err => {
                console.error('Gagal menyalin tautan:', err);
                alert('Gagal menyalin tautan.');
            });
        });
    }

});