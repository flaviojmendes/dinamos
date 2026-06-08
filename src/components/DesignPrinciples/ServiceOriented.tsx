import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton } from '../tactical';

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
  const { t } = useTranslation();
  // Calculate responsive positions
  const position = {
    x: (containerWidth * module.x) / 100,
    y: (containerHeight * module.y) / 100,
  };

  return (
    <motion.div
      className={`absolute p-4 border-2 rounded-lg bg-slate-50 dark:bg-tactical-raised border-slate-200 dark:border-tactical-border ${
        !isHighlighted ? 'opacity-50' : 'border-signal-cyan'
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
      <h4 className="font-sans text-sm font-semibold mb-2 text-slate-900 dark:text-tactical-text">{module.name}</h4>
      <div className="font-sans text-xs space-y-1 text-slate-600 dark:text-tactical-dim">
        <div><strong>{t('design_principles.service_oriented.sections.module_labels.deploy')}:</strong> {module.details.deployment}</div>
        <div><strong>{t('design_principles.service_oriented.sections.module_labels.communication')}:</strong> {module.details.communication}</div>
        <div><strong>{t('design_principles.service_oriented.sections.module_labels.database')}:</strong> {module.details.database}</div>
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
  const { t, i18n } = useTranslation();

  // Map the currently selectedArch.type to i18n content
  const i18nArchBase = `design_principles.service_oriented.architectures.${selectedArch.type}`;

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
          {t('design_principles.service_oriented.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim mb-6">
          {t('design_principles.service_oriented.intro')}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['monolithic','modular','microservices'] as const).map(type => (
            <motion.div key={type}>
              <TacticalButton
                size="sm"
                variant={selectedArch.type === type ? 'primary' : 'secondary'}
                onClick={() => setSelectedArch(architectures.find(a => a.type === type)!)}
              >
                {t(`design_principles.service_oriented.architectures.${type}.name`)}
              </TacticalButton>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        key={selectedArch.type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Panel title={t(`${i18nArchBase}.name`)} accent="cyan">
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim mb-6">{t(`${i18nArchBase}.description`)}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-emerald-600 dark:text-signal-green mb-3">{t('design_principles.service_oriented.sections.advantages')}</h3>
              <ul className="space-y-2">
                {(t(`${i18nArchBase}.advantages`, { returnObjects: true }) as string[]).map((advantage, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 font-sans text-sm text-slate-600 dark:text-tactical-dim"
                  >
                    <svg className="w-4 h-4 text-emerald-600 dark:text-signal-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {advantage}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-600 dark:text-signal-red mb-3">{t('design_principles.service_oriented.sections.disadvantages')}</h3>
              <ul className="space-y-2">
                {(t(`${i18nArchBase}.disadvantages`, { returnObjects: true }) as string[]).map((disadvantage, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 font-sans text-sm text-slate-600 dark:text-tactical-dim"
                  >
                    <svg className="w-4 h-4 text-red-600 dark:text-signal-red mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {disadvantage}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('design_principles.service_oriented.sections.example_title')}</h4>
            <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{t(`${i18nArchBase}.example`)}</p>
          </div>
        </Panel>

        <Panel title={t('design_principles.service_oriented.sections.diagram_title')} accent="amber" bodyClassName="p-8">
            <ResponsiveDiagram
              architecture={{
                ...selectedArch,
                modules: selectedArch.modules.map(m => ({
                  ...m,
                  name: t(`${i18nArchBase}.modules.${m.id}.name`),
                  details: {
                    ...m.details,
                    deployment: t(`${i18nArchBase}.modules.${m.id}.details.deployment`),
                    communication: t(`${i18nArchBase}.modules.${m.id}.details.communication`),
                    database: t(`${i18nArchBase}.modules.${m.id}.details.database`),
                  }
                }))
              }}
              hoveredModule={hoveredModule}
              onHover={setHoveredModule}
            />

            {/* Legend */}
            <div className="mt-20 flex justify-center gap-8 font-sans text-xs text-slate-500 dark:text-tactical-dim">
              <div className="flex items-center gap-2">
                <div className="w-4 h-[2px] bg-slate-400 dark:bg-tactical-line"></div>
                {selectedArch.type === 'monolithic' && t('design_principles.service_oriented.sections.legend.direct_call')}
                {selectedArch.type === 'modular' && t('design_principles.service_oriented.sections.legend.interface')}
                {selectedArch.type === 'microservices' && t('design_principles.service_oriented.sections.legend.api_events')}
              </div>
            </div>
        </Panel>
      </motion.div>
    </div>
  );
} 