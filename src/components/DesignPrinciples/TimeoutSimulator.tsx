import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

/// <reference types="node" />

interface RequestState {
  id: number;
  status: 'pending' | 'success' | 'timeout' | 'error';
  startTime: number;
  endTime?: number;
  responseTime?: number;
}

interface SimulationConfig {
  timeout: number;
  minResponseTime: number;
  maxResponseTime: number;
  successRate: number;
  requestsPerSecond: number;
}

export default function TimeoutSimulator() {
  const { t } = useTranslation();

  const [config, setConfig] = useState<SimulationConfig>({
    timeout: 3000,
    minResponseTime: 1000,
    maxResponseTime: 5000,
    successRate: 70,
    requestsPerSecond: 1,
  });

  const [requests, setRequests] = useState<RequestState[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  const nextRequestId = useRef(1);

  const simulateRequest = async (id: number) => {
    const startTime = Date.now();
    const responseTime = Math.random() * (config.maxResponseTime - config.minResponseTime) + config.minResponseTime;
    const willSucceed = Math.random() * 100 <= config.successRate;

    setRequests(prev => {
      // Keep only the last 10 requests to avoid performance issues
      const newRequests = [...prev, { id, status: 'pending' as const, startTime }];
      if (newRequests.length > 10) {
        return newRequests.slice(-10);
      }
      return newRequests;
    });

    try {
      const result = await Promise.race([
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (willSucceed) {
              resolve('Success');
            } else {
              reject('Server Error');
            }
          }, responseTime);
        }),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject('Timeout');
          }, config.timeout);
        })
      ]);

      setRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { 
                ...req, 
                status: 'success', 
                endTime: Date.now(),
                responseTime 
              } 
            : req
        )
      );
    } catch (error) {
      setRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { 
                ...req, 
                status: error === 'Timeout' ? 'timeout' : 'error',
                endTime: Date.now(),
                responseTime 
              } 
            : req
        )
      );
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    const interval = 1000 / config.requestsPerSecond;
    
    simulationInterval.current = setInterval(() => {
      simulateRequest(nextRequestId.current);
      nextRequestId.current++;
    }, interval);
  };

  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    stopSimulation();
    setRequests([]);
    nextRequestId.current = 1;
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  // Update interval when requestsPerSecond changes
  useEffect(() => {
    if (isSimulating) {
      stopSimulation();
      startSimulation();
    }
  }, [config.requestsPerSecond]);

  const toSeconds = (ms: number) => (ms / 1000).toFixed(1);
  const formatTime = (ms: number) => `${toSeconds(ms)}s`;

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-sans font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('simulators.timeout.title')}
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <TacticalButton
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('simulators.timeout.buttons.settings')}
            </TacticalButton>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Panel title={t('simulators.timeout.settings.title')} accent="cyan">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.timeout.settings.timeout', { seconds: toSeconds(config.timeout) })}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="5000"
                    step="500"
                    value={config.timeout}
                    onChange={(e) => setConfig(prev => ({ ...prev, timeout: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.timeout.settings.rps', { value: config.requestsPerSecond })}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={config.requestsPerSecond}
                    onChange={(e) => setConfig(prev => ({ ...prev, requestsPerSecond: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.timeout.settings.min_response', { seconds: toSeconds(config.minResponseTime) })}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="500"
                    value={config.minResponseTime}
                    onChange={(e) => setConfig(prev => ({ ...prev, minResponseTime: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.timeout.settings.max_response', { seconds: toSeconds(config.maxResponseTime) })}
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="7000"
                    step="500"
                    value={config.maxResponseTime}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxResponseTime: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.timeout.settings.success_rate', { percent: config.successRate })}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.successRate}
                    onChange={(e) => setConfig(prev => ({ ...prev, successRate: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title={t('simulators.timeout.visualization.title')}
          accent="amber"
          action={
            <div className="flex flex-wrap gap-2">
              {!isSimulating ? (
                <TacticalButton size="sm" variant="primary" onClick={startSimulation}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  {t('simulators.timeout.buttons.start')}
                </TacticalButton>
              ) : (
                <TacticalButton size="sm" variant="danger" onClick={stopSimulation}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4z" />
                  </svg>
                  {t('simulators.timeout.buttons.stop')}
                </TacticalButton>
              )}
              <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('simulators.timeout.buttons.reset')}
              </TacticalButton>
            </div>
          }
        >
          <div className="space-y-2">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5"
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.timeout.request_label', { id: request.id })}</span>
                    {request.status === 'pending' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-signal-cyan border-t-transparent rounded-full"
                      />
                    )}
                    {request.status === 'success' && (
                      <StatusBadge variant="active" label={t('simulators.timeout.statuses.success')} />
                    )}
                    {request.status === 'timeout' && (
                      <StatusBadge variant="pending" label={t('simulators.timeout.statuses.timeout', { seconds: toSeconds(config.timeout) })} />
                    )}
                    {request.status === 'error' && (
                      <StatusBadge variant="classified" label={t('simulators.timeout.statuses.error')} />
                    )}
                  </div>
                  {request.endTime && (
                    <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                      {formatTime(request.endTime - request.startTime)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {requests.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-10 text-center">
                <p className="font-sans text-sm text-slate-400 dark:text-slate-500">
                  —
                </p>
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={t('simulators.timeout.stats.title')} accent="green">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{nextRequestId.current - 1}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.timeout.stats.total')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber">
                  {requests.filter(r => r.status === 'timeout').length}
                </div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.timeout.stats.timeouts')}</div>
              </div>
            </div>
          </Panel>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 border-l-2 border-l-emerald-500 bg-slate-50 dark:bg-slate-900 dark:rounded-none p-5">
            <h3 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-3">{t('simulators.timeout.info.title')}</h3>
            <div className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-slate-400">
              <p className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.timeout.info.p1')}</p>
              <p className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.timeout.info.p2')}</p>
              <p className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.timeout.info.p3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
