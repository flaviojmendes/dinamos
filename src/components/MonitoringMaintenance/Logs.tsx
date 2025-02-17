import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Logs() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Logs e Tracing em Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          Logs e tracing são fundamentais para entender o comportamento, debugar problemas
          e manter a observabilidade em sistemas distribuídos. Eles fornecem insights
          detalhados sobre o fluxo de execução e o estado do sistema.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          Em sistemas distribuídos, logs devem ser tratados como streams de eventos,
          centralizados e correlacionados para fornecer uma visão completa do sistema.
        </div>
      </motion.div>

      {/* Log Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Tipos de Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Application Logs */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Logs de Aplicação</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Eventos de negócio</li>
              <li>• Fluxo de execução</li>
              <li>• Erros e exceções</li>
              <li>• Ações do usuário</li>
            </ul>
          </div>

          {/* System Logs */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Logs de Sistema</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Inicialização/shutdown</li>
              <li>• Uso de recursos</li>
              <li>• Eventos de sistema</li>
              <li>• Problemas de hardware</li>
            </ul>
          </div>

          {/* Security Logs */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Logs de Segurança</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Tentativas de acesso</li>
              <li>• Alterações de permissão</li>
              <li>• Eventos de auditoria</li>
              <li>• Alertas de segurança</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Structured Logging */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Logging Estruturado</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <p className="text-zinc-300 mb-6">
            Logging estruturado é uma abordagem que trata logs como objetos de dados
            em vez de strings de texto simples, facilitando a análise e busca.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Benefícios</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Pesquisabilidade</span>
                    <p className="text-zinc-400 text-sm">Facilita buscas e filtros complexos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Análise</span>
                    <p className="text-zinc-400 text-sm">Permite agregações e visualizações</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Padronização</span>
                    <p className="text-zinc-400 text-sm">Formato consistente entre serviços</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Exemplo</h3>
              <div className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm text-zinc-300">
{`{
  "timestamp": "2024-03-20T10:15:30Z",
  "level": "ERROR",
  "service": "payment-service",
  "traceId": "abc123",
  "message": "Payment processing failed",
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "details": "Account balance too low"
  },
  "context": {
    "userId": "user123",
    "amount": 150.00,
    "currency": "USD"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Log Aggregation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Agregação de Logs</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Componentes</h3>
              <ul className="space-y-4">
                <li className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">Coletores</span>
                  <p className="text-zinc-400 text-sm">Agentes que coletam logs de diferentes fontes</p>
                </li>
                <li className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">Processadores</span>
                  <p className="text-zinc-400 text-sm">Filtram, transformam e enriquecem logs</p>
                </li>
                <li className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">Armazenamento</span>
                  <p className="text-zinc-400 text-sm">Sistema distribuído para persistência</p>
                </li>
                <li className="bg-zinc-800/50 p-3 rounded-lg">
                  <span className="text-white font-medium">Interface</span>
                  <p className="text-zinc-400 text-sm">UI para busca e análise</p>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Stack ELK</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Elasticsearch</h4>
                  <p className="text-zinc-400 text-sm">
                    Armazenamento e busca distribuída de logs
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Logstash</h4>
                  <p className="text-zinc-400 text-sm">
                    Pipeline de processamento de logs
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Kibana</h4>
                  <p className="text-zinc-400 text-sm">
                    Visualização e análise de logs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Distributed Tracing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Tracing Distribuído</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <p className="text-zinc-300 mb-6">
            Tracing distribuído permite rastrear o fluxo de uma requisição através
            de múltiplos serviços, fornecendo visibilidade end-to-end.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Conceitos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Trace</span>
                    <p className="text-zinc-400 text-sm">Representa uma transação end-to-end</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Span</span>
                    <p className="text-zinc-400 text-sm">Unidade de trabalho dentro de um trace</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Context</span>
                    <p className="text-zinc-400 text-sm">Metadados que acompanham o trace</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Ferramentas</h3>
              <div className="space-y-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Jaeger</h4>
                  <p className="text-zinc-400 text-sm">
                    Sistema de tracing distribuído de código aberto
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Zipkin</h4>
                  <p className="text-zinc-400 text-sm">
                    Focado em latência e análise de dependências
                  </p>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">OpenTelemetry</h4>
                  <p className="text-zinc-400 text-sm">
                    Padrão aberto para instrumentação
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Melhores Práticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Logging</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Níveis Apropriados</span>
                  <p className="text-zinc-400 text-sm">Use níveis de log adequadamente (ERROR, WARN, INFO, DEBUG)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Contexto</span>
                  <p className="text-zinc-400 text-sm">Inclua informações relevantes para debugging</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Sensibilidade</span>
                  <p className="text-zinc-400 text-sm">Evite dados sensíveis nos logs</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Tracing</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Amostragem</span>
                  <p className="text-zinc-400 text-sm">Configure taxas de amostragem adequadas</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Instrumentação</span>
                  <p className="text-zinc-400 text-sm">Use bibliotecas padrão de instrumentação</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Correlação</span>
                  <p className="text-zinc-400 text-sm">Mantenha correlação entre logs e traces</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
} 