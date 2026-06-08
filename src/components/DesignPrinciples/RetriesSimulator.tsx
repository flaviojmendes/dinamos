import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface RequestAttempt {
  id: number;
  timestamp: number;
  status: 'pending' | 'success' | 'error';
  delay: number;
}

interface SimulationConfig {
  maxRetries: number;
  baseDelay: number;
  successRate: number;
  useExponentialBackoff: boolean;
  jitter: boolean;
}

export default function RetriesSimulator() {
  const { t } = useTranslation();

  const [config, setConfig] = useState<SimulationConfig>({
    maxRetries: 3,
    baseDelay: 1000,
    successRate: 30,
    useExponentialBackoff: true,
    jitter: true,
  });

  const [attempts, setAttempts] = useState<RequestAttempt[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const calculateDelay = (attempt: number) => {
    let delay = config.baseDelay;
    
    if (config.useExponentialBackoff) {
      delay = config.baseDelay * Math.pow(2, attempt);
    }
    
    if (config.jitter) {
      const jitterAmount = delay * 0.2; // 20% jitter
      delay += Math.random() * jitterAmount - (jitterAmount / 2);
    }
    
    return Math.round(delay);
  };

  const simulateRequest = async () => {
    const success = Math.random() * 100 <= config.successRate;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve('Success');
        } else {
          reject('Failed');
        }
      }, 500);
    });
  };

  const startSimulation = async () => {
    setIsSimulating(true);
    setAttempts([]);
    setCurrentAttempt(0);

    let attemptCount = 0;
    let success = false;

    while (attemptCount <= config.maxRetries && !success) {
      const delay = calculateDelay(attemptCount);
      
      const newAttempt: RequestAttempt = {
        id: attemptCount + 1,
        timestamp: Date.now(),
        status: 'pending',
        delay: delay,
      };
      
      setAttempts(prev => [...prev, newAttempt]);
      setCurrentAttempt(attemptCount);

      try {
        await simulateRequest();
        setAttempts(prev => 
          prev.map(a => 
            a.id === newAttempt.id ? { ...a, status: 'success' } : a
          )
        );
        success = true;
      } catch (error) {
        setAttempts(prev => 
          prev.map(a => 
            a.id === newAttempt.id ? { ...a, status: 'error' } : a
          )
        );
        
        if (attemptCount < config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      attemptCount++;
    }

    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-sans font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('simulators.retries.title')}
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
              {t('simulators.retries.buttons.settings')}
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
            <Panel title={t('simulators.retries.settings.title')} accent="cyan">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.retries.settings.max_retries', { value: config.maxRetries })}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={config.maxRetries}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxRetries: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.retries.settings.base_delay', { ms: config.baseDelay })}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    step="100"
                    value={config.baseDelay}
                    onChange={(e) => setConfig(prev => ({ ...prev, baseDelay: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {t('simulators.retries.settings.success_rate', { percent: config.successRate })}
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
                <div className="space-y-4">
                  <label className="flex items-center gap-2 font-sans text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={config.useExponentialBackoff}
                      onChange={(e) => setConfig(prev => ({ ...prev, useExponentialBackoff: e.target.checked }))}
                      className="rounded border-slate-300 dark:border-tactical-border"
                    />
                    {t('simulators.retries.toggles.use_exponential_backoff')}
                  </label>
                  <label className="flex items-center gap-2 font-sans text-sm text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={config.jitter}
                      onChange={(e) => setConfig(prev => ({ ...prev, jitter: e.target.checked }))}
                      className="rounded border-slate-300 dark:border-tactical-border"
                    />
                    {t('simulators.retries.toggles.add_jitter')}
                  </label>
                </div>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title={t('simulators.retries.visualization.title')}
          accent="amber"
          action={
            <TacticalButton
              size="sm"
              variant="primary"
              onClick={startSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? t('simulators.retries.buttons.simulating') : t('simulators.retries.buttons.start')}
            </TacticalButton>
          }
        >
          <div className="space-y-2">
            {attempts.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5"
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.retries.attempt.label', { id: attempt.id })}</span>
                    {attempt.status === 'pending' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-signal-cyan border-t-transparent rounded-full"
                      />
                    )}
                    {attempt.status === 'success' && (
                      <StatusBadge variant="active" label={t('simulators.retries.stats.status_success')} />
                    )}
                    {attempt.status === 'error' && (
                      <StatusBadge variant="classified" label={t('simulators.retries.stats.status_failure')} />
                    )}
                  </div>
                  {index < attempts.length - 1 && attempt.status === 'error' && (
                    <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                      {t('simulators.retries.attempt.next_in', { ms: attempt.delay })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {attempts.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-10 text-center">
                <p className="font-sans text-sm text-slate-400 dark:text-slate-500">
                  —
                </p>
              </div>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={t('simulators.retries.stats.title')} accent="green">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{attempts.length}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.retries.stats.total_attempts')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">
                  {attempts.length > 0 ? 
                    (attempts[attempts.length - 1].status === 'success' ? t('simulators.retries.stats.status_success') : t('simulators.retries.stats.status_failure')) :
                    '-'
                  }
                </div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.retries.stats.final_status')}</div>
              </div>
            </div>
          </Panel>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 border-l-2 border-l-emerald-500 bg-slate-50 dark:bg-slate-900 p-5">
            <h3 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-3">{t('simulators.retries.info.title')}</h3>
            <div className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-slate-400">
              <p className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.retries.info.p1')}</p>
              <p className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.retries.info.p2')}</p>
              <p className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">•</span>{t('simulators.retries.info.p3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
