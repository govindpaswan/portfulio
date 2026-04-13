import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import { FiCode, FiDatabase, FiLayout, FiServer } from 'react-icons/fi';

const skills = [
  { category: 'Frontend', icon: FiLayout, items: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', icon: FiServer, items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Mongoose'] },
  { category: 'Database', icon: FiDatabase, items: ['MongoDB', 'MySQL', 'MongoDB Atlas', 'Aggregations'] },
  { category: 'Tools', icon: FiCode, items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Render', 'Vercel'] },
];

const experience = [
  {
    role: 'Frontend Developer Intern',
    company: 'ShiVen Infotech',
    location: 'Turbhe, Navi Mumbai',
    period: '2024 – Present',
    desc: 'Building responsive web apps, collaborating on UI/UX improvements, and developing MERN stack projects.'
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="About Me"
          title="Who Am I?"
          subtitle="A passionate full-stack developer from Navi Mumbai, building modern web experiences."
        />

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center"
        >
          <div>
            <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl bg-surface-card border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="relative z-10">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mx-auto flex items-center justify-center">
                  <span className="font-display font-black text-7xl text-primary">G</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-4">
              Govind — Full-Stack Developer
            </h3>
            <p className="text-white/50 font-body leading-relaxed mb-4">
              I'm a Frontend Developer Intern at ShiVen Infotech, Navi Mumbai. I specialize in building
              scalable full-stack web applications using the MERN stack — MongoDB, Express, React, and Node.js.
            </p>
            <p className="text-white/50 font-body leading-relaxed mb-4">
              Beyond web dev, I'm passionate about data — Advanced Excel, SQL, and MIS dashboards.
              I also create Hindi motivational content on YouTube about mindset and transformation.
            </p>
            <p className="text-white/50 font-body leading-relaxed mb-6">
              When I'm not coding, you'll find me trekking around the Sahyadris or exploring new tech.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Location', value: 'Navi Mumbai, India' },
                { label: 'Role', value: 'Full-Stack Developer' },
                { label: 'Experience', value: '1+ Year' },
                { label: 'Status', value: 'Open to Work' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-card border border-white/[0.06] rounded-xl p-3">
                  <p className="text-white/30 text-xs font-body uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-white/80 font-body font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <SectionHeader tag="Skills" title="What I Work With" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {skills.map(({ category, icon: Icon, items }, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="text-primary" size={18} />
              </div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/50 font-body text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Experience */}
        <SectionHeader tag="Experience" title="Where I've Worked" />

        <div className="space-y-4">
          {experience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <FiCode className="text-primary" size={22} />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h4 className="font-display font-bold text-white text-lg">{exp.role}</h4>
                  <span className="text-primary/70 font-body text-sm border border-primary/20 bg-primary/5 px-3 py-0.5 rounded-full w-fit">
                    {exp.period}
                  </span>
                </div>
                <p className="text-white/60 font-body font-medium text-sm mb-1">
                  {exp.company} · {exp.location}
                </p>
                <p className="text-white/40 font-body text-sm">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
