import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Failover() {
  const { t } = useTranslation();
  const types = t('design_principles.scalability.failover.types', { returnObjects: true }) as string[];
  const components = t('design_principles.scalability.failover.components', { returnObjects: true }) as string[];
  const best = t('design_principles.scalability.failover.best', { returnObjects: true }) as string[];
  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-4">{t('design_principles.scalability.failover.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t('design_principles.scalability.failover.intro')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">{t('design_principles.scalability.failover.what_is_title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('design_principles.scalability.failover.what_is_p')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{t('design_principles.scalability.failover.types_title')}</h3>
              <div className="space-y-4">
                {types.map((li, idx) => (
                  <div key={idx}>
                    <h4 className="text-brand-600 dark:text-brand-400 font-medium mb-2">{li.split(':')[0]}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{li.split(':').slice(1).join(':').trim()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{t('design_principles.scalability.failover.components_title')}</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">
                {components.map((c, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{t('design_principles.scalability.failover.real_world_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('design_principles.scalability.failover.real_world_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t('design_principles.scalability.failover.best_title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {best.map((b, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-brand-600 dark:text-brand-400 mr-2">{idx + 1}.</span>
                  <p className="text-slate-600 dark:text-slate-300">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{t('design_principles.scalability.failover.explore_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('design_principles.scalability.failover.explore_p')}
            </p>
            <Link 
              to="/principios-design/escalabilidade/simulator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t('design_principles.scalability.failover.explore_cta')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 