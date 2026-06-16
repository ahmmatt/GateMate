import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import useAuthStore from '../../store/useAuthStore';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Fetch user data based on token
      const fetchUser = async () => {
        try {
          // Set temporary auth to make the /auth/me call
          localStorage.setItem('auth_token', token);
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            const user = response.data.data;
            setAuth(user, token);
            
            if (user.role === 'user') navigate('/discover');
            else if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'tenant') navigate('/tenant/dashboard');
            else if (user.role === 'superadmin') navigate('/superadmin/dashboard');
            else navigate('/');
          }
        } catch (err) {
          console.error('Failed to fetch user:', err);
          navigate('/login?error=Gagal mengambil data akun');
        }
      };
      
      fetchUser();
    } else {
      navigate('/login?error=Token tidak ditemukan');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-body-md text-secondary mt-4">Sedang menyelesaikan login Anda...</p>
      </div>
    </div>
  );
}
