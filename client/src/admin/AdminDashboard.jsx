import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiBook, FiStar, FiMail, FiLogOut, FiMenu, FiX,
  FiBriefcase, FiExternalLink, FiSun, FiMoon
} from 'react-icons/fi';
import { MdOutlineDashboard } from 'react-icons/md';
import toast from 'react-hot-toast';
import AdminOverview from './components/AdminOverview';
import ManageProjects from './components/ManageProjects';
import ManageEducation from './components/ManageEducation';
import ManageReviews from './components/ManageReviews';
import ManageMessages from './components/ManageMessages';

const navItems = [
  { path: '/admin',          label: 'Overview',  icon: MdOutlineDashboard, exact: true },
  { path: '/admin/projects', label: 'Projects',  icon: FiBriefcase },
  { path: '/admin/education',label: 'Education', icon: FiBook },
  { path: '/admin/reviews',  label: 'Reviews',   icon: FiStar },
  { path: '/admin/messages', label: 'Messages',  icon: FiMail },
];

/* ── Check if large screen ── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isDesktop;
}

function NavItem({ path, label, icon: Icon, exact, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === path;
  return (
    <Link to={path} onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 relative"
      style={isActive
        ? { background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }
        : { border: '1px solid transparent', color: 'rgba(255,255,255,0.5)' }}>
      {isActive && (
        <motion.div layoutId="activeBar"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
          style={{ background: '#00d4ff' }} />
      )}
      <Icon size={17} />
      {label}
    </Link>
  );
}

function Sidebar({ sideOpen, setSideOpen, isDesktop }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success('Logged out.'); navigate('/admin/login'); };

  return (
    <>
      {/* Overlay — mobile only */}
      <AnimatePresence>
        {sideOpen && !isDesktop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSideOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30" />
        )}
      </AnimatePresence>

      {/* Sidebar — always visible on desktop, slide on mobile */}
      <aside
        className="fixed top-0 left-0 h-full w-64 z-40 flex flex-col"
        style={{
          background: '#0c0c1d',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          transform: (isDesktop || sideOpen) ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          // On desktop, make it part of normal flow
          position: isDesktop ? 'sticky' : 'fixed',
          top: 0,
          height: isDesktop ? '100vh' : '100%',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-black text-base"
            style={{ background: '#00d4ff', boxShadow: '0 0 14px rgba(0,212,255,0.4)' }}>G</div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">GovindPortfolio</p>
            <p className="font-body text-xs truncate max-w-[130px]" style={{ color: 'rgba(0,212,255,0.6)' }}>{admin?.email}</p>
          </div>
          {/* Close on mobile */}
          {!isDesktop && (
            <button onClick={() => setSideOpen(false)} className="ml-auto text-white/30 hover:text-white">
              <FiX size={18} />
            </button>
          )}
        </div>

        <div className="px-5 pt-6 pb-2">
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>Navigation</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavItem key={item.path} {...item} onClick={() => !isDesktop && setSideOpen(false)} />
          ))}
        </nav>

        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            <FiExternalLink size={15} /> View Portfolio
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm w-full text-left transition-all hover:bg-red-500/10"
            style={{ color: 'rgba(239,68,68,0.7)' }}>
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminDashboard() {
  const [sideOpen, setSideOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const currentNav = navItems.find(n => location.pathname === n.path);
  const pageTitle = currentNav?.label || 'Dashboard';
  const PageIcon = currentNav?.icon || MdOutlineDashboard;

  return (
    <div className="min-h-screen flex" style={{ background: isDark ? '#0a0a14' : '#f1f5f9' }}>
      <Sidebar sideOpen={sideOpen} setSideOpen={setSideOpen} isDesktop={isDesktop} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden"
        style={{ marginLeft: isDesktop ? '0' : '0' }}>

        {/* Top bar */}
        <header className="sticky top-0 z-20 px-6 py-4 flex items-center gap-4"
          style={{
            background: isDark ? 'rgba(10,10,20,0.9)' : 'rgba(241,245,249,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
          }}>
          {/* Hamburger — mobile only */}
          {!isDesktop && (
            <button onClick={() => setSideOpen(!sideOpen)} className="p-2 rounded-lg transition-colors"
              style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#475569' }}>
              <FiMenu size={20} />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <PageIcon size={15} style={{ color: '#00d4ff' }} />
            </div>
            <div>
              <h1 className="font-display font-bold text-base leading-tight" style={{ color: isDark ? '#fff' : '#0f172a' }}>{pageTitle}</h1>
              <p className="font-body text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : '#94a3b8' }}>Portfolio Admin</p>
            </div>
          </div>

          {/* Theme toggle in admin header */}
          <motion.button onClick={toggleTheme}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}>
            <AnimatePresence mode="wait">
              {isDark
                ? <motion.div key="s" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }}><FiSun size={15} style={{ color: '#f59e0b' }} /></motion.div>
                : <motion.div key="m" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }}><FiMoon size={15} style={{ color: '#6366f1' }} /></motion.div>}
            </AnimatePresence>
          </motion.button>
        </header>

        <main className="flex-1 p-6 overflow-auto"
          style={{ background: isDark ? '#0a0a14' : '#f1f5f9' }}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="projects"  element={<ManageProjects />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="reviews"   element={<ManageReviews />} />
            <Route path="messages"  element={<ManageMessages />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
