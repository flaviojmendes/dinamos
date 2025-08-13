import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Logs() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.logs';

  const appLogItems = t(`${base}.app_logs_items`, { returnObjects: true }) as string[];
  const sysLogItems = t(`${base}.sys_logs_items`, { returnObjects: true }) as string[];
  const secLogItems = t(`${base}.sec_logs_items`, { returnObjects: true }) as string[];

  const benefits = t(`${base}.benefits_items`, { returnObjects: true }) as { title: string; desc: string }[];

  const components = t(`${base}.components_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const elkItems = t(`${base}.elk_items`, { returnObjects: true }) as { title: string; desc: string }[];

  const concepts = t(`${base}.concepts_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const tools = t(`${base}.tools_items`, { returnObjects: true }) as { title: string; desc: string }[];

  const loggingBest = t(`${base}.logging_items`, { returnObjects: true }) as { title: string; desc: string }[];
  const tracingBest = t(`${base}.tracing_bp_items`, { returnObjects: true }) as { title: string; desc: string }[];

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

      {/* Log Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.types_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Application Logs */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.app_logs_title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {appLogItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* System Logs */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.sys_logs_title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {sysLogItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Security Logs */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.sec_logs_title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {secLogItems.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Structured Logging */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.structured_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <p className="text-zinc-300 mb-6">{t(`${base}.structured_desc`)}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.benefits_title`)}</h3>
              <ul className="space-y-3">
                {benefits.map((item, idx) => (
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

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.example_title`)}</h3>
              <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-zinc-300">
{`{
  "timestamp": "2024-03-20T10:15:30Z",
  "level": "ERROR",
  "service": "payment-service",
  "traceId": "abc123",
  "message": "Payment processing failed",
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "details": "Account balance too low"
  },
  "context": {
    "userId": "user123",
    "amount": 150.00,
    "currency": "USD"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Log Aggregation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.aggregation_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.components_title`)}</h3>
              <ul className="space-y-4">
                {components.map((item, idx) => (
                  <li key={idx} className="bg-zinc-800/50 p-3 rounded-lg">
                    <span className="text-white font-medium">{item.title}</span>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">{t(`${base}.elk_title`)}</h3>
              <div className="space-y-4">
                {elkItems.map((item, idx) => (
                  <div key={idx} className="bg-zinc-800/50 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{item.title}</h4>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Distributed Tracing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.tracing_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <p className="text-zinc-300 mb-6">{t(`${base}.tracing_desc`)}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.concepts_title`)}</h3>
              <ul className="space-y-3">
                {concepts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div>
                      <span className="text-white font-medium">{item.title}</span>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.tools_title`)}</h3>
              <div className="space-y-4">
                {tools.map((item, idx) => (
                  <div key={idx} className="bg-zinc-800/50 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{item.title}</h4>
                    <p className="text-zinc-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.logging_title`)}</h3>
            <ul className="space-y-3">
              {loggingBest.map((item, idx) => (
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
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.tracing_bp_title`)}</h3>
            <ul className="space-y-3">
              {tracingBest.map((item, idx) => (
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