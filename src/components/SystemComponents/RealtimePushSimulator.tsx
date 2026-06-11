import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

type Mode = 'polling' | 'sse' | 'websocket';
const TICK_MS = 500;

interface Msg {
  id: number;
  delivered: boolean;
}
interface Flight {
  id: number;
  kind: 'data' | 'empty';
}
type Narr = { tone: 'idle' | 'active' | 'success'; key: string; text: string };

export default function RealtimePushSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.realtime_push';

  const [mode, setMode] = useState<Mode>('polling');
  const [running, setRunning] = useState(false);
  const [pollInterval, setPollInterval] = useState(6);

  const [requests, setRequests] = useState(0);
  const [emptyPolls, setEmptyPolls] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [latencySum, setLatencySum] = useState(0);
  const [pending, setPending] = useState<Msg[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [narr, setNarr] = useState<Narr>({ tone: 'idle', key: 'idle', text: t(`${base}.narration.idle`) });

  const createdAt = useRef<Map<number, number>>(new Map());
  const nextId = useRef(1);
  const flightId = useRef(1);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const pollRef = useRef(pollInterval);
  pollRef.current = pollInterval;

  const reset = useCallback(() => {
    setRunning(false);
    setRequests(0);
    setEmptyPolls(0);
    setDelivered(0);
    setLatencySum(0);
    setPending([]);
    setFlights([]);
    createdAt.current.clear();
    setNarr({ tone: 'idle', key: `reset-${Date.now()}`, text: t(`${base}.narration.idle`) });
  }, [t]);

  useEffect(() => { reset(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mode]);

  const addFlight = useCallback((kind: 'data' | 'empty') => {
    const id = flightId.current++;
    setFlights((f) => [...f, { id, kind }]);
    setTimeout(() => setFlights((f) => f.filter((x) => x.id !== id)), 650);
  }, []);

  const tickRef = useRef(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const now = (tickRef.current += 1);
      const eventNow = now % 4 === 0;
      if (eventNow) {
        const m = { id: nextId.current++, delivered: false };
        createdAt.current.set(m.id, now);
        setPending((p) => [...p, m]);
      }

      if (modeRef.current === 'polling') {
        if (now % pollRef.current === 0) {
          setRequests((r) => r + 1);
          setPending((p) => {
            if (p.length === 0) {
              setEmptyPolls((e) => e + 1);
              addFlight('empty');
              setNarr({ tone: 'active', key: `empty-${now}`, text: t(`${base}.narration.poll_empty`) });
              return p;
            }
            let lat = 0;
            p.forEach((m) => (lat += now - (createdAt.current.get(m.id) ?? now)));
            setDelivered((d) => d + p.length);
            setLatencySum((s) => s + lat);
            addFlight('data');
            setNarr({ tone: 'success', key: `deliver-${now}`, text: t(`${base}.narration.poll_deliver`, { k: p.length, interval: pollRef.current }) });
            return [];
          });
        }
      } else if (eventNow) {
        setDelivered((d) => d + 1);
        setLatencySum((s) => s + 1);
        setPending([]);
        addFlight('data');
        setNarr({ tone: 'success', key: `push-${now}`, text: t(`${base}.narration.push`) });
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, addFlight, t]);

  const avgLatency = delivered > 0 ? Math.round((latencySum / delivered) * 10) / 10 : 0;
  const persistent = mode !== 'polling';

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

        <div className="mb-5 flex flex-wrap gap-2">
          {(['polling', 'sse', 'websocket'] as Mode[]).map((m) => (
            <TacticalButton key={m} size="sm" variant={mode === m ? 'secondary' : 'ghost'} onClick={() => setMode(m)}>
              {t(`${base}.modes.${m}`)}
            </TacticalButton>
          ))}
        </div>

        {mode === 'polling' && (
          <div className="mb-5 max-w-sm space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.interval`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="2" max="12" value={pollInterval} onChange={(e) => setPollInterval(Number(e.target.value))} className="h-2 flex-1 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
              <span className="w-10 text-right font-mono text-sm tabular-nums text-signal-cyan">{pollInterval}</span>
            </div>
          </div>
        )}

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* Server | wire | client */}
        <div className="rounded-lg border border-slate-200 p-4 dark:border-tactical-border">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="text-center">
              <div className="label-mono mb-1">{t(`${base}.server`)}</div>
              <div className="flex min-h-[12px] flex-wrap justify-center gap-0.5">
                <AnimatePresence>
                  {pending.map((m) => (
                    <motion.span key={m.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className="inline-block h-2.5 w-2.5 rounded-full bg-signal-amber" />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="relative h-8">
              <div
                className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full ${
                  persistent ? 'bg-signal-green/50' : 'border-t-2 border-dashed border-slate-300 bg-transparent dark:border-tactical-border'
                }`}
              />
              {persistent && running && (
                <motion.div
                  className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-signal-green/70"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <AnimatePresence>
                {flights.map((f) => (
                  <motion.span
                    key={f.id}
                    className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full ${f.kind === 'data' ? 'bg-signal-green' : 'bg-signal-red'}`}
                    initial={{ left: '0%', opacity: 0 }}
                    animate={{ left: '100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center">
              <div className="label-mono mb-1">{t(`${base}.client`)}</div>
              <span className="mx-auto block h-4 w-4 rounded-full bg-slate-300 dark:bg-tactical-border" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400 dark:text-tactical-label">
              {persistent ? t(`${base}.persistent`) : t(`${base}.repeated`)}
            </span>
            <StatusBadge variant={persistent ? 'online' : 'pending'} label={persistent ? t(`${base}.one_connection`) : t(`${base}.many_requests`)} />
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={delivered} label={t(`${base}.metrics.delivered`)} color="green" pulse={running} />
          <AnimatedMetric value={avgLatency} suffix=" ticks" label={t(`${base}.metrics.latency`)} color={avgLatency > 3 ? 'red' : 'green'} decimals={1} />
          <AnimatedMetric value={requests} label={t(`${base}.metrics.requests`)} color={mode === 'polling' ? 'amber' : 'green'} />
          <AnimatedMetric value={emptyPolls} label={t(`${base}.metrics.empty_polls`)} color={emptyPolls > 0 ? 'red' : 'default'} />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint.${mode}`)}</p>
      </Panel>
    </div>
  );
}
