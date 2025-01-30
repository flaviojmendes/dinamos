import React, { useState, useEffect, useRef } from 'react';

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

export default function AttackSimulator() {
  const [attackType, setAttackType] = useState<'ddos' | 'mitm'>('ddos');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [packets, setPackets] = useState<Packet[]>([]);
  const animationFrameRef = useRef<number>();
  const lastPacketTimeRef = useRef(0);

  // Initialize simulation
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

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      // Create new packets
      if (timestamp - lastPacketTimeRef.current > (1000 / speed)) {
        lastPacketTimeRef.current = timestamp;
        
        if (attackType === 'ddos') {
            // Create legitimate packets
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

            // Create attack packets
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
        } else { // MITM
            const client = nodes.find(n => n.type === 'client')!;
            const server = nodes.find(n => n.type === 'server')!;
            const attacker = nodes.find(n => n.type === 'attacker')!;

            if (Math.random() < 0.3) {
              // Client to attacker
              setPackets(prev => [...prev, {
                id: Math.random().toString(),
                from: client,
                to: attacker,
                x: client.x,
                y: client.y,
                type: 'normal'
              }]);

              // Attacker to server (modified packet)
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

      // Update packet positions
      setPackets(prev => {
        const speed = 5;
        return prev
          .map(packet => {
            const dx = packet.to.x - packet.x;
            const dy = packet.to.y - packet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < speed) {
              // Packet reached destination
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
    <div className="bg-zinc-900 rounded-lg p-6 mt-12">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              attackType === 'ddos'
                ? 'bg-red-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            onClick={() => setAttackType('ddos')}
          >
            Ataque DDoS
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              attackType === 'mitm'
                ? 'bg-red-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            onClick={() => setAttackType('mitm')}
          >
            Man-in-the-Middle
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-zinc-400">Velocidade:</label>
            <select
              className="bg-zinc-800 text-zinc-400 rounded px-2 py-1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              isPlaying
                ? 'bg-red-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Parar' : 'Iniciar'} Simulação
          </button>
        </div>
      </div>

      {/* Simulation Canvas */}
      <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
        {/* Connection Lines */}
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
                  stroke="#1f2937"
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
              stroke="#1f2937"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full shadow-lg ${
              node.type === 'server'
                ? 'bg-blue-500 shadow-blue-500/50'
                : node.type === 'attacker'
                ? 'bg-red-500 shadow-red-500/50'
                : 'bg-emerald-500 shadow-emerald-500/50'
            } ${
              node.status === 'overloaded'
                ? 'animate-pulse'
                : node.status === 'compromised'
                ? 'ring-4 ring-red-500 ring-opacity-50'
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

        {/* Packets */}
        {packets.map((packet) => (
          <div
            key={packet.id}
            className={`absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg ${
              packet.type === 'normal'
                ? 'bg-emerald-500 shadow-emerald-500/50'
                : 'bg-red-500 shadow-red-500/50'
            } transition-transform duration-75`}
            style={{
              left: packet.x,
              top: packet.y,
              zIndex: 20,
              transform: `translate(-50%, -50%) scale(${Math.random() * 0.3 + 0.7})`,
            }}
          >
              <div className={`absolute inset-0 rounded-full ${
                packet.type === 'normal'
                  ? 'bg-emerald-400'
                  : 'bg-red-400'
              } animate-ping`} />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          {attackType === 'ddos' ? 'Simulação de Ataque DDoS' : 'Simulação de Ataque Man-in-the-Middle'}
        </h3>
        <p className="text-zinc-400">
          {attackType === 'ddos'
            ? 'Esta simulação mostra como múltiplos atacantes sobrecarregam um servidor com tráfego malicioso, dificultando o acesso de usuários legítimos ao serviço. O servidor fica sobrecarregado ao receber muitas requisições.'
            : 'Esta simulação demonstra como um atacante pode interceptar a comunicação entre cliente e servidor se posicionando no meio da conexão. O atacante pode ler e modificar os dados transmitidos.'}
        </p>
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-zinc-400">Tráfego Legítimo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-zinc-400">Tráfego Malicioso</span>
          </div>
        </div>
      </div>
    </div>
  );
}