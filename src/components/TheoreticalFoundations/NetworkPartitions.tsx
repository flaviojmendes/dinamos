import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Common/Typography';
import { useTranslation } from 'react-i18next';

const NetworkPartitions: React.FC = () => {
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
            {t('menu.theoretical_foundations.network_partitions.title')}
          </Typography>
          
          <Typography variant="p" className="text-xl mb-8 text-center text-gray-300">
            {t('menu.theoretical_foundations.network_partitions.subtitle')}
          </Typography>

          {/* Introduction */}
          <div className="bg-slate-100 dark:bg-slate-800/30 p-8 rounded-lg border border-zinc-600 mb-12">
            <Typography variant="p" className="text-lg leading-relaxed text-gray-200">
              {t('menu.theoretical_foundations.network_partitions.introduction')}
            </Typography>
          </div>

          <div className="space-y-12 mb-12">
            {/* What is a Network Partition Section */}
            <div className="bg-red-900/20 p-8 rounded-lg border border-red-700">
              <Typography variant="h2" className="mb-6 text-red-400">
                {t('menu.theoretical_foundations.network_partitions.what_is.title')}
              </Typography>
              <Typography variant="p" className="mb-4">
                {t('menu.theoretical_foundations.network_partitions.what_is.description')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.network_partitions.what_is.detailed_explanation')}
              </Typography>

              {/* Characteristics */}
              <div className="mb-6">
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-red-300">
                  {t('menu.theoretical_foundations.network_partitions.characteristics_label')}
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.network_partitions.what_is.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                    <li key={index} className="text-sm text-gray-300">{char}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                <Typography variant="p" className="text-sm text-yellow-300">
                  {t('menu.theoretical_foundations.network_partitions.what_is.note')}
                </Typography>
              </div>
            </div>

            {/* Causes Section */}
            <div className="bg-yellow-900/20 p-8 rounded-lg border border-yellow-700">
              <Typography variant="h2" className="mb-6 text-yellow-400">
                {t('menu.theoretical_foundations.network_partitions.causes.title')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.network_partitions.causes.description')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Common Causes */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    Common Causes:
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.causes.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Causes */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-yellow-300">
                    {t('menu.theoretical_foundations.network_partitions.causes_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.causes.detailed_causes', { returnObjects: true }) as string[]).map((cause, index) => (
                      <li key={index} className="text-sm text-gray-300">{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Failure Types Section */}
            <div className="bg-blue-900/20 p-8 rounded-lg border border-blue-700">
              <Typography variant="h2" className="mb-6 text-brand-600 dark:text-brand-400">
                {t('menu.theoretical_foundations.network_partitions.failure_types.title')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.network_partitions.failure_types.description')}
              </Typography>

              <div className="space-y-8">
                {/* Fail-Stop */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded border border-zinc-600">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🔴</div>
                    <Typography variant="h3" className="text-green-400">
                      {t('menu.theoretical_foundations.network_partitions.failure_types.fail_stop.title')}
                    </Typography>
                  </div>
                  <Typography variant="p" className="mb-4">
                    {t('menu.theoretical_foundations.network_partitions.failure_types.fail_stop.description')}
                  </Typography>
                  <Typography variant="p" className="mb-4 text-gray-300">
                    {t('menu.theoretical_foundations.network_partitions.failure_types.fail_stop.detailed_explanation')}
                  </Typography>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="h4" className="text-sm font-semibold mb-2 text-green-300">
                        {t('menu.theoretical_foundations.network_partitions.characteristics_label')}
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {(t('menu.theoretical_foundations.network_partitions.failure_types.fail_stop.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                          <li key={index} className="text-sm text-gray-300">{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Typography variant="h4" className="text-sm font-semibold mb-2 text-green-300">
                        {t('menu.theoretical_foundations.network_partitions.examples_label')}
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {(t('menu.theoretical_foundations.network_partitions.failure_types.fail_stop.examples', { returnObjects: true }) as string[]).map((example, index) => (
                          <li key={index} className="text-sm text-gray-300">{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Fail-Slow */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded border border-zinc-600">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🟡</div>
                    <Typography variant="h3" className="text-yellow-400">
                      {t('menu.theoretical_foundations.network_partitions.failure_types.fail_slow.title')}
                    </Typography>
                  </div>
                  <Typography variant="p" className="mb-4">
                    {t('menu.theoretical_foundations.network_partitions.failure_types.fail_slow.description')}
                  </Typography>
                  <Typography variant="p" className="mb-4 text-gray-300">
                    {t('menu.theoretical_foundations.network_partitions.failure_types.fail_slow.detailed_explanation')}
                  </Typography>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="h4" className="text-sm font-semibold mb-2 text-yellow-300">
                        {t('menu.theoretical_foundations.network_partitions.characteristics_label')}
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {(t('menu.theoretical_foundations.network_partitions.failure_types.fail_slow.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                          <li key={index} className="text-sm text-gray-300">{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Typography variant="h4" className="text-sm font-semibold mb-2 text-yellow-300">
                        {t('menu.theoretical_foundations.network_partitions.examples_label')}
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {(t('menu.theoretical_foundations.network_partitions.failure_types.fail_slow.examples', { returnObjects: true }) as string[]).map((example, index) => (
                          <li key={index} className="text-sm text-gray-300">{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Byzantine */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded border border-zinc-600">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🔥</div>
                    <Typography variant="h3" className="text-red-400">
                      {t('menu.theoretical_foundations.network_partitions.failure_types.byzantine.title')}
                    </Typography>
                  </div>
                  <Typography variant="p" className="mb-4">
                    {t('menu.theoretical_foundations.network_partitions.failure_types.byzantine.description')}
                  </Typography>
                  <Typography variant="p" className="mb-4 text-gray-300">
                    {t('menu.theoretical_foundations.network_partitions.failure_types.byzantine.detailed_explanation')}
                  </Typography>

                  <div className="grid lg:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="h4" className="text-sm font-semibold mb-2 text-red-300">
                        {t('menu.theoretical_foundations.network_partitions.characteristics_label')}
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {(t('menu.theoretical_foundations.network_partitions.failure_types.byzantine.characteristics', { returnObjects: true }) as string[]).map((char, index) => (
                          <li key={index} className="text-sm text-gray-300">{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Typography variant="h4" className="text-sm font-semibold mb-2 text-red-300">
                        {t('menu.theoretical_foundations.network_partitions.examples_label')}
                      </Typography>
                      <ul className="list-disc list-inside space-y-1">
                        {(t('menu.theoretical_foundations.network_partitions.failure_types.byzantine.examples', { returnObjects: true }) as string[]).map((example, index) => (
                          <li key={index} className="text-sm text-gray-300">{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Examples Section */}
            <div className="bg-purple-900/20 p-8 rounded-lg border border-purple-700">
              <Typography variant="h2" className="mb-6 text-purple-400">
                {t('menu.theoretical_foundations.network_partitions.concrete_examples.title')}
              </Typography>
              <div className="grid md:grid-cols-2 gap-4">
                {(t('menu.theoretical_foundations.network_partitions.concrete_examples.examples', { returnObjects: true }) as string[]).map((example, index) => (
                  <div key={index} className="bg-purple-900/30 p-4 rounded text-sm border border-purple-700/50">
                    <Typography variant="p" className="text-gray-300">
                      {example}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Partition Scenarios Section */}
            <div className="bg-indigo-900/20 p-8 rounded-lg border border-indigo-700">
              <Typography variant="h2" className="mb-6 text-indigo-400">
                {t('menu.theoretical_foundations.network_partitions.partition_scenarios.title')}
              </Typography>

              <div className="space-y-6">
                {/* Multi-Datacenter */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded border border-zinc-600">
                  <Typography variant="h3" className="mb-3 text-indigo-300">
                    {t('menu.theoretical_foundations.network_partitions.partition_scenarios.datacenter_split.title')}
                  </Typography>
                  <Typography variant="p" className="mb-4 text-gray-300">
                    {t('menu.theoretical_foundations.network_partitions.partition_scenarios.datacenter_split.description')}
                  </Typography>
                  <div>
                    <Typography variant="h4" className="text-sm font-semibold mb-2 text-indigo-300">
                      {t('menu.theoretical_foundations.network_partitions.strategies_label')}
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.partition_scenarios.datacenter_split.strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                        <li key={index} className="text-sm text-gray-300">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Service Mesh */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded border border-zinc-600">
                  <Typography variant="h3" className="mb-3 text-indigo-300">
                    {t('menu.theoretical_foundations.network_partitions.partition_scenarios.service_mesh_partition.title')}
                  </Typography>
                  <Typography variant="p" className="mb-4 text-gray-300">
                    {t('menu.theoretical_foundations.network_partitions.partition_scenarios.service_mesh_partition.description')}
                  </Typography>
                  <div>
                    <Typography variant="h4" className="text-sm font-semibold mb-2 text-indigo-300">
                      {t('menu.theoretical_foundations.network_partitions.strategies_label')}
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.partition_scenarios.service_mesh_partition.strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                        <li key={index} className="text-sm text-gray-300">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Database Partition */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded border border-zinc-600">
                  <Typography variant="h3" className="mb-3 text-indigo-300">
                    {t('menu.theoretical_foundations.network_partitions.partition_scenarios.database_partition.title')}
                  </Typography>
                  <Typography variant="p" className="mb-4 text-gray-300">
                    {t('menu.theoretical_foundations.network_partitions.partition_scenarios.database_partition.description')}
                  </Typography>
                  <div>
                    <Typography variant="h4" className="text-sm font-semibold mb-2 text-indigo-300">
                      {t('menu.theoretical_foundations.network_partitions.strategies_label')}
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.partition_scenarios.database_partition.strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                        <li key={index} className="text-sm text-gray-300">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12 mb-12">
            <Typography variant="h2" className="mb-8 text-center">
              {t('menu.theoretical_foundations.network_partitions.handling_title')}
            </Typography>
            
            {/* Detection Section */}
            <div className="bg-green-900/20 p-8 rounded-lg border border-green-700">
              <Typography variant="h2" className="mb-6 text-green-400">
                {t('menu.theoretical_foundations.network_partitions.detection.title')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.network_partitions.detection.description')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Basic Detection */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    Basic Detection:
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.detection.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Detection Challenges */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                    {t('menu.theoretical_foundations.network_partitions.challenges_label')}
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.detection.challenges', { returnObjects: true }) as string[]).map((challenge, index) => (
                      <li key={index} className="text-sm text-gray-300">{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed Strategies */}
              <div>
                <Typography variant="h4" className="text-sm font-semibold mb-3 text-green-300">
                  Detailed Detection Strategies:
                </Typography>
                <ul className="list-disc list-inside space-y-1">
                  {(t('menu.theoretical_foundations.network_partitions.detection.detailed_strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                    <li key={index} className="text-sm text-gray-300">{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prevention Section */}
            <div className="bg-blue-900/20 p-8 rounded-lg border border-blue-700">
              <Typography variant="h2" className="mb-6 text-brand-600 dark:text-brand-400">
                {t('menu.theoretical_foundations.network_partitions.prevention.title')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.network_partitions.prevention.description')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Basic Prevention */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                    Basic Prevention:
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.prevention.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Strategies */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-brand-600 dark:text-brand-300">
                    Detailed Prevention Strategies:
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.prevention.detailed_strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                      <li key={index} className="text-sm text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recovery Section */}
            <div className="bg-purple-900/20 p-8 rounded-lg border border-purple-700">
              <Typography variant="h2" className="mb-6 text-purple-400">
                {t('menu.theoretical_foundations.network_partitions.recovery.title')}
              </Typography>
              <Typography variant="p" className="mb-6 text-gray-300">
                {t('menu.theoretical_foundations.network_partitions.recovery.description')}
              </Typography>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Basic Recovery */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                    Basic Recovery:
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.recovery.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Strategies */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                  <Typography variant="h4" className="text-sm font-semibold mb-3 text-purple-300">
                    Detailed Recovery Strategies:
                  </Typography>
                  <ul className="list-disc list-inside space-y-1">
                    {(t('menu.theoretical_foundations.network_partitions.recovery.detailed_strategies', { returnObjects: true }) as string[]).map((strategy, index) => (
                      <li key={index} className="text-sm text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Design Principles Section */}
          <div className="bg-orange-900/20 p-8 rounded-lg border border-orange-700 mb-8">
            <Typography variant="h2" className="mb-6 text-center text-orange-400">
              {t('menu.theoretical_foundations.network_partitions.design_principles.title')}
            </Typography>
            
            <div className="space-y-8">
              {/* Architectural Patterns */}
              <div>
                <Typography variant="h3" className="mb-4 text-orange-300">
                  {t('menu.theoretical_foundations.network_partitions.design_principles.architectural.title')}
                </Typography>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                    <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                      Basic Patterns:
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.design_principles.architectural.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index} className="text-sm text-gray-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                    <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                      {t('menu.theoretical_foundations.network_partitions.patterns_label')}
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.design_principles.architectural.detailed_patterns', { returnObjects: true }) as string[]).map((pattern, index) => (
                        <li key={index} className="text-sm text-gray-300">{pattern}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Operational Practices */}
              <div>
                <Typography variant="h3" className="mb-4 text-orange-300">
                  {t('menu.theoretical_foundations.network_partitions.design_principles.operational.title')}
                </Typography>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                    <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                      Basic Practices:
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.design_principles.operational.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                        <li key={index} className="text-sm text-gray-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 p-4 rounded border border-zinc-600">
                    <Typography variant="h4" className="text-sm font-semibold mb-3 text-orange-300">
                      {t('menu.theoretical_foundations.network_partitions.practices_label')}
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {(t('menu.theoretical_foundations.network_partitions.design_principles.operational.detailed_practices', { returnObjects: true }) as string[]).map((practice, index) => (
                        <li key={index} className="text-sm text-gray-300">{practice}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CAP Theorem Connection Section */}
          <div className="bg-red-900/20 p-8 rounded-lg border border-red-700 mb-8">
            <Typography variant="h2" className="mb-6 text-center text-red-400">
              {t('menu.theoretical_foundations.network_partitions.cap_theorem_connection.title')}
            </Typography>
            <Typography variant="p" className="mb-6 text-center text-gray-300">
              {t('menu.theoretical_foundations.network_partitions.cap_theorem_connection.explanation')}
            </Typography>
            
            <div className="grid md:grid-cols-3 gap-6">
              {(t('menu.theoretical_foundations.network_partitions.cap_theorem_connection.trade_offs', { returnObjects: true }) as string[]).map((tradeOff, index) => (
                <div key={index} className="bg-red-900/30 p-4 rounded text-center border border-red-700/50">
                  <Typography variant="p" className="text-sm text-gray-300">
                    {tradeOff}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices Section */}
          <div className="bg-green-900/20 p-8 rounded-lg border border-green-700">
            <Typography variant="h2" className="mb-6 text-center text-green-400">
              {t('menu.theoretical_foundations.network_partitions.best_practices.title')}
            </Typography>
            <ul className="list-disc list-inside space-y-3 max-w-4xl mx-auto">
              {(t('menu.theoretical_foundations.network_partitions.best_practices.practices', { returnObjects: true }) as string[]).map((practice, index) => (
                <li key={index} className="text-gray-300">{practice}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NetworkPartitions;