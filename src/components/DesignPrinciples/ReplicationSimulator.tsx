import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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

const serverStatusVariant = (status: Server['status']) => {
  if (status === 'online') return 'online' as const;
  if (status === 'degraded') return 'in-progress' as const;
  return 'offline' as const;
};

const transactionStatusVariant = (status: Transaction['status']) => {
  if (status === 'completed') return 'completed' as const;
  if (status === 'failed') return 'classified' as const;
  if (status === 'processing') return 'in-progress' as const;
  return 'pending' as const;
};

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

  const inputClass = 'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

  const loadBarColor = (load: number) => {
    if (load > 4) return 'bg-signal-red';
    if (load > 2) return 'bg-signal-amber';
    return 'bg-signal-green';
  };

  const lagBarColor = (lag: number) => {
    if (lag > 80) return 'bg-signal-red';
    if (lag > 40) return 'bg-signal-amber';
    return 'bg-signal-green';
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="label-mono text-signal-cyan mb-2">
            [ Simulador de Replicação e Failover ]
          </div>
          <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
            Explore como a replicação de dados e o failover automático funcionam em um 
            ambiente distribuído.
          </p>
        </motion.div>
      </div>

      <Panel title="Controles" accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <label className="block label-mono mb-2">
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
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.writeRate}/s</span>
          </div>
          <div>
            <label className="block label-mono mb-2">
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
            <span className="font-mono text-sm text-slate-500 dark:text-tactical-dim">{config.readRate}/s</span>
          </div>
          <div>
            <label className="block label-mono mb-2">
              Modo de Replicação
            </label>
            <select
              value={config.replicationMode}
              onChange={e => setConfig(prev => ({ 
                ...prev, 
                replicationMode: e.target.value as 'sync' | 'async' 
              }))}
              className={inputClass}
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
            <label className="font-mono text-sm text-slate-600 dark:text-tactical-dim">Auto Failover</label>
          </div>
          <div className="flex items-end">
            <TacticalButton
              variant={isRunning ? 'danger' : 'primary'}
              className="w-full"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Parar Simulação' : 'Iniciar Simulação'}
            </TacticalButton>
          </div>
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
              <div className="flex justify-between items-start mb-4">
                <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{server.region}</p>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge
                    variant={serverStatusVariant(server.status)}
                    label={
                      server.status === 'online'
                        ? 'Online'
                        : server.status === 'degraded'
                        ? 'Degradado'
                        : 'Offline'
                    }
                  />
                  <span className={`font-mono text-xs ${
                    server.role === 'primary' 
                      ? 'text-signal-green' 
                      : 'text-slate-500 dark:text-tactical-label'
                  }`}>
                    {server.role === 'primary' ? 'Primário' : 'Secundário'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                    <span>Carga</span>
                    <span>{server.load} transações</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, server.load * 20)}%` }}
                      className={`h-full ${loadBarColor(server.load)}`}
                    />
                  </div>
                </div>

                {server.role === 'secondary' && (
                  <div>
                    <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                      <span>Lag de Replicação</span>
                      <span>{Math.round(server.replicationLag)}ms</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, server.replicationLag)}%` }}
                        className={`h-full ${lagBarColor(server.replicationLag)}`}
                      />
                    </div>
                  </div>
                )}

                {server.status !== 'offline' ? (
                  <TacticalButton
                    size="sm"
                    variant="danger"
                    className="w-full"
                    onClick={() => simulateServerFailure(server.id)}
                  >
                    Simular Falha
                  </TacticalButton>
                ) : (
                  <TacticalButton
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => recoverServer(server.id)}
                  >
                    Recuperar
                  </TacticalButton>
                )}
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Panel title="Estatísticas" accent="green">
            <div className="grid grid-cols-1 gap-4">
              <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{stats.total}</div>
                <div className="label-mono mt-2">Total de Transações</div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                  <span>Taxa de Sucesso</span>
                  <span>
                    {stats.total > 0 
                      ? `${Math.round((stats.successful / stats.total) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${stats.total > 0 
                        ? Math.round((stats.successful / stats.total) * 100)
                        : 0}%` 
                    }}
                    className="h-full bg-signal-green"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-xs mb-1 text-slate-600 dark:text-tactical-dim">
                  <span>Lag Médio de Replicação</span>
                  <span>{Math.round(stats.avgReplicationLag)}ms</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, stats.avgReplicationLag)}%` }}
                    className={`h-full ${lagBarColor(stats.avgReplicationLag)}`}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Panel title="Transações Recentes" accent="amber">
            <div className="space-y-2">
              <AnimatePresence>
                {transactions.slice(-5).map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusBadge
                        variant={transactionStatusVariant(transaction.status)}
                        label={
                          transaction.status === 'completed'
                            ? 'Concluída'
                            : transaction.status === 'failed'
                            ? 'Falha'
                            : transaction.status === 'processing'
                            ? 'Processando'
                            : 'Pendente'
                        }
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs text-slate-900 dark:text-tactical-text truncate">
                          {servers.find(s => s.id === transaction.server)?.name}
                        </span>
                        <span className={`font-mono text-[11px] ${
                          transaction.type === 'write' 
                            ? 'text-signal-cyan' 
                            : 'text-signal-green'
                        }`}>
                          {transaction.type === 'write' ? 'Escrita' : 'Leitura'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}
