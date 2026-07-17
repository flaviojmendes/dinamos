import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { contentModules, contentPages } from '../../db/schema.js';
import type { ContentModuleRow, ContentPageRow } from './types.js';

export async function fetchPublishedContent(): Promise<{
  modules: ContentModuleRow[];
  pages: ContentPageRow[];
}> {
  const [modules, pages] = await Promise.all([
    db
      .select({
        key: contentModules.key,
        label: contentModules.label,
        tier: contentModules.tier,
        base: contentModules.base,
        paths: contentModules.paths,
        orderIndex: contentModules.orderIndex,
      })
      .from(contentModules)
      .orderBy(asc(contentModules.orderIndex), asc(contentModules.key)),
    db
      .select({
        slug: contentPages.slug,
        path: contentPages.path,
        moduleId: contentPages.moduleId,
        orderIndex: contentPages.orderIndex,
        simulatorKey: contentPages.simulatorKey,
        published: contentPages.published,
        titleEn: contentPages.titleEn,
        titlePt: contentPages.titlePt,
        bodyEn: contentPages.bodyEn,
        bodyPt: contentPages.bodyPt,
      })
      .from(contentPages)
      .where(eq(contentPages.published, true))
      .orderBy(asc(contentPages.orderIndex), asc(contentPages.slug)),
  ]);

  return {
    modules: modules.map((row) => ({
      ...row,
      paths: (row.paths as string[] | null) ?? null,
    })),
    pages,
  };
}
