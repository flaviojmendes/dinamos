import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RequestAttempt {
  id: number;
  timestamp: number;
  status: 'pending' | 'success' | 'error';
  delay: number;
}

interface SimulationConfig {
  maxRetries: number;
  baseDelay: number;
  successRate: number;
  useExponentialBackoff: boolean;
  jitter: boolean;
}

export default function RetriesSimulator() {
  const [config, setConfig] = useState<SimulationConfig>({
    maxRetries: 3,
    baseDelay: 1000,
    successRate: 30,
    useExponentialBackoff: true,
    jitter: true,
  });

  const [attempts, setAttempts] = useState<RequestAttempt[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const calculateDelay = (attempt: number) => {
    let delay = config.baseDelay;
    
    if (config.useExponentialBackoff) {
      delay = config.baseDelay * Math.pow(2, attempt);
    }
    
    if (config.jitter) {
      const jitterAmount = delay * 0.2; // 20% jitter
      delay += Math.random() * jitterAmount - (jitterAmount / 2);
    }
    
    return Math.round(delay);
  };

  const simulateRequest = async () => {
    const success = Math.random() * 100 <= config.successRate;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve('Success');
        } else {
          reject('Failed');
        }
      }, 500);
    });
  };

  const startSimulation = async () => {
    setIsSimulating(true);
    setAttempts([]);
    setCurrentAttempt(0);

    let attemptCount = 0;
    let success = false;

    while (attemptCount <= config.maxRetries && !success) {
      const delay = calculateDelay(attemptCount);
      
      const newAttempt: RequestAttempt = {
        id: attemptCount + 1,
        timestamp: Date.now(),
        status: 'pending',
        delay: delay,
      };
      
      setAttempts(prev => [...prev, newAttempt]);
      setCurrentAttempt(attemptCount);

      try {
        await simulateRequest();
        setAttempts(prev => 
          prev.map(a => 
            a.id === newAttempt.id ? { ...a, status: 'success' } : a
          )
        );
        success = true;
      } catch (error) {
        setAttempts(prev => 
          prev.map(a => 
            a.id === newAttempt.id ? { ...a, status: 'error' } : a
          )
        );
        
        if (attemptCount < config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      attemptCount++;
    }

    setIsSimulating(false);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-4xl font-bold mb-4 text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Simulador de Retries
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurações
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900 rounded-lg p-6 mb-8 overflow-hidden"
          >
            <h2 className="text-xl font-bold text-zinc-200 mb-6">Configurações da Simulação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Máximo de Tentativas: {config.maxRetries}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.maxRetries}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxRetries: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Delay Base: {config.baseDelay}ms
                </label>
                <input
                  type="range"
                  min="500"
                  max="2000"
                  step="100"
                  value={config.baseDelay}
                  onChange={(e) => setConfig(prev => ({ ...prev, baseDelay: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Taxa de Sucesso: {config.successRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.successRate}
                  onChange={(e) => setConfig(prev => ({ ...prev, successRate: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={config.useExponentialBackoff}
                    onChange={(e) => setConfig(prev => ({ ...prev, useExponentialBackoff: e.target.checked }))}
                    className="rounded border-zinc-600"
                  />
                  Usar Backoff Exponencial
                </label>
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={config.jitter}
                    onChange={(e) => setConfig(prev => ({ ...prev, jitter: e.target.checked }))}
                    className="rounded border-zinc-600"
                  />
                  Adicionar Jitter
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Visualization */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-200">Visualização</h2>
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
            >
              {isSimulating ? 'Simulando...' : 'Iniciar Simulação'}
            </button>
          </div>
          
          <div className="space-y-4">
            {attempts.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg ${
                  attempt.status === 'pending' ? 'bg-zinc-800' :
                  attempt.status === 'success' ? 'bg-green-900/30 border border-green-700' :
                  'bg-red-900/30 border border-red-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Tentativa {attempt.id}</span>
                    {attempt.status === 'pending' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                      />
                    )}
                    {attempt.status === 'success' && (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {attempt.status === 'error' && (
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  {index < attempts.length - 1 && attempt.status === 'error' && (
                    <div className="text-sm text-zinc-400">
                      Próxima tentativa em {attempt.delay}ms
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column - Stats and Info */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-zinc-200 mb-4">Estatísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-400">Total de Tentativas</div>
                <div className="text-2xl font-bold text-zinc-200">{attempts.length}</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="text-sm text-zinc-400">Status Final</div>
                <div className="text-2xl font-bold text-zinc-200">
                  {attempts.length > 0 ? 
                    (attempts[attempts.length - 1].status === 'success' ? 'Sucesso' : 'Falha') :
                    '-'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-zinc-200 mb-4">Explicação</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Este simulador demonstra como o mecanismo de retry funciona em sistemas distribuídos. 
                Cada tentativa tem uma chance de sucesso baseada na taxa configurada.
              </p>
              <p>
                Com o backoff exponencial, o tempo entre tentativas aumenta progressivamente 
                (1s, 2s, 4s, 8s...), reduzindo a carga no sistema.
              </p>
              <p>
                O jitter adiciona uma variação aleatória no tempo entre tentativas, evitando que 
                múltiplos clientes tentem novamente exatamente ao mesmo tempo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 