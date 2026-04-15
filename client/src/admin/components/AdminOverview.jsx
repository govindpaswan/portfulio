import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiBook, FiStar, FiMail, FiArrowRight, FiTrendingUp, FiEye, FiMessageSquare, FiUsers, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminOverview() {
  const { admin } = useAuth();
  const { isDark, colors } = useTheme();
  const [stats, setStats] = useState({ projects: 0, education: 0, reviews: 0, messages: 0, unread: 0, avgRating: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/education'),
      api.get('/reviews'),
      api.get('/contact'),
    ]).then(([p, e, r, c]) => {
      const msgs = Array.isArray(c.data) ? c.data : [];
      const reviews = Array.isArray(r.data) ? r.data : [];
      const projects = Array.isArray(p.data) ? p.data : [];
      const education = Array.isArray(e.data) ? e.data : [];
      const avg = reviews.length ? (reviews.reduce((a, rv) => a + rv.rating, 0) / reviews.length).toFixed(1) : 0;
      setStats({
        projects: projects.length,
        education: education.length,
        reviews: reviews.length,
        messages: msgs.length,
        unread: msgs.filter(m => !m.read).length,
        avgRating: avg,
      });
      setRecentMessages(msgs.slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.projects,
      icon: FiGrid,
      path: '/admin/projects',
      accent: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.18)',
      desc: 'Portfolio items',
    },
    {
      label: 'Education',
      value: stats.education,
      icon: FiBook,
      path: '/admin/education',
      accent: '#a855f7',
      bg: 'rgba(168,85,247,0.08)',
      border: 'rgba(168,85,247,0.18)',
      desc: 'Academic records',
    },
    {
      label: 'Reviews',
      value: stats.reviews,
      icon: FiStar,
      path: '/admin/reviews',
      accent: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.18)',
      desc: stats.avgRating ? `Avg ${stats.avgRating} ★` : 'No reviews yet',
    },
    {
      label: 'Messages',
      value: stats.messages,
      icon: FiMail,
      path: '/admin/messages',
      accent: '#00d4ff',
      bg: 'rgba(0,212,255,0.08)',
      border: 'rgba(0,212,255,0.18)',
      badge: stats.unread,
      desc: stats.unread > 0 ? `${stats.unread} unread` : 'All read',
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-white/30 font-body text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(0,212,255,0.12)' }}
      >
        {/* BG glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl" style={{ background: 'rgba(0,212,255,0.08)' }} />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/40 font-body text-sm mb-1">{greeting} 👋</p>
            <h2 className="font-display font-bold text-2xl' style={{ color: isDark ? '#fff' : '#0f172a' }}">
              Welcome back, <span style={{ color: '#00d4ff' }}>{admin?.email?.split('@')[0]}</span>
            </h2>
            <p className="text-white/30 font-body text-sm mt-1">Here's what's happening with your portfolio today.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <FiActivity size={14} style={{ color: '#00d4ff' }} />
            <span className="font-body text-sm" style={{ color: '#00d4ff' }}>Portfolio Live</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, path, accent, bg, border, badge, desc }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link
              to={path}
              className="block rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(circle at 30% 30%, ${accent}10, transparent 70%)` }} />

              <div className="relative">
                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
                    <Icon size={20} style={{ color: accent }} />
                  </div>
                  {badge > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-display font-bold text-black" style={{ background: accent }}>
                      {badge} new
                    </span>
                  )}
                </div>

                {/* Number */}
                <p className="font-display font-bold text-4xl text-white mb-1">{value}</p>
                <p className="font-body font-semibold text-sm text-white/70 mb-1">{label}</p>
                <p className="font-body text-xs" style={{ color: accent + 'aa' }}>{desc}</p>

                {/* Arrow on hover */}
                <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="font-body text-xs" style={{ color: accent }}>Manage</span>
                  <FiArrowRight size={12} style={{ color: accent }} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom section: Recent messages + quick links */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent messages — takes 2/3 */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiMessageSquare size={16} className="text-white/40" />
              <h3 className="font-display font-bold text-white text-base">Recent Messages</h3>
              {stats.unread > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold text-black" style={{ background: '#00d4ff' }}>{stats.unread}</span>
              )}
            </div>
            <Link to="/admin/messages" className="flex items-center gap-1 font-body text-xs transition-colors hover:text-white" style={{ color: 'rgba(0,212,255,0.7)' }}>
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {recentMessages.length === 0 ? (
              <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FiMail size={28} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/20 font-body text-sm">No messages yet</p>
              </div>
            ) : recentMessages.map((msg, i) => (
              <motion.div key={msg._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <Link
                  to="/admin/messages"
                  className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group"
                  style={{
                    background: msg.read ? 'rgba(255,255,255,0.02)' : 'rgba(0,212,255,0.04)',
                    border: msg.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,212,255,0.12)',
                  }}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                    {msg.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />}
                        <p className={`font-body font-semibold text-sm truncate ${msg.read ? 'text-white/50' : 'text-white'}`}>{msg.name}</p>
                        <p className="text-white/25 font-body text-xs hidden sm:block truncate">{msg.email}</p>
                      </div>
                      <span className="text-white/20 font-body text-xs flex-shrink-0">{formatDate(msg.createdAt)}</span>
                    </div>
                    {msg.subject && <p className="text-white/40 font-body text-xs mb-0.5 font-medium">{msg.subject}</p>}
                    <p className="text-white/25 font-body text-xs truncate">{msg.message}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick actions — 1/3 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiUsers size={16} className="text-white/40" />
            <h3 className="font-display font-bold text-white text-base">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Add New Project', sub: 'Showcase your work', path: '/admin/projects', accent: '#3b82f6', icon: FiGrid },
              { label: 'Add Review', sub: 'Client testimonial', path: '/admin/reviews', accent: '#f59e0b', icon: FiStar },
              { label: 'Add Education', sub: 'Academic record', path: '/admin/education', accent: '#a855f7', icon: FiBook },
              { label: 'View Messages', sub: stats.unread > 0 ? `${stats.unread} unread` : 'All caught up', path: '/admin/messages', accent: '#00d4ff', icon: FiMail },
            ].map(({ label, sub, path, accent, icon: Icon }, i) => (
              <motion.div key={label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                <Link
                  to={path}
                  className="flex items-center gap-3 p-4 rounded-xl group transition-all duration-200 hover:-translate-x-1"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}18`, border: `1px solid ${accent}25` }}>
                    <Icon size={16} style={{ color: accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{label}</p>
                    <p className="font-body text-xs text-white/30">{sub}</p>
                  </div>
                  <FiArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Portfolio link */}
          <motion.a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-body text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#00d4ff' }}
          >
            <FiEye size={15} />
            View Live Portfolio
          </motion.a>
        </div>
      </div>
    </div>
  );
}
