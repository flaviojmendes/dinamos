import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, SegmentBar, TacticalButton } from '../tactical';

const inputClass =
  'bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

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
  const { t } = useTranslation();
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

  const getNodePosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const radius = 150;
    const centerX = 200;
    const centerY = 200;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  };

  const protocolSteps = {
    raft: [
      { title: t('design_principles.consistency_strategies.consensus.step_initial_raft', 'Estado Inicial (Raft)'), description: t('design_principles.consistency_strategies.consensus.step_initial_raft_desc', 'Todos os nós começam como seguidores no termo 0.'), action: () => {
        setNodes([
          { id: 0, role: 'follower', term: 0, log: [], active: true },
          { id: 1, role: 'follower', term: 0, log: [], active: true },
          { id: 2, role: 'follower', term: 0, log: [], active: true },
          { id: 3, role: 'follower', term: 0, log: [], active: true },
          { id: 4, role: 'follower', term: 0, log: [], active: true },
        ]);
        setMessages([]);
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_timeout_election', 'Timeout e Eleição'), description: t('design_principles.consistency_strategies.consensus.step_timeout_election_desc', 'O Nó 2 detecta que não há líder e inicia uma eleição, tornando-se candidato.'), action: () => {
        setNodes(prev => prev.map(node => node.id === 2 ? { ...node, role: 'candidate', term: node.term + 1 } : node));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_vote_request', 'Solicitação de Votos'), description: t('design_principles.consistency_strategies.consensus.step_vote_request_desc', 'O candidato (Nó 2) solicita votos dos outros nós.'), action: () => {
        [0,1,3,4].forEach(nodeId => addMessage(2, nodeId, 'vote_request'));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_receive_votes', 'Recebimento de Votos'), description: t('design_principles.consistency_strategies.consensus.step_receive_votes_desc', 'Os outros nós votam no candidato se não votaram neste termo.'), action: () => {
        [0,1,3].forEach((nodeId, i) => setTimeout(() => addMessage(nodeId, 2, 'vote_response'), i*200));
        setTimeout(() => {
          setNodes(prev => prev.map(node => node.id === 2 ? { ...node, role: 'leader' } : { ...node, term: prev[2].term }));
        }, 1000);
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_leader_elected', 'Líder Eleito'), description: t('design_principles.consistency_strategies.consensus.step_leader_elected_desc', 'O Nó 2 recebe a maioria dos votos e se torna líder.'), action: () => {} },
      { title: t('design_principles.consistency_strategies.consensus.step_log_replication', 'Replicação de Log'), description: t('design_principles.consistency_strategies.consensus.step_log_replication_desc', 'O líder adiciona uma entrada no log e a replica para todos os seguidores.'), action: () => {
        setNodes(prev => {
          const newNodes = prev.map(node => node.id === 2 ? { ...node, log: [...node.log, 'Nova entrada de dados'] } : node);
          [0,1,3,4].forEach((nodeId, index) => {
            setTimeout(() => {
              addMessage(2, nodeId, 'log_replication');
              setNodes(nodes => nodes.map(n => n.id === nodeId ? { ...n, log: [...n.log, 'Nova entrada de dados'] } : n));
            }, index*200);
          });
          return newNodes;
        });
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_commit', 'Confirmação'), description: t('design_principles.consistency_strategies.consensus.step_commit_desc', 'A entrada é confirmada quando a maioria dos nós a registra.'), action: () => {} },
    ],
    paxos: [
      { title: t('design_principles.consistency_strategies.consensus.step_initial_paxos', 'Estado Inicial (Paxos)'), description: t('design_principles.consistency_strategies.consensus.step_initial_paxos_desc', 'Configuração inicial com Proposer, Acceptors e Learners.'), action: () => {
        setNodes([
          { id: 0, role: 'proposer', term: 1, log: [], active: true, value: 'X' },
          { id: 1, role: 'acceptor', term: 0, log: [], active: true, promisedProposal: 0, acceptedProposal: 0 },
          { id: 2, role: 'acceptor', term: 0, log: [], active: true, promisedProposal: 0, acceptedProposal: 0 },
          { id: 3, role: 'acceptor', term: 0, log: [], active: true, promisedProposal: 0, acceptedProposal: 0 },
          { id: 4, role: 'learner', term: 0, log: [], active: true },
        ]);
        setMessages([]);
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_paxos_1a', 'Fase 1a: Prepare'), description: t('design_principles.consistency_strategies.consensus.step_paxos_1a_desc', 'O Proposer envia mensagens Prepare para os Acceptors.'), action: () => {
        [1,2,3].forEach(nodeId => addMessage(0, nodeId, 'prepare', 'n=1'));
        setNodes(prev => prev.map(node => node.role === 'acceptor' ? { ...node, promisedProposal: 1 } : node));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_paxos_1b', 'Fase 1b: Promise'), description: t('design_principles.consistency_strategies.consensus.step_paxos_1b_desc', 'Os Acceptors respondem com Promise se não prometeram a um número maior.'), action: () => {
        [1,2,3].forEach((nodeId, index) => setTimeout(() => addMessage(nodeId, 0, 'promise'), index*200));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_paxos_2a', 'Fase 2a: Propose'), description: t('design_principles.consistency_strategies.consensus.step_paxos_2a_desc', 'O Proposer envia o valor proposto para os Acceptors.'), action: () => {
        [1,2,3].forEach(nodeId => addMessage(0, nodeId, 'propose', 'value=X'));
        setNodes(prev => prev.map(node => node.role === 'acceptor' ? { ...node, acceptedProposal: 1, value: 'X' } : node));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_paxos_2b', 'Fase 2b: Accept'), description: t('design_principles.consistency_strategies.consensus.step_paxos_2b_desc', 'Os Acceptors aceitam o valor e notificam os Learners.'), action: () => {
        [1,2,3].forEach((nodeId, index) => setTimeout(() => addMessage(nodeId, 4, 'accept', 'value=X'), index*200));
        setTimeout(() => setNodes(prev => prev.map(node => node.role === 'learner' ? { ...node, value: 'X' } : node)), 800);
      }},
    ],
    zookeeper: [
      { title: t('design_principles.consistency_strategies.consensus.step_initial_zk', 'Estado Inicial (ZooKeeper)'), description: t('design_principles.consistency_strategies.consensus.step_initial_zk_desc', 'Configuração inicial com um líder e seguidores.'), action: () => {
        setNodes([
          { id: 0, role: 'leader', term: 1, log: ['config'], active: true },
          { id: 1, role: 'follower', term: 1, log: ['config'], active: true },
          { id: 2, role: 'follower', term: 1, log: ['config'], active: true },
          { id: 3, role: 'follower', term: 1, log: ['config'], active: true },
          { id: 4, role: 'participant', term: 0, log: [], active: true },
        ]);
        setMessages([]);
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_watch', 'Watch Request'), description: t('design_principles.consistency_strategies.consensus.step_watch_desc', 'Um participante registra interesse em mudanças.'), action: () => {
        addMessage(4, 0, 'watch', '/path/data');
        setNodes(prev => prev.map(node => node.id === 4 ? { ...node, value: 'watching /path/data' } : node));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_update', 'Atualização de Dados'), description: t('design_principles.consistency_strategies.consensus.step_update_desc', 'O líder propaga uma atualização para os seguidores.'), action: () => {
        setNodes(prev => prev.map(node => node.role === 'leader' ? { ...node, term: node.term + 1, log: [...node.log, '/path/data=newValue'] } : node));
        [1,2,3].forEach((nodeId, index) => setTimeout(() => {
          addMessage(0, nodeId, 'log_replication', 'update=/path/data');
          setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, term: prev[0].term, log: [...prev[0].log] } : node));
        }, index*200));
      }},
      { title: t('design_principles.consistency_strategies.consensus.step_notify', 'Notificação'), description: t('design_principles.consistency_strategies.consensus.step_notify_desc', 'O líder notifica o participante sobre a mudança.'), action: () => {
        addMessage(0, 4, 'notify', 'changed=/path/data');
        setNodes(prev => prev.map(node => node.id === 4 ? { ...node, value: 'notified: /path/data changed' } : node));
      }},
    ],
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
      case 'leader': return 'bg-signal-green/20 border-2 border-signal-green text-signal-green';
      case 'candidate': return 'bg-signal-amber/20 border-2 border-signal-amber text-signal-amber';
      case 'proposer': return 'bg-signal-cyan/20 border-2 border-signal-cyan text-signal-cyan';
      case 'acceptor': return 'bg-tactical-raised border-2 border-tactical-border text-slate-900 dark:text-tactical-text';
      case 'learner': return 'bg-signal-cyan/10 border-2 border-signal-cyan/50 text-signal-cyan';
      case 'participant': return 'bg-signal-amber/10 border-2 border-signal-amber/50 text-signal-amber';
      default: return 'bg-tactical-raised border-2 border-tactical-border text-slate-900 dark:text-tactical-text';
    }
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'vote_request':
      case 'prepare': return 'bg-signal-amber';
      case 'vote_response':
      case 'promise': return 'bg-signal-green';
      case 'propose': return 'bg-signal-cyan';
      case 'accept': return 'bg-signal-cyan';
      case 'watch': return 'bg-signal-amber';
      case 'notify': return 'bg-signal-red';
      default: return 'bg-signal-cyan';
    }
  };

  const getRoleName = (role: keyof typeof roles) => roles[role] || role;
  const roles = t('design_principles.consistency_strategies.consensus_simulator.roles', { returnObjects: true }) as Record<string, string>;

  return (
    <div className="space-y-6">
      <Panel title={t('design_principles.consistency_strategies.consensus_simulator.controls.protocol_label')} accent="cyan">
        <div className="flex items-center gap-4">
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as Protocol)}
            className={inputClass}
          >
            <option value="raft">{t('design_principles.consistency_strategies.consensus_simulator.controls.options.raft')}</option>
            <option value="paxos">{t('design_principles.consistency_strategies.consensus_simulator.controls.options.paxos')}</option>
            <option value="zookeeper">{t('design_principles.consistency_strategies.consensus_simulator.controls.options.zookeeper')}</option>
          </select>
        </div>
      </Panel>

      <Panel title={t('design_principles.consistency_strategies.consensus_simulator.controls.start')} accent="amber">
        <div className="flex flex-wrap items-center gap-3">
          <TacticalButton
            size="sm"
            variant={isPlaying ? 'danger' : 'primary'}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? t('design_principles.consistency_strategies.consensus_simulator.controls.pause') : t('design_principles.consistency_strategies.consensus_simulator.controls.start')}
          </TacticalButton>
          <TacticalButton
            size="sm"
            variant="secondary"
            onClick={() => { setStep(0); protocolSteps[protocol][0].action(); }}
          >
            {t('design_principles.consistency_strategies.consensus_simulator.controls.restart')}
          </TacticalButton>
          <div className="flex items-center gap-2">
            <label className="label-mono text-slate-500 dark:text-tactical-label">{t('design_principles.consistency_strategies.consensus_simulator.controls.speed_label')}</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={inputClass}
            >
              <option value={3000}>{t('design_principles.consistency_strategies.consensus_simulator.controls.speed_opts.slow')}</option>
              <option value={2000}>{t('design_principles.consistency_strategies.consensus_simulator.controls.speed_opts.normal')}</option>
              <option value={1000}>{t('design_principles.consistency_strategies.consensus_simulator.controls.speed_opts.fast')}</option>
            </select>
          </div>
          <TacticalButton size="sm" variant="ghost" onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? t('design_principles.consistency_strategies.consensus_simulator.controls.hide_explanations') : t('design_principles.consistency_strategies.consensus_simulator.controls.show_explanations')}
          </TacticalButton>
        </div>
      </Panel>

      <AnimatePresence mode="wait">
        {showExplanation && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tactical-panel border-l-2 border-l-signal-cyan p-5"
          >
            <h3 className="label-mono text-signal-cyan mb-2">
              {t('design_principles.consistency_strategies.consensus_simulator.step_prefix')} {step + 1}: {protocolSteps[protocol][step].title}
            </h3>
            <p className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{protocolSteps[protocol][step].description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Panel title={t('design_principles.consistency_strategies.consensus_simulator.cluster_vis_title')} accent="green" bodyClassName="pb-20">
        <div ref={containerRef} className="relative aspect-square max-w-3xl mx-auto" style={{ height: '400px' }}>
          {/* Messages */}
          <AnimatePresence>
            {messages.map(message => {
              const fromPos = getNodePosition(message.from);
              const toPos = getNodePosition(message.to);
              return (
                <motion.div
                  key={message.id}
                  className={`absolute w-3 h-3 rounded-full ${getMessageColor(message.type)}`}
                  initial={{ x: fromPos.x, y: fromPos.y, scale: 0, opacity: 0 }}
                  animate={{ x: toPos.x, y: toPos.y, scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'linear' }}
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
                className={`absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 ${getNodeColor(node.role)} p-4 flex flex-col items-center justify-center font-mono text-xs ${node.active ? 'opacity-100' : 'opacity-50'}`}
                style={{ left: position.x, top: position.y }}
                animate={{
                  scale: node.role === 'leader' || node.role === 'proposer' ? 1.1 : 1,
                  boxShadow: node.role === 'leader' || node.role === 'proposer' ? '0 0 30px 5px rgba(34, 197, 94, 0.3)' : '0 0 20px 0 rgba(59, 130, 246, 0.2)'
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="text-lg font-medium">{t('design_principles.consistency_strategies.consensus_simulator.labels.node_label')} {node.id}</div>
                <div className="text-sm capitalize">{getRoleName(node.role)}</div>
                {protocol === 'raft' && (
                  <>
                    <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.term_label')} {node.term}</div>
                    <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.log_label')}: {node.log.length}</div>
                  </>
                )}
                {protocol === 'paxos' && (
                  <>
                    {node.role === 'proposer' && (
                      <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.proposal_label')}: n=1</div>
                    )}
                    {node.role === 'acceptor' && (
                      <>
                        <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.promised_label')}: {node.promisedProposal}</div>
                        <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.accepted_label')}: {node.acceptedProposal}</div>
                        {node.value && <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.value_label')}: {node.value}</div>}
                      </>
                    )}
                    {node.role === 'learner' && node.value && (
                      <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.learned_value_label')}: {node.value}</div>
                    )}
                  </>
                )}
                {protocol === 'zookeeper' && (
                  <>
                    {(node.role === 'leader' || node.role === 'follower') && (
                      <>
                        <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.zxid_label')}: {node.term}</div>
                        <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.data_label')}: {node.log.length}</div>
                      </>
                    )}
                    {node.role === 'participant' && (
                      <>
                        <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.watching_label', { path: '/path/data' })}</div>
                        {node.value && <div className="text-xs">{t('design_principles.consistency_strategies.consensus_simulator.labels.last_event_label', { event: node.value })}</div>}
                      </>
                    )}
                  </>
                )}
                {(node.role === 'leader' || node.role === 'proposer') && (
                  <motion.div
                    className="absolute inset-0 border-2 border-signal-green/50"
                    initial={false}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </Panel>

      <Panel title={t('design_principles.consistency_strategies.consensus_simulator.progress_label', { percent: Math.round((step / (protocolSteps[protocol].length - 1)) * 100) })} accent="cyan">
        <SegmentBar
          value={step}
          max={protocolSteps[protocol].length - 1}
          color="cyan"
          caption={`${Math.round((step / (protocolSteps[protocol].length - 1)) * 100)}%`}
        />
      </Panel>

      <Panel title={t('design_principles.consistency_strategies.consensus_simulator.legend.legend_title')} accent="amber">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t('design_principles.consistency_strategies.consensus_simulator.legend.node_states_title')}</h4>
            <div className="grid gap-2">
              {protocol === 'raft' && (
                <>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-tactical-raised border border-tactical-border"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.follower}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-amber"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.candidate}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-green"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.leader}</span></div>
                </>
              )}
              {protocol === 'paxos' && (
                <>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-cyan"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.proposer}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-tactical-raised border border-tactical-border"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.acceptor}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-cyan/60"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.learner}</span></div>
                </>
              )}
              {protocol === 'zookeeper' && (
                <>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-green"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.leader}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-tactical-raised border border-tactical-border"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.follower}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-amber"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{roles.participant}</span></div>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t('design_principles.consistency_strategies.consensus_simulator.legend.message_types_title')}</h4>
            <div className="grid gap-2">
              {protocol === 'raft' && (
                <>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-amber"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.vote_request')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-green"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.vote_response')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-cyan"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.log_replication')}</span></div>
                </>
              )}
              {protocol === 'paxos' && (
                <>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-amber"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.prepare')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-green"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.promise')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-cyan"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.propose')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-cyan/60"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.accept')}</span></div>
                </>
              )}
              {protocol === 'zookeeper' && (
                <>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-amber"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.watch')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-cyan"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.replication')}</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-signal-red"></div><span className="font-mono text-sm text-slate-600 dark:text-tactical-dim">{t('design_principles.consistency_strategies.consensus_simulator.messages.notification')}</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
} 