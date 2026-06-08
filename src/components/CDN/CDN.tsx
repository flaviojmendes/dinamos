import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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

  const rangeClass =
    'w-full h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <span className="inline-block text-xs font-medium text-slate-600 dark:text-tactical-label bg-slate-100 dark:bg-tactical-raised px-2.5 py-1 rounded-full mb-2">
          {t('simulators.cdn.title')}
        </span>
      </div>

      <Panel
        title={t('simulators.cdn.labels.country_select')}
        accent="cyan"
        action={
          <div className="flex items-center gap-2">
            <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
              {isConfigOpen ? t('simulators.cdn.buttons.close_config') : t('simulators.cdn.buttons.configure')}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
              {t('simulators.cdn.buttons.reset')}
            </TacticalButton>
          </div>
        }
      >
        {isConfigOpen && (
          <div className="mb-6 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4 space-y-4 rounded-lg">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-tactical-text">{t('simulators.cdn.config.title')}</h3>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">
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
                className={rangeClass}
              />
              <div className="font-mono text-sm text-slate-500 dark:text-tactical-dim mt-1 tabular-nums">
                {config.baseLatencyMultiplier}{t('simulators.cdn.labels.x_suffix')}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">
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
                className={rangeClass}
              />
              <div className="font-mono text-sm text-slate-500 dark:text-tactical-dim mt-1 tabular-nums">
                {config.cacheLatencyMultiplier}{t('simulators.cdn.labels.x_suffix')}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">
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
                className={rangeClass}
              />
              <div className="font-mono text-sm text-slate-500 dark:text-tactical-dim mt-1">
                {config.maxLogs} {t('simulators.cdn.labels.logs_suffix')}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {countries.map((country) => (
            <TacticalButton
              key={country.id}
              size="sm"
              variant={selectedCountry === country.id ? 'primary' : 'secondary'}
              onClick={() => handleRequest(country.id)}
              disabled={isRequesting}
              className="!flex-col !items-start !h-auto !py-3 !normal-case !tracking-normal"
            >
              <span className="font-mono text-sm font-semibold">{t(`simulators.cdn.countries.${country.id}.name`, { defaultValue: country.name })}</span>
              <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim font-normal">{t(`simulators.cdn.countries.${country.id}.region`, { defaultValue: country.region })}</span>
            </TacticalButton>
          ))}
        </div>

        {isRequesting && (
          <div className="mb-6 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4 flex items-center justify-center rounded-lg">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-2 h-2 bg-signal-cyan animate-bounce" />
              <div className="w-2 h-2 bg-signal-cyan animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-signal-cyan animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">{t('simulators.cdn.messages.processing')}</span>
            </motion.div>
          </div>
        )}
      </Panel>

      <Panel title={t('simulators.cdn.labels.datacenters')} accent="green">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {datacenters.map((dc) => (
            <div
              key={dc.id}
              className={`p-3 border rounded-lg ${
                nearestDatacenter === dc.id
                  ? 'border-signal-cyan bg-signal-cyan/5'
                  : 'border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised'
              }`}
            >
              <div className="font-sans text-sm font-medium text-slate-900 dark:text-tactical-text">{t(`simulators.cdn.datacenters.${dc.id}.name`, { defaultValue: dc.name })}</div>
              <div className="font-sans text-xs text-slate-500 dark:text-tactical-dim mt-0.5">{t(`simulators.cdn.datacenters.${dc.id}.location`, { defaultValue: dc.location })}</div>
              {dc.hasCache && (
                <div className="mt-2">
                  <StatusBadge variant="active" label={t('simulators.cdn.labels.cache_badge')} />
                </div>
              )}
              {selectedCountry && nearestDatacenter === dc.id && (
                <div className="mt-2 font-mono text-xs text-slate-500 dark:text-tactical-dim tabular-nums">
                  {t('simulators.cdn.labels.latency')}: {countries.find(c => c.id === selectedCountry)?.latencyToDatacenters[dc.id]}ms
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {requestLogs.length > 0 && (
        <Panel title={t('simulators.cdn.history.title')} accent="amber">
          <div className="space-y-2">
            {requestLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised flex items-center justify-between rounded-lg"
              >
                <div>
                  <div className="font-mono text-sm text-slate-900 dark:text-tactical-text">
                    <span className="text-slate-500 dark:text-tactical-dim">{formatTime(log.timestamp)}</span>
                    <span className="mx-2 text-slate-300 dark:text-tactical-line">|</span>
                    <span>{log.country}</span>
                    <span className="mx-2 text-slate-300 dark:text-tactical-line">→</span>
                    <span>{log.datacenter}</span>
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim mt-1 flex items-center gap-2">
                    <span>{t('simulators.cdn.labels.latency')}: {log.latency}ms</span>
                    {log.fromCache && (
                      <StatusBadge variant="active" label={t('simulators.cdn.history.cache_hit')} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="bg-slate-50 dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-tactical-text mb-3">{t('simulators.cdn.info.title')}</h3>
        <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim list-disc list-inside">
          <li>{t('simulators.cdn.info.i1')}</li>
          <li>{t('simulators.cdn.info.i2')}</li>
          <li>{t('simulators.cdn.info.i3', { base: config.baseLatencyMultiplier })}</li>
          <li>{t('simulators.cdn.info.i4', { cache: config.cacheLatencyMultiplier })}</li>
          <li>{t('simulators.cdn.info.i5')}</li>
        </ul>
      </div>
    </div>
  );
}
