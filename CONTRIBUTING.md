# Contributing to Dinamos

Thanks for your interest in contributing! This project is a hands-on platform
for learning distributed systems, and contributions of all kinds are welcome —
bug fixes, new simulators, content, translations, docs, and ideas.

> 🇧🇷 Versão em português: [`CONTRIBUTING.pt-BR.md`](./CONTRIBUTING.pt-BR.md)

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report bugs** — open an issue with clear steps to reproduce.
- **Suggest features** — open an issue describing the problem and your idea.
- **Improve content** — fix or expand the learning material and case studies.
- **Add simulators** — build a new interactive distributed-systems simulator.
- **Improve docs / translations** — the project supports English and Portuguese.

## Getting set up

See the [README](./README.md) for full setup instructions. In short:

```bash
git clone https://github.com/flaviojmendes/dinamos.git
cd dinamos
npm install
cp .env.example .env   # fill in your values
```

Run the app locally:

```bash
npm run dev:api                                   # API on :8787
API_PROXY_TARGET=http://localhost:8787 npm run dev # frontend on :5173
```

## Development workflow

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/short-description
   ```
   Use a descriptive prefix: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`.
2. Make your changes in small, focused commits.
3. Keep the build green before pushing:
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```
4. Push your branch and open a Pull Request against `main`.

## Pull request guidelines

- Keep PRs focused — one logical change per PR is much easier to review.
- Describe **what** changed and **why**. Link any related issue (e.g. `Closes #123`).
- Include screenshots or a short clip for UI changes.
- Make sure type-checking, tests, and the production build all pass.
- Update documentation (README, `.env.example`, content docs) when relevant.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add consistent hashing simulator
fix: prevent crash when annotation body is empty
docs: clarify local API setup
```

## Coding style

- **TypeScript** throughout; prefer explicit types at module boundaries.
- **React** function components and hooks; keep components focused.
- **Tailwind CSS** for styling — follow the existing tactical design language
  (see [`PRODUCT.md`](./PRODUCT.md) for the design principles).
- Match the formatting of surrounding code. Avoid unrelated reformatting.
- Don't add comments that merely restate the code; comment intent and trade-offs.

## Security & secrets

- **Never commit secrets.** `.env`, `.env.*`, and certificates are gitignored.
  Always start from `.env.example`.
- If you find a security issue, please **do not** open a public issue —
  contact the maintainer privately first.

## Authoring content

Learning pages are authored in MDX. See
[`src/content/AUTHORING.md`](./src/content/AUTHORING.md) for the conventions.

## Questions

Open a [GitHub issue](https://github.com/flaviojmendes/dinamos/issues)
with the `question` label. Thank you for helping make Dinamos better! 🚀
