import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiGithub, FiLinkedin, FiCode, FiStar,
  FiMail, FiMapPin, FiPhone, FiSend, FiBookOpen, FiCalendar,
  FiChevronLeft, FiChevronRight, FiExternalLink,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import govindPhoto from '../assets/govind.png';
import { useTheme } from '../context/ThemeContext';

/* ── Constants ── */
const DEVI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const techSkills = [
  { name:'React',      logo:`${DEVI}/react/react-original.svg` },
  { name:'Node.js',    logo:`${DEVI}/nodejs/nodejs-original.svg` },
  { name:'MongoDB',    logo:`${DEVI}/mongodb/mongodb-original.svg` },
  { name:'Express',    logo:`${DEVI}/express/express-original.svg`,      dark:true },
  { name:'JavaScript', logo:`${DEVI}/javascript/javascript-original.svg` },
  { name:'TypeScript', logo:`${DEVI}/typescript/typescript-original.svg` },
  { name:'Redux',      logo:`${DEVI}/redux/redux-original.svg` },
  { name:'Socket.io',  logo:`${DEVI}/socketio/socketio-original.svg`,    dark:true },
  { name:'MySQL',      logo:`${DEVI}/mysql/mysql-original.svg` },
  { name:'Tailwind',   logo:`${DEVI}/tailwindcss/tailwindcss-original.svg` },
  { name:'Git',        logo:`${DEVI}/git/git-original.svg` },
  { name:'Vite',       logo:`${DEVI}/vitejs/vitejs-original.svg` },
];
const fallbackProjects = [
  { _id:'1', title:'Learnify — E-Learning Platform', description:'Full-stack MERN online learning with Razorpay, video lessons, and PDF certificates.', techStack:['React','Node.js','MongoDB','Razorpay'], liveLink:'#', githubLink:'#', featured:true, image:'' },
  { _id:'2', title:'Pandit Booking Platform', description:'Uber-style puja booking with real-time matching, wallet system, and Maps integration.', techStack:['React','Node.js','Socket.io'], liveLink:'#', githubLink:'#', featured:false, image:'' },
  { _id:'3', title:'SportsIQ — Fantasy Platform', description:'Fantasy sports with five-tier hierarchy, IPL schedules, and commission chains.', techStack:['React','Vite','Node.js','CricAPI'], liveLink:'#', githubLink:'#', featured:false, image:'' },
];
const fallbackReviews = [
  { _id:'1', name:'Rahul Sharma', designation:'Startup Founder', rating:5, message:'Govind built our entire platform in record time. Excellent code quality and great communication.' },
  { _id:'2', name:'Priya Mehta', designation:'Product Manager', rating:5, message:'Outstanding work on our e-commerce platform. He understood requirements perfectly.' },
  { _id:'3', name:'Aarav Patel', designation:'Tech Lead', rating:4, message:'Strong MERN skills, very professional, delivered on time with clean code.' },
];
const fallbackEdu = [
  { _id:'1', degree:'B.Sc. Computer Science', institute:'University of Mumbai', startYear:'2021', endYear:'2024', description:'Data structures, algorithms, web development.' },
  { _id:'2', degree:'HSC — Science', institute:'Maharashtra State Board', startYear:'2019', endYear:'2021', description:'Mathematics and Computer Science.' },
];
const roles = ['Full-Stack Developer','MERN Stack Expert','React Specialist','Node.js Developer'];

/* ── CountUp hook ── */
function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    setCount(0);
    let t0 = null;
    const isFloat = target % 1 !== 0;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const prog = Math.min((ts - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setCount(isFloat ? parseFloat((ease * target).toFixed(1)) : Math.floor(ease * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── StatCard ── */
function StatCard({ numValue, suffix, label, icon, color, delay }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold:0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const count = useCountUp(numValue, 1600, inView);
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
      transition={{ delay, type:'spring', stiffness:200 }} whileHover={{ y:-4, scale:1.07 }}
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-default"
      style={{ background:`${color}10`, border:`1px solid ${color}25` }}>
      <span className="text-base">{icon}</span>
      <div>
        <p className="font-display font-bold text-sm text-white leading-tight">{count}{suffix}</p>
        <p className="font-body text-xs" style={{ color:`${color}99` }}>{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Swipe hook ── */
function useSwipe(onLeft, onRight) {
  const startX = useRef(null);
  return {
    onTouchStart: (e) => { startX.current = e.touches[0].clientX; },
    onTouchEnd: (e) => {
      if (startX.current === null) return;
      const d = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) d > 0 ? onLeft() : onRight();
      startX.current = null;
    },
  };
}

/* ══ HERO ══ */
function HeroSection() {
  const { isDark } = useTheme();
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const cur = roles[roleIdx]; let t;
    if (typing) {
      if (displayed.length < cur.length) t = setTimeout(() => setDisplayed(cur.slice(0, displayed.length+1)), 70);
      else t = setTimeout(() => setTyping(false), 2000);
    } else {
      if (displayed.length > 0) t = setTimeout(() => setDisplayed(displayed.slice(0,-1)), 40);
      else { setRoleIdx(p => (p+1)%roles.length); setTyping(true); }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, roleIdx]);

  const heroBg = isDark ? '#0a0a14' : '#ffffff';

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden" style={{ background: heroBg }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <motion.div animate={{ x:[0,30,0], y:[0,-20,0], scale:[1,1.1,1] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background:`radial-gradient(circle, ${isDark?'rgba(0,212,255,0.07)':'rgba(0,212,255,0.12)'}, transparent)` }} />
      <motion.div animate={{ x:[0,-25,0], y:[0,25,0], scale:[1,1.15,1] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }}
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background:`radial-gradient(circle, ${isDark?'rgba(139,92,246,0.07)':'rgba(139,92,246,0.10)'}, transparent)` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, type:'spring', stiffness:200 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
              style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)' }}>
              <motion.span animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }} className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-500 text-xs font-display font-semibold tracking-widest uppercase">Available for Work</span>
            </motion.div>

            <div className="mb-3">
              <motion.p initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}
                className="text-lg mb-1 font-body" style={{ color: isDark?'rgba(255,255,255,0.4)':'#9ca3af' }}>Hi, I'm</motion.p>
              <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.2, type:'spring', stiffness:100 }}
                className="font-display font-bold text-6xl md:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
                <span style={{ color: isDark?'#fff':'#111827' }}>Go</span>
                <span style={{ color:'#00d4ff', textShadow:'0 0 40px rgba(0,212,255,0.4)' }}>vind</span>
              </motion.h1>
            </div>

            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}
              className="flex items-center gap-2 mb-6 h-10">
              <div className="w-1 h-7 rounded-full" style={{ background:'#00d4ff' }} />
              <span className="font-display font-bold text-xl md:text-2xl" style={{ color:isDark?'rgba(255,255,255,0.7)':'#374151' }}>
                {displayed}
                <motion.span animate={{ opacity:[1,0] }} transition={{ duration:0.6, repeat:Infinity }} style={{ color:'#00d4ff' }}>|</motion.span>
              </span>
            </motion.div>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              className="text-base font-body leading-relaxed max-w-md mb-8" style={{ color:isDark?'rgba(255,255,255,0.45)':'#6b7280' }}>
              I build scalable web apps using the MERN stack. Passionate about clean UI, solid backends, and turning ideas into real products.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} className="flex flex-wrap gap-4 mb-8">
              <motion.a href="#projects" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }} className="btn-primary group">
                View My Work <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a href="#contact" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }} className="btn-outline">Let's Talk</motion.a>
            </motion.div>

            {/* Animated Stats */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.75 }} className="flex flex-wrap gap-3 mb-7">
              <StatCard numValue={10}  suffix="+" label="Projects"     icon="🚀" color="#00d4ff" delay={0.80} />
              <StatCard numValue={1}   suffix="yr" label="Experience"  icon="💼" color="#a855f7" delay={0.88} />
              <StatCard numValue={4.7} suffix="★" label="Rating"       icon="⭐" color="#f59e0b" delay={0.96} />
              <StatCard numValue={100} suffix="%" label="Satisfaction"  icon="✅" color="#22c55e" delay={1.04} />
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }} className="flex items-center gap-4">
              <span className="text-xs font-body" style={{ color:isDark?'rgba(255,255,255,0.2)':'rgba(13,13,26,0.3)' }}>Follow me</span>
              <div className="h-px w-8" style={{ background:isDark?'rgba(255,255,255,0.1)':'#d1d5db' }} />
              {[{ icon:FiGithub, href:'https://github.com/paswangovind680' }, { icon:FiLinkedin, href:'https://linkedin.com' }].map(({ icon:Icon, href }, i) => (
                <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer" whileHover={{ scale:1.15, y:-2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background:isDark?'rgba(255,255,255,0.04)':'#f3f4f6', border:`1px solid ${isDark?'rgba(255,255,255,0.1)':'#d1d5db'}`, color:isDark?'rgba(255,255,255,0.4)':'#6b7280' }}>
                  <Icon size={16} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right — Photo */}
          <motion.div initial={{ opacity:0, scale:0.85, rotate:-3 }} animate={{ opacity:1, scale:1, rotate:0 }}
            transition={{ duration:0.9, delay:0.3, type:'spring', stiffness:80 }} className="flex justify-center items-center">
            <div className="relative">
              <motion.div animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                className="absolute -inset-3 rounded-3xl"
                style={{ background:'conic-gradient(from 0deg, rgba(0,212,255,0.4), transparent, rgba(139,92,246,0.4), transparent, rgba(0,212,255,0.4))', filter:'blur(8px)' }} />
              <div className="absolute inset-0 rounded-3xl blur-xl" style={{ background:'radial-gradient(ellipse, rgba(0,212,255,0.15), transparent 70%)' }} />
              <div className="relative w-72 h-80 md:w-80 md:h-[380px] rounded-3xl overflow-hidden" style={{ border:'2px solid rgba(0,212,255,0.25)' }}>
                <img src={govindPhoto} alt="Govind Paswan" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(10,10,20,0.7) 0%, transparent 55%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }} className="font-display font-bold text-white text-xl">Govind Paswan</motion.p>
                  <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }} className="font-body text-sm" style={{ color:'#00d4ff' }}>Full-Stack Developer</motion.p>
                </div>
              </div>
              <motion.div animate={{ rotate:[0,15,-15,0], scale:[1,1.2,1] }} transition={{ duration:3, repeat:Infinity }}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background:'rgba(0,212,255,0.2)', border:'1px solid rgba(0,212,255,0.35)' }}>
                <HiSparkles className="text-primary text-lg" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ══ SKILLS MARQUEE ══ */
function SkillsMarquee() {
  const { isDark, colors } = useTheme();
  const doubled = [...techSkills, ...techSkills];
  const bg = isDark ? '#0d0d1a' : '#f8f9fa';
  const fade = bg;  // Same as bg for smooth fade
  return (
    <section className="py-16 overflow-hidden" style={{ background:bg, borderTop:`1px solid ${colors.border}`, borderBottom:`1px solid ${colors.border}` }}>
      <div className="text-center mb-8">
        <span className="font-body text-xs uppercase tracking-widest" style={{ color:colors.sectionLabel }}>Skills & Technologies</span>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background:`linear-gradient(to right,${fade},transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background:`linear-gradient(to left,${fade},transparent)` }} />
        {[{ anim:['0%','-50%'], dur:28, row:doubled }, { anim:['-50%','0%'], dur:22, row:[...doubled].reverse() }].map((track, ti) => (
          <motion.div key={ti} animate={{ x:track.anim }} transition={{ duration:track.dur, repeat:Infinity, ease:'linear' }}
            className={`flex gap-4 ${ti===0?'mb-4':''}`} style={{ width:'max-content' }}>
            {track.row.map((skill, i) => (
              <div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-xl flex-shrink-0"
                style={{ background:ti===0?colors.marqueeCard1:colors.marqueeCard2, border:`1px solid ${ti===0?colors.marqueeBrd1:colors.marqueeBrd2}` }}>
                <img src={skill.logo} alt={skill.name} style={{ width:22, height:22, objectFit:'contain' }}
                  className={skill.dark && isDark ? 'logo-dark-only' : ''} />
                <span className="font-body font-medium text-sm whitespace-nowrap" style={{ color:ti===0?colors.marqueeText1:colors.marqueeText2 }}>{skill.name}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ══ PROJECTS ══ */
function ProjectsSection({ projects, loading }) {
  const { colors } = useTheme();
  const data = projects.length > 0 ? projects : fallbackProjects;
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const next = useCallback(() => setIdx(p => (p+1)%data.length), [data.length]);
  const prev = useCallback(() => setIdx(p => (p-1+data.length)%data.length), [data.length]);
  const swipe = useSwipe(next, prev);
  useEffect(() => { autoRef.current = setInterval(next, 5000); return () => clearInterval(autoRef.current); }, [next]);
  const resetAuto = () => { clearInterval(autoRef.current); autoRef.current = setInterval(next, 5000); };

  const Tag = ({ tag }) => (
    <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
      className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4"
      style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}>{tag}</motion.span>
  );

  const ProjectCard = ({ p, compact }) => (
    <div className={`card gradient-border overflow-hidden flex flex-col ${compact?'':'group'}`}>
      <div className="h-44 rounded-xl overflow-hidden mb-5 relative flex-shrink-0" style={{ background:colors.surface2 }}>
        {p.image
          ? <img src={p.image} alt={p.title} className={`w-full h-full object-cover ${compact?'':'group-hover:scale-105 transition-transform duration-500'}`} />
          : <div className="w-full h-full flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(139,92,246,0.06))' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)' }}>
                <FiCode style={{ color:'#00d4ff' }} size={28} />
              </div>
            </div>}
        {p.featured && <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-display font-semibold rounded-full"
          style={{ background:'rgba(0,212,255,0.2)', border:'1px solid rgba(0,212,255,0.3)', color:'#00d4ff' }}>Featured</span>}
      </div>
      <h3 className="font-display font-bold text-lg mb-2" style={{ color:colors.text }}>{p.title}</h3>
      <p className="font-body text-sm leading-relaxed mb-4 flex-1" style={{ color:colors.textMuted }}>{p.description}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {(p.techStack||[]).map(t => <span key={t} className="px-2.5 py-1 text-xs font-body rounded-lg"
          style={{ background:colors.surface2, border:`1px solid ${colors.border}`, color:colors.textMuted }}>{t}</span>)}
      </div>
      <div className="flex gap-3 pt-4" style={{ borderTop:`1px solid ${colors.border}` }}>
        {p.githubLink && <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-body hover:text-primary transition-colors" style={{ color:colors.textMuted }}><FiGithub size={15}/> Code</a>}
        {p.liveLink && <a href={p.liveLink} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-body hover:text-primary transition-colors ml-auto" style={{ color:colors.textMuted }}>Live Demo <FiExternalLink size={15}/></a>}
      </div>
    </div>
  );

  return (
    <section id="projects" className="py-24" style={{ background:colors.bg1 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Tag tag="Projects" />
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="font-display font-bold text-4xl md:text-5xl" style={{ color:colors.text }}>Things I've Built</motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="mt-4 font-body max-w-xl mx-auto" style={{ color:colors.textMuted }}>Swipe or use arrows to browse projects</motion.p>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg"/></div> : (
          <>
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-6">
              {data.map((p,i) => (
                <motion.div key={p._id} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}>
                  <ProjectCard p={p} />
                </motion.div>
              ))}
            </div>
            <div className="md:hidden">
              <div className="relative overflow-hidden rounded-2xl" {...swipe}>
                <AnimatePresence mode="wait">
                  <motion.div key={idx} initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-60 }} transition={{ duration:0.35 }}>
                    <ProjectCard p={data[idx]} compact />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-center gap-4 mt-5">
                <button onClick={() => { prev(); resetAuto(); }} className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:colors.surface2, border:`1px solid ${colors.border}`, color:colors.textMuted }}><FiChevronLeft size={20}/></button>
                <div className="flex gap-2">{data.map((_,i) => <button key={i} onClick={() => { setIdx(i); resetAuto(); }}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ width:i===idx?'24px':'8px', background:i===idx?'#00d4ff':colors.border }} />)}</div>
                <button onClick={() => { next(); resetAuto(); }} className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:colors.surface2, border:`1px solid ${colors.border}`, color:colors.textMuted }}><FiChevronRight size={20}/></button>
              </div>
            </div>
          </>
        )}
        <div className="text-center mt-12">
          <Link to="/projects" className="btn-outline inline-flex items-center gap-2">View All Projects <FiArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  );
}

/* ══ EDUCATION ══ */
function EducationSection({ education, loading }) {
  const { colors } = useTheme();
  const data = education.length > 0 ? education : fallbackEdu;
  return (
    <section id="education" className="py-24" style={{ background:colors.bg2 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4"
            style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}>Education</motion.span>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="font-display font-bold text-4xl md:text-5xl" style={{ color:colors.text }}>My Academic Journey</motion.h2>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg"/></div> : (
          <div className="space-y-5">
            {data.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="card gradient-border flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)' }}>
                  <FiBookOpen style={{ color:'#00d4ff' }} size={20}/>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold text-lg" style={{ color:colors.text }}>{item.degree}</h3>
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ border:'1px solid rgba(0,212,255,0.2)', background:'rgba(0,212,255,0.06)', color:'rgba(0,212,255,0.85)' }}>
                      <FiCalendar size={11}/>{item.startYear} — {item.endYear||'Present'}
                    </span>
                  </div>
                  <p className="font-body text-sm mb-2" style={{ color:'rgba(0,212,255,0.8)' }}>{item.institute}</p>
                  {item.description && <p className="text-sm font-body leading-relaxed" style={{ color:colors.textMuted }}>{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/education" className="btn-outline inline-flex items-center gap-2">Full Timeline <FiArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  );
}

/* ══ REVIEWS ══ */
function ReviewsSection({ reviews, loading }) {
  const { colors } = useTheme();
  const data = reviews.length > 0 ? reviews : fallbackReviews;
  const [idx, setIdx] = useState(0);
  const autoRef = useRef(null);
  const next = useCallback(() => setIdx(p => (p+1)%data.length), [data.length]);
  const prev = useCallback(() => setIdx(p => (p-1+data.length)%data.length), [data.length]);
  const swipe = useSwipe(next, prev);
  useEffect(() => { autoRef.current = setInterval(next, 4000); return () => clearInterval(autoRef.current); }, [next]);
  const resetAuto = () => { clearInterval(autoRef.current); autoRef.current = setInterval(next, 4000); };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden" style={{ background:colors.bg1 }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-[120px] opacity-5 pointer-events-none" style={{ background:'#00d4ff' }}/>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4"
            style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}>Testimonials</motion.span>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="font-display font-bold text-4xl md:text-5xl" style={{ color:colors.text }}>What People Say</motion.h2>
        </div>
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg"/></div> : (
          <>
            <div {...swipe}>
              <AnimatePresence mode="wait">
                <motion.div key={idx} initial={{ opacity:0, x:60, scale:0.96 }} animate={{ opacity:1, x:0, scale:1 }} exit={{ opacity:0, x:-60, scale:0.96 }}
                  transition={{ duration:0.45 }}
                  className="relative rounded-3xl p-8 md:p-10 overflow-hidden mb-6"
                  style={{ background:`linear-gradient(135deg,${colors.isDark?'rgba(0,212,255,0.06)':'rgba(0,212,255,0.05)'} 0%,rgba(139,92,246,0.04) 100%)`, border:'1px solid rgba(0,212,255,0.18)' }}>
                  <div className="absolute -top-4 -left-2 font-display font-black text-[140px] leading-none select-none pointer-events-none" style={{ color:'rgba(0,212,255,0.05)' }}>"</div>
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }} className="flex gap-1 mb-6 relative z-10">
                    {[1,2,3,4,5].map(s => <FiStar key={s} size={22} style={s<=data[idx].rating?{color:'#f59e0b',fill:'#f59e0b'}:{color:colors.border}}/>)}
                  </motion.div>
                  <motion.p initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                    className="font-body text-lg md:text-xl leading-relaxed mb-8 relative z-10" style={{ color:colors.textMuted }}>
                    "{data[idx].message}"
                  </motion.p>
                  <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,rgba(0,212,255,0.25),rgba(139,92,246,0.25))', border:'2px solid rgba(0,212,255,0.3)', color:'#00d4ff' }}>
                      {data[idx].photo
                        ? <img src={data[idx].photo} alt={data[idx].name} className="w-full h-full rounded-full object-cover"/>
                        : data[idx].name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-bold text-lg" style={{ color:colors.text }}>{data[idx].name}</p>
                      <p className="font-body text-sm" style={{ color:'rgba(0,212,255,0.75)' }}>{data[idx].designation||'Client'}</p>
                    </div>
                    <div className="ml-auto font-display text-xs" style={{ color:colors.textDim }}>{idx+1}/{data.length}</div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={()=>{prev();resetAuto();}} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background:colors.surface2, border:`1px solid ${colors.border}`, color:colors.textMuted }}><FiChevronLeft size={20}/></button>
              <div className="flex gap-2 flex-1 items-center">
                {data.map((_,i) => <button key={i} onClick={()=>{setIdx(i);resetAuto();}}
                  className="h-1.5 rounded-full transition-all duration-500 flex-1"
                  style={{ background:i===idx?'#00d4ff':colors.border, maxWidth:i===idx?'48px':'16px' }}/>)}
              </div>
              <button onClick={()=>{next();resetAuto();}} className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background:colors.surface2, border:`1px solid ${colors.border}`, color:colors.textMuted }}><FiChevronRight size={20}/></button>
            </div>
          </>
        )}
        <div className="text-center mt-10">
          <Link to="/reviews" className="btn-outline inline-flex items-center gap-2">All Reviews <FiArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  );
}

/* ══ CONTACT ══ */
function ContactSection() {
  const { colors } = useTheme();
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Required';
    return e;
  };
  const handleChange = (e) => { const{name,value}=e.target; setForm(p=>({...p,[name]:value})); if(errors[name]) setErrors(p=>({...p,[name]:''})); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data.message || 'Message sent successfully!');
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch(err) { toast.error(err.response?.data?.message || 'Failed to send.'); }
    finally { setLoading(false); }
  };

  const info = [
    { icon:FiMail, label:'Email', value:'paswangovind680@gmail.com', href:'mailto:paswangovind680@gmail.com' },
    { icon:FiPhone, label:'Phone', value:'+91 73047 85968', href:'tel:+917304785968' },
    { icon:FiMapPin, label:'Location', value:'Turbhe, Navi Mumbai, India', href:null },
  ];

  return (
    <section id="contact" className="py-24" style={{ background:colors.bg2 }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-display font-semibold tracking-widest uppercase mb-4"
            style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00d4ff' }}>Contact</motion.span>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="font-display font-bold text-4xl md:text-5xl" style={{ color:colors.text }}>Let's Work Together</motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="mt-4 font-body max-w-md mx-auto" style={{ color:colors.textMuted }}>Have a project in mind? Drop me a message!</motion.p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ icon:Icon, label, value, href }) => (
              <motion.div key={label} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="card flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)' }}>
                  <Icon style={{ color:'#00d4ff' }} size={18}/>
                </div>
                <div>
                  <p className="text-xs font-body uppercase tracking-wider mb-0.5" style={{ color:colors.textDim }}>{label}</p>
                  {href ? <a href={href} className="font-body text-sm hover:text-primary transition-colors" style={{ color:colors.textMuted }}>{value}</a>
                        : <p className="font-body text-sm" style={{ color:colors.textMuted }}>{value}</p>}
                </div>
              </motion.div>
            ))}
            <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
              className="card" style={{ background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.12)' }}>
              <h4 className="font-display font-bold text-sm mb-2" style={{ color:colors.text }}>Currently Available</h4>
              <p className="font-body text-sm leading-relaxed" style={{ color:colors.textMuted }}>Open to freelance, full-time, and collaboration. Reply within 24h.</p>
              <div className="mt-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/><span className="text-green-500 font-body text-xs">Available for work</span></div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="lg:col-span-3">
            <div className="card gradient-border">
              <h3 className="font-display font-bold text-xl mb-6" style={{ color:colors.text }}>Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="label">Name *</label><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={`input-field ${errors.name?'border-red-500':''}`}/>{errors.name&&<p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                  <div><label className="label">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={`input-field ${errors.email?'border-red-500':''}`}/>{errors.email&&<p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="label">Phone (optional)</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 73047 85968" className="input-field"/></div>
                  <div><label className="label">Subject</label><input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className="input-field"/></div>
                </div>
                <div><label className="label">Message *</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5} className={`input-field resize-none ${errors.message?'border-red-500':''}`}/>{errors.message&&<p className="text-red-500 text-xs mt-1">{errors.message}</p>}</div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading?<><Spinner size="sm"/> Sending...</>:<><FiSend size={16}/> Send Message</>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══ MAIN ══ */
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [education, setEducation] = useState([]);
  const [loadP, setLoadP] = useState(true);
  const [loadR, setLoadR] = useState(true);
  const [loadE, setLoadE] = useState(true);

  useEffect(() => {
    api.get('/projects').then(r => setProjects(Array.isArray(r.data)?r.data:[])).catch(()=>{}).finally(()=>setLoadP(false));
    api.get('/reviews').then(r => setReviews(Array.isArray(r.data)?r.data:[])).catch(()=>{}).finally(()=>setLoadR(false));
    api.get('/education').then(r => setEducation(Array.isArray(r.data)?r.data:[])).catch(()=>{}).finally(()=>setLoadE(false));
  }, []);

  return (
    <div>
      <HeroSection />
      <SkillsMarquee />
      <ProjectsSection projects={projects} loading={loadP} />
      <EducationSection education={education} loading={loadE} />
      <ReviewsSection reviews={reviews} loading={loadR} />
      <ContactSection />
    </div>
  );
}
