import axios from 'axios';

// Konfigurasi Axios instance untuk berkomunikasi dengan Laravel Backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Untuk Sanctum stateful request (opsional jika menggunakan cookie-based, 
  // tapi kita pakai Bearer token, jadi withCredentials false lebih aman untuk beda port
  // kecuali butuh CSRF cookie Laravel).
  withCredentials: true,
});

// Interceptor Request: Sisipkan token dari localStorage (jika ada) ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor Response: Tangani error global (misal: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto-logout jika token tidak valid/expired
      localStorage.removeItem('auth_token');
      // Opsional: redirect ke /login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
