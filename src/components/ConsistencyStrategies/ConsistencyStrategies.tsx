import React from 'react';
import { Link } from 'react-router-dom';

export default function ConsistencyStrategies() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Estratégias de Consistência
          </h1>
          <p className="text-lg text-zinc-400">
            Explore diferentes mecanismos para garantir consistência em sistemas distribuídos
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <div className="text-blue-400 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-blue-300">
              A consistência é um dos principais desafios em sistemas distribuídos. 
              Entenda como diferentes estratégias ajudam a manter a ordem e a coerência dos dados.
            </p>
          </div>
        </div>

        {/* Strategies Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Consensus Strategy */}
          <Link 
            to="/estrategias-de-consistencia/consenso"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Estratégia de Consenso
                </h2>
                <p className="text-zinc-400 mb-4">
                  Entenda como os sistemas distribuídos alcançam acordo em decisões críticas usando
                  protocolos de consenso.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    Consenso
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Acordo Distribuído
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Lamport Timestamps */}
          <Link 
            to="/estrategias-de-consistencia/lamport-timestamps"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Relógios Lógicos de Lamport
                </h2>
                <p className="text-zinc-400 mb-4">
                  Descubra como os timestamps de Lamport estabelecem ordem em eventos distribuídos
                  e garantem a consistência causal entre processos.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Ordenação
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    Causalidade
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-4">Em Breve</h2>
          <p className="text-zinc-400">
            Mais estratégias de consistência serão adicionadas em breve, incluindo:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Relógios Vetoriais
            </li>
            <li className="flex items-center gap-2 text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Consistência Eventual
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 