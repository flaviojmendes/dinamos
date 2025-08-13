import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

  const getLogColor = (nivel: Log['nivel'], isGood: boolean) => {
    switch (nivel) {
      case 'INFO':
        return isGood ? 'text-blue-400' : 'text-blue-200';
      case 'WARN':
        return isGood ? 'text-yellow-400' : 'text-yellow-200';
      case 'ERROR':
        return isGood ? 'text-red-400' : 'text-red-200';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">
            {t(`${base}.title`)}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t(`${base}.actions.settings`)}
            </button>
            <button
              onClick={reiniciarSimulador}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t(`${base}.actions.reset`)}
            </button>
          </div>
        </div>
        <p className="text-xl text-zinc-300">
          {t(`${base}.intro`)}
        </p>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {mostrarConfiguracoes && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 p-6 rounded-lg mb-8"
          >
            <h2 className="text-xl font-bold text-zinc-200 mb-6">{t(`${base}.settings_title`)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={config.autoAvancar}
                    onChange={(e) => setConfig(prev => ({ ...prev, autoAvancar: e.target.checked }))}
                    className="rounded border-zinc-600"
                  />
                  {t(`${base}.settings.auto_advance`)}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-400">{t(`${base}.controls.info_title`)}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => adicionarLog(exemplosLogs.infoBom)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              {t(`${base}.controls.add_good_info`)}
            </button>
            <button onClick={() => adicionarLog(exemplosLogs.infoRuim)} className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors">
              {t(`${base}.controls.add_bad_info`)}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-400">{t(`${base}.controls.warn_title`)}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => adicionarLog(exemplosLogs.warnBom)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              {t(`${base}.controls.add_good_warn`)}
            </button>
            <button onClick={() => adicionarLog(exemplosLogs.warnRuim)} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors">
              {t(`${base}.controls.add_bad_warn`)}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-400">{t(`${base}.controls.error_title`)}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => adicionarLog(exemplosLogs.erroBom)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              {t(`${base}.controls.add_good_error`)}
            </button>
            <button onClick={() => adicionarLog(exemplosLogs.erroRuim)} className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors">
              {t(`${base}.controls.add_bad_error`)}
            </button>
          </div>
        </div>
      </div>

      {/* Log Viewer */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-zinc-200 mb-4">{t(`${base}.viewer_title`)}</h2>
        <div className="bg-black p-4 rounded-lg h-[400px] overflow-y-auto font-mono text-sm">
          {logs.map((log, index) => {
            const isGood = Boolean(
              log.metadados && 
              Object.keys(log.metadados).length > 0 && 
              log.mensagem && 
              log.mensagem.length > 10 && 
              log.acao && 
              log.acao.includes('_')
            );
            return (
              <div key={index} className="mb-4">
                <div className={`flex items-center gap-2 mb-1 ${getLogColor(log.nivel, isGood)}`}>
                  <span className="font-bold">{log.nivel}</span>
                  <span className="text-xs opacity-75">{log.timestamp}</span>
                  {isGood ? (
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">{t(`${base}.badges.good`)}</span>
                  ) : (
                    <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded">{t(`${base}.badges.bad`)}</span>
                  )}
                </div>
                <pre className="whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best/Bad Practices */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-zinc-200 mb-4">{t(`${base}.best_practices_title`)}</h2>
          <ul className="space-y-2 text-zinc-300">
            {(t(`${base}.best_practices_items`, { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-zinc-200 mb-4">{t(`${base}.bad_practices_title`)}</h2>
          <ul className="space-y-2 text-zinc-300">
            {(t(`${base}.bad_practices_items`, { returnObjects: true }) as string[]).map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 