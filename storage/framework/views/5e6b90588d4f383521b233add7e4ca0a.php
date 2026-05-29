<!DOCTYPE html>
<html class="light" lang="en" style="">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo $__env->yieldContent('title', 'SecureGate'); ?></title>
    
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
    
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
                    "primary-fixed-dim": "#ffb4a7",
                    "brand-coral": "#F04E37"
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
          },
        },
      }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
    <?php echo $__env->yieldContent('styles'); ?>
</head>
<body class="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">

<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/50">
<div class="flex justify-between items-center px-container-padding py-3 max-w-[1280px] mx-auto">
<div class="flex items-center gap-8">
<a href="/" class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">SecureGate</a>
<nav class="hidden md:flex gap-6 items-center">
    <?php if(auth()->guard()->guest()): ?>
        <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('landing')); ?>">Explore</a>
    <?php else: ?>
        <?php if(Auth::user()->role === 'user'): ?>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('discover')); ?>">Explore</a>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('my-tickets')); ?>">My Tickets</a>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('wallet.index')); ?>">Wallet</a>
        <?php elseif(Auth::user()->role === 'admin'): ?>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('admin.dashboard')); ?>">Dashboard Event</a>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('admin.scanner')); ?>">Scanner</a>
        <?php elseif(Auth::user()->role === 'superadmin'): ?>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('superadmin.dashboard')); ?>">Superadmin Panel</a>
        <?php elseif(Auth::user()->role === 'tenant'): ?>
            <a class="font-body-md text-body-md text-secondary hover:text-primary transition-colors" href="<?php echo e(route('tenant.dashboard')); ?>">Tenant Dashboard</a>
        <?php endif; ?>
    <?php endif; ?>
</nav>
</div>
<div class="flex items-center gap-4">
    <?php if(auth()->guard()->check()): ?>
        <div class="flex items-center gap-4">
            <button class="relative w-10 h-10 flex items-center justify-center text-secondary hover:bg-surface-container-high rounded-full transition-colors">
                <span class="material-symbols-outlined">notifications</span>
                <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            
            <div class="relative group">
                <button class="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-colors">
                    <?php
                        $navPic = Auth::user()->profile_picture ?? null;
                        $navInitial = strtoupper(substr(Auth::user()->full_name ?? 'User', 0, 1));
                    ?>
                    <?php if(!empty($navPic)): ?>
                        <img src="<?php echo e(asset('Media/uploads/' . $navPic)); ?>" class="w-full h-full object-cover" alt="User Profile">
                    <?php else: ?>
                        <div class="w-full h-full bg-primary text-white flex items-center justify-center font-bold"><?php echo e($navInitial); ?></div>
                    <?php endif; ?>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <a href="<?php echo e(url('/settings')); ?>" class="block px-4 py-2 text-on-surface hover:bg-surface-container-low rounded-t-lg">Settings</a>
                    <form method="POST" action="<?php echo e(route('logout')); ?>">
                        <?php echo csrf_field(); ?>
                        <button type="submit" class="block w-full text-left px-4 py-2 text-error hover:bg-surface-container-low rounded-b-lg">Logout</button>
                    </form>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="flex items-center gap-2">
            <a href="<?php echo e(route('signin')); ?>" class="font-body-md text-body-md font-bold text-primary">Sign In</a>
            <a href="<?php echo e(route('signup')); ?>" class="px-4 py-2 bg-primary text-white rounded-full font-label-md text-label-md font-bold hover:bg-surface-tint transition-all">Sign Up</a>
        </div>
    <?php endif; ?>
<div class="md:hidden text-primary">
<span class="material-symbols-outlined">search</span>
</div>
</div>
</div>
</header>

<main class="pt-20 pb-24 md:pb-12 max-w-[1280px] mx-auto px-container-padding min-h-screen">
    <?php echo $__env->yieldContent('content'); ?>
</main>

<!-- Footer -->
<footer class="w-full bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant/20 mb-16 md:mb-0">
<div class="flex flex-col md:flex-row justify-between items-center gap-gap-tight px-container-padding py-8 max-w-[1280px] mx-auto">
<div class="flex flex-col items-center md:items-start gap-2">
<span class="font-headline-sm text-headline-sm font-bold text-primary">SecureGate</span>
<p class="font-caption text-caption text-secondary-fixed-variant">© 2026 SecureGate. All rights reserved.</p>
</div>
<div class="flex flex-wrap justify-center gap-6">
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Privacy Policy</a>
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Terms of Service</a>
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Help Center</a>
<a class="font-caption text-caption text-secondary-fixed-variant hover:text-primary hover:underline decoration-primary transition-colors duration-200" href="#">Contact Us</a>
</div>
</div>
</footer>

<!-- BottomNavBar (Mobile Only) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-container-highest/80 backdrop-blur-md border-t border-outline-variant/30 flex justify-around items-center px-2 py-3 pb-safe">
    <?php if(auth()->guard()->guest()): ?>
        <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('landing')); ?>">
            <span class="material-symbols-outlined">explore</span>
            <span class="">Explore</span>
        </a>
    <?php else: ?>
        <?php if(Auth::user()->role === 'user'): ?>
            <a class="flex flex-col items-center justify-center text-primary dark:text-primary-fixed-dim bg-primary-fixed/20 rounded-full px-3 py-1 font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('discover')); ?>">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">explore</span>
                <span class="">Discover</span>
            </a>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('my-tickets')); ?>">
                <span class="material-symbols-outlined">confirmation_number</span>
                <span class="">My Tickets</span>
            </a>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('wallet.index')); ?>">
                <span class="material-symbols-outlined">account_balance_wallet</span>
                <span class="">Wallet</span>
            </a>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(url('/settings')); ?>">
                <span class="material-symbols-outlined">person</span>
                <span class="">Profile</span>
            </a>
        <?php elseif(Auth::user()->role === 'admin'): ?>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('admin.dashboard')); ?>">
                <span class="material-symbols-outlined">table_chart</span>
                <span class="">Dashboard</span>
            </a>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('admin.scanner')); ?>">
                <span class="material-symbols-outlined">qr_code_scanner</span>
                <span class="">Scanner</span>
            </a>
        <?php elseif(Auth::user()->role === 'superadmin'): ?>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('superadmin.dashboard')); ?>">
                <span class="material-symbols-outlined">admin_panel_settings</span>
                <span class="">Superadmin</span>
            </a>
        <?php elseif(Auth::user()->role === 'tenant'): ?>
            <a class="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md active:bg-surface-container-high transition-all" href="<?php echo e(route('tenant.dashboard')); ?>">
                <span class="material-symbols-outlined">storefront</span>
                <span class="">Tenant</span>
            </a>
        <?php endif; ?>
    <?php endif; ?>
</nav>

<script>
    const heartButtons = document.querySelectorAll('button .material-symbols-outlined');
    heartButtons.forEach(icon => {
        if (icon.innerText === 'favorite') {
            icon.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                const isFilled = icon.style.fontVariationSettings.includes("'FILL' 1");
                icon.style.fontVariationSettings = isFilled ? "'FILL' 0" : "'FILL' 1";
                icon.classList.toggle('text-primary');
            });
        }
    });
</script>

<?php echo $__env->yieldContent('scripts'); ?>

</body>
</html>
<?php /**PATH D:\laragon\www\JVC26\gatemate\resources\views/layouts/app.blade.php ENDPATH**/ ?>