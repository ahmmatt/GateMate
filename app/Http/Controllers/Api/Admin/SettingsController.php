<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

/**
 * API Admin\SettingsController
 * ─────────────────────────────────────────────────────────────────────────────
 * Mengelola pengaturan akun & profil untuk penyelenggara / admin.
 *
 * Endpoints:
 *   GET  /api/admin/settings         → Ambil data pengaturan saat ini
 *   POST /api/admin/settings/profile → Update profil & preferensi
 *   POST /api/admin/settings/security → Ganti password
 *   POST /api/admin/settings/photo   → Upload foto profil
 */
class SettingsController extends Controller
{
    /**
     * Ambil semua data pengaturan penyelenggara yang sedang login.
     */
    public function index(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data' => [
                'id_user'                => $user->id_user,
                'full_name'              => $user->full_name,
                'email'                  => $user->email,
                'phone'                  => $user->phone,
                'profile_picture'        => $user->profile_picture
                    ? asset('Media/uploads/' . $user->profile_picture)
                    : null,
                'organization_name'      => $user->organization_name,
                'organization_type'      => $user->organization_type,
                'organization_description' => $user->organization_description,
                'organization_address'   => $user->organization_address,
                'organization_website'   => $user->organization_website,
                'organization_instagram' => $user->organization_instagram,
                'organization_tiktok'    => $user->organization_tiktok,
                'organization_twitter'   => $user->organization_twitter,
                'bank_name'              => $user->bank_name,
                'bank_account_number'    => $user->bank_account_number,
                'bank_account_name'      => $user->bank_account_name,
                'ktp_document'           => $user->ktp_document,
                'notification_prefs'     => $user->notification_prefs ?? [
                    'email_notifications'  => true,
                    'system_alerts'        => true,
                    'ticket_sales'         => true,
                    'daily_report'         => false,
                ],
                'face_verified_at'       => $user->face_verified_at,
                'created_at'             => $user->created_at,
            ],
        ]);
    }

    /**
     * Update profil penyelenggara (tab: Profil Akun + Detail Organisasi + Notifikasi).
     */
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            // Profil Akun
            'full_name'                => ['sometimes', 'string', 'max:255'],
            'phone'                    => ['sometimes', 'nullable', 'string', 'max:30'],
            // Detail Organisasi
            'organization_name'        => ['sometimes', 'nullable', 'string', 'max:255'],
            'organization_type'        => ['sometimes', 'nullable', 'string', 'max:100'],
            'organization_description' => ['sometimes', 'nullable', 'string'],
            'organization_address'     => ['sometimes', 'nullable', 'string'],
            'organization_website'     => ['sometimes', 'nullable', 'max:255'],
            'organization_instagram'   => ['sometimes', 'nullable', 'string', 'max:100'],
            'organization_tiktok'      => ['sometimes', 'nullable', 'string', 'max:100'],
            'organization_twitter'     => ['sometimes', 'nullable', 'string', 'max:100'],
            // Info Bank
            'bank_name'                => ['sometimes', 'nullable', 'string', 'max:100'],
            'bank_account_number'      => ['sometimes', 'nullable', 'string', 'max:50'],
            'bank_account_name'        => ['sometimes', 'nullable', 'string', 'max:255'],
            // Preferensi Notifikasi
            'notification_prefs'       => ['sometimes', 'nullable', 'array'],
            'notification_prefs.email_notifications' => ['sometimes', 'boolean'],
            'notification_prefs.system_alerts'       => ['sometimes', 'boolean'],
            'notification_prefs.ticket_sales'        => ['sometimes', 'boolean'],
            'notification_prefs.daily_report'        => ['sometimes', 'boolean'],
        ]);

        $user->fill($validated);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan berhasil disimpan!',
            'data'    => [
                'full_name'              => $user->full_name,
                'phone'                  => $user->phone,
                'organization_name'      => $user->organization_name,
                'organization_type'      => $user->organization_type,
                'organization_description' => $user->organization_description,
                'organization_address'   => $user->organization_address,
                'organization_website'   => $user->organization_website,
                'organization_instagram' => $user->organization_instagram,
                'organization_tiktok'    => $user->organization_tiktok,
                'organization_twitter'   => $user->organization_twitter,
                'bank_name'              => $user->bank_name,
                'bank_account_number'    => $user->bank_account_number,
                'bank_account_name'      => $user->bank_account_name,
                'notification_prefs'     => $user->notification_prefs,
            ],
        ]);
    }

    /**
     * Ganti password (tab: Keamanan).
     */
    public function updateSecurity(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'current_password'      => ['required', 'string'],
            'new_password'          => ['required', 'string', 'min:8', 'confirmed'],
            'new_password_confirmation' => ['required', 'string'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama tidak sesuai.',
            ], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diperbarui!',
        ]);
    }

    /**
     * Upload foto profil (tab: Profil Akun → Ganti Foto).
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $file     = $request->file('photo');
        $filename = 'profile_' . $user->id_user . '_' . time() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('Media/uploads'), $filename);

        // Hapus foto lama jika ada (dan bukan default)
        if ($user->profile_picture && $user->profile_picture !== 'default-avatar.png') {
            $oldPath = public_path('Media/uploads/' . $user->profile_picture);
            if (file_exists($oldPath)) {
                @unlink($oldPath);
            }
        }

        $user->profile_picture = $filename;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil diperbarui!',
            'data'    => [
                'profile_picture_url' => asset('Media/uploads/' . $filename),
            ],
        ]);
    }

    /**
     * Ambil daftar sesi aktif.
     */
    public function getSessions(Request $request): JsonResponse
    {
        $tokens = $request->user()->tokens()->orderBy('last_used_at', 'desc')->get();
        $currentId = $request->user()->currentAccessToken()->id ?? null;

        $sessions = $tokens->map(function ($token) use ($currentId) {
            $ua = $token->user_agent ?? '';
            $device = 'Unknown Device';
            $icon = 'devices';
            
            if (stripos($ua, 'Mobile') !== false || stripos($ua, 'Android') !== false || stripos($ua, 'iPhone') !== false) {
                $icon = 'smartphone';
                $device = 'Mobile Device';
            } elseif (stripos($ua, 'Windows') !== false) {
                $icon = 'laptop_mac';
                $device = 'Windows PC';
            } elseif (stripos($ua, 'Mac OS') !== false) {
                $icon = 'laptop_mac';
                $device = 'Mac';
            } elseif (stripos($ua, 'Linux') !== false) {
                $icon = 'laptop_mac';
                $device = 'Linux PC';
            }

            if (stripos($ua, 'Chrome') !== false) {
                $device = 'Chrome on ' . explode(' on ', $device)[0];
            } elseif (stripos($ua, 'Firefox') !== false) {
                $device = 'Firefox on ' . explode(' on ', $device)[0];
            } elseif (stripos($ua, 'Safari') !== false && stripos($ua, 'Chrome') === false) {
                $device = 'Safari on ' . explode(' on ', $device)[0];
            }

            return [
                'id' => $token->id,
                'device' => $device,
                'icon' => $icon,
                'ip' => $token->ip_address ?? 'Unknown IP',
                'location' => $token->location ?? 'Tidak diketahui',
                'time' => $token->last_used_at ? $token->last_used_at->diffForHumans() : 'Belum digunakan',
                'current' => $token->id === $currentId,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $sessions
        ]);
    }

    /**
     * Hapus sesi spesifik.
     */
    public function deleteSession(Request $request, $id): JsonResponse
    {
        $request->user()->tokens()->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Sesi berhasil dihapus.']);
    }

    /**
     * Hapus semua sesi kecuali yang sekarang.
     */
    public function deleteAllSessions(Request $request): JsonResponse
    {
        $currentId = $request->user()->currentAccessToken()->id ?? null;
        $request->user()->tokens()->where('id', '!=', $currentId)->delete();
        return response()->json(['success' => true, 'message' => 'Semua sesi lain berhasil dihapus.']);
    }
}
