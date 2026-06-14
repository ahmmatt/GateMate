<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * API OrganizerRegisterController
 * ─────────────────────────────────────────────────────────────────────────────
 * Registrasi akun Penyelenggara (admin). Semua akun baru di-set
 * is_verified_organizer=false dan menunggu persetujuan Superadmin.
 *
 * Endpoints:
 *   POST /api/auth/register/organizer
 */
class OrganizerRegisterController extends Controller
{
    /**
     * Proses registrasi organizer.
     * Setelah registrasi, akun berstatus pending — belum bisa akses admin panel.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name'         => ['required', 'string', 'max:255'],
            'email'             => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'          => ['required', 'string', 'min:8', 'confirmed'],
            'organization_name' => ['required', 'string', 'max:255'],
            'phone'             => ['required', 'string', 'max:20'],
            'ktp_document'      => ['required', 'file', 'mimes:zip', 'max:10240'],
            'ig_handle'         => ['required', 'string', 'max:255', 'regex:/^@?[\w.]+$/'],
            'tiktok_handle'     => ['required', 'string', 'max:255', 'regex:/^@?[\w.]+$/'],
        ], [
            'full_name.required'         => 'Nama lengkap wajib diisi.',
            'email.required'             => 'Alamat email wajib diisi.',
            'email.unique'               => 'Email ini sudah terdaftar.',
            'password.min'               => 'Password minimal 8 karakter.',
            'password.confirmed'         => 'Konfirmasi password tidak cocok.',
            'organization_name.required' => 'Nama organisasi wajib diisi.',
            'phone.required'             => 'Nomor telepon wajib diisi.',
            'ktp_document.required'      => 'Dokumen KTP/Legalitas wajib diunggah.',
            'ktp_document.mimes'         => 'Satukan semua file dalam bentuk ekstensi .zip',
            'ktp_document.max'           => 'Ukuran maksimal file ZIP 10MB.',
            'ig_handle.regex'            => 'Format handle Instagram tidak valid.',
            'tiktok_handle.regex'        => 'Format handle TikTok tidak valid.',
        ]);

        // Normalisasi handle: pastikan selalu diawali '@'
        $igHandle     = '@' . ltrim($validated['ig_handle'], '@');
        $tiktokHandle = '@' . ltrim($validated['tiktok_handle'], '@');

        // Upload KTP
        $ktpPath = null;
        if ($request->hasFile('ktp_document')) {
            $ktpPath = $request->file('ktp_document')->store('ktp_documents', 'public');
        }

        $user = User::create([
            'full_name'             => $validated['full_name'],
            'email'                 => $validated['email'],
            'password'              => Hash::make($validated['password']),
            'organization_name'     => $validated['organization_name'],
            'phone'                 => $validated['phone'],
            'ktp_document'          => $ktpPath,
            'instagram'             => $igHandle,
            'tiktok_handle'         => $tiktokHandle,
            'role'                  => 'admin',
            'is_verified_organizer' => false,
        ]);

        // Buat token — tapi dengan kemampuan terbatas (belum bisa akses admin)
        $token = $user->createToken('auth_token', ['pending_admin'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil! Akun Anda sedang menunggu verifikasi dari Superadmin. Kami akan menghubungi Anda segera.',
            'data'    => [
                'token'      => $token,
                'token_type' => 'Bearer',
                'status'     => 'pending_verification',
                'user'       => new UserResource($user),
            ],
        ], 201);
    }
}
