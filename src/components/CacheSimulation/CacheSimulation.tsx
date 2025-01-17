import { useState, useRef, useEffect } from 'react';

interface CacheEntry {
  key: string;
  value: string;
  timestamp: number;
}

interface SimulationConfig {
  cacheEnabled: boolean;
  cacheTTL: number;
  requestDelay: number;
  dbDelay: number;
}

interface RequestLog {
  id: number;
  timestamp: number;
  type: 'request' | 'cache-hit' | 'cache-miss' | 'db-query';
  key: string;
  duration: number;
}

export default function CacheSimulation() {
  const [position, setPosition] = useState<'client' | 'cache' | 'db' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentKey, setCurrentKey] = useState('user-1');
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [, forceUpdate] = useState({});  // Used to force re-render for countdown
  const nextLogId = useRef(1);
  const [config, setConfig] = useState<SimulationConfig>({
    cacheEnabled: true,
    cacheTTL: 30,
    requestDelay: 500,
    dbDelay: 1000,
  });

  // Update cache countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Only force update if there are items in cache
      if (cache.size > 0) {
        forceUpdate({});
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cache.size]);

  const getRemainingTime = (timestamp: number, ttl: number) => {
    const remaining = Math.max(0, Math.ceil((timestamp + ttl * 1000 - Date.now()) / 1000));
    if (remaining === 0) {
      // Remove expired items from cache
      setCache(current => {
        const newCache = new Map(current);
        for (const [key, entry] of newCache.entries()) {
          if (Date.now() - entry.timestamp > config.cacheTTL * 1000) {
            newCache.delete(key);
          }
        }
        return newCache;
      });
    }
    return remaining;
  };

  const addLog = (log: Omit<RequestLog, 'id'>) => {
    setLogs(current => [...current.slice(-9), { ...log, id: nextLogId.current++ }]);
  };

  const simulateRequest = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Initial request
    addLog({
      timestamp: Date.now(),
      type: 'request',
      key: currentKey,
      duration: 0,
    });

    // Client to Cache
    setPosition('client');
    await new Promise(r => setTimeout(r, config.requestDelay / 2));
    
    // Check cache
    setPosition('cache');
    await new Promise(r => setTimeout(r, config.requestDelay / 2));

    if (config.cacheEnabled) {
      const cachedData = cache.get(currentKey);
      if (cachedData && Date.now() - cachedData.timestamp <= config.cacheTTL * 1000) {
        // Cache hit
        addLog({
          timestamp: Date.now(),
          type: 'cache-hit',
          key: currentKey,
          duration: config.requestDelay,
        });
        
        // Return to client
        setPosition('client');
        await new Promise(r => setTimeout(r, config.requestDelay));
        setIsProcessing(false);
        setPosition(null);
        return;
      }

      // Cache miss
      addLog({
        timestamp: Date.now(),
        type: 'cache-miss',
        key: currentKey,
        duration: config.requestDelay,
      });
    }
    
    // Go to database
    setPosition('db');
    await new Promise(r => setTimeout(r, config.requestDelay));

    // Database processing
    addLog({
      timestamp: Date.now(),
      type: 'db-query',
      key: currentKey,
      duration: config.dbDelay,
    });
    await new Promise(r => setTimeout(r, config.dbDelay));
    
    // Back through Cache
    setPosition('cache');
    await new Promise(r => setTimeout(r, config.requestDelay));

    // Update cache
    if (config.cacheEnabled) {
      setCache(current => new Map(current).set(currentKey, {
        key: currentKey,
        value: `Data for ${currentKey}`,
        timestamp: Date.now(),
      }));
    }
    
    // Back to Client
    setPosition('client');
    await new Promise(r => setTimeout(r, config.requestDelay));

    setIsProcessing(false);
    setPosition(null);
  };

  const clearCache = () => {
    setCache(new Map());
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-8">
      {/* Animation */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <div className="relative h-20 flex items-center justify-between max-w-3xl mx-auto">
          {/* Connection Line */}
          <div className="absolute h-1 bg-gray-600 left-0 right-0 top-1/2 -translate-y-1/2" />

          {/* Moving Dot */}
          <div
            className={`absolute w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 transition-all duration-500 ease-in-out top-1/2 -translate-y-1/2
              ${position === 'client' ? 'left-0' : 
                position === 'cache' ? 'left-1/2 -translate-x-1/2' : 
                position === 'db' ? 'left-full -translate-x-full' : 
                'left-0 opacity-0'}`}
          />

          {/* Nodes */}
          <div className={`relative z-10 w-16 h-16 rounded-lg border-2 transition-colors duration-300
            ${position === 'client' ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 bg-gray-900'}
            flex items-center justify-center`}>
            <span className="text-white text-sm">Cliente</span>
          </div>
          
          <div className={`relative z-10 w-16 h-16 rounded-lg border-2 transition-colors duration-300
            ${position === 'cache' && config.cacheEnabled ? 
              (cache.has(currentKey) && Date.now() - cache.get(currentKey)!.timestamp <= config.cacheTTL * 1000) ?
                'border-green-500 bg-green-500/20' : 'border-yellow-500 bg-yellow-500/20'
              : position === 'cache' ? 'border-red-500 bg-red-500/20' 
              : 'border-gray-600 bg-gray-900'}
            flex items-center justify-center`}>
            <span className="text-white text-sm">Cache</span>
          </div>

          <div className={`relative z-10 w-16 h-16 rounded-lg border-2 transition-colors duration-300
            ${position === 'db' ? 'border-red-500 bg-red-500/20' : 'border-gray-600 bg-gray-900'}
            flex items-center justify-center`}>
            <span className="text-white text-sm">DB</span>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="w-full flex items-center justify-between text-base md:text-lg font-semibold text-white focus:outline-none"
        >
          <span>Configuração</span>
          <svg
            className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-200 ${isConfigOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        <div className={`space-y-4 overflow-hidden transition-all duration-200 ease-in-out ${
          isConfigOpen ? 'max-h-96 opacity-100 mt-4 md:mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            <label className="text-white flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.cacheEnabled}
                onChange={(e) => setConfig(c => ({ ...c, cacheEnabled: e.target.checked }))}
                className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <span>Cache Ativado</span>
            </label>
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Tempo de Vida do Cache</span>
              <span className="text-blue-400">{config.cacheTTL}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={config.cacheTTL}
              onChange={(e) => setConfig(c => ({ ...c, cacheTTL: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Atraso de Rede</span>
              <span className="text-blue-400">{config.requestDelay}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={config.requestDelay}
              onChange={(e) => setConfig(c => ({ ...c, requestDelay: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Atraso do Banco</span>
              <span className="text-blue-400">{config.dbDelay}ms</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={config.dbDelay}
              onChange={(e) => setConfig(c => ({ ...c, dbDelay: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={currentKey}
            onChange={(e) => setCurrentKey(e.target.value)}
            placeholder="Chave do cache"
            className="w-full md:flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={simulateRequest}
              disabled={isProcessing}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isProcessing ? 'Processando...' : 'Enviar'}
            </button>
            <button
              onClick={clearCache}
              className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Cache Status */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">Status do Cache</h3>
        <div className="space-y-2">
          {Array.from(cache.entries()).map(([key, entry]) => (
            <div key={key} className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-800 p-3 rounded gap-2 md:gap-0">
              <div className="text-white break-all">{key}</div>
              <div className="text-gray-400 text-sm md:text-base">
                expira em {getRemainingTime(entry.timestamp, config.cacheTTL)}s
              </div>
            </div>
          ))}
          {cache.size === 0 && (
            <div className="text-gray-500 text-center py-4">Cache está vazio</div>
          )}
        </div>
      </div>

      {/* Request Logs */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">Registros</h3>
        <div className="space-y-2">
          {logs.map(log => (
            <div
              key={log.id}
              className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-800 p-3 rounded gap-2 md:gap-0"
            >
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  log.type === 'request' ? 'bg-blue-500 text-white' :
                  log.type === 'cache-hit' ? 'bg-green-500 text-white' :
                  log.type === 'cache-miss' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {log.type === 'request' ? 'Requisição' :
                   log.type === 'cache-hit' ? 'Cache Encontrado' :
                   log.type === 'cache-miss' ? 'Cache Ausente' :
                   'Consulta BD'}
                </span>
                <span className="text-white break-all">{log.key}</span>
              </div>
              <span className="text-gray-400 text-sm md:text-base">{log.duration}ms</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500 text-center py-4">Nenhum registro disponível</div>
          )}
        </div>
      </div>
    </div>
  );
} 