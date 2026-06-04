import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Server {
  id: string;
  name: string;
  region: string;
  status: 'healthy' | 'degraded' | 'failed';
  load: number;
  latency: number;
  data: { [key: string]: { value: any, timestamp: number, replicatedAt?: number } };
  role: 'primary' | 'secondary';
}

interface Request {
  id: string;
  type: 'read' | 'write';
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data?: any;
  serverId: string;
  latency: number;
}

interface SimulationConfig {
  consistencyMode: 'strong' | 'eventual';
  networkLatency: number;
  failureRate: number;
  autoFailover: boolean;
}

const serverStatusVariant = (status: Server['status']) => {
  if (status === 'healthy') return 'active' as const;
  if (status === 'degraded') return 'in-progress' as const;
  return 'classified' as const;
};

const requestStatusVariant = (status: Request['status']) => {
  if (status === 'completed') return 'completed' as const;
  if (status === 'failed') return 'classified' as const;
  if (status === 'processing') return 'in-progress' as const;
  return 'pending' as const;
};

export default function ScalabilitySimulator() {
  const { t } = useTranslation();
  const [servers, setServers] = useState<Server[]>([
    {
      id: 'server1',
      name: 'Server 1',
      region: 'US East',
      status: 'healthy',
      load: 0,
      latency: 50,
      data: {},
      role: 'primary'
    },
    {
      id: 'server2',
      name: 'Server 2',
      region: 'US West',
      status: 'healthy',
      load: 0,
      latency: 100,
      data: {},
      role: 'secondary'
    },
    {
      id: 'server3',
      name: 'Server 3',
      region: 'Europe',
      status: 'healthy',
      load: 0,
      latency: 150,
      data: {},
      role: 'secondary'
    }
  ]);

  const [requests, setRequests] = useState<Request[]>([]);
  const [config, setConfig] = useState<SimulationConfig>({
    consistencyMode: 'eventual',
    networkLatency: 500,
    failureRate: 0.1,
    autoFailover: true
  });
  const [isRunning, setIsRunning] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<'read' | 'write'>('write');
  const [dataValue, setDataValue] = useState('');
  const [dataKey, setDataKey] = useState('');
  const requestIdCounter = useRef(1);
  const simulationInterval = useRef<number>();

  const addRequest = (type: 'read' | 'write') => {
    const primaryServer = servers.find(s => s.role === 'primary' && s.status === 'healthy');
    if (!primaryServer && type === 'write') {
      if (config.autoFailover) {
        promoteSecondaryToPrimary();
      } else {
        return;
      }
    }

    const targetServer = type === 'write' 
      ? servers.find(s => s.role === 'primary' && s.status === 'healthy')
      : servers.find(s => s.status === 'healthy');

    if (!targetServer) return;

    const newRequest: Request = {
      id: `req-${requestIdCounter.current++}`,
      type,
      timestamp: Date.now(),
      status: 'pending',
      serverId: targetServer.id,
      latency: targetServer.latency + config.networkLatency,
      data: type === 'write' ? { key: dataKey, value: dataValue } : { key: dataKey }
    };

    setRequests(prev => [...prev.slice(-9), newRequest]);
    processRequest(newRequest);
  };

  const processRequest = async (request: Request) => {
    const delay = request.latency;
    const shouldFail = Math.random() < config.failureRate;

    setRequests(prev => prev.map(r =>
      r.id === request.id ? { ...r, status: 'processing' } : r
    ));

    await new Promise(resolve => setTimeout(resolve, delay));

    if (shouldFail) {
      setRequests(prev => prev.map(r =>
        r.id === request.id ? { ...r, status: 'failed' } : r
      ));
      return;
    }

    if (request.type === 'write') {
      const updatedServers = [...servers];
      const primaryServer = updatedServers.find(s => s.role === 'primary' && s.status === 'healthy');
      
      if (primaryServer && request.data) {
        const writeTimestamp = Date.now();
        primaryServer.data[request.data.key] = {
          value: request.data.value,
          timestamp: writeTimestamp,
          replicatedAt: writeTimestamp
        };
        
        if (config.consistencyMode === 'strong') {
          updatedServers.forEach(server => {
            if (server.role === 'secondary' && server.status === 'healthy') {
              server.data[request.data.key] = {
                value: request.data.value,
                timestamp: writeTimestamp,
                replicatedAt: writeTimestamp
              };
            }
          });
        } else {
          setTimeout(() => {
            const replicationTimestamp = Date.now();
            setServers(prev => prev.map(server => 
              server.role === 'secondary' && server.status === 'healthy'
                ? {
                    ...server,
                    data: {
                      ...server.data,
                      [request.data.key]: {
                        value: request.data.value,
                        timestamp: writeTimestamp,
                        replicatedAt: replicationTimestamp
                      }
                    }
                  }
                : server
            ));
          }, config.networkLatency);
        }
        
        setServers(updatedServers);
      }
    }

    setRequests(prev => prev.map(r =>
      r.id === request.id ? { ...r, status: 'completed' } : r
    ));
  };

  const promoteSecondaryToPrimary = () => {
    const healthySecondary = servers.find(s => s.role === 'secondary' && s.status === 'healthy');
    if (healthySecondary) {
      setServers(prev => prev.map(server => 
        server.id === healthySecondary.id
          ? { ...server, role: 'primary' }
          : server
      ));
    }
  };

  const toggleServerStatus = (serverId: string) => {
    setServers(prev => prev.map(server => {
      if (server.id === serverId) {
        const newStatus = server.status === 'healthy' ? 'failed' : 'healthy';
        if (newStatus === 'failed' && server.role === 'primary' && config.autoFailover) {
          promoteSecondaryToPrimary();
        }
        return { ...server, status: newStatus };
      }
      return server;
    }));
  };

  useEffect(() => {
    if (isRunning) {
      simulationInterval.current = window.setInterval(() => {
        addRequest(Math.random() > 0.7 ? 'write' : 'read');
      }, 2000);
    }
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [isRunning, config]);

  const inputClass = 'bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('simulators.scalability.title')} ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('simulators.scalability.intro')}
        </p>
      </div>

      <div className="tactical-panel border-l-2 border-l-signal-cyan p-5">
        <h3 className="label-mono text-signal-cyan mb-3">{t('simulators.scalability.how_title')}</h3>
        <ol className="list-decimal list-inside space-y-1.5 font-mono text-sm text-slate-600 dark:text-tactical-dim">
          {(t('simulators.scalability.how_steps', { returnObjects: true }) as string[]).map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ol>
      </div>

      <Panel title={t('simulators.scalability.config_title')} accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block label-mono mb-2">{t('simulators.scalability.consistency_mode')}</label>
            <select
              value={config.consistencyMode}
              onChange={(e) => setConfig(prev => ({ ...prev, consistencyMode: e.target.value as 'strong' | 'eventual' }))}
              className={`w-full ${inputClass}`}
            >
              <option value="strong">{t('simulators.scalability.strong')}</option>
              <option value="eventual">{t('simulators.scalability.eventual')}</option>
            </select>
          </div>
          <div>
            <label className="block label-mono mb-2">{t('simulators.scalability.network_latency_ms')}</label>
            <input
              type="range"
              min="0"
              max="2000"
              value={config.networkLatency}
              onChange={(e) => setConfig(prev => ({ ...prev, networkLatency: Number(e.target.value) }))}
              className="w-full"
            />
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.networkLatency}ms</span>
          </div>
          <div>
            <label className="block label-mono mb-2">{t('simulators.scalability.failure_rate')}</label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={config.failureRate}
              onChange={(e) => setConfig(prev => ({ ...prev, failureRate: Number(e.target.value) }))}
              className="w-full"
            />
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{Math.round(config.failureRate * 100)}%</span>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.autoFailover}
                onChange={(e) => setConfig(prev => ({ ...prev, autoFailover: e.target.checked }))}
                className="mr-2"
              />
              <span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('simulators.scalability.auto_failover')}</span>
            </label>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.scalability.manual_title')} accent="amber">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value as 'read' | 'write')}
            className={inputClass}
          >
            <option value="read">{t('simulators.scalability.read')}</option>
            <option value="write">{t('simulators.scalability.write')}</option>
          </select>
          <input
            type="text"
            value={dataKey}
            onChange={(e) => setDataKey(e.target.value)}
            placeholder={t('simulators.scalability.key_placeholder') || 'Key'}
            className={inputClass}
          />
          {selectedOperation === 'write' && (
            <input
              type="text"
              value={dataValue}
              onChange={(e) => setDataValue(e.target.value)}
              placeholder={t('simulators.scalability.value_placeholder') || 'Value'}
              className={inputClass}
            />
          )}
          <TacticalButton variant="primary" onClick={() => addRequest(selectedOperation)}>
            {t('simulators.scalability.execute')}
          </TacticalButton>
          <TacticalButton
            variant={isRunning ? 'danger' : 'secondary'}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? t('simulators.scalability.stop') : t('simulators.scalability.start')}
          </TacticalButton>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servers.map((server) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Panel title={server.name} accent={server.role === 'primary' ? 'green' : 'cyan'}>
              <div className="flex justify-between items-center mb-4">
                <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{server.region}</p>
                <StatusBadge
                  variant={serverStatusVariant(server.status)}
                  label={t(`simulators.vertical_scaling.statuses.${server.status}`)}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>{t('simulators.scalability.role')}</span>
                    <span className={server.role === 'primary' ? 'text-signal-green' : 'text-slate-500 dark:text-tactical-label'}>
                      {server.role}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>{t('simulators.scalability.latency')}</span>
                    <span>{server.latency}ms</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                    <motion.div
                      className="h-full bg-signal-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${(server.latency / 500) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>{t('simulators.scalability.data')}</span>
                    <span>{t('simulators.scalability.keys_label', { count: Object.keys(server.data).length })}</span>
                  </div>
                  <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-2 max-h-24 overflow-auto font-mono text-xs">
                    {Object.entries(server.data).map(([key, data]) => (
                      <div key={key} className="flex flex-col mb-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-tactical-label">{key}:</span>
                          <span className="text-slate-900 dark:text-tactical-text">{String(data.value)}</span>
                        </div>
                        {data.replicatedAt && data.replicatedAt !== data.timestamp && (
                          <div className="text-[11px] text-slate-400 dark:text-tactical-label">
                            {t('simulators.scalability.replicated_after', { seconds: Math.round((data.replicatedAt - data.timestamp) / 1000) })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <TacticalButton
                  size="sm"
                  variant={server.status === 'healthy' ? 'danger' : 'secondary'}
                  className="w-full"
                  onClick={() => toggleServerStatus(server.id)}
                >
                  {server.status === 'healthy' ? t('simulators.scalability.simulate_failure') : t('simulators.scalability.recover')}
                </TacticalButton>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <Panel title={t('simulators.scalability.recent_requests')} accent="green">
        <div className="space-y-2">
          <AnimatePresence>
            {requests.slice(-5).map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusBadge variant={requestStatusVariant(request.status)} label={request.status} />
                  <span className="font-mono text-xs text-slate-900 dark:text-tactical-text truncate">
                    {t(`simulators.scalability.${request.type === 'write' ? 'write_label' : 'read_label'}`)} - 
                    {request.data?.key && ` ${t('simulators.scalability.key_placeholder')}: ${request.data.key}`}
                    {request.data?.value && ` ${t('simulators.scalability.value_placeholder')}: ${request.data.value}`}
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim shrink-0 ml-4">
                  {request.latency}ms
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}
