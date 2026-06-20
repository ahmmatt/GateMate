import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BannerSlider() {
  const navigate = useNavigate();
  
  // NOTE FOR DEVELOPER/ADMIN:
  // Array banners ini sementara masih hardcode (statis) untuk keperluan demo slider.
  // Nantinya, Anda bisa mengganti ini dengan hasil fetch API dari backend
  // Misalnya: const [banners, setBanners] = useState([]); useEffect(() => fetchBanners()...
  const banners = [
    {
      id: 1,
      type: 'image',
      image_url: '/1.png',
      target_url: '/discover'
    },
    {
      id: 2,
      type: 'image',
      image_url: '/2.png',
      target_url: '/discover'
    },
    {
      id: 3,
      type: 'image',
      image_url: '/3.png',
      target_url: '/discover'
    },
    {
      id: 4,
      type: 'image',
      image_url: '/4.png',
      target_url: '/discover'
    }
  ];

  const [internalSlide, setInternalSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Buat array baru dengan clone slide terakhir di awal, dan clone slide pertama di akhir
  const extendedBanners = [
    banners[banners.length - 1],
    ...banners,
    banners[0]
  ];

  // Hitung index slide yang sebenarnya sedang aktif (untuk indikator dan animasi scale)
  const actualSlide = internalSlide === 0 
    ? banners.length - 1 
    : internalSlide === banners.length + 1 
      ? 0 
      : internalSlide - 1;

  const handleNext = () => {
    if (internalSlide >= banners.length + 1) return;
    setIsTransitioning(true);
    setInternalSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (internalSlide <= 0) return;
    setIsTransitioning(true);
    setInternalSlide(prev => prev - 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setInternalSlide(prev => {
        if (prev >= banners.length + 1) return prev;
        setIsTransitioning(true);
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return; // Abaikan event dari elemen anak
    if (e.propertyName !== 'transform') return; // Hanya jalankan saat transisi geser selesai

    if (internalSlide === 0) {
      setIsTransitioning(false);
      setInternalSlide(banners.length);
    } else if (internalSlide === banners.length + 1) {
      setIsTransitioning(false);
      setInternalSlide(1);
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden group pt-4 pb-12"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
      }}
    >
      {/* Slider Track Wrapper - Bergeser memutar tanpa batas (infinite) */}
      <div 
        className="w-full"
        style={{ 
          transform: `translateX(calc(-${internalSlide} * (85% + 1rem)))`,
          transition: isTransitioning ? 'transform 700ms ease-out' : 'none'
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Inner Flex Track */}
        <div 
          className="flex items-center"
          style={{ 
            width: '100%',
            gap: '1rem'
          }}
        >
          {extendedBanners.map((banner, index) => {
            const originalIndex = index === 0 ? banners.length - 1 : index === extendedBanners.length - 1 ? 0 : index - 1;
            const isActive = originalIndex === actualSlide;
            
            return (
              <div
                key={`${banner.id}-${index}`}
                className={`w-[85%] flex-shrink-0 aspect-[2048/768] rounded-[24px] overflow-hidden transition-all duration-700 relative ${
                  isActive ? 'opacity-100 scale-100 shadow-2xl z-10' : 'opacity-40 scale-[0.95] z-0'
                }`}
                style={{
                  marginLeft: index === 0 ? '7.5%' : '0'
                }}
              >
                {banner.type === 'default' ? (
                  <div className="w-full h-full flex items-center justify-between px-8 md:px-16" style={{ backgroundColor: '#F04E37' }}>
                    <div className="space-y-4 md:space-y-6 max-w-lg z-10 text-white">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: '"FILL" 1' }}>stars</span>
                        <span className="text-[10px] md:text-caption tracking-widest uppercase opacity-80">Eksklusif di SecureGate</span>
                      </div>
                      <h1 className="text-2xl md:text-4xl font-bold leading-tight">EVENT MINGGU INI</h1>
                      <p className="text-white/70 text-sm md:text-body-lg">Temukan pengalaman terbaik dari konser musik hingga festival seni pilihan kurator kami.</p>
                      <button
                        onClick={() => navigate('/discover')}
                        className="bg-white px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all text-sm md:text-base"
                        style={{ color: '#0F1E3D' }}
                      >
                        Lihat Jadwal
                      </button>
                    </div>

                    <div className="hidden lg:block relative h-full w-[400px]">
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 flex gap-4">
                        <div className="w-56 h-80 rounded-2xl rotate-12 border border-white/20 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm" style={{ backgroundColor: 'rgba(240,78,55,0.9)' }}>
                          <span className="material-symbols-outlined text-white text-8xl mb-4">qr_code_2</span>
                          <div className="w-full border-t border-dashed border-white/30 my-4"></div>
                          <span className="text-white font-bold tracking-widest">SECURE PASS</span>
                        </div>
                        <div className="w-56 h-80 rounded-2xl -rotate-6 border border-white/20 flex items-center justify-center backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                          <span className="material-symbols-outlined text-8xl" style={{ color: 'rgba(255,255,255,0.2)' }}>confirmation_number</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full cursor-pointer relative overflow-hidden"
                    onClick={() => navigate(banner.target_url || '/discover')}
                  >
                    <img src={banner.image_url} alt={`Banner ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsTransitioning(true);
              setInternalSlide(idx + 1);
            }}
            className={`transition-all rounded-full ${idx === actualSlide ? 'w-8 h-2 bg-[#F04E37]' : 'w-2 h-2 bg-[#F04E37]/40 hover:bg-[#F04E37]/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
