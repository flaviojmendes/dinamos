import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Region {
  id: string;
  name: string;
  location: string;
  status: 'healthy' | 'degraded' | 'failed';
  latency: number;
  data: { [key: string]: { value: any, timestamp: number, replicatedAt?: number } };
  role: 'primary' | 'replica';
}

interface Operation {
  id: string;
  type: 'write' | 'read';
  key: string;
  value?: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sourceRegion: string;
  replicationStatus: { [key: string]: 'pending' | 'completed' | 'failed' };
}

interface SimulatorConfig {
  replicationType: 'sync' | 'async' | 'semi-sync';
  networkLatency: number;
  failureRate: number;
  replicaCount: number;
}

const regionStatusVariant = (status: Region['status']) => {
  if (status === 'healthy') return 'active' as const;
  if (status === 'degraded') return 'in-progress' as const;
  return 'classified' as const;
};

const operationStatusVariant = (status: Operation['status']) => {
  if (status === 'completed') return 'completed' as const;
  if (status === 'failed') return 'classified' as const;
  if (status === 'processing') return 'in-progress' as const;
  return 'pending' as const;
};

export default function ReplicacaoSimulator() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([
    {
      id: 'us-east',
      name: 'US East',
      location: 'Virginia',
      status: 'healthy',
      latency: 50,
      data: {},
      role: 'primary'
    },
    {
      id: 'us-west',
      name: 'US West',
      location: 'California',
      status: 'healthy',
      latency: 100,
      data: {},
      role: 'replica'
    },
    {
      id: 'eu-central',
      name: 'EU Central',
      location: 'Frankfurt',
      status: 'healthy',
      latency: 150,
      data: {},
      role: 'replica'
    },
    {
      id: 'ap-east',
      name: 'Asia Pacific',
      location: 'Tokyo',
      status: 'healthy',
      latency: 200,
      data: {},
      role: 'replica'
    }
  ]);

  const [operations, setOperations] = useState<Operation[]>([]);
  const [config, setConfig] = useState<SimulatorConfig>({
    replicationType: 'async',
    networkLatency: 200,
    failureRate: 0.1,
    replicaCount: 3
  });

  const [dataKey, setDataKey] = useState('');
  const [dataValue, setDataValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const operationIdCounter = useRef(1);
  const simulationInterval = useRef<number>();

  const addOperation = async (type: 'write' | 'read') => {
    const primaryRegion = regions.find(r => r.role === 'primary' && r.status === 'healthy');
    if (!primaryRegion) return;

    const replicationStatus: { [key: string]: 'pending' | 'completed' | 'failed' } = {};
    regions.forEach(region => {
      if (region.role === 'replica') {
        replicationStatus[region.id] = 'pending';
      }
    });

    const newOperation: Operation = {
      id: `op-${operationIdCounter.current++}`,
      type,
      key: dataKey,
      value: type === 'write' ? dataValue : undefined,
      timestamp: Date.now(),
      status: 'pending',
      sourceRegion: primaryRegion.id,
      replicationStatus
    };

    setOperations(prev => [...prev.slice(-9), newOperation]);
    await processOperation(newOperation);
  };

  const processOperation = async (operation: Operation) => {
    const primaryRegion = regions.find(r => r.role === 'primary' && r.status === 'healthy');
    if (!primaryRegion) return;

    setOperations(prev => prev.map(op =>
      op.id === operation.id ? { ...op, status: 'processing' } : op
    ));

    if (operation.type === 'write') {
      const writeTimestamp = Date.now();
      const updatedRegions = [...regions];
      const primaryIndex = updatedRegions.findIndex(r => r.id === primaryRegion.id);

      updatedRegions[primaryIndex] = {
        ...primaryRegion,
        data: {
          ...primaryRegion.data,
          [operation.key]: {
            value: operation.value,
            timestamp: writeTimestamp,
            replicatedAt: writeTimestamp
          }
        }
      };

      const replicaRegions = updatedRegions.filter(r => r.role === 'replica' && r.status === 'healthy');
      
      if (config.replicationType === 'sync') {
        await Promise.all(replicaRegions.map(async (region) => {
          const shouldFail = Math.random() < config.failureRate;
          await new Promise(resolve => setTimeout(resolve, region.latency + config.networkLatency));
          
          if (!shouldFail) {
            const index = updatedRegions.findIndex(r => r.id === region.id);
            updatedRegions[index] = {
              ...region,
              data: {
                ...region.data,
                [operation.key]: {
                  value: operation.value,
                  timestamp: writeTimestamp,
                  replicatedAt: Date.now()
                }
              }
            };
            setOperations(prev => prev.map(op =>
              op.id === operation.id
                ? { ...op, replicationStatus: { ...op.replicationStatus, [region.id]: 'completed' } }
                : op
            ));
          } else {
            setOperations(prev => prev.map(op =>
              op.id === operation.id
                ? { ...op, replicationStatus: { ...op.replicationStatus, [region.id]: 'failed' } }
                : op
            ));
          }
        }));
      } else if (config.replicationType === 'semi-sync') {
        const firstReplica = replicaRegions[0];
        if (firstReplica) {
          await new Promise(resolve => setTimeout(resolve, firstReplica.latency + config.networkLatency));
          const shouldFail = Math.random() < config.failureRate;
          
          if (!shouldFail) {
            const index = updatedRegions.findIndex(r => r.id === firstReplica.id);
            updatedRegions[index] = {
              ...firstReplica,
              data: {
                ...firstReplica.data,
                [operation.key]: {
                  value: operation.value,
                  timestamp: writeTimestamp,
                  replicatedAt: Date.now()
                }
              }
            };
            setOperations(prev => prev.map(op =>
              op.id === operation.id
                ? { ...op, replicationStatus: { ...op.replicationStatus, [firstReplica.id]: 'completed' } }
                : op
            ));
          }
        }

        replicaRegions.slice(1).forEach(region => {
          setTimeout(() => {
            const shouldFail = Math.random() < config.failureRate;
            if (!shouldFail) {
              setRegions(prev => prev.map(r =>
                r.id === region.id
                  ? {
                      ...r,
                      data: {
                        ...r.data,
                        [operation.key]: {
                          value: operation.value,
                          timestamp: writeTimestamp,
                          replicatedAt: Date.now()
                        }
                      }
                    }
                  : r
              ));
              setOperations(prev => prev.map(op =>
                op.id === operation.id
                  ? { ...op, replicationStatus: { ...op.replicationStatus, [region.id]: 'completed' } }
                  : op
              ));
            } else {
              setOperations(prev => prev.map(op =>
                op.id === operation.id
                  ? { ...op, replicationStatus: { ...op.replicationStatus, [region.id]: 'failed' } }
                  : op
              ));
            }
          }, region.latency + config.networkLatency);
        });
      } else {
        replicaRegions.forEach(region => {
          setTimeout(() => {
            const shouldFail = Math.random() < config.failureRate;
            if (!shouldFail) {
              setRegions(prev => prev.map(r =>
                r.id === region.id
                  ? {
                      ...r,
                      data: {
                        ...r.data,
                        [operation.key]: {
                          value: operation.value,
                          timestamp: writeTimestamp,
                          replicatedAt: Date.now()
                        }
                      }
                    }
                  : r
              ));
              setOperations(prev => prev.map(op =>
                op.id === operation.id
                  ? { ...op, replicationStatus: { ...op.replicationStatus, [region.id]: 'completed' } }
                  : op
              ));
            } else {
              setOperations(prev => prev.map(op =>
                op.id === operation.id
                  ? { ...op, replicationStatus: { ...op.replicationStatus, [region.id]: 'failed' } }
                  : op
              ));
            }
          }, region.latency + config.networkLatency);
        });
      }

      setRegions(updatedRegions);
    }

    setOperations(prev => prev.map(op =>
      op.id === operation.id ? { ...op, status: 'completed' } : op
    ));
  };

  const toggleRegionStatus = (regionId: string) => {
    setRegions(prev => prev.map(region => {
      if (region.id === regionId) {
        return { ...region, status: region.status === 'healthy' ? 'failed' : 'healthy' };
      }
      return region;
    }));
  };

  useEffect(() => {
    if (isRunning) {
      simulationInterval.current = window.setInterval(() => {
        const randomKey = `key-${Math.floor(Math.random() * 100)}`;
        const randomValue = `value-${Math.floor(Math.random() * 100)}`;
        setDataKey(randomKey);
        setDataValue(randomValue);
        addOperation('write');
      }, 3000);
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
          [ {t('simulators_extra.replication.title')} ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('simulators_extra.replication.intro')}
        </p>
      </div>

      <div className="tactical-panel border-l-2 border-l-signal-cyan p-5">
        <h3 className="label-mono text-signal-cyan mb-3">{t('simulators_extra.replication.how_title')}</h3>
        <ol className="list-decimal list-inside space-y-1.5 font-mono text-sm text-slate-600 dark:text-tactical-dim">
          {(t('simulators_extra.replication.steps', { returnObjects: true }) as string[]).map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ol>
      </div>

      <Panel title={t('simulators_extra.replication.config_title')} accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block label-mono mb-2">{t('simulators_extra.replication.replication_type')}</label>
            <select
              value={config.replicationType}
              onChange={(e) => setConfig(prev => ({ ...prev, replicationType: e.target.value as 'sync' | 'async' | 'semi-sync' }))}
              className={`w-full ${inputClass}`}
            >
              <option value="sync">{t('simulators_extra.replication.sync')}</option>
              <option value="semi-sync">{t('simulators_extra.replication.semi_sync')}</option>
              <option value="async">{t('simulators_extra.replication.async')}</option>
            </select>
          </div>
          <div>
            <label className="block label-mono mb-2">{t('simulators_extra.replication.network_latency_ms')}</label>
            <input type="range" min="0" max="2000" value={config.networkLatency} onChange={(e) => setConfig(prev => ({ ...prev, networkLatency: Number(e.target.value) }))} className="w-full" />
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.networkLatency}ms</span>
          </div>
          <div>
            <label className="block label-mono mb-2">{t('simulators_extra.replication.failure_rate')}</label>
            <input type="range" min="0" max="0.5" step="0.05" value={config.failureRate} onChange={(e) => setConfig(prev => ({ ...prev, failureRate: Number(e.target.value) }))} className="w-full" />
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{Math.round(config.failureRate * 100)}%</span>
          </div>
          <div>
            <label className="block label-mono mb-2">{t('simulators_extra.replication.replica_count')}</label>
            <input type="range" min="1" max="3" value={config.replicaCount} onChange={(e) => setConfig(prev => ({ ...prev, replicaCount: Number(e.target.value) }))} className="w-full" />
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.replicaCount} {t('simulators_extra.replication.keys_label', { count: config.replicaCount }).split(' ')[1]}</span>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators_extra.replication.manual_title')} accent="amber">
        <div className="flex flex-wrap gap-4 items-center">
          <input type="text" value={dataKey} onChange={(e) => setDataKey(e.target.value)} placeholder={t('simulators_extra.replication.key_placeholder') || 'Key'} className={inputClass} />
          <input type="text" value={dataValue} onChange={(e) => setDataValue(e.target.value)} placeholder={t('simulators_extra.replication.value_placeholder') || 'Value'} className={inputClass} />
          <TacticalButton variant="primary" onClick={() => addOperation('write')}>
            {t('simulators_extra.replication.write')}
          </TacticalButton>
          <TacticalButton variant={isRunning ? 'danger' : 'secondary'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? t('simulators_extra.replication.stop') : t('simulators_extra.replication.start')}
          </TacticalButton>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.slice(0, config.replicaCount + 1).map((region) => (
          <motion.div key={region.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Panel title={region.name} accent={region.role === 'primary' ? 'green' : 'cyan'}>
              <div className="flex justify-between items-center mb-4">
                <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{region.location}</p>
                <StatusBadge
                  variant={regionStatusVariant(region.status)}
                  label={t(`simulators.vertical_scaling.statuses.${region.status}`)}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>{t('simulators_extra.replication.statuses.role')}</span>
                    <span className={region.role === 'primary' ? 'text-signal-green' : 'text-slate-500 dark:text-tactical-label'}>
                      {region.role}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>{t('simulators_extra.replication.statuses.latency')}</span>
                    <span>{region.latency + config.networkLatency}ms</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                    <motion.div className="h-full bg-signal-cyan" initial={{ width: 0 }} animate={{ width: `${((region.latency + config.networkLatency) / 2000) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>{t('simulators_extra.replication.statuses.data')}</span>
                    <span>{t('simulators_extra.replication.statuses.keys_label', { count: Object.keys(region.data).length })}</span>
                  </div>
                  <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-2 max-h-24 overflow-auto font-mono text-xs">
                    {Object.entries(region.data).map(([key, data]) => (
                      <div key={key} className="flex flex-col mb-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-tactical-label">{key}:</span>
                          <span className="text-slate-900 dark:text-tactical-text">{String(data.value)}</span>
                        </div>
                        {data.replicatedAt && data.replicatedAt !== data.timestamp && (
                          <div className="text-[11px] text-slate-400 dark:text-tactical-label">
                            {t('simulators_extra.replication.statuses.replicated_after', { seconds: Math.round((data.replicatedAt - data.timestamp) / 1000) })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <TacticalButton
                  size="sm"
                  variant={region.status === 'healthy' ? 'danger' : 'secondary'}
                  className="w-full"
                  onClick={() => toggleRegionStatus(region.id)}
                >
                  {region.status === 'healthy' ? t('simulators_extra.replication.simulate_failure') : t('simulators_extra.replication.recover')}
                </TacticalButton>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <Panel title={t('simulators_extra.replication.recent_ops')} accent="green">
        <div className="space-y-2">
          <AnimatePresence>
            {operations.slice(-5).map((operation) => (
              <motion.div key={operation.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusBadge variant={operationStatusVariant(operation.status)} label={operation.status} />
                    <span className="font-mono text-xs text-slate-900 dark:text-tactical-text truncate">
                      {t(`simulators_extra.replication.${operation.type === 'write' ? 'write_label' : 'read_label'}`)} - {t('simulators_extra.replication.key_placeholder')}: {operation.key}
                      {operation.value && ` ${t('simulators_extra.replication.value_placeholder')}: ${operation.value}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {Object.entries(operation.replicationStatus).map(([regionId, status]) => (
                      <StatusBadge
                        key={regionId}
                        variant={status === 'completed' ? 'completed' : status === 'failed' ? 'classified' : 'pending'}
                        dot
                        label={regions.find(r => r.id === regionId)?.name?.slice(0, 2).toUpperCase()}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}
