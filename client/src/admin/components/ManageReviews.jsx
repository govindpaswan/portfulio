import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { name: '', photo: '', rating: 5, message: '', designation: '' };

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className="transition-transform hover:scale-110">
          <FiStar size={24} style={s <= value ? { color:'#f59e0b', fill:'#f59e0b' } : { color:'rgba(255,255,255,0.2)' }} />
        </button>
      ))}
    </div>
  );
}

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Failed to load reviews'); }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r._id); setForm({ ...r }); setModalOpen(true); };
  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required.');
    if (!form.message.trim()) return toast.error('Message is required.');
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/reviews/${editing}`, { ...form, rating: Number(form.rating) });
        setReviews(p => p.map(r => r._id === editing ? res.data : r));
        toast.success('Review updated!');
      } else {
        const res = await api.post('/reviews', { ...form, rating: Number(form.rating) });
        setReviews(p => [res.data, ...p]);
        toast.success('Review added! ✅');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving review'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(p => p.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Reviews</h2>
          <p className="text-white/30 text-sm mt-0.5">{reviews.length} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchReviews} className="p-2 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
            <FiRefreshCw size={16} />
          </button>
          <button onClick={openAdd} className="btn-primary text-sm"><FiPlus size={16} /> Add Review</button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5" style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                    {r.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{r.name}</p>
                    <p className="text-white/40 text-xs">{r.designation || 'Client'}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}><FiEdit2 size={13} /></button>
                  <button onClick={() => handleDelete(r._id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}><FiTrash2 size={13} /></button>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(s => <FiStar key={s} size={14} style={s<=r.rating?{color:'#f59e0b',fill:'#f59e0b'}:{color:'rgba(255,255,255,0.15)'}} />)}
              </div>
              <p className="text-white/55 text-sm leading-relaxed line-clamp-3">"{r.message}"</p>
            </motion.div>
          ))}
          {reviews.length === 0 && <div className="col-span-2 text-center py-16 text-white/20 text-sm">No reviews yet. Click "Add Review" to start.</div>}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6" style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Review' : 'Add Review'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}><FiX size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="label">Name *</label><input name="name" value={form.name} onChange={handleChange} className="admin-input" placeholder="Client name" /></div>
                <div><label className="label">Designation</label><input name="designation" value={form.designation} onChange={handleChange} className="admin-input" placeholder="CEO, Developer, Client..." /></div>
                <div><label className="label">Photo URL (optional)</label><input name="photo" value={form.photo} onChange={handleChange} className="admin-input" placeholder="https://..." /></div>
                <div>
                  <label className="label">Rating *</label>
                  <StarPicker value={Number(form.rating)} onChange={v => setForm(p => ({ ...p, rating: v }))} />
                </div>
                <div><label className="label">Message *</label><textarea name="message" value={form.message} onChange={handleChange} rows={4} className="admin-input resize-none" placeholder="Client review..." /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm">
                    {saving ? <><Spinner size="sm" /> Saving...</> : (editing ? 'Update' : 'Add Review')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
