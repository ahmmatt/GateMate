import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function CategorySection() {
  const categories = [
    { icon: 'music_note', label: 'Konser' },
    { icon: 'sports_soccer', label: 'Sport' },
    { icon: 'festival', label: 'Festival' },
    { icon: 'school', label: 'Seminar' },
    { icon: 'gallery_thumbnail', label: 'Pameran' },
    { icon: 'construction', label: 'Workshop' },
  ];

  return (
    <section className="bg-surface-container-lowest py-16">
      <div className="max-w-[1280px] mx-auto px-container-padding">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Kategori
            </h2>
            <p className="font-body-md text-body-md text-secondary">
              Cari berdasarkan minat dan hobi Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gap-default">
          {categories.map((category) => (
            <div
              key={category.label}
              className="group flex flex-col items-center gap-3 p-6 bg-white card-shadow rounded-[14px] hover:border-primary transition-all cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <MaterialIcon icon={category.icon} className="text-3xl" />
              </div>
              <span className="font-body-md text-body-md font-medium">
                {category.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
