import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Common/Typography';
import { useTranslation } from 'react-i18next';

const DistributedChallenges: React.FC = () => {
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
            {t('menu.theoretical_foundations.distributed_challenges.title')}
          </Typography>
          
          <Typography variant="p" className="text-xl mb-8 text-center text-gray-300">
            {t('menu.theoretical_foundations.distributed_challenges.subtitle')}
          </Typography>

          {/* Introduction */}
          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-600 mb-12">
            <Typography variant="p" className="text-lg leading-relaxed text-gray-200">
              {t('menu.theoretical_foundations.distributed_challenges.introduction')}
            </Typography>
          </div>

          <div className="space-y-12 mb-12">
            {/* Network Partitions Section */}
            <div className="bg-red-900/20 p-8 rounded-lg border border-red-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🌐</div>
                <Typography variant="h2" className="text-red-400">
                  {t('menu.theoretical_foundations.distributed_challenges.network_partitions.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.distributed_challenges.network_partitions.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.distributed_challenges.network_partitions.detailed_explanation')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Characteristics */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-red-300">
                    {t('menu.theoretical_foundations.distributed_challenges.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.network_partitions.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Common Causes */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-red-300">
                    {t('menu.theoretical_foundations.distributed_challenges.causes_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.network_partitions.causes', { returnObjects: true }) as string[]).map((cause, index) => (
                      <li key={index} className="text-sm text-gray-300">{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-red-300">
                  {t('menu.theoretical_foundations.distributed_challenges.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.distributed_challenges.network_partitions.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-red-900/30 p-3 rounded text-sm border border-red-700/50">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Detection Strategies */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-red-300">
                    {t('menu.theoretical_foundations.distributed_challenges.detection_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.network_partitions.detection_strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                      <li key={index} className="text-sm text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </div>

                {/* Mitigation Approaches */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-red-300">
                    {t('menu.theoretical_foundations.distributed_challenges.mitigation_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.network_partitions.mitigation_approaches', { returnObjects: true }) as string[]).map((approach, index) => (
                      <li key={index} className="text-sm text-gray-300">{approach}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Clock Synchronization Section */}
            <div className="bg-yellow-900/20 p-8 rounded-lg border border-yellow-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">⏰</div>
                <Typography variant="h2" className="text-yellow-400">
                  {t('menu.theoretical_foundations.distributed_challenges.clock_sync.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.distributed_challenges.clock_sync.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.distributed_challenges.clock_sync.detailed_explanation')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Characteristics */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.distributed_challenges.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.clock_sync.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Problems Caused */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.distributed_challenges.problems_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.clock_sync.problems_caused', { returnObjects: true }) as string[]).map((problem, index) => (
                      <li key={index} className="text-sm text-gray-300">{problem}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                  {t('menu.theoretical_foundations.distributed_challenges.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.distributed_challenges.clock_sync.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-yellow-900/30 p-3 rounded text-sm border border-yellow-700/50">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Sync Approaches */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.distributed_challenges.sync_approaches_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.clock_sync.sync_approaches', { returnObjects: true }) as string[]).map((approach, index) => (
                      <li key={index} className="text-sm text-gray-300">{approach}</li>
                    ))}
                  </ul>
                </div>

                {/* Logical Alternatives */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.distributed_challenges.logical_alternatives_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.clock_sync.logical_alternatives', { returnObjects: true }) as string[]).map((alternative, index) => (
                      <li key={index} className="text-sm text-gray-300">{alternative}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Partial Failures Section */}
            <div className="bg-blue-900/20 p-8 rounded-lg border border-blue-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">💥</div>
                <Typography variant="h2" className="text-blue-400">
                  {t('menu.theoretical_foundations.distributed_challenges.partial_failures.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.distributed_challenges.partial_failures.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.distributed_challenges.partial_failures.detailed_explanation')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Characteristics */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-blue-300">
                    {t('menu.theoretical_foundations.distributed_challenges.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.partial_failures.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Failure Types */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-blue-300">
                    {t('menu.theoretical_foundations.distributed_challenges.failure_types_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.partial_failures.failure_types', { returnObjects: true }) as string[]).map((type, index) => (
                      <li key={index} className="text-sm text-gray-300">{type}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-blue-300">
                  {t('menu.theoretical_foundations.distributed_challenges.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.distributed_challenges.partial_failures.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-blue-900/30 p-3 rounded text-sm border border-blue-700/50">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Detection Challenges */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-blue-300">
                    {t('menu.theoretical_foundations.distributed_challenges.detection_challenges_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.partial_failures.detection_challenges', { returnObjects: true }) as string[]).map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-300">{challenge}</li>
                    ))}
                  </ul>
                </div>

                {/* Handling Strategies */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-blue-300">
                    {t('menu.theoretical_foundations.distributed_challenges.handling_strategies_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.partial_failures.handling_strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                      <li key={index} className="text-sm text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Consensus Section */}
            <div className="bg-purple-900/20 p-8 rounded-lg border border-purple-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🔄</div>
                <Typography variant="h2" className="text-purple-400">
                  {t('menu.theoretical_foundations.distributed_challenges.consensus.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.distributed_challenges.consensus.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.distributed_challenges.consensus.detailed_explanation')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Characteristics */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                    {t('menu.theoretical_foundations.distributed_challenges.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.consensus.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Problem Variants */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                    {t('menu.theoretical_foundations.distributed_challenges.problem_variants_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.consensus.problem_variants', { returnObjects: true }) as string[]).map((variant, index) => (
                      <li key={index} className="text-sm text-gray-300">{variant}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                  {t('menu.theoretical_foundations.distributed_challenges.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.distributed_challenges.consensus.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-purple-900/30 p-3 rounded text-sm border border-purple-700/50">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Famous Algorithms */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                    {t('menu.theoretical_foundations.distributed_challenges.algorithms_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.consensus.famous_algorithms', { returnObjects: true }) as string[]).map((algorithm, index) => (
                      <li key={index} className="text-sm text-gray-300">{algorithm}</li>
                    ))}
                  </ul>
                </div>

                {/* Real-World Usage */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                    {t('menu.theoretical_foundations.distributed_challenges.usage_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.consensus.real_world_usage', { returnObjects: true }) as string[]).map((usage, index) => (
                      <li key={index} className="text-sm text-gray-300">{usage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* State Management Section */}
            <div className="bg-green-900/20 p-8 rounded-lg border border-green-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">📊</div>
                <Typography variant="h2" className="text-green-400">
                  {t('menu.theoretical_foundations.distributed_challenges.state_management.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.distributed_challenges.state_management.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.distributed_challenges.state_management.detailed_explanation')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Characteristics */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.distributed_challenges.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.state_management.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Consistency Challenges */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.distributed_challenges.consistency_challenges_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.state_management.consistency_challenges', { returnObjects: true }) as string[]).map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-300">{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                  {t('menu.theoretical_foundations.distributed_challenges.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.distributed_challenges.state_management.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-green-900/30 p-3 rounded text-sm border border-green-700/50">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Concurrency Issues */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.distributed_challenges.concurrency_issues_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.state_management.concurrency_issues', { returnObjects: true }) as string[]).map((issue, index) => (
                      <li key={index} className="text-sm text-gray-300">{issue}</li>
                    ))}
                  </ul>
                </div>

                {/* Architectural Patterns */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.distributed_challenges.patterns_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.state_management.architectural_patterns', { returnObjects: true }) as string[]).map((pattern, index) => (
                      <li key={index} className="text-sm text-gray-300">{pattern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Race Conditions Section */}
            <div className="bg-orange-900/20 p-8 rounded-lg border border-orange-700">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-4">🚦</div>
                <Typography variant="h2" className="text-orange-400">
                  {t('menu.theoretical_foundations.distributed_challenges.race_conditions.title')}
                </Typography>
              </div>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.distributed_challenges.race_conditions.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.distributed_challenges.race_conditions.detailed_explanation')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Characteristics */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                    {t('menu.theoretical_foundations.distributed_challenges.characteristics_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.race_conditions.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                      <li key={index} className="text-sm text-gray-300">{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Common Scenarios */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                    {t('menu.theoretical_foundations.distributed_challenges.scenarios_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.race_conditions.common_scenarios', { returnObjects: true }) as string[]).map((scenario, index) => (
                      <li key={index} className="text-sm text-gray-300">{scenario}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concrete Examples */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                  {t('menu.theoretical_foundations.distributed_challenges.examples_label')}
                </Typography>
                <div className="grid md:grid-cols-2 gap-4">
                  {(t('menu.theoretical_foundations.distributed_challenges.race_conditions.concrete_examples', { returnObjects: true }) as string[]).map((example, index) => (
                    <div key={index} className="bg-orange-900/30 p-3 rounded text-sm border border-orange-700/50">
                      <Typography variant="p" className="text-gray-300">
                        {example}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Distributed Complications */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                    {t('menu.theoretical_foundations.distributed_challenges.complications_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.race_conditions.distributed_complications', { returnObjects: true }) as string[]).map((complication, index) => (
                      <li key={index} className="text-sm text-gray-300">{complication}</li>
                    ))}
                  </ul>
                </div>

                {/* Prevention Techniques */}
                <div className="bg-zinc-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                    {t('menu.theoretical_foundations.distributed_challenges.techniques_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.distributed_challenges.race_conditions.prevention_techniques', { returnObjects: true }) as string[]).map((technique, index) => (
                      <li key={index} className="text-sm text-gray-300">{technique}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Fallacies Section */}
          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-600 mb-8">
            <Typography variant="h2" className="mb-4 text-center">
              {t('menu.theoretical_foundations.distributed_challenges.fallacies_title')}
            </Typography>
            <Typography variant="p" className="text-center mb-6 text-gray-300">
              {t('menu.theoretical_foundations.distributed_challenges.fallacies_explanation')}
            </Typography>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Typography variant="p" className="mb-2">
                  1. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f1')}
                </Typography>
                <Typography variant="p" className="mb-2">
                  2. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f2')}
                </Typography>
                <Typography variant="p" className="mb-2">
                  3. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f3')}
                </Typography>
                <Typography variant="p" className="mb-2">
                  4. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f4')}
                </Typography>
              </div>
              <div>
                <Typography variant="p" className="mb-2">
                  5. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f5')}
                </Typography>
                <Typography variant="p" className="mb-2">
                  6. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f6')}
                </Typography>
                <Typography variant="p" className="mb-2">
                  7. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f7')}
                </Typography>
                <Typography variant="p" className="mb-2">
                  8. {t('menu.theoretical_foundations.distributed_challenges.fallacies.f8')}
                </Typography>
              </div>
            </div>
            <Typography variant="p" className="text-center text-yellow-300">
              {t('menu.theoretical_foundations.distributed_challenges.fallacies_warning')}
            </Typography>
          </div>

          {/* Mitigation Strategies Section */}
          <div className="bg-indigo-900/20 p-8 rounded-lg border border-indigo-700">
            <Typography variant="h2" className="mb-6 text-center text-indigo-400">
              {t('menu.theoretical_foundations.distributed_challenges.mitigation_strategies.title')}
            </Typography>
            <ul className="list-disc list-inside space-y-3 max-w-4xl mx-auto">
              {(t('menu.theoretical_foundations.distributed_challenges.mitigation_strategies.strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                <li key={index} className="text-gray-300">{strategy}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DistributedChallenges;