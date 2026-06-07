import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, Tag, TacticalButton } from '../tactical';

interface Process {
  id: number;
  state: 'idle' | 'requesting' | 'executing';
  number?: number;
  timestamp?: number;
}

export default function SynchronizationAlgorithms() {
  const { t } = useTranslation();
  const [bakeryProcesses, setBakeryProcesses] = useState<Process[]>([
    { id: 0, state: 'idle' },
    { id: 1, state: 'idle' },
    { id: 2, state: 'idle' },
  ]);
  const [nextBakeryNumber, setNextBakeryNumber] = useState(1);

  const [tokenRingProcesses, setTokenRingProcesses] = useState<Process[]>([
    { id: 0, state: 'idle' },
    { id: 1, state: 'idle' },
    { id: 2, state: 'idle' },
    { id: 3, state: 'idle' },
  ]);
  const [tokenPosition, setTokenPosition] = useState(0);

  const [ricartProcesses, setRicartProcesses] = useState<Process[]>([
    { id: 0, state: 'idle', timestamp: 0 },
    { id: 1, state: 'idle', timestamp: 0 },
    { id: 2, state: 'idle', timestamp: 0 },
  ]);

  const requestBakeryAccess = (processId: number) => {
    setBakeryProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, state: 'requesting', number: nextBakeryNumber }
        : p
    ));
    setNextBakeryNumber(prev => prev + 1);
    
    setTimeout(() => {
      setBakeryProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, state: 'executing' } : p
      ));
      
      setTimeout(() => {
        setBakeryProcesses(prev => prev.map(p => 
          p.id === processId ? { ...p, state: 'idle', number: undefined } : p
        ));
      }, 2000);
    }, 1000);
  };

  const moveToken = () => {
    setTokenPosition(prev => (prev + 1) % tokenRingProcesses.length);
    setTokenRingProcesses(prev => prev.map(p => ({
      ...p,
      state: p.id === (tokenPosition + 1) % tokenRingProcesses.length ? 'executing' : 'idle'
    })));
  };

  const requestRicartAccess = (processId: number) => {
    const timestamp = Date.now();
    setRicartProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, state: 'requesting', timestamp }
        : p
    ));

    setTimeout(() => {
      setRicartProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, state: 'executing' } : p
      ));

      setTimeout(() => {
        setRicartProcesses(prev => prev.map(p => 
          p.id === processId ? { ...p, state: 'idle' } : p
        ));
      }, 2000);
    }, 1000);
  };

  const getProcessBorder = (state: Process['state']) => {
    switch (state) {
      case 'idle': return 'border-tactical-border bg-tactical-raised text-slate-900 dark:text-tactical-text';
      case 'requesting': return 'border-signal-amber bg-signal-amber/10 text-signal-amber';
      case 'executing': return 'border-signal-green bg-signal-green/10 text-signal-green';
      default: return 'border-tactical-border bg-tactical-raised';
    }
  };

  const getProcessBadge = (state: Process['state']): React.ComponentProps<typeof StatusBadge>['variant'] => {
    switch (state) {
      case 'idle': return 'offline';
      case 'requesting': return 'pending';
      case 'executing': return 'active';
      default: return 'offline';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
            {t('design_principles.algorithms.title')}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim mb-6">
            {t('design_principles.algorithms.intro')}
          </p>
        </div>
        <div className="tactical-panel border-l-2 border-l-signal-cyan p-5">
          <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-2">{t('design_principles.algorithms.key_concept_label')}</div>
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">
            {t('design_principles.algorithms.key_concept_text')}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Panel title={t('design_principles.algorithms.bakery.title')} accent="cyan">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">{t('design_principles.algorithms.bakery.concept_title')}</div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
                {t('design_principles.algorithms.bakery.concept_p')}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag color="cyan">{t('design_principles.algorithms.bakery.badges.total_order')}</Tag>
                <Tag color="cyan">{t('design_principles.algorithms.bakery.badges.fairness')}</Tag>
              </div>

              <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="font-mono text-signal-cyan">
{`// Estrutura do processo
type Process = {
  id: number;
  number: number | null;  // Número da senha
  choosing: boolean;      // Está pegando senha?
}

// Pegar uma senha
function getNumber(process: Process, processes: Process[]) {
  process.choosing = true;
  process.number = 1 + Math.max(
    ...processes.map(p => p.number ?? 0)
  );
  process.choosing = false;
}

// Tentar entrar na seção crítica
function enterCriticalSection(process: Process, processes: Process[]) {
  getNumber(process, processes);
  
  // Esperar outros processos
  for (const other of processes) {
    // Esperar se outro está escolhendo número
    while (other.choosing) { /* wait */ }
    
    // Esperar processos com prioridade maior
    while (
      other.number !== null && (
        other.number < process.number ||
        (other.number === process.number && 
         other.id < process.id)
      )
    ) { /* wait */ }
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4">
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.bakery.demo_title')}</div>
              <div className="space-y-4">
                {bakeryProcesses.map(process => (
                  <div 
                    key={process.id}
                    className="flex items-center gap-4"
                  >
                    <motion.div 
                      className={`w-32 h-12 rounded-lg border flex items-center justify-center font-sans text-sm ${getProcessBorder(process.state)}`}
                      animate={{
                        scale: process.state === 'idle' ? 1 : 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {t('design_principles.algorithms.bakery.labels.process')} {process.id}
                    </motion.div>
                    {process.number && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-full border border-slate-200 dark:border-tactical-border px-3 py-1 font-sans text-sm text-slate-700 dark:text-tactical-text"
                      >
                        {t('design_principles.algorithms.bakery.labels.ticket')}: <span className="font-mono tabular-nums">{process.number}</span>
                      </motion.div>
                    )}
                    {process.state === 'idle' && (
                      <TacticalButton size="sm" variant="primary" onClick={() => requestBakeryAccess(process.id)}>
                        {t('design_principles.algorithms.bakery.labels.request_access')}
                      </TacticalButton>
                    )}
                    {process.state !== 'idle' && (
                      <StatusBadge variant={getProcessBadge(process.state)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Panel title={t('design_principles.algorithms.token_ring.title')} accent="green">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">{t('design_principles.algorithms.token_ring.concept_title')}</div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
                {t('design_principles.algorithms.token_ring.concept_p')}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag color="green">{t('design_principles.algorithms.token_ring.badges.single_token')}</Tag>
                <Tag color="green">{t('design_principles.algorithms.token_ring.badges.circular_passing')}</Tag>
              </div>

              <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="font-mono text-signal-green">
{`// Estrutura do processo
type Process = {
  id: number;
  hasToken: boolean;
  nextProcess: Process;
}

// Implementação do Token Ring
class TokenRing {
  private processes: Process[];
  
  constructor(numProcesses: number) {
    // Criar anel de processos
    this.processes = Array.from(
      { length: numProcesses },
      (_, i) => ({
        id: i,
        hasToken: i === 0, // Processo 0 inicia com token
        nextProcess: null
      })
    );
    
    // Conectar processos em anel
    for (let i = 0; i < numProcesses; i++) {
      this.processes[i].nextProcess = 
        this.processes[(i + 1) % numProcesses];
    }
  }
  
  // Passar token para próximo processo
  passToken(process: Process) {
    if (process.hasToken) {
      process.hasToken = false;
      process.nextProcess.hasToken = true;
    }
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4">
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.token_ring.demo_title')}</div>
              <div className="relative aspect-square">
                {tokenRingProcesses.map((process, index) => {
                  const angle = (index * 2 * Math.PI) / tokenRingProcesses.length;
                  const radius = 40;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);

                  return (
                    <motion.div
                      key={process.id}
                      className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-lg flex items-center justify-center font-sans text-xs ${
                        tokenPosition === process.id 
                          ? 'border-2 border-signal-green bg-signal-green/10 text-signal-green'
                          : 'border border-tactical-border bg-tactical-raised text-slate-600 dark:text-tactical-dim'
                      }`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                      animate={{
                        scale: tokenPosition === process.id ? 1.1 : 1,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {t('design_principles.algorithms.token_ring.labels.process_prefix')}{process.id}
                    </motion.div>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center">
                  <TacticalButton size="sm" variant="primary" onClick={moveToken}>
                    {t('design_principles.algorithms.token_ring.move_token')}
                  </TacticalButton>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Panel title={t('design_principles.algorithms.ricart_agrawala.title')} accent="amber">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-3">{t('design_principles.algorithms.ricart_agrawala.concept_title')}</div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
                {t('design_principles.algorithms.ricart_agrawala.concept_p')}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag color="amber">{t('design_principles.algorithms.ricart_agrawala.badges.timestamps')}</Tag>
                <Tag color="amber">{t('design_principles.algorithms.ricart_agrawala.badges.consensus')}</Tag>
              </div>

              <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="font-mono text-signal-amber">
{`// Estrutura do processo
type Process = {
  id: number;
  timestamp: number;
  state: 'idle' | 'requesting' | 'executing';
  requestQueue: Request[];
}

type Request = {
  processId: number;
  timestamp: number;
}

// Implementação do algoritmo
class RicartAgrawala {
  requestCriticalSection(process: Process) {
    process.timestamp = Date.now();
    process.state = 'requesting';
    
    // Enviar requisição para todos
    broadcastRequest(process);
    
    // Esperar respostas
    waitForResponses(process);
  }
  
  handleRequest(process: Process, request: Request) {
    if (process.state === 'idle' ||
        request.timestamp < process.timestamp ||
        (request.timestamp === process.timestamp && 
         request.processId < process.id)) {
      // Enviar OK imediatamente
      sendOK(request.processId);
    } else {
      // Adicionar à fila de requisições
      process.requestQueue.push(request);
    }
  }
  
  releaseCriticalSection(process: Process) {
    process.state = 'idle';
    // Responder todas requisições na fila
    process.requestQueue.forEach(req => 
      sendOK(req.processId)
    );
    process.requestQueue = [];
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4">
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.ricart_agrawala.demo_title')}</div>
              <div className="space-y-4">
                {ricartProcesses.map(process => (
                  <div 
                    key={process.id}
                    className="flex items-center gap-4"
                  >
                    <motion.div 
                      className={`w-32 h-12 rounded-lg border flex items-center justify-center font-sans text-sm ${getProcessBorder(process.state)}`}
                      animate={{
                        scale: process.state === 'idle' ? 1 : 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {t('design_principles.algorithms.ricart_agrawala.labels.process')} {process.id}
                    </motion.div>
                    {process.timestamp !== undefined && process.timestamp > 0 && process.state !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-full border border-slate-200 dark:border-tactical-border px-3 py-1 font-mono text-sm text-slate-700 dark:text-tactical-text"
                      >
                        {t('design_principles.algorithms.ricart_agrawala.labels.ts_prefix')}: {process.timestamp}
                      </motion.div>
                    )}
                    {process.state === 'idle' && (
                      <TacticalButton size="sm" variant="primary" onClick={() => requestRicartAccess(process.id)}>
                        {t('design_principles.algorithms.ricart_agrawala.labels.request_access')}
                      </TacticalButton>
                    )}
                    {process.state !== 'idle' && (
                      <StatusBadge variant={getProcessBadge(process.state)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Panel title={t('design_principles.algorithms.comparison.title')} accent="cyan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.comparison.bakery_title')}</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-signal-green font-mono mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">{t('design_principles.algorithms.comparison.advantages')}</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('design_principles.algorithms.comparison.bakery.pros')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-signal-red font-mono mt-0.5">✗</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">{t('design_principles.algorithms.comparison.disadvantages')}</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('design_principles.algorithms.comparison.bakery.cons')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.comparison.token_ring_title')}</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-signal-green font-mono mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">{t('design_principles.algorithms.comparison.advantages')}</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('design_principles.algorithms.comparison.token_ring.pros')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-signal-red font-mono mt-0.5">✗</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">{t('design_principles.algorithms.comparison.disadvantages')}</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('design_principles.algorithms.comparison.token_ring.cons')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.comparison.ricart_title')}</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-signal-green font-mono mt-0.5">✓</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">{t('design_principles.algorithms.comparison.advantages')}</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('design_principles.algorithms.comparison.ricart.pros')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-signal-red font-mono mt-0.5">✗</span>
                  <div>
                    <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">{t('design_principles.algorithms.comparison.disadvantages')}</span>
                    <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('design_principles.algorithms.comparison.ricart.cons')}</p>
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
        className="mb-12"
      >
        
      </motion.div>
    </div>
  );
}
