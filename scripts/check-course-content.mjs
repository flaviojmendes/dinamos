#!/usr/bin/env node
/**
 * Validate the released course, including its actual MDX syntax and recurring
 * example. This checks locale metadata and editorial invariants, rather than
 * trying to infer a language from individual words or technical vocabulary.
 *
 * Usage: node scripts/check-course-content.mjs [--report /path/to/report.json]
 */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile, run } from '@mdx-js/mdx';
import { createElement, Fragment } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const contentRoot = join(root, 'public', 'content');
const locales = ['en', 'pt'];
const args = process.argv.slice(2);
let reportPath;
if (args.length) {
  if (args.length !== 2 || args[0] !== '--report' || !args[1]) {
    console.error('Usage: node scripts/check-course-content.mjs [--report /path/to/report.json]');
    process.exit(1);
  }
  reportPath = resolve(args[1]);
}

function nonempty(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.trim(), `${label} must not be empty`);
}

function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
}

/** Accept text, never a computed expression or other executable MDX property. */
function analogyText(node) {
  assert.equal(node.attributes.length, 1, 'BurgerAnalogy must have only its text property');
  const [attribute] = node.attributes;
  assert.equal(attribute.type, 'mdxJsxAttribute', 'BurgerAnalogy must not spread properties');
  assert.equal(attribute.name, 'text', 'BurgerAnalogy requires a text property');
  assert.equal(node.children.length, 0, 'BurgerAnalogy must not contain nested MDX');
  let value = attribute.value;
  if (typeof value !== 'string') {
    assert.equal(value?.type, 'mdxJsxAttributeValueExpression', 'BurgerAnalogy text must be a literal string');
    // JSON.parse rejects function calls, templates, concatenation and arbitrary
    // expressions without executing any content from the lesson.
    value = JSON.parse(value.value);
  }
  nonempty(value, 'BurgerAnalogy text');
  assert.ok(!/<\/?BurgerAnalogy\b/.test(value), 'BurgerAnalogy text must not contain another component');
  return value;
}

function normalizedText(value) {
  return value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function assertNoModuleLoading(value) {
  if (!value || typeof value !== 'object') return;
  assert.notEqual(value.type, 'mdxjsEsm', 'Course MDX must not load external modules');
  assert.notEqual(value.type, 'ImportExpression', 'Course MDX must not dynamically import modules');
  for (const child of Object.values(value)) assertNoModuleLoading(child);
}

/**
 * Exercise reviewed local MDX expressions without loading the app's providers,
 * simulators or browser APIs. Forwarding children still renders every nested
 * expression, unlike a dummy component that simply returns null.
 */
function renderingComponents(tree) {
  const components = Object.create(null);
  const passthrough = ({ children }) => createElement(Fragment, null, children);
  assertNoModuleLoading(tree);
  visit(tree, (node) => {
    if (!['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type) || !node.name) return;
    if (!/^[A-Z]/.test(node.name)) return;
    const parts = node.name.split('.');
    let target = components;
    for (const part of parts.slice(0, -1)) {
      target[part] ??= Object.create(null);
      target = target[part];
    }
    target[parts.at(-1)] = passthrough;
  });
  return components;
}

async function readBody(page, locale, hash) {
  const field = locale === 'en' ? 'En' : 'Pt';
  assert.equal(page[`has${field}`], true, `${page.slug} must have a published ${locale} translation`);
  const url = page[`body${field}Url`];
  nonempty(url, `${page.slug} ${locale} body URL`);
  assert.ok(url.startsWith(`/content/${hash}/pages/`), 'Body URL must point to the current content version');
  assert.ok(!/[?#\\]/.test(url), 'Body URL must be an ordinary local path');
  const path = resolve(root, 'public', url.slice(1));
  const within = relative(join(contentRoot, hash, 'pages'), path);
  assert.ok(within && !within.startsWith('..') && !within.startsWith('/'), 'Body URL must remain inside the current pages directory');
  const body = JSON.parse(await readFile(path, 'utf8'));
  assert.equal(body.slug, page.slug, 'Body slug must match the manifest');
  assert.equal(body.path, page.path, 'Body route must match the manifest');
  assert.equal(body.lang, locale, 'Body language must match the requested locale');
  nonempty(page[`title${field}`], `${page.slug} ${locale} manifest title`);
  nonempty(body.title, `${page.slug} ${locale} body title`);
  assert.equal(body.title, page[`title${field}`], 'Body title must match the localized manifest title');
  nonempty(body.body, `${page.slug} ${locale} MDX body`);
  return body;
}

const report = {
  schemaVersion: 1,
  contentHash: null,
  lessonCount: 0,
  compiledMdxBodies: 0,
  renderedMdxBodies: 0,
  byModule: {},
  lessons: [],
  errors: [],
};

try {
  const manifest = JSON.parse(await readFile(join(contentRoot, 'manifest.json'), 'utf8'));
  assert.equal(manifest.schemaVersion, 1, 'Unsupported content manifest schema');
  nonempty(manifest.contentHash, 'Content hash');
  assert.match(manifest.contentHash, /^[a-zA-Z0-9_-]+$/, 'Content hash must be a directory identifier');
  assert.ok(Array.isArray(manifest.pages) && manifest.pages.length, 'The manifest must contain lessons');
  assert.ok(Array.isArray(manifest.modules), 'The manifest must contain modules');
  report.contentHash = manifest.contentHash;
  report.lessonCount = manifest.pages.length;
  const modules = new Set(manifest.modules.map((module) => module.id));
  const slugs = new Set();
  const paths = new Set();
  const analogies = { en: new Map(), pt: new Map() };

  for (const page of manifest.pages) {
    const result = { slug: page.slug, path: page.path, locales: {} };
    report.lessons.push(result);
    try {
      nonempty(page.slug, 'Lesson slug');
      nonempty(page.path, `${page.slug} route`);
      assert.ok(page.path.startsWith('/'), 'Lesson route must be absolute');
      assert.ok(!slugs.has(page.slug), `Duplicate lesson slug: ${page.slug}`);
      assert.ok(!paths.has(page.path), `Duplicate lesson route: ${page.path}`);
      assert.ok(modules.has(page.moduleId), `Unknown lesson module: ${page.moduleId}`);
      slugs.add(page.slug);
      paths.add(page.path);
      report.byModule[page.moduleId] = (report.byModule[page.moduleId] ?? 0) + 1;
    } catch (error) {
      report.errors.push({ slug: page.slug, locale: null, message: error.message });
      continue;
    }
    const texts = {};
    for (const locale of locales) {
      try {
        const body = await readBody(page, locale, manifest.contentHash);
        let tree;
        function captureTree() {
          return (node) => { tree = node; };
        }
        // These files are the reviewed, repository-local course release, not
        // remote CMS responses. Compile and render as the browser does so a
        // syntactically valid undefined expression cannot break a live lesson.
        const compiled = await compile(body.body, {
          outputFormat: 'function-body',
          remarkPlugins: [remarkGfm, captureTree],
        });
        report.compiledMdxBodies += 1;
        const components = renderingComponents(tree);
        const examples = [];
        visit(tree, (node) => {
          if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'BurgerAnalogy') {
            examples.push(node);
          }
          if (['code', 'inlineCode', 'text'].includes(node.type)) {
            assert.ok(!/<\/?BurgerAnalogy\b/.test(node.value ?? ''), 'BurgerAnalogy markup must not leak into displayed text or a code block');
          }
        });
        assert.equal(examples.length, 1, 'Each lesson translation must render exactly one BurgerAnalogy');
        const text = analogyText(examples[0]);
        const restaurant = locale === 'en' ? /\bburger restaurant\b/i : /\bhamburgueria\b/i;
        assert.ok(restaurant.test(text), 'The analogy must refer to the shared burger restaurant');
        const normalized = normalizedText(text);
        const previous = analogies[locale].get(normalized);
        assert.ok(!previous, `The analogy must be specific to this lesson; also used by ${previous}`);
        analogies[locale].set(normalized, page.slug);
        texts[locale] = normalized;
        const { default: Content } = await run(compiled, jsxRuntime);
        renderToStaticMarkup(createElement(Content, { components }));
        report.renderedMdxBodies += 1;
        result.locales[locale] = {
          title: body.title,
          bodyCharacters: body.body.length,
          analogyWords: text.trim().split(/\s+/u).length,
        };
      } catch (error) {
        report.errors.push({ slug: page.slug, locale, message: error.message });
      }
    }
    if (texts.en && texts.en === texts.pt) {
      report.errors.push({ slug: page.slug, locale: 'en/pt', message: 'English and Portuguese analogies must be independently localized' });
    }
  }
} catch (error) {
  report.errors.push({ slug: null, locale: null, message: error.message });
}

if (reportPath) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}
if (report.errors.length) {
  console.error(`Course audit failed: ${report.errors.length} issue(s) across ${report.lessonCount} lessons.`);
  for (const error of report.errors) console.error(`- ${[error.slug, error.locale].filter(Boolean).join(' / ') || 'manifest'}: ${error.message}`);
  process.exitCode = 1;
} else {
  console.log(`Course audit passed: ${report.lessonCount} bilingual lessons, ${report.compiledMdxBodies} compiled and ${report.renderedMdxBodies} rendered MDX bodies, one unique restaurant example per lesson and locale.`);
  console.log(`Content version: ${report.contentHash}`);
  console.log(`Modules: ${JSON.stringify(report.byModule)}`);
}
if (reportPath) console.log(`Report: ${reportPath}`);
