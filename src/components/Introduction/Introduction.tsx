export default function Introduction() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Introdução
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Antes de entrarmos no assunto a ser abordado, vou fazer uma breve introdução sobre a minha carreira, 
          a motivação de produzir esse conteúdo e o objetivo a ser alcançado ao fim da leitura.
        </p>

        <h2 className="text-3xl font-bold mb-6 text-blue-300">
          Sobre Mim
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Minha jornada no mundo da programação começou em meados de 2001, quando tinha 12 anos e entrei em um curso 
            de HTML, Javascript, Photoshop e Macromedia Flash.
          </p>

          <p>
            Após fazer esse curso, já sabia o que queria fazer da minha vida: <span className="text-blue-300 font-semibold">Programar!</span> Desde então até entrar na 
            faculdade fiz dezenas de sites para amigos, família, etc. Usava toda oportunidade que tinha para oferecer 
            um site e aprimorar meus conhecimentos.
          </p>

          <p>
            Em 2007 entrei na universidade para cursar Ciências da Computação e me deparei com matérias mais teóricas, 
            como Estrutura de Dados (na qual reprovei 2 vezes). Vi que era preciso, além de gostar, disciplina, força 
            de vontade e muito estudo, como qualquer profissão.
          </p>

          <p>
            Em 2008 entrei no mercado de trabalho, em uma pequena empresa chamada Miziara Software. Eram os 2 donos e 
            4 estagiários, contando comigo. A promessa era: <span className="italic text-zinc-300">"Se vendermos esse produto pro primeiro cliente os 4 
            estagiários serão contratados"</span>. Hoje em dia se usaria o termo startup, mas na época era só empresa mesmo.
          </p>

          <p>
            A ideia era interessante, uma pessoa que tivesse o conhecimento do negócio fazia o mapeamento dos casos de 
            uso e telas em uma planilha Excel, que seria interpretada por um software e então a aplicação gerada. Posso 
            dizer que já comecei minha experiência profissional entrando de cabeça sendo, além de desenvolvedor, também 
            QA, infra, produto e qualquer outro cargo.
          </p>

          <p>
            Após 1 ano e meio nesse projeto como estagiário, o software foi vendido e fomos todos efetivados. Logo a 
            empresa foi comprada por uma grande empresa de Telecom brasileira e entrei no mundo "corporativo".
          </p>

          <p>
            Após isso, minha vida profissional navegou em grandes instituições financeiras, órgãos públicos e institutos 
            de pesquisa, até aparecer uma oportunidade de trabalhar no exterior, mais precisamente na Irlanda onde moro 
            desde 2017.
          </p>

          <p>
            Aqui foi onde fiz minha transição de carreira para atuar como <span className="text-blue-300 font-semibold">Engineering Manager</span> em 2020.
          </p>

          <p>
            Em toda minha carreira, tive a oportunidade de trabalhar com uma infinidade de linguagens de programação e 
            ferramentas.
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Motivação e Objetivo
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de 
            forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, 
            colocar a mão na massa, experimentar e validar suas soluções.
          </p>

          <p>
            Apesar de haverem muitos materiais sobre sistemas distribuídos, system design, etc, esse material vem para 
            tentar de forma objetiva passar por diversos tipos de componentes e técnicas utilizados em sistemas críticos.
          </p>

          <p>
            Com uma visão de mercado, tendo participado de projetos em diferentes estágios de maturidade e arquitetura, 
            quero aqui passar um pouco da minha experiência para que você não precise sentir na pele.
          </p>

          <p className="text-xl font-medium text-blue-200 border-l-4 border-blue-500 pl-4">
            Você não sairá daqui com uma solução "one size fits all", mas sim com um repertório que te ajudará a tomar 
            melhores decisões e projetar sistemas resilientes, escaláveis, performáticos e com observabilidade.
          </p>
        </div>
      </div>
    </div>
  );
} 