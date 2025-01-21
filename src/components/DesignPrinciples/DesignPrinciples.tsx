import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PrincipleTile {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const principles: PrincipleTile[] = [
  {
    title: 'Desenvolvimento Orientado a Eventos',
    description: 'Event Sourcing e sistemas de eventos distribuídos',
    path: '/principios-design/eventos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
  },
  {
    title: 'Design Orientado a Serviços',
    description: 'Microsserviços vs Arquitetura Monolítica',
    path: '/principios-design/servicos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    title: 'Tolerância a Falhas',
    description: 'Retries, Circuit Breakers, Timeout e Fallback',
    path: '/principios-design/tolerancia-falhas',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    title: 'Design para Escalabilidade',
    description: 'Escalabilidade horizontal e vertical',
    path: '/principios-design/escalabilidade',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    title: 'Alta Disponibilidade',
    description: 'Zonas de disponibilidade e replicação',
    path: '/principios-design/disponibilidade',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DesignPrinciples() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Princípios de Design
        </h1>
        <p className="text-xl text-zinc-300">
          Explore os princípios fundamentais que orientam a criação de sistemas distribuídos 
          escaláveis, resilientes e eficientes. Cada princípio aborda aspectos cruciais 
          do design de sistemas modernos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((principle) => (
          <div
            key={principle.path}
            onClick={() => navigate(principle.path)}
            className="bg-zinc-900 rounded-lg p-6 transition-all duration-200 transform hover:scale-105 hover:bg-zinc-800 cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                {principle.icon}
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-white">
                {principle.title}
              </h2>
            </div>
            <p className="text-zinc-400 group-hover:text-zinc-300">
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 