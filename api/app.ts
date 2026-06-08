import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
import type { AppVariables } from './middleware/auth.js';
import { usersRouter } from './routes/users.js';
import { challengesRouter } from './routes/challenges.js';
import { forumRouter } from './routes/forum.js';
import { pollsRouter } from './routes/polls.js';
import { notificationsRouter } from './routes/notifications.js';
import { quizzesRouter } from './routes/quizzes.js';
import { leaderboardRouter } from './routes/leaderboard.js';
import { subscriptionRouter } from './routes/subscription.js';
import { adminRouter } from './routes/admin.js';
import { gameRouter } from './routes/game.js';
import { contentRouter } from './routes/content.js';
import { annotationsRouter } from './routes/annotations.js';
import { progressRouter } from './routes/progress.js';

const app = new Hono<{ Variables: AppVariables }>();

// Same-origin in production; allow the configured frontend origin otherwise.
const allowedOrigin = process.env.FRONTEND_URL ?? '*';
app.use(
  '*',
  cors({
    origin: allowedOrigin,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: allowedOrigin !== '*',
  })
);

app.get('/api', (c) => c.json({ message: 'Dinamos API', status: 'running' }));
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Mount route modules (each declares absolute /api/... paths)
app.route('/', subscriptionRouter);
app.route('/', usersRouter);
app.route('/', challengesRouter);
app.route('/', forumRouter);
app.route('/', pollsRouter);
app.route('/', notificationsRouter);
app.route('/', quizzesRouter);
app.route('/', leaderboardRouter);
app.route('/', adminRouter);
app.route('/', gameRouter);
app.route('/', contentRouter);
app.route('/', annotationsRouter);
app.route('/', progressRouter);

// FastAPI-compatible error shape: { detail: string }
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ detail: err.message }, err.status);
  }
  console.error('[api] Unhandled error:', err);
  return c.json({ detail: 'Internal Server Error' }, 500);
});

app.notFound((c) => c.json({ detail: 'Not Found' }, 404));

export default app;
