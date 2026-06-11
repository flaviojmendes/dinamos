import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

type NodeState = 'healthy' | 'down';
const TICK_MS = 600;
const NODE_COUNT = 6;

interface Node {
  id: number;
  state: NodeState;
}

export default function ChaosSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.chaos';

  const [redundancy, setRedundancy] = useState(true); // replicas + retries on
  const [running, setRunning] = useState(false);
  const [nodes, setNodes] = useState<Node[]>(() => Array.from({ length: NODE_COUNT }, (_, i) => ({ id: i, state: 'healthy' as NodeState })));
  const [requests, setRequests] = useState(0);
  const [served, setServed] = useState(0);
  const [failed, setFailed] = useState(0);
  const [experiments, setExperiments] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const recovery = useRef<Record<number, number>>({});
  const tick = useRef(0);

  const reset = useCallback(() => {
    setRunning(false);
    setNodes(Array.from({ length: NODE_COUNT }, (_, i) => ({ id: i, state: 'healthy' as NodeState })));
    setRequests(0);
    setServed(0);
    setFailed(0);
    setExperiments(0);
    setLog([]);
    recovery.current = {};
    tick.current = 0;
  }, []);

  const pushLog = (msg: string) => setLog((l) => [msg, ...l].slice(0, 6));

  const killRandom = useCallback(() => {
    setExperiments((e) => e + 1);
    setNodes((prev) => {
      const alive = prev.filter((n) => n.state === 'healthy');
      if (alive.length === 0) return prev;
      const victim = alive[Math.floor(Math.random() * alive.length)];
      recovery.current[victim.id] = tick.current + 6; // auto-heal after a while
      pushLog(t(`${base}.log.killed`, { id: victim.id + 1 }));
      return prev.map((n) => (n.id === victim.id ? { ...n, state: 'down' } : n));
    });
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      tick.current += 1;
      // Heal nodes whose recovery time elapsed.
      setNodes((prev) => prev.map((n) => {
        if (n.state === 'down' && recovery.current[n.id] && tick.current >= recovery.current[n.id]) {
          delete recovery.current[n.id];
          pushLog(t(`${base}.log.recovered`, { id: n.id + 1 }));
          return { ...n, state: 'healthy' };
        }
        return n;
      }));

      // Route a batch of requests this tick.
      setNodes((prev) => {
        const healthy = prev.filter((n) => n.state === 'healthy').length;
        const batch = 5;
        setRequests((r) => r + batch);
        let ok = 0;
        for (let i = 0; i < batch; i++) {
          if (healthy === 0) continue;
          if (redundancy) {
            // retries + replicas: as long as 1 node is up, the request succeeds
            ok++;
          } else {
            // no redundancy: requests are pinned to a node; if it's the dead fraction, they fail
            if (Math.random() < healthy / NODE_COUNT) ok++;
          }
        }
        setServed((s) => s + ok);
        setFailed((f) => f + (batch - ok));
        return prev;
      });

      // Randomly inject a fault while running (game day).
      if (Math.random() < 0.18) killRandom();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, redundancy, killRandom, t]);

  const total = served + failed;
  const availability = total > 0 ? Math.round((served / total) * 100) : 100;
  const healthyCount = nodes.filter((n) => n.state === 'healthy').length;
  const down = NODE_COUNT - healthyCount;
  const narr =
    down === 0
      ? { tone: 'idle' as const, text: t(`${base}.narration.idle`) }
      : redundancy
        ? { tone: 'success' as const, text: t(`${base}.narration.resilient`, { down, avail: availability }) }
        : { tone: 'active' as const, text: t(`${base}.narration.degraded`, { down, avail: availability }) };

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="red"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="danger" onClick={killRandom}>{t(`${base}.buttons.kill`)}</TacticalButton>
            <TacticalButton size="sm" variant={running ? 'secondary' : 'secondary'} onClick={() => setRunning((r) => !r)}>
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim mb-5">{t(`${base}.subtitle`)}</p>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={`${redundancy}-${healthyCount}`}>{narr.text}</NarrationBar>
        </div>

        <label className="mb-6 flex items-center gap-3 cursor-pointer select-none">
          <span className={`relative h-5 w-9 rounded-full transition-colors ${redundancy ? 'bg-signal-green' : 'bg-slate-300 dark:bg-tactical-border'}`}>
            <input type="checkbox" className="sr-only" checked={redundancy} onChange={(e) => setRedundancy(e.target.checked)} />
            <motion.span className="absolute top-0.5 h-4 w-4 rounded-full bg-white" animate={{ left: redundancy ? 18 : 2 }} />
          </span>
          <span className="font-sans text-sm text-slate-700 dark:text-tactical-text">{t(`${base}.redundancy_toggle`)}</span>
        </label>

        <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {nodes.map((n) => (
            <motion.div
              key={n.id}
              layout
              animate={{ scale: n.state === 'down' ? 0.9 : 1, opacity: n.state === 'down' ? 0.5 : 1 }}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 ${n.state === 'healthy' ? 'border-signal-green/50 bg-signal-green/5' : 'border-signal-red/50 bg-signal-red/5'}`}
            >
              <span className="font-mono text-sm text-slate-700 dark:text-tactical-text">N{n.id + 1}</span>
              <span className={`mt-1 h-2 w-2 rounded-full ${n.state === 'healthy' ? 'bg-signal-green' : 'bg-signal-red'}`} />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant={healthyCount > NODE_COUNT / 2 ? 'online' : healthyCount > 0 ? 'pending' : 'classified'} label={t(`${base}.nodes_up`, { up: healthyCount, total: NODE_COUNT })} />
          <StatusBadge variant={availability >= 99 ? 'online' : availability >= 90 ? 'pending' : 'classified'} label={`${availability}% ${t(`${base}.availability`)}`} />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t(`${base}.metrics.title`)} accent="green">
          <div className="grid grid-cols-2 gap-3">
            <AnimatedMetric value={availability} suffix="%" label={t(`${base}.metrics.availability`)} color={availability >= 99 ? 'green' : availability >= 90 ? 'amber' : 'red'} pulse={running} />
            <AnimatedMetric value={experiments} label={t(`${base}.metrics.experiments`)} color="red" />
            <AnimatedMetric value={served} label={t(`${base}.metrics.served`)} color="green" />
            <AnimatedMetric value={failed} label={t(`${base}.metrics.failed`)} color={failed > 0 ? 'red' : 'default'} />
          </div>
          <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{redundancy ? t(`${base}.hint_on`) : t(`${base}.hint_off`)}</p>
        </Panel>

        <Panel title={t(`${base}.log.title`)} accent="amber">
          <div className="space-y-1.5 min-h-[120px]">
            <AnimatePresence initial={false}>
              {log.length === 0 && <p className="font-sans text-xs text-slate-400 dark:text-tactical-dim">{t(`${base}.log.empty`)}</p>}
              {log.map((entry, i) => (
                <motion.div key={`${entry}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
                  {entry}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      </div>
    </div>
  );
}
