import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

interface DataItem {
  id: string;
  content: string;
  timestamp: number;
}

interface Message {
  id: number;
  timestamp: number;
  type: 'polling-request' | 'polling-response-empty' | 'polling-response-data' | 'webhook-notification' | 'data-generated';
  direction: 'client-to-server' | 'server-to-client' | 'server-internal';
  content: string;
  hasData: boolean;
  data?: string;
  dataId?: string;
}

interface SimulationStats {
  totalRequests: number;
  emptyResponses: number;
  dataTransfers: number;
  webhookNotifications: number;
  totalBandwidth: number;
  averageLatency: number;
}

export default function PollingWebhooks() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'polling' | 'webhook'>('polling');
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingData, setPendingData] = useState<DataItem[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
    totalRequests: 0,
    emptyResponses: 0,
    dataTransfers: 0,
    webhookNotifications: 0,
    totalBandwidth: 0,
    averageLatency: 50
  });

  const [config, setConfig] = useState({
    pollingInterval: 3000,
    dataGenerationInterval: 8000,
    networkLatency: 200
  });

  const pollingTimer = useRef<number>();
  const dataTimer = useRef<number>();
  const messageCounter = useRef(1);

  const sampleData = [
    'New order #1234 received',
    'User John logged in',
    'Payment of $50.00 processed',
    'File upload completed',
    'Temperature: 23°C recorded',
    'Backup process finished',
    'New message from Alice',
    'Stock level updated: 15 items'
  ];

  const generateData = useCallback(() => {
    const content = sampleData[Math.floor(Math.random() * sampleData.length)];
    const dataItem: DataItem = {
      id: `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: Date.now()
    };
    
    setPendingData(prev => [...prev, dataItem]);
    
    addMessage({
      type: 'data-generated',
      direction: 'server-internal',
      content: `New data available: ${content}`,
      hasData: true,
      data: content,
      dataId: dataItem.id
    });

    if (mode === 'webhook' && isRunning) {
      setTimeout(() => {
        setPendingData(prev => prev.filter(item => item.id !== dataItem.id));
        
        addMessage({
          type: 'webhook-notification',
          direction: 'server-to-client',
          content: `Webhook: ${content}`,
          hasData: true,
          data: content,
          dataId: dataItem.id
        });
        
        setStats(prev => ({
          ...prev,
          webhookNotifications: prev.webhookNotifications + 1,
          dataTransfers: prev.dataTransfers + 1,
          totalBandwidth: prev.totalBandwidth + estimateBandwidth(content)
        }));
      }, config.networkLatency);
    }
  }, [mode, isRunning, config.networkLatency]);

  const performPollingRequest = () => {
    addMessage({
      type: 'polling-request',
      direction: 'client-to-server',
      content: t('simulators.polling_webhooks.messages.checking'),
      hasData: false
    });

    setStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      totalBandwidth: prev.totalBandwidth + estimateBandwidth('polling request')
    }));

    setTimeout(() => {
      setPendingData(currentPendingData => {
        if (currentPendingData.length > 0) {
          const dataItem = currentPendingData[0];
          addMessage({
            type: 'polling-response-data',
            direction: 'server-to-client',
            content: t('simulators.polling_webhooks.messages.data_found', { content: dataItem.content }),
            hasData: true,
            data: dataItem.content,
            dataId: dataItem.id
          });
          
          setStats(prev => ({
            ...prev,
            dataTransfers: prev.dataTransfers + 1,
            totalBandwidth: prev.totalBandwidth + estimateBandwidth(dataItem.content)
          }));
          
          return currentPendingData.slice(1);
        } else {
          addMessage({
            type: 'polling-response-empty',
            direction: 'server-to-client',
            content: t('simulators.polling_webhooks.messages.no_data'),
            hasData: false
          });
          
          setStats(prev => ({
            ...prev,
            emptyResponses: prev.emptyResponses + 1,
            totalBandwidth: prev.totalBandwidth + estimateBandwidth('no data response')
          }));
          
          return currentPendingData;
        }
      });
    }, config.networkLatency);
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const message: Message = {
      id: messageCounter.current++,
      timestamp: Date.now(),
      ...messageData
    };

    setMessages(prev => [...prev.slice(-19), message]);
  };

  const estimateBandwidth = (content: string) => {
    return (content.length + 200) * 8;
  };

  const startSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      dataTimer.current = window.setInterval(generateData, config.dataGenerationInterval);
      if (mode === 'polling') {
        pollingTimer.current = window.setInterval(performPollingRequest, config.pollingInterval);
      }
    }, 10);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current);
    }
    if (dataTimer.current) {
      clearInterval(dataTimer.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setMessages([]);
    setPendingData([]);
    setStats({
      totalRequests: 0,
      emptyResponses: 0,
      dataTransfers: 0,
      webhookNotifications: 0,
      totalBandwidth: 0,
      averageLatency: config.networkLatency
    });
    messageCounter.current = 1;
  };

  useEffect(() => {
    if (isRunning) {
      stopSimulation();
      if (pollingTimer.current) clearInterval(pollingTimer.current);
      if (mode === 'polling') {
        pollingTimer.current = window.setInterval(performPollingRequest, config.pollingInterval);
      }
    }
  }, [mode, config.pollingInterval]);

  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, []);

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'polling-request': return 'text-signal-cyan border-signal-cyan/30 bg-signal-cyan/5';
      case 'polling-response-empty': return 'text-signal-amber border-signal-amber/30 bg-signal-amber/5';
      case 'polling-response-data': return 'text-signal-green border-signal-green/30 bg-signal-green/5';
      case 'webhook-notification': return 'text-signal-cyan border-signal-cyan/40 bg-signal-cyan/10';
      case 'data-generated': return 'text-signal-amber border-signal-amber/30 bg-signal-amber/5';
      default: return 'text-slate-600 dark:text-tactical-dim border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised';
    }
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'polling-request': return '📤';
      case 'polling-response-empty': return '📭';
      case 'polling-response-data': return '📬';
      case 'webhook-notification': return '🔔';
      case 'data-generated': return '📊';
      default: return '💬';
    }
  };

  const rangeClass = 'w-full h-2 bg-slate-200 dark:bg-tactical-raised appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text mb-2">
          {t('simulators.polling_webhooks.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('simulators.polling_webhooks.subtitle')}
        </p>
        <Link
          to="/componentes/polling-webhooks"
          className="inline-flex items-center gap-2 mt-4 font-sans text-xs text-signal-cyan hover:text-signal-green transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {t('simulators.polling_webhooks.ctas.read_theory')}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <TacticalButton size="sm" variant={mode === 'polling' ? 'primary' : 'secondary'} onClick={() => setMode('polling')} disabled={isRunning}>
          📤 {t('simulators.polling_webhooks.buttons.polling')}
        </TacticalButton>
        <TacticalButton size="sm" variant={mode === 'webhook' ? 'primary' : 'secondary'} onClick={() => setMode('webhook')} disabled={isRunning}>
          🔔 {t('simulators.polling_webhooks.buttons.webhook')}
        </TacticalButton>
        <TacticalButton size="sm" variant={isRunning ? 'danger' : 'primary'} onClick={isRunning ? stopSimulation : startSimulation}>
          {isRunning ? '⏹️ ' + t('simulators.polling_webhooks.buttons.stop') : '▶️ ' + t('simulators.polling_webhooks.buttons.start')}
        </TacticalButton>
        <TacticalButton size="sm" variant="ghost" onClick={resetSimulation}>
          🔄 {t('simulators.polling_webhooks.buttons.reset')}
        </TacticalButton>
      </div>

      <Panel title={t('components.common.simulator_title')} accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
              {t('simulators.polling_webhooks.config.polling_interval')}
            </label>
            <input type="range" min="1000" max="10000" step="500" value={config.pollingInterval} onChange={(e) => setConfig(prev => ({ ...prev, pollingInterval: parseInt(e.target.value) }))} className={rangeClass} disabled={isRunning} />
            <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{config.pollingInterval / 1000}s</span>
          </div>
          <div>
            <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
              {t('simulators.polling_webhooks.config.data_generation')}
            </label>
            <input type="range" min="3000" max="15000" step="1000" value={config.dataGenerationInterval} onChange={(e) => setConfig(prev => ({ ...prev, dataGenerationInterval: parseInt(e.target.value) }))} className={rangeClass} disabled={isRunning} />
            <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{config.dataGenerationInterval / 1000}s</span>
          </div>
          <div>
            <label className="block font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">
              {t('simulators.polling_webhooks.config.network_latency')}
            </label>
            <input type="range" min="50" max="1000" step="50" value={config.networkLatency} onChange={(e) => setConfig(prev => ({ ...prev, networkLatency: parseInt(e.target.value) }))} className={rangeClass} disabled={isRunning} />
            <span className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{config.networkLatency}ms</span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <StatusBadge
            variant={mode === 'polling' ? 'active' : 'in-progress'}
            label={`${t('simulators.polling_webhooks.flow.active_mode')} ${mode === 'polling' ? t('simulators.polling_webhooks.buttons.polling') : t('simulators.polling_webhooks.buttons.webhook')}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="font-sans text-sm font-semibold text-signal-cyan mb-3">{t('simulators.polling_webhooks.flow.title')}</div>
            <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-6 h-80 relative">
              <div className="absolute top-4 left-4 rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-3 py-1.5 font-sans text-xs text-signal-cyan">
                {t('simulators.polling_webhooks.flow.client')}
              </div>
              <div className="absolute top-4 right-4 rounded-full border border-signal-green/40 bg-signal-green/10 px-3 py-1.5 font-sans text-xs text-signal-green">
                {t('simulators.polling_webhooks.flow.server')}
              </div>
              <div className="absolute top-8 left-20 right-20 h-px bg-slate-300 dark:bg-tactical-line mt-2" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <StatusBadge
                  variant={isRunning ? 'active' : 'offline'}
                  label={isRunning ? t('simulators.polling_webhooks.flow.active_sim', { mode }) : t('simulators.polling_webhooks.flow.stopped_sim')}
                />
              </div>
              <div className="absolute top-16 left-0 right-0 bottom-16">
                <AnimatePresence>
                  {(() => {
                    let visibleMessages = messages.slice(-5);
                    if (mode === 'webhook') {
                      visibleMessages = visibleMessages.filter(msg => 
                        msg.type === 'webhook-notification' || msg.type === 'data-generated'
                      ).slice(-3);
                    } else {
                      visibleMessages = visibleMessages.filter(msg => 
                        msg.type === 'polling-request' || msg.type === 'polling-response-data' || msg.type === 'polling-response-empty'
                      ).slice(-3);
                    }
                    return visibleMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.direction === 'client-to-server' ? -100 : message.direction === 'server-to-client' ? 100 : 0, y: 20 + index * 35, scale: message.type === 'webhook-notification' ? 0.8 : 1 }}
                        animate={{ opacity: 1, x: message.direction === 'client-to-server' ? 50 : message.direction === 'server-to-client' ? -50 : 0, y: 20 + index * 35, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: message.type === 'webhook-notification' ? 0.6 : 0.3, type: message.type === 'webhook-notification' ? 'spring' : 'tween' }}
                        className={`absolute font-mono text-xs p-2 border ${getMessageColor(message.type)} ${message.type === 'webhook-notification' ? 'font-semibold' : ''}`}
                        style={{ left: message.direction === 'server-internal' ? '50%' : 'auto', transform: message.direction === 'server-internal' ? 'translateX(-50%)' : 'none' }}
                      >
                        {getMessageIcon(message.type)} {message.content.substring(0, 25)}{message.content.length > 25 ? '...' : ''}
                      </motion.div>
                    ));
                  })()}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div>
            <div className="font-sans text-sm font-semibold text-signal-cyan mb-3">{t('simulators.polling_webhooks.stats.title')}</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{stats.totalRequests}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.polling_webhooks.stats.total_requests')}</div>
              </div>
              <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-amber">{stats.emptyResponses}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.polling_webhooks.stats.empty_responses')}</div>
              </div>
              <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">{stats.dataTransfers}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.polling_webhooks.stats.data_transfers')}</div>
              </div>
              <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{stats.webhookNotifications}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.polling_webhooks.stats.webhooks_sent')}</div>
              </div>
              <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-3 col-span-2">
                <div className="font-mono text-2xl font-bold tabular-nums leading-none text-signal-amber">
                  {(stats.totalBandwidth / 1000).toFixed(1)}k
                </div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.polling_webhooks.stats.total_bandwidth_bits')}</div>
              </div>
            </div>

            <div className="tactical-panel rounded-lg dark:rounded-none border-l-2 border-l-signal-cyan p-4 mb-4">
              <h4 className="font-sans text-sm font-semibold text-signal-cyan mb-2">{t('simulators.polling_webhooks.stats.efficiency')}</h4>
              {stats.totalRequests > 0 && (
                <div className="space-y-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
                  <div className="flex justify-between">
                    <span>{t('simulators.polling_webhooks.stats.success_rate')}:</span>
                    <span className="text-signal-green">{((stats.dataTransfers / stats.totalRequests) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('simulators.polling_webhooks.stats.wasted_requests')}:</span>
                    <span className="text-signal-red">{((stats.emptyResponses / stats.totalRequests) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg dark:rounded-none border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4">
              <h4 className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">{t('simulators.polling_webhooks.queue.pending_data', { count: pendingData.length })}</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {pendingData.slice(0, 3).map((dataItem) => (
                  <div key={dataItem.id} className="font-mono text-xs text-signal-amber border border-signal-amber/30 bg-signal-amber/5 p-1">
                    📊 {dataItem.content}
                  </div>
                ))}
                {pendingData.length > 3 && (
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-label">{t('simulators.polling_webhooks.flow.more', { count: pendingData.length - 3 })}</div>
                )}
                {pendingData.length === 0 && (
                  <div className="font-mono text-xs text-slate-500 dark:text-tactical-label text-center">{t('simulators.polling_webhooks.queue.none')}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-sans text-sm font-semibold text-signal-cyan mb-3">{t('simulators.polling_webhooks.log.title')}</div>
          <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-4 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {messages.slice(-15).reverse().map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className={`font-mono text-sm mb-2 p-2 border ${getMessageColor(message.type)}`}>
                  <span className="text-slate-500 dark:text-tactical-label text-xs">[{new Date(message.timestamp).toLocaleTimeString()}]</span>{' '}
                  <span>{getMessageIcon(message.type)}</span>{' '}
                  <span>{message.content}</span>
                  {message.hasData && (
                    <span className="ml-2 text-xs border border-signal-green/30 px-2 py-0.5 text-signal-green">
                      ✅ {t('simulators.polling_webhooks.log.with_data')}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {messages.length === 0 && (
              <div className="font-mono text-xs text-slate-500 dark:text-tactical-label text-center py-4">
                {t('simulators.polling_webhooks.log.start_prompt')}
              </div>
            )}
          </div>
        </div>
      </Panel>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/componentes/polling-webhooks">
          <TacticalButton variant="primary" size="sm">
            {t('simulators.polling_webhooks.ctas.back_to_theory')}
          </TacticalButton>
        </Link>
        <Link to="/componentes" className="font-sans text-xs text-signal-cyan hover:text-signal-green transition-colors">
          ← {t('simulators.polling_webhooks.ctas.back_to_components')}
        </Link>
      </div>
    </div>
  );
}
