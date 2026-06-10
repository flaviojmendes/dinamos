import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = {
  getRoleByName: vi.fn(),
  getRoleRow: vi.fn(),
  getPermissionCodesForRole: vi.fn(async () => [] as string[]),
  getUserContext: vi.fn(),
};
const email = { sendSystemNotificationEmail: vi.fn(async () => true) };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/email', () => email);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'admin', email: 'a@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const userRow = {
  id: 'u1',
  email: 'u1@example.com',
  nickname: 'Uno',
  role: 'Estudante',
  roleId: 2,
  avatarImage: null,
  githubUsername: null,
  tokens: 10,
  onboardingCompleted: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: null,
};
const adminRole = { id: 1, name: 'Admin', color: '#fff', description: 'admins' };
const adminCtx = { user: userRow, role: adminRole, permissionCodes: ['MANAGE'] };

function asAdmin() {
  repo.getUserContext.mockResolvedValue(adminCtx);
}

beforeEach(() => {
  mockDb.reset();
  repo.getRoleByName.mockReset();
  repo.getRoleRow.mockReset();
  repo.getPermissionCodesForRole.mockReset().mockResolvedValue([]);
  repo.getUserContext.mockReset();
  email.sendSystemNotificationEmail.mockReset().mockResolvedValue(true);
});

describe('admin guard', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/admin/users')).status).toBe(401);
  });
  it('403 for non-admins', async () => {
    repo.getUserContext.mockResolvedValue({ user: { role: 'Estudante' }, role: { name: 'Estudante' }, permissionCodes: [] });
    expect((await app.request('/api/admin/users', { headers: AUTH })).status).toBe(403);
  });
});

describe('admin users', () => {
  it('GET /api/admin/users lists enriched users', async () => {
    asAdmin();
    mockDb.setResults([
      [userRow], // allRows
      [{ userId: 'u1', quizId: 1, best: 80 }], // quizStatsByUser
      [adminRole], // roleRows
    ]);
    const res = await app.request('/api/admin/users?sort_by=tokens&sort_desc=false', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.total).toBe(1);
    expect(body.users[0].avg_quiz_score).toBe(80);
  });

  it('GET /api/admin/users returns empty when role filter unknown', async () => {
    asAdmin();
    repo.getRoleByName.mockResolvedValue(null);
    const res = await app.request('/api/admin/users?role=Ghost', { headers: AUTH });
    expect((await res.json() as any).total).toBe(0);
  });

  it('PUT /api/admin/users/:id/role updates role', async () => {
    asAdmin();
    repo.getRoleByName.mockResolvedValue(adminRole);
    mockDb.setResults([[userRow], undefined]);
    const res = await app.request('/api/admin/users/u1/role', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ role: 'Admin' }),
    });
    expect(res.status).toBe(200);
  });

  it('PUT role 400 when role unknown', async () => {
    asAdmin();
    repo.getRoleByName.mockResolvedValue(null);
    const res = await app.request('/api/admin/users/u1/role', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ role: 'Ghost' }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT role 404 when user missing', async () => {
    asAdmin();
    repo.getRoleByName.mockResolvedValue(adminRole);
    mockDb.setResults([[]]);
    const res = await app.request('/api/admin/users/u1/role', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ role: 'Admin' }),
    });
    expect(res.status).toBe(404);
  });

  it('PUT reset-onboarding', async () => {
    asAdmin();
    mockDb.setResults([[userRow], undefined]);
    const res = await app.request('/api/admin/users/u1/reset-onboarding', { method: 'PUT', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('GET token-transactions', async () => {
    asAdmin();
    mockDb.setResults([
      [userRow], // target
      [{ count: 1 }], // total
      [{ id: 1, amount: 5, actionType: 'CREATE_TOPIC', relatedId: null, relatedType: null, createdAt: new Date() }],
    ]);
    const res = await app.request('/api/admin/users/u1/token-transactions', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.total).toBe(1);
    expect(body.transactions[0].action_description).toMatch(/tópico/);
  });
});

describe('admin roles & permissions', () => {
  it('GET roles', async () => {
    asAdmin();
    mockDb.setResults([[adminRole]]);
    const res = await app.request('/api/admin/roles', { headers: AUTH });
    expect((await res.json() as any).roles).toHaveLength(1);
  });

  it('POST roles creates a role', async () => {
    asAdmin();
    repo.getRoleByName.mockResolvedValue(null);
    repo.getRoleRow.mockResolvedValue(adminRole);
    mockDb.setResults([[adminRole], undefined]);
    const res = await app.request('/api/admin/roles', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ name: 'Mod', color: '#0f0' }),
    });
    expect(res.status).toBe(200);
  });

  it('POST roles 400 when exists', async () => {
    asAdmin();
    repo.getRoleByName.mockResolvedValue(adminRole);
    const res = await app.request('/api/admin/roles', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ name: 'Admin', color: '#fff' }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT roles/:id updates', async () => {
    asAdmin();
    repo.getRoleRow.mockResolvedValue(adminRole);
    mockDb.setResults([undefined]);
    const res = await app.request('/api/admin/roles/1', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ name: 'Mod', color: '#0f0', description: 'd' }),
    });
    expect(res.status).toBe(200);
  });

  it('PUT roles/:id 404', async () => {
    asAdmin();
    repo.getRoleRow.mockResolvedValue(null);
    const res = await app.request('/api/admin/roles/1', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ name: 'Mod' }),
    });
    expect(res.status).toBe(404);
  });

  it('DELETE roles/:id', async () => {
    asAdmin();
    repo.getRoleRow.mockResolvedValue(adminRole);
    mockDb.setResults([undefined]);
    const res = await app.request('/api/admin/roles/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('DELETE roles/:id 404', async () => {
    asAdmin();
    repo.getRoleRow.mockResolvedValue(null);
    const res = await app.request('/api/admin/roles/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('GET permissions', async () => {
    asAdmin();
    mockDb.setResults([[{ code: 'A', description: 'd' }]]);
    const res = await app.request('/api/admin/permissions', { headers: AUTH });
    expect((await res.json() as any).permissions).toHaveLength(1);
  });
});

describe('admin challenges', () => {
  const challenge = { id: 'c1', title: 'T', subtitle: null, description: 'd', difficulty: 'easy', category: 'cat', order: 1, evaluationPrompt: null, initialRequirements: null, videoSolutionUrl: null, videoSolutionReleaseDate: null };
  it('POST challenge', async () => {
    asAdmin();
    mockDb.setResults([[], [challenge]]);
    const res = await app.request('/api/admin/challenges', {
      method: 'POST', headers: AUTH,
      body: JSON.stringify({ id: 'c1', title: 'T', description: 'd', difficulty: 'easy', category: 'cat', video_solution_release_date: '2024-01-01' }),
    });
    expect(res.status).toBe(201);
  });
  it('POST challenge 400 duplicate', async () => {
    asAdmin();
    mockDb.setResults([[challenge]]);
    const res = await app.request('/api/admin/challenges', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ id: 'c1', title: 'T', description: 'd', difficulty: 'e', category: 'c' }),
    });
    expect(res.status).toBe(400);
  });
  it('PUT challenge', async () => {
    asAdmin();
    mockDb.setResults([[challenge]]);
    const res = await app.request('/api/admin/challenges/c1', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ title: 'New', order: 2, video_solution_release_date: null }),
    });
    expect(res.status).toBe(200);
  });
  it('PUT challenge 404', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    const res = await app.request('/api/admin/challenges/c1', { method: 'PUT', headers: AUTH, body: JSON.stringify({ title: 'x' }) });
    expect(res.status).toBe(404);
  });
  it('DELETE challenge', async () => {
    asAdmin();
    mockDb.setResults([[challenge]]);
    const res = await app.request('/api/admin/challenges/c1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });
});

describe('admin forum categories', () => {
  const cat = { id: 1, name: 'General', color: '#fff', description: 'd', order: 1, createdAt: new Date(), updatedAt: null };
  it('GET categories', async () => {
    asAdmin();
    mockDb.setResults([[cat]]);
    const res = await app.request('/api/admin/forum/categories', { headers: AUTH });
    expect((await res.json() as any).categories).toHaveLength(1);
  });
  it('POST category', async () => {
    asAdmin();
    mockDb.setResults([[], [cat]]);
    const res = await app.request('/api/admin/forum/categories', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ name: 'General' }),
    });
    expect(res.status).toBe(201);
  });
  it('PUT category', async () => {
    asAdmin();
    mockDb.setResults([[], [cat]]);
    const res = await app.request('/api/admin/forum/categories/1', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ name: 'General2', color: '#000', order: 2 }),
    });
    expect(res.status).toBe(200);
  });
  it('GET topics-count', async () => {
    asAdmin();
    mockDb.setResults([[cat], [{ count: 3 }]]);
    const res = await app.request('/api/admin/forum/categories/1/topics-count', { headers: AUTH });
    expect((await res.json() as any).topics_count).toBe(3);
  });
  it('DELETE category (no topics)', async () => {
    asAdmin();
    mockDb.setResults([[cat], [{ count: 0 }], undefined]);
    const res = await app.request('/api/admin/forum/categories/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });
  it('DELETE category 400 with topics and no reassign', async () => {
    asAdmin();
    mockDb.setResults([[cat], [{ count: 5 }]]);
    const res = await app.request('/api/admin/forum/categories/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(400);
  });
  it('PUT topic category', async () => {
    asAdmin();
    mockDb.setResults([[cat], [{ id: 1, title: 'T', content: 'c', userId: 'u1', category: 'General', createdAt: new Date(), updatedAt: null }]]);
    const res = await app.request('/api/admin/forum/topics/1/category', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ category: 'General' }),
    });
    expect(res.status).toBe(200);
  });
});

describe('admin dashboard & growth', () => {
  it('GET dashboard', async () => {
    asAdmin();
    mockDb.setResults([
      [{ c: 5 }], // totalUsers
      [{ c: 3 }], // activeUsers30d (union: quizzes + solutions + reads)
      [{ c: 1 }], // newUsersWeek
      [{ c: 3 }], // totalChallenges
      [{ c: 4 }], // submittedSolutions
      [{ c: 2 }], // usersCompleted
      [{ challenge_id: 'c1', title: 'T', count: 2 }], // solutionsPerChallenge
      [{ diagramData: null, step3Content: 'x', step2Content: null, step1Content: null, step0Content: null }], // drafts
      [{ c: 2 }], // totalQuizzes
      [{ c: 1 }], // publishedQuizzes
      [{ c: 7 }], // totalQuizAttempts
      [{ c: 3 }], // uniqueQuizTakers
      [{ a: 55 }], // avgQuizScore
      [{ id: 1, title: 'Q', theme: 't', attempts: 5, unique_users: 3, avg_score: 55 }], // quizStatsRows
      [{ theme: 't', count: 2 }], // themeRows
      [{ c: 4 }], // totalTopics
      [{ c: 9 }], // totalMessages
      [{ category: 'General', count: 4 }], // topicsPerCategory
      [{ d: '2024-01-01', c: 1 }], // solByDay
      [{ d: '2024-01-01', c: 1 }], // quizByDay
      [{ d: '2024-01-01', c: 1 }], // usersByDay
      [{ d: '2024-01-01', c: 4 }], // readsByDay
      [{ id: 1, challengeId: 'c1', createdAt: new Date(), nickname: 'N', challengeTitle: 'T' }], // recentSolutions
    ]);
    const res = await app.request('/api/admin/dashboard', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.users.total).toBe(5);
    expect(body.users.active_30_days).toBe(3);
    expect(body.activity_timeline).toHaveLength(31);
    expect(body.activity_timeline[0]).toHaveProperty('reads');
  });

  it('GET user-growth', async () => {
    asAdmin();
    mockDb.setResults([[{ date: '2024-01-01', count: 2 }]]);
    const res = await app.request('/api/admin/user-growth?start_date=2024-01-01&end_date=2024-01-03', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.total_new_users).toBe(2);
  });

  it('GET user-growth 400 missing params', async () => {
    asAdmin();
    const res = await app.request('/api/admin/user-growth', { headers: AUTH });
    expect(res.status).toBe(400);
  });

  it('GET user-growth 400 invalid date', async () => {
    asAdmin();
    const res = await app.request('/api/admin/user-growth?start_date=bad&end_date=also-bad', { headers: AUTH });
    expect(res.status).toBe(400);
  });
});

describe('admin quizzes', () => {
  const quiz = { id: 1, title: 'Q', theme: 't', description: 'd', timeLimitSeconds: 30, isPublished: true, order: 1, createdAt: new Date(), updatedAt: null };
  const question = { id: 10, quizId: 1, questionText: 'Q?', explanation: 'e', order: 1 };
  const opts4 = [0, 1, 2, 3].map((i) => ({ option_text: 'O' + i, is_correct: i === 0 }));

  it('GET quizzes', async () => {
    asAdmin();
    mockDb.setResults([[quiz], [question], [{ id: 1, questionId: 10, optionText: 'A', order: 1, isCorrect: true }]]);
    const res = await app.request('/api/admin/quizzes', { headers: AUTH });
    expect((await res.json() as any).quizzes).toHaveLength(1);
  });

  it('GET quizzes/:id 404', async () => {
    asAdmin();
    mockDb.setResults([[]]);
    expect((await app.request('/api/admin/quizzes/1', { headers: AUTH })).status).toBe(404);
  });

  it('POST quizzes (with a question)', async () => {
    asAdmin();
    mockDb.setResults([
      [quiz], // insert quiz
      [{ m: 0 }], // max order
      [question], // insert question
      undefined, // insert options
      [question], // loadQuizQuestionsAdmin questions
      [{ id: 1, questionId: 10, optionText: 'A', order: 1, isCorrect: true }], // options
    ]);
    const res = await app.request('/api/admin/quizzes', {
      method: 'POST', headers: AUTH,
      body: JSON.stringify({ title: 'Q', theme: 't', questions: [{ question_text: 'Q?', options: opts4 }] }),
    });
    expect(res.status).toBe(201);
  });

  it('PUT quizzes/:id', async () => {
    asAdmin();
    mockDb.setResults([[quiz], []]);
    const res = await app.request('/api/admin/quizzes/1', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ title: 'New', is_published: true }),
    });
    expect(res.status).toBe(200);
  });

  it('DELETE quizzes/:id', async () => {
    asAdmin();
    mockDb.setResults([[quiz]]);
    const res = await app.request('/api/admin/quizzes/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST quizzes/:id/questions', async () => {
    asAdmin();
    mockDb.setResults([
      [quiz], // quiz lookup
      [{ m: 0 }], // max order
      [question], // insert question
      undefined, // insert options
      [{ id: 1, questionId: 10, optionText: 'A', order: 0, isCorrect: true }], // opts
    ]);
    const res = await app.request('/api/admin/quizzes/1/questions', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ question_text: 'Q?', options: opts4 }),
    });
    expect(res.status).toBe(201);
  });

  it('POST quizzes/:id/questions 400 wrong option count', async () => {
    asAdmin();
    mockDb.setResults([[quiz]]);
    const res = await app.request('/api/admin/quizzes/1/questions', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ question_text: 'Q?', options: [{ option_text: 'A', is_correct: true }] }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT question reorder', async () => {
    asAdmin();
    mockDb.setResults([undefined, undefined, [quiz], [question], [{ id: 1, questionId: 10, optionText: 'A', order: 1, isCorrect: true }]]);
    const res = await app.request('/api/admin/quizzes/1/questions/reorder', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ question_ids: [10, 11] }),
    });
    expect(res.status).toBe(200);
  });

  it('PUT question update', async () => {
    asAdmin();
    mockDb.setResults([
      [question], // lookup
      undefined, // update question
      undefined, // delete options
      undefined, // insert options
      [question], // updatedQ
      [{ id: 1, questionId: 10, optionText: 'A', order: 0, isCorrect: true }], // opts
    ]);
    const res = await app.request('/api/admin/quizzes/1/questions/10', {
      method: 'PUT', headers: AUTH, body: JSON.stringify({ question_text: 'New', options: opts4 }),
    });
    expect(res.status).toBe(200);
  });

  it('DELETE question', async () => {
    asAdmin();
    mockDb.setResults([[question], undefined]);
    const res = await app.request('/api/admin/quizzes/1/questions/10', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });
});

describe('admin notifications', () => {
  it('POST system 400 without user_id', async () => {
    asAdmin();
    const res = await app.request('/api/admin/notifications/system', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ title: 'T', message: 'M' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST system sends to one user', async () => {
    asAdmin();
    mockDb.setResults([[userRow], undefined]);
    const res = await app.request('/api/admin/notifications/system?user_id=u1', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ title: 'T', message: 'M' }),
    });
    expect(res.status).toBe(201);
  });

  it('POST broadcast', async () => {
    asAdmin();
    mockDb.setResults([[{ id: 'u1', email: 'u1@x.com', nickname: 'U' }], undefined]);
    const res = await app.request('/api/admin/notifications/broadcast', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ title: 'T', message: 'M' }),
    });
    const body = await res.json() as any;
    expect(body.notifications_created).toBe(1);
  });

  it('POST filtered (no role)', async () => {
    asAdmin();
    mockDb.setResults([[{ id: 'u1', email: 'u1@x.com', nickname: 'U' }], undefined]);
    const res = await app.request('/api/admin/notifications/filtered', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ title: 'T', message: 'M' }),
    });
    expect((await res.json() as any).notifications_created).toBe(1);
  });

  it('GET preview-count', async () => {
    asAdmin();
    mockDb.setResults([[{ c: 5 }]]);
    const res = await app.request('/api/admin/notifications/preview-count', { headers: AUTH });
    expect((await res.json() as any).count).toBe(5);
  });

  it('GET notifications/users', async () => {
    asAdmin();
    mockDb.setResults([[userRow], [adminRole]]);
    const res = await app.request('/api/admin/notifications/users?search=uno', { headers: AUTH });
    expect((await res.json() as any).total).toBe(1);
  });

  it('POST selected 400 when none', async () => {
    asAdmin();
    const res = await app.request('/api/admin/notifications/selected', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ title: 'T', message: 'M', user_ids: [] }),
    });
    expect(res.status).toBe(400);
  });

  it('POST selected sends to users', async () => {
    asAdmin();
    mockDb.setResults([[{ id: 'u1', email: 'u1@x.com', nickname: 'U' }], undefined]);
    const res = await app.request('/api/admin/notifications/selected', {
      method: 'POST', headers: AUTH, body: JSON.stringify({ title: 'T', message: 'M', user_ids: ['u1'] }),
    });
    expect((await res.json() as any).users_found).toBe(1);
  });
});
