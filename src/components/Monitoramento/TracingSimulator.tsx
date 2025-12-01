import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Span {
  id: string;
  parentId: string | null;
  service: string;
  operation: string;
  startTime: number;
  duration: number;
  status: 'success' | 'error';
  tags: Record<string, string>;
}

interface Request {
  id: string;
  spans: Span[];
  startTime: number;
  currentStep: number;
}

const services = [
  { id: 'api-gateway', name: 'API Gateway', color: 'bg-blue-500' },
  { id: 'auth-service', name: 'Auth Service', color: 'bg-green-500' },
  { id: 'user-service', name: 'User Service', color: 'bg-purple-500' },
  { id: 'payment-service', name: 'Payment Service', color: 'bg-yellow-500' },
  { id: 'notification-service', name: 'Notification Service', color: 'bg-red-500' },
];

const operations = [
  { service: 'api-gateway', name: 'validate_request' },
  { service: 'api-gateway', name: 'route_request' },
  { service: 'auth-service', name: 'validate_token' },
  { service: 'auth-service', name: 'check_permissions' },
  { service: 'user-service', name: 'get_user_profile' },
  { service: 'user-service', name: 'update_user_preferences' },
  { service: 'payment-service', name: 'process_payment' },
  { service: 'payment-service', name: 'update_balance' },
  { service: 'notification-service', name: 'send_email' },
  { service: 'notification-service', name: 'send_push' },
];

const TimelineView = ({ spans }: { spans: Span[] }) => {
  const totalDuration = Math.max(...spans.map(s => s.startTime + s.duration)) - Math.min(...spans.map(s => s.startTime));
  const startTime = Math.min(...spans.map(s => s.startTime));

  return (
    <div className="relative h-32 bg-black/30 rounded-lg overflow-hidden">
      {/* Timeline markers */}
      <div className="absolute inset-0 flex items-center">
        {[0, 25, 50, 75, 100].map((marker) => (
          <div key={marker} className="absolute left-[${marker}%] w-px h-full bg-zinc-700">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500 dark:text-slate-400">
              {((totalDuration * marker) / 100).toFixed(0)}ms
            </div>
          </div>
        ))}
      </div>

      {/* Spans */}
      {spans.map((span) => {
        const left = ((span.startTime - startTime) / totalDuration) * 100;
        const width = (span.duration / totalDuration) * 100;
        const service = services.find(s => s.id === span.service);

        return (
          <div
            key={span.id}
            className="absolute h-8 rounded-md transition-all duration-300 hover:scale-105"
            style={{ left: `${left}%`, width: `${width}%`, top: `${spans.findIndex(s => s.id === span.id) * 32}px` }}
          >
            <div className={`h-full ${service?.color} rounded-md flex items-center px-2 text-xs text-white whitespace-nowrap overflow-hidden`}>
              <span className="truncate">{span.service}</span>
              <span className="ml-auto">{span.duration.toFixed(0)}ms</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SpanView = ({ span, hasChildren, isLast }: { span: Span; hasChildren: boolean; isLast: boolean }) => {
  const service = services.find(s => s.id === span.service);
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.tracing_simulator';

  return (
    <div className="relative">
      {/* Connection lines */}
      {hasChildren && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-zinc-700" />
      )}
      
      {span.parentId && (
        <div className="absolute left-4 top-4 w-4 h-0.5 bg-zinc-700" />
      )}

      {/* Status indicator */}
      <div className={`absolute left-0 top-2 w-2 h-2 rounded-full ${
        span.status === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`} />

      {/* Span content */}
      <div className={`ml-8 flex items-center gap-2 ${service?.color} text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold">{span.service}</span>
          <span className="text-xs opacity-75">{span.operation}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
            {span.duration.toFixed(0)}ms
          </span>
          {span.status === 'error' && (
            <span className="text-xs bg-red-500/20 px-2 py-1 rounded-full">
              {t(`${base}.error_badge`)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TracingSimulator() {
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.tracing_simulator';

  const [requests, setRequests] = useState<Request[]>([]);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

  const generateTraceId = () => `trace-${Math.random().toString(36).substr(2, 9)}`;
  const generateSpanId = () => `span-${Math.random().toString(36).substr(2, 9)}`;

  const createSpan = (service: string, operation: string, parentId: string | null = null): Span => ({
    id: generateSpanId(),
    parentId,
    service,
    operation,
    startTime: Date.now(),
    duration: Math.random() * 1000 + 500,
    status: Math.random() > 0.1 ? 'success' : 'error',
    tags: {
      'http.method': 'POST',
      'http.url': '/api/v1/orders',
      'service.version': '1.0.0',
    },
  });

  const startNewRequest = () => {
    const traceId = generateTraceId();
    const newRequest: Request = { id: traceId, spans: [], startTime: Date.now(), currentStep: 0 };
    setCurrentRequest(newRequest);
  };

  const addNextSpan = () => {
    if (!currentRequest) return;

    const steps = [
      { service: 'api-gateway', operation: 'validate_request' },
      { service: 'auth-service', operation: 'validate_token' },
      { service: 'user-service', operation: 'get_user_profile' },
      { service: 'payment-service', operation: 'process_payment' },
      { service: 'notification-service', operation: 'send_email' },
    ];

    if (currentRequest.currentStep >= steps.length) return;

    const step = steps[currentRequest.currentStep];
    const parentId = currentRequest.spans.length > 0 
      ? currentRequest.spans[currentRequest.spans.length - 1].id 
      : null;

    const newSpan = createSpan(step.service, step.operation, parentId);
    
    setCurrentRequest(prev => {
      if (!prev) return null;
      return { ...prev, spans: [...prev.spans, newSpan], currentStep: prev.currentStep + 1 };
    });
  };

  const finishRequest = () => {
    if (!currentRequest) return;
    setRequests(prev => [...prev, currentRequest]);
    setCurrentRequest(null);
  };

  const clearSimulation = () => {
    setRequests([]);
    setCurrentRequest(null);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400">
            {t(`${base}.title`)}
          </h1>
          <div className="flex gap-4">
            <button onClick={clearSimulation} className="px-6 py-3 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t(`${base}.controls.clear`)}
            </button>
          </div>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {t(`${base}.intro`)}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t(`${base}.controls_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={startNewRequest} disabled={!!currentRequest} className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${currentRequest ? 'bg-zinc-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t(`${base}.controls.start_request`)}
          </button>
          <button onClick={addNextSpan} disabled={!currentRequest || currentRequest.currentStep >= 5} className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${!currentRequest || currentRequest.currentStep >= 5 ? 'bg-zinc-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t(`${base}.controls.add_span`)}
          </button>
          <button onClick={finishRequest} disabled={!currentRequest || currentRequest.currentStep < 5} className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${!currentRequest || currentRequest.currentStep < 5 ? 'bg-zinc-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t(`${base}.controls.finish_request`)}
          </button>
        </div>
      </div>

      {/* Current Request */}
      {currentRequest && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t(`${base}.current_request_title`)}</h2>
          <div className="bg-black p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400">Trace ID: {currentRequest.id}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.start_time', { defaultValue: 'Start' })}: {new Date(currentRequest.startTime).toLocaleTimeString()}</p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t(`${base}.steps_label`, { current: currentRequest.currentStep, total: 5 })}
              </div>
            </div>

            {/* Timeline View */}
            {currentRequest.spans.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t(`${base}.timeline_label`)}</h3>
                <TimelineView spans={currentRequest.spans} />
              </div>
            )}

            {/* Spans View */}
            <div className="space-y-4">
              {currentRequest.spans.map((span, index) => (
                <SpanView key={span.id} span={span} hasChildren={currentRequest.spans.some(s => s.parentId === span.id)} isLast={index === currentRequest.spans.length - 1} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trace History */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t(`${base}.history_title`)}</h2>
        <div className="space-y-8">
          {requests.map((request) => (
            <div key={request.id} className="bg-black p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-600 dark:text-brand-400">Trace ID: {request.id}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.start_time', { defaultValue: 'Start' })}: {new Date(request.startTime).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Timeline View */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{t(`${base}.timeline_label`)}</h3>
                <TimelineView spans={request.spans} />
              </div>

              {/* Spans View */}
              <div className="space-y-4">
                {request.spans.map((span, index) => (
                  <SpanView key={span.id} span={span} hasChildren={request.spans.some(s => s.parentId === span.id)} isLast={index === request.spans.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 