# Dokumentasi Arsitektur Keamanan Navigasi (Role-Based Access Control)

## PENDAHULUAN
Dokumen ini disusun untuk menguraikan struktur hak akses dan peta navigasi di platform SecureGate. Analisis ini memecah akses pengguna berdasarkan 4 role utama: Superadmin, Admin/Penyelenggara, Tenant, dan User/Pembeli, beserta akses Guest (belum login). Tujuan utama dokumen ini adalah untuk memastikan tidak ada celah keamanan (overlapping middleware/route) sebelum mengeksekusi modifikasi keamanan apa pun.

## PETA HAK AKSES & NAVIGASI

### 1. SUPERADMIN
*   **Akses Halaman**: Panel kontrol pusat superadmin (`/superadmin/dashboard`).
*   **Menu Navigasi**: Dashboard Utama, Persetujuan Pendaftaran Penyelenggara (Approve/Reject), Eksekusi Final Penarikan Dana Event (Withdrawal).
*   **Halaman Dilarang**: Rute frontend pembeli dan transaksi reguler (kecuali jika bertindak sebagai user biasa).
*   **⚠️ Status Keamanan**: *Lihat bagian Konflik. Saat ini rute rentan.*

### 2. ADMIN / PENYELENGGARA
*   **Akses Halaman**: Admin Panel (`/admin/*`), Aplikasi Scanner QR (`/admin/scanner` atau `/scanner`).
*   **Menu Navigasi**: Manajemen Event (CRUD), Manajemen Tiket (Refund, Check-In manual), Manajemen Tenant per Event, Persetujuan Penarikan Dana Tenant, dan Aplikasi Scanner tiket.
*   **Syarat Khusus**: Wajib melewati middleware `organizer.verified` (Penyelenggara yang sudah divalidasi dan disetujui Superadmin). Jika belum disetujui, hanya bisa mengakses `/organizer/pending`.

### 3. TENANT
*   **Akses Halaman**: Tenant Dashboard khusus F&B (`/tenant/dashboard`), Manajemen Menu/Produk (`/tenant/menu`), Pengajuan Penarikan Dana ke Penyelenggara (`/tenant/withdraw`).
*   **Syarat Khusus**: Wajib melewati middleware `tenant.role`.
*   **Menu Navigasi**: Dasbor Tenant, Laporan Penjualan/Wallet, Katalog Menu F&B, Ajukan Penarikan Dana.

### 4. USER / PEMBELI
*   **Akses Halaman**: Halaman Publik (`/`, `/event/{id}`, `/discover`), Checkout Tiket, KYC/Verifikasi Wajah (`/verify-face`), Dompet Digital (`/wallet`, `/wallet/pay/{id}`), My Tickets, E-Ticket & Networking Hub (`/ticket/{id}/qrcode`), setup Vibe Bio, dan Fitur AI Matchmaking.
*   **Syarat Khusus**: Hanya membutuhkan middleware `auth` standar.
*   **Menu Navigasi**: Discover, My Tickets, Wallet, Pengaturan Profil. Sama sekali tidak boleh mengakses `/admin/*`, `/tenant/*`, atau `/superadmin/*`.

### 5. GUEST (Belum Login)
*   **Akses Halaman**: Halaman Publik/Landing (`/`), Detail Event Publik (`/event/{id}`), Endpoint Webhook Midtrans (`/webhook/midtrans`).
*   **Autentikasi**: Sign In (`/signin`), Sign Up (`/signup`), Pendaftaran Penyelenggara Baru (`/register/organizer`).
*   **Syarat Khusus**: Dilindungi middleware `guest`. Dilarang keras mengakses fitur checkout, tiket, dompet, atau dashboard mana pun.

---

## CEK KONFLIK MIDDLEWARE & VULNERABILITAS
Dari analisis komprehensif terhadap file `routes/web.php`, ditemukan beberapa anomali, celah keamanan, dan tumpang tindih middleware yang WAJIB diperbaiki:

1.  **🔴 KRITIKAL: Vulnerabilitas Akses Superadmin**
    *   **Isu**: Route group `superadmin` (`/superadmin/*` baris 120-129) saat ini **HANYA** dilindungi oleh middleware `auth` standar. Tidak ada pengecekan spesifik apakah user yang login tersebut memiliki role `superadmin`.
    *   **Dampak**: Setiap pengguna/pembeli biasa yang mendaftar dan login, dapat mengetik `/superadmin/dashboard` di URL dan mengeksekusi aksi fatal seperti menyetujui penyelenggara fiktif atau mencairkan dana.
    *   **Solusi**: Harus segera dibuat dan diimplementasikan middleware `superadmin.role` ke grup rute tersebut.

2.  **🟠 WARNING: Duplikasi Route Scanner (Redundansi)**
    *   **Isu**: Terdapat rute `ScannerController` di dalam grup `/scanner` (baris 79-84) dan rute yang fungsinya identik di grup `/admin/scanner` menggunakan `AdminScannerController` (baris 102-105). Keduanya menggunakan middleware `organizer.verified`.
    *   **Dampak**: Membingungkan secara UX dan memecah basis kode (merusak prinsip DRY - Don't Repeat Yourself). Jika ada update algoritma scanning, harus diubah di dua tempat.
    *   **Solusi**: Hapus salah satu rute (sebaiknya satukan di bawah panel `/admin/scanner` sebagai satu pintu akses bagi Penyelenggara).

3.  **🟡 NOTICE: Pengamanan Bypass KYC Checkout**
    *   **Isu**: Route `/checkout` (baris 48) hanya dilindungi oleh `auth`. Jika perlindungan verifikasi KTP/Wajah (KYC) hanya dilakukan di level UI (menyembunyikan tombol), *attacker* masih bisa mengirim *request* POST langsung ke endpoint checkout.
    *   **Solusi**: Menambahkan middleware khusus (misal: `kyc.verified`) atau validasi mutlak di dalam controller `CheckoutController@process` untuk mencegah bypass checkout.
