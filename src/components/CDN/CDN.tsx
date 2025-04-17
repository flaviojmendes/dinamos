import { useState } from 'react';
import { motion } from 'framer-motion';

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
      country: country.name,
      datacenter: datacenter.name,
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
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6 text-white">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Simulação de CDN</h2>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Configurar
          </button>
        </div>

        {/* Configuration Panel */}
        {isConfigOpen && (
          <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Configurações</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Multiplicador de Latência Base (Sem Cache)
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
                <div className="text-sm text-zinc-400 mt-1">
                  {config.baseLatencyMultiplier}x
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Multiplicador de Latência com Cache
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
                <div className="text-sm text-zinc-400 mt-1">
                  {config.cacheLatencyMultiplier}x
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Número Máximo de Logs
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
                <div className="text-sm text-zinc-400 mt-1">
                  {config.maxLogs} logs
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Country Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Selecione seu país:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleRequest(country.id)}
                disabled={isRequesting}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedCountry === country.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <div className="font-medium">{country.name}</div>
                <div className="text-sm text-zinc-400">{country.region}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Datacenters */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Datacenters:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {datacenters.map((dc) => (
              <div
                key={dc.id}
                className={`p-3 rounded-lg border ${
                  nearestDatacenter === dc.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                <div className="font-medium">{dc.name}</div>
                <div className="text-sm text-zinc-400">{dc.location}</div>
                {dc.hasCache && (
                  <div className="mt-2 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 inline-block">
                    Cache ✓
                  </div>
                )}
                {selectedCountry && nearestDatacenter === dc.id && (
                  <div className="mt-2 text-xs text-zinc-400">
                    Latência: {countries.find(c => c.id === selectedCountry)?.latencyToDatacenters[dc.id]}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Request Status */}
        {isRequesting && (
          <div className="mb-6 p-4 rounded-lg bg-zinc-800 flex items-center justify-center">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-sm">Processando requisição...</span>
            </motion.div>
          </div>
        )}

        {/* Request History */}
        {requestLogs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Histórico de Requisições:</h3>
            <div className="space-y-2">
              {requestLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-zinc-800/50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm">
                      <span className="text-zinc-400">{formatTime(log.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{log.country}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{log.datacenter}</span>
                    </div>
                    <div className="text-sm text-zinc-400">
                      Latência: {log.latency}ms
                      {log.fromCache && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                          Cache Hit
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
            className="px-4 py-2 rounded-lg font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          >
            Reiniciar
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg text-sm text-zinc-300">
          <h3 className="font-medium mb-2">Como funciona?</h3>
          <ul className="space-y-2">
            <li>• Selecione seu país para simular uma requisição</li>
            <li>• O datacenter mais próximo será escolhido automaticamente</li>
            <li>• Primeira requisição: Busca do servidor de origem ({config.baseLatencyMultiplier}x a latência)</li>
            <li>• Requisições subsequentes: Servidas do cache local ({config.cacheLatencyMultiplier}x a latência)</li>
            <li>• A latência varia de acordo com a distância entre seu país e o datacenter</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 