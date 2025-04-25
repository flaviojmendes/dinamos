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

interface NodeData {
  label: string;
  throughput?: number;
  onThroughputChange?: (value: number) => void;
  metrics?: {
    requestsPerSecond: number;
    activeRequests: number;
    responseTime: number;
    load: number;
    failedRequests: number;
  };
}

// Node components with metrics display
const ClientNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-blue-500 bg-zinc-800 min-w-[180px]">
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="font-bold text-white">{data.label}</div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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
    <div className="font-bold text-white">{data.label}</div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300 flex justify-between items-center">
          <span>Conexões Ativas:</span>
          <span className="font-bold text-lg">{data.metrics.activeRequests}</span>
        </div>
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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
    <div className="font-bold text-white">{data.label}</div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300 flex justify-between items-center">
          <span>Conexões Ativas:</span>
          <span className="font-bold text-lg">{data.metrics.activeRequests}</span>
        </div>
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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

const nodeTypes = {
  client: ClientNode,
  server: ServerNode,
  database: DatabaseNode,
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
    type: 'server',
    data: { label: 'Servidor' },
    position: { x: 400, y: 200 },
  },
  {
    id: '3',
    type: 'database',
    data: { label: 'Banco de Dados' },
    position: { x: 400, y: 350 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

// Available components configuration
const availableComponents = [
  { type: 'client', label: 'Cliente', className: 'border-blue-500' },
  { type: 'server', label: 'Servidor', className: 'border-purple-500' },
  { type: 'database', label: 'Banco de Dados', className: 'border-yellow-500' },
];

export default function SimpleSystemEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const onThroughputChange = useCallback((nodeId: string, throughput: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, throughput } }
          : node
      )
    );
  }, [setNodes]);

  // Simulation function
  const simulateMetrics = useCallback(() => {
    if (!isSimulationRunning) return;

    setNodes((nds) => {
      // Calculate request flow through the system
      const requestFlow = new Map<string, number>();
      const failedRequestsMap = new Map<string, number>();
      const activeRequestsMap = new Map<string, number>();
      
      // First pass: calculate outgoing requests from clients
      const clients = nds.filter(n => n.type === 'client');
      clients.forEach(client => {
        const throughput = client.data.throughput || 50;
        const randomFactor = 0.9 + Math.random() * 0.2; // Add a bit of randomness
        const outgoingRequests = Math.floor(throughput * randomFactor);
        requestFlow.set(client.id, outgoingRequests);
        failedRequestsMap.set(client.id, 0); // No failed requests for clients initially
      });

      // Second pass: calculate server metrics
      const servers = nds.filter(n => n.type === 'server');
      servers.forEach(server => {
        const serverIncomingEdges = edges.filter(e => e.target === server.id);
        const throughput = server.data.throughput || 100;
        
        // Sum up incoming requests
        const incomingRequests = serverIncomingEdges
          .map(e => requestFlow.get(e.source) || 0)
          .reduce((sum, curr) => sum + curr, 0);

        // Calculate how many requests the server can handle
        const maxHandled = Math.min(incomingRequests, throughput);
        const failedRequests = incomingRequests - maxHandled; // Calculate dropped requests
        const activeRequests = Math.ceil(maxHandled * 0.1); // 10% of throughput are active connections
        
        requestFlow.set(server.id, maxHandled);
        failedRequestsMap.set(server.id, failedRequests);
        activeRequestsMap.set(server.id, activeRequests);
        
        // Propagate failures back to sources
        if (failedRequests > 0) {
          serverIncomingEdges.forEach(edge => {
            const sourceRequest = requestFlow.get(edge.source) || 0;
            if (sourceRequest > 0) {
              // Proportionally distribute failures based on source contribution
              const sourceContribution = sourceRequest / incomingRequests;
              const sourceFailures = Math.floor(failedRequests * sourceContribution);
              failedRequestsMap.set(edge.source, (failedRequestsMap.get(edge.source) || 0) + sourceFailures);
            }
          });
        }
      });

      // Third pass: calculate database metrics
      const databases = nds.filter(n => n.type === 'database');
      databases.forEach(db => {
        const dbIncomingEdges = edges.filter(e => e.target === db.id);
        const throughput = db.data.throughput || 50;
        
        // Sum up incoming requests
        const incomingRequests = dbIncomingEdges
          .map(e => requestFlow.get(e.source) || 0)
          .reduce((sum, curr) => sum + curr, 0);

        // Calculate how many requests the database can handle
        const maxHandled = Math.min(incomingRequests, throughput);
        const failedRequests = incomingRequests - maxHandled; // Calculate dropped requests
        const activeRequests = Math.ceil(maxHandled * 0.2); // 20% of throughput are active connections
        
        requestFlow.set(db.id, maxHandled);
        failedRequestsMap.set(db.id, failedRequests);
        activeRequestsMap.set(db.id, activeRequests);
        
        // Propagate failures back to sources
        if (failedRequests > 0) {
          dbIncomingEdges.forEach(edge => {
            const sourceRequest = requestFlow.get(edge.source) || 0;
            if (sourceRequest > 0) {
              // Proportionally distribute failures based on source contribution
              const sourceContribution = sourceRequest / incomingRequests;
              const sourceFailures = Math.floor(failedRequests * sourceContribution);
              failedRequestsMap.set(edge.source, (failedRequestsMap.get(edge.source) || 0) + sourceFailures);
            }
          });
        }
      });

      // Update metrics for each node
      return nds.map(node => {
        const nodeRequests = requestFlow.get(node.id) || 0;
        const activeRequests = activeRequestsMap.get(node.id) || 0;
        const failedRequests = failedRequestsMap.get(node.id) || 0;
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

          default:
            return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            metrics,
            onThroughputChange: (value: number) => onThroughputChange(node.id, value),
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
  }, [isSimulationRunning, setNodes, setEdges, nodes, edges, onThroughputChange]);

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
          : `Cliente ${nodes.filter(n => n.type === 'client').length + 1}`;

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label: newNodeLabel },
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
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">
          Simulador de Sistema Distribuído
        </h1>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className={`px-4 py-2 ${
                isSimulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white rounded transition-colors`}
            >
              {isSimulationRunning ? 'Parar Simulação' : 'Iniciar Simulação'}
            </button>
          </div>

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
        >
          <Panel position="top-left" className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold mb-2">Componentes</h3>
              <div className="flex flex-col gap-2">
                {availableComponents.map((component) => (
                  <div
                    key={component.type}
                    className={`px-4 py-2 bg-zinc-700 rounded cursor-move hover:bg-zinc-600 
                      transition-colors border-2 ${component.className} text-white`}
                    onDragStart={(e) => onDragStart(e, component.type)}
                    draggable
                  >
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