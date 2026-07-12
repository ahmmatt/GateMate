<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Auth\OrganizerRegisterController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AiMatchController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\EventController as AdminEventController;
use App\Http\Controllers\Api\Admin\ScannerController as AdminScannerController;
use App\Http\Controllers\Api\Admin\FinanceController as AdminFinanceController;
use App\Http\Controllers\Api\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\SuperadminController;
use App\Http\Controllers\Api\OtpController;

// ─── Health Check / Ping ─────────────────────────────────────────────────────
Route::get('/ping', fn () => response()->json([
    'success' => true,
    'message' => 'GateMate API is running.',
    'version' => '1.0.0',
    'timestamp' => now()->toIso8601String(),
]));

Route::get('/test-ngrok', function() {
    $ngrok = @file_get_contents('http://127.0.0.1:4040/api/tunnels');
    $tx = \App\Models\WalletTransaction::where('type', 'topup')->orderBy('id', 'desc')->first();
    return response()->json([
        'ngrok' => json_decode($ngrok, true),
        'last_tx' => $tx
    ]);
});

// ─── Public Routes ────────────────────────────────────────────────────────────
// ⚠️  Dev-only: Reset semua tiket yang sudah di-scan (HANYA untuk environment local)
Route::get('/dev/reset-scanner', function () {
    if (! app()->environment('local', 'testing')) {
        abort(403, 'Endpoint ini hanya tersedia di environment local.');
    }
    \App\Models\Transaction::where('is_used', true)->update(['is_used' => false, 'scanned_at' => null]);
    return response()->json(['message' => 'Semua tiket berhasil di-reset menjadi belum di-scan!']);
});

Route::prefix('events')->name('api.events.')->group(function () {
    Route::get('/', [EventController::class, 'index'])->name('index');
    Route::get('/{id}', [EventController::class, 'show'])->name('show');
});

// ─── Auth Routes (Guest) — Rate Limited ──────────────────────────────────────
Route::prefix('auth')->name('api.auth.')->group(function () {
    // Login: maks 10 percobaan per menit per IP (lindungi brute force)
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('login');

    // Register: maks 5 percobaan per menit per IP
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:5,1')
        ->name('register');

    Route::get('/google/redirect', [AuthController::class, 'googleRedirect'])->name('google.redirect');
    Route::get('/google/callback', [AuthController::class, 'googleCallback'])->name('google.callback');

    // Registrasi organizer: maks 5 percobaan per menit
    Route::post('/register/organizer', [OrganizerRegisterController::class, 'register'])
        ->middleware('throttle:5,1')
        ->name('register.organizer');
});

// ─── Authenticated Routes (Sanctum Bearer Token) ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth (All roles) ──────────────────────────────────────────────────────
    Route::prefix('auth')->name('api.auth.')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/me', [AuthController::class, 'me'])->name('me');
        // OTP: maks 3 kirim per 5 menit, 10 verifikasi per menit
        Route::post('/otp/send', [OtpController::class, 'send'])
            ->middleware('throttle:3,5')
            ->name('otp.send');
        Route::post('/otp/verify', [OtpController::class, 'verify'])
            ->middleware('throttle:10,1')
            ->name('otp.verify');
    });

    // ── User Routes (Ticket Buyers) ───────────────────────────────────────────
    Route::middleware('api.user.role')->group(function () {
        Route::post('/checkout', [CheckoutController::class, 'process'])->name('api.checkout');
        
        Route::prefix('account')->name('api.account.')->group(function () {
            Route::post('/face-capture', [AccountController::class, 'captureFace'])->name('face-capture');
        });

        Route::prefix('my-tickets')->name('api.my-tickets.')->group(function () {
            Route::get('/', [TicketController::class, 'index'])->name('index');
        });

        Route::prefix('tickets')->name('api.tickets.')->group(function () {
            Route::get('/{id}', [TicketController::class, 'show'])->name('show');
            Route::post('/{id}/vibe', [TicketController::class, 'updateVibe'])->name('vibe.update');
            Route::get('/{id}/ai-match', [AiMatchController::class, 'findMatch'])->name('ai-match');
        });

        // AI Matchmaking
        Route::post('/tickets/{id}/vibe', [\App\Http\Controllers\Api\MatchmakingController::class, 'setVibeBio']);
        Route::get('/tickets/{id}/matches', [\App\Http\Controllers\Api\MatchmakingController::class, 'getMatches']);

        // Chat System (GateMate Match)
        Route::get('/chat', [\App\Http\Controllers\Api\ChatController::class, 'getInbox']);
        Route::get('/chat/{partnerId}', [\App\Http\Controllers\Api\ChatController::class, 'getMessages']);
        Route::post('/chat/{partnerId}', [\App\Http\Controllers\Api\ChatController::class, 'sendMessage']);

        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
        Route::post('/notifications/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);


        
        Route::prefix('wallet')->name('api.wallet.')->group(function () {
            Route::post('/topup', [WalletController::class, 'topup'])->name('topup');
            Route::get('/', [WalletController::class, 'index'])->name('index');
            Route::get('/tenant/{id}', [WalletController::class, 'tenantInfo'])->name('tenant-info');
            Route::post('/pay/{id}', [WalletController::class, 'processPayment'])->name('pay');
        });
    });

    // ── Admin Routes (Verified Organizers) ────────────────────────────────────
    Route::middleware('api.organizer.verified')->prefix('admin')->name('api.admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        Route::prefix('events')->name('events.')->group(function () {
            Route::get('/', [AdminEventController::class, 'index'])->name('index');
            Route::post('/', [AdminEventController::class, 'store'])->name('store');
            Route::get('/{id}', [AdminEventController::class, 'show'])->name('show');
            Route::put('/{id}', [AdminEventController::class, 'update'])->name('update');
            Route::delete('/{id}', [AdminEventController::class, 'destroy'])->name('destroy');
            Route::post('/{id}/toggle-status', [AdminEventController::class, 'toggleStatus'])->name('toggle-status');
            
            // Tiers
            Route::post('/{id}/tiers', [AdminEventController::class, 'storeTier'])->name('tiers.store');
            Route::put('/{id}/tiers/{tierId}', [AdminEventController::class, 'updateTier'])->name('tiers.update');
            Route::delete('/{id}/tiers/{tierId}', [AdminEventController::class, 'destroyTier'])->name('tiers.destroy');
            
            // Tenants
            Route::post('/{id}/tenants', [AdminEventController::class, 'storeTenant'])->name('tenants.store');
            Route::put('/{id}/tenants/{tenantId}', [AdminEventController::class, 'updateTenant'])->name('tenants.update');
            Route::delete('/{id}/tenants/{tenantId}', [AdminEventController::class, 'destroyTenant'])->name('tenants.destroy');
            
            // Event Actions
            Route::post('/{eventId}/withdraw/{id}/approve', [AdminEventController::class, 'approveWithdrawal'])->name('withdraw.approve');
            Route::post('/{id}/withdraw', [AdminEventController::class, 'withdrawEvent'])->name('withdraw');
            Route::post('/{eventId}/tickets/{transactionId}/toggle-checkin', [AdminEventController::class, 'toggleCheckIn'])->name('tickets.toggle-checkin');
            Route::post('/{eventId}/tickets/{transactionId}/refund', [AdminEventController::class, 'refundTicket'])->name('tickets.refund');

            // Attendee Approvals
            Route::post('/{eventId}/attendees/{attendeeId}/approve', [AdminEventController::class, 'approveAttendee'])->name('attendees.approve');
            Route::post('/{eventId}/attendees/{attendeeId}/reject', [AdminEventController::class, 'rejectAttendee'])->name('attendees.reject');
        });

        Route::prefix('scanner')->name('scanner.')->group(function () {
            Route::post('/verify', [AdminScannerController::class, 'verifyTicket'])->name('verify');
            Route::post('/approve', [AdminScannerController::class, 'approveTicket'])->name('approve');
        });

        Route::prefix('finance')->name('finance.')->group(function () {
            Route::get('/', [AdminFinanceController::class, 'index'])->name('index');
            Route::post('/withdraw', [AdminFinanceController::class, 'withdraw'])->name('withdraw');
        });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [AdminSettingsController::class, 'index'])->name('index');
            Route::post('/profile', [AdminSettingsController::class, 'updateProfile'])->name('profile.update');
            Route::post('/security', [AdminSettingsController::class, 'updateSecurity'])->name('security.update');
            Route::post('/photo', [AdminSettingsController::class, 'uploadPhoto'])->name('photo.upload');
            Route::get('/sessions', [AdminSettingsController::class, 'getSessions'])->name('sessions.index');
            Route::delete('/sessions/all', [AdminSettingsController::class, 'deleteAllSessions'])->name('sessions.delete-all');
            Route::delete('/sessions/{id}', [AdminSettingsController::class, 'deleteSession'])->name('sessions.delete');
        });
    });

    // ── Tenant Routes ─────────────────────────────────────────────────────────
    Route::middleware('api.tenant.role')->prefix('tenant')->name('api.tenant.')->group(function () {
        Route::get('/dashboard', [TenantController::class, 'dashboard'])->name('dashboard');
        Route::post('/menus', [TenantController::class, 'storeMenu'])->name('menus.store');
        Route::post('/withdraw', [TenantController::class, 'withdraw'])->name('withdraw');
    });

    // ── Superadmin Routes ─────────────────────────────────────────────────────
    Route::middleware('api.superadmin.role')->prefix('superadmin')->name('api.superadmin.')->group(function () {
        Route::get('/dashboard', [SuperadminController::class, 'dashboard'])->name('dashboard');
        
        Route::prefix('withdrawals')->name('withdrawals.')->group(function () {
            Route::get('/', [SuperadminController::class, 'pendingWithdrawals'])->name('index');
            Route::post('/{id}/execute', [SuperadminController::class, 'executeWithdrawal'])->name('execute');
        });

        Route::prefix('organizers')->name('organizers.')->group(function () {
            Route::get('/', [SuperadminController::class, 'organizers'])->name('index');
            Route::post('/{id}/approve', [SuperadminController::class, 'approveOrganizer'])->name('approve');
            Route::post('/{id}/reject', [SuperadminController::class, 'rejectOrganizer'])->name('reject');
        });
    });

});
