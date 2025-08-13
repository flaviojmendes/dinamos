import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Metrics() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.metrics';

  const systemItems = t(`${base}.categories.system_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const appItems = t(`${base}.categories.app_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const latencyPercentiles = t(`${base}.latency_card.percentiles_items`, { returnObjects: true }) as string[];
  const latencyComponents = t(`${base}.latency_card.components_items`, { returnObjects: true }) as string[];
  const throughputMeasures = t(`${base}.throughput_card.measures_items`, { returnObjects: true }) as string[];
  const throughputCapacity = t(`${base}.throughput_card.capacity_items`, { returnObjects: true }) as string[];

  const availabilityItems = t(`${base}.availability_card.items`, { returnObjects: true }) as string[];
  const qualityItems = t(`${base}.quality_card.items`, { returnObjects: true }) as string[];
  const costItems = t(`${base}.cost_card.items`, { returnObjects: true }) as string[];

  const collectItems = t(`${base}.collect_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const vizItems = t(`${base}.viz_items`, { returnObjects: true }) as { title: string; desc: string }[];

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

      {/* Core Metrics Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.categories_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.categories.system_title`)}</h3>
            <ul className="space-y-3">
              {systemItems.map((item, idx) => (
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

          {/* Application Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.categories.app_title`)}</h3>
            <ul className="space-y-3">
              {appItems.map((item, idx) => (
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

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.perf_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.latency_card.title`)}</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.latency_card.percentiles_title`)}</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    {latencyPercentiles.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.latency_card.components_title`)}</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    {latencyComponents.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">{t(`${base}.throughput_card.title`)}</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.throughput_card.measures_title`)}</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    {throughputMeasures.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.throughput_card.capacity_title`)}</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    {throughputCapacity.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.business_kpis_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.availability_card.title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {availabilityItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.quality_card.title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {qualityItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.cost_card.title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {costItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Prometheus Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.prom_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <p className="text-zinc-300 mb-4">{t(`${base}.prom_desc`)}</p>
          <div className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
            <pre className="text-sm text-zinc-300">
{`# ${t(`${base}.prom_desc`).replace(/:.*/, '')}
http_request_duration_seconds_bucket{path="/api/users", method="GET"}

# ${t(`${base}.prom_title`).split(' ')[0]} errors
rate(http_requests_total{status=~"5.."}[5m])

# CPU usage
rate(process_cpu_seconds_total[1m])

# Memory usage
process_resident_memory_bytes`}
            </pre>
          </div>
          <p className="text-zinc-400 text-sm">{t(`${base}.prom_outro`)}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.collect_title`)}</h3>
            <ul className="space-y-3">
              {collectItems.map((item, idx) => (
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

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.viz_title`)}</h3>
            <ul className="space-y-3">
              {vizItems.map((item, idx) => (
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

    </div>
  );
} 