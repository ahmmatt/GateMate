<!DOCTYPE html><html class="light" lang="id" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fbf9f8;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface-variant": "#5b403c",
                        "surface-container-high": "#e9e8e7",
                        "secondary-fixed": "#e5e2e1",
                        "error-container": "#ffdad6",
                        "surface-dim": "#dbdad9",
                        "surface-container-highest": "#e4e2e2",
                        "on-tertiary-fixed": "#001f27",
                        "on-tertiary-container": "#f9fdff",
                        "surface": "#fbf9f8",
                        "surface-bright": "#fbf9f8",
                        "tertiary": "#006579",
                        "on-secondary": "#ffffff",
                        "on-secondary-container": "#656464",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-fixed": "#400200",
                        "primary-fixed-dim": "#ffb4a7",
                        "on-error-container": "#93000a",
                        "on-secondary-fixed": "#1c1b1b",
                        "primary-fixed": "#ffdad4",
                        "tertiary-container": "#007f99",
                        "primary-container": "#d63b27",
                        "error": "#ba1a1a",
                        "inverse-on-surface": "#f2f0f0",
                        "secondary": "#5f5e5e",
                        "primary": "#b22110",
                        "background": "#fbf9f8",
                        "outline-variant": "#e3beb8",
                        "outline": "#8f706a",
                        "on-surface": "#1b1c1c",
                        "surface-container": "#efeded",
                        "inverse-primary": "#ffb4a7",
                        "secondary-fixed-dim": "#c8c6c5",
                        "on-primary-container": "#fffbff",
                        "on-primary": "#ffffff",
                        "tertiary-fixed": "#b2ebff",
                        "on-secondary-fixed-variant": "#474646",
                        "tertiary-fixed-dim": "#68d4f3",
                        "surface-variant": "#e4e2e2",
                        "on-primary-fixed-variant": "#910900",
                        "surface-tint": "#b62413",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-tertiary-fixed-variant": "#004e5e",
                        "secondary-container": "#e5e2e1",
                        "on-background": "#1b1c1c",
                        "inverse-surface": "#303031",
                        "surface-container-low": "#f5f3f3"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "sidebar-width": "240px",
                        "stack-sm": "8px",
                        "stack-md": "16px",
                        "page-padding": "24px",
                        "max-container": "1200px",
                        "gutter": "16px",
                        "stack-lg": "24px"
                    },
                    "fontFamily": {
                        "body-sm": ["Inter"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "h1": ["Inter"],
                        "h1-mobile": ["Inter"],
                        "h2": ["Inter"],
                        "caption": ["Inter"],
                        "h3": ["Inter"]
                    },
                    "fontSize": {
                        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "label-md": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                        "body-lg": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "h1": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                        "h1-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "500"}],
                        "h2": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "500"}],
                        "caption": ["11px", {"lineHeight": "14px", "fontWeight": "400"}],
                        "h3": ["20px", {"lineHeight": "28px", "fontWeight": "500"}]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center p-page-padding">
<!-- Header / Branding -->
<header class="mb-stack-lg text-center">
<h1 class="font-h1 text-h1 font-black text-primary tracking-tighter">SecureGate</h1>
<p class="font-body-sm text-body-sm text-secondary mt-1">Daftar sebagai Penyelenggara Event</p>
</header>
<!-- Registration Card -->
<main class="w-full max-w-[900px] bg-white border-[0.5px] border-outline-variant rounded-xl overflow-hidden">
<form class="flex flex-col" method="POST" action="{{ route('organizer.register.process') }}" enctype="multipart/form-data" novalidate>
@csrf
<input type="hidden" name="role" value="organizer">
<!-- Two Column Section -->
<div class="grid grid-cols-1 md:grid-cols-2">
<!-- Left Column: Akun -->
<section class="p-stack-lg border-b md:border-b-0 md:border-r-[0.5px] border-outline-variant">
<div class="flex items-center gap-2 mb-stack-md">
<span class="material-symbols-outlined text-primary" data-icon="person">person</span>
<h2 class="font-h3 text-h3 font-bold text-on-surface">Akun</h2>
</div>
<div class="space-y-stack-md">
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Nama Lengkap</label>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: John Doe" type="text" name="full_name" value="{{ old('full_name') }}" required>
@error('full_name')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Email</label>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="nama@email.com" type="email" name="email" value="{{ old('email') }}" required>
@error('email')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Password</label>
<div class="relative">
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" type="password" name="password" required>
<button class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface" type="button">
<span class="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
</button>
</div>
@error('password')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Konfirmasi Password</label>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" type="password" name="password_confirmation" required>
</div>
</div>
</section>
<!-- Right Column: Organisasi -->
<section class="p-stack-lg">
<div class="flex items-center gap-2 mb-stack-md">
<span class="material-symbols-outlined text-primary" data-icon="corporate_fare">corporate_fare</span>
<h2 class="font-h3 text-h3 font-bold text-on-surface">Organisasi</h2>
</div>
<div class="space-y-stack-md">
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Nama Organisasi/EO</label>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Contoh: Maju Bersama Entertainment" type="text" name="organization_name" value="{{ old('organization_name') }}" required>
@error('organization_name')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Nomor Telepon</label>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="0812xxxx" type="tel" name="phone" value="{{ old('phone') }}" required>
@error('phone')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Handle Instagram</label>
<div class="flex">
<span class="inline-flex items-center px-3 rounded-l-lg border-y-[0.5px] border-l-[0.5px] border-outline-variant bg-surface-container text-secondary font-label-md text-label-md">@</span>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-r-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="username" type="text" name="ig_handle" value="{{ ltrim(old('ig_handle', ''), '@') }}" required>
</div>
@error('ig_handle')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
<div class="flex flex-col gap-1">
<label class="font-label-md text-label-md text-secondary">Handle TikTok</label>
<div class="flex">
<span class="inline-flex items-center px-3 rounded-l-lg border-y-[0.5px] border-l-[0.5px] border-outline-variant bg-surface-container text-secondary font-label-md text-label-md">@</span>
<input class="w-full bg-surface-container-low border-[0.5px] border-outline-variant rounded-r-lg px-4 py-2.5 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="username" type="text" name="tiktok_handle" value="{{ ltrim(old('tiktok_handle', ''), '@') }}" required>
</div>
@error('tiktok_handle')
<div class="field-error"><i class="fas fa-triangle-exclamation"></i> {{ $message }}</div>
@enderror
</div>
</div>
</section>
</div>
<!-- Bottom Section: Legalitas -->
<section class="px-stack-lg pb-stack-lg pt-0">
<div class="border-t-[0.5px] border-outline-variant pt-stack-lg">
<label class="font-label-md text-label-md text-secondary mb-2 block">Legalitas Penyelenggara</label>
<div class="w-full border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-primary-fixed transition-colors rounded-xl flex flex-col items-center justify-center py-8 px-stack-lg cursor-pointer group"><span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors mb-2 text-[32px]" data-icon="cloud_upload">cloud_upload</span>
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium">Upload Foto KTP dan E-tanda tangan digital</span>
<input class="hidden" type="file" name="ktp_document" accept="image/*,.pdf" required>
</div>
</div>
<div class="mt-stack-lg flex flex-col gap-4">
<button class="w-full bg-primary text-on-primary py-3.5 rounded-lg font-h3 text-h3 font-bold active:scale-[0.98] transition-transform shadow-sm hover:opacity-90" type="submit">
                        Daftar sebagai Penyelenggara
                    </button>
<div class="text-center">
<span class="font-body-sm text-body-sm text-secondary">Sudah punya akun? </span>
<a class="font-body-sm text-body-sm text-primary font-bold hover:underline" href="{{ route('signin') }}">Masuk</a>
</div>
</div>
</section>
</form>
</main>
<!-- Footer Copyright -->
<footer class="mt-stack-lg">
<p class="font-caption text-caption text-secondary">© 2024 SecureGate Indonesia. Semua Hak Dilindungi.</p>
</footer>
<script>
        // Simple Interaction for File Upload Area
        const uploadArea = document.querySelector('.border-dashed');
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                uploadArea.querySelector('input').click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('bg-primary-fixed');
                uploadArea.classList.add('border-primary');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('bg-primary-fixed');
                uploadArea.classList.remove('border-primary');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('bg-primary-fixed');
                uploadArea.classList.remove('border-primary');
                // Handle files here if needed
            });
        }

        // Form Submission visual feedback
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.innerText = 'Memproses...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerText = 'Daftar sebagai Penyelenggara';
                btn.disabled = false;
            }, 2000);
        });
    </script>



</body></html>
