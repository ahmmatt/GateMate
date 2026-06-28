# SecureGate: Organizer Journey Flow (Admin Dashboard)

## PENDAHULUAN
Dokumen ini disusun sebagai acuan utama (blueprint) untuk perombakan UI/UX eksternal Dasbor Penyelenggara (Organizer/Admin) di platform SecureGate. Analisis ini mendokumentasikan seluruh alur kerja (*flow*), endpoint, dan kapabilitas sistem yang sudah eksis di backend Laravel. Tim UI/UX dapat menggunakan dokumen ini di Stitch atau Figma untuk memastikan desain antarmuka yang baru tidak memutus *business logic* yang sudah berjalan.

---

## TAHAP 1: ONBOARDING & VERIFIKASI
Tahap awal bagi calon Penyelenggara untuk mendaftar dan mendapatkan akses ke Dasbor Utama.

1. **Pendaftaran (Sign Up)**
   - **Route:** `GET /register/organizer` & `POST /register/organizer`
   - **Controller:** `OrganizerRegisterController`
   - **Data yang dikumpulkan:**
     - Nama Lengkap (`full_name`)
     - Email (`email`)
     - Password (`password`)
     - Nama Organisasi/Event Organizer (`organization_name`)
     - Nomor Telepon (`phone`)
     - Dokumen Legalitas/KTP (`ktp_document` - format JPG/PNG/PDF)
     - Handle Instagram (`ig_handle`)
     - Handle TikTok (`tiktok_handle`)
   - **Proses:** Setelah submit, akun dibuat dengan status _pending approval_ dari Superadmin.

2. **Halaman Menunggu (Pending Verification)**
   - **Route:** `GET /organizer/pending`
   - **Kondisi:** Jika pengguna *login* namun status akunnya belum diverifikasi oleh Superadmin, mereka akan dicegat oleh middleware (`organizer.verified`) dan diarahkan ke halaman ini.
   - **Flow:** Menampilkan pesan edukasi bahwa data sedang direview. Pengguna tidak bisa mengakses `/admin/*` sampai disetujui.

---

## TAHAP 2: DASBOR UTAMA
Pusat kendali dan ringkasan analitik bagi Penyelenggara setelah akun disetujui.

- **Route:** `GET /admin/dashboard`
- **Controller:** `DashboardController@index`
- **Metrik & Data yang Ditampilkan:**
  1. **Statistik Event:** Total event yang pernah dibuat dan total event yang saat ini sedang aktif (*active*).
  2. **Penjualan Tiket:** Total tiket terjual (berdasarkan transaksi *success*).
  3. **Pendapatan Tiket (*Gross*):** Total pendapatan kotor dari penjualan tiket.
  4. **Kalkulasi Keuangan Ringkas:**
     - Pemotongan *Platform Fee* (secara default 10% atau sesuai konfigurasi).
     - Potongan keuntungan dari Tenant F&B (*Tenant Cut*).
     - **Net Income (Pendapatan Bersih):** (Pendapatan Kotor - Platform Fee) + Tenant Cut.
  5. **Status Penarikan:**
     - Total saldo yang sudah ditarik (*Withdrawal History*).
     - Saldo yang masih bisa ditarik (*Withdrawable Balance*).
  6. **Check-in Hari Ini:** Jumlah peserta yang berhasil di-scan (*checked in*) pada hari tersebut.
  7. **Grafik Tren Pendapatan:** Tren pendapatan 6 bulan terakhir untuk visualisasi performa.

---

## TAHAP 3: MANAJEMEN EVENT
Alur pengelolaan acara (CRUD: Create, Read, Update, Delete) oleh Penyelenggara.

- **Routes:** `Resource /admin/events` (kecuali index karena ada custom route)
- **Controller:** `Admin\EventController`

1. **Membuat & Mengedit Event (Create / Update)**
   - **Input Utama:** Judul Event, Kategori, Deskripsi, Tanggal Mulai, Waktu Mulai.
   - **Lokasi:** Nama Venue (atau Kota), Tautan Google Maps (`maps_link`), dan Detail Lokasi.
   - **Media:** Unggah *Banner Image* untuk halaman Event Detail.
   - **Pertanyaan Tambahan (*Custom Questions*):** Penyelenggara dapat membuat daftar pertanyaan khusus yang wajib diisi oleh pembeli saat *checkout* (misal: "Apa motivasi Anda ikut event ini?").

2. **Daftar Event (Read)**
   - Menampilkan semua event yang dimiliki oleh Penyelenggara tersebut.
   - Menyediakan aksi untuk *Edit*, *Delete*, atau melihat detail komprehensif dari setiap event.

---

## TAHAP 4: MANAJEMEN TIKET & PESERTA
Pengelolaan kategori tiket, inventaris, dan validasi peserta secara manual.

- **Controller:** `Admin\EventController` (Di dalam halaman Detail Event)

1. **Manajemen Kategori/Tier Tiket**
   - Penyelenggara dapat membuat berbagai kategori tiket (misal: VIP, Regular, Early Bird).
   - Menentukan Harga (`price`) dan Kuota/Stok (`remaining_seats`).
   - Opsi *Unlimited* (tanpa batas kuota).

2. **Manajemen Peserta (Attendees)**
   - Melihat daftar pembeli tiket yang transaksinya berhasil.
   - **Toggle Check-in:** Aksi manual untuk menandai peserta sudah hadir atau membatalkan kehadirannya (`POST /admin/events/{event}/tickets/{transaction}/toggle-checkin`).
   - **Refund Tiket:** Membatalkan tiket dan memproses pengembalian dana jika terjadi kesalahan atau *force majeure* (`POST /admin/events/{id}/tickets/{transactionId}/refund`).

---

## TAHAP 5: MANAJEMEN TENANT
Kolaborasi dengan *merchant* atau penjual makanan/minuman (F&B) di dalam lokasi event.

1. **Menambah/Menyetujui Tenant**
   - **Route:** `POST /admin/events/{id}/tenants`
   - **Proses:** Penyelenggara dapat mengundang atau menambahkan akun pengguna lain sebagai Tenant yang terafiliasi dengan event tertentu.
2. **Memantau Penjualan Tenant**
   - Pendapatan Tenant dari pengunjung (yang membayar menggunakan fitur dompet/wallet SecureGate) akan masuk ke catatan transaksi event.
   - Sistem secara otomatis menghitung *Revenue Split* / *Tenant Cut* antara Tenant dan Penyelenggara.

---

## TAHAP 6: SCANNER & GATE
Aplikasi pemindai (QR Code) khusus bagi penjaga gerbang (Gate Keeper/Admin) di lokasi acara.

- **Routes:** `GET /admin/scanner`, `POST /admin/scanner/validate`, `POST /admin/scanner/approve`
- **Controller:** `Admin\ScannerController`
- **Flow Kerja:**
  1. Admin membuka halaman pemindai berbasis kamera (*browser*).
  2. Kamera memindai *QR Code* E-Ticket milik peserta.
  3. Sistem memvalidasi token (*Validate*): memastikan tiket valid, belum digunakan, dan sesuai dengan event yang sedang berlangsung.
  4. Jika tiket valid, sistem menampilkan data wajah/profil peserta untuk pencocokan visual (KYC) oleh petugas gerbang.
  5. Petugas menekan "Approve" untuk meresmikan *check-in* (mengubah status tiket menjadi terpakai / *is_used* = true).

---

## TAHAP 7: KEUANGAN & PENARIKAN (WITHDRAWAL)
Alur pencairan dana dari sistem SecureGate ke rekening pribadi Penyelenggara atau persetujuan pencairan Tenant.

1. **Penarikan Dana Penyelenggara ke Superadmin**
   - **Route:** `POST /admin/events/{id}/withdraw`
   - **Proses:** Setelah event selesai atau saldo bersih (*Net Income*) mencukupi, Penyelenggara mengajukan *Withdrawal*.
   - Status penarikan berubah menjadi `pending_superadmin` dan menunggu transfer manual dari Superadmin platform.

2. **Persetujuan Penarikan Tenant**
   - **Route:** `POST /admin/events/{eventId}/withdraw/{id}/approve`
   - **Proses:** Jika Tenant F&B ingin mencairkan pendapatannya, mereka mengajukan *withdraw*. Penyelenggara bertindak sebagai pihak yang meng-approve pengajuan tersebut sebelum dana dilepas.

---
**Dokumen ini merepresentasikan konfigurasi backend Laravel per Mei 2026. Desain antarmuka baru harus dapat melayani fungsionalitas di atas secara menyeluruh.**
