# Contribuindo com o Dinamos

Obrigado pelo interesse em contribuir! Este projeto é uma plataforma prática
para aprender sistemas distribuídos, e contribuições de todos os tipos são
bem-vindas — correções de bugs, novos simuladores, conteúdo, traduções,
documentação e ideias.

> 🇬🇧 English version: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

Ao participar, você concorda em seguir o nosso
[Código de Conduta](./CODE_OF_CONDUCT.md).

## Formas de contribuir

- **Reportar bugs** — abra uma issue com passos claros para reproduzir.
- **Sugerir funcionalidades** — abra uma issue descrevendo o problema e a ideia.
- **Melhorar o conteúdo** — corrija ou amplie o material de aprendizado e os
  estudos de caso.
- **Adicionar simuladores** — crie um novo simulador interativo de sistemas
  distribuídos.
- **Melhorar docs / traduções** — o projeto suporta inglês e português.

## Configurando o ambiente

Veja o [README](./README.md) para instruções completas. Em resumo:

```bash
git clone https://github.com/flaviojmendes/distributed-systems.git
cd distributed-systems
npm install
cp .env.example .env   # preencha os seus valores
```

Rodando localmente:

```bash
npm run dev:api                                   # API em :8787
API_PROXY_TARGET=http://localhost:8787 npm run dev # frontend em :5173
```

## Fluxo de desenvolvimento

1. **Faça um fork** do repositório e crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/descricao-curta
   ```
   Use um prefixo descritivo: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`.
2. Faça suas mudanças em commits pequenos e focados.
3. Garanta que o build está saudável antes de enviar:
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```
4. Envie a sua branch e abra um Pull Request para a `main`.

## Diretrizes de Pull Request

- Mantenha o PR focado — uma mudança lógica por PR é muito mais fácil de revisar.
- Descreva **o que** mudou e **por quê**. Referencie a issue relacionada
  (ex.: `Closes #123`).
- Inclua capturas de tela ou um vídeo curto para mudanças de interface.
- Garanta que a verificação de tipos, os testes e o build de produção passam.
- Atualize a documentação (README, `.env.example`, docs de conteúdo) quando
  relevante.

## Mensagens de commit

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona simulador de consistent hashing
fix: evita crash quando o corpo da anotação está vazio
docs: esclarece a configuração da API local
```

## Estilo de código

- **TypeScript** em todo o projeto; prefira tipos explícitos nas fronteiras dos
  módulos.
- **React** com componentes de função e hooks; mantenha os componentes focados.
- **Tailwind CSS** para estilização — siga a linguagem de design "tática"
  existente (veja [`PRODUCT.md`](./PRODUCT.md) para os princípios de design).
- Siga a formatação do código ao redor. Evite reformatações não relacionadas.
- Não adicione comentários que apenas repetem o código; comente a intenção e os
  trade-offs.

## Segurança e segredos

- **Nunca faça commit de segredos.** `.env`, `.env.*` e certificados estão no
  `.gitignore`. Sempre comece a partir do `.env.example`.
- Se encontrar uma falha de segurança, **não** abra uma issue pública —
  entre em contato com o mantenedor de forma privada primeiro.

## Criando conteúdo

As páginas de aprendizado são escritas em MDX. Veja
[`src/content/AUTHORING.md`](./src/content/AUTHORING.md) para as convenções.

## Dúvidas

Abra uma [issue no GitHub](https://github.com/flaviojmendes/distributed-systems/issues)
com a label `question`. Obrigado por ajudar a melhorar o Dinamos! 🚀
