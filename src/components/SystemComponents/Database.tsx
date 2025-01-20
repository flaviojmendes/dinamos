export default function Database() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Bancos de Dados
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Os bancos de dados são um dos componentes mais importantes de qualquer sistema, responsáveis pelo 
          armazenamento, consulta e gerenciamento de grandes volumes de dados.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Bancos de Dados Relacionais (SQL)
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Os bancos de dados relacionais são sistemas que armazenam dados em tabelas com linhas e colunas. 
            Eles utilizam a linguagem SQL para consultas e manipulação de dados.
          </p>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h4 className="text-xl font-bold text-blue-200 mb-4">Vantagens</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Forte consistência</li>
              <li>Suporte a transações ACID (Atomicidade, Consistência, Isolamento, Durabilidade)</li>
              <li>Familiaridade da comunidade</li>
              <li>Estruturação de dados bem definida</li>
            </ul>

            <h4 className="text-xl font-bold text-blue-200 mt-6 mb-4">Limitações</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Menos flexíveis para dados não estruturados</li>
              <li>Podem ter dificuldade em escalar horizontalmente devido à sua estrutura rígida</li>
            </ul>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4 mt-4">
            <p className="font-medium text-blue-200">Exemplos:</p>
            <p>MySQL, PostgreSQL, Oracle</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Bancos de Dados NoSQL
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            São bancos de dados não relacionais que oferecem flexibilidade para armazenar dados em formatos 
            como documentos, chave-valor, grafos ou colunas.
          </p>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h4 className="text-xl font-bold text-blue-200 mb-4">Vantagens</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Alta escalabilidade</li>
              <li>Flexibilidade de dados</li>
              <li>Suporte a grandes volumes de dados não estruturados</li>
            </ul>

            <h4 className="text-xl font-bold text-blue-200 mt-6 mb-4">Limitações</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>Pode sacrificar consistência (consistência eventual) para garantir disponibilidade e escalabilidade</li>
            </ul>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6 mt-4 space-y-4">
            <div>
              <p className="font-medium text-blue-200">MongoDB (banco de documentos):</p>
              <p>Armazena dados no formato JSON/BSON</p>
            </div>
            <div>
              <p className="font-medium text-blue-200">Cassandra (banco de colunas):</p>
              <p>Projeta-se para escalar horizontalmente, garantindo alta disponibilidade</p>
            </div>
            <div>
              <p className="font-medium text-blue-200">Redis (chave-valor):</p>
              <p>Um banco de dados na memória, extremamente rápido, usado para cache e outros fins</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Sharding, Particionamento e Replicação
        </h2>

        <div className="space-y-8 text-zinc-200">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Sharding</h3>
            <p className="mb-4">
              Imagine uma biblioteca gigante com milhões de livros. Se todos os livros ficassem em uma única sala, 
              seria um caos encontrar qualquer coisa, certo? O sharding é como dividir essa biblioteca em várias 
              salas menores, cada uma com um tipo específico de livro.
            </p>
            <div className="bg-zinc-800 rounded p-4 mt-4">
              <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
              <p>
                Um site de e-commerce com milhões de usuários pode usar sharding para dividir seus dados. 
                Eles podem criar um shard para cada região do país, armazenando as informações dos usuários 
                de cada região em um servidor separado.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Particionamento</h3>
            <p className="mb-4">
              O particionamento é parecido com o sharding, mas com algumas diferenças. Pense em uma caixa de 
              ferramentas. Você pode organizar as ferramentas de várias maneiras: por tamanho, por tipo ou 
              por frequência de uso.
            </p>
            <div className="bg-zinc-800 rounded p-4 mt-4">
              <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
              <p>
                Em um banco de dados de uma escola, as informações dos alunos podem ser particionadas por ano 
                letivo. Assim, todos os alunos do 1º ano ficam em uma partição, os do 2º ano em outra, e 
                assim por diante.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Replicação</h3>
            <p className="mb-4">
              Imagine que você tem uma receita de bolo muito importante. Para garantir que não vai perdê-la, 
              você faz duas cópias e guarda em lugares diferentes. A replicação é exatamente isso: criar cópias 
              dos seus dados e armazená-las em vários servidores.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-blue-200 mb-2">Replicação Síncrona:</h4>
                <p>
                  É como fazer a cópia da receita na mesma hora, assim que você termina de escrevê-la. 
                  As duas versões ficam idênticas o tempo todo.
                </p>
                <div className="bg-zinc-800 rounded p-4 mt-2">
                  <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
                  <p>
                    Um sistema bancário, onde cada transação precisa ser registrada em tempo real em todos 
                    os servidores.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-200 mb-2">Replicação Assíncrona:</h4>
                <p>
                  É como fazer a cópia da receita no dia seguinte. Pode haver pequenas diferenças entre as 
                  duas versões, mas você ainda tem uma cópia de segurança.
                </p>
                <div className="bg-zinc-800 rounded p-4 mt-2">
                  <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
                  <p>
                    Um site de notícias, onde as atualizações podem ser replicadas com um pequeno atraso 
                    para os servidores secundários.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 