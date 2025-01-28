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

// Basic interfaces
interface NodeData {
  label: string;
  metrics?: {
    requestsPerSecond: number;
    activeRequests: number;
    responseTime: number;
    errorRate: number;
    load: number;
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
        <div className="text-red-300">Taxa de Erro: {data.metrics.errorRate.toFixed(1)}%</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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

const LoadBalancerNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-green-500 bg-zinc-800 min-w-[180px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="font-bold text-white">{data.label}</div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300">Ativas: {data.metrics.activeRequests}</div>
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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

const ServerNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-purple-500 bg-zinc-800 min-w-[180px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    <div className="font-bold text-white">{data.label}</div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300">Ativas: {data.metrics.activeRequests}</div>
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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

const DatabaseNode = ({ data, isConnectable }: NodeProps<NodeData>) => (
  <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-yellow-500 bg-zinc-800 min-w-[180px]">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <div className="font-bold text-white">{data.label}</div>
    {data.metrics && (
      <div className="text-xs mt-2">
        <div className="text-blue-300">Ativas: {data.metrics.activeRequests}</div>
        <div className="text-yellow-300">Requisições/s: {data.metrics.requestsPerSecond}</div>
        <div className="text-green-300">Resposta: {data.metrics.responseTime.toFixed(0)}ms</div>
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
    position: { x: 250, y: 25 },
    className: 'bg-transparent border-none',
  },
  {
    id: '2',
    type: 'loadBalancer',
    data: { label: 'Balanceador' },
    position: { x: 250, y: 125 },
  },
  {
    id: '3',
    type: 'server',
    data: { label: 'Servidor 1' },
    position: { x: 150, y: 225 },
  },
  {
    id: '4',
    type: 'server',
    data: { label: 'Servidor 2' },
    position: { x: 350, y: 225 },
  },
  {
    id: '5',
    type: 'database',
    data: { label: 'Banco de Dados' },
    position: { x: 250, y: 325 },
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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [clientRequestRate, setClientRequestRate] = useState(50);

  // Simple simulation logic
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
      
      // Initialize client requests
      requestFlow.set(clientNode.id, totalRequests);

      // Calculate load balancer distribution
      loadBalancers.forEach(lb => {
        const lbIncomingEdges = edges.filter(e => e.target === lb.id);
        const incomingRequests = lbIncomingEdges
          .map(e => requestFlow.get(e.source) || 0)
          .reduce((sum, curr) => sum + curr, 0);

        // 5% loss at load balancer
        const lbRequests = Math.floor(incomingRequests * 0.95);
        requestFlow.set(lb.id, lbRequests);

        // Find servers connected to this load balancer
        const connectedServers = edges
          .filter(e => e.source === lb.id)
          .map(e => nds.find(n => n.id === e.target))
          .filter(n => n?.type === 'server') as Node[];

        // Distribute requests evenly among connected servers
        if (connectedServers.length > 0) {
          const requestsPerServer = Math.floor(lbRequests / connectedServers.length);
          connectedServers.forEach((server, index) => {
            // Last server gets any remaining requests to handle rounding
            const serverRequests = index === connectedServers.length - 1
              ? lbRequests - (requestsPerServer * (connectedServers.length - 1))
              : requestsPerServer;
            requestFlow.set(server.id, (requestFlow.get(server.id) || 0) + serverRequests);
          });
        }
      });

      // Calculate database requests
      const databases = nds.filter(n => n.type === 'database');
      databases.forEach(db => {
        const dbIncomingEdges = edges.filter(e => e.target === db.id);
        const incomingRequests = dbIncomingEdges
          .map(e => requestFlow.get(e.source) || 0)
          .reduce((sum, curr) => sum + curr, 0);
        
        // 10% queries resolved in server cache
        requestFlow.set(db.id, Math.floor(incomingRequests * 0.9));
      });

      // Update metrics for each node
      return nds.map(node => {
        const nodeRequests = requestFlow.get(node.id) || 0;
        let metrics;

        switch (node.type) {
          case 'input':
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.2),
              responseTime: 50 + Math.random() * 20,
              errorRate: Math.random() * 2,
              load: Math.min(100, (nodeRequests / 100) * 100),
            };
            break;

          case 'loadBalancer':
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.1),
              responseTime: 20 + Math.random() * 30,
              errorRate: Math.random() * 3,
              load: Math.min(100, (nodeRequests / 150) * 100),
            };
            break;

          case 'server':
            const serverLoad = (nodeRequests / 75) * 100;
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.3),
              responseTime: 100 + (serverLoad > 80 ? serverLoad * 2 : serverLoad),
              errorRate: serverLoad > 80 ? 5 + Math.random() * 10 : Math.random() * 5,
              load: Math.min(100, serverLoad),
            };
            break;

          case 'database':
            const dbLoad = (nodeRequests / 50) * 100;
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.4),
              responseTime: 50 + (dbLoad > 70 ? dbLoad * 3 : dbLoad),
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
          },
        };
      });
    });

    // Update edge thicknesses based on load
    setEdges((eds) => {
      return eds.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (!sourceNode?.data.metrics || !targetNode) return edge;

        const requestFlow = sourceNode.data.metrics.requestsPerSecond;
        const strokeWidth = Math.max(1, Math.min(8, (requestFlow / 20) + 1));
        const targetLoad = targetNode.data.metrics?.load || 0;
        const stroke = targetLoad > 80 ? '#ef4444' : undefined;

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
  }, [isSimulationRunning, setNodes, setEdges, nodes, edges, clientRequestRate]);

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
        className: 'bg-zinc-800 border-none',
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
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
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

            <div className="flex items-center gap-2">
              <label className="text-white">
                Requisições/s do Cliente:
              </label>
              <input
                type="range"
                min="1"
                max="200"
                value={clientRequestRate}
                onChange={(e) => setClientRequestRate(Number(e.target.value))}
                className="w-48"
              />
              <span className="text-white min-w-[3rem]">{clientRequestRate}</span>
            </div>
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