import { useState, useEffect, useRef } from 'react';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

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
    networkReliability: 0.95,
    networkJitter: 100,
    circleRadius: 200,
  });

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

    setNodes(current => {
      const updated = [...current];
      updated[selectedNode] = {
        ...updated[selectedNode],
        value: value.trim(),
        lastUpdate: Date.now(),
      };
      return updated;
    });

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
            await simulateNetworkDelay(config.baseLatency);
            break;
          case 'eventual':
            simulateNetworkDelay(config.baseLatency).catch(() => {});
            break;
          case 'causal':
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

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';
  const inputClass = 'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-sans text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-brand-500 rounded-md';

  const opStatusVariant = (status: Operation['status']) => {
    switch (status) {
      case 'completed': return 'completed' as const;
      case 'failed': return 'classified' as const;
      case 'pending': return 'pending' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <span className="inline-block text-xs font-medium text-slate-600 dark:text-tactical-label bg-slate-100 dark:bg-tactical-raised px-2.5 py-1 rounded-full mb-2">
          Modelo de replicação
        </span>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          Visualize consistência forte, eventual e causal entre nós distribuídos.
        </p>
      </div>

      <Panel title="Topologia de Nós" accent="cyan" padded={false} bodyClassName="p-4">
        <div className="relative bg-slate-50 dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-lg" style={{ height: config.circleRadius * 2 + 100 }}>
          <svg className="absolute inset-0" width="100%" height="100%">
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
                        ? 'stroke-slate-300 dark:stroke-tactical-line'
                        : 'stroke-slate-400 dark:stroke-tactical-border'
                    }`}
                  />
                ))
            )}
          </svg>
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                !node.isActive ? 'opacity-50' : 'opacity-100'
              }`}
              style={{ left: node.position.x, top: node.position.y }}
            >
              <div className={`p-4 border-2 transition-colors duration-300 rounded-lg ${
                !node.isActive 
                  ? 'border-slate-300 dark:border-tactical-line bg-slate-100 dark:bg-tactical-raised' 
                  : node.id === selectedNode
                  ? 'border-signal-cyan bg-signal-cyan/10'
                  : 'border-slate-300 dark:border-tactical-border bg-white dark:bg-tactical-surface'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <span className="font-sans text-sm text-slate-900 dark:text-tactical-text">Nó {node.id}</span>
                  <span className="font-mono text-2xl font-bold text-slate-900 dark:text-tactical-text">{node.value}</span>
                  <div className="flex space-x-2">
                    <TacticalButton
                      size="sm"
                      variant={node.id === selectedNode ? 'primary' : 'secondary'}
                      onClick={() => setSelectedNode(node.id)}
                      disabled={!isRunning || !node.isActive}
                    >
                      Selecionar
                    </TacticalButton>
                    <TacticalButton
                      size="sm"
                      variant={node.isActive ? 'danger' : 'primary'}
                      onClick={() => {
                        setNodes(current =>
                          current.map((n) =>
                            n.id === node.id ? { ...n, isActive: !n.isActive } : n
                          )
                        );
                      }}
                      disabled={!isRunning}
                    >
                      {node.isActive ? 'Desativar' : 'Ativar'}
                    </TacticalButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Controles" accent="amber">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <TacticalButton
              size="sm"
              variant={consistencyModel === 'strong' ? 'primary' : 'secondary'}
              onClick={() => setConsistencyModel('strong')}
              disabled={!isRunning}
            >
              Consistência Forte
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant={consistencyModel === 'eventual' ? 'primary' : 'secondary'}
              onClick={() => setConsistencyModel('eventual')}
              disabled={!isRunning}
            >
              Consistência Eventual
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant={consistencyModel === 'causal' ? 'primary' : 'secondary'}
              onClick={() => setConsistencyModel('causal')}
              disabled={!isRunning}
            >
              Consistência Causal
            </TacticalButton>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Valor para escrever"
              disabled={!isRunning}
              className={`flex-1 min-w-[200px] ${inputClass} ${!isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <TacticalButton size="sm" variant="primary" onClick={writeValue} disabled={!isRunning}>
              Escrever
            </TacticalButton>
            <TacticalButton size="sm" variant={isRunning ? 'danger' : 'primary'} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'Parar' : 'Iniciar'}
            </TacticalButton>
          </div>
        </div>
      </Panel>

      <Panel
        title="Configuração"
        accent="green"
        action={
          <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
            {isConfigOpen ? '▲' : '▼'}
          </TacticalButton>
        }
      >
        <div className={`space-y-4 overflow-hidden transition-all duration-200 ease-in-out ${
          isConfigOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>Número de nós</span>
              <span className="text-signal-cyan">{config.nodeCount}</span>
            </div>
            <input type="range" min="3" max="7" value={config.nodeCount} onChange={(e) => setConfig(c => ({ ...c, nodeCount: parseInt(e.target.value) }))} className={rangeClass} />
          </div>
          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>Latência base (ms)</span>
              <span className="text-signal-cyan">{config.baseLatency}ms</span>
            </div>
            <input type="range" min="50" max="500" step="50" value={config.baseLatency} onChange={(e) => setConfig(c => ({ ...c, baseLatency: parseInt(e.target.value) }))} className={rangeClass} />
          </div>
          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>Variação de latência (jitter)</span>
              <span className="text-signal-cyan">{config.networkJitter}ms</span>
            </div>
            <input type="range" min="0" max="200" step="10" value={config.networkJitter} onChange={(e) => setConfig(c => ({ ...c, networkJitter: parseInt(e.target.value) }))} className={rangeClass} />
          </div>
          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>Confiabilidade da rede</span>
              <span className="text-signal-cyan">{Math.round(config.networkReliability * 100)}%</span>
            </div>
            <input type="range" min="50" max="100" value={Math.round(config.networkReliability * 100)} onChange={(e) => setConfig(c => ({ ...c, networkReliability: parseInt(e.target.value) / 100 }))} className={rangeClass} />
          </div>
          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>Atraso de replicação</span>
              <span className="text-signal-cyan">{config.replicationDelay}ms</span>
            </div>
            <input type="range" min="100" max="2000" step="100" value={config.replicationDelay} onChange={(e) => setConfig(c => ({ ...c, replicationDelay: parseInt(e.target.value) }))} className={rangeClass} />
          </div>
          <div>
            <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
              <span>Tamanho do diagrama</span>
              <span className="text-signal-cyan">{config.circleRadius * 2}px</span>
            </div>
            <input type="range" min="100" max="300" step="50" value={config.circleRadius} onChange={(e) => setConfig(c => ({ ...c, circleRadius: parseInt(e.target.value) }))} className={rangeClass} />
          </div>
        </div>
      </Panel>

      <Panel title="Operações" accent="red">
        <div className="space-y-2">
          {operations.map((op) => (
            <div
              key={op.id}
              className="flex justify-between items-center border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <StatusBadge
                  variant={op.type === 'write' ? 'pending' : 'active'}
                  label={op.type === 'write' ? 'Escrita' : 'Leitura'}
                />
                <span className="font-mono text-sm text-slate-900 dark:text-tactical-text">
                  Nó {op.sourceNodeId} → Nó {op.targetNodeId}
                </span>
                {op.value && <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">Valor: {op.value}</span>}
              </div>
              <div className="flex items-center space-x-3">
                <StatusBadge
                  variant={opStatusVariant(op.status)}
                  label={op.status === 'completed' ? 'Concluído' : op.status === 'failed' ? 'Falhou' : 'Pendente'}
                />
                {op.status === 'completed' && (
                  <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{op.duration}ms</span>
                )}
              </div>
            </div>
          ))}
          {operations.length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg">
              <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                Nenhuma operação realizada
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
