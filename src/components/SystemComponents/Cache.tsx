export default function CacheComponent() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Cache
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          O cache é uma camada de armazenamento temporário usada para armazenar dados frequentemente acessados, 
          reduzindo a latência e melhorando o desempenho do sistema.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Memcached
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Imagine o Memcached como um quadro branco na sua cozinha. Você usa para anotar rapidamente informações 
            que precisa lembrar, como a lista de compras do supermercado ou o número de telefone de um restaurante. 
            É fácil de usar e você acessa as informações bem rapidinho. Mas, se você apagar o quadro, as informações 
            somem para sempre!
          </p>

          <div className="bg-zinc-800 rounded p-4 mt-4">
            <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
            <p>
              Um site de notícias pode usar o Memcached para armazenar em cache as manchetes mais recentes. 
              Quando um usuário acessa o site, as manchetes são exibidas diretamente do Memcached, em vez de 
              serem buscadas no banco de dados principal, o que torna o carregamento da página muito mais rápido.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Redis
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Agora imagine o Redis como um armário com várias prateleiras e gavetas. Além de guardar informações 
            rápidas como no quadro branco (Memcached), você também pode organizar as coisas de forma mais complexa. 
            Pode guardar listas de tarefas, conjuntos de ferramentas, e até mesmo pequenos documentos. E o melhor: 
            você pode escolher se quer guardar as coisas só por um tempo ou se quer que elas fiquem guardadas 
            permanentemente.
          </p>

          <div className="bg-zinc-800 rounded p-4 mt-4">
            <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
            <p>
              Um aplicativo de chat em grupo pode usar o Redis para armazenar as mensagens recentes de cada grupo. 
              As listas do Redis são perfeitas para isso, permitindo que as mensagens sejam adicionadas e recuperadas 
              com facilidade, mantendo a ordem cronológica. Além disso, o Redis pode ser configurado para salvar as 
              mensagens em disco, garantindo que o histórico do chat não seja perdido.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-blue-200 mb-6">Comparando os dois:</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-blue-200 mb-2">Simplicidade:</h4>
                <p>
                  Memcached é mais simples de usar, como um quadro branco. Redis é mais versátil, como um armário 
                  com gavetas, mas exige um pouco mais de organização.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-200 mb-2">Tipos de dados:</h4>
                <p>
                  Memcached armazena apenas informações simples, como texto e números. Redis permite armazenar 
                  listas, conjuntos e outras estruturas de dados mais complexas.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-200 mb-2">Persistência:</h4>
                <p>
                  Memcached não salva os dados permanentemente. Se o servidor for reiniciado, tudo é apagado. 
                  Redis oferece a opção de salvar os dados em disco, garantindo que não sejam perdidos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Cache Distribuído vs. Local
        </h2>

        <div className="space-y-6 text-zinc-200">
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-blue-200 mb-2">Cache Local:</h4>
              <p>
                Armazena dados diretamente no servidor onde o processamento ocorre. É rápido, mas não escalável, 
                pois cada servidor mantém sua própria versão dos dados.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-blue-200 mb-2">Cache Distribuído:</h4>
              <p>
                O cache é compartilhado entre vários servidores, o que o torna mais escalável. Todos os nós 
                acessam o mesmo conjunto de dados armazenados no cache, evitando inconsistências entre os servidores.
              </p>
            </div>
          </div>

          <div className="bg-zinc-800 rounded p-4 mt-4">
            <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
            <p>
              O uso de Redis como um cache distribuído em uma arquitetura com múltiplos servidores de aplicação 
              para garantir que todos acessem a mesma versão dos dados cacheados.
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            Simulador Interativo
          </h2>
          <p className="text-zinc-300 mb-4">
            Experimente nossa simulação interativa de cache para entender melhor como o cache afeta o desempenho 
            de um sistema.
          </p>
          <a 
            href="/componentes/cache/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </a>
        </div>
      </div>
    </div>
  );
} 