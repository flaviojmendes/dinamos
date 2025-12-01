import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AttackSimulator from './AttackSimulator';

export default function AttackSimulatorPage() {
  const { t } = useTranslation();
  const base = 'attack_simulator';

  const howToUseSteps = t(`${base}.how_to_use_steps`, { returnObjects: true }) as string[];
  const simulatorElements = t(`${base}.simulator_elements`, { returnObjects: true }) as string[];

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            to="/seguranca/ataques"
            className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t(`${base}.back_to_attacks`)}
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        {/* Simulator */}
        <AttackSimulator />

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t(`${base}.how_to_use_title`)}</h2>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400">
              {howToUseSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-white font-medium">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t(`${base}.simulator_elements_title`)}</h2>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>{simulatorElements[0]}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <span>{simulatorElements[1]}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span>{simulatorElements[2]}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <span>{simulatorElements[3]}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 