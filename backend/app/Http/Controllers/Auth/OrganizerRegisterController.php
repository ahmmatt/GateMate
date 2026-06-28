<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class OrganizerRegisterController extends Controller
{
    /**
     * Tampilkan halaman registrasi khusus penyelenggara (admin).
     */
    public function show(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('discover');
        }

        return view('auth.register_organizer');
    }

    /**
     * Proses registrasi penyelenggara.
     * Semua akun baru di-set role='admin' dan is_verified_organizer=false
     * sehingga harus disetujui oleh Super Admin sebelum bisa mengakses fitur admin.
     */
    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name'         => ['required', 'string', 'max:255'],
            'email'             => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'          => ['required', 'string', 'min:8', 'confirmed'],
            'organization_name' => ['required', 'string', 'max:255'],
            'phone'             => ['required', 'string', 'max:20'],
            'ktp_document'      => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
            'ig_handle'         => ['required', 'string', 'max:255', 'regex:/^@?[\w.]+$/'],
            'tiktok_handle'     => ['required', 'string', 'max:255', 'regex:/^@?[\w.]+$/'],
        ], [
            'full_name.required'         => 'Nama lengkap wajib diisi.',
            'email.required'             => 'Alamat email wajib diisi.',
            'email.unique'               => 'Email ini sudah terdaftar. Silakan gunakan email lain.',
            'password.required'          => 'Password wajib diisi.',
            'password.min'               => 'Password minimal 8 karakter.',
            'password.confirmed'         => 'Konfirmasi password tidak cocok.',
            'organization_name.required' => 'Nama organisasi wajib diisi.',
            'phone.required'             => 'Nomor telepon wajib diisi.',
            'ktp_document.required'      => 'Dokumen KTP/Legalitas wajib diunggah.',
            'ktp_document.mimes'         => 'Format file harus berupa JPG, PNG, atau PDF.',
            'ktp_document.max'           => 'Ukuran maksimal file adalah 2MB.',
            'ig_handle.required'         => 'Handle Instagram wajib diisi.',
            'ig_handle.regex'            => 'Format handle Instagram tidak valid (contoh: @namaakun).',
            'tiktok_handle.required'     => 'Handle TikTok wajib diisi.',
            'tiktok_handle.regex'        => 'Format handle TikTok tidak valid (contoh: @namaakun).',
        ]);

        // Normalisasi handle: pastikan selalu diawali '@'
        $igHandle     = '@' . ltrim($validated['ig_handle'], '@');
        $tiktokHandle = '@' . ltrim($validated['tiktok_handle'], '@');

        // Upload KTP
        $ktpPath = null;
        if ($request->hasFile('ktp_document')) {
            $ktpPath = $request->file('ktp_document')->store('ktp_documents', 'public');
        }

        $user = User::create([
            'full_name'             => $validated['full_name'],
            'email'                 => $validated['email'],
            'password'              => Hash::make($validated['password']),
            'organization_name'     => $validated['organization_name'],
            'phone'                 => $validated['phone'],
            'ktp_document'          => $ktpPath,
            'instagram'             => $igHandle,
            'tiktok_handle'         => $tiktokHandle,
            'role'                  => 'admin',
            'is_verified_organizer' => false,
        ]);

        // Login otomatis setelah registrasi
        Auth::login($user);
        $request->session()->regenerate();

        // Langsung arahkan ke halaman "pending verification"
        return redirect()->route('organizer.pending');
    }
}
