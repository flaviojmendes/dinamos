import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationActivity, useSimulationMotion } from '../simulation';
import { AnimatedNumber } from '../AISystems/motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton } from '../tactical';

interface Process {
  id: string;
  name: string;
  clock: number;
  events: Event[];
}

interface Event {
  id: string;
  type: 'local' | 'send' | 'receive';
  timestamp: number;
  messageId?: string;
  targetProcess?: string;
  sourceProcess?: string;
}

export default function LamportTimestampsSimulator() {
  const { t } = useTranslation();
  const { reducedMotion, transition } = useSimulationMotion();
  const [active, setActive] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', name: t('design_principles.consistency_strategies.lamport_timestamps_simulator.process_label', { n: 1 }), clock: 0, events: [] },
    { id: 'P2', name: t('design_principles.consistency_strategies.lamport_timestamps_simulator.process_label', { n: 2 }), clock: 0, events: [] },
    { id: 'P3', name: t('design_principles.consistency_strategies.lamport_timestamps_simulator.process_label', { n: 3 }), clock: 0, events: [] },
  ]);

  useEffect(() => {
    if (!processes.some(process => process.events.length > 0)) {
      setActive(false);
      return;
    }
    setActive(true);
    const timer = setTimeout(() => setActive(false), 650);
    return () => clearTimeout(timer);
  }, [processes]);

  const addLocalEvent = useCallback((processId: string) => {
    setProcesses(currentProcesses => {
      return currentProcesses.map(process => {
        if (process.id === processId) {
          const newClock = process.clock + 1;
          return {
            ...process,
            clock: newClock,
            events: [
              ...process.events,
              {
                id: `${processId}-${newClock}`,
                type: 'local',
                timestamp: newClock,
              },
            ],
          };
        }
        return process;
      });
    });
  }, []);

  const sendMessage = useCallback((sourceId: string, targetId: string) => {
    setProcesses(currentProcesses => {
      const sourceProcess = currentProcesses.find(p => p.id === sourceId);
      if (!sourceProcess) return currentProcesses;

      const messageId = `msg-${sourceId}-${targetId}-${Date.now()}`;
      const newSourceClock = sourceProcess.clock + 1;

      return currentProcesses.map(process => {
        if (process.id === sourceId) {
          return {
            ...process,
            clock: newSourceClock,
            events: [
              ...process.events,
              {
                id: `${sourceId}-send-${newSourceClock}`,
                type: 'send',
                timestamp: newSourceClock,
                messageId,
                targetProcess: targetId,
              },
            ],
          };
        }
        if (process.id === targetId) {
          const newTargetClock = Math.max(process.clock, newSourceClock) + 1;
          return {
            ...process,
            clock: newTargetClock,
            events: [
              ...process.events,
              {
                id: `${targetId}-receive-${newTargetClock}`,
                type: 'receive',
                timestamp: newTargetClock,
                messageId,
                sourceProcess: sourceId,
              },
            ],
          };
        }
        return process;
      });
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setProcesses(currentProcesses =>
      currentProcesses.map(process => ({
        ...process,
        clock: 0,
        events: [],
      }))
    );
  }, []);

  const getEventBorder = (type: Event['type']) => {
    switch (type) {
      case 'local': return 'border-signal-green bg-signal-green/10';
      case 'send': return 'border-signal-cyan bg-signal-cyan/10';
      default: return 'border-signal-amber bg-signal-amber/10';
    }
  };

  const getEventDot = (type: Event['type']) => {
    switch (type) {
      case 'local': return 'bg-signal-green';
      case 'send': return 'bg-signal-cyan';
      default: return 'bg-signal-amber';
    }
  };

  return (
    <div className="simulation-workspace space-y-6">
      <SimulationActivity active={active} />
      <div className="max-w-3xl">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.subtitle')}
        </p>
      </div>

      <div className="tactical-panel p-5">
        <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.info')}
        </p>
      </div>

      <div className="flex gap-3">
        <TacticalButton size="sm" variant="danger" onClick={resetSimulation}>
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.controls.reset')}
        </TacticalButton>
      </div>

      <div className="sim-stage grid grid-cols-1 lg:grid-cols-3 gap-5">
        {processes.map((process) => (
          <div key={process.id} className="flex flex-col">
            <Panel title={process.name} accent="cyan" action={
              <span className="font-mono text-sm text-slate-700 dark:text-tactical-text tabular-nums">
                {t('design_principles.consistency_strategies.lamport_timestamps_simulator.timeline.clock_prefix')} <AnimatedNumber value={process.clock} />
              </span>
            }>
              <div className="flex flex-wrap gap-2 mb-4">
                <TacticalButton size="sm" variant="primary" onClick={() => addLocalEvent(process.id)}>
                  {t('design_principles.consistency_strategies.lamport_timestamps_simulator.buttons.local_event')}
                </TacticalButton>
                {processes
                  .filter(p => p.id !== process.id)
                  .map(targetProcess => (
                    <TacticalButton
                      key={targetProcess.id}
                      size="sm"
                      variant="secondary"
                      onClick={() => sendMessage(process.id, targetProcess.id)}
                    >
                      {t('design_principles.consistency_strategies.lamport_timestamps_simulator.buttons.send_to', { target: targetProcess.name })}
                    </TacticalButton>
                  ))}
              </div>

              <div className="relative max-h-[28rem] min-h-32 overflow-y-auto">
                <div className="absolute bottom-0 left-1.5 top-0 w-px bg-slate-200 dark:bg-tactical-border" />
                <div className="space-y-3 md:space-y-4">
                  <AnimatePresence initial={false}>
                  {process.events.map((event) => (
                    <motion.div key={event.id} layout="position" initial={{ opacity: 0, x: reducedMotion ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={transition} className="relative pl-6">
                      <div className="absolute left-0 top-4">
                        <div className={`h-3 w-3 rounded-full ring-4 ring-white dark:ring-tactical-panel ${getEventDot(event.type)}`} />
                      </div>
                      <div className={`p-3 rounded-lg border ${getEventBorder(event.type)}`}>
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="font-sans text-slate-600 dark:text-tactical-dim">
                            {event.type === 'local'
                              ? t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.local')
                              : event.type === 'send'
                              ? t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.send_prefix', { target: event.targetProcess })
                              : t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.receive_prefix', { source: event.sourceProcess })}
                          </span>
                          <span className="font-mono tabular-nums text-slate-500 dark:text-tactical-label">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.timeline.clock_prefix')}{event.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            </Panel>
          </div>
        ))}
      </div>

      <Panel title={t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.title')} accent="amber">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-green"></div>
            <span className="font-sans text-xs md:text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.local')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-cyan"></div>
            <span className="font-sans text-xs md:text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.sent')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-amber"></div>
            <span className="font-sans text-xs md:text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.received')}</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
