import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import govindPhoto from '../assets/govind.png';
import { useTheme } from '../context/ThemeContext';

const DEVI = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const skills = [
  { name: 'React',      logo: `${DEVI}/react/react-original.svg` },
  { name: 'Node.js',    logo: `${DEVI}/nodejs/nodejs-original.svg` },
  { name: 'MongoDB',    logo: `${DEVI}/mongodb/mongodb-original.svg` },
  { name: 'Express',    logo: `${DEVI}/express/express-original.svg`,    dark: true },
  { name: 'JavaScript', logo: `${DEVI}/javascript/javascript-original.svg` },
  { name: 'TypeScript', logo: `${DEVI}/typescript/typescript-original.svg` },
  { name: 'Redux',      logo: `${DEVI}/redux/redux-original.svg` },
  { name: 'Socket.io',  logo: `${DEVI}/socketio/socketio-original.svg`,  dark: true },
  { name: 'MySQL',      logo: `${DEVI}/mysql/mysql-original.svg` },
  { name: 'Tailwind',   logo: `${DEVI}/tailwindcss/tailwindcss-original.svg` },
  { name: 'Git',        logo: `${DEVI}/git/git-original.svg` },
  { name: 'Vite',       logo: `${DEVI}/vitejs/vitejs-original.svg` },
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
  const { isDark, colors } = useTheme();
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: colors.bg1 }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader tag="About Me" title="Who Am I?" subtitle="A passionate full-stack developer from Navi Mumbai, building modern web experiences." />

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl" style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.15), transparent 70%)' }} />
              <div className="relative w-72 h-80 rounded-3xl overflow-hidden" style={{ border: '2px solid rgba(0,212,255,0.25)' }}>
                <img src={govindPhoto} alt="Govind Paswan" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,20,0.5) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap"
                style={{ background: colors.surface, border: '1px solid rgba(0,212,255,0.22)', boxShadow: '0 4px 20px rgba(0,212,255,0.1)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-500 font-body text-xs font-semibold">Available for Work</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl mb-4" style={{ color: colors.text }}>Govind Paswan — Full-Stack Developer</h3>
            <p className="font-body leading-relaxed mb-4 text-sm" style={{ color: colors.textMuted }}>
              I'm a passionate Full-Stack Developer from Navi Mumbai, specializing in scalable web applications using the MERN stack — MongoDB, Express, React, and Node.js.
            </p>
            <p className="font-body leading-relaxed mb-6 text-sm" style={{ color: colors.textMuted }}>
              Beyond web dev, I'm passionate about data — Advanced Excel, SQL, and MIS dashboards. When I'm not coding, you'll find me exploring new technologies.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {personalInfo.map(({ label, value, href }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: colors.surface2, border: `1px solid ${colors.border}` }}>
                  <p className="text-xs font-body uppercase tracking-wider mb-1" style={{ color: colors.textDim }}>{label}</p>
                  {href
                    ? <a href={href} className="font-body font-medium text-sm hover:opacity-80 break-all" style={{ color: '#00d4ff' }}>{value}</a>
                    : <p className="font-body font-medium text-sm" style={{ color: colors.text }}>{value}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { icon: FiGithub, href: 'https://github.com/paswangovind680', label: 'GitHub' },
                { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: FiMail, href: 'mailto:paswangovind680@gmail.com', label: 'Email' },
                { icon: FiPhone, href: 'tel:+917304785968', label: 'Phone' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target={label !== 'Phone' && label !== 'Email' ? '_blank' : undefined} rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', color: '#00d4ff' }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-6"><SectionHeader tag="Skills" title="What I Work With" /></div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {skills.map(({ name, logo, dark }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, scale: 1.06 }}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl cursor-default"
              style={{ background: colors.surface2, border: `1px solid ${colors.border}` }}>
              <img src={logo} alt={name} style={{ width: 32, height: 32, objectFit: 'contain' }}
                className={dark && isDark ? 'logo-dark-only' : ''} />
              <span className="font-body font-semibold text-xs text-center" style={{ color: colors.textMuted }}>{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
