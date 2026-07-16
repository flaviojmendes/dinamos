type FirebaseApp = import('firebase-admin/app').App;
type FirebaseAuth = import('firebase-admin/auth').Auth;

let app: FirebaseApp | null = null;
let auth: FirebaseAuth | null = null;
let initPromise: Promise<void> | null = null;

function parseServiceAccount(): Record<string, unknown> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  try {
    if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'));
    if (rawJson) return JSON.parse(rawJson);
  } catch (e) {
    console.error('[firebase] Failed to parse service account credentials:', e);
  }
  return null;
}

/** Lazy-load firebase-admin so CRUD routes avoid the SDK at cold start. */
async function ensureInitialized(): Promise<void> {
  if (app && auth) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const serviceAccount = parseServiceAccount();
    if (!serviceAccount) {
      console.warn('[firebase] No service account configured; auth disabled');
      return;
    }

    const { initializeApp, getApps, cert } = await import('firebase-admin/app');
    const { getAuth } = await import('firebase-admin/auth');

    if (getApps().length > 0) {
      app = getApps()[0]!;
    } else {
      app = initializeApp({ credential: cert(serviceAccount as any) });
    }
    auth = getAuth(app);
  })();

  return initPromise;
}

/**
 * Returns the cached Firebase app after the first authenticated request, or null
 * if credentials are missing / initialization has not run yet.
 */
export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

export function getFirebaseAuth(): FirebaseAuth | null {
  return auth;
}

export interface DecodedUser {
  uid: string;
  email: string;
  picture?: string | null;
  name?: string | null;
}

/**
 * Verify a Firebase ID token. Throws on invalid token.
 */
export async function verifyIdToken(token: string): Promise<DecodedUser> {
  await ensureInitialized();
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
  };
}
