import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Synchronization() {
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
          Sincronização em Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          A sincronização é um dos desafios fundamentais em sistemas distribuídos. Ela garante que diferentes
          processos ou serviços coordenem suas ações de forma eficiente e segura.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          A sincronização eficiente é crucial para manter a consistência e evitar condições de corrida em
          sistemas distribuídos. No entanto, é importante encontrar o equilíbrio entre sincronização e
          performance.
        </div>
      </motion.div>

      {/* Fundamentals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Fundamentos</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">Conceitos Básicos</h3>
          <p className="text-zinc-300 mb-6">
            A sincronização em sistemas distribuídos envolve vários conceitos fundamentais que precisam
            ser compreendidos para implementar soluções eficientes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">Exclusão Mútua</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Recursos Compartilhados</span>
                    <p className="text-zinc-400">Garantia de acesso exclusivo a recursos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Condições de Corrida</span>
                    <p className="text-zinc-400">Prevenção de conflitos de acesso</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">Coordenação</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Consenso</span>
                    <p className="text-zinc-400">Acordo entre processos distribuídos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Ordenação</span>
                    <p className="text-zinc-400">Sequenciamento de eventos distribuídos</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Tópicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/estrategias-de-consistencia/sincronizacao/fundamentos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Fundamentos</h3>
            <p className="text-zinc-300 mb-4">
              Aprenda os conceitos básicos de sincronização usando o exemplo clássico do Jantar dos Filósofos.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                Exclusão Mútua
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                Condições de Corrida
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/deadlocks"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Deadlocks</h3>
            <p className="text-zinc-300 mb-4">
              Entenda como prevenir e detectar deadlocks em sistemas distribuídos.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                Prevenção
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                Detecção
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/algoritmos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-green-400">Algoritmos</h3>
            <p className="text-zinc-300 mb-4">
              Explore diferentes algoritmos de sincronização distribuída.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                Algoritmo do Padeiro
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                Token Ring
              </span>
            </div>
          </Link>

         
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Melhores Práticas</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Design e Implementação</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Minimize a Sincronização</span>
                    <p className="text-zinc-400 text-sm">Use sincronização apenas quando necessário</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Granularidade Apropriada</span>
                    <p className="text-zinc-400 text-sm">Escolha o nível certo de sincronização</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Timeout e Recuperação</span>
                    <p className="text-zinc-400 text-sm">Implemente mecanismos de timeout e recuperação</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Monitoramento e Debugging</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Logging Detalhado</span>
                    <p className="text-zinc-400 text-sm">Mantenha logs detalhados de operações de sincronização</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Métricas de Performance</span>
                    <p className="text-zinc-400 text-sm">Monitore o impacto da sincronização na performance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Detecção de Deadlocks</span>
                    <p className="text-zinc-400 text-sm">Implemente mecanismos de detecção de deadlocks</p>
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