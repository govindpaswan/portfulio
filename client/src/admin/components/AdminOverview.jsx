import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiBook, FiStar, FiMail, FiArrowRight, FiActivity, FiTrash2, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminOverview() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ projects: 0, education: 0, reviews: 0, messages: 0, unread: 0, avgRating: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);

  const fetchStats = () => {
    setLoading(true);
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
      const validReviews = reviews.filter(rv => typeof rv.rating === 'number' && !isNaN(rv.rating));
      const avg = validReviews.length ? (validReviews.reduce((a, rv) => a + rv.rating, 0) / validReviews.length).toFixed(1) : 0;
      setStats({ projects: projects.length, education: education.length, reviews: reviews.length, messages: msgs.length, unread: msgs.filter(m => !m.read).length, avgRating: avg });
      setRecentMessages(msgs.slice(0, 5));
    }).catch(console.error)
    .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(); }, []);

  const handleCleanup = async () => {
    if (!window.confirm('This will delete all corrupt/empty records from the database. Continue?')) return;
    setCleaning(true);
    try {
      const res = await api.delete('/admin/cleanup');
      alert(`✅ Cleanup done!\nDeleted: ${res.data.deleted.projects} projects, ${res.data.deleted.reviews} reviews, ${res.data.deleted.education} education records`);
      fetchStats();
    } catch (err) {
      alert('❌ Cleanup failed: ' + (err.response?.data?.message || err.message));
    } finally { setCleaning(false); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const fmt = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FiGrid, path: '/admin/projects', accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.18)', desc: 'Portfolio items' },
    { label: 'Education', value: stats.education, icon: FiBook, path: '/admin/education', accent: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.18)', desc: 'Academic records' },
    { label: 'Reviews', value: stats.reviews, icon: FiStar, path: '/admin/reviews', accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)', desc: stats.avgRating ? `Avg ${stats.avgRating} ★` : 'No reviews' },
    { label: 'Messages', value: stats.messages, icon: FiMail, path: '/admin/messages', accent: '#00d4ff', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.18)', badge: stats.unread, desc: stats.unread > 0 ? `${stats.unread} unread` : 'All read' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Spinner size="lg" />
      <p className="text-white/30 font-body text-sm">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-7 max-w-5xl">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
        style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.07),rgba(139,92,246,0.05))', border: '1px solid rgba(0,212,255,0.12)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/40 font-body text-sm">{greeting} 👋</p>
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl mt-0.5">
              Welcome back, <span style={{ color: '#00d4ff' }}>{admin?.email?.split('@')[0]}</span>
            </h2>
            <p className="text-white/30 font-body text-sm mt-1">Manage your portfolio content from here.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={fetchStats} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              <FiRefreshCw size={13} /> Refresh
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <FiActivity size={13} style={{ color: '#00d4ff' }} />
              <span className="font-body text-sm" style={{ color: '#00d4ff' }}>Portfolio Live</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, path, accent, bg, border, badge, desc }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link to={path} className="block rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}>
                  <Icon size={19} style={{ color: accent }} />
                </div>
                {badge > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-display font-bold text-black" style={{ background: accent }}>{badge}</span>}
              </div>
              <p className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">{value}</p>
              <p className="font-body font-semibold text-sm text-white/70">{label}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: accent + 'aa' }}>{desc}</p>
              <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-body text-xs" style={{ color: accent }}>Manage</span>
                <FiArrowRight size={11} style={{ color: accent }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent messages */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-white text-base">Recent Messages</h3>
            <Link to="/admin/messages" className="flex items-center gap-1 font-body text-xs hover:text-white transition-colors" style={{ color: 'rgba(0,212,255,0.7)' }}>
              View all <FiArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentMessages.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FiMail size={24} className="mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.1)' }} />
                <p className="text-white/25 font-body text-sm">No messages yet</p>
                <p className="text-white/15 font-body text-xs mt-1">They appear here when users fill the contact form</p>
              </div>
            ) : recentMessages.map((msg, i) => (
              <Link key={msg._id} to="/admin/messages"
                className="flex items-start gap-3 p-3.5 rounded-xl transition-all hover:scale-[1.01]"
                style={{ background: msg.read ? 'rgba(255,255,255,0.02)' : 'rgba(0,212,255,0.04)', border: msg.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,212,255,0.12)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  {msg.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!msg.read && <div className="w-2 h-2 rounded-full" style={{ background: '#00d4ff' }} />}
                      <p className="font-body font-semibold text-sm" style={{ color: msg.read ? 'rgba(255,255,255,0.5)' : '#fff' }}>{msg.name}</p>
                      <p className="text-white/25 font-body text-xs hidden sm:block">{msg.email}</p>
                    </div>
                    <span className="text-white/20 font-body text-xs">{fmt(msg.createdAt)}</span>
                  </div>
                  <p className="text-white/25 font-body text-xs mt-0.5 truncate">{msg.message}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions + cleanup */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-white text-base">Quick Actions</h3>
          {[
            { label: 'Add Project', sub: 'Showcase your work', path: '/admin/projects', accent: '#3b82f6', icon: FiGrid },
            { label: 'Add Review', sub: 'Client testimonial', path: '/admin/reviews', accent: '#f59e0b', icon: FiStar },
            { label: 'Add Education', sub: 'Academic record', path: '/admin/education', accent: '#a855f7', icon: FiBook },
          ].map(({ label, sub, path, accent, icon: Icon }) => (
            <Link key={label} to={path}
              className="flex items-center gap-3 p-3.5 rounded-xl group transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
                <Icon size={15} style={{ color: accent }} />
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{label}</p>
                <p className="font-body text-xs text-white/30">{sub}</p>
              </div>
              <FiArrowRight size={13} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </Link>
          ))}

          {/* DB Cleanup tool */}
          <div className="rounded-xl p-4 mt-2" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle size={14} style={{ color: 'rgba(239,68,68,0.7)' }} />
              <p className="font-body font-semibold text-sm" style={{ color: 'rgba(239,68,68,0.8)' }}>Fix Corrupt Data</p>
            </div>
            <p className="font-body text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Remove empty/invalid records (Untitled projects, NaN ratings, etc.)
            </p>
            <button onClick={handleCleanup} disabled={cleaning}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-body text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.9)' }}>
              {cleaning ? <><Spinner size="sm" /> Cleaning...</> : <><FiTrash2 size={13} /> Clean Corrupt DB Records</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
