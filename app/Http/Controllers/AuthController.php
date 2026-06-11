<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman Sign In.
     * Redirect ke /discover jika sudah login.
     */
    public function showSignIn(): View|RedirectResponse
    {
        if (Auth::check()) {
            if (Auth::user()->role === 'superadmin') {
                return redirect()->intended(route('superadmin.dashboard'));
            }
            return redirect()->intended('/discover');
        }

        return view('auth.signin');
    }

    /**
     * Tampilkan halaman Sign Up.
     * Redirect ke /discover jika sudah login.
     */
    public function showSignUp(): View|RedirectResponse
    {
        if (Auth::check()) {
            if (Auth::user()->role === 'superadmin') {
                return redirect()->intended(route('superadmin.dashboard'));
            }
            return redirect()->intended('/discover');
        }

        return view('auth.signup');
    }

    /**
     * Proses autentikasi Sign In.
     */
    public function processSignIn(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            
            if ($user->role === 'superadmin') {
                return redirect()->intended(route('superadmin.dashboard'));
            }
            
            if (in_array($user->role, ['admin', 'organizer'])) {
                return redirect()->intended('/admin/dashboard');
            }
            
            return redirect()->intended('/discover');
        }

        return back()->withErrors([
            'email' => 'Email atau password yang Anda masukkan salah.',
        ])->onlyInput('email');
    }

    /**
     * Proses registrasi Sign Up dan langsung login.
     */
    public function processSignUp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'gender'    => ['required', 'string', 'in:Male,Female'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'gender'    => $validated['gender'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => 'user',
        ]);

        Auth::login($user);

        $request->session()->regenerate();

        return redirect('/discover');
    }

    /**
     * Proses logout user dan hapus sesi.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
