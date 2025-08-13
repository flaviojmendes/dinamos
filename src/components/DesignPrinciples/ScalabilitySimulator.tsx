import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t('simulators.scalability.title')}</h1>
          <p className="text-zinc-400 mb-6">
            {t('simulators.scalability.intro')}
          </p>
          
          <div className="bg-zinc-900/50 rounded-xl p-6 space-y-3 text-sm text-zinc-300">
            <p className="font-semibold text-white">{t('simulators.scalability.how_title')}</p>
            <ol className="list-decimal list-inside space-y-2">
              {(t('simulators.scalability.how_steps', { returnObjects: true }) as string[]).map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('simulators.scalability.config_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators.scalability.consistency_mode')}</label>
              <select
                value={config.consistencyMode}
                onChange={(e) => setConfig(prev => ({ ...prev, consistencyMode: e.target.value as 'strong' | 'eventual' }))}
                className="w-full bg-zinc-800 rounded-lg p-2"
              >
                <option value="strong">{t('simulators.scalability.strong')}</option>
                <option value="eventual">{t('simulators.scalability.eventual')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators.scalability.network_latency_ms')}</label>
              <input
                type="range"
                min="0"
                max="2000"
                value={config.networkLatency}
                onChange={(e) => setConfig(prev => ({ ...prev, networkLatency: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-zinc-400">{config.networkLatency}ms</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('simulators.scalability.failure_rate')}</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={config.failureRate}
                onChange={(e) => setConfig(prev => ({ ...prev, failureRate: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-zinc-400">{Math.round(config.failureRate * 100)}%</span>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.autoFailover}
                  onChange={(e) => setConfig(prev => ({ ...prev, autoFailover: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium">{t('simulators.scalability.auto_failover')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Manual Operation Panel */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('simulators.scalability.manual_title')}</h2>
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value as 'read' | 'write')}
              className="bg-zinc-800 rounded-lg p-2"
            >
              <option value="read">{t('simulators.scalability.read')}</option>
              <option value="write">{t('simulators.scalability.write')}</option>
            </select>
            <input
              type="text"
              value={dataKey}
              onChange={(e) => setDataKey(e.target.value)}
              placeholder={t('simulators.scalability.key_placeholder') || 'Key'}
              className="bg-zinc-800 rounded-lg p-2"
            />
            {selectedOperation === 'write' && (
              <input
                type="text"
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
                placeholder={t('simulators.scalability.value_placeholder') || 'Value'}
                className="bg-zinc-800 rounded-lg p-2"
              />
            )}
            <button
              onClick={() => addRequest(selectedOperation)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {t('simulators.scalability.execute')}
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-lg ${
                isRunning 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? t('simulators.scalability.stop') : t('simulators.scalability.start')}
            </button>
          </div>
        </div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {servers.map((server) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">{server.name}</h3>
                  <p className="text-sm text-zinc-400">{server.region}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    server.status === 'healthy'
                      ? 'bg-green-500/20 text-green-400'
                      : server.status === 'degraded'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {t(`simulators.vertical_scaling.statuses.${server.status}`)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('simulators.scalability.role')}</span>
                    <span className={server.role === 'primary' ? 'text-blue-400' : 'text-zinc-400'}>
                      {server.role}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('simulators.scalability.latency')}</span>
                    <span>{server.latency}ms</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(server.latency / 500) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('simulators.scalability.data')}</span>
                    <span>{t('simulators.scalability.keys_label', { count: Object.keys(server.data).length })}</span>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-2 max-h-24 overflow-auto text-sm">
                    {Object.entries(server.data).map(([key, data]) => (
                      <div key={key} className="flex flex-col mb-2">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">{key}:</span>
                          <span>{String(data.value)}</span>
                        </div>
                        {data.replicatedAt && data.replicatedAt !== data.timestamp && (
                          <div className="text-xs text-zinc-500">
                            {t('simulators.scalability.replicated_after', { seconds: Math.round((data.replicatedAt - data.timestamp) / 1000) })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => toggleServerStatus(server.id)}
                  className={`w-full py-1 px-3 rounded-lg text-sm ${
                    server.status === 'healthy'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {server.status === 'healthy' ? t('simulators.scalability.simulate_failure') : t('simulators.scalability.recover')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Requests */}
        <div className="bg-zinc-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{t('simulators.scalability.recent_requests')}</h2>
          <div className="space-y-2">
            <AnimatePresence>
              {requests.slice(-5).map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between bg-zinc-800 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-2 h-2 rounded-full ${
                      request.status === 'completed'
                        ? 'bg-green-500'
                        : request.status === 'failed'
                        ? 'bg-red-500'
                        : request.status === 'processing'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`} />
                    <span className="text-sm">
                      {t(`simulators.scalability.${request.type === 'write' ? 'write_label' : 'read_label'}`)} - 
                      {request.data?.key && ` ${t('simulators.scalability.key_placeholder')}: ${request.data.key}`}
                      {request.data?.value && ` ${t('simulators.scalability.value_placeholder')}: ${request.data.value}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-zinc-400">
                      {request.latency}ms
                    </span>
                    <span className="text-sm text-zinc-400">
                      {request.status}
                    </span>
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