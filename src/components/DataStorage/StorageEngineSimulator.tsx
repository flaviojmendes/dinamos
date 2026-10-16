import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowLink, useSimulationMotion } from '../simulation';
import { Database, Layers } from 'lucide-react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
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
  const { reducedMotion, transition } = useSimulationMotion();
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
    <div className="simulation-workspace space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="sim-controls flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={step} disabled={running}>
              <SkipForward size={14} aria-hidden="true" />{t(`${base}.buttons.step`)}
            </TacticalButton>
            <TacticalButton size="sm" aria-pressed={running} variant={running ? 'secondary' : 'primary'} onClick={() => setRunning((r) => !r)}>
              {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>
              <RotateCcw size={14} aria-hidden="true" />{t(`${base}.buttons.reset`)}
            </TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 flex gap-2">
          {(['lsm', 'btree'] as Engine[]).map((e) => (
            <TacticalButton key={e} size="sm" aria-pressed={engine === e} variant={engine === e ? 'secondary' : 'ghost'} onClick={() => setEngine(e)}>
              {t(`${base}.engines.${e}`)}
            </TacticalButton>
          ))}
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* WAL row */}
        <div className="sim-stage rounded-xl border border-slate-200 p-4 dark:border-tactical-border">
        <div className="sim-node mb-2 flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-tactical-border">
          <StatusBadge variant="online" label={t(`${base}.wal`)} />
          <SegmentBarInline value={walEvents} />
          <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-tactical-dim">{walEvents}</span>
        </div>
        <div className="flex justify-center"><FlowLink direction="vertical" active={writes > 0} eventKey={writes} count={1} tone="green" /></div>

        {engine === 'lsm' ? (
          <div className="space-y-4">
            <div className="sim-node p-4">
              <div className="mb-3 flex items-center gap-2 font-sans text-sm font-medium"><Layers size={17} aria-hidden="true" />{t(`${base}.lsm.memtable`)}<span className="ml-auto font-mono text-xs text-signal-green">{memtable}/{MEMTABLE_CAP}</span></div>
              <div className="flex gap-1">
                {Array.from({ length: MEMTABLE_CAP }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: !reducedMotion && i === memtable - 1 ? [1.08, 1] : 1 }}
                    transition={transition}
                    className={`h-6 flex-1 rounded ${i < memtable ? 'bg-signal-green' : 'border border-slate-200 dark:border-tactical-border'}`}
                  />
                ))}
              </div>
            </div>
            <div className="sim-node p-4">
              <div className="label-mono mb-2">{t(`${base}.lsm.level`, { n: 0 })}</div>
              <div className="flex min-h-[2rem] flex-wrap gap-2">
                <AnimatePresence>
                  {l0.map((s) => (
                    <motion.div key={s.id} layout={!reducedMotion} initial={{ y: reducedMotion ? 0 : -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }} transition={transition} className="flex items-center gap-2 rounded-md border border-signal-cyan/50 bg-signal-cyan/10 px-3 py-2 font-mono text-xs text-signal-cyan">
                      <Database size={14} aria-hidden="true" />
                      SST&#183;{s.size}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="sim-node p-4">
              <div className="label-mono mb-2">{t(`${base}.lsm.level`, { n: 1 })}</div>
              <div className="flex min-h-[2rem] flex-wrap gap-2">
                <AnimatePresence>
                  {l1.map((s) => (
                    <motion.div key={s.id} layout={!reducedMotion} initial={{ y: reducedMotion ? 0 : -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={transition} className="flex items-center gap-2 rounded-md border border-brand-500/50 bg-brand-500/10 px-3 py-2 font-mono text-xs text-brand-600 dark:text-brand-400">
                      <Database size={14} aria-hidden="true" />
                      SST&#183;{s.size}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <div className="sim-node p-4">
            <div className="label-mono mb-2">{t(`${base}.btree.pages`)}</div>
            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: PAGES }).map((_, i) => {
                const isActive = i === activePage;
                const everTouched = touched.has(i);
                return (
                  <motion.div
                    key={`${i}-${isActive ? pageWrites : 'idle'}`}
                    animate={{ scale: !reducedMotion && isActive ? [1.08, 1] : 1 }}
                    transition={transition}
                    className={`flex h-9 items-center justify-center rounded-md font-mono text-xs ${
                      isActive
                        ? 'bg-signal-amber text-black'
                        : everTouched
                          ? 'border border-signal-cyan/40 bg-signal-cyan/30'
                          : 'border border-slate-200 dark:border-tactical-border'
                    }`}
                  >{i}</motion.div>
                );
              })}
            </div>
            <p className="mt-3 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.btree.note`)}</p>
          </div>
        )}
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="sim-metrics grid grid-cols-2 gap-3 lg:grid-cols-4">
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
  const { reducedMotion, transition } = useSimulationMotion();
  return (
    <div className="flex h-5 min-w-0 flex-1 gap-0.5 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => <motion.span key={i === 19 ? `${i}-${value}` : i} initial={false} animate={{ opacity: i < value ? 1 : 0.25, scaleY: !reducedMotion && i === Math.min(19, value - 1) ? [0.65, 1] : 1 }} transition={transition} className={`h-full min-w-0 flex-1 rounded-sm ${i < value ? 'bg-signal-green' : 'bg-slate-200 dark:bg-tactical-border'}`} />)}
    </div>
  );
}
