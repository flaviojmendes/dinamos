import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton, type StatusVariant } from '../tactical';
import { AnimatedMetric } from './motion';

const LOOP_PHASES: EntryType[] = ['think', 'act', 'observe'];

type EntryType = 'think' | 'act' | 'observe' | 'retry' | 'answer';

interface TraceEntry {
  id: number;
  step: number;
  type: EntryType;
  tool?: string;
}

interface Summary {
  steps: number;
  toolCalls: number;
  retries: number;
  tokens: number;
  success: boolean;
}

const TOOLS = ['search', 'calculator', 'database'] as const;
const MAX_STEPS_CAP = 10;

const entryVariant: Record<EntryType, StatusVariant> = {
  think: 'pending',
  act: 'active',
  observe: 'in-progress',
  retry: 'classified',
  answer: 'completed',
};

export default function AgentOrchestrationSimulator() {
  const { t } = useTranslation();
  const [maxSteps, setMaxSteps] = useState(6);
  const [toolLatency, setToolLatency] = useState(400);
  const [failRate, setFailRate] = useState(20);

  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(id => clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const buildTrace = useCallback((): { entries: TraceEntry[]; summary: Summary } => {
    const entries: TraceEntry[] = [];
    let id = 1;
    let toolCalls = 0;
    let retries = 0;
    let tokens = 0;
    let success = false;
    let step = 0;

    for (step = 1; step <= maxSteps; step++) {
      entries.push({ id: id++, step, type: 'think' });
      tokens += 140;

      const tool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
      entries.push({ id: id++, step, type: 'act', tool });
      toolCalls += 1;
      tokens += 60;

      // Tool may fail and trigger up to 2 retries.
      let attempts = 0;
      while (Math.random() * 100 < failRate && attempts < 2) {
        entries.push({ id: id++, step, type: 'retry', tool });
        retries += 1;
        toolCalls += 1;
        attempts += 1;
      }

      entries.push({ id: id++, step, type: 'observe' });
      tokens += 90;

      // Chance of solving grows with steps taken.
      if (step >= 2 && Math.random() < 0.35 + step * 0.08) {
        success = true;
        break;
      }
    }

    if (success) {
      entries.push({ id: id++, step, type: 'answer' });
      tokens += 120;
    }

    return { entries, summary: { steps: Math.min(step, maxSteps), toolCalls, retries, tokens, success } };
  }, [maxSteps, failRate]);

  const run = useCallback(() => {
    clearTimers();
    const { entries, summary: s } = buildTrace();
    setTrace(entries);
    setRevealed(0);
    setSummary(null);
    setRunning(true);

    entries.forEach((_, i) => {
      const id = window.setTimeout(() => setRevealed(i + 1), i * toolLatency);
      timers.current.push(id);
    });
    const doneId = window.setTimeout(() => {
      setSummary(s);
      setRunning(false);
    }, entries.length * toolLatency);
    timers.current.push(doneId);
  }, [buildTrace, toolLatency]);

  const reset = useCallback(() => {
    clearTimers();
    setTrace([]);
    setRevealed(0);
    setSummary(null);
    setRunning(false);
  }, []);

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.agent_orchestration';

  const statusLabel = running
    ? t(`${base}.labels.running`)
    : summary
      ? summary.success ? t(`${base}.labels.done`) : t(`${base}.labels.failed`)
      : '';

  const lastEntry = revealed > 0 ? trace[revealed - 1] : null;
  const activePhase: EntryType | null = lastEntry ? (lastEntry.type === 'retry' ? 'act' : lastEntry.type) : null;
  const solved = !running && summary?.success;

  const phaseClasses: Record<string, { border: string; text: string }> = {
    think: { border: 'border-signal-cyan', text: 'text-signal-cyan' },
    act: { border: 'border-signal-amber', text: 'text-signal-amber' },
    observe: { border: 'border-signal-green', text: 'text-signal-green' },
  };

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={run} disabled={running}>{t(`${base}.buttons.run`)}</TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Slider label={t(`${base}.controls.max_steps`)} value={maxSteps} min={2} max={MAX_STEPS_CAP} onChange={setMaxSteps} cls={rangeClass} />
          <Slider label={t(`${base}.controls.tool_latency`)} value={toolLatency} min={150} max={900} step={50} onChange={setToolLatency} cls={rangeClass} suffix="ms" />
          <Slider label={t(`${base}.controls.fail_rate`)} value={failRate} min={0} max={70} onChange={setFailRate} cls={rangeClass} suffix="%" />
        </div>
      </Panel>

      {/* Reason -> Act -> Observe loop */}
      <Panel title={t(`${base}.labels.trace`)} accent="cyan">
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-4">
          {LOOP_PHASES.map((phase, i) => {
            const isActive = activePhase === phase;
            const c = phaseClasses[phase];
            return (
              <div key={phase} className="flex items-center gap-2 sm:gap-4">
                <motion.div
                  className={`relative flex h-20 w-20 sm:h-24 sm:w-24 flex-col items-center justify-center rounded-lg border text-center ${isActive ? c.border : 'border-slate-200 dark:border-tactical-border'}`}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isActive && (
                    <motion.span
                      className={`absolute inset-0 border ${c.border}`}
                      animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.18, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <span className={`font-sans text-[11px] font-medium ${isActive ? c.text : 'text-slate-500 dark:text-tactical-label'}`}>
                    {t(`${base}.steps.${phase}`)}
                  </span>
                </motion.div>
                {i < LOOP_PHASES.length - 1 && (
                  <motion.span
                    className="font-sans text-lg text-slate-400 dark:text-tactical-label"
                    animate={running ? { x: [0, 4, 0], opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  >
                    →
                  </motion.span>
                )}
              </div>
            );
          })}
          <motion.span
            className="font-sans text-lg text-slate-400 dark:text-tactical-label"
            animate={running ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            ↺
          </motion.span>
          <motion.div
            className={`flex h-20 w-20 sm:h-24 sm:w-24 flex-col items-center justify-center rounded-lg border text-center ${solved ? 'border-signal-green' : 'border-slate-200 dark:border-tactical-border'}`}
            animate={solved ? { scale: [1, 1.12, 1], borderColor: 'rgb(34 197 94)' } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`font-sans text-[11px] font-medium ${solved ? 'text-signal-green' : 'text-slate-500 dark:text-tactical-label'}`}>
              {t(`${base}.steps.answer`)}
            </span>
          </motion.div>
        </div>
      </Panel>

      <Panel title={t(`${base}.labels.trace`)} accent="green">
        {trace.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center font-sans text-xs text-slate-400 dark:text-tactical-label">
            {t(`${base}.labels.idle`)}
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {trace.slice(0, revealed).map(e => (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, x: -28, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="flex items-center gap-3 rounded-md border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
                >
                  <span className="font-sans text-[11px] text-slate-500 dark:text-tactical-label w-14">Step {e.step}</span>
                  <StatusBadge variant={entryVariant[e.type]} label={t(`${base}.steps.${e.type}`)} />
                  {e.tool && (
                    <span className="font-mono text-[11px] text-brand-600 dark:text-signal-cyan">{t(`${base}.tools.${e.tool}`)}()</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Panel>

      {summary && (
        <Panel title={t(`${base}.metrics.status`)} accent="amber">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <AnimatedMetric value={summary.steps} label={t(`${base}.metrics.steps`)} color="default" />
            <AnimatedMetric value={summary.toolCalls} label={t(`${base}.metrics.tool_calls`)} color="cyan" />
            <AnimatedMetric value={summary.retries} label={t(`${base}.metrics.retries`)} color={summary.retries > 0 ? 'amber' : 'default'} />
            <AnimatedMetric value={summary.tokens} format={(v) => Math.round(v).toLocaleString()} label={t(`${base}.metrics.tokens`)} color="default" />
            <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 flex flex-col justify-center">
              <StatusBadge variant={summary.success ? 'completed' : 'classified'} label={statusLabel} />
              <div className="font-sans text-[11px] font-medium mt-2 text-slate-500 dark:text-tactical-label">{t(`${base}.metrics.status`)}</div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, cls, suffix }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; cls: string; suffix?: string }) {
  return (
    <div className="space-y-2">
      <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step ?? 1} value={value} onChange={e => onChange(Number(e.target.value))} className={cls} />
        <span className="font-mono text-sm w-12 text-right text-signal-cyan tabular-nums">{value}{suffix ?? ''}</span>
      </div>
    </div>
  );
}

