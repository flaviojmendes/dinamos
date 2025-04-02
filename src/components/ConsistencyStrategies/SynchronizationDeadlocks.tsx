import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Deadlocks() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Deadlocks em Sistemas Distribuídos
        </h1>

        <p className="text-lg text-zinc-300 mb-8">
          Entenda o que são deadlocks, como eles ocorrem em sistemas distribuídos e as diferentes
          estratégias para prevenção e detecção.
        </p>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <strong className="block mb-2 text-blue-300">💡 Conceito Chave:</strong>
          <p className="text-blue-300">
            Deadlocks ocorrem quando dois ou mais processos ficam permanentemente bloqueados,
            cada um esperando por um recurso que está sendo mantido por outro processo.
          </p>
        </div>

        {/* Conditions Section */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Condições para Deadlock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Exclusão Mútua</h3>
              <p className="text-zinc-300">
                Recursos não podem ser compartilhados simultaneamente entre processos.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Posse e Espera</h3>
              <p className="text-zinc-300">
                Processos mantêm recursos enquanto esperam por outros.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Não Preempção</h3>
              <p className="text-zinc-300">
                Recursos não podem ser forçadamente liberados de um processo.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Espera Circular</h3>
              <p className="text-zinc-300">
                Existe uma cadeia circular de processos esperando por recursos.
              </p>
            </div>
          </div>
        </div>

        {/* Prevention Section */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Prevenção de Deadlocks</h2>
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Prevenção por Negação</h3>
              <p className="text-zinc-300 mb-3">
                Negar uma das quatro condições necessárias para deadlock.
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Exclusão Mútua: Permitir compartilhamento de recursos</li>
                <li>Posse e Espera: Requerer alocação de todos os recursos de uma vez</li>
                <li>Não Preempção: Permitir preempção de recursos</li>
                <li>Espera Circular: Impor uma ordem total nos recursos</li>
              </ul>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Prevenção por Evitação</h3>
              <p className="text-zinc-300 mb-3">
                Usar informações sobre o estado do sistema para evitar deadlocks.
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Algoritmo do Banqueiro</li>
                <li>Grafo de Alocação de Recursos</li>
                <li>Análise de Estado Seguro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detection Section */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Detecção de Deadlocks</h2>
          <div className="space-y-4">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Detecção Centralizada</h3>
              <p className="text-zinc-300">
                Um coordenador central monitora o estado do sistema e detecta deadlocks.
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Detecção Distribuída</h3>
              <p className="text-zinc-300">
                Cada processo participa da detecção através de troca de mensagens.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">Próximos Passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/estrategias-de-consistencia/sincronizacao/algoritmos"
              className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-400 group-hover:text-blue-300">
                Algoritmos de Sincronização
              </h3>
              <p className="text-zinc-300">
                Explore algoritmos específicos para prevenção de deadlocks.
              </p>
            </Link>
            <Link
              to="/estrategias-de-consistencia/sincronizacao/simulador"
              className="group bg-zinc-800/50 rounded-lg p-4 hover:bg-zinc-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-purple-400 group-hover:text-purple-300">
                Simulador de Filósofos
              </h3>
              <p className="text-zinc-300">
                Experimente diferentes estratégias de prevenção de deadlocks.
              </p>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 