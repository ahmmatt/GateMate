<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * API versi dari EnsureUserIsSuperadmin.
 * Mengizinkan hanya superadmin.
 * Mengembalikan JSON 403, bukan redirect.
 */
class EnsureApiSuperadmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && in_array($user->role, ['superadmin', 'super admin'])) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. Halaman ini hanya untuk Superadmin.',
        ], 403);
    }
}
