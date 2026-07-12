import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 bg-white rounded-2xl card-shadow border border-outline-variant/20 hover:border-primary/50 transition-colors group">
      <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <MaterialIcon icon={icon} className="text-3xl" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">
        {title}
      </h3>
      <p className="font-body-md text-body-md text-secondary">
        {description}
      </p>
    </div>
  );
}
