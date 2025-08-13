import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-8 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            {t('design_principles.consistency_strategies.lamport_timestamps_simulator.title')}
          </h1>
          <p className="text-base md:text-lg text-zinc-400">
            {t('design_principles.consistency_strategies.lamport_timestamps_simulator.subtitle')}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 md:p-4 mb-6 md:mb-8">
          <div className="flex gap-3">
            <div className="text-blue-400 mt-1 shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm md:text-base text-blue-300">
              {t('design_principles.consistency_strategies.lamport_timestamps_simulator.info')}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 md:mb-8">
          <button
            onClick={resetSimulation}
            className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm md:text-base rounded transition-colors"
          >
            {t('design_principles.consistency_strategies.lamport_timestamps_simulator.controls.reset')}
          </button>
        </div>

        {/* Timeline View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {processes.map((process) => (
            <div key={process.id} className="flex flex-col">
              {/* Process Header */}
              <div className="bg-zinc-800/50 rounded-lg p-3 md:p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-white">{process.name}</h3>
                  <span className="text-blue-400 font-mono text-sm md:text-base">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.timeline.clock_prefix')} {process.clock}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addLocalEvent(process.id)}
                    className="px-2 md:px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs md:text-sm transition-colors"
                  >
                    {t('design_principles.consistency_strategies.lamport_timestamps_simulator.buttons.local_event')}
                  </button>
                  {processes
                    .filter(p => p.id !== process.id)
                    .map(targetProcess => (
                      <button
                        key={targetProcess.id}
                        onClick={() => sendMessage(process.id, targetProcess.id)}
                        className="px-2 md:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs md:text-sm transition-colors"
                      >
                        {t('design_principles.consistency_strategies.lamport_timestamps_simulator.buttons.send_to', { target: targetProcess.name })}
                      </button>
                    ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 w-px bg-zinc-800 left-1/2 transform -translate-x-1/2" />
                <div className="space-y-3 md:space-y-4">
                  {process.events.map((event) => (
                    <div key={event.id} className="relative pl-6 md:pl-8 pr-4 md:pr-8">
                      {/* Timeline Node */}
                      <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                            event.type === 'local' ? 'bg-green-500' : event.type === 'send' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                        />
                      </div>
                      {/* Event Card */}
                      <div
                        className={`p-2 md:p-3 rounded-lg ml-4 ${
                          event.type === 'local'
                            ? 'bg-green-500/20 border border-green-500'
                            : event.type === 'send'
                            ? 'bg-blue-500/20 border border-blue-500'
                            : 'bg-purple-500/20 border border-purple-500'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-zinc-300">
                            {event.type === 'local'
                              ? t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.local')
                              : event.type === 'send'
                              ? t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.send_prefix', { target: event.targetProcess })
                              : t('design_principles.consistency_strategies.lamport_timestamps_simulator.event_labels.receive_prefix', { source: event.sourceProcess })}
                          </span>
                          <span className="font-mono text-zinc-400">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.timeline.clock_prefix')}{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-zinc-800/50 rounded-lg p-4">
          <h4 className="text-sm md:text-base font-medium text-white mb-3">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.title')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs md:text-sm text-zinc-400">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.local')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs md:text-sm text-zinc-400">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.sent')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs md:text-sm text-zinc-400">{t('design_principles.consistency_strategies.lamport_timestamps_simulator.legend.received')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 