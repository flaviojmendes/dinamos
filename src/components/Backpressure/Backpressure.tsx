import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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
    'w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-2 py-1 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

  const backpressureBarColor =
    metrics.currentBackpressure > 80 ? 'bg-signal-red' :
    metrics.currentBackpressure > 50 ? 'bg-signal-amber' :
    'bg-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ {t('simulators.backpressure.title')} ]
        </div>
      </div>

      <Panel
        title={t('simulators.backpressure.title')}
        accent="cyan"
        action={
          <TacticalButton size="sm" variant="ghost" onClick={() => setIsConfigOpen(!isConfigOpen)}>
            {t('simulators.backpressure.buttons.settings')}
          </TacticalButton>
        }
      >
        <details className="mb-4 font-mono text-sm text-slate-600 dark:text-tactical-dim">
          <summary className="cursor-pointer label-mono text-signal-cyan hover:text-signal-green transition-colors">
            O que é Backpressure?
          </summary>
          <div className="mt-2 tactical-panel border-l-2 border-l-signal-cyan p-4 space-y-3">
            <p>
              Backpressure é um mecanismo fundamental em sistemas distribuídos que lida com situações onde um componente não consegue processar dados na mesma velocidade em que os recebe. É como uma válvula de pressão que regula o fluxo de dados para evitar sobrecarga.
            </p>
            <p>
              No mundo real, isso acontece quando, por exemplo, um serviço de processamento de pedidos recebe mais requisições do que consegue processar. Sem backpressure, o sistema poderia falhar, perder dados ou consumir memória indefinidamente.
            </p>
            <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-tactical-text mt-4 mb-2">Como funciona o simulador:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Produtor:</strong> Gera mensagens em uma taxa configurável (mensagens/segundo)
              </li>
              <li>
                <strong>Fila:</strong> Armazena mensagens até um limite máximo configurável
              </li>
              <li>
                <strong>Consumidor:</strong> Processa mensagens em sua própria velocidade
              </li>
              <li>
                <strong>Mecanismos de Backpressure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Quando a fila atinge 80% da capacidade, o produtor é throttled (desacelerado)</li>
                  <li>Se a fila encher completamente, novas mensagens são descartadas</li>
                  <li>Quando a fila esvazia, o produtor volta ao ritmo normal</li>
                </ul>
              </li>
            </ul>
            <p className="mt-4">
              Experimente configurar diferentes taxas de produção e consumo para ver como o sistema reage à pressão e se adapta para manter a estabilidade.
            </p>
          </div>
        </details>

        {isConfigOpen && (
          <div className="mb-4 grid grid-cols-2 gap-4 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
            <div>
              <label className="block label-mono text-slate-500 dark:text-tactical-label mb-1">Taxa de Produção (msg/s)</label>
              <input
                type="number"
                value={producers[0].rate}
                onChange={e => setProducers([{ ...producers[0], rate: Math.max(1, Math.min(20, +e.target.value)) }])}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block label-mono text-slate-500 dark:text-tactical-label mb-1">Taxa de Consumo (msg/s)</label>
              <input
                type="number"
                value={consumer.processingRate}
                onChange={e => setConsumer(prev => ({ ...prev, processingRate: Math.max(1, Math.min(20, +e.target.value)) }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block label-mono text-slate-500 dark:text-tactical-label mb-1">Tamanho Máximo da Fila</label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t('simulators.backpressure.title')}</div>
            <div className="h-2 bg-slate-200 dark:bg-tactical-border overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${backpressureBarColor}`}
                style={{ width: `${metrics.currentBackpressure}%` }}
              />
            </div>
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber mt-2">
              {Math.round(metrics.currentBackpressure)}%
            </div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t('simulators.backpressure.producer_status.title')}</div>
            {producers[0].isThrottled ? (
              <StatusBadge variant="in-progress" label={t('simulators.backpressure.producer_status.throttled')} />
            ) : (
              <StatusBadge variant="active" label={t('simulators.backpressure.producer_status.normal')} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{metrics.producedTotal}</div>
            <div className="label-mono mt-2">{t('simulators.backpressure.labels.produced')}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">{metrics.processedTotal}</div>
            <div className="label-mono mt-2">{t('simulators.backpressure.labels.processed')}</div>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red">{metrics.droppedTotal}</div>
            <div className="label-mono mt-2">{t('simulators.backpressure.labels.dropped')}</div>
          </div>
        </div>
      </Panel>

      <Panel title={t('simulators.backpressure.labels.latest')} accent="amber">
        <div className="space-y-2">
          {messages.slice(-5).map(message => (
            <div
              key={message.id}
              className="flex justify-between items-center border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
            >
              <StatusBadge variant={messageStatusVariant(message.status)} label={message.status.toUpperCase()} />
              <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim tabular-nums">{((Date.now() - message.timestamp) / 1000).toFixed(1)}s ago</span>
            </div>
          ))}
          {messages.slice(-5).length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                —
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
