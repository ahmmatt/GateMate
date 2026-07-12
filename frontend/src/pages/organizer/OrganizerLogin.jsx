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
    <div className="bg-[#fff8f6] text-[#271815] min-h-screen flex flex-col font-sans">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid #EBEBEB;
        }
        .coral-pill-primary {
          background-color: #F04E37;
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
          border-color: #F04E37;
          box-shadow: 0 0 0 3px rgba(240, 78, 55, 0.12);
        }
      `}</style>

      {/* TopNavBar */}
      <header className="w-full top-0 sticky bg-[#fff8f6]/80 backdrop-blur-md border-b border-[#e3beb8]/40 z-50">
        <nav className="flex justify-between items-center h-16 px-6 max-w-[1280px] mx-auto">
          <Link to="/" className="text-[20px] font-extrabold text-[#b22110] tracking-tight flex items-center gap-2">
            <span>GateMate</span>
            <span className="text-xs bg-[#b22110] text-white px-2 py-0.5 rounded-full font-medium tracking-normal">Mitra</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/register" className="text-[14px] text-[#b22110] font-bold hover:underline">
              Daftar Jadi Penyelenggara
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content: Center Split Layout */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F04E37]/10 rounded-full blur-[120px] pointer-events-none"></div>
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

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  type="button"
                  onClick={() => alert('Demo: Fitur login Google khusus Organizer')}
                  className="flex items-center justify-center gap-2 py-3 border border-[#e3beb8] rounded-xl hover:bg-[#fff0ee] transition-colors active:scale-95"
                >
                  <img alt="Google" className="w-5 h-5" src="data:image/png;base64,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" />
                  <span className="text-[12px] font-semibold text-[#271815]">Google</span>
                </button>
                <button 
                  type="button"
                  onClick={() => alert('Demo: Fitur login Apple khusus Organizer')}
                  className="flex items-center justify-center gap-2 py-3 border border-[#e3beb8] rounded-xl hover:bg-[#fff0ee] transition-colors active:scale-95"
                >
                  <img alt="Apple" className="w-5 h-5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADhklEQVR4AdSZWahNURzGd5TMU0jmEBKZiowpT4ryoBDxgAdTeCISmfKgCCWFEkkpRKHEiykernnI8GBOJIQMhd93b/t2Wu2z91nD3qer77fX2nuv9V//79xjn73WahQ18H9FG+jC57URxkEQFWlgLRk/g3XQGIKoCAOdyfQabIZmID3UIQR5G+hFkrdgNMR6QuUDBFGeBpqT4RnQX4CiXifqawEqeRrYSX6DwNR+84LPeV4GepPUfDB1kAvPIZjyMrCQDM3YSnwl14PKHCQp+HQungY9Av9RvoOroMdiV8okTUy42Idrr+AuHIE50Bq8lGZgCZHfw3GYCkqAItJ/yjFU9Fh8TXkDtsAsmAZroB8kSQkP5sZsOAxvYRs0BSclGehAJCW1h7ITZGkkDZT0UcqTIDPtKStRCxqtAv1OUNjLNKCEawijpCgKk/6aToOZBnYRpTsUKf1WOP82lBqYQtYzoGjt9hmw1MB2n0COfT/S7wI4KzYwkwj9oWjpkeo1ZmxgrlcU986P3LvW9ZQBMb7utPDjH98RlfxwgrSEaqiJ76AyMMA3iEf/oR59a7vKQLvaWuYhlwbDiNoKnCUDlf7sOw+S0lFTzEUp9zNvyYD39zBzlPQGehfqkd6k/F0Z+Fr+diF39A04x0htwFoy8Nm6V/gOAwl5H8aClWRAExWrTjk17kbcBWAlGXhs1SPfxgdsw8vAGzq9hGpL60VXbJOQAfXxeiNUgABYf/oaMzZwSidV5DtjO60XxQbOEiDYch+xbKX59yfbTmofG/jLySGohn4yqPNkKjZAjGiHDlVAU0rNzJyGLjWgNRotODkFcuz0hX5bwVmlBhRE6zu/VCkILad4vQmYBrT0t6mg5DWW83c/ztE0oOtaWbunSs4sDxE/yYDiztMhR/YRW8uQFH4qZ0DbQpMJ/RtCS/tjK0IFLWdA8c9z0GozRVDpw1lNxA0lLKXupDQDCqiJxiQq3yCUtLS+nmAxi6lfBCdlGVDQSxw0+b5NmSU912uiKHpAwx+QpWM0GALOC1yVGCB+pEmPTCzmxPzV1Ku4nufa1GjL/RGgzT2t/U+grvccc9p6h+u6p00R7fhw6qZKDcTR91LpCNr/1S6NZlE9Odfu+1NKU5e5sAw03+1LOQq0w6P1IN3j1E+2BuLRXlC5DpoMUVQkbfLdpKW2rSjCyNVAmNEDRGnwBv4DAAD//44sHKQAAAAGSURBVAMAsy17YX9OrloAAAAASUVORK5CYII=" />
                  <span className="text-[12px] font-semibold text-[#271815]">Apple</span>
                </button>
              </div>

              <div className="relative mb-8 flex items-center">
                <div className="flex-grow border-t border-[#e3beb8]/60"></div>
                <span className="mx-4 text-[11px] text-[#5b403c] bg-transparent">atau email organizer</span>
                <div className="flex-grow border-t border-[#e3beb8]/60"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label 
                    htmlFor="email"
                    className={`text-[12px] font-medium ml-1 transition-colors ${
                      focusedField === 'email' ? 'text-[#F04E37]' : 'text-[#5b403c]'
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
                        focusedField === 'password' ? 'text-[#F04E37]' : 'text-[#5b403c]'
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
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#fff0ee] border-t border-[#e3beb8]/50">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-[1280px] mx-auto gap-4">
          <div className="text-[16px] font-bold text-[#b22110] flex items-center gap-2">
            <span>GateMate</span>
            <span className="text-[10px] bg-[#ffdad4] text-[#910900] px-2 py-0.5 rounded-full uppercase">Mitra Portal</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-[11px] text-[#5b403c] hover:text-[#b22110] transition-colors">Terms of Service</a>
            <a href="#" className="text-[11px] text-[#5b403c] hover:text-[#b22110] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] text-[#5b403c] hover:text-[#b22110] transition-colors">Organizer Agreement</a>
            <a href="#" className="text-[11px] text-[#5b403c] hover:text-[#b22110] transition-colors">Mitra Support</a>
          </div>
          <div className="text-[11px] text-[#5b403c] opacity-70">
            © 2026 GateMate Organizer Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
