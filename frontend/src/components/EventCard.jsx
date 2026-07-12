import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users, ArrowRight, Tag } from 'lucide-react'
import { formatDate, formatPrice, soldPercentage } from '../utils/formatDate'

export default function EventCard({ event }) {
  const percentage = soldPercentage(event.maxAttendees, event.soldTickets)
  const isAlmostFull = percentage >= 80
  const isFull = percentage >= 100

  return (
    <div className="bg-white rounded-xl flex flex-col shadow-sm border border-[#EBEBEB] hover:shadow-md transition-all overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-[10px] text-[11px] font-bold text-[#b22110] bg-[#fff0ee]">
            {event.category}
          </span>
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3">
          <span 
            className="text-[12px] font-bold text-[#271815] px-3 py-1 rounded-xl shadow-sm"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
          >
            {formatPrice(event.price)}
          </span>
        </div>

        {/* Featured Tag */}
        {event.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="flex items-center gap-1 px-2 py-1 rounded-[10px] text-[11px] font-bold text-amber-700 bg-amber-100/90 backdrop-blur-sm">
              <Tag className="w-3 h-3" /> Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-bold text-[#271815] text-lg leading-tight line-clamp-2 group-hover:text-[#b22110] transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#5f5e5e] text-xs">
            <Calendar className="w-4 h-4 text-[#b22110] flex-shrink-0" />
            <span>{formatDate(event.date)} · {event.time} WIB</span>
          </div>
          <div className="flex items-center gap-2 text-[#5f5e5e] text-xs">
            <MapPin className="w-4 h-4 text-[#b22110] flex-shrink-0" />
            <span className="truncate">{event.location}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-[#5f5e5e] text-xs">
            <Users className="w-4 h-4 text-[#b22110] flex-shrink-0" />
            <span>{event.soldTickets.toLocaleString('id-ID')} / {event.maxAttendees.toLocaleString('id-ID')} tiket</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-1">
          <div className="flex justify-between text-[11px] font-medium text-[#5f5e5e] mb-1.5">
            <span>Tiket Terjual</span>
            <span className={isAlmostFull ? 'text-[#b22110] font-bold' : ''}>{percentage}%</span>
          </div>
          <div className="h-1.5 bg-[#EBEBEB] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-[#b22110]' :
                isAlmostFull ? 'bg-orange-500' :
                'bg-[#f04e37]'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#EBEBEB] my-1 border-dashed" />

        {/* Organizer & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={event.organizer.avatar} alt={event.organizer.name} className="w-6 h-6 rounded-full border border-[#EBEBEB]" />
            <span className="text-[#5f5e5e] font-medium text-xs truncate max-w-[120px]">{event.organizer.name}</span>
          </div>
          <Link
            to={`/events/${event.id}`}
            className="flex items-center gap-1 text-xs font-bold text-[#b22110] hover:bg-[#fff0ee] px-3 py-1.5 rounded-lg transition-colors group/btn"
          >
            Detail
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
