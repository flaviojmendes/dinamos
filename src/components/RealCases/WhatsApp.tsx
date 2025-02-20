import React from 'react';
import { motion } from 'framer-motion';

const WhatsApp: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
          WhatsApp System Design
        </h1>
        <p className="text-xl text-zinc-400">
          Como o WhatsApp gerencia bilhões de mensagens em tempo real com criptografia ponta a ponta
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Números Impressionantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">2B+</div>
            <div className="text-sm text-zinc-400">Usuários ativos</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">100B+</div>
            <div className="text-sm text-zinc-400">Mensagens por dia</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">1B+</div>
            <div className="text-sm text-zinc-400">Grupos ativos</div>
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
              <li>Mensagens em tempo real (texto, áudio, vídeo)</li>
              <li>Criptografia ponta a ponta</li>
              <li>Grupos e broadcasts</li>
              <li>Chamadas de voz e vídeo</li>
              <li>Status e stories</li>
              <li>Sincronização multi-dispositivo</li>
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Requisitos Não-Funcionais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Latência ultra baixa (menor que 100ms)</li>
              <li>Alta disponibilidade (99.999%)</li>
              <li>Consistência eventual</li>
              <li>Segurança e privacidade</li>
              <li>Escalabilidade massiva</li>
              <li>Confiabilidade na entrega</li>
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
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#25D366" fontSize="14">Clientes (Mobile, Web, Desktop)</text>
              </g>

              {/* Load Balancer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#25D366" fontSize="14">Load Balancer</text>
              </g>

              {/* Chat Servers */}
              <g>
                <rect x="50" y="220" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="150" y="255" textAnchor="middle" fill="#25D366" fontSize="14">Servidores de Chat</text>
              </g>

              {/* Presence Servers */}
              <g>
                <rect x="300" y="220" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#25D366" fontSize="14">Servidores de Presença</text>
              </g>

              {/* Media Servers */}
              <g>
                <rect x="550" y="220" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="650" y="255" textAnchor="middle" fill="#25D366" fontSize="14">Servidores de Mídia</text>
              </g>

              {/* Authentication */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#25D366" fontSize="14">Autenticação</text>
              </g>

              {/* Key Management */}
              <g>
                <rect x="300" y="320" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#25D366" fontSize="14">Gerenciamento de Chaves</text>
              </g>

              {/* Storage Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#25D366" fontSize="12">Cassandra (Mensagens)</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#25D366" fontSize="12">Redis (Cache)</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#25D366" fontSize="12">S3 (Mídia)</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#25D366" strokeWidth="1" opacity="0.5">
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
            Visão geral da arquitetura distribuída do WhatsApp, mostrando os principais componentes
            e suas interações.
          </p>
        </div>

        {/* Message Flow Architecture */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-green-400">Fluxo de Mensagens</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Sender */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#25D366" fontSize="14">Remetente</text>
              </g>

              {/* Chat Server */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#25D366" fontSize="14">Servidor de Chat</text>
              </g>

              {/* Message Queue */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#25D366" fontSize="14">Fila de Mensagens</text>
              </g>

              {/* Receiver */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#25D366" fontSize="14">Destinatário</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#25D366" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
              </g>

              {/* Flow Indicators */}
              <g>
                <text x="225" y="180" fill="#25D366" fontSize="12">1. Encrypt</text>
                <text x="425" y="180" fill="#25D366" fontSize="12">2. Queue</text>
                <text x="625" y="180" fill="#25D366" fontSize="12">3. Deliver</text>
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            Fluxo de mensagens criptografadas, demonstrando o processo desde o envio até a entrega.
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">1. Sistema de Mensagens</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Processamento de Mensagens</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Protocolo MQTT modificado para mensagens</li>
              <li>Criptografia Signal para E2EE</li>
              <li>Compressão de mensagens</li>
              <li>Sistema de confirmação de entrega</li>
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">Tipos de Mensagens</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Texto e emojis</li>
              <li>Mídia (imagens, áudio, vídeo)</li>
              <li>Documentos e arquivos</li>
              <li>Localização e contatos</li>
              <li>Mensagens temporárias</li>
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">2. Sistema de Armazenamento</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Armazenamento de Mensagens</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>Cassandra para mensagens criptografadas</li>
              <li>Redis para cache e sessões</li>
              <li>S3 para mídia e backups</li>
              <li>Retenção seletiva de mensagens</li>
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">Banco de Dados</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>MySQL para dados de usuário</li>
              <li>RocksDB para armazenamento local</li>
              <li>Kafka para eventos e logs</li>
              <li>ElasticSearch para busca</li>
            </ul>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">3. Sistema de Tempo Real</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">Infraestrutura Real-time</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>WebSocket para conexões persistentes</li>
              <li>MQTT para mensagens em tempo real</li>
              <li>Sistema de presença distribuído</li>
              <li>Features em tempo real:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Status online/offline</li>
                  <li>Digitando...</li>
                  <li>Confirmação de leitura</li>
                  <li>Sincronização multi-dispositivo</li>
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
            <h3 className="text-lg font-medium text-green-400 mb-2">1. Privacidade vs Funcionalidade</h3>
            <p className="text-zinc-300">
              Criptografia E2EE garante privacidade mas limita features como busca global e backup em nuvem.
              WhatsApp prioriza privacidade sobre funcionalidades avançadas.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">2. Latência vs Consistência</h3>
            <p className="text-zinc-300">
              Uso de consistência eventual permite entrega rápida de mensagens,
              mas pode resultar em mensagens fora de ordem em casos raros.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">3. Storage vs Retenção</h3>
            <p className="text-zinc-300">
              Mensagens são armazenadas temporariamente nos servidores até a entrega,
              reduzindo custos de storage mas limitando funcionalidades offline.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">4. Simplicidade vs Recursos</h3>
            <p className="text-zinc-300">
              Interface e funcionalidades mantidas simples para garantir performance e usabilidade,
              mesmo que isso signifique menos recursos que concorrentes.
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Desafios de Escala</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Entrega em Massa</h3>
            <p className="text-zinc-300">
              Entrega de mensagens para bilhões de usuários.
              Solução: Sistema de filas distribuído e otimização de rotas.
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Gerenciamento de Conexões</h3>
            <p className="text-zinc-300">
              Manutenção de milhões de conexões simultâneas.
              Solução: MQTT otimizado e load balancing inteligente.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Sincronização</h3>
            <p className="text-zinc-300">
              Sincronização entre múltiplos dispositivos.
              Solução: Sistema de versionamento e merge de estados.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">Grupos Grandes</h3>
            <p className="text-zinc-300">
              Gerenciamento de grupos com milhares de membros.
              Solução: Otimização de broadcasts e cache de mensagens.
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">Evolução da Arquitetura</h2>
        <div className="space-y-6">
          {/* 2009: Initial Version */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2009</span>
              <h3 className="text-lg font-medium">Versão Inicial</h3>
              <p className="text-zinc-300">App iOS simples, focado em status.</p>
            </div>
          </div>

          {/* 2011-2012: Basic Messaging */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">Mensagens Básicas</h3>
              <p className="text-zinc-300">Implementação de chat, XMPP modificado.</p>
            </div>
          </div>

          {/* 2014: Acquisition & Scale */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2014</span>
              <h3 className="text-lg font-medium">Aquisição Facebook</h3>
              <p className="text-zinc-300">Escala massiva, migração infraestrutura.</p>
            </div>
          </div>

          {/* 2016: End-to-End Encryption */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2016</span>
              <h3 className="text-lg font-medium">Criptografia E2E</h3>
              <p className="text-zinc-300">Implementação do protocolo Signal.</p>
            </div>
          </div>

          {/* 2019-Present: Multi-Device */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2019-Presente</span>
              <h3 className="text-lg font-medium">Multi-Dispositivo</h3>
              <p className="text-zinc-300">Suporte nativo multi-device, nova arquitetura de sync.</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500">Referências</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">Documentação e Artigos Oficiais</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://engineering.fb.com/category/whatsapp/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Engineering Blog</a></li>
              <li><a href="https://www.whatsapp.com/security/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Security</a></li>
              <li><a href="https://developers.facebook.com/docs/whatsapp/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Business API</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">Artigos Técnicos e Análises</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Encryption Overview</a></li>
              <li><a href="https://engineering.fb.com/2014/10/09/production-engineering/scaling-mercurial-at-facebook/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Scaling WhatsApp Infrastructure</a></li>
              <li><a href="https://signal.org/docs/specifications/doubleratchet/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Signal Protocol Specification</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">Conferências e Apresentações</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=vvhC64hQZMk" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">F8 - WhatsApp Business Platform</a></li>
              <li><a href="https://www.youtube.com/watch?v=5DgVkKHxKQk" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Real-time Messaging Architecture</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">Segurança e Privacidade</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.whatsapp.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Privacy Policy</a></li>
              <li><a href="https://scontent.whatsapp.net/v/t39.8562-34/316546300_547692750646518_7299107161331633308_n.pdf?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=t_1sHkqHzr4AX9QJTP-&_nc_ht=scontent.whatsapp.net&oh=01_AdTz6KJ_MWwjY_lQh6MH1_BPmXiC_1kdpvnNvCXcaHsUxw&oe=65C2F7C1" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">End-to-End Encryption Technical Paper</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default WhatsApp; 
