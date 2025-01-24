import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Module {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  dependencies?: string[];
  details: {
    deployment: string;
    communication: string;
    database: string;
    scaling: string;
    development: string;
    maintenance: string;
  };
}

interface Architecture {
  type: 'monolithic' | 'modular' | 'microservices';
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  example: string;
  modules: Module[];
}

const architectures: Architecture[] = [
  {
    type: 'monolithic',
    name: 'Monolito',
    description: 'Todas as funcionalidades em um único código base, com acoplamento forte entre módulos.',
    advantages: [
      'Simplicidade de desenvolvimento inicial',
      'Menos sobrecarga em comunicação entre componentes',
      'Deploy único e simples',
      'Mais fácil de testar end-to-end',
      'Compartilhamento de recursos eficiente'
    ],
    disadvantages: [
      'Difícil de escalar partes específicas do sistema',
      'Qualquer mudança exige redistribuição completa',
      'Pode se tornar complexo com o crescimento',
      'Alto acoplamento entre módulos',
      'Difícil manutenção em times grandes'
    ],
    example: 'Um aplicativo simples de e-commerce onde todas as funcionalidades (catálogo de produtos, gerenciamento de usuários, processamento de pedidos) estão em um único código base.',
    modules: [
      {
        id: 'auth',
        name: 'Autenticação',
        color: 'bg-purple-500',
        x: 50,
        y: 20,
        dependencies: ['orders', 'users'],
        details: {
          deployment: 'Deploy único para toda a aplicação',
          communication: 'Chamadas de função diretas',
          database: 'Banco de dados compartilhado',
          scaling: 'Escala vertical (toda a aplicação)',
          development: 'Desenvolvimento mais simples inicialmente',
          maintenance: 'Pode se tornar complexo com o crescimento'
        }
      },
      {
        id: 'orders',
        name: 'Pedidos',
        color: 'bg-blue-500',
        x: 30,
        y: 70,
        dependencies: ['users'],
        details: {
          deployment: 'Deploy único para toda a aplicação',
          communication: 'Chamadas de função diretas',
          database: 'Banco de dados compartilhado',
          scaling: 'Escala vertical (toda a aplicação)',
          development: 'Desenvolvimento mais simples inicialmente',
          maintenance: 'Pode se tornar complexo com o crescimento'
        }
      },
      {
        id: 'users',
        name: 'Usuários',
        color: 'bg-green-500',
        x: 70,
        y: 70,
        details: {
          deployment: 'Deploy único para toda a aplicação',
          communication: 'Chamadas de função diretas',
          database: 'Banco de dados compartilhado',
          scaling: 'Escala vertical (toda a aplicação)',
          development: 'Desenvolvimento mais simples inicialmente',
          maintenance: 'Pode se tornar complexo com o crescimento'
        }
      }
    ]
  },
  {
    type: 'modular',
    name: 'Monolito Modular',
    description: 'Código organizado em módulos bem definidos com limites claros, mas ainda em um único deploy.',
    advantages: [
      'Código bem organizado e modular com limites claros',
      'Facilidade de migração para microsserviços no futuro',
      'Menor complexidade operacional que microsserviços',
      'Bom equilíbrio entre simplicidade e organização',
      'Permite evolução gradual da arquitetura'
    ],
    disadvantages: [
      'Ainda requer disciplina para manter os limites entre módulos',
      'Escalabilidade ainda limitada por ser uma única unidade',
      'Necessidade de coordenação entre times',
      'Pode haver tentação de quebrar os limites dos módulos',
      'Deploy ainda é acoplado'
    ],
    example: 'Um e-commerce onde o código é dividido em módulos independentes (catálogo, pedidos, usuários), cada um com suas próprias regras de negócio e dados, mas todos são implantados juntos como uma única aplicação.',
    modules: [
      {
        id: 'auth',
        name: 'Módulo de Autenticação',
        color: 'bg-purple-500',
        x: 50,
        y: 25,
        dependencies: ['orders', 'users'],
        details: {
          deployment: 'Deploy único, mas módulos independentes',
          communication: 'Interfaces bem definidas',
          database: 'Schema separado no banco compartilhado',
          scaling: 'Escala com a aplicação',
          development: 'Organizado e modular',
          maintenance: 'Mais fácil de manter que monolito'
        }
      },
      {
        id: 'orders',
        name: 'Módulo de Pedidos',
        color: 'bg-blue-500',
        x: 25,
        y: 60,
        dependencies: ['users'],
        details: {
          deployment: 'Deploy único, mas módulos independentes',
          communication: 'Interfaces bem definidas',
          database: 'Schema separado no banco compartilhado',
          scaling: 'Escala com a aplicação',
          development: 'Organizado e modular',
          maintenance: 'Mais fácil de manter que monolito'
        }
      },
      {
        id: 'users',
        name: 'Módulo de Usuários',
        color: 'bg-green-500',
        x: 75,
        y: 60,
        details: {
          deployment: 'Deploy único, mas módulos independentes',
          communication: 'Interfaces bem definidas',
          database: 'Schema separado no banco compartilhado',
          scaling: 'Escala com a aplicação',
          development: 'Organizado e modular',
          maintenance: 'Mais fácil de manter que monolito'
        }
      }
    ]
  },
  {
    type: 'microservices',
    name: 'Microsserviços',
    description: 'Serviços independentes que se comunicam via rede, cada um com seu próprio deploy e banco de dados.',
    advantages: [
      'Flexibilidade para escalar partes específicas do sistema',
      'Maior modularidade e facilidade de manutenção',
      'Cada equipe pode se concentrar em um único serviço',
      'Liberdade de escolha tecnológica por serviço',
      'Deploy independente e mais rápido'
    ],
    disadvantages: [
      'Complexidade aumentada na orquestração',
      'Requer infraestrutura robusta',
      'Desafios de consistência de dados',
      'Maior latência na comunicação',
      'Custos operacionais mais altos'
    ],
    example: 'Um aplicativo de e-commerce onde o serviço de pagamento, inventário e gerenciamento de usuários são todos implementados como microsserviços separados.',
    modules: [
      {
        id: 'auth',
        name: 'Auth Service',
        color: 'bg-purple-500',
        x: 50,
        y: 25,
        dependencies: ['orders', 'users'],
        details: {
          deployment: 'Deploy independente',
          communication: 'API REST/gRPC',
          database: 'Banco de dados próprio',
          scaling: 'Escala independentemente',
          development: 'Time dedicado',
          maintenance: 'Totalmente independente'
        }
      },
      {
        id: 'orders',
        name: 'Orders Service',
        color: 'bg-blue-500',
        x: 25,
        y: 60,
        dependencies: ['users'],
        details: {
          deployment: 'Deploy independente',
          communication: 'API REST/gRPC',
          database: 'Banco de dados próprio',
          scaling: 'Escala independentemente',
          development: 'Time dedicado',
          maintenance: 'Totalmente independente'
        }
      },
      {
        id: 'users',
        name: 'Users Service',
        color: 'bg-green-500',
        x: 75,
        y: 60,
        details: {
          deployment: 'Deploy independente',
          communication: 'API REST/gRPC',
          database: 'Banco de dados próprio',
          scaling: 'Escala independentemente',
          development: 'Time dedicado',
          maintenance: 'Totalmente independente'
        }
      }
    ]
  }
];

const DiagramModule: React.FC<{
  module: Module;
  isHighlighted: boolean;
  onHover: (id: string | null) => void;
  containerWidth: number;
  containerHeight: number;
}> = ({ module, isHighlighted, onHover, containerWidth, containerHeight }) => {
  // Calculate responsive positions
  const position = {
    x: (containerWidth * module.x) / 100,
    y: (containerHeight * module.y) / 100,
  };

  return (
    <motion.div
      className={`absolute p-4 rounded-lg shadow-lg ${module.color} bg-opacity-10 border-2 border-opacity-20 ${module.color.replace('bg-', 'border-')} ${
        !isHighlighted ? 'opacity-50' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: containerWidth < 640 ? '160px' : '240px',
        maxWidth: '90%'
      }}
      onMouseEnter={() => onHover(module.id)}
      onMouseLeave={() => onHover(null)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="text-lg font-semibold mb-2">{module.name}</h4>
      <div className="text-sm space-y-1">
        <div><strong>Deploy:</strong> {module.details.deployment}</div>
        <div><strong>Comunicação:</strong> {module.details.communication}</div>
        <div><strong>Banco:</strong> {module.details.database}</div>
      </div>
    </motion.div>
  );
};

const DiagramConnector: React.FC<{
  from: Module;
  to: Module;
  type: 'monolithic' | 'modular' | 'microservices';
  isHighlighted: boolean;
  containerWidth: number;
  containerHeight: number;
}> = ({ from, to, type, isHighlighted, containerWidth, containerHeight }) => {
  // Calculate responsive positions
  const startX = (containerWidth * from.x) / 100;
  const startY = (containerHeight * from.y) / 100;
  const endX = (containerWidth * to.x) / 100;
  const endY = (containerHeight * to.y) / 100;

  const strokeDasharray = type === 'microservices' ? '5,5' : 'none';
  const markerEnd = type === 'modular' ? 'url(#arrow)' : '';

  return (
    <line
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke={isHighlighted ? '#60A5FA' : '#666'}
      strokeWidth={2}
      strokeDasharray={strokeDasharray}
      markerEnd={markerEnd}
      className="transition-all duration-200"
      style={{
        opacity: isHighlighted ? 1 : 0.3
      }}
    />
  );
};

const ResponsiveDiagram: React.FC<{
  architecture: Architecture;
  hoveredModule: string | null;
  onHover: (id: string | null) => void;
}> = ({ architecture, hoveredModule, onHover }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '500px' }}>
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#666" />
          </marker>
        </defs>

        {dimensions.width > 0 && dimensions.height > 0 && architecture.modules.map(module =>
          module.dependencies?.map(depId => {
            const depModule = architecture.modules.find(m => m.id === depId);
            if (!depModule) return null;

            const isHighlighted = hoveredModule === module.id || hoveredModule === depId;

            return (
              <DiagramConnector
                key={`${module.id}-${depId}`}
                from={module}
                to={depModule}
                type={architecture.type}
                isHighlighted={isHighlighted}
                containerWidth={dimensions.width}
                containerHeight={dimensions.height}
              />
            );
          })
        )}
      </svg>

      {dimensions.width > 0 && dimensions.height > 0 && architecture.modules.map(module => (
        <DiagramModule
          key={module.id}
          module={module}
          isHighlighted={Boolean(
            !hoveredModule ||
            hoveredModule === module.id ||
            module.dependencies?.includes(hoveredModule) ||
            architecture.modules
              .find(m => m.id === hoveredModule)
              ?.dependencies?.includes(module.id)
          )}
          onHover={onHover}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      ))}
    </div>
  );
};

export default function ServiceOriented() {
  const [selectedArch, setSelectedArch] = useState<Architecture>(architectures[0]);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Design Orientado a Serviços
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-300 mb-12"
        >
          Explore as diferentes abordagens de organização de serviços e suas implicações práticas.
          Cada arquitetura tem seus próprios trade-offs e casos de uso ideais.
        </motion.p>
      </div>

      {/* Architecture Selection */}
      <div className="flex gap-4 mb-12">
        {architectures.map(arch => (
          <motion.button
            key={arch.type}
            onClick={() => setSelectedArch(arch)}
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedArch.type === arch.type
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {arch.name}
          </motion.button>
        ))}
      </div>

      {/* Architecture Content */}
      <motion.div
        key={selectedArch.type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-12"
      >
        {/* Description Section */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{selectedArch.name}</h2>
          <p className="text-zinc-300 mb-8">{selectedArch.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Advantages */}
            <div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-4">Vantagens</h3>
              <ul className="space-y-2">
                {selectedArch.advantages.map((advantage, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-zinc-300"
                  >
                    <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {advantage}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Disadvantages */}
            <div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-4">Desvantagens</h3>
              <ul className="space-y-2">
                {selectedArch.disadvantages.map((disadvantage, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-zinc-300"
                  >
                    <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {disadvantage}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Example */}
          <div className="mt-8 p-4 bg-zinc-900 rounded-lg">
            <h4 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo Prático</h4>
            <p className="text-zinc-400">{selectedArch.example}</p>
          </div>
        </div>

        {/* Diagram */}
        <div className="relative bg-zinc-900/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-zinc-200">Visualização da Arquitetura</h3>
          
          <ResponsiveDiagram
            architecture={selectedArch}
            hoveredModule={hoveredModule}
            onHover={setHoveredModule}
          />

          {/* Legend */}
          <div className="mt-20 flex justify-center gap-8 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[2px] bg-zinc-400"></div>
              {selectedArch.type === 'monolithic' && 'Chamada direta'}
              {selectedArch.type === 'modular' && 'Interface'}
              {selectedArch.type === 'microservices' && 'API/Eventos'}
            </div>
          </div>
        </div>
      </motion.div>

      
    </div>
  );
} 