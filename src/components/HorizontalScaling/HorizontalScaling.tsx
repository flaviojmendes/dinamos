import { useState, useEffect, useCallback } from 'react';

interface Node {
  id: string;
  status: 'active' | 'starting' | 'stopping' | 'inactive';
  load: number; // 0-100
  requestsHandled: number;
  latency: number; // ms
  currentRequests: number;
}

interface Request {
  id: number;
  timestamp: number;
  nodeId?: string;
  status: 'pending' | 'processing' | 'completed';
  startProcessingTime?: number;
  completionTime?: number;
}

interface Metrics {
  avgLatency: number;
  throughput: number; // requests/second
  totalRequests: number;
  successRate: number;
}

const BASE_LATENCY = 100; // ms
const MAX_NODE_REQUESTS = 5; // requests per node before performance degradation

export default function HorizontalScaling() {
  const [nodes, setNodes] = useState<Node[]>([
    { 
      id: 'node-1', 
      status: 'active', 
      load: 0, 
      requestsHandled: 0, 
      latency: BASE_LATENCY,
      currentRequests: 0
    },
  ]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [requestRate, setRequestRate] = useState(5); // requests per second
  const [metrics, setMetrics] = useState<Metrics>({
    avgLatency: 0,
    throughput: 0,
    totalRequests: 0,
    successRate: 100,
  });

  // Add a new node
  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      status: 'starting',
      load: 0,
      requestsHandled: 0,
      latency: BASE_LATENCY,
      currentRequests: 0
    };

    setNodes(prev => [...prev, newNode]);

    // Simulate node startup time
    setTimeout(() => {
      setNodes(prev =>
        prev.map(node =>
          node.id === newNode.id ? { ...node, status: 'active' } : node
        )
      );
    }, 3000);
  }, [nodes.length]);

  // Remove a node
  const removeNode = useCallback((nodeId: string) => {
    // Redistribute requests from the node being removed
    setRequests(prev => 
      prev.map(req => 
        req.nodeId === nodeId && req.status === 'processing'
          ? { ...req, status: 'pending', nodeId: undefined }
          : req
      )
    );

    setNodes(prev => {
      const updatedNodes = prev.map(node =>
        node.id === nodeId ? { ...node, status: 'stopping' as const } : node
      );

      setTimeout(() => {
        setNodes(current => current.filter(n => n.id !== nodeId));
      }, 2000);

      return updatedNodes;
    });
  }, []);

  // Generate new requests
  const generateRequest = useCallback(() => {
    const newRequest: Request = {
      id: Date.now(),
      timestamp: Date.now(),
      status: 'pending'
    };

    setRequests(prev => [...prev, newRequest]);
  }, []);

  // Process requests
  const processRequests = useCallback(() => {
    const now = Date.now();
    const activeNodes = nodes.filter(n => n.status === 'active');
    if (!activeNodes.length) return;

    // Update requests status
    setRequests(prev => {
      let updatedRequests = [...prev];

      // First, handle completed requests
      updatedRequests = updatedRequests.map(req => {
        if (req.status === 'processing' && req.startProcessingTime) {
          const node = nodes.find(n => n.id === req.nodeId);
          if (!node) return req;

          const processingTime = now - req.startProcessingTime;
          if (processingTime >= node.latency) {
            return {
              ...req,
              status: 'completed',
              completionTime: now
            };
          }
        }
        return req;
      });

      // Remove completed requests after a brief display period
      updatedRequests = updatedRequests.filter(req => {
        if (req.status === 'completed' && req.completionTime) {
          return (now - req.completionTime) < 1000;
        }
        return true;
      });

      // Assign pending requests to available nodes
      const pendingRequests = updatedRequests.filter(r => r.status === 'pending');
      pendingRequests.forEach(req => {
        // Find the least loaded node
        const targetNode = activeNodes.reduce((min, node) => 
          node.currentRequests < min.currentRequests ? node : min
        , activeNodes[0]);

        if (targetNode.currentRequests < MAX_NODE_REQUESTS * 2) {
          const index = updatedRequests.findIndex(r => r.id === req.id);
          if (index !== -1) {
            updatedRequests[index] = {
              ...req,
              nodeId: targetNode.id,
              status: 'processing',
              startProcessingTime: now
            };
          }
        }
      });

      return updatedRequests;
    });

    // Update node metrics
    setNodes(prev => 
      prev.map(node => {
        if (node.status !== 'active') return node;

        const nodeRequests = requests.filter(
          r => r.nodeId === node.id && r.status === 'processing'
        ).length;

        const loadFactor = Math.min(nodeRequests / MAX_NODE_REQUESTS, 2);
        const newLatency = BASE_LATENCY * (1 + loadFactor);

        return {
          ...node,
          currentRequests: nodeRequests,
          load: Math.min(100, (nodeRequests / MAX_NODE_REQUESTS) * 100),
          latency: newLatency
        };
      })
    );

    // Update global metrics
    const completedRequests = requests.filter(r => r.status === 'completed' && r.completionTime);
    if (completedRequests.length > 0) {
      setMetrics(prev => {
        const totalLatency = completedRequests.reduce((sum, req) => 
          sum + (req.completionTime! - req.timestamp)
        , 0);
        const avgLatency = totalLatency / completedRequests.length;
        const throughput = completedRequests.length / 
          ((now - completedRequests[0].timestamp) / 1000);

        return {
          avgLatency,
          throughput,
          totalRequests: prev.totalRequests + completedRequests.length,
          successRate: 100
        };
      });
    }
  }, [nodes, requests]);

  // Main simulation loop
  useEffect(() => {
    let intervals: number[] = [];
    
    if (isRunning) {
      // Generate requests at specified rate
      intervals.push(window.setInterval(generateRequest, 1000 / requestRate));
      
      // Process requests and update metrics more frequently
      intervals.push(window.setInterval(processRequests, 100));
    }

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [isRunning, requestRate, generateRequest, processRequests]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setRequests([]);
    setMetrics({
      avgLatency: 0,
      throughput: 0,
      totalRequests: 0,
      successRate: 100,
    });
    setNodes([{ 
      id: 'node-1', 
      status: 'active', 
      load: 0, 
      requestsHandled: 0, 
      latency: BASE_LATENCY,
      currentRequests: 0
    }]);
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4 md:mb-6">Escalabilidade Horizontal</h2>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Latência Média</h3>
            <p className="text-2xl font-bold text-white">
              {Math.round(metrics.avgLatency)}ms
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Throughput</h3>
            <p className="text-2xl font-bold text-white">
              {Math.round(metrics.throughput)} req/s
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total de Requisições</h3>
            <p className="text-2xl font-bold text-white">
              {metrics.totalRequests}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Taxa de Sucesso</h3>
            <p className="text-2xl font-bold text-white">
              {Math.round(metrics.successRate)}%
            </p>
          </div>
        </div>

        {/* Nodes Visualization */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Nodes</h3>
            <button
              onClick={addNode}
              disabled={nodes.length >= 5 || nodes.some(n => n.status === 'starting')}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Node
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map(node => (
              <div
                key={node.id}
                className={`bg-gray-800 p-4 rounded-lg border-2 transition-colors duration-300
                  ${node.status === 'active' ? 'border-green-500' : 
                    node.status === 'starting' ? 'border-yellow-500' :
                    node.status === 'stopping' ? 'border-red-500' :
                    'border-gray-700'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-medium">{node.id}</h4>
                    <span className={`text-sm
                      ${node.status === 'active' ? 'text-green-400' :
                        node.status === 'starting' ? 'text-yellow-400' :
                        node.status === 'stopping' ? 'text-red-400' :
                        'text-gray-400'}`}
                    >
                      {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                    </span>
                  </div>
                  {node.status === 'active' && nodes.length > 1 && (
                    <button
                      onClick={() => removeNode(node.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Load</span>
                      <span>{Math.round(node.load)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${node.load}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Requests Handled</span>
                    <span className="text-white">{node.requestsHandled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Latency</span>
                    <span className="text-white">{Math.round(node.latency)}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full sm:w-auto px-4 py-2 rounded font-medium transition-colors
                ${isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
                } text-white`}
            >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setRequests([]);
                setMetrics({
                  avgLatency: 0,
                  throughput: 0,
                  totalRequests: 0,
                  successRate: 100,
                });
                setNodes(nodes.map(node => ({
                  ...node,
                  load: 0,
                  requestsHandled: 0,
                  latency: 100,
                })));
              }}
              className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded font-medium hover:bg-gray-600"
            >
              Reiniciar
            </button>
          </div>

          {/* Configuration */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-white mb-1">
              <span className="mb-1 sm:mb-0">Taxa de Requisições (req/s)</span>
              <span className="text-blue-400">{requestRate}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={requestRate}
              onChange={(e) => setRequestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 