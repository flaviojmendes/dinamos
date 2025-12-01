import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Philosopher {
  id: number;
  name: string;
  state: 'thinking' | 'hungry' | 'eating';
}

interface Fork {
  id: number;
  heldBy: number | null; // ID of philosopher holding the fork, or null if not held
}

export default function PhilosophersSimulator() {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([
    { id: 0, name: 'Platão', state: 'thinking' },
    { id: 1, name: 'Aristóteles', state: 'thinking' },
    { id: 2, name: 'Sócrates', state: 'thinking' },
    { id: 3, name: 'Descartes', state: 'thinking' },
    { id: 4, name: 'Kant', state: 'thinking' },
  ]);

  const [forks, setForks] = useState<Fork[]>([
    { id: 0, heldBy: null },
    { id: 1, heldBy: null },
    { id: 2, heldBy: null },
    { id: 3, heldBy: null },
    { id: 4, heldBy: null },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [strategy, setStrategy] = useState<'hierarchical' | 'both' | 'arbitrator'>('hierarchical');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Get fork IDs for a philosopher
  const getForkIds = (philosopherId: number) => ({
    left: philosopherId,
    right: (philosopherId + 1) % philosophers.length
  });

  // Check if a philosopher can eat
  const canEat = (philosopherId: number): boolean => {
    const { left, right } = getForkIds(philosopherId);
    
    switch (strategy) {
      case 'hierarchical':
        // Must pick up lower-numbered fork first
        if (left < right) {
          return forks[left].heldBy === null;
        } else {
          return forks[right].heldBy === null;
        }
      
      case 'both':
        // Both forks must be available
        return forks[left].heldBy === null && forks[right].heldBy === null;
      
      case 'arbitrator':
        // Ensure no more than N-1 philosophers are eating
        const eatingCount = philosophers.filter(p => p.state === 'eating').length;
        return eatingCount < philosophers.length - 1 && 
               forks[left].heldBy === null && 
               forks[right].heldBy === null;
      
      default:
        return false;
    }
  };

  // Try to pick up forks
  const tryPickUpForks = (philosopherId: number) => {
    if (!canEat(philosopherId)) {
      addLog(`${philosophers[philosopherId].name} não pode pegar os garfos agora`);
      return false;
    }

    const { left, right } = getForkIds(philosopherId);

    switch (strategy) {
      case 'hierarchical':
        if (left < right) {
          // Pick up left fork first
          if (forks[left].heldBy === null) {
            setForks(prev => prev.map(f => 
              f.id === left ? { ...f, heldBy: philosopherId } : f
            ));
            addLog(`${philosophers[philosopherId].name} pegou o garfo esquerdo`);

            // Try to pick up right fork
            if (forks[right].heldBy === null) {
              setForks(prev => prev.map(f => 
                f.id === right ? { ...f, heldBy: philosopherId } : f
              ));
              setPhilosophers(prev => prev.map(p => 
                p.id === philosopherId ? { ...p, state: 'eating' } : p
              ));
              addLog(`${philosophers[philosopherId].name} pegou o garfo direito e começou a comer`);
              return true;
            }
          }
        } else {
          // Pick up right fork first
          if (forks[right].heldBy === null) {
            setForks(prev => prev.map(f => 
              f.id === right ? { ...f, heldBy: philosopherId } : f
            ));
            addLog(`${philosophers[philosopherId].name} pegou o garfo direito`);

            // Try to pick up left fork
            if (forks[left].heldBy === null) {
              setForks(prev => prev.map(f => 
                f.id === left ? { ...f, heldBy: philosopherId } : f
              ));
              setPhilosophers(prev => prev.map(p => 
                p.id === philosopherId ? { ...p, state: 'eating' } : p
              ));
              addLog(`${philosophers[philosopherId].name} pegou o garfo esquerdo e começou a comer`);
              return true;
            }
          }
        }
        break;

      case 'both':
      case 'arbitrator':
        if (forks[left].heldBy === null && forks[right].heldBy === null) {
          setForks(prev => prev.map(f => 
            (f.id === left || f.id === right) ? { ...f, heldBy: philosopherId } : f
          ));
          setPhilosophers(prev => prev.map(p => 
            p.id === philosopherId ? { ...p, state: 'eating' } : p
          ));
          addLog(`${philosophers[philosopherId].name} pegou ambos os garfos e começou a comer`);
          return true;
        }
        break;
    }

    return false;
  };

  // Release forks
  const releaseForks = (philosopherId: number) => {
    const { left, right } = getForkIds(philosopherId);
    
    setForks(prev => prev.map(f => 
      (f.id === left || f.id === right) && f.heldBy === philosopherId 
        ? { ...f, heldBy: null } 
        : f
    ));
    
    setPhilosophers(prev => prev.map(p => 
      p.id === philosopherId ? { ...p, state: 'thinking' } : p
    ));
    
    addLog(`${philosophers[philosopherId].name} liberou os garfos e voltou a pensar`);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhilosophers(prev => prev.map(philosopher => {
        const random = Math.random();

        switch (philosopher.state) {
          case 'thinking':
            if (random < 0.3) {
              addLog(`${philosopher.name} ficou com fome`);
              return { ...philosopher, state: 'hungry' };
            }
            break;
          
          case 'hungry':
            if (random < 0.5) {
              tryPickUpForks(philosopher.id);
            }
            break;
          
          case 'eating':
            if (random < 0.2) {
              releaseForks(philosopher.id);
            }
            break;
        }
        return philosopher;
      }));
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, strategy]);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'thinking': return 'bg-blue-500/20 text-brand-600 dark:text-brand-300 border-blue-500/50';
      case 'hungry': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'eating': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-zinc-500/20 text-slate-600 dark:text-slate-300 border-zinc-500/50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Simulador do Jantar dos Filósofos
      </h1>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg p-2 border border-slate-300 dark:border-slate-700"
        >
          <option value="hierarchical">Hierarquia de Recursos</option>
          <option value="both">Pegar Dois ou Nenhum</option>
          <option value="arbitrator">Árbitro Central</option>
        </select>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full"
        />

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`py-2 px-4 rounded-lg font-medium ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors`}
        >
          {isRunning ? 'Parar' : 'Iniciar'}
        </button>
      </div>

      {/* Visualization */}
      <div className="relative aspect-square max-w-xl mx-auto mb-8 bg-white dark:bg-slate-900/50 rounded-xl p-8">
        {/* Table */}
        <div className="absolute inset-[15%] rounded-full border-4 border-slate-300 dark:border-slate-700/50" />
        
        {/* Philosophers */}
        {philosophers.map((philosopher, index) => {
          const angle = (index * 2 * Math.PI) / 5;
          const radius = 40;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          return (
            <motion.div
              key={philosopher.id}
              className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-xl border ${getStateColor(philosopher.state)} 
                         flex flex-col items-center justify-center p-2`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="text-center">
                <div className="font-medium">{philosopher.name}</div>
                <div className="text-sm opacity-75">{philosopher.state}</div>
              </div>
            </motion.div>
          );
        })}

        {/* Forks */}
        {forks.map((fork, index) => {
          const angle = ((index * 2 * Math.PI) / 5) + (Math.PI / 5);
          const radius = 30;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          return (
            <motion.div
              key={fork.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: '2rem',
                height: '0.25rem',
                transform: `translate(-50%, -50%) rotate(${angle * (180/Math.PI)}deg)`,
              }}
            >
              <div 
                className={`w-full h-full rounded ${
                  fork.heldBy !== null 
                    ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' 
                    : 'bg-zinc-600'
                }`}
              />
              {fork.heldBy !== null && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-300 
                               text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  Garfo {fork.id}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Logs */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4">
        <div className="h-48 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-slate-600 dark:text-slate-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 