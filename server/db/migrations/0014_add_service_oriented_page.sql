-- Convert the last static (non-simulator) lesson page into CMS-managed MDX.
-- `/principios-design/servicos` was rendered by the hardcoded <ServiceOriented>
-- React component (content pulled from i18n) and had no content_pages row, so it
-- never appeared in the sidebar/registry. This adds it as MDX, attaches its
-- interactive simulator via simulator_key (service-architecture) so the auto-route
-- continues to serve `/principios-design/servicos/simulator`, and lets the
-- hardcoded routes be removed from src/App.tsx. Idempotent upsert (safe to re-run).
INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('design-principles/service-oriented', '/principios-design/servicos', 'design', 27, 'service-architecture', true, 'Service-Oriented Design', 'Design Orientado a Serviços', $mdx$# Service-Oriented Design

Explore different approaches for organizing services and their practical implications. Each architecture has its own trade-offs and ideal use cases.

## Monolith

All functionality in a single codebase, with tight coupling between modules.

<Cards cols={2}>

<Card title="Advantages" accent="green">

- Simple to develop initially
- Less overhead in inter-component communication
- Single, simple deploy
- Easier to test end-to-end
- Efficient resource sharing

</Card>

<Card title="Disadvantages" accent="red">

- Hard to scale specific parts of the system
- Any change requires a full redeploy
- Can become complex as it grows
- High coupling between modules
- Hard to maintain with large teams

</Card>

</Cards>

<Architecture
  layers={[
    { name: 'Single deploy', accent: 'purple', nodes: ['Authentication', 'Orders', 'Users'] },
  ]}
  caption="Shared database · direct function calls"
/>

<Callout type="info" title="Practical Example">

A simple e-commerce app where catalog, users, and orders all live in a single codebase.

</Callout>

## Modular Monolith

Code organized into well-defined modules with clear boundaries, but still a single deploy.

<Cards cols={2}>

<Card title="Advantages" accent="green">

- Well-organized, modular code with clear boundaries
- Easy to migrate to microservices later
- Lower operational complexity than microservices
- Good balance between simplicity and organization
- Enables gradual architectural evolution

</Card>

<Card title="Disadvantages" accent="red">

- Still requires discipline to keep module boundaries
- Scalability still limited by being a single unit
- Requires coordination between teams
- Temptation to break module boundaries
- Deploy is still coupled

</Card>

</Cards>

<Architecture
  layers={[
    { name: 'Single deploy', accent: 'brand', nodes: ['Auth Module', 'Orders Module', 'Users Module'] },
  ]}
  caption="Separate schemas · well-defined interfaces"
/>

<Callout type="info" title="Practical Example">

An e-commerce app whose code is split into independent modules (catalog, orders, users) with their own rules and data, yet deployed together as a single application.

</Callout>

## Microservices

Independent services communicating over the network, each with its own deploy and database.

<Cards cols={2}>

<Card title="Advantages" accent="green">

- Flexibility to scale specific parts of the system
- Greater modularity and easier maintenance
- Each team can focus on a single service
- Technology freedom per service
- Independent, faster deploys

</Card>

<Card title="Disadvantages" accent="red">

- Increased orchestration complexity
- Requires robust infrastructure
- Data consistency challenges
- Higher communication latency
- Higher operational costs

</Card>

</Cards>

<Cards cols={3}>

<Card title="Auth Service" accent="green">

- **Deploy:** independent
- **Communication:** REST/gRPC API
- **Database:** its own

</Card>

<Card title="Orders Service" accent="green">

- **Deploy:** independent
- **Communication:** REST/gRPC API
- **Database:** its own

</Card>

<Card title="Users Service" accent="green">

- **Deploy:** independent
- **Communication:** REST/gRPC API
- **Database:** its own

</Card>

</Cards>

<Callout type="info" title="Practical Example">

An e-commerce app where payment, inventory, and users are implemented as separate microservices.

</Callout>

## At a Glance

| Aspect | Monolith | Modular Monolith | Microservices |
| --- | --- | --- | --- |
| Deploy | Single | Single | Independent |
| Coupling | High | Medium | Low |
| Scaling | Vertical | Vertical | Per service |
| Operational complexity | Low | Medium | High |
| Best for | Small apps & MVPs | Growing apps | Large, multi-team systems |

<Callout type="success" title="Try It: Architecture Simulator">

Compare monolith, modular monolith, and microservices side by side in the [Architecture Simulator](/principios-design/servicos/simulator).

</Callout>
$mdx$, $mdx$# Design Orientado a Serviços

Explore as diferentes abordagens de organização de serviços e suas implicações práticas. Cada arquitetura tem seus próprios trade-offs e casos de uso ideais.

## Monolito

Todas as funcionalidades em um único código base, com acoplamento forte entre módulos.

<Cards cols={2}>

<Card title="Vantagens" accent="green">

- Simplicidade de desenvolvimento inicial
- Menos sobrecarga em comunicação entre componentes
- Deploy único e simples
- Mais fácil de testar end-to-end
- Compartilhamento de recursos eficiente

</Card>

<Card title="Desvantagens" accent="red">

- Difícil de escalar partes específicas do sistema
- Qualquer mudança exige redistribuição completa
- Pode se tornar complexo com o crescimento
- Alto acoplamento entre módulos
- Difícil manutenção em times grandes

</Card>

</Cards>

<Architecture
  layers={[
    { name: 'Deploy único', accent: 'purple', nodes: ['Autenticação', 'Pedidos', 'Usuários'] },
  ]}
  caption="Banco de dados compartilhado · chamadas de função diretas"
/>

<Callout type="info" title="Exemplo Prático">

Um aplicativo simples de e-commerce onde catálogo, usuários e pedidos estão em um único código base.

</Callout>

## Monolito Modular

Código organizado em módulos bem definidos com limites claros, mas ainda em um único deploy.

<Cards cols={2}>

<Card title="Vantagens" accent="green">

- Código bem organizado e modular com limites claros
- Facilidade de migração para microsserviços no futuro
- Menor complexidade operacional que microsserviços
- Bom equilíbrio entre simplicidade e organização
- Permite evolução gradual da arquitetura

</Card>

<Card title="Desvantagens" accent="red">

- Ainda requer disciplina para manter os limites entre módulos
- Escalabilidade ainda limitada por ser uma única unidade
- Necessidade de coordenação entre times
- Pode haver tentação de quebrar os limites dos módulos
- Deploy ainda é acoplado

</Card>

</Cards>

<Architecture
  layers={[
    { name: 'Deploy único', accent: 'brand', nodes: ['Módulo Auth', 'Módulo Pedidos', 'Módulo Usuários'] },
  ]}
  caption="Schemas separados · interfaces bem definidas"
/>

<Callout type="info" title="Exemplo Prático">

Um e-commerce com o código dividido em módulos independentes (catálogo, pedidos, usuários), com regras e dados próprios, porém implantados juntos como uma única aplicação.

</Callout>

## Microsserviços

Serviços independentes que se comunicam via rede, cada um com seu próprio deploy e banco de dados.

<Cards cols={2}>

<Card title="Vantagens" accent="green">

- Flexibilidade para escalar partes específicas do sistema
- Maior modularidade e facilidade de manutenção
- Cada equipe pode se concentrar em um único serviço
- Liberdade tecnológica por serviço
- Deploys independentes e mais rápidos

</Card>

<Card title="Desvantagens" accent="red">

- Complexidade aumentada na orquestração
- Requer infraestrutura robusta
- Desafios de consistência de dados
- Maior latência na comunicação
- Custos operacionais mais altos

</Card>

</Cards>

<Cards cols={3}>

<Card title="Auth Service" accent="green">

- **Deploy:** independente
- **Comunicação:** API REST/gRPC
- **Banco:** próprio

</Card>

<Card title="Orders Service" accent="green">

- **Deploy:** independente
- **Comunicação:** API REST/gRPC
- **Banco:** próprio

</Card>

<Card title="Users Service" accent="green">

- **Deploy:** independente
- **Comunicação:** API REST/gRPC
- **Banco:** próprio

</Card>

</Cards>

<Callout type="info" title="Exemplo Prático">

Um e-commerce onde pagamento, inventário e usuários são implementados como microsserviços separados.

</Callout>

## Resumo Comparativo

| Aspecto | Monolito | Monolito Modular | Microsserviços |
| --- | --- | --- | --- |
| Deploy | Único | Único | Independente |
| Acoplamento | Alto | Médio | Baixo |
| Escala | Vertical | Vertical | Por serviço |
| Complexidade operacional | Baixa | Média | Alta |
| Ideal para | Apps pequenos e MVPs | Apps em crescimento | Sistemas grandes e multi-times |

<Callout type="success" title="Experimente: Simulador de Arquiteturas">

Compare monolito, monolito modular e microsserviços lado a lado no [Simulador de Arquiteturas](/principios-design/servicos/simulator).

</Callout>
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
