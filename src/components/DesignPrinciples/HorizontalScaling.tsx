import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Panel } from '../tactical';

export default function HorizontalScaling() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="label-mono text-signal-cyan mb-2">
            [ {t('design_principles.scalability.horizontal.title')} ]
          </div>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim"
          >
            {t('design_principles.scalability.horizontal.intro')}
          </motion.p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Panel title={t('design_principles.scalability.horizontal.how_title')} accent="cyan">
            <p className="font-mono text-sm text-slate-600 dark:text-tactical-dim mb-4">
              {t('design_principles.scalability.horizontal.how_p')}
            </p>
            <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
              <h3 className="label-mono mb-2">{t('design_principles.scalability.horizontal.example_title')}</h3>
              <p className="font-mono text-sm text-slate-500 dark:text-tactical-dim">
                {t('design_principles.scalability.horizontal.example_p')}
              </p>
            </div>
          </Panel>

          <Panel title={t('design_principles.scalability.horizontal.advantages_title')} accent="green">
            <ul className="space-y-4">
              {(t('design_principles.scalability.horizontal.advantages', { returnObjects: true }) as string[]).map((li, idx) => (
                <motion.li 
                  key={idx}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                >
                  <svg className="w-4 h-4 text-signal-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-tactical-text">{li.split(':')[0]}</h3>
                    <p className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{li.split(':').slice(1).join(':').trim()}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Panel title={t('design_principles.scalability.horizontal.considerations_title')} accent="amber">
            <div className="space-y-3">
              {(t('design_principles.scalability.horizontal.considerations', { returnObjects: true }) as string[]).map((li, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
                  <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-tactical-text mb-2">{li.split(':')[0]}</h3>
                  <p className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{li.split(':').slice(1).join(':').trim()}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title={t('design_principles.scalability.horizontal.best_practices_title')} accent="cyan">
            <div className="space-y-3">
              {(t('design_principles.scalability.horizontal.best_practices', { returnObjects: true }) as string[]).map((li, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
                  <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-tactical-text mb-2">{li.split(':')[0]}</h3>
                  <p className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{li.split(':').slice(1).join(':').trim()}</p>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="flex justify-center"
      >
        <Link
          to="/principios-design/escalabilidade/simulator"
          className="inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wider font-medium transition-colors px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 border border-transparent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('design_principles.scalability.horizontal.sim_cta')}
        </Link>
      </motion.div>
    </div>
  );
}
