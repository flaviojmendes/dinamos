import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { quizzes, quizQuestions, quizOptions, quizAttempts, users } from '../db/schema.js';
import {
  authRequired,
  type AppVariables,
} from '../middleware/auth.js';
import { quizToDict, quizQuestionToDict, quizAttemptToDict } from '../db/serializers.js';

export const quizzesRouter = new Hono<{ Variables: AppVariables }>();

async function countQuestions(quizId: number): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId));
  return Number(rows[0]?.count ?? 0);
}

async function loadQuestions(quizId: number) {
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

async function getUserBestAttempt(userId: string, quizId: number) {
  const rows = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))
    .orderBy(desc(quizAttempts.percentage))
    .limit(1);
  return rows[0] ?? null;
}

quizzesRouter.get('/api/quizzes/themes', authRequired, async (c) => {
  const rows = await db
    .selectDistinct({ theme: quizzes.theme })
    .from(quizzes)
    .where(eq(quizzes.isPublished, true));
  return c.json({ themes: rows.map((r) => r.theme) });
});

quizzesRouter.get('/api/quizzes', authRequired, async (c) => {
  const user = c.get('user');
  const theme = c.req.query('theme');
  const limit = Number(c.req.query('limit') ?? '100');

  const conditions = [eq(quizzes.isPublished, true)];
  if (theme) conditions.push(eq(quizzes.theme, theme));

  const rows = await db
    .select()
    .from(quizzes)
    .where(and(...conditions))
    .orderBy(asc(quizzes.order), desc(quizzes.createdAt))
    .limit(limit);

  const result = [];
  for (const quiz of rows) {
    const count = await countQuestions(quiz.id);
    const best = await getUserBestAttempt(user.uid, quiz.id);
    const attemptsRows = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, user.uid), eq(quizAttempts.quizId, quiz.id)));
    result.push({
      ...quizToDict(quiz, count),
      user_best_percentage: best ? best.percentage : null,
      user_attempts_count: Number(attemptsRows[0]?.count ?? 0),
    });
  }
  return c.json({ quizzes: result });
});

quizzesRouter.get('/api/quizzes/:id', authRequired, async (c) => {
  const id = Number(c.req.param('id'));
  const rows = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  if (!rows[0] || !rows[0].isPublished)
    throw new HTTPException(404, { message: 'Quiz not found' });
  const questions = await loadQuestions(id);
  return c.json(quizToDict(rows[0], questions.length, questions, true));
});

quizzesRouter.post('/api/quizzes/:id/attempt', authRequired, async (c) => {
  const user = c.get('user');
  const quizId = Number(c.req.param('id'));
  const body = await c.req.json<{
    answers: { question_id: number; selected_option_id?: number | null; time_taken_seconds?: number }[];
  }>();

  const quizRows = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizRows[0] || !quizRows[0].isPublished)
    throw new HTTPException(404, { message: 'Quiz not found' });

  const questions = await loadQuestions(quizId);
  const totalQuestions = questions.length;
  let score = 0;
  const processed = [];
  for (const answer of body.answers) {
    let isCorrect = false;
    if (answer.selected_option_id) {
      const q = questions.find((qq) => qq.question.id === answer.question_id);
      const opt = q?.options.find((o) => o.id === answer.selected_option_id);
      if (opt?.isCorrect) {
        isCorrect = true;
        score++;
      }
    }
    processed.push({
      question_id: answer.question_id,
      selected_option_id: answer.selected_option_id ?? null,
      is_correct: isCorrect,
      time_taken_seconds: answer.time_taken_seconds ?? 0,
    });
  }
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const inserted = await db
    .insert(quizAttempts)
    .values({
      quizId,
      userId: user.uid,
      score,
      totalQuestions,
      percentage,
      answers: JSON.stringify(processed),
      completedAt: new Date(),
    })
    .returning();

  const result: any = quizAttemptToDict(inserted[0]);
  result.quiz = quizToDict(quizRows[0], questions.length, questions, false);
  return c.json(result, 201);
});

quizzesRouter.get('/api/quizzes/:id/attempts', authRequired, async (c) => {
  const user = c.get('user');
  const quizId = Number(c.req.param('id'));
  const rows = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, user.uid), eq(quizAttempts.quizId, quizId)))
    .orderBy(desc(quizAttempts.completedAt));
  return c.json({ attempts: rows.map(quizAttemptToDict) });
});

quizzesRouter.get('/api/quizzes/:id/leaderboard', authRequired, async (c) => {
  const user = c.get('user');
  const quizId = Number(c.req.param('id'));
  const limit = Number(c.req.query('limit') ?? '10');

  const quizRows = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizRows[0] || !quizRows[0].isPublished)
    throw new HTTPException(404, { message: 'Quiz not found' });

  // best score per user
  const best = await db
    .select({
      userId: quizAttempts.userId,
      bestPercentage: sql<number>`max(${quizAttempts.percentage})`,
      firstAchieved: sql<string>`min(${quizAttempts.completedAt})`,
    })
    .from(quizAttempts)
    .where(eq(quizAttempts.quizId, quizId))
    .groupBy(quizAttempts.userId)
    .orderBy(
      desc(sql`max(${quizAttempts.percentage})`),
      asc(sql`min(${quizAttempts.completedAt})`)
    )
    .limit(limit);

  const userMap = new Map<string, any>();
  if (best.length) {
    const userRows = await db
      .select({ id: users.id, nickname: users.nickname, avatarImage: users.avatarImage })
      .from(users)
      .where(inArray(users.id, best.map((b) => b.userId)));
    for (const u of userRows) userMap.set(u.id, u);
  }

  const leaderboard = best.map((b, i) => {
    const u = userMap.get(b.userId);
    return {
      user_id: b.userId,
      nickname: u?.nickname ?? null,
      avatar_image: u?.avatarImage ?? null,
      best_percentage: Number(b.bestPercentage),
      first_achieved: b.firstAchieved ? new Date(b.firstAchieved).toISOString() : null,
      rank: i + 1,
    };
  });

  const userBest = await getUserBestAttempt(user.uid, quizId);
  return c.json({
    leaderboard,
    user_best_percentage: userBest ? userBest.percentage : null,
    user_in_top: leaderboard.some((e) => e.user_id === user.uid),
  });
});

// ---- /api/user/quiz-* (related to quizzes) ----

quizzesRouter.get('/api/user/quiz-stats', authRequired, async (c) => {
  const user = c.get('user');
  const stats = await getUserQuizStats(user.uid);
  return c.json(stats);
});

quizzesRouter.get('/api/user/quiz-attempts', authRequired, async (c) => {
  const user = c.get('user');
  const skip = Number(c.req.query('skip') ?? '0');
  const limit = Number(c.req.query('limit') ?? '50');
  const rows = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, user.uid))
    .orderBy(desc(quizAttempts.completedAt))
    .offset(skip)
    .limit(limit);
  return c.json({ attempts: rows.map(quizAttemptToDict) });
});

export async function getUserQuizStats(userId: string) {
  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId));
  if (attempts.length === 0) {
    return {
      total_attempts: 0,
      quizzes_completed: 0,
      average_percentage: 0,
      best_percentage: 0,
      total_correct_answers: 0,
      total_questions_answered: 0,
    };
  }
  const quizIds = new Set(attempts.map((a) => a.quizId));
  const totalScore = attempts.reduce((s, a) => s + a.score, 0);
  const totalQuestions = attempts.reduce((s, a) => s + a.totalQuestions, 0);
  const percentages = attempts.map((a) => a.percentage);
  return {
    total_attempts: attempts.length,
    quizzes_completed: quizIds.size,
    average_percentage: Math.round(percentages.reduce((s, p) => s + p, 0) / percentages.length),
    best_percentage: Math.max(...percentages),
    total_correct_answers: totalScore,
    total_questions_answered: totalQuestions,
  };
}
