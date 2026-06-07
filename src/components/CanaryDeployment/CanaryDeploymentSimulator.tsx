import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

interface Server {
  id: string;
  version: 'stable' | 'canary';
  health: 'healthy' | 'degraded' | 'unhealthy';
  requestsHandled: number;
  errors: number;
  avgResponseTime: number;
}

interface Request {
  id: number;
  timestamp: number;
  targetVersion: 'stable' | 'canary';
  status: 'pending' | 'success' | 'error';
  responseTime: number;
}

interface SimulationConfig {
  canaryPercentage: number;
  canaryErrorRate: number;
  stableErrorRate: number;
  requestsPerSecond: number;
  autoRollbackThreshold: number;
  autoPromoteThreshold: number;
}

type DeploymentPhase = 'stable' | 'canary-deploying' | 'canary-testing' | 'promoting' | 'rolling-back' | 'completed' | 'rolled-back';

const phaseVariant = (phase: DeploymentPhase) => {
  switch (phase) {
    case 'stable': return 'offline' as const;
    case 'canary-deploying': return 'pending' as const;
    case 'canary-testing': return 'in-progress' as const;
    case 'promoting': return 'active' as const;
    case 'rolling-back': return 'classified' as const;
    case 'completed': return 'completed' as const;
    case 'rolled-back': return 'classified' as const;
  }
};

const healthVariant = (health: Server['health']) => {
  switch (health) {
    case 'healthy': return 'active' as const;
    case 'degraded': return 'in-progress' as const;
    case 'unhealthy': return 'classified' as const;
  }
};

export default function CanaryDeploymentSimulator() {
  const { t } = useTranslation();
  
  const [config, setConfig] = useState<SimulationConfig>({
    canaryPercentage: 10,
    canaryErrorRate: 5,
    stableErrorRate: 1,
    requestsPerSecond: 5,
    autoRollbackThreshold: 20,
    autoPromoteThreshold: 50,
  });

  const [servers, setServers] = useState<Server[]>([
    { id: 'stable-1', version: 'stable', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 100 },
    { id: 'stable-2', version: 'stable', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 100 },
    { id: 'stable-3', version: 'stable', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 100 },
  ]);

  const [canaryServers, setCanaryServers] = useState<Server[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [phase, setPhase] = useState<DeploymentPhase>('stable');
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalCanaryRequests, setTotalCanaryRequests] = useState(0);
  const [totalCanaryErrors, setTotalCanaryErrors] = useState(0);
  const [totalStableErrors, setTotalStableErrors] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [injectError, setInjectError] = useState(false);
  
  const requestIdRef = useRef(0);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  }, []);

  const deployCanary = useCallback(() => {
    setPhase('canary-deploying');
    addLog(t('simulators.canary.logs.deploying_canary'));
    
    setTimeout(() => {
      setCanaryServers([
        { id: 'canary-1', version: 'canary', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 95 },
      ]);
      setPhase('canary-testing');
      addLog(t('simulators.canary.logs.canary_deployed'));
      setIsRunning(true);
    }, 1500);
  }, [addLog, t]);

  const promoteCanary = useCallback(() => {
    if (phase !== 'canary-testing') return;
    
    setPhase('promoting');
    addLog(t('simulators.canary.logs.promoting_canary'));
    setIsRunning(false);
    
    setTimeout(() => {
      setServers(prev => prev.map(s => ({ ...s, version: 'canary' as const })));
      setCanaryServers([]);
      setPhase('completed');
      addLog(t('simulators.canary.logs.promotion_complete'));
    }, 2000);
  }, [phase, addLog, t]);

  const rollbackCanary = useCallback(() => {
    if (phase !== 'canary-testing' && phase !== 'promoting') return;
    
    setPhase('rolling-back');
    addLog(t('simulators.canary.logs.rolling_back'));
    setIsRunning(false);
    
    setTimeout(() => {
      setCanaryServers([]);
      setPhase('rolled-back');
      addLog(t('simulators.canary.logs.rollback_complete'));
    }, 1500);
  }, [phase, addLog, t]);

  const resetSimulation = useCallback(() => {
    setServers([
      { id: 'stable-1', version: 'stable', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 100 },
      { id: 'stable-2', version: 'stable', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 100 },
      { id: 'stable-3', version: 'stable', health: 'healthy', requestsHandled: 0, errors: 0, avgResponseTime: 100 },
    ]);
    setCanaryServers([]);
    setRequests([]);
    setPhase('stable');
    setIsRunning(false);
    setTotalRequests(0);
    setTotalCanaryRequests(0);
    setTotalCanaryErrors(0);
    setTotalStableErrors(0);
    setProgressPercent(0);
    setLogs([]);
    setInjectError(false);
    requestIdRef.current = 0;
    addLog(t('simulators.canary.logs.simulation_reset'));
  }, [addLog, t]);

  const increaseCanaryTraffic = useCallback(() => {
    if (config.canaryPercentage < 100) {
      const newPercent = Math.min(config.canaryPercentage + 10, 100);
      setConfig(prev => ({ ...prev, canaryPercentage: newPercent }));
      addLog(t('simulators.canary.logs.traffic_increased', { percent: newPercent }));
    }
  }, [config.canaryPercentage, addLog, t]);

  useEffect(() => {
    if (!isRunning || phase !== 'canary-testing') return;

    const interval = setInterval(() => {
      const isCanaryRequest = Math.random() * 100 < config.canaryPercentage;
      const targetVersion = isCanaryRequest ? 'canary' : 'stable';
      
      const errorRate = injectError && isCanaryRequest 
        ? 80
        : (isCanaryRequest ? config.canaryErrorRate : config.stableErrorRate);
      
      const isError = Math.random() * 100 < errorRate;
      const responseTime = isError ? 500 + Math.random() * 1000 : 50 + Math.random() * 100;
      
      const newRequest: Request = {
        id: requestIdRef.current++,
        timestamp: Date.now(),
        targetVersion,
        status: isError ? 'error' : 'success',
        responseTime,
      };

      setRequests(prev => [newRequest, ...prev].slice(0, 20));
      setTotalRequests(prev => prev + 1);
      
      if (isCanaryRequest) {
        setTotalCanaryRequests(prev => prev + 1);
        if (isError) {
          setTotalCanaryErrors(prev => prev + 1);
        }
        
        setCanaryServers(prev => prev.map(s => ({
          ...s,
          requestsHandled: s.requestsHandled + 1,
          errors: isError ? s.errors + 1 : s.errors,
          health: s.errors / (s.requestsHandled + 1) > 0.2 ? 'unhealthy' : 
                  s.errors / (s.requestsHandled + 1) > 0.1 ? 'degraded' : 'healthy',
        })));
      } else {
        if (isError) {
          setTotalStableErrors(prev => prev + 1);
        }
        
        setServers(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((s, i) => i === idx ? {
            ...s,
            requestsHandled: s.requestsHandled + 1,
            errors: isError ? s.errors + 1 : s.errors,
          } : s);
        });
      }
    }, 1000 / config.requestsPerSecond);

    return () => clearInterval(interval);
  }, [isRunning, phase, config, injectError]);

  useEffect(() => {
    if (phase !== 'canary-testing' || totalCanaryRequests < 10) return;
    
    const canaryErrorRate = (totalCanaryErrors / totalCanaryRequests) * 100;
    
    if (canaryErrorRate >= config.autoRollbackThreshold) {
      addLog(t('simulators.canary.logs.auto_rollback_triggered', { rate: canaryErrorRate.toFixed(1) }));
      rollbackCanary();
    }
  }, [totalCanaryErrors, totalCanaryRequests, config.autoRollbackThreshold, phase, rollbackCanary, addLog, t]);

  useEffect(() => {
    if (phase !== 'canary-testing') return;
    
    const canaryErrorRate = totalCanaryRequests > 0 
      ? (totalCanaryErrors / totalCanaryRequests) * 100 
      : 0;
    
    if (canaryErrorRate < 5 && totalCanaryRequests > 20) {
      setProgressPercent(prev => Math.min(prev + 1, 100));
    }
  }, [totalCanaryRequests, totalCanaryErrors, phase]);

  const canaryErrorRate = totalCanaryRequests > 0 
    ? (totalCanaryErrors / totalCanaryRequests) * 100 
    : 0;

  const stableErrorRate = (totalRequests - totalCanaryRequests) > 0 
    ? (totalStableErrors / (totalRequests - totalCanaryRequests)) * 100 
    : 0;

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-sans font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t('simulators.canary.title')}
          </span>
        </div>
        <TacticalButton size="sm" variant="ghost" onClick={() => setShowSettings(!showSettings)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('simulators.canary.buttons.settings')}
        </TacticalButton>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Panel title={t('simulators.canary.settings.title')} accent="cyan">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {t('simulators.canary.settings.canary_traffic', { percent: config.canaryPercentage })}
                  </label>
                  <input type="range" min="5" max="100" step="5" value={config.canaryPercentage} onChange={(e) => setConfig(prev => ({ ...prev, canaryPercentage: Number(e.target.value) }))} className={rangeClass} disabled={isRunning} />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {t('simulators.canary.settings.canary_error_rate', { percent: config.canaryErrorRate })}
                  </label>
                  <input type="range" min="0" max="50" value={config.canaryErrorRate} onChange={(e) => setConfig(prev => ({ ...prev, canaryErrorRate: Number(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {t('simulators.canary.settings.rps', { value: config.requestsPerSecond })}
                  </label>
                  <input type="range" min="1" max="20" value={config.requestsPerSecond} onChange={(e) => setConfig(prev => ({ ...prev, requestsPerSecond: Number(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {t('simulators.canary.settings.rollback_threshold', { percent: config.autoRollbackThreshold })}
                  </label>
                  <input type="range" min="5" max="50" value={config.autoRollbackThreshold} onChange={(e) => setConfig(prev => ({ ...prev, autoRollbackThreshold: Number(e.target.value) }))} className={rangeClass} />
                </div>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <Panel
        title={t('simulators.canary.labels.phase')}
        accent="amber"
        action={
          <StatusBadge
            variant={phaseVariant(phase)}
            label={t(`simulators.canary.phases.${phase.replace('-', '_')}`)}
          />
        }
      >
        <div className="flex flex-wrap gap-2">
          {phase === 'stable' && (
            <TacticalButton size="sm" variant="primary" onClick={deployCanary}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {t('simulators.canary.buttons.deploy_canary')}
            </TacticalButton>
          )}
          
          {phase === 'canary-testing' && (
            <>
              <TacticalButton size="sm" variant={isRunning ? 'danger' : 'primary'} onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? t('simulators.canary.buttons.pause') : t('simulators.canary.buttons.resume')}
              </TacticalButton>
              <TacticalButton size="sm" variant="secondary" onClick={increaseCanaryTraffic} disabled={config.canaryPercentage >= 100}>
                {t('simulators.canary.buttons.increase_traffic')}
              </TacticalButton>
              <TacticalButton size="sm" variant="primary" onClick={promoteCanary}>
                {t('simulators.canary.buttons.promote')}
              </TacticalButton>
              <TacticalButton size="sm" variant="danger" onClick={rollbackCanary}>
                {t('simulators.canary.buttons.rollback')}
              </TacticalButton>
              <TacticalButton size="sm" variant={injectError ? 'danger' : 'ghost'} onClick={() => setInjectError(!injectError)}>
                {injectError ? t('simulators.canary.buttons.stop_errors') : t('simulators.canary.buttons.inject_errors')}
              </TacticalButton>
            </>
          )}
          
          {(phase === 'completed' || phase === 'rolled-back') && (
            <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
              {t('simulators.canary.buttons.reset')}
            </TacticalButton>
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel title={`${t('simulators.canary.labels.stable_servers')} (v1)`} accent="green">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {servers.map(server => (
                <motion.div
                  key={server.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-slate-900 dark:text-tactical-text">{server.id}</span>
                    <StatusBadge variant={healthVariant(server.health)} dot />
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                    <div>{t('simulators.canary.labels.requests')}: {server.requestsHandled}</div>
                    <div>{t('simulators.canary.labels.errors')}: {server.errors}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>

          <AnimatePresence>
            {canaryServers.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Panel
                  title={`${t('simulators.canary.labels.canary_server')} (v2)`}
                  accent="amber"
                  action={
                    <span className="font-mono text-xs text-signal-amber">
                      {config.canaryPercentage}% {t('simulators.canary.labels.traffic')}
                    </span>
                  }
                  className="border-signal-amber/40"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {canaryServers.map(server => (
                      <motion.div
                        key={server.id}
                        className="rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 p-4"
                        layout
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-slate-900 dark:text-tactical-text">{server.id}</span>
                          <StatusBadge variant={healthVariant(server.health)} dot />
                        </div>
                        <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                          <div>{t('simulators.canary.labels.requests')}: {server.requestsHandled}</div>
                          <div>{t('simulators.canary.labels.errors')}: {server.errors}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>

          <Panel title={t('simulators.canary.labels.metrics')} accent="cyan">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{totalRequests}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.canary.labels.total_requests')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber">{totalCanaryRequests}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.canary.labels.canary_requests')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className={`font-mono text-3xl font-bold tabular-nums leading-none ${
                  canaryErrorRate > 15 ? 'text-signal-red' : canaryErrorRate > 5 ? 'text-signal-amber' : 'text-signal-green'
                }`}>
                  {canaryErrorRate.toFixed(1)}%
                </div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.canary.labels.canary_error_rate')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">{stableErrorRate.toFixed(1)}%</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.canary.labels.stable_error_rate')}</div>
              </div>
            </div>
          </Panel>

          <Panel title={t('simulators.canary.labels.live_requests')} accent="red">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {requests.map(request => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between rounded-lg p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        variant={request.targetVersion === 'canary' ? 'in-progress' : 'active'}
                        label={request.targetVersion === 'canary' ? 'v2' : 'v1'}
                      />
                      <StatusBadge
                        variant={request.status === 'success' ? 'completed' : 'classified'}
                        dot={false}
                        label={request.status === 'success' ? 'Ok' : 'Error'}
                      />
                    </div>
                    <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                      {request.responseTime.toFixed(0)}ms
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {requests.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-10 text-center">
                  <p className="font-sans text-sm text-slate-400 dark:text-slate-500">
                    {t('simulators.canary.labels.no_requests')}
                  </p>
                </div>
              )}
            </div>
          </Panel>
        </div>

        <Panel title={t('simulators.canary.labels.event_log')} accent="green" bodyClassName="p-0">
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="text-emerald-600 dark:text-emerald-400 mb-1">{log}</div>
            ))}
            {logs.length === 0 && (
              <div className="font-sans text-sm text-slate-500 dark:text-slate-400">{t('simulators.canary.labels.waiting_logs')}</div>
            )}
          </div>
        </Panel>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 border-l-2 border-l-emerald-500 bg-slate-50 dark:bg-slate-900 dark:rounded-none p-5">
        <h3 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-4">{t('simulators.canary.info.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-2">{t('simulators.canary.info.try_this.title')}</h4>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.try_this.item1')}</li>
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.try_this.item2')}</li>
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.try_this.item3')}</li>
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.try_this.item4')}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-2">{t('simulators.canary.info.observe.title')}</h4>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.observe.item1')}</li>
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.observe.item2')}</li>
              <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.canary.info.observe.item3')}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-2">{t('simulators.canary.info.real_world.title')}</h4>
            <p>{t('simulators.canary.info.real_world.text')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
