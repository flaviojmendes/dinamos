import {
  initializeApp,
  getApps,
  cert,
  type App,
} from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App | null = null;

/**
 * Initialize the Firebase Admin SDK using a base64-encoded service account JSON
 * stored in FIREBASE_SERVICE_ACCOUNT_B64 (recommended for serverless), or a raw
 * JSON string in FIREBASE_SERVICE_ACCOUNT_JSON. Returns null if not configured.
 */
export function getFirebaseApp(): App | null {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let serviceAccount: Record<string, unknown> | null = null;
  try {
    if (b64) {
      serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'));
    } else if (rawJson) {
      serviceAccount = JSON.parse(rawJson);
    }
  } catch (e) {
    console.error('[firebase] Failed to parse service account credentials:', e);
    return null;
  }

  if (!serviceAccount) {
    console.warn('[firebase] No service account configured; auth disabled');
    return null;
  }

  app = initializeApp({ credential: cert(serviceAccount as any) });
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export interface DecodedUser {
  uid: string;
  email: string;
  picture?: string | null;
  name?: string | null;
  subscribed?: boolean;
}

/**
 * Verify a Firebase ID token. Throws on invalid token.
 */
export async function verifyIdToken(token: string): Promise<DecodedUser> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Admin SDK is not initialized');
  }
  const decoded = await auth.verifyIdToken(token);
  const uid = decoded.uid || (decoded.sub as string) || 'anonymous';
  let email = decoded.email ?? '';
  if (!email) email = `${uid}@email.com`;
  return {
    uid,
    email,
    picture: (decoded.picture as string) ?? null,
    name: (decoded.name as string) ?? null,
    subscribed: Boolean((decoded as any).subscribed),
  };
}

/**
 * Set custom claims on a Firebase user (used by Stripe webhook to sync
 * subscription status). No-op if Firebase is not configured.
 */
export async function setSubscriptionClaims(
  uid: string,
  isSubscribed: boolean,
  stripeCustomerId?: string | null
): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  try {
    await auth.setCustomUserClaims(uid, {
      subscribed: isSubscribed,
      subscribedAt: isSubscribed ? new Date().toISOString() : null,
      stripeCustomerId: stripeCustomerId ?? null,
    });
  } catch (e) {
    console.error('[firebase] Failed to set custom claims:', e);
  }
}

export async function getStripeCustomerIdFromClaims(
  uid: string
): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  try {
    const user = await auth.getUser(uid);
    return (user.customClaims?.stripeCustomerId as string) ?? null;
  } catch {
    return null;
  }
}
