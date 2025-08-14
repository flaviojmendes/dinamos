import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Deadlocks() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('design_principles.deadlocks.title')}
        </h1>

        <p className="text-lg text-zinc-300 mb-8">
          {t('design_principles.deadlocks.intro')}
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <strong className="block mb-2 text-blue-300">{t('design_principles.deadlocks.key_concept_label')}</strong>
          <p className="text-blue-300">
            {t('design_principles.deadlocks.key_concept_text')}
          </p>
        </div>

        {/* Conditions Section */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.deadlocks.conditions.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('design_principles.deadlocks.conditions.items.mutual_exclusion_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.conditions.items.mutual_exclusion_desc')}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">{t('design_principles.deadlocks.conditions.items.hold_and_wait_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.conditions.items.hold_and_wait_desc')}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('design_principles.deadlocks.conditions.items.no_preemption_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.conditions.items.no_preemption_desc')}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">{t('design_principles.deadlocks.conditions.items.circular_wait_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.conditions.items.circular_wait_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Prevention Section */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.deadlocks.prevention.title')}</h2>
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('design_principles.deadlocks.prevention.denial_title')}</h3>
              <p className="text-zinc-300 mb-3">
                {t('design_principles.deadlocks.prevention.denial_desc')}
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                {(t('design_principles.deadlocks.prevention.denial_list', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">{t('design_principles.deadlocks.prevention.avoidance_title')}</h3>
              <p className="text-zinc-300 mb-3">
                {t('design_principles.deadlocks.prevention.avoidance_desc')}
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                {(t('design_principles.deadlocks.prevention.avoidance_list', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detection Section */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.deadlocks.detection.title')}</h2>
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">{t('design_principles.deadlocks.detection.centralized_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.detection.centralized_desc')}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">{t('design_principles.deadlocks.detection.distributed_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.detection.distributed_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.deadlocks.next_steps.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/estrategias-de-consistencia/sincronizacao/algoritmos"
              className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-400 group-hover:text-blue-300">
                {t('design_principles.deadlocks.next_steps.algorithms_title')}
              </h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.next_steps.algorithms_desc')}
              </p>
            </Link>
            <Link
              to="/estrategias-de-consistencia/sincronizacao/simulador"
              className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-purple-400 group-hover:text-purple-300">
                {t('design_principles.deadlocks.next_steps.simulator_title')}
              </h3>
              <p className="text-zinc-300">
                {t('design_principles.deadlocks.next_steps.simulator_desc')}
              </p>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 