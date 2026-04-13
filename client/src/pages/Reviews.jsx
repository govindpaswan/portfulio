import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';

const fallback = [
  { _id: '1', name: 'Rahul Sharma', designation: 'Startup Founder', rating: 5, message: 'Govind built our entire platform in record time. The code quality is excellent and he communicates really well throughout the process.', photo: '' },
  { _id: '2', name: 'Priya Mehta', designation: 'Product Manager', rating: 5, message: 'Outstanding work on our e-commerce platform. He understood our requirements perfectly and delivered beyond expectations.', photo: '' },
  { _id: '3', name: 'Aarav Patel', designation: 'Tech Lead', rating: 4, message: 'Great developer with strong MERN skills. Very professional, delivered on time, and the code is clean and maintainable.', photo: '' },
  { _id: '4', name: 'Sneha Joshi', designation: 'Client', rating: 5, message: 'Highly recommended! He turned our idea into a beautiful, functional web app. Will definitely work with him again.', photo: '' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <FiStar
          key={s}
          size={14}
          className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
        />
      ))}
    </div>
  );
}

function Avatar({ name, photo }) {
  if (photo) return <img src={photo} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />;
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
      <span className="font-display font-bold text-primary text-lg">{name?.charAt(0)}</span>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const autoRef = useRef(null);

  useEffect(() => {
    api.get('/reviews')
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const data = reviews.length > 0 ? reviews : fallback;

  const next = () => setActive(p => (p + 1) % data.length);
  const prev = () => setActive(p => (p - 1 + data.length) % data.length);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => clearInterval(autoRef.current);
  }, [data.length]);

  const avgRating = data.reduce((a, r) => a + r.rating, 0) / data.length;

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Testimonials"
          title="What People Say"
          subtitle="Honest feedback from clients and collaborators I've worked with."
        />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {[
            { value: data.length + '+', label: 'Happy Clients' },
            { value: avgRating.toFixed(1), label: 'Avg Rating' },
            { value: '100%', label: 'Satisfaction' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center bg-surface-card border border-white/[0.06] rounded-2xl px-8 py-5">
              <p className="font-display font-bold text-3xl text-primary glow-text">{value}</p>
              <p className="text-white/40 font-body text-sm mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Featured card */}
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative max-w-2xl mx-auto mb-10"
            >
              <div className="gradient-border bg-surface-card rounded-3xl p-8 md:p-10 text-center">
                <div className="absolute top-6 left-8 text-primary/10">
                  <FaQuoteLeft size={48} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <StarRating rating={data[active].rating} />
                  </div>
                  <p className="text-white/70 font-body text-lg leading-relaxed mb-8 italic">
                    "{data[active].message}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Avatar name={data[active].name} photo={data[active].photo} />
                    <div className="text-left">
                      <p className="font-display font-semibold text-white text-sm">{data[active].name}</p>
                      <p className="text-white/40 font-body text-xs">{data[active].designation || 'Client'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-xl bg-surface-card border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all"
              >
                <HiChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {data.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-primary' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-xl bg-surface-card border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 transition-all"
              >
                <HiChevronRight size={20} />
              </button>
            </div>

            {/* All reviews grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActive(i)}
                  className={`card cursor-pointer transition-all duration-200 ${i === active ? 'border-primary/30 bg-primary/5' : 'hover:border-white/10'}`}
                >
                  <StarRating rating={review.rating} />
                  <p className="text-white/40 font-body text-xs leading-relaxed mt-3 mb-4 line-clamp-3">
                    "{review.message}"
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar name={review.name} photo={review.photo} />
                    <div>
                      <p className="text-white/70 font-body text-xs font-semibold">{review.name}</p>
                      <p className="text-white/30 font-body text-xs">{review.designation || 'Client'}</p>
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
