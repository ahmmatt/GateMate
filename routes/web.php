<?php

use App\Http\Controllers\AiMatchController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// ─── Public Routes ──────────────────────────────────────────────────────────

Route::get('/', [PageController::class, 'index'])->name('landing');

// ─── Auth Routes (Guest Only) ────────────────────────────────────────────────

Route::middleware('guest')->group(function () {
    Route::get('/signin',  [AuthController::class, 'showSignIn'])->name('signin');
    Route::post('/signin', [AuthController::class, 'processSignIn'])->name('signin.process');

    Route::get('/signup',  [AuthController::class, 'showSignUp'])->name('signup');
    Route::post('/signup', [AuthController::class, 'processSignUp'])->name('signup.process');
});

// ─── Authenticated Routes ─────────────────────────────────────────────────────

Route::middleware('auth')->group(function () {
    Route::post('/logout',      [AuthController::class, 'logout'])->name('logout');
    Route::get('/discover',     [PageController::class, 'discover'])->name('discover');
    Route::get('/event/{id}',   [EventController::class, 'show'])->name('event.show');

    // Checkout
    Route::post('/checkout',    [CheckoutController::class, 'process'])->name('checkout.process');

    // My Tickets
    Route::get('/my-tickets',              [TicketController::class, 'index'])->name('my-tickets');
    Route::post('/my-tickets/{id}/vibe',   [TicketController::class, 'updateVibe'])->name('ticket.vibe');

    // AI Matchmaking
    Route::get('/my-tickets/{id}/match',   [AiMatchController::class, 'findMatch'])->name('ticket.match');
});


Route::get('/debug-ai', function () {
    $apiKey = env('GEMINI_API_KEY');
    $response = Illuminate\Support\Facades\Http::get('https://generativelanguage.googleapis.com/v1beta/models?key=' . $apiKey);
    return response()->json($response->json());
});