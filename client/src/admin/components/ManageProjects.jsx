import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { title: '', description: '', image: '', techStack: '', liveLink: '', githubLink: '', featured: false };

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || '') });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error('Title and description are required.');
    setSaving(true);
    try {
      const payload = { ...form, techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing) {
        const res = await api.put(`/projects/${editing}`, payload);
        setProjects(prev => prev.map(p => p._id === editing ? res.data : p));
        toast.success('Project updated!');
      } else {
        const res = await api.post('/projects', payload);
        setProjects(prev => [res.data, ...prev]);
        toast.success('Project added!');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving project'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Projects</h2>
          <p className="text-white/30 text-sm font-body mt-0.5">{projects.length} total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><FiPlus size={16} /> Add Project</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Project image preview */}
                  {p.image && (
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!p.image && (
                    <div className="w-full h-20 rounded-xl mb-3 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(139,92,246,0.06))', border: '1px solid rgba(0,212,255,0.12)' }}>
                      <FiCode size={24} style={{ color: 'rgba(0,212,255,0.5)' }} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display font-bold text-white text-base leading-snug">{p.title || 'Untitled'}</h3>
                    {p.featured && <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex-shrink-0">Featured</span>}
                  </div>
                  <p className="text-white/50 text-sm font-body leading-relaxed line-clamp-2">{p.description || 'No description'}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(p)} title="Edit"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} title="Delete"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              {(p.techStack || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(p.techStack || []).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}>{t}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {p.githubLink && p.githubLink !== '#' && (
                  <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-body transition-colors hover:text-primary" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <FiGithub size={13} /> GitHub
                  </a>
                )}
                {p.liveLink && p.liveLink !== '#' && (
                  <a href={p.liveLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-body transition-colors hover:text-primary" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <FiExternalLink size={13} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-2 text-center py-16 text-white/20 font-body">
              No projects yet. Click "Add Project" to add your first one.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
              style={{ background: '#161626', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Project' : 'Add Project'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}><FiX size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="label">Title *</label><input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Project name" /></div>
                <div><label className="label">Description *</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Brief description..." /></div>
                <div><label className="label">Image URL (optional)</label><input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
                <div><label className="label">Tech Stack (comma separated)</label><input name="techStack" value={form.techStack} onChange={handleChange} className="input-field" placeholder="React, Node.js, MongoDB" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Live Link</label><input name="liveLink" value={form.liveLink} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
                  <div><label className="label">GitHub Link</label><input name="githubLink" value={form.githubLink} onChange={handleChange} className="input-field" placeholder="https://github.com/..." /></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer py-1">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="text-white/60 font-body text-sm">Mark as Featured</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm">
                    {saving ? <><Spinner size="sm" /> Saving...</> : (editing ? 'Update' : 'Add Project')}
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
