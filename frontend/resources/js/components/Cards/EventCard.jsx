import React from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function EventCard({ 
  image, 
  title, 
  location, 
  date, 
  price, 
  remaining, 
  trending = false 
}) {
  return (
    <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-[14px] overflow-hidden card-shadow group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="h-48 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {trending && (
          <div className="absolute top-3 right-3 bg-surface-container-low/90 backdrop-blur px-2 py-1 rounded-[10px]">
            <span className="font-caption text-caption text-primary font-bold">
              Trending
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center gap-1 text-secondary">
          <MaterialIcon icon="location_on" className="text-[18px]" />
          <span className="font-body-md text-body-md">{location}</span>
        </div>
        
        <div className="flex items-center gap-1 text-secondary">
          <MaterialIcon icon="calendar_today" className="text-[18px]" />
          <span className="font-body-md text-body-md">{date}</span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-outline-variant/30 flex justify-between items-center">
          <span className="font-headline-sm text-headline-sm text-primary">
            {price}
          </span>
          <span className="bg-surface-container-low text-primary-fixed-variant px-2 py-1 rounded-[10px] text-[11px] font-medium">
            {remaining}
          </span>
        </div>
      </div>
    </div>
  );
}
