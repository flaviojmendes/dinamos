import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Synchronization() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('design_principles.consistency_strategies.synchronization.title')}
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          {t('design_principles.consistency_strategies.synchronization.intro')}
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">{t('design_principles.consistency_strategies.synchronization.key_concept_label')}</strong>
          {t('design_principles.consistency_strategies.synchronization.key_concept_text')}
        </div>
      </motion.div>

      {/* Fundamentals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.consistency_strategies.synchronization.fundamentals.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">{t('design_principles.consistency_strategies.synchronization.fundamentals.basics_title')}</h3>
          <p className="text-zinc-300 mb-6">
            {t('design_principles.consistency_strategies.synchronization.fundamentals.basics_p')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">{t('design_principles.consistency_strategies.synchronization.fundamentals.mutual_exclusion')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.fundamentals.shared_resources')}</span>
                    <p className="text-zinc-400">{t('design_principles.consistency_strategies.synchronization.fundamentals.shared_resources_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.fundamentals.race_conditions')}</span>
                    <p className="text-zinc-400">{t('design_principles.consistency_strategies.synchronization.fundamentals.race_conditions_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">{t('design_principles.consistency_strategies.synchronization.fundamentals.coordination')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.fundamentals.consensus')}</span>
                    <p className="text-zinc-400">{t('design_principles.consistency_strategies.synchronization.fundamentals.consensus_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.fundamentals.ordering')}</span>
                    <p className="text-zinc-400">{t('design_principles.consistency_strategies.synchronization.fundamentals.ordering_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.consistency_strategies.synchronization.topics.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/estrategias-de-consistencia/sincronizacao/fundamentos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{t('design_principles.consistency_strategies.synchronization.topics.fundamentals_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.consistency_strategies.synchronization.topics.fundamentals_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.topics.badges.mutual_exclusion')}
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.topics.badges.race_conditions')}
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/deadlocks"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-400">{t('design_principles.consistency_strategies.synchronization.topics.deadlocks_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.consistency_strategies.synchronization.topics.deadlocks_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.topics.deadlocks_badges.prevention')}
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.topics.deadlocks_badges.detection')}
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/algoritmos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-green-400">{t('design_principles.consistency_strategies.synchronization.topics.algorithms_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.consistency_strategies.synchronization.topics.algorithms_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.topics.algorithms_badges.bakery')}
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.topics.algorithms_badges.token_ring')}
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.consistency_strategies.synchronization.best_practices.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">{t('design_principles.consistency_strategies.synchronization.best_practices.design_impl_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.best_practices.minimize_sync_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.consistency_strategies.synchronization.best_practices.minimize_sync_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.best_practices.granularity_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.consistency_strategies.synchronization.best_practices.granularity_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.best_practices.timeout_recovery_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.consistency_strategies.synchronization.best_practices.timeout_recovery_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">{t('design_principles.consistency_strategies.synchronization.best_practices.monitoring_debugging_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.best_practices.detailed_logging_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.consistency_strategies.synchronization.best_practices.detailed_logging_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.best_practices.performance_metrics_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.consistency_strategies.synchronization.best_practices.performance_metrics_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.consistency_strategies.synchronization.best_practices.deadlock_detection_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.consistency_strategies.synchronization.best_practices.deadlock_detection_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.consistency_strategies.synchronization.next_steps.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/estrategias-de-consistencia/sincronizacao/deadlocks"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-red-400">{t('design_principles.consistency_strategies.synchronization.next_steps.deadlocks_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.consistency_strategies.synchronization.next_steps.deadlocks_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.next_steps.deadlocks_badges.detection')}
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.next_steps.deadlocks_badges.prevention')}
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/algoritmos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{t('design_principles.consistency_strategies.synchronization.next_steps.algorithms_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.consistency_strategies.synchronization.next_steps.algorithms_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.next_steps.algorithms_badges.bakery')}
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                {t('design_principles.consistency_strategies.synchronization.next_steps.algorithms_badges.token_ring')}
              </span>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 