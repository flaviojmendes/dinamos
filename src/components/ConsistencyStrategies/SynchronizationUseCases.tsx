import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SynchronizationUseCases() {
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
          Casos de Uso de Sincronização
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          A sincronização é fundamental em diversos cenários práticos de sistemas distribuídos.
          Vamos explorar alguns casos de uso comuns e suas implementações.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          A escolha da estratégia de sincronização deve considerar os requisitos específicos
          do caso de uso, como consistência, performance e tolerância a falhas.
        </div>
      </motion.div>

      {/* Banking System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Sistema Bancário</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Cenário</h3>
              <p className="text-zinc-300 mb-4">
                Transferências entre contas em diferentes servidores bancários,
                garantindo consistência e atomicidade das operações.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                  Transações
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                  Consistência
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Implementação</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Two-Phase Commit</span>
                    <p className="text-zinc-400">Garante atomicidade das transações</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Lock Distribuído</span>
                    <p className="text-zinc-400">Controle de concorrência</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Recuperação</span>
                    <p className="text-zinc-400">Rollback em caso de falhas</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* E-commerce Inventory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Inventário E-commerce</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Cenário</h3>
              <p className="text-zinc-300 mb-4">
                Controle de estoque em múltiplos centros de distribuição,
                evitando overselling e mantendo consistência.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  Estoque
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  Disponibilidade
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Implementação</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Quorum</span>
                    <p className="text-zinc-400">Consenso para atualizações</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Cache</span>
                    <p className="text-zinc-400">Performance e consistência</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Replicação</span>
                    <p className="text-zinc-400">Sincronização entre centros</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Distributed Cache */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Cache Distribuído</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Cenário</h3>
              <p className="text-zinc-300 mb-4">
                Cache distribuído para melhorar performance e reduzir carga
                no banco de dados principal.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                  Performance
                </span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                  Consistência
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Implementação</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Invalidação</span>
                    <p className="text-zinc-400">Estratégias de cache</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Replicação</span>
                    <p className="text-zinc-400">Sincronização entre nós</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Consistência</span>
                    <p className="text-zinc-400">Modelos e trade-offs</p>
                  </div>
                </li>
              </ul>
            </div>
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
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Design</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Escolha do Algoritmo</span>
                    <p className="text-zinc-400 text-sm">Considere requisitos e trade-offs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Falhas</span>
                    <p className="text-zinc-400 text-sm">Planeje recuperação</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Performance</span>
                    <p className="text-zinc-400 text-sm">Otimize comunicação</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Implementação</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Testes</span>
                    <p className="text-zinc-400 text-sm">Cenários de falha</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Monitoramento</span>
                    <p className="text-zinc-400 text-sm">Métricas e alertas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Documentação</span>
                    <p className="text-zinc-400 text-sm">Decisões e trade-offs</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Próximos Passos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/estrategias-de-consistencia/sincronizacao/simulador"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Simulador</h3>
            <p className="text-zinc-300 mb-4">
              Experimente os diferentes casos de uso em nosso simulador interativo.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                Interativo
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                Visualização
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/algoritmos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Algoritmos</h3>
            <p className="text-zinc-300 mb-4">
              Explore os algoritmos de sincronização em detalhes.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                Detalhes
              </span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                Implementação
              </span>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 