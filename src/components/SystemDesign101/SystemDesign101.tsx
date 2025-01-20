export default function SystemDesign101() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          System Design 101
        </h1>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          1.1 O que é System Design?
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            System Design é o processo de projetar a arquitetura de um sistema de software de maneira que ele seja 
            escalável, eficiente, resiliente e atenda aos requisitos de negócio e técnicos. Esse processo envolve 
            a definição de componentes de software, infraestrutura, protocolos de comunicação e o gerenciamento de 
            dados, com o objetivo de garantir que o sistema funcione corretamente sob diferentes cargas de trabalho 
            e em diferentes ambientes.
          </p>

          <p>
            Em um contexto mais prático, o System Design é frequentemente discutido em entrevistas técnicas, 
            especialmente para posições de Desenvolvimento. Nesse ambiente, a habilidade de projetar sistemas de 
            grande escala, como redes sociais, sistemas de mensagens instantâneas ou plataformas de comércio 
            eletrônico, é testada. O design de sistemas foca em resolver problemas reais, levando em conta 
            limitações de tempo, recursos e complexidade.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          1.2 Por que System Design é importante?
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            A importância do System Design está diretamente relacionada à necessidade de construir sistemas que 
            possam lidar com grandes volumes de dados, múltiplos usuários simultâneos e cenários imprevisíveis 
            de falhas. Com a crescente complexidade dos sistemas modernos e o aumento no volume de dados gerados, 
            é crucial que os engenheiros pensem não apenas na funcionalidade imediata, mas também na escalabilidade, 
            manutenibilidade e confiabilidade de longo prazo.
          </p>

          <p className="font-medium text-blue-200 mb-4">
            Aqui estão alguns motivos pelos quais o System Design é crucial:
          </p>

          <ul className="list-disc list-inside space-y-4 ml-4">
            <li>
              <span className="font-medium text-blue-200">Escalabilidade:</span> Sistemas precisam crescer em 
              capacidade conforme o número de usuários e dados aumenta. Um bom design garante que o sistema possa 
              escalar sem comprometer o desempenho.
            </li>
            <li>
              <span className="font-medium text-blue-200">Resiliência:</span> Sistemas devem continuar operando 
              mesmo diante de falhas de componentes individuais. O System Design trata de como lidar com esses cenários.
            </li>
            <li>
              <span className="font-medium text-blue-200">Eficiência:</span> Utilizar os recursos de forma otimizada 
              é essencial para garantir baixo custo de operação e resposta rápida para os usuários.
            </li>
            <li>
              <span className="font-medium text-blue-200">Manutenibilidade:</span> Um sistema bem projetado facilita 
              futuras manutenções, alterações e expansões.
            </li>
            <li>
              <span className="font-medium text-blue-200">Experiência do Usuário:</span> A experiência do usuário 
              pode ser afetada diretamente por um sistema mal projetado, resultando em lentidão, indisponibilidade 
              ou até perda de dados.
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          1.3 Principais conceitos e terminologias
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            No processo de System Design, é comum o uso de várias terminologias técnicas. A seguir estão alguns 
            dos conceitos fundamentais que serão abordados ao longo desse material:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-zinc-800 mt-6">
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Escalabilidade</td>
                  <td className="p-4">
                    A capacidade de um sistema crescer para atender a uma carga de trabalho crescente. Pode ser 
                    horizontal (adicionando mais máquinas) ou vertical (melhorando o hardware).
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Consistência</td>
                  <td className="p-4">
                    Garantir que todos os nós de um sistema distribuído tenham os mesmos dados em um determinado 
                    momento. Consistência forte significa que os dados são os mesmos em todos os lugares; consistência 
                    eventual significa que, com o tempo, os dados convergem para o mesmo estado.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Disponibilidade</td>
                  <td className="p-4">
                    A capacidade de um sistema estar disponível para os usuários, mesmo que ocorra uma falha parcial. 
                    Um sistema de alta disponibilidade garante que o serviço continue operando sob condições adversas.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Latência</td>
                  <td className="p-4">
                    O tempo que leva para um dado viajar de uma ponta a outra no sistema. Baixa latência é essencial 
                    para uma boa experiência do usuário, especialmente em sistemas de tempo real.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Throughput</td>
                  <td className="p-4">
                    A quantidade de dados que pode ser processada por um sistema em um determinado período de tempo.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Tolerância a falhas</td>
                  <td className="p-4">
                    A habilidade de um sistema continuar funcionando corretamente mesmo quando uma parte dele falha.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Balanceamento de carga</td>
                  <td className="p-4">
                    A distribuição de tarefas ou solicitações de clientes entre vários servidores para otimizar o uso 
                    de recursos e evitar sobrecarga.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Sharding</td>
                  <td className="p-4">
                    O processo de dividir um banco de dados ou sistema de armazenamento em partes menores, chamadas 
                    shards, para aumentar a escalabilidade e o desempenho.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-blue-200">Replicação</td>
                  <td className="p-4">
                    A cópia de dados entre diferentes servidores ou nós para garantir redundância e aumentar a 
                    disponibilidade.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          1.4 Tópicos abordados
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Este material de System Design abordará, em detalhes, os seguintes tópicos:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-zinc-800 mt-6">
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Fundamentos de sistemas distribuídos</td>
                  <td className="p-4">
                    Explorar conceitos de sistemas distribuídos, como escalabilidade, consistência e disponibilidade, 
                    além de como balancear esses fatores.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Componentes de um sistema moderno</td>
                  <td className="p-4">
                    Cache, bancos de dados, balanceadores de carga, filas de mensagens e outros componentes críticos 
                    que compõem a arquitetura de sistemas distribuídos de grande escala.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Princípios de design</td>
                  <td className="p-4">
                    Como abordar o design de sistemas para maximizar escalabilidade, eficiência e resiliência.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Estratégias de consistência</td>
                  <td className="p-4">
                    Explorar os diferentes modelos de consistência, como consistência eventual e forte, e como 
                    aplicá-los em sistemas distribuídos.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Design de sistemas complexos</td>
                  <td className="p-4">
                    Passo a passo de como projetar sistemas como um serviço de mensagens instantâneas, uma plataforma 
                    de comércio eletrônico ou uma rede social.
                  </td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">Monitoramento e manutenção</td>
                  <td className="p-4">
                    As melhores práticas para monitorar sistemas em produção, detectar problemas e agir rapidamente 
                    para resolvê-los.
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-blue-200">Entrevistas técnicas de System Design</td>
                  <td className="p-4">
                    Como preparar e lidar com perguntas de design de sistemas em entrevistas técnicas, com exemplos 
                    de perguntas e respostas detalhadas.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 