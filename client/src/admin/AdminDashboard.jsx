import { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { RiCodeSSlashLine } from 'react-icons/ri';
import {
  FiGrid, FiBook, FiStar, FiMail, FiLogOut,
  FiMenu, FiX, FiBriefcase, FiHome, FiExternalLink
} from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';
import toast from 'react-hot-toast';
import AdminOverview from './components/AdminOverview';
import ManageProjects from './components/ManageProjects';
import ManageEducation from './components/ManageEducation';
import ManageReviews from './components/ManageReviews';
import ManageMessages from './components/ManageMessages';

const navItems = [
  { path: '/admin', label: 'Overview', icon: MdOutlineDashboard, exact: true },
  { path: '/admin/projects', label: 'Projects', icon: FiBriefcase },
  { path: '/admin/education', label: 'Education', icon: FiBook },
  { path: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { path: '/admin/messages', label: 'Messages', icon: FiMail },
];

function NavItem({ path, label, icon: Icon, exact, onClick }) {
  const location = useLocation();
  const isActive = exact ? location.pathname === path : location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 relative group"
      style={isActive ? {
        background: 'rgba(0,212,255,0.08)',
        border: '1px solid rgba(0,212,255,0.18)',
        color: '#00d4ff',
      } : {
        border: '1px solid transparent',
        color: 'rgba(255,255,255,0.4)',
      }}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
          style={{ background: '#00d4ff' }}
        />
      )}
      <Icon size={17} />
      {label}
    </Link>
  );
}

function Sidebar({ sideOpen, setSideOpen }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  return (
    <>
      <AnimatePresence>
        {sideOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSideOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sideOpen ? 0 : '-100%' }}
        className="fixed top-0 left-0 h-full w-64 z-40 flex flex-col lg:translate-x-0 lg:static lg:h-screen"
        style={{ background: '#0c0c1d', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <RiCodeSSlashLine style={{ color: '#00d4ff', fontSize: '18px' }} />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">Admin Panel</p>
            <p className="font-body text-xs truncate max-w-[130px]" style={{ color: 'rgba(0,212,255,0.5)' }}>{admin?.email}</p>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-6 pb-2">
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>Navigation</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavItem key={item.path} {...item} onClick={() => setSideOpen(false)} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            <FiExternalLink size={15} />
            View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 hover:bg-red-500/8 w-full text-left"
            style={{ color: 'rgba(239,68,68,0.6)' }}
          >
            <FiLogOut size={15} />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default function AdminDashboard() {
  const [sideOpen, setSideOpen] = useState(false);
  const location = useLocation();

  const currentNav = navItems.find(n => n.exact ? location.pathname === n.path : location.pathname === n.path);
  const pageTitle = currentNav?.label || 'Dashboard';
  const PageIcon = currentNav?.icon || MdOutlineDashboard;

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a14' }}>
      <Sidebar sideOpen={sideOpen} setSideOpen={setSideOpen} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4"
          style={{ background: 'rgba(10,10,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <button
            onClick={() => setSideOpen(!sideOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {sideOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <PageIcon size={15} style={{ color: '#00d4ff' }} />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-base leading-tight">{pageTitle}</h1>
              <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Portfolio Admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="messages" element={<ManageMessages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
