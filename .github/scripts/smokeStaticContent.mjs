#!/usr/bin/env node
/**
 * Local static-file contract smoke test for published lesson snapshots.
 * Validates manifest + body JSON for a nested slug without a running server.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT_ROOT = 'public/content';
const MANIFEST_PATH = join(CONTENT_ROOT, 'manifest.json');
const LESSON_PATH = '/theoretical-foundations/distributed-challenges';
const LESSON_SLUG = 'theoretical-foundations/distributed-challenges';

const BODY_FIELDS = ['slug', 'path', 'lang', 'title', 'simulator_key', 'body'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function assertBodyContract(filePath, expectedLang) {
  assert(existsSync(filePath), `Missing body file: ${filePath}`);
  const payload = loadJson(filePath);
  for (const field of BODY_FIELDS) {
    assert(Object.prototype.hasOwnProperty.call(payload, field), `${filePath} missing ${field}`);
  }
  assert(payload.slug === LESSON_SLUG, `${filePath} slug mismatch`);
  assert(payload.path === LESSON_PATH, `${filePath} path mismatch`);
  assert(payload.lang === expectedLang, `${filePath} lang mismatch`);
  assert(typeof payload.body === 'string' && payload.body.trim().length > 0, `${filePath} body empty`);
  return payload;
}

function main() {
  assert(existsSync(MANIFEST_PATH), `Missing ${MANIFEST_PATH}`);
  const manifest = loadJson(MANIFEST_PATH);
  assert(manifest.schemaVersion >= 1, 'manifest.schemaVersion must be >= 1');
  assert(typeof manifest.contentHash === 'string' && manifest.contentHash.length === 16, 'invalid contentHash');

  const page = manifest.pages.find((entry) => entry.path === LESSON_PATH);
  assert(page, `manifest.pages must include ${LESSON_PATH}`);
  assert(page.slug === LESSON_SLUG, 'manifest page slug mismatch');
  assert(page.hasEn === true, 'distributed-challenges must have EN');
  assert(page.hasPt === true, 'distributed-challenges must have PT');

  const prefix = `/content/${manifest.contentHash}/pages/`;
  assert(String(page.bodyEnUrl).startsWith(prefix), 'bodyEnUrl must reference current hash');
  assert(String(page.bodyPtUrl).startsWith(prefix), 'bodyPtUrl must reference current hash');

  const enPath = join(CONTENT_ROOT, page.bodyEnUrl.replace(/^\/content\//, ''));
  const ptPath = join(CONTENT_ROOT, page.bodyPtUrl.replace(/^\/content\//, ''));

  const enBody = assertBodyContract(enPath, 'en');
  const ptBody = assertBodyContract(ptPath, 'pt');

  assert(enBody.title?.length > 0, 'EN title must be present');
  assert(ptBody.title?.length > 0, 'PT title must be present');

  console.log(
    `[smokeStaticContent] OK — ${LESSON_SLUG} ` +
      `(hash=${manifest.contentHash}, en=${enBody.body.length} chars, pt=${ptBody.body.length} chars)`
  );
}

main();
