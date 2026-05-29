# User Journey Flow (Role: Pembeli / User)

## PENDAHULUAN
Dokumen ini disusun sebagai cetak biru (blueprint) mutlak untuk persiapan perombakan total UI/UX secara eksternal. Dokumen ini merangkum seluruh alur (flow) interaksi dan fitur yang tersedia bagi pengguna dengan `role === 'user'` atau pengunjung (`guest`) di platform SecureGate, mulai dari pendaftaran hingga pengalaman saat berada di lokasi event.

---

## TAHAP 1: DISCOVERY & ONBOARDING
Tahap ini adalah titik awal interaksi pengguna (baik sebagai Guest maupun User) dengan platform.

1. **Halaman Landing Publik (`/`)**
   - Menampilkan banner promosi dan daftar event yang sedang *trending*.
   - Tombol navigasi untuk masuk (Sign In) atau daftar (Sign Up).
2. **Pencarian Event / Discover (`/discover`)**
   - Pengguna dapat mengeksplorasi seluruh event dengan fitur *search bar*.
   - Filter dinamis berdasarkan kategori (misal: Music Concert, Workshop & Training) dan lokasi/kota (misal: Jakarta, Bali, Bandung).
3. **Registrasi & Autentikasi**
   - **Sign Up (`/signup`):** Pembuatan akun pengguna baru.
   - **Sign In (`/signin`):** Otentikasi masuk ke dalam platform.
4. **Verifikasi KYC / Wajah (`/verify-face`)**
   - Wajib dilakukan sebelum bisa melakukan pembelian tiket. Pengguna melakukan unggah/verifikasi wajah (`face_verified_at`) untuk memastikan keamanan akun dan identitas asli (mencegah bot/calo).

---

## TAHAP 2: PEMBELIAN TIKET
Proses pengguna melihat detail informasi acara dan memutuskan untuk membeli tiket.

1. **Halaman Detail Event (`/event/{id}`)**
   - Menampilkan poster/banner, waktu pelaksanaan, kategori, peta lokasi, deskripsi lengkap, dan penyelenggara acara.
   - Menampilkan daftar Tier Tiket (misal: VIP, Regular) beserta sisa kursi (quota) dan harga tiket.
2. **Proses Checkout**
   - Pembelian saat ini dikonfigurasi melalui pemotongan Saldo Wallet (Wallet Balance).
   - Saat pengguna menekan beli, sistem (`CheckoutController`) memvalidasi status KYC wajah terlebih dahulu. Jika belum KYC, pengguna otomatis ditolak (Error 403) dan diarahkan ke halaman verifikasi.
   - Jika saldo cukup dan kursi tersedia, tiket berhasil diterbitkan, saldo dipotong, dan E-Ticket dikirim via Email (melalui Background Job/Mail).

---

## TAHAP 3: MANAJEMEN DOMPET / WALLET
Ekosistem pembayaran mandiri di dalam platform SecureGate untuk kelancaran transaksi di lokasi event (Cashless Experience).

1. **Dashboard Wallet (`/wallet`)**
   - Melihat total Saldo Wallet saat ini.
   - Menampilkan riwayat transaksi (Wallet Transactions) baik itu *top-up*, pengeluaran beli tiket, atau pembayaran di *tenant*.
2. **Top-Up Saldo**
   - Menggunakan Payment Gateway (Midtrans) untuk pengisian dana. Notifikasi sukses ditangani via Webhook latar belakang.
3. **Pembayaran F&B Tenant (Scan QR)**
   - Fitur **Scan QR / Pay** (`/wallet/scan`). Pengguna memindai QR Code milik Tenant/Booth Makanan di area lokasi acara.
   - Diarahkan ke form pembayaran (`/wallet/pay/{tenant_id}`) untuk memasukkan nominal, memotong saldo, dan menyelesaikan transaksi pembelian konsumsi tanpa uang tunai.

---

## TAHAP 4: PENGALAMAN EVENT
Alur pengguna mengakses inventaris tiket mereka sebagai persiapan menuju gerbang masuk (Gate).

1. **Daftar Tiket / My Tickets (`/my-tickets`)**
   - Menampilkan seluruh tiket (Upcoming & Past Events) yang berhasil dibeli dalam format *list/carousel*.
2. **E-Ticket QR Code Publikasi (`/ticket/{id}/qrcode`)**
   - Halaman eksklusif (Privat) untuk satu tiket spesifik.
   - Menampilkan QR Code unik transaksi yang siap dipindai (*scan*) oleh pihak panitia/Penyelenggara di pintu masuk.

---

## TAHAP 5: NETWORKING HUB
Fitur spesial interaktif bagi pengguna untuk terhubung dengan peserta lain, berada langsung di bagian bawah halaman E-Ticket (`/ticket/{id}/qrcode`).

1. **Setup AI Vibe Bio (In-Line Modal)**
   - Pengguna didorong untuk mengisi deskripsi personal atau minat mereka (`vibe_bio`) melalui sebuah Form *Modal (Pop-up)* yang mulus tanpa perlu pindah halaman.
2. **Daftar Peserta Lain (Attendees List)**
   - Sistem menarik daftar peserta lain yang juga membeli tiket untuk event yang sama dan telah mengaktifkan *vibe bio* mereka.
3. **AI Matchmaking**
   - Terdapat tombol khusus (Magic Sparkles) untuk menjalankan analisis pencarian teman pintar berbasis AI (`AiMatchController@findMatch`), menjodohkan pengguna dengan peserta berfrekuensi/minat serupa.

---

## TAHAP 6: SETTINGS
Halaman pengaturan mendasar pengguna.

1. **Edit Profil (`/settings`)**
   - Diakses melalui *Dropdown* Avatar Navbar bagian kanan.
   - Pengguna dapat memperbarui nama lengkap, email, mengganti foto profil (*profile picture*), atau melihat informasi akun dasar.
   - Tombol Logout juga tersedia di *Dropdown* menu ini.
