import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function VerticalScaling() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Escalabilidade Vertical (Scale-Up)
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Estratégia que envolve melhorar o desempenho de um único servidor ao adicionar 
          mais recursos, como memória RAM, armazenamento ou processadores mais rápidos.
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
              Como Funciona
            </h2>
            <p className="text-zinc-300 mb-4">
              É como trocar um carro pequeno por um maior para transportar mais passageiros. 
              Apesar de ser relativamente simples de implementar, tem um limite físico: um 
              servidor só pode ser atualizado até certo ponto antes de atingir sua capacidade máxima.
            </p>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h3>
              <p className="text-zinc-400">
                Uma loja virtual que inicialmente utiliza um servidor básico decide atualizar 
                para um servidor mais potente porque o tráfego ao site aumentou. Essa atualização 
                resolve o problema a curto prazo, mas, se o número de visitantes continuar crescendo, 
                essa abordagem pode deixar de ser suficiente.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Vantagens
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
                  <h3 className="font-medium text-zinc-200">Simplicidade</h3>
                  <p className="text-zinc-400">Fácil de implementar e gerenciar</p>
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
                  <h3 className="font-medium text-zinc-200">Menor Complexidade</h3>
                  <p className="text-zinc-400">Não requer mudanças na arquitetura do sistema</p>
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
                  <h3 className="font-medium text-zinc-200">Solução Rápida</h3>
                  <p className="text-zinc-400">Ideal para resolver problemas imediatos de performance</p>
                </div>
              </motion.li>
            </ul>
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
              Limitações
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Limite Físico</h3>
                <p className="text-zinc-400">
                  Existe um limite máximo para quanto um único servidor pode ser melhorado
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Custo</h3>
                <p className="text-zinc-400">
                  Hardware mais potente geralmente tem um custo exponencialmente maior
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Ponto Único de Falha</h3>
                <p className="text-zinc-400">
                  Se o servidor falhar, todo o sistema fica indisponível
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Quando Usar
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Aplicações Pequenas</h3>
                <p className="text-zinc-400">
                  Ideal para sistemas com tráfego moderado e crescimento previsível
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Solução Temporária</h3>
                <p className="text-zinc-400">
                  Quando precisa de uma solução rápida para problemas de performance
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Sistemas Monolíticos</h3>
                <p className="text-zinc-400">
                  Para aplicações que não foram projetadas para distribuição
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