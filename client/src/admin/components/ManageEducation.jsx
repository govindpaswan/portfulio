import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { degree: '', institute: '', startYear: '', endYear: '', description: '', order: 0 };

export default function ManageEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/education')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to load education'))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (e) => { setEditing(e._id); setForm(e); setModalOpen(true); };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.degree || !form.institute || !form.startYear) return toast.error('Degree, institute, and start year required.');
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/education/${editing}`, form);
        setItems(prev => prev.map(i => i._id === editing ? res.data : i));
        toast.success('Updated!');
      } else {
        const res = await api.post('/education', form);
        setItems(prev => [...prev, res.data]);
        toast.success('Added!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education record?')) return;
    try {
      await api.delete(`/education/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Education</h2>
          <p className="text-white/30 text-sm font-body mt-0.5">{items.length} records</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><FiPlus size={16} /> Add Education</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-white text-base">{item.degree}</h3>
                <p className="text-primary/70 font-body text-sm mt-0.5">{item.institute}</p>
                <p className="text-white/30 font-body text-xs mt-1">{item.startYear} — {item.endYear || 'Present'}</p>
                {item.description && <p className="text-white/40 font-body text-sm mt-2 line-clamp-2">{item.description}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(item._id)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-16 text-white/20 font-body">No education records yet.</div>
          )}
        </div>
      )}

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
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Education' : 'Add Education'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white"><FiX size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Degree / Course *</label>
                  <input name="degree" value={form.degree} onChange={handleChange} className="input-field" placeholder="B.Sc. Computer Science" />
                </div>
                <div>
                  <label className="label">Institute / College *</label>
                  <input name="institute" value={form.institute} onChange={handleChange} className="input-field" placeholder="University of Mumbai" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Year *</label>
                    <input name="startYear" value={form.startYear} onChange={handleChange} className="input-field" placeholder="2020" />
                  </div>
                  <div>
                    <label className="label">End Year</label>
                    <input name="endYear" value={form.endYear} onChange={handleChange} className="input-field" placeholder="2024 or Present" />
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Brief description..." />
                </div>
                <div>
                  <label className="label">Order (for sorting)</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} className="input-field" placeholder="0" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm">
                    {saving ? <><Spinner size="sm" /> Saving...</> : (editing ? 'Update' : 'Add')}
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
