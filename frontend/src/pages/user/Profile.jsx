import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarSrc, setAvatarSrc] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIzE_vnXaV1jDXsMtrnybIiDmvUurdy0R_DASaQkRMpqa0SeIYTS6basGwLluhXnATH70jDgGauoCMl9e4FkdJazgXK-pOTn8O9yApWtfVAEmBGvC2-9rWO47BXCF65AJwP_U3rnIX-Ke6g0JojCVSAXWvU3GSM9UVapjx9YB_Q5b-v9pORBmqr3G0ic-U2Cw-P45LpFvNngM2PneOqSvkgjVKwdKX2x69cnpFvAFIrpTz1WIqn9aWqFOxX1EjF9F-gYlzEuZyVrg'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
        }
        .flat-border {
            border-width: 0.5px;
        }
      `}} />

      {/* TopNavBar */}
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-container-padding pt-24 pb-10">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="font-headline-lg text-headline-lg mb-2">Edit Profil</h1>
            <p className="font-body-md text-body-md text-secondary">Kelola informasi akun Anda untuk keamanan maksimal</p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-10 group">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary-fixed p-1 bg-surface-container-lowest">
                <img 
                  className="w-full h-full rounded-full object-cover transition-opacity group-hover:opacity-80" 
                  src={avatarSrc}
                  alt="Profile Preview"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-label-md text-label-md text-primary font-bold hover:underline transition-all group-hover:opacity-80"
            >
              Ganti Foto
            </button>
          </div>

          {/* Settings Form Card */}
          <div className="bg-surface-container-lowest flat-border border-outline-variant rounded-[14px] p-8 mb-6 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="full-name">Nama Lengkap</label>
                <input className="bg-surface-container-low flat-border border-outline-variant rounded-[10px] px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-0 transition-colors outline-none" id="full-name" type="text" defaultValue="Ahmad Wijaya" />
              </div>
              
              {/* Email (Read Only) */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-highest/30 flat-border border-outline-variant rounded-[10px] px-4 py-3 font-body-md text-body-md text-secondary cursor-not-allowed outline-none" id="email" readOnly type="email" defaultValue="ahmad.wijaya@corporate.com" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">lock</span>
                </div>
              </div>

              {/* Face Verification Status */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-[12px] flat-border border-outline-variant">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">face</span>
                  <span className="font-body-md text-body-md font-medium">Status Verifikasi Wajah</span>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-caption font-medium rounded-full gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  Terverifikasi
                </span>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button 
                  className={`w-full text-white py-3 px-6 rounded-full font-body-md font-bold transition-all shadow-sm flex justify-center items-center gap-2
                    ${isSaved ? 'bg-green-600' : 'bg-primary hover:bg-primary-container active:scale-[0.98]'}`} 
                  type="submit"
                  disabled={isSaving || isSaved}
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span> Menyimpan...
                    </>
                  ) : isSaved ? (
                    <>
                      <span className="material-symbols-outlined">check</span> Berhasil Disimpan
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] flex-grow bg-outline-variant"></span>
              <span className="font-label-md text-label-md text-error tracking-wider uppercase font-bold">Danger Zone</span>
              <span className="h-[1px] flex-grow bg-outline-variant"></span>
            </div>
            <div className="bg-error-container/20 border border-error/20 rounded-[14px] p-6 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah menyimpan semua tiket aktif Anda.</p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-transparent border-2 border-error text-error py-3 px-6 rounded-full font-body-md font-bold hover:bg-error hover:text-white active:scale-[0.98] transition-all"
              >
                Keluar dari Akun
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full mt-auto border-t border-outline-variant flat no-shadows">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-container-padding max-w-[1280px] mx-auto gap-6 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary">GateMate</span>
            <span className="font-caption text-caption text-on-surface-variant">© 2024 GateMate. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Security Standards</span>
            <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
