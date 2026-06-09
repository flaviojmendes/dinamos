# Dinamos — Distributed Systems, hands-on

> A free, hands-on platform for mastering distributed systems: interactive
> simulators (cache, circuit breaker, load balancer, sharding, consensus, and
> more), real-world case studies, and a structured learning roadmap.

<!-- Project status -->
[![CI](https://github.com/flaviojmendes/distributed-systems/actions/workflows/ci.yml/badge.svg)](https://github.com/flaviojmendes/distributed-systems/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/flaviojmendes/distributed-systems/branch/main/graph/badge.svg)](https://codecov.io/gh/flaviojmendes/distributed-systems)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Last commit](https://img.shields.io/github/last-commit/flaviojmendes/distributed-systems)](https://github.com/flaviojmendes/distributed-systems/commits/main)
[![Open issues](https://img.shields.io/github/issues/flaviojmendes/distributed-systems)](https://github.com/flaviojmendes/distributed-systems/issues)
[![GitHub stars](https://img.shields.io/github/stars/flaviojmendes/distributed-systems?style=social)](https://github.com/flaviojmendes/distributed-systems/stargazers)

<!-- Built with -->
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)

[English](#english) · [Português](#português)

---

## English

### Overview

Dinamos is a single-page web app backed by a small HTTP API. Instead of
describing distributed-systems behavior in prose, it lets you **run** it:
live telemetry, request flows, failure injection, and an interactive system
editor you can build and stress-test.

### Tech stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router |
| Content      | MDX (authored pages) + DB-driven content |
| API          | [Hono](https://hono.dev) (runs as a Vercel serverless function in prod, a Node server in dev) |
| Database     | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team) |
| Auth         | Firebase Authentication (Firebase Admin on the server) |
| Integrations | OpenAI (challenge feedback / transcription), Resend (email), Stripe (optional billing) |
| Tests        | Vitest |
| Hosting      | Vercel |

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ and npm
- A PostgreSQL database (local or hosted, e.g. Supabase/Neon)
- A [Firebase](https://firebase.google.com/) project (for authentication)

The following are **optional** — leave the related env vars empty to disable
the feature locally: OpenAI, Resend, and Stripe.

### Getting started

```bash
# 1. Clone
git clone https://github.com/flaviojmendes/distributed-systems.git
cd distributed-systems

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then fill in the values in .env (see comments in the file)
```

### Running locally

The frontend and the API run as two processes:

```bash
# Terminal 1 — API (http://localhost:8787)
npm run dev:api

# Terminal 2 — frontend (http://localhost:5173), proxied to the local API
API_PROXY_TARGET=http://localhost:8787 npm run dev
```

If you omit `API_PROXY_TARGET`, the Vite dev server proxies `/api` to the
deployed backend instead of your local one.

### Database

Schema is managed with Drizzle. Common commands:

```bash
npm run db:push          # push the current schema to the database
npm run db:generate      # generate a new migration from schema changes
npm run db:migrate       # apply migrations
npm run db:seed-content  # seed module/page content
```

### Tests & type-checking

```bash
npm test            # run the test suite once
npm run test:watch  # watch mode
npm run typecheck   # type-check frontend + API
```

### Build

```bash
npm run build       # type-check + production build into dist/
npm run preview     # preview the production build locally
```

### Project structure

```
api/                 Hono API: routes, middleware, db (Drizzle schema + migrations), lib
public/              Static assets and policy pages
src/
  components/        Feature components + interactive simulators
  app/               App shell: pages, contexts, admin area
  config/            Registries (content, simulators, i18n, firebase)
  content/           MDX authoring (see src/content/AUTHORING.md)
  contexts/          React contexts (auth, theme, content)
  utils/, hooks/     Shared helpers
```

### Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md)
(English) or [`CONTRIBUTING.pt-BR.md`](./CONTRIBUTING.pt-BR.md) (Portuguese)
and our [Code of Conduct](./CODE_OF_CONDUCT.md) before opening an issue or PR.

### License

Released under the [MIT License](./LICENSE).

---

## Português

### Visão geral

Dinamos é uma plataforma gratuita e prática para dominar sistemas distribuídos:
simuladores interativos (cache, circuit breaker, balanceador de carga, sharding,
consenso e mais), estudos de caso reais e um roteiro de aprendizado estruturado.
Em vez de descrever o comportamento dos sistemas em texto, aqui você **executa**
o sistema.

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+ e npm
- Um banco PostgreSQL (local ou hospedado, ex.: Supabase/Neon)
- Um projeto [Firebase](https://firebase.google.com/) (para autenticação)

OpenAI, Resend e Stripe são **opcionais** — deixe as variáveis de ambiente
correspondentes vazias para desabilitar localmente.

### Começando

```bash
git clone https://github.com/flaviojmendes/distributed-systems.git
cd distributed-systems
npm install
cp .env.example .env   # preencha os valores em .env
```

### Rodando localmente

```bash
# Terminal 1 — API (http://localhost:8787)
npm run dev:api

# Terminal 2 — frontend (http://localhost:5173)
API_PROXY_TARGET=http://localhost:8787 npm run dev
```

### Banco de dados

```bash
npm run db:push          # aplica o schema atual no banco
npm run db:generate      # gera uma migration a partir das mudanças de schema
npm run db:migrate       # aplica as migrations
npm run db:seed-content  # popula o conteúdo (módulos/páginas)
```

### Testes e verificação de tipos

```bash
npm test            # roda a suíte de testes
npm run typecheck   # verifica os tipos (frontend + API)
```

### Contribuindo

Contribuições são bem-vindas! Leia o [`CONTRIBUTING.pt-BR.md`](./CONTRIBUTING.pt-BR.md)
e o nosso [Código de Conduta](./CODE_OF_CONDUCT.md) antes de abrir uma issue ou PR.

### Licença

Distribuído sob a [Licença MIT](./LICENSE).
