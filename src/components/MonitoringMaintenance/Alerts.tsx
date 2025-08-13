import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Alerts() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.alerts';

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

      {/* Alert Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.types_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Critical Alerts */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-bold mb-4 text-red-400">{t(`${base}.types.critical.title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {(t(`${base}.types.critical.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Warning Alerts */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">{t(`${base}.types.warning.title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {(t(`${base}.types.warning.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Info Alerts */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.types.info.title`)}</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {(t(`${base}.types.info.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Alert Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.config_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.thresholds_title`)}</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.static_title`)}</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    {(t(`${base}.static_items`, { returnObjects: true }) as string[]).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.dynamic_title`)}</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    {(t(`${base}.dynamic_items`, { returnObjects: true }) as string[]).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.example_title`)}</h3>
              <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-zinc-300">
{`{
  "alert": "high_error_rate",
  "condition": {
    "metric": "http_errors_total",
    "threshold": {
      "type": "static",
      "value": 0.01,
      "duration": "5m"
    },
    "severity": "critical",
    "notifications": [
      {
        "type": "pagerduty",
        "team": "platform"
      },
      {
        "type": "slack",
        "channel": "#alerts"
      }
    ]
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.channels_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Synchronous */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.sync_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.sync_channels.sms.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.sync_channels.sms.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.sync_channels.calls.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.sync_channels.calls.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.sync_channels.pagerduty.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.sync_channels.pagerduty.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Asynchronous */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.async_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.async_channels.email.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.async_channels.email.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.async_channels.slack.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.async_channels.slack.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.async_channels.dashboards.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.async_channels.dashboards.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Incident Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t(`${base}.incident_title`)}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">{t(`${base}.process_title`)}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.process_steps.detection.title`)}</span>
                    <p className="text-zinc-400 text-sm">{t(`${base}.process_steps.detection.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.process_steps.response.title`)}</span>
                    <p className="text-zinc-400 text-sm">{t(`${base}.process_steps.response.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.process_steps.mitigation.title`)}</span>
                    <p className="text-zinc-400 text-sm">{t(`${base}.process_steps.mitigation.desc`)}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">4</div>
                  <div>
                    <span className="text-white font-medium">{t(`${base}.process_steps.resolution.title`)}</span>
                    <p className="text-zinc-400 text-sm">{t(`${base}.process_steps.resolution.desc`)}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">{t(`${base}.tools_title`)}</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.tools.pagerduty.title`)}</h4>
                  <p className="text-zinc-400 text-sm">
                    {t(`${base}.tools.pagerduty.desc`)}
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.tools.opsgenie.title`)}</h4>
                  <p className="text-zinc-400 text-sm">
                    {t(`${base}.tools.opsgenie.desc`)}
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{t(`${base}.tools.servicenow.title`)}</h4>
                  <p className="text-zinc-400 text-sm">
                    {t(`${base}.tools.servicenow.desc`)}
                  </p>
                </div>
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
            <h3 className="text-xl font-bold mb-4 text-blue-400">{t(`${base}.alert_config_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.alert_practices.actionable.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.alert_practices.actionable.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.alert_practices.noise_reduction.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.alert_practices.noise_reduction.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.alert_practices.context.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.alert_practices.context.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">{t(`${base}.incident_response_title`)}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.response_practices.playbooks.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.response_practices.playbooks.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.response_practices.escalation.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.response_practices.escalation.desc`)}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">{t(`${base}.response_practices.postmortem.title`)}</span>
                  <p className="text-zinc-400 text-sm">{t(`${base}.response_practices.postmortem.desc`)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
} 
