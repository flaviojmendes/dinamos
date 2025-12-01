import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Datacenter {
  id: string;
  name: string;
  location: string;
  hasCache: boolean;
}

interface Country {
  id: string;
  name: string;
  region: string;
  latencyToDatacenters: Record<string, number>;
}

interface RequestLog {
  id: number;
  timestamp: Date;
  country: string;
  datacenter: string;
  latency: number;
  fromCache: boolean;
}

interface Config {
  baseLatencyMultiplier: number;
  cacheLatencyMultiplier: number;
  maxLogs: number;
}

export default function CDN() {
  const { t, i18n } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [nearestDatacenter, setNearestDatacenter] = useState<string | null>(null);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState<Config>({
    baseLatencyMultiplier: 3,
    cacheLatencyMultiplier: 1,
    maxLogs: 10
  });
  
  const [datacenters, setDatacenters] = useState<Datacenter[]>([
    { id: 'us', name: 'Estados Unidos', location: 'Virginia', hasCache: false },
    { id: 'br', name: 'Brasil', location: 'São Paulo', hasCache: false },
    { id: 'eu', name: 'Europa', location: 'Frankfurt', hasCache: false },
    { id: 'sg', name: 'Ásia', location: 'Singapura', hasCache: false }
  ]);

  const [countries] = useState<Country[]>([
    { 
      id: 'br', 
      name: 'Brasil',
      region: 'América do Sul',
      latencyToDatacenters: { us: 120, br: 20, eu: 180, sg: 300 }
    },
    { 
      id: 'ar', 
      name: 'Argentina',
      region: 'América do Sul',
      latencyToDatacenters: { us: 140, br: 40, eu: 200, sg: 320 }
    },
    { 
      id: 'mx', 
      name: 'México',
      region: 'América do Norte',
      latencyToDatacenters: { us: 60, br: 160, eu: 180, sg: 280 }
    },
    { 
      id: 'es', 
      name: 'Espanha',
      region: 'Europa',
      latencyToDatacenters: { us: 120, br: 180, eu: 40, sg: 240 }
    },
    { 
      id: 'jp', 
      name: 'Japão',
      region: 'Ásia',
      latencyToDatacenters: { us: 160, br: 280, eu: 220, sg: 80 }
    }
  ]);

  const resetSimulation = () => {
    setSelectedCountry(null);
    setIsRequesting(false);
    setNearestDatacenter(null);
    setRequestLogs([]);
    setDatacenters(prev => prev.map(dc => ({ ...dc, hasCache: false })));
  };

  const findNearestDatacenter = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (!country) return null;

    let nearest = { id: '', latency: Infinity };
    Object.entries(country.latencyToDatacenters).forEach(([datacenterId, latency]) => {
      if (latency < nearest.latency) {
        nearest = { id: datacenterId, latency };
      }
    });

    return nearest.id;
  };

  const handleRequest = async (countryId: string) => {
    if (isRequesting) return;
    
    setIsRequesting(true);
    setSelectedCountry(countryId);
    
    const country = countries.find(c => c.id === countryId);
    if (!country) {
      setIsRequesting(false);
      return;
    }

    const nearest = findNearestDatacenter(countryId);
    if (!nearest) {
      setIsRequesting(false);
      return;
    }
    
    setNearestDatacenter(nearest);
    
    const datacenter = datacenters.find(dc => dc.id === nearest);
    if (!datacenter) {
      setIsRequesting(false);
      return;
    }

    const baseLatency = country.latencyToDatacenters[nearest];
    const multiplier = datacenter.hasCache ? config.cacheLatencyMultiplier : config.baseLatencyMultiplier;
    const latency = baseLatency * multiplier;
    
    // Add to request log
    const logEntry: RequestLog = {
      id: Date.now(),
      timestamp: new Date(),
      country: t(`simulators.cdn.countries.${country.id}.name`, { defaultValue: country.name }),
      datacenter: t(`simulators.cdn.datacenters.${datacenter.id}.name`, { defaultValue: datacenter.name }),
      latency,
      fromCache: datacenter.hasCache
    };
    
    setRequestLogs(prev => [logEntry, ...prev].slice(0, config.maxLogs));
    
    // Use Promise to handle the delay
    await new Promise(resolve => setTimeout(resolve, latency));
    
    setDatacenters(prev => prev.map(dc => 
      dc.id === nearest ? { ...dc, hasCache: true } : dc
    ));
    setIsRequesting(false);
  };

  const formatTime = (date: Date) => {
    const locale = i18n.language && i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
    return date.toLocaleTimeString(locale, { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6 text-white">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('simulators.cdn.title')}</h2>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
          >
            {isConfigOpen ? t('simulators.cdn.buttons.close_config') : t('simulators.cdn.buttons.configure')}
          </button>
        </div>

        {/* Configuration Panel */}
        {isConfigOpen && (
          <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">{t('simulators.cdn.config.title')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t('simulators.cdn.config.base_latency_multiplier')}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={config.baseLatencyMultiplier}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    baseLatencyMultiplier: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {config.baseLatencyMultiplier}{t('simulators.cdn.labels.x_suffix')}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t('simulators.cdn.config.cache_latency_multiplier')}
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.1"
                  value={config.cacheLatencyMultiplier}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    cacheLatencyMultiplier: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {config.cacheLatencyMultiplier}{t('simulators.cdn.labels.x_suffix')}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t('simulators.cdn.config.max_logs')}
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={config.maxLogs}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    maxLogs: parseInt(e.target.value) 
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {config.maxLogs} {t('simulators.cdn.labels.logs_suffix')}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Country Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{t('simulators.cdn.labels.country_select')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleRequest(country.id)}
                disabled={isRequesting}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedCountry === country.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-zinc-700'
                }`}
              >
                <div className="font-medium">{t(`simulators.cdn.countries.${country.id}.name`, { defaultValue: country.name })}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t(`simulators.cdn.countries.${country.id}.region`, { defaultValue: country.region })}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Datacenters */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{t('simulators.cdn.labels.datacenters')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {datacenters.map((dc) => (
              <div
                key={dc.id}
                className={`p-3 rounded-lg border ${
                  nearestDatacenter === dc.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <div className="font-medium">{t(`simulators.cdn.datacenters.${dc.id}.name`, { defaultValue: dc.name })}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t(`simulators.cdn.datacenters.${dc.id}.location`, { defaultValue: dc.location })}</div>
                {dc.hasCache && (
                  <div className="mt-2 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 inline-block">
                    {t('simulators.cdn.labels.cache_badge')}
                  </div>
                )}
                {selectedCountry && nearestDatacenter === dc.id && (
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {t('simulators.cdn.labels.latency')}: {countries.find(c => c.id === selectedCountry)?.latencyToDatacenters[dc.id]}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Request Status */}
        {isRequesting && (
          <div className="mb-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-sm">{t('simulators.cdn.messages.processing')}</span>
            </motion.div>
          </div>
        )}

        {/* Request History */}
        {requestLogs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{t('simulators.cdn.history.title')}</h3>
            <div className="space-y-2">
              {requestLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{formatTime(log.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{log.country}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{log.datacenter}</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {t('simulators.cdn.labels.latency')}: {log.latency}ms
                      {log.fromCache && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                          {t('simulators.cdn.history.cache_hit')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-end">
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-zinc-700"
          >
            {t('simulators.cdn.buttons.reset')}
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
          <h3 className="font-medium mb-2">{t('simulators.cdn.info.title')}</h3>
          <ul className="space-y-2">
            <li>• {t('simulators.cdn.info.i1')}</li>
            <li>• {t('simulators.cdn.info.i2')}</li>
            <li>• {t('simulators.cdn.info.i3', { base: config.baseLatencyMultiplier })}</li>
            <li>• {t('simulators.cdn.info.i4', { cache: config.cacheLatencyMultiplier })}</li>
            <li>• {t('simulators.cdn.info.i5')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 