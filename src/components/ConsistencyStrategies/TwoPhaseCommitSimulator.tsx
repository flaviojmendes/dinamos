import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Node {
  id: number;
  name: string;
  type: 'coordinator' | 'participant';
  state: 'idle' | 'preparing' | 'prepared' | 'committed' | 'aborted';
  response?: 'yes' | 'no';
  hasResources?: boolean;
  willVoteYes?: boolean;
}

interface Message {
  id: number;
  from: number;
  to: number;
  type: 'prepare' | 'vote' | 'commit' | 'abort' | 'ack';
  content: string;
}

export default function TwoPhaseCommitSimulator() {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, name: t('design_principles.consistency_strategies.two_phase_commit_simulator.nodes.coordinator'), type: 'coordinator', state: 'idle' },
    { id: 1, name: t('design_principles.consistency_strategies.two_phase_commit_simulator.nodes.bank_n', { n: 1 }), type: 'participant', state: 'idle', hasResources: true, willVoteYes: true },
    { id: 2, name: t('design_principles.consistency_strategies.two_phase_commit_simulator.nodes.bank_n', { n: 2 }), type: 'participant', state: 'idle', hasResources: true, willVoteYes: true },
    { id: 3, name: t('design_principles.consistency_strategies.two_phase_commit_simulator.nodes.bank_n', { n: 3 }), type: 'participant', state: 'idle', hasResources: true, willVoteYes: true },
  ]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // milliseconds between steps

  const getNodeColor = (state: Node['state']) => {
    switch (state) {
      case 'idle': return 'bg-zinc-700';
      case 'preparing': return 'bg-yellow-600';
      case 'prepared': return 'bg-blue-600';
      case 'committed': return 'bg-green-600';
      case 'aborted': return 'bg-red-600';
      default: return 'bg-zinc-700';
    }
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'prepare': return 'text-yellow-400';
      case 'vote': return 'text-blue-400';
      case 'commit': return 'text-green-400';
      case 'abort': return 'text-red-400';
      case 'ack': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  const resetSimulation = () => {
    setNodes(prev => prev.map(node => ({
      ...node,
      state: 'idle',
      response: undefined,
    })));
    setMessages([]);
    setStep(0);
    setIsAutoPlaying(false);
  };

  const addMessage = (from: number, to: number, type: Message['type'], content: string) => {
    setMessages(prev => [...prev, { id: Date.now(), from, to, type, content }]);
  };

  const toggleNodeResponse = (nodeId: number) => {
    if (!isAutoPlaying && step === 0) {
      setNodes(prev => prev.map(node => 
        node.id === nodeId && node.type === 'participant'
          ? { ...node, willVoteYes: !node.willVoteYes }
          : node
      ));
    }
  };

  const simulateStep = useCallback(() => {
    switch (step) {
      case 0: // Phase 1 start: Prepare
        setNodes(prev => prev.map(node => 
          node.type === 'coordinator' ? { ...node, state: 'preparing' } : node
        ));
        nodes.forEach(node => {
          if (node.type === 'participant') {
            addMessage(0, node.id, 'prepare', t('design_principles.consistency_strategies.two_phase_commit_simulator.messages.prepare_q'));
          }
        });
        break;

      case 1: // Participants respond
        setNodes(prev => prev.map(node => {
          if (node.type === 'participant') {
            return {
              ...node,
              state: node.willVoteYes ? 'prepared' : 'aborted',
              response: node.willVoteYes ? 'yes' : 'no'
            };
          }
          return node;
        }));
        nodes.forEach(node => {
          if (node.type === 'participant') {
            addMessage(
              node.id,
              0,
              'vote',
              node.willVoteYes ? t('design_principles.consistency_strategies.two_phase_commit_simulator.messages.vote_yes') : t('design_principles.consistency_strategies.two_phase_commit_simulator.messages.vote_no')
            );
          }
        });
        break;

      case 2: // Phase 2 start: Decision
        const allPrepared = nodes.every(node => 
          node.type === 'coordinator' || (node.type === 'participant' && node.willVoteYes)
        );
        
        setNodes(prev => prev.map(node => ({
          ...node,
          state: allPrepared ? 'committed' : 'aborted'
        })));

        nodes.forEach(node => {
          if (node.type === 'participant') {
            addMessage(
              0,
              node.id,
              allPrepared ? 'commit' : 'abort',
              allPrepared ? t('design_principles.consistency_strategies.two_phase_commit_simulator.messages.decision_commit') : t('design_principles.consistency_strategies.two_phase_commit_simulator.messages.decision_abort')
            );
          }
        });
        break;

      case 3: // Final acknowledgment
        nodes.forEach(node => {
          if (node.type === 'participant') {
            addMessage(
              node.id,
              0,
              'ack',
              t('design_principles.consistency_strategies.two_phase_commit_simulator.messages.done')
            );
          }
        });
        setIsAutoPlaying(false);
        break;

      default:
        setIsAutoPlaying(false);
        break;
    }
    setStep(prev => prev + 1);
  }, [step, nodes, t]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && step < 4) {
      timer = setTimeout(simulateStep, speed);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, step, simulateStep, speed]);

  return (
    <div className="bg-zinc-900 rounded-lg p-6 mt-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-4">{t('design_principles.consistency_strategies.two_phase_commit_simulator.title')}</h3>
        <p className="text-zinc-400 mb-4">
          {t('design_principles.consistency_strategies.two_phase_commit_simulator.intro')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled={step >= 4}
        >
          {isAutoPlaying ? t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.pause') : t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.start')} {t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.simulation')}
        </button>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
        >
          {t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.reset')}
        </button>
        <div className="flex items-center gap-2">
          <label className="text-zinc-400">{t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.speed_label')}</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-zinc-800 text-white px-3 py-2 rounded-lg"
          >
            <option value={2000}>{t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.speed_opts.slow')}</option>
            <option value={1500}>{t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.speed_opts.normal')}</option>
            <option value={800}>{t('design_principles.consistency_strategies.two_phase_commit_simulator.controls.speed_opts.fast')}</option>
          </select>
        </div>
      </div>

      {/* Simulation Area */}
      <div className="relative bg-zinc-800 rounded-lg p-6 min-h-[400px]">
        {/* Nodes */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {nodes.map((node) => (
              <motion.div
              key={node.id}
              className={`p-4 rounded-lg ${getNodeColor(node.state)} transition-colors`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="text-white font-semibold mb-2">{node.name}</h4>
                <div className="text-sm text-zinc-300">
                  {t('design_principles.consistency_strategies.two_phase_commit_simulator.node_states.' + node.state, node.state)}
                  {node.response && <div>{t('design_principles.consistency_strategies.two_phase_commit_simulator.responses.' + node.response)}</div>}
                  {node.type === 'participant' && step === 0 && (
                    <div className="mt-3 space-y-2">
                        <div className="text-xs text-zinc-400">{t('design_principles.consistency_strategies.two_phase_commit_simulator.config.configure_response')}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleNodeResponse(node.id)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                node.willVoteYes
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                              }`}
                            >
                              {t('design_principles.consistency_strategies.two_phase_commit_simulator.config.approve')}
                            </button>
                            <button
                              onClick={() => toggleNodeResponse(node.id)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                !node.willVoteYes
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                              }`}
                            >
                              {t('design_principles.consistency_strategies.two_phase_commit_simulator.config.reject')}
                            </button>
                          </div>
                          <div className="text-xs mt-2">
                            {t('design_principles.consistency_strategies.two_phase_commit_simulator.config.status')} <span className={node.willVoteYes ? 'text-green-400' : 'text-red-400'}>
                              {node.willVoteYes ? t('design_principles.consistency_strategies.two_phase_commit_simulator.config.will_approve') : t('design_principles.consistency_strategies.two_phase_commit_simulator.config.will_reject')}
                            </span>
                        </div>
                    </div>
                  )}
                </div>
              </motion.div>
          ))}
                    </div>

        {/* Messages */}
        <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
            {messages.map((message) => (
                          <motion.div
                            key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-2 ${getMessageColor(message.type)}`}
                          >
                <span className="font-mono">{nodes[message.from].name} → {nodes[message.to].name}:</span>
                <span>{message.content}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
        </div>
      </div>

      {/* Step Description */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-2">{t('design_principles.consistency_strategies.two_phase_commit_simulator.steps.current_phase')}</h4>
        <p className="text-zinc-300">
          {step === 0 && t('design_principles.consistency_strategies.two_phase_commit_simulator.steps.s0')}
          {step === 1 && t('design_principles.consistency_strategies.two_phase_commit_simulator.steps.s1')}
          {step === 2 && t('design_principles.consistency_strategies.two_phase_commit_simulator.steps.s2')}
          {step === 3 && t('design_principles.consistency_strategies.two_phase_commit_simulator.steps.s3')}
          {step === 4 && t('design_principles.consistency_strategies.two_phase_commit_simulator.steps.s4')}
        </p>
      </div>
    </div>
  );
} 
