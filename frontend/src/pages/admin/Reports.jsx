export default function Reports() {
  const logs = [
    {
      id: 1,
      date: '14 Okt 2023',
      time: '09:42:15 WIB',
      adminInitial: 'BS',
      adminName: 'Budi Santoso',
      adminColor: 'bg-primary-fixed text-on-primary-fixed',
      activityClass: 'bg-green-100 text-green-800 border-green-200',
      activityText: 'Approved Organizer',
      targetName: 'Kreatif Event Solo',
      targetSub: 'ID: ORG-88219'
    },
    {
      id: 2,
      date: '14 Okt 2023',
      time: '08:15:22 WIB',
      adminInitial: 'DW',
      adminName: 'David Wijaya',
      adminColor: 'bg-secondary-container text-on-secondary-container',
      activityClass: 'bg-blue-100 text-blue-800 border-blue-200',
      activityText: 'Updated Platform Fee',
      targetName: 'Settings: Global Commission',
      targetSub: '2.5% → 2.8%'
    },
    {
      id: 3,
      date: '13 Okt 2023',
      time: '16:55:01 WIB',
      adminInitial: 'SA',
      adminName: 'Siti Aminah',
      adminColor: 'bg-tertiary-container text-on-tertiary-container',
      activityClass: 'bg-orange-100 text-orange-800 border-orange-200',
      activityText: 'Executed Withdrawal',
      targetName: 'IDR 12.500.000',
      targetSub: 'Target: BCA 881023***'
    },
    {
      id: 4,
      date: '13 Okt 2023',
      time: '14:20:10 WIB',
      adminInitial: 'BS',
      adminName: 'Budi Santoso',
      adminColor: 'bg-primary-fixed text-on-primary-fixed',
      activityClass: 'bg-red-100 text-red-800 border-red-200',
      activityText: 'Rejected Withdrawal',
      targetName: 'IDR 50.000.000',
      targetSub: 'Reason: Unmatched Identity'
    },
    {
      id: 5,
      date: '13 Okt 2023',
      time: '11:05:44 WIB',
      adminInitial: 'DW',
      adminName: 'David Wijaya',
      adminColor: 'bg-secondary-container text-on-secondary-container',
      activityClass: 'bg-gray-100 text-gray-800 border-gray-200',
      activityText: 'Updated Profile',
      targetName: 'Admin Settings',
      targetSub: 'Password Rotation'
    }
  ]

  return (
    <div className="animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">Audit Log</h2>
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

      {/* Dashboard Style Metrics (Small) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Total Aktivitas Hari Ini</p>
          <h3 className="text-primary font-headline-lg text-headline-lg font-bold">142</h3>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Persetujuan Pending</p>
          <h3 className="text-on-surface font-headline-lg text-headline-lg font-bold">12</h3>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Update Biaya Platform</p>
          <h3 className="text-on-surface font-headline-lg text-headline-lg font-bold">4</h3>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-[14px] border border-outline-variant">
          <p className="text-secondary font-label-md text-label-md mb-1">Admin Aktif</p>
          <h3 className="text-on-surface font-headline-lg text-headline-lg font-bold">08</h3>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-t-[14px] p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-secondary font-label-md text-label-md">Filter:</span>
          <select className="bg-surface-container-low border-none rounded-lg text-body-md py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-none">
            <option>Semua Admin</option>
            <option>Budi Santoso</option>
            <option>Siti Aminah</option>
            <option>David Wijaya</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input className="bg-surface-container-low border-none rounded-lg text-body-md py-1.5 px-3 focus:ring-1 focus:ring-primary outline-none" type="date" />
          <span className="text-secondary text-label-md">-</span>
          <input className="bg-surface-container-low border-none rounded-lg text-body-md py-1.5 px-3 focus:ring-1 focus:ring-primary outline-none" type="date" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          <button className="p-2 text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
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
              {logs.map((log, index) => (
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
                    <button className="material-symbols-outlined text-[20px] text-secondary group-hover:text-primary transition-colors">
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
          <p className="font-label-md text-label-md text-secondary">Menampilkan 1-5 dari 482 log aktivitas</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-outline-variant rounded-md hover:bg-surface-container-low disabled:opacity-50 flex items-center justify-center text-secondary" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white font-label-md text-label-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-outline-variant text-secondary hover:bg-surface-container-low font-label-md text-label-md">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-outline-variant text-secondary hover:bg-surface-container-low font-label-md text-label-md">3</button>
            <button className="p-2 border border-outline-variant rounded-md flex items-center justify-center hover:bg-surface-container-low text-secondary">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
