import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Request {
  id: number;
  timestamp: number;
  status: 'accepted' | 'rejected';
}

interface Metrics {
  totalRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
}

export default function RateLimiter() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [requestsPerSecond, setRequestsPerSecond] = useState(5);
  const [messageRate, setMessageRate] = useState(5);
  const [maxTokens, setMaxTokens] = useState(10);
  const [tokens, setTokens] = useState(maxTokens);
  const [requests, setRequests] = useState<Request[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setRequests([]);
    setTokens(maxTokens);
    setMetrics({
      totalRequests: 0,
      acceptedRequests: 0,
      rejectedRequests: 0
    });
  }, [maxTokens]);

  // Token replenishment
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTokens(prev => Math.min(maxTokens, prev + requestsPerSecond / 10));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, requestsPerSecond, maxTokens]);

  // Request generation
  useEffect(() => {
    if (!isRunning) return;

    const generateRequest = () => {
      const hasToken = tokens >= 1;
      const request: Request = {
        id: Date.now(),
        timestamp: Date.now(),
        status: hasToken ? 'accepted' : 'rejected'
      };

      if (hasToken) {
        setTokens(prev => prev - 1);
        setMetrics(prev => ({
          ...prev,
          acceptedRequests: prev.acceptedRequests + 1,
          totalRequests: prev.totalRequests + 1
        }));
      } else {
        setMetrics(prev => ({
          ...prev,
          rejectedRequests: prev.rejectedRequests + 1,
          totalRequests: prev.totalRequests + 1
        }));
      }

      setRequests(prev => [request, ...prev].slice(0, 5));
    };

    const requestInterval = setInterval(generateRequest, 1000 / messageRate);
    return () => clearInterval(requestInterval);
  }, [isRunning, tokens, messageRate]);

  const rangeClass =
    'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('simulators.rate_limiter.title')} ]
        </div>
      </div>

      <Panel
        title={t('simulators.rate_limiter.bucket.title')}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
              {isConfigOpen ? t('simulators.rate_limiter.buttons.close_config') : t('simulators.rate_limiter.buttons.configure')}
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant={isRunning ? 'danger' : 'secondary'}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? t('simulators.rate_limiter.buttons.stop') : t('simulators.rate_limiter.buttons.start')}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
              {t('simulators.rate_limiter.buttons.reset')}
            </TacticalButton>
          </div>
        }
      >
        {isConfigOpen && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block label-mono text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.config.token_rate')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={requestsPerSecond}
                  onChange={e => setRequestsPerSecond(Number(e.target.value))}
                  className={rangeClass}
                />
                <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{requestsPerSecond}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block label-mono text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.config.message_rate')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={messageRate}
                  onChange={e => setMessageRate(Number(e.target.value))}
                  className={rangeClass}
                />
                <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{messageRate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block label-mono text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.config.bucket_size')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={maxTokens}
                  onChange={e => {
                    const newMax = Number(e.target.value);
                    setMaxTokens(newMax);
                    setTokens(prev => Math.min(prev, newMax));
                  }}
                  className={rangeClass}
                />
                <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{maxTokens}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-slate-200 dark:border-tactical-border">
            <div className="border-b border-slate-200 dark:border-tactical-border px-3 py-2">
              <div className="label-mono text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.bucket.title')}</div>
              <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.rate_limiter.bucket.rate', { rate: requestsPerSecond })}</div>
            </div>
            <div className="relative h-32 bg-slate-50 dark:bg-tactical-raised overflow-hidden border-t border-slate-200 dark:border-tactical-border">
              <div 
                className="absolute bottom-0 w-full bg-signal-cyan/60 transition-all duration-300"
                style={{ height: `${(tokens / maxTokens) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-tactical-text">
                  {Math.round(tokens)}/{maxTokens}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-tactical-border">
            <div className="border-b border-slate-200 dark:border-tactical-border px-3 py-2">
              <div className="label-mono text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.recent.title')}</div>
              <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.rate_limiter.recent.rate', { rate: messageRate })}</div>
            </div>
            <div className="p-3 space-y-2">
              {requests.map(request => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-center gap-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
                >
                  <StatusBadge
                    variant={request.status === 'accepted' ? 'active' : 'classified'}
                    label={request.status === 'accepted' ? t('simulators.rate_limiter.recent.accepted') : t('simulators.rate_limiter.recent.rejected')}
                  />
                  <span className="flex-1 min-w-[120px] font-mono text-xs text-slate-500 dark:text-tactical-dim tabular-nums">
                    {((Date.now() - request.timestamp) / 1000).toFixed(1)}s
                  </span>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center">
                  <p className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                    {t('simulators.rate_limiter.recent.none')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.rate_limiter.metrics.total')} accent="green">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{metrics.totalRequests}</div>
            <div className="label-mono mt-2">{t('simulators.rate_limiter.metrics.total')}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">
              {metrics.acceptedRequests}
              <span className="text-sm text-slate-500 dark:text-tactical-dim ml-1 font-normal">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.acceptedRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
            <div className="label-mono mt-2">{t('simulators.rate_limiter.metrics.accepted')}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red">
              {metrics.rejectedRequests}
              <span className="text-sm text-slate-500 dark:text-tactical-dim ml-1 font-normal">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.rejectedRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
            <div className="label-mono mt-2">{t('simulators.rate_limiter.metrics.rejected')}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
