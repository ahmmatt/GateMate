import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, AlertCircle, Info } from 'lucide-react';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // e.g. for registration success
  
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
        
        // Redirect based on role
        if (user.role === 'user') navigate('/dashboard'); // Adjusted since user dashboard is unified
        else if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'tenant') navigate('/tenant/dashboard');
        else if (user.role === 'superadmin') navigate('/superadmin/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-secondary flex flex-col font-sans">
      {/* Top NavBar (Simplified for Auth) */}
      <header className="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-secondary/5 z-50">
        <nav className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            Gate<span className="text-coral-500">Mate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/register" className="font-semibold text-coral-600 hover:text-coral-700 transition-colors">
              Daftar Sekarang
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content: Center Split Layout */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-coral-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 items-center gap-12 relative z-10">
          
          {/* Left Side: Branding/Visual */}
          <div className="hidden md:flex flex-col gap-6 animate-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Keamanan Tanpa Kompromi untuk Setiap Tiket.
              </h1>
              <p className="text-lg text-secondary/70 max-w-[440px] leading-relaxed">
                Platform verifikasi tiket digital paling aman di Indonesia. Kelola akses, networking, dan pengalaman acara Anda dalam satu pintu yang terpercaya.
              </p>
            </div>
            <div className="relative w-full aspect-square max-w-[400px] rounded-[32px] overflow-hidden border border-secondary/10 shadow-2xl shadow-coral-500/10">
              <img 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                alt="GateMate Branding" 
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop" 
              />
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="flex justify-center md:justify-end animate-in slide-in-from-right-8 duration-700">
            <div className="glass w-full max-w-[440px] p-8 md:p-10 rounded-[28px]">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali</h2>
                <p className="text-secondary/60 text-sm">Masuk ke akun Anda untuk mengelola tiket dan networking.</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {statusMessage && (
                <div className="mb-6 bg-blue-50 border border-blue-100 text-blue-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm">
                  <Info className="w-5 h-5 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-secondary/10 bg-white/50 rounded-xl hover:bg-white transition-colors">
                  <img alt="Google" className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-secondary/10 bg-white/50 rounded-xl hover:bg-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.87 1.5c-1.34 0-2.88 1.05-3.5 1.95-.62.89-.96 2.05-.8 3.1 1.45.1 2.92-1 3.55-1.93.61-.92 1.05-2.12.75-3.12zM15.42 6.54c-1.46-.03-2.67.92-3.37.92-.7 0-1.78-.9-3.05-.9-1.57 0-3.06.9-3.87 2.3-1.63 2.82-.41 6.98 1.18 9.3 0.78 1.13 1.72 2.4 2.98 2.38 1.22-.04 1.7-.78 3.17-.78 1.46 0 1.9.78 3.18.76 1.3-.02 2.12-1.16 2.9-2.3 0.9-1.32 1.28-2.6 1.3-2.67-.03-.01-2.5-1-2.54-3.85-.02-2.38 1.95-3.52 2.05-3.58-1.12-1.65-2.87-1.85-3.5-1.9l-0.43-.02z"/>
                  </svg>
                  <span className="text-sm font-medium">Apple</span>
                </button>
              </div>

              <div className="relative mb-8 flex items-center">
                <div className="flex-grow border-t border-secondary/10"></div>
                <span className="mx-4 text-xs font-medium text-secondary/40 uppercase tracking-wider bg-transparent">atau email</span>
                <div className="flex-grow border-t border-secondary/10"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-secondary/70 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 bg-white/50 border border-secondary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all text-sm"
                    placeholder="nama@email.com"
                    required 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-medium text-secondary/70">Password</label>
                    <a className="text-xs font-medium text-coral-600 hover:text-coral-700 hover:underline" href="#">Lupa Password?</a>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white/50 border border-secondary/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all text-sm"
                    placeholder="••••••••"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 bg-primary text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-coral-500/30 hover:bg-coral-600 hover:shadow-coral-500/40 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-secondary/60">
                Belum punya akun?{' '}
                <Link to="/register" className="font-semibold text-coral-600 hover:text-coral-700 hover:underline">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto border-t border-secondary/10 bg-surface/50">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-7xl mx-auto gap-4">
          <div className="text-lg font-bold">Gate<span className="text-coral-500">Mate</span></div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-sm text-secondary/60 hover:text-coral-500 transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-secondary/60 hover:text-coral-500 transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-secondary/60 hover:text-coral-500 transition-colors" href="#">Security Standards</a>
            <a className="text-sm text-secondary/60 hover:text-coral-500 transition-colors" href="#">Contact Us</a>
          </div>
          <div className="text-sm text-secondary/50">
            © 2024 GateMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
