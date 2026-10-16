import { SimulationActivity, FlowLink, useSimulationMotion } from '../simulation';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedNumber } from '../AISystems/motion';

interface Message {
  id: number;
  timestamp: number;
  status: 'queued' | 'processing' | 'completed' | 'dropped';
  producerId: number;
}

interface Producer {
  id: number;
  rate: number; // messages per second
  isThrottled: boolean;
}

interface Consumer {
  processingRate: number; // messages per second
  queueSize: number;
  maxQueueSize: number;
}

interface Metrics {
  producedTotal: number;
  processedTotal: number;
  droppedTotal: number;
  currentBackpressure: number; // 0-100%
}

const messageStatusVariant = (status: Message['status']) => {
  switch (status) {
    case 'completed': return 'active' as const;
    case 'dropped': return 'classified' as const;
    case 'queued': return 'pending' as const;
    case 'processing': return 'in-progress' as const;
  }
};

export default function Backpressure() {
  const { t } = useTranslation();
  const { reducedMotion, transition } = useSimulationMotion();
  const [isRunning, setIsRunning] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Producer state
  const [producers, setProducers] = useState<Producer[]>([
    { id: 1, rate: 5, isThrottled: false }
  ]);
  
  // Consumer state
  const [consumer, setConsumer] = useState<Consumer>({
    processingRate: 2,
    queueSize: 0,
    maxQueueSize: 10
  });
  
  // Message state
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Metrics
  const [metrics, setMetrics] = useState<Metrics>({
    producedTotal: 0,
    processedTotal: 0,
    droppedTotal: 0,
    currentBackpressure: 0
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setMessages([]);
    setMetrics({
      producedTotal: 0,
      processedTotal: 0,
      droppedTotal: 0,
      currentBackpressure: 0
    });
    setProducers(producers => producers.map(p => ({ ...p, isThrottled: false })));
    setConsumer(prev => ({ ...prev, queueSize: 0 }));
  }, []);

  // Handle message production
  const produceMessages = useCallback(() => {
    producers.forEach(producer => {
      if (producer.isThrottled) return;

      const newMessages: Message[] = Array.from({ length: producer.rate }, (_, i) => ({
        id: Date.now() + i,
        timestamp: Date.now(),
        status: 'queued',
        producerId: producer.id
      }));

      setMessages(prev => {
        const updatedMessages = [...prev, ...newMessages];
        const queuedCount = updatedMessages.filter(m => m.status === 'queued').length;
        
        // Apply backpressure if queue is getting full
        const backpressure = (queuedCount / consumer.maxQueueSize) * 100;
        setMetrics(prev => ({ ...prev, currentBackpressure: backpressure }));
        
        // Throttle producer if backpressure is too high
        if (backpressure > 80) {
          setProducers(prev => 
            prev.map(p => p.id === producer.id ? { ...p, isThrottled: true } : p)
          );
        }
        
        // Drop messages if queue is full
        if (queuedCount > consumer.maxQueueSize) {
          const overflow = queuedCount - consumer.maxQueueSize;
          const droppedMessages = newMessages.slice(-overflow).map(m => ({ ...m, status: 'dropped' as const }));
          setMetrics(prev => ({ ...prev, droppedTotal: prev.droppedTotal + overflow }));
          return [...updatedMessages.slice(0, -overflow), ...droppedMessages];
        }
        
        setMetrics(prev => ({ ...prev, producedTotal: prev.producedTotal + newMessages.length }));
        return updatedMessages;
      });
    });
  }, [producers, consumer.maxQueueSize]);

  // Handle message consumption
  const consumeMessages = useCallback(() => {
    setMessages(prev => {
      const queuedMessages = prev.filter(m => m.status === 'queued');
      const toProcess = Math.min(consumer.processingRate, queuedMessages.length);
      
      if (toProcess === 0) {
        // If queue is empty, release throttling
        setProducers(prev => prev.map(p => ({ ...p, isThrottled: false })));
        return prev;
      }

      const updatedMessages = [...prev];
      for (let i = 0; i < toProcess; i++) {
        const index = updatedMessages.findIndex(m => m.status === 'queued');
        if (index !== -1) {
          updatedMessages[index] = { ...updatedMessages[index], status: 'completed' };
        }
      }

      setMetrics(prev => ({ ...prev, processedTotal: prev.processedTotal + toProcess }));
      return updatedMessages.slice(-50); // Keep only last 50 messages
    });
  }, [consumer.processingRate]);

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const produceInterval = setInterval(produceMessages, 1000);
    const consumeInterval = setInterval(consumeMessages, 1000);

    return () => {
      clearInterval(produceInterval);
      clearInterval(consumeInterval);
    };
  }, [isRunning, produceMessages, consumeMessages]);

  const inputClass =
    'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-2 py-1 font-sans text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-brand-500 rounded-md';

  const backpressureBarColor =
    metrics.currentBackpressure > 80 ? 'bg-signal-red' :
    metrics.currentBackpressure > 50 ? 'bg-signal-amber' :
    'bg-signal-green';

  return (
    <div className="simulation-workspace space-y-6">
      <div className="sim-controls"><SimulationActivity active={isRunning} /></div>

      <Panel
        title={t('simulators.backpressure.title')}
        accent="cyan"
        action={
          <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
            {t('simulators.backpressure.buttons.settings')}
          </TacticalButton>
        }
      >
        <details className="mb-4 font-sans text-sm text-slate-600 dark:text-tactical-dim">
          <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-tactical-text hover:text-brand-600 dark:hover:text-signal-green transition-colors">
            {t('simulators.backpressure.explanation.title')}
          </summary>
          <div className="mt-2 bg-slate-50 dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-lg p-4 space-y-3">
            <p>
              {t('simulators.backpressure.explanation.definition')}
            </p>
            <p>
              {t('simulators.backpressure.explanation.example')}
            </p>
            <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mt-4 mb-2">{t('simulators.backpressure.explanation.how')}</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>{t('simulators.backpressure.explanation.producer')}</strong> {t('simulators.backpressure.explanation.producer_description')}
              </li>
              <li>
                <strong>{t('simulators.backpressure.explanation.queue')}</strong> {t('simulators.backpressure.explanation.queue_description')}
              </li>
              <li>
                <strong>{t('simulators.backpressure.explanation.consumer')}</strong> {t('simulators.backpressure.explanation.consumer_description')}
              </li>
              <li>
                <strong>{t('simulators.backpressure.explanation.mechanisms')}</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>{t('simulators.backpressure.explanation.throttle')}</li>
                  <li>{t('simulators.backpressure.explanation.overflow')}</li>
                  <li>{t('simulators.backpressure.explanation.resume')}</li>
                </ul>
              </li>
            </ul>
            <p className="mt-4">
              {t('simulators.backpressure.explanation.experiment')}
            </p>
          </div>
        </details>

        {isConfigOpen && (
          <div className="mb-4 grid grid-cols-2 gap-4 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">{t('simulators.backpressure.config.production_rate')}</label>
              <input
                type="number"
                value={producers[0].rate}
                onChange={e => setProducers([{ ...producers[0], rate: Math.max(1, Math.min(20, +e.target.value)) }])}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">{t('simulators.backpressure.config.consumption_rate')}</label>
              <input
                type="number"
                value={consumer.processingRate}
                onChange={e => setConsumer(prev => ({ ...prev, processingRate: Math.max(1, Math.min(20, +e.target.value)) }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1">{t('simulators.backpressure.config.queue_capacity')}</label>
              <input
                type="number"
                value={consumer.maxQueueSize}
                onChange={e => setConsumer(prev => ({ ...prev, maxQueueSize: Math.max(1, +e.target.value) }))}
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <TacticalButton
            size="sm"
            variant={isRunning ? 'danger' : 'secondary'}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? t('simulators.backpressure.buttons.stop') : t('simulators.backpressure.buttons.start')}
          </TacticalButton>
          <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
            {t('simulators.backpressure.buttons.reset')}
          </TacticalButton>
        </div>

        <div className="sim-stage mb-6 space-y-4">
          <div className="flex items-center justify-between gap-4 font-sans text-sm text-slate-600 dark:text-tactical-dim">
            <span>{t('simulators.backpressure.labels.produced')} · {producers[0].rate}/s</span>
            <span className="font-mono tabular-nums">{messages.filter(message => message.status === 'queued').length}/{consumer.maxQueueSize}</span>
            <span>{t('simulators.backpressure.labels.processed')} · {consumer.processingRate}/s</span>
          </div>
          <FlowLink active={isRunning && !producers[0].isThrottled} tone={producers[0].isThrottled ? 'amber' : 'cyan'} className="w-full" />
          <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3 dark:border-tactical-line" aria-label={t('simulators.backpressure.labels.latest')}>
            <AnimatePresence initial={false} mode="popLayout">
              {messages.filter(message => message.status === 'queued').map(message => (
                <motion.span key={message.id} layout="position" className="h-5 w-5 rounded bg-signal-amber" initial={{ opacity: 0, x: reducedMotion ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : 20 }} transition={transition} title={`#${message.id}`} />
              ))}
            </AnimatePresence>
          </div>
          <FlowLink active={isRunning && messages.some(message => message.status === 'queued')} tone="green" className="w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg">
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">{t('simulators.backpressure.title')}</div>
            <div className="h-2 bg-slate-200 dark:bg-tactical-border overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-300 ${backpressureBarColor}`}
                style={{ width: `${Math.min(100, metrics.currentBackpressure)}%` }}
              />
            </div>
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber mt-2">
              {Math.round(metrics.currentBackpressure)}%
            </div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg">
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">{t('simulators.backpressure.producer_status.title')}</div>
            {producers[0].isThrottled ? (
              <StatusBadge variant="in-progress" label={t('simulators.backpressure.producer_status.throttled')} />
            ) : (
              <StatusBadge variant="active" label={t('simulators.backpressure.producer_status.normal')} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan"><AnimatedNumber value={metrics.producedTotal} /></div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.backpressure.labels.produced')}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green"><AnimatedNumber value={metrics.processedTotal} /></div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.backpressure.labels.processed')}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3 rounded-lg">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red"><AnimatedNumber value={metrics.droppedTotal} /></div>
            <div className="text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.backpressure.labels.dropped')}</div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.backpressure.labels.latest')} accent="amber">
        <div className="space-y-2">
          {messages.slice(-5).map(message => (
            <motion.div
              key={message.id}
              layout="position"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              className="flex justify-between items-center border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2 rounded-md"
            >
              <StatusBadge variant={messageStatusVariant(message.status)} label={t(`simulators.backpressure.status.${message.status}`)} />
              <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim tabular-nums">{t('simulators.backpressure.seconds_ago', { seconds: ((Date.now() - message.timestamp) / 1000).toFixed(1) })}</span>
            </motion.div>
          ))}
          {messages.slice(-5).length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center rounded-lg">
              <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                {t('simulators.backpressure.empty')}
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
