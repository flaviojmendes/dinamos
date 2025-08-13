import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HorizontalScaling() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('design_principles.scalability.horizontal.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          {t('design_principles.scalability.horizontal.intro')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              {t('design_principles.scalability.horizontal.how_title')}
            </h2>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.scalability.horizontal.how_p')}
            </p>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">{t('design_principles.scalability.horizontal.example_title')}</h3>
              <p className="text-zinc-400">
                {t('design_principles.scalability.horizontal.example_p')}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              {t('design_principles.scalability.horizontal.advantages_title')}
            </h2>
            <ul className="space-y-4">
              {(t('design_principles.scalability.horizontal.advantages', { returnObjects: true }) as string[]).map((li, idx) => (
                <motion.li 
                  key={idx}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                >
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-zinc-200">{li.split(':')[0]}</h3>
                    <p className="text-zinc-400">{li.split(':').slice(1).join(':').trim()}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              {t('design_principles.scalability.horizontal.considerations_title')}
            </h2>
            <div className="space-y-4">
              {(t('design_principles.scalability.horizontal.considerations', { returnObjects: true }) as string[]).map((li, idx) => (
                <div key={idx} className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-2">{li.split(':')[0]}</h3>
                  <p className="text-zinc-400">{li.split(':').slice(1).join(':').trim()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              {t('design_principles.scalability.horizontal.best_practices_title')}
            </h2>
            <div className="space-y-4">
              {(t('design_principles.scalability.horizontal.best_practices', { returnObjects: true }) as string[]).map((li, idx) => (
                <div key={idx} className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-2">{li.split(':')[0]}</h3>
                  <p className="text-zinc-400">{li.split(':').slice(1).join(':').trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 flex justify-center"
      >
        <Link
          to="/principios-design/escalabilidade/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('design_principles.scalability.horizontal.sim_cta')}
        </Link>
      </motion.div>
    </div>
  );
} 