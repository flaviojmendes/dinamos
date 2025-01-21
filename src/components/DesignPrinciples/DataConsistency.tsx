import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DataConsistency() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Consistência de Dados
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          A consistência de dados significa garantir que todas as cópias de dados em diferentes 
          servidores sejam atualizadas simultaneamente, um desafio crucial em sistemas distribuídos.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              O Desafio
            </h2>
            <p className="text-zinc-300 mb-4">
              Em sistemas distribuídos, especialmente quando há várias réplicas de dados 
              espalhadas por diferentes regiões geográficas, manter a consistência torna-se 
              um desafio complexo. Quanto maior o sistema, mais difícil é garantir que todas 
              as mudanças sejam refletidas de forma instantânea em todas as réplicas.
            </p>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h3>
              <p className="text-zinc-400">
                Em uma plataforma de e-commerce, se um cliente compra o último item de um 
                estoque, é crucial que essa informação seja imediatamente refletida em todos 
                os servidores. Caso contrário, outro cliente pode tentar comprar o mesmo item, 
                gerando problemas como pedidos duplicados ou insatisfação do cliente.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Modelos de Consistência
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Consistência Forte</h3>
                <p className="text-zinc-400">
                  Todas as réplicas são atualizadas antes de qualquer nova operação, 
                  garantindo que todos vejam os mesmos dados.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Consistência Eventual</h3>
                <p className="text-zinc-400">
                  As réplicas podem divergir temporariamente, mas eventualmente convergem 
                  para o mesmo estado.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Consistência Causal</h3>
                <p className="text-zinc-400">
                  Eventos relacionados são vistos na mesma ordem por todos os participantes 
                  do sistema.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Estratégias de Implementação
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Quorum</h3>
                <p className="text-zinc-400">
                  Requer um número mínimo de nós para confirmar uma operação antes de 
                  considerá-la bem-sucedida.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Vector Clocks</h3>
                <p className="text-zinc-400">
                  Mantém um registro da ordem dos eventos para detectar e resolver conflitos 
                  de atualização.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Consensus Protocols</h3>
                <p className="text-zinc-400">
                  Algoritmos como Paxos ou Raft para garantir acordo entre múltiplos nós.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Melhores Práticas
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Escolha do Modelo</h3>
                <p className="text-zinc-400">
                  Selecione o modelo de consistência apropriado para cada tipo de dado 
                  e caso de uso.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Monitoramento</h3>
                <p className="text-zinc-400">
                  Implemente sistemas robustos de monitoramento para detectar e resolver 
                  inconsistências.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Resolução de Conflitos</h3>
                <p className="text-zinc-400">
                  Defina estratégias claras para resolver conflitos quando ocorrerem 
                  atualizações simultâneas.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 flex justify-center"
      >
        <Link
          to="/principios-design/escalabilidade/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explorar Simulador de Escalabilidade
        </Link>
      </motion.div>
    </div>
  );
} 