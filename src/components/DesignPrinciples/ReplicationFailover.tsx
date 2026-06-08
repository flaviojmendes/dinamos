import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Panel } from '../tactical';

export default function ReplicationFailover() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
            Replicação e failover
          </h2>
          <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
            Estratégias essenciais para garantir a continuidade do serviço através da 
            duplicação de dados e sistemas, com transição automática em caso de falhas.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Panel title="Replicação" accent="cyan">
            <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
              A replicação envolve a criação e manutenção de cópias idênticas de dados 
              ou sistemas em diferentes locais.
            </p>
            <div className="space-y-3">
              <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Tipos de replicação</h3>
                <ul className="list-disc list-inside font-sans text-sm text-slate-500 dark:text-tactical-dim space-y-1.5">
                  <li>Síncrona: Garantia de consistência imediata</li>
                  <li>Assíncrona: Melhor performance, consistência eventual</li>
                  <li>Semi-síncrona: Equilíbrio entre as duas abordagens</li>
                </ul>
              </div>
              <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Benefícios</h3>
                <ul className="list-disc list-inside font-sans text-sm text-slate-500 dark:text-tactical-dim space-y-1.5">
                  <li>Redundância de dados</li>
                  <li>Distribuição geográfica</li>
                  <li>Backup em tempo real</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel title="Failover" accent="amber">
            <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
              Processo automático de mudança para um sistema redundante quando o sistema 
              principal falha.
            </p>
            <div className="space-y-3">
              <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Tipos de failover</h3>
                <ul className="list-disc list-inside font-sans text-sm text-slate-500 dark:text-tactical-dim space-y-1.5">
                  <li>Ativo-passivo: backup em espera</li>
                  <li>Ativo-ativo: ambos os sistemas operacionais</li>
                  <li>Cascata: Múltiplos níveis de backup</li>
                </ul>
              </div>
              <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Componentes</h3>
                <ul className="list-disc list-inside font-sans text-sm text-slate-500 dark:text-tactical-dim space-y-1.5">
                  <li>Monitoramento de saúde</li>
                  <li>Sistema de detecção de falhas</li>
                  <li>Mecanismo de transição</li>
                </ul>
              </div>
            </div>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Panel title="Exemplo do Mundo Real" accent="green">
            <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4 mb-4">
              <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-2">Sistema bancário online</h3>
              <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim mb-4">
                Um banco digital implementa replicação e failover da seguinte forma:
              </p>
              <ul className="list-disc list-inside font-sans text-sm text-slate-500 dark:text-tactical-dim space-y-1.5">
                <li>Replicação síncrona para transações críticas</li>
                <li>Múltiplos datacenters em configuração ativo-ativo</li>
                <li>Monitoramento constante de latência e saúde</li>
                <li>Failover automático em caso de problemas</li>
              </ul>
            </div>
            <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim">
              Se um datacenter apresentar problemas, as transações são automaticamente 
              redirecionadas para outro datacenter sem perda de dados ou interrupção 
              do serviço.
            </p>
          </Panel>

          <Panel title="Melhores Práticas" accent="cyan">
            <ul className="space-y-3">
              <li className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Planejamento</h3>
                <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim">
                  Defina claramente os objetivos de RPO (Recovery Point Objective) e 
                  RTO (Recovery Time Objective) para guiar a implementação.
                </p>
              </li>
              <li className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Testes</h3>
                <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim">
                  Realize testes regulares de failover para garantir que o sistema 
                  funcione conforme esperado em situações reais.
                </p>
              </li>
              <li className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-2">Monitoramento</h3>
                <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim">
                  Implemente monitoramento abrangente para detectar problemas antes que 
                  afetem os usuários finais.
                </p>
              </li>
            </ul>
          </Panel>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to="/principios-design/alta-disponibilidade/replicacao/simulator"
          className="block rounded-xl border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-6 text-center hover:border-emerald-400 dark:hover:border-signal-green transition-colors"
        >
          <h2 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-2">
            Explorar o simulador de replicação e failover
          </h2>
          <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim">
            Experimente na prática como diferentes estratégias de replicação e failover 
            funcionam em cenários de falha.
          </p>
        </Link>
      </motion.div>
    </div>
  );
}
