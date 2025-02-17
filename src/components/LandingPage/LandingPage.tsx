import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Countdown from '../Countdown/Countdown';

const calculatePricing = () => {
  const originalPrice = 499;
  const discountedPrice = 399;
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

      {/* Content Showcase Section */}
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
            Uma experiência única de aprendizado que combina teoria aprofundada com prática interativa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Encyclopedia Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-8 border border-zinc-700/30"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-blue-400">Conhecimento Estruturado</h3>
                <p className="text-zinc-400">Base teórica sólida para dominar sistemas distribuídos</p>
              </div>
            </div>
            <ul className="space-y-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Fundamentos Essenciais</span>
                  <p className="text-sm text-zinc-400 mt-1">Conceitos fundamentais explicados de forma clara e objetiva, com analogias do mundo real</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Arquiteturas Modernas</span>
                  <p className="text-sm text-zinc-400 mt-1">Padrões arquiteturais atuais como Microsserviços, Event-Driven e Cloud-Native</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Segurança e Confiabilidade</span>
                  <p className="text-sm text-zinc-400 mt-1">Práticas avançadas de segurança, criptografia e proteção contra ataques comuns</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Consistência e Disponibilidade</span>
                  <p className="text-sm text-zinc-400 mt-1">Estratégias de consenso, replicação e balanceamento de carga em profundidade</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Interactive Learning Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-8 border border-zinc-700/30"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-purple-400">Simuladores Dinâmicos</h3>
                <p className="text-zinc-400">Aprenda na prática com simulações interativas</p>
              </div>
            </div>
            <ul className="space-y-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Simuladores de Falhas</span>
                  <p className="text-sm text-zinc-400 mt-1">Experimente cenários reais de falhas com Circuit Breaker, Timeout e Retry Patterns</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Balanceamento de Carga</span>
                  <p className="text-sm text-zinc-400 mt-1">Visualize diferentes algoritmos de balanceamento em ação e seus impactos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Estratégias de Cache</span>
                  <p className="text-sm text-zinc-400 mt-1">Compare diferentes políticas de cache e seus efeitos na performance</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-white">Segurança em Ação</span>
                  <p className="text-sm text-zinc-400 mt-1">Simuladores de ataques comuns e implementação de medidas de proteção</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-zinc-400">
            Mais de <span className="text-blue-400 font-semibold">15 simuladores interativos</span> e <span className="text-purple-400 font-semibold">conteúdo atualizado</span> para acelerar seu aprendizado
          </p>
          <Link
            to="/intro"
            onClick={() => ReactGA.event({
              category: 'User',
              action: 'Clicked on Content Preview CTA',
            })}
            className="inline-block mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Explorar Conteúdo
          </Link>
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
            Domine sistemas distribuídos com um investimento único e acesso vitalício
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
                  <span className="text-zinc-400 line-through">R$499</span>{" "}
                  <span className="text-white">R$259</span>
                </span>
                <span className="text-green-400 text-sm ml-2">48% OFF</span>
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
                Benefícios Exclusivos
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Acesso vitalício a todo o conteúdo</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mais de 15 simuladores interativos</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Atualizações e novos conteúdos incluídos</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Exemplos práticos do mundo real</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-purple-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Conteúdo Abrangente
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Fundamentos de Sistemas Distribuídos</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Arquiteturas Modernas (Microsserviços, Event-Driven)</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Segurança e Proteção contra Ataques</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Estratégias de Cache e Load Balancing</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Aprendizado Prático
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simuladores de Circuit Breaker e Falhas</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simulações de Ataques e Proteções</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cenários Reais de Escalabilidade</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Experimentos de Performance e Otimização</span>
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