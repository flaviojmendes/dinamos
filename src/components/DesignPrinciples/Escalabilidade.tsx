import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Escalabilidade() {
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
          {t('design_principles.scalability.overview.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          {t('design_principles.scalability.overview.intro')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Horizontal Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/horizontal" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {t('design_principles.scalability.overview.tiles.horizontal_title')}
            </h2>
            <p className="text-zinc-400">
              {t('design_principles.scalability.overview.tiles.horizontal_desc')}
            </p>
          </Link>
        </motion.div>

        {/* Vertical Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/vertical" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {t('design_principles.scalability.overview.tiles.vertical_title')}
            </h2>
            <p className="text-zinc-400">
              {t('design_principles.scalability.overview.tiles.vertical_desc')}
            </p>
          </Link>
        </motion.div>

        {/* Data Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/consistencia" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {t('design_principles.scalability.overview.tiles.consistency_title')}
            </h2>
            <p className="text-zinc-400">
              {t('design_principles.scalability.overview.tiles.consistency_desc')}
            </p>
          </Link>
        </motion.div>

        {/* Latency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/latencia" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {t('design_principles.scalability.overview.tiles.latency_title')}
            </h2>
            <p className="text-zinc-400">
              {t('design_principles.scalability.overview.tiles.latency_desc')}
            </p>
          </Link>
        </motion.div>

        {/* Failover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/failover" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {t('design_principles.scalability.overview.tiles.failover_title')}
            </h2>
            <p className="text-zinc-400">
              {t('design_principles.scalability.overview.tiles.failover_desc')}
            </p>
          </Link>
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
          {t('design_principles.scalability.overview.sim_cta')}
        </Link>
      </motion.div>
    </div>
  );
} 