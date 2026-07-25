import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) navigate(`/discover?search=${encodeURIComponent(q)}`);
    else navigate('/discover');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-white/70 backdrop-blur-md border-border-light/50 shadow-sm' 
        : 'bg-white border-border-light'
    }`}>
      <div className="flex justify-between items-center px-container-padding h-16 max-w-[1280px] mx-auto gap-4 md:gap-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0">
          <span className="font-headline-md text-headline-md font-bold text-[#B22110]">SecureGate</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:flex">
          <form onSubmit={handleSearch} className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              name="search"
              className="w-full bg-[#F5F5F7] border border-border-light rounded-[10px] pl-10 pr-4 py-2 text-body-md focus:border-[#B22110] focus:ring-0 transition-all outline-none"
              placeholder="Cari event..."
              type="text"
            />
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <Link 
              to="/discover" 
              className={`font-bold transition-colors py-5 ${
                location.pathname === '/discover' || location.pathname.startsWith('/events') || location.pathname === '/'
                  ? 'text-[#B22110] border-b-2 border-[#B22110]' 
                  : 'text-on-surface-variant hover:text-[#B22110]'
              }`}
            >
              Explore
            </Link>
            <Link 
              to={user ? "/user/tickets" : "/login"} 
              className={`font-bold transition-colors py-5 ${
                location.pathname.startsWith('/user/ticket') || location.pathname === '/my-tickets'
                  ? 'text-[#B22110] border-b-2 border-[#B22110]' 
                  : 'text-on-surface-variant hover:text-[#B22110]'
              }`}
            >
              My Tickets
            </Link>
            <Link 
              to={user ? "/user/wallet" : "/login"} 
              className={`font-bold transition-colors py-5 ${
                location.pathname.startsWith('/user/wallet') || location.pathname === '/wallet'
                  ? 'text-[#B22110] border-b-2 border-[#B22110]' 
                  : 'text-on-surface-variant hover:text-[#B22110]'
              }`}
            >
              Wallet
            </Link>
          </nav>

          {/* User / Auth CTA */}
          <div className="flex items-center ml-2 border-l border-border-light pl-6">
            {user ? (
              <div className="relative group cursor-pointer flex items-center gap-2">
                <button 
                  onClick={() => navigate('/user/profile')}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-sm cursor-pointer hover:opacity-90 hover:scale-105 transition-all overflow-hidden border-2 border-transparent hover:border-gray-400"
                  title="Edit Profil"
                >
                  {(() => {
                    let raw = user.profile_picture_url || user.profile_picture;
                    let avatar = null;
                    if (raw) {
                      if (raw.includes('Media/uploads/http')) {
                        avatar = raw.substring(raw.lastIndexOf('http'));
                      } else if (raw.startsWith('http')) {
                        avatar = raw;
                      } else {
                        const baseUrl = (import.meta.env && import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:8000/api';
                        avatar = `${baseUrl.replace('/api', '')}/Media/uploads/${raw}`;
                      }
                    }
                    if (avatar) return <img src={avatar} alt="Profile" className="w-full h-full object-cover" />;
                    return user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                  })()}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-[#B22110] text-white px-[22px] py-[10px] rounded-[22px] font-medium hover:bg-[#921a0d] transition-all active:scale-95"
              >
                Masuk
              </button>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button className="text-[#B22110] p-2" onClick={() => navigate('/discover')}>
            <span className="material-symbols-outlined">search</span>
          </button>
          <button
            className="p-2 text-on-surface-variant"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden py-3 px-6 space-y-1 bg-white border-t border-border-light shadow-md">
          <Link to="/discover" className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname === '/discover' || location.pathname === '/' || location.pathname.startsWith('/events') ? 'text-[#B22110] bg-[#B22110]/5 font-bold' : 'text-on-surface-variant hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Explore</Link>
          <Link to={user ? "/user/tickets" : "/login"} className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/user/ticket') ? 'text-[#B22110] bg-[#B22110]/5 font-bold' : 'text-on-surface-variant hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>My Tickets</Link>
          <Link to={user ? "/user/wallet" : "/login"} className={`block px-3 py-2.5 text-sm font-medium rounded-xl ${location.pathname.startsWith('/user/wallet') ? 'text-[#B22110] bg-[#B22110]/5 font-bold' : 'text-on-surface-variant hover:bg-gray-50'}`} onClick={() => setIsOpen(false)}>Wallet</Link>
          
          {!user ? (
            <div className="pt-3 flex flex-col gap-2 border-t border-border-light mt-2">
              <Link 
                to="/login" 
                className="block px-3 py-2.5 text-sm text-center font-bold rounded-full bg-[#B22110] text-white shadow-sm" 
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2.5 text-sm text-center font-bold rounded-full border border-[#B22110] text-[#B22110]" 
                onClick={() => setIsOpen(false)}
              >
                Daftar
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-border-light mt-2">
              <button onClick={() => { setIsOpen(false); navigate('/user/profile'); }} className="block w-full text-left px-3 py-2.5 text-sm text-on-surface hover:bg-gray-50 rounded-xl font-medium">Edit Profil</button>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-[#B22110] hover:bg-gray-50 rounded-xl font-medium">Keluar</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
