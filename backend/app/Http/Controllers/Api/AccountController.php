<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * API AccountController
 * ─────────────────────────────────────────────────────────────────────────────
 * Menangani fitur akun user: Face Verification (KYC).
 * Logika identik dengan versi Blade — hanya response format yang berubah.
 *
 * Endpoints:
 *   POST /api/account/face-capture → KYC: simpan foto wajah & set face_verified_at
 *   POST /api/account/profile      → Update profil (nama, foto)
 */
class AccountController extends Controller
{
    /**
     * Menerima snapshot wajah (base64 JPEG), simpan ke disk, update KYC timestamp.
     */
    public function captureFace(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'image' => ['required', 'string'],
            ]);

            /** @var \App\Models\User $user */
            $user = Auth::user();

            // ── Decode base64 → binary image ──────────────────────────────────
            $base64Data = $request->input('image');

            if (str_contains($base64Data, ',')) {
                $base64Data = explode(',', $base64Data, 2)[1];
            }

            $imageData = base64_decode($base64Data);

            if ($imageData === false || strlen($imageData) < 100) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data gambar tidak valid atau terlalu kecil.',
                ], 422);
            }

            // ── Simpan ke disk ─────────────────────────────────────────────────
            $uploadsDir = public_path('Media/uploads');

            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }

            // Hapus foto lama jika ada
            if (!empty($user->profile_picture)) {
                $oldPath = $uploadsDir . DIRECTORY_SEPARATOR . $user->profile_picture;
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $fileName = 'user_' . $user->getKey() . '_' . time() . '.jpg';
            $filePath = $uploadsDir . DIRECTORY_SEPARATOR . $fileName;
            $written  = file_put_contents($filePath, $imageData);

            if ($written === false) {
                Log::error('Api\AccountController@captureFace: Gagal menulis file.', [
                    'path' => $filePath,
                    'user' => $user->getKey(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menyimpan gambar ke server.',
                ], 500);
            }

            // ── Update DB: profile_picture & face_verified_at ─────────────────
            $user->profile_picture  = $fileName;
            $user->face_verified_at = now();
            $user->save();

            Log::info('API KYC Face Capture sukses.', [
                'user_id'          => $user->getKey(),
                'file'             => $fileName,
                'face_verified_at' => $user->face_verified_at,
            ]);

            return response()->json([
                'success'          => true,
                'message'          => 'Verifikasi wajah berhasil! Anda sekarang bisa melakukan pembelian tiket.',
                'face_verified_at' => $user->face_verified_at->toIso8601String(),
                'profile_picture_url' => asset('Media/uploads/' . $fileName),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Api\AccountController@captureFace: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update profil user (nama dan opsional foto profil).
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'full_name' => ['required', 'string', 'max:255'],
                'image'     => ['nullable', 'string'],
            ]);

            /** @var \App\Models\User $user */
            $user = Auth::user();
            $user->full_name = $request->input('full_name');

            if ($request->filled('image')) {
                $base64Data = $request->input('image');
                if (str_contains($base64Data, ',')) {
                    $base64Data = explode(',', $base64Data, 2)[1];
                }

                $imageData = base64_decode($base64Data);
                if ($imageData !== false && strlen($imageData) >= 100) {
                    $uploadsDir = public_path('Media/uploads');
                    if (!is_dir($uploadsDir)) {
                        mkdir($uploadsDir, 0755, true);
                    }

                    if (!empty($user->profile_picture)) {
                        $oldPath = $uploadsDir . DIRECTORY_SEPARATOR . $user->profile_picture;
                        if (file_exists($oldPath)) {
                            @unlink($oldPath);
                        }
                    }

                    $fileName = 'profile_' . $user->getKey() . '_' . time() . '.jpg';
                    $filePath = $uploadsDir . DIRECTORY_SEPARATOR . $fileName;
                    
                    if (file_put_contents($filePath, $imageData) !== false) {
                        $user->profile_picture = $fileName;
                    }
                }
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui.',
                'data'    => [
                    'full_name' => $user->full_name,
                    'profile_picture' => $user->profile_picture ? asset('Media/uploads/' . $user->profile_picture) : null,
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Api\AccountController@updateProfile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server.',
            ], 500);
        }
    }
}
