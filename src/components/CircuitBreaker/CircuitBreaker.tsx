import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Config {
  failureThreshold: number;
  resetTimeout: number;
  requestTimeout: number;
  errorRate: number; // Percentage of requests that will fail (0-100)
}

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface Request {
  id: number;
  timestamp: number;
  status: 'success' | 'error' | 'timeout';
  duration: number;
}

const circuitStateVariant = (state: CircuitState) => {
  switch (state) {
    case 'CLOSED': return 'active' as const;
    case 'OPEN': return 'classified' as const;
    case 'HALF_OPEN': return 'in-progress' as const;
  }
};

export default function CircuitBreaker() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [errorsEnabled, setErrorsEnabled] = useState(false);
  const [config, setConfig] = useState<Config>({
    failureThreshold: 5,
    resetTimeout: 5000,
    requestTimeout: 1000,
    errorRate: 80
  });
  const [circuitState, setCircuitState] = useState<CircuitState>('CLOSED');
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [requests, setRequests] = useState<Request[]>([]);
  const [resetCountdown, setResetCountdown] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [requestsPerSecond, setRequestsPerSecond] = useState(2);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setCircuitState('CLOSED');
    setConsecutiveFailures(0);
    setRequests([]);
    setResetCountdown(0);
    setElapsedTime(0);
    setErrorsEnabled(false);
  }, []);

  const processRequest = useCallback(() => {
    if (circuitState === 'OPEN') {
      return;
    }

    const shouldFail = errorsEnabled && Math.random() * 100 < config.errorRate;
    const duration = shouldFail ? config.requestTimeout : Math.random() * 500 + 200;
    
    const request: Request = {
      id: Date.now(),
      timestamp: Date.now(),
      status: shouldFail ? 'error' : 'success',
      duration
    };

    setRequests(prev => [request, ...prev].slice(0, 10));

    if (shouldFail) {
      setConsecutiveFailures(prev => {
        const newFailures = prev + 1;
        if (newFailures >= config.failureThreshold) {
          setCircuitState('OPEN');
          setResetCountdown(config.resetTimeout / 1000);
        }
        return newFailures;
      });
    } else {
      setConsecutiveFailures(0);
      if (circuitState === 'HALF_OPEN') {
        setCircuitState('CLOSED');
      }
    }
  }, [circuitState, config, errorsEnabled]);

  useEffect(() => {
    if (!isRunning) return;

    const processInterval = setInterval(() => {
      processRequest();
    }, 1000 / requestsPerSecond);

    const elapsedInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(processInterval);
      clearInterval(elapsedInterval);
    };
  }, [isRunning, requestsPerSecond, processRequest]);

  useEffect(() => {
    if (circuitState !== 'OPEN' || resetCountdown <= 0) return;

    const countdown = setInterval(() => {
      setResetCountdown(prev => {
        if (prev <= 1) {
          setCircuitState('HALF_OPEN');
          setConsecutiveFailures(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [circuitState, resetCountdown]);

  const inputClass =
    'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-2 py-1 font-sans text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-brand-500 rounded-md dark:rounded-none';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <span className="inline-block text-xs font-medium text-slate-600 dark:text-tactical-label bg-slate-100 dark:bg-tactical-raised px-2.5 py-1 rounded-full mb-2">
          {t('simulators.circuit_breaker.title')}
        </span>
      </div>

      <Panel
        title={t('simulators.circuit_breaker.labels.state')}
        accent="cyan"
        action={
          <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
            {t('simulators.circuit_breaker.buttons.settings')}
          </TacticalButton>
        }
      >
        {isConfigOpen && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4 rounded-lg dark:rounded-none">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">Limite de falhas</label>
              <input
                type="number"
                value={config.failureThreshold}
                onChange={e => setConfig(prev => ({ ...prev, failureThreshold: +e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">Timeout de reset (ms)</label>
              <input
                type="number"
                value={config.resetTimeout}
                onChange={e => setConfig(prev => ({ ...prev, resetTimeout: +e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">Taxa de erro (%)</label>
              <input
                type="number"
                value={config.errorRate}
                onChange={e => setConfig(prev => ({ ...prev, errorRate: +e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
          <TacticalButton
            size="sm"
            variant={isRunning ? 'danger' : 'secondary'}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? t('simulators.circuit_breaker.buttons.stop') : t('simulators.circuit_breaker.buttons.start')}
          </TacticalButton>
          <TacticalButton
            size="sm"
            variant={errorsEnabled ? 'danger' : 'secondary'}
            onClick={() => setErrorsEnabled(!errorsEnabled)}
            disabled={!isRunning}
          >
            {errorsEnabled ? t('simulators.circuit_breaker.buttons.stop_errors') : t('simulators.circuit_breaker.buttons.start_errors')}
          </TacticalButton>
          <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
            {t('simulators.circuit_breaker.buttons.reset')}
          </TacticalButton>
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <label className="text-xs font-medium text-slate-500 dark:text-tactical-label whitespace-nowrap">{t('simulators.circuit_breaker.labels.rps')}</label>
            <input
              type="number"
              value={requestsPerSecond}
              onChange={e => setRequestsPerSecond(Math.max(1, Math.min(10, +e.target.value)))}
              className={`w-full sm:w-20 ${inputClass}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg dark:rounded-none">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <StatusBadge variant={circuitStateVariant(circuitState)} label={circuitState} />
              {circuitState === 'OPEN' && resetCountdown > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">{t('simulators.circuit_breaker.labels.reset_in')}</div>
                  <div className="font-mono text-sm font-medium text-slate-900 dark:text-tactical-text tabular-nums">{resetCountdown}s</div>
                </div>
              )}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">{t('simulators.circuit_breaker.labels.consecutive_failures')}</div>
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber">{consecutiveFailures}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg dark:rounded-none">
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">{t('simulators.circuit_breaker.labels.error_status')}</div>
            {errorsEnabled ? (
              <StatusBadge
                variant="classified"
                label={t('simulators.circuit_breaker.labels.active_with_chance', { percent: config.errorRate })}
              />
            ) : (
              <StatusBadge variant="active" label={t('simulators.circuit_breaker.labels.inactive')} />
            )}
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.circuit_breaker.labels.latest_requests')} accent="amber">
        <div className="space-y-2">
          {requests.map(request => (
            <div
              key={request.id}
              className="flex flex-wrap justify-between gap-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5 rounded-md dark:rounded-none"
            >
              <div className="flex items-center gap-2">
                <StatusBadge
                  variant={request.status === 'success' ? 'active' : 'classified'}
                  label={request.status.toUpperCase()}
                />
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim tabular-nums">{request.duration.toFixed(0)}ms</span>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg dark:rounded-none">
              <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                {t('simulators.circuit_breaker.labels.no_requests')}
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
