import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';

const contactInfo = [
  { icon: FiMail, label: 'Email', value: 'govind@portfolio.com', href: 'mailto:govind@portfolio.com' },
  { icon: FiPhone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: FiMapPin, label: 'Location', value: 'Turbhe, Navi Mumbai, India', href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message too short';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Contact"
          title="Let's Work Together"
          subtitle="Have a project in mind or want to collaborate? Drop me a message!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — info */}
          <div className="lg:col-span-2 space-y-5">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-white/30 font-body text-xs uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-white/70 font-body text-sm hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-white/70 font-body text-sm">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10"
            >
              <h4 className="font-display font-bold text-white text-sm mb-2">Currently Available</h4>
              <p className="text-white/40 font-body text-sm leading-relaxed">
                Open to freelance projects, full-time roles, and collaboration opportunities.
                Response time: usually within 24 hours.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-body text-xs">Available for work</span>
              </div>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="card gradient-border">
              <h3 className="font-display font-bold text-white text-xl mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`input-field ${errors.name ? 'border-red-500/50' : ''}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs font-body mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`input-field ${errors.email ? 'border-red-500/50' : ''}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs font-body mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or say hello..."
                    rows={5}
                    className={`input-field resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                  />
                  {errors.message && <p className="text-red-400 text-xs font-body mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
