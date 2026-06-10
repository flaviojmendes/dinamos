import type { Context, MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verifyIdToken, type DecodedUser } from '../lib/firebaseAdmin.js';
import { getUserContext, type UserContext } from '../db/repo.js';

export type AppVariables = {
  user: DecodedUser;
  dbUser: UserContext;
};

export type AppContext = Context<{ Variables: AppVariables }>;

function extractToken(c: Context): string | null {
  const authHeader = c.req.header('authorization') ?? c.req.header('Authorization');
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}

/** Verify Firebase token; 401 on missing/invalid. */
export const authRequired: MiddlewareHandler<{ Variables: AppVariables }> = async (
  c,
  next
) => {
  const token = extractToken(c);
  if (!token) {
    throw new HTTPException(401, { message: 'Authorization header missing' });
  }
  try {
    const user = await verifyIdToken(token);
    c.set('user', user);
  } catch (e) {
    throw new HTTPException(401, { message: 'Invalid or expired token' });
  }
  await next();
};

/** Set user if a valid token is present, otherwise leave undefined. */
export const optionalAuth: MiddlewareHandler<{ Variables: AppVariables }> = async (
  c,
  next
) => {
  const token = extractToken(c);
  if (token) {
    try {
      const user = await verifyIdToken(token);
      c.set('user', user);
    } catch {
      /* ignore */
    }
  }
  await next();
};

/** Requires authRequired first. Enforces Admin role; stores dbUser context. */
export const adminRequired: MiddlewareHandler<{ Variables: AppVariables }> = async (
  c,
  next
) => {
  const user = c.get('user');
  if (!user) throw new HTTPException(401, { message: 'Not authenticated' });
  const ctx = await getUserContext(user.uid);
  const roleName = ctx?.role?.name ?? ctx?.user.role ?? '';
  if (!ctx || roleName !== 'Admin') {
    throw new HTTPException(403, { message: 'Admin privileges required' });
  }
  c.set('dbUser', ctx);
  await next();
};

export function hasPermission(ctx: UserContext, code: string): boolean {
  return ctx.permissionCodes.includes(code);
}
