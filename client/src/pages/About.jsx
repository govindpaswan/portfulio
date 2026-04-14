import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import govindPhoto from '../assets/govind.png';

const skillsWithLogos = [
  { name: 'React', color: '#61DAFB', bg: 'rgba(97,218,251,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="3.5" fill="#61DAFB"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)"/></svg> },
  { name: 'Node.js', color: '#68A063', bg: 'rgba(104,160,99,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M20 4L35 12.5V27.5L20 36L5 27.5V12.5L20 4Z" fill="#68A063" opacity="0.9"/><text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">JS</text></svg> },
  { name: 'MongoDB', color: '#4DB33D', bg: 'rgba(77,179,61,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M20 4C20 4 28 10 28 22C28 31 24 36 20 36C16 36 12 31 12 22C12 10 20 4 20 4Z" fill="#4DB33D"/><path d="M20 14V32" stroke="#ffffff" strokeWidth="1.5"/></svg> },
  { name: 'Express', color: '#fff', bg: 'rgba(255,255,255,0.07)', svg: <svg viewBox="0 0 40 40" fill="none"><text x="20" y="26" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Ex</text></svg> },
  { name: 'JavaScript', color: '#F7DF1E', bg: 'rgba(247,223,30,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="3" fill="#F7DF1E"/><text x="20" y="26" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">JS</text></svg> },
  { name: 'TypeScript', color: '#3178C6', bg: 'rgba(49,120,198,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="3" fill="#3178C6"/><text x="20" y="26" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">TS</text></svg> },
  { name: 'MySQL', color: '#00758F', bg: 'rgba(0,117,143,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><text x="20" y="26" textAnchor="middle" fill="#00758F" fontSize="10" fontWeight="bold">SQL</text></svg> },
  { name: 'Tailwind', color: '#38BDF8', bg: 'rgba(56,189,248,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M10 22C10 16 13 13 20 13C27 13 28 17 25 19C28 19 31 21 31 26C31 31 28 34 20 34C12 34 10 29 10 26M10 22C10 22 13 22 16 19" stroke="#38BDF8" strokeWidth="2" fill="none"/></svg> },
  { name: 'Git', color: '#F05032', bg: 'rgba(240,80,50,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="28" cy="12" r="4" fill="#F05032"/><circle cx="12" cy="28" r="4" fill="#F05032"/><circle cx="28" cy="28" r="4" fill="#F05032"/><path d="M28 16V24M16 28H24M15 15L25 25" stroke="#F05032" strokeWidth="2"/></svg> },
  { name: 'Redux', color: '#764ABC', bg: 'rgba(118,74,188,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M20 8C26 8 30 12 30 17C30 17 33 17 33 21C33 25 30 26 28 26M20 32C14 32 10 28 10 23C10 23 7 23 7 19C7 15 10 14 12 14" stroke="#764ABC" strokeWidth="2" fill="none"/><circle cx="20" cy="20" r="3" fill="#764ABC"/></svg> },
  { name: 'REST API', color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><path d="M8 20H32M20 8L32 20L20 32" stroke="#00d4ff" strokeWidth="2"/></svg> },
  { name: 'Socket.io', color: '#888', bg: 'rgba(136,136,136,0.1)', svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="#888" strokeWidth="1.5" fill="none"/><path d="M15 15L20 20L15 25M20 20H26" stroke="#888" strokeWidth="1.5"/></svg> },
];

const personalInfo = [
  { label: 'Full Name', value: 'Govind Paswan' },
  { label: 'Location', value: 'Turbhe, Navi Mumbai' },
  { label: 'Role', value: 'Full-Stack Developer' },
  { label: 'Experience', value: '1+ Year' },
  { label: 'Phone', value: '+91 73047 85968', href: 'tel:+917304785968' },
  { label: 'Email', value: 'paswangovind680@gmail.com', href: 'mailto:paswangovind680@gmail.com' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader tag="About Me" title="Who Am I?" subtitle="A passionate full-stack developer from Navi Mumbai, building modern web experiences." />

        {/* Bio + Photo */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl" style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.12), transparent 70%)' }} />
              <div className="relative w-72 h-80 rounded-3xl overflow-hidden" style={{ border: '2px solid rgba(0,212,255,0.2)' }}>
                <img src={govindPhoto} alt="Govind Paswan" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.5) 0%, transparent 60%)' }} />
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap" style={{ background: '#0a0a14', border: '1px solid rgba(0,212,255,0.2)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-body text-xs font-semibold">Available for Work</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-4">Govind Paswan — Full-Stack Developer</h3>
            <p className="text-white/50 font-body leading-relaxed mb-4">
              I'm a passionate Full-Stack Developer from Navi Mumbai, specializing in building
              scalable web applications using the MERN stack — MongoDB, Express, React, and Node.js.
            </p>
            <p className="text-white/50 font-body leading-relaxed mb-6">
              Beyond web dev, I'm passionate about data — Advanced Excel, SQL, and MIS dashboards.
              When I'm not coding, you'll find me exploring new technologies or creating content.
            </p>

            {/* Personal info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {personalInfo.map(({ label, value, href }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white/30 text-xs font-body uppercase tracking-wider mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="font-body font-medium text-sm hover:text-primary transition-colors break-all" style={{ color: 'rgba(0,212,255,0.8)' }}>{value}</a>
                  ) : (
                    <p className="text-white/80 font-body font-medium text-sm">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: FiGithub, href: 'https://github.com/paswangovind680', label: 'GitHub' },
                { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: FiMail, href: 'mailto:paswangovind680@gmail.com', label: 'Email' },
                { icon: FiPhone, href: 'tel:+917304785968', label: 'Phone' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target={label !== 'Phone' && label !== 'Email' ? '_blank' : undefined} rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(0,212,255,0.7)' }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills with logos */}
        <div className="mb-4">
          <SectionHeader tag="Skills" title="What I Work With" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {skillsWithLogos.map(({ name, color, bg, svg }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-default transition-all duration-200"
              style={{ background: bg, border: `1px solid ${color}25` }}
            >
              <div className="w-10 h-10">{svg}</div>
              <span className="font-body font-semibold text-xs text-center" style={{ color }}>{name}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
