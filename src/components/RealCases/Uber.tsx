import React from 'react';
import { motion } from 'framer-motion';

const Uber: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-zinc-700 bg-clip-text text-transparent">
          Uber System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Como o Uber conecta milhões de motoristas e passageiros em tempo real globalmente
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Números Impressionantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zinc-200">130M+</div>
            <div className="text-sm text-zinc-400">Usuários ativos mensais</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zinc-200">5M+</div>
            <div className="text-sm text-zinc-400">Motoristas ativos</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zinc-200">20M+</div>
            <div className="text-sm text-zinc-400">Viagens por dia</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Requisitos do Sistema</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Requisitos Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Matching em tempo real de motoristas e passageiros</li>
              <li>Geolocalização precisa</li>
              <li>Estimativa de preço e tempo</li>
              <li>Processamento de pagamentos</li>
              <li>Sistema de avaliação</li>
              <li>Múltiplos tipos de serviço (UberX, Black, etc.)</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Requisitos Não-Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Latência ultra baixa (menor que 100ms)</li>
              <li>Alta disponibilidade (99.99%)</li>
              <li>Consistência eventual</li>
              <li>Escalabilidade global</li>
              <li>Tolerância a falhas</li>
              <li>Segurança e privacidade</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Arquitetura do Sistema</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-zinc-200">Arquitetura de Alto Nível</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-zinc-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14">Apps (Passageiro, Motorista)</text>
              </g>

              {/* API Gateway */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="14">API Gateway</text>
              </g>

              {/* Core Services */}
              <g>
                <rect x="50" y="220" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="150" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="14">Serviço de Matching</text>
              </g>

              {/* Location Services */}
              <g>
                <rect x="300" y="220" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="14">Serviço de Localização</text>
              </g>

              {/* Trip Services */}
              <g>
                <rect x="550" y="220" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="650" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="14">Serviço de Viagens</text>
              </g>

              {/* Supporting Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#FFFFFF" fontSize="14">Serviço de Pagamentos</text>
              </g>

              {/* Analytics */}
              <g>
                <rect x="300" y="320" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#FFFFFF" fontSize="14">Analytics</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="12">PostgreSQL (Dados)</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="12">Redis (Cache)</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="12">Kafka (Eventos)</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#333333" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="150" y1="280" x2="150" y2="320" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="280" x2="650" y2="420" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Visão geral da arquitetura distribuída do Uber, mostrando os principais componentes
            e suas interações.
          </p>
        </div>

        {/* Matching Flow Architecture */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-zinc-200">Fluxo de Matching</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-zinc-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Request */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">Solicitação</text>
              </g>

              {/* Location Processing */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">Processamento</text>
              </g>

              {/* Driver Selection */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">Seleção Motorista</text>
              </g>

              {/* Match */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">Match</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#333333" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Fluxo de matching entre passageiros e motoristas, demonstrando o processo desde a
            solicitação até o match.
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-zinc-200">1. Sistema de Matching</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Algoritmo de Matching</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Geohash para busca espacial</li>
              <li>Quadtrees para indexação</li>
              <li>Batching de requisições</li>
              <li>Otimização multi-objetivo</li>
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">Fatores Considerados</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Distância e tempo estimado</li>
              <li>Rating do motorista</li>
              <li>Tipo de veículo</li>
              <li>Histórico de cancelamentos</li>
              <li>Demanda e oferta local</li>
            </ul>
          </div>
        </div>

        {/* Location System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-zinc-200">2. Sistema de Localização</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Processamento de Localização</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Atualização em tempo real</li>
              <li>Filtro de Kalman</li>
              <li>Map matching</li>
              <li>Predição de rotas</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Otimizações</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Cache espacial distribuído</li>
              <li>Compressão de coordenadas</li>
              <li>Batching de atualizações</li>
              <li>Sharding geográfico</li>
            </ul>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-zinc-200">3. Sistema em Tempo Real</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Infraestrutura Real-time</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>WebSocket para conexões persistentes</li>
              <li>Kafka para eventos</li>
              <li>Redis para estado em tempo real</li>
              <li>Features:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Localização em tempo real</li>
                  <li>ETA dinâmico</li>
                  <li>Surge pricing</li>
                  <li>Status da viagem</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Decisions and Trade-offs */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Decisões Técnicas e Trade-offs</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">1. Precisão vs Latência</h3>
            <p className="text-zinc-300">
              Balance entre precisão do matching e tempo de resposta.
              Uso de batching e aproximações para reduzir latência.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">2. Consistência vs Disponibilidade</h3>
            <p className="text-zinc-300">
              Preferência por disponibilidade em dados não críticos.
              Consistência forte apenas em transações financeiras.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">3. Custo vs Qualidade</h3>
            <p className="text-zinc-300">
              Otimização de recursos computacionais vs qualidade do matching.
              Uso de algoritmos adaptativos baseados na demanda.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">4. Cache vs Freshness</h3>
            <p className="text-zinc-300">
              Caching agressivo para performance vs dados atualizados.
              Invalidação seletiva baseada em relevância.
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Desafios de Escala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Matching em Massa</h3>
            <p className="text-zinc-300">
              Processamento de milhões de matches por dia.
              Solução: Sharding geográfico e batching.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Dados em Tempo Real</h3>
            <p className="text-zinc-300">
              Atualizações de localização em massa.
              Solução: Pipeline distribuído e filtros.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Consistência Global</h3>
            <p className="text-zinc-300">
              Sincronização entre regiões.
              Solução: Replicação multi-região e cache.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Picos de Demanda</h3>
            <p className="text-zinc-300">
              Handling de eventos e horários de pico.
              Solução: Auto-scaling e surge pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Evolução da Arquitetura</h2>
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2009</span>
              <h3 className="text-lg font-medium">MVP Inicial</h3>
              <p className="text-zinc-300">Monolito Ruby on Rails, matching manual.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">Primeira Escala</h3>
              <p className="text-zinc-300">Matching automático, Redis para dispatch.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2014-2015</span>
              <h3 className="text-lg font-medium">Microsserviços</h3>
              <p className="text-zinc-300">Decomposição em serviços, Kafka para eventos.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2016-2018</span>
              <h3 className="text-lg font-medium">Escala Global</h3>
              <p className="text-zinc-300">Multi-região, otimização geográfica.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2019-Presente</span>
              <h3 className="text-lg font-medium">ML e Otimização</h3>
              <p className="text-zinc-300">Machine learning para matching, predição de demanda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">Referências</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Documentação e Artigos Oficiais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://eng.uber.com/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Uber Engineering Blog</a></li>
              <li><a href="https://uber.github.io/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Uber Open Source</a></li>
              <li><a href="https://developer.uber.com/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Uber Developer Platform</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Artigos Técnicos e Análises</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://eng.uber.com/h3/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">H3: Uber's Hexagonal Hierarchical Spatial Index</a></li>
              <li><a href="https://eng.uber.com/marketplace-real-time-pricing/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Marketplace Real-time Pricing</a></li>
              <li><a href="https://eng.uber.com/engineering-an-efficient-route/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Engineering Efficient Route Planning</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Ferramentas Open Source</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://github.com/uber/h3" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">H3 - Geospatial Indexing System</a></li>
              <li><a href="https://github.com/uber/cadence" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Cadence - Workflow Engine</a></li>
              <li><a href="https://github.com/uber-go/zap" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Zap - Logging Framework</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">Conferências e Apresentações</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=nuiLcWE8sPA" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Uber's Marketplace Platform</a></li>
              <li><a href="https://www.youtube.com/watch?v=kb-m2fasdDY" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">StrangeLoop - Uber's Real-time Tech Stack</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Uber; 