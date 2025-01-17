import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resource {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'failed';
  latency: number;
  failureRate: number;
}

interface Request {
  id: number;
  timestamp: number;
  resourceId: string;
  status: 'success' | 'error' | 'fallback';
  latency: number;
}

interface Metrics {
  totalRequests: number;
  successfulRequests: number;
  fallbackRequests: number;
  failedRequests: number;
  averageLatency: number;
}

interface AnimatedRequest {
  id: number;
  status: 'trying-primary' | 'success' | 'trying-secondary' | 'fallback' | 'error';
  progress: number;
}

export default function Fallback() {
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [requestsPerSecond, setRequestsPerSecond] = useState(5);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 'primary',
      name: 'Recurso Principal',
      status: 'healthy',
      latency: 100,
      failureRate: 0
    },
    {
      id: 'secondary',
      name: 'Recurso Secundário',
      status: 'healthy',
      latency: 200,
      failureRate: 0
    }
  ]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRequests: 0,
    successfulRequests: 0,
    fallbackRequests: 0,
    failedRequests: 0,
    averageLatency: 0
  });
  const [animatedRequests, setAnimatedRequests] = useState<AnimatedRequest[]>([]);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setRequests([]);
    setResources(prev => prev.map(resource => ({
      ...resource,
      status: 'healthy',
      failureRate: 0
    })));
    setMetrics({
      totalRequests: 0,
      successfulRequests: 0,
      fallbackRequests: 0,
      failedRequests: 0,
      averageLatency: 0
    });
  }, []);

  // Resource status monitoring
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setResources(prev => prev.map(resource => {
        const newStatus = resource.failureRate >= 80 ? 'failed' :
                         resource.failureRate >= 30 ? 'degraded' : 
                         'healthy';
        return { ...resource, status: newStatus };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Request generation
  useEffect(() => {
    if (!isRunning) return;

    const generateRequest = () => {
      const primaryResource = resources.find(r => r.id === 'primary')!;
      const secondaryResource = resources.find(r => r.id === 'secondary')!;
      
      const shouldFail = (resource: Resource) => 
        Math.random() * 100 < resource.failureRate;

      const requestId = Date.now();
      
      // Start with trying primary
      setAnimatedRequests(prev => [...prev, {
        id: requestId,
        status: 'trying-primary',
        progress: 0
      }]);

      // Animate the request
      const animate = () => {
        setAnimatedRequests(prev => {
          const request = prev.find(r => r.id === requestId);
          if (!request) return prev;

          const newProgress = request.progress + 2;
          
          if (newProgress >= 100) {
            // Decide next state based on current status
            if (request.status === 'trying-primary') {
              const primaryFailed = primaryResource.status === 'failed' || shouldFail(primaryResource);
              if (!primaryFailed) {
                return prev.filter(r => r.id !== requestId);
              } else {
                return prev.map(r => r.id === requestId ? {
                  ...r,
                  status: 'trying-secondary',
                  progress: 0
                } : r);
              }
            } else if (request.status === 'trying-secondary') {
              const secondaryFailed = secondaryResource.status === 'failed' || shouldFail(secondaryResource);
              return prev.filter(r => r.id !== requestId);
            }
            return prev.filter(r => r.id !== requestId);
          }

          return prev.map(r => 
            r.id === requestId ? { ...r, progress: newProgress } : r
          );
        });
      };

      const animationInterval = setInterval(animate, 20);
      setTimeout(() => clearInterval(animationInterval), 5000);

      let request: Request;
      
      // Try primary first
      if (primaryResource.status !== 'failed' && !shouldFail(primaryResource)) {
        request = {
          id: requestId,
          timestamp: Date.now(),
          resourceId: 'primary',
          status: 'success',
          latency: primaryResource.latency * (1 + Math.random() * 0.2)
        };
      } 
      // Try secondary if primary fails
      else if (secondaryResource.status !== 'failed' && !shouldFail(secondaryResource)) {
        request = {
          id: requestId,
          timestamp: Date.now(),
          resourceId: 'secondary',
          status: 'fallback',
          latency: secondaryResource.latency * (1 + Math.random() * 0.2)
        };
      }
      // Both failed
      else {
        request = {
          id: requestId,
          timestamp: Date.now(),
          resourceId: 'none',
          status: 'error',
          latency: 0
        };
      }

      setRequests(prev => [request, ...prev].slice(0, 5));
      setMetrics(prev => {
        const newMetrics = {
          totalRequests: prev.totalRequests + 1,
          successfulRequests: prev.successfulRequests + (request.status === 'success' ? 1 : 0),
          fallbackRequests: prev.fallbackRequests + (request.status === 'fallback' ? 1 : 0),
          failedRequests: prev.failedRequests + (request.status === 'error' ? 1 : 0),
          averageLatency: request.status !== 'error' 
            ? (prev.averageLatency * prev.totalRequests + request.latency) / (prev.totalRequests + 1)
            : prev.averageLatency
        };
        return newMetrics;
      });
    };

    const requestInterval = setInterval(generateRequest, 1000 / requestsPerSecond);
    return () => clearInterval(requestInterval);
  }, [isRunning, resources, requestsPerSecond]);

  return (
    <div className="p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Mecanismo de Fallback</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 font-medium transition-colors"
            >
              {isConfigOpen ? 'Fechar Config' : 'Configurar'}
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button
              onClick={resetSimulation}
              className="px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 font-medium transition-colors"
            >
              Resetar
            </button>
          </div>
        </div>

        {isConfigOpen && (
          <div className="mb-6 bg-zinc-800/50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-zinc-400">
                  Requisições por Segundo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={requestsPerSecond}
                    onChange={e => setRequestsPerSecond(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-6">{requestsPerSecond}</span>
                </div>
              </div>

              {resources.map(resource => (
                <div key={resource.id} className="space-y-2">
                  <label className="block text-sm text-zinc-400">
                    Taxa de Falha - {resource.name}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={resource.failureRate}
                      onChange={e => {
                        const newRate = Number(e.target.value);
                        setResources(prev => prev.map(r => 
                          r.id === resource.id ? { ...r, failureRate: newRate } : r
                        ));
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-8">{resource.failureRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flow Visualization */}
        <div className="mb-6 bg-zinc-800/50 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Fluxo de Requisições</h2>
          <div className="relative h-[400px] flex flex-col items-center">
            {/* Client */}
            <div className="w-40 h-24 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <div className="text-center">
                <div className="text-sm font-medium">Cliente</div>
                <div className="text-xs text-zinc-400 mt-1">{requestsPerSecond} req/s</div>
              </div>
            </div>

            {/* Primary Resource */}
            <div className="mt-20">
              <div className={`w-40 h-24 bg-zinc-800 rounded-lg flex items-center justify-center border transition-colors ${
                resources[0].status === 'healthy' ? 'border-green-500/50' :
                resources[0].status === 'degraded' ? 'border-yellow-500/50' :
                'border-red-500/50'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-medium">Principal</div>
                  <div className={`text-xs mt-1 ${
                    resources[0].status === 'healthy' ? 'text-green-400' :
                    resources[0].status === 'degraded' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {resources[0].status === 'healthy' ? 'Saudável' :
                     resources[0].status === 'degraded' ? 'Degradado' :
                     'Falho'}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Resource */}
            <div className="mt-20">
              <div className={`w-40 h-24 bg-zinc-800 rounded-lg flex items-center justify-center border transition-colors ${
                resources[1].status === 'healthy' ? 'border-green-500/50' :
                resources[1].status === 'degraded' ? 'border-yellow-500/50' :
                'border-red-500/50'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-medium">Secundário</div>
                  <div className={`text-xs mt-1 ${
                    resources[1].status === 'healthy' ? 'text-green-400' :
                    resources[1].status === 'degraded' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {resources[1].status === 'healthy' ? 'Saudável' :
                     resources[1].status === 'degraded' ? 'Degradado' :
                     'Falho'}
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Requests */}
            <AnimatePresence>
              {animatedRequests.map(request => (
                <motion.div
                  key={request.id}
                  className={`absolute w-3 h-3 rounded-full ${
                    request.status === 'trying-primary' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  initial={{ 
                    top: 48,
                    left: '50%',
                    x: '-50%',
                    scale: 0
                  }}
                  animate={{ 
                    top: request.status === 'trying-primary' ? 168 : 312,
                    scale: 1
                  }}
                  exit={{ 
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Requisição Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Requisição Fallback</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Resources Status */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Status dos Recursos</h2>
            <div className="space-y-4">
              {resources.map(resource => (
                <div key={resource.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{resource.name}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      resource.status === 'healthy' ? 'bg-green-500/20 text-green-300' :
                      resource.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {resource.status === 'healthy' ? 'Saudável' :
                       resource.status === 'degraded' ? 'Degradado' :
                       'Falho'}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        resource.status === 'healthy' ? 'bg-green-500' :
                        resource.status === 'degraded' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${100 - resource.failureRate}%` }}
                    />
                  </div>
                  <div className="text-sm text-zinc-400">
                    Taxa de Falha: {resource.failureRate}% | Latência: {resource.latency}ms
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Últimas Requisições</h2>
              <div className="text-sm text-zinc-400">
                Taxa: {requestsPerSecond} req/s
              </div>
            </div>
            <div className="space-y-2">
              {requests.map(request => (
                <div
                  key={request.id}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    request.status === 'success' ? 'bg-green-500/20 text-green-300' :
                    request.status === 'fallback' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}
                >
                  <span className="text-lg">
                    {request.status === 'success' ? '✓' :
                     request.status === 'fallback' ? '⚠' : '✗'}
                  </span>
                  <span className="flex-1">
                    {request.status === 'success' ? 'Sucesso (Principal)' :
                     request.status === 'fallback' ? 'Sucesso (Secundário)' :
                     'Falha Total'}
                  </span>
                  <span className="text-sm opacity-75">
                    {request.status !== 'error' ? `${Math.round(request.latency)}ms` : '-'}
                  </span>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-zinc-500 text-center py-4">
                  Nenhuma requisição ainda
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Total de Requisições</div>
            <div className="text-2xl font-medium">{metrics.totalRequests}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Sucesso (Principal)</div>
            <div className="text-2xl font-medium text-green-400">
              {metrics.successfulRequests}
              <span className="text-sm text-zinc-400 ml-1">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.successfulRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Fallback (Secundário)</div>
            <div className="text-2xl font-medium text-yellow-400">
              {metrics.fallbackRequests}
              <span className="text-sm text-zinc-400 ml-1">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.fallbackRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Falhas Totais</div>
            <div className="text-2xl font-medium text-red-400">
              {metrics.failedRequests}
              <span className="text-sm text-zinc-400 ml-1">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.failedRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 