// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

const ga = vi.hoisted(() => ({ initialize: vi.fn(), send: vi.fn(), event: vi.fn() }));
vi.mock('react-ga4', () => ({ default: ga }));

import * as analytics from '../analytics';
import { CookieConsentManager } from '../../../utils/cookieConsent';

beforeEach(() => {
  localStorage.clear();
  ga.initialize.mockReset();
  ga.send.mockReset();
  ga.event.mockReset();
  analytics.disableAnalytics();
});

describe('app analytics (consent-aware re-export)', () => {
  it('initGA respects consent', () => {
    analytics.initGA();
    expect(ga.initialize).not.toHaveBeenCalled();
    CookieConsentManager.acceptAll();
    analytics.initGA();
    expect(ga.initialize).toHaveBeenCalled();
  });

  it('trackPageView queues without consent', () => {
    analytics.trackPageView('/p', 'Title');
    expect(ga.send).not.toHaveBeenCalled();
  });

  it('trackEvent forwards category/action with consent', () => {
    CookieConsentManager.acceptAll();
    analytics.initializeAnalytics();
    analytics.trackEvent('Cat', 'Act', 'lbl', 3);
    expect(ga.event).toHaveBeenCalledWith({ category: 'Cat', action: 'Act', label: 'lbl', value: 3 });
  });

  it('domain-specific trackers delegate to trackEvent', () => {
    CookieConsentManager.acceptAll();
    analytics.initializeAnalytics();
    analytics.trackLogin();
    analytics.trackSignup('google');
    analytics.trackChallengeView('c1', 'Title');
    analytics.trackForumTopicView('t1');
    analytics.trackForumReply('t1');
    expect(ga.event.mock.calls.length).toBeGreaterThan(3);
  });
});
