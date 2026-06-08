import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

interface Log {
  timestamp: string;
  nivel: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  servico: string;
  traceId: string;
  usuarioId: string;
  acao: string;
  mensagem: string;
  metadados: {
    ip?: string;
    userAgent?: string;
    duracao?: string;
    erro?: {
      codigo: string;
      descricao: string;
      stack?: string;
    };
  };
}

interface SimulacaoConfig {
  autoAvancar: boolean;
  delayEventos: number;
  mostrarMetadados: boolean;
  duracaoAnimacao: number;
}

const configuracaoPadrao: SimulacaoConfig = {
  autoAvancar: true,
  delayEventos: 1000,
  mostrarMetadados: true,
  duracaoAnimacao: 0.3,
};

const exemplosLogs = {
  infoBom: {
    timestamp: new Date().toISOString(),
    nivel: 'INFO' as const,
    servico: 'servico-usuario',
    traceId: 'trace-123',
    usuarioId: 'usuario-456',
    acao: 'login_usuario',
    mensagem: 'Usuário logado com sucesso',
    metadados: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      duracao: '150ms'
    }
  },
  infoRuim: {
    timestamp: new Date().toISOString(),
    nivel: 'INFO' as const,
    servico: 'servico-usuario',
    traceId: 'trace-123',
    usuarioId: 'usuario-456',
    acao: 'login_usuario',
    mensagem: 'Usuário fez login',
    metadados: {}
  },
  warnBom: {
    timestamp: new Date().toISOString(),
    nivel: 'WARN' as const,
    servico: 'servico-cache',
    traceId: 'trace-789',
    usuarioId: 'sistema',
    acao: 'cache_miss',
    mensagem: 'Cache miss detectado - performance pode ser afetada',
    metadados: {
      chave: 'produto-123',
      duracao: '450ms',
      alternativa: 'usar_cache_distribuido'
    }
  },
  warnRuim: {
    timestamp: new Date().toISOString(),
    nivel: 'WARN' as const,
    servico: 'servico-cache',
    traceId: 'trace-789',
    usuarioId: 'sistema',
    acao: 'cache_miss',
    mensagem: 'Alerta: cache não encontrado',
    metadados: {}
  },
  erroBom: {
    timestamp: new Date().toISOString(),
    nivel: 'ERROR' as const,
    servico: 'servico-pagamento',
    traceId: 'trace-789',
    usuarioId: 'usuario-456',
    acao: 'processar_pagamento',
    mensagem: 'Falha ao processar pagamento',
    metadados: {
      erro: {
        codigo: 'PAYMENT_FAILED',
        descricao: 'Cartão recusado',
        stack: 'Error: Payment failed\n    at processPayment (/app/services/payment.js:45:12)'
      },
      tentativa: 3,
      valor: 'R$ 150,00'
    }
  },
  erroRuim: {
    timestamp: new Date().toISOString(),
    nivel: 'ERROR' as const,
    servico: 'servico-pagamento',
    traceId: 'trace-789',
    usuarioId: 'usuario-456',
    acao: 'processar_pagamento',
    mensagem: 'Deu erro no pagamento',
    metadados: {}
  }
};

export default function LogSimulator() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.logs_simulator';

  const [logs, setLogs] = useState<Log[]>([]);
  const [config, setConfig] = useState<SimulacaoConfig>(configuracaoPadrao);
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);
  const [modoReplay, setModoReplay] = useState(false);
  const [indiceReplay, setIndiceReplay] = useState(0);
  const [velocidadeReplay, setVelocidadeReplay] = useState(1000);

  const adicionarLog = (log: Log) => {
    setLogs(prev => [...prev, log]);
  };

  const iniciarReplay = () => {
    setModoReplay(true);
    setIndiceReplay(0);
  };

  const reiniciarSimulador = () => {
    setLogs([]);
    setModoReplay(false);
    setIndiceReplay(0);
  };

  const getLogLevelClass = (nivel: Log['nivel']) => {
    switch (nivel) {
      case 'INFO':
        return 'text-signal-cyan';
      case 'WARN':
        return 'text-signal-amber';
      case 'ERROR':
        return 'text-signal-red';
      default:
        return 'text-slate-500 dark:text-tactical-dim';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text mb-2">
            {t(`${base}.title`)}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
            {t(`${base}.intro`)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TacticalButton variant="ghost" size="sm" onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t(`${base}.actions.settings`)}
          </TacticalButton>
          <TacticalButton variant="danger" size="sm" onClick={reiniciarSimulador}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t(`${base}.actions.reset`)}
          </TacticalButton>
        </div>
      </div>

      <AnimatePresence>
        {mostrarConfiguracoes && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Panel title={t(`${base}.settings_title`)} accent="cyan">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
                    <input
                      type="checkbox"
                      checked={config.autoAvancar}
                      onChange={(e) => setConfig(prev => ({ ...prev, autoAvancar: e.target.checked }))}
                      className="border-slate-300 dark:border-tactical-border"
                    />
                    {t(`${base}.settings.auto_advance`)}
                  </label>
                </div>
                <div>
                  <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
                    {t(`${base}.settings.delay_label`, { ms: config.delayEventos })}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={config.delayEventos}
                    onChange={(e) => setConfig(prev => ({ ...prev, delayEventos: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Panel title={t(`${base}.controls.info_title`)} accent="cyan">
          <div className="grid grid-cols-1 gap-2">
            <TacticalButton variant="secondary" size="sm" onClick={() => adicionarLog(exemplosLogs.infoBom)}>
              {t(`${base}.controls.add_good_info`)}
            </TacticalButton>
            <TacticalButton variant="ghost" size="sm" onClick={() => adicionarLog(exemplosLogs.infoRuim)}>
              {t(`${base}.controls.add_bad_info`)}
            </TacticalButton>
          </div>
        </Panel>
        <Panel title={t(`${base}.controls.warn_title`)} accent="amber">
          <div className="grid grid-cols-1 gap-2">
            <TacticalButton variant="secondary" size="sm" onClick={() => adicionarLog(exemplosLogs.warnBom)}>
              {t(`${base}.controls.add_good_warn`)}
            </TacticalButton>
            <TacticalButton variant="ghost" size="sm" onClick={() => adicionarLog(exemplosLogs.warnRuim)}>
              {t(`${base}.controls.add_bad_warn`)}
            </TacticalButton>
          </div>
        </Panel>
        <Panel title={t(`${base}.controls.error_title`)} accent="red">
          <div className="grid grid-cols-1 gap-2">
            <TacticalButton variant="secondary" size="sm" onClick={() => adicionarLog(exemplosLogs.erroBom)}>
              {t(`${base}.controls.add_good_error`)}
            </TacticalButton>
            <TacticalButton variant="ghost" size="sm" onClick={() => adicionarLog(exemplosLogs.erroRuim)}>
              {t(`${base}.controls.add_bad_error`)}
            </TacticalButton>
          </div>
        </Panel>
      </div>

      <Panel title={t(`${base}.viewer_title`)} accent="green">
        <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4 h-[400px] overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-slate-400 dark:text-tactical-label text-xs text-center py-10">—</p>
          ) : (
            logs.map((log, index) => {
              const isGood = Boolean(
                log.metadados && 
                Object.keys(log.metadados).length > 0 && 
                log.mensagem && 
                log.mensagem.length > 10 && 
                log.acao && 
                log.acao.includes('_')
              );
              return (
                <div key={index} className="mb-4 pb-4 border-b border-slate-200 dark:border-tactical-border last:border-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`font-bold ${getLogLevelClass(log.nivel)}`}>{log.nivel}</span>
                    <span className="text-xs text-slate-500 dark:text-tactical-label">{log.timestamp}</span>
                    {isGood ? (
                      <StatusBadge variant="active" label={t(`${base}.badges.good`)} />
                    ) : (
                      <StatusBadge variant="classified" label={t(`${base}.badges.bad`)} />
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap text-slate-700 dark:text-tactical-dim">{JSON.stringify(log, null, 2)}</pre>
                </div>
              );
            })
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="tactical-panel rounded-lg border-l-2 border-l-signal-green p-5">
          <h2 className="font-sans text-sm font-semibold text-signal-green mb-3">{t(`${base}.best_practices_title`)}</h2>
          <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim list-disc list-inside">
            {(t(`${base}.best_practices_items`, { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="tactical-panel rounded-lg border-l-2 border-l-signal-red p-5">
          <h2 className="font-sans text-sm font-semibold text-signal-red mb-3">{t(`${base}.bad_practices_title`)}</h2>
          <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim list-disc list-inside">
            {(t(`${base}.bad_practices_items`, { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
