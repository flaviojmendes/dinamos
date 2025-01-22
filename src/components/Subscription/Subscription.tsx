import React from 'react';
import { motion } from 'framer-motion';

const features = [
  "Acesso a todos os simuladores interativos",
  "Conteúdo completo sobre System Design",
  "Atualizações regulares de conteúdo",
  "Exemplos práticos do mundo real",
  "Suporte via comunidade",
];

export default function Subscription() {
  const calculateSavings = () => {
    const monthlyAnnualCost = 49 * 12;
    const annualCost = 399;
    const savings = monthlyAnnualCost - annualCost;
    const percentage = Math.round((savings / monthlyAnnualCost) * 100);
    return { savings, percentage };
  };

  const { savings, percentage } = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
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
            className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-800 hover:border-blue-500/50 transition-colors"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Plano Mensal</h2>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                R$49<span className="text-lg text-zinc-400">/mês</span>
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

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Começar Agora
            </button>
          </motion.div>

          {/* Annual Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/50 transition-colors relative overflow-hidden"
          >
            {/* Best Value Badge */}
            <div className="absolute -right-12 top-8 bg-blue-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
              Melhor Valor
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Plano Anual</h2>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                R$399<span className="text-lg text-zinc-400">/ano</span>
              </div>
              <p className="text-zinc-400">Economize R${savings} ({percentage}% de desconto)</p>
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

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Escolher Plano Anual
            </button>
          </motion.div>
        </div>

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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Perguntas Frequentes</h3>
          <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-zinc-400">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo
                ou taxas de cancelamento.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Como funciona o acesso ao conteúdo?</h4>
              <p className="text-zinc-400">
                Após a assinatura, você terá acesso imediato a todo o conteúdo da plataforma, incluindo
                simuladores e material didático.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Existe garantia de satisfação?</h4>
              <p className="text-zinc-400">
                Oferecemos garantia de 7 dias. Se você não estiver satisfeito, devolvemos seu dinheiro
                sem questionamentos (salvo taxas de processamento).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 