import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationMotion } from '../simulation';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';
import TransitPacket from '../DataStorage/TransitPacket';
import { Check, X, Inbox, ShieldAlert } from 'lucide-react';

const TICK_MS = 800;

interface Message {
  id: number;
  attempts: number;
  poison: boolean;
}
type Verdict = 'ok' | 'retry' | 'dlq';
interface LastMsg extends Message {
  verdict: Verdict;
}
type Narr = { tone: 'idle' | 'active' | 'success'; key: string; text: string };

export default function DeadLetterQueueSimulator() {
  const { t } = useTranslation();
  const { reducedMotion, transition } = useSimulationMotion();
  const base = 'simulators.dead_letter_queue';

  const [running, setRunning] = useState(false);
  const [failureRate, setFailureRate] = useState(35);
  const [maxRetries, setMaxRetries] = useState(3);

  const [queue, setQueue] = useState<Message[]>([]);
  const [dlq, setDlq] = useState<Message[]>([]);
  const [processed, setProcessed] = useState(0);
  const [retried, setRetried] = useState(0);
  const [deadLettered, setDeadLettered] = useState(0);
  const [last, setLast] = useState<LastMsg | null>(null);
  const [narr, setNarr] = useState<Narr>({ tone: 'idle', key: 'idle', text: t(`${base}.narration.idle`) });

  const queueRef = useRef<Message[]>([]);
  const nextId = useRef(1);
  const failRef = useRef(failureRate);
  failRef.current = failureRate;
  const maxRef = useRef(maxRetries);
  maxRef.current = maxRetries;

  const reset = useCallback(() => {
    setRunning(false);
    queueRef.current = [];
    setQueue([]);
    setDlq([]);
    setProcessed(0);
    setRetried(0);
    setDeadLettered(0);
    setLast(null);
    setNarr({ tone: 'idle', key: `reset-${Date.now()}`, text: t(`${base}.narration.idle`) });
  }, [t]);

  const step = useCallback(() => {
    let next = queueRef.current.slice();
    if (Math.random() < 0.9) {
      next.push({ id: nextId.current++, attempts: 0, poison: Math.random() < 0.15 });
    }
    if (next.length > 0) {
      const msg = { ...next[0] };
      next = next.slice(1);
      msg.attempts += 1;
      const failed = msg.poison || Math.random() * 100 < failRef.current;
      let verdict: Verdict;
      if (!failed) {
        verdict = 'ok';
        setProcessed((p) => p + 1);
        setNarr({ tone: 'success', key: `ok-${msg.id}-${Date.now()}`, text: t(`${base}.narration.ok`, { id: msg.id, n: msg.attempts }) });
      } else if (msg.attempts >= maxRef.current) {
        verdict = 'dlq';
        setDeadLettered((d) => d + 1);
        setDlq((dl) => [...dl, msg].slice(-12));
        setNarr({ tone: 'active', key: `dlq-${msg.id}-${Date.now()}`, text: t(`${base}.narration.dlq`, { id: msg.id, n: msg.attempts }) });
      } else {
        verdict = 'retry';
        setRetried((r) => r + 1);
        next.push(msg);
        setNarr({ tone: 'active', key: `retry-${msg.id}-${Date.now()}`, text: t(`${base}.narration.retry`, { id: msg.id, n: msg.attempts, max: maxRef.current }) });
      }
      setLast({ ...msg, verdict });
    }
    queueRef.current = next.slice(0, 24);
    setQueue(queueRef.current);
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [running, step]);

  const totalDone = processed + deadLettered;
  const successRate = totalDone > 0 ? Math.round((processed / totalDone) * 100) : 0;

  const verdictStyle =
    last?.verdict === 'ok'
      ? { ring: 'border-signal-green/60 bg-signal-green/10', text: 'text-signal-green', icon: '\u2713' }
      : last?.verdict === 'dlq'
        ? { ring: 'border-signal-red/60 bg-signal-red/10', text: 'text-signal-red', icon: '\u2717' }
        : last?.verdict === 'retry'
          ? { ring: 'border-signal-amber/60 bg-signal-amber/10', text: 'text-signal-amber', icon: '\u21bb' }
          : { ring: 'border-slate-200 dark:border-tactical-border', text: 'text-slate-400 dark:text-tactical-dim', icon: '\u2014' };

  return (
    <div className="simulation-workspace space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="sim-controls flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={step} disabled={running}><SkipForward size={14} aria-hidden="true" />{t(`${base}.buttons.step`)}</TacticalButton>
            <TacticalButton size="sm" aria-pressed={running} variant={running ? 'secondary' : 'primary'} onClick={() => setRunning((r) => !r)}>
              {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}><RotateCcw size={14} aria-hidden="true" />{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Slider label={t(`${base}.controls.failure_rate`)} value={failureRate} min={0} max={80} suffix="%" onChange={setFailureRate} />
          <Slider label={t(`${base}.controls.max_retries`)} value={maxRetries} min={1} max={6} onChange={setMaxRetries} />
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        <div className="sim-stage grid items-center gap-3 lg:grid-cols-[1fr_36px_auto_36px_1fr]">
          {/* Main queue */}
          <div className="sim-node min-h-32 rounded-lg border border-slate-200 p-4 dark:border-tactical-border">
            <div className="mb-3 flex items-center gap-2 font-sans text-sm font-medium"><Inbox size={17} aria-hidden="true" />{t(`${base}.main_queue`)}<span className="ml-auto font-mono text-xs tabular-nums text-slate-500 dark:text-tactical-dim">{queue.length}</span></div>
            <div className="flex min-h-[3rem] flex-wrap gap-1.5">
              <AnimatePresence>
                {queue.map((m) => (
                  <motion.div
                    key={m.id}
                    layout={!reducedMotion}
                    initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: reducedMotion ? 0 : -12 }}
                    transition={transition}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-1.5 font-mono text-[11px] ${
                      m.poison
                        ? 'border-signal-red/50 bg-signal-red/10 text-signal-red'
                        : m.attempts > 0
                          ? 'border-signal-amber/50 bg-signal-amber/20 text-signal-amber'
                          : 'border-signal-cyan/40 bg-signal-cyan/20 text-signal-cyan'
                    }`}
                    title={m.poison ? t(`${base}.poison`) : undefined}
                  >
                    #{m.id}{m.attempts > 0 && <span className="ml-1 opacity-70">·{m.attempts}</span>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="sim-flow relative h-8 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-300 dark:bg-tactical-line" />
            {last && <TransitPacket key={`${last.id}-${last.attempts}`} />}
          </div>

          {/* Consumer */}
          <div className="sim-node flex min-h-32 flex-col items-center justify-center rounded-lg border border-slate-200 px-5 py-4 text-center dark:border-tactical-border">
            <div className="label-mono mb-2">{t(`${base}.consumer`)}</div>
            <motion.div
              key={last ? `${last.id}-${last.attempts}` : 'none'}
              initial={{ scale: reducedMotion ? 1 : 0.92, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={transition}
              className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-xl ${verdictStyle.ring} ${verdictStyle.text}`}
            >
              {last?.verdict === 'ok' ? <Check size={22} /> : last?.verdict === 'dlq' ? <X size={22} /> : last?.verdict === 'retry' ? <RotateCcw size={20} /> : <Inbox size={21} />}
            </motion.div>
            {last && (
              <div className="mt-2 font-mono text-[10px] text-slate-500 dark:text-tactical-dim">
                #{last.id} · {t(`${base}.attempt`)} {last.attempts}/{maxRetries}
              </div>
            )}
          </div>

          <div className="sim-flow relative h-8 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-300 dark:bg-tactical-line" />
            {last && <TransitPacket key={`${last.id}-${last.attempts}`} tone={last.verdict === 'ok' ? 'green' : last.verdict === 'dlq' ? 'red' : 'amber'} reverse={last.verdict === 'retry'} />}
          </div>

          <div className="space-y-3">

          {/* Processed bin */}
          <div className="sim-node flex items-center justify-between gap-3 rounded-lg border border-signal-green/30 bg-signal-green/5 px-4 py-3">
            <div className="font-sans text-sm text-signal-green">{t(`${base}.metrics.processed`)}</div>
            <div className="font-mono text-2xl tabular-nums text-signal-green">{processed}</div>
          </div>

          {/* DLQ */}
          <div className="sim-node rounded-lg border border-signal-red/40 bg-signal-red/5 p-4">
            <div className="mb-3 flex items-center gap-2 font-sans text-sm font-medium text-signal-red"><ShieldAlert size={17} aria-hidden="true" />{t(`${base}.dlq`)}</div>
            <div className="flex min-h-[3rem] flex-wrap gap-1.5">
              <AnimatePresence>
                {dlq.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition} className="flex h-8 min-w-8 items-center justify-center rounded-md border border-signal-red/50 bg-signal-red/10 px-1.5 font-mono text-[11px] text-signal-red">
                    #{m.id}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="sim-metrics grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={processed} label={t(`${base}.metrics.processed`)} color="green" pulse={running} />
          <AnimatedMetric value={retried} label={t(`${base}.metrics.retried`)} color="amber" />
          <AnimatedMetric value={deadLettered} label={t(`${base}.metrics.dead_lettered`)} color={deadLettered > 0 ? 'red' : 'default'} />
          <AnimatedMetric value={successRate} suffix="%" label={t(`${base}.metrics.success_rate`)} color={successRate >= 80 ? 'green' : 'amber'} />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

function Slider({ label, value, min, max, suffix = '', onChange }: { label: string; value: number; min: number; max: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 flex-1 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
        <span className="w-12 text-right font-mono text-sm tabular-nums text-signal-cyan">{value}{suffix}</span>
      </div>
    </div>
  );
}
