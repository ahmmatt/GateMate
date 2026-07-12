<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

/**
 * API AuthController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani autentikasi berbasis Sanctum Token (bukan session/cookie).
 * Logika bisnis didelegasikan ke AuthService.
 *
 * Endpoints:
 *   POST /api/auth/login             → Login, return Bearer token
 *   POST /api/auth/register          → Registrasi user baru, return Bearer token
 *   POST /api/auth/logout            → Revoke token saat ini
 *   GET  /api/auth/me                → Data user yang sedang login
 *   GET  /api/auth/google/redirect   → Redirect ke Google OAuth
 *   GET  /api/auth/google/callback   → Callback dari Google OAuth
 */
class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuthService $authService) {}

    /**
     * Login user dan kembalikan Sanctum Bearer Token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->only('email', 'password'),
            $request->ip(),
            $request->userAgent()
        );

        return $this->success([
            'token'      => $result['token'],
            'token_type' => 'Bearer',
            'user'       => new UserResource($result['user']),
        ], 'Login berhasil.');
    }

    /**
     * Registrasi user baru dan kembalikan Bearer Token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register(
            $request->validated(),
            $request->ip(),
            $request->userAgent()
        );

        return $this->created([
            'token'      => $result['token'],
            'token_type' => 'Bearer',
            'user'       => new UserResource($result['user']),
        ], 'Registrasi berhasil. Kode OTP telah dikirim ke WhatsApp Anda.');
    }

    /**
     * Redirect ke Google OAuth.
     */
    public function googleRedirect()
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver('google');

        return $driver->stateless()->redirect();
    }

    /**
     * Callback dari Google OAuth.
     */
    public function googleCallback(Request $request)
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver     = Socialite::driver('google');
            $googleUser = $driver->stateless()->user();
            $user        = \App\Models\User::where('email', $googleUser->getEmail())->first();
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            if (! $user) {
                return redirect()->away(
                    $frontendUrl . '/register?email=' . urlencode($googleUser->getEmail())
                        . '&name=' . urlencode($googleUser->getName())
                );
            }

            $token = $this->authService->createToken($user, $request->ip(), $request->userAgent());

            return redirect()->away($frontendUrl . '/oauth/callback?token=' . urlencode($token));

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Google OAuth Error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect()->away($frontendUrl . '/login?error=' . urlencode('Gagal login dengan Google.'));
        }
    }

    /**
     * Logout: Revoke token saat ini (baik API Bearer maupun Stateful SPA Session).
     */
    public function logout(Request $request): JsonResponse
    {
        $user  = $request->user();
        $token = $user ? $user->currentAccessToken() : null;

        if ($token && method_exists($token, 'delete')) {
            $token->delete();
        } elseif ($request->bearerToken() && $user) {
            $accessToken = \Laravel\Sanctum\Sanctum::personalAccessTokenModel()::findToken($request->bearerToken());
            $accessToken?->delete();
        }

        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
        }

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        /** @var \Illuminate\Auth\RequestGuard|\Illuminate\Auth\SessionGuard|object $defaultGuard */
        $defaultGuard = Auth::guard();
        if (method_exists($defaultGuard, 'forgetUser')) {
            $defaultGuard->forgetUser();
        }

        /** @var \Illuminate\Auth\RequestGuard|object $sanctumGuard */
        $sanctumGuard = Auth::guard('sanctum');
        if (method_exists($sanctumGuard, 'forgetUser')) {
            $sanctumGuard->forgetUser();
        }

        /** @var \Illuminate\Auth\SessionGuard|object $webGuard */
        $webGuard = Auth::guard('web');
        if (method_exists($webGuard, 'forgetUser')) {
            $webGuard->forgetUser();
        }

        return $this->success(null, 'Logout berhasil. Sampai jumpa!');
    }

    /**
     * Ambil data user yang sedang login berdasarkan token.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()));
    }
}
