import axios from 'axios';

// Auto-detect API base URL
function getApiBase() {
  // If VITE_API_URL env var is set (for separate deployments)
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // In production: same origin, use /api
  if (import.meta.env.PROD) return '/api';
  
  // In development: proxy to localhost:5000
  return '/api';
}

const api = axios.create({
  baseURL: getApiBase(),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_admin_token');
      localStorage.removeItem('portfolio_admin_email');
      if (window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
