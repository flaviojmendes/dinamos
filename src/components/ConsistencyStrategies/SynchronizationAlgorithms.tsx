import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Process {
  id: number;
  state: 'idle' | 'requesting' | 'executing';
  number?: number; // For Bakery algorithm
  timestamp?: number; // For Ricart-Agrawala
}

export default function SynchronizationAlgorithms() {
  const { t } = useTranslation();
  // Bakery Algorithm Demo State
  const [bakeryProcesses, setBakeryProcesses] = useState<Process[]>([
    { id: 0, state: 'idle' },
    { id: 1, state: 'idle' },
    { id: 2, state: 'idle' },
  ]);
  const [nextBakeryNumber, setNextBakeryNumber] = useState(1);

  // Token Ring Demo State
  const [tokenRingProcesses, setTokenRingProcesses] = useState<Process[]>([
    { id: 0, state: 'idle' },
    { id: 1, state: 'idle' },
    { id: 2, state: 'idle' },
    { id: 3, state: 'idle' },
  ]);
  const [tokenPosition, setTokenPosition] = useState(0);

  // Ricart-Agrawala Demo State
  const [ricartProcesses, setRicartProcesses] = useState<Process[]>([
    { id: 0, state: 'idle', timestamp: 0 },
    { id: 1, state: 'idle', timestamp: 0 },
    { id: 2, state: 'idle', timestamp: 0 },
  ]);

  // Bakery Algorithm Demo Functions
  const requestBakeryAccess = (processId: number) => {
    setBakeryProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, state: 'requesting', number: nextBakeryNumber }
        : p
    ));
    setNextBakeryNumber(prev => prev + 1);
    
    // Simulate process execution after delay
    setTimeout(() => {
      setBakeryProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, state: 'executing' } : p
      ));
      
      // Release after execution
      setTimeout(() => {
        setBakeryProcesses(prev => prev.map(p => 
          p.id === processId ? { ...p, state: 'idle', number: undefined } : p
        ));
      }, 2000);
    }, 1000);
  };

  // Token Ring Demo Functions
  const moveToken = () => {
    setTokenPosition(prev => (prev + 1) % tokenRingProcesses.length);
    setTokenRingProcesses(prev => prev.map(p => ({
      ...p,
      state: p.id === (tokenPosition + 1) % tokenRingProcesses.length ? 'executing' : 'idle'
    })));
  };

  // Ricart-Agrawala Demo Functions
  const requestRicartAccess = (processId: number) => {
    const timestamp = Date.now();
    setRicartProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, state: 'requesting', timestamp }
        : p
    ));

    // Simulate receiving responses
    setTimeout(() => {
      setRicartProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, state: 'executing' } : p
      ));

      // Release after execution
      setTimeout(() => {
        setRicartProcesses(prev => prev.map(p => 
          p.id === processId ? { ...p, state: 'idle' } : p
        ));
      }, 2000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('design_principles.algorithms.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          {t('design_principles.algorithms.intro')}
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-brand-600 dark:text-brand-300">
          <strong className="block mb-2">{t('design_principles.algorithms.key_concept_label')}</strong>
          {t('design_principles.algorithms.key_concept_text')}
        </div>
      </motion.div>

      {/* Bakery Algorithm */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.algorithms.bakery.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">{t('design_principles.algorithms.bakery.concept_title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('design_principles.algorithms.bakery.concept_p')}
              </p>
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="px-2 py-1 bg-blue-500/20 text-brand-600 dark:text-brand-300 rounded">
                  {t('design_principles.algorithms.bakery.badges.total_order')}
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-brand-600 dark:text-brand-300 rounded">
                  {t('design_principles.algorithms.bakery.badges.fairness')}
                </span>
              </div>

              {/* Code Example */}
              <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-brand-600 dark:text-brand-300">
{`// Estrutura do processo
type Process = {
  id: number;
  number: number | null;  // Número da senha
  choosing: boolean;      // Está pegando senha?
}

// Pegar uma senha
function getNumber(process: Process, processes: Process[]) {
  process.choosing = true;
  process.number = 1 + Math.max(
    ...processes.map(p => p.number ?? 0)
  );
  process.choosing = false;
}

// Tentar entrar na seção crítica
function enterCriticalSection(process: Process, processes: Process[]) {
  getNumber(process, processes);
  
  // Esperar outros processos
  for (const other of processes) {
    // Esperar se outro está escolhendo número
    while (other.choosing) { /* wait */ }
    
    // Esperar processos com prioridade maior
    while (
      other.number !== null && (
        other.number < process.number ||
        (other.number === process.number && 
         other.id < process.id)
      )
    ) { /* wait */ }
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="bg-white dark:bg-slate-900/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-brand-600 dark:text-brand-400">{t('design_principles.algorithms.bakery.demo_title')}</h4>
              <div className="space-y-4">
                {bakeryProcesses.map(process => (
                  <div 
                    key={process.id}
                    className="flex items-center gap-4"
                  >
                    <motion.div 
                      className={`w-32 h-12 rounded-lg flex items-center justify-center ${
                        process.state === 'idle' ? 'bg-slate-100 dark:bg-slate-800' :
                        process.state === 'requesting' ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      }`}
                      animate={{
                        scale: process.state === 'idle' ? 1 : 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <span className="text-white">
                        {t('design_principles.algorithms.bakery.labels.process')} {process.id}
                      </span>
                    </motion.div>
                    {process.number && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-blue-500/20 px-3 py-1 rounded text-brand-600 dark:text-brand-300"
                      >
                        {t('design_principles.algorithms.bakery.labels.ticket')}: {process.number}
                      </motion.div>
                    )}
                    {process.state === 'idle' && (
                      <button
                        onClick={() => requestBakeryAccess(process.id)}
                        className="px-3 py-1 bg-blue-500/20 text-brand-600 dark:text-brand-300 rounded hover:bg-blue-500/30"
                      >
                        {t('design_principles.algorithms.bakery.labels.request_access')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Token Ring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.algorithms.token_ring.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">{t('design_principles.algorithms.token_ring.concept_title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('design_principles.algorithms.token_ring.concept_p')}
              </p>
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  {t('design_principles.algorithms.token_ring.badges.single_token')}
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  {t('design_principles.algorithms.token_ring.badges.circular_passing')}
                </span>
              </div>

              {/* Code Example */}
              <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-green-300">
{`// Estrutura do processo
type Process = {
  id: number;
  hasToken: boolean;
  nextProcess: Process;
}

// Implementação do Token Ring
class TokenRing {
  private processes: Process[];
  
  constructor(numProcesses: number) {
    // Criar anel de processos
    this.processes = Array.from(
      { length: numProcesses },
      (_, i) => ({
        id: i,
        hasToken: i === 0, // Processo 0 inicia com token
        nextProcess: null
      })
    );
    
    // Conectar processos em anel
    for (let i = 0; i < numProcesses; i++) {
      this.processes[i].nextProcess = 
        this.processes[(i + 1) % numProcesses];
    }
  }
  
  // Passar token para próximo processo
  passToken(process: Process) {
    if (process.hasToken) {
      process.hasToken = false;
      process.nextProcess.hasToken = true;
    }
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="bg-white dark:bg-slate-900/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-green-400">{t('design_principles.algorithms.token_ring.demo_title')}</h4>
              <div className="relative aspect-square">
                {tokenRingProcesses.map((process, index) => {
                  const angle = (index * 2 * Math.PI) / tokenRingProcesses.length;
                  const radius = 40;
                  const x = 50 + radius * Math.cos(angle);
                  const y = 50 + radius * Math.sin(angle);

                  return (
                    <motion.div
                      key={process.id}
                      className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-full flex items-center justify-center ${
                        tokenPosition === process.id 
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                      animate={{
                        scale: tokenPosition === process.id ? 1.1 : 1,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <span className={`${
                        tokenPosition === process.id ? 'text-green-300' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {t('design_principles.algorithms.token_ring.labels.process_prefix')}{process.id}
                      </span>
                    </motion.div>
                  );
                })}
                {/* Token Movement Control */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={moveToken}
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30"
                  >
                    {t('design_principles.algorithms.token_ring.move_token')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ricart-Agrawala */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.algorithms.ricart_agrawala.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t('design_principles.algorithms.ricart_agrawala.concept_title')}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {t('design_principles.algorithms.ricart_agrawala.concept_p')}
              </p>
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                  {t('design_principles.algorithms.ricart_agrawala.badges.timestamps')}
                </span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                  {t('design_principles.algorithms.ricart_agrawala.badges.consensus')}
                </span>
              </div>

              {/* Code Example */}
              <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 mb-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-yellow-300">
{`// Estrutura do processo
type Process = {
  id: number;
  timestamp: number;
  state: 'idle' | 'requesting' | 'executing';
  requestQueue: Request[];
}

type Request = {
  processId: number;
  timestamp: number;
}

// Implementação do algoritmo
class RicartAgrawala {
  requestCriticalSection(process: Process) {
    process.timestamp = Date.now();
    process.state = 'requesting';
    
    // Enviar requisição para todos
    broadcastRequest(process);
    
    // Esperar respostas
    waitForResponses(process);
  }
  
  handleRequest(process: Process, request: Request) {
    if (process.state === 'idle' ||
        request.timestamp < process.timestamp ||
        (request.timestamp === process.timestamp && 
         request.processId < process.id)) {
      // Enviar OK imediatamente
      sendOK(request.processId);
    } else {
      // Adicionar à fila de requisições
      process.requestQueue.push(request);
    }
  }
  
  releaseCriticalSection(process: Process) {
    process.state = 'idle';
    // Responder todas requisições na fila
    process.requestQueue.forEach(req => 
      sendOK(req.processId)
    );
    process.requestQueue = [];
  }
}`}
                  </code>
                </pre>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="bg-white dark:bg-slate-900/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">{t('design_principles.algorithms.ricart_agrawala.demo_title')}</h4>
              <div className="space-y-4">
                {ricartProcesses.map(process => (
                  <div 
                    key={process.id}
                    className="flex items-center gap-4"
                  >
                    <motion.div 
                      className={`w-32 h-12 rounded-lg flex items-center justify-center ${
                        process.state === 'idle' ? 'bg-slate-100 dark:bg-slate-800' :
                        process.state === 'requesting' ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      }`}
                      animate={{
                        scale: process.state === 'idle' ? 1 : 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <span className="text-white">
                        {t('design_principles.algorithms.ricart_agrawala.labels.process')} {process.id}
                      </span>
                    </motion.div>
                    {process.timestamp !== undefined && process.timestamp > 0 && process.state !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-yellow-500/20 px-3 py-1 rounded text-yellow-300"
                      >
                        {t('design_principles.algorithms.ricart_agrawala.labels.ts_prefix')}: {process.timestamp}
                      </motion.div>
                    )}
                    {process.state === 'idle' && (
                      <button
                        onClick={() => requestRicartAccess(process.id)}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30"
                      >
                        {t('design_principles.algorithms.ricart_agrawala.labels.request_access')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.algorithms.comparison.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-brand-600 dark:text-brand-400">{t('design_principles.algorithms.comparison.bakery_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.algorithms.comparison.advantages')}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('design_principles.algorithms.comparison.bakery.pros')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.algorithms.comparison.disadvantages')}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('design_principles.algorithms.comparison.bakery.cons')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">{t('design_principles.algorithms.comparison.token_ring_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.algorithms.comparison.advantages')}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('design_principles.algorithms.comparison.token_ring.pros')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.algorithms.comparison.disadvantages')}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('design_principles.algorithms.comparison.token_ring.cons')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t('design_principles.algorithms.comparison.ricart_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.algorithms.comparison.advantages')}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('design_principles.algorithms.comparison.ricart.pros')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.algorithms.comparison.disadvantages')}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('design_principles.algorithms.comparison.ricart.cons')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        
      </motion.div>
    </div>
  );
} 