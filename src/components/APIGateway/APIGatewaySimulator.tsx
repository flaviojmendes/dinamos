import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

interface Request {
  id: number;
  type: 'auth' | 'products' | 'orders' | 'payments';
  status: 'pending' | 'routing' | 'completed' | 'rejected';
  timestamp: number;
  serviceTime?: number;
}

interface Service {
  name: string;
  type: Request['type'];
  color: string;
  description: string;
  errorRate: number;
  processingTime: number;
}

interface SimulationConfig {
  requestsPerSecond: number;
  routingDelay: number;
  errorRate: number;
  removeDelay: number;
}

const defaultConfig: SimulationConfig = {
  requestsPerSecond: 0.5,
  routingDelay: 1000,
  errorRate: 0.1,
  removeDelay: 4000,
};

const services: Service[] = [
  { 
    name: 'Auth Service', 
    type: 'auth', 
    color: 'bg-purple-500',
    description: 'Autenticação e autorização',
    errorRate: 0.05,
    processingTime: 1500
  },
  { 
    name: 'Product Service', 
    type: 'products', 
    color: 'bg-blue-500',
    description: 'Catálogo de produtos',
    errorRate: 0.02,
    processingTime: 800
  },
  { 
    name: 'Order Service', 
    type: 'orders', 
    color: 'bg-green-500',
    description: 'Gerenciamento de pedidos',
    errorRate: 0.08,
    processingTime: 2000
  },
  { 
    name: 'Payment Service', 
    type: 'payments', 
    color: 'bg-yellow-500',
    description: 'Processamento de pagamentos',
    errorRate: 0.15,
    processingTime: 2500
  }
];

const requestCardClass = (type: Request['type']) => {
  const svc = services.find(s => s.type === type);
  return `p-3 border-l-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised ${svc?.color.replace('bg-', 'border-l-')}`;
};

export default function APIGatewaySimulator() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [showConfig, setShowConfig] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
  });

  const generateRequest = useCallback((): Request => {
    const types: Request['type'][] = ['auth', 'products', 'orders', 'payments'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: requestCount,
      type: randomType,
      status: 'pending',
      timestamp: Date.now(),
      serviceTime: 0
    };
  }, [requestCount]);

  const processRequest = useCallback((request: Request) => {
    const service = services.find(s => s.type === request.type)!;
    
    setStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }));
    
    setRequests(prev => [...prev, request]);
    
    const routingTimer = setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === request.id ? { ...req, status: 'routing' } : req
        )
      );
    }, config.routingDelay);

    const processingTimer = setTimeout(() => {
      const failed = Math.random() < (service.errorRate + config.errorRate);
      
      setRequests(prev => 
        prev.map(req => 
          req.id === request.id 
            ? { ...req, status: failed ? 'rejected' : 'completed' } 
            : req
        )
      );
      
      setStats(prev => ({
        ...prev,
        successfulRequests: prev.successfulRequests + (failed ? 0 : 1),
        failedRequests: prev.failedRequests + (failed ? 1 : 0),
      }));
    }, config.routingDelay + service.processingTime);

    const removalTimer = setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== request.id));
    }, config.removeDelay);

    return () => {
      clearTimeout(routingTimer);
      clearTimeout(processingTimer);
      clearTimeout(removalTimer);
    };
  }, [config.routingDelay, config.errorRate, config.removeDelay]);

  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      const newRequest = generateRequest();
      setRequestCount(prev => prev + 1);
      processRequest(newRequest);
    }, 1000 / config.requestsPerSecond);

    return () => {
      clearInterval(interval);
    };
  }, [isSimulationRunning, config.requestsPerSecond, generateRequest, processRequest]);

  const resetSimulation = () => {
    setIsSimulationRunning(false);
    setRequests([]);
    setRequestCount(0);
    setStats({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
    });
  };

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text mb-2">
          {t('simulators.gateway.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('simulators.gateway.description')}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TacticalButton
          size="sm"
          variant={isSimulationRunning ? 'danger' : 'primary'}
          onClick={() => {
            if (isSimulationRunning) {
              setIsSimulationRunning(false);
            } else {
              resetSimulation();
              setIsSimulationRunning(true);
            }
          }}
        >
          {isSimulationRunning ? t('simulators.gateway.buttons.stop') : t('simulators.gateway.buttons.start')}
        </TacticalButton>
        <TacticalButton size="sm" variant="ghost" onClick={() => setShowConfig(!showConfig)}>
          {showConfig ? t('simulators.gateway.buttons.hide_config') : t('simulators.gateway.buttons.show_config')}
        </TacticalButton>
        <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
          {t('simulators.gateway.buttons.reset')}
        </TacticalButton>
        {isSimulationRunning && <StatusBadge variant="active" label="Running" />}
      </div>

      {showConfig && (
        <Panel
          title={t('simulators.gateway.config.title')}
          accent="cyan"
          action={
            <TacticalButton size="sm" variant="ghost" onClick={() => setConfig(defaultConfig)}>
              {t('simulators.gateway.buttons.restore_defaults')}
            </TacticalButton>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
                {t('simulators.gateway.config.rps', { value: config.requestsPerSecond })}
              </label>
              <input type="range" min="0.1" max="2" step="0.1" value={config.requestsPerSecond} onChange={(e) => setConfig(prev => ({ ...prev, requestsPerSecond: parseFloat(e.target.value) }))} className={rangeClass} />
            </div>
            <div>
              <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
                {t('simulators.gateway.config.routing_delay', { ms: config.routingDelay })}
              </label>
              <input type="range" min="500" max="2000" step="100" value={config.routingDelay} onChange={(e) => setConfig(prev => ({ ...prev, routingDelay: parseInt(e.target.value) }))} className={rangeClass} />
            </div>
            <div>
              <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
                {t('simulators.gateway.config.extra_error_rate', { percent: (config.errorRate * 100).toFixed(1) })}
              </label>
              <input type="range" min="0" max="0.3" step="0.01" value={config.errorRate} onChange={(e) => setConfig(prev => ({ ...prev, errorRate: parseFloat(e.target.value) }))} className={rangeClass} />
            </div>
            <div>
              <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
                {t('simulators.gateway.config.removal_delay', { ms: config.removeDelay })}
              </label>
              <input type="range" min="2000" max="8000" step="500" value={config.removeDelay} onChange={(e) => setConfig(prev => ({ ...prev, removeDelay: parseInt(e.target.value) }))} className={rangeClass} />
            </div>
          </div>
        </Panel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{stats.totalRequests}</div>
          <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.gateway.stats.total')}</div>
        </div>
        <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">{stats.successfulRequests}</div>
          <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.gateway.stats.success')}</div>
        </div>
        <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red">{stats.failedRequests}</div>
          <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.gateway.stats.error')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title={t('simulators.gateway.columns.clients')} accent="cyan">
          <div className="space-y-2">
            <AnimatePresence>
              {requests.filter(r => r.status === 'pending').map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className={requestCardClass(request.type)}
                >
                  <div className="font-mono text-sm text-slate-900 dark:text-tactical-text">
                    {t('simulators.gateway.items.request_id', { id: request.id })}
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                    {t('simulators.gateway.items.type', { type: request.type })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>

        <Panel title={t('simulators.gateway.columns.apigw')} accent="amber">
          <div className="space-y-2">
            <AnimatePresence>
              {requests.filter(r => r.status === 'routing').map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={requestCardClass(request.type)}
                >
                  <div className="font-mono text-sm text-slate-900 dark:text-tactical-text">
                    {t('simulators.gateway.items.routing_to', { id: request.id })}
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                    {t('simulators.gateway.items.to_service', { service: services.find(s => s.type === request.type)?.name })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>

        <Panel title={t('simulators.gateway.columns.microservices')} accent="green">
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.type} className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-3">
                <div className="font-sans text-sm font-medium text-slate-900 dark:text-tactical-text mb-1">{service.name}</div>
                <div className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{service.description}</div>
                <div className="font-mono text-xs text-slate-500 dark:text-tactical-label mt-1">
                  {t('simulators.gateway.items.processing_time', { ms: service.processingTime })}
                  <br />
                  {t('simulators.gateway.items.base_error_rate', { percent: (service.errorRate * 100).toFixed(1) })}
                </div>
                <AnimatePresence>
                  {requests
                    .filter(r => (r.status === 'completed' || r.status === 'rejected') && r.type === service.type)
                    .map(request => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-2 font-mono text-xs p-2 border border-slate-200 dark:border-tactical-border"
                      >
                        {request.status === 'rejected' ? (
                          <StatusBadge variant="classified" label={`${t('simulators.gateway.items.error')} #${request.id}`} />
                        ) : (
                          <StatusBadge variant="completed" label={`${t('simulators.gateway.items.processing')} #${request.id}`} />
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
