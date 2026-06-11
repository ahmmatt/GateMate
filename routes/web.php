<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Aplikasi ini sekarang berjalan sebagai Headless API.
| Semua route fungsional telah dipindahkan ke routes/api.php.
| web.php hanya menyisakan Webhook eksternal (Midtrans) yang
| tidak boleh terkena CSRF / Auth API, serta fallback route.
|
*/

// Webhook Midtrans (No Auth, No CSRF)
Route::post('/webhook/midtrans', [\App\Http\Controllers\CheckoutController::class, 'handleNotification'])
    ->name('webhook.midtrans');

// Fallback Route untuk mengarahkan pengunjung sembarang ke React Frontend
// atau mengembalikan pesan standar bahwa ini adalah API server.
Route::fallback(function () {
    if (request()->expectsJson() || request()->is('api/*')) {
        return response()->json([
            'success' => false,
            'message' => 'Endpoint tidak ditemukan.',
        ], 404);
    }
    
    return response()->json([
        'message' => 'GateMate Headless API Server. Please use the React frontend.',
        'status'  => 'active'
    ], 200);
});