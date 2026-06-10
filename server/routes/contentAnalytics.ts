import { Hono } from 'hono';
import { and, count, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  contentModules,
  contentPages,
  contentProgress,
  contentViews,
} from '../db/schema.js';
import { authRequired, adminRequired, type AppVariables } from '../middleware/auth.js';

export const contentAnalyticsRouter = new Hono<{ Variables: AppVariables }>();

contentAnalyticsRouter.use('/api/admin/content-analytics', authRequired, adminRequired);

const UNGROUPED_KEY = '__other__';
const UNGROUPED_LABEL = 'Outros';

/** Clamp the requested window to a sane range (default 30 days). */
function resolveDays(raw: string | undefined): number {
  const n = Number(raw ?? '30');
  if (!Number.isFinite(n)) return 30;
  return Math.min(Math.max(Math.round(n), 1), 365);
}

/**
 * Anonymized content engagement analytics. Every value returned here is an
 * aggregate (counts / averages); no userId, email or visitor hash is ever
 * exposed, so an admin can see "how many" without knowing "who".
 */
contentAnalyticsRouter.get('/api/admin/content-analytics', async (c) => {
  const days = resolveDays(c.req.query('days'));
  const now = new Date();
  const since = new Date(now.getTime() - days * 86400000);

  // ---- Module registry (labels + lesson counts) ----
  const moduleRows = await db
    .select()
    .from(contentModules)
    .orderBy(contentModules.orderIndex, contentModules.key);
  const moduleLabel = new Map<string, string>();
  for (const m of moduleRows) moduleLabel.set(m.key, m.label);
  const labelFor = (key: string | null | undefined) =>
    key ? moduleLabel.get(key) ?? key : UNGROUPED_LABEL;

  const lessonsByModule = await db
    .select({ moduleId: contentPages.moduleId, total: count() })
    .from(contentPages)
    .where(eq(contentPages.published, true))
    .groupBy(contentPages.moduleId);
  const lessonsTotalFor = new Map<string, number>();
  for (const r of lessonsByModule) {
    lessonsTotalFor.set(r.moduleId ?? UNGROUPED_KEY, Number(r.total));
  }

  // ---- Most visited modules / pages (within window) ----
  const viewsByModuleRows = await db
    .select({
      moduleId: contentPages.moduleId,
      views: count(),
      uniqueVisitors: sql<number>`count(distinct ${contentViews.visitorHash})`,
    })
    .from(contentViews)
    .leftJoin(contentPages, eq(contentPages.path, contentViews.path))
    .where(gte(contentViews.viewedAt, since))
    .groupBy(contentPages.moduleId);

  const mostVisitedModules = viewsByModuleRows
    .map((r) => ({
      moduleId: r.moduleId ?? UNGROUPED_KEY,
      label: labelFor(r.moduleId),
      views: Number(r.views),
      uniqueVisitors: Number(r.uniqueVisitors),
    }))
    .sort((a, b) => b.views - a.views);

  const viewsByPageRows = await db
    .select({
      path: contentViews.path,
      titlePt: contentPages.titlePt,
      titleEn: contentPages.titleEn,
      moduleId: contentPages.moduleId,
      views: count(),
      uniqueVisitors: sql<number>`count(distinct ${contentViews.visitorHash})`,
    })
    .from(contentViews)
    .leftJoin(contentPages, eq(contentPages.path, contentViews.path))
    .where(gte(contentViews.viewedAt, since))
    .groupBy(
      contentViews.path,
      contentPages.titlePt,
      contentPages.titleEn,
      contentPages.moduleId
    )
    .orderBy(desc(count()))
    .limit(15);

  const mostVisitedPages = viewsByPageRows.map((r) => ({
    path: r.path,
    label: r.titlePt || r.titleEn || r.path,
    module: labelFor(r.moduleId),
    views: Number(r.views),
    uniqueVisitors: Number(r.uniqueVisitors),
  }));

  const viewTotalsRow = (
    await db
      .select({
        totalViews: count(),
        uniqueVisitors: sql<number>`count(distinct ${contentViews.visitorHash})`,
      })
      .from(contentViews)
      .where(gte(contentViews.viewedAt, since))
  )[0];

  // ---- Progress through modules (from completions) ----
  const progByModuleRows = await db
    .select({
      moduleId: contentPages.moduleId,
      completions: count(),
      distinctUsers: sql<number>`count(distinct ${contentProgress.userId})`,
    })
    .from(contentProgress)
    .innerJoin(contentPages, eq(contentPages.path, contentProgress.path))
    .where(eq(contentProgress.completed, true))
    .groupBy(contentPages.moduleId);
  const progByModule = new Map<string, { completions: number; distinctUsers: number }>();
  for (const r of progByModuleRows) {
    progByModule.set(r.moduleId ?? UNGROUPED_KEY, {
      completions: Number(r.completions),
      distinctUsers: Number(r.distinctUsers),
    });
  }

  // One row per real module (ordered), so progress is comparable across modules.
  const progressByModule = moduleRows.map((m) => {
    const prog = progByModule.get(m.key) ?? { completions: 0, distinctUsers: 0 };
    const lessonsTotal = lessonsTotalFor.get(m.key) ?? 0;
    const avgCompletionPct =
      lessonsTotal > 0 && prog.distinctUsers > 0
        ? Math.round((prog.completions / (lessonsTotal * prog.distinctUsers)) * 1000) / 10
        : 0;
    return {
      moduleId: m.key,
      label: m.label,
      tier: m.tier,
      lessonsTotal,
      completions: prog.completions,
      distinctUsers: prog.distinctUsers,
      avgCompletionPct,
    };
  });

  // ---- Content marked as read (overall) ----
  const readTotalsRow = (
    await db
      .select({
        totalCompletions: count(),
        distinctPages: sql<number>`count(distinct ${contentProgress.path})`,
        distinctUsers: sql<number>`count(distinct ${contentProgress.userId})`,
      })
      .from(contentProgress)
      .where(eq(contentProgress.completed, true))
  )[0];

  const readByPageRows = await db
    .select({
      path: contentProgress.path,
      titlePt: contentPages.titlePt,
      titleEn: contentPages.titleEn,
      moduleId: contentPages.moduleId,
      completions: count(),
    })
    .from(contentProgress)
    .leftJoin(contentPages, eq(contentPages.path, contentProgress.path))
    .where(eq(contentProgress.completed, true))
    .groupBy(
      contentProgress.path,
      contentPages.titlePt,
      contentPages.titleEn,
      contentPages.moduleId
    )
    .orderBy(desc(count()))
    .limit(15);

  const topReadPages = readByPageRows.map((r) => ({
    path: r.path,
    label: r.titlePt || r.titleEn || r.path,
    module: labelFor(r.moduleId),
    completions: Number(r.completions),
  }));

  const readByDayRows = await db
    .select({ d: sql<string>`date(${contentProgress.completedAt})`, c: count() })
    .from(contentProgress)
    .where(
      and(eq(contentProgress.completed, true), gte(contentProgress.completedAt, since))
    )
    .groupBy(sql`date(${contentProgress.completedAt})`);
  const readByDay = new Map(readByDayRows.map((r) => [String(r.d), Number(r.c)]));

  const readTimeline: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10);
    readTimeline.push({ date: day, count: readByDay.get(day) ?? 0 });
  }

  return c.json({
    range_days: days,
    views: {
      total: Number(viewTotalsRow?.totalViews ?? 0),
      unique_visitors: Number(viewTotalsRow?.uniqueVisitors ?? 0),
      most_visited_modules: mostVisitedModules,
      most_visited_pages: mostVisitedPages,
    },
    progress: {
      modules: progressByModule,
    },
    marked_as_read: {
      total_completions: Number(readTotalsRow?.totalCompletions ?? 0),
      distinct_pages: Number(readTotalsRow?.distinctPages ?? 0),
      distinct_users: Number(readTotalsRow?.distinctUsers ?? 0),
      top_pages: topReadPages,
      timeline: readTimeline,
    },
  });
});
