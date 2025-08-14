import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SynchronizationFundamentals() {
  const { t } = useTranslation();
  const philosopherNames = t('design_principles.synchronization_fundamentals.philosophers', { returnObjects: true }) as string[];
  const statuses = t('design_principles.synchronization_fundamentals.statuses', { returnObjects: true }) as Record<string, string>;

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
          {t('design_principles.synchronization_fundamentals.title')}
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          {t('design_principles.synchronization_fundamentals.intro_p1')}
        </p>
        <p className="text-lg text-zinc-300 mb-6">
          {t('design_principles.synchronization_fundamentals.intro_p2')}
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">{t('design_principles.synchronization_fundamentals.key_concept_label')}</strong>
          {t('design_principles.synchronization_fundamentals.key_concept_text')}
        </div>

        {/* Static Illustration */}
        <div className="mt-8 mb-8">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{t('design_principles.synchronization_fundamentals.illustration_title')}</h3>
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
                  const names = philosopherNames;
                  
                  // Clearly defined states for philosophers
                  const states = ["thinking", "eating", "hungry", "waiting", "eating"] as const;
                  const state = states[i];
                  
                  let fillColor;
                  let borderColor;
                  let statusLabel;
                  
                  if (state === "thinking") {
                    fillColor = "#3b82f6";
                    borderColor = "#2563eb";
                    statusLabel = statuses.thinking;
                  } else if (state === "eating") {
                    fillColor = "#22c55e";
                    borderColor = "#16a34a";
                    statusLabel = statuses.eating;
                  } else if (state === "hungry") {
                    fillColor = "#eab308";
                    borderColor = "#ca8a04";
                    statusLabel = statuses.hungry;
                  } else { // waiting
                    fillColor = "#94a3b8";
                    borderColor = "#64748b";
                    statusLabel = statuses.waiting;
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
                  {t('design_principles.synchronization_fundamentals.dining_title')}
                </text>
                
                {/* Legend */}
                <g transform="translate(470, 380)">
                  <rect x="0" y="0" width="110" height="60" rx="5" fill="rgba(15, 23, 42, 0.8)" stroke="#334155" strokeWidth="1" />
                  
                  {/* Legend items */}
                  <circle cx="15" cy="15" r="8" fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2" />
                  <text x="30" y="19" fill="white" fontSize="12" fontWeight="normal">{t('design_principles.synchronization_fundamentals.legend.thinking')}</text>
                  
                  <circle cx="15" cy="38" r="8" fill="#22c55e" fillOpacity="0.2" stroke="#16a34a" strokeWidth="2" />
                  <text x="30" y="42" fill="white" fontSize="12" fontWeight="normal">{t('design_principles.synchronization_fundamentals.legend.eating')}</text>
                </g>
              </svg>
            </div>
            <p className="text-zinc-300 text-center mt-4">
              {t('design_principles.synchronization_fundamentals.illustration_caption')}
            </p>
          </div>
          
          <div className="mt-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">{t('design_principles.synchronization_fundamentals.strategies_title')}</h3>
            <ul className="text-zinc-300 space-y-2 text-sm">
              <li><strong className="text-blue-300">{t('design_principles.synchronization_fundamentals.strategies.naive').split(':')[0]}:</strong> {t('design_principles.synchronization_fundamentals.strategies.naive').split(':').slice(1).join(':').trim()}</li>
              <li><strong className="text-blue-300">{t('design_principles.synchronization_fundamentals.strategies.ordered').split(':')[0]}:</strong> {t('design_principles.synchronization_fundamentals.strategies.ordered').split(':').slice(1).join(':').trim()}</li>
              <li><strong className="text-blue-300">{t('design_principles.synchronization_fundamentals.strategies.waiter').split(':')[0]}:</strong> {t('design_principles.synchronization_fundamentals.strategies.waiter').split(':').slice(1).join(':').trim()}</li>
            </ul>
          </div>
        </div>
        
        {/* Significance and Applications */}
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">{t('design_principles.synchronization_fundamentals.significance_title')}</h3>
            <div className="space-y-4">
              <p className="text-zinc-300">
                {t('design_principles.synchronization_fundamentals.significance_p1')}
              </p>
              <p className="text-zinc-300">
                {t('design_principles.synchronization_fundamentals.significance_p2')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <h4 className="text-purple-300 font-medium mb-2">{t('design_principles.synchronization_fundamentals.analogy_title')}</h4>
                  <ul className="space-y-2 text-zinc-300">
                    {(t('design_principles.synchronization_fundamentals.analogy_points', { returnObjects: true }) as string[]).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <h4 className="text-blue-300 font-medium mb-2">{t('design_principles.synchronization_fundamentals.modern_challenges_title')}</h4>
                  <ul className="space-y-2 text-zinc-300">
                    {(t('design_principles.synchronization_fundamentals.modern_challenges', { returnObjects: true }) as string[]).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
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
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.synchronization_fundamentals.problem_section.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">{t('design_principles.synchronization_fundamentals.problem_section.scenario_title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.problem_section.items.philosophers')}</span>
                    <p className="text-zinc-400">{t('design_principles.synchronization_fundamentals.problem_section.items.round_table')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.problem_section.items.forks')}</span>
                    <p className="text-zinc-400">{t('design_principles.synchronization_fundamentals.problem_section.items.forks_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.problem_section.items.plate')}</span>
                    <p className="text-zinc-400">{t('design_principles.synchronization_fundamentals.problem_section.items.plate_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">{t('design_principles.synchronization_fundamentals.problem_section.rules_title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.problem_section.rules.two_forks')}</span>
                    <p className="text-zinc-400">{t('design_principles.synchronization_fundamentals.problem_section.rules.two_forks_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.problem_section.rules.one_fork_time')}</span>
                    <p className="text-zinc-400">{t('design_principles.synchronization_fundamentals.problem_section.rules.one_fork_time_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.problem_section.rules.finite_time')}</span>
                    <p className="text-zinc-400">{t('design_principles.synchronization_fundamentals.problem_section.rules.finite_time_desc')}</p>
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
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.synchronization_fundamentals.challenges.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-400">{t('design_principles.synchronization_fundamentals.challenges.deadlock_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.synchronization_fundamentals.challenges.deadlock_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                {t('design_principles.synchronization_fundamentals.challenges.deadlock_badges.circular_wait')}
              </span>
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                {t('design_principles.synchronization_fundamentals.challenges.deadlock_badges.infinite_wait')}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t('design_principles.synchronization_fundamentals.challenges.starvation_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.synchronization_fundamentals.challenges.starvation_p')}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                {t('design_principles.synchronization_fundamentals.challenges.starvation_badges.starvation')}
              </span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                {t('design_principles.synchronization_fundamentals.challenges.starvation_badges.unfairness')}
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
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.synchronization_fundamentals.solutions.title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">{t('design_principles.synchronization_fundamentals.solutions.deadlock_prevention_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.solutions.fork_ordering_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.synchronization_fundamentals.solutions.fork_ordering_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.solutions.timeout_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.synchronization_fundamentals.solutions.timeout_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">{t('design_principles.synchronization_fundamentals.solutions.starvation_prevention_title')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.solutions.priority_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.synchronization_fundamentals.solutions.priority_desc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">{t('design_principles.synchronization_fundamentals.solutions.fairness_label')}</span>
                    <p className="text-zinc-400 text-sm">{t('design_principles.synchronization_fundamentals.solutions.fairness_desc')}</p>
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