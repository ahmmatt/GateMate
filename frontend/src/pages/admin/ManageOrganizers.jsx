import { useState } from 'react'

// Format helper
const formatLongDate = (dateString) => {
  if (!dateString) return '12 Okt 2023'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function KtpModal({ organizer, onClose, onApprove }) {
  if (!organizer) return null
  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative animate-slide-up">
        <button 
          className="absolute top-4 right-4 text-[#5d5e60] hover:text-[#1c1b1b]" 
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h3 className="text-[18px] leading-[26px] font-medium text-[#1c1b1b] mb-6">Verifikasi Dokumen KTP</h3>
        <div className="aspect-[1.6/1] bg-[#f0edec] rounded-xl overflow-hidden mb-6 border border-[#e5e2e1]">
          {/* Displaying dummy KTP image or avatar as fallback */}
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6AlAZ-5cnI7lyKPAxewOpdZcxYjyuH347aYX4xSW5hzHsPshv3XZW0KFf-jzs2jIMmayt_rJs-x2P1lI2wT3GOC0eBTaqPmQimIbRsbZdY7vqRW_26UMQcFNZijV5X4TsPS26Y43x8twTl16Kp6u7wTPTUH-EIul4ir9WFWhFI8VRQGC3uGSt6jO9Gwncgxo740XE1ikkQrhHRqlrMSvTr1DJkXnxsm8u7uQDR9wCBii38SB4grk1-IPdAWO8egsJBo81PF24OPk" 
            alt="KTP Document" 
          />
        </div>
        <div className="flex justify-end gap-3">
          <button 
            className="px-6 py-2 border border-[#e5e2e1] rounded-full text-[14px] font-medium text-[#5d5e60] hover:bg-[#f6f3f2] transition-colors" 
            onClick={onClose}
          >
            Tutup
          </button>
          <button 
            className="px-6 py-2 bg-[#b22110] text-white rounded-full text-[14px] font-medium hover:opacity-90 transition-opacity"
            onClick={() => onApprove(organizer.id)}
          >
            Verifikasi Sekarang
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManageOrganizers() {
  const [search, setSearch] = useState('')
  const [pendingList, setPendingList] = useState([]) // TODO: fetch dari API → adminService.getPendingOrganizers()
  const [approveTarget, setApproveTarget] = useState(null)
  const [tab, setTab] = useState('pending') // 'pending' | 'active' | 'rejected'
  const [rejectedIds, setRejectedIds] = useState([])

  const activeOrganizers = [] // TODO: fetch dari API → adminService.getActiveOrganizers()

  const getFilteredList = () => {
    let list = []
    if (tab === 'pending') {
      list = pendingList.filter(o => !rejectedIds.includes(o.id))
    } else if (tab === 'active') {
      list = activeOrganizers
    } else if (tab === 'rejected') {
      list = pendingList.filter(o => rejectedIds.includes(o.id))
    }

    return list.filter(o =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.organizerName || '').toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    )
  }

  const filteredList = getFilteredList()

  const handleApprove = (id) => {
    setPendingList(prev => prev.filter(o => o.id !== id))
    setApproveTarget(null)
  }

  const handleReject = (id) => {
    setRejectedIds(prev => [...prev, id])
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-in bg-[#fcf9f8] min-h-full">
      <KtpModal
        organizer={approveTarget}
        onClose={() => setApproveTarget(null)}
        onApprove={handleApprove}
      />

      {/* Page Identity & Header */}
      <div className="mb-8">
        <h2 className="text-[28px] leading-[36px] tracking-[-0.02em] font-medium text-[#1c1b1b]">Verifikasi Organizer</h2>
        <p className="text-[15px] leading-[24px] text-[#5d5e60]">Kelola dan verifikasi penyelenggara platform untuk menjaga keamanan ekosistem.</p>
      </div>

      {/* Dashboard Controls */}
      <div className="bg-white border border-[#e5e2e1] rounded-xl mb-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-[#e5e2e1] md:border-none">
            <button 
              onClick={() => setTab('pending')}
              className={`text-[12px] py-3 font-semibold ${tab === 'pending' ? 'text-[#b22110] border-b-2 border-[#F04E37]' : 'text-[#5d5e60] hover:text-[#1c1b1b] transition-colors'}`}
            >
              Menunggu Verifikasi
            </button>
            <button 
              onClick={() => setTab('active')}
              className={`text-[12px] py-3 font-semibold ${tab === 'active' ? 'text-[#b22110] border-b-2 border-[#F04E37]' : 'text-[#5d5e60] hover:text-[#1c1b1b] transition-colors'}`}
            >
              Terverifikasi
            </button>
            <button 
              onClick={() => setTab('rejected')}
              className={`text-[12px] py-3 font-semibold ${tab === 'rejected' ? 'text-[#b22110] border-b-2 border-[#F04E37]' : 'text-[#5d5e60] hover:text-[#1c1b1b] transition-colors'}`}
            >
              Ditolak
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5d5e60] text-[20px]">search</span>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau organisasi..." 
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border-none rounded-[10px] focus:ring-1 focus:ring-[#b22110] text-[14px] placeholder:text-[#5d5e60] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white border border-[#e5e2e1] rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#e5e2e1]">
                {['Nama & Organizer', 'Kontak', 'Media Sosial', 'Dokumen', 'Tgl Daftar', 'Status', 'Aksi'].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-[12px] font-medium text-[#5d5e60] uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2e1]">
              {filteredList.map((org, index) => (
                <tr key={org.id} className={`${index % 2 === 0 ? 'hover:bg-[#F9F9F9]' : 'bg-[#F9F9F9] hover:bg-[#f0edec]'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f0edec]">
                        <img src={org.avatar || `https://ui-avatars.com/api/?name=${org.name}&background=random`} alt={org.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#1c1b1b]">{org.name}</p>
                        <p className="text-[11px] text-[#5d5e60]">{org.organizerName || 'Organisasi'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-[14px] text-[#1c1b1b]">{org.email}</p>
                      <p className="text-[11px] text-[#5d5e60]">{org.phone || '+62 800-0000-0000'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#5d5e60]">alternate_email</span>
                      <span className="material-symbols-outlined text-[18px] text-[#5d5e60]">movie</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {tab === 'pending' ? (
                      <button 
                        onClick={() => setApproveTarget(org)}
                        className="flex items-center gap-2 text-[#b22110] hover:underline text-[12px] font-medium"
                      >
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        Lihat KTP
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 text-[#5d5e60] hover:text-[#b22110] transition-colors text-[12px] font-medium">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Terarsip
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#1c1b1b]">
                    {formatLongDate(org.joinedAt)}
                  </td>
                  <td className="px-6 py-4">
                    {tab === 'pending' && (
                      <span className="px-3 py-1 rounded-[10px] bg-[#ffdad4] text-[#910900] text-[11px] font-medium inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b22110] animate-pulse"></span>
                        Menunggu
                      </span>
                    )}
                    {tab === 'active' && (
                      <span className="px-3 py-1 rounded-[10px] bg-[#dfdfe1] text-[#616365] text-[11px] font-medium inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5d5e60]"></span>
                        Terverifikasi
                      </span>
                    )}
                    {tab === 'rejected' && (
                      <span className="px-3 py-1 rounded-[10px] bg-red-100 text-red-800 text-[11px] font-medium inline-flex items-center gap-1">
                        Ditolak
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tab === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setApproveTarget(org)}
                          className="bg-[#b22110] text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:opacity-90 transition-opacity"
                        >
                          Verifikasi
                        </button>
                        <button 
                          onClick={() => handleReject(org.id)}
                          className="text-[#ba1a1a] border border-[#ba1a1a] px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ba1a1a]/5 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <button className="text-[#ba1a1a] border border-[#ba1a1a]/30 bg-transparent px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ba1a1a]/5 transition-colors">
                        Cabut Akses
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#5d5e60]">
                    Tidak ada data organizer ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e2e1] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-[11px] font-medium text-[#5d5e60]">
            Menampilkan 1-{filteredList.length} dari {filteredList.length} organizer
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#e5e2e1] rounded-lg text-[#5d5e60] hover:bg-[#f6f3f2] transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#b22110] text-white text-[12px] font-medium">1</button>
            <button className="p-2 border border-[#e5e2e1] rounded-lg text-[#5d5e60] hover:bg-[#f6f3f2] transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
