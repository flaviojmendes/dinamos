import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Common/Typography';
import { useTranslation } from 'react-i18next';

const CAPTheorem: React.FC = () => {
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
            {t('menu.theoretical_foundations.cap_theorem.title')}
          </Typography>
          
          <Typography variant="p" className="text-xl mb-8 text-center text-gray-300">
            {t('menu.theoretical_foundations.cap_theorem.subtitle')}
          </Typography>

          {/* Introduction */}
          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-600 mb-12">
            <Typography variant="p" className="text-lg leading-relaxed text-gray-200">
              {t('menu.theoretical_foundations.cap_theorem.introduction')}
            </Typography>
          </div>

          {/* CAP Components Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <div className="text-2xl mb-4">🔗</div>
              <Typography variant="h3" className="mb-4 text-blue-400">
                {t('menu.theoretical_foundations.cap_theorem.consistency.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.cap_theorem.consistency.description')}
              </Typography>
              <Typography variant="p" className="text-sm text-gray-400">
                {t('menu.theoretical_foundations.cap_theorem.consistency.detailed_explanation')}
              </Typography>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <div className="text-2xl mb-4">⚡</div>
              <Typography variant="h3" className="mb-4 text-green-400">
                {t('menu.theoretical_foundations.cap_theorem.availability.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.cap_theorem.availability.description')}
              </Typography>
              <Typography variant="p" className="text-sm text-gray-400">
                {t('menu.theoretical_foundations.cap_theorem.availability.detailed_explanation')}
              </Typography>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <div className="text-2xl mb-4">🌐</div>
              <Typography variant="h3" className="mb-4 text-purple-400">
                {t('menu.theoretical_foundations.cap_theorem.partition_tolerance.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.cap_theorem.partition_tolerance.description')}
              </Typography>
              <Typography variant="p" className="text-sm text-gray-400">
                {t('menu.theoretical_foundations.cap_theorem.partition_tolerance.detailed_explanation')}
              </Typography>
            </div>
          </div>

          {/* Concrete Examples Section */}
          <div className="mb-12">
            <Typography variant="h2" className="mb-8 text-center">
              {t('menu.theoretical_foundations.cap_theorem.concrete_examples_title')}
            </Typography>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Consistency Examples */}
              <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
                <Typography variant="h3" className="mb-4 text-blue-400">
                  {t('menu.theoretical_foundations.cap_theorem.consistency_examples_title')}
                </Typography>
                <div className="space-y-3">
                  {(t('menu.theoretical_foundations.cap_theorem.consistency.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-zinc-800/30 p-3 rounded text-sm">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Examples */}
              <div className="bg-green-900/20 p-6 rounded-lg border border-green-700">
                <Typography variant="h3" className="mb-4 text-green-400">
                  {t('menu.theoretical_foundations.cap_theorem.availability_examples_title')}
                </Typography>
                <div className="space-y-3">
                  {(t('menu.theoretical_foundations.cap_theorem.availability.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-zinc-800/30 p-3 rounded text-sm">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partition Tolerance Examples */}
              <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-700">
                <Typography variant="h3" className="mb-4 text-purple-400">
                  {t('menu.theoretical_foundations.cap_theorem.partition_examples_title')}
                </Typography>
                <div className="space-y-3">
                  {(t('menu.theoretical_foundations.cap_theorem.partition_tolerance.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-zinc-800/30 p-3 rounded text-sm">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-600 mb-8">
            <Typography variant="h2" className="mb-6 text-center">
              {t('menu.theoretical_foundations.cap_theorem.theorem_statement')}
            </Typography>
            <Typography variant="p" className="text-xl text-center text-yellow-300 mb-6">
              {t('menu.theoretical_foundations.cap_theorem.theorem_text')}
            </Typography>
            <Typography variant="p" className="text-center text-gray-300 italic">
              {t('menu.theoretical_foundations.cap_theorem.real_world_note')}
            </Typography>
          </div>

          {/* System Types with Enhanced Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-red-900/20 p-6 rounded-lg border border-red-700">
              <Typography variant="h3" className="mb-4 text-red-400">
                {t('menu.theoretical_foundations.cap_theorem.cp_systems.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.cap_theorem.cp_systems.description')}
              </Typography>
              
              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-red-300">{t('menu.theoretical_foundations.cap_theorem.characteristics_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.cp_systems.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                    <li key={index} className="text-sm text-gray-300">{char}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-red-300">{t('menu.theoretical_foundations.cap_theorem.examples_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.cp_systems.examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <li key={index} className="text-sm text-gray-400">{example}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-red-300">{t('menu.theoretical_foundations.cap_theorem.use_cases_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.cp_systems.use_cases', { returnObjects: true }) as string[]).map((useCase, index) => (
                    <li key={index} className="text-sm text-gray-400">{useCase}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-green-900/20 p-6 rounded-lg border border-green-700">
              <Typography variant="h3" className="mb-4 text-green-400">
                {t('menu.theoretical_foundations.cap_theorem.ap_systems.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.cap_theorem.ap_systems.description')}
              </Typography>
              
              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-green-300">{t('menu.theoretical_foundations.cap_theorem.characteristics_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.ap_systems.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                    <li key={index} className="text-sm text-gray-300">{char}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-green-300">{t('menu.theoretical_foundations.cap_theorem.examples_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.ap_systems.examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <li key={index} className="text-sm text-gray-400">{example}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-green-300">{t('menu.theoretical_foundations.cap_theorem.use_cases_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.ap_systems.use_cases', { returnObjects: true }) as string[]).map((useCase, index) => (
                    <li key={index} className="text-sm text-gray-400">{useCase}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
              <Typography variant="h3" className="mb-4 text-blue-400">
                {t('menu.theoretical_foundations.cap_theorem.ca_systems.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.cap_theorem.ca_systems.description')}
              </Typography>
              
              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-blue-300">{t('menu.theoretical_foundations.cap_theorem.characteristics_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.ca_systems.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                    <li key={index} className="text-sm text-gray-300">{char}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-blue-300">{t('menu.theoretical_foundations.cap_theorem.examples_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.ca_systems.examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <li key={index} className="text-sm text-gray-400">{example}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <Typography variant="h4" className="text-sm font-semibold mb-2 text-blue-300">{t('menu.theoretical_foundations.cap_theorem.limitations_label')}</Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.cap_theorem.ca_systems.limitations', { returnObjects: true }) as string[]).map((limitation, index) => (
                    <li key={index} className="text-sm text-gray-400">{limitation}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-900/20 p-3 rounded">
                <Typography variant="p" className="text-xs text-yellow-300">
                  {t('menu.theoretical_foundations.cap_theorem.ca_systems.note')}
                </Typography>
              </div>
            </div>
          </div>

          {/* Practical Considerations */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-600">
              <Typography variant="h3" className="mb-4 text-yellow-400">
                {t('menu.theoretical_foundations.cap_theorem.practical_considerations.title')}
              </Typography>
              <ul className="space-y-2">
                {(t('menu.theoretical_foundations.cap_theorem.practical_considerations.points', { returnObjects: true }) as string[]).map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <Typography variant="p" className="text-gray-300 text-sm">
                      {point}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-600">
              <Typography variant="h3" className="mb-4 text-purple-400">
                {t('menu.theoretical_foundations.cap_theorem.decision_framework.title')}
              </Typography>
              <ul className="space-y-2">
                {(t('menu.theoretical_foundations.cap_theorem.decision_framework.questions', { returnObjects: true }) as string[]).map((question, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">❓</span>
                    <Typography variant="p" className="text-gray-300 text-sm">
                      {question}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CAPTheorem;
