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

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* TopNavBar */}
      <header className="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-outline-variant z-50">
        <nav className="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight">
            GateMate
          </div>
          <div className="flex items-center gap-4">
            <Link to="/register" className="font-body-md text-body-md text-primary font-bold">
              Daftar Sekarang
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content: Center Split Layout */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px]" />

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
              <img
                className="w-full h-full object-cover"
                alt="GateMate Branding"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhEgk-WSEpYTR3uBfPtKdaPaGrqMg-IVapxI5irFNLrds4_d7RL2Z_OvCMxNgWZZdhI3CYR8z6iwu5vXp-03VcfR5se3MhTyzrk_J0PePqKXuBrfuQaYw7DNiqk06-RtWzka8yHWeAn9xRX1LKxys15MKjReUsdVr7bwWN3nWMSXdXO8_DQSLNvRibBpUeyWQ-ReGrfVrh22A3tB7FXdUzDKepTWUwWScZEsPOGX_35Q9j8Lnjmj8TUGyMROdSkrwfCXBYNgPuzfM"
              />
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[440px] p-8 md:p-10 rounded-[28px] shadow-sm"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '0.5px solid #EBEBEB' }}>

              <div className="mb-8">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Selamat Datang Kembali</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Masuk ke akun Anda untuk mengelola tiket dan networking.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg flex items-center gap-2 font-body-md text-body-md shadow-sm">
                  <span className="material-symbols-outlined">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <a href="#" className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
                  <img alt="Google" className="w-5 h-5" src="data:image/png;base64,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" />
                  <span className="font-label-md text-label-md text-on-surface">Google</span>
                </a>
                <a href="#" className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors active:scale-95">
                  <img alt="Apple" className="w-5 h-5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADhklEQVR4AdSZWahNURzGd5TMU0jmEBKZiowpT4ryoBDxgAdTeCISmfKgCCWFEkkpRKHEiyeernnI8GBOJIQMhd93b/t2Wu2z91nD3qer77fX2nuv9V//79xjn73WahQ18H9FG+jC57URxkEQFWlgLRk/g3XQGIKoCAOdyfQabIZmID3UIQR5G+hFkrdgNMR6QuUDBFGeBpqT4RnQX4CiXifqawEqeRrYSX6DwNR+84LPeV4GepPUfDB1kAvPIZjyMrCQDM3YSnwl14PKHCQp+HQungY9Av9RvoOroMdiV8okTUy42Idrr+AuHIE50Bq8lGZgCZHfw3GYCkqAItJ/yjFU9Fh8TXkDtsAsmAZroB8kSQkP5sZsOAxvYRs0BSclGehAJCW1h7ITZGkkDZT0UcqTIDPtKStRCxqtAv1OUNjLNKCEawijpCgKk/6aToOZBnYRpTsUKf1WOP82lBqYQtYzoGjt9hmw1MB2n0COfT/S7wI4KzYwkwj9oWjpkeo1ZmxgrlcU986P3LvW9ZQBMb7utPDjH98RlfxwgrSEaqiJ76AyMMA3iEf/oR59a7vKQLvaWuYhlwbDiNoKnCUDlf7sOw+S0lFTzEUp9zNvyYD39zBzlPQGehfqkd6k/F0Z+Fr+diF39A04x0htwFoy8Nm6V/gOAwl5H8aClWRAExWrTjk17kbcBWAlGXhs1SPfxgdsw8vAGzq9hGpL60VXbJOQAfXxeiNUgABYf/oaMzZwSidV5DtjO60XxQbOEiDYch+xbKX59yfbTmofG/jLySGohn4yqPNkKjZAjGiHDlVAU0rNzJyGLjWgNRotODkFcuz0hX5bwVmlBhRE6zu/VCkILad4vQmYBrT0t6mg5DWW83c/ztE0oOtaWbunSs4sDxE/yYDiztMhR/YRW8uQFH4qZ0DbQpMJ/RtCS/tjK0IFLWdA8c9z0GozRVDpw1lNxA0lLKXupDQDCqiJxiQq3yCUtLS+nmAxi6lfBCdlGVDQSxw0+b5NmSU912uiKHpAwx+QpWM0GALOC1yVGCB+pEmPTCzmxPzV1Ku4nufa1GjL/RGgzT2t/U+grvccc9p6h+u6p00R7fhw6qZKDcTR91LpCNr/1S6NZlE9Odfu+1NKU5e5sAw03+1LOQq0w6P1IN3j1E+2BuLRXlC5DpoMUVQkbfLdpKW2rSjCyNVAmNEDRGnwBv4DAAD//44sHKQAAAAGSURBVAMAsy17YX9OrloAAAAASUVORK5CYII=" />
                  <span className="font-label-md text-label-md text-on-surface">Apple</span>
                </a>
              </div>

              {/* Divider */}
              <div className="relative mb-8 flex items-center">
                <div className="flex-grow border-t border-outline-variant" />
                <span className="mx-4 font-caption text-caption text-on-surface-variant bg-transparent">atau email</span>
                <div className="flex-grow border-t border-outline-variant" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 text-body-md"
                    style={{ backgroundColor: '#F5F5F7', border: '1px solid #EBEBEB', borderRadius: '10px', transition: 'border-color 0.2s', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#b22110'}
                    onBlur={(e) => e.target.style.borderColor = '#EBEBEB'}
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="font-label-md text-label-md text-on-surface-variant">Password</label>
                    <a className="font-label-md text-label-md text-primary hover:underline" href="#">Lupa Password?</a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 text-body-md"
                    style={{ backgroundColor: '#F5F5F7', border: '1px solid #EBEBEB', borderRadius: '10px', transition: 'border-color 0.2s', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#b22110'}
                    onBlur={(e) => e.target.style.borderColor = '#EBEBEB'}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-body-md font-bold mt-4 shadow-sm hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F04E37', borderRadius: '22px', padding: '10px 22px', color: 'white', transition: 'opacity 0.2s' }}
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>

              <p className="mt-8 text-center font-body-md text-body-md text-on-surface-variant">
                Belum punya akun?{' '}
                <Link className="text-primary font-bold hover:underline" to="/register">
                  Daftar Sekarang
                </Link>
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
