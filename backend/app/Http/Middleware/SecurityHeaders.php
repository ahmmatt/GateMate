<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * SecurityHeaders Middleware
 * ─────────────────────────────────────────────────────────────────────────────
 * Menambahkan HTTP security headers ke setiap response.
 * Melindungi dari berbagai serangan web umum (XSS, clickjacking, MIME sniffing).
 *
 * Daftarkan di bootstrap/app.php agar aktif secara global.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Cegah MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Cegah clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Kontrol referrer info yang dikirim ke server lain
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Paksa HTTPS selama 1 tahun (aktifkan di production)
        if (app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Matikan DNS prefetching browser
        $response->headers->set('X-DNS-Prefetch-Control', 'off');

        // Hapus header yang mengekspos info server
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
