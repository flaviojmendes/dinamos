import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Performance() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.performance';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          {t(`${base}.intro_p1`)}
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-brand-600 dark:text-brand-300">
          <strong className="block mb-2">💡 {t(`${base}.key_concept_label`)}:</strong>
          {t(`${base}.key_concept_text`)}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.metrics_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.core_metrics_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.core_metrics.latency.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.core_metrics.latency.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.core_metrics.throughput.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.core_metrics.throughput.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.core_metrics.utilization.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.core_metrics.utilization.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Advanced Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.advanced_metrics_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.advanced_metrics.apdex.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.advanced_metrics.apdex.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.advanced_metrics.percentiles.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.advanced_metrics.percentiles.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.advanced_metrics.saturation.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.advanced_metrics.saturation.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Performance Testing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.testing_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Load Testing */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.testing_types.load.title`)}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              {(t(`${base}.testing_types.load.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Stress Testing */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.testing_types.stress.title`)}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              {(t(`${base}.testing_types.stress.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Scalability Testing */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.testing_types.scalability.title`)}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              {(t(`${base}.testing_types.scalability.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Performance Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.tools_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.monitoring_title`)}</h3>
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.apm_tools_title`)}</h4>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-2 text-sm">
                    {(t(`${base}.apm_tools`, { returnObjects: true }) as string[]).map((tool, idx) => (
                      <li key={idx}>• {tool}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.profiling_title`)}</h4>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-2 text-sm">
                    {(t(`${base}.profiling_tools`, { returnObjects: true }) as string[]).map((tool, idx) => (
                      <li key={idx}>• {tool}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.load_testing_title`)}</h3>
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.open_source_title`)}</h4>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-2 text-sm">
                    {(t(`${base}.open_source_tools`, { returnObjects: true }) as string[]).map((tool, idx) => (
                      <li key={idx}>• {tool}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.cloud_services_title`)}</h4>
                  <ul className="text-slate-600 dark:text-slate-300 space-y-2 text-sm">
                    {(t(`${base}.cloud_services`, { returnObjects: true }) as string[]).map((service, idx) => (
                      <li key={idx}>• {service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.optimization_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategies */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.strategies_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.strategies.caching.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.strategies.caching.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.strategies.load_balancing.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.strategies.load_balancing.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.strategies.code_optimization.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.strategies.code_optimization.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Techniques */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.techniques_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.techniques.lazy_loading.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.techniques.lazy_loading.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.techniques.connection_pooling.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.techniques.connection_pooling.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.techniques.async_processing.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.techniques.async_processing.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.best_practices_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.development_title`)}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.development_practices.continuous_profiling.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.development_practices.continuous_profiling.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.development_practices.load_tests.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.development_practices.load_tests.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.development_practices.benchmarking.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.development_practices.benchmarking.desc`)}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">{t(`${base}.production_title`)}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.production_practices.realtime_monitoring.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.production_practices.realtime_monitoring.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.production_practices.capacity_planning.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.production_practices.capacity_planning.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.production_practices.continuous_optimization.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.production_practices.continuous_optimization.desc`)}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
} 