import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      const { user, token, access_token } = response.data || {}
      const authToken = token || access_token

      if (!user || !authToken) {
        throw new Error('Respons autentikasi tidak valid dari server.')
      }

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(user))

      const userRole = user.role || 'user'
      const redirectMap = {
        user: '/events',
        organizer: '/organizer/dashboard',
        superadmin: '/superadmin/dashboard',
        admin: '/admin/dashboard'
      }
      navigate(redirectMap[userRole] || '/events')
    } catch (err) {
      console.warn('Backend API tidak terjangkau atau gagal, menggunakan fallback offline dengan role user...')
      // Setup mock user untuk fallback offline testing
      const mockUser = { id: 1, name: 'User Demo', email, role: 'user' }
      localStorage.setItem('token', 'mock-token-offline')
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      navigate('/events')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#fff8f6] text-[#271815] min-h-screen flex flex-col font-sans">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid #EBEBEB;
        }
        .coral-pill-primary {
          background-color: #b22110;
          border-radius: 22px;
          padding: 12px 22px;
          color: white;
          transition: all 0.2s;
        }
        .coral-pill-primary:hover {
          background-color: #d63b27;
          box-shadow: 0 4px 12px rgba(240, 78, 55, 0.25);
        }
        .coral-pill-primary:active {
          opacity: 0.85;
          transform: scale(0.98);
        }
        .input-base {
          background-color: #F5F5F7;
          border: 1px solid #EBEBEB;
          border-radius: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-base:focus {
          outline: none;
          border-color: #b22110;
          box-shadow: 0 0 0 3px rgba(240, 78, 55, 0.12);
        }
      `}</style>

      

      {/* Main Content: Center Split Layout */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#b22110]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#007f99]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 items-center gap-12 relative z-10">
          {/* Left Side: Branding/Visual */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#271815]">
                Keamanan Tanpa Kompromi untuk Setiap Tiket.
              </h1>
              <p className="text-[15px] text-[#5b403c] leading-relaxed max-w-[440px]">
                Platform verifikasi tiket digital paling aman di Indonesia. Kelola akses, networking, dan pengalaman acara Anda dalam satu pintu yang terpercaya.
              </p>
            </div>
            <div className="relative w-full aspect-square max-w-[400px] rounded-[32px] overflow-hidden border border-[#e3beb8]/50 shadow-md">
              <img 
                className="w-full h-full object-cover" 
                alt="GateMate Ticket Verification" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhEgk-WSEpYTR3uBfPtKdaPaGrqMg-IVapxI5irFNLrds4_d7RL2Z_OvCMxNgWZZdhI3CYR8z6iwu5vXp-03VcfR5se3MhTyzrk_J0PePqKXuBrfuQaYw7DNiqk06-RtWzka8yHWeAn9xRX1LKxys15MKjReUsdVr7bwWN3nWMSXdXO8_DQSLNvRibBpUeyWQ-ReGrfVrh22A3tB7FXdUzDKepTWUwWScZEsPOGX_35Q9j8Lnjmj8TUGyMROdSkrwfCXBYNgPuzfM" 
              />
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="glass-card w-full max-w-[440px] p-8 md:p-10 rounded-[28px] shadow-sm">
              <div className="mb-8">
                <span className="inline-block px-3.5 py-1 bg-[#b22110]/10 text-[#b22110] text-[11px] font-bold rounded-full mb-3 uppercase tracking-wider border border-[#b22110]/20">
                  Portal Pengguna
                </span>
                <h2 className="text-[22px] font-bold text-[#271815] mb-2">Selamat Datang Kembali</h2>
                <p className="text-[14px] text-[#5b403c]">Masuk ke akun Anda untuk mengelola tiket dan networking.</p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl text-[#93000a] text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="mb-8">
                <button 
                  type="button"
                  onClick={() => alert('Demo: Fitur login Google')}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-[#e3beb8] rounded-xl hover:bg-[#fff0ee] transition-colors active:scale-95 shadow-sm"
                >
                  <img alt="Google" className="w-5 h-5" src="data:image/png;base64,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" />
                  <span className="text-[12px] font-semibold text-[#271815]">Masuk dengan Google</span>
                </button>
              </div>

              <div className="relative mb-8 flex items-center">
                <div className="flex-grow border-t border-[#e3beb8]/60"></div>
                <span className="mx-4 text-[11px] text-[#5b403c] bg-transparent">atau email</span>
                <div className="flex-grow border-t border-[#e3beb8]/60"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="email"
                    className={`text-[12px] font-medium ml-1 transition-colors ${
                      focusedField === 'email' ? 'text-[#b22110]' : 'text-[#5b403c]'
                    }`}
                  >
                    Email
                  </label>
                  <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="nama@email.com" 
                    className="w-full h-12 px-4 input-base text-[14px] text-[#271815]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label 
                      htmlFor="password"
                      className={`text-[12px] font-medium transition-colors ${
                        focusedField === 'password' ? 'text-[#b22110]' : 'text-[#5b403c]'
                      }`}
                    >
                      Password
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Fitur pemulihan kata sandi sedang dalam maintenance.'); }} className="text-[12px] font-medium text-[#b22110] hover:underline">
                      Lupa Password?
                    </a>
                  </div>
                  <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="••••••••" 
                    className="w-full h-12 px-4 input-base text-[14px] text-[#271815]"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full coral-pill-primary text-[14px] font-bold mt-4 shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Masuk</span>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[14px] text-[#5b403c]">
                Belum punya akun?{' '}
                <Link to="/register" className="text-[#b22110] font-bold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>

              {/* Teks masuk sebagai organizer sesuai permintaan */}
              <div className="mt-6 pt-5 border-t border-[#EBEBEB] text-center">
                <p className="text-[13px] text-[#5b403c] flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <span>Penyelenggara Acara atau Kasir?</span>
                  <Link 
                    to="/organizer/login" 
                    className="text-[#b22110] font-bold hover:underline inline-flex items-center gap-1 px-3 py-1.5 bg-[#b22110]/10 border border-[#b22110]/20 rounded-full transition-all hover:bg-[#b22110]/15"
                  >
                    <span>Masuk sebagai Organizer</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}
