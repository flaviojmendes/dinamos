import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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

const inputClass =
  'bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

export default function TwoPhaseCommitSimulator() {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, name: t('design_principles.two_phase_commit_simulator.nodes.coordinator'), type: 'coordinator', state: 'idle' },
    { id: 1, name: t('design_principles.two_phase_commit_simulator.nodes.bank_n', { n: 1 }), type: 'participant', state: 'idle', hasResources: true, willVoteYes: true },
    { id: 2, name: t('design_principles.two_phase_commit_simulator.nodes.bank_n', { n: 2 }), type: 'participant', state: 'idle', hasResources: true, willVoteYes: true },
    { id: 3, name: t('design_principles.two_phase_commit_simulator.nodes.bank_n', { n: 3 }), type: 'participant', state: 'idle', hasResources: true, willVoteYes: true },
  ]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const getNodeBorder = (state: Node['state']) => {
    switch (state) {
      case 'idle': return 'border-tactical-border bg-tactical-raised';
      case 'preparing': return 'border-signal-amber bg-signal-amber/10';
      case 'prepared': return 'border-signal-cyan bg-signal-cyan/10';
      case 'committed': return 'border-signal-green bg-signal-green/10';
      case 'aborted': return 'border-signal-red bg-signal-red/10';
      default: return 'border-tactical-border bg-tactical-raised';
    }
  };

  const getStateBadge = (state: Node['state']): React.ComponentProps<typeof StatusBadge>['variant'] => {
    switch (state) {
      case 'idle': return 'offline';
      case 'preparing': return 'in-progress';
      case 'prepared': return 'pending';
      case 'committed': return 'completed';
      case 'aborted': return 'classified';
      default: return 'offline';
    }
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'prepare': return 'text-signal-amber';
      case 'vote': return 'text-signal-cyan';
      case 'commit': return 'text-signal-green';
      case 'abort': return 'text-signal-red';
      case 'ack': return 'text-slate-500 dark:text-tactical-dim';
      default: return 'text-slate-900 dark:text-tactical-text';
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
      case 0:
        setNodes(prev => prev.map(node => 
          node.type === 'coordinator' ? { ...node, state: 'preparing' } : node
        ));
        nodes.forEach(node => {
          if (node.type === 'participant') {
            addMessage(0, node.id, 'prepare', t('design_principles.two_phase_commit_simulator.messages.prepare_q'));
          }
        });
        break;

      case 1:
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
              node.willVoteYes ? t('design_principles.two_phase_commit_simulator.messages.vote_yes') : t('design_principles.two_phase_commit_simulator.messages.vote_no')
            );
          }
        });
        break;

      case 2: {
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
              allPrepared ? t('design_principles.two_phase_commit_simulator.messages.decision_commit') : t('design_principles.two_phase_commit_simulator.messages.decision_abort')
            );
          }
        });
        break;
      }

      case 3:
        nodes.forEach(node => {
          if (node.type === 'participant') {
            addMessage(
              node.id,
              0,
              'ack',
              t('design_principles.two_phase_commit_simulator.messages.done')
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
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('design_principles.two_phase_commit_simulator.title')} ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('design_principles.two_phase_commit_simulator.intro')}
        </p>
      </div>

      <Panel title={t('design_principles.two_phase_commit_simulator.controls.simulation')} accent="amber">
        <div className="flex flex-wrap items-center gap-3">
          <TacticalButton
            size="sm"
            variant={isAutoPlaying ? 'danger' : 'primary'}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={step >= 4}
          >
            {isAutoPlaying ? t('design_principles.two_phase_commit_simulator.controls.pause') : t('design_principles.two_phase_commit_simulator.controls.start')} {t('design_principles.two_phase_commit_simulator.controls.simulation')}
          </TacticalButton>
          <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
            {t('design_principles.two_phase_commit_simulator.controls.reset')}
          </TacticalButton>
          <div className="flex items-center gap-2">
            <label className="label-mono text-slate-500 dark:text-tactical-label">{t('design_principles.two_phase_commit_simulator.controls.speed_label')}</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={inputClass}
            >
              <option value={2000}>{t('design_principles.two_phase_commit_simulator.controls.speed_opts.slow')}</option>
              <option value={1500}>{t('design_principles.two_phase_commit_simulator.controls.speed_opts.normal')}</option>
              <option value={800}>{t('design_principles.two_phase_commit_simulator.controls.speed_opts.fast')}</option>
            </select>
          </div>
        </div>
      </Panel>

      <Panel title={t('design_principles.two_phase_commit_simulator.steps.current_phase')} accent="green" bodyClassName="min-h-[400px]">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={`p-4 border ${getNodeBorder(node.state)} transition-colors`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-mono text-sm font-semibold text-slate-900 dark:text-tactical-text">{node.name}</h4>
                <StatusBadge variant={getStateBadge(node.state)} label={t('design_principles.two_phase_commit_simulator.node_states.' + node.state, node.state)} />
              </div>
              <div className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
                {node.response && <div>{t('design_principles.two_phase_commit_simulator.responses.' + node.response)}</div>}
                {node.type === 'participant' && step === 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="label-mono">{t('design_principles.two_phase_commit_simulator.config.configure_response')}</div>
                    <div className="flex gap-2">
                      <TacticalButton
                        size="sm"
                        variant={node.willVoteYes ? 'primary' : 'ghost'}
                        onClick={() => toggleNodeResponse(node.id)}
                      >
                        {t('design_principles.two_phase_commit_simulator.config.approve')}
                      </TacticalButton>
                      <TacticalButton
                        size="sm"
                        variant={!node.willVoteYes ? 'danger' : 'ghost'}
                        onClick={() => toggleNodeResponse(node.id)}
                      >
                        {t('design_principles.two_phase_commit_simulator.config.reject')}
                      </TacticalButton>
                    </div>
                    <div className="text-xs mt-2">
                      {t('design_principles.two_phase_commit_simulator.config.status')}{' '}
                      <span className={node.willVoteYes ? 'text-signal-green' : 'text-signal-red'}>
                        {node.willVoteYes ? t('design_principles.two_phase_commit_simulator.config.will_approve') : t('design_principles.two_phase_commit_simulator.config.will_reject')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2 border-t border-slate-200 dark:border-tactical-border pt-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-2 font-mono text-sm ${getMessageColor(message.type)}`}
              >
                <span>{nodes[message.from].name} → {nodes[message.to].name}:</span>
                <span>{message.content}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Panel>

      <div className="tactical-panel border-l-2 border-l-signal-cyan p-5">
        <h4 className="label-mono text-signal-cyan mb-2">{t('design_principles.two_phase_commit_simulator.steps.current_phase')}</h4>
        <p className="font-mono text-sm text-slate-600 dark:text-tactical-dim">
          {step === 0 && t('design_principles.two_phase_commit_simulator.steps.s0')}
          {step === 1 && t('design_principles.two_phase_commit_simulator.steps.s1')}
          {step === 2 && t('design_principles.two_phase_commit_simulator.steps.s2')}
          {step === 3 && t('design_principles.two_phase_commit_simulator.steps.s3')}
          {step === 4 && t('design_principles.two_phase_commit_simulator.steps.s4')}
        </p>
      </div>
    </div>
  );
}
