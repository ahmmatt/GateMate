import React from 'react';

export default function CTASection() {
  return (
    <section className="max-w-[1280px] mx-auto px-container-padding py-16">
      <div className="bg-primary-container/20 rounded-3xl p-12 flex flex-col items-center text-center gap-6 border border-primary/10">
        <h2 className="font-headline-lg text-headline-lg text-primary">
          Siap untuk Pengalaman Baru?
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          Gabung dengan ribuan pengguna lainnya yang telah mempercayakan GateMate untuk urusan tiket mereka. 
          Cepat, Aman, dan Tanpa Ribet.
        </p>
        <div className="flex gap-4">
          <button className="coral-pill px-8 py-3 bg-primary text-on-primary font-body-md text-body-md hover:bg-primary/90 transition-all">
            Mulai Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
