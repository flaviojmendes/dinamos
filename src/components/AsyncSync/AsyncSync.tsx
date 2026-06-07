import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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
      <Panel title="Controles" accent="cyan">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <TacticalButton
                size="sm"
                variant="primary"
                onClick={placeOrder}
                disabled={communicationType === 'sync' && isButtonDisabled}
              >
                Enviar Mensagem {nextId}
              </TacticalButton>
              <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
                Reiniciar
              </TacticalButton>
            </div>
            <div className="flex items-center gap-2">
              <TacticalButton
                size="sm"
                variant={communicationType === 'sync' ? 'primary' : 'secondary'}
                onClick={() => {
                  setCommunicationType('sync');
                  resetSimulation();
                }}
              >
                Síncrono
              </TacticalButton>
              <TacticalButton
                size="sm"
                variant={communicationType === 'async' ? 'primary' : 'secondary'}
                onClick={() => {
                  setCommunicationType('async');
                  resetSimulation();
                }}
              >
                Assíncrono
              </TacticalButton>
            </div>
          </div>
          {communicationType === 'sync' && isButtonDisabled && (
            <StatusBadge variant="in-progress" label="Bloqueante" />
          )}
        </div>
      </Panel>

      <Panel title="Visualização" accent="green">
        <div className="relative h-[300px]">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex h-8 text-xs font-medium text-slate-500 dark:text-tactical-label border-b border-slate-200 dark:border-tactical-border">
              <div className="w-1/3 text-center">Cliente</div>
              <div className="w-1/3 text-center border-l border-slate-200 dark:border-tactical-border">Servidor</div>
              <div className="w-1/3 text-center border-l border-slate-200 dark:border-tactical-border">DB</div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 flex">
                <div className="w-1/3 border-r border-slate-200 dark:border-tactical-border" />
                <div className="w-1/3 border-r border-slate-200 dark:border-tactical-border" />
                <div className="w-1/3" />
              </div>

              <AnimatePresence>
                {requests.map((request) => (
                  <div key={request.id} className="absolute left-0 right-0" style={{ top: request.lane * 40 + 16 }}>
                    <motion.div
                      className={`absolute h-0.5 ${
                        request.type === 'sync' ? 'bg-signal-cyan/30' : 'bg-signal-amber/30'
                      }`}
                      initial={{ width: '0%', left: '33%' }}
                      animate={{
                        width: request.status === 'ordered' ? '0%' : '33%',
                        left: request.status === 'ordered' ? '33%' : 
                              request.status === 'preparing' || request.status === 'ready' ? '66%' : '33%'
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.div
                      className={`absolute h-6 w-6 flex items-center justify-center font-mono text-xs text-white ${
                        request.type === 'sync' ? 'bg-signal-cyan' : 'bg-signal-amber'
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

                    {request.type === 'sync' && request.status !== 'served' && (
                      <motion.div
                        className="absolute h-6 bg-signal-red/10 border border-signal-red/30 left-[2%] w-[29%] rounded-md dark:rounded-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center font-sans text-signal-red text-xs rounded-md dark:rounded-none">
                          Aguardando...
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {userActions.map((action) => (
                  <motion.div
                    key={`${action.id}-${action.type}`}
                    className={`absolute h-6 w-6 flex items-center justify-center ${
                      action.type === 'order' ? 'bg-signal-green' : 'bg-signal-amber'
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

              <div className="absolute left-[15%] top-0 bottom-0 w-px bg-slate-300 dark:bg-tactical-line">
                {communicationType === 'async' && (
                  <div className="absolute inset-0 border-l border-dashed border-signal-green/30 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4 font-sans text-xs text-slate-500 dark:text-tactical-dim">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-signal-cyan"></div>
            <span>Síncrono (Bloqueante)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-signal-amber"></div>
            <span>Assíncrono (Não Bloqueante)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✉️ Mensagem</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✅ Processado</span>
          </div>
        </div>
      </Panel>

      <div className="bg-slate-50 dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-xl dark:rounded-none p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-tactical-text mb-3">Sobre o simulador</h3>
        <div className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim">
          <p><strong>Síncrono:</strong> A mensagem é enviada e o cliente espera a resposta.</p>
          <p><strong>Assíncrono:</strong> A mensagem é enviada e o cliente não espera a resposta.</p>
        </div>
      </div>
    </div>
  );
}
