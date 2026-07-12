import React, { useState } from 'react';

export default function VibeBioForm({ isOpen, onClose }) {
  const [isFocused, setIsFocused] = useState(false);
  const [bioText, setBioText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 transition-opacity duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}} />
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[14px] shadow-2xl overflow-hidden border-[0.5px] border-[#EBEBEB] animate-fade-in duration-300">
        <div className="p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 rounded-full bg-[#FFF0EE] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Buat Vibe Bio Kamu</h2>
            <p className="font-body-md text-body-md text-secondary">Biarkan AI kami membantu peserta lain mengenalmu lebih baik melalui profil singkat yang relevan.</p>
          </div>
          
          {/* Form Field */}
          <div className="flex flex-col gap-2">
            <label 
              className={`font-label-md text-label-md transition-colors ${isFocused ? 'text-[#F04E37]' : 'text-on-surface-variant'}`} 
              htmlFor="vibe-bio"
            >
              Bio Deskripsi
            </label>
            <textarea 
              id="vibe-bio" 
              className="w-full bg-[#F5F5F7] border border-[#EBEBEB] rounded-[10px] p-4 text-body-md focus:ring-0 focus:border-[#F04E37] focus:outline-none transition-colors resize-none placeholder:text-on-surface-variant/50" 
              placeholder="Ceritakan minat atau tujuanmu hadir di event ini agar kami bisa mencocokkanmu dengan peserta lain..." 
              rows="4"
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            ></textarea>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              className="flex-1 bg-[#F04E37] text-white py-[10px] px-[22px] rounded-full font-body-md font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              onClick={() => {
                // Here you would typically save the data
                onClose();
              }}
            >
              <span>Simpan</span>
              <span className="material-symbols-outlined text-[18px]">check</span>
            </button>
            <button 
              className="flex-1 bg-transparent border border-[#F04E37] text-[#F04E37] py-[10px] px-[22px] rounded-full font-body-md font-medium hover:bg-[#FFF0EE] active:scale-[0.98] transition-all" 
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </div>
        
        {/* Cosmetic Detail: Subtle Pattern Footer */}
        <div className="h-1 bg-gradient-to-r from-[#F04E37]/10 via-[#F04E37] to-[#F04E37]/10"></div>
      </div>
    </div>
  );
}
