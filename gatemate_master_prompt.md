# SecureGate (GateMate) - Master Prompt for Frontend Prototype Generation

## 1. KONTEKS APLIKASI
Proyek ini adalah "SecureGate" (atau GateMate), sebuah platform ticketing enterprise yang didesain khusus dengan sistem "anti-calo". Aplikasi ini bertujuan untuk memastikan setiap tiket dibeli dan digunakan oleh orang yang tepat dengan memanfaatkan teknologi verifikasi identitas (biometrik wajah). Platform ini memfasilitasi berbagai aktor, namun fokus utama purwarupa ini adalah pengalaman Pembeli Tiket (User) dan Pengelola Platform (Superadmin).

## 2. VISI DESAIN VISUAL
Tampilan antarmuka (UI) harus memberikan kesan modern, premium, futuristik, dan highly secure (sangat aman). Ikuti panduan visual berikut:
- **Gaya Utama:** Glassmorphism. Gunakan efek kaca buram (background blur / `backdrop-filter`), transparansi (translucent cards), dan border tipis dengan opasitas rendah untuk elemen-elemen UI seperti panel, modal, dan navigasi.
- **Skema Warna:**
  - **Background:** Gelap (Dark mode eksklusif) dengan gradien halus (misalnya: perpaduan Deep Navy Blue `#0a0f1a` dan Midnight Black `#000000`).
  - **Aksen / Highlight:** Gaya Cyberpunk atau Neon. Gunakan warna menyala untuk tombol, indikator status, border aktif, dan hover effects. Contoh warna: Neon Cyan `#00f3ff`, Electric Purple `#bc13fe`, atau Neon Green `#00ff66` untuk status sukses.
- **Tipografi:** Gunakan font Sans-Serif yang bersih, modern, dan geometris (seperti Inter, Roboto, atau Orbitron untuk heading/angka) agar terlihat teknologis.
- **Interaksi & Animasi:** Tambahkan *micro-animations* yang mulus (smooth transitions) saat interaksi hover pada kartu, perpindahan antar view/halaman, dan khususnya pada animasi saat simulasi pemindaian wajah.

## 3. ALUR KERJA (WORKFLOW) UTAMA
Bagi purwarupa menjadi dua mode atau area utama yang dapat dinavigasikan:

**A. Alur User (Pembeli Tiket):**
1. **Dashboard User:** Halaman beranda yang menampilkan daftar event-event unggulan dalam bentuk grid/kartu bergaya glassmorphism.
2. **Detail & Pilih Event:** Saat sebuah kartu event diklik, tampilkan detail event tersebut beserta tombol "Beli Tiket".
3. **Pemindaian Wajah Pertama Kali (Biometrik WebRTC/Canvas):** Ketika tombol beli diklik, user wajib melalui layar verifikasi wajah. Buat simulasi UI untuk ini: sebuah area kotak/lingkaran seolah-olah frame kamera, lengkap dengan animasi garis *scanner* yang bergerak naik-turun dan penanda sudut neon.
4. **Pembelian Berhasil:** Setelah simulasi wajah divalidasi (berikan jeda/timer beberapa detik), tampilkan status berhasil dan konfirmasi bahwa tiket telah diamankan.

**B. Alur Superadmin (Pengelola Platform):**
1. **Dashboard Analitik:** Menampilkan metrik utama platform dalam bentuk kartu/widget indikator angka (Total Transaksi, Pengguna Aktif, Total Penyelenggara).
2. **Approval KYC Penyelenggara:** Tampilkan antarmuka berbentuk list/tabel yang berisi antrean penyelenggara event yang menunggu verifikasi identitas (Sediakan tombol *Approve* dan *Reject* bergaya neon).
3. **Approval Penarikan Dana (Withdrawal):** Tampilkan tabel permintaan pencairan dana dari penyelenggara ke rekening bank mereka (Sediakan tombol *Approve* dan *Reject*).

## 4. INSTRUKSI GENERASI UNTUK AI
Buatkan saya aplikasi web single-page (SPA) fungsional menggunakan HTML, CSS, dan JavaScript murni berdasarkan spesifikasi di atas. Buat navigasi antar halamannya berfungsi, dan buat simulasi UI untuk fitur scanner wajah. Pastikan semua elemen UI menerapkan efek glassmorphism dengan estetika dark/cyberpunk sesuai panduan visual. Strukturkan kodenya dengan rapi agar mudah diedit atau dikembangkan lebih lanjut.
