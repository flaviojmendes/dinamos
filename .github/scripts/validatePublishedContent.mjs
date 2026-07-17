#!/usr/bin/env node
/**
 * Post-export guard for publish-static-content workflow.
 * Ensures manifest structure is sane and no connection strings leak into public JSON.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT_ROOT = 'public/content';
const MANIFEST_PATH = join(CONTENT_ROOT, 'manifest.json');
const HASH_DIR_PATTERN = /^[a-f0-9]{16}$/;

const SECRET_PATTERNS = [
  /postgres(?:ql)?:\/\//i,
  /\bDATABASE_URL\b/,
  /\bneon\.tech\b/i,
  /\bsk_live_[0-9a-zA-Z]+\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
];

function collectFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.staging-')) continue;
      collectFiles(fullPath, acc);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function assertNoSecrets(filePath, content) {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      throw new Error(`Possible secret pattern in ${filePath}`);
    }
  }
}

function main() {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing ${MANIFEST_PATH}`);
  }

  const manifestRaw = readFileSync(MANIFEST_PATH, 'utf8');
  assertNoSecrets(MANIFEST_PATH, manifestRaw);

  let manifest;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${MANIFEST_PATH}: ${error.message}`);
  }

  if (manifest.schemaVersion < 1) {
    throw new Error('manifest.schemaVersion must be >= 1');
  }
  if (!HASH_DIR_PATTERN.test(manifest.contentHash ?? '')) {
    throw new Error('manifest.contentHash must be a 16-char hex hash');
  }
  if (!Array.isArray(manifest.modules) || !Array.isArray(manifest.pages)) {
    throw new Error('manifest.modules and manifest.pages must be arrays');
  }

  const versionDir = join(CONTENT_ROOT, manifest.contentHash);
  if (!existsSync(versionDir)) {
    throw new Error(`Missing version directory public/content/${manifest.contentHash}`);
  }

  for (const page of manifest.pages) {
    const prefix = `/content/${manifest.contentHash}/pages/`;
    if (!String(page.bodyEnUrl ?? '').startsWith(prefix)) {
      throw new Error(`Page ${page.slug} bodyEnUrl must reference ${manifest.contentHash}`);
    }
    if (!String(page.bodyPtUrl ?? '').startsWith(prefix)) {
      throw new Error(`Page ${page.slug} bodyPtUrl must reference ${manifest.contentHash}`);
    }
  }

  for (const filePath of collectFiles(CONTENT_ROOT)) {
    const content = readFileSync(filePath, 'utf8');
    assertNoSecrets(filePath, content);
  }

  console.log(
    `[validatePublishedContent] OK — hash=${manifest.contentHash}, ` +
      `modules=${manifest.modules.length}, pages=${manifest.pages.length}`
  );
}

main();
