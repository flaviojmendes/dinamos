import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

type Strategy = 'token' | 'leaky' | 'sliding';

interface Request {
  id: number;
  timestamp: number;
  status: 'accepted' | 'rejected';
}

export default function RateLimiter() {
  const { t } = useTranslation();
  const [strategy, setStrategy] = useState<Strategy>('token');
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [requestsPerSecond, setRequestsPerSecond] = useState(5);
  const [messageRate, setMessageRate] = useState(8);
  const [maxTokens, setMaxTokens] = useState(10);

  // Unified "level": tokens available (token), queue depth (leaky), window count (sliding).
  const [level, setLevel] = useState(maxTokens);
  const windowRef = useRef<number[]>([]);
  const [windowCount, setWindowCount] = useState(0);

  const [requests, setRequests] = useState<Request[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, accepted: 0, rejected: 0 });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setRequests([]);
    setLevel(strategy === 'token' ? maxTokens : 0);
    windowRef.current = [];
    setWindowCount(0);
    setMetrics({ total: 0, accepted: 0, rejected: 0 });
  }, [maxTokens, strategy]);

  // Reset level baseline when switching strategy.
  useEffect(() => {
    setLevel(strategy === 'token' ? maxTokens : 0);
    windowRef.current = [];
    setWindowCount(0);
    setRequests([]);
    setMetrics({ total: 0, accepted: 0, rejected: 0 });
  }, [strategy, maxTokens]);

  // Token refill / leaky drain loop.
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (strategy === 'token') {
        setLevel(prev => Math.min(maxTokens, prev + requestsPerSecond / 10));
      } else if (strategy === 'leaky') {
        setLevel(prev => Math.max(0, prev - requestsPerSecond / 10));
      } else {
        const now = Date.now();
        windowRef.current = windowRef.current.filter(ts => now - ts < 1000);
        setWindowCount(windowRef.current.length);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, requestsPerSecond, maxTokens, strategy]);

  // Request generation.
  useEffect(() => {
    if (!isRunning) return;
    const generate = () => {
      const now = Date.now();
      let accepted = false;

      if (strategy === 'token') {
        if (level >= 1) {
          accepted = true;
          setLevel(prev => prev - 1);
        }
      } else if (strategy === 'leaky') {
        if (level < maxTokens) {
          accepted = true;
          setLevel(prev => Math.min(maxTokens, prev + 1));
        }
      } else {
        windowRef.current = windowRef.current.filter(ts => now - ts < 1000);
        if (windowRef.current.length < requestsPerSecond) {
          accepted = true;
          windowRef.current.push(now);
          setWindowCount(windowRef.current.length);
        }
      }

      setMetrics(prev => ({
        total: prev.total + 1,
        accepted: prev.accepted + (accepted ? 1 : 0),
        rejected: prev.rejected + (accepted ? 0 : 1),
      }));
      setRequests(prev => [{ id: now + Math.random(), timestamp: now, status: (accepted ? 'accepted' : 'rejected') as Request['status'] }, ...prev].slice(0, 5));
    };
    const requestInterval = setInterval(generate, 1000 / messageRate);
    return () => clearInterval(requestInterval);
  }, [isRunning, level, messageRate, strategy, requestsPerSecond, maxTokens]);

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  // Display values per strategy.
  const displayLevel = strategy === 'sliding' ? windowCount : level;
  const displayMax = strategy === 'sliding' ? requestsPerSecond : maxTokens;
  const fillPct = displayMax > 0 ? Math.min(100, (displayLevel / displayMax) * 100) : 0;
  const fillColor = strategy === 'leaky' && fillPct > 80 ? 'bg-signal-amber/70' : 'bg-signal-cyan/60';

  const acceptedPct = metrics.total > 0 ? Math.round((metrics.accepted / metrics.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <span className="inline-block text-xs font-medium text-slate-600 dark:text-tactical-label bg-slate-100 dark:bg-tactical-raised px-2.5 py-1 rounded-full mb-2">{t('simulators.rate_limiter.title')}</span>
      </div>

      <Panel
        title={t('simulators.rate_limiter.bucket.title')}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
              {isConfigOpen ? t('simulators.rate_limiter.buttons.close_config') : t('simulators.rate_limiter.buttons.configure')}
            </TacticalButton>
            <TacticalButton size="sm" variant={isRunning ? 'danger' : 'secondary'} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? t('simulators.rate_limiter.buttons.stop') : t('simulators.rate_limiter.buttons.start')}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
              {t('simulators.rate_limiter.buttons.reset')}
            </TacticalButton>
          </div>
        }
      >
        {/* Strategy selector */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-tactical-label mr-1">{t('simulators.rate_limiter.strategy')}</span>
          {(['token', 'leaky', 'sliding'] as Strategy[]).map(s => (
            <TacticalButton key={s} size="sm" variant={strategy === s ? 'secondary' : 'ghost'} onClick={() => setStrategy(s)}>
              {t(`simulators.rate_limiter.algorithms.${s}`)}
            </TacticalButton>
          ))}
        </div>
        <p className="mb-6 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`simulators.rate_limiter.algo_desc.${strategy}`)}</p>

        {isConfigOpen && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.config.token_rate')}</label>
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="20" value={requestsPerSecond} onChange={e => setRequestsPerSecond(Number(e.target.value))} className={rangeClass} />
                <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{requestsPerSecond}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.config.message_rate')}</label>
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="20" value={messageRate} onChange={e => setMessageRate(Number(e.target.value))} className={rangeClass} />
                <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{messageRate}</span>
              </div>
            </div>
            {strategy !== 'sliding' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.config.bucket_size')}</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="5" max="50" value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} className={rangeClass} />
                  <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{maxTokens}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-slate-200 dark:border-tactical-border rounded-lg">
            <div className="border-b border-slate-200 dark:border-tactical-border px-3 py-2">
              <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">{t(`simulators.rate_limiter.level.${strategy}`)}</div>
              <div className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.rate_limiter.bucket.rate', { rate: requestsPerSecond })}</div>
            </div>
            <div className="relative h-32 bg-slate-50 dark:bg-tactical-raised overflow-hidden border-t border-slate-200 dark:border-tactical-border">
              <motion.div className={`absolute bottom-0 w-full ${fillColor}`} animate={{ height: `${fillPct}%` }} transition={{ duration: 0.25 }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-tactical-text">
                  {Math.round(displayLevel)}/{displayMax}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-tactical-border rounded-lg">
            <div className="border-b border-slate-200 dark:border-tactical-border px-3 py-2">
              <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">{t('simulators.rate_limiter.recent.title')}</div>
              <div className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.rate_limiter.recent.rate', { rate: messageRate })}</div>
            </div>
            <div className="p-3 space-y-2">
              {requests.map(request => (
                <div key={request.id} className="flex flex-wrap items-center gap-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2 rounded-md">
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
                <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg">
                  <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">{t('simulators.rate_limiter.recent.none')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.rate_limiter.metrics.total')} accent="green">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AnimatedMetric value={metrics.total} label={t('simulators.rate_limiter.metrics.total')} color="cyan" pulse={isRunning} />
          <AnimatedMetric value={metrics.accepted} suffix={` (${acceptedPct}%)`} label={t('simulators.rate_limiter.metrics.accepted')} color="green" />
          <AnimatedMetric value={metrics.rejected} suffix={` (${100 - (metrics.total > 0 ? acceptedPct : 0)}%)`} label={t('simulators.rate_limiter.metrics.rejected')} color="red" />
        </div>
      </Panel>
    </div>
  );
}
