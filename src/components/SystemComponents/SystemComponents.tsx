export default function SystemComponents() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Componentes de um Sistema
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Os sistemas modernos de grande escala são compostos por vários componentes que trabalham juntos para 
          garantir desempenho, escalabilidade e disponibilidade. Nesta seção, exploraremos os principais 
          componentes que formam a espinha dorsal de sistemas distribuídos.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bancos de Dados */}
          <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Bancos de Dados
            </h3>
            <p className="text-zinc-300">
              Sistemas de armazenamento e gerenciamento de dados, incluindo bancos relacionais (SQL), 
              NoSQL, e estratégias de sharding e replicação.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div>• Bancos de Dados Relacionais (SQL)</div>
              <div>• Bancos de Dados NoSQL</div>
              <div>• Sharding e Particionamento</div>
              <div>• Replicação</div>
            </div>
          </div>

          {/* Cache */}
          <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Cache
            </h3>
            <p className="text-zinc-300">
              Estratégias e sistemas de cache para melhorar o desempenho e reduzir a carga em bancos de dados.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div>• Memcached</div>
              <div>• Redis</div>
              <div>• Cache Distribuído vs. Local</div>
            </div>
          </div>

          {/* Balanceadores de Carga */}
          <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Balanceadores de Carga
            </h3>
            <p className="text-zinc-300">
              Distribuição eficiente de tráfego entre múltiplos servidores para otimizar recursos e garantir disponibilidade.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div>• Round Robin</div>
              <div>• Hashing</div>
              <div>• Least Connections</div>
            </div>
          </div>

          {/* Message Queues */}
          <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              Filas de Mensagens
            </h3>
            <p className="text-zinc-300">
              Sistemas de mensageria para comunicação assíncrona e processamento distribuído.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div>• Kafka</div>
              <div>• RabbitMQ</div>
              <div>• Amazon SQS</div>
              <div>• Pub/Sub vs. Filas</div>
            </div>
          </div>

          {/* CDN */}
          <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              CDN
            </h3>
            <p className="text-zinc-300">
              Redes de distribuição de conteúdo para melhorar a latência e disponibilidade global.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div>• Funcionamento</div>
              <div>• Benefícios</div>
              <div>• Casos de Uso</div>
            </div>
          </div>

          {/* API Gateways */}
          <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">
              API Gateways
            </h3>
            <p className="text-zinc-300">
              Gerenciamento e controle centralizado de APIs em arquiteturas distribuídas.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-400">
              <div>• Autenticação e Autorização</div>
              <div>• Roteamento</div>
              <div>• Rate Limiting</div>
              <div>• Agregação de Respostas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 