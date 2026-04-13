import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiMapPin } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import Spinner from '../components/Spinner';
import api from '../utils/api';

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/education')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fallback = [
    {
      _id: '1',
      degree: 'B.Sc. Computer Science',
      institute: 'University of Mumbai',
      startYear: '2021',
      endYear: '2024',
      description: 'Studied data structures, algorithms, web development, and database management. Active member of the coding club.'
    },
    {
      _id: '2',
      degree: 'HSC — Science',
      institute: 'Maharashtra State Board',
      startYear: '2019',
      endYear: '2021',
      description: 'Completed Higher Secondary Certificate with focus on Mathematics and Computer Science.'
    },
    {
      _id: '3',
      degree: 'SSC',
      institute: 'Maharashtra State Board',
      startYear: '2018',
      endYear: '2019',
      description: 'Completed Secondary School Certificate with distinction.'
    },
  ];

  const data = items.length > 0 ? items : fallback;

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Education"
          title="My Academic Journey"
          subtitle="The foundations that shaped my technical thinking and problem-solving approach."
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line — desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent transform -translate-x-1/2" />

            <div className="space-y-8">
              {data.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Card */}
                    <div className="flex-1 w-full">
                      <div className={`card gradient-border ${isLeft ? 'md:mr-8' : 'md:ml-8'} hover:shadow-primary/10`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <FiBookOpen className="text-primary" size={18} />
                          </div>
                          <span className="flex items-center gap-1.5 text-primary/80 font-body text-xs border border-primary/20 bg-primary/5 px-3 py-1 rounded-full whitespace-nowrap">
                            <FiCalendar size={11} />
                            {item.startYear} — {item.endYear || 'Present'}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-white text-xl mb-1">
                          {item.degree}
                        </h3>
                        <p className="flex items-center gap-1.5 text-primary/70 font-body text-sm mb-3">
                          <FiMapPin size={12} />
                          {item.institute}
                        </p>
                        {item.description && (
                          <p className="text-white/40 font-body text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex flex-shrink-0 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                        className="w-5 h-5 rounded-full bg-primary border-4 border-[#0a0a14] shadow-lg shadow-primary/40"
                      />
                    </div>

                    {/* Empty side (desktop) */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline end dot */}
            <div className="hidden md:flex justify-center mt-4">
              <div className="w-3 h-3 rounded-full bg-primary/30 border border-primary/20" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
