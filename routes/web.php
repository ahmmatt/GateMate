<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageController;
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
    Route::post('/logout',   [AuthController::class, 'logout'])->name('logout');
    Route::get('/discover',  [PageController::class, 'discover'])->name('discover');
});
