import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const links = [
  { name: 'Home', path: '/' }, { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' }, { name: 'Education', path: '/education' },
  { name: 'Reviews', path: '/reviews' }, { name: 'Contact', path: '/contact' },
];
const socials = [
  { icon: FiGithub, href: 'https://github.com/paswangovind680', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/govind-paswan', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:paswangovind680@gmail.com', label: 'Email' },
];

export default function Footer() {
  const { isDark, colors } = useTheme();
  return (
    <footer style={{ background: colors.footerBg, borderTop: `1px solid ${colors.border}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-black text-sm"
                style={{ background: '#00d4ff', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
                G
              </div>
              <span className="font-display font-bold text-lg" style={{ color: '#ffffff' }}>
                Govind<span style={{ color: '#00d4ff' }}>Portfolio</span>
              </span>
            </Link>
            <p className="text-sm font-body leading-relaxed max-w-xs mb-5" style={{ color: colors.textDim }}>
              Building digital experiences that blend beautiful design with powerful functionality.
              Open for freelance & full-time opportunities.
            </p>
            <div className="space-y-2">
              {[
                { icon: FiPhone, href: 'tel:+917304785968', text: '+91 73047 85968' },
                { icon: FiMail, href: 'mailto:paswangovind680@gmail.com', text: 'paswangovind680@gmail.com' },
              ].map(({ icon: Icon, href, text }) => (
                <a key={href} href={href}
                  className="flex items-center gap-2 text-sm font-body transition-colors hover:text-primary"
                  style={{ color: colors.textDim }}>
                  <Icon size={13} style={{ color: '#00d4ff88' }} />{text}
                </a>
              ))}
              <div className="flex items-center gap-2 text-sm font-body" style={{ color: colors.textDim }}>
                <FiMapPin size={13} style={{ color: '#00d4ff66' }} />Turbhe, Navi Mumbai, India
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-5" style={{ color: colors.textDim }}>Navigation</h4>
            <ul className="space-y-2.5">
              {links.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm font-body transition-colors duration-200 hover:text-primary flex items-center gap-1.5 group"
                    style={{ color: colors.textDim }}>
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />{l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-5" style={{ color: colors.textDim }}>Connect</h4>
            <div className="flex gap-3 mb-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:text-primary"
                  style={{ background: colors.surfaceHover, border: `1px solid ${colors.border}`, color: colors.textMuted }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-500 font-body text-xs font-semibold">Available for work</span>
              </div>
              <p className="text-xs font-body" style={{ color: colors.textDim }}>Open to freelance & full-time roles</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${colors.border}` }}>
          <p className="text-xs font-body" style={{ color: colors.textDim }}>
            © {new Date().getFullYear()} Govind Paswan. All rights reserved.
          </p>
          <p className="text-xs font-body flex items-center gap-1" style={{ color: colors.textDim }}>
            Built with <FiHeart size={11} style={{ color: '#ef4444' }} /> using React + Node.js + MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
