import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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
  const [requestRate, setRequestRate] = useState(1); // requests per second
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

    // Generate new requests
    requestInterval.current = window.setInterval(() => {
      const newRequest: Request = {
        id: Date.now(),
        timestamp: Date.now(),
        processingTime: 2000 + Math.random() * 2000, // 2-4 seconds
        status: 'queued'
      };

      setRequests(prev => {
        // Remove old completed/rejected requests if there are too many
        const filtered = prev.filter(r => 
          r.status !== 'completed' && 
          r.status !== 'rejected' || 
          Date.now() - r.timestamp < 10000
        );

        return [...filtered, newRequest];
      });
    }, 1000 / requestRate);

    // Process requests
    const processInterval = window.setInterval(() => {
      setRequests(prev => {
        const newRequests = [...prev];
        const processing = newRequests.filter(r => r.status === 'processing').length;
        const available = currentServer.maxRequests - processing;

        if (available > 0) {
          // Find queued requests and start processing them
          const queued = newRequests.filter(r => r.status === 'queued');
          for (let i = 0; i < Math.min(available, queued.length); i++) {
            const request = queued[i];
            request.status = 'processing';
            
            // Schedule completion
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

        // Reject requests that have been queued too long (5 seconds)
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

    // Update uptime and cost
    uptimeInterval.current = window.setInterval(() => {
      setStats(s => ({
        ...s,
        uptime: s.uptime + 1,
        totalCost: s.totalCost + (currentServer.cost / (30 * 24 * 60 * 60))
      }));
    }, 1000);

    // Cleanup old requests
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
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      {/* Header */}
      <motion.div 
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-4">{t('simulators.vertical_scaling.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {t('simulators.vertical_scaling.intro')}
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Server Info */}
        <motion.div 
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{currentServer.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('simulators.vertical_scaling.level_of_total', { current: currentTier + 1, total: SERVER_TIERS.length })}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDowngrade}
                disabled={currentTier === 0}
                className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors text-sm"
              >
                {t('simulators.vertical_scaling.buttons.downgrade')}
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                disabled={currentTier === SERVER_TIERS.length - 1}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors text-sm"
              >
                {t('simulators.vertical_scaling.buttons.upgrade')}
              </button>
            </div>
          </div>

          {/* Resource Bars */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.resources.cpu', { cores: currentServer.cpu })}</span>
                <span className="text-slate-500 dark:text-slate-400">{Math.round(serverLoad)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${serverLoad}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.resources.memory', { gb: currentServer.memory })}</span>
                <span className="text-slate-500 dark:text-slate-400">{Math.round(serverLoad)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${serverLoad}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.resources.storage', { gb: currentServer.storage })}</span>
                <span className="text-slate-500 dark:text-slate-400">{Math.round(serverLoad)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${serverLoad}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Request Queue Visualization */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">{t('simulators.vertical_scaling.queue_title')}</h3>
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
                    className={`w-4 h-4 rounded-full ${
                      request.status === 'processing' 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-yellow-500'
                    }`}
                  />
                ))}
            </div>
          </div>
        </motion.div>

        {/* Controls & Stats */}
        <motion.div 
          className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Controls */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{t('simulators.vertical_scaling.controls_title')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">
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
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-2 rounded-lg ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } transition-colors`}
              >
                {isRunning ? t('simulators.vertical_scaling.buttons.stop') : t('simulators.vertical_scaling.buttons.start')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('simulators.vertical_scaling.stats_title')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.processed')}</span>
                <span className="text-green-400">{stats.processed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.rejected')}</span>
                <span className="text-red-400">{stats.rejected}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.success_rate')}</span>
                <span className="text-brand-600 dark:text-brand-400">
                  {stats.processed + stats.rejected === 0 
                    ? '0' 
                    : Math.round((stats.processed / (stats.processed + stats.rejected)) * 100)
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.uptime')}</span>
                <span>{Math.floor(stats.uptime)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.total_cost')}</span>
                <span className="text-yellow-400">R${stats.totalCost.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t('simulators.vertical_scaling.current_load')}</span>
                <span className={`${
                  serverLoad > 90 
                    ? 'text-red-400' 
                    : serverLoad > 70 
                    ? 'text-yellow-400' 
                    : 'text-green-400'
                }`}>
                  {Math.round(serverLoad)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-xl font-semibold mb-4">{t('simulators.vertical_scaling.upgrade_modal.title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {t('simulators.vertical_scaling.upgrade_modal.text', { tier: SERVER_TIERS[currentTier + 1]?.name, cost: SERVER_TIERS[currentTier + 1]?.cost })}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
                >
                  {t('simulators.vertical_scaling.upgrade_modal.cancel')}
                </button>
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {t('simulators.vertical_scaling.upgrade_modal.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 