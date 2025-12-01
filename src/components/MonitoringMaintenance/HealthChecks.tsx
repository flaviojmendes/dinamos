import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HealthChecks() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.health_checks';

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

      {/* Types of Health Checks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.types_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Liveness */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.types.liveness.title`)}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              {(t(`${base}.types.liveness.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Readiness */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.types.readiness.title`)}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              {(t(`${base}.types.readiness.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Startup */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.types.startup.title`)}</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
              {(t(`${base}.types.startup.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Implementation Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.patterns_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.http_endpoints_title`)}</h3>
              <div className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
                <pre className="text-sm text-slate-600 dark:text-slate-300">
{`// Endpoint de Health Check
GET /health
{
  "status": "UP",
  "components": {
    "db": "UP",
    "cache": "UP",
    "messaging": "UP"
  },
  "details": {
    "db.responseTime": "45ms",
    "cache.size": "2.3GB"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.verifications_title`)}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.verifications.connections.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.verifications.connections.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.verifications.resources.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.verifications.resources.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.verifications.features.title`)}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.verifications.features.desc`)}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Integration with Infrastructure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.infrastructure_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Container Orchestration */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.orchestration_title`)}</h3>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Kubernetes</h4>
                <pre className="text-sm text-slate-600 dark:text-slate-300">
{`livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 5`}
                </pre>
              </div>
            </div>
          </div>

          {/* Load Balancers */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.load_balancers_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.load_balancer_features.routing.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.load_balancer_features.routing.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.load_balancer_features.circuit_breaking.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.load_balancer_features.circuit_breaking.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.load_balancer_features.auto_scaling.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.load_balancer_features.auto_scaling.desc`)}</p>
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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.best_practices_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-brand-600 dark:text-brand-400">{t(`${base}.implementation_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.implementation_practices.lightweight.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.implementation_practices.lightweight.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.implementation_practices.isolation.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.implementation_practices.isolation.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.implementation_practices.cache.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.implementation_practices.cache.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.monitoring_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.monitoring_practices.logging.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.monitoring_practices.logging.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.monitoring_practices.metrics.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.monitoring_practices.metrics.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.monitoring_practices.alerts.title`)}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t(`${base}.monitoring_practices.alerts.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
} 