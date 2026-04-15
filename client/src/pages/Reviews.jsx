import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const fallback = [
  { _id:'1', name:'Rahul Sharma', designation:'Startup Founder', rating:5, message:'Govind built our entire platform in record time. Excellent code quality and great communication throughout.' },
  { _id:'2', name:'Priya Mehta', designation:'Product Manager', rating:5, message:'Outstanding work on our e-commerce platform. He understood requirements perfectly and delivered beyond expectations.' },
  { _id:'3', name:'Aarav Patel', designation:'Tech Lead', rating:4, message:'Strong MERN skills, very professional, delivered on time with clean and maintainable code.' },
  { _id:'4', name:'Sneha Joshi', designation:'Client', rating:5, message:'Highly recommended! He turned our idea into a beautiful functional web app. Will work with him again.' },
];

export default function Reviews() {
  const { colors } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const autoRef = useRef(null);

  useEffect(() => {
    api.get('/reviews')
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const data = reviews.length > 0 ? reviews : fallback;
  const next = () => setActive(p => (p + 1) % data.length);
  const prev = () => setActive(p => (p - 1 + data.length) % data.length);

  useEffect(() => {
    autoRef.current = setInterval(next, 4500);
    return () => clearInterval(autoRef.current);
  }, [data.length]);

  const avg = (data.reduce((a, r) => a + r.rating, 0) / data.length).toFixed(1);

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: colors.bg1 }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader tag="Testimonials" title="What People Say" subtitle="Honest feedback from clients and collaborators." />

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          {[{ v: `${data.length}+`, l: 'Happy Clients' }, { v: avg, l: 'Avg Rating' }, { v: '100%', l: 'Satisfaction' }].map(({ v, l }) => (
            <div key={l} className="text-center card px-8 py-5">
              <p className="font-display font-bold text-3xl text-primary glow-text">{v}</p>
              <p className="font-body text-sm mt-1" style={{ color: colors.textMuted }}>{l}</p>
            </div>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
          <>
            {/* Featured card */}
            <div className="max-w-2xl mx-auto mb-8">
              <AnimatePresence mode="wait">
                <motion.div key={active}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="card gradient-border rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute -top-4 -left-2 font-display font-black text-[130px] leading-none select-none pointer-events-none"
                    style={{ color: 'rgba(0,212,255,0.05)' }}>"</div>
                  <div className="flex gap-1 mb-5 relative z-10">
                    {[1,2,3,4,5].map(s => <FiStar key={s} size={20} style={s <= data[active].rating ? { color:'#f59e0b', fill:'#f59e0b' } : { color: colors.border }} />)}
                  </div>
                  <p className="font-body text-lg leading-relaxed mb-7 relative z-10" style={{ color: colors.textMuted }}>
                    "{data[active].message}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.25),rgba(139,92,246,0.25))', border:'2px solid rgba(0,212,255,0.3)', color:'#00d4ff' }}>
                      {data[active].photo
                        ? <img src={data[active].photo} alt={data[active].name} className="w-full h-full rounded-full object-cover" />
                        : data[active].name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-bold text-base" style={{ color: colors.text }}>{data[active].name}</p>
                      <p className="font-body text-sm" style={{ color: '#00d4ff', opacity:0.8 }}>{data[active].designation || 'Client'}</p>
                    </div>
                    <span className="ml-auto font-body text-xs" style={{ color: colors.textDim }}>{active+1}/{data.length}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <button onClick={prev} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: colors.surface2, border:`1px solid ${colors.border}`, color: colors.textMuted }}>
                <FiChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {data.map((_,i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: i===active?'24px':'8px', background: i===active?'#00d4ff':colors.border }} />
                ))}
              </div>
              <button onClick={next} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: colors.surface2, border:`1px solid ${colors.border}`, color: colors.textMuted }}>
                <FiChevronRight size={20} />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((r, i) => (
                <motion.div key={r._id}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.05 }}
                  onClick={() => setActive(i)}
                  className="card cursor-pointer transition-all"
                  style={i===active?{ borderColor:'rgba(0,212,255,0.3)', background:'rgba(0,212,255,0.04)' }:{}}>
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <FiStar key={s} size={13} style={s<=r.rating?{color:'#f59e0b',fill:'#f59e0b'}:{color:colors.border}} />)}
                  </div>
                  <p className="font-body text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: colors.textMuted }}>"{r.message}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                      style={{ background:'rgba(0,212,255,0.15)', color:'#00d4ff' }}>{r.name?.charAt(0)}</div>
                    <div>
                      <p className="font-body text-xs font-semibold" style={{ color: colors.text }}>{r.name}</p>
                      <p className="font-body text-xs" style={{ color: colors.textDim }}>{r.designation||'Client'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
