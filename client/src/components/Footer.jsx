import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { RiCodeSSlashLine } from 'react-icons/ri';

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Education', path: '/education' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

const socials = [
  { icon: FiGithub, href: 'https://github.com/paswangovind680', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/govind-paswan', label: 'LinkedIn' },
  { icon: FiMail, href: 'mailto:paswangovind680@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#080812', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
                <RiCodeSSlashLine style={{ color: '#00d4ff', fontSize: '18px' }} />
              </div>
              <span className="font-display font-bold text-white text-lg">Portfolio<span style={{ color: '#00d4ff' }}>.</span></span>
            </Link>
            <p className="text-white/35 text-sm font-body leading-relaxed max-w-xs mb-5">
              Building digital experiences that blend beautiful design with powerful functionality. Open for freelance & full-time opportunities.
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a href="tel:+917304785968" className="flex items-center gap-2 text-white/35 hover:text-primary text-sm font-body transition-colors">
                <FiPhone size={13} style={{ color: 'rgba(0,212,255,0.5)' }} />
                +91 73047 85968
              </a>
              <a href="mailto:paswangovind680@gmail.com" className="flex items-center gap-2 text-white/35 hover:text-primary text-sm font-body transition-colors">
                <FiMail size={13} style={{ color: 'rgba(0,212,255,0.5)' }} />
                paswangovind680@gmail.com
              </a>
              <div className="flex items-center gap-2 text-white/25 text-sm font-body">
                <FiMapPin size={13} style={{ color: 'rgba(0,212,255,0.4)' }} />
                Turbhe, Navi Mumbai, India
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-white/60 text-xs uppercase tracking-widest mb-5">Navigation</h4>
            <ul className="space-y-2.5">
              {links.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-white/35 hover:text-primary text-sm font-body transition-colors duration-200 flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-white/60 text-xs uppercase tracking-widest mb-5">Connect</h4>
            <div className="flex gap-3 mb-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'; e.currentTarget.style.color = '#00d4ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-body text-xs font-semibold">Available for work</span>
              </div>
              <p className="text-white/30 font-body text-xs">Open to freelance & full-time roles</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-white/20 text-xs font-body">
            © {new Date().getFullYear()} Govind Paswan. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-body flex items-center gap-1">
            Built with <FiHeart size={11} style={{ color: '#ef4444' }} /> using React + Node.js + MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
