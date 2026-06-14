import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';
import SuperadminSidebar from '../../layouts/SuperadminSidebar';

export default function SuperadminOrganizerVerificationPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menunggu'); // 'menunggu', 'terverifikasi', 'ditolak'
  const [search, setSearch] = useState('');
  const [ktpModalOpen, setKtpModalOpen] = useState(false);
  const [selectedKtp, setSelectedKtp] = useState(null);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/superadmin/organizers');
      setOrganizers(res.data.data);
    } catch (error) {
      console.error('Error fetching organizers', error);
      alert('Gagal mengambil data organizer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    logout(); navigate('/login');
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/superadmin/organizers/${id}/approve`);
      fetchData();
      alert('Organizer berhasil disetujui');
    } catch (err) {
      alert('Gagal menyetujui organizer: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    if(!confirm('Yakin ingin menolak dan menghapus organizer ini?')) return;
    try {
      await api.post(`/superadmin/organizers/${id}/reject`);
      fetchData();
      alert('Organizer berhasil ditolak/dihapus');
    } catch (err) {
      alert('Gagal menolak organizer: ' + (err.response?.data?.message || err.message));
    }
  };

  const openKtp = (url) => {
    setSelectedKtp(url);
    setKtpModalOpen(true);
  };

  const openSocial = (org) => {
    setSelectedSocial({ instagram: org.instagram, tiktok: org.tiktok_handle });
    setSocialModalOpen(true);
  };

  const filteredOrganizers = organizers.filter(org => {
    const matchesSearch = (org.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (org.organization_name || '').toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'menunggu') return !org.is_verified_organizer && matchesSearch;
    if (activeTab === 'terverifikasi') return org.is_verified_organizer && matchesSearch;
    if (activeTab === 'ditolak') return false; // Rejected are deleted in current backend logic
    return false;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: '40px' }}>progress_activity</span>
    </div>
  );

  return (
    <div className="bg-background text-on-surface flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Navigation Shell */}
      <SuperadminSidebar />

      {/* Main Content Area */}
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* Header / Top Bar */}
        <header className="flex justify-between items-center h-16 px-6 bg-surface border-b border-outline-variant sticky top-0 z-40">
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md text-primary font-bold">Organizer</h1>
          </div>
          <div className="flex items-center gap-4 text-secondary">
            <span className="text-label-md font-medium"><span className="material-symbols-outlined text-[16px] mr-1 align-text-bottom">update</span>Terakhir diperbarui: Just now</span>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="p-6 flex-1">
          <div className="max-w-[1200px] mx-auto">
            {/* Page Identity & Header */}
            <div className="mb-8">
              <h2 className="font-headline-xl text-headline-xl text-on-surface">Verifikasi Organizer</h2>
              <p className="font-body-lg text-body-lg text-secondary">Kelola dan verifikasi penyelenggara platform untuk menjaga keamanan ekosistem.</p>
            </div>

            {/* Dashboard Controls */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl mb-6 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-outline-variant md:border-none">
                  <button onClick={() => setActiveTab('menunggu')} className={`font-label-md text-label-md py-3 font-semibold border-b-2 ${activeTab === 'menunggu' ? 'border-[#F04E37] text-primary' : 'border-transparent text-secondary hover:text-on-surface'}`}>
                    Menunggu Verifikasi
                  </button>
                  <button onClick={() => setActiveTab('terverifikasi')} className={`font-label-md text-label-md py-3 font-semibold border-b-2 ${activeTab === 'terverifikasi' ? 'border-[#F04E37] text-primary' : 'border-transparent text-secondary hover:text-on-surface'}`}>
                    Terverifikasi
                  </button>
                  <button onClick={() => setActiveTab('ditolak')} className={`font-label-md text-label-md py-3 font-semibold border-b-2 ${activeTab === 'ditolak' ? 'border-[#F04E37] text-primary' : 'border-transparent text-secondary hover:text-on-surface'}`}>
                    Ditolak
                  </button>
                </div>
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
                  <input 
                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-[10px] focus:ring-1 focus:ring-primary text-body-md font-body-md placeholder:text-secondary outline-none" 
                    placeholder="Cari nama atau organisasi..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text" 
                  />
                </div>
              </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                {filteredOrganizers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-primary-fixed rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[48px] opacity-40">how_to_reg</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[18px] text-green-600 font-bold">check_circle</span>
                      </div>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary font-medium mb-2 text-center">
                      Tidak ada organizer di kategori ini
                    </h3>
                    <p className="font-body-md text-body-md text-secondary text-center max-w-sm">
                      {activeTab === 'menunggu' && 'Semua pengajuan baru akan muncul di sini untuk Anda tinjau.'}
                      {activeTab === 'terverifikasi' && 'Belum ada organizer yang telah terverifikasi.'}
                      {activeTab === 'ditolak' && 'Tidak ada data organizer yang ditolak.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Nama & Organizer</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Kontak</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Media Sosial</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Dokumen</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Tgl Daftar</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredOrganizers.map(org => (
                        <tr key={org.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                                <img alt="User Avatar" className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${org.full_name}&background=random`} />
                              </div>
                              <div>
                                <p className="font-body-md text-body-md font-semibold text-on-surface">{org.full_name}</p>
                                <p className="font-label-sm text-label-sm text-secondary">{org.organization_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="font-body-md text-body-md text-on-surface">{org.email}</p>
                              <p className="font-label-sm text-label-sm text-secondary">{org.phone || '-'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {org.instagram && (
                                <button onClick={() => openSocial(org)} className="hover:bg-primary-fixed p-1.5 rounded-full transition-colors group bg-surface-container-low border border-outline-variant" title="Lihat Media Sosial">
                                  <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary">alternate_email</span>
                                </button>
                              )}
                              {org.tiktok_handle && (
                                <button onClick={() => openSocial(org)} className="hover:bg-primary-fixed p-1.5 rounded-full transition-colors group bg-surface-container-low border border-outline-variant" title="Lihat Media Sosial">
                                  <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary">movie</span>
                                </button>
                              )}
                              {!org.instagram && !org.tiktok_handle && <span className="text-secondary text-sm">-</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {org.ktp_document_url ? (
                              <button onClick={() => openKtp(org.ktp_document_url)} className="hover:bg-primary-fixed p-1.5 rounded-full transition-colors group bg-surface-container-low border border-outline-variant flex items-center justify-center" title="Lihat KTP">
                                <span className="material-symbols-outlined text-[18px] text-secondary group-hover:text-primary">badge</span>
                              </button>
                            ) : (
                              <span className="text-secondary text-sm font-label-md">Tanpa Dokumen</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-body-md text-body-md text-on-surface">
                            {new Date(org.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            {org.is_verified_organizer ? (
                              <span className="px-3 py-1 rounded-[10px] bg-green-100 text-green-800 font-label-sm text-label-sm inline-flex items-center gap-1 border border-green-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Terverifikasi
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-[10px] bg-orange-100 text-orange-800 font-label-sm text-label-sm inline-flex items-center gap-1 border border-orange-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Menunggu
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!org.is_verified_organizer ? (
                                <>
                                  <button onClick={() => handleApprove(org.id)} className="bg-primary text-white px-4 py-1.5 rounded-full font-label-md text-label-md hover:brightness-110 shadow-sm active:scale-95 transition-all">Verifikasi</button>
                                  <button onClick={() => handleReject(org.id)} className="text-error border border-error px-4 py-1.5 rounded-full font-label-md text-label-md hover:bg-error-container transition-colors">Tolak</button>
                                </>
                              ) : (
                                <button onClick={() => handleReject(org.id)} className="text-error border border-error/30 bg-transparent px-4 py-1.5 rounded-full font-label-md text-label-md hover:bg-error-container transition-colors">Cabut Akses</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              {/* Pagination Info */}
              {filteredOrganizers.length > 0 && (
                <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
                  <p className="font-label-sm text-label-sm text-secondary">Menampilkan {filteredOrganizers.length} organizer</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal KTP */}
      {ktpModalOpen && selectedKtp && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full p-6 relative shadow-xl flex flex-col max-h-[90vh]">
            <button className="absolute top-4 right-4 text-secondary hover:text-on-surface" onClick={() => setKtpModalOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md mb-6 font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              Verifikasi Dokumen KTP
            </h3>
            
            <div className="flex-1 bg-surface-container-low rounded-xl overflow-hidden mb-6 border border-outline-variant flex justify-center items-center p-2 min-h-[300px]">
              {selectedKtp.toLowerCase().endsWith('.pdf') ? (
                <iframe src={selectedKtp} className="w-full h-[500px] rounded-lg" title="KTP Document PDF" />
              ) : selectedKtp.toLowerCase().endsWith('.zip') || selectedKtp.toLowerCase().endsWith('.rar') ? (
                <div className="flex flex-col items-center text-secondary p-8 text-center">
                  <span className="material-symbols-outlined text-[64px] mb-4 text-primary opacity-60">folder_zip</span>
                  <p className="font-body-lg font-bold text-on-surface">Dokumen berupa arsip ZIP</p>
                  <p className="font-body-md mt-2 max-w-sm">File ZIP tidak dapat ditampilkan langsung di browser. Silakan unduh dokumen untuk melihat isinya.</p>
                </div>
              ) : (
                <img className="max-w-full max-h-[60vh] object-contain rounded-lg" src={selectedKtp} alt="KTP Document" />
              )}
            </div>
            
            <div className="flex justify-between items-center border-t border-outline-variant pt-4 mt-2">
              <a href={selectedKtp} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline font-medium">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Unduh / Buka Dokumen
              </a>
              <button className="px-6 py-2 bg-surface-container text-on-surface rounded-full font-label-md text-label-md hover:bg-surface-container-high transition-colors font-semibold" onClick={() => setKtpModalOpen(false)}>
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Social Media */}
      {socialModalOpen && selectedSocial && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 relative shadow-xl">
            <button className="absolute top-4 right-4 text-secondary hover:text-on-surface" onClick={() => setSocialModalOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md mb-6 font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">public</span>
              Media Sosial
            </h3>
            
            <div className="flex flex-col gap-4 mb-8">
              {/* Instagram */}
              {selectedSocial.instagram ? (
                <div className="flex flex-col p-4 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary transition-colors group">
                  <span className="font-label-md text-secondary uppercase mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">alternate_email</span> Instagram</span>
                  <a href={`https://instagram.com/${selectedSocial.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="font-body-lg text-primary font-medium hover:underline flex items-center justify-between">
                    <span>{selectedSocial.instagram.startsWith('@') ? selectedSocial.instagram : `@${selectedSocial.instagram}`}</span>
                    <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col p-4 bg-surface-container-low rounded-xl border border-outline-variant opacity-60">
                  <span className="font-label-md text-secondary uppercase mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">alternate_email</span> Instagram</span>
                  <span className="font-body-md text-secondary italic">Tidak ditambahkan</span>
                </div>
              )}

              {/* TikTok */}
              {selectedSocial.tiktok ? (
                <div className="flex flex-col p-4 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary transition-colors group">
                  <span className="font-label-md text-secondary uppercase mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">movie</span> TikTok</span>
                  <a href={`https://tiktok.com/@${selectedSocial.tiktok.replace('@', '')}`} target="_blank" rel="noreferrer" className="font-body-lg text-primary font-medium hover:underline flex items-center justify-between">
                    <span>{selectedSocial.tiktok.startsWith('@') ? selectedSocial.tiktok : `@${selectedSocial.tiktok}`}</span>
                    <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col p-4 bg-surface-container-low rounded-xl border border-outline-variant opacity-60">
                  <span className="font-label-md text-secondary uppercase mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">movie</span> TikTok</span>
                  <span className="font-body-md text-secondary italic">Tidak ditambahkan</span>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-outline-variant pt-4 mt-2">
              <button className="px-6 py-2 bg-surface-container text-on-surface rounded-full font-label-md text-label-md hover:bg-surface-container-high transition-colors font-semibold" onClick={() => setSocialModalOpen(false)}>
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
