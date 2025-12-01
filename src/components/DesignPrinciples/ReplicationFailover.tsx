import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ReplicationFailover() {
  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">Replicação e Failover</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Estratégias essenciais para garantir a continuidade do serviço através da 
            duplicação de dados e sistemas, com transição automática em caso de falhas.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Replication Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">Replicação</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                A replicação envolve a criação e manutenção de cópias idênticas de dados 
                ou sistemas em diferentes locais.
              </p>
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Tipos de Replicação</h3>
                  <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-2">
                    <li>Síncrona: Garantia de consistência imediata</li>
                    <li>Assíncrona: Melhor performance, consistência eventual</li>
                    <li>Semi-síncrona: Equilíbrio entre as duas abordagens</li>
                  </ul>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Benefícios</h3>
                  <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-2">
                    <li>Redundância de dados</li>
                    <li>Distribuição geográfica</li>
                    <li>Backup em tempo real</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Failover Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">Failover</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Processo automático de mudança para um sistema redundante quando o sistema 
                principal falha.
              </p>
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Tipos de Failover</h3>
                  <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-2">
                    <li>Ativo-Passivo: Backup em espera</li>
                    <li>Ativo-Ativo: Ambos os sistemas operacionais</li>
                    <li>Cascata: Múltiplos níveis de backup</li>
                  </ul>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Componentes</h3>
                  <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-2">
                    <li>Monitoramento de saúde</li>
                    <li>Sistema de detecção de falhas</li>
                    <li>Mecanismo de transição</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Real World Example */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">Exemplo do Mundo Real</h2>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium mb-2">Sistema Bancário Online</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Um banco digital implementa replicação e failover da seguinte forma:
                </p>
                <ul className="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-2">
                  <li>Replicação síncrona para transações críticas</li>
                  <li>Múltiplos datacenters em configuração ativo-ativo</li>
                  <li>Monitoramento constante de latência e saúde</li>
                  <li>Failover automático em caso de problemas</li>
                </ul>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Se um datacenter apresentar problemas, as transações são automaticamente 
                redirecionadas para outro datacenter sem perda de dados ou interrupção 
                do serviço.
              </p>
            </div>

            {/* Best Practices */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">Melhores Práticas</h2>
              <ul className="space-y-4">
                <li className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Planejamento</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Defina claramente os objetivos de RPO (Recovery Point Objective) e 
                    RTO (Recovery Time Objective) para guiar a implementação.
                  </p>
                </li>
                <li className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Testes</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Realize testes regulares de failover para garantir que o sistema 
                    funcione conforme esperado em situações reais.
                  </p>
                </li>
                <li className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Monitoramento</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Implemente monitoramento abrangente para detectar problemas antes que 
                    afetem os usuários finais.
                  </p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Simulator Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Link
            to="/principios-design/alta-disponibilidade/replicacao/simulator"
            className="block bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">
              Explorar o Simulador de Replicação e Failover
            </h2>
            <p className="text-slate-700 dark:text-slate-200">
              Experimente na prática como diferentes estratégias de replicação e failover 
              funcionam em cenários de falha.
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 