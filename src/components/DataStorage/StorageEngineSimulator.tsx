import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

type Engine = 'lsm' | 'btree';

const TICK_MS = 700;
const MEMTABLE_CAP = 8;
const L0_COMPACT_AT = 4;
const PAGES = 24;

interface SSTable {
  id: number;
  level: number;
  size: number;
}

type Narr = { tone: 'idle' | 'active' | 'success'; key: string; text: string };

export default function StorageEngineSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.storage_engine';

  const [engine, setEngine] = useState<Engine>('lsm');
  const [running, setRunning] = useState(false);

  const [memtable, setMemtable] = useState(0);
  const [sstables, setSSTables] = useState<SSTable[]>([]);
  const [walEvents, setWalEvents] = useState(0);
  const [pageWrites, setPageWrites] = useState(0);
  const [activePage, setActivePage] = useState(-1);
  const [touched, setTouched] = useState<Set<number>>(new Set());

  const [writes, setWrites] = useState(0);
  const [physicalWrites, setPhysicalWrites] = useState(0);
  const [compactions, setCompactions] = useState(0);
  const [narr, setNarr] = useState<Narr>({ tone: 'idle', key: 'idle', text: t(`${base}.narration.idle`) });

  const memRef = useRef(0);
  const sstRef = useRef<SSTable[]>([]);
  const pageWritesRef = useRef(0);
  const touchedRef = useRef<Set<number>>(new Set());
  const engineRef = useRef(engine);
  engineRef.current = engine;
  const nextId = useRef(1);

  const reset = useCallback(() => {
    setRunning(false);
    memRef.current = 0;
    sstRef.current = [];
    pageWritesRef.current = 0;
    touchedRef.current = new Set();
    setMemtable(0);
    setSSTables([]);
    setWalEvents(0);
    setPageWrites(0);
    setActivePage(-1);
    setTouched(new Set());
    setWrites(0);
    setPhysicalWrites(0);
    setCompactions(0);
    setNarr({ tone: 'idle', key: `reset-${Date.now()}`, text: t(`${base}.narration.idle`) });
  }, [t]);

  useEffect(() => { reset(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [engine]);

  const step = useCallback(() => {
    setWrites((w) => w + 1);
    setWalEvents((e) => e + 1);

    if (engineRef.current === 'lsm') {
      let pw = 1;
      memRef.current += 1;
      if (memRef.current >= MEMTABLE_CAP) {
        pw += MEMTABLE_CAP;
        const flushed = [...sstRef.current, { id: nextId.current++, level: 0, size: MEMTABLE_CAP }];
        const l0 = flushed.filter((s) => s.level === 0);
        if (l0.length >= L0_COMPACT_AT) {
          const merged = l0.reduce((sum, s) => sum + s.size, 0);
          pw += merged;
          sstRef.current = [...flushed.filter((s) => s.level !== 0), { id: nextId.current++, level: 1, size: merged }];
          setCompactions((c) => c + 1);
          setNarr({ tone: 'active', key: `compact-${nextId.current}`, text: t(`${base}.narration.lsm_compact`, { count: L0_COMPACT_AT, size: merged }) });
        } else {
          sstRef.current = flushed;
          setNarr({ tone: 'active', key: `flush-${nextId.current}`, text: t(`${base}.narration.lsm_flush`) });
        }
        memRef.current = 0;
      } else {
        setNarr({ tone: 'success', key: `append-${Date.now()}`, text: t(`${base}.narration.lsm_append`, { mem: memRef.current, cap: MEMTABLE_CAP }) });
      }
      setMemtable(memRef.current);
      setSSTables(sstRef.current.slice());
      setPhysicalWrites((p) => p + pw);
    } else {
      const page = (pageWritesRef.current * 7 + 3) % PAGES;
      pageWritesRef.current += 1;
      touchedRef.current.add(page);
      setActivePage(page);
      setTouched(new Set(touchedRef.current));
      setPageWrites(pageWritesRef.current);
      setPhysicalWrites((p) => p + 1);
      setNarr({ tone: 'active', key: `page-${Date.now()}`, text: t(`${base}.narration.btree_update`, { page }) });
    }
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [running, step]);

  const writeAmp = writes > 0 ? Math.round((physicalWrites / writes) * 10) / 10 : 0;
  const readAmp = engine === 'lsm' ? 1 + sstables.length : 1;
  const l0 = sstables.filter((s) => s.level === 0);
  const l1 = sstables.filter((s) => s.level === 1);

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={step} disabled={running}>
              {t(`${base}.buttons.step`)}
            </TacticalButton>
            <TacticalButton size="sm" variant={running ? 'danger' : 'primary'} onClick={() => setRunning((r) => !r)}>
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>
              {t(`${base}.buttons.reset`)}
            </TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 flex gap-2">
          {(['lsm', 'btree'] as Engine[]).map((e) => (
            <TacticalButton key={e} size="sm" variant={engine === e ? 'secondary' : 'ghost'} onClick={() => setEngine(e)}>
              {t(`${base}.engines.${e}`)}
            </TacticalButton>
          ))}
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* WAL row */}
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-tactical-border">
          <StatusBadge variant="online" label={t(`${base}.wal`)} />
          <SegmentBarInline value={walEvents % 20} />
          <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-tactical-dim">{walEvents}</span>
        </div>

        {engine === 'lsm' ? (
          <div className="space-y-4">
            <div>
              <div className="label-mono mb-2">{t(`${base}.lsm.memtable`)}</div>
              <div className="flex gap-1">
                {Array.from({ length: MEMTABLE_CAP }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: i === memtable - 1 ? [1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`h-6 flex-1 rounded ${i < memtable ? 'bg-signal-green' : 'border border-slate-200 dark:border-tactical-border'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="label-mono mb-2">{t(`${base}.lsm.level`, { n: 0 })}</div>
              <div className="flex min-h-[2rem] flex-wrap gap-2">
                <AnimatePresence>
                  {l0.map((s) => (
                    <motion.div key={s.id} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0, y: 8 }} className="rounded border border-signal-cyan/50 bg-signal-cyan/30 px-3 py-1 font-mono text-[10px] text-signal-cyan">
                      SST&#183;{s.size}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div>
              <div className="label-mono mb-2">{t(`${base}.lsm.level`, { n: 1 })}</div>
              <div className="flex min-h-[2rem] flex-wrap gap-2">
                <AnimatePresence>
                  {l1.map((s) => (
                    <motion.div key={s.id} layout initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="rounded border border-brand-500/50 bg-brand-500/20 px-3 py-1 font-mono text-[10px] text-brand-600 dark:text-brand-400">
                      SST&#183;{s.size}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="label-mono mb-2">{t(`${base}.btree.pages`)}</div>
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: PAGES }).map((_, i) => {
                const isActive = i === activePage;
                const everTouched = touched.has(i);
                return (
                  <motion.div
                    key={i}
                    animate={{ scale: isActive ? [1.25, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`h-7 rounded ${
                      isActive
                        ? 'bg-signal-amber'
                        : everTouched
                          ? 'border border-signal-cyan/40 bg-signal-cyan/30'
                          : 'border border-slate-200 dark:border-tactical-border'
                    }`}
                  />
                );
              })}
            </div>
            <p className="mt-3 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.btree.note`)}</p>
          </div>
        )}
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={writes} label={t(`${base}.metrics.writes`)} color="cyan" pulse={running} />
          <AnimatedMetric value={writeAmp} label={t(`${base}.metrics.write_amp`)} color={writeAmp > 2 ? 'red' : 'green'} decimals={1} suffix="x" />
          <AnimatedMetric value={readAmp} label={t(`${base}.metrics.read_amp`)} color={readAmp > 3 ? 'red' : 'default'} suffix="x" />
          <AnimatedMetric value={compactions} label={t(`${base}.metrics.compactions`)} color="amber" />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">
          {engine === 'lsm' ? t(`${base}.hint_lsm`) : t(`${base}.hint_btree`)}
        </p>
      </Panel>
    </div>
  );
}

function SegmentBarInline({ value }: { value: number }) {
  return (
    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-tactical-raised">
      <motion.div className="absolute inset-y-0 left-0 rounded-full bg-signal-green" animate={{ width: `${(value / 20) * 100}%` }} />
    </div>
  );
}
