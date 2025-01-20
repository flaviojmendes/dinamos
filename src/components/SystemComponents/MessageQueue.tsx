export default function MessageQueue() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Filas de Mensagens
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Filas de mensagens são sistemas usados para comunicação assíncrona entre diferentes partes de um sistema, 
          garantindo que mensagens possam ser enviadas e processadas de forma confiável.
        </p>

        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Kafka</h3>
            <p className="text-zinc-200">
              Um sistema de mensagens distribuído projetado para processar grandes volumes de dados em tempo real. 
              Usado em pipelines de dados e sistemas de streaming.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">RabbitMQ</h3>
            <p className="text-zinc-200">
              Um broker de mensagens que suporta uma ampla variedade de padrões de mensagens, como filas e troca 
              de mensagens, usado para comunicação entre microsserviços.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Amazon SQS</h3>
            <p className="text-zinc-200">
              Serviço de fila de mensagens da AWS, que oferece uma solução de fila escalável e gerenciada na nuvem.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Pub/Sub e Sistemas de Fila
        </h2>

        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Pub/Sub (Publicação/Assinatura)</h3>
            <p className="text-zinc-200">
              Um padrão onde os produtores de mensagens (publicadores) enviam mensagens para um canal, e os 
              consumidores (assinantes) se inscrevem para receber essas mensagens. O modelo Pub/Sub permite um 
              desacoplamento entre produtores e consumidores.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Sistemas de Fila</h3>
            <p className="text-zinc-200">
              As mensagens são colocadas em uma fila e processadas de forma FIFO (first-in, first-out), garantindo 
              que as mensagens sejam entregues e processadas na ordem em que foram recebidas.
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            Simulador Interativo
          </h2>
          <p className="text-zinc-300 mb-4">
            Experimente nossa simulação interativa de filas de mensagens para entender melhor como funciona a 
            comunicação assíncrona entre produtores e consumidores.
          </p>
          <a 
            href="/componentes/message-queue/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </a>
        </div>
      </div>
    </div>
  );
} 