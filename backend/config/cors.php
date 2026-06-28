<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Mengizinkan request dari React SPA (Vite dev: localhost:5173)
    | dan domain produksi. Pastikan SANCTUM_STATEFUL_DOMAINS di .env
    | juga sudah mencantumkan domain frontend.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',   // Vite dev server
        'http://localhost:3000',   // Alternatif React dev
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        // Tambahkan domain produksi di sini jika sudah deploy:
        // 'https://gatemate.yourapp.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Wajib true jika menggunakan Sanctum SPA authentication berbasis cookie.
    | Untuk token-based (Bearer), bisa false — namun kita set true agar
    | fleksibel mendukung keduanya.
    |
    */

    'supports_credentials' => true,

];
