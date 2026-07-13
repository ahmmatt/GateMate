import { useState, useEffect, useCallback } from 'react'
import { superadminService } from '../../services/api'

export default function Reports() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterAdmin, setFilterAdmin] = useState('Semua Admin')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await superadminService.getAuditLogs()
      if (res.data?.data) {
        setLogs(res.data.data)
      }
    } catch (err) {
      console.error('Gagal memuat log audit dari API:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const filteredLogs = logs.filter((log) => {
    if (filterAdmin !== 'Semua Admin' && log.adminName !== filterAdmin) return false
    if (startDate) {
      // log.date is in 'd M Y', need careful parsing if using strict dates, 
      // but for simplicity we assume the endpoint returns recent ones anyway
      // For accurate date filtering we might need the raw ISO string from backend
    }
    return true
  })

  // Dummy dynamic metrics based on logs
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')
  // Try to match 'd M Y' roughly
  const todayActivityCount = logs.filter(l => l.date.includes(new Date().getDate().toString().padStart(2, '0'))).length
  
  // Get unique admins
  const uniqueAdmins = [...new Set(logs.map(l => l.adminName))]

  return (
    <div className="animate-in fade-in">
      {/* Page Header (Hapus judul ganda di sini, biarkan subtitle saja atau tambahkan flex layout yang bersih) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-body-lg text-body-lg text-secondary">Lihat riwayat perubahan sistem oleh admin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-low transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Ekspor CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full font-label-md text-label-md hover:opacity-90 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filter Lanjutan
          </button>
        </div>
      </div>

      {/* Dashboard Style Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Total Aktivitas</p>
          <h3 className="text-primary font-headline-lg text-headline-lg font-bold">{logs.length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Aktivitas Hari Ini</p>
          <h3 className="text-on-surface font-headline-lg text-headline-lg font-bold">{todayActivityCount}</h3>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Persetujuan Terakhir</p>
          <h3 className="text-on-surface font-headline-lg text-headline-lg font-bold">{logs.filter(l => l.activityText?.toLowerCase().includes('verifikasi') || l.activityText?.toLowerCase().includes('approve')).length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Admin Aktif (Log)</p>
          <h3 className="text-on-surface font-headline-lg text-headline-lg font-bold">{uniqueAdmins.length}</h3>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-t-[14px] p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-secondary font-label-md text-label-md">Filter:</span>
          <select 
            value={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.value)}
            className="bg-surface-container-low border-none rounded-lg text-body-md py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="Semua Admin">Semua Admin</option>
            {uniqueAdmins.map(admin => (
              <option key={admin} value={admin}>{admin}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-surface-container-low border-none rounded-lg text-body-md py-1.5 px-3 focus:ring-1 focus:ring-primary outline-none" />
          <span className="text-secondary text-label-md">-</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-surface-container-low border-none rounded-lg text-body-md py-1.5 px-3 focus:ring-1 focus:ring-primary outline-none" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={fetchLogs} className="p-2 text-secondary hover:text-primary transition-colors" title="Refresh">
            <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-surface-container-lowest border-x border-b border-outline-variant rounded-b-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Waktu &amp; Tanggal</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Nama Admin</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Aktivitas / Aksi</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Target / Objek</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-8 bg-surface-container-high rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-[40px] opacity-40">history</span>
                      </div>
                      <p className="text-secondary font-body-md">Belum ada riwayat aktivitas log.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.map((log, index) => (
                <tr key={log.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'} hover:bg-surface-container-low transition-colors group active:scale-[0.99] duration-100`}>
                  <td className="px-6 py-4">
                    <p className="font-label-md text-label-md text-on-surface">{log.date}</p>
                    <p className="text-[11px] text-secondary">{log.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${log.adminColor}`}>
                        {log.adminInitial}
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">{log.adminName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${log.activityClass}`}>
                      {log.activityText}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-body-md text-body-md text-on-surface">{log.targetName}</p>
                    <p className="text-[11px] text-secondary">{log.targetSub}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-[20px] text-secondary hover:text-primary transition-colors" title="Lihat Detail">
                      open_in_new
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant">
          <p className="font-label-md text-label-md text-secondary">
            Menampilkan <span className="font-bold text-on-surface">{filteredLogs.length}</span> dari <span className="font-bold text-on-surface">{logs.length}</span> log aktivitas
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-low disabled:opacity-50 flex items-center justify-center text-secondary" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white font-label-md text-label-md">1</button>
            <button className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-low disabled:opacity-50 flex items-center justify-center text-secondary" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
