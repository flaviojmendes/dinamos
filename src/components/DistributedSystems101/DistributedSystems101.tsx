export default function DistributedSystems101() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Sistemas Distribuídos 101
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Ao abordar conceitos de sistemas distribuídos muitas vezes as pessoas me perguntam: 
          <span className="italic">"Mas afinal o que caracteriza um sistema distribuído?"</span> ou então 
          <span className="italic">"Como eu sei se trabalho com sistemas distribuídos?"</span>
        </p>

        <div className="space-y-6 text-zinc-200">
          <p>
            Por definição, podemos dizer que um sistema distribuído é:
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-4 my-8 text-xl font-medium text-blue-200 italic">
            Uma coleção de programas de computador que utilizam recursos computacionais em vários pontos centrais 
            de computação diferentes para atingir um objetivo comum e compartilhado.
          </blockquote>

          <p>
            Porém, vamos exemplificar aqui o que é um sistema distribuído utilizando uma hamburgueria como metáfora.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          1. Hamburgueria Simples (Monolítica)
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Imagine que você acabou de abrir uma hamburgueria, e contratou um único funcionário. 
            Essa pessoa faz tudo:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Atende o cliente, anota o pedido</li>
            <li>Prepara o hambúrguer</li>
            <li>Recebe o pagamento</li>
            <li>Entrega o pedido</li>
          </ul>

          <p>
            Nesse cenário, a hamburgueria funciona como um sistema monolítico:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Tudo acontece em um único "nó" (o funcionário)</li>
            <li>Ele faz todas as tarefas, o que pode causar atrasos se houver muitos pedidos, se houver uma demanda inesperada</li>
            <li>Se o funcionário parar, a hamburgueria para (ponto único de falha)</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          2. Divisão de Tarefas (O Início da Distribuição)
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            A hamburgueria começa a crescer, e você percebe que uma única pessoa não consegue fazer tudo de maneira eficiente. 
            Então, você contrata mais uma pessoa:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Um funcionário anota o pedido e recebe o pagamento</li>
            <li>O outro prepara o hambúrguer</li>
          </ul>

          <p>
            Aqui, já começamos a ver um sistema distribuído básico:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>As tarefas são divididas entre diferentes "nós" (funcionários)</li>
            <li>Enquanto um recebe o pedido e o pagamento, o outro já pode estar preparando o hambúrguer, aumentando a eficiência</li>
            <li>No entanto, ainda há dependência entre os dois: se um falhar, a operação pode ser impactada</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          3. Expansão e Otimização (Sistema Distribuído Parcialmente Independente)
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Com o sucesso, a sua hamburgueria começa a atrair muitos clientes, então a estrutura precisa se expandir. 
            Agora, temos:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Vários atendentes</li>
            <li>Uma cozinha com mais cozinheiros, cada um especializado em um tipo de preparo (carnes, montagem, frituras)</li>
            <li>Múltiplas chapas, grelhas, estações de trabalho</li>
            <li>Um sistema de senhas para organizar o fluxo de pedidos</li>
          </ul>

          <p>
            Nesse ponto, a hamburgueria está mais próxima de um sistema distribuído clássico:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Descentralização das responsabilidades: Cada funcionário tem uma função específica (atendentes, cozinheiros, caixa)</li>
            <li>Paralelismo: Vários pedidos podem ser processados ao mesmo tempo, tanto no atendimento quanto na cozinha</li>
            <li>Resiliência: Se um cozinheiro falha ou está sobrecarregado, outro pode assumir parte da tarefa ou ajudar</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          4. Hamburgueria Grande (Rede de Sistemas Distribuídos)
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Agora, a hamburgueria se tornou uma rede com várias filiais, e cada filial é um sistema distribuído por si só. 
            Há:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Filiais conectadas: Cada uma pode operar de forma independente, mas compartilham um sistema central de pedidos online</li>
            <li>Coordenação central: Um sistema central (como um aplicativo de delivery) pode distribuir pedidos entre as diferentes filiais</li>
            <li>Balanceamento de carga: Se uma filial está sobrecarregada, o sistema pode direcionar novos pedidos para outra filial</li>
          </ul>

          <p>
            Aqui, a hamburgueria exemplifica bem um sistema distribuído complexo:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Escalabilidade: A rede pode crescer conforme mais filiais são adicionadas</li>
            <li>Tolerância a falhas: Se uma filial estiver offline, as outras continuam funcionando</li>
            <li>Latência otimizada: Os pedidos são distribuídos para a filial mais próxima ou com menor carga</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Conclusão: Sistemas Distribuídos e Hamburguerias
        </h2>

        <div className="space-y-6 text-zinc-200">
          <ul className="list-disc list-inside space-y-4 ml-4">
            <li>No início, a hamburgueria era um sistema centralizado e monolítico, com um único ponto de falha</li>
            <li>Conforme cresce, ela distribui as tarefas entre funcionários, otimizando processos e aumentando a resiliência e eficiência</li>
            <li>Em um sistema distribuído complexo (uma rede de hamburguerias), há independência, paralelismo, balanceamento de carga e redundância</li>
          </ul>

          <p className="text-xl font-medium text-blue-200 border-l-4 border-blue-500 pl-4 mt-8">
            Esse modelo ajuda a visualizar como, ao dividir as responsabilidades e distribuir o trabalho entre diferentes "nós", 
            podemos aumentar a eficiência e resiliência de um sistema, seja ele uma hamburgueria ou um sistema computacional.
          </p>
        </div>
      </div>
    </div>
  );
} 