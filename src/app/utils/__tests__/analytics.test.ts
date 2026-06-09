// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

const ga = vi.hoisted(() => ({ initialize: vi.fn(), send: vi.fn(), event: vi.fn() }));
vi.mock('react-ga4', () => ({ default: ga }));

import * as analytics from '../analytics';

beforeEach(() => {
  ga.initialize.mockReset();
  ga.send.mockReset();
  ga.event.mockReset();
});

describe('app analytics', () => {
  it('initGA initializes GA', () => {
    analytics.initGA();
    expect(ga.initialize).toHaveBeenCalled();
  });

  it('trackPageView sends a pageview', () => {
    analytics.trackPageView('/p', 'Title');
    expect(ga.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/p', title: 'Title' });
  });

  it('trackEvent forwards category/action', () => {
    analytics.trackEvent('Cat', 'Act', 'lbl', 3);
    expect(ga.event).toHaveBeenCalledWith({ category: 'Cat', action: 'Act', label: 'lbl', value: 3 });
  });

  it('domain-specific trackers delegate to trackEvent', () => {
    analytics.trackLogin();
    analytics.trackSignup('google');
    analytics.trackChallengeView('c1', 'Title');
    analytics.trackChallengeStart('c1');
    analytics.trackChallengeSubmit('c1');
    analytics.trackChallengeComplete('c1');
    analytics.trackForumTopicView('t1');
    analytics.trackForumTopicCreate('cat');
    analytics.trackForumReply('t1');
    analytics.trackProfileUpdate('nickname');
    analytics.trackSearch('query', 5);
    analytics.trackNavigation('/home');
    analytics.trackError('boom', 'info');
    analytics.trackTimeSpent('Cat', 'Act', 12.6);
    expect(ga.event).toHaveBeenCalled();
    expect(ga.event.mock.calls.length).toBeGreaterThan(10);
  });
});
