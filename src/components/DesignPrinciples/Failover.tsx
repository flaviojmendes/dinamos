import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Failover() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gerenciamento de Failover
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Failover refere-se ao processo de alternar automaticamente para um sistema de backup 
          em caso de falha no sistema principal. Isso requer um design robusto para garantir 
          que os dados não sejam perdidos e que o serviço continue funcionando sem interrupções 
          significativas.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
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
            <p className="text-zinc-300 mb-4">
              O sistema monitora constantemente a saúde dos componentes principais. Quando uma 
              falha é detectada, o tráfego é automaticamente redirecionado para sistemas de 
              backup, garantindo a continuidade do serviço.
            </p>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h3>
              <p className="text-zinc-400">
                Um banco digital mantém réplicas de seus servidores em diferentes regiões. 
                Se um servidor principal em Londres falha, o sistema redireciona automaticamente 
                os usuários para um servidor backup em Frankfurt, sem interromper transações 
                ou acesso às contas.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Tipos de Failover
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Failover Ativo-Passivo</h3>
                <p className="text-zinc-400">
                  Um sistema secundário fica em espera, pronto para assumir quando o 
                  primário falha.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Failover Ativo-Ativo</h3>
                <p className="text-zinc-400">
                  Múltiplos sistemas ativos compartilham a carga e podem assumir o trabalho 
                  um do outro.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Failover em Cascata</h3>
                <p className="text-zinc-400">
                  Múltiplos níveis de backup com prioridades diferentes de ativação.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Componentes Essenciais
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Monitoramento</h3>
                <p className="text-zinc-400">
                  Sistemas de monitoramento contínuo para detectar falhas rapidamente.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Replicação de Dados</h3>
                <p className="text-zinc-400">
                  Mecanismos para manter dados sincronizados entre sistemas primários e backups.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Automação</h3>
                <p className="text-zinc-400">
                  Scripts e sistemas para automatizar a detecção e transição durante falhas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Melhores Práticas
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Testes Regulares</h3>
                <p className="text-zinc-400">
                  Realize testes periódicos de failover para garantir que tudo funcione 
                  quando necessário.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Documentação</h3>
                <p className="text-zinc-400">
                  Mantenha documentação clara dos procedimentos de failover e recuperação.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Monitoramento Pós-Failover</h3>
                <p className="text-zinc-400">
                  Acompanhe o desempenho após um failover para garantir a estabilidade.
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
          to="/principios-design/escalabilidade/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explorar Simulador de Escalabilidade
        </Link>
      </motion.div>
    </div>
  );
} 