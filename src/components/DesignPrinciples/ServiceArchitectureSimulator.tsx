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
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          Simulador de Arquiteturas de Serviços
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          Compare as diferentes abordagens de organização de código e suas implicações.
        </p>

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
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-zinc-700'
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
          className="bg-white dark:bg-slate-900 rounded-lg p-6 mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-brand-600 dark:text-brand-300">{selectedArch.name}</h2>
          <p className="text-slate-700 dark:text-slate-200">{selectedArch.description}</p>
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
                <h3 className="text-2xl font-bold mb-4 text-brand-600 dark:text-brand-300">{module.name}</h3>
                
                {/* Module Details - Always Visible */}
                {module.details && (
                  <div className="text-sm text-slate-700 dark:text-slate-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px] text-brand-600 dark:text-brand-200">Deploy:</span>
                      <span>{module.details.deployment}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px] text-brand-600 dark:text-brand-200">Comunicação:</span>
                      <span>{module.details.communication}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px] text-brand-600 dark:text-brand-200">Banco:</span>
                      <span>{module.details.database}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px] text-brand-600 dark:text-brand-200">Escala:</span>
                      <span>{module.details.scaling}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px] text-brand-600 dark:text-brand-200">Dev:</span>
                      <span>{module.details.development}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px] text-brand-600 dark:text-brand-200">Manutenção:</span>
                      <span>{module.details.maintenance}</span>
                    </div>
                  </div>
                )}

                {module.dependencies && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-300 dark:border-slate-700">
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
          className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-lg text-center"
        >
          <p className="text-slate-700 dark:text-slate-200">
            Passe o mouse sobre os módulos para visualizar suas dependências.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 