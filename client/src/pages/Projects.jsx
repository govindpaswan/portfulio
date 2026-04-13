import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';

const fallback = [
  {
    _id: '1',
    title: 'Learnify — E-Learning Platform',
    description: 'Full-stack MERN online learning platform with student/admin roles, Razorpay payments, video lessons, quizzes, and PDF certificates.',
    image: '',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Razorpay'],
    liveLink: '#',
    githubLink: '#',
    featured: true
  },
  {
    _id: '2',
    title: 'Pandit Booking Platform',
    description: 'Uber-style puja booking with real-time pandit matching, wallet system, Google Maps integration, and four-app architecture.',
    image: '',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Razorpay'],
    liveLink: '#',
    githubLink: '#',
    featured: false
  },
  {
    _id: '3',
    title: 'SportsIQ — Fantasy Platform',
    description: 'Fantasy sports with five-tier agent hierarchy (Admin → SuperMaster → Master → Agent → Player), IPL schedules, and commission chains.',
    image: '',
    techStack: ['React', 'Vite', 'Node.js', 'CricAPI', 'MongoDB'],
    liveLink: '#',
    githubLink: '#',
    featured: false
  },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const data = projects.length > 0 ? projects : fallback;
  const filters = ['all', 'featured'];
  const filtered = filter === 'featured' ? data.filter(p => p.featured) : data;

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Projects"
          title="Things I've Built"
          subtitle="A collection of projects ranging from e-learning platforms to fantasy sports apps and booking systems."
        />

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-body text-sm font-medium capitalize transition-all duration-200 ${
                filter === f
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group card flex flex-col gradient-border overflow-hidden"
              >
                {/* Image / placeholder */}
                <div className="h-44 rounded-xl overflow-hidden mb-5 bg-surface-hover relative flex-shrink-0">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <FiCode className="text-primary" size={28} />
                      </div>
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary/20 border border-primary/30 text-primary text-xs font-display font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/40 font-body text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(project.techStack || []).map(tech => (
                      <span key={tech} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] text-white/50 rounded-lg text-xs font-body">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/40 hover:text-primary text-sm font-body transition-colors"
                      >
                        <FiGithub size={15} /> Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/40 hover:text-primary text-sm font-body transition-colors ml-auto"
                      >
                        Live Demo <FiExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <p className="text-center text-white/30 font-body py-16">No projects found.</p>
        )}
      </div>
    </div>
  );
}
