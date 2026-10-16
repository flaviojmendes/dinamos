import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  applyCourseRelease,
  courseBody,
  courseBodyHash,
  courseTitle,
  insertBurgerAnalogy,
} from '../courseRelease.js';
import { releaseReviewedContent } from '../../scripts/releaseReviewedContent.js';
import { buildStaticContentSnapshot, slugHash } from '../../scripts/staticContent/transform.js';
import * as snapshotWriter from '../../scripts/staticContent/write.js';
import type { ContentModuleRow, ContentPageRow } from '../../scripts/staticContent/types.js';

vi.mock('../courseReleaseData.js', async () => {
  const { createHash } = await import('node:crypto');
  const hash = (body: string) => createHash('sha256').update(body).digest('hex');
  return {
    default: {
      'theory/example': {
        path: '/theory/example',
        en: {
          sourceHash: hash('# Original\n\nOriginal English explanation.'),
          previousBodyHashes: [hash('# Earlier published explanation')],
          sourceTitle: 'Original English title',
          title: 'Reviewed English title',
          body: '# Reviewed\n\nReviewed English explanation.',
          analogy: 'Our burger restaurant sends an "order ticket" to the kitchen.\nEach ticket has an identifier.',
        },
        pt: {
          sourceHash: hash('# Original\n\nExplicação original em português.'),
          sourceTitle: 'Título original em português',
          title: 'Título revisado em português',
          body: '# Revisado\n\nExplicação revisada em português.',
          analogy: 'Nossa hamburgueria envia uma comanda para a cozinha.',
        },
      },
      'theory/analogy-only': {
        path: '/theory/analogy-only',
        en: {
          sourceHash: hash('Original body without changes.'),
          sourceTitle: null,
          title: null,
          analogy: 'Our burger restaurant keeps the original explanation.',
        },
        pt: {
          sourceHash: hash('Texto original sem mudanças.'),
          sourceTitle: null,
          title: null,
          analogy: 'Nossa hamburgueria mantém a explicação original.',
        },
      },
    },
  };
});

const moduleRow: ContentModuleRow = {
  key: 'theory',
  label: 'Theory',
  tier: 'FOUNDATIONAL',
  base: '/theory',
  paths: ['/theory', '/theory/example'],
  orderIndex: 1,
};

const pageRow: ContentPageRow = {
  slug: 'theory/example',
  path: '/theory/example',
  moduleId: 'theory',
  orderIndex: 5,
  simulatorKey: 'example-simulator',
  published: true,
  titleEn: 'Original English title',
  titlePt: 'Título original em português',
  bodyEn: '# Original\n\nOriginal English explanation.',
  bodyPt: '# Original\n\nExplicação original em português.',
};

describe('reviewed course content', () => {
  it('recognizes original CMS copies despite line endings and surrounding whitespace', () => {
    expect(courseBodyHash(` \n${pageRow.bodyEn}\n `)).toBe(courseBodyHash(pageRow.bodyEn!));
    const body = courseBody('theory/example', 'en', `\r\n${pageRow.bodyEn!.replace(/\n/g, '\r\n')}\r\n`);
    expect(body).toContain('Reviewed English explanation.');
    expect(body).not.toContain('Original English explanation.');
    expect(courseBodyHash(`${pageRow.bodyEn} Edited.`)).not.toBe(courseBodyHash(pageRow.bodyEn!));
  });

  it('keeps the primary heading and safely encodes quotes and newlines in the analogy', () => {
    const body = courseBody('theory/example', 'en', pageRow.bodyEn);
    expect(body.startsWith('# Reviewed\n\n<BurgerAnalogy text={')).toBe(true);
    expect(body).toContain('\\"order ticket\\"');
    expect(body).toContain('\\nEach ticket');
    expect(body).toContain('\n\nReviewed English explanation.');
  });

  it('inserts an analogy before content when no primary heading exists', () => {
    expect(insertBurgerAnalogy('An explanation without a heading.', 'Our burger restaurant.')).toBe(
      '<BurgerAnalogy text={"Our burger restaurant."} />\n\nAn explanation without a heading.'
    );
  });

  it.each(['```', '~~~~', '````'])('ignores code headings inside a %s fence', (fence) => {
    const example = `${fence}python\n# Kitchen worker\nprocess_order()\n${fence}`;
    const original = `An example:\n\n${example}\n`;
    const body = insertBurgerAnalogy(original, 'Our burger restaurant.');
    expect(body).toBe(`<BurgerAnalogy text={"Our burger restaurant."} />\n\n${original}`);
    expect(body).toContain(example);
  });

  it('ignores a demonstrated component in fenced MDX and inserts after the real heading', () => {
    const example = '```mdx\n<BurgerAnalogy text="A code example." />\n```';
    const original = `${example}\n\n# Actual lesson\n\nExplanation.`;
    const body = insertBurgerAnalogy(original, 'Our burger restaurant.');
    expect(body).toBe(`${example}\n\n# Actual lesson\n\n<BurgerAnalogy text={"Our burger restaurant."} />\n\nExplanation.`);
  });

  it('does not close a longer fence with shorter or different fence markers', () => {
    const example = '````md\n```\n# Still code\n~~~\n<BurgerAnalogy text="Still an example." />\n````';
    const original = `${example}\n\n# Actual lesson\n\nExplanation.`;
    const body = insertBurgerAnalogy(original, 'Our burger restaurant.');
    expect(body).toBe(`${example}\n\n# Actual lesson\n\n<BurgerAnalogy text={"Our burger restaurant."} />\n\nExplanation.`);
  });

  it('does not duplicate or replace an existing authored analogy', () => {
    const first = courseBody('theory/example', 'pt', pageRow.bodyPt);
    expect(courseBody('theory/example', 'pt', first)).toBe(first);
    const authored = '# CMS version\n\n<BurgerAnalogy text="Uma analogia editada." />\n\nTexto atualizado.';
    expect(courseBody('theory/example', 'pt', authored)).toBe(authored);
  });

  it('corrects explicitly reviewed previous releases while preserving unrelated edits', () => {
    expect(courseBody('theory/example', 'en', '# Earlier published explanation')).toContain('Reviewed English explanation.');
    expect(courseBody('theory/example', 'en', '# A later CMS edit')).toContain('# A later CMS edit');
  });

  it('preserves subsequent CMS body edits while adding the shared teaching thread', () => {
    const edited = '# CMS heading\n\nA later explanation with a corrected example.';
    const body = courseBody('theory/example', 'en', edited);
    expect(body).toContain('# CMS heading');
    expect(body).toContain('A later explanation with a corrected example.');
    expect(body).toContain('<BurgerAnalogy');
    expect(body).not.toContain('Reviewed English explanation.');
  });

  it('does not fill empty or missing translations with the other language', () => {
    expect(courseBody('theory/example', 'pt', null)).toBe('');
    expect(courseBody('theory/example', 'en', '')).toBe('');
    expect(courseBody('theory/example', 'pt', '  \n ')).toBe('  \n ');
    const released = applyCourseRelease({ ...pageRow, bodyPt: null, titlePt: null });
    expect(released.bodyPt).toBe('');
    expect(released.titlePt).toBeNull();
    expect(released.bodyEn).toContain('Reviewed English explanation.');
  });

  it('updates only original titles and preserves independently edited CMS titles', () => {
    expect(courseTitle('theory/example', 'en', pageRow.titleEn)).toBe('Reviewed English title');
    expect(courseTitle('theory/example', 'pt', pageRow.titlePt)).toBe('Título revisado em português');
    expect(courseTitle('theory/example', 'en', 'Custom CMS title')).toBe('Custom CMS title');
    expect(courseTitle('theory/example', 'pt', null)).toBeNull();
    expect(courseTitle('unknown', 'en', 'An unrelated title')).toBe('An unrelated title');
  });

  it('leaves lessons outside the release untouched', () => {
    const unknown = { ...pageRow, slug: 'unknown' };
    expect(applyCourseRelease(unknown)).toEqual(unknown);
  });

  it('supports analogy-only revisions without changing their explanation', () => {
    const body = courseBody('theory/analogy-only', 'en', 'Original body without changes.');
    expect(body).toContain('Original body without changes.');
    expect(body).toContain('<BurgerAnalogy');
  });

  it('keeps routing metadata and exposes matching reviewed titles in index and body files', () => {
    const released = applyCourseRelease({ ...pageRow, cmsRevision: 42 });
    expect(released).toMatchObject({
      slug: pageRow.slug,
      path: pageRow.path,
      moduleId: pageRow.moduleId,
      orderIndex: pageRow.orderIndex,
      simulatorKey: pageRow.simulatorKey,
      cmsRevision: 42,
    });
    const snapshot = buildStaticContentSnapshot([moduleRow], [released], '2026-10-16T00:00:00Z');
    expect(snapshot.pages[0]).toMatchObject({
      titleEn: 'Reviewed English title',
      titlePt: 'Título revisado em português',
      hasEn: true,
      hasPt: true,
    });
    expect(snapshot.bodyFiles.map((file) => file.payload.title)).toEqual([
      snapshot.pages[0].titleEn,
      snapshot.pages[0].titlePt,
    ]);
  });
});

describe('offline reviewed content release', () => {
  let contentRoot: string;

  beforeEach(() => {
    contentRoot = mkdtempSync(join(tmpdir(), 'reviewed-content-'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(contentRoot, { recursive: true, force: true });
  });

  it('releases from local files and preserves the previous version across repeated runs', () => {
    const original = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-10-01T00:00:00Z');
    snapshotWriter.writeStaticContentSnapshot(contentRoot, original);
    const write = vi.spyOn(snapshotWriter, 'writeStaticContentSnapshot');

    const released = releaseReviewedContent(contentRoot, '2026-10-16T00:00:00Z');
    expect(released.written).toBe(true);
    expect(released.previousContentHash).toBe(original.contentHash);
    expect(write).toHaveBeenCalledTimes(1);
    const manifestBeforeRepeat = readFileSync(join(contentRoot, 'manifest.json'), 'utf8');

    const repeated = releaseReviewedContent(contentRoot, '2026-10-17T00:00:00Z');
    expect(repeated.written).toBe(false);
    expect(repeated.contentHash).toBe(released.contentHash);
    expect(write).toHaveBeenCalledTimes(1);
    expect(readFileSync(join(contentRoot, 'manifest.json'), 'utf8')).toBe(manifestBeforeRepeat);
    expect(snapshotWriter.listVersionDirectories(contentRoot).sort()).toEqual([
      original.contentHash,
      released.contentHash,
    ].sort());

    const previousBody = join(contentRoot, original.contentHash, 'pages', `${slugHash(pageRow.slug)}-en.json`);
    expect(JSON.parse(readFileSync(previousBody, 'utf8')).body).toBe(pageRow.bodyEn);
    const current = snapshotWriter.readExistingManifest(contentRoot)!;
    expect(current.modules[0].paths).toEqual(moduleRow.paths);
    expect(current.pages[0]).toMatchObject({
      titleEn: 'Reviewed English title',
      titlePt: 'Título revisado em português',
      simulatorKey: 'example-simulator',
      orderIndex: 5,
    });
  });

  it('does not turn an old fallback payload into a missing translation', () => {
    const original = buildStaticContentSnapshot(
      [moduleRow],
      [{ ...pageRow, bodyPt: '', titlePt: null }],
      '2026-10-01T00:00:00Z'
    );
    snapshotWriter.writeStaticContentSnapshot(contentRoot, original);
    const ptFile = join(contentRoot, original.contentHash, 'pages', `${slugHash(pageRow.slug)}-pt.json`);
    const payload = JSON.parse(readFileSync(ptFile, 'utf8'));
    writeFileSync(ptFile, JSON.stringify({ ...payload, lang: 'en', title: pageRow.titleEn, body: pageRow.bodyEn }));

    const result = releaseReviewedContent(contentRoot);
    const current = snapshotWriter.readExistingManifest(contentRoot)!;
    expect(current.pages[0].hasPt).toBe(false);
    expect(current.pages[0].titlePt).toBeNull();
    const releasedPtFile = join(contentRoot, result.contentHash, 'pages', `${slugHash(pageRow.slug)}-pt.json`);
    expect(JSON.parse(readFileSync(releasedPtFile, 'utf8')).body).toBe('');
  });

  it('rejects mismatched payload metadata before writing a new snapshot', () => {
    const original = buildStaticContentSnapshot([moduleRow], [pageRow], '2026-10-01T00:00:00Z');
    snapshotWriter.writeStaticContentSnapshot(contentRoot, original);
    const enFile = join(contentRoot, original.contentHash, 'pages', `${slugHash(pageRow.slug)}-en.json`);
    const payload = JSON.parse(readFileSync(enFile, 'utf8'));
    writeFileSync(enFile, JSON.stringify({ ...payload, lang: 'pt' }));
    const write = vi.spyOn(snapshotWriter, 'writeStaticContentSnapshot');

    expect(() => releaseReviewedContent(contentRoot)).toThrow(/inconsistent body payload/);
    expect(write).not.toHaveBeenCalled();
    expect(snapshotWriter.readExistingManifest(contentRoot)?.contentHash).toBe(original.contentHash);
  });

  it('requires an existing local snapshot', () => {
    expect(() => releaseReviewedContent(contentRoot)).toThrow(/No content manifest/);
    expect(existsSync(join(contentRoot, 'manifest.json'))).toBe(false);
  });
});
