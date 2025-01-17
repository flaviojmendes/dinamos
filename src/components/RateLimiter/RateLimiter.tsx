import { useState, useEffect, useCallback } from 'react';

interface Request {
  id: number;
  timestamp: number;
  status: 'accepted' | 'rejected';
}

interface Metrics {
  totalRequests: number;
  acceptedRequests: number;
  rejectedRequests: number;
}

export default function RateLimiter() {
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [requestsPerSecond, setRequestsPerSecond] = useState(5);
  const [messageRate, setMessageRate] = useState(5);
  const [maxTokens, setMaxTokens] = useState(10);
  const [tokens, setTokens] = useState(maxTokens);
  const [requests, setRequests] = useState<Request[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setRequests([]);
    setTokens(maxTokens);
    setMetrics({
      totalRequests: 0,
      acceptedRequests: 0,
      rejectedRequests: 0
    });
  }, [maxTokens]);

  // Token replenishment
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTokens(prev => Math.min(maxTokens, prev + requestsPerSecond / 10));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, requestsPerSecond, maxTokens]);

  // Request generation
  useEffect(() => {
    if (!isRunning) return;

    const generateRequest = () => {
      const hasToken = tokens >= 1;
      const request: Request = {
        id: Date.now(),
        timestamp: Date.now(),
        status: hasToken ? 'accepted' : 'rejected'
      };

      if (hasToken) {
        setTokens(prev => prev - 1);
        setMetrics(prev => ({
          ...prev,
          acceptedRequests: prev.acceptedRequests + 1,
          totalRequests: prev.totalRequests + 1
        }));
      } else {
        setMetrics(prev => ({
          ...prev,
          rejectedRequests: prev.rejectedRequests + 1,
          totalRequests: prev.totalRequests + 1
        }));
      }

      setRequests(prev => [request, ...prev].slice(0, 5));
    };

    const requestInterval = setInterval(generateRequest, 1000 / messageRate);
    return () => clearInterval(requestInterval);
  }, [isRunning, tokens, messageRate]);

  return (
    <div className="p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Rate Limiter</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 font-medium transition-colors"
            >
              {isConfigOpen ? 'Fechar Config' : 'Configurar'}
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button
              onClick={resetSimulation}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 font-medium transition-colors"
            >
              Resetar
            </button>
          </div>
        </div>

        {isConfigOpen && (
          <div className="mb-6 bg-zinc-800/50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-zinc-400">
                  Taxa de Tokens (por segundo)
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
                  <span className="text-sm font-mono w-8 text-right">{requestsPerSecond}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-zinc-400">
                  Taxa de Mensagens (por segundo)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={messageRate}
                    onChange={e => setMessageRate(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8 text-right">{messageRate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-zinc-400">
                  Tamanho do Bucket
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={maxTokens}
                    onChange={e => {
                      const newMax = Number(e.target.value);
                      setMaxTokens(newMax);
                      setTokens(prev => Math.min(prev, newMax));
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8 text-right">{maxTokens}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Token Bucket Visualization */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
              <h2 className="text-lg font-medium">Token Bucket</h2>
              <div className="text-sm text-zinc-400">
                Taxa: {requestsPerSecond} tokens/s
              </div>
            </div>
            <div className="relative h-32 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
              <div 
                className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                style={{ height: `${(tokens / maxTokens) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {Math.round(tokens)}/{maxTokens}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
              <h2 className="text-lg font-medium">Últimas Requisições</h2>
              <div className="text-sm text-zinc-400">
                Taxa: {messageRate} msgs/s
              </div>
            </div>
            <div className="space-y-2">
              {requests.map(request => (
                <div
                  key={request.id}
                  className={`flex flex-wrap items-center gap-2 p-2 rounded-md ${
                    request.status === 'accepted' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  <span className="text-lg">
                    {request.status === 'accepted' ? '✓' : '✗'}
                  </span>
                  <span className="flex-1 min-w-[120px]">
                    {request.status === 'accepted' ? 'Requisição aceita' : 'Requisição rejeitada'}
                  </span>
                  <span className="text-sm opacity-75">
                    {((Date.now() - request.timestamp) / 1000).toFixed(1)}s
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Total de Requisições</div>
            <div className="text-2xl font-medium">{metrics.totalRequests}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Aceitas</div>
            <div className="text-2xl font-medium text-green-400">
              {metrics.acceptedRequests}
              <span className="text-sm text-zinc-400 ml-1">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.acceptedRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-1">Rejeitadas</div>
            <div className="text-2xl font-medium text-red-400">
              {metrics.rejectedRequests}
              <span className="text-sm text-zinc-400 ml-1">
                ({metrics.totalRequests > 0 
                  ? Math.round((metrics.rejectedRequests / metrics.totalRequests) * 100) 
                  : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 