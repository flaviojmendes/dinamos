import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ConsistencyStrategies() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Estratégias de Consistência
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Em sistemas distribuídos, a consistência dos dados é um desafio fundamental que requer estratégias bem definidas para garantir a confiabilidade e integridade das informações.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consensus Strategy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <Link to="/estrategias-de-consistencia/consenso" className="space-y-4 block">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Estratégias de Consenso
            </h2>
            <p className="text-zinc-400">
              Protocolos e mecanismos para garantir acordo entre múltiplos nós em um sistema distribuído.
            </p>
          </Link>
        </motion.div>

        {/* Strong Consistency Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <div className="space-y-4 block opacity-50 cursor-not-allowed">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Consistência Forte
            </h2>
            <p className="text-zinc-400">
              Garantia de que todos os nós têm a mesma visão dos dados em todos os momentos.
            </p>
            <div className="absolute -top-2 right-2 bg-zinc-800 text-white text-xs px-2 py-0.5 rounded-full">
              Em breve
            </div>
          </div>
        </motion.div>

        {/* Eventual Consistency Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <div className="space-y-4 block opacity-50 cursor-not-allowed">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Consistência Eventual
            </h2>
            <p className="text-zinc-400">
              Modelo onde as réplicas podem divergir temporariamente, mas convergem com o tempo.
            </p>
            <div className="absolute -top-2 right-2 bg-zinc-800 text-white text-xs px-2 py-0.5 rounded-full">
              Em breve
            </div>
          </div>
        </motion.div>

        {/* Causal Consistency Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
        >
          <div className="space-y-4 block opacity-50 cursor-not-allowed">
            <div className="text-blue-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Consistência Causal
            </h2>
            <p className="text-zinc-400">
              Garante que operações relacionadas causalmente sejam vistas na mesma ordem por todos os nós.
            </p>
            <div className="absolute -top-2 right-2 bg-zinc-800 text-white text-xs px-2 py-0.5 rounded-full">
              Em breve
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 