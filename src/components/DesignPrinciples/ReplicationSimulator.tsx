import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Server {
  id: string;
  name: string;
  role: 'primary' | 'secondary';
  status: 'online' | 'degraded' | 'offline';
  load: number;
  replicationLag: number;
  region: string;
}

interface Transaction {
  id: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  server: string;
  type: 'write' | 'read';
  data: string;
}

interface SimulationConfig {
  writeRate: number;
  readRate: number;
  replicationMode: 'sync' | 'async';
  autoFailover: boolean;
  networkLatency: number;
}

export default function ReplicationSimulator() {
  const [servers, setServers] = useState<Server[]>([
    {
      id: 'srv1',
      name: 'Servidor Principal',
      role: 'primary',
      status: 'online',
      load: 0,
      replicationLag: 0,
      region: 'São Paulo'
    },
    {
      id: 'srv2',
      name: 'Réplica 1',
      role: 'secondary',
      status: 'online',
      load: 0,
      replicationLag: 0,
      region: 'Rio de Janeiro'
    },
    {
      id: 'srv3',
      name: 'Réplica 2',
      role: 'secondary',
      status: 'online',
      load: 0,
      replicationLag: 0,
      region: 'Brasília'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    avgReplicationLag: 0
  });

  const [config, setConfig] = useState<SimulationConfig>({
    writeRate: 1,
    readRate: 2,
    replicationMode: 'sync',
    autoFailover: true,
    networkLatency: 50
  });

  const writeInterval = useRef<number>();
  const readInterval = useRef<number>();
  const updateInterval = useRef<number>();

  const getOnlineServers = () => servers.filter(s => s.status === 'online');
  const getPrimaryServer = () => servers.find(s => s.role === 'primary');
  const getSecondaryServers = () => servers.filter(s => s.role === 'secondary' && s.status === 'online');

  const processTransaction = (transaction: Transaction): Transaction => {
    const server = servers.find(s => s.id === transaction.server);
    if (!server || server.status === 'offline') {
      return { ...transaction, status: 'failed' as const };
    }

    if (transaction.type === 'write' && config.replicationMode === 'sync') {
      const secondaries = getSecondaryServers();
      if (secondaries.length === 0) {
        return { ...transaction, status: 'failed' as const };
      }
    }

    return { ...transaction, status: 'completed' as const };
  };

  const generateTransaction = (type: 'read' | 'write') => {
    const primary = getPrimaryServer();
    const secondaries = getSecondaryServers();

    if (type === 'write' && !primary) return;
    if (type === 'read' && getOnlineServers().length === 0) return;

    const targetServer = type === 'write' 
      ? primary 
      : secondaries[Math.floor(Math.random() * secondaries.length)] || primary;

    if (!targetServer) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending',
      server: targetServer.id,
      type,
      data: type === 'write' ? `Data ${Date.now()}` : ''
    };

    setTransactions(prev => [...prev.slice(-9), newTransaction]);
    setServers(prev => prev.map(s => 
      s.id === targetServer.id ? { ...s, load: s.load + 1 } : s
    ));

    const processingTime = config.networkLatency * (1 + Math.random() * 0.5);
    
    setTimeout(() => {
      const processed = processTransaction(newTransaction);
      setTransactions(prev => prev.map(t => 
        t.id === newTransaction.id ? processed : t
      ));
      
      setServers(prev => prev.map(s => {
        if (s.id === targetServer.id) {
          return { ...s, load: Math.max(0, s.load - 1) };
        }
        if (processed.status === 'completed' && processed.type === 'write' && s.role === 'secondary') {
          const lag = config.replicationMode === 'sync' ? 0 : Math.random() * 100;
          return { ...s, replicationLag: lag };
        }
        return s;
      }));

      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        successful: prev.successful + (processed.status === 'completed' ? 1 : 0),
        failed: prev.failed + (processed.status === 'failed' ? 1 : 0),
        avgReplicationLag: getSecondaryServers().reduce((acc, s) => acc + s.replicationLag, 0) / 
          Math.max(1, getSecondaryServers().length)
      }));
    }, processingTime);
  };

  const simulateServerFailure = (serverId: string) => {
    setServers(prev => prev.map(s => 
      s.id === serverId ? { ...s, status: 'offline', load: 0 } : s
    ));

    if (config.autoFailover) {
      const failed = servers.find(s => s.id === serverId);
      if (failed?.role === 'primary') {
        const newPrimary = getSecondaryServers()[0];
        if (newPrimary) {
          setTimeout(() => {
            setServers(prev => prev.map(s => 
              s.id === newPrimary.id 
                ? { ...s, role: 'primary' as const } 
                : s
            ));
          }, 1000);
        }
      }
    }
  };

  const recoverServer = (serverId: string) => {
    setServers(prev => prev.map(s => 
      s.id === serverId 
        ? { ...s, status: 'online', load: 0, replicationLag: 100 } 
        : s
    ));
  };

  useEffect(() => {
    if (isRunning) {
      writeInterval.current = window.setInterval(
        () => generateTransaction('write'), 
        1000 / config.writeRate
      );
      
      readInterval.current = window.setInterval(
        () => generateTransaction('read'), 
        1000 / config.readRate
      );

      updateInterval.current = window.setInterval(() => {
        setServers(prev => prev.map(s => {
          if (s.status === 'online' && s.role === 'secondary') {
            return {
              ...s,
              replicationLag: Math.max(
                0,
                s.replicationLag - (config.replicationMode === 'sync' ? 10 : 5)
              )
            };
          }
          return s;
        }));
      }, 100);
    }

    return () => {
      if (writeInterval.current) window.clearInterval(writeInterval.current);
      if (readInterval.current) window.clearInterval(readInterval.current);
      if (updateInterval.current) window.clearInterval(updateInterval.current);
    };
  }, [isRunning, config.writeRate, config.readRate, config.replicationMode]);

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">Simulador de Replicação e Failover</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Explore como a replicação de dados e o failover automático funcionam em um 
            ambiente distribuído.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Taxa de Escrita (por segundo)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={config.writeRate}
                onChange={e => setConfig(prev => ({ 
                  ...prev, 
                  writeRate: Number(e.target.value) 
                }))}
                className="w-full"
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">{config.writeRate}/s</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Taxa de Leitura (por segundo)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={config.readRate}
                onChange={e => setConfig(prev => ({ 
                  ...prev, 
                  readRate: Number(e.target.value) 
                }))}
                className="w-full"
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">{config.readRate}/s</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Modo de Replicação
              </label>
              <select
                value={config.replicationMode}
                onChange={e => setConfig(prev => ({ 
                  ...prev, 
                  replicationMode: e.target.value as 'sync' | 'async' 
                }))}
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-sm"
              >
                <option value="sync">Síncrona</option>
                <option value="async">Assíncrona</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.autoFailover}
                onChange={e => setConfig(prev => ({ 
                  ...prev, 
                  autoFailover: e.target.checked 
                }))}
                className="rounded"
              />
              <label className="text-sm font-medium">Auto Failover</label>
            </div>
            <div>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                } transition-colors`}
              >
                {isRunning ? 'Parar Simulação' : 'Iniciar Simulação'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {servers.map((server) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{server.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{server.region}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      server.status === 'online'
                        ? 'bg-green-500/20 text-green-400'
                        : server.status === 'degraded'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {server.status === 'online'
                      ? 'Online'
                      : server.status === 'degraded'
                      ? 'Degradado'
                      : 'Offline'}
                  </span>
                  <span className={`text-sm mt-1 ${
                    server.role === 'primary' 
                      ? 'text-brand-600 dark:text-brand-400' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {server.role === 'primary' ? 'Primário' : 'Secundário'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carga</span>
                    <span>{server.load} transações</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, server.load * 20)}%` }}
                      className={`h-full rounded-full ${
                        server.load > 4
                          ? 'bg-red-500'
                          : server.load > 2
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                {server.role === 'secondary' && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lag de Replicação</span>
                      <span>{Math.round(server.replicationLag)}ms</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, server.replicationLag)}%` }}
                        className={`h-full rounded-full ${
                          server.replicationLag > 80
                            ? 'bg-red-500'
                            : server.replicationLag > 40
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  {server.status !== 'offline' ? (
                    <button
                      onClick={() => simulateServerFailure(server.id)}
                      className="flex-1 py-1 px-3 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                      Simular Falha
                    </button>
                  ) : (
                    <button
                      onClick={() => recoverServer(server.id)}
                      className="flex-1 py-1 px-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      Recuperar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats and Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total de Transações</span>
                  <span>{stats.total}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taxa de Sucesso</span>
                  <span>
                    {stats.total > 0 
                      ? `${Math.round((stats.successful / stats.total) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${stats.total > 0 
                        ? Math.round((stats.successful / stats.total) * 100)
                        : 0}%` 
                    }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Lag Médio de Replicação</span>
                  <span>{Math.round(stats.avgReplicationLag)}ms</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.avgReplicationLag)}%` }}
                    className={`h-full rounded-full ${
                      stats.avgReplicationLag > 80
                        ? 'bg-red-500'
                        : stats.avgReplicationLag > 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Transações Recentes</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {transactions.slice(-5).map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-500'
                          : transaction.status === 'failed'
                          ? 'bg-red-500'
                          : transaction.status === 'processing'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`} />
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {servers.find(s => s.id === transaction.server)?.name}
                        </span>
                        <span className={`text-xs ${
                          transaction.type === 'write' 
                            ? 'text-brand-600 dark:text-brand-400' 
                            : 'text-green-400'
                        }`}>
                          {transaction.type === 'write' ? 'Escrita' : 'Leitura'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {transaction.status === 'completed'
                        ? 'Concluída'
                        : transaction.status === 'failed'
                        ? 'Falha'
                        : transaction.status === 'processing'
                        ? 'Processando'
                        : 'Pendente'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 