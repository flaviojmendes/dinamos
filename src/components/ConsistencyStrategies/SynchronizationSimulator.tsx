import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Philosopher {
  id: number;
  name: string;
  state: 'thinking' | 'hungry' | 'eating';
}

interface Fork {
  id: number;
  heldBy: number | null;
}

const inputClass =
  'w-full rounded-lg bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-sans text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-emerald-500 dark:focus:border-signal-green';

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

  const getForkIds = (philosopherId: number) => ({
    left: philosopherId,
    right: (philosopherId + 1) % philosophers.length
  });

  const canEat = (philosopherId: number): boolean => {
    const { left, right } = getForkIds(philosopherId);
    
    switch (strategy) {
      case 'hierarchical':
        if (left < right) {
          return forks[left].heldBy === null;
        } else {
          return forks[right].heldBy === null;
        }
      
      case 'both':
        return forks[left].heldBy === null && forks[right].heldBy === null;
      
      case 'arbitrator': {
        const eatingCount = philosophers.filter(p => p.state === 'eating').length;
        return eatingCount < philosophers.length - 1 && 
               forks[left].heldBy === null && 
               forks[right].heldBy === null;
      }
      
      default:
        return false;
    }
  };

  const tryPickUpForks = (philosopherId: number) => {
    if (!canEat(philosopherId)) {
      addLog(`${philosophers[philosopherId].name} não pode pegar os garfos agora`);
      return false;
    }

    const { left, right } = getForkIds(philosopherId);

    switch (strategy) {
      case 'hierarchical':
        if (left < right) {
          if (forks[left].heldBy === null) {
            setForks(prev => prev.map(f => 
              f.id === left ? { ...f, heldBy: philosopherId } : f
            ));
            addLog(`${philosophers[philosopherId].name} pegou o garfo esquerdo`);

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
          if (forks[right].heldBy === null) {
            setForks(prev => prev.map(f => 
              f.id === right ? { ...f, heldBy: philosopherId } : f
            ));
            addLog(`${philosophers[philosopherId].name} pegou o garfo direito`);

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

  const getStateBorder = (state: string) => {
    switch (state) {
      case 'thinking': return 'border-signal-cyan/50 bg-signal-cyan/10 text-signal-cyan';
      case 'hungry': return 'border-signal-amber/50 bg-signal-amber/10 text-signal-amber';
      case 'eating': return 'border-signal-green/50 bg-signal-green/10 text-signal-green';
      default: return 'border-tactical-border bg-tactical-raised text-slate-600 dark:text-tactical-dim';
    }
  };

  const getStateBadge = (state: string): React.ComponentProps<typeof StatusBadge>['variant'] => {
    switch (state) {
      case 'thinking': return 'online';
      case 'hungry': return 'pending';
      case 'eating': return 'active';
      default: return 'offline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
          Simulador do jantar dos filósofos
        </h2>
      </div>

      <Panel title="Controles" accent="amber">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as 'hierarchical' | 'both' | 'arbitrator')}
            className={inputClass}
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
            className="w-full accent-signal-green"
          />

          <TacticalButton
            variant={isRunning ? 'danger' : 'primary'}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Parar' : 'Iniciar'}
          </TacticalButton>
        </div>
      </Panel>

      <Panel title="Visualização" accent="green">
        <div className="relative aspect-square max-w-xl mx-auto p-8">
          <div className="absolute inset-[15%] rounded-full border-2 border-slate-300 dark:border-tactical-border" />
          
          {philosophers.map((philosopher, index) => {
            const angle = (index * 2 * Math.PI) / 5;
            const radius = 40;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <motion.div
                key={philosopher.id}
                className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-lg border flex flex-col items-center justify-center p-2 font-sans text-xs ${getStateBorder(philosopher.state)}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-center">
                  <div className="font-medium">{philosopher.name}</div>
                  <StatusBadge variant={getStateBadge(philosopher.state)} label={philosopher.state} className="mt-1" />
                </div>
              </motion.div>
            );
          })}

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
                  className={`w-full h-full ${
                    fork.heldBy !== null 
                      ? 'bg-signal-amber' 
                      : 'bg-slate-400 dark:bg-tactical-line'
                  }`}
                />
                {fork.heldBy !== null && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised text-slate-600 dark:text-tactical-dim font-sans text-[10px] px-2 py-0.5 whitespace-nowrap">
                    Garfo <span className="font-mono tabular-nums">{fork.id}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Log de Eventos" accent="cyan">
        <div className="h-48 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="font-mono text-sm text-slate-600 dark:text-tactical-dim">
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="font-sans text-xs text-slate-400 dark:text-tactical-label text-center py-8">
              Aguardando eventos…
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
