import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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
  { id: 'api-gateway', name: 'API Gateway', color: 'bg-signal-cyan' },
  { id: 'auth-service', name: 'Auth Service', color: 'bg-signal-green' },
  { id: 'user-service', name: 'User Service', color: 'bg-signal-amber' },
  { id: 'payment-service', name: 'Payment Service', color: 'bg-slate-500' },
  { id: 'notification-service', name: 'Notification Service', color: 'bg-signal-red' },
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
    <div className="relative h-32 bg-slate-100 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        {[0, 25, 50, 75, 100].map((marker) => (
          <div key={marker} className="absolute left-[${marker}%] w-px h-full bg-slate-300 dark:bg-tactical-line">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-slate-500 dark:text-tactical-label">
              {((totalDuration * marker) / 100).toFixed(0)}ms
            </div>
          </div>
        ))}
      </div>

      {spans.map((span) => {
        const left = ((span.startTime - startTime) / totalDuration) * 100;
        const width = (span.duration / totalDuration) * 100;
        const service = services.find(s => s.id === span.service);

        return (
          <div
            key={span.id}
            className="absolute h-8 transition-all duration-300 hover:scale-105"
            style={{ left: `${left}%`, width: `${width}%`, top: `${spans.findIndex(s => s.id === span.id) * 32}px` }}
          >
            <div className={`h-full ${service?.color} flex items-center px-2 font-mono text-xs text-white whitespace-nowrap overflow-hidden`}>
              <span className="truncate">{span.service}</span>
              <span className="ml-auto tabular-nums">{span.duration.toFixed(0)}ms</span>
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
      {hasChildren && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-300 dark:bg-tactical-line" />
      )}
      
      {span.parentId && (
        <div className="absolute left-4 top-4 w-4 h-0.5 bg-slate-300 dark:bg-tactical-line" />
      )}

      <div className={`absolute left-0 top-2 w-2 h-2 ${
        span.status === 'success' ? 'bg-signal-green' : 'bg-signal-red'
      }`} />

      <div className={`ml-8 flex items-center gap-2 border border-slate-200 dark:border-tactical-border ${service?.color} text-white px-3 py-2`}>
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold">{span.service}</span>
          <span className="font-mono text-xs opacity-75">{span.operation}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-xs bg-black/20 px-2 py-0.5 tabular-nums">
            {span.duration.toFixed(0)}ms
          </span>
          {span.status === 'error' && (
            <StatusBadge variant="classified" label={t(`${base}.error_badge`)} />
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="label-mono text-signal-cyan mb-2">
            [ {t(`${base}.title`)} ]
          </div>
          <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
            {t(`${base}.intro`)}
          </p>
        </div>
        <TacticalButton variant="ghost" size="sm" onClick={clearSimulation}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t(`${base}.controls.clear`)}
        </TacticalButton>
      </div>

      <Panel title={t(`${base}.controls_title`)} accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TacticalButton
            variant="primary"
            className="w-full"
            onClick={startNewRequest}
            disabled={!!currentRequest}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t(`${base}.controls.start_request`)}
          </TacticalButton>
          <TacticalButton
            variant="secondary"
            className="w-full"
            onClick={addNextSpan}
            disabled={!currentRequest || currentRequest.currentStep >= 5}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t(`${base}.controls.add_span`)}
          </TacticalButton>
          <TacticalButton
            variant="secondary"
            className="w-full"
            onClick={finishRequest}
            disabled={!currentRequest || currentRequest.currentStep < 5}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t(`${base}.controls.finish_request`)}
          </TacticalButton>
        </div>
      </Panel>

      {currentRequest && (
        <Panel
          title={t(`${base}.current_request_title`)}
          accent="amber"
          action={<StatusBadge variant="in-progress" label={`${currentRequest.currentStep}/5`} />}
        >
          <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-mono text-sm font-bold text-signal-cyan">Trace ID: {currentRequest.id}</h3>
                <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('common.start_time', { defaultValue: 'Start' })}: {new Date(currentRequest.startTime).toLocaleTimeString()}</p>
              </div>
              <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                {t(`${base}.steps_label`, { current: currentRequest.currentStep, total: 5 })}
              </div>
            </div>

            {currentRequest.spans.length > 0 && (
              <div className="mb-6">
                <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t(`${base}.timeline_label`)}</div>
                <TimelineView spans={currentRequest.spans} />
              </div>
            )}

            <div className="space-y-4">
              {currentRequest.spans.map((span, index) => (
                <SpanView key={span.id} span={span} hasChildren={currentRequest.spans.some(s => s.parentId === span.id)} isLast={index === currentRequest.spans.length - 1} />
              ))}
            </div>
          </div>
        </Panel>
      )}

      <Panel title={t(`${base}.history_title`)} accent="green">
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                —
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-signal-cyan">Trace ID: {request.id}</h3>
                    <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('common.start_time', { defaultValue: 'Start' })}: {new Date(request.startTime).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t(`${base}.timeline_label`)}</div>
                  <TimelineView spans={request.spans} />
                </div>

                <div className="space-y-4">
                  {request.spans.map((span, index) => (
                    <SpanView key={span.id} span={span} hasChildren={request.spans.some(s => s.parentId === span.id)} isLast={index === request.spans.length - 1} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
