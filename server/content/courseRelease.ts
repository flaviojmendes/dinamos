import { createHash } from 'node:crypto';
import lessons from './courseReleaseData.js';

type Lang = 'en' | 'pt';
export interface LessonRevision {
  path: string;
  en: { sourceHash: string; sourceTitle: string | null; title: string | null; body?: string; previousBodyHashes?: string[]; analogy: string };
  pt: { sourceHash: string; sourceTitle: string | null; title: string | null; body?: string; previousBodyHashes?: string[]; analogy: string };
}

/** Ignore line-ending and surrounding whitespace differences in old CMS copies. */
export function courseBodyHash(body: string): string {
  return createHash('sha256').update(body.replace(/\r\n/g, '\n').trim()).digest('hex');
}

export function courseTitle(slug: string, lang: Lang, title: string | null): string | null {
  const revision = lessons[slug]?.[lang];
  return revision && title === revision.sourceTitle ? revision.title : title;
}

/** Mask fenced examples without changing offsets into the original MDX. */
function proseOutsideFences(body: string): string {
  let fence: { marker: string; length: number } | null = null;
  return body.replace(/^[^\n]*(?:\n|$)/gm, line => {
    const text = line.replace(/\r?\n$/, '');
    if (fence) {
      const closing = /^ {0,3}(`+|~+)[ \t]*$/.exec(text);
      if (closing && closing[1][0] === fence.marker && closing[1].length >= fence.length) fence = null;
      return line.replace(/[^\r\n]/g, ' ');
    }
    const opening = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(text);
    if (!opening || (opening[1][0] === '`' && opening[2].includes('`'))) return line;
    fence = { marker: opening[1][0], length: opening[1].length };
    return line.replace(/[^\r\n]/g, ' ');
  });
}

export function insertBurgerAnalogy(body: string, analogy: string): string {
  if (!body.trim() || !analogy) return body;
  const prose = proseOutsideFences(body);
  if (/<BurgerAnalogy\b/.test(prose)) return body;
  const section = `<BurgerAnalogy text={${JSON.stringify(analogy)}} />`;
  const heading = /^# [^\n]+(?:\n|$)/m.exec(prose);
  if (!heading) return `${section}\n\n${body}`;
  const position = heading.index + heading[0].length;
  return `${body.slice(0, position).trimEnd()}\n\n${section}\n\n${body.slice(position).trimStart()}`;
}

/** Apply reviewed corrections only to their original text; preserve later CMS edits. */
export function courseBody(slug: string, lang: Lang, body: string | null): string {
  const revision = lessons[slug]?.[lang];
  if (!revision || !body?.trim()) return body ?? '';
  const hash = courseBodyHash(body);
  const reviewedSource = hash === revision.sourceHash || revision.previousBodyHashes?.includes(hash);
  const corrected = reviewedSource ? revision.body ?? body : body;
  return insertBurgerAnalogy(corrected, revision.analogy);
}

export function applyCourseRelease<T extends {
  slug: string; titleEn: string | null; titlePt: string | null; bodyEn: string | null; bodyPt: string | null;
}>(row: T): T {
  return {
    ...row,
    titleEn: courseTitle(row.slug, 'en', row.titleEn),
    titlePt: courseTitle(row.slug, 'pt', row.titlePt),
    bodyEn: courseBody(row.slug, 'en', row.bodyEn),
    bodyPt: courseBody(row.slug, 'pt', row.bodyPt),
  };
}
