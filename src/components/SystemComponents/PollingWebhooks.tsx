import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface DataItem {
  id: string;
  content: string;
  timestamp: number;
}

interface Message {
  id: number;
  timestamp: number;
  type: 'polling-request' | 'polling-response-empty' | 'polling-response-data' | 'webhook-notification' | 'data-generated';
  direction: 'client-to-server' | 'server-to-client' | 'server-internal';
  content: string;
  hasData: boolean;
  data?: string;
  dataId?: string;
}

interface SimulationStats {
  totalRequests: number;
  emptyResponses: number;
  dataTransfers: number;
  webhookNotifications: number;
  totalBandwidth: number;
  averageLatency: number;
}

export default function PollingWebhooks() {
  const [mode, setMode] = useState<'polling' | 'webhook'>('polling');
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingData, setPendingData] = useState<DataItem[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
    totalRequests: 0,
    emptyResponses: 0,
    dataTransfers: 0,
    webhookNotifications: 0,
    totalBandwidth: 0,
    averageLatency: 50
  });

  const [config, setConfig] = useState({
    pollingInterval: 3000, // 3 seconds
    dataGenerationInterval: 8000, // 8 seconds
    networkLatency: 200 // 200ms
  });

  const pollingTimer = useRef<number>();
  const dataTimer = useRef<number>();
  const messageCounter = useRef(1);

  const sampleData = [
    'New order #1234 received',
    'User John logged in',
    'Payment of $50.00 processed',
    'File upload completed',
    'Temperature: 23°C recorded',
    'Backup process finished',
    'New message from Alice',
    'Stock level updated: 15 items'
  ];

  // Generate new data
  const generateData = useCallback(() => {
    const content = sampleData[Math.floor(Math.random() * sampleData.length)];
    const dataItem: DataItem = {
      id: `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: Date.now()
    };
    
    // Add to pending data queue
    setPendingData(prev => [...prev, dataItem]);
    
    addMessage({
      type: 'data-generated',
      direction: 'server-internal',
      content: `New data available: ${content}`,
      hasData: true,
      data: content,
      dataId: dataItem.id
    });

    // If in webhook mode, immediately send notification
    if (mode === 'webhook' && isRunning) {
      setTimeout(() => {
        // In webhook mode, we send the data immediately and remove it from pending
        setPendingData(prev => prev.filter(item => item.id !== dataItem.id));
        
        addMessage({
          type: 'webhook-notification',
          direction: 'server-to-client',
          content: `Webhook: ${content}`,
          hasData: true,
          data: content,
          dataId: dataItem.id
        });
        
        // Update stats
        setStats(prev => ({
          ...prev,
          webhookNotifications: prev.webhookNotifications + 1,
          dataTransfers: prev.dataTransfers + 1,
          totalBandwidth: prev.totalBandwidth + estimateBandwidth(content)
        }));
      }, config.networkLatency);
    }
  }, [mode, isRunning, config.networkLatency]);

  // Polling request
  const performPollingRequest = () => {
    addMessage({
      type: 'polling-request',
      direction: 'client-to-server',
      content: 'Checking for new data...',
      hasData: false
    });

    setStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      totalBandwidth: prev.totalBandwidth + estimateBandwidth('polling request')
    }));

          // Server response after network latency
      setTimeout(() => {
        // Use functional update to ensure we get the latest pendingData state
        setPendingData(currentPendingData => {
          if (currentPendingData.length > 0) {
            // Has data - return it
            const dataItem = currentPendingData[0];
            addMessage({
              type: 'polling-response-data',
              direction: 'server-to-client',
              content: `Data found: ${dataItem.content}`,
              hasData: true,
              data: dataItem.content,
              dataId: dataItem.id
            });
            
            setStats(prev => ({
              ...prev,
              dataTransfers: prev.dataTransfers + 1,
              totalBandwidth: prev.totalBandwidth + estimateBandwidth(dataItem.content)
            }));
            
            // Return new array without the first item
            return currentPendingData.slice(1);
          } else {
            // No data
            addMessage({
              type: 'polling-response-empty',
              direction: 'server-to-client',
              content: 'No new data available',
              hasData: false
            });
            
            setStats(prev => ({
              ...prev,
              emptyResponses: prev.emptyResponses + 1,
              totalBandwidth: prev.totalBandwidth + estimateBandwidth('no data response')
            }));
            
            // Return unchanged array
            return currentPendingData;
          }
        });
      }, config.networkLatency);
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const message: Message = {
      id: messageCounter.current++,
      timestamp: Date.now(),
      ...messageData
    };

    setMessages(prev => [...prev.slice(-19), message]);
  };

  const estimateBandwidth = (content: string) => {
    // Rough estimation: headers + content
    return (content.length + 200) * 8; // bits
  };

  const startSimulation = () => {
    setIsRunning(true);
    
    // Start data generation with a small delay to ensure state is updated
    setTimeout(() => {
      dataTimer.current = window.setInterval(generateData, config.dataGenerationInterval);
      
      // Start polling if in polling mode
      if (mode === 'polling') {
        pollingTimer.current = window.setInterval(performPollingRequest, config.pollingInterval);
      }
    }, 10); // Small delay to ensure state update
  };

  const stopSimulation = () => {
    setIsRunning(false);
    
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current);
    }
    if (dataTimer.current) {
      clearInterval(dataTimer.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setMessages([]);
    setPendingData([]);
    setStats({
      totalRequests: 0,
      emptyResponses: 0,
      dataTransfers: 0,
      webhookNotifications: 0,
      totalBandwidth: 0,
      averageLatency: config.networkLatency
    });
    messageCounter.current = 1;
  };

  // Handle mode changes
  useEffect(() => {
    if (isRunning) {
      stopSimulation();
      if (pollingTimer.current) clearInterval(pollingTimer.current);
      
      if (mode === 'polling') {
        pollingTimer.current = window.setInterval(performPollingRequest, config.pollingInterval);
      }
    }
  }, [mode, config.pollingInterval]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, []);

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'polling-request': return 'text-blue-400 bg-blue-500/10 border border-blue-500/20';
      case 'polling-response-empty': return 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20';
      case 'polling-response-data': return 'text-green-400 bg-green-500/10 border border-green-500/20';
      case 'webhook-notification': return 'text-purple-400 bg-purple-500/20 border border-purple-500/40 shadow-lg shadow-purple-500/20';
      case 'data-generated': return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
      default: return 'text-white bg-zinc-500/10 border border-zinc-500/20';
    }
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'polling-request': return '📤';
      case 'polling-response-empty': return '📭';
      case 'polling-response-data': return '📬';
      case 'webhook-notification': return '🔔';
      case 'data-generated': return '📊';
      default: return '💬';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Simulador: Polling vs Webhooks
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            Veja na prática a diferença entre polling e webhooks com nossa simulação interativa
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Link
              to="/componentes/polling-webhooks"
              className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-blue-400 px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Ler Teoria Completa Primeiro
            </Link>
          </motion.div>
        </div>

        {/* Interactive Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-700/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Simulador Interativo</h2>
            <p className="text-zinc-400">
              Veja na prática como cada abordagem funciona. O simulador gerará dados aleatoriamente e mostrará como cada método os entrega.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Mode Selection */}
            <div className="flex gap-3">
              <button
                onClick={() => setMode('polling')}
                disabled={isRunning}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'polling'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                📤 Polling
              </button>
              <button
                onClick={() => setMode('webhook')}
                disabled={isRunning}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'webhook'
                    ? 'bg-purple-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                🔔 Webhook
              </button>
            </div>

            {/* Simulation Controls */}
            <div className="flex gap-3">
              <button
                onClick={isRunning ? stopSimulation : startSimulation}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? '⏹️ Parar' : '▶️ Iniciar'}
              </button>
              <button
                onClick={resetSimulation}
                className="px-6 py-3 rounded-lg font-medium bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-zinc-800/50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Intervalo de Polling
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={config.pollingInterval}
                onChange={(e) => setConfig(prev => ({ ...prev, pollingInterval: parseInt(e.target.value) }))}
                className="w-full"
                disabled={isRunning}
              />
              <span className="text-xs text-zinc-400">{config.pollingInterval / 1000}s</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Geração de Dados
              </label>
              <input
                type="range"
                min="3000"
                max="15000"
                step="1000"
                value={config.dataGenerationInterval}
                onChange={(e) => setConfig(prev => ({ ...prev, dataGenerationInterval: parseInt(e.target.value) }))}
                className="w-full"
                disabled={isRunning}
              />
              <span className="text-xs text-zinc-400">{config.dataGenerationInterval / 1000}s</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Latência de Rede
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={config.networkLatency}
                onChange={(e) => setConfig(prev => ({ ...prev, networkLatency: parseInt(e.target.value) }))}
                className="w-full"
                disabled={isRunning}
              />
              <span className="text-xs text-zinc-400">{config.networkLatency}ms</span>
            </div>
          </div>

          {/* Current Mode Display */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              mode === 'polling' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
            }`}>
              <span className="text-lg">
                {mode === 'polling' ? '📤' : '🔔'}
              </span>
              <span className="font-medium">
                Modo Ativo: {mode === 'polling' ? 'Polling' : 'Webhook'}
              </span>
            </div>
          </div>

          {/* Visual Communication Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Flow Diagram */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">Fluxo de Comunicação</h3>
              <div className="bg-zinc-800/30 rounded-lg p-6 h-80 relative">
                {/* Client */}
                <div className="absolute top-4 left-4 bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium">
                  Cliente
                </div>
                
                {/* Server */}
                <div className="absolute top-4 right-4 bg-green-600 px-4 py-2 rounded-lg text-sm font-medium">
                  Servidor
                </div>
                
                {/* Connection line */}
                <div className="absolute top-8 left-20 right-20 h-px bg-zinc-600 mt-2"></div>
                
                {/* Status */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`px-3 py-1 rounded text-sm ${
                    isRunning ? 'bg-green-600/20 text-green-400' : 'bg-zinc-600/20 text-zinc-400'
                  }`}>
                    {isRunning ? `🟢 Simulação Ativa (${mode})` : '🔴 Simulação Parada'}
                  </div>
                </div>

                {/* Recent messages animation */}
                <div className="absolute top-16 left-0 right-0 bottom-16">
                  <AnimatePresence>
                    {(() => {
                      // Filter messages based on mode for better visualization
                      let visibleMessages = messages.slice(-5); // Get more messages to work with
                      
                      if (mode === 'webhook') {
                        // In webhook mode, prioritize webhook notifications and data generation
                        visibleMessages = visibleMessages.filter(msg => 
                          msg.type === 'webhook-notification' || 
                          msg.type === 'data-generated'
                        ).slice(-3);
                      } else {
                        // In polling mode, show polling requests/responses
                        visibleMessages = visibleMessages.filter(msg => 
                          msg.type === 'polling-request' || 
                          msg.type === 'polling-response-data' || 
                          msg.type === 'polling-response-empty'
                        ).slice(-3);
                      }
                      
                      return visibleMessages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ 
                            opacity: 0,
                            x: message.direction === 'client-to-server' ? -100 : 
                               message.direction === 'server-to-client' ? 100 : 0,
                            y: 20 + index * 35,
                            scale: message.type === 'webhook-notification' ? 0.8 : 1
                          }}
                          animate={{ 
                            opacity: 1,
                            x: message.direction === 'client-to-server' ? 50 : 
                               message.direction === 'server-to-client' ? -50 : 0,
                            y: 20 + index * 35,
                            scale: 1
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: message.type === 'webhook-notification' ? 0.6 : 0.3,
                            type: message.type === 'webhook-notification' ? 'spring' : 'tween'
                          }}
                          className={`absolute text-xs p-2 rounded shadow-lg ${getMessageColor(message.type)} ${
                            message.type === 'webhook-notification' ? 'font-semibold' : ''
                          }`}
                          style={{ 
                            left: message.direction === 'server-internal' ? '50%' : 'auto',
                            transform: message.direction === 'server-internal' ? 'translateX(-50%)' : 'none'
                          }}
                        >
                          {getMessageIcon(message.type)} {message.content.substring(0, 25)}
                          {message.content.length > 25 ? '...' : ''}
                        </motion.div>
                      ));
                    })()}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">Estatísticas em Tempo Real</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.totalRequests}</div>
                  <div className="text-xs text-zinc-400">Total de Requisições</div>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.emptyResponses}</div>
                  <div className="text-xs text-zinc-400">Respostas Vazias</div>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.dataTransfers}</div>
                  <div className="text-xs text-zinc-400">Dados Transferidos</div>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.webhookNotifications}</div>
                  <div className="text-xs text-zinc-400">Webhooks Enviados</div>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-lg text-center col-span-2">
                  <div className="text-xl font-bold text-orange-400">
                    {(stats.totalBandwidth / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-zinc-400">Bandwidth Total (bits)</div>
                </div>
              </div>

              {/* Efficiency Comparison */}
              <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg">
                <h4 className="font-bold mb-2 text-center">Eficiência</h4>
                {stats.totalRequests > 0 && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taxa de Sucesso:</span>
                      <span className="text-green-400">
                        {((stats.dataTransfers / stats.totalRequests) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Requisições Desperdiçadas:</span>
                      <span className="text-red-400">
                        {((stats.emptyResponses / stats.totalRequests) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

                             {/* Pending Data Queue */}
               <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg">
                 <h4 className="font-bold mb-2">Dados Pendentes ({pendingData.length})</h4>
                 <div className="space-y-1 max-h-20 overflow-y-auto">
                   {pendingData.slice(0, 3).map((dataItem, index) => (
                     <div key={dataItem.id} className="text-xs text-zinc-300 bg-orange-500/20 p-1 rounded">
                       📊 {dataItem.content}
                     </div>
                   ))}
                   {pendingData.length > 3 && (
                     <div className="text-xs text-zinc-500">...e mais {pendingData.length - 3}</div>
                   )}
                   {pendingData.length === 0 && (
                     <div className="text-xs text-zinc-500 text-center">Nenhum dado pendente</div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* Message Log */}
          <div>
            <h3 className="text-lg font-bold mb-4">Log de Mensagens</h3>
            <div className="bg-zinc-800/30 rounded-lg p-4 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {messages.slice(-15).reverse().map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`text-sm mb-2 p-2 rounded ${getMessageColor(message.type)}`}
                  >
                    <span className="text-zinc-500 text-xs">
                      [{new Date(message.timestamp).toLocaleTimeString()}]
                    </span>
                    {' '}
                    <span>{getMessageIcon(message.type)}</span>
                    {' '}
                    <span>{message.content}</span>
                    {message.hasData && (
                      <span className="ml-2 text-xs bg-zinc-700/50 px-2 py-1 rounded">
                        ✅ Com dados
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {messages.length === 0 && (
                <div className="text-zinc-500 text-center py-4">
                  Inicie a simulação para ver as mensagens...
                </div>
              )}
            </div>
          </div>
        </motion.div>



        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/componentes/polling-webhooks"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Voltar para Teoria
          </Link>
          <Link
            to="/componentes"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Componentes Básicos
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 