#!/usr/bin/env node
/**
 * Focused workflow contract checks (run via `node .github/scripts/validateWorkflows.mjs`).
 */
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');
const workflowsDir = join(repoRoot, '.github/workflows');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readWorkflow(name) {
  return readFileSync(join(workflowsDir, name), 'utf8');
}

function assertValidYamlStructure(contents, fileName) {
  assert(contents.trim().length > 0, `${fileName} should not be empty`);
  assert(/^name:\s/m.test(contents), `${fileName} should declare a workflow name`);
  assert(/^on:\s/m.test(contents), `${fileName} should declare triggers`);
}

function checkPublishWorkflow() {
  const yaml = readWorkflow('publish-static-content.yml');
  assertValidYamlStructure(yaml, 'publish-static-content.yml');
  assert(yaml.includes('workflow_dispatch'), 'publish workflow must be manual');
  assert(yaml.includes('contents: write'), 'publish workflow needs contents: write');
  assert(yaml.includes('group: publish-static-content'), 'publish workflow needs concurrency group');
  assert(yaml.includes('node-version: 22'), 'publish workflow must match CI Node version');
  assert(yaml.includes('environment: production'), 'publish workflow must use production environment');
  assert(yaml.includes('npm run content:export-static'), 'publish workflow must call content:export-static');
  assert(!yaml.includes('db:push'), 'publish workflow must not run db:push');
  const secretDbUrlMatches = yaml.match(/DATABASE_URL:\s*\$\{\{\s*secrets\.DATABASE_URL\s*\}\}/g) ?? [];
  assert(secretDbUrlMatches.length === 1, 'DATABASE_URL secret must be referenced exactly once');
}

function checkRecoveryWorkflow() {
  const yaml = readWorkflow('release-content.yml');
  assertValidYamlStructure(yaml, 'release-content.yml');
  assert(yaml.includes('confirm_recovery'), 'recovery workflow must require explicit confirmation');
  assert(yaml.includes('Require explicit confirmation'), 'recovery workflow must guard unchecked runs');
  assert(yaml.includes('npm run release:content'), 'recovery workflow must run release:content');
  assert(!yaml.includes('db:push'), 'recovery workflow must not include db:push');
  assert(!yaml.includes('run_db_push'), 'recovery workflow must remove run_db_push input');
}

function checkValidatorScript() {
  const root = mkdtempSync(join(tmpdir(), 'content-validate-'));
  const prevCwd = process.cwd();
  try {
    const contentRoot = join(root, 'public/content');
    const hash = '0123456789abcdef';
    mkdirSync(join(contentRoot, hash, 'pages'), { recursive: true });

    const manifest = {
      schemaVersion: 1,
      contentHash: hash,
      generatedAt: '2026-01-01T00:00:00.000Z',
      modules: [{ id: 'theory', label: 'Theory', tier: 'FOUNDATIONAL', base: '/theory', orderIndex: 1 }],
      pages: [
        {
          slug: 'theory/intro',
          path: '/theory/intro',
          moduleId: 'theory',
          orderIndex: 1,
          simulatorKey: null,
          titleEn: 'Intro',
          titlePt: 'Intro',
          hasEn: true,
          hasPt: true,
          bodyEnUrl: `/content/${hash}/pages/en-theory-intro.json`,
          bodyPtUrl: `/content/${hash}/pages/pt-theory-intro.json`,
        },
      ],
    };

    writeFileSync(join(contentRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    writeFileSync(
      join(contentRoot, hash, 'pages', 'en-theory-intro.json'),
      `${JSON.stringify({ slug: 'theory/intro', path: '/theory/intro', lang: 'en', title: 'Intro', simulator_key: null, body: 'Hello' }, null, 2)}\n`
    );

    process.chdir(root);
    const output = execFileSync('node', [join(repoRoot, '.github/scripts/validatePublishedContent.mjs')], {
      encoding: 'utf8',
    });
    assert(output.includes(`hash=${hash}`), 'validator should accept a valid snapshot');
  } finally {
    process.chdir(prevCwd);
    rmSync(root, { recursive: true, force: true });
  }
}

function checkCommitScript() {
  const scriptPath = join(repoRoot, '.github/scripts/commitStaticContentSnapshot.sh');
  assert(existsSync(scriptPath), 'commit script must exist');
  const script = readFileSync(scriptPath, 'utf8');
  assert(script.includes('No content changes detected'), 'commit script must handle no-op publishes');
  assert(script.includes('git add -- "${CONTENT_DIR}/"'), 'commit script must stage only public/content');
}

checkPublishWorkflow();
checkRecoveryWorkflow();
checkValidatorScript();
checkCommitScript();

console.log('[validateWorkflows] All workflow contract checks passed.');
