import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MonitoringMaintenance() {
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
          Monitoramento e Manutenção de Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          O monitoramento e manutenção são aspectos críticos para garantir a saúde, 
          performance e confiabilidade de sistemas distribuídos. Uma estratégia eficaz 
          combina diferentes aspectos de observabilidade com práticas proativas de manutenção.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          A observabilidade em sistemas distribuídos é construída sobre três pilares fundamentais:
          métricas, logs e traces. Juntos, eles fornecem uma visão completa do estado e comportamento do sistema.
        </div>
      </motion.div>

      {/* Observability Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Os Três Pilares da Observabilidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metrics */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-bold text-blue-400">Métricas</h3>
            </div>
            <ul className="space-y-2 text-zinc-300">
              <li>• Dados numéricos ao longo do tempo</li>
              <li>• CPU, memória, latência, throughput</li>
              <li>• Agregações e tendências</li>
              <li>• Base para alertas e dashboards</li>
            </ul>
          </div>

          {/* Logs */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-purple-400">Logs</h3>
            </div>
            <ul className="space-y-2 text-zinc-300">
              <li>• Registros de eventos</li>
              <li>• Debugging e auditoria</li>
              <li>• Contexto detalhado</li>
              <li>• Histórico de ações</li>
            </ul>
          </div>

          {/* Traces */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-green-400">Traces</h3>
            </div>
            <ul className="space-y-2 text-zinc-300">
              <li>• Fluxo de requisições</li>
              <li>• Dependências entre serviços</li>
              <li>• Performance end-to-end</li>
              <li>• Diagnóstico de problemas</li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Métricas Essenciais (Golden Signals)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* USE Method */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Método USE</h3>
            <p className="text-zinc-300 mb-4">
              Utilization, Saturation, and Errors - um método para análise de performance de recursos.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Utilização</span>
                  <p className="text-zinc-400 text-sm">Percentual de tempo que o recurso está ocupado</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Saturação</span>
                  <p className="text-zinc-400 text-sm">Grau de sobrecarga do recurso</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Erros</span>
                  <p className="text-zinc-400 text-sm">Taxa de falhas do recurso</p>
                </div>
              </li>
            </ul>
          </div>

          {/* RED Method */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Método RED</h3>
            <p className="text-zinc-300 mb-4">
              Rate, Errors, and Duration - focado em métricas de requisições e serviços.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Taxa (Rate)</span>
                  <p className="text-zinc-400 text-sm">Número de requisições por segundo</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Erros (Errors)</span>
                  <p className="text-zinc-400 text-sm">Taxa de falhas nas requisições</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Duração (Duration)</span>
                  <p className="text-zinc-400 text-sm">Tempo de resposta das requisições</p>
                </div>
              </li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Ferramentas de Monitoramento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metrics Tools */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Métricas</h3>
            <ul className="space-y-3">
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Prometheus</span>
                <p className="text-zinc-400 text-sm">Coleta e armazenamento de métricas</p>
              </li>
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Grafana</span>
                <p className="text-zinc-400 text-sm">Visualização e dashboards</p>
              </li>
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Datadog</span>
                <p className="text-zinc-400 text-sm">Monitoramento como serviço</p>
              </li>
            </ul>
          </div>

          {/* Logging Tools */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Logs</h3>
            <ul className="space-y-3">
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">ELK Stack</span>
                <p className="text-zinc-400 text-sm">Elasticsearch, Logstash, Kibana</p>
              </li>
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Graylog</span>
                <p className="text-zinc-400 text-sm">Gerenciamento centralizado de logs</p>
              </li>
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Splunk</span>
                <p className="text-zinc-400 text-sm">Análise avançada de logs</p>
              </li>
            </ul>
          </div>

          {/* Tracing Tools */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-green-400">Tracing</h3>
            <ul className="space-y-3">
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Jaeger</span>
                <p className="text-zinc-400 text-sm">Tracing distribuído de código aberto</p>
              </li>
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">Zipkin</span>
                <p className="text-zinc-400 text-sm">Rastreamento de latência</p>
              </li>
              <li className="bg-zinc-800/50 p-3 rounded-lg">
                <span className="text-white font-medium">New Relic</span>
                <p className="text-zinc-400 text-sm">APM e tracing como serviço</p>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Melhores Práticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monitoring Best Practices */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Monitoramento</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Monitoramento Proativo</span>
                  <p className="text-zinc-400 text-sm">Identifique problemas antes que afetem os usuários</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Alertas Significativos</span>
                  <p className="text-zinc-400 text-sm">Configure alertas que realmente importam</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Automação</span>
                  <p className="text-zinc-400 text-sm">Automatize respostas para problemas comuns</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Maintenance Best Practices */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Manutenção</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Manutenção Preventiva</span>
                  <p className="text-zinc-400 text-sm">Agende manutenções regulares</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Documentação</span>
                  <p className="text-zinc-400 text-sm">Mantenha documentação atualizada</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Backup e Recuperação</span>
                  <p className="text-zinc-400 text-sm">Implemente e teste planos de recuperação</p>
                </div>
              </li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Objetivos de Nível de Serviço</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">SLI</h3>
            <p className="text-zinc-300 mb-4">Service Level Indicator</p>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Métricas específicas</li>
              <li>• Latência</li>
              <li>• Disponibilidade</li>
              <li>• Taxa de erros</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">SLO</h3>
            <p className="text-zinc-300 mb-4">Service Level Objective</p>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Metas para SLIs</li>
              <li>• 99.9% uptime</li>
              <li>• Latência &lt; 200ms</li>
              <li>• Error rate &lt; 0.1%</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">SLA</h3>
            <p className="text-zinc-300 mb-4">Service Level Agreement</p>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Contrato formal</li>
              <li>• Consequências</li>
              <li>• Compensações</li>
              <li>• Garantias</li>
            </ul>
          </div>
        </div>
      </motion.div>

    </div>
  );
} 
