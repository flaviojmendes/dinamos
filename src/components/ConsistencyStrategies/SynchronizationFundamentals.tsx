import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SynchronizationFundamentals() {
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
          Fundamentos da Sincronização
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          O problema do Jantar dos Filósofos é um exemplo clássico que ilustra os desafios fundamentais
          da sincronização em sistemas distribuídos. Vamos explorar como ele nos ajuda a entender
          conceitos importantes como exclusão mútua, deadlocks e starvation.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          O Jantar dos Filósofos foi proposto por Edsger Dijkstra em 1965 e continua sendo uma excelente
          ferramenta para entender os desafios de sincronização em sistemas distribuídos modernos.
        </div>

        {/* Static Illustration */}
        <div className="mt-8 mb-8">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Ilustração do Problema</h3>
            <div className="relative w-full max-w-2xl mx-auto">
              <svg viewBox="0 0 600 450" className="w-full h-auto">
                {/* Background */}
                <defs>
                  <radialGradient id="tableGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </radialGradient>
                  <pattern id="woodPattern" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="rotate(45)">
                    <rect width="100" height="100" fill="#d4a76a" />
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#c49a6c" strokeWidth="10" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#b58b5d" strokeWidth="8" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="#c49a6c" strokeWidth="12" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="#b58b5d" strokeWidth="6" />
                    <line x1="0" y1="80" x2="100" y2="80" stroke="#c49a6c" strokeWidth="14" />
                  </pattern>
                  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Table */}
                <circle cx="300" cy="225" r="170" fill="url(#woodPattern)" stroke="#a0522d" strokeWidth="2" />
                <circle cx="300" cy="225" r="70" fill="#b58b5d" stroke="#a0522d" strokeWidth="1" />
                
                {/* Forks - Draw first to be behind philosophers */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = (i * 2 * Math.PI) / 5;
                  // Position forks between philosophers
                  const midAngle = angle + Math.PI / 5;
                  const x = 300 + Math.cos(midAngle) * 110;
                  const y = 225 + Math.sin(midAngle) * 110;
                  const rotation = (midAngle * 180 / Math.PI) - 90;
                  
                  // Different states for forks
                  const inUse = i === 0 || i === 3; // Forks 0 and 3 are in use
                  
                  return (
                    <g key={`fork-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
                      {/* Fork handle */}
                      <rect 
                        x="-3" 
                        y="0" 
                        width="6" 
                        height="25" 
                        rx="2" 
                        fill={inUse ? "#94a3b8" : "#64748b"} 
                        stroke={inUse ? "#94a3b8" : "#475569"} 
                        strokeWidth="1" 
                        filter={inUse ? "url(#glow)" : ""}
                      />
                      
                      {/* Fork head */}
                      <path 
                        d="M -8 0 L 8 0 L 8 -5 L -8 -5 Z" 
                        fill={inUse ? "#94a3b8" : "#64748b"} 
                        stroke={inUse ? "#94a3b8" : "#475569"} 
                        strokeWidth="1" 
                      />
                      
                      {/* Fork prongs */}
                      <path 
                        d="M -6 -5 L -6 -15 M -2 -5 L -2 -18 M 2 -5 L 2 -18 M 6 -5 L 6 -15" 
                        fill="none" 
                        stroke={inUse ? "#94a3b8" : "#64748b"} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                      />
                      
                      {/* Fork number */}
                      <text 
                        x="0" 
                        y="20" 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="10" 
                        fontWeight="bold"
                      >
                        {i+1}
                      </text>
                    </g>
                  );
                })}
                
                {/* Philosophers */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = (i * 2 * Math.PI) / 5;
                  const x = 300 + Math.cos(angle) * 130;
                  const y = 225 + Math.sin(angle) * 130;
                  const names = ['Platão', 'Aristóteles', 'Kant', 'Sócrates', 'Descartes'];
                  
                  // Clearly defined states for philosophers
                  const states = ["thinking", "eating", "hungry", "waiting", "eating"];
                  const state = states[i];
                  
                  let fillColor;
                  let borderColor;
                  let statusLabel;
                  
                  if (state === "thinking") {
                    fillColor = "#3b82f6";
                    borderColor = "#2563eb";
                    statusLabel = "Pensando";
                  } else if (state === "eating") {
                    fillColor = "#22c55e";
                    borderColor = "#16a34a";
                    statusLabel = "Comendo";
                  } else if (state === "hungry") {
                    fillColor = "#eab308";
                    borderColor = "#ca8a04";
                    statusLabel = "Com fome";
                  } else { // waiting
                    fillColor = "#94a3b8";
                    borderColor = "#64748b";
                    statusLabel = "Esperando";
                  }
                  
                  return (
                    <g key={`philosopher-${i}`}>
                      {/* Bowl */}
                      <ellipse 
                        cx={x} 
                        cy={y+25} 
                        rx="20" 
                        ry="8" 
                        fill="#475569" 
                        stroke="#334155" 
                        strokeWidth="1" 
                      />
                      
                      {/* Philosopher */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="24" 
                        fill={fillColor} 
                        fillOpacity="0.2" 
                        stroke={borderColor} 
                        strokeWidth="3" 
                      />
                      
                      {/* State indicator - thought bubble for thinking */}
                      {state === "thinking" && (
                        <g>
                          <circle cx={x} cy={y-30} r="8" fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1" />
                          <circle cx={x-10} cy={y-20} r="5" fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1" />
                          <circle cx={x-5} cy={y-10} r="3" fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1" />
                        </g>
                      )}
                      
                      {/* State indicator - spaghetti for eating */}
                      {state === "eating" && (
                        <g>
                          {[...Array(5)].map((_, j) => (
                            <path 
                              key={`spaghetti-${i}-${j}`} 
                              d={`M ${x-15+j*7} ${y+23} q ${4-j*2} ${-10+j*2} ${8-j*1} ${-5} q ${3+j*1} ${5-j*1} ${7+j*1} ${0}`} 
                              fill="none" 
                              stroke="#f1f5f9" 
                              strokeWidth="1.5" 
                              strokeOpacity={state === "eating" ? "1" : "0.5"} 
                            />
                          ))}
                          <path d="M -4,0 A 4,4 0 0 1 4,0" fill="none" stroke="#f1f5f9" strokeWidth="1.5" transform={`translate(${x},${y+5})`} />
                        </g>
                      )}
                      
                      {/* State indicator - exclamation for hungry */}
                      {state === "hungry" && (
                        <g>
                          <circle cx={x} cy={y-25} r="9" fill="#eab308" fillOpacity="0.2" stroke="#ca8a04" strokeWidth="1.5" />
                          <text x={x} y={y-22} textAnchor="middle" fill="#eab308" fontSize="14" fontWeight="bold">!</text>
                        </g>
                      )}
                      
                      {/* State indicator - hourglass for waiting */}
                      {state === "waiting" && (
                        <g>
                          <path d="M -5,-5 L 5,-5 L -5,5 L 5,5 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" transform={`translate(${x},${y-25})`} />
                        </g>
                      )}
                      
                      {/* Icon inside philosopher */}
                      <text 
                        x={x} 
                        y={y+5} 
                        textAnchor="middle" 
                        fontSize="18"
                        fontWeight="bold"
                        fill="white"
                      >
                        {state === "thinking" ? "🤔" : state === "eating" ? "😋" : state === "hungry" ? "😮" : "⏳"}
                      </text>
                      
                      {/* Philosopher name */}
                      <text 
                        x={x} 
                        y={y+50} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="14" 
                        fontWeight="medium"
                      >
                        {names[i]}
                      </text>
                      
                      {/* State label */}
                      <rect 
                        x={x-30} 
                        y={y-50} 
                        width="60" 
                        height="20" 
                        rx="4" 
                        fill={fillColor} 
                        fillOpacity="0.2" 
                        stroke={borderColor} 
                        strokeWidth="1" 
                      />
                      <text 
                        x={x} 
                        y={y-37} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="10" 
                        fontWeight="medium"
                      >
                        {statusLabel}
                      </text>
                    </g>
                  );
                })}
                
                {/* Title */}
                <text x="300" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
                  O Jantar dos Filósofos
                </text>
                
                {/* Legend */}
                <g transform="translate(470, 380)">
                  <rect x="0" y="0" width="110" height="60" rx="5" fill="rgba(15, 23, 42, 0.8)" stroke="#334155" strokeWidth="1" />
                  
                  {/* Legend items */}
                  <circle cx="15" cy="15" r="8" fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2" />
                  <text x="30" y="19" fill="white" fontSize="12" fontWeight="normal">Pensando</text>
                  
                  <circle cx="15" cy="38" r="8" fill="#22c55e" fillOpacity="0.2" stroke="#16a34a" strokeWidth="2" />
                  <text x="30" y="42" fill="white" fontSize="12" fontWeight="normal">Comendo</text>
                </g>
              </svg>
            </div>
            <p className="text-zinc-300 text-center mt-4">
              Cinco filósofos sentados em uma mesa redonda, cada um com um prato de macarrão e um garfo entre cada par de filósofos.
              Para comer, um filósofo precisa pegar dois garfos adjacentes, mas há apenas cinco garfos no total.
            </p>
          </div>
          
          <div className="mt-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Estratégias de Sincronização</h3>
            <ul className="text-zinc-300 space-y-2 text-sm">
              <li><strong className="text-blue-300">Naive:</strong> Filósofos simplesmente tentam pegar o garfo da esquerda e depois o da direita. Facilmente gera deadlock.</li>
              <li><strong className="text-blue-300">Ordenada:</strong> Filósofos sempre pegam o garfo de menor número primeiro, prevenindo deadlocks.</li>
              <li><strong className="text-blue-300">Garçom:</strong> Um "garçom" garante que apenas um filósofo por vez possa tentar pegar ambos os garfos.</li>
            </ul>
          </div>
        </div>

        {/* Significance and Applications */}
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Significado e Aplicações</h3>
            <div className="space-y-4">
              <p className="text-zinc-300">
                O problema do Jantar dos Filósofos é mais do que um exercício acadêmico - é um modelo que representa
                desafios reais em sistemas distribuídos modernos. Cada filósofo representa um processo ou thread que
                precisa acessar recursos compartilhados (os garfos) de forma segura e eficiente.
              </p>
              <p className="text-zinc-300">
                Em sistemas reais, este problema se manifesta em diversos cenários: bancos de dados distribuídos
                gerenciando transações concorrentes, sistemas de arquivos distribuídos controlando acesso a
                recursos compartilhados, ou redes de sensores coordenando a coleta de dados. A solução deste
                problema é fundamental para garantir a confiabilidade e eficiência de sistemas distribuídos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <h4 className="text-purple-300 font-medium mb-2">Analogia com Sistemas Reais</h4>
                  <ul className="space-y-2 text-zinc-300">
                    <li>• Filósofos = Processos/Threads</li>
                    <li>• Garfos = Recursos Compartilhados</li>
                    <li>• Comer = Execução de Operações Críticas</li>
                    <li>• Pensar = Processamento Independente</li>
                  </ul>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <h4 className="text-blue-300 font-medium mb-2">Desafios Modernos</h4>
                  <ul className="space-y-2 text-zinc-300">
                    <li>• Escalabilidade em Sistemas Distribuídos</li>
                    <li>• Tolerância a Falhas</li>
                    <li>• Balanceamento de Carga</li>
                    <li>• Garantia de Justiça no Acesso</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Problem Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">O Problema</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Cenário</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">5 Filósofos</span>
                    <p className="text-zinc-400">Sentados em uma mesa redonda</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">5 Garfos</span>
                    <p className="text-zinc-400">Um entre cada par de filósofos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">1 Prato</span>
                    <p className="text-zinc-400">De macarrão para cada filósofo</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Regras</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">2 Garfos</span>
                    <p className="text-zinc-400">Necessários para comer</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">1 Garfo</span>
                    <p className="text-zinc-400">Por vez por filósofo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Tempo Finito</span>
                    <p className="text-zinc-400">Para comer e pensar</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Desafios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-400">Deadlock</h3>
            <p className="text-zinc-300 mb-4">
              Se todos os filósofos pegarem o garfo da esquerda e esperarem pelo da direita,
              nenhum deles conseguirá comer.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                Bloqueio Circular
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                Espera Infinita
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Starvation</h3>
            <p className="text-zinc-300 mb-4">
              Alguns filósofos podem nunca conseguir comer se a distribuição dos garfos
              não for justa.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                Inanição
              </span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                Injustiça
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Solutions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Soluções</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Prevenção de Deadlock</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Ordem dos Garfos</span>
                    <p className="text-zinc-400 text-sm">Sempre pegar o garfo com menor número primeiro</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Timeout</span>
                    <p className="text-zinc-400 text-sm">Liberar garfos se não conseguir o segundo em tempo</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Prevenção de Starvation</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Prioridade</span>
                    <p className="text-zinc-400 text-sm">Dar prioridade a filósofos que não comeram há mais tempo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Garantia de Acesso</span>
                    <p className="text-zinc-400 text-sm">Implementar mecanismos de justiça na distribuição</p>
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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Próximos Passos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/estrategias-de-consistencia/sincronizacao/deadlocks"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-red-400">Deadlocks</h3>
            <p className="text-zinc-300 mb-4">
              Aprenda mais sobre como identificar, prevenir e resolver deadlocks em sistemas distribuídos.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                Detecção
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                Prevenção
              </span>
            </div>
          </Link>

          <Link 
            to="/estrategias-de-consistencia/sincronizacao/algoritmos"
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 hover:from-zinc-800/50 hover:to-zinc-700/30 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Algoritmos</h3>
            <p className="text-zinc-300 mb-4">
              Explore diferentes algoritmos de sincronização distribuída e suas aplicações.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                Algoritmo do Padeiro
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                Token Ring
              </span>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 