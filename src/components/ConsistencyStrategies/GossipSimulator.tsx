import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { ConvergenceChart, Legend, NarrationBar } from '../simulators/teaching';

const N = 16;
const VIEW = 340;
const CENTER = VIEW / 2;
const RADIUS = 132;
const NODE_R = 11;

const SPEEDS = [
  { tick: 1500, travel: 820 },
  { tick: 1000, travel: 560 },
  { tick: 650, travel: 360 },
];

interface Packet {
  id: number;
  from: number;
  to: number;
  novel: boolean;
}

interface RoundInfo {
  round: number;
  senders: number;
  peers: number;
  learned: number;
  known: number;
}

/** Node positions on a ring — any node can talk to any node, so a ring (not a
 *  grid) is the honest layout: it implies no spatial locality. */
function useNodePositions() {
  return useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
        return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
      }),
    [],
  );
}

function pickPeers(src: number, fanout: number): number[] {
  const others = Array.from({ length: N }, (_, i) => i).filter((i) => i !== src);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return others.slice(0, Math.min(fanout, others.length));
}

export default function GossipSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.gossip';
  const reduce = useReducedMotion();
  const pos = useNodePositions();

  const [known, setKnown] = useState<boolean[]>(() => {
    const seed = new Array(N).fill(false);
    seed[0] = true;
    return seed;
  });
  const [round, setRound] = useState(0);
  const [fanout, setFanout] = useState(2);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [justLearned, setJustLearned] = useState<number[]>([]);
  const [history, setHistory] = useState<number[]>([1]);
  const [last, setLast] = useState<RoundInfo | null>(null);

  const knownRef = useRef(known);
  knownRef.current = known;
  const fanoutRef = useRef(fanout);
  fanoutRef.current = fanout;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const busyRef = useRef(false);
  const packetId = useRef(0);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = known.filter(Boolean).length;
  const converged = count === N;
  const pct = Math.round((count / N) * 100);

  const reset = useCallback(() => {
    setRunning(false);
    busyRef.current = false;
    if (commitTimer.current) clearTimeout(commitTimer.current);
    const seed = new Array(N).fill(false);
    seed[0] = true;
    setKnown(seed);
    setRound(0);
    setPackets([]);
    setJustLearned([]);
    setHistory([1]);
    setLast(null);
  }, []);

  const doRound = useCallback(() => {
    if (busyRef.current) return;
    const cur = knownRef.current;
    const senders = cur.map((k, i) => (k ? i : -1)).filter((i) => i >= 0);
    if (senders.length === 0 || senders.length === N) {
      setRunning(false);
      return;
    }
    const fo = fanoutRef.current;
    const newPackets: Packet[] = [];
    const targets = new Set<number>();
    senders.forEach((src) => {
      pickPeers(src, fo).forEach((dst) => {
        const novel = !cur[dst] && !targets.has(dst);
        newPackets.push({ id: packetId.current++, from: src, to: dst, novel });
        if (!cur[dst]) targets.add(dst);
      });
    });

    busyRef.current = true;
    setPackets(newPackets);

    const travel = reduce ? 0 : SPEEDS[speedRef.current].travel;
    const commit = () => {
      const learnedCount = targets.size;
      const newKnownCount = senders.length + learnedCount;
      setKnown((k) => {
        const n = k.slice();
        targets.forEach((tgt) => (n[tgt] = true));
        return n;
      });
      setJustLearned([...targets]);
      setRound((r) => {
        const nextRound = r + 1;
        setLast({
          round: nextRound,
          senders: senders.length,
          peers: newPackets.length,
          learned: learnedCount,
          known: newKnownCount,
        });
        return nextRound;
      });
      setHistory((h) => [...h, newKnownCount]);
      setPackets([]);
      busyRef.current = false;
    };

    if (travel === 0) commit();
    else commitTimer.current = setTimeout(commit, travel + 90);
  }, [reduce]);

  // Auto-run loop. Recursive timeout respects the per-round animation budget.
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    const schedule = () => {
      if (cancelled) return;
      const tick = reduce ? 420 : SPEEDS[speedRef.current].tick;
      timer = setTimeout(() => {
        if (cancelled) return;
        if (knownRef.current.every(Boolean)) {
          setRunning(false);
          return;
        }
        if (!busyRef.current) doRound();
        schedule();
      }, tick);
    };
    let timer: ReturnType<typeof setTimeout>;
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [running, doRound, reduce]);

  useEffect(() => () => { if (commitTimer.current) clearTimeout(commitTimer.current); }, []);

  const narration = (() => {
    if (round === 0 && !last) {
      return { tone: 'idle' as const, key: 'start', text: t(`${base}.narration.idle`) };
    }
    if (converged) {
      return {
        tone: 'success' as const,
        key: 'done',
        text: t(`${base}.narration.converged`, { rounds: round, total: N }),
      };
    }
    if (last) {
      return {
        tone: 'active' as const,
        key: `r${last.round}`,
        text: t(`${base}.narration.round`, {
          round: last.round,
          senders: last.senders,
          peers: last.peers,
          known: last.known,
          total: N,
        }),
      };
    }
    return { tone: 'active' as const, key: 'spreading', text: t(`${base}.narration.idle`) };
  })();

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton
              size="sm"
              variant="primary"
              onClick={() => (converged ? reset() : setRunning((r) => !r))}
            >
              {converged
                ? t(`${base}.buttons.replay`)
                : running
                  ? t(`${base}.buttons.pause`)
                  : round === 0
                    ? t(`${base}.buttons.start`)
                    : t(`${base}.buttons.resume`)}
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant="secondary"
              onClick={doRound}
              disabled={running || converged}
            >
              {t(`${base}.buttons.step`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>
              {t(`${base}.buttons.reset`)}
            </TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5">
          <NarrationBar tone={narration.tone} stepKey={narration.key}>
            {narration.text}
          </NarrationBar>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
          {/* Network stage */}
          <div className="relative mx-auto w-full max-w-md">
            <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="w-full" role="img" aria-label={t(`${base}.title`)}>
              {/* in-flight rumor packets: faint path + a travelling dot */}
              <AnimatePresence>
                {packets.map((p) => (
                  <g key={p.id}>
                    <motion.line
                      x1={pos[p.from].x}
                      y1={pos[p.from].y}
                      x2={pos[p.to].x}
                      y2={pos[p.to].y}
                      stroke="#56b6c8"
                      strokeWidth={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: p.novel ? 0.4 : 0.15 }}
                      exit={{ opacity: 0 }}
                    />
                    <motion.circle
                      r={5}
                      fill="#56b6c8"
                      initial={{ cx: pos[p.from].x, cy: pos[p.from].y, opacity: 0 }}
                      animate={{ cx: pos[p.to].x, cy: pos[p.to].y, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: (reduce ? 0 : SPEEDS[speed].travel) / 1000,
                        ease: 'easeInOut',
                      }}
                    >
                      {!reduce && (
                        <animate attributeName="r" values="4;6;4" dur="0.6s" repeatCount="indefinite" />
                      )}
                    </motion.circle>
                  </g>
                ))}
              </AnimatePresence>

              {/* nodes */}
              {pos.map((p, i) => {
                const on = known[i];
                const fresh = justLearned.includes(i);
                return (
                  <g key={i}>
                    {fresh && !reduce && (
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth={2}
                        initial={{ r: NODE_R, opacity: 0.7 }}
                        animate={{ r: NODE_R + 12, opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    )}
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R}
                      fill={on ? '#34d399' : 'transparent'}
                      fillOpacity={on ? 0.9 : 1}
                      stroke={on ? '#34d399' : '#94a3b8'}
                      strokeWidth={1.6}
                      animate={fresh && !reduce ? { scale: [1.45, 1] } : { scale: 1 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    />
                    {i === 0 && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={NODE_R + 4}
                        fill="none"
                        stroke="#34d399"
                        strokeOpacity={0.4}
                        strokeWidth={1}
                        strokeDasharray="2 3"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side rail: legend, controls, mini convergence curve */}
          <div className="space-y-5">
            <Legend
              items={[
                { swatch: 'bg-signal-green', label: t(`${base}.legend.known`) },
                { swatch: 'bg-signal-cyan', label: t(`${base}.legend.packet`) },
                { swatch: '', hollow: true, label: t(`${base}.legend.unaware`) },
              ]}
            />

            <div className="space-y-2">
              <label className="flex items-center justify-between font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">
                {t(`${base}.controls.fanout`)}
                <span className="font-mono text-signal-cyan tabular-nums">{fanout}</span>
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={fanout}
                onChange={(e) => setFanout(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border"
              />
            </div>

            <div className="space-y-2">
              <span className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">
                {t(`${base}.controls.speed`)}
              </span>
              <div className="flex gap-1.5">
                {[t(`${base}.speed.slow`), t(`${base}.speed.normal`), t(`${base}.speed.fast`)].map((lbl, i) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setSpeed(i)}
                    className={`flex-1 rounded-md border px-2 py-1 font-sans text-[11px] font-medium transition-colors ${
                      speed === i
                        ? 'border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-tactical-border dark:text-tactical-dim dark:hover:border-tactical-line'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">
                {t(`${base}.chart.title`)}
              </span>
              <ConvergenceChart data={history} total={N} accent="green" />
              <div className="flex justify-between font-mono text-[10px] text-slate-400 dark:text-tactical-label">
                <span>{t(`${base}.chart.round`, { n: 0 })}</span>
                <span>{t(`${base}.chart.round`, { n: Math.max(round, 1) })}</span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={round} label={t(`${base}.metrics.round`)} color="cyan" pulse={running} />
          <AnimatedMetric value={count} label={t(`${base}.metrics.infected`)} color="green" />
          <AnimatedMetric
            value={pct}
            suffix="%"
            label={t(`${base}.metrics.converged`)}
            color={pct === 100 ? 'green' : 'amber'}
          />
          <AnimatedMetric value={N} label={t(`${base}.metrics.nodes`)} color="default" />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}
