import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Fallback() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Fallback (Plano B)
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-300"
        >
          Uma estratégia essencial para manter a funcionalidade do sistema mesmo quando 
          ocorrem falhas, oferecendo alternativas degradadas mas ainda úteis.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Concept and Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              Como Funciona
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Imagine que você está indo para o trabalho de carro e encontra um 
              congestionamento na sua rota habitual. Em vez de ficar parado, você 
              provavelmente vai optar por uma rota alternativa, mesmo que seja um 
              pouco mais longa.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              O Fallback funciona de maneira similar em sistemas distribuídos: quando 
              um serviço ou funcionalidade falha, o sistema automaticamente muda para 
              uma alternativa predefinida, mesmo que ofereça uma experiência reduzida.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              Benefícios
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Maior Disponibilidade</h3>
                  <p className="text-slate-500 dark:text-slate-400">Sistema continua funcionando mesmo com falhas parciais</p>
                </div>
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
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Melhor Experiência</h3>
                  <p className="text-slate-500 dark:text-slate-400">Usuários ainda conseguem usar funcionalidades básicas</p>
                </div>
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
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">Resiliência</h3>
                  <p className="text-slate-500 dark:text-slate-400">Sistema se adapta automaticamente a condições adversas</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Examples and Best Practices */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              Exemplos do Mundo Real
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Cache Local</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Quando um serviço de dados está indisponível, o sistema usa dados em cache 
                  local, mesmo que potencialmente desatualizados.
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Modo Offline</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Aplicativos que permitem continuar trabalhando offline e sincronizam 
                  quando a conexão é restaurada.
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Recomendações</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Sistema de recomendações que usa sugestões genéricas quando o serviço 
                  personalizado falha.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              Melhores Práticas
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Planejamento</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Identifique pontos críticos e prepare estratégias de fallback antecipadamente
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Comunicação Clara</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Informe aos usuários quando estão usando uma versão degradada do serviço
                </p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Monitoramento</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Acompanhe o uso de fallbacks para identificar problemas recorrentes
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
          to="/principios-design/tolerancia-falhas/fallback/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explorar Simulador de Fallback
        </Link>
      </motion.div>
    </div>
  );
} 