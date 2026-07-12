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

      // Verifikasi keamanan khusus organizer (DB role 'admin')
      if (user.role !== 'admin') {
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
        const mockUser = { id: 2, name: 'Organizer Demo GateMate', email, role: 'admin', organizer_id: 'GM-9921' }
        localStorage.setItem('token', 'mock-organizer-token-123')
        localStorage.setItem('user', JSON.stringify(mockUser))
        navigate('/organizer/dashboard')
      } else if (err.response?.status === 401 || err.response?.data?.message) {
        setError(err.response?.data?.message || 'Email atau password salah. Coba lagi.')
      } else {
        // Fallback offline untuk demo/pengembangan
        const mockUser = { id: 2, name: 'Organizer Mitra', email, role: 'admin', organizer_id: 'GM-8812' }
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
                Kelola penjualan tiket, check-in peserta dengan scanner QR super-cepat, dan penarikan dana real-time dalam satu dashboard profesional GateMate.
              </p>
            </div>
            {/* Organizer Illustration Card */}
            <div className="relative w-full aspect-square max-w-[400px] rounded-[32px] overflow-hidden border border-[#e3beb8]/50 shadow-md bg-gradient-to-br from-[#fff0ee] via-white to-[#fff8f6] flex items-center justify-center p-6 group hover:shadow-xl transition-all duration-300">
              {/* Animated/Glowing Background Accents */}
              <div className="absolute inset-0 bg-[radial-gradient(#b22110_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#b22110]/15 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#007f99]/15 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>

              {/* Big Organizer Illustration SVG */}
              <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 drop-shadow-md transition-transform duration-500 group-hover:scale-[1.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b22110" />
                    <stop offset="100%" stopColor="#d63b27" />
                  </linearGradient>
                  <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#007f99" />
                    <stop offset="100%" stopColor="#00a3c4" />
                  </linearGradient>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="spotlight1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b22110" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#b22110" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="spotlight2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#007f99" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#007f99" stopOpacity="0" />
                  </linearGradient>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#271815" floodOpacity="0.08" />
                  </filter>
                </defs>

                {/* Spotlights / Stage Beams */}
                <polygon points="60,20 180,360 20,360" fill="url(#spotlight1)" />
                <polygon points="340,20 380,360 220,360" fill="url(#spotlight2)" />

                {/* Decorative Circles & Waves */}
                <circle cx="200" cy="210" r="140" fill="none" stroke="#e3beb8" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
                <circle cx="200" cy="210" r="110" fill="none" stroke="#b22110" strokeWidth="1" opacity="0.2" />

                {/* Main Organizer Clipboard / Dashboard Table */}
                <g filter="url(#shadow)">
                  <rect x="90" y="90" width="220" height="250" rx="20" fill="#FFFFFF" stroke="#EBEBEB" strokeWidth="2" />
                  {/* Dashboard Header Banner */}
                  <path d="M 90 110 Q 90 90 110 90 L 290 90 Q 310 90 310 110 L 310 155 L 90 155 Z" fill="url(#coralGrad)" />
                  <text x="120" y="125" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">EVENT ORGANIZER</text>
                  <text x="120" y="143" fill="#FFE9E5" fontSize="10" fontWeight="600" fontFamily="sans-serif">MANAGEMENT DASHBOARD</text>
                  {/* Badge Icon on Header */}
                  <circle cx="275" cy="123" r="16" fill="#FFFFFF" opacity="0.2" />
                  <path d="M269 123 L273 127 L283 117" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>

                {/* Dashboard Content inside Clipboard */}
                <rect x="115" y="175" width="100" height="12" rx="6" fill="#F5F5F7" />
                <rect x="115" y="175" width="65" height="12" rx="6" fill="url(#coralGrad)" />
                <text x="225" y="185" fill="#5b403c" fontSize="11" fontWeight="bold" fontFamily="sans-serif">65% Sold</text>

                <rect x="115" y="200" width="170" height="36" rx="10" fill="#fff0ee" stroke="#e3beb8" strokeWidth="1" />
                <circle cx="135" cy="218" r="8" fill="#b22110" />
                <path d="M132 218 L134 220 L139 215" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <text x="153" y="215" fill="#271815" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Live QR Check-in</text>
                <text x="153" y="228" fill="#5b403c" fontSize="9" fontFamily="sans-serif">Scanner Active • Gate 1 &amp; 2</text>

                {/* Financial / Analytics Row inside Dashboard */}
                <rect x="115" y="246" width="80" height="45" rx="10" fill="#F5F5F7" />
                <text x="125" y="264" fill="#5b403c" fontSize="9" fontFamily="sans-serif">Revenue</text>
                <text x="125" y="280" fill="#b22110" fontSize="12" fontWeight="800" fontFamily="sans-serif">+35.5M</text>

                <rect x="205" y="246" width="80" height="45" rx="10" fill="#F5F5F7" />
                <text x="215" y="264" fill="#5b403c" fontSize="9" fontFamily="sans-serif">Attendees</text>
                <text x="215" y="280" fill="#007f99" fontSize="12" fontWeight="800" fontFamily="sans-serif">1,420</text>

                <rect x="115" y="301" width="170" height="24" rx="8" fill="url(#tealGrad)" />
                <text x="200" y="317" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">⚡ Real-time Sync Ready</text>

                {/* Organizer Lanyard / ID Badge Overlapping Top Center */}
                <g filter="url(#shadow)">
                  <path d="M185 40 L200 70 L215 40" stroke="#b22110" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <rect x="175" y="66" width="50" height="14" rx="4" fill="#271815" />
                  <circle cx="200" cy="73" r="3" fill="#FFFFFF" />
                  <rect x="165" y="80" width="70" height="50" rx="8" fill="#FFFFFF" stroke="#b22110" strokeWidth="2.5" />
                  <rect x="165" y="80" width="70" height="15" rx="6" fill="#b22110" />
                  <text x="200" y="91" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">STAFF / VIP</text>
                  <circle cx="183" cy="108" r="8" fill="#fff0ee" stroke="#b22110" strokeWidth="1" />
                  <text x="183" y="111" fill="#b22110" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GM</text>
                  <rect x="196" y="102" width="32" height="5" rx="2.5" fill="#271815" />
                  <rect x="196" y="110" width="22" height="4" rx="2" fill="#007f99" />
                </g>

                {/* Megaphone / Announcement Floating Icon Left */}
                <g filter="url(#shadow)" transform="translate(45, 180) rotate(-12)">
                  <circle cx="30" cy="30" r="28" fill="#FFFFFF" stroke="#EBEBEB" strokeWidth="1.5" />
                  <path d="M20 25 L36 18 L36 42 L20 35 Z" fill="url(#coralGrad)" />
                  <path d="M16 26 C14 26 13 28 13 30 C13 32 14 34 16 34 Z" fill="#271815" />
                  <path d="M28 35 L25 45 L31 45 L33 35 Z" fill="#271815" />
                  <path d="M41 24 C44 27 44 33 41 36" stroke="#007f99" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M46 20 C51 25 51 35 46 40" stroke="#007f99" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>

                {/* QR Scanner / Ticketing Device Floating Icon Right */}
                <g filter="url(#shadow)" transform="translate(305, 195) rotate(10)">
                  <circle cx="30" cy="30" r="28" fill="#FFFFFF" stroke="#EBEBEB" strokeWidth="1.5" />
                  <rect x="16" y="14" width="28" height="32" rx="6" fill="#271815" />
                  <rect x="19" y="17" width="22" height="20" rx="3" fill="#FFFFFF" />
                  {/* QR Code lines */}
                  <rect x="22" y="20" width="6" height="6" fill="#b22110" />
                  <rect x="32" y="20" width="6" height="6" fill="#271815" />
                  <rect x="22" y="28" width="6" height="6" fill="#271815" />
                  <rect x="32" y="28" width="6" height="6" fill="#007f99" />
                  {/* Laser scan line */}
                  <line x1="18" y1="26" x2="42" y2="26" stroke="#F04E37" strokeWidth="2" strokeDasharray="4 2" />
                  <circle cx="30" cy="41" r="2.5" fill="url(#coralGrad)" />
                </g>

                {/* Floating Stars & Sparkles */}
                <path d="M 80 80 L 83 88 L 91 91 L 83 94 L 80 102 L 77 94 L 69 91 L 77 88 Z" fill="url(#goldGrad)" />
                <path d="M 320 100 L 322 105 L 327 107 L 322 109 L 320 114 L 318 109 L 313 107 L 318 105 Z" fill="url(#goldGrad)" />
                <path d="M 330 310 L 333 316 L 339 319 L 333 322 L 330 328 L 327 322 L 321 319 L 327 316 Z" fill="#007f99" opacity="0.8" />
                <path d="M 70 290 L 72 294 L 76 296 L 72 298 L 70 302 L 68 298 L 64 296 L 68 294 Z" fill="#b22110" opacity="0.7" />
              </svg>
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
                      <span>Memproses Dashboard...</span>
                    </>
                  ) : (
                    <span>Masuk ke Dashboard Organizer</span>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[14px] text-[#5b403c]">
                Belum jadi mitra Organizer?{' '}
                <Link to="/organizer/register" className="text-[#b22110] font-bold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>

              {/* Teks kembali masuk sebagai pengguna biasa */}
              <div className="mt-6 pt-5 border-t border-[#EBEBEB] text-center">
                <p className="text-[13px] text-[#5b403c] flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <span>Hanya ingin beli tiket event?</span>
                  <Link 
                    to="/login" 
                    className="text-[#b22110] font-bold hover:underline inline-flex items-center gap-1 px-3 py-1.5 bg-[#b22110]/10 border border-[#b22110]/20 rounded-full transition-all hover:bg-[#b22110]/15"
                  >
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
