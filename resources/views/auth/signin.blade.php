<!DOCTYPE html><html class="light" lang="id" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Masuk - GateMate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container": "#ffe9e5",
                        "on-tertiary": "#ffffff",
                        "primary-fixed-dim": "#ffb4a7",
                        "secondary-fixed": "#e5e2e1",
                        "tertiary-fixed-dim": "#68d4f3",
                        "outline": "#8f706a",
                        "on-background": "#271815",
                        "surface-tint": "#b62413",
                        "on-error-container": "#93000a",
                        "tertiary-container": "#007f99",
                        "inverse-surface": "#3d2c29",
                        "surface-bright": "#fff8f6",
                        "secondary-fixed-dim": "#c8c6c5",
                        "on-tertiary-fixed": "#001f27",
                        "on-tertiary-container": "#f9fdff",
                        "surface-container-highest": "#f9dcd7",
                        "primary": "#b22110",
                        "on-primary-fixed-variant": "#910900",
                        "inverse-primary": "#ffb4a7",
                        "on-primary-fixed": "#400200",
                        "on-secondary": "#ffffff",
                        "surface-variant": "#f9dcd7",
                        "on-error": "#ffffff",
                        "secondary": "#5f5e5e",
                        "on-tertiary-fixed-variant": "#004e5e",
                        "surface": "#fff8f6",
                        "surface-container-lowest": "#ffffff",
                        "background": "#fff8f6",
                        "on-secondary-fixed-variant": "#474646",
                        "on-surface": "#271815",
                        "outline-variant": "#e3beb8",
                        "on-secondary-fixed": "#1c1b1b",
                        "on-surface-variant": "#5b403c",
                        "error": "#ba1a1a",
                        "tertiary": "#006579",
                        "inverse-on-surface": "#ffedea",
                        "primary-container": "#d63b27",
                        "tertiary-fixed": "#b2ebff",
                        "on-primary": "#ffffff",
                        "surface-container-high": "#ffe2dd",
                        "on-secondary-container": "#656464",
                        "surface-dim": "#f0d4cf",
                        "secondary-container": "#e5e2e1",
                        "on-primary-container": "#fffbff",
                        "surface-container-low": "#fff0ee",
                        "primary-fixed": "#ffdad4",
                        "error-container": "#ffdad6"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "gap-default": "1.25rem",
                        "gap-tight": "1rem",
                        "container-padding": "1.5rem",
                        "card-padding": "0.75rem"
                    },
                    "fontFamily": {
                        "headline-lg-mobile": ["Inter"],
                        "headline-sm": ["Inter"],
                        "headline-md": ["Inter"],
                        "headline-lg": ["Inter"],
                        "caption": ["Inter"],
                        "body-md": ["Inter"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "500"}],
                        "headline-sm": ["16px", {"lineHeight": "1.4", "fontWeight": "500"}],
                        "headline-md": ["20px", {"lineHeight": "1.4", "fontWeight": "500"}],
                        "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "500"}],
                        "caption": ["11px", {"lineHeight": "1.4", "letterSpacing": "0.01em", "fontWeight": "400"}],
                        "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                        "label-md": ["12px", {"lineHeight": "1", "fontWeight": "500"}],
                        "body-lg": ["15px", {"lineHeight": "1.6", "fontWeight": "400"}]
                    }
                },
            },
        }
    </script>
<style>
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid #EBEBEB;
        }
        .coral-pill-primary {
            background-color: #F04E37;
            border-radius: 22px;
            padding: 10px 22px;
            color: white;
            transition: opacity 0.2s;
        }
        .coral-pill-primary:active { opacity: 0.8; }
        .input-base {
            background-color: #F5F5F7;
            border: 1px solid #EBEBEB;
            border-radius: 10px;
            transition: border-color 0.2s;
        }
        .input-base:focus {
            outline: none;
            border-color: #F04E37;
            box-shadow: none;
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col">
<!-- TopNavBar (Logged Out Version - Navigation Suppressed for Login Focus) -->
<header class="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-outline-variant z-50">
<nav class="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
<div class="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">
                GateMate
            </div>
<div class="hidden md:flex gap-gap-default">


</div>
<div class="flex items-center gap-4">
<a href="{{ route('signup') }}" class="font-body-md text-body-md text-primary font-bold">Daftar Sekarang</a>
</div>
</nav>
</header>
<!-- Main Content: Center Split Layout -->
<main class="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
<!-- Atmospheric Background Elements -->
<div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
<div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>
<div class="w-full max-w-[1100px] grid md:grid-cols-2 items-center gap-12 relative z-10">
<!-- Left Side: Branding/Visual -->
<div class="hidden md:flex flex-col gap-6">
<div class="space-y-4">
<h1 class="font-headline-lg text-headline-lg text-on-surface">
                        Keamanan Tanpa Kompromi untuk Setiap Tiket.
                    </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-[440px]">
                        Platform verifikasi tiket digital paling aman di Indonesia. Kelola akses, networking, dan pengalaman acara Anda dalam satu pintu yang terpercaya.
                    </p>
</div>
<div class="relative w-full aspect-square max-w-[400px] rounded-[32px] overflow-hidden border border-outline-variant shadow-sm">
<img class="w-full h-full object-cover" alt="GateMate Branding" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhEgk-WSEpYTR3uBfPtKdaPaGrqMg-IVapxI5irFNLrds4_d7RL2Z_OvCMxNgWZZdhI3CYR8z6iwu5vXp-03VcfR5se3MhTyzrk_J0PePqKXuBrfuQaYw7DNiqk06-RtWzka8yHWeAn9xRX1LKxys15MKjReUsdVr7bwWN3nWMSXdXO8_DQSLNvRibBpUeyWQ-ReGrfVrh22A3tB7FXdUzDKepTWUwWScZEsPOGX_35Q9j8Lnjmj8TUGyMROdSkrwfCXBYNgPuzfM">
</div>
</div>
<!-- Right Side: Login Card -->
<div class="flex justify-center md:justify-end">
<div class="glass-card w-full max-w-[440px] p-8 md:p-10 rounded-[28px] shadow-sm">
<div class="mb-8">
<h2 class="font-headline-md text-headline-md text-on-surface mb-2">Selamat Datang Kembali</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Masuk ke akun Anda untuk mengelola tiket dan networking.</p>
</div>

@if ($errors->any())
    <div class="mb-6 bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
        <span class="material-symbols-outlined">error</span>
        <span>{{ $errors->first() }}</span>
    </div>
@endif

@if (session('status'))
    <div class="mb-6 bg-tertiary-container/20 border border-tertiary text-on-surface px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
        <span class="material-symbols-outlined text-tertiary">info</span>
        <span>{{ session('status') }}</span>
    </div>
@endif

<!-- Social Login -->
<div class="grid grid-cols-2 gap-4 mb-8">
<a href="{{ url('/auth/google') }}" class="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
<img alt="Google" class="w-5 h-5" src="data:image/png;base64,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">
<span class="font-label-md text-label-md text-on-surface">Google</span>
</a>
<a href="#" class="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
<img alt="Apple" class="w-5 h-5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADhklEQVR4AdSZWahNURzGd5TMU0jmEBKZiowpT4ryoBDxgAdTeCISmfKgCCWFEkkpRKHEiykernnI8GBOJIQMhd93b/t2Wu2z91nD3qer77fX2nuv9V//79xjn73WahQ18H9FG+jC57URxkEQFWlgLRk/g3XQGIKoCAOdyfQabIZmID3UIQR5G+hFkrdgNMR6QuUDBFGeBpqT4RnQX4CiXifqawEqeRrYSX6DwNR+84LPeV4GepPUfDB1kAvPIZjyMrCQDM3YSnwl14PKHCQp+HQungY9Av9RvoOroMdiV8okTUy42Idrr+AuHIE50Bq8lGZgCZHfw3GYCkqAItJ/yjFU9Fh8TXkDtsAsmAZroB8kSQkP5sZsOAxvYRs0BSclGehAJCW1h7ITZGkkDZT0UcqTIDPtKStRCxqtAv1OUNjLNKCEawijpCgKk/6aToOZBnYRpTsUKf1WOP82lBqYQtYzoGjt9hmw1MB2n0COfT/S7wI4KzYwkwj9oWjpkeo1ZmxgrlcU986P3LvW9ZQBMb7utPDjH98RlfxwgrSEaqiJ76AyMMA3iEf/oR59a7vKQLvaWuYhlwbDiNoKnCUDlf7sOw+S0lFTzEUp9zNvyYD39zBzlPQGehfqkd6k/F0Z+Fr+diF39A04x0htwFoy8Nm6V/gOAwl5H8aClWRAExWrTjk17kbcBWAlGXhs1SPfxgdsw8vAGzq9hGpL60VXbJOQAfXxeiNUgABYf/oaMzZwSidV5DtjO60XxQbOEiDYch+xbKX59yfbTmofG/jLySGohn4yqPNkKjZAjGiHDlVAU0rNzJyGLjWgNRotODkFcuz0hX5bwVmlBhRE6zu/VCkILad4vQmYBrT0t6mg5DWW83c/ztE0oOtaWbunSs4sDxE/yYDiztMhR/YRW8uQFH4qZ0DbQpMJ/RtCS/tjK0IFLWdA8c9z0GozRVDpw1lNxA0lLKXupDQDCqiJxiQq3yCUtLS+nmAxi6lfBCdlGVDQSxw0+b5NmSU912uiKHpAwx+QpWM0GALOC1yVGCB+pEmPTCzmxPzV1Ku4nufa1GjL/RGgzT2t/U+grvccc9p6h+u6p00R7fhw6qZKDcTR91LpCNr/1S6NZlE9Odfu+1NKU5e5sAw03+1LOQq0w6P1IN3j1E+2BuLRXlC5DpoMUVQkbfLdpKW2rSjCyNVAmNEDRGnwBv4DAAD//44sHKQAAAAGSURBVAMAsy17YX9OrloAAAAASUVORK5CYII=">
<span class="font-label-md text-label-md text-on-surface">Apple</span>
</a>
</div>
<div class="relative mb-8 flex items-center">
<div class="flex-grow border-t border-outline-variant"></div>
<span class="mx-4 font-caption text-caption text-on-surface-variant bg-transparent">atau email</span>
<div class="flex-grow border-t border-outline-variant"></div>
</div>
<!-- Login Form -->
<form class="space-y-5" action="{{ route('signin.process') }}" method="POST">
@csrf
<div class="space-y-1.5">
<label class="font-label-md text-label-md text-on-surface-variant ml-1">Email</label>
<input class="w-full h-12 px-4 input-base text-body-md" name="email" value="{{ old('email') }}" placeholder="nama@email.com" required="" type="email">
</div>
<div class="space-y-1.5">
<div class="flex justify-between items-center px-1">
<label class="font-label-md text-label-md text-on-surface-variant">Password</label>
<a class="font-label-md text-label-md text-primary hover:underline" href="#">Lupa Password?</a>
</div>
<input class="w-full h-12 px-4 input-base text-body-md" name="password" placeholder="••••••••" required="" type="password">
</div>
<button class="w-full coral-pill-primary font-body-md font-bold mt-4 shadow-sm hover:opacity-90" type="submit">
                            Masuk
                        </button>
</form>
<p class="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
                        Belum punya akun? 
                        <a class="text-primary font-bold hover:underline" href="{{ route('signup') }}">Daftar Sekarang</a>
</p>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="w-full mt-auto bg-surface-container-low dark:bg-surface-container-low border-t border-outline-variant">
<div class="flex flex-col md:flex-row justify-between items-center py-8 px-container-padding max-w-[1280px] mx-auto gap-4">
<div class="font-headline-sm text-headline-sm font-bold text-primary">GateMate</div>
<div class="flex flex-wrap justify-center gap-6">
<a class="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Security Standards</a>
<a class="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Us</a>
</div>
<div class="font-caption text-caption text-on-surface-variant opacity-70">
                © 2024 GateMate. All rights reserved.
            </div>
</div>
</footer>
<script>
        // Simple input focus interaction
        const inputs = document.querySelectorAll('.input-base');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('label').classList.add('text-primary');
            });
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('label').classList.remove('text-primary');
            });
        });
    </script>


</body></html>