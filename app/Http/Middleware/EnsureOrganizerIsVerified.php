<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware EnsureOrganizerIsVerified
 *
 * Proteksi halaman yang hanya boleh diakses oleh organizer (admin)
 * yang sudah diverifikasi oleh Super Admin.
 *
 * Jika user adalah admin tetapi belum terverifikasi (is_verified_organizer = false),
 * mereka akan dialihkan ke halaman pending dengan pesan penjelasan.
 */
class EnsureOrganizerIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Harus sudah login (guard 'auth' seharusnya sudah menangani ini,
        // tetapi kita tambahkan sebagai lapisan keamanan ekstra)
        if (! $user) {
            return redirect()->route('signin');
        }

        // Super admin selalu lolos tanpa perlu verifikasi organizer
        if (in_array($user->role, ['superadmin', 'super admin'])) {
            return $next($request);
        }

        // Jika role admin tetapi belum terverifikasi → alihkan ke halaman pending
        if ($user->role === 'admin' && ! $user->is_verified_organizer) {
            return redirect()->route('organizer.pending');
        }

        // Jika bukan admin maupun super admin → tolak akses
        if (! in_array($user->role, ['admin', 'superadmin', 'super admin'])) {
            abort(403, 'Anda tidak memiliki hak akses untuk membuka halaman ini.');
        }

        return $next($request);
    }
}
