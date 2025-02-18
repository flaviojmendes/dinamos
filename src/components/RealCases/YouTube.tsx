import React from 'react';
import { motion } from 'framer-motion';

const YouTube: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          YouTube System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Como o YouTube processa, armazena e distribui bilhões de vídeos globalmente
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Números Impressionantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">2.7B+</div>
            <div className="text-sm text-zinc-400">Usuários ativos mensais</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">500h+</div>
            <div className="text-sm text-zinc-400">De vídeo enviados por minuto</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">1B+</div>
            <div className="text-sm text-zinc-400">Horas assistidas por dia</div>
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
              <li>Upload de vídeos em múltiplos formatos</li>
              <li>Processamento e transcodificação de vídeos</li>
              <li>Streaming de vídeo com múltiplas qualidades</li>
              <li>Sistema de recomendação personalizado</li>
              <li>Funcionalidades sociais (likes, comentários, inscrições)</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Requisitos Não-Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Alta disponibilidade (99.99%)</li>
              <li>Baixa latência global</li>
              <li>Consistência eventual</li>
              <li>Escalabilidade horizontal massiva</li>
              <li>Durabilidade dos dados</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Arquitetura do Sistema</h2>
        
        {/* Video Upload & Processing */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">1. Upload e Processamento de Vídeos</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Pipeline de Upload</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Uploads são divididos em chunks e enviados paralelamente via protocolo DASH</li>
              <li>Cada chunk é verificado para integridade e malware</li>
              <li>Metadata é armazenada no BigTable</li>
              <li>Vídeos são temporariamente armazenados no Google Cloud Storage</li>
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">Processamento de Vídeo</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Sistema distribuído de processamento usando Kubernetes</li>
              <li>Transcodificação para múltiplos formatos (MP4, WebM) e resoluções (144p até 8K)</li>
              <li>Geração de thumbnails automática</li>
              <li>Extração de metadados (duração, resolução, codecs)</li>
              <li>Análise de conteúdo via ML para classificação e moderação</li>
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">2. Sistema de Armazenamento</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Armazenamento de Vídeos</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Colossus: Sistema de arquivos distribuído do Google</li>
              <li>Replicação geográfica para durabilidade</li>
              <li>Chunks de 64MB para otimização de streaming</li>
              <li>Metadata armazenada em Bigtable para acesso rápido</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Banco de Dados</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Vitess (MySQL distribuído) para dados relacionais</li>
              <li>BigTable para metadados e dados de acesso frequente</li>
              <li>Spanner para dados globalmente consistentes</li>
            </ul>
          </div>
        </div>

        {/* CDN and Video Delivery */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">3. Distribuição de Conteúdo</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Infraestrutura de CDN</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Google Global Cache (GGC) em milhares de localizações</li>
              <li>Edge locations próximas aos usuários finais</li>
              <li>Protocolo QUIC para streaming otimizado</li>
              <li>Load balancing inteligente baseado em:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Localização do usuário</li>
                  <li>Carga do servidor</li>
                  <li>Capacidade de rede</li>
                  <li>Cache hit ratio</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Recommendation System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">4. Sistema de Recomendação</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Arquitetura de ML</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Processamento em duas fases:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Candidate Generation: Seleciona milhares de vídeos potenciais</li>
                  <li>Ranking: Ordena os candidatos usando deep learning</li>
                </ul>
              </li>
              <li>Features consideradas:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Histórico de visualização</li>
                  <li>Dados demográficos</li>
                  <li>Tendências atuais</li>
                  <li>Engajamento do vídeo</li>
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
            <h3 className="text-lg font-medium text-red-400 mb-2">1. Consistência Eventual vs Forte</h3>
            <p className="text-zinc-300">
              YouTube optou por consistência eventual para contadores (views, likes) priorizando disponibilidade e performance. 
              Isso permite atualizações assíncronas e melhor escalabilidade, embora signifique que os números podem não ser 
              precisos em tempo real.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">2. Processamento Assíncrono</h3>
            <p className="text-zinc-300">
              O processamento de vídeos é feito de forma assíncrona, permitindo que uploads sejam confirmados rapidamente. 
              Isso melhora a experiência do usuário mas significa que os vídeos não estão disponíveis imediatamente após o upload.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">3. Caching Agressivo</h3>
            <p className="text-zinc-300">
              Videos populares são cacheados em múltiplas edge locations, reduzindo latência e custos de bandwidth. 
              O trade-off é o maior uso de storage e complexidade na invalidação de cache.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">4. Qualidade Adaptativa</h3>
            <p className="text-zinc-300">
              O streaming adaptativo (ABR) ajusta a qualidade do vídeo baseado na conexão do usuário. 
              Isso garante melhor experiência mas requer mais storage para múltiplas versões do mesmo vídeo.
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">Desafios de Escala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Storage</h3>
            <p className="text-zinc-300">
              Gerenciamento de exabytes de dados com replicação geográfica e necessidade de acesso rápido.
              Solução: Sistema de arquivos distribuído Colossus com políticas de retenção inteligentes.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Processamento</h3>
            <p className="text-zinc-300">
              Transcodificação de milhares de horas de vídeo por minuto.
              Solução: Pipeline distribuído com auto-scaling e priorização de jobs.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Bandwidth</h3>
            <p className="text-zinc-300">
              Distribuição de petabytes de dados diariamente.
              Solução: Rede global de CDNs e protocolo QUIC otimizado.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">Consistência</h3>
            <p className="text-zinc-300">
              Manter dados consistentes globalmente.
              Solução: Uso de Spanner para dados críticos e consistência eventual para contadores.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Evolution Diagrams */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Diagramas de Evolução</h2>
        
        {/* 2005: Monolithic Architecture */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2005: Arquitetura Monolítica</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 800 200">
              {/* Users */}
              <g transform="translate(50,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Usuários</text>
              </g>
              {/* Web Server */}
              <g transform="translate(250,80)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Web Server</text>
              </g>
              {/* MySQL */}
              <g transform="translate(470,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">MySQL</text>
              </g>
              {/* Storage */}
              <g transform="translate(670,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Storage</text>
              </g>
              {/* Connections */}
              <line x1="150" y1="100" x2="250" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="100" x2="470" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="100" x2="670" y2="100" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* 2008: Distributed Architecture */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2008: Arquitetura Distribuída</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 800 300">
              {/* Users */}
              <g transform="translate(50,140)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Usuários</text>
              </g>
              {/* Load Balancer */}
              <g transform="translate(250,140)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Load Balancer</text>
              </g>
              {/* Web Servers */}
              <g transform="translate(470,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Web Server</text>
              </g>
              <g transform="translate(470,140)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Web Server</text>
              </g>
              <g transform="translate(470,200)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Web Server</text>
              </g>
              {/* BigTable */}
              <g transform="translate(670,110)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">BigTable</text>
              </g>
              {/* GFS */}
              <g transform="translate(670,170)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">GFS</text>
              </g>
              {/* Connections */}
              <line x1="150" y1="160" x2="250" y2="160" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="160" x2="470" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="160" x2="470" y2="160" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="160" x2="470" y2="220" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="100" x2="670" y2="130" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="160" x2="670" y2="130" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="220" x2="670" y2="130" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="100" x2="670" y2="190" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="160" x2="670" y2="190" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="220" x2="670" y2="190" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* 2020+: Modern Architecture */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2020+: Arquitetura Moderna</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 800 400">
              {/* Users */}
              <g transform="translate(50,180)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">Usuários</text>
              </g>
              {/* CDN */}
              <g transform="translate(250,180)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Global CDN</text>
              </g>
              {/* Load Balancer */}
              <g transform="translate(450,180)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Load Balancer</text>
              </g>
              {/* Microservices */}
              <g transform="translate(650,80)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Upload Service</text>
              </g>
              <g transform="translate(650,140)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Transcode</text>
              </g>
              <g transform="translate(650,200)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">ML Service</text>
              </g>
              <g transform="translate(650,260)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Analytics</text>
              </g>
              <g transform="translate(650,320)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">Search</text>
              </g>
              {/* Connections */}
              <line x1="150" y1="200" x2="250" y2="200" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="200" x2="450" y2="200" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="160" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="220" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="280" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="340" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Architectural Journey */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-6 mb-8">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Jornada Arquitetural: Contexto e Decisões</h2>
        
        {/* 2005-2006: Early Days */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2005-2006: Os Primeiros Dias</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">Arquitetura Monolítica</h4>
                <p className="text-zinc-300">
                  O YouTube começou com uma arquitetura simples e monolítica por várias razões:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-zinc-300">
                  <li>Velocidade de desenvolvimento e iteração rápida</li>
                  <li>Base de usuários inicial menor e mais gerenciável</li>
                  <li>Simplicidade de deploy e manutenção</li>
                  <li>Recursos limitados da startup</li>
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-zinc-400 italic">
                "No início, o YouTube processava apenas 2-3 vídeos por minuto. A arquitetura monolítica era suficiente para 
                lidar com essa carga e permitia que a equipe se concentrasse em product-market fit."
              </p>
            </div>
          </div>
        </div>

        {/* 2006-2008: Google Acquisition and Scale */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2006-2008: Aquisição Google e Escala</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">Transição para Sistemas Distribuídos</h4>
                <p className="text-zinc-300">
                  A aquisição pelo Google trouxe desafios e oportunidades de escala sem precedentes:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-zinc-300">
                  <li>Migração para infraestrutura Google (GFS e BigTable)</li>
                  <li>Introdução de load balancing para distribuir carga</li>
                  <li>Separação de concerns em serviços distintos</li>
                  <li>Implementação de caching distribuído</li>
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-zinc-400 italic">
                "A mudança para BigTable foi crucial pois o MySQL não conseguia mais lidar com o volume de metadados. 
                O sistema precisava gerenciar bilhões de vídeos e suas relações."
              </p>
            </div>
          </div>
        </div>

        {/* 2008-2015: Scaling Challenges */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2008-2015: Desafios de Escala</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">Evolução e Otimização</h4>
                <p className="text-zinc-300">
                  Este período foi marcado por grandes desafios técnicos e inovações:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-zinc-300">
                  <li>Desenvolvimento do sistema de recomendação baseado em ML</li>
                  <li>Implementação de streaming adaptativo para diferentes qualidades</li>
                  <li>Criação da rede global de CDNs (Google Global Cache)</li>
                  <li>Otimização do protocolo de streaming (QUIC)</li>
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-zinc-400 italic">
                "A introdução do QUIC reduziu a latência de streaming em 30% e melhorou significativamente 
                a experiência em redes móveis instáveis."
              </p>
            </div>
          </div>
        </div>

        {/* 2015-Present: Modern Era */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">2015-Presente: Era Moderna</h3>
          <div className="bg-zinc-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">Arquitetura Moderna e Inovações</h4>
                <p className="text-zinc-300">
                  A arquitetura atual reflete anos de evolução e aprendizado:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-zinc-300">
                  <li>Microserviços especializados para cada funcionalidade</li>
                  <li>Sistema de ML avançado para recomendações personalizadas</li>
                  <li>Processamento em tempo real de analytics</li>
                  <li>Suporte a formatos modernos (8K, HDR)</li>
                  <li>Otimização contínua de bandwidth e storage</li>
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-zinc-400 italic">
                "A arquitetura moderna do YouTube processa mais de 500 horas de vídeo por minuto, 
                servindo conteúdo personalizado para mais de 2 bilhões de usuários mensais."
              </p>
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        <div className="mt-8 bg-gradient-to-r from-red-500/10 to-red-700/10 rounded-lg p-6">
          <h3 className="text-xl font-medium text-red-400 mb-4">Principais Aprendizados</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-zinc-300">
                Comece simples e evolua baseado em necessidades reais, não em especulações
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-zinc-300">
                Invista em infraestrutura distribuída quando o monolito começar a mostrar limitações
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-zinc-300">
                Otimize para os casos de uso mais comuns e aceite trade-offs para casos edge
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-zinc-300">
                A experiência do usuário deve guiar decisões arquiteturais, não apenas eficiência técnica
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-gradient-to-r from-red-500/10 to-red-700/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Evolução da Arquitetura</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2005</div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg text-zinc-300">
              Lançamento inicial com arquitetura monolítica e MySQL
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2006</div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg text-zinc-300">
              Aquisição pelo Google e migração para infraestrutura Google
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2008</div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg text-zinc-300">
              Introdução do BigTable e sistema de processamento distribuído
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2012</div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg text-zinc-300">
              Migração para HTML5 e introdução do sistema de recomendação ML
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2015</div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg text-zinc-300">
              Adoção do QUIC e melhorias no streaming adaptativo
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2020+</div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-lg text-zinc-300">
              Suporte a 8K, HDR e otimizações de ML em larga escala
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default YouTube; 
