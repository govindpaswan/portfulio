import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const fallback = [
  { _id:'1', degree:'B.Sc. Computer Science', institute:'University of Mumbai', startYear:'2021', endYear:'2024', description:'Data structures, algorithms, web development, and database management.' },
  { _id:'2', degree:'HSC — Science', institute:'Maharashtra State Board', startYear:'2019', endYear:'2021', description:'Higher Secondary Certificate with focus on Mathematics and Computer Science.' },
];

export default function Education() {
  const { colors } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/education')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const data = items.length > 0 ? items : fallback;

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: colors.bg2 }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader tag="Education" title="My Academic Journey" subtitle="The educational milestones that shaped my technical foundation." />
        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'rgba(0,212,255,0.2)' }} />
            <div className="space-y-6 pl-16">
              {data.map((item, i) => (
                <motion.div key={item._id}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card gradient-border relative">
                  <div className="absolute -left-[52px] top-6 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: colors.surface, border: '2px solid rgba(0,212,255,0.3)', boxShadow: '0 0 16px rgba(0,212,255,0.15)' }}>
                    <FiBookOpen style={{ color: '#00d4ff' }} size={18} />
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg" style={{ color: colors.text }}>{item.degree}</h3>
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ border: '1px solid rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.07)', color: 'rgba(0,212,255,0.9)' }}>
                      <FiCalendar size={11} />{item.startYear} — {item.endYear || 'Present'}
                    </span>
                  </div>
                  <p className="font-body text-sm mb-2" style={{ color: '#00d4ff', opacity: 0.8 }}>{item.institute}</p>
                  {item.description && <p className="text-sm font-body leading-relaxed" style={{ color: colors.textMuted }}>{item.description}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
