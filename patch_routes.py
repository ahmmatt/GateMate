import re

file_path = r'd:\laragon\www\JVC26\gatemate\routes\web.php'

with open(file_path, 'r') as f:
    content = f.read()

# I will replace the auth group contents from the beginning of Route::middleware('auth') up to just before the admin panel

new_auth_group = """Route::middleware('auth')->group(function () {
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

});"""

# Use regex to replace the old block
# We match from Route::middleware('auth')->group(function () {
# down to the line before Route::middleware(['auth', 'organizer.verified'])

pattern = r"Route::middleware\('auth'\)->group\(function \(\) \{.*?\}\);"
content = re.sub(pattern, new_auth_group, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

print("done")
