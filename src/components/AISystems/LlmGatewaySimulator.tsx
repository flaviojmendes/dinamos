import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton, type StatusVariant } from '../tactical';

type Route = 'cache' | 'primary' | 'fallback' | 'rejected';

interface ReqLog {
  id: number;
  route: Route;
  cost: number;
}

interface Metrics {
  served: number;
  cacheHits: number;
  fallbacks: number;
  rejected: number;
  cost: number;
}

const TICK_MS = 400;
const COST = { cache: 0, primary: 0.02, fallback: 0.035, rejected: 0 };

const routeVariant: Record<Route, StatusVariant> = {
  cache: 'completed',
  primary: 'active',
  fallback: 'in-progress',
  rejected: 'classified',
};

export default function LlmGatewaySimulator() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [arrivalRate, setArrivalRate] = useState(4);
  const [cacheRate, setCacheRate] = useState(30);
  const [rateLimit, setRateLimit] = useState(6);
  const [primaryFail, setPrimaryFail] = useState(15);

  const [logs, setLogs] = useState<ReqLog[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ served: 0, cacheHits: 0, fallbacks: 0, rejected: 0, cost: 0 });

  const nextId = useRef(1);
  const tokens = useRef(rateLimit);

  const reset = useCallback(() => {
    setIsRunning(false);
    setLogs([]);
    setMetrics({ served: 0, cacheHits: 0, fallbacks: 0, rejected: 0, cost: 0 });
    tokens.current = rateLimit;
  }, [rateLimit]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const tickSec = TICK_MS / 1000;
      // Refill token bucket.
      tokens.current = Math.min(rateLimit, tokens.current + rateLimit * tickSec);

      const arrivals = Math.random() < arrivalRate * tickSec - Math.floor(arrivalRate * tickSec)
        ? Math.ceil(arrivalRate * tickSec)
        : Math.floor(arrivalRate * tickSec);

      for (let i = 0; i < Math.max(1, arrivals); i++) {
        let route: Route;
        if (tokens.current < 1) {
          route = 'rejected';
        } else {
          tokens.current -= 1;
          if (Math.random() * 100 < cacheRate) {
            route = 'cache';
          } else if (Math.random() * 100 < primaryFail) {
            route = 'fallback';
          } else {
            route = 'primary';
          }
        }
        const cost = COST[route];
        const id = nextId.current++;
        setLogs(prev => [{ id, route, cost }, ...prev].slice(0, 8));
        setMetrics(prev => ({
          served: prev.served + (route !== 'rejected' ? 1 : 0),
          cacheHits: prev.cacheHits + (route === 'cache' ? 1 : 0),
          fallbacks: prev.fallbacks + (route === 'fallback' ? 1 : 0),
          rejected: prev.rejected + (route === 'rejected' ? 1 : 0),
          cost: Number((prev.cost + cost).toFixed(3)),
        }));
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [isRunning, arrivalRate, cacheRate, rateLimit, primaryFail]);

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.llm_gateway';

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant={isRunning ? 'danger' : 'secondary'} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Slider label={t(`${base}.controls.cache_rate`)} value={cacheRate} min={0} max={90} onChange={setCacheRate} cls={rangeClass} suffix="%" />
          <Slider label={t(`${base}.controls.rate_limit`)} value={rateLimit} min={1} max={20} onChange={v => { setRateLimit(v); }} cls={rangeClass} />
          <Slider label={t(`${base}.controls.primary_fail`)} value={primaryFail} min={0} max={80} onChange={setPrimaryFail} cls={rangeClass} suffix="%" />
          <Slider label="req/s" value={arrivalRate} min={1} max={20} onChange={setArrivalRate} cls={rangeClass} />
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title={t(`${base}.metrics.served`)} accent="green">
          <div className="grid grid-cols-2 gap-3">
            <Metric value={`${metrics.served}`} label={t(`${base}.metrics.served`)} color="green" />
            <Metric value={`${metrics.cacheHits}`} label={t(`${base}.metrics.cache_hits`)} color="cyan" />
            <Metric value={`${metrics.fallbacks}`} label={t(`${base}.metrics.fallbacks`)} color="amber" />
            <Metric value={`${metrics.rejected}`} label={t(`${base}.metrics.rejected`)} color={metrics.rejected > 0 ? 'red' : 'default'} />
            <Metric value={`$${metrics.cost.toFixed(2)}`} label={t(`${base}.metrics.cost`)} color="default" />
          </div>
        </Panel>

        <Panel title={t(`${base}.labels.recent`)} accent="amber">
          <div className="space-y-2 min-h-[160px]">
            {logs.length === 0 ? (
              <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                {t(`${base}.labels.empty`)}
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex items-center gap-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2">
                  <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim w-12 tabular-nums">#{log.id}</span>
                  <StatusBadge variant={routeVariant[log.route]} label={t(`${base}.routes.${log.route}`)} />
                  <span className="flex-1 text-right font-mono text-[11px] text-slate-500 dark:text-tactical-dim tabular-nums">
                    {log.cost > 0 ? `$${log.cost.toFixed(3)}` : '—'}
                  </span>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, cls, suffix }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; cls: string; suffix?: string }) {
  return (
    <div className="space-y-2">
      <label className="block label-mono text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className={cls} />
        <span className="font-mono text-sm w-12 text-right text-signal-cyan tabular-nums">{value}{suffix ?? ''}</span>
      </div>
    </div>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: 'default' | 'green' | 'amber' | 'red' | 'cyan' }) {
  const colorClass: Record<string, string> = {
    default: 'text-slate-900 dark:text-tactical-text',
    green: 'text-signal-green',
    amber: 'text-signal-amber',
    red: 'text-signal-red',
    cyan: 'text-signal-cyan',
  };
  return (
    <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
      <div className={`font-mono text-2xl font-bold tabular-nums leading-none ${colorClass[color]}`}>{value}</div>
      <div className="label-mono mt-2">{label}</div>
    </div>
  );
}
