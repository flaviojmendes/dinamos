import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CircuitBreaker() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Circuit Breaker (Disjuntor)
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Uma estratégia essencial para prevenir falhas em cascata em sistemas distribuídos, 
          funcionando de maneira similar a um disjuntor elétrico.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Concept and Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Como Funciona
            </h2>
            <p className="text-zinc-300 mb-6">
              Imagine que a internet da sua casa está com problemas sérios. Você tenta enviar uma mensagem 
              para seu amigo várias vezes, mas ela nunca chega. Ficar insistindo só vai te frustrar e 
              sobrecarregar a rede. É aí que entra o "Circuit Breaker".
            </p>
            <p className="text-zinc-300 mb-6">
              Ele funciona como um disjuntor na sua casa: quando a corrente elétrica está muito alta, 
              ele desliga tudo para evitar danos. No caso dos sistemas, quando muitas tentativas de 
              comunicação falham, o "Circuit Breaker" entra em ação e bloqueia novas tentativas por um tempo.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Benefícios
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Prevenção de Falhas em Cascata</h3>
                  <p className="text-zinc-400">Evita que falhas em um serviço afetem todo o sistema</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Recuperação Automática</h3>
                  <p className="text-zinc-400">Permite que o sistema se recupere naturalmente após falhas</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Melhor Experiência</h3>
                  <p className="text-zinc-400">Falha rápido em vez de deixar usuários esperando</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Example and States */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Exemplo do Mundo Real
            </h2>
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <p className="text-zinc-300">
                Um site de notícias recebe muitas visitas durante um evento importante. De repente, 
                o servidor que armazena as imagens fica sobrecarregado e começa a responder lentamente. 
                O "Circuit Breaker", percebendo essa situação, entra em ação e impede que o site tente 
                buscar novas imagens por alguns minutos. Assim, o site continua funcionando, exibindo 
                as notícias (mesmo sem as imagens), e o servidor de imagens tem tempo para se recuperar.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Estados do Circuit Breaker
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Fechado (Normal)</h3>
                <p className="text-zinc-400">
                  Operação normal, requisições passam normalmente. O circuito monitora falhas.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Aberto (Bloqueado)</h3>
                <p className="text-zinc-400">
                  Muitas falhas detectadas, requisições são bloqueadas por um período.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Semi-Aberto (Teste)</h3>
                <p className="text-zinc-400">
                  Permite algumas requisições para testar se o sistema se recuperou.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 flex justify-center"
      >
        <Link
          to="/principios-design/tolerancia-falhas/circuit-breaker/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explorar Simulador de Circuit Breaker
        </Link>
      </motion.div>
    </div>
  );
} 