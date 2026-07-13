<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Models\WhitelistIp;
use Illuminate\Support\Facades\DB;

class SuperadminSettingsController extends Controller
{
    public function getSettings(Request $request): JsonResponse
    {
        $admin = auth()->user() ?? User::where('role', 'superadmin')->first();
        
        // Cek token terbaru dari personal_access_tokens
        $lastToken = DB::table('personal_access_tokens')
            ->where('tokenable_id', $admin->id_user)
            ->where('tokenable_type', User::class)
            ->orderByDesc('created_at')
            ->first();

        if ($lastToken) {
            $lastLoginTime = $lastToken->last_used_at ?? $lastToken->created_at;
            $lastLogin = \Carbon\Carbon::parse($lastLoginTime)->timezone('Asia/Jakarta')->format('h:i A, M d, Y');
            $location = $lastToken->location ?? 'Unknown';
        } else {
            $lastLogin = 'Belum pernah login';
            $location = 'Unknown';
        }

        return response()->json([
            'success' => true,
            'data' => [
                'whitelist_ips' => WhitelistIp::where('admin_id', $admin->id_user)->get(),
                'last_login' => $lastLogin,
                'location' => $location,
                'ssl_status' => 'Aktif & Terenkripsi',
            ]
        ]);
    }

    public function toggle2fa(Request $request): JsonResponse
    {
        $admin = auth()->user() ?? User::where('role', 'superadmin')->first();
        
        $request->validate([
            'enabled' => 'required|boolean'
        ]);

        $admin->two_factor_enabled = $request->enabled;
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => '2FA berhasil di' . ($admin->two_factor_enabled ? 'aktifkan' : 'nonaktifkan'),
            'data' => [
                'is_2fa_enabled' => $admin->two_factor_enabled
            ]
        ]);
    }

    public function addIp(Request $request): JsonResponse
    {
        $admin = auth()->user() ?? User::where('role', 'superadmin')->first();

        $request->validate([
            'ip_address' => 'required|ip'
        ]);

        $ip = WhitelistIp::create([
            'admin_id' => $admin->id_user,
            'ip_address' => $request->ip_address,
            'is_active' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'IP berhasil ditambahkan',
            'data' => $ip
        ]);
    }

    public function removeIp(int $id): JsonResponse
    {
        $admin = auth()->user() ?? User::where('role', 'superadmin')->first();
        
        $ip = WhitelistIp::where('admin_id', $admin->id_user)->findOrFail($id);
        $ip->delete();

        return response()->json([
            'success' => true,
            'message' => 'IP berhasil dihapus'
        ]);
    }
}
