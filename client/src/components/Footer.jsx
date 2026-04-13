import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { RiCodeSSlashLine } from 'react-icons/ri';

const socials = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiMail, href: 'mailto:hello@portfolio.com', label: 'Email' },
];

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <RiCodeSSlashLine className="text-primary text-lg" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                Portfolio<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm font-body leading-relaxed">
              Building digital experiences that blend design and functionality.
              Available for freelance projects.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-white/80 text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-white/40 hover:text-primary text-sm font-body transition-colors duration-200"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-white/80 text-sm uppercase tracking-widest mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="mt-6 text-white/30 text-xs font-body">
              Open to work & collaborations
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs font-body">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <p className="text-white/25 text-xs font-body">
            Built with <span className="text-primary/60">React</span> + <span className="text-primary/60">Node.js</span> + <span className="text-primary/60">MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
