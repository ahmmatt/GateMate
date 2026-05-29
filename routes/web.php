<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\ScannerController as AdminScannerController;
use App\Http\Controllers\AiMatchController;
use App\Http\Controllers\Auth\OrganizerRegisterController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ScannerController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PublicEventController;

// ─── Public Routes ──────────────────────────────────────────────────────────

Route::get('/', [PublicEventController::class, 'index'])->name('landing');
Route::get('/event/{id}', [EventController::class, 'show'])->name('event.show');

// Webhook Midtrans (No Auth, No CSRF)
Route::post('/webhook/midtrans', [CheckoutController::class, 'handleNotification'])->name('webhook.midtrans');

// ─── Auth Routes (Guest Only) ────────────────────────────────────────────────

Route::middleware('guest')->group(function () {
    Route::get('/signin',  [AuthController::class, 'showSignIn'])->name('signin');
    Route::post('/signin', [AuthController::class, 'processSignIn'])->name('signin.process');

    Route::get('/signup',  [AuthController::class, 'showSignUp'])->name('signup');
    Route::post('/signup', [AuthController::class, 'processSignUp'])->name('signup.process');

    // ─── Organizer (Admin) Registration ──────────────────────────────────────
    Route::get('/register/organizer',  [OrganizerRegisterController::class, 'show'])->name('organizer.register');
    Route::post('/register/organizer', [OrganizerRegisterController::class, 'register'])->name('organizer.register.process');
});

// ─── Authenticated Routes ─────────────────────────────────────────────────────

Route::middleware('auth')->group(function () {
    Route::post('/logout',      [AuthController::class, 'logout'])->name('logout');
    
    // ─── Normal User Routes (Buyers/Attendees) ─────────────────────────────────
    Route::middleware('user.role')->group(function () {
        Route::get('/discover',     [PageController::class, 'discover'])->name('discover');

        // Checkout
        Route::post('/checkout',    [CheckoutController::class, 'process'])->name('checkout.process');

        // Face Verification (KYC Blocker)
        Route::get('/verify-face',          fn () => view('auth.verify_face'))->name('verify.face');
        Route::post('/verify-face/capture', [AccountController::class, 'captureFace'])->name('verify.face.capture');

        // My Tickets
        Route::get('/my-tickets',              [TicketController::class, 'index'])->name('my-tickets');
        Route::get('/ticket/{id}/qrcode',      [TicketController::class, 'showTicket'])->name('ticket.qrcode');
        Route::post('/my-tickets/{id}/vibe',   [TicketController::class, 'updateVibe'])->name('ticket.vibe');

        // AI Matchmaking
        Route::get('/my-tickets/{id}/match',   [AiMatchController::class, 'findMatch'])->name('ticket.match');

        // Wallet
        Route::get('/wallet', [\App\Http\Controllers\WalletController::class, 'index'])->name('wallet.index');
        Route::post('/wallet/topup', [\App\Http\Controllers\WalletController::class, 'topup'])->name('wallet.topup');
        Route::get('/wallet/scan', [\App\Http\Controllers\WalletController::class, 'scanQr'])->name('wallet.scan');
        Route::get('/wallet/pay/{tenant_id}', [\App\Http\Controllers\WalletController::class, 'showPayForm'])->name('wallet.pay');
        Route::post('/wallet/pay/{tenant_id}', [\App\Http\Controllers\WalletController::class, 'processPayment'])->name('wallet.pay.process');
    });

    // ─── Organizer Pending Verification (accessible even when unverified) ────
    Route::get('/organizer/pending', fn () => view('auth.organizer_pending'))->name('organizer.pending');

    // Tenant Dashboard
    Route::middleware('tenant.role')->prefix('tenant')->name('tenant.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\TenantController::class, 'dashboard'])->name('dashboard');
        Route::post('/menu',     [\App\Http\Controllers\TenantController::class, 'storeMenu'])->name('menu.store');
        Route::post('/withdraw', [\App\Http\Controllers\TenantController::class, 'withdraw'])->name('withdraw');
    });

    // ─── QR Scanner Route Removed (Pindah Eksklusif ke Admin) ─────────────────
});

// ─── Admin Panel (/admin/**) ──────────────────────────────────────────────────
// Requires: auth + organizer.verified (admin yang sudah disetujui superadmin)

Route::middleware(['auth', 'organizer.verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Finance / Keuangan Global Admin
        Route::get('/finance', [FinanceController::class, 'index'])->name('finance');
        Route::post('/finance/withdraw', [FinanceController::class, 'withdraw'])->name('finance.withdraw');

        // Event Management (resource: index, create, store, show, edit, update, destroy)
        Route::resource('events', AdminEventController::class)->except(['index']);
        Route::get('/events', [AdminEventController::class, 'index'])->name('events.index');

        // QR Ticket Scanner (SATU-SATUNYA PINTU MASUK)
        Route::get('/scanner',          [AdminScannerController::class, 'index'])->name('scanner');
        Route::post('/scanner/validate',  [AdminScannerController::class, 'verifyTicket'])->name('scanner.validate');
        Route::post('/scanner/approve', [AdminScannerController::class, 'approveTicket'])->name('scanner.approve');

        // Tenant Management (scoped per event)
        Route::post('/events/{id}/tenants', [AdminEventController::class, 'storeTenant'])->name('events.tenants.store');

        // Withdrawal Approval (scoped per event)
        Route::post('/events/{eventId}/withdraw/{id}/approve', [AdminEventController::class, 'approveWithdrawal'])->name('events.withdraw.approve');
        Route::post('/events/{id}/withdraw', [AdminEventController::class, 'withdrawEvent'])->name('events.withdraw.event');

        // Attendee Management (Refund & Status)
        Route::post('/events/{event}/tickets/{transaction}/toggle-checkin', [AdminEventController::class, 'toggleCheckIn'])->name('events.tickets.toggle-checkin');
        Route::post('/events/{id}/tickets/{transactionId}/refund', [AdminEventController::class, 'refundTicket'])->name('events.tickets.refund');

    });

// ─── Superadmin Panel ────────────────────────────────────────────────────────
Route::middleware(['auth', 'superadmin.role'])
    ->prefix('superadmin')
    ->name('superadmin.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SuperadminController::class, 'dashboard'])->name('dashboard');
        Route::post('/withdraw/{id}/execute', [\App\Http\Controllers\SuperadminController::class, 'executeWithdrawal'])->name('withdraw.execute');
        Route::post('/organizers/{id}/approve', [\App\Http\Controllers\SuperadminController::class, 'approveOrganizer'])->name('organizers.approve');
        Route::post('/organizers/{id}/reject', [\App\Http\Controllers\SuperadminController::class, 'rejectOrganizer'])->name('organizers.reject');
    });

Route::get('/debug-ai', function () {
    $apiKey = env('GEMINI_API_KEY');
    $response = Illuminate\Support\Facades\Http::get('https://generativelanguage.googleapis.com/v1beta/models?key=' . $apiKey);
    return response()->json($response->json());
});