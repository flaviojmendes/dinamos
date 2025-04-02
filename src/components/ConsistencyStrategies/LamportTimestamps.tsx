import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LamportTimestamps() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          Relógios Lógicos de Lamport
        </h1>
        <p className="text-xl text-zinc-300">
          Entenda como os timestamps de Lamport estabelecem ordem em eventos distribuídos.
        </p>
      </div>

      {/* Overview */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">O Problema</h3>
            <p className="text-zinc-300">
              Em sistemas distribuídos, não existe um relógio global que todos os processos possam consultar.
              Cada processo tem seu próprio relógio local, que pode divergir dos demais.
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">A Solução</h3>
            <p className="text-zinc-300">
              Os relógios lógicos de Lamport estabelecem uma ordem parcial de eventos baseada na relação
              "aconteceu antes", permitindo determinar a causalidade entre eventos distribuídos.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Como Funciona</h2>
        <div className="space-y-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Regras Básicas</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Cada processo mantém um contador que é incrementado em eventos locais</li>
              <li>Ao enviar uma mensagem, o processo inclui seu timestamp atual</li>
              <li>Ao receber uma mensagem, o processo atualiza seu contador para o máximo entre seu valor local e o timestamp recebido + 1</li>
            </ul>
          </div>

          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Propriedades</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Se evento A causou evento B, então timestamp(A) {'<'} timestamp(B)</li>
              <li>Se timestamp(A) {'<'} timestamp(B), então A pode ter causado B</li>
              <li>Se timestamp(A) = timestamp(B), então A e B são concorrentes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Aplicações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Casos de Uso</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Ordenação de mensagens em sistemas de mensageria distribuídos</li>
              <li>Detecção de condições de corrida em sistemas concorrentes</li>
              <li>Manutenção de consistência em bancos de dados distribuídos</li>
              <li>Sincronização de estados em jogos multiplayer</li>
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Limitações</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Não capturam relações de concorrência (eventos que aconteceram em paralelo)</li>
              <li>Não fornecem um tempo global absoluto</li>
              <li>Podem gerar ordenações diferentes em diferentes execuções do sistema</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Exemplo Prático</h2>
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Sistema de Chat Distribuído</h3>
          <div className="space-y-4">
            <p className="text-zinc-300">
              Em um sistema de chat distribuído, os timestamps de Lamport podem ser usados para:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Ordenar mensagens de diferentes usuários</li>
              <li>Garantir que respostas apareçam depois das mensagens originais</li>
              <li>Detectar e resolver conflitos de edição</li>
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
              Use nosso simulador interativo para entender melhor como os relógios lógicos de Lamport
              funcionam em diferentes cenários.
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