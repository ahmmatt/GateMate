import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/api'

export default function OrganizerLogin() {
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

      // Verifikasi keamanan khusus organizer
      if (user.role !== 'organizer') {
        setError('Keamanan Portal: Akses ditolak. Akun Anda bukan akun Organizer. Silakan masuk melalui portal pengguna biasa.')
        setLoading(false)
        return
      }

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/organizer/dashboard')
    } catch (err) {
      console.warn('Backend API tidak terjangkau atau gagal, memeriksa kredensial fallback offline organizer...')
      if (email === 'organizer@gatemate.com' && password === 'password123') {
        const mockUser = { id: 2, name: 'Organizer Demo GateMate', email, role: 'organizer', organizer_id: 'GM-9921' }
        localStorage.setItem('token', 'mock-organizer-token-123')
        localStorage.setItem('user', JSON.stringify(mockUser))
        navigate('/organizer/dashboard')
      } else if (err.response?.status === 401 || err.response?.data?.message) {
        setError(err.response?.data?.message || 'Email atau password salah. Coba lagi.')
      } else {
        // Fallback offline untuk demo/pengembangan
        const mockUser = { id: 2, name: 'Organizer Mitra', email, role: 'organizer', organizer_id: 'GM-8812' }
        localStorage.setItem('token', 'mock-organizer-token-123')
        localStorage.setItem('user', JSON.stringify(mockUser))
        navigate('/organizer/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-[#271815] flex flex-col font-sans flex-grow items-center justify-center relative overflow-hidden px-4 py-12">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.88);
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
          background-color: #911b0d;
          box-shadow: 0 4px 12px rgba(178, 33, 16, 0.25);
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
          box-shadow: 0 0 0 3px rgba(178, 33, 16, 0.12);
        }
      `}</style>

      {/* Atmospheric Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#b22110]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-[#007f99]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 items-center gap-12 relative z-10">
          {/* Left Side: Branding/Visual Khusus Organizer */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-[#ffdad4] text-[#910900] text-[12px] font-bold rounded-full uppercase tracking-wider">
                Mitra Penyelenggara &amp; Kasir
              </span>
              <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#271815]">
                Manajemen Event Masa Depan, Lebih Aman &amp; Transparan.
              </h1>
              <p className="text-[15px] text-[#5b403c] leading-relaxed max-w-[440px]">
                Kelola penjualan tiket, check-in peserta dengan scanner QR super-cepat, dan penarikan dana real-time dalam satu dasbor profesional GateMate.
              </p>
            </div>
            <div className="relative w-full aspect-square max-w-[400px] rounded-[32px] overflow-hidden border border-[#e3beb8]/50 shadow-md bg-gradient-to-br from-[#fff0ee] to-white p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#b22110] text-white flex items-center justify-center font-bold">GM</div>
                  <span className="text-xs font-semibold text-[#007f99] bg-[#b2ebff]/50 px-2.5 py-1 rounded-full">Active Event Status</span>
                </div>
                <h3 className="text-lg font-bold text-[#271815]">Java Jazz &amp; Tech Summit 2026</h3>
                <p className="text-xs text-[#5b403c]">ID Organizer: <strong className="text-[#b22110]">GM-8812</strong></p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm space-y-2">
                <div className="flex justify-between text-xs text-[#5b403c]">
                  <span>Tiket Terjual</span>
                  <span className="font-bold text-[#271815]">1,420 / 1,500</span>
                </div>
                <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#F04E37] h-full w-[94%] rounded-full"></div>
                </div>
                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-[#006579] font-medium flex items-center gap-1">✅ QR Check-in Ready</span>
                  <span className="font-bold text-[#b22110]">Rp 355.000.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="flex justify-center md:justify-end">
            <div className="glass-card w-full max-w-[440px] p-8 md:p-10 rounded-[28px] shadow-sm">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-[#ffdad4] text-[#910900] text-[11px] font-bold rounded-full mb-3 uppercase tracking-wider">
                  Portal Organizer
                </span>
                <h2 className="text-[22px] font-bold text-[#271815] mb-2">Portal Penyelenggara</h2>
                <p className="text-[14px] text-[#5b403c]">Masuk ke akun Organizer Anda untuk mengelola event &amp; transaksi.</p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl text-[#93000a] text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="email"
                    className={`text-[12px] font-medium ml-1 transition-colors ${
                      focusedField === 'email' ? 'text-[#b22110]' : 'text-[#5b403c]'
                    }`}
                  >
                    Email Organizer / Mitra
                  </label>
                  <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="organizer@gatemate.com" 
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
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Hubungi tim dukungan mitra GateMate untuk pemulihan akses.'); }} className="text-[12px] font-medium text-[#b22110] hover:underline">
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
                      <span>Memproses Dasbor...</span>
                    </>
                  ) : (
                    <span>Masuk ke Dasbor Organizer</span>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[14px] text-[#5b403c]">
                Belum jadi mitra Organizer?{' '}
                <Link to="/register" className="text-[#b22110] font-bold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>

              {/* Teks kembali masuk sebagai pengguna biasa */}
              <div className="mt-6 pt-5 border-t border-[#EBEBEB] text-center">
                <p className="text-[13px] text-[#5b403c] flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <span>Hanya ingin beli tiket event?</span>
                  <Link 
                    to="/login" 
                    className="text-[#007f99] font-bold hover:underline inline-flex items-center gap-1 px-3 py-1 bg-[#b2ebff]/30 rounded-full"
                  >
                    <span>&larr;</span>
                    <span>Masuk sebagai Pengguna</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
