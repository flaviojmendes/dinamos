import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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

  const getStateColor = () => {
    switch (circuitState) {
      case 'CLOSED': return 'bg-green-500';
      case 'OPEN': return 'bg-red-500';
      case 'HALF_OPEN': return 'bg-yellow-500';
    }
  };

  return (
    <div className="p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-xl font-semibold">{t('simulators.circuit_breaker.title')}</h1>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="w-full sm:w-auto px-3 py-1 bg-zinc-800 rounded-md hover:bg-zinc-700"
          >
            {t('simulators.circuit_breaker.buttons.settings')}
          </button>
        </div>

        {isConfigOpen && (
          <div className="mb-4 p-4 bg-zinc-800 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Limite de Falhas</label>
                <input
                  type="number"
                  value={config.failureThreshold}
                  onChange={e => setConfig(prev => ({ ...prev, failureThreshold: +e.target.value }))}
                  className="w-full bg-zinc-700 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Timeout de Reset (ms)</label>
                <input
                  type="number"
                  value={config.resetTimeout}
                  onChange={e => setConfig(prev => ({ ...prev, resetTimeout: +e.target.value }))}
                  className="w-full bg-zinc-700 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Taxa de Erro (%)</label>
                <input
                  type="number"
                  value={config.errorRate}
                  onChange={e => setConfig(prev => ({ ...prev, errorRate: +e.target.value }))}
                  className="w-full bg-zinc-700 rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md ${
                isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? t('simulators.circuit_breaker.buttons.stop') : t('simulators.circuit_breaker.buttons.start')}
            </button>
            <button
              onClick={() => setErrorsEnabled(!errorsEnabled)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md ${
                errorsEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={!isRunning}
            >
              {errorsEnabled ? t('simulators.circuit_breaker.buttons.stop_errors') : t('simulators.circuit_breaker.buttons.start_errors')}
            </button>
            <button
              onClick={resetSimulation}
              className="flex-1 sm:flex-none px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600"
            >
              {t('simulators.circuit_breaker.buttons.reset')}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm whitespace-nowrap">{t('simulators.circuit_breaker.labels.rps')}</label>
            <input
              type="number"
              value={requestsPerSecond}
              onChange={e => setRequestsPerSecond(Math.max(1, Math.min(10, +e.target.value)))}
              className="w-full sm:w-20 bg-zinc-700 rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className={`w-4 h-4 rounded-full ${getStateColor()}`} />
              <div>
                <div className="text-sm text-zinc-400">{t('simulators.circuit_breaker.labels.state')}</div>
                <div className="font-medium">{circuitState}</div>
              </div>
              {circuitState === 'OPEN' && resetCountdown > 0 && (
                <div>
                  <div className="text-sm text-zinc-400">{t('simulators.circuit_breaker.labels.reset_in')}</div>
                  <div className="font-medium">{resetCountdown}s</div>
                </div>
              )}
            </div>
            <div className="text-sm text-zinc-400">{t('simulators.circuit_breaker.labels.consecutive_failures')}</div>
            <div className="font-medium">{consecutiveFailures}</div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">{t('simulators.circuit_breaker.labels.error_status')}</div>
            <div className="font-medium">
              {errorsEnabled ? (
                <span className="text-red-400">{t('simulators.circuit_breaker.labels.active_with_chance', { percent: config.errorRate })}</span>
              ) : (
                <span className="text-green-400">{t('simulators.circuit_breaker.labels.inactive')}</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-3">{t('simulators.circuit_breaker.labels.latest_requests')}</h2>
          <div className="space-y-2">
            {requests.map(request => (
              <div
                key={request.id}
                className={`p-2 rounded flex flex-wrap justify-between gap-2 ${
                  request.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}
              >
                <span>
                  {request.status === 'success' ? '✓' : '✗'} {request.status.toUpperCase()}
                </span>
                <span className="text-sm">{request.duration.toFixed(0)}ms</span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-zinc-500 text-center py-4">
                {t('simulators.circuit_breaker.labels.no_requests')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 