import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink, FiGithub, FiCode, FiUpload, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const empty = { title: '', description: '', image: '', techStack: '', liveLink: '', githubLink: '', featured: false };

/* ── Image Upload Component ── */
function ImageUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [mode, setMode] = useState('url'); // 'url' | 'file'

  useEffect(() => { setPreview(value || ''); }, [value]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB allowed'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPreview(res.data.url);
      onChange(res.data.url);
      toast.success('Image uploaded!');
    } catch {
      // Fallback: convert to base64 for preview/storage
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target.result;
        setPreview(b64);
        onChange(b64);
        toast.success('Image ready (base64)');
      };
      reader.readAsDataURL(file);
    } finally { setUploading(false); }
  };

  return (
    <div>
      {/* Mode switcher */}
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setMode('url')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all"
          style={mode==='url' ? { background:'rgba(0,212,255,0.15)',color:'#00d4ff',border:'1px solid rgba(0,212,255,0.3)' } : { background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.4)',border:'1px solid rgba(255,255,255,0.08)' }}>
          <FiLink size={12}/> URL
        </button>
        <button type="button" onClick={() => setMode('file')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all"
          style={mode==='file' ? { background:'rgba(0,212,255,0.15)',color:'#00d4ff',border:'1px solid rgba(0,212,255,0.3)' } : { background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.4)',border:'1px solid rgba(255,255,255,0.08)' }}>
          <FiUpload size={12}/> Upload from Device
        </button>
      </div>

      {mode === 'url' ? (
        <input value={value} onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
          className="admin-input" placeholder="https://i.imgur.com/example.jpg" />
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-body text-sm transition-all"
            style={{ background:'rgba(0,212,255,0.06)', border:'2px dashed rgba(0,212,255,0.25)', color:'rgba(0,212,255,0.8)' }}>
            {uploading ? <><Spinner size="sm"/> Uploading...</> : <><FiUpload size={16}/> Click to select image (max 5MB)</>}
          </button>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-2 relative">
          <img src={preview} alt="Preview" className="w-full h-36 object-cover rounded-xl"
            style={{ border:'1px solid rgba(0,212,255,0.2)' }}
            onError={() => setPreview('')} />
          <button type="button" onClick={() => { setPreview(''); onChange(''); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background:'rgba(0,0,0,0.7)', color:'#fff' }}><FiX size={12}/></button>
        </div>
      )}
    </div>
  );
}

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
    if (!form.title.trim()) return toast.error('Title is required.');
    if (!form.description.trim()) return toast.error('Description is required.');
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
        toast.success('Project added! ✅');
      }
      setModalOpen(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-white text-xl">Projects</h2>
          <p className="text-white/30 text-sm mt-0.5">{projects.length} total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><FiPlus size={16}/> Add Project</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner size="lg"/></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
              className="rounded-2xl overflow-hidden" style={{ background:'#161626', border:'1px solid rgba(255,255,255,0.08)' }}>
              {/* Image */}
              <div className="h-36 relative" style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.05),rgba(139,92,246,0.05))' }}>
                {p.image
                  ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'}/>
                  : <div className="w-full h-full flex items-center justify-center"><FiCode size={32} style={{ color:'rgba(0,212,255,0.35)' }}/></div>}
                {p.featured && <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(0,212,255,0.2)',border:'1px solid rgba(0,212,255,0.3)',color:'#00d4ff' }}>Featured</span>}
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-white text-sm leading-snug flex-1">{p.title || 'Untitled'}</h3>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(0,212,255,0.08)',border:'1px solid rgba(0,212,255,0.2)',color:'#00d4ff' }}><FiEdit2 size={13}/></button>
                    <button onClick={() => handleDelete(p._id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors" style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.4)' }}><FiTrash2 size={13}/></button>
                  </div>
                </div>
                <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">{p.description}</p>
                {(p.techStack||[]).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(p.techStack||[]).map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.4)' }}>{t}</span>)}
                  </div>
                )}
                <div className="flex gap-3 pt-2.5" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                  {p.githubLink && p.githubLink !== '#' && <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" style={{ color:'rgba(255,255,255,0.3)' }}><FiGithub size={12}/> Code</a>}
                  {p.liveLink && p.liveLink !== '#' && <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors" style={{ color:'rgba(255,255,255,0.3)' }}><FiExternalLink size={12}/> Live</a>}
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-2 text-center py-16 text-white/20 font-body text-sm">
              No projects yet. Click "Add Project" to get started.
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
            <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:20 }}
              className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl p-6"
              style={{ background:'#161626', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-white text-lg">{editing ? 'Edit Project' : 'Add New Project'}</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors" style={{ background:'rgba(255,255,255,0.05)' }}><FiX size={16}/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="admin-input" placeholder="Project name" />
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="admin-input resize-none" placeholder="Brief description..." />
                </div>
                <div>
                  <label className="label">Project Image</label>
                  <ImageUploader value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
                </div>
                <div>
                  <label className="label">Tech Stack (comma separated)</label>
                  <input name="techStack" value={form.techStack} onChange={handleChange} className="admin-input" placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Live Link</label><input name="liveLink" value={form.liveLink} onChange={handleChange} className="admin-input" placeholder="https://..." /></div>
                  <div><label className="label">GitHub Link</label><input name="githubLink" value={form.githubLink} onChange={handleChange} className="admin-input" placeholder="https://github.com/..." /></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer py-1">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-primary" />
                  <span className="text-white/60 font-body text-sm">Mark as Featured</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm">
                    {saving ? <><Spinner size="sm"/> Saving...</> : (editing ? 'Update Project' : 'Add Project')}
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
