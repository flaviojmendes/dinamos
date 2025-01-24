import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  id: string;
  name: string;
  color: string;
  dependencies?: string[];
  details?: {
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
  modules: Module[];
  description: string;
}

const architectures: Architecture[] = [
  {
    type: 'monolithic',
    name: 'Monolito',
    description: 'Todas as funcionalidades em um único código base, com acoplamento forte entre módulos.',
    modules: [
      { 
        id: 'auth', 
        name: 'Autenticação', 
        color: 'bg-purple-500',
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
        id: 'catalog', 
        name: 'Catálogo', 
        color: 'bg-blue-500',
        details: {
          deployment: 'Deploy único para toda a aplicação',
          communication: 'Acesso direto a outros módulos',
          database: 'Compartilha mesmo banco de dados',
          scaling: 'Não pode escalar independentemente',
          development: 'Rápido para desenvolver features',
          maintenance: 'Mudanças afetam todo o sistema'
        }
      },
      { 
        id: 'cart', 
        name: 'Carrinho', 
        color: 'bg-green-500', 
        dependencies: ['auth', 'catalog'],
        details: {
          deployment: 'Deploy único para toda a aplicação',
          communication: 'Acesso direto aos módulos de Auth e Catálogo',
          database: 'Mesmo banco de dados',
          scaling: 'Escala com toda a aplicação',
          development: 'Fácil integração com outros módulos',
          maintenance: 'Alto acoplamento'
        }
      },
      { 
        id: 'payment', 
        name: 'Pagamento', 
        color: 'bg-yellow-500', 
        dependencies: ['auth', 'cart'],
        details: {
          deployment: 'Deploy único',
          communication: 'Chamadas síncronas diretas',
          database: 'Banco compartilhado',
          scaling: 'Escala com o todo',
          development: 'Simples para testar',
          maintenance: 'Difícil de modificar isoladamente'
        }
      },
      { 
        id: 'shipping', 
        name: 'Entrega', 
        color: 'bg-red-500', 
        dependencies: ['auth', 'cart'],
        details: {
          deployment: 'Deploy único',
          communication: 'Acesso direto a dados',
          database: 'Banco compartilhado',
          scaling: 'Não escala independentemente',
          development: 'Rápido para implementar',
          maintenance: 'Complexo para manter'
        }
      },
    ]
  },
  {
    type: 'modular',
    name: 'Monolito Modular',
    description: 'Código organizado em módulos bem definidos com limites claros, mas ainda em um único deploy.',
    modules: [
      { 
        id: 'auth', 
        name: 'Módulo de Autenticação', 
        color: 'bg-purple-500',
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
        id: 'catalog', 
        name: 'Módulo de Catálogo', 
        color: 'bg-blue-500',
        details: {
          deployment: 'Deploy único com outros módulos',
          communication: 'API interna bem definida',
          database: 'Schema isolado',
          scaling: 'Escala com o sistema',
          development: 'Independente com interfaces claras',
          maintenance: 'Baixo acoplamento com outros módulos'
        }
      },
      { 
        id: 'cart', 
        name: 'Módulo de Carrinho', 
        color: 'bg-green-500', 
        dependencies: ['auth', 'catalog'],
        details: {
          deployment: 'Deploy conjunto',
          communication: 'Interfaces entre módulos',
          database: 'Schema próprio',
          scaling: 'Vertical com aplicação',
          development: 'Limites claros com outros módulos',
          maintenance: 'Fácil de manter e evoluir'
        }
      },
      { 
        id: 'payment', 
        name: 'Módulo de Pagamento', 
        color: 'bg-yellow-500', 
        dependencies: ['auth', 'cart'],
        details: {
          deployment: 'Deploy único',
          communication: 'Interfaces bem definidas',
          database: 'Schema isolado',
          scaling: 'Com a aplicação',
          development: 'Independente com contratos claros',
          maintenance: 'Manutenção simplificada'
        }
      },
      { 
        id: 'shipping', 
        name: 'Módulo de Entrega', 
        color: 'bg-red-500', 
        dependencies: ['auth', 'cart'],
        details: {
          deployment: 'Deploy com outros módulos',
          communication: 'Interfaces internas',
          database: 'Schema próprio',
          scaling: 'Com o sistema todo',
          development: 'Módulo independente',
          maintenance: 'Fácil de manter'
        }
      },
    ]
  },
  {
    type: 'microservices',
    name: 'Microsserviços',
    description: 'Serviços independentes que se comunicam via rede, cada um com seu próprio deploy e banco de dados.',
    modules: [
      { 
        id: 'auth', 
        name: 'Auth Service', 
        color: 'bg-purple-500',
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
        id: 'catalog', 
        name: 'Catalog Service', 
        color: 'bg-blue-500',
        details: {
          deployment: 'CI/CD próprio',
          communication: 'APIs e eventos',
          database: 'Banco dedicado',
          scaling: 'Auto-scaling individual',
          development: 'Stack própria',
          maintenance: 'Independente de outros serviços'
        }
      },
      { 
        id: 'cart', 
        name: 'Cart Service', 
        color: 'bg-green-500', 
        dependencies: ['auth', 'catalog'],
        details: {
          deployment: 'Deploy automatizado próprio',
          communication: 'REST e mensageria',
          database: 'Banco NoSQL dedicado',
          scaling: 'Escala horizontalmente',
          development: 'Time e stack próprios',
          maintenance: 'Manutenção independente'
        }
      },
      { 
        id: 'payment', 
        name: 'Payment Service', 
        color: 'bg-yellow-500', 
        dependencies: ['auth', 'cart'],
        details: {
          deployment: 'Deploy independente',
          communication: 'APIs e eventos assíncronos',
          database: 'Banco próprio',
          scaling: 'Auto-scaling',
          development: 'Tecnologia específica',
          maintenance: 'Isolado de outros serviços'
        }
      },
      { 
        id: 'shipping', 
        name: 'Shipping Service', 
        color: 'bg-red-500', 
        dependencies: ['auth', 'cart'],
        details: {
          deployment: 'Pipeline próprio',
          communication: 'APIs e filas',
          database: 'Banco dedicado',
          scaling: 'Escala por demanda',
          development: 'Stack otimizada',
          maintenance: 'Independente'
        }
      },
    ]
  }
];

export default function ServiceArchitectureSimulator() {
  const [selectedArch, setSelectedArch] = useState<Architecture>(architectures[0]);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const renderDependencyLines = (module: Module) => {
    if (!module.dependencies) return null;

    return module.dependencies.map(depId => {
      const depModule = selectedArch.modules.find(m => m.id === depId);
      if (!depModule) return null;

      const isHighlighted = hoveredModule === module.id || hoveredModule === depId;

      return (
        <svg
          key={`${module.id}-${depId}`}
          className={`absolute left-0 top-0 w-full h-full pointer-events-none transition-opacity ${
            hoveredModule && !isHighlighted ? 'opacity-10' : 'opacity-50'
          }`}
        >
          <line
            x1="50%"
            y1="50%"
            x2="50%"
            y2="50%"
            stroke={isHighlighted ? '#60A5FA' : '#666'}
            strokeWidth="2"
            strokeDasharray={selectedArch.type === 'microservices' ? '4' : '0'}
          />
        </svg>
      );
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-blue-400"
        >
          Simulador de Arquiteturas de Serviços
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-300 mb-12"
        >
          Compare as diferentes abordagens de organização de código e suas implicações.
        </motion.p>

        {/* Architecture Selection */}
        <div className="flex gap-4 mb-12">
          {architectures.map(arch => (
            <motion.button
              key={arch.type}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
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

        {/* Architecture Description */}
        <motion.div
          key={selectedArch.type}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-800 p-6 rounded-lg mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">{selectedArch.name}</h2>
          <p className="text-zinc-300">{selectedArch.description}</p>
        </motion.div>

        {/* Modules Visualization */}
        <div className="relative">
          <div className={`grid gap-8 ${
            selectedArch.type === 'monolithic' 
              ? 'grid-cols-1' 
              : selectedArch.type === 'modular'
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}>
            {selectedArch.modules.map(module => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-lg ${module.color} bg-opacity-10 relative ${
                  hoveredModule && hoveredModule !== module.id && !module.dependencies?.includes(hoveredModule)
                    ? 'opacity-30'
                    : ''
                }`}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <h3 className="text-xl font-semibold mb-4">{module.name}</h3>
                
                {/* Module Details - Always Visible */}
                {module.details && (
                  <div className="text-sm text-zinc-300 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Deploy:</span>
                      <span>{module.details.deployment}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Comunicação:</span>
                      <span>{module.details.communication}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Banco:</span>
                      <span>{module.details.database}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Escala:</span>
                      <span>{module.details.scaling}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Dev:</span>
                      <span>{module.details.development}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Manutenção:</span>
                      <span>{module.details.maintenance}</span>
                    </div>
                  </div>
                )}

                {module.dependencies && (
                  <div className="text-sm text-zinc-400 mt-4 pt-4 border-t border-zinc-700">
                    Depende de: {module.dependencies.map(dep => {
                      const depModule = selectedArch.modules.find(m => m.id === dep);
                      return depModule?.name;
                    }).join(', ')}
                  </div>
                )}
                {renderDependencyLines(module)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-zinc-800 p-6 rounded-lg text-center"
        >
          <p className="text-zinc-300">
            Passe o mouse sobre os módulos para visualizar suas dependências.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 