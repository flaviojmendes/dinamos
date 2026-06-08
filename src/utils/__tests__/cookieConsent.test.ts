// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  CookieConsentManager,
  COOKIE_CONSENT_KEY,
} from '../cookieConsent';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CookieConsentManager', () => {
  it('returns null when no consent is stored', () => {
    expect(CookieConsentManager.getConsent()).toBeNull();
    expect(CookieConsentManager.hasConsent()).toBe(false);
  });

  it('persists consent and reports category helpers', () => {
    CookieConsentManager.acceptAll();
    expect(CookieConsentManager.hasConsent()).toBe(true);
    expect(CookieConsentManager.hasAnalyticsConsent()).toBe(true);
    expect(CookieConsentManager.hasFunctionalConsent()).toBe(true);
    expect(CookieConsentManager.hasMarketingConsent()).toBe(true);
  });

  it('rejectAll keeps necessary cookies but disables the rest', () => {
    CookieConsentManager.rejectAll();
    const consent = CookieConsentManager.getConsent();
    expect(consent?.necessary).toBe(true);
    expect(consent?.analytics).toBe(false);
    expect(CookieConsentManager.hasAnalyticsConsent()).toBe(false);
  });

  it('emits a cookieConsentChange event when consent changes', () => {
    const handler = vi.fn();
    window.addEventListener('cookieConsentChange', handler);
    CookieConsentManager.setConsent({ analytics: true });
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener('cookieConsentChange', handler);
  });

  it('clearConsent removes stored consent', () => {
    CookieConsentManager.acceptAll();
    CookieConsentManager.clearConsent();
    expect(localStorage.getItem(COOKIE_CONSENT_KEY)).toBeNull();
    expect(CookieConsentManager.getConsent()).toBeNull();
  });

  it('expires and clears consent older than one year', () => {
    const old = {
      necessary: true,
      analytics: true,
      functional: false,
      marketing: false,
      timestamp: Date.now() - 400 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(old));
    expect(CookieConsentManager.getConsent()).toBeNull();
    expect(localStorage.getItem(COOKIE_CONSENT_KEY)).toBeNull();
  });

  it('returns null and logs on corrupted stored JSON', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(COOKIE_CONSENT_KEY, '{not valid json');
    expect(CookieConsentManager.getConsent()).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});
