import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Escalabilidade() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Design para Escalabilidade
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Escalabilidade é a capacidade de um sistema lidar com um aumento na carga de trabalho, 
          seja aumentando a capacidade de hardware ou distribuindo a carga entre várias instâncias.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Horizontal Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/horizontal" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Escalabilidade Horizontal
            </h2>
            <p className="text-zinc-400">
              Distribuição de carga entre múltiplos servidores, permitindo crescimento 
              através da adição de mais máquinas.
            </p>
          </Link>
        </motion.div>

        {/* Vertical Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/vertical" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Escalabilidade Vertical
            </h2>
            <p className="text-zinc-400">
              Aumento de recursos em um único servidor, como memória RAM, 
              processadores ou armazenamento.
            </p>
          </Link>
        </motion.div>

        {/* Data Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/consistencia" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Consistência de Dados
            </h2>
            <p className="text-zinc-400">
              Garantia de que todas as cópias de dados em diferentes servidores 
              estejam sincronizadas.
            </p>
          </Link>
        </motion.div>

        {/* Latency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/latencia" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Latência
            </h2>
            <p className="text-zinc-400">
              Gerenciamento do atraso na entrega de dados ou respostas dentro 
              do sistema distribuído.
            </p>
          </Link>
        </motion.div>

        {/* Failover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/principios-design/escalabilidade/failover" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Failover
            </h2>
            <p className="text-zinc-400">
              Processo de alternar automaticamente para um sistema de backup 
              em caso de falha.
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 