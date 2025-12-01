import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Retries() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('design_principles.retries.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-300"
        >
          {t('design_principles.retries.intro')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Concept and Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('design_principles.retries.how_it_works.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {t('design_principles.retries.how_it_works.text')}
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('design_principles.retries.real_world_example.title')}</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {t('design_principles.retries.real_world_example.text')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('design_principles.retries.benefits.title')}
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('design_principles.retries.benefits.items.resilience.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('design_principles.retries.benefits.items.resilience.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('design_principles.retries.benefits.items.ux.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('design_principles.retries.benefits.items.ux.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('design_principles.retries.benefits.items.reliability.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('design_principles.retries.benefits.items.reliability.desc')}</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Best Practices and Considerations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('design_principles.retries.best_practices.title')}
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('design_principles.retries.best_practices.items.backoff.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t('design_principles.retries.best_practices.items.backoff.desc')}
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('design_principles.retries.best_practices.items.limit.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t('design_principles.retries.best_practices.items.limit.desc')}
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('design_principles.retries.best_practices.items.idempotency.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t('design_principles.retries.best_practices.items.idempotency.desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('design_principles.retries.considerations.title')}
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('design_principles.retries.considerations.items.failure_types.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('design_principles.retries.considerations.items.failure_types.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('design_principles.retries.considerations.items.impact.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('design_principles.retries.considerations.items.impact.desc')}</p>
                </div>
              </motion.li>
            </ul>
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
          to="/principios-design/tolerancia-falhas/retries/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('design_principles.retries.cta_simulator')}
        </Link>
      </motion.div>
    </div>
  );
} 