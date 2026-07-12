/**
 * Stub useAuthStore - reads user from localStorage (same pattern
 * as the existing Navbar / Layout components in this project).
 * Replace with a real Zustand store when backend is ready.
 */
import { useNavigate } from 'react-router-dom';

let _user = null;
try {
  _user = JSON.parse(localStorage.getItem('user') || 'null');
} catch (_) {}

const useAuthStore = () => {
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return {
    user: _user,
    token: localStorage.getItem('token') || null,
    logout,
    isAuthenticated: !!_user,
  };
};

export default useAuthStore;
