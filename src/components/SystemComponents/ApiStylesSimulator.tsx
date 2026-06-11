import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

type Style = 'rest' | 'graphql' | 'grpc';
const TOTAL_USER_FIELDS = 12;

export default function ApiStylesSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.api_styles';

  const [style, setStyle] = useState<Style>('rest');
  const [needsOrders, setNeedsOrders] = useState(true);
  const [fieldsNeeded, setFieldsNeeded] = useState(3);

  const stats = useMemo(() => {
    const bytesPerJsonField = 40;
    const ordersBytesJson = needsOrders ? 3 * 6 * bytesPerJsonField : 0;
    if (style === 'rest') {
      const roundTrips = needsOrders ? 2 : 1;
      const payload = TOTAL_USER_FIELDS * bytesPerJsonField + ordersBytesJson;
      const used = fieldsNeeded * bytesPerJsonField + (needsOrders ? 3 * bytesPerJsonField : 0);
      const overFetch = Math.round((1 - used / payload) * 100);
      return { roundTrips, payload, overFetch, schema: false };
    }
    if (style === 'graphql') {
      const payload = fieldsNeeded * bytesPerJsonField + (needsOrders ? 3 * bytesPerJsonField : 0);
      return { roundTrips: 1, payload, overFetch: 0, schema: true };
    }
    const payload = Math.round((fieldsNeeded * bytesPerJsonField + (needsOrders ? 3 * bytesPerJsonField : 0)) / 3);
    return { roundTrips: 1, payload, overFetch: 0, schema: true };
  }, [style, needsOrders, fieldsNeeded]);

  // Cells the server actually sends back: REST sends all 12; GraphQL/gRPC send only what's asked.
  const returnedFields = style === 'rest' ? TOTAL_USER_FIELDS : fieldsNeeded;
  const endpoints =
    style === 'rest'
      ? needsOrders
        ? ['GET /users/:id', 'GET /users/:id/orders']
        : ['GET /users/:id']
      : style === 'graphql'
        ? ['POST /graphql']
        : ['rpc GetUserCard()'];

  const narration = t(`${base}.narration.${style}`, {
    used: fieldsNeeded,
    over: stats.overFetch,
    rt: stats.roundTrips,
  });

  return (
    <div className="space-y-6">
      <Panel title={t(`${base}.title`)} accent="cyan">
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {(['rest', 'graphql', 'grpc'] as Style[]).map((s) => (
            <TacticalButton key={s} size="sm" variant={style === s ? 'secondary' : 'ghost'} onClick={() => setStyle(s)}>
              {t(`${base}.styles.${s}`)}
            </TacticalButton>
          ))}
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.fields`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="1" max="12" value={fieldsNeeded} onChange={(e) => setFieldsNeeded(Number(e.target.value))} className="h-2 flex-1 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
              <span className="w-12 text-right font-mono text-sm tabular-nums text-signal-cyan">{fieldsNeeded}/12</span>
            </div>
          </div>
          <div className="flex items-end">
            <TacticalButton size="sm" variant={needsOrders ? 'secondary' : 'ghost'} onClick={() => setNeedsOrders((v) => !v)}>
              {needsOrders ? t(`${base}.controls.with_orders`) : t(`${base}.controls.no_orders`)}
            </TacticalButton>
          </div>
        </div>

        <div className="mb-5">
          <NarrationBar tone={stats.overFetch > 30 ? 'active' : 'success'} stepKey={`${style}-${fieldsNeeded}-${needsOrders}`}>
            {narration}
          </NarrationBar>
        </div>

        {/* Request endpoints + round trips */}
        <div className="mb-4 space-y-2">
          {endpoints.map((ep, i) => (
            <div key={ep} className="flex items-center gap-2">
              <span className="w-14 label-mono">{t(`${base}.client`)}</span>
              <motion.div className="h-0.5 flex-1 bg-signal-cyan/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.2, duration: 0.4 }} style={{ transformOrigin: 'left' }} />
              <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-tactical-raised dark:text-tactical-dim">{ep}</span>
              <motion.div className="h-0.5 flex-1 bg-signal-green/60" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.2 + 0.2, duration: 0.4 }} style={{ transformOrigin: 'right' }} />
              <span className="w-14 text-right label-mono">{t(`${base}.server`)}</span>
            </div>
          ))}
        </div>

        {/* Response payload: returned vs used vs over-fetched */}
        <div className="rounded-lg border border-slate-200 p-3 dark:border-tactical-border">
          <div className="mb-2 flex items-center justify-between">
            <span className="label-mono">{t(`${base}.payload_label`)}</span>
            {style === 'grpc' && (
              <span className="rounded bg-brand-500/15 px-2 py-0.5 font-mono text-[10px] text-brand-600 dark:text-brand-400">{t(`${base}.binary`)}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: returnedFields }).map((_, i) => {
              const used = i < fieldsNeeded;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`h-6 ${style === 'grpc' ? 'w-4' : 'w-7'} rounded ${
                    used
                      ? 'bg-signal-green/70'
                      : 'border border-signal-amber/40 bg-signal-amber/10'
                  }`}
                  title={used ? t(`${base}.used`) : t(`${base}.over`)}
                />
              );
            })}
            {needsOrders &&
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={`o${i}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`h-6 ${style === 'grpc' ? 'w-4' : 'w-7'} rounded bg-signal-cyan/60`} title="order" />
              ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-signal-green/70" />{t(`${base}.used`)}</span>
            {style === 'rest' && <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-signal-amber/40 bg-signal-amber/10" />{t(`${base}.over`)}</span>}
            {needsOrders && <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-signal-cyan/60" />{t(`${base}.sinks_orders`)}</span>}
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={stats.roundTrips} label={t(`${base}.metrics.round_trips`)} color={stats.roundTrips > 1 ? 'amber' : 'green'} />
          <AnimatedMetric value={stats.payload} suffix=" B" label={t(`${base}.metrics.payload`)} color="cyan" />
          <AnimatedMetric value={stats.overFetch} suffix="%" label={t(`${base}.metrics.over_fetch`)} color={stats.overFetch > 30 ? 'red' : 'green'} />
          <AnimatedMetric value={stats.schema ? 1 : 0} format={() => (stats.schema ? 'YES' : 'NO')} label={t(`${base}.metrics.schema`)} color="default" />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint.${style}`)}</p>
      </Panel>
    </div>
  );
}
