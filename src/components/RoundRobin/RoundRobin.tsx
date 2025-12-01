import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
  const loadPercentage = (currentLoad / capacity) * 100;
  
  if (loadPercentage < 50) {
    // Green to Yellow gradient (0-50%)
    return `rgb(${Math.floor((loadPercentage * 2) * 255 / 100)}, 255, 0)`;
  } else {
    // Yellow to Red gradient (50-100%)
    return `rgb(255, ${Math.floor((100 - loadPercentage) * 2 * 255 / 100)}, 0)`;
  }
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
    setServers((currentServers) => {
      const newServers = [...currentServers];
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

  return (
    <div className="flex-1 min-h-full overflow-auto">
      <div className="p-4 h-full">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl text-white font-semibold">{t('simulators.round_robin.title')}</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${
                  isRunning 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRunning ? t('simulators.round_robin.buttons.stop') : t('simulators.round_robin.buttons.start')}
              </button>
            </div>
          </div>

          {/* Configuration */}
          <div className="mb-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">
                  {t('simulators.round_robin.config.strategy')}
                  <select
                    value={config.strategy}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        strategy: e.target.value as LoadBalancingStrategy,
                      }))
                    }
                    className="ml-2 p-2 bg-zinc-700 text-white rounded border border-zinc-600 w-full sm:w-auto"
                  >
                    <option value="roundRobin">Round Robin</option>
                    <option value="leastConnections">Least Connections</option>
                    <option value="random">Random</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>{t('simulators.round_robin.config.server_count')}</span>
                    <span className="text-brand-600 dark:text-brand-400">{config.serverCount}</span>
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
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>{t('simulators.round_robin.config.server_capacity')}</span>
                    <span className="text-brand-600 dark:text-brand-400">{t('simulators.round_robin.server_card.requests', { current: config.serverCapacity, capacity: '' }).replace('undefined/', '').replace(' requests', '')}</span>
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
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>{t('simulators.round_robin.config.rps')}</span>
                    <span className="text-brand-600 dark:text-brand-400">{config.requestsPerSecond} req/s</span>
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
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Strategy Description */}
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 text-sm">
              {config.strategy === 'roundRobin' && t('simulators.round_robin.strategies.round_robin')}
              {config.strategy === 'leastConnections' && t('simulators.round_robin.strategies.least_conn')}
              {config.strategy === 'random' && t('simulators.round_robin.strategies.random')}
            </div>
          </div>

          {/* Servers Visualization */}
          <div className="space-y-4">
            {servers.map((server) => (
              <div
                key={server.id}
                className={`bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border ${
                  currentServerIndex === server.id ? 'border-blue-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-white font-medium">{t('simulators.round_robin.server_card.server_label', { id: server.id + 1 })}</span>
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">{t('simulators.round_robin.server_card.requests', { current: server.currentLoad, capacity: server.capacity })}</span>
                        <span className="text-sm text-brand-600 dark:text-brand-400 ml-2">{t('simulators.round_robin.server_card.response_time_ms', { ms: server.responseTime })}</span>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/3 flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">{t('simulators.round_robin.server_card.response_time_label')}</span>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={server.responseTime}
                        onChange={(e) => updateServerResponseTime(server.id, parseInt(e.target.value))}
                        className="flex-grow h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>

                  <div className="w-full bg-zinc-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-200"
                      style={{
                        width: `${(server.currentLoad / server.capacity) * 100}%`,
                        backgroundColor: getLoadColor(server.currentLoad, server.capacity),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 