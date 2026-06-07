import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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

const logBadgeVariant = (type: RequestLog['type']) => {
  switch (type) {
    case 'request': return 'pending' as const;
    case 'cache-hit': return 'active' as const;
    case 'cache-miss': return 'in-progress' as const;
    case 'db-query': return 'offline' as const;
  }
};

export default function CacheSimulation() {
  const { t } = useTranslation();
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

  const inputClass =
    'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-2 py-1 font-sans text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-brand-500 rounded-md dark:rounded-none';

  const rangeClass =
    'w-full h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <Panel accent="cyan" padded={false} bodyClassName="p-4 md:p-6">
        <div className="relative h-20 flex items-center justify-between max-w-3xl mx-auto">
          <div className="absolute h-px bg-slate-300 dark:bg-tactical-line left-0 right-0 top-1/2 -translate-y-1/2" />

          <div
            className={`absolute w-4 h-4 bg-signal-cyan transition-all duration-500 ease-in-out top-1/2 -translate-y-1/2
              ${position === 'client' ? 'left-0' : 
                position === 'cache' ? 'left-1/2 -translate-x-1/2' : 
                position === 'db' ? 'left-full -translate-x-full' : 
                'left-0 opacity-0'}`}
          />

          <div className={`relative z-10 w-16 h-16 border-2 transition-colors duration-300 rounded-lg dark:rounded-none
            ${position === 'client' ? 'border-signal-cyan bg-signal-cyan/10' : 'border-slate-300 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised'}
            flex items-center justify-center`}>
            <span className="font-sans text-xs text-slate-900 dark:text-tactical-text">{t('cache.simulation.client')}</span>
          </div>
          
          <div className={`relative z-10 w-16 h-16 border-2 transition-colors duration-300 rounded-lg dark:rounded-none
            ${position === 'cache' && config.cacheEnabled ? 
              (cache.has(currentKey) && Date.now() - cache.get(currentKey)!.timestamp <= config.cacheTTL * 1000) ?
                'border-signal-green bg-signal-green/10' : 'border-signal-amber bg-signal-amber/10'
              : position === 'cache' ? 'border-signal-red bg-signal-red/10' 
              : 'border-slate-300 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised'}
            flex items-center justify-center`}>
            <span className="font-sans text-xs text-slate-900 dark:text-tactical-text">{t('cache.simulation.cache')}</span>
          </div>

          <div className={`relative z-10 w-16 h-16 border-2 transition-colors duration-300 rounded-lg dark:rounded-none
            ${position === 'db' ? 'border-signal-red bg-signal-red/10' : 'border-slate-300 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised'}
            flex items-center justify-center`}>
            <span className="font-sans text-xs text-slate-900 dark:text-tactical-text">{t('cache.simulation.database')}</span>
          </div>
        </div>
      </Panel>

      <Panel
        title={t('cache.simulation.configuration')}
        accent="amber"
        action={
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="text-slate-400 dark:text-tactical-label hover:text-slate-900 dark:hover:text-tactical-text transition-colors"
            aria-expanded={isConfigOpen}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${isConfigOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        }
      >
        <div className={`space-y-4 overflow-hidden transition-all duration-200 ease-in-out ${
          isConfigOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            <label className="font-sans text-sm text-slate-600 dark:text-tactical-dim flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.cacheEnabled}
                onChange={(e) => setConfig(c => ({ ...c, cacheEnabled: e.target.checked }))}
                className="border-slate-300 dark:border-tactical-border text-signal-green focus:ring-signal-green"
              />
              <span>{t('cache.simulation.cache_enabled')}</span>
            </label>
          </div>

          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>{t('cache.simulation.cache_ttl')}</span>
              <span className="text-signal-cyan tabular-nums">{config.cacheTTL}s</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={config.cacheTTL}
              onChange={(e) => setConfig(c => ({ ...c, cacheTTL: parseInt(e.target.value) }))}
              className={rangeClass}
            />
          </div>

          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>{t('cache.simulation.network_delay')}</span>
              <span className="text-signal-cyan tabular-nums">{config.requestDelay}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={config.requestDelay}
              onChange={(e) => setConfig(c => ({ ...c, requestDelay: parseInt(e.target.value) }))}
              className={rangeClass}
            />
          </div>

          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>{t('cache.simulation.database_delay')}</span>
              <span className="text-signal-cyan tabular-nums">{config.dbDelay}ms</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={config.dbDelay}
              onChange={(e) => setConfig(c => ({ ...c, dbDelay: parseInt(e.target.value) }))}
              className={rangeClass}
            />
          </div>
        </div>
      </Panel>

      <Panel title={t('cache.simulation.send')} accent="green">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={currentKey}
            onChange={(e) => setCurrentKey(e.target.value)}
            placeholder={t('cache.simulation.cache_key_placeholder')}
            className={`flex-1 ${inputClass} px-4 py-2`}
          />
          <div className="flex gap-2 md:gap-4">
            <TacticalButton
              size="sm"
              variant="primary"
              onClick={simulateRequest}
              disabled={isProcessing}
              className="flex-1 md:flex-none"
            >
              {isProcessing ? t('cache.simulation.processing') : t('cache.simulation.send')}
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant="danger"
              onClick={clearCache}
              className="flex-1 md:flex-none"
            >
              {t('cache.simulation.clear')}
            </TacticalButton>
          </div>
        </div>
      </Panel>

      <Panel title={t('cache.simulation.cache_status')} accent="cyan">
        <div className="space-y-2">
          {Array.from(cache.entries()).map(([key, entry]) => (
            <div key={key} className="flex flex-col md:flex-row md:justify-between md:items-center border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-3 gap-2 md:gap-0 rounded-lg dark:rounded-none">
              <div className="font-mono text-sm text-slate-900 dark:text-tactical-text break-all">{key}</div>
              <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                {t('cache.simulation.expires_in')} {getRemainingTime(entry.timestamp, config.cacheTTL)}s
              </div>
            </div>
          ))}
          {cache.size === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg dark:rounded-none">
              <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                {t('cache.simulation.cache_empty')}
              </p>
            </div>
          )}
        </div>
      </Panel>

      <Panel title={t('cache.simulation.logs')} accent="amber">
        <div className="space-y-2">
          {logs.map(log => (
            <div
              key={log.id}
              className="flex flex-col md:flex-row md:justify-between md:items-center border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-3 gap-2 md:gap-0 rounded-lg dark:rounded-none"
            >
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <StatusBadge
                  variant={logBadgeVariant(log.type)}
                  label={
                    log.type === 'request' ? t('cache.simulation.request') :
                    log.type === 'cache-hit' ? t('cache.simulation.cache_hit') :
                    log.type === 'cache-miss' ? t('cache.simulation.cache_miss') :
                    t('cache.simulation.db_query')
                  }
                />
                <span className="font-mono text-sm text-slate-900 dark:text-tactical-text break-all">{log.key}</span>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim tabular-nums">{log.duration}ms</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg dark:rounded-none">
              <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                {t('cache.simulation.no_logs')}
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
