import { useState, useEffect, useCallback } from 'react';

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

export default function Backpressure() {
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
          const droppedMessages = newMessages.slice(-overflow).map(m => ({ ...m, status: 'dropped' }));
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

  return (
    <div className="p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Backpressure</h1>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="px-3 py-1 bg-zinc-800 rounded-md hover:bg-zinc-700"
          >
            Configurações
          </button>
        </div>

        <details className="mb-4 text-zinc-300">
          <summary className="cursor-pointer hover:text-white transition-colors">
            O que é Backpressure?
          </summary>
          <div className="mt-2 p-4 bg-zinc-800 rounded-lg space-y-3">
            <p>
              Backpressure é um mecanismo fundamental em sistemas distribuídos que lida com situações onde um componente não consegue processar dados na mesma velocidade em que os recebe. É como uma válvula de pressão que regula o fluxo de dados para evitar sobrecarga.
            </p>
            <p>
              No mundo real, isso acontece quando, por exemplo, um serviço de processamento de pedidos recebe mais requisições do que consegue processar. Sem backpressure, o sistema poderia falhar, perder dados ou consumir memória indefinidamente.
            </p>
            <h3 className="text-white font-medium mt-4 mb-2">Como funciona o simulador:</h3>
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
          <div className="mb-4 p-4 bg-zinc-800 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Taxa de Produção (msg/s)</label>
                <input
                  type="number"
                  value={producers[0].rate}
                  onChange={e => setProducers([{ ...producers[0], rate: Math.max(1, Math.min(20, +e.target.value)) }])}
                  className="w-full bg-zinc-700 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Taxa de Consumo (msg/s)</label>
                <input
                  type="number"
                  value={consumer.processingRate}
                  onChange={e => setConsumer(prev => ({ ...prev, processingRate: Math.max(1, Math.min(20, +e.target.value)) }))}
                  className="w-full bg-zinc-700 rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Tamanho Máximo da Fila</label>
                <input
                  type="number"
                  value={consumer.maxQueueSize}
                  onChange={e => setConsumer(prev => ({ ...prev, maxQueueSize: Math.max(1, +e.target.value) }))}
                  className="w-full bg-zinc-700 rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-md ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Parar' : 'Iniciar'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600"
          >
            Resetar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-sm text-zinc-400 mb-2">Backpressure</div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  metrics.currentBackpressure > 80 ? 'bg-red-500' :
                  metrics.currentBackpressure > 50 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${metrics.currentBackpressure}%` }}
              />
            </div>
            <div className="mt-1 text-sm font-medium">
              {Math.round(metrics.currentBackpressure)}%
            </div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Status do Produtor</div>
            <div className="font-medium">
              {producers[0].isThrottled ? (
                <span className="text-yellow-400">Throttled</span>
              ) : (
                <span className="text-green-400">Normal</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Mensagens Produzidas</div>
            <div className="font-medium">{metrics.producedTotal}</div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Mensagens Processadas</div>
            <div className="font-medium">{metrics.processedTotal}</div>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-sm text-zinc-400">Mensagens Descartadas</div>
            <div className="font-medium">{metrics.droppedTotal}</div>
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-3">Últimas Mensagens</h2>
          <div className="space-y-2">
            {messages.slice(-5).map(message => (
              <div
                key={message.id}
                className={`p-2 rounded flex justify-between ${
                  message.status === 'completed' ? 'bg-green-500/20' :
                  message.status === 'dropped' ? 'bg-red-500/20' :
                  message.status === 'queued' ? 'bg-yellow-500/20' :
                  'bg-blue-500/20'
                }`}
              >
                <span>
                  {message.status === 'completed' ? '✓' :
                   message.status === 'dropped' ? '✗' :
                   message.status === 'queued' ? '⋯' : '↻'} {message.status.toUpperCase()}
                </span>
                <span>{((Date.now() - message.timestamp) / 1000).toFixed(1)}s ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 