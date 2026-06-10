import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const quiz = {
  id: 1,
  title: 'Quiz',
  theme: 'sys',
  description: 'd',
  timeLimitSeconds: 60,
  isPublished: true,
  order: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};
const question = { id: 10, quizId: 1, questionText: 'Q?', explanation: 'e', order: 1 };
const opts = [
  { id: 100, questionId: 10, optionText: 'A', order: 1, isCorrect: true },
  { id: 101, questionId: 10, optionText: 'B', order: 2, isCorrect: false },
];

beforeEach(() => mockDb.reset());

describe('quizzes routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/quizzes')).status).toBe(401);
  });

  it('GET /api/quizzes/themes lists distinct themes', async () => {
    mockDb.setResults([[{ theme: 'sys' }, { theme: 'net' }]]);
    const res = await app.request('/api/quizzes/themes', { headers: AUTH });
    expect((await res.json() as any).themes).toEqual(['sys', 'net']);
  });

  it('GET /api/quizzes returns quizzes with per-user stats', async () => {
    mockDb.setResults([
      [quiz], // list
      [{ count: 2 }], // countQuestions
      [{ percentage: 90 }], // best attempt
      [{ count: 3 }], // attempts count
    ]);
    const res = await app.request('/api/quizzes?theme=sys', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.quizzes[0].user_best_percentage).toBe(90);
    expect(body.quizzes[0].user_attempts_count).toBe(3);
  });

  it('GET /api/quizzes/:id returns a quiz with questions (correctness hidden)', async () => {
    mockDb.setResults([
      [quiz], // quiz
      [question], // loadQuestions questions
      opts, // loadQuestions options
    ]);
    const res = await app.request('/api/quizzes/1', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.questions[0].options[0]).not.toHaveProperty('is_correct');
  });

  it('GET /api/quizzes/:id 404 when unpublished', async () => {
    mockDb.setResults([[{ ...quiz, isPublished: false }]]);
    const res = await app.request('/api/quizzes/1', { headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('POST /api/quizzes/:id/attempt scores the answers', async () => {
    mockDb.setResults([
      [quiz], // quiz lookup
      [question], // loadQuestions questions
      opts, // loadQuestions options
      [{ id: 500, quizId: 1, userId: 'u1', score: 1, totalQuestions: 1, percentage: 100, answers: '[]', completedAt: new Date() }], // inserted
    ]);
    const res = await app.request('/api/quizzes/1/attempt', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ answers: [{ question_id: 10, selected_option_id: 100 }] }),
    });
    expect(res.status).toBe(201);
    const body = await res.json() as any;
    expect(body.percentage).toBe(100);
  });

  it('POST /api/quizzes/:id/attempt 404 when quiz missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/quizzes/1/attempt', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ answers: [] }),
    });
    expect(res.status).toBe(404);
  });

  it('GET /api/quizzes/:id/attempts lists attempts', async () => {
    mockDb.setResults([[{ id: 1, quizId: 1, userId: 'u1', score: 1, totalQuestions: 1, percentage: 100, answers: '[]', completedAt: new Date() }]]);
    const res = await app.request('/api/quizzes/1/attempts', { headers: AUTH });
    expect((await res.json() as any).attempts).toHaveLength(1);
  });

  it('GET /api/quizzes/:id/leaderboard ranks best attempts', async () => {
    mockDb.setResults([
      [quiz], // quiz lookup
      [{ userId: 'u1', bestPercentage: 90, firstAchieved: '2024-01-01T00:00:00Z' }], // best per user
      [{ id: 'u1', nickname: 'One', avatarImage: null }], // user rows
      [{ percentage: 90 }], // getUserBestAttempt
    ]);
    const res = await app.request('/api/quizzes/1/leaderboard', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.leaderboard[0].best_percentage).toBe(90);
    expect(body.user_in_top).toBe(true);
  });

  it('GET /api/user/quiz-stats returns zeros when no attempts', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/user/quiz-stats', { headers: AUTH });
    expect((await res.json() as any).total_attempts).toBe(0);
  });

  it('GET /api/user/quiz-stats aggregates attempts', async () => {
    mockDb.setResults([
      [
        { quizId: 1, score: 8, totalQuestions: 10, percentage: 80 },
        { quizId: 2, score: 5, totalQuestions: 10, percentage: 50 },
      ],
    ]);
    const res = await app.request('/api/user/quiz-stats', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.total_attempts).toBe(2);
    expect(body.quizzes_completed).toBe(2);
    expect(body.best_percentage).toBe(80);
  });

  it('GET /api/user/quiz-attempts paginates', async () => {
    mockDb.setResults([[{ id: 1, quizId: 1, userId: 'u1', score: 1, totalQuestions: 1, percentage: 100, answers: '[]', completedAt: new Date() }]]);
    const res = await app.request('/api/user/quiz-attempts?skip=0&limit=5', { headers: AUTH });
    expect((await res.json() as any).attempts).toHaveLength(1);
  });
});
