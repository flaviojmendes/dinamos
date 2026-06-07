import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton, SegmentBar, type StatusVariant } from '../tactical';
import { AnimatedMetric } from './motion';

type StageKey = 'embed' | 'search' | 'rerank' | 'assemble' | 'generate';

interface Chunk {
  id: number;
  score: number;
  relevant: boolean;
}

interface Result {
  recall: number;
  latency: number;
  cost: number;
  context: number;
  quality: number;
  chunks: Chunk[];
}

const STAGE_ORDER: StageKey[] = ['embed', 'search', 'rerank', 'assemble', 'generate'];
const STAGE_MS = 700;

export default function RagPipelineSimulator() {
  const { t } = useTranslation();
  const [chunkSize, setChunkSize] = useState(300);
  const [topK, setTopK] = useState(5);
  const [rerank, setRerank] = useState(true);

  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [result, setResult] = useState<Result | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(id => clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const compute = useCallback((): Result => {
    // Recall improves with K and reranking; chunk size has a sweet spot around 300.
    const chunkPenalty = Math.abs(chunkSize - 300) / 18;
    const recall = Math.max(20, Math.min(99, Math.round(45 + topK * 4 + (rerank ? 14 : 0) - chunkPenalty)));
    const context = topK * chunkSize;
    // Latency: embed + search(scales with K) + rerank(scales with K) + assemble + generate(scales with context).
    const latency = Math.round(25 + topK * 12 + (rerank ? topK * 30 : 0) + 40 + context / 12);
    // Cost in cents: input tokens (context) + reranker calls.
    const cost = Number((context * 0.0004 + (rerank ? topK * 0.05 : 0)).toFixed(2));
    // Quality: helped by recall, hurt by overstuffed context ("lost in the middle").
    const overflowPenalty = context > 3000 ? (context - 3000) / 120 : 0;
    const quality = Math.max(15, Math.min(99, Math.round(recall * 0.9 - overflowPenalty + (rerank ? 6 : 0))));

    const chunks: Chunk[] = Array.from({ length: topK }).map((_, i) => {
      const base = 0.92 - i * (0.5 / Math.max(1, topK));
      const jitter = (Math.sin(i * 2.3 + chunkSize) + 1) / 2 * 0.08;
      const score = Math.max(0.4, Math.min(0.99, base - jitter + (rerank ? 0.04 : 0)));
      return { id: i + 1, score: Number(score.toFixed(2)), relevant: i < Math.ceil((recall / 100) * topK) };
    });

    return { recall, latency, cost, context, quality, chunks };
  }, [chunkSize, topK, rerank]);

  const run = useCallback(() => {
    clearTimers();
    setResult(null);
    setRunning(true);
    setActiveStage(0);

    STAGE_ORDER.forEach((stage, i) => {
      if (stage === 'rerank' && !rerank) return;
      const id = window.setTimeout(() => setActiveStage(i), i * STAGE_MS);
      timers.current.push(id);
    });

    const finishId = window.setTimeout(() => {
      setResult(compute());
      setActiveStage(STAGE_ORDER.length);
      setRunning(false);
    }, STAGE_ORDER.length * STAGE_MS);
    timers.current.push(finishId);
  }, [compute, rerank]);

  const reset = useCallback(() => {
    clearTimers();
    setRunning(false);
    setActiveStage(-1);
    setResult(null);
  }, []);

  const stageStatus = (i: number, stage: StageKey): StatusVariant => {
    if (stage === 'rerank' && !rerank) return 'locked';
    if (activeStage < 0) return 'pending';
    if (activeStage > i || (!running && result)) return 'completed';
    if (activeStage === i) return 'in-progress';
    return 'pending';
  };

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.rag_pipeline';

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={run} disabled={running}>
              {t(`${base}.buttons.run`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>
              {t(`${base}.buttons.reset`)}
            </TacticalButton>
          </div>
        }
      >
        <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.chunk_size`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="100" max="800" step="50" value={chunkSize} onChange={e => setChunkSize(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{chunkSize}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.top_k`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="1" max="12" value={topK} onChange={e => setTopK(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{topK}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.rerank`)}</label>
            <TacticalButton size="sm" variant={rerank ? 'secondary' : 'ghost'} onClick={() => setRerank(!rerank)}>
              {rerank ? t(`${base}.buttons.on`) : t(`${base}.buttons.off`)}
            </TacticalButton>
          </div>
        </div>

        {/* Pipeline stages */}
        <div className="relative">
          {/* Flow progress line behind the stages */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-[2px] -translate-y-1/2 bg-slate-200 dark:bg-tactical-border md:block">
            <motion.div
              className="h-full bg-signal-cyan"
              animate={{ width: activeStage < 0 ? '0%' : `${Math.min(100, ((activeStage + 0.5) / STAGE_ORDER.length) * 100)}%` }}
              transition={{ duration: STAGE_MS / 1000, ease: 'easeInOut' }}
            />
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-2">
            {STAGE_ORDER.map((stage, i) => {
              const status = stageStatus(i, stage);
              const active = status === 'in-progress';
              return (
                <motion.div
                  key={stage}
                  animate={{
                    scale: active ? 1.04 : 1,
                    borderColor: active ? 'rgb(34 211 238)' : undefined,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-3 flex flex-col gap-2"
                >
                  {active && (
                    <motion.div
                      layoutId="rag-packet"
                      className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-signal-cyan"
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    />
                  )}
                  <span className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{i + 1}. {t(`${base}.stages.${stage}`)}</span>
                  <StatusBadge variant={status} label={stage === 'rerank' && !rerank ? t(`${base}.labels.disabled`) : undefined} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {activeStage < 0 && (
          <div className="mt-4 rounded-lg dark:rounded-none border border-dashed border-slate-300 dark:border-tactical-border px-4 py-8 text-center font-sans text-xs text-slate-400 dark:text-tactical-label">
            {t(`${base}.labels.idle`)}
          </div>
        )}
      </Panel>

      {result && (
        <>
          <Panel title={t(`${base}.labels.retrieved`)} accent="amber">
            <div className="space-y-2">
              {result.chunks.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 320, damping: 26 }}
                  className="flex items-center gap-3 rounded-md dark:rounded-none border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
                >
                  <span className="font-sans text-xs text-slate-700 dark:text-tactical-text w-16">{t(`${base}.labels.chunk`)} {c.id}</span>
                  <SegmentBar value={c.score * 100} max={100} color={c.relevant ? 'green' : 'amber'} />
                  <span className="font-mono text-[11px] text-slate-500 dark:text-tactical-dim tabular-nums w-20 text-right">{t(`${base}.labels.score`)} {c.score}</span>
                </motion.div>
              ))}
            </div>
          </Panel>

          <Panel title={t(`${base}.stages.generate`)} accent="green">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <AnimatedMetric value={result.recall} suffix="%" label={t(`${base}.metrics.recall`)} color={result.recall > 70 ? 'green' : 'amber'} />
              <AnimatedMetric value={result.latency} suffix="ms" label={t(`${base}.metrics.latency`)} color={result.latency > 600 ? 'red' : 'default'} />
              <AnimatedMetric value={result.cost} decimals={2} suffix="¢" label={t(`${base}.metrics.cost`)} color="cyan" />
              <AnimatedMetric value={result.context} label={t(`${base}.metrics.context`)} color={result.context > 3000 ? 'red' : 'default'} />
              <AnimatedMetric value={result.quality} suffix="%" label={t(`${base}.metrics.quality`)} color={result.quality > 70 ? 'green' : 'amber'} />
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
