// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

const ga = vi.hoisted(() => ({ initialize: vi.fn(), send: vi.fn(), event: vi.fn() }));
vi.mock('react-ga4', () => ({ default: ga }));

import {
  initializeAnalytics,
  disableAnalytics,
  trackPageView,
  trackEvent,
  handleConsentChange,
} from '../analytics';
import { CookieConsentManager } from '../cookieConsent';

beforeEach(() => {
  localStorage.clear();
  ga.initialize.mockReset();
  ga.send.mockReset();
  ga.event.mockReset();
  // Each test imports the same module instance; reset its internal state by
  // disabling before re-enabling where needed.
  disableAnalytics();
});

describe('analytics consent gating', () => {
  it('skips initialization without consent', () => {
    initializeAnalytics();
    expect(ga.initialize).not.toHaveBeenCalled();
  });

  it('queues page views until consent is granted', () => {
    trackPageView('/queued');
    expect(ga.send).not.toHaveBeenCalled();
  });

  it('initializes and flushes pending events once consent is granted', () => {
    trackEvent('cat', 'act');
    CookieConsentManager.acceptAll();
    initializeAnalytics();
    expect(ga.initialize).toHaveBeenCalled();
    // pending event flushed
    expect(ga.event).toHaveBeenCalled();
  });

  it('tracks page views and events with consent', () => {
    CookieConsentManager.acceptAll();
    initializeAnalytics();
    ga.send.mockClear();
    trackPageView('/p');
    expect(ga.send).toHaveBeenCalled();
    trackEvent('cat', 'act', 'label', 1);
    expect(ga.event).toHaveBeenCalledWith(expect.objectContaining({ category: 'cat', action: 'act' }));
  });

  it('handleConsentChange initializes or disables based on consent', () => {
    CookieConsentManager.acceptAll();
    handleConsentChange();
    expect(ga.initialize).toHaveBeenCalled();
    CookieConsentManager.rejectAll();
    handleConsentChange();
    // After rejecting, a subsequent pageview is queued rather than sent.
    ga.send.mockClear();
    trackPageView('/after');
    expect(ga.send).not.toHaveBeenCalled();
  });
});
