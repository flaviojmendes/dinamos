import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';
export const YOUR_DOMAIN = process.env.YOUR_DOMAIN ?? 'https://dinamos.net';

// Price IDs moved out of source into env (with the previous hardcoded values as
// fallbacks to avoid breaking existing checkout while envs are configured).
export const MONTHLY_PRICE_ID =
  process.env.STRIPE_PRICE_MONTHLY ?? 'price_1SYPIWJCaYkzdiZXlrNJEGb8';
export const YEARLY_PRICE_ID =
  process.env.STRIPE_PRICE_YEARLY ?? 'price_1Sc3IIJCaYkzdiZXiYWhmj0N';
export const ONE_TIME_PRICE_ID =
  process.env.STRIPE_PRICE_ONETIME ?? 'price_1SdXCmJCaYkzdiZXQjQVr4fl';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!stripe) {
    stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' as any });
  }
  return stripe;
}
