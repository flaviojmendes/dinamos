import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Latency() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Latência
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Latência é o atraso na entrega de dados ou respostas dentro de um sistema. Em sistemas 
          distribuídos, especialmente aqueles espalhados por várias regiões geográficas, a latência 
          pode aumentar devido à distância física entre servidores ou à complexidade na comunicação.
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
              O Impacto da Latência
            </h2>
            <p className="text-zinc-300 mb-4">
              A latência pode afetar significativamente a experiência do usuário e o 
              desempenho geral do sistema. Em aplicações modernas, mesmo pequenos atrasos 
              podem ter um impacto significativo na satisfação do usuário e nas métricas 
              de negócio.
            </p>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h3>
              <p className="text-zinc-400">
                Um usuário na Irlanda tenta acessar um site hospedado em servidores nos EUA. 
                A distância geográfica e o número de pontos de comunicação na rede podem causar 
                atrasos, tornando o carregamento do site mais lento para esse usuário.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Tipos de Latência
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Latência de Rede</h3>
                <p className="text-zinc-400">
                  Tempo necessário para um pacote de dados viajar entre dois pontos na rede.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Latência de Processamento</h3>
                <p className="text-zinc-400">
                  Tempo que o sistema leva para processar uma requisição e gerar uma resposta.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Latência de Armazenamento</h3>
                <p className="text-zinc-400">
                  Tempo necessário para ler ou escrever dados em um sistema de armazenamento.
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
              Estratégias de Otimização
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">CDN</h3>
                <p className="text-zinc-400">
                  Uso de redes de distribuição de conteúdo para aproximar os dados dos usuários.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Caching</h3>
                <p className="text-zinc-400">
                  Armazenamento de dados frequentemente acessados em locais mais próximos 
                  ao usuário.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Edge Computing</h3>
                <p className="text-zinc-400">
                  Processamento de dados mais próximo ao ponto de origem para reduzir atrasos.
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
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Monitoramento</h3>
                <p className="text-zinc-400">
                  Implemente métricas detalhadas para identificar e resolver gargalos 
                  de latência.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Otimização de Código</h3>
                <p className="text-zinc-400">
                  Mantenha o código eficiente e otimizado para minimizar o tempo de processamento.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Distribuição Geográfica</h3>
                <p className="text-zinc-400">
                  Distribua recursos em diferentes regiões para atender usuários localmente.
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