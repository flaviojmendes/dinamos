import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Countdown from '../Countdown/Countdown';

const calculatePricing = () => {
  const originalPrice = 499;
  const discountedPrice = 259;
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  return { 
    originalPrice,
    discountedPrice,
    discount
  };
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Domine Sistemas Distribuídos na Prática
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8">
            A plataforma mais completa para aprender arquitetura de sistemas com simuladores interativos e casos reais
          </p>
          <Link
            to="/intro"
            onClick={() => ReactGA.event({
              category: 'User',
              action: 'Clicked on Start Now Button',
            })}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Começar Agora
          </Link>
        </motion.div>
      </div>

      {/* Key Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Conteúdo Completo e Prático
          </h2>
          <p className="text-xl text-zinc-400">
            Tudo que você precisa para se tornar um especialista em sistemas distribuídos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Fundamentals */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
            <div className="bg-blue-500/10 p-3 rounded-lg w-12 h-12 mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-400">Fundamentos Sólidos</h3>
            <ul className="space-y-2 text-zinc-300">
              <li>• Sistemas Distribuídos 101</li>
              <li>• System Design 101</li>
              <li>• Componentes Básicos</li>
              <li>• Arquiteturas Modernas</li>
            </ul>
          </div>

          {/* Interactive Learning */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
            <div className="bg-purple-500/10 p-3 rounded-lg w-12 h-12 mb-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-purple-400">Simuladores Interativos</h3>
            <ul className="space-y-2 text-zinc-300">
              <li>• Circuit Breaker e Falhas</li>
              <li>• Load Balancing e Cache</li>
              <li>• Consenso e Consistência</li>
              <li>• Segurança e Proteção</li>
            </ul>
          </div>

          {/* Real Cases */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
            <div className="bg-green-500/10 p-3 rounded-lg w-12 h-12 mb-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-green-400">Casos Reais</h3>
            <ul className="space-y-2 text-zinc-300">
              <li>• Netflix e YouTube</li>
              <li>• WhatsApp e Uber</li>
              <li>• Spotify e Bit.ly</li>
              <li>• Decisões Técnicas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advanced Topics */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tópicos Avançados
          </h2>
          <p className="text-xl text-zinc-400">
            Domine conceitos essenciais para construir sistemas robustos e escaláveis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Design Principles */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Princípios de Design</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-white">Escalabilidade</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Horizontal Scaling</li>
                  <li>• Vertical Scaling</li>
                  <li>• Replicação</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-white">Disponibilidade</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Failover</li>
                  <li>• Circuit Breaker</li>
                  <li>• Timeout & Retries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security & Monitoring */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Segurança & Monitoramento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-white">Segurança</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Autenticação</li>
                  <li>• Criptografia</li>
                  <li>• Proteção contra Ataques</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-white">Monitoramento</h4>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>• Métricas & KPIs</li>
                  <li>• Logs & Tracing</li>
                  <li>• Health Checks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quem vai te ensinar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Experiência</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>15+ anos de experiência em desenvolvimento de software</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Liderança em empresas de tecnologia</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Projetos em escala global</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Especialidades</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Arquitetura de Sistemas Distribuídos</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Escalabilidade e Performance</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Segurança e Boas Práticas</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-8 border border-zinc-700/30">
            <div className="space-y-6">
              <p className="text-zinc-300 leading-relaxed">
              Olá! Me chamo Flávio, e atualmente atuo como Engineering Manager em Sistemas Distribuídos.
              </p>
              <p className="text-zinc-300 leading-relaxed">
              Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, colocar a mão na massa, experimentar e validar suas soluções.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                No meu dia a dia trabalho em projetos de alta performance, escalabilidade e disponibilidade onde atingimos mais de <span className="font-bold text-green-400">1,5 bilhão</span> de requisições por ano.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Invista no Seu Futuro
          </h2>
          <p className="text-xl text-zinc-400">
            Acesso vitalício a todo o conteúdo com um único pagamento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/50 transition-colors relative overflow-hidden"
          >
            <div className="absolute -right-12 top-8 bg-blue-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
              Preço de Lançamento
            </div>
            <div className="text-center mb-8">
              <div className="text-center">
                <span className="text-4xl font-bold">
                  <span className="text-zinc-400 line-through">R${calculatePricing().originalPrice}</span>{" "}
                  <span className="text-white">R${calculatePricing().discountedPrice}</span>
                </span>
                <span className="text-green-400 text-sm ml-2">{calculatePricing().discount}% OFF</span>
              </div>
              <p className="text-zinc-400">Pagamento único - Acesso vitalício</p>
            </div>
            <Link
              to="/pagamento"
              onClick={() => ReactGA.event({
                category: 'User',
                action: 'Clicked on Payment Button',
              })}
              className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Garantir Minha Vaga
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                O Que Você Recebe
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mais de 15 simuladores interativos para prática hands-on</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>6 estudos de caso detalhados de empresas de tecnologia</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Conteúdo teórico completo com exemplos práticos</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Atualizações e novos conteúdos incluídos</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-purple-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Diferenciais
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simuladores exclusivos para praticar conceitos</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Análise detalhada de decisões técnicas reais</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Conteúdo em português e focado na prática</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Roadmap estruturado de aprendizado</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Pronto para se tornar um especialista?</h2>
          <p className="text-xl mb-8 text-zinc-200">
            Junte-se a centenas de desenvolvedores que já estão dominando sistemas distribuídos na prática
          </p>
          <Link
            to="/pagamento"
            onClick={() => ReactGA.event({
              category: 'User',
              action: 'Clicked on Final CTA',
            })}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Garantir Minha Vaga
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 