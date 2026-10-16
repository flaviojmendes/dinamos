import { Globe2, Server, ArrowDownToLine } from 'lucide-react';
import { SimulationActivity, FlowLink, useSimulationMotion } from '../simulation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Datacenter {
  id: string;
  hasCache: boolean;
}

interface Country {
  id: string;
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
  const { reducedMotion, transition } = useSimulationMotion();
  const runId = useRef(0);
  useEffect(() => () => { runId.current += 1; }, []);
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
    { id: 'us', hasCache: false },
    { id: 'br', hasCache: false },
    { id: 'eu', hasCache: false },
    { id: 'sg', hasCache: false }
  ]);

  const [countries] = useState<Country[]>([
    { 
      id: 'br', 
      latencyToDatacenters: { us: 120, br: 20, eu: 180, sg: 300 }
    },
    { 
      id: 'ar', 
      latencyToDatacenters: { us: 140, br: 40, eu: 200, sg: 320 }
    },
    { 
      id: 'mx', 
      latencyToDatacenters: { us: 60, br: 160, eu: 180, sg: 280 }
    },
    { 
      id: 'es', 
      latencyToDatacenters: { us: 120, br: 180, eu: 40, sg: 240 }
    },
    { 
      id: 'jp', 
      latencyToDatacenters: { us: 160, br: 280, eu: 220, sg: 80 }
    }
  ]);

  const resetSimulation = () => {
    runId.current += 1;
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
    
    const currentRun = ++runId.current;
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
      country: country.id,
      datacenter: datacenter.id,
      latency,
      fromCache: datacenter.hasCache
    };
    
    setRequestLogs(prev => [logEntry, ...prev].slice(0, config.maxLogs));
    
    // Use Promise to handle the delay
    await new Promise(resolve => setTimeout(resolve, latency));
    
    if (currentRun !== runId.current) return;
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
    <div className="simulation-workspace space-y-6">
      <div className="sim-controls"><SimulationActivity active={isRequesting} /></div>

      <Panel
        title={t('simulators.cdn.labels.country_select')}
        accent="cyan"
        action={
          <div className="flex items-center gap-2">
            <TacticalButton size="sm" variant="ghost" aria-expanded={isConfigOpen} onClick={() => setIsConfigOpen(!isConfigOpen)}>
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

        <div className="sim-stage mb-6 flex items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center text-sm"><Globe2 size={28} aria-hidden="true" /><span>{selectedCountry ? t(`simulators.cdn.countries.${selectedCountry}.name`) : t('simulators.motion.client')}</span></div>
          <FlowLink active={!!selectedCountry} eventKey={requestLogs[0]?.id ?? 0} tone={requestLogs[0]?.fromCache ? 'green' : 'cyan'} />
          <div className="sim-node flex min-w-0 flex-1 flex-col items-center gap-2 p-4 text-center text-sm"><Server size={28} aria-hidden="true" /><span>{nearestDatacenter ? t(`simulators.cdn.datacenters.${nearestDatacenter}.name`) : t('simulators.cdn.labels.datacenters')}</span>{requestLogs[0] && <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{requestLogs[0].latency} ms</span>}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {countries.map((country) => (
            <TacticalButton
              key={country.id}
              size="sm"
              variant={selectedCountry === country.id ? 'primary' : 'secondary'}
              onClick={() => handleRequest(country.id)}
              disabled={isRequesting}
              aria-pressed={selectedCountry === country.id}
              className="!flex-col !items-start !h-auto !py-3 !normal-case !tracking-normal"
            >
              <span className="flex items-center gap-2 font-sans text-sm font-semibold"><ArrowDownToLine size={14} aria-hidden="true" />{t(`simulators.cdn.countries.${country.id}.name`)}</span>
              <span className="font-sans text-xs text-slate-500 dark:text-tactical-dim font-normal">{t(`simulators.cdn.countries.${country.id}.region`)}</span>
            </TacticalButton>
          ))}
        </div>

        {isRequesting && <SimulationActivity active label={t('simulators.cdn.messages.processing')} />}

      </Panel>

      <Panel title={t('simulators.cdn.labels.datacenters')} accent="green">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {datacenters.map((dc) => (
            <div
              key={dc.id}
              className={`sim-node p-4 ${
                nearestDatacenter === dc.id
                  ? 'border-signal-cyan bg-signal-cyan/5'
                  : 'border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised'
              }`}
            >
              <div className="font-sans text-sm font-medium text-slate-900 dark:text-tactical-text">{t(`simulators.cdn.datacenters.${dc.id}.name`)}</div>
              <div className="font-sans text-xs text-slate-500 dark:text-tactical-dim mt-0.5">{t(`simulators.cdn.datacenters.${dc.id}.location`)}</div>
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
            <AnimatePresence initial={false} mode="popLayout">
            {requestLogs.map((log) => (
              <motion.div layout={!reducedMotion} initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition}
                key={log.id}
                className="p-3 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised flex items-center justify-between rounded-lg"
              >
                <div>
                  <div className="font-mono text-sm text-slate-900 dark:text-tactical-text">
                    <span className="text-slate-500 dark:text-tactical-dim">{formatTime(log.timestamp)}</span>
                    <span className="mx-2 text-slate-300 dark:text-tactical-line">|</span>
                    <span>{t(`simulators.cdn.countries.${log.country}.name`)}</span>
                    <span className="mx-2 text-slate-300 dark:text-tactical-line">→</span>
                    <span>{t(`simulators.cdn.datacenters.${log.datacenter}.name`)}</span>
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim mt-1 flex items-center gap-2">
                    <span>{t('simulators.cdn.labels.latency')}: {log.latency}ms</span>
                    {log.fromCache && (
                      <StatusBadge variant="active" label={t('simulators.cdn.history.cache_hit')} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
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
