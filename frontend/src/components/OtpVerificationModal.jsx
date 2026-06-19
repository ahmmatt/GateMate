import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../lib/api';
import useAuthStore from '../store/useAuthStore';

export default function OtpVerificationModal() {
  const { user, setAuth, token } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const hasSentInitial = useRef(false);

  // ✅ Semua hooks HARUS dipanggil sebelum conditional return
  // Countdown timer untuk kirim ulang OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSend = useCallback(async (silent = false) => {
    setSending(true);
    setError('');
    try {
      await api.post('/auth/otp/send');
      setCountdown(60);
      if (!silent) setSuccess('OTP baru telah dikirim ke WhatsApp Anda!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengirim OTP.';
      if (!silent) setError(msg);
      if (err.response?.status === 429) setCountdown(60);
    } finally {
      setSending(false);
    }
  }, []);

  // Kirim OTP pertama kali modal muncul (hanya sekali)
  useEffect(() => {
    if (user && !user.phone_verified_at && !hasSentInitial.current) {
      hasSentInitial.current = true;
      handleSend(true);
    }
  }, [user, handleSend]);

  // ✅ Conditional return SETELAH semua hooks
  if (!user || user.phone_verified_at) return null;

  const maskedPhone = user?.phone
    ? user.phone.replace(/(\d{4})(\d+)(\d{3})/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : '—';

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Masukkan 6 digit kode OTP terlebih dahulu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/otp/verify', { otp: code });
      const me = await api.get('/auth/me');
      setAuth(me.data.data, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Verifikasi gagal. Coba lagi.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0 || sending) return;
    handleSend(false);
  };

  return (
    // Backdrop — tidak bisa diklik untuk menutup
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#F04E37] to-[#c93a26] px-8 pt-8 pb-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* WhatsApp icon — path resmi, lurus tidak miring */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-9 h-9" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <h2 className="text-white font-bold text-xl mb-1">Verifikasi Nomor WhatsApp</h2>
          <p className="text-white/80 text-sm">
            Akun Anda perlu diverifikasi sebelum dapat digunakan
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-center text-[#555] text-sm mb-6">
            Kode OTP 6 digit telah dikirim ke WhatsApp
            <br />
            <span className="font-bold text-[#1a1a1a]">{maskedPhone}</span>
          </p>

          {/* OTP Input Boxes */}
          <div className="flex gap-3 justify-center mb-5" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                  ${digit ? 'border-[#F04E37] bg-red-50 text-[#F04E37]' : 'border-[#E0E0E0] bg-[#F9F9F9] text-[#1a1a1a]'}
                  focus:border-[#F04E37] focus:bg-red-50`}
              />
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
              {success}
            </div>
          )}

          {/* Tombol Verifikasi */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-[#F04E37] text-white py-3.5 rounded-full font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memverifikasi...
              </span>
            ) : 'Verifikasi Sekarang'}
          </button>

          {/* Kirim Ulang */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-[#888]">
                Kirim ulang OTP dalam{' '}
                <span className="font-bold text-[#F04E37]">{countdown} detik</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={sending}
                className="text-sm text-[#F04E37] font-semibold hover:underline disabled:opacity-50"
              >
                {sending ? 'Mengirim...' : 'Kirim Ulang OTP'}
              </button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-8 pb-6">
          <p className="text-xs text-center text-[#aaa]">
            Pastikan WhatsApp aktif · OTP berlaku 5 menit
          </p>
        </div>
      </div>
    </div>
  );
}
