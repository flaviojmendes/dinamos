import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTranslation } from 'react-i18next';

type LoadBalancerAlgorithm = 'roundRobin' | 'random' | 'leastConnections';

interface NodeData {
  label: string;
  capacity?: number;
  processingTime?: number;
  algorithm?: LoadBalancerAlgorithm;
  onCapacityChange?: (value: number) => void;
  onProcessingTimeChange?: (value: number) => void;
  onAlgorithmChange?: (value: LoadBalancerAlgorithm) => void;
  metrics?: {
    requestsPerSecond: number;
    activeRequests: number;
    responseTime: number;
    errorRate: number;
    load: number;
  };
}

// Node components with metrics display
const ClientNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-blue-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="font-bold text-white">{data.label}</div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-brand-600 dark:text-brand-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-red-300">{t('editor.metrics.error_rate')}: {data.metrics.errorRate.toFixed(1)}%</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
        </div>
      )}
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${data.metrics?.load || 0}%`,
            backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e',
          }}
        />
      </div>
    </div>
  );
};

const LoadBalancerNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-green-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="font-bold text-white">{data.label}</div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-brand-600 dark:text-brand-300 flex justify-between items-center">
            <span>{t('editor.metrics.active_connections')}:</span>
            <span className="font-bold text-lg">{data.metrics.activeRequests}</span>
          </div>
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.connections_limit')}</label>
        <input type="range" min="10" max="200" value={data.capacity || 100} onChange={(e) => data.onCapacityChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.capacity || 100} {t('editor.metrics.connections')}</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.algorithm')}</label>
        <select value={data.algorithm || 'roundRobin'} onChange={(e) => data.onAlgorithmChange?.(e.target.value as LoadBalancerAlgorithm)} className="w-full mt-1 bg-zinc-700 rounded px-2 py-1 text-white">
          <option value="roundRobin">Round Robin</option>
          <option value="random">{t('editor.metrics.random')}</option>
          <option value="leastConnections">{t('editor.metrics.least_connections')}</option>
        </select>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const ServerNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-purple-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="font-bold text-white">{data.label}</div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-brand-600 dark:text-brand-300 flex justify-between items-center">
            <span>{t('editor.metrics.active_connections')}:</span>
            <span className="font-bold text-lg">{data.metrics.activeRequests}</span>
          </div>
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.connections_limit')}</label>
        <input type="range" min="10" max="150" value={data.capacity || 50} onChange={(e) => data.onCapacityChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.capacity || 50} {t('editor.metrics.connections')}</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.processing_time_ms')}</label>
        <input type="range" min="10" max="500" value={data.processingTime || 100} onChange={(e) => data.onProcessingTimeChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.processingTime || 100}ms</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const DatabaseNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-yellow-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="font-bold text-white">{data.label}</div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-brand-600 dark:text-brand-300 flex justify-between items-center">
            <span>{t('editor.metrics.active_connections')}:</span>
            <span className="font-bold text-lg">{data.metrics.activeRequests}</span>
          </div>
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.connections_limit')}</label>
        <input type="range" min="10" max="100" value={data.capacity || 30} onChange={(e) => data.onCapacityChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.capacity || 30} {t('editor.metrics.connections')}</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const nodeTypes = {
  input: ClientNode,
  loadBalancer: LoadBalancerNode,
  server: ServerNode,
  database: DatabaseNode,
};

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Cliente' },
    position: { x: 400, y: 50 },
    className: 'bg-transparent border-none',
  },
  {
    id: '2',
    type: 'loadBalancer',
    data: { label: 'Balanceador' },
    position: { x: 400, y: 200 },
  },
  {
    id: '3',
    type: 'server',
    data: { label: 'Servidor 1' },
    position: { x: 200, y: 400 },
  },
  {
    id: '4',
    type: 'server',
    data: { label: 'Servidor 2' },
    position: { x: 600, y: 400 },
  },
  {
    id: '5',
    type: 'database',
    data: { label: 'Banco de Dados' },
    position: { x: 400, y: 600 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-5', source: '3', target: '5', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

// Add available components configuration
const availableComponents = [
  { type: 'input', label: 'Cliente', className: 'border-blue-500' },
  { type: 'loadBalancer', label: 'Balanceador', className: 'border-green-500' },
  { type: 'server', label: 'Servidor', className: 'border-purple-500' },
  { type: 'database', label: 'Banco de Dados', className: 'border-yellow-500' },
];

export default function SystemEditor() {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [clientRequestRate, setClientRequestRate] = useState(50);
  const [roundRobinCounters, setRoundRobinCounters] = useState<Record<string, number>>({});

  const onCapacityChange = useCallback((nodeId: string, capacity: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, capacity } }
          : node
      )
    );
  }, [setNodes]);

  const onProcessingTimeChange = useCallback((nodeId: string, processingTime: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, processingTime } }
          : node
      )
    );
  }, [setNodes]);

  const onAlgorithmChange = useCallback((nodeId: string, algorithm: LoadBalancerAlgorithm) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, algorithm } }
          : node
      )
    );
  }, [setNodes]);

  // Update simulateMetrics function
  const simulateMetrics = useCallback(() => {
    if (!isSimulationRunning) return;

    setNodes((nds) => {
      // First, calculate client requests
      const clientNode = nds.find(n => n.type === 'input');
      if (!clientNode) return nds;

      const clientRequests = clientRequestRate;
      const clientRandomFactor = 0.8 + Math.random() * 0.4;
      const totalRequests = Math.floor(clientRequests * clientRandomFactor);

      // Find all servers and load balancers
      const servers = nds.filter(n => n.type === 'server');
      const loadBalancers = nds.filter(n => n.type === 'loadBalancer');

      // Calculate request flow through the system
      const requestFlow = new Map<string, number>();
      const activeRequestsMap = new Map<string, number>();
      
      // Initialize client requests
      requestFlow.set(clientNode.id, totalRequests);

      // Calculate load balancer distribution
      loadBalancers.forEach(lb => {
        const lbIncomingEdges = edges.filter(e => e.target === lb.id);
        const incomingRequests = lbIncomingEdges
          .map(e => requestFlow.get(e.source) || 0)
          .reduce((sum, curr) => sum + curr, 0);

        // Calculate load balancer capacity and active requests
        const lbCapacity = lb.data.capacity || 100;
        const lbActiveRequests = Math.min(lbCapacity, Math.floor(incomingRequests * 0.1));
        activeRequestsMap.set(lb.id, lbActiveRequests);

        // Calculate how many requests the load balancer can handle
        const maxLbRequests = Math.min(incomingRequests, lbCapacity * 10); // Each connection can handle ~10 req/s
        const lbRequests = Math.floor(maxLbRequests * 0.95); // 5% loss at load balancer
        requestFlow.set(lb.id, lbRequests);

        // Find servers connected to this load balancer
        const connectedServers = edges
          .filter(e => e.source === lb.id)
          .map(e => nds.find(n => n.id === e.target))
          .filter(n => n?.type === 'server') as Node[];

        if (connectedServers.length > 0) {
          const algorithm = lb.data.algorithm || 'roundRobin';
          
          // Get server states for distribution decisions
          const serverStates = connectedServers.map(server => {
            const capacity = server.data.capacity || 50;
            const processingTime = server.data.processingTime || 100;
            const currentActive = server.data.metrics?.activeRequests || 0;
            return {
              server,
              capacity,
              processingTime,
              currentActive,
              available: Math.max(0, capacity - currentActive)
            };
          });

          let distributedRequests = new Map<string, number>();

          switch (algorithm) {
            case 'random':
              // Random distribution with capacity respect
              serverStates.forEach(({ server, capacity }) => {
                const randomFactor = 0.5 + Math.random();
                const baseShare = lbRequests / connectedServers.length;
                const maxForServer = Math.min(
                  capacity * 10, // Each connection can handle ~10 req/s
                  Math.floor(baseShare * randomFactor)
                );
                distributedRequests.set(server.id, maxForServer);
              });
              break;

            case 'leastConnections':
              // Distribute based on available capacity
              const totalAvailable = serverStates.reduce((sum, state) => sum + state.available, 0);
              
              if (totalAvailable > 0) {
                serverStates.forEach(({ server, available }) => {
                  const share = available / totalAvailable;
                  const maxForServer = Math.min(
                    available * 10, // Each connection can handle ~10 req/s
                    Math.floor(lbRequests * share)
                  );
                  distributedRequests.set(server.id, maxForServer);
                });
              } else {
                // Fallback to even distribution if all servers are at capacity
                const evenShare = Math.floor(lbRequests / connectedServers.length);
                serverStates.forEach(({ server }) => {
                  distributedRequests.set(server.id, evenShare);
                });
              }
              break;

            default: // Round Robin
              const currentCounter = roundRobinCounters[lb.id] || 0;
              setRoundRobinCounters(prev => ({
                ...prev,
                [lb.id]: (currentCounter + 1) % connectedServers.length
              }));
              
              const baseShare = Math.floor(lbRequests / connectedServers.length);
              serverStates.forEach(({ server, capacity }, index) => {
                const adjustedIndex = (index + currentCounter) % connectedServers.length;
                const serverShare = adjustedIndex === connectedServers.length - 1
                  ? lbRequests - (baseShare * (connectedServers.length - 1))
                  : baseShare;
                const maxForServer = Math.min(capacity * 10, serverShare);
                distributedRequests.set(server.id, maxForServer);
              });
              break;
          }

          // Apply the distribution and calculate active requests
          serverStates.forEach(({ server, processingTime }) => {
            const serverRequests = distributedRequests.get(server.id) || 0;
            requestFlow.set(server.id, serverRequests);

            // Calculate active requests based on processing time and capacity
            const activeTime = processingTime / 1000; // Convert to seconds
            const newActive = Math.floor(serverRequests * activeTime);
            const currentActive = activeRequestsMap.get(server.id) || 0;
            // Smooth transition for active requests
            const smoothedActive = Math.floor(currentActive * 0.7 + newActive * 0.3);
            activeRequestsMap.set(server.id, smoothedActive);
          });
        }
      });

      // Calculate database requests
      const databases = nds.filter(n => n.type === 'database');
      databases.forEach(db => {
        const dbIncomingEdges = edges.filter(e => e.target === db.id);
        const dbCapacity = db.data.capacity || 30;
        
        // Sum up incoming requests considering server processing times
        const incomingRequests = dbIncomingEdges
          .map(e => {
            const sourceNode = nds.find(n => n.id === e.source);
            const sourceRequests = requestFlow.get(e.source) || 0;
            
            if (sourceNode?.type === 'server') {
              const processingTime = sourceNode.data.processingTime || 100;
              // Longer processing time means fewer requests make it to the database
              return Math.floor(sourceRequests * (100 / processingTime));
            }
            return sourceRequests;
          })
          .reduce((sum, curr) => sum + curr, 0);

        // Calculate active database connections
        const dbActiveRequests = Math.min(
          dbCapacity,
          Math.floor(incomingRequests * 0.2) // Each request keeps connection active for ~200ms
        );
        activeRequestsMap.set(db.id, dbActiveRequests);
        
        // Calculate actual throughput based on capacity
        const maxDbRequests = Math.min(incomingRequests, dbCapacity * 15); // Each connection handles ~15 req/s
        const effectiveRequests = Math.floor(maxDbRequests * 0.9); // 10% cache hit rate
        requestFlow.set(db.id, effectiveRequests);
      });

      // Update metrics for each node
      return nds.map(node => {
        const nodeRequests = requestFlow.get(node.id) || 0;
        const activeRequests = activeRequestsMap.get(node.id) || 0;
        let metrics;

        switch (node.type) {
          case 'input':
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.1),
              responseTime: 50 + Math.random() * 20,
              errorRate: Math.random() * 2,
              load: Math.min(100, (nodeRequests / 100) * 100),
            };
            break;

          case 'loadBalancer':
            const lbCapacity = node.data.capacity || 100;
            const lbLoad = (activeRequests / lbCapacity) * 100;
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 20 + (lbLoad > 70 ? lbLoad : 0),
              errorRate: lbLoad > 80 ? 5 + Math.random() * 10 : Math.random() * 3,
              load: Math.min(100, lbLoad),
            };
            break;

          case 'server':
            const serverCapacity = node.data.capacity || 50;
            const processingTime = node.data.processingTime || 100;
            const serverLoad = (activeRequests / serverCapacity) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: processingTime * (1 + (serverLoad > 80 ? (serverLoad - 80) / 100 : 0)),
              errorRate: serverLoad > 80 ? 5 + Math.random() * 10 : Math.random() * 5,
              load: Math.min(100, serverLoad),
            };
            break;

          case 'database':
            const dbCapacity = node.data.capacity || 30;
            const dbLoad = (activeRequests / dbCapacity) * 100;
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 50 * (1 + (dbLoad > 70 ? (dbLoad - 70) / 100 : 0)),
              errorRate: dbLoad > 80 ? 3 + Math.random() * 7 : Math.random() * 3,
              load: Math.min(100, dbLoad),
            };
            break;

          default:
            return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            metrics,
            onCapacityChange: (value: number) => onCapacityChange(node.id, value),
            onProcessingTimeChange: (value: number) => onProcessingTimeChange(node.id, value),
            onAlgorithmChange: (value: LoadBalancerAlgorithm) => onAlgorithmChange(node.id, value),
          },
        };
      });
    });

    // Update edge animations and thicknesses
    setEdges((eds) => {
      return eds.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (!sourceNode?.data.metrics || !targetNode) return edge;

        const requestFlow = sourceNode.data.metrics.requestsPerSecond;
        const strokeWidth = Math.max(1, Math.min(8, Math.log10(requestFlow + 1) * 2));
        const targetLoad = targetNode.data.metrics?.load || 0;
        const stroke = targetLoad > 80 ? '#ef4444' : targetLoad > 60 ? '#eab308' : undefined;

        return {
          ...edge,
          animated: requestFlow > 0,
          style: { 
            ...edge.style, 
            strokeWidth,
            stroke,
          },
        };
      });
    });
  }, [isSimulationRunning, setNodes, setEdges, nodes, edges, clientRequestRate, onCapacityChange, onProcessingTimeChange, onAlgorithmChange, roundRobinCounters]);

  // Run simulation every second
  useEffect(() => {
    const interval = setInterval(simulateMetrics, 1000);
    return () => clearInterval(interval);
  }, [simulateMetrics]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (!type || !reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { 
          label: type === 'server' 
            ? `Servidor ${nodes.filter(n => n.type === 'server').length + 1}`
            : availableComponents.find(c => c.type === type)?.label || type
        },
        className: 'bg-slate-100 dark:bg-slate-800 border-none',
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onNodesDelete = useCallback((deleted: Node[]) => {
    // Remove any edges connected to deleted nodes
    setEdges((eds) => eds.filter(edge => 
      !deleted.some(node => node.id === edge.source || node.id === edge.target)
    ));
  }, [setEdges]);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-brand-600 dark:text-brand-400 mt-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-brand-600 dark:text-brand-400 font-semibold mb-1">{t('editor.dev_page.title')}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              {t('editor.dev_page.description')}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              <span className="text-yellow-400">{t('editor.labels.note_prefix', { provider: '' }).split('* ')[1]?.split(' (')[0]}</span> {t('editor.dev_page.note')}
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400">
          {t('editor.title')}
        </h1>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSimulationRunning(!isSimulationRunning)} className={`px-4 py-2 ${isSimulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition-colors`}>
              {isSimulationRunning ? t('editor.buttons.stop') : t('editor.buttons.start')}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-white">
                {t('editor.labels.client_rps')}
              </label>
              <input type="range" min="1" max="200" value={clientRequestRate} onChange={(e) => setClientRequestRate(Number(e.target.value))} className="w-48" />
              <span className="text-white min-w-[3rem]">{clientRequestRate}</span>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div>{t('editor.labels.load_status')}</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{t('editor.labels.normal')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>{t('editor.labels.warning')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>{t('editor.labels.critical')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '600px' }} className="bg-white dark:bg-slate-900 rounded-lg relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          deleteKeyCode={['Backspace', 'Delete']}
          draggable={true}
          fitView
          fitViewOptions={{ padding: 0.5, maxZoom: 1 }}
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        >
          <Panel position="top-left" className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold mb-2">{t('editor.labels.components')}</h3>
              <div className="flex flex-col gap-2">
                {availableComponents.map((component) => (
                  <div key={component.type} className={`px-4 py-2 bg-zinc-700 rounded cursor-move hover:bg-zinc-600 
                      transition-colors border-2 ${component.className} text-white`} onDragStart={(e) => onDragStart(e, component.type)} draggable>
                    {component.label}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
} 