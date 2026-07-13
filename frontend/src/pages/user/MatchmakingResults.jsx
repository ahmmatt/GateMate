import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function MatchmakingResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedMatches = (() => {
    try {
      const data = localStorage.getItem('last_ai_matches');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  })();
  const matches = location.state?.matches || storedMatches;

  return (
    <div className="bg-background text-on-surface flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
      `}} />
      
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-surface-container-low py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto px-container-padding text-center">
            <div className="inline-flex items-center gap-2 mb-4 bg-surface-container-highest px-4 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider">AI Powered</span>
            </div>
            <h1 className="font-headline-lg md:text-headline-lg text-headline-lg-mobile text-on-surface mb-2">Temukan Teman Sefrekuensi</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Hasil Pencocokan AI berdasarkan minat, riwayat acara, dan preferensi koneksi Anda.</p>
          </div>
        </section>

        {/* Results Section */}
        <section className="max-w-[1280px] mx-auto px-container-padding -mt-8 mb-16">
          {matches.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-card text-center">
              <span className="material-symbols-outlined text-[48px] text-secondary mb-4">search_off</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Belum Ada Rekomendasi</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Kami belum menemukan orang yang cocok. Silakan coba lagi nanti atau perbarui Vibe Bio Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gap-default">
              {matches.map((match, index) => (
                <div key={index} className={`bg-surface-container-lowest ${index === 0 ? 'border-2 border-primary' : 'border-[0.5px] border-outline-variant'} p-6 rounded-card shadow-sm flex flex-col items-center relative transform hover:-translate-y-1 transition-all duration-300`}>
                  {index === 0 && (
                    <div className="absolute -top-3 bg-primary text-on-primary px-3 py-1 rounded-full text-caption font-bold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      Best Match
                    </div>
                  )}
                  <div className={`w-24 h-24 rounded-full overflow-hidden mb-4 ${index === 0 ? 'border-4 border-surface-container' : 'border-2 border-surface-container'}`}>
                    {match.avatar ? (
                      <img alt={match.name} src={match.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
                        {match.name ? match.name.substring(0, 2).toUpperCase() : 'US'}
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{match.name || 'Peserta'}</h3>
                  <div className="bg-surface-container-low px-2 py-0.5 rounded-full mb-3">
                    <span className="text-[11px] font-medium text-primary">{match.score}% Match</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center mb-6 line-clamp-3">
                    "{match.reason || match.vibe_bio}"
                  </p>
                  <div className="flex flex-col items-center gap-2 mb-4">
                    {match.ig_handle && (
                      <a href={`https://instagram.com/${match.ig_handle}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-[18px]">camera</span>
                        <span className="font-label-md text-label-md">@{match.ig_handle}</span>
                      </a>
                    )}
                    {match.tiktok_handle && (
                      <a href={`https://tiktok.com/@${match.tiktok_handle}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-[18px]">music_note</span>
                        <span className="font-label-md text-label-md">@{match.tiktok_handle}</span>
                      </a>
                    )}
                  </div>
                  <button onClick={() => navigate('/user/chat', { state: { targetUserId: match.id_user, targetUserName: match.name } })} className="mt-auto w-full py-2.5 px-6 border border-primary text-primary font-medium rounded-full hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">chat</span> Say Hello
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Additional Options */}
        <section className="max-w-[1280px] mx-auto px-container-padding pb-16">
          <div className="bg-white border-[0.5px] border-outline-variant rounded-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">Bukan yang Anda cari?</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">Update preferensi minat Anda untuk hasil pencocokan yang lebih akurat.</p>
            </div>
            <button
              onClick={() => navigate('/user/profile')}
              className="whitespace-nowrap px-8 py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 active:scale-95 transition-all"
            >
              Perbarui Preferensi
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
