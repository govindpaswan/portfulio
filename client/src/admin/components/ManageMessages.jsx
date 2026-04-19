import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMail, FiInbox, FiSearch, FiX, FiPhone, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/contact');
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load messages';
      setError(msg);
      console.error('Messages fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(p => p.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch { toast.error('Delete failed'); }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await api.patch(`/contact/${msg._id}/read`);
        setMessages(p => p.map(m => m._id === msg._id ? { ...m, read: true } : m));
      } catch {}
    }
  };

  const filtered = messages.filter(m =>
    [m.name, m.email, m.message, m.subject, m.phone].some(v =>
      (v || '').toLowerCase().includes(search.toLowerCase())
    )
  );
  const unread = messages.filter(m => !m.read).length;
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Messages</h2>
          <p className="text-white/30 text-sm mt-0.5">
            {messages.length} total
            {unread > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-black" style={{ background: '#00d4ff' }}>{unread} unread</span>}
          </p>
        </div>
        <button onClick={fetchMessages} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105"
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <FiAlertCircle style={{ color: '#ef4444' }} size={18} />
          <div className="flex-1">
            <p className="text-red-400 text-sm font-semibold">Could not load messages</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
          <button onClick={fetchMessages} className="text-xs text-red-400 hover:text-red-300 underline">Retry</button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={15} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, message..."
          className="admin-input pl-10 pr-10" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
            <FiX size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* List */}
          <div className="lg:w-80 flex-shrink-0 space-y-2 overflow-y-auto max-h-[55vh] lg:max-h-full pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-14 text-white/20 text-sm">
                {search ? 'No messages match your search.' : 'No messages yet. They will appear when users fill the contact form.'}
              </div>
            ) : filtered.map((msg, i) => (
              <motion.div key={msg._id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => openMessage(msg)}
                className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  background: selected?._id === msg._id ? 'rgba(0,212,255,0.08)' : msg.read ? 'rgba(255,255,255,0.02)' : 'rgba(0,212,255,0.05)',
                  border: selected?._id === msg._id ? '1px solid rgba(0,212,255,0.3)' : msg.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,212,255,0.15)',
                }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.read && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />}
                    <div className="min-w-0">
                      <p className={`font-body font-semibold text-sm truncate ${msg.read ? 'text-white/60' : 'text-white'}`}>{msg.name}</p>
                      <p className="text-white/30 text-xs truncate">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white/20 text-xs hidden sm:block">{fmt(msg.createdAt)}</span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg._id); }}
                      className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-red-400 transition-colors">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
                {msg.subject && <p className="text-white/40 text-xs mt-1 truncate font-medium">{msg.subject}</p>}
                <p className="text-white/25 text-xs mt-0.5 line-clamp-1">{msg.message}</p>
              </motion.div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col rounded-2xl p-5"
                  style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-start justify-between gap-4 pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                        {selected.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-bold text-white">{selected.name}</p>
                        <a href={`mailto:${selected.email}`} className="text-sm hover:text-primary transition-colors" style={{ color: 'rgba(0,212,255,0.7)' }}>
                          {selected.email}
                        </a>
                        {selected.phone && (
                          <p className="flex items-center gap-1 mt-0.5">
                            <FiPhone size={11} style={{ color: 'rgba(0,212,255,0.5)' }} />
                            <a href={`tel:${selected.phone}`} className="text-xs text-white/40 hover:text-primary">{selected.phone}</a>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/25 text-xs">{fmt(selected.createdAt)}</span>
                      <button onClick={() => handleDelete(selected._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {selected.subject && (
                    <div className="mb-4">
                      <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Subject</p>
                      <p className="text-white/80 font-medium">{selected.subject}</p>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Message</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="pt-4 flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                      className="btn-primary text-sm"><FiMail size={15} /> Reply via Email</a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="btn-outline text-sm"><FiPhone size={14} /> Call</a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center rounded-2xl"
                  style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.07)', minHeight: '200px' }}>
                  <FiInbox size={32} style={{ color: 'rgba(0,212,255,0.3)' }} className="mb-3" />
                  <p className="text-white/20 text-sm">Select a message to read</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
