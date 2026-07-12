import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function HeroSection() {
  return (
    <section className="relative px-container-padding py-16 md:py-24 max-w-[1280px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background max-w-md">
            Temukan event terbaikmu
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-lg">
            Platform tiket digital paling aman dan transparan untuk konser, festival, dan seminar eksklusif. 
            Dapatkan akses instan ke pengalaman tak terlupakan.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button className="coral-pill px-[22px] py-[10px] bg-primary text-on-primary font-body-md text-body-md hover:opacity-90 active:scale-95 transition-all">
              Jelajahi Event
            </button>
            <button className="coral-pill px-[22px] py-[10px] border border-primary text-primary font-body-md text-body-md hover:bg-surface-container-low active:scale-95 transition-all">
              Daftar Gratis
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl card-shadow">
            <img
              alt="Featured Event"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjKeZM_B8HohGvQEC3d1OUmzJKmSPx-nIzmeLNZRf3D_-AtDD9xsKiJDMaU6MQLVatj1b1fhG6xgZ6GXJOpP1bWHQfxTlDeAUeeNDV5gwoMCT-SGBDJ39KZKiKKkqqpg7EA6w-SCbHanimRVZrBDSSXTTtd6SwkrDagyHql5O54MA95FXyJ_lT8bFhMuWGQS5wsUbBKq2OTCgWvtFdt_9tZwXWpncyw80_NnWtqgvbCKK7jjFRK_6lFu7N-wqau-hqyq-k9KCtcVI"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 bg-surface-container-high p-4 rounded-xl shadow-lg border border-outline-variant/30 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <MaterialIcon icon="confirmation_number" fill={true} />
              </div>
              <div>
                <p className="font-label-md text-label-md text-primary-fixed-variant">
                  Tiket Terjamin
                </p>
                <p className="text-[10px] text-secondary">Keamanan Gate 100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
