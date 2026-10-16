import { FlowLink, SimulationActivity, useSimulationMotion } from '../simulation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { Pause, Play, RotateCcw, Send, Server, Inbox, Settings2 } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  status: 'produced' | 'queued' | 'processing' | 'completed';
  producedAt: number;
  processedAt?: number;
  consumerId?: number;
  producerId: number;
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
  const { reducedMotion, transition } = useSimulationMotion();
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
  const queueRef = useRef<Message[]>([]);
  const pendingEnqueues = useRef(0);
  const busyConsumers = useRef<Set<number>>(new Set());
  const nextMessage = useRef(1);
  const deliveryTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const scheduleDelivery = useCallback((deliver: () => void, delay: number) => {
    const id = setTimeout(() => { deliveryTimers.current.delete(id); deliver(); }, delay);
    deliveryTimers.current.add(id);
  }, []);
  useEffect(() => () => { deliveryTimers.current.forEach(clearTimeout); }, []);

  const resetSimulation = useCallback(() => {
    deliveryTimers.current.forEach(clearTimeout);
    deliveryTimers.current.clear();
    queueRef.current = [];
    pendingEnqueues.current = 0;
    busyConsumers.current.clear();
    nextMessage.current = 1;
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
    if (queueRef.current.length + pendingEnqueues.current >= config.maxQueueSize) {
      setStats(prev => ({ ...prev, dropped: prev.dropped + 1 }));
      return;
    }

    const id = nextMessage.current++;
    const newMessage: Message = {
      id,
      producerId,
      content: `MSG-P${producerId}-${id}`,
      status: 'produced',
      producedAt: Date.now()
    };

    setMessages(prev => [newMessage, ...prev].slice(0, 50));
    setStats(prev => ({ ...prev, produced: prev.produced + 1 }));
    pendingEnqueues.current += 1;

    scheduleDelivery(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'queued' } : msg
        )
      );
      pendingEnqueues.current -= 1;
      queueRef.current = [...queueRef.current, { ...newMessage, status: 'queued' }];
      setQueuedMessages(queueRef.current);
    }, 300);
  }, [config.maxQueueSize, scheduleDelivery]);

  const consumeMessage = useCallback((consumerId: number) => {
    if (queueRef.current.length === 0) return;

    if (busyConsumers.current.has(consumerId)) return;

    const [messageToProcess, ...remainingMessages] = queueRef.current;
    queueRef.current = remainingMessages;
    busyConsumers.current.add(consumerId);
    setQueuedMessages(remainingMessages);

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageToProcess.id 
          ? { ...msg, status: 'processing', consumerId } 
          : msg
      )
    );

    scheduleDelivery(() => {
      busyConsumers.current.delete(consumerId);
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
  }, [config.processTime, scheduleDelivery]);

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
    <div className="simulation-workspace space-y-6">
      <div className="sim-controls"><SimulationActivity active={isRunning} /></div>

      <div className="flex flex-wrap items-center gap-2">
        <TacticalButton size="sm" variant="ghost" aria-expanded={isConfigOpen} aria-controls="messagequeue-config" onClick={() => setIsConfigOpen(!isConfigOpen)}>
          <Settings2 size={14} aria-hidden="true" />
          {isConfigOpen ? t('simulators.message_queue_sim.buttons.close_config') : t('simulators.message_queue_sim.buttons.configure')}
        </TacticalButton>
        <TacticalButton
          size="sm"
          variant={isRunning ? 'secondary' : 'primary'}
          aria-pressed={isRunning}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}{isRunning ? t('simulators.message_queue_sim.buttons.stop') : t('simulators.message_queue_sim.buttons.start')}
        </TacticalButton>
        <TacticalButton size="sm" variant="secondary" onClick={resetSimulation}>
          <RotateCcw size={14} aria-hidden="true" />{t('simulators.message_queue_sim.buttons.reset')}
        </TacticalButton>
      </div>

      <AnimatePresence initial={false}>{isConfigOpen && (
        <motion.div
          id="messagequeue-config"
          initial={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <Panel title={t('simulators.message_queue_sim.buttons.configure')} accent="cyan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.producers')}</span>
                    <span className="text-signal-cyan">{config.producerCount}</span>
                  </div>
                  <input type="range" min="1" max="5" value={config.producerCount} onChange={(e) => setConfig(c => ({ ...c, producerCount: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.production_rate')}</span>
                    <span className="text-signal-cyan">{config.producerRate}ms</span>
                  </div>
                  <input type="range" min="500" max="5000" step="500" value={config.producerRate} onChange={(e) => setConfig(c => ({ ...c, producerRate: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.max_queue_size')}</span>
                    <span className="text-signal-cyan">{config.maxQueueSize}</span>
                  </div>
                  <input type="range" min="5" max="50" value={config.maxQueueSize} onChange={(e) => setConfig(c => ({ ...c, maxQueueSize: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.consumers')}</span>
                    <span className="text-signal-cyan">{config.consumerCount}</span>
                  </div>
                  <input type="range" min="1" max="5" value={config.consumerCount} onChange={(e) => setConfig(c => ({ ...c, consumerCount: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.consumption_rate')}</span>
                    <span className="text-signal-cyan">{config.consumerRate}ms</span>
                  </div>
                  <input type="range" min="500" max="5000" step="500" value={config.consumerRate} onChange={(e) => setConfig(c => ({ ...c, consumerRate: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
                <div>
                  <div className="flex justify-between font-sans text-sm text-slate-600 dark:text-tactical-dim mb-1">
                    <span>{t('simulators.message_queue_sim.config.process_time')}</span>
                    <span className="text-signal-cyan">{config.processTime}ms</span>
                  </div>
                  <input type="range" min="500" max="5000" step="500" value={config.processTime} onChange={(e) => setConfig(c => ({ ...c, processTime: parseInt(e.target.value) }))} className={rangeClass} />
                </div>
              </div>
            </div>
          </Panel>
        </motion.div>
      )}</AnimatePresence>

      <Panel title={t('simulators.message_queue_sim.flow.title')} accent="amber">
        <div className="sim-stage grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 dark:border-tactical-border lg:grid-cols-[1fr_40px_1.4fr_40px_1fr] lg:items-center">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 font-sans text-sm font-medium"><Send size={17} aria-hidden="true" />{t('simulators.message_queue_sim.config.producers')}</div>
            <div className="space-y-2">
              {Array.from({ length: config.producerCount }, (_, i) => {
                const latest = messages.find(message => message.producerId === i + 1);
                return <div key={i} className="sim-node flex items-center gap-3 rounded-lg px-3 py-3"><Send size={17} className="text-signal-cyan" aria-hidden="true" /><span className="font-mono text-xs">P{i + 1}</span><motion.span key={latest?.id ?? 'idle'} initial={latest ? { opacity: 0.4, x: reducedMotion ? 0 : -4 } : false} animate={{ opacity: 1, x: 0 }} transition={transition} className="ml-auto font-mono text-[10px] text-slate-500 dark:text-tactical-dim">{latest ? `#${latest.id}` : '—'}</motion.span></div>;
              })}
            </div>
          </div>
          <FlowLink active={stats.produced > 0} eventKey={stats.produced} count={1} />
          <div className="sim-node min-w-0 rounded-lg p-4">
            <div className="mb-3 flex items-center gap-2 font-sans text-sm font-medium"><Inbox size={17} aria-hidden="true" />{t('simulators.message_queue_sim.flow.queue')}<span className="ml-auto font-mono text-xs text-signal-amber">{queuedMessages.length}/{config.maxQueueSize}</span></div>
            <div className="flex min-h-28 flex-col gap-1.5">
              <AnimatePresence initial={false} mode="popLayout">
                {queuedMessages.slice(0, 6).map(msg => <motion.div key={msg.id} layout={!reducedMotion} initial={{ opacity: 0, x: reducedMotion ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : 12 }} transition={transition} className="rounded-md border border-signal-amber/30 bg-signal-amber/5 px-3 py-2 font-mono text-xs text-signal-amber">{msg.content}</motion.div>)}
              </AnimatePresence>
              {queuedMessages.length > 6 && <span className="py-1 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t('simulators.message_queue_sim.flow.more', { count: queuedMessages.length - 6 })}</span>}
            </div>
          </div>
          <FlowLink active={messages.some(message => message.status === 'processing')} eventKey={messages.filter(message => message.status === 'processing').map(message => message.id).join('-')} count={1} tone="green" />
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 font-sans text-sm font-medium"><Server size={17} aria-hidden="true" />{t('simulators.message_queue_sim.config.consumers')}</div>
            <div className="space-y-2">
              {Array.from({ length: config.consumerCount }, (_, i) => {
                const processing = messages.find(message => message.status === 'processing' && message.consumerId === i + 1);
                return <div key={i} className={`sim-node overflow-hidden rounded-lg px-3 py-3 ${processing ? 'border-signal-amber' : ''}`}>
                  <div className="flex items-center gap-3"><Server size={17} className={processing ? 'text-signal-amber' : 'text-signal-green'} aria-hidden="true" /><span className="font-mono text-xs">C{i + 1}</span><span className="ml-auto font-mono text-[10px] text-slate-500 dark:text-tactical-dim">{processing ? `#${processing.id}` : '—'}</span></div>
                  {processing && <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-tactical-border"><motion.span key={processing.id} className="absolute inset-0 origin-left rounded-full bg-signal-amber" initial={{ scaleX: reducedMotion ? 0.5 : 0 }} animate={{ scaleX: reducedMotion ? 0.5 : 1 }} transition={{ duration: reducedMotion ? 0 : config.processTime / 1000, ease: 'linear' }} /></div>}
                </div>;
              })}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.message_queue_sim.queue_status.title')} accent="green">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">{t('simulators.message_queue_sim.queue_status.size')}</div>
            <div className="relative h-8 border border-slate-200 dark:border-tactical-border bg-slate-100 dark:bg-tactical-raised overflow-hidden rounded-md">
              <motion.div
                className="absolute inset-0 origin-left bg-signal-cyan/30"
                initial={false}
                animate={{ scaleX: Math.min(1, queuedMessages.length / config.maxQueueSize) }}
                transition={transition}
              />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-slate-900 dark:text-tactical-text">
                {queuedMessages.length} / {config.maxQueueSize}
              </div>
            </div>
          </div>
          <div className="sim-metrics grid grid-cols-2 gap-3 sm:grid-cols-4">
            <AnimatedMetric value={stats.produced} label={t('simulators.message_queue_sim.queue_status.produced')} color="cyan" />
            <AnimatedMetric value={stats.processed} label={t('simulators.message_queue_sim.queue_status.processed')} color="green" />
            <AnimatedMetric value={stats.dropped} label={t('simulators.message_queue_sim.queue_status.dropped')} color={stats.dropped > 0 ? 'red' : 'default'} />
            <AnimatedMetric value={Math.round(stats.avgProcessingTime)} suffix="ms" label={t('simulators.message_queue_sim.queue_status.avg_time')} color="default" />
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.message_queue_sim.messages.title')} accent="cyan">
        <div className="space-y-2">
          <AnimatePresence>
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={transition}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-900 dark:text-tactical-text">{message.content}</span>
                  <StatusBadge variant={messageStatusVariant(message.status)} label={t(`simulators.message_queue_sim.status.${message.status}`)} />
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
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg">
              <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                {t('simulators.message_queue_sim.messages.none')}
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
