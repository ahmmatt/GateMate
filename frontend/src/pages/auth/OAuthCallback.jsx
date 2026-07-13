import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token globally
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user profile
      api.get('/auth/me')
        .then((res) => {
          localStorage.setItem('user', JSON.stringify(res.data.data || res.data));
          // Redirect to user dashboard or home
          window.location.href = '/user/tickets';
        })
        .catch((err) => {
          console.error('Failed to fetch user', err);
          setError('Gagal mengambil data profil pengguna.');
          setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      setError('Token otentikasi tidak ditemukan.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-surface-container-lowest">
      <div className="text-center">
        {error ? (
          <div className="text-error">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-body-lg">{error}</p>
            <p className="font-caption text-secondary mt-2">Mengarahkan kembali ke halaman login...</p>
          </div>
        ) : (
          <div className="text-primary flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 animate-spin">refresh</span>
            <p className="font-body-lg">Sedang memproses otentikasi...</p>
          </div>
        )}
      </div>
    </div>
  );
}
