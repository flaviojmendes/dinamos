import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ServiceOriented() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Design Orientado a Serviços
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Microservices Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Arquitetura de Microsserviços
          </h2>
          <p className="text-zinc-300 mb-6">
            Em uma arquitetura de microsserviços, um sistema é dividido em pequenos serviços independentes, 
            cada um responsável por uma parte específica da funcionalidade do sistema. Cada serviço pode ser 
            desenvolvido, implantado e escalado de maneira independente.
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-200 mb-3">Vantagens</h3>
            <ul className="space-y-2 text-zinc-300">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Flexibilidade para escalar partes específicas do sistema
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Maior modularidade e facilidade de manutenção
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cada equipe pode se concentrar em um único serviço
              </motion.li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-200 mb-3">Desvantagens</h3>
            <ul className="space-y-2 text-zinc-300">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Complexidade aumentada na orquestração e comunicação entre serviços
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Requer uma infraestrutura robusta para gestão de serviços e monitoramento
              </motion.li>
            </ul>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h4>
            <p className="text-zinc-400">
              Um aplicativo de e-commerce onde o serviço de pagamento, inventário e gerenciamento 
              de usuários são todos implementados como microsserviços separados.
            </p>
          </div>
        </motion.div>

        {/* Monolithic Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Arquitetura Monolítica
          </h2>
          <p className="text-zinc-300 mb-6">
            Em uma arquitetura monolítica, todas as funcionalidades do sistema estão integradas em um único 
            código base. Todas as partes do sistema são implantadas juntas, tornando-o mais simples de 
            gerenciar em fases iniciais, mas com limitações em escalabilidade e flexibilidade.
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-200 mb-3">Vantagens</h3>
            <ul className="space-y-2 text-zinc-300">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simplicidade de desenvolvimento inicial
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Menos sobrecarga em comunicação entre componentes
              </motion.li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-200 mb-3">Desvantagens</h3>
            <ul className="space-y-2 text-zinc-300">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Difícil de escalar partes específicas do sistema
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Qualquer mudança em um componente pode exigir a redistribuição de todo o sistema
              </motion.li>
            </ul>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h4>
            <p className="text-zinc-400">
              Um aplicativo simples de e-commerce onde todas as funcionalidades (catálogo de produtos, 
              gerenciamento de usuários, processamento de pedidos) estão em um único código base.
            </p>
          </div>
        </motion.div>
      </div>

      
    </div>
  );
} 