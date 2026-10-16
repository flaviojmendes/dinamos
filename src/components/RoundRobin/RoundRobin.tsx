import { Play, Pause, Network, UserRound, Server as ServerIcon } from 'lucide-react';
import { AnimatedNumber } from '../AISystems/motion';
import { SimulationActivity, FlowLink } from '../simulation';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton } from '../tactical';

type LoadBalancingStrategy = 'roundRobin' | 'leastConnections' | 'random';

interface Server {
  id: number;
  capacity: number;
  currentLoad: number;
  responseTime: number;
}

interface SimulationConfig {
  serverCount: number;
  serverCapacity: number;
  requestsPerSecond: number;
  strategy: LoadBalancingStrategy;
}

const getLoadColor = (currentLoad: number, capacity: number): string => {
  const ratio = currentLoad / capacity;
  return ratio > 0.8 ? 'var(--sim-red)' : ratio > 0.5 ? 'var(--sim-amber)' : 'var(--sim-green)';
};

export default function RoundRobin() {
  const { t } = useTranslation();
  const [servers, setServers] = useState<Server[]>([]);
  const [config, setConfig] = useState<SimulationConfig>({
    serverCount: 3,
    serverCapacity: 100,
    requestsPerSecond: 10,
    strategy: 'roundRobin',
  });
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [requestSequence, setRequestSequence] = useState(0);
  const animationFrameId = useRef<number>();
  const nextServerIndex = useRef(0);

  // Initialize servers
  useEffect(() => {
    const newServers = Array.from({ length: config.serverCount }, (_, index) => ({
      id: index,
      capacity: config.serverCapacity,
      currentLoad: 0,
      responseTime: 500, // Default response time
    }));
    setServers(newServers);
    nextServerIndex.current = 0;
    setCurrentServerIndex(0);
  }, [config.serverCount, config.serverCapacity]);

  const updateServerResponseTime = (serverId: number, newResponseTime: number) => {
    setServers(currentServers =>
      currentServers.map(server =>
        server.id === serverId
          ? { ...server, responseTime: newResponseTime }
          : server
      )
    );
  };

  const getNextServerIndex = (currentServers: Server[]): number => {
    switch (config.strategy) {
      case 'roundRobin':
        const currentIndex = nextServerIndex.current;
        nextServerIndex.current = (currentIndex + 1) % servers.length;
        return currentIndex;
      
      case 'leastConnections':
        // Find server with lowest load
        let minLoad = Infinity;
        let minLoadIndex = 0;
        
        currentServers.forEach((server, index) => {
          if (server.currentLoad < minLoad) {
            minLoad = server.currentLoad;
            minLoadIndex = index;
          }
        });
        return minLoadIndex;
      
      case 'random':
        // Random selection
        return Math.floor(Math.random() * currentServers.length);
      
      default:
        return 0;
    }
  };

  // Simulation logic
  const processNextRequest = () => {
    setRequestSequence(value => value + 1);
    setServers((currentServers) => {
      const newServers = currentServers.map(server => ({ ...server }));
      const targetIndex = getNextServerIndex(newServers);
      const targetServer = newServers[targetIndex];
      
      setCurrentServerIndex(targetIndex);
      
      if (targetServer.currentLoad < targetServer.capacity) {
        targetServer.currentLoad += 1;
        
        // Schedule request completion based on server response time
        setTimeout(() => {
          setServers((servers) => 
            servers.map((server) => 
              server.id === targetServer.id 
                ? { ...server, currentLoad: Math.max(0, server.currentLoad - 1) }
                : server
            )
          );
        }, targetServer.responseTime);
      }

      return newServers;
    });
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = 1000 / config.requestsPerSecond;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= interval) {
        processNextRequest();
        lastTime = timestamp;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning, config.requestsPerSecond, config.serverCount, config.serverCapacity, config.strategy]);

  const selectClass =
    'p-2 bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border font-sans text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-brand-500 w-full sm:w-auto rounded-md';

  const rangeClass =
    'w-full h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="simulation-workspace space-y-6">
      <div className="sim-controls"><SimulationActivity active={isRunning} /></div>

      <Panel
        title={t('simulators.round_robin.config.strategy')}
        accent="cyan"
        action={
          <TacticalButton
            size="sm"
            variant={isRunning ? 'secondary' : 'primary'}
            aria-pressed={isRunning}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            {isRunning ? t('simulators.round_robin.buttons.stop') : t('simulators.round_robin.buttons.start')}
          </TacticalButton>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
              {t('simulators.round_robin.config.strategy')}
            </label>
            <select
              value={config.strategy}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  strategy: e.target.value as LoadBalancingStrategy,
                }))
              }
              className={selectClass}
            >
              <option value="roundRobin">{t('simulators.round_robin.strategy_names.round_robin')}</option>
              <option value="leastConnections">{t('simulators.round_robin.strategies.least_connections')}</option>
              <option value="random">{t('simulators.round_robin.strategy_names.random')}</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                <span>{t('simulators.round_robin.config.server_count')}</span>
                <span className="text-signal-cyan tabular-nums">{config.serverCount}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={config.serverCount}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    serverCount: parseInt(e.target.value),
                  }))
                }
                className={rangeClass}
              />
            </div>

            <div>
              <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                <span>{t('simulators.round_robin.config.server_capacity')}</span>
                <span className="text-signal-cyan tabular-nums">{config.serverCapacity}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={config.serverCapacity}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    serverCapacity: parseInt(e.target.value),
                  }))
                }
                className={rangeClass}
              />
            </div>

            <div>
              <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                <span>{t('simulators.round_robin.config.rps')}</span>
                <span className="text-signal-cyan tabular-nums">{config.requestsPerSecond} req/s</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={config.requestsPerSecond}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    requestsPerSecond: parseInt(e.target.value),
                  }))
                }
                className={rangeClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-lg p-4">
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">
            {config.strategy === 'roundRobin' && t('simulators.round_robin.strategies.round_robin')}
            {config.strategy === 'leastConnections' && t('simulators.round_robin.strategies.least_conn')}
            {config.strategy === 'random' && t('simulators.round_robin.strategies.random')}
          </p>
        </div>
      </Panel>

      <Panel
        title={t('simulators.round_robin.config.server_count')}
        accent="green"
        action={<span className="font-sans text-sm tabular-nums text-slate-600 dark:text-tactical-dim"><AnimatedNumber value={requestSequence} /> req</span>}
      >
        <div className="sim-stage mb-5 flex items-center gap-4">
          <div className="sim-node flex min-w-0 flex-col items-center gap-2 p-4 text-center text-sm"><UserRound size={22} aria-hidden="true" />{t('simulators.motion.client')}</div>
          <FlowLink active={isRunning} eventKey={requestSequence} />
          <div className="sim-node flex min-w-0 flex-col items-center gap-2 p-4 text-center text-sm"><Network size={22} aria-hidden="true" />{t('simulators.motion.gateway')}</div>
          <FlowLink active={isRunning} eventKey={requestSequence} tone="green" />
          <span className="font-mono text-sm tabular-nums text-slate-600 dark:text-tactical-dim">S{currentServerIndex + 1}</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {servers.map((server) => (
            <div
              key={server.id}
              className={`sim-node p-4 ${
                currentServerIndex === server.id && isRunning
                  ? 'border-signal-cyan bg-signal-cyan/5'
                  : 'border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised'
              }`}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <ServerIcon size={19} className="shrink-0 text-slate-500 dark:text-tactical-dim" aria-hidden="true" />
                    <span className="whitespace-nowrap font-sans text-sm font-medium text-slate-900 dark:text-tactical-text">
                      {t('simulators.round_robin.server_card.server_label', { id: server.id + 1 })}
                    </span>
                    <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                      <span>{t('simulators.round_robin.server_card.requests', { current: server.currentLoad, capacity: server.capacity })}</span>
                      <span className="text-signal-cyan ml-2">{t('simulators.round_robin.server_card.response_time_ms', { ms: server.responseTime })}</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-tactical-label whitespace-nowrap">{t('simulators.round_robin.server_card.response_time_label')}</span>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={server.responseTime}
                      onChange={(e) => updateServerResponseTime(server.id, parseInt(e.target.value))}
                      className={`flex-grow ${rangeClass}`}
                    />
                  </div>
                </div>

                <FlowLink active={isRunning && currentServerIndex === server.id} eventKey={requestSequence} count={1} tone={server.currentLoad / server.capacity > 0.8 ? 'red' : 'green'} />
                <div className="w-full bg-slate-200 dark:bg-tactical-border h-3 rounded-full overflow-hidden">
                  <div
                    className="sim-level-fill h-3 w-full"
                    style={{
                      transform: `scaleX(${server.currentLoad / server.capacity})`,
                      backgroundColor: getLoadColor(server.currentLoad, server.capacity),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
