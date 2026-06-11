import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

const REPLICAS = ['A', 'B', 'C'];
type Vector = number[];

const zero = (): Vector[] => REPLICAS.map(() => REPLICAS.map(() => 0));
const sum = (v: Vector) => v.reduce((a, b) => a + b, 0);
const equalVec = (a: Vector, b: Vector) => a.every((x, i) => x === b[i]);

export default function CrdtSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.crdt';

  const [vectors, setVectors] = useState<Vector[]>(zero);
  const [merges, setMerges] = useState(0);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [narr, setNarr] = useState<{ tone: 'idle' | 'active' | 'success'; key: string; text: string }>({
    tone: 'idle',
    key: 'idle',
    text: t(`${base}.narration.idle`),
  });
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totals = vectors.map(sum);
  const converged = vectors.every((v) => equalVec(v, vectors[0]));

  const pulse = useCallback((keys: string[]) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash(new Set(keys));
    flashTimer.current = setTimeout(() => setFlash(new Set()), 750);
  }, []);

  const reset = useCallback(() => {
    setVectors(zero());
    setMerges(0);
    setFlash(new Set());
    setNarr({ tone: 'idle', key: 'reset', text: t(`${base}.narration.idle`) });
  }, [t]);

  const increment = useCallback(
    (r: number) => {
      setVectors((prev) => prev.map((v, i) => (i === r ? v.map((c, j) => (j === r ? c + 1 : c)) : v)));
      pulse([`${r}-${r}`]);
      const total = sum(vectors[r]) + 1;
      setNarr({
        tone: 'active',
        key: `inc-${r}-${Date.now()}`,
        text: t(`${base}.narration.increment`, { replica: REPLICAS[r], total }),
      });
    },
    [vectors, pulse, t],
  );

  const mergePair = useCallback(
    (a: number, b: number) => {
      setVectors((prev) => {
        const merged = prev[a].map((c, j) => Math.max(c, prev[b][j]));
        const changed: string[] = [];
        merged.forEach((c, j) => {
          if (c !== prev[a][j]) changed.push(`${a}-${j}`);
          if (c !== prev[b][j]) changed.push(`${b}-${j}`);
        });
        pulse(changed);
        return prev.map((v, i) => (i === a || i === b ? merged.slice() : v));
      });
      setMerges((m) => m + 1);
      setNarr({
        tone: 'active',
        key: `merge-${a}-${b}-${Date.now()}`,
        text: t(`${base}.narration.merge`, { a: REPLICAS[a], b: REPLICAS[b] }),
      });
    },
    [pulse, t],
  );

  const syncAll = useCallback(() => {
    setVectors((prev) => {
      const merged = REPLICAS.map((_, j) => Math.max(...prev.map((v) => v[j])));
      const changed: string[] = [];
      prev.forEach((v, i) => v.forEach((c, j) => { if (c !== merged[j]) changed.push(`${i}-${j}`); }));
      pulse(changed);
      return prev.map(() => merged.slice());
    });
    setMerges((m) => m + 1);
    const total = Math.max(...vectors.map(sum));
    setNarr({
      tone: 'success',
      key: `sync-${Date.now()}`,
      text: t(`${base}.narration.converged`, { total }),
    });
  }, [pulse, t, vectors]);

  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
  ];

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <TacticalButton size="sm" variant="ghost" onClick={reset}>
            {t(`${base}.buttons.reset`)}
          </TacticalButton>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>
            {narr.text}
          </NarrationBar>
        </div>

        {/* Replica cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          {vectors.map((v, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 transition-colors ${
                converged
                  ? 'border-signal-green/40 dark:border-signal-green/30'
                  : 'border-slate-200 dark:border-tactical-border'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
                  {t(`${base}.replica`)} {REPLICAS[i]}
                </span>
                <motion.span
                  key={totals[i]}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="font-mono text-2xl tabular-nums text-signal-cyan"
                >
                  {totals[i]}
                </motion.span>
              </div>
              <div className="mb-3 flex gap-1.5">
                {v.map((c, j) => {
                  const isFlash = flash.has(`${i}-${j}`);
                  return (
                    <motion.div
                      key={j}
                      animate={isFlash ? { scale: [1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className={`flex-1 rounded px-1 py-1.5 text-center ${
                        isFlash
                          ? 'bg-signal-green/20 ring-1 ring-signal-green/50'
                          : 'bg-slate-100 dark:bg-tactical-raised'
                      }`}
                    >
                      <div className="label-mono">{REPLICAS[j]}</div>
                      <div className="font-mono text-sm tabular-nums text-slate-700 dark:text-tactical-text">{c}</div>
                    </motion.div>
                  );
                })}
              </div>
              <TacticalButton size="sm" variant="secondary" className="w-full" onClick={() => increment(i)}>
                {t(`${base}.increment`, { replica: REPLICAS[i] })}
              </TacticalButton>
            </div>
          ))}
        </div>

        {/* Gossip / merge controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-tactical-label">
            {t(`${base}.gossip_label`)}
          </span>
          {pairs.map(([a, b]) => (
            <TacticalButton key={`${a}-${b}`} size="sm" variant="ghost" onClick={() => mergePair(a, b)}>
              {REPLICAS[a]} &#8644; {REPLICAS[b]}
            </TacticalButton>
          ))}
          <TacticalButton size="sm" variant="primary" onClick={syncAll}>
            {t(`${base}.buttons.sync`)}
          </TacticalButton>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <StatusBadge
            variant={converged ? 'online' : 'pending'}
            label={converged ? t(`${base}.converged`) : t(`${base}.diverged`)}
          />
          <span className="font-sans text-xs text-slate-500 dark:text-tactical-dim">
            {converged ? t(`${base}.all_agree`) : t(`${base}.need_sync`)}
          </span>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={Math.max(...totals)} label={t(`${base}.metrics.max_value`)} color="cyan" />
          <AnimatedMetric value={merges} label={t(`${base}.metrics.merges`)} color="default" />
          <AnimatedMetric
            value={converged ? 1 : 0}
            format={() => (converged ? 'YES' : 'NO')}
            label={t(`${base}.metrics.converged`)}
            color={converged ? 'green' : 'amber'}
          />
          <AnimatedMetric value={REPLICAS.length} label={t(`${base}.metrics.replicas`)} color="default" />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}
