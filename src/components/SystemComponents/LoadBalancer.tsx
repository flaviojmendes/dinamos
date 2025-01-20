export default function LoadBalancer() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Balanceadores de Carga
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Os balanceadores de carga distribuem uniformemente o tráfego de rede ou solicitações entre vários 
          servidores, evitando que um único servidor fique sobrecarregado. Por exemplo, um sistema e-commerce 
          pode usar um balanceador de carga para distribuir as solicitações.
        </p>

        <p className="text-zinc-200 mb-12">
          No balanceamento, várias instâncias de servidor processam as solicitações simultaneamente. Isso é 
          essencial em sistemas escaláveis, permitindo adicionar mais servidores conforme a demanda aumenta.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Algoritmos de Balanceamento
        </h2>

        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Round Robin</h3>
            <p className="text-zinc-200">
              As solicitações são distribuídas sequencialmente entre os servidores disponíveis, garantindo uma 
              divisão uniforme.
            </p>
            <div className="mt-4 bg-zinc-800 rounded p-4">
              <p className="font-medium text-blue-200 mb-2">Como funciona:</p>
              <p className="text-zinc-300">
                Se você tem 3 servidores (A, B, C), a primeira requisição vai para A, a segunda para B, 
                a terceira para C, a quarta volta para A, e assim por diante.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Hashing</h3>
            <p className="text-zinc-200">
              Utiliza um hash (baseado em IP ou outro identificador) para garantir que as solicitações de um 
              cliente específico sejam direcionadas ao mesmo servidor.
            </p>
            <div className="mt-4 bg-zinc-800 rounded p-4">
              <p className="font-medium text-blue-200 mb-2">Caso de uso:</p>
              <p className="text-zinc-300">
                Importante para manter sessões de usuários, garantindo que um cliente sempre acesse o mesmo 
                servidor onde sua sessão está armazenada.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Least Connections</h3>
            <p className="text-zinc-200">
              Direciona as novas solicitações para o servidor com menos conexões ativas, ajudando a equilibrar 
              melhor a carga.
            </p>
            <div className="mt-4 bg-zinc-800 rounded p-4">
              <p className="font-medium text-blue-200 mb-2">Vantagem:</p>
              <p className="text-zinc-300">
                Mais eficiente quando os servidores têm diferentes capacidades ou quando as requisições têm 
                durações muito variadas.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            Simulador Interativo
          </h2>
          <p className="text-zinc-300 mb-4">
            Experimente nossa simulação interativa de balanceamento de carga para entender melhor como os 
            diferentes algoritmos funcionam na prática.
          </p>
          <a 
            href="/componentes/load-balancer/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </a>
        </div>
      </div>
    </div>
  );
} 