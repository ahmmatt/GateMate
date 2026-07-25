<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * ApiResponse Trait
 * ─────────────────────────────────────────────────────────────────────────────
 * Standarisasi format JSON response untuk semua API controller SecureGate.
 *
 * Format standar:
 * {
 *   "success": true|false,
 *   "message": "...",
 *   "data": {...} | null,
 *   "errors": {...} | null   (hanya pada validasi error)
 * }
 *
 * Cara pakai:
 *   use App\Traits\ApiResponse;
 *   class MyController extends Controller {
 *       use ApiResponse;
 *   }
 */
trait ApiResponse
{
    /**
     * Response sukses (200 OK).
     *
     * @param  mixed       $data
     * @param  string      $message
     * @param  int         $code
     * @return JsonResponse
     */
    protected function success(mixed $data = null, string $message = 'Berhasil.', int $code = 200): JsonResponse
    {
        $payload = [
            'success' => true,
            'message' => $message,
        ];

        if (! is_null($data)) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $code);
    }

    /**
     * Response sukses untuk resource yang baru dibuat (201 Created).
     *
     * @param  mixed  $data
     * @param  string $message
     * @return JsonResponse
     */
    protected function created(mixed $data = null, string $message = 'Data berhasil dibuat.'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * Response error umum (default 400 Bad Request).
     *
     * @param  string     $message
     * @param  int        $code
     * @param  mixed|null $errors   Detail error (opsional)
     * @return JsonResponse
     */
    protected function error(string $message, int $code = 400, mixed $errors = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if (! is_null($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $code);
    }

    /**
     * Response 401 Unauthorized.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function unauthorized(string $message = 'Unauthenticated. Silakan login terlebih dahulu.'): JsonResponse
    {
        return $this->error($message, 401);
    }

    /**
     * Response 403 Forbidden.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function forbidden(string $message = 'Forbidden. Anda tidak memiliki akses ke resource ini.'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * Response 404 Not Found.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function notFound(string $message = 'Data tidak ditemukan.'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     * Response 409 Conflict.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function conflict(string $message = 'Konflik data.'): JsonResponse
    {
        return $this->error($message, 409);
    }

    /**
     * Response 422 Unprocessable Entity.
     *
     * @param  string     $message
     * @param  mixed|null $errors
     * @return JsonResponse
     */
    protected function unprocessable(string $message = 'Data tidak valid.', mixed $errors = null): JsonResponse
    {
        return $this->error($message, 422, $errors);
    }

    /**
     * Response 429 Too Many Requests.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function tooManyRequests(string $message = 'Terlalu banyak permintaan. Coba lagi nanti.'): JsonResponse
    {
        return $this->error($message, 429);
    }

    /**
     * Response 500 Internal Server Error.
     *
     * @param  string $message
     * @return JsonResponse
     */
    protected function serverError(string $message = 'Terjadi kesalahan pada server.'): JsonResponse
    {
        return $this->error($message, 500);
    }
}
