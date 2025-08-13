import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MonitoringMaintenance() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.main';

  const metricsItems = t(`${base}.pillars.metrics.items`, { returnObjects: true }) as string[];
  const logsItems = t(`${base}.pillars.logs.items`, { returnObjects: true }) as string[];
  const tracesItems = t(`${base}.pillars.traces.items`, { returnObjects: true }) as string[];

  const useItems = t(`${base}.use_method_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const redItems = t(`${base}.red_method_items`, { returnObjects: true }) as { title: string; desc: string }[];

  const toolsMetrics = t(`${base}.tools.metrics_items`, { returnObjects: true }) as { name: string; desc: string }[];
  const toolsLogs = t(`${base}.tools.logs_items`, { returnObjects: true }) as { name: string; desc: string }[];
  const toolsTracing = t(`${base}.tools.tracing_items`, { returnObjects: true }) as { name: string; desc: string }[];

  const monitoringBest = t(`${base}.monitoring_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const maintenanceBest = t(`${base}.maintenance_items`, { returnObjects: true }) as { title: string; desc: string }[];

  const sliItems = t(`${base}.sli_card.items`, { returnObjects: true }) as string[];
  const sloItems = t(`${base}.slo_card.items`, { returnObjects: true }) as string[];
  const slaItems = t(`${base}.sla_card.items`, { returnObjects: true }) as string[];

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
        <p className="text-lg text-zinc-300 mb-6">
          {t(`${base}.intro_p1`)}
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 {t(`${base}.key_concept_label`)}:</strong>
          {t(`${base}.key_concept_text`)}
        </div>
      </motion.div>

      {/* Observability Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.pillars_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metrics */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold text-blue-400">{t(`${base}.pillars.metrics.title`)}</h3>
            </div>
            <ul className="space-y-2 text-zinc-300">
              {metricsItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Logs */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-purple-400">{t(`${base}.pillars.logs.title`)}</h3>
            </div>
            <ul className="space-y-2 text-zinc-300">
              {logsItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Traces */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-green-400">{t(`${base}.pillars.traces.title`)}</h3>
            </div>
            <ul className="space-y-2 text-zinc-300">
              {tracesItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.golden_signals_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USE Method */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.use_method_title`)}</h3>
            <p className="text-zinc-300 mb-4">{t(`${base}.use_method_p`)}</p>
            <ul className="space-y-3">
              {useItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{item.title}</span>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RED Method */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.red_method_title`)}</h3>
            <p className="text-zinc-300 mb-4">{t(`${base}.red_method_p`)}</p>
            <ul className="space-y-3">
              {redItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{item.title}</span>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Monitoring Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.tools_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metrics Tools */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.tools.metrics_title`)}</h3>
            <ul className="space-y-3">
              {toolsMetrics.map((tool, idx) => (
                <li key={idx} className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">{tool.name}</span>
                  <p className="text-zinc-400 text-sm">{tool.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Logging Tools */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.tools.logs_title`)}</h3>
            <ul className="space-y-3">
              {toolsLogs.map((tool, idx) => (
                <li key={idx} className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">{tool.name}</span>
                  <p className="text-zinc-400 text-sm">{tool.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Tracing Tools */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.tools.tracing_title`)}</h3>
            <ul className="space-y-3">
              {toolsTracing.map((tool, idx) => (
                <li key={idx} className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">{tool.name}</span>
                  <p className="text-zinc-400 text-sm">{tool.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.best_practices_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monitoring Best Practices */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.monitoring_title`)}</h3>
            <ul className="space-y-3">
              {monitoringBest.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{item.title}</span>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Maintenance Best Practices */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.maintenance_title`)}</h3>
            <ul className="space-y-3">
              {maintenanceBest.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{item.title}</span>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* SLI, SLO, SLA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.slo_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.sli_card.title`)}</h3>
            <p className="text-zinc-300 mb-4">{t(`${base}.sli_card.desc`)}</p>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {sliItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.slo_card.title`)}</h3>
            <p className="text-zinc-300 mb-4">{t(`${base}.slo_card.desc`)}</p>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {sloItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.sla_card.title`)}</h3>
            <p className="text-zinc-300 mb-4">{t(`${base}.sla_card.desc`)}</p>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {slaItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

    </div>
  );
} 
