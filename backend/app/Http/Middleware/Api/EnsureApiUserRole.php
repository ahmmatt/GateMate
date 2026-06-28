<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * API versi dari EnsureUserRole.
 * Mengizinkan hanya user dengan role 'user' (pembeli tiket).
 * Mengembalikan JSON 403, bukan redirect.
 */
class EnsureApiUserRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->role === 'user') {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. Halaman ini hanya untuk pembeli tiket (user).',
        ], 403);
    }
}
