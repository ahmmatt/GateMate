# 1. PERAN AI
Bertindaklah sebagai Expert Frontend Developer. Buat sebuah aplikasi web purwarupa (prototype) satu halaman (Single Page App) menggunakan HTML, CSS, dan JavaScript murni. Aplikasi ini bernama "GateMate" (SecureGate), sebuah platform ticketing enterprise dengan fitur verifikasi identitas (anti-calo).

# 2. TEMA VISUAL BARU
Wajibkan penggunaan tema "White Coral Red":
- **Latar Belakang:** Dominan putih bersih/terang (`#ffffff`) atau *off-white* (`#f8f9fa`) untuk memberikan kesan bersih, profesional, dan lapang.
- **Aksen & Sorotan:** Gunakan warna Merah Coral yang elegan (misalnya `#FF6F61` atau `#E65A4F`) sebagai warna utama untuk tombol, tautan aktif, ikon, *badge* status, dan elemen sorotan interaktif lainnya.
- **Gaya Elemen:** Terapkan desain modern dan elegan. Gunakan bayangan halus (*soft drop shadows*) pada kartu atau panel untuk memberikan kedalaman, sudut membulat (*rounded corners*), serta sedikit efek *glassmorphism* (transparansi dengan *backdrop-filter blur*) pada area navigasi (*navbar*) atau *modal*.
- **Tipografi:** Gunakan *font* sans-serif yang modern (seperti Inter, Poppins, atau Roboto) dengan warna teks gelap (abu-abu tua, misalnya `#333333`) untuk kontras yang baik di atas latar terang.

# 3. ALUR KERJA (WORKFLOW) & HALAMAN
Aplikasi ini hanya memiliki satu file HTML (`index.html`). JavaScript bertugas mensimulasikan perpindahan halaman dengan metode menyembunyikan/menampilkan *div container* (`display: none` / `display: block`). 
Sediakan menu navigasi yang bisa membuka bagian-bagian berikut:
1. **Landing Page:** Beranda sambutan dengan *Hero Section* (judul besar, subjudul, dan tombol CTA "Jelajahi Event").
2. **Halaman Daftar Event:** Menampilkan daftar event dalam bentuk antarmuka *grid* berisi kartu (*card*). Setiap kartu berisi gambar (gunakan *placeholder*), judul, tanggal, lokasi, dan tombol "Beli Tiket".
3. **Scanner Wajah / Verifikasi (Simulasi):** Ketika pengguna mengklik "Beli Tiket", sebuah *modal* atau *overlay* muncul menampilkan simulasi pemindaian wajah biometrik. Buat UI kamera (kotak pemindai, garis animasi yang bergerak naik-turun, efek *scanning*). Setelah jeda 3 detik (`setTimeout`), tampilkan pesan "Verifikasi Berhasil" dan arahkan ke Dasbor User.
4. **Dasbor User (Tiket Saya):** Menampilkan daftar tiket yang berhasil diklaim/dibeli oleh pengguna dalam bentuk daftar atau kartu yang lebih ringkas.
5. **Dasbor Superadmin:** Area khusus admin untuk memantau platform. Harus memuat:
   - *Widget* ringkasan (Total Event, Tiket Terjual).
   - Tabel "Approval KYC Penyelenggara" (menampilkan daftar penyelenggara yang mengajukan verifikasi, beserta tombol Approve/Reject).
   - Tabel "Approval Penarikan Dana" (menampilkan permintaan penarikan saldo/dana, beserta tombol Approve/Reject).

# 4. DATA SIMULASI
Untuk membuat antarmuka terlihat hidup secara otomatis tanpa *backend*, buat *dummy data* di dalam variabel *array* JavaScript. Render data ini secara dinamis ke DOM:
- **Data Event:** *Array of objects* untuk merender daftar event (ID, nama, tanggal, lokasi, URL gambar *dummy*, harga).
- **Data Tiket User:** *Array* berisi riwayat tiket milik pengguna.
- **Data Superadmin:** *Array* untuk *dummy* antrean KYC (nama EO, dokumen) dan antrean penarikan dana (nama EO, jumlah dana, tanggal pengajuan).
Pastikan *state* sederhana dikelola di JavaScript (misal saat *Approve* diklik, baris tersebut hilang dari tabel).
