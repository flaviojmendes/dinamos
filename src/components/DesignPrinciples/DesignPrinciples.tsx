import React from 'react';
import { Link } from 'react-router-dom';

export default function DesignPrinciples() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Princípios de Design
          </h1>
          <p className="text-lg text-zinc-400">
            Explore os princípios fundamentais que orientam a criação de sistemas distribuídos
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
              Cada princípio aborda aspectos cruciais do design de sistemas distribuídos modernos.
              Entenda como aplicá-los para criar sistemas escaláveis e resilientes.
            </p>
          </div>
        </div>

        {/* Principles Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event-Driven */}
          <Link 
            to="/principios-design/eventos"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Desenvolvimento Orientado a Eventos
                </h2>
                <p className="text-zinc-400 mb-4">
                  Event Sourcing e sistemas de eventos distribuídos.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    Eventos
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Assíncrono
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Service-Oriented */}
          <Link 
            to="/principios-design/servicos"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                  Design Orientado a Serviços
                </h2>
                <p className="text-zinc-400 mb-4">
                  Microsserviços vs Arquitetura Monolítica.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    Serviços
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Arquitetura
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Fault Tolerance */}
          <Link 
            to="/principios-design/tolerancia-falhas"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  Tolerância a Falhas
                </h2>
                <p className="text-zinc-400 mb-4">
                  Retries, Circuit Breakers, Timeout e Fallback.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                    Resiliência
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Recuperação
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Scalability */}
          <Link 
            to="/principios-design/escalabilidade"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                  Design para Escalabilidade
                </h2>
                <p className="text-zinc-400 mb-4">
                  Escalabilidade horizontal e vertical.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                    Crescimento
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Performance
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* High Availability */}
          <Link 
            to="/principios-design/disponibilidade"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  Alta Disponibilidade
                </h2>
                <p className="text-zinc-400 mb-4">
                  Zonas de disponibilidade e replicação.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">
                    Uptime
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    Replicação
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 