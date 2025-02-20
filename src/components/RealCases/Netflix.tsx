import React from 'react';
import { motion } from 'framer-motion';

const Netflix: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          Netflix System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Como a Netflix entrega streaming de vídeo em alta qualidade para milhões de usuários globalmente
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Números Impressionantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">230M+</div>
            <div className="text-sm text-zinc-400">Assinantes globais</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">1B+</div>
            <div className="text-sm text-zinc-400">Horas de streaming por dia</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">15%</div>
            <div className="text-sm text-zinc-400">Do tráfego global de internet</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Requisitos do Sistema</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Requisitos Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Streaming de vídeo adaptativo</li>
              <li>Sistema de recomendação personalizado</li>
              <li>Catálogo de conteúdo global</li>
              <li>Múltiplos perfis por conta</li>
              <li>Continue assistindo cross-device</li>
              <li>Downloads offline</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Requisitos Não-Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Baixa latência no início do vídeo (menor que 500ms)</li>
              <li>Alta disponibilidade (99.99%)</li>
              <li>Qualidade adaptativa de vídeo</li>
              <li>Escalabilidade global</li>
              <li>Segurança de conteúdo (DRM)</li>
              <li>Eficiência em custos de CDN</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Arquitetura do Sistema</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-red-400">Arquitetura de Alto Nível</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-red-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#E50914" fontSize="14">Clientes (TV, Mobile, Web)</text>
              </g>

              {/* CDN Layer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#E50914" fontSize="14">Open Connect (CDN)</text>
              </g>

              {/* Control Plane */}
              <g>
                <rect x="250" y="220" width="300" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#E50914" fontSize="14">API Gateway</text>
              </g>

              {/* Application Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#E50914" fontSize="14">Serviço de Streaming</text>

                <rect x="300" y="320" width="200" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#E50914" fontSize="14">Serviço de Recomendação</text>

                <rect x="550" y="320" width="200" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="650" y="355" textAnchor="middle" fill="#E50914" fontSize="14">Serviço de Metadados</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#E50914" fontSize="12">S3 (Vídeos)</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#E50914" fontSize="12">Cassandra (Metadados)</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#E50914" fontSize="12">EVCache (Cache)</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#E50914" strokeWidth="1" opacity="0.5">
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
            Visão geral da arquitetura distribuída da Netflix, mostrando os principais componentes
            e suas interações.
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">1. Sistema de Streaming</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Open Connect (CDN)</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>CDN própria otimizada para vídeo</li>
              <li>Appliances em ISPs parceiros</li>
              <li>Cache hierárquico</li>
              <li>Otimização de rota</li>
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">Processamento de Vídeo</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Transcodificação paralela</li>
              <li>Múltiplas qualidades (SD até 4K)</li>
              <li>Segmentação adaptativa</li>
              <li>DRM e proteção de conteúdo</li>
            </ul>
          </div>
        </div>

        {/* Recommendation System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">2. Sistema de Recomendação</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Algoritmos</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Collaborative Filtering</li>
              <li>Content-based Filtering</li>
              <li>Personalização por perfil</li>
              <li>A/B Testing contínuo</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Features</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Histórico de visualização</li>
              <li>Preferências de gênero</li>
              <li>Comportamento de navegação</li>
              <li>Contexto (dispositivo, horário)</li>
            </ul>
          </div>
        </div>

        {/* Data Processing */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">3. Processamento de Dados</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Pipeline de Dados</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Kafka para streaming de eventos</li>
              <li>Spark para processamento batch</li>
              <li>Flink para processamento real-time</li>
              <li>Features:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Telemetria de qualidade</li>
                  <li>Analytics de visualização</li>
                  <li>Métricas de engajamento</li>
                  <li>Detecção de anomalias</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Decisions and Trade-offs */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Decisões Técnicas e Trade-offs</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">1. CDN Própria vs. Terceiros</h3>
            <p className="text-zinc-300">
              Open Connect oferece maior controle e otimização, mas requer investimento
              significativo em infraestrutura e manutenção.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">2. Qualidade vs. Largura de Banda</h3>
            <p className="text-zinc-300">
              Streaming adaptativo equilibra qualidade de vídeo com condições de rede,
              priorizando continuidade da reprodução.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">3. Personalização vs. Performance</h3>
            <p className="text-zinc-300">
              Recomendações altamente personalizadas requerem processamento intensivo.
              Uso de cache e pré-computação reduz latência.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">4. Consistência vs. Disponibilidade</h3>
            <p className="text-zinc-300">
              Preferência por disponibilidade sobre consistência forte para metadados não críticos,
              permitindo melhor experiência offline.
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Desafios de Escala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Tráfego Global</h3>
            <p className="text-zinc-300">
              Otimização de entrega de conteúdo globalmente.
              Solução: Open Connect e cache distribuído.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Processamento de Vídeo</h3>
            <p className="text-zinc-300">
              Transcodificação de milhares de horas de conteúdo.
              Solução: Pipeline paralelo e distribuído.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Machine Learning</h3>
            <p className="text-zinc-300">
              Recomendações personalizadas em escala.
              Solução: Modelos distribuídos e cache inteligente.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Microserviços</h3>
            <p className="text-zinc-300">
              Gerenciamento de centenas de serviços.
              Solução: Chaos Engineering e resiliência.
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Evolução da Arquitetura</h2>
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2007</span>
              <h3 className="text-lg font-medium">Início do Streaming</h3>
              <p className="text-zinc-300">Lançamento do streaming, infraestrutura básica.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2009-2010</span>
              <h3 className="text-lg font-medium">Migração para AWS</h3>
              <p className="text-zinc-300">Mudança para cloud, início da escala global.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">Microsserviços</h3>
              <p className="text-zinc-300">Decomposição do monolito, introdução do Chaos Monkey.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2012-2016</span>
              <h3 className="text-lg font-medium">Open Connect</h3>
              <p className="text-zinc-300">Desenvolvimento da CDN própria, expansão global.</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2016-Presente</span>
              <h3 className="text-lg font-medium">Streaming Adaptativo e ML</h3>
              <p className="text-zinc-300">Foco em qualidade e personalização com ML avançado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Referências</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Documentação e Artigos Oficiais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://netflixtechblog.com/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix Tech Blog</a></li>
              <li><a href="https://netflix.github.io/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix Open Source</a></li>
              <li><a href="https://about.netflix.com/en/news/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix ISP Infrastructure</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Artigos Técnicos e Análises</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://netflixtechblog.com/netflix-at-velocity-2015-89c1794da400" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix's Global Infrastructure</a></li>
              <li><a href="https://netflixtechblog.com/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience-c40c25b3b9fb" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Content Delivery Network</a></li>
              <li><a href="https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Recommendation System</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Ferramentas Open Source</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://github.com/Netflix/hystrix" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Hystrix - Latency and Fault Tolerance</a></li>
              <li><a href="https://github.com/Netflix/zuul" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Zuul - Gateway Service</a></li>
              <li><a href="https://github.com/Netflix/eureka" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Eureka - Service Discovery</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Conferências e Apresentações</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=CZ3wIuvmHeM" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Netflix Cloud Architecture</a></li>
              <li><a href="https://www.youtube.com/watch?v=uCXv4gl2JT0" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">AWS re:Invent - Netflix on AWS</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Netflix; 