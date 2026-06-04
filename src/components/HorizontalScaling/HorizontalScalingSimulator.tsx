import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

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

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';
  const numberInputClass = 'w-16 bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-2 py-1 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

  const requestStatusVariant = (status: Request['status']) => {
    switch (status) {
      case 'completed': return 'completed' as const;
      case 'failed': return 'classified' as const;
      default: return 'in-progress' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('simulators.horizontal_scaling.title')} ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('simulators.horizontal_scaling.intro')}
        </p>
      </div>

      <Panel title={t('simulators.horizontal_scaling.controls.request_rate')} accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="label-mono text-slate-500 dark:text-tactical-label">{t('simulators.horizontal_scaling.controls.request_rate')}</label>
            <input type="range" min="1" max="10" value={config.requestRate} onChange={e => setConfig({ ...config, requestRate: Number(e.target.value) })} className={rangeClass} />
            <div className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.requestRate} req/s</div>
          </div>
          <div className="space-y-2">
            <label className="label-mono text-slate-500 dark:text-tactical-label">{t('simulators.horizontal_scaling.controls.processing_time_ms')}</label>
            <input type="range" min="500" max="5000" step="500" value={config.processingTime} onChange={e => setConfig({ ...config, processingTime: Number(e.target.value) })} className={rangeClass} />
            <div className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.processingTime}ms</div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={config.autoScale} onChange={e => setConfig({ ...config, autoScale: e.target.checked })} />
              <span className="label-mono text-slate-500 dark:text-tactical-label">{t('simulators.horizontal_scaling.controls.auto_scaling')}</span>
            </label>
            {config.autoScale && (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{t('simulators.horizontal_scaling.controls.scale_up')}</span>
                  <input type="number" min="0" max="100" value={config.scaleUpThreshold} onChange={e => setConfig({ ...config, scaleUpThreshold: Number(e.target.value) })} className={numberInputClass} />
                  <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{t('simulators.horizontal_scaling.controls.percent')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{t('simulators.horizontal_scaling.controls.scale_down')}</span>
                  <input type="number" min="0" max="100" value={config.scaleDownThreshold} onChange={e => setConfig({ ...config, scaleDownThreshold: Number(e.target.value) })} className={numberInputClass} />
                  <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{t('simulators.horizontal_scaling.controls.percent')}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <TacticalButton size="sm" variant={isRunning ? 'danger' : 'primary'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? t('simulators.horizontal_scaling.buttons.stop') : t('simulators.horizontal_scaling.buttons.start')}
          </TacticalButton>
          {!config.autoScale && (
            <>
              <TacticalButton size="sm" variant="secondary" onClick={addServer} disabled={servers.length >= config.maxServers}>
                {t('simulators.horizontal_scaling.buttons.add_server')}
              </TacticalButton>
              <TacticalButton size="sm" variant="ghost" onClick={removeServer} disabled={servers.length <= 1}>
                {t('simulators.horizontal_scaling.buttons.remove_server')}
              </TacticalButton>
            </>
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map(server => (
          <motion.div key={server.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <Panel
              title={t('simulators.horizontal_scaling.server_card.server_label', { id: server.id })}
              accent="green"
              action={
                <StatusBadge
                  variant={server.status === 'active' ? 'active' : 'offline'}
                  label={server.status === 'active' ? t('simulators.horizontal_scaling.server_card.active') : t('simulators.horizontal_scaling.server_card.inactive')}
                />
              }
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-500 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.horizontal_scaling.server_card.load')}</span>
                    <span className="text-signal-cyan">{server.load}%</span>
                  </div>
                  <div className="h-2 border border-slate-200 dark:border-tactical-border bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                    <motion.div className="h-full bg-signal-cyan/70" initial={{ width: 0 }} animate={{ width: `${server.load}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                  {t('simulators.horizontal_scaling.server_card.processed_requests', { count: server.requests })}
                </div>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <Panel title={t('simulators.horizontal_scaling.requests.recent')} accent="amber">
        <div className="space-y-2">
          {requests.slice().reverse().map(request => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 font-mono text-sm border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
            >
              <span className="text-slate-500 dark:text-tactical-dim">
                {new Date(request.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-slate-900 dark:text-tactical-text">{t('simulators.horizontal_scaling.requests.server_label', { id: request.server })}</span>
              <StatusBadge
                variant={requestStatusVariant(request.status)}
                label={
                  request.status === 'completed' ? t('simulators.horizontal_scaling.requests.status_completed') :
                  request.status === 'failed' ? t('simulators.horizontal_scaling.requests.status_failed') :
                  t('simulators.horizontal_scaling.requests.status_processing')
                }
              />
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
