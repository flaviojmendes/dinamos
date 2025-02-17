import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Metrics() {
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
          Métricas e KPIs em Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          Métricas e KPIs (Key Performance Indicators) são fundamentais para entender o comportamento,
          performance e saúde de sistemas distribuídos. Elas fornecem insights quantitativos que
          permitem tomar decisões baseadas em dados.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          Métricas efetivas devem ser SMART: Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais.
          Isso garante que os dados coletados sejam realmente úteis para a tomada de decisão.
        </div>
      </motion.div>

      {/* Core Metrics Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Categorias de Métricas Essenciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Métricas de Sistema</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Utilização de CPU</span>
                  <p className="text-zinc-400 text-sm">Percentual de uso do processador por serviço</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Uso de Memória</span>
                  <p className="text-zinc-400 text-sm">Consumo de RAM e memória virtual</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">I/O de Disco</span>
                  <p className="text-zinc-400 text-sm">Taxa de leitura/escrita e latência de disco</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Application Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Métricas de Aplicação</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Throughput</span>
                  <p className="text-zinc-400 text-sm">Requisições processadas por segundo</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Latência</span>
                  <p className="text-zinc-400 text-sm">Tempo de resposta das requisições</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Taxa de Erros</span>
                  <p className="text-zinc-400 text-sm">Percentual de requisições com falha</p>
                </div>
              </li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Métricas de Performance</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Latência</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Percentis</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• P50 (Mediana): &lt; 100ms</li>
                    <li>• P90: &lt; 200ms</li>
                    <li>• P99: &lt; 500ms</li>
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Componentes</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• Network Time</li>
                    <li>• Processing Time</li>
                    <li>• Queue Time</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Throughput</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Medidas</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• RPS (Requests per Second)</li>
                    <li>• TPS (Transactions per Second)</li>
                    <li>• QPS (Queries per Second)</li>
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Capacidade</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• Peak Load</li>
                    <li>• Sustained Load</li>
                    <li>• Burst Capacity</li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">KPIs de Negócio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Disponibilidade</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Uptime</li>
              <li>• MTBF (Mean Time Between Failures)</li>
              <li>• MTTR (Mean Time To Recovery)</li>
              <li>• Error Budget</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Qualidade</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Success Rate</li>
              <li>• Error Rate</li>
              <li>• Data Quality</li>
              <li>• User Satisfaction</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Custo</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Infrastructure Cost</li>
              <li>• Cost per Request</li>
              <li>• Resource Utilization</li>
              <li>• ROI</li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Implementação com Prometheus</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <p className="text-zinc-300 mb-4">
            Exemplo de configuração de métricas usando Prometheus e sua linguagem de consulta PromQL:
          </p>
          <div className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
            <pre className="text-sm text-zinc-300">
{`# Métrica de latência usando histograma
http_request_duration_seconds_bucket{path="/api/users", method="GET"}

# Taxa de erros
rate(http_requests_total{status=~"5.."}[5m])

# Uso de CPU
rate(process_cpu_seconds_total[1m])

# Uso de memória
process_resident_memory_bytes`}
            </pre>
          </div>
          <p className="text-zinc-400 text-sm">
            Estas métricas podem ser visualizadas em dashboards do Grafana para monitoramento em tempo real.
          </p>
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
            <h3 className="text-xl font-bold mb-4 text-blue-400">Coleta de Métricas</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Padronização</span>
                  <p className="text-zinc-400 text-sm">Use convenções de nomenclatura consistentes</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Granularidade</span>
                  <p className="text-zinc-400 text-sm">Equilibre detalhamento e overhead</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Agregação</span>
                  <p className="text-zinc-400 text-sm">Defina períodos adequados de agregação</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Visualização</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Dashboards</span>
                  <p className="text-zinc-400 text-sm">Organize métricas relacionadas</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Alertas</span>
                  <p className="text-zinc-400 text-sm">Configure thresholds significativos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Correlação</span>
                  <p className="text-zinc-400 text-sm">Relacione métricas para análise</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      
    </div>
  );
} 