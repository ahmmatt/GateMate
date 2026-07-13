import { useState, useEffect } from 'react'
import { Ticket } from 'lucide-react'
import TicketCard from '../../components/TicketCard'
import api from '../../lib/api'

export default function MyTickets() {
  const [filter, setFilter] = useState('active') // Default to 'active' for Upcoming
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/my-tickets')
        
        const mapTicket = (t, statusOverride) => ({
          id: t.order_id || t.id,
          status: statusOverride,
          eventDate: t.event?.start_date,
          eventTime: t.event?.start_time,
          eventTitle: t.event?.title,
          eventImage: t.event?.banner_image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
          eventLocation: t.event?.city || t.event?.venue_name || 'Lokasi tidak diketahui',
          price: t.gross_amount || 0
        })

        setUpcoming((res.data.data.upcoming || []).map(t => mapTicket(t, 'active')))
        setPast((res.data.data.past || []).map(t => mapTicket(t, 'used')))
      } catch (err) {
        console.error('Failed to fetch tickets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])
  
  const filtered = filter === 'active' ? upcoming : past
  const activeCount = upcoming.length

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Segmented Control */}
      <div className="flex flex-col gap-6 mb-10">
        <h1 className="text-[32px] font-bold text-[#271815]">My Tickets</h1>
        <div className="flex gap-8 border-b border-[#EBEBEB]">
          <button
            onClick={() => setFilter('active')}
            className={`pb-3 transition-all ${
              filter === 'active'
                ? 'text-[#b22110] font-bold border-b-2 border-[#b22110]'
                : 'text-[#5f5e5e] hover:text-[#271815]'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`pb-3 transition-all ${
              filter === 'used'
                ? 'text-[#b22110] font-bold border-b-2 border-[#b22110]'
                : 'text-[#5f5e5e] hover:text-[#271815]'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Ticket List Container */}
      <div className="space-y-4">
        {/* Section Sub-header */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between col-span-full mt-4">
            <span className="text-xs font-medium text-[#5f5e5e] uppercase tracking-wider">
              {filter === 'active' ? 'Upcoming Events' : 'Past History'}
            </span>
            {filter === 'active' && (
              <span className="text-xs font-medium text-[#b22110]">
                {activeCount} Active
              </span>
            )}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#EBEBEB] rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-[#fff0ee] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e3beb8]/30">
              <Ticket className="w-6 h-6 text-[#b22110]" />
            </div>
            <h3 className="text-[#271815] font-bold mb-1">Belum ada tiket</h3>
            <p className="text-[#5f5e5e] text-xs">Cari event seru dan beli tiket Anda!</p>
          </div>
        )}
      </div>
    </div>
  )
}
