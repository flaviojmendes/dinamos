import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/client.js';
import { polls, pollOptions, pollVotes, forumTopics } from '../db/schema.js';
import {
  authRequired,
  subscriptionRequired,
  type AppVariables,
} from '../middleware/auth.js';
import { getUserContext } from '../db/repo.js';
import { pollToDict } from '../db/serializers.js';

export const pollsRouter = new Hono<{ Variables: AppVariables }>();

async function loadPollWithOptions(pollId: number) {
  const pollRows = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (!pollRows[0]) return null;
  const options = await db
    .select()
    .from(pollOptions)
    .where(eq(pollOptions.pollId, pollId))
    .orderBy(asc(pollOptions.order));
  return { poll: pollRows[0], options };
}

async function getUserPollVotes(pollId: number, userId: string): Promise<number[]> {
  const rows = await db
    .select({ optionId: pollVotes.optionId })
    .from(pollVotes)
    .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, userId)));
  return rows.map((r) => r.optionId);
}

// Create poll ---------------------------------------------------------------
pollsRouter.post('/api/forum/topics/:id/poll', subscriptionRequired, async (c) => {
  const user = c.get('user');
  const topicId = Number(c.req.param('id'));
  const body = await c.req.json<{
    question: string;
    options: string[];
    allow_multiple?: boolean;
    ends_at?: string | null;
  }>();

  const topicRows = await db
    .select()
    .from(forumTopics)
    .where(eq(forumTopics.id, topicId))
    .limit(1);
  if (!topicRows[0]) throw new HTTPException(404, { message: 'Topic not found' });
  if (topicRows[0].userId !== user.uid)
    throw new HTTPException(403, { message: 'Only the topic owner can create a poll' });

  if (body.options.length < 2 || body.options.length > 10)
    throw new HTTPException(400, { message: 'Poll must have between 2 and 10 options' });

  const existing = await db.select().from(polls).where(eq(polls.topicId, topicId)).limit(1);
  if (existing[0]) throw new HTTPException(400, { message: 'Topic already has a poll' });

  const inserted = await db
    .insert(polls)
    .values({
      topicId,
      question: body.question,
      allowMultiple: body.allow_multiple ?? false,
      endsAt: body.ends_at ? new Date(body.ends_at) : null,
    })
    .returning();
  const poll = inserted[0];

  await db.insert(pollOptions).values(
    body.options.map((text, order) => ({
      pollId: poll.id,
      text: text.trim(),
      order,
    }))
  );

  const loaded = await loadPollWithOptions(poll.id);
  const userVotes = await getUserPollVotes(poll.id, user.uid);
  return c.json(pollToDict(loaded!.poll, loaded!.options, userVotes), 201);
});

// Get poll for topic --------------------------------------------------------
pollsRouter.get('/api/forum/topics/:id/poll', authRequired, async (c) => {
  const user = c.get('user');
  const topicId = Number(c.req.param('id'));
  const pollRows = await db.select().from(polls).where(eq(polls.topicId, topicId)).limit(1);
  if (!pollRows[0]) return c.json(null);
  const loaded = await loadPollWithOptions(pollRows[0].id);
  const userVotes = await getUserPollVotes(pollRows[0].id, user.uid);
  return c.json(pollToDict(loaded!.poll, loaded!.options, userVotes));
});

// Vote on poll --------------------------------------------------------------
pollsRouter.post('/api/forum/polls/:id/vote', subscriptionRequired, async (c) => {
  const user = c.get('user');
  const pollId = Number(c.req.param('id'));
  const body = await c.req.json<{ option_ids: number[] }>();

  const loaded = await loadPollWithOptions(pollId);
  if (!loaded) throw new HTTPException(400, { message: 'Poll not found' });
  const { poll } = loaded;
  if (poll.isClosed) throw new HTTPException(400, { message: 'Poll is closed' });
  if (poll.endsAt && new Date(poll.endsAt) < new Date())
    throw new HTTPException(400, { message: 'Poll has ended' });
  if (!poll.allowMultiple && body.option_ids.length > 1)
    throw new HTTPException(400, { message: 'This poll only allows one vote' });

  const validOptions = await db
    .select()
    .from(pollOptions)
    .where(and(eq(pollOptions.pollId, pollId), inArray(pollOptions.id, body.option_ids)));
  if (validOptions.length !== body.option_ids.length)
    throw new HTTPException(400, { message: 'Invalid option(s)' });

  const currentVotes = await db
    .select()
    .from(pollVotes)
    .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, user.uid)));
  const currentIds = new Set(currentVotes.map((v) => v.optionId));
  const newIds = new Set(body.option_ids);

  // Remove de-selected
  for (const v of currentVotes) {
    if (!newIds.has(v.optionId)) {
      const opt = await db
        .select()
        .from(pollOptions)
        .where(eq(pollOptions.id, v.optionId))
        .limit(1);
      if (opt[0])
        await db
          .update(pollOptions)
          .set({ voteCount: Math.max(0, (opt[0].voteCount ?? 0) - 1) })
          .where(eq(pollOptions.id, v.optionId));
      await db.delete(pollVotes).where(eq(pollVotes.id, v.id));
    }
  }
  // Add new
  for (const optionId of newIds) {
    if (!currentIds.has(optionId)) {
      await db.insert(pollVotes).values({ pollId, optionId, userId: user.uid });
      const opt = await db
        .select()
        .from(pollOptions)
        .where(eq(pollOptions.id, optionId))
        .limit(1);
      if (opt[0])
        await db
          .update(pollOptions)
          .set({ voteCount: (opt[0].voteCount ?? 0) + 1 })
          .where(eq(pollOptions.id, optionId));
    }
  }

  const reloaded = await loadPollWithOptions(pollId);
  return c.json(pollToDict(reloaded!.poll, reloaded!.options, Array.from(newIds)));
});

async function canManagePoll(userId: string, topicId: number): Promise<boolean> {
  const topicRows = await db
    .select()
    .from(forumTopics)
    .where(eq(forumTopics.id, topicId))
    .limit(1);
  if (topicRows[0] && topicRows[0].userId === userId) return true;
  const ctx = await getUserContext(userId);
  return ctx?.permissionCodes.includes('delete_any_topic') ?? false;
}

// Close poll ----------------------------------------------------------------
pollsRouter.put('/api/forum/polls/:id/close', authRequired, async (c) => {
  const user = c.get('user');
  const pollId = Number(c.req.param('id'));
  const pollRows = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (!pollRows[0]) throw new HTTPException(404, { message: 'Poll not found' });
  if (!(await canManagePoll(user.uid, pollRows[0].topicId)))
    throw new HTTPException(403, { message: 'Not authorized to close this poll' });
  await db.update(polls).set({ isClosed: true }).where(eq(polls.id, pollId));
  const loaded = await loadPollWithOptions(pollId);
  const userVotes = await getUserPollVotes(pollId, user.uid);
  return c.json(pollToDict(loaded!.poll, loaded!.options, userVotes));
});

// Delete poll ---------------------------------------------------------------
pollsRouter.delete('/api/forum/polls/:id', authRequired, async (c) => {
  const user = c.get('user');
  const pollId = Number(c.req.param('id'));
  const pollRows = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (!pollRows[0]) throw new HTTPException(404, { message: 'Poll not found' });
  if (!(await canManagePoll(user.uid, pollRows[0].topicId)))
    throw new HTTPException(403, { message: 'Not authorized to delete this poll' });
  await db.delete(polls).where(eq(polls.id, pollId));
  return c.json({ message: 'Poll deleted successfully' });
});
