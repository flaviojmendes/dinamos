import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync, renameSync, cpSync, mkdirSync, writeFileSync } from 'node:fs';
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

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
    renameSync: vi.fn(actual.renameSync),
    cpSync: vi.fn(actual.cpSync),
    rmSync: vi.fn(actual.rmSync),
  };
});

const actualFs = await vi.importActual<typeof import('node:fs')>('node:fs');

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

  it('keeps missing translations empty instead of substituting another language', () => {
    const ptFallback = resolvePageBody({ ...pageRow, bodyPt: '   ' }, 'pt');
    expect(ptFallback.lang).toBe('pt');
    expect(ptFallback.body).toBe('');
    expect(ptFallback.title).toBe('Desafios Distribuídos');

    const enFallback = resolvePageBody({ ...pageRow, bodyEn: null, titleEn: null }, 'en');
    expect(enFallback.lang).toBe('en');
    expect(enFallback.body).toBe('');
    expect(enFallback.title).toBeNull();
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
    vi.mocked(renameSync).mockReset().mockImplementation(actualFs.renameSync);
    vi.mocked(cpSync).mockReset().mockImplementation(actualFs.cpSync);
    vi.mocked(rmSync).mockReset().mockImplementation(actualFs.rmSync);
    contentRoot = mkdtempSync(join(tmpdir(), 'static-content-'));
  });

  afterEach(() => {
    vi.mocked(rmSync).mockReset().mockImplementation(actualFs.rmSync);
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

  it.each(['EXDEV', 'EPERM'])('copies complete payloads before publishing when directory rename fails with %s', (code) => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    writeStaticContentSnapshot(contentRoot, first);
    const manifestBefore = readFileSync(join(contentRoot, 'manifest.json'), 'utf8');
    const second = buildStaticContentSnapshot(
      [moduleRow],
      [{ ...pageRow, bodyEn: 'New English body', bodyPt: 'Novo texto em português' }],
      '2026-01-02T00:00:00.000Z'
    );
    const stagingVersion = join(contentRoot, `.staging-${second.contentHash}`, second.contentHash);
    vi.mocked(renameSync).mockImplementation((source, target) => {
      if (source === stagingVersion) throw Object.assign(new Error('Directory move unavailable'), { code });
      return actualFs.renameSync(source, target);
    });
    vi.mocked(cpSync).mockImplementation((source, target, options) => {
      expect(readFileSync(join(contentRoot, 'manifest.json'), 'utf8')).toBe(manifestBefore);
      return actualFs.cpSync(source, target, options);
    });

    const result = writeStaticContentSnapshot(contentRoot, second);
    expect(cpSync).toHaveBeenCalledTimes(1);
    expect(result.previousContentHash).toBe(first.contentHash);
    expect(readExistingManifest(contentRoot)?.contentHash).toBe(second.contentHash);
    for (const file of second.bodyFiles) {
      expect(JSON.parse(readFileSync(join(contentRoot, file.relativePath), 'utf8'))).toEqual(file.payload);
    }
    expect(JSON.parse(readFileSync(join(contentRoot, first.bodyFiles[0].relativePath), 'utf8'))).toEqual(
      first.bodyFiles[0].payload
    );
    expect(existsSync(join(contentRoot, `.staging-${second.contentHash}`))).toBe(false);
  });

  it('leaves the active manifest and its payloads intact when the fallback copy fails midway', () => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    writeStaticContentSnapshot(contentRoot, first);
    const manifestBefore = readFileSync(join(contentRoot, 'manifest.json'), 'utf8');
    const second = buildStaticContentSnapshot(
      [moduleRow],
      [{ ...pageRow, bodyEn: 'New English body' }],
      '2026-01-02T00:00:00.000Z'
    );
    const stagingVersion = join(contentRoot, `.staging-${second.contentHash}`, second.contentHash);
    vi.mocked(renameSync).mockImplementation((source, target) => {
      if (source === stagingVersion) throw Object.assign(new Error('Directory move unavailable'), { code: 'EPERM' });
      return actualFs.renameSync(source, target);
    });
    vi.mocked(cpSync).mockImplementation((_source, target) => {
      expect(readFileSync(join(contentRoot, 'manifest.json'), 'utf8')).toBe(manifestBefore);
      mkdirSync(join(String(target), 'pages'), { recursive: true });
      writeFileSync(join(String(target), 'pages', 'partial.json'), '{');
      throw Object.assign(new Error('Disk is full during copy'), { code: 'ENOSPC' });
    });

    expect(() => writeStaticContentSnapshot(contentRoot, second)).toThrow('Disk is full during copy');
    expect(readFileSync(join(contentRoot, 'manifest.json'), 'utf8')).toBe(manifestBefore);
    for (const file of first.bodyFiles) {
      expect(JSON.parse(readFileSync(join(contentRoot, file.relativePath), 'utf8'))).toEqual(file.payload);
    }
    expect(existsSync(join(contentRoot, second.contentHash))).toBe(false);
    expect(existsSync(join(contentRoot, `.staging-${second.contentHash}`))).toBe(false);
    expect(listVersionDirectories(contentRoot)).toEqual([first.contentHash]);
  });

  it('does not use the copy fallback for other directory rename errors', () => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    writeStaticContentSnapshot(contentRoot, first);
    const second = buildStaticContentSnapshot(
      [moduleRow],
      [{ ...pageRow, bodyEn: 'New English body' }],
      '2026-01-02T00:00:00.000Z'
    );
    const stagingVersion = join(contentRoot, `.staging-${second.contentHash}`, second.contentHash);
    vi.mocked(renameSync).mockImplementation((source, target) => {
      if (source === stagingVersion) throw Object.assign(new Error('Access denied'), { code: 'EACCES' });
      return actualFs.renameSync(source, target);
    });

    expect(() => writeStaticContentSnapshot(contentRoot, second)).toThrow('Access denied');
    expect(cpSync).not.toHaveBeenCalled();
    expect(readExistingManifest(contentRoot)?.contentHash).toBe(first.contentHash);
  });

  it('does not replace the current version or prune its predecessor on the same hash', () => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    const second = buildStaticContentSnapshot(
      [moduleRow],
      [{ ...pageRow, bodyEn: 'New English body' }],
      '2026-01-02T00:00:00.000Z'
    );
    writeStaticContentSnapshot(contentRoot, first);
    writeStaticContentSnapshot(contentRoot, second);
    const manifestBefore = readFileSync(join(contentRoot, 'manifest.json'), 'utf8');
    vi.mocked(renameSync).mockClear();
    vi.mocked(cpSync).mockClear();

    const result = writeStaticContentSnapshot(contentRoot, { ...second, generatedAt: '2026-01-03T00:00:00.000Z' });
    expect(renameSync).not.toHaveBeenCalled();
    expect(cpSync).not.toHaveBeenCalled();
    expect(readFileSync(join(contentRoot, 'manifest.json'), 'utf8')).toBe(manifestBefore);
    expect(result.retainedHashes).toEqual([first.contentHash, second.contentHash].sort());
  });

  it.each(['EPERM', 'EACCES'])('reports a successful publication despite %s cleaning obsolete and staging directories', (code) => {
    const snapshots = ['v1', 'v2', 'v3'].map((bodyEn, index) =>
      buildStaticContentSnapshot(
        [moduleRow],
        [{ ...pageRow, bodyEn }],
        `2026-01-0${index + 1}T00:00:00.000Z`
      )
    );
    writeStaticContentSnapshot(contentRoot, snapshots[0]);
    writeStaticContentSnapshot(contentRoot, snapshots[1]);
    const obsoleteVersion = join(contentRoot, snapshots[0].contentHash);
    const stagingRoot = join(contentRoot, `.staging-${snapshots[2].contentHash}`);
    vi.mocked(rmSync).mockImplementation((path, options) => {
      if (path === obsoleteVersion || path === stagingRoot) {
        throw Object.assign(new Error('Directory cleanup denied'), { code });
      }
      return actualFs.rmSync(path, options);
    });

    const result = writeStaticContentSnapshot(contentRoot, snapshots[2]);
    expect(result.previousContentHash).toBe(snapshots[1].contentHash);
    expect(readExistingManifest(contentRoot)?.contentHash).toBe(snapshots[2].contentHash);
    for (const snapshot of [snapshots[1], snapshots[2]]) {
      for (const file of snapshot.bodyFiles) {
        expect(JSON.parse(readFileSync(join(contentRoot, file.relativePath), 'utf8'))).toEqual(file.payload);
      }
    }
    expect(existsSync(obsoleteVersion)).toBe(true);
    expect(existsSync(stagingRoot)).toBe(true);
  });

  it('preserves the original copy error even when both partial-version and staging cleanup fail', () => {
    const first = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-01-01T00:00:00.000Z');
    writeStaticContentSnapshot(contentRoot, first);
    const manifestBefore = readFileSync(join(contentRoot, 'manifest.json'), 'utf8');
    const second = buildStaticContentSnapshot(
      [moduleRow],
      [{ ...pageRow, bodyEn: 'New English body' }],
      '2026-01-02T00:00:00.000Z'
    );
    const stagingRoot = join(contentRoot, `.staging-${second.contentHash}`);
    const stagingVersion = join(stagingRoot, second.contentHash);
    const partialVersion = join(contentRoot, second.contentHash);
    const copyError = Object.assign(new Error('Original copy ran out of disk space'), { code: 'ENOSPC' });
    vi.mocked(renameSync).mockImplementation((source, target) => {
      if (source === stagingVersion) throw Object.assign(new Error('Directory move unavailable'), { code: 'EPERM' });
      return actualFs.renameSync(source, target);
    });
    vi.mocked(cpSync).mockImplementation(() => {
      mkdirSync(partialVersion, { recursive: true });
      throw copyError;
    });
    vi.mocked(rmSync).mockImplementation((path, options) => {
      if (path === partialVersion) throw Object.assign(new Error('Partial cleanup I/O error'), { code: 'EIO' });
      if (path === stagingRoot) throw Object.assign(new Error('Staging cleanup denied'), { code: 'EACCES' });
      return actualFs.rmSync(path, options);
    });

    let thrown: unknown;
    try {
      writeStaticContentSnapshot(contentRoot, second);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBe(copyError);
    expect(readFileSync(join(contentRoot, 'manifest.json'), 'utf8')).toBe(manifestBefore);
    for (const file of first.bodyFiles) {
      expect(JSON.parse(readFileSync(join(contentRoot, file.relativePath), 'utf8'))).toEqual(file.payload);
    }
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
