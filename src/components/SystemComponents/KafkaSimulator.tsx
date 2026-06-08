import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, SegmentBar } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

const TICK_MS = 700;
const PALETTE = ['#22c55e', '#06b6d4', '#f59e0b', '#a855f7', '#ef4444', '#3b82f6'];
const MAX_BLOCKS = 12;

interface Particle {
  id: number;
  partition: number;
}

export default function KafkaSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.kafka';

  const [partitions, setPartitions] = useState(4);
  const [consumers, setConsumers] = useState(2);
  const [produceRate, setProduceRate] = useState(5);
  const [consumeRate, setConsumeRate] = useState(3);
  const [running, setRunning] = useState(false);

  const [buffers, setBuffers] = useState<number[]>(() => new Array(4).fill(0));
  const [particles, setParticles] = useState<Particle[]>([]);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const rrRef = useRef(0);
  const nextId = useRef(1);

  const assignedConsumer = useCallback((p: number) => p % consumers, [consumers]);

  const reset = useCallback(() => {
    setRunning(false);
    setBuffers(new Array(partitions).fill(0));
    setParticles([]);
    setProduced(0);
    setConsumed(0);
    rrRef.current = 0;
  }, [partitions]);

  useEffect(() => {
    setBuffers(prev => {
      const next = new Array(partitions).fill(0);
      for (let i = 0; i < Math.min(prev.length, partitions); i++) next[i] = prev[i];
      return next;
    });
  }, [partitions]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setBuffers(prev => {
        const next = [...prev];
        const newParticles: Particle[] = [];
        // Produce: round-robin across partitions.
        for (let i = 0; i < produceRate; i++) {
          const p = rrRef.current % partitions;
          rrRef.current += 1;
          next[p] += 1;
          newParticles.push({ id: nextId.current++, partition: p });
        }
        setProduced(v => v + produceRate);

        // Consume: each consumer drains its assigned partitions up to its budget.
        let totalConsumed = 0;
        for (let c = 0; c < consumers; c++) {
          const owned = next.map((_, idx) => idx).filter(idx => idx % consumers === c);
          let budget = consumeRate;
          let progress = true;
          while (budget > 0 && progress) {
            progress = false;
            for (const p of owned) {
              if (budget > 0 && next[p] > 0) {
                next[p] -= 1;
                budget -= 1;
                totalConsumed += 1;
                progress = true;
              }
            }
          }
        }
        if (totalConsumed > 0) setConsumed(v => v + totalConsumed);

        setParticles(prevP => [...prevP, ...newParticles].slice(-24));
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, partitions, consumers, produceRate, consumeRate]);

  const lag = buffers.reduce((s, v) => s + v, 0);
  const lagPct = Math.min(100, Math.round((lag / (partitions * MAX_BLOCKS)) * 100));
  const lagGrowing = produceRate > consumeRate * consumers;

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

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'partitions', value: partitions, set: setPartitions, min: 1, max: 6 },
            { key: 'consumers', value: consumers, set: setConsumers, min: 1, max: 6 },
            { key: 'produce_rate', value: produceRate, set: setProduceRate, min: 1, max: 12 },
            { key: 'consume_rate', value: consumeRate, set: setConsumeRate, min: 1, max: 12 },
          ].map(ctrl => (
            <div key={ctrl.key} className="space-y-2">
              <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.${ctrl.key}`)}</label>
              <div className="flex items-center gap-2">
                <input type="range" min={ctrl.min} max={ctrl.max} value={ctrl.value} onChange={e => ctrl.set(Number(e.target.value))} className={rangeClass} />
                <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{ctrl.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 items-center">
          {/* Producer */}
          <div className="flex lg:flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-tactical-border p-3">
            <motion.div
              className="h-3 w-3 rounded-full bg-signal-cyan"
              animate={running ? { scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] } : { scale: 1 }}
              transition={{ duration: TICK_MS / 1000, repeat: Infinity }}
            />
            <span className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label text-center">{t(`${base}.labels.producer`)}</span>
          </div>

          {/* Partitions */}
          <div className="space-y-2">
            {buffers.map((count, p) => {
              const color = PALETTE[assignedConsumer(p)];
              return (
                <div key={p} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 font-mono text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.partition`)} {p}</span>
                  <div className="relative flex-1 h-7 rounded-lg border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised overflow-hidden flex items-center px-1 gap-0.5">
                    <AnimatePresence mode="popLayout">
                      {Array.from({ length: Math.min(count, MAX_BLOCKS) }).map((_, i) => (
                        <motion.span
                          key={`${p}-${count - i}`}
                          layout
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="h-4 w-2 shrink-0"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </AnimatePresence>
                    {count > MAX_BLOCKS && (
                      <span className="ml-1 font-mono text-[10px] tabular-nums" style={{ color }}>+{count - MAX_BLOCKS}</span>
                    )}
                    {/* producer particle */}
                    <AnimatePresence>
                      {particles.filter(pt => pt.partition === p).slice(-1).map(pt => (
                        <motion.span
                          key={pt.id}
                          className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-signal-cyan"
                          initial={{ x: -8, opacity: 0 }}
                          animate={{ x: '100%', opacity: [0, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: TICK_MS / 1000 }}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consumer group */}
          <div className="space-y-2">
            <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.labels.consumers`)}</div>
            {Array.from({ length: consumers }).map((_, c) => {
              const owned = buffers.map((_, idx) => idx).filter(idx => idx % consumers === c);
              const idle = owned.length === 0;
              return (
                <div key={c} className="flex items-center gap-2 rounded-lg border px-3 py-1.5" style={{ borderColor: PALETTE[c] }}>
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PALETTE[c] }}
                    animate={running && !idle ? { opacity: [0.4, 1, 0.4] } : { opacity: idle ? 0.25 : 0.8 }}
                    transition={{ duration: TICK_MS / 1000, repeat: Infinity }}
                  />
                  <span className="font-mono text-xs text-slate-700 dark:text-tactical-text">{t(`${base}.labels.consumer`)} {c}</span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-tactical-label">
                    {idle ? t(`${base}.labels.idle`) : `P${owned.join(',')}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatedMetric value={produced} label={t(`${base}.metrics.produced`)} color="cyan" pulse={running} />
          <AnimatedMetric value={consumed} label={t(`${base}.metrics.consumed`)} color="green" pulse={running} />
          <AnimatedMetric value={lag} label={t(`${base}.metrics.lag`)} color={lagGrowing ? 'red' : 'default'} pulse={lagGrowing && running} />
          <AnimatedMetric value={consumeRate * consumers} label={t(`${base}.metrics.throughput`)} color="default" />
        </div>
        <div className="mt-4">
          <SegmentBar value={lagPct} max={100} color={lagGrowing ? 'red' : 'green'} caption={`${t(`${base}.metrics.lag`)}: ${lag}`} />
          <p className="mt-3 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
        </div>
      </Panel>
    </div>
  );
}
