import { Link } from 'react-router-dom'
import { MapPin, QrCode } from 'lucide-react'
import { formatDate, formatTime, formatPrice } from '../utils/formatDate'

export default function TicketCard({ ticket }) {
  const isUsed = ticket.status === 'used'

  return (
    <div className={`bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-[#EBEBEB] hover:shadow-md transition-shadow ${isUsed ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="flex justify-between items-center text-xs font-bold text-[#5f5e5e]">
        <span>{formatDate(ticket.eventDate)}</span>
        <span className="text-[#f04e37]">{ticket.eventTime ? formatTime(ticket.eventTime) : '08:00 PM'}</span>
      </div>
      
      <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
        <img
          alt={ticket.eventTitle}
          className="w-full h-full object-cover"
          src={ticket.eventImage}
        />
      </div>
      
      <h2 className="text-lg font-bold text-[#271815] line-clamp-1">{ticket.eventTitle}</h2>
      
      <div className="flex items-center gap-2 text-[#5f5e5e] text-xs">
        <MapPin className="w-4 h-4" />
        <span className="truncate">{ticket.eventLocation}</span>
      </div>
      
      <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-[#EBEBEB]">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#5f5e5e]">Order ID</span>
          <span className="font-medium">{ticket.id}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#5f5e5e]">Total</span>
          <span className="text-[#271815]">Rp {ticket.price.toLocaleString('id-ID')}</span>
        </div>
      </div>
      
      <Link
        to={`/user/tickets/${ticket.id}`}
        className="w-full py-2.5 bg-[#f04e37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <QrCode className="w-5 h-5" />
        Lihat E-Ticket
      </Link>
    </div>
  )
}
