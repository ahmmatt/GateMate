<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Daftar - GateMate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-secondary-fixed": "#1c1b1b",
                    "surface-tint": "#b62413",
                    "surface-container-high": "#ffe2dd",
                    "secondary": "#5f5e5e",
                    "inverse-primary": "#ffb4a7",
                    "secondary-container": "#e5e2e1",
                    "on-primary": "#ffffff",
                    "on-tertiary": "#ffffff",
                    "inverse-on-surface": "#ffedea",
                    "outline": "#8f706a",
                    "surface-container-low": "#fff0ee",
                    "secondary-fixed": "#e5e2e1",
                    "on-surface-variant": "#5b403c",
                    "surface-dim": "#f0d4cf",
                    "on-secondary-container": "#656464",
                    "tertiary": "#006579",
                    "on-secondary": "#ffffff",
                    "surface-variant": "#f9dcd7",
                    "on-tertiary-fixed-variant": "#004e5e",
                    "on-error-container": "#93000a",
                    "secondary-fixed-dim": "#c8c6c5",
                    "on-primary-fixed-variant": "#910900",
                    "surface-container-lowest": "#ffffff",
                    "on-background": "#271815",
                    "inverse-surface": "#3d2c29",
                    "outline-variant": "#e3beb8",
                    "surface-container": "#ffe9e5",
                    "tertiary-fixed": "#b2ebff",
                    "on-error": "#ffffff",
                    "on-surface": "#271815",
                    "surface-bright": "#fff8f6",
                    "on-primary-container": "#fffbff",
                    "surface": "#fff8f6",
                    "error": "#ba1a1a",
                    "on-secondary-fixed-variant": "#474646",
                    "error-container": "#ffdad6",
                    "surface-container-highest": "#f9dcd7",
                    "on-primary-fixed": "#400200",
                    "primary": "#b22110",
                    "primary-container": "#d63b27",
                    "on-tertiary-container": "#f9fdff",
                    "primary-fixed": "#ffdad4",
                    "tertiary-fixed-dim": "#68d4f3",
                    "on-tertiary-fixed": "#001f27",
                    "tertiary-container": "#007f99",
                    "background": "#fff8f6",
                    "primary-fixed-dim": "#ffb4a7"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "card-padding": "0.75rem",
                    "gap-tight": "1rem",
                    "gap-default": "1.25rem",
                    "container-padding": "1.5rem"
            },
            "fontFamily": {
                    "body-md": ["Inter"],
                    "label-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "body-lg": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "headline-md": ["Inter"],
                    "caption": ["Inter"],
                    "headline-sm": ["Inter"]
            },
            "fontSize": {
                    "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                    "label-md": ["12px", {"lineHeight": "1", "fontWeight": "500"}],
                    "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                    "body-lg": ["15px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "500"}],
                    "headline-md": ["20px", {"lineHeight": "1.4", "fontWeight": "500"}],
                    "caption": ["11px", {"lineHeight": "1.4", "letterSpacing": "0.01em", "fontWeight": "400"}],
                    "headline-sm": ["16px", {"lineHeight": "1.4", "fontWeight": "500"}]
            }
          }
        }
      };
    </script>
<style>
        body { background-color: #F9F9F9; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .tap-highlight-transparent { -webkit-tap-highlight-color: transparent; }
        input:focus { outline: none !important; }
    </style>
</head>
<body class="font-body-md text-on-surface">
<!-- TopNavBar -->
<header class="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/50">
<nav class="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
<div class="flex items-center gap-8">
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">GateMate</span>
<div class="hidden md:flex items-center gap-6">

</div>
</div>
<div class="flex items-center gap-4">
<a class="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1" href="{{ route('signin') }}">Masuk</a>
<button class="md:hidden flex items-center justify-center p-2 text-secondary">
<span class="material-symbols-outlined">menu</span>
</button>
</div>
</nav>
</header>
<main class="min-h-screen flex items-center justify-center pt-20 pb-12 px-container-padding">
<!-- Sign Up Card -->
<div class="bg-white w-full max-w-[440px] rounded-[14px] border border-[#EBEBEB] p-8 md:p-10 transition-all duration-300">
<div class="text-center mb-8">
<h1 class="font-headline-md text-headline-md text-on-surface mb-2">Buat Akun Baru</h1>
<p class="font-body-md text-body-md text-secondary">Lengkapi data diri untuk mulai mengamankan tiket Anda.</p>
</div>
<form action="{{ route('signup.process') }}" method="POST" class="space-y-5">
@csrf
<!-- Nama Lengkap -->
<div class="space-y-1.5">
<label class="font-label-md text-label-md text-secondary ml-1" for="full_name">Nama Lengkap</label>
<input class="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-[#F04E37] transition-colors" id="full_name" name="full_name" placeholder="Contoh: Budi Santoso" type="text" value="{{ old('full_name') }}" required>
@error('full_name')
<div class="text-red-600 text-sm mt-1">{{ $message }}</div>
@enderror
</div>
<!-- Email -->
<div class="space-y-1.5">
<label class="font-label-md text-label-md text-secondary ml-1" for="email">Email</label>
<input class="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-[#F04E37] transition-colors" id="email" name="email" placeholder="name@example.com" type="email" value="{{ old('email') }}" required>
@error('email')
<div class="text-red-600 text-sm mt-1">{{ $message }}</div>
@enderror
</div>
<!-- Gender -->
<div class="space-y-1.5">
<label class="font-label-md text-label-md text-secondary ml-1" for="gender">Jenis Kelamin</label>
<div class="relative">
<select id="gender" name="gender" class="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-[#F04E37] transition-colors appearance-none cursor-pointer" required>
<option value="" disabled {{ old('gender') ? '' : 'selected' }}>Pilih jenis kelamin</option>
<option value="Male" {{ old('gender') === 'Male' ? 'selected' : '' }}>Laki-laki</option>
<option value="Female" {{ old('gender') === 'Female' ? 'selected' : '' }}>Perempuan</option>
</select>
<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
<span class="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
</div>
</div>
@error('gender')
<div class="text-red-600 text-sm mt-1">{{ $message }}</div>
@enderror
</div>
<!-- Password -->
<div class="space-y-1.5">
<label class="font-label-md text-label-md text-secondary ml-1" for="password">Password</label>
<div class="relative">
<input class="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-[#F04E37] transition-colors pr-10" id="password" name="password" placeholder="Minimal 8 karakter" type="password" required>
<button class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary flex items-center justify-center" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
@error('password')
<div class="text-red-600 text-sm mt-1">{{ $message }}</div>
@enderror
</div>
<!-- Konfirmasi Password -->
<div class="space-y-1.5">
<label class="font-label-md text-label-md text-secondary ml-1" for="confirm_password">Konfirmasi Password</label>
<div class="relative">
<input class="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-[#F04E37] transition-colors pr-10" id="confirm_password" name="password_confirmation" placeholder="Ulangi password" type="password" required>
<button class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary flex items-center justify-center" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
@error('password_confirmation')
<div class="text-red-600 text-sm mt-1">{{ $message }}</div>
@enderror
</div>
<!-- Action Button -->
<button class="w-full bg-[#F04E37] text-white py-3 rounded-full font-label-md text-body-md font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-4" type="submit">
                    Buat Akun
                </button>
</form>
<div class="mt-8 text-center">
<p class="font-body-md text-body-md text-secondary">
                    Sudah punya akun? 
                    <a class="text-[#F04E37] font-semibold hover:underline decoration-[#F04E37] transition-all ml-1" href="{{ route('login') }}">Masuk</a>
</p>
</div>
<!-- Terms check -->
<div class="mt-8 pt-6 border-t border-[#EBEBEB] text-center">
<p class="font-caption text-caption text-secondary px-4">
                    Dengan mendaftar, Anda menyetujui <a class="underline" href="#">Syarat &amp; Ketentuan</a> serta <a class="underline" href="#">Kebijakan Privasi</a> GateMate.
                </p>
</div>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant/20 w-full mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center gap-gap-tight px-container-padding py-8 max-w-[1280px] mx-auto">
<div class="flex flex-col items-center md:items-start gap-2">
<span class="font-headline-sm text-headline-sm font-bold text-primary">GateMate</span>
<p class="font-caption text-caption text-secondary dark:text-secondary-fixed-dim">© 2024 GateMate. All rights reserved.</p>
</div>
<div class="flex gap-6 flex-wrap justify-center">
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Help Center</a>
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary transition-colors duration-200" href="#">Contact Us</a>
</div>
</div>
</footer>
<script>
        // Micro-interactions for form fields
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const label = input.closest('.space-y-1.5').querySelector('label');
                if (label) label.classList.replace('text-secondary', 'text-primary');
            });
            input.addEventListener('blur', () => {
                const label = input.closest('.space-y-1.5').querySelector('label');
                if (label) label.classList.replace('text-primary', 'text-secondary');
            });
        });
        // Toggle Password Visibility
        const visibilityBtns = document.querySelectorAll('button .material-symbols-outlined');
        visibilityBtns.forEach(icon => {
            if (icon.textContent === 'visibility') {
                icon.parentElement.addEventListener('click', () => {
                    const input = icon.parentElement.previousElementSibling;
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.textContent = 'visibility_off';
                    } else {
                        input.type = 'password';
                        icon.textContent = 'visibility';
                    }
                });
            }
        });
    </script>
</body>
</html>
