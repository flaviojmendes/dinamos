import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ComponentTile {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const components: ComponentTile[] = [
  {
    title: 'Bancos de Dados',
    description: 'SQL, NoSQL, Sharding e Replicação',
    path: '/componentes/banco-dados',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm8 13v-6m-4 2l4 4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Cache',
    description: 'Estratégias e sistemas de cache',
    path: '/componentes/cache',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Load Balancer',
    description: 'Distribuição de carga entre servidores',
    path: '/componentes/load-balancer',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Message Queue',
    description: 'Comunicação assíncrona entre sistemas',
    path: '/componentes/message-queue',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: 'CDN',
    description: 'Rede de distribuição de conteúdo',
    path: '/componentes/cdn',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: 'API Gateway',
    description: 'Intermediário entre clientes e serviços',
    path: '/componentes/api-gateway',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function SystemComponents() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Componentes de um Sistema Distribuído
        </h1>
        <p className="text-xl text-zinc-300">
          Explore os principais componentes que formam a base de sistemas distribuídos modernos.
          Cada componente tem seu papel específico e trabalha em conjunto para criar sistemas
          escaláveis, resilientes e eficientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <div
            key={component.path}
            onClick={() => navigate(component.path)}
            className="bg-zinc-900 rounded-lg p-6 transition-all duration-200 transform hover:scale-105 hover:bg-zinc-800 cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                {component.icon}
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-white">
                {component.title}
              </h2>
            </div>
            <p className="text-zinc-400 group-hover:text-zinc-300">
              {component.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 