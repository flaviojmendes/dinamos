import React, { useEffect, useMemo, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

/**
 * Dining Philosophers simulator.
 *
 * A deterministic, tick-driven state machine models five (configurable)
 * philosophers seated around a circular table, each alternating between
 * thinking, getting hungry and eating. Eating requires the two forks adjacent
 * to a philosopher, so neighbours compete for the shared resource.
 *
 * Four acquisition strategies are offered to contrast the classic synchronization
 * trade-offs: a naive policy that can deadlock, resource-ordering (hierarchy),
 * atomic both-or-nothing pickup, and a central arbitrator that caps concurrency.
 * The engine detects the deadlock/stall condition and pauses, which is the whole
 * pedagogical point of the exercise.
 */

type PhilosopherState = 'thinking' | 'hungry' | 'eating';
type Strategy = 'naive' | 'hierarchy' | 'atomic' | 'arbitrator';

interface Philosopher {
  id: number;
  name: string;
  state: PhilosopherState;
  meals: number;
  /** Countdown of ticks left in the current thinking/eating phase. */
  timer: number;
  /** Consecutive ticks spent hungry without managing to eat. */
  waitTicks: number;
}

interface LogEntry {
  id: number;
  key: string;
  params?: Record<string, string | number>;
}

interface SimState {
  n: number;
  strategy: Strategy;
  philosophers: Philosopher[];
  /** forks[i] is the fork between philosopher i-1 and i; value = holder id or null. */
  forks: (number | null)[];
  tick: number;
  log: LogEntry[];
  deadlocked: boolean;
  stallCount: number;
  signature: string;
  totalMeals: number;
  longestWait: number;
  logSeq: number;
}

const NAMES = [
  'Platão',
  'Aristóteles',
  'Sócrates',
  'Descartes',
  'Kant',
  'Nietzsche',
  'Confúcio',
];

const STALL_THRESHOLD = 6;
const THINK_MIN = 2;
const THINK_MAX = 5;
const EAT_MIN = 2;
const EAT_MAX = 4;

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const leftFork = (i: number) => i;
const rightFork = (i: number, n: number) => (i + 1) % n;

function makePhilosophers(n: number): Philosopher[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    name: NAMES[i % NAMES.length],
    state: 'thinking' as PhilosopherState,
    meals: 0,
    timer: rand(THINK_MIN, THINK_MAX),
    waitTicks: 0,
  }));
}

function initState(n: number, strategy: Strategy): SimState {
  return {
    n,
    strategy,
    philosophers: makePhilosophers(n),
    forks: Array.from({ length: n }, () => null),
    tick: 0,
    log: [],
    deadlocked: false,
    stallCount: 0,
    signature: '',
    totalMeals: 0,
    longestWait: 0,
    logSeq: 0,
  };
}

type Action =
  | { type: 'INIT'; n: number; strategy: Strategy }
  | { type: 'SET_N'; n: number }
  | { type: 'SET_STRATEGY'; strategy: Strategy }
  | { type: 'TICK' };

/** Shuffle indices so fork arbitration order is not biased toward seat 0. */
function shuffledOrder(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function tickReducer(state: SimState): SimState {
  if (state.deadlocked) return state;

  const { n, strategy } = state;
  const forks = [...state.forks];
  const philosophers = state.philosophers.map((p) => ({ ...p }));
  const newLogs: Omit<LogEntry, 'id'>[] = [];
  let { totalMeals, longestWait } = state;

  const holds = (id: number, f: number) => forks[f] === id;
  const free = (f: number) => forks[f] === null;

  const startEating = (p: Philosopher) => {
    p.state = 'eating';
    p.timer = rand(EAT_MIN, EAT_MAX);
    p.waitTicks = 0;
    newLogs.push({ key: 'started_eating', params: { name: p.name } });
  };

  for (const idx of shuffledOrder(n)) {
    const p = philosophers[idx];
    const lf = leftFork(idx);
    const rf = rightFork(idx, n);

    if (p.state === 'thinking') {
      p.timer -= 1;
      if (p.timer <= 0) {
        p.state = 'hungry';
        p.waitTicks = 0;
        newLogs.push({ key: 'got_hungry', params: { name: p.name } });
      }
      continue;
    }

    if (p.state === 'eating') {
      p.timer -= 1;
      if (p.timer <= 0) {
        if (holds(idx, lf)) forks[lf] = null;
        if (holds(idx, rf)) forks[rf] = null;
        p.state = 'thinking';
        p.timer = rand(THINK_MIN, THINK_MAX);
        p.meals += 1;
        totalMeals += 1;
        newLogs.push({ key: 'finished_eating', params: { name: p.name } });
      }
      continue;
    }

    // hungry — try to acquire forks per strategy
    p.waitTicks += 1;
    if (p.waitTicks > longestWait) longestWait = p.waitTicks;

    switch (strategy) {
      case 'naive': {
        // Grab left, then right. Holding left while right is busy is the
        // door to deadlock — by design, to demonstrate the failure mode.
        if (!holds(idx, lf) && free(lf)) {
          forks[lf] = idx;
          newLogs.push({ key: 'took_left', params: { name: p.name } });
        }
        if (holds(idx, lf) && free(rf)) {
          forks[rf] = idx;
          startEating(p);
        }
        break;
      }
      case 'hierarchy': {
        // Always pick up the lower-numbered fork first → no circular wait.
        const first = Math.min(lf, rf);
        const second = Math.max(lf, rf);
        if (!holds(idx, first) && free(first)) {
          forks[first] = idx;
          newLogs.push({ key: 'took_low', params: { name: p.name, fork: first } });
        }
        if (holds(idx, first) && !holds(idx, second) && free(second)) {
          forks[second] = idx;
          startEating(p);
        }
        break;
      }
      case 'atomic': {
        // Both-or-nothing: never hold a single fork, so no deadlock.
        if (free(lf) && free(rf)) {
          forks[lf] = idx;
          forks[rf] = idx;
          startEating(p);
        }
        break;
      }
      case 'arbitrator': {
        // A waiter caps diners at n-1, then atomic pickup.
        const eatingCount = philosophers.filter((q) => q.state === 'eating').length;
        if (eatingCount < n - 1 && free(lf) && free(rf)) {
          forks[lf] = idx;
          forks[rf] = idx;
          startEating(p);
        }
        break;
      }
    }
  }

  // Deadlock / livelock detection: state + fork ownership frozen while someone
  // is hungry and nobody is eating.
  const eatingNow = philosophers.some((p) => p.state === 'eating');
  const hungryNow = philosophers.some((p) => p.state === 'hungry');
  const someoneHoldsFork = forks.some((f) => f !== null);
  const signature =
    philosophers.map((p) => p.state[0]).join('') + '|' + forks.join(',');

  let stallCount = state.stallCount;
  let deadlocked = false;
  if (signature === state.signature && hungryNow && !eatingNow && someoneHoldsFork) {
    stallCount += 1;
  } else {
    stallCount = 0;
  }
  if (stallCount >= STALL_THRESHOLD) {
    deadlocked = true;
    newLogs.push({ key: 'deadlock_detected' });
  }

  let logSeq = state.logSeq;
  const appended: LogEntry[] = newLogs.map((l) => ({ ...l, id: logSeq++ }));
  const log = [...appended.reverse(), ...state.log].slice(0, 40);

  return {
    ...state,
    forks,
    philosophers,
    tick: state.tick + 1,
    log,
    deadlocked,
    stallCount,
    signature,
    totalMeals,
    longestWait,
    logSeq,
  };
}

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case 'INIT':
      return initState(action.n, action.strategy);
    case 'SET_N':
      return initState(action.n, state.strategy);
    case 'SET_STRATEGY':
      return initState(state.n, action.strategy);
    case 'TICK':
      return tickReducer(state);
    default:
      return state;
  }
}

const STRATEGIES: Strategy[] = ['naive', 'hierarchy', 'atomic', 'arbitrator'];

type Tone = 'cyan' | 'amber' | 'green';

const STATE_TONE: Record<PhilosopherState, Tone> = {
  thinking: 'cyan',
  hungry: 'amber',
  eating: 'green',
};

/** Resolved palette per tone so SVG (hex) and Tailwind classes stay in sync. */
const TONE = {
  cyan: { hex: '#22d3ee', dot: 'bg-signal-cyan', text: 'text-signal-cyan', soft: 'bg-signal-cyan/10', ring: 'border-signal-cyan/50' },
  amber: { hex: '#f5b53d', dot: 'bg-signal-amber', text: 'text-signal-amber', soft: 'bg-signal-amber/10', ring: 'border-signal-amber/50' },
  green: { hex: '#34d399', dot: 'bg-signal-green', text: 'text-signal-green', soft: 'bg-signal-green/10', ring: 'border-signal-green/50' },
} as const;

const TAU = Math.PI / 180;
const polar = (r: number, deg: number) => ({
  x: 50 + r * Math.cos(deg * TAU),
  y: 50 + r * Math.sin(deg * TAU),
});

const SEAT_R = 41;
const FORK_REST_R = 30.5;
const FORK_HELD_R = 34;

/** Minimal geometric fork glyph drawn around its local origin, tines inward. */
function ForkGlyph({ held }: { held: boolean }) {
  const cls = held
    ? 'stroke-signal-amber'
    : 'stroke-slate-400 dark:stroke-tactical-line';
  return (
    <g className={cls} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[-0.85, 0, 0.85].map((tx) => (
        <line key={tx} x1={tx} y1={-3.6} x2={tx} y2={-1.4} strokeWidth={0.5} />
      ))}
      <line x1={-0.85} y1={-1.4} x2={0.85} y2={-1.4} strokeWidth={0.5} />
      <line x1={0} y1={-1.4} x2={0} y2={3.6} strokeWidth={0.95} />
    </g>
  );
}

export default function PhilosophersSimulator() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, undefined, () => initState(5, 'naive'));
  const [isRunning, setIsRunning] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [showConfig, setShowConfig] = React.useState(true);

  const tk = (k: string, params?: Record<string, string | number>) =>
    t(`simulators.philosophers_sim.${k}`, params);

  useEffect(() => {
    if (!isRunning) return;
    if (state.deadlocked) {
      setIsRunning(false);
      return;
    }
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 800 / speed);
    return () => clearInterval(interval);
  }, [isRunning, speed, state.deadlocked]);

  const n = state.n;

  const seatAngle = useMemo(
    () => Array.from({ length: n }, (_, i) => -90 + (i * 360) / n),
    [n],
  );
  const seatPos = useMemo(() => seatAngle.map((a) => polar(SEAT_R, a)), [seatAngle]);

  /** Resting + docked transform for every fork, recomputed each render. */
  const forkLayout = state.forks.map((holder, f) => {
    const halfStep = 180 / n;
    if (holder === null) {
      const a = -90 + (f - 0.5) * (360 / n);
      const { x, y } = polar(FORK_REST_R, a);
      return { x, y, rotate: a - 90, held: false };
    }
    const base = seatAngle[holder];
    const isLeft = f === holder; // left fork id === holder id
    const a = base + (isLeft ? -halfStep * 0.5 : halfStep * 0.5);
    const { x, y } = polar(FORK_HELD_R, a);
    return { x, y, rotate: a - 90, held: true };
  });

  const eatingCount = state.philosophers.filter((p) => p.state === 'eating').length;
  const maxMeals = Math.max(1, ...state.philosophers.map((p) => p.meals));

  const statusBadge = state.deadlocked
    ? <StatusBadge variant="classified" label={tk('stats.deadlocked')} />
    : isRunning
      ? <StatusBadge variant="active" label={tk('stats.running')} />
      : <StatusBadge variant="offline" label={tk('stats.paused')} />;

  const handleStrategy = (strategy: Strategy) => {
    setIsRunning(false);
    dispatch({ type: 'SET_STRATEGY', strategy });
  };
  const handleN = (count: number) => {
    setIsRunning(false);
    dispatch({ type: 'SET_N', n: count });
  };
  const handleReset = () => {
    setIsRunning(false);
    dispatch({ type: 'INIT', n: state.n, strategy: state.strategy });
  };

  const holdsLeft = (id: number) => state.forks[id] === id;
  const holdsRight = (id: number) => state.forks[(id + 1) % n] === id;

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <span className="inline-block text-xs font-medium text-slate-600 dark:text-tactical-label bg-slate-100 dark:bg-tactical-raised px-2.5 py-1 rounded-full mb-2">
          {tk('title')}
        </span>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {tk('subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TacticalButton size="sm" variant="ghost" onClick={() => setShowConfig((s) => !s)}>
          {showConfig ? tk('buttons.close_config') : tk('buttons.configure')}
        </TacticalButton>
        <TacticalButton
          size="sm"
          variant={isRunning ? 'danger' : 'primary'}
          disabled={state.deadlocked}
          onClick={() => setIsRunning((r) => !r)}
        >
          {isRunning ? tk('buttons.pause') : tk('buttons.start')}
        </TacticalButton>
        <TacticalButton
          size="sm"
          variant="secondary"
          disabled={isRunning || state.deadlocked}
          onClick={() => dispatch({ type: 'TICK' })}
        >
          {tk('buttons.step')}
        </TacticalButton>
        <TacticalButton size="sm" variant="secondary" onClick={handleReset}>
          {tk('buttons.reset')}
        </TacticalButton>
        <div className="ml-auto">{statusBadge}</div>
      </div>

      <AnimatePresence initial={false}>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Panel title={tk('config.title')} accent="amber">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-sans text-xs uppercase tracking-wide text-slate-500 dark:text-tactical-label mb-2">
                    {tk('config.strategy')}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {STRATEGIES.map((s) => {
                      const active = state.strategy === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleStrategy(s)}
                          aria-pressed={active}
                          className={`rounded-lg border px-3 py-2 text-left font-sans text-xs transition-colors ${
                            active
                              ? 'border-emerald-500 dark:border-signal-green bg-emerald-500/10 dark:bg-signal-green/10 text-slate-900 dark:text-tactical-text'
                              : 'border-slate-200 dark:border-tactical-border text-slate-600 dark:text-tactical-dim hover:border-slate-400 dark:hover:border-tactical-line'
                          }`}
                        >
                          {tk(`strategies.${s}.label`)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5">
                    <p className="font-sans text-xs leading-relaxed text-slate-600 dark:text-tactical-dim">
                      {tk(`strategies.${state.strategy}.desc`)}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 self-start">
                  <div>
                    <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1.5">
                      <span>{tk('config.philosophers')}</span>
                      <span className="font-mono text-signal-cyan tabular-nums">{state.n}</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={7}
                      value={state.n}
                      onChange={(e) => handleN(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green rounded-full"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1.5">
                      <span>{tk('config.speed')}</span>
                      <span className="font-mono text-signal-cyan tabular-nums">{speed.toFixed(1)}×</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={3}
                      step={0.5}
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* The table */}
        <div className="lg:col-span-3">
          <Panel title={tk('viz.title')} accent="green" bodyClassName="p-4 sm:p-6">
            <div className="relative mx-auto w-full max-w-[30rem] aspect-square">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* table surface */}
                <circle
                  cx="50"
                  cy="50"
                  r="27"
                  className={`fill-slate-50 dark:fill-tactical-raised ${
                    state.deadlocked
                      ? 'stroke-signal-red/60'
                      : 'stroke-slate-200 dark:stroke-tactical-border'
                  }`}
                  strokeWidth="0.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="22"
                  fill="none"
                  className="stroke-slate-200/70 dark:stroke-tactical-border/60"
                  strokeWidth="0.4"
                />

                {/* center readout */}
                {state.deadlocked ? (
                  <text x="50" y="49" textAnchor="middle" className="fill-signal-red font-mono font-semibold" fontSize="4">
                    {tk('viz.deadlock')}
                  </text>
                ) : (
                  <text x="50" y="49" textAnchor="middle" className="fill-slate-700 dark:fill-tactical-text font-mono" fontSize="4">
                    <tspan className="fill-signal-green font-semibold">{eatingCount}</tspan>
                    <tspan className="fill-slate-400 dark:fill-tactical-dim">{` / ${n}`}</tspan>
                  </text>
                )}
                <text x="50" y="54.5" textAnchor="middle" className="fill-slate-400 dark:fill-tactical-label font-mono uppercase" fontSize="2.4" letterSpacing="0.3">
                  {state.deadlocked ? `${tk('viz.tick')} ${state.tick}` : tk('viz.eating_now')}
                </text>

                {/* forks dock beside their holder; no crossing lines */}
                {forkLayout.map((fk, f) => (
                  <motion.g
                    key={`fork-${f}`}
                    initial={false}
                    animate={{ x: fk.x, y: fk.y, rotate: fk.rotate }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                  >
                    <ForkGlyph held={fk.held} />
                  </motion.g>
                ))}

                {/* seats */}
                {state.philosophers.map((p) => {
                  const pos = seatPos[p.id];
                  const tone = TONE[STATE_TONE[p.state]];
                  return (
                    <g key={p.id}>
                      <title>{p.name}</title>
                      {p.state === 'eating' && (
                        <motion.circle
                          cx={pos.x}
                          cy={pos.y}
                          r="6.5"
                          fill="none"
                          stroke={tone.hex}
                          strokeWidth="0.5"
                          initial={{ opacity: 0.5, r: 6 }}
                          animate={{ opacity: [0.5, 0], r: [6, 9] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="6"
                        className="fill-white dark:fill-tactical-surface"
                        stroke={tone.hex}
                        strokeWidth="0.9"
                      />
                      <circle cx={pos.x} cy={pos.y} r="6" fill={tone.hex} opacity={0.12} />
                      <text
                        x={pos.x}
                        y={pos.y + 0.4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={tone.hex}
                        className="font-mono font-semibold"
                        fontSize="4.2"
                      >
                        {p.name.charAt(0)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-xs">
              {(['thinking', 'hungry', 'eating'] as PhilosopherState[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${TONE[STATE_TONE[s]].dot}`} />
                  <span className="text-slate-600 dark:text-tactical-dim">{tk(`states.${s}`)}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-signal-amber" />
                <span className="text-slate-600 dark:text-tactical-dim">{tk('viz.fork_held')}</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Live roster + metrics */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title={tk('stats.title')} accent="cyan">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="font-mono text-2xl font-bold tabular-nums leading-none text-signal-green">{state.totalMeals}</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-tactical-label mt-1.5 leading-tight">{tk('stats.total_meals')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold tabular-nums leading-none text-signal-amber">{state.longestWait}</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-tactical-label mt-1.5 leading-tight">{tk('stats.longest_wait')}</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold tabular-nums leading-none text-slate-900 dark:text-tactical-text">{state.tick}</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-tactical-label mt-1.5 leading-tight">{tk('stats.ticks')}</div>
              </div>
            </div>
          </Panel>

          <Panel title={tk('roster.title')} accent="green">
            <div className="space-y-2.5">
              {state.philosophers.map((p) => {
                const tone = TONE[STATE_TONE[p.state]];
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${tone.soft} border ${tone.ring} font-mono text-xs font-semibold ${tone.text}`}
                    >
                      {p.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans text-sm text-slate-900 dark:text-tactical-text truncate">{p.name}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-wide ${tone.text}`}>{tk(`states.${p.state}`)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-signal-green"
                            animate={{ width: `${(p.meals / maxMeals) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-tactical-label w-4 text-right">{p.meals}</span>
                        <span className="flex items-center gap-1" aria-hidden>
                          <span className={`h-2.5 w-1 rounded-sm ${holdsLeft(p.id) ? 'bg-signal-amber' : 'bg-slate-200 dark:bg-tactical-line'}`} title="left fork" />
                          <span className={`h-2.5 w-1 rounded-sm ${holdsRight(p.id) ? 'bg-signal-amber' : 'bg-slate-200 dark:bg-tactical-line'}`} title="right fork" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      {state.deadlocked && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-signal-red/50 bg-signal-red/10 px-4 py-3"
        >
          <p className="font-sans text-sm text-red-700 dark:text-signal-red">{tk('viz.deadlock_hint')}</p>
        </motion.div>
      )}

      <Panel title={tk('log.title')} accent="amber">
        <div className="h-44 overflow-y-auto space-y-1 pr-1">
          <AnimatePresence initial={false}>
            {state.log.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`font-mono text-xs ${
                  entry.key === 'deadlock_detected' ? 'text-signal-red' : 'text-slate-600 dark:text-tactical-dim'
                }`}
              >
                {tk(`log.${entry.key}`, entry.params)}
              </motion.div>
            ))}
          </AnimatePresence>
          {state.log.length === 0 && (
            <div className="font-sans text-xs text-slate-400 dark:text-tactical-label text-center py-8">
              {tk('log.empty')}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
