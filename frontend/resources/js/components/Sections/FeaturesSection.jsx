import React from 'react';
import FeatureCard from '../Cards/FeatureCard';

export default function FeaturesSection() {
  const features = [
    {
      icon: 'analytics',
      title: 'Real-time Analytics',
      description: 'Pantau penjualan tiket dan data kehadiran peserta secara instan melalui dashboard yang intuitif.'
    },
    {
      icon: 'verified_user',
      title: 'Sistem Anti-Fraud',
      description: 'Teknologi verifikasi wajah dan QR code unik memastikan tidak ada tiket palsu di event Anda.'
    },
    {
      icon: 'payments',
      title: 'Pencairan Dana Cepat',
      description: 'Proses penyelesaian pembayaran yang transparan dan terjadwal langsung ke akun perusahaan Anda.'
    }
  ];

  return (
    <section className="bg-surface-container-low/30 py-20 border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-container-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Kelola Event dengan Lebih Aman & Transparan
            </h2>
            <p className="font-body-lg text-body-lg text-secondary">
              Bergabunglah sebagai mitra penyelenggara SecureGate dan nikmati kemudahan manajemen tiket 
              dengan sistem keamanan berlapis.
            </p>
          </div>
          <button className="coral-pill px-8 py-3 border-2 border-primary text-primary font-body-md text-body-md hover:bg-primary hover:text-on-primary transition-all">
            Daftar Jadi Penyelenggara
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-gap-default">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
