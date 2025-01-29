import React from 'react';
import { Link } from 'react-router-dom';

export default function LamportTimestamps() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Relógios Lógicos de Lamport
          </h1>
          <p className="text-lg text-zinc-400">
            Entenda como ordenar eventos em sistemas distribuídos usando timestamps lógicos
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
              Os Relógios Lógicos de Lamport são fundamentais para entender a ordenação de eventos em sistemas distribuídos.
              Eles nos ajudam a estabelecer uma ordem consistente de eventos mesmo quando não temos um relógio global sincronizado.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8">
          {/* What are Lamport Timestamps */}
          <section className="bg-zinc-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">O que são Timestamps de Lamport?</h2>
            <p className="text-zinc-300">
              Timestamps de Lamport são um mecanismo criado por Leslie Lamport para ordenar eventos em um sistema distribuído.
              Eles resolvem o problema de determinar a ordem dos eventos quando múltiplos processos estão executando em paralelo
              e se comunicando através de mensagens.
            </p>
          </section>

          {/* How they work */}
          <section className="bg-zinc-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Como funcionam?</h2>
            <p className="text-zinc-300 mb-4">
              O funcionamento dos timestamps de Lamport é baseado em três regras simples:
            </p>
            <div className="grid gap-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Regra 1</h3>
                <p className="text-zinc-400">
                  Cada processo mantém um contador local que é incrementado antes de cada evento.
                </p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Regra 2</h3>
                <p className="text-zinc-400">
                  Quando um processo envia uma mensagem, ele inclui seu contador atual na mensagem.
                </p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Regra 3</h3>
                <p className="text-zinc-400">
                  Ao receber uma mensagem, o processo atualiza seu contador para o máximo entre:
                </p>
                <ul className="list-disc list-inside text-zinc-400 mt-2">
                  <li>Seu contador atual</li>
                  <li>O timestamp da mensagem recebida</li>
                </ul>
                <p className="text-zinc-400 mt-2">E então incrementa o contador.</p>
              </div>
            </div>
          </section>

          {/* Properties */}
          <section className="bg-zinc-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Propriedades Importantes</h2>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Relação "Aconteceu Antes"</h3>
              <p className="text-zinc-400">
                Se um evento A causou um evento B, então o timestamp de A será menor que o timestamp de B.
                No entanto, se o timestamp de A é menor que B, não podemos garantir que A causou B.
                Esta é a propriedade conhecida como "relação aconteceu antes" (happens-before relation).
              </p>
            </div>
          </section>

          {/* Practical Applications */}
          <section className="bg-zinc-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Aplicações Práticas</h2>
            <p className="text-zinc-300 mb-4">
              Os timestamps de Lamport são utilizados em várias situações:
            </p>
            <ul className="grid gap-2">
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Ordenação de mensagens em sistemas de mensageria distribuídos
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Detecção de condições de corrida em sistemas concorrentes
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Manutenção de consistência em bancos de dados distribuídos
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Sincronização de estados em jogos multiplayer
              </li>
            </ul>
          </section>

          {/* Limitations */}
          <section className="bg-zinc-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Limitações</h2>
            <ul className="grid gap-2">
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Não capturam relações de concorrência (eventos que aconteceram em paralelo)
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Não fornecem um tempo global absoluto
              </li>
              <li className="flex items-center gap-2 text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Podem gerar ordenações diferentes em diferentes execuções do sistema
              </li>
            </ul>
          </section>

          {/* Try it out */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Experimente na Prática</h2>
            <p className="text-zinc-300 mb-4">
              Quer ver como os timestamps de Lamport funcionam na prática? Experimente nosso simulador interativo!
            </p>
            <Link
              to="simulador"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Acessar Simulador
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 