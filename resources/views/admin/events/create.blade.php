<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buat Event Baru – SecureGate Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
            --bg:#060d1a;--surface:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);
            --border-focus:rgba(124,58,237,.55);--purple:#7c3aed;--purple-dim:rgba(124,58,237,.15);
            --purple-border:rgba(124,58,237,.3);--cyan:#06b6d4;--green:#4ade80;
            --text:#e2e8f0;--muted:rgba(226,232,240,.45);--muted2:#475569;
            --input-bg:rgba(255,255,255,.05);--error:#f87171;--error-bg:rgba(248,113,113,.08);
        }
        html,body{min-height:100vh;font-family:'Inter',sans-serif;background:var(--bg);color:var(--text)}
        body::before{content:'';position:fixed;inset:0;pointer-events:none;
            background:radial-gradient(ellipse 60% 40% at 15% 0%,rgba(124,58,237,.12) 0%,transparent 60%),
                        radial-gradient(ellipse 45% 35% at 85% 95%,rgba(6,182,212,.08) 0%,transparent 60%)}

        /* ── Navbar ── */
        .navbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
            padding:0 28px;height:60px;border-bottom:1px solid var(--border);
            backdrop-filter:blur(16px);background:rgba(6,13,26,.8)}
        .brand{font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#a78bfa,var(--cyan));
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .back-link{display:flex;align-items:center;gap:7px;color:var(--muted);text-decoration:none;
            font-size:.85rem;font-weight:500;transition:color .2s}
        .back-link:hover{color:var(--text)}

        /* ── Layout ── */
        .page{max-width:860px;margin:0 auto;padding:40px 24px 80px;position:relative;z-index:1}
        .page-title{font-size:1.6rem;font-weight:800;color:#fff;margin-bottom:6px}
        .page-subtitle{font-size:.875rem;color:var(--muted);margin-bottom:32px}

        /* ── Alerts ── */
        .alert-error{background:var(--error-bg);border:1px solid rgba(248,113,113,.2);border-radius:12px;
            padding:13px 16px;color:var(--error);font-size:.875rem;display:flex;align-items:flex-start;
            gap:10px;margin-bottom:24px}
        .field-error{font-size:.78rem;color:var(--error);margin-top:5px;display:flex;align-items:center;gap:5px}

        /* ── Card sections ── */
        .form-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;
            padding:28px 32px;margin-bottom:20px;backdrop-filter:blur(14px)}
        .card-heading{font-size:.95rem;font-weight:700;color:#fff;margin-bottom:20px;
            display:flex;align-items:center;gap:10px;padding-bottom:14px;border-bottom:1px solid var(--border)}
        .card-heading i{width:30px;height:30px;border-radius:8px;background:var(--purple-dim);
            color:#a78bfa;display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0}

        /* ── Form grid ── */
        .form-row{display:grid;gap:16px;margin-bottom:16px}
        .cols-2{grid-template-columns:1fr 1fr}
        .cols-3{grid-template-columns:1fr 1fr 1fr}
        .form-group{display:flex;flex-direction:column;gap:7px}
        .form-label{font-size:.8rem;font-weight:600;color:var(--muted);letter-spacing:.02em}
        .required-star{color:#ec4899;margin-left:2px}

        /* ── Inputs ── */
        .input-wrap{position:relative}
        .input-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);
            color:var(--muted2);font-size:.85rem;pointer-events:none;transition:color .2s}
        .form-control{width:100%;background:var(--input-bg);border:1px solid var(--border);
            border-radius:11px;padding:11px 14px 11px 38px;font-size:.875rem;font-family:'Inter',sans-serif;
            color:var(--text);outline:none;transition:border-color .25s,box-shadow .25s}
        .form-control::placeholder{color:var(--muted2)}
        .form-control:focus{border-color:var(--purple);box-shadow:0 0 0 3px var(--border-focus)}
        .form-control:focus~.input-icon,.input-wrap:focus-within .input-icon{color:#a78bfa}
        .form-control.no-icon{padding-left:14px}
        select.form-control{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:18px}
        textarea.form-control{padding:12px 14px;min-height:110px;resize:vertical;line-height:1.6}

        /* ── Banner upload ── */
        .upload-zone{border:2px dashed var(--border);border-radius:14px;padding:32px 20px;text-align:center;
            cursor:pointer;transition:border-color .2s,background .2s;position:relative}
        .upload-zone:hover{border-color:var(--purple-border);background:var(--purple-dim)}
        .upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
        .upload-zone-icon{font-size:1.75rem;color:var(--muted2);margin-bottom:10px}
        .upload-zone-text{font-size:.875rem;color:var(--muted);line-height:1.5}
        .upload-zone-text strong{color:#a78bfa}
        #banner-preview{width:100%;max-height:200px;object-fit:cover;border-radius:10px;
            margin-top:12px;display:none;border:1px solid var(--border)}

        /* ── Tier card ── */
        .tier-card{background:rgba(124,58,237,.06);border:1px solid var(--purple-border);
            border-radius:14px;padding:20px 22px}
        .tier-card-title{font-size:.85rem;font-weight:700;color:#a78bfa;margin-bottom:16px;
            display:flex;align-items:center;gap:8px}

        /* ── Toggle ── */
        .toggle-row{display:flex;align-items:center;justify-content:space-between;
            background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:11px;padding:12px 16px}
        .toggle-row label{font-size:.875rem;color:var(--text);cursor:pointer}
        .toggle-switch{position:relative;width:44px;height:24px;flex-shrink:0}
        .toggle-switch input{opacity:0;width:0;height:0}
        .toggle-slider{position:absolute;inset:0;background:rgba(255,255,255,.15);border-radius:24px;
            cursor:pointer;transition:background .25s}
        .toggle-slider::before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;
            background:#fff;border-radius:50%;transition:transform .25s}
        .toggle-switch input:checked+.toggle-slider{background:var(--purple)}
        .toggle-switch input:checked+.toggle-slider::before{transform:translateX(20px)}

        /* ── Submit ── */
        .form-actions{display:flex;align-items:center;gap:14px;margin-top:8px}
        .btn-submit{flex:1;padding:14px;background:linear-gradient(135deg,var(--purple),#5b21b6);
            border:none;border-radius:12px;font-family:'Inter',sans-serif;font-size:.95rem;font-weight:700;
            color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(124,58,237,.4);
            transition:transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-submit:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,.55)}
        .btn-cancel{padding:14px 24px;background:rgba(255,255,255,.05);border:1px solid var(--border);
            border-radius:12px;font-family:'Inter',sans-serif;font-size:.875rem;font-weight:500;
            color:var(--muted);text-decoration:none;transition:background .2s}
        .btn-cancel:hover{background:rgba(255,255,255,.09);color:var(--text)}

        @media(max-width:640px){
            .cols-2,.cols-3{grid-template-columns:1fr}
            .form-card{padding:20px 18px}
        }
    </style>
</head>
<body>

<nav class="navbar">
    <span class="brand">SecureGate</span>
    <a href="{{ route('admin.dashboard') }}" class="back-link">
        <i class="fas fa-arrow-left"></i> Kembali ke Dashboard
    </a>
</nav>

<div class="page">

    <div class="page-title">Buat Event Baru</div>
    <p class="page-subtitle">Isi detail event dan konfigurasi tiket pertama Anda.</p>

    @if($errors->any())
        <div class="alert-error">
            <i class="fas fa-circle-exclamation" style="margin-top:2px;flex-shrink:0"></i>
            <span>{{ $errors->first() }}</span>
        </div>
    @endif

    <form id="event-form" action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        {{-- ── 1. Informasi Dasar ─── --}}
        <div class="form-card">
            <div class="card-heading">
                <i class="fas fa-circle-info"></i> Informasi Dasar
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Judul Event <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-heading input-icon"></i>
                        <input type="text" name="title" class="form-control @error('title') is-error @enderror"
                            placeholder="Contoh: Spektra Music Festival 2026" value="{{ old('title') }}" required>
                    </div>
                    @error('title')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                </div>
            </div>

            <div class="form-row cols-2">
                <div class="form-group">
                    <label class="form-label">Kategori <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-tag input-icon"></i>
                        <select name="category" class="form-control" required>
                            <option value="" disabled {{ old('category') ? '' : 'selected' }}>Pilih kategori</option>
                            @foreach(['Music','Technology','Sports','Art','Food','Business','Education','Health','Community','Other'] as $cat)
                                <option value="{{ $cat }}" {{ old('category') === $cat ? 'selected' : '' }}>{{ $cat }}</option>
                            @endforeach
                        </select>
                    </div>
                    @error('category')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                </div>
                <div class="form-group">
                    <label class="form-label">Tipe Lokasi <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-location-dot input-icon"></i>
                        <select name="location_type" id="location_type" class="form-control" required>
                            <option value="offline" {{ old('location_type','offline') === 'offline' ? 'selected' : '' }}>Offline (Tatap Muka)</option>
                            <option value="online"  {{ old('location_type') === 'online' ? 'selected' : '' }}>Online (Virtual)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-row" id="offline-fields">
                <div class="form-group">
                    <label class="form-label">Nama Venue</label>
                    <div class="input-wrap">
                        <i class="fas fa-building input-icon"></i>
                        <input type="text" name="venue_name" class="form-control"
                            placeholder="Contoh: Istora Senayan" value="{{ old('venue_name') }}">
                    </div>
                </div>
                <div class="form-row cols-2" style="margin-bottom:0">
                    <div class="form-group">
                        <label class="form-label">Kota</label>
                        <div class="input-wrap">
                            <i class="fas fa-city input-icon"></i>
                            <select name="city" class="form-control">
                                <option value="">Pilih kota</option>
                                @foreach(['Jakarta','Bali','Bandung','Surabaya','Yogyakarta','Makassar','Medan','Semarang'] as $city)
                                    <option value="{{ $city }}" {{ old('city') === $city ? 'selected' : '' }}>{{ $city }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="maps_link" class="form-label">Tautan Peta Lokasi / URL Embed Iframe</label>
                        <div class="input-group">
                            <span class="input-icon"><i class="fa-solid fa-map"></i></span>
                            <input type="text" name="maps_link" class="form-control" 
                                placeholder="https://maps.google.com/... atau paste tag <iframe src='...'>" value="{{ old('maps_link') }}">
                        </div>
                        <small style="color:var(--muted); font-size:0.75rem; display:block; margin-top:4px;">
                            Sistem otomatis akan mengkonversi tag iframe atau mendeteksi link embed dari Google Maps.
                        </small>
                    </div>
                </div>
            </div>

            <div class="form-group" style="margin-bottom:16px">
                <label class="form-label">Detail Lokasi / Link Meeting <span class="required-star">*</span></label>
                <div class="input-wrap">
                    <i class="fas fa-map-pin input-icon" style="top:14px;transform:none"></i>
                    <textarea name="location_details" class="form-control"
                        placeholder="Alamat lengkap atau link Zoom/Meet/YouTube Live">{{ old('location_details') }}</textarea>
                </div>
                @error('location_details')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
            </div>

            <div class="form-group">
                <label class="form-label">Deskripsi Event</label>
                <textarea name="description" class="form-control no-icon" rows="4"
                    placeholder="Ceritakan tentang event ini, apa yang akan terjadi, siapa yang diundang...">{{ old('description') }}</textarea>
            </div>
        </div>

        {{-- ── 2. Waktu ─── --}}
        <div class="form-card">
            <div class="card-heading">
                <i class="fas fa-clock"></i> Waktu Pelaksanaan
            </div>
            <div class="form-row cols-2">
                <div class="form-group">
                    <label class="form-label">Tanggal Mulai <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-calendar input-icon"></i>
                        <input type="date" name="start_date" class="form-control"
                            value="{{ old('start_date') }}" required>
                    </div>
                    @error('start_date')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                </div>
                <div class="form-group">
                    <label class="form-label">Jam Mulai <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-clock input-icon"></i>
                        <input type="time" name="start_time" class="form-control"
                            value="{{ old('start_time') }}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Tanggal Selesai <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-calendar-check input-icon"></i>
                        <input type="date" name="end_date" class="form-control"
                            value="{{ old('end_date') }}" required>
                    </div>
                    @error('end_date')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                </div>
                <div class="form-group">
                    <label class="form-label">Jam Selesai <span class="required-star">*</span></label>
                    <div class="input-wrap">
                        <i class="fas fa-clock input-icon"></i>
                        <input type="time" name="end_time" class="form-control"
                            value="{{ old('end_time') }}" required>
                    </div>
                </div>
            </div>
            <div class="form-row cols-2">
                <div class="form-group">
                    <label class="form-label">Timezone</label>
                    <div class="input-wrap">
                        <i class="fas fa-globe input-icon"></i>
                        <select name="timezone" class="form-control">
                            @foreach(['GMT+07:00 (WIB)'=>'GMT+07:00','GMT+08:00 (WITA)'=>'GMT+08:00','GMT+09:00 (WIT)'=>'GMT+09:00'] as $label => $val)
                                <option value="{{ $val }}" {{ old('timezone','GMT+08:00') === $val ? 'selected' : '' }}>{{ $label }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {{-- ── 3. Kapasitas & Pengaturan ─── --}}
        <div class="form-card">
            <div class="card-heading">
                <i class="fas fa-sliders"></i> Kapasitas & Pengaturan
            </div>
            <div class="form-row cols-2" style="margin-bottom:16px">
                <div class="form-group">
                    <label class="form-label">Tipe Kapasitas</label>
                    <div class="input-wrap">
                        <i class="fas fa-users input-icon"></i>
                        <select name="capacity_type" id="capacity_type" class="form-control">
                            <option value="unlimited" {{ old('capacity_type','unlimited') === 'unlimited' ? 'selected' : '' }}>Tidak Terbatas</option>
                            <option value="limited"   {{ old('capacity_type') === 'limited' ? 'selected' : '' }}>Terbatas</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" id="max-cap-group" style="display:none">
                    <label class="form-label">Maks. Kapasitas</label>
                    <div class="input-wrap">
                        <i class="fas fa-hashtag input-icon"></i>
                        <input type="number" name="max_capacity" class="form-control"
                            min="1" placeholder="500" value="{{ old('max_capacity') }}">
                    </div>
                </div>
            </div>
            <div class="toggle-row">
                <label for="require_approval">Pendaftaran memerlukan persetujuan manual</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="require_approval" name="require_approval" value="1"
                        {{ old('require_approval') ? 'checked' : '' }}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>

        {{-- ── 4. Banner ─── --}}
        <div class="form-card">
            <div class="card-heading">
                <i class="fas fa-image"></i> Gambar Event
            </div>
            <div class="form-row cols-2">
                <div class="form-group">
                    <label class="form-label">Banner Event</label>
                    <div class="upload-zone" id="upload-zone-banner">
                        <input type="file" name="banner_image" id="banner_input" accept="image/*">
                        <div class="upload-zone-icon"><i class="fas fa-cloud-arrow-up"></i></div>
                        <div class="upload-zone-text">
                            <strong>Klik upload Banner</strong><br>
                            Maks 4MB. Rasio 16:9.
                        </div>
                        <img id="banner-preview" src="" alt="Preview">
                    </div>
                    @error('banner_image')<div class="field-error" style="margin-top:8px"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                </div>
                <div class="form-group">
                    <label class="form-label">Poster 1:1 (Opsional)</label>
                    <div class="upload-zone" id="upload-zone-poster">
                        <input type="file" name="poster_image" id="poster_input" accept="image/*">
                        <div class="upload-zone-icon"><i class="fas fa-square-plus"></i></div>
                        <div class="upload-zone-text">
                            <strong>Klik upload Poster</strong><br>
                            Maks 4MB. Rasio 1:1.
                        </div>
                        <img id="poster-preview" src="" alt="Preview">
                    </div>
                    @error('poster_image')<div class="field-error" style="margin-top:8px"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                </div>
            </div>
        </div>

        {{-- ── 4b. Custom Questions ─── --}}
        <div class="form-card">
            <div class="card-heading">
                <i class="fas fa-clipboard-question"></i> Pertanyaan Kustom
            </div>
            <p style="font-size:.825rem;color:var(--muted);margin-bottom:16px">
                Tambahkan pertanyaan yang harus diisi oleh peserta saat mendaftar tiket.
            </p>
            <div id="cq-container">
                <!-- Dynamic fields here -->
            </div>
            <button type="button" id="btn-add-cq" class="btn-cancel" style="display:inline-flex;align-items:center;gap:6px;padding:10px 16px;margin-top:8px;">
                <i class="fas fa-plus"></i> Tambah Pertanyaan
            </button>
        </div>

        {{-- ── 5. Tier Tiket ─── --}}
        <div class="form-card">
            <div class="card-heading">
                <i class="fas fa-ticket"></i> Tiket (Tier Pertama)
            </div>
            <p style="font-size:.825rem;color:var(--muted);margin-bottom:20px">
                Anda bisa menambah tier tiket tambahan (VIP, Early Bird, dll.) setelah event dibuat.
            </p>
            <div class="tier-card">
                <div class="tier-card-title"><i class="fas fa-layer-group"></i> Tier Tiket</div>
                <div class="form-row cols-3">
                    <div class="form-group">
                        <label class="form-label">Nama Tier <span class="required-star">*</span></label>
                        <div class="input-wrap">
                            <i class="fas fa-tag input-icon"></i>
                            <input type="text" name="tier_name" class="form-control"
                                placeholder="General Admission" value="{{ old('tier_name') }}" required>
                        </div>
                        @error('tier_name')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label">Harga (Rp) <span class="required-star">*</span></label>
                        <div class="input-wrap">
                            <i class="fas fa-coins input-icon"></i>
                            <input type="number" name="price" class="form-control"
                                min="0" step="1000" placeholder="0" value="{{ old('price', 0) }}" required>
                        </div>
                        @error('price')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                    </div>
                    <div class="form-group" style="display:flex;flex-direction:column;justify-content:space-between">
                        <label class="form-label" style="display:flex;align-items:center;justify-content:space-between;">
                            <span>Kuota <span class="required-star" id="quota-star">*</span></span>
                            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;color:var(--cyan);font-weight:600;font-size:0.75rem">
                                <input type="checkbox" name="is_unlimited" id="is_unlimited" value="1" {{ old('is_unlimited') ? 'checked' : '' }}>
                                Unlimited
                            </label>
                        </label>
                        <div class="input-wrap" id="quota-wrap">
                            <i class="fas fa-users input-icon"></i>
                            <input type="number" name="quota" id="tier_quota" class="form-control"
                                min="1" placeholder="100" value="{{ old('quota') }}">
                        </div>
                        @error('quota')<div class="field-error"><i class="fas fa-triangle-exclamation"></i>{{ $message }}</div>@enderror
                    </div>
                </div>
            </div>
        </div>

        {{-- Actions --}}
        <div class="form-actions">
            <a href="{{ route('admin.dashboard') }}" class="btn-cancel">Batal</a>
            <button type="submit" class="btn-submit" id="submit-btn">
                <i class="fas fa-paper-plane"></i> Publikasikan Event
            </button>
        </div>

    </form>
</div>

<script>
// ── Banner & Poster preview ──────────────────────────────────────────────────────────
document.getElementById('banner_input').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const preview = document.getElementById('banner-preview');
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
});
document.getElementById('poster_input').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const preview = document.getElementById('poster-preview');
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
});

// ── Custom Questions Dynamic Fields ──────────────────────────────────────────
const cqContainer = document.getElementById('cq-container');
const btnAddCq = document.getElementById('btn-add-cq');
let cqCount = 0;

function addCqField(value = '') {
    cqCount++;
    const wrap = document.createElement('div');
    wrap.className = 'form-row';
    wrap.style.gridTemplateColumns = '1fr auto';
    wrap.style.alignItems = 'center';
    wrap.innerHTML = `
        <div class="form-group">
            <div class="input-wrap">
                <i class="fas fa-question-circle input-icon"></i>
                <input type="text" name="custom_questions[]" class="form-control" placeholder="Contoh: Apa ukuran baju Anda?" value="${value}">
            </div>
        </div>
        <button type="button" class="btn-cancel btn-rm-cq" style="padding:10px;color:var(--red);border-color:rgba(248,113,113,0.2);"><i class="fas fa-trash"></i></button>
    `;
    cqContainer.appendChild(wrap);
    
    wrap.querySelector('.btn-rm-cq').addEventListener('click', function() {
        wrap.remove();
    });
}

btnAddCq.addEventListener('click', () => addCqField());

// ── Location type toggle ────────────────────────────────────────────────────
const locType    = document.getElementById('location_type');
const offFields  = document.getElementById('offline-fields');
function toggleLocFields() {
    offFields.style.display = locType.value === 'offline' ? '' : 'none';
}
locType.addEventListener('change', toggleLocFields);
toggleLocFields();

// ── Capacity type toggle ────────────────────────────────────────────────────
const capType  = document.getElementById('capacity_type');
const maxGrp   = document.getElementById('max-cap-group');
capType.addEventListener('change', () => {
    maxGrp.style.display = capType.value === 'limited' ? '' : 'none';
});
if (capType.value === 'limited') maxGrp.style.display = '';

// ── Tier Unlimited Toggle ────────────────────────────────────────────────────
const isUnlim = document.getElementById('is_unlimited');
const quotaWrap = document.getElementById('quota-wrap');
const tierQuota = document.getElementById('tier_quota');
const quotaStar = document.getElementById('quota-star');
function toggleUnlimited() {
    if (isUnlim.checked) {
        quotaWrap.style.display = 'none';
        quotaStar.style.display = 'none';
        tierQuota.removeAttribute('required');
    } else {
        quotaWrap.style.display = '';
        quotaStar.style.display = 'inline';
        tierQuota.setAttribute('required', 'true');
    }
}
isUnlim.addEventListener('change', toggleUnlimited);
toggleUnlimited();

// ── Submit loader ──────────────────────────────────────────────────────────
document.getElementById('event-form').addEventListener('submit', function () {
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mempublikasikan...';
});
</script>

</body>
</html>
