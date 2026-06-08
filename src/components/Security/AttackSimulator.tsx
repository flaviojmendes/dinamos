import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Node {
  id: string;
  type: 'client' | 'server' | 'attacker';
  x: number;
  y: number;
  status: 'normal' | 'attacking' | 'compromised' | 'overloaded';
}

interface Packet {
  id: string;
  from: Node;
  to: Node;
  x: number;
  y: number;
  type: 'normal' | 'malicious';
}

const selectClass =
  'bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-2 py-1 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green';

export default function AttackSimulator() {
  const { t } = useTranslation();
  const base = 'attack_simulator';
  
  const [attackType, setAttackType] = useState<'ddos' | 'mitm'>('ddos');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [packets, setPackets] = useState<Packet[]>([]);
  const animationFrameRef = useRef<number>();
  const lastPacketTimeRef = useRef(0);

  useEffect(() => {
    if (attackType === 'ddos') {
      setNodes([
          { id: 'server', type: 'server', x: 600, y: 300, status: 'normal' },
          { id: 'client1', type: 'client', x: 200, y: 150, status: 'normal' },
          { id: 'client2', type: 'client', x: 200, y: 300, status: 'normal' },
          { id: 'client3', type: 'client', x: 200, y: 450, status: 'normal' },
          { id: 'attacker1', type: 'attacker', x: 100, y: 200, status: 'attacking' },
          { id: 'attacker2', type: 'attacker', x: 100, y: 400, status: 'attacking' },
      ]);
    } else {
      setNodes([
          { id: 'server', type: 'server', x: 700, y: 300, status: 'normal' },
          { id: 'client', type: 'client', x: 100, y: 300, status: 'normal' },
          { id: 'attacker', type: 'attacker', x: 400, y: 300, status: 'attacking' },
      ]);
    }
    setPackets([]);
  }, [attackType]);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (timestamp - lastPacketTimeRef.current > (1000 / speed)) {
        lastPacketTimeRef.current = timestamp;
        
        if (attackType === 'ddos') {
            const legitClients = nodes.filter(n => n.type === 'client');
            if (Math.random() < 0.3) {
              const client = legitClients[Math.floor(Math.random() * legitClients.length)];
              const server = nodes.find(n => n.type === 'server')!;
              setPackets(prev => [...prev, {
                id: Math.random().toString(),
                from: client,
                to: server,
                x: client.x,
                y: client.y,
                type: 'normal'
              }]);
            }

            const attackers = nodes.filter(n => n.type === 'attacker');
            attackers.forEach(attacker => {
              if (Math.random() < 0.8) {
                const server = nodes.find(n => n.type === 'server')!;
                setPackets(prev => [...prev, {
                  id: Math.random().toString(),
                  from: attacker,
                  to: server,
                  x: attacker.x,
                  y: attacker.y,
                  type: 'malicious'
                }]);
              }
            });
        } else {
            const client = nodes.find(n => n.type === 'client')!;
            const server = nodes.find(n => n.type === 'server')!;
            const attacker = nodes.find(n => n.type === 'attacker')!;

            if (Math.random() < 0.3) {
              setPackets(prev => [...prev, {
                id: Math.random().toString(),
                from: client,
                to: attacker,
                x: client.x,
                y: client.y,
                type: 'normal'
              }]);

              setPackets(prev => [...prev, {
                id: Math.random().toString(),
                from: attacker,
                to: server,
                x: attacker.x,
                y: attacker.y,
                type: 'malicious'
              }]);
            }
        }
      }

      setPackets(prev => {
        const speed = 5;
        return prev
          .map(packet => {
            const dx = packet.to.x - packet.x;
            const dy = packet.to.y - packet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < speed) {
              if (packet.to.type === 'server') {
                setNodes(prev => prev.map(node => 
                  node.id === 'server' 
                    ? {...node, status: attackType === 'ddos' ? 'overloaded' : 'compromised'}
                    : node
                ));
              }
              return null;
            }

            const vx = (dx / distance) * speed;
            const vy = (dy / distance) * speed;

            return {
              ...packet,
              x: packet.x + vx,
              y: packet.y + vy
            };
          })
          .filter((p): p is Packet => p !== null);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, attackType, nodes, speed]);

  return (
    <div className="space-y-6">
      <Panel
        title={attackType === 'ddos' ? t(`${base}.ddos_attack_button`) : t(`${base}.mitm_attack_button`)}
        accent="red"
        action={isPlaying ? <StatusBadge variant="in-progress" label="Running" /> : undefined}
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <TacticalButton
              size="sm"
              variant={attackType === 'ddos' ? 'danger' : 'secondary'}
              onClick={() => setAttackType('ddos')}
            >
              {t(`${base}.ddos_attack_button`)}
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant={attackType === 'mitm' ? 'danger' : 'secondary'}
              onClick={() => setAttackType('mitm')}
            >
              {t(`${base}.mitm_attack_button`)}
            </TacticalButton>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.speed_label`)}</label>
              <select
                className={selectClass}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <TacticalButton
              size="sm"
              variant={isPlaying ? 'danger' : 'primary'}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? t(`${base}.stop_simulation`) : t(`${base}.start_simulation`)}
            </TacticalButton>
          </div>
        </div>

        <div className="relative w-full h-[600px] rounded-lg bg-slate-950 border border-slate-800 dark:border-tactical-border overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {nodes.map((node) =>
              node.type !== 'server'
                ? (
                  <line
                    key={`line-${node.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={nodes.find(n => n.type === (attackType === 'mitm' && node.type === 'client' ? 'attacker' : 'server'))?.x || 0}
                    y2={nodes.find(n => n.type === (attackType === 'mitm' && node.type === 'client' ? 'attacker' : 'server'))?.y || 0}
                    stroke="#334155"
                    strokeWidth="2"
                  />
                ) : null
            )}
            {attackType === 'mitm' && (
              <line
                x1={nodes.find(n => n.type === 'attacker')?.x || 0}
                y1={nodes.find(n => n.type === 'attacker')?.y || 0}
                x2={nodes.find(n => n.type === 'server')?.x || 0}
                y2={nodes.find(n => n.type === 'server')?.y || 0}
                stroke="#334155"
                strokeWidth="2"
              />
            )}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                node.type === 'server'
                  ? 'bg-signal-cyan'
                  : node.type === 'attacker'
                  ? 'bg-signal-red'
                  : 'bg-signal-green'
              } ${
                node.status === 'overloaded'
                  ? 'animate-pulse'
                  : node.status === 'compromised'
                  ? 'ring-2 ring-signal-red'
                  : ''
              }`}
              style={{
                left: node.x,
                top: node.y,
                zIndex: 10,
              }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {node.type === 'server' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                ) : node.type === 'attacker' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                )}
              </svg>
            </div>
          ))}

          {packets.map((packet) => (
            <div
              key={packet.id}
              className={`absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 ${
                packet.type === 'normal'
                  ? 'bg-signal-green'
                  : 'bg-signal-red'
              } transition-transform duration-75`}
              style={{
                left: packet.x,
                top: packet.y,
                zIndex: 20,
                transform: `translate(-50%, -50%) scale(${Math.random() * 0.3 + 0.7})`,
              }}
            >
                <div className={`absolute inset-0 ${
                  packet.type === 'normal'
                    ? 'bg-signal-green/60'
                    : 'bg-signal-red/60'
                } animate-ping`} />
            </div>
          ))}
        </div>
      </Panel>

      <div className="tactical-panel rounded-lg border-l-2 border-l-signal-red p-5">
        <h3 className="font-sans text-sm font-semibold text-signal-red mb-2">
          {attackType === 'ddos' ? t(`${base}.ddos_simulation_title`) : t(`${base}.mitm_simulation_title`)}
        </h3>
        <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-4">
          {attackType === 'ddos'
            ? t(`${base}.ddos_simulation_description`)
            : t(`${base}.mitm_simulation_description`)}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-green" />
            <span className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.legitimate_traffic`)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-signal-red" />
            <span className="font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.malicious_traffic`)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
