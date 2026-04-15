import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { name: 'Home', path: '/' }, { name: 'About', path: '/about' },
  { name: 'Education', path: '/education' }, { name: 'Projects', path: '/projects' },
  { name: 'Reviews', path: '/reviews' }, { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme, colors } = useTheme();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? colors.navBg : 'transparent',
          borderBottom: scrolled ? `1px solid ${colors.navBorder}` : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? (isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)') : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -5 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-black text-base"
                style={{ background: '#00d4ff', boxShadow: '0 0 18px rgba(0,212,255,0.45)' }}
              >
                G
              </motion.div>
              <span className="font-display font-bold text-lg tracking-tight">
                <span style={{ color: colors.text }}>Govind</span>
                <span style={{ color: '#00d4ff' }}>Portfolio</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path}
                    className="relative px-3.5 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200"
                    style={{ color: active ? '#00d4ff' : colors.textMuted }}
                  >
                    {active && (
                      <motion.span layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.22)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}

              <Link to="/admin"
                className="ml-2 px-3.5 py-1.5 text-xs font-display font-semibold rounded-lg transition-all"
                style={{ border: `1px solid ${colors.border}`, color: colors.textDim }}
              >Admin</Link>

              {/* Theme toggle */}
              <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                className="ml-2 w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: colors.surfaceHover, border: `1px solid ${colors.border}` }}
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                <AnimatePresence mode="wait">
                  {isDark
                    ? <motion.div key="s" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.18 }}>
                        <FiSun size={16} style={{ color: '#f59e0b' }} />
                      </motion.div>
                    : <motion.div key="m" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.18 }}>
                        <FiMoon size={16} style={{ color: '#6366f1' }} />
                      </motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
              <motion.button onClick={toggleTheme} whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg"
                style={{ background: colors.surfaceHover, border: `1px solid ${colors.border}` }}>
                {isDark ? <FiSun size={18} style={{ color: '#f59e0b' }} /> : <FiMoon size={18} style={{ color: '#6366f1' }} />}
              </motion.button>
              <button onClick={() => setOpen(!open)} className="p-2 rounded-lg transition-colors"
                style={{ color: colors.textMuted }}>
                {open ? <HiX size={22} /> : <HiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 40,
              background: colors.navBg, borderBottom: `1px solid ${colors.navBorder}`, backdropFilter: 'blur(20px)',
            }}
            className="md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link key={link.path} to={link.path}
                    className="px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors"
                    style={{
                      color: active ? '#00d4ff' : colors.textMuted,
                      background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                      border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                    }}
                  >{link.name}</Link>
                );
              })}
              <Link to="/admin"
                className="px-4 py-3 rounded-xl font-body text-sm mt-2"
                style={{ color: colors.textDim, border: `1px solid ${colors.border}` }}>
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
