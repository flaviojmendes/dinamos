import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Server {
  id: number;
  load: number;
  status: 'active' | 'inactive';
  requests: number;
}

interface Request {
  id: number;
  timestamp: number;
  server: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface SimulationConfig {
  requestRate: number;
  maxServers: number;
  autoScale: boolean;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  processingTime: number;
}

export default function HorizontalScalingSimulator() {
  const { t } = useTranslation();
  const [servers, setServers] = useState<Server[]>([
    { id: 1, load: 0, status: 'active', requests: 0 }
  ]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [config, setConfig] = useState<SimulationConfig>({
    requestRate: 2,
    maxServers: 5,
    autoScale: true,
    scaleUpThreshold: 80,
    scaleDownThreshold: 20,
    processingTime: 2000
  });

  const addServer = () => {
    if (servers.length < config.maxServers) {
      setServers([...servers, {
        id: servers.length + 1,
        load: 0,
        status: 'active',
        requests: 0
      }]);
    }
  };

  const removeServer = () => {
    if (servers.length > 1) {
      setServers(servers.slice(0, -1));
    }
  };

  const distributeRequest = () => {
    const availableServers = servers.filter(s => s.status === 'active');
    if (availableServers.length === 0) return null;
    const targetServer = availableServers.reduce((prev, curr) => 
      prev.load < curr.load ? prev : curr
    );
    return targetServer;
  };

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = window.setInterval(() => {
        const server = distributeRequest();
        if (server) {
          const newRequest: Request = {
            id: Date.now(),
            timestamp: Date.now(),
            server: server.id,
            status: 'pending'
          };

          setRequests(prev => [...prev.slice(-9), newRequest]);
          
          setServers(prev => prev.map(s => 
            s.id === server.id 
              ? { ...s, load: Math.min(100, s.load + 20), requests: s.requests + 1 }
              : s
          ));

          setTimeout(() => {
            setRequests(prev => prev.map(r => 
              r.id === newRequest.id ? { ...r, status: 'completed' } : r
            ));
            
            setServers(prev => prev.map(s => 
              s.id === server.id 
                ? { ...s, load: Math.max(0, s.load - 20) }
                : s
            ));
          }, config.processingTime);
        }
      }, 1000 / config.requestRate);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, servers, config]);

  useEffect(() => {
    if (!config.autoScale || !isRunning) return;

    const averageLoad = servers.reduce((sum, server) => sum + server.load, 0) / servers.length;

    if (averageLoad > config.scaleUpThreshold) {
      addServer();
    } else if (averageLoad < config.scaleDownThreshold && servers.length > 1) {
      removeServer();
    }
  }, [servers, config.autoScale, config.scaleUpThreshold, config.scaleDownThreshold]);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('simulators.horizontal_scaling.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-300"
        >
          {t('simulators.horizontal_scaling.intro')}
        </motion.p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.request_rate')}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.requestRate}
              onChange={e => setConfig({ ...config, requestRate: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-slate-500 dark:text-slate-400">{config.requestRate} req/s</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.processing_time_ms')}</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={config.processingTime}
              onChange={e => setConfig({ ...config, processingTime: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-sm text-slate-500 dark:text-slate-400">{config.processingTime}ms</div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.autoScale}
                onChange={e => setConfig({ ...config, autoScale: e.target.checked })}
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.auto_scaling')}</span>
            </label>
            {config.autoScale && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.scale_up')}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.scaleUpThreshold}
                    onChange={e => setConfig({ ...config, scaleUpThreshold: Number(e.target.value) })}
                    className="w-16 bg-slate-100 dark:bg-slate-800 rounded px-2 py-1"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.percent')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.scale_down')}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.scaleDownThreshold}
                    onChange={e => setConfig({ ...config, scaleDownThreshold: Number(e.target.value) })}
                    className="w-16 bg-slate-100 dark:bg-slate-800 rounded px-2 py-1"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.horizontal_scaling.controls.percent')}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isRunning ? t('simulators.horizontal_scaling.buttons.stop') : t('simulators.horizontal_scaling.buttons.start')}
          </button>
          {!config.autoScale && (
            <>
              <button
                onClick={addServer}
                disabled={servers.length >= config.maxServers}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('simulators.horizontal_scaling.buttons.add_server')}
              </button>
              <button
                onClick={removeServer}
                disabled={servers.length <= 1}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('simulators.horizontal_scaling.buttons.remove_server')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Servers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {servers.map(server => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{t('simulators.horizontal_scaling.server_card.server_label', { id: server.id })}</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${
                server.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {server.status === 'active' ? t('simulators.horizontal_scaling.server_card.active') : t('simulators.horizontal_scaling.server_card.inactive')}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <span>{t('simulators.horizontal_scaling.server_card.load')}</span>
                  <span>{server.load}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${server.load}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t('simulators.horizontal_scaling.server_card.processed_requests', { count: server.requests })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Requests */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">{t('simulators.horizontal_scaling.requests.recent')}</h3>
        <div className="space-y-2">
          {requests.slice().reverse().map(request => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-sm"
            >
              <span className="text-slate-500 dark:text-slate-400">
                {new Date(request.timestamp).toLocaleTimeString()}
              </span>
              <span>{t('simulators.horizontal_scaling.requests.server_label', { id: request.server })}</span>
              <span className={`px-2 py-1 rounded-full ${
                request.status === 'completed' 
                  ? 'bg-green-500/20 text-green-400'
                  : request.status === 'failed'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {request.status === 'completed' ? t('simulators.horizontal_scaling.requests.status_completed') : 
                 request.status === 'failed' ? t('simulators.horizontal_scaling.requests.status_failed') : t('simulators.horizontal_scaling.requests.status_processing')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 