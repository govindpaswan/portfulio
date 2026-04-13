import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiDownload, FiGithub, FiLinkedin,
  FiExternalLink, FiCode, FiStar, FiMail,
  FiMapPin, FiPhone, FiSend, FiBookOpen, FiCalendar,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import govindPhoto from '../assets/govind.png';

/* ─── constants ─── */
const techSkills = [
  { name: 'React', icon: '⚛️' }, { name: 'Node.js', icon: '🟩' },
  { name: 'MongoDB', icon: '🍃' }, { name: 'Express', icon: '🚂' },
  { name: 'JavaScript', icon: '🟨' }, { name: 'TypeScript', icon: '🔷' },
  { name: 'Redux', icon: '🔮' }, { name: 'Socket.io', icon: '🔌' },
  { name: 'MySQL', icon: '🐬' }, { name: 'Tailwind', icon: '🎨' },
  { name: 'Git', icon: '🐙' }, { name: 'REST API', icon: '🔗' },
];

const fallbackProjects = [
  { _id: '1', title: 'Learnify — E-Learning Platform', description: 'Full-stack MERN online learning platform with student/admin roles, Razorpay payments, video lessons, and PDF certificates.', techStack: ['React', 'Node.js', 'MongoDB', 'Razorpay'], liveLink: '#', githubLink: '#', featured: true, image: '' },
  { _id: '2', title: 'Pandit Booking Platform', description: 'Uber-style puja booking with real-time pandit matching, wallet system, and Google Maps integration.', techStack: ['React', 'Node.js', 'Socket.io'], liveLink: '#', githubLink: '#', featured: false, image: '' },
  { _id: '3', title: 'SportsIQ — Fantasy Platform', description: 'Fantasy sports with five-tier agent hierarchy, IPL schedules, and commission chains.', techStack: ['React', 'Vite', 'Node.js', 'CricAPI'], liveLink: '#', githubLink: '#', featured: false, image: '' },
];
const fallbackReviews = [
  { _id: '1', name: 'Rahul Sharma', designation: 'Startup Founder', rating: 5, message: 'Govind built our entire platform in record time. The code quality is excellent and he communicates really well throughout the process.' },
  { _id: '2', name: 'Priya Mehta', designation: 'Product Manager', rating: 5, message: 'Outstanding work on our e-commerce platform. He understood our requirements perfectly and delivered beyond expectations.' },
  { _id: '3', name: 'Aarav Patel', designation: 'Tech Lead', rating: 4, message: 'Great developer with strong MERN skills. Very professional, delivered on time, and the code is clean and maintainable.' },
];
const fallbackEducation = [
  { _id: '1', degree: 'B.Sc. Computer Science', institute: 'University of Mumbai', startYear: '2021', endYear: '2024', description: 'Data structures, algorithms, web development, and database management.' },
  { _id: '2', degree: 'HSC — Science', institute: 'Maharashtra State Board', startYear: '2019', endYear: '2021', description: 'Higher Secondary Certificate with focus on Mathematics and Computer Science.' },
];

/* ── touch swipe hook ── */
function useSwipe(onSwipeLeft, onSwipeRight) {
  const startX = useRef(null);
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? onSwipeLeft() : onSwipeRight(); }
    startX.current = null;
  };
  return { onTouchStart, onTouchEnd };
}

/* ── Star rating ── */
function Stars({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <FiStar key={s} size={size} style={s <= rating ? { color: '#f59e0b', fill: '#f59e0b' } : { color: 'rgba(255,255,255,0.15)' }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════ HERO ═══════════════════════════════ */
function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a14]">
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-display font-semibold tracking-widest uppercase">Available for Work</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-display font-bold text-5xl md:text-6xl xl:text-7xl text-white leading-[1.05] tracking-tight">
              Hi, I'm{' '}<span className="text-primary glow-text">Govind</span>
              <br /><span className="text-white/80">Full-Stack</span>
              <br /><span className="text-white/40">Developer</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-6 text-white/50 text-lg font-body leading-relaxed max-w-lg">
              I build scalable web apps using the MERN stack. Passionate about clean UI, solid backends, and turning ideas into real products.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8 flex flex-wrap gap-4">
              <a href="#projects" className="btn-primary group">View My Work <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></a>
              <a href="#contact" className="btn-outline">Let's Talk</a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-8 flex items-center gap-4">
              <span className="text-white/20 text-xs font-body">Follow me</span>
              <div className="h-px w-8 bg-white/10" />
              {[{ icon: FiGithub, href: 'https://github.com/paswangovind680' }, { icon: FiLinkedin, href: 'https://linkedin.com' }].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — photo */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center items-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl blur-2xl" style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.15), transparent 70%)' }} />
              {/* Photo */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden" style={{ border: '2px solid rgba(0,212,255,0.2)' }}>
                <img src={govindPhoto} alt="Govind Paswan" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.6) 0%, transparent 60%)' }} />
              </div>
              {/* Floating stats */}
              {[{ label: 'Projects', value: '10+', pos: '-left-10 top-8' }, { label: 'Experience', value: '1yr', pos: '-right-10 bottom-12' }].map(({ label, value, pos }) => (
                <motion.div key={label} animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className={`absolute ${pos} bg-surface-card border border-white/10 rounded-xl px-4 py-3 shadow-2xl`}>
                  <p className="text-primary font-display font-bold text-xl">{value}</p>
                  <p className="text-white/40 font-body text-xs">{label}</p>
                </motion.div>
              ))}
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-4 w-10 h-10 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
                <HiSparkles className="text-primary text-lg" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Tech badge strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-16 pt-10 border-t border-white/[0.04]">
          <p className="text-white/20 text-xs font-body uppercase tracking-widest text-center mb-6">Tech Stack</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Node.js', 'MongoDB', 'Express', 'SQL', 'JavaScript', 'TypeScript', 'Tailwind'].map((tech, i) => (
              <motion.span key={tech} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.05 }} className="px-4 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-white/40 font-body text-sm hover:text-primary/70 hover:border-primary/20 transition-all cursor-default">
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ SKILLS MARQUEE ═══════════════════════════════ */
function SkillsMarquee() {
  const doubled = [...techSkills, ...techSkills];
  return (
    <section className="py-16 overflow-hidden" style={{ background: '#0d0d1a', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="text-center mb-8">
        <span className="font-body text-xs uppercase tracking-widest text-white/20">Skills & Technologies</span>
      </div>
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #0d0d1a, transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #0d0d1a, transparent)' }} />

        {/* Track 1 — left to right */}
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex gap-4 mb-4"
          style={{ width: 'max-content' }}
        >
          {doubled.map((skill, i) => (
            <div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xl">{skill.icon}</span>
              <span className="font-body font-medium text-sm text-white/60 whitespace-nowrap">{skill.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Track 2 — right to left */}
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-4"
          style={{ width: 'max-content' }}
        >
          {[...doubled].reverse().map((skill, i) => (
            <div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-xl flex-shrink-0" style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)' }}>
              <span className="text-xl">{skill.icon}</span>
              <span className="font-body font-medium text-sm whitespace-nowrap" style={{ color: 'rgba(0,212,255,0.5)' }}>{skill.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ PROJECTS CAROUSEL ═══════════════════════════════ */
function ProjectsSection({ projects, loading }) {
  const data = projects.length > 0 ? projects : fallbackProjects;
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const next = useCallback(() => setIdx(p => (p + 1) % data.length), [data.length]);
  const prev = useCallback(() => setIdx(p => (p - 1 + data.length) % data.length), [data.length]);
  const swipe = useSwipe(next, prev);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => clearInterval(autoRef.current);
  }, [next]);

  const resetAuto = () => { clearInterval(autoRef.current); autoRef.current = setInterval(next, 5000); };

  return (
    <section id="projects" className="py-24 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>Projects</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-bold text-4xl md:text-5xl text-white">Things I've Built</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-4 text-white/40 font-body max-w-xl mx-auto">Swipe or use arrows to browse projects</motion.p>
        </div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-6">
              {data.map((project, i) => (
                <motion.div key={project._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group card flex flex-col gradient-border overflow-hidden">
                  <div className="h-44 rounded-xl overflow-hidden mb-5 relative flex-shrink-0" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.05))' }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}><FiCode style={{ color: '#00d4ff' }} size={28} /></div>
                      </div>
                    )}
                    {project.featured && <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-display font-semibold rounded-full" style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>Featured</span>}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-white/40 font-body text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">{(project.techStack || []).map(t => <span key={t} className="px-2.5 py-1 text-xs font-body rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{t}</span>)}</div>
                  <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-primary text-sm font-body transition-colors"><FiGithub size={15} /> Code</a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-primary text-sm font-body transition-colors ml-auto">Live Demo <FiExternalLink size={15} /></a>}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile swipeable carousel */}
            <div className="md:hidden">
              <div className="relative overflow-hidden rounded-2xl" {...swipe}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="card gradient-border overflow-hidden"
                  >
                    <div className="h-48 rounded-xl overflow-hidden mb-5 relative" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {data[idx].image ? (
                        <img src={data[idx].image} alt={data[idx].title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.05))' }}>
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}><FiCode style={{ color: '#00d4ff' }} size={28} /></div>
                        </div>
                      )}
                      {data[idx].featured && <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-display font-semibold rounded-full" style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>Featured</span>}
                    </div>
                    <h3 className="font-display font-bold text-white text-xl mb-3">{data[idx].title}</h3>
                    <p className="text-white/40 font-body text-sm leading-relaxed mb-4">{data[idx].description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">{(data[idx].techStack || []).map(t => <span key={t} className="px-2.5 py-1 text-xs font-body rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{t}</span>)}</div>
                    <div className="flex gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {data[idx].githubLink && <a href={data[idx].githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 text-sm font-body"><FiGithub size={15} /> Code</a>}
                      {data[idx].liveLink && <a href={data[idx].liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 text-sm font-body ml-auto">Live Demo <FiExternalLink size={15} /></a>}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <button onClick={() => { prev(); resetAuto(); }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}><FiChevronLeft size={20} /></button>
                <div className="flex gap-2">{data.map((_, i) => <button key={i} onClick={() => { setIdx(i); resetAuto(); }} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === idx ? '24px' : '8px', background: i === idx ? '#00d4ff' : 'rgba(255,255,255,0.2)' }} />)}</div>
                <button onClick={() => { next(); resetAuto(); }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}><FiChevronRight size={20} /></button>
              </div>
              <p className="text-center text-white/20 font-body text-xs mt-3">Swipe to browse • {idx + 1} / {data.length}</p>
            </div>
          </>
        )}

        <div className="text-center mt-12">
          <Link to="/projects" className="btn-outline inline-flex items-center gap-2">View All Projects <FiArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ EDUCATION ═══════════════════════════════ */
function EducationSection({ education, loading }) {
  const data = education.length > 0 ? education : fallbackEducation;
  return (
    <section id="education" className="py-24" style={{ background: '#0d0d1a' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>Education</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-bold text-4xl md:text-5xl text-white">My Academic Journey</motion.h2>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="space-y-5">
            {data.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card gradient-border flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <FiBookOpen style={{ color: '#00d4ff' }} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold text-white text-lg">{item.degree}</h3>
                    <span className="flex items-center gap-1.5 font-body text-xs px-3 py-1 rounded-full whitespace-nowrap" style={{ border: '1px solid rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)', color: 'rgba(0,212,255,0.8)' }}>
                      <FiCalendar size={11} />{item.startYear} — {item.endYear || 'Present'}
                    </span>
                  </div>
                  <p className="font-body text-sm mb-2" style={{ color: 'rgba(0,212,255,0.7)' }}>{item.institute}</p>
                  {item.description && <p className="text-white/40 font-body text-sm leading-relaxed">{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/education" className="btn-outline inline-flex items-center gap-2">Full Timeline <FiArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ REVIEWS CAROUSEL ═══════════════════════════════ */
function ReviewsSection({ reviews, loading }) {
  const data = reviews.length > 0 ? reviews : fallbackReviews;
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const next = useCallback(() => setIdx(p => (p + 1) % data.length), [data.length]);
  const prev = useCallback(() => setIdx(p => (p - 1 + data.length) % data.length), [data.length]);
  const swipe = useSwipe(next, prev);
  const avg = (data.reduce((a, r) => a + r.rating, 0) / data.length).toFixed(1);

  useEffect(() => {
    autoRef.current = setInterval(next, 4500);
    return () => clearInterval(autoRef.current);
  }, [next]);

  const resetAuto = () => { clearInterval(autoRef.current); autoRef.current = setInterval(next, 4500); };

  return (
    <section id="reviews" className="py-28 relative overflow-hidden" style={{ background: '#0a0a14' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-10" style={{ background: '#00d4ff' }} />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <FiStar size={12} style={{ color: '#00d4ff' }} />
            <span className="font-display font-semibold text-xs tracking-widest uppercase" style={{ color: '#00d4ff' }}>Testimonials</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-bold text-4xl md:text-5xl text-white mb-4">What People Say</motion.h2>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-4 mb-14">
          {[{ value: data.length + '+', label: 'Happy Clients', e: '🤝' }, { value: avg + ' ★', label: 'Avg Rating', e: '⭐' }, { value: '100%', label: 'Satisfaction', e: '✅' }].map(({ value, label, e }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xl">{e}</span>
              <div><p className="font-display font-bold text-xl text-white">{value}</p><p className="font-body text-xs text-white/30">{label}</p></div>
            </div>
          ))}
        </motion.div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT — Big featured card */}
            <div className="lg:col-span-5">
              <div {...swipe}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.38, ease: 'easeInOut' }}
                    className="relative rounded-3xl p-7 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(139,92,246,0.04) 100%)', border: '1px solid rgba(0,212,255,0.15)', minHeight: '280px' }}
                  >
                    <div className="absolute -top-3 -left-3 font-display font-bold text-[110px] leading-none select-none pointer-events-none" style={{ color: 'rgba(0,212,255,0.06)' }}>"</div>
                    <div className="flex gap-0.5 mb-5 relative z-10">
                      {[1,2,3,4,5].map(s => <FiStar key={s} size={18} style={s <= data[idx].rating ? { color: '#f59e0b', fill: '#f59e0b' } : { color: 'rgba(255,255,255,0.1)' }} />)}
                    </div>
                    <p className="font-body text-base text-white/80 leading-relaxed mb-7 relative z-10">"{data[idx].message}"</p>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))', border: '2px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                        {data[idx].photo ? <img src={data[idx].photo} alt={data[idx].name} className="w-full h-full rounded-full object-cover" /> : data[idx].name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display font-bold text-white">{data[idx].name}</p>
                        <p className="font-body text-sm" style={{ color: 'rgba(0,212,255,0.7)' }}>{data[idx].designation || 'Client'}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-5">
                <button onClick={() => { prev(); resetAuto(); }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}><FiChevronLeft size={20} /></button>
                <div className="flex gap-2 flex-1">
                  {data.map((_, i) => <button key={i} onClick={() => { setIdx(i); resetAuto(); }} className="h-1 rounded-full flex-1 max-w-8 transition-all duration-400" style={{ background: i === idx ? '#00d4ff' : 'rgba(255,255,255,0.12)' }} />)}
                </div>
                <button onClick={() => { next(); resetAuto(); }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}><FiChevronRight size={20} /></button>
              </div>
              <p className="text-center text-white/20 font-body text-xs mt-2">Swipe to browse</p>
            </div>

            {/* RIGHT — Review grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => { setIdx(i); resetAuto(); }}
                  className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300"
                  style={{
                    background: i === idx ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: i === idx ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                    transform: i === idx ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <Stars rating={review.rating} size={12} />
                  <p className="font-body text-xs text-white/45 leading-relaxed line-clamp-3 my-3">"{review.message}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                      {review.photo ? <img src={review.photo} alt={review.name} className="w-full h-full rounded-full object-cover" /> : review.name?.charAt(0)}
                    </div>
                    <div><p className="font-body font-semibold text-xs text-white/70">{review.name}</p><p className="font-body text-xs text-white/30">{review.designation || 'Client'}</p></div>
                  </div>
                  {i === idx && <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: '#00d4ff' }} />}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/reviews" className="btn-outline inline-flex items-center gap-2">All Reviews <FiArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ CONTACT ═══════════════════════════════ */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send.'); }
    finally { setLoading(false); }
  };

  const info = [
    { icon: FiMail, label: 'Email', value: 'paswangovind680@gmail.com', href: 'mailto:paswangovind680@gmail.com' },
    { icon: FiPhone, label: 'Phone', value: '+91 73047 85968', href: 'tel:+917304785968' },
    { icon: FiMapPin, label: 'Location', value: 'Turbhe, Navi Mumbai, India', href: null },
  ];

  return (
    <section id="contact" className="py-24" style={{ background: '#0d0d1a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>Contact</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display font-bold text-4xl md:text-5xl text-white">Let's Work Together</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-4 text-white/40 font-body max-w-md mx-auto">Have a project in mind? Drop me a message!</motion.p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ icon: Icon, label, value, href }) => (
              <motion.div key={label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}><Icon style={{ color: '#00d4ff' }} size={18} /></div>
                <div>
                  <p className="text-white/30 font-body text-xs uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? <a href={href} className="text-white/70 font-body text-sm hover:text-primary transition-colors break-all">{value}</a> : <p className="text-white/70 font-body text-sm">{value}</p>}
                </div>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.03))', border: '1px solid rgba(0,212,255,0.1)' }}>
              <h4 className="font-display font-bold text-white text-sm mb-2">Currently Available</h4>
              <p className="text-white/40 font-body text-sm leading-relaxed">Open to freelance, full-time, and collaboration. Response within 24 hours.</p>
              <div className="mt-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-green-400 font-body text-xs">Available for work</span></div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
            <div className="card gradient-border">
              <h3 className="font-display font-bold text-white text-xl mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="label">Name *</label><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={`input-field ${errors.name ? 'border-red-500/50' : ''}`} />{errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}</div>
                  <div><label className="label">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={`input-field ${errors.email ? 'border-red-500/50' : ''}`} />{errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}</div>
                </div>
                <div><label className="label">Subject</label><input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className="input-field" /></div>
                <div><label className="label">Message *</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5} className={`input-field resize-none ${errors.message ? 'border-red-500/50' : ''}`} />{errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}</div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                  {loading ? <><Spinner size="sm" /> Sending...</> : <><FiSend size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ MAIN ═══════════════════════════════ */
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [education, setEducation] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingR, setLoadingR] = useState(true);
  const [loadingE, setLoadingE] = useState(true);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoadingP(false));
    api.get('/reviews').then(r => setReviews(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoadingR(false));
    api.get('/education').then(r => setEducation(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoadingE(false));
  }, []);

  return (
    <div>
      <HeroSection />
      <SkillsMarquee />
      <ProjectsSection projects={projects} loading={loadingP} />
      <EducationSection education={education} loading={loadingE} />
      <ReviewsSection reviews={reviews} loading={loadingR} />
      <ContactSection />
    </div>
  );
}
