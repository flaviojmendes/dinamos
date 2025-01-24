import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
const calculatePricing = () => {
  const originalMonthlyPrice = 79;
  const discountedMonthlyPrice = 49;
  const originalAnnualPrice = 599;
  const discountedAnnualPrice = 399;
  const monthlyAnnualCost = discountedMonthlyPrice * 12;
  const savings = monthlyAnnualCost - discountedAnnualPrice;
  const percentage = Math.round((savings / monthlyAnnualCost) * 100);
  return { 
    savings, 
    percentage,
    originalMonthlyPrice,
    discountedMonthlyPrice,
    originalAnnualPrice,
    discountedAnnualPrice,
    monthlyDiscount: Math.round(((originalMonthlyPrice - discountedMonthlyPrice) / originalMonthlyPrice) * 100),
    annualDiscount: Math.round(((originalAnnualPrice - discountedAnnualPrice) / originalAnnualPrice) * 100)
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
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Escalabilidade</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Escalabilidade Horizontal (Scale Out)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Escalabilidade Vertical (Scale Up)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Consistência e Latência</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Alta Disponibilidade</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Replicação de Dados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Estratégias de Failover</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Zonas de Disponibilidade</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Tolerância a Falhas</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Circuit Breaker Pattern</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Estratégias de Retry</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Timeout e Fallback</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Arquiteturas Modernas</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Event-Driven Architecture</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Microsserviços</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Design Patterns Distribuídos</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-800 hover:border-blue-500/50 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Plano Mensal</h3>
                <div className="mb-2">
                  <span className="text-lg text-zinc-500 line-through">R${calculatePricing().originalMonthlyPrice}</span>
                  <div className="text-4xl font-bold text-blue-500">
                    R${calculatePricing().discountedMonthlyPrice}<span className="text-lg text-zinc-400">/mês</span>
                  </div>
                  <p className="text-sm text-green-400">{calculatePricing().monthlyDiscount}% de desconto</p>
                </div>
                <p className="text-zinc-400">Flexibilidade para você</p>
              </div>
              <Link
                to="/pagamento"
                onClick={() => ReactGA.event({
                  category: 'User',
                  action: 'Clicked on Start Now Button',
                })}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Começar Agora
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/50 transition-colors relative overflow-hidden">
              <div className="absolute -right-12 top-8 bg-blue-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
                Melhor Valor
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Plano Anual</h3>
                <div className="mb-2">
                  <span className="text-lg text-zinc-500 line-through">R${calculatePricing().originalAnnualPrice}</span>
                  <div className="text-4xl font-bold text-blue-500">
                    R${calculatePricing().discountedAnnualPrice}<span className="text-lg text-zinc-400">/ano</span>
                  </div>
                  <p className="text-sm text-green-400">{calculatePricing().annualDiscount}% de desconto</p>
                </div>
                <p className="text-zinc-400">Economize R${calculatePricing().savings} ({calculatePricing().percentage}% em relação ao plano mensal)</p>
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