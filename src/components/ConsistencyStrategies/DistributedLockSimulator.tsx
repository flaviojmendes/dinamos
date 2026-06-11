import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';

const CLIENTS = ['A', 'B', 'C'];
const LEASE = 6;
const TICK_MS = 500;

interface WriteLog {
  id: number;
  client: string;
  token: number;
  accepted: boolean;
}
type Narr = { tone: 'idle' | 'active' | 'success'; key: string; text: string };

export default function DistributedLockSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.distributed_lock';

  const [holder, setHolder] = useState<number | null>(null);
  const [holderToken, setHolderToken] = useState(0);
  const [lease, setLease] = useState(0);
  const [globalToken, setGlobalToken] = useState(0);
  const [resourceToken, setResourceToken] = useState(0);
  const [stalled, setStalled] = useState(false);
  const [clientTokens, setClientTokens] = useState<number[]>(() => CLIENTS.map(() => 0));
  const [log, setLog] = useState<WriteLog[]>([]);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [demo, setDemo] = useState(false);
  const [narr, setNarr] = useState<Narr>({ tone: 'idle', key: 'idle', text: t(`${base}.narration.idle`) });

  const logId = useRef(1);
  const holderRef = useRef<number | null>(null);
  holderRef.current = holder;
  const globalTokenRef = useRef(0);
  globalTokenRef.current = globalToken;
  const resourceTokenRef = useRef(0);
  resourceTokenRef.current = resourceToken;
  const clientTokensRef = useRef(clientTokens);
  clientTokensRef.current = clientTokens;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const reset = useCallback(() => {
    clearTimers();
    setDemo(false);
    setHolder(null);
    setHolderToken(0);
    setLease(0);
    setGlobalToken(0);
    setResourceToken(0);
    setStalled(false);
    setClientTokens(CLIENTS.map(() => 0));
    setLog([]);
    setAccepted(0);
    setRejected(0);
    setNarr({ tone: 'idle', key: `reset-${Date.now()}`, text: t(`${base}.narration.idle`) });
  }, [t]);

  useEffect(() => {
    if (holder === null || lease <= 0) return;
    const id = setInterval(() => {
      setLease((l) => {
        if (l <= 1) {
          setHolder(null);
          setStalled((wasStalled) => {
            setNarr({ tone: 'active', key: `expire-${Date.now()}`, text: t(wasStalled ? `${base}.narration.expired_stalled` : `${base}.narration.expired`) });
            return false;
          });
          return 0;
        }
        return l - 1;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [holder, lease, t]);

  const acquire = useCallback(
    (client: number) => {
      if (holderRef.current !== null) return;
      const token = globalTokenRef.current + 1;
      setGlobalToken(token);
      setHolder(client);
      setHolderToken(token);
      setLease(LEASE);
      setStalled(false);
      setClientTokens((prev) => prev.map((tk, i) => (i === client ? token : tk)));
      setNarr({ tone: 'active', key: `acq-${client}-${token}`, text: t(`${base}.narration.acquire`, { client: CLIENTS[client], token }) });
    },
    [t],
  );

  const write = useCallback(
    (client: number, token: number) => {
      const rt = resourceTokenRef.current;
      const ok = token >= rt && token > 0;
      if (ok) {
        setResourceToken(token);
        setAccepted((a) => a + 1);
        setNarr({ tone: 'success', key: `w-ok-${Date.now()}`, text: t(`${base}.narration.write_ok`, { client: CLIENTS[client], token, rt }) });
      } else {
        setRejected((r) => r + 1);
        setNarr({ tone: 'active', key: `w-no-${Date.now()}`, text: t(`${base}.narration.fenced`, { client: CLIENTS[client], token, rt }) });
      }
      setLog((prev) => [{ id: logId.current++, client: CLIENTS[client], token, accepted: ok }, ...prev].slice(0, 6));
    },
    [t],
  );

  const stall = useCallback(
    (client: number) => {
      setStalled(true);
      setNarr({ tone: 'active', key: `stall-${Date.now()}`, text: t(`${base}.narration.stall`, { client: CLIENTS[client] }) });
    },
    [t],
  );

  const runDemo = useCallback(() => {
    reset();
    setDemo(true);
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    at(400, () => acquire(0)); // A acquires (token 1)
    at(1400, () => stall(0)); // A stalls; lease keeps ticking
    // lease (6 ticks * 500ms) expires ~ 1400 + 3000; then B acquires
    at(1400 + LEASE * TICK_MS + 400, () => acquire(1)); // B acquires (token 2)
    at(1400 + LEASE * TICK_MS + 1400, () => write(1, 2)); // B writes with token 2 -> accepted
    at(1400 + LEASE * TICK_MS + 2400, () => write(0, 1)); // A wakes, writes stale token 1 -> fenced
    at(1400 + LEASE * TICK_MS + 3000, () => setDemo(false));
  }, [reset, acquire, stall, write]);

  useEffect(() => () => clearTimers(), []);

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="primary" onClick={runDemo} disabled={demo}>{t(`${base}.buttons.demo`)}</TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* Lock status */}
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-tactical-border">
          <span className="label-mono">{t(`${base}.lock`)}</span>
          {holder === null ? (
            <StatusBadge variant="offline" label={t(`${base}.free`)} />
          ) : (
            <StatusBadge variant={stalled ? 'pending' : 'online'} label={`${t(`${base}.held_by`)} ${CLIENTS[holder]} · ${t(`${base}.token`)} ${holderToken}`} />
          )}
          {holder !== null && (
            <div className="flex items-center gap-1">
              {Array.from({ length: LEASE }).map((_, i) => (
                <div key={i} className={`h-3 w-2 rounded-sm ${i < lease ? (stalled ? 'bg-signal-amber' : 'bg-signal-green') : 'bg-slate-200 dark:bg-tactical-border'}`} />
              ))}
            </div>
          )}
          {stalled && <span className="font-mono text-[10px] text-signal-amber">{t(`${base}.stalled_note`)}</span>}
        </div>

        {/* Clients */}
        <div className="grid gap-3 sm:grid-cols-3">
          {CLIENTS.map((c, i) => {
            const isHolder = holder === i;
            const isStale = clientTokens[i] > 0 && clientTokens[i] < resourceToken;
            return (
              <div key={c} className={`rounded-lg border p-3 ${isHolder ? 'border-signal-cyan' : 'border-slate-200 dark:border-tactical-border'}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">{t(`${base}.client`)} {c}</span>
                  {clientTokens[i] > 0 && (
                    <span className={`font-mono text-[10px] ${isStale ? 'text-signal-red' : 'text-signal-cyan'}`}>
                      {t(`${base}.token`)} {clientTokens[i]}{isStale ? ` ${t(`${base}.stale`)}` : ''}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <TacticalButton size="sm" variant="secondary" onClick={() => acquire(i)} disabled={holder !== null || demo}>
                    {t(`${base}.buttons.acquire`)}
                  </TacticalButton>
                  <TacticalButton size="sm" variant="ghost" onClick={() => write(i, clientTokens[i])} disabled={clientTokens[i] === 0 || demo}>
                    {t(`${base}.buttons.write`)}
                  </TacticalButton>
                </div>
                {isHolder && !stalled && (
                  <TacticalButton size="sm" variant="danger" className="mt-2 w-full" onClick={() => stall(i)} disabled={demo}>
                    {t(`${base}.buttons.stall`)}
                  </TacticalButton>
                )}
              </div>
            );
          })}
        </div>

        {/* Write log */}
        <div className="mt-5">
          <div className="label-mono mb-2">{t(`${base}.resource`)} · {t(`${base}.token`)} {resourceToken}</div>
          <div className="space-y-1">
            {log.map((w) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between rounded px-2 py-1 font-mono text-[11px] ${
                  w.accepted ? 'bg-signal-green/10 text-emerald-700 dark:text-signal-green' : 'bg-signal-red/10 text-red-700 dark:text-signal-red'
                }`}
              >
                <span>{t(`${base}.client`)} {w.client} → {t(`${base}.write_token`)} {w.token}</span>
                <span>{w.accepted ? t(`${base}.accepted`) : t(`${base}.fenced`)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={globalToken} label={t(`${base}.metrics.tokens_issued`)} color="cyan" />
          <AnimatedMetric value={accepted} label={t(`${base}.metrics.accepted`)} color="green" />
          <AnimatedMetric value={rejected} label={t(`${base}.metrics.fenced`)} color={rejected > 0 ? 'red' : 'default'} />
          <AnimatedMetric value={resourceToken} label={t(`${base}.metrics.resource_token`)} color="default" />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}
