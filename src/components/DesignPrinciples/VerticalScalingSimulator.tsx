import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton } from '../tactical';

interface ServerTier {
  name: string;
  cpu: number;
  memory: number;
  storage: number;
  cost: number;
  maxRequests: number;
}

interface Request {
  id: number;
  timestamp: number;
  processingTime: number;
  status: 'queued' | 'processing' | 'completed' | 'rejected';
}

const SERVER_TIERS: ServerTier[] = [
  {
    name: 'Básico',
    cpu: 2,
    memory: 4,
    storage: 100,
    cost: 50,
    maxRequests: 4
  },
  {
    name: 'Padrão',
    cpu: 4,
    memory: 8,
    storage: 200,
    cost: 100,
    maxRequests: 8
  },
  {
    name: 'Premium',
    cpu: 8,
    memory: 16,
    storage: 400,
    cost: 200,
    maxRequests: 16
  },
  {
    name: 'Empresarial',
    cpu: 16,
    memory: 32,
    storage: 800,
    cost: 400,
    maxRequests: 32
  }
];

export default function VerticalScalingSimulator() {
  const { t } = useTranslation();
  const [currentTier, setCurrentTier] = useState<number>(0);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [requestRate, setRequestRate] = useState(1);
  const [stats, setStats] = useState({
    processed: 0,
    rejected: 0,
    totalCost: 0,
    uptime: 0
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const uptimeInterval = useRef<number>();
  const requestInterval = useRef<number>();
  const cleanupInterval = useRef<number>();

  const currentServer = SERVER_TIERS[currentTier];
  const processingRequests = requests.filter(r => r.status === 'processing').length;
  const queuedRequests = requests.filter(r => r.status === 'queued').length;
  const serverLoad = (processingRequests / currentServer.maxRequests) * 100;

  useEffect(() => {
    if (!isRunning) return;

    requestInterval.current = window.setInterval(() => {
      const newRequest: Request = {
        id: Date.now(),
        timestamp: Date.now(),
        processingTime: 2000 + Math.random() * 2000,
        status: 'queued'
      };

      setRequests(prev => {
        const filtered = prev.filter(r => 
          r.status !== 'completed' && 
          r.status !== 'rejected' || 
          Date.now() - r.timestamp < 10000
        );

        return [...filtered, newRequest];
      });
    }, 1000 / requestRate);

    const processInterval = window.setInterval(() => {
      setRequests(prev => {
        const newRequests = [...prev];
        const processing = newRequests.filter(r => r.status === 'processing').length;
        const available = currentServer.maxRequests - processing;

        if (available > 0) {
          const queued = newRequests.filter(r => r.status === 'queued');
          for (let i = 0; i < Math.min(available, queued.length); i++) {
            const request = queued[i];
            request.status = 'processing';
            
            setTimeout(() => {
              setRequests(current => 
                current.map(r => 
                  r.id === request.id 
                    ? { ...r, status: 'completed' }
                    : r
                )
              );
              setStats(s => ({ ...s, processed: s.processed + 1 }));
            }, request.processingTime);
          }
        }

        newRequests.forEach(request => {
          if (
            request.status === 'queued' && 
            Date.now() - request.timestamp > 5000
          ) {
            request.status = 'rejected';
            setStats(s => ({ ...s, rejected: s.rejected + 1 }));
          }
        });

        return newRequests;
      });
    }, 100);

    uptimeInterval.current = window.setInterval(() => {
      setStats(s => ({
        ...s,
        uptime: s.uptime + 1,
        totalCost: s.totalCost + (currentServer.cost / (30 * 24 * 60 * 60))
      }));
    }, 1000);

    cleanupInterval.current = window.setInterval(() => {
      setRequests(prev => 
        prev.filter(r => Date.now() - r.timestamp < 10000)
      );
    }, 1000);

    return () => {
      if (requestInterval.current) window.clearInterval(requestInterval.current);
      if (uptimeInterval.current) window.clearInterval(uptimeInterval.current);
      if (cleanupInterval.current) window.clearInterval(cleanupInterval.current);
      window.clearInterval(processInterval);
    };
  }, [isRunning, requestRate, currentServer.maxRequests, currentServer.cost]);

  const handleUpgrade = () => {
    if (currentTier < SERVER_TIERS.length - 1) {
      setCurrentTier(prev => prev + 1);
      setShowUpgradeModal(false);
    }
  };

  const handleDowngrade = () => {
    if (currentTier > 0) {
      const newTier = currentTier - 1;
      const newServer = SERVER_TIERS[newTier];
      const processing = requests.filter(r => r.status === 'processing').length;

      if (processing <= newServer.maxRequests) {
        setCurrentTier(newTier);
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm font-sans font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t('simulators.vertical_scaling.title')}
        </span>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {t('simulators.vertical_scaling.intro')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Panel
            title={currentServer.name}
            accent="cyan"
            action={
              <div className="flex gap-2">
                <TacticalButton
                  size="sm"
                  variant="ghost"
                  onClick={handleDowngrade}
                  disabled={currentTier === 0}
                >
                  {t('simulators.vertical_scaling.buttons.downgrade')}
                </TacticalButton>
                <TacticalButton
                  size="sm"
                  variant="primary"
                  onClick={() => setShowUpgradeModal(true)}
                  disabled={currentTier === SERVER_TIERS.length - 1}
                >
                  {t('simulators.vertical_scaling.buttons.upgrade')}
                </TacticalButton>
              </div>
            }
          >
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mb-6">
              {t('simulators.vertical_scaling.level_of_total', { current: currentTier + 1, total: SERVER_TIERS.length })}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between font-sans text-xs mb-1 text-slate-600 dark:text-slate-400">
                  <span>{t('simulators.vertical_scaling.resources.cpu', { cores: currentServer.cpu })}</span>
                  <span className="font-mono">{Math.round(serverLoad)}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                  <motion.div
                    className="h-full bg-signal-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${serverLoad}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-sans text-xs mb-1 text-slate-600 dark:text-slate-400">
                  <span>{t('simulators.vertical_scaling.resources.memory', { gb: currentServer.memory })}</span>
                  <span className="font-mono">{Math.round(serverLoad)}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                  <motion.div
                    className="h-full bg-signal-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${serverLoad}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-sans text-xs mb-1 text-slate-600 dark:text-slate-400">
                  <span>{t('simulators.vertical_scaling.resources.storage', { gb: currentServer.storage })}</span>
                  <span className="font-mono">{Math.round(serverLoad)}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                  <motion.div
                    className="h-full bg-signal-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${serverLoad}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
              <h3 className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100 mb-3">{t('simulators.vertical_scaling.queue_title')}</h3>
              <div className="flex gap-2 flex-wrap">
                {requests
                  .filter(r => r.status === 'queued' || r.status === 'processing')
                  .slice(-12)
                  .map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`w-4 h-4 ${
                        request.status === 'processing' 
                          ? 'bg-signal-green animate-pulse' 
                          : 'bg-signal-amber'
                      }`}
                    />
                  ))}
              </div>
            </div>
          </Panel>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Panel title={t('simulators.vertical_scaling.controls_title')} accent="amber" className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {t('simulators.vertical_scaling.request_rate', { rate: requestRate })}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={requestRate}
                  onChange={(e) => setRequestRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <TacticalButton
                variant={isRunning ? 'danger' : 'primary'}
                className="w-full"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? t('simulators.vertical_scaling.buttons.stop') : t('simulators.vertical_scaling.buttons.start')}
              </TacticalButton>
            </div>
          </Panel>

          <Panel title={t('simulators.vertical_scaling.stats_title')} accent="green">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">{stats.processed}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.vertical_scaling.processed')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red">{stats.rejected}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.vertical_scaling.rejected')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">
                  {stats.processed + stats.rejected === 0 
                    ? '0' 
                    : Math.round((stats.processed / (stats.processed + stats.rejected)) * 100)
                  }%
                </div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.vertical_scaling.success_rate')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-slate-900 dark:text-slate-100">{Math.floor(stats.uptime)}s</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.vertical_scaling.uptime')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber">R${stats.totalCost.toFixed(4)}</div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.vertical_scaling.total_cost')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-3">
                <div className={`font-mono text-3xl font-bold tabular-nums leading-none ${
                  serverLoad > 90 
                    ? 'text-signal-red' 
                    : serverLoad > 70 
                    ? 'text-signal-amber' 
                    : 'text-signal-green'
                }`}>
                  {Math.round(serverLoad)}%
                </div>
                <div className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 mt-2">{t('simulators.vertical_scaling.current_load')}</div>
              </div>
            </div>
          </Panel>
        </motion.div>
      </div>

      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 w-full max-w-lg"
            >
              <h2 className="font-sans text-lg font-semibold tracking-tight mb-4 text-slate-900 dark:text-slate-100">{t('simulators.vertical_scaling.upgrade_modal.title')}</h2>
              <p className="font-sans text-sm text-slate-600 dark:text-slate-400 mb-6">
                {t('simulators.vertical_scaling.upgrade_modal.text', { tier: SERVER_TIERS[currentTier + 1]?.name, cost: SERVER_TIERS[currentTier + 1]?.cost })}
              </p>
              <div className="flex justify-end gap-3">
                <TacticalButton variant="ghost" onClick={() => setShowUpgradeModal(false)}>
                  {t('simulators.vertical_scaling.upgrade_modal.cancel')}
                </TacticalButton>
                <TacticalButton variant="primary" onClick={handleUpgrade}>
                  {t('simulators.vertical_scaling.upgrade_modal.confirm')}
                </TacticalButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
