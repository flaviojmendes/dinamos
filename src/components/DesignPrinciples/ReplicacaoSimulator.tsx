import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('simulators_extra.replication.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {t('simulators_extra.replication.intro')}
          </p>

          <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-white">{t('simulators_extra.replication.how_title')}</p>
            <ol className="list-decimal list-inside space-y-2">
              {(t('simulators_extra.replication.steps', { returnObjects: true }) as string[]).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('simulators_extra.replication.config_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators_extra.replication.replication_type')}</label>
              <select
                value={config.replicationType}
                onChange={(e) => setConfig(prev => ({ ...prev, replicationType: e.target.value as 'sync' | 'async' | 'semi-sync' }))}
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2"
              >
                <option value="sync">{t('simulators_extra.replication.sync')}</option>
                <option value="semi-sync">{t('simulators_extra.replication.semi_sync')}</option>
                <option value="async">{t('simulators_extra.replication.async')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators_extra.replication.network_latency_ms')}</label>
              <input type="range" min="0" max="2000" value={config.networkLatency} onChange={(e) => setConfig(prev => ({ ...prev, networkLatency: Number(e.target.value) }))} className="w-full" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{config.networkLatency}ms</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators_extra.replication.failure_rate')}</label>
              <input type="range" min="0" max="0.5" step="0.05" value={config.failureRate} onChange={(e) => setConfig(prev => ({ ...prev, failureRate: Number(e.target.value) }))} className="w-full" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{Math.round(config.failureRate * 100)}%</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators_extra.replication.replica_count')}</label>
              <input type="range" min="1" max="3" value={config.replicaCount} onChange={(e) => setConfig(prev => ({ ...prev, replicaCount: Number(e.target.value) }))} className="w-full" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{config.replicaCount} {t('simulators_extra.replication.keys_label', { count: config.replicaCount }).split(' ')[1]}</span>
            </div>
          </div>
        </div>

        {/* Manual Operation Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('simulators_extra.replication.manual_title')}</h2>
          <div className="flex flex-wrap gap-4">
            <input type="text" value={dataKey} onChange={(e) => setDataKey(e.target.value)} placeholder={t('simulators_extra.replication.key_placeholder') || 'Key'} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2" />
            <input type="text" value={dataValue} onChange={(e) => setDataValue(e.target.value)} placeholder={t('simulators_extra.replication.value_placeholder') || 'Value'} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2" />
            <button onClick={() => addOperation('write')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
              {t('simulators_extra.replication.write')}
            </button>
            <button onClick={() => setIsRunning(!isRunning)} className={`px-4 py-2 rounded-lg ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {isRunning ? t('simulators_extra.replication.stop') : t('simulators_extra.replication.start')}
            </button>
          </div>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {regions.slice(0, config.replicaCount + 1).map((region) => (
            <motion.div key={region.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">{region.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{region.location}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${region.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {t(`simulators.vertical_scaling.statuses.${region.status}`)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('simulators_extra.replication.statuses.role')}</span>
                    <span className={region.role === 'primary' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}>
                      {region.role}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify_between text-sm mb-1">
                    <span>{t('simulators_extra.replication.statuses.latency')}</span>
                    <span>{region.latency + config.networkLatency}ms</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${((region.latency + config.networkLatency) / 2000) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('simulators_extra.replication.statuses.data')}</span>
                    <span>{t('simulators_extra.replication.statuses.keys_label', { count: Object.keys(region.data).length })}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2 max-h-24 overflow-auto text-sm">
                    {Object.entries(region.data).map(([key, data]) => (
                      <div key={key} className="flex flex-col mb-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">{key}:</span>
                          <span>{String(data.value)}</span>
                        </div>
                        {data.replicatedAt && data.replicatedAt !== data.timestamp && (
                          <div className="text-xs text-zinc-500">
                            {t('simulators_extra.replication.statuses.replicated_after', { seconds: Math.round((data.replicatedAt - data.timestamp) / 1000) })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => toggleRegionStatus(region.id)} className={`w-full py-1 px-3 rounded-lg text-sm ${region.status === 'healthy' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                  {region.status === 'healthy' ? t('simulators_extra.replication.simulate_failure') : t('simulators_extra.replication.recover')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Operations */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{t('simulators_extra.replication.recent_ops')}</h2>
          <div className="space-y-2">
            <AnimatePresence>
              {operations.slice(-5).map((operation) => (
                <motion.div key={operation.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${operation.status === 'completed' ? 'bg-green-500' : operation.status === 'failed' ? 'bg-red-500' : operation.status === 'processing' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      <span className="text-sm">
                        {t(`simulators_extra.replication.${operation.type === 'write' ? 'write_label' : 'read_label'}`)} - {t('simulators_extra.replication.key_placeholder')}: {operation.key}
                        {operation.value && ` ${t('simulators_extra.replication.value_placeholder')}: ${operation.value}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {Object.entries(operation.replicationStatus).map(([regionId, status]) => (
                        <span key={regionId} className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} title={`${regions.find(r => r.id === regionId)?.name}: ${status}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 