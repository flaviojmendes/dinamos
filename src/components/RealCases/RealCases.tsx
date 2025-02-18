import React from 'react';
import { motion } from 'framer-motion';

const RealCases: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          Casos Reais de System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Aprenda com as arquiteturas e decisões técnicas das maiores empresas de tecnologia do mundo
        </p>
      </div>

      {/* Introduction Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">
          Por que estudar casos reais?
        </h2>
        <div className="space-y-4 text-zinc-300">
          <p>
            Analisar casos reais de system design das grandes empresas de tecnologia é uma das formas mais efetivas de aprender sobre arquitetura de sistemas distribuídos. Estas empresas enfrentam desafios únicos de escala, disponibilidade e performance que nos permitem entender:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Como decisões arquiteturais impactam o crescimento do sistema</li>
            <li>Estratégias práticas para lidar com milhões de usuários</li>
            <li>Trade-offs reais entre diferentes escolhas técnicas</li>
            <li>Evolução de arquiteturas ao longo do tempo</li>
            <li>Soluções inovadoras para problemas complexos</li>
          </ul>
        </div>
      </section>

      {/* What We'll Learn Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">
          O que vamos aprender?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Desafios Técnicos</h3>
            <p className="text-zinc-300">
              Entenderemos os principais desafios técnicos enfrentados por cada empresa e como eles foram superados com soluções criativas e eficientes.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Evolução Arquitetural</h3>
            <p className="text-zinc-300">
              Veremos como as arquiteturas evoluíram de sistemas simples para complexas infraestruturas distribuídas, adaptando-se ao crescimento.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Decisões e Trade-offs</h3>
            <p className="text-zinc-300">
              Analisaremos as decisões técnicas tomadas, seus impactos e os trade-offs considerados em cada escolha arquitetural.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Melhores Práticas</h3>
            <p className="text-zinc-300">
              Extrairemos as melhores práticas e padrões que podem ser aplicados em projetos de diferentes escalas.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
              Casos em Desenvolvimento
            </h2>
            <p className="text-zinc-300">
              Estamos preparando análises detalhadas dos seguintes casos:
            </p>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                YouTube: Sistema de processamento e distribuição de vídeos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Spotify: Arquitetura de streaming de música
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                URL Shortener: Design de serviço de encurtamento de URLs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                WhatsApp: Sistema de mensagens em tempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Netflix: Streaming de vídeo e recomendação
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Uber: Geolocalização e matching em tempo real
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-8">
        <p className="text-zinc-400 mb-4">
          Fique atento às atualizações! Novos casos serão adicionados regularmente.
        </p>
        <div className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">
          Em breve
        </div>
      </section>
    </motion.div>
  );
};

export default RealCases; 