import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HealthChecks() {
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
          Health Checks em Sistemas Distribuídos
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          Health checks são fundamentais para monitorar a saúde e disponibilidade de 
          serviços em sistemas distribuídos. Eles permitem detecção proativa de problemas,
          facilitam o balanceamento de carga e auxiliam em estratégias de recuperação.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 Conceito Chave:</strong>
          Um bom sistema de health check deve ser abrangente, verificando não apenas se o
          serviço está respondendo, mas também sua capacidade de realizar suas funções
          essenciais e acessar recursos necessários.
        </div>
      </motion.div>

      {/* Types of Health Checks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Tipos de Health Checks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Liveness */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Liveness</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Verifica se o serviço está vivo</li>
              <li>• Detecta deadlocks</li>
              <li>• Monitora processos</li>
              <li>• Reinicia em caso de falha</li>
            </ul>
          </div>

          {/* Readiness */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Readiness</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Verifica disponibilidade</li>
              <li>• Conexões com dependências</li>
              <li>• Estado de recursos</li>
              <li>• Controle de tráfego</li>
            </ul>
          </div>

          {/* Startup */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Startup</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• Inicialização do serviço</li>
              <li>• Carregamento de recursos</li>
              <li>• Configuração inicial</li>
              <li>• Warm-up period</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Implementation Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Padrões de Implementação</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Endpoints HTTP</h3>
              <div className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
                <pre className="text-sm text-zinc-300">
{`// Endpoint de Health Check
GET /health
{
  "status": "UP",
  "components": {
    "db": "UP",
    "cache": "UP",
    "messaging": "UP"
  },
  "details": {
    "db.responseTime": "45ms",
    "cache.size": "2.3GB"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Verificações</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Conexões</span>
                    <p className="text-zinc-400 text-sm">Banco de dados, cache, mensageria</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Recursos</span>
                    <p className="text-zinc-400 text-sm">CPU, memória, disco, rede</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Funcionalidades</span>
                    <p className="text-zinc-400 text-sm">Operações críticas do negócio</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Integration with Infrastructure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Integração com Infraestrutura</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Container Orchestration */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Orquestração de Containers</h3>
            <div className="space-y-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Kubernetes</h4>
                <pre className="text-sm text-zinc-300">
{`livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 5`}
                </pre>
              </div>
            </div>
          </div>

          {/* Load Balancers */}
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Load Balancers</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Roteamento</span>
                  <p className="text-zinc-400 text-sm">Direciona tráfego para instâncias saudáveis</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Circuit Breaking</span>
                  <p className="text-zinc-400 text-sm">Isola serviços com falha</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Auto Scaling</span>
                  <p className="text-zinc-400 text-sm">Ajusta capacidade baseado em saúde</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Melhores Práticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Implementação</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Lightweight</span>
                  <p className="text-zinc-400 text-sm">Checks devem ser leves e rápidos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Isolamento</span>
                  <p className="text-zinc-400 text-sm">Separe checks por responsabilidade</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Cache</span>
                  <p className="text-zinc-400 text-sm">Evite sobrecarga de checks frequentes</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Monitoramento</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Logging</span>
                  <p className="text-zinc-400 text-sm">Registre resultados e tendências</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Métricas</span>
                  <p className="text-zinc-400 text-sm">Colete métricas de saúde</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-white font-medium">Alertas</span>
                  <p className="text-zinc-400 text-sm">Configure alertas para falhas</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
} 