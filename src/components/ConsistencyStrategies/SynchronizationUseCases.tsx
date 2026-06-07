import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Panel, Tag } from '../tactical';

export default function SynchronizationUseCases() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
            Casos de uso de sincronização
          </h2>
          <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim mb-6">
            A sincronização é fundamental em diversos cenários práticos de sistemas distribuídos.
            Vamos explorar alguns casos de uso comuns e suas implementações.
          </p>
        </div>
        <div className="tactical-panel border-l-2 border-l-signal-cyan p-5">
          <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-2">Conceito chave</div>
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">
            A escolha da estratégia de sincronização deve considerar os requisitos específicos
            do caso de uso, como consistência, performance e tolerância a falhas.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Panel title="Sistema Bancário" accent="cyan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Cenário</div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
                Transferências entre contas em diferentes servidores bancários,
                garantindo consistência e atomicidade das operações.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Tag color="cyan">Transações</Tag>
                <Tag color="cyan">Consistência</Tag>
              </div>
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Implementação</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Two-Phase Commit</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Garante atomicidade das transações</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Lock Distribuído</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Controle de concorrência</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Recuperação</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Rollback em caso de falhas</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Panel title="Inventário E-commerce" accent="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Cenário</div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
                Controle de estoque em múltiplos centros de distribuição,
                evitando overselling e mantendo consistência.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Tag color="green">Estoque</Tag>
                <Tag color="green">Disponibilidade</Tag>
              </div>
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Implementação</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Quorum</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Consenso para atualizações</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Cache</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Performance e consistência</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Replicação</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Sincronização entre centros</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Panel title="Cache Distribuído" accent="amber">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Cenário</div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
                Cache distribuído para melhorar performance e reduzir carga
                no banco de dados principal.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Tag color="amber">Performance</Tag>
                <Tag color="amber">Consistência</Tag>
              </div>
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Implementação</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Invalidação</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Estratégias de cache</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Replicação</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Sincronização entre nós</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 font-sans mt-0.5">›</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Consistência</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Modelos e trade-offs</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Panel title="Melhores Práticas" accent="cyan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Design</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-signal-green font-sans mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Escolha do Algoritmo</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Considere requisitos e trade-offs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-signal-green font-sans mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Falhas</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Planeje recuperação</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-signal-green font-sans mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Performance</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Otimize comunicação</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Implementação</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-signal-green font-sans mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Testes</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Cenários de falha</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-signal-green font-sans mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Monitoramento</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Métricas e alertas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-signal-green font-sans mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Documentação</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">Decisões e trade-offs</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">Próximos Passos</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/estrategias-de-consistencia/sincronizacao/simulador"
            className="tactical-panel p-5 block hover:border-emerald-300 dark:hover:border-signal-green transition-colors"
          >
            <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Simulador</div>
            <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
              Experimente os diferentes casos de uso em nosso simulador interativo.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Tag color="cyan">Interativo</Tag>
              <Tag color="cyan">Visualização</Tag>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/algoritmos"
            className="tactical-panel p-5 block hover:border-emerald-300 dark:hover:border-signal-green transition-colors"
          >
            <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">Algoritmos</div>
            <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
              Explore os algoritmos de sincronização em detalhes.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Tag color="green">Detalhes</Tag>
              <Tag color="green">Implementação</Tag>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
