# GateMate - Platform Tiket & Event 🎟️

GateMate adalah platform manajemen tiket dan event modern yang dibangun dengan React + Vite.

## 🚀 Tech Stack

- **React 18** - UI Framework
- **Vite 5** - Build Tool
- **React Router DOM v6** - Client-side Routing
- **Tailwind CSS v3** - Styling
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📁 Struktur Folder

```
src/
├── assets/          # Gambar, logo, dan aset statis
├── components/      # Komponen reusable (Navbar, Sidebar, dll)
├── layouts/         # Layout per role (Public, User, Organizer, Admin)
├── pages/           # Halaman per role
│   ├── public/      # Home, Events, Login, Register
│   ├── user/        # Dashboard user, My Tickets
│   ├── organizer/   # Dashboard organizer, Manage Events
│   └── admin/       # Dashboard admin, Reports
├── routes/          # Konfigurasi routing
├── services/        # API client (Axios)
├── data/            # Dummy data untuk development
└── utils/           # Helper functions
```

## ⚡ Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

## 🔧 Konfigurasi

Copy `.env.example` ke `.env` dan sesuaikan:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 👥 Role & Akses

| Role | Path | Deskripsi |
|------|------|-----------|
| Public | `/` | Halaman utama, daftar event |
| User | `/user/*` | Dashboard user, tiket saya |
| Organizer | `/organizer/*` | Kelola event, check-in |
| Admin | `/admin/*` | Statistik, kelola user |

## 🎨 Desain

- Modern glassmorphism design
- Warna tema: Indigo + Purple
- Responsive untuk desktop dan mobile
- Dark mode ready
