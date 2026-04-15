import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const fallback = [
  { _id:'1', title:'Learnify — E-Learning Platform', description:'Full-stack MERN learning platform with Razorpay, video lessons, and PDF certificates.', image:'', techStack:['React','Node.js','MongoDB','Razorpay'], liveLink:'#', githubLink:'#', featured:true },
  { _id:'2', title:'Pandit Booking Platform', description:'Uber-style puja booking with real-time matching, wallet system, and Maps integration.', image:'', techStack:['React','Node.js','Socket.io'], liveLink:'#', githubLink:'#', featured:false },
  { _id:'3', title:'SportsIQ — Fantasy Platform', description:'Fantasy sports with 5-tier agent hierarchy, IPL schedules, and commission chains.', image:'', techStack:['React','Vite','Node.js','CricAPI'], liveLink:'#', githubLink:'#', featured:false },
];

export default function Projects() {
  const { colors } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const data = projects.length > 0 ? projects : fallback;
  const filtered = filter === 'featured' ? data.filter(p => p.featured) : data;

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: colors.bg1 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader tag="Projects" title="Things I've Built"
          subtitle="From e-learning platforms to fantasy sports apps and booking systems." />

        <div className="flex justify-center gap-2 mb-12">
          {['all', 'featured'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-5 py-2 rounded-full font-body text-sm font-medium capitalize transition-all"
              style={filter === f
                ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                : { color: colors.textMuted, border: `1px solid ${colors.border}` }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div key={p._id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08 }}
                className="group card gradient-border flex flex-col overflow-hidden">
                <div className="h-44 rounded-xl overflow-hidden mb-5 relative flex-shrink-0"
                  style={{ background: colors.surface2 }}>
                  {p.image
                    ? <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(139,92,246,0.06))' }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.22)' }}>
                          <FiCode style={{ color: '#00d4ff' }} size={28} />
                        </div>
                      </div>}
                  {p.featured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-display font-semibold rounded-full"
                      style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors" style={{ color: colors.text }}>
                  {p.title}
                </h3>
                <p className="font-body text-sm leading-relaxed mb-4 flex-1" style={{ color: colors.textMuted }}>{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {(p.techStack || []).map(t => (
                    <span key={t} className="px-2.5 py-1 text-xs font-body rounded-lg"
                      style={{ background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.textMuted }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-body transition-colors hover:text-primary" style={{ color: colors.textMuted }}>
                      <FiGithub size={15} /> Code
                    </a>
                  )}
                  {p.liveLink && (
                    <a href={p.liveLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-body transition-colors hover:text-primary ml-auto" style={{ color: colors.textMuted }}>
                      Live Demo <FiExternalLink size={15} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {filtered.length === 0 && !loading && (
          <p className="text-center py-16 font-body" style={{ color: colors.textDim }}>No projects found.</p>
        )}
      </div>
    </div>
  );
}
