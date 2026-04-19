import axios from 'axios';

// ── API Base URL ────────────────────────────────────────────
// .env.production has: VITE_API_URL=https://portfulio-server.onrender.com/api
// This gets baked into the build at compile time by Vite
const PRODUCTION_API = 'https://portfulio-server.onrender.com/api';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API : '/api');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
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
