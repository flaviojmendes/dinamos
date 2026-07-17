import { describe, it, expect } from 'vitest';
import { isRetryableHttpError, retryDelayMs, MAX_SYNC_RETRIES } from '../syncRetry';

describe('syncRetry', () => {
  it('caps exponential backoff delay', () => {
    expect(retryDelayMs(0)).toBe(500);
    expect(retryDelayMs(10)).toBeLessThanOrEqual(8000);
  });

  it('treats auth and forbidden errors as non-retryable', () => {
    expect(isRetryableHttpError({ response: { status: 403 } })).toBe(false);
    expect(isRetryableHttpError({ response: { status: 404 } })).toBe(false);
    expect(isRetryableHttpError({ response: { status: 500 } })).toBe(true);
  });

  it('allows a bounded number of sync retries', () => {
    expect(MAX_SYNC_RETRIES).toBeGreaterThan(0);
  });
});
