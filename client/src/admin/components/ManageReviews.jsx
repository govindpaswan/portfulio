import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { name: '', photo: '', rating: 5, message: '', designation: '' };

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`transition-colors ${s <= value ? 'text-yellow-400' : 'text-white/20 hover:text-yellow-400/50'}`}
        >
          <FiStar size={22} className={s <= value ? 'fill-yellow-400' : ''} />
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

  useEffect(() => {
    api.get('/reviews')
      .then(res => setReviews(res.data))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r._id); setForm(r); setModalOpen(true); };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return toast.error('Name and message are required.');
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/reviews/${editing}`, form);
        setReviews(prev => prev.map(r => r._id === editing ? res.data : r));
        toast.success('Review updated!');
      } else {
        const res = await api.post('/reviews', form);
        setReviews(prev => [res.data, ...prev]);
        toast.success('Review added!');
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

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Reviews</h2>
          <p className="text-white/30 text-sm font-body mt-0.5">
            {reviews.length} reviews · Avg rating: <span className="text-yellow-400">{avgRating}</span>
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <FiPlus size={16} /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex flex-col gap-3"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <FiStar
                    key={s}
                    size={13}
                    className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}
                  />
                ))}
              </div>

              {/* Message */}
              <p className="text-white/50 font-body text-sm leading-relaxed line-clamp-3 flex-1">
                "{review.message}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                <div className="flex items-center gap-2">
                  {review.photo ? (
                    <img src={review.photo} alt={review.name} className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary font-display font-bold text-sm">{review.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-white/70 font-body text-xs font-semibold">{review.name}</p>
                    {review.designation && (
                      <p className="text-white/30 font-body text-xs">{review.designation}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(review)}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-3 text-center py-16 text-white/20 font-body">
              No reviews yet. Add your first testimonial!
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-card border border-white/[0.08] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-white text-lg">
                  {editing ? 'Edit Review' : 'Add Review'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input
                      name="name" value={form.name} onChange={handleChange}
                      className="input-field" placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="label">Designation</label>
                    <input
                      name="designation" value={form.designation} onChange={handleChange}
                      className="input-field" placeholder="CEO, Startup"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Photo URL (optional)</label>
                  <input
                    name="photo" value={form.photo} onChange={handleChange}
                    className="input-field" placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="label">Rating *</label>
                  <StarPicker
                    value={form.rating}
                    onChange={val => setForm(prev => ({ ...prev, rating: val }))}
                  />
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={4} className="input-field resize-none"
                    placeholder="What did they say about your work..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button" onClick={() => setModalOpen(false)}
                    className="btn-outline flex-1 justify-center text-sm"
                  >
                    Cancel
                  </button>
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
