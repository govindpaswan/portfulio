import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { degree: '', institute: '', startYear: '', endYear: '', description: '' };

export default function ManageEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/education');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Failed to load education'); }
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item._id); setForm({ ...item }); setModalOpen(true); };
  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.degree.trim()) return toast.error('Degree is required.');
    if (!form.institute.trim()) return toast.error('Institute is required.');
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/education/${editing}`, form);
        setItems(p => p.map(i => i._id === editing ? res.data : i));
        toast.success('Updated!');
      } else {
        const res = await api.post('/education', form);
        setItems(p => [res.data, ...p]);
        toast.success('Added! ✅');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/education/${id}`);
      setItems(p => p.filter(i => i._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Education</h2>
          <p className="text-white/30 text-sm mt-0.5">{items.length} records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
            <FiRefreshCw size={16} />
          </button>
          <button onClick={openAdd} className="btn-primary text-sm"><FiPlus size={16} /> Add Education</button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5 flex items-start gap-4" style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)', color: '#a855f7' }}>
                🎓
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.degree}</h3>
                    <p className="text-purple-400 text-xs mt-0.5">{item.institute}</p>
                    <p className="text-white/30 text-xs mt-0.5">{item.startYear} — {item.endYear || 'Present'}</p>
                    {item.description && <p className="text-white/45 text-xs mt-2 leading-relaxed">{item.description}</p>}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#a855f7' }}><FiEdit2 size={13} /></button>
                    <button onClick={() => handleDelete(item._id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}><FiTrash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && <div className="text-center py-16 text-white/20 text-sm">No records yet. Click "Add Education" to start.</div>}
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
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Education' : 'Add Education'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}><FiX size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="label">Degree / Course *</label><input name="degree" value={form.degree} onChange={handleChange} className="admin-input" placeholder="B.Sc Computer Science" /></div>
                <div><label className="label">Institute *</label><input name="institute" value={form.institute} onChange={handleChange} className="admin-input" placeholder="University of Mumbai" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Start Year</label><input name="startYear" value={form.startYear} onChange={handleChange} className="admin-input" placeholder="2021" /></div>
                  <div><label className="label">End Year</label><input name="endYear" value={form.endYear} onChange={handleChange} className="admin-input" placeholder="2024" /></div>
                </div>
                <div><label className="label">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="admin-input resize-none" placeholder="Brief description..." /></div>
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
