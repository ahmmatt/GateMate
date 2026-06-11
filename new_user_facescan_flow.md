# Analisis UX/UI & Alur Pemindaian Wajah Pengguna Baru (Onboarding Facial Scan)

## PENDAHULUAN
Fitur **Onboarding Facial Scan** dirancang sebagai lapis pertama pertahanan keamanan biometrik di ekosistem SecureGate/GateMate. Tujuan utamanya adalah untuk memastikan prinsip "Satu Akun, Satu Identitas Unik". Fitur ini bertujuan untuk mengeliminasi calo tiket (*scalpers*), mencegah pencurian akun, serta memberikan pengalaman *Check-In Gate* yang instan tanpa sentuhan (*contactless*) saat hari H acara (*event*). Dengan mengusung gaya visual *futuristic cyberpunk* dipadukan dengan *glassmorphism*, antarmuka ini dirancang tidak hanya untuk mengamankan data, melainkan juga untuk memberikan kesan premium, modern, dan canggih (*wow factor*) kepada pengguna baru.

## TAHAP 1: LAYAR PERSIAPAN (Greeting Screen)
**Tujuan:** Menyambut pengguna, memberikan edukasi awal, dan meminta izin akses kamera dengan cara yang elegan tanpa terasa mengintimidasi.

**Visi Visual (UI):**
- **Background:** Latar belakang *dark mode* pekat (*deep abyss black* `#0a0a0c`) dengan pendaran cahaya neon merah (*primary crimson*) yang sangat halus (*blurred aura*) di sudut-sudut layar.
- **Kartu Glassmorphism:** Sebuah panel *translucent* (semi-transparan) berada di tengah layar, menggunakan efek `backdrop-filter: blur(20px)`. Border kartu ini sangat tipis, dengan gradasi *frosty silver* ke *neon red* yang elegan.
- **Tipografi:** Menggunakan font modern (seperti Inter atau Outfit) dengan warna putih yang tajam (*crisp white*).
- **Elemen Interaktif:** Tombol persetujuan (CTA) "Aktifkan Kamera & Mulai" memiliki efek *glowing* halus dan animasi denyut (*pulse*) yang menandakan teknologi siap diakses.
- **Animasi:** Saat layar dimuat, elemen-elemen muncul dengan efek melayang perlahan dari bawah (*fade up*).

## TAHAP 2: PROSES PEMINDAIAN (Scanning Interface)
**Tujuan:** Menangkap titik-titik biometrik pengguna dengan jelas sambil memberikan umpan balik visual bahwa sistem sedang bekerja.

**Visi Visual (UI):**
- **Camera Feed:** Video kamera memenuhi layar atau berada dalam *clipping mask* berbentuk heksagonal (menambah nuansa *cyberpunk* / *sci-fi*).
- **Overlay Frame:** Sebuah *reticle* atau bingkai penanda wajah muncul di tengah layar. Frame ini berupa sudut-sudut bergaris neon (warna *cyan* atau *crimson red*) yang mendeteksi posisi wajah pengguna.
- **Animasi Pemindaian:** Sebuah garis laser tipis bergerak naik-turun memindai wajah pengguna. Di sekitar wajah, partikel-partikel kecil bercahaya atau jaring-jaring *wireframe* poligonal muncul sekilas saat titik biometrik mulai terpetakan (*Face Mesh mapping*).
- **Indikator Progres:** Lingkaran cincin (*ring progress*) bergaya *holographic* di sekeliling frame wajah yang terisi perlahan seiring berjalannya pemindaian.

## TAHAP 3: VALIDASI LIVENESS
**Tujuan:** Mencegah upaya pemalsuan menggunakan foto, video 2D, atau topeng statis dengan menugaskan aksi seketika kepada pengguna.

**Visi Visual (UI):**
- **Instruksi Dinamis:** Teks holografik yang bersih dan modern melayang di bawah atau di atas frame wajah. Teks ini memiliki animasi ketik (*typewriter effect*) atau efek transisi *glitch* halus khas *cyberpunk*.
  - *"Silakan Berkedip"*
  - *"Tersenyum sedikit..."*
  - *"Perlahan tengok ke kanan"*
- **Umpan Balik Instan:** Saat pengguna berhasil melakukan instruksi, frame neon akan merespon dengan kilatan warna sukses (misal: *electric green*) selama beberapa milidetik, disertai efek suara futuristik yang sangat halus (*soft sci-fi chime*).
- **Koreksi Visual:** Jika pencahayaan kurang, sebuah *toast notification* bermaterial kaca (*glassmorphism*) akan muncul memperingatkan pengguna, *"Pencahayaan terlalu gelap, harap bergerak ke tempat terang."*

## TAHAP 4: STATUS KEBERHASILAN (Success/Error Screen)
**Tujuan:** Memberikan konfirmasi akhir apakah data wajah berhasil dienkripsi dan diamankan atau jika harus mengulang.

**Visi Visual (UI) - Sukses:**
- **Transisi:** Kamera meredup, dan sebuah perisai (*shield*) hologram atau ikon gembok terbuka menjadi tertutup dengan animasi 3D muncul di tengah layar.
- **Teks:** "Identitas Terverifikasi & Terenkripsi." menggunakan font tebal dengan pendaran neon.
- **Feedback:** Seluruh elemen layar bergeser ke warna *success green* yang elegan, diikuti dengan partikel *confetti* digital kecil (elemen debu kosmik/cyber). Tombol CTA berubah menjadi "Masuk ke Dasbor".

**Visi Visual (UI) - Error/Gagal:**
- **Transisi:** Layar berkedip merah lembut. Frame wajah berubah menjadi pola statis atau putus-putus.
- **Teks:** "Pemindaian Tidak Optimal" (Sengaja tidak menggunakan kata "Gagal" agar menghindari rasa intimidasi).
- **Pesan Bantuan:** Kotak *glassmorphism* merah semi-transparan muncul memberikan saran, misal: "Pastikan tidak ada bayangan gelap di wajah Anda" atau "Lepaskan kacamata sementara".
- **Tombol:** Tombol "Pindai Ulang" dengan desain garis tepi neon (*outline button*) berkedip lambat menanti interaksi pengguna.
