import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  or,
  sql,
} from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  users,
  roles,
  permissions,
  rolePermissions,
  challenges,
  forumCategories,
  forumTopics,
  forumMessages,
  notifications,
  quizzes,
  quizQuestions,
  quizOptions,
  quizAttempts,
  solutions,
  contentProgress,
} from '../db/schema.js';
import { authRequired, adminRequired, type AppVariables } from '../middleware/auth.js';
import {
  userToDict,
  roleToDict,
  challengeToDict,
  forumCategoryToDict,
  quizToDict,
  quizQuestionToDict,
} from '../db/serializers.js';
import {
  getPermissionCodesForRole,
  getRoleByName,
  getRoleRow,
  getUserContext,
} from '../db/repo.js';
import { sendSystemNotificationEmail } from '../lib/email.js';

export const adminRouter = new Hono<{ Variables: AppVariables }>();

// All admin routes require auth + admin role.
adminRouter.use('/api/admin/*', authRequired, adminRequired);

// ==================== Users ====================

async function quizStatsByUser() {
  const bestPerQuiz = await db
    .select({
      userId: quizAttempts.userId,
      quizId: quizAttempts.quizId,
      best: sql<number>`max(${quizAttempts.percentage})`,
    })
    .from(quizAttempts)
    .groupBy(quizAttempts.userId, quizAttempts.quizId);
  const map = new Map<string, { sum: number; count: number }>();
  for (const r of bestPerQuiz) {
    const cur = map.get(r.userId) ?? { sum: 0, count: 0 };
    cur.sum += Number(r.best);
    cur.count += 1;
    map.set(r.userId, cur);
  }
  return map;
}

adminRouter.get('/api/admin/users', async (c) => {
  const q = c.req.query();
  const skip = Number(q.skip ?? '0');
  const limit = Number(q.limit ?? '10');
  const search = q.search;
  const role = q.role;
  const sortBy = q.sort_by ?? 'created_at';
  const sortDesc = (q.sort_desc ?? 'true') === 'true';
  const minTokens = q.min_tokens != null ? Number(q.min_tokens) : undefined;
  const maxTokens = q.max_tokens != null ? Number(q.max_tokens) : undefined;
  const minQuizAvg = q.min_quiz_avg != null ? Number(q.min_quiz_avg) : undefined;
  const maxQuizAvg = q.max_quiz_avg != null ? Number(q.max_quiz_avg) : undefined;

  const conditions: any[] = [];
  if (search) {
    const term = `%${search}%`;
    conditions.push(or(ilike(users.nickname, term), ilike(users.email, term)));
  }
  if (minTokens != null) conditions.push(gte(users.tokens, minTokens));
  if (maxTokens != null) conditions.push(sql`${users.tokens} <= ${maxTokens}`);

  // Fetch users joined with role
  let roleFilterId: number | null | undefined = undefined;
  if (role && role !== 'all') {
    const r = await getRoleByName(role);
    if (!r) return c.json({ users: [], total: 0, skip, limit });
    roleFilterId = r.id;
    conditions.push(eq(users.roleId, r.id));
  }

  const allRows = await db
    .select()
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined);

  const statsMap = await quizStatsByUser();

  // role lookup
  const roleIds = Array.from(
    new Set(allRows.map((u) => u.roleId).filter((x): x is number => x != null))
  );
  const roleRows = roleIds.length
    ? await db.select().from(roles).where(inArray(roles.id, roleIds))
    : [];
  const roleMap = new Map(roleRows.map((r) => [r.id, r]));
  const permsCache = new Map<number, string[]>();

  let enriched = await Promise.all(
    allRows.map(async (u) => {
      const stat = statsMap.get(u.id);
      const avg = stat && stat.count > 0 ? Math.round((stat.sum / stat.count) * 10) / 10 : 0;
      const roleRow = u.roleId ? roleMap.get(u.roleId) ?? null : null;
      let codes = u.roleId ? permsCache.get(u.roleId) : [];
      if (u.roleId && !codes) {
        codes = await getPermissionCodesForRole(u.roleId);
        permsCache.set(u.roleId, codes);
      }
      return {
        ...userToDict(u, roleRow as any, codes ?? []),
        avg_quiz_score: avg,
        quizzes_completed: stat?.count ?? 0,
        _sort_created: u.createdAt ? new Date(u.createdAt).getTime() : 0,
      };
    })
  );

  // quiz avg filters
  if (minQuizAvg != null) enriched = enriched.filter((u) => u.avg_quiz_score >= minQuizAvg);
  if (maxQuizAvg != null) enriched = enriched.filter((u) => u.avg_quiz_score <= maxQuizAvg);

  const total = enriched.length;

  const cmp = (a: any, b: any): number => {
    let av: any;
    let bv: any;
    switch (sortBy) {
      case 'nickname': av = a.nickname ?? ''; bv = b.nickname ?? ''; break;
      case 'email': av = a.email ?? ''; bv = b.email ?? ''; break;
      case 'role': av = a.role ?? ''; bv = b.role ?? ''; break;
      case 'tokens': av = a.tokens ?? 0; bv = b.tokens ?? 0; break;
      case 'avg_quiz_score': av = a.avg_quiz_score; bv = b.avg_quiz_score; break;
      case 'quizzes_completed': av = a.quizzes_completed; bv = b.quizzes_completed; break;
      default: av = a._sort_created; bv = b._sort_created;
    }
    if (av < bv) return sortDesc ? 1 : -1;
    if (av > bv) return sortDesc ? -1 : 1;
    return 0;
  };
  enriched.sort(cmp);
  const page = enriched.slice(skip, skip + limit).map(({ _sort_created, ...rest }) => rest);
  return c.json({ users: page, total, skip, limit });
});

adminRouter.put('/api/admin/users/:id/role', async (c) => {
  const userId = c.req.param('id');
  const body = await c.req.json<{ role: string }>();
  const roleObj = await getRoleByName(body.role);
  if (!roleObj) throw new HTTPException(400, { message: `Role '${body.role}' not found` });
  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) throw new HTTPException(404, { message: 'User not found' });
  await db
    .update(users)
    .set({ role: body.role, roleId: roleObj.id })
    .where(eq(users.id, userId));
  const ctx = await getUserContext(userId);
  return c.json(userToDict(ctx!.user, ctx!.role, ctx!.permissionCodes));
});

adminRouter.put('/api/admin/users/:id/reset-onboarding', async (c) => {
  const userId = c.req.param('id');
  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) throw new HTTPException(404, { message: 'User not found' });
  await db.update(users).set({ onboardingCompleted: false }).where(eq(users.id, userId));
  const ctx = await getUserContext(userId);
  return c.json(userToDict(ctx!.user, ctx!.role, ctx!.permissionCodes));
});

adminRouter.get('/api/admin/users/:id/token-transactions', async (c) => {
  const userId = c.req.param('id');
  const skip = Number(c.req.query('skip') ?? '0');
  const limit = Number(c.req.query('limit') ?? '50');
  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) throw new HTTPException(404, { message: 'User not found' });

  const { tokenTransactions } = await import('../db/schema.js');
  const totalRows = await db
    .select({ count: count() })
    .from(tokenTransactions)
    .where(eq(tokenTransactions.userId, userId));
  const txs = await db
    .select()
    .from(tokenTransactions)
    .where(eq(tokenTransactions.userId, userId))
    .orderBy(desc(tokenTransactions.createdAt))
    .offset(skip)
    .limit(limit);

  const descriptions: Record<string, string> = {
    CREATE_TOPIC: 'Criou um tópico no fórum',
    CREATE_REPLY: 'Respondeu no fórum',
    RECEIVE_UPVOTE_TOPIC: 'Recebeu upvote em tópico',
    RECEIVE_UPVOTE_COMMENT: 'Recebeu upvote em comentário',
    RECEIVE_REPLY: 'Recebeu resposta',
    QUALITY_BONUS: 'Bônus de qualidade',
    QUIZ_COMPLETE: 'Completou um quiz',
    FIRST_LOGIN: 'Primeiro login',
    PROFILE_COMPLETE: 'Completou o perfil',
    CHALLENGE_SUBMIT: 'Submeteu um desafio',
    CHALLENGE_APPROVED: 'Desafio aprovado',
  };
  return c.json({
    transactions: txs.map((t) => ({
      id: t.id,
      amount: t.amount,
      action_type: t.actionType,
      action_description: descriptions[t.actionType] ?? t.actionType,
      related_id: t.relatedId,
      related_type: t.relatedType,
      created_at: t.createdAt ? new Date(t.createdAt).toISOString() : null,
    })),
    total: Number(totalRows[0]?.count ?? 0),
    user: {
      id: target[0].id,
      nickname: target[0].nickname,
      email: target[0].email,
      tokens: target[0].tokens ?? 0,
    },
  });
});

// ==================== Roles & Permissions ====================

async function roleWithPerms(roleId: number) {
  const r = await getRoleRow(roleId);
  if (!r) return null;
  const codes = await getPermissionCodesForRole(roleId);
  return roleToDict(r, codes);
}

async function setRolePermissions(roleId: number, codes: string[]) {
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  if (codes.length) {
    const perms = await db
      .select()
      .from(permissions)
      .where(inArray(permissions.code, codes));
    if (perms.length)
      await db
        .insert(rolePermissions)
        .values(perms.map((p) => ({ roleId, permissionId: p.id })));
  }
}

adminRouter.get('/api/admin/roles', async (c) => {
  const rows = await db.select().from(roles);
  const result = await Promise.all(
    rows.map(async (r) => roleToDict(r, await getPermissionCodesForRole(r.id)))
  );
  return c.json({ roles: result });
});

adminRouter.post('/api/admin/roles', async (c) => {
  const body = await c.req.json<{
    name: string;
    color: string;
    description?: string;
    permissions?: string[];
  }>();
  const existing = await getRoleByName(body.name);
  if (existing) throw new HTTPException(400, { message: 'Role already exists' });
  const inserted = await db
    .insert(roles)
    .values({ name: body.name, color: body.color, description: body.description ?? null })
    .returning();
  await setRolePermissions(inserted[0].id, body.permissions ?? []);
  return c.json(await roleWithPerms(inserted[0].id));
});

adminRouter.put('/api/admin/roles/:id', async (c) => {
  const roleId = Number(c.req.param('id'));
  const body = await c.req.json<{
    name?: string;
    color?: string;
    description?: string;
    permissions?: string[];
  }>();
  const existing = await getRoleRow(roleId);
  if (!existing) throw new HTTPException(404, { message: 'Role not found' });
  const updates: Record<string, unknown> = {};
  if (body.name != null) updates.name = body.name;
  if (body.color != null) updates.color = body.color;
  if (body.description != null) updates.description = body.description;
  if (Object.keys(updates).length)
    await db.update(roles).set(updates).where(eq(roles.id, roleId));
  if (body.permissions != null) await setRolePermissions(roleId, body.permissions);
  return c.json(await roleWithPerms(roleId));
});

adminRouter.delete('/api/admin/roles/:id', async (c) => {
  const roleId = Number(c.req.param('id'));
  const existing = await getRoleRow(roleId);
  if (!existing) throw new HTTPException(404, { message: 'Role not found' });
  await db.delete(roles).where(eq(roles.id, roleId));
  return c.json({ message: 'Role deleted successfully' });
});

adminRouter.get('/api/admin/permissions', async (c) => {
  const rows = await db.select().from(permissions);
  return c.json({
    permissions: rows.map((p) => ({ code: p.code, description: p.description })),
  });
});

// ==================== Challenges ====================

adminRouter.post('/api/admin/challenges', async (c) => {
  const body = await c.req.json<any>();
  const existing = await db.select().from(challenges).where(eq(challenges.id, body.id)).limit(1);
  if (existing[0])
    throw new HTTPException(400, { message: 'Challenge with this ID already exists' });
  const inserted = await db
    .insert(challenges)
    .values({
      id: body.id,
      title: body.title,
      subtitle: body.subtitle ?? null,
      description: body.description,
      difficulty: body.difficulty,
      category: body.category,
      order: body.order ?? 0,
      evaluationPrompt: body.evaluation_prompt ?? null,
      initialRequirements: body.initial_requirements ?? null,
      videoSolutionUrl: body.video_solution_url ?? null,
      videoSolutionReleaseDate: body.video_solution_release_date
        ? new Date(body.video_solution_release_date)
        : null,
    })
    .returning();
  return c.json(challengeToDict(inserted[0]), 201);
});

adminRouter.put('/api/admin/challenges/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<any>();
  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.subtitle !== undefined) updates.subtitle = body.subtitle;
  if (body.description !== undefined) updates.description = body.description;
  if (body.difficulty !== undefined) updates.difficulty = body.difficulty;
  if (body.category !== undefined) updates.category = body.category;
  if (body.order !== undefined) updates.order = body.order;
  if (body.evaluation_prompt !== undefined) updates.evaluationPrompt = body.evaluation_prompt;
  if (body.initial_requirements !== undefined)
    updates.initialRequirements = body.initial_requirements;
  if (body.video_solution_url !== undefined)
    updates.videoSolutionUrl = body.video_solution_url;
  if (body.video_solution_release_date !== undefined)
    updates.videoSolutionReleaseDate = body.video_solution_release_date
      ? new Date(body.video_solution_release_date)
      : null;
  const updated = await db
    .update(challenges)
    .set(updates)
    .where(eq(challenges.id, id))
    .returning();
  if (!updated[0]) throw new HTTPException(404, { message: 'Challenge not found' });
  return c.json(challengeToDict(updated[0]));
});

adminRouter.delete('/api/admin/challenges/:id', async (c) => {
  const id = c.req.param('id');
  const deleted = await db.delete(challenges).where(eq(challenges.id, id)).returning();
  if (!deleted[0]) throw new HTTPException(404, { message: 'Challenge not found' });
  return c.json({ message: 'Challenge deleted successfully' });
});

// ==================== Forum Categories ====================

adminRouter.get('/api/admin/forum/categories', async (c) => {
  const rows = await db
    .select()
    .from(forumCategories)
    .orderBy(asc(forumCategories.order), asc(forumCategories.name));
  return c.json({ categories: rows.map(forumCategoryToDict) });
});

adminRouter.post('/api/admin/forum/categories', async (c) => {
  const body = await c.req.json<{
    name: string;
    color?: string;
    description?: string;
    order?: number;
  }>();
  const existing = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.name, body.name))
    .limit(1);
  if (existing[0])
    throw new HTTPException(400, { message: 'Category with this name already exists' });
  const inserted = await db
    .insert(forumCategories)
    .values({
      name: body.name,
      color: body.color ?? '#6B7280',
      description: body.description ?? null,
      order: body.order ?? 0,
    })
    .returning();
  return c.json(forumCategoryToDict(inserted[0]), 201);
});

adminRouter.put('/api/admin/forum/categories/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json<{
    name?: string;
    color?: string;
    description?: string;
    order?: number;
  }>();
  if (body.name != null) {
    const existing = await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.name, body.name))
      .limit(1);
    if (existing[0] && existing[0].id !== id)
      throw new HTTPException(400, { message: 'Category with this name already exists' });
  }
  const updates: Record<string, unknown> = {};
  if (body.name != null) updates.name = body.name;
  if (body.color != null) updates.color = body.color;
  if (body.description != null) updates.description = body.description;
  if (body.order != null) updates.order = body.order;
  const updated = await db
    .update(forumCategories)
    .set(updates)
    .where(eq(forumCategories.id, id))
    .returning();
  if (!updated[0]) throw new HTTPException(404, { message: 'Category not found' });
  return c.json(forumCategoryToDict(updated[0]));
});

adminRouter.get('/api/admin/forum/categories/:id/topics-count', async (c) => {
  const id = Number(c.req.param('id'));
  const cat = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.id, id))
    .limit(1);
  if (!cat[0]) throw new HTTPException(404, { message: 'Category not found' });
  const cnt = await db
    .select({ count: count() })
    .from(forumTopics)
    .where(eq(forumTopics.category, cat[0].name));
  return c.json({
    category_id: id,
    category_name: cat[0].name,
    topics_count: Number(cnt[0]?.count ?? 0),
  });
});

adminRouter.delete('/api/admin/forum/categories/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const reassignTo = c.req.query('reassign_to_category_id');
  const cat = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.id, id))
    .limit(1);
  if (!cat[0]) throw new HTTPException(404, { message: 'Category not found' });

  const cntRows = await db
    .select({ count: count() })
    .from(forumTopics)
    .where(eq(forumTopics.category, cat[0].name));
  const topicsCount = Number(cntRows[0]?.count ?? 0);

  if (topicsCount > 0 && !reassignTo)
    throw new HTTPException(400, {
      message: `Cannot delete category '${cat[0].name}' because it has ${topicsCount} topic(s). Please provide a category to reassign topics to.`,
    });

  let reassignName: string | null = null;
  if (reassignTo) {
    const reassignCat = await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.id, Number(reassignTo)))
      .limit(1);
    if (!reassignCat[0])
      throw new HTTPException(404, { message: 'Reassignment category not found' });
    if (reassignCat[0].id === id)
      throw new HTTPException(400, { message: 'Cannot reassign to the same category' });
    reassignName = reassignCat[0].name;
    await db
      .update(forumTopics)
      .set({ category: reassignName })
      .where(eq(forumTopics.category, cat[0].name));
  }

  await db.delete(forumCategories).where(eq(forumCategories.id, id));
  let message = `Category '${cat[0].name}' deleted successfully`;
  if (topicsCount > 0 && reassignName)
    message += `. ${topicsCount} topic(s) reassigned to '${reassignName}'`;
  return c.json({ message, topics_reassigned: reassignTo ? topicsCount : 0 });
});

adminRouter.put('/api/admin/forum/topics/:id/category', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json<{ category: string }>();
  const cat = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.name, body.category))
    .limit(1);
  if (!cat[0])
    throw new HTTPException(400, { message: `Category '${body.category}' does not exist` });
  const updated = await db
    .update(forumTopics)
    .set({ category: body.category })
    .where(eq(forumTopics.id, id))
    .returning();
  if (!updated[0]) throw new HTTPException(404, { message: 'Topic not found' });
  const { forumTopicToDict } = await import('../db/serializers.js');
  return c.json(forumTopicToDict(updated[0]));
});

// ==================== Dashboard analytics ====================

adminRouter.get('/api/admin/dashboard', async (c) => {
  const analytics = await buildDashboardAnalytics();
  return c.json(analytics);
});

adminRouter.get('/api/admin/user-growth', async (c) => {
  const startDate = c.req.query('start_date');
  const endDate = c.req.query('end_date');
  if (!startDate || !endDate)
    throw new HTTPException(400, { message: 'start_date and end_date are required' });
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    throw new HTTPException(400, { message: 'Invalid date format. Use YYYY-MM-DD' });
  if (start > end)
    throw new HTTPException(400, { message: 'Start date must be before end date' });

  const endInclusive = new Date(end);
  endInclusive.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      date: sql<string>`date(${users.createdAt})`,
      count: count(),
    })
    .from(users)
    .where(and(gte(users.createdAt, start), sql`${users.createdAt} <= ${endInclusive}`))
    .groupBy(sql`date(${users.createdAt})`);
  const countByDate = new Map(rows.map((r) => [String(r.date), Number(r.count)]));

  const data: { date: string; count: number }[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const ds = cursor.toISOString().slice(0, 10);
    data.push({ date: ds, count: countByDate.get(ds) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  const totalNew = data.reduce((s, d) => s + d.count, 0);
  return c.json({ data, total_new_users: totalNew, start_date: startDate, end_date: endDate });
});

async function buildDashboardAnalytics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  const totalUsers = Number((await db.select({ c: count() }).from(users))[0].c);
  // True distinct-user union of everyone active in the window via ANY tracked
  // action: quiz attempts, challenge solutions, or reading content (marking a
  // lesson read/unread updates content_progress.updated_at). Counting the union
  // — instead of max() of separate counts — avoids undercounting users who only
  // did one kind of activity.
  const activeUsers30d = Number(
    (
      await db.execute(sql`
        SELECT count(*)::int AS c FROM (
          SELECT ${quizAttempts.userId} AS user_id
            FROM ${quizAttempts}
            WHERE ${quizAttempts.startedAt} >= ${thirtyDaysAgo}
          UNION
          SELECT ${solutions.userId} AS user_id
            FROM ${solutions}
            WHERE ${solutions.createdAt} >= ${thirtyDaysAgo}
          UNION
          SELECT ${contentProgress.userId} AS user_id
            FROM ${contentProgress}
            WHERE ${contentProgress.updatedAt} >= ${thirtyDaysAgo}
        ) AS active
      `)
    )[0].c
  );
  const newUsersWeek = Number(
    (await db.select({ c: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)))[0].c
  );

  const totalChallenges = Number((await db.select({ c: count() }).from(challenges))[0].c);
  const submittedSolutions = Number(
    (await db.select({ c: count() }).from(solutions).where(eq(solutions.status, 'submitted')))[0].c
  );
  const usersCompleted = Number(
    (
      await db
        .select({ c: sql<number>`count(distinct ${solutions.userId})` })
        .from(solutions)
        .where(eq(solutions.status, 'submitted'))
    )[0].c
  );
  const solutionsPerChallenge = await db
    .select({
      challenge_id: solutions.challengeId,
      title: challenges.title,
      count: count(),
    })
    .from(solutions)
    .innerJoin(challenges, eq(solutions.challengeId, challenges.id))
    .where(eq(solutions.status, 'submitted'))
    .groupBy(solutions.challengeId, challenges.title)
    .orderBy(desc(count()));

  // step dropout
  const drafts = await db.select().from(solutions).where(eq(solutions.status, 'draft'));
  const stoppedAt = { step_0: 0, step_1: 0, step_2: 0, step_3: 0, diagram: 0, not_started: 0 };
  for (const d of drafts) {
    const has = (v: string | null) => Boolean(v && v.trim());
    if (d.diagramData) stoppedAt.diagram++;
    else if (has(d.step3Content)) stoppedAt.step_3++;
    else if (has(d.step2Content)) stoppedAt.step_2++;
    else if (has(d.step1Content)) stoppedAt.step_1++;
    else if (has(d.step0Content)) stoppedAt.step_0++;
    else stoppedAt.not_started++;
  }
  const stepDropout = [
    { step: 'Requisitos Funcionais', count: stoppedAt.step_0, key: 'step_0' },
    { step: 'Requisitos Não Funcionais', count: stoppedAt.step_1, key: 'step_1' },
    { step: 'Entidades', count: stoppedAt.step_2, key: 'step_2' },
    { step: 'APIs', count: stoppedAt.step_3, key: 'step_3' },
    { step: 'Diagrama (não enviou)', count: stoppedAt.diagram, key: 'diagram' },
    { step: 'Não iniciou', count: stoppedAt.not_started, key: 'not_started' },
  ];

  const totalQuizzes = Number((await db.select({ c: count() }).from(quizzes))[0].c);
  const publishedQuizzes = Number(
    (await db.select({ c: count() }).from(quizzes).where(eq(quizzes.isPublished, true)))[0].c
  );
  const totalQuizAttempts = Number((await db.select({ c: count() }).from(quizAttempts))[0].c);
  const uniqueQuizTakers = Number(
    (
      await db.select({ c: sql<number>`count(distinct ${quizAttempts.userId})` }).from(quizAttempts)
    )[0].c
  );
  const avgQuizScore = Number(
    (await db.select({ a: sql<number>`coalesce(avg(${quizAttempts.percentage}), 0)` }).from(quizAttempts))[0].a
  );

  const quizStatsRows = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      theme: quizzes.theme,
      attempts: count(quizAttempts.id),
      unique_users: sql<number>`count(distinct ${quizAttempts.userId})`,
      avg_score: sql<number>`coalesce(avg(${quizAttempts.percentage}), 0)`,
    })
    .from(quizzes)
    .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
    .where(eq(quizzes.isPublished, true))
    .groupBy(quizzes.id, quizzes.title, quizzes.theme)
    .orderBy(desc(count(quizAttempts.id)));

  const themeRows = await db
    .select({ theme: quizzes.theme, count: count() })
    .from(quizzes)
    .where(eq(quizzes.isPublished, true))
    .groupBy(quizzes.theme);

  const totalTopics = Number((await db.select({ c: count() }).from(forumTopics))[0].c);
  const totalMessages = Number((await db.select({ c: count() }).from(forumMessages))[0].c);
  const topicsPerCategory = await db
    .select({ category: forumTopics.category, count: count() })
    .from(forumTopics)
    .groupBy(forumTopics.category);

  // activity timeline last 31 days (aggregated in JS from date-grouped queries)
  const since = new Date(now.getTime() - 31 * 86400000);
  const solByDay = await db
    .select({ d: sql<string>`date(${solutions.createdAt})`, c: count() })
    .from(solutions)
    .where(and(gte(solutions.createdAt, since), eq(solutions.status, 'submitted')))
    .groupBy(sql`date(${solutions.createdAt})`);
  const quizByDay = await db
    .select({ d: sql<string>`date(${quizAttempts.startedAt})`, c: count() })
    .from(quizAttempts)
    .where(gte(quizAttempts.startedAt, since))
    .groupBy(sql`date(${quizAttempts.startedAt})`);
  const usersByDay = await db
    .select({ d: sql<string>`date(${users.createdAt})`, c: count() })
    .from(users)
    .where(gte(users.createdAt, since))
    .groupBy(sql`date(${users.createdAt})`);
  // Content reading activity per day: rows touched (marked read/unread) within
  // the window, keyed by updated_at so toggles in either direction count.
  const readsByDay = await db
    .select({ d: sql<string>`date(${contentProgress.updatedAt})`, c: count() })
    .from(contentProgress)
    .where(gte(contentProgress.updatedAt, since))
    .groupBy(sql`date(${contentProgress.updatedAt})`);
  const solMap = new Map(solByDay.map((r) => [String(r.d), Number(r.c)]));
  const quizMap = new Map(quizByDay.map((r) => [String(r.d), Number(r.c)]));
  const usrMap = new Map(usersByDay.map((r) => [String(r.d), Number(r.c)]));
  const readMap = new Map(readsByDay.map((r) => [String(r.d), Number(r.c)]));

  const activityTimeline: any[] = [];
  for (let i = 30; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10);
    activityTimeline.push({
      date: day,
      solutions: solMap.get(day) ?? 0,
      quiz_attempts: quizMap.get(day) ?? 0,
      reads: readMap.get(day) ?? 0,
      new_users: usrMap.get(day) ?? 0,
    });
  }

  const recentSolutions = await db
    .select({
      id: solutions.id,
      challengeId: solutions.challengeId,
      createdAt: solutions.createdAt,
      nickname: users.nickname,
      challengeTitle: challenges.title,
    })
    .from(solutions)
    .innerJoin(users, eq(solutions.userId, users.id))
    .innerJoin(challenges, eq(solutions.challengeId, challenges.id))
    .where(eq(solutions.status, 'submitted'))
    .orderBy(desc(solutions.createdAt))
    .limit(10);

  return {
    users: {
      total: totalUsers,
      active_30_days: activeUsers30d,
      new_this_week: newUsersWeek,
    },
    challenges: {
      total: totalChallenges,
      submitted_solutions: submittedSolutions,
      users_completed: usersCompleted,
      solutions_per_challenge: solutionsPerChallenge.map((s) => ({
        challenge_id: s.challenge_id,
        title: s.title,
        count: Number(s.count),
      })),
      completion_rate: totalUsers > 0 ? Math.round((usersCompleted / totalUsers) * 1000) / 10 : 0,
    },
    step_dropout: stepDropout,
    total_drafts: drafts.length,
    quizzes: {
      total: totalQuizzes,
      published: publishedQuizzes,
      total_attempts: totalQuizAttempts,
      unique_takers: uniqueQuizTakers,
      avg_score: Math.round(avgQuizScore * 10) / 10,
      quiz_stats: quizStatsRows.map((q) => ({
        id: q.id,
        title: q.title,
        theme: q.theme,
        attempts: Number(q.attempts),
        unique_users: Number(q.unique_users),
        avg_score: Math.round(Number(q.avg_score) * 10) / 10,
      })),
      themes: themeRows.map((t) => ({ theme: t.theme, count: Number(t.count) })),
    },
    forum: {
      total_topics: totalTopics,
      total_messages: totalMessages,
      categories: topicsPerCategory.map((c2) => ({
        category: c2.category,
        count: Number(c2.count),
      })),
    },
    activity_timeline: activityTimeline,
    recent_activity: recentSolutions.map((s) => ({
      type: 'solution',
      id: s.id,
      user_nickname: s.nickname,
      challenge_title: s.challengeTitle,
      created_at: s.createdAt ? new Date(s.createdAt).toISOString() : null,
    })),
  };
}

// ==================== Quizzes (admin) ====================

async function loadQuizQuestionsAdmin(quizId: number) {
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.order));
  if (questions.length === 0) return [];
  const opts = await db
    .select()
    .from(quizOptions)
    .where(inArray(quizOptions.questionId, questions.map((q) => q.id)))
    .orderBy(asc(quizOptions.order));
  return questions.map((q) => ({
    question: q,
    options: opts.filter((o) => o.questionId === q.id),
  }));
}

adminRouter.get('/api/admin/quizzes', async (c) => {
  const rows = await db
    .select()
    .from(quizzes)
    .orderBy(asc(quizzes.order), desc(quizzes.createdAt));
  const result = await Promise.all(
    rows.map(async (q) => {
      const questions = await loadQuizQuestionsAdmin(q.id);
      return quizToDict(q, questions.length, questions, false);
    })
  );
  return c.json({ quizzes: result });
});

adminRouter.get('/api/admin/quizzes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const rows = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Quiz not found' });
  const questions = await loadQuizQuestionsAdmin(id);
  return c.json(quizToDict(rows[0], questions.length, questions, false));
});

async function createQuestionWithOptions(
  quizId: number,
  questionText: string,
  explanation: string | null,
  options: { option_text: string; is_correct: boolean }[],
  order?: number
) {
  if (options.length !== 4)
    throw new HTTPException(400, { message: 'Each question must have exactly 4 options' });
  const correct = options.filter((o) => o.is_correct).length;
  if (correct !== 1)
    throw new HTTPException(400, { message: 'Exactly one option must be marked as correct' });

  let order_ = order;
  if (order_ == null) {
    const maxRows = await db
      .select({ m: sql<number>`coalesce(max(${quizQuestions.order}), 0)` })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));
    order_ = Number(maxRows[0].m) + 1;
  }
  const inserted = await db
    .insert(quizQuestions)
    .values({ quizId, questionText, explanation, order: order_ })
    .returning();
  await db.insert(quizOptions).values(
    options.map((o, i) => ({
      questionId: inserted[0].id,
      optionText: o.option_text,
      isCorrect: o.is_correct,
      order: i,
    }))
  );
  return inserted[0];
}

adminRouter.post('/api/admin/quizzes', async (c) => {
  const body = await c.req.json<any>();
  const inserted = await db
    .insert(quizzes)
    .values({
      title: body.title,
      theme: body.theme,
      description: body.description ?? null,
      timeLimitSeconds: body.time_limit_seconds ?? 30,
      isPublished: body.is_published ?? false,
      order: body.order ?? 0,
    })
    .returning();
  const quiz = inserted[0];
  if (Array.isArray(body.questions)) {
    for (const q of body.questions) {
      await createQuestionWithOptions(quiz.id, q.question_text, q.explanation ?? null, q.options);
    }
  }
  const questions = await loadQuizQuestionsAdmin(quiz.id);
  return c.json(quizToDict(quiz, questions.length, questions, false), 201);
});

adminRouter.put('/api/admin/quizzes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json<any>();
  const updates: Record<string, unknown> = {};
  if (body.title != null) updates.title = body.title;
  if (body.theme != null) updates.theme = body.theme;
  if (body.description != null) updates.description = body.description;
  if (body.time_limit_seconds != null) updates.timeLimitSeconds = body.time_limit_seconds;
  if (body.is_published != null) updates.isPublished = body.is_published;
  if (body.order != null) updates.order = body.order;
  const updated = await db.update(quizzes).set(updates).where(eq(quizzes.id, id)).returning();
  if (!updated[0]) throw new HTTPException(404, { message: 'Quiz not found' });
  const questions = await loadQuizQuestionsAdmin(id);
  return c.json(quizToDict(updated[0], questions.length, questions, false));
});

adminRouter.delete('/api/admin/quizzes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const deleted = await db.delete(quizzes).where(eq(quizzes.id, id)).returning();
  if (!deleted[0]) throw new HTTPException(404, { message: 'Quiz not found' });
  return c.json({ message: 'Quiz deleted successfully' });
});

adminRouter.post('/api/admin/quizzes/:id/questions', async (c) => {
  const quizId = Number(c.req.param('id'));
  const body = await c.req.json<any>();
  const quizRows = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizRows[0]) throw new HTTPException(404, { message: 'Quiz not found' });
  const question = await createQuestionWithOptions(
    quizId,
    body.question_text,
    body.explanation ?? null,
    body.options
  );
  const opts = await db
    .select()
    .from(quizOptions)
    .where(eq(quizOptions.questionId, question.id))
    .orderBy(asc(quizOptions.order));
  return c.json(quizQuestionToDict(question, opts, false), 201);
});

adminRouter.put('/api/admin/quizzes/:quizId/questions/reorder', async (c) => {
  const quizId = Number(c.req.param('quizId'));
  const body = await c.req.json<{ question_ids?: number[] } | number[]>();
  const ids = Array.isArray(body) ? body : body.question_ids ?? [];
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(quizQuestions)
      .set({ order: i })
      .where(and(eq(quizQuestions.id, ids[i]), eq(quizQuestions.quizId, quizId)));
  }
  const rows = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Quiz not found' });
  const questions = await loadQuizQuestionsAdmin(quizId);
  return c.json(quizToDict(rows[0], questions.length, questions, false));
});

adminRouter.put('/api/admin/quizzes/:quizId/questions/:questionId', async (c) => {
  const quizId = Number(c.req.param('quizId'));
  const questionId = Number(c.req.param('questionId'));
  const body = await c.req.json<any>();
  const qRows = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.id, questionId))
    .limit(1);
  if (!qRows[0] || qRows[0].quizId !== quizId)
    throw new HTTPException(404, { message: 'Question not found' });

  const updates: Record<string, unknown> = {};
  if (body.question_text != null) updates.questionText = body.question_text;
  if (body.explanation != null) updates.explanation = body.explanation;
  if (body.order != null) updates.order = body.order;
  if (Object.keys(updates).length)
    await db.update(quizQuestions).set(updates).where(eq(quizQuestions.id, questionId));

  if (Array.isArray(body.options)) {
    if (body.options.length !== 4)
      throw new HTTPException(400, { message: 'Each question must have exactly 4 options' });
    const correct = body.options.filter((o: any) => o.is_correct).length;
    if (correct !== 1)
      throw new HTTPException(400, { message: 'Exactly one option must be marked as correct' });
    await db.delete(quizOptions).where(eq(quizOptions.questionId, questionId));
    await db.insert(quizOptions).values(
      body.options.map((o: any, i: number) => ({
        questionId,
        optionText: o.option_text,
        isCorrect: o.is_correct,
        order: i,
      }))
    );
  }

  const updatedQ = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.id, questionId))
    .limit(1);
  const opts = await db
    .select()
    .from(quizOptions)
    .where(eq(quizOptions.questionId, questionId))
    .orderBy(asc(quizOptions.order));
  return c.json(quizQuestionToDict(updatedQ[0], opts, false));
});

adminRouter.delete('/api/admin/quizzes/:quizId/questions/:questionId', async (c) => {
  const quizId = Number(c.req.param('quizId'));
  const questionId = Number(c.req.param('questionId'));
  const qRows = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.id, questionId))
    .limit(1);
  if (!qRows[0] || qRows[0].quizId !== quizId)
    throw new HTTPException(404, { message: 'Question not found' });
  await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));
  return c.json({ message: 'Question deleted successfully' });
});

// ==================== Admin Notifications ====================

interface NotifPayload {
  title: string;
  message: string;
  email_subject?: string;
  cta_text?: string;
  cta_url?: string;
  send_email?: boolean;
  link_type?: string;
  link_id?: number;
}

async function sendNotificationsToUsers(
  targets: { id: string; email: string | null; nickname: string | null }[],
  payload: NotifPayload
) {
  if (targets.length) {
    await db.insert(notifications).values(
      targets.map((u) => ({
        userId: u.id,
        type: 'system',
        title: payload.title,
        message: payload.message,
        linkType: payload.link_type ?? null,
        linkId: payload.link_id ?? null,
      }))
    );
  }
  let emailsSent = 0;
  if (payload.send_email !== false) {
    for (const u of targets) {
      if (u.email) {
        const ok = await sendSystemNotificationEmail({
          recipientEmail: u.email,
          recipientNickname: u.nickname || u.email.split('@')[0],
          subject: payload.email_subject || `📬 ${payload.title}`,
          title: payload.title,
          message: payload.message,
          ctaText: payload.cta_text,
          ctaUrl: payload.cta_url,
        });
        if (ok) emailsSent++;
      }
    }
  }
  return emailsSent;
}

adminRouter.post('/api/admin/notifications/system', async (c) => {
  const userId = c.req.query('user_id');
  if (!userId) throw new HTTPException(400, { message: 'user_id is required' });
  const payload = await c.req.json<NotifPayload>();
  const target = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target[0]) throw new HTTPException(404, { message: 'User not found' });
  const emailsSent = await sendNotificationsToUsers(
    [{ id: target[0].id, email: target[0].email, nickname: target[0].nickname }],
    payload
  );
  return c.json({ success: true, email_sent: emailsSent > 0 }, 201);
});

adminRouter.post('/api/admin/notifications/broadcast', async (c) => {
  const payload = await c.req.json<NotifPayload>();
  const allUsers = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname })
    .from(users);
  const emailsSent = await sendNotificationsToUsers(allUsers, payload);
  return c.json(
    {
      message: `Notification sent to ${allUsers.length} user(s)`,
      notifications_created: allUsers.length,
      emails_sent: emailsSent,
    },
    201
  );
});

function notificationFilterConditions(roleId?: number | null) {
  const conditions: any[] = [];
  if (roleId != null) conditions.push(eq(users.roleId, roleId));
  return conditions;
}

adminRouter.post('/api/admin/notifications/filtered', async (c) => {
  const payload = await c.req.json<
    NotifPayload & { role_filter?: string }
  >();
  let roleId: number | null = null;
  if (payload.role_filter) {
    const r = await getRoleByName(payload.role_filter);
    roleId = r?.id ?? -1;
  }
  const conditions = notificationFilterConditions(roleId);
  const targets = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname })
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined);

  if (!targets.length)
    return c.json(
      { message: 'No users match the specified filters', notifications_created: 0, emails_sent: 0, users_matched: 0 },
      201
    );
  const emailsSent = await sendNotificationsToUsers(targets, payload);
  return c.json(
    {
      message: `Individual notifications sent to ${targets.length} user(s)`,
      notifications_created: targets.length,
      emails_sent: emailsSent,
      users_matched: targets.length,
      filters_applied: { role: payload.role_filter },
    },
    201
  );
});

adminRouter.get('/api/admin/notifications/preview-count', async (c) => {
  const roleFilter = c.req.query('role_filter');
  let roleId: number | null = null;
  if (roleFilter) {
    const r = await getRoleByName(roleFilter);
    roleId = r?.id ?? -1;
  }
  const conditions = notificationFilterConditions(roleId);
  const rows = await db
    .select({ c: count() })
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined);
  return c.json({
    count: Number(rows[0]?.c ?? 0),
    filters: { role: roleFilter },
  });
});

adminRouter.get('/api/admin/notifications/users', async (c) => {
  const roleFilter = c.req.query('role_filter');
  const search = c.req.query('search');
  let roleId: number | null = null;
  if (roleFilter) {
    const r = await getRoleByName(roleFilter);
    roleId = r?.id ?? -1;
  }
  const conditions = notificationFilterConditions(roleId);
  if (search) {
    const term = `%${search}%`;
    conditions.push(or(ilike(users.nickname, term), ilike(users.email, term)));
  }
  const rows = await db
    .select()
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(users.nickname), asc(users.email));

  const roleIds = Array.from(
    new Set(rows.map((u) => u.roleId).filter((x): x is number => x != null))
  );
  const roleRows = roleIds.length
    ? await db.select().from(roles).where(inArray(roles.id, roleIds))
    : [];
  const roleMap = new Map(roleRows.map((r) => [r.id, r]));

  return c.json({
    users: rows.map((u) => {
      const r = u.roleId ? roleMap.get(u.roleId) : null;
      return {
        id: u.id,
        email: u.email,
        nickname: u.nickname,
        avatar_image: u.avatarImage,
        role: r?.name ?? u.role,
        role_color: r?.color ?? '#3B82F6',
      };
    }),
    total: rows.length,
  });
});

adminRouter.post('/api/admin/notifications/selected', async (c) => {
  const payload = await c.req.json<NotifPayload & { user_ids: string[] }>();
  if (!payload.user_ids?.length)
    throw new HTTPException(400, { message: 'No users selected' });
  const targets = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname })
    .from(users)
    .where(inArray(users.id, payload.user_ids));
  if (!targets.length) throw new HTTPException(404, { message: 'No valid users found' });
  const emailsSent = await sendNotificationsToUsers(targets, payload);
  return c.json(
    {
      message: `Notifications sent to ${targets.length} selected user(s)`,
      notifications_created: targets.length,
      emails_sent: emailsSent,
      users_selected: payload.user_ids.length,
      users_found: targets.length,
    },
    201
  );
});
