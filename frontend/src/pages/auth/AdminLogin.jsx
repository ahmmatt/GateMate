import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react'
import { authService } from '../../services/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      const payload = response.data?.data || response.data || {}
      const { user, token, access_token } = payload
      const authToken = token || access_token

      if (!user || !authToken) {
        throw new Error(response.data?.message || 'Respons autentikasi tidak valid dari server.')
      }

      // Verifikasi keamanan route: pastikan hanya role superadmin yang bisa masuk
      if (user.role !== 'superadmin') {
        setError('Keamanan Sistem: Akses ditolak. Akun Anda tidak memiliki otorisasi Superadmin.')
        setLoading(false)
        return
      }

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(user))
      
      const targetRoute = '/superadmin/dashboard'
      navigate(targetRoute)
    } catch (err) {
      console.warn('Backend login tidak terjangkau atau gagal, memeriksa kredensial fallback offline...')
      // Graceful fallback offline khusus untuk superadmin demo saat API offline
      if (email === 'superadmin@gatemate.com' && password === 'password123') {
        const mockRole = 'superadmin'
        const mockUser = { id: 1, name: 'Superadmin GateMate', email, role: mockRole }
        localStorage.setItem('token', 'mock-superadmin-token-123')
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        navigate('/superadmin/dashboard')
      } else {
        setError(err.response?.data?.message || err.message || 'Email atau password salah. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 bg-[#fff8f6]">
      <div className="bg-white w-full max-w-[440px] rounded-[14px] border border-[#EBEBEB] p-8 md:p-10 transition-all duration-300 shadow-sm animate-slide-up">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#b22110] to-[#F04E37] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#b22110]/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[#271815] text-xl font-bold mb-2">Portal Superadmin</h1>
          <p className="text-[#5f5e5e] text-sm">Masuk ke akun Anda untuk mengelola platform GateMate.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'email' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gatemate.com"
                required
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] pl-10 pr-4 py-3 text-sm focus:border-[#b22110] transition-colors text-[#271815] outline-none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-semibold ml-1 transition-colors duration-200 ${
                focusedField === 'password' ? 'text-[#b22110]' : 'text-[#5f5e5e]'
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f5e5e]" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] pl-10 pr-10 py-3 text-sm focus:border-[#b22110] transition-colors text-[#271815] outline-none"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f5e5e] flex items-center justify-center hover:text-[#271815] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-[10px] p-3 text-[#ba1a1a] text-xs font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-[#b22110] text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-4 flex justify-center items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              'Masuk sebagai Admin'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
