import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton, type StatusVariant } from '../tactical';
import { AnimatedMetric, GridBackdrop } from './motion';

type Route = 'cache' | 'primary' | 'fallback' | 'rejected';

interface ReqLog {
  id: number;
  route: Route;
  cost: number;
}

interface Particle {
  id: number;
  route: Route;
}

const ROUTE_ORDER: Route[] = ['cache', 'primary', 'fallback', 'rejected'];
const routeColor: Record<Route, string> = {
  cache: 'bg-signal-green',
  primary: 'bg-signal-cyan',
  fallback: 'bg-signal-amber',
  rejected: 'bg-signal-red',
};
const routeText: Record<Route, string> = {
  cache: 'text-signal-green',
  primary: 'text-signal-cyan',
  fallback: 'text-signal-amber',
  rejected: 'text-signal-red',
};
const laneTop: Record<Route, string> = {
  cache: '14%',
  primary: '38%',
  fallback: '62%',
  rejected: '86%',
};

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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ served: 0, cacheHits: 0, fallbacks: 0, rejected: 0, cost: 0 });

  const nextId = useRef(1);
  const tokens = useRef(rateLimit);

  const reset = useCallback(() => {
    setIsRunning(false);
    setLogs([]);
    setParticles([]);
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
        setParticles(prev => [...prev, { id, route }].slice(-24));
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
        <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Slider label={t(`${base}.controls.cache_rate`)} value={cacheRate} min={0} max={90} onChange={setCacheRate} cls={rangeClass} suffix="%" />
          <Slider label={t(`${base}.controls.rate_limit`)} value={rateLimit} min={1} max={20} onChange={v => { setRateLimit(v); }} cls={rangeClass} />
          <Slider label={t(`${base}.controls.primary_fail`)} value={primaryFail} min={0} max={80} onChange={setPrimaryFail} cls={rangeClass} suffix="%" />
          <Slider label="req/s" value={arrivalRate} min={1} max={20} onChange={setArrivalRate} cls={rangeClass} />
        </div>
      </Panel>

      {/* Routing flow visualization */}
      <Panel title={t(`${base}.title`)} accent="cyan" bodyClassName="p-0">
        <div className="relative h-[230px] overflow-hidden">
          <GridBackdrop />

          {/* Source node */}
          <div className="absolute left-[6%] top-1/2 -translate-y-1/2 -translate-x-0">
            <motion.div
              className="rounded-lg border border-signal-cyan/60 bg-slate-50 dark:bg-tactical-raised px-3 py-3 text-center"
              animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <div className="font-sans text-lg font-bold text-signal-cyan">⇉</div>
              <div className="font-sans text-[11px] font-medium mt-1 text-slate-500 dark:text-tactical-label">req/s <span className="font-mono tabular-nums">{arrivalRate}</span></div>
            </motion.div>
          </div>

          {/* Lanes */}
          {ROUTE_ORDER.map(route => (
            <div
              key={route}
              className="absolute right-[5%] flex -translate-y-1/2 items-center"
              style={{ top: laneTop[route] }}
            >
              <div className={`rounded-md border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-1.5 font-sans text-[11px] font-medium ${routeText[route]}`}>
                {t(`${base}.routes.${route}`)}
              </div>
            </div>
          ))}

          {/* Travelling request particles */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                className={`absolute h-2.5 w-2.5 rounded-full ${routeColor[p.route]}`}
                initial={{ left: '11%', top: '50%', opacity: 0, scale: 0.6 }}
                animate={{ left: '90%', top: laneTop[p.route], opacity: [0, 1, 1, 0.8], scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                onAnimationComplete={() => setParticles(prev => prev.filter(x => x.id !== p.id))}
              />
            ))}
          </AnimatePresence>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title={t(`${base}.metrics.served`)} accent="green">
          <div className="grid grid-cols-2 gap-3">
            <AnimatedMetric value={metrics.served} label={t(`${base}.metrics.served`)} color="green" pulse={isRunning} />
            <AnimatedMetric value={metrics.cacheHits} label={t(`${base}.metrics.cache_hits`)} color="cyan" />
            <AnimatedMetric value={metrics.fallbacks} label={t(`${base}.metrics.fallbacks`)} color="amber" />
            <AnimatedMetric value={metrics.rejected} label={t(`${base}.metrics.rejected`)} color={metrics.rejected > 0 ? 'red' : 'default'} />
            <AnimatedMetric value={metrics.cost} decimals={2} prefix="$" label={t(`${base}.metrics.cost`)} color="default" />
          </div>
        </Panel>

        <Panel title={t(`${base}.labels.recent`)} accent="amber">
          <div className="space-y-2 min-h-[160px]">
            {logs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center font-sans text-xs text-slate-400 dark:text-tactical-label">
                {t(`${base}.labels.empty`)}
              </div>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                {logs.map(log => (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, y: -14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="flex items-center gap-2 rounded-md border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
                  >
                    <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim w-12 tabular-nums">{log.id}</span>
                    <StatusBadge variant={routeVariant[log.route]} label={t(`${base}.routes.${log.route}`)} />
                    <span className="flex-1 text-right font-mono text-[11px] text-slate-500 dark:text-tactical-dim tabular-nums">
                      {log.cost > 0 ? `$${log.cost.toFixed(3)}` : '—'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
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
      <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className={cls} />
        <span className="font-mono text-sm w-12 text-right text-signal-cyan tabular-nums">{value}{suffix ?? ''}</span>
      </div>
    </div>
  );
}
