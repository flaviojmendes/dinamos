import React, { useState, useCallback } from 'react';
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
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', name: t('design_principles.consistency_strategies.lamport_timestamps_simulator.process_label', { n: 1 }), clock: 0, events: [] },
    { id: 'P2', name: t('design_principles.consistency_strategies.lamport_timestamps_simulator.process_label', { n: 2 }), clock: 0, events: [] },
    { id: 'P3', name: t('design_principles.consistency_strategies.lamport_timestamps_simulator.process_label', { n: 3 }), clock: 0, events: [] },
  ]);

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
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('design_principles.consistency_strategies.lamport_timestamps_simulator.title')} ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.subtitle')}
        </p>
      </div>

      <div className="tactical-panel border-l-2 border-l-signal-cyan p-5">
        <p className="font-mono text-sm text-slate-600 dark:text-tactical-dim">
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.info')}
        </p>
      </div>

      <div className="flex gap-3">
        <TacticalButton size="sm" variant="danger" onClick={resetSimulation}>
          {t('design_principles.consistency_strategies.lamport_timestamps_simulator.controls.reset')}
        </TacticalButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {processes.map((process) => (
          <div key={process.id} className="flex flex-col">
            <Panel title={process.name} accent="cyan" action={
              <span className="font-mono text-sm text-signal-cyan tabular-nums">
                {t('design_principles.consistency_strategies.lamport_timestamps_simulator.timeline.clock_prefix')} {process.clock}
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

              <div className="flex-1 relative">
                <div className="absolute inset-0 w-px bg-slate-200 dark:bg-tactical-border left-1/2 transform -translate-x-1/2" />
                <div className="space-y-3 md:space-y-4">
                  {process.events.map((event) => (
                    <div key={event.id} className="relative pl-6 md:pl-8 pr-4 md:pr-8">
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className={`w-3 h-3 md:w-4 md:h-4 ${getEventDot(event.type)}`} />
                      </div>
                      <div className={`p-2 md:p-3 border ml-4 ${getEventBorder(event.type)}`}>
                        <div className="flex justify-between items-center font-mono text-xs md:text-sm">
                          <span className="text-slate-600 dark:text-tactical-dim">
                            {event.type === 'local'
                              ? t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.local')
                              : event.type === 'send'
                              ? t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.send_prefix', { target: event.targetProcess })
                              : t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.receive_prefix', { source: event.sourceProcess })}
                          </span>
                          <span className="font-mono tabular-nums text-slate-500 dark:text-tactical-label">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.timeline.clock_prefix')}{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
            <span className="font-mono text-xs md:text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.local')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-cyan"></div>
            <span className="font-mono text-xs md:text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.sent')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-amber"></div>
            <span className="font-mono text-xs md:text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.received')}</span>
          </div>
        </div>
      </Panel>
    </div>
  );
}
