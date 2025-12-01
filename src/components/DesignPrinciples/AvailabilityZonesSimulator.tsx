import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Zone {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'failed';
  load: number;
  servers: number;
  latency: number;
}

interface Request {
  id: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  zone: string;
}

interface SimulationConfig {
  requestRate: number;
  failureChance: number;
  autoFailover: boolean;
  showLatency: boolean;
}

export default function AvailabilityZonesSimulator() {
  const { t } = useTranslation();

  const tStr = (key: string): string => {
    const value = t(key);
    return value === key ? t(key, { lng: 'en' }) : value;
  };
  const [zones, setZones] = useState<Zone[]>([
    { id: 'az1', name: 'Zona A', status: 'healthy', load: 0, servers: 3, latency: 20 },
    { id: 'az2', name: 'Zona B', status: 'healthy', load: 0, servers: 3, latency: 25 },
    { id: 'az3', name: 'Zona C', status: 'healthy', load: 0, servers: 3, latency: 30 },
  ]);

  const [requests, setRequests] = useState<Request[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 });
  const [config, setConfig] = useState<SimulationConfig>({
    requestRate: 1,
    failureChance: 0.1,
    autoFailover: true,
    showLatency: true,
  });

  const requestInterval = useRef<number>();
  const updateInterval = useRef<number>();

  const getHealthyZones = () => zones.filter(z => z.status === 'healthy');
  const getLeastLoadedZone = () => {
    const healthyZones = getHealthyZones();
    return healthyZones.reduce((prev, curr) => 
      (curr.load / curr.servers) < (prev.load / prev.servers) ? curr : prev
    , healthyZones[0]);
  };

  const processRequest = (request: Request): Request => {
    const zone = zones.find(z => z.id === request.zone);
    if (!zone || zone.status === 'failed') {
      return { ...request, status: 'failed' as const };
    }
    return { ...request, status: 'completed' as const };
  };

  const generateRequest = () => {
    const targetZone = getLeastLoadedZone();
    if (!targetZone) return;

    const newRequest: Request = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending',
      zone: targetZone.id,
    };

    setRequests(prev => [...prev.slice(-9), newRequest]);
    setZones(prev => prev.map(z => 
      z.id === targetZone.id ? { ...z, load: z.load + 1 } : z
    ));

    setTimeout(() => {
      setRequests(prev => prev.map(r => 
        r.id === newRequest.id ? processRequest(r) : r
      ));
      setZones(prev => prev.map(z => 
        z.id === targetZone.id ? { ...z, load: Math.max(0, z.load - 1) } : z
      ));
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        successful: prev.successful + (newRequest.status !== 'failed' ? 1 : 0),
        failed: prev.failed + (newRequest.status === 'failed' ? 1 : 0),
      }));
    }, targetZone.latency * 100);
  };

  const simulateZoneFailure = (zoneId: string) => {
    setZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, status: 'failed', load: 0 } : z
    ));

    if (config.autoFailover) {
      const healthyZones = getHealthyZones();
      const requests = healthyZones.length > 0 ? Math.floor(3 / healthyZones.length) : 0;
      setZones(prev => prev.map(z => 
        healthyZones.find(hz => hz.id === z.id) 
          ? { ...z, servers: z.servers + requests }
          : z
      ));
    }
  };

  const recoverZone = (zoneId: string) => {
    setZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, status: 'healthy', servers: 3 } : z
    ));

    if (config.autoFailover) {
      setZones(prev => prev.map(z => 
        z.id !== zoneId && z.status === 'healthy'
          ? { ...z, servers: Math.max(3, z.servers - 1) }
          : z
      ));
    }
  };

  useEffect(() => {
    if (isRunning) {
      requestInterval.current = window.setInterval(generateRequest, 1000 / config.requestRate);
      updateInterval.current = window.setInterval(() => {
        setZones(prev => prev.map(z => {
          if (Math.random() < config.failureChance / 100 && z.status === 'healthy') {
            return { ...z, status: 'degraded' };
          }
          if (z.status === 'degraded' && Math.random() < 0.3) {
            return { ...z, status: 'failed' };
          }
          return z;
        }));
      }, 2000);
    }

    return () => {
      if (requestInterval.current) window.clearInterval(requestInterval.current);
      if (updateInterval.current) window.clearInterval(updateInterval.current);
    };
  }, [isRunning, config.requestRate, config.failureChance]);

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">{tStr('design_principles.availability.availability_zones_simulator.title')}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            {tStr('design_principles.availability.availability_zones_simulator.intro')}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {tStr('design_principles.availability.availability_zones_simulator.controls.request_rate_label')}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={config.requestRate}
                onChange={e => setConfig(prev => ({ ...prev, requestRate: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">{config.requestRate}/s</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {tStr('design_principles.availability.availability_zones_simulator.controls.failure_chance_label')}
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={config.failureChance}
                onChange={e => setConfig(prev => ({ ...prev, failureChance: Number(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">{config.failureChance}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={config.autoFailover}
                onChange={e => setConfig(prev => ({ ...prev, autoFailover: e.target.checked }))}
                className="rounded"
              />
              <label className="text-sm font-medium">{tStr('design_principles.availability.availability_zones_simulator.controls.auto_failover_label')}</label>
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
                {isRunning 
                  ? tStr('design_principles.availability.availability_zones_simulator.controls.stop_simulation')
                  : tStr('design_principles.availability.availability_zones_simulator.controls.start_simulation')
                }
              </button>
            </div>
          </div>
        </motion.div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{zone.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    zone.status === 'healthy' 
                      ? 'bg-green-500/20 text-green-400'
                      : zone.status === 'degraded'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {zone.status === 'healthy' 
                    ? tStr('design_principles.availability.availability_zones_simulator.zone_status.healthy')
                    : zone.status === 'degraded'
                    ? tStr('design_principles.availability.availability_zones_simulator.zone_status.degraded')
                    : tStr('design_principles.availability.availability_zones_simulator.zone_status.failed')}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{tStr('design_principles.availability.availability_zones_simulator.zone_info.load')}</span>
                    <span>{Math.round((zone.load / zone.servers) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (zone.load / zone.servers) * 100)}%` }}
                      className={`h-full rounded-full ${
                        (zone.load / zone.servers) > 0.8 
                          ? 'bg-red-500'
                          : (zone.load / zone.servers) > 0.5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{tStr('design_principles.availability.availability_zones_simulator.zone_info.active_servers')}</span>
                    <span>{zone.servers}</span>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: zone.servers }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {config.showLatency && (
                  <div className="text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{tStr('design_principles.availability.availability_zones_simulator.zone_info.latency')}: </span>
                    <span>{zone.latency}ms</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  {zone.status !== 'failed' ? (
                    <button
                      onClick={() => simulateZoneFailure(zone.id)}
                      className="flex-1 py-1 px-3 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                      {tStr('design_principles.availability.availability_zones_simulator.zone_info.simulate_failure')}
                    </button>
                  ) : (
                    <button
                      onClick={() => recoverZone(zone.id)}
                      className="flex-1 py-1 px-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      {tStr('design_principles.availability.availability_zones_simulator.zone_info.recover')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats and Requests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">{tStr('design_principles.availability.availability_zones_simulator.statistics.title')}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{tStr('design_principles.availability.availability_zones_simulator.statistics.total_requests')}</span>
                  <span>{stats.total}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{tStr('design_principles.availability.availability_zones_simulator.statistics.success_rate')}</span>
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
            </div>
          </motion.div>

          {/* Recent Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">{tStr('design_principles.availability.availability_zones_simulator.recent_requests.title')}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {requests.slice(-5).map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${
                        request.status === 'completed'
                          ? 'bg-green-500'
                          : request.status === 'failed'
                          ? 'bg-red-500'
                          : request.status === 'processing'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`} />
                      <span className="text-sm">
                        {zones.find(z => z.id === request.zone)?.name}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {request.status === 'completed'
                        ? tStr('design_principles.availability.availability_zones_simulator.recent_requests.completed')
                        : request.status === 'failed'
                        ? tStr('design_principles.availability.availability_zones_simulator.recent_requests.failed')
                        : request.status === 'processing'
                        ? tStr('design_principles.availability.availability_zones_simulator.recent_requests.processing')
                        : tStr('design_principles.availability.availability_zones_simulator.recent_requests.pending')}
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