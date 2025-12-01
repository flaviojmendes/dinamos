import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TwoPhaseCommit() {
  const { t } = useTranslation();
  const advantages = t('design_principles.two_phase_commit.advantages_list', { returnObjects: true }) as string[];
  const limitations = t('design_principles.two_phase_commit.limitations_list', { returnObjects: true }) as string[];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400">
          {t('design_principles.two_phase_commit.title')}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {t('design_principles.two_phase_commit.intro')}
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.two_phase_commit.overview_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{t('design_principles.two_phase_commit.phase1_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('design_principles.two_phase_commit.phase1_p')}
            </p>
            {/* Diagrama de Fase 1 */}
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Coordenador */}
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.coordinator')}</text>
                
                {/* Participantes */}
                <rect x="40" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.participant', { n: 1 })}</text>
                
                <rect x="160" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.participant', { n: 2 })}</text>
                
                <rect x="280" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.participant', { n: 3 })}</text>
                
                {/* Linhas de Prepare */}
                <path d="M200 60 L80 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                <path d="M200 60 L200 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                <path d="M200 60 L320 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                
                {/* Definição das setas */}
                <defs>
                  <marker
                    id="arrowBlue"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">{t('design_principles.two_phase_commit.phase2_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t('design_principles.two_phase_commit.phase2_p')}
            </p>
            {/* Diagrama de Fase 2 */}
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Coordenador */}
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.coordinator')}</text>
                
                {/* Participantes */}
                <rect x="40" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.participant', { n: 1 })}</text>
                
                <rect x="160" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.participant', { n: 2 })}</text>
                
                <rect x="280" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.two_phase_commit.labels.participant', { n: 3 })}</text>
                
                {/* Linhas de Commit */}
                <path d="M200 60 L80 100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                <path d="M200 60 L200 100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                <path d="M200 60 L320 100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                
                {/* Definição das setas */}
                <defs>
                  <marker
                    id="arrowGreen"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.two_phase_commit.features_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{t('design_principles.two_phase_commit.advantages_title')}</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {advantages.map((item, idx) => (
                <li key={`adv-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">{t('design_principles.two_phase_commit.limitations_title')}</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
              {limitations.map((item, idx) => (
                <li key={`lim-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Casos de Uso */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('design_principles.two_phase_commit.use_cases_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-2">{t('design_principles.two_phase_commit.banking_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.two_phase_commit.banking_p')}
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('design_principles.two_phase_commit.ecommerce_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.two_phase_commit.ecommerce_p')}
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">{t('design_principles.two_phase_commit.reservations_title')}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.two_phase_commit.reservations_p')}
            </p>
          </div>
        </div>
      </div>

      {/* Link para o Simulador */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t('design_principles.two_phase_commit.cta_title')}</h2>
            <p className="text-slate-600 dark:text-slate-300">
              {t('design_principles.two_phase_commit.cta_p')}
            </p>
          </div>
          <Link
            to="simulador"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('design_principles.two_phase_commit.cta_button')}
          </Link>
        </div>
      </div>
    </div>
  );
}
