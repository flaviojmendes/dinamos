import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

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

const resourceStatusVariant = (status: Resource['status']) => {
  switch (status) {
    case 'healthy': return 'active' as const;
    case 'degraded': return 'in-progress' as const;
    case 'failed': return 'classified' as const;
  }
};

const requestStatusVariant = (status: Request['status']) => {
  switch (status) {
    case 'success': return 'active' as const;
    case 'fallback': return 'in-progress' as const;
    case 'error': return 'classified' as const;
  }
};

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

  useEffect(() => {
    if (!isRunning) return;

    const generateRequest = () => {
      const primaryResource = resources.find(r => r.id === 'primary')!;
      const secondaryResource = resources.find(r => r.id === 'secondary')!;
      
      const shouldFail = (resource: Resource) => 
        Math.random() * 100 < resource.failureRate;

      const requestId = Date.now();
      
      setAnimatedRequests(prev => [...prev, {
        id: requestId,
        status: 'trying-primary',
        progress: 0
      }]);

      const animate = () => {
        setAnimatedRequests(prev => {
          const request = prev.find(r => r.id === requestId);
          if (!request) return prev;

          const newProgress = request.progress + 2;
          
          if (newProgress >= 100) {
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
      
      if (primaryResource.status !== 'failed' && !shouldFail(primaryResource)) {
        request = {
          id: requestId,
          timestamp: Date.now(),
          resourceId: 'primary',
          status: 'success',
          latency: primaryResource.latency * (1 + Math.random() * 0.2)
        };
      } 
      else if (secondaryResource.status !== 'failed' && !shouldFail(secondaryResource)) {
        request = {
          id: requestId,
          timestamp: Date.now(),
          resourceId: 'secondary',
          status: 'fallback',
          latency: secondaryResource.latency * (1 + Math.random() * 0.2)
        };
      }
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

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ MECANISMO DE FALLBACK ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          Simulação de fallback entre recurso principal e secundário com taxa de falha configurável.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
          {isConfigOpen ? 'Fechar Config' : 'Configurar'}
        </TacticalButton>
        <TacticalButton size="sm" variant={isRunning ? 'danger' : 'primary'} onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Parar' : 'Iniciar'}
        </TacticalButton>
        <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
          Resetar
        </TacticalButton>
      </div>

      {isConfigOpen && (
        <Panel title="Configuração" accent="cyan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block label-mono text-slate-500 dark:text-tactical-label">
                Requisições por Segundo
              </label>
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="20" value={requestsPerSecond} onChange={e => setRequestsPerSecond(Number(e.target.value))} className={rangeClass} />
                <span className="font-mono text-sm w-6 text-signal-cyan">{requestsPerSecond}</span>
              </div>
            </div>
            {resources.map(resource => (
              <div key={resource.id} className="space-y-2">
                <label className="block label-mono text-slate-500 dark:text-tactical-label">
                  Taxa de Falha - {resource.name}
                </label>
                <div className="flex items-center gap-2">
                  <input type="range" min="0" max="100" value={resource.failureRate} onChange={e => {
                    const newRate = Number(e.target.value);
                    setResources(prev => prev.map(r => 
                      r.id === resource.id ? { ...r, failureRate: newRate } : r
                    ));
                  }} className={rangeClass} />
                  <span className="font-mono text-sm w-8 text-signal-cyan">{resource.failureRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel title="Fluxo de Requisições" accent="amber">
        <div className="relative h-[400px] flex flex-col items-center">
          <div className="w-40 h-24 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-sm font-medium text-slate-900 dark:text-tactical-text">Cliente</div>
              <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim mt-1">{requestsPerSecond} req/s</div>
            </div>
          </div>
          <div className="mt-20">
            <div className={`w-40 h-24 border bg-slate-50 dark:bg-tactical-raised flex items-center justify-center transition-colors ${
              resources[0].status === 'healthy' ? 'border-signal-green/50' :
              resources[0].status === 'degraded' ? 'border-signal-amber/50' :
              'border-signal-red/50'
            }`}>
              <div className="text-center">
                <div className="font-mono text-sm font-medium text-slate-900 dark:text-tactical-text">Principal</div>
                <StatusBadge
                  variant={resourceStatusVariant(resources[0].status)}
                  label={resources[0].status === 'healthy' ? 'Saudável' : resources[0].status === 'degraded' ? 'Degradado' : 'Falho'}
                />
              </div>
            </div>
          </div>
          <div className="mt-20">
            <div className={`w-40 h-24 border bg-slate-50 dark:bg-tactical-raised flex items-center justify-center transition-colors ${
              resources[1].status === 'healthy' ? 'border-signal-green/50' :
              resources[1].status === 'degraded' ? 'border-signal-amber/50' :
              'border-signal-red/50'
            }`}>
              <div className="text-center">
                <div className="font-mono text-sm font-medium text-slate-900 dark:text-tactical-text">Secundário</div>
                <StatusBadge
                  variant={resourceStatusVariant(resources[1].status)}
                  label={resources[1].status === 'healthy' ? 'Saudável' : resources[1].status === 'degraded' ? 'Degradado' : 'Falho'}
                />
              </div>
            </div>
          </div>
          <AnimatePresence>
            {animatedRequests.map(request => (
              <motion.div
                key={request.id}
                className={`absolute w-3 h-3 rounded-full ${
                  request.status === 'trying-primary' ? 'bg-signal-green' : 'bg-signal-amber'
                }`}
                initial={{ top: 48, left: '50%', x: '-50%', scale: 0 }}
                animate={{ top: request.status === 'trying-primary' ? 168 : 312, scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            ))}
          </AnimatePresence>
          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-signal-green" />
              <span className="font-mono text-xs text-slate-600 dark:text-tactical-dim">Requisição Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-signal-amber" />
              <span className="font-mono text-xs text-slate-600 dark:text-tactical-dim">Requisição Fallback</span>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Status dos Recursos" accent="green">
          <div className="space-y-4">
            {resources.map(resource => (
              <div key={resource.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-slate-900 dark:text-tactical-text">{resource.name}</span>
                  <StatusBadge
                    variant={resourceStatusVariant(resource.status)}
                    label={resource.status === 'healthy' ? 'Saudável' : resource.status === 'degraded' ? 'Degradado' : 'Falho'}
                  />
                </div>
                <div className="h-2 border border-slate-200 dark:border-tactical-border bg-slate-100 dark:bg-tactical-raised overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      resource.status === 'healthy' ? 'bg-signal-green' :
                      resource.status === 'degraded' ? 'bg-signal-amber' :
                      'bg-signal-red'
                    }`}
                    style={{ width: `${100 - resource.failureRate}%` }}
                  />
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                  Taxa de Falha: {resource.failureRate}% | Latência: {resource.latency}ms
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Últimas Requisições"
          accent="cyan"
          action={<span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">Taxa: {requestsPerSecond} req/s</span>}
        >
          <div className="space-y-2">
            {requests.map(request => (
              <div
                key={request.id}
                className="flex items-center gap-2 p-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised"
              >
                <StatusBadge variant={requestStatusVariant(request.status)} dot={false} label={
                  request.status === 'success' ? '✓' : request.status === 'fallback' ? '⚠' : '✗'
                } />
                <span className="flex-1 font-mono text-sm text-slate-900 dark:text-tactical-text">
                  {request.status === 'success' ? 'Sucesso (Principal)' :
                   request.status === 'fallback' ? 'Sucesso (Secundário)' :
                   'Falha Total'}
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                  {request.status !== 'error' ? `${Math.round(request.latency)}ms` : '-'}
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                  Nenhuma requisição ainda
                </p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{metrics.totalRequests}</div>
          <div className="label-mono mt-2">Total de Requisições</div>
        </div>
        <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">
            {metrics.successfulRequests}
            <span className="text-sm text-slate-500 dark:text-tactical-dim ml-1">
              ({metrics.totalRequests > 0 ? Math.round((metrics.successfulRequests / metrics.totalRequests) * 100) : 0}%)
            </span>
          </div>
          <div className="label-mono mt-2">Sucesso (Principal)</div>
        </div>
        <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber">
            {metrics.fallbackRequests}
            <span className="text-sm text-slate-500 dark:text-tactical-dim ml-1">
              ({metrics.totalRequests > 0 ? Math.round((metrics.fallbackRequests / metrics.totalRequests) * 100) : 0}%)
            </span>
          </div>
          <div className="label-mono mt-2">Fallback (Secundário)</div>
        </div>
        <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
          <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red">
            {metrics.failedRequests}
            <span className="text-sm text-slate-500 dark:text-tactical-dim ml-1">
              ({metrics.totalRequests > 0 ? Math.round((metrics.failedRequests / metrics.totalRequests) * 100) : 0}%)
            </span>
          </div>
          <div className="label-mono mt-2">Falhas Totais</div>
        </div>
      </div>
    </div>
  );
}
