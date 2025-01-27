import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ConsensusStrategy() {
  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Estratégias de Consenso</h1>

        {/* Introduction */}
        <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">O que é Consenso?</h2>
          <p className="text-zinc-300">
            Consenso é um dos problemas fundamentais em sistemas distribuídos. É o processo pelo qual um grupo de nós em um sistema distribuído concorda em um valor ou decisão comum, mesmo na presença de falhas.
          </p>
        </div>

        {/* Raft Protocol */}
        <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">Protocolo Raft</h2>
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
        <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">Protocolo Paxos</h2>
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
        <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">ZooKeeper</h2>
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
        <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-blue-400">Vantagens e Desvantagens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">Vantagens</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li>Forte consistência</li>
                <li>Tolerância a falhas</li>
                <li>Recuperação automática</li>
                <li>Garantia de ordem</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">Desvantagens</h3>
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
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Experimente na Prática</h2>
          <p className="text-zinc-300 mb-4">
            Quer ver como esses protocolos funcionam na prática? Experimente nosso simulador interativo!
          </p>
          <Link
            to="simulador"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 