import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const features = [
  "Acesso a todos os simuladores interativos",
  "Conteúdo completo sobre System Design",
  "Atualizações regulares de conteúdo",
  "Exemplos práticos do mundo real",
  "Suporte via comunidade",
];

export default function Subscription() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const calculateSavings = () => {
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

  const { 
    savings, 
    percentage, 
    originalMonthlyPrice, 
    discountedMonthlyPrice,
    originalAnnualPrice,
    discountedAnnualPrice,
    monthlyDiscount,
    annualDiscount 
  } = calculateSavings();

  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const response = await fetch('https://us-central1-systemo-76109.cloudfunctions.net/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // get priceId from env
        body: JSON.stringify({
          priceId: selectedPlan === 'monthly' ? import.meta.env.VITE_MONTHLY_PRICE_ID : import.meta.env.VITE_ANNUAL_PRICE_ID,
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.log(session.error);
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Escolha seu Plano
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400"
          >
            Invista em seu conhecimento e desenvolvimento profissional
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-zinc-900/50 rounded-xl p-8 border cursor-pointer transition-all duration-300 ${
              selectedPlan === 'monthly'
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-zinc-800 hover:border-blue-500/50'
            }`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Plano Mensal</h2>
              <div className="mb-2">
                <span className="text-lg text-zinc-500 line-through">R${originalMonthlyPrice}</span>
                <div className="text-4xl font-bold text-blue-500">
                  R${discountedMonthlyPrice}<span className="text-lg text-zinc-400">/mês</span>
                </div>
                <p className="text-sm text-green-400">{monthlyDiscount}% de desconto</p>
              </div>
              <p className="text-zinc-400">Flexibilidade para você</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center">
              <input
                type="radio"
                name="plan"
                value="monthly"
                checked={selectedPlan === 'monthly'}
                onChange={() => setSelectedPlan('monthly')}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedPlan === 'monthly'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-zinc-600'
              } flex items-center justify-center`}>
                {selectedPlan === 'monthly' && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </motion.div>

          {/* Annual Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border cursor-pointer transition-all duration-300 relative overflow-hidden ${
              selectedPlan === 'annual'
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-blue-500/20 hover:border-blue-500/50'
            }`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="absolute -right-12 top-8 bg-blue-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
              Melhor Valor
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Plano Anual</h2>
              <div className="mb-2">
                <span className="text-lg text-zinc-500 line-through">R${originalAnnualPrice}</span>
                <div className="text-4xl font-bold text-blue-500">
                  R${discountedAnnualPrice}<span className="text-lg text-zinc-400">/ano</span>
                </div>
                <p className="text-sm text-green-400">{annualDiscount}% de desconto</p>
              </div>
              <p className="text-zinc-400">Economize R${savings} ({percentage}% em relação ao plano mensal)</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center">
              <input
                type="radio"
                name="plan"
                value="annual"
                checked={selectedPlan === 'annual'}
                onChange={() => setSelectedPlan('annual')}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-full border-2 ${
                selectedPlan === 'annual'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-zinc-600'
              } flex items-center justify-center`}>
                {selectedPlan === 'annual' && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subscribe Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleSubscription}
            disabled={isLoading}
            className={`px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
              selectedPlan === 'annual'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </div>
            ) : (
              'Assinar Agora'
            )}
          </button>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-4">Por que se inscrever?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-blue-400">Aprendizado Prático</h4>
              <p className="text-zinc-400">
                Simuladores interativos que permitem experimentar cenários reais de sistemas distribuídos,
                facilitando a compreensão de conceitos complexos.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-purple-400">Conteúdo Atualizado</h4>
              <p className="text-zinc-400">
                Material constantemente atualizado com as últimas tendências e melhores práticas em
                arquitetura de sistemas.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-green-400">Desenvolvimento Profissional</h4>
              <p className="text-zinc-400">
                Aprenda habilidades essenciais para avançar sua carreira como arquiteto ou engenheiro
                de software.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-yellow-400">Comunidade</h4>
              <p className="text-zinc-400">
                Faça parte de uma comunidade de desenvolvedores, compartilhe experiências e aprenda
                com outros profissionais.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 