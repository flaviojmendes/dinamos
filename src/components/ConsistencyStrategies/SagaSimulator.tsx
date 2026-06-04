import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

type Mode = 'orchestrated' | 'choreographed';
type StepStatus = 'pending' | 'running' | 'done' | 'failed' | 'compensated';
type Action =
  | { type: 'commit'; i: number }
  | { type: 'fail'; i: number }
  | { type: 'compensate'; i: number }
  | { type: 'success' };

const STEP_KEYS = ['reserve', 'payment', 'shipping', 'confirm'] as const;
const TICK_MS = 850;

export default function SagaSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.saga';

  const [mode, setMode] = useState<Mode>('orchestrated');
  const [failAt, setFailAt] = useState<number>(2);
  const [statuses, setStatuses] = useState<StepStatus[]>(() => STEP_KEYS.map(() => 'pending'));
  const [active, setActive] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<'idle' | 'committed' | 'rolled_back'>('idle');
  const [running, setRunning] = useState(false);

  const queue = useRef<Action[]>([]);

  const reset = useCallback(() => {
    setRunning(false);
    queue.current = [];
    setStatuses(STEP_KEYS.map(() => 'pending'));
    setActive(null);
    setOutcome('idle');
  }, []);

  const run = () => {
    const actions: Action[] = [];
    let failed = false;
    let failIdx = -1;
    for (let i = 0; i < STEP_KEYS.length; i++) {
      if (failAt === i) {
        actions.push({ type: 'fail', i });
        failed = true;
        failIdx = i;
        break;
      }
      actions.push({ type: 'commit', i });
    }
    if (failed) {
      for (let j = failIdx - 1; j >= 0; j--) actions.push({ type: 'compensate', i: j });
    } else {
      actions.push({ type: 'success' });
    }
    queue.current = actions;
    setStatuses(STEP_KEYS.map(() => 'pending'));
    setActive(null);
    setOutcome('idle');
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const next = queue.current.shift();
      if (!next) {
        setRunning(false);
        setActive(null);
        return;
      }
      if (next.type === 'commit') {
        setActive(next.i);
        setStatuses(prev => prev.map((s, idx) => (idx === next.i ? 'done' : s)));
      } else if (next.type === 'fail') {
        setActive(next.i);
        setStatuses(prev => prev.map((s, idx) => (idx === next.i ? 'failed' : s)));
      } else if (next.type === 'compensate') {
        setActive(next.i);
        setStatuses(prev => prev.map((s, idx) => (idx === next.i ? 'compensated' : s)));
        setOutcome('rolled_back');
      } else if (next.type === 'success') {
        setActive(null);
        setOutcome('committed');
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running]);

  const committed = statuses.filter(s => s === 'done').length;
  const compensated = statuses.filter(s => s === 'compensated').length;

  const statusColor: Record<StepStatus, string> = {
    pending: 'border-slate-200 dark:border-tactical-border text-slate-400 dark:text-tactical-label',
    running: 'border-signal-cyan text-signal-cyan',
    done: 'border-signal-green text-signal-green',
    failed: 'border-signal-red text-signal-red',
    compensated: 'border-signal-amber text-signal-amber',
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
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.mode`)}</label>
            <div className="flex gap-2">
              {(['orchestrated', 'choreographed'] as Mode[]).map(m => (
                <TacticalButton key={m} size="sm" variant={mode === m ? 'secondary' : 'ghost'} onClick={() => setMode(m)} disabled={running}>
                  {t(`${base}.modes.${m}`)}
                </TacticalButton>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.fail_at`)}</label>
            <div className="flex flex-wrap gap-2">
              <TacticalButton size="sm" variant={failAt === -1 ? 'secondary' : 'ghost'} onClick={() => setFailAt(-1)} disabled={running}>
                {t(`${base}.fail_none`)}
              </TacticalButton>
              {STEP_KEYS.map((k, i) => (
                <TacticalButton key={k} size="sm" variant={failAt === i ? 'secondary' : 'ghost'} onClick={() => setFailAt(i)} disabled={running}>
                  {i + 1}
                </TacticalButton>
              ))}
            </div>
          </div>
        </div>

        {/* Coordinator (orchestrated only) */}
        {mode === 'orchestrated' && (
          <div className="mb-4 flex justify-center">
            <motion.div
              className="border border-signal-cyan/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-signal-cyan"
              animate={running ? { boxShadow: ['0 0 0px rgba(34,211,238,0)', '0 0 14px rgba(34,211,238,0.5)', '0 0 0px rgba(34,211,238,0)'] } : {}}
              transition={{ duration: TICK_MS / 1000, repeat: Infinity }}
            >
              {t(`${base}.roles.coordinator`)}
            </motion.div>
          </div>
        )}

        {/* Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STEP_KEYS.map((k, i) => {
            const s = statuses[i];
            return (
              <motion.div
                key={k}
                className={`relative border p-3 ${statusColor[s]}`}
                animate={active === i ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {mode === 'choreographed' && i > 0 && (
                  <span className="absolute -left-3 top-1/2 hidden -translate-y-1/2 font-mono text-xs text-slate-400 dark:text-tactical-label lg:block">→</span>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400 dark:text-tactical-label">#{i + 1}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider">{t(`${base}.status.${s}`)}</span>
                </div>
                <div className="mt-2 font-mono text-xs text-slate-700 dark:text-tactical-text">{t(`${base}.steps.${k}`)}</div>
              </motion.div>
            );
          })}
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatedMetric value={committed} label={t(`${base}.metrics.committed`)} color="green" />
          <AnimatedMetric value={compensated} label={t(`${base}.metrics.compensated`)} color="amber" pulse={compensated > 0 && running} />
          <div className="relative overflow-hidden border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className={`font-mono text-lg font-bold leading-none ${outcome === 'committed' ? 'text-signal-green' : outcome === 'rolled_back' ? 'text-signal-red' : 'text-slate-400 dark:text-tactical-label'}`}>
              {t(`${base}.outcome.${outcome}`)}
            </div>
            <div className="label-mono mt-2">{t(`${base}.metrics.outcome`)}</div>
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
      </Panel>
    </div>
  );
}
