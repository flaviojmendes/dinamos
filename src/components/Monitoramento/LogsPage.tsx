import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LogsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const base = 'monitoring_maintenance.logs_page';

  const textAdv = t(`${base}.formats.text_adv_items`, { returnObjects: true }) as string[];
  const textDisadv = t(`${base}.formats.text_disadv_items`, { returnObjects: true }) as string[];
  const jsonAdv = t(`${base}.formats.json_adv_items`, { returnObjects: true }) as string[];
  const jsonDisadv = t(`${base}.formats.json_disadv_items`, { returnObjects: true }) as string[];
  const tracingComponents = t(`${base}.tracing_section.components_items`, { returnObjects: true }) as string[];
  const tracingBenefits = t(`${base}.tracing_section.benefits_items`, { returnObjects: true }) as string[];
  const loggingBest = t(`${base}.best_practices.logging_items`, { returnObjects: true }) as string[];
  const tracingBest = t(`${base}.best_practices.tracing_items`, { returnObjects: true }) as string[];
  const loggingTools = t(`${base}.tools.logging_items`, { returnObjects: true }) as string[];
  const tracingTools = t(`${base}.tools.tracing_items`, { returnObjects: true }) as string[];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">
            {t(`${base}.title`)}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/monitoramento-e-manutencao/logs/simulador')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t(`${base}.buttons.logs_simulator`)}
            </button>
            <button
              onClick={() => navigate('/monitoramento-e-manutencao/logs/tracing')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t(`${base}.buttons.tracing_simulator`)}
            </button>
          </div>
        </div>
        <p className="text-xl text-zinc-300">
          {t(`${base}.intro_p1`)}
        </p>
      </div>

      {/* Níveis de Log */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t(`${base}.levels_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">DEBUG</h3>
            <p className="text-zinc-300 text-sm">{t(`${base}.levels.debug_desc`)}</p>
          </div>
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">INFO</h3>
            <p className="text-zinc-300 text-sm">{t(`${base}.levels.info_desc`)}</p>
          </div>
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">WARN</h3>
            <p className="text-zinc-300 text-sm">{t(`${base}.levels.warn_desc`)}</p>
          </div>
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">ERROR</h3>
            <p className="text-zinc-300 text-sm">{t(`${base}.levels.error_desc`)}</p>
          </div>
        </div>
      </div>

      {/* Formatos de Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t(`${base}.formats.text_title`)}</h2>
          <div className="space-y-4">
            <div className="bg-black p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">
{`[2024-03-20 10:15:30] INFO Usuario fez login
[2024-03-20 10:15:35] ERROR Falha no processamento
[2024-03-20 10:15:40] WARN Cache miss`}
              </pre>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-yellow-400">{t(`${base}.formats.text_adv_title`)}</h3>
              <ul className="list-disc list-inside space-y-1">
                {textAdv.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-red-400">{t(`${base}.formats.text_disadv_title`)}</h3>
              <ul className="list-disc list-inside space-y-1">
                {textDisadv.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t(`${base}.formats.json_title`)}</h2>
          <div className="space-y-4">
            <div className="bg-black p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">
{`{
  "timestamp": "2024-03-20T10:15:30Z",
  "nivel": "INFO",
  "servico": "auth-service",
  "traceId": "trace-123",
  "usuarioId": "user-456",
  "acao": "login_usuario",
  "mensagem": "Usuário logado com sucesso",
  "metadados": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "duracao": "150ms"
  }
}`}
              </pre>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-green-400">{t(`${base}.formats.json_adv_title`)}</h3>
              <ul className="list-disc list-inside space-y-1">
                {jsonAdv.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-yellow-400">{t(`${base}.formats.json_disadv_title`)}</h3>
              <ul className="list-disc list-inside space-y-1">
                {jsonDisadv.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Distributed Tracing */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t(`${base}.tracing_section.title`)}</h2>
        <div className="space-y-6">
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{t(`${base}.tracing_section.what_is_title`)}</h3>
            <p className="text-zinc-300">{t(`${base}.tracing_section.what_is_p`)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">{t(`${base}.tracing_section.components_title`)}</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                {tracingComponents.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-black p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">{t(`${base}.tracing_section.benefits_title`)}</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                {tracingBenefits.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Boas Práticas */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t(`${base}.best_practices.title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">{t(`${base}.best_practices.logging_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {loggingBest.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{t(`${base}.best_practices.tracing_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {tracingBest.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ferramentas */}
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t(`${base}.tools.title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">{t(`${base}.tools.logging_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {loggingTools.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t(`${base}.tools.tracing_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {tracingTools.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 