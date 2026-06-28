<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    /**
     * captureFace()
     * ─────────────────────────────────────────────────────────────────────────
     * Menerima snapshot wajah (base64 JPEG) dari browser face-api.js,
     * menyimpannya sebagai foto profil pengguna, lalu memperbarui
     * face_verified_at = now() agar KYC Blocker tidak memblokir lagi.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function captureFace(Request $request): JsonResponse
    {
        try {
            // ── 1. Validasi input ─────────────────────────────────────────────
            $request->validate([
                'image' => ['required', 'string'],
            ]);

            $user = Auth::user();

            // ── 2. Decode base64 → binary image ──────────────────────────────
            $base64Data = $request->input('image');

            // Hapus header data URI jika ada (e.g. "data:image/jpeg;base64,")
            if (str_contains($base64Data, ',')) {
                $base64Data = explode(',', $base64Data, 2)[1];
            }

            $imageData = base64_decode($base64Data);

            if ($imageData === false || strlen($imageData) < 100) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Data gambar tidak valid atau terlalu kecil.',
                ], 422);
            }

            // ── 3. Tentukan nama & path file ──────────────────────────────────
            $uploadsDir = public_path('Media/uploads');

            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }

            // Hapus foto profil lama jika ada (bersihkan storage)
            if (!empty($user->profile_picture)) {
                $oldPath = $uploadsDir . DIRECTORY_SEPARATOR . $user->profile_picture;
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $fileName = 'user_' . $user->getKey() . '_' . time() . '.jpg';
            $filePath = $uploadsDir . DIRECTORY_SEPARATOR . $fileName;

            // ── 4. Simpan file gambar ke disk ─────────────────────────────────
            $written = file_put_contents($filePath, $imageData);

            if ($written === false) {
                Log::error("AccountController@captureFace: Gagal menulis file ke disk.", [
                    'path' => $filePath,
                    'user' => $user->getKey(),
                ]);
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Gagal menyimpan gambar ke server.',
                ], 500);
            }

            // ── 5. Update database: profile_picture & face_verified_at ────────
            $user->profile_picture  = $fileName;
            $user->face_verified_at = now();
            $user->save();

            Log::info("KYC Face Capture sukses.", [
                'user_id'          => $user->getKey(),
                'file'             => $fileName,
                'face_verified_at' => $user->face_verified_at,
            ]);

            return response()->json([
                'status'       => 'success',
                'message'      => 'Wajah terverifikasi',
                'redirect_url' => session()->pull('url.intended', route('landing')),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal: ' . collect($e->errors())->flatten()->first(),
            ], 422);

        } catch (\Exception $e) {
            Log::error("AccountController@captureFace: Exception — " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage(),
            ], 500);
        }
    }
}
