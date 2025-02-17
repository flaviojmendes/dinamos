import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Performance() {
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
          Análise de Performance em Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          A análise de performance é fundamental para garantir que sistemas distribuídos 
          atendam seus requisitos de desempenho e escalabilidade. Uma abordagem sistemática 
          para medição, análise e otimização é essencial.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          Performance em sistemas distribuídos é multidimensional, envolvendo latência,
          throughput, utilização de recursos e escalabilidade. A otimização de um aspecto
          frequentemente impacta outros.
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Métricas de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Métricas Principais</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Latência</span>
                  <p className="text-zinc-400 text-sm">Tempo de resposta para requisições</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Throughput</span>
                  <p className="text-zinc-400 text-sm">Requisições processadas por segundo</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Utilização</span>
                  <p className="text-zinc-400 text-sm">Uso de recursos do sistema</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Advanced Metrics */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Métricas Avançadas</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Apdex</span>
                  <p className="text-zinc-400 text-sm">Índice de satisfação do usuário</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Percentis</span>
                  <p className="text-zinc-400 text-sm">P95, P99 de latência</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-white font-medium">Saturação</span>
                  <p className="text-zinc-400 text-sm">Ponto de sobrecarga do sistema</p>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Testes de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Load Testing */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Teste de Carga</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Comportamento sob carga normal</li>
              <li>• Tempos de resposta médios</li>
              <li>• Uso de recursos</li>
              <li>• Throughput sustentado</li>
            </ul>
          </div>

          {/* Stress Testing */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Teste de Stress</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Limites do sistema</li>
              <li>• Comportamento sob sobrecarga</li>
              <li>• Pontos de falha</li>
              <li>• Recuperação após falha</li>
            </ul>
          </div>

          {/* Scalability Testing */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Teste de Escalabilidade</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Capacidade de crescimento</li>
              <li>• Elasticidade</li>
              <li>• Custos de escala</li>
              <li>• Limites de recursos</li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Ferramentas de Performance</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Monitoramento</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">APM Tools</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• New Relic</li>
                    <li>• Datadog</li>
                    <li>• Dynatrace</li>
                    <li>• AppDynamics</li>
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Profiling</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• JProfiler</li>
                    <li>• YourKit</li>
                    <li>• pprof</li>
                    <li>• async-profiler</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Teste de Carga</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Ferramentas Open Source</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• Apache JMeter</li>
                    <li>• Gatling</li>
                    <li>• k6</li>
                    <li>• Locust</li>
                  </ul>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Serviços em Nuvem</h4>
                  <ul className="text-zinc-300 space-y-2 text-sm">
                    <li>• BlazeMeter</li>
                    <li>• Flood.io</li>
                    <li>• LoadRunner Cloud</li>
                    <li>• AWS Load Testing</li>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Otimização de Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategies */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Estratégias</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Caching</span>
                  <p className="text-zinc-400 text-sm">Implementação de diferentes níveis de cache</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Load Balancing</span>
                  <p className="text-zinc-400 text-sm">Distribuição eficiente de carga</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Otimização de Código</span>
                  <p className="text-zinc-400 text-sm">Melhoria de algoritmos e estruturas de dados</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Techniques */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Técnicas</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Lazy Loading</span>
                  <p className="text-zinc-400 text-sm">Carregamento sob demanda de recursos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Connection Pooling</span>
                  <p className="text-zinc-400 text-sm">Reutilização de conexões</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Asynchronous Processing</span>
                  <p className="text-zinc-400 text-sm">Processamento não bloqueante</p>
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
        <h2 className="text-2xl font-bold mb-6 text-white">Melhores Práticas</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Desenvolvimento</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Profiling Contínuo</span>
                    <p className="text-zinc-400 text-sm">Monitore performance durante o desenvolvimento</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Testes de Carga</span>
                    <p className="text-zinc-400 text-sm">Inclua testes de performance no CI/CD</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Benchmarking</span>
                    <p className="text-zinc-400 text-sm">Compare performance entre versões</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Produção</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Monitoramento Real-Time</span>
                    <p className="text-zinc-400 text-sm">Acompanhe métricas em tempo real</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Capacity Planning</span>
                    <p className="text-zinc-400 text-sm">Planeje recursos com antecedência</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Otimização Contínua</span>
                    <p className="text-zinc-400 text-sm">Melhore com base em dados reais</p>
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