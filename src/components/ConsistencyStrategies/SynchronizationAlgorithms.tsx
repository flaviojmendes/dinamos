import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, Tag, TacticalButton } from '../tactical';
import { SimulationActivity, FlowLink, useSimulationMotion } from '../simulation';

interface Process {
  id: number;
  state: 'idle' | 'requesting' | 'executing';
  number?: number;
  timestamp?: number;
}

export default function SynchronizationAlgorithms() {
  const { t } = useTranslation();
  const { reducedMotion, transition } = useSimulationMotion();
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
    <div className="simulation-workspace space-y-6">
      <SimulationActivity active={[...bakeryProcesses, ...ricartProcesses].some(process => process.state !== 'idle')} />
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <div className="max-w-3xl">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
            {t('design_principles.algorithms.title')}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim mb-6">
            {t('design_principles.algorithms.intro')}
          </p>
        </div>
        <div className="tactical-panel p-5">
          <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-2">{t('design_principles.algorithms.key_concept_label')}</div>
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">
            {t('design_principles.algorithms.key_concept_text')}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
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
{t('design_principles.algorithms.bakery.code')}
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
                    className="flex flex-wrap items-center gap-3"
                  >
                    <motion.div 
                      className={`sim-node w-32 h-12 rounded-lg border flex items-center justify-center font-sans text-sm ${getProcessBorder(process.state)}`}
                      animate={{
                        y: !reducedMotion && process.state === 'executing' ? -3 : 0,
                        transition
                      }}
                    >
                      {t('design_principles.algorithms.bakery.labels.process')} {process.id}
                    </motion.div>
                    <FlowLink active={process.state === 'requesting'} tone="cyan" className="w-8" />
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
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
{t('design_principles.algorithms.token_ring.code')}
                  </code>
                </pre>
              </div>
            </div>

            <div className="tactical-panel border border-slate-200 dark:border-tactical-border p-4">
              <div className="font-sans text-xs font-medium text-slate-600 dark:text-tactical-label mb-4">{t('design_principles.algorithms.token_ring.demo_title')}</div>
              <div className="relative aspect-square min-w-0">
                <div className="absolute inset-[19%] rounded-full border border-dashed border-slate-300 dark:border-tactical-line" aria-hidden="true" />
                <motion.div aria-hidden="true" className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-green ring-4 ring-signal-green/15" initial={false} animate={{ left: `${50 + 31 * Math.cos(tokenPosition * 2 * Math.PI / tokenRingProcesses.length)}%`, top: `${50 + 31 * Math.sin(tokenPosition * 2 * Math.PI / tokenRingProcesses.length)}%` }} transition={transition} />
                {tokenRingProcesses.map((process, index) => {
                  const angle = (index * 2 * Math.PI) / tokenRingProcesses.length;
                  const radius = 31;
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
                        scale: !reducedMotion && tokenPosition === process.id ? 1.06 : 1,
                        transition
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
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
{t('design_principles.algorithms.ricart_agrawala.code')}
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
                    className="flex flex-wrap items-center gap-3"
                  >
                    <motion.div 
                      className={`sim-node w-32 h-12 rounded-lg border flex items-center justify-center font-sans text-sm ${getProcessBorder(process.state)}`}
                      animate={{
                        y: !reducedMotion && process.state === 'executing' ? -3 : 0,
                        transition
                      }}
                    >
                      {t('design_principles.algorithms.ricart_agrawala.labels.process')} {process.id}
                    </motion.div>
                    <FlowLink active={process.state === 'requesting'} tone="amber" className="w-8" />
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
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
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="mb-12"
      >
        
      </motion.div>
    </div>
  );
}
