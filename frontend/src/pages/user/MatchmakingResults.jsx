import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchmakingResults() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
        .glass-nav {
          backdrop-filter: blur(16px);
          background-color: rgba(255, 255, 255, 0.8);
        }
      `}} />
      
      {/* TopNavBar */}
      <nav className="w-full top-0 sticky z-50 glass-nav border-b border-outline-variant">
        <div className="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md font-extrabold text-primary cursor-pointer" onClick={() => navigate('/')}>
            GateMate
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer" onClick={() => navigate('/events')}>Jelajahi</a>
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/user/tickets')}>My Tickets</a>
            <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/user/wallet')}>Wallet</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-secondary hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer" onClick={() => navigate('/user/profile')}>
              <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZpZKCnyhiUMWXOhqjrFoVoGqtGLhdUJUSoIKjuh1m3KGnstR1ml3wjoSgOIQq9MRxhjK8M-SdaceyufjDxUygqrZgn7Gc9QBXz8j5MPSNxiFAgcqw13h4zsKihBr1-5ZodOhn2yVtwkfykbN3ubvikcRUEyDPexxoM3WZOrjDRdjnvyBugldPCDx4luR1MlDcv-wuJCD5x07ftAkUEojEAQ0mFPx0pKE3LC8wZkBji2dlCM9d1JWKvsLyagwssXLtluET7dNCiHE"/>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gap-default">
            
            {/* Card 1 (Best Match) */}
            <div className="bg-surface-container-lowest border-2 border-primary p-6 rounded-card shadow-sm flex flex-col items-center relative transform hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-3 bg-primary text-on-primary px-3 py-1 rounded-full text-caption font-bold shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                Best Match
              </div>
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface-container">
                <img alt="Budi Santoso" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfPMiF3-OGNUvcQ6xRal-oyCyJP1YkFSK56z0i9GY6yx6AstCOrEfgCsyUKRJ2YBeD6mlLWb6oNSgZnA-5ydLNFtYxeqIVihIrxMxp4IPHnSBwZyABNTjZYxH9lvBvj1lkU5LDvtqB4n0WV3nGencgMC6ZgyEbZXgH-f5P6WOl546PTCdeuOodE0EKv80EfpdBDdPiv_b3X5Y1uLojVqV8CgFeBkk8ccaSRwSHH45gxP48NJYq1zBSNT-9O_0Zuoonesj2wf4YZnQ" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Budi Santoso</h3>
              <div className="bg-surface-container-low px-2 py-0.5 rounded-full mb-3">
                <span className="text-[11px] font-medium text-primary">Tech & Coffee Enthusiast</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mb-6 line-clamp-3">
                Suka diskusi soal Web3 dan startup sambil nyari kopi susu terenak di kota. Sering dateng ke tech-conferences.
              </p>
              <div className="flex flex-col items-center gap-2 mb-4">
                <a href="#" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">camera</span>
                  <span className="font-label-md text-label-md">@budi_ig</span>
                </a>
                <a href="#" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">music_note</span>
                  <span className="font-label-md text-label-md">@budi_tt</span>
                </a>
              </div>
              <button onClick={() => navigate('/user/chat')} className="mt-auto w-full py-2.5 px-6 border border-primary text-primary font-medium rounded-full hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">chat</span> Say Hello
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant p-6 rounded-card shadow-sm flex flex-col items-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container">
                <img alt="Siti Aminah" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqaBwRNnd5vZ3AvZsCc0z3bOZImJLydrfnAf7ujHXChoppXyvLT3waEDlyRxRaCBW0n_FvVrtVyyKSUKkTumPVVCsmet8JKYakt95QIdRW2JBNeIuuywmo-rMQiHM3cAC-IGHAJSUN7BFFhjaecA76xJ0e3sL6TxmFpDZ57wbweYUDqT562IXj7FIWbCn-5VYUbCi0Mp1XemK9scaxJQTcZrEpYggbN-52S9fsZ0v-HBqqvhccjPK2S3pLyFQvG7Zo63O8YQLcFrE" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Siti Aminah</h3>
              <div className="bg-surface-container-low px-2 py-0.5 rounded-full mb-3">
                <span className="text-[11px] font-medium text-primary">Design & Art Collector</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mb-6 line-clamp-3">
                Hobi banget dateng ke gallery opening dan design workshops. Lagi cari temen buat hunting exhibition minggu depan!
              </p>
              <div className="flex flex-col items-center gap-2 mb-4">
                <a href="#" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">camera</span>
                  <span className="font-label-md text-label-md">@siti_ig</span>
                </a>
                <a href="#" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">music_note</span>
                  <span className="font-label-md text-label-md">@siti_tt</span>
                </a>
              </div>
              <button onClick={() => navigate('/user/chat')} className="mt-auto w-full py-2.5 px-6 border border-primary text-primary font-medium rounded-full hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">chat</span> Say Hello
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest border-[0.5px] border-outline-variant p-6 rounded-card shadow-sm flex flex-col items-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container">
                <img alt="Arif Wijaya" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuKlfBToRzNUuhAumnFNcI7hcl6U2J6Cnur5AqP7Ix2V7AA4YrdJqpZ5rpObrE5kkMriF7rXIHA8nHb9Bt00FSWH3CwOFxHPeU0ENHffoVmyzrfVKKLih2l1SyYXfy-qmVHmeHtCpAhzrAFJeDed0u1nz9N2PNBqFI27weu0iau2Ky2Lt96a6fc1HdxJ26ZEbGyS4aTv3g17t-w1f_hUa5nGYxwUTkKukGoTUKeWaphrIqa9fVdO1fkPFy405MxBBNNQo2Q_SdAa0" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Arif Wijaya</h3>
              <div className="bg-surface-container-low px-2 py-0.5 rounded-full mb-3">
                <span className="text-[11px] font-medium text-primary">Data Scientist & Runner</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mb-6 line-clamp-3">
                Siang ngolah data, sore lari marathon. Senang ngobrolin soal produktivitas dan sport science.
              </p>
              <div className="flex flex-col items-center gap-2 mb-4">
                <a href="#" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">camera</span>
                  <span className="font-label-md text-label-md">@arif_ig</span>
                </a>
                <a href="#" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">music_note</span>
                  <span className="font-label-md text-label-md">@arif_tt</span>
                </a>
              </div>
              <button onClick={() => navigate('/user/chat')} className="mt-auto w-full py-2.5 px-6 border border-primary text-primary font-medium rounded-full hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">chat</span> Say Hello
              </button>
            </div>

          </div>
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

      {/* Footer */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-container-padding max-w-[1280px] mx-auto">
          <div className="flex flex-col mb-6 md:mb-0">
            <div className="font-headline-sm text-headline-sm font-bold text-primary mb-2">GateMate</div>
            <p className="font-caption text-caption text-on-surface-variant">© 2024 GateMate. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
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
