import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Countdown from '../Countdown/Countdown';

const calculatePricing = () => {
  const originalPrice = 499;
  const discountedPrice = 399;
  const specialPrice = 200;
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const specialDiscount = Math.round(((originalPrice - specialPrice) / originalPrice) * 100);
  return { 
    originalPrice,
    discountedPrice,
    specialPrice,
    discount,
    specialDiscount
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
            Domine Sistemas Distribuídos
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8">
            Aprenda na prática com simuladores interativos e exemplos do mundo real
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

      {/* Credentials Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quem vai te ensinar
            </h2>
            <div className="prose prose-invert">
              <p className="text-lg text-zinc-300 mb-4">
                Olá! Me chamo Flávio atualmente atuo como <a href='https://www.linkedin.com/in/flaviojmendes/' target='_blank'><span className="text-blue-400 font-medium">Engineering Manager</span></a> em Sistemas Distribuídos.
              </p>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mais de 16 anos de experiência em desenvolvimento de software</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Experiência em grandes instituições financeiras, órgãos públicos e institutos de pesquisa</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Vasta experiência em projetos de diferentes escalas e complexidades</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Conhecimento prático em arquiteturas modernas e sistemas distribuídos</span>
                </li>
                <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Divulgação de conteúdo gratuito para a comunidade <a href='https://instagram.com/trilhainfo' target='_blank'><span className="text-blue-400 font-medium">@trilhainfo</span></a></span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20">
            <blockquote className="text-lg text-zinc-300 italic">
              "Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, colocar a mão na massa, experimentar e validar suas soluções."
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                <img src="https://media.licdn.com/dms/image/v2/D4E03AQFMfMauUM84Fw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707169753089?e=1743033600&v=beta&t=0dB9ultfR3WzXB0LfHq7nJ5QiVPBjX_7Ydk4OK-XwJM" alt="Flávio Mendes" className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <div className="font-medium">Flávio Mendes</div>
                <div className="text-sm text-zinc-400">Engineering Manager</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simulators Showcase */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          
          <p className="text-xl text-zinc-400">
            Aprenda na prática com simuladores que demonstram cenários reais
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Circuit Breaker Simulator */}
          <div className="bg-zinc-900/50 rounded-xl overflow-hidden">
            <div className="aspect-video bg-zinc-800 relative">
              {/* Placeholder for GIF */}
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                <img src="/circuit.gif" alt="Circuit Breaker" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Circuit Breaker Pattern</h3>
              <p className="text-zinc-400 text-sm">
                Veja como o circuit breaker protege seu sistema contra falhas em cascata
              </p>
            </div>
          </div>

          {/* Load Balancer Simulator */}
          <div className="bg-zinc-900/50 rounded-xl overflow-hidden">
            <div className="aspect-video bg-zinc-800 relative">
              {/* Placeholder for GIF */}
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                <img src="/loadbalancer.gif" alt="Load Balancer" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Load Balancer</h3>
              <p className="text-zinc-400 text-sm">
                Experimente diferentes algoritmos de balanceamento de carga
              </p>
            </div>
          </div>

          {/* Cache Simulator */}
          <div className="bg-zinc-900/50 rounded-xl overflow-hidden">
            <div className="aspect-video bg-zinc-800 relative">
              {/* Placeholder for GIF */}
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                <img src="/cache.gif" alt="Cache" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Cache Strategies</h3>
              <p className="text-zinc-400 text-sm">
                Descubra como diferentes estratégias de cache impactam a performance
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-zinc-400 text-lg">
            E muito mais! No Dinamos você encontra simuladores para todos os conceitos importantes de sistemas distribuídos.
          </p>
          
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div className="bg-zinc-900/50 rounded-xl p-6">
            <div className="text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Componentes Básicos</h3>
            <p className="text-zinc-400">
              Entenda os blocos fundamentais: Banco de Dados, Cache, Load Balancer, Message Queue, CDN e API Gateway
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-6">
            <div className="text-purple-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Simuladores Interativos</h3>
            <p className="text-zinc-400">
              Experimente na prática conceitos complexos com simuladores que demonstram cenários reais
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-6">
            <div className="text-green-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Princípios de Design</h3>
            <p className="text-zinc-400">
              Aprenda escalabilidade, alta disponibilidade, tolerância a falhas e arquiteturas modernas
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">O que você vai aprender</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Fundamentos</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Introdução a Sistemas Distribuídos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Conceitos através de analogias práticas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>System Design 101</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Componentes Básicos</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Bancos de Dados (SQL e NoSQL)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cache e Estratégias de Caching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Load Balancer e Algoritmos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Message Queue e Event-Driven</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>CDN e API Gateway</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Princípios de Design</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Arquitetura Orientada a Eventos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Monolito vs Microsserviços</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Tolerância a Falhas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Estratégias de Consistência</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Protocolos de Consenso</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Relógios Lógicos de Lamport</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Consistência Eventual</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Segurança</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Autenticação e OAuth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Autorização e RBAC</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Criptografia e SSL/TLS</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Prevenção contra Ataques</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Simuladores Interativos</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Circuit Breaker Pattern</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Load Balancer Algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cache Strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>JWT Token</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>E muito mais!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Planos e Preços</h2>
          <p className="text-xl text-zinc-400 text-center mb-12">
            Invista em seu conhecimento e desenvolvimento profissional
          </p>

          <div className="grid grid-cols-1 max-w-lg mx-auto">
            {/* Single Payment Plan */}
            <div className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/50 transition-colors relative overflow-hidden">
              <div className="absolute -right-12 top-8 bg-red-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
                Oferta Especial
              </div>
              <div className="absolute -right-12 top-20 bg-blue-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
                Preço de Lançamento
              </div>
              <div className="text-center mb-4">
                <div className="inline-block bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm mb-4">
                  Oferta válida até 31 de Janeiro
                </div>
                <Countdown />
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Acesso Vitalício</h3>
                <div className="mb-2">
                  <span className="text-lg text-zinc-500 line-through">R${calculatePricing().originalPrice}</span>
                  {/* <div className="text-lg text-zinc-500 line-through">R${calculatePricing().discountedPrice}</div> */}
                  <div className="text-4xl font-bold text-blue-500">
                    R${calculatePricing().specialPrice}
                  </div>
                  <p className="text-sm text-green-400">{calculatePricing().specialDiscount}% de desconto</p>
                </div>
                <p className="text-zinc-400">Pagamento único - Acesso para sempre</p>
              </div>
              <Link
                to="/pagamento"
                onClick={() => ReactGA.event({
                  category: 'User',
                  action: 'Clicked on Start Now Button',
                })}
                className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-zinc-200">
            Junte-se a nós e aprenda a construir sistemas distribuídos robustos e escaláveis
          </p>
          <Link
            to="/intro"
            onClick={() => ReactGA.event({
              category: 'User',
              action: 'Clicked on Start Now Button',
            })}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Começar Jornada
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 