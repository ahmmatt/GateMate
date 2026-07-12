# 🔥 FIX ERROR: @vitejs/plugin-react can't detect preamble

## ❌ Error yang Terjadi

```
Uncaught Error: @vitejs/plugin-react can't detect preamble. Something is wrong.
at MaterialIcon.jsx:14:1
```

---

## ✅ SOLUSI (Ikuti Step-by-Step)

### Step 1: Stop Semua Server

**Terminal 1 (Vite)**: Tekan `Ctrl+C`  
**Terminal 2 (Laravel)**: Tekan `Ctrl+C`

### Step 2: Run FIX Script

Jalankan file batch yang sudah saya buat:

```bash
FIX_NOW.bat
```

Atau manual:

```bash
# Clear Vite cache
rmdir /s /q node_modules\.vite

# Clear build
rmdir /s /q public\build

# Clear Laravel cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### Step 3: Restart Vite (PENTING!)

**Terminal 1**:
```bash
npm run dev
```

**Tunggu sampai muncul**:
```
➜  Local:   http://localhost:5173/
➜  ready in XXX ms
```

⚠️ **JANGAN LANJUT** sebelum Vite selesai loading!

### Step 4: Restart Laravel

**Terminal 2** (terminal baru):
```bash
php artisan serve
```

**Tunggu sampai muncul**:
```
Server running on [http://127.0.0.1:8000]
```

### Step 5: Hard Refresh Browser

1. Buka: `http://localhost:8000/dashboard`
2. Tekan: `Ctrl+Shift+R` (PENTING: Hard refresh!)
3. Atau: `Ctrl+F5`
4. Tunggu 5-10 detik

### Step 6: Check Console

Tekan `F12` → Console tab

**✅ Harus muncul**:
```
🚀 app.jsx loaded!
📦 App element found: <div id="app"></div>
✅ React app rendered successfully!
```

**❌ Jika masih error**: Screenshot console dan lanjut ke Step 7

---

## 🆘 Jika Masih Error

### Option A: Reinstall Node Modules (Nuclear Option)

```bash
# Stop semua server (Ctrl+C)

# Hapus node_modules
rmdir /s /q node_modules

# Hapus package-lock.json
del package-lock.json

# Reinstall
npm install

# Restart Vite
npm run dev

# Di terminal lain, restart Laravel
php artisan serve
```

Tunggu proses install selesai (bisa 2-5 menit), lalu:
1. Buka `http://localhost:8000/dashboard`
2. Hard refresh: `Ctrl+Shift+R`

---

### Option B: Check Vite Version

Mungkin ada konflik versi. Check version:

```bash
npm list @vitejs/plugin-react
```

**Should be**: `6.0.2` atau `^6.0.0`

Jika berbeda, install ulang:

```bash
npm install @vitejs/plugin-react@latest
npm run dev
```

---

### Option C: Manual Fix Each Component

Jika error masih di `MaterialIcon.jsx`, coba ganti isi file:

**File**: `resources/js/components/Common/MaterialIcon.jsx`

```jsx
export default function MaterialIcon({ icon, fill = false, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {icon}
    </span>
  );
}
```

**Hapus** `import React from 'react';` di baris pertama karena React 19 tidak perlu lagi.

---

## 📝 Checklist

Centang yang sudah dilakukan:

- [ ] Stop Vite (Ctrl+C)
- [ ] Stop Laravel (Ctrl+C)
- [ ] Run `FIX_NOW.bat` atau clear cache manual
- [ ] Restart Vite: `npm run dev`
- [ ] Tunggu Vite ready
- [ ] Restart Laravel: `php artisan serve`
- [ ] Tunggu Laravel ready
- [ ] Open `http://localhost:8000/dashboard`
- [ ] Hard refresh: `Ctrl+Shift+R`
- [ ] Check Console (F12)
- [ ] Dashboard muncul? ✅

---

## 🎯 Yang Harus Terlihat Setelah Fix

### Di Terminal Vite:
```
VITE v8.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Di Browser Console:
```
🚀 app.jsx loaded!
📦 App element found: <div id="app"></div>
✅ React app rendered successfully!
```

### Di Browser (Visual):
- ✅ Header: "Halo, Budi Santoso! 👋"
- ✅ 3 stat cards visible
- ✅ Wallet card dengan saldo
- ✅ Daftar 3 tiket
- ✅ Timeline 4 aktivitas
- ✅ Warna & styling lengkap

---

## 📸 Screenshot Jika Masih Error

Jika setelah semua langkah di atas masih error, screenshot:

1. **Browser Console** (F12 → Console) - FULL ERROR
2. **Terminal Vite output** - Complete log
3. **Terminal Laravel output**
4. **Browser Network tab** (F12 → Network, filter "app.jsx")

Kirim semua screenshot untuk analisis lebih lanjut.

---

## 💡 Penjelasan Error

Error "can't detect preamble" terjadi karena:

1. **Vite React plugin** tidak bisa mendeteksi file JSX dengan benar
2. **Cache corrupt** - Cache Vite menyimpan file lama yang error
3. **Version mismatch** - React 19 dengan plugin yang tidak compatible

**Fix yang sudah dilakukan**:
- ✅ Update `vite.config.js` dengan konfigurasi JSX yang lebih eksplisit
- ✅ Tambah esbuild loader untuk `.jsx` files
- ✅ Tambah debug logs di `app.jsx`
- ✅ Buat script `FIX_NOW.bat` untuk clear cache

---

## ✅ Setelah Dashboard Muncul

Test fitur-fitur ini:

1. Navigasi Home ↔ Dashboard
2. Filter tabs di My Tickets
3. Tombol Topup (modal muncul?)
4. Mobile responsive (F12 → Device toolbar)
5. Scroll smooth
6. All styling loaded

---

**Status**: Fix Ready  
**Priority**: HIGH  
**Estimated Fix Time**: 5 minutes  

Jalankan `FIX_NOW.bat` sekarang dan hard refresh browser! 🚀

