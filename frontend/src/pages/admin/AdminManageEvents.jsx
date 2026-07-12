import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, CheckCircle, Ban, ChevronLeft, ChevronRight } from 'lucide-react'
import { dummyEvents } from '../../data/dummyEvents'
import { formatDate } from '../../utils/formatDate'

export default function AdminManageEvents() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua') // Semua, Active, Pending Review

  // Simulate active vs pending review for display purposes
  const events = dummyEvents.map((e, index) => ({
    ...e,
    mockStatus: index === 1 ? 'Pending Review' : index === 2 ? 'Ended' : 'Active',
    organizer: index === 1 ? 'Bandung Connect' : 'LiveNation ID',
    organizerType: index === 1 ? 'Basic Organizer' : 'Pro Organizer'
  }))

  const filteredEvents = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                        e.location.toLowerCase().includes(search.toLowerCase()) ||
                        e.organizer.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Semua' || e.mockStatus === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-[1200px] mx-auto space-y-[24px] animate-fade-in bg-[#fbf9f8] min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[32px] leading-10 tracking-tight font-medium text-[#1b1c1c]">Semua Event</h2>
          <p className="text-[14px] leading-5 text-[#5f5e5e] mt-1">Pantau dan kelola seluruh event dari berbagai organizer di platform.</p>
        </div>
      </div>

      {/* Bento Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f706a]" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama event atau organizer..." 
            className="w-full bg-[#f5f3f3] border-[0.5px] border-[#e3beb8] rounded-lg pl-10 pr-4 py-2 text-[14px] text-[#1b1c1c] focus:border-[#d63b27] focus:ring-0 transition-colors outline-none"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 md:col-span-2">
          {['Semua', 'Active', 'Pending Review'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[12px] font-medium shrink-0 transition-colors ${
                filter === f 
                  ? 'bg-[#b22110] text-[#ffffff]' 
                  : 'bg-[#fbf9f8] border-[0.5px] border-[#e3beb8] text-[#5f5e5e] hover:bg-[#efeded]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-[#fbf9f8] border-[0.5px] border-[#e3beb8] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-[#f5f3f3] border-b-[0.5px] border-[#e3beb8]">
            <tr>
              {['Poster', 'Nama Event', 'Organizer', 'Kategori', 'Tanggal', 'Status', 'Aksi'].map((header, index) => (
                <th key={header} className={`px-6 py-4 text-[12px] font-medium text-[#5f5e5e] uppercase tracking-tight ${index === 6 ? 'text-right' : ''}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-[0.5px] divide-[#e3beb8]">
            {filteredEvents.map(event => (
              <tr 
                key={event.id} 
                className={`hover:bg-[#ffffff] transition-colors ${event.mockStatus === 'Ended' ? 'opacity-70' : ''}`}
              >
                <td className="px-6 py-4">
                  <div className={`w-12 h-16 rounded overflow-hidden bg-[#e9e8e7] ${event.mockStatus === 'Ended' ? 'grayscale' : ''}`}>
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] font-bold text-[#1b1c1c]">{event.title}</p>
                  <p className="text-[11px] text-[#5f5e5e]">{event.location}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[#1b1c1c]">{event.organizer}</p>
                  <p className="text-[11px] text-[#5f5e5e]">{event.organizerType}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#e9e8e7] px-2 py-1 rounded text-[11px] text-[#5b403c]">{event.category}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[14px] text-[#1b1c1c]">{formatDate(event.date)}</p>
                  <p className="text-[11px] text-[#5f5e5e]">{event.time} WIB</p>
                </td>
                <td className="px-6 py-4">
                  {event.mockStatus === 'Active' && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">Active</span>
                  )}
                  {event.mockStatus === 'Pending Review' && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF08A] text-[#854D0E]">Pending Review</span>
                  )}
                  {event.mockStatus === 'Ended' && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#ffdad6] text-[#ba1a1a]">Ended</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-1">
                    {event.mockStatus === 'Pending Review' && (
                      <button className="p-2 text-[#15803D] hover:bg-[#DCFCE7] rounded transition-colors" title="Approve">
                        <CheckCircle className="w-[18px] h-[18px]" />
                      </button>
                    )}
                    <Link to={`/events/${event.id}`} className="p-2 text-[#b22110] hover:bg-[#ffdad4] rounded transition-colors" title="Detail">
                      <Eye className="w-[18px] h-[18px]" />
                    </Link>
                    {event.mockStatus === 'Active' && (
                      <button className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors" title="Suspend">
                        <Ban className="w-[18px] h-[18px]" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-[#5f5e5e] text-[14px]">
                  Tidak ada event yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between border-t-[0.5px] border-[#e3beb8] pt-4">
        <span className="text-[11px] text-[#5f5e5e]">Menampilkan 1-{filteredEvents.length} dari {events.length} Event</span>
        <div className="flex space-x-2">
          <button className="p-2 border-[0.5px] border-[#e3beb8] rounded-lg hover:bg-[#efeded] transition-colors disabled:opacity-30" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-[#ffdad4] text-[#b22110] font-bold rounded-lg text-[12px]">1</button>
          <button className="px-4 py-2 hover:bg-[#efeded] rounded-lg text-[12px] transition-colors">2</button>
          <button className="px-4 py-2 hover:bg-[#efeded] rounded-lg text-[12px] transition-colors">3</button>
          <button className="p-2 border-[0.5px] border-[#e3beb8] rounded-lg hover:bg-[#efeded] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
