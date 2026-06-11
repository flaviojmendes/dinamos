import { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

const SEED_WORDS = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
  'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
];

/** Two independent hashes; k hashes are derived as h1 + i*h2 (Kirsch-Mitzenmacher). */
function hash1(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function hash2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) + s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

function positions(word: string, m: number, k: number): number[] {
  const a = hash1(word);
  const b = hash2(word);
  const out: number[] = [];
  for (let i = 0; i < k; i++) out.push((a + Math.imul(i, b)) % m);
  return out;
}

type Probe = {
  word: string;
  mode: 'insert' | 'query';
  positions: number[];
  perSet: boolean[];
} | null;

export default function BloomFilterSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.bloom_filter';

  const [m, setM] = useState(48);
  const [k, setK] = useState(3);
  const [bits, setBits] = useState<boolean[]>(() => new Array(48).fill(false));
  const [inserted, setInserted] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [probe, setProbe] = useState<Probe>(null);
  const [narr, setNarr] = useState<{ tone: 'idle' | 'active' | 'success'; key: string; text: string }>({
    tone: 'idle',
    key: 'idle',
    text: t(`${base}.narration.idle`),
  });

  const resetState = useCallback(
    (size: number) => {
      setBits(new Array(size).fill(false));
      setInserted([]);
      setProbe(null);
      setNarr({ tone: 'idle', key: `reset-${size}-${Date.now()}`, text: t(`${base}.narration.idle`) });
    },
    [t],
  );

  const reset = useCallback(() => resetState(m), [resetState, m]);
  const resize = useCallback((nextM: number) => { setM(nextM); resetState(nextM); }, [resetState]);

  const insert = useCallback(
    (word: string) => {
      const w = word.trim().toLowerCase();
      if (!w) return;
      const pos = positions(w, m, k);
      setBits((prev) => {
        const next = prev.slice();
        pos.forEach((p) => (next[p] = true));
        return next;
      });
      setInserted((prev) => (prev.includes(w) ? prev : [...prev, w]));
      setProbe({ word: w, mode: 'insert', positions: pos, perSet: pos.map(() => true) });
      setNarr({
        tone: 'active',
        key: `ins-${w}-${Date.now()}`,
        text: t(`${base}.narration.inserted`, { word: w, positions: pos.join(', ') }),
      });
    },
    [m, k, t],
  );

  const addRandom = useCallback(() => {
    const pool = SEED_WORDS.filter((w) => !inserted.includes(w));
    if (!pool.length) return;
    insert(pool[Math.floor(Math.random() * pool.length)]);
  }, [inserted, insert]);

  const runQuery = useCallback(
    (word: string) => {
      const w = word.trim().toLowerCase();
      if (!w) return;
      const pos = positions(w, m, k);
      const perSet = pos.map((p) => bits[p]);
      const present = perSet.every(Boolean);
      const truth = inserted.includes(w);
      setProbe({ word: w, mode: 'query', positions: pos, perSet });
      if (!present) {
        const missing = pos[perSet.findIndex((s) => !s)];
        setNarr({ tone: 'active', key: `q-no-${w}-${Date.now()}`, text: t(`${base}.narration.absent`, { word: w, pos: missing }) });
      } else if (!truth) {
        setNarr({ tone: 'active', key: `q-fp-${w}-${Date.now()}`, text: t(`${base}.narration.false_positive`, { word: w }) });
      } else {
        setNarr({ tone: 'success', key: `q-yes-${w}-${Date.now()}`, text: t(`${base}.narration.maybe`, { word: w, k }) });
      }
    },
    [m, k, bits, inserted, t],
  );

  const bitsSet = bits.filter(Boolean).length;
  const fill = Math.round((bitsSet / m) * 100);
  const n = inserted.length;
  const fpRate = useMemo(() => {
    const p = Math.pow(1 - Math.exp((-k * n) / m), k);
    return Math.round(p * 1000) / 10;
  }, [k, n, m]);

  const litColor = (i: number): 'none' | 'cyan' | 'green' | 'red' => {
    if (!probe) return 'none';
    const idx = probe.positions.indexOf(i);
    if (idx < 0) return 'none';
    if (probe.mode === 'insert') return 'cyan';
    return probe.perSet[idx] ? 'green' : 'red';
  };

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <TacticalButton size="sm" variant="ghost" onClick={reset}>
            {t(`${base}.buttons.reset`)}
          </TacticalButton>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Slider label={t(`${base}.controls.bits`)} value={m} min={16} max={96} step={8} onChange={resize} />
          <Slider label={t(`${base}.controls.hashes`)} value={k} min={1} max={6} onChange={setK} />
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runQuery(query); }}
            placeholder={t(`${base}.placeholder`)}
            className="min-w-[160px] flex-1 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 font-mono text-sm text-slate-900 focus:border-signal-cyan focus:outline-none dark:border-tactical-line dark:text-tactical-text"
          />
          <TacticalButton size="sm" variant="primary" onClick={() => { insert(query); setQuery(''); }}>
            {t(`${base}.buttons.add`)}
          </TacticalButton>
          <TacticalButton size="sm" variant="secondary" onClick={() => runQuery(query)}>
            {t(`${base}.buttons.query`)}
          </TacticalButton>
          <TacticalButton size="sm" variant="ghost" onClick={addRandom}>
            {t(`${base}.buttons.random`)}
          </TacticalButton>
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* Hash mapping chips */}
        {probe && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
              {probe.mode === 'insert' ? t(`${base}.maps_to`) : t(`${base}.checks`)} "{probe.word}"
            </span>
            {probe.positions.map((p, i) => {
              const setBit = probe.perSet[i];
              const color =
                probe.mode === 'insert'
                  ? 'border-signal-cyan/50 bg-signal-cyan/10 text-signal-cyan'
                  : setBit
                    ? 'border-signal-green/50 bg-signal-green/10 text-signal-green'
                    : 'border-signal-red/50 bg-signal-red/10 text-signal-red';
              return (
                <span key={i} className={`rounded-md border px-2 py-1 font-mono text-[11px] ${color}`}>
                  h{i + 1}&#8594;{p} {probe.mode === 'query' && (setBit ? '\u2713' : '\u2717')}
                </span>
              );
            })}
          </div>
        )}

        {/* Bit array */}
        <div className="flex flex-wrap gap-1.5">
          {bits.map((on, i) => {
            const lit = litColor(i);
            const litClass =
              lit === 'cyan'
                ? 'bg-signal-cyan text-black border-signal-cyan ring-2 ring-signal-cyan/40'
                : lit === 'green'
                  ? 'border-signal-green text-signal-green ring-2 ring-signal-green/40'
                  : lit === 'red'
                    ? 'border-signal-red text-signal-red ring-2 ring-signal-red/40'
                    : '';
            return (
              <motion.div
                key={i}
                animate={{ scale: lit !== 'none' ? [1.25, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={`relative flex h-8 w-8 items-center justify-center rounded border font-mono text-[11px] tabular-nums ${
                  litClass ||
                  (on
                    ? 'border-signal-cyan/40 bg-signal-cyan/20 text-signal-cyan'
                    : 'border-slate-200 text-slate-400 dark:border-tactical-border dark:text-tactical-dim')
                }`}
              >
                <span className="absolute left-0.5 top-0 text-[7px] leading-tight text-slate-400 dark:text-tactical-label">{i}</span>
                {on ? 1 : 0}
              </motion.div>
            );
          })}
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={n} label={t(`${base}.metrics.items`)} color="cyan" />
          <AnimatedMetric value={bitsSet} label={t(`${base}.metrics.bits_set`)} color="default" />
          <AnimatedMetric value={fill} suffix="%" label={t(`${base}.metrics.fill`)} color={fill > 60 ? 'red' : 'default'} />
          <AnimatedMetric value={fpRate} suffix="%" label={t(`${base}.metrics.fp_rate`)} color={fpRate > 5 ? 'red' : 'green'} decimals={1} />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 flex-1 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
        <span className="w-10 text-right font-mono text-sm tabular-nums text-signal-cyan">{value}</span>
      </div>
    </div>
  );
}
