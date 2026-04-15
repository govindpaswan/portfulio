import axios from 'axios';

// ─────────────────────────────────────────────────────────────
// IMPORTANT FOR RENDER DEPLOYMENT:
// If frontend (Static Site) and backend (Web Service) are SEPARATE on Render:
//   → Set environment variable VITE_API_URL in Render Static Site settings
//   → Value: https://your-backend-service.onrender.com/api
//
// If deployed TOGETHER (server serves frontend):
//   → Leave as is — relative /api works automatically
// ─────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  withCredentials: false,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_admin_token');
      localStorage.removeItem('portfolio_admin_email');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
