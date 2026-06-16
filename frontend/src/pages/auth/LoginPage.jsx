import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuth(user, token);
        if (user.role === 'user') navigate('/discover');
        else if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'tenant') navigate('/tenant/dashboard');
        else if (user.role === 'superadmin') navigate('/superadmin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'Google') {
      const apiUrl = api.defaults.baseURL.replace(/\/api$/, '');
      window.location.href = `${apiUrl}/api/auth/google/redirect`;
      return;
    }
    
    // Fallback Apple simulation (karena Apple perlu konfigurasi developer khusus)
    const emailPrompt = window.prompt(`[Simulasi Login ${provider}]\nKarena mode OAuth sungguhan membutuhkan kredensial cloud, masukkan email Anda untuk melanjutkan simulasi:`);
    if (!emailPrompt) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/social-login', { email: emailPrompt, provider });
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuth(user, token);
        if (user.role === 'user') navigate('/discover');
        else if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'tenant') navigate('/tenant/dashboard');
        else if (user.role === 'superadmin') navigate('/superadmin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Redirect ke register dengan membawa email
        navigate('/register', { state: { email: err.response.data.data.email } });
      } else {
        setError(err.response?.data?.message || `Gagal login dengan ${provider}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah ada error dari redirect
  const searchParams = new URLSearchParams(window.location.search);
  const urlError = searchParams.get('error');

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style>
        {`
          .glass-card {
              background: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 0.5px solid #EBEBEB;
          }
          .coral-pill-primary {
              background-color: #F04E37;
              border-radius: 22px;
              padding: 10px 22px;
              color: white;
              transition: opacity 0.2s;
          }
          .coral-pill-primary:active { opacity: 0.8; }
          .input-base {
              background-color: #F5F5F7;
              border: 1px solid #EBEBEB;
              border-radius: 10px;
              transition: border-color 0.2s;
          }
          .input-base:focus {
              outline: none;
              border-color: #F04E37;
              box-shadow: none;
          }
        `}
      </style>

      {/* TopNavBar */}
      <header className="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-outline-variant z-50">
        <nav className="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">
            GateMate
          </div>
          <div className="hidden md:flex gap-gap-default"></div>
          <div className="flex items-center gap-4">
            <Link to="/register" className="font-body-md text-body-md text-primary font-bold">Daftar Sekarang</Link>
          </div>
        </nav>
      </header>

      {/* Main Content: Center Split Layout */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]"></div>
        
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 items-center gap-12 relative z-10">
          
          {/* Left Side: Branding/Visual */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Keamanan Tanpa Kompromi untuk Setiap Tiket.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[440px]">
                Platform verifikasi tiket digital paling aman di Indonesia. Kelola akses, networking, dan pengalaman acara Anda dalam satu pintu yang terpercaya.
              </p>
            </div>
            <div className="relative w-full aspect-square max-w-[400px] rounded-[32px] overflow-hidden border border-outline-variant shadow-sm">
              <img className="w-full h-full object-cover" alt="Illustration" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhEgk-WSEpYTR3uBfPtKdaPaGrqMg-IVapxI5irFNLrds4_d7RL2Z_OvCMxNgWZZdhI3CYR8z6iwu5vXp-03VcfR5se3MhTyzrk_J0PePqKXuBrfuQaYw7DNiqk06-RtWzka8yHWeAn9xRX1LKxys15MKjReUsdVr7bwWN3nWMSXdXO8_DQSLNvRibBpUeyWQ-ReGrfVrh22A3tB7FXdUzDKepTWUwWScZEsPOGX_35Q9j8Lnjmj8TUGyMROdSkrwfCXBYNgPuzfM" />
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="glass-card w-full max-w-[440px] p-8 md:p-10 rounded-[28px] shadow-sm">
              <div className="mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Selamat Datang Kembali</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Masuk ke akun Anda untuk mengelola tiket dan networking.</p>
              </div>

              {/* Error Message */}
              {(error || urlError) && (
                <div className="mb-6 bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
                  <span className="material-symbols-outlined">error</span>
                  <span>{error || urlError}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button onClick={(e) => { e.preventDefault(); handleSocialLogin('Google'); }} className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span className="font-label-md text-label-md text-on-surface">Google</span>
                </button>
                <button onClick={(e) => { e.preventDefault(); handleSocialLogin('Apple'); }} className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
                  <svg width="20" height="20" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#000" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <span className="font-label-md text-label-md text-on-surface">Apple</span>
                </button>
              </div>

              <div className="relative mb-8 flex items-center">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="mx-4 font-caption text-caption text-on-surface-variant bg-transparent">atau email</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1">Email</label>
                  <input 
                    className="w-full h-12 px-4 input-base text-body-md" 
                    placeholder="nama@email.com" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="font-label-md text-label-md text-on-surface-variant">Password</label>
                    <a className="font-label-md text-label-md text-primary hover:underline" href="#">Lupa Password?</a>
                  </div>
                  <input 
                    className="w-full h-12 px-4 input-base text-body-md" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button disabled={loading} className="w-full coral-pill-primary font-body-md font-bold mt-4 shadow-sm hover:opacity-90 disabled:opacity-70" type="submit">
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>
              
              <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
                Belum punya akun?{' '}
                <Link className="text-primary font-bold hover:underline" to="/register">Daftar Sekarang</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-container-padding max-w-[1280px] mx-auto gap-4">
          <div className="font-headline-sm text-headline-sm font-bold text-primary">GateMate</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Security Standards</a>
            <a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Us</a>
          </div>
          <div className="font-caption text-caption text-on-surface-variant opacity-70">
            © 2024 GateMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
