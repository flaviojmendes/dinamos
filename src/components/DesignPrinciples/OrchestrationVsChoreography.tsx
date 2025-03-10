import React from 'react';
import { motion } from 'framer-motion';

export default function OrchestrationVsChoreography() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          Orquestração vs Coreografia
        </h1>
        <p className="text-xl text-zinc-300">
          Entenda as diferenças entre os padrões de Orquestração e Coreografia em sistemas distribuídos.
        </p>
      </div>

      {/* Visão Geral */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Orquestração</h3>
            <p className="text-zinc-300 mb-4">
              Um orquestrador central controla o fluxo de trabalho, coordenando as interações entre os serviços.
              Similar a um maestro em uma orquestra, ele dita exatamente o que cada serviço deve fazer e quando.
            </p>
            {/* Diagrama de Orquestração Simplificado */}
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Orquestrador Central */}
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">Orquestrador</text>
                
                {/* Serviços */}
                <rect x="40" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">Serviço A</text>
                
                <rect x="160" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="125" textAnchor="middle" fill="white" fontSize="14">Serviço B</text>
                
                <rect x="280" y="100" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="125" textAnchor="middle" fill="white" fontSize="14">Serviço C</text>
                
                {/* Linhas de Comando */}
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
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Coreografia</h3>
            <p className="text-zinc-300 mb-4">
              Os serviços interagem entre si de forma independente, reagindo a eventos sem um controlador central.
              Similar a uma dança, onde cada participante conhece seus passos e reage aos movimentos dos outros.
            </p>
            {/* Diagrama de Coreografia Simplificado */}
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <svg viewBox="0 0 400 200" className="w-full h-48">
                {/* Serviços */}
                <rect x="40" y="80" width="80" height="40" rx="5" fill="#10B981" />
                <text x="80" y="105" textAnchor="middle" fill="white" fontSize="14">Serviço A</text>
                
                <rect x="280" y="80" width="80" height="40" rx="5" fill="#10B981" />
                <text x="320" y="105" textAnchor="middle" fill="white" fontSize="14">Serviço B</text>
                
                <rect x="160" y="20" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">Serviço C</text>
                
                <rect x="160" y="140" width="80" height="40" rx="5" fill="#10B981" />
                <text x="200" y="165" textAnchor="middle" fill="white" fontSize="14">Serviço D</text>
                
                {/* Eventos/Conexões */}
                <path d="M120 100 L280 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                <path d="M200 60 L200 140" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                <path d="M280 100 L200 140" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                <path d="M120 100 L200 140" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                
                {/* Definição das setas */}
                <defs>
                  <marker
                    id="arrowPurple"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#A855F7"/>
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Comparação Detalhada */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Comparação Detalhada</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Orquestração</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
                <li>Controlador central (orquestrador)</li>
                <li>Fluxo de trabalho explícito</li>
                <li>Fácil de entender e debugar</li>
                <li>Menos flexível a mudanças</li>
                <li>Ponto único de falha</li>
                <li>Mais acoplamento</li>
              </ul>
              {/* Fluxo de Orquestração Simplificado */}
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 400 80" className="w-full h-20">
                  <rect x="20" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                  <text x="60" y="45" textAnchor="middle" fill="white" fontSize="14">Início</text>
                  
                  <rect x="160" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                  <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">Processo</text>
                  
                  <rect x="300" y="20" width="80" height="40" rx="5" fill="#3B82F6" />
                  <text x="340" y="45" textAnchor="middle" fill="white" fontSize="14">Fim</text>
                  
                  <path d="M100 40 L160 40" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M240 40 L300 40" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                </svg>
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Coreografia</h3>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
                <li>Sem controlador central</li>
                <li>Fluxo de trabalho implícito</li>
                <li>Mais difícil de entender</li>
                <li>Mais flexível a mudanças</li>
                <li>Sem ponto único de falha</li>
                <li>Menos acoplamento</li>
              </ul>
              {/* Fluxo de Coreografia Simplificado */}
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 400 80" className="w-full h-20">
                  <circle cx="60" cy="40" r="25" fill="#A855F7" />
                  <text x="60" y="45" textAnchor="middle" fill="white" fontSize="14">Evento 1</text>
                  
                  <circle cx="200" cy="40" r="25" fill="#A855F7" />
                  <text x="200" y="45" textAnchor="middle" fill="white" fontSize="14">Evento 2</text>
                  
                  <circle cx="340" cy="40" r="25" fill="#A855F7" />
                  <text x="340" y="45" textAnchor="middle" fill="white" fontSize="14">Evento 3</text>
                  
                  <path d="M85 40 L175 40" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M225 40 L315 40" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exemplos de Uso */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Exemplos de Uso</h2>
        <div className="space-y-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Orquestração</h3>
            <div className="text-zinc-300 space-y-4">
              <p>
                <strong>Processamento de Pedidos:</strong> Um orquestrador central coordena o fluxo completo:
              </p>
              {/* Diagrama de Processamento de Pedidos Simplificado */}
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 500 160" className="w-full h-40">
                  {/* Orquestrador */}
                  <rect x="200" y="20" width="100" height="40" rx="5" fill="#3B82F6" />
                  <text x="250" y="45" textAnchor="middle" fill="white" fontSize="14">Orquestrador</text>
                  
                  {/* Serviços */}
                  <rect x="40" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="90" y="125" textAnchor="middle" fill="white" fontSize="14">Validação</text>
                  
                  <rect x="160" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="210" y="125" textAnchor="middle" fill="white" fontSize="14">Estoque</text>
                  
                  <rect x="280" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="330" y="125" textAnchor="middle" fill="white" fontSize="14">Pagamento</text>
                  
                  <rect x="400" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="450" y="125" textAnchor="middle" fill="white" fontSize="14">Confirmação</text>
                  
                  {/* Conexões */}
                  <path d="M250 60 L90 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M250 60 L210 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M250 60 L330 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                  <path d="M250 60 L450 100" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Coreografia</h3>
            <div className="text-zinc-300 space-y-4">
              <p>
                <strong>Sistema de Notificações:</strong> Serviços reagem a eventos independentemente:
              </p>
              {/* Diagrama de Sistema de Notificações Simplificado */}
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <svg viewBox="0 0 500 160" className="w-full h-40">
                  {/* Evento Central */}
                  <rect x="200" y="20" width="100" height="40" rx="5" fill="#A855F7" />
                  <text x="250" y="45" textAnchor="middle" fill="white" fontSize="14">Pedido Criado</text>
                  
                  {/* Serviços */}
                  <rect x="40" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="90" y="125" textAnchor="middle" fill="white" fontSize="14">Email</text>
                  
                  <rect x="160" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="210" y="125" textAnchor="middle" fill="white" fontSize="14">SMS</text>
                  
                  <rect x="280" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="330" y="125" textAnchor="middle" fill="white" fontSize="14">Analytics</text>
                  
                  <rect x="400" y="100" width="100" height="40" rx="5" fill="#10B981" />
                  <text x="450" y="125" textAnchor="middle" fill="white" fontSize="14">Logs</text>
                  
                  {/* Conexões */}
                  <path d="M250 60 L90 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M250 60 L210 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M250 60 L330 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                  <path d="M250 60 L450 100" stroke="#A855F7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quando Usar Cada Padrão */}
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Quando Usar Cada Padrão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Use Orquestração Quando:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>O fluxo de trabalho é complexo e precisa de coordenação central</li>
              <li>Você precisa de visibilidade clara do processo</li>
              <li>O processo é estável e raramente muda</li>
              <li>Você precisa de controle total sobre o fluxo</li>
              <li>O processo é sequencial e dependente</li>
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Use Coreografia Quando:</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Os serviços são independentes e podem evoluir separadamente</li>
              <li>Você precisa de alta escalabilidade</li>
              <li>O processo é dinâmico e muda frequentemente</li>
              <li>Você quer reduzir acoplamento entre serviços</li>
              <li>Os eventos podem ser processados em paralelo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 