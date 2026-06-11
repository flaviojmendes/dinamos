import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { Legend, NarrationBar } from '../simulators/teaching';

export default function QuorumReplicationSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.quorum_replication';

  const [n, setN] = useState(5);
  const [w, setW] = useState(3);
  const [r, setR] = useState(3);

  const [versions, setVersions] = useState<number[]>(() => new Array(5).fill(0));
  const [latest, setLatest] = useState(0);
  const [writeSet, setWriteSet] = useState<number[]>([]);
  const [readSet, setReadSet] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<{ value: number; stale: boolean } | null>(null);
  const [narr, setNarr] = useState<{ tone: 'idle' | 'active' | 'success'; key: string; text: string }>({
    tone: 'idle',
    key: 'idle',
    text: t(`${base}.narration.idle`),
  });

  const clampOnResize = useCallback(
    (size: number) => {
      setVersions(new Array(size).fill(0));
      setLatest(0);
      setWriteSet([]);
      setReadSet([]);
      setLastRead(null);
      setNarr({ tone: 'idle', key: `reset-${size}`, text: t(`${base}.narration.idle`) });
    },
    [t],
  );

  useEffect(() => {
    setW((prev) => Math.min(prev, n));
    setR((prev) => Math.min(prev, n));
    clampOnResize(n);
  }, [n, clampOnResize]);

  const pickNodes = (count: number) => {
    const idx = Array.from({ length: n }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, count);
  };

  const doWrite = useCallback(() => {
    const next = latest + 1;
    const targets = pickNodes(w);
    setVersions((prev) => {
      const copy = prev.slice();
      targets.forEach((i) => (copy[i] = next));
      return copy;
    });
    setLatest(next);
    setWriteSet(targets);
    setReadSet([]);
    setLastRead(null);
    setNarr({
      tone: 'active',
      key: `write-${next}`,
      text: t(`${base}.narration.wrote`, { version: next, w }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest, w, n, t]);

  const doRead = useCallback(() => {
    const targets = pickNodes(r);
    const value = Math.max(0, ...targets.map((i) => versions[i]));
    const stale = value < latest;
    const overlap = targets.filter((i) => writeSet.includes(i)).length;
    setReadSet(targets);
    setLastRead({ value, stale });
    setNarr(
      stale
        ? { tone: 'active', key: `read-stale-${Date.now()}`, text: t(`${base}.narration.read_stale`, { r, value }) }
        : { tone: 'success', key: `read-fresh-${Date.now()}`, text: t(`${base}.narration.read_fresh`, { r, value, count: overlap }) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r, n, versions, latest, writeSet, t]);

  const reset = useCallback(() => clampOnResize(n), [clampOnResize, n]);

  const strong = r + w > n;
  const faultTolerance = Math.min(n - w, n - r);

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

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Slider label={t(`${base}.controls.replicas`)} value={n} min={3} max={7} onChange={setN} />
          <Slider label={t(`${base}.controls.write_quorum`)} value={w} min={1} max={n} onChange={setW} />
          <Slider label={t(`${base}.controls.read_quorum`)} value={r} min={1} max={n} onChange={setR} />
        </div>

        <div
          className={`mb-5 flex items-center justify-between gap-3 rounded-lg border p-3 ${
            strong ? 'border-signal-green/50 bg-signal-green/10' : 'border-signal-amber/50 bg-signal-amber/10'
          }`}
        >
          <span className="font-mono text-sm text-slate-700 dark:text-tactical-text">
            R + W = {r + w} {strong ? '>' : '\u2264'} N = {n}
          </span>
          <StatusBadge variant={strong ? 'online' : 'pending'} label={strong ? t(`${base}.strong`) : t(`${base}.eventual`)} />
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <TacticalButton size="sm" variant="primary" onClick={doWrite}>
            {t(`${base}.buttons.write`)}
          </TacticalButton>
          <TacticalButton size="sm" variant="secondary" onClick={doRead} disabled={latest === 0}>
            {t(`${base}.buttons.read`)}
          </TacticalButton>
          <div className="ml-auto">
            <Legend
              items={[
                { swatch: 'bg-signal-cyan', label: t(`${base}.legend.write`) },
                { swatch: 'bg-signal-amber', label: t(`${base}.legend.read`) },
                { swatch: 'bg-signal-green', label: t(`${base}.legend.overlap`) },
              ]}
            />
          </div>
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>
            {narr.text}
          </NarrationBar>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {versions.map((v, i) => {
            const inWrite = writeSet.includes(i);
            const inRead = readSet.includes(i);
            const overlap = inWrite && inRead;
            const fresh = v === latest && latest > 0;
            return (
              <motion.div
                key={i}
                animate={{ scale: inWrite || inRead ? [1.1, 1] : 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`relative flex min-h-[88px] flex-col items-center justify-center rounded-lg border p-3 ${
                  overlap
                    ? 'border-signal-green bg-signal-green/15 ring-2 ring-signal-green/40'
                    : inWrite
                      ? 'border-signal-cyan bg-signal-cyan/10'
                      : inRead
                        ? 'border-signal-amber bg-signal-amber/10'
                        : 'border-slate-200 dark:border-tactical-border'
                }`}
              >
                <span
                  className={`font-mono text-2xl tabular-nums ${
                    fresh ? 'text-signal-green' : 'text-slate-400 dark:text-tactical-dim'
                  }`}
                >
                  v{v}
                </span>
                <span className="mt-1 label-mono">{t(`${base}.node`)} {i}</span>
                {inWrite && (
                  <span className="absolute -top-2 left-2 rounded-full bg-signal-cyan px-1.5 text-[9px] font-bold text-black">W</span>
                )}
                {inRead && (
                  <span className="absolute -top-2 right-2 rounded-full bg-signal-amber px-1.5 text-[9px] font-bold text-black">R</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {lastRead && (
          <div
            className={`mt-5 rounded-lg border p-3 font-sans text-sm ${
              lastRead.stale
                ? 'border-signal-red/50 bg-signal-red/10 text-red-700 dark:text-signal-red'
                : 'border-signal-green/50 bg-signal-green/10 text-emerald-700 dark:text-signal-green'
            }`}
          >
            {t(`${base}.read_returned`)} <span className="font-mono">v{lastRead.value}</span>{' '}
            {lastRead.stale ? t(`${base}.result.stale`) : t(`${base}.result.fresh`)}
          </div>
        )}
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={n} label={t(`${base}.metrics.replicas`)} color="default" />
          <AnimatedMetric value={latest} label={t(`${base}.metrics.latest`)} color="cyan" />
          <AnimatedMetric value={faultTolerance} label={t(`${base}.metrics.fault_tolerance`)} color={faultTolerance > 0 ? 'green' : 'red'} />
          <AnimatedMetric value={strong ? 1 : 0} format={() => (strong ? 'YES' : 'NO')} label={t(`${base}.metrics.strong`)} color={strong ? 'green' : 'amber'} />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 flex-1 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
        <span className="w-8 text-right font-mono text-sm tabular-nums text-signal-cyan">{value}</span>
      </div>
    </div>
  );
}
