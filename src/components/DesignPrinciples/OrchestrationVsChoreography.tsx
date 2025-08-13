import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function OrchestrationVsChoreography() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          {t('design_principles.orchestration_vs_choreography.title')}
        </h1>
        <p className="text-xl text-zinc-300">
          {t('design_principles.orchestration_vs_choreography.intro')}
        </p>
      </div>

      {/* Overview */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.orchestration_vs_choreography.overview_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{t('design_principles.orchestration_vs_choreography.orchestration_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.orchestration_vs_choreography.orchestration_p')}
            </p>
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Orchestrator */}
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.orchestrator')}</text>

                {/* Services */}
                <rect x="40" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_a')}</text>

                <rect x="160" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_b')}</text>

                <rect x="280" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_c')}</text>

                {/* Lines */}
                <path d="M200 60 L80 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                <path d="M200 60 L200 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                <path d="M200 60 L320 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />

                <defs>
                  <marker id="arrowBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('design_principles.orchestration_vs_choreography.choreography_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.orchestration_vs_choreography.choreography_p')}
            </p>
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Services */}
                <rect x="40" y="80" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="105" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_a')}</text>

                <rect x="280" y="80" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="105" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_b')}</text>

                <rect x="160" y="20" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_c')}</text>

                <rect x="160" y="140" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="165" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_d')}</text>

                {/* Connections */}
                <path d="M120 100 L280 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                <path d="M200 60 L200 140" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                <path d="M280 100 L200 140" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                <path d="M120 100 L200 140" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />

                <defs>
                  <marker id="arrowPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#A855F7"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.orchestration_vs_choreography.comparison_title')}</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">{t('design_principles.orchestration_vs_choreography.orchestration_title')}</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
                {(t('design_principles.orchestration_vs_choreography.points_orchestration', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 400 80" className="w-full h-20">
                  <rect x="20" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                  <text x="60" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.start')}</text>
                  <rect x="160" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                  <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.process')}</text>
                  <rect x="300" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                  <text x="340" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.end')}</text>
                  <path d="M100 40 L160 40" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M240 40 L300 40" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <defs>
                    <marker id="arrowBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6"/>
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('design_principles.orchestration_vs_choreography.choreography_title')}</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
                {(t('design_principles.orchestration_vs_choreography.points_choreography', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 400 80" className="w-full h-20">
                  <circle cx="60" cy="40" r="25" fill="#A855F7" />
                  <text x="60" y="45" textAnchor="middle" fill="white" fontSize="14">1</text>
                  <circle cx="200" cy="40" r="25" fill="#A855F7" />
                  <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">2</text>
                  <circle cx="340" cy="40" r="25" fill="#A855F7" />
                  <text x="340" y="45" textAnchor="middle" fill="white" fontSize="14">3</text>
                  <path d="M85 40 L175 40" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M225 40 L315 40" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <defs>
                    <marker id="arrowPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A855F7"/>
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.orchestration_vs_choreography.examples_title')}</h2>
        <div className="space-y-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{t('design_principles.orchestration_vs_choreography.orchestration_title')}</h3>
            <div className="text-zinc-300 space-y-4">
              <p>
                <strong>{t('design_principles.orchestration_vs_choreography.examples.orchestration_order_processing')}:</strong> 
              </p>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 500 160" className="w-full h-40">
                  <rect x="200" y="20" width="100" height="40" rx="5" fill="#3B82F6" />
                  <text x="250" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.orchestrator')}</text>
                  <rect x="40" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="90" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.process')}</text>
                  <rect x="160" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="210" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_b')}</text>
                  <rect x="280" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="330" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.service_c')}</text>
                  <rect x="400" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="450" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.end')}</text>
                  <path d="M250 60 L90 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M250 60 L210 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M250 60 L330 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M250 60 L450 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('design_principles.orchestration_vs_choreography.choreography_title')}</h3>
            <div className="text-zinc-300 space-y-4">
              <p>
                <strong>{t('design_principles.orchestration_vs_choreography.examples.choreography_notification_system')}:</strong> 
              </p>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 500 160" className="w-full h-40">
                  <rect x="200" y="20" width="100" height="40" rx="5" fill="#A855F7" />
                  <text x="250" y="45" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.order_created')}</text>
                  <rect x="40" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="90" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.email')}</text>
                  <rect x="160" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="210" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.sms')}</text>
                  <rect x="280" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="330" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.analytics')}</text>
                  <rect x="400" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="450" y="125" textAnchor="middle" fill="white" fontSize="14">{t('design_principles.orchestration_vs_choreography.labels.logs')}</text>
                  <path d="M250 60 L90 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M250 60 L210 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M250 60 L330 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M250 60 L450 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.orchestration_vs_choreography.when_to_use_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{t('design_principles.orchestration_vs_choreography.use_orchestration_when')}</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              {(t('design_principles.orchestration_vs_choreography.use_orchestration_when_list', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('design_principles.orchestration_vs_choreography.use_choreography_when')}</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              {(t('design_principles.orchestration_vs_choreography.use_choreography_when_list', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 