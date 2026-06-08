-- Seed content modules + pages (idempotent upserts).
-- Generated from the local DB; safe to re-run.

INSERT INTO "content_modules" ("key", "label", "tier", "base", "paths", "order_index") VALUES
  ('fundamentals', 'Fundamentals', 'FOUNDATIONAL', '/intro', $mdx$["/intro","/sistemas-distribuidos-101","/system-design-101"]$mdx$::jsonb, 0),
  ('theory', 'Theoretical Foundations', 'FOUNDATIONAL', '/theoretical-foundations', NULL, 1),
  ('components', 'System Components', 'CORE', '/componentes', NULL, 2),
  ('design', 'Design Principles', 'CORE', '/principios-design', NULL, 3),
  ('data-storage', 'Data & Storage', 'CORE', '/dados-armazenamento', NULL, 4),
  ('consistency', 'Consistency Strategies', 'ADVANCED', '/estrategias-de-consistencia', NULL, 5),
  ('security', 'Security', 'ADVANCED', '/seguranca', NULL, 6),
  ('monitoring', 'Monitoring & Maintenance', 'ADVANCED', '/monitoramento-e-manutencao', NULL, 7),
  ('ai-systems', 'AI & LLM Systems', 'APPLIED', '/sistemas-ia', NULL, 8),
  ('cases', 'Real-World Cases', 'APPLIED', '/casos-reais', NULL, 9),
  ('tools', 'Tools & Community', 'TOOLS', '/editor', NULL, 10),
  ('practice', 'Practice Arena', 'TOOLS', '/design-lab', $mdx$["/design-lab","/quizzes","/ranking","/forum","/profile","/notifications"]$mdx$::jsonb, 11)
ON CONFLICT ("key") DO UPDATE SET "label" = EXCLUDED."label", "tier" = EXCLUDED."tier", "base" = EXCLUDED."base", "paths" = EXCLUDED."paths", "order_index" = EXCLUDED."order_index", "updated_at" = now();
--> statement-breakpoint
INSERT INTO "content_pages" ("slug", "path", "module_id", "requires_subscription", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('ai-systems/index', '/sistemas-ia', 'ai-systems', true, 74, NULL, true, 'AI & LLM Systems', 'Sistemas de IA e LLMs', $mdx$# AI & LLM Systems

Since 2021, large language models (LLMs) moved from research labs into production at massive scale. This changed distributed systems engineering: we now serve stateful, GPU-bound, probabilistic workloads with latency and cost profiles unlike any classic web service.

<Callout type="info" title="💡 Why This Section Exists">

Everything you learned about caching, queues, load balancing, and replication still applies — but LLM serving adds new constraints: expensive GPUs, token-by-token generation, huge model weights, and retrieval pipelines that ground answers in your own data.

</Callout>

## What Actually Changed

<Cards cols={2}>

<Card title="The Workload" accent="brand">

- Requests are **generative**: output is produced one token at a time
- Latency has two parts: **time-to-first-token** and **time-per-output-token**
- A single request can hold GPU memory for seconds
- The same prompt can cost wildly different amounts depending on length

</Card>

<Card title="The Hardware" accent="purple">

- GPUs are scarce, expensive, and slow to start
- Model weights are tens of GBs — cold starts are measured in minutes
- Throughput depends on **batching** many requests together
- Memory (the KV cache) is the real bottleneck, not raw compute

</Card>

</Cards>

## The New Building Blocks

<Cards cols={3}>

<Card title="Inference Server" accent="green">

Schedules and batches requests onto GPUs, manages the KV cache, and streams tokens back (vLLM, TGI, TensorRT-LLM).

</Card>

<Card title="Vector Database" accent="brand">

Stores embeddings and answers approximate nearest-neighbor queries for semantic search and retrieval (pgvector, Pinecone, Qdrant).

</Card>

<Card title="Model Gateway" accent="purple">

A smart proxy in front of models: routing, semantic caching, fallback, rate limiting, and cost accounting.

</Card>

</Cards>

## What You'll Learn Here

<Cards cols={2}>

<Card title="Serving & Scaling" accent="green">

- **LLM Serving Fundamentals**: tokens, context windows, prefill vs decode, the KV cache
- **Inference batching**: how throughput and latency trade off
- **GPU autoscaling**: cold starts, queueing, scale-to-zero

</Card>

<Card title="Retrieval & Orchestration" accent="brand">

- **RAG**: grounding answers in your own documents
- **Vector search**: approximate nearest neighbors at scale
- **Agentic systems**: tool calling and multi-step orchestration

</Card>

</Cards>

<Callout type="success" title="Prerequisites">

This section builds on the rest of the course. If terms like *cache*, *load balancer*, *queue*, *backpressure*, and *replication* are not yet familiar, start with **System Components** and **Design Principles** first.

</Callout>
$mdx$, $mdx$# Sistemas de IA e LLMs

Desde 2021, os grandes modelos de linguagem (LLMs) saíram dos laboratórios de pesquisa e entraram em produção em escala massiva. Isso mudou a engenharia de sistemas distribuídos: agora servimos cargas de trabalho com estado, dependentes de GPU e probabilísticas, com perfis de latência e custo diferentes de qualquer serviço web clássico.

<Callout type="info" title="💡 Por Que Esta Seção Existe">

Tudo o que você aprendeu sobre cache, filas, balanceamento de carga e replicação continua valendo — mas servir LLMs adiciona novas restrições: GPUs caras, geração token a token, pesos de modelo enormes e pipelines de recuperação que fundamentam respostas nos seus próprios dados.

</Callout>

## O Que Realmente Mudou

<Cards cols={2}>

<Card title="A Carga de Trabalho" accent="brand">

- As requisições são **generativas**: a saída é produzida um token por vez
- A latência tem duas partes: **tempo até o primeiro token** e **tempo por token de saída**
- Uma única requisição pode reter memória da GPU por segundos
- O mesmo prompt pode custar valores muito diferentes conforme o tamanho

</Card>

<Card title="O Hardware" accent="purple">

- GPUs são escassas, caras e lentas para iniciar
- Os pesos do modelo têm dezenas de GBs — partidas a frio levam minutos
- A vazão depende de **agrupar (batching)** muitas requisições juntas
- A memória (o KV cache) é o verdadeiro gargalo, não o poder de cálculo

</Card>

</Cards>

## Os Novos Blocos de Construção

<Cards cols={3}>

<Card title="Servidor de Inferência" accent="green">

Agenda e agrupa requisições nas GPUs, gerencia o KV cache e transmite tokens de volta (vLLM, TGI, TensorRT-LLM).

</Card>

<Card title="Banco Vetorial" accent="brand">

Armazena embeddings e responde consultas de vizinhos mais próximos aproximados para busca semântica e recuperação (pgvector, Pinecone, Qdrant).

</Card>

<Card title="Gateway de Modelos" accent="purple">

Um proxy inteligente na frente dos modelos: roteamento, cache semântico, fallback, limitação de taxa e contabilidade de custo.

</Card>

</Cards>

## O Que Você Vai Aprender Aqui

<Cards cols={2}>

<Card title="Servir e Escalar" accent="green">

- **Fundamentos de Serving de LLM**: tokens, janelas de contexto, prefill vs decode, o KV cache
- **Batching de inferência**: como vazão e latência se equilibram
- **Autoescalonamento de GPU**: partidas a frio, filas, escala-a-zero

</Card>

<Card title="Recuperação e Orquestração" accent="brand">

- **RAG**: fundamentar respostas nos seus próprios documentos
- **Busca vetorial**: vizinhos mais próximos aproximados em escala
- **Sistemas com agentes**: chamada de ferramentas e orquestração de múltiplos passos

</Card>

</Cards>

<Callout type="success" title="Pré-requisitos">

Esta seção se apoia no restante do curso. Se termos como *cache*, *balanceador de carga*, *fila*, *backpressure* e *replicação* ainda não são familiares, comece por **Componentes do Sistema** e **Princípios de Design** primeiro.

</Callout>
$mdx$),
  ('ai-systems/llm-serving-fundamentals', '/sistemas-ia/llm-serving-fundamentals', 'ai-systems', true, 75, NULL, true, 'LLM Serving Fundamentals', 'Fundamentos de Serving de LLM', $mdx$# LLM Serving Fundamentals

Before you can scale LLM inference, you need to understand what actually happens when a model answers a prompt. Serving an LLM is unlike serving a normal API: the response is generated one token at a time, and memory — not CPU — is usually what runs out first.

<Callout type="info" title="💡 Key Idea">

An LLM does not "look up" an answer. It repeatedly predicts the **next token** given everything it has seen so far. Generating 500 tokens means running the model 500 times in sequence for that request.

</Callout>

## Tokens and the Context Window

A **token** is a chunk of text — roughly 3–4 characters in English. Models read and write in tokens, not characters or words.

<Cards cols={2}>

<Card title="Tokens" accent="brand">

- "distributed" might be 2–3 tokens
- ~750 words ≈ 1,000 tokens
- You pay per input token and per output token
- Output tokens are usually more expensive than input tokens

</Card>

<Card title="Context Window" accent="purple">

- The maximum tokens a model can attend to at once
- Includes both the prompt **and** the generated output
- 4K in early GPT-3.5; 128K–1M+ in modern models
- Bigger context = more memory and higher latency

</Card>

</Cards>

## Prefill vs Decode: The Two Phases

Every request goes through two very different phases. Understanding them explains almost every LLM performance characteristic.

<Cards cols={2}>

<Card title="1. Prefill (Prompt Processing)" accent="green">

- Processes the **entire prompt in parallel**
- Compute-bound: great GPU utilization
- Produces the first token
- Determines **time-to-first-token (TTFT)**

</Card>

<Card title="2. Decode (Generation)" accent="brand">

- Generates output **one token at a time**
- Memory-bandwidth-bound: GPU is underused per request
- Each step depends on the previous one (sequential)
- Determines **time-per-output-token (TPOT)**

</Card>

</Cards>

<Callout type="warning" title="Why Decode Is Slow">

During decode, the model loads its huge weights from GPU memory for every single token but does very little math per request. This is why **batching many requests together** is the key to throughput — it amortizes that memory traffic across many users.

</Callout>

## The KV Cache: The Real Bottleneck

To avoid recomputing the whole sequence at every decode step, the model caches the intermediate attention state (the "keys" and "values") for every token. This is the **KV cache**.

<Cards cols={3}>

<Card title="What It Stores" accent="brand">

Per-token attention state for every layer, for every request currently in flight.

</Card>

<Card title="Why It Matters" accent="purple">

It grows with **sequence length × batch size**. Long contexts and many concurrent users eat GPU memory fast.

</Card>

<Card title="When It Runs Out" accent="red">

No KV cache space = no new requests admitted. The server must queue, evict, or reject — this is your real capacity limit.

</Card>

</Cards>

## Latency: Two Numbers That Matter

<Metrics cols={2}>

<Metric value="TTFT" label="Time to first token (prefill)" accent="green" />

<Metric value="TPOT" label="Time per output token (decode)" accent="brand" />

</Metrics>

Total response time ≈ `TTFT + (TPOT × number_of_output_tokens)`. Streaming tokens to the user hides latency: a low TTFT feels fast even if the full answer takes seconds.

## Throughput vs Latency: The Core Trade-off

<Callout type="neutral" title="The Batching Dilemma">

- **Bigger batches** → higher total throughput (tokens/sec across all users) but higher latency per user.
- **Smaller batches** → snappier individual responses but wasted GPU and higher cost per token.

Modern servers use **continuous batching**: instead of waiting to assemble a fixed batch, they add and remove requests from the running batch at every decode step, keeping the GPU full.

</Callout>

<Callout type="success" title="Try It: Inference Batching Simulator">

See how arrival rate, batch size, and the KV cache interact — and watch throughput trade off against p95 latency — in the [Inference Batching Simulator](/sistemas-ia/llm-serving-fundamentals/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Generation is sequential and runs the model once per token
- Prefill is fast and parallel; decode is slow and memory-bound
- The KV cache, not compute, usually limits concurrency

</Card>

<Card title="Design For" accent="brand">

- Stream tokens to minimize perceived latency
- Batch aggressively to maximize GPU throughput
- Cap context length to protect memory and cost

</Card>

</Cards>
$mdx$, $mdx$# Fundamentos de Serving de LLM

Antes de escalar a inferência de LLMs, você precisa entender o que realmente acontece quando um modelo responde a um prompt. Servir um LLM é diferente de servir uma API comum: a resposta é gerada um token por vez, e a memória — não a CPU — costuma ser o primeiro recurso a se esgotar.

<Callout type="info" title="💡 Ideia Central">

Um LLM não "consulta" uma resposta. Ele prevê repetidamente o **próximo token** dado tudo o que viu até agora. Gerar 500 tokens significa executar o modelo 500 vezes em sequência para aquela requisição.

</Callout>

## Tokens e a Janela de Contexto

Um **token** é um pedaço de texto — cerca de 3 a 4 caracteres em inglês. Modelos leem e escrevem em tokens, não em caracteres ou palavras.

<Cards cols={2}>

<Card title="Tokens" accent="brand">

- "distribuído" pode ser 2–3 tokens
- ~750 palavras ≈ 1.000 tokens
- Você paga por token de entrada e por token de saída
- Tokens de saída geralmente custam mais que os de entrada

</Card>

<Card title="Janela de Contexto" accent="purple">

- O máximo de tokens que o modelo consegue considerar de uma vez
- Inclui o prompt **e** a saída gerada
- 4K no GPT-3.5 inicial; 128K–1M+ em modelos modernos
- Mais contexto = mais memória e maior latência

</Card>

</Cards>

## Prefill vs Decode: As Duas Fases

Toda requisição passa por duas fases muito diferentes. Entendê-las explica quase toda característica de desempenho de LLMs.

<Cards cols={2}>

<Card title="1. Prefill (Processamento do Prompt)" accent="green">

- Processa o **prompt inteiro em paralelo**
- Limitado por cálculo: ótima utilização da GPU
- Produz o primeiro token
- Define o **tempo até o primeiro token (TTFT)**

</Card>

<Card title="2. Decode (Geração)" accent="brand">

- Gera a saída **um token por vez**
- Limitado pela largura de banda de memória: GPU subutilizada por requisição
- Cada passo depende do anterior (sequencial)
- Define o **tempo por token de saída (TPOT)**

</Card>

</Cards>

<Callout type="warning" title="Por Que o Decode É Lento">

Durante o decode, o modelo carrega seus enormes pesos da memória da GPU para cada token, mas faz pouquíssimo cálculo por requisição. É por isso que **agrupar muitas requisições** é a chave da vazão — isso dilui esse tráfego de memória entre muitos usuários.

</Callout>

## O KV Cache: O Verdadeiro Gargalo

Para evitar recalcular toda a sequência a cada passo de decode, o modelo guarda o estado intermediário de atenção (as "chaves" e os "valores") de cada token. Isso é o **KV cache**.

<Cards cols={3}>

<Card title="O Que Armazena" accent="brand">

O estado de atenção por token, em cada camada, para cada requisição em andamento.

</Card>

<Card title="Por Que Importa" accent="purple">

Cresce com **tamanho da sequência × tamanho do lote**. Contextos longos e muitos usuários simultâneos consomem memória da GPU rapidamente.

</Card>

<Card title="Quando Acaba" accent="red">

Sem espaço no KV cache = nenhuma nova requisição admitida. O servidor precisa enfileirar, despejar ou rejeitar — esse é o seu limite real de capacidade.

</Card>

</Cards>

## Latência: Dois Números Que Importam

<Metrics cols={2}>

<Metric value="TTFT" label="Tempo até o primeiro token (prefill)" accent="green" />

<Metric value="TPOT" label="Tempo por token de saída (decode)" accent="brand" />

</Metrics>

Tempo total de resposta ≈ `TTFT + (TPOT × número_de_tokens_de_saída)`. Transmitir tokens ao usuário esconde a latência: um TTFT baixo parece rápido mesmo que a resposta completa leve segundos.

## Vazão vs Latência: O Trade-off Central

<Callout type="neutral" title="O Dilema do Batching">

- **Lotes maiores** → maior vazão total (tokens/seg entre todos os usuários), mas maior latência por usuário.
- **Lotes menores** → respostas individuais mais ágeis, porém GPU desperdiçada e maior custo por token.

Servidores modernos usam **continuous batching**: em vez de esperar para montar um lote fixo, eles adicionam e removem requisições do lote em execução a cada passo de decode, mantendo a GPU cheia.

</Callout>

<Callout type="success" title="Experimente: Simulador de Batching de Inferência">

Veja como a taxa de chegada, o tamanho do lote e o KV cache interagem — e observe a vazão se equilibrar com a latência p95 — no [Simulador de Batching de Inferência](/sistemas-ia/llm-serving-fundamentals/simulator).

</Callout>

## Pontos-Chave

<Cards cols={2}>

<Card title="Lembre-se" accent="green">

- A geração é sequencial e executa o modelo uma vez por token
- O prefill é rápido e paralelo; o decode é lento e limitado por memória
- O KV cache, não o cálculo, costuma limitar a concorrência

</Card>

<Card title="Projete Para" accent="brand">

- Transmitir tokens para minimizar a latência percebida
- Agrupar agressivamente para maximizar a vazão da GPU
- Limitar o tamanho do contexto para proteger memória e custo

</Card>

</Cards>
$mdx$),
  ('ai-systems/rag', '/sistemas-ia/rag', 'ai-systems', true, 76, NULL, true, 'Retrieval-Augmented Generation (RAG)', 'Geração Aumentada por Recuperação (RAG)', $mdx$# Retrieval-Augmented Generation (RAG)

LLMs are trained on a frozen snapshot of data and have no access to your private documents. **RAG** fixes this by retrieving relevant context at query time and feeding it into the prompt — so the model answers from *your* data instead of its memory.

<Callout type="info" title="💡 The Core Idea">

Instead of asking the model to "know" the answer, RAG **finds** the relevant text first, then asks the model to answer *using only that text*. This reduces hallucinations and lets you cite sources.

</Callout>

## Why Not Just Use a Bigger Prompt?

<Cards cols={2}>

<Card title="The Problem" accent="red">

- You can't fit an entire knowledge base in the context window
- Even if you could, it would be slow and expensive
- The model can't see data created after training
- No way to update knowledge without retraining

</Card>

<Card title="The RAG Answer" accent="green">

- Store knowledge externally as searchable embeddings
- Retrieve only the few most relevant chunks per query
- Inject those chunks into the prompt
- Update knowledge by re-indexing, not retraining

</Card>

</Cards>

## The Two Pipelines

RAG has an **offline** indexing pipeline and an **online** query pipeline.

### Indexing (Offline, Batch)

<Cards cols={3}>

<Card title="1. Chunk" accent="brand">

Split documents into passages (e.g. 200–500 tokens) with some overlap so context isn't lost at boundaries.

</Card>

<Card title="2. Embed" accent="purple">

Run each chunk through an embedding model to get a vector that captures its meaning.

</Card>

<Card title="3. Index" accent="green">

Store vectors in a vector database with an approximate-nearest-neighbor index for fast search.

</Card>

</Cards>

### Querying (Online, Per Request)

<Cards cols={4}>

<Card title="1. Embed Query" accent="brand">

Convert the user's question into a vector with the same embedding model.

</Card>

<Card title="2. Retrieve" accent="purple">

Find the top-K most similar chunks via vector search (often plus keyword search — "hybrid").

</Card>

<Card title="3. Rerank" accent="green">

Reorder candidates with a more precise (slower) model and keep only the best few.

</Card>

<Card title="4. Generate" accent="brand">

Assemble the chunks into the prompt and ask the LLM to answer with citations.

</Card>

</Cards>

## The Knobs That Matter

<Callout type="neutral" title="Quality vs Cost vs Latency">

- **Chunk size**: small chunks = precise but fragmented; large chunks = more context but noisier.
- **top-K**: retrieve more for recall, but you pay for every chunk in the prompt and risk diluting the signal.
- **Reranking**: big quality boost, extra latency and cost.
- **Hybrid search**: combine semantic (vectors) with lexical (keywords) to catch exact terms and IDs.

</Callout>

## Failure Modes to Design Against

<Cards cols={3}>

<Card title="Retrieval Miss" accent="red">

The right chunk was never retrieved. The model answers from memory or refuses. Fix with better chunking, hybrid search, or higher K.

</Card>

<Card title="Lost in the Middle" accent="red">

Relevant context buried among many chunks gets ignored. Fix with reranking and tighter top-K.

</Card>

<Card title="Stale Index" accent="red">

Documents changed but the index didn't. Fix with incremental re-indexing and freshness checks.

</Card>

</Cards>

<Callout type="success" title="Try It: RAG Pipeline Simulator">

Watch a query flow through embed → vector search → rerank → context assembly → generate, and tune chunk size, top-K, and reranking to see the effect on answer quality and cost in the [RAG Pipeline Simulator](/sistemas-ia/rag/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- RAG grounds answers in external, updatable data
- Retrieval quality caps answer quality — garbage in, garbage out
- Citations and grounding reduce (not eliminate) hallucinations

</Card>

<Card title="Design For" accent="brand">

- Treat the vector DB as a first-class component
- Measure retrieval recall separately from answer quality
- Keep the index fresh with incremental updates

</Card>

</Cards>
$mdx$, $mdx$# Geração Aumentada por Recuperação (RAG)

LLMs são treinados em um instantâneo congelado de dados e não têm acesso aos seus documentos privados. O **RAG** resolve isso recuperando contexto relevante no momento da consulta e inserindo-o no prompt — para que o modelo responda a partir dos *seus* dados, e não da memória dele.

<Callout type="info" title="💡 A Ideia Central">

Em vez de pedir que o modelo "saiba" a resposta, o RAG primeiro **encontra** o texto relevante e depois pede que o modelo responda *usando apenas esse texto*. Isso reduz alucinações e permite citar fontes.

</Callout>

## Por Que Não Apenas Usar um Prompt Maior?

<Cards cols={2}>

<Card title="O Problema" accent="red">

- Você não consegue colocar toda uma base de conhecimento na janela de contexto
- Mesmo que coubesse, seria lento e caro
- O modelo não enxerga dados criados após o treino
- Não há como atualizar conhecimento sem retreinar

</Card>

<Card title="A Resposta do RAG" accent="green">

- Armazene o conhecimento externamente como embeddings pesquisáveis
- Recupere apenas os poucos trechos mais relevantes por consulta
- Injete esses trechos no prompt
- Atualize o conhecimento reindexando, não retreinando

</Card>

</Cards>

## Os Dois Pipelines

O RAG tem um pipeline de indexação **offline** e um pipeline de consulta **online**.

### Indexação (Offline, em Lote)

<Cards cols={3}>

<Card title="1. Fragmentar" accent="brand">

Divida documentos em passagens (ex.: 200–500 tokens) com alguma sobreposição para não perder contexto nas bordas.

</Card>

<Card title="2. Embeddar" accent="purple">

Passe cada trecho por um modelo de embedding para obter um vetor que captura seu significado.

</Card>

<Card title="3. Indexar" accent="green">

Armazene os vetores em um banco vetorial com um índice de vizinhos mais próximos aproximados para busca rápida.

</Card>

</Cards>

### Consulta (Online, por Requisição)

<Cards cols={4}>

<Card title="1. Embeddar Consulta" accent="brand">

Converta a pergunta do usuário em um vetor com o mesmo modelo de embedding.

</Card>

<Card title="2. Recuperar" accent="purple">

Encontre os top-K trechos mais similares via busca vetorial (muitas vezes somada à busca por palavra-chave — "híbrida").

</Card>

<Card title="3. Reordenar" accent="green">

Reordene os candidatos com um modelo mais preciso (e mais lento) e mantenha apenas os melhores.

</Card>

<Card title="4. Gerar" accent="brand">

Monte os trechos no prompt e peça ao LLM que responda com citações.

</Card>

</Cards>

## Os Botões Que Importam

<Callout type="neutral" title="Qualidade vs Custo vs Latência">

- **Tamanho do trecho**: trechos pequenos = precisos, porém fragmentados; trechos grandes = mais contexto, porém mais ruído.
- **top-K**: recupere mais para aumentar o recall, mas você paga por cada trecho no prompt e arrisca diluir o sinal.
- **Reordenação**: grande ganho de qualidade, com latência e custo extras.
- **Busca híbrida**: combine semântica (vetores) com léxica (palavras-chave) para captar termos exatos e IDs.

</Callout>

## Modos de Falha a Prevenir

<Cards cols={3}>

<Card title="Falha de Recuperação" accent="red">

O trecho certo nunca foi recuperado. O modelo responde de memória ou recusa. Corrija com melhor fragmentação, busca híbrida ou K maior.

</Card>

<Card title="Perdido no Meio" accent="red">

Contexto relevante enterrado entre muitos trechos é ignorado. Corrija com reordenação e top-K mais enxuto.

</Card>

<Card title="Índice Desatualizado" accent="red">

Os documentos mudaram, mas o índice não. Corrija com reindexação incremental e verificações de atualidade.

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Pipeline RAG">

Acompanhe uma consulta fluindo por embeddar → busca vetorial → reordenar → montar contexto → gerar, e ajuste tamanho do trecho, top-K e reordenação para ver o efeito na qualidade e no custo da resposta no [Simulador de Pipeline RAG](/sistemas-ia/rag/simulator).

</Callout>

## Pontos-Chave

<Cards cols={2}>

<Card title="Lembre-se" accent="green">

- O RAG fundamenta respostas em dados externos e atualizáveis
- A qualidade da recuperação limita a qualidade da resposta — lixo entra, lixo sai
- Citações e fundamentação reduzem (não eliminam) alucinações

</Card>

<Card title="Projete Para" accent="brand">

- Tratar o banco vetorial como componente de primeira classe
- Medir o recall da recuperação separadamente da qualidade da resposta
- Manter o índice atualizado com atualizações incrementais

</Card>

</Cards>
$mdx$),
  ('ai-systems/vector-search', '/sistemas-ia/vector-search', 'ai-systems', true, 77, NULL, true, 'Vector Search', 'Busca Vetorial', $mdx$# Vector Search

RAG and semantic search depend on one operation: given a query vector, find the most similar vectors in a huge collection. Doing this *exactly* is too slow at scale, so we use **Approximate Nearest Neighbor (ANN)** search to trade a little accuracy for enormous speed.

<Callout type="info" title="💡 The Core Operation">

Each document chunk is an embedding — a point in a high-dimensional space (often 768–3072 dimensions). "Similarity" is distance in that space. Search means finding the K closest points to the query point.

</Callout>

## Why Exact Search Doesn't Scale

<Cards cols={2}>

<Card title="Brute Force (Exact)" accent="red">

- Compare the query to **every** vector
- O(N) distance computations per query
- Fine for thousands of vectors
- Hopeless for millions or billions

</Card>

<Card title="ANN (Approximate)" accent="green">

- Use an index to skip most comparisons
- Sub-linear search time
- ~95–99% of the correct neighbors
- Powers production search at billion-scale

</Card>

</Cards>

## HNSW: The Workhorse Index

**Hierarchical Navigable Small World** graphs are the most common ANN index. Think of it as a navigable map with express lanes.

<Cards cols={3}>

<Card title="The Graph" accent="brand">

Vectors are nodes connected to their neighbors. Search "walks" the graph, always stepping toward the query.

</Card>

<Card title="The Hierarchy" accent="purple">

Upper layers have few long-range links (express lanes); lower layers are dense. Search starts high and descends.

</Card>

<Card title="The Trade-off" accent="green">

More connections and a longer candidate list = better recall, but more memory and slower queries.

</Card>

</Cards>

## The Knobs That Matter

<Callout type="neutral" title="Recall vs Latency vs Memory">

- **M** (connections per node): higher M = better recall and more memory per vector.
- **efConstruction**: effort spent building the graph — higher = better index, slower builds.
- **efSearch**: size of the candidate list at query time — the main runtime dial for recall vs latency.

Turning efSearch up explores more of the graph: recall climbs, but so does latency.

</Callout>

## Other Index Families

<Cards cols={3}>

<Card title="IVF" accent="brand">

Partition vectors into clusters; search only the nearest few clusters. Memory-efficient, tunable with `nprobe`.

</Card>

<Card title="PQ" accent="purple">

Product Quantization compresses vectors into compact codes — huge memory savings at some accuracy cost. Often combined with IVF.

</Card>

<Card title="Flat" accent="green">

No index — exact brute force. The correctness baseline you measure recall against.

</Card>

</Cards>

## Hybrid Search

Pure vector search misses exact terms — product IDs, error codes, rare names. **Hybrid search** combines semantic (vectors) with lexical (BM25/keyword) results, then fuses the rankings (e.g. Reciprocal Rank Fusion).

<Callout type="success" title="Try It: Vector Search Simulator">

Probe an HNSW index and watch how `efSearch`, `M`, and dataset size trade recall against query latency and memory in the [Vector Search Simulator](/sistemas-ia/vector-search/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Exact search is O(N); ANN makes it sub-linear
- HNSW trades memory and latency for recall
- Always measure recall against an exact baseline

</Card>

<Card title="Design For" accent="brand">

- Pick the index for your scale and memory budget
- Tune efSearch to hit a recall/latency target
- Add lexical search for exact-match terms

</Card>

</Cards>
$mdx$, $mdx$# Busca Vetorial

RAG e busca semântica dependem de uma operação: dado um vetor de consulta, encontrar os vetores mais similares em uma coleção enorme. Fazer isso de forma *exata* é lento demais em escala, então usamos a busca por **Vizinhos Mais Próximos Aproximados (ANN)** para trocar um pouco de precisão por uma velocidade enorme.

<Callout type="info" title="💡 A Operação Central">

Cada trecho de documento é um embedding — um ponto em um espaço de alta dimensão (muitas vezes 768–3072 dimensões). "Similaridade" é distância nesse espaço. Buscar significa encontrar os K pontos mais próximos do ponto da consulta.

</Callout>

## Por Que a Busca Exata Não Escala

<Cards cols={2}>

<Card title="Força Bruta (Exata)" accent="red">

- Compara a consulta com **todos** os vetores
- O(N) cálculos de distância por consulta
- Ok para milhares de vetores
- Inviável para milhões ou bilhões

</Card>

<Card title="ANN (Aproximada)" accent="green">

- Usa um índice para pular a maioria das comparações
- Tempo de busca sublinear
- ~95–99% dos vizinhos corretos
- Sustenta busca em produção em escala de bilhões

</Card>

</Cards>

## HNSW: O Índice Cavalo de Batalha

Grafos **Hierarchical Navigable Small World** são o índice ANN mais comum. Pense neles como um mapa navegável com vias expressas.

<Cards cols={3}>

<Card title="O Grafo" accent="brand">

Os vetores são nós conectados aos seus vizinhos. A busca "caminha" pelo grafo, sempre dando um passo em direção à consulta.

</Card>

<Card title="A Hierarquia" accent="purple">

Camadas superiores têm poucos links de longo alcance (vias expressas); camadas inferiores são densas. A busca começa no alto e desce.

</Card>

<Card title="O Trade-off" accent="green">

Mais conexões e uma lista de candidatos maior = melhor recall, mas mais memória e consultas mais lentas.

</Card>

</Cards>

## Os Botões Que Importam

<Callout type="neutral" title="Recall vs Latência vs Memória">

- **M** (conexões por nó): M maior = melhor recall e mais memória por vetor.
- **efConstruction**: esforço gasto ao construir o grafo — maior = índice melhor, builds mais lentos.
- **efSearch**: tamanho da lista de candidatos na consulta — o principal botão de tempo de execução para recall vs latência.

Aumentar o efSearch explora mais o grafo: o recall sobe, mas a latência também.

</Callout>

## Outras Famílias de Índice

<Cards cols={3}>

<Card title="IVF" accent="brand">

Particiona vetores em clusters; busca apenas os clusters mais próximos. Eficiente em memória, ajustável com `nprobe`.

</Card>

<Card title="PQ" accent="purple">

Product Quantization comprime vetores em códigos compactos — grande economia de memória com algum custo de precisão. Frequentemente combinado com IVF.

</Card>

<Card title="Flat" accent="green">

Sem índice — força bruta exata. A linha de base de correção contra a qual você mede o recall.

</Card>

</Cards>

## Busca Híbrida

A busca vetorial pura erra termos exatos — IDs de produto, códigos de erro, nomes raros. A **busca híbrida** combina resultados semânticos (vetores) com léxicos (BM25/palavra-chave) e funde os rankings (ex.: Reciprocal Rank Fusion).

<Callout type="success" title="Experimente: Simulador de Busca Vetorial">

Sonde um índice HNSW e veja como `efSearch`, `M` e o tamanho do dataset equilibram recall, latência de consulta e memória no [Simulador de Busca Vetorial](/sistemas-ia/vector-search/simulator).

</Callout>

## Pontos-Chave

<Cards cols={2}>

<Card title="Lembre-se" accent="green">

- A busca exata é O(N); a ANN a torna sublinear
- O HNSW troca memória e latência por recall
- Sempre meça o recall contra uma linha de base exata

</Card>

<Card title="Projete Para" accent="brand">

- Escolher o índice conforme sua escala e orçamento de memória
- Ajustar o efSearch para atingir uma meta de recall/latência
- Adicionar busca léxica para termos de correspondência exata

</Card>

</Cards>
$mdx$),
  ('ai-systems/llm-gateway', '/sistemas-ia/llm-gateway', 'ai-systems', true, 78, NULL, true, 'LLM Gateway', 'Gateway de LLM', $mdx$# LLM Gateway

Once more than one service calls an LLM, you don't want each one talking directly to a provider. An **LLM gateway** is a smart proxy that sits between your applications and the models — the API gateway pattern, specialized for the realities of LLM traffic.

<Callout type="info" title="💡 Why a Gateway">

LLM calls are slow, expensive, rate-limited, and occasionally fail. A gateway centralizes the cross-cutting concerns — routing, caching, fallback, limits, and cost — so individual services don't reinvent them.

</Callout>

## What It Does

<Cards cols={2}>

<Card title="Routing" accent="brand">

- Send cheap tasks to small models, hard tasks to large ones
- Route by tenant, feature, or prompt classification
- A/B test models behind a stable API

</Card>

<Card title="Resilience" accent="green">

- Fail over to another model or provider on error/timeout
- Retry with backoff
- Circuit-break a degraded provider

</Card>

<Card title="Cost & Limits" accent="purple">

- Per-key and per-tenant rate limits
- Token budgets and quotas
- Track spend per team and per feature

</Card>

<Card title="Caching" accent="brand">

- Exact-match cache for identical prompts
- **Semantic cache** for similar prompts
- Huge latency and cost savings on repeat traffic

</Card>

</Cards>

## Semantic Caching

A normal cache only hits on identical keys. A **semantic cache** embeds the incoming prompt and checks whether a *similar enough* prompt was answered before — returning the cached answer instantly.

<Callout type="warning" title="The Threshold Trade-off">

Semantic caching is governed by a similarity threshold:

- **Too loose** → wrong answers served from cache (false hits).
- **Too strict** → few cache hits, little benefit.

It shines for FAQs and repetitive queries; it's risky for prompts where small wording changes must change the answer.

</Callout>

## Fallback and Failover

Providers have outages, rate limits, and latency spikes. A gateway defines a fallback chain:

<Cards cols={3}>

<Card title="1. Primary" accent="green">

Your preferred model. Most traffic goes here.

</Card>

<Card title="2. Fallback" accent="amber">

A second model or provider, tried on error, timeout, or rate-limit from the primary.

</Card>

<Card title="3. Degrade" accent="red">

Last resort: a smaller/cheaper model, a cached answer, or a graceful error.

</Card>

</Cards>

## Rate Limiting and Cost Control

Because tokens cost money and providers enforce their own limits, the gateway is where you enforce yours: token-bucket rate limits per API key, hard monthly budgets, and per-request cost accounting that feeds dashboards and alerts.

<Callout type="success" title="Try It: LLM Gateway Simulator">

Send traffic through a gateway and tune the cache hit rate, rate limit, and primary failure rate to watch requests get served from cache, routed to fallback, or rejected — and see the running cost — in the [LLM Gateway Simulator](/sistemas-ia/llm-gateway/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- A gateway centralizes routing, caching, fallback, limits, and cost
- Semantic caching trades a similarity threshold for hit rate
- Fallback chains keep you serving during provider failures

</Card>

<Card title="Design For" accent="brand">

- Treat the gateway as critical infrastructure (it's a SPOF)
- Make routing and limits configurable, not hard-coded
- Measure cost and cache hit rate per tenant

</Card>

</Cards>
$mdx$, $mdx$# Gateway de LLM

Assim que mais de um serviço chama um LLM, você não quer que cada um fale diretamente com um provedor. Um **gateway de LLM** é um proxy inteligente entre suas aplicações e os modelos — o padrão de API gateway, especializado para a realidade do tráfego de LLMs.

<Callout type="info" title="💡 Por Que um Gateway">

Chamadas a LLMs são lentas, caras, limitadas por taxa e ocasionalmente falham. Um gateway centraliza as preocupações transversais — roteamento, cache, fallback, limites e custo — para que cada serviço não as reinvente.

</Callout>

## O Que Ele Faz

<Cards cols={2}>

<Card title="Roteamento" accent="brand">

- Envia tarefas baratas a modelos pequenos e difíceis a modelos grandes
- Roteia por tenant, funcionalidade ou classificação do prompt
- Faz teste A/B de modelos atrás de uma API estável

</Card>

<Card title="Resiliência" accent="green">

- Faz failover para outro modelo ou provedor em erro/timeout
- Repete com backoff
- Abre o circuito de um provedor degradado

</Card>

<Card title="Custo e Limites" accent="purple">

- Limites de taxa por chave e por tenant
- Orçamentos e cotas de tokens
- Acompanha o gasto por equipe e por funcionalidade

</Card>

<Card title="Cache" accent="brand">

- Cache de correspondência exata para prompts idênticos
- **Cache semântico** para prompts similares
- Grande economia de latência e custo no tráfego repetido

</Card>

</Cards>

## Cache Semântico

Um cache comum só acerta com chaves idênticas. Um **cache semântico** embedda o prompt recebido e verifica se um prompt *suficientemente similar* já foi respondido antes — retornando a resposta em cache instantaneamente.

<Callout type="warning" title="O Trade-off do Limiar">

O cache semântico é regido por um limiar de similaridade:

- **Muito frouxo** → respostas erradas servidas do cache (falsos acertos).
- **Muito rígido** → poucos acertos de cache, pouco benefício.

Ele brilha em FAQs e consultas repetitivas; é arriscado para prompts em que pequenas mudanças de redação devem mudar a resposta.

</Callout>

## Fallback e Failover

Provedores têm quedas, limites de taxa e picos de latência. Um gateway define uma cadeia de fallback:

<Cards cols={3}>

<Card title="1. Primário" accent="green">

Seu modelo preferido. A maior parte do tráfego vai para cá.

</Card>

<Card title="2. Fallback" accent="amber">

Um segundo modelo ou provedor, acionado em erro, timeout ou limite de taxa do primário.

</Card>

<Card title="3. Degradar" accent="red">

Último recurso: um modelo menor/mais barato, uma resposta em cache ou um erro gracioso.

</Card>

</Cards>

## Limitação de Taxa e Controle de Custo

Como tokens custam dinheiro e os provedores impõem seus próprios limites, o gateway é onde você impõe os seus: limites de taxa por token-bucket por chave de API, orçamentos mensais rígidos e contabilidade de custo por requisição que alimenta dashboards e alertas.

<Callout type="success" title="Experimente: Simulador de Gateway de LLM">

Envie tráfego por um gateway e ajuste a taxa de acerto do cache, o limite de taxa e a taxa de falha do primário para ver requisições servidas do cache, roteadas para fallback ou rejeitadas — e o custo acumulado — no [Simulador de Gateway de LLM](/sistemas-ia/llm-gateway/simulator).

</Callout>

## Pontos-Chave

<Cards cols={2}>

<Card title="Lembre-se" accent="green">

- Um gateway centraliza roteamento, cache, fallback, limites e custo
- O cache semântico troca um limiar de similaridade por taxa de acerto
- Cadeias de fallback mantêm o atendimento durante falhas de provedores

</Card>

<Card title="Projete Para" accent="brand">

- Tratar o gateway como infraestrutura crítica (é um ponto único de falha)
- Tornar roteamento e limites configuráveis, não fixos no código
- Medir custo e taxa de acerto de cache por tenant

</Card>

</Cards>
$mdx$),
  ('ai-systems/gpu-autoscaling', '/sistemas-ia/gpu-autoscaling', 'ai-systems', true, 79, NULL, true, 'GPU Serving & Autoscaling', 'Serving de GPU e Autoescalonamento', $mdx$# GPU Serving & Autoscaling

Scaling a stateless web service is easy: add more pods behind a load balancer. Scaling **GPU inference** is hard — GPUs are expensive, scarce, and slow to start. Getting autoscaling right is the difference between a huge cloud bill and unhappy, queued users.

<Callout type="info" title="💡 The Core Tension">

GPUs cost dollars per hour whether busy or idle. You want to run few of them (save money) but enough to absorb traffic spikes (keep latency low). These goals fight each other.

</Callout>

## Why GPU Autoscaling Is Different

<Cards cols={2}>

<Card title="Cold Starts Are Brutal" accent="red">

- Model weights are tens of GBs to load
- Provisioning a GPU node can take minutes
- You can't scale up instantly to meet a spike
- Requests queue while new replicas warm up

</Card>

<Card title="The Economics" accent="purple">

- A single GPU can cost more per hour than dozens of CPUs
- Idle GPUs are pure waste
- Over-provisioning is expensive; under-provisioning drops requests
- Utilization is the metric that matters

</Card>

</Cards>

## What to Scale On

CPU utilization is a poor signal for LLM serving. Better signals reflect the actual bottleneck:

<Cards cols={3}>

<Card title="Queue Depth" accent="brand">

Requests waiting for a free slot. The most direct sign you need more capacity.

</Card>

<Card title="Batch / KV Utilization" accent="purple">

How full the running batch and KV cache are. High utilization means you're near capacity.

</Card>

<Card title="Latency SLO" accent="green">

Time-to-first-token creeping up signals saturation before requests start failing.

</Card>

</Cards>

## Scale-to-Zero

For spiky or low-volume workloads, keeping a GPU running 24/7 is wasteful. **Scale-to-zero** shuts down all replicas when idle and spins one up on the next request.

<Callout type="warning" title="The Cold-Start Tax">

Scale-to-zero saves money but the first request after idling pays the full cold-start cost (model load + node provisioning). Mitigations:

- Keep one warm replica during business hours
- Pre-warm before predictable spikes
- Snapshot/lazy-load weights to shrink startup time
- Use smaller models for the warm tier

</Callout>

## Handling Spikes Without Enough GPUs

Because you can't scale instantly, you need backpressure and graceful degradation:

<Cards cols={3}>

<Card title="Queue" accent="brand">

Admit what you can, queue the rest with a bounded depth and a timeout.

</Card>

<Card title="Shed Load" accent="amber">

Reject or defer low-priority requests when the queue is full (see backpressure).

</Card>

<Card title="Degrade" accent="red">

Route overflow to a smaller/cheaper model or a cached response.

</Card>

</Cards>

<Callout type="success" title="Try It: GPU Autoscaler Simulator">

Drive bursty traffic into a GPU pool and tune the arrival rate, scale-up threshold, and cold-start time to watch replicas warm up, the queue build and drain, and cost trade off against latency in the [GPU Autoscaler Simulator](/sistemas-ia/gpu-autoscaling/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Cold starts make GPU scaling slow and reactive
- Scale on queue depth and utilization, not CPU
- Scale-to-zero saves money but taxes the next request

</Card>

<Card title="Design For" accent="brand">

- Keep a warm tier for latency-sensitive traffic
- Use backpressure and degradation for spikes
- Optimize model load time to shrink cold starts

</Card>

</Cards>
$mdx$, $mdx$# Serving de GPU e Autoescalonamento

Escalar um serviço web sem estado é fácil: adicione mais pods atrás de um balanceador. Escalar **inferência em GPU** é difícil — GPUs são caras, escassas e lentas para iniciar. Acertar o autoescalonamento é a diferença entre uma conta de nuvem enorme e usuários insatisfeitos e enfileirados.

<Callout type="info" title="💡 A Tensão Central">

GPUs custam dólares por hora estejam ocupadas ou ociosas. Você quer rodar poucas (economizar) mas o suficiente para absorver picos de tráfego (manter a latência baixa). Esses objetivos brigam entre si.

</Callout>

## Por Que o Autoescalonamento de GPU É Diferente

<Cards cols={2}>

<Card title="Partidas a Frio São Brutais" accent="red">

- Os pesos do modelo têm dezenas de GBs para carregar
- Provisionar um nó com GPU pode levar minutos
- Você não consegue escalar instantaneamente em um pico
- Requisições enfileiram enquanto novas réplicas aquecem

</Card>

<Card title="A Economia" accent="purple">

- Uma única GPU pode custar por hora mais que dezenas de CPUs
- GPUs ociosas são puro desperdício
- Superprovisionar é caro; subprovisionar derruba requisições
- A utilização é a métrica que importa

</Card>

</Cards>

## Em Que Escalar

A utilização de CPU é um sinal ruim para serving de LLM. Sinais melhores refletem o gargalo real:

<Cards cols={3}>

<Card title="Tamanho da Fila" accent="brand">

Requisições esperando por um slot livre. O sinal mais direto de que você precisa de mais capacidade.

</Card>

<Card title="Utilização do Lote / KV" accent="purple">

Quão cheios estão o lote em execução e o KV cache. Alta utilização significa que você está perto da capacidade.

</Card>

<Card title="SLO de Latência" accent="green">

O tempo até o primeiro token subindo sinaliza saturação antes que as requisições comecem a falhar.

</Card>

</Cards>

## Escala-a-Zero

Para cargas em rajada ou de baixo volume, manter uma GPU rodando 24/7 é desperdício. A **escala-a-zero** desliga todas as réplicas quando ociosas e sobe uma na próxima requisição.

<Callout type="warning" title="O Imposto da Partida a Frio">

A escala-a-zero economiza dinheiro, mas a primeira requisição após a ociosidade paga todo o custo de partida a frio (carga do modelo + provisionamento do nó). Mitigações:

- Mantenha uma réplica aquecida no horário comercial
- Pré-aqueça antes de picos previsíveis
- Use snapshot/carregamento preguiçoso dos pesos para reduzir o tempo de início
- Use modelos menores na camada aquecida

</Callout>

## Lidando com Picos Sem GPUs Suficientes

Como você não pode escalar instantaneamente, precisa de backpressure e degradação graciosa:

<Cards cols={3}>

<Card title="Enfileirar" accent="brand">

Admita o que puder, enfileire o resto com profundidade limitada e um timeout.

</Card>

<Card title="Descartar Carga" accent="amber">

Rejeite ou adie requisições de baixa prioridade quando a fila estiver cheia (veja backpressure).

</Card>

<Card title="Degradar" accent="red">

Roteie o excedente para um modelo menor/mais barato ou uma resposta em cache.

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Autoescalonador de GPU">

Direcione tráfego em rajadas para um pool de GPUs e ajuste a taxa de chegada, o limiar para escalar e o tempo de partida a frio para ver réplicas aquecerem, a fila crescer e esvaziar, e o custo se equilibrar com a latência no [Simulador de Autoescalonador de GPU](/sistemas-ia/gpu-autoscaling/simulator).

</Callout>

## Pontos-Chave

<Cards cols={2}>

<Card title="Lembre-se" accent="green">

- Partidas a frio tornam o escalonamento de GPU lento e reativo
- Escale por tamanho da fila e utilização, não por CPU
- A escala-a-zero economiza, mas taxa a próxima requisição

</Card>

<Card title="Projete Para" accent="brand">

- Manter uma camada aquecida para tráfego sensível à latência
- Usar backpressure e degradação para picos
- Otimizar o tempo de carga do modelo para reduzir partidas a frio

</Card>

</Cards>
$mdx$),
  ('ai-systems/agentic-systems', '/sistemas-ia/agentic-systems', 'ai-systems', true, 80, NULL, true, 'Agentic Systems', 'Sistemas com Agentes', $mdx$# Agentic Systems

An **agent** is an LLM that doesn't just answer — it acts. Given a goal, it reasons about what to do, calls tools, observes the results, and loops until the task is done. This turns a single prediction into a multi-step distributed workflow with new reliability challenges.

<Callout type="info" title="💡 From Answering to Acting">

A chatbot maps prompt → answer. An agent runs a loop: **reason → act (call a tool) → observe → repeat**. Each iteration is another LLM call, and tools are calls to real systems.

</Callout>

## The Agent Loop

<Cards cols={4}>

<Card title="1. Think" accent="brand">

The model decides the next step toward the goal.

</Card>

<Card title="2. Act" accent="purple">

It calls a tool — search, a database query, code execution, an API.

</Card>

<Card title="3. Observe" accent="green">

The tool's result is fed back into the context.

</Card>

<Card title="4. Repeat" accent="brand">

Loop until the goal is met or a step budget is hit.

</Card>

</Cards>

## Tool Calling

Tools are how an agent affects the world. The model emits a structured call (name + arguments); your runtime executes it and returns the result.

<Cards cols={2}>

<Card title="Common Tools" accent="brand">

- Web / document search (RAG retrieval)
- Database and API queries
- Code execution / calculators
- Sending email, creating tickets, taking actions

</Card>

<Card title="Runtime Concerns" accent="green">

- Validate arguments before executing
- Time out and retry flaky tools
- Sandbox anything that runs code
- Make actions idempotent where possible

</Card>

</Cards>

## Orchestration vs Choreography (Again)

Multi-agent systems revisit a familiar distributed-systems choice:

<Cards cols={2}>

<Card title="Orchestration" accent="brand">

A central "planner" agent directs specialized sub-agents. Easier to reason about and control; the planner is a bottleneck and single point of failure.

</Card>

<Card title="Choreography" accent="purple">

Agents react to shared state or messages without a central conductor. More scalable and resilient; harder to debug and reason about.

</Card>

</Cards>

## Why Agents Are Hard to Operate

<Callout type="warning" title="Reliability Challenges">

- **Compounding errors**: a wrong step early derails everything after it.
- **Loops and runaway cost**: without a step/token budget, an agent can spin forever.
- **Non-determinism**: the same goal can take different paths each run.
- **Latency**: many sequential LLM + tool calls add up to seconds or minutes.
- **Partial failure**: a tool half-succeeds — design for retries and idempotency.

</Callout>

## Guardrails for Agents

<Cards cols={3}>

<Card title="Budgets" accent="brand">

Hard caps on steps, tokens, time, and cost per run.

</Card>

<Card title="Human-in-the-Loop" accent="purple">

Require approval before high-impact actions (payments, deletes, emails).

</Card>

<Card title="Observability" accent="green">

Trace every step, tool call, and decision so you can debug and audit.

</Card>

</Cards>

<Callout type="success" title="Try It: Agent Orchestration Simulator">

Watch an agent run its reason → act → observe loop, call tools, retry failures, and hit its step budget — and see how tool failure rate affects steps, retries, and tokens — in the [Agent Orchestration Simulator](/sistemas-ia/agentic-systems/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Agents turn one prediction into a multi-step workflow
- Tool calls connect the model to real systems
- Errors compound, so budgets and guardrails are essential

</Card>

<Card title="Design For" accent="brand">

- Bound steps, tokens, time, and cost
- Make tools idempotent and sandboxed
- Trace everything for debugging and audit

</Card>

</Cards>
$mdx$, $mdx$# Sistemas com Agentes

Um **agente** é um LLM que não apenas responde — ele age. Dado um objetivo, ele raciocina sobre o que fazer, chama ferramentas, observa os resultados e repete até a tarefa terminar. Isso transforma uma única predição em um fluxo de trabalho distribuído de múltiplos passos, com novos desafios de confiabilidade.

<Callout type="info" title="💡 De Responder para Agir">

Um chatbot mapeia prompt → resposta. Um agente roda um laço: **raciocinar → agir (chamar uma ferramenta) → observar → repetir**. Cada iteração é mais uma chamada ao LLM, e as ferramentas são chamadas a sistemas reais.

</Callout>

## O Laço do Agente

<Cards cols={4}>

<Card title="1. Pensar" accent="brand">

O modelo decide o próximo passo em direção ao objetivo.

</Card>

<Card title="2. Agir" accent="purple">

Ele chama uma ferramenta — busca, consulta a banco, execução de código, uma API.

</Card>

<Card title="3. Observar" accent="green">

O resultado da ferramenta é realimentado no contexto.

</Card>

<Card title="4. Repetir" accent="brand">

Repete até o objetivo ser atingido ou o orçamento de passos acabar.

</Card>

</Cards>

## Chamada de Ferramentas

Ferramentas são como um agente afeta o mundo. O modelo emite uma chamada estruturada (nome + argumentos); seu runtime a executa e retorna o resultado.

<Cards cols={2}>

<Card title="Ferramentas Comuns" accent="brand">

- Busca na web / documentos (recuperação RAG)
- Consultas a bancos e APIs
- Execução de código / calculadoras
- Enviar e-mail, criar tickets, executar ações

</Card>

<Card title="Preocupações de Runtime" accent="green">

- Valide os argumentos antes de executar
- Use timeout e retry em ferramentas instáveis
- Faça sandbox de qualquer coisa que execute código
- Torne as ações idempotentes quando possível

</Card>

</Cards>

## Orquestração vs Coreografia (de Novo)

Sistemas com múltiplos agentes revisitam uma escolha familiar de sistemas distribuídos:

<Cards cols={2}>

<Card title="Orquestração" accent="brand">

Um agente "planejador" central dirige sub-agentes especializados. Mais fácil de entender e controlar; o planejador é um gargalo e ponto único de falha.

</Card>

<Card title="Coreografia" accent="purple">

Agentes reagem a estado compartilhado ou mensagens sem um maestro central. Mais escalável e resiliente; mais difícil de depurar e entender.

</Card>

</Cards>

## Por Que Agentes São Difíceis de Operar

<Callout type="warning" title="Desafios de Confiabilidade">

- **Erros que se acumulam**: um passo errado no início descarrila tudo depois dele.
- **Laços e custo descontrolado**: sem orçamento de passos/tokens, um agente pode rodar para sempre.
- **Não determinismo**: o mesmo objetivo pode tomar caminhos diferentes a cada execução.
- **Latência**: muitas chamadas sequenciais de LLM + ferramentas somam segundos ou minutos.
- **Falha parcial**: uma ferramenta acerta pela metade — projete para retries e idempotência.

</Callout>

## Guardrails para Agentes

<Cards cols={3}>

<Card title="Orçamentos" accent="brand">

Limites rígidos de passos, tokens, tempo e custo por execução.

</Card>

<Card title="Humano no Laço" accent="purple">

Exija aprovação antes de ações de alto impacto (pagamentos, exclusões, e-mails).

</Card>

<Card title="Observabilidade" accent="green">

Rastreie cada passo, chamada de ferramenta e decisão para poder depurar e auditar.

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Orquestração de Agentes">

Veja um agente rodar seu laço raciocinar → agir → observar, chamar ferramentas, repetir falhas e atingir seu orçamento de passos — e como a taxa de falha das ferramentas afeta passos, tentativas e tokens — no [Simulador de Orquestração de Agentes](/sistemas-ia/agentic-systems/simulator).

</Callout>

## Pontos-Chave

<Cards cols={2}>

<Card title="Lembre-se" accent="green">

- Agentes transformam uma predição em um fluxo de múltiplos passos
- Chamadas de ferramentas conectam o modelo a sistemas reais
- Erros se acumulam, então orçamentos e guardrails são essenciais

</Card>

<Card title="Projete Para" accent="brand">

- Limitar passos, tokens, tempo e custo
- Tornar ferramentas idempotentes e em sandbox
- Rastrear tudo para depuração e auditoria

</Card>

</Cards>
$mdx$),
  ('real-cases/index', '/casos-reais', 'cases', true, 87, NULL, true, 'Learn from the Giants', 'Aprenda com os Gigantes', $mdx$# Learn from the Giants

Dive into the architectures and technical decisions of companies that define the future of technology

## Why study real cases?

<Cards cols={3}>

<Card emoji="🎯" title="Practical Learning" accent="brand">

See how real problems are solved at global scale, with practical decisions and trade-offs.

</Card>

<Card emoji="🚀" title="Technical Evolution" accent="brand">

Understand how systems evolve from MVPs to architectures that serve billions of users.

</Card>

<Card emoji="💡" title="Valuable Insights" accent="brand">

Discover patterns and practices that can be applied to projects of any scale.

</Card>

</Cards>

## Featured Case Studies

<Cards cols={2}>

<Card title="Netflix" accent="red">

How to deliver video streaming to millions of users with low latency and high quality.

[Explore →](/casos-reais/netflix)

</Card>

<Card title="Uber" accent="slate">

Real-time matching system and geolocation at global scale.

[Explore →](/casos-reais/uber)

</Card>

<Card title="WhatsApp" accent="green">

Real-time messaging architecture with end-to-end encryption.

[Explore →](/casos-reais/whatsapp)

</Card>

<Card title="Spotify" accent="green">

Audio streaming and music recommendation at massive scale.

[Explore →](/casos-reais/spotify)

</Card>

</Cards>

## Technical Decisions that Changed the Game

<Card title="Netflix • Open Connect" accent="red">

Why did Netflix decide to build its own CDN instead of using third-party solutions? A decision that revolutionized content delivery and saved millions in bandwidth costs.

</Card>

<Card title="WhatsApp • Erlang" accent="green">

The choice of Erlang for WhatsApp's backend allowed just 50 engineers to support 1 billion users. A lesson on choosing the right technology for the right problem.

</Card>

<Card title="Uber • Geolocation" accent="slate">

The development of H3, a hierarchical geospatial indexing system, solved complex problems of route optimization and real-time matching.

</Card>

<Card title="Spotify • Microservices" accent="green">

The migration to a microservices architecture allowed Spotify to scale its teams and infrastructure independently, accelerating innovation.

</Card>

<Card title="YouTube • Vitess" accent="red">

The development of Vitess to scale MySQL horizontally became an essential solution for many other companies facing similar data challenges.

</Card>

<Card title="Bit.ly • Consistency" accent="brand">

The choice of strong consistency for short URLs while maintaining eventual consistency for analytics demonstrates how to balance different requirements in the same system.

</Card>
$mdx$, $mdx$# Aprenda com os Gigantes

Mergulhe nas arquiteturas e decisões técnicas das empresas que definem o futuro da tecnologia

## Por que estudar casos reais?

<Cards cols={3}>

<Card emoji="🎯" title="Aprendizado Prático" accent="brand">

Veja como problemas reais são resolvidos em escala global, com decisões e trade-offs práticos.

</Card>

<Card emoji="🚀" title="Evolução Técnica" accent="brand">

Entenda como sistemas evoluem de MVPs para arquiteturas que atendem bilhões de usuários.

</Card>

<Card emoji="💡" title="Insights Valiosos" accent="brand">

Descubra padrões e práticas que podem ser aplicados em projetos de qualquer escala.

</Card>

</Cards>

## Casos de Estudo em Destaque

<Cards cols={2}>

<Card title="Netflix" accent="red">

Como entregar streaming de vídeo para milhões de usuários com baixa latência e alta qualidade.

[Explorar →](/casos-reais/netflix)

</Card>

<Card title="Uber" accent="slate">

Sistema de matching em tempo real e geolocalização em escala global.

[Explorar →](/casos-reais/uber)

</Card>

<Card title="WhatsApp" accent="green">

Arquitetura de mensagens em tempo real com criptografia ponta a ponta.

[Explorar →](/casos-reais/whatsapp)

</Card>

<Card title="Spotify" accent="green">

Streaming de áudio e recomendação de música em escala massiva.

[Explorar →](/casos-reais/spotify)

</Card>

</Cards>

## Decisões Técnicas que Mudaram o Jogo

<Card title="Netflix • Open Connect" accent="red">

Por que a Netflix decidiu construir sua própria CDN em vez de usar soluções de terceiros? Uma decisão que revolucionou a entrega de conteúdo e economizou milhões em custos de banda.

</Card>

<Card title="WhatsApp • Erlang" accent="green">

A escolha do Erlang para o backend do WhatsApp permitiu que apenas 50 engenheiros suportassem 1 bilhão de usuários. Uma lição sobre escolher a tecnologia certa para o problema certo.

</Card>

<Card title="Uber • Geolocalização" accent="slate">

O desenvolvimento do H3, um sistema de indexação geoespacial hierárquico, resolveu problemas complexos de otimização de rotas e matching em tempo real.

</Card>

<Card title="Spotify • Microsserviços" accent="green">

A migração para uma arquitetura de microsserviços permitiu ao Spotify escalar seus times e sua infraestrutura de forma independente, acelerando a inovação.

</Card>

<Card title="YouTube • Vitess" accent="red">

O desenvolvimento do Vitess para escalar MySQL horizontalmente se tornou uma solução essencial para muitas outras empresas enfrentando desafios similares de dados.

</Card>

<Card title="Bit.ly • Consistência" accent="brand">

A escolha de consistência forte para URLs curtas enquanto mantém consistência eventual para analytics demonstra como balancear requisitos diferentes no mesmo sistema.

</Card>
$mdx$),
  ('real-cases/youtube', '/casos-reais/youtube', 'cases', true, 88, NULL, true, 'YouTube System Design', 'YouTube System Design', $mdx$# YouTube System Design

How YouTube processes, stores and distributes billions of videos globally

## Impressive Numbers

<Metrics cols={3}>

<Metric value="2.7B+" label="Active monthly users" accent="red" />

<Metric value="500h+" label="Videos uploaded per minute" accent="red" />

<Metric value="1B+" label="Hours watched per day" accent="red" />

</Metrics>

## Origin Story

YouTube was founded in February 2005 by three early PayPal employees — Chad Hurley, Steve Chen, and Jawed Karim — and run, in its earliest days, out of an office above a pizzeria in San Mateo. The founders were frustrated with how hard it was to share video clips online and built the simplest possible fix: upload once, get a link, watch in the browser. The first-ever upload, Karim's 19-second "Me at the zoo," went live on April 23, 2005.

Growth was explosive. Within roughly 18 months — and before YouTube had earned a dollar — Google acquired it in November 2006 for $1.65 billion in stock. That acquisition gave YouTube access to Google's infrastructure (GFS, BigTable, and later Colossus and Spanner) exactly when its homegrown MySQL stack was buckling under the load.

The rest of this page traces how that early monolith evolved into a planet-scale platform ingesting hundreds of hours of video every minute.

<Callout type="info" title="💡 A $1.65B Bet on a Pizzeria Startup">

Google bought YouTube for $1.65 billion just 18 months after its launch — before the site had generated meaningful revenue. It is now one of the most-watched platforms on Earth.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="red">

- Upload of videos in multiple formats
- Video processing and transcoding
- Video streaming with multiple qualities
- Custom recommendation system
- Social features (likes, comments, subscriptions)

</Card>

<Card title="Non-Functional Requirements" accent="red">

- High availability (99.99%)
- Global low latency
- Eventual consistency
- Massive horizontal scalability
- Data durability

</Card>

## System Architecture

### 1. Upload and Video Processing

#### Upload Pipeline

- Uploads are divided into chunks and sent in parallel via DASH protocol
- Each chunk is verified for integrity and malware
- Metadata is stored in BigTable
- Videos are temporarily stored in Google Cloud Storage

#### Video Processing

- Distributed processing system using Kubernetes
- Transcoding to multiple formats (MP4, WebM) and resolutions (144p to 8K)
- Automatic thumbnail generation
- Metadata extraction (duration, resolution, codecs)
- Content analysis via ML for classification and moderation

### 2. Video Storage

#### Video Storage

- Colossus: Google distributed file system
- Geographic replication for durability
- 64MB chunks for optimized streaming
- Metadata stored in Bigtable for fast access

#### Database

- Vitess (distributed MySQL) for relational data
- BigTable for frequently accessed metadata and data
- Spanner for globally consistent data

### 3. Content Distribution

#### CDN Infrastructure

- Google Global Cache (GGC) in thousands of locations
- Edge locations near end users
- QUIC protocol for optimized streaming
- Load balancing inteligente baseado em:
  - User location
  - Server load
  - Network capacity
  - Cache hit ratio

### 4. Recommendation System

#### ML Architecture

- Two-phase processing:
  - Candidate Generation: Selects thousands of potential videos
  - Ranking: Orders candidates using deep learning
- Features considered:
  - View history
  - Demographic data
  - Current trends
  - Video engagement

## Technical Decisions and Trade-offs

<Card title="1. Eventual vs Strong Consistency" accent="red">

YouTube opted for eventual consistency for counters (views, likes) prioritizing availability and performance. This allows asynchronous updates and better scalability, although it means the numbers may not be accurate in real time.

</Card>

<Card title="2. Asynchronous Processing" accent="red">

Video processing is done asynchronously, allowing uploads to be confirmed quickly. This improves the user experience but means the videos are not immediately available after upload.

</Card>

<Card title="3. Aggressive Caching" accent="red">

Popular videos are cached in multiple edge locations, reducing latency and bandwidth costs. The trade-off is the highest use of storage and complexity in cache invalidation.

</Card>

<Card title="4. Adaptive Quality" accent="red">

Adaptive bitrate streaming (ABR) adjusts the video quality based on the user's connection. This ensures a better experience but requires more storage for multiple versions of the same video.

</Card>

## Scaling Challenges

<Cards cols={2}>

<Card title="Storage" accent="red">

Management of exabytes of data with geographic replication and need for fast access. Solution: Distributed file system Colossus with intelligent retention policies.

</Card>

<Card title="Processing" accent="red">

Transcoding of thousands of hours of video per minute. Solution: Distributed pipeline with auto-scaling and job prioritization.

</Card>

<Card title="Bandwidth" accent="red">

Distribution of petabytes of data daily. Solution: Global CDN network and optimized QUIC protocol.

</Card>

<Card title="Consistency" accent="red">

Maintain global data consistency. Solution: Use Spanner for critical data and eventual consistency for counters.

</Card>

</Cards>

## Evolution Diagrams

### 2005: Monolithic Architecture

<Architecture
  layers={[
    { name: 'Users', accent: 'slate', nodes: ['Clients'] },
    { name: 'App', accent: 'red', nodes: ['Web Server'] },
    { name: 'Data', accent: 'slate', nodes: ['MySQL'] },
    { name: 'Files', accent: 'slate', nodes: ['Storage'] },
  ]}
  caption="A single web server backed by MySQL — enough to handle 2–3 videos per minute."
/>

### 2008: Distributed Architecture

<Architecture
  layers={[
    { name: 'Users', accent: 'slate', nodes: ['Clients'] },
    { name: 'Edge', accent: 'red', nodes: ['Load Balancer'] },
    { name: 'App', accent: 'red', nodes: ['Web Server'] },
    { name: 'Data', accent: 'slate', nodes: ['BigTable', 'GFS'] },
  ]}
  caption="After the Google acquisition, load balancing and Google's storage (BigTable, GFS) replace the single-box stack."
/>

### 2020+: Modern Architecture

<Architecture
  layers={[
    { name: 'Users', accent: 'slate', nodes: ['Clients'] },
    { name: 'CDN', accent: 'red', nodes: ['Global Cache'] },
    { name: 'Edge', accent: 'red', nodes: ['Load Balancer'] },
    { name: 'Services', accent: 'red', nodes: ['Upload', 'Transcode', 'ML', 'Analytics', 'Search'] },
  ]}
  caption="Today, a global CDN fronts a fleet of specialized microservices for upload, transcoding, recommendations, analytics, and search."
/>

## Architectural Journey: Context and Decisions

### 2005-2006: Early Days

#### Monolithic Architecture

YouTube started with a simple and monolithic architecture for several reasons:

- Fast development and iteration
- Smaller initial user base and easier management
- Simple deployment and maintenance
- Limited resources of the startup

> At the beginning, YouTube processed only 2-3 videos per minute. The monolithic architecture was enough to handle this load and allowed the team to focus on product-market fit.

### 2006-2008: Google Acquisition and Scale

#### Transition to Distributed Systems

The acquisition by Google brought unprecedented challenges and opportunities for scale:

- Migration to Google infrastructure (GFS and BigTable)
- Introduction of load balancing to distribute load
- Separation of concerns into distinct services
- Implementation of distributed caching

> The migration to BigTable was crucial because MySQL could no longer handle the volume of metadata. The system needed to manage billions of videos and their relationships.

### 2008-2015: Scaling Challenges

#### Evolution and Optimization

This period was marked by significant technical challenges and innovations:

- Development of the recommendation system based on ML
- Implementation of adaptive streaming for different qualities
- Creation of the global CDN network (Google Global Cache)
- Optimization of the streaming protocol (QUIC)

> The introduction of QUIC reduced streaming latency by 30% and significantly improved the experience on unstable mobile networks.

### 2015-Present: Modern Era

#### Modern Architecture and Innovations

The current architecture reflects years of evolution and learning:

- Specialized microservices for each functionality
- Advanced ML system for personalized recommendations
- Real-time analytics processing
- Support for modern formats (8K, HDR)
- Continuous optimization of bandwidth and storage

> The modern YouTube architecture processes more than 500 hours of video per minute, serving personalized content to more than 2 billion monthly users.

<Card title="Key Learnings" accent="red">

- Start simple and evolve based on real needs, not speculation
- Invest in distributed infrastructure when the monolith starts showing limitations
- Optimize for the most common use cases and accept trade-offs for edge cases
- User experience should guide architectural decisions, not just technical efficiency

</Card>

## Architecture Evolution

| Year | Milestone |
|------|-----------|
| 2005 | Initial release with monolithic architecture and MySQL |
| 2006 | Acquisition by Google and migration to Google infrastructure |
| 2008 | Introduction of BigTable and distributed processing system |
| 2012 | Migration to HTML5 and introduction of ML recommendation system |
| 2015 | Adoption of QUIC and improvements in adaptive streaming |
| 2020+ | Support for 8K, HDR and ML optimizations at scale |

## References

### Official Documentation and Articles

- [How YouTube Works - Official](https://www.youtube.com/howyoutubeworks)
- [YouTube Engineering Blog](https://blog.youtube/inside-youtube/)
- [Google Research Publications](https://research.google/pubs/)

### Technical Articles and Analyses

- [High Scalability - YouTube Architecture](https://highscalability.com/youtube-architecture/)
- [YouTube API Documentation](https://developers.google.com/youtube/v3/getting-started)
- [YouTube Creator Technical Resources](https://www.youtube.com/creators/how-things-work/)

### Conferences and Presentations

- [Google I/O - YouTube Infrastructure](https://www.youtube.com/watch?v=w5WVu624fY8)
- [QCon - YouTube Scalability](https://www.youtube.com/watch?v=5yDO-tmIoXY)

### Statistics and Metrics

- [YouTube Press Statistics](https://www.youtube.com/about/press/)
- [Statista - YouTube Growth Statistics](https://www.statista.com/statistics/259477/hours-of-video-uploaded-to-youtube-every-minute/)
$mdx$, $mdx$# YouTube System Design

Como o YouTube processa, armazena e distribui bilhões de vídeos globalmente

## Números Impressionantes

<Metrics cols={3}>

<Metric value="2.7B+" label="Usuários ativos mensais" accent="red" />

<Metric value="500h+" label="De vídeo enviados por minuto" accent="red" />

<Metric value="1B+" label="Horas assistidas por dia" accent="red" />

</Metrics>

## A História da Empresa

O YouTube foi fundado em fevereiro de 2005 por três ex-funcionários iniciais do PayPal — Chad Hurley, Steve Chen e Jawed Karim — e funcionou, em seus primeiros dias, em um escritório acima de uma pizzaria em San Mateo. Os fundadores estavam frustrados com o quanto era difícil compartilhar clipes de vídeo online e construíram a solução mais simples possível: faça upload uma vez, receba um link, assista no navegador. O primeiro upload de todos, o vídeo de 19 segundos "Me at the zoo" de Karim, foi ao ar em 23 de abril de 2005.

O crescimento foi explosivo. Em cerca de 18 meses — e antes de o YouTube ter ganhado um único dólar — o Google o adquiriu em novembro de 2006 por US$ 1,65 bilhão em ações. Essa aquisição deu ao YouTube acesso à infraestrutura do Google (GFS, BigTable e, mais tarde, Colossus e Spanner) exatamente quando sua stack caseira de MySQL cedia sob a carga.

O restante desta página traça como aquele monólito inicial evoluiu para uma plataforma em escala planetária que ingere centenas de horas de vídeo por minuto.

<Callout type="info" title="💡 Uma Aposta de US$ 1,65 bi numa Startup de Pizzaria">

O Google comprou o YouTube por US$ 1,65 bilhão apenas 18 meses após o lançamento — antes de o site gerar receita relevante. Hoje é uma das plataformas mais assistidas do planeta.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="red">

- Upload de vídeos em múltiplos formatos
- Processamento e transcodificação de vídeos
- Streaming de vídeo com múltiplas qualidades
- Sistema de recomendação personalizado
- Funcionalidades sociais (likes, comentários, inscrições)

</Card>

<Card title="Requisitos Não-Funcionais" accent="red">

- Alta disponibilidade (99.99%)
- Baixa latência global
- Consistência eventual
- Escalabilidade horizontal massiva
- Durabilidade dos dados

</Card>

## Arquitetura do Sistema

### 1. Upload e Processamento de Vídeos

#### Pipeline de Upload

- Uploads são divididos em chunks e enviados paralelamente via protocolo DASH
- Cada chunk é verificado para integridade e malware
- Metadata é armazenada no BigTable
- Vídeos são temporariamente armazenados no Google Cloud Storage

#### Processamento de Vídeo

- Sistema distribuído de processamento usando Kubernetes
- Transcodificação para múltiplos formatos (MP4, WebM) e resoluções (144p até 8K)
- Geração de thumbnails automática
- Extração de metadados (duração, resolução, codecs)
- Análise de conteúdo via ML para classificação e moderação

### 2. Sistema de Armazenamento

#### Armazenamento de Vídeos

- Colossus: Sistema de arquivos distribuído do Google
- Replicação geográfica para durabilidade
- Chunks de 64MB para otimização de streaming
- Metadata armazenada em Bigtable para acesso rápido

#### Banco de Dados

- Vitess (MySQL distribuído) para dados relacionais
- BigTable para metadados e dados de acesso frequente
- Spanner para dados globalmente consistentes

### 3. Distribuição de Conteúdo

#### Infraestrutura de CDN

- Google Global Cache (GGC) em milhares de localizações
- Edge locations próximas aos usuários finais
- Protocolo QUIC para streaming otimizado
- Load balancing inteligente baseado em:
  - Localização do usuário
  - Carga do servidor
  - Capacidade de rede
  - Cache hit ratio

### 4. Sistema de Recomendação

#### Arquitetura de ML

- Processamento em duas fases:
  - Candidate Generation: Seleciona milhares de vídeos potenciais
  - Ranking: Ordena os candidatos usando deep learning
- Features consideradas:
  - Histórico de visualização
  - Dados demográficos
  - Tendências atuais
  - Engajamento do vídeo

## Decisões Técnicas e Trade-offs

<Card title="1. Consistência Eventual vs Forte" accent="red">

YouTube optou por consistência eventual para contadores (views, likes) priorizando disponibilidade e performance. Isso permite atualizações assíncronas e melhor escalabilidade, embora signifique que os números podem não ser precisos em tempo real.

</Card>

<Card title="2. Processamento Assíncrono" accent="red">

O processamento de vídeos é feito de forma assíncrona, permitindo que uploads sejam confirmados rapidamente. Isso melhora a experiência do usuário mas significa que os vídeos não estão disponíveis imediatamente após o upload.

</Card>

<Card title="3. Caching Agressivo" accent="red">

Videos populares são cacheados em múltiplas edge locations, reduzindo latência e custos de bandwidth. O trade-off é o maior uso de storage e complexidade na invalidação de cache.

</Card>

<Card title="4. Qualidade Adaptativa" accent="red">

O streaming adaptativo (ABR) ajusta a qualidade do vídeo baseado na conexão do usuário. Isso garante melhor experiência mas requer mais storage para múltiplas versões do mesmo vídeo.

</Card>

## Desafios de Escala

<Cards cols={2}>

<Card title="Storage" accent="red">

Gerenciamento de exabytes de dados com replicação geográfica e necessidade de acesso rápido. Solução: Sistema de arquivos distribuído Colossus com políticas de retenção inteligentes.

</Card>

<Card title="Processamento" accent="red">

Transcodificação de milhares de horas de vídeo por minuto. Solução: Pipeline distribuído com auto-scaling e priorização de jobs.

</Card>

<Card title="Bandwidth" accent="red">

Distribuição de petabytes de dados diariamente. Solução: Rede global de CDNs e protocolo QUIC otimizado.

</Card>

<Card title="Consistência" accent="red">

Manter dados consistentes globalmente. Solução: Uso de Spanner para dados críticos e consistência eventual para contadores.

</Card>

</Cards>

## Diagramas de Evolução

### 2005: Arquitetura Monolítica

<Architecture
  layers={[
    { name: 'Usuários', accent: 'slate', nodes: ['Clientes'] },
    { name: 'App', accent: 'red', nodes: ['Web Server'] },
    { name: 'Dados', accent: 'slate', nodes: ['MySQL'] },
    { name: 'Arquivos', accent: 'slate', nodes: ['Storage'] },
  ]}
  caption="Um único servidor web apoiado por MySQL — suficiente para 2–3 vídeos por minuto."
/>

### 2008: Arquitetura Distribuída

<Architecture
  layers={[
    { name: 'Usuários', accent: 'slate', nodes: ['Clientes'] },
    { name: 'Borda', accent: 'red', nodes: ['Load Balancer'] },
    { name: 'App', accent: 'red', nodes: ['Web Server'] },
    { name: 'Dados', accent: 'slate', nodes: ['BigTable', 'GFS'] },
  ]}
  caption="Após a aquisição pelo Google, o load balancing e o armazenamento do Google (BigTable, GFS) substituem a stack de máquina única."
/>

### 2020+: Arquitetura Moderna

<Architecture
  layers={[
    { name: 'Usuários', accent: 'slate', nodes: ['Clientes'] },
    { name: 'CDN', accent: 'red', nodes: ['Global Cache'] },
    { name: 'Borda', accent: 'red', nodes: ['Load Balancer'] },
    { name: 'Serviços', accent: 'red', nodes: ['Upload', 'Transcode', 'ML', 'Analytics', 'Busca'] },
  ]}
  caption="Hoje, uma CDN global está à frente de uma frota de microsserviços especializados em upload, transcodificação, recomendações, analytics e busca."
/>

## Jornada Arquitetural: Contexto e Decisões

### 2005-2006: Os Primeiros Dias

#### Arquitetura Monolítica

O YouTube começou com uma arquitetura simples e monolítica por várias razões:

- Velocidade de desenvolvimento e iteração rápida
- Base de usuários inicial menor e mais gerenciável
- Simplicidade de deploy e manutenção
- Recursos limitados da startup

> No início, o YouTube processava apenas 2-3 vídeos por minuto. A arquitetura monolítica era suficiente para lidar com essa carga e permitia que a equipe se concentrasse em product-market fit.

### 2006-2008: Aquisição Google e Escala

#### Transição para Sistemas Distribuídos

A aquisição pelo Google trouxe desafios e oportunidades de escala sem precedentes:

- Migração para infraestrutura Google (GFS e BigTable)
- Introdução de load balancing para distribuir carga
- Separação de concerns em serviços distintos
- Implementação de caching distribuído

> A mudança para BigTable foi crucial pois o MySQL não conseguia mais lidar com o volume de metadados. O sistema precisava gerenciar bilhões de vídeos e suas relações.

### 2008-2015: Desafios de Escala

#### Evolução e Otimização

Este período foi marcado por grandes desafios técnicos e inovações:

- Desenvolvimento do sistema de recomendação baseado em ML
- Implementação de streaming adaptativo para diferentes qualidades
- Criação da rede global de CDNs (Google Global Cache)
- Otimização do protocolo de streaming (QUIC)

> A introdução do QUIC reduziu a latência de streaming em 30% e melhorou significativamente a experiência em redes móveis instáveis.

### 2015-Presente: Era Moderna

#### Arquitetura Moderna e Inovações

A arquitetura atual reflete anos de evolução e aprendizado:

- Microserviços especializados para cada funcionalidade
- Sistema de ML avançado para recomendações personalizadas
- Processamento em tempo real de analytics
- Suporte a formatos modernos (8K, HDR)
- Otimização contínua de bandwidth e storage

> A arquitetura moderna do YouTube processa mais de 500 horas de vídeo por minuto, servindo conteúdo personalizado para mais de 2 bilhões de usuários mensais.

<Card title="Principais Aprendizados" accent="red">

- Comece simples e evolua baseado em necessidades reais, não em especulações
- Invista em infraestrutura distribuída quando o monolito começar a mostrar limitações
- Otimize para os casos de uso mais comuns e aceite trade-offs para casos edge
- A experiência do usuário deve guiar decisões arquiteturais, não apenas eficiência técnica

</Card>

## Evolução da Arquitetura

| Ano | Marco |
|------|-----------|
| 2005 | Lançamento inicial com arquitetura monolítica e MySQL |
| 2006 | Aquisição pelo Google e migração para infraestrutura Google |
| 2008 | Introdução do BigTable e sistema de processamento distribuído |
| 2012 | Migração para HTML5 e introdução do sistema de recomendação ML |
| 2015 | Adoção do QUIC e melhorias no streaming adaptativo |
| 2020+ | Suporte a 8K, HDR e otimizações de ML em larga escala |

## Referências

### Documentação e Artigos Oficiais

- [How YouTube Works - Official](https://www.youtube.com/howyoutubeworks)
- [YouTube Engineering Blog](https://blog.youtube/inside-youtube/)
- [Google Research Publications](https://research.google/pubs/)

### Artigos Técnicos e Análises

- [High Scalability - YouTube Architecture](https://highscalability.com/youtube-architecture/)
- [YouTube API Documentation](https://developers.google.com/youtube/v3/getting-started)
- [YouTube Creator Technical Resources](https://www.youtube.com/creators/how-things-work/)

### Conferências e Apresentações

- [Google I/O - YouTube Infrastructure](https://www.youtube.com/watch?v=w5WVu624fY8)
- [QCon - YouTube Scalability](https://www.youtube.com/watch?v=5yDO-tmIoXY)

### Estatísticas e Métricas

- [YouTube Press Statistics](https://www.youtube.com/about/press/)
- [Statista - YouTube Growth Statistics](https://www.statista.com/statistics/259477/hours-of-video-uploaded-to-youtube-every-minute/)
$mdx$),
  ('real-cases/spotify', '/casos-reais/spotify', 'cases', true, 89, NULL, true, 'Spotify System Design', 'Spotify System Design', $mdx$# Spotify System Design

How Spotify manages, processes and distributes millions of songs in real-time globally

## Impressive Numbers

<Metrics cols={3}>

<Metric value="450M+" label="Monthly active users" accent="green" />

<Metric value="100B+" label="Streams per day" accent="green" />

<Metric value="80M+" label="Songs in catalog" accent="green" />

</Metrics>

## Origin Story

Spotify was founded in 2006 in Stockholm by Daniel Ek and Martin Lorentzon, at the height of the music-piracy era. Sweden was home to The Pirate Bay, and the industry was convinced its enemy was free downloads. Ek's contrarian insight was that piracy is fundamentally a *user-experience* problem: you can't beat free on price, so you beat it on convenience. The goal was radical — make legal streaming feel faster than finding and downloading a pirated file.

To deliver that instant-play feeling on 2008-era internet connections, the early product leaned on peer-to-peer technology so a track began in under 200 milliseconds. After launching invite-only across Europe in 2008, Spotify spent years negotiating with record labels before finally reaching the United States in 2011 — the licensing deals, not the technology, were the hard part.

Spotify went public via a direct listing on the NYSE in 2018, and along the way it became as influential in engineering culture as in music. Its "squads and tribes" org model, its open-source developer portal Backstage, and its big-data tooling (Luigi) shaped how many companies build software today.

<Callout type="info" title="💡 You Can't Beat Free on Price">

Spotify's founding bet was that piracy was a convenience problem, not a pricing one. By making legal streaming start in milliseconds, it offered an experience that "free" downloads couldn't match.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="green">

- Real-time audio streaming
- Cross-device synchronization
- Personalized recommendation system
- Playlist and library management
- Social features (follow, share)

</Card>

<Card title="Non-Functional Requirements" accent="green">

- Low latency (less than 100ms for song start)
- High availability (99.99%)
- Eventual consistency for social data
- Horizontal scalability
- Fault tolerance

</Card>

## System Architecture

### High-Level Architecture

Overview of Spotify's distributed architecture, showing the main components and their interactions.

<Architecture
  layers={[
    { name: 'Clients', accent: 'slate', nodes: ['Web', 'Mobile', 'Desktop'] },
    { name: 'Edge', accent: 'green', nodes: ['CDN & Edge Cache'] },
    { name: 'Balancer', accent: 'green', nodes: ['Load Balancer'] },
    { name: 'Services', accent: 'green', nodes: ['Streaming', 'Recommendation', 'Metadata'] },
    { name: 'Storage', accent: 'slate', nodes: ['S3 · Audio', 'Cassandra', 'Redis'] },
  ]}
  caption="Popular audio is served from edge caches close to listeners; the rest flows through the load balancer to backend services and their stores."
/>

### Streaming Architecture

Audio streaming flow, demonstrating how content is delivered to users through edge caching and adaptive transcoding.

<Flow accent="green" steps={['Spotify client', 'Edge cache', 'Streaming service', 'Object storage (S3)']} caption="On a cache hit the track starts from the edge; on a miss it is fetched from S3, transcoded, and cached for the next listener." />

### 1. Streaming System

#### Streaming Pipeline

- HLS (HTTP Live Streaming) protocol for audio delivery
- Audio chunks of 2-10 seconds
- Multiple audio qualities (16-320kbps)
- Adaptive buffering based on connection

The player adapts between quality tiers based on the listener's connection — trading bandwidth for fidelity:

<BarChart
  data={[
    { label: 'Low', value: 24, display: '24 kbps', accent: 'slate' },
    { label: 'Normal', value: 96, display: '96 kbps', accent: 'green' },
    { label: 'High', value: 160, display: '160 kbps', accent: 'green' },
    { label: 'Very High (Premium)', value: 320, display: '320 kbps', accent: 'brand' },
  ]}
  caption="Ogg Vorbis audio quality tiers. Higher bitrates mean better fidelity but more bandwidth and storage."
/>

#### Audio Processing

- Transcoding to multiple formats (AAC, Ogg Vorbis)
- Volume normalization (ReplayGain)
- Audio analysis for musical features
- Waveform and preview generation
- DRM and content protection

### 2. Storage System

#### Audio Storage

- Amazon S3 for music storage
- CDN for global caching of popular content
- Own distributed file system
- Metadata in Cassandra for high availability

#### Database

- PostgreSQL for transactional data
- Cassandra for distributed data
- Redis for caching and sessions
- Kafka for event streaming

### 3. Recommendation System

#### Algorithms and Features

- Large-scale Collaborative Filtering
- Audio analysis for musical similarity
- Natural Language Processing for lyrics analysis
- Features considered:
  - Playback history
  - Followed playlists
  - Preferred genres
  - Context (time of day, device)

### 4. Real-Time Features

#### Real-Time Infrastructure

- WebSocket for cross-device synchronization
- Pub/Sub with Kafka for real-time events
- Distributed playback state
- Real-time features:
  - Remote control between devices
  - Collaborative sessions
  - Friends activity status
  - Instant notifications

## Technical Decisions and Trade-offs

<Card title="1. Buffering vs Latency" accent="green">

Spotify uses adaptive buffering that balances initial latency with streaming quality. More buffer means fewer interruptions but higher latency at the start of playback.

</Card>

<Card title="2. Caching vs Storage" accent="green">

Popular songs are cached at edge locations, reducing latency but increasing storage costs. The system uses predictive analysis to determine what to cache.

</Card>

<Card title="3. Consistency vs Availability" accent="green">

Using eventual consistency for playlists and library allows better availability, but may result in temporary inconsistencies between devices.

</Card>

<Card title="4. Quality vs Bandwidth" accent="green">

Multiple audio qualities allow adaptation to user connection, but require more storage and complexity in transcoding.

</Card>

## Scaling Challenges

<Cards cols={2}>

<Card title="Global Latency" accent="green">

Low-latency audio delivery globally. Solution: CDN network and strategic edge caching.

</Card>

<Card title="Distributed Data" accent="green">

Data synchronization between regions and devices. Solution: Cassandra for distributed data and Kafka for events.

</Card>

<Card title="Machine Learning" accent="green">

Real-time ML processing for millions of users. Solution: Distributed ML pipeline with pre-computation.

</Card>

<Card title="Microservices" accent="green">

Managing hundreds of microservices. Solution: Backstage for developer portal and service management.

</Card>

</Cards>

## Architecture Evolution

<Timeline
  items={[
    { year: '2006', title: 'Initial architecture', body: 'A PHP monolith with PostgreSQL, focused on the Swedish market.', accent: 'green' },
    { year: '2008–2009', title: 'First scaling', body: 'Migration to Python/C++ and the introduction of distributed cache.', accent: 'green' },
    { year: '2011–2012', title: 'Microservices era', body: 'Adoption of microservices and migration to AWS.', accent: 'green' },
    { year: '2014–2015', title: 'Event-driven architecture', body: 'Kafka implementation enables asynchronous processing.', accent: 'green' },
    { year: '2016–Present', title: 'Cloud native & ML', body: 'Kubernetes, large-scale ML, and the Backstage developer portal.', accent: 'green' },
  ]}
/>

## References

### Official Documentation and Articles

- [Spotify Engineering Blog](https://engineering.atspotify.com/)
- [Spotify Design](https://spotify.design/)
- [Spotify for Developers](https://developer.spotify.com/)

### Technical Articles and Analysis

- [Backend Infrastructure at Spotify](https://engineering.atspotify.com/2013/03/backend-infrastructure-at-spotify/)
- [Event Delivery System](https://engineering.atspotify.com/2015/01/spotifys-event-delivery-the-road-to-the-cloud-part-i/)
- [Big Data Ecosystem](https://engineering.atspotify.com/2016/02/spotifys-big-data-ecosystem/)

### Conferences and Presentations

- [QCon - Spotify's Audio Delivery at Scale](https://www.youtube.com/watch?v=Xr2soUVHxG8)
- [InfoQ - Scaling Spotify](https://www.youtube.com/watch?v=Z2JzVxP4H4w)

### Open Source Tools

- [Backstage - Developer Portal](https://backstage.io/)
- [Luigi - Workflow Management](https://github.com/spotify/luigi)
$mdx$, $mdx$# Spotify System Design

Como o Spotify gerencia, processa e distribui milhões de músicas em tempo real globalmente

## Números Impressionantes

<Metrics cols={3}>

<Metric value="450M+" label="Usuários ativos mensais" accent="green" />

<Metric value="100B+" label="Streams por dia" accent="green" />

<Metric value="80M+" label="Músicas no catálogo" accent="green" />

</Metrics>

## A História da Empresa

O Spotify foi fundado em 2006 em Estocolmo por Daniel Ek e Martin Lorentzon, no auge da era da pirataria musical. A Suécia era a casa do The Pirate Bay, e a indústria estava convencida de que seu inimigo eram os downloads gratuitos. O insight contraintuitivo de Ek era que a pirataria é, no fundo, um problema de *experiência do usuário*: você não vence o "grátis" no preço, então o vence na conveniência. A meta era radical — fazer o streaming legal parecer mais rápido do que encontrar e baixar um arquivo pirata.

Para entregar essa sensação de reprodução instantânea nas conexões de internet de 2008, o produto inicial se apoiava em tecnologia peer-to-peer para que uma faixa começasse em menos de 200 milissegundos. Depois de lançar por convite na Europa em 2008, o Spotify passou anos negociando com as gravadoras antes de finalmente chegar aos Estados Unidos em 2011 — os acordos de licenciamento, não a tecnologia, eram a parte difícil.

O Spotify abriu capital via listagem direta na NYSE em 2018 e, no caminho, tornou-se tão influente na cultura de engenharia quanto na música. Seu modelo organizacional de "squads e tribes", seu portal de desenvolvedores open source Backstage e suas ferramentas de big data (Luigi) moldaram como muitas empresas constroem software hoje.

<Callout type="info" title="💡 Não Dá Para Vencer o Grátis no Preço">

A aposta de fundação do Spotify era que a pirataria era um problema de conveniência, não de preço. Ao fazer o streaming legal começar em milissegundos, ele ofereceu uma experiência que os downloads "gratuitos" não conseguiam igualar.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="green">

- Streaming de áudio em tempo real
- Sincronização entre dispositivos
- Sistema de recomendação personalizado
- Gerenciamento de playlists e biblioteca
- Funcionalidades sociais (seguir, compartilhar)

</Card>

<Card title="Requisitos Não-Funcionais" accent="green">

- Baixa latência (menor que 100ms para início da música)
- Alta disponibilidade (99.99%)
- Consistência eventual para dados sociais
- Escalabilidade horizontal
- Tolerância a falhas

</Card>

## Arquitetura do Sistema

### Arquitetura de Alto Nível

Visão geral da arquitetura distribuída do Spotify, mostrando os principais componentes e suas interações.

<Architecture
  layers={[
    { name: 'Clientes', accent: 'slate', nodes: ['Web', 'Mobile', 'Desktop'] },
    { name: 'Borda', accent: 'green', nodes: ['CDN & Edge Cache'] },
    { name: 'Balancer', accent: 'green', nodes: ['Load Balancer'] },
    { name: 'Serviços', accent: 'green', nodes: ['Streaming', 'Recomendação', 'Metadados'] },
    { name: 'Armazenamento', accent: 'slate', nodes: ['S3 · Áudio', 'Cassandra', 'Redis'] },
  ]}
  caption="O áudio popular é servido por edge caches próximos aos ouvintes; o restante passa pelo load balancer até os serviços de backend e seus armazenamentos."
/>

### Arquitetura de Streaming

Fluxo de streaming de áudio, demonstrando como o conteúdo é entregue aos usuários através de edge caching e transcodificação adaptativa.

<Flow accent="green" steps={['Cliente Spotify', 'Edge cache', 'Serviço de streaming', 'Object storage (S3)']} caption="No cache hit a faixa começa direto da borda; no miss ela é buscada no S3, transcodificada e cacheada para o próximo ouvinte." />

### 1. Sistema de Streaming

#### Pipeline de Streaming

- Protocolo HLS (HTTP Live Streaming) para entrega de áudio
- Chunks de áudio de 2-10 segundos
- Múltiplas qualidades de áudio (16-320kbps)
- Buffering adaptativo baseado na conexão

O player adapta entre os níveis de qualidade conforme a conexão do ouvinte — trocando banda por fidelidade:

<BarChart
  data={[
    { label: 'Baixa', value: 24, display: '24 kbps', accent: 'slate' },
    { label: 'Normal', value: 96, display: '96 kbps', accent: 'green' },
    { label: 'Alta', value: 160, display: '160 kbps', accent: 'green' },
    { label: 'Muito alta (Premium)', value: 320, display: '320 kbps', accent: 'brand' },
  ]}
  caption="Níveis de qualidade do áudio Ogg Vorbis. Bitrates maiores significam mais fidelidade, mas também mais banda e armazenamento."
/>

#### Processamento de Áudio

- Transcodificação para múltiplos formatos (AAC, Ogg Vorbis)
- Normalização de volume (ReplayGain)
- Análise de áudio para features musicais
- Geração de waveforms e previews
- DRM e proteção de conteúdo

### 2. Sistema de Armazenamento

#### Armazenamento de Áudio

- Amazon S3 para armazenamento de músicas
- CDN para cache global de conteúdo popular
- Sistema de arquivos distribuído próprio
- Metadata em Cassandra para alta disponibilidade

#### Banco de Dados

- PostgreSQL para dados transacionais
- Cassandra para dados distribuídos
- Redis para caching e sessões
- Kafka para streaming de eventos

### 3. Sistema de Recomendação

#### Algoritmos e Features

- Collaborative Filtering em larga escala
- Análise de áudio para similaridade musical
- Natural Language Processing para análise de letras
- Features consideradas:
  - Histórico de reprodução
  - Playlists seguidas
  - Gêneros preferidos
  - Contexto (hora do dia, dispositivo)

### 4. Funcionalidades em Tempo Real

#### Infraestrutura Real-time

- WebSocket para sincronização entre dispositivos
- Pub/Sub com Kafka para eventos em tempo real
- Estado de reprodução distribuído
- Features em tempo real:
  - Controle remoto entre dispositivos
  - Sessões colaborativas
  - Status de atividade de amigos
  - Notificações instantâneas

## Decisões Técnicas e Trade-offs

<Card title="1. Buffering vs Latência" accent="green">

Spotify utiliza buffering adaptativo que equilibra a latência inicial com a qualidade do streaming. Mais buffer significa menos interrupções mas maior latência no início da reprodução.

</Card>

<Card title="2. Caching vs Storage" accent="green">

Músicas populares são cacheadas em edge locations, reduzindo latência mas aumentando custos de storage. O sistema usa análise preditiva para determinar o que cachear.

</Card>

<Card title="3. Consistência vs Disponibilidade" accent="green">

Uso de consistência eventual para playlists e biblioteca permite melhor disponibilidade, mas pode resultar em inconsistências temporárias entre dispositivos.

</Card>

<Card title="4. Qualidade vs Bandwidth" accent="green">

Múltiplas qualidades de áudio permitem adaptação à conexão do usuário, mas requerem mais storage e complexidade na transcodificação.

</Card>

## Desafios de Escala

<Cards cols={2}>

<Card title="Latência Global" accent="green">

Entrega de áudio com baixa latência globalmente. Solução: Rede de CDNs e edge caching estratégico.

</Card>

<Card title="Dados Distribuídos" accent="green">

Sincronização de dados entre regiões e dispositivos. Solução: Cassandra para dados distribuídos e Kafka para eventos.

</Card>

<Card title="Machine Learning" accent="green">

Processamento de ML em tempo real para milhões de usuários. Solução: Pipeline distribuído de ML com pré-computação.

</Card>

<Card title="Microserviços" accent="green">

Gerenciamento de centenas de microserviços. Solução: Backstage para developer portal e gestão de serviços.

</Card>

</Cards>

## Evolução da Arquitetura

<Timeline
  items={[
    { year: '2006', title: 'Arquitetura inicial', body: 'Um monólito PHP com PostgreSQL, focado no mercado sueco.', accent: 'green' },
    { year: '2008–2009', title: 'Primeira escala', body: 'Migração para Python/C++ e introdução de cache distribuído.', accent: 'green' },
    { year: '2011–2012', title: 'Era dos microsserviços', body: 'Adoção de microsserviços e migração para a AWS.', accent: 'green' },
    { year: '2014–2015', title: 'Arquitetura event-driven', body: 'A implementação do Kafka habilita o processamento assíncrono.', accent: 'green' },
    { year: '2016–Presente', title: 'Cloud native & ML', body: 'Kubernetes, ML em larga escala e o portal de desenvolvedores Backstage.', accent: 'green' },
  ]}
/>

## Referências

### Documentação e Artigos Oficiais

- [Spotify Engineering Blog](https://engineering.atspotify.com/)
- [Spotify Design](https://spotify.design/)
- [Spotify for Developers](https://developer.spotify.com/)

### Artigos Técnicos e Análises

- [Backend Infrastructure at Spotify](https://engineering.atspotify.com/2013/03/backend-infrastructure-at-spotify/)
- [Event Delivery System](https://engineering.atspotify.com/2015/01/spotifys-event-delivery-the-road-to-the-cloud-part-i/)
- [Big Data Ecosystem](https://engineering.atspotify.com/2016/02/spotifys-big-data-ecosystem/)

### Conferências e Apresentações

- [QCon - Spotify's Audio Delivery at Scale](https://www.youtube.com/watch?v=Xr2soUVHxG8)
- [InfoQ - Scaling Spotify](https://www.youtube.com/watch?v=Z2JzVxP4H4w)

### Ferramentas Open Source

- [Backstage - Developer Portal](https://backstage.io/)
- [Luigi - Workflow Management](https://github.com/spotify/luigi)
$mdx$),
  ('real-cases/whatsapp', '/casos-reais/whatsapp', 'cases', true, 90, NULL, true, 'WhatsApp System Design', 'WhatsApp System Design', $mdx$# WhatsApp System Design

How WhatsApp manages billions of real-time messages with end-to-end encryption

## Impressive Numbers

<Metrics cols={3}>

<Metric value="2B+" label="Active users" accent="green" />

<Metric value="100B+" label="Messages per day" accent="green" />

<Metric value="1B+" label="Active groups" accent="green" />

</Metrics>

## Origin Story

WhatsApp was founded in 2009 by Jan Koum and Brian Acton, two former Yahoo engineers. Koum's story is improbable: an immigrant from Ukraine who grew up partly on food stamps in California, he taught himself networking from used manuals. Famously, both founders had been *rejected* for jobs at Facebook before starting the company that Facebook would later pay a fortune to own.

The first version of the app was nearly a failure — it was meant to show status messages next to contacts, not send messages at all. The turning point came when Apple introduced push notifications: people started pinging each other through status updates, and Koum realized he had accidentally built a messenger. By routing messages over data instead of paid SMS, WhatsApp undercut the carriers and spread virally across borders.

In 2014, Facebook acquired WhatsApp for roughly $19 billion — one of the largest tech acquisitions ever — while the app was still run by a famously tiny team. End-to-end encryption using the Signal protocol arrived in 2016. The engineering legend endures: a few dozen engineers, the Erlang language, and FreeBSD servers carrying hundreds of millions of users.

<Callout type="info" title="💡 Rejected by Facebook, Bought by Facebook">

Both founders were turned down for jobs at Facebook. Five years later, Facebook bought their company for about $19 billion — and a handful of engineers were serving roughly 900 million users on Erlang.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="green">

- Real-time messages (text, audio, video)
- End-to-end encryption
- Groups and broadcasts
- Voice and video calls
- Status and stories
- Multi-device synchronization

</Card>

<Card title="Non-Functional Requirements" accent="green">

- Ultra low latency (less than 100ms)
- High availability (99.999%)
- Eventual consistency
- Security and privacy
- Massive scalability
- Delivery reliability

</Card>

## System Architecture

### High-Level Architecture

Overview of WhatsApp's distributed architecture, showing the main components and their interactions.

<Architecture
  layers={[
    { name: 'Clients', accent: 'slate', nodes: ['Mobile', 'Web', 'Desktop'] },
    { name: 'Edge', accent: 'green', nodes: ['Load Balancer'] },
    { name: 'Servers', accent: 'green', nodes: ['Chat', 'Presence', 'Media', 'Auth', 'Key Mgmt'] },
    { name: 'Storage', accent: 'slate', nodes: ['Cassandra · Messages', 'Redis · Cache', 'S3 · Media'] },
  ]}
  caption="Persistent client connections terminate at the load balancer and fan out to Erlang-based servers; messages and media land in Cassandra, Redis, and S3."
/>

### Message Flow

Encrypted message flow, demonstrating the process from sending to delivery.

<Flow accent="green" steps={['Sender', 'Encrypt (E2EE)', 'Chat server', 'Message queue', 'Deliver to receiver']} caption="Messages are encrypted on the sender's device, queued server-side only until delivery, then removed." />

### 1. Messaging System

#### Message Processing

- Modified MQTT protocol for messages
- Signal encryption for E2EE
- Message compression
- Delivery confirmation system

#### Message Types

- Text and emojis
- Media (images, audio, video)
- Documents and files
- Location and contacts
- Temporary messages

### 2. Storage System

#### Message Storage

- Cassandra for encrypted messages
- Redis for cache and sessions
- S3 for media and backups
- Selective message retention

#### Database

- MySQL for user data
- RocksDB for local storage
- Kafka for events and logs
- ElasticSearch for search

### 3. Real-Time System

#### Real-Time Infrastructure

- WebSocket for persistent connections
- MQTT for real-time messages
- Distributed presence system
- Real-time features:
  - Online/offline status
  - Typing...
  - Read confirmation
  - Multi-device synchronization

## Technical Decisions and Trade-offs

<Card title="1. Privacy vs Functionality" accent="green">

E2EE encryption ensures privacy but limits features like global search and cloud backup. WhatsApp prioritizes privacy over advanced functionalities.

</Card>

<Card title="2. Latency vs Consistency" accent="green">

Using eventual consistency allows fast message delivery, but may result in out-of-order messages in rare cases.

</Card>

<Card title="3. Storage vs Retention" accent="green">

Messages are stored temporarily on servers until delivery, reducing storage costs but limiting offline functionalities.

</Card>

<Card title="4. Simplicity vs Features" accent="green">

Interface and features kept simple to ensure performance and usability, even if this means fewer features than competitors.

</Card>

## Scaling Challenges

<Cards cols={2}>

<Card title="Mass Delivery" accent="green">

Message delivery to billions of users. Solution: Distributed queue system and route optimization.

</Card>

<Card title="Connection Management" accent="green">

Maintaining millions of simultaneous connections. Solution: Optimized MQTT and intelligent load balancing.

</Card>

<Card title="Synchronization" accent="green">

Synchronization between multiple devices. Solution: Versioning system and state merging.

</Card>

<Card title="Large Groups" accent="green">

Managing groups with thousands of members. Solution: Broadcast optimization and message caching.

</Card>

</Cards>

## Architecture Evolution

<Timeline
  items={[
    { year: '2009', title: 'Initial version', body: 'A simple iOS app focused on status messages.', accent: 'green' },
    { year: '2011–2012', title: 'Basic messaging', body: 'Chat implemented over a modified XMPP protocol.', accent: 'green' },
    { year: '2014', title: 'Facebook acquisition', body: 'Massive scale and infrastructure migration follow the ~$19B deal.', accent: 'green' },
    { year: '2016', title: 'End-to-end encryption', body: 'The Signal protocol is rolled out to all chats.', accent: 'green' },
    { year: '2019–Present', title: 'Multi-device', body: 'Native multi-device support with a new sync architecture.', accent: 'green' },
  ]}
/>

## References

### Official Documentation and Articles

- [WhatsApp Engineering Blog](https://engineering.fb.com/category/whatsapp/)
- [WhatsApp Security](https://www.whatsapp.com/security/)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/)

### Technical Articles and Analysis

- [WhatsApp Encryption Overview](https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf)
- [Scaling WhatsApp Infrastructure](https://engineering.fb.com/2014/10/09/production-engineering/scaling-mercurial-at-facebook/)
- [Signal Protocol Specification](https://signal.org/docs/specifications/doubleratchet/)

### Conferences and Presentations

- [F8 - WhatsApp Business Platform](https://www.youtube.com/watch?v=vvhC64hQZMk)
- [Real-time Messaging Architecture](https://www.youtube.com/watch?v=5DgVkKHxKQk)

### Security and Privacy

- [WhatsApp Privacy Policy](https://www.whatsapp.com/privacy)
- [End-to-End Encryption Technical Paper](https://scontent.whatsapp.net/v/t39.8562-34/316546300_547692750646518_7299107161331633308_n.pdf?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=t_1sHkqHzr4AX9QJTP-&_nc_ht=scontent.whatsapp.net&oh=01_AdTz6KJ_MWwjY_lQh6MH1_BPmXiC_1kdpvnNvCXcaHsUxw&oe=65C2F7C1)
$mdx$, $mdx$# WhatsApp System Design

Como o WhatsApp gerencia bilhões de mensagens em tempo real com criptografia ponta a ponta

## Números Impressionantes

<Metrics cols={3}>

<Metric value="2B+" label="Usuários ativos" accent="green" />

<Metric value="100B+" label="Mensagens por dia" accent="green" />

<Metric value="1B+" label="Grupos ativos" accent="green" />

</Metrics>

## A História da Empresa

O WhatsApp foi fundado em 2009 por Jan Koum e Brian Acton, dois ex-engenheiros do Yahoo. A trajetória de Koum é improvável: um imigrante da Ucrânia que cresceu em parte com vale-alimentação na Califórnia, ele aprendeu redes sozinho com manuais usados. Curiosamente, ambos os fundadores haviam sido *rejeitados* em vagas no Facebook antes de criar a empresa que o Facebook mais tarde pagaria uma fortuna para ter.

A primeira versão do app quase foi um fracasso — ela servia para mostrar mensagens de status ao lado dos contatos, não para enviar mensagens. A virada veio quando a Apple introduziu as notificações push: as pessoas começaram a se cutucar por meio das atualizações de status, e Koum percebeu que havia acidentalmente construído um mensageiro. Ao trafegar mensagens por dados em vez de SMS pago, o WhatsApp passou por cima das operadoras e se espalhou viralmente entre fronteiras.

Em 2014, o Facebook adquiriu o WhatsApp por cerca de US$ 19 bilhões — uma das maiores aquisições de tecnologia da história — enquanto o app ainda era tocado por uma equipe famosamente pequena. A criptografia de ponta a ponta usando o protocolo Signal chegou em 2016. A lenda de engenharia permanece: algumas dezenas de engenheiros, a linguagem Erlang e servidores FreeBSD sustentando centenas de milhões de usuários.

<Callout type="info" title="💡 Rejeitados pelo Facebook, Comprados pelo Facebook">

Ambos os fundadores foram recusados em vagas no Facebook. Cinco anos depois, o Facebook comprou a empresa deles por cerca de US$ 19 bilhões — e um punhado de engenheiros atendia cerca de 900 milhões de usuários com Erlang.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="green">

- Mensagens em tempo real (texto, áudio, vídeo)
- Criptografia ponta a ponta
- Grupos e broadcasts
- Chamadas de voz e vídeo
- Status e stories
- Sincronização multi-dispositivo

</Card>

<Card title="Requisitos Não-Funcionais" accent="green">

- Latência ultra baixa (menor que 100ms)
- Alta disponibilidade (99.999%)
- Consistência eventual
- Segurança e privacidade
- Escalabilidade massiva
- Confiabilidade na entrega

</Card>

## Arquitetura do Sistema

### Arquitetura de Alto Nível

Visão geral da arquitetura distribuída do WhatsApp, mostrando os principais componentes e suas interações.

<Architecture
  layers={[
    { name: 'Clientes', accent: 'slate', nodes: ['Mobile', 'Web', 'Desktop'] },
    { name: 'Borda', accent: 'green', nodes: ['Load Balancer'] },
    { name: 'Servidores', accent: 'green', nodes: ['Chat', 'Presença', 'Mídia', 'Auth', 'Chaves'] },
    { name: 'Armazenamento', accent: 'slate', nodes: ['Cassandra · Mensagens', 'Redis · Cache', 'S3 · Mídia'] },
  ]}
  caption="As conexões persistentes dos clientes terminam no load balancer e se distribuem para servidores em Erlang; mensagens e mídia vão para Cassandra, Redis e S3."
/>

### Fluxo de Mensagens

Fluxo de mensagens criptografadas, demonstrando o processo desde o envio até a entrega.

<Flow accent="green" steps={['Remetente', 'Criptografia (E2EE)', 'Servidor de chat', 'Fila de mensagens', 'Entrega ao destinatário']} caption="As mensagens são criptografadas no dispositivo do remetente, enfileiradas no servidor apenas até a entrega e então removidas." />

### 1. Sistema de Mensagens

#### Processamento de Mensagens

- Protocolo MQTT modificado para mensagens
- Criptografia Signal para E2EE
- Compressão de mensagens
- Sistema de confirmação de entrega

#### Tipos de Mensagens

- Texto e emojis
- Mídia (imagens, áudio, vídeo)
- Documentos e arquivos
- Localização e contatos
- Mensagens temporárias

### 2. Sistema de Armazenamento

#### Armazenamento de Mensagens

- Cassandra para mensagens criptografadas
- Redis para cache e sessões
- S3 para mídia e backups
- Retenção seletiva de mensagens

#### Banco de Dados

- MySQL para dados de usuário
- RocksDB para armazenamento local
- Kafka para eventos e logs
- ElasticSearch para busca

### 3. Sistema de Tempo Real

#### Infraestrutura Real-time

- WebSocket para conexões persistentes
- MQTT para mensagens em tempo real
- Sistema de presença distribuído
- Features em tempo real:
  - Status online/offline
  - Digitando...
  - Confirmação de leitura
  - Sincronização multi-dispositivo

## Decisões Técnicas e Trade-offs

<Card title="1. Privacidade vs Funcionalidade" accent="green">

Criptografia E2EE garante privacidade mas limita features como busca global e backup em nuvem. WhatsApp prioriza privacidade sobre funcionalidades avançadas.

</Card>

<Card title="2. Latência vs Consistência" accent="green">

Uso de consistência eventual permite entrega rápida de mensagens, mas pode resultar em mensagens fora de ordem em casos raros.

</Card>

<Card title="3. Storage vs Retenção" accent="green">

Mensagens são armazenadas temporariamente nos servidores até a entrega, reduzindo custos de storage mas limitando funcionalidades offline.

</Card>

<Card title="4. Simplicidade vs Recursos" accent="green">

Interface e funcionalidades mantidas simples para garantir performance e usabilidade, mesmo que isso signifique menos recursos que concorrentes.

</Card>

## Desafios de Escala

<Cards cols={2}>

<Card title="Entrega em Massa" accent="green">

Entrega de mensagens para bilhões de usuários. Solução: Sistema de filas distribuído e otimização de rotas.

</Card>

<Card title="Gerenciamento de Conexões" accent="green">

Manutenção de milhões de conexões simultâneas. Solução: MQTT otimizado e load balancing inteligente.

</Card>

<Card title="Sincronização" accent="green">

Sincronização entre múltiplos dispositivos. Solução: Sistema de versionamento e merge de estados.

</Card>

<Card title="Grupos Grandes" accent="green">

Gerenciamento de grupos com milhares de membros. Solução: Otimização de broadcasts e cache de mensagens.

</Card>

</Cards>

## Evolução da Arquitetura

<Timeline
  items={[
    { year: '2009', title: 'Versão inicial', body: 'Um app iOS simples, focado em mensagens de status.', accent: 'green' },
    { year: '2011–2012', title: 'Mensagens básicas', body: 'Chat implementado sobre um protocolo XMPP modificado.', accent: 'green' },
    { year: '2014', title: 'Aquisição pelo Facebook', body: 'Escala massiva e migração de infraestrutura após o acordo de ~US$ 19 bi.', accent: 'green' },
    { year: '2016', title: 'Criptografia ponta a ponta', body: 'O protocolo Signal é implantado em todas as conversas.', accent: 'green' },
    { year: '2019–Presente', title: 'Multi-dispositivo', body: 'Suporte nativo a múltiplos dispositivos com nova arquitetura de sincronização.', accent: 'green' },
  ]}
/>

## Referências

### Documentação e Artigos Oficiais

- [WhatsApp Engineering Blog](https://engineering.fb.com/category/whatsapp/)
- [WhatsApp Security](https://www.whatsapp.com/security/)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/)

### Artigos Técnicos e Análises

- [WhatsApp Encryption Overview](https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf)
- [Scaling WhatsApp Infrastructure](https://engineering.fb.com/2014/10/09/production-engineering/scaling-mercurial-at-facebook/)
- [Signal Protocol Specification](https://signal.org/docs/specifications/doubleratchet/)

### Conferências e Apresentações

- [F8 - WhatsApp Business Platform](https://www.youtube.com/watch?v=vvhC64hQZMk)
- [Real-time Messaging Architecture](https://www.youtube.com/watch?v=5DgVkKHxKQk)

### Segurança e Privacidade

- [WhatsApp Privacy Policy](https://www.whatsapp.com/privacy)
- [End-to-End Encryption Technical Paper](https://scontent.whatsapp.net/v/t39.8562-34/316546300_547692750646518_7299107161331633308_n.pdf?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=t_1sHkqHzr4AX9QJTP-&_nc_ht=scontent.whatsapp.net&oh=01_AdTz6KJ_MWwjY_lQh6MH1_BPmXiC_1kdpvnNvCXcaHsUxw&oe=65C2F7C1)
$mdx$),
  ('real-cases/bitly', '/casos-reais/bitly', 'cases', true, 91, NULL, true, 'Bit.ly System Design', 'Bit.ly System Design', $mdx$# Bit.ly System Design

How Bit.ly manages billions of redirects and URL shortening at global scale

## Impressive Numbers

<Metrics cols={3}>

<Metric value="20B+" label="Shortened links" accent="brand" />

<Metric value="400M+" label="Redirects per day" accent="brand" />

<Metric value="800M+" label="Active links" accent="brand" />

</Metrics>

## Origin Story

Bit.ly was created in 2008 inside Betaworks, a New York startup studio led by John Borthwick. Its purpose was almost mundane: Twitter had just popularized 140-character messages, and long URLs ate up precious space. Bit.ly turned any link into a handful of characters — and, crucially, recorded a click every time someone followed one.

Its breakout moment came in 2009, when Bit.ly became Twitter's default URL shortener. Overnight, a side project became core plumbing of the social web, shortening hundreds of millions of links and accumulating one of the richest real-time datasets about what the internet was clicking on. When Twitter launched its own shortener (t.co) in 2011, Bit.ly pivoted from consumer utility to an enterprise link-management and analytics platform.

Bit.ly later spun out of Betaworks as an independent company, with Spectrum Equity acquiring a majority stake in 2017. For system-design students it remains the canonical example: a deceptively simple service — hash a URL, store it, redirect fast — that becomes a serious distributed-systems problem at billions of links and sub-50ms latency.

<Callout type="info" title="💡 From Side Project to Social-Web Plumbing">

When Twitter made Bit.ly its default link shortener in 2009, a small Betaworks experiment suddenly handled hundreds of millions of links — and a textbook system-design problem became a real one.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="brand">

- Long URL shortening
- Fast redirection
- Custom links
- Real-time analytics
- Public API
- Link management and dashboards

</Card>

<Card title="Non-Functional Requirements" accent="brand">

- Ultra low latency (less than 50ms)
- High availability (99.99%)
- Data durability
- Horizontal scalability
- Security against abuse
- Strong consistency for URLs

</Card>

## System Architecture

### High-Level Architecture

Overview of Bit.ly's distributed architecture, showing the main components and their interactions.

<Architecture
  layers={[
    { name: 'Clients', accent: 'slate', nodes: ['Web', 'Mobile', 'API'] },
    { name: 'Edge', accent: 'brand', nodes: ['CDN & Edge Cache'] },
    { name: 'Balancer', accent: 'brand', nodes: ['Load Balancer'] },
    { name: 'Services', accent: 'brand', nodes: ['Shortening', 'Redirect', 'Analytics'] },
    { name: 'Storage', accent: 'slate', nodes: ['MySQL · Mapping', 'Redis · Cache', 'Cassandra · Analytics'] },
  ]}
  caption="Redirects are served hot from cache/CDN for sub-50ms latency; the MySQL mapping is the source of truth and analytics land asynchronously in Cassandra."
/>

### URL Flow

URL processing flow, from submission to short URL generation.

<Flow accent="brand" steps={['Original URL', 'Base62 hash', 'Store mapping', 'Short URL']} caption="A long URL is hashed to a short Base62 key, the mapping is persisted, and the short link is returned." />

### 1. Shortening System

#### Short URL Generation

- Base62 hash algorithm
- Collision verification
- Popular URL caching
- URL validation and sanitization

#### URL Types

- Standard URLs (7 characters)
- Custom URLs
- Expiring URLs
- Tracked URLs

### 2. Storage System

#### URL Storage

- MySQL for URL mapping
- Redis for redirect cache
- Cassandra for analytics
- Multi-region replication

#### Cache Strategies

- In-memory cache (Redis)
- CDN for popular URLs
- Local cache on servers
- Invalidation policies

### 3. Analytics System

#### Collected Metrics

- Clicks and redirects
- Geolocation
- Devices and browsers
- Referrers and campaigns
- Access times

#### Processing

- Stream processing with Kafka
- Real-time aggregations
- Daily batch processing
- Machine learning for spam detection

## Technical Decisions and Trade-offs

<Card title="1. Hash Size vs Collisions" accent="brand">

7-character URLs allow trillions of combinations, balancing URL length with collision probability.

</Card>

<Card title="2. Cache vs Consistency" accent="brand">

Extensive cache use improves performance but may cause temporary inconsistencies after URL updates.

</Card>

<Card title="3. Analytics vs Performance" accent="brand">

Detailed metrics collection slightly impacts redirect latency. Asynchronous processing minimizes impact.

</Card>

<Card title="4. Security vs Usability" accent="brand">

Security checks add latency but are necessary to prevent abuse and phishing.

</Card>

## Scaling Challenges

<Cards cols={2}>

<Card title="Mass Redirects" accent="brand">

Billions of daily redirects. Solution: Global CDN and distributed cache.

</Card>

<Card title="URL Generation" accent="brand">

Unique and fast hash generation. Solution: Distributed ID algorithm.

</Card>

<Card title="Analytics" accent="brand">

Real-time event processing. Solution: Distributed pipeline with Kafka.

</Card>

<Card title="Spam and Abuse" accent="brand">

Detection and prevention of malicious URLs. Solution: ML and distributed rate limiting.

</Card>

</Cards>

## Architecture Evolution

<Timeline
  items={[
    { year: '2008', title: 'Launch', body: 'A Python monolith with MySQL, incubated at Betaworks.', accent: 'brand' },
    { year: '2010–2011', title: 'First scale', body: 'Cache and CDN introduced as Twitter traffic explodes.', accent: 'brand' },
    { year: '2012–2013', title: 'Enterprise focus', body: 'Advanced analytics and enterprise-grade APIs.', accent: 'brand' },
    { year: '2015–2016', title: 'Microservices', body: 'Decomposition into smaller, independent services.', accent: 'brand' },
    { year: '2018–Present', title: 'Modern stack', body: 'Kubernetes, ML for abuse detection, and modern APIs.', accent: 'brand' },
  ]}
/>

## References

### Official Documentation and Articles

- [Bitly API Documentation](https://dev.bitly.com/)
- [Bitly Resources](https://bitly.com/pages/resources)
- [Technical Requirements](https://support.bitly.com/hc/en-us/articles/231247868-Technical-requirements-for-Bitly)

### Technical Articles and Analysis

- [Infrastructure: Improving Redirects](https://blog.bitly.com/posts/infrastructure-update-improving-redirects)
- [Building a Distributed Link Shortening System](https://medium.com/bitly-engineering/building-a-distributed-link-shortening-system-d4c1edc3f13b)
- [High Scalability - Bitly Architecture](https://www.highscalability.com/blog/2014/7/14/bitly-lessons-learned-building-a-distributed-system-that-han.html)

### Conferences and Presentations

- [QCon - Scaling Bit.ly](https://www.youtube.com/watch?v=JGLx8Jg4K6Y)
- [Tech Talk - URL Shortening at Scale](https://www.youtube.com/watch?v=SagZK5CSF8M)

### Tools and SDKs

- [Official API Clients](https://github.com/bitly/api-clients)
- [NSQ - Distributed Messaging Platform](https://github.com/bitly/go-nsq)
$mdx$, $mdx$# Bit.ly System Design

Como o Bit.ly gerencia bilhões de redirecionamentos e encurtamentos de URLs em escala global

## Números Impressionantes

<Metrics cols={3}>

<Metric value="20B+" label="Links encurtados" accent="brand" />

<Metric value="400M+" label="Redirecionamentos por dia" accent="brand" />

<Metric value="800M+" label="Links ativos" accent="brand" />

</Metrics>

## A História da Empresa

O Bit.ly foi criado em 2008 dentro da Betaworks, um estúdio de startups de Nova York liderado por John Borthwick. Seu propósito era quase trivial: o Twitter acabara de popularizar mensagens de 140 caracteres, e URLs longas devoravam um espaço precioso. O Bit.ly transformava qualquer link em um punhado de caracteres — e, crucialmente, registrava um clique toda vez que alguém o seguia.

Seu momento de explosão veio em 2009, quando o Bit.ly se tornou o encurtador de URLs padrão do Twitter. Da noite para o dia, um projeto paralelo virou peça central do encanamento da web social, encurtando centenas de milhões de links e acumulando um dos conjuntos de dados em tempo real mais ricos sobre o que a internet estava clicando. Quando o Twitter lançou seu próprio encurtador (t.co) em 2011, o Bit.ly migrou de utilitário de consumo para uma plataforma corporativa de gestão de links e analytics.

O Bit.ly mais tarde se desmembrou da Betaworks como empresa independente, com a Spectrum Equity adquirindo participação majoritária em 2017. Para estudantes de system design, ele continua sendo o exemplo canônico: um serviço enganosamente simples — gerar o hash de uma URL, armazená-lo, redirecionar rápido — que se torna um sério problema de sistemas distribuídos com bilhões de links e latência abaixo de 50ms.

<Callout type="info" title="💡 De Projeto Paralelo a Encanamento da Web Social">

Quando o Twitter tornou o Bit.ly seu encurtador de links padrão em 2009, um pequeno experimento da Betaworks passou a lidar com centenas de milhões de links — e um problema clássico de system design virou um problema real.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="brand">

- Encurtamento de URLs longas
- Redirecionamento rápido
- Links personalizados
- Analytics em tempo real
- API pública
- Gestão de links e dashboards

</Card>

<Card title="Requisitos Não-Funcionais" accent="brand">

- Latência ultra baixa (menor que 50ms)
- Alta disponibilidade (99.99%)
- Durabilidade dos dados
- Escalabilidade horizontal
- Segurança contra abusos
- Consistência forte para URLs

</Card>

## Arquitetura do Sistema

### Arquitetura de Alto Nível

Visão geral da arquitetura distribuída do Bit.ly, mostrando os principais componentes e suas interações.

<Architecture
  layers={[
    { name: 'Clientes', accent: 'slate', nodes: ['Web', 'Mobile', 'API'] },
    { name: 'Borda', accent: 'brand', nodes: ['CDN & Edge Cache'] },
    { name: 'Balancer', accent: 'brand', nodes: ['Load Balancer'] },
    { name: 'Serviços', accent: 'brand', nodes: ['Encurtamento', 'Redirecionamento', 'Analytics'] },
    { name: 'Armazenamento', accent: 'slate', nodes: ['MySQL · Mapeamento', 'Redis · Cache', 'Cassandra · Analytics'] },
  ]}
  caption="Os redirecionamentos são servidos quentes do cache/CDN para latência abaixo de 50ms; o mapeamento no MySQL é a fonte da verdade e o analytics chega de forma assíncrona no Cassandra."
/>

### Fluxo de URLs

Fluxo de processamento de URLs, desde a submissão até a geração da URL curta.

<Flow accent="brand" steps={['URL original', 'Hash Base62', 'Armazenar mapeamento', 'URL curta']} caption="Uma URL longa vira uma chave curta em Base62, o mapeamento é persistido e o link curto é retornado." />

### 1. Sistema de Encurtamento

#### Geração de URLs Curtas

- Algoritmo de hash base62
- Verificação de colisões
- Cache de URLs populares
- Validação e sanitização de URLs

#### Tipos de URLs

- URLs padrão (7 caracteres)
- URLs personalizadas
- URLs com expiração
- URLs com tracking

### 2. Sistema de Armazenamento

#### Armazenamento de URLs

- MySQL para mapeamento de URLs
- Redis para cache de redirecionamento
- Cassandra para analytics
- Replicação multi-região

#### Estratégias de Cache

- Cache em memória (Redis)
- CDN para URLs populares
- Cache local nos servidores
- Políticas de invalidação

### 3. Sistema de Analytics

#### Métricas Coletadas

- Cliques e redirecionamentos
- Geolocalização
- Dispositivos e browsers
- Referrers e campanhas
- Horários de acesso

#### Processamento

- Stream processing com Kafka
- Agregações em tempo real
- Batch processing diário
- Machine learning para detecção de spam

## Decisões Técnicas e Trade-offs

<Card title="1. Tamanho do Hash vs Colisões" accent="brand">

URLs de 7 caracteres permitem trilhões de combinações, balanceando comprimento da URL com probabilidade de colisões.

</Card>

<Card title="2. Cache vs Consistência" accent="brand">

Uso extensivo de cache melhora performance mas pode causar inconsistências temporárias após atualizações de URLs.

</Card>

<Card title="3. Analytics vs Performance" accent="brand">

Coleta de métricas detalhadas impacta levemente a latência de redirecionamento. Processamento assíncrono minimiza o impacto.

</Card>

<Card title="4. Segurança vs Usabilidade" accent="brand">

Verificações de segurança adicionam latência mas são necessárias para prevenir abusos e phishing.

</Card>

## Desafios de Escala

<Cards cols={2}>

<Card title="Redirecionamento em Massa" accent="brand">

Bilhões de redirecionamentos diários. Solução: CDN global e cache distribuído.

</Card>

<Card title="Geração de URLs" accent="brand">

Geração única e rápida de hashes. Solução: Algoritmo distribuído de IDs.

</Card>

<Card title="Analytics" accent="brand">

Processamento de eventos em tempo real. Solução: Pipeline distribuído com Kafka.

</Card>

<Card title="Spam e Abuso" accent="brand">

Detecção e prevenção de URLs maliciosas. Solução: ML e rate limiting distribuído.

</Card>

</Cards>

## Evolução da Arquitetura

<Timeline
  items={[
    { year: '2008', title: 'Lançamento', body: 'Um monólito Python com MySQL, incubado na Betaworks.', accent: 'brand' },
    { year: '2010–2011', title: 'Primeira escala', body: 'Cache e CDN introduzidos conforme o tráfego do Twitter explode.', accent: 'brand' },
    { year: '2012–2013', title: 'Foco enterprise', body: 'Analytics avançado e APIs de nível empresarial.', accent: 'brand' },
    { year: '2015–2016', title: 'Microsserviços', body: 'Decomposição em serviços menores e independentes.', accent: 'brand' },
    { year: '2018–Presente', title: 'Stack moderna', body: 'Kubernetes, ML para detecção de abuso e APIs modernas.', accent: 'brand' },
  ]}
/>

## Referências

### Documentação e Artigos Oficiais

- [Bitly API Documentation](https://dev.bitly.com/)
- [Bitly Resources](https://bitly.com/pages/resources)
- [Technical Requirements](https://support.bitly.com/hc/en-us/articles/231247868-Technical-requirements-for-Bitly)

### Artigos Técnicos e Análises

- [Infrastructure: Improving Redirects](https://blog.bitly.com/posts/infrastructure-update-improving-redirects)
- [Building a Distributed Link Shortening System](https://medium.com/bitly-engineering/building-a-distributed-link-shortening-system-d4c1edc3f13b)
- [High Scalability - Bitly Architecture](https://www.highscalability.com/blog/2014/7/14/bitly-lessons-learned-building-a-distributed-system-that-han.html)

### Conferências e Apresentações

- [QCon - Scaling Bit.ly](https://www.youtube.com/watch?v=JGLx8Jg4K6Y)
- [Tech Talk - URL Shortening at Scale](https://www.youtube.com/watch?v=SagZK5CSF8M)

### Ferramentas e SDKs

- [Official API Clients](https://github.com/bitly/api-clients)
- [NSQ - Distributed Messaging Platform](https://github.com/bitly/go-nsq)
$mdx$),
  ('real-cases/netflix', '/casos-reais/netflix', 'cases', true, 92, NULL, true, 'Netflix System Design', 'Netflix System Design', $mdx$# Netflix System Design

How Netflix delivers high-quality video streaming to millions of users globally

## Impressive Numbers

<Metrics cols={3}>

<Metric value="230M+" label="Global subscribers" accent="red" />

<Metric value="1B+" label="Streaming hours per day" accent="red" />

<Metric value="15%" label="Of global internet traffic" accent="red" />

</Metrics>

## Origin Story

Netflix was founded in 1997 in Scotts Valley, California, by Reed Hastings and Marc Randolph. The now-legendary version of the story credits a $40 late fee Hastings received for a copy of *Apollo 13* — though Randolph has admitted the tale is partly mythologized. The real insight was simpler: a DVD was light enough to mail cheaply, and the web could replace the video-store counter. In 1999 they killed due dates and late fees entirely with a flat monthly subscription, a model that quietly redefined the business.

In 2000, Netflix offered to sell itself to Blockbuster for $50 million. Blockbuster passed. A decade later Blockbuster was bankrupt, and Netflix had become a public company (IPO in 2002) with a streaming product that would eclipse the DVD business that built it. The 2007 launch of "Watch Now" streaming marked the pivot from a logistics company to one of the largest distributed systems on the planet.

That scale forced Netflix to invent much of the modern reliability playbook. A catastrophic 2008 database corruption pushed the company off its own data centers and onto AWS — a multi-year migration that produced Chaos Engineering (Chaos Monkey), the Open Connect CDN, and a microservices architecture whose open-source tools (Hystrix, Zuul, Eureka) became industry standards.

<Callout type="info" title="💡 The $50 Million Mistake">

In 2000, Netflix offered to sell itself to Blockbuster for $50 million — and was turned down. Blockbuster filed for bankruptcy in 2010. The decision to keep building became one of the most expensive "no thanks" in business history.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="red">

- Adaptive video streaming
- Personalized recommendation system
- Global content catalog
- Multiple profiles per account
- Continue watching cross-device
- Offline downloads

</Card>

<Card title="Non-Functional Requirements" accent="red">

- Low video start latency (less than 500ms)
- High availability (99.99%)
- Adaptive video quality
- Global scalability
- Content security (DRM)
- CDN cost efficiency

</Card>

## System Architecture

### High-Level Architecture

Overview of Netflix's distributed architecture, showing the main components and their interactions.

<Architecture
  layers={[
    { name: 'Clients', accent: 'slate', nodes: ['TV', 'Mobile', 'Web'] },
    { name: 'Edge', accent: 'red', nodes: ['Open Connect CDN'] },
    { name: 'Gateway', accent: 'red', nodes: ['API Gateway'] },
    { name: 'Services', accent: 'red', nodes: ['Streaming', 'Recommendation', 'Metadata'] },
    { name: 'Storage', accent: 'slate', nodes: ['S3 · Video', 'Cassandra', 'EVCache'] },
  ]}
  caption="Video bytes are served directly from Open Connect; control-plane traffic flows through the API gateway to backend services and their stores."
/>

### 1. Streaming System

#### Open Connect (CDN)

- Own CDN optimized for video
- Appliances in partner ISPs
- Hierarchical cache
- Route optimization

#### Video Processing

- Parallel transcoding
- Multiple qualities (SD to 4K)
- Adaptive segmentation
- DRM and content protection

### 2. Recommendation System

#### Algorithms

- Collaborative Filtering
- Content-based Filtering
- Per-profile personalization
- Continuous A/B Testing

#### Features

- Viewing history
- Genre preferences
- Navigation behavior
- Context (device, time)

### 3. Data Processing

#### Data Pipeline

- Kafka for event streaming
- Spark for batch processing
- Flink for real-time processing
- Features:
  - Quality telemetry
  - Viewing analytics
  - Engagement metrics
  - Anomaly detection

## Technical Decisions and Trade-offs

<Card title="1. Own CDN vs. Third-party" accent="red">

Open Connect offers greater control and optimization, but requires significant investment in infrastructure and maintenance.

</Card>

<Card title="2. Quality vs. Bandwidth" accent="red">

Adaptive streaming balances video quality with network conditions, prioritizing playback continuity.

</Card>

<Card title="3. Personalization vs. Performance" accent="red">

Highly personalized recommendations require intensive processing. Use of cache and pre-computation reduces latency.

</Card>

<Card title="4. Consistency vs. Availability" accent="red">

Preference for availability over strong consistency for non-critical metadata, allowing better offline experience.

</Card>

## Scaling Challenges

<Cards cols={2}>

<Card title="Global Traffic" accent="red">

Content delivery optimization globally. Solution: Open Connect and distributed cache.

</Card>

<Card title="Video Processing" accent="red">

Transcoding thousands of hours of content. Solution: Parallel and distributed pipeline.

</Card>

<Card title="Machine Learning" accent="red">

Personalized recommendations at scale. Solution: Distributed models and intelligent cache.

</Card>

<Card title="Microservices" accent="red">

Managing hundreds of services. Solution: Chaos Engineering and resilience.

</Card>

</Cards>

## Architecture Evolution

<Timeline
  items={[
    { year: '2007', title: 'Streaming launch', body: 'Streaming launches alongside the DVD business on basic infrastructure.', accent: 'red' },
    { year: '2009–2010', title: 'AWS migration', body: 'Move to the cloud begins — the start of true global scale.', accent: 'red' },
    { year: '2011–2012', title: 'Microservices', body: 'The monolith is decomposed into services; Chaos Monkey is introduced.', accent: 'red' },
    { year: '2012–2016', title: 'Open Connect', body: 'Netflix builds its own CDN and expands across the globe.', accent: 'red' },
    { year: '2016–Present', title: 'Adaptive streaming & ML', body: 'Focus shifts to quality and personalization with advanced machine learning.', accent: 'red' },
  ]}
/>

## References

### Official Documentation and Articles

- [Netflix Tech Blog](https://netflixtechblog.com/)
- [Netflix Open Source](https://netflix.github.io/)
- [Netflix ISP Infrastructure](https://about.netflix.com/en/news/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience)

### Technical Articles and Analysis

- [Netflix's Global Infrastructure](https://netflixtechblog.com/netflix-at-velocity-2015-89c1794da400)
- [Content Delivery Network](https://netflixtechblog.com/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience-c40c25b3b9fb)
- [Recommendation System](https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429)

### Open Source Tools

- [Hystrix - Latency and Fault Tolerance](https://github.com/Netflix/hystrix)
- [Zuul - Gateway Service](https://github.com/Netflix/zuul)
- [Eureka - Service Discovery](https://github.com/Netflix/eureka)

### Conferences and Presentations

- [QCon - Netflix Cloud Architecture](https://www.youtube.com/watch?v=CZ3wIuvmHeM)
- [AWS re:Invent - Netflix on AWS](https://www.youtube.com/watch?v=uCXv4gl2JT0)
$mdx$, $mdx$# Netflix System Design

Como a Netflix entrega streaming de vídeo em alta qualidade para milhões de usuários globalmente

## Números Impressionantes

<Metrics cols={3}>

<Metric value="230M+" label="Assinantes globais" accent="red" />

<Metric value="1B+" label="Horas de streaming por dia" accent="red" />

<Metric value="15%" label="Do tráfego global de internet" accent="red" />

</Metrics>

## A História da Empresa

A Netflix foi fundada em 1997 em Scotts Valley, Califórnia, por Reed Hastings e Marc Randolph. A versão hoje lendária da história credita uma multa de US$ 40 que Hastings recebeu por atrasar a devolução de *Apollo 13* — embora Randolph admita que o relato é em parte mitológico. O insight real era mais simples: um DVD era leve o bastante para ser enviado pelo correio de forma barata, e a web podia substituir o balcão da locadora. Em 1999, eles eliminaram prazos e multas por atraso com uma assinatura mensal fixa, um modelo que redefiniu silenciosamente o negócio.

Em 2000, a Netflix se ofereceu para ser vendida à Blockbuster por US$ 50 milhões. A Blockbuster recusou. Uma década depois, a Blockbuster estava falida, e a Netflix havia se tornado uma empresa pública (IPO em 2002) com um produto de streaming que ofuscaria o negócio de DVDs que a construiu. O lançamento do streaming "Watch Now" em 2007 marcou a virada de empresa de logística para um dos maiores sistemas distribuídos do planeta.

Essa escala forçou a Netflix a inventar boa parte do manual moderno de confiabilidade. Uma corrupção catastrófica de banco de dados em 2008 empurrou a empresa para fora dos próprios data centers e para a AWS — uma migração de vários anos que produziu o Chaos Engineering (Chaos Monkey), a CDN Open Connect e uma arquitetura de microsserviços cujas ferramentas open source (Hystrix, Zuul, Eureka) se tornaram padrões da indústria.

<Callout type="info" title="💡 O Erro de US$ 50 Milhões">

Em 2000, a Netflix se ofereceu para ser vendida à Blockbuster por US$ 50 milhões — e foi recusada. A Blockbuster pediu falência em 2010. A decisão de continuar construindo tornou-se um dos "não, obrigado" mais caros da história dos negócios.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="red">

- Streaming de vídeo adaptativo
- Sistema de recomendação personalizado
- Catálogo de conteúdo global
- Múltiplos perfis por conta
- Continue assistindo cross-device
- Downloads offline

</Card>

<Card title="Requisitos Não-Funcionais" accent="red">

- Baixa latência no início do vídeo (menor que 500ms)
- Alta disponibilidade (99.99%)
- Qualidade adaptativa de vídeo
- Escalabilidade global
- Segurança de conteúdo (DRM)
- Eficiência em custos de CDN

</Card>

## Arquitetura do Sistema

### Arquitetura de Alto Nível

Visão geral da arquitetura distribuída da Netflix, mostrando os principais componentes e suas interações.

<Architecture
  layers={[
    { name: 'Clientes', accent: 'slate', nodes: ['TV', 'Mobile', 'Web'] },
    { name: 'Borda', accent: 'red', nodes: ['Open Connect CDN'] },
    { name: 'Gateway', accent: 'red', nodes: ['API Gateway'] },
    { name: 'Serviços', accent: 'red', nodes: ['Streaming', 'Recomendação', 'Metadados'] },
    { name: 'Armazenamento', accent: 'slate', nodes: ['S3 · Vídeo', 'Cassandra', 'EVCache'] },
  ]}
  caption="Os bytes de vídeo são servidos diretamente do Open Connect; o tráfego de controle passa pelo API gateway até os serviços de backend e seus armazenamentos."
/>

### 1. Sistema de Streaming

#### Open Connect (CDN)

- CDN própria otimizada para vídeo
- Appliances em ISPs parceiros
- Cache hierárquico
- Otimização de rota

#### Processamento de Vídeo

- Transcodificação paralela
- Múltiplas qualidades (SD até 4K)
- Segmentação adaptativa
- DRM e proteção de conteúdo

### 2. Sistema de Recomendação

#### Algoritmos

- Collaborative Filtering
- Content-based Filtering
- Personalização por perfil
- A/B Testing contínuo

#### Features

- Histórico de visualização
- Preferências de gênero
- Comportamento de navegação
- Contexto (dispositivo, horário)

### 3. Processamento de Dados

#### Pipeline de Dados

- Kafka para streaming de eventos
- Spark para processamento batch
- Flink para processamento real-time
- Features:
  - Telemetria de qualidade
  - Analytics de visualização
  - Métricas de engajamento
  - Detecção de anomalias

## Decisões Técnicas e Trade-offs

<Card title="1. CDN Própria vs. Terceiros" accent="red">

Open Connect oferece maior controle e otimização, mas requer investimento significativo em infraestrutura e manutenção.

</Card>

<Card title="2. Qualidade vs. Largura de Banda" accent="red">

Streaming adaptativo equilibra qualidade de vídeo com condições de rede, priorizando continuidade da reprodução.

</Card>

<Card title="3. Personalização vs. Performance" accent="red">

Recomendações altamente personalizadas requerem processamento intensivo. Uso de cache e pré-computação reduz latência.

</Card>

<Card title="4. Consistência vs. Disponibilidade" accent="red">

Preferência por disponibilidade sobre consistência forte para metadados não críticos, permitindo melhor experiência offline.

</Card>

## Desafios de Escala

<Cards cols={2}>

<Card title="Tráfego Global" accent="red">

Otimização de entrega de conteúdo globalmente. Solução: Open Connect e cache distribuído.

</Card>

<Card title="Processamento de Vídeo" accent="red">

Transcodificação de milhares de horas de conteúdo. Solução: Pipeline paralelo e distribuído.

</Card>

<Card title="Machine Learning" accent="red">

Recomendações personalizadas em escala. Solução: Modelos distribuídos e cache inteligente.

</Card>

<Card title="Microserviços" accent="red">

Gerenciamento de centenas de serviços. Solução: Chaos Engineering e resiliência.

</Card>

</Cards>

## Evolução da Arquitetura

<Timeline
  items={[
    { year: '2007', title: 'Início do streaming', body: 'O streaming é lançado ao lado do negócio de DVDs, em infraestrutura básica.', accent: 'red' },
    { year: '2009–2010', title: 'Migração para a AWS', body: 'Começa a mudança para a nuvem — o início da escala verdadeiramente global.', accent: 'red' },
    { year: '2011–2012', title: 'Microsserviços', body: 'O monólito é decomposto em serviços; o Chaos Monkey é introduzido.', accent: 'red' },
    { year: '2012–2016', title: 'Open Connect', body: 'A Netflix constrói sua própria CDN e expande pelo mundo.', accent: 'red' },
    { year: '2016–Presente', title: 'Streaming adaptativo & ML', body: 'O foco migra para qualidade e personalização com machine learning avançado.', accent: 'red' },
  ]}
/>

## Referências

### Documentação e Artigos Oficiais

- [Netflix Tech Blog](https://netflixtechblog.com/)
- [Netflix Open Source](https://netflix.github.io/)
- [Netflix ISP Infrastructure](https://about.netflix.com/en/news/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience)

### Artigos Técnicos e Análises

- [Netflix's Global Infrastructure](https://netflixtechblog.com/netflix-at-velocity-2015-89c1794da400)
- [Content Delivery Network](https://netflixtechblog.com/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience-c40c25b3b9fb)
- [Recommendation System](https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429)

### Ferramentas Open Source

- [Hystrix - Latency and Fault Tolerance](https://github.com/Netflix/hystrix)
- [Zuul - Gateway Service](https://github.com/Netflix/zuul)
- [Eureka - Service Discovery](https://github.com/Netflix/eureka)

### Conferências e Apresentações

- [QCon - Netflix Cloud Architecture](https://www.youtube.com/watch?v=CZ3wIuvmHeM)
- [AWS re:Invent - Netflix on AWS](https://www.youtube.com/watch?v=uCXv4gl2JT0)
$mdx$),
  ('real-cases/uber', '/casos-reais/uber', 'cases', true, 93, NULL, true, 'Uber System Design', 'Uber System Design', $mdx$# Uber System Design

How Uber connects millions of drivers and passengers in real-time globally

## Impressive Numbers

<Metrics cols={3}>

<Metric value="130M+" label="Monthly active users" accent="slate" />

<Metric value="5M+" label="Active drivers" accent="slate" />

<Metric value="20M+" label="Trips per day" accent="slate" />

</Metrics>

## Origin Story

Uber began with a frustration shared by millions: in December 2008, Garrett Camp and Travis Kalanick couldn't get a cab on a snowy night in Paris. Camp, who had just sold StumbleUpon, became obsessed with the idea of tapping a button to summon a black car. The two launched UberCab in San Francisco in 2010 — initially a premium on-demand car service that felt like magic: your driver appeared on a map and rolled up minutes later.

Regulators were less enchanted. After cease-and-desist orders, the company dropped "Cab" from its name in 2011, and in 2012 launched UberX, opening the platform to everyday drivers in their own cars. That move turned a luxury app into a global marketplace and ignited years of regulatory and labor battles in nearly every city it entered.

Hyper-growth came with turbulence: a series of crises led to Travis Kalanick stepping down as CEO in 2017, with Dara Khosrowshahi taking over and steering the company to its 2019 IPO. Underneath the headlines, Uber built one of the hardest real-time systems anywhere — matching riders and drivers in milliseconds — and open-sourced the tools it needed, including the H3 hexagonal geospatial index.

<Callout type="info" title="💡 Born From a Missed Cab">

The idea for Uber was sparked on a single night in Paris when the founders couldn't find a taxi. The "press a button, get a ride" concept it produced reshaped urban transportation worldwide.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="slate">

- Real-time matching of drivers and passengers
- Precise geolocation
- Price and time estimation
- Payment processing
- Rating system
- Multiple service types (UberX, Black, etc.)

</Card>

<Card title="Non-Functional Requirements" accent="slate">

- Ultra-low latency (less than 100ms)
- High availability (99.99%)
- Eventual consistency
- Global scalability
- Fault tolerance
- Security and privacy

</Card>

## System Architecture

### High-Level Architecture

Overview of Uber's distributed architecture, showing the main components and their interactions.

<Architecture
  layers={[
    { name: 'Apps', accent: 'slate', nodes: ['Passenger', 'Driver'] },
    { name: 'Gateway', accent: 'slate', nodes: ['API Gateway'] },
    { name: 'Services', accent: 'slate', nodes: ['Matching', 'Location', 'Trip', 'Payment', 'Analytics'] },
    { name: 'Storage', accent: 'slate', nodes: ['PostgreSQL', 'Redis', 'Kafka'] },
  ]}
  caption="Rider and driver apps hit the gateway, which fans out to specialized services backed by PostgreSQL, Redis, and a Kafka event bus."
/>

### Matching Flow

Matching flow between passengers and drivers, demonstrating the process from request to match.

<Flow accent="slate" steps={['Ride request', 'Geospatial processing', 'Driver selection', 'Match confirmed']} caption="Each request is resolved to a nearby driver in milliseconds using geospatial indexing and batching." />

### 1. Matching System

#### Matching Algorithm

- Geohash for spatial search
- Quadtrees for indexing
- Request batching
- Multi-objective optimization

#### Factors Considered

- Distance and estimated time
- Driver rating
- Vehicle type
- Cancellation history
- Local supply and demand

### 2. Location System

#### Location Processing

- Real-time updates
- Kalman filter
- Map matching
- Route prediction

#### Optimizations

- Distributed spatial cache
- Coordinate compression
- Update batching
- Geographic sharding

### 3. Real-time System

#### Real-time Infrastructure

- WebSocket for persistent connections
- Kafka for events
- Redis for real-time state
- Features:
  - Real-time location
  - Dynamic ETA
  - Surge pricing
  - Trip status

## Technical Decisions and Trade-offs

<Card title="1. Precision vs Latency" accent="slate">

Balance between matching precision and response time. Use of batching and approximations to reduce latency.

</Card>

<Card title="2. Consistency vs Availability" accent="slate">

Preference for availability in non-critical data. Strong consistency only in financial transactions.

</Card>

<Card title="3. Cost vs Quality" accent="slate">

Optimization of computational resources vs matching quality. Use of adaptive algorithms based on demand.

</Card>

<Card title="4. Cache vs Freshness" accent="slate">

Aggressive caching for performance vs up-to-date data. Selective invalidation based on relevance.

</Card>

## Scaling Challenges

<Cards cols={2}>

<Card title="Mass Matching" accent="slate">

Processing millions of matches per day. Solution: Geographic sharding and batching.

</Card>

<Card title="Real-time Data" accent="slate">

Mass location updates. Solution: Distributed pipeline and filters.

</Card>

<Card title="Global Consistency" accent="slate">

Synchronization between regions. Solution: Multi-region replication and cache.

</Card>

<Card title="Demand Peaks" accent="slate">

Handling events and peak hours. Solution: Auto-scaling and surge pricing.

</Card>

</Cards>

## Architecture Evolution

<Timeline
  items={[
    { year: '2009', title: 'Initial MVP', body: 'A Ruby on Rails monolith with manual matching.', accent: 'slate' },
    { year: '2011–2012', title: 'First scale', body: 'Automatic matching introduced; Redis powers dispatch.', accent: 'slate' },
    { year: '2014–2015', title: 'Microservices', body: 'Decomposition into services with Kafka for events.', accent: 'slate' },
    { year: '2016–2018', title: 'Global scale', body: 'Multi-region deployment and geographic optimization.', accent: 'slate' },
    { year: '2019–Present', title: 'ML & optimization', body: 'Machine learning for matching and demand prediction.', accent: 'slate' },
  ]}
/>

## References

### Official Documentation and Articles

- [Uber Engineering Blog](https://eng.uber.com/)
- [Uber Open Source](https://uber.github.io/)
- [Uber Developer Platform](https://developer.uber.com/)

### Technical Articles and Analysis

- [H3: Uber's Hexagonal Hierarchical Spatial Index](https://eng.uber.com/h3/)
- [Marketplace Real-time Pricing](https://eng.uber.com/marketplace-real-time-pricing/)
- [Engineering Efficient Route Planning](https://eng.uber.com/engineering-an-efficient-route/)

### Open Source Tools

- [H3 - Geospatial Indexing System](https://github.com/uber/h3)
- [Cadence - Workflow Engine](https://github.com/uber/cadence)
- [Zap - Logging Framework](https://github.com/uber-go/zap)

### Conferences and Presentations

- [QCon - Uber's Marketplace Platform](https://www.youtube.com/watch?v=nuiLcWE8sPA)
- [StrangeLoop - Uber's Real-time Tech Stack](https://www.youtube.com/watch?v=kb-m2fasdDY)
$mdx$, $mdx$# Uber System Design

Como o Uber conecta milhões de motoristas e passageiros em tempo real globalmente

## Números Impressionantes

<Metrics cols={3}>

<Metric value="130M+" label="Usuários ativos mensais" accent="slate" />

<Metric value="5M+" label="Motoristas ativos" accent="slate" />

<Metric value="20M+" label="Viagens por dia" accent="slate" />

</Metrics>

## A História da Empresa

O Uber nasceu de uma frustração compartilhada por milhões: em dezembro de 2008, Garrett Camp e Travis Kalanick não conseguiram um táxi em uma noite de neve em Paris. Camp, que havia acabado de vender o StumbleUpon, ficou obcecado pela ideia de apertar um botão e chamar um carro preto. Os dois lançaram a UberCab em São Francisco em 2010 — inicialmente um serviço premium de carros sob demanda que parecia mágica: o motorista aparecia em um mapa e chegava em minutos.

Os reguladores ficaram menos encantados. Após ordens de cessar e desistir, a empresa removeu o "Cab" do nome em 2011 e, em 2012, lançou o UberX, abrindo a plataforma para motoristas comuns com seus próprios carros. Esse movimento transformou um app de luxo em um marketplace global e desencadeou anos de batalhas regulatórias e trabalhistas em quase todas as cidades onde entrou.

O hipercrescimento veio com turbulência: uma série de crises levou Travis Kalanick a deixar o cargo de CEO em 2017, com Dara Khosrowshahi assumindo e conduzindo a empresa ao IPO em 2019. Por baixo das manchetes, o Uber construiu um dos sistemas em tempo real mais difíceis que existem — combinando passageiros e motoristas em milissegundos — e abriu o código das ferramentas de que precisava, incluindo o índice geoespacial hexagonal H3.

<Callout type="info" title="💡 Nascido de um Táxi Que Não Veio">

A ideia do Uber surgiu em uma única noite em Paris, quando os fundadores não conseguiram um táxi. O conceito de "aperte um botão, ganhe uma corrida" que dali surgiu remodelou o transporte urbano no mundo todo.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="slate">

- Matching em tempo real de motoristas e passageiros
- Geolocalização precisa
- Estimativa de preço e tempo
- Processamento de pagamentos
- Sistema de avaliação
- Múltiplos tipos de serviço (UberX, Black, etc.)

</Card>

<Card title="Requisitos Não-Funcionais" accent="slate">

- Latência ultra baixa (menor que 100ms)
- Alta disponibilidade (99.99%)
- Consistência eventual
- Escalabilidade global
- Tolerância a falhas
- Segurança e privacidade

</Card>

## Arquitetura do Sistema

### Arquitetura de Alto Nível

Visão geral da arquitetura distribuída do Uber, mostrando os principais componentes e suas interações.

<Architecture
  layers={[
    { name: 'Apps', accent: 'slate', nodes: ['Passageiro', 'Motorista'] },
    { name: 'Gateway', accent: 'slate', nodes: ['API Gateway'] },
    { name: 'Serviços', accent: 'slate', nodes: ['Matching', 'Localização', 'Viagens', 'Pagamentos', 'Analytics'] },
    { name: 'Armazenamento', accent: 'slate', nodes: ['PostgreSQL', 'Redis', 'Kafka'] },
  ]}
  caption="Os apps de passageiro e motorista acessam o gateway, que distribui para serviços especializados apoiados por PostgreSQL, Redis e um barramento de eventos Kafka."
/>

### Fluxo de Matching

Fluxo de matching entre passageiros e motoristas, demonstrando o processo desde a solicitação até o match.

<Flow accent="slate" steps={['Solicitação de corrida', 'Processamento geoespacial', 'Seleção do motorista', 'Match confirmado']} caption="Cada solicitação é resolvida para um motorista próximo em milissegundos usando indexação geoespacial e batching." />

### 1. Sistema de Matching

#### Algoritmo de Matching

- Geohash para busca espacial
- Quadtrees para indexação
- Batching de requisições
- Otimização multi-objetivo

#### Fatores Considerados

- Distância e tempo estimado
- Rating do motorista
- Tipo de veículo
- Histórico de cancelamentos
- Demanda e oferta local

### 2. Sistema de Localização

#### Processamento de Localização

- Atualização em tempo real
- Filtro de Kalman
- Map matching
- Predição de rotas

#### Otimizações

- Cache espacial distribuído
- Compressão de coordenadas
- Batching de atualizações
- Sharding geográfico

### 3. Sistema em Tempo Real

#### Infraestrutura Real-time

- WebSocket para conexões persistentes
- Kafka para eventos
- Redis para estado em tempo real
- Features:
  - Localização em tempo real
  - ETA dinâmico
  - Surge pricing
  - Status da viagem

## Decisões Técnicas e Trade-offs

<Card title="1. Precisão vs Latência" accent="slate">

Balance entre precisão do matching e tempo de resposta. Uso de batching e aproximações para reduzir latência.

</Card>

<Card title="2. Consistência vs Disponibilidade" accent="slate">

Preferência por disponibilidade em dados não críticos. Consistência forte apenas em transações financeiras.

</Card>

<Card title="3. Custo vs Qualidade" accent="slate">

Otimização de recursos computacionais vs qualidade do matching. Uso de algoritmos adaptativos baseados na demanda.

</Card>

<Card title="4. Cache vs Freshness" accent="slate">

Caching agressivo para performance vs dados atualizados. Invalidação seletiva baseada em relevância.

</Card>

## Desafios de Escala

<Cards cols={2}>

<Card title="Matching em Massa" accent="slate">

Processamento de milhões de matches por dia. Solução: Sharding geográfico e batching.

</Card>

<Card title="Dados em Tempo Real" accent="slate">

Atualizações de localização em massa. Solução: Pipeline distribuído e filtros.

</Card>

<Card title="Consistência Global" accent="slate">

Sincronização entre regiões. Solução: Replicação multi-região e cache.

</Card>

<Card title="Picos de Demanda" accent="slate">

Handling de eventos e horários de pico. Solução: Auto-scaling e surge pricing.

</Card>

</Cards>

## Evolução da Arquitetura

<Timeline
  items={[
    { year: '2009', title: 'MVP inicial', body: 'Um monólito em Ruby on Rails com matching manual.', accent: 'slate' },
    { year: '2011–2012', title: 'Primeira escala', body: 'Matching automático introduzido; o Redis passa a alimentar o dispatch.', accent: 'slate' },
    { year: '2014–2015', title: 'Microsserviços', body: 'Decomposição em serviços com Kafka para eventos.', accent: 'slate' },
    { year: '2016–2018', title: 'Escala global', body: 'Implantação multi-região e otimização geográfica.', accent: 'slate' },
    { year: '2019–Presente', title: 'ML & otimização', body: 'Machine learning para matching e predição de demanda.', accent: 'slate' },
  ]}
/>

## Referências

### Documentação e Artigos Oficiais

- [Uber Engineering Blog](https://eng.uber.com/)
- [Uber Open Source](https://uber.github.io/)
- [Uber Developer Platform](https://developer.uber.com/)

### Artigos Técnicos e Análises

- [H3: Uber's Hexagonal Hierarchical Spatial Index](https://eng.uber.com/h3/)
- [Marketplace Real-time Pricing](https://eng.uber.com/marketplace-real-time-pricing/)
- [Engineering Efficient Route Planning](https://eng.uber.com/engineering-an-efficient-route/)

### Ferramentas Open Source

- [H3 - Geospatial Indexing System](https://github.com/uber/h3)
- [Cadence - Workflow Engine](https://github.com/uber/cadence)
- [Zap - Logging Framework](https://github.com/uber-go/zap)

### Conferências e Apresentações

- [QCon - Uber's Marketplace Platform](https://www.youtube.com/watch?v=nuiLcWE8sPA)
- [StrangeLoop - Uber's Real-time Tech Stack](https://www.youtube.com/watch?v=kb-m2fasdDY)
$mdx$),
  ('real-cases/chatgpt', '/casos-reais/chatgpt', 'cases', true, 94, NULL, true, 'ChatGPT System Design', 'System Design do ChatGPT', $mdx$# ChatGPT System Design

How an LLM assistant serves hundreds of millions of users with token-by-token streaming on scarce GPU fleets.

## Impressive Numbers

<Metrics cols={3}>

<Metric value="800M+" label="Weekly active users" accent="green" />

<Metric value="<1s" label="Target time-to-first-token" accent="brand" />

<Metric value="100Ks" label="GPUs in the serving fleet" accent="purple" />

</Metrics>

## Origin Story

ChatGPT is the consumer face of OpenAI, a lab founded in December 2015 by Sam Altman, Elon Musk, Greg Brockman, Ilya Sutskever, and others — originally as a non-profit with the mission of ensuring artificial general intelligence benefits humanity. The research lineage is what matters technically: GPT-1 (2018), GPT-2 (2019), and GPT-3 (2020) steadily showed that scaling up transformer language models produced startlingly general capabilities.

ChatGPT itself launched on November 30, 2022, built on a fine-tuned GPT-3.5. OpenAI framed it as a "low-key research preview," expecting modest interest. Instead it reached one million users in five days and around 100 million monthly users within two months — the fastest-growing consumer application in history at the time, and the moment generative AI went mainstream.

That overnight demand turned a research artifact into one of the hardest serving problems in the industry: streaming tokens to hundreds of millions of users from a finite, expensive GPU fleet. The architecture on this page exists because the product succeeded far faster than anyone had planned for.

<Callout type="info" title="💡 A 'Low-Key Research Preview'">

OpenAI expected ChatGPT to attract modest interest. It hit roughly 100 million monthly users in about two months — making it the fastest-growing consumer app in history at the time and kicking off the generative-AI era.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="brand">

- Conversational chat with streamed responses
- Multi-turn memory within a conversation
- Tool use (browsing, code, retrieval)
- Multiple models at different price/quality tiers
- File and image inputs

</Card>

<Card title="Non-Functional Requirements" accent="purple">

- Low time-to-first-token (perceived speed)
- High throughput per GPU (cost control)
- Global availability and graceful degradation
- Safety filtering on inputs and outputs

</Card>

## Architecture at a Glance

<Architecture
  layers={[
    { name: 'Clients', accent: 'slate', nodes: ['Web', 'Mobile', 'API'] },
    { name: 'Edge', accent: 'brand', nodes: ['Load Balancer'] },
    { name: 'API', accent: 'brand', nodes: ['API + Auth'] },
    { name: 'Control', accent: 'purple', nodes: ['Orchestrator'] },
    { name: 'Inference', accent: 'purple', nodes: ['GPU servers (continuous batching)'] },
    { name: 'Backends', accent: 'slate', nodes: ['Tools (retrieval/code/browse)', 'Conversation store'] },
  ]}
  caption="The orchestrator drives GPU inference servers that stream tokens back, calling out to tools and the conversation store as needed."
/>

## Key Design Challenges

### 1. Streaming Tokens

Responses are streamed token-by-token over Server-Sent Events so the user sees output immediately. A low time-to-first-token matters more than total completion time for perceived speed.

### 2. Continuous Batching on GPUs

The inference layer packs many concurrent requests into a running batch, adding and removing requests every decode step to keep GPUs saturated. The KV cache, not raw compute, bounds concurrency.

<Callout type="info" title="💡 Where the Cost Goes">

Each conversation turn re-sends prior context, so cost grows with conversation length. Caching the prompt prefix (KV cache reuse) and capping context length are essential cost levers.

</Callout>

### 3. Model Routing

A request is routed to an appropriate model tier — small/cheap for simple turns, large for hard ones — behind a stable API, allowing A/B tests and gradual rollouts.

### 4. Capacity and Autoscaling

GPU capacity is finite and slow to add. During spikes the system relies on queueing, load shedding, and degradation (smaller models) rather than instant scale-up.

## Relevant Concepts

This case ties together [LLM serving fundamentals](/sistemas-ia/llm-serving-fundamentals), [inference batching](/sistemas-ia/llm-serving-fundamentals/simulator), [GPU autoscaling](/sistemas-ia/gpu-autoscaling), the [LLM gateway](/sistemas-ia/llm-gateway), and [prompt-injection defenses](/seguranca/prompt-injection).
$mdx$, $mdx$# System Design do ChatGPT

Como um assistente baseado em LLM atende centenas de milhões de usuários com streaming token a token sobre frotas escassas de GPUs.

## Números Impressionantes

<Metrics cols={3}>

<Metric value="800M+" label="Usuários ativos por semana" accent="green" />

<Metric value="<1s" label="Meta de tempo até o primeiro token" accent="brand" />

<Metric value="100Ks" label="GPUs na frota de serving" accent="purple" />

</Metrics>

## A História da Empresa

O ChatGPT é a face de consumo da OpenAI, um laboratório fundado em dezembro de 2015 por Sam Altman, Elon Musk, Greg Brockman, Ilya Sutskever e outros — originalmente como uma organização sem fins lucrativos com a missão de garantir que a inteligência artificial geral beneficie a humanidade. A linhagem de pesquisa é o que importa tecnicamente: GPT-1 (2018), GPT-2 (2019) e GPT-3 (2020) mostraram de forma consistente que escalar modelos de linguagem transformer produzia capacidades surpreendentemente gerais.

O próprio ChatGPT foi lançado em 30 de novembro de 2022, construído sobre um GPT-3.5 ajustado. A OpenAI o apresentou como um "research preview discreto", esperando interesse modesto. Em vez disso, ele alcançou um milhão de usuários em cinco dias e cerca de 100 milhões de usuários mensais em dois meses — o aplicativo de consumo de crescimento mais rápido da história até então, e o momento em que a IA generativa se tornou mainstream.

Essa demanda repentina transformou um artefato de pesquisa em um dos problemas de serving mais difíceis da indústria: transmitir tokens para centenas de milhões de usuários a partir de uma frota de GPUs finita e cara. A arquitetura desta página existe porque o produto teve sucesso muito mais rápido do que qualquer um havia planejado.

<Callout type="info" title="💡 Um 'Research Preview Discreto'">

A OpenAI esperava que o ChatGPT atraísse interesse modesto. Ele chegou a cerca de 100 milhões de usuários mensais em aproximadamente dois meses — tornando-se o app de consumo de crescimento mais rápido da história até então e inaugurando a era da IA generativa.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="brand">

- Chat conversacional com respostas em streaming
- Memória de múltiplos turnos dentro de uma conversa
- Uso de ferramentas (navegação, código, recuperação)
- Múltiplos modelos em diferentes camadas de preço/qualidade
- Entradas de arquivos e imagens

</Card>

<Card title="Requisitos Não Funcionais" accent="purple">

- Baixo tempo até o primeiro token (velocidade percebida)
- Alta vazão por GPU (controle de custo)
- Disponibilidade global e degradação graciosa
- Filtragem de segurança nas entradas e saídas

</Card>

## Arquitetura em Resumo

<Architecture
  layers={[
    { name: 'Clientes', accent: 'slate', nodes: ['Web', 'Mobile', 'API'] },
    { name: 'Borda', accent: 'brand', nodes: ['Balanceador'] },
    { name: 'API', accent: 'brand', nodes: ['API + Auth'] },
    { name: 'Controle', accent: 'purple', nodes: ['Orquestrador'] },
    { name: 'Inferência', accent: 'purple', nodes: ['Servidores GPU (continuous batching)'] },
    { name: 'Backends', accent: 'slate', nodes: ['Ferramentas (recuperação/código/web)', 'Armazenamento de conversas'] },
  ]}
  caption="O orquestrador comanda os servidores de inferência em GPU, que transmitem tokens de volta, acionando ferramentas e o armazenamento de conversas conforme necessário."
/>

## Principais Desafios de Design

### 1. Streaming de Tokens

As respostas são transmitidas token a token via Server-Sent Events para o usuário ver a saída imediatamente. Um baixo tempo até o primeiro token importa mais que o tempo total de conclusão para a velocidade percebida.

### 2. Continuous Batching nas GPUs

A camada de inferência empacota muitas requisições simultâneas em um lote em execução, adicionando e removendo requisições a cada passo de decode para manter as GPUs saturadas. O KV cache, não o cálculo bruto, limita a concorrência.

<Callout type="info" title="💡 Para Onde Vai o Custo">

Cada turno da conversa reenvia o contexto anterior, então o custo cresce com o tamanho da conversa. Cachear o prefixo do prompt (reuso de KV cache) e limitar o tamanho do contexto são alavancas essenciais de custo.

</Callout>

### 3. Roteamento de Modelos

Uma requisição é roteada para a camada de modelo apropriada — pequeno/barato para turnos simples, grande para difíceis — atrás de uma API estável, permitindo testes A/B e rollouts graduais.

### 4. Capacidade e Autoescalonamento

A capacidade de GPU é finita e lenta de adicionar. Durante picos, o sistema depende de enfileiramento, descarte de carga e degradação (modelos menores) em vez de escala instantânea.

## Conceitos Relevantes

Este caso conecta [fundamentos de serving de LLM](/sistemas-ia/llm-serving-fundamentals), [batching de inferência](/sistemas-ia/llm-serving-fundamentals/simulator), [autoescalonamento de GPU](/sistemas-ia/gpu-autoscaling), o [gateway de LLM](/sistemas-ia/llm-gateway) e as [defesas contra prompt injection](/seguranca/prompt-injection).
$mdx$),
  ('real-cases/perplexity', '/casos-reais/perplexity', 'cases', true, 95, NULL, true, 'Perplexity System Design', 'System Design do Perplexity', $mdx$# Perplexity System Design

How a RAG-based answer engine combines live web retrieval with LLM generation to return cited, grounded answers.

## Impressive Numbers

<Metrics cols={3}>

<Metric value="Billions" label="Queries answered" accent="green" />

<Metric value="<3s" label="Typical answer latency" accent="brand" />

<Metric value="Live" label="Web-grounded results" accent="purple" />

</Metrics>

## Origin Story

Perplexity was founded in August 2022 by Aravind Srinivas (CEO, formerly a researcher at OpenAI and DeepMind), Denis Yarats (CTO, ex-Meta AI), Johnny Ho, and Andy Konwinski (a co-founder of Databricks). The team didn't start with a search engine — early experiments explored natural-language interfaces over structured data — before pivoting to the idea that became their identity: a conversational *answer engine*.

The founding frustration was the "ten blue links" model of web search, where users are handed a list of pages and left to do the synthesis themselves. Perplexity's answer, launched as a public beta on December 7, 2022 — the same window in which ChatGPT exploded — was to return a direct, written answer with inline citations you can verify. Grounding every claim in retrieved sources was the whole point.

That product is essentially Retrieval-Augmented Generation taken to production: search the live web, rerank the results, and let an LLM compose a cited answer. Backed by investors including Jeff Bezos, Nat Friedman, and NVIDIA, Perplexity became one of the most visible examples of RAG as a consumer product.

<Callout type="info" title="💡 Answers, Not Links">

Perplexity's founding bet was to replace the list of blue links with a single, written answer — every sentence backed by a citation you can check. It's RAG as a mainstream product.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="brand">

- Answer questions with up-to-date information
- Cite sources for every claim
- Follow-up questions with conversation context
- Rank and synthesize multiple sources

</Card>

<Card title="Non-Functional Requirements" accent="purple">

- Low latency despite multi-stage retrieval
- Freshness (results reflect the live web)
- Grounding to reduce hallucinations
- Cost control on retrieval and generation

</Card>

## Architecture at a Glance

<Flow
  accent="purple"
  steps={['Query', 'Query understanding', 'Retrieval (web + vector)', 'Rerank', 'Context assembly', 'LLM generation', 'Streamed answer']}
  caption="A RAG pipeline: understand the query, retrieve and rerank sources, assemble context, then generate a cited answer and stream it back."
/>

## Key Design Challenges

### 1. Retrieval Quality Caps Answer Quality

The answer can only be as good as the retrieved sources. The pipeline blends keyword and semantic (vector) search, then reranks candidates so the most relevant passages reach the model.

<Callout type="info" title="💡 Grounding and Citations">

By instructing the model to answer only from retrieved passages and attach citations, the system makes answers verifiable and reduces hallucinations — the core value of RAG.

</Callout>

### 2. Latency Budget Across Stages

Each stage (search, rerank, generate) adds latency. Aggressive caching of popular queries, parallel retrieval, and streaming the final answer keep perceived latency low.

### 3. Freshness vs Cost

Crawling and indexing the live web is expensive. The system balances fresh retrieval for time-sensitive queries against cached answers for popular, stable ones.

### 4. Reranking

A fast vector search returns many candidates; a slower, more precise reranker reorders them so only the best few fill the limited context window.

## Relevant Concepts

This case is a real-world application of [RAG](/sistemas-ia/rag), [vector search](/sistemas-ia/vector-search), the [RAG pipeline simulator](/sistemas-ia/rag/simulator), and [LLM observability](/monitoramento-e-manutencao/llm-observability).
$mdx$, $mdx$# System Design do Perplexity

Como um motor de respostas baseado em RAG combina recuperação web ao vivo com geração por LLM para retornar respostas fundamentadas e com citações.

## Números Impressionantes

<Metrics cols={3}>

<Metric value="Bilhões" label="Consultas respondidas" accent="green" />

<Metric value="<3s" label="Latência típica da resposta" accent="brand" />

<Metric value="Ao vivo" label="Resultados fundamentados na web" accent="purple" />

</Metrics>

## A História da Empresa

A Perplexity foi fundada em agosto de 2022 por Aravind Srinivas (CEO, ex-pesquisador da OpenAI e da DeepMind), Denis Yarats (CTO, ex-Meta AI), Johnny Ho e Andy Konwinski (cofundador da Databricks). A equipe não começou com um mecanismo de busca — experimentos iniciais exploravam interfaces de linguagem natural sobre dados estruturados — antes de pivotar para a ideia que se tornou sua identidade: um *mecanismo de respostas* conversacional.

A frustração de fundação era o modelo dos "dez links azuis" da busca na web, em que o usuário recebe uma lista de páginas e fica encarregado de fazer a síntese sozinho. A resposta da Perplexity, lançada como beta público em 7 de dezembro de 2022 — na mesma janela em que o ChatGPT explodiu —, era devolver uma resposta direta e escrita, com citações em linha que você pode verificar. Embasar cada afirmação em fontes recuperadas era todo o ponto.

Esse produto é, essencialmente, o Retrieval-Augmented Generation levado à produção: buscar na web ao vivo, reordenar os resultados e deixar um LLM compor uma resposta com citações. Apoiada por investidores como Jeff Bezos, Nat Friedman e NVIDIA, a Perplexity se tornou um dos exemplos mais visíveis de RAG como produto de consumo.

<Callout type="info" title="💡 Respostas, Não Links">

A aposta de fundação da Perplexity era substituir a lista de links azuis por uma única resposta escrita — cada frase respaldada por uma citação que você pode conferir. É RAG como produto mainstream.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="brand">

- Responder perguntas com informação atualizada
- Citar fontes para cada afirmação
- Perguntas de acompanhamento com contexto da conversa
- Ranquear e sintetizar múltiplas fontes

</Card>

<Card title="Requisitos Não Funcionais" accent="purple">

- Baixa latência apesar da recuperação em múltiplos estágios
- Atualidade (resultados refletem a web ao vivo)
- Fundamentação para reduzir alucinações
- Controle de custo na recuperação e na geração

</Card>

## Arquitetura em Resumo

<Flow
  accent="purple"
  steps={['Consulta', 'Entendimento da consulta', 'Recuperação (web + vetorial)', 'Reordenação', 'Montagem de contexto', 'Geração por LLM', 'Resposta em streaming']}
  caption="Um pipeline de RAG: entender a consulta, recuperar e reordenar fontes, montar o contexto e então gerar uma resposta com citações e transmiti-la."
/>

## Principais Desafios de Design

### 1. A Qualidade da Recuperação Limita a da Resposta

A resposta só pode ser tão boa quanto as fontes recuperadas. O pipeline combina busca por palavra-chave e semântica (vetorial) e depois reordena candidatos para que as passagens mais relevantes cheguem ao modelo.

<Callout type="info" title="💡 Fundamentação e Citações">

Ao instruir o modelo a responder apenas a partir das passagens recuperadas e anexar citações, o sistema torna as respostas verificáveis e reduz alucinações — o valor central do RAG.

</Callout>

### 2. Orçamento de Latência entre Estágios

Cada estágio (busca, reordenação, geração) adiciona latência. Cache agressivo de consultas populares, recuperação paralela e streaming da resposta final mantêm a latência percebida baixa.

### 3. Atualidade vs Custo

Rastrear e indexar a web ao vivo é caro. O sistema equilibra recuperação fresca para consultas sensíveis ao tempo contra respostas em cache para as populares e estáveis.

### 4. Reordenação

Uma busca vetorial rápida retorna muitos candidatos; um reordenador mais lento e preciso os reorganiza para que apenas os melhores preencham a janela de contexto limitada.

## Conceitos Relevantes

Este caso é uma aplicação real de [RAG](/sistemas-ia/rag), [busca vetorial](/sistemas-ia/vector-search), do [simulador de pipeline RAG](/sistemas-ia/rag/simulator) e da [observabilidade de LLM](/monitoramento-e-manutencao/llm-observability).
$mdx$),
  ('real-cases/github-copilot', '/casos-reais/github-copilot', 'cases', true, 96, NULL, true, 'GitHub Copilot System Design', 'System Design do GitHub Copilot', $mdx$# GitHub Copilot System Design

How an AI pair-programmer delivers inline code completions with the ultra-low latency an editor demands.

## Impressive Numbers

<Metrics cols={3}>

<Metric value="Millions" label="Developers served" accent="green" />

<Metric value="~few 100ms" label="Completion latency budget" accent="brand" />

<Metric value="IDE" label="Inline, as-you-type" accent="purple" />

</Metrics>

## Origin Story

GitHub Copilot was born from a collaboration between GitHub (acquired by Microsoft in 2018) and OpenAI. Its engine was OpenAI Codex, a descendant of GPT-3 fine-tuned on a vast corpus of public source code. The premise was bold for 2021: an editor extension that doesn't just autocomplete tokens, but suggests whole lines and functions from a comment or a function signature.

Copilot launched as a technical preview in June 2021 and became generally available — as a paid product — in June 2022, making it one of the first large-scale, paid applications of generative AI. It also kicked off an ongoing debate about training on public code and the licensing implications, including litigation the industry is still working through.

What makes Copilot a distinct system-design problem is the constraint of the editor itself: a suggestion that arrives a moment too late is worthless, because the developer has already typed past it. Everything on this page — debouncing, compact context assembly, right-sized models — flows from that single, unforgiving latency requirement.

<Callout type="info" title="💡 The First Mainstream AI Pair Programmer">

By wrapping OpenAI's Codex model in an editor extension, Copilot turned "AI autocomplete" into a daily tool for millions of developers — and one of the first paid, at-scale products built on generative AI.

</Callout>

## System Requirements

<Card title="Functional Requirements" accent="brand">

- Inline code suggestions as the developer types
- Context from the open file and project
- Chat-based code assistance
- Multi-language support

</Card>

<Card title="Non-Functional Requirements" accent="purple">

- Extremely low latency (suggestions must feel instant)
- High request volume (every keystroke pause is a potential call)
- Cost efficiency per completion
- Privacy of source code

</Card>

## Architecture at a Glance

<Flow
  accent="purple"
  steps={['Editor (debounced)', 'Context assembly', 'Gateway', 'Code-model inference', 'Inline suggestion']}
  caption="A typing pause triggers context assembly from the current file and nearby code, then a streamed completion is rendered inline."
/>

## Key Design Challenges

### 1. Latency Is the Product

Unlike chat, a code completion that arrives late is worthless — the developer has already typed past it. The system optimizes aggressively for time-to-first-token.

<Callout type="info" title="💡 Don't Call on Every Keystroke">

Requests are **debounced**: the client waits for a brief typing pause before calling, and cancels in-flight requests when the developer keeps typing. This slashes cost and load.

</Callout>

### 2. Context Selection

A good suggestion needs the right context, but more context means higher latency and cost. The client assembles a compact, relevant prompt from the current file, nearby code, and open tabs — a retrieval problem at the edit level.

### 3. Acceptance as a Quality Signal

Whether a suggestion is accepted, edited, or rejected is a direct quality metric — far more meaningful than a 200 OK. These signals drive model and prompt improvements.

### 4. Throughput and Cost

With completions triggered constantly, the inference fleet must batch efficiently and route to right-sized models to keep per-completion cost viable.

## Relevant Concepts

This case applies [LLM serving fundamentals](/sistemas-ia/llm-serving-fundamentals), the [LLM gateway](/sistemas-ia/llm-gateway), [LLM observability](/monitoramento-e-manutencao/llm-observability), and latency techniques from [design principles](/principios-design/escalabilidade/latencia).
$mdx$, $mdx$# System Design do GitHub Copilot

Como um par-programador de IA entrega autocompletar de código inline com a latência ultrabaixa que um editor exige.

## Números Impressionantes

<Metrics cols={3}>

<Metric value="Milhões" label="Desenvolvedores atendidos" accent="green" />

<Metric value="~poucos 100ms" label="Orçamento de latência por completar" accent="brand" />

<Metric value="IDE" label="Inline, conforme você digita" accent="purple" />

</Metrics>

## A História da Empresa

O GitHub Copilot nasceu de uma colaboração entre o GitHub (adquirido pela Microsoft em 2018) e a OpenAI. Seu motor era o OpenAI Codex, um descendente do GPT-3 ajustado sobre um vasto corpus de código-fonte público. A premissa era ousada para 2021: uma extensão de editor que não apenas completa tokens, mas sugere linhas e funções inteiras a partir de um comentário ou de uma assinatura de função.

O Copilot foi lançado como uma prévia técnica em junho de 2021 e ficou disponível de forma geral — como produto pago — em junho de 2022, tornando-se uma das primeiras aplicações de IA generativa pagas em larga escala. Ele também iniciou um debate contínuo sobre o treinamento com código público e suas implicações de licenciamento, incluindo litígios que a indústria ainda está resolvendo.

O que torna o Copilot um problema distinto de system design é a restrição do próprio editor: uma sugestão que chega um instante tarde demais é inútil, porque o desenvolvedor já digitou além dela. Tudo nesta página — debouncing, montagem compacta de contexto, modelos do tamanho certo — decorre desse único e implacável requisito de latência.

<Callout type="info" title="💡 O Primeiro Par-Programador de IA Mainstream">

Ao envolver o modelo Codex da OpenAI em uma extensão de editor, o Copilot transformou o "autocompletar com IA" em uma ferramenta diária para milhões de desenvolvedores — e em um dos primeiros produtos pagos e em escala construídos sobre IA generativa.

</Callout>

## Requisitos do Sistema

<Card title="Requisitos Funcionais" accent="brand">

- Sugestões de código inline enquanto o desenvolvedor digita
- Contexto do arquivo aberto e do projeto
- Assistência de código baseada em chat
- Suporte a múltiplas linguagens

</Card>

<Card title="Requisitos Não Funcionais" accent="purple">

- Latência extremamente baixa (as sugestões devem parecer instantâneas)
- Alto volume de requisições (cada pausa na digitação é uma chamada potencial)
- Eficiência de custo por sugestão
- Privacidade do código-fonte

</Card>

## Arquitetura em Resumo

<Flow
  accent="purple"
  steps={['Editor (debounce)', 'Montagem de contexto', 'Gateway', 'Inferência (modelo de código)', 'Sugestão inline']}
  caption="Uma pausa na digitação dispara a montagem de contexto a partir do arquivo atual e do código próximo, e então uma sugestão em streaming é renderizada inline."
/>

## Principais Desafios de Design

### 1. A Latência É o Produto

Diferente do chat, uma sugestão de código que chega atrasada é inútil — o desenvolvedor já digitou além dela. O sistema otimiza agressivamente o tempo até o primeiro token.

<Callout type="info" title="💡 Não Chame a Cada Tecla">

As requisições têm **debounce**: o cliente espera uma breve pausa na digitação antes de chamar e cancela requisições em andamento quando o desenvolvedor continua digitando. Isso reduz drasticamente custo e carga.

</Callout>

### 2. Seleção de Contexto

Uma boa sugestão precisa do contexto certo, mas mais contexto significa maior latência e custo. O cliente monta um prompt compacto e relevante a partir do arquivo atual, do código próximo e das abas abertas — um problema de recuperação no nível da edição.

### 3. Aceitação como Sinal de Qualidade

Se uma sugestão é aceita, editada ou rejeitada é uma métrica direta de qualidade — muito mais significativa que um 200 OK. Esses sinais orientam melhorias no modelo e nos prompts.

### 4. Vazão e Custo

Com sugestões disparadas o tempo todo, a frota de inferência precisa agrupar de forma eficiente e rotear para modelos do tamanho certo para manter o custo por sugestão viável.

## Conceitos Relevantes

Este caso aplica [fundamentos de serving de LLM](/sistemas-ia/llm-serving-fundamentals), o [gateway de LLM](/sistemas-ia/llm-gateway), a [observabilidade de LLM](/monitoramento-e-manutencao/llm-observability) e técnicas de latência dos [princípios de design](/principios-design/escalabilidade/latencia).
$mdx$),
  ('components/index', '/componentes', 'components', true, 8, NULL, true, 'Basic Components', 'Componentes Básicos', $mdx$# Basic Components

Explore the fundamental building blocks of distributed systems

<Callout type="info">

Each component plays a specific role in building distributed systems. Understand their characteristics, advantages, and challenges.

</Callout>

<Cards cols={2}>

<Card emoji="🗄️" title="Databases" accent="green">

[Data storage and management in distributed systems.](/componentes/banco-dados)

- Persistence
- Data

</Card>

<Card emoji="⚡" title="Cache" accent="yellow">

[Temporary storage to improve performance and reduce latency.](/componentes/cache)

- Performance
- Speed

</Card>

<Card emoji="🔀" title="Load Balancer" accent="purple">

[Intelligent traffic distribution across multiple servers.](/componentes/load-balancer)

- Distribution
- Scalability

</Card>

<Card emoji="📨" title="Message Queues" accent="brand">

[Asynchronous and decoupled communication between services.](/componentes/message-queue)

- Asynchronous
- Messaging

</Card>

<Card emoji="🌐" title="CDN" accent="red">

[Global content distribution for better performance.](/componentes/cdn)

- Global
- Content

</Card>

<Card emoji="🛡️" title="API Gateway" accent="slate">

[Single entry point for API management.](/componentes/api-gateway)

- Routing
- Security

</Card>

<Card emoji="🔥" title="Firewall" accent="yellow">

[Traffic protection and control in distributed systems.](/componentes/firewall)

- Security
- Control

</Card>

</Cards>
$mdx$, $mdx$# Componentes Básicos

Explore os blocos fundamentais que compõem sistemas distribuídos

<Callout type="info">

Cada componente tem um papel específico na construção de sistemas distribuídos. Entenda suas características, vantagens e desafios.

</Callout>

<Cards cols={2}>

<Card emoji="🗄️" title="Bancos de Dados" accent="green">

[Armazenamento e gerenciamento de dados em sistemas distribuídos.](/componentes/banco-dados)

- Persistência
- Dados

</Card>

<Card emoji="⚡" title="Cache" accent="yellow">

[Armazenamento temporário para melhorar a performance e reduzir latência.](/componentes/cache)

- Performance
- Velocidade

</Card>

<Card emoji="🔀" title="Balanceador de Carga" accent="purple">

[Distribuição inteligente de tráfego entre múltiplos servidores.](/componentes/load-balancer)

- Distribuição
- Escalabilidade

</Card>

<Card emoji="📨" title="Filas de Mensagens" accent="brand">

[Comunicação assíncrona e desacoplada entre serviços.](/componentes/message-queue)

- Assíncrono
- Mensageria

</Card>

<Card emoji="🌐" title="CDN" accent="red">

[Distribuição global de conteúdo para melhor performance.](/componentes/cdn)

- Global
- Conteúdo

</Card>

<Card emoji="🛡️" title="API Gateway" accent="slate">

[Ponto único de entrada para gerenciamento de APIs.](/componentes/api-gateway)

- Roteamento
- Segurança

</Card>

<Card emoji="🔥" title="Firewall" accent="yellow">

[Proteção e controle de tráfego em sistemas distribuídos.](/componentes/firewall)

- Segurança
- Controle

</Card>

</Cards>
$mdx$),
  ('components/database', '/componentes/banco-dados', 'components', true, 9, NULL, true, 'Databases', 'Bancos de Dados', $mdx$# Databases

Databases are among the most important components of any system, responsible for storing, querying, and managing large volumes of data.

## Relational Databases (SQL)

Relational databases store data in tables with rows and columns. They use SQL for querying and data manipulation.

#### Advantages

- Strong consistency
- ACID transactions support (Atomicity, Consistency, Isolation, Durability)
- Broad community familiarity
- Well-defined data structure

#### Limitations

- Less flexible for unstructured data
- May be harder to scale horizontally due to rigid structure

<Callout type="neutral" title="Examples:">

MySQL, PostgreSQL, Oracle

</Callout>

## NoSQL Databases

Non-relational databases offering flexibility to store data as documents, key-value, graphs, or columns.

#### Advantages

- High scalability
- Data flexibility
- Support for large volumes of unstructured data

#### Limitations

- May trade consistency (eventual consistency) for availability and scalability

<Callout type="neutral">

**MongoDB (document database):**

Stores data in JSON/BSON format

**Cassandra (column store):**

Designed for horizontal scaling, ensuring high availability

**Redis (key-value):**

An in-memory database, extremely fast, used for cache and other purposes

</Callout>

## Sharding, Partitioning, and Replication

### Sharding

Sharding is like splitting a huge library into several rooms, each with a specific type of book, making it easier to find things.

<Callout type="neutral" title="Example:">

An e-commerce site with millions of users can shard data by region, storing each region's users on separate servers.

</Callout>

### Partitioning

Similar to sharding but with different criteria. Think of organizing a toolbox by size, type, or usage frequency.

<Callout type="neutral" title="Example:">

In a school database, students can be partitioned by school year so each year sits in its own partition.

</Callout>

### Replication

Replication is creating copies of data and storing them on multiple servers to improve availability and durability.

#### Synchronous Replication:

Copies are written at the same time, keeping versions identical at all times.

<Callout type="neutral" title="Example:">

A banking system where each transaction must be recorded in real time across all servers.

</Callout>

#### Asynchronous Replication:

Copies are updated with delay; small differences may exist, but there is backup.

<Callout type="neutral" title="Example:">

A news site where updates can be replicated with a small delay to secondary servers.

</Callout>
$mdx$, $mdx$# Bancos de Dados

Os bancos de dados são um dos componentes mais importantes de qualquer sistema, responsáveis pelo armazenamento, consulta e gerenciamento de grandes volumes de dados.

## Bancos de Dados Relacionais (SQL)

Armazenam dados em tabelas com linhas e colunas e usam SQL para consultas e manipulação.

#### Vantagens

- Forte consistência
- Suporte a transações ACID (Atomicidade, Consistência, Isolamento, Durabilidade)
- Familiaridade da comunidade
- Estruturação de dados bem definida

#### Limitações

- Menos flexíveis para dados não estruturados
- Dificuldade para escalar horizontalmente devido à estrutura rígida

<Callout type="neutral" title="Exemplos:">

MySQL, PostgreSQL, Oracle

</Callout>

## Bancos de Dados NoSQL

Bancos de dados não relacionais que oferecem flexibilidade para armazenar documentos, chave-valor, grafos ou colunas.

#### Vantagens

- Alta escalabilidade
- Flexibilidade de dados
- Suporte a grandes volumes de dados não estruturados

#### Limitações

- Pode sacrificar consistência (consistência eventual) para garantir disponibilidade e escalabilidade

<Callout type="neutral">

**MongoDB (banco de documentos):**

Armazena dados no formato JSON/BSON

**Cassandra (banco de colunas):**

Projetado para escalar horizontalmente garantindo alta disponibilidade

**Redis (chave-valor):**

Banco em memória, extremamente rápido, usado para cache e outros fins

</Callout>

## Sharding, Particionamento e Replicação

### Sharding

Como dividir uma grande biblioteca em várias salas menores para facilitar a organização e busca.

<Callout type="neutral" title="Exemplo:">

Um e-commerce com milhões de usuários pode shardear por região, armazenando os usuários de cada região em servidores separados.

</Callout>

### Particionamento

Semelhante ao sharding, mas com diferentes critérios de organização (tamanho, tipo, frequência de uso).

<Callout type="neutral" title="Exemplo:">

Em um banco de dados escolar, alunos podem ser particionados por ano letivo, cada ano em sua partição.

</Callout>

### Replicação

Criar cópias dos dados e armazená-las em múltiplos servidores para melhorar disponibilidade e durabilidade.

#### Replicação Síncrona:

As cópias são escritas ao mesmo tempo, mantendo versões idênticas.

<Callout type="neutral" title="Exemplo:">

Um sistema bancário, onde cada transação precisa ser registrada em tempo real em todos os servidores.

</Callout>

#### Replicação Assíncrona:

As cópias são atualizadas com atraso; podem existir pequenas diferenças, mas há backup.

<Callout type="neutral" title="Exemplo:">

Um site de notícias em que as atualizações podem ser replicadas com pequeno atraso para servidores secundários.

</Callout>
$mdx$),
  ('components/cache', '/componentes/cache', 'components', true, 10, NULL, true, 'Cache', 'Cache', $mdx$# Cache

Cache is a temporary storage layer used to store frequently accessed data, reducing latency and improving performance.

## Memcached

Think of Memcached as a whiteboard in your kitchen: quick to write and read, but erased content is gone forever.

<Callout type="neutral" title="Example:">

A news site can cache latest headlines in Memcached to speed up page loads.

</Callout>

## Redis

Redis is like a cabinet with drawers and shelves. Beyond quick access, it allows complex structures and optional persistence.

<Callout type="neutral" title="Example:">

A group chat app can use Redis lists to keep recent messages while optionally persisting to disk.

</Callout>

### Comparing both:

#### Simplicity:

Memcached is simpler (whiteboard). Redis is more versatile (cabinet) but requires more organization.

#### Data types:

Memcached stores simple values; Redis supports lists, sets, and other complex structures.

#### Persistence:

Memcached does not persist data; Redis offers disk persistence to avoid data loss.

## Distributed vs. Local Cache

#### Local Cache:

Stores data on the same server where processing happens. Fast but not scalable; each server keeps its own version.

#### Distributed Cache:

Shared among multiple servers, improving scalability and consistency across nodes.

<Callout type="neutral" title="Example:">

Using Redis as a distributed cache across multiple app servers to ensure all read the same cached data.

</Callout>

<Callout type="info" title="Interactive Simulator">

Try our interactive cache simulation to better understand how caching impacts system performance.

[Access Simulator](/componentes/cache/simulator)

</Callout>
$mdx$, $mdx$# Cache

Cache é uma camada de armazenamento temporário para dados frequentemente acessados, reduzindo latência e melhorando performance.

## Memcached

Pense no Memcached como um quadro branco na cozinha: rápido para escrever e ler, mas se apagar, o conteúdo some para sempre.

<Callout type="neutral" title="Exemplo:">

A news site can cache latest headlines in Memcached to speed up page loads.

</Callout>

## Redis

Redis é como um armário com gavetas e prateleiras. Além de acesso rápido, permite estruturas complexas e persistência opcional.

<Callout type="neutral" title="Exemplo:">

A group chat app can use Redis lists to keep recent messages while optionally persisting to disk.

</Callout>

### Comparando os dois:

#### Simplicidade:

Memcached é mais simples (quadro branco). Redis é mais versátil (armário), porém exige mais organização.

#### Tipos de dados:

Memcached armazena valores simples; Redis suporta listas, conjuntos e outras estruturas complexas.

#### Persistência:

Memcached não persiste dados; Redis oferece persistência em disco para evitar data loss.

## Cache Distribuído vs. Local

#### Cache Local:

Armazena dados no mesmo servidor do processamento. Rápido, porém pouco escalável; cada servidor mantém sua própria versão.

#### Cache Distribuído:

Compartilhado entre vários servidores, melhorando escalabilidade e consistência entre nós.

<Callout type="neutral" title="Exemplo:">

Using Redis as a distributed cache across multiple app servers to ensure all read the same cached data.

</Callout>

<Callout type="info" title="Simulador Interativo">

Experimente nossa simulação de cache para entender como o cache impacta a performance do sistema.

[Acessar Simulador](/componentes/cache/simulator)

</Callout>
$mdx$),
  ('components/load-balancer', '/componentes/load-balancer', 'components', true, 11, NULL, true, 'Load Balancers', 'Balanceadores de Carga', $mdx$# Load Balancers

Load balancers evenly distribute network traffic or requests across multiple servers, preventing any single server from becoming overloaded. For example, an e-commerce system can use a load balancer to distribute requests.

In load balancing, multiple server instances process requests simultaneously. This is essential in scalable systems, allowing you to add more servers as demand increases.

## Load Balancing Algorithms

### Round Robin

Requests are distributed sequentially among available servers, ensuring an even distribution.

<Callout type="neutral" title="How it works:">

If you have 3 servers (A, B, C), the first request goes to A, the second to B, the third to C, the fourth returns to A, and so on.

</Callout>

### Hashing

Uses a hash (based on IP or another identifier) to ensure requests from a specific client are directed to the same server.

<Callout type="neutral" title="Use case:">

Important for maintaining user sessions, ensuring a client always accesses the same server where their session is stored.

</Callout>

### Least Connections

Directs new requests to the server with the fewest active connections, helping to better balance the load.

<Callout type="neutral" title="Advantage:">

More efficient when servers have different capacities or when requests have very variable durations.

</Callout>

<Callout type="info" title="Interactive Simulator">

Try our interactive load-balancing simulation to see how different algorithms behave in practice.

[Access Simulator](/componentes/load-balancer/simulator)

</Callout>
$mdx$, $mdx$# Balanceadores de Carga

Os balanceadores de carga distribuem uniformemente o tráfego de rede ou solicitações entre vários servidores, evitando que um único servidor fique sobrecarregado. Por exemplo, um sistema e-commerce pode usar um balanceador de carga para distribuir as solicitações.

No balanceamento, várias instâncias de servidor processam as solicitações simultaneamente. Isso é essencial em sistemas escaláveis, permitindo adicionar mais servidores conforme a demanda aumenta.

## Algoritmos de Balanceamento

### Round Robin

As solicitações são distribuídas sequencialmente entre os servidores disponíveis, garantindo uma divisão uniforme.

<Callout type="neutral" title="Como funciona:">

Se você tem 3 servidores (A, B, C), a primeira requisição vai para A, a segunda para B, a terceira para C, a quarta volta para A, e assim por diante.

</Callout>

### Hashing

Utiliza um hash (baseado em IP ou outro identificador) para garantir que as solicitações de um cliente específico sejam direcionadas ao mesmo servidor.

<Callout type="neutral" title="Caso de uso:">

Importante para manter sessões de usuários, garantindo que um cliente sempre acesse o mesmo servidor onde sua sessão está armazenada.

</Callout>

### Least Connections

Direciona as novas solicitações para o servidor com menos conexões ativas, ajudando a equilibrar melhor a carga.

<Callout type="neutral" title="Vantagem:">

Mais eficiente quando os servidores têm diferentes capacidades ou quando as requisições têm durações muito variadas.

</Callout>

<Callout type="info" title="Simulador Interativo">

Try our interactive load-balancing simulation to see how different algorithms behave in practice.

[Access Simulator](/componentes/load-balancer/simulator)

</Callout>
$mdx$),
  ('components/message-queue', '/componentes/message-queue', 'components', true, 12, NULL, true, 'Message Queues', 'Filas de Mensagens', $mdx$# Message Queues

Message queues are systems used for asynchronous communication between different parts of a system, ensuring that messages can be sent and processed reliably.

### Kafka

A distributed messaging system designed to process large volumes of data in real time. Used in data pipelines and streaming systems.

### RabbitMQ

A message broker that supports a wide variety of messaging patterns, such as queuing and message exchange, used for communication between microservices.

### Amazon SQS

AWS message queue service that offers a scalable and managed queue solution in the cloud.

## Pub/Sub and Queue Systems

### Pub/Sub (Publish/Subscribe)

A pattern where message producers (publishers) send messages to a channel, and consumers (subscribers) subscribe to receive these messages. The Pub/Sub model allows decoupling between producers and consumers.

### Queue Systems

Messages are placed in a queue and processed in FIFO (first-in, first-out) manner, ensuring messages are delivered and processed in the order they were received.

<Callout type="info" title="Interactive Simulator">

Try our interactive message queue simulation to understand asynchronous communication between producers and consumers.

[Access Simulator](/componentes/message-queue/simulator)

</Callout>
$mdx$, $mdx$# Filas de Mensagens

Filas de mensagens são sistemas usados para comunicação assíncrona entre diferentes partes de um sistema, garantindo que mensagens possam ser enviadas e processadas de forma confiável.

### Kafka

Um sistema de mensagens distribuído projetado para processar grandes volumes de dados em tempo real. Usado em pipelines de dados e sistemas de streaming.

### RabbitMQ

Um broker de mensagens que suporta uma ampla variedade de padrões de mensagens, como filas e troca de mensagens, usado para comunicação entre microsserviços.

### Amazon SQS

Serviço de fila de mensagens da AWS, que oferece uma solução de fila escalável e gerenciada na nuvem.

## Pub/Sub e Sistemas de Fila

### Pub/Sub (Publicação/Assinatura)

Um padrão onde os produtores de mensagens (publicadores) enviam mensagens para um canal, e os consumidores (assinantes) se inscrevem para receber essas mensagens. O modelo Pub/Sub permite um desacoplamento entre produtores e consumidores.

### Sistemas de Fila

As mensagens são colocadas em uma fila e processadas de forma FIFO (first-in, first-out), garantindo que as mensagens sejam entregues e processadas na ordem em que foram recebidas.

<Callout type="info" title="Simulador Interativo">

Try our interactive message queue simulation to understand asynchronous communication between producers and consumers.

[Access Simulator](/componentes/message-queue/simulator)

</Callout>
$mdx$),
  ('components/cdn', '/componentes/cdn', 'components', true, 13, NULL, true, 'CDN (Content Delivery Network)', 'CDN (Content Delivery Network)', $mdx$# CDN (Content Delivery Network)

## What is a CDN?

A CDN is a geographically distributed network of servers used to deliver content (such as image files, videos, or web pages) quickly to users. CDNs store copies of content on multiple servers around the world, reducing latency by serving content from a location closer to the user.

## Benefits of Using a CDN

### Latency Reduction

Data is delivered from a server near the user, decreasing response time.

### Load Distribution

The CDN distributes load across multiple servers, preventing overload on central servers.

### Higher Availability

If a server fails, the CDN can redirect traffic to another server, ensuring high availability.

<Callout type="neutral" title="Example:">

Use a CDN like Cloudflare to speed up page loading for a global website.

</Callout>

<Callout type="info" title="Interactive Simulator">

Try our interactive CDN simulation to better understand how geographic distribution affects latency and availability.

[Access Simulator](/componentes/cdn/simulator)

</Callout>
$mdx$, $mdx$# CDN (Content Delivery Network)

## O que é uma CDN?

Uma CDN é uma rede de servidores distribuídos geograficamente, usados para entregar conteúdo (como arquivos de imagem, vídeos ou páginas web) de maneira rápida aos usuários. As CDNs armazenam cópias de conteúdo em diversos servidores ao redor do mundo, reduzindo a latência ao entregar o conteúdo a partir de um local mais próximo do usuário.

## Benefícios de Usar CDN

### Redução de Latência

Os dados são entregues de um servidor próximo ao usuário, diminuindo o tempo de resposta.

### Distribuição de Carga

A CDN distribui a carga entre múltiplos servidores, evitando sobrecarga em servidores centrais.

### Maior Disponibilidade

Caso um servidor falhe, a CDN pode redirecionar o tráfego para outro servidor, garantindo alta disponibilidade.

<Callout type="neutral" title="Exemplo:">

Usar uma CDN como o Cloudflare para acelerar o carregamento de páginas de um site global.

</Callout>

<Callout type="info" title="Simulador Interativo">

Experimente nossa simulação de CDN para entender como a distribuição geográfica afeta latência e disponibilidade.

[Acessar Simulador](/componentes/cdn/simulator)

</Callout>
$mdx$),
  ('components/api-gateway', '/componentes/api-gateway', 'components', true, 14, NULL, true, 'API Gateway', 'API Gateway', $mdx$# API Gateway

Imagine a busy restaurant. You, the customer, place your order with the waiter (API Gateway). He ensures everything works perfectly for you, even if the kitchen is complex and has several specialized cooks.

The API Gateway acts as an intelligent intermediary between clients and backend services, simplifying access, increasing security, and improving overall system performance.

## API Gateway Functions

### Authentication and Authorization

Like security at the restaurant door, it verifies your identity and whether you have permission to enter. The API Gateway checks if the user is logged in and allowed to access the requested resource.

<Callout type="neutral" title="Example:">

To access your online bank account, you enter your username and password. The API Gateway ensures that only you, with the correct credentials, can access your information.

</Callout>

### Routing

It is the waiter who knows exactly which cook (microservice) to send each order to. The API Gateway directs requests to the correct service.

<Callout type="neutral" title="Example:">

In an e-commerce app, a product request can be routed to the inventory service, while payment is routed to the payment processing service.

</Callout>

### Rate Limiting

It is like limiting the number of customers per hour to avoid overload. The API Gateway limits how many requests a client can make to protect backend services.

<Callout type="neutral" title="Example:">

A weather API service can limit the number of requests per user to prevent abuse and ensure availability for everyone.

</Callout>

### Response Aggregation

It is the waiter who organizes all the dishes of your order on a single tray. The API Gateway combines responses from various services into a single response for the client.

<Callout type="neutral" title="Example:">

In a travel app, the API Gateway can aggregate information from flights, hotels, and car rentals from different providers into a single response.

</Callout>

## Example of Microservices-Based Architectures

In a microservices architecture, the API Gateway acts as a central point for clients to interact with microservices. It forwards requests to the correct services and manages communication between the client and system components.

<Callout type="neutral" title="Example:">

In a microservices e-commerce application, the API Gateway handles product, cart, and transaction requests, redirecting to the relevant backend services (product, inventory, payment).

</Callout>
$mdx$, $mdx$# API Gateway

Imagine um restaurante lotado. Você, o cliente, coloca seu pedido com o garçom (API Gateway). Ele garante que tudo funcione perfeitamente para você, mesmo se a cozinha for complexa e tiver vários cozinheiros especializados.

O API Gateway atua como intermediário inteligente entre clientes e serviços de backend, simplificando o acesso, aumentando a segurança e melhorando o desempenho geral do sistema.

## Funções do API Gateway

### Autenticação e Autorização

Como a segurança na porta do restaurante, ele verifica sua identidade e se você tem permissão para entrar. O API Gateway verifica se o usuário está logado e tem permissão para acessar o recurso solicitado.

<Callout type="neutral" title="Exemplo:">

Para acessar sua conta bancária online, você insere seu nome de usuário e senha. O API Gateway garante que apenas você, com as credenciais corretas, possa acessar suas informações.

</Callout>

### Roteamento

É o garçom que sabe exatamente qual cozinheiro (microserviço) enviar cada pedido. O API Gateway direciona as solicitações para o serviço correto.

<Callout type="neutral" title="Exemplo:">

Em um aplicativo de comércio eletrônico, um pedido de produto pode ser roteado para o serviço de inventário, enquanto o pagamento é roteado para o processamento de pagamento.

</Callout>

### Limite de Taxa

É como limitar o número de clientes por hora para evitar sobrecarga. O API Gateway limita quantas solicitações um cliente pode fazer para proteger os serviços de backend.

<Callout type="neutral" title="Exemplo:">

Um serviço de API de clima pode limitar o número de solicitações por usuário para evitar abuso e garantir disponibilidade para todos.

</Callout>

### Agregação de Respostas

É o garçom que organiza todos os pratos de seu pedido em uma única bandeja. O API Gateway combina respostas de vários serviços em uma única resposta para o cliente.

<Callout type="neutral" title="Exemplo:">

Em um aplicativo de viagem, o API Gateway pode agregar informações de voos, hotéis e alugueis de carros de diferentes provedores em uma única resposta.

</Callout>

## Exemplo de Arquiteturas Baseadas em Microserviços

Em uma arquitetura de microserviços, o API Gateway atua como ponto central para clientes interagirem com microserviços. Ele encaminha solicitações para os serviços corretos e gerencia a comunicação entre o cliente e os componentes do sistema.

<Callout type="neutral" title="Exemplo:">

Em um aplicativo de comércio eletrônico baseado em microserviços, o API Gateway lida com solicitações de produtos, carrinhos e transações, redirecionando para os serviços de backend relevantes (produto, inventário, pagamento).

</Callout>
$mdx$),
  ('components/firewall', '/componentes/firewall', 'components', true, 15, NULL, true, 'Firewall', 'Firewall', $mdx$# Firewall

## What is a Firewall?

A Firewall is an essential security component that monitors and controls network traffic based on predefined rules. It acts as a barrier between a trusted network and untrusted networks (such as the Internet), protecting against unauthorized access and cyber threats.

## Main Features

### Packet Filtering

Analyzes and filters network packets based on predefined rules such as IP addresses, ports, and protocols.

### Stateful Inspection

Keeps track of the state of active connections and makes decisions based on the communication context.

### Intrusion Prevention

Detects and blocks attack attempts and malicious behavior on the network.

## Types of Firewall

### Network Firewall

Operates at the network layer, filtering packets based on IP addresses and ports.

### Application Firewall

Analyzes traffic at the application level, offering more granular and specific protection.

<Callout type="neutral" title="Example:">

Configure a firewall to allow only HTTPS traffic (port 443) to a web server, blocking all other ports.

</Callout>

<Callout type="info" title="Interactive Simulator">

Try our interactive Firewall simulation to understand how security rules affect network traffic.

[Access Simulator](/componentes/firewall/simulator)

</Callout>
$mdx$, $mdx$# Firewall

## O que é um Firewall?

Um firewall é um componente de segurança essencial que monitora e controla o tráfego de rede com base em regras predefinidas. Atua como uma barreira entre uma rede confiável e redes não confiáveis (como a Internet), protegendo contra acessos não autorizados e ameaças.

## Principais Funcionalidades

### Filtragem de Pacotes

Analisa e filtra pacotes de rede com base em regras predefinidas, como endereços IP, portas e protocolos.

### Inspeção de Estado

Mantém registro do estado das conexões ativas e toma decisões baseadas no contexto da comunicação.

### Prevenção de Intrusões

Detecta e bloqueia tentativas de ataques e comportamentos maliciosos na rede.

## Tipos de Firewall

### Firewall de Rede

Opera na camada de rede, filtrando pacotes com base em endereços IP e portas.

### Firewall de Aplicação

Analisa o tráfego no nível da aplicação, oferecendo proteção mais granular e específica.

<Callout type="neutral" title="Exemplo:">

Configurar um firewall para permitir apenas tráfego HTTPS (porta 443) para um servidor web, bloqueando todas as outras portas.

</Callout>

<Callout type="info" title="Simulador Interativo">

Experimente nosso simulador de Firewall para entender como regras de segurança afetam o tráfego de rede.

[Acessar Simulador](/componentes/firewall/simulator)

</Callout>
$mdx$),
  ('components/polling-webhooks', '/componentes/polling-webhooks', 'components', true, 16, NULL, true, 'Polling vs Webhooks', 'Polling vs Webhooks', $mdx$# Polling vs Webhooks

Understand the fundamental differences between these two communication strategies

## The Communication Problem

<Callout type="neutral">

Understand the fundamental differences between these two communication strategies

In distributed systems, keeping components synchronized is one of the biggest challenges. How can one service know when something has changed in another? There are two main approaches to solve this problem.

</Callout>

<Cards cols={2}>

<Card title="📤 Polling (Query)" accent="brand">

"I will ask from time to time if there is something new"

</Card>

<Card title="🔔 Webhooks (Notification)" accent="purple">

"Notify me immediately when there is something new"

</Card>

</Cards>

## 📤 Polling (Periodic Query)

### How It Works

Polling involves regularly checking for updates by making requests at specific intervals. It's like asking "Is there anything new?" every few seconds.

<Callout type="neutral" title="Typical Flow:">

1. Cliente envia GET /api/messages?after=timestamp
2. Servidor verifica se há mensagens novas
3. Servidor responde com dados ou "nada novo"
4. Cliente aguarda X segundos e repete

</Callout>

#### Advantages

#### Disadvantages

<Callout type="info" title="💡 When to Use Polling">

</Callout>

## 🔔 Webhooks (Push Notifications)

### How It Works

Webhooks use a push-based approach where the server notifies clients immediately when events occur. It's like having someone call you the moment something happens.

#### Typical Flow:

#### Advantages

#### Disadvantages

<Callout type="neutral" title="💡 When to Use Webhooks">

</Callout>

## ⚖️ Detailed Comparison

| Aspect | 📤 Polling | 🔔 Webhooks |
|--------|-----------|------------|
| Latency | Até o intervalo de polling (ex: 0-30s) | Quase instantânea (&lt; 1s) |
| Bandwidth Usage | Alto (requisições constantes) | Baixo (só quando há dados) |
| Complexity | Baixa | Média/Alta |
| Scalability | Limitada (O(n) requisições) | Excelente (O(1) por evento) |
| Network Requirements | Cliente pode ser privado | Cliente precisa ser acessível |
| Control | Total pelo cliente | Iniciado pelo servidor |
| Debugging | Fácil (fluxo previsível) | Mais complexo |
| Reliability | Alta (retry automático) | Precisa implementar retry |

## 🌍 Real-World Examples

<Cards cols={2}>

<Card title="📤 Use Cases - Polling" accent="brand">

</Card>

<Card title="🔔 Use Cases - Webhooks" accent="purple">

</Card>

</Cards>

## 🛠️ Implementation Considerations

<Cards cols={2}>

<Card title="Implementing Polling" accent="brand">

#### 🔧 Common Strategies

#### ⚠️ Important Considerations

</Card>

<Card title="Implementing Webhooks" accent="purple">

#### 🔒 Essential Security

#### 🔄 Reliability Patterns

</Card>

</Cards>

## 🔄 Hybrid Approaches

<Cards cols={3}>

<Card title="🔄 Fallback Strategy" accent="green">

</Card>

<Card title="⚡ Real-time + Batch" accent="yellow">

</Card>

<Card title="🎯 Context-Aware" accent="slate">

</Card>

</Cards>

<Callout type="info" title="🚀 Ready to See It in Practice?">

Now that you understand the concepts, try our interactive simulator to see the difference in action!

[Access Simulator](/componentes/polling-webhooks/simulator)

</Callout>

[Basic Components](/componentes)
$mdx$, $mdx$# Polling vs Webhooks

Entenda as diferenças fundamentais entre essas duas estratégias de comunicação

## O Problema da Comunicação

<Callout type="neutral">

Entenda as diferenças fundamentais entre essas duas estratégias de comunicação

In distributed systems, keeping components synchronized is one of the biggest challenges. How can one service know when something has changed in another? There are two main approaches to solve this problem.

</Callout>

<Cards cols={2}>

<Card title="📤 Polling (Consulta)" accent="brand">

"Vou perguntar de tempos em tempos se há algo novo"

</Card>

<Card title="🔔 Webhooks (Notificação)" accent="purple">

"Me avise imediatamente quando houver algo novo"

</Card>

</Cards>

## 📤 Polling (Consulta Periódica)

### Como Funciona

Polling involves regularly checking for updates by making requests at specific intervals. It's like asking "Is there anything new?" every few seconds.

<Callout type="neutral" title="Fluxo Típico:">

1. Cliente envia GET /api/messages?after=timestamp
2. Servidor verifica se há mensagens novas
3. Servidor responde com dados ou "nada novo"
4. Cliente aguarda X segundos e repete

</Callout>

#### Vantagens

#### Desvantagens

<Callout type="info" title="💡 Quando Usar Polling">

</Callout>

## 🔔 Webhooks (Notificações Push)

### Como Funciona

Webhooks use a push-based approach where the server notifies clients immediately when events occur. It's like having someone call you the moment something happens.

#### Fluxo Típico:

#### Vantagens

#### Desvantagens

<Callout type="neutral" title="💡 Quando Usar Webhooks">

</Callout>

## ⚖️ Comparação Detalhada

| Aspecto | 📤 Polling | 🔔 Webhooks |
|---------|-----------|------------|
| Latência | Até o intervalo de polling (ex: 0-30s) | Quase instantânea (&lt; 1s) |
| Uso de Banda | Alto (requisições constantes) | Baixo (só quando há dados) |
| Complexidade | Baixa | Média/Alta |
| Escalabilidade | Limitada (O(n) requisições) | Excelente (O(1) por evento) |
| Requisitos de Rede | Cliente pode ser privado | Cliente precisa ser acessível |
| Controle | Total pelo cliente | Iniciado pelo servidor |
| Debugging | Fácil (fluxo previsível) | Mais complexo |
| Reliability | Alta (retry automático) | Precisa implementar retry |

## 🌍 Exemplos do Mundo Real

<Cards cols={2}>

<Card title="📤 Casos de Uso - Polling" accent="brand">

</Card>

<Card title="🔔 Casos de Uso - Webhooks" accent="purple">

</Card>

</Cards>

## 🛠️ Considerações de Implementação

<Cards cols={2}>

<Card title="Implementando Polling" accent="brand">

#### 🔧 Estratégias Comuns

#### ⚠️ Cuidados Importantes

</Card>

<Card title="Implementando Webhooks" accent="purple">

#### 🔒 Segurança Essencial

#### 🔄 Reliability Patterns

</Card>

</Cards>

## 🔄 Abordagens Híbridas

<Cards cols={3}>

<Card title="🔄 Fallback Strategy" accent="green">

</Card>

<Card title="⚡ Real-time + Batch" accent="yellow">

</Card>

<Card title="🎯 Context-Aware" accent="slate">

</Card>

</Cards>

<Callout type="info" title="🚀 Pronto para Ver na Prática?">

Agora que você entende os conceitos, experimente nosso simulador interativo para ver a diferença em ação!

[Acessar Simulador](/componentes/polling-webhooks/simulator)

</Callout>

[Componentes Básicos](/componentes)
$mdx$),
  ('components/vector-database', '/componentes/vector-database', 'components', true, 17, NULL, true, 'Vector Database', 'Banco de Dados Vetorial', $mdx$# Vector Database

A **vector database** stores embeddings — high-dimensional vectors that represent the *meaning* of text, images, or audio — and answers similarity queries over them. It became a first-class system component with the rise of RAG and semantic search.

<Callout type="info" title="💡 What Makes It Different">

A relational database finds rows by exact values. A vector database finds items by **closeness in meaning**: "show me the chunks most similar to this query," even when they share no keywords.

</Callout>

## Where It Fits

A vector DB sits beside your primary store, not instead of it. Documents are chunked, embedded, and indexed; at query time the app embeds the question, retrieves the nearest chunks, and passes them to the LLM.

<Cards cols={3}>

<Card title="Stores" accent="brand">

Vectors plus metadata (source, timestamps, tenant, tags) for filtering.

</Card>

<Card title="Indexes" accent="purple">

An ANN index (usually HNSW) for fast approximate nearest-neighbor search.

</Card>

<Card title="Serves" accent="green">

Top-K similarity queries, often with metadata filters and hybrid keyword search.

</Card>

</Cards>

## Key Capabilities

<Cards cols={2}>

<Card title="Must-Haves" accent="green">

- Approximate nearest-neighbor search (HNSW/IVF)
- Metadata filtering (tenant, date, source)
- Upserts and deletes for fresh data
- Hybrid (vector + keyword) search

</Card>

<Card title="At Scale" accent="brand">

- Sharding across nodes for billions of vectors
- Replication for availability
- Quantization to fit memory budgets
- Multi-tenancy isolation

</Card>

</Cards>

## Options

<Cards cols={3}>

<Card title="Embedded / SQL" accent="brand">

`pgvector` (Postgres), SQLite extensions — simplest if you already run the database.

</Card>

<Card title="Dedicated" accent="purple">

Pinecone, Qdrant, Weaviate, Milvus — purpose-built for vector workloads at scale.

</Card>

<Card title="Search Engines" accent="green">

Elasticsearch / OpenSearch — vectors alongside mature lexical search and filtering.

</Card>

</Cards>

<Callout type="warning" title="Common Pitfalls">

- **Stale index**: documents changed but embeddings didn't — schedule incremental re-indexing.
- **Wrong distance metric**: cosine vs dot vs L2 must match how the embedding model was trained.
- **Ignoring metadata filters**: filtering before/after ANN dramatically changes recall and cost.

</Callout>

## Related

This component powers [RAG](/sistemas-ia/rag) and is searched using the techniques in [Vector Search](/sistemas-ia/vector-search). It complements, rather than replaces, your [cache](/componentes/cache) and [database](/componentes/banco-dados).
$mdx$, $mdx$# Banco de Dados Vetorial

Um **banco de dados vetorial** armazena embeddings — vetores de alta dimensão que representam o *significado* de texto, imagens ou áudio — e responde consultas de similaridade sobre eles. Ele se tornou um componente de primeira classe com a ascensão do RAG e da busca semântica.

<Callout type="info" title="💡 O Que o Torna Diferente">

Um banco relacional encontra linhas por valores exatos. Um banco vetorial encontra itens por **proximidade de significado**: "mostre-me os trechos mais similares a esta consulta", mesmo quando não compartilham palavras-chave.

</Callout>

## Onde Ele Se Encaixa

Um banco vetorial fica ao lado do seu armazenamento principal, não no lugar dele. Documentos são fragmentados, embeddados e indexados; na consulta, a aplicação embedda a pergunta, recupera os trechos mais próximos e os passa ao LLM.

<Cards cols={3}>

<Card title="Armazena" accent="brand">

Vetores mais metadados (origem, timestamps, tenant, tags) para filtragem.

</Card>

<Card title="Indexa" accent="purple">

Um índice ANN (geralmente HNSW) para busca rápida de vizinhos mais próximos aproximados.

</Card>

<Card title="Serve" accent="green">

Consultas de similaridade top-K, muitas vezes com filtros de metadados e busca híbrida por palavra-chave.

</Card>

</Cards>

## Capacidades Principais

<Cards cols={2}>

<Card title="Essenciais" accent="green">

- Busca de vizinhos mais próximos aproximados (HNSW/IVF)
- Filtragem por metadados (tenant, data, origem)
- Upserts e deletes para dados atualizados
- Busca híbrida (vetor + palavra-chave)

</Card>

<Card title="Em Escala" accent="brand">

- Sharding entre nós para bilhões de vetores
- Replicação para disponibilidade
- Quantização para caber no orçamento de memória
- Isolamento multi-tenant

</Card>

</Cards>

## Opções

<Cards cols={3}>

<Card title="Embutido / SQL" accent="brand">

`pgvector` (Postgres), extensões do SQLite — o mais simples se você já roda o banco.

</Card>

<Card title="Dedicado" accent="purple">

Pinecone, Qdrant, Weaviate, Milvus — feitos sob medida para cargas vetoriais em escala.

</Card>

<Card title="Motores de Busca" accent="green">

Elasticsearch / OpenSearch — vetores ao lado de busca léxica madura e filtragem.

</Card>

</Cards>

<Callout type="warning" title="Armadilhas Comuns">

- **Índice desatualizado**: documentos mudaram, mas os embeddings não — agende reindexação incremental.
- **Métrica de distância errada**: cosseno vs produto interno vs L2 deve combinar com como o modelo de embedding foi treinado.
- **Ignorar filtros de metadados**: filtrar antes/depois da ANN muda drasticamente recall e custo.

</Callout>

## Relacionados

Este componente sustenta o [RAG](/sistemas-ia/rag) e é consultado com as técnicas de [Busca Vetorial](/sistemas-ia/vector-search). Ele complementa, em vez de substituir, o seu [cache](/componentes/cache) e o seu [banco de dados](/componentes/banco-dados).
$mdx$),
  ('components/model-gateway', '/componentes/model-gateway', 'components', true, 18, NULL, true, 'Model Gateway', 'Gateway de Modelos', $mdx$# Model Gateway

A **model gateway** is the infrastructure component that fronts your LLMs, just as an API gateway fronts your microservices. Every application call to a model goes through it, so it's where you centralize routing, caching, resilience, limits, and cost.

<Callout type="info" title="💡 One Door to Every Model">

Instead of each service holding provider API keys and reimplementing retries, the gateway exposes one stable API and hides which model or provider actually serves the request.

</Callout>

## Responsibilities

<Cards cols={2}>

<Card title="Traffic" accent="brand">

- Unified API across providers and models
- Routing by cost, capability, tenant, or prompt
- Streaming token responses
- A/B tests and gradual model rollouts

</Card>

<Card title="Reliability & Governance" accent="green">

- Retries, timeouts, fallback chains, circuit breakers
- Exact and semantic caching
- Rate limits and token budgets per key
- Cost accounting, logging, and audit

</Card>

</Cards>

## Why It's a Component, Not a Library

Putting these concerns in a shared service (rather than a per-app library) means:

<Cards cols={3}>

<Card title="Consistency" accent="brand">

One place defines routing, limits, and fallback — every team gets the same behavior.

</Card>

<Card title="Control" accent="purple">

Change models or providers centrally without redeploying every consumer.

</Card>

<Card title="Visibility" accent="green">

All LLM spend and traffic flow through one chokepoint you can observe and govern.

</Card>

</Cards>

<Callout type="warning" title="It's a Single Point of Failure">

Because every model call depends on it, the gateway must be highly available: run multiple replicas, keep its own logic fast and stateless, and ensure a gateway outage degrades gracefully rather than taking down every feature.

</Callout>

## Related

The model gateway implements the patterns in [LLM Gateway](/sistemas-ia/llm-gateway), reuses ideas from the [API Gateway](/componentes/api-gateway), and leans on [circuit breakers](/principios-design/tolerancia-falhas/circuit-breaker) and [rate limiting](/componentes/api-gateway) for resilience.
$mdx$, $mdx$# Gateway de Modelos

Um **gateway de modelos** é o componente de infraestrutura que fica na frente dos seus LLMs, assim como um API gateway fica na frente dos seus microsserviços. Toda chamada de aplicação a um modelo passa por ele, então é ali que você centraliza roteamento, cache, resiliência, limites e custo.

<Callout type="info" title="💡 Uma Porta para Todo Modelo">

Em vez de cada serviço guardar chaves de API de provedores e reimplementar retries, o gateway expõe uma API estável e esconde qual modelo ou provedor realmente atende a requisição.

</Callout>

## Responsabilidades

<Cards cols={2}>

<Card title="Tráfego" accent="brand">

- API unificada entre provedores e modelos
- Roteamento por custo, capacidade, tenant ou prompt
- Respostas com streaming de tokens
- Testes A/B e rollouts graduais de modelos

</Card>

<Card title="Confiabilidade e Governança" accent="green">

- Retries, timeouts, cadeias de fallback, circuit breakers
- Cache exato e semântico
- Limites de taxa e orçamentos de tokens por chave
- Contabilidade de custo, logging e auditoria

</Card>

</Cards>

## Por Que É um Componente, Não uma Biblioteca

Colocar essas preocupações em um serviço compartilhado (em vez de uma biblioteca por aplicação) significa:

<Cards cols={3}>

<Card title="Consistência" accent="brand">

Um único lugar define roteamento, limites e fallback — toda equipe tem o mesmo comportamento.

</Card>

<Card title="Controle" accent="purple">

Troque modelos ou provedores centralmente sem reimplantar cada consumidor.

</Card>

<Card title="Visibilidade" accent="green">

Todo o gasto e tráfego de LLM passa por um único ponto que você pode observar e governar.

</Card>

</Cards>

<Callout type="warning" title="É um Ponto Único de Falha">

Como toda chamada de modelo depende dele, o gateway precisa ser altamente disponível: rode várias réplicas, mantenha sua lógica rápida e sem estado e garanta que uma queda do gateway degrade graciosamente em vez de derrubar toda funcionalidade.

</Callout>

## Relacionados

O gateway de modelos implementa os padrões de [Gateway de LLM](/sistemas-ia/llm-gateway), reaproveita ideias do [API Gateway](/componentes/api-gateway) e se apoia em [circuit breakers](/principios-design/tolerancia-falhas/circuit-breaker) e [limitação de taxa](/componentes/api-gateway) para resiliência.
$mdx$),
  ('components/kafka-streaming', '/componentes/kafka', 'components', true, 19, NULL, true, 'Kafka & Event Streaming', 'Kafka e Streaming de Eventos', $mdx$# Kafka & Event Streaming

A traditional message queue deletes a message once it's consumed. **Apache Kafka** flips that model: it's a **durable, replayable log**. Events are appended to the end and kept for a retention window, so many consumers can read the same stream at their own pace — even re-reading from the past.

<Callout type="info" title="💡 Log, not queue">

Think of Kafka as an append-only file that many readers share. Each reader tracks its own **offset** (position). Consuming doesn't remove data — it just advances your bookmark.

</Callout>

## The core concepts

<Cards cols={2}>

<Card title="Topic & Partitions" accent="brand">

A **topic** is a named stream, split into **partitions**. Each partition is an ordered, append-only log. Partitions are the unit of parallelism and ordering.

</Card>

<Card title="Producers" accent="purple">

Append records to a topic. A record's **key** decides its partition (same key → same partition → ordered), so related events stay in order.

</Card>

<Card title="Consumer Groups" accent="green">

Consumers join a **group**; Kafka assigns each partition to exactly one consumer in the group. Add consumers to scale — up to the partition count.

</Card>

<Card title="Offsets & Retention" accent="brand">

Each consumer group commits the offset it has processed. Messages persist for a retention period regardless of consumption, enabling replay.

</Card>

</Cards>

## Why partitions cap parallelism

<Callout type="warning" title="The partition limit">

A partition is consumed by **exactly one** consumer in a group at a time. If a topic has 4 partitions and you run 6 consumers, **2 sit idle**. To go faster, you must add partitions — but partition count is hard to shrink, so plan ahead.

</Callout>

## Consumer lag

**Lag** is how far behind a consumer group is: `latest offset − committed offset`. When producers outpace consumers, lag grows and data gets "older" before it's processed.

<Cards cols={2}>

<Card title="Lag grows when…" accent="red">

- Produce rate > total consume rate
- A consumer is slow, stuck, or crashed
- Too few partitions to parallelize across

</Card>

<Card title="Fix lag by…" accent="green">

- Adding consumers (up to partition count)
- Adding partitions for more parallelism
- Making per-message processing faster
- Batching and tuning fetch sizes

</Card>

</Cards>

<Callout type="success" title="Try It: Kafka Simulator">

Tune partitions, consumers, and produce/consume rates, then watch consumer lag build or drain — and see idle consumers when you exceed the partition count — in the [Kafka Simulator](/componentes/kafka/simulator).

</Callout>

## When to reach for streaming

<Callout type="neutral" title="Good fits">

Event sourcing, change-data-capture, log/metric pipelines, decoupling microservices, and feeding real-time analytics or stream processors (Kafka Streams, Flink). For simple point-to-point task queues with delete-on-ack semantics, a classic queue (SQS/RabbitMQ) is often simpler.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Kafka is a durable, replayable log — not a delete-on-read queue
- Partitions provide ordering *and* parallelism
- Lag is the key health signal for consumers

</Card>

<Card title="Design For" accent="brand">

- Choose partition keys that preserve needed ordering
- Provision enough partitions for peak parallelism
- Monitor consumer lag and alert on growth

</Card>

</Cards>
$mdx$, $mdx$# Kafka e Streaming de Eventos

Uma fila de mensagens tradicional apaga a mensagem assim que ela é consumida. O **Apache Kafka** inverte esse modelo: ele é um **log durável e reproduzível**. Eventos são anexados ao fim e mantidos por uma janela de retenção, então muitos consumidores podem ler o mesmo stream no seu próprio ritmo — até relendo o passado.

<Callout type="info" title="💡 Log, não fila">

Pense no Kafka como um arquivo append-only compartilhado por muitos leitores. Cada leitor controla seu próprio **offset** (posição). Consumir não remove dados — só avança seu marcador.

</Callout>

## Os conceitos centrais

<Cards cols={2}>

<Card title="Tópico e Partições" accent="brand">

Um **tópico** é um stream nomeado, dividido em **partições**. Cada partição é um log ordenado e append-only. Partições são a unidade de paralelismo e de ordenação.

</Card>

<Card title="Produtores" accent="purple">

Anexam registros a um tópico. A **chave** de um registro decide sua partição (mesma chave → mesma partição → ordenado), então eventos relacionados ficam em ordem.

</Card>

<Card title="Consumer Groups" accent="green">

Consumidores entram em um **group**; o Kafka atribui cada partição a exatamente um consumidor do grupo. Adicione consumidores para escalar — até o número de partições.

</Card>

<Card title="Offsets e Retenção" accent="brand">

Cada consumer group faz commit do offset que processou. Mensagens persistem por um período de retenção independente do consumo, permitindo replay.

</Card>

</Cards>

## Por que partições limitam o paralelismo

<Callout type="warning" title="O limite das partições">

Uma partição é consumida por **exatamente um** consumidor de um grupo por vez. Se um tópico tem 4 partições e você roda 6 consumidores, **2 ficam ociosos**. Para ir mais rápido, você precisa adicionar partições — mas reduzir partições é difícil, então planeje com antecedência.

</Callout>

## Consumer lag

**Lag** é o quanto um consumer group está atrasado: `último offset − offset commitado`. Quando produtores superam consumidores, o lag cresce e os dados ficam "mais velhos" antes de serem processados.

<Cards cols={2}>

<Card title="O lag cresce quando…" accent="red">

- Taxa de produção > taxa total de consumo
- Um consumidor está lento, travado ou caiu
- Poucas partições para paralelizar

</Card>

<Card title="Corrija o lag…" accent="green">

- Adicionando consumidores (até o número de partições)
- Adicionando partições para mais paralelismo
- Tornando o processamento por mensagem mais rápido
- Ajustando batches e tamanhos de fetch

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Kafka">

Ajuste partições, consumidores e taxas de produção/consumo, e veja o consumer lag crescer ou drenar — e os consumidores ociosos quando você ultrapassa o número de partições — no [Simulador de Kafka](/componentes/kafka/simulator).

</Callout>

## Quando usar streaming

<Callout type="neutral" title="Bons usos">

Event sourcing, change-data-capture, pipelines de logs/métricas, desacoplamento de microsserviços e alimentação de analytics em tempo real ou processadores de stream (Kafka Streams, Flink). Para filas ponto-a-ponto simples com semântica de apagar-no-ack, uma fila clássica (SQS/RabbitMQ) costuma ser mais simples.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Kafka é um log durável e reproduzível — não uma fila apaga-ao-ler
- Partições oferecem ordenação *e* paralelismo
- Lag é o principal sinal de saúde dos consumidores

</Card>

<Card title="Projete para" accent="brand">

- Escolha chaves de partição que preservem a ordenação necessária
- Provisione partições suficientes para o paralelismo de pico
- Monitore o consumer lag e alerte sobre crescimento

</Card>

</Cards>
$mdx$),
  ('components/dns', '/componentes/dns', 'components', true, 20, NULL, true, 'DNS — The Distributed Phone Book', 'DNS — A Lista Telefônica Distribuída', $mdx$# DNS — The Distributed Phone Book

Humans remember `example.com`; machines need `93.184.216.34`. **DNS** (Domain Name System) is the globally distributed, hierarchical database that translates names into addresses — billions of times a second.

<Callout type="info" title="💡 A hierarchy, not a single server">

No one machine holds all of DNS. It's a tree: **root** servers point to **TLD** servers (`.com`, `.org`), which point to **authoritative** servers for each domain. Resolution walks down this tree.

</Callout>

## How a lookup works

<Cards cols={4}>

<Card title="1. Resolver" accent="brand">

Your device asks a **recursive resolver** (often your ISP's or `8.8.8.8`) to do the work.

</Card>

<Card title="2. Root → TLD" accent="purple">

The resolver asks a root server, which refers it to the `.com` TLD server.

</Card>

<Card title="3. Authoritative" accent="green">

The TLD refers it to the domain's authoritative server, which returns the record.

</Card>

<Card title="4. Cache" accent="brand">

The answer is cached at every hop based on its **TTL**, so the next lookup is instant.

</Card>

</Cards>

## Common record types

<Callout type="neutral" title="The records you'll meet">

- **A / AAAA** — name → IPv4 / IPv6 address
- **CNAME** — alias of one name to another
- **MX** — mail servers for a domain
- **TXT** — arbitrary text (SPF, domain verification)
- **NS** — which servers are authoritative for the zone

</Callout>

## DNS as an infrastructure tool

Because DNS sits in front of everything and is heavily cached, it's also a **load-balancing and failover** tool.

<Cards cols={2}>

<Card title="Traffic steering" accent="brand">

Return different IPs by geography (GeoDNS), in round-robin, or weighted, to spread load or route users to the nearest region.

</Card>

<Card title="Failover" accent="purple">

Health-checked DNS can stop handing out a dead endpoint's address — though TTL caching delays how fast clients notice.

</Card>

</Cards>

<Callout type="warning" title="The TTL tradeoff">

Low TTL = fast failover but more DNS traffic and less caching benefit. High TTL = great caching but slow to react to changes. Pick per how often the record changes.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- DNS is a cached, hierarchical name → address database
- Caching (TTL) makes it fast but slows propagation of changes
- It doubles as a coarse load-balancer and failover layer

</Card>

<Card title="Design For" accent="brand">

- Set TTLs to match your change/failover needs
- Don't rely on DNS alone for fast failover
- Use health-checked, geo-aware DNS for global apps

</Card>

</Cards>
$mdx$, $mdx$# DNS — A Lista Telefônica Distribuída

Humanos lembram `example.com`; máquinas precisam de `93.184.216.34`. O **DNS** (Domain Name System) é o banco de dados hierárquico e distribuído globalmente que traduz nomes em endereços — bilhões de vezes por segundo.

<Callout type="info" title="💡 Uma hierarquia, não um servidor único">

Nenhuma máquina guarda todo o DNS. É uma árvore: servidores **root** apontam para servidores **TLD** (`.com`, `.org`), que apontam para servidores **autoritativos** de cada domínio. A resolução desce por essa árvore.

</Callout>

## Como funciona uma busca

<Cards cols={4}>

<Card title="1. Resolver" accent="brand">

Seu dispositivo pede a um **resolver recursivo** (em geral do seu provedor ou `8.8.8.8`) que faça o trabalho.

</Card>

<Card title="2. Root → TLD" accent="purple">

O resolver pergunta a um servidor root, que o encaminha ao servidor TLD `.com`.

</Card>

<Card title="3. Autoritativo" accent="green">

O TLD o encaminha ao servidor autoritativo do domínio, que retorna o registro.

</Card>

<Card title="4. Cache" accent="brand">

A resposta é cacheada em cada salto conforme seu **TTL**, então a próxima busca é instantânea.

</Card>

</Cards>

## Tipos de registro comuns

<Callout type="neutral" title="Os registros que você vai encontrar">

- **A / AAAA** — nome → endereço IPv4 / IPv6
- **CNAME** — alias de um nome para outro
- **MX** — servidores de e-mail de um domínio
- **TXT** — texto arbitrário (SPF, verificação de domínio)
- **NS** — quais servidores são autoritativos para a zona

</Callout>

## DNS como ferramenta de infraestrutura

Como o DNS fica na frente de tudo e é muito cacheado, ele também é uma ferramenta de **balanceamento de carga e failover**.

<Cards cols={2}>

<Card title="Direcionamento de tráfego" accent="brand">

Retorne IPs diferentes por geografia (GeoDNS), em round-robin ou ponderado, para espalhar carga ou rotear usuários à região mais próxima.

</Card>

<Card title="Failover" accent="purple">

DNS com health-check pode parar de entregar o endereço de um endpoint morto — embora o cache de TTL atrase a percepção dos clientes.

</Card>

</Cards>

<Callout type="warning" title="O tradeoff do TTL">

TTL baixo = failover rápido, mas mais tráfego de DNS e menos benefício de cache. TTL alto = ótimo cache, mas reação lenta a mudanças. Escolha conforme a frequência de mudança do registro.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- DNS é um banco hierárquico e cacheado de nome → endereço
- O cache (TTL) o torna rápido, mas atrasa a propagação de mudanças
- Ele também serve como balanceador grosseiro e camada de failover

</Card>

<Card title="Projete para" accent="brand">

- Defina TTLs conforme suas necessidades de mudança/failover
- Não dependa só do DNS para failover rápido
- Use DNS com health-check e geo-aware para apps globais

</Card>

</Cards>
$mdx$),
  ('components/reverse-proxy', '/componentes/reverse-proxy', 'components', true, 21, NULL, true, 'Reverse Proxy', 'Reverse Proxy', $mdx$# Reverse Proxy

A **reverse proxy** sits in front of your servers and receives client requests on their behalf. Clients talk to the proxy; the proxy talks to your backends. It's the "front door" of most web systems (nginx, Envoy, HAProxy, cloud load balancers).

<Callout type="info" title="💡 Forward vs reverse">

A **forward proxy** acts on behalf of *clients* (hiding who's making requests). A **reverse proxy** acts on behalf of *servers* (hiding the backend topology). Same machinery, opposite direction.

</Callout>

## What it does

<Cards cols={2}>

<Card title="TLS termination" accent="brand">

Decrypt HTTPS once at the edge so backends can speak plain HTTP internally — centralizing certificates and crypto cost.

</Card>

<Card title="Routing" accent="purple">

Send `/api` to one service and `/static` to another, or route by host header — path/host-based routing in one place.

</Card>

<Card title="Load balancing" accent="green">

Spread requests across backend replicas (round-robin, least-connections, hashing) and remove unhealthy ones.

</Card>

<Card title="Caching & compression" accent="brand">

Serve cached responses and gzip/brotli-compress on the fly, offloading work from backends.

</Card>

</Cards>

## Why front everything with one

<Callout type="neutral" title="A single point of control">

Cross-cutting concerns — TLS, auth, rate limiting, headers, observability, retries — live in the proxy instead of being re-implemented in every service. Backends stay simple and stay hidden.

</Callout>

## Reverse proxy vs related components

<Cards cols={3}>

<Card title="vs Load Balancer" accent="brand">

A load balancer is one *job* of a reverse proxy. Many reverse proxies load-balance; many L7 load balancers are reverse proxies. The terms overlap.

</Card>

<Card title="vs API Gateway" accent="purple">

An API gateway is a reverse proxy specialized for APIs: auth, quotas, request shaping, and aggregation on top of routing.

</Card>

<Card title="vs CDN" accent="green">

A CDN is a globally distributed reverse-proxy cache living close to users for static and cacheable content.

</Card>

</Cards>

<Callout type="warning" title="Mind the single point of failure">

Everything flows through the proxy, so it must be highly available — run multiple instances behind DNS or an L4 load balancer, and watch its resource limits and connection counts.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- A reverse proxy is the server-side front door
- It centralizes TLS, routing, LB, caching, and policy
- It overlaps with load balancers, gateways, and CDNs

</Card>

<Card title="Design For" accent="brand">

- Make the proxy tier highly available
- Push cross-cutting concerns into it, not every service
- Terminate TLS and enforce limits at the edge

</Card>

</Cards>
$mdx$, $mdx$# Reverse Proxy

Um **reverse proxy** fica na frente dos seus servidores e recebe as requisições dos clientes em nome deles. Clientes falam com o proxy; o proxy fala com seus backends. É a "porta de entrada" da maioria dos sistemas web (nginx, Envoy, HAProxy, load balancers de nuvem).

<Callout type="info" title="💡 Forward vs reverse">

Um **forward proxy** age em nome dos *clientes* (escondendo quem faz as requisições). Um **reverse proxy** age em nome dos *servidores* (escondendo a topologia do backend). Mesma mecânica, direção oposta.

</Callout>

## O que ele faz

<Cards cols={2}>

<Card title="Terminação TLS" accent="brand">

Descriptografa HTTPS uma vez na borda para que os backends usem HTTP simples internamente — centralizando certificados e custo de criptografia.

</Card>

<Card title="Roteamento" accent="purple">

Envia `/api` para um serviço e `/static` para outro, ou roteia por host header — roteamento por path/host num só lugar.

</Card>

<Card title="Balanceamento de carga" accent="green">

Espalha requisições entre réplicas de backend (round-robin, least-connections, hashing) e remove as não saudáveis.

</Card>

<Card title="Cache e compressão" accent="brand">

Serve respostas em cache e comprime com gzip/brotli em tempo real, aliviando o trabalho dos backends.

</Card>

</Cards>

## Por que colocar um na frente de tudo

<Callout type="neutral" title="Um único ponto de controle">

Preocupações transversais — TLS, auth, rate limiting, headers, observabilidade, retries — vivem no proxy em vez de serem reimplementadas em cada serviço. Os backends ficam simples e escondidos.

</Callout>

## Reverse proxy vs componentes relacionados

<Cards cols={3}>

<Card title="vs Load Balancer" accent="brand">

Um load balancer é uma *função* de um reverse proxy. Muitos reverse proxies balanceiam carga; muitos load balancers L7 são reverse proxies. Os termos se sobrepõem.

</Card>

<Card title="vs API Gateway" accent="purple">

Um API gateway é um reverse proxy especializado em APIs: auth, cotas, modelagem de requisições e agregação sobre o roteamento.

</Card>

<Card title="vs CDN" accent="green">

Uma CDN é um cache de reverse-proxy distribuído globalmente, próximo dos usuários, para conteúdo estático e cacheável.

</Card>

</Cards>

<Callout type="warning" title="Atenção ao ponto único de falha">

Tudo passa pelo proxy, então ele precisa ser altamente disponível — rode múltiplas instâncias atrás de DNS ou de um load balancer L4, e observe seus limites de recursos e contagem de conexões.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Um reverse proxy é a porta de entrada do lado do servidor
- Ele centraliza TLS, roteamento, LB, cache e políticas
- Ele se sobrepõe a load balancers, gateways e CDNs

</Card>

<Card title="Projete para" accent="brand">

- Torne a camada de proxy altamente disponível
- Empurre preocupações transversais para ele, não para cada serviço
- Termine TLS e aplique limites na borda

</Card>

</Cards>
$mdx$),
  ('components/service-discovery', '/componentes/service-discovery', 'components', true, 22, NULL, true, 'Service Discovery', 'Service Discovery', $mdx$# Service Discovery

In a static world you hardcode `payments.internal:8080`. In a dynamic world — autoscaling, containers, rolling deploys — instances come and go with **changing IPs** every few minutes. **Service discovery** is how services find each other's current addresses automatically.

<Callout type="info" title="💡 The problem">

You can't hardcode an address that changes. You need a live registry: "Where are the healthy instances of `payments` right now?"

</Callout>

## The registry

At the center is a **service registry** — a database of `service name → healthy instances`. Instances **register** on startup, send **heartbeats**, and are evicted when they fail health checks.

<Cards cols={3}>

<Card title="1. Register" accent="brand">

On boot, an instance announces its address and port to the registry.

</Card>

<Card title="2. Health check" accent="purple">

The registry (or the instance) reports liveness; unhealthy instances are removed.

</Card>

<Card title="3. Discover" accent="green">

Clients query the registry for the current healthy set before routing a request.

</Card>

</Cards>

## Two discovery patterns

<Cards cols={2}>

<Card title="Client-side discovery" accent="brand">

The client queries the registry and picks an instance itself (then load-balances locally). Fewer hops, but every client needs discovery logic. *Example: Netflix Eureka + Ribbon.*

</Card>

<Card title="Server-side discovery" accent="purple">

The client hits a stable endpoint (load balancer / proxy) that consults the registry and forwards. Clients stay dumb; the platform does the work. *Example: Kubernetes Services, AWS ALB.*

</Card>

</Cards>

## How it shows up in practice

<Callout type="neutral" title="You've already used it">

- **Kubernetes**: a `Service` gives a stable virtual IP/DNS name; kube-proxy/endpoints track the live pods behind it.
- **Consul / etcd / ZooKeeper**: general-purpose registries with health checking and watches.
- **DNS-based**: services resolve a name to the current instance set (with short TTLs).

</Callout>

<Callout type="warning" title="Stale data is the enemy">

The registry must converge fast when instances die — otherwise clients route to ghosts. Combine health checks, short TTLs, and retries/circuit breakers so a stale entry degrades gracefully.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Dynamic fleets need a live registry, not hardcoded IPs
- Client-side vs server-side discovery trade simplicity for control
- Health checks keep the registry honest

</Card>

<Card title="Design For" accent="brand">

- Register on start, deregister/evict on failure
- Keep discovery data fresh with heartbeats and TTLs
- Pair with retries and circuit breakers for stale entries

</Card>

</Cards>
$mdx$, $mdx$# Service Discovery

Num mundo estático você fixa `payments.internal:8080` no código. Num mundo dinâmico — autoscaling, containers, deploys contínuos — instâncias surgem e somem com **IPs mudando** a cada poucos minutos. **Service discovery** é como serviços encontram os endereços atuais uns dos outros automaticamente.

<Callout type="info" title="💡 O problema">

Você não pode fixar um endereço que muda. Você precisa de um registro ao vivo: "Onde estão as instâncias saudáveis de `payments` agora?"

</Callout>

## O registro

No centro está um **service registry** — um banco de `nome do serviço → instâncias saudáveis`. Instâncias se **registram** ao iniciar, enviam **heartbeats** e são removidas quando falham nos health checks.

<Cards cols={3}>

<Card title="1. Registrar" accent="brand">

Ao iniciar, uma instância anuncia seu endereço e porta ao registro.

</Card>

<Card title="2. Health check" accent="purple">

O registro (ou a instância) reporta vivacidade; instâncias não saudáveis são removidas.

</Card>

<Card title="3. Descobrir" accent="green">

Clientes consultam o registro pelo conjunto saudável atual antes de rotear uma requisição.

</Card>

</Cards>

## Dois padrões de discovery

<Cards cols={2}>

<Card title="Discovery no cliente" accent="brand">

O cliente consulta o registro e escolhe uma instância (e balanceia carga localmente). Menos saltos, mas todo cliente precisa da lógica de discovery. *Exemplo: Netflix Eureka + Ribbon.*

</Card>

<Card title="Discovery no servidor" accent="purple">

O cliente acessa um endpoint estável (load balancer / proxy) que consulta o registro e encaminha. Clientes ficam simples; a plataforma faz o trabalho. *Exemplo: Kubernetes Services, AWS ALB.*

</Card>

</Cards>

## Como aparece na prática

<Callout type="neutral" title="Você já usou">

- **Kubernetes**: um `Service` dá um IP/nome DNS virtual estável; kube-proxy/endpoints rastreiam os pods vivos por trás dele.
- **Consul / etcd / ZooKeeper**: registros de propósito geral com health checking e watches.
- **Baseado em DNS**: serviços resolvem um nome para o conjunto atual de instâncias (com TTLs curtos).

</Callout>

<Callout type="warning" title="Dados obsoletos são o inimigo">

O registro precisa convergir rápido quando instâncias morrem — senão clientes roteiam para fantasmas. Combine health checks, TTLs curtos e retries/circuit breakers para que uma entrada obsoleta degrade graciosamente.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Frotas dinâmicas precisam de um registro ao vivo, não IPs fixos
- Discovery no cliente vs no servidor troca simplicidade por controle
- Health checks mantêm o registro honesto

</Card>

<Card title="Projete para" accent="brand">

- Registre ao iniciar, desregistre/remova ao falhar
- Mantenha os dados de discovery atuais com heartbeats e TTLs
- Combine com retries e circuit breakers para entradas obsoletas

</Card>

</Cards>
$mdx$),
  ('components/service-mesh', '/componentes/service-mesh', 'components', true, 23, NULL, true, 'Service Mesh', 'Service Mesh', $mdx$# Service Mesh

As microservices multiply, every service re-implements the same plumbing: retries, timeouts, mTLS, load balancing, tracing. A **service mesh** moves all of that *out of your code* and into a dedicated infrastructure layer of **sidecar proxies**.

<Callout type="info" title="💡 The sidecar idea">

Next to each service instance runs a small proxy (e.g. Envoy). Your app talks only to its local proxy; the proxies talk to each other. They form the **data plane** that carries all service-to-service traffic.

</Callout>

## Data plane vs control plane

<Cards cols={2}>

<Card title="Data plane" accent="brand">

The mesh of sidecar proxies that actually move requests — applying routing, retries, encryption, and collecting metrics on every hop.

</Card>

<Card title="Control plane" accent="purple">

The brain (e.g. Istio's istiod) that configures all the proxies: pushing policy, certificates, and routing rules. It doesn't touch request data.

</Card>

</Cards>

## What you get for free

<Cards cols={3}>

<Card title="Traffic management" accent="brand">

Canary releases, traffic splitting, retries, timeouts, and circuit breaking — configured declaratively, no code changes.

</Card>

<Card title="Security" accent="purple">

Automatic **mTLS** between services, identity-based authorization, and encryption in transit by default.

</Card>

<Card title="Observability" accent="green">

Uniform metrics, distributed traces, and access logs for every call — because the proxy sees all traffic.

</Card>

</Cards>

## The tradeoff

<Callout type="warning" title="Power has a price">

A mesh adds a proxy hop (latency), real resource overhead (a sidecar per pod), and significant operational complexity. For a handful of services, libraries or a gateway are simpler. Reach for a mesh when you have *many* services and need consistent security/observability across all of them.

</Callout>

## Mesh vs API gateway

<Callout type="neutral" title="North-south vs east-west">

An **API gateway** handles **north-south** traffic (clients → your system) at the edge. A **service mesh** handles **east-west** traffic (service → service) inside the system. They're complementary, not competitors.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- A mesh moves networking concerns into sidecar proxies
- Data plane carries traffic; control plane configures it
- You get mTLS, traffic control, and observability without app changes

</Card>

<Card title="Design For" accent="brand">

- Adopt a mesh when service count justifies the overhead
- Budget for the latency and resource cost of sidecars
- Use it for east-west; keep a gateway for north-south

</Card>

</Cards>
$mdx$, $mdx$# Service Mesh

Conforme os microsserviços se multiplicam, cada serviço reimplementa o mesmo encanamento: retries, timeouts, mTLS, balanceamento de carga, tracing. Um **service mesh** tira tudo isso *do seu código* e coloca numa camada de infraestrutura dedicada de **proxies sidecar**.

<Callout type="info" title="💡 A ideia do sidecar">

Ao lado de cada instância de serviço roda um pequeno proxy (ex.: Envoy). Sua aplicação fala apenas com o proxy local; os proxies falam entre si. Eles formam o **data plane** que carrega todo o tráfego serviço-a-serviço.

</Callout>

## Data plane vs control plane

<Cards cols={2}>

<Card title="Data plane" accent="brand">

A malha de proxies sidecar que de fato move as requisições — aplicando roteamento, retries, criptografia e coletando métricas em cada salto.

</Card>

<Card title="Control plane" accent="purple">

O cérebro (ex.: istiod do Istio) que configura todos os proxies: empurrando políticas, certificados e regras de roteamento. Ele não toca nos dados das requisições.

</Card>

</Cards>

## O que você ganha de graça

<Cards cols={3}>

<Card title="Gestão de tráfego" accent="brand">

Canary releases, divisão de tráfego, retries, timeouts e circuit breaking — configurados declarativamente, sem mudanças de código.

</Card>

<Card title="Segurança" accent="purple">

**mTLS** automático entre serviços, autorização baseada em identidade e criptografia em trânsito por padrão.

</Card>

<Card title="Observabilidade" accent="green">

Métricas uniformes, traces distribuídos e logs de acesso para cada chamada — porque o proxy vê todo o tráfego.

</Card>

</Cards>

## O tradeoff

<Callout type="warning" title="Poder tem um preço">

Uma mesh adiciona um salto de proxy (latência), overhead real de recursos (um sidecar por pod) e complexidade operacional significativa. Para poucos serviços, bibliotecas ou um gateway são mais simples. Use uma mesh quando tiver *muitos* serviços e precisar de segurança/observabilidade consistentes em todos.

</Callout>

## Mesh vs API gateway

<Callout type="neutral" title="Norte-sul vs leste-oeste">

Um **API gateway** trata o tráfego **norte-sul** (clientes → seu sistema) na borda. Um **service mesh** trata o tráfego **leste-oeste** (serviço → serviço) dentro do sistema. São complementares, não concorrentes.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Uma mesh move preocupações de rede para proxies sidecar
- O data plane carrega o tráfego; o control plane o configura
- Você ganha mTLS, controle de tráfego e observabilidade sem mudar a app

</Card>

<Card title="Projete para" accent="brand">

- Adote uma mesh quando a quantidade de serviços justificar o overhead
- Considere o custo de latência e recursos dos sidecars
- Use para leste-oeste; mantenha um gateway para norte-sul

</Card>

</Cards>
$mdx$),
  ('components/kubernetes', '/componentes/kubernetes', 'components', true, 24, NULL, true, 'Kubernetes', 'Kubernetes', $mdx$# Kubernetes

You have containers and a fleet of machines. **Kubernetes** (K8s) is the system that decides *which container runs where*, restarts what crashes, scales what's busy, and keeps the running state matching what you declared — continuously.

<Callout type="info" title="💡 Declarative, not imperative">

You don't tell Kubernetes "start this container on that server." You declare the **desired state** ("I want 5 replicas of this app"), and a control loop works tirelessly to make reality match — replacing failed pods, rescheduling on dead nodes.

</Callout>

## The reconciliation loop

This is the heart of Kubernetes — and of many distributed systems:

<Cards cols={3}>

<Card title="1. Observe" accent="brand">

Watch the current state of the cluster (what's actually running).

</Card>

<Card title="2. Compare" accent="purple">

Diff it against the desired state stored in **etcd**.

</Card>

<Card title="3. Act" accent="green">

Take actions to close the gap — start, stop, or move pods — then repeat forever.

</Card>

</Cards>

## Core objects

<Cards cols={2}>

<Card title="Pod" accent="brand">

The smallest deployable unit: one or more containers sharing network and storage. Pods are disposable — they come and go.

</Card>

<Card title="Deployment" accent="purple">

Declares "N replicas of this pod" and manages rollouts and rollbacks. A ReplicaSet keeps the count correct.

</Card>

<Card title="Service" accent="green">

A stable virtual IP/DNS name in front of a changing set of pods — built-in service discovery and load balancing.

</Card>

<Card title="ConfigMap & Secret" accent="brand">

Externalized configuration and credentials, injected into pods so images stay environment-agnostic.

</Card>

</Cards>

## Architecture in one breath

<Callout type="neutral" title="Control plane + nodes">

- **Control plane**: the API server (front door), **etcd** (the source-of-truth store), the scheduler (places pods), and controllers (run reconciliation loops).
- **Worker nodes**: each runs a **kubelet** (manages pods on that node) and a proxy for networking. Your containers run here.

</Callout>

## Why it ties this module together

<Callout type="success" title="Distributed-systems concepts, productized">

Kubernetes is a living example of nearly everything in this course: a **consensus**-backed store (etcd/Raft), **service discovery** (Services), **health checks** and **self-healing**, **horizontal scaling** (autoscalers), **rolling deploys**, and **declarative reconciliation**. Learn K8s and you're seeing these patterns applied for real.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- K8s reconciles actual state toward declared desired state
- Pods are disposable; Services give them a stable address
- etcd (Raft) is the cluster's single source of truth

</Card>

<Card title="Design For" accent="brand">

- Make workloads stateless and replaceable where possible
- Declare resources, health checks, and limits explicitly
- Let the platform handle scaling, healing, and rollout

</Card>

</Cards>
$mdx$, $mdx$# Kubernetes

Você tem containers e uma frota de máquinas. O **Kubernetes** (K8s) é o sistema que decide *qual container roda onde*, reinicia o que quebra, escala o que está ocupado e mantém o estado em execução igual ao que você declarou — continuamente.

<Callout type="info" title="💡 Declarativo, não imperativo">

Você não diz ao Kubernetes "inicie este container naquele servidor". Você declara o **estado desejado** ("quero 5 réplicas deste app"), e um loop de controle trabalha incansavelmente para fazer a realidade combinar — substituindo pods que falham, reagendando em nós mortos.

</Callout>

## O loop de reconciliação

Este é o coração do Kubernetes — e de muitos sistemas distribuídos:

<Cards cols={3}>

<Card title="1. Observar" accent="brand">

Observa o estado atual do cluster (o que realmente está rodando).

</Card>

<Card title="2. Comparar" accent="purple">

Compara com o estado desejado armazenado no **etcd**.

</Card>

<Card title="3. Agir" accent="green">

Toma ações para fechar a lacuna — iniciar, parar ou mover pods — e repete para sempre.

</Card>

</Cards>

## Objetos centrais

<Cards cols={2}>

<Card title="Pod" accent="brand">

A menor unidade implantável: um ou mais containers compartilhando rede e armazenamento. Pods são descartáveis — surgem e somem.

</Card>

<Card title="Deployment" accent="purple">

Declara "N réplicas deste pod" e gerencia rollouts e rollbacks. Um ReplicaSet mantém a contagem correta.

</Card>

<Card title="Service" accent="green">

Um IP/nome DNS virtual estável na frente de um conjunto mutável de pods — service discovery e balanceamento de carga embutidos.

</Card>

<Card title="ConfigMap e Secret" accent="brand">

Configuração e credenciais externalizadas, injetadas nos pods para que as imagens fiquem agnósticas de ambiente.

</Card>

</Cards>

## A arquitetura em um fôlego

<Callout type="neutral" title="Control plane + nós">

- **Control plane**: o API server (porta de entrada), o **etcd** (a fonte da verdade), o scheduler (posiciona pods) e os controllers (rodam loops de reconciliação).
- **Nós trabalhadores**: cada um roda um **kubelet** (gerencia pods naquele nó) e um proxy para rede. Seus containers rodam aqui.

</Callout>

## Por que ele amarra este módulo

<Callout type="success" title="Conceitos de sistemas distribuídos, virados produto">

O Kubernetes é um exemplo vivo de quase tudo neste curso: um store com **consenso** (etcd/Raft), **service discovery** (Services), **health checks** e **self-healing**, **escala horizontal** (autoscalers), **deploys contínuos** e **reconciliação declarativa**. Aprenda K8s e você vê esses padrões aplicados de verdade.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- O K8s reconcilia o estado atual em direção ao estado desejado declarado
- Pods são descartáveis; Services lhes dão um endereço estável
- O etcd (Raft) é a fonte única de verdade do cluster

</Card>

<Card title="Projete para" accent="brand">

- Torne as cargas sem estado e substituíveis quando possível
- Declare recursos, health checks e limites explicitamente
- Deixe a plataforma cuidar de escala, cura e rollout

</Card>

</Cards>
$mdx$),
  ('consistency-strategies/index', '/estrategias-de-consistencia', 'consistency', true, 47, NULL, true, 'Consistency Strategies', 'Estratégias de Consistência', $mdx$# Consistency Strategies

Explore different mechanisms to ensure consistency in distributed systems

<Callout type="info">

Consistency is one of the main challenges in distributed systems. Learn how different strategies help keep data ordered and coherent.

</Callout>

<Cards cols={2}>

<Card title="Two-Phase Commit" accent="brand">

Ensure consistency in distributed transactions using the Two-Phase Commit (2PC) protocol.

[Two-Phase Commit](/estrategias-de-consistencia/two-phase-commit)

</Card>

<Card title="Consensus Strategy" accent="purple">

Understand how distributed systems reach agreement in critical decisions using consensus protocols.

[Consensus Strategy](/estrategias-de-consistencia/consenso)

</Card>

<Card title="Lamport Logical Clocks" accent="brand">

Learn how Lamport timestamps order distributed events and maintain causal consistency.

[Lamport Logical Clocks](/estrategias-de-consistencia/lamport-timestamps)

</Card>

</Cards>

## Coming Soon

More consistency strategies will be added soon, including:

- Vector Clocks
- Eventual Consistency
$mdx$, $mdx$# Estratégias de Consistência

Explore diferentes mecanismos para garantir consistência em sistemas distribuídos

<Callout type="info">

A consistência é um dos principais desafios em sistemas distribuídos. Entenda como diferentes estratégias ajudam a manter a ordem e a coerência dos dados.

</Callout>

<Cards cols={2}>

<Card title="Two-Phase Commit" accent="brand">

Garanta consistência em transações distribuídas usando o protocolo Two-Phase Commit (2PC).

[Two-Phase Commit](/estrategias-de-consistencia/two-phase-commit)

</Card>

<Card title="Estratégia de Consenso" accent="purple">

Entenda como sistemas distribuídos alcançam acordo usando protocolos de consenso.

[Estratégia de Consenso](/estrategias-de-consistencia/consenso)

</Card>

<Card title="Relógios Lógicos de Lamport" accent="brand">

Descubra como timestamps de Lamport ordenam eventos distribuídos e garantem consistência causal.

[Relógios Lógicos de Lamport](/estrategias-de-consistencia/lamport-timestamps)

</Card>

</Cards>

## Em Breve

Mais estratégias de consistência serão adicionadas em breve, incluindo:

- Relógios Vetoriais
- Consistência Eventual
$mdx$),
  ('consistency-strategies/consensus', '/estrategias-de-consistencia/consenso', 'consistency', true, 48, NULL, true, 'Consensus Strategies', 'Estratégias de Consenso', $mdx$# Consensus Strategies

Understand how distributed systems reach agreement in critical decisions using consensus protocols.

## What is Consensus?

Consensus is one of the fundamental problems in distributed systems. It is the process by which a group of nodes agrees on a common value or decision, even in the presence of failures.

## Raft Protocol

Raft is a consensus protocol designed to be more understandable than Paxos. It splits the problem into three independent subproblems:

- Leader election
- Log replication
- Safety guarantees

### Practical Example

In a cluster of 5 nodes running Raft, when the leader fails, the followers start a new election after a timeout. The node that receives the majority of votes becomes the new leader.

## Paxos Protocol

Paxos is a consensus protocol that ensures consistency in a distributed system even when nodes may fail or messages may be lost.

### How It Works

The protocol operates in two main phases:

- Phase 1: Prepare/Promise
- Phase 2: Propose/Accept

## ZooKeeper

ZooKeeper is a coordination service for distributed systems that implements its own consensus protocol (ZAB - ZooKeeper Atomic Broadcast).

### Characteristics

- Total ordering of updates
- Atomicity
- Sequential consistency
- Durability

## Advantages and Disadvantages

<Cards cols={2}>

<Card title="Advantages" accent="green">

- Strong consistency
- Fault tolerance
- Automatic recovery
- Ordering guarantees

</Card>

<Card title="Disadvantages" accent="red">

- Higher latency
- Implementation complexity
- Communication overhead
- Quorum requirements

</Card>

</Cards>

## Byzantine Fault Tolerance (BFT)

Raft and Paxos tolerate nodes that **crash** (fail-stop). They assume nodes that *do* respond are honest. **Byzantine** faults are worse: a node can lie, send conflicting messages to different peers, or be actively malicious (a bug, corruption, or an attacker).

<Callout type="warning" title="Why BFT is harder">

To tolerate **f** Byzantine (lying) nodes you need **3f + 1** total nodes — versus only **2f + 1** to tolerate f crash faults. You need a two-thirds supermajority because some of the votes you receive may be lies.

</Callout>

<Cards cols={2}>

<Card title="Classic BFT" accent="brand">

**PBFT** (Practical Byzantine Fault Tolerance) reaches agreement among known nodes through multiple voting rounds. Used in permissioned systems where membership is controlled.

</Card>

<Card title="Blockchain consensus" accent="purple">

Public blockchains face Byzantine actors at internet scale. Proof-of-Work and Proof-of-Stake are BFT-style mechanisms that make lying economically irrational instead of voting among known peers.

</Card>

</Cards>

<Callout type="neutral" title="When you actually need it">

Most internal systems only need crash fault tolerance (Raft/Paxos) — you trust your own machines. Reach for BFT when nodes are operated by **mutually distrusting parties** or exposed to adversaries: blockchains, cross-organization ledgers, and high-assurance systems.

</Callout>

## Try It in Practice

Use our interactive simulator to better understand how consensus protocols work in different scenarios.

[Open Simulator](/estrategias-de-consistencia/consenso/simulador)
$mdx$, $mdx$# Estratégias de Consenso

Entenda como os sistemas distribuídos alcançam acordo em decisões críticas usando protocolos de consenso.

## O que é Consenso?

Consenso é um dos problemas fundamentais em sistemas distribuídos. É o processo pelo qual um grupo de nós concorda em um valor ou decisão comum, mesmo na presença de falhas.

## Protocolo Raft

Raft é um protocolo de consenso projetado para ser mais compreensível que o Paxos. Ele divide o problema em três subproblemas independentes:

- Eleição de líder
- Replicação de log
- Garantia de segurança

### Exemplo Prático

Em um cluster de 5 nós executando Raft, quando o líder falha, os seguidores iniciam uma nova eleição após um timeout. O nó que receber a maioria dos votos se torna o novo líder.

## Protocolo Paxos

Paxos é um protocolo de consenso que garante consistência em um sistema distribuído, mesmo quando nós podem falhar ou mensagens podem ser perdidas.

### Como Funciona

O protocolo opera em duas fases principais:

- Fase 1: Prepare/Promise
- Fase 2: Propose/Accept

## ZooKeeper

ZooKeeper é um serviço de coordenação para sistemas distribuídos que implementa seu próprio protocolo de consenso (ZAB - ZooKeeper Atomic Broadcast).

### Características

- Ordenação total de atualizações
- Atomicidade
- Consistência sequencial
- Durabilidade

## Vantagens e Desvantagens

<Cards cols={2}>

<Card title="Vantagens" accent="green">

- Forte consistência
- Tolerância a falhas
- Recuperação automática
- Garantia de ordem

</Card>

<Card title="Desvantagens" accent="red">

- Maior latência
- Complexidade de implementação
- Overhead de comunicação
- Necessidade de quórum

</Card>

</Cards>

## Tolerância a Falhas Bizantinas (BFT)

Raft e Paxos toleram nós que **caem** (fail-stop). Eles assumem que os nós que *respondem* são honestos. Falhas **bizantinas** são piores: um nó pode mentir, enviar mensagens conflitantes a diferentes pares ou ser ativamente malicioso (um bug, corrupção ou um atacante).

<Callout type="warning" title="Por que BFT é mais difícil">

Para tolerar **f** nós bizantinos (mentirosos) você precisa de **3f + 1** nós no total — contra apenas **2f + 1** para tolerar f falhas de crash. É preciso uma supermaioria de dois terços porque alguns dos votos recebidos podem ser mentiras.

</Callout>

<Cards cols={2}>

<Card title="BFT clássico" accent="brand">

**PBFT** (Practical Byzantine Fault Tolerance) chega a acordo entre nós conhecidos por múltiplas rodadas de votação. Usado em sistemas permissionados onde a membership é controlada.

</Card>

<Card title="Consenso de blockchain" accent="purple">

Blockchains públicas enfrentam atores bizantinos em escala de internet. Proof-of-Work e Proof-of-Stake são mecanismos no estilo BFT que tornam mentir economicamente irracional em vez de votar entre pares conhecidos.

</Card>

</Cards>

<Callout type="neutral" title="Quando você realmente precisa">

A maioria dos sistemas internos só precisa de tolerância a falhas de crash (Raft/Paxos) — você confia nas suas próprias máquinas. Use BFT quando os nós são operados por **partes que desconfiam mutuamente** ou expostos a adversários: blockchains, ledgers entre organizações e sistemas de alta garantia.

</Callout>

## Experimente na Prática

Use nosso simulador interativo para entender melhor como os protocolos de consenso funcionam em diferentes cenários.

[Acessar Simulador](/estrategias-de-consistencia/consenso/simulador)
$mdx$),
  ('consistency-strategies/lamport-timestamps', '/estrategias-de-consistencia/lamport-timestamps', 'consistency', true, 49, NULL, true, 'Lamport Logical Clocks', 'Relógios Lógicos de Lamport', $mdx$# Lamport Logical Clocks

Understand how Lamport timestamps establish order among distributed events.

## Overview

<Cards cols={2}>

<Card title="The Problem" accent="brand">

In distributed systems, there is no global clock that all processes can consult. Each process has its own local clock, which may drift from the others.

</Card>

<Card title="The Solution" accent="green">

Lamport logical clocks establish a partial order of events based on the "happened-before" relation, enabling determination of causality among distributed events.

</Card>

</Cards>

## How It Works

<Card title="Basic Rules" accent="brand">

- Each process maintains a counter that is incremented on local events
- When sending a message, a process includes its current timestamp
- When receiving a message, a process sets its counter to max(local, received) + 1

</Card>

<Card title="Properties" accent="purple">

- If event A caused event B, then timestamp(A) < timestamp(B)
- If timestamp(A) < timestamp(B), then A may have caused B
- If timestamp(A) = timestamp(B), then A and B are concurrent

</Card>

## Applications

<Cards cols={2}>

<Card title="Use Cases" accent="brand">

- Ordering messages in distributed messaging systems
- Detecting race conditions in concurrent systems
- Maintaining consistency in distributed databases
- Synchronizing state in multiplayer games

</Card>

<Card title="Limitations" accent="red">

- Do not capture concurrency relations (events that happen in parallel)
- Do not provide an absolute global time
- May yield different orderings in different system executions

</Card>

</Cards>

## Practical Example

<Card title="Distributed Chat System" accent="brand">

In a distributed chat system, Lamport timestamps can be used to:

- Order messages from different users
- Ensure replies appear after original messages
- Detect and resolve edit conflicts

</Card>

## Try It in Practice

Use our interactive simulator to better understand how Lamport logical clocks work in different scenarios.

[Open Simulator](/estrategias-de-consistencia/lamport-timestamps/simulador)
$mdx$, $mdx$# Relógios Lógicos de Lamport

Entenda como os timestamps de Lamport estabelecem ordem em eventos distribuídos.

## Visão Geral

<Cards cols={2}>

<Card title="O Problema" accent="brand">

Em sistemas distribuídos, não existe um relógio global que todos os processos possam consultar. Cada processo tem seu próprio relógio local, que pode divergir dos demais.

</Card>

<Card title="A Solução" accent="green">

Os relógios lógicos de Lamport estabelecem uma ordem parcial de eventos baseada na relação "aconteceu antes", permitindo determinar a causalidade entre eventos distribuídos.

</Card>

</Cards>

## Como Funciona

<Card title="Regras Básicas" accent="brand">

- Cada processo mantém um contador que é incrementado em eventos locais
- Ao enviar uma mensagem, o processo inclui seu timestamp atual
- Ao receber uma mensagem, o processo atualiza seu contador para o máximo entre seu valor local e o timestamp recebido + 1

</Card>

<Card title="Propriedades" accent="purple">

- Se evento A causou evento B, então timestamp(A) < timestamp(B)
- Se timestamp(A) < timestamp(B), então A pode ter causado B
- Se timestamp(A) = timestamp(B), então A e B são concorrentes

</Card>

## Aplicações

<Cards cols={2}>

<Card title="Casos de Uso" accent="brand">

- Ordenação de mensagens em sistemas de mensageria distribuídos
- Detecção de condições de corrida em sistemas concorrentes
- Manutenção de consistência em bancos de dados distribuídos
- Sincronização de estados em jogos multiplayer

</Card>

<Card title="Limitações" accent="red">

- Não capturam relações de concorrência (eventos que aconteceram em paralelo)
- Não fornecem um tempo global absoluto
- Podem gerar ordenações diferentes em diferentes execuções do sistema

</Card>

</Cards>

## Exemplo Prático

<Card title="Sistema de Chat Distribuído" accent="brand">

Em um sistema de chat distribuído, os timestamps de Lamport podem ser usados para:

- Ordenar mensagens de diferentes usuários
- Garantir que respostas apareçam depois das mensagens originais
- Detectar e resolver conflitos de edição

</Card>

## Experimente na Prática

Use nosso simulador interativo para entender melhor como os relógios lógicos de Lamport funcionam em diferentes cenários.

[Acessar Simulador](/estrategias-de-consistencia/lamport-timestamps/simulador)
$mdx$),
  ('consistency-strategies/two-phase-commit', '/estrategias-de-consistencia/two-phase-commit', 'consistency', true, 50, NULL, true, 'Two-Phase Commit (2PC)', 'Two-Phase Commit (2PC)', $mdx$# Two-Phase Commit (2PC)

Understand how the Two-Phase Commit protocol ensures consistency in distributed transactions.

## Overview

<Cards cols={2}>

<Card title="Phase 1: Prepare" accent="brand">

The coordinator asks all participants to prepare for the transaction. Each participant checks whether it can perform the operation and replies to the coordinator.

</Card>

<Card title="Phase 2: Commit" accent="green">

Based on participant responses, the coordinator decides whether the transaction should be committed or aborted.

</Card>

</Cards>

## Characteristics

<Cards cols={2}>

<Card title="Advantages" accent="brand">

- Ensures strong data consistency
- Prevents partial transactions
- Transparent decision-making process
- Guaranteed atomicity
- Transaction isolation

</Card>

<Card title="Limitations" accent="red">

- Blocking (participants wait for decision)
- Sensitive to coordinator failures
- Higher latency due to two phases
- Communication overhead
- Possibility of deadlocks

</Card>

</Cards>

## Use Cases

<Cards cols={3}>

<Card title="Banking Systems" accent="brand">

Transfers across accounts involving multiple banks or systems. Ensures money is not lost or duplicated.

</Card>

<Card title="E-commerce" accent="purple">

Order processing that involves inventory, payment, and logistics. Ensures all steps complete successfully.

</Card>

<Card title="Reservations" accent="green">

Hotel, flight, or event reservation systems that must coordinate multiple resources simultaneously.

</Card>

</Cards>

## Try It in Practice

Use our interactive simulator to better understand how Two-Phase Commit works in different scenarios.

[Open Simulator](/estrategias-de-consistencia/two-phase-commit/simulador)
$mdx$, $mdx$# Two-Phase Commit (2PC)

Entenda como o protocolo Two-Phase Commit garante consistência em transações distribuídas.

## Visão Geral

<Cards cols={2}>

<Card title="Fase 1: Preparação" accent="brand">

O coordenador solicita que todos os participantes se preparem para a transação. Cada participante verifica se pode realizar a operação e responde ao coordenador.

</Card>

<Card title="Fase 2: Commit" accent="green">

Com base nas respostas dos participantes, o coordenador decide se a transação deve ser confirmada (commit) ou abortada (rollback).

</Card>

</Cards>

## Características

<Cards cols={2}>

<Card title="Vantagens" accent="brand">

- Garante consistência forte dos dados
- Previne transações parciais
- Processo de decisão transparente
- Atomicidade garantida
- Isolamento entre transações

</Card>

<Card title="Limitações" accent="red">

- Bloqueante (participantes aguardam decisão)
- Sensível a falhas do coordenador
- Maior latência devido às duas fases
- Overhead de comunicação
- Possibilidade de deadlocks

</Card>

</Cards>

## Casos de Uso

<Cards cols={3}>

<Card title="Sistemas Bancários" accent="brand">

Transferências entre contas que envolvem múltiplos bancos ou sistemas. Garante que o dinheiro não seja perdido ou duplicado.

</Card>

<Card title="E-commerce" accent="purple">

Processamento de pedidos que envolvem estoque, pagamento e logística. Assegura que todas as etapas sejam concluídas com sucesso.

</Card>

<Card title="Reservas" accent="green">

Sistemas de reserva de hotéis, voos ou eventos que precisam coordenar múltiplos recursos simultaneamente.

</Card>

</Cards>

## Experimente na Prática

Use nosso simulador interativo para entender melhor como o Two-Phase Commit funciona em diferentes cenários.

[Acessar Simulador](/estrategias-de-consistencia/two-phase-commit/simulador)
$mdx$),
  ('consistency-strategies/synchronization', '/estrategias-de-consistencia/sincronizacao', 'consistency', true, 51, NULL, true, 'Synchronization in Distributed Systems', 'Sincronização em Sistemas Distribuídos', $mdx$# Synchronization in Distributed Systems

Synchronization is one of the fundamental challenges in distributed systems. It ensures that different processes or services coordinate their actions efficiently and safely.

<Callout type="info" title="Key Concept">

Efficient synchronization is crucial to maintain consistency and avoid race conditions in distributed systems. However, it is important to balance synchronization with performance.

</Callout>

## Fundamentals

### Basic Concepts

Synchronization in distributed systems involves several fundamental concepts that must be understood to implement efficient solutions.

<Cards cols={2}>

<Card title="Mutual Exclusion" accent="brand">

- **Shared Resources** — Guarantee exclusive access to resources
- **Race Conditions** — Prevent access conflicts

</Card>

<Card title="Coordination" accent="brand">

- **Consensus** — Agreement among distributed processes
- **Ordering** — Sequencing of distributed events

</Card>

</Cards>

## Topics

<Cards cols={2}>

<Card title="Fundamentals" accent="brand">

Learn the basic concepts of synchronization using the classic Dining Philosophers problem.

[Fundamentals](/estrategias-de-consistencia/sincronizacao/fundamentos)

</Card>

<Card title="Deadlocks" accent="purple">

Understand how to prevent and detect deadlocks in distributed systems.

[Deadlocks](/estrategias-de-consistencia/sincronizacao/deadlocks)

</Card>

<Card title="Algorithms" accent="green">

Explore different distributed synchronization algorithms.

[Algorithms](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Design and Implementation" accent="brand">

- **Minimize Synchronization** — Use synchronization only when necessary
- **Appropriate Granularity** — Choose the right level of synchronization
- **Timeout and Recovery** — Implement timeout and recovery mechanisms

</Card>

<Card title="Monitoring and Debugging" accent="purple">

- **Detailed Logging** — Keep detailed logs of synchronization operations
- **Performance Metrics** — Monitor synchronization impact on performance
- **Deadlock Detection** — Implement deadlock detection mechanisms

</Card>

</Cards>

## Next Steps

<Cards cols={2}>

<Card title="Deadlocks" accent="red">

Learn more about how to identify, prevent, and resolve deadlocks in distributed systems.

[Deadlocks](/estrategias-de-consistencia/sincronizacao/deadlocks)

</Card>

<Card title="Algorithms" accent="brand">

Explore different distributed synchronization algorithms and their applications.

[Algorithms](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

</Cards>
$mdx$, $mdx$# Sincronização em Sistemas Distribuídos

A sincronização é um dos desafios fundamentais em sistemas distribuídos. Ela garante que diferentes processos ou serviços coordenem suas ações de forma eficiente e segura.

<Callout type="info" title="Conceito Chave">

A sincronização eficiente é crucial para manter a consistência e evitar condições de corrida em sistemas distribuídos. No entanto, é importante encontrar o equilíbrio entre sincronização e performance.

</Callout>

## Fundamentos

### Conceitos Básicos

A sincronização em sistemas distribuídos envolve vários conceitos fundamentais que precisam ser compreendidos para implementar soluções eficientes.

<Cards cols={2}>

<Card title="Exclusão Mútua" accent="brand">

- **Recursos Compartilhados** — Garantia de acesso exclusivo a recursos
- **Condições de Corrida** — Prevenção de conflitos de acesso

</Card>

<Card title="Coordenação" accent="brand">

- **Consenso** — Acordo entre processos distribuídos
- **Ordenação** — Sequenciamento de eventos distribuídos

</Card>

</Cards>

## Tópicos

<Cards cols={2}>

<Card title="Fundamentos" accent="brand">

Aprenda os conceitos básicos de sincronização usando o exemplo clássico do Jantar dos Filósofos.

[Fundamentos](/estrategias-de-consistencia/sincronizacao/fundamentos)

</Card>

<Card title="Deadlocks" accent="purple">

Entenda como prevenir e detectar deadlocks em sistemas distribuídos.

[Deadlocks](/estrategias-de-consistencia/sincronizacao/deadlocks)

</Card>

<Card title="Algoritmos" accent="green">

Explore diferentes algoritmos de sincronização distribuída.

[Algoritmos](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

</Cards>

## Melhores Práticas

<Cards cols={2}>

<Card title="Design e Implementação" accent="brand">

- **Minimize a Sincronização** — Use sincronização apenas quando necessário
- **Granularidade Apropriada** — Escolha o nível certo de sincronização
- **Timeout e Recuperação** — Implemente mecanismos de timeout e recuperação

</Card>

<Card title="Monitoramento e Debugging" accent="purple">

- **Logging Detalhado** — Mantenha logs detalhados de operações de sincronização
- **Métricas de Performance** — Monitore o impacto da sincronização na performance
- **Detecção de Deadlocks** — Implemente mecanismos de detecção de deadlocks

</Card>

</Cards>

## Próximos Passos

<Cards cols={2}>

<Card title="Deadlocks" accent="red">

Aprenda mais sobre como identificar, prevenir e resolver deadlocks em sistemas distribuídos.

[Deadlocks](/estrategias-de-consistencia/sincronizacao/deadlocks)

</Card>

<Card title="Algoritmos" accent="brand">

Explore diferentes algoritmos de sincronização distribuída e suas aplicações.

[Algoritmos](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

</Cards>
$mdx$),
  ('consistency-strategies/synchronization-fundamentals', '/estrategias-de-consistencia/sincronizacao/fundamentos', 'consistency', true, 52, NULL, true, 'Synchronization Fundamentals', 'Fundamentos da Sincronização', $mdx$# Synchronization Fundamentals

The Dining Philosophers problem is a classic example illustrating the fundamental challenges of synchronization in distributed systems.

We will explore how it helps us understand important concepts like mutual exclusion, deadlocks, and starvation.

<Callout type="info" title="Key Concept">

The Dining Philosophers problem was proposed by Edsger Dijkstra in 1965 and remains an excellent tool to understand synchronization challenges in modern distributed systems.

</Callout>

## Problem Illustration

### The Dining Philosophers

Five philosophers sit at a round table, each with a bowl of pasta and a fork between each pair. To eat, a philosopher needs to pick up two adjacent forks, but there are only five forks in total.

### Synchronization Strategies

- **Naive:** Philosophers simply try to pick up the left fork and then the right one. This easily leads to deadlock.
- **Ordered:** Philosophers always pick up the fork with the smaller number first, preventing deadlocks.
- **Waiter:** A "waiter" ensures only one philosopher at a time can attempt to pick up both forks.

## Significance and Applications

The Dining Philosophers problem is more than an academic exercise—it models real challenges in modern distributed systems. Each philosopher represents a process or thread that needs to access shared resources (the forks) safely and efficiently.

In real systems, this problem appears in many scenarios: distributed databases managing concurrent transactions, distributed file systems controlling access to shared resources, or sensor networks coordinating data collection. Solving it is essential to ensure reliability and efficiency.

<Cards cols={2}>

<Card title="Analogy with Real Systems" accent="purple">

- Philosophers = Processes/Threads
- Forks = Shared Resources
- Eating = Executing Critical Operations
- Thinking = Independent Processing

</Card>

<Card title="Modern Challenges" accent="brand">

- Scalability in Distributed Systems
- Fault Tolerance
- Load Balancing
- Fairness Guarantees

</Card>

</Cards>

## The Problem

<Cards cols={2}>

<Card title="Scenario" accent="brand">

- **5 Philosophers** — Sitting at a round table
- **5 Forks** — One between each pair of philosophers
- **1 Plate** — A bowl of pasta for each philosopher

</Card>

<Card title="Rules" accent="purple">

- **2 Forks** — Required to eat
- **1 Fork at a time** — Per philosopher at a time
- **Finite Time** — To eat and think

</Card>

</Cards>

## Challenges

<Cards cols={2}>

<Card title="Deadlock" accent="red">

If all philosophers pick up the left fork and wait for the right fork, none will be able to eat.

</Card>

<Card title="Starvation" accent="yellow">

Some philosophers may never get to eat if fork distribution is unfair.

</Card>

</Cards>

## Solutions

<Cards cols={2}>

<Card title="Deadlock Prevention" accent="green">

- **Fork Ordering** — Always pick up the fork with the smaller number first
- **Timeout** — Release forks if the second fork is not acquired in time

</Card>

<Card title="Starvation Prevention" accent="brand">

- **Priority** — Prioritize philosophers who have not eaten for longer
- **Fairness Guarantee** — Implement fairness mechanisms in distribution

</Card>

</Cards>

## Próximos Passos

<Cards cols={2}>

<Card title="Deadlocks" accent="red">

Aprenda mais sobre como identificar, prevenir e resolver deadlocks em sistemas distribuídos.

[Deadlocks](/estrategias-de-consistencia/sincronizacao/deadlocks)

</Card>

<Card title="Algoritmos" accent="brand">

Explore diferentes algoritmos de sincronização distribuída e suas aplicações.

[Algoritmos](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

</Cards>
$mdx$, $mdx$# Fundamentos da Sincronização

O problema do Jantar dos Filósofos é um exemplo clássico que ilustra os desafios fundamentais da sincronização em sistemas distribuídos.

Vamos explorar como ele nos ajuda a entender conceitos importantes como exclusão mútua, deadlocks e starvation.

<Callout type="info" title="Conceito Chave">

O Jantar dos Filósofos foi proposto por Edsger Dijkstra em 1965 e continua sendo uma excelente ferramenta para entender os desafios de sincronização em sistemas distribuídos modernos.

</Callout>

## Ilustração do Problema

### O Jantar dos Filósofos

Cinco filósofos sentados em uma mesa redonda, cada um com um prato de macarrão e um garfo entre cada par de filósofos. Para comer, um filósofo precisa pegar dois garfos adjacentes, mas há apenas cinco garfos no total.

### Estratégias de Sincronização

- **Naive:** Filósofos simplesmente tentam pegar o garfo da esquerda e depois o da direita. Facilmente gera deadlock.
- **Ordenada:** Filósofos sempre pegam o garfo de menor número primeiro, prevenindo deadlocks.
- **Garçom:** Um "garçom" garante que apenas um filósofo por vez possa tentar pegar ambos os garfos.

## Significado e Aplicações

O problema do Jantar dos Filósofos é mais do que um exercício acadêmico - é um modelo que representa desafios reais em sistemas distribuídos modernos. Cada filósofo representa um processo ou thread que precisa acessar recursos compartilhados (os garfos) de forma segura e eficiente.

Em sistemas reais, este problema se manifesta em diversos cenários: bancos de dados distribuídos gerenciando transações concorrentes, sistemas de arquivos distribuídos controlando acesso a recursos compartilhados, ou redes de sensores coordenando a coleta de dados. A solução deste problema é fundamental para garantir a confiabilidade e eficiência de sistemas distribuídos.

<Cards cols={2}>

<Card title="Analogia com Sistemas Reais" accent="purple">

- Filósofos = Processos/Threads
- Garfos = Recursos Compartilhados
- Comer = Execução de Operações Críticas
- Pensar = Processamento Independente

</Card>

<Card title="Desafios Modernos" accent="brand">

- Escalabilidade em Sistemas Distribuídos
- Tolerância a Falhas
- Balanceamento de Carga
- Garantia de Justiça no Acesso

</Card>

</Cards>

## O Problema

<Cards cols={2}>

<Card title="Cenário" accent="brand">

- **5 Filósofos** — Sentados em uma mesa redonda
- **5 Garfos** — Um entre cada par de filósofos
- **1 Prato** — De macarrão para cada filósofo

</Card>

<Card title="Regras" accent="purple">

- **2 Garfos** — Necessários para comer
- **1 Garfo por vez** — Por filósofo por vez
- **Tempo Finito** — Para comer e pensar

</Card>

</Cards>

## Desafios

<Cards cols={2}>

<Card title="Deadlock" accent="red">

Se todos os filósofos pegarem o garfo da esquerda e esperarem pelo da direita, nenhum deles conseguirá comer.

</Card>

<Card title="Starvation" accent="yellow">

Alguns filósofos podem nunca conseguir comer se a distribuição dos garfos não for justa.

</Card>

</Cards>

## Soluções

<Cards cols={2}>

<Card title="Prevenção de Deadlock" accent="green">

- **Ordem dos Garfos** — Sempre pegar o garfo com menor número primeiro
- **Timeout** — Liberar garfos se não conseguir o segundo em tempo

</Card>

<Card title="Prevenção de Starvation" accent="brand">

- **Prioridade** — Dar prioridade a filósofos que não comeram há mais tempo
- **Garantia de Acesso** — Implementar mecanismos de justiça na distribuição

</Card>

</Cards>

## Próximos Passos

<Cards cols={2}>

<Card title="Deadlocks" accent="red">

Aprenda mais sobre como identificar, prevenir e resolver deadlocks em sistemas distribuídos.

[Deadlocks](/estrategias-de-consistencia/sincronizacao/deadlocks)

</Card>

<Card title="Algoritmos" accent="brand">

Explore diferentes algoritmos de sincronização distribuída e suas aplicações.

[Algoritmos](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

</Cards>
$mdx$),
  ('consistency-strategies/synchronization-deadlocks', '/estrategias-de-consistencia/sincronizacao/deadlocks', 'consistency', true, 53, NULL, true, 'Deadlocks in Distributed Systems', 'Deadlocks em Sistemas Distribuídos', $mdx$# Deadlocks in Distributed Systems

Understand what deadlocks are, how they occur in distributed systems, and different strategies for prevention and detection.

<Callout type="info" title="Key Concept">

Deadlocks occur when two or more processes are permanently blocked, each waiting for a resource held by another process.

</Callout>

## Conditions for Deadlock

<Cards cols={2}>

<Card title="Mutual Exclusion" accent="brand">

Resources cannot be shared simultaneously among processes.

</Card>

<Card title="Hold and Wait" accent="purple">

Processes hold resources while waiting for others.

</Card>

<Card title="No Preemption" accent="brand">

Resources cannot be forcibly taken from a process.

</Card>

<Card title="Circular Wait" accent="purple">

There is a circular chain of processes waiting for resources.

</Card>

</Cards>

## Deadlock Prevention

<Card title="Prevention by Denial" accent="brand">

Deny one of the four necessary conditions for deadlock.

- Mutual Exclusion: Allow resource sharing
- Hold and Wait: Require allocation of all resources at once
- No Preemption: Allow resource preemption
- Circular Wait: Impose a total order on resources

</Card>

<Card title="Prevention by Avoidance" accent="purple">

Use system state information to avoid deadlocks.

- Banker's Algorithm
- Resource Allocation Graph
- Safe State Analysis

</Card>

## Deadlock Detection

<Cards cols={2}>

<Card title="Centralized Detection" accent="brand">

A central coordinator monitors the system state and detects deadlocks.

</Card>

<Card title="Distributed Detection" accent="purple">

Each process participates in detection through message exchange.

</Card>

</Cards>

## Next Steps

<Cards cols={2}>

<Card title="Synchronization Algorithms" accent="brand">

Explore specific algorithms for deadlock prevention.

[Synchronization Algorithms](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

<Card title="Philosophers Simulator" accent="purple">

Try different deadlock prevention strategies.

[Philosophers Simulator](/estrategias-de-consistencia/sincronizacao/simulador)

</Card>

</Cards>
$mdx$, $mdx$# Deadlocks em Sistemas Distribuídos

Entenda o que são deadlocks, como eles ocorrem em sistemas distribuídos e as diferentes estratégias para prevenção e detecção.

<Callout type="info" title="Conceito Chave">

Deadlocks ocorrem quando dois ou mais processos ficam permanentemente bloqueados, cada um esperando por um recurso que está sendo mantido por outro processo.

</Callout>

## Condições para Deadlock

<Cards cols={2}>

<Card title="Exclusão Mútua" accent="brand">

Recursos não podem ser compartilhados simultaneamente entre processos.

</Card>

<Card title="Posse e Espera" accent="purple">

Processos mantêm recursos enquanto esperam por outros.

</Card>

<Card title="Não Preempção" accent="brand">

Recursos não podem ser forçadamente liberados de um processo.

</Card>

<Card title="Espera Circular" accent="purple">

Existe uma cadeia circular de processos esperando por recursos.

</Card>

</Cards>

## Prevenção de Deadlocks

<Card title="Prevenção por Negação" accent="brand">

Negar uma das quatro condições necessárias para deadlock.

- Exclusão Mútua: Permitir compartilhamento de recursos
- Posse e Espera: Requerer alocação de todos os recursos de uma vez
- Não Preempção: Permitir preempção de recursos
- Espera Circular: Impor uma ordem total nos recursos

</Card>

<Card title="Prevenção por Evitação" accent="purple">

Usar informações sobre o estado do sistema para evitar deadlocks.

- Algoritmo do Banqueiro
- Grafo de Alocação de Recursos
- Análise de Estado Seguro

</Card>

## Detecção de Deadlocks

<Cards cols={2}>

<Card title="Detecção Centralizada" accent="brand">

Um coordenador central monitora o estado do sistema e detecta deadlocks.

</Card>

<Card title="Detecção Distribuída" accent="purple">

Cada processo participa da detecção através de troca de mensagens.

</Card>

</Cards>

## Próximos Passos

<Cards cols={2}>

<Card title="Algoritmos de Sincronização" accent="brand">

Explore algoritmos específicos para prevenção de deadlocks.

[Algoritmos de Sincronização](/estrategias-de-consistencia/sincronizacao/algoritmos)

</Card>

<Card title="Simulador de Filósofos" accent="purple">

Experimente diferentes estratégias de prevenção de deadlocks.

[Simulador de Filósofos](/estrategias-de-consistencia/sincronizacao/simulador)

</Card>

</Cards>
$mdx$),
  ('consistency-strategies/saga', '/estrategias-de-consistencia/saga', 'consistency', true, 54, NULL, true, 'The Saga Pattern', 'O Padrão Saga', $mdx$# The Saga Pattern

A single database transaction gives you all-or-nothing atomicity. But a business process that spans **multiple services** — reserve inventory, charge payment, book shipping — has no shared transaction. The **saga pattern** coordinates these steps and undoes them cleanly when one fails.

<Callout type="info" title="💡 No global rollback">

You can't `ROLLBACK` across services. A saga instead defines, for every step, a **compensating action** that semantically undoes it. If step 3 fails, you run the compensations for steps 2 and 1 in reverse.

</Callout>

## A saga is a sequence of local transactions

Each step commits to its own service immediately. There's no holding locks across the whole flow (which would kill availability). The price: between steps the system is **temporarily inconsistent**, and you must design compensations for partial progress.

<Cards cols={2}>

<Card title="Forward path" accent="green">

Reserve inventory → Charge payment → Book shipping → Send confirmation. Each commits locally and emits success.

</Card>

<Card title="Compensation path" accent="red">

If "Book shipping" fails: Refund payment → Release inventory. Compensations run in **reverse** of the completed steps.

</Card>

</Cards>

## Two coordination styles

<Cards cols={2}>

<Card title="Orchestration" accent="brand">

A central **orchestrator** tells each service what to do and decides when to compensate. Easy to reason about and monitor; the orchestrator is a dependency and can become complex.

</Card>

<Card title="Choreography" accent="purple">

No central brain — each service reacts to events and emits its own. Loosely coupled and resilient, but the end-to-end flow is harder to see and debug.

</Card>

</Cards>

## Designing compensations

<Callout type="warning" title="Compensations are not magic undo">

- They must be **idempotent** (a retry mustn't double-refund).
- Some actions can't be undone (an email was sent) — use a *semantic* counter-action (send a correction).
- Account for the window where other reads saw the intermediate state.

</Callout>

<Callout type="success" title="Try It: Saga Simulator">

Run a four-step saga, choose orchestrated or choreographed, inject a failure at any step, and watch the completed steps get compensated in reverse in the [Saga Simulator](/estrategias-de-consistencia/saga/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Sagas trade global atomicity for per-step local transactions
- Every step needs an idempotent compensating action
- Orchestration is explicit; choreography is event-driven

</Card>

<Card title="Design For" accent="brand">

- Make steps and compensations idempotent and retryable
- Accept and bound temporary inconsistency between steps
- Track saga state so you can resume after a crash

</Card>

</Cards>
$mdx$, $mdx$# O Padrão Saga

Uma única transação de banco te dá atomicidade tudo-ou-nada. Mas um processo de negócio que atravessa **múltiplos serviços** — reservar estoque, cobrar pagamento, agendar envio — não tem uma transação compartilhada. O **padrão saga** coordena esses passos e os desfaz de forma limpa quando um falha.

<Callout type="info" title="💡 Sem rollback global">

Você não pode dar `ROLLBACK` entre serviços. Uma saga, em vez disso, define para cada passo uma **ação compensatória** que o desfaz semanticamente. Se o passo 3 falha, você roda as compensações dos passos 2 e 1 em ordem reversa.

</Callout>

## Uma saga é uma sequência de transações locais

Cada passo faz commit no seu próprio serviço imediatamente. Não há locks segurados pelo fluxo inteiro (o que mataria a disponibilidade). O preço: entre os passos o sistema fica **temporariamente inconsistente**, e você precisa projetar compensações para progresso parcial.

<Cards cols={2}>

<Card title="Caminho de avanço" accent="green">

Reservar estoque → Cobrar pagamento → Agendar envio → Enviar confirmação. Cada um faz commit local e emite sucesso.

</Card>

<Card title="Caminho de compensação" accent="red">

Se "Agendar envio" falha: Estornar pagamento → Liberar estoque. As compensações rodam em ordem **reversa** dos passos concluídos.

</Card>

</Cards>

## Dois estilos de coordenação

<Cards cols={2}>

<Card title="Orquestração" accent="brand">

Um **orquestrador** central diz a cada serviço o que fazer e decide quando compensar. Fácil de entender e monitorar; o orquestrador é uma dependência e pode ficar complexo.

</Card>

<Card title="Coreografia" accent="purple">

Sem cérebro central — cada serviço reage a eventos e emite os seus. Fracamente acoplado e resiliente, mas o fluxo ponta-a-ponta é mais difícil de ver e depurar.

</Card>

</Cards>

## Projetando compensações

<Callout type="warning" title="Compensações não são um undo mágico">

- Precisam ser **idempotentes** (um retry não pode estornar duas vezes).
- Algumas ações não podem ser desfeitas (um e-mail foi enviado) — use uma contra-ação *semântica* (envie uma correção).
- Considere a janela em que outras leituras viram o estado intermediário.

</Callout>

<Callout type="success" title="Experimente: Simulador de Saga">

Rode uma saga de quatro passos, escolha orquestrada ou coreografada, injete uma falha em qualquer passo e veja os passos concluídos sendo compensados em ordem reversa no [Simulador de Saga](/estrategias-de-consistencia/saga/simulator).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Sagas trocam atomicidade global por transações locais por passo
- Todo passo precisa de uma ação compensatória idempotente
- Orquestração é explícita; coreografia é orientada a eventos

</Card>

<Card title="Projete para" accent="brand">

- Torne passos e compensações idempotentes e re-executáveis
- Aceite e limite a inconsistência temporária entre passos
- Rastreie o estado da saga para retomar após uma queda

</Card>

</Cards>
$mdx$),
  ('consistency-strategies/delivery-semantics', '/estrategias-de-consistencia/delivery-semantics', 'consistency', true, 55, NULL, true, 'Delivery Semantics', 'Semânticas de Entrega', $mdx$# Delivery Semantics

When a message crosses a network, things go wrong: packets drop, acks get lost, consumers crash mid-process. **Delivery semantics** describe the guarantee a messaging system gives about *how many times* a message is processed: **at-most-once**, **at-least-once**, or **exactly-once**.

<Callout type="info" title="💡 The core tension">

You can't have zero loss *and* zero duplicates for free. Retrying to avoid loss risks duplicates; not retrying to avoid duplicates risks loss. The guarantee you pick decides which problem you must handle.

</Callout>

## The three guarantees

<Cards cols={3}>

<Card title="At-most-once" accent="red">

Send and forget — never retry. Fast and duplicate-free, but a dropped message is **lost forever**. Fine for high-volume, low-value data (metrics, telemetry).

</Card>

<Card title="At-least-once" accent="amber">

Retry until acknowledged. **Never loses** a message, but a lost ack causes a **redelivery** → duplicates. The most common default.

</Card>

<Card title="Exactly-once" accent="green">

Each message takes effect once. The strongest guarantee — and the hardest. Achieved via at-least-once delivery **plus deduplication** or idempotency.

</Card>

</Cards>

## "Exactly-once" is delivery + dedup

True exactly-once *delivery* over an unreliable network is impossible. What systems actually provide is **effectively-once processing**:

<Callout type="neutral" title="How it's really done">

- Deliver at-least-once (retry until acked).
- Give each message a unique ID; the consumer records processed IDs and **discards duplicates**.
- Or make processing **idempotent** so re-applying it changes nothing.

</Callout>

## Tools of the trade

<Cards cols={2}>

<Card title="Deduplication" accent="green">

Track message/transaction IDs and drop repeats. Turns at-least-once into effectively-once at the cost of state to remember what you've seen.

</Card>

<Card title="Dead-letter queue (DLQ)" accent="brand">

After N failed attempts, move a message to a DLQ instead of retrying forever or dropping it — so nothing is silently lost and you can inspect failures.

</Card>

</Cards>

<Callout type="success" title="Try It: Delivery Semantics Simulator">

Switch between the three semantics, toggle deduplication and a dead-letter queue, and watch duplicates, lost, and dead-lettered messages add up in the [Delivery Semantics Simulator](/estrategias-de-consistencia/delivery-semantics/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- At-most-once loses; at-least-once duplicates; exactly-once is dedup on top of at-least-once
- True exactly-once delivery is impossible — aim for idempotent processing
- A DLQ keeps poison messages from being lost or retried forever

</Card>

<Card title="Design For" accent="brand">

- Default to at-least-once + idempotent consumers
- Attach unique IDs to enable deduplication
- Add a DLQ and alert on it

</Card>

</Cards>
$mdx$, $mdx$# Semânticas de Entrega

Quando uma mensagem cruza a rede, coisas dão errado: pacotes caem, acks se perdem, consumidores quebram no meio do processamento. As **semânticas de entrega** descrevem a garantia que um sistema de mensageria dá sobre *quantas vezes* uma mensagem é processada: **at-most-once**, **at-least-once** ou **exactly-once**.

<Callout type="info" title="💡 A tensão central">

Você não tem zero perda *e* zero duplicatas de graça. Repetir para evitar perda arrisca duplicatas; não repetir para evitar duplicatas arrisca perda. A garantia que você escolhe decide qual problema você precisa tratar.

</Callout>

## As três garantias

<Cards cols={3}>

<Card title="At-most-once" accent="red">

Envie e esqueça — nunca repita. Rápido e sem duplicatas, mas uma mensagem perdida é **perdida para sempre**. Ok para dados de alto volume e baixo valor (métricas, telemetria).

</Card>

<Card title="At-least-once" accent="amber">

Repita até receber o ack. **Nunca perde** uma mensagem, mas um ack perdido causa **reentrega** → duplicatas. O padrão mais comum.

</Card>

<Card title="Exactly-once" accent="green">

Cada mensagem tem efeito uma vez. A garantia mais forte — e a mais difícil. Alcançada via entrega at-least-once **mais deduplicação** ou idempotência.

</Card>

</Cards>

## "Exactly-once" é entrega + dedup

A verdadeira *entrega* exactly-once por uma rede não confiável é impossível. O que os sistemas realmente oferecem é **processamento efetivamente-uma-vez**:

<Callout type="neutral" title="Como é feito de verdade">

- Entregue at-least-once (repita até o ack).
- Dê a cada mensagem um ID único; o consumidor registra IDs processados e **descarta duplicatas**.
- Ou torne o processamento **idempotente** para que reaplicá-lo não mude nada.

</Callout>

## Ferramentas do ofício

<Cards cols={2}>

<Card title="Deduplicação" accent="green">

Rastreie IDs de mensagem/transação e descarte repetições. Transforma at-least-once em efetivamente-uma-vez ao custo de guardar o que já foi visto.

</Card>

<Card title="Dead-letter queue (DLQ)" accent="brand">

Após N tentativas falhas, mova a mensagem para uma DLQ em vez de repetir para sempre ou descartá-la — assim nada se perde silenciosamente e você pode inspecionar falhas.

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Semânticas de Entrega">

Alterne entre as três semânticas, ative deduplicação e uma dead-letter queue, e veja duplicatas, perdas e mensagens dead-lettered se acumularem no [Simulador de Semânticas de Entrega](/estrategias-de-consistencia/delivery-semantics/simulator).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- At-most-once perde; at-least-once duplica; exactly-once é dedup sobre at-least-once
- A verdadeira entrega exactly-once é impossível — busque processamento idempotente
- Uma DLQ evita que mensagens venenosas se percam ou sejam repetidas para sempre

</Card>

<Card title="Projete para" accent="brand">

- Use por padrão at-least-once + consumidores idempotentes
- Anexe IDs únicos para permitir deduplicação
- Adicione uma DLQ e alerte sobre ela

</Card>

</Cards>
$mdx$),
  ('consistency-strategies/vector-clocks', '/estrategias-de-consistencia/vector-clocks', 'consistency', true, 56, NULL, true, 'Vector Clocks', 'Relógios Vetoriais', $mdx$# Vector Clocks

A Lamport timestamp can tell you that event A *might* have happened before B — but not whether two events were truly **concurrent**. **Vector clocks** fix that: they capture causality precisely, so you can detect when two updates happened independently and *conflict*.

<Callout type="info" title="💡 Why a single counter isn't enough">

Lamport clocks give a total order but lose information: if `A < B` numerically you can't tell whether A *caused* B or they just happened in some order. Vector clocks preserve the full causal relationship.

</Callout>

## How they work

Each of the N nodes keeps a **vector** of N counters — one per node.

<Cards cols={3}>

<Card title="1. Local event" accent="brand">

A node increments **its own** entry in the vector for every local event.

</Card>

<Card title="2. Send" accent="purple">

When sending a message, the node attaches its entire current vector.

</Card>

<Card title="3. Receive" accent="green">

On receipt, the node takes the element-wise **max** of its vector and the message's, then increments its own entry.

</Card>

</Cards>

## Comparing two vectors

<Callout type="neutral" title="The whole point">

- **A happened-before B** if every entry of A ≤ B and at least one is strictly less.
- **They're concurrent** if neither is ≤ the other — each has an entry the other doesn't dominate.

That "concurrent" case is exactly what a single Lamport counter can't detect — and it's where conflicts live.

</Callout>

## Where they're used

<Cards cols={2}>

<Card title="Conflict detection" accent="brand">

Dynamo-style stores (Amazon Dynamo, Riak, Voldemort) attach vector clocks to values. Concurrent writes are detected as **siblings** to be resolved.

</Card>

<Card title="Resolution" accent="purple">

Conflicts are merged by the application, by last-writer-wins, or with CRDTs — but only because the vector clock *flagged* them in the first place.

</Card>

</Cards>

<Callout type="warning" title="The cost">

A vector grows with the number of nodes/clients that ever write, so vectors can bloat. Real systems prune stale entries or use dotted version vectors to keep them bounded.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Vector clocks capture causality, not just an order
- They can distinguish causal from concurrent events
- Concurrency detection is the basis for conflict resolution

</Card>

<Card title="Design For" accent="brand">

- Use them when you must detect conflicting writes
- Plan to bound vector size as clients grow
- Pair with a merge strategy (app logic or CRDTs)

</Card>

</Cards>
$mdx$, $mdx$# Relógios Vetoriais

Um timestamp de Lamport pode dizer que o evento A *talvez* tenha acontecido antes de B — mas não se dois eventos foram realmente **concorrentes**. Os **relógios vetoriais** resolvem isso: capturam a causalidade com precisão, então você pode detectar quando duas atualizações aconteceram de forma independente e *conflitam*.

<Callout type="info" title="💡 Por que um único contador não basta">

Relógios de Lamport dão uma ordem total mas perdem informação: se `A < B` numericamente, você não sabe se A *causou* B ou se apenas aconteceram em alguma ordem. Relógios vetoriais preservam a relação causal completa.

</Callout>

## Como funcionam

Cada um dos N nós mantém um **vetor** de N contadores — um por nó.

<Cards cols={3}>

<Card title="1. Evento local" accent="brand">

Um nó incrementa a **sua própria** entrada no vetor a cada evento local.

</Card>

<Card title="2. Enviar" accent="purple">

Ao enviar uma mensagem, o nó anexa todo o seu vetor atual.

</Card>

<Card title="3. Receber" accent="green">

Ao receber, o nó pega o **máximo** elemento a elemento entre seu vetor e o da mensagem, depois incrementa a própria entrada.

</Card>

</Cards>

## Comparando dois vetores

<Callout type="neutral" title="O ponto central">

- **A aconteceu-antes de B** se toda entrada de A ≤ B e ao menos uma é estritamente menor.
- **São concorrentes** se nenhum é ≤ o outro — cada um tem uma entrada que o outro não domina.

Esse caso "concorrente" é exatamente o que um único contador de Lamport não consegue detectar — e é onde moram os conflitos.

</Callout>

## Onde são usados

<Cards cols={2}>

<Card title="Detecção de conflitos" accent="brand">

Stores estilo Dynamo (Amazon Dynamo, Riak, Voldemort) anexam relógios vetoriais aos valores. Escritas concorrentes são detectadas como **siblings** a serem resolvidas.

</Card>

<Card title="Resolução" accent="purple">

Conflitos são mesclados pela aplicação, por last-writer-wins ou com CRDTs — mas só porque o relógio vetorial os *sinalizou* em primeiro lugar.

</Card>

</Cards>

<Callout type="warning" title="O custo">

Um vetor cresce com o número de nós/clientes que já escreveram, então vetores podem inchar. Sistemas reais podam entradas obsoletas ou usam dotted version vectors para mantê-los limitados.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Relógios vetoriais capturam causalidade, não só uma ordem
- Conseguem distinguir eventos causais de concorrentes
- A detecção de concorrência é a base da resolução de conflitos

</Card>

<Card title="Projete para" accent="brand">

- Use quando precisar detectar escritas conflitantes
- Planeje limitar o tamanho do vetor conforme clientes crescem
- Combine com uma estratégia de merge (lógica da app ou CRDTs)

</Card>

</Cards>
$mdx$),
  ('data-storage/index', '/dados-armazenamento', 'data-storage', true, 81, NULL, true, 'Data & Storage', 'Dados e Armazenamento', $mdx$# Data & Storage

Every distributed system is, at its core, a system for **storing and moving data**. This module covers how data is spread across machines, how it is stored durably, and how it is found again quickly.

<Callout type="info" title="💡 Why this module">

Compute is easy to scale — you add more stateless servers. **State** is the hard part. The moment your data no longer fits on one machine (or one machine isn't reliable enough), you face partitioning, replication, and lookup problems that define the rest of system design.

</Callout>

## What you'll learn

<Cards cols={2}>

<Card title="Consistent Hashing" accent="brand">

Distribute keys across nodes so that adding or removing a node moves as few keys as possible. The backbone of distributed caches and databases.

</Card>

<Card title="Sharding & Partitioning" accent="purple">

Split a dataset across shards by range, hash, or directory — and learn why skew creates "hot" partitions.

</Card>

<Card title="Object & Blob Storage" accent="green">

How systems like S3 store trillions of objects durably and cheaply, and when to reach for it.

</Card>

<Card title="Distributed File Systems" accent="brand">

How GFS/HDFS chunk huge files across a cluster with replication and a metadata master.

</Card>

<Card title="Search & Inverted Index" accent="purple">

The data structure behind full-text search: map terms to documents instead of scanning everything.

</Card>

</Cards>

## The mental model

<Callout type="neutral" title="Three questions for any storage system">

1. **Where does a piece of data live?** (partitioning / placement)
2. **How many copies exist and where?** (replication / durability)
3. **How do I find it without scanning everything?** (indexing)

</Callout>

Keep these three questions in mind as you work through each topic — almost every storage design is a different set of answers to them.
$mdx$, $mdx$# Dados e Armazenamento

Todo sistema distribuído é, em sua essência, um sistema para **armazenar e mover dados**. Este módulo cobre como os dados são espalhados entre máquinas, como são armazenados de forma durável e como são encontrados rapidamente de novo.

<Callout type="info" title="💡 Por que este módulo">

Computação é fácil de escalar — você adiciona mais servidores sem estado. O **estado** é a parte difícil. No momento em que seus dados não cabem mais em uma única máquina (ou uma máquina não é confiável o suficiente), você enfrenta problemas de particionamento, replicação e busca que definem o resto do design de sistemas.

</Callout>

## O que você vai aprender

<Cards cols={2}>

<Card title="Consistent Hashing" accent="brand">

Distribua chaves entre nós de forma que adicionar ou remover um nó mova o mínimo de chaves possível. A base de caches e bancos de dados distribuídos.

</Card>

<Card title="Sharding e Particionamento" accent="purple">

Divida um conjunto de dados entre shards por faixa, hash ou diretório — e entenda por que a distribuição desigual cria partições "quentes".

</Card>

<Card title="Object & Blob Storage" accent="green">

Como sistemas como o S3 armazenam trilhões de objetos de forma durável e barata, e quando usá-los.

</Card>

<Card title="Sistemas de Arquivos Distribuídos" accent="brand">

Como GFS/HDFS dividem arquivos enormes em blocos por um cluster, com replicação e um master de metadados.

</Card>

<Card title="Busca e Índice Invertido" accent="purple">

A estrutura de dados por trás da busca textual: mapeie termos para documentos em vez de varrer tudo.

</Card>

</Cards>

## O modelo mental

<Callout type="neutral" title="Três perguntas para qualquer sistema de armazenamento">

1. **Onde vive cada pedaço de dado?** (particionamento / posicionamento)
2. **Quantas cópias existem e onde?** (replicação / durabilidade)
3. **Como encontro o dado sem varrer tudo?** (indexação)

</Callout>

Mantenha essas três perguntas em mente ao longo de cada tópico — quase todo design de armazenamento é um conjunto diferente de respostas para elas.
$mdx$),
  ('data-storage/consistent-hashing', '/dados-armazenamento/consistent-hashing', 'data-storage', true, 82, NULL, true, 'Consistent Hashing', 'Consistent Hashing', $mdx$# Consistent Hashing

You have keys (cache entries, user records) and a set of servers. You need a rule that maps each key to a server. The naive rule — `server = hash(key) % N` — works until `N` changes. Then **almost every key** moves to a different server, and your cache empties out in an instant.

<Callout type="warning" title="The modulo trap">

With `hash(key) % N`, going from 4 to 5 servers remaps roughly **80% of keys**. For a cache, that's a cache stampede; for a database, that's a massive rebalancing storm.

</Callout>

## The ring idea

Consistent hashing places both **servers** and **keys** on the same circular hash space (0 → 2³² → wraps to 0). A key is owned by the **first server clockwise** from the key's position.

<Cards cols={3}>

<Card title="1. Hash onto a ring" accent="brand">

Hash each server's identifier to a point on the circle. Hash each key the same way.

</Card>

<Card title="2. Walk clockwise" accent="purple">

Each key belongs to the next server found going clockwise around the ring.

</Card>

<Card title="3. Add/remove locally" accent="green">

When a server joins or leaves, only the keys in its arc move — roughly `1/N` of them, not all of them.

</Card>

</Cards>

## Virtual nodes: fixing lumpiness

A few servers on a ring rarely land evenly — one can own a huge arc and become a hotspot. The fix is **virtual nodes**: each physical server is hashed to *many* points on the ring.

<Callout type="success" title="Why virtual nodes matter">

More points per server = smoother distribution and gentler rebalancing. When a server dies, its load is spread across *many* neighbors instead of dumped on a single one. Typical systems use 100–200 virtual nodes per physical node.

</Callout>

## Where it's used

<Cards cols={2}>

<Card title="Caches & DBs" accent="brand">

Memcached clients, Amazon Dynamo, Cassandra, and Riak all use consistent hashing (or close variants) to place data.

</Card>

<Card title="Load balancing" accent="purple">

"Consistent hashing with bounded loads" routes requests to backends while keeping sticky affinity as the fleet changes.

</Card>

</Cards>

<Callout type="info" title="Try It: Consistent Hashing Simulator">

Add and remove nodes, tune the number of virtual nodes, and watch which keys get remapped — and what percentage moves — in the [Consistent Hashing Simulator](/dados-armazenamento/consistent-hashing/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Modulo hashing remaps everything when `N` changes
- The ring moves only `~1/N` of keys per topology change
- Virtual nodes smooth out load and failure impact

</Card>

<Card title="Design For" accent="brand">

- Pick enough virtual nodes for even distribution
- Make server identifiers stable across restarts
- Combine with replication (store on the next R nodes)

</Card>

</Cards>
$mdx$, $mdx$# Consistent Hashing

Você tem chaves (entradas de cache, registros de usuários) e um conjunto de servidores. Você precisa de uma regra que mapeie cada chave para um servidor. A regra ingênua — `servidor = hash(chave) % N` — funciona até que `N` mude. Aí **quase todas as chaves** mudam de servidor, e seu cache esvazia num instante.

<Callout type="warning" title="A armadilha do módulo">

Com `hash(chave) % N`, ir de 4 para 5 servidores remapeia cerca de **80% das chaves**. Para um cache, isso é uma debandada de cache; para um banco, é uma tempestade massiva de rebalanceamento.

</Callout>

## A ideia do anel

O consistent hashing coloca tanto **servidores** quanto **chaves** no mesmo espaço circular de hash (0 → 2³² → volta a 0). Uma chave pertence ao **primeiro servidor no sentido horário** a partir da posição da chave.

<Cards cols={3}>

<Card title="1. Hash no anel" accent="brand">

Aplique hash no identificador de cada servidor para um ponto no círculo. Faça o mesmo com cada chave.

</Card>

<Card title="2. Ande no sentido horário" accent="purple">

Cada chave pertence ao próximo servidor encontrado seguindo o anel no sentido horário.

</Card>

<Card title="3. Mudanças locais" accent="green">

Quando um servidor entra ou sai, só as chaves do seu arco se movem — cerca de `1/N` delas, não todas.

</Card>

</Cards>

## Nós virtuais: corrigindo a desigualdade

Poucos servidores no anel raramente caem de forma uniforme — um pode dominar um arco enorme e virar um gargalo. A solução são os **nós virtuais**: cada servidor físico recebe *muitos* pontos no anel.

<Callout type="success" title="Por que nós virtuais importam">

Mais pontos por servidor = distribuição mais suave e rebalanceamento mais gentil. Quando um servidor morre, sua carga se espalha por *muitos* vizinhos em vez de cair num só. Sistemas típicos usam 100–200 nós virtuais por nó físico.

</Callout>

## Onde é usado

<Cards cols={2}>

<Card title="Caches e Bancos" accent="brand">

Clientes Memcached, Amazon Dynamo, Cassandra e Riak usam consistent hashing (ou variantes próximas) para posicionar dados.

</Card>

<Card title="Balanceamento de carga" accent="purple">

"Consistent hashing com cargas limitadas" roteia requisições para backends mantendo afinidade conforme a frota muda.

</Card>

</Cards>

<Callout type="info" title="Experimente: Simulador de Consistent Hashing">

Adicione e remova nós, ajuste o número de nós virtuais e veja quais chaves são remapeadas — e qual percentual se move — no [Simulador de Consistent Hashing](/dados-armazenamento/consistent-hashing/simulator).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Hash com módulo remapeia tudo quando `N` muda
- O anel move apenas `~1/N` das chaves por mudança de topologia
- Nós virtuais suavizam a carga e o impacto de falhas

</Card>

<Card title="Projete para" accent="brand">

- Escolha nós virtuais suficientes para distribuição uniforme
- Mantenha identificadores de servidor estáveis entre reinícios
- Combine com replicação (armazene nos próximos R nós)

</Card>

</Cards>
$mdx$),
  ('data-storage/sharding-partitioning', '/dados-armazenamento/sharding', 'data-storage', true, 83, NULL, true, 'Sharding & Partitioning', 'Sharding e Particionamento', $mdx$# Sharding & Partitioning

When a dataset outgrows a single machine, you split it into **partitions** (a.k.a. **shards**), each living on a different node. The art is choosing *how* to split so that load spreads evenly and queries stay fast.

<Callout type="info" title="💡 Partition vs Replica">

**Partitioning** splits *different* data across nodes (scale). **Replication** copies the *same* data across nodes (availability). Real systems do both: partition first, then replicate each partition.

</Callout>

## Partitioning strategies

<Cards cols={3}>

<Card title="Range" accent="brand">

Assign contiguous key ranges to shards (A–F, G–M, …). Great for range scans, but sequential keys (timestamps, auto-increment IDs) all land on one shard — a hotspot.

</Card>

<Card title="Hash" accent="purple">

Place each key by `hash(key)`. Spreads load evenly and kills hotspots — but range queries now hit every shard.

</Card>

<Card title="Directory" accent="green">

A lookup service maps keys → shards explicitly. Maximum flexibility (rebalance freely) at the cost of a lookup hop and a service to maintain.

</Card>

</Cards>

## The hot-shard problem

Even with a good strategy, real workloads are **skewed**. A celebrity user, a viral product, or a "today" timestamp can send a disproportionate share of traffic to one shard.

<Callout type="warning" title="Symptoms of a hot shard">

One node at 95% CPU while the rest idle; tail latency dominated by a single partition; a "fan-out" query that's only as fast as its slowest shard.

</Callout>

<Cards cols={2}>

<Card title="Mitigations" accent="green">

- Add a random/derived suffix to spread a hot key
- Split the hot shard into smaller ranges
- Cache the hot keys in front of storage
- Use hash partitioning to avoid sequential hotspots

</Card>

<Card title="Rebalancing" accent="brand">

- Pre-split into many more partitions than nodes
- Move whole partitions, not individual keys
- Throttle moves so they don't starve live traffic

</Card>

</Cards>

<Callout type="success" title="Try It: Sharding Simulator">

Stream keys into shards under range vs hash partitioning, crank up the skew, and watch a hot shard emerge — then compare the imbalance metric across strategies in the [Sharding Simulator](/dados-armazenamento/sharding/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Hash spreads load; range enables scans — pick per access pattern
- Skew creates hot shards no matter the strategy
- Over-partition up front to make rebalancing cheap

</Card>

<Card title="Design For" accent="brand">

- Choose a partition key that matches your queries
- Plan for resharding before you need it
- Monitor per-shard load, not just cluster averages

</Card>

</Cards>
$mdx$, $mdx$# Sharding e Particionamento

Quando um conjunto de dados ultrapassa uma única máquina, você o divide em **partições** (também chamadas **shards**), cada uma vivendo em um nó diferente. A arte está em escolher *como* dividir para que a carga se espalhe de forma uniforme e as consultas continuem rápidas.

<Callout type="info" title="💡 Partição vs Réplica">

**Particionamento** divide dados *diferentes* entre nós (escala). **Replicação** copia os *mesmos* dados entre nós (disponibilidade). Sistemas reais fazem os dois: particionam primeiro, depois replicam cada partição.

</Callout>

## Estratégias de particionamento

<Cards cols={3}>

<Card title="Faixa (Range)" accent="brand">

Atribui faixas contíguas de chaves a shards (A–F, G–M, …). Ótimo para varreduras por faixa, mas chaves sequenciais (timestamps, IDs auto-incremento) caem todas num shard — um gargalo.

</Card>

<Card title="Hash" accent="purple">

Posiciona cada chave por `hash(chave)`. Espalha a carga uniformemente e elimina gargalos — mas consultas por faixa agora atingem todos os shards.

</Card>

<Card title="Diretório" accent="green">

Um serviço de lookup mapeia chaves → shards explicitamente. Flexibilidade máxima (rebalanceie livremente) ao custo de um salto de lookup e de um serviço a manter.

</Card>

</Cards>

## O problema do shard quente

Mesmo com uma boa estratégia, cargas reais são **desiguais**. Um usuário celebridade, um produto viral ou um timestamp de "hoje" podem mandar uma fatia desproporcional de tráfego para um shard.

<Callout type="warning" title="Sintomas de um shard quente">

Um nó a 95% de CPU enquanto o resto está ocioso; latência de cauda dominada por uma única partição; uma consulta "fan-out" que é tão rápida quanto seu shard mais lento.

</Callout>

<Cards cols={2}>

<Card title="Mitigações" accent="green">

- Adicione um sufixo aleatório/derivado para espalhar uma chave quente
- Divida o shard quente em faixas menores
- Coloque cache na frente do armazenamento para as chaves quentes
- Use particionamento por hash para evitar gargalos sequenciais

</Card>

<Card title="Rebalanceamento" accent="brand">

- Pré-divida em muito mais partições do que nós
- Mova partições inteiras, não chaves individuais
- Limite a taxa dos movimentos para não sufocar o tráfego ao vivo

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Sharding">

Envie chaves para shards com particionamento por faixa vs hash, aumente a desigualdade e veja um shard quente surgir — depois compare a métrica de desbalanceamento entre estratégias no [Simulador de Sharding](/dados-armazenamento/sharding/simulator).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Hash espalha a carga; faixa permite varreduras — escolha pelo padrão de acesso
- Desigualdade cria shards quentes independente da estratégia
- Super-particione no início para tornar o rebalanceamento barato

</Card>

<Card title="Projete para" accent="brand">

- Escolha uma chave de partição que combine com suas consultas
- Planeje o resharding antes de precisar dele
- Monitore a carga por shard, não só médias do cluster

</Card>

</Cards>
$mdx$),
  ('data-storage/object-storage', '/dados-armazenamento/object-storage', 'data-storage', true, 84, NULL, true, 'Object & Blob Storage', 'Object & Blob Storage', $mdx$# Object & Blob Storage

Object storage (Amazon S3, Google Cloud Storage, Azure Blob) is how the modern internet stores **unstructured data at massive scale** — images, videos, backups, logs, data-lake files, and static website assets.

<Callout type="info" title="💡 Objects, not files">

Object storage isn't a filesystem and isn't a database. Each object is an opaque blob + metadata, addressed by a **key** inside a flat **bucket**. There are no real folders — `photos/2026/cat.jpg` is just a key with slashes.

</Callout>

## Why it scales so well

<Cards cols={3}>

<Card title="Flat namespace" accent="brand">

No directory tree to traverse or lock. A key maps to an object via hashing/partitioning, so the system scales to trillions of objects.

</Card>

<Card title="HTTP API" accent="purple">

Simple `PUT`/`GET`/`DELETE` over HTTP. No mount, no client driver — any service or browser can talk to it.

</Card>

<Card title="Immutable objects" accent="green">

Objects are replaced whole, not edited in place. That makes caching, versioning, and replication far simpler.

</Card>

</Cards>

## Durability & availability

Providers advertise eye-watering durability (e.g. "eleven nines", 99.999999999%). That comes from **erasure coding** and cross-zone replication.

<Callout type="neutral" title="Replication vs erasure coding">

- **Replication**: keep N full copies. Simple, fast reads, but N× storage cost.
- **Erasure coding**: split an object into `k` data + `m` parity fragments across nodes; tolerate losing any `m`. Survives failures at a fraction of the storage overhead — the default for cold/large data.

</Callout>

## Consistency & tradeoffs

<Cards cols={2}>

<Card title="Strengths" accent="green">

- Cheap per GB, especially cold tiers
- Effectively unlimited capacity
- Strong read-after-write consistency (modern S3)
- Built-in versioning, lifecycle, and replication

</Card>

<Card title="Limitations" accent="red">

- Higher latency than block/file storage
- No partial/in-place edits or appends
- No POSIX semantics (no rename, no locking)
- Per-request cost adds up for tiny objects

</Card>

</Cards>

## When to use it

<Callout type="success" title="Reach for object storage when…">

You need durable, cheap storage for large or numerous blobs accessed over HTTP — media, backups, ML datasets, data lakes, and static assets behind a CDN. Reach for a **database** for queryable structured data, and **block storage** for low-latency random writes (like a database's own disk).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Flat keyed buckets + HTTP = near-infinite scale
- Durability comes from erasure coding + replication
- Objects are immutable; replace, don't edit

</Card>

<Card title="Design For" accent="brand">

- Use storage tiers (hot/cold/archive) to cut cost
- Put a CDN in front for read-heavy public assets
- Batch tiny objects; avoid per-request overhead

</Card>

</Cards>
$mdx$, $mdx$# Object & Blob Storage

O armazenamento de objetos (Amazon S3, Google Cloud Storage, Azure Blob) é como a internet moderna guarda **dados não estruturados em escala massiva** — imagens, vídeos, backups, logs, arquivos de data lake e assets estáticos de sites.

<Callout type="info" title="💡 Objetos, não arquivos">

Armazenamento de objetos não é um sistema de arquivos nem um banco de dados. Cada objeto é um blob opaco + metadados, endereçado por uma **chave** dentro de um **bucket** plano. Não há pastas de verdade — `fotos/2026/gato.jpg` é só uma chave com barras.

</Callout>

## Por que escala tão bem

<Cards cols={3}>

<Card title="Namespace plano" accent="brand">

Não há árvore de diretórios para percorrer ou travar. Uma chave mapeia para um objeto via hashing/particionamento, então o sistema escala para trilhões de objetos.

</Card>

<Card title="API HTTP" accent="purple">

`PUT`/`GET`/`DELETE` simples sobre HTTP. Sem mount, sem driver de cliente — qualquer serviço ou navegador conversa com ele.

</Card>

<Card title="Objetos imutáveis" accent="green">

Objetos são substituídos por inteiro, não editados no lugar. Isso torna cache, versionamento e replicação muito mais simples.

</Card>

</Cards>

## Durabilidade e disponibilidade

Provedores anunciam durabilidades impressionantes (ex.: "onze noves", 99,999999999%). Isso vem de **erasure coding** e replicação entre zonas.

<Callout type="neutral" title="Replicação vs erasure coding">

- **Replicação**: mantenha N cópias completas. Simples, leituras rápidas, mas custo de armazenamento N×.
- **Erasure coding**: divida um objeto em `k` fragmentos de dados + `m` de paridade entre nós; tolere perder até `m`. Sobrevive a falhas com uma fração do custo extra — o padrão para dados frios/grandes.

</Callout>

## Consistência e tradeoffs

<Cards cols={2}>

<Card title="Pontos fortes" accent="green">

- Barato por GB, especialmente camadas frias
- Capacidade praticamente ilimitada
- Consistência forte read-after-write (S3 moderno)
- Versionamento, lifecycle e replicação embutidos

</Card>

<Card title="Limitações" accent="red">

- Latência maior que block/file storage
- Sem edições parciais/no lugar ou appends
- Sem semântica POSIX (sem rename, sem locking)
- Custo por requisição pesa para objetos minúsculos

</Card>

</Cards>

## Quando usar

<Callout type="success" title="Use object storage quando…">

Você precisa de armazenamento durável e barato para blobs grandes ou numerosos acessados via HTTP — mídia, backups, datasets de ML, data lakes e assets estáticos atrás de uma CDN. Use um **banco de dados** para dados estruturados consultáveis e **block storage** para escritas aleatórias de baixa latência (como o disco do próprio banco).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Buckets planos por chave + HTTP = escala quase infinita
- Durabilidade vem de erasure coding + replicação
- Objetos são imutáveis; substitua, não edite

</Card>

<Card title="Projete para" accent="brand">

- Use camadas de armazenamento (quente/frio/arquivo) para cortar custo
- Coloque uma CDN na frente para assets públicos com muita leitura
- Agrupe objetos minúsculos; evite overhead por requisição

</Card>

</Cards>
$mdx$),
  ('data-storage/distributed-file-systems', '/dados-armazenamento/distributed-file-systems', 'data-storage', true, 85, NULL, true, 'Distributed File Systems', 'Sistemas de Arquivos Distribuídos', $mdx$# Distributed File Systems

A distributed file system (DFS) presents many machines' disks as **one giant file system**. The canonical designs — Google File System (GFS) and its open-source cousin HDFS — were built to store petabyte files and stream them to data-processing jobs.

<Callout type="info" title="💡 Built for big, sequential reads">

GFS/HDFS optimize for **huge files** read **sequentially** by batch jobs, not for many tiny files or random writes. That single assumption shapes the entire architecture.

</Callout>

## The architecture

<Cards cols={2}>

<Card title="Master / NameNode" accent="brand">

A single metadata server tracks the namespace and which chunks live where. It never touches file *data* — only the map. Keeping metadata in RAM makes lookups fast.

</Card>

<Card title="Chunkservers / DataNodes" accent="purple">

Worker nodes store the actual data as large fixed-size **chunks/blocks** (64–128 MB). Clients read and write chunk data directly to them, bypassing the master.

</Card>

</Cards>

## How a file is stored

<Cards cols={3}>

<Card title="1. Split into chunks" accent="brand">

A big file is cut into large blocks. Large blocks mean fewer metadata entries and long sequential reads.

</Card>

<Card title="2. Replicate" accent="purple">

Each chunk is replicated (typically 3×) across different nodes and racks for durability and read parallelism.

</Card>

<Card title="3. Locate via master" accent="green">

A client asks the master *where* a chunk lives, then streams data straight from a chunkserver — the master stays out of the data path.

</Card>

</Cards>

## Key design decisions

<Callout type="neutral" title="Why these choices">

- **Large chunks** reduce master metadata and seek overhead for streaming workloads.
- **Master out of the data path** prevents it from becoming a bandwidth bottleneck.
- **Replication across racks** survives disk, node, and rack failures.
- **Append-optimized** writes match log/ingest patterns better than random updates.

</Callout>

## Tradeoffs & evolution

<Cards cols={2}>

<Card title="Strengths" accent="green">

- Massive throughput for sequential scans
- Cheap commodity disks, fault-tolerant by design
- Simple model that powers MapReduce/Spark

</Card>

<Card title="Weaknesses" accent="red">

- A single master limits the file/metadata count
- Poor fit for many small files or low-latency random I/O
- The master is a scaling and failure focal point (mitigated by HA standbys / federation)

</Card>

</Cards>

<Callout type="success" title="DFS vs Object Storage">

Object storage (S3) has largely replaced DFS for *durable, cheap* blob storage with an HTTP API. DFS still shines where compute runs **next to** the data (data locality) for high-throughput analytics. Many modern stacks read directly from object storage instead.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Metadata master + data-holding workers is the core pattern
- Large replicated chunks enable durable, high-throughput reads
- Keep the master off the data path

</Card>

<Card title="Design For" accent="brand">

- Favor large files and sequential access
- Replicate across failure domains (racks/zones)
- Consider object storage when you don't need data locality

</Card>

</Cards>
$mdx$, $mdx$# Sistemas de Arquivos Distribuídos

Um sistema de arquivos distribuído (DFS) apresenta os discos de muitas máquinas como **um único sistema de arquivos gigante**. Os designs canônicos — Google File System (GFS) e seu primo open-source HDFS — foram criados para armazenar arquivos de petabytes e transmiti-los para jobs de processamento de dados.

<Callout type="info" title="💡 Feito para leituras grandes e sequenciais">

GFS/HDFS otimizam para **arquivos enormes** lidos **sequencialmente** por jobs em lote, não para muitos arquivos pequenos ou escritas aleatórias. Essa única premissa molda toda a arquitetura.

</Callout>

## A arquitetura

<Cards cols={2}>

<Card title="Master / NameNode" accent="brand">

Um servidor de metadados único rastreia o namespace e onde cada chunk vive. Ele nunca toca nos *dados* do arquivo — só no mapa. Manter os metadados em RAM torna as buscas rápidas.

</Card>

<Card title="Chunkservers / DataNodes" accent="purple">

Nós trabalhadores armazenam os dados reais como **chunks/blocos** grandes de tamanho fixo (64–128 MB). Clientes leem e escrevem os dados diretamente neles, contornando o master.

</Card>

</Cards>

## Como um arquivo é armazenado

<Cards cols={3}>

<Card title="1. Dividir em chunks" accent="brand">

Um arquivo grande é cortado em blocos grandes. Blocos grandes significam menos entradas de metadados e leituras sequenciais longas.

</Card>

<Card title="2. Replicar" accent="purple">

Cada chunk é replicado (tipicamente 3×) entre nós e racks diferentes para durabilidade e paralelismo de leitura.

</Card>

<Card title="3. Localizar via master" accent="green">

Um cliente pergunta ao master *onde* um chunk vive, depois transmite os dados direto de um chunkserver — o master fica fora do caminho de dados.

</Card>

</Cards>

## Decisões-chave de design

<Callout type="neutral" title="Por que essas escolhas">

- **Chunks grandes** reduzem metadados no master e overhead de seek para cargas de streaming.
- **Master fora do caminho de dados** evita que ele vire gargalo de banda.
- **Replicação entre racks** sobrevive a falhas de disco, nó e rack.
- Escritas **otimizadas para append** combinam melhor com padrões de log/ingestão do que updates aleatórios.

</Callout>

## Tradeoffs e evolução

<Cards cols={2}>

<Card title="Pontos fortes" accent="green">

- Throughput massivo para varreduras sequenciais
- Discos commodity baratos, tolerante a falhas por design
- Modelo simples que sustenta MapReduce/Spark

</Card>

<Card title="Fraquezas" accent="red">

- Um master único limita a contagem de arquivos/metadados
- Ruim para muitos arquivos pequenos ou I/O aleatório de baixa latência
- O master é foco de escala e falha (mitigado por standbys HA / federação)

</Card>

</Cards>

<Callout type="success" title="DFS vs Object Storage">

O armazenamento de objetos (S3) substituiu largamente o DFS para armazenamento de blobs *durável e barato* com API HTTP. O DFS ainda brilha onde a computação roda **ao lado** dos dados (localidade de dados) para analytics de alto throughput. Muitas stacks modernas leem direto do object storage.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Master de metadados + workers com os dados é o padrão central
- Chunks grandes replicados permitem leituras duráveis e de alto throughput
- Mantenha o master fora do caminho de dados

</Card>

<Card title="Projete para" accent="brand">

- Prefira arquivos grandes e acesso sequencial
- Replique entre domínios de falha (racks/zonas)
- Considere object storage quando não precisar de localidade de dados

</Card>

</Cards>
$mdx$),
  ('data-storage/search-inverted-index', '/dados-armazenamento/inverted-index', 'data-storage', true, 86, NULL, true, 'Search & the Inverted Index', 'Busca e o Índice Invertido', $mdx$# Search & the Inverted Index

How does a search engine find the few documents containing "distributed consensus" among billions — in milliseconds? Not by reading every document. It reads an **inverted index**.

<Callout type="info" title="💡 Flip the mapping">

A normal (forward) index maps **document → its words**. An **inverted index** maps **word → the documents that contain it**. To answer a query you just look up each query term and combine the lists — no full scan needed.

</Callout>

## Building the index

<Cards cols={3}>

<Card title="1. Tokenize" accent="brand">

Break each document into terms: lowercase, split on whitespace/punctuation, drop very common stop-words.

</Card>

<Card title="2. Normalize" accent="purple">

Stem or lemmatize ("running" → "run") so different forms of a word match the same term.

</Card>

<Card title="3. Build postings" accent="green">

For each term, store a sorted **postings list** of the document IDs (often with positions and frequencies) where it appears.

</Card>

</Cards>

## Answering a query

<Callout type="neutral" title="Lookup, then combine">

- **AND** query: intersect the postings lists of all terms (documents containing *every* term).
- **OR** query: union the lists (documents containing *any* term).
- Lists are kept sorted so intersection/union is a fast merge, skipping ahead with "skip pointers".

</Callout>

## Ranking the results

Matching isn't enough — you must order results by relevance. Classic scoring uses **TF-IDF** / **BM25**:

<Cards cols={2}>

<Card title="Term frequency (TF)" accent="brand">

A term that appears more often in a document signals that document is more about it — with diminishing returns.

</Card>

<Card title="Inverse document frequency (IDF)" accent="purple">

A term appearing in *few* documents is more discriminating. "the" tells you nothing; "raft" tells you a lot.

</Card>

</Cards>

<Callout type="success" title="Try It: Inverted Index Simulator">

Pick query terms, switch between AND/OR, and watch the postings lists light up while matching documents rank by score in the [Inverted Index Simulator](/dados-armazenamento/inverted-index/simulator).

</Callout>

## At scale

<Callout type="neutral" title="Sharding the index">

Search engines like Elasticsearch/Lucene split the index into **shards** (by document) and replicate them. A query fans out to every shard, each returns its top results, and a coordinator merges them — the same partition + replicate pattern from the rest of this module.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Inverted index = term → documents, the heart of search
- Postings lists make multi-term queries a fast merge
- Ranking (TF-IDF/BM25) turns matches into relevance

</Card>

<Card title="Design For" accent="brand">

- Normalize text consistently at index and query time
- Shard by document and fan out queries
- Separate "did it match" from "how relevant"

</Card>

</Cards>
$mdx$, $mdx$# Busca e o Índice Invertido

Como um motor de busca encontra os poucos documentos que contêm "consenso distribuído" entre bilhões — em milissegundos? Não lendo cada documento. Ele lê um **índice invertido**.

<Callout type="info" title="💡 Inverta o mapeamento">

Um índice normal (direto) mapeia **documento → suas palavras**. Um **índice invertido** mapeia **palavra → os documentos que a contêm**. Para responder uma consulta, basta buscar cada termo e combinar as listas — sem varredura completa.

</Callout>

## Construindo o índice

<Cards cols={3}>

<Card title="1. Tokenizar" accent="brand">

Quebre cada documento em termos: minúsculas, separe por espaços/pontuação, descarte stop-words muito comuns.

</Card>

<Card title="2. Normalizar" accent="purple">

Aplique stemming ou lematização ("correndo" → "correr") para que formas diferentes de uma palavra casem com o mesmo termo.

</Card>

<Card title="3. Montar postings" accent="green">

Para cada termo, guarde uma **lista de postings** ordenada com os IDs dos documentos (muitas vezes com posições e frequências) onde ele aparece.

</Card>

</Cards>

## Respondendo uma consulta

<Callout type="neutral" title="Busque, depois combine">

- Consulta **AND**: intersecte as listas de postings de todos os termos (documentos que contêm *todos* os termos).
- Consulta **OR**: una as listas (documentos que contêm *qualquer* termo).
- As listas ficam ordenadas para que interseção/união sejam um merge rápido, pulando à frente com "skip pointers".

</Callout>

## Ordenando os resultados

Casar não basta — você precisa ordenar por relevância. A pontuação clássica usa **TF-IDF** / **BM25**:

<Cards cols={2}>

<Card title="Frequência do termo (TF)" accent="brand">

Um termo que aparece mais vezes em um documento sinaliza que o documento é mais sobre ele — com retornos decrescentes.

</Card>

<Card title="Frequência inversa (IDF)" accent="purple">

Um termo que aparece em *poucos* documentos é mais discriminante. "o" não diz nada; "raft" diz muito.

</Card>

</Cards>

<Callout type="success" title="Experimente: Simulador de Índice Invertido">

Escolha termos de consulta, alterne entre AND/OR e veja as listas de postings acenderem enquanto os documentos correspondentes são ranqueados por pontuação no [Simulador de Índice Invertido](/dados-armazenamento/inverted-index/simulator).

</Callout>

## Em escala

<Callout type="neutral" title="Particionando o índice">

Motores de busca como Elasticsearch/Lucene dividem o índice em **shards** (por documento) e os replicam. Uma consulta se espalha por todos os shards, cada um devolve seus melhores resultados, e um coordenador os mescla — o mesmo padrão de particionar + replicar do resto deste módulo.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Índice invertido = termo → documentos, o coração da busca
- Listas de postings tornam consultas multi-termo um merge rápido
- Ranking (TF-IDF/BM25) transforma correspondências em relevância

</Card>

<Card title="Projete para" accent="brand">

- Normalize o texto de forma consistente na indexação e na consulta
- Particione por documento e espalhe as consultas
- Separe "casou?" de "quão relevante?"

</Card>

</Cards>
$mdx$),
  ('design-principles/index', '/principios-design', 'design', true, 25, NULL, true, 'Design Principles', 'Princípios de Design', $mdx$# Design Principles

Explore the fundamental principles that guide the creation of distributed systems

<Callout type="info">

Each principle addresses crucial aspects of modern distributed systems design. Understand how to apply them to build scalable and resilient systems.

</Callout>

<Cards cols={2}>

<Card emoji="🔽" title="Event-Driven Development" accent="purple">

Event Sourcing and distributed event systems.

[Event-Driven Development](/principios-design/eventos)

- Events
- Asynchronous

</Card>

<Card emoji="🧩" title="Service-Oriented Design" accent="green">

Microservices vs Monolithic Architecture.

[Service-Oriented Design](/principios-design/servicos)

- Services
- Architecture

</Card>

<Card emoji="⚠️" title="Fault Tolerance" accent="yellow">

Retries, Circuit Breakers, Timeout and Fallback.

[Fault Tolerance](/principios-design/tolerancia-falhas)

- Resilience
- Recovery

</Card>

<Card emoji="📈" title="Design for Scalability" accent="red">

Horizontal and vertical scalability.

[Design for Scalability](/principios-design/escalabilidade)

- Growth
- Performance

</Card>

<Card emoji="✅" title="High Availability" accent="brand">

Availability zones and replication.

[High Availability](/principios-design/disponibilidade)

- Uptime
- Replication

</Card>

</Cards>
$mdx$, $mdx$# Princípios de Design

Explore os princípios fundamentais que orientam a criação de sistemas distribuídos

<Callout type="info">

Cada princípio aborda aspectos cruciais do design de sistemas distribuídos modernos. Entenda como aplicá-los para criar sistemas escaláveis e resilientes.

</Callout>

<Cards cols={2}>

<Card emoji="🔽" title="Desenvolvimento Orientado a Eventos" accent="purple">

Event Sourcing e sistemas de eventos distribuídos.

[Desenvolvimento Orientado a Eventos](/principios-design/eventos)

- Eventos
- Assíncrono

</Card>

<Card emoji="🧩" title="Design Orientado a Serviços" accent="green">

Microsserviços vs Arquitetura Monolítica.

[Design Orientado a Serviços](/principios-design/servicos)

- Serviços
- Arquitetura

</Card>

<Card emoji="⚠️" title="Tolerância a Falhas" accent="yellow">

Retries, Circuit Breakers, Timeout e Fallback.

[Tolerância a Falhas](/principios-design/tolerancia-falhas)

- Resiliência
- Recuperação

</Card>

<Card emoji="📈" title="Design para Escalabilidade" accent="red">

Escalabilidade horizontal e vertical.

[Design para Escalabilidade](/principios-design/escalabilidade)

- Crescimento
- Performance

</Card>

<Card emoji="✅" title="Alta Disponibilidade" accent="brand">

Zonas de disponibilidade e replicação.

[Alta Disponibilidade](/principios-design/disponibilidade)

- Uptime
- Replicação

</Card>

</Cards>
$mdx$),
  ('design-principles/event-driven', '/principios-design/eventos', 'design', true, 26, NULL, true, 'Event-Driven Development', 'Desenvolvimento Orientado a Eventos', $mdx$# Event-Driven Development

Event-driven development is an approach where actions and changes in the system are triggered and managed by events. An event is any significant action that occurs in the system, such as a purchase transaction or a database update.

## Event Sourcing

Event sourcing is a design pattern in which the state of a system is derived from a sequence of events, instead of a stored current state. Each state change is captured as an immutable event, and the system can be rebuilt at any time by replaying these events.

### Advantages

- Complete history of changes in the system
- Easy to audit and track actions
- Support for reverting or replaying events

### Example

An e-commerce system where each update to an order status (placed, processed, shipped) is recorded as an event. The final state of the order is determined by the sequence of events.

## Distributed Event Systems

Distributed event systems allow different parts of a system (often on different servers) to communicate and synchronize based on events. They are essential for asynchronous systems where different components can react to events in a decentralized manner.

### Popular Tools

- Apache Kafka
- RabbitMQ
- Amazon SNS

### Example

A payment application that publishes payment confirmation events, which are consumed by different services to update inventory, notify the user, and generate invoices.

<Callout type="info" title="Interactive Simulator">

Try our interactive Event Sourcing simulation to better understand how events are recorded and processed in a distributed system.

[Access Simulator](/principios-design/eventos/simulator)

</Callout>
$mdx$, $mdx$# Desenvolvimento Orientado a Eventos

O desenvolvimento orientado a eventos é uma abordagem em que as ações e mudanças no sistema são desencadeadas e gerenciadas por eventos. Um evento é qualquer ação significativa que ocorra no sistema, como uma transação de compra ou a atualização de um banco de dados.

## Event Sourcing

O event sourcing é um padrão de design em que o estado de um sistema é derivado de uma sequência de eventos, em vez de um estado atual armazenado. Cada mudança de estado é capturada como um evento imutável, e o sistema pode ser reconstruído a qualquer momento ao reproduzir esses eventos.

### Vantagens

- Histórico completo de mudanças no sistema
- Fácil de auditar e rastrear ações
- Suporte para reverter ou "replays" de eventos

### Exemplo

Um sistema de e-commerce em que cada atualização do estado de um pedido (pedido realizado, processado, enviado) é registrado como um evento. O estado final do pedido é determinado pela sequência de eventos.

## Sistemas de Eventos Distribuídos

Sistemas de eventos distribuídos permitem que diferentes partes de um sistema (frequentemente em diferentes servidores) se comuniquem e sincronizem com base em eventos. Eles são fundamentais para sistemas assíncronos, onde diferentes componentes podem reagir a eventos de maneira descentralizada.

### Ferramentas Populares

- Apache Kafka
- RabbitMQ
- Amazon SNS

### Exemplo

Uma aplicação de pagamento que publica eventos de confirmação de pagamento, os quais são consumidos por diferentes serviços para atualizar inventário, notificar o usuário e gerar faturas.

<Callout type="info" title="Simulador Interativo">

Experimente nossa simulação interativa de Event Sourcing para entender melhor como os eventos são registrados e processados em um sistema distribuído.

[Acessar Simulador](/principios-design/eventos/simulator)

</Callout>
$mdx$),
  ('design-principles/coupling', '/principios-design/acoplamento', 'design', true, 27, NULL, true, 'Coupling in Distributed Systems', 'Acoplamento em Sistemas Distribuídos', $mdx$# Coupling in Distributed Systems

Coupling measures how tightly components in a system are connected or dependent. In distributed systems, its type and level have a strong impact on flexibility, maintainability, and resilience.

<Callout type="info" title="💡 Key Concept">

Lower coupling increases flexibility and maintainability, but extremely low coupling can add complexity. Balance is essential.

</Callout>

## Types of Coupling

### Static Coupling

O acoplamento estático ocorre quando componentes são conectados em tempo de compilação, criando dependências rígidas que são difíceis de modificar sem alterar o código.

<Cards cols={2}>

<Card title="Characteristics" accent="brand">

- **Dependências Diretas** — Referências explícitas a classes ou módulos específicos
- **Verificação em Tempo de Compilação** — Erros são detectados antes da execução
- **Menor Flexibilidade** — Mudanças requerem recompilação e reimplantação

</Card>

<Card title="Advantages" accent="brand">

**Vantagens**

- Detecção precoce de erros
- Melhor performance em tempo de execução
- Mais fácil de entender e rastrear

**Desvantagens**

- Menor flexibilidade para mudanças
- Maior dificuldade de manutenção
- Menor resiliência a falhas

</Card>

</Cards>

**Static Coupling Example:**

```ts
// Acoplamento estático através de importação direta
import { UserService } from './UserService';

class OrderProcessor {
  private userService: UserService;

  constructor() {
    // Dependência direta e fixa
    this.userService = new UserService();
  }

  async processOrder(orderId: string) {
    // Se UserService estiver indisponível, não há alternativa
    const user = await this.userService.getUser(orderId);
    // Processamento do pedido...
  }
}
```

### Dynamic Coupling

O acoplamento dinâmico permite que componentes sejam conectados em tempo de execução, oferecendo maior flexibilidade e facilitando mudanças sem necessidade de recompilação.

<Cards cols={2}>

<Card title="Characteristics" accent="purple">

- **Descoberta em Runtime** — Serviços são descobertos e conectados dinamicamente
- **Maior Flexibilidade** — Facilidade para trocar implementações em runtime
- **Resiliência** — Melhor adaptação a falhas e mudanças

</Card>

<Card title="Advantages / Disadvantages" accent="purple">

**Vantagens**

- Maior flexibilidade e adaptabilidade
- Melhor resiliência a falhas
- Facilidade de manutenção e evolução

**Desvantagens**

- Maior complexidade de implementação
- Possíveis falhas em tempo de execução
- Overhead de performance

</Card>

</Cards>

**Dynamic Coupling Example:**

```ts
// Acoplamento dinâmico usando injeção de dependência e service discovery
interface UserServiceInterface {
  getUser(id: string): Promise<User>;
}

class OrderProcessor {
  private userService: UserServiceInterface;
  private serviceRegistry: ServiceRegistry;

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  async processOrder(orderId: string) {
    try {
      // Descoberta dinâmica do serviço
      this.userService = await this.serviceRegistry.getService('UserService');
      const user = await this.userService.getUser(orderId);
    } catch (error) {
      // Fallback para serviço alternativo
      this.userService = await this.serviceRegistry.getBackupService('UserService');
      const user = await this.userService.getUser(orderId);
    }
    // Processamento do pedido...
  }
}
```

### Service Discovery

Service Discovery is a fundamental pattern to enable dynamic coupling in distributed systems. It lets services find and communicate with each other without prior knowledge of locations.

<Cards cols={2}>

<Card title="Main Components" accent="green">

- **Registro de Serviços** — Onde os serviços se registram ao iniciar
- **Health Checking** — Monitoramento da saúde dos serviços
- **DNS Dinâmico** — Resolução dinâmica de endereços

</Card>

<Card title="Popular Tools" accent="green">

- **Consul** — Solução completa com service discovery, configuração e segmentação
- **Eureka** — Service discovery da Netflix para aplicações Java
- **etcd** — Armazenamento distribuído de chave-valor usado no Kubernetes

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Design & Architecture" accent="brand">

- **Interfaces Bem Definidas** — Use interfaces para definir contratos claros entre serviços
- **Injeção de Dependência** — Utilize DI para gerenciar dependências de forma flexível
- **Abstração Adequada** — Encontre o nível certo de abstração para cada componente

</Card>

<Card title="Implementation" accent="purple">

- **Service Discovery** — Implemente mecanismos robustos de descoberta de serviços
- **Circuit Breakers** — Use circuit breakers para lidar com falhas de serviços
- **Fallbacks** — Implemente estratégias de fallback para maior resiliência

</Card>

</Cards>

## Trade-offs and Considerations

<Cards cols={3}>

<Card title="Performance" accent="brand">

- Acoplamento estático geralmente tem melhor performance
- Acoplamento dinâmico adiciona overhead de descoberta
- Considere o impacto em latência e throughput

</Card>

<Card title="Complexidade" accent="purple">

- Acoplamento dinâmico aumenta a complexidade
- Necessidade de gerenciar estados distribuídos
- Maior curva de aprendizado para a equipe

</Card>

<Card title="Manutenibilidade" accent="green">

- Acoplamento baixo facilita mudanças
- Maior facilidade de testes isolados
- Melhor suporte para desenvolvimento paralelo

</Card>

</Cards>

## Real-World Examples

### Microsserviços na Netflix

A Netflix utiliza acoplamento dinâmico extensivamente em sua arquitetura de microsserviços, com ferramentas como Eureka para service discovery e Hystrix para circuit breaking.

```java
@EnableEurekaClient
public class VideoServiceApplication {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### Kubernetes Service Discovery

O Kubernetes implementa service discovery através de seu sistema de DNS interno e serviços, permitindo que pods se comuniquem sem conhecer localizações específicas.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```
$mdx$, $mdx$# Acoplamento em Sistemas Distribuídos

O acoplamento mede quão conectados/ dependentes são os componentes. Em sistemas distribuídos, seu tipo e nível impactam flexibilidade, manutenibilidade e resiliência.

<Callout type="info" title="💡 Conceito Chave">

Quanto menor o acoplamento, maior a flexibilidade e manutenção — mas acoplamento extremamente baixo pode aumentar a complexidade. Equilíbrio é essencial.

</Callout>

## Tipos de Acoplamento

### Acoplamento Estático

O acoplamento estático ocorre quando componentes são conectados em tempo de compilação, criando dependências rígidas que são difíceis de modificar sem alterar o código.

<Cards cols={2}>

<Card title="Características" accent="brand">

- **Dependências Diretas** — Referências explícitas a classes ou módulos específicos
- **Verificação em Tempo de Compilação** — Erros são detectados antes da execução
- **Menor Flexibilidade** — Mudanças requerem recompilação e reimplantação

</Card>

<Card title="Vantagens" accent="brand">

**Vantagens**

- Detecção precoce de erros
- Melhor performance em tempo de execução
- Mais fácil de entender e rastrear

**Desvantagens**

- Menor flexibilidade para mudanças
- Maior dificuldade de manutenção
- Menor resiliência a falhas

</Card>

</Cards>

**Exemplo de Acoplamento Estático:**

```ts
// Acoplamento estático através de importação direta
import { UserService } from './UserService';

class OrderProcessor {
  private userService: UserService;

  constructor() {
    // Dependência direta e fixa
    this.userService = new UserService();
  }

  async processOrder(orderId: string) {
    // Se UserService estiver indisponível, não há alternativa
    const user = await this.userService.getUser(orderId);
    // Processamento do pedido...
  }
}
```

### Acoplamento Dinâmico

O acoplamento dinâmico permite que componentes sejam conectados em tempo de execução, oferecendo maior flexibilidade e facilitando mudanças sem necessidade de recompilação.

<Cards cols={2}>

<Card title="Características" accent="purple">

- **Descoberta em Runtime** — Serviços são descobertos e conectados dinamicamente
- **Maior Flexibilidade** — Facilidade para trocar implementações em runtime
- **Resiliência** — Melhor adaptação a falhas e mudanças

</Card>

<Card title="Vantagens / Desvantagens" accent="purple">

**Vantagens**

- Maior flexibilidade e adaptabilidade
- Melhor resiliência a falhas
- Facilidade de manutenção e evolução

**Desvantagens**

- Maior complexidade de implementação
- Possíveis falhas em tempo de execução
- Overhead de performance

</Card>

</Cards>

**Exemplo de Acoplamento Dinâmico:**

```ts
// Acoplamento dinâmico usando injeção de dependência e service discovery
interface UserServiceInterface {
  getUser(id: string): Promise<User>;
}

class OrderProcessor {
  private userService: UserServiceInterface;
  private serviceRegistry: ServiceRegistry;

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  async processOrder(orderId: string) {
    try {
      // Descoberta dinâmica do serviço
      this.userService = await this.serviceRegistry.getService('UserService');
      const user = await this.userService.getUser(orderId);
    } catch (error) {
      // Fallback para serviço alternativo
      this.userService = await this.serviceRegistry.getBackupService('UserService');
      const user = await this.userService.getUser(orderId);
    }
    // Processamento do pedido...
  }
}
```

### Service Discovery

Service Discovery é um padrão fundamental para acoplamento dinâmico em sistemas distribuídos. Permite que serviços se encontrem e se comuniquem sem conhecimento prévio de localizações.

<Cards cols={2}>

<Card title="Componentes Principais" accent="green">

- **Registro de Serviços** — Onde os serviços se registram ao iniciar
- **Health Checking** — Monitoramento da saúde dos serviços
- **DNS Dinâmico** — Resolução dinâmica de endereços

</Card>

<Card title="Ferramentas Populares" accent="green">

- **Consul** — Solução completa com service discovery, configuração e segmentação
- **Eureka** — Service discovery da Netflix para aplicações Java
- **etcd** — Armazenamento distribuído de chave-valor usado no Kubernetes

</Card>

</Cards>

## Melhores Práticas

<Cards cols={2}>

<Card title="Design e Arquitetura" accent="brand">

- **Interfaces Bem Definidas** — Use interfaces para definir contratos claros entre serviços
- **Injeção de Dependência** — Utilize DI para gerenciar dependências de forma flexível
- **Abstração Adequada** — Encontre o nível certo de abstração para cada componente

</Card>

<Card title="Implementação" accent="purple">

- **Service Discovery** — Implemente mecanismos robustos de descoberta de serviços
- **Circuit Breakers** — Use circuit breakers para lidar com falhas de serviços
- **Fallbacks** — Implemente estratégias de fallback para maior resiliência

</Card>

</Cards>

## Trade-offs e Considerações

<Cards cols={3}>

<Card title="Performance" accent="brand">

- Acoplamento estático geralmente tem melhor performance
- Acoplamento dinâmico adiciona overhead de descoberta
- Considere o impacto em latência e throughput

</Card>

<Card title="Complexidade" accent="purple">

- Acoplamento dinâmico aumenta a complexidade
- Necessidade de gerenciar estados distribuídos
- Maior curva de aprendizado para a equipe

</Card>

<Card title="Manutenibilidade" accent="green">

- Acoplamento baixo facilita mudanças
- Maior facilidade de testes isolados
- Melhor suporte para desenvolvimento paralelo

</Card>

</Cards>

## Exemplos do Mundo Real

### Microsserviços na Netflix

A Netflix utiliza acoplamento dinâmico extensivamente em sua arquitetura de microsserviços, com ferramentas como Eureka para service discovery e Hystrix para circuit breaking.

```java
@EnableEurekaClient
public class VideoServiceApplication {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### Kubernetes Service Discovery

O Kubernetes implementa service discovery através de seu sistema de DNS interno e serviços, permitindo que pods se comuniquem sem conhecer localizações específicas.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```
$mdx$),
  ('design-principles/orchestration-vs-choreography', '/principios-design/orquestracao-vs-coreografia', 'design', true, 28, NULL, true, 'Orchestration vs Choreography', 'Orquestração vs Coreografia', $mdx$# Orchestration vs Choreography

Understand the differences between Orchestration and Choreography patterns in distributed systems.

## Overview

<Cards cols={2}>

<Card title="Orchestration" accent="brand">

A central orchestrator controls the workflow, coordinating interactions between services. Like a conductor, it dictates what each service should do and when.

</Card>

<Card title="Choreography" accent="purple">

Services interact independently by reacting to events without a central controller. Like a dance, each participant knows their steps and reacts to others.

</Card>

</Cards>

## Detailed Comparison

<Cards cols={2}>

<Card title="Orchestration" accent="brand">

- Central controller (orchestrator)
- Explicit workflow
- Easier to understand and debug
- Less flexible to change
- Single point of failure
- More coupling

</Card>

<Card title="Choreography" accent="purple">

- No central controller
- Implicit workflow
- Harder to understand
- More flexible to change
- No single point of failure
- Less coupling

</Card>

</Cards>

## Usage Examples

<Cards cols={2}>

<Card title="Orchestration" accent="brand">

**Order Processing**

</Card>

<Card title="Choreography" accent="purple">

**Notification System**

</Card>

</Cards>

## When to Use Each Pattern

<Cards cols={2}>

<Card title="Use Orchestration When:" accent="brand">

- The workflow is complex and needs central coordination
- You need clear visibility of the process
- The process is stable and rarely changes
- You need full control over the flow
- The process is sequential and dependent

</Card>

<Card title="Use Choreography When:" accent="purple">

- Services are independent and can evolve separately
- You need high scalability
- The process is dynamic and changes frequently
- You want to reduce coupling between services
- Events can be processed in parallel

</Card>

</Cards>
$mdx$, $mdx$# Orquestração vs Coreografia

Entenda as diferenças entre os padrões de Orquestração e Coreografia em sistemas distribuídos.

## Visão Geral

<Cards cols={2}>

<Card title="Orquestração" accent="brand">

A central orchestrator controls the workflow, coordinating interactions between services. Like a conductor, it dictates what each service should do and when.

</Card>

<Card title="Coreografia" accent="purple">

Services interact independently by reacting to events without a central controller. Like a dance, each participant knows their steps and reacts to others.

</Card>

</Cards>

## Comparação Detalhada

<Cards cols={2}>

<Card title="Orquestração" accent="brand">

- Controlador central (orquestrador)
- Fluxo de trabalho explícito
- Mais fácil de entender e depurar
- Menos flexível para mudanças
- Ponto único de falha
- Maior acoplamento

</Card>

<Card title="Coreografia" accent="purple">

- Sem controlador central
- Fluxo de trabalho implícito
- Mais difícil de entender
- Mais flexível para mudanças
- Sem ponto único de falha
- Menor acoplamento

</Card>

</Cards>

## Exemplos de Uso

<Cards cols={2}>

<Card title="Orquestração" accent="brand">

**Processamento de Pedidos**

</Card>

<Card title="Coreografia" accent="purple">

**Sistema de Notificações**

</Card>

</Cards>

## Quando Usar Cada Padrão

<Cards cols={2}>

<Card title="Use Orquestração Quando:" accent="brand">

- O fluxo de trabalho é complexo e precisa de coordenação central
- Você precisa de visibilidade clara do processo
- O processo é estável e raramente muda
- Você precisa de controle total sobre o fluxo
- O processo é sequencial e dependente

</Card>

<Card title="Use Coreografia Quando:" accent="purple">

- Os serviços são independentes e podem evoluir separadamente
- Você precisa de alta escalabilidade
- O processo é dinâmico e muda frequentemente
- Você quer reduzir o acoplamento entre serviços
- Os eventos podem ser processados em paralelo

</Card>

</Cards>
$mdx$),
  ('design-principles/canary-deployment', '/principios-design/canary-deployment', 'design', true, 29, NULL, true, 'Canary Deployment', 'Canary Deployment', $mdx$# Canary Deployment

A progressive deployment strategy that reduces risk by gradually exposing a new version to a small percentage of users before rolling out to everyone.

## How It Works

Canary deployment works by routing a small percentage of production traffic to the new version while the majority continues using the stable version. This allows teams to monitor real-world behavior and catch issues before they affect all users.

<Callout type="neutral" title="Origin of the Name">

The name comes from the practice of coal miners bringing canaries into mines. If dangerous gases were present, the canary would be affected first, alerting miners to danger. Similarly, canary deployments detect problems early with minimal user impact.

</Callout>

## Deployment Phases

1. **Deploy Canary** — Deploy the new version alongside the existing stable version without routing any traffic to it yet.
2. **Route Traffic** — Begin routing a small percentage (e.g., 5-10%) of traffic to the canary version.
3. **Monitor & Analyze** — Monitor key metrics like error rates, latency, and business KPIs. Compare canary vs stable performance.
4. **Expand or Rollback** — If metrics are healthy, gradually increase canary traffic. If problems are detected, immediately rollback.

## Benefits

<Cards cols={2}>

<Card title="Reduced Risk" accent="green">

Issues affect only a small percentage of users, minimizing blast radius.

</Card>

<Card title="Quick Rollback" accent="green">

Problems can be detected and rolled back before they impact all users.

</Card>

<Card title="Real-World Testing" accent="green">

Test with actual production traffic and user behavior, not just synthetic tests.

</Card>

<Card title="Gradual Confidence" accent="green">

Build confidence in the release by progressively increasing exposure.

</Card>

</Cards>

## Challenges

<Cards cols={3}>

<Card title="Infrastructure Complexity" accent="yellow">

Requires sophisticated traffic routing, load balancing, and deployment automation.

</Card>

<Card title="Monitoring Requirements" accent="yellow">

Needs robust observability to compare canary and stable versions effectively.

</Card>

<Card title="Database Compatibility" accent="yellow">

Schema changes must be backward compatible since both versions run simultaneously.

</Card>

</Cards>

## Canary vs Blue-Green

| Aspect | Canary | Blue-Green |
|--------|--------|------------|
| Traffic | Gradual | All-at-once |
| Risk | Lower | Higher |
| Rollback | Instant | Instant |

[Explore Canary Simulator](/principios-design/canary-deployment/simulator)
$mdx$, $mdx$# Canary Deployment

Uma estratégia de deployment progressivo que reduz riscos expondo gradualmente uma nova versão a uma pequena porcentagem de usuários antes de liberar para todos.

## Como Funciona

O canary deployment funciona roteando uma pequena porcentagem do tráfego de produção para a nova versão enquanto a maioria continua usando a versão estável. Isso permite que as equipes monitorem o comportamento real e detectem problemas antes que afetem todos os usuários.

<Callout type="neutral" title="Origem do Nome">

O nome vem da prática de mineradores de carvão que levavam canários para as minas. Se gases perigosos estivessem presentes, o canário seria afetado primeiro, alertando os mineradores. Da mesma forma, canary deployments detectam problemas cedo com impacto mínimo.

</Callout>

## Fases do Deployment

1. **Deploy do Canary** — Faça deploy da nova versão junto com a versão estável existente, sem rotear tráfego para ela ainda.
2. **Rotear Tráfego** — Comece a rotear uma pequena porcentagem (ex: 5-10%) do tráfego para a versão canary.
3. **Monitorar e Analisar** — Monitore métricas chave como taxas de erro, latência e KPIs de negócio. Compare o desempenho canary vs estável.
4. **Expandir ou Rollback** — Se as métricas estiverem saudáveis, aumente gradualmente o tráfego canary. Se problemas forem detectados, faça rollback imediatamente.

## Benefícios

<Cards cols={2}>

<Card title="Risco Reduzido" accent="green">

Problemas afetam apenas uma pequena porcentagem de usuários, minimizando o raio de explosão.

</Card>

<Card title="Rollback Rápido" accent="green">

Problemas podem ser detectados e revertidos antes de impactar todos os usuários.

</Card>

<Card title="Teste no Mundo Real" accent="green">

Teste com tráfego de produção real e comportamento de usuários, não apenas testes sintéticos.

</Card>

<Card title="Confiança Gradual" accent="green">

Construa confiança no release aumentando progressivamente a exposição.

</Card>

</Cards>

## Desafios

<Cards cols={3}>

<Card title="Complexidade de Infraestrutura" accent="yellow">

Requer roteamento de tráfego sofisticado, balanceamento de carga e automação de deployment.

</Card>

<Card title="Requisitos de Monitoramento" accent="yellow">

Necessita de observabilidade robusta para comparar versões canary e estável efetivamente.

</Card>

<Card title="Compatibilidade de Banco de Dados" accent="yellow">

Mudanças de schema devem ser retrocompatíveis já que ambas versões rodam simultaneamente.

</Card>

</Cards>

## Canary vs Blue-Green

| Aspecto | Canary | Blue-Green |
|---------|--------|------------|
| Tráfego | Gradual | Tudo de uma vez |
| Risco | Menor | Maior |
| Rollback | Instantâneo | Instantâneo |

[Explorar Simulador Canary](/principios-design/canary-deployment/simulator)
$mdx$),
  ('design-principles/cqrs', '/principios-design/cqrs', 'design', true, 30, NULL, true, 'CQRS — Command Query Responsibility Segregation', 'CQRS — Command Query Responsibility Segregation', $mdx$# CQRS — Command Query Responsibility Segregation

Most systems use **one model** for both writing and reading data. **CQRS** splits them: a **command** side optimized for writes and a **query** side optimized for reads, often backed by different data stores kept in sync via events.

<Callout type="info" title="💡 The core idea">

Reads and writes have different needs. Writes care about validation and consistency; reads care about speed and convenient shapes. CQRS stops one model from being a bad compromise for both.

</Callout>

## Commands vs queries

<Cards cols={2}>

<Card title="Command side (write)" accent="brand">

Accepts intent ("ship order #42"), validates it, and records what happened — frequently as an **append-only event log**. It does not return data, only success/failure.

</Card>

<Card title="Query side (read)" accent="purple">

Serves **read models** (projections) shaped exactly for each view. Denormalized, pre-joined, cached — fast to read because the hard work happened at write time.

</Card>

</Cards>

## How they stay in sync

The write side emits **events**; the read side consumes them to update its projections.

<Cards cols={3}>

<Card title="1. Command" accent="brand">

A command is validated and produces one or more events appended to the log.

</Card>

<Card title="2. Project" accent="purple">

Projections consume the event stream and update read models (a summary view, a counter, a search index).

</Card>

<Card title="3. Query" accent="green">

Reads hit the projections directly — no joins, no recomputation.

</Card>

</Cards>

## Eventual consistency is the catch

<Callout type="warning" title="The read side trails the write side">

Projections update **asynchronously**, so a read right after a write may show stale data for a moment. You must design the UX for it ("your order is processing") or read-your-own-writes from the command side when freshness is critical.

</Callout>

## CQRS, event sourcing & when to use it

<Callout type="neutral" title="Related but separate">

CQRS pairs naturally with **event sourcing** (storing state as a log of events), but you can do either without the other. CQRS shines for read-heavy domains with complex queries or very different read/write scaling. For simple CRUD, it's usually over-engineering.

</Callout>

<Callout type="success" title="Try It: CQRS Simulator">

Issue commands, watch events append to the log, and see read models catch up — raise the projection lag to feel eventual consistency in action — in the [CQRS Simulator](/principios-design/cqrs/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- CQRS separates the write model from read models
- The write side emits events; read models are projections
- Reads are eventually consistent with writes

</Card>

<Card title="Design For" accent="brand">

- Use it for read-heavy, query-complex domains
- Plan for and surface eventual consistency
- Don't apply it to simple CRUD

</Card>

</Cards>
$mdx$, $mdx$# CQRS — Command Query Responsibility Segregation

A maioria dos sistemas usa **um único modelo** para escrever e ler dados. O **CQRS** os separa: um lado de **comando** otimizado para escritas e um lado de **consulta** otimizado para leituras, muitas vezes com bancos de dados diferentes mantidos em sincronia via eventos.

<Callout type="info" title="💡 A ideia central">

Leituras e escritas têm necessidades diferentes. Escritas se importam com validação e consistência; leituras se importam com velocidade e formatos convenientes. O CQRS evita que um único modelo seja um mau compromisso para os dois.

</Callout>

## Comandos vs consultas

<Cards cols={2}>

<Card title="Lado de comando (escrita)" accent="brand">

Aceita uma intenção ("enviar pedido #42"), valida e registra o que aconteceu — frequentemente como um **log de eventos append-only**. Não retorna dados, apenas sucesso/falha.

</Card>

<Card title="Lado de consulta (leitura)" accent="purple">

Serve **read models** (projeções) moldados exatamente para cada visão. Desnormalizados, pré-juntados, cacheados — rápidos de ler porque o trabalho pesado aconteceu na escrita.

</Card>

</Cards>

## Como eles ficam em sincronia

O lado de escrita emite **eventos**; o lado de leitura os consome para atualizar suas projeções.

<Cards cols={3}>

<Card title="1. Comando" accent="brand">

Um comando é validado e produz um ou mais eventos anexados ao log.

</Card>

<Card title="2. Projetar" accent="purple">

Projeções consomem o stream de eventos e atualizam read models (uma visão resumida, um contador, um índice de busca).

</Card>

<Card title="3. Consultar" accent="green">

Leituras acessam as projeções diretamente — sem joins, sem recomputação.

</Card>

</Cards>

## A consistência eventual é o porém

<Callout type="warning" title="A leitura fica atrás da escrita">

Projeções atualizam de forma **assíncrona**, então uma leitura logo após uma escrita pode mostrar dados desatualizados por um instante. Você precisa projetar a UX para isso ("seu pedido está sendo processado") ou ler-suas-próprias-escritas do lado de comando quando a atualidade for crítica.

</Callout>

## CQRS, event sourcing e quando usar

<Callout type="neutral" title="Relacionados mas separados">

O CQRS combina naturalmente com **event sourcing** (armazenar o estado como um log de eventos), mas você pode usar um sem o outro. O CQRS brilha em domínios com muita leitura e consultas complexas ou escalas de leitura/escrita muito diferentes. Para CRUD simples, costuma ser over-engineering.

</Callout>

<Callout type="success" title="Experimente: Simulador de CQRS">

Emita comandos, veja eventos serem anexados ao log e os read models se atualizarem — aumente o lag da projeção para sentir a consistência eventual em ação — no [Simulador de CQRS](/principios-design/cqrs/simulator).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- O CQRS separa o modelo de escrita dos modelos de leitura
- O lado de escrita emite eventos; read models são projeções
- Leituras são eventualmente consistentes com as escritas

</Card>

<Card title="Projete para" accent="brand">

- Use para domínios com muita leitura e consultas complexas
- Planeje e exponha a consistência eventual
- Não aplique em CRUD simples

</Card>

</Cards>
$mdx$),
  ('design-principles/rate-limiting', '/principios-design/rate-limiting', 'design', true, 31, NULL, true, 'Rate Limiting', 'Rate Limiting', $mdx$# Rate Limiting

A rate limiter caps how many requests a client can make in a time window. It protects your system from overload, abuse, and runaway costs — and enforces fair sharing among clients. The interesting part is *how* you count.

<Callout type="info" title="💡 Why you need it">

Without limits, one buggy client, a traffic spike, or an attacker can exhaust your capacity and take everyone down. Rate limiting is a first-line defense for **availability** and **cost control**.

</Callout>

## The classic algorithms

<Cards cols={3}>

<Card title="Token bucket" accent="brand">

A bucket holds up to N tokens, refilled at a steady rate. Each request spends one; empty bucket = reject. **Allows bursts** up to the bucket size, then settles to the refill rate.

</Card>

<Card title="Leaky bucket" accent="purple">

Requests enter a fixed-size queue that drains ("leaks") at a constant rate. **Smooths output** to a steady stream; rejects when the queue is full. No bursts downstream.

</Card>

<Card title="Sliding window" accent="green">

Count requests in the trailing time window (e.g. last 1s) and reject once the limit is hit. Accurate and burst-free, at the cost of tracking timestamps/counters.

</Card>

</Cards>

## Choosing one

<Callout type="neutral" title="Bursts vs smoothness">

- **Token bucket**: best when occasional bursts are fine (most public APIs). Cheap and flexible.
- **Leaky bucket**: best when the downstream needs a *steady* rate (e.g. protecting a fragile backend).
- **Sliding window**: best when you need precise "N per window" limits without burst leakage.

</Callout>

## Where it runs

<Cards cols={2}>

<Card title="Placement" accent="brand">

Usually at the edge — API gateway, reverse proxy, or load balancer — so bad traffic is rejected before it reaches your services.

</Card>

<Card title="Distributed limits" accent="purple">

Across many instances you need **shared state** (often Redis) so the limit is global, not per-instance. Watch the latency and hotspot of that shared counter.

</Card>

</Cards>

<Callout type="warning" title="Be a good citizen">

Return `429 Too Many Requests` with a `Retry-After` header so clients can back off intelligently instead of hammering you harder.

</Callout>

<Callout type="success" title="Try It: Rate Limiter Simulator">

Compare token bucket, leaky bucket, and sliding window side by side — tune the rates and watch accepted vs rejected requests — in the [Rate Limiter Simulator](/principios-design/rate-limiting/simulator).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Token bucket allows bursts; leaky bucket smooths; sliding window is precise
- Limit at the edge, before requests reach your services
- Distributed limits need shared state to be global

</Card>

<Card title="Design For" accent="brand">

- Pick the algorithm to match burst tolerance
- Return 429 + Retry-After to guide clients
- Monitor rejection rates as a load signal

</Card>

</Cards>
$mdx$, $mdx$# Rate Limiting

Um rate limiter limita quantas requisições um cliente pode fazer numa janela de tempo. Ele protege seu sistema de sobrecarga, abuso e custos descontrolados — e impõe compartilhamento justo entre clientes. A parte interessante é *como* você conta.

<Callout type="info" title="💡 Por que você precisa">

Sem limites, um cliente com bug, um pico de tráfego ou um atacante podem esgotar sua capacidade e derrubar todo mundo. Rate limiting é uma defesa de primeira linha para **disponibilidade** e **controle de custos**.

</Callout>

## Os algoritmos clássicos

<Cards cols={3}>

<Card title="Token bucket" accent="brand">

Um balde guarda até N tokens, reposto a uma taxa constante. Cada requisição gasta um; balde vazio = rejeita. **Permite rajadas** até o tamanho do balde, depois estabiliza na taxa de reposição.

</Card>

<Card title="Leaky bucket" accent="purple">

Requisições entram numa fila de tamanho fixo que drena ("vaza") a uma taxa constante. **Suaviza a saída** num fluxo estável; rejeita quando a fila enche. Sem rajadas a jusante.

</Card>

<Card title="Janela deslizante" accent="green">

Conta requisições na janela de tempo anterior (ex.: último 1s) e rejeita ao atingir o limite. Preciso e sem rajadas, ao custo de rastrear timestamps/contadores.

</Card>

</Cards>

## Escolhendo um

<Callout type="neutral" title="Rajadas vs suavidade">

- **Token bucket**: melhor quando rajadas ocasionais são aceitáveis (a maioria das APIs públicas). Barato e flexível.
- **Leaky bucket**: melhor quando o downstream precisa de uma taxa *estável* (ex.: proteger um backend frágil).
- **Janela deslizante**: melhor quando você precisa de limites precisos de "N por janela" sem vazamento de rajadas.

</Callout>

## Onde roda

<Cards cols={2}>

<Card title="Posicionamento" accent="brand">

Normalmente na borda — API gateway, reverse proxy ou load balancer — para que o tráfego ruim seja rejeitado antes de chegar aos seus serviços.

</Card>

<Card title="Limites distribuídos" accent="purple">

Entre várias instâncias você precisa de **estado compartilhado** (em geral Redis) para que o limite seja global, não por instância. Atenção à latência e ao hotspot desse contador compartilhado.

</Card>

</Cards>

<Callout type="warning" title="Seja um bom cidadão">

Retorne `429 Too Many Requests` com um header `Retry-After` para que os clientes recuem de forma inteligente em vez de te martelar mais forte.

</Callout>

<Callout type="success" title="Experimente: Simulador de Rate Limiter">

Compare token bucket, leaky bucket e janela deslizante lado a lado — ajuste as taxas e veja requisições aceitas vs rejeitadas — no [Simulador de Rate Limiter](/principios-design/rate-limiting/simulator).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Token bucket permite rajadas; leaky bucket suaviza; janela deslizante é precisa
- Limite na borda, antes que as requisições cheguem aos serviços
- Limites distribuídos precisam de estado compartilhado para serem globais

</Card>

<Card title="Projete para" accent="brand">

- Escolha o algoritmo conforme a tolerância a rajadas
- Retorne 429 + Retry-After para guiar os clientes
- Monitore taxas de rejeição como sinal de carga

</Card>

</Cards>
$mdx$),
  ('design-principles/backpressure', '/principios-design/backpressure', 'design', true, 32, NULL, true, 'Backpressure', 'Backpressure', $mdx$# Backpressure

When a fast producer overwhelms a slow consumer, queues grow, memory fills, latency spikes, and eventually something crashes. **Backpressure** is the flow-control mechanism that lets a consumer say "slow down" so the system degrades gracefully instead of falling over.

<Callout type="info" title="💡 The plumbing analogy">

Pour water faster than the drain can handle and the sink overflows. Backpressure is the signal that pushes back up the pipe — telling the source to ease off before the overflow.

</Callout>

## What happens without it

<Cards cols={2}>

<Card title="Unbounded queues" accent="red">

Buffers grow without limit, consuming memory until an out-of-memory crash — often taking the whole service with it.

</Card>

<Card title="Latency collapse" accent="red">

Even if it doesn't crash, requests sit in huge queues. By the time they're processed they may already have timed out — work done for nothing.

</Card>

</Cards>

## Strategies

<Cards cols={3}>

<Card title="Slow the producer" accent="brand">

Propagate a "not ready" signal upstream so the source produces more slowly (pull-based systems and TCP do this naturally).

</Card>

<Card title="Buffer with bounds" accent="purple">

Allow a *limited* queue to absorb bursts — but cap it, and decide what happens when it's full.

</Card>

<Card title="Shed load" accent="green">

When the bounded buffer fills, drop or reject excess work (return 429, drop low-priority messages) to protect the core.

</Card>

</Cards>

## Push vs pull

<Callout type="neutral" title="Who sets the pace?">

- **Push** systems (producer drives) need explicit backpressure signals or they overflow consumers.
- **Pull** systems (consumer requests the next item) have backpressure built in — the consumer simply asks for more only when ready. Reactive Streams, TCP flow control, and Kafka's consumer pull model all use this.

</Callout>

<Callout type="success" title="Try It: Backpressure Simulator">

Push messages faster than the consumer can handle and watch the queue fill until the producer gets throttled in the [Backpressure Simulator](/backpressure).

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- Backpressure protects systems from fast-producer/slow-consumer overload
- Without it: unbounded queues, OOM, and latency collapse
- Pull-based designs get backpressure almost for free

</Card>

<Card title="Design For" accent="brand">

- Bound every queue and buffer
- Decide the full-buffer policy: block, drop, or reject
- Prefer pull-based flow where you can

</Card>

</Cards>
$mdx$, $mdx$# Backpressure

Quando um produtor rápido sobrecarrega um consumidor lento, as filas crescem, a memória enche, a latência dispara e, no fim, algo quebra. **Backpressure** é o mecanismo de controle de fluxo que permite ao consumidor dizer "vai mais devagar" para o sistema degradar graciosamente em vez de cair.

<Callout type="info" title="💡 A analogia do encanamento">

Despeje água mais rápido do que o ralo dá conta e a pia transborda. Backpressure é o sinal que empurra de volta pelo cano — dizendo à fonte para aliviar antes do transbordo.

</Callout>

## O que acontece sem ele

<Cards cols={2}>

<Card title="Filas ilimitadas" accent="red">

Buffers crescem sem limite, consumindo memória até um crash por falta de memória — muitas vezes levando o serviço inteiro junto.

</Card>

<Card title="Colapso de latência" accent="red">

Mesmo sem crashar, requisições ficam em filas enormes. Quando são processadas, já podem ter dado timeout — trabalho feito à toa.

</Card>

</Cards>

## Estratégias

<Cards cols={3}>

<Card title="Desacelerar o produtor" accent="brand">

Propague um sinal de "não estou pronto" rio acima para que a fonte produza mais devagar (sistemas pull e o TCP fazem isso naturalmente).

</Card>

<Card title="Buffer com limites" accent="purple">

Permita uma fila *limitada* para absorver rajadas — mas com teto, e decida o que acontece quando ela enche.

</Card>

<Card title="Descartar carga" accent="green">

Quando o buffer limitado enche, descarte ou rejeite o excesso (retorne 429, descarte mensagens de baixa prioridade) para proteger o núcleo.

</Card>

</Cards>

## Push vs pull

<Callout type="neutral" title="Quem dita o ritmo?">

- Sistemas **push** (o produtor dirige) precisam de sinais explícitos de backpressure ou transbordam os consumidores.
- Sistemas **pull** (o consumidor pede o próximo item) têm backpressure embutido — o consumidor só pede mais quando está pronto. Reactive Streams, o controle de fluxo do TCP e o modelo pull de consumidores do Kafka usam isso.

</Callout>

<Callout type="success" title="Experimente: Simulador de Backpressure">

Empurre mensagens mais rápido do que o consumidor aguenta e veja a fila encher até o produtor ser throttled no [Simulador de Backpressure](/backpressure).

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Backpressure protege sistemas da sobrecarga produtor-rápido/consumidor-lento
- Sem ele: filas ilimitadas, OOM e colapso de latência
- Designs baseados em pull ganham backpressure quase de graça

</Card>

<Card title="Projete para" accent="brand">

- Limite toda fila e buffer
- Decida a política de buffer cheio: bloquear, descartar ou rejeitar
- Prefira fluxo baseado em pull quando possível

</Card>

</Cards>
$mdx$),
  ('design-principles/fault-tolerance', '/principios-design/tolerancia-falhas', 'design', true, 33, NULL, true, 'Fault Tolerance', 'Tolerância a Falhas', $mdx$# Fault Tolerance

Designing systems that can recover or continue operating in the face of failures is essential to maintain reliability and high availability.

<Cards cols={2}>

<Card title="Retries" accent="brand">

When an operation fails, the system attempts it again, increasing the chance of success in case of transient failures.

**Practical Example**

In an online shopping app, if order confirmation fails due to a network issue, the app automatically retries the request.

</Card>

<Card title="Circuit Breakers" accent="brand">

Prevents cascading failures by detecting problems and temporarily stopping calls to a troubled service.

**Practical Example**

When an image server is overloaded, the circuit breaker blocks new requests for a while, allowing the server to recover.

</Card>

<Card title="Timeout" accent="brand">

Defines a maximum time for an operation to complete, avoiding waiting indefinitely for a response.

**Practical Example**

When submitting a form, if the server does not respond within 30 seconds, the operation is canceled and an error message is shown.

</Card>

<Card title="Fallback" accent="brand">

Provides an alternative when the primary operation fails, ensuring the system continues to function in a degraded mode.

**Practical Example**

In a maps app, if GPS fails, the system uses Wi‑Fi network location as an alternative to show an approximate position.

</Card>

</Cards>
$mdx$, $mdx$# Tolerância a Falhas

Projetar sistemas que possam se recuperar ou continuar operando diante de falhas é essencial para manter a confiabilidade e a alta disponibilidade.

<Cards cols={2}>

<Card title="Retries" accent="brand">

Quando uma operação falha, o sistema tenta executá-la novamente, aumentando a chance de sucesso em caso de falhas temporárias.

**Exemplo Prático**

Em um aplicativo de compras online, se a confirmação do pedido falhar devido a problemas de rede, o app tenta enviar a requisição novamente automaticamente.

</Card>

<Card title="Circuit Breakers" accent="brand">

Previne falhas em cascata ao detectar problemas e interromper temporariamente as chamadas a um serviço com problemas.

**Exemplo Prático**

Quando um servidor de imagens está sobrecarregado, o circuit breaker impede novas requisições por um tempo, permitindo que o servidor se recupere.

</Card>

<Card title="Timeout" accent="brand">

Define um tempo máximo para a conclusão de uma operação, evitando que o sistema fique esperando indefinidamente por uma resposta.

**Exemplo Prático**

Ao preencher um formulário online, se o servidor não responder em 30 segundos, a operação é cancelada e uma mensagem de erro é exibida.

</Card>

<Card title="Fallback" accent="brand">

Fornece uma alternativa quando a operação principal falha, garantindo que o sistema continue funcionando mesmo que de forma degradada.

**Exemplo Prático**

Em um aplicativo de mapas, se o GPS falhar, o sistema usa a localização da rede Wi‑Fi como alternativa para mostrar a posição aproximada.

</Card>

</Cards>
$mdx$),
  ('design-principles/retries', '/principios-design/tolerancia-falhas/retries', 'design', true, 34, NULL, true, 'Retries', 'Retries', $mdx$# Retries

A fundamental strategy to handle transient failures in distributed systems, allowing failed operations to be retried automatically.

## How It Works

Imagine you are sending a message to a friend. Sometimes it does not arrive the first time due to network issues. What do you do? You try again. That is exactly what "Retry" does in computer systems.

<Callout type="neutral" title="Real-World Example">

Think of an online shopping app. When you click "Buy", the app must confirm the order with a server. If the connection briefly fails, the app can retry a few times before showing an error.

</Callout>

## Benefits

<Cards cols={3}>

<Card title="Higher Resilience" accent="green">

Systems can automatically recover from transient failures.

</Card>

<Card title="Better Experience" accent="green">

Users do not have to repeat actions manually when failures occur.

</Card>

<Card title="Reliability" accent="green">

Increases the success rate of operations over unstable networks.

</Card>

</Cards>

## Best Practices

<Cards cols={3}>

<Card title="Exponential Backoff" accent="slate">

Gradually increase the interval between attempts to avoid overloading the system (e.g., 1s, 2s, 4s, 8s).

</Card>

<Card title="Retry Limit" accent="slate">

Set a maximum number of attempts to avoid infinite loops and fail fast when necessary.

</Card>

<Card title="Idempotency" accent="slate">

Ensure multiple attempts of the same operation do not cause unintended side effects.

</Card>

</Cards>

## Important Considerations

<Cards cols={2}>

<Card title="Types of Failures" accent="yellow">

Not all failures should be retried. Validation or authentication errors, for example, do not benefit from retries.

</Card>

<Card title="Impact on the System" accent="yellow">

Many concurrent retries can overload the system. Use circuit breakers together when needed.

</Card>

</Cards>

[Explore Retries Simulator](/principios-design/tolerancia-falhas/retries/simulator)
$mdx$, $mdx$# Retries

Uma estratégia fundamental para lidar com falhas temporárias em sistemas distribuídos, permitindo que operações falhas sejam automaticamente repetidas.

## Como Funciona

Imagine que você está enviando uma mensagem para um amigo. Às vezes, a mensagem não chega de primeira por causa de problemas na rede. O que você faz? Tenta enviar de novo. É exatamente isso que o "Retry" faz em sistemas computacionais.

<Callout type="neutral" title="Exemplo do Mundo Real">

Pense em um aplicativo de compras online. Quando você clica em "Comprar", o app precisa confirmar o pedido com um servidor. Se a conexão falhar momentaneamente, o app pode tentar novamente algumas vezes antes de exibir um erro.

</Callout>

## Benefícios

<Cards cols={3}>

<Card title="Maior Resiliência" accent="green">

Sistemas podem se recuperar automaticamente de falhas temporárias.

</Card>

<Card title="Melhor Experiência" accent="green">

Usuários não precisam repetir ações manualmente em caso de falhas.

</Card>

<Card title="Confiabilidade" accent="green">

Aumenta a taxa de sucesso das operações em redes instáveis.

</Card>

</Cards>

## Melhores Práticas

<Cards cols={3}>

<Card title="Backoff Exponencial" accent="slate">

Aumentar gradualmente o intervalo entre tentativas para evitar sobrecarga do sistema (ex.: 1s, 2s, 4s, 8s).

</Card>

<Card title="Limite de Tentativas" accent="slate">

Definir um número máximo de tentativas para evitar loops infinitos e falhar rapidamente quando necessário.

</Card>

<Card title="Idempotência" accent="slate">

Garantir que múltiplas tentativas da mesma operação não causem efeitos colaterais indesejados.

</Card>

</Cards>

## Considerações Importantes

<Cards cols={2}>

<Card title="Tipos de Falhas" accent="yellow">

Nem todas as falhas devem ser retentadas. Erros de validação ou autenticação, por exemplo, não se beneficiam de retentativas.

</Card>

<Card title="Impacto no Sistema" accent="yellow">

Muitas retentativas simultâneas podem sobrecarregar o sistema. Use circuit breakers em conjunto quando necessário.

</Card>

</Cards>

[Explorar Simulador de Retries](/principios-design/tolerancia-falhas/retries/simulator)
$mdx$),
  ('design-principles/circuit-breaker', '/principios-design/tolerancia-falhas/circuit-breaker', 'design', true, 35, NULL, true, 'Circuit Breaker (Disjuntor)', 'Circuit Breaker (Disjuntor)', $mdx$# Circuit Breaker (Disjuntor)

An essential strategy to prevent cascading failures in distributed systems, working similarly to an electrical circuit breaker.

## How It Works

Imagine your home internet is having serious issues. You try to send a message several times, but it never goes through. Keeping at it only frustrates you and overloads the network. That is where the Circuit Breaker comes in.

It works like the breaker in your house: when the current is too high, it shuts everything off to avoid damage. In software systems, when many calls fail, the Circuit Breaker blocks new attempts for a while.

## Benefits

<Cards cols={3}>

<Card title="Cascading Failure Prevention" accent="green">

Prevents failures in one service from affecting the whole system.

</Card>

<Card title="Automatic Recovery" accent="green">

Allows the system to naturally recover after failures.

</Card>

<Card title="Better Experience" accent="green">

Fail fast instead of keeping users waiting.

</Card>

</Cards>

<Callout type="neutral" title="Real-World Example">

A news site receives a traffic spike during a major event. The image server becomes overloaded and slows responses. The Circuit Breaker detects this and blocks image fetches for a few minutes. The site keeps working (without images) while the server recovers.

</Callout>

## Circuit Breaker States

<Cards cols={3}>

<Card title="Closed (Normal)" accent="green">

Normal operation; requests pass through while failures are monitored.

</Card>

<Card title="Open (Blocked)" accent="red">

Too many failures detected; requests are blocked for a period.

</Card>

<Card title="Half-Open (Test)" accent="yellow">

Allows a few requests to test if the system has recovered.

</Card>

</Cards>

[Explore Circuit Breaker Simulator](/principios-design/tolerancia-falhas/circuit-breaker/simulator)
$mdx$, $mdx$# Circuit Breaker (Disjuntor)

Uma estratégia essencial para prevenir falhas em cascata em sistemas distribuídos, funcionando de forma similar a um disjuntor elétrico.

## Como Funciona

Imagine que a internet da sua casa está com problemas sérios. Você tenta enviar uma mensagem várias vezes, mas ela nunca chega. Ficar insistindo só te frustra e sobrecarrega a rede. É aí que entra o Circuit Breaker.

Ele funciona como um disjuntor: quando há muitas falhas, bloqueia novas tentativas por um tempo para evitar danos e permitir recuperação.

## Benefícios

<Cards cols={3}>

<Card title="Prevenção de Falhas em Cascata" accent="green">

Evita que falhas em um serviço afetem todo o sistema.

</Card>

<Card title="Recuperação Automática" accent="green">

Permite que o sistema se recupere naturalmente após falhas.

</Card>

<Card title="Melhor Experiência" accent="green">

Falha rápido em vez de deixar usuários esperando.

</Card>

</Cards>

<Callout type="neutral" title="Exemplo do Mundo Real">

Um site de notícias recebe pico de tráfego. O servidor de imagens sobrecarrega e responde lentamente. O Circuit Breaker bloqueia buscas por alguns minutos, mantendo o site no ar enquanto o servidor se recupera.

</Callout>

## Estados do Circuit Breaker

<Cards cols={3}>

<Card title="Fechado (Normal)" accent="green">

Operação normal; requisições passam enquanto falhas são monitoradas.

</Card>

<Card title="Aberto (Bloqueado)" accent="red">

Muitas falhas detectadas; requisições são bloqueadas por um período.

</Card>

<Card title="Semi-Aberto (Teste)" accent="yellow">

Permite algumas requisições para testar se o sistema se recuperou.

</Card>

</Cards>

[Explorar Simulador de Circuit Breaker](/principios-design/tolerancia-falhas/circuit-breaker/simulator)
$mdx$),
  ('design-principles/timeout', '/principios-design/tolerancia-falhas/timeout', 'design', true, 36, NULL, true, 'Timeout (Tempo Limite)', 'Timeout (Tempo Limite)', $mdx$# Timeout (Tempo Limite)

A fundamental strategy to avoid slow or stuck operations from hurting user experience and overall system health.

## How It Works

Imagine you place an order at a restaurant. If it takes too long, you will cancel and leave. Timeout works similarly.

It defines a maximum time for an operation to complete. If that time is exceeded, the system assumes something is wrong and aborts the operation.

## Benefits

<Cards cols={3}>

<Card title="Better User Experience" accent="green">

Prevents users from waiting indefinitely.

</Card>

<Card title="Freeing Resources" accent="green">

Releases system resources that could otherwise remain stuck.

</Card>

<Card title="Failure Prevention" accent="green">

Avoids problems in one service from impacting others.

</Card>

</Cards>

<Callout type="neutral" title="Real-World Example">

You are submitting a form online. If the server is slow or down, the submission may take too long. A 30s timeout cancels the request and shows an error instead of waiting forever.

</Callout>

## Best Practices

<Cards cols={3}>

<Card title="Proper Timeouts" accent="slate">

Set realistic timeouts based on operation type and user expectations.

</Card>

<Card title="Clear Messages" accent="slate">

Tell the user what happened and what to do next.

</Card>

<Card title="Retry Strategy" accent="slate">

Combine timeouts with retries for resilience.

</Card>

</Cards>

[Explore Timeout Simulator](/principios-design/tolerancia-falhas/timeout/simulator)
$mdx$, $mdx$# Timeout (Tempo Limite)

Estratégia fundamental para evitar que operações lentas ou travadas prejudiquem a experiência do usuário e a saúde do sistema.

## Como Funciona

Imagine que você está em um restaurante: se o pedido demora, você cancela e vai embora. O Timeout funciona de forma similar.

Define um tempo máximo para concluir uma operação. Se exceder, o sistema assume problema e interrompe.

## Benefícios

<Cards cols={3}>

<Card title="Melhor Experiência do Usuário" accent="green">

Evita que usuários fiquem esperando indefinidamente.

</Card>

<Card title="Liberação de Recursos" accent="green">

Libera recursos que poderiam ficar presos.

</Card>

<Card title="Prevenção de Falhas" accent="green">

Evita que problemas em um serviço afetem outros.

</Card>

</Cards>

<Callout type="neutral" title="Exemplo do Mundo Real">

Ao enviar um formulário, se o servidor estiver lento/indisponível, um timeout de 30s cancela o envio e exibe erro em vez de esperar indefinidamente.

</Callout>

## Melhores Práticas

<Cards cols={3}>

<Card title="Tempos Apropriados" accent="slate">

Defina timeouts realistas conforme operação e expectativa.

</Card>

<Card title="Mensagens Claras" accent="slate">

Informe o que ocorreu e o que fazer a seguir.

</Card>

<Card title="Retry Strategy" accent="slate">

Combine timeouts com retries para maior resiliência.

</Card>

</Cards>

[Explorar Simulador de Timeout](/principios-design/tolerancia-falhas/timeout/simulator)
$mdx$),
  ('design-principles/fallback', '/principios-design/tolerancia-falhas/fallback', 'design', true, 37, NULL, true, 'Fallback (Plano B)', 'Fallback (Plano B)', $mdx$# Fallback (Plano B)

Uma estratégia essencial para manter a funcionalidade do sistema mesmo quando ocorrem falhas, oferecendo alternativas degradadas mas ainda úteis.

## Como Funciona

Imagine que você está indo para o trabalho de carro e encontra um congestionamento na sua rota habitual. Em vez de ficar parado, você provavelmente vai optar por uma rota alternativa, mesmo que seja um pouco mais longa.

O Fallback funciona de maneira similar em sistemas distribuídos: quando um serviço ou funcionalidade falha, o sistema automaticamente muda para uma alternativa predefinida, mesmo que ofereça uma experiência reduzida.

## Benefícios

<Cards cols={3}>

<Card title="Maior Disponibilidade" accent="green">

Sistema continua funcionando mesmo com falhas parciais

</Card>

<Card title="Melhor Experiência" accent="green">

Usuários ainda conseguem usar funcionalidades básicas

</Card>

<Card title="Resiliência" accent="green">

Sistema se adapta automaticamente a condições adversas

</Card>

</Cards>

## Exemplos do Mundo Real

<Cards cols={3}>

<Card title="Cache Local" accent="slate">

Quando um serviço de dados está indisponível, o sistema usa dados em cache local, mesmo que potencialmente desatualizados.

</Card>

<Card title="Modo Offline" accent="slate">

Aplicativos que permitem continuar trabalhando offline e sincronizam quando a conexão é restaurada.

</Card>

<Card title="Recomendações" accent="slate">

Sistema de recomendações que usa sugestões genéricas quando o serviço personalizado falha.

</Card>

</Cards>

## Melhores Práticas

<Cards cols={3}>

<Card title="Planejamento" accent="slate">

Identifique pontos críticos e prepare estratégias de fallback antecipadamente

</Card>

<Card title="Comunicação Clara" accent="slate">

Informe aos usuários quando estão usando uma versão degradada do serviço

</Card>

<Card title="Monitoramento" accent="slate">

Acompanhe o uso de fallbacks para identificar problemas recorrentes

</Card>

</Cards>

[Explorar Simulador de Fallback](/principios-design/tolerancia-falhas/fallback/simulator)
$mdx$, $mdx$# Fallback (Plano B)

Uma estratégia essencial para manter a funcionalidade do sistema mesmo quando ocorrem falhas, oferecendo alternativas degradadas mas ainda úteis.

## Como Funciona

Imagine que você está indo para o trabalho de carro e encontra um congestionamento na sua rota habitual. Em vez de ficar parado, você provavelmente vai optar por uma rota alternativa, mesmo que seja um pouco mais longa.

O Fallback funciona de maneira similar em sistemas distribuídos: quando um serviço ou funcionalidade falha, o sistema automaticamente muda para uma alternativa predefinida, mesmo que ofereça uma experiência reduzida.

## Benefícios

<Cards cols={3}>

<Card title="Maior Disponibilidade" accent="green">

Sistema continua funcionando mesmo com falhas parciais

</Card>

<Card title="Melhor Experiência" accent="green">

Usuários ainda conseguem usar funcionalidades básicas

</Card>

<Card title="Resiliência" accent="green">

Sistema se adapta automaticamente a condições adversas

</Card>

</Cards>

## Exemplos do Mundo Real

<Cards cols={3}>

<Card title="Cache Local" accent="slate">

Quando um serviço de dados está indisponível, o sistema usa dados em cache local, mesmo que potencialmente desatualizados.

</Card>

<Card title="Modo Offline" accent="slate">

Aplicativos que permitem continuar trabalhando offline e sincronizam quando a conexão é restaurada.

</Card>

<Card title="Recomendações" accent="slate">

Sistema de recomendações que usa sugestões genéricas quando o serviço personalizado falha.

</Card>

</Cards>

## Melhores Práticas

<Cards cols={3}>

<Card title="Planejamento" accent="slate">

Identifique pontos críticos e prepare estratégias de fallback antecipadamente

</Card>

<Card title="Comunicação Clara" accent="slate">

Informe aos usuários quando estão usando uma versão degradada do serviço

</Card>

<Card title="Monitoramento" accent="slate">

Acompanhe o uso de fallbacks para identificar problemas recorrentes

</Card>

</Cards>

[Explorar Simulador de Fallback](/principios-design/tolerancia-falhas/fallback/simulator)
$mdx$),
  ('design-principles/scalability', '/principios-design/escalabilidade', 'design', true, 38, NULL, true, 'Design for Scalability', 'Design para Escalabilidade', $mdx$# Design for Scalability

Scalability is the ability of a system to handle increased workload either by adding hardware capacity or distributing the load across multiple instances.

<Cards cols={3}>

<Card title="Horizontal Scalability" accent="brand">

Distribute load across multiple servers by adding more machines.

[Horizontal Scalability](/principios-design/escalabilidade/horizontal)

</Card>

<Card title="Vertical Scalability" accent="brand">

Increase resources on a single server such as RAM, CPU, or storage.

[Vertical Scalability](/principios-design/escalabilidade/vertical)

</Card>

<Card title="Data Consistency" accent="brand">

Ensure that all copies of data are synchronized across servers.

[Data Consistency](/principios-design/escalabilidade/consistencia)

</Card>

<Card title="Latency" accent="brand">

Manage delays in delivering data or responses across the system.

[Latency](/principios-design/escalabilidade/latencia)

</Card>

<Card title="Failover" accent="brand">

Automatically switch to a backup system in case of failure.

[Failover](/principios-design/escalabilidade/failover)

</Card>

</Cards>

[Explore Scalability Simulator](/principios-design/escalabilidade/simulator)
$mdx$, $mdx$# Design para Escalabilidade

Escalabilidade é a capacidade de um sistema lidar com aumento de carga, seja aumentando a capacidade de hardware ou distribuindo a carga entre várias instâncias.

<Cards cols={3}>

<Card title="Escalabilidade Horizontal" accent="brand">

Distribua a carga entre múltiplos servidores adicionando mais máquinas.

[Escalabilidade Horizontal](/principios-design/escalabilidade/horizontal)

</Card>

<Card title="Escalabilidade Vertical" accent="brand">

Aumente recursos em um único servidor como RAM, CPU, ou armazenamento.

[Escalabilidade Vertical](/principios-design/escalabilidade/vertical)

</Card>

<Card title="Consistência de Dados" accent="brand">

Garanta que todas as cópias de dados estejam sincronizadas entre servidores.

[Consistência de Dados](/principios-design/escalabilidade/consistencia)

</Card>

<Card title="Latência" accent="brand">

Gerencie atrasos na entrega de dados ou respostas no sistema.

[Latência](/principios-design/escalabilidade/latencia)

</Card>

<Card title="Failover" accent="brand">

Alternativa automática para sistema de backup em caso de falha.

[Failover](/principios-design/escalabilidade/failover)

</Card>

</Cards>

[Explorar Simulador de Escalabilidade](/principios-design/escalabilidade/simulator)
$mdx$),
  ('design-principles/horizontal-scaling', '/principios-design/escalabilidade/horizontal', 'design', true, 39, NULL, true, 'Horizontal Scalability (Scale-Out)', 'Escalabilidade Horizontal (Scale-Out)', $mdx$# Horizontal Scalability (Scale-Out)

A method that adds more servers to work together, dividing the workload among them.

## How It Works

It is like using multiple cars to transport passengers instead of relying on a single larger car. This approach is common in modern systems, especially in cloud environments.

<Callout type="neutral" title="Practical Example">

A video streaming network that started with a single server sees global audience growth. To meet demand, it adds servers in various regions, sharing the load and delivering content faster, even to distant users.

</Callout>

## Advantages

- **Unlimited Scalability**: You can add more servers as needed
- **High Availability**: If one server fails, others continue operating
- **Cost-Effective**: Can use simpler, commodity hardware

## Important Considerations

- **Data Distribution**: Plan how data will be distributed and synchronized
- **Complexity**: Requires coordination and load balancing mechanisms
- **Consistency**: Keeping data consistent across servers is challenging

## Best Practices

- **Automation**: Automate adding/removing servers from the cluster
- **Monitoring**: Implement robust monitoring to identify bottlenecks and issues
- **Redundancy**: Maintain appropriate redundancy to ensure high availability

[Explore Scalability Simulator](/principios-design/escalabilidade/simulator)
$mdx$, $mdx$# Escalabilidade Horizontal (Scale-Out)

Método que adiciona mais servidores para trabalhar em conjunto, dividindo a carga entre eles.

## Como Funciona

É como usar vários carros para transportar passageiros em vez de depender de um único carro maior. Essa abordagem é comum em sistemas modernos, especialmente na nuvem.

<Callout type="neutral" title="Exemplo Prático">

Uma rede de streaming de vídeos que começou com um único servidor percebe crescimento global. Para atender à demanda, adiciona servidores em várias regiões, compartilhando a carga e entregando conteúdo mais rapidamente.

</Callout>

## Vantagens

- **Escalabilidade Ilimitada**: Adicione mais servidores conforme necessário
- **Alta Disponibilidade**: Se um servidor falha, outros continuam
- **Custo-Benefício**: Pode usar hardware simples/commodity

## Considerações Importantes

- **Distribuição de Dados**: Planeje como distribuir e sincronizar os dados
- **Complexidade**: Exige mecanismos de coordenação e balanceamento de carga
- **Consistência**: Manter dados consistentes entre servidores é desafiador

## Melhores Práticas

- **Automação**: Automatize a adição/remoção de servidores do cluster
- **Monitoramento**: Monitore para identificar gargalos e problemas
- **Redundância**: Mantenha redundância adequada para alta disponibilidade

[Explorar Simulador de Escalabilidade](/principios-design/escalabilidade/simulator)
$mdx$),
  ('design-principles/vertical-scaling', '/principios-design/escalabilidade/vertical', 'design', true, 40, NULL, true, 'Vertical Scalability (Scale-Up)', 'Escalabilidade Vertical (Scale-Up)', $mdx$# Vertical Scalability (Scale-Up)

A strategy that improves the performance of a single server by adding more resources such as RAM, storage, or faster processors.

## How It Works

It is like replacing a small car with a bigger one to carry more passengers. While simple to implement, it has a physical limit: a server can only be upgraded up to a point before reaching maximum capacity.

<Callout type="neutral" title="Practical Example">

An online store initially using a basic server upgrades to a more powerful one due to increased traffic. This solves the problem in the short term, but as visitors continue to grow, this approach may no longer suffice.

</Callout>

## Advantages

- **Simplicity**: Easy to implement and manage
- **Lower Complexity**: No changes to system architecture
- **Quick Solution**: Ideal for immediate performance issues

## Limitations

- **Physical Limit**: There is a maximum to how much a single server can be improved
- **Cost**: More powerful hardware generally costs exponentially more
- **Single Point of Failure**: If the server fails, the entire system is down

## When to Use

- **Small Applications**: Moderate traffic and predictable growth
- **Temporary Solution**: Quick fix for performance problems
- **Monolithic Systems**: Apps not designed for distribution

[Explore Scalability Simulator](/principios-design/escalabilidade/simulator)
$mdx$, $mdx$# Escalabilidade Vertical (Scale-Up)

Estratégia que melhora o desempenho de um único servidor adicionando recursos como RAM, armazenamento ou processadores mais rápidos.

## Como Funciona

É como trocar um carro pequeno por um maior para transportar mais passageiros. Embora simples de implementar, há um limite físico: o servidor atinge sua capacidade máxima.

<Callout type="neutral" title="Exemplo Prático">

Uma loja virtual que usa um servidor básico faz upgrade para um mais potente por aumento de tráfego. Resolve no curto prazo, mas com crescimento contínuo pode não ser suficiente.

</Callout>

## Vantagens

- **Simplicidade**: Fácil de implementar e gerenciar
- **Menor Complexidade**: Não requer mudanças na arquitetura
- **Solução Rápida**: Ideal para problemas imediatos de performance

## Limitações

- **Limite Físico**: Há um máximo de melhorias possíveis em um servidor
- **Custo**: Hardware mais potente custa exponencialmente mais
- **Ponto Único de Falha**: Se falhar, todo o sistema cai

## Quando Usar

- **Aplicações Pequenas**: Tráfego moderado e crescimento previsível
- **Solução Temporária**: Correção rápida para performance
- **Sistemas Monolíticos**: Aplicações não projetadas para distribuição

[Explorar Simulador de Escalabilidade](/principios-design/escalabilidade/simulator)
$mdx$),
  ('design-principles/data-consistency', '/principios-design/escalabilidade/consistencia', 'design', true, 41, NULL, true, 'Consistência de Dados', 'Consistência de Dados', $mdx$# Consistência de Dados

A consistência de dados significa garantir que todas as cópias de dados em diferentes servidores sejam atualizadas simultaneamente, um desafio crucial em sistemas distribuídos.

## O Desafio

Em sistemas distribuídos, especialmente quando há várias réplicas de dados espalhadas por diferentes regiões geográficas, manter a consistência torna-se um desafio complexo. Quanto maior o sistema, mais difícil é garantir que todas as mudanças sejam refletidas de forma instantânea em todas as réplicas.

<Callout type="neutral" title="Exemplo Prático">

Em uma plataforma de e-commerce, se um cliente compra o último item de um estoque, é crucial que essa informação seja imediatamente refletida em todos os servidores. Caso contrário, outro cliente pode tentar comprar o mesmo item, gerando problemas como pedidos duplicados ou insatisfação do cliente.

</Callout>

## Modelos de Consistência

<Cards cols={3}>

<Card title="Consistência Forte" accent="slate">

Todas as réplicas são atualizadas antes de qualquer nova operação, garantindo que todos vejam os mesmos dados.

</Card>

<Card title="Consistência Eventual" accent="slate">

As réplicas podem divergir temporariamente, mas eventualmente convergem para o mesmo estado.

</Card>

<Card title="Consistência Causal" accent="slate">

Eventos relacionados são vistos na mesma ordem por todos os participantes do sistema.

</Card>

</Cards>

## Estratégias de Implementação

<Cards cols={3}>

<Card title="Quorum" accent="slate">

Requer um número mínimo de nós para confirmar uma operação antes de considerá-la bem-sucedida.

</Card>

<Card title="Vector Clocks" accent="slate">

Mantém um registro da ordem dos eventos para detectar e resolver conflitos de atualização.

</Card>

<Card title="Consensus Protocols" accent="slate">

Algoritmos como Paxos ou Raft para garantir acordo entre múltiplos nós.

</Card>

</Cards>

## Melhores Práticas

<Cards cols={3}>

<Card title="Escolha do Modelo" accent="slate">

Selecione o modelo de consistência apropriado para cada tipo de dado e caso de uso.

</Card>

<Card title="Monitoramento" accent="slate">

Implemente sistemas robustos de monitoramento para detectar e resolver inconsistências.

</Card>

<Card title="Resolução de Conflitos" accent="slate">

Defina estratégias claras para resolver conflitos quando ocorrerem atualizações simultâneas.

</Card>

</Cards>

[Explorar Simulador de Escalabilidade](/principios-design/escalabilidade/simulator)
$mdx$, $mdx$# Consistência de Dados

A consistência de dados significa garantir que todas as cópias de dados em diferentes servidores sejam atualizadas simultaneamente, um desafio crucial em sistemas distribuídos.

## O Desafio

Em sistemas distribuídos, especialmente quando há várias réplicas de dados espalhadas por diferentes regiões geográficas, manter a consistência torna-se um desafio complexo. Quanto maior o sistema, mais difícil é garantir que todas as mudanças sejam refletidas de forma instantânea em todas as réplicas.

<Callout type="neutral" title="Exemplo Prático">

Em uma plataforma de e-commerce, se um cliente compra o último item de um estoque, é crucial que essa informação seja imediatamente refletida em todos os servidores. Caso contrário, outro cliente pode tentar comprar o mesmo item, gerando problemas como pedidos duplicados ou insatisfação do cliente.

</Callout>

## Modelos de Consistência

<Cards cols={3}>

<Card title="Consistência Forte" accent="slate">

Todas as réplicas são atualizadas antes de qualquer nova operação, garantindo que todos vejam os mesmos dados.

</Card>

<Card title="Consistência Eventual" accent="slate">

As réplicas podem divergir temporariamente, mas eventualmente convergem para o mesmo estado.

</Card>

<Card title="Consistência Causal" accent="slate">

Eventos relacionados são vistos na mesma ordem por todos os participantes do sistema.

</Card>

</Cards>

## Estratégias de Implementação

<Cards cols={3}>

<Card title="Quorum" accent="slate">

Requer um número mínimo de nós para confirmar uma operação antes de considerá-la bem-sucedida.

</Card>

<Card title="Vector Clocks" accent="slate">

Mantém um registro da ordem dos eventos para detectar e resolver conflitos de atualização.

</Card>

<Card title="Consensus Protocols" accent="slate">

Algoritmos como Paxos ou Raft para garantir acordo entre múltiplos nós.

</Card>

</Cards>

## Melhores Práticas

<Cards cols={3}>

<Card title="Escolha do Modelo" accent="slate">

Selecione o modelo de consistência apropriado para cada tipo de dado e caso de uso.

</Card>

<Card title="Monitoramento" accent="slate">

Implemente sistemas robustos de monitoramento para detectar e resolver inconsistências.

</Card>

<Card title="Resolução de Conflitos" accent="slate">

Defina estratégias claras para resolver conflitos quando ocorrerem atualizações simultâneas.

</Card>

</Cards>

[Explorar Simulador de Escalabilidade](/principios-design/escalabilidade/simulator)
$mdx$),
  ('design-principles/latency', '/principios-design/escalabilidade/latencia', 'design', true, 42, NULL, true, 'Latency', 'Latência', $mdx$# Latency

Latency is the delay in delivering data or responses within a system. In distributed systems, especially those across multiple regions, latency can increase due to physical distance or communication complexity.

## The Impact of Latency

Latency can significantly affect user experience and overall system performance. Even small delays may have a large impact on user satisfaction and business metrics.

<Callout type="neutral" title="Exemplo">

A user in Ireland accessing servers in the US may experience delays due to geographic distance and network hops.

</Callout>

## Types of Latency

- **Network Latency**: Time required for a data packet to travel between two points on the network.
- **Processing Latency**: Time the system takes to process a request and produce a response.
- **Storage Latency**: Time required to read or write data in a storage system.

## Optimization Strategies

- **CDN**: Use content delivery networks to bring data closer to users.
- **Caching**: Store frequently accessed data closer to the user.
- **Edge Computing**: Process data near the source to reduce delay.

## Best Practices

- **Monitoring**: Implement detailed metrics to identify and resolve latency bottlenecks.
- **Code Optimization**: Keep code efficient to minimize processing time.
- **Geographic Distribution**: Distribute resources in different regions to serve users locally.

[Explore Scalability Simulator](/principios-design/escalabilidade/simulator)
$mdx$, $mdx$# Latência

Latência é o atraso na entrega de dados ou respostas dentro de um sistema. Em sistemas distribuídos, especialmente em múltiplas regiões, a latência pode aumentar devido à distância física ou à complexidade de comunicação.

## O Impacto da Latência

A latência pode afetar significativamente a experiência do usuário e o desempenho do sistema. Pequenos atrasos podem impactar métricas de negócio e satisfação do usuário.

<Callout type="neutral" title="Exemplo">

A user in Ireland accessing servers in the US may experience delays due to geographic distance and network hops.

</Callout>

## Tipos de Latência

- **Latência de Rede**: Tempo para um pacote viajar entre dois pontos na rede.
- **Latência de Processamento**: Tempo para processar uma requisição e gerar resposta.
- **Latência de Armazenamento**: Tempo para ler ou escrever dados no armazenamento.

## Estratégias de Otimização

- **CDN**: Aproximar dados dos usuários com redes de distribuição de conteúdo.
- **Caching**: Armazenar dados frequentemente acessados mais próximos ao usuário.
- **Edge Computing**: Processar dados próximo à origem para reduzir atrasos.

## Melhores Práticas

- **Monitoramento**: Métricas detalhadas para identificar gargalos de latência.
- **Otimização de Código**: Manter código eficiente e otimizado.
- **Distribuição Geográfica**: Distribuir recursos em diferentes regiões.

[Explorar Simulador de Escalabilidade](/principios-design/escalabilidade/simulator)
$mdx$),
  ('design-principles/failover', '/principios-design/escalabilidade/failover', 'design', true, 43, NULL, true, 'Failover in Distributed Systems', 'Failover em Sistemas Distribuídos', $mdx$# Failover in Distributed Systems

Failover is a critical strategy to ensure service continuity in case of failures, allowing automatic recovery and minimizing downtime.

## What is Failover?

Failover is an automatic recovery mechanism that transfers operations from a failed system to a backup or secondary system. The goal is to keep the service available even when failures occur.

## Types of Failover

- **Active-Passive**: A primary system handles requests while a secondary waits on standby; if the primary fails, the secondary takes over.
- **Active-Active**: Multiple systems handle requests simultaneously; if one fails, others absorb its load.
- **Cascading Failover**: Multiple backup levels where each system takes over in a predefined order when failures occur.

## Essential Components

- Health Monitoring (Health Check)
- Failure Detection
- Transition Mechanism
- State Synchronization
- Automatic Recovery

## Real-World Example

A streaming service implements failover across multiple regions. If a datacenter in Asia fails due to a natural disaster, traffic is automatically redirected to servers in Europe or America, keeping the service available.

## Best Practices

1. Regularly test failover mechanisms
2. Automate detection and transition processes
3. Maintain detailed logs of failover events
4. Configure appropriate timeouts and thresholds
5. Implement real-time monitoring
6. Document failover and recovery procedures

<Callout type="info" title="Explore in Practice">

Try different failover strategies and see how they affect system availability.

[Open Simulator](/principios-design/escalabilidade/simulator)

</Callout>
$mdx$, $mdx$# Failover em Sistemas Distribuídos

Failover é uma estratégia crítica para garantir a continuidade do serviço em caso de falhas, permitindo recuperação automática e minimizando indisponibilidade.

## O que é Failover?

Mecanismo de recuperação automática que transfere operações de um sistema falho para um backup ou sistema secundário, mantendo o serviço disponível.

## Tipos de Failover

- **Ativo-Passivo**: Sistema primário processa requisições e o secundário fica em standby; se o primário falhar, o secundário assume.
- **Ativo-Ativo**: Múltiplos sistemas processam simultaneamente; falhas são absorvidas pelos demais.
- **Failover em Cascata**: Vários níveis de backup, cada um assume em ordem predefinida.

## Componentes Essenciais

- Monitoramento de saúde (Health Check)
- Detecção de falhas
- Mecanismo de transição
- Sincronização de estado
- Recuperação automática

## Exemplo do Mundo Real

Um serviço de streaming com failover em múltiplas regiões. Se um datacenter na Ásia falhar, o tráfego é redirecionado para Europa/América, mantendo disponibilidade.

## Melhores Práticas

1. Teste regularmente os mecanismos de failover
2. Automatize detecção e transição
3. Mantenha logs detalhados
4. Configure timeouts e thresholds
5. Implemente monitoramento em tempo real
6. Documente procedimentos de failover e recuperação

<Callout type="info" title="Explorar na Prática">

Experimente diferentes estratégias de failover e veja o impacto na disponibilidade.

[Abrir Simulador](/principios-design/escalabilidade/simulator)

</Callout>
$mdx$),
  ('design-principles/availability', '/principios-design/disponibilidade', 'design', true, 44, NULL, true, 'High Availability', 'Alta Disponibilidade', $mdx$# High Availability

High availability is a system's ability to remain operational and accessible even under failures, ensuring service continuity through redundancy and automatic recovery.

<Cards cols={3}>

<Card title="Replication" accent="brand">

Keep synchronized copies of data/services across servers to ensure redundancy and load distribution.

[Replication](/principios-design/disponibilidade/replicacao)

</Card>

<Card title="Failover" accent="brand">

Automatic recovery mechanisms that detect failures and redirect traffic to backup systems.

[Failover](/principios-design/disponibilidade/failover)

</Card>

<Card title="Availability Zones" accent="brand">

Deploy across multiple zones to protect against localized infrastructure failures.

[Availability Zones](/principios-design/disponibilidade/zonas)

</Card>

</Cards>

[Explore High Availability Simulator](/principios-design/disponibilidade/simulator)
$mdx$, $mdx$# Alta Disponibilidade

Alta disponibilidade é a capacidade de um sistema manter-se operacional e acessível mesmo em situações de falha, garantindo continuidade do serviço por meio de redundância e recuperação automática.

<Cards cols={3}>

<Card title="Replicação" accent="brand">

Mantenha cópias sincronizadas de dados/serviços para redundância e distribuição de carga.

[Replicação](/principios-design/disponibilidade/replicacao)

</Card>

<Card title="Failover" accent="brand">

Mecanismos automáticos de recuperação que detectam falhas e redirecionam tráfego.

[Failover](/principios-design/disponibilidade/failover)

</Card>

<Card title="Zonas de Disponibilidade" accent="brand">

Distribua a aplicação em várias zonas para proteger contra falhas localizadas.

[Zonas de Disponibilidade](/principios-design/disponibilidade/zonas)

</Card>

</Cards>

[Explorar Simulador de Alta Disponibilidade](/principios-design/disponibilidade/simulator)
$mdx$),
  ('design-principles/replication', '/principios-design/disponibilidade/replicacao', 'design', true, 45, NULL, true, 'Replication in Distributed Systems', 'Replicação em Sistemas Distribuídos', $mdx$# Replication in Distributed Systems

Replication is fundamental to ensure high availability and redundancy.

## What is Replication?

Replication creates and maintains copies of data or services in multiple locations. This increases availability and redundancy, ensuring access even if a server fails.

## Types of Replication

- **Synchronous Replication**: All copies are updated before confirming the operation (strong consistency, higher latency).
- **Asynchronous Replication**: Updates propagate with delay (better performance, eventual consistency).
- **Semi-synchronous Replication**: Hybrid approach where at least one replica confirms before proceeding.

## Benefits

- High availability and fault tolerance
- Geographical distribution for lower latency
- Load balancing across replicas
- Backup and disaster recovery
- Read scalability

## Real-World Example

A social network stores user photos on multiple servers worldwide. If one server fails, a replicated copy is available, preventing data loss and keeping the service online.

## Best Practices

1. Choose replication type based on consistency needs
2. Monitor replica health and status
3. Implement conflict detection and resolution mechanisms
4. Keep replication logs for audit and recovery
5. Regularly test failover scenarios
6. Consider geographic location of replicas

<Callout type="info" title="Explore in Practice">

Try different replication strategies and see their impact on consistency and latency.

[Open Simulator](/principios-design/disponibilidade/simulator)

</Callout>
$mdx$, $mdx$# Replicação em Sistemas Distribuídos

A replicação é fundamental para garantir alta disponibilidade e redundância.

## O que é Replicação?

Replicação consiste em criar e manter cópias de dados ou serviços em vários locais. Isso aumenta a disponibilidade e a redundância, garantindo acesso mesmo se um servidor falhar.

## Tipos de Replicação

- **Replicação Síncrona**: Todas as cópias são atualizadas antes de confirmar (consistência forte, maior latência).
- **Replicação Assíncrona**: Atualizações propagam com atraso (melhor performance, consistência eventual).
- **Replicação Semi-síncrona**: Híbrido em que ao menos uma réplica confirma antes de prosseguir.

## Benefícios

- Alta disponibilidade e tolerância a falhas
- Distribuição geográfica para menor latência
- Balanceamento de carga entre réplicas
- Backup e recuperação de desastres
- Escalabilidade de leitura

## Exemplo do Mundo Real

Uma rede social armazena fotos em múltiplos servidores pelo mundo. Se um falhar, outra cópia evita perda e mantém o serviço online.

## Melhores Práticas

1. Escolha o tipo de replicação conforme a necessidade de consistência
2. Monitore a saúde e o estado das réplicas
3. Implemente mecanismos de detecção e resolução de conflitos
4. Mantenha logs de replicação para auditoria e recuperação
5. Teste regularmente os cenários de failover
6. Considere a localização geográfica das réplicas

<Callout type="info" title="Explorar na Prática">

Experimente diferentes estratégias de replicação e veja o impacto na consistência e latência.

[Abrir Simulador](/principios-design/disponibilidade/simulator)

</Callout>
$mdx$),
  ('design-principles/availability-zones', '/principios-design/disponibilidade/zonas', 'design', true, 46, NULL, true, 'Availability Zones', 'Zonas de Disponibilidade', $mdx$# Availability Zones

Availability Zones are isolated data centers within a geographic region, designed to provide redundancy and high availability for critical applications.

## How It Works

Each availability zone is an independent data center with:

- Independent and redundant power
- Independent cooling systems
- Dedicated network infrastructure
- High-speed connections between zones

The zones are designed to be isolated from failures in other zones, but close enough to ensure low latency communication between them.

## Benefits

<Cards cols={3}>

<Card title="Fault Isolation" accent="green">

Problems in one zone do not affect others, ensuring service continuity.

</Card>

<Card title="High Availability" accent="green">

Resource distribution across zones ensures the service remains available even with the failure of an entire zone.

</Card>

<Card title="Low Latency" accent="green">

High-speed connections between zones allow efficient data synchronization and load balancing.

</Card>

</Cards>

## Real-World Example

<Callout type="neutral" title="Large E-commerce Platform">

An e-commerce platform distributes its application across three availability zones:

- Zone A: Main application server
- Zone B: Active replica and primary database
- Zone C: Backup and secondary database

</Callout>

If Zone A fails, traffic is automatically redirected to Zone B, while Zone C ensures no data is lost during the transition.

## Best Practices

<Cards cols={3}>

<Card title="Smart Distribution" accent="green">

Distribute resources and data evenly across zones to maximize resilience.

</Card>

<Card title="Constant Monitoring" accent="green">

Implement real-time monitoring to detect and respond quickly to problems in any zone.

</Card>

<Card title="Regular Testing" accent="green">

Perform failover tests regularly to ensure transition between zones works as expected.

</Card>

</Cards>

<Callout type="info" title="Explore the Availability Zones Simulator">

Experience in practice how availability zones work and how they respond to different failure scenarios.

[Explore the Availability Zones Simulator](/principios-design/disponibilidade/simulator)

</Callout>
$mdx$, $mdx$# Zonas de Disponibilidade

Zonas de Disponibilidade são datacenters isolados dentro de uma região geográfica, projetados para fornecer redundância e alta disponibilidade para aplicações críticas.

## Como Funciona

Cada zona de disponibilidade é um datacenter independente com:

- Energia própria e redundante
- Refrigeração independente
- Infraestrutura de rede dedicada
- Conexões de alta velocidade entre zonas

As zonas são projetadas para serem isoladas de falhas em outras zonas, mas próximas o suficiente para garantir baixa latência na comunicação entre elas.

## Benefícios

<Cards cols={3}>

<Card title="Isolamento de Falhas" accent="green">

Problemas em uma zona não afetam as outras, garantindo a continuidade do serviço.

</Card>

<Card title="Alta Disponibilidade" accent="green">

Distribuição de recursos entre zonas garante que o serviço permaneça disponível mesmo com a falha de uma zona inteira.

</Card>

<Card title="Baixa Latência" accent="green">

Conexões de alta velocidade entre zonas permitem sincronização eficiente de dados e balanceamento de carga.

</Card>

</Cards>

## Exemplo do Mundo Real

<Callout type="neutral" title="E-commerce de Grande Porte">

Um e-commerce distribui sua aplicação em três zonas de disponibilidade:

- Zona A: Servidor principal de aplicação
- Zona B: Réplica ativa e banco de dados principal
- Zona C: Backup e banco de dados secundário

</Callout>

Se a Zona A falhar, o tráfego é automaticamente redirecionado para a Zona B, enquanto a Zona C garante que nenhum dado seja perdido durante a transição.

## Melhores Práticas

<Cards cols={3}>

<Card title="Distribuição Inteligente" accent="green">

Distribua recursos e dados de forma equilibrada entre as zonas para maximizar a resiliência.

</Card>

<Card title="Monitoramento Constante" accent="green">

Implemente monitoramento em tempo real para detectar e responder rapidamente a problemas em qualquer zona.

</Card>

<Card title="Testes Regulares" accent="green">

Realize testes de failover regularmente para garantir que a transição entre zonas funcione conforme esperado.

</Card>

</Cards>

<Callout type="info" title="Explorar o Simulador de Zonas de Disponibilidade">

Experimente na prática como as zonas de disponibilidade funcionam e como elas respondem a diferentes cenários de falha.

[Explorar o Simulador de Zonas de Disponibilidade](/principios-design/disponibilidade/simulator)

</Callout>
$mdx$),
  ('intro', '/intro', 'fundamentals', false, 0, NULL, true, 'Introduction', 'Introdução', $mdx$# Introduction

Before diving into the topic, I will briefly introduce my career, the motivation for producing this content, and the goal to be achieved by the end.

## About Me

My journey in programming began around 2001, when I was 12 and took a course in HTML, JavaScript, Photoshop, and Macromedia Flash.

After that course, I already knew what I wanted to do with my life: Program! From then until college, I built dozens of websites for friends and family, using every opportunity to offer a site and improve my skills.

In 2007 I entered university to study Computer Science and encountered more theoretical subjects, such as Data Structures (in which I failed twice). I realized that, besides liking it, discipline, willpower, and a lot of study are needed—like any profession.

In 2008 I entered the job market at a small company called Miziara Software. There were the two owners and four interns, including me. The promise was: "If we sell this product to the first client, the four interns will be hired." Today it would be called a startup, but at the time it was just a company.

The idea was interesting: a person with business knowledge would map use cases and screens in an Excel spreadsheet, which would be interpreted by software to generate the application. I can say I started my professional experience head-on, being not only a developer but also QA, infrastructure, product, and any other role needed.

After a year and a half on this project as an intern, the software was sold and we were all made full-time. Soon the company was acquired by a large Brazilian telecom company, and I entered the corporate world.

After that, my career spanned large financial institutions, public agencies, and research institutes, until an opportunity arose to work abroad—in Ireland, where I have lived since 2017.

There I transitioned to an Engineering Manager role in 2020.

Throughout my career, I have had the opportunity to work with a wide variety of programming languages and tools.

## Motivation and Goal

In this material, my intention is to put more than 16 years of experience into practice so that you leave with the mindset that, beyond technical repertoire, you need to get hands-on, experiment, and validate your solutions.

Although there is much material on distributed systems and system design, this content aims to objectively cover various components and techniques used in critical systems.

With a market perspective—having participated in projects at different stages of maturity and architecture—I want to share some of my experience so you do not need to learn the hard way.

> You will not leave here with a one-size-fits-all solution, but with a repertoire that will help you make better decisions and design resilient, scalable, performant systems with observability.
$mdx$, $mdx$# Introdução

Antes de entrarmos no assunto a ser abordado, vou fazer uma breve introdução sobre a minha carreira, a motivação de produzir esse conteúdo e o objetivo a ser alcançado ao fim da leitura.

## Sobre Mim

Minha jornada no mundo da programação começou em meados de 2001, quando tinha 12 anos e entrei em um curso de HTML, Javascript, Photoshop e Macromedia Flash.

Após fazer esse curso, já sabia o que queria fazer da minha vida: Programar! Desde então até entrar na faculdade fiz dezenas de sites para amigos, família, etc. Usava toda oportunidade que tinha para oferecer um site e aprimorar meus conhecimentos.

Em 2007 entrei na universidade para cursar Ciências da Computação e me deparei com matérias mais teóricas, como Estrutura de Dados (na qual reprovei 2 vezes). Vi que era preciso, além de gostar, disciplina, força de vontade e muito estudo, como qualquer profissão.

Em 2008 entrei no mercado de trabalho, em uma pequena empresa chamada Miziara Software. Eram os 2 donos e 4 estagiários, contando comigo. A promessa era: "Se vendermos esse produto pro primeiro cliente os 4 estagiários serão contratados." Hoje em dia se usaria o termo startup, mas na época era só empresa mesmo.

A ideia era interessante, uma pessoa que tivesse o conhecimento do negócio fazia o mapeamento dos casos de uso e telas em uma planilha Excel, que seria interpretada por um software e então a aplicação gerada. Posso dizer que já comecei minha experiência profissional entrando de cabeça sendo, além de desenvolvedor, também QA, infra, produto e qualquer outro cargo.

Após 1 ano e meio nesse projeto como estagiário, o software foi vendido e fomos todos efetivados. Logo a empresa foi comprada por uma grande empresa de Telecom brasileira e entrei no mundo "corporativo".

Após isso, minha vida profissional navegou em grandes instituições financeiras, órgãos públicos e institutos de pesquisa, até aparecer uma oportunidade de trabalhar no exterior, mais precisamente na Irlanda onde moro desde 2017.

Aqui foi onde fiz minha transição de carreira para atuar como Engineering Manager em 2020.

Em toda minha carreira, tive a oportunidade de trabalhar com uma infinidade de linguagens de programação e ferramentas.

## Motivação e Objetivo

Nesse material a minha intenção é poder colocar todos esses mais de 16 anos de experiência em prática, de forma que você saia daqui com uma mentalidade de que é necessário, além de ter um repertório técnico, colocar a mão na massa, experimentar e validar suas soluções.

Apesar de haverem muitos materiais sobre sistemas distribuídos, system design, etc, esse material vem para tentar de forma objetiva passar por diversos tipos de componentes e técnicas utilizados em sistemas críticos.

Com uma visão de mercado, tendo participado de projetos em diferentes estágios de maturidade e arquitetura, quero aqui passar um pouco da minha experiência para que você não precise sentir na pele.

> Você não sairá daqui com uma solução "one size fits all", mas sim com um repertório que te ajudará a tomar melhores decisões e projetar sistemas resilientes, escaláveis, performáticos e com observabilidade.
$mdx$),
  ('distributed-systems-101', '/sistemas-distribuidos-101', 'fundamentals', false, 1, NULL, true, 'Distributed Systems 101', 'Sistemas Distribuídos 101', $mdx$# Distributed Systems 101

When discussing distributed systems concepts, people often ask: *"But after all, what characterizes a distributed system?"* and *"How do I know if I work with distributed systems?"*

<VideoEmbed src="https://www.youtube.com/embed/yj9jIfi3iR4" title="What are Distributed Systems?" />

By definition, we can say that a distributed system is:

> A collection of computer programs that use computing resources across multiple distinct points of computation to achieve a common, shared goal.

Let's illustrate what a distributed system is using a burger restaurant as a metaphor.

## 1. Simple Burger Joint (Monolithic)

Imagine you just opened a burger joint and hired a single employee. This person does everything:

- Greets the customer and writes down the order
- Prepares the burger
- Takes the payment
- Delivers the order

In this scenario, the burger joint behaves like a monolithic system:

- Everything happens in a single "node" (the employee)
- They do all tasks, which can cause delays if there are many orders or a sudden spike in demand
- If the employee stops, the burger joint stops (single point of failure)

## 2. Division of Tasks (The Beginning of Distribution)

The burger joint starts to grow, and you realize one person can't do everything efficiently. So, you hire one more person:

- One employee takes orders and payments
- The other prepares the burger

Here we start to see a basic distributed system:

- Tasks are divided among different "nodes" (employees)
- While one handles orders and payments, the other can already be preparing the burger, increasing efficiency
- However, there's still dependency: if one fails, operations may be impacted

## 3. Expansion and Optimization (Partially Independent Distributed System)

With success, your burger joint attracts more customers, so the structure needs to expand. Now we have:

- Multiple order takers
- A kitchen with more cooks, each specialized in a type of preparation (grilling, assembling, fries)
- Multiple griddles, grills, stations
- A ticket system to organize the flow of orders

At this point, the burger joint is closer to a classic distributed system:

- Decentralization of responsibilities: Each employee has a specific function (order takers, cooks, cashier)
- Parallelism: Multiple orders can be processed at the same time, both at the counter and in the kitchen
- Resilience: If one cook fails or is overloaded, another can take part of the work or help

## 4. Large Burger Chain (Network of Distributed Systems)

Now the burger joint has become a chain with multiple stores, and each store is a distributed system itself. There are:

- Connected stores: Each can operate independently but share a central online ordering system
- Central coordination: A central system (like a delivery app) can distribute orders among stores
- Load balancing: If one store is overloaded, the system can route new orders to another store

Here, the burger chain illustrates a complex distributed system well:

- Scalability: The network can grow as more stores are added
- Fault tolerance: If a store is offline, others keep operating
- Optimized latency: Orders are routed to the closest or least loaded store

## Conclusion: Distributed Systems and Burger Joints

- In the beginning, the burger joint was a centralized monolithic system with a single point of failure
- As it grows, it distributes tasks among employees, optimizing processes and increasing resilience and efficiency
- In a complex distributed system (a network of burger joints), there is independence, parallelism, load balancing, and redundancy

> This model helps visualize how, by dividing responsibilities and distributing work among different "nodes", we can increase the efficiency and resilience of a system—be it a burger joint or a computing system.
$mdx$, $mdx$# Sistemas Distribuídos 101

Ao abordar conceitos de sistemas distribuídos muitas vezes as pessoas me perguntam: *"Mas afinal o que caracteriza um sistema distribuído?"* e *"Como eu sei se trabalho com sistemas distribuídos?"*

<VideoEmbed src="https://www.youtube.com/embed/yj9jIfi3iR4" title="O que são Sistemas Distribuídos?" />

Por definição, podemos dizer que um sistema distribuído é:

> Uma coleção de programas de computador que utilizam recursos computacionais em vários pontos centrais de computação diferentes para atingir um objetivo comum e compartilhado.

Vamos exemplificar aqui o que é um sistema distribuído utilizando uma hamburgueria como metáfora.

## 1. Hamburgueria Simples (Monolítica)

Imagine que você acabou de abrir uma hamburgueria, e contratou um único funcionário. Essa pessoa faz tudo:

- Atende o cliente, anota o pedido
- Prepara o hambúrguer
- Recebe o pagamento
- Entrega o pedido

Nesse cenário, a hamburgueria funciona como um sistema monolítico:

- Tudo acontece em um único "nó" (o funcionário)
- Ele faz todas as tarefas, o que pode causar atrasos se houver muitos pedidos, se houver uma demanda inesperada
- Se o funcionário parar, a hamburgueria para (ponto único de falha)

## 2. Divisão de Tarefas (O Início da Distribuição)

A hamburgueria começa a crescer, e você percebe que uma única pessoa não consegue fazer tudo de maneira eficiente. Então, você contrata mais uma pessoa:

- Um funcionário anota o pedido e recebe o pagamento
- O outro prepara o hambúrguer

Aqui, já começamos a ver um sistema distribuído básico:

- As tarefas são divididas entre diferentes "nós" (funcionários)
- Enquanto um recebe o pedido e o pagamento, o outro já pode estar preparando o hambúrguer, aumentando a eficiência
- No entanto, ainda há dependência entre os dois: se um falhar, a operação pode ser impactada

## 3. Expansão e Otimização (Sistema Distribuído Parcialmente Independente)

Com o sucesso, a sua hamburgueria começa a atrair muitos clientes, então a estrutura precisa se expandir. Agora, temos:

- Vários atendentes
- Uma cozinha com mais cozinheiros, cada um especializado em um tipo de preparo (carnes, montagem, frituras)
- Múltiplas chapas, grelhas, estações de trabalho
- Um sistema de senhas para organizar o fluxo de pedidos

Nesse ponto, a hamburgueria está mais próxima de um sistema distribuído clássico:

- Descentralização das responsabilidades: Cada funcionário tem uma função específica (atendentes, cozinheiros, caixa)
- Paralelismo: Vários pedidos podem ser processados ao mesmo tempo, tanto no atendimento quanto na cozinha
- Resiliência: Se um cozinheiro falhar ou está sobrecarregado, outro pode assumir parte da tarefa ou ajudar

## 4. Hamburgueria Grande (Rede de Sistemas Distribuídos)

Agora, a hamburgueria se tornou uma rede com várias filiais, e cada filial é um sistema distribuído por si só. Há:

- Filiais conectadas: Cada uma pode operar de forma independente, mas compartilham um sistema central de pedidos online
- Coordenação central: Um sistema central (como um aplicativo de delivery) pode distribuir pedidos entre as diferentes filiais
- Balanceamento de carga: Se uma filial está sobrecarregada, o sistema pode direcionar novos pedidos para outra filial

Aqui, a hamburgueria exemplifica bem um sistema distribuído complexo:

- Escalabilidade: A rede pode crescer conforme mais filiais são adicionadas
- Tolerância a falhas: Se uma filial estiver offline, as outras continuam funcionando
- Latência otimizada: Os pedidos são distribuídos para a filial mais próxima ou com menor carga

## Conclusão: Sistemas Distribuídos e Hamburguerias

- No início, a hamburgueria era um sistema centralizado e monolítico, com um único ponto de falha
- Conforme cresce, ela distribui as tarefas entre funcionários, otimizando processos e aumentando a resiliência e eficiência
- Em um sistema distribuído complexo (uma rede de hamburguerias), há independência, paralelismo, balanceamento de carga e redundância

> Esse modelo ajuda a visualizar como, ao dividir as responsabilidades e distribuir o trabalho entre diferentes "nós", podemos aumentar a eficiência e resiliência de um sistema, seja ele uma hamburgueria ou um sistema computacional.
$mdx$),
  ('system-design-101', '/system-design-101', 'fundamentals', false, 2, NULL, true, 'System Design 101', 'System Design 101', $mdx$# System Design 101

## 1.1 What is System Design?

System Design is the process of designing the architecture of a software system so that it is scalable, efficient, resilient, and meets business and technical requirements. This involves defining software components, infrastructure, communication protocols, and data management to ensure the system works correctly under different workloads and environments.

In practice, System Design is frequently discussed in technical interviews, especially for engineering roles. The ability to design large-scale systems such as social networks, instant messaging systems, or e-commerce platforms is tested. System design focuses on solving real problems while considering time, resource, and complexity constraints.

## 1.2 Why is System Design important?

Its importance is directly related to the need to build systems that can handle large volumes of data, many concurrent users, and unpredictable failure scenarios. With growing system complexity and data volume, engineers must think not only about immediate functionality but also long-term scalability, maintainability, and reliability.

Here are some reasons why System Design is crucial:

- **Scalability:** Systems must grow in capacity as users and data increase. A good design enables scaling without compromising performance.
- **Resilience:** Systems should continue operating even when individual components fail. System Design addresses how to handle such scenarios.
- **Efficiency:** Optimizing resource usage is essential to ensure low operating cost and fast responses for users.
- **Maintainability:** A well-designed system makes future maintenance, changes, and expansions easier.
- **User Experience:** Poorly designed systems can directly impact users, resulting in slowness, downtime, or even data loss.

## 1.3 Key concepts and terminology

System Design commonly uses several technical terms. Below are foundational concepts covered throughout this material:

- **Scalability:** The ability of a system to grow to meet increasing workload. Can be horizontal (adding machines) or vertical (improving hardware).
- **Consistency:** Ensuring all nodes in a distributed system have the same data at a given moment. Strong consistency means data is the same everywhere; eventual consistency means it converges over time.
- **Availability:** The ability for a system to be available to users even under partial failures. High availability keeps the service operating under adverse conditions.
- **Latency:** The time it takes for data to travel across the system. Low latency is essential for good user experiences, especially in real-time systems.
- **Throughput:** The amount of data a system can process over a given period.
- **Fault tolerance:** The ability of a system to continue operating correctly even when a part of it fails.
- **Load balancing:** Distributing tasks or client requests across multiple servers to optimize resource usage and avoid overload.
- **Sharding:** Splitting a database or storage system into smaller parts (shards) to increase scalability and performance.
- **Replication:** Copying data across servers or nodes to ensure redundancy and increase availability.

## 1.4 Topics covered

This System Design material will cover, in detail, the following topics:

- **Distributed systems fundamentals:** Explore distributed systems concepts such as scalability, consistency, and availability, and how to balance them.
- **Components of a modern system:** Cache, databases, load balancers, message queues, and other critical components of large-scale distributed architectures.
- **Design principles:** How to approach system design to maximize scalability, efficiency, and resilience.
- **Consistency strategies:** Explore different consistency models (eventual and strong) and how to apply them in distributed systems.
- **Designing complex systems:** Step-by-step design of systems like instant messaging, e-commerce platforms, or social networks.
- **Monitoring and maintenance:** Best practices to monitor production systems, detect problems, and act quickly to resolve them.
- **System Design technical interviews:** How to prepare for system design interview questions, with examples and detailed answers.
$mdx$, $mdx$# System Design 101

## 1.1 O que é System Design?

System Design é o processo de projetar a arquitetura de um sistema de software de maneira que ele seja escalável, eficiente, resiliente e atenda aos requisitos de negócio e técnicos. Envolve a definição de componentes de software, infraestrutura, protocolos de comunicação e o gerenciamento de dados para garantir que o sistema funcione corretamente sob diferentes cargas e ambientes.

Na prática, System Design é frequentemente discutido em entrevistas técnicas, especialmente para vagas de engenharia. A habilidade de projetar sistemas em grande escala, como redes sociais, instant messaging systems, ou plataformas de e-commerce, é testada. O foco é resolver problemas reais considerando restrições de tempo, recursos e complexidade.

## 1.2 Por que System Design é importante?

A importância está ligada à necessidade de construir sistemas que lidem com grandes volumes de dados, muitos usuários simultâneos e cenários imprevisíveis de falhas. Com a complexidade crescente e o aumento de dados, é crucial pensar não apenas na funcionalidade imediata, mas também na escalabilidade, manutenibilidade e confiabilidade de longo prazo.

Motivos pelos quais System Design é crucial:

- **Escalabilidade:** Sistemas precisam crescer conforme usuários e dados aumentam. Um bom design permite escalar sem comprometer o desempenho.
- **Resiliência:** Sistemas devem continuar operando mesmo diante de falhas de componentes. System Design trata como lidar com esses cenários.
- **Eficiência:** Otimizar uso de recursos é essencial para baixo custo de operação e respostas rápidas.
- **Manutenibilidade:** A well-designed system makes future maintenance, changes, and expansions easier.
- **Experiência do Usuário:** Sistemas mal projetados impactam diretamente usuários, causando lentidão, indisponibilidade ou perda de dados.

## 1.3 Principais conceitos e terminologias

No processo de System Design, é comum o uso de várias terminologias. A seguir, conceitos fundamentais abordados neste material:

- **Escalabilidade:** Capacidade de um sistema crescer para atender carga crescente. Pode ser horizontal (adicionando máquinas) ou vertical (melhorando hardware).
- **Consistência:** Garantir que todos os nós tenham os mesmos dados em um momento. Forte: dados iguais em todos os lugares; eventual: converge ao longo do tempo.
- **Disponibilidade:** Capacidade de estar disponível mesmo sob falhas parciais. Alta disponibilidade mantém o serviço sob condições adversas.
- **Latência:** Tempo para dados atravessarem o sistema. Baixa latência é essencial para boa experiência, especialmente em tempo real.
- **Throughput:** Quantidade de dados processada em um período.
- **Tolerância a falhas:** Habilidade de continuar funcionando corretamente mesmo quando parte falha.
- **Balanceamento de carga:** Distribuição de tarefas/requisições entre servidores para otimizar recursos e evitar sobrecarga.
- **Sharding:** Dividir um banco de dados/armazenamento em partes menores (shards) para aumentar escalabilidade e desempenho.
- **Replicação:** Cópia de dados entre servidores/nós para garantir redundância e aumentar disponibilidade.

## 1.4 Tópicos abordados

Este material abordará, em detalhes, os seguintes tópicos:

- **Fundamentos de sistemas distribuídos:** Explorar conceitos como escalabilidade, consistência e disponibilidade, e como balanceá-los.
- **Componentes de um sistema moderno:** Cache, bancos de dados, balanceadores de carga, filas de mensagens e componentes críticos de arquiteturas de larga escala.
- **Princípios de design:** Como abordar o design para maximizar escalabilidade, eficiência e resiliência.
- **Estratégias de consistência:** Explore different consistency models (eventual and strong) and how to apply them in distributed systems.
- **Design de sistemas complexos:** Passo a passo de como projetar sistemas como mensagens instantâneas, e-commerce ou redes sociais.
- **Monitoramento e manutenção:** Boas práticas para monitorar produção, detectar problemas e agir rapidamente.
- **Entrevistas técnicas de System Design:** Como se preparar para perguntas de design, com exemplos e respostas detalhadas.
$mdx$),
  ('monitoring/index', '/monitoramento-e-manutencao', 'monitoring', true, 65, NULL, true, 'Monitoring and Maintenance of Distributed Systems', 'Monitoramento e Manutenção de Sistemas Distribuídos', $mdx$# Monitoring and Maintenance of Distributed Systems

Monitoring and maintenance are critical to ensure the health, performance, and reliability of distributed systems. An effective strategy combines observability with proactive maintenance practices.

<Callout type="info" title="💡 Key Concept">

Observability in distributed systems is built on three pillars: metrics, logs, and traces. Together, they provide a complete view of the system's state and behavior.

</Callout>

## The Three Pillars of Observability

<Cards cols={3}>

<Card title="Metrics" accent="brand">

- Numerical data over time
- CPU, memory, latency, throughput
- Aggregations and trends
- Basis for alerts and dashboards

</Card>

<Card title="Logs" accent="purple">

- Event records
- Debugging and audit
- Detailed context
- Action history

</Card>

<Card title="Traces" accent="green">

- Request flow
- Service dependencies
- End-to-end performance
- Problem diagnosis

</Card>

</Cards>

## Essential Metrics (Golden Signals)

<Cards cols={2}>

<Card title="USE Method" accent="brand">

Utilization, Saturation, and Errors — a method for resource performance analysis.

- **Utilization**: Percentage of time the resource is busy
- **Saturation**: Degree of resource overload
- **Errors**: Failure rate of the resource

</Card>

<Card title="RED Method" accent="purple">

Rate, Errors, and Duration — focused on request and service metrics.

- **Rate**: Requests per second
- **Errors**: Failure rate of requests
- **Duration**: Request response time

</Card>

</Cards>

## Monitoring Tools

<Cards cols={3}>

<Card title="Metrics" accent="brand">

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Datadog**: Monitoring as a service

</Card>

<Card title="Logs" accent="purple">

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Graylog**: Centralized log management
- **Splunk**: Advanced log analytics

</Card>

<Card title="Tracing" accent="green">

- **Jaeger**: Open-source distributed tracing
- **Zipkin**: Latency tracking
- **New Relic**: APM and tracing as a service

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Monitoring" accent="brand">

- **Proactive Monitoring**: Identify issues before they impact users
- **Meaningful Alerts**: Configure alerts that truly importam
- **Automation**: Automate responses to common issues

</Card>

<Card title="Maintenance" accent="purple">

- **Preventive Maintenance**: Schedule regular maintenance
- **Documentation**: Keep documentation up to date
- **Backup and Recovery**: Implement and test recovery plans

</Card>

</Cards>

## Service Level Objectives

<Cards cols={3}>

<Card title="SLI" accent="brand">

Service Level Indicator

- Specific metrics
- Latency
- Availability
- Error rate

</Card>

<Card title="SLO" accent="purple">

Service Level Objective

- Targets for SLIs
- 99.9% uptime
- Latency < 200ms
- Error rate < 0.1%

</Card>

<Card title="SLA" accent="green">

Service Level Agreement

- Formal contract
- Consequences
- Compensations
- Guarantees

</Card>

</Cards>
$mdx$, $mdx$# Monitoramento e Manutenção de Sistemas Distribuídos

O monitoramento e manutenção são aspectos críticos para garantir a saúde, performance e confiabilidade de sistemas distribuídos. Uma estratégia eficaz combina diferentes aspectos de observabilidade com práticas proativas de manutenção.

<Callout type="info" title="💡 Conceito Chave">

A observabilidade em sistemas distribuídos é construída sobre três pilares fundamentais: métricas, logs e traces. Juntos, eles fornecem uma visão completa do estado e comportamento do sistema.

</Callout>

## Os Três Pilares da Observabilidade

<Cards cols={3}>

<Card title="Métricas" accent="brand">

- Dados numéricos ao longo do tempo
- CPU, memória, latência, throughput
- Agregações e tendências
- Base para alertas e dashboards

</Card>

<Card title="Logs" accent="purple">

- Registros de eventos
- Debugging e auditoria
- Contexto detalhado
- Histórico de ações

</Card>

<Card title="Traces" accent="green">

- Fluxo de requisições
- Dependências entre serviços
- Performance end-to-end
- Diagnóstico de problemas

</Card>

</Cards>

## Métricas Essenciais (Golden Signals)

<Cards cols={2}>

<Card title="Método USE" accent="brand">

Utilization, Saturation, and Errors - um método para análise de performance de recursos.

- **Utilização**: Percentual de tempo que o recurso está ocupado
- **Saturação**: Grau de sobrecarga do recurso
- **Erros**: Taxa de falhas do recurso

</Card>

<Card title="Método RED" accent="purple">

Rate, Errors, and Duration - focado em métricas de requisições e serviços.

- **Taxa (Rate)**: Número de requisições por segundo
- **Erros (Errors)**: Taxa de falhas nas requisições
- **Duração (Duration)**: Tempo de resposta das requisições

</Card>

</Cards>

## Ferramentas de Monitoramento

<Cards cols={3}>

<Card title="Métricas" accent="brand">

- **Prometheus**: Coleta e armazenamento de métricas
- **Grafana**: Visualização e dashboards
- **Datadog**: Monitoramento como serviço

</Card>

<Card title="Logs" accent="purple">

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Graylog**: Gerenciamento centralizado de logs
- **Splunk**: Análise avançada de logs

</Card>

<Card title="Tracing" accent="green">

- **Jaeger**: Tracing distribuído de código aberto
- **Zipkin**: Rastreamento de latência
- **New Relic**: APM e tracing como serviço

</Card>

</Cards>

## Melhores Práticas

<Cards cols={2}>

<Card title="Monitoramento" accent="brand">

- **Monitoramento Proativo**: Identifique problemas antes que afetem os usuários
- **Alertas Significativos**: Configure alertas que realmente importam
- **Automação**: Automatize respostas para problemas comuns

</Card>

<Card title="Manutenção" accent="purple">

- **Manutenção Preventiva**: Agende manutenções regulares
- **Documentação**: Mantenha documentação atualizada
- **Backup e Recuperação**: Implemente e teste planos de recuperação

</Card>

</Cards>

## Objetivos de Nível de Serviço

<Cards cols={3}>

<Card title="SLI" accent="brand">

Service Level Indicator

- Métricas específicas
- Latência
- Disponibilidade
- Taxa de erros

</Card>

<Card title="SLO" accent="purple">

Service Level Objective

- Metas para SLIs
- 99.9% uptime
- Latência < 200ms
- Error rate < 0.1%

</Card>

<Card title="SLA" accent="green">

Service Level Agreement

- Contrato formal
- Consequências
- Compensações
- Garantias

</Card>

</Cards>
$mdx$),
  ('monitoring/metrics', '/monitoramento-e-manutencao/metricas', 'monitoring', true, 66, NULL, true, 'Metrics and KPIs in Distributed Systems', 'Métricas e KPIs em Sistemas Distribuídos', $mdx$# Metrics and KPIs in Distributed Systems

Metrics and KPIs (Key Performance Indicators) are fundamental to understand behavior, performance, and health of distributed systems. They provide quantitative insights for data-driven decisions.

<Callout type="info" title="💡 Key Concept">

Effective metrics should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.

</Callout>

## Core Metric Categories

<Cards cols={2}>

<Card title="System Metrics" accent="brand">

- **CPU Utilization**: Percentage of CPU usage per service
- **Memory Usage**: RAM and virtual memory consumption
- **Disk I/O**: Read/write rate and disk latency

</Card>

<Card title="Application Metrics" accent="purple">

- **Throughput**: Requests processed per second
- **Latency**: Request response time
- **Error Rate**: Percentage of failed requests

</Card>

</Cards>

## Performance Metrics

<Cards cols={2}>

<Card title="Latency" accent="green">

**Percentiles**

- P50 (Median): < 100ms
- P90: < 200ms
- P99: < 500ms

**Components**

- Network Time
- Processing Time
- Queue Time

</Card>

<Card title="Throughput" accent="yellow">

**Measures**

- RPS (Requests per Second)
- TPS (Transactions per Second)
- QPS (Queries per Second)

**Capacity**

- Peak Load
- Sustained Load
- Burst Capacity

</Card>

</Cards>

## Business KPIs

<Cards cols={3}>

<Card title="Availability" accent="brand">

- Uptime
- MTBF (Mean Time Between Failures)
- MTTR (Mean Time To Recovery)
- Error Budget

</Card>

<Card title="Quality" accent="purple">

- Success Rate
- Error Rate
- Data Quality
- User Satisfaction

</Card>

<Card title="Cost" accent="green">

- Infrastructure Cost
- Cost per Request
- Resource Utilization
- ROI

</Card>

</Cards>

## Implementation with Prometheus

Example of metrics configuration using Prometheus and PromQL:

```
# Example of metrics configuration using Prometheus and PromQL
http_request_duration_seconds_bucket{path="/api/users", method="GET"}

# Implementation errors
rate(http_requests_total{status=~"5.."}[5m])

# CPU usage
rate(process_cpu_seconds_total[1m])

# Memory usage
process_resident_memory_bytes
```

These metrics can be visualized in Grafana dashboards for real-time monitoring.

## Best Practices

<Cards cols={2}>

<Card title="Metrics Collection" accent="brand">

- **Standardization**: Use consistent naming conventions
- **Granularity**: Balance detail and overhead
- **Aggregation**: Set appropriate aggregation windows

</Card>

<Card title="Visualization" accent="purple">

- **Dashboards**: Organize related metrics
- **Alerts**: Configure meaningful thresholds
- **Correlation**: Relate metrics for analysis

</Card>

</Cards>
$mdx$, $mdx$# Métricas e KPIs em Sistemas Distribuídos

Métricas e KPIs (Key Performance Indicators) são fundamentais para entender o comportamento, performance e saúde de sistemas distribuídos. Elas fornecem insights quantitativos que permitem tomar decisões baseadas em dados.

<Callout type="info" title="💡 Conceito Chave">

Métricas efetivas devem ser SMART: Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais.

</Callout>

## Categorias de Métricas Essenciais

<Cards cols={2}>

<Card title="Métricas de Sistema" accent="brand">

- **Utilização de CPU**: Percentual de uso do processador por serviço
- **Uso de Memória**: Consumo de RAM e memória virtual
- **I/O de Disco**: Taxa de leitura/escrita e latência de disco

</Card>

<Card title="Métricas de Aplicação" accent="purple">

- **Throughput**: Requisições processadas por segundo
- **Latência**: Tempo de resposta das requisições
- **Taxa de Erros**: Percentual de requisições com falha

</Card>

</Cards>

## Métricas de Performance

<Cards cols={2}>

<Card title="Latência" accent="green">

**Percentis**

- P50 (Mediana): < 100ms
- P90: < 200ms
- P99: < 500ms

**Componentes**

- Network Time
- Processing Time
- Queue Time

</Card>

<Card title="Throughput" accent="yellow">

**Medidas**

- RPS (Requests per Second)
- TPS (Transactions per Second)
- QPS (Queries per Second)

**Capacidade**

- Peak Load
- Sustained Load
- Burst Capacity

</Card>

</Cards>

## KPIs de Negócio

<Cards cols={3}>

<Card title="Disponibilidade" accent="brand">

- Uptime
- MTBF (Mean Time Between Failures)
- MTTR (Mean Time To Recovery)
- Error Budget

</Card>

<Card title="Qualidade" accent="purple">

- Success Rate
- Error Rate
- Data Quality
- User Satisfaction

</Card>

<Card title="Custo" accent="green">

- Infrastructure Cost
- Cost per Request
- Resource Utilization
- ROI

</Card>

</Cards>

## Implementação com Prometheus

Exemplo de configuração de métricas usando Prometheus e sua linguagem de consulta PromQL:

```
# Exemplo de configuração de métricas usando Prometheus e sua linguagem de consulta PromQL
http_request_duration_seconds_bucket{path="/api/users", method="GET"}

# Métricas errors
rate(http_requests_total{status=~"5.."}[5m])

# CPU usage
rate(process_cpu_seconds_total[1m])

# Memory usage
process_resident_memory_bytes
```

Estas métricas podem ser visualizadas em dashboards do Grafana para monitoramento em tempo real.

## Melhores Práticas

<Cards cols={2}>

<Card title="Coleta de Métricas" accent="brand">

- **Padronização**: Use convenções de nomenclatura consistentes
- **Granularidade**: Equilibre detalhamento e overhead
- **Agregação**: Defina períodos adequados de agregação

</Card>

<Card title="Visualização" accent="purple">

- **Dashboards**: Organize métricas relacionadas
- **Alertas**: Configure thresholds significativos
- **Correlação**: Relacione métricas para análise

</Card>

</Cards>
$mdx$),
  ('monitoring/logs', '/monitoramento-e-manutencao/logs', 'monitoring', true, 67, NULL, true, 'Logs and Tracing in Distributed Systems', 'Logs e Tracing em Sistemas Distribuídos', $mdx$# Logs and Tracing in Distributed Systems

In distributed systems, logs and tracing are fundamental for monitoring, debugging, and performance analysis. This section explores best practices and tools to implement a robust observability system.

## Log Levels

<Cards cols={4}>

<Card title="DEBUG" accent="brand">

Detailed information for debugging

</Card>

<Card title="INFO" accent="green">

Normal system events

</Card>

<Card title="WARN" accent="yellow">

Warnings about unexpected situations

</Card>

<Card title="ERROR" accent="red">

Errors that need attention

</Card>

</Cards>

## Plain Text Logs

```
[2024-03-20 10:15:30] INFO Usuario fez login
[2024-03-20 10:15:35] ERROR Falha no processamento
[2024-03-20 10:15:40] WARN Cache miss
```

### Advantages

- Easy for humans to read
- Lower processing overhead
- Compatible with legacy tools
- Smaller file size

### Disadvantages

- Hard to parse programmatically
- Lack of clear structure
- Hard to add metadata
- Prone to formatting errors

## JSON Logs

```json
{
  "timestamp": "2024-03-20T10:15:30Z",
  "nivel": "INFO",
  "servico": "auth-service",
  "traceId": "trace-123",
  "usuarioId": "user-456",
  "acao": "login_usuario",
  "mensagem": "Usuário logado com sucesso",
  "metadados": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "duracao": "150ms"
  }
}
```

### Advantages

- Clear and consistent structure
- Easy to parse and process
- Supports rich metadata
- Better for automated analysis

### Disadvantages

- Higher processing overhead
- Larger log files
- Less human-readable
- Can be excessive for simple logs

## Distributed Tracing

### What is Tracing?

Tracing tracks the path of a request across multiple services in a distributed system. Each request receives a unique ID (traceId) that is propagated across services.

<Cards cols={2}>

<Card title="Main Components" accent="green">

- TraceId: unique request identifier
- SpanId: identifier for each operation
- ParentSpanId: parent-child relationship
- Tags: additional metadata
- Timestamps: operation durations

</Card>

<Card title="Benefits" accent="yellow">

- Visualization of request flows
- Bottleneck identification
- Debugging distributed systems
- Performance analysis
- Event correlation

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Logging" accent="green">

- Use appropriate log levels
- Include relevant context
- Keep a consistent format
- Avoid sensitive logs
- Use correlation IDs
- Include timestamps
- Structure metadata
- Implement log rotation

</Card>

<Card title="Tracing" accent="brand">

- Propagate traceId across services
- Use spans for key operations
- Add relevant tags
- Keep spans concise
- Implement sampling
- Configure proper retention
- Integrate with analysis tools
- Monitor tracing overhead

</Card>

</Cards>

## Popular Tools

<Cards cols={2}>

<Card title="Logging" accent="yellow">

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Graylog
- Loki
- Datadog
- New Relic
- Splunk

</Card>

<Card title="Tracing" accent="purple">

- Jaeger
- Zipkin
- OpenTelemetry
- Datadog APM
- New Relic APM
- Lightstep

</Card>

</Cards>
$mdx$, $mdx$# Logs e Tracing em Sistemas Distribuídos

Em sistemas distribuídos, logs e tracing são fundamentais para monitoramento, debugging e análise de performance. Esta seção explora as melhores práticas e ferramentas para implementar um sistema robusto de observabilidade.

## Níveis de Log

<Cards cols={4}>

<Card title="DEBUG" accent="brand">

Informações detalhadas para debugging

</Card>

<Card title="INFO" accent="green">

Eventos normais do sistema

</Card>

<Card title="WARN" accent="yellow">

Avisos sobre situações inesperadas

</Card>

<Card title="ERROR" accent="red">

Erros que precisam de atenção

</Card>

</Cards>

## Logs em Texto Puro

```
[2024-03-20 10:15:30] INFO Usuario fez login
[2024-03-20 10:15:35] ERROR Falha no processamento
[2024-03-20 10:15:40] WARN Cache miss
```

### Vantagens

- Fácil de ler para humanos
- Menor overhead de processamento
- Compatível com ferramentas legadas
- Menor tamanho de arquivo

### Desvantagens

- Difícil de parsear programaticamente
- Falta de estrutura clara
- Difícil de adicionar metadados
- Propenso a erros de formatação

## Logs em JSON

```json
{
  "timestamp": "2024-03-20T10:15:30Z",
  "nivel": "INFO",
  "servico": "auth-service",
  "traceId": "trace-123",
  "usuarioId": "user-456",
  "acao": "login_usuario",
  "mensagem": "Usuário logado com sucesso",
  "metadados": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "duracao": "150ms"
  }
}
```

### Vantagens

- Estrutura clara e consistente
- Fácil de parsear e processar
- Suporte a metadados complexos
- Melhor para análise automatizada

### Desvantagens

- Maior overhead de processamento
- Arquivos de log maiores
- Menos legível para humanos
- Pode ser excessivo para logs simples

## Distributed Tracing

### O que é Tracing?

Tracing é uma técnica que permite rastrear o fluxo de uma requisição através de múltiplos serviços em um sistema distribuído. Cada requisição recebe um ID único (traceId) que é propagado entre os serviços.

<Cards cols={2}>

<Card title="Componentes Principais" accent="green">

- TraceId: Identificador único da requisição
- SpanId: Identificador de cada operação
- ParentSpanId: Relacionamento entre operações
- Tags: Metadados adicionais
- Timestamps: Duração das operações

</Card>

<Card title="Benefícios" accent="yellow">

- Visualização do fluxo de requisições
- Identificação de gargalos
- Debugging em sistemas distribuídos
- Análise de performance
- Correlação de eventos

</Card>

</Cards>

## Boas Práticas

<Cards cols={2}>

<Card title="Logging" accent="green">

- Use níveis de log apropriados
- Inclua contexto relevante
- Mantenha formato consistente
- Evite logs sensíveis
- Use IDs de correlação
- Inclua timestamps
- Estruture os metadados
- Implemente rotação de logs

</Card>

<Card title="Tracing" accent="brand">

- Propague traceId entre serviços
- Use spans para operações importantes
- Adicione tags relevantes
- Mantenha spans concisos
- Implemente sampling
- Configure retenção adequada
- Integre com ferramentas de análise
- Monitore overhead de tracing

</Card>

</Cards>

## Ferramentas Populares

<Cards cols={2}>

<Card title="Logging" accent="yellow">

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Graylog
- Loki
- Datadog
- New Relic
- Splunk

</Card>

<Card title="Tracing" accent="purple">

- Jaeger
- Zipkin
- OpenTelemetry
- Datadog APM
- New Relic APM
- Lightstep

</Card>

</Cards>
$mdx$),
  ('monitoring/alerts', '/monitoramento-e-manutencao/alertas', 'monitoring', true, 68, NULL, true, 'Alerts and Notifications in Distributed Systems', 'Alertas e Notificações em Sistemas Distribuídos', $mdx$# Alerts and Notifications in Distributed Systems

An effective alert and notification system is crucial to maintain the health and availability of distributed systems. It enables identifying and responding quickly to problems before they significantly affect users.

<Callout type="info" title="💡 Key Concept">

Alerts should be actionable, relevant and avoid alert fatigue. A good alert system differentiates between critical situations requiring immediate action and conditions that can be handled during normal business hours.

</Callout>

## Alert Types

<Cards cols={3}>

<Card title="Critical" accent="red">

- Service unavailability
- Security failures
- Data loss
- SLA violations

</Card>

<Card title="Warnings" accent="yellow">

- High resource utilization
- Performance degradation
- Anomalous trends
- Non-critical errors

</Card>

<Card title="Informational" accent="green">

- Deployments performed
- Scheduled maintenance
- Configuration changes
- Routine events

</Card>

</Cards>

## Alert Configuration

<Cards cols={2}>

<Card title="Thresholds" accent="brand">

**Static**

- CPU > 80%
- Memory > 90%
- Latency > 500ms
- Error rate > 1%

**Dynamic**

- Based on history
- Machine learning
- Trend analysis
- Seasonality

</Card>

<Card title="Configuration Example" accent="purple">

```json
{
  "alert": "high_error_rate",
  "condition": {
    "metric": "http_errors_total",
    "threshold": {
      "type": "static",
      "value": 0.01,
      "duration": "5m"
    },
    "severity": "critical",
    "notifications": [
      {
        "type": "pagerduty",
        "team": "platform"
      },
      {
        "type": "slack",
        "channel": "#alerts"
      }
    ]
  }
}
```

</Card>

</Cards>

## Notification Channels

<Cards cols={2}>

<Card title="Synchronous" accent="brand">

- **SMS**: For critical alerts requiring immediate action
- **Calls**: For critical incident escalation
- **PagerDuty**: On-call management and escalation

</Card>

<Card title="Asynchronous" accent="purple">

- **Email**: For non-urgent notifications and reports
- **Slack**: For team communication and discussions
- **Dashboards**: For alert visualization and history

</Card>

</Cards>

## Incident Management

<Cards cols={2}>

<Card title="Process" accent="green">

1. **Detection**: Problem identification through alerts
2. **Response**: Triggering the responsible team
3. **Mitigation**: Actions to resolve the problem
4. **Resolution**: Definitive fix and documentation

</Card>

<Card title="Tools" accent="yellow">

- **PagerDuty**: On-call management and incident escalation
- **OpsGenie**: Alerts and incident response coordination
- **ServiceNow**: ITSM and incident lifecycle management

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Alert Configuration" accent="brand">

- **Actionable Alerts**: Configure only alerts that require action
- **Noise Reduction**: Avoid duplicate or unnecessary alerts
- **Context**: Provide sufficient information for diagnosis

</Card>

<Card title="Incident Response" accent="purple">

- **Playbooks**: Maintain documented procedures
- **Escalation**: Define clear escalation levels
- **Postmortem**: Perform analysis after incidents

</Card>

</Cards>
$mdx$, $mdx$# Alertas e Notificações em Sistemas Distribuídos

Um sistema eficaz de alertas e notificações é crucial para manter a saúde e disponibilidade de sistemas distribuídos. Ele permite identificar e responder rapidamente a problemas antes que afetem significativamente os usuários.

<Callout type="info" title="💡 Conceito Chave">

Alertas devem ser acionáveis, relevantes e evitar fadiga de alertas. Um bom sistema de alertas diferencia entre situações críticas que exigem ação imediata e condições que podem ser tratadas durante o horário normal de trabalho.

</Callout>

## Tipos de Alertas

<Cards cols={3}>

<Card title="Críticos" accent="red">

- Indisponibilidade de serviço
- Falhas de segurança
- Perda de dados
- Violações de SLA

</Card>

<Card title="Avisos" accent="yellow">

- Alta utilização de recursos
- Degradação de performance
- Tendências anômalas
- Erros não críticos

</Card>

<Card title="Informativos" accent="green">

- Deploys realizados
- Manutenções programadas
- Mudanças de configuração
- Eventos de rotina

</Card>

</Cards>

## Configuração de Alertas

<Cards cols={2}>

<Card title="Thresholds" accent="brand">

**Estáticos**

- CPU > 80%
- Memória > 90%
- Latência > 500ms
- Error rate > 1%

**Dinâmicos**

- Baseados em histórico
- Machine learning
- Análise de tendências
- Sazonalidade

</Card>

<Card title="Exemplo de Configuração" accent="purple">

```json
{
  "alert": "high_error_rate",
  "condition": {
    "metric": "http_errors_total",
    "threshold": {
      "type": "static",
      "value": 0.01,
      "duration": "5m"
    },
    "severity": "critical",
    "notifications": [
      {
        "type": "pagerduty",
        "team": "platform"
      },
      {
        "type": "slack",
        "channel": "#alerts"
      }
    ]
  }
}
```

</Card>

</Cards>

## Canais de Notificação

<Cards cols={2}>

<Card title="Síncronos" accent="brand">

- **SMS**: Para alertas críticos que exigem ação imediata
- **Ligações**: Para escalação de incidentes críticos
- **PagerDuty**: Gestão de plantão e escalação

</Card>

<Card title="Assíncronos" accent="purple">

- **Email**: Para notificações não urgentes e relatórios
- **Slack**: Para comunicação em equipe e discussões
- **Dashboards**: Para visualização e histórico de alertas

</Card>

</Cards>

## Gestão de Incidentes

<Cards cols={2}>

<Card title="Processo" accent="green">

1. **Detecção**: Identificação do problema através de alertas
2. **Resposta**: Acionamento da equipe responsável
3. **Mitigação**: Ações para resolver o problema
4. **Resolução**: Correção definitiva e documentação

</Card>

<Card title="Ferramentas" accent="yellow">

- **PagerDuty**: Gestão de plantão e escalação de incidentes
- **OpsGenie**: Alertas e coordenação de resposta a incidentes
- **ServiceNow**: ITSM e gestão do ciclo de vida de incidentes

</Card>

</Cards>

## Melhores Práticas

<Cards cols={2}>

<Card title="Configuração de Alertas" accent="brand">

- **Alertas Acionáveis**: Configure apenas alertas que exigem ação
- **Redução de Ruído**: Evite alertas duplicados ou desnecessários
- **Contexto**: Forneça informações suficientes para diagnóstico

</Card>

<Card title="Resposta a Incidentes" accent="purple">

- **Playbooks**: Mantenha procedimentos documentados
- **Escalação**: Defina níveis claros de escalação
- **Postmortem**: Realize análise após incidentes

</Card>

</Cards>
$mdx$),
  ('monitoring/performance', '/monitoramento-e-manutencao/performance', 'monitoring', true, 69, NULL, true, 'Performance Analysis in Distributed Systems', 'Análise de Performance em Sistemas Distribuídos', $mdx$# Performance Analysis in Distributed Systems

Performance analysis is fundamental to ensure distributed systems meet their performance and scalability requirements. A systematic approach to measurement, analysis and optimization is essential.

<Callout type="info" title="💡 Key Concept">

Performance in distributed systems is multidimensional, involving latency, throughput, resource utilization and scalability. Optimizing one aspect often impacts others.

</Callout>

## Performance Metrics

<Cards cols={2}>

<Card title="Core Metrics" accent="brand">

- **Latency**: Response time for requests
- **Throughput**: Requests processed per second
- **Utilization**: System resource usage

</Card>

<Card title="Advanced Metrics" accent="purple">

- **Apdex**: User satisfaction index
- **Percentiles**: P95, P99 latency
- **Saturation**: System overload point

</Card>

</Cards>

## Performance Testing

<Cards cols={3}>

<Card title="Load Testing" accent="brand">

- Behavior under normal load
- Average response times
- Resource usage
- Sustained throughput

</Card>

<Card title="Stress Testing" accent="purple">

- System limits
- Behavior under overload
- Failure points
- Recovery after failure

</Card>

<Card title="Scalability Testing" accent="green">

- Growth capacity
- Elasticity
- Scale costs
- Resource limits

</Card>

</Cards>

## Performance Tools

<Cards cols={2}>

<Card title="Monitoring" accent="brand">

**APM Tools**

- New Relic
- Datadog
- Dynatrace
- AppDynamics

**Profiling**

- JProfiler
- YourKit
- pprof
- async-profiler

</Card>

<Card title="Load Testing" accent="purple">

**Open Source Tools**

- Apache JMeter
- Gatling
- k6
- Locust

**Cloud Services**

- BlazeMeter
- Flood.io
- LoadRunner Cloud
- AWS Load Testing

</Card>

</Cards>

## Performance Optimization

<Cards cols={2}>

<Card title="Strategies" accent="brand">

- **Caching**: Implementation of different cache levels
- **Load Balancing**: Efficient load distribution
- **Code Optimization**: Improvement of algorithms and data structures

</Card>

<Card title="Techniques" accent="purple">

- **Lazy Loading**: On-demand resource loading
- **Connection Pooling**: Connection reuse
- **Asynchronous Processing**: Non-blocking processing

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Development" accent="green">

- **Continuous Profiling**: Monitor performance during development
- **Load Tests**: Include performance tests in CI/CD
- **Benchmarking**: Compare performance between versions

</Card>

<Card title="Production" accent="yellow">

- **Real-Time Monitoring**: Track metrics in real time
- **Capacity Planning**: Plan resources in advance
- **Continuous Optimization**: Improve based on real data

</Card>

</Cards>
$mdx$, $mdx$# Análise de Performance em Sistemas Distribuídos

A análise de performance é fundamental para garantir que sistemas distribuídos atendam seus requisitos de desempenho e escalabilidade. Uma abordagem sistemática para medição, análise e otimização é essencial.

<Callout type="info" title="💡 Conceito Chave">

Performance em sistemas distribuídos é multidimensional, envolvendo latência, throughput, utilização de recursos e escalabilidade. A otimização de um aspecto frequentemente impacta outros.

</Callout>

## Métricas de Performance

<Cards cols={2}>

<Card title="Métricas Principais" accent="brand">

- **Latência**: Tempo de resposta para requisições
- **Throughput**: Requisições processadas por segundo
- **Utilização**: Uso de recursos do sistema

</Card>

<Card title="Métricas Avançadas" accent="purple">

- **Apdex**: Índice de satisfação do usuário
- **Percentis**: P95, P99 de latência
- **Saturação**: Ponto de sobrecarga do sistema

</Card>

</Cards>

## Testes de Performance

<Cards cols={3}>

<Card title="Teste de Carga" accent="brand">

- Comportamento sob carga normal
- Tempos de resposta médios
- Uso de recursos
- Throughput sustentado

</Card>

<Card title="Teste de Stress" accent="purple">

- Limites do sistema
- Comportamento sob sobrecarga
- Pontos de falha
- Recuperação após falha

</Card>

<Card title="Teste de Escalabilidade" accent="green">

- Capacidade de crescimento
- Elasticidade
- Custos de escala
- Limites de recursos

</Card>

</Cards>

## Ferramentas de Performance

<Cards cols={2}>

<Card title="Monitoramento" accent="brand">

**APM Tools**

- New Relic
- Datadog
- Dynatrace
- AppDynamics

**Profiling**

- JProfiler
- YourKit
- pprof
- async-profiler

</Card>

<Card title="Teste de Carga" accent="purple">

**Ferramentas Open Source**

- Apache JMeter
- Gatling
- k6
- Locust

**Serviços em Nuvem**

- BlazeMeter
- Flood.io
- LoadRunner Cloud
- AWS Load Testing

</Card>

</Cards>

## Otimização de Performance

<Cards cols={2}>

<Card title="Estratégias" accent="brand">

- **Caching**: Implementação de diferentes níveis de cache
- **Load Balancing**: Distribuição eficiente de carga
- **Otimização de Código**: Melhoria de algoritmos e estruturas de dados

</Card>

<Card title="Técnicas" accent="purple">

- **Lazy Loading**: Carregamento sob demanda de recursos
- **Connection Pooling**: Reutilização de conexões
- **Asynchronous Processing**: Processamento não bloqueante

</Card>

</Cards>

## Melhores Práticas

<Cards cols={2}>

<Card title="Desenvolvimento" accent="green">

- **Profiling Contínuo**: Monitore performance durante o desenvolvimento
- **Testes de Carga**: Inclua testes de performance no CI/CD
- **Benchmarking**: Compare performance entre versões

</Card>

<Card title="Produção" accent="yellow">

- **Monitoramento Real-Time**: Acompanhe métricas em tempo real
- **Capacity Planning**: Planeje recursos com antecedência
- **Otimização Contínua**: Melhore com base em dados reais

</Card>

</Cards>
$mdx$),
  ('monitoring/health-checks', '/monitoramento-e-manutencao/health-checks', 'monitoring', true, 70, NULL, true, 'Health Checks in Distributed Systems', 'Health Checks em Sistemas Distribuídos', $mdx$# Health Checks in Distributed Systems

Health checks are fundamental for monitoring the health and availability of services in distributed systems. They enable proactive problem detection, facilitate load balancing and assist in recovery strategies.

<Callout type="info" title="💡 Key Concept">

A good health check system should be comprehensive, verifying not only if the service is responding, but also its ability to perform its essential functions and access necessary resources.

</Callout>

## Types of Health Checks

<Cards cols={3}>

<Card title="Liveness" accent="brand">

- Checks if service is alive
- Detects deadlocks
- Monitors processes
- Restarts on failure

</Card>

<Card title="Readiness" accent="purple">

- Checks availability
- Connections to dependencies
- Resource status
- Traffic control

</Card>

<Card title="Startup" accent="green">

- Service initialization
- Resource loading
- Initial configuration
- Warm-up period

</Card>

</Cards>

## Implementation Patterns

<Cards cols={2}>

<Card title="HTTP Endpoints" accent="brand">

```json
// Endpoint de Health Check
GET /health
{
  "status": "UP",
  "components": {
    "db": "UP",
    "cache": "UP",
    "messaging": "UP"
  },
  "details": {
    "db.responseTime": "45ms",
    "cache.size": "2.3GB"
  }
}
```

</Card>

<Card title="Verifications" accent="purple">

- **Connections**: Database, cache, messaging
- **Resources**: CPU, memory, disk, network
- **Features**: Critical business operations

</Card>

</Cards>

## Infrastructure Integration

<Cards cols={2}>

<Card title="Container Orchestration" accent="brand">

**Kubernetes**

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 5
```

</Card>

<Card title="Load Balancers" accent="purple">

- **Routing**: Directs traffic to healthy instances
- **Circuit Breaking**: Isolates failed services
- **Auto Scaling**: Adjusts capacity based on health

</Card>

</Cards>

## Best Practices

<Cards cols={2}>

<Card title="Implementation" accent="brand">

- **Lightweight**: Checks should be light and fast
- **Isolation**: Separate checks by responsibility
- **Cache**: Avoid overhead from frequent checks

</Card>

<Card title="Monitoring" accent="purple">

- **Logging**: Record results and trends
- **Metrics**: Collect health metrics
- **Alerts**: Configure alerts for failures

</Card>

</Cards>
$mdx$, $mdx$# Health Checks em Sistemas Distribuídos

Health checks são fundamentais para monitorar a saúde e disponibilidade de serviços em sistemas distribuídos. Eles permitem detecção proativa de problemas, facilitam o balanceamento de carga e auxiliam em estratégias de recuperação.

<Callout type="info" title="💡 Conceito Chave">

Um bom sistema de health check deve ser abrangente, verificando não apenas se o serviço está respondendo, mas também sua capacidade de realizar suas funções essenciais e acessar recursos necessários.

</Callout>

## Tipos de Health Checks

<Cards cols={3}>

<Card title="Liveness" accent="brand">

- Verifica se o serviço está vivo
- Detecta deadlocks
- Monitora processos
- Reinicia em caso de falha

</Card>

<Card title="Readiness" accent="purple">

- Verifica disponibilidade
- Conexões com dependências
- Estado de recursos
- Controle de tráfego

</Card>

<Card title="Startup" accent="green">

- Inicialização do serviço
- Carregamento de recursos
- Configuração inicial
- Warm-up period

</Card>

</Cards>

## Padrões de Implementação

<Cards cols={2}>

<Card title="Endpoints HTTP" accent="brand">

```json
// Endpoint de Health Check
GET /health
{
  "status": "UP",
  "components": {
    "db": "UP",
    "cache": "UP",
    "messaging": "UP"
  },
  "details": {
    "db.responseTime": "45ms",
    "cache.size": "2.3GB"
  }
}
```

</Card>

<Card title="Verificações" accent="purple">

- **Conexões**: Banco de dados, cache, mensageria
- **Recursos**: CPU, memória, disco, rede
- **Funcionalidades**: Operações críticas do negócio

</Card>

</Cards>

## Integração com Infraestrutura

<Cards cols={2}>

<Card title="Orquestração de Containers" accent="brand">

**Kubernetes**

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 5
```

</Card>

<Card title="Load Balancers" accent="purple">

- **Roteamento**: Direciona tráfego para instâncias saudáveis
- **Circuit Breaking**: Isola serviços com falha
- **Auto Scaling**: Ajusta capacidade baseado em saúde

</Card>

</Cards>

## Melhores Práticas

<Cards cols={2}>

<Card title="Implementação" accent="brand">

- **Lightweight**: Checks devem ser leves e rápidos
- **Isolamento**: Separe checks por responsabilidade
- **Cache**: Evite sobrecarga de checks frequentes

</Card>

<Card title="Monitoramento" accent="purple">

- **Logging**: Registre resultados e tendências
- **Métricas**: Colete métricas de saúde
- **Alertas**: Configure alertas para falhas

</Card>

</Cards>
$mdx$),
  ('monitoring/llm-observability', '/monitoramento-e-manutencao/llm-observability', 'monitoring', true, 71, NULL, true, 'LLM Observability', 'Observabilidade de LLM', $mdx$# LLM Observability

The three pillars — metrics, logs, traces — still apply to LLM systems, but they're not enough. LLM applications are probabilistic, token-priced, and quality-sensitive, so you need new signals: **token usage, cost, prompt/response traces, and quality evaluations**.

<Callout type="info" title="💡 Why Classic Monitoring Falls Short">

A 200 OK with low latency can still be a *bad* response: hallucinated, irrelevant, or unsafe. Traditional metrics see the request succeeded; they can't see that the answer was wrong.

</Callout>

## New Signals to Track

<Cards cols={2}>

<Card title="Cost & Usage" accent="brand">

- Input and output tokens per request
- Cost per request, per feature, per tenant
- Time-to-first-token and tokens-per-second
- Cache hit rate (exact and semantic)

</Card>

<Card title="Quality" accent="green">

- Hallucination / groundedness checks
- Retrieval relevance (for RAG)
- User feedback (thumbs up/down, edits)
- Refusal and error rates

</Card>

</Cards>

## Tracing an LLM Request

A single user request fans out into many steps. Tracing ties them together so you can see where time, tokens, and quality went.

<Cards cols={3}>

<Card title="The Span Tree" accent="brand">

Embed → retrieve → rerank → prompt assembly → model call → tool calls. Each is a span with timing and token counts.

</Card>

<Card title="What to Capture" accent="purple">

Prompt, retrieved context, model + parameters, response, tokens, cost, and latency per span.

</Card>

<Card title="Why It Matters" accent="green">

When an answer is bad, the trace shows whether retrieval missed, the prompt was wrong, or the model failed.

</Card>

</Cards>

## Evaluating Quality

Because quality isn't a status code, you measure it continuously:

<Cards cols={3}>

<Card title="Offline Evals" accent="brand">

Run a fixed test set on every change to catch regressions before release.

</Card>

<Card title="LLM-as-Judge" accent="purple">

Use a model to score outputs for relevance, groundedness, or correctness at scale.

</Card>

<Card title="Online Signals" accent="green">

Capture real user feedback and behavior as a live quality signal.

</Card>

</Cards>

<Callout type="warning" title="Don't Log Sensitive Data Carelessly">

Prompts and responses often contain personal or proprietary data. Redact PII, control retention, and respect tenant isolation — observability must not become a data-leak vector.

</Callout>

## Tools

Classic stacks (Prometheus, Grafana, the ELK stack, Jaeger/OpenTelemetry) still carry the infrastructure metrics and traces. LLM-specific platforms (LangSmith, Langfuse, Phoenix, Helicone) add prompt/response capture, token/cost accounting, and evals on top.

## Related

This extends the three pillars in [Monitoring & Maintenance](/monitoramento-e-manutencao), reuses the ideas behind the [tracing simulator](/monitoramento-e-manutencao/logs/tracing), and is essential for operating [agentic systems](/sistemas-ia/agentic-systems).
$mdx$, $mdx$# Observabilidade de LLM

Os três pilares — métricas, logs, traces — continuam valendo para sistemas de LLM, mas não bastam. Aplicações de LLM são probabilísticas, têm preço por token e são sensíveis à qualidade, então você precisa de novos sinais: **uso de tokens, custo, traces de prompt/resposta e avaliações de qualidade**.

<Callout type="info" title="💡 Por Que o Monitoramento Clássico É Insuficiente">

Um 200 OK com baixa latência ainda pode ser uma resposta *ruim*: alucinada, irrelevante ou insegura. Métricas tradicionais veem que a requisição teve sucesso; não veem que a resposta estava errada.

</Callout>

## Novos Sinais a Acompanhar

<Cards cols={2}>

<Card title="Custo e Uso" accent="brand">

- Tokens de entrada e saída por requisição
- Custo por requisição, por funcionalidade, por tenant
- Tempo até o primeiro token e tokens por segundo
- Taxa de acerto de cache (exato e semântico)

</Card>

<Card title="Qualidade" accent="green">

- Verificações de alucinação / fundamentação
- Relevância da recuperação (para RAG)
- Feedback do usuário (joinha para cima/baixo, edições)
- Taxas de recusa e de erro

</Card>

</Cards>

## Rastreando uma Requisição de LLM

Uma única requisição de usuário se desdobra em muitos passos. O tracing os conecta para você ver onde foram o tempo, os tokens e a qualidade.

<Cards cols={3}>

<Card title="A Árvore de Spans" accent="brand">

Embeddar → recuperar → reordenar → montar prompt → chamada ao modelo → chamadas de ferramentas. Cada um é um span com tempo e contagem de tokens.

</Card>

<Card title="O Que Capturar" accent="purple">

Prompt, contexto recuperado, modelo + parâmetros, resposta, tokens, custo e latência por span.

</Card>

<Card title="Por Que Importa" accent="green">

Quando uma resposta é ruim, o trace mostra se a recuperação falhou, o prompt estava errado ou o modelo falhou.

</Card>

</Cards>

## Avaliando a Qualidade

Como qualidade não é um código de status, você a mede continuamente:

<Cards cols={3}>

<Card title="Avaliações Offline" accent="brand">

Rode um conjunto de testes fixo a cada mudança para pegar regressões antes do lançamento.

</Card>

<Card title="LLM-como-Juiz" accent="purple">

Use um modelo para pontuar saídas por relevância, fundamentação ou correção em escala.

</Card>

<Card title="Sinais Online" accent="green">

Capture feedback e comportamento reais do usuário como sinal de qualidade ao vivo.

</Card>

</Cards>

<Callout type="warning" title="Não Registre Dados Sensíveis Sem Cuidado">

Prompts e respostas muitas vezes contêm dados pessoais ou proprietários. Anonimize PII, controle a retenção e respeite o isolamento de tenants — a observabilidade não pode virar um vetor de vazamento de dados.

</Callout>

## Ferramentas

Stacks clássicas (Prometheus, Grafana, ELK, Jaeger/OpenTelemetry) seguem carregando métricas e traces de infraestrutura. Plataformas específicas de LLM (LangSmith, Langfuse, Phoenix, Helicone) adicionam captura de prompt/resposta, contabilidade de tokens/custo e avaliações por cima.

## Relacionados

Isto estende os três pilares de [Monitoramento e Manutenção](/monitoramento-e-manutencao), reaproveita as ideias do [simulador de tracing](/monitoramento-e-manutencao/logs/tracing) e é essencial para operar [sistemas com agentes](/sistemas-ia/agentic-systems).
$mdx$),
  ('monitoring/distributed-tracing', '/monitoramento-e-manutencao/distributed-tracing', 'monitoring', true, 72, NULL, true, 'Distributed Tracing', 'Distributed Tracing', $mdx$# Distributed Tracing

A single user click can fan out to dozens of services. When it's slow or fails, *which* service was to blame? **Distributed tracing** stitches the whole journey into one timeline so you can see exactly where time went.

<Callout type="info" title="💡 Logs and metrics aren't enough">

Metrics tell you *something* is slow; logs tell you what one service did. Tracing connects them — following a single request **across** service boundaries end to end.

</Callout>

## The vocabulary

<Cards cols={3}>

<Card title="Trace" accent="brand">

The entire end-to-end journey of one request, identified by a **trace ID** shared by every hop.

</Card>

<Card title="Span" accent="purple">

One unit of work within the trace (a service call, a DB query). Spans nest to form a tree and each records start/end time.

</Card>

<Card title="Context propagation" accent="green">

The trace ID and parent span ID are passed along (HTTP headers, message metadata) so downstream spans attach to the right trace.

</Card>

</Cards>

## How a trace is built

<Callout type="neutral" title="From request to flame graph">

1. The first service starts a root span and generates a trace ID.
2. On each outbound call it injects trace context into the headers.
3. Each downstream service creates a child span linked to its parent.
4. Spans are exported to a collector (OpenTelemetry → Jaeger/Tempo/Zipkin) and assembled into a waterfall you can inspect.

</Callout>

## Baggage and attributes

<Cards cols={2}>

<Card title="Attributes" accent="brand">

Key/value tags on a span (HTTP status, DB statement, region) for filtering and grouping in your tracing UI.

</Card>

<Card title="Baggage" accent="purple">

Key/values that **travel with** the context across services (e.g. tenant ID), so any downstream span can read them. Powerful — but it adds overhead to every hop, so keep it small.

</Card>

</Cards>

<Callout type="warning" title="Sample, don't trace everything">

Tracing every request at full volume is expensive. Use **sampling** — head-based (decide up front) or tail-based (keep the slow/errored traces) — to capture the interesting ones without drowning in data.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- A trace = many spans sharing one trace ID across services
- Context propagation is what links spans into a trace
- OpenTelemetry is the standard for instrumenting it

</Card>

<Card title="Design For" accent="brand">

- Propagate trace context through every call and queue
- Add useful span attributes; keep baggage tiny
- Sample to control cost while keeping anomalies

</Card>

</Cards>
$mdx$, $mdx$# Distributed Tracing

Um único clique do usuário pode se espalhar por dezenas de serviços. Quando algo fica lento ou falha, *qual* serviço foi o culpado? O **distributed tracing** costura toda a jornada numa única linha do tempo para você ver exatamente onde o tempo foi gasto.

<Callout type="info" title="💡 Logs e métricas não bastam">

Métricas dizem que *algo* está lento; logs dizem o que um serviço fez. O tracing os conecta — seguindo uma única requisição **através** das fronteiras de serviço, de ponta a ponta.

</Callout>

## O vocabulário

<Cards cols={3}>

<Card title="Trace" accent="brand">

A jornada completa ponta-a-ponta de uma requisição, identificada por um **trace ID** compartilhado por cada salto.

</Card>

<Card title="Span" accent="purple">

Uma unidade de trabalho dentro do trace (uma chamada de serviço, uma query). Spans se aninham formando uma árvore e cada um registra tempo de início/fim.

</Card>

<Card title="Propagação de contexto" accent="green">

O trace ID e o span ID pai são repassados (headers HTTP, metadados de mensagem) para que os spans a jusante se liguem ao trace certo.

</Card>

</Cards>

## Como um trace é construído

<Callout type="neutral" title="Da requisição ao flame graph">

1. O primeiro serviço inicia um span raiz e gera um trace ID.
2. Em cada chamada de saída ele injeta o contexto de trace nos headers.
3. Cada serviço a jusante cria um span filho ligado ao seu pai.
4. Os spans são exportados a um collector (OpenTelemetry → Jaeger/Tempo/Zipkin) e montados num waterfall que você pode inspecionar.

</Callout>

## Baggage e atributos

<Cards cols={2}>

<Card title="Atributos" accent="brand">

Tags chave/valor num span (status HTTP, statement de DB, região) para filtrar e agrupar na sua UI de tracing.

</Card>

<Card title="Baggage" accent="purple">

Chave/valores que **viajam com** o contexto entre serviços (ex.: tenant ID), para que qualquer span a jusante os leia. Poderoso — mas adiciona overhead a cada salto, então mantenha pequeno.

</Card>

</Cards>

<Callout type="warning" title="Amostre, não trace tudo">

Tracear toda requisição em volume total é caro. Use **sampling** — head-based (decida no início) ou tail-based (guarde os traces lentos/com erro) — para capturar os interessantes sem se afogar em dados.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- Um trace = muitos spans compartilhando um trace ID entre serviços
- A propagação de contexto é o que liga spans num trace
- OpenTelemetry é o padrão para instrumentá-lo

</Card>

<Card title="Projete para" accent="brand">

- Propague o contexto de trace por toda chamada e fila
- Adicione atributos úteis aos spans; mantenha o baggage minúsculo
- Use sampling para controlar custo mantendo anomalias

</Card>

</Cards>
$mdx$),
  ('monitoring/slo-sli-sla', '/monitoramento-e-manutencao/slo-sli-sla', 'monitoring', true, 73, NULL, true, 'SLO, SLI & Error Budgets', 'SLO, SLI e Error Budgets', $mdx$# SLO, SLI & Error Budgets

"Is the system reliable enough?" is unanswerable until you make it measurable. **SLIs**, **SLOs**, and **SLAs** turn reliability into numbers — and the **error budget** turns those numbers into a decision-making tool.

<Callout type="info" title="💡 The three acronyms">

- **SLI** (Indicator): a *measured* number — e.g. % of requests under 300ms.
- **SLO** (Objective): your *target* for an SLI — e.g. 99.9% of requests under 300ms over 30 days.
- **SLA** (Agreement): a *contract* with consequences (refunds) if you miss it. Usually looser than your SLO.

</Callout>

## From signal to target

<Cards cols={3}>

<Card title="Pick good SLIs" accent="brand">

Measure what users feel: availability, latency, error rate, freshness. A great SLI is the ratio of *good events* to *total events*.

</Card>

<Card title="Set a realistic SLO" accent="purple">

100% is the wrong target — it's impossibly expensive. Choose a number that keeps users happy with room to do maintenance and ship features.

</Card>

<Card title="Back it with an SLA (maybe)" accent="green">

Only external, contractual promises need an SLA. Keep the SLA target below your internal SLO so you have a safety margin.

</Card>

</Cards>

## The error budget

If your SLO is 99.9% over 30 days, you're *allowed* to be down 0.1% — about **43 minutes**. That allowance is your **error budget**: a currency you can spend.

<Callout type="neutral" title="Spending the budget">

- **Budget remaining** → ship faster, take risks, run experiments.
- **Budget exhausted** → freeze risky changes, focus on reliability until it recovers.

It aligns dev (wants to ship) and ops (wants stability) around one shared number instead of arguing.

</Callout>

## Burn rate

<Callout type="warning" title="How fast are you spending?">

**Burn rate** is how quickly you're consuming the error budget. A burn rate of 1 spends it exactly over the window; a burn rate of 10 means you'll exhaust a 30-day budget in 3 days. Alert on **fast burn** (page now) and **slow burn** (investigate soon) rather than on every blip.

</Callout>

## Takeaways

<Cards cols={2}>

<Card title="Remember" accent="green">

- SLI = measured, SLO = target, SLA = contract
- 100% is the wrong goal; pick a deliberate SLO
- The error budget = 1 − SLO, a budget you can spend

</Card>

<Card title="Design For" accent="brand">

- Define SLIs from the user's perspective
- Gate releases on remaining error budget
- Alert on burn rate, not raw error spikes

</Card>

</Cards>
$mdx$, $mdx$# SLO, SLI e Error Budgets

"O sistema é confiável o suficiente?" é impossível responder até você torná-lo mensurável. **SLIs**, **SLOs** e **SLAs** transformam confiabilidade em números — e o **error budget** transforma esses números numa ferramenta de decisão.

<Callout type="info" title="💡 As três siglas">

- **SLI** (Indicator): um número *medido* — ex.: % de requisições abaixo de 300ms.
- **SLO** (Objective): sua *meta* para um SLI — ex.: 99,9% das requisições abaixo de 300ms em 30 dias.
- **SLA** (Agreement): um *contrato* com consequências (reembolsos) se você falhar. Em geral mais frouxo que seu SLO.

</Callout>

## Do sinal à meta

<Cards cols={3}>

<Card title="Escolha bons SLIs" accent="brand">

Meça o que o usuário sente: disponibilidade, latência, taxa de erro, atualidade. Um ótimo SLI é a razão de *eventos bons* sobre *eventos totais*.

</Card>

<Card title="Defina um SLO realista" accent="purple">

100% é a meta errada — é impossivelmente caro. Escolha um número que mantenha os usuários felizes com margem para manutenção e para entregar features.

</Card>

<Card title="Respalde com um SLA (talvez)" accent="green">

Só promessas externas e contratuais precisam de SLA. Mantenha a meta do SLA abaixo do seu SLO interno para ter margem de segurança.

</Card>

</Cards>

## O error budget

Se seu SLO é 99,9% em 30 dias, você *pode* ficar fora 0,1% — cerca de **43 minutos**. Essa folga é seu **error budget**: uma moeda que você pode gastar.

<Callout type="neutral" title="Gastando o orçamento">

- **Orçamento sobrando** → entregue mais rápido, assuma riscos, faça experimentos.
- **Orçamento esgotado** → congele mudanças arriscadas, foque em confiabilidade até recuperar.

Ele alinha dev (quer entregar) e ops (quer estabilidade) em torno de um número compartilhado em vez de discussões.

</Callout>

## Burn rate

<Callout type="warning" title="Quão rápido você está gastando?">

**Burn rate** é a velocidade com que você consome o error budget. Um burn rate de 1 o gasta exatamente ao longo da janela; um burn rate de 10 significa esgotar um orçamento de 30 dias em 3 dias. Alerte em **burn rápido** (acione agora) e **burn lento** (investigue em breve) em vez de cada oscilação.

</Callout>

## Pontos-chave

<Cards cols={2}>

<Card title="Lembre" accent="green">

- SLI = medido, SLO = meta, SLA = contrato
- 100% é a meta errada; escolha um SLO deliberado
- O error budget = 1 − SLO, um orçamento que você gasta

</Card>

<Card title="Projete para" accent="brand">

- Defina SLIs sob a perspectiva do usuário
- Condicione releases ao error budget restante
- Alerte por burn rate, não por picos de erro brutos

</Card>

</Cards>
$mdx$),
  ('security/index', '/seguranca', 'security', true, 57, NULL, true, 'Security in Distributed Systems', 'Segurança em Sistemas Distribuídos', $mdx$# Security in Distributed Systems

Explore the main concepts and practices of security in distributed systems

<Callout type="info">

Security is a critical aspect in distributed systems. Understand the main challenges and solutions to protect your systems.

</Callout>

<Cards cols={2}>

<Card emoji="🔑" title="Authentication" accent="purple">

Learn how to verify the identity of users and systems securely and scalably.

- Identity
- Security

</Card>

<Card emoji="🛡️" title="Authorization" accent="green">

Discover how to implement granular access control and manage permissions.

- Permissions
- Control

</Card>

<Card emoji="🔒" title="Cryptography" accent="yellow">

Understand how to protect data in transit and at rest using cryptography.

- Protection
- Privacy

</Card>

<Card emoji="🎫" title="Tokens and JWT" accent="brand">

Learn about session management and access tokens in distributed systems.

- Sessions
- Stateless

</Card>

<Card emoji="🔐" title="SSL/TLS" accent="green">

Explore how to establish secure communication between systems using SSL/TLS.

- HTTPS
- Certificates

</Card>

<Card emoji="⚠️" title="Common Attacks" accent="red">

Know the most common attacks and learn how to protect your systems.

- Prevention
- Mitigation

</Card>

</Cards>
$mdx$, $mdx$# Segurança em Sistemas Distribuídos

Explore os principais conceitos e práticas de segurança em sistemas distribuídos

<Callout type="info">

A segurança é um aspecto crítico em sistemas distribuídos. Entenda os principais desafios e soluções para proteger seus sistemas.

</Callout>

<Cards cols={2}>

<Card emoji="🔑" title="Autenticação" accent="purple">

Aprenda como verificar a identidade dos usuários e sistemas de forma segura e escalável.

- Identidade
- Segurança

</Card>

<Card emoji="🛡️" title="Autorização" accent="green">

Descubra como implementar controle de acesso granular e gerenciar permissões.

- Permissões
- Controle

</Card>

<Card emoji="🔒" title="Criptografia" accent="yellow">

Entenda como proteger dados em trânsito e em repouso usando criptografia.

- Proteção
- Privacidade

</Card>

<Card emoji="🎫" title="Tokens e JWT" accent="brand">

Aprenda sobre gerenciamento de sessões e tokens de acesso em sistemas distribuídos.

- Sessões
- Stateless

</Card>

<Card emoji="🔐" title="SSL/TLS" accent="green">

Explore como estabelecer comunicação segura entre sistemas usando SSL/TLS.

- HTTPS
- Certificados

</Card>

<Card emoji="⚠️" title="Ataques Comuns" accent="red">

Conheça os ataques mais comuns e aprenda como proteger seus sistemas.

- Prevenção
- Mitigação

</Card>

</Cards>
$mdx$),
  ('security/authentication', '/seguranca/autenticacao', 'security', true, 58, NULL, true, 'Authentication in Distributed Systems', 'Autenticação em Sistemas Distribuídos', $mdx$# Authentication in Distributed Systems

Understand the concepts, challenges and solutions for authentication in modern distributed systems

<Callout type="info">

Authentication is one of the fundamental pillars of security in distributed systems. In an environment where multiple services need to communicate and verify user identity, implementing a robust authentication strategy is crucial.

</Callout>

## Basic Concepts

Authentication is the process of verifying if someone or something is who or what they claim to be. In distributed systems, this process involves several components and unique challenges.

<Cards cols={2}>

<Card title="Identification" accent="brand">

The process of a user declaring their identity to the system, usually through a unique identifier like username or email.

</Card>

<Card title="Verification" accent="green">

The process of validating the declared identity, usually through credentials like password, token or digital certificate.

</Card>

</Cards>

## Authentication Methods

### Password-Based Authentication

The most common authentication method, where the user provides a combination of identifier and password.

- Secure storage with hashing and salt
- Password complexity policies
- Protection against brute force attacks
- Password recovery and reset

### Token-Based Authentication

Stateless method that uses tokens to maintain authentication state.

- JSON Web Tokens (JWT)
- Access and refresh tokens
- Session management
- Token revocation

[Learn more about Tokens and JWT](/seguranca/tokens)

### OAuth 2.0 and OpenID Connect

Standard protocols for authorization and authentication in distributed systems.

- Authorization flows
- Single Sign-On (SSO)
- Access delegation
- Identity Providers

### Multi-Factor Authentication (MFA)

Adds extra layers of security beyond password.

- Verification codes via SMS or email
- Authenticator apps (TOTP)
- Physical security keys (FIDO2/WebAuthn)
- Biometrics

## Challenges and Best Practices

<Cards cols={2}>

<Card title="Challenges" accent="red">

- Authentication system scalability
- Distributed session management
- Protection against common attacks
- Latency in distributed verifications
- Consistency across multiple services

</Card>

<Card title="Best Practices" accent="green">

- Use HTTPS for all communications
- Implement rate limiting
- Logging and monitoring of attempts
- Regular rotation of keys and tokens
- Input validation and sanitization

</Card>

</Cards>

## Implementation

Implementing an authentication system in a distributed environment requires careful planning and consideration of several aspects:

<Cards cols={3}>

<Card title="Architecture" accent="yellow">

- Centralized authentication service
- API Gateway for validation
- Distributed cache
- User database

</Card>

<Card title="Security" accent="yellow">

- Encryption in transit
- CSRF protection
- Security headers
- Access auditing

</Card>

<Card title="Experience" accent="yellow">

- Authentication UX
- Error feedback
- Access recovery
- Profile and preferences

</Card>

</Cards>
$mdx$, $mdx$# Autenticação em Sistemas Distribuídos

Entenda os conceitos, desafios e soluções para autenticação em sistemas distribuídos modernos

<Callout type="info">

A autenticação é um dos pilares fundamentais da segurança em sistemas distribuídos. Em um ambiente onde múltiplos serviços precisam se comunicar e verificar a identidade dos usuários, implementar uma estratégia robusta de autenticação é crucial.

</Callout>

## Conceitos Básicos

A autenticação é o processo de verificar se alguém ou algo é quem ou o que diz ser. Em sistemas distribuídos, este processo envolve vários componentes e desafios únicos.

<Cards cols={2}>

<Card title="Identificação" accent="brand">

O processo de um usuário declarar sua identidade ao sistema, geralmente através de um identificador único como nome de usuário ou email.

</Card>

<Card title="Verificação" accent="green">

O processo de validar a identidade declarada, geralmente através de credenciais como senha, token ou certificado digital.

</Card>

</Cards>

## Métodos de Autenticação

### Autenticação Baseada em Senha

O método mais comum de autenticação, onde o usuário fornece uma combinação de identificador e senha.

- Armazenamento seguro com hashing e salt
- Políticas de complexidade de senha
- Proteção contra ataques de força bruta
- Recuperação e reset de senha

### Autenticação Baseada em Token

Método stateless que utiliza tokens para manter o estado de autenticação.

- JSON Web Tokens (JWT)
- Tokens de acesso e refresh
- Gerenciamento de sessão
- Revogação de tokens

[Saiba mais sobre Tokens e JWT](/seguranca/tokens)

### OAuth 2.0 e OpenID Connect

Protocolos padrão para autorização e autenticação em sistemas distribuídos.

- Fluxos de autorização
- Single Sign-On (SSO)
- Delegação de acesso
- Identity Providers

### Multi-Factor Authentication (MFA)

Adiciona camadas extras de segurança além da senha.

- Códigos de verificação por SMS ou email
- Aplicativos autenticadores (TOTP)
- Chaves de segurança física (FIDO2/WebAuthn)
- Biometria

## Desafios e Boas Práticas

<Cards cols={2}>

<Card title="Desafios" accent="red">

- Escalabilidade do sistema de autenticação
- Gerenciamento de sessões distribuídas
- Proteção contra ataques comuns
- Latência em verificações distribuídas
- Consistência entre múltiplos serviços

</Card>

<Card title="Boas Práticas" accent="green">

- Usar HTTPS para todas as comunicações
- Implementar rate limiting
- Logging e monitoramento de tentativas
- Rotação regular de chaves e tokens
- Validação e sanitização de inputs

</Card>

</Cards>

## Implementação

A implementação de um sistema de autenticação em um ambiente distribuído requer cuidadoso planejamento e consideração de vários aspectos:

<Cards cols={3}>

<Card title="Arquitetura" accent="yellow">

- Serviço centralizado de autenticação
- API Gateway para validação
- Cache distribuído
- Banco de dados de usuários

</Card>

<Card title="Segurança" accent="yellow">

- Criptografia em trânsito
- Proteção contra CSRF
- Headers de segurança
- Auditoria de acessos

</Card>

<Card title="Experiência" accent="yellow">

- UX de autenticação
- Feedback de erros
- Recuperação de acesso
- Perfil e preferências

</Card>

</Cards>
$mdx$),
  ('security/authorization', '/seguranca/autorizacao', 'security', true, 59, NULL, true, 'Authorization in Distributed Systems', 'Autorização em Sistemas Distribuídos', $mdx$# Authorization in Distributed Systems

Access control, permissions and security policies in distributed environments

<Callout type="success">

Authorization is the process that determines what an authenticated user can do in the system. In distributed systems, implementing an effective authorization strategy is essential to ensure security and granular access control to resources.

</Callout>

## Fundamental Concepts

<Cards cols={3}>

<Card title="Authorization" accent="brand">

Process of verifying if a user has permission to access a resource or perform a specific action in the system.

</Card>

<Card title="Permissions" accent="brand">

Specific rights granted to users or groups to perform operations on system resources.

</Card>

<Card title="Policies" accent="brand">

Rules and conditions that define how authorization decisions are made in the system.

</Card>

</Cards>

## Access Control Models

### Role-Based Access Control (RBAC)

Role-based access control, where permissions are associated with roles and users are assigned to these roles.

#### RBAC Components

- Users: Entities that need to access resources
- Roles: Sets of grouped permissions
- Permissions: Rights to access resources
- Sessions: Role activation for users

### Attribute-Based Access Control (ABAC)

Model that uses attributes of users, resources and environment to make dynamic authorization decisions.

#### Considered Attributes

- User attributes (position, department, level)
- Resource attributes (type, sensitivity, owner)
- Environment attributes (time, location, device)
- Action attributes (read, write, delete)

### Policy-Based Access Control (PBAC)

Access control based on policies that combine different aspects of RBAC and ABAC with complex business rules.

#### Characteristics

- Centralized and reusable policies
- Condition-based rules
- Support for complex hierarchies
- Auditing and compliance

## Implementation in Distributed Systems

<Cards cols={2}>

<Card title="Architecture" accent="yellow">

- Centralized authorization service
- Distributed policy cache
- Update propagation
- Multi-layer validation

</Card>

<Card title="Challenges" accent="yellow">

- Latency in authorization decisions
- Consistency between services
- System scalability
- Policy maintenance

</Card>

</Cards>

<Cards cols={2}>

<Card title="Design" accent="yellow">

- Principle of least privilege
- Separation of responsibilities
- Adequate granularity
- Complete auditing

</Card>

<Card title="Implementation" accent="yellow">

- Intelligent cache
- Layered decisions
- Continuous monitoring
- Atomic updates

</Card>

</Cards>

## Tools and Technologies

<Cards cols={3}>

<Card title="Frameworks" accent="green">

- OAuth 2.0 and OpenID Connect
- Keycloak
- Spring Security
- IdentityServer

</Card>

<Card title="Protocols" accent="green">

- XACML
- SAML
- UMA 2.0
- SCIM

</Card>

<Card title="Services" accent="green">

- AWS IAM
- Azure AD
- Google Cloud IAM
- Auth0

</Card>

</Cards>
$mdx$, $mdx$# Autorização em Sistemas Distribuídos

Controle de acesso, permissões e políticas de segurança em ambientes distribuídos

<Callout type="success">

A autorização é o processo que determina o que um usuário autenticado pode fazer no sistema. Em sistemas distribuídos, implementar uma estratégia eficaz de autorização é essencial para garantir a segurança e o controle granular de acesso aos recursos.

</Callout>

## Conceitos Fundamentais

<Cards cols={3}>

<Card title="Autorização" accent="brand">

Processo de verificar se um usuário tem permissão para acessar um recurso ou realizar uma ação específica no sistema.

</Card>

<Card title="Permissões" accent="brand">

Direitos específicos concedidos a usuários ou grupos para realizar operações em recursos do sistema.

</Card>

<Card title="Políticas" accent="brand">

Regras e condições que definem como as decisões de autorização são tomadas no sistema.

</Card>

</Cards>

## Modelos de Controle de Acesso

### Role-Based Access Control (RBAC)

Controle de acesso baseado em papéis, onde as permissões são associadas a funções e os usuários são atribuídos a essas funções.

#### Componentes do RBAC

- Usuários: Entidades que precisam acessar recursos
- Papéis: Conjuntos de permissões agrupadas
- Permissões: Direitos de acesso a recursos
- Sessões: Ativação de papéis para usuários

### Attribute-Based Access Control (ABAC)

Modelo que utiliza atributos de usuários, recursos e ambiente para tomar decisões de autorização dinâmicas.

#### Atributos Considerados

- Atributos do usuário (cargo, departamento, nível)
- Atributos do recurso (tipo, sensibilidade, proprietário)
- Atributos do ambiente (hora, localização, dispositivo)
- Atributos da ação (leitura, escrita, exclusão)

### Policy-Based Access Control (PBAC)

Controle de acesso baseado em políticas que combinam diferentes aspectos de RBAC e ABAC com regras de negócio complexas.

#### Características

- Políticas centralizadas e reutilizáveis
- Regras baseadas em condições
- Suporte a hierarquias complexas
- Auditoria e compliance

## Implementação em Sistemas Distribuídos

<Cards cols={2}>

<Card title="Arquitetura" accent="yellow">

- Serviço centralizado de autorização
- Cache distribuído de políticas
- Propagação de atualizações
- Validação em múltiplas camadas

</Card>

<Card title="Desafios" accent="yellow">

- Latência nas decisões de autorização
- Consistência entre serviços
- Escalabilidade do sistema
- Manutenção de políticas

</Card>

</Cards>

<Cards cols={2}>

<Card title="Design" accent="yellow">

- Princípio do menor privilégio
- Separação de responsabilidades
- Granularidade adequada
- Auditoria completa

</Card>

<Card title="Implementação" accent="yellow">

- Cache inteligente
- Decisões em camadas
- Monitoramento contínuo
- Atualizações atômicas

</Card>

</Cards>

## Ferramentas e Tecnologias

<Cards cols={3}>

<Card title="Frameworks" accent="green">

- OAuth 2.0 e OpenID Connect
- Keycloak
- Spring Security
- IdentityServer

</Card>

<Card title="Protocolos" accent="green">

- XACML
- SAML
- UMA 2.0
- SCIM

</Card>

<Card title="Serviços" accent="green">

- AWS IAM
- Azure AD
- Google Cloud IAM
- Auth0

</Card>

</Cards>
$mdx$),
  ('security/cryptography', '/seguranca/criptografia', 'security', true, 60, NULL, true, 'Cryptography in Distributed Systems', 'Criptografia em Sistemas Distribuídos', $mdx$# Cryptography in Distributed Systems

Data protection, secure communication and key management in distributed environments

[Try the Cryptography Simulator](/seguranca/criptografia/simulador)

<Callout type="info">

Cryptography is fundamental to ensure security in distributed systems, protecting data at rest and in transit. Understanding its concepts and implementations is essential to build secure and reliable systems.

</Callout>

## Cryptography Fundamentals

<Cards cols={3}>

<Card title="Confidentiality" accent="brand">

Ensures that only authorized parties can access and understand the protected information.

</Card>

<Card title="Integrity" accent="brand">

Ensures that data has not been altered during storage or transmission.

</Card>

<Card title="Authenticity" accent="brand">

Confirms the origin of data and ensures that the parties involved are who they claim to be.

</Card>

</Cards>

## Types of Cryptography

### Symmetric Cryptography

Uses the same key to encrypt and decrypt data. It is fast and efficient for large volumes of data.

#### Common Algorithms

- AES (Advanced Encryption Standard)
- ChaCha20
- 3DES (Triple DES)
- Blowfish

### Asymmetric Cryptography

Uses a pair of keys (public and private) for encryption and decryption operations.

#### Algorithms and Uses

- RSA: Encryption and digital signature
- ECC: Elliptic curves for resource-limited devices
- Diffie-Hellman: Key exchange
- Ed25519: Modern digital signatures

### Cryptographic Hash Functions

Generate a unique fingerprint of data, ensuring integrity and non-repudiation.

#### Popular Algorithms

- SHA-256/SHA-3: Current standard for secure hashing
- BLAKE2/BLAKE3: High performance
- Argon2: Specific for passwords
- HMAC: Keyed hash for authentication

## Key Management

<Cards cols={2}>

<Card title="Lifecycle" accent="yellow">

- Secure key generation
- Distribution and exchange
- Protected storage
- Rotation and revocation

</Card>

<Card title="Best Practices" accent="yellow">

- Hardware Security Modules (HSM)
- Key Derivation Functions
- Backup and recovery
- Usage auditing

</Card>

</Cards>

## Security Protocols

<Cards cols={2}>

<Card title="TLS/SSL" accent="green">

Standard protocol for secure communication on the web and between services.

- Handshake and cipher negotiation
- Digital certificates
- Perfect Forward Secrecy
- HTTPS and HSTS

</Card>

<Card title="Other Protocols" accent="green">

- SSH: Secure remote access
- IPsec: Network layer security
- WireGuard: Modern VPN
- Signal Protocol: Secure messaging

</Card>

</Cards>

## Secure Implementation

When implementing cryptography in distributed systems, consider:

<Cards cols={3}>

<Card title="Don't Do" accent="red">

- Implement your own algorithms
- Reuse keys or IVs
- Store keys in code
- Ignore validations

</Card>

<Card title="Do" accent="green">

- Use proven libraries
- Implement Perfect Forward Secrecy
- Validate certificates
- Monitor and update

</Card>

<Card title="Consider" accent="yellow">

- Performance requirements
- Legal compliance
- Disaster recovery
- Auditing and logging

</Card>

</Cards>
$mdx$, $mdx$# Criptografia em Sistemas Distribuídos

Proteção de dados, comunicação segura e gerenciamento de chaves em ambientes distribuídos

[Experimente o Simulador de Criptografia](/seguranca/criptografia/simulador)

<Callout type="info">

A criptografia é fundamental para garantir a segurança em sistemas distribuídos, protegendo dados em repouso e em trânsito. Compreender seus conceitos e implementações é essencial para construir sistemas seguros e confiáveis.

</Callout>

## Fundamentos da Criptografia

<Cards cols={3}>

<Card title="Confidencialidade" accent="brand">

Garante que apenas as partes autorizadas possam acessar e compreender as informações protegidas.

</Card>

<Card title="Integridade" accent="brand">

Assegura que os dados não foram alterados durante o armazenamento ou transmissão.

</Card>

<Card title="Autenticidade" accent="brand">

Confirma a origem dos dados e garante que as partes envolvidas são quem dizem ser.

</Card>

</Cards>

## Tipos de Criptografia

### Criptografia Simétrica

Utiliza a mesma chave para criptografar e descriptografar dados. É rápida e eficiente para grandes volumes de dados.

#### Algoritmos Comuns

- AES (Advanced Encryption Standard)
- ChaCha20
- 3DES (Triple DES)
- Blowfish

### Criptografia Assimétrica

Usa um par de chaves (pública e privada) para operações de criptografia e descriptografia.

#### Algoritmos e Usos

- RSA: Criptografia e assinatura digital
- ECC: Curvas elípticas para dispositivos com recursos limitados
- Diffie-Hellman: Troca de chaves
- Ed25519: Assinaturas digitais modernas

### Funções Hash Criptográficas

Geram uma impressão digital única dos dados, garantindo integridade e não-repúdio.

#### Algoritmos Populares

- SHA-256/SHA-3: Padrão atual para hashing seguro
- BLAKE2/BLAKE3: Alta performance
- Argon2: Específico para senhas
- HMAC: Hash com chave para autenticação

## Gerenciamento de Chaves

<Cards cols={2}>

<Card title="Ciclo de Vida" accent="yellow">

- Geração de chaves segura
- Distribuição e troca
- Armazenamento protegido
- Rotação e revogação

</Card>

<Card title="Boas Práticas" accent="yellow">

- Hardware Security Modules (HSM)
- Key Derivation Functions
- Backup e recuperação
- Auditoria de uso

</Card>

</Cards>

## Protocolos de Segurança

<Cards cols={2}>

<Card title="TLS/SSL" accent="green">

Protocolo padrão para comunicação segura na web e entre serviços.

- Handshake e negociação de cifras
- Certificados digitais
- Perfect Forward Secrecy
- HTTPS e HSTS

</Card>

<Card title="Outros Protocolos" accent="green">

- SSH: Acesso remoto seguro
- IPsec: Segurança na camada de rede
- WireGuard: VPN moderna
- Signal Protocol: Mensagens seguras

</Card>

</Cards>

## Implementação Segura

Ao implementar criptografia em sistemas distribuídos, considere:

<Cards cols={3}>

<Card title="Não Faça" accent="red">

- Implementar próprios algoritmos
- Reutilizar chaves ou IVs
- Armazenar chaves no código
- Ignorar validações

</Card>

<Card title="Faça" accent="green">

- Use bibliotecas comprovadas
- Implemente Perfect Forward Secrecy
- Valide certificados
- Monitore e atualize

</Card>

<Card title="Considere" accent="yellow">

- Requisitos de performance
- Conformidade legal
- Recuperação de desastres
- Auditoria e logging

</Card>

</Cards>
$mdx$),
  ('security/tokens', '/seguranca/tokens', 'security', true, 61, NULL, true, 'Tokens and JWT in Distributed Systems', 'Tokens e JWT em Sistemas Distribuídos', $mdx$# Tokens and JWT in Distributed Systems

Understand how tokens and JSON Web Tokens (JWT) work in distributed systems

[Try the JWT Simulator](/seguranca/tokens/simulador)

<Callout type="info">

Tokens are the foundation of modern authentication in distributed systems, enabling secure and stateless communication between different services and applications.

</Callout>

## Token Fundamentals

### What are Tokens?

Tokens are digital credentials that represent authorizations and identities in distributed systems. They function as a "digital pass" that allows:

- Authentication without the need to store sessions on the server
- Secure information sharing between services
- Identity validation without constant database queries
- Efficient permission and access management

## JSON Web Tokens (JWT)

### The JWT Standard

JWT is an open standard (RFC 7519) that defines a compact and secure format for transmitting information between parties as a JSON object. Each token is:

- Digitally signed to ensure authenticity
- Encoded in Base64URL for easy transmission
- Self-contained, carrying all necessary information
- Verifiable independently of the issuer

### Anatomy of a JWT

#### 1. Header

Token metadata, including type and signature algorithm

```json
{ "alg": "HS256", "typ": "JWT" }
```

#### 2. Payload

Token data (claims) that carry the main information

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "exp": 1516239022
}
```

#### 3. Signature

Signature that ensures the integrity and authenticity of the token

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Claims: The Heart of JWT

Claims are the declarations that make up the JWT payload, carrying information about the entity (usually the user) and token metadata.

### Registered Claims

Standardized claims by JWT, with specific purposes:

- `iss` (issuer): Identifies who issued the token
- `sub` (subject): Identifies the subject of the token
- `exp` (expiration): Expiration timestamp
- `iat` (issued at): Issuance timestamp

### Public Claims

Claims defined freely, but registered in the IANA JWT Registry to avoid collisions. Useful for standardized information such as:

- User name and information
- Roles and permissions
- Organizational information

### Private Claims

Custom claims for specific use between the involved parties. Ideal for:

- Application-specific metadata
- Custom configurations
- Internal control information

## Implementation Best Practices

<Cards cols={2}>

<Card title="Payload Optimization" accent="green">

Keep tokens compact for better performance:

- Include only essential data
- Use short names for claims
- Avoid information duplication

</Card>

<Card title="Transmission Security" accent="brand">

Protect token transmission:

- Always use HTTPS for transmission
- Implement rate limiting
- Monitor suspicious access attempts

</Card>

<Card title="Lifecycle Management" accent="yellow">

Properly manage token lifespan:

- Define appropriate expiration times
- Implement automatic renewal
- Maintain a list of revoked tokens

</Card>

<Card title="Data Protection" accent="red">

Protect sensitive information:

- Never include credentials in the payload
- Avoid sensitive personal data
- Use private claims for internal data

</Card>

</Cards>

## JWT Authentication Flow

1. **Initial Authentication** — The user provides their credentials (email/password) through a secure login form. The server validates these credentials against the database.
2. **JWT Generation** — After successful validation, the server generates a JWT containing relevant user information, such as ID, roles, and permissions. The token is signed with a secret key.
3. **Secure Storage** — The client receives and stores the token securely, either in an HTTP-only cookie for web applications or in secure storage for mobile apps.
4. **Authenticated Requests** — In each subsequent request, the client includes the JWT in the Authorization header using the Bearer scheme: `Authorization: Bearer <token>`
5. **Validation and Authorization** — The server validates the token signature, checks expiration, and uses the claims to authorize access to the requested resources.

## Security Considerations

<Callout type="danger" title="Risks and Mitigations">

**XSS Attacks**

Protect against Cross-Site Scripting:

- Use HTTP-only cookies for tokens
- Implement CSP (Content Security Policy)
- Sanitize all user inputs

**CSRF**

Prevent Cross-Site Request Forgery:

- Use CSRF tokens for important operations
- Check Origin/Referer header
- Implement SameSite cookies

**Token Theft**

Minimize the impact of compromised tokens:

- Implement refresh tokens with rotation
- Keep short expiration for access tokens
- Monitor suspicious usage patterns
- Maintain a blacklist of revoked tokens

</Callout>
$mdx$, $mdx$# Tokens e JWT em Sistemas Distribuídos

Entenda como funcionam tokens e JSON Web Tokens (JWT) em sistemas distribuídos

[Experimente o Simulador de JWT](/seguranca/tokens/simulador)

<Callout type="info">

Tokens são a base da autenticação moderna em sistemas distribuídos, permitindo comunicação segura e sem estado entre diferentes serviços e aplicações.

</Callout>

## Fundamentos de Tokens

### O que são Tokens?

Tokens são credenciais digitais que representam autorizações e identidades em sistemas distribuídos. Funcionam como um "passe digital" que permite:

- Autenticação sem necessidade de armazenar sessões no servidor
- Compartilhamento seguro de informações entre serviços
- Validação de identidade sem consultas constantes ao banco de dados
- Gerenciamento eficiente de permissões e acessos

## JSON Web Tokens (JWT)

### O Padrão JWT

JWT é um padrão aberto (RFC 7519) que define um formato compacto e seguro para transmissão de informações entre partes como um objeto JSON. Cada token é:

- Assinado digitalmente para garantir autenticidade
- Codificado em Base64URL para fácil transmissão
- Autocontido, carregando todas as informações necessárias
- Verificável independentemente do emissor

### Anatomia de um JWT

#### 1. Header

Metadados do token, incluindo tipo e algoritmo de assinatura

```json
{ "alg": "HS256", "typ": "JWT" }
```

#### 2. Payload

Dados do token (claims) que carregam as informações principais

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "exp": 1516239022
}
```

#### 3. Signature

Assinatura que garante a integridade e autenticidade do token

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Claims: O Coração do JWT

Claims são as declarações que compõem o payload do JWT, carregando informações sobre a entidade (geralmente o usuário) e metadados do token.

### Claims Registradas

Claims padronizadas pelo JWT, com propósitos específicos:

- `iss` (issuer): Identifica quem emitiu o token
- `sub` (subject): Identifica o sujeito do token
- `exp` (expiration): Timestamp de expiração
- `iat` (issued at): Timestamp de emissão

### Claims Públicas

Claims definidas livremente, mas registradas no IANA JWT Registry para evitar colisões. Úteis para informações padronizadas como:

- Nome e informações do usuário
- Papéis e permissões
- Informações organizacionais

### Claims Privadas

Claims personalizadas para uso específico entre as partes envolvidas. Ideais para:

- Metadados específicos da aplicação
- Configurações personalizadas
- Informações de controle interno

## Melhores Práticas de Implementação

<Cards cols={2}>

<Card title="Otimização de Payload" accent="green">

Mantenha tokens compactos para melhor performance:

- Inclua apenas dados essenciais
- Use nomes curtos para as claims
- Evite duplicação de informações

</Card>

<Card title="Segurança na Transmissão" accent="brand">

Proteja a transmissão dos tokens:

- Use sempre HTTPS para transmissão
- Implemente rate limiting
- Monitore tentativas de acesso suspeitas

</Card>

<Card title="Gestão de Ciclo de Vida" accent="yellow">

Gerencie adequadamente a vida útil dos tokens:

- Defina tempos de expiração apropriados
- Implemente renovação automática
- Mantenha uma lista de tokens revogados

</Card>

<Card title="Proteção de Dados" accent="red">

Proteja informações sensíveis:

- Nunca inclua credenciais no payload
- Evite dados pessoais sensíveis
- Use claims privadas para dados internos

</Card>

</Cards>

## Fluxo de Autenticação com JWT

1. **Autenticação Inicial** — O usuário fornece suas credenciais (email/senha) através de um formulário de login seguro. O servidor valida essas credenciais contra o banco de dados.
2. **Geração do JWT** — Após validação bem-sucedida, o servidor gera um JWT contendo informações relevantes do usuário, como ID, papéis e permissões. O token é assinado com uma chave secreta.
3. **Armazenamento Seguro** — O cliente recebe e armazena o token de forma segura, seja em um cookie HTTP-only para aplicações web ou no armazenamento seguro para apps móveis.
4. **Requisições Autenticadas** — Em cada requisição subsequente, o cliente inclui o JWT no header Authorization usando o esquema Bearer: `Authorization: Bearer <token>`
5. **Validação e Autorização** — O servidor valida a assinatura do token, verifica a expiração e utiliza as claims para autorizar o acesso aos recursos solicitados.

## Considerações de Segurança

<Callout type="danger" title="Riscos e Mitigações">

**Ataques XSS**

Proteja-se contra Cross-Site Scripting:

- Use cookies HTTP-only para tokens
- Implemente CSP (Content Security Policy)
- Sanitize todas as entradas de usuário

**CSRF**

Previna Cross-Site Request Forgery:

- Use tokens CSRF para operações importantes
- Verifique o Origin/Referer header
- Implemente SameSite cookies

**Roubo de Tokens**

Minimize o impacto de tokens comprometidos:

- Implemente refresh tokens com rotação
- Mantenha expiração curta para access tokens
- Monitore padrões suspeitos de uso
- Mantenha uma blacklist de tokens revogados

</Callout>
$mdx$),
  ('security/ssl-tls', '/seguranca/ssl-tls', 'security', true, 62, NULL, true, 'SSL/TLS in Distributed Systems', 'SSL/TLS em Sistemas Distribuídos', $mdx$# SSL/TLS in Distributed Systems

Security protocols for secure communication in networks and distributed systems

<Callout type="success">

SSL/TLS are fundamental protocols that ensure the security of communications on the internet, protecting sensitive data and ensuring the authenticity of services.

</Callout>

## Overview

<Cards cols={2}>

<Card title="What is SSL/TLS?" accent="green">

SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) are cryptographic protocols that provide secure communication over the internet. They operate at the transport layer, ensuring:

- Data confidentiality
- Message integrity
- Server authentication
- Optional client authentication

</Card>

<Card title="Evolution" accent="green">

- **SSL 2.0/3.0** — Obsolete and insecure
- **TLS 1.0/1.1** — Discontinued
- **TLS 1.2** — Widely supported
- **TLS 1.3** — Latest and most secure version

</Card>

</Cards>

## How It Works

### The TLS Handshake

1. **Client Hello** — The client initiates the connection by sending:
   - Supported TLS version
   - List of cipher suites
   - Random number
   - Supported extensions
2. **Server Hello** — The server responds with:
   - Digital certificate
   - Chosen cipher suite
   - Server random number
   - Negotiated extensions
3. **Key Exchange** — Key exchange and secret establishment:
   - Client verifies the certificate
   - Pre-master secret generation
   - Session key derivation
4. **Finished** — Handshake completion:
   - Integrity verification
   - Parameter confirmation
   - Start of secure communication

## Digital Certificates

<Cards cols={2}>

<Card title="Structure" accent="green">

- Certificate holder information
- Public key
- Validity period
- Issuer (CA)
- CA digital signature
- Serial number

</Card>

<Card title="Types" accent="green">

- **DV (Domain Validation)**: Basic domain validation
- **OV (Organization Validation)**: Organization validation
- **EV (Extended Validation)**: Extended and rigorous validation

</Card>

</Cards>

## Cipher Suites

Cipher suites are sets of algorithms that define how communication will be protected. A typical cipher suite includes:

<Cards cols={4}>

<Card title="Key Exchange" accent="brand">

- ECDHE
- DHE
- RSA

</Card>

<Card title="Authentication" accent="green">

- RSA
- ECDSA
- PSK

</Card>

<Card title="Encryption" accent="purple">

- AES-GCM
- ChaCha20
- AES-CBC

</Card>

<Card title="MAC" accent="yellow">

- AEAD
- SHA-384
- POLY1305

</Card>

</Cards>

## Best Practices

<Cards cols={3}>

<Card title="Configuration" accent="green">

- Use only TLS 1.2 and 1.3
- Disable insecure cipher suites
- Configure HSTS
- Implement OCSP Stapling

</Card>

<Card title="Certificates" accent="brand">

- Keep certificates updated
- Use strong keys (RSA 2048+ or ECC)
- Implement automatic renewal
- Protect private keys

</Card>

<Card title="Monitoring" accent="red">

- Monitor certificate expiration
- Check for known vulnerabilities
- Perform regular security tests
- Maintain access logs

</Card>

</Cards>

## Security Considerations

<Cards cols={2}>

<Card title="Common Threats" accent="red">

- MITM (Man-in-the-Middle)
- Downgrade Attacks
- Protocol Vulnerabilities
- Certificate Spoofing

</Card>

<Card title="Mitigations" accent="red">

- Certificate Pinning
- Perfect Forward Secrecy
- Strong Cipher Preferences
- Regular Security Updates

</Card>

</Cards>
$mdx$, $mdx$# SSL/TLS em Sistemas Distribuídos

Protocolos de segurança para comunicação segura em redes e sistemas distribuídos

<Callout type="success">

SSL/TLS são protocolos fundamentais que garantem a segurança das comunicações na internet, protegendo dados sensíveis e garantindo a autenticidade dos serviços.

</Callout>

## Visão Geral

<Cards cols={2}>

<Card title="O que é SSL/TLS?" accent="green">

SSL (Secure Sockets Layer) e seu sucessor TLS (Transport Layer Security) são protocolos criptográficos que fornecem comunicação segura através da internet. Eles operam na camada de transporte, garantindo:

- Confidencialidade dos dados
- Integridade das mensagens
- Autenticação do servidor
- Autenticação opcional do cliente

</Card>

<Card title="Evolução" accent="green">

- **SSL 2.0/3.0** — Obsoleto e inseguro
- **TLS 1.0/1.1** — Descontinuado
- **TLS 1.2** — Amplamente suportado
- **TLS 1.3** — Versão mais recente e segura

</Card>

</Cards>

## Como Funciona

### O Handshake TLS

1. **Client Hello** — O cliente inicia a conexão enviando:
   - Versão TLS suportada
   - Lista de cipher suites
   - Número aleatório
   - Extensões suportadas
2. **Server Hello** — O servidor responde com:
   - Certificado digital
   - Cipher suite escolhida
   - Número aleatório do servidor
   - Extensões negociadas
3. **Key Exchange** — Troca de chaves e estabelecimento de segredos:
   - Cliente verifica o certificado
   - Geração do pre-master secret
   - Derivação das chaves de sessão
4. **Finished** — Finalização do handshake:
   - Verificação de integridade
   - Confirmação dos parâmetros
   - Início da comunicação segura

## Certificados Digitais

<Cards cols={2}>

<Card title="Estrutura" accent="green">

- Informações do titular
- Chave pública
- Período de validade
- Emissor (CA)
- Assinatura digital da CA
- Número de série

</Card>

<Card title="Tipos" accent="green">

- **DV (Domain Validation)**: Validação básica do domínio
- **OV (Organization Validation)**: Validação da organização
- **EV (Extended Validation)**: Validação extendida e rigorosa

</Card>

</Cards>

## Cipher Suites

Cipher suites são conjuntos de algoritmos que definem como a comunicação será protegida. Uma cipher suite típica inclui:

<Cards cols={4}>

<Card title="Key Exchange" accent="brand">

- ECDHE
- DHE
- RSA

</Card>

<Card title="Authentication" accent="green">

- RSA
- ECDSA
- PSK

</Card>

<Card title="Encryption" accent="purple">

- AES-GCM
- ChaCha20
- AES-CBC

</Card>

<Card title="MAC" accent="yellow">

- AEAD
- SHA-384
- POLY1305

</Card>

</Cards>

## Melhores Práticas

<Cards cols={3}>

<Card title="Configuração" accent="green">

- Use apenas TLS 1.2 e 1.3
- Desative cipher suites inseguras
- Configure HSTS
- Implemente OCSP Stapling

</Card>

<Card title="Certificados" accent="brand">

- Mantenha certificados atualizados
- Use chaves fortes (RSA 2048+ ou ECC)
- Implemente renovação automática
- Proteja chaves privadas

</Card>

<Card title="Monitoramento" accent="red">

- Monitore expiração de certificados
- Verifique vulnerabilidades conhecidas
- Realize testes de segurança regulares
- Mantenha logs de acesso

</Card>

</Cards>

## Considerações de Segurança

<Cards cols={2}>

<Card title="Ameaças Comuns" accent="red">

- MITM (Man-in-the-Middle)
- Downgrade Attacks
- Protocol Vulnerabilities
- Certificate Spoofing

</Card>

<Card title="Mitigações" accent="red">

- Certificate Pinning
- Perfect Forward Secrecy
- Strong Cipher Preferences
- Regular Security Updates

</Card>

</Cards>
$mdx$),
  ('security/common-attacks', '/seguranca/ataques', 'security', true, 63, NULL, true, 'Attacks on Distributed Systems', 'Ataques em Sistemas Distribuídos', $mdx$# Attacks on Distributed Systems

Understand the main types of attacks, their impacts and mitigation strategies

<Callout type="danger">

Attacks on distributed systems can cause serious damage to infrastructure, compromise sensitive data and result in significant financial losses. It is crucial to understand and implement adequate protection measures.

</Callout>

<Callout type="danger" title="Interactive Attack Simulator">

Experience our interactive tool that visually demonstrates how DDoS and Man-in-the-Middle attacks work. Visualize the impact of attacks in real time and better understand protection strategies.

[Access Simulator](/seguranca/ataques/simulador)

</Callout>

## Attack Categories

<Cards cols={3}>

<Card title="Network Attacks" accent="red">

- DDoS (Distributed Denial of Service)
- Man-in-the-Middle (MITM)
- DNS Spoofing
- ARP Poisoning
- TCP/IP Hijacking

</Card>

<Card title="Application Attacks" accent="yellow">

- SQL Injection
- Cross-Site Scripting (XSS)
- CSRF (Cross-Site Request Forgery)
- Command Injection
- File Inclusion

</Card>

<Card title="Authentication Attacks" accent="brand">

- Brute Force
- Dictionary Attacks
- Session Hijacking
- Credential Stuffing
- Password Spraying

</Card>

</Cards>

## DDoS Attacks

Distributed Denial of Service (DDoS) attacks aim to make resources or services unavailable to legitimate users by overwhelming systems with malicious traffic.

<Cards cols={2}>

<Card title="Common Types" accent="green">

- **Volumetric**: Floods the network with high volume traffic
- **Protocol**: Exploits vulnerabilities in network protocols
- **Application**: Attacks application layer with malicious requests

</Card>

<Card title="Mitigation" accent="green">

- Firewalls and WAFs
- Rate Limiting
- Load Balancing
- Traffic Analysis
- CDN Protection
- Blackholing

</Card>

</Cards>

## Man-in-the-Middle Attacks

<Cards cols={2}>

<Card title="How It Works" accent="green">

The attacker positions themselves between two communicating parties, intercepting and potentially modifying communication without the parties noticing.

- Traffic interception
- Data modification
- Information theft
- Identity falsification

</Card>

<Card title="Prevention" accent="green">

- Use of TLS/SSL
- Certificate Pinning
- VPNs
- Mutual Authentication
- HSTS

</Card>

</Cards>

## Injection Attacks

### SQL Injection

**Vulnerability**

Insertion of malicious SQL code into data inputs to manipulate or extract information from the database.

**Prevention**

- Prepared Statements
- Input Validation
- Escaping
- Least Privilege

### Cross-Site Scripting (XSS)

**Vulnerability**

Injection of malicious scripts into web pages viewed by other users, allowing session theft and content manipulation.

**Prevention**

- Input Sanitization
- Content Security Policy
- HttpOnly Cookies
- Output Encoding

## Authentication Attacks

<Cards cols={3}>

<Card title="Brute Force" accent="green">

Systematic attempts to guess credentials by testing all possible combinations.

**Mitigation**

- Rate Limiting
- CAPTCHA
- Account Lockout
- Strong Passwords

</Card>

<Card title="Session Hijacking" accent="green">

Theft or forgery of session tokens to access authenticated user accounts.

**Mitigation**

- Secure Session Management
- SSL/TLS
- Session Timeout
- Regenerate IDs

</Card>

<Card title="Credential Stuffing" accent="green">

Automated use of leaked username/password pairs to attempt access across multiple services.

**Mitigation**

- Multi-factor Authentication
- Password Policies
- Breach Detection
- IP-based Rate Limiting

</Card>

</Cards>

## Security Best Practices

<Cards cols={2}>

<Card title="Prevention" accent="green">

- Keep all systems and dependencies updated
- Implement strong and multi-factor authentication
- Use HTTPS in all communications
- Validate and sanitize all user inputs
- Implement adequate logging and monitoring

</Card>

<Card title="Monitoring" accent="green">

- Configure alerts for suspicious behavior
- Perform regular security audits
- Maintain access and activity logs
- Implement intrusion detection
- Monitor performance and availability metrics

</Card>

</Cards>
$mdx$, $mdx$# Ataques em Sistemas Distribuídos

Compreenda os principais tipos de ataques, seus impactos e estratégias de mitigação

<Callout type="danger">

Ataques a sistemas distribuídos podem causar sérios danos à infraestrutura, comprometer dados sensíveis e resultar em perdas financeiras significativas. É crucial entender e implementar medidas de proteção adequadas.

</Callout>

<Callout type="danger" title="Simulador Interativo de Ataques">

Experimente nossa ferramenta interativa que demonstra visualmente como funcionam os ataques DDoS e Man-in-the-Middle. Visualize o impacto dos ataques em tempo real e entenda melhor as estratégias de proteção.

[Acessar Simulador](/seguranca/ataques/simulador)

</Callout>

## Categorias de Ataques

<Cards cols={3}>

<Card title="Ataques de Rede" accent="red">

- DDoS (Distributed Denial of Service)
- Man-in-the-Middle (MITM)
- DNS Spoofing
- ARP Poisoning
- TCP/IP Hijacking

</Card>

<Card title="Ataques de Aplicação" accent="yellow">

- SQL Injection
- Cross-Site Scripting (XSS)
- CSRF (Cross-Site Request Forgery)
- Command Injection
- File Inclusion

</Card>

<Card title="Ataques de Autenticação" accent="brand">

- Brute Force
- Dictionary Attacks
- Session Hijacking
- Credential Stuffing
- Password Spraying

</Card>

</Cards>

## Ataques DDoS

Ataques de Negação de Serviço Distribuído (DDoS) visam tornar recursos ou serviços indisponíveis para usuários legítimos sobrecarregando os sistemas com tráfego malicioso.

<Cards cols={2}>

<Card title="Tipos Comuns" accent="green">

- **Volumétrico**: Inunda a rede com grande volume de tráfego
- **Protocolo**: Explora vulnerabilidades em protocolos de rede
- **Aplicação**: Ataca camada de aplicação com requisições maliciosas

</Card>

<Card title="Mitigação" accent="green">

- Firewalls e WAFs
- Rate Limiting
- Load Balancing
- Traffic Analysis
- CDN Protection
- Blackholing

</Card>

</Cards>

## Ataques Man-in-the-Middle

<Cards cols={2}>

<Card title="Como Funciona" accent="green">

O atacante se posiciona entre duas partes que se comunicam, interceptando e potencialmente modificando a comunicação sem que as partes percebam.

- Interceptação de tráfego
- Modificação de dados
- Roubo de informações
- Falsificação de identidade

</Card>

<Card title="Prevenção" accent="green">

- Uso de TLS/SSL
- Certificate Pinning
- VPNs
- Mutual Authentication
- HSTS

</Card>

</Cards>

## Ataques de Injeção

### SQL Injection

**Vulnerabilidade**

Inserção de código SQL malicioso em entradas de dados para manipular ou extrair informações do banco de dados.

**Prevenção**

- Prepared Statements
- Input Validation
- Escaping
- Least Privilege

### Cross-Site Scripting (XSS)

**Vulnerabilidade**

Injeção de scripts maliciosos em páginas web visualizadas por outros usuários, permitindo roubo de sessões e manipulação do conteúdo.

**Prevenção**

- Input Sanitization
- Content Security Policy
- HttpOnly Cookies
- Output Encoding

## Ataques de Autenticação

<Cards cols={3}>

<Card title="Brute Force" accent="green">

Tentativas sistemáticas de adivinhar credenciais testando todas as combinações possíveis.

**Mitigação**

- Rate Limiting
- CAPTCHA
- Account Lockout
- Strong Passwords

</Card>

<Card title="Session Hijacking" accent="green">

Roubo ou falsificação de tokens de sessão para acessar contas de usuários autenticados.

**Mitigação**

- Secure Session Management
- SSL/TLS
- Session Timeout
- Regenerate IDs

</Card>

<Card title="Credential Stuffing" accent="green">

Uso automatizado de pares de usuário/senha vazados para tentar acesso em múltiplos serviços.

**Mitigação**

- Multi-factor Authentication
- Password Policies
- Breach Detection
- IP-based Rate Limiting

</Card>

</Cards>

## Melhores Práticas de Segurança

<Cards cols={2}>

<Card title="Prevenção" accent="green">

- Mantenha todos os sistemas e dependências atualizados
- Implemente autenticação forte e multi-fator
- Use HTTPS em todas as comunicações
- Valide e sanitize todas as entradas de usuário
- Implemente logging e monitoramento adequados

</Card>

<Card title="Monitoramento" accent="green">

- Configure alertas para comportamentos suspeitos
- Realize auditorias de segurança regulares
- Mantenha logs de acesso e atividades
- Implemente detecção de intrusão
- Monitore métricas de performance e disponibilidade

</Card>

</Cards>
$mdx$),
  ('security/prompt-injection', '/seguranca/prompt-injection', 'security', true, 64, NULL, true, 'Prompt Injection & LLM Guardrails', 'Prompt Injection e Guardrails de LLM', $mdx$# Prompt Injection & LLM Guardrails

LLMs don't distinguish between your instructions and the data they read. If untrusted text can reach the model, that text can hijack it. **Prompt injection** is the defining security risk of LLM applications — and it has no complete fix.

[Try the Prompt Injection Simulator](/seguranca/prompt-injection/simulador)

<Callout type="danger" title="⚠ The Root Cause">

To an LLM, the system prompt, the user message, and retrieved documents are all just text in the same context. Attacker-controlled text can say "ignore previous instructions" — and the model may obey.

</Callout>

## Two Flavors of Injection

<Cards cols={2}>

<Card title="Direct Injection" accent="red">

The user types malicious instructions to break out of constraints — jailbreaks, "ignore your rules", role-play attacks to extract the system prompt or forbidden output.

</Card>

<Card title="Indirect Injection" accent="red">

Malicious instructions hide in content the model retrieves — a web page, a PDF, an email, a RAG document. The user is innocent; the *data* is the attacker.

</Card>

</Cards>

## What Attackers Try to Achieve

<Cards cols={3}>

<Card title="Data Exfiltration" accent="red">

Trick the model into leaking the system prompt, secrets, or another user's data.

</Card>

<Card title="Unauthorized Actions" accent="red">

In agentic systems, get the model to call tools it shouldn't — send emails, delete data, make purchases.

</Card>

<Card title="Policy Bypass" accent="red">

Make the model produce content it was instructed to refuse.

</Card>

</Cards>

## Defense in Depth

There's no silver bullet, so layer defenses:

<Cards cols={2}>

<Card title="Input Side" accent="brand">

- Treat all retrieved/user content as untrusted
- Separate instructions from data (delimiters, structured prompts)
- Filter and classify inputs for known attack patterns
- Strip or escape content from external sources

</Card>

<Card title="Output Side" accent="green">

- Validate and sanitize model output before use
- Never execute model output blindly (code, SQL, shell)
- Scan responses for leaked secrets / PII
- Constrain output format and length

</Card>

</Cards>

## The Most Important Guardrail: Least Privilege

<Callout type="warning" title="Assume the Model Can Be Compromised">

Because you can't fully prevent injection, design so a hijacked model can't do much damage:

- Give agents the **minimum** tools and permissions they need
- Require human approval for high-impact actions
- Scope data access per request and per user
- Sandbox tool execution and code

</Callout>

## Other LLM Threats

<Cards cols={3}>

<Card title="Sensitive Data Leakage" accent="red">

Models may echo training data or context. Don't put secrets in prompts.

</Card>

<Card title="Insecure Output Handling" accent="red">

Trusting model output as code/SQL leads to classic injection (XSS, RCE).

</Card>

<Card title="Denial of Wallet" accent="red">

Crafted prompts that maximize tokens to run up your bill. Cap tokens and rate-limit.

</Card>

</Cards>

## Related

This mirrors the patterns in [Common Attacks](/seguranca/ataques), depends on [authorization](/seguranca/autorizacao) and least privilege, and is critical when building [agentic systems](/sistemas-ia/agentic-systems) that can take real actions.
$mdx$, $mdx$# Prompt Injection e Guardrails de LLM

LLMs não distinguem entre as suas instruções e os dados que leem. Se um texto não confiável puder chegar ao modelo, esse texto pode sequestrá-lo. O **prompt injection** é o risco de segurança definidor das aplicações de LLM — e não tem correção completa.

[Experimente o Simulador de Prompt Injection](/seguranca/prompt-injection/simulador)

<Callout type="danger" title="⚠ A Causa Raiz">

Para um LLM, o prompt de sistema, a mensagem do usuário e os documentos recuperados são todos apenas texto no mesmo contexto. Texto controlado pelo atacante pode dizer "ignore as instruções anteriores" — e o modelo pode obedecer.

</Callout>

## Dois Tipos de Injeção

<Cards cols={2}>

<Card title="Injeção Direta" accent="red">

O usuário digita instruções maliciosas para escapar das restrições — jailbreaks, "ignore suas regras", ataques de role-play para extrair o prompt de sistema ou saída proibida.

</Card>

<Card title="Injeção Indireta" accent="red">

Instruções maliciosas se escondem em conteúdo que o modelo recupera — uma página web, um PDF, um e-mail, um documento RAG. O usuário é inocente; o *dado* é o atacante.

</Card>

</Cards>

## O Que os Atacantes Tentam Conseguir

<Cards cols={3}>

<Card title="Exfiltração de Dados" accent="red">

Enganar o modelo para vazar o prompt de sistema, segredos ou dados de outro usuário.

</Card>

<Card title="Ações Não Autorizadas" accent="red">

Em sistemas com agentes, fazer o modelo chamar ferramentas que não deveria — enviar e-mails, apagar dados, fazer compras.

</Card>

<Card title="Burla de Política" accent="red">

Fazer o modelo produzir conteúdo que foi instruído a recusar.

</Card>

</Cards>

## Defesa em Profundidade

Não há bala de prata, então combine camadas de defesa:

<Cards cols={2}>

<Card title="Lado da Entrada" accent="brand">

- Trate todo conteúdo recuperado/do usuário como não confiável
- Separe instruções de dados (delimitadores, prompts estruturados)
- Filtre e classifique entradas em busca de padrões de ataque conhecidos
- Remova ou escape conteúdo de fontes externas

</Card>

<Card title="Lado da Saída" accent="green">

- Valide e sanitize a saída do modelo antes de usar
- Nunca execute a saída do modelo às cegas (código, SQL, shell)
- Verifique respostas em busca de segredos / PII vazados
- Restrinja o formato e o tamanho da saída

</Card>

</Cards>

## O Guardrail Mais Importante: Menor Privilégio

<Callout type="warning" title="Assuma Que o Modelo Pode Ser Comprometido">

Como você não consegue impedir totalmente a injeção, projete para que um modelo sequestrado não cause muito dano:

- Dê aos agentes o **mínimo** de ferramentas e permissões necessárias
- Exija aprovação humana para ações de alto impacto
- Limite o acesso a dados por requisição e por usuário
- Faça sandbox da execução de ferramentas e de código

</Callout>

## Outras Ameaças de LLM

<Cards cols={3}>

<Card title="Vazamento de Dados Sensíveis" accent="red">

Modelos podem repetir dados de treino ou de contexto. Não coloque segredos em prompts.

</Card>

<Card title="Tratamento Inseguro da Saída" accent="red">

Confiar na saída do modelo como código/SQL leva à injeção clássica (XSS, RCE).

</Card>

<Card title="Negação de Carteira" accent="red">

Prompts elaborados que maximizam tokens para inflar sua conta. Limite tokens e taxa.

</Card>

</Cards>

## Relacionados

Isto espelha os padrões de [Ataques Comuns](/seguranca/ataques), depende de [autorização](/seguranca/autorizacao) e menor privilégio, e é crítico ao construir [sistemas com agentes](/sistemas-ia/agentic-systems) que podem executar ações reais.
$mdx$),
  ('theoretical-foundations/index', '/theoretical-foundations', 'theory', false, 3, NULL, true, 'Theoretical Foundations', 'Fundamentos Teóricos', $mdx$# Theoretical Foundations

Building unshakeable knowledge for distributed systems

<Callout type="neutral" title="Why Theory Matters in Practice">

In the fast-paced world of today, it might seem tempting to jump straight into implementation. However, without solid theoretical foundations, even the most experienced engineers can make costly mistakes that could have been avoided with proper understanding of fundamental principles.

</Callout>

Understanding theoretical foundations in distributed systems is not an academic luxury—it's a practical necessity. Just as a skyscraper requires a solid foundation to withstand earthquakes and storms, distributed systems require theoretical understanding to handle the inevitable challenges of network failures, data inconsistencies, and scalability pressures. Engineers who master these concepts don't just build systems; they build systems that last, scale, and adapt to changing requirements.

Consider the consequences of building without theory: teams that implement caching without understanding consistency models often create systems where users see their own updates disappear intermittently. Developers who don't grasp the CAP theorem might architect systems that promise both perfect consistency and 100% availability, only to discover during critical moments that such guarantees are mathematically impossible in the presence of network partitions.

The CAP theorem, one of our foundational topics, provides crucial decision-making framework for system architects. It's not just about knowing that you can't have consistency, availability, and partition tolerance simultaneously—it's about understanding what this means for your specific use case. Should your e-commerce platform prioritize showing consistent prices (consistency) or ensure the site stays online during network issues (availability)? The answer depends on business requirements, but the framework for making this decision comes from understanding the theoretical implications.

Consistency models form another pillar of theoretical knowledge that directly impacts practical implementation. When Netflix decides to use eventual consistency for user recommendation updates but strong consistency for billing information, they're applying theoretical knowledge to solve real business problems. Understanding when to apply strong, eventual, or weak consistency isn't intuitive—it requires grasping the trade-offs between performance, availability, and data accuracy.

The theoretical understanding of trade-offs extends far beyond academic interest—it directly translates to business value. Engineers who understand these concepts can make informed decisions about technology choices, avoiding costly rewrites and performance issues. They can estimate the true cost of consistency guarantees, predict how systems will behave under load, and design architectures that gracefully handle failure scenarios.

Theoretical foundations also serve as a shield against common pitfalls that plague distributed systems. The "8 Fallacies of Distributed Computing" aren't just historical curiosities—they're practical warnings about assumptions that continue to trip up modern development teams. Understanding that "the network is reliable" is false helps engineers design systems with proper retry mechanisms, circuit breakers, and graceful degradation strategies.

From a collaboration perspective, theoretical knowledge provides a common language for technical discussions. When architects discuss whether to implement read replicas, conversations become more productive when everyone understands concepts like read consistency, lag tolerance, and split-brain scenarios. Theory provides the vocabulary for precise technical communication, reducing misunderstandings that lead to architectural misalignments.

These foundations also provide a systematic approach to problem-solving. When a production system exhibits strange behavior—users in different regions seeing different data, or performance degrading under specific conditions—engineers with theoretical grounding can quickly narrow down root causes. They understand the relationship between network topology, consistency guarantees, and performance characteristics, enabling faster diagnosis and resolution.

As technology evolves, theoretical foundations remain constant while implementations change. The principles behind consensus algorithms apply whether you're using Raft in etcd, Paxos in Spanner, or Byzantine fault tolerance in blockchain systems. Engineers who understand the theory can adapt to new technologies more quickly because they recognize familiar patterns and can predict how new systems will behave.

Career-wise, engineers with strong theoretical foundations become force multipliers in their organizations. They can mentor junior developers, participate meaningfully in architectural decisions, and avoid the "cargo cult programming" trap where solutions are copied without understanding. They become the engineers that companies turn to for complex problems and system design decisions.

Furthermore, theoretical knowledge enables innovation and contribution to the field. Understanding existing algorithms and their limitations is the first step toward developing improvements or entirely new approaches. Many of today's most successful distributed systems innovations came from engineers who deeply understood existing theory and identified opportunities for advancement.

In conclusion, theoretical foundations in distributed systems are not just academic prerequisites—they are practical tools that enable better decision-making, more effective communication, and more robust system design. They provide the intellectual framework for understanding why certain approaches work, when they might fail, and how to adapt them to specific requirements. For any engineer serious about building reliable, scalable distributed systems, investing time in these theoretical foundations pays dividends throughout their entire career.

## Explore Key Foundation Topics

<Cards cols={4}>

<Card emoji="🔗" title="CAP Theorem" accent="purple">

[Consistency, Availability, and Partition tolerance trade-offs](/theoretical-foundations/cap-theorem)

</Card>

<Card emoji="⚖️" title="Consistency Models" accent="yellow">

[Strong, eventual, and weak consistency patterns](/theoretical-foundations/consistency-models)

</Card>

<Card emoji="⚠️" title="Distributed Challenges" accent="red">

[Common problems in distributed systems](/theoretical-foundations/distributed-challenges)

</Card>

<Card emoji="🌐" title="Network Partitions & Failures" accent="brand">

[Handling network splits and node failures](/theoretical-foundations/network-partitions)

</Card>

</Cards>
$mdx$, $mdx$# Fundamentos Teóricos

Construindo conhecimento inabalável em sistemas distribuídos

<Callout type="neutral" title="Por que a Teoria Importa na Prática">

No mundo acelerado de hoje, pode parecer tentador pular direto para a implementação. No entanto, sem fundamentos teóricos sólidos, até mesmo os engenheiros mais experientes podem cometer erros custosos que poderiam ter sido evitados com o entendimento adequado dos princípios fundamentais.

</Callout>

Compreender os fundamentos teóricos em sistemas distribuídos não é um luxo acadêmico—é uma necessidade prática. Assim como um arranha-céu requer uma base sólida para resistir a terremotos e tempestades, sistemas distribuídos requerem entendimento teórico para lidar com os desafios inevitáveis de falhas de rede, inconsistências de dados e pressões de escalabilidade. Engenheiros que dominam esses conceitos não apenas constroem sistemas; eles constroem sistemas que duram, escalam e se adaptam a requisitos em mudança.

Considere as consequências de construir sem teoria: equipes que implementam cache sem entender modelos de consistência frequentemente criam sistemas onde usuários veem suas próprias atualizações desaparecerem intermitentemente. Desenvolvedores que não compreendem o teorema CAP podem arquitetar sistemas que prometem tanto consistência perfeita quanto 100% de disponibilidade, apenas para descobrir durante momentos críticos que tais garantias são matematicamente impossíveis na presença de partições de rede.

O teorema CAP, um dos nossos tópicos fundamentais, fornece um framework crucial de tomada de decisão para arquitetos de sistema. Não se trata apenas de saber que você não pode ter consistência, disponibilidade e tolerância a partições simultaneamente—trata-se de entender o que isso significa para seu caso de uso específico. Sua plataforma de e-commerce deve priorizar mostrar preços consistentes (consistência) ou garantir que o site permaneça online durante problemas de rede (disponibilidade)? A resposta depende dos requisitos de negócio, mas o framework para tomar essa decisão vem do entendimento das implicações teóricas.

Modelos de consistência formam outro pilar do conhecimento teórico que impacta diretamente a implementação prática. Quando a Netflix decide usar consistência eventual para atualizações de recomendações de usuário, mas consistência forte para informações de cobrança, eles estão aplicando conhecimento teórico para resolver problemas reais de negócio. Entender quando aplicar consistência forte, eventual ou fraca não é intuitivo—requer compreender os trade-offs entre performance, disponibilidade e precisão de dados.

O entendimento teórico de trade-offs se estende muito além do interesse acadêmico—traduz-se diretamente em valor de negócio. Engenheiros que entendem esses conceitos podem tomar decisões informadas sobre escolhas de tecnologia, evitando reescritas custosas e problemas de performance. Eles podem estimar o custo real das garantias de consistência, prever como sistemas se comportarão sob carga e projetar arquiteturas que lidam graciosamente com cenários de falha.

Fundamentos teóricos também servem como escudo contra armadilhas comuns que afligem sistemas distribuídos. As "8 Falácias da Computação Distribuída" não são apenas curiosidades históricas—são avisos práticos sobre suposições que continuam a derrubar equipes de desenvolvimento modernas. Entender que "a rede é confiável" é falso ajuda engenheiros a projetar sistemas com mecanismos de retry adequados, circuit breakers e estratégias de degradação graciosa.

De uma perspectiva de colaboração, conhecimento teórico fornece uma linguagem comum para discussões técnicas. Quando arquitetos discutem se devem implementar réplicas de leitura, conversas se tornam mais produtivas quando todos entendem conceitos como consistência de leitura, tolerância a lag e cenários de split-brain. A teoria fornece o vocabulário para comunicação técnica precisa, reduzindo mal-entendidos que levam a desalinhamentos arquiteturais.

Esses fundamentos também fornecem uma abordagem sistemática para resolução de problemas. Quando um sistema de produção exibe comportamento estranho—usuários em diferentes regiões vendo dados diferentes, ou performance degradando sob condições específicas—engenheiros com base teórica podem rapidamente estreitar as causas raiz. Eles entendem a relação entre topologia de rede, garantias de consistência e características de performance, permitindo diagnóstico e resolução mais rápidos.

Conforme a tecnologia evolui, fundamentos teóricos permanecem constantes enquanto implementações mudam. Os princípios por trás de algoritmos de consenso se aplicam seja você usando Raft no etcd, Paxos no Spanner, ou tolerância a falhas bizantinas em sistemas blockchain. Engenheiros que entendem a teoria podem se adaptar a novas tecnologias mais rapidamente porque reconhecem padrões familiares e podem prever como novos sistemas se comportarão.

Em termos de carreira, engenheiros com fundamentos teóricos fortes se tornam multiplicadores de força em suas organizações. Eles podem mentorar desenvolvedores júnior, participar significativamente de decisões arquiteturais e evitar a armadilha da "programação cargo cult" onde soluções são copiadas sem entendimento. Eles se tornam os engenheiros para quem as empresas se voltam para problemas complexos e decisões de design de sistema.

Além disso, conhecimento teórico possibilita inovação e contribuição para o campo. Entender algoritmos existentes e suas limitações é o primeiro passo para desenvolver melhorias ou abordagens inteiramente novas. Muitas das inovações mais bem-sucedidas em sistemas distribuídos hoje vieram de engenheiros que entendiam profundamente a teoria existente e identificaram oportunidades de avanço.

Em conclusão, fundamentos teóricos em sistemas distribuídos não são apenas pré-requisitos acadêmicos—são ferramentas práticas que possibilitam melhor tomada de decisão, comunicação mais efetiva e design de sistema mais robusto. Eles fornecem o framework intelectual para entender por que certas abordagens funcionam, quando podem falhar e como adaptá-las a requisitos específicos. Para qualquer engenheiro sério sobre construir sistemas distribuídos confiáveis e escaláveis, investir tempo nesses fundamentos teóricos paga dividendos ao longo de toda sua carreira.

## Explore Tópicos Fundamentais

<Cards cols={4}>

<Card emoji="🔗" title="Teorema CAP" accent="purple">

[Trade-offs entre Consistência, Disponibilidade e Tolerância a Partições](/theoretical-foundations/cap-theorem)

</Card>

<Card emoji="⚖️" title="Modelos de Consistência" accent="yellow">

[Padrões de consistência forte, eventual e fraca](/theoretical-foundations/consistency-models)

</Card>

<Card emoji="⚠️" title="Desafios Distribuídos" accent="red">

[Problemas comuns em sistemas distribuídos](/theoretical-foundations/distributed-challenges)

</Card>

<Card emoji="🌐" title="Partições de Rede e Falhas" accent="brand">

[Lidando com divisões de rede e falhas de nós](/theoretical-foundations/network-partitions)

</Card>

</Cards>
$mdx$),
  ('theoretical-foundations/cap-theorem', '/theoretical-foundations/cap-theorem', 'theory', false, 4, NULL, true, 'CAP Theorem', 'Teorema CAP', $mdx$# CAP Theorem

Understanding the fundamental trade-offs in distributed systems.

<Callout type="neutral">

Proposed by Eric Brewer in 2000, the CAP theorem is one of the most important concepts in distributed systems. It states that any distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance. This theorem helps architects make informed decisions about system design trade-offs.

</Callout>

<Cards cols={3}>

<Card emoji="🔗" title="Consistency" accent="brand">

All nodes see the same data at the same time. Every read receives the most recent write or an error.

Consistency means that all nodes in the distributed system have the same view of the data at any given time. When a write operation completes successfully, all subsequent read operations will return the updated value until the data is changed again.

</Card>

<Card emoji="⚡" title="Availability" accent="green">

The system remains operational 100% of the time. Every request receives a response.

Availability means that the system continues to function and respond to requests even when some components fail. Every request receives a response (either success or failure) without guaranteeing that it contains the most recent version of the information.

</Card>

<Card emoji="🌐" title="Partition Tolerance" accent="purple">

The system continues to operate despite network failures between nodes.

Partition tolerance means the system continues to function even when network failures prevent some nodes from communicating with others. This is not optional in distributed systems — network failures are inevitable.

</Card>

</Cards>

## Concrete Examples

<Cards cols={3}>

<Card title="Consistency Examples" accent="brand">

- Banking system: When you transfer $100 from Account A to Account B, all ATMs must show the correct balances immediately
- Social media: When you update your profile picture, all your friends must see the new picture, not a mix of old and new
- E-commerce: When an item goes out of stock, no customer should be able to purchase it from any server
- Gaming leaderboard: When a player achieves a high score, all players must see the updated rankings consistently

</Card>

<Card title="Availability Examples" accent="green">

- Netflix: Must keep streaming videos even if some servers are down, even if recommendations might be stale
- Amazon shopping: Website must stay accessible during peak shopping times, even if product details take time to sync
- WhatsApp: Messages must be deliverable even during network issues, messages can be delivered out of order
- Google Search: Must return results even if some data centers are unreachable, results might be slightly outdated

</Card>

<Card title="Partition Tolerance Examples" accent="purple">

- Multi-region cloud: AWS East and West coast data centers lose connection but both continue serving users
- Mobile app: Your phone loses internet but cached data still works, syncs when connection returns
- Microservices: Payment service can't reach inventory service but can still process payments with cached data
- CDN: Local edge servers serve content even when disconnected from origin servers

</Card>

</Cards>

<Callout type="neutral" title="The CAP Theorem States:">

**In the presence of a network partition, you must choose between consistency and availability.**

*In practice, you don't choose between CAP properties for your entire system. Different parts of your application can make different trade-offs based on business requirements.*

</Callout>

<Cards cols={3}>

<Card title="CP Systems (Consistency + Partition Tolerance)" accent="red">

Prioritize data consistency over availability during network partitions.

**Characteristics:**

- System becomes unavailable during partitions
- When available, data is always consistent
- Better for financial/critical data

**Examples:**

- Traditional ACID databases (PostgreSQL, MySQL) with synchronous replication
- Apache HBase — ensures strong consistency
- MongoDB with strong consistency settings
- Zookeeper — coordination service requiring consensus
- Banking systems where accuracy > availability

**Use Cases:**

- Financial transactions and banking
- Inventory management systems
- Configuration management
- Authentication and authorization systems

</Card>

<Card title="AP Systems (Availability + Partition Tolerance)" accent="green">

Prioritize system availability over immediate consistency during partitions.

**Characteristics:**

- System remains available during partitions
- Data may be temporarily inconsistent
- Eventually becomes consistent when partition heals

**Examples:**

- Amazon DynamoDB — highly available NoSQL database
- Apache Cassandra — distributed database prioritizing availability
- DNS system — must always resolve names, eventual consistency is OK
- Amazon S3 — object storage with eventual consistency
- Social media feeds — better to show slightly stale content than be unavailable

**Use Cases:**

- Social media platforms
- Content delivery networks
- Shopping cart systems
- User preference storage
- Analytics and logging systems

</Card>

<Card title="CA Systems (Consistency + Availability)" accent="brand">

Traditional systems that sacrifice partition tolerance.

**Characteristics:**

- Perfect consistency and availability
- Only works in single location/no network partitions
- Not truly distributed systems

**Examples:**

- Single-node databases (PostgreSQL, MySQL on one server)
- In-memory databases (Redis) on single machine
- Traditional RDBMS in single data center
- Legacy monolithic applications

**Limitations:**

- Cannot handle network partitions
- Single point of failure
- Not suitable for geographically distributed systems
- Limited scalability

*In practice, CA systems don't exist in truly distributed environments because network partitions are inevitable.*

</Card>

</Cards>

<Cards cols={2}>

<Card title="Practical Considerations" accent="yellow">

- Most modern systems are either CP or AP
- You can choose different trade-offs for different parts of your system
- Business requirements should drive your CAP decisions
- Monitor and measure actual consistency and availability
- Design for graceful degradation during partitions

</Card>

<Card title="How to Choose?" accent="purple">

- Can your business tolerate temporary inconsistency?
- Is system availability more important than data accuracy?
- Are you operating across multiple geographic regions?
- What are the costs of downtime vs. inconsistent data?
- Can you implement conflict resolution mechanisms?

</Card>

</Cards>
$mdx$, $mdx$# Teorema CAP

Compreendendo os trade-offs fundamentais em sistemas distribuídos.

<Callout type="neutral">

Proposto por Eric Brewer em 2000, o teorema CAP é um dos conceitos mais importantes em sistemas distribuídos. Ele estabelece que qualquer sistema distribuído pode garantir apenas duas das três propriedades: Consistência, Disponibilidade e Tolerância a partições. Este teorema ajuda arquitetos a tomar decisões informadas sobre trade-offs no design de sistemas.

</Callout>

<Cards cols={3}>

<Card emoji="🔗" title="Consistência" accent="brand">

Todos os nós veem os mesmos dados ao mesmo tempo. Toda leitura recebe a escrita mais recente ou um erro.

Consistência significa que todos os nós no sistema distribuído têm a mesma visão dos dados a qualquer momento. Quando uma operação de escrita é concluída com sucesso, todas as operações de leitura subsequentes retornarão o valor atualizado até que os dados sejam alterados novamente.

</Card>

<Card emoji="⚡" title="Disponibilidade" accent="green">

O sistema permanece operacional 100% do tempo. Toda requisição recebe uma resposta.

Disponibilidade significa que o sistema continua funcionando e respondendo a solicitações mesmo quando alguns componentes falham. Toda solicitação recebe uma resposta (sucesso ou falha) sem garantir que contenha a versão mais recente das informações.

</Card>

<Card emoji="🌐" title="Tolerância a Partições" accent="purple">

O sistema continua operando apesar de falhas de rede entre os nós.

Tolerância a partições significa que o sistema continua funcionando mesmo quando falhas de rede impedem que alguns nós se comuniquem com outros. Isso não é opcional em sistemas distribuídos — falhas de rede são inevitáveis.

</Card>

</Cards>

## Exemplos Concretos

<Cards cols={3}>

<Card title="Exemplos de Consistência" accent="brand">

- Sistema bancário: Quando você transfere R$ 100 da Conta A para a Conta B, todos os caixas eletrônicos devem mostrar os saldos corretos imediatamente
- Redes sociais: Quando você atualiza sua foto de perfil, todos os seus amigos devem ver a nova foto, não uma mistura de antiga e nova
- E-commerce: Quando um item sai de estoque, nenhum cliente deve conseguir comprá-lo de qualquer servidor
- Ranking de jogos: Quando um jogador atinge uma pontuação alta, todos os jogadores devem ver o ranking atualizado consistentemente

</Card>

<Card title="Exemplos de Disponibilidade" accent="green">

- Netflix: Deve continuar reproduzindo vídeos mesmo se alguns servidores estiverem inativos, mesmo que recomendações possam estar desatualizadas
- Amazon: Site deve permanecer acessível durante picos de compras, mesmo que detalhes de produtos demorem para sincronizar
- WhatsApp: Mensagens devem ser entregues mesmo durante problemas de rede, mensagens podem ser entregues fora de ordem
- Google Search: Deve retornar resultados mesmo se alguns data centers estiverem inacessíveis, resultados podem estar ligeiramente desatualizados

</Card>

<Card title="Exemplos de Tolerância a Partições" accent="purple">

- Nuvem multi-região: Data centers da AWS na costa leste e oeste perdem conexão mas ambos continuam servindo usuários
- App móvel: Seu telefone perde internet mas dados em cache ainda funcionam, sincroniza quando conexão retorna
- Microserviços: Serviço de pagamento não consegue alcançar serviço de estoque mas ainda pode processar pagamentos com dados em cache
- CDN: Servidores edge locais servem conteúdo mesmo quando desconectados dos servidores de origem

</Card>

</Cards>

<Callout type="neutral" title="O Teorema CAP Estabelece:">

**Na presença de uma partição de rede, você deve escolher entre consistência e disponibilidade.**

*Na prática, você não escolhe entre propriedades CAP para todo o seu sistema. Diferentes partes da sua aplicação podem fazer diferentes trade-offs baseados em requisitos de negócio.*

</Callout>

<Cards cols={3}>

<Card title="Sistemas CP (Consistência + Tolerância a Partições)" accent="red">

Priorizam consistência de dados sobre disponibilidade durante partições de rede.

**Características:**

- Sistema fica indisponível durante partições
- Quando disponível, dados são sempre consistentes
- Melhor para dados financeiros/críticos

**Exemplos:**

- Bancos de dados ACID tradicionais (PostgreSQL, MySQL) com replicação síncrona
- Apache HBase — garante consistência forte
- MongoDB com configurações de consistência forte
- Zookeeper — serviço de coordenação requerendo consenso
- Sistemas bancários onde precisão > disponibilidade

**Casos de Uso:**

- Transações financeiras e bancárias
- Sistemas de gerenciamento de estoque
- Gerenciamento de configuração
- Sistemas de autenticação e autorização

</Card>

<Card title="Sistemas AP (Disponibilidade + Tolerância a Partições)" accent="green">

Priorizam disponibilidade do sistema sobre consistência imediata durante partições.

**Características:**

- Sistema permanece disponível durante partições
- Dados podem estar temporariamente inconsistentes
- Eventualmente se torna consistente quando partição se cura

**Exemplos:**

- Amazon DynamoDB — banco NoSQL altamente disponível
- Apache Cassandra — banco distribuído priorizando disponibilidade
- Sistema DNS — deve sempre resolver nomes, consistência eventual é OK
- Amazon S3 — armazenamento de objetos com consistência eventual
- Feeds de redes sociais — melhor mostrar conteúdo ligeiramente desatualizado que ficar indisponível

**Casos de Uso:**

- Plataformas de redes sociais
- Redes de entrega de conteúdo
- Sistemas de carrinho de compras
- Armazenamento de preferências do usuário
- Sistemas de analytics e logging

</Card>

<Card title="Sistemas CA (Consistência + Disponibilidade)" accent="brand">

Sistemas tradicionais que sacrificam tolerância a partições.

**Características:**

- Consistência e disponibilidade perfeitas
- Funciona apenas em local único/sem partições de rede
- Não são verdadeiramente sistemas distribuídos

**Exemplos:**

- Bancos de dados de nó único (PostgreSQL, MySQL em um servidor)
- Bancos em memória (Redis) em máquina única
- RDBMS tradicionais em data center único
- Aplicações monolíticas legadas

**Limitações:**

- Não consegue lidar com partições de rede
- Ponto único de falha
- Não adequado para sistemas geograficamente distribuídos
- Escalabilidade limitada

*Na prática, sistemas CA não existem em ambientes verdadeiramente distribuídos porque partições de rede são inevitáveis.*

</Card>

</Cards>

<Cards cols={2}>

<Card title="Considerações Práticas" accent="yellow">

- A maioria dos sistemas modernos são CP ou AP
- Você pode escolher diferentes trade-offs para diferentes partes do seu sistema
- Requisitos de negócio devem dirigir suas decisões CAP
- Monitore e meça consistência e disponibilidade reais
- Projete para degradação graciosa durante partições

</Card>

<Card title="Como Escolher?" accent="purple">

- Seu negócio pode tolerar inconsistência temporária?
- Disponibilidade do sistema é mais importante que precisão dos dados?
- Você está operando em múltiplas regiões geográficas?
- Quais são os custos de inatividade vs. dados inconsistentes?
- Você pode implementar mecanismos de resolução de conflitos?

</Card>

</Cards>
$mdx$),
  ('theoretical-foundations/consistency-models', '/theoretical-foundations/consistency-models', 'theory', false, 5, NULL, true, 'Consistency Models', 'Modelos de Consistência', $mdx$# Consistency Models

Different approaches to managing data consistency in distributed systems

<Callout type="neutral">

Consistency models define the rules about when and how data updates become visible across a distributed system. Understanding these models is crucial for designing systems that balance data accuracy, performance, and availability according to your specific requirements.

</Callout>

<Card emoji="🔒" title="Strong Consistency" accent="green">

All nodes see the same data at the same time. After a write operation, all subsequent reads will return the updated value.

Strong consistency guarantees that once a write operation completes successfully, all subsequent read operations will return the updated value from any node in the system. This provides the strongest guarantees but comes with performance and availability trade-offs.

**Characteristics:**

- Immediate consistency across all nodes
- No stale data ever returned to clients
- ACID transaction guarantees
- Synchronous replication required
- Higher latency due to coordination overhead

**Use Cases:**

- Financial transactions and banking systems
- Inventory and stock management
- User authentication and authorization
- Regulatory compliance systems
- Mission-critical enterprise applications

**Examples:**

- Bank account transfer: When you transfer money, both accounts must show correct balances immediately across all ATMs and branches
- Inventory management: When the last item is sold, no other customer should be able to purchase it from any location
- User authentication: Password changes must be effective immediately across all login servers
- Stock trading: Order execution must reflect immediately across all trading systems to prevent arbitrage

**Implementations:**

- PostgreSQL with synchronous replication
- MongoDB with majority write concern
- Apache Zookeeper consensus protocol
- Google Spanner with TrueTime
- Traditional RDBMS with distributed transactions

*Trade-offs: High consistency but may impact availability and performance*

</Card>

<Card emoji="⏱️" title="Eventual Consistency" accent="yellow">

The system will become consistent over time, given that the system doesn't receive new updates. Reads may return stale data temporarily.

Eventual consistency guarantees that if no new updates are made to a data item, eventually all accesses to that item will return the updated value. This model allows temporary inconsistencies but ensures high availability and partition tolerance.

**Characteristics:**

- Temporary inconsistencies allowed
- High availability and partition tolerance
- Asynchronous replication
- Lower latency for write operations
- Conflict resolution mechanisms needed

**Use Cases:**

- Social media feeds and interactions
- Content management systems
- User preference storage
- Shopping cart systems
- Analytics and logging data

**Examples:**

- Social media timeline: Your post appears immediately for you but may take time to show up in friends' feeds
- DNS propagation: Domain changes take time to propagate globally, different DNS servers may return different IPs temporarily
- Amazon product reviews: Reviews appear eventually on all servers, but immediate consistency isn't critical
- Email systems: Emails replicate to backup servers over time, temporary delays don't break functionality

**Implementations:**

- Amazon DynamoDB with eventual consistency reads
- Apache Cassandra default consistency level
- Amazon S3 object storage
- DNS (Domain Name System)
- NoSQL databases with async replication

**Convergence Strategies:**

- Last-write-wins (timestamp-based)
- Vector clocks for causality tracking
- Conflict-free replicated data types (CRDTs)
- Application-level conflict resolution
- Multi-version concurrency control

*Trade-offs: High availability and partition tolerance, but temporary inconsistency*

</Card>

<Card emoji="🏃‍♂️" title="Weak Consistency" accent="brand">

After a write, reads may or may not see the updated value. The system makes no guarantees about when data will be consistent.

Weak consistency makes no guarantees about when data will become consistent across nodes. This model prioritizes maximum performance and availability, accepting that data may be inconsistent for extended periods or even permanently in some cases.

**Characteristics:**

- No consistency guarantees
- Maximum performance and throughput
- Best effort data propagation
- Minimal coordination overhead
- Application must handle inconsistencies

**Use Cases:**

- Real-time gaming and simulations
- Live video/audio streaming
- High-frequency sensor data collection
- Real-time collaboration tools
- Performance monitoring and metrics

**Examples:**

- Live video streaming: Frame drops or quality changes are acceptable for real-time performance
- Online gaming: Player positions may be slightly out of sync for better responsiveness
- Real-time collaboration: Cursor positions in shared documents don't need perfect consistency
- IoT sensor data: Occasional data loss is acceptable for high-frequency sensor readings

**Implementations:**

- Memcached distributed caching
- Redis with no persistence
- UDP-based real-time systems
- Best-effort message queues
- Real-time streaming platforms

**Considerations:**

- Application must be designed for inconsistency
- Data loss may be permanent
- Client-side conflict resolution often needed
- Suitable only for non-critical data
- Monitoring becomes crucial

*Trade-offs: Maximum performance and availability, minimal consistency guarantees*

</Card>

## Decision Matrix

- Data criticality: How important is data accuracy?
- Performance requirements: What latency is acceptable?
- Availability needs: Can the system tolerate downtime?
- Scale requirements: How many concurrent users?
- Geographic distribution: Multiple regions or data centers?

<Cards cols={3}>

<Card title="Strong Consistency" accent="green">

Financial transactions, inventory systems, user authentication

</Card>

<Card title="Eventual Consistency" accent="yellow">

Social media feeds, comments, user profiles, shopping carts

</Card>

<Card title="Weak Consistency" accent="brand">

Live video streaming, online gaming, real-time collaboration

</Card>

</Cards>

## Practical Implementation Guidelines

- Different parts of your system can use different consistency models
- Start with strong consistency and relax only where necessary
- Monitor consistency metrics in production
- Design conflict resolution strategies upfront
- Consider hybrid approaches for complex applications
$mdx$, $mdx$# Modelos de Consistência

Diferentes abordagens para gerenciar consistência de dados em sistemas distribuídos

<Callout type="neutral">

Modelos de consistência definem as regras sobre quando e como atualizações de dados se tornam visíveis em um sistema distribuído. Compreender esses modelos é crucial para projetar sistemas que equilibram precisão de dados, performance e disponibilidade de acordo com seus requisitos específicos.

</Callout>

<Card emoji="🔒" title="Consistência Forte" accent="green">

Todos os nós veem os mesmos dados ao mesmo tempo. Após uma operação de escrita, todas as leituras subsequentes retornarão o valor atualizado.

Consistência forte garante que uma vez que uma operação de escrita seja concluída com sucesso, todas as operações de leitura subsequentes retornarão o valor atualizado de qualquer nó no sistema. Isso fornece as garantias mais fortes, mas vem com trade-offs de performance e disponibilidade.

**Características:**

- Consistência imediata em todos os nós
- Nunca retorna dados obsoletos aos clientes
- Garantias de transações ACID
- Replicação síncrona necessária
- Maior latência devido ao overhead de coordenação

**Casos de Uso:**

- Transações financeiras e sistemas bancários
- Gestão de estoque e inventário
- Autenticação e autorização de usuários
- Sistemas de conformidade regulatória
- Aplicações empresariais críticas

**Exemplos:**

- Transferência bancária: Quando você transfere dinheiro, ambas as contas devem mostrar saldos corretos imediatamente em todos os caixas eletrônicos e agências
- Gestão de estoque: Quando o último item é vendido, nenhum outro cliente deve conseguir comprá-lo de qualquer localização
- Autenticação de usuário: Mudanças de senha devem ser efetivas imediatamente em todos os servidores de login
- Negociação de ações: Execução de ordens deve refletir imediatamente em todos os sistemas de negociação para prevenir arbitragem

**Implementações:**

- PostgreSQL com replicação síncrona
- MongoDB com write concern de maioria
- Protocolo de consenso Apache Zookeeper
- Google Spanner com TrueTime
- RDBMS tradicionais com transações distribuídas

*Trade-offs: Alta consistência mas pode impactar disponibilidade e performance*

</Card>

<Card emoji="⏱️" title="Consistência Eventual" accent="yellow">

O sistema se tornará consistente com o tempo, desde que não receba novas atualizações. Leituras podem retornar dados obsoletos temporariamente.

Consistência eventual garante que se nenhuma nova atualização for feita a um item de dados, eventualmente todos os acessos a esse item retornarão o valor atualizado. Este modelo permite inconsistências temporárias mas garante alta disponibilidade e tolerância a partições.

**Características:**

- Inconsistências temporárias permitidas
- Alta disponibilidade e tolerância a partições
- Replicação assíncrona
- Menor latência para operações de escrita
- Mecanismos de resolução de conflitos necessários

**Casos de Uso:**

- Feeds e interações de redes sociais
- Sistemas de gerenciamento de conteúdo
- Armazenamento de preferências de usuário
- Sistemas de carrinho de compras
- Dados de analytics e logging

**Exemplos:**

- Timeline de redes sociais: Sua postagem aparece imediatamente para você, mas pode demorar para aparecer nos feeds dos amigos
- Propagação DNS: Mudanças de domínio levam tempo para propagar globalmente, servidores DNS diferentes podem retornar IPs diferentes temporariamente
- Avaliações de produtos Amazon: Avaliações aparecem eventualmente em todos os servidores, mas consistência imediata não é crítica
- Sistemas de email: Emails se replicam para servidores de backup ao longo do tempo, atrasos temporários não quebram a funcionalidade

**Implementações:**

- Amazon DynamoDB com leituras de consistência eventual
- Apache Cassandra nível de consistência padrão
- Amazon S3 armazenamento de objetos
- DNS (Sistema de Nomes de Domínio)
- Bancos NoSQL com replicação assíncrona

**Estratégias de Convergência:**

- Last-write-wins (baseado em timestamp)
- Vector clocks para rastreamento de causalidade
- Tipos de dados replicados livres de conflito (CRDTs)
- Resolução de conflitos no nível da aplicação
- Controle de concorrência multi-versão

*Trade-offs: Alta disponibilidade e tolerância a partições, mas inconsistência temporária*

</Card>

<Card emoji="🏃‍♂️" title="Consistência Fraca" accent="brand">

Após uma escrita, leituras podem ou não ver o valor atualizado. O sistema não faz garantias sobre quando os dados estarão consistentes.

Consistência fraca não faz garantias sobre quando os dados se tornarão consistentes entre os nós. Este modelo prioriza máxima performance e disponibilidade, aceitando que dados podem estar inconsistentes por períodos estendidos ou mesmo permanentemente em alguns casos.

**Características:**

- Nenhuma garantia de consistência
- Máxima performance e throughput
- Propagação de dados por melhor esforço
- Overhead mínimo de coordenação
- Aplicação deve lidar com inconsistências

**Casos de Uso:**

- Jogos e simulações em tempo real
- Streaming de vídeo/áudio ao vivo
- Coleta de dados de sensores de alta frequência
- Ferramentas de colaboração em tempo real
- Monitoramento de performance e métricas

**Exemplos:**

- Streaming de vídeo ao vivo: Perda de frames ou mudanças de qualidade são aceitáveis para performance em tempo real
- Jogos online: Posições de jogadores podem estar ligeiramente dessincronizadas para melhor responsividade
- Colaboração em tempo real: Posições de cursor em documentos compartilhados não precisam de consistência perfeita
- Dados de sensores IoT: Perda ocasional de dados é aceitável para leituras de sensores de alta frequência

**Implementações:**

- Cache distribuído Memcached
- Redis sem persistência
- Sistemas em tempo real baseados em UDP
- Filas de mensagens por melhor esforço
- Plataformas de streaming em tempo real

**Considerações:**

- Aplicação deve ser projetada para inconsistência
- Perda de dados pode ser permanente
- Resolução de conflitos no cliente frequentemente necessária
- Adequado apenas para dados não críticos
- Monitoramento se torna crucial

*Trade-offs: Máxima performance e disponibilidade, garantias mínimas de consistência*

</Card>

## Matriz de Decisão

- Criticidade dos dados: Quão importante é a precisão dos dados?
- Requisitos de performance: Qual latência é aceitável?
- Necessidades de disponibilidade: O sistema pode tolerar downtime?
- Requisitos de escala: Quantos usuários simultâneos?
- Distribuição geográfica: Múltiplas regiões ou data centers?

<Cards cols={3}>

<Card title="Consistência Forte" accent="green">

Transações financeiras, sistemas de inventário, autenticação de usuário

</Card>

<Card title="Consistência Eventual" accent="yellow">

Feeds de redes sociais, comentários, perfis de usuário, carrinhos de compra

</Card>

<Card title="Consistência Fraca" accent="brand">

Streaming de vídeo ao vivo, jogos online, colaboração em tempo real

</Card>

</Cards>

## Diretrizes Práticas de Implementação

- Diferentes partes do seu sistema podem usar diferentes modelos de consistência
- Comece com consistência forte e relaxe apenas onde necessário
- Monitore métricas de consistência em produção
- Projete estratégias de resolução de conflitos antecipadamente
- Considere abordagens híbridas para aplicações complexas
$mdx$),
  ('theoretical-foundations/distributed-challenges', '/theoretical-foundations/distributed-challenges', 'theory', false, 6, NULL, true, 'Distributed Systems Challenges', 'Desafios de Sistemas Distribuídos', $mdx$# Distributed Systems Challenges

Common problems and complexities in distributed computing

<Callout type="neutral">

Distributed systems face unique challenges that don't exist in single-machine systems. Understanding these fundamental problems is crucial for designing resilient, scalable, and reliable distributed applications. Each challenge requires careful consideration and specific solutions.

</Callout>

<Card emoji="🌐" title="Network Partitions" accent="red">

Network failures that split the system into isolated groups, forcing trade-offs between consistency and availability.

Network partitions occur when network failures prevent some nodes from communicating with others, effectively splitting the system into isolated groups. This is one of the most challenging problems in distributed systems because it forces immediate decisions about consistency vs. availability.

**Characteristics:**

- Communication failure between nodes
- System splits into isolated islands
- Immediate CAP theorem trade-offs required
- Can be temporary or permanent
- Affects data consistency guarantees

**Common Causes:**

- Physical network failures (cable cuts, router failures)
- Software bugs in networking stack
- Overloaded network infrastructure
- Security incidents (DDoS attacks)
- Configuration errors in routing

**Examples:**

- Data center connectivity: Cable cut between AWS regions causes 6-hour partition, each region must decide whether to stay online
- Microservices: Payment service can't reach inventory service, must decide whether to process orders with stale inventory data
- Database cluster: Master-slave replication breaks, slaves must decide whether to accept writes or remain read-only
- CDN network: Internet routing issues isolate edge servers from origin, cached content becomes stale but users still served

**Detection Strategies:**

- Heartbeat mechanisms between nodes
- Timeout-based failure detection
- Gossip protocols for membership
- External monitoring systems
- Network-level health checks

**Mitigation Approaches:**

- Multiple network paths and redundancy
- Graceful degradation strategies
- Circuit breakers for failing services
- Read-only mode during partitions
- Conflict resolution for partition healing

</Card>

<Card emoji="⏰" title="Clock Synchronization" accent="yellow">

Different nodes have different clocks, making it difficult to order events and maintain consistency.

Clock synchronization is fundamental to distributed systems because nodes have independent clocks that drift at different rates. Without synchronized time, it becomes nearly impossible to order events, maintain causality, or implement time-based algorithms correctly.

**Characteristics:**

- Clocks drift at different rates
- No global notion of "now"
- Event ordering becomes ambiguous
- Impacts timestamps and logs
- Critical for distributed algorithms

**Problems Caused:**

- Incorrect event ordering in logs
- Race conditions in time-based logic
- Inconsistent cache expiration
- Distributed lock failures
- Audit trail corruption

**Examples:**

- Banking transactions: Transfer appears to complete before it started due to clock skew, causing audit failures
- Distributed logging: Error logs appear out of order across services, making debugging impossible
- Cache invalidation: TTL expires at different times on different nodes, causing stale data
- Lease management: Distributed locks expire at different times, leading to split-brain scenarios

**Synchronization Approaches:**

- Network Time Protocol (NTP)
- Precision Time Protocol (PTP)
- GPS-based time synchronization
- Atomic clock references
- Google TrueTime API

**Logical Alternatives:**

- Lamport timestamps for causality
- Vector clocks for partial ordering
- Hybrid logical clocks (HLC)
- Event-based ordering instead of time
- Consensus-based sequence numbers

</Card>

<Card emoji="💥" title="Partial Failures" accent="brand">

Some parts of the system fail while others continue working, creating inconsistent states.

Partial failures are perhaps the most insidious challenge in distributed systems. Unlike complete system failures that are obvious, partial failures create scenarios where some components work while others fail, leading to inconsistent states that are difficult to detect and handle.

**Characteristics:**

- Only subset of system components fail
- Difficult to detect and diagnose
- Can cause cascading failures
- System appears partially functional
- Creates inconsistent global state

**Failure Types:**

- Fail-stop: Component stops completely
- Fail-slow: Component responds very slowly
- Byzantine: Component behaves arbitrarily
- Omission: Component drops some messages
- Commission: Component sends wrong data

**Examples:**

- E-commerce checkout: Payment processed but inventory not updated due to database failure, overselling occurs
- Email system: Message delivered to some recipients but not others due to server failures
- Social media: Post visible to some users but not others due to replication lag
- File storage: Data written to primary but replication to backups fails, data loss risk increases

**Detection Challenges:**

- No clear failure signal
- Timeouts are ambiguous
- Network vs. node failures unclear
- Silent data corruption possible
- Partial state updates

**Handling Strategies:**

- Comprehensive health checks
- Circuit breaker pattern
- Graceful degradation
- Compensation transactions
- Idempotent operations

</Card>

<Card emoji="🔄" title="Consensus" accent="purple">

Getting distributed nodes to agree on a single value or decision in the presence of failures.

Consensus is the problem of getting multiple distributed nodes to agree on a single value, even when some nodes may fail or behave maliciously. This is fundamental to many distributed systems operations like leader election, configuration management, and ensuring consistency.

**Characteristics:**

- All correct nodes must agree
- Must handle node failures
- Must terminate in finite time
- Safety and liveness guarantees
- Foundation for many distributed protocols

**Problem Variants:**

- Byzantine fault tolerance: Handle malicious nodes
- Crash fault tolerance: Handle only crash failures
- Leader election: Choose single coordinator
- Atomic broadcast: Order all messages
- State machine replication: Keep replicas synchronized

**Examples:**

- Database cluster: Nodes must agree on which transactions to commit in what order
- Kubernetes cluster: Nodes must agree on which pods are running where
- Blockchain: Miners must agree on the next block in the chain
- Configuration management: Services must agree on current configuration version

**Algorithms:**

- Paxos: Classic consensus with strong guarantees
- Raft: Simpler alternative to Paxos
- PBFT: Byzantine fault tolerant consensus
- FLP impossibility: Theoretical limitations
- RAFT: Leader-based consensus for log replication

**Real-World Usage:**

- Apache Zookeeper uses Zab protocol
- etcd and Consul use Raft
- Google Spanner uses Paxos
- Blockchain networks use Proof of Work/Stake
- Database replication protocols

</Card>

<Card emoji="📊" title="State Management" accent="green">

Keeping track of system state across multiple nodes while handling concurrent updates.

State management in distributed systems involves maintaining consistent state across multiple nodes while handling concurrent updates, failures, and network partitions. This challenge becomes exponentially more complex as the number of nodes and the frequency of updates increase.

**Characteristics:**

- State distributed across nodes
- Concurrent updates from multiple sources
- Must handle node failures gracefully
- Consistency vs. performance trade-offs
- Requires coordination mechanisms

**Consistency Challenges:**

- Read-after-write consistency
- Monotonic read consistency
- Session consistency
- Eventual consistency guarantees
- Strong consistency requirements

**Examples:**

- Shopping cart: User adds items from mobile app while simultaneously from web, both updates must be preserved
- Multiplayer game: Player position updates from multiple clients must be reconciled in real-time
- Collaborative document: Multiple users editing same document simultaneously
- Inventory system: Multiple warehouses updating stock levels concurrently

**Concurrency Issues:**

- Lost updates problem
- Dirty reads from uncommitted data
- Non-repeatable reads
- Phantom reads in range queries
- Write-write conflicts

**Architectural Patterns:**

- Event sourcing: Store events, not state
- CQRS: Separate command and query models
- Saga pattern: Manage distributed transactions
- Two-phase commit: Ensure atomicity
- Compensation-based transactions

</Card>

<Card emoji="🚦" title="Race Conditions" accent="slate">

Multiple processes accessing shared resources simultaneously, leading to unpredictable results.

Race conditions in distributed systems occur when multiple processes or nodes attempt to access and modify shared resources simultaneously, leading to unpredictable and often incorrect results. Unlike single-machine race conditions, distributed race conditions are harder to detect and debug.

**Characteristics:**

- Non-deterministic execution order
- Shared resource contention
- Timing-dependent bugs
- Difficult to reproduce
- Can cause data corruption

**Common Scenarios:**

- Check-then-act operations
- Read-modify-write cycles
- Double-checked locking patterns
- Initialization race conditions
- Cleanup race conditions

**Examples:**

- Bank account: Two ATMs withdraw simultaneously, both check balance ($100), both allow $60 withdrawal, account goes negative
- Ticket booking: Two customers book last seat simultaneously, both get confirmation, airplane oversold
- Counter increment: Multiple services increment global counter, final value incorrect due to lost updates
- Resource allocation: Two processes allocate same server resources, causing resource conflicts

**Distributed Complications:**

- Network delays mask timing issues
- Partial failures during operations
- Clock synchronization problems
- Message reordering effects
- Distributed lock failures

**Prevention Techniques:**

- Atomic operations and Compare-And-Swap
- Distributed locking mechanisms
- Message ordering guarantees
- Optimistic concurrency control
- Pessimistic locking strategies

</Card>

## The Fallacies of Distributed Computing

The Eight Fallacies of Distributed Computing, identified by Peter Deutsch and others, represent common misconceptions that developers make when designing distributed systems. Understanding these fallacies is crucial for building robust distributed applications.

1. The network is reliable
2. Latency is zero
3. Bandwidth is infinite
4. The network is secure
5. Topology doesn't change
6. There is one administrator
7. Transport cost is zero
8. The network is homogeneous

<Callout type="warning">

These false assumptions lead to many distributed systems problems

</Callout>

## General Mitigation Strategies

- Design for failure: Assume components will fail
- Implement comprehensive monitoring and alerting
- Use circuit breakers to prevent cascade failures
- Build in graceful degradation capabilities
- Test failure scenarios regularly (chaos engineering)
- Implement proper logging and distributed tracing
- Use idempotent operations where possible
- Design for eventual consistency when appropriate
$mdx$, $mdx$# Desafios de Sistemas Distribuídos

Problemas e complexidades comuns na computação distribuída

<Callout type="neutral">

Sistemas distribuídos enfrentam desafios únicos que não existem em sistemas de uma única máquina. Compreender esses problemas fundamentais é crucial para projetar aplicações distribuídas resilientes, escaláveis e confiáveis. Cada desafio requer consideração cuidadosa e soluções específicas.

</Callout>

<Card emoji="🌐" title="Partições de Rede" accent="red">

Falhas de rede que dividem o sistema em grupos isolados, forçando trade-offs entre consistência e disponibilidade.

Partições de rede ocorrem quando falhas de rede impedem que alguns nós se comuniquem com outros, efetivamente dividindo o sistema em grupos isolados. Este é um dos problemas mais desafiadores em sistemas distribuídos porque força decisões imediatas sobre consistência vs. disponibilidade.

**Características:**

- Falha de comunicação entre nós
- Sistema se divide em ilhas isoladas
- Trade-offs imediatos do teorema CAP necessários
- Pode ser temporário ou permanente
- Afeta garantias de consistência de dados

**Causas Comuns:**

- Falhas físicas de rede (corte de cabos, falhas de roteador)
- Bugs de software na pilha de rede
- Infraestrutura de rede sobrecarregada
- Incidentes de segurança (ataques DDoS)
- Erros de configuração no roteamento

**Exemplos:**

- Conectividade de data center: Cabo cortado entre regiões AWS causa partição de 6 horas, cada região deve decidir se permanece online
- Microserviços: Serviço de pagamento não consegue alcançar serviço de estoque, deve decidir se processa pedidos com dados de estoque obsoletos
- Cluster de banco: Replicação master-slave quebra, slaves devem decidir se aceitam escritas ou permanecem somente leitura
- Rede CDN: Problemas de roteamento isolam servidores edge da origem, conteúdo em cache fica obsoleto mas usuários ainda são servidos

**Estratégias de Detecção:**

- Mecanismos de heartbeat entre nós
- Detecção de falhas baseada em timeout
- Protocolos de gossip para associação
- Sistemas de monitoramento externos
- Verificações de saúde no nível da rede

**Abordagens de Mitigação:**

- Múltiplos caminhos de rede e redundância
- Estratégias de degradação graciosa
- Circuit breakers para serviços com falha
- Modo somente leitura durante partições
- Resolução de conflitos para cura de partições

</Card>

<Card emoji="⏰" title="Sincronização de Relógio" accent="yellow">

Diferentes nós têm relógios diferentes, dificultando ordenar eventos e manter consistência.

Sincronização de relógio é fundamental para sistemas distribuídos porque os nós têm relógios independentes que derivam em taxas diferentes. Sem tempo sincronizado, torna-se quase impossível ordenar eventos, manter causalidade ou implementar algoritmos baseados em tempo corretamente.

**Características:**

- Relógios derivam em taxas diferentes
- Não há noção global de "agora"
- Ordenação de eventos se torna ambígua
- Impacta timestamps e logs
- Crítico para algoritmos distribuídos

**Problemas Causados:**

- Ordenação incorreta de eventos em logs
- Condições de corrida em lógica baseada em tempo
- Expiração inconsistente de cache
- Falhas de lock distribuído
- Corrupção de trilha de auditoria

**Exemplos:**

- Transações bancárias: Transferência parece completar antes de começar devido ao skew de relógio, causando falhas de auditoria
- Log distribuído: Logs de erro aparecem fora de ordem entre serviços, tornando debug impossível
- Invalidação de cache: TTL expira em tempos diferentes em nós diferentes, causando dados obsoletos
- Gerenciamento de lease: Locks distribuídos expiram em tempos diferentes, levando a cenários split-brain

**Abordagens de Sincronização:**

- Network Time Protocol (NTP)
- Precision Time Protocol (PTP)
- Sincronização baseada em GPS
- Referências de relógio atômico
- API Google TrueTime

**Alternativas Lógicas:**

- Timestamps Lamport para causalidade
- Vector clocks para ordenação parcial
- Hybrid logical clocks (HLC)
- Ordenação baseada em eventos em vez de tempo
- Números de sequência baseados em consenso

</Card>

<Card emoji="💥" title="Falhas Parciais" accent="brand">

Algumas partes do sistema falham enquanto outras continuam funcionando, criando estados inconsistentes.

Falhas parciais são talvez o desafio mais insidioso em sistemas distribuídos. Diferente de falhas completas do sistema que são óbvias, falhas parciais criam cenários onde alguns componentes funcionam enquanto outros falham, levando a estados inconsistentes difíceis de detectar e lidar.

**Características:**

- Apenas subconjunto de componentes do sistema falha
- Difícil de detectar e diagnosticar
- Pode causar falhas em cascata
- Sistema parece parcialmente funcional
- Cria estado global inconsistente

**Tipos de Falha:**

- Fail-stop: Componente para completamente
- Fail-slow: Componente responde muito lentamente
- Byzantine: Componente se comporta arbitrariamente
- Omissão: Componente descarta algumas mensagens
- Comissão: Componente envia dados errados

**Exemplos:**

- Checkout e-commerce: Pagamento processado mas estoque não atualizado devido a falha do banco, ocorre overselling
- Sistema de email: Mensagem entregue para alguns destinatários mas não outros devido a falhas de servidor
- Redes sociais: Post visível para alguns usuários mas não outros devido a lag de replicação
- Armazenamento de arquivo: Dados escritos no primário mas replicação para backups falha, risco de perda de dados aumenta

**Desafios de Detecção:**

- Nenhum sinal claro de falha
- Timeouts são ambíguos
- Falhas de rede vs. nó não claras
- Corrupção silenciosa de dados possível
- Atualizações parciais de estado

**Estratégias de Tratamento:**

- Verificações de saúde abrangentes
- Padrão circuit breaker
- Degradação graciosa
- Transações de compensação
- Operações idempotentes

</Card>

<Card emoji="🔄" title="Consenso" accent="purple">

Fazer nós distribuídos concordarem com um único valor ou decisão na presença de falhas.

Consenso é o problema de fazer múltiplos nós distribuídos concordarem com um único valor, mesmo quando alguns nós podem falhar ou se comportar maliciosamente. Isso é fundamental para muitas operações de sistemas distribuídos como eleição de líder, gerenciamento de configuração e garantia de consistência.

**Características:**

- Todos os nós corretos devem concordar
- Deve lidar com falhas de nó
- Deve terminar em tempo finito
- Garantias de segurança e vivacidade
- Base para muitos protocolos distribuídos

**Variantes do Problema:**

- Tolerância a falhas bizantinas: Lidar com nós maliciosos
- Tolerância a falhas de crash: Lidar apenas com falhas de crash
- Eleição de líder: Escolher coordenador único
- Broadcast atômico: Ordenar todas as mensagens
- Replicação de máquina de estado: Manter réplicas sincronizadas

**Exemplos:**

- Cluster de banco: Nós devem concordar sobre quais transações commitar em que ordem
- Cluster Kubernetes: Nós devem concordar sobre quais pods estão rodando onde
- Blockchain: Mineradores devem concordar sobre o próximo bloco na cadeia
- Gerenciamento de configuração: Serviços devem concordar sobre versão atual de configuração

**Algoritmos:**

- Paxos: Consenso clássico com garantias fortes
- Raft: Alternativa mais simples ao Paxos
- PBFT: Consenso tolerante a falhas bizantinas
- Impossibilidade FLP: Limitações teóricas
- RAFT: Consenso baseado em líder para replicação de log

**Uso no Mundo Real:**

- Apache Zookeeper usa protocolo Zab
- etcd e Consul usam Raft
- Google Spanner usa Paxos
- Redes blockchain usam Proof of Work/Stake
- Protocolos de replicação de banco

</Card>

<Card emoji="📊" title="Gerenciamento de Estado" accent="green">

Manter controle do estado do sistema em múltiplos nós ao lidar com atualizações concorrentes.

Gerenciamento de estado em sistemas distribuídos envolve manter estado consistente entre múltiplos nós enquanto lida com atualizações concorrentes, falhas e partições de rede. Este desafio se torna exponencialmente mais complexo conforme o número de nós e a frequência de atualizações aumentam.

**Características:**

- Estado distribuído entre nós
- Atualizações concorrentes de múltiplas fontes
- Deve lidar com falhas de nó graciosamente
- Trade-offs consistência vs. performance
- Requer mecanismos de coordenação

**Desafios de Consistência:**

- Consistência read-after-write
- Consistência de leitura monotônica
- Consistência de sessão
- Garantias de consistência eventual
- Requisitos de consistência forte

**Exemplos:**

- Carrinho de compras: Usuário adiciona itens do app móvel enquanto simultaneamente do web, ambas atualizações devem ser preservadas
- Jogo multiplayer: Atualizações de posição do jogador de múltiplos clientes devem ser reconciliadas em tempo real
- Documento colaborativo: Múltiplos usuários editando mesmo documento simultaneamente
- Sistema de estoque: Múltiplos armazéns atualizando níveis de estoque concorrentemente

**Problemas de Concorrência:**

- Problema de atualizações perdidas
- Leituras sujas de dados não commitados
- Leituras não repetíveis
- Leituras fantasma em consultas de intervalo
- Conflitos write-write

**Padrões Arquiteturais:**

- Event sourcing: Armazenar eventos, não estado
- CQRS: Separar modelos de comando e consulta
- Padrão Saga: Gerenciar transações distribuídas
- Two-phase commit: Garantir atomicidade
- Transações baseadas em compensação

</Card>

<Card emoji="🚦" title="Condições de Corrida" accent="slate">

Múltiplos processos acessando recursos compartilhados simultaneamente, levando a resultados imprevisíveis.

Condições de corrida em sistemas distribuídos ocorrem quando múltiplos processos ou nós tentam acessar e modificar recursos compartilhados simultaneamente, levando a resultados imprevisíveis e frequentemente incorretos. Diferente de condições de corrida em máquina única, condições de corrida distribuídas são mais difíceis de detectar e debugar.

**Características:**

- Ordem de execução não determinística
- Contenção de recursos compartilhados
- Bugs dependentes de timing
- Difícil de reproduzir
- Pode causar corrupção de dados

**Cenários Comuns:**

- Operações check-then-act
- Ciclos read-modify-write
- Padrões double-checked locking
- Condições de corrida de inicialização
- Condições de corrida de limpeza

**Exemplos:**

- Conta bancária: Dois caixas eletrônicos saque simultaneamente, ambos verificam saldo (R$ 100), ambos permitem saque de R$ 60, conta fica negativa
- Reserva de passagem: Dois clientes reservam último assento simultaneamente, ambos recebem confirmação, avião oversold
- Incremento de contador: Múltiplos serviços incrementam contador global, valor final incorreto devido a atualizações perdidas
- Alocação de recursos: Dois processos alocam mesmos recursos de servidor, causando conflitos de recursos

**Complicações Distribuídas:**

- Atrasos de rede mascaram problemas de timing
- Falhas parciais durante operações
- Problemas de sincronização de relógio
- Efeitos de reordenação de mensagens
- Falhas de lock distribuído

**Técnicas de Prevenção:**

- Operações atômicas e Compare-And-Swap
- Mecanismos de locking distribuído
- Garantias de ordenação de mensagens
- Controle de concorrência otimista
- Estratégias de locking pessimista

</Card>

## As Falácias da Computação Distribuída

As Oito Falácias da Computação Distribuída, identificadas por Peter Deutsch e outros, representam equívocos comuns que desenvolvedores cometem ao projetar sistemas distribuídos. Compreender essas falácias é crucial para construir aplicações distribuídas robustas.

1. A rede é confiável
2. A latência é zero
3. A largura de banda é infinita
4. A rede é segura
5. A topologia não muda
6. Há um administrador
7. O custo de transporte é zero
8. A rede é homogênea

<Callout type="warning">

Essas suposições falsas levam a muitos problemas em sistemas distribuídos

</Callout>

## Estratégias Gerais de Mitigação

- Projetar para falha: Assumir que componentes vão falhar
- Implementar monitoramento abrangente e alertas
- Usar circuit breakers para prevenir falhas em cascata
- Construir capacidades de degradação graciosa
- Testar cenários de falha regularmente (chaos engineering)
- Implementar logging adequado e rastreamento distribuído
- Usar operações idempotentes quando possível
- Projetar para consistência eventual quando apropriado
$mdx$),
  ('theoretical-foundations/network-partitions', '/theoretical-foundations/network-partitions', 'theory', false, 7, NULL, true, 'Network Partitions & Failures', 'Partições de Rede e Falhas', $mdx$# Network Partitions & Failures

Understanding and handling network splits and node failures in distributed systems

<Callout type="neutral">

Network partitions are one of the most fundamental and challenging problems in distributed systems. When network failures prevent nodes from communicating, systems must make critical decisions about consistency versus availability. Understanding how to detect, prevent, and handle partitions is essential for building resilient distributed applications.

</Callout>

<Card title="What is a Network Partition?" accent="red">

A network partition occurs when the network between nodes fails, splitting the system into isolated groups that cannot communicate with each other.

Network partitions represent a failure mode where the distributed system becomes divided into isolated islands of nodes that can communicate internally but not across the partition boundary. This is particularly challenging because each partition may continue operating independently, potentially making conflicting decisions.

**Characteristics:**

- Communication between node groups is impossible
- Each partition can make independent decisions
- CAP theorem trade-offs become immediately relevant
- System state can diverge across partitions
- Recovery requires conflict resolution strategies

*Also known as a "split-brain" scenario, where different parts of the system may make independent decisions, potentially leading to inconsistency.*

</Card>

<Card title="Causes of Partitions" accent="yellow">

Network partitions can arise from various infrastructure and configuration issues that affect connectivity between distributed nodes.

**Common Causes:**

- Router or switch failures
- Cable cuts or damage
- ISP or datacenter outages
- Software bugs in network stack
- Misconfigured firewalls

**Detailed Causes:**

- Physical infrastructure failures: Cable cuts, router hardware failures, power outages affecting network equipment
- Software bugs: Network stack bugs, driver issues, routing protocol failures, DNS resolution problems
- Configuration errors: Firewall misconfigurations, routing table errors, security policy conflicts
- Overload conditions: Network congestion, DDoS attacks, resource exhaustion causing packet drops
- Environmental factors: Natural disasters, construction accidents, electromagnetic interference

</Card>

## Types of Failures

Different failure modes require different detection and handling strategies in distributed systems.

<Cards cols={3}>

<Card emoji="🔴" title="Fail-Stop" accent="green">

Node stops completely and other nodes can detect the failure

In fail-stop failures, a node completely ceases operation and stops responding to all requests. This is the easiest type of failure to detect and handle because the failure is clean and observable by other nodes.

**Characteristics:**

- Node stops responding completely
- Easy to detect with timeouts
- No risk of partial state corruption
- Clean failure semantics

**Examples:**

- Server power failure causing immediate shutdown
- Process crash due to out-of-memory condition
- Network interface failure making node unreachable
- Container or VM termination

</Card>

<Card emoji="🟡" title="Fail-Slow" accent="yellow">

Node becomes very slow but doesn't crash completely

Fail-slow failures are particularly insidious because the node continues to operate but with severely degraded performance. This can cause timeouts, cascading failures, and make it difficult to distinguish between network latency and node problems.

**Characteristics:**

- Node responds but very slowly
- Difficult to distinguish from network latency
- Can cause cascading performance issues
- May lead to resource exhaustion in other nodes

**Examples:**

- CPU overload causing request processing delays
- Memory pressure leading to excessive garbage collection
- Disk I/O bottlenecks slowing down operations
- Network congestion causing intermittent delays

</Card>

<Card emoji="🔥" title="Byzantine" accent="red">

Node behaves arbitrarily or maliciously

Byzantine failures represent the most complex failure mode where nodes may send conflicting, corrupted, or malicious messages. These failures require sophisticated consensus algorithms and are especially important in adversarial environments.

**Characteristics:**

- Node sends incorrect or conflicting messages
- May appear to work correctly to some nodes
- Requires majority agreement to handle
- Most difficult type of failure to detect and handle

**Examples:**

- Memory corruption causing incorrect computations
- Software bugs leading to inconsistent responses
- Malicious attacks attempting to compromise consensus
- Clock skew causing timestamp inconsistencies

</Card>

</Cards>

## Real-World Partition Scenarios

<Cards cols={2}>

<Card accent="purple">

AWS region isolation: Inter-region network failure isolates US-East from US-West, each region continues serving traffic independently

</Card>

<Card accent="purple">

Database cluster split: Master-slave replication breaks, slaves must decide whether to accept writes or remain read-only to prevent conflicts

</Card>

<Card accent="purple">

Microservices partition: Payment service loses connection to inventory service during checkout, must decide whether to process orders with stale inventory data

</Card>

<Card accent="purple">

CDN edge isolation: Internet routing issues isolate edge servers from origin, cached content becomes stale but users continue to be served

</Card>

<Card accent="purple">

Kubernetes cluster partition: Worker nodes lose connection to master, pods continue running but new deployments fail

</Card>

</Cards>

## Common Partition Scenarios

<Card title="Multi-Datacenter Partitions" accent="purple">

When datacenters lose connectivity, each must decide how to handle ongoing operations

**Strategies:**

- Designate primary datacenter for writes
- Switch to read-only mode in secondary datacenters
- Use consensus to elect new primary
- Implement conflict-free data structures

</Card>

<Card title="Service Mesh Partitions" accent="purple">

When services in a mesh lose connectivity to subsets of other services

**Strategies:**

- Circuit breaker pattern to fail fast
- Fallback to cached responses
- Graceful degradation of functionality
- Queue requests for later processing

</Card>

<Card title="Database Cluster Partitions" accent="purple">

When database nodes become isolated from each other

**Strategies:**

- Use quorum-based writes to maintain consistency
- Switch minority partitions to read-only mode
- Implement last-write-wins conflict resolution
- Use vector clocks for causality tracking

</Card>

## Handling Strategies

<Card title="Detection" accent="green">

Early and accurate detection of network partitions is crucial for implementing appropriate response strategies.

**Basic Detection:**

- Heartbeat mechanisms
- Timeout-based detection
- Gossip protocols
- External monitoring

**Challenges:**

- Distinguishing between network delays and actual partitions
- False positives due to temporary network congestion
- Setting appropriate timeout values for different scenarios
- Handling partial connectivity (some nodes reachable, others not)

**Detailed Detection Strategies:**

- Heartbeat mechanisms: Regular ping/pong messages between nodes to detect connectivity loss
- Timeout-based detection: Set reasonable timeouts to distinguish slow responses from failures
- Gossip protocols: Distributed failure detection where nodes share information about other nodes
- External monitoring: Third-party services to validate connectivity from multiple perspectives
- Application-level probes: Health checks specific to business logic functionality

</Card>

<Card title="Prevention" accent="brand">

While partitions cannot be completely prevented, their likelihood and impact can be significantly reduced through proper infrastructure design.

**Basic Prevention:**

- Redundant network paths
- Multiple datacenters
- Quality network equipment
- Regular maintenance

**Detailed Prevention Strategies:**

- Network redundancy: Multiple independent network paths, diverse ISPs, redundant routers and switches
- Geographic distribution: Multi-region deployments, availability zones, edge locations
- Infrastructure quality: Enterprise-grade networking equipment, proper capacity planning, regular hardware refresh
- Operational excellence: Scheduled maintenance windows, change management processes, monitoring and alerting
- Chaos engineering: Regularly testing partition scenarios to validate system behavior

</Card>

<Card title="Recovery" accent="purple">

When partitions heal, systems must carefully reconcile state and resolve any conflicts that occurred during the partition.

**Basic Recovery:**

- Automatic failover
- Data reconciliation
- Split-brain resolution
- Graceful degradation

**Detailed Recovery Strategies:**

- Conflict detection: Identify divergent state changes that occurred during the partition
- Merge strategies: Implement application-specific logic to resolve conflicts automatically
- Manual intervention: Provide tools for operators to resolve complex conflicts manually
- Compensation transactions: Implement undo operations for conflicting state changes
- Version vectors: Use logical timestamps to establish causality and conflict resolution order

</Card>

## Design Principles for Partition Tolerance

<Card title="Architectural Patterns" accent="slate">

**Basic Patterns:**

- Use consensus algorithms (Raft, Paxos)
- Implement quorum-based decisions
- Design for eventual consistency
- Use circuit breakers and bulkheads

**Detailed Patterns:**

- Consensus algorithms: Raft, Paxos, PBFT for maintaining agreement across partitions
- Quorum systems: Majority-based decision making to ensure consistency during partitions
- Event sourcing: Immutable event logs that can be merged when partitions heal
- CQRS: Separate read and write models to handle partition scenarios differently
- Saga pattern: Long-running transactions with compensation for distributed consistency

</Card>

<Card title="Operational Practices" accent="slate">

**Basic Practices:**

- Regular disaster recovery testing
- Monitoring and alerting systems
- Automated deployment and scaling
- Documentation and runbooks

**Detailed Practices:**

- Chaos engineering: Regularly induce partitions to test system behavior
- Game day exercises: Practice partition scenarios with entire teams
- Automated testing: Include partition testing in CI/CD pipelines
- Monitoring dashboards: Real-time visibility into partition detection and recovery
- Runbook procedures: Step-by-step guides for handling partition scenarios

</Card>

## Connection to CAP Theorem

Network partitions force immediate CAP theorem trade-offs between consistency and availability

<Cards cols={3}>

<Card accent="red">

Choose Consistency: Reject operations to maintain data consistency, sacrificing availability

</Card>

<Card accent="red">

Choose Availability: Continue operations with potentially stale data, sacrificing consistency

</Card>

<Card accent="red">

Hybrid approach: Different services may make different trade-offs based on business requirements

</Card>

</Cards>

## Best Practices

- Design for partition tolerance from the beginning
- Implement comprehensive monitoring and alerting
- Test partition scenarios regularly through chaos engineering
- Document decision-making processes for partition handling
- Train operations teams on partition response procedures
- Use proven consensus algorithms rather than building custom solutions
- Implement graceful degradation rather than complete service failure
- Monitor business metrics during partition scenarios
$mdx$, $mdx$# Partições de Rede e Falhas

Compreendendo e lidando com divisões de rede e falhas de nós em sistemas distribuídos

<Callout type="neutral">

Partições de rede são um dos problemas mais fundamentais e desafiadores em sistemas distribuídos. Quando falhas de rede impedem a comunicação entre nós, sistemas devem tomar decisões críticas sobre consistência versus disponibilidade. Compreender como detectar, prevenir e lidar com partições é essencial para construir aplicações distribuídas resilientes.

</Callout>

<Card title="O que é uma Partição de Rede?" accent="red">

Uma partição de rede ocorre quando a rede entre nós falha, dividindo o sistema em grupos isolados que não conseguem se comunicar.

Partições de rede representam um modo de falha onde o sistema distribuído se torna dividido em ilhas isoladas de nós que podem se comunicar internamente mas não através da fronteira da partição. Isso é particularmente desafiador porque cada partição pode continuar operando independentemente, potencialmente tomando decisões conflitantes.

**Características:**

- Comunicação entre grupos de nós é impossível
- Cada partição pode tomar decisões independentes
- Trade-offs do teorema CAP se tornam imediatamente relevantes
- Estado do sistema pode divergir entre partições
- Recuperação requer estratégias de resolução de conflitos

*Também conhecido como cenário "split-brain", onde diferentes partes do sistema podem tomar decisões independentes, potencialmente levando à inconsistência.*

</Card>

<Card title="Causas das Partições" accent="yellow">

Partições de rede podem surgir de várias questões de infraestrutura e configuração que afetam a conectividade entre nós distribuídos.

**Common Causes:**

- Falhas de roteador ou switch
- Cortes ou danos em cabos
- Interrupções de ISP ou datacenter
- Bugs de software na pilha de rede
- Firewalls mal configurados

**Causas Detalhadas:**

- Falhas de infraestrutura física: Cortes de cabo, falhas de hardware de roteador, quedas de energia afetando equipamentos de rede
- Bugs de software: Bugs na pilha de rede, problemas de driver, falhas de protocolo de roteamento, problemas de resolução DNS
- Erros de configuração: Configurações incorretas de firewall, erros de tabela de roteamento, conflitos de política de segurança
- Condições de sobrecarga: Congestionamento de rede, ataques DDoS, esgotamento de recursos causando perda de pacotes
- Fatores ambientais: Desastres naturais, acidentes de construção, interferência eletromagnética

</Card>

## Tipos de Falhas

Diferentes modos de falha requerem diferentes estratégias de detecção e tratamento em sistemas distribuídos.

<Cards cols={3}>

<Card emoji="🔴" title="Fail-Stop" accent="green">

Nó para completamente e outros nós podem detectar a falha

Em falhas fail-stop, um nó cessa completamente a operação e para de responder a todas as solicitações. Este é o tipo mais fácil de falha para detectar e lidar porque a falha é limpa e observável por outros nós.

**Características:**

- Nó para de responder completamente
- Fácil de detectar com timeouts
- Sem risco de corrupção parcial de estado
- Semânticas de falha limpas

**Exemplos:**

- Falha de energia do servidor causando desligamento imediato
- Crash de processo devido a condição de falta de memória
- Falha de interface de rede tornando nó inacessível
- Terminação de container ou VM

</Card>

<Card emoji="🟡" title="Fail-Slow" accent="yellow">

Nó fica muito lento mas não falha completamente

Falhas fail-slow são particularmente insidiosas porque o nó continua a operar mas com performance severamente degradada. Isso pode causar timeouts, falhas em cascata e tornar difícil distinguir entre latência de rede e problemas do nó.

**Características:**

- Nó responde mas muito lentamente
- Difícil de distinguir de latência de rede
- Pode causar problemas de performance em cascata
- Pode levar ao esgotamento de recursos em outros nós

**Exemplos:**

- Sobrecarga de CPU causando atrasos no processamento de requisições
- Pressão de memória levando a coleta de lixo excessiva
- Gargalos de I/O de disco retardando operações
- Congestionamento de rede causando atrasos intermitentes

</Card>

<Card emoji="🔥" title="Bizantina" accent="red">

Nó se comporta arbitrariamente ou maliciosamente

Falhas bizantinas representam o modo de falha mais complexo onde nós podem enviar mensagens conflitantes, corrompidas ou maliciosas. Essas falhas requerem algoritmos de consenso sofisticados e são especialmente importantes em ambientes adversários.

**Características:**

- Nó envia mensagens incorretas ou conflitantes
- Pode parecer funcionar corretamente para alguns nós
- Requer acordo de maioria para lidar
- Tipo mais difícil de falha para detectar e lidar

**Exemplos:**

- Corrupção de memória causando computações incorretas
- Bugs de software levando a respostas inconsistentes
- Ataques maliciosos tentando comprometer consenso
- Skew de relógio causando inconsistências de timestamp

</Card>

</Cards>

## Cenários Reais de Partição

<Cards cols={2}>

<Card accent="purple">

Isolamento de região AWS: Falha de rede inter-regional isola US-East de US-West, cada região continua servindo tráfego independentemente

</Card>

<Card accent="purple">

Divisão de cluster de banco: Replicação master-slave quebra, slaves devem decidir se aceitam escritas ou permanecem somente leitura para prevenir conflitos

</Card>

<Card accent="purple">

Partição de microserviços: Serviço de pagamento perde conexão com serviço de estoque durante checkout, deve decidir se processa pedidos com dados de estoque obsoletos

</Card>

<Card accent="purple">

Isolamento de edge CDN: Problemas de roteamento de internet isolam servidores edge da origem, conteúdo em cache fica obsoleto mas usuários continuam sendo servidos

</Card>

<Card accent="purple">

Partição de cluster Kubernetes: Nós worker perdem conexão com master, pods continuam rodando mas novos deployments falham

</Card>

</Cards>

## Cenários Comuns de Partição

<Card title="Partições Multi-Datacenter" accent="purple">

Quando datacenters perdem conectividade, cada um deve decidir como lidar com operações em andamento

**Estratégias:**

- Designar datacenter primário para escritas
- Mudar para modo somente leitura em datacenters secundários
- Usar consenso para eleger novo primário
- Implementar estruturas de dados livres de conflito

</Card>

<Card title="Partições de Service Mesh" accent="purple">

Quando serviços em uma mesh perdem conectividade com subconjuntos de outros serviços

**Estratégias:**

- Padrão circuit breaker para falhar rapidamente
- Fallback para respostas em cache
- Degradação graciosa de funcionalidade
- Enfileirar requisições para processamento posterior

</Card>

<Card title="Partições de Cluster de Banco" accent="purple">

Quando nós de banco se tornam isolados uns dos outros

**Estratégias:**

- Usar escritas baseadas em quorum para manter consistência
- Mudar partições minoritárias para modo somente leitura
- Implementar resolução de conflito last-write-wins
- Usar vector clocks para rastreamento de causalidade

</Card>

## Estratégias de Tratamento

<Card title="Detecção" accent="green">

Detecção precoce e precisa de partições de rede é crucial para implementar estratégias de resposta apropriadas.

**Basic Detection:**

- Mecanismos de heartbeat
- Detecção baseada em timeout
- Protocolos de gossip
- Monitoramento externo

**Desafios:**

- Distinguir entre atrasos de rede e partições reais
- Falsos positivos devido a congestionamento temporário de rede
- Definir valores de timeout apropriados para diferentes cenários
- Lidar com conectividade parcial (alguns nós alcançáveis, outros não)

**Detailed Detection Strategies:**

- Mecanismos de heartbeat: Mensagens ping/pong regulares entre nós para detectar perda de conectividade
- Detecção baseada em timeout: Definir timeouts razoáveis para distinguir respostas lentas de falhas
- Protocolos de gossip: Detecção de falhas distribuída onde nós compartilham informações sobre outros nós
- Monitoramento externo: Serviços terceirizados para validar conectividade de múltiplas perspectivas
- Sondas no nível da aplicação: Verificações de saúde específicas para funcionalidade de lógica de negócio

</Card>

<Card title="Prevenção" accent="brand">

Embora partições não possam ser completamente prevenidas, sua probabilidade e impacto podem ser significativamente reduzidos através de design apropriado de infraestrutura.

**Basic Prevention:**

- Caminhos de rede redundantes
- Múltiplos datacenters
- Equipamentos de rede de qualidade
- Manutenção regular

**Detailed Prevention Strategies:**

- Redundância de rede: Múltiplos caminhos de rede independentes, ISPs diversos, roteadores e switches redundantes
- Distribuição geográfica: Deployments multi-região, zonas de disponibilidade, localizações edge
- Qualidade de infraestrutura: Equipamentos de rede enterprise, planejamento adequado de capacidade, refresh regular de hardware
- Excelência operacional: Janelas de manutenção programadas, processos de gerenciamento de mudanças, monitoramento e alertas
- Chaos engineering: Testar regularmente cenários de partição para validar comportamento do sistema

</Card>

<Card title="Recuperação" accent="purple">

Quando partições se curam, sistemas devem cuidadosamente reconciliar estado e resolver quaisquer conflitos que ocorreram durante a partição.

**Basic Recovery:**

- Failover automático
- Reconciliação de dados
- Resolução de split-brain
- Degradação graceful

**Detailed Recovery Strategies:**

- Detecção de conflitos: Identificar mudanças de estado divergentes que ocorreram durante a partição
- Estratégias de merge: Implementar lógica específica da aplicação para resolver conflitos automaticamente
- Intervenção manual: Fornecer ferramentas para operadores resolverem conflitos complexos manualmente
- Transações de compensação: Implementar operações de desfazer para mudanças de estado conflitantes
- Vetores de versão: Usar timestamps lógicos para estabelecer causalidade e ordem de resolução de conflitos

</Card>

## Princípios de Design para Tolerância a Partições

<Card title="Padrões Arquiteturais" accent="slate">

**Basic Patterns:**

- Usar algoritmos de consenso (Raft, Paxos)
- Implementar decisões baseadas em quorum
- Projetar para consistência eventual
- Usar circuit breakers e bulkheads

**Padrões Detalhados:**

- Algoritmos de consenso: Raft, Paxos, PBFT para manter acordo através de partições
- Sistemas de quorum: Tomada de decisão baseada em maioria para garantir consistência durante partições
- Event sourcing: Logs de eventos imutáveis que podem ser mesclados quando partições se curam
- CQRS: Separar modelos de leitura e escrita para lidar com cenários de partição diferentemente
- Padrão Saga: Transações de longa duração com compensação para consistência distribuída

</Card>

<Card title="Práticas Operacionais" accent="slate">

**Basic Practices:**

- Testes regulares de recuperação de desastres
- Sistemas de monitoramento e alertas
- Implantação e escalonamento automatizados
- Documentação e runbooks

**Práticas Detalhadas:**

- Chaos engineering: Induzir partições regularmente para testar comportamento do sistema
- Exercícios de game day: Praticar cenários de partição com equipes inteiras
- Testes automatizados: Incluir testes de partição em pipelines CI/CD
- Dashboards de monitoramento: Visibilidade em tempo real sobre detecção e recuperação de partições
- Procedimentos de runbook: Guias passo-a-passo para lidar com cenários de partição

</Card>

## Conexão com Teorema CAP

Partições de rede forçam trade-offs imediatos do teorema CAP entre consistência e disponibilidade

<Cards cols={3}>

<Card accent="red">

Escolher Consistência: Rejeitar operações para manter consistência de dados, sacrificando disponibilidade

</Card>

<Card accent="red">

Escolher Disponibilidade: Continuar operações com dados potencialmente obsoletos, sacrificando consistência

</Card>

<Card accent="red">

Abordagem híbrida: Diferentes serviços podem fazer diferentes trade-offs baseados em requisitos de negócio

</Card>

</Cards>

## Melhores Práticas

- Projetar para tolerância a partições desde o início
- Implementar monitoramento e alertas abrangentes
- Testar cenários de partição regularmente através de chaos engineering
- Documentar processos de tomada de decisão para tratamento de partições
- Treinar equipes de operações em procedimentos de resposta a partições
- Usar algoritmos de consenso comprovados ao invés de construir soluções customizadas
- Implementar degradação graciosa ao invés de falha completa do serviço
- Monitorar métricas de negócio durante cenários de partição
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id", "requires_subscription" = EXCLUDED."requires_subscription", "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key", "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en", "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en", "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
