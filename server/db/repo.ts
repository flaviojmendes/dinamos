import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import { db } from './client.js';
import {
  roles,
  permissions,
  rolePermissions,
  users,
  tokenTransactions,
} from './schema.js';

export interface UserContext {
  user: typeof users.$inferSelect;
  role: typeof roles.$inferSelect | null;
  permissionCodes: string[];
}

export async function getUserRow(userId: string) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return rows[0] ?? null;
}

export async function getRoleRow(roleId: number | null) {
  if (roleId == null) return null;
  const rows = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
  return rows[0] ?? null;
}

export async function getPermissionCodesForRole(
  roleId: number | null
): Promise<string[]> {
  if (roleId == null) return [];
  const rows = await db
    .select({ code: permissions.code })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
  return rows.map((r) => r.code);
}

export async function getUserContext(
  userId: string
): Promise<UserContext | null> {
  const user = await getUserRow(userId);
  if (!user) return null;
  const role = await getRoleRow(user.roleId);
  const permissionCodes = await getPermissionCodesForRole(user.roleId);
  return { user, role, permissionCodes };
}

export async function getRoleByName(name: string) {
  const rows = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
  return rows[0] ?? null;
}

export async function createUser(
  userId: string,
  email: string,
  nickname: string | null,
  avatarImage: string | null = null
) {
  return ensureUser(userId, email, nickname, avatarImage);
}

/** Idempotent first-login bootstrap: safe under concurrent sign-in requests. */
export async function ensureUser(
  userId: string,
  email: string,
  nickname: string | null,
  avatarImage: string | null = null
) {
  const existing = await getUserRow(userId);
  if (existing) return existing;

  const defaultRole = await getRoleByName('Estudante');
  const inserted = await db
    .insert(users)
    .values({
      id: userId,
      email,
      nickname,
      role: 'Estudante',
      roleId: defaultRole?.id ?? null,
      avatarImage,
    })
    .onConflictDoNothing({ target: users.id })
    .returning();

  if (inserted[0]) return inserted[0];

  const raced = await getUserRow(userId);
  if (!raced) {
    throw new Error(`Failed to create user ${userId}`);
  }
  return raced;
}

const DAILY_CAPS: Record<string, number> = {
  RECEIVE_UPVOTE_TOPIC: 50,
  RECEIVE_UPVOTE_COMMENT: 30,
  RECEIVE_REPLY: 100,
};

/**
 * Award DinaCoins to a user, respecting daily caps and one-time bonus rules.
 * Mirrors crud.award_tokens. Returns the actual amount awarded (0 if capped).
 */
export async function awardTokens(
  userId: string,
  amount: number,
  actionType: string,
  relatedId: number | null = null,
  relatedType: string | null = null
): Promise<number> {
  if (amount <= 0) return 0;
  const user = await getUserRow(userId);
  if (!user) return 0;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const cap = DAILY_CAPS[actionType];
  if (cap != null) {
    const countRows = await db
      .select({ count: sql<number>`count(*)` })
      .from(tokenTransactions)
      .where(
        and(
          eq(tokenTransactions.userId, userId),
          eq(tokenTransactions.actionType, actionType),
          gte(tokenTransactions.createdAt, startOfDay)
        )
      );
    const dailyCount = Number(countRows[0]?.count ?? 0);
    if (dailyCount >= cap) return 0;
  }

  if (actionType === 'QUALITY_BONUS') {
    const existing = await db
      .select({ id: tokenTransactions.id })
      .from(tokenTransactions)
      .where(
        and(
          eq(tokenTransactions.userId, userId),
          eq(tokenTransactions.actionType, 'QUALITY_BONUS'),
          relatedId == null
            ? sql`${tokenTransactions.relatedId} is null`
            : eq(tokenTransactions.relatedId, relatedId),
          relatedType == null
            ? sql`${tokenTransactions.relatedType} is null`
            : eq(tokenTransactions.relatedType, relatedType)
        )
      )
      .limit(1);
    if (existing.length > 0) return 0;
  }

  await db.insert(tokenTransactions).values({
    userId,
    amount,
    actionType,
    relatedId,
    relatedType,
  });

  await db
    .update(users)
    .set({ tokens: sql`coalesce(${users.tokens}, 0) + ${amount}` })
    .where(eq(users.id, userId));

  return amount;
}

export async function getUserBatchAuthors(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, any>();
  const rows = await db
    .select()
    .from(users)
    .where(inArray(users.id, userIds));
  const roleIds = Array.from(
    new Set(rows.map((r) => r.roleId).filter((x): x is number => x != null))
  );
  const roleRows =
    roleIds.length > 0
      ? await db.select().from(roles).where(inArray(roles.id, roleIds))
      : [];
  const roleMap = new Map(roleRows.map((r) => [r.id, r]));
  const map = new Map<string, any>();
  for (const u of rows) {
    map.set(u.id, { user: u, role: u.roleId ? roleMap.get(u.roleId) ?? null : null });
  }
  return map;
}
