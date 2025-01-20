import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function MessageQueue() {
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
    consumerRate: 2000,
    maxQueueSize: 10,
    processTime: 2000,
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

  // Producer logic - Creates new messages
  const produceMessage = useCallback((producerId: number) => {
    // Check if queue is full
    if (queuedMessages.length >= config.maxQueueSize) {
      setStats(prev => ({ ...prev, dropped: prev.dropped + 1 }));
      return;
    }

    // Create new message
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      content: `MSG-P${producerId}-${stats.produced + 1}`,
      status: 'produced',
      producedAt: Date.now()
    };

    // Add to message history
    setMessages(prev => [newMessage, ...prev].slice(0, 50));
    setStats(prev => ({ ...prev, produced: prev.produced + 1 }));

    // Add to queue after a brief visual delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'queued' } : msg
        )
      );
      setQueuedMessages(prev => [...prev, { ...newMessage, status: 'queued' }]);
    }, 300);
  }, [config.maxQueueSize, stats.produced, queuedMessages.length]);

  // Consumer logic - Processes messages from the queue
  const consumeMessage = useCallback((consumerId: number) => {
    // Check if there are messages to process
    if (queuedMessages.length === 0) return;

    // Check if this consumer is already processing a message
    const isProcessing = messages.some(m => 
      m.status === 'processing' && m.consumerId === consumerId
    );
    if (isProcessing) return;

    // Get the next message from the queue
    const [messageToProcess, ...remainingMessages] = queuedMessages;
    setQueuedMessages(remainingMessages);

    // Start processing the message
    const startProcessing = Date.now();
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageToProcess.id 
          ? { ...msg, status: 'processing', consumerId } 
          : msg
      )
    );

    // Complete processing after the configured time
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

  // Producer intervals
  useEffect(() => {
    if (!isRunning) return;

    const producerIntervals = Array.from({ length: config.producerCount }, (_, i) => {
      return setInterval(() => produceMessage(i + 1), config.producerRate);
    });

    return () => {
      producerIntervals.forEach(clearInterval);
    };
  }, [isRunning, config.producerCount, config.producerRate, produceMessage]);

  // Consumer intervals
  useEffect(() => {
    if (!isRunning) return;

    const consumerIntervals = Array.from({ length: config.consumerCount }, (_, i) => {
      return setInterval(() => consumeMessage(i + 1), config.consumerRate);
    });

    return () => {
      consumerIntervals.forEach(clearInterval);
    };
  }, [isRunning, config.consumerCount, config.consumerRate, consumeMessage]);

  return (
    <div className="flex-1 min-h-full overflow-auto">
      <div className="p-4 h-full">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-semibold">Message Queue</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="w-full sm:w-auto px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 font-medium transition-colors"
              >
                {isConfigOpen ? 'Fechar Config' : 'Configurar'}
              </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
                className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${
                  isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button
              onClick={resetSimulation}
                className="w-full sm:w-auto px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 font-medium transition-colors"
            >
                Resetar
            </button>
            </div>
          </div>

          {/* Configuration */}
          {isConfigOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-zinc-800/50 rounded-lg p-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
                    <div className="flex justify-between text-white mb-1">
                      <span>Produtores</span>
                      <span className="text-blue-400">{config.producerCount}</span>
              </div>
              <input
                type="range"
                      min="1"
                      max="5"
                      value={config.producerCount}
                      onChange={(e) => setConfig(c => ({ ...c, producerCount: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
                    <div className="flex justify-between text-white mb-1">
                      <span>Taxa de Produção</span>
                      <span className="text-blue-400">{config.producerRate}ms</span>
              </div>
              <input
                type="range"
                      min="500"
                      max="5000"
                step="500"
                      value={config.producerRate}
                      onChange={(e) => setConfig(c => ({ ...c, producerRate: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
                    <div className="flex justify-between text-white mb-1">
                      <span>Tamanho Máximo da Fila</span>
                      <span className="text-blue-400">{config.maxQueueSize}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={config.maxQueueSize}
                      onChange={(e) => setConfig(c => ({ ...c, maxQueueSize: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-white mb-1">
                      <span>Consumidores</span>
                      <span className="text-blue-400">{config.consumerCount}</span>
              </div>
              <input
                type="range"
                min="1"
                      max="5"
                      value={config.consumerCount}
                      onChange={(e) => setConfig(c => ({ ...c, consumerCount: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-white mb-1">
                      <span>Taxa de Consumo</span>
                      <span className="text-blue-400">{config.consumerRate}ms</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="500"
                      value={config.consumerRate}
                      onChange={(e) => setConfig(c => ({ ...c, consumerRate: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-white mb-1">
                      <span>Tempo de Processamento</span>
                      <span className="text-blue-400">{config.processTime}ms</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="500"
                      value={config.processTime}
                      onChange={(e) => setConfig(c => ({ ...c, processTime: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Visual Flow Diagram */}
          <div className="mb-6 bg-zinc-800/50 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Fluxo de Mensagens</h2>
            <div className="relative h-48 flex items-center justify-between max-w-4xl mx-auto">
              {/* Connection Lines */}
              <div className="absolute h-1 bg-zinc-700 left-[25%] right-[25%] top-1/2 -translate-y-1/2" />
              
              {/* Producers Section */}
              <div className="relative z-10 w-1/4">
                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">Produtores</h3>
                  <div className="space-y-2">
                    {Array.from({ length: config.producerCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-xs text-blue-400`}
                      >
                        P{i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Queue Section */}
              <div className="relative z-10 w-1/3">
                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                  <h3 className="text-sm font-medium text-yellow-400 mb-2">Fila</h3>
                  <div className="space-y-2">
                    <div className="relative h-24 bg-zinc-700/50 rounded-lg border border-zinc-600 overflow-hidden">
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
                            <div className="h-4 bg-yellow-500/20 border border-yellow-500/50 rounded flex items-center justify-center text-xs text-yellow-400">
                              {msg.content}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {queuedMessages.length > 5 && (
                        <div className="absolute bottom-0 inset-x-0 text-center text-xs text-zinc-400 py-1">
                          +{queuedMessages.length - 5} mais
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consumers Section */}
              <div className="relative z-10 w-1/4">
                <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                  <h3 className="text-sm font-medium text-green-400 mb-2">Consumidores</h3>
                  <div className="space-y-2">
                    {Array.from({ length: config.consumerCount }).map((_, i) => {
                      const processingMessage = messages.find(m => m.status === 'processing' && m.consumerId === i + 1);
                      return (
                        <div key={i} className="space-y-1">
                          <div className={`h-6 ${
                            processingMessage ? 'bg-purple-500/20 border-purple-500/50' : 'bg-green-500/20 border-green-500/50'
                          } border rounded flex items-center justify-center text-xs ${
                            processingMessage ? 'text-purple-400' : 'text-green-400'
                          }`}>
                            C{i + 1}
                          </div>
                          {processingMessage && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs bg-purple-500/10 border border-purple-500/30 rounded p-1 text-purple-400 text-center"
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
          </div>

          {/* Queue Status */}
          <div className="mb-6">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Status da Fila</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="text-sm text-zinc-400 mb-1">Tamanho da Fila</div>
                  <div className="relative h-8 bg-zinc-700 rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-blue-500"
                      animate={{ width: `${(queuedMessages.length / config.maxQueueSize) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {queuedMessages.length} / {config.maxQueueSize}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-zinc-400">Produzidas</div>
                    <motion.div 
                      className="text-xl font-medium"
                      animate={{ scale: stats.produced > 0 ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stats.produced}
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Processadas</div>
                    <motion.div 
                      className="text-xl font-medium text-green-400"
                      animate={{ scale: stats.processed > 0 ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stats.processed}
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Descartadas</div>
                    <motion.div 
                      className="text-xl font-medium text-red-400"
                      animate={{ scale: stats.dropped > 0 ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stats.dropped}
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-400">Tempo Médio</div>
                    <div className="text-xl font-medium">
                      {Math.round(stats.avgProcessingTime)}ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Log */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">Mensagens</h2>
            <div className="space-y-2">
              <AnimatePresence>
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded gap-2 ${
                      message.status === 'produced' ? 'bg-blue-500/20' :
                      message.status === 'queued' ? 'bg-yellow-500/20' :
                      message.status === 'processing' ? 'bg-purple-500/20' :
                      'bg-green-500/20'
                    }`}
                  >
                    <div>
                      <div className="text-white">{message.content}</div>
                      <div className={`text-sm ${
                        message.status === 'produced' ? 'text-blue-400' :
                        message.status === 'queued' ? 'text-yellow-400' :
                        message.status === 'processing' ? 'text-purple-400' :
                        'text-green-400'
                      }`}>
                        {message.status.toUpperCase()}
                      </div>
                    </div>
                    {message.processedAt && (
                      <div className="text-zinc-400 text-sm">
                        {message.processedAt - message.producedAt}ms
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {messages.length === 0 && (
                <div className="text-zinc-500 text-center py-4">
                  Nenhuma mensagem ainda
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 