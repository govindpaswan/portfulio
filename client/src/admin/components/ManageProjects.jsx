import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
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
    try {
      const res = await api.get('/projects');
<<<<<<< HEAD

      // ✅ FIX: ensure array
      const data = res.data;
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }

    } catch {
      toast.error('Failed to load projects');
    } finally { setLoading(false); }
=======
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
>>>>>>> 50373ba (update)
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required.');
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving project');
    } finally { setSaving(false); }
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
        <button onClick={openAdd} className="btn-primary text-sm">
          <FiPlus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* ✅ FIX: safe map */}
          {Array.isArray(projects) && projects.map(p => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-white text-base truncate">{p.title}</h3>
                    {p.featured && <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex-shrink-0">Featured</span>}
                  </div>
                  <p className="text-white/40 text-sm font-body line-clamp-2">{p.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              {/* ✅ FIX: techStack safe */}
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(p.techStack) && p.techStack.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] text-white/40 rounded-md">{t}</span>
                ))}
              </div>

              <div className="flex gap-3 pt-2 border-t border-white/[0.04]">
                {p.githubLink && <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/30 hover:text-primary text-xs transition-colors"><FiGithub size={12} /> GitHub</a>}
                {p.liveLink && <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/30 hover:text-primary text-xs transition-colors"><FiExternalLink size={12} /> Live</a>}
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-2 text-center py-16 text-white/20 font-body">
              No projects yet. Click "Add Project" to get started.
            </div>
          )}
        </div>
      )}

      {/* Modal same as it is */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface-card border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Project' : 'Add Project'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Project name" />
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Brief description..." />
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="label">Tech Stack (comma separated)</label>
                  <input name="techStack" value={form.techStack} onChange={handleChange} className="input-field" placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Live Link</label>
                    <input name="liveLink" value={form.liveLink} onChange={handleChange} className="input-field" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="label">GitHub Link</label>
                    <input name="githubLink" value={form.githubLink} onChange={handleChange} className="input-field" placeholder="https://github.com/..." />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
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
