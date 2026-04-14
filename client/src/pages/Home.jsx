import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

/* ═══════════════════════════════ HERO ═══════════════════════════════ */
const roles = ['Full-Stack Developer', 'MERN Stack Expert', 'React Specialist', 'Node.js Developer'];

function HeroSection() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = roles[roleIdx];
    let timeout;
    if (typing) {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setRoleIdx(p => (p + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIdx]);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a14]">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07), transparent)' }}
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07), transparent)' }}
      />
      {/* Top right extra orb */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-16 right-16 w-48 h-48 rounded-full blur-2xl pointer-events-none hidden lg:block"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05), transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-7"
            >
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-400 text-xs font-display font-semibold tracking-widest uppercase">Available for Work</span>
            </motion.div>

            {/* Name */}
            <div className="mb-3">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-white/40 font-body text-lg mb-1"
              >
                Hi, I'm
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }}
                className="font-display font-bold text-6xl md:text-7xl xl:text-8xl leading-[0.95] tracking-tight"
              >
                <span className="text-white">Go</span>
                <span style={{ color: '#00d4ff', textShadow: '0 0 40px rgba(0,212,255,0.4)' }}>vind</span>
              </motion.h1>
            </div>

            {/* Typewriter role */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-2 mb-6 h-10"
            >
              <div className="w-1 h-7 rounded-full" style={{ background: '#00d4ff' }} />
              <span className="font-display font-bold text-xl md:text-2xl text-white/70">
                {displayed}
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: '#00d4ff' }}>|</motion.span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/45 text-base font-body leading-relaxed max-w-md mb-8"
            >
              I build scalable web apps using the MERN stack. Passionate about clean UI, solid backends, and turning ideas into real products.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.a href="#projects" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-primary group">
                View My Work <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-outline">
                Let's Talk
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="flex flex-wrap gap-3 mb-7"
            >
              {[
                { value: '10+', label: 'Projects', icon: '🚀', color: '#00d4ff' },
                { value: '1yr', label: 'Experience', icon: '💼', color: '#a855f7' },
                { value: '4.7★', label: 'Rating', icon: '⭐', color: '#f59e0b' },
                { value: '100%', label: 'Satisfaction', icon: '✅', color: '#22c55e' },
              ].map(({ value, label, icon, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-default"
                  style={{ background: `${color}10`, border: `1px solid ${color}25` }}
                >
                  <span className="text-base">{icon}</span>
                  <div>
                    <p className="font-display font-bold text-sm text-white leading-tight">{value}</p>
                    <p className="font-body text-xs" style={{ color: `${color}99` }}>{label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex items-center gap-4">
              <span className="text-white/20 text-xs font-body">Follow me</span>
              <div className="h-px w-8 bg-white/10" />
              {[{ icon: FiGithub, href: 'https://github.com/paswangovind680' }, { icon: FiLinkedin, href: 'https://linkedin.com' }].map(({ icon: Icon, href }, i) => (
                <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                  <Icon size={16} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right — photo with animated ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 80 }}
            className="flex justify-center items-center"
          >
            <div className="relative">
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-3xl"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(0,212,255,0.4), transparent, rgba(139,92,246,0.4), transparent, rgba(0,212,255,0.4))',
                  filter: 'blur(8px)',
                }}
              />
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl blur-xl" style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.15), transparent 70%)' }} />
              {/* Photo */}
              <div className="relative w-72 h-80 md:w-80 md:h-[380px] rounded-3xl overflow-hidden" style={{ border: '2px solid rgba(0,212,255,0.25)' }}>
                <img src={govindPhoto} alt="Govind Paswan" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.7) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="font-display font-bold text-white text-xl">Govind Paswan</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="font-body text-sm" style={{ color: '#00d4ff' }}>Full-Stack Developer</motion.p>
                </div>
              </div>
              {/* Sparkle */}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.35)' }}
              >
                <HiSparkles className="text-primary text-lg" />
              </motion.div>
            </div>
          </motion.div>
        </div>
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

  useEffect(() => {
    autoRef.current = setInterval(next, 4000);
    return () => clearInterval(autoRef.current);
  }, [next]);

  const resetAuto = () => { clearInterval(autoRef.current); autoRef.current = setInterval(next, 4000); };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden" style={{ background: '#0a0a14' }}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-[120px] opacity-8 pointer-events-none" style={{ background: '#00d4ff' }} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <FiStar size={12} style={{ color: '#00d4ff' }} />
            <span className="font-display font-semibold text-xs tracking-widest uppercase" style={{ color: '#00d4ff' }}>Testimonials</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="font-display font-bold text-4xl md:text-5xl text-white">What People Say</motion.h2>
        </div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <>
            {/* Main review card */}
            <div {...swipe}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 60, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative rounded-3xl p-8 md:p-10 overflow-hidden mb-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.07) 0%, rgba(139,92,246,0.05) 100%)',
                    border: '1px solid rgba(0,212,255,0.18)',
                  }}
                >
                  {/* Big decorative quote */}
                  <div className="absolute -top-4 -left-2 font-display font-black text-[140px] leading-none select-none pointer-events-none" style={{ color: 'rgba(0,212,255,0.05)' }}>"</div>

                  {/* Star rating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                    className="flex gap-1 mb-6 relative z-10"
                  >
                    {[1,2,3,4,5].map(s => (
                      <motion.span key={s} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 0.2 + s * 0.06 }}>
                        <FiStar size={22} style={s <= data[idx].rating ? { color: '#f59e0b', fill: '#f59e0b' } : { color: 'rgba(255,255,255,0.12)' }} />
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Quote text */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-body text-lg md:text-xl text-white/80 leading-relaxed mb-8 relative z-10"
                  >
                    "{data[idx].message}"
                  </motion.p>

                  {/* Author */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(139,92,246,0.25))', border: '2px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                      {data[idx].photo
                        ? <img src={data[idx].photo} alt={data[idx].name} className="w-full h-full rounded-full object-cover" />
                        : data[idx].name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-bold text-white text-lg">{data[idx].name}</p>
                      <p className="font-body text-sm" style={{ color: 'rgba(0,212,255,0.7)' }}>{data[idx].designation || 'Client'}</p>
                    </div>
                    {/* Card number */}
                    <div className="ml-auto font-display text-xs text-white/15">{idx + 1} / {data.length}</div>
                  </motion.div>

                  {/* Corner glow */}
                  <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,0.04)' }} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button onClick={() => { prev(); resetAuto(); }} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                <FiChevronLeft size={20} />
              </button>

              {/* Progress dots */}
              <div className="flex gap-2 flex-1 items-center">
                {data.map((_, i) => (
                  <button key={i} onClick={() => { setIdx(i); resetAuto(); }}
                    className="h-1.5 rounded-full transition-all duration-500 flex-1"
                    style={{ background: i === idx ? '#00d4ff' : 'rgba(255,255,255,0.12)', maxWidth: i === idx ? '48px' : '16px' }}
                  />
                ))}
              </div>

              <button onClick={() => { next(); resetAuto(); }} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                <FiChevronRight size={20} />
              </button>
            </div>
            <p className="text-center text-white/15 font-body text-xs mt-3">Auto-changes • Swipe or tap arrows</p>
          </>
        )}

        <div className="text-center mt-10">
          <Link to="/reviews" className="btn-outline inline-flex items-center gap-2">All Reviews <FiArrowRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════ CONTACT ═══════════════════════════════ */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
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
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="label">Phone (optional)</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field" /></div>
                  <div><label className="label">Subject</label><input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className="input-field" /></div>
                </div>
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
