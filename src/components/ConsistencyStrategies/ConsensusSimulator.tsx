import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: number;
  role: 'follower' | 'candidate' | 'leader' | 'proposer' | 'acceptor' | 'learner' | 'participant';
  term: number;
  log: string[];
  active: boolean;
  value?: string;
  promisedProposal?: number;
  acceptedProposal?: number;
}

interface Message {
  id: string;
  from: number;
  to: number;
  type: 'vote_request' | 'vote_response' | 'log_replication' | 
        'prepare' | 'promise' | 'propose' | 'accept' | 
        'watch' | 'notify';
  value?: string;
}

type Protocol = 'raft' | 'paxos' | 'zookeeper';

interface PathPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function ConsensusSimulator() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [showExplanation, setShowExplanation] = useState(true);
  const [protocol, setProtocol] = useState<Protocol>('raft');
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<Record<string, PathPosition>>({});

  const addMessage = (from: number, to: number, type: Message['type'], value?: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      type,
      value,
    };
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== newMessage.id));
    }, 1000);
  };

  // Get node position based on index
  const getNodePosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
    const radius = 150; // Distance from center
    const centerX = 200; // Center X coordinate
    const centerY = 200; // Center Y coordinate

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const protocolSteps = {
    raft: [
      {
        title: "Estado Inicial (Raft)",
        description: "Todos os nós começam como seguidores no termo 0.",
        action: () => {
          setNodes([
            { id: 0, role: 'follower', term: 0, log: [], active: true },
            { id: 1, role: 'follower', term: 0, log: [], active: true },
            { id: 2, role: 'follower', term: 0, log: [], active: true },
            { id: 3, role: 'follower', term: 0, log: [], active: true },
            { id: 4, role: 'follower', term: 0, log: [], active: true },
          ]);
          setMessages([]);
        }
      },
      {
        title: "Timeout e Eleição",
        description: "O Nó 2 detecta que não há líder e inicia uma eleição, tornando-se candidato.",
        action: () => {
          setNodes(prev => prev.map(node => 
            node.id === 2 
              ? { ...node, role: 'candidate', term: node.term + 1 }
              : node
          ));
        }
      },
      {
        title: "Solicitação de Votos",
        description: "O candidato (Nó 2) solicita votos dos outros nós.",
        action: () => {
          [0, 1, 3, 4].forEach(nodeId => {
            addMessage(2, nodeId, 'vote_request');
          });
        }
      },
      {
        title: "Recebimento de Votos",
        description: "Os outros nós votam no candidato se não votaram neste termo.",
        action: () => {
          [0, 1, 3].forEach(nodeId => {
            setTimeout(() => {
              addMessage(nodeId, 2, 'vote_response');
            }, nodeId * 200);
          });
          
          setTimeout(() => {
            setNodes(prev => prev.map(node => 
              node.id === 2 
                ? { ...node, role: 'leader' }
                : { ...node, term: prev[2].term }
            ));
          }, 1000);
        }
      },
      {
        title: "Líder Eleito",
        description: "O Nó 2 recebe a maioria dos votos e se torna líder.",
        action: () => {
          // Visual changes already made in previous step
        }
      },
      {
        title: "Replicação de Log",
        description: "O líder adiciona uma entrada no log e a replica para todos os seguidores.",
        action: () => {
          setNodes(prev => {
            const newNodes = prev.map(node => 
              node.id === 2 
                ? { ...node, log: [...node.log, "Nova entrada de dados"] }
                : node
            );
            
            [0, 1, 3, 4].forEach((nodeId, index) => {
              setTimeout(() => {
                addMessage(2, nodeId, 'log_replication');
                setNodes(nodes => nodes.map(n => 
                  n.id === nodeId 
                    ? { ...n, log: [...n.log, "Nova entrada de dados"] }
                    : n
                ));
              }, index * 200);
            });
            
            return newNodes;
          });
        }
      },
      {
        title: "Confirmação",
        description: "A entrada é confirmada quando a maioria dos nós a registra.",
        action: () => {
          // Visual indication through log counts
        }
      }
    ],
    paxos: [
      {
        title: "Estado Inicial (Paxos)",
        description: "Configuração inicial com Proposer, Acceptors e Learners.",
        action: () => {
          setNodes([
            { id: 0, role: 'proposer', term: 1, log: [], active: true, value: 'X' },
            { id: 1, role: 'acceptor', term: 0, log: [], active: true, promisedProposal: 0, acceptedProposal: 0 },
            { id: 2, role: 'acceptor', term: 0, log: [], active: true, promisedProposal: 0, acceptedProposal: 0 },
            { id: 3, role: 'acceptor', term: 0, log: [], active: true, promisedProposal: 0, acceptedProposal: 0 },
            { id: 4, role: 'learner', term: 0, log: [], active: true },
          ]);
          setMessages([]);
        }
      },
      {
        title: "Fase 1a: Prepare",
        description: "O Proposer envia mensagens Prepare para os Acceptors.",
        action: () => {
          [1, 2, 3].forEach(nodeId => {
            addMessage(0, nodeId, 'prepare', 'n=1');
          });
          // Update acceptors to show they received prepare
          setNodes(prev => prev.map(node => 
            node.role === 'acceptor'
              ? { ...node, promisedProposal: 1 }
              : node
          ));
        }
      },
      {
        title: "Fase 1b: Promise",
        description: "Os Acceptors respondem com Promise se não prometeram a um número maior.",
        action: () => {
          [1, 2, 3].forEach((nodeId, index) => {
            setTimeout(() => {
              addMessage(nodeId, 0, 'promise');
            }, index * 200);
          });
        }
      },
      {
        title: "Fase 2a: Propose",
        description: "O Proposer envia o valor proposto para os Acceptors.",
        action: () => {
          [1, 2, 3].forEach(nodeId => {
            addMessage(0, nodeId, 'propose', 'value=X');
          });
          // Update acceptors to show they received the proposal
          setNodes(prev => prev.map(node => 
            node.role === 'acceptor'
              ? { ...node, acceptedProposal: 1, value: 'X' }
              : node
          ));
        }
      },
      {
        title: "Fase 2b: Accept",
        description: "Os Acceptors aceitam o valor e notificam os Learners.",
        action: () => {
          [1, 2, 3].forEach((nodeId, index) => {
            setTimeout(() => {
              addMessage(nodeId, 4, 'accept', 'value=X');
            }, index * 200);
          });
          // Update learner to show it learned the value
          setTimeout(() => {
            setNodes(prev => prev.map(node => 
              node.role === 'learner'
                ? { ...node, value: 'X' }
                : node
            ));
          }, 800);
        }
      }
    ],
    zookeeper: [
      {
        title: "Estado Inicial (ZooKeeper)",
        description: "Configuração inicial com um líder e seguidores.",
        action: () => {
          setNodes([
            { id: 0, role: 'leader', term: 1, log: ['config'], active: true },
            { id: 1, role: 'follower', term: 1, log: ['config'], active: true },
            { id: 2, role: 'follower', term: 1, log: ['config'], active: true },
            { id: 3, role: 'follower', term: 1, log: ['config'], active: true },
            { id: 4, role: 'participant', term: 0, log: [], active: true },
          ]);
          setMessages([]);
        }
      },
      {
        title: "Watch Request",
        description: "Um participante registra interesse em mudanças.",
        action: () => {
          addMessage(4, 0, 'watch', '/path/data');
          setNodes(prev => prev.map(node => 
            node.id === 4
              ? { ...node, value: 'watching /path/data' }
              : node
          ));
        }
      },
      {
        title: "Atualização de Dados",
        description: "O líder propaga uma atualização para os seguidores.",
        action: () => {
          // Leader creates new transaction
          setNodes(prev => prev.map(node => 
            node.role === 'leader'
              ? { ...node, term: node.term + 1, log: [...node.log, '/path/data=newValue'] }
              : node
          ));

          // Replicate to followers
          [1, 2, 3].forEach((nodeId, index) => {
            setTimeout(() => {
              addMessage(0, nodeId, 'log_replication', 'update=/path/data');
              setNodes(prev => prev.map(node => 
                node.id === nodeId
                  ? { ...node, term: prev[0].term, log: [...prev[0].log] }
                  : node
              ));
            }, index * 200);
          });
        }
      },
      {
        title: "Notificação",
        description: "O líder notifica o participante sobre a mudança.",
        action: () => {
          addMessage(0, 4, 'notify', 'changed=/path/data');
          setNodes(prev => prev.map(node => 
            node.id === 4
              ? { ...node, value: 'notified: /path/data changed' }
              : node
          ));
        }
      }
    ]
  };

  useEffect(() => {
    const currentSteps = protocolSteps[protocol];
    currentSteps[0].action();
    setStep(0);
    setIsPlaying(false);
  }, [protocol]);

  useEffect(() => {
    if (!isPlaying) return;

    const currentSteps = protocolSteps[protocol];
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < currentSteps.length - 1) {
          currentSteps[prev + 1].action();
          return prev + 1;
        }
        setIsPlaying(false);
        return prev;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, protocol]);

  // Calculate path positions between nodes
  const updatePaths = () => {
    if (!containerRef.current) return;

    const newPaths: Record<string, PathPosition> = {};
    const nodeElements = containerRef.current.querySelectorAll('[data-node-id]');
    
    nodeElements.forEach((fromNode) => {
      const fromId = fromNode.getAttribute('data-node-id');
      const fromRect = fromNode.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      nodeElements.forEach((toNode) => {
        const toId = toNode.getAttribute('data-node-id');
        if (fromId && toId && fromId !== toId) {
          const toRect = toNode.getBoundingClientRect();
          
          newPaths[`${fromId}-${toId}`] = {
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.top + fromRect.height / 2 - containerRect.top,
            x2: toRect.left + toRect.width / 2 - containerRect.left,
            y2: toRect.top + toRect.height / 2 - containerRect.top,
          };
        }
      });
    });

    setPaths(newPaths);
  };

  useEffect(() => {
    updatePaths();
    window.addEventListener('resize', updatePaths);
    return () => window.removeEventListener('resize', updatePaths);
  }, [nodes]);

  const getNodeColor = (role: string) => {
    switch (role) {
      case 'leader':
        return 'bg-green-500';
      case 'candidate':
        return 'bg-yellow-500';
      case 'proposer':
        return 'bg-purple-500';
      case 'acceptor':
        return 'bg-blue-500';
      case 'learner':
        return 'bg-cyan-500';
      case 'participant':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'vote_request':
      case 'prepare':
        return 'bg-yellow-500';
      case 'vote_response':
      case 'promise':
        return 'bg-green-500';
      case 'propose':
        return 'bg-purple-500';
      case 'accept':
        return 'bg-cyan-500';
      case 'watch':
        return 'bg-orange-500';
      case 'notify':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'follower':
        return 'Seguidor';
      case 'candidate':
        return 'Candidato';
      case 'leader':
        return 'Líder';
      case 'proposer':
        return 'Propositor';
      case 'acceptor':
        return 'Aceitador';
      case 'learner':
        return 'Aprendiz';
      case 'participant':
        return 'Participante';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Protocol Selection */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <label className="text-zinc-300">Protocolo:</label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as Protocol)}
            className="bg-zinc-800 text-white rounded-lg px-3 py-2"
          >
            <option value="raft">Raft</option>
            <option value="paxos">Paxos</option>
            <option value="zookeeper">ZooKeeper</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-zinc-900 rounded-lg p-4 flex flex-wrap gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-lg font-medium ${
            isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors`}
        >
          {isPlaying ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={() => {
            setStep(0);
            protocolSteps[protocol][0].action();
          }}
          className="px-4 py-2 rounded-lg font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
        >
          Reiniciar
        </button>
        <div className="flex items-center gap-2">
          <label className="text-zinc-300">Velocidade:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-zinc-800 text-white rounded-lg px-2 py-1"
          >
            <option value={3000}>Lento</option>
            <option value={2000}>Normal</option>
            <option value={1000}>Rápido</option>
          </select>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          {showExplanation ? 'Ocultar Explicações' : 'Mostrar Explicações'}
        </button>
      </div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        {showExplanation && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Passo {step + 1}: {protocolSteps[protocol][step].title}
            </h3>
            <p className="text-zinc-300">{protocolSteps[protocol][step].description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nodes Visualization */}
      <div className="bg-zinc-900 rounded-lg p-6 pb-20">
        <h2 className="text-xl font-bold text-blue-400 mb-6">Visualização do Cluster</h2>
        <div 
          ref={containerRef}
          className="relative aspect-square max-w-3xl mx-auto"
          style={{ height: '400px' }}
        >
          {/* Messages */}
          <AnimatePresence>
            {messages.map(message => {
              const fromPos = getNodePosition(message.from);
              const toPos = getNodePosition(message.to);

              return (
                <motion.div
                  key={message.id}
                  className={`absolute w-3 h-3 rounded-full ${getMessageColor(message.type)}`}
                  initial={{ 
                    x: fromPos.x,
                    y: fromPos.y,
                    scale: 0,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: toPos.x,
                    y: toPos.y,
                    scale: 1,
                    opacity: 1 
                  }}
                  exit={{ 
                    scale: 0,
                    opacity: 0 
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "linear"
                  }}
                />
              );
            })}
          </AnimatePresence>

          {/* Nodes */}
          {nodes.map((node, index) => {
            const position = getNodePosition(index);
            
            return (
              <motion.div
                key={node.id}
                className={`absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2
                  ${getNodeColor(node.role)} rounded-lg p-4
                  flex flex-col items-center justify-center text-white
                  ${node.active ? 'opacity-100' : 'opacity-50'}
                  shadow-lg`}
                style={{
                  left: position.x,
                  top: position.y,
                }}
                animate={{
                  scale: node.role === 'leader' || node.role === 'proposer' ? 1.1 : 1,
                  boxShadow: node.role === 'leader' || node.role === 'proposer'
                    ? '0 0 30px 5px rgba(34, 197, 94, 0.3)'
                    : '0 0 20px 0 rgba(59, 130, 246, 0.2)'
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <div className="text-lg font-medium">Nó {node.id}</div>
                <div className="text-sm capitalize">{getRoleName(node.role)}</div>
                {protocol === 'raft' && (
                  <>
                    <div className="text-xs">Termo {node.term}</div>
                    <div className="text-xs">Log: {node.log.length}</div>
                  </>
                )}
                {protocol === 'paxos' && (
                  <>
                    {node.role === 'proposer' && (
                      <div className="text-xs">Proposta: n=1</div>
                    )}
                    {node.role === 'acceptor' && (
                      <>
                        <div className="text-xs">Prometido: {node.promisedProposal}</div>
                        <div className="text-xs">Aceito: {node.acceptedProposal}</div>
                        {node.value && <div className="text-xs">Valor: {node.value}</div>}
                      </>
                    )}
                    {node.role === 'learner' && node.value && (
                      <div className="text-xs">Valor Aprendido: {node.value}</div>
                    )}
                  </>
                )}
                {protocol === 'zookeeper' && (
                  <>
                    {(node.role === 'leader' || node.role === 'follower') && (
                      <>
                        <div className="text-xs">zxid: {node.term}</div>
                        <div className="text-xs">Dados: {node.log.length}</div>
                      </>
                    )}
                    {node.role === 'participant' && (
                      <>
                        <div className="text-xs">Watching: /path/data</div>
                        {node.value && <div className="text-xs">Último Evento: {node.value}</div>}
                      </>
                    )}
                  </>
                )}
                {(node.role === 'leader' || node.role === 'proposer') && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-white"
                    initial={false}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / (protocolSteps[protocol].length - 1)) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-zinc-400 text-sm text-center">
          Progresso: {Math.round((step / (protocolSteps[protocol].length - 1)) * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <h3 className="font-medium text-zinc-300 mb-2">Legenda:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Estados dos Nós:</h4>
            <div className="grid gap-2">
              {protocol === 'raft' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-zinc-300">Seguidor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-zinc-300">Candidato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-zinc-300">Líder</span>
                  </div>
                </>
              )}
              {protocol === 'paxos' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-zinc-300">Propositor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-zinc-300">Aceitador</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                    <span className="text-zinc-300">Aprendiz</span>
                  </div>
                </>
              )}
              {protocol === 'zookeeper' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-zinc-300">Líder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-zinc-300">Seguidor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span className="text-zinc-300">Participante</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Tipos de Mensagens:</h4>
            <div className="grid gap-2">
              {protocol === 'raft' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-zinc-300">Solicitação de Voto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-zinc-300">Resposta de Voto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-zinc-300">Replicação de Log</span>
                  </div>
                </>
              )}
              {protocol === 'paxos' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-zinc-300">Prepare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-zinc-300">Promise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-zinc-300">Propose</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                    <span className="text-zinc-300">Accept</span>
                  </div>
                </>
              )}
              {protocol === 'zookeeper' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span className="text-zinc-300">Watch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-zinc-300">Replicação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-zinc-300">Notificação</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 