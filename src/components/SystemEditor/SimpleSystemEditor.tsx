import { useCallback, useState, useEffect, useRef } from 'react';
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
  EdgeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Users,
  Server,
  Database as DatabaseIcon,
  Network,
  Shield,
  HardDrive,
  MessageSquare,
} from 'lucide-react';

interface NodeData {
  label: string;
  throughput?: number;
  algorithm?: 'roundRobin';
  rateLimit?: number;
  hitRate?: number; // For cache
  maxQueue?: number; // For message queue
  dequeueRate?: number; // For message queue
  onThroughputChange?: (value: number) => void;
  onAlgorithmChange?: (value: 'roundRobin') => void;
  onRateLimitChange?: (value: number) => void;
  onHitRateChange?: (value: number) => void; // For cache
  onDequeueRateChange?: (value: number) => void; // For message queue
  onMaxQueueChange?: (value: number) => void; // For message queue
  metrics?: {
    requestsPerSecond: number;
    activeRequests: number;
    responseTime: number;
    load: number;
    failedRequests: number;
    throttledRequests?: number;
    cumulativeLatency?: number;
    cacheHits?: number;
    cacheMisses?: number;
    hitRate?: number;
    queueLength?: number;
    droppedMessages?: number;
    dequeueRate?: number;
    maxQueue?: number;
  };
}

// Define the structure of the .din file format
interface DistributedSystemDesign {
  nodes: Node<NodeData>[];
  edges: Edge[];
  version: string;
}

// Node components with metrics display
const ClientNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-blue-500 bg-zinc-800 min-w-[180px]">
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <Users className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
        <div className="text-cyan-300">Latência total: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
        <div className="text-red-300">Falhas/s: {data.metrics.failedRequests}</div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Requisições/s:</label>
      <input
        type="range"
        min="1"
        max="200"
        value={data.throughput || 50}
        onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.throughput || 50} req/s</div>
    </div>
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

const ServerNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-purple-500 bg-zinc-800 min-w-[180px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <Server className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
        <div className="text-cyan-300">Latência total: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
        <div className="text-red-300">Falhas/s: {data.metrics.failedRequests}</div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Throughput (req/s):</label>
      <input
        type="range"
        min="10"
        max="200"
        value={data.throughput || 100}
        onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.throughput || 100} req/s</div>
    </div>
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

const DatabaseNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-yellow-500 bg-zinc-800 min-w-[180px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <DatabaseIcon className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
        <div className="text-cyan-300">Latência total: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
        <div className="text-red-300">Falhas/s: {data.metrics.failedRequests}</div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Throughput (req/s):</label>
      <input
        type="range"
        min="10"
        max="200"
        value={data.throughput || 50}
        onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.throughput || 50} req/s</div>
    </div>
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

const LoadBalancerNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-green-500 bg-zinc-800 min-w-[180px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <Network className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
        <div className="text-cyan-300">Latência total: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
        <div className="text-red-300">Falhas/s: {data.metrics.failedRequests}</div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Throughput (req/s):</label>
      <input
        type="range"
        min="10"
        max="300"
        value={data.throughput || 150}
        onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.throughput || 150} req/s</div>
    </div>
    <div className="mt-2 text-xs text-white">
      <label>Algoritmo:</label>
      <select
        value={data.algorithm || 'roundRobin'}
        onChange={(e) => data.onAlgorithmChange?.(e.target.value as 'roundRobin')}
        className="w-full mt-1 bg-zinc-700 rounded px-2 py-1 text-white"
      >
        <option value="roundRobin">Round Robin</option>
      </select>
    </div>
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

const APIGatewayNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-indigo-500 bg-zinc-800 min-w-[220px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <Shield className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
        <div className="text-cyan-300">Latência total: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
        <div className="text-red-300">Falhas/s: {data.metrics.failedRequests}</div>
        <div className="text-orange-300 flex justify-between">
          <span>Throttled/s:</span> 
          <span className="font-bold">{data.metrics.throttledRequests || 0}</span>
        </div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Throughput (req/s):</label>
      <input
        type="range"
        min="10"
        max="300"
        value={data.throughput || 200}
        onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.throughput || 200} req/s</div>
    </div>
    <div className="mt-2 text-xs text-white">
      <label>Rate Limit (req/s):</label>
      <input
        type="range"
        min="10"
        max="250"
        value={data.rateLimit || 100}
        onChange={(e) => data.onRateLimitChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.rateLimit || 100} req/s</div>
    </div>
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

// CacheNode component
const CacheNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-pink-500 bg-zinc-800 min-w-[200px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <HardDrive className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-pink-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
        <div className="text-cyan-300">Latência total: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
        <div className="text-yellow-300">Hits/s: {data.metrics.cacheHits}</div>
        <div className="text-red-300">Misses/s: {data.metrics.cacheMisses}</div>
        <div className="text-purple-300">Hit Rate: {Math.round((data.metrics.hitRate ?? 0) * 100)}%</div>
        <div className="text-red-300">Falhas/s: {data.metrics.failedRequests}</div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Throughput (req/s):</label>
      <input
        type="range"
        min="10"
        max="300"
        value={data.throughput || 100}
        onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.throughput || 100} req/s</div>
    </div>
    <div className="mt-2 text-xs text-white">
      <label>Hit Rate (%):</label>
      <input
        type="range"
        min="0"
        max="100"
        value={data.hitRate !== undefined ? Math.round(data.hitRate * 100) : 80}
        onChange={(e) => data.onHitRateChange?.(Number(e.target.value) / 100)}
        className="w-full"
      />
      <div className="text-right">{data.hitRate !== undefined ? Math.round(data.hitRate * 100) : 80}%</div>
    </div>
    <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-500"
        style={{
          width: `${data.metrics?.load || 0}%`,
          backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#ec4899',
        }}
      />
    </div>
  </div>
);

// MessageQueueNode component
const MessageQueueNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-orange-500 bg-zinc-800 min-w-[220px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="flex items-center gap-2 font-bold text-white">
      <MessageSquare className="w-4 h-4" />
      {data.label}
    </div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-orange-300">Fila: {data.metrics.queueLength}</div>
        <div className="text-yellow-300">Enfileiradas/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Desenfileiradas/s: {data.metrics.dequeueRate}</div>
        <div className="text-red-300">Descartadas/s: {data.metrics.droppedMessages}</div>
        <div className="text-cyan-300">Latência: {data.metrics.responseTime.toFixed(0)}ms</div>
      </div>
    )}
    <div className="mt-2 text-xs text-white">
      <label>Capacidade da Fila:</label>
      <input
        type="range"
        min="10"
        max="500"
        value={data.maxQueue || 100}
        onChange={(e) => data.onMaxQueueChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.maxQueue || 100}</div>
    </div>
    <div className="mt-2 text-xs text-white">
      <label>Desenfileirar (msgs/s):</label>
      <input
        type="range"
        min="1"
        max="200"
        value={data.dequeueRate || 50}
        onChange={(e) => data.onDequeueRateChange?.(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-right">{data.dequeueRate || 50} msgs/s</div>
    </div>
    <div className="mt-3 flex gap-0.5">
      {Array.from({ length: 10 }).map((_, index) => {
        const queuePercentage = ((data.metrics?.queueLength || 0) / (data.maxQueue || 100)) * 100;
        const blockPercentage = (index + 1) * 10;
        const isActive = queuePercentage >= blockPercentage;
        const isWarning = queuePercentage >= 80;
        const isDanger = queuePercentage >= 90;
        
        return (
          <div
            key={index}
            className={`h-4 flex-1 rounded-sm transition-colors ${
              isActive
                ? isDanger
                  ? 'bg-red-500'
                  : isWarning
                    ? 'bg-yellow-500'
                    : 'bg-orange-500'
                : 'bg-zinc-700'
            }`}
          />
        );
      })}
    </div>
  </div>
);

const nodeTypes = {
  client: ClientNode,
  server: ServerNode,
  database: DatabaseNode,
  loadBalancer: LoadBalancerNode,
  apiGateway: APIGatewayNode,
  cache: CacheNode,
  messageQueue: MessageQueueNode,
};

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'client',
    data: { label: 'Cliente' },
    position: { x: 400, y: 50 },
  },
  {
    id: '2',
    type: 'loadBalancer',
    data: { label: 'Balanceador', algorithm: 'roundRobin' },
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
    position: { x: 400, y: 550 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-5', source: '3', target: '5', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

// Available components configuration
const availableComponents = [
  { type: 'client', label: 'Cliente', className: 'border-blue-500', icon: Users },
  { type: 'loadBalancer', label: 'Balanceador', className: 'border-green-500', icon: Network },
  { type: 'apiGateway', label: 'API Gateway', className: 'border-indigo-500', icon: Shield },
  { type: 'cache', label: 'Cache', className: 'border-pink-500', icon: HardDrive },
  { type: 'messageQueue', label: 'Message Queue', className: 'border-orange-500', icon: MessageSquare },
  { type: 'server', label: 'Servidor', className: 'border-purple-500', icon: Server },
  { type: 'database', label: 'Banco de Dados', className: 'border-yellow-500', icon: DatabaseIcon },
];

export default function SimpleSystemEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [roundRobinCounters, setRoundRobinCounters] = useState<Record<string, number>>({});
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    edgeId: string;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  
  // Hidden file input for importing
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onThroughputChange = useCallback((nodeId: string, throughput: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, throughput } }
          : node
      )
    );
  }, [setNodes]);

  const onAlgorithmChange = useCallback((nodeId: string, algorithm: 'roundRobin') => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, algorithm } }
          : node
      )
    );
  }, [setNodes]);

  const onRateLimitChange = useCallback((nodeId: string, rateLimit: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, rateLimit } }
          : node
      )
    );
  }, [setNodes]);

  const onHitRateChange = useCallback((nodeId: string, hitRate: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, hitRate } }
          : node
      )
    );
  }, [setNodes]);

  const onDequeueRateChange = useCallback((nodeId: string, dequeueRate: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, dequeueRate } }
          : node
      )
    );
  }, [setNodes]);

  const onMaxQueueChange = useCallback((nodeId: string, maxQueue: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, maxQueue } }
          : node
      )
    );
  }, [setNodes]);

  // Simulation function
  const simulateMetrics = useCallback(() => {
    if (!isSimulationRunning) return;

    setNodes((nds) => {
      // Calculate request flow through the system
      const requestFlow = new Map<string, number>(); // edgeId -> flow
      const failedRequestsMap = new Map<string, number>();
      const throttledRequestsMap = new Map<string, number>();
      const activeRequestsMap = new Map<string, number>();
      
      // --- Topological Sort Helper ---
      function topologicalSort(nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] {
        const inDegree: Record<string, number> = {};
        const graph: Record<string, string[]> = {};
        nodes.forEach(node => {
          inDegree[node.id] = 0;
          graph[node.id] = [];
        });
        edges.forEach(edge => {
          inDegree[edge.target]++;
          graph[edge.source].push(edge.target);
        });
        const queue: string[] = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
        const sorted: Node<NodeData>[] = [];
        const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
        while (queue.length > 0) {
          const id = queue.shift()!;
          sorted.push(nodeMap[id]);
          for (const neighbor of graph[id]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) queue.push(neighbor);
          }
        }
        return sorted;
      }

      // --- Unified Node Processing in Topological Order ---
      const sortedNodes = topologicalSort(nds, edges);
      sortedNodes.forEach(node => {
        const incomingEdges = edges.filter(e => e.target === node.id);
        const incomingRequests = incomingEdges
          .map(e => requestFlow.get(e.id) || 0)
          .reduce((sum, curr) => sum + curr, 0);
        switch (node.type) {
          case 'client': {
            const throughput = node.data.throughput || 50;
            const randomFactor = 0.9 + Math.random() * 0.2;
            const outgoingRequests = Math.floor(throughput * randomFactor);
            // Set outgoing requests for all outgoing edges
            edges.filter(e => e.source === node.id).forEach(e => {
              requestFlow.set(e.id, outgoingRequests);
            });
            failedRequestsMap.set(node.id, 0);
            break;
          }
          case 'cache': {
            const cacheThroughput = node.data.throughput || 100;
            const cacheHitRate = node.data.hitRate !== undefined ? node.data.hitRate : 0.8;
            const processed = Math.min(incomingRequests, cacheThroughput);
            const failedRequestsCache = incomingRequests - processed;
            const cacheHits = Math.floor(processed * cacheHitRate);
            const cacheMisses = processed - cacheHits;
            const activeRequestsCache = Math.ceil(processed * 0.05);
            // Only misses go downstream
            const missesToSend = cacheMisses;
            // Distribute misses to downstream nodes
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(missesToSend / outgoingEdges.length);
              const remainder = missesToSend % outgoingEdges.length;
              let totalDistributed = 0;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
                totalDistributed += share;
              });
              if (totalDistributed !== missesToSend) {
                console.warn(`Cache distributed ${totalDistributed} misses but should have distributed ${missesToSend}`);
              }
            }
            failedRequestsMap.set(node.id, failedRequestsCache);
            activeRequestsMap.set(node.id, activeRequestsCache);
            node.data.metrics = {
              requestsPerSecond: incomingRequests,
              activeRequests: activeRequestsCache,
              responseTime: 5 + Math.random() * 5,
              load: Math.min(100, (incomingRequests / cacheThroughput) * 100),
              failedRequests: failedRequestsCache,
              cacheHits,
              cacheMisses,
              hitRate: cacheHitRate,
            };
            break;
          }
          case 'apiGateway': {
            const throughput = node.data.throughput || 200;
            const rateLimit = node.data.rateLimit || 100;
            let requestsAfterRateLimit = Math.min(incomingRequests, rateLimit);
            let throttledRequests = Math.max(0, incomingRequests - rateLimit);
            let requestsAfterThroughput = Math.min(requestsAfterRateLimit, throughput);
            let failedRequests = Math.max(0, requestsAfterRateLimit - throughput);
            const activeRequests = Math.ceil(requestsAfterThroughput * 0.05);
            // Distribute to downstream nodes
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(requestsAfterThroughput / outgoingEdges.length);
              const remainder = requestsAfterThroughput % outgoingEdges.length;
              let totalDistributed = 0;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
                totalDistributed += share;
              });
              if (totalDistributed !== requestsAfterThroughput) {
                console.warn(`API Gateway distributed ${totalDistributed} requests but should have distributed ${requestsAfterThroughput}`);
              }
            }
            throttledRequestsMap.set(node.id, throttledRequests);
            failedRequestsMap.set(node.id, failedRequests);
            activeRequestsMap.set(node.id, activeRequests);
            break;
          }
          case 'loadBalancer': {
            const throughput = node.data.throughput || 150;
            const maxHandled = Math.min(incomingRequests, throughput);
            const failedRequests = incomingRequests - maxHandled;
            // Distribute to downstream nodes
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(maxHandled / outgoingEdges.length);
              const remainder = maxHandled % outgoingEdges.length;
              let totalDistributed = 0;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
                totalDistributed += share;
              });
              if (totalDistributed !== maxHandled) {
                console.warn(`Load balancer distributed ${totalDistributed} requests but should have distributed ${maxHandled}`);
              }
            }
            failedRequestsMap.set(node.id, failedRequests);
            activeRequestsMap.set(node.id, Math.ceil(maxHandled * 0.05));
            break;
          }
          case 'server': {
            const throughput = node.data.throughput || 100;
            const maxHandled = Math.min(incomingRequests, throughput);
            const failedRequests = incomingRequests - maxHandled;
            // Distribute to downstream nodes
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(maxHandled / outgoingEdges.length);
              const remainder = maxHandled % outgoingEdges.length;
              let totalDistributed = 0;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
                totalDistributed += share;
              });
              if (totalDistributed !== maxHandled) {
                console.warn(`Server distributed ${totalDistributed} requests but should have distributed ${maxHandled}`);
              }
            }
            failedRequestsMap.set(node.id, failedRequests);
            const activeRequests = Math.ceil(maxHandled * 0.1);
            activeRequestsMap.set(node.id, activeRequests);
            break;
          }
          case 'database': {
            const throughput = node.data.throughput || 50;
            const maxHandled = Math.min(incomingRequests, throughput);
            const failedRequests = incomingRequests - maxHandled;
            // No outgoing edges for database
            failedRequestsMap.set(node.id, failedRequests);
            const activeRequests = Math.ceil(maxHandled * 0.1);
            activeRequestsMap.set(node.id, activeRequests);
            break;
          }
          case 'messageQueue': {
            // Persistent queue state per node
            if (!('queueState' in node.data)) {
              (node.data as any).queueState = { length: 0 };
            }
            const queueState = (node.data as any).queueState;
            const maxQueue = node.data.maxQueue || 100;
            const dequeueRate = node.data.dequeueRate || 50;
            // Enqueue incoming requests up to maxQueue
            const toEnqueue = incomingRequests;
            let dropped = 0;
            if (queueState.length + toEnqueue > maxQueue) {
              dropped = queueState.length + toEnqueue - maxQueue;
              queueState.length = maxQueue;
            } else {
              queueState.length += toEnqueue;
            }
            // Dequeue up to dequeueRate
            const toDequeue = Math.min(queueState.length, dequeueRate);
            queueState.length -= toDequeue;
            // Forward dequeued messages to downstream nodes
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(toDequeue / outgoingEdges.length);
              const remainder = toDequeue % outgoingEdges.length;
              let totalDistributed = 0;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
                totalDistributed += share;
              });
              if (totalDistributed !== toDequeue) {
                console.warn(`MessageQueue distributed ${totalDistributed} but should have distributed ${toDequeue}`);
              }
            }
            // Latency is proportional to queue length
            const responseTime = 5 + queueState.length * 2;
            node.data.metrics = {
              requestsPerSecond: toEnqueue,
              dequeueRate: toDequeue,
              queueLength: queueState.length,
              droppedMessages: dropped,
              responseTime,
              load: Math.min(100, (queueState.length / maxQueue) * 100),
              failedRequests: 0,
              maxQueue,
              activeRequests: toDequeue,
            };
            break;
          }
          default:
            break;
        }
      });

      // Update metrics for each node
      const cumulativeLatencyMap = new Map<string, number>();

      // First, set cumulative latency for client nodes to their own response time
      nds.forEach(node => {
        if (node.type === 'client' && node.data.metrics) {
          cumulativeLatencyMap.set(node.id, node.data.metrics.responseTime);
        }
      });

      // Now, for all other nodes, propagate cumulative latency from their sources
      nds.forEach(node => {
        if (node.type !== 'client' && node.data.metrics) {
          // Find all incoming edges
          const incomingEdges = edges.filter(e => e.target === node.id);
          // Get the max cumulative latency from all sources
          let maxSourceLatency = 0;
          incomingEdges.forEach(edge => {
            const sourceLatency = cumulativeLatencyMap.get(edge.source) || 0;
            if (sourceLatency > maxSourceLatency) maxSourceLatency = sourceLatency;
          });
          // This node's cumulative latency is its own response time plus max of sources
          cumulativeLatencyMap.set(node.id, node.data.metrics.responseTime + maxSourceLatency);
        }
      });

      return nds.map(node => {
        // Always sum the incoming edges' request flows for this node
        const incomingEdges = edges.filter(e => e.target === node.id);
        const nodeRequests = incomingEdges
          .map(e => requestFlow.get(e.id) || 0)
          .reduce((sum, curr) => sum + curr, 0);
        const activeRequests = activeRequestsMap.get(node.id) || 0;
        const failedRequests = failedRequestsMap.get(node.id) || 0;
        const throttledRequests = throttledRequestsMap.get(node.id) || 0;
        let metrics;

        switch (node.type) {
          case 'client':
            const clientThroughput = node.data.throughput || 50;
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.05),
              responseTime: 100 + Math.random() * 50,
              load: Math.min(100, (nodeRequests / clientThroughput) * 100),
              failedRequests: failedRequests,
            };
            break;

          case 'server':
            const serverThroughput = node.data.throughput || 100;
            const serverLoad = (nodeRequests / serverThroughput) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 30 + (serverLoad > 80 ? (serverLoad - 80) * 2 : 0) + Math.random() * 10,
              load: Math.min(100, serverLoad),
              failedRequests: failedRequests,
            };
            break;

          case 'database':
            const dbThroughput = node.data.throughput || 50;
            const dbLoad = (nodeRequests / dbThroughput) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 10 + (dbLoad > 80 ? (dbLoad - 80) * 5 : 0) + Math.random() * 5,
              load: Math.min(100, dbLoad),
              failedRequests: failedRequests,
            };
            break;

          case 'loadBalancer':
            const lbThroughput = node.data.throughput || 150;
            const lbLoad = (nodeRequests / lbThroughput) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 10 + (lbLoad > 80 ? (lbLoad - 80) : 0) + Math.random() * 5,
              load: Math.min(100, lbLoad),
              failedRequests,
            };
            break;

          case 'apiGateway':
            const gatewayThroughput = node.data.throughput || 200;
            const gatewayRateLimit = node.data.rateLimit || 100;
            
            // Get incoming requests to this gateway directly from source nodes
            const gatewayIncomingEdges = edges.filter(e => e.target === node.id);
            const gatewayIncomingRequests = gatewayIncomingEdges
              .map(e => {
                const sourceNode = nds.find(n => n.id === e.source);
                return sourceNode?.data.metrics?.requestsPerSecond || 0;
              })
              .reduce((sum, curr) => sum + curr, 0);
            
            // Get the actual throttled and failed requests from our simulation
            const actualThrottled = throttledRequests;
            const actualFailed = failedRequests;
            
            // Calculate load based on throughput capacity
            const gatewayLoad = (nodeRequests / gatewayThroughput) * 100;
            
            // Response time calculation factors
            const isThrottling = actualThrottled > 0;
            const baseResponseTime = 20; // Base response time in ms
            const loadFactor = gatewayLoad > 70 ? (gatewayLoad - 70) * 0.5 : 0;
            const throttlingFactor = isThrottling ? 10 : 0; // Additional latency when throttling is active
            
            metrics = {
              requestsPerSecond: nodeRequests, // Successfully processed requests
              activeRequests,
              responseTime: baseResponseTime + loadFactor + throttlingFactor + Math.random() * 5,
              load: Math.min(100, gatewayLoad),
              failedRequests: actualFailed,
              throttledRequests: actualThrottled,
            };
            break;

          case 'cache':
            // Only set metrics here; forwarding of misses is handled in the first simulation pass
            metrics = node.data.metrics || {
              requestsPerSecond: 0,
              activeRequests: 0,
              responseTime: 0,
              load: 0,
              failedRequests: 0,
              cacheHits: 0,
              cacheMisses: 0,
              hitRate: 0,
            };
            break;

          case 'messageQueue':
            // Only set metrics here; queue processing is handled in the first simulation pass
            metrics = node.data.metrics || {
              requestsPerSecond: 0,
              dequeueRate: 0,
              queueLength: 0,
              droppedMessages: 0,
              responseTime: 0,
              load: 0,
              failedRequests: 0,
              maxQueue: 0,
              activeRequests: 0,
            };
            break;

          default:
            return node;
        }

        const cumulativeLatency = cumulativeLatencyMap.get(node.id) || metrics.responseTime;
        return {
          ...node,
          data: {
            ...node.data,
            metrics: {
              ...metrics,
              cumulativeLatency,
            },
            onThroughputChange: (value: number) => onThroughputChange(node.id, value),
            onAlgorithmChange: (value: 'roundRobin') => onAlgorithmChange(node.id, value),
            onRateLimitChange: (value: number) => onRateLimitChange(node.id, value),
            onHitRateChange: (value: number) => onHitRateChange(node.id, value),
            onDequeueRateChange: (value: number) => onDequeueRateChange(node.id, value),
            onMaxQueueChange: (value: number) => onMaxQueueChange(node.id, value),
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
  }, [isSimulationRunning, setNodes, setEdges, nodes, edges, onThroughputChange, onAlgorithmChange, onRateLimitChange, roundRobinCounters]);

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

      const newNodeLabel = type === 'server' 
        ? `Servidor ${nodes.filter(n => n.type === 'server').length + 1}`
        : type === 'database'
          ? `Banco de Dados ${nodes.filter(n => n.type === 'database').length + 1}`
          : type === 'loadBalancer'
            ? `Load Balancer ${nodes.filter(n => n.type === 'loadBalancer').length + 1}`
            : type === 'apiGateway'
              ? `API Gateway ${nodes.filter(n => n.type === 'apiGateway').length + 1}`
              : type === 'cache'
                ? `Cache ${nodes.filter(n => n.type === 'cache').length + 1}`
                : type === 'messageQueue'
                  ? `Message Queue ${nodes.filter(n => n.type === 'messageQueue').length + 1}`
                  : `Cliente ${nodes.filter(n => n.type === 'client').length + 1}`;

      // Set default values based on node type
      let nodeData: any = { label: newNodeLabel };
      
      if (type === 'loadBalancer') {
        nodeData.algorithm = 'roundRobin';
      } else if (type === 'apiGateway') {
        nodeData.rateLimit = 100;
        nodeData.throughput = 200;
      } else if (type === 'server') {
        nodeData.throughput = 100;
      } else if (type === 'database') {
        nodeData.throughput = 50;
      } else if (type === 'client') {
        nodeData.throughput = 50;
      } else if (type === 'cache') {
        nodeData.throughput = 100;
        nodeData.hitRate = 0.8;
      } else if (type === 'messageQueue') {
        nodeData.maxQueue = 100;
        nodeData.dequeueRate = 50;
      }

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: nodeData,
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

  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      // Prevent default context menu
      event.preventDefault();
      
      // Set the position of the custom context menu
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
      });
    },
    []
  );

  const onPaneClick = useCallback(() => {
    // Close the context menu when clicking elsewhere
    setContextMenu(null);
  }, []);

  const onRemoveEdge = useCallback(() => {
    if (contextMenu) {
      setEdges((eds) => eds.filter((edge) => edge.id !== contextMenu.edgeId));
      setContextMenu(null);
    }
  }, [contextMenu, setEdges]);

  // Close the context menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Export system design to .din file
  const exportSystemDesign = useCallback(() => {
    // Stop simulation if running
    if (isSimulationRunning) {
      setIsSimulationRunning(false);
    }
    
    // Prepare the design data
    const designData: DistributedSystemDesign = {
      nodes: nodes.map(node => ({
        ...node,
        data: {
          label: node.data.label,
          throughput: node.data.throughput,
          algorithm: node.data.algorithm,
          rateLimit: node.data.rateLimit,
        }
      })),
      edges,
      version: '1.0'
    };
    
    // Convert to JSON and create blob
    const designJson = JSON.stringify(designData, null, 2);
    const blob = new Blob([designJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = url;
    link.download = `distributed-system-${new Date().toISOString().slice(0, 10)}.din`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
  }, [nodes, edges, isSimulationRunning]);
  
  // Trigger file input click
  const handleImportClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  // Handle file import
  const importSystemDesign = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Stop simulation if running
    if (isSimulationRunning) {
      setIsSimulationRunning(false);
    }
    
    // Reset any previous errors
    setImportError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const design = JSON.parse(content) as DistributedSystemDesign;
        
        // Basic validation
        if (!design.nodes || !design.edges || !design.version) {
          throw new Error('Arquivo inválido ou corrompido');
        }
        
        // Import the design
        setNodes(design.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            // Add callback functions
            onThroughputChange: (value: number) => onThroughputChange(node.id, value),
            onAlgorithmChange: (value: 'roundRobin') => onAlgorithmChange(node.id, value),
            onRateLimitChange: (value: number) => onRateLimitChange(node.id, value),
          }
        })));
        setEdges(design.edges);
        
        // Reset round robin counters
        setRoundRobinCounters({});
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error importing file:', error);
        setImportError('Erro ao importar arquivo. Formato inválido ou corrompido.');
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setImportError('Erro ao ler o arquivo. Tente novamente.');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  }, [isSimulationRunning, onThroughputChange, onAlgorithmChange, onRateLimitChange, setNodes, setEdges]);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">
          Simulador de Sistema Distribuído
        </h1>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className={`px-4 py-2 ${
                isSimulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white rounded transition-colors`}
            >
              {isSimulationRunning ? 'Parar Simulação' : 'Iniciar Simulação'}
            </button>
            
            <div className="border-l border-zinc-700 h-8 mx-2"></div>
            
            <button
              onClick={exportSystemDesign}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar (.din)
            </button>
            
            <button
              onClick={handleImportClick}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importar (.din)
            </button>
            
            <button
              onClick={() => {
                // Create an API Gateway example system
                const newNodes: Node<NodeData>[] = [
                  {
                    id: 'client1',
                    type: 'client',
                    data: { label: 'Cliente', throughput: 150 },
                    position: { x: 400, y: 50 },
                  },
                  {
                    id: 'gateway1',
                    type: 'apiGateway',
                    data: { label: 'API Gateway', rateLimit: 120, throughput: 180 },
                    position: { x: 400, y: 180 },
                  },
                  {
                    id: 'server1',
                    type: 'server',
                    data: { label: 'Serviço Auth', throughput: 80 },
                    position: { x: 200, y: 300 },
                  },
                  {
                    id: 'server2',
                    type: 'server',
                    data: { label: 'Serviço Produtos', throughput: 100 },
                    position: { x: 400, y: 300 },
                  },
                  {
                    id: 'server3',
                    type: 'server',
                    data: { label: 'Serviço Pedidos', throughput: 60 },
                    position: { x: 600, y: 300 },
                  },
                  {
                    id: 'db1',
                    type: 'database',
                    data: { label: 'Banco de Dados', throughput: 80 },
                    position: { x: 400, y: 450 },
                  },
                ];
                
                const newEdges: Edge[] = [
                  { id: 'e-c1-g1', source: 'client1', target: 'gateway1', animated: true },
                  { id: 'e-g1-s1', source: 'gateway1', target: 'server1', animated: true },
                  { id: 'e-g1-s2', source: 'gateway1', target: 'server2', animated: true },
                  { id: 'e-g1-s3', source: 'gateway1', target: 'server3', animated: true },
                  { id: 'e-s1-db1', source: 'server1', target: 'db1', animated: true },
                  { id: 'e-s2-db1', source: 'server2', target: 'db1', animated: true },
                  { id: 'e-s3-db1', source: 'server3', target: 'db1', animated: true },
                ];
                
                // Stop any running simulation
                if (isSimulationRunning) {
                  setIsSimulationRunning(false);
                }
                
                // Reset round robin counters
                setRoundRobinCounters({});
                
                // Apply the new configuration
                setNodes(newNodes.map(node => ({
                  ...node,
                  data: {
                    ...node.data,
                    onThroughputChange: (value: number) => onThroughputChange(node.id, value),
                    onAlgorithmChange: (value: 'roundRobin') => onAlgorithmChange(node.id, value),
                    onRateLimitChange: (value: number) => onRateLimitChange(node.id, value),
                  }
                })));
                setEdges(newEdges);
              }}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Exemplo API Gateway
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".din"
              className="hidden"
              onChange={importSystemDesign}
            />
          </div>
          
          {importError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {importError}
              </div>
            </div>
          )}

          <div className="flex gap-4 text-sm text-zinc-400">
            <div>Status da Carga:</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Normal (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Alerta (60-80%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Crítico (&gt;80%)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '600px' }} className="bg-zinc-900 rounded-lg relative">
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
          fitViewOptions={{
            padding: 0.5,
            maxZoom: 1,
          }}
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneClick={onPaneClick}
        >
          <Panel position="top-left" className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold mb-2">Componentes</h3>
              <div className="flex flex-col gap-2">
                {availableComponents.map((component) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.type}
                      className={`px-4 py-2 bg-zinc-700 rounded cursor-move hover:bg-zinc-600 
                        transition-colors border-2 ${component.className} text-white`}
                      onDragStart={(e) => onDragStart(e, component.type)}
                      draggable
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {component.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        
        {/* Custom context menu */}
        {contextMenu && (
          <div
            className="absolute z-50 bg-zinc-800 rounded shadow-lg p-2"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onRemoveEdge}
              className="text-white hover:bg-red-600 py-1 px-3 rounded w-full text-left flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remover Conexão
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 