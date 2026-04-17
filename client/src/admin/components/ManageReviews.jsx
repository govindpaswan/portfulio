import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiUpload, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { name: '', photo: '', rating: 5, message: '', designation: '' };

function StarPicker({ value, onChange }) {
  const numVal = Number(value) || 5;
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className="transition-transform hover:scale-110">
          <FiStar size={26}
            style={s <= numVal
              ? { color: '#f59e0b', fill: '#f59e0b' }
              : { color: 'rgba(255,255,255,0.18)' }} />
        </button>
      ))}
      <span className="ml-2 text-sm font-body self-center" style={{ color: '#f59e0b' }}>{numVal}/5</span>
    </div>
  );
}

function PhotoUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file?.type.startsWith('image/')) return toast.error('Images only');
    if (file.size > 5 * 1024 * 1024) return toast.error('Max 5MB');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
      toast.success('Photo uploaded!');
    } catch {
      // base64 fallback
      const reader = new FileReader();
      reader.onload = e => { onChange(e.target.result); toast.success('Photo ready!'); };
      reader.readAsDataURL(file);
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-2">
      <label className="label">Reviewer Photo (optional)</label>
      <div className="flex items-center gap-3 flex-wrap">
        {value ? (
          <img src={value} alt="preview" className="w-12 h-12 rounded-full object-cover"
            style={{ border: '2px solid rgba(0,212,255,0.3)' }}
            onError={() => onChange('')} />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.08)', border: '2px dashed rgba(0,212,255,0.3)' }}>
            <FiUpload size={16} style={{ color: 'rgba(0,212,255,0.6)' }} />
          </div>
        )}
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleFile(e.target.files[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="px-3 py-1.5 rounded-lg font-body text-xs transition-all"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
            {uploading ? 'Uploading...' : value ? 'Change' : 'Upload Photo'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-lg font-body text-xs transition-all"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
              Remove
            </button>
          )}
        </div>
        <input type="text" value={value?.startsWith('http') ? value : ''} onChange={e => onChange(e.target.value)}
          className="admin-input flex-1 min-w-[160px]" placeholder="or paste photo URL..." />
      </div>
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

  const fetchReviews = () => {
    setLoading(true);
    api.get('/reviews')
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const openAdd = () => { setEditing(null); setForm({ ...empty, rating: 5 }); setModalOpen(true); };
  const openEdit = (r) => {
    setEditing(r._id);
    setForm({ ...r, rating: Number(r.rating) || 5 }); // ensure Number
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) return toast.error('Name is required');
    if (!form.message?.trim()) return toast.error('Message is required');
    const ratingNum = Number(form.rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) return toast.error('Rating must be 1–5');

    setSaving(true);
    try {
      const payload = { ...form, rating: ratingNum }; // always send as Number
      if (editing) {
        const res = await api.put(`/reviews/${editing}`, payload);
        setReviews(prev => prev.map(r => r._id === editing ? res.data : r));
        toast.success('Review updated!');
      } else {
        const res = await api.post('/reviews', payload);
        setReviews(prev => [res.data, ...prev]);
        toast.success('Review added! ✅');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving review');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success('Review deleted');
    } catch { toast.error('Delete failed'); }
  };

  // Safe avg — filter out bad records
  const validReviews = reviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
  const avgRating = validReviews.length
    ? (validReviews.reduce((a, r) => a + r.rating, 0) / validReviews.length).toFixed(1)
    : '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Reviews</h2>
          <p className="text-white/30 text-sm font-body mt-0.5">
            {reviews.length} total · Avg rating: <span className="text-yellow-400 font-semibold">{avgRating} ★</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchReviews} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
            <FiRefreshCw size={13} /> Refresh
          </button>
          <button onClick={openAdd} className="btn-primary text-sm">
            <FiPlus size={16} /> Add Review
          </button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((review, i) => {
            const safeRating = Number(review.rating) || 0;
            return (
              <motion.div key={review._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="card flex flex-col gap-3">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <FiStar key={s} size={14}
                      style={s <= safeRating ? { color: '#f59e0b', fill: '#f59e0b' } : { color: 'rgba(255,255,255,0.15)' }} />
                  ))}
                  <span className="ml-1 text-xs font-body" style={{ color: 'rgba(245,158,11,0.7)' }}>{safeRating > 0 ? safeRating : '?'}</span>
                </div>
                <p className="text-white/50 font-body text-sm leading-relaxed line-clamp-3 flex-1">
                  {review.message ? `"${review.message}"` : <span className="text-red-400/50 italic">No message</span>}
                </p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2">
                    {review.photo ? (
                      <img src={review.photo} alt={review.name} className="w-8 h-8 rounded-full object-cover"
                        style={{ border: '1px solid rgba(0,212,255,0.2)' }} onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.2),rgba(139,92,246,0.2))', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                        {review.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-white/70 font-body text-xs font-semibold">{review.name || <span className="text-red-400/50">No name</span>}</p>
                      {review.designation && <p className="text-white/30 font-body text-xs">{review.designation}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(review)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                      <FiEdit2 size={12} />
                    </button>
                    <button onClick={() => handleDelete(review._id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {reviews.length === 0 && (
            <div className="col-span-3 text-center py-16 text-white/20 font-body">No reviews yet. Add your first testimonial!</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl p-6"
              style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Review' : 'Add Review'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                  <FiX size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="admin-input" placeholder="Rahul Sharma" />
                  </div>
                  <div>
                    <label className="label">Designation</label>
                    <input name="designation" value={form.designation} onChange={handleChange} className="admin-input" placeholder="CEO, Startup" />
                  </div>
                </div>
                <PhotoUploader value={form.photo} onChange={url => setForm(p => ({ ...p, photo: url }))} />
                <div>
                  <label className="label">Rating * <span className="text-white/30 font-normal">(click to select)</span></label>
                  <StarPicker value={form.rating} onChange={val => setForm(p => ({ ...p, rating: val }))} />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    className="admin-input resize-none" placeholder="What did they say about your work..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm">
                    {saving ? <><Spinner size="sm" /> Saving...</> : (editing ? 'Update Review' : 'Add Review')}
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
