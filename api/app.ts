import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
import type { AppVariables } from './middleware/auth';
import { usersRouter } from './routes/users';
import { challengesRouter } from './routes/challenges';
import { forumRouter } from './routes/forum';
import { pollsRouter } from './routes/polls';
import { notificationsRouter } from './routes/notifications';
import { quizzesRouter } from './routes/quizzes';
import { leaderboardRouter } from './routes/leaderboard';
import { subscriptionRouter } from './routes/subscription';
import { adminRouter } from './routes/admin';
import { gameRouter } from './routes/game';

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
