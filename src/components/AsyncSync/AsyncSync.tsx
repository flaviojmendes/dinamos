import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Request {
  id: number;
  type: 'sync' | 'async';
  status: 'ordered' | 'preparing' | 'ready' | 'served';
  startTime: number;
  lane: number;
}

interface UserAction {
  id: number;
  timestamp: number;
  type: 'order' | 'served';
}

export default function AsyncSync() {
  const [communicationType, setCommunicationType] = useState<'sync' | 'async'>('sync');
  const [requests, setRequests] = useState<Request[]>([]);
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [nextId, setNextId] = useState(1);
  const [nextLane, setNextLane] = useState(0);
  const [maxConcurrent] = useState(3);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const resetSimulation = () => {
    setRequests([]);
    setUserActions([]);
    setNextId(1);
    setNextLane(0);
    setIsButtonDisabled(false);
  };

  const placeOrder = () => {
    const now = Date.now();
    const newRequest: Request = {
      id: nextId,
      type: communicationType,
      status: 'ordered',
      startTime: now,
      lane: communicationType === 'sync' ? 0 : nextLane,
    };

    // Add order action
    setUserActions(prev => [...prev, {
      id: nextId,
      timestamp: now,
      type: 'order'
    }]);

    if (communicationType === 'sync') {
      setIsButtonDisabled(true);
      setRequests(prev => [...prev, newRequest]);
      processSyncOrder(newRequest);
    } else {
      const activeRequests = requests.filter(r => r.status !== 'served').length;
      if (activeRequests < maxConcurrent) {
        setNextLane((nextLane + 1) % maxConcurrent);
        setRequests(prev => [...prev, newRequest]);
        processAsyncOrder(newRequest);
      }
    }
    setNextId(nextId + 1);
  };

  const processSyncOrder = (request: Request) => {
    // Preparing
    setTimeout(() => {
      setRequests(prev => prev.map(r => 
        r.id === request.id ? { ...r, status: 'preparing' } : r
      ));

      // Ready
      setTimeout(() => {
        setRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, status: 'ready' } : r
        ));

        // Served
        setTimeout(() => {
          setRequests(prev => prev.map(r => 
            r.id === request.id ? { ...r, status: 'served' } : r
          ));
          setIsButtonDisabled(false);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const processAsyncOrder = (request: Request) => {
    setTimeout(() => {
      setRequests(prev => prev.map(r => 
        r.id === request.id ? { ...r, status: 'preparing' } : r
      ));

      setTimeout(() => {
        setRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, status: 'ready' } : r
        ));

        setTimeout(() => {
          setRequests(prev => prev.map(r => 
            r.id === request.id ? { ...r, status: 'served' } : r
          ));
          // Add served action for async requests
          setUserActions(prev => [...prev, {
            id: request.id,
            timestamp: Date.now(),
            type: 'served'
          }]);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  // Clean up completed orders and old actions
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setRequests(prev => prev.filter(r => 
        now - r.startTime < 5000 || r.status !== 'served'
      ));
      setUserActions(prev => prev.filter(a => 
        now - a.timestamp < 5000
      ));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={placeOrder}
                disabled={communicationType === 'sync' && isButtonDisabled}
                className={`px-4 py-2 rounded-lg font-medium ${
                  communicationType === 'sync' && isButtonDisabled
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                }`}
              >
                Enviar Mensagem {nextId}
              </button>
              <button
                onClick={resetSimulation}
                className="px-4 py-2 rounded-lg font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Reiniciar
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCommunicationType('sync');
                  resetSimulation();
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  communicationType === 'sync'
                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/50'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Síncrono
              </button>
              <button
                onClick={() => {
                  setCommunicationType('async');
                  resetSimulation();
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  communicationType === 'async'
                    ? 'bg-purple-500/10 text-purple-500 border border-purple-500/50'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Assíncrono
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Visualization */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="relative h-[300px]">
          {/* Restaurant Sections */}
          <div className="absolute inset-0 flex flex-col">
            {/* Section Headers */}
            <div className="flex h-8 text-sm text-zinc-400 border-b border-zinc-800">
              <div className="w-1/3 text-center">Cliente</div>
              <div className="w-1/3 text-center border-l border-zinc-800">Servidor</div>
              <div className="w-1/3 text-center border-l border-zinc-800">DB</div>
            </div>

            {/* Restaurant Content */}
            <div className="flex-1 relative">
              {/* Background Sections */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3 border-r border-zinc-800" />
                <div className="w-1/3 border-r border-zinc-800" />
                <div className="w-1/3" />
              </div>

              {/* Order Animations */}
              <AnimatePresence>
                {requests.map((request) => (
                  <div key={request.id} className="absolute left-0 right-0" style={{ top: request.lane * 40 + 16 }}>
                    {/* Order Flow Line */}
                    <motion.div
                      className={`absolute h-0.5 ${
                        request.type === 'sync' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      }`}
                      initial={{ width: '0%', left: '33%' }}
                      animate={{
                        width: request.status === 'ordered' ? '0%' : '33%',
                        left: request.status === 'ordered' ? '33%' : 
                              request.status === 'preparing' || request.status === 'ready' ? '66%' : '33%'
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Order Dot */}
                    <motion.div
                      className={`absolute h-6 w-6 rounded-full flex items-center justify-center text-sm ${
                        request.type === 'sync' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      initial={{ left: '31%', opacity: 0 }}
                      animate={{
                        left: request.status === 'ordered' ? '31%' :
                              request.status === 'preparing' || request.status === 'ready' ? '64%' : '31%',
                        opacity: 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {request.id}
                    </motion.div>

                    {/* Customer Waiting Indicator (Sync Only) */}
                    {request.type === 'sync' && request.status !== 'served' && (
                      <motion.div
                        className="absolute h-6 bg-red-500/20 left-[2%] w-[29%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs">
                          Aguardando...
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </AnimatePresence>

              {/* Customer Actions */}
              <AnimatePresence>
                {userActions.map((action) => (
                  <motion.div
                    key={`${action.id}-${action.type}`}
                    className={`absolute h-6 w-6 rounded-full flex items-center justify-center ${
                      action.type === 'order' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    initial={{ 
                      left: action.type === 'order' ? '2%' : '15%',
                      top: action.type === 'order' ? 16 : 64,
                      opacity: 0,
                      scale: 0.5
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {action.type === 'order' ? '✉️' : '✅'}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Service Line */}
              <div className="absolute left-[15%] top-0 bottom-0 w-0.5 bg-zinc-700">
                {communicationType === 'async' && (
                  <div className="absolute inset-0 border-l-2 border-dashed border-green-500/30 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Síncrono (Bloqueante)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Assíncrono (Não Bloqueante)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✉️ Mensagem</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✅ Processado</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg text-xs text-zinc-300">
          <p><strong>Síncrono:</strong> A mensagem é enviada e o cliente espera a resposta.</p>
          <p><strong>Assíncrono:</strong> A mensagem é enviada e o cliente não espera a resposta.</p>
        </div>
      </div>
    </div>
  );
} 