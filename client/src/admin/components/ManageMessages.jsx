import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMail, FiInbox, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contact')
      .then(res => setMessages(res.data))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleMarkRead = async (msg) => {
    if (msg.read) return;
    try {
      await api.patch(`/contact/${msg._id}/read`);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
    } catch {}
  };

  const openMessage = (msg) => {
    setSelected(msg);
    handleMarkRead(msg);
    setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
  };

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase()) ||
    (m.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  const unread = messages.filter(m => !m.read).length;

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Messages</h2>
          <p className="text-white/30 text-sm font-body mt-0.5">
            {messages.length} total
            {unread > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary/15 text-primary text-xs rounded-full border border-primary/20">
                {unread} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="input-field pl-11"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
          {/* Message list */}
          <div className="lg:w-96 flex-shrink-0 space-y-2 overflow-y-auto max-h-[60vh] lg:max-h-full pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-white/20 font-body">
                {search ? 'No messages match your search.' : 'No messages yet.'}
              </div>
            ) : (
              filtered.map((msg, i) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => openMessage(msg)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selected?._id === msg._id
                      ? 'bg-primary/10 border-primary/30'
                      : msg.read
                      ? 'bg-surface-card border-white/[0.06] hover:border-white/10'
                      : 'bg-surface-hover border-primary/10 hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Unread dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${!msg.read ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="min-w-0">
                        <p className={`font-body font-semibold text-sm truncate ${msg.read ? 'text-white/60' : 'text-white'}`}>
                          {msg.name}
                        </p>
                        <p className="text-white/30 font-body text-xs truncate">{msg.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-white/20 font-body text-xs">{formatDate(msg.createdAt)}</span>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(msg._id); }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                  {msg.subject && (
                    <p className="text-white/40 font-body text-xs mt-1.5 ml-4 truncate">{msg.subject}</p>
                  )}
                  <p className="text-white/30 font-body text-xs mt-1 ml-4 line-clamp-1">{msg.message}</p>
                </motion.div>
              ))
            )}
          </div>

          {/* Message detail */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="card gradient-border h-full flex flex-col"
                >
                  {/* Message header */}
                  <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-display font-bold">{selected.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-display font-bold text-white text-base">{selected.name}</p>
                          <a href={`mailto:${selected.email}`} className="text-primary/70 font-body text-sm hover:text-primary transition-colors">
                            {selected.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-white/30 font-body text-xs">{formatDate(selected.createdAt)}</span>
                      <button
                        onClick={() => handleDelete(selected._id)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {selected.subject && (
                    <div className="mb-4">
                      <p className="text-white/30 text-xs font-body uppercase tracking-wider mb-1">Subject</p>
                      <p className="text-white/80 font-body font-medium">{selected.subject}</p>
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-white/30 text-xs font-body uppercase tracking-wider mb-3">Message</p>
                    <p className="text-white/70 font-body text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>

                  {/* Quick reply button */}
                  <div className="pt-5 mt-5 border-t border-white/[0.06]">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                      className="btn-outline text-sm"
                    >
                      <FiMail size={15} />
                      Reply via Email
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                    <FiInbox className="text-primary/40" size={24} />
                  </div>
                  <p className="text-white/20 font-body text-sm">Select a message to read</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
