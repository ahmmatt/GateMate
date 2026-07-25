import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AttendeeList() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filters = ['Semua', 'Teknologi', 'Kreatif', 'Keuangan', 'Hukum'];

  const attendees = [
    {
      name: 'Adinda Sari',
      role: 'Product Designer',
      industry: 'UI/UX Design',
      bio: 'Membangun pengalaman digital yang mengutamakan privasi pengguna.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6NtDHlz31zu9p6FlWah7-m2PQ-2R3ENSSWWwY_JUxq3TJ1_FNX3EgyhqvauvVEZDXatyVbNh3OCoiH-59hnT_6EhmYYRFlarI_ik292ukxJHK_s0LwU4LV3djsEXQiLWLQeG7aYmBaxoPRIEFZkRbkOCplXPiQ5TCUpWT5S8jtDsKftvO33qy6Y4hYfwHemGULD4-wZMZI5fK4L-dxK3KKDQlrZN_gfryPzr6OqNGyUCQ-ONA6MySWtcSB-mo_uXteTQXPDLNqtQ'
    },
    {
      name: 'Budi Pratama',
      role: 'CTO @ NexaGate',
      industry: 'Cybersecurity',
      bio: 'Berfokus pada pengembangan sistem tiket digital berbasis enkripsi.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBODZfKpgZKbnIRRdJtIWGh2zJlKDqlOkyKpUhqWlLrPH4WkR_0gwNaAyjqsUzVgek-mM0mBajjDhcpKqJab5CaNQiZ2B8taUpGIEBYSrHD_ocZJi5KvqKWPCnRPLY4EVp-mcLrVk0GHm2Wpo04rBAbS0VJ83Bl-LJu-DmiPW8z-vNXRBBxDKF0hnuoNeAfXPqVqsRXhoY44PaKy09DV-OIZDElFusDl6Zy8oLBxuYjCdmnP6eWQvqL2wm0Gi6wf3PP6A2fY7U_oo0'
    },
    {
      name: 'Clara Wijaya',
      role: 'Legal Counsel',
      industry: 'Compliance',
      bio: 'Spesialis dalam regulasi perlindungan data dan privasi digital.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdA0xmWh_mOuKeC88T454OfVgr8SkB9dX41aOPz09-85W-SnhQFJsBOREm4RweD82ZJ-X2X8FEovayqx4zfuYZ06koU1UvvrDkyn80F032BGUU7bbsWf8gyfTXDISlxXzcbjRWYRow8NncmEGnAlqZQSwgjQNr-u81QC_4CcmqlEHiu55Vc6m8zyaIZukxrucOoyp0al_JuItNg1qgH-7vqtmYww5QEXTYsUAwjqyeyzaENGCRpQ7_7zL4rk5z1dRcpkjeiGHp0uU'
    },
    {
      name: 'Dimas Anggara',
      role: 'Venture Architect',
      industry: 'Fintech',
      bio: 'Menciptakan solusi masa depan untuk ekosistem pembayaran aman.',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1o6Kz1Zj42pXgDedXXbPyVgAb6tbU-0iIk5qnAOb8sXrsJMvAHH84MPu936HnCyoVJ48Z3u-pS2UCU_eaLVqSFH_OFfoMpXpPEhfzbTPTGxoTPs--_X4OUbhVq_5gJwqS2IharLNqRmG8t4GMABBBf4ohW9nAsylIKLfwSr8ruMyIYsTT0NgHffcd8cnrCc2XVoTanYq44xc_dWf5Nsp2Ms09oQpbPmEJE8F_kezlB13-KL9G-_PafyrjktXwBOPYiDUe2r8CSWY'
    }
  ];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .attendee-card {
          transition: transform 0.2s ease-in-out;
        }
        .attendee-card:hover {
          transform: translateY(-2px);
        }
      `}} />
      
      {/* TopNavBar Navigation Shell */}
      <nav className="w-full top-0 sticky bg-surface border-b border-outline-variant z-50">
        <div className="flex justify-between items-center h-16 px-container-padding max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary cursor-pointer active:opacity-80" onClick={() => navigate('/')}>
            SecureGate
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <span className="text-secondary font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80">Explore</span>
            <span className="font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80 text-primary font-bold border-b-2 border-primary pb-1" onClick={() => navigate('/user/tickets')}>My Tickets</span>
            <span className="font-body-md text-body-md transition-colors cursor-pointer active:opacity-80 text-secondary">Wallet</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-secondary cursor-pointer hover:text-primary">notifications</span>
            <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer" onClick={() => navigate('/user/profile')}>
              <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApI86Eazw0-BsDwMowdrvP4LZhKzwjXK2oHrgGdjyqgtWRAr2_ghejs-Df9XOvJO-yOsGZYWTE93_WJXGvIvgM5akeskHXsTy4IZOSeQml_UfwwYesyrY_rhQQ5FQTfWmpytWszg9E1QwcJVv71T1JQ9n9E2s5bJw84HUa6Ph8yCDA6aEXFg0JjTZnl2AazjvEoYw3o1Q_ao8zbOy4KZ8e3r4ho2ySGjVgB68gjMJC6u5M50Py57KsjsAU87di0ka6fppu7J5gHHk" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-container-padding py-10">
        {/* Search and Header Section */}
        <header className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Daftar Peserta</h1>
          <p className="text-on-surface-variant font-body-md mb-6">Temukan dan terhubung dengan profesional lainnya di Networking Hub.</p>
          <div className={`relative max-w-2xl transition-transform ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-[#EBEBEB] rounded-[10px] focus:ring-0 focus:border-primary transition-all text-body-md outline-none" 
              placeholder="Cari berdasarkan nama, posisi, atau industri..." 
              type="text" 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </header>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <span 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-label-md rounded-full cursor-pointer transition-colors ${
                activeFilter === filter 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              {filter}
            </span>
          ))}
        </div>

        {/* Attendee List Grid */}
        <div className="grid grid-cols-1 gap-4">
          {attendees.map((attendee, idx) => (
            <div key={idx} className="attendee-card bg-surface-container-lowest border border-[#EBEBEB] rounded-[14px] p-card-padding flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-16 h-16 rounded-[14px] overflow-hidden flex-shrink-0">
                  <img alt={attendee.name} className="w-full h-full object-cover" src={attendee.img} />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">{attendee.name}</h3>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-primary font-medium text-caption">{attendee.role}</span>
                    <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span className="text-secondary text-caption">{attendee.industry}</span>
                  </div>
                  <p className="text-on-surface-variant text-body-md truncate">{attendee.bio}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/user/chat')}
                className="flex-shrink-0 sm:ml-4 px-6 py-2.5 border border-primary text-primary rounded-[22px] font-label-md hover:bg-primary-container hover:text-on-primary-container transition-all active:opacity-80 w-full sm:w-auto"
              >
                Say Hello
              </button>
            </div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="mt-10 flex justify-center">
          <button className="px-8 py-3 bg-primary text-on-primary rounded-full font-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm">
            Muat Lebih Banyak
          </button>
        </div>
      </main>

      {/* Footer Shell */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-container-padding max-w-[1280px] mx-auto gap-6">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="font-headline-sm text-headline-sm font-bold text-primary mb-2">SecureGate</div>
            <p className="font-caption text-caption text-on-surface-variant max-w-xs mx-auto md:mx-0">Solusi manajemen akses digital terintegrasi dengan standar keamanan tertinggi.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center gap-6">
              <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
              <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
              <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Security Standards</span>
              <span className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Contact Us</span>
            </div>
            <p className="font-caption text-caption text-on-surface-variant">© 2024 SecureGate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
