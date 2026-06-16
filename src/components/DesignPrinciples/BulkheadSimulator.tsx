import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { Legend, NarrationBar } from '../simulators/teaching';

type Mode = 'shared' | 'bulkhead';
const TICK_MS = 500;
const POOL = 10;

export default function BulkheadSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.bulkhead';

  const [mode, setMode] = useState<Mode>('shared');
  const [running, setRunning] = useState(false);
  const [bSlow, setBSlow] = useState(70);

  const [busyA, setBusyA] = useState(0);
  const [busyB, setBusyB] = useState(0);
  const [okA, setOkA] = useState(0);
  const [okB, setOkB] = useState(0);
  const [rejA, setRejA] = useState(0);
  const [rejB, setRejB] = useState(0);
  const tick = useRef(0);
  const releases = useRef<{ slot: 'a' | 'b'; at: number }[]>([]);

  const reset = useCallback(() => {
    setRunning(false);
    setBusyA(0);
    setBusyB(0);
    setOkA(0);
    setOkB(0);
    setRejA(0);
    setRejB(0);
    tick.current = 0;
    releases.current = [];
  }, []);

  useEffect(() => { reset(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mode]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      tick.current += 1;
      const now = tick.current;
      // Release any slots whose hold time has elapsed.
      releases.current = releases.current.filter((r) => r.at > now);

      const cap = mode === 'bulkhead' ? POOL / 2 : POOL;
      const liveCount = (slot: 'a' | 'b') =>
        mode === 'bulkhead'
          ? releases.current.filter((r) => r.slot === slot).length
          : releases.current.length;

      const tryAcquire = (slot: 'a' | 'b') => {
        const slow = slot === 'b' && Math.random() * 100 < bSlow;
        const hold = slow ? 8 : 1; // slow B calls occupy a worker far longer
        if (liveCount(slot) >= cap) return false;
        releases.current.push({ slot, at: now + hold });
        if (!slow) {
          if (slot === 'a') setOkA((v) => v + 1); else setOkB((v) => v + 1);
        }
        return true;
      };

      // Two new requests per tick for each service, served in a fair
      // (randomized) order so neither service gets first-pick of the shared
      // pool — otherwise A would always win the race and never starve.
      const incoming: ('a' | 'b')[] = ['a', 'a', 'b', 'b'];
      for (let i = incoming.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [incoming[i], incoming[j]] = [incoming[j], incoming[i]];
      }
      for (const slot of incoming) {
        if (!tryAcquire(slot)) {
          if (slot === 'a') setRejA((v) => v + 1); else setRejB((v) => v + 1);
        }
      }

      // Reflect live occupancy into the rendered slot view.
      setBusyA(releases.current.filter((r) => r.slot === 'a').length);
      setBusyB(releases.current.filter((r) => r.slot === 'b').length);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, mode, bSlow]);

  const totalA = okA + rejA;
  const totalB = okB + rejB;
  const healthA = totalA > 0 ? Math.round((okA / totalA) * 100) : 100;
  const healthB = totalB > 0 ? Math.round((okB / totalB) * 100) : 100;
  const capA = mode === 'bulkhead' ? POOL / 2 : POOL;
  const capB = mode === 'bulkhead' ? POOL / 2 : POOL;

  const starved = mode === 'shared' && busyB >= POOL - 1;
  const narrText = mode === 'bulkhead'
    ? t(`${base}.narration.bulkhead`)
    : starved
      ? t(`${base}.narration.starved`, { busyB })
      : t(`${base}.narration.shared`, { used: Math.min(busyA + busyB, POOL), pool: POOL });

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant={running ? 'danger' : 'primary'} onClick={() => setRunning((r) => !r)}>
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['shared', 'bulkhead'] as Mode[]).map((m) => (
              <TacticalButton key={m} size="sm" variant={mode === m ? 'secondary' : 'ghost'} onClick={() => setMode(m)}>
                {t(`${base}.modes.${m}`)}
              </TacticalButton>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.b_slow`)}</label>
            <input type="range" min="0" max="100" value={bSlow} onChange={(e) => setBSlow(Number(e.target.value))} className="h-2 w-28 cursor-pointer appearance-none bg-slate-200 accent-signal-red dark:bg-tactical-border" />
            <span className="w-10 text-right font-mono text-sm tabular-nums text-signal-red">{bSlow}%</span>
          </div>
        </div>

        <div className="mb-5">
          <NarrationBar tone={mode === 'bulkhead' ? 'success' : starved ? 'active' : 'idle'} stepKey={`${mode}-${starved}`}>
            {narrText}
          </NarrationBar>
        </div>

        {/* Worker pool slots */}
        {mode === 'shared' ? (
          <div className="rounded-lg border border-slate-200 p-4 dark:border-tactical-border">
            <div className="mb-2 flex items-center justify-between">
              <span className="label-mono">{t(`${base}.shared_pool`)}</span>
              <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-tactical-dim">{Math.min(busyA + busyB, POOL)}/{POOL}</span>
            </div>
            <PoolRow a={busyA} b={busyB} total={POOL} />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-signal-cyan/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="label-mono text-signal-cyan">{t(`${base}.pool_a`)}</span>
                <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-tactical-dim">{Math.min(busyA, capA)}/{capA}</span>
              </div>
              <PoolRow a={busyA} b={0} total={capA} />
            </div>
            <div className="rounded-lg border border-signal-amber/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="label-mono text-signal-amber">{t(`${base}.pool_b`)}</span>
                <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-tactical-dim">{Math.min(busyB, capB)}/{capB}</span>
              </div>
              <PoolRow a={0} b={busyB} total={capB} />
            </div>
          </div>
        )}

        <div className="mt-4">
          <Legend
            items={[
              { swatch: 'bg-signal-cyan', label: t(`${base}.legend_a`) },
              { swatch: 'bg-signal-amber', label: t(`${base}.legend_b`) },
              { swatch: '', hollow: true, label: t(`${base}.legend_free`) },
            ]}
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-tactical-border">
            <span className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">{t(`${base}.service_a`)}</span>
            <StatusBadge variant={healthA >= 70 ? 'online' : healthA >= 40 ? 'pending' : 'classified'} label={`${healthA}%`} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 dark:border-tactical-border">
            <span className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">{t(`${base}.service_b`)}</span>
            <StatusBadge variant={healthB >= 70 ? 'online' : healthB >= 40 ? 'pending' : 'classified'} label={`${healthB}%`} />
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={healthA} suffix="%" label={t(`${base}.metrics.a_health`)} color={healthA >= 70 ? 'green' : 'red'} />
          <AnimatedMetric value={healthB} suffix="%" label={t(`${base}.metrics.b_health`)} color={healthB >= 70 ? 'green' : 'amber'} />
          <AnimatedMetric value={rejA} label={t(`${base}.metrics.a_rejected`)} color={rejA > 0 ? 'red' : 'default'} pulse={running} />
          <AnimatedMetric value={rejB} label={t(`${base}.metrics.b_rejected`)} color={rejB > 0 ? 'amber' : 'default'} />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

function PoolRow({ a, b, total }: { a: number; b: number; total: number }) {
  const aN = Math.min(a, total);
  const bN = Math.min(b, total - aN);
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const kind = i < aN ? 'a' : i < aN + bN ? 'b' : 'free';
        return (
          <motion.div
            key={i}
            animate={{ scale: kind !== 'free' ? [1.15, 1] : 1 }}
            transition={{ duration: 0.25 }}
            className={`h-7 flex-1 rounded ${
              kind === 'a'
                ? 'bg-signal-cyan'
                : kind === 'b'
                  ? 'bg-signal-amber'
                  : 'border border-slate-200 dark:border-tactical-border'
            }`}
            style={{ minWidth: 16 }}
          />
        );
      })}
    </div>
  );
}
