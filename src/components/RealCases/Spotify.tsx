import React from 'react';
import { motion } from 'framer-motion';

const Spotify: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
          Spotify System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Como o Spotify gerencia, processa e distribui milhões de músicas em tempo real globalmente
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Números Impressionantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">450M+</div>
            <div className="text-sm text-zinc-400">Usuários ativos mensais</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">100B+</div>
            <div className="text-sm text-zinc-400">Streams por dia</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">80M+</div>
            <div className="text-sm text-zinc-400">Músicas no catálogo</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Requisitos do Sistema</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Requisitos Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Streaming de áudio em tempo real</li>
              <li>Sincronização entre dispositivos</li>
              <li>Sistema de recomendação personalizado</li>
              <li>Gerenciamento de playlists e biblioteca</li>
              <li>Funcionalidades sociais (seguir, compartilhar)</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Requisitos Não-Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Baixa latência (menor que 100ms para início da música)</li>
              <li>Alta disponibilidade (99.99%)</li>
              <li>Consistência eventual para dados sociais</li>
              <li>Escalabilidade horizontal</li>
              <li>Tolerância a falhas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Arquitetura do Sistema</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-green-400">Arquitetura de Alto Nível</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#1DB954" fontSize="14">Clientes (Web, Mobile, Desktop)</text>
              </g>

              {/* CDN Layer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#1DB954" fontSize="14">CDN e Edge Cache</text>
              </g>

              {/* Load Balancer */}
              <g>
                <rect x="250" y="220" width="300" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#1DB954" fontSize="14">Load Balancer</text>
              </g>

              {/* Application Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#1DB954" fontSize="14">Serviço de Streaming</text>

                <rect x="300" y="320" width="200" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#1DB954" fontSize="14">Serviço de Recomendação</text>

                <rect x="550" y="320" width="200" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="650" y="355" textAnchor="middle" fill="#1DB954" fontSize="14">Serviço de Metadados</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#1DB954" fontSize="12">S3 (Áudio)</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#1DB954" fontSize="12">Cassandra (Metadados)</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#1DB954" fontSize="12">Redis (Cache)</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#1DB954" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="380" x2="650" y2="420" />
                <line x1="150" y1="320" x2="650" y2="320" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Visão geral da arquitetura distribuída do Spotify, mostrando os principais componentes
            e suas interações.
          </p>
        </div>

        {/* Streaming Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-green-400">Arquitetura de Streaming</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Client */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">Cliente Spotify</text>
              </g>

              {/* Edge Cache */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">Edge Cache</text>
              </g>

              {/* Streaming Service */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">Serviço de Streaming</text>
              </g>

              {/* Storage */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">Storage (S3)</text>
              </g>

              {/* Processing Components */}
              <g>
                <rect x="450" y="280" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="525" y="315" textAnchor="middle" fill="#1DB954" fontSize="14">Transcodificação</text>

                <rect x="650" y="280" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="725" y="315" textAnchor="middle" fill="#1DB954" fontSize="14">Processamento</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#1DB954" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
                <line x1="725" y1="230" x2="725" y2="280" />
                <line x1="525" y1="230" x2="525" y2="280" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Fluxo de streaming de áudio, demonstrando como o conteúdo é entregue aos usuários
            através de edge caching e transcodificação adaptativa.
          </p>
        </div>

        {/* Audio Streaming */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">1. Sistema de Streaming</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Pipeline de Streaming</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Protocolo HLS (HTTP Live Streaming) para entrega de áudio</li>
              <li>Chunks de áudio de 2-10 segundos</li>
              <li>Múltiplas qualidades de áudio (16-320kbps)</li>
              <li>Buffering adaptativo baseado na conexão</li>
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">Processamento de Áudio</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Transcodificação para múltiplos formatos (AAC, Ogg Vorbis)</li>
              <li>Normalização de volume (ReplayGain)</li>
              <li>Análise de áudio para features musicais</li>
              <li>Geração de waveforms e previews</li>
              <li>DRM e proteção de conteúdo</li>
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">2. Sistema de Armazenamento</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Armazenamento de Áudio</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Amazon S3 para armazenamento de músicas</li>
              <li>CDN para cache global de conteúdo popular</li>
              <li>Sistema de arquivos distribuído próprio</li>
              <li>Metadata em Cassandra para alta disponibilidade</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Banco de Dados</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>PostgreSQL para dados transacionais</li>
              <li>Cassandra para dados distribuídos</li>
              <li>Redis para caching e sessões</li>
              <li>Kafka para streaming de eventos</li>
            </ul>
          </div>
        </div>

        {/* Recommendation System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">3. Sistema de Recomendação</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Algoritmos e Features</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Collaborative Filtering em larga escala</li>
              <li>Análise de áudio para similaridade musical</li>
              <li>Natural Language Processing para análise de letras</li>
              <li>Features consideradas:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Histórico de reprodução</li>
                  <li>Playlists seguidas</li>
                  <li>Gêneros preferidos</li>
                  <li>Contexto (hora do dia, dispositivo)</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">4. Funcionalidades em Tempo Real</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Infraestrutura Real-time</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>WebSocket para sincronização entre dispositivos</li>
              <li>Pub/Sub com Kafka para eventos em tempo real</li>
              <li>Estado de reprodução distribuído</li>
              <li>Features em tempo real:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Controle remoto entre dispositivos</li>
                  <li>Sessões colaborativas</li>
                  <li>Status de atividade de amigos</li>
                  <li>Notificações instantâneas</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Decisions and Trade-offs */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Decisões Técnicas e Trade-offs</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">1. Buffering vs Latência</h3>
            <p className="text-zinc-300">
              Spotify utiliza buffering adaptativo que equilibra a latência inicial com a qualidade do streaming.
              Mais buffer significa menos interrupções mas maior latência no início da reprodução.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">2. Caching vs Storage</h3>
            <p className="text-zinc-300">
              Músicas populares são cacheadas em edge locations, reduzindo latência mas aumentando custos de storage.
              O sistema usa análise preditiva para determinar o que cachear.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">3. Consistência vs Disponibilidade</h3>
            <p className="text-zinc-300">
              Uso de consistência eventual para playlists e biblioteca permite melhor disponibilidade,
              mas pode resultar em inconsistências temporárias entre dispositivos.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">4. Qualidade vs Bandwidth</h3>
            <p className="text-zinc-300">
              Múltiplas qualidades de áudio permitem adaptação à conexão do usuário,
              mas requerem mais storage e complexidade na transcodificação.
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Desafios de Escala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Latência Global</h3>
            <p className="text-zinc-300">
              Entrega de áudio com baixa latência globalmente.
              Solução: Rede de CDNs e edge caching estratégico.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Dados Distribuídos</h3>
            <p className="text-zinc-300">
              Sincronização de dados entre regiões e dispositivos.
              Solução: Cassandra para dados distribuídos e Kafka para eventos.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Machine Learning</h3>
            <p className="text-zinc-300">
              Processamento de ML em tempo real para milhões de usuários.
              Solução: Pipeline distribuído de ML com pré-computação.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Microserviços</h3>
            <p className="text-zinc-300">
              Gerenciamento de centenas de microserviços.
              Solução: Backstage para developer portal e gestão de serviços.
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Evolução da Arquitetura</h2>
        <div className="space-y-6">
          {/* 2006: Initial Architecture */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2006</span>
              <h3 className="text-lg font-medium">Arquitetura Inicial</h3>
              <p className="text-zinc-300">Monolito PHP com PostgreSQL, focado no mercado sueco.</p>
            </div>
          </div>

          {/* 2008-2009: First Scaling */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2008-2009</span>
              <h3 className="text-lg font-medium">Primeira Escala</h3>
              <p className="text-zinc-300">Migração para Python/C++, introdução de cache distribuído.</p>
            </div>
          </div>

          {/* 2011-2012: Microservices */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">Era dos Microserviços</h3>
              <p className="text-zinc-300">Adoção de microserviços, migração para AWS.</p>
            </div>
          </div>

          {/* 2014-2015: Event-Driven */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2014-2015</span>
              <h3 className="text-lg font-medium">Arquitetura Event-Driven</h3>
              <p className="text-zinc-300">Implementação do Kafka, processamento assíncrono.</p>
            </div>
          </div>

          {/* 2016-Present: Cloud Native */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2016-Presente</span>
              <h3 className="text-lg font-medium">Cloud Native e ML</h3>
              <p className="text-zinc-300">Kubernetes, ML em larga escala, Backstage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Referências</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Documentação e Artigos Oficiais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://engineering.atspotify.com/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Spotify Engineering Blog</a></li>
              <li><a href="https://spotify.design/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Spotify Design</a></li>
              <li><a href="https://developer.spotify.com/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Spotify for Developers</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Artigos Técnicos e Análises</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://engineering.atspotify.com/2013/03/backend-infrastructure-at-spotify/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Backend Infrastructure at Spotify</a></li>
              <li><a href="https://engineering.atspotify.com/2015/01/spotifys-event-delivery-the-road-to-the-cloud-part-i/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Event Delivery System</a></li>
              <li><a href="https://engineering.atspotify.com/2016/02/spotifys-big-data-ecosystem/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Big Data Ecosystem</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Conferências e Apresentações</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=Xr2soUVHxG8" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Spotify's Audio Delivery at Scale</a></li>
              <li><a href="https://www.youtube.com/watch?v=Z2JzVxP4H4w" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">InfoQ - Scaling Spotify</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Ferramentas Open Source</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://backstage.io/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Backstage - Developer Portal</a></li>
              <li><a href="https://github.com/spotify/luigi" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Luigi - Workflow Management</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Spotify; 
