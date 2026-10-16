import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { FlowLink, useSimulationMotion } from '../simulation';
import { useTranslation } from 'react-i18next';

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

export default function ServiceArchitectureSimulator() {
  const { reducedMotion, transition } = useSimulationMotion();
  const { t } = useTranslation();
  const architectures = t('simulators.service_architecture.architectures', { returnObjects: true }) as Architecture[];
  const [selectedType, setSelectedType] = useState<Architecture['type']>('monolithic');
  const selectedArch = architectures.find(architecture => architecture.type === selectedType)!;
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <div className="simulation-workspace space-y-6">
      <div className="max-w-3xl">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
          {t('simulators.service_architecture.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim mb-6">
          {t('simulators.service_architecture.subtitle')}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {architectures.map(arch => (
            <motion.div
              key={arch.type}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
            >
              <TacticalButton
                size="sm"
                variant={selectedArch.type === arch.type ? 'primary' : 'secondary'}
                onClick={() => setSelectedType(arch.type)}
              >
                {arch.name}
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
      >
        <Panel title={selectedArch.name} accent="cyan" className="mb-6">
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{selectedArch.description}</p>
        </Panel>

        {/* Modules Visualization */}
        <div className="sim-stage relative">
          <div className={`grid gap-8 ${
            selectedArch.type === 'monolithic' 
              ? 'grid-cols-1' 
              : selectedArch.type === 'modular'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}>
            {selectedArch.modules.map(module => (
              <motion.div
                key={module.id}
                layout
                initial={{ opacity: 0.6 }}
                animate={{ opacity: hoveredModule && hoveredModule !== module.id && !module.dependencies?.includes(hoveredModule) ? 0.4 : 1, y: hoveredModule === module.id && !reducedMotion ? -3 : 0 }}
                transition={transition}
                className={`sim-node p-4 border rounded-lg relative bg-slate-50 dark:bg-tactical-raised border-slate-200 dark:border-tactical-border ${
                  hoveredModule && hoveredModule !== module.id && !module.dependencies?.includes(hoveredModule)
                    ? 'opacity-30'
                    : hoveredModule === module.id ? 'border-signal-cyan' : ''
                }`}
                tabIndex={0}
                role="group"
                aria-label={module.name}
                onFocus={() => setHoveredModule(module.id)}
                onBlur={() => setHoveredModule(null)}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                <h3 className="font-sans text-sm font-semibold mb-3 text-slate-900 dark:text-tactical-text">{module.name}</h3>
                
                {/* Module Details - Always Visible */}
                {module.details && (
                  <div className="font-sans text-xs text-slate-600 dark:text-tactical-dim space-y-2">
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label w-28 shrink-0">{t('simulators.service_architecture.deployment')}</span>
                      <span>{module.details.deployment}</span>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label w-28 shrink-0">{t('simulators.service_architecture.communication')}</span>
                      <span>{module.details.communication}</span>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label w-28 shrink-0">{t('simulators.service_architecture.database')}</span>
                      <span>{module.details.database}</span>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label w-28 shrink-0">{t('simulators.service_architecture.scaling')}</span>
                      <span>{module.details.scaling}</span>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label w-28 shrink-0">{t('simulators.service_architecture.development')}</span>
                      <span>{module.details.development}</span>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label w-28 shrink-0">{t('simulators.service_architecture.maintenance')}</span>
                      <span>{module.details.maintenance}</span>
                    </div>
                  </div>
                )}

                {module.dependencies && (
                  <div className="font-sans text-xs text-slate-500 dark:text-tactical-dim mt-4 pt-4 border-t border-slate-200 dark:border-tactical-border">
                    {t('simulators.service_architecture.depends_on')} {module.dependencies.map(dep => {
                      const depModule = selectedArch.modules.find(m => m.id === dep);
                      return depModule?.name;
                    }).join(', ')}
                  </div>
                )}
                {module.dependencies && module.dependencies.length > 0 && (
                  <div className="mt-4 space-y-2" aria-hidden="true">
                    {module.dependencies.map(dependency => (
                      <div key={dependency} className="flex items-center gap-2 font-sans text-xs text-slate-500 dark:text-tactical-dim">
                        <FlowLink active={hoveredModule === module.id || hoveredModule === dependency} className="w-10 shrink-0" />
                        <span>{selectedArch.modules.find(item => item.id === dependency)?.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-5 text-center">
          <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">
            {t('simulators.service_architecture.hint')}
          </p>
        </div>
      </motion.div>
    </div>
  );
} 