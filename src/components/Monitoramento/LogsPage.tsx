import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">
            Logs e Tracing em Sistemas Distribuídos
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/monitoramento-e-manutencao/logs/simulador')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Simulador de Logs
            </button>
            <button
              onClick={() => navigate('/monitoramento-e-manutencao/logs/tracing')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Simulador de Tracing
            </button>
          </div>
        </div>
        <p className="text-xl text-zinc-300">
          Em sistemas distribuídos, logs e tracing são fundamentais para monitoramento, 
          debugging e análise de performance. Esta seção explora as melhores práticas 
          e ferramentas para implementar um sistema robusto de observabilidade.
        </p>
      </div>

      {/* Níveis de Log */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Níveis de Log</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">DEBUG</h3>
            <p className="text-zinc-300 text-sm">Informações detalhadas para debugging</p>
          </div>
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">INFO</h3>
            <p className="text-zinc-300 text-sm">Eventos normais do sistema</p>
          </div>
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">WARN</h3>
            <p className="text-zinc-300 text-sm">Avisos sobre situações inesperadas</p>
          </div>
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">ERROR</h3>
            <p className="text-zinc-300 text-sm">Erros que precisam de atenção</p>
          </div>
        </div>
      </div>

      {/* Formatos de Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-200 mb-4">Logs em Texto Puro</h2>
          <div className="space-y-4">
            <div className="bg-black p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">
{`[2024-03-20 10:15:30] INFO Usuário fez login
[2024-03-20 10:15:35] ERROR Falha no processamento
[2024-03-20 10:15:40] WARN Cache miss`}
              </pre>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-yellow-400">Vantagens</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Fácil de ler para humanos</li>
                <li>Menor overhead de processamento</li>
                <li>Compatível com ferramentas legadas</li>
                <li>Menor tamanho de arquivo</li>
              </ul>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-red-400">Desvantagens</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Difícil de parsear programaticamente</li>
                <li>Falta de estrutura clara</li>
                <li>Difícil de adicionar metadados</li>
                <li>Propenso a erros de formatação</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-zinc-200 mb-4">Logs em JSON</h2>
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
              <h3 className="text-lg font-semibold text-green-400">Vantagens</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Estrutura clara e consistente</li>
                <li>Fácil de parsear e processar</li>
                <li>Suporte a metadados complexos</li>
                <li>Melhor para análise automatizada</li>
              </ul>
            </div>
            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold text-yellow-400">Desvantagens</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Maior overhead de processamento</li>
                <li>Arquivos de log maiores</li>
                <li>Menos legível para humanos</li>
                <li>Pode ser excessivo para logs simples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Distributed Tracing */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Distributed Tracing</h2>
        <div className="space-y-6">
          <div className="bg-black p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">O que é Tracing?</h3>
            <p className="text-zinc-300">
              Tracing é uma técnica que permite rastrear o fluxo de uma requisição através 
              de múltiplos serviços em um sistema distribuído. Cada requisição recebe um 
              ID único (traceId) que é propagado entre os serviços.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Componentes Principais</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                <li>TraceId: Identificador único da requisição</li>
                <li>SpanId: Identificador de cada operação</li>
                <li>ParentSpanId: Relacionamento entre operações</li>
                <li>Tags: Metadados adicionais</li>
                <li>Timestamps: Duração das operações</li>
              </ul>
            </div>
            <div className="bg-black p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Benefícios</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                <li>Visualização do fluxo de requisições</li>
                <li>Identificação de gargalos</li>
                <li>Debugging em sistemas distribuídos</li>
                <li>Análise de performance</li>
                <li>Correlação de eventos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Boas Práticas */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Boas Práticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Logging</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Use níveis de log apropriados</li>
              <li>Inclua contexto relevante</li>
              <li>Mantenha formato consistente</li>
              <li>Evite logs sensíveis</li>
              <li>Use IDs de correlação</li>
              <li>Inclua timestamps</li>
              <li>Estruture os metadados</li>
              <li>Implemente rotação de logs</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Tracing</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Propague traceId entre serviços</li>
              <li>Use spans para operações importantes</li>
              <li>Adicione tags relevantes</li>
              <li>Mantenha spans concisos</li>
              <li>Implemente sampling</li>
              <li>Configure retenção adequada</li>
              <li>Integre com ferramentas de análise</li>
              <li>Monitore overhead de tracing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ferramentas */}
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">Ferramentas Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Logging</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>ELK Stack (Elasticsearch, Logstash, Kibana)</li>
              <li>Graylog</li>
              <li>Loki</li>
              <li>Datadog</li>
              <li>New Relic</li>
              <li>Splunk</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Tracing</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Jaeger</li>
              <li>Zipkin</li>
              <li>OpenTelemetry</li>
              <li>Datadog APM</li>
              <li>New Relic APM</li>
              <li>Lightstep</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 