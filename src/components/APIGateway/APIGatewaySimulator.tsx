import { UserRound, Network, Server, Play, Pause } from 'lucide-react';
import { AnimatedMetric } from '../AISystems/motion';
import { SimulationActivity, FlowLink, useSimulationMotion } from '../simulation';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const requestCardClass = (_type: Request['type']) => 'sim-node rounded-lg p-3';

export default function APIGatewaySimulator() {
  const { t } = useTranslation();
  const { reducedMotion, transition } = useSimulationMotion();
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => { timers.current.delete(timer); callback(); }, delay);
    timers.current.add(timer);
    return timer;
  }, []);
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
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

    const routingTimer = schedule(() => {
      setRequests(prev =>
        prev.map(req =>
          req.id === request.id ? { ...req, status: 'routing' } : req
        )
      );
    }, config.routingDelay);

    const processingTimer = schedule(() => {
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

    const removalTimer = schedule(() => {
      setRequests(prev => prev.filter(req => req.id !== request.id));
    }, Math.max(config.removeDelay, config.routingDelay + service.processingTime + 400));

    return () => {
      clearTimeout(routingTimer);
      clearTimeout(processingTimer);
      clearTimeout(removalTimer);
    };
  }, [config.routingDelay, config.errorRate, config.removeDelay, schedule]);

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
    timers.current.forEach(clearTimeout); timers.current.clear();
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
    <div className="simulation-workspace space-y-6">
      <div className="sim-controls"><SimulationActivity active={isSimulationRunning} /></div>

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
          {isSimulationRunning ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {isSimulationRunning ? t('simulators.gateway.buttons.stop') : t('simulators.gateway.buttons.start')}
        </TacticalButton>
        <TacticalButton size="sm" variant="ghost" aria-expanded={showConfig} onClick={() => setShowConfig(!showConfig)}>
          {showConfig ? t('simulators.gateway.buttons.hide_config') : t('simulators.gateway.buttons.show_config')}
        </TacticalButton>
        <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
          {t('simulators.gateway.buttons.reset')}
        </TacticalButton>

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

      <div className="sim-stage flex items-center gap-3 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center gap-2 text-center text-xs sm:text-sm"><UserRound size={26} aria-hidden="true" />{t('simulators.gateway.columns.clients')}</div>
        <FlowLink active={requests.some(r => r.status === 'pending')} eventKey={requestCount} />
        <div className="sim-node flex min-w-0 flex-col items-center gap-2 p-4 text-center text-xs sm:text-sm"><Network size={26} aria-hidden="true" />{t('simulators.gateway.columns.apigw')}</div>
        <FlowLink active={requests.some(r => r.status === 'routing')} tone="green" />
        <div className="flex min-w-0 flex-col items-center gap-2 text-center text-xs sm:text-sm"><Server size={26} aria-hidden="true" />{t('simulators.gateway.columns.microservices')}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AnimatedMetric value={stats.totalRequests} label={t('simulators.gateway.stats.total')} color="cyan" pulse={isSimulationRunning} />
        <AnimatedMetric value={stats.successfulRequests} label={t('simulators.gateway.stats.success')} color="green" />
        <AnimatedMetric value={stats.failedRequests} label={t('simulators.gateway.stats.error')} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title={t('simulators.gateway.columns.clients')} accent="cyan">
          <div className="min-h-32 space-y-2">
            <AnimatePresence initial={false} mode="popLayout">
              {requests.filter(r => r.status === 'pending').map(request => (
                <motion.div
                  key={request.id}
                  layout={!reducedMotion}
                  transition={transition}
                  initial={{ opacity: 0, x: reducedMotion ? 0 : -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reducedMotion ? 0 : 14 }}
                  className={requestCardClass(request.type)}
                >
                  <div className="font-sans text-sm text-slate-900 dark:text-tactical-text">
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
          <div className="min-h-32 space-y-2">
            <AnimatePresence initial={false} mode="popLayout">
              {requests.filter(r => r.status === 'routing').map(request => (
                <motion.div
                  key={request.id}
                  layout={!reducedMotion}
                  transition={transition}
                  initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={requestCardClass(request.type)}
                >
                  <div className="font-sans text-sm text-slate-900 dark:text-tactical-text">
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
              <div key={service.type} className={`sim-node p-4 ${requests.some(r => r.type === service.type && r.status === 'routing') ? 'sim-node-active' : ''}`}>
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
                        layout={!reducedMotion}
                        transition={transition}
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
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
