#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="public/content"

changes="$(git status --porcelain -- "${CONTENT_DIR}")"
if [[ -z "${changes}" ]]; then
  echo "No content changes detected — snapshot already matches main; skipping commit and push."
  exit 0
fi

if git diff --name-only -- "${CONTENT_DIR}" | grep -qv '^public/content/'; then
  echo "Unexpected paths outside ${CONTENT_DIR}:"
  git diff --name-only
  exit 1
fi

if git ls-files --others --exclude-standard -- "${CONTENT_DIR}" | grep -qv '^public/content/'; then
  echo "Unexpected untracked paths outside ${CONTENT_DIR}:"
  git ls-files --others --exclude-standard
  exit 1
fi

content_hash="$(node -e "console.log(JSON.parse(require('node:fs').readFileSync('${CONTENT_DIR}/manifest.json','utf8')).contentHash)")"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

git add -- "${CONTENT_DIR}/"

staged="$(git diff --cached --name-only)"
if [[ -z "${staged}" ]]; then
  echo "No staged content changes after git add — skipping commit and push."
  exit 0
fi

if echo "${staged}" | grep -qv '^public/content/'; then
  echo "Refusing to commit files outside ${CONTENT_DIR}:"
  echo "${staged}"
  exit 1
fi

git commit -m "chore(content): publish static snapshot ${content_hash}"
git push origin HEAD:main

echo "Published static snapshot ${content_hash} to main."
