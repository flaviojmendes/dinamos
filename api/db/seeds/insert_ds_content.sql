BEGIN;
INSERT INTO courses (title, description, slug) VALUES ('Sistemas Distribuídos na Prática', 'Domine a arquitetura de sistemas modernos com conteúdo prático e simuladores.', 'sistemas-distribuidos-pratica') ON CONFLICT (slug) DO NOTHING;
DO $$ DECLARE course_id_val INTEGER; BEGIN SELECT id INTO course_id_val FROM courses WHERE slug = 'sistemas-distribuidos-pratica';
DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = course_id_val);
DELETE FROM modules WHERE course_id = course_id_val;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, '🎯 Comece Aqui', 'Sua jornada de aprendizado passo a passo', 'roadmap', 1) ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Introdução', 'Sobre o curso e motivação', 'intro', 2) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Introdução', '# Introdução

**Lead**: Antes de entrarmos no assunto a ser abordado, vou fazer uma breve introdução sobre a minha carreira, a motivação de produzir esse conteúdo e o objetivo a ser alcançado ao fim da leitura.

## Sobre Mim

**P1**: Minha jornada no mundo da programação começou em meados de 2001, quando tinha 12 anos e entrei em um curso de HTML, Javascript, Photoshop e Macromedia Flash.

**P2**: Após fazer esse curso, já sabia o que queria fazer da minha vida: Programar! Desde então até entrar na faculdade fiz dezenas de sites para amigos, família, etc. Usava toda oportunidade que tinha para oferecer um site e aprimorar meus conhecimentos.

**P3**: Em 2007 entrei na universidade para cursar Ciências da Computação e me deparei com matérias mais teóricas, como Estrutura de Dados (na qual reprovei 2 vezes). Vi que era preciso, além de gostar, disciplina, força de vontade e muito estudo, como qualquer profissão.

**P4**: Em 2008 entrei no mercado de trabalho, em uma pequena empresa chamada Miziara Software. Eram os 2 donos e 4 estagiários, contando comigo. A promessa era: "Se vendermos esse produto pro primeiro cliente os 4 estagiários serão contratados." Hoje em dia se usaria o termo startup, mas na época era só empresa mesmo.

**P5**: A ideia era interessante, uma pessoa que tivesse o conhecimento do negócio fazia o mapeamento dos casos de uso e telas em uma planilha Excel, que seria interpretada por um software e então a aplicação gerada. Posso dizer que já comecei minha experiência profissional entrando de cabeça sendo, além de desenvolvedor, também QA, infra, produto e qualquer outro cargo.

**P6**: Após 1 ano e meio nesse projeto como estagiário, o software foi vendido e fomos todos efetivados. Logo a empresa foi comprada por uma grande empresa de Telecom brasileira e entrei no mundo "corporativo".

**P7**: Após isso, minha vida profissional navegou em grandes instituições financeiras, órgãos públicos e institutos de pesquisa, até aparecer uma oportunidade de trabalhar no exterior, mais precisamente na Irlanda onde moro desde 2017.

**P8**: Aqui foi onde fiz minha transição de carreira para atuar como Engineering Manager em 2020.

**P9**: Em toda minha carreira, tive a oportunidade de trabalhar com uma infinidade de linguagens de programação e ferramentas.

## Motivação e Objetivo

**M1**: Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, colocar a mão na massa, experimentar e validar suas soluções.

**M2**: Apesar de haverem muitos materiais sobre sistemas distribuídos, system design, etc, esse material vem para tentar de forma objetiva passar por diversos tipos de componentes e técnicas utilizados em sistemas críticos.

**M3**: Com uma visão de mercado, tendo participado de projetos em diferentes estágios de maturidade e arquitetura, quero aqui passar um pouco da minha experiência para que você não precise sentir na pele.

**M4**: Você não sairá daqui com uma solução "one size fits all", mas sim com um repertório que te ajudará a tomar melhores decisões e projetar sistemas resilientes, escaláveis, performáticos e com observabilidade.

', 'intro-intro', 1, 15 FROM modules WHERE slug = 'intro' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Sistemas Distribuídos 101', 'Conceitos fundamentais através de analogias', 'sistemas-distribuidos-101', 3) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Sistemas Distribuídos 101', '# Sistemas Distribuídos 101

Ao abordar conceitos de sistemas distribuídos muitas vezes as pessoas me perguntam:

**Intro Q1**: "Mas afinal o que caracteriza um sistema distribuído?"

**Intro Q2**: "Como eu sei se trabalho com sistemas distribuídos?"

## O que são Sistemas Distribuídos?

Por definição, podemos dizer que um sistema distribuído é:

**Definition Quote**: Uma coleção de programas de computador que utilizam recursos computacionais em vários pontos centrais de computação diferentes para atingir um objetivo comum e compartilhado.

Vamos exemplificar aqui o que é um sistema distribuído utilizando uma hamburgueria como metáfora.

## 1. Hamburgueria Simples (Monolítica)

Imagine que você acabou de abrir uma hamburgueria, e contratou um único funcionário. Essa pessoa faz tudo:

**Section1 Items 1**: Atende o cliente, anota o pedido

**Section1 Items 2**: Prepara o hambúrguer

**Section1 Items 3**: Recebe o pagamento

**Section1 Items 4**: Entrega o pedido

**Section1 Conclusion**: Nesse cenário, a hamburgueria funciona como um sistema monolítico:

**Section1 Points 1**: Tudo acontece em um único "nó" (o funcionário)

**Section1 Points 2**: Ele faz todas as tarefas, o que pode causar atrasos se houver muitos pedidos, se houver uma demanda inesperada

**Section1 Points 3**: Se o funcionário parar, a hamburgueria para (ponto único de falha)

## 2. Divisão de Tarefas (O Início da Distribuição)

A hamburgueria começa a crescer, e você percebe que uma única pessoa não consegue fazer tudo de maneira eficiente. Então, você contrata mais uma pessoa:

**Section2 Items 1**: Um funcionário anota o pedido e recebe o pagamento

**Section2 Items 2**: O outro prepara o hambúrguer

Aqui, já começamos a ver um sistema distribuído básico:

**Section2 Points 1**: As tarefas são divididas entre diferentes "nós" (funcionários)

**Section2 Points 2**: Enquanto um recebe o pedido e o pagamento, o outro já pode estar preparando o hambúrguer, aumentando a eficiência

**Section2 Points 3**: No entanto, ainda há dependência entre os dois: se um falhar, a operação pode ser impactada

## 3. Expansão e Otimização (Sistema Distribuído Parcialmente Independente)

Com o sucesso, a sua hamburgueria começa a atrair muitos clientes, então a estrutura precisa se expandir. Agora, temos:

**Section3 Items 1**: Vários atendentes

**Section3 Items 2**: Uma cozinha com mais cozinheiros, cada um especializado em um tipo de preparo (carnes, montagem, frituras)

**Section3 Items 3**: Múltiplas chapas, grelhas, estações de trabalho

**Section3 Items 4**: Um sistema de senhas para organizar o fluxo de pedidos

Nesse ponto, a hamburgueria está mais próxima de um sistema distribuído clássico:

**Section3 Points 1**: Descentralização das responsabilidades: Cada funcionário tem uma função específica (atendentes, cozinheiros, caixa)

**Section3 Points 2**: Paralelismo: Vários pedidos podem ser processados ao mesmo tempo, tanto no atendimento quanto na cozinha

**Section3 Points 3**: Resiliência: Se um cozinheiro falhar ou está sobrecarregado, outro pode assumir parte da tarefa ou ajudar

## 4. Hamburgueria Grande (Rede de Sistemas Distribuídos)

Agora, a hamburgueria se tornou uma rede com várias filiais, e cada filial é um sistema distribuído por si só. Há:

**Section4 Items 1**: Filiais conectadas: Cada uma pode operar de forma independente, mas compartilham um sistema central de pedidos online

**Section4 Items 2**: Coordenação central: Um sistema central (como um aplicativo de delivery) pode distribuir pedidos entre as diferentes filiais

**Section4 Items 3**: Balanceamento de carga: Se uma filial está sobrecarregada, o sistema pode direcionar novos pedidos para outra filial

Aqui, a hamburgueria exemplifica bem um sistema distribuído complexo:

**Section4 Points 1**: Escalabilidade: A rede pode crescer conforme mais filiais são adicionadas

**Section4 Points 2**: Tolerância a falhas: Se uma filial estiver offline, as outras continuam funcionando

**Section4 Points 3**: Latência otimizada: Os pedidos são distribuídos para a filial mais próxima ou com menor carga

## Conclusão: Sistemas Distribuídos e Hamburguerias

**Conclusion Point 1**: No início, a hamburgueria era um sistema centralizado e monolítico, com um único ponto de falha

**Conclusion Point 2**: Conforme cresce, ela distribui as tarefas entre funcionários, otimizando processos e aumentando a resiliência e eficiência

**Conclusion Point 3**: Em um sistema distribuído complexo (uma rede de hamburguerias), há independência, paralelismo, balanceamento de carga e redundância

**Conclusion Para**: Esse modelo ajuda a visualizar como, ao dividir as responsabilidades e distribuir o trabalho entre diferentes "nós", podemos aumentar a eficiência e resiliência de um sistema, seja ele uma hamburgueria ou um sistema computacional.

', 'sistemas-distribuidos-101-intro', 1, 15 FROM modules WHERE slug = 'sistemas-distribuidos-101' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'System Design 101', 'Fundamentos de design de sistemas', 'system-design-101', 4) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'System Design 101', '# System Design 101

## Sec1

### 1.1 O que é System Design?

**P1**: System Design é o processo de projetar a arquitetura de um sistema de software de maneira que ele seja escalável, eficiente, resiliente e atenda aos requisitos de negócio e técnicos. Envolve a definição de componentes de software, infraestrutura, protocolos de comunicação e o gerenciamento de dados para garantir que o sistema funcione corretamente sob diferentes cargas e ambientes.

**P2**: Na prática, System Design é frequentemente discutido em entrevistas técnicas, especialmente para vagas de engenharia. A habilidade de projetar sistemas em grande escala, como redes sociais, instant messaging systems, ou plataformas de e-commerce, é testada. O foco é resolver problemas reais considerando restrições de tempo, recursos e complexidade.

## Sec2

### 1.2 Por que System Design é importante?

**P1**: A importância está ligada à necessidade de construir sistemas que lidem com grandes volumes de dados, muitos usuários simultâneos e cenários imprevisíveis de falhas. Com a complexidade crescente e o aumento de dados, é crucial pensar não apenas na funcionalidade imediata, mas também na escalabilidade, manutenibilidade e confiabilidade de longo prazo.

**Lead**: Motivos pelos quais System Design é crucial:

#### Bullets

###### Escalabilidade:

Sistemas precisam crescer conforme usuários e dados aumentam. Um bom design permite escalar sem comprometer o desempenho.

###### Resiliência:

Sistemas devem continuar operando mesmo diante de falhas de componentes. System Design trata como lidar com esses cenários.

###### Eficiência:

Otimizar uso de recursos é essencial para baixo custo de operação e respostas rápidas.

###### Manutenibilidade:

A well-designed system makes future maintenance, changes, and expansions easier.

###### Experiência do Usuário:

Sistemas mal projetados impactam diretamente usuários, causando lentidão, indisponibilidade ou perda de dados.

## Sec3

### 1.3 Principais conceitos e terminologias

**Intro**: No processo de System Design, é comum o uso de várias terminologias. A seguir, conceitos fundamentais abordados neste material:

#### Terms

**Scalability Label**: Escalabilidade

Capacidade de um sistema crescer para atender carga crescente. Pode ser horizontal (adicionando máquinas) ou vertical (melhorando hardware).

**Consistency Label**: Consistência

Garantir que todos os nós tenham os mesmos dados em um momento. Forte: dados iguais em todos os lugares; eventual: converge ao longo do tempo.

**Availability Label**: Disponibilidade

Capacidade de estar disponível mesmo sob falhas parciais. Alta disponibilidade mantém o serviço sob condições adversas.

**Latency Label**: Latência

Tempo para dados atravessarem o sistema. Baixa latência é essencial para boa experiência, especialmente em tempo real.

**Throughput Label**: Throughput

Quantidade de dados processada em um período.

**Fault Tolerance Label**: Tolerância a falhas

Habilidade de continuar funcionando corretamente mesmo quando parte falha.

**Load Balancing Label**: Balanceamento de carga

Distribuição de tarefas/requisições entre servidores para otimizar recursos e evitar sobrecarga.

**Sharding Label**: Sharding

Dividir um banco de dados/armazenamento em partes menores (shards) para aumentar escalabilidade e desempenho.

**Replication Label**: Replicação

Cópia de dados entre servidores/nós para garantir redundância e aumentar disponibilidade.

## Sec4

### 1.4 Tópicos abordados

**Intro**: Este material abordará, em detalhes, os seguintes tópicos:

#### Topics

**Fundamentals Label**: Fundamentos de sistemas distribuídos

Explorar conceitos como escalabilidade, consistência e disponibilidade, e como balanceá-los.

**Components Label**: Componentes de um sistema moderno

Cache, bancos de dados, balanceadores de carga, filas de mensagens e componentes críticos de arquiteturas de larga escala.

**Principles Label**: Princípios de design

Como abordar o design para maximizar escalabilidade, eficiência e resiliência.

**Consistency Strategies Label**: Estratégias de consistência

Explore different consistency models (eventual and strong) and how to apply them in distributed systems.

**Complex Design Label**: Design de sistemas complexos

Passo a passo de como projetar sistemas como mensagens instantâneas, e-commerce ou redes sociais.

**Monitoring Label**: Monitoramento e manutenção

Boas práticas para monitorar produção, detectar problemas e agir rapidamente.

**Interviews Label**: Entrevistas técnicas de System Design

Como se preparar para perguntas de design, com exemplos e respostas detalhadas.

## Intro

### Introdução

**Lead**: Antes de entrarmos no assunto a ser abordado, vou fazer uma breve introdução sobre a minha carreira, a motivação de produzir esse conteúdo e o objetivo a ser alcançado ao fim da leitura.

#### Sobre Mim

**P1**: Minha jornada no mundo da programação começou em meados de 2001, quando tinha 12 anos e entrei em um curso de HTML, Javascript, Photoshop e Macromedia Flash.

**P2**: Após fazer esse curso, já sabia o que queria fazer da minha vida: Programar! Desde então até entrar na faculdade fiz dezenas de sites para amigos, família, etc. Usava toda oportunidade que tinha para oferecer um site e aprimorar meus conhecimentos.

**P3**: Em 2007 entrei na universidade para cursar Ciências da Computação e me deparei com matérias mais teóricas, como Estrutura de Dados (na qual reprovei 2 vezes). Vi que era preciso, além de gostar, disciplina, força de vontade e muito estudo, como qualquer profissão.

**P4**: Em 2008 entrei no mercado de trabalho, em uma pequena empresa chamada Miziara Software. Eram os 2 donos e 4 estagiários, contando comigo. A promessa era: "Se vendermos esse produto pro primeiro cliente os 4 estagiários serão contratados." Hoje em dia se usaria o termo startup, mas na época era só empresa mesmo.

**P5**: A ideia era interessante, uma pessoa que tivesse o conhecimento do negócio fazia o mapeamento dos casos de uso e telas em uma planilha Excel, que seria interpretada por um software e então a aplicação gerada. Posso dizer que já comecei minha experiência profissional entrando de cabeça sendo, além de desenvolvedor, também QA, infra, produto e qualquer outro cargo.

**P6**: Após 1 ano e meio nesse projeto como estagiário, o software foi vendido e fomos todos efetivados. Logo a empresa foi comprada por uma grande empresa de Telecom brasileira e entrei no mundo "corporativo".

**P7**: Após isso, minha vida profissional navegou em grandes instituições financeiras, órgãos públicos e institutos de pesquisa, até aparecer uma oportunidade de trabalhar no exterior, mais precisamente na Irlanda onde moro desde 2017.

**P8**: Aqui foi onde fiz minha transição de carreira para atuar como Engineering Manager em 2020.

**P9**: Em toda minha carreira, tive a oportunidade de trabalhar com uma infinidade de linguagens de programação e ferramentas.

#### Motivação e Objetivo

**M1**: Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, colocar a mão na massa, experimentar e validar suas soluções.

**M2**: Apesar de haverem muitos materiais sobre sistemas distribuídos, system design, etc, esse material vem para tentar de forma objetiva passar por diversos tipos de componentes e técnicas utilizados em sistemas críticos.

**M3**: Com uma visão de mercado, tendo participado de projetos em diferentes estágios de maturidade e arquitetura, quero aqui passar um pouco da minha experiência para que você não precise sentir na pele.

**M4**: Você não sairá daqui com uma solução "one size fits all", mas sim com um repertório que te ajudará a tomar melhores decisões e projetar sistemas resilientes, escaláveis, performáticos e com observabilidade.

', 'system-design-101-intro', 1, 15 FROM modules WHERE slug = 'system-design-101' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Fundamentos Teóricos', 'Teoria e princípios fundamentais de sistemas distribuídos', 'theoretical-foundations', 5) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Teorema CAP', '# Teorema CAP

Trade-offs entre Consistência, Disponibilidade e Tolerância a Partições

Proposto por Eric Brewer em 2000, o teorema CAP é um dos conceitos mais importantes em sistemas distribuídos. Ele estabelece que qualquer sistema distribuído pode garantir apenas duas das três propriedades: Consistência, Disponibilidade e Tolerância a partições. Este teorema ajuda arquitetos a tomar decisões informadas sobre trade-offs no design de sistemas.

## Consistency

### Consistência

Todos os nós veem os mesmos dados ao mesmo tempo. Toda leitura recebe a escrita mais recente ou um erro.

**Detailed Explanation**: Consistência significa que todos os nós no sistema distribuído têm a mesma visão dos dados a qualquer momento. Quando uma operação de escrita é concluída com sucesso, todas as operações de leitura subsequentes retornarão o valor atualizado até que os dados sejam alterados novamente.

#### Concrete Examples

- Sistema bancário: Quando você transfere R$ 100 da Conta A para a Conta B, todos os caixas eletrônicos devem mostrar os saldos corretos imediatamente
- Redes sociais: Quando você atualiza sua foto de perfil, todos os seus amigos devem ver a nova foto, não uma mistura de antiga e nova
- E-commerce: Quando um item sai de estoque, nenhum cliente deve conseguir comprá-lo de qualquer servidor
- Ranking de jogos: Quando um jogador atinge uma pontuação alta, todos os jogadores devem ver o ranking atualizado consistentemente

#### Consistency Models

- Consistência Forte: Todas as leituras recebem a escrita mais recente (PostgreSQL com replicação síncrona)
- Consistência Eventual: Sistema se tornará consistente ao longo do tempo (propagação DNS)
- Consistência Fraca: Sem garantias sobre quando a consistência será alcançada (streaming de vídeo ao vivo)

## Availability

### Disponibilidade

O sistema permanece operacional 100% do tempo. Toda requisição recebe uma resposta.

**Detailed Explanation**: Disponibilidade significa que o sistema continua funcionando e respondendo a solicitações mesmo quando alguns componentes falham. Toda solicitação recebe uma resposta (sucesso ou falha) sem garantir que contenha a versão mais recente das informações.

#### Concrete Examples

- Netflix: Deve continuar reproduzindo vídeos mesmo se alguns servidores estiverem inativos, mesmo que recomendações possam estar desatualizadas
- Amazon: Site deve permanecer acessível durante picos de compras, mesmo que detalhes de produtos demorem para sincronizar
- WhatsApp: Mensagens devem ser entregues mesmo durante problemas de rede, mensagens podem ser entregues fora de ordem
- Google Search: Deve retornar resultados mesmo se alguns data centers estiverem inacessíveis, resultados podem estar ligeiramente desatualizados

#### Availability Metrics

- 99% uptime = 3,65 dias de inatividade por ano
- 99,9% uptime = 8,76 horas de inatividade por ano
- 99,99% uptime = 52,56 minutos de inatividade por ano
- 99,999% uptime = 5,26 minutos de inatividade por ano

#### Strategies

- Balanceamento de carga entre múltiplos servidores
- Sistemas redundantes e mecanismos de failover
- Degradação graciosa de funcionalidades
- Circuit breakers para prevenir falhas em cascata

## Partition Tolerance

### Tolerância a Partições

O sistema continua operando apesar de falhas de rede entre os nós.

**Detailed Explanation**: Tolerância a partições significa que o sistema continua funcionando mesmo quando falhas de rede impedem que alguns nós se comuniquem com outros. Isso não é opcional em sistemas distribuídos - falhas de rede são inevitáveis.

#### Concrete Examples

- Nuvem multi-região: Data centers da AWS na costa leste e oeste perdem conexão mas ambos continuam servindo usuários
- App móvel: Seu telefone perde internet mas dados em cache ainda funcionam, sincroniza quando conexão retorna
- Microserviços: Serviço de pagamento não consegue alcançar serviço de estoque mas ainda pode processar pagamentos com dados em cache
- CDN: Servidores edge locais servem conteúdo mesmo quando desconectados dos servidores de origem

#### Partition Scenarios

- Cabo de rede cortado entre data centers
- Falhas de roteador/switch isolam racks de servidores
- Interrupções de provedor de internet afetam regiões
- Ataques DDoS sobrecarregam infraestrutura de rede
- Firewalls mal configurados bloqueiam comunicação

#### Handling Strategies

- Detectar eventos de partição rapidamente
- Continuar operando com dados disponíveis
- Enfileirar operações para sincronização posterior
- Implementar mecanismos de resolução de conflitos

**Theorem Statement**: O Teorema CAP Estabelece:

**Theorem Text**: Na presença de uma partição de rede, você deve escolher entre consistência e disponibilidade

**Real World Note**: Na prática, você não escolhe entre propriedades CAP para todo o seu sistema. Diferentes partes da sua aplicação podem fazer diferentes trade-offs baseados em requisitos de negócio.

## Exemplos Concretos

## Exemplos de Consistência

## Exemplos de Disponibilidade

## Exemplos de Tolerância a Partições

**Characteristics Label**: Características:

**Examples Label**: Exemplos:

**Use Cases Label**: Casos de Uso:

**Limitations Label**: Limitações:

## Cp Systems

### Sistemas CP (Consistência + Tolerância a Partições)

Priorizam consistência de dados sobre disponibilidade durante partições de rede

#### Characteristics

- Sistema fica indisponível durante partições
- Quando disponível, dados são sempre consistentes
- Melhor para dados financeiros/críticos

#### Examples

- Bancos de dados ACID tradicionais (PostgreSQL, MySQL) com replicação síncrona
- Apache HBase - garante consistência forte
- MongoDB com configurações de consistência forte
- Zookeeper - serviço de coordenação requerendo consenso
- Sistemas bancários onde precisão > disponibilidade

#### Use Cases

- Transações financeiras e bancárias
- Sistemas de gerenciamento de estoque
- Gerenciamento de configuração
- Sistemas de autenticação e autorização

## Ap Systems

### Sistemas AP (Disponibilidade + Tolerância a Partições)

Priorizam disponibilidade do sistema sobre consistência imediata durante partições

#### Characteristics

- Sistema permanece disponível durante partições
- Dados podem estar temporariamente inconsistentes
- Eventualmente se torna consistente quando partição se cura

#### Examples

- Amazon DynamoDB - banco NoSQL altamente disponível
- Apache Cassandra - banco distribuído priorizando disponibilidade
- Sistema DNS - deve sempre resolver nomes, consistência eventual é OK
- Amazon S3 - armazenamento de objetos com consistência eventual
- Feeds de redes sociais - melhor mostrar conteúdo ligeiramente desatualizado que ficar indisponível

#### Use Cases

- Plataformas de redes sociais
- Redes de entrega de conteúdo
- Sistemas de carrinho de compras
- Armazenamento de preferências do usuário
- Sistemas de analytics e logging

## Ca Systems

### Sistemas CA (Consistência + Disponibilidade)

Sistemas tradicionais que sacrificam tolerância a partições

#### Characteristics

- Consistência e disponibilidade perfeitas
- Funciona apenas em local único/sem partições de rede
- Não são verdadeiramente sistemas distribuídos

#### Examples

- Bancos de dados de nó único (PostgreSQL, MySQL em um servidor)
- Bancos em memória (Redis) em máquina única
- RDBMS tradicionais em data center único
- Aplicações monolíticas legadas

#### Limitations

- Não consegue lidar com partições de rede
- Ponto único de falha
- Não adequado para sistemas geograficamente distribuídos
- Escalabilidade limitada

**Note**: Na prática, sistemas CA não existem em ambientes verdadeiramente distribuídos porque partições de rede são inevitáveis.

## Practical Considerations

### Considerações Práticas

#### Points

- A maioria dos sistemas modernos são CP ou AP
- Você pode escolher diferentes trade-offs para diferentes partes do seu sistema
- Requisitos de negócio devem dirigir suas decisões CAP
- Monitore e meça consistência e disponibilidade reais
- Projete para degradação graciosa durante partições

## Decision Framework

### Como Escolher?

#### Questions

- Seu negócio pode tolerar inconsistência temporária?
- Disponibilidade do sistema é mais importante que precisão dos dados?
- Você está operando em múltiplas regiões geográficas?
- Quais são os custos de inatividade vs. dados inconsistentes?
- Você pode implementar mecanismos de resolução de conflitos?

', 'theoretical-foundations-cap-theorem', 1, 10 FROM modules WHERE slug = 'theoretical-foundations' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Modelos de Consistência', '# Modelos de Consistência

Padrões de consistência forte, eventual e fraca

Modelos de consistência definem as regras sobre quando e como atualizações de dados se tornam visíveis em um sistema distribuído. Compreender esses modelos é crucial para projetar sistemas que equilibram precisão de dados, performance e disponibilidade de acordo com seus requisitos específicos.

## Strong Consistency

### Consistência Forte

Todos os nós veem os mesmos dados ao mesmo tempo. Após uma operação de escrita, todas as leituras subsequentes retornarão o valor atualizado.

**Detailed Explanation**: Consistência forte garante que uma vez que uma operação de escrita seja concluída com sucesso, todas as operações de leitura subsequentes retornarão o valor atualizado de qualquer nó no sistema. Isso fornece as garantias mais fortes, mas vem com trade-offs de performance e disponibilidade.

#### Characteristics

- Consistência imediata em todos os nós
- Nunca retorna dados obsoletos aos clientes
- Garantias de transações ACID
- Replicação síncrona necessária
- Maior latência devido ao overhead de coordenação

#### Concrete Examples

- Transferência bancária: Quando você transfere dinheiro, ambas as contas devem mostrar saldos corretos imediatamente em todos os caixas eletrônicos e agências
- Gestão de estoque: Quando o último item é vendido, nenhum outro cliente deve conseguir comprá-lo de qualquer localização
- Autenticação de usuário: Mudanças de senha devem ser efetivas imediatamente em todos os servidores de login
- Negociação de ações: Execução de ordens deve refletir imediatamente em todos os sistemas de negociação para prevenir arbitragem

#### Implementations

- PostgreSQL com replicação síncrona
- MongoDB com write concern de maioria
- Protocolo de consenso Apache Zookeeper
- Google Spanner com TrueTime
- RDBMS tradicionais com transações distribuídas

#### Use Cases

- Transações financeiras e sistemas bancários
- Gestão de estoque e inventário
- Autenticação e autorização de usuários
- Sistemas de conformidade regulatória
- Aplicações empresariais críticas

**Tradeoffs**: Trade-offs: Alta consistência mas pode impactar disponibilidade e performance

## Eventual Consistency

### Consistência Eventual

O sistema se tornará consistente com o tempo, desde que não receba novas atualizações. Leituras podem retornar dados obsoletos temporariamente.

**Detailed Explanation**: Consistência eventual garante que se nenhuma nova atualização for feita a um item de dados, eventualmente todos os acessos a esse item retornarão o valor atualizado. Este modelo permite inconsistências temporárias mas garante alta disponibilidade e tolerância a partições.

#### Characteristics

- Inconsistências temporárias permitidas
- Alta disponibilidade e tolerância a partições
- Replicação assíncrona
- Menor latência para operações de escrita
- Mecanismos de resolução de conflitos necessários

#### Concrete Examples

- Timeline de redes sociais: Sua postagem aparece imediatamente para você, mas pode demorar para aparecer nos feeds dos amigos
- Propagação DNS: Mudanças de domínio levam tempo para propagar globalmente, servidores DNS diferentes podem retornar IPs diferentes temporariamente
- Avaliações de produtos Amazon: Avaliações aparecem eventualmente em todos os servidores, mas consistência imediata não é crítica
- Sistemas de email: Emails se replicam para servidores de backup ao longo do tempo, atrasos temporários não quebram a funcionalidade

#### Implementations

- Amazon DynamoDB com leituras de consistência eventual
- Apache Cassandra nível de consistência padrão
- Amazon S3 armazenamento de objetos
- DNS (Sistema de Nomes de Domínio)
- Bancos NoSQL com replicação assíncrona

#### Use Cases

- Feeds e interações de redes sociais
- Sistemas de gerenciamento de conteúdo
- Armazenamento de preferências de usuário
- Sistemas de carrinho de compras
- Dados de analytics e logging

#### Convergence Strategies

- Last-write-wins (baseado em timestamp)
- Vector clocks para rastreamento de causalidade
- Tipos de dados replicados livres de conflito (CRDTs)
- Resolução de conflitos no nível da aplicação
- Controle de concorrência multi-versão

**Tradeoffs**: Trade-offs: Alta disponibilidade e tolerância a partições, mas inconsistência temporária

## Weak Consistency

### Consistência Fraca

Após uma escrita, leituras podem ou não ver o valor atualizado. O sistema não faz garantias sobre quando os dados estarão consistentes.

**Detailed Explanation**: Consistência fraca não faz garantias sobre quando os dados se tornarão consistentes entre os nós. Este modelo prioriza máxima performance e disponibilidade, aceitando que dados podem estar inconsistentes por períodos estendidos ou mesmo permanentemente em alguns casos.

#### Characteristics

- Nenhuma garantia de consistência
- Máxima performance e throughput
- Propagação de dados por melhor esforço
- Overhead mínimo de coordenação
- Aplicação deve lidar com inconsistências

#### Concrete Examples

- Streaming de vídeo ao vivo: Perda de frames ou mudanças de qualidade são aceitáveis para performance em tempo real
- Jogos online: Posições de jogadores podem estar ligeiramente dessincronizadas para melhor responsividade
- Colaboração em tempo real: Posições de cursor em documentos compartilhados não precisam de consistência perfeita
- Dados de sensores IoT: Perda ocasional de dados é aceitável para leituras de sensores de alta frequência

#### Implementations

- Cache distribuído Memcached
- Redis sem persistência
- Sistemas em tempo real baseados em UDP
- Filas de mensagens por melhor esforço
- Plataformas de streaming em tempo real

#### Use Cases

- Jogos e simulações em tempo real
- Streaming de vídeo/áudio ao vivo
- Coleta de dados de sensores de alta frequência
- Ferramentas de colaboração em tempo real
- Monitoramento de performance e métricas

#### Considerations

- Aplicação deve ser projetada para inconsistência
- Perda de dados pode ser permanente
- Resolução de conflitos no cliente frequentemente necessária
- Adequado apenas para dados não críticos
- Monitoramento se torna crucial

**Tradeoffs**: Trade-offs: Máxima performance e disponibilidade, garantias mínimas de consistência

## Escolhendo o Modelo Certo

## Use Cases

**Strong**: Transações financeiras, sistemas de inventário, autenticação de usuário

**Eventual**: Feeds de redes sociais, comentários, perfis de usuário, carrinhos de compra

**Weak**: Streaming de vídeo ao vivo, jogos online, colaboração em tempo real

## Decision Matrix

### Matriz de Decisão

#### Factors

- Criticidade dos dados: Quão importante é a precisão dos dados?
- Requisitos de performance: Qual latência é aceitável?
- Necessidades de disponibilidade: O sistema pode tolerar downtime?
- Requisitos de escala: Quantos usuários simultâneos?
- Distribuição geográfica: Múltiplas regiões ou data centers?

## Practical Guidelines

### Diretrizes Práticas de Implementação

#### Tips

- Diferentes partes do seu sistema podem usar diferentes modelos de consistência
- Comece com consistência forte e relaxe apenas onde necessário
- Monitore métricas de consistência em produção
- Projete estratégias de resolução de conflitos antecipadamente
- Considere abordagens híbridas para aplicações complexas

## Exemplos do Mundo Real

**Characteristics Label**: Características:

**Examples Label**: Exemplos:

**Implementations Label**: Implementações:

**Use Cases Label**: Casos de Uso:

**Convergence Label**: Estratégias de Convergência:

**Considerations Label**: Considerações:

', 'theoretical-foundations-consistency-models', 2, 10 FROM modules WHERE slug = 'theoretical-foundations' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Desafios Distribuídos', '# Desafios de Sistemas Distribuídos

Problemas comuns em sistemas distribuídos

Sistemas distribuídos enfrentam desafios únicos que não existem em sistemas de uma única máquina. Compreender esses problemas fundamentais é crucial para projetar aplicações distribuídas resilientes, escaláveis e confiáveis. Cada desafio requer consideração cuidadosa e soluções específicas.

## Network Partitions

### Partições de Rede

Falhas de rede que dividem o sistema em grupos isolados, forçando trade-offs entre consistência e disponibilidade.

**Detailed Explanation**: Partições de rede ocorrem quando falhas de rede impedem que alguns nós se comuniquem com outros, efetivamente dividindo o sistema em grupos isolados. Este é um dos problemas mais desafiadores em sistemas distribuídos porque força decisões imediatas sobre consistência vs. disponibilidade.

#### Characteristics

- Falha de comunicação entre nós
- Sistema se divide em ilhas isoladas
- Trade-offs imediatos do teorema CAP necessários
- Pode ser temporário ou permanente
- Afeta garantias de consistência de dados

#### Concrete Examples

- Conectividade de data center: Cabo cortado entre regiões AWS causa partição de 6 horas, cada região deve decidir se permanece online
- Microserviços: Serviço de pagamento não consegue alcançar serviço de estoque, deve decidir se processa pedidos com dados de estoque obsoletos
- Cluster de banco: Replicação master-slave quebra, slaves devem decidir se aceitam escritas ou permanecem somente leitura
- Rede CDN: Problemas de roteamento isolam servidores edge da origem, conteúdo em cache fica obsoleto mas usuários ainda são servidos

#### Causes

- Falhas físicas de rede (corte de cabos, falhas de roteador)
- Bugs de software na pilha de rede
- Infraestrutura de rede sobrecarregada
- Incidentes de segurança (ataques DDoS)
- Erros de configuração no roteamento

#### Detection Strategies

- Mecanismos de heartbeat entre nós
- Detecção de falhas baseada em timeout
- Protocolos de gossip para associação
- Sistemas de monitoramento externos
- Verificações de saúde no nível da rede

#### Mitigation Approaches

- Múltiplos caminhos de rede e redundância
- Estratégias de degradação graciosa
- Circuit breakers para serviços com falha
- Modo somente leitura durante partições
- Resolução de conflitos para cura de partições

**Impact**: Impacto: Perda de comunicação entre nós, potencial inconsistência de dados

## Clock Sync

### Sincronização de Relógio

Diferentes nós têm relógios diferentes, dificultando ordenar eventos e manter consistência.

**Detailed Explanation**: Sincronização de relógio é fundamental para sistemas distribuídos porque os nós têm relógios independentes que derivam em taxas diferentes. Sem tempo sincronizado, torna-se quase impossível ordenar eventos, manter causalidade ou implementar algoritmos baseados em tempo corretamente.

#### Characteristics

- Relógios derivam em taxas diferentes
- Não há noção global de "agora"
- Ordenação de eventos se torna ambígua
- Impacta timestamps e logs
- Crítico para algoritmos distribuídos

#### Concrete Examples

- Transações bancárias: Transferência parece completar antes de começar devido ao skew de relógio, causando falhas de auditoria
- Log distribuído: Logs de erro aparecem fora de ordem entre serviços, tornando debug impossível
- Invalidação de cache: TTL expira em tempos diferentes em nós diferentes, causando dados obsoletos
- Gerenciamento de lease: Locks distribuídos expiram em tempos diferentes, levando a cenários split-brain

#### Problems Caused

- Ordenação incorreta de eventos em logs
- Condições de corrida em lógica baseada em tempo
- Expiração inconsistente de cache
- Falhas de lock distribuído
- Corrupção de trilha de auditoria

#### Sync Approaches

- Network Time Protocol (NTP)
- Precision Time Protocol (PTP)
- Sincronização baseada em GPS
- Referências de relógio atômico
- API Google TrueTime

#### Logical Alternatives

- Timestamps Lamport para causalidade
- Vector clocks para ordenação parcial
- Hybrid logical clocks (HLC)
- Ordenação baseada em eventos em vez de tempo
- Números de sequência baseados em consenso

**Solutions**: Soluções: Relógios lógicos, Relógios vetoriais, NTP

## Partial Failures

### Falhas Parciais

Algumas partes do sistema falham enquanto outras continuam funcionando, criando estados inconsistentes.

**Detailed Explanation**: Falhas parciais são talvez o desafio mais insidioso em sistemas distribuídos. Diferente de falhas completas do sistema que são óbvias, falhas parciais criam cenários onde alguns componentes funcionam enquanto outros falham, levando a estados inconsistentes difíceis de detectar e lidar.

#### Characteristics

- Apenas subconjunto de componentes do sistema falha
- Difícil de detectar e diagnosticar
- Pode causar falhas em cascata
- Sistema parece parcialmente funcional
- Cria estado global inconsistente

#### Concrete Examples

- Checkout e-commerce: Pagamento processado mas estoque não atualizado devido a falha do banco, ocorre overselling
- Sistema de email: Mensagem entregue para alguns destinatários mas não outros devido a falhas de servidor
- Redes sociais: Post visível para alguns usuários mas não outros devido a lag de replicação
- Armazenamento de arquivo: Dados escritos no primário mas replicação para backups falha, risco de perda de dados aumenta

#### Failure Types

- Fail-stop: Componente para completamente
- Fail-slow: Componente responde muito lentamente
- Byzantine: Componente se comporta arbitrariamente
- Omissão: Componente descarta algumas mensagens
- Comissão: Componente envia dados errados

#### Detection Challenges

- Nenhum sinal claro de falha
- Timeouts são ambíguos
- Falhas de rede vs. nó não claras
- Corrupção silenciosa de dados possível
- Atualizações parciais de estado

#### Handling Strategies

- Verificações de saúde abrangentes
- Padrão circuit breaker
- Degradação graciosa
- Transações de compensação
- Operações idempotentes

**Challenges**: Desafios: Detectar falhas, lidar com timeouts, estratégias de recuperação

## Consensus

### Consenso

Fazer nós distribuídos concordarem com um único valor ou decisão na presença de falhas.

**Detailed Explanation**: Consenso é o problema de fazer múltiplos nós distribuídos concordarem com um único valor, mesmo quando alguns nós podem falhar ou se comportar maliciosamente. Isso é fundamental para muitas operações de sistemas distribuídos como eleição de líder, gerenciamento de configuração e garantia de consistência.

#### Characteristics

- Todos os nós corretos devem concordar
- Deve lidar com falhas de nó
- Deve terminar em tempo finito
- Garantias de segurança e vivacidade
- Base para muitos protocolos distribuídos

#### Concrete Examples

- Cluster de banco: Nós devem concordar sobre quais transações commitar em que ordem
- Cluster Kubernetes: Nós devem concordar sobre quais pods estão rodando onde
- Blockchain: Mineradores devem concordar sobre o próximo bloco na cadeia
- Gerenciamento de configuração: Serviços devem concordar sobre versão atual de configuração

#### Problem Variants

- Tolerância a falhas bizantinas: Lidar com nós maliciosos
- Tolerância a falhas de crash: Lidar apenas com falhas de crash
- Eleição de líder: Escolher coordenador único
- Broadcast atômico: Ordenar todas as mensagens
- Replicação de máquina de estado: Manter réplicas sincronizadas

#### Famous Algorithms

- Paxos: Consenso clássico com garantias fortes
- Raft: Alternativa mais simples ao Paxos
- PBFT: Consenso tolerante a falhas bizantinas
- Impossibilidade FLP: Limitações teóricas
- RAFT: Consenso baseado em líder para replicação de log

#### Real World Usage

- Apache Zookeeper usa protocolo Zab
- etcd e Consul usam Raft
- Google Spanner usa Paxos
- Redes blockchain usam Proof of Work/Stake
- Protocolos de replicação de banco

**Algorithms**: Algoritmos: Raft, PBFT, Paxos

## State Management

### Gerenciamento de Estado

Manter controle do estado do sistema em múltiplos nós ao lidar com atualizações concorrentes.

**Detailed Explanation**: Gerenciamento de estado em sistemas distribuídos envolve manter estado consistente entre múltiplos nós enquanto lida com atualizações concorrentes, falhas e partições de rede. Este desafio se torna exponencialmente mais complexo conforme o número de nós e a frequência de atualizações aumentam.

#### Characteristics

- Estado distribuído entre nós
- Atualizações concorrentes de múltiplas fontes
- Deve lidar com falhas de nó graciosamente
- Trade-offs consistência vs. performance
- Requer mecanismos de coordenação

#### Concrete Examples

- Carrinho de compras: Usuário adiciona itens do app móvel enquanto simultaneamente do web, ambas atualizações devem ser preservadas
- Jogo multiplayer: Atualizações de posição do jogador de múltiplos clientes devem ser reconciliadas em tempo real
- Documento colaborativo: Múltiplos usuários editando mesmo documento simultaneamente
- Sistema de estoque: Múltiplos armazéns atualizando níveis de estoque concorrentemente

#### Consistency Challenges

- Consistência read-after-write
- Consistência de leitura monotônica
- Consistência de sessão
- Garantias de consistência eventual
- Requisitos de consistência forte

#### Concurrency Issues

- Problema de atualizações perdidas
- Leituras sujas de dados não commitados
- Leituras não repetíveis
- Leituras fantasma em consultas de intervalo
- Conflitos write-write

#### Architectural Patterns

- Event sourcing: Armazenar eventos, não estado
- CQRS: Separar modelos de comando e consulta
- Padrão Saga: Gerenciar transações distribuídas
- Two-phase commit: Garantir atomicidade
- Transações baseadas em compensação

**Approaches**: Abordagens: Event sourcing, CQRS, máquinas de estado distribuídas

## Race Conditions

### Condições de Corrida

Múltiplos processos acessando recursos compartilhados simultaneamente, levando a resultados imprevisíveis.

**Detailed Explanation**: Condições de corrida em sistemas distribuídos ocorrem quando múltiplos processos ou nós tentam acessar e modificar recursos compartilhados simultaneamente, levando a resultados imprevisíveis e frequentemente incorretos. Diferente de condições de corrida em máquina única, condições de corrida distribuídas são mais difíceis de detectar e debugar.

#### Characteristics

- Ordem de execução não determinística
- Contenção de recursos compartilhados
- Bugs dependentes de timing
- Difícil de reproduzir
- Pode causar corrupção de dados

#### Concrete Examples

- Conta bancária: Dois caixas eletrônicos saque simultaneamente, ambos verificam saldo (R$ 100), ambos permitem saque de R$ 60, conta fica negativa
- Reserva de passagem: Dois clientes reservam último assento simultaneamente, ambos recebem confirmação, avião oversold
- Incremento de contador: Múltiplos serviços incrementam contador global, valor final incorreto devido a atualizações perdidas
- Alocação de recursos: Dois processos alocam mesmos recursos de servidor, causando conflitos de recursos

#### Common Scenarios

- Operações check-then-act
- Ciclos read-modify-write
- Padrões double-checked locking
- Condições de corrida de inicialização
- Condições de corrida de limpeza

#### Distributed Complications

- Atrasos de rede mascaram problemas de timing
- Falhas parciais durante operações
- Problemas de sincronização de relógio
- Efeitos de reordenação de mensagens
- Falhas de lock distribuído

#### Prevention Techniques

- Operações atômicas e Compare-And-Swap
- Mecanismos de locking distribuído
- Garantias de ordenação de mensagens
- Controle de concorrência otimista
- Estratégias de locking pessimista

**Solutions**: Soluções: Locks, operações atômicas, ordenação de mensagens

## As Falácias da Computação Distribuída

## Fallacies

**F1**: A rede é confiável

**F2**: A latência é zero

**F3**: A largura de banda é infinita

**F4**: A rede é segura

**F5**: A topologia não muda

**F6**: Há um administrador

**F7**: O custo de transporte é zero

**F8**: A rede é homogênea

**Fallacies Warning**: Essas suposições falsas levam a muitos problemas em sistemas distribuídos

**Fallacies Explanation**: As Oito Falácias da Computação Distribuída, identificadas por Peter Deutsch e outros, representam equívocos comuns que desenvolvedores cometem ao projetar sistemas distribuídos. Compreender essas falácias é crucial para construir aplicações distribuídas robustas.

## Mitigation Strategies

### Estratégias Gerais de Mitigação

#### Strategies

- Projetar para falha: Assumir que componentes vão falhar
- Implementar monitoramento abrangente e alertas
- Usar circuit breakers para prevenir falhas em cascata
- Construir capacidades de degradação graciosa
- Testar cenários de falha regularmente (chaos engineering)
- Implementar logging adequado e rastreamento distribuído
- Usar operações idempotentes quando possível
- Projetar para consistência eventual quando apropriado

**Characteristics Label**: Características:

**Examples Label**: Exemplos:

**Causes Label**: Causas Comuns:

**Detection Label**: Estratégias de Detecção:

**Mitigation Label**: Abordagens de Mitigação:

**Problems Label**: Problemas Causados:

**Approaches Label**: Abordagens:

**Algorithms Label**: Algoritmos:

**Usage Label**: Uso no Mundo Real:

**Patterns Label**: Padrões Arquiteturais:

**Techniques Label**: Técnicas de Prevenção:

**Scenarios Label**: Cenários Comuns:

**Complications Label**: Complicações Distribuídas:

**Sync Approaches Label**: Abordagens de Sincronização:

**Logical Alternatives Label**: Alternativas Lógicas:

**Failure Types Label**: Tipos de Falha:

**Detection Challenges Label**: Desafios de Detecção:

**Handling Strategies Label**: Estratégias de Tratamento:

**Problem Variants Label**: Variantes do Problema:

**Consistency Challenges Label**: Desafios de Consistência:

**Concurrency Issues Label**: Problemas de Concorrência:

', 'theoretical-foundations-distributed-challenges', 3, 10 FROM modules WHERE slug = 'theoretical-foundations' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Partições de Rede e Falhas', '# Partições de Rede e Falhas

Lidando com divisões de rede e falhas de nós

Partições de rede são um dos problemas mais fundamentais e desafiadores em sistemas distribuídos. Quando falhas de rede impedem a comunicação entre nós, sistemas devem tomar decisões críticas sobre consistência versus disponibilidade. Compreender como detectar, prevenir e lidar com partições é essencial para construir aplicações distribuídas resilientes.

## What Is

### O que é uma Partição de Rede?

Uma partição de rede ocorre quando a rede entre nós falha, dividindo o sistema em grupos isolados que não conseguem se comunicar.

**Detailed Explanation**: Partições de rede representam um modo de falha onde o sistema distribuído se torna dividido em ilhas isoladas de nós que podem se comunicar internamente mas não através da fronteira da partição. Isso é particularmente desafiador porque cada partição pode continuar operando independentemente, potencialmente tomando decisões conflitantes.

**Note**: Também conhecido como cenário "split-brain", onde diferentes partes do sistema podem tomar decisões independentes, potencialmente levando à inconsistência.

#### Characteristics

- Comunicação entre grupos de nós é impossível
- Cada partição pode tomar decisões independentes
- Trade-offs do teorema CAP se tornam imediatamente relevantes
- Estado do sistema pode divergir entre partições
- Recuperação requer estratégias de resolução de conflitos

## Causes

### Causas das Partições

Partições de rede podem surgir de várias questões de infraestrutura e configuração que afetam a conectividade entre nós distribuídos.

#### Items

- Falhas de roteador ou switch
- Cortes ou danos em cabos
- Interrupções de ISP ou datacenter
- Bugs de software na pilha de rede
- Firewalls mal configurados

#### Detailed Causes

- Falhas de infraestrutura física: Cortes de cabo, falhas de hardware de roteador, quedas de energia afetando equipamentos de rede
- Bugs de software: Bugs na pilha de rede, problemas de driver, falhas de protocolo de roteamento, problemas de resolução DNS
- Erros de configuração: Configurações incorretas de firewall, erros de tabela de roteamento, conflitos de política de segurança
- Condições de sobrecarga: Congestionamento de rede, ataques DDoS, esgotamento de recursos causando perda de pacotes
- Fatores ambientais: Desastres naturais, acidentes de construção, interferência eletromagnética

## Failure Types

### Tipos de Falhas

Diferentes modos de falha requerem diferentes estratégias de detecção e tratamento em sistemas distribuídos.

#### Fail Stop

##### Fail-Stop

Nó para completamente e outros nós podem detectar a falha

**Detailed Explanation**: Em falhas fail-stop, um nó cessa completamente a operação e para de responder a todas as solicitações. Este é o tipo mais fácil de falha para detectar e lidar porque a falha é limpa e observável por outros nós.

###### Characteristics

- Nó para de responder completamente
- Fácil de detectar com timeouts
- Sem risco de corrupção parcial de estado
- Semânticas de falha limpas

###### Examples

- Falha de energia do servidor causando desligamento imediato
- Crash de processo devido a condição de falta de memória
- Falha de interface de rede tornando nó inacessível
- Terminação de container ou VM

#### Fail Slow

##### Fail-Slow

Nó fica muito lento mas não falha completamente

**Detailed Explanation**: Falhas fail-slow são particularmente insidiosas porque o nó continua a operar mas com performance severamente degradada. Isso pode causar timeouts, falhas em cascata e tornar difícil distinguir entre latência de rede e problemas do nó.

###### Characteristics

- Nó responde mas muito lentamente
- Difícil de distinguir de latência de rede
- Pode causar problemas de performance em cascata
- Pode levar ao esgotamento de recursos em outros nós

###### Examples

- Sobrecarga de CPU causando atrasos no processamento de requisições
- Pressão de memória levando a coleta de lixo excessiva
- Gargalos de I/O de disco retardando operações
- Congestionamento de rede causando atrasos intermitentes

#### Byzantine

##### Bizantina

Nó se comporta arbitrariamente ou maliciosamente

**Detailed Explanation**: Falhas bizantinas representam o modo de falha mais complexo onde nós podem enviar mensagens conflitantes, corrompidas ou maliciosas. Essas falhas requerem algoritmos de consenso sofisticados e são especialmente importantes em ambientes adversários.

###### Characteristics

- Nó envia mensagens incorretas ou conflitantes
- Pode parecer funcionar corretamente para alguns nós
- Requer acordo de maioria para lidar
- Tipo mais difícil de falha para detectar e lidar

###### Examples

- Corrupção de memória causando computações incorretas
- Bugs de software levando a respostas inconsistentes
- Ataques maliciosos tentando comprometer consenso
- Skew de relógio causando inconsistências de timestamp

## Concrete Examples

### Cenários Reais de Partição

#### Examples

- Isolamento de região AWS: Falha de rede inter-regional isola US-East de US-West, cada região continua servindo tráfego independentemente
- Divisão de cluster de banco: Replicação master-slave quebra, slaves devem decidir se aceitam escritas ou permanecem somente leitura para prevenir conflitos
- Partição de microserviços: Serviço de pagamento perde conexão com serviço de estoque durante checkout, deve decidir se processa pedidos com dados de estoque obsoletos
- Isolamento de edge CDN: Problemas de roteamento de internet isolam servidores edge da origem, conteúdo em cache fica obsoleto mas usuários continuam sendo servidos
- Partição de cluster Kubernetes: Nós worker perdem conexão com master, pods continuam rodando mas novos deployments falham

## Partition Scenarios

### Cenários Comuns de Partição

#### Datacenter Split

##### Partições Multi-Datacenter

Quando datacenters perdem conectividade, cada um deve decidir como lidar com operações em andamento

###### Strategies

- Designar datacenter primário para escritas
- Mudar para modo somente leitura em datacenters secundários
- Usar consenso para eleger novo primário
- Implementar estruturas de dados livres de conflito

#### Service Mesh Partition

##### Partições de Service Mesh

Quando serviços em uma mesh perdem conectividade com subconjuntos de outros serviços

###### Strategies

- Padrão circuit breaker para falhar rapidamente
- Fallback para respostas em cache
- Degradação graciosa de funcionalidade
- Enfileirar requisições para processamento posterior

#### Database Partition

##### Partições de Cluster de Banco

Quando nós de banco se tornam isolados uns dos outros

###### Strategies

- Usar escritas baseadas em quorum para manter consistência
- Mudar partições minoritárias para modo somente leitura
- Implementar resolução de conflito last-write-wins
- Usar vector clocks para rastreamento de causalidade

## Estratégias de Tratamento

## Detection

### Detecção

Detecção precoce e precisa de partições de rede é crucial para implementar estratégias de resposta apropriadas.

#### Items

- Mecanismos de heartbeat
- Detecção baseada em timeout
- Protocolos de gossip
- Monitoramento externo

#### Detailed Strategies

- Mecanismos de heartbeat: Mensagens ping/pong regulares entre nós para detectar perda de conectividade
- Detecção baseada em timeout: Definir timeouts razoáveis para distinguir respostas lentas de falhas
- Protocolos de gossip: Detecção de falhas distribuída onde nós compartilham informações sobre outros nós
- Monitoramento externo: Serviços terceirizados para validar conectividade de múltiplas perspectivas
- Sondas no nível da aplicação: Verificações de saúde específicas para funcionalidade de lógica de negócio

#### Challenges

- Distinguir entre atrasos de rede e partições reais
- Falsos positivos devido a congestionamento temporário de rede
- Definir valores de timeout apropriados para diferentes cenários
- Lidar com conectividade parcial (alguns nós alcançáveis, outros não)

## Prevention

### Prevenção

Embora partições não possam ser completamente prevenidas, sua probabilidade e impacto podem ser significativamente reduzidos através de design apropriado de infraestrutura.

#### Items

- Caminhos de rede redundantes
- Múltiplos datacenters
- Equipamentos de rede de qualidade
- Manutenção regular

#### Detailed Strategies

- Redundância de rede: Múltiplos caminhos de rede independentes, ISPs diversos, roteadores e switches redundantes
- Distribuição geográfica: Deployments multi-região, zonas de disponibilidade, localizações edge
- Qualidade de infraestrutura: Equipamentos de rede enterprise, planejamento adequado de capacidade, refresh regular de hardware
- Excelência operacional: Janelas de manutenção programadas, processos de gerenciamento de mudanças, monitoramento e alertas
- Chaos engineering: Testar regularmente cenários de partição para validar comportamento do sistema

## Recovery

### Recuperação

Quando partições se curam, sistemas devem cuidadosamente reconciliar estado e resolver quaisquer conflitos que ocorreram durante a partição.

#### Items

- Failover automático
- Reconciliação de dados
- Resolução de split-brain
- Degradação graceful

#### Detailed Strategies

- Detecção de conflitos: Identificar mudanças de estado divergentes que ocorreram durante a partição
- Estratégias de merge: Implementar lógica específica da aplicação para resolver conflitos automaticamente
- Intervenção manual: Fornecer ferramentas para operadores resolverem conflitos complexos manualmente
- Transações de compensação: Implementar operações de desfazer para mudanças de estado conflitantes
- Vetores de versão: Usar timestamps lógicos para estabelecer causalidade e ordem de resolução de conflitos

## Design Principles

### Princípios de Design para Tolerância a Partições

#### Architectural

##### Padrões Arquiteturais

###### Items

- Usar algoritmos de consenso (Raft, Paxos)
- Implementar decisões baseadas em quorum
- Projetar para consistência eventual
- Usar circuit breakers e bulkheads

###### Detailed Patterns

- Algoritmos de consenso: Raft, Paxos, PBFT para manter acordo através de partições
- Sistemas de quorum: Tomada de decisão baseada em maioria para garantir consistência durante partições
- Event sourcing: Logs de eventos imutáveis que podem ser mesclados quando partições se curam
- CQRS: Separar modelos de leitura e escrita para lidar com cenários de partição diferentemente
- Padrão Saga: Transações de longa duração com compensação para consistência distribuída

#### Operational

##### Práticas Operacionais

###### Items

- Testes regulares de recuperação de desastres
- Sistemas de monitoramento e alertas
- Implantação e escalonamento automatizados
- Documentação e runbooks

###### Detailed Practices

- Chaos engineering: Induzir partições regularmente para testar comportamento do sistema
- Exercícios de game day: Praticar cenários de partição com equipes inteiras
- Testes automatizados: Incluir testes de partição em pipelines CI/CD
- Dashboards de monitoramento: Visibilidade em tempo real sobre detecção e recuperação de partições
- Procedimentos de runbook: Guias passo-a-passo para lidar com cenários de partição

## Cap Theorem Connection

### Conexão com Teorema CAP

**Explanation**: Partições de rede forçam trade-offs imediatos do teorema CAP entre consistência e disponibilidade

#### Trade Offs

- Escolher Consistência: Rejeitar operações para manter consistência de dados, sacrificando disponibilidade
- Escolher Disponibilidade: Continuar operações com dados potencialmente obsoletos, sacrificando consistência
- Abordagem híbrida: Diferentes serviços podem fazer diferentes trade-offs baseados em requisitos de negócio

## Best Practices

### Melhores Práticas

#### Practices

- Projetar para tolerância a partições desde o início
- Implementar monitoramento e alertas abrangentes
- Testar cenários de partição regularmente através de chaos engineering
- Documentar processos de tomada de decisão para tratamento de partições
- Treinar equipes de operações em procedimentos de resposta a partições
- Usar algoritmos de consenso comprovados ao invés de construir soluções customizadas
- Implementar degradação graciosa ao invés de falha completa do serviço
- Monitorar métricas de negócio durante cenários de partição

**Characteristics Label**: Características:

**Examples Label**: Exemplos:

**Causes Label**: Causas Detalhadas:

**Strategies Label**: Estratégias:

**Challenges Label**: Desafios:

**Patterns Label**: Padrões Detalhados:

**Practices Label**: Práticas Detalhadas:

', 'theoretical-foundations-network-partitions', 4, 10 FROM modules WHERE slug = 'theoretical-foundations' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Componentes Básicos', 'Blocos fundamentais de sistemas distribuídos', 'componentes', 6) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Bancos de Dados', '# Bancos de Dados

Armazenamento e gerenciamento de dados

', 'componentes-banco-dados', 1, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Cache', '# Cache

Armazenamento temporário para melhor performance

## Simulator

### Simulador

Experimente diferentes estratégias de cache

', 'componentes-cache', 2, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Balanceador de Carga', '# Balanceador de Carga

Distribuição de tráfego entre servidores

## Simulator

### Simulador

Experimente diferentes algoritmos de balanceamento

', 'componentes-load-balancer', 3, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Filas de Mensagens', '# Filas de Mensagens

Comunicação assíncrona entre serviços

## Simulator

### Simulador

Experimente o fluxo de mensagens

', 'componentes-message-queue', 4, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'CDN', '# CDN

Distribuição global de conteúdo

## Simulator

### Simulador

Veja como o CDN acelera entregas

', 'componentes-cdn', 5, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'API Gateway', '# API Gateway

Ponto único de entrada para APIs

## Simulator

### Simulador

Experimente roteamento e proteção de APIs

', 'componentes-api-gateway', 6, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Firewall', '# Firewall

Segurança e controle de tráfego

## Simulator

### Simulador

Experimente regras de firewall

', 'componentes-firewall', 7, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Polling vs Webhooks', '# Polling vs Webhooks

Estratégias de comunicação em tempo real

## Teoria

### Teoria e Conceitos

Fundamentos e comparação detalhada

## Simulator

### Simulador Interativo

Veja a diferença na prática

', 'componentes-polling-webhooks', 8, 10 FROM modules WHERE slug = 'componentes' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Princípios de Design', 'Conceitos essenciais para sistemas robustos', 'principios-design', 7) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Escalabilidade', '# Escalabilidade

Crescimento e adaptação do sistema

## Horizontal

### Horizontal (Scale Out)

Adicionando mais máquinas

#### Simulator

##### Simulador

Experimente escalabilidade horizontal

## Vertical

### Vertical (Scale Up)

Aumentando recursos da máquina

#### Simulator

##### Simulador

Experimente escalabilidade vertical

## Latencia

### Latência

Medindo e otimizando a latência

## Failover

### Failover

Recuperação automática de falhas

## Simulator

### Simulador Completo

Compare diferentes estratégias de escala

', 'principios-design-escalabilidade', 1, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Alta Disponibilidade', '# Alta Disponibilidade

Mantendo o sistema sempre funcionando

## Replicacao

### Replicação

Cópias sincronizadas dos dados

## Failover

### Failover

Recuperação automática de falhas

## Zonas

### Zonas de Disponibilidade

Distribuição geográfica para resiliência

## Disaster-Recovery

### Recuperação de Desastres

Estratégias de recuperação de falhas catastróficas

## Monitoramento

### Monitoramento de Saúde

Acompanhamento contínuo da saúde do sistema

## Distribuicao-Carga

### Distribuição de Carga

Distribuição de tráfego entre servidores

## Simulator

### Simulador

Experimente estratégias de disponibilidade

', 'principios-design-disponibilidade', 2, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Tolerância a Falhas', '# Tolerância a Falhas

Lidando com falhas no sistema

## Retries

### Retries

Tentativas automáticas

#### Simulator

##### Simulador

Experimente diferentes estratégias de retry

## Circuit Breaker

### Circuit Breaker

Prevenindo falhas em cascata

#### Simulator

##### Simulador

Veja o circuit breaker em ação

## Timeout

### Timeout

Limitando tempo de espera

#### Simulator

##### Simulador

Experimente diferentes configurações de timeout

', 'principios-design-tolerancia-falhas', 3, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Arquitetura Orientada a Eventos', '# Arquitetura Orientada a Eventos

Sistemas baseados em eventos

## Simulator

### Simulador

Experimente event sourcing e event-driven

', 'principios-design-eventos', 4, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Arquitetura de Serviços', '# Arquitetura de Serviços

Monolito vs Microsserviços

', 'principios-design-servicos', 5, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Acoplamento', '# Acoplamento

Acoplamento dinâmico e estático entre serviços

', 'principios-design-acoplamento', 6, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Orquestração vs Coreografia', '# Orquestração vs Coreografia

Compare os padrões de orquestração e coreografia

', 'principios-design-orquestracao-vs-coreografia', 7, 10 FROM modules WHERE slug = 'principios-design' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Estratégias de Consistência', 'Como garantir a consistência em sistemas distribuídos', 'estrategias-de-consistencia', 8) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Sincronização', '# Sincronização

Coordenação e sincronização em sistemas distribuídos

## Fundamentos

### Fundamentos

Conceitos básicos de sincronização usando o Jantar dos Filósofos

## Deadlocks

### Deadlocks

Prevenção e detecção de deadlocks no contexto dos Filósofos

## Algoritmos

### Algoritmos

Algoritmos distribuídos para coordenação

', 'estrategias-de-consistencia-sincronizacao', 1, 10 FROM modules WHERE slug = 'estrategias-de-consistencia' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Two Phase Commit', '# Two Phase Commit

Protocolo de consenso para transações distribuídas

## Simulador

### Simulador

Simulação interativa do protocolo Two Phase Commit

', 'estrategias-de-consistencia-two-phase-commit', 2, 10 FROM modules WHERE slug = 'estrategias-de-consistencia' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Estratégia de Consenso', '# Estratégia de Consenso

Protocolos e mecanismos para garantir acordo entre nós

## Simulador

### Simulador

Simulação interativa dos protocolos de consenso

', 'estrategias-de-consistencia-consenso', 3, 10 FROM modules WHERE slug = 'estrategias-de-consistencia' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Relógios Lógicos de Lamport', '# Relógios Lógicos de Lamport

Ordenação de eventos em sistemas distribuídos

## Simulador

### Simulador

Visualize a ordenação de eventos com timestamps de Lamport

', 'estrategias-de-consistencia-lamport-timestamps', 4, 10 FROM modules WHERE slug = 'estrategias-de-consistencia' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Monitoramento e Manutenção', 'Monitoramento e manutenção de sistemas distribuídos', 'monitoramento-e-manutencao', 9) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Métricas e KPIs', '# Métricas e KPIs

Indicadores essenciais para monitoramento

', 'monitoramento-e-manutencao-metricas', 1, 10 FROM modules WHERE slug = 'monitoramento-e-manutencao' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Logs e Tracing', '# Logs e Tracing

Rastreamento e análise de logs distribuídos

## Simulador

### Simulador de Logs

Experimente com bons e maus exemplos de logs

## Tracing

### Tracing Simulator

Experimente o rastreamento de eventos

', 'monitoramento-e-manutencao-logs', 2, 10 FROM modules WHERE slug = 'monitoramento-e-manutencao' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Alertas e Notificações', '# Alertas e Notificações

Configuração e gestão de alertas

', 'monitoramento-e-manutencao-alertas', 3, 10 FROM modules WHERE slug = 'monitoramento-e-manutencao' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Análise de Performance', '# Análise de Performance

Identificação e resolução de gargalos

', 'monitoramento-e-manutencao-performance', 4, 10 FROM modules WHERE slug = 'monitoramento-e-manutencao' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Health Checks', '# Health Checks

Monitoramento de saúde dos serviços

', 'monitoramento-e-manutencao-health-checks', 5, 10 FROM modules WHERE slug = 'monitoramento-e-manutencao' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Casos Reais', 'Exemplos reais de system design de grandes empresas', 'casos-reais', 10) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'YouTube', '# YouTube

Como o YouTube processa e distribui vídeos globalmente

', 'casos-reais-youtube', 1, 10 FROM modules WHERE slug = 'casos-reais' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Spotify', '# Spotify

Arquitetura de streaming de música em tempo real

', 'casos-reais-spotify', 2, 10 FROM modules WHERE slug = 'casos-reais' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Bit.ly', '# Bit.ly

Design de um serviço de encurtamento de URLs em escala

', 'casos-reais-bitly', 3, 10 FROM modules WHERE slug = 'casos-reais' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'WhatsApp', '# WhatsApp

Sistema de mensagens em tempo real

', 'casos-reais-whatsapp', 4, 10 FROM modules WHERE slug = 'casos-reais' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Netflix', '# Netflix

Streaming de vídeo e recomendação de conteúdo

', 'casos-reais-netflix', 5, 10 FROM modules WHERE slug = 'casos-reais' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Uber', '# Uber

Sistema de geolocalização e matching em tempo real

', 'casos-reais-uber', 6, 10 FROM modules WHERE slug = 'casos-reais' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Segurança', 'Proteção e segurança em sistemas distribuídos', 'seguranca', 11) ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Autenticação', '# Autenticação

Verificação de identidade em sistemas distribuídos

', 'seguranca-autenticacao', 1, 10 FROM modules WHERE slug = 'seguranca' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Autorização', '# Autorização

Controle de acesso e permissões

', 'seguranca-autorizacao', 2, 10 FROM modules WHERE slug = 'seguranca' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Criptografia', '# Criptografia

Proteção de dados em trânsito e em repouso

## Simulador

### Simulador

Experimente diferentes tipos de criptografia na prática

', 'seguranca-criptografia', 3, 10 FROM modules WHERE slug = 'seguranca' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Tokens e JWT', '# Tokens e JWT

Gerenciamento de sessões e tokens de acesso

## Simulador

### Simulador

Experimente a geração e validação de JWTs

', 'seguranca-tokens', 4, 10 FROM modules WHERE slug = 'seguranca' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'SSL/TLS', '# SSL/TLS

Comunicação segura entre sistemas

', 'seguranca-ssl-tls', 5, 10 FROM modules WHERE slug = 'seguranca' ON CONFLICT DO NOTHING;
INSERT INTO lessons (module_id, title, content, slug, "order", duration_minutes) SELECT id, 'Ataques Comuns', '# Ataques Comuns

Prevenção contra ataques em sistemas distribuídos

', 'seguranca-ataques', 6, 10 FROM modules WHERE slug = 'seguranca' ON CONFLICT DO NOTHING;
INSERT INTO modules (course_id, title, description, slug, "order") VALUES (course_id_val, 'Editor de Sistemas', 'Crie e simule sistemas distribuídos', 'editor', 12) ON CONFLICT DO NOTHING;
END $$;
COMMIT;