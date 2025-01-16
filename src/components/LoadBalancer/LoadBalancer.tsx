import { useState, useEffect } from 'react';

interface Node {
  id: number;
  status: 'active' | 'starting' | 'stopping';
  requests: number;
  throughput: number;
  load: number;
  latency: number;
  algorithm: 'round-robin' | 'least-connections' | 'weighted';
  weight: number;
}

interface Config {
  maxLoad: number;
  baseLatency: number;
  loadImpact: number;
  defaultNodeThroughput: number;
  algorithm: 'round-robin' | 'least-connections' | 'weighted';
}

interface Metrics {
  processed: number;
  dropped: number;
  successRate: number;
  distribution: { [key: number]: number };
}

export default function LoadBalancer() {
  // Basic state
  const [nodes, setNodes] = useState<Node[]>([
    { 
      id: 1, 
      status: 'active', 
      requests: 0, 
      throughput: 10, 
      load: 0, 
      latency: 100,
      algorithm: 'round-robin',
      weight: 1
    }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [requestsPerSecond, setRequestsPerSecond] = useState(5);
  const [totalRequests, setTotalRequests] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>({
    processed: 0,
    dropped: 0,
    successRate: 100,
    distribution: { 1: 0 }
  });
  const [avgLatency, setAvgLatency] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState<Config>({
    maxLoad: 100,
    baseLatency: 100,
    loadImpact: 2,
    defaultNodeThroughput: 10,
    algorithm: 'round-robin'
  });

  // Add new node
  const addNode = () => {
    const newNode: Node = {
      id: nodes.length + 1,
      status: 'starting',
      requests: 0,
      throughput: config.defaultNodeThroughput,
      load: 0,
      latency: config.baseLatency,
      algorithm: config.algorithm,
      weight: 1
    };
    setNodes(prev => [...prev, newNode]);
    setMetrics(prev => ({
      ...prev,
      distribution: { ...prev.distribution, [newNode.id]: 0 }
    }));
    
    setTimeout(() => {
      setNodes(prev => 
        prev.map(node => 
          node.id === newNode.id ? { ...node, status: 'active' } : node
        )
      );
    }, 2000);
  };

  // Update node throughput
  const updateNodeThroughput = (nodeId: number, newThroughput: number) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, throughput: newThroughput } : node
      )
    );
  };

  // Update node weight
  const updateNodeWeight = (nodeId: number, newWeight: number) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, weight: newWeight } : node
      )
    );
  };

  // Remove node
  const removeNode = (nodeId: number) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, status: 'stopping' } : node
      )
    );
    
    setTimeout(() => {
      setNodes(prev => prev.filter(node => node.id !== nodeId));
      setMetrics(prev => {
        const newDistribution = { ...prev.distribution };
        delete newDistribution[nodeId];
        return { ...prev, distribution: newDistribution };
      });
    }, 2000);
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setNodes([{ 
      id: 1, 
      status: 'active', 
      requests: 0, 
      throughput: config.defaultNodeThroughput, 
      load: 0, 
      latency: config.baseLatency,
      algorithm: config.algorithm,
      weight: 1
    }]);
    setTotalRequests(0);
    setMetrics({
      processed: 0,
      dropped: 0,
      successRate: 100,
      distribution: { 1: 0 }
    });
    setAvgLatency(0);
  };

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const simulationInterval = setInterval(() => {
      // Get active nodes
      const activeNodes = nodes.filter(n => n.status === 'active');
      if (activeNodes.length === 0) return;

      // Calculate total system capacity
      const totalCapacity = activeNodes.reduce((sum, node) => sum + node.throughput, 0);
      const totalWeight = config.algorithm === 'weighted' 
        ? activeNodes.reduce((sum, node) => sum + node.weight, 0)
        : activeNodes.length;

      // Calculate processed and dropped requests
      const processedRequests = Math.min(requestsPerSecond, totalCapacity);
      const droppedRequests = Math.max(0, requestsPerSecond - totalCapacity);

      // Update total requests and metrics
      setTotalRequests(prev => prev + requestsPerSecond);

      // Distribute requests based on selected algorithm
      const nodeRequests = new Map<number, number>();
      let remainingRequests = processedRequests;

      switch (config.algorithm) {
        case 'round-robin':
          // Simple round-robin distribution
          const baseRequests = Math.floor(remainingRequests / activeNodes.length);
          const extraRequests = remainingRequests % activeNodes.length;
          activeNodes.forEach((node, index) => {
            nodeRequests.set(node.id, baseRequests + (index < extraRequests ? 1 : 0));
          });
          break;

        case 'least-connections':
          // Sort nodes by current load
          const sortedByLoad = [...activeNodes].sort((a, b) => a.load - b.load);
          sortedByLoad.forEach(node => {
            const allocated = Math.min(
              remainingRequests,
              node.throughput - node.requests
            );
            nodeRequests.set(node.id, allocated);
            remainingRequests -= allocated;
          });
          break;

        case 'weighted':
          // Distribute based on weights
          activeNodes.forEach(node => {
            const share = node.weight / totalWeight;
            const allocated = Math.min(
              Math.round(processedRequests * share),
              node.throughput
            );
            nodeRequests.set(node.id, allocated);
          });
          break;
      }

      // Update nodes with their current load and latency
      setNodes(prev => 
        prev.map(node => {
          if (node.status !== 'active') return node;

          const nodeRequests = nodeRequests.get(node.id) || 0;
          const load = Math.min(100, (nodeRequests / node.throughput) * 100);
          const loadFactor = load / 100;
          const latency = config.baseLatency * (1 + (loadFactor * config.loadImpact));

          return {
            ...node,
            requests: nodeRequests,
            load,
            latency: Math.round(latency)
          };
        })
      );

      // Update metrics
      setMetrics(prev => {
        const newProcessed = prev.processed + processedRequests;
        const newDropped = prev.dropped + droppedRequests;
        const total = newProcessed + newDropped;
        const newDistribution = { ...prev.distribution };
        
        activeNodes.forEach(node => {
          const nodeRequests = nodeRequests.get(node.id) || 0;
          newDistribution[node.id] = (newDistribution[node.id] || 0) + nodeRequests;
        });

        return {
          processed: newProcessed,
          dropped: newDropped,
          successRate: total > 0 ? Math.round((newProcessed / total) * 100) : 100,
          distribution: newDistribution
        };
      });

      // Update average latency
      const newAvgLatency = activeNodes.reduce((sum, node) => sum + node.latency, 0) / activeNodes.length;
      setAvgLatency(Math.round(newAvgLatency));
    }, 1000);

    return () => clearInterval(simulationInterval);
  }, [isRunning, nodes, requestsPerSecond, config]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Load Balancer
            </h2>
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="px-3 py-1 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurações
            </button>
          </div>

          {isConfigOpen && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-white">Parâmetros de Simulação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Algoritmo
                  </label>
                  <select
                    value={config.algorithm}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      algorithm: e.target.value as 'round-robin' | 'least-connections' | 'weighted'
                    }))}
                    className="w-full px-3 py-2 bg-zinc-700 rounded-md text-white"
                  >
                    <option value="round-robin">Round Robin</option>
                    <option value="least-connections">Least Connections</option>
                    <option value="weighted">Weighted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Latência Base (ms)
                  </label>
                  <input
                    type="number"
                    value={config.baseLatency}
                    onChange={(e) => setConfig(prev => ({ ...prev, baseLatency: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-zinc-700 rounded-md text-white"
                    min="10"
                    max="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Impacto da Carga
                  </label>
                  <input
                    type="number"
                    value={config.loadImpact}
                    onChange={(e) => setConfig(prev => ({ ...prev, loadImpact: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-zinc-700 rounded-md text-white"
                    min="0.1"
                    max="10"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Throughput Padrão (req/s)
                  </label>
                  <input
                    type="number"
                    value={config.defaultNodeThroughput}
                    onChange={(e) => setConfig(prev => ({ ...prev, defaultNodeThroughput: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-zinc-700 rounded-md text-white"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2 rounded-md font-medium transition-colors text-white ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button
              onClick={resetSimulation}
              className="px-6 py-2 text-white bg-gray-800 rounded-md font-medium hover:bg-zinc-700 transition-colors"
            >
              Reiniciar
            </button>
            <div className="flex items-center gap-3">
              <label className="font-medium text-white">Requisições/s:</label>
              <input
                type="range"
                value={requestsPerSecond}
                onChange={(e) => setRequestsPerSecond(Number(e.target.value))}
                className="w-32 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                min="1"
                max="100"
              />
              <span className="w-12 text-center text-white">{requestsPerSecond}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Latência Média</h3>
              <p className="text-3xl font-bold text-blue-400">{avgLatency}ms</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Throughput</h3>
              <p className="text-3xl font-bold text-green-400">{Math.min(requestsPerSecond, nodes.reduce((sum, node) => sum + (node.status === 'active' ? node.throughput : 0), 0))} req/s</p>
              <p className="text-sm text-zinc-400">Requisitado: {requestsPerSecond} req/s</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Requisições</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-purple-400">{metrics.processed}</p>
                <p className="text-sm text-zinc-400">processadas</p>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-xl font-bold text-red-400">{metrics.dropped}</p>
                <p className="text-sm text-zinc-400">perdidas</p>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Taxa de Sucesso</h3>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${
                  metrics.successRate > 90 ? 'text-green-400' :
                  metrics.successRate > 70 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {metrics.successRate}%
                </p>
              </div>
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    metrics.successRate > 90 ? 'bg-green-500' :
                    metrics.successRate > 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${metrics.successRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nodes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Nodes ({nodes.length})</h3>
              <button
                onClick={addNode}
                className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Node
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`bg-gray-800 p-4 rounded-lg border-2 transition-all duration-300 ${
                    node.status === 'active'
                      ? 'border-green-500'
                      : node.status === 'starting'
                      ? 'border-yellow-500'
                      : 'border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-medium text-white">Node {node.id}</h4>
                      <span className={`text-sm ${
                        node.status === 'active' 
                          ? 'text-green-400' 
                          : node.status === 'starting'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                      </span>
                    </div>
                    {node.status === 'active' && (
                      <button
                        onClick={() => removeNode(node.id)}
                        className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">Carga</span>
                        <span className={`font-medium ${
                          node.load > 80 ? 'text-red-400' : 
                          node.load > 60 ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {Math.round(node.load)}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            node.load > 80 ? 'bg-red-500' :
                            node.load > 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${node.load}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Requisições</span>
                      <span className="font-medium text-white">{node.requests} req/s</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Throughput Máx</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={node.throughput}
                          onChange={(e) => updateNodeThroughput(node.id, Number(e.target.value))}
                          className="w-16 px-1 py-0.5 bg-zinc-700 rounded text-right text-white"
                          min="1"
                          max="100"
                        />
                        <span className="text-white">req/s</span>
                      </div>
                    </div>

                    {config.algorithm === 'weighted' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Peso</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={node.weight}
                            onChange={(e) => updateNodeWeight(node.id, Number(e.target.value))}
                            className="w-16 px-1 py-0.5 bg-zinc-700 rounded text-right text-white"
                            min="1"
                            max="10"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Latência</span>
                      <span className="font-medium text-white">{node.latency}ms</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Distribuição</span>
                      <span className="font-medium text-white">
                        {metrics.distribution[node.id] 
                          ? ((metrics.distribution[node.id] / metrics.processed) * 100).toFixed(1)
                          : '0'}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 