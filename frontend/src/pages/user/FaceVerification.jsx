import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
  
  @keyframes pulse-gradient {
      0%, 100% { transform: scale(1); opacity: 0.04; }
      50% { transform: scale(1.1); opacity: 0.07; }
  }
  .animate-blob { animation: pulse-gradient 10s infinite ease-in-out; }

  @keyframes pulse-blob-alt {
      0% { transform: scale(1) translate(0, 0); opacity: 0.3; }
      50% { transform: scale(1.1) translate(20px, -20px); opacity: 0.5; }
      100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
  }
  .animate-blob-alt { filter: blur(60px); animation: pulse-blob-alt 8s ease-in-out infinite; }

  .fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }

  /* SCANNING animations */
  @keyframes scan-line-advanced {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
  }
  .animate-scan-advanced {
      animation: scan-line-advanced 3s linear infinite;
      background: linear-gradient(to bottom, transparent, #F04E37, transparent);
  }

  .hexagon-clip {
      clip-path: polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%);
  }
  
  @keyframes progress-ring { from { stroke-dashoffset: 283; } to { stroke-dashoffset: 0; } }
  .progress-ring-circle {
      stroke-dasharray: 283;
      stroke-dashoffset: 283;
      animation: progress-ring 5s linear forwards;
  }

  @keyframes dot-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .animate-dot { animation:dot-blink 1.2s ease-in-out infinite; }

  @keyframes pop-in { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  .animate-pop { animation:pop-in .55s cubic-bezier(.16,1,.3,1) forwards; }

  /* SUCCESS animations */
  @keyframes float-up {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }
`;

export default function FaceVerification() {
  const navigate = useNavigate();
  const location  = useLocation();
  const redirectTo = location.state?.redirectTo || '/user/tickets';

  const [step, setStep]         = useState('intro');   // intro | scanning | success | failed
  const [loading, setLoading]   = useState(false);
  const [meshOffsets, setMeshOffsets] = useState(Array(6).fill({x: 0, y: 0}));
  const [confetti, setConfetti] = useState([]);

  /* ── handlers ── */
  const startCamera = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('scanning');
      setTimeout(() => {
        // 80% chance success, 20% failed for demonstration
        const isSuccess = Math.random() > 0.2;
        setStep(isSuccess ? 'success' : 'failed');
      }, 5000);
    }, 1200);
  };

  const cancel = () => { setLoading(false); setStep('intro'); };
  const done   = () => navigate(redirectTo);

  // Mesh animation effect for scanning
  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setMeshOffsets(Array(6).fill(0).map(() => ({
          x: Math.random() * 4 - 2,
          y: Math.random() * 4 - 2
        })));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Confetti effect for success
  useEffect(() => {
    if (step === 'success') {
      const newConfetti = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + 'vw',
        delay: Math.random() * 3 + 's',
        size: (Math.random() * 4 + 4) + 'px',
        duration: (Math.random() * 2 + 3) + 's',
        opacity: Math.random() * 0.5 + 0.3
      }));
      setConfetti(newConfetti);
    } else {
      setConfetti([]);
    }
  }, [step]);

  /* ── shared card wrapper ── */
  const Card = ({ children, extra = '' }) => (
    <div className={`max-w-[420px] w-full bg-white/70 backdrop-blur-[16px] rounded-xl p-8 border-[0.5px] border-[#EBEBEB] shadow-sm fade-up ${extra}`}>
      {children}
    </div>
  );

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen relative overflow-hidden font-body-md flex flex-col selection:bg-primary/20">
      <style>{STYLES}</style>

      {/* Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute bg-green-500 rounded-full pointer-events-none z-10"
          style={{
            left: c.left,
            top: '100vh',
            width: c.size,
            height: c.size,
            opacity: c.opacity,
            animation: `float-up ${c.duration} linear ${c.delay} infinite`
          }}
        />
      ))}

      {/* Atmospheric Background Components */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px] animate-blob opacity-[0.04] hidden md:block" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-primary rounded-full blur-[100px] animate-blob opacity-[0.05] hidden md:block" style={{ animationDelay: '-2s' }} />
        
        {/* User's blobs for scanning state */}
        {step === 'scanning' && (
          <>
            <div className="animate-blob-alt absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary-fixed opacity-30 rounded-full"></div>
            <div className="animate-blob-alt absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-surface-container-highest opacity-40 rounded-full" style={{ animationDelay: '-2s' }}></div>
          </>
        )}

        {/* Success Blob */}
        {step === 'success' && (
          <>
            <div className="absolute w-[500px] h-[500px] -top-20 -left-20 rounded-full blur-[40px] -z-10" style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 70%)' }}></div>
            <div className="absolute w-[500px] h-[500px] -bottom-20 -right-20 rounded-full blur-[40px] -z-10" style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 70%)' }}></div>
          </>
        )}

        {/* Failed Blob */}
        {step === 'failed' && (
          <>
            <div className="absolute w-[500px] h-[500px] -top-20 -left-20 rounded-full blur-[40px] -z-10" style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0) 70%)' }}></div>
            <div className="absolute w-[500px] h-[500px] -bottom-20 -right-20 rounded-full blur-[40px] -z-10" style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0) 70%)' }}></div>
          </>
        )}
      </div>

      {/* Top Navigation Anchor */}
      {step === 'intro' && (
        <header className="w-full top-0 sticky z-50">
          <div className="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
            <div 
              className="font-headline-md text-headline-md font-bold text-primary cursor-pointer"
              onClick={() => navigate('/')}
            >
              SecureGate
            </div>
            <div className="font-label-md text-label-md bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant">
              Step 1 of 2
            </div>
          </div>
        </header>
      )}
      
      {step === 'scanning' && (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
          <div className="flex flex-col cursor-pointer" onClick={cancel}>
            <h1 className="text-headline-sm font-headline-sm font-bold text-on-surface">SecureGate</h1>
            <p className="text-label-md font-label-md text-secondary">Verifikasi Identitas</p>
          </div>
          <div className="text-right">
            <span className="text-label-md font-label-md text-primary font-bold">Langkah 2 dari 2</span>
            <div className="flex gap-1 mt-1 justify-end">
              <div className="h-1 w-6 bg-primary-container rounded-full opacity-30"></div>
              <div className="h-1 w-6 bg-primary rounded-full"></div>
            </div>
          </div>
        </header>
      )}

      {(step === 'success' || step === 'failed') && (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="text-headline-sm font-headline-sm font-bold text-on-surface">SecureGate</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-label-md font-label-md text-on-secondary-container">
                {step === 'success' ? 'Langkah 2 dari 2 Selesai' : 'Langkah 2 dari 2 Gagal'}
              </span>
              <div className="w-24 h-1 bg-secondary-fixed rounded-full mt-1 overflow-hidden">
                <div className={`w-full h-full transition-all duration-700 ${step === 'success' ? 'bg-primary' : 'bg-red-500'}`}></div>
              </div>
            </div>
            <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity" style={{ fontVariationSettings: "'FILL' 0" }}>help</button>
          </div>
        </header>
      )}

      {/* Main Canvas */}
      <main className={`flex-grow flex items-center justify-center px-container-padding relative z-10 ${step === 'scanning' || step === 'success' || step === 'failed' ? 'pt-20 pb-16 min-h-screen flex-col' : 'py-10'}`}>
        
        {/* ════ INTRO ════ */}
        {step === 'intro' && (
          <div className={`max-w-[480px] w-full bg-white/70 backdrop-blur-[16px] rounded-[24px] border border-[#EBEBEB] p-8 shadow-sm fade-up`}>
            {/* Biometric Icon Container */}
            <div className="flex justify-center mb-8 fade-up delay-1">
              <div className="w-20 h-20 rounded-full bg-[#FFF0EE] flex items-center justify-center">
                <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>
                  face_retouching_natural
                </span>
              </div>
            </div>

            {/* Header Content */}
            <div className="text-center mb-10 fade-up delay-2">
              <h1 className="font-headline-md text-headline-md font-medium text-[#111111] mb-3">Verifikasi Wajah Kamu</h1>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                Satu langkah terakhir sebelum kamu bisa membeli tiket. Wajahmu digunakan sebagai identitas unik dan tidak bisa dipindahtangankan.
              </p>
            </div>

            {/* Feature Rows (Bento style list) */}
            <div className="space-y-4 mb-10 fade-up delay-3">
              {[
                { icon: 'shield_person', label: 'Anti-calo & anti-bot' },
                { icon: 'lock',          label: 'Data biometrik terenkripsi' },
                { icon: 'bolt',          label: 'Check-in instan tanpa antre di gerbang' },
              ].map(({ icon, label }) => (
                <div key={icon} className="flex items-start gap-4 p-4 bg-white/50 border border-[#EBEBEB] rounded-xl transition-all hover:border-primary/20 hover:translate-x-1">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary">{icon}</span>
                  </div>
                  <div>
                    <span className="font-body-md text-on-surface font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="space-y-6 fade-up delay-3">
              <button 
                onClick={startCamera} 
                disabled={loading}
                className="w-full bg-primary text-white py-4 px-6 rounded-full font-label-md text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-default"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Menghubungkan...</>
                ) : (
                  <><span className="material-symbols-outlined">photo_camera</span> Aktifkan Kamera &amp; Mulai</>
                )}
              </button>
              <p className="text-center font-caption text-caption text-on-surface-variant px-4">
                Dengan melanjutkan, kamu menyetujui <a className="text-primary hover:underline underline-offset-4" href="#">Kebijakan Privasi SecureGate</a>
              </p>
            </div>
          </div>
        )}

        {/* ════ SCANNING ════ */}
        {step === 'scanning' && (
          <div className="relative w-full max-w-md mx-auto fade-up delay-1 flex flex-col items-center">
            {/* Status Top Label */}
            <div className="mb-8 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <span className="text-headline-md font-headline-md text-on-surface">Memindai</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </span>
              </div>
            </div>

            {/* Camera Feed Container */}
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              {/* Progress Ring Background */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="#F5F5F7" strokeWidth="2"></circle>
                <circle className="progress-ring-circle" cx="50" cy="50" fill="none" r="45" stroke="#F04E37" strokeLinecap="round" strokeWidth="2"></circle>
              </svg>

              {/* Hexagonal Frame */}
              <div className="relative w-[85%] h-[85%] hexagon-clip bg-surface-container shadow-[0_0_15px_rgba(240,78,55,0.2)] border-2 border-[#F04E37]/30 flex items-center justify-center overflow-hidden">
                {/* Placeholder Image (Camera Feed) */}
                <img 
                  alt="Facial Recognition Scan" 
                  className="w-full h-full object-cover grayscale-[20%]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsjyem3pCcnC9s82lbYwxOpRAFt5Z_y6i7FXwKSttpgo3eOXmhRVo9UU5UJuD_C2sRxaAcIwsW8EEPOJXiyogZ2YR6HrVBx6bilba4zp7p0A_pQ0pqenbaGFnr6ZD-AS-idACxy3Pl_7QxLi-oULyCTpVIZ8iTMUX_YUJA5BxJgOORh8oH3Y3YlzyjJPEqzOEBl5HVl3uh6_Iff60qZ1lPTU2kViYNtnK4cVunSiHddw88AbF-eRNhpQNBkFij0NIDmuldiu7fMaA" 
                />

                {/* Scanning Overlays */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {/* Laser Line */}
                  <div className="animate-scan-advanced absolute left-0 right-0 h-0.5 z-30"></div>
                  
                  {/* Reticle Corners (SVG) */}
                  <svg className="absolute inset-0 w-full h-full p-4 text-[#F04E37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 100">
                    <path d="M10 20 V10 H20" strokeLinecap="round"></path>
                    <path d="M80 10 H90 V20" strokeLinecap="round"></path>
                    <path d="M90 80 V90 H80" strokeLinecap="round"></path>
                    <path d="M20 90 H10 V80" strokeLinecap="round"></path>
                  </svg>
                  
                  {/* Mock Face Mesh Points */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="grid grid-cols-6 gap-6">
                      {meshOffsets.map((offset, i) => (
                        <div 
                          key={i} 
                          className="w-1 h-1 bg-[#F04E37] rounded-full animate-pulse transition-transform duration-1000 ease-in-out" 
                          style={{ animationDelay: `${i * 0.1}s`, transform: `translate(${offset.x}px, ${offset.y}px)` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions & Feedback */}
            <div className="mt-12 text-center space-y-4">
              <p className="text-body-lg font-body-lg text-on-surface">Posisikan wajah di dalam bingkai</p>
              <div className="inline-flex items-center px-3 py-1 bg-[#FFF0EE] text-[#B83020] rounded-full">
                <span className="material-symbols-outlined text-[14px] mr-1.5" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <span className="text-caption font-caption font-medium">Pastikan pencahayaan cukup terang</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="bg-transparent border-none cursor-pointer text-secondary text-sm hover:text-on-surface transition-colors" onClick={cancel}>
                Batalkan Pindai
              </button>
            </div>
          </div>
        )}

        {/* ════ SUCCESS ════ */}
        {step === 'success' && (
          <Card extra="flex flex-col items-center text-center">
            {/* Success Icon Animation Container */}
            <div className="relative mb-6">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-[#22C55E]/10 rounded-full scale-150 blur-xl"></div>
              {/* Main Icon Circle */}
              <div className="animate-pop w-[72px] h-[72px] bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform duration-500 hover:scale-110">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
            </div>
            {/* Identity Typography */}
            <h1 className="text-headline-md font-headline-md text-on-surface mb-2 font-bold">Identitas Terverifikasi</h1>
            <p className="text-body-md font-body-md text-secondary mb-8 max-w-[300px]">
              Wajahmu telah berhasil diverifikasi dan terenkripsi dengan aman.
            </p>
            {/* Status Indicator Chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <div className="bg-[#FFF0EE] text-[#B83020] px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                AES-256
              </div>
              <div className="bg-[#FFF0EE] text-[#B83020] px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Biometrik Aktif
              </div>
            </div>
            {/* Primary Action */}
            <button 
              onClick={done}
              className="w-full bg-[#F04E37] text-white py-3 px-6 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 text-body-md shadow-md"
            >
              Masuk ke Dasbor
            </button>
          </Card>
        )}

        {/* ════ FAILED ════ */}
        {step === 'failed' && (
          <Card extra="flex flex-col items-center text-center">
            {/* Failed Icon Animation Container */}
            <div className="relative mb-6">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-red-500/10 rounded-full scale-150 blur-xl"></div>
              {/* Main Icon Circle */}
              <div className="animate-pop w-[72px] h-[72px] bg-red-500 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform duration-500 hover:scale-110">
                <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
            </div>
            {/* Identity Typography */}
            <h1 className="text-headline-md font-headline-md text-on-surface mb-2 font-bold">Verifikasi Gagal</h1>
            <p className="text-body-md font-body-md text-secondary mb-8 max-w-[300px]">
              Wajah tidak dikenali atau pencahayaan kurang baik. Silakan coba lagi.
            </p>
            {/* Status Indicator Chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <div className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                Coba tempat lebih terang
              </div>
              <div className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
                Posisikan wajah di tengah
              </div>
            </div>
            {/* Primary Action */}
            <button 
              onClick={startCamera}
              className="w-full bg-[#F04E37] text-white py-3 px-6 rounded-full font-bold hover:opacity-90 transition-all active:scale-95 text-body-md shadow-md mb-3"
            >
              Coba Lagi
            </button>
            <button 
              onClick={cancel}
              className="w-full bg-transparent text-secondary py-3 px-6 rounded-full font-medium hover:bg-surface-container-low transition-all active:scale-95 text-body-md"
            >
              Batal
            </button>
          </Card>
        )}
      </main>

      {/* Bottom Navigation Shell (Always Rendered on Mobile during scanning) */}
      {step === 'scanning' && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 pb-safe bg-surface/80 backdrop-blur-md border-t border-outline-variant/30 md:hidden">
          <div className="flex flex-col items-center justify-center text-primary dark:text-inverse-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-label-md font-label-md">Verify</span>
          </div>
          <div className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low transition-colors rounded-lg px-4 py-1">
            <span className="material-symbols-outlined">history</span>
            <span className="text-label-md font-label-md">History</span>
          </div>
          <div className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low transition-colors rounded-lg px-4 py-1">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="text-label-md font-label-md">Support</span>
          </div>
        </nav>
      )}
    </div>
  );
}
