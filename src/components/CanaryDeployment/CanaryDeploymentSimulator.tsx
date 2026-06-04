import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

  // Process requests
  useEffect(() => {
    if (!isRunning || phase !== 'canary-testing') return;

    const interval = setInterval(() => {
      const isCanaryRequest = Math.random() * 100 < config.canaryPercentage;
      const targetVersion = isCanaryRequest ? 'canary' : 'stable';
      
      // Determine if this request fails
      const errorRate = injectError && isCanaryRequest 
        ? 80 // High error rate when error injection is on
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
        
        // Update canary server stats
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
        
        // Update stable server stats (distribute among them)
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

  // Auto rollback on high error rate
  useEffect(() => {
    if (phase !== 'canary-testing' || totalCanaryRequests < 10) return;
    
    const canaryErrorRate = (totalCanaryErrors / totalCanaryRequests) * 100;
    
    if (canaryErrorRate >= config.autoRollbackThreshold) {
      addLog(t('simulators.canary.logs.auto_rollback_triggered', { rate: canaryErrorRate.toFixed(1) }));
      rollbackCanary();
    }
  }, [totalCanaryErrors, totalCanaryRequests, config.autoRollbackThreshold, phase, rollbackCanary, addLog, t]);

  // Calculate progress for gradual rollout
  useEffect(() => {
    if (phase !== 'canary-testing') return;
    
    const canaryErrorRate = totalCanaryRequests > 0 
      ? (totalCanaryErrors / totalCanaryRequests) * 100 
      : 0;
    
    // Progress increases if error rate is low
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

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.h1 
            className="text-4xl font-bold mb-0 text-brand-600 dark:text-brand-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('simulators.canary.title')}
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('simulators.canary.buttons.settings')}
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8 overflow-hidden"
          >
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-6">{t('simulators.canary.settings.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {t('simulators.canary.settings.canary_traffic', { percent: config.canaryPercentage })}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={config.canaryPercentage}
                  onChange={(e) => setConfig(prev => ({ ...prev, canaryPercentage: Number(e.target.value) }))}
                  className="w-full accent-orange-500"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {t('simulators.canary.settings.canary_error_rate', { percent: config.canaryErrorRate })}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={config.canaryErrorRate}
                  onChange={(e) => setConfig(prev => ({ ...prev, canaryErrorRate: Number(e.target.value) }))}
                  className="w-full accent-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {t('simulators.canary.settings.rps', { value: config.requestsPerSecond })}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={config.requestsPerSecond}
                  onChange={(e) => setConfig(prev => ({ ...prev, requestsPerSecond: Number(e.target.value) }))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {t('simulators.canary.settings.rollback_threshold', { percent: config.autoRollbackThreshold })}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={config.autoRollbackThreshold}
                  onChange={(e) => setConfig(prev => ({ ...prev, autoRollbackThreshold: Number(e.target.value) }))}
                  className="w-full accent-yellow-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <div className="flex flex-wrap gap-3">
          {phase === 'stable' && (
            <button
              onClick={deployCanary}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {t('simulators.canary.buttons.deploy_canary')}
            </button>
          )}
          
          {phase === 'canary-testing' && (
            <>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isRunning 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('simulators.canary.buttons.pause')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    {t('simulators.canary.buttons.resume')}
                  </>
                )}
              </button>
              
              <button
                onClick={increaseCanaryTraffic}
                disabled={config.canaryPercentage >= 100}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {t('simulators.canary.buttons.increase_traffic')}
              </button>
              
              <button
                onClick={promoteCanary}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('simulators.canary.buttons.promote')}
              </button>
              
              <button
                onClick={rollbackCanary}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                {t('simulators.canary.buttons.rollback')}
              </button>
              
              <button
                onClick={() => setInjectError(!injectError)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  injectError 
                    ? 'bg-red-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {injectError ? t('simulators.canary.buttons.stop_errors') : t('simulators.canary.buttons.inject_errors')}
              </button>
            </>
          )}
          
          {(phase === 'completed' || phase === 'rolled-back') && (
            <button
              onClick={resetSimulation}
              className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('simulators.canary.buttons.reset')}
            </button>
          )}
        </div>
        
        {/* Phase indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.canary.labels.phase')}:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            phase === 'stable' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
            phase === 'canary-deploying' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
            phase === 'canary-testing' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
            phase === 'promoting' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
            phase === 'rolling-back' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
            phase === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {t(`simulators.canary.phases.${phase.replace('-', '_')}`)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Servers Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stable Servers */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              {t('simulators.canary.labels.stable_servers')} (v1)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {servers.map(server => (
                <motion.div
                  key={server.id}
                  className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{server.id}</span>
                    <span className={`w-3 h-3 rounded-full ${
                      server.health === 'healthy' ? 'bg-green-500' :
                      server.health === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <div>{t('simulators.canary.labels.requests')}: {server.requestsHandled}</div>
                    <div>{t('simulators.canary.labels.errors')}: {server.errors}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Canary Servers */}
          <AnimatePresence>
            {canaryServers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-slate-900 rounded-lg p-6 border-2 border-orange-500"
              >
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                  {t('simulators.canary.labels.canary_server')} (v2)
                  <span className="ml-auto text-sm font-normal text-orange-500">
                    {config.canaryPercentage}% {t('simulators.canary.labels.traffic')}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {canaryServers.map(server => (
                    <motion.div
                      key={server.id}
                      className={`rounded-lg p-4 ${
                        server.health === 'healthy' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        server.health === 'degraded' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                        'bg-red-100 dark:bg-red-900/30'
                      }`}
                      layout
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{server.id}</span>
                        <span className={`w-3 h-3 rounded-full ${
                          server.health === 'healthy' ? 'bg-green-500' :
                          server.health === 'degraded' ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                        }`}></span>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        <div>{t('simulators.canary.labels.requests')}: {server.requestsHandled}</div>
                        <div>{t('simulators.canary.labels.errors')}: {server.errors}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metrics */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">
              {t('simulators.canary.labels.metrics')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.canary.labels.total_requests')}</div>
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{totalRequests}</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.canary.labels.canary_requests')}</div>
                <div className="text-2xl font-bold text-orange-500">{totalCanaryRequests}</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.canary.labels.canary_error_rate')}</div>
                <div className={`text-2xl font-bold ${
                  canaryErrorRate > 15 ? 'text-red-500' :
                  canaryErrorRate > 5 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {canaryErrorRate.toFixed(1)}%
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.canary.labels.stable_error_rate')}</div>
                <div className="text-2xl font-bold text-green-500">{stableErrorRate.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Request Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">
              {t('simulators.canary.labels.live_requests')}
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {requests.map(request => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center justify-between p-2 rounded ${
                      request.status === 'success' 
                        ? request.targetVersion === 'canary' 
                          ? 'bg-orange-100 dark:bg-orange-900/20' 
                          : 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        request.targetVersion === 'canary' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></span>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {request.targetVersion === 'canary' ? 'v2' : 'v1'}
                      </span>
                      {request.status === 'success' ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {request.responseTime.toFixed(0)}ms
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {requests.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400 py-4">
                  {t('simulators.canary.labels.no_requests')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logs Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">
            {t('simulators.canary.labels.event_log')}
          </h2>
          <div className="bg-slate-800 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="text-green-400 mb-1">{log}</div>
            ))}
            {logs.length === 0 && (
              <div className="text-slate-500">{t('simulators.canary.labels.waiting_logs')}</div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">
          {t('simulators.canary.info.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('simulators.canary.info.try_this.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>• {t('simulators.canary.info.try_this.item1')}</li>
              <li>• {t('simulators.canary.info.try_this.item2')}</li>
              <li>• {t('simulators.canary.info.try_this.item3')}</li>
              <li>• {t('simulators.canary.info.try_this.item4')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('simulators.canary.info.observe.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>• {t('simulators.canary.info.observe.item1')}</li>
              <li>• {t('simulators.canary.info.observe.item2')}</li>
              <li>• {t('simulators.canary.info.observe.item3')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('simulators.canary.info.real_world.title')}</h3>
            <p className="text-sm">
              {t('simulators.canary.info.real_world.text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
