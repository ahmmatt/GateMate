<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * API versi dari EnsureOrganizerIsVerified.
 * Mengizinkan admin yang sudah diverifikasi oleh superadmin.
 * Mengembalikan JSON 403, bukan redirect.
 */
class EnsureApiOrganizerVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Superadmin selalu lolos
        if (in_array($user->role, ['superadmin', 'super admin'])) {
            return $next($request);
        }

        // Admin yang belum diverifikasi
        if ($user->role === 'admin' && ! $user->is_verified_organizer) {
            return response()->json([
                'success' => false,
                'message' => 'Akun penyelenggara Anda sedang menunggu verifikasi dari Superadmin.',
                'status'  => 'pending_verification',
            ], 403);
        }

        // Bukan admin / superadmin
        if (! in_array($user->role, ['admin', 'superadmin', 'super admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Halaman ini hanya untuk penyelenggara event (admin).',
            ], 403);
        }

        return $next($request);
    }
}
