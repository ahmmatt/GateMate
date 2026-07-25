<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * AuthService
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola logika autentikasi: login, register, token Sanctum, OTP awal.
 * Controller hanya memanggil service ini; tidak ada logika bisnis di controller.
 */
class AuthService
{
    public function __construct(protected FonnteService $fonnte) {}

    /**
     * Login user dan buat Sanctum token.
     *
     * @param  array $credentials ['email', 'password']
     * @param  string|null $ip
     * @param  string|null $userAgent
     * @return array ['user' => User, 'token' => string]
     * @throws ValidationException
     */
    public function login(array $credentials, ?string $ip = null, ?string $userAgent = null): array
    {
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password yang Anda masukkan salah.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        $token = $this->createToken($user, $ip, $userAgent);

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Registrasi user baru dan buat Sanctum token.
     *
     * @param  array $data ['full_name', 'gender', 'email', 'phone', 'password']
     * @param  string|null $ip
     * @param  string|null $userAgent
     * @return array ['user' => User, 'token' => string]
     */
    public function register(array $data, ?string $ip = null, ?string $userAgent = null): array
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'full_name'            => $data['full_name'],
            'gender'               => $data['gender'],
            'email'                => $data['email'],
            'phone'                => $data['phone'],
            'password'             => Hash::make($data['password']),
            'role'                 => 'user',
            'phone_otp'            => $otp,
            'phone_otp_expires_at' => now()->addMinutes(5),
        ]);

        $token = $this->createToken($user, $ip, $userAgent);

        // Kirim OTP via WhatsApp (non-blocking)
        $this->sendRegistrationOtp($user, $otp);

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Buat Sanctum token dengan abilities sesuai role dan simpan device info.
     *
     * @param  User        $user
     * @param  string|null $ip
     * @param  string|null $userAgent
     * @return string Plain text token
     */
    public function createToken(User $user, ?string $ip = null, ?string $userAgent = null): string
    {
        $abilities = $this->resolveAbilities($user->role);

        $tokenObj    = $user->createToken('auth_token', $abilities);
        $accessToken = $tokenObj->accessToken;

        $accessToken->ip_address = $ip;
        $accessToken->user_agent = $userAgent;
        $accessToken->location   = $this->resolveLocation($ip);
        $accessToken->save();

        return $tokenObj->plainTextToken;
    }

    /**
     * Tentukan abilities Sanctum berdasarkan role user.
     *
     * @param  string $role
     * @return array<string>
     */
    protected function resolveAbilities(string $role): array
    {
        return match ($role) {
            'superadmin' => ['superadmin', 'admin', 'user', 'tenant'],
            'admin'      => ['admin', 'user'],
            'tenant'     => ['tenant'],
            default      => ['user'],
        };
    }

    /**
     * Ambil kota berdasarkan IP (optional, non-blocking).
     *
     * @param  string|null $ip
     * @return string
     */
    protected function resolveLocation(?string $ip): string
    {
        if (! $ip || in_array($ip, ['127.0.0.1', '::1'])) {
            return 'Localhost';
        }

        try {
            $res = Http::timeout(2)->get("http://ip-api.com/json/{$ip}?fields=city,countryCode,status");
            if ($res->successful() && $res->json('status') === 'success') {
                return $res->json('city') . ', ' . $res->json('countryCode');
            }
        } catch (\Exception $e) {
            Log::warning('AuthService: Gagal resolve lokasi IP.', ['ip' => $ip, 'error' => $e->getMessage()]);
        }

        return 'Unknown';
    }

    /**
     * Kirim OTP ke WhatsApp setelah registrasi (non-blocking; error diabaikan).
     *
     * @param  User   $user
     * @param  string $otp
     */
    protected function sendRegistrationOtp(User $user, string $otp): void
    {
        try {
            $normalizedPhone = FonnteService::normalizePhone($user->phone);
            $appName         = config('app.name', 'SecureGate');
            $message         = "🔐 *Kode Verifikasi {$appName}*\n\nKode OTP Anda adalah:\n\n*{$otp}*\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.\n\n_Tim {$appName}_";

            $this->fonnte->send($normalizedPhone, $message);
        } catch (\Exception $e) {
            Log::error('AuthService: Gagal kirim OTP registrasi.', [
                'user_id' => $user->id_user,
                'error'   => $e->getMessage(),
            ]);
        }
    }
}
