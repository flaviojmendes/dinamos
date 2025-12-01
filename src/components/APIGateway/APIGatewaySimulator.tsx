import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

  // Function to generate a new request
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

  // Function to process a request through its lifecycle
  const processRequest = useCallback((request: Request) => {
    const service = services.find(s => s.type === request.type)!;
    
    // Update stats
    setStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }));
    
    // Step 1: Add request to pending
    setRequests(prev => [...prev, request]);
    
    // Step 2: Route request after delay
    const routingTimer = setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === request.id ? { ...req, status: 'routing' } : req
        )
      );
    }, config.routingDelay);

    // Step 3: Process request and determine success/failure
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

    // Step 4: Remove request after completion
    const removalTimer = setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== request.id));
    }, config.removeDelay);

    return () => {
      clearTimeout(routingTimer);
      clearTimeout(processingTimer);
      clearTimeout(removalTimer);
    };
  }, [config.routingDelay, config.errorRate, config.removeDelay]);

  // Main simulation loop
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

  // Reset simulation
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

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400">
          {t('simulators.gateway.title')}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {t('simulators.gateway.description')}
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            if (isSimulationRunning) {
              setIsSimulationRunning(false);
            } else {
              resetSimulation();
              setIsSimulationRunning(true);
            }
          }}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isSimulationRunning 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSimulationRunning ? t('simulators.gateway.buttons.stop') : t('simulators.gateway.buttons.start')}
        </button>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-6 py-3 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 hover:bg-zinc-700 text-white transition-colors"
        >
          {showConfig ? t('simulators.gateway.buttons.hide_config') : t('simulators.gateway.buttons.show_config')}
        </button>
        <button
          onClick={resetSimulation}
          className="px-6 py-3 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 hover:bg-zinc-700 text-white transition-colors"
        >
          {t('simulators.gateway.buttons.reset')}
        </button>
      </div>

      {showConfig && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('simulators.gateway.config.title')}</h3>
            <button
              onClick={() => setConfig(defaultConfig)}
              className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              {t('simulators.gateway.buttons.restore_defaults')}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {t('simulators.gateway.config.rps', { value: config.requestsPerSecond })}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={config.requestsPerSecond}
                onChange={(e) => setConfig(prev => ({ ...prev, requestsPerSecond: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {t('simulators.gateway.config.routing_delay', { ms: config.routingDelay })}
              </label>
              <input
                type="range"
                min="500"
                max="2000"
                step="100"
                value={config.routingDelay}
                onChange={(e) => setConfig(prev => ({ ...prev, routingDelay: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {t('simulators.gateway.config.extra_error_rate', { percent: (config.errorRate * 100).toFixed(1) })}
              </label>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.01"
                value={config.errorRate}
                onChange={(e) => setConfig(prev => ({ ...prev, errorRate: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                {t('simulators.gateway.config.removal_delay', { ms: config.removeDelay })}
              </label>
              <input
                type="range"
                min="2000"
                max="8000"
                step="500"
                value={config.removeDelay}
                onChange={(e) => setConfig(prev => ({ ...prev, removeDelay: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.gateway.stats.total')}</div>
          <div className="text-2xl font-bold text-white">{stats.totalRequests}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.gateway.stats.success')}</div>
          <div className="text-2xl font-bold text-green-500">{stats.successfulRequests}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">{t('simulators.gateway.stats.error')}</div>
          <div className="text-2xl font-bold text-red-500">{stats.failedRequests}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clients */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('simulators.gateway.columns.clients')}</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {requests.filter(r => r.status === 'pending').map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className={`p-4 rounded ${services.find(s => s.type === request.type)?.color} bg-opacity-20 border-l-4 ${services.find(s => s.type === request.type)?.color}`}
                >
                  <div className="text-sm font-medium">
                    {t('simulators.gateway.items.request_id', { id: request.id })}
                  </div>
                  <div className="text-xs opacity-75">
                    {t('simulators.gateway.items.type', { type: request.type })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* API Gateway */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('simulators.gateway.columns.apigw')}</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {requests.filter(r => r.status === 'routing').map(request => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`p-4 rounded ${services.find(s => s.type === request.type)?.color} bg-opacity-20 border-l-4 ${services.find(s => s.type === request.type)?.color}`}
                >
                  <div className="text-sm font-medium">
                    {t('simulators.gateway.items.routing_to', { id: request.id })}
                  </div>
                  <div className="text-xs opacity-75">
                    {t('simulators.gateway.items.to_service', { service: services.find(s => s.type === request.type)?.name })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Microservices */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t('simulators.gateway.columns.microservices')}</h3>
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.type} className={`p-4 rounded ${service.color} bg-opacity-10`}>
                <div className="font-medium mb-1">{service.name}</div>
                <div className="text-sm opacity-75">{service.description}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                        className={`mt-2 text-sm p-2 rounded ${
                          request.status === 'rejected' 
                            ? 'bg-red-900 bg-opacity-20 text-red-200' 
                            : 'bg-black bg-opacity-20'
                        }`}
                      >
                        {request.status === 'rejected' ? t('simulators.gateway.items.error') : t('simulators.gateway.items.processing')} #{request.id}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 