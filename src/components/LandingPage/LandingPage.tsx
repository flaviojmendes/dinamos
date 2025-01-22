import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Domine Sistemas Distribuídos
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8">
            Aprenda na prática com simuladores interativos e exemplos do mundo real
          </p>
          <Link
            to="/intro"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Começar Agora
          </Link>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div className="bg-zinc-900/50 rounded-xl p-6">
            <div className="text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Componentes Básicos</h3>
            <p className="text-zinc-400">
              Entenda os blocos fundamentais: Banco de Dados, Cache, Load Balancer, Message Queue, CDN e API Gateway
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-6">
            <div className="text-purple-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Simuladores Interativos</h3>
            <p className="text-zinc-400">
              Experimente na prática conceitos complexos com simuladores que demonstram cenários reais
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-6">
            <div className="text-green-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Princípios de Design</h3>
            <p className="text-zinc-400">
              Aprenda escalabilidade, alta disponibilidade, tolerância a falhas e arquiteturas modernas
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">O que você vai aprender</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Escalabilidade</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Escalabilidade Horizontal (Scale Out)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Escalabilidade Vertical (Scale Up)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Consistência e Latência</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Alta Disponibilidade</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Replicação de Dados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Estratégias de Failover</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Zonas de Disponibilidade</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Tolerância a Falhas</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Circuit Breaker Pattern</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Estratégias de Retry</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Timeout e Fallback</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Arquiteturas Modernas</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Event-Driven Architecture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Microsserviços</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Design Patterns Distribuídos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-zinc-200">
            Junte-se a nós e aprenda a construir sistemas distribuídos robustos e escaláveis
          </p>
          <Link
            to="/intro"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Começar Jornada
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 