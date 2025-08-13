import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ConsistencyStrategies() {
  const { t } = useTranslation();
  const coming = t('design_principles.consistency_strategies.index.coming_soon_items', { returnObjects: true }) as string[];
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          {t('design_principles.consistency_strategies.index.title')}
        </h1>
        <p className="text-xl text-zinc-300">
          {t('design_principles.consistency_strategies.index.subtitle')}
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <div className="flex gap-3">
          <div className="text-blue-400 mt-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-zinc-300">
            {t('design_principles.consistency_strategies.index.info')}
          </p>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Two Phase Commit */}
        <Link 
          to="/estrategias-de-consistencia/two-phase-commit"
          className="group bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {t('design_principles.consistency_strategies.index.cards.two_phase_commit_title')}
              </h2>
              <p className="text-zinc-400 mb-4">
                {t('design_principles.consistency_strategies.index.cards.two_phase_commit_desc')}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Transações</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">Atomicidade</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Consensus Strategy */}
        <Link 
          to="/estrategias-de-consistencia/consenso"
          className="group bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {t('design_principles.consistency_strategies.index.cards.consensus_title')}
              </h2>
              <p className="text-zinc-400 mb-4">
                {t('design_principles.consistency_strategies.index.cards.consensus_desc')}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">Consenso</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Acordo Distribuído</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Lamport Timestamps */}
        <Link 
          to="/estrategias-de-consistencia/lamport-timestamps"
          className="group bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {t('design_principles.consistency_strategies.index.cards.lamport_title')}
              </h2>
              <p className="text-zinc-400 mb-4">
                {t('design_principles.consistency_strategies.index.cards.lamport_desc')}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Ordenação</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">Causalidade</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 bg-zinc-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t('design_principles.consistency_strategies.index.coming_soon_title')}</h2>
        <p className="text-zinc-400 mb-4">
          {t('design_principles.consistency_strategies.index.coming_soon_p')}
        </p>
        <ul className="space-y-2">
          {coming.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 