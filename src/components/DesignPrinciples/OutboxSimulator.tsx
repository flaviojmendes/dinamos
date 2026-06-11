import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

type Mode = 'dual-write' | 'outbox';
const TICK_MS = 900;

interface OutboxRow {
  id: number;
  published: boolean;
}

type Narr = { tone: 'idle' | 'active' | 'success'; key: string; text: string };

export default function OutboxSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.outbox';

  const [mode, setMode] = useState<Mode>('dual-write');
  const [running, setRunning] = useState(false);
  const [brokerFailRate, setBrokerFailRate] = useState(30);

  const [orders, setOrders] = useState(0);
  const [published, setPublished] = useState(0);
  const [lost, setLost] = useState(0);
  const [lostChips, setLostChips] = useState<number[]>([]);
  const [outbox, setOutbox] = useState<OutboxRow[]>([]);
  const [narr, setNarr] = useState<Narr>({ tone: 'idle', key: 'idle', text: t(`${base}.narration.idle`) });
  const nextId = useRef(1);

  const brokerFailRef = useRef(brokerFailRate);
  brokerFailRef.current = brokerFailRate;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const reset = useCallback(() => {
    setRunning(false);
    setOrders(0);
    setPublished(0);
    setLost(0);
    setLostChips([]);
    setOutbox([]);
    setNarr({ tone: 'idle', key: `reset-${Date.now()}`, text: t(`${base}.narration.idle`) });
  }, [t]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const step = useCallback(() => {
    const brokerUp = Math.random() * 100 >= brokerFailRef.current;
    const id = nextId.current++;
    if (modeRef.current === 'dual-write') {
      setOrders((o) => o + 1);
      if (brokerUp) {
        setPublished((p) => p + 1);
        setNarr({ tone: 'success', key: `dok-${id}`, text: t(`${base}.narration.dual_ok`, { n: id }) });
      } else {
        setLost((l) => l + 1);
        setLostChips((c) => [...c, id].slice(-12));
        setNarr({ tone: 'active', key: `dlost-${id}`, text: t(`${base}.narration.dual_lost`, { n: id }) });
      }
    } else {
      setOrders((o) => o + 1);
      setOutbox((prev) => {
        const withNew = [...prev, { id, published: false }];
        if (!brokerUp) {
          setNarr({ tone: 'active', key: `owait-${id}`, text: t(`${base}.narration.outbox_wait`, { n: id }) });
          return withNew.slice(-30);
        }
        const next = withNew.slice();
        let shipped = 0;
        for (let i = 0; i < next.length && shipped < 2; i++) {
          if (!next[i].published) {
            next[i] = { ...next[i], published: true };
            shipped++;
          }
        }
        if (shipped > 0) {
          setPublished((p) => p + shipped);
          setNarr({ tone: 'success', key: `odrain-${id}`, text: t(`${base}.narration.outbox_drain`, { n: id, k: shipped }) });
        } else {
          setNarr({ tone: 'active', key: `ocommit-${id}`, text: t(`${base}.narration.outbox_commit`, { n: id }) });
        }
        return next.filter((r) => !r.published).slice(-30);
      });
    }
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [running, step]);

  const pendingOutbox = outbox.filter((r) => !r.published).length;
  const consistent = mode === 'outbox' || lost === 0;

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={step} disabled={running}>
              {t(`${base}.buttons.place`)}
            </TacticalButton>
            <TacticalButton size="sm" variant={running ? 'danger' : 'primary'} onClick={() => setRunning((r) => !r)}>
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['dual-write', 'outbox'] as Mode[]).map((m) => (
              <TacticalButton key={m} size="sm" variant={mode === m ? 'secondary' : 'ghost'} onClick={() => setMode(m)}>
                {t(`${base}.modes.${m}`)}
              </TacticalButton>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">
              {t(`${base}.controls.broker_fail`)}
            </label>
            <input type="range" min="0" max="80" value={brokerFailRate} onChange={(e) => setBrokerFailRate(Number(e.target.value))} className="h-2 w-28 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
            <span className="w-10 text-right font-mono text-sm tabular-nums text-signal-cyan">{brokerFailRate}%</span>
          </div>
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* Pipeline stage diagram */}
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1.4fr_auto_1fr]">
          {/* Service */}
          <Stage label={t(`${base}.service`)}>
            <motion.div
              animate={{ scale: running ? [1, 1.06, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="font-mono text-3xl tabular-nums text-slate-700 dark:text-tactical-text"
            >
              #{orders}
            </motion.div>
            <span className="mt-1 font-sans text-[11px] text-slate-400 dark:text-tactical-label">{t(`${base}.orders_made`)}</span>
          </Stage>

          <Arrow />

          {/* DB (+ atomic outbox in outbox mode) */}
          <div
            className={`flex flex-col rounded-lg border p-3 ${
              mode === 'outbox'
                ? 'border-dashed border-signal-green/60 bg-signal-green/5'
                : 'border-slate-200 dark:border-tactical-border'
            }`}
          >
            {mode === 'outbox' && (
              <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-wide text-signal-green">
                {t(`${base}.one_transaction`)}
              </div>
            )}
            <div className={`grid gap-2 ${mode === 'outbox' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div className="rounded-md bg-slate-100 px-3 py-3 text-center dark:bg-tactical-raised">
                <div className="label-mono">{t(`${base}.database`)}</div>
                <div className="font-mono text-xl tabular-nums text-signal-cyan">{orders}</div>
              </div>
              {mode === 'outbox' && (
                <div className="rounded-md bg-signal-amber/10 px-3 py-3 text-center">
                  <div className="label-mono text-signal-amber">{t(`${base}.outbox_table`)}</div>
                  <div className="font-mono text-xl tabular-nums text-signal-amber">{pendingOutbox}</div>
                </div>
              )}
            </div>
            {mode === 'outbox' && (
              <div className="mt-2 flex min-h-[26px] flex-wrap gap-1.5">
                <AnimatePresence>
                  {outbox
                    .filter((r) => !r.published)
                    .map((r) => (
                      <motion.span
                        key={r.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ x: 40, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-4 w-4 rounded-sm bg-signal-amber/70"
                        title={`outbox #${r.id}`}
                      />
                    ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <Arrow label={mode === 'outbox' ? t(`${base}.relay`) : undefined} />

          {/* Broker + lost bin */}
          <Stage label={t(`${base}.broker`)} tone="green">
            <div className="font-mono text-3xl tabular-nums text-signal-green">{published}</div>
            <span className="mt-1 font-sans text-[11px] text-slate-400 dark:text-tactical-label">{t(`${base}.events_sent`)}</span>
            {mode === 'dual-write' && lost > 0 && (
              <div className="mt-3 w-full rounded-md border border-signal-red/40 bg-signal-red/5 p-2">
                <div className="label-mono text-signal-red">{t(`${base}.lost`)} · {lost}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <AnimatePresence>
                    {lostChips.map((id) => (
                      <motion.span
                        key={id}
                        initial={{ scale: 0, opacity: 0, y: -6 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="h-3.5 w-3.5 rounded-sm bg-signal-red/70"
                        title={`lost #${id}`}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </Stage>
        </div>

        <div className="mt-5">
          <StatusBadge variant={consistent ? 'online' : 'classified'} label={consistent ? t(`${base}.consistent`) : t(`${base}.inconsistent`)} />
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={orders} label={t(`${base}.metrics.orders`)} color="cyan" pulse={running} />
          <AnimatedMetric value={published} label={t(`${base}.metrics.published`)} color="green" />
          <AnimatedMetric value={lost} label={t(`${base}.metrics.lost`)} color={lost > 0 ? 'red' : 'default'} />
          <AnimatedMetric value={pendingOutbox} label={t(`${base}.metrics.pending`)} color={pendingOutbox > 0 ? 'amber' : 'default'} />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint.${mode}`)}</p>
      </Panel>
    </div>
  );
}

function Stage({ label, tone, children }: { label: string; tone?: 'green'; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-3 text-center dark:border-tactical-border">
      <div className={`label-mono ${tone === 'green' ? 'text-signal-green' : ''}`}>{label}</div>
      <div className="mt-2 flex flex-1 flex-col items-center justify-center">{children}</div>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-1">
      <motion.span
        className="font-mono text-xl text-signal-cyan"
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
      >
        &#8594;
      </motion.span>
      {label && <span className="mt-1 font-mono text-[9px] uppercase tracking-wide text-slate-400 dark:text-tactical-label">{label}</span>}
    </div>
  );
}
