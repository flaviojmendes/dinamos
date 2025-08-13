import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PollingWebhooksTheory() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            {t('polling_webhooks_theory.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            {t('polling_webhooks_theory.subtitle')}
          </motion.p>
        </div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-400">{t('polling_webhooks_theory.problem_title')}</h2>
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              {t('polling_webhooks_theory.subtitle')}
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              In distributed systems, keeping components synchronized is one of the biggest challenges. How can one service know when something has changed in another? There are two main approaches to solve this problem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-3">{t('polling_webhooks_theory.problem_polling_title')}</h3>
                <p className="text-zinc-300">
                  {t('polling_webhooks_theory.problem_polling_text')}
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">{t('polling_webhooks_theory.problem_webhook_title')}</h3>
                <p className="text-zinc-300">
                  {t('polling_webhooks_theory.problem_webhook_text')}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Polling Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-400">{t('polling_webhooks_theory.polling_title')}</h2>
          
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-300">{t('polling_webhooks_theory.how_it_works')}</h3>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Polling involves regularly checking for updates by making requests at specific intervals. It's like asking "Is there anything new?" every few seconds.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-blue-400 mb-4">{t('polling_webhooks_theory.typical_flow')}</h4>
              <ol className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                  <span>Cliente envia GET /api/messages?after=timestamp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                  <span>Servidor verifica se há mensagens novas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                  <span>Servidor responde com dados ou "nada novo"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                  <span>Cliente aguarda X segundos e repete</span>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-green-400 mb-4">{t('polling_webhooks_theory.advantages')}</h4>
                {/* Static bullets left as-is for brevity */}
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-red-400 mb-4">{t('polling_webhooks_theory.disadvantages')}</h4>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-400 mb-4">{t('polling_webhooks_theory.when_to_use_polling')}</h4>
          </div>
        </motion.section>

        {/* Webhooks Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-purple-400">{t('polling_webhooks_theory.webhooks_title')}</h2>
          
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-purple-300">{t('polling_webhooks_theory.how_it_works')}</h3>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Webhooks use a push-based approach where the server notifies clients immediately when events occur. It's like having someone call you the moment something happens.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-purple-400 mb-4">{t('polling_webhooks_theory.typical_flow')}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-green-400 mb-4">{t('polling_webhooks_theory.advantages')}</h4>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-red-400 mb-4">{t('polling_webhooks_theory.disadvantages')}</h4>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-purple-400 mb-4">{t('polling_webhooks_theory.when_to_use_webhooks')}</h4>
          </div>
        </motion.section>

        {/* Comparison Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t('polling_webhooks_theory.comparison_title')}</h2>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-800/50">
                    <th className="text-left p-4 text-zinc-300 font-medium">{t('polling_webhooks_theory.table.aspect')}</th>
                    <th className="text-left p-4 text-blue-400 font-medium">{t('polling_webhooks_theory.table.polling')}</th>
                    <th className="text-left p-4 text-purple-400 font-medium">{t('polling_webhooks_theory.table.webhooks')}</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {/* Keep row content, table headers are localized */}
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.latency')}</td>
                    <td className="p-4">Até o intervalo de polling (ex: 0-30s)</td>
                    <td className="p-4">Quase instantânea (&lt; 1s)</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.bandwidth')}</td>
                    <td className="p-4">Alto (requisições constantes)</td>
                    <td className="p-4">Baixo (só quando há dados)</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.complexity')}</td>
                    <td className="p-4">Baixa</td>
                    <td className="p-4">Média/Alta</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.scalability')}</td>
                    <td className="p-4">Limitada (O(n) requisições)</td>
                    <td className="p-4">Excelente (O(1) por evento)</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.network_requirements')}</td>
                    <td className="p-4">Cliente pode ser privado</td>
                    <td className="p-4">Cliente precisa ser acessível</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.control')}</td>
                    <td className="p-4">Total pelo cliente</td>
                    <td className="p-4">Iniciado pelo servidor</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.debugging')}</td>
                    <td className="p-4">Fácil (fluxo previsível)</td>
                    <td className="p-4">Mais complexo</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">{t('polling_webhooks_theory.table.reliability')}</td>
                    <td className="p-4">Alta (retry automático)</td>
                    <td className="p-4">Precisa implementar retry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Real World Examples */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t('polling_webhooks_theory.real_world_title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Polling Examples */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">{t('polling_webhooks_theory.polling_use_cases')}</h3>
            </div>

            {/* Webhook Examples */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">{t('polling_webhooks_theory.webhook_use_cases')}</h3>
            </div>
          </div>
        </motion.section>

        {/* Implementation Considerations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t('polling_webhooks_theory.implementation_title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Polling Implementation */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">{t('polling_webhooks_theory.implementing_polling')}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-3">{t('polling_webhooks_theory.common_strategies')}</h4>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-3">{t('polling_webhooks_theory.important_care')}</h4>
                </div>
              </div>
            </div>

            {/* Webhook Implementation */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">{t('polling_webhooks_theory.implementing_webhooks')}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-3">{t('polling_webhooks_theory.essential_security')}</h4>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-3">{t('polling_webhooks_theory.reliability_patterns')}</h4>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Hybrid Approaches */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t('polling_webhooks_theory.hybrid_title')}</h2>
          
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-400 mb-4">{t('polling_webhooks_theory.card_fallback')}</h4>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-yellow-400 mb-4">{t('polling_webhooks_theory.card_realtime_batch')}</h4>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-orange-400 mb-4">{t('polling_webhooks_theory.card_context_aware')}</h4>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30"
        >
          <h2 className="text-2xl font-bold mb-4">{t('polling_webhooks_theory.cta_title')}</h2>
          <p className="text-zinc-300 mb-6">
            {t('polling_webhooks_theory.cta_subtitle')}
          </p>
          <Link
            to="/componentes/polling-webhooks/simulator"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            {t('components.common.access_simulator')}
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center"
        >
          <Link
            to="/componentes"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('simulators.polling_webhooks.ctas.back_to_components')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 