import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, SegmentBar } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

type Strategy = 'range' | 'hash';

const TICK_MS = 320;
const KEY_SPACE = 1000;

function hashKey(value: number): number {
  let h = (value * 2654435761) >>> 0;
  h ^= h >>> 15;
  return h >>> 0;
}

interface Particle {
  id: number;
  shard: number;
}

export default function ShardingSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.sharding';

  const [shards, setShards] = useState(4);
  const [strategy, setStrategy] = useState<Strategy>('hash');
  const [skew, setSkew] = useState(40);
  const [running, setRunning] = useState(false);

  const [load, setLoad] = useState<number[]>(() => new Array(4).fill(0));
  const [particles, setParticles] = useState<Particle[]>([]);
  const [total, setTotal] = useState(0);
  const nextId = useRef(1);

  const reset = useCallback(() => {
    setRunning(false);
    setLoad(new Array(shards).fill(0));
    setParticles([]);
    setTotal(0);
  }, [shards]);

  // Keep load array sized to shards.
  useEffect(() => {
    setLoad(prev => {
      const next = new Array(shards).fill(0);
      for (let i = 0; i < Math.min(prev.length, shards); i++) next[i] = prev[i];
      return next;
    });
  }, [shards]);

  const routeKey = useCallback(
    (value: number): number => {
      if (strategy === 'range') return Math.min(shards - 1, Math.floor((value / KEY_SPACE) * shards));
      return hashKey(value) % shards;
    },
    [strategy, shards],
  );

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const batch = 3;
      const newParticles: Particle[] = [];
      const increments = new Array(shards).fill(0);
      for (let i = 0; i < batch; i++) {
        // Skew biases key values toward the low end of the keyspace (hot range).
        const r = Math.random();
        const biased = Math.random() < skew / 100 ? Math.pow(r, 3) : r;
        const value = Math.floor(biased * KEY_SPACE);
        const shard = routeKey(value);
        increments[shard] += 1;
        newParticles.push({ id: nextId.current++, shard });
      }
      setParticles(prev => [...prev, ...newParticles].slice(-30));
      setLoad(prev => prev.map((v, i) => v + increments[i]));
      setTotal(tt => tt + batch);
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, shards, skew, routeKey]);

  const maxLoad = Math.max(...load, 1);
  const avg = total / Math.max(1, shards);
  const imbalance = avg > 0 ? Math.round(((maxLoad - avg) / avg) * 100) : 0;
  const hotShard = load.indexOf(maxLoad);

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant={running ? 'danger' : 'secondary'} onClick={() => setRunning(r => !r)}>
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.shards`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="2" max="8" value={shards} onChange={e => setShards(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{shards}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.strategy`)}</label>
            <div className="flex gap-2">
              {(['hash', 'range'] as Strategy[]).map(s => (
                <TacticalButton key={s} size="sm" variant={strategy === s ? 'secondary' : 'ghost'} onClick={() => setStrategy(s)}>
                  {t(`${base}.strategies.${s}`)}
                </TacticalButton>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.skew`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="100" value={skew} onChange={e => setSkew(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{skew}%</span>
            </div>
          </div>
        </div>

        {/* Shards */}
        <div className="relative grid gap-3" style={{ gridTemplateColumns: `repeat(${shards}, minmax(0, 1fr))` }}>
          {load.map((l, i) => {
            const isHot = total > 0 && i === hotShard && imbalance > 50;
            const pct = Math.round((l / maxLoad) * 100);
            return (
              <div key={i} className={`relative rounded-lg dark:rounded-none border ${isHot ? 'border-signal-red' : 'border-slate-200 dark:border-tactical-border'} bg-slate-50 dark:bg-tactical-raised p-3 flex flex-col justify-end min-h-[150px] overflow-hidden`}>
                <AnimatePresence>
                  {particles.filter(p => p.shard === i).slice(-1).map(p => (
                    <motion.span
                      key={p.id}
                      className={`absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${isHot ? 'bg-signal-red' : 'bg-signal-cyan'}`}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 60, opacity: [0, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </AnimatePresence>
                <motion.div
                  className={`w-full ${isHot ? 'bg-signal-red' : 'bg-signal-cyan'}`}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: TICK_MS / 1000, ease: 'linear' }}
                  style={{ minHeight: 2 }}
                />
                <div className="mt-2 text-center">
                  <div className="font-mono text-xs text-slate-700 dark:text-tactical-text tabular-nums">{l}</div>
                  <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.labels.shard`)} {i}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatedMetric value={total} label={t(`${base}.metrics.keys`)} color="cyan" pulse={running} />
          <AnimatedMetric value={shards} label={t(`${base}.metrics.shards`)} color="default" />
          <AnimatedMetric value={imbalance} suffix="%" label={t(`${base}.metrics.imbalance`)} color={imbalance > 50 ? 'red' : 'green'} />
          <AnimatedMetric value={maxLoad} label={t(`${base}.metrics.hot_load`)} color={imbalance > 50 ? 'red' : 'default'} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.metrics.imbalance`)}</span>
          </div>
          <SegmentBar value={imbalance} max={100} color={imbalance > 50 ? 'red' : 'green'} caption={`${imbalance}%`} />
          <p className="mt-3 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
        </div>
      </Panel>
    </div>
  );
}
