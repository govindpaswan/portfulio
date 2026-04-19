import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiBook, FiStar, FiMail, FiArrowRight, FiRefreshCw, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminOverview() {
  const { admin } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ projects: 0, education: 0, reviews: 0, messages: 0, unread: 0, avgRating: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [p, e, r, c] = await Promise.all([
        api.get('/projects'),
        api.get('/education'),
        api.get('/reviews'),
        api.get('/contact'),
      ]);
      const msgs     = Array.isArray(c.data) ? c.data : [];
      const reviews  = Array.isArray(r.data) ? r.data : [];
      const projects = Array.isArray(p.data) ? p.data : [];
      const edu      = Array.isArray(e.data) ? e.data : [];
      const avg = reviews.length ? (reviews.reduce((a, rv) => a + rv.rating, 0) / reviews.length).toFixed(1) : 0;
      setStats({ projects: projects.length, education: edu.length, reviews: reviews.length, messages: msgs.length, unread: msgs.filter(m => !m.read).length, avgRating: avg });
      setRecentMessages(msgs.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data. Check your connection.');
      console.error('Dashboard error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const cards = [
    { label: 'Projects',  value: stats.projects,  icon: FiGrid,  path: '/admin/projects',  color: '#3b82f6' },
    { label: 'Education', value: stats.education, icon: FiBook,  path: '/admin/education', color: '#a855f7' },
    { label: 'Reviews',   value: stats.reviews,   icon: FiStar,  path: '/admin/reviews',   color: '#f59e0b', sub: stats.avgRating ? `Avg ${stats.avgRating}★` : 'No reviews' },
    { label: 'Messages',  value: stats.messages,  icon: FiMail,  path: '/admin/messages',  color: '#00d4ff', badge: stats.unread },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      {error && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <span className="text-red-400 text-sm">{error}</span>
          <button onClick={fetchData} className="ml-auto text-red-400 hover:text-red-300 text-xs underline">Retry</button>
        </div>
      )}

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(139,92,246,0.06))', border: '1px solid rgba(0,212,255,0.15)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/40 text-sm mb-1">{greeting} 👋</p>
            <h2 className="font-display font-bold text-white text-2xl">
              Welcome back, <span style={{ color: '#00d4ff' }}>{admin?.email?.split('@')[0]}</span>
            </h2>
            <p className="text-white/30 text-sm mt-1">GovindPortfolio Admin Dashboard</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
              <FiRefreshCw size={14} /> Refresh
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <FiActivity size={14} style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e' }}>Live</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, path, color, badge, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={path} className="block rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
              style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                {badge > 0 && <span className="px-2 py-0.5 rounded-lg text-xs font-bold text-black" style={{ background: color }}>{badge} new</span>}
              </div>
              <p className="font-display font-bold text-4xl text-white mb-1">{value}</p>
              <p className="font-body text-sm text-white/70">{label}</p>
              {sub && <p className="font-body text-xs mt-0.5" style={{ color: `${color}aa` }}>{sub}</p>}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="rounded-2xl p-5" style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <FiMail size={16} style={{ color: '#00d4ff' }} /> Recent Messages
            {stats.unread > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-bold text-black" style={{ background: '#00d4ff' }}>{stats.unread}</span>}
          </h3>
          <Link to="/admin/messages" className="text-xs hover:text-white transition-colors flex items-center gap-1" style={{ color: 'rgba(0,212,255,0.7)' }}>
            View all <FiArrowRight size={12} />
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <div className="text-center py-10 text-white/20 text-sm">
            No messages yet. They appear here when users fill the contact form.
          </div>
        ) : recentMessages.map((msg, i) => (
          <Link key={msg._id} to="/admin/messages"
            className="flex items-start gap-3 p-3 rounded-xl mb-2 transition-all hover:bg-white/5"
            style={{ background: msg.read ? 'transparent' : 'rgba(0,212,255,0.04)', border: `1px solid ${msg.read ? 'transparent' : 'rgba(0,212,255,0.1)'}` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
              {msg.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {!msg.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                <p className="font-body font-semibold text-sm text-white truncate">{msg.name}</p>
                <p className="text-white/30 text-xs flex-shrink-0">{fmt(msg.createdAt)}</p>
              </div>
              <p className="text-white/40 text-xs truncate">{msg.subject || msg.message}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Add Project',   sub: 'Portfolio mein add karo', path: '/admin/projects',  color: '#3b82f6', icon: FiGrid },
          { label: 'Add Review',    sub: 'Client testimonial',       path: '/admin/reviews',   color: '#f59e0b', icon: FiStar },
          { label: 'Add Education', sub: 'Academic record',          path: '/admin/education', color: '#a855f7', icon: FiBook },
          { label: 'Messages',      sub: stats.unread > 0 ? `${stats.unread} unread` : 'All read', path: '/admin/messages', color: '#00d4ff', icon: FiMail },
        ].map(({ label, sub, path, color, icon: Icon }) => (
          <Link key={label} to={path}
            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: '#1e1e35', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="font-body font-semibold text-sm text-white/85 truncate">{label}</p>
              <p className="font-body text-xs text-white/35 truncate">{sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
