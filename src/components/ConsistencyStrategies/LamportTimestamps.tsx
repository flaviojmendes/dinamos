import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LamportTimestamps() {
  const { t } = useTranslation();
  const basicRules = t('design_principles.consistency_strategies.lamport_timestamps.basic_rules', { returnObjects: true }) as string[];
  const properties = t('design_principles.consistency_strategies.lamport_timestamps.properties', { returnObjects: true }) as string[];
  const useCases = t('design_principles.consistency_strategies.lamport_timestamps.use_cases', { returnObjects: true }) as string[];
  const limitations = t('design_principles.consistency_strategies.lamport_timestamps.limitations', { returnObjects: true }) as string[];
  const chatPoints = t('design_principles.consistency_strategies.lamport_timestamps.chat_points', { returnObjects: true }) as string[];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400">
          {t('design_principles.consistency_strategies.lamport_timestamps.title')}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {t('design_principles.consistency_strategies.lamport_timestamps.intro')}
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.consistency_strategies.lamport_timestamps.overview_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.problem_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.consistency_strategies.lamport_timestamps.problem_p1')}
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.solution_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.consistency_strategies.lamport_timestamps.solution_p1')}
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.consistency_strategies.lamport_timestamps.how_title')}</h2>
        <div className="space-y-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.basic_rules_title')}</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {basicRules.map((item, idx) => (
                <li key={`rule-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.properties_title')}</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {properties.map((item, idx) => (
                <li key={`prop-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.consistency_strategies.lamport_timestamps.applications_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.use_cases_title')}</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {useCases.map((item, idx) => (
                <li key={`use-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.limitations_title')}</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {limitations.map((item, idx) => (
                <li key={`lim-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.consistency_strategies.lamport_timestamps.example_title')}</h2>
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-4">{t('design_principles.consistency_strategies.lamport_timestamps.chat_system_title')}</h3>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.consistency_strategies.lamport_timestamps.chat_intro')}
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {chatPoints.map((item, idx) => (
                <li key={`chat-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Link to Simulator */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('design_principles.consistency_strategies.lamport_timestamps.cta_title')}</h2>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.consistency_strategies.lamport_timestamps.cta_p')}
            </p>
          </div>
          <Link
            to="simulador"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('design_principles.consistency_strategies.lamport_timestamps.cta_button')}
          </Link>
        </div>
      </div>
    </div>
  );
} 