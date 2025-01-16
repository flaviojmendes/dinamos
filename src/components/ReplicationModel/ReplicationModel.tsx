import { useState, useEffect, useRef } from 'react';

interface DataNode {
  id: number;
  value: string;
  lastUpdate: number;
  isActive: boolean;
  latency: number;
  position: { x: number; y: number };
}

type ConsistencyModel = 'strong' | 'eventual' | 'causal';

interface Operation {
  id: number;
  type: 'write' | 'read';
  value?: string;
  timestamp: number;
  sourceNodeId: number;
  targetNodeId: number;
  status: 'pending' | 'completed' | 'failed';
  duration: number;
}

export default function ReplicationModel() {
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [value, setValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [consistencyModel, setConsistencyModel] = useState<ConsistencyModel>('eventual');
  const [selectedNode, setSelectedNode] = useState<number>(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({
    nodeCount: 5,
    baseLatency: 100,
    replicationDelay: 500,
    networkReliability: 0.95, // 95% chance of successful transmission
    networkJitter: 100, // Random latency variation in ms
    circleRadius: 200, // Radius for node positioning
  });

  // Calculate node positions in a circle
  const calculateNodePositions = (count: number, radius: number) => {
    const positions = [];
    const centerX = radius;
    const centerY = radius;
    
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return positions;
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setValue('');
    setOperations([]);
    
    const positions = calculateNodePositions(config.nodeCount, config.circleRadius);
    const initialNodes: DataNode[] = Array.from({ length: config.nodeCount }, (_, i) => ({
      id: i,
      value: '0',
      lastUpdate: Date.now(),
      isActive: true,
      latency: config.baseLatency + Math.random() * config.networkJitter,
      position: positions[i],
    }));
    setNodes(initialNodes);
  };

  // Initialize nodes
  useEffect(() => {
    resetSimulation();
  }, [config.nodeCount, config.circleRadius]);

  const addOperation = (operation: Omit<Operation, 'id'>) => {
    setOperations(prev => [...prev.slice(-9), { ...operation, id: Date.now() }]);
  };

  const simulateNetworkDelay = (baseDelay: number) => {
    const jitter = Math.random() * config.networkJitter;
    const success = Math.random() < config.networkReliability;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve(true);
        } else {
          reject(new Error('Network failure'));
        }
      }, baseDelay + jitter);
    });
  };

  const writeValue = async () => {
    if (!value.trim() || !isRunning) return;

    const sourceNode = nodes[selectedNode];
    if (!sourceNode.isActive) return;

    // Update source node immediately
    setNodes(current => {
      const updated = [...current];
      updated[selectedNode] = {
        ...updated[selectedNode],
        value: value.trim(),
        lastUpdate: Date.now(),
      };
      return updated;
    });

    // Replicate to other nodes based on consistency model
    const activeNodes = nodes.filter(n => n.isActive && n.id !== selectedNode);
    
    for (const targetNode of activeNodes) {
      const op: Operation = {
        id: Date.now(),
        type: 'write',
        value: value.trim(),
        timestamp: Date.now(),
        sourceNodeId: selectedNode,
        targetNodeId: targetNode.id,
        status: 'pending',
        duration: 0,
      };
      addOperation(op);

      try {
        const startTime = Date.now();
        
        switch (consistencyModel) {
          case 'strong':
            // Wait for all nodes to confirm
            await simulateNetworkDelay(config.baseLatency);
            break;
            
          case 'eventual':
            // Fire and forget
            simulateNetworkDelay(config.baseLatency).catch(() => {});
            break;
            
          case 'causal':
            // Sequential propagation
            await simulateNetworkDelay(config.baseLatency);
            break;
        }

        setNodes(current => {
          const updated = [...current];
          const targetIndex = updated.findIndex(n => n.id === targetNode.id);
          if (targetIndex >= 0) {
            updated[targetIndex] = {
              ...updated[targetIndex],
              value: value.trim(),
              lastUpdate: Date.now(),
            };
          }
          return updated;
        });

        setOperations(current =>
          current.map(o =>
            o.id === op.id
              ? { ...o, status: 'completed', duration: Date.now() - startTime }
              : o
          )
        );
      } catch (error) {
        setOperations(current =>
          current.map(o =>
            o.id === op.id
              ? { ...o, status: 'failed', duration: 0 }
              : o
          )
        );
      }
    }

    setValue('');
  };

  return (
    <div className="p-8 space-y-8">
      {/* Visualization Area */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="relative" style={{ height: config.circleRadius * 2 + 100 }}>
          {/* Connection Lines */}
          <svg 
            className="absolute inset-0"
            width="100%"
            height="100%"
          >
            {nodes.map((source) => 
              nodes
                .filter(target => target.id !== source.id)
                .map(target => (
                  <line
                    key={`${source.id}-${target.id}`}
                    x1={source.position.x}
                    y1={source.position.y}
                    x2={target.position.x}
                    y2={target.position.y}
                    className={`stroke-1 ${
                      !source.isActive || !target.isActive
                        ? 'stroke-gray-800'
                        : 'stroke-gray-600'
                    }`}
                  />
                ))
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                ${!node.isActive ? 'opacity-50' : 'opacity-100'}
              `}
              style={{
                left: node.position.x,
                top: node.position.y,
              }}
            >
              <div
                className={`p-4 rounded-lg border-2 transition-colors duration-300
                  ${!node.isActive 
                    ? 'border-gray-700 bg-gray-800' 
                    : node.id === selectedNode
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-900'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-white font-medium">Nó {node.id}</span>
                  <span className="text-2xl text-white font-bold">{node.value}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedNode(node.id)}
                      disabled={!isRunning || !node.isActive}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        !isRunning || !node.isActive
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : node.id === selectedNode
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-600 hover:bg-gray-500 text-white'
                      }`}
                    >
                      Selecionar
                    </button>
                    <button
                      onClick={() => {
                        setNodes(current =>
                          current.map((n) =>
                            n.id === node.id ? { ...n, isActive: !n.isActive } : n
                          )
                        );
                      }}
                      disabled={!isRunning}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        !isRunning
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : node.isActive
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {node.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6 rounded-lg space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setConsistencyModel('strong')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              !isRunning
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : consistencyModel === 'strong'
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            disabled={!isRunning}
          >
            Consistência Forte
          </button>
          <button
            onClick={() => setConsistencyModel('eventual')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              !isRunning
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : consistencyModel === 'eventual'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            disabled={!isRunning}
          >
            Consistência Eventual
          </button>
          <button
            onClick={() => setConsistencyModel('causal')}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
              !isRunning
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : consistencyModel === 'causal'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            disabled={!isRunning}
          >
            Consistência Causal
          </button>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Valor para escrever"
            disabled={!isRunning}
            className={`flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500 ${
              !isRunning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <button
            onClick={writeValue}
            disabled={!isRunning}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              !isRunning ? 'bg-gray-700 text-gray-400 cursor-not-allowed' :
              'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Escrever
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isRunning ? 'Parar' : 'Iniciar'}
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="w-full flex items-center justify-between text-lg font-semibold text-white focus:outline-none"
        >
          <span>Configuração</span>
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${isConfigOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        <div className={`space-y-4 overflow-hidden transition-all duration-200 ease-in-out ${
          isConfigOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Número de Nós</span>
              <span className="text-blue-400">{config.nodeCount}</span>
            </div>
            <input
              type="range"
              min="3"
              max="7"
              value={config.nodeCount}
              onChange={(e) => setConfig(c => ({ ...c, nodeCount: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Latência Base (ms)</span>
              <span className="text-blue-400">{config.baseLatency}ms</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={config.baseLatency}
              onChange={(e) => setConfig(c => ({ ...c, baseLatency: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Variação de Latência (Jitter)</span>
              <span className="text-blue-400">{config.networkJitter}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={config.networkJitter}
              onChange={(e) => setConfig(c => ({ ...c, networkJitter: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Confiabilidade da Rede</span>
              <span className="text-blue-400">{Math.round(config.networkReliability * 100)}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={Math.round(config.networkReliability * 100)}
              onChange={(e) => setConfig(c => ({ ...c, networkReliability: parseInt(e.target.value) / 100 }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Atraso de Replicação</span>
              <span className="text-blue-400">{config.replicationDelay}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={config.replicationDelay}
              onChange={(e) => setConfig(c => ({ ...c, replicationDelay: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-white mb-1">
              <span>Tamanho do Diagrama</span>
              <span className="text-blue-400">{config.circleRadius * 2}px</span>
            </div>
            <input
              type="range"
              min="100"
              max="300"
              step="50"
              value={config.circleRadius}
              onChange={(e) => setConfig(c => ({ ...c, circleRadius: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Operations Log */}
      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Operações</h3>
        <div className="space-y-2">
          {operations.map((op) => (
            <div
              key={op.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  op.type === 'write' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {op.type === 'write' ? 'Escrita' : 'Leitura'}
                </span>
                <span className="text-white">
                  Nó {op.sourceNodeId} → Nó {op.targetNodeId}
                </span>
                {op.value && <span className="text-gray-400">Valor: {op.value}</span>}
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${
                  op.status === 'completed' ? 'text-green-500' :
                  op.status === 'failed' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {op.status === 'completed' ? 'Concluído' :
                   op.status === 'failed' ? 'Falhou' :
                   'Pendente'}
                </span>
                {op.status === 'completed' && (
                  <span className="text-gray-400">{op.duration}ms</span>
                )}
              </div>
            </div>
          ))}
          {operations.length === 0 && (
            <div className="text-gray-500 text-center py-4">Nenhuma operação realizada</div>
          )}
        </div>
      </div>
    </div>
  );
} 