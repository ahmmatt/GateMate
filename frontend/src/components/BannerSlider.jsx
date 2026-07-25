import { useState, useEffect } from 'react';

const images = [
  '/1.png',
  '/2.png',
  '/3.png',
  '/4.png'
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full mt-2 pb-4 group">
      
      {/* Area Slider (Track + Efek Awan + Panah) */}
      <div className="relative w-full overflow-hidden">
        
        {/* Slider Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(calc(10% - ${currentIndex * 80}%))` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-[80%] flex-shrink-0 px-2 md:px-4">
              {/* aspect-[5/2] memaksa semua banner memiliki ukuran seragam (rasio 2.5) sehingga tidak ada yang besar/kecil. */}
              {/* object-cover memastikan banner memenuhi rasio tersebut dengan potongan minimal yang hampir tidak terlihat. */}
              <img 
                src={src} 
                alt={`Banner ${index + 1}`} 
                className="w-full aspect-[5/2] object-cover rounded-[16px] md:rounded-[24px] shadow-sm"
              />
            </div>
          ))}
        </div>
        
        {/* Efek Awan Putih di Kiri */}
        <div className="absolute top-0 left-0 w-[12%] md:w-[15%] h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10"></div>
        
        {/* Efek Awan Putih di Kanan */}
        <div className="absolute top-0 right-0 w-[12%] md:w-[15%] h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10"></div>
        
        {/* Tombol Panah Kiri */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 bg-white/90 hover:bg-white text-[#B22110] shadow-md rounded-full p-2 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          <span className="material-symbols-outlined text-sm md:text-xl font-bold">chevron_left</span>
        </button>
        
        {/* Tombol Panah Kanan */}
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 bg-white/90 hover:bg-white text-[#B22110] shadow-md rounded-full p-2 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          <span className="material-symbols-outlined text-sm md:text-xl font-bold">chevron_right</span>
        </button>
      </div>

      {/* Indikator Titik (Dots) sekarang diletakkan murni di bawah banner (tidak menumpuk) dengan jarak mt-6 */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-[#B22110] w-6 md:w-8' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
