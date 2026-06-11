import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar, Legend } from '../simulators/teaching';

const base = 'simulators.cache';
const CACHE_MS = 4; // memory read latency
const KEYS: { id: string; hot: boolean }[] = [
  { id: 'user:1', hot: true },
  { id: 'user:2', hot: true },
  { id: 'cart:7', hot: false },
  { id: 'cart:8', hot: false },
  { id: 'post:42', hot: false },
  { id: 'post:99', hot: false },
];

interface Entry {
  key: string;
  insertedAt: number;
  lastUsed: number;
}

type Station = 'client' | 'cache' | 'db';
type Tone = 'idle' | 'hit' | 'miss';
type Narr = { kind: 'idle' | 'lookup' | 'hit' | 'miss' | 'stale' | 'evict' | 'disabled'; vars?: Record<string, string | number> };

const stationLeft: Record<Station, string> = { client: '8%', cache: '50%', db: '92%' };

export default function CacheSimulation() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const [cacheOn, setCacheOn] = useState(true);
  const [ttl, setTtl] = useState(15);
  const [dbLatency, setDbLatency] = useState(90);
  const [capacity, setCapacity] = useState(4);

  const [entries, setEntries] = useState<Entry[]>([]);
  const entriesRef = useRef<Entry[]>([]);
  const writeCache = (next: Entry[]) => { entriesRef.current = next; setEntries(next); };

  const [now, setNow] = useState(Date.now());
  const [token, setToken] = useState<{ key: string; at: Station; tone: Tone } | null>(null);
  const [phase, setPhase] = useState<Station | 'store' | null>(null);
  const [evicting, setEvicting] = useState<string | null>(null);
  const [narr, setNarr] = useState<Narr>({ kind: 'idle' });
  const [last, setLast] = useState<{ key: string; ms: number; hit: boolean } | null>(null);

  const [requests, setRequests] = useState(0);
  const [hits, setHits] = useState(0);
  const [dbQueries, setDbQueries] = useState(0);
  const [latencySum, setLatencySum] = useState(0);

  const runId = useRef(0);
  const busy = useRef(false);
  const auto = useRef(false);
  const [autoOn, setAutoOn] = useState(false);

  // Real-time clock for TTL countdown + expiry sweep.
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      const fresh = entriesRef.current.filter((e) => Date.now() - e.insertedAt < ttl * 1000);
      if (fresh.length !== entriesRef.current.length) writeCache(fresh);
    }, 250);
    return () => clearInterval(id);
  }, [ttl]);

  const dur = (ms: number) => (reduce ? Math.min(ms, 60) : ms);
  const sleep = (ms: number, id: number) =>
    new Promise<boolean>((res) => setTimeout(() => res(id === runId.current), dur(ms)));

  const reset = useCallback(() => {
    runId.current += 1;
    busy.current = false;
    auto.current = false;
    setAutoOn(false);
    writeCache([]);
    setToken(null);
    setPhase(null);
    setEvicting(null);
    setNarr({ kind: 'idle' });
    setLast(null);
    setRequests(0);
    setHits(0);
    setDbQueries(0);
    setLatencySum(0);
  }, []);

  const runRead = useCallback(
    async (key: string) => {
      if (busy.current) return;
      busy.current = true;
      const id = ++runId.current;
      const travel = 420;

      setRequests((v) => v + 1);
      setNarr({ kind: 'lookup', vars: { key } });
      setLast(null);

      // Client -> Cache (or straight past when cache is off).
      setPhase('client');
      setToken({ key, at: 'client', tone: 'idle' });
      if (!(await sleep(120, id))) return done();

      if (!cacheOn) {
        // Bypass: client -> db -> client, always the slow path.
        setNarr({ kind: 'disabled', vars: { ms: dbLatency } });
        setToken({ key, at: 'db', tone: 'miss' });
        setPhase('db');
        if (!(await sleep(travel, id))) return done();
        if (!(await sleep(dbLatency, id))) return done();
        setDbQueries((v) => v + 1);
        setToken({ key, at: 'client', tone: 'miss' });
        setPhase('client');
        if (!(await sleep(travel, id))) return done();
        record(key, dbLatency, false);
        return finish(id);
      }

      setToken({ key, at: 'cache', tone: 'idle' });
      setPhase('cache');
      if (!(await sleep(travel, id))) return done();

      const existing = entriesRef.current.find((e) => e.key === key);
      const fresh = existing && Date.now() - existing.insertedAt < ttl * 1000;

      if (fresh) {
        // HIT: bounce straight back from memory.
        setNarr({ kind: 'hit', vars: { key, ms: CACHE_MS } });
        setToken({ key, at: 'cache', tone: 'hit' });
        writeCache(entriesRef.current.map((e) => (e.key === key ? { ...e, lastUsed: Date.now() } : e)));
        if (!(await sleep(220, id))) return done();
        setToken({ key, at: 'client', tone: 'hit' });
        setPhase('client');
        if (!(await sleep(travel, id))) return done();
        setHits((v) => v + 1);
        record(key, CACHE_MS, true);
        return finish(id);
      }

      // MISS (absent or stale) -> fall through to the database.
      setNarr(existing ? { kind: 'stale', vars: { key } } : { kind: 'miss', vars: { key, ms: dbLatency } });
      setToken({ key, at: 'cache', tone: 'miss' });
      if (!(await sleep(260, id))) return done();
      if (existing) setNarr({ kind: 'miss', vars: { key, ms: dbLatency } });

      setToken({ key, at: 'db', tone: 'miss' });
      setPhase('db');
      if (!(await sleep(travel, id))) return done();
      if (!(await sleep(dbLatency, id))) return done();
      setDbQueries((v) => v + 1);

      // DB -> cache: store the result, evicting LRU if the cache is full.
      setToken({ key, at: 'cache', tone: 'idle' });
      setPhase('store');
      if (!(await sleep(travel, id))) return done();

      let next = entriesRef.current.filter((e) => Date.now() - e.insertedAt < ttl * 1000 && e.key !== key);
      if (next.length >= capacity) {
        const victim = next.reduce((a, b) => (a.lastUsed <= b.lastUsed ? a : b));
        setNarr({ kind: 'evict', vars: { key: victim.key, incoming: key } });
        setEvicting(victim.key);
        if (!(await sleep(360, id))) return done();
        next = next.filter((e) => e.key !== victim.key);
        setEvicting(null);
      }
      next = [...next, { key, insertedAt: Date.now(), lastUsed: Date.now() }];
      writeCache(next);

      setToken({ key, at: 'client', tone: 'idle' });
      setPhase('client');
      if (!(await sleep(travel, id))) return done();
      record(key, dbLatency, false);
      return finish(id);

      function record(k: string, ms: number, hit: boolean) {
        setLast({ key: k, ms, hit });
        setLatencySum((v) => v + ms);
      }
      function done() {
        busy.current = false;
      }
      function finish(fid: number) {
        if (fid !== runId.current) { busy.current = false; return; }
        setToken(null);
        setPhase(null);
        busy.current = false;
        if (auto.current) {
          setTimeout(() => {
            if (auto.current && fid === runId.current) runRead(weightedKey());
          }, reduce ? 120 : 520);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cacheOn, ttl, dbLatency, capacity, reduce],
  );

  const toggleAuto = () => {
    if (auto.current) {
      auto.current = false;
      setAutoOn(false);
    } else {
      auto.current = true;
      setAutoOn(true);
      if (!busy.current) runRead(weightedKey());
    }
  };

  const hitRatio = requests > 0 ? Math.round((hits / requests) * 100) : 0;
  const avgLatency = requests > 0 ? Math.round(latencySum / requests) : 0;

  const narrText =
    narr.kind === 'idle' ? t(`${base}.narration.idle`) : t(`${base}.narration.${narr.kind}`, narr.vars);
  const narrTone = narr.kind === 'hit' ? 'success' : narr.kind === 'idle' ? 'idle' : 'active';

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant={autoOn ? 'danger' : 'primary'} onClick={toggleAuto}>
              {autoOn ? t(`${base}.buttons.stop`) : t(`${base}.buttons.auto`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={() => writeCache([])}>{t(`${base}.buttons.clear`)}</TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="mb-5 max-w-prose font-sans text-xs leading-relaxed text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        {/* Cache on/off segmented toggle */}
        <div className="mb-5 inline-flex rounded-lg border border-slate-200 p-0.5 dark:border-tactical-border">
          {[true, false].map((on) => (
            <button
              key={String(on)}
              onClick={() => setCacheOn(on)}
              className={`rounded-md px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                cacheOn === on
                  ? on
                    ? 'bg-signal-green/15 text-emerald-700 dark:text-signal-green'
                    : 'bg-signal-red/15 text-red-700 dark:text-signal-red'
                  : 'text-slate-500 dark:text-tactical-dim'
              }`}
            >
              {on ? t(`${base}.toggle.cache_on`) : t(`${base}.toggle.cache_off`)}
            </button>
          ))}
        </div>

        {/* Stage: client -> cache -> db with a traveling request token */}
        <div className="relative mx-auto mb-6 h-28 max-w-2xl">
          <div className="absolute left-[8%] right-[8%] top-9 h-px bg-slate-200 dark:bg-tactical-line" />
          <StageNode left="8%" label={t(`${base}.stage.client`)} active={phase === 'client'} tone="cyan" />
          <StageNode
            left="50%"
            label={t(`${base}.stage.cache`)}
            sub={t(`${base}.stage.cache_sub`)}
            active={cacheOn && (phase === 'cache' || phase === 'store')}
            dim={!cacheOn}
            tone={token?.tone === 'miss' && phase === 'cache' ? 'amber' : 'green'}
          />
          <StageNode left="92%" label={t(`${base}.stage.db`)} sub={t(`${base}.stage.db_sub`)} active={phase === 'db'} tone="red" />

          <AnimatePresence>
            {token && (
              <motion.div
                key="token"
                className="absolute top-9 z-10"
                style={{ x: '-50%', y: '-50%' }}
                initial={{ opacity: 0, scale: 0.6, left: stationLeft.client }}
                animate={{ opacity: 1, scale: 1, left: stationLeft[token.at] }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ left: { duration: dur(420) / 1000, ease: [0.22, 1, 0.36, 1] }, default: { duration: 0.18 } }}
              >
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] font-semibold shadow-sm ${
                    token.tone === 'hit'
                      ? 'bg-signal-green text-black'
                      : token.tone === 'miss'
                        ? 'bg-signal-amber text-black'
                        : 'bg-signal-cyan text-black'
                  }`}
                >
                  {token.key}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key picker */}
        <div className="mb-5">
          <span className="label-mono mb-2 block">{t(`${base}.keys_label`)}</span>
          <div className="flex flex-wrap gap-2">
            {KEYS.map((k) => {
              const e = entries.find((x) => x.key === k.id);
              const cached = !!e && now - e.insertedAt < ttl * 1000;
              return (
                <button
                  key={k.id}
                  onClick={() => runRead(k.id)}
                  disabled={busy.current}
                  className={`group inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    cached
                      ? 'border-signal-green/40 text-emerald-700 dark:text-signal-green'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400 dark:border-tactical-border dark:text-tactical-text dark:hover:border-tactical-line'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cached ? 'bg-signal-green' : 'bg-slate-300 dark:bg-tactical-line'}`} />
                  {k.id}
                  {k.hot && <span className="rounded-sm bg-signal-amber/15 px-1 text-[9px] font-medium uppercase tracking-wide text-amber-700 dark:text-signal-amber">{t(`${base}.hot`)}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <NarrationBar tone={narrTone} stepKey={`${narr.kind}-${requests}`}>{narrText}</NarrationBar>
        </div>

        {/* Cache slots with TTL countdown + last-read latency */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="label-mono mb-2 block">{t(`${base}.slots`)} · {Math.min(entries.length, capacity)}/{capacity}</span>
            <div className="space-y-1.5">
              {Array.from({ length: capacity }).map((_, i) => {
                const e = entries[i];
                if (!e) {
                  return (
                    <div key={`empty-${i}`} className="flex h-9 items-center rounded-md border border-dashed border-slate-200 px-3 dark:border-tactical-border">
                      <span className="font-mono text-[11px] text-slate-300 dark:text-tactical-line">—</span>
                    </div>
                  );
                }
                const remaining = Math.max(0, ttl * 1000 - (now - e.insertedAt));
                const pct = Math.max(0, Math.min(1, remaining / (ttl * 1000)));
                const expiringSoon = pct <= 0.4;
                const isEvicting = evicting === e.key;
                return (
                  <motion.div
                    key={e.key}
                    layout
                    animate={isEvicting ? { backgroundColor: 'rgba(231,76,60,0.16)', x: [0, -3, 3, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    className="relative flex h-9 items-center justify-between overflow-hidden rounded-md border border-slate-200 px-3 dark:border-tactical-border"
                  >
                    <div
                      className={`absolute bottom-0 left-0 top-0 ${expiringSoon ? 'bg-signal-amber/10' : 'bg-signal-green/10'}`}
                      style={{ width: `${pct * 100}%` }}
                    />
                    <span className="relative font-mono text-xs text-slate-900 dark:text-tactical-text">{e.key}</span>
                    <span className={`relative font-mono text-[11px] tabular-nums ${expiringSoon ? 'text-amber-700 dark:text-signal-amber' : 'text-slate-400 dark:text-tactical-dim'}`}>
                      {(remaining / 1000).toFixed(1)}s
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <span className="label-mono mb-2 block">{t(`${base}.last_read`)}</span>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-tactical-border">
              <AnimatePresence mode="wait">
                {last ? (
                  <motion.div
                    key={`${last.key}-${requests}`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className={`font-mono text-3xl font-bold tabular-nums ${last.hit ? 'text-signal-green' : 'text-signal-amber'}`}>
                        {last.ms}<span className="text-base font-medium text-slate-400 dark:text-tactical-dim"> ms</span>
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{last.key}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-tactical-raised">
                      <motion.div
                        className={`h-full rounded-full ${last.hit ? 'bg-signal-green' : 'bg-signal-amber'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(2, Math.min(100, (last.ms / dbLatency) * 100))}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="mt-2 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">
                      {last.hit ? t(`${base}.served_from_memory`) : t(`${base}.served_from_db`)}
                      {last.hit && <> · {t(`${base}.legend.miss`).toLowerCase()} ≈ {dbLatency} ms</>}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p key="placeholder" className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                    {t(`${base}.narration.idle`)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Legend
            items={[
              { swatch: 'bg-signal-green', label: t(`${base}.legend.fresh`) },
              { swatch: 'bg-signal-amber', label: t(`${base}.legend.expiring`) },
              { swatch: 'bg-signal-red', label: t(`${base}.legend.miss`) },
              { swatch: '', hollow: true, label: t(`${base}.legend.empty`) },
            ]}
          />
        </div>
      </Panel>

      {/* Controls */}
      <Panel title={t(`${base}.controls.ttl`)} accent="amber">
        <div className="grid gap-5 sm:grid-cols-3">
          <SliderRow label={t(`${base}.controls.ttl`)} value={`${ttl}s`} min={5} max={40} step={1} v={ttl} onChange={setTtl} accent="amber" />
          <SliderRow label={t(`${base}.controls.db_latency`)} value={`${dbLatency}ms`} min={20} max={200} step={10} v={dbLatency} onChange={setDbLatency} accent="red" />
          <SliderRow label={t(`${base}.controls.capacity`)} value={String(capacity)} min={2} max={6} step={1} v={capacity} onChange={setCapacity} accent="cyan" />
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={hitRatio} suffix="%" label={t(`${base}.metrics.hit_ratio`)} color={hitRatio >= 60 ? 'green' : hitRatio >= 30 ? 'amber' : 'red'} pulse={autoOn} />
          <AnimatedMetric value={avgLatency} suffix=" ms" label={t(`${base}.metrics.avg_latency`)} color={avgLatency <= dbLatency / 2 ? 'green' : 'amber'} />
          <AnimatedMetric value={dbQueries} label={t(`${base}.metrics.db_queries`)} color={dbQueries > 0 ? 'red' : 'default'} />
          <AnimatedMetric value={requests} label={t(`${base}.metrics.requests`)} color="cyan" />
        </div>
        <p className="mt-4 max-w-prose font-sans text-[11px] leading-relaxed text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

function weightedKey(): string {
  const pool: string[] = [];
  for (const k of KEYS) for (let i = 0; i < (k.hot ? 4 : 1); i++) pool.push(k.id);
  return pool[Math.floor(Math.random() * pool.length)];
}

function StageNode({
  left,
  label,
  sub,
  active,
  dim,
  tone,
}: {
  left: string;
  label: string;
  sub?: string;
  active?: boolean;
  dim?: boolean;
  tone: 'cyan' | 'green' | 'red' | 'amber';
}) {
  const ring =
    tone === 'green'
      ? 'border-signal-green bg-signal-green/10'
      : tone === 'red'
        ? 'border-signal-red bg-signal-red/10'
        : tone === 'amber'
          ? 'border-signal-amber bg-signal-amber/10'
          : 'border-signal-cyan bg-signal-cyan/10';
  return (
    <div className="absolute top-9 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left }}>
      <motion.div
        animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={active ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-colors ${
          active ? ring : 'border-slate-300 bg-white dark:border-tactical-border dark:bg-tactical-raised'
        } ${dim ? 'opacity-40' : ''}`}
      >
        <span className="font-sans text-[10px] font-semibold text-slate-700 dark:text-tactical-text">{label}</span>
      </motion.div>
      {sub && <span className="mt-1.5 font-mono text-[9px] uppercase tracking-wide text-slate-400 dark:text-tactical-label">{sub}</span>}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  v,
  onChange,
  accent,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  v: number;
  onChange: (n: number) => void;
  accent: 'amber' | 'red' | 'cyan';
}) {
  const accentClass = accent === 'red' ? 'accent-signal-red' : accent === 'cyan' ? 'accent-signal-cyan' : 'accent-signal-amber';
  const valueClass = accent === 'red' ? 'text-signal-red' : accent === 'cyan' ? 'text-signal-cyan' : 'text-signal-amber';
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</span>
        <span className={`font-mono text-sm tabular-nums ${valueClass}`}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 dark:bg-tactical-border ${accentClass}`}
      />
    </div>
  );
}
