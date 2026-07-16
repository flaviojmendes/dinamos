import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { and, asc, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import {
  forumTopics,
  forumMessages,
  forumCategories,
  votes,
  notifications,
} from '../db/schema.js';
import {
  authRequired,
  optionalAuth,
  type AppVariables,
} from '../middleware/auth.js';
import { maxBodyBytes, rateLimit } from '../middleware/guardrails.js';
import {
  awardTokens,
  getUserBatchAuthors,
  getUserContext,
  getUserRow,
} from '../db/repo.js';
import {
  forumTopicToDict,
  forumMessageToDict,
  forumCategoryToDict,
  authorToDict,
} from '../db/serializers.js';

export const forumRouter = new Hono<{ Variables: AppVariables }>();

function authorFor(map: Map<string, any>, userId: string) {
  const entry = map.get(userId);
  if (!entry) return undefined;
  return authorToDict(
    {
      nickname: entry.user.nickname,
      avatarImage: entry.user.avatarImage,
      role: entry.user.role,
    },
    entry.role?.color ?? '#3B82F6'
  );
}

// Public categories (now requires auth, was previously open) ----------------
forumRouter.get('/api/forum/categories', authRequired, async (c) => {
  const rows = await db
    .select()
    .from(forumCategories)
    .orderBy(asc(forumCategories.order), asc(forumCategories.name));
  return c.json({ categories: rows.map(forumCategoryToDict) });
});

// List topics ---------------------------------------------------------------
forumRouter.get('/api/forum/topics', authRequired, async (c) => {
  const category = c.req.query('category');
  const sort = c.req.query('sort') ?? 'recent';
  const skip = Math.max(0, Number(c.req.query('skip') ?? '0'));
  const limit = Math.min(Math.max(1, Number(c.req.query('limit') ?? '100')), 100);

  const conditions = category ? [eq(forumTopics.category, category)] : [];
  let order;
  if (sort === 'top' || sort === 'popular')
    order = [desc(sql`coalesce(${forumTopics.upvotes}, 0)`), desc(forumTopics.createdAt)];
  else if (sort === 'active') order = [desc(forumTopics.updatedAt)];
  else order = [desc(forumTopics.createdAt)];

  const rows = await db
    .select()
    .from(forumTopics)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...order)
    .offset(skip)
    .limit(limit);

  const authorMap = await getUserBatchAuthors(rows.map((t) => t.userId));

  // comment counts
  const topicIds = rows.map((t) => t.id);
  const countMap = new Map<number, number>();
  if (topicIds.length) {
    const counts = await db
      .select({ topicId: forumMessages.topicId, count: sql<number>`count(*)` })
      .from(forumMessages)
      .where(inArray(forumMessages.topicId, topicIds))
      .groupBy(forumMessages.topicId);
    for (const r of counts) countMap.set(r.topicId, Number(r.count));
  }

  const result = rows.map((t) => ({
    ...forumTopicToDict(t),
    comment_count: countMap.get(t.id) ?? 0,
    author: authorFor(authorMap, t.userId),
  }));
  return c.json({ topics: result });
});

// Create topic --------------------------------------------------------------
forumRouter.post(
  '/api/forum/topics',
  rateLimit({ windowMs: 60_000, max: 20, keyPrefix: 'forum-topic' }),
  maxBodyBytes(256_000),
  authRequired,
  async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{ title: string; content: string; category: string }>();
  const cat = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.name, body.category))
    .limit(1);
  if (!cat[0]) throw new HTTPException(400, { message: 'Invalid category' });

  const inserted = await db
    .insert(forumTopics)
    .values({
      title: body.title,
      content: body.content,
      userId: user.uid,
      category: body.category,
    })
    .returning();
  const topic = inserted[0];
  await awardTokens(user.uid, 5, 'CREATE_TOPIC', topic.id, 'topic');
  return c.json(forumTopicToDict(topic), 201);
  }
);

// Get topic + messages ------------------------------------------------------
forumRouter.get('/api/forum/topics/:id', authRequired, async (c) => {
  const topicId = Number(c.req.param('id'));
  const sortMessages = c.req.query('sort_messages') ?? 'oldest';
  const msgSkip = Math.max(0, Number(c.req.query('msg_skip') ?? '0'));
  const msgLimit = Math.min(Math.max(1, Number(c.req.query('msg_limit') ?? '100')), 200);

  const topicRows = await db
    .select()
    .from(forumTopics)
    .where(eq(forumTopics.id, topicId))
    .limit(1);
  if (!topicRows[0]) throw new HTTPException(404, { message: 'Topic not found' });
  const topic = topicRows[0];

  let order;
  if (sortMessages === 'top')
    order = [desc(sql`coalesce(${forumMessages.upvotes}, 0)`), asc(forumMessages.createdAt)];
  else if (sortMessages === 'recent') order = [desc(forumMessages.createdAt)];
  else order = [asc(forumMessages.createdAt)];

  const totalRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(forumMessages)
    .where(eq(forumMessages.topicId, topicId));
  const msgTotal = Number(totalRows[0]?.count ?? 0);

  const messages = await db
    .select()
    .from(forumMessages)
    .where(eq(forumMessages.topicId, topicId))
    .orderBy(...order)
    .offset(msgSkip)
    .limit(msgLimit);

  const userIds = [topic.userId, ...messages.map((m) => m.userId)];
  const authorMap = await getUserBatchAuthors(userIds);

  const topicData = {
    ...forumTopicToDict(topic),
    author: authorFor(authorMap, topic.userId),
  };
  const messagesData = messages.map((m) => ({
    ...forumMessageToDict(m),
    author: authorFor(authorMap, m.userId),
  }));
  return c.json({
    topic: topicData,
    messages: messagesData,
    msg_total: msgTotal,
    msg_skip: msgSkip,
    msg_limit: msgLimit,
  });
});

/** Parent depth via one recursive CTE instead of N round-trips. */
async function parentMessageDepth(parentId: number): Promise<number> {
  const rows = (await db.execute(sql`
    WITH RECURSIVE chain AS (
      SELECT id, parent_id, 0 AS depth
      FROM forum_messages
      WHERE id = ${parentId}
      UNION ALL
      SELECT m.id, m.parent_id, chain.depth + 1
      FROM forum_messages m
      INNER JOIN chain ON m.id = chain.parent_id
    )
    SELECT max(depth) AS depth FROM chain
  `)) as { depth: number | string | null }[];
  return Number(rows[0]?.depth ?? 0);
}

// Create message (reply) ----------------------------------------------------
forumRouter.post(
  '/api/forum/topics/:id/messages',
  rateLimit({ windowMs: 60_000, max: 40, keyPrefix: 'forum-reply' }),
  maxBodyBytes(512_000),
  authRequired,
  async (c) => {
  const user = c.get('user');
  const topicId = Number(c.req.param('id'));
  const body = await c.req.json<{
    content: string;
    diagram?: Record<string, any> | null;
    parent_id?: number | null;
  }>();

  const topicRows = await db
    .select()
    .from(forumTopics)
    .where(eq(forumTopics.id, topicId))
    .limit(1);
  if (!topicRows[0]) throw new HTTPException(404, { message: 'Topic not found' });
  const topic = topicRows[0];

  if (body.parent_id) {
    const parentRows = await db
      .select()
      .from(forumMessages)
      .where(eq(forumMessages.id, body.parent_id))
      .limit(1);
    if (!parentRows[0])
      throw new HTTPException(400, { message: `Parent message ${body.parent_id} not found` });
    if (parentRows[0].topicId !== topicId)
      throw new HTTPException(400, {
        message: 'Parent message must belong to the same topic',
      });
    const depth = await parentMessageDepth(body.parent_id);
    if (depth >= 2)
      throw new HTTPException(400, { message: 'Maximum reply depth is 2 levels' });
  }

  const inserted = await db
    .insert(forumMessages)
    .values({
      topicId,
      parentId: body.parent_id ?? null,
      userId: user.uid,
      content: body.content,
      diagramData: body.diagram ? JSON.stringify(body.diagram) : null,
    })
    .returning();
  const message = inserted[0];

  await db
    .update(forumTopics)
    .set({ updatedAt: new Date() })
    .where(eq(forumTopics.id, topicId));

  await awardTokens(user.uid, 2, 'CREATE_REPLY', message.id, 'message');

  // Reward topic owner (within 90 days, not self)
  if (topic.userId !== user.uid) {
    const created = topic.createdAt ? new Date(topic.createdAt) : new Date();
    const ageDays = (Date.now() - created.getTime()) / 86400000;
    if (ageDays < 90)
      await awardTokens(topic.userId, 2, 'RECEIVE_REPLY', topic.id, 'topic');
  }

  const author = await getUserRow(user.uid);
  const replyAuthorName = author?.nickname ?? 'Alguém';
  const messageData = {
    ...forumMessageToDict(message),
    author: author
      ? authorToDict(
          { nickname: author.nickname, avatarImage: author.avatarImage, role: author.role },
          (await getUserContext(user.uid))?.role?.color ?? '#3B82F6'
        )
      : undefined,
  };

  // Notifications (fire-and-forget, do not fail the request)
  try {
    const { sendForumReplyNotification, sendMessageReplyNotification } = await import(
      '../lib/email.js'
    );
    if (body.parent_id) {
      const parentRows = await db
        .select()
        .from(forumMessages)
        .where(eq(forumMessages.id, body.parent_id))
        .limit(1);
      const parentMsg = parentRows[0];
      if (parentMsg) {
        const parentAuthor = await getUserRow(parentMsg.userId);
        if (parentAuthor && parentAuthor.id !== user.uid) {
          await createReplyNotification(
            parentAuthor.id,
            topic.id,
            topic.title,
            author,
            body.content,
            false
          );
          if (parentAuthor.email) {
            await sendMessageReplyNotification({
              messageAuthorEmail: parentAuthor.email,
              messageAuthorNickname:
                parentAuthor.nickname || parentAuthor.email.split('@')[0],
              topicTitle: topic.title,
              topicId: topic.id,
              replyAuthorNickname: replyAuthorName,
              replyContent: body.content,
              parentMessageContent: parentMsg.content.slice(0, 100),
            });
          }
        }
      }
    } else {
      const topicAuthor = await getUserRow(topic.userId);
      if (topicAuthor && topicAuthor.id !== user.uid) {
        await createReplyNotification(
          topicAuthor.id,
          topic.id,
          topic.title,
          author,
          body.content,
          true
        );
        if (topicAuthor.email) {
          await sendForumReplyNotification({
            topicAuthorEmail: topicAuthor.email,
            topicAuthorNickname:
              topicAuthor.nickname || topicAuthor.email.split('@')[0],
            topicTitle: topic.title,
            topicId: topic.id,
            replyAuthorNickname: replyAuthorName,
          });
        }
      }
    }
  } catch (e) {
    console.error('[forum] notification error:', e);
  }

  return c.json(messageData, 201);
  }
);

async function createReplyNotification(
  recipientUserId: string,
  topicId: number,
  topicTitle: string,
  actor: { id: string; nickname: string | null; avatarImage: string | null } | null,
  replyPreview: string,
  isTopicReply: boolean
) {
  if (!actor || recipientUserId === actor.id) return;
  const preview =
    replyPreview.length > 100 ? replyPreview.slice(0, 100) + '...' : replyPreview;
  const title = isTopicReply
    ? `${actor.nickname || 'Alguém'} respondeu ao seu tópico`
    : `${actor.nickname || 'Alguém'} respondeu ao seu comentário`;
  await db.insert(notifications).values({
    userId: recipientUserId,
    type: 'reply',
    title,
    message: `Em "${topicTitle}": ${preview}`,
    linkType: 'topic',
    linkId: topicId,
    actorId: actor.id,
    actorNickname: actor.nickname,
    actorAvatar: actor.avatarImage,
  });
}

// Update topic --------------------------------------------------------------
forumRouter.put('/api/forum/topics/:id', authRequired, async (c) => {
  const user = c.get('user');
  const topicId = Number(c.req.param('id'));
  const body = await c.req.json<{ title?: string; content?: string }>();
  const rows = await db
    .select()
    .from(forumTopics)
    .where(eq(forumTopics.id, topicId))
    .limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Topic not found' });
  if (rows[0].userId !== user.uid)
    throw new HTTPException(403, { message: 'Not authorized to edit this topic' });

  const updates: Record<string, unknown> = {};
  if (body.title != null) updates.title = body.title;
  if (body.content != null) updates.content = body.content;
  const updated = await db
    .update(forumTopics)
    .set(updates)
    .where(eq(forumTopics.id, topicId))
    .returning();

  const ctx = await getUserContext(user.uid);
  const topicData = {
    ...forumTopicToDict(updated[0]),
    author: ctx
      ? authorToDict(
          { nickname: ctx.user.nickname, avatarImage: ctx.user.avatarImage, role: ctx.user.role },
          ctx.role?.color ?? '#3B82F6'
        )
      : undefined,
  };
  return c.json({ topic: topicData });
});

// Delete topic --------------------------------------------------------------
forumRouter.delete('/api/forum/topics/:id', authRequired, async (c) => {
  const user = c.get('user');
  const topicId = Number(c.req.param('id'));
  const rows = await db
    .select()
    .from(forumTopics)
    .where(eq(forumTopics.id, topicId))
    .limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Topic not found' });

  const ctx = await getUserContext(user.uid);
  const canDelete =
    rows[0].userId === user.uid || (ctx?.permissionCodes.includes('delete_any_topic') ?? false);
  if (!canDelete)
    throw new HTTPException(403, { message: 'Not authorized to delete this topic' });

  // Clean up messages and votes
  const msgIds = await db
    .select({ id: forumMessages.id })
    .from(forumMessages)
    .where(eq(forumMessages.topicId, topicId));
  await db.delete(forumMessages).where(eq(forumMessages.topicId, topicId));
  await db.delete(votes).where(eq(votes.topicId, topicId));
  if (msgIds.length)
    await db.delete(votes).where(inArray(votes.messageId, msgIds.map((m) => m.id)));
  await db.delete(forumTopics).where(eq(forumTopics.id, topicId));
  return c.json({ message: 'Topic deleted successfully' });
});

// Update message ------------------------------------------------------------
forumRouter.put('/api/forum/messages/:id', authRequired, async (c) => {
  const user = c.get('user');
  const messageId = Number(c.req.param('id'));
  const body = await c.req.json<{ content?: string; diagram?: Record<string, any> | null }>();
  const rows = await db
    .select()
    .from(forumMessages)
    .where(eq(forumMessages.id, messageId))
    .limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Message not found' });
  if (rows[0].userId !== user.uid)
    throw new HTTPException(403, { message: 'Not authorized to edit this message' });

  const updates: Record<string, unknown> = {};
  if (body.content != null) updates.content = body.content;
  if (body.diagram !== undefined)
    updates.diagramData = body.diagram ? JSON.stringify(body.diagram) : null;
  const updated = await db
    .update(forumMessages)
    .set(updates)
    .where(eq(forumMessages.id, messageId))
    .returning();

  const ctx = await getUserContext(user.uid);
  const messageData = {
    ...forumMessageToDict(updated[0]),
    author: ctx
      ? authorToDict(
          { nickname: ctx.user.nickname, avatarImage: ctx.user.avatarImage, role: ctx.user.role },
          ctx.role?.color ?? '#3B82F6'
        )
      : undefined,
  };
  return c.json({ message: messageData });
});

// Delete message ------------------------------------------------------------
forumRouter.delete('/api/forum/messages/:id', authRequired, async (c) => {
  const user = c.get('user');
  const messageId = Number(c.req.param('id'));
  const rows = await db
    .select()
    .from(forumMessages)
    .where(eq(forumMessages.id, messageId))
    .limit(1);
  if (!rows[0]) throw new HTTPException(404, { message: 'Message not found' });
  const ctx = await getUserContext(user.uid);
  const canDelete =
    rows[0].userId === user.uid ||
    (ctx?.permissionCodes.includes('delete_any_message') ?? false);
  if (!canDelete)
    throw new HTTPException(403, { message: 'Not authorized to delete this message' });
  await db.delete(votes).where(eq(votes.messageId, messageId));
  await db.delete(forumMessages).where(eq(forumMessages.id, messageId));
  return c.json({ message: 'Message deleted successfully' });
});

// Vote ----------------------------------------------------------------------
forumRouter.post('/api/forum/vote', authRequired, async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{ topic_id?: number; message_id?: number }>();
  const topicId = body.topic_id ?? null;
  const messageId = body.message_id ?? null;
  if (!topicId && !messageId)
    throw new HTTPException(400, { message: 'Either topic_id or message_id is required' });

  const result = await toggleVote(user.uid, topicId, messageId);
  return c.json(result);
});

async function toggleVote(
  userId: string,
  topicId: number | null,
  messageId: number | null
) {
  const existingRows = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.userId, userId),
        topicId ? eq(votes.topicId, topicId) : eq(votes.messageId, messageId!)
      )
    )
    .limit(1);

  const table = topicId ? forumTopics : forumMessages;
  const targetId = (topicId ?? messageId)!;
  const targetRows = await db
    .select()
    .from(table as any)
    .where(eq((table as any).id, targetId))
    .limit(1);
  const target = targetRows[0] as any;
  if (!target) return { upvotes: 0, has_voted: false };

  let hasVoted: boolean;
  let newUpvotes: number;
  if (existingRows[0]) {
    await db.delete(votes).where(eq(votes.id, existingRows[0].id));
    newUpvotes = Math.max(0, (target.upvotes ?? 0) - 1);
    hasVoted = false;
  } else {
    await db.insert(votes).values({ userId, topicId, messageId });
    newUpvotes = (target.upvotes ?? 0) + 1;
    hasVoted = true;

    if (target.userId !== userId) {
      const created = target.createdAt ? new Date(target.createdAt) : new Date();
      const ageDays = (Date.now() - created.getTime()) / 86400000;
      if (ageDays < 90) {
        if (topicId) {
          await awardTokens(target.userId, 3, 'RECEIVE_UPVOTE_TOPIC', topicId, 'topic');
          const last24h = new Date(Date.now() - 24 * 3600 * 1000);
          const recentRows = await db
            .select({ count: sql<number>`count(*)` })
            .from(votes)
            .where(and(eq(votes.topicId, topicId), gte(votes.createdAt, last24h)));
          if (Number(recentRows[0]?.count ?? 0) >= 10)
            await awardTokens(target.userId, 20, 'QUALITY_BONUS', topicId, 'topic');
        } else if (messageId) {
          await awardTokens(
            target.userId,
            1,
            'RECEIVE_UPVOTE_COMMENT',
            messageId,
            'message'
          );
        }
      }
    }
  }

  await db
    .update(table as any)
    .set({ upvotes: newUpvotes })
    .where(eq((table as any).id, targetId));
  return { upvotes: newUpvotes, has_voted: hasVoted };
}

// User votes ----------------------------------------------------------------
forumRouter.get('/api/forum/user/votes', authRequired, async (c) => {
  const user = c.get('user');
  const topicIds = (c.req.query('topic_ids') ?? '')
    .split(',')
    .filter((s) => /^\d+$/.test(s))
    .map(Number);
  const messageIds = (c.req.query('message_ids') ?? '')
    .split(',')
    .filter((s) => /^\d+$/.test(s))
    .map(Number);

  const rows = await db.select().from(votes).where(eq(votes.userId, user.uid));
  const votedTopics = rows
    .filter((v) => v.topicId != null && topicIds.includes(v.topicId))
    .map((v) => v.topicId);
  const votedMessages = rows
    .filter((v) => v.messageId != null && messageIds.includes(v.messageId))
    .map((v) => v.messageId);
  return c.json({ topics: votedTopics, messages: votedMessages });
});
