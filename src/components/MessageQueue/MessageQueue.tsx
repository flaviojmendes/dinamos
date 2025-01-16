import { useState, useEffect, useCallback } from 'react';

interface Message {
  id: number;
  content: string;
  status: 'produced' | 'queued' | 'processing' | 'completed';
  producedAt: number;
  processedAt?: number;
}

export default function MessageQueue() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [messageRate, setMessageRate] = useState(2000);
  const [processTime, setProcessTime] = useState(3000);
  const [maxQueueSize, setMaxQueueSize] = useState(5);
  const [processedCount, setProcessedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Producer: Creates new messages
  const produceMessage = useCallback(() => {
    const queuedCount = messages.filter(m => m.status === 'queued').length;
    if (queuedCount >= maxQueueSize) return;

    const newMessage: Message = {
      id: Date.now(),
      content: `MSG-${processedCount + messages.length + 1}`,
      status: 'produced',
      producedAt: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Queue the message after a brief delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'queued' } : msg
        )
      );
    }, 500);
  }, [messages, maxQueueSize, processedCount]);

  // Consumer: Processes messages
  const processNextMessage = useCallback(async () => {
    if (isProcessing) return;

    const queuedMessages = messages.filter(m => m.status === 'queued');
    if (!queuedMessages.length || !isRunning) return;

    const targetMessage = queuedMessages[0];
    setIsProcessing(true);

    // Mark as processing
    setMessages(prev =>
      prev.map(msg =>
        msg.id === targetMessage.id ? { ...msg, status: 'processing' } : msg
      )
    );

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, processTime));

    // Mark as completed and update counters
    setMessages(prev => 
      prev.map(msg =>
        msg.id === targetMessage.id 
          ? { ...msg, status: 'completed', processedAt: Date.now() } 
          : msg
      )
    );
    setProcessedCount(prev => prev + 1);

    // Remove completed message after showing completion
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== targetMessage.id));
      setIsProcessing(false);
    }, 1000);
  }, [messages, isRunning, processTime, isProcessing]);

  // Handle continuous message production
  useEffect(() => {
    let producerInterval: number;
    
    if (isRunning) {
      producerInterval = window.setInterval(produceMessage, messageRate);
    }

    return () => {
      if (producerInterval) {
        clearInterval(producerInterval);
      }
    };
  }, [isRunning, messageRate, produceMessage]);

  // Handle message processing
  useEffect(() => {
    let processorInterval: number;
    
    if (isRunning) {
      processorInterval = window.setInterval(() => {
        processNextMessage();
      }, 100); // Check for new messages frequently
    }

    return () => {
      if (processorInterval) {
        clearInterval(processorInterval);
      }
    };
  }, [isRunning, processNextMessage]);

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setMessages([]);
    setProcessedCount(0);
    setIsProcessing(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4 md:mb-6">Simulação de Fila de Mensagens</h2>

        {/* Message Flow Visualization */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
          {/* Producer */}
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-400">Produtor</h3>
              <div className="md:hidden">
                <span className="text-sm text-gray-400">
                  Produzidas: {messages.filter(m => m.status === 'produced').length}
                </span>
              </div>
            </div>
            <div className="bg-gray-800 p-3 md:p-4 rounded-lg h-32 md:h-48 overflow-y-auto">
              {messages
                .filter(m => m.status === 'produced')
                .map(msg => (
                  <div
                    key={msg.id}
                    className="bg-blue-500 text-white p-2 rounded mb-2 text-sm animate-slide-right"
                  >
                    {msg.content}
                  </div>
                ))}
            </div>
          </div>

          {/* Queue */}
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-yellow-400">Fila</h3>
              <span className="text-sm text-gray-400">
                {messages.filter(m => m.status === 'queued').length} / {maxQueueSize}
              </span>
            </div>
            <div className="bg-gray-800 p-3 md:p-4 rounded-lg h-32 md:h-48 overflow-y-auto">
              {messages
                .filter(m => m.status === 'queued')
                .map(msg => (
                  <div
                    key={msg.id}
                    className="bg-yellow-500 text-white p-2 rounded mb-2 text-sm"
                  >
                    {msg.content}
                  </div>
                ))}
            </div>
          </div>

          {/* Consumer */}
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-green-400">Consumidor</h3>
              <span className="text-sm text-gray-400">
                Processadas: {processedCount}
              </span>
            </div>
            <div className="bg-gray-800 p-3 md:p-4 rounded-lg h-32 md:h-48 overflow-y-auto">
              {messages
                .filter(m => ['processing', 'completed'].includes(m.status))
                .map(msg => (
                  <div
                    key={msg.id}
                    className={`text-white p-2 rounded mb-2 text-sm
                      ${msg.status === 'processing' ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-fade-out'}
                    `}
                  >
                    {msg.content}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full sm:w-auto px-4 py-2 rounded font-medium transition-colors
                ${isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
                } text-white`}
            >
              {isRunning ? 'Parar' : 'Iniciar'}
            </button>
            <button
              onClick={resetSimulation}
              className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded font-medium hover:bg-gray-600"
            >
              Reiniciar
            </button>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-white mb-1">
                <span className="mb-1 sm:mb-0">Taxa de Produção</span>
                <span className="text-blue-400">{messageRate}ms</span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={messageRate}
                onChange={(e) => setMessageRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-white mb-1">
                <span className="mb-1 sm:mb-0">Tempo de Processamento</span>
                <span className="text-blue-400">{processTime}ms</span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="500"
                value={processTime}
                onChange={(e) => setProcessTime(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-white mb-1">
                <span className="mb-1 sm:mb-0">Tamanho Máximo da Fila</span>
                <span className="text-blue-400">{maxQueueSize}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={maxQueueSize}
                onChange={(e) => setMaxQueueSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-right {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .animate-slide-right {
          animation: slide-right 0.3s ease-out;
        }

        .animate-fade-out {
          animation: fade-out 1s ease-out;
        }

        /* Custom scrollbar styles */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
} 