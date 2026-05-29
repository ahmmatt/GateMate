<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantRole
{
    /**
     * Hanya izinkan user dengan role 'tenant' untuk mengakses rute tenant.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'tenant') {
            abort(403, 'Akses ditolak. Halaman ini hanya untuk Tenant (Penjual).');
        }

        return $next($request);
    }
}
