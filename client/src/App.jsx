import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

import Home from './pages/Home';
import About from './pages/About';
import Education from './pages/Education';
import Projects from './pages/Projects';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a14' }}>
        <Spinner />
      </div>
    );
  }
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const PublicLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a14' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

const AppRoutes = () => {
  const { admin } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/education" element={<PublicLayout><Education /></PublicLayout>} />
      <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
      <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/admin/login" element={admin ? <Navigate to="/admin" replace /> : <AdminLogin />} />
      <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161626',
              color: '#fff',
              border: '1px solid rgba(0,212,255,0.2)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00d4ff', secondary: '#000' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#000' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
