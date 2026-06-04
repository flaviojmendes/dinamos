import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

interface Message {
  id: number;
  content: string;
  status: 'produced' | 'queued' | 'processing' | 'completed';
  producedAt: number;
  processedAt?: number;
  consumerId?: number;
}

interface Config {
  producerRate: number;
  consumerRate: number;
  maxQueueSize: number;
  processTime: number;
  producerCount: number;
  consumerCount: number;
}

interface Stats {
  produced: number;
  processed: number;
  dropped: number;
  avgProcessingTime: number;
}

const messageStatusVariant = (status: Message['status']) => {
  switch (status) {
    case 'produced': return 'pending' as const;
    case 'queued': return 'in-progress' as const;
    case 'processing': return 'active' as const;
    case 'completed': return 'completed' as const;
  }
};

export default function MessageQueue() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats>({
    produced: 0,
    processed: 0,
    dropped: 0,
    avgProcessingTime: 0
  });
  const [config, setConfig] = useState<Config>({
    producerRate: 1000,
    consumerRate: 500,
    maxQueueSize: 10,
    processTime: 500,
    producerCount: 2,
    consumerCount: 1
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setMessages([]);
    setQueuedMessages([]);
    setStats({
      produced: 0,
      processed: 0,
      dropped: 0,
      avgProcessingTime: 0
    });
  }, []);

  const produceMessage = useCallback((producerId: number) => {
    if (queuedMessages.length >= config.maxQueueSize) {
      setStats(prev => ({ ...prev, dropped: prev.dropped + 1 }));
      return;
    }

    const newMessage: Message = {
      id: Date.now() + Math.random(),
      content: `MSG-P${producerId}-${stats.produced + 1}`,
      status: 'produced',
      producedAt: Date.now()
    };

    setMessages(prev => [newMessage, ...prev].slice(0, 50));
    setStats(prev => ({ ...prev, produced: prev.produced + 1 }));

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'queued' } : msg
        )
      );
      setQueuedMessages(prev => [...prev, { ...newMessage, status: 'queued' }]);
    }, 300);
  }, [config.maxQueueSize, stats.produced, queuedMessages.length]);

  const consumeMessage = useCallback((consumerId: number) => {
    if (queuedMessages.length === 0) return;

    const isProcessing = messages.some(m => 
      m.status === 'processing' && m.consumerId === consumerId
    );
    if (isProcessing) return;

    const [messageToProcess, ...remainingMessages] = queuedMessages;
    setQueuedMessages(remainingMessages);

    const startProcessing = Date.now();
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageToProcess.id 
          ? { ...msg, status: 'processing', consumerId } 
          : msg
      )
    );

    setTimeout(() => {
      const endProcessing = Date.now();
      const processingTime = endProcessing - messageToProcess.producedAt;

    setMessages(prev => 
      prev.map(msg =>
          msg.id === messageToProcess.id
            ? { 
                ...msg, 
                status: 'completed', 
                processedAt: endProcessing,
                consumerId: undefined 
              }
          : msg
      )
    );

      setStats(prev => ({
        ...prev,
        processed: prev.processed + 1,
        avgProcessingTime: 
          (prev.avgProcessingTime * prev.processed + processingTime) / 
          (prev.processed + 1)
      }));
    }, config.processTime);
  }, [config.processTime, messages, queuedMessages]);

  useEffect(() => {
    if (!isRunning) return;

    const producerIntervals = Array.from({ length: config.producerCount }, (_, i) => {
      return setInterval(() => produceMessage(i + 1), config.producerRate);
    });

    return () => {
      producerIntervals.forEach(clearInterval);
    };
  }, [isRunning, config.producerCount, config.producerRate, produceMessage]);

  useEffect(() => {
    if (!isRunning) return;

    const consumerIntervals = Array.from({ length: config.consumerCount }, (_, i) => {
      return setInterval(() => consumeMessage(i + 1), config.consumerRate);
    });

    return () => {
      consumerIntervals.forEach(clearInterval);
    };
  }, [isRunning, config.consumerCount, config.consumerRate, consumeMessage]);

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('simulators.message_queue_sim.title')} ]
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
          {isConfigOpen ? t('simulators.message_queue_sim.buttons.close_config') : t('simulators.message_queue_sim.buttons.configure')}
        </TacticalButton>
        <TacticalButton
          size="sm"
          variant={isRunning ? 'danger' : 'primary'}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? t('simulators.message_queue_sim.buttons.stop') : t('simulators.message_queue_sim.buttons.start')}
        </TacticalButton>
        <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
          {t('simulators.message_queue_sim.buttons.reset')}
        </TacticalButton>
        {isRunning && <StatusBadge variant="active" label="RUNNING" />}
      </div>

      {isConfigOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Panel title={t('simulators.message_queue_sim.buttons.configure')} accent="cyan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.producers')}</span>
                    <span className="text-signal-cyan">{config.producerCount}</span>
                  </div>
                  <input type="range" min="1" max="5" value={config.producerCount} onChange={(e) => setConfig(c => ({ ...c, producerCount: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.production_rate')}</span>
                    <span className="text-signal-cyan">{config.producerRate}ms</span>
                  </div>
                  <input type="range" min="500" max="5000" step="500" value={config.producerRate} onChange={(e) => setConfig(c => ({ ...c, producerRate: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.max_queue_size')}</span>
                    <span className="text-signal-cyan">{config.maxQueueSize}</span>
                  </div>
                  <input type="range" min="5" max="50" value={config.maxQueueSize} onChange={(e) => setConfig(c => ({ ...c, maxQueueSize: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.consumers')}</span>
                    <span className="text-signal-cyan">{config.consumerCount}</span>
                  </div>
                  <input type="range" min="1" max="5" value={config.consumerCount} onChange={(e) => setConfig(c => ({ ...c, consumerCount: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.consumption_rate')}</span>
                    <span className="text-signal-cyan">{config.consumerRate}ms</span>
                  </div>
                  <input type="range" min="500" max="5000" step="500" value={config.consumerRate} onChange={(e) => setConfig(c => ({ ...c, consumerRate: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-mono text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.process_time')}</span>
                    <span className="text-signal-cyan">{config.processTime}ms</span>
                  </div>
                  <input type="range" min="500" max="5000" step="500" value={config.processTime} onChange={(e) => setConfig(c => ({ ...c, processTime: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
              </div>
            </div>
          </Panel>
        </motion.div>
      )}

      <Panel title={t('simulators.message_queue_sim.flow.title')} accent="amber">
        <div className="relative h-48 flex items-center justify-between max-w-4xl mx-auto">
          <div className="absolute h-px bg-slate-300 dark:bg-tactical-line left-[25%] right-[25%] top-1/2 -translate-y-1/2" />
          <div className="relative z-10 w-1/4">
            <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
              <div className="label-mono text-signal-cyan mb-2">{t('simulators.message_queue_sim.config.producers')}</div>
              <div className="space-y-2">
                {Array.from({ length: config.producerCount }).map((_, i) => (
                  <div key={i} className="h-6 border border-signal-cyan/40 bg-signal-cyan/10 flex items-center justify-center font-mono text-xs text-signal-cyan">
                    P{i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10 w-1/3">
            <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
              <div className="label-mono text-signal-amber mb-2">{t('simulators.message_queue_sim.flow.queue')}</div>
              <div className="relative h-24 border border-slate-300 dark:border-tactical-border bg-slate-100 dark:bg-tactical-surface overflow-hidden">
                <AnimatePresence>
                  {queuedMessages.slice(0, 5).map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute w-full p-2"
                      style={{ top: `${index * 20}%` }}
                    >
                      <div className="h-4 border border-signal-amber/40 bg-signal-amber/10 flex items-center justify-center font-mono text-xs text-signal-amber">
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {queuedMessages.length > 5 && (
                  <div className="absolute bottom-0 inset-x-0 text-center font-mono text-xs text-slate-500 dark:text-tactical-label py-1">
                    {t('simulators.message_queue_sim.flow.more', { count: queuedMessages.length - 5 })}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative z-10 w-1/4">
            <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
              <div className="label-mono text-signal-green mb-2">{t('simulators.message_queue_sim.config.consumers')}</div>
              <div className="space-y-2">
                {Array.from({ length: config.consumerCount }).map((_, i) => {
                  const processingMessage = messages.find(m => m.status === 'processing' && m.consumerId === i + 1);
                  return (
                    <div key={i} className="space-y-1">
                      <div className={`h-6 border flex items-center justify-center font-mono text-xs ${
                        processingMessage
                          ? 'border-signal-amber/40 bg-signal-amber/10 text-signal-amber'
                          : 'border-signal-green/40 bg-signal-green/10 text-signal-green'
                      }`}>
                        C{i + 1}
                      </div>
                      {processingMessage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="font-mono text-xs border border-signal-amber/30 bg-signal-amber/5 p-1 text-signal-amber text-center"
                        >
                          {processingMessage.content}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.message_queue_sim.queue_status.title')} accent="green">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="label-mono mb-1">{t('simulators.message_queue_sim.queue_status.size')}</div>
            <div className="relative h-8 border border-slate-200 dark:border-tactical-border bg-slate-100 dark:bg-tactical-raised overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-signal-cyan/60"
                animate={{ width: `${(queuedMessages.length / config.maxQueueSize) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-slate-900 dark:text-tactical-text">
                {queuedMessages.length} / {config.maxQueueSize}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
              <motion.div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan" animate={{ scale: stats.produced > 0 ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }}>
                {stats.produced}
              </motion.div>
              <div className="label-mono mt-2">{t('simulators.message_queue_sim.queue_status.produced')}</div>
            </div>
            <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
              <motion.div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green" animate={{ scale: stats.processed > 0 ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }}>
                {stats.processed}
              </motion.div>
              <div className="label-mono mt-2">{t('simulators.message_queue_sim.queue_status.processed')}</div>
            </div>
            <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
              <motion.div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red" animate={{ scale: stats.dropped > 0 ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }}>
                {stats.dropped}
              </motion.div>
              <div className="label-mono mt-2">{t('simulators.message_queue_sim.queue_status.dropped')}</div>
            </div>
            <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
              <div className="font-mono text-3xl font-bold tabular-nums leading-none text-slate-900 dark:text-tactical-text">
                {Math.round(stats.avgProcessingTime)}ms
              </div>
              <div className="label-mono mt-2">{t('simulators.message_queue_sim.queue_status.avg_time')}</div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.message_queue_sim.messages.title')} accent="cyan">
        <div className="space-y-2">
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-900 dark:text-tactical-text">{message.content}</span>
                  <StatusBadge variant={messageStatusVariant(message.status)} label={message.status.toUpperCase()} />
                </div>
                {message.processedAt && (
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                    {message.processedAt - message.producedAt}ms
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {messages.length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                {t('simulators.message_queue_sim.messages.none')}
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
