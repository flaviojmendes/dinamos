#!/usr/bin/env bash
# Arena Playwright smoke — requires a normal shell (browser subprocesses fail in sandboxes).
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -d dist ]]; then
  npm run vercel-build
fi

npm run test:e2e:install
npm run test:e2e
