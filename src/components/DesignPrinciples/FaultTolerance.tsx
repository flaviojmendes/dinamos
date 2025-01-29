import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StrategyCard {
  title: string;
  description: string;
  example: string;
  icon: React.ReactNode;
}

export default function FaultTolerance() {
  const strategies: StrategyCard[] = [
    {
      title: 'Retries',
      description: 'Quando uma operação falha, o sistema tenta executá-la novamente, aumentando a chance de sucesso em caso de falhas temporárias.',
      example: 'Em um aplicativo de compras online, se a confirmação do pedido falhar devido a problemas de rede, o app tenta enviar a requisição novamente automaticamente.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Circuit Breakers',
      description: 'Previne falhas em cascata ao detectar problemas e interromper temporariamente as chamadas a um serviço com problemas.',
      example: 'Quando um servidor de imagens está sobrecarregado, o Circuit Breaker impede novas requisições por um tempo, permitindo que o servidor se recupere.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Timeout',
      description: 'Define um tempo máximo para a conclusão de uma operação, evitando que o sistema fique esperando indefinidamente por uma resposta.',
      example: 'Ao preencher um formulário online, se o servidor não responder em 30 segundos, a operação é cancelada e uma mensagem de erro é exibida.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Fallback',
      description: 'Fornece uma alternativa quando a operação principal falha, garantindo que o sistema continue funcionando mesmo que de forma degradada.',
      example: 'Em um aplicativo de mapas, se o GPS falhar, o sistema usa a localização da rede Wi-Fi como alternativa para mostrar a posição aproximada.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tolerância a Falhas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Projetar sistemas que possam se recuperar ou continuar operando diante de falhas é essencial 
          para manter a confiabilidade e a alta disponibilidade.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                {strategy.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-200 mb-2">{strategy.title}</h2>
                <p className="text-zinc-400 mb-4">{strategy.description}</p>
                <div className="bg-zinc-950/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-2">Exemplo Prático</h3>
                  <p className="text-sm text-zinc-400">{strategy.example}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    
    </div>
  );
} 