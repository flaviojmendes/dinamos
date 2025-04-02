import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TwoPhaseCommit() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          Two-Phase Commit (2PC)
        </h1>
        <p className="text-xl text-zinc-300">
          Entenda como o protocolo Two-Phase Commit garante consistência em transações distribuídas.
        </p>
      </div>

      {/* Overview */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Fase 1: Preparação</h3>
            <p className="text-zinc-300 mb-4">
              O coordenador solicita que todos os participantes se preparem para a transação.
              Cada participante deve verificar se pode realizar a operação e responder ao coordenador.
            </p>
            {/* Diagrama de Fase 1 */}
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Coordenador */}
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">Coordenador</text>
                
                {/* Participantes */}
                <rect x="40" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">Participante 1</text>
                
                <rect x="160" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">Participante 2</text>
                
                <rect x="280" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="125" textAnchor="middle" fill="white" fontSize="14">Participante 3</text>
                
                {/* Linhas de Prepare */}
                <path d="M200 60 L80 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                <path d="M200 60 L200 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                <path d="M200 60 L320 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                
                {/* Definição das setas */}
                <defs>
                  <marker
                    id="arrowBlue"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Fase 2: Commit</h3>
            <p className="text-zinc-300 mb-4">
              Com base nas respostas dos participantes, o coordenador decide se a transação
              deve ser confirmada (commit) ou abortada (rollback).
            </p>
            {/* Diagrama de Fase 2 */}
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Coordenador */}
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">Coordenador</text>
                
                {/* Participantes */}
                <rect x="40" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">Participante 1</text>
                
                <rect x="160" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">Participante 2</text>
                
                <rect x="280" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="125" textAnchor="middle" fill="white" fontSize="14">Participante 3</text>
                
                {/* Linhas de Commit */}
                <path d="M200 60 L80 100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                <path d="M200 60 L200 100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                <path d="M200 60 L320 100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
                
                {/* Definição das setas */}
                <defs>
                  <marker
                    id="arrowGreen"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Vantagens</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Garante consistência forte dos dados</li>
              <li>Previne transações parciais</li>
              <li>Processo de decisão transparente</li>
              <li>Atomicidade garantida</li>
              <li>Isolamento entre transações</li>
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Limitações</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Bloqueante (participantes aguardam decisão)</li>
              <li>Sensível a falhas do coordenador</li>
              <li>Maior latência devido às duas fases</li>
              <li>Overhead de comunicação</li>
              <li>Possibilidade de deadlocks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Casos de Uso */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Casos de Uso</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Sistemas Bancários</h3>
            <p className="text-zinc-300">
              Transferências entre contas que envolvem múltiplos bancos ou sistemas.
              Garante que o dinheiro não seja perdido ou duplicado.
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">E-commerce</h3>
            <p className="text-zinc-300">
              Processamento de pedidos que envolvem estoque, pagamento e logística.
              Assegura que todas as etapas sejam concluídas com sucesso.
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Reservas</h3>
            <p className="text-zinc-300">
              Sistemas de reserva de hotéis, voos ou eventos que precisam coordenar
              múltiplos recursos simultaneamente.
            </p>
          </div>
        </div>
      </div>

      {/* Link para o Simulador */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-200 mb-2">Experimente na Prática</h2>
            <p className="text-zinc-300">
              Use nosso simulador interativo para entender melhor como o Two-Phase Commit funciona
              em diferentes cenários.
            </p>
          </div>
          <Link
            to="simulador"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Acessar Simulador
          </Link>
        </div>
      </div>
    </div>
  );
}
