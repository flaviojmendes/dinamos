import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
          {tStr('design_principles.availability.availability_zones_simulator.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {tStr('design_principles.availability.availability_zones_simulator.intro')}
        </p>
      </div>

      <Panel accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
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
            <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{config.requestRate}/s</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
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
            <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{config.failureChance}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.autoFailover}
              onChange={e => setConfig(prev => ({ ...prev, autoFailover: e.target.checked }))}
              className="rounded border-slate-300 dark:border-tactical-border"
            />
            <label className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{tStr('design_principles.availability.availability_zones_simulator.controls.auto_failover_label')}</label>
          </div>
          <div>
            <TacticalButton
              variant={isRunning ? 'danger' : 'primary'}
              className="w-full"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning 
                ? tStr('design_principles.availability.availability_zones_simulator.controls.stop_simulation')
                : tStr('design_principles.availability.availability_zones_simulator.controls.start_simulation')
              }
            </TacticalButton>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Panel title={zone.name} accent={zone.status === 'healthy' ? 'green' : zone.status === 'degraded' ? 'amber' : 'red'}
              action={
                <StatusBadge
                  variant={
                    zone.status === 'healthy' ? 'online' :
                    zone.status === 'degraded' ? 'in-progress' :
                    'offline'
                  }
                  label={
                    zone.status === 'healthy' 
                      ? tStr('design_principles.availability.availability_zones_simulator.zone_status.healthy')
                      : zone.status === 'degraded'
                      ? tStr('design_principles.availability.availability_zones_simulator.zone_status.degraded')
                      : tStr('design_principles.availability.availability_zones_simulator.zone_status.failed')
                  }
                />
              }
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-tactical-dim mb-1">
                    <span className="font-sans">{tStr('design_principles.availability.availability_zones_simulator.zone_info.load')}</span>
                    <span className="font-mono tabular-nums">{Math.round((zone.load / zone.servers) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (zone.load / zone.servers) * 100)}%` }}
                      className={`h-full ${
                        (zone.load / zone.servers) > 0.8 
                          ? 'bg-signal-red'
                          : (zone.load / zone.servers) > 0.5
                          ? 'bg-signal-amber'
                          : 'bg-signal-green'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-tactical-dim mb-1">
                    <span className="font-sans">{tStr('design_principles.availability.availability_zones_simulator.zone_info.active_servers')}</span>
                    <span className="font-mono tabular-nums">{zone.servers}</span>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: zone.servers }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 bg-signal-cyan"
                      />
                    ))}
                  </div>
                </div>

                {config.showLatency && (
                  <div className="text-xs">
                    <span className="font-sans text-slate-500 dark:text-tactical-dim">{tStr('design_principles.availability.availability_zones_simulator.zone_info.latency')}: </span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-tactical-text">{zone.latency}ms</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  {zone.status !== 'failed' ? (
                    <TacticalButton
                      size="sm"
                      variant="danger"
                      className="flex-1"
                      onClick={() => simulateZoneFailure(zone.id)}
                    >
                      {tStr('design_principles.availability.availability_zones_simulator.zone_info.simulate_failure')}
                    </TacticalButton>
                  ) : (
                    <TacticalButton
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => recoverZone(zone.id)}
                    >
                      {tStr('design_principles.availability.availability_zones_simulator.zone_info.recover')}
                    </TacticalButton>
                  )}
                </div>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title={tStr('design_principles.availability.availability_zones_simulator.statistics.title')} accent="green">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-tactical-dim mb-1">
                <span className="font-sans">{tStr('design_principles.availability.availability_zones_simulator.statistics.total_requests')}</span>
                <span className="font-mono tabular-nums text-slate-900 dark:text-tactical-text">{stats.total}</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-tactical-raised">
                <div className="h-full bg-signal-cyan" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-tactical-dim mb-1">
                <span className="font-sans">{tStr('design_principles.availability.availability_zones_simulator.statistics.success_rate')}</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-signal-green">
                  {stats.total > 0 
                    ? `${Math.round((stats.successful / stats.total) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-tactical-raised overflow-hidden">
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
          </div>
        </Panel>

        <Panel title={tStr('design_principles.availability.availability_zones_simulator.recent_requests.title')} accent="amber">
          <div className="space-y-2">
            <AnimatePresence>
              {requests.slice(-5).map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised rounded-lg px-3 py-2.5"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-sans text-xs text-slate-900 dark:text-tactical-text">
                      {zones.find(z => z.id === request.zone)?.name}
                    </span>
                  </div>
                  <StatusBadge
                    variant={
                      request.status === 'completed' ? 'active' :
                      request.status === 'failed' ? 'classified' :
                      request.status === 'processing' ? 'in-progress' :
                      'pending'
                    }
                    label={
                      request.status === 'completed'
                        ? tStr('design_principles.availability.availability_zones_simulator.recent_requests.completed')
                        : request.status === 'failed'
                        ? tStr('design_principles.availability.availability_zones_simulator.recent_requests.failed')
                        : request.status === 'processing'
                        ? tStr('design_principles.availability.availability_zones_simulator.recent_requests.processing')
                        : tStr('design_principles.availability.availability_zones_simulator.recent_requests.pending')
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      </div>
    </div>
  );
}
