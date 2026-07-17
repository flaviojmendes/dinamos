import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  buildStaticContentSnapshot,
  computeContentHash,
  resolvePageBody,
  slugHash,
} from '../transform.js';
import { StaticContentValidationError, validateSnapshot, validateSourceRows } from '../validate.js';
import {
  listVersionDirectories,
  readExistingManifest,
  writeStaticContentSnapshot,
} from '../write.js';
import type { ContentModuleRow, ContentPageRow } from '../types.js';

const moduleRow: ContentModuleRow = {
  key: 'theory',
  label: 'Theoretical Foundations',
  tier: 'FOUNDATIONAL',
  base: '/theoretical-foundations',
  paths: null,
  orderIndex: 1,
};

const pageRow: ContentPageRow = {
  slug: 'theoretical-foundations/distributed-challenges',
  path: '/theoretical-foundations/distributed-challenges',
  moduleId: 'theory',
  orderIndex: 10,
  simulatorKey: null,
  published: true,
  titleEn: 'Distributed Challenges',
  titlePt: 'Desafios Distribuídos',
  bodyEn: 'English body',
  bodyPt: 'Corpo em português',
};

describe('static content transform', () => {
  it('produces deterministic content hashes for the same source rows', () => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    const second = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-02-01T00:00:00.000Z');
    expect(first.contentHash).toBe(second.contentHash);
    expect(first.contentHash).toBe(computeContentHash([moduleRow], [pageRow]));
  });

  it('excludes unpublished pages from the manifest and body files', () => {
    const snapshot = buildStaticContentSnapshot(
      [moduleRow],
      [
        pageRow,
        {
          ...pageRow,
          slug: 'draft-only',
          path: '/draft-only',
          published: false,
        },
      ],
      '2026-01-01T00:00:00.000Z'
    );
    expect(snapshot.pages).toHaveLength(1);
    expect(snapshot.pages[0].slug).toBe(pageRow.slug);
    expect(snapshot.bodyFiles).toHaveLength(2);
  });

  it('resolves language fallback the same way as the content API', () => {
    const ptFallback = resolvePageBody({ ...pageRow, bodyPt: '   ' }, 'pt');
    expect(ptFallback.lang).toBe('en');
    expect(ptFallback.body).toBe('English body');
    expect(ptFallback.title).toBe('Desafios Distribuídos');

    const enFallback = resolvePageBody({ ...pageRow, bodyEn: null, titleEn: null }, 'en');
    expect(enFallback.lang).toBe('pt');
    expect(enFallback.body).toBe('Corpo em português');
    expect(enFallback.title).toBe('Desafios Distribuídos');
  });

  it('uses collision-safe slug-hash filenames instead of nested slug paths', () => {
    const nested = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    const expectedHash = slugHash(pageRow.slug);
    expect(nested.pages[0].bodyEnUrl).toBe(
      `/content/${nested.contentHash}/pages/${expectedHash}-en.json`
    );
    expect(nested.pages[0].bodyEnUrl).not.toContain('distributed-challenges');
    expect(nested.bodyFiles[0].relativePath).toBe(
      `${nested.contentHash}/pages/${expectedHash}-en.json`
    );
  });

  it('preserves module and page index contracts used by routing/navigation', () => {
    const snapshot = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    expect(snapshot.modules[0]).toEqual({
      id: 'theory',
      label: 'Theoretical Foundations',
      tier: 'FOUNDATIONAL',
      base: '/theoretical-foundations',
      orderIndex: 1,
    });
    expect(snapshot.pages[0]).toMatchObject({
      slug: pageRow.slug,
      path: pageRow.path,
      moduleId: 'theory',
      orderIndex: 10,
      simulatorKey: null,
      titleEn: 'Distributed Challenges',
      titlePt: 'Desafios Distribuídos',
      hasEn: true,
      hasPt: true,
    });
  });
});

describe('static content validation', () => {
  it('accepts an empty published dataset', () => {
    const snapshot = buildStaticContentSnapshot([], [], '2026-01-01T00:00:00.000Z');
    expect(() => validateSnapshot(snapshot)).not.toThrow();
    expect(snapshot.pages).toEqual([]);
  });

  it('rejects duplicate page paths in source rows', () => {
    expect(() =>
      validateSourceRows([], [
        pageRow,
        { ...pageRow, slug: 'other-slug' },
      ])
    ).toThrow(StaticContentValidationError);
  });

  it('rejects invalid module tiers', () => {
    expect(() =>
      validateSourceRows([{ ...moduleRow, tier: 'INVALID' }], [pageRow])
    ).toThrow(/invalid tier/i);
  });
});

describe('static content write', () => {
  let contentRoot: string;

  beforeEach(() => {
    contentRoot = mkdtempSync(join(tmpdir(), 'static-content-'));
  });

  afterEach(() => {
    rmSync(contentRoot, { recursive: true, force: true });
  });

  it('writes atomically and retains the previous content version', () => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    writeStaticContentSnapshot(contentRoot, first);

    const updatedPage = { ...pageRow, bodyEn: 'Updated English body' };
    const second = buildStaticContentSnapshot([moduleRow], [updatedPage], '2026-01-02T00:00:00.000Z');
    const { retainedHashes, previousContentHash } = writeStaticContentSnapshot(contentRoot, second);

    expect(previousContentHash).toBe(first.contentHash);
    expect(retainedHashes).toEqual([first.contentHash, second.contentHash].sort());
    expect(listVersionDirectories(contentRoot)).toEqual([first.contentHash, second.contentHash].sort());

    const manifest = readExistingManifest(contentRoot);
    expect(manifest?.contentHash).toBe(second.contentHash);

    const previousBodyPath = join(
      contentRoot,
      first.contentHash,
      'pages',
      `${slugHash(pageRow.slug)}-en.json`
    );
    expect(existsSync(previousBodyPath)).toBe(true);
    expect(JSON.parse(readFileSync(previousBodyPath, 'utf8')).body).toBe('English body');

    const currentBodyPath = join(
      contentRoot,
      second.contentHash,
      'pages',
      `${slugHash(pageRow.slug)}-en.json`
    );
    expect(JSON.parse(readFileSync(currentBodyPath, 'utf8')).body).toBe('Updated English body');
  });

  it('prunes content versions older than the current and previous snapshot', () => {
    const snapshots = [
      buildStaticContentSnapshot([moduleRow], [{ ...pageRow, bodyEn: 'v1' }], '2026-01-01T00:00:00.000Z'),
      buildStaticContentSnapshot([moduleRow], [{ ...pageRow, bodyEn: 'v2' }], '2026-01-02T00:00:00.000Z'),
      buildStaticContentSnapshot([moduleRow], [{ ...pageRow, bodyEn: 'v3' }], '2026-01-03T00:00:00.000Z'),
    ];

    writeStaticContentSnapshot(contentRoot, snapshots[0]);
    writeStaticContentSnapshot(contentRoot, snapshots[1]);
    writeStaticContentSnapshot(contentRoot, snapshots[2]);

    expect(listVersionDirectories(contentRoot)).toEqual([
      snapshots[1].contentHash,
      snapshots[2].contentHash,
    ].sort());
    expect(existsSync(join(contentRoot, snapshots[0].contentHash))).toBe(false);
  });
});

describe('exportStaticContent guard', () => {
  it('fails when DATABASE_URL is missing', async () => {
    const previous = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    const { requireDatabaseUrl } = await import('../../exportStaticContent.js');
    expect(() => requireDatabaseUrl()).toThrow(/DATABASE_URL is required/i);
    if (previous !== undefined) process.env.DATABASE_URL = previous;
    else delete process.env.DATABASE_URL;
  });
});
