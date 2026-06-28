<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // ─── CORS: Harus global, sebelum semua middleware lain ───────────────
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        // ─── Alias Middleware (Blade / Session-based) ────────────────────────
        $middleware->alias([
            'organizer.verified' => \App\Http\Middleware\EnsureOrganizerIsVerified::class,
            'tenant.role'        => \App\Http\Middleware\EnsureTenantRole::class,
            'superadmin.role'    => \App\Http\Middleware\EnsureUserIsSuperadmin::class,
            'user.role'          => \App\Http\Middleware\EnsureUserRole::class,

            // ─── Alias Middleware (API / Token-based) — return JSON bukan redirect
            'api.user.role'          => \App\Http\Middleware\Api\EnsureApiUserRole::class,
            'api.organizer.verified' => \App\Http\Middleware\Api\EnsureApiOrganizerVerified::class,
            'api.superadmin.role'    => \App\Http\Middleware\Api\EnsureApiSuperadmin::class,
            'api.tenant.role'        => \App\Http\Middleware\Api\EnsureApiTenantRole::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\RedirectSuperadmin::class,
        ]);

        // Bypass CSRF for Midtrans Webhook
        $middleware->validateCsrfTokens(except: [
            '/webhook/midtrans',
            '/webhook/midtrans/*',
            '/webhook/*'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Kembalikan JSON 401 jika request API tidak terautentikasi
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                ], 401);
            }
        });

        // Kembalikan JSON 403 jika request API tidak diizinkan
        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden. Anda tidak memiliki akses ke resource ini.',
                ], 403);
            }
        });

        // Kembalikan JSON 404 jika model tidak ditemukan (findOrFail)
        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data tidak ditemukan.',
                ], 404);
            }
        });

        // Kembalikan JSON 422 jika validasi gagal
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });
    })->create();

