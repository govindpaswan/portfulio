import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { RiCodeSSlashLine } from 'react-icons/ri';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Education', path: '/education' },
  { name: 'Projects', path: '/projects' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const navBg = scrolled
    ? isDark
      ? 'rgba(10,10,20,0.92)'
      : 'rgba(240,243,255,0.95)'
    : 'transparent';

  const borderColor = scrolled
    ? isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
    : 'transparent';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: navBg,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <RiCodeSSlashLine className="text-primary text-lg" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight" style={{ color: isDark ? '#fff' : '#0d0d1a' }}>
                Portfolio<span className="text-primary">.</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200"
                    style={{ color: active ? '#00d4ff' : isDark ? 'rgba(255,255,255,0.6)' : 'rgba(13,13,26,0.6)' }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}

              {/* Admin link */}
              <Link
                to="/admin"
                className="ml-2 px-4 py-1.5 text-xs font-display font-semibold rounded-lg transition-all duration-200"
                style={{
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(13,13,26,0.4)',
                }}
              >
                Admin
              </Link>

              {/* ── Theme Toggle ── */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="ml-2 w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
                aria-label="Toggle theme"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="sun"
                      initial={{ y: 12, opacity: 0, rotate: -30 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -12, opacity: 0, rotate: 30 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiSun size={16} style={{ color: '#f59e0b' }} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon"
                      initial={{ y: 12, opacity: 0, rotate: 30 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      exit={{ y: -12, opacity: 0, rotate: -30 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMoon size={16} style={{ color: '#6366f1' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile — theme toggle + menu button */}
            <div className="md:hidden flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <AnimatePresence mode="wait">
                  {isDark
                    ? <motion.div key="sun2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FiSun size={18} style={{ color: '#f59e0b' }} /></motion.div>
                    : <motion.div key="moon2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FiMoon size={18} style={{ color: '#6366f1' }} /></motion.div>
                  }
                </AnimatePresence>
              </motion.button>

              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(13,13,26,0.6)' }}
              >
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 40,
              background: isDark ? 'rgba(10,10,20,0.97)' : 'rgba(240,243,255,0.98)',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(20px)',
            }}
            className="md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors"
                    style={{
                      color: active ? '#00d4ff' : isDark ? 'rgba(255,255,255,0.6)' : 'rgba(13,13,26,0.6)',
                      background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                      border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="px-4 py-3 rounded-xl font-body text-sm font-medium mt-2 transition-colors"
                style={{
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(13,13,26,0.4)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
