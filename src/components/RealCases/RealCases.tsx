import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RealCases: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Aprenda com os Gigantes
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Mergulhe nas arquiteturas e decisões técnicas das empresas que definem o futuro da tecnologia
        </p>
      </div>

      {/* Key Benefits Section */}
      <section className="bg-zinc-900/50 rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-8">
          Por que estudar casos reais?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="text-blue-400 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-medium text-blue-400 mb-2">Aprendizado Prático</h3>
            <p className="text-zinc-300">
              Veja como problemas reais são resolvidos em escala global, com decisões e trade-offs práticos.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="text-blue-400 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-medium text-blue-400 mb-2">Evolução Técnica</h3>
            <p className="text-zinc-300">
              Entenda como sistemas evoluem de MVPs para arquiteturas que atendem bilhões de usuários.
            </p>
          </div>
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="text-blue-400 text-4xl mb-4">💡</div>
            <h3 className="text-xl font-medium text-blue-400 mb-2">Insights Valiosos</h3>
            <p className="text-zinc-300">
              Descubra padrões e práticas que podem ser aplicados em projetos de qualquer escala.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="bg-zinc-900/50 rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-8">
          Casos de Estudo em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/casos-reais/netflix" className="group">
            <div className="bg-gradient-to-br from-red-500/10 to-red-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-red-500/20 hover:to-red-700/20">
              <h3 className="text-xl font-medium text-red-400 mb-2">Netflix</h3>
              <p className="text-zinc-300 mb-4">
                Como entregar streaming de vídeo para milhões de usuários com baixa latência e alta qualidade.
              </p>
              <div className="text-red-400 group-hover:translate-x-2 transition-transform">
                Explorar →
              </div>
            </div>
          </Link>
          <Link to="/casos-reais/uber" className="group">
            <div className="bg-gradient-to-br from-zinc-500/10 to-zinc-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-zinc-500/20 hover:to-zinc-700/20">
              <h3 className="text-xl font-medium text-zinc-200 mb-2">Uber</h3>
              <p className="text-zinc-300 mb-4">
                Sistema de matching em tempo real e geolocalização em escala global.
              </p>
              <div className="text-zinc-200 group-hover:translate-x-2 transition-transform">
                Explorar →
              </div>
            </div>
          </Link>
          <Link to="/casos-reais/whatsapp" className="group">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-emerald-500/20 hover:to-emerald-700/20">
              <h3 className="text-xl font-medium text-emerald-400 mb-2">WhatsApp</h3>
              <p className="text-zinc-300 mb-4">
                Arquitetura de mensagens em tempo real com criptografia ponta a ponta.
              </p>
              <div className="text-emerald-400 group-hover:translate-x-2 transition-transform">
                Explorar →
              </div>
            </div>
          </Link>
          <Link to="/casos-reais/spotify" className="group">
            <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-green-500/20 hover:to-green-700/20">
              <h3 className="text-xl font-medium text-green-400 mb-2">Spotify</h3>
              <p className="text-zinc-300 mb-4">
                Streaming de áudio e recomendação de música em escala massiva.
              </p>
              <div className="text-green-400 group-hover:translate-x-2 transition-transform">
                Explorar →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Technical Decisions Section */}
      <section className="bg-zinc-900/50 rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-8">
          Decisões Técnicas que Mudaram o Jogo
        </h2>
        <div className="space-y-6">
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-400 font-medium">Netflix</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Open Connect</span>
            </div>
            <p className="text-zinc-300">
              Por que a Netflix decidiu construir sua própria CDN em vez de usar soluções de terceiros? 
              Uma decisão que revolucionou a entrega de conteúdo e economizou milhões em custos de banda.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-400 font-medium">WhatsApp</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Erlang</span>
            </div>
            <p className="text-zinc-300">
              A escolha do Erlang para o backend do WhatsApp permitiu que apenas 50 engenheiros 
              suportassem 1 bilhão de usuários. Uma lição sobre escolher a tecnologia certa para o problema certo.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-zinc-200 font-medium">Uber</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Geolocalização</span>
            </div>
            <p className="text-zinc-300">
              O desenvolvimento do H3, um sistema de indexação geoespacial hierárquico, 
              resolveu problemas complexos de otimização de rotas e matching em tempo real.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-green-400 font-medium">Spotify</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Microsserviços</span>
            </div>
            <p className="text-zinc-300">
              A migração para uma arquitetura de microsserviços permitiu ao Spotify escalar seus times 
              e sua infraestrutura de forma independente, acelerando a inovação.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-400 font-medium">YouTube</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Vitess</span>
            </div>
            <p className="text-zinc-300">
              O desenvolvimento do Vitess para escalar MySQL horizontalmente se tornou uma solução 
              essencial para muitas outras empresas enfrentando desafios similares de dados.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-400 font-medium">Bit.ly</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Consistência</span>
            </div>
            <p className="text-zinc-300">
              A escolha de consistência forte para URLs curtas enquanto mantém consistência eventual 
              para analytics demonstra como balancear requisitos diferentes no mesmo sistema.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default RealCases; 