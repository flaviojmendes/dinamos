import React from 'react';
import { motion } from 'framer-motion';

const Bitly: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Bit.ly System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Como o Bit.ly gerencia bilhões de redirecionamentos e encurtamentos de URLs em escala global
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Números Impressionantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">20B+</div>
            <div className="text-sm text-zinc-400">Links encurtados</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">400M+</div>
            <div className="text-sm text-zinc-400">Redirecionamentos por dia</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">800M+</div>
            <div className="text-sm text-zinc-400">Links ativos</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Requisitos do Sistema</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Requisitos Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Encurtamento de URLs longas</li>
              <li>Redirecionamento rápido</li>
              <li>Links personalizados</li>
              <li>Analytics em tempo real</li>
              <li>API pública</li>
              <li>Gestão de links e dashboards</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Requisitos Não-Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Latência ultra baixa (menor que 50ms)</li>
              <li>Alta disponibilidade (99.99%)</li>
              <li>Durabilidade dos dados</li>
              <li>Escalabilidade horizontal</li>
              <li>Segurança contra abusos</li>
              <li>Consistência forte para URLs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Arquitetura do Sistema</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-blue-400">Arquitetura de Alto Nível</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-blue-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#2196F3" fontSize="14">Clientes (Web, Mobile, API)</text>
              </g>

              {/* CDN Layer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#2196F3" fontSize="14">CDN e Edge Cache</text>
              </g>

              {/* Load Balancer */}
              <g>
                <rect x="250" y="220" width="300" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#2196F3" fontSize="14">Load Balancer</text>
              </g>

              {/* Application Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#2196F3" fontSize="14">Serviço de Encurtamento</text>

                <rect x="300" y="320" width="200" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#2196F3" fontSize="14">Serviço de Redirecionamento</text>

                <rect x="550" y="320" width="200" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="650" y="355" textAnchor="middle" fill="#2196F3" fontSize="14">Serviço de Analytics</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#2196F3" fontSize="12">MySQL (Metadados)</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#2196F3" fontSize="12">Redis (Cache)</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#2196F3" fontSize="12">Cassandra (Analytics)</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#2196F3" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="380" x2="650" y2="420" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Visão geral da arquitetura distribuída do Bit.ly, mostrando os principais componentes
            e suas interações.
          </p>
        </div>

        {/* URL Flow Architecture */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-blue-400">Fluxo de URLs</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-blue-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* URL Creation */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">URL Original</text>
              </g>

              {/* Hash Generation */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">Geração de Hash</text>
              </g>

              {/* Storage */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">Armazenamento</text>
              </g>

              {/* Short URL */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">URL Curta</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#2196F3" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Fluxo de processamento de URLs, desde a submissão até a geração da URL curta.
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-blue-400">1. Sistema de Encurtamento</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Geração de URLs Curtas</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Algoritmo de hash base62</li>
              <li>Verificação de colisões</li>
              <li>Cache de URLs populares</li>
              <li>Validação e sanitização de URLs</li>
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">Tipos de URLs</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>URLs padrão (7 caracteres)</li>
              <li>URLs personalizadas</li>
              <li>URLs com expiração</li>
              <li>URLs com tracking</li>
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-blue-400">2. Sistema de Armazenamento</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Armazenamento de URLs</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>MySQL para mapeamento de URLs</li>
              <li>Redis para cache de redirecionamento</li>
              <li>Cassandra para analytics</li>
              <li>Replicação multi-região</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Estratégias de Cache</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Cache em memória (Redis)</li>
              <li>CDN para URLs populares</li>
              <li>Cache local nos servidores</li>
              <li>Políticas de invalidação</li>
            </ul>
          </div>
        </div>

        {/* Analytics System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-blue-400">3. Sistema de Analytics</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Métricas Coletadas</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Cliques e redirecionamentos</li>
              <li>Geolocalização</li>
              <li>Dispositivos e browsers</li>
              <li>Referrers e campanhas</li>
              <li>Horários de acesso</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Processamento</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Stream processing com Kafka</li>
              <li>Agregações em tempo real</li>
              <li>Batch processing diário</li>
              <li>Machine learning para detecção de spam</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Decisions and Trade-offs */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Decisões Técnicas e Trade-offs</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">1. Tamanho do Hash vs Colisões</h3>
            <p className="text-zinc-300">
              URLs de 7 caracteres permitem trilhões de combinações, balanceando
              comprimento da URL com probabilidade de colisões.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">2. Cache vs Consistência</h3>
            <p className="text-zinc-300">
              Uso extensivo de cache melhora performance mas pode causar
              inconsistências temporárias após atualizações de URLs.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">3. Analytics vs Performance</h3>
            <p className="text-zinc-300">
              Coleta de métricas detalhadas impacta levemente a latência de redirecionamento.
              Processamento assíncrono minimiza o impacto.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">4. Segurança vs Usabilidade</h3>
            <p className="text-zinc-300">
              Verificações de segurança adicionam latência mas são necessárias
              para prevenir abusos e phishing.
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Desafios de Escala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Redirecionamento em Massa</h3>
            <p className="text-zinc-300">
              Bilhões de redirecionamentos diários.
              Solução: CDN global e cache distribuído.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Geração de URLs</h3>
            <p className="text-zinc-300">
              Geração única e rápida de hashes.
              Solução: Algoritmo distribuído de IDs.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Analytics</h3>
            <p className="text-zinc-300">
              Processamento de eventos em tempo real.
              Solução: Pipeline distribuído com Kafka.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Spam e Abuso</h3>
            <p className="text-zinc-300">
              Detecção e prevenção de URLs maliciosas.
              Solução: ML e rate limiting distribuído.
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Evolução da Arquitetura</h2>
        <div className="space-y-6">
          {/* 2008: Initial Version */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2008</span>
              <h3 className="text-lg font-medium">Lançamento</h3>
              <p className="text-zinc-300">Monolito Python com MySQL.</p>
            </div>
          </div>

          {/* 2010-2011: Scale */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2010-2011</span>
              <h3 className="text-lg font-medium">Primeira Escala</h3>
              <p className="text-zinc-300">Introdução de cache e CDN.</p>
            </div>
          </div>

          {/* 2012-2013: Enterprise */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2012-2013</span>
              <h3 className="text-lg font-medium">Foco Enterprise</h3>
              <p className="text-zinc-300">Analytics avançado, APIs empresariais.</p>
            </div>
          </div>

          {/* 2015-2016: Microservices */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2015-2016</span>
              <h3 className="text-lg font-medium">Microsserviços</h3>
              <p className="text-zinc-300">Decomposição em serviços menores.</p>
            </div>
          </div>

          {/* 2018-Present: Modern Stack */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2018-Presente</span>
              <h3 className="text-lg font-medium">Stack Moderna</h3>
              <p className="text-zinc-300">Kubernetes, ML para segurança, APIs modernas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">Referências</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Documentação e Artigos Oficiais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://dev.bitly.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Bitly API Documentation</a></li>
              <li><a href="https://bitly.com/pages/resources" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Bitly Resources</a></li>
              <li><a href="https://support.bitly.com/hc/en-us/articles/231247868-Technical-requirements-for-Bitly" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Technical Requirements</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Artigos Técnicos e Análises</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://blog.bitly.com/posts/infrastructure-update-improving-redirects" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Infrastructure: Improving Redirects</a></li>
              <li><a href="https://medium.com/bitly-engineering/building-a-distributed-link-shortening-system-d4c1edc3f13b" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Building a Distributed Link Shortening System</a></li>
              <li><a href="https://www.highscalability.com/blog/2014/7/14/bitly-lessons-learned-building-a-distributed-system-that-han.html" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">High Scalability - Bitly Architecture</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Conferências e Apresentações</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=JGLx8Jg4K6Y" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Scaling Bit.ly</a></li>
              <li><a href="https://www.youtube.com/watch?v=SagZK5CSF8M" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Tech Talk - URL Shortening at Scale</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Ferramentas e SDKs</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://github.com/bitly/api-clients" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Official API Clients</a></li>
              <li><a href="https://github.com/bitly/go-nsq" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">NSQ - Distributed Messaging Platform</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Bitly; 