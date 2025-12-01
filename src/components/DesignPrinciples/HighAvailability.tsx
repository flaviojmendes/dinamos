import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HighAvailability() {
  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">Alta Disponibilidade</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            A alta disponibilidade garante que o sistema esteja acessível quase o tempo todo, 
            minimizando o tempo de inatividade, mesmo em face de falhas.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Availability Zones Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6"
          >
            <Link 
              to="/principios-design/alta-disponibilidade/zonas"
              className="block hover:bg-slate-100 dark:bg-slate-800 transition-colors rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">
                Zonas de Disponibilidade
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Datacenters separados fisicamente, mas interconectados, dentro de uma mesma região 
                geográfica. Projetados para oferecer redundância e tolerância a falhas locais.
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Exemplo:</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Uma aplicação de streaming de música é implantada em duas zonas de disponibilidade 
                  em Dublin. Se um datacenter sofrer uma queda de energia, a aplicação continua 
                  funcionando normalmente, pois os servidores na outra zona assumem a operação.
                </p>
              </div>
              <div className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 transition-colors">
                Explorar Zonas de Disponibilidade →
              </div>
            </Link>
          </motion.div>

          {/* Replication & Failover Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6"
          >
            <Link 
              to="/principios-design/alta-disponibilidade/replicacao"
              className="block hover:bg-slate-100 dark:bg-slate-800 transition-colors rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">
                Replicação e Failover
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Estratégias para criar e manter cópias de dados ou serviços em vários locais, 
                garantindo a continuidade do serviço mesmo em caso de falhas.
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Exemplo:</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Um banco online utiliza dois servidores principais: um em Londres e outro em 
                  Frankfurt. Se o servidor em Londres apresentar uma falha crítica, o sistema 
                  detecta o problema e redireciona automaticamente todas as transações para 
                  Frankfurt.
                </p>
              </div>
              <div className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 transition-colors">
                Explorar Replicação e Failover →
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white dark:bg-slate-900 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-6">Benefícios da Alta Disponibilidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-green-400">Continuidade</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Garante que os serviços permaneçam disponíveis mesmo durante falhas ou 
                manutenções planejadas.
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-green-400">Confiabilidade</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aumenta a confiança dos usuários ao manter o sistema funcionando de forma 
                consistente e previsível.
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-green-400">Recuperação</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Permite recuperação rápida e automática de falhas, minimizando o impacto 
                nos usuários finais.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 