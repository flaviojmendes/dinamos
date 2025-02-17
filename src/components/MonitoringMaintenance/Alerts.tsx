import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Alerts() {
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
          Alertas e Notificações em Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          Um sistema eficaz de alertas e notificações é crucial para manter a saúde e 
          disponibilidade de sistemas distribuídos. Ele permite identificar e responder 
          rapidamente a problemas antes que afetem significativamente os usuários.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          Alertas devem ser acionáveis, relevantes e evitar fadiga de alertas. Um bom sistema
          de alertas diferencia entre situações críticas que exigem ação imediata e condições
          que podem ser tratadas durante o horário normal de trabalho.
        </div>
      </motion.div>

      {/* Alert Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Tipos de Alertas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Critical Alerts */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-6 border border-red-500/20">
            <h3 className="text-xl font-bold mb-4 text-red-400">Críticos</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Indisponibilidade de serviço</li>
              <li>• Falhas de segurança</li>
              <li>• Perda de dados</li>
              <li>• Violações de SLA</li>
            </ul>
          </div>

          {/* Warning Alerts */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Avisos</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Alta utilização de recursos</li>
              <li>• Degradação de performance</li>
              <li>• Tendências anômalas</li>
              <li>• Erros não críticos</li>
            </ul>
          </div>

          {/* Info Alerts */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Informativos</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Deploys realizados</li>
              <li>• Manutenções programadas</li>
              <li>• Mudanças de configuração</li>
              <li>• Eventos de rotina</li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Configuração de Alertas</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Thresholds</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Estáticos</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• CPU &gt; 80%</li>
                    <li>• Memória &gt; 90%</li>
                    <li>• Latência &gt; 500ms</li>
                    <li>• Error rate &gt; 1%</li>
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Dinâmicos</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• Baseados em histórico</li>
                    <li>• Machine learning</li>
                    <li>• Análise de tendências</li>
                    <li>• Sazonalidade</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Exemplo de Configuração</h3>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Canais de Notificação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Synchronous */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Síncronos</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">SMS</span>
                  <p className="text-zinc-400 text-sm">Para alertas críticos que exigem ação imediata</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Ligações</span>
                  <p className="text-zinc-400 text-sm">Para escalação de incidentes críticos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">PagerDuty</span>
                  <p className="text-zinc-400 text-sm">Gestão de plantão e escalação</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Asynchronous */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Assíncronos</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Email</span>
                  <p className="text-zinc-400 text-sm">Para notificações não urgentes e relatórios</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Slack</span>
                  <p className="text-zinc-400 text-sm">Para comunicação em equipe e discussões</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Dashboards</span>
                  <p className="text-zinc-400 text-sm">Para visualização e histórico de alertas</p>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Gestão de Incidentes</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Processo</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</div>
                  <div>
                    <span className="text-white font-medium">Detecção</span>
                    <p className="text-zinc-400 text-sm">Identificação do problema através de alertas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</div>
                  <div>
                    <span className="text-white font-medium">Resposta</span>
                    <p className="text-zinc-400 text-sm">Acionamento da equipe responsável</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</div>
                  <div>
                    <span className="text-white font-medium">Mitigação</span>
                    <p className="text-zinc-400 text-sm">Ações para resolver o problema</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-500/20 text-green-400 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">4</div>
                  <div>
                    <span className="text-white font-medium">Resolução</span>
                    <p className="text-zinc-400 text-sm">Correção definitiva e documentação</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Ferramentas</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">PagerDuty</h4>
                  <p className="text-zinc-400 text-sm">
                    Gestão de plantão e escalação de incidentes
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">OpsGenie</h4>
                  <p className="text-zinc-400 text-sm">
                    Alertas e coordenação de resposta a incidentes
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">ServiceNow</h4>
                  <p className="text-zinc-400 text-sm">
                    ITSM e gestão do ciclo de vida de incidentes
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
        <h2 className="text-2xl font-bold mb-6 text-white">Melhores Práticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Configuração de Alertas</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Alertas Acionáveis</span>
                  <p className="text-zinc-400 text-sm">Configure apenas alertas que exigem ação</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Redução de Ruído</span>
                  <p className="text-zinc-400 text-sm">Evite alertas duplicados ou desnecessários</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Contexto</span>
                  <p className="text-zinc-400 text-sm">Forneça informações suficientes para diagnóstico</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Resposta a Incidentes</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Playbooks</span>
                  <p className="text-zinc-400 text-sm">Mantenha procedimentos documentados</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Escalação</span>
                  <p className="text-zinc-400 text-sm">Defina níveis claros de escalação</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Postmortem</span>
                  <p className="text-zinc-400 text-sm">Realize análise após incidentes</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
} 
