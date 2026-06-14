<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * API AuthController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani autentikasi berbasis Sanctum Token (bukan session/cookie).
 *
 * Endpoints:
 *   POST /api/auth/login             → Login, return Bearer token
 *   POST /api/auth/register          → Registrasi user baru, return Bearer token
 *   POST /api/auth/logout            → Revoke token saat ini
 *   GET  /api/auth/me                → Data user yang sedang login
 */
class AuthController extends Controller
{
    /**
     * Login user dan kembalikan Sanctum Bearer Token.
     *
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password yang Anda masukkan salah.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        // Hapus token lama (opsional — single session per device)
        // $user->tokens()->delete();

        // Buat token baru dengan kemampuan sesuai role
        $abilities = match ($user->role) {
            'superadmin'  => ['superadmin', 'admin', 'user', 'tenant'],
            'admin'       => ['admin', 'user'],
            'tenant'      => ['tenant'],
            default       => ['user'],
        };

        $tokenObj = $user->createToken('auth_token', $abilities);
        $accessToken = $tokenObj->accessToken;
        
        $ip = $request->ip();
        $accessToken->ip_address = $ip;
        $accessToken->user_agent = $request->userAgent();
        
        if ($ip && $ip !== '127.0.0.1' && $ip !== '::1') {
            try {
                $res = \Illuminate\Support\Facades\Http::timeout(2)->get("http://ip-api.com/json/{$ip}?fields=city,countryCode,status");
                if ($res->successful() && $res->json('status') === 'success') {
                    $accessToken->location = $res->json('city') . ', ' . $res->json('countryCode');
                }
            } catch (\Exception $e) {
                // Ignore
            }
        } else {
            $accessToken->location = 'Localhost';
        }
        $accessToken->save();

        $token = $tokenObj->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'token'      => $token,
                'token_type' => 'Bearer',
                'user'       => new UserResource($user),
            ],
        ]);
    }

    /**
     * Registrasi user baru dan kembalikan Bearer Token.
     *
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'gender'    => ['required', 'string', 'in:Male,Female'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'gender.required'    => 'Jenis kelamin wajib dipilih.',
            'email.unique'       => 'Email ini sudah terdaftar.',
            'password.min'       => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'gender'    => $validated['gender'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => 'user',
        ]);

        $tokenObj = $user->createToken('auth_token', ['user']);
        $accessToken = $tokenObj->accessToken;
        
        $ip = $request->ip();
        $accessToken->ip_address = $ip;
        $accessToken->user_agent = $request->userAgent();
        
        if ($ip && $ip !== '127.0.0.1' && $ip !== '::1') {
            try {
                $res = \Illuminate\Support\Facades\Http::timeout(2)->get("http://ip-api.com/json/{$ip}?fields=city,countryCode,status");
                if ($res->successful() && $res->json('status') === 'success') {
                    $accessToken->location = $res->json('city') . ', ' . $res->json('countryCode');
                }
            } catch (\Exception $e) {
                // Ignore
            }
        } else {
            $accessToken->location = 'Localhost';
        }
        $accessToken->save();

        $token = $tokenObj->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Selamat datang di GateMate!',
            'data'    => [
                'token'      => $token,
                'token_type' => 'Bearer',
                'user'       => new UserResource($user),
            ],
        ], 201);
    }

    /**
     * Logout: Revoke token saat ini.
     *
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Hapus hanya token yang digunakan untuk request ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil. Sampai jumpa!',
        ]);
    }

    /**
     * Ambil data user yang sedang login berdasarkan token.
     *
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new UserResource($request->user()),
        ]);
    }
}
