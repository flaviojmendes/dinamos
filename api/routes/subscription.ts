import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { eq, or, desc, sql } from 'drizzle-orm';
import type Stripe from 'stripe';
import { db } from '../db/client';
import { users } from '../db/schema';
import { authRequired, adminRequired, type AppVariables } from '../middleware/auth';
import {
  getStripe,
  STRIPE_WEBHOOK_SECRET,
  YOUR_DOMAIN,
  MONTHLY_PRICE_ID,
  YEARLY_PRICE_ID,
  ONE_TIME_PRICE_ID,
} from '../lib/stripe';
import {
  setSubscriptionClaims,
  getStripeCustomerIdFromClaims,
} from '../lib/firebaseAdmin';
import { getUserRow } from '../db/repo';

export const subscriptionRouter = new Hono<{ Variables: AppVariables }>();

async function updateUserSubscriptionStatus(
  userId: string,
  stripeCustomerId: string | null,
  isSubscribed: boolean
) {
  await setSubscriptionClaims(userId, isSubscribed, stripeCustomerId);
  const user = await getUserRow(userId);
  if (!user) return;
  const updates: Record<string, unknown> = { isSubscribed };
  if (isSubscribed && !user.subscribedAt) updates.subscribedAt = new Date();
  if (isSubscribed) updates.subscribedAt = new Date();
  if (stripeCustomerId) updates.stripeCustomerId = stripeCustomerId;
  await db.update(users).set(updates).where(eq(users.id, userId));
}

function applyDiscounts(
  config: Stripe.Checkout.SessionCreateParams,
  couponId?: string,
  promotionCode?: string,
  promoCodeId?: string | null
) {
  let hasDiscount = false;
  if (couponId) {
    config.discounts = [{ coupon: couponId }];
    hasDiscount = true;
  }
  if (promotionCode && !hasDiscount && promoCodeId) {
    config.discounts = [{ promotion_code: promoCodeId }];
    hasDiscount = true;
  }
  if (!hasDiscount) config.allow_promotion_codes = true;
}

async function resolvePromoCode(
  promotionCode?: string
): Promise<string | null> {
  if (!promotionCode) return null;
  try {
    const codes = await getStripe().promotionCodes.list({
      code: promotionCode,
      active: true,
      limit: 1,
    });
    return codes.data[0]?.id ?? null;
  } catch (e) {
    console.error('[stripe] promo lookup failed:', e);
    return null;
  }
}

subscriptionRouter.post('/api/subscription/create-checkout-session', async (c) => {
  const body = await c.req.json<{
    priceId?: string;
    userId: string;
    userEmail?: string;
    couponId?: string;
    promotionCode?: string;
  }>();
  if (!body.userId)
    throw new HTTPException(400, { message: 'Missing required fields: priceId, userId' });

  const config: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [{ price: ONE_TIME_PRICE_ID, quantity: 1 }],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/pagamento/falha`,
    customer_email: body.userEmail,
    client_reference_id: body.userId,
    metadata: { userId: body.userId },
  };
  const promoId = await resolvePromoCode(body.promotionCode);
  applyDiscounts(config, body.couponId, body.promotionCode, promoId);

  try {
    const session = await getStripe().checkout.sessions.create(config);
    return c.json({ id: session.id, url: session.url });
  } catch (e: any) {
    console.error('[stripe] checkout error:', e);
    throw new HTTPException(500, { message: `Failed to create checkout session: ${e?.message}` });
  }
});

async function createSubscriptionSession(
  body: { userId: string; userEmail?: string; couponId?: string; promotionCode?: string },
  priceId: string
) {
  const config: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/pagamento/falha`,
    customer_email: body.userEmail,
    client_reference_id: body.userId,
    metadata: { userId: body.userId },
    subscription_data: { metadata: { userId: body.userId } },
  };
  const promoId = await resolvePromoCode(body.promotionCode);
  applyDiscounts(config, body.couponId, body.promotionCode, promoId);
  return getStripe().checkout.sessions.create(config);
}

subscriptionRouter.post('/api/subscription/create-monthly-subscription', async (c) => {
  const body = await c.req.json<any>();
  if (!body.userId) throw new HTTPException(400, { message: 'Missing required field: userId' });
  const session = await createSubscriptionSession(body, MONTHLY_PRICE_ID);
  return c.json({ id: session.id, url: session.url });
});

subscriptionRouter.post('/api/subscription/create-yearly-subscription', async (c) => {
  const body = await c.req.json<any>();
  if (!body.userId) throw new HTTPException(400, { message: 'Missing required field: userId' });
  const session = await createSubscriptionSession(body, YEARLY_PRICE_ID);
  return c.json({ id: session.id, url: session.url });
});

subscriptionRouter.post('/api/subscription/cancel-subscription', async (c) => {
  const body = await c.req.json<{ userId: string; subscriptionId?: string }>();
  if (!body.userId) throw new HTTPException(400, { message: 'Missing required field: userId' });

  let targetSubscriptionId = body.subscriptionId;
  let stripeCustomerId: string | null = null;

  if (!targetSubscriptionId) {
    stripeCustomerId = await getStripeCustomerIdFromClaims(body.userId);
    if (!stripeCustomerId) {
      const dbUser = await getUserRow(body.userId);
      stripeCustomerId = dbUser?.stripeCustomerId ?? null;
    }
    if (!stripeCustomerId)
      throw new HTTPException(400, { message: 'No Stripe customer found for user' });

    const subs = await getStripe().subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });
    if (!subs.data.length)
      throw new HTTPException(404, { message: 'No active subscription found' });
    targetSubscriptionId = subs.data[0].id;
  }

  const cancelled = await getStripe().subscriptions.cancel(targetSubscriptionId);
  await updateUserSubscriptionStatus(body.userId, stripeCustomerId ?? '', false);
  return c.json({
    success: true,
    subscriptionId: targetSubscriptionId,
    status: cancelled.status,
    cancelledAt: cancelled.canceled_at,
  });
});

subscriptionRouter.post('/api/subscription/create-portal-session', async (c) => {
  const body = await c.req.json<{ userId: string; returnUrl: string }>();
  const dbUser = await getUserRow(body.userId);
  let stripeCustomerId = dbUser?.stripeCustomerId ?? null;
  if (!stripeCustomerId)
    stripeCustomerId = await getStripeCustomerIdFromClaims(body.userId);
  if (!stripeCustomerId)
    throw new HTTPException(400, { message: 'No Stripe customer found' });

  const session = await getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: body.returnUrl,
  });
  return c.json({ url: session.url });
});

// Webhook (raw body for signature verification) -----------------------------
subscriptionRouter.post('/api/subscription/webhook', async (c) => {
  const payload = await c.req.text();
  const sig = c.req.header('stripe-signature') ?? '';
  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      payload,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    throw new HTTPException(400, { message: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId)
          await updateUserSubscriptionStatus(userId, session.customer as string, true);
        break;
      }
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) await updateUserSubscriptionStatus(userId, sub.customer as string, true);
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId)
          await updateUserSubscriptionStatus(
            userId,
            sub.customer as string,
            sub.status === 'active'
          );
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) await updateUserSubscriptionStatus(userId, sub.customer as string, false);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription;
        if (subId) {
          const sub = await getStripe().subscriptions.retrieve(subId);
          const userId = sub.metadata?.userId;
          if (userId)
            await updateUserSubscriptionStatus(userId, sub.customer as string, true);
        }
        break;
      }
    }
    return c.json({ received: true });
  } catch (e) {
    console.error('[stripe] webhook handler error:', e);
    throw new HTTPException(500, { message: 'Internal Server Error' });
  }
});

subscriptionRouter.post(
  '/api/subscription/force-update-status',
  authRequired,
  adminRequired,
  async (c) => {
    const body = await c.req.json<{
      userId: string;
      isSubscribed: boolean;
      stripeCustomerId?: string;
    }>();
    await updateUserSubscriptionStatus(
      body.userId,
      body.stripeCustomerId ?? null,
      body.isSubscribed
    );
    return c.json({ success: true, userId: body.userId, isSubscribed: body.isSubscribed });
  }
);

// Admin helper endpoints (now require admin auth) ---------------------------
subscriptionRouter.get(
  '/api/subscription/admin/subscribed-users',
  authRequired,
  adminRequired,
  async (c) => {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.isSubscribed, true))
      .orderBy(desc(users.subscribedAt));
    const tableRows = rows
      .map((u) => {
        const subAt = u.subscribedAt ? new Date(u.subscribedAt).toLocaleString() : 'N/A';
        return `<tr><td>${u.id}</td><td>${u.email || u.nickname || 'N/A'}</td><td>${subAt}</td></tr>`;
      })
      .join('');
    const html = `<table border="1"><tr><th>UID</th><th>Email</th><th>Subscribed At</th></tr>${tableRows}</table>`;
    return c.html(html);
  }
);

subscriptionRouter.get(
  '/api/subscription/admin/non-subscribed-users-emails',
  authRequired,
  adminRequired,
  async (c) => {
    const rows = await db
      .select({ email: users.email })
      .from(users)
      .where(or(eq(users.isSubscribed, false), sql`${users.isSubscribed} is null`));
    return c.text(rows.map((r) => r.email).filter(Boolean).join(','));
  }
);
