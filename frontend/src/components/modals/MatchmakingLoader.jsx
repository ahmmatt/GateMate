import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchmakingLoader({ isOpen, onCancel }) {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => {
        navigate('/user/matchmaking');
      }, 3000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isOpen, navigate]);

  const handleCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/10 backdrop-blur-md">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      
      {/* Glassmorphic Modal */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-[16px] border border-white/50 rounded-[22px] shadow-xl overflow-hidden animate-fade-in">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Headline */}
          <h3 className="font-headline-md text-headline-md mb-8 text-on-surface">Mencari Partner Networking...</h3>
          
          {/* Dynamic Loading Ring */}
          <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="#FFF0EE" strokeWidth="6"></circle>
              <circle className="animate-[spin_3s_linear_infinite]" cx="50" cy="50" fill="none" r="45" stroke="#F04E37" strokeDasharray="283" strokeDashoffset="100" strokeWidth="6"></circle>
            </svg>
            {/* Inner Icon */}
            <div className="bg-surface-container-low rounded-full w-20 h-20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-primary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
          </div>
          
          {/* Status Messages */}
          <div className="w-full space-y-3 mb-10 text-left">
            <div className="flex items-center gap-3 bg-surface-container/50 px-4 py-3 rounded-[14px] border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              <span className="text-body-md text-on-surface font-medium">Analyzing interests...</span>
            </div>
            <div className="flex items-center gap-3 bg-surface-container/50 px-4 py-3 rounded-[14px] border border-outline-variant/30 shadow-sm">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span className="text-body-md text-on-surface font-medium">Scanning attendee pool...</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 opacity-40">
              <span className="material-symbols-outlined text-secondary text-[20px]">radio_button_unchecked</span>
              <span className="text-body-md text-secondary font-medium">Matching criteria...</span>
            </div>
          </div>
          
          {/* Batal Button */}
          <button 
            className="w-full border border-primary text-primary py-[10px] px-[22px] rounded-full font-medium hover:bg-surface-container-low transition-colors" 
            onClick={handleCancel}
          >
            Batal
          </button>
        </div>
        {/* Atmospheric Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
      </div>
    </div>
  );
}
