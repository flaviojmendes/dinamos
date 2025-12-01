import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Common/Typography';
import { useTranslation } from 'react-i18next';

const ConsistencyModels: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h1" className="mb-8 text-center">
            {t('menu.theoretical_foundations.consistency_models.title')}
          </Typography>
          
          <Typography variant="p" className="text-xl mb-8 text-center text-gray-300">
            {t('menu.theoretical_foundations.consistency_models.subtitle')}
          </Typography>

          {/* Introduction */}
          <div className="bg-slate-100 dark:bg-slate-800/30 p-8 rounded-lg border border-zinc-600 mb-12">
            <Typography variant="p" className="text-lg leading-relaxed text-gray-200">
              {t('menu.theoretical_foundations.consistency_models.introduction')}
            </Typography>
          </div>

          <div className="space-y-8">
            {/* Strong Consistency Section */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-lg border border-slate-300 dark:border-slate-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🔒</div>
                <Typography variant="h2" className="text-green-400">
                  {t('menu.theoretical_foundations.consistency_models.strong_consistency.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.consistency_models.strong_consistency.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.consistency_models.strong_consistency.detailed_explanation')}
              </Typography>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Characteristics */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.consistency_models.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.consistency_models.strong_consistency.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.consistency_models.use_cases_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.consistency_models.strong_consistency.use_cases', { returnObjects: true }) as string[]).map((useCase, index) => (
                      <li key={index} className="text-sm text-gray-300">{useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                  {t('menu.theoretical_foundations.consistency_models.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.consistency_models.strong_consistency.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-green-900/20 p-3 rounded text-sm border border-green-700/30">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementations */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                  {t('menu.theoretical_foundations.consistency_models.implementations_label')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {(t('menu.theoretical_foundations.consistency_models.strong_consistency.implementations', { returnObjects: true }) as string[]).map((impl, index) => (
                    <span key={index} className="bg-green-700/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-600">
                      {impl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                <Typography variant="p" className="text-sm text-yellow-300">
                  {t('menu.theoretical_foundations.consistency_models.strong_consistency.tradeoffs')}
                </Typography>
              </div>
            </div>

            {/* Eventual Consistency Section */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-lg border border-slate-300 dark:border-slate-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">⏱️</div>
                <Typography variant="h2" className="text-yellow-400">
                  {t('menu.theoretical_foundations.consistency_models.eventual_consistency.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.consistency_models.eventual_consistency.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.consistency_models.eventual_consistency.detailed_explanation')}
              </Typography>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Characteristics */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.consistency_models.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.consistency_models.eventual_consistency.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.consistency_models.use_cases_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.consistency_models.eventual_consistency.use_cases', { returnObjects: true }) as string[]).map((useCase, index) => (
                      <li key={index} className="text-sm text-gray-300">{useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                  {t('menu.theoretical_foundations.consistency_models.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.consistency_models.eventual_consistency.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-yellow-900/20 p-3 rounded text-sm border border-yellow-700/30">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementations */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                  {t('menu.theoretical_foundations.consistency_models.implementations_label')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {(t('menu.theoretical_foundations.consistency_models.eventual_consistency.implementations', { returnObjects: true }) as string[]).map((impl, index) => (
                    <span key={index} className="bg-yellow-700/20 text-yellow-300 px-3 py-1 rounded-full text-xs border border-yellow-600">
                      {impl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Convergence Strategies */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                  {t('menu.theoretical_foundations.consistency_models.convergence_label')}
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.consistency_models.eventual_consistency.convergence_strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                    <li key={index} className="text-sm text-gray-300">{strategy}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                <Typography variant="p" className="text-sm text-yellow-300">
                  {t('menu.theoretical_foundations.consistency_models.eventual_consistency.tradeoffs')}
                </Typography>
              </div>
            </div>

            {/* Weak Consistency Section */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-lg border border-slate-300 dark:border-slate-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🏃‍♂️</div>
                <Typography variant="h2" className="text-brand-600 dark:text-brand-400">
                  {t('menu.theoretical_foundations.consistency_models.weak_consistency.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.consistency_models.weak_consistency.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.consistency_models.weak_consistency.detailed_explanation')}
              </Typography>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Characteristics */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                    {t('menu.theoretical_foundations.consistency_models.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.consistency_models.weak_consistency.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                    {t('menu.theoretical_foundations.consistency_models.use_cases_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.consistency_models.weak_consistency.use_cases', { returnObjects: true }) as string[]).map((useCase, index) => (
                      <li key={index} className="text-sm text-gray-300">{useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                  {t('menu.theoretical_foundations.consistency_models.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.consistency_models.weak_consistency.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-blue-900/20 p-3 rounded text-sm border border-blue-700/30">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implementations */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                  {t('menu.theoretical_foundations.consistency_models.implementations_label')}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {(t('menu.theoretical_foundations.consistency_models.weak_consistency.implementations', { returnObjects: true }) as string[]).map((impl, index) => (
                    <span key={index} className="bg-blue-700/20 text-brand-600 dark:text-brand-300 px-3 py-1 rounded-full text-xs border border-blue-600">
                      {impl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Considerations */}
              <div className="mt-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                  {t('menu.theoretical_foundations.consistency_models.considerations_label')}
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.consistency_models.weak_consistency.considerations', { returnObjects: true }) as string[]).map((consideration, index) => (
                    <li key={index} className="text-sm text-gray-300">{consideration}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                <Typography variant="p" className="text-sm text-yellow-300">
                  {t('menu.theoretical_foundations.consistency_models.weak_consistency.tradeoffs')}
                </Typography>
              </div>
            </div>

            {/* Decision Matrix Section */}
            <div className="bg-purple-900/20 p-8 rounded-lg border border-purple-700">
              <Typography variant="h2" className="mb-6 text-center text-purple-400">
                {t('menu.theoretical_foundations.consistency_models.decision_matrix.title')}
              </Typography>
              <div className="mb-6">
                <ul className="list-disc list-inside space-y-2">
                  {(t('menu.theoretical_foundations.consistency_models.decision_matrix.factors', { returnObjects: true }) as string[]).map((factor, index) => (
                    <li key={index} className="text-gray-300">{factor}</li>
                  ))}
                </ul>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Typography variant="h3" className="mb-4 text-green-400">
                    {t('menu.theoretical_foundations.consistency_models.strong_consistency.title')}
                  </Typography>
                  <Typography variant="p" className="text-sm">
                    {t('menu.theoretical_foundations.consistency_models.use_cases.strong')}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="h3" className="mb-4 text-yellow-400">
                    {t('menu.theoretical_foundations.consistency_models.eventual_consistency.title')}
                  </Typography>
                  <Typography variant="p" className="text-sm">
                    {t('menu.theoretical_foundations.consistency_models.use_cases.eventual')}
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="h3" className="mb-4 text-brand-600 dark:text-brand-400">
                    {t('menu.theoretical_foundations.consistency_models.weak_consistency.title')}
                  </Typography>
                  <Typography variant="p" className="text-sm">
                    {t('menu.theoretical_foundations.consistency_models.use_cases.weak')}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Practical Guidelines Section */}
            <div className="bg-indigo-900/20 p-8 rounded-lg border border-indigo-700">
              <Typography variant="h2" className="mb-6 text-center text-indigo-400">
                {t('menu.theoretical_foundations.consistency_models.practical_guidelines.title')}
              </Typography>
              <ul className="list-disc list-inside space-y-3">
                {(t('menu.theoretical_foundations.consistency_models.practical_guidelines.tips', { returnObjects: true }) as string[]).map((tip, index) => (
                  <li key={index} className="text-gray-300">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsistencyModels;
