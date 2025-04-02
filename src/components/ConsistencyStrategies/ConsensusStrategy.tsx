import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ConsensusStrategy() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          Estratégias de Consenso
        </h1>
        <p className="text-xl text-zinc-300">
          Entenda como os sistemas distribuídos alcançam acordo em decisões críticas usando protocolos de consenso.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200">O que é Consenso?</h2>
        <p className="text-zinc-300">
          Consenso é um dos problemas fundamentais em sistemas distribuídos. É o processo pelo qual um grupo de nós em um sistema distribuído concorda em um valor ou decisão comum, mesmo na presença de falhas.
        </p>
      </div>

      {/* Raft Protocol */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Protocolo Raft</h2>
        <p className="text-zinc-300">
          Raft é um protocolo de consenso projetado para ser mais compreensível que o Paxos. Ele divide o problema em três subproblemas independentes:
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-2">
          <li>Eleição de líder</li>
          <li>Replicação de log</li>
          <li>Garantia de segurança</li>
        </ul>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">Exemplo Prático</h3>
          <p className="text-zinc-300">
            Em um cluster de 5 nós executando Raft, quando o líder falha, os seguidores iniciam uma nova eleição após um timeout. O nó que receber a maioria dos votos se torna o novo líder.
          </p>
        </div>
      </div>

      {/* Paxos Protocol */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Protocolo Paxos</h2>
        <p className="text-zinc-300">
          Paxos é um protocolo de consenso que garante consistência em um sistema distribuído, mesmo quando nós podem falhar ou mensagens podem ser perdidas.
        </p>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">Como Funciona</h3>
          <p className="text-zinc-300">
            O protocolo opera em duas fases principais:
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-2">
            <li>Fase 1: Prepare/Promise</li>
            <li>Fase 2: Accept/Accepted</li>
          </ul>
        </div>
      </div>

      {/* ZooKeeper */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">ZooKeeper</h2>
        <p className="text-zinc-300">
          ZooKeeper é um serviço de coordenação para sistemas distribuídos que implementa seu próprio protocolo de consenso (ZAB - ZooKeeper Atomic Broadcast).
        </p>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">Características</h3>
          <ul className="list-disc list-inside text-zinc-300 space-y-2">
            <li>Ordenação total de atualizações</li>
            <li>Atomicidade</li>
            <li>Consistência sequencial</li>
            <li>Durabilidade</li>
          </ul>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Vantagens e Desvantagens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Vantagens</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Forte consistência</li>
              <li>Tolerância a falhas</li>
              <li>Recuperação automática</li>
              <li>Garantia de ordem</li>
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Desvantagens</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Maior latência</li>
              <li>Complexidade de implementação</li>
              <li>Overhead de comunicação</li>
              <li>Necessidade de quórum</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Link to Simulator */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-200 mb-2">Experimente na Prática</h2>
            <p className="text-zinc-300">
              Use nosso simulador interativo para entender melhor como os protocolos de consenso funcionam
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