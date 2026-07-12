import { useState, useEffect } from 'react'
import { Users, Search, UserCheck, UserX, Trash2, MoreHorizontal } from 'lucide-react'
import { userService } from '../../services/api'
import { formatDateShort } from '../../utils/formatDate'

export default function ManageUsers() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll()
      if (res.data?.data) {
        setUsers(res.data.data)
      } else if (Array.isArray(res.data)) {
        setUsers(res.data)
      }
    } catch (err) {
      console.warn('Gagal memuat daftar pengguna dari API, menggunakan fallback.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = users.filter(u =>
    (u.name || u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Kelola Pengguna
          </h1>
          <p className="text-white/50 text-sm mt-1">Total {users.length} pengguna terdaftar</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari pengguna..."
          className="input-field pl-10 w-full"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Pengguna</th>
                <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Tiket</th>
                <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Bergabung</th>
                <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full flex-shrink-0" />
                      <span className="text-white font-medium text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60 text-sm">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60 text-sm">{user.ticketsCount || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/60 text-sm">{formatDateShort(user.joinedAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 hover:bg-emerald-500/10 rounded-lg transition-all text-white/40 hover:text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-amber-500/10 rounded-lg transition-all text-white/40 hover:text-amber-400">
                        <UserX className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30">Tidak ada pengguna ditemukan</div>
          )}
        </div>
      </div>
    </div>
  )
}
