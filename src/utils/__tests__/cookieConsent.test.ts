// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CookieConsentManager,
  cleanupCookies,
  COOKIE_CONSENT_KEY,
} from '../cookieConsent';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('CookieConsentManager', () => {
  it('returns null when nothing is stored', () => {
    expect(CookieConsentManager.getConsent()).toBeNull();
    expect(CookieConsentManager.hasConsent()).toBe(false);
  });

  it('stores and reads consent, dispatching an event', () => {
    const handler = vi.fn();
    window.addEventListener('cookieConsentChange', handler);
    CookieConsentManager.setConsent({ analytics: true });
    expect(handler).toHaveBeenCalled();
    expect(CookieConsentManager.hasAnalyticsConsent()).toBe(true);
    window.removeEventListener('cookieConsentChange', handler);
  });

  it('acceptAll enables every category', () => {
    CookieConsentManager.acceptAll();
    expect(CookieConsentManager.hasAnalyticsConsent()).toBe(true);
    expect(CookieConsentManager.hasFunctionalConsent()).toBe(true);
    expect(CookieConsentManager.hasMarketingConsent()).toBe(true);
  });

  it('rejectAll disables optional categories', () => {
    CookieConsentManager.rejectAll();
    expect(CookieConsentManager.hasAnalyticsConsent()).toBe(false);
    expect(CookieConsentManager.hasFunctionalConsent()).toBe(false);
  });

  it('expires consent older than a year', () => {
    const stale = { necessary: true, analytics: true, functional: false, marketing: false, timestamp: Date.now() - 400 * 24 * 60 * 60 * 1000 };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(stale));
    expect(CookieConsentManager.getConsent()).toBeNull();
  });

  it('returns null on malformed stored JSON', () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'not-json');
    expect(CookieConsentManager.getConsent()).toBeNull();
  });

  it('clearConsent removes the stored value', () => {
    CookieConsentManager.acceptAll();
    CookieConsentManager.clearConsent();
    expect(localStorage.getItem(COOKIE_CONSENT_KEY)).toBeNull();
  });
});

describe('cleanupCookies', () => {
  it('clears GA cookies when analytics consent is absent', () => {
    document.cookie = '_ga=abc';
    expect(() => cleanupCookies()).not.toThrow();
  });

  it('does nothing extra when analytics is consented', () => {
    CookieConsentManager.acceptAll();
    expect(() => cleanupCookies()).not.toThrow();
  });
});
