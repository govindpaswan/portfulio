import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('portfolio_admin_token');
    const email = localStorage.getItem('portfolio_admin_email');
    if (token && email) {
      api.get('/auth/verify')
        .then(() => setAdmin({ email, token }))
        .catch(() => {
          localStorage.removeItem('portfolio_admin_token');
          localStorage.removeItem('portfolio_admin_email');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token } = res.data;
    localStorage.setItem('portfolio_admin_token', token);
    localStorage.setItem('portfolio_admin_email', email);
    setAdmin({ email, token });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token');
    localStorage.removeItem('portfolio_admin_email');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
