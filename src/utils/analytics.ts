import ReactGA from 'react-ga4';
import { CookieConsentManager } from './cookieConsent';

const GA_TRACKING_ID = 'G-FB645J9ZQH';

let isAnalyticsInitialized = false;
let pendingEvents: Array<{ type: string; data: unknown }> = [];

export const initializeAnalytics = (): void => {
  if (!CookieConsentManager.hasAnalyticsConsent()) {
    return;
  }

  if (isAnalyticsInitialized) {
    return;
  }

  try {
    ReactGA.initialize(GA_TRACKING_ID, {
      gtagOptions: {
        anonymize_ip: true,
        respect_dnt: true,
      },
    });

    isAnalyticsInitialized = true;
    processPendingEvents();
    trackPageView(window.location.pathname + window.location.search);
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

export const disableAnalytics = (): void => {
  if (!isAnalyticsInitialized) {
    return;
  }

  try {
    isAnalyticsInitialized = false;
    pendingEvents = [];

    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        send_page_view: false,
      });
    }
  } catch (error) {
    console.error('Failed to disable Google Analytics:', error);
  }
};

export const trackPageView = (page: string, title?: string): void => {
  if (!CookieConsentManager.hasAnalyticsConsent()) {
    pendingEvents.push({ type: 'pageview', data: { page, title } });
    return;
  }

  if (!isAnalyticsInitialized) {
    initializeAnalytics();
  }

  if (isAnalyticsInitialized) {
    try {
      ReactGA.send({
        hitType: 'pageview',
        page,
        title,
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
): void => {
  if (!CookieConsentManager.hasAnalyticsConsent()) {
    pendingEvents.push({
      type: 'event',
      data: { category, action, label, value },
    });
    return;
  }

  if (!isAnalyticsInitialized) {
    initializeAnalytics();
  }

  if (isAnalyticsInitialized) {
    try {
      ReactGA.event({
        category,
        action,
        label,
        value,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }
};

const processPendingEvents = (): void => {
  if (!CookieConsentManager.hasAnalyticsConsent() || !isAnalyticsInitialized) {
    return;
  }

  try {
    pendingEvents.forEach((event) => {
      if (event.type === 'pageview') {
        const { page, title } = event.data as { page: string; title?: string };
        ReactGA.send({ hitType: 'pageview', page, title });
      } else if (event.type === 'event') {
        ReactGA.event(event.data as Parameters<typeof ReactGA.event>[0]);
      }
    });
    pendingEvents = [];
  } catch (error) {
    console.error('Failed to process pending analytics events:', error);
  }
};

export const handleConsentChange = (): void => {
  if (CookieConsentManager.hasAnalyticsConsent()) {
    initializeAnalytics();
  } else {
    disableAnalytics();
  }
};

/** @deprecated Use initializeAnalytics — kept for legacy imports. */
export const initGA = initializeAnalytics;

export const trackLogin = (method = 'email') => trackEvent('User', 'Login', method);
export const trackSignup = (method = 'email') => trackEvent('User', 'Signup', method);
export const trackChallengeView = (challengeId: string | number, challengeTitle?: string) =>
  trackEvent('Challenge', 'View', challengeTitle || String(challengeId));
export const trackChallengeStart = (challengeId: string | number, challengeTitle?: string) =>
  trackEvent('Challenge', 'Start', challengeTitle || String(challengeId));
export const trackChallengeSubmit = (challengeId: string | number, challengeTitle?: string) =>
  trackEvent('Challenge', 'Submit', challengeTitle || String(challengeId));
export const trackChallengeComplete = (challengeId: string | number, challengeTitle?: string) =>
  trackEvent('Challenge', 'Complete', challengeTitle || String(challengeId));
export const trackForumTopicView = (topicId: string | number, topicTitle?: string) =>
  trackEvent('Forum', 'View Topic', topicTitle || String(topicId));
export const trackForumTopicCreate = (category?: string) => trackEvent('Forum', 'Create Topic', category);
export const trackForumReply = (topicId: string | number) => trackEvent('Forum', 'Reply', String(topicId));
export const trackProfileUpdate = (field?: string) => trackEvent('Profile', 'Update', field);
export const trackSearch = (query: string, resultsCount?: number) =>
  trackEvent('Search', 'Query', query, resultsCount);
export const trackNavigation = (destination: string) => trackEvent('Navigation', 'Navigate', destination);
export const trackError = (error: string, errorInfo?: string) =>
  trackEvent('Error', 'Occurred', errorInfo || error);
export const trackTimeSpent = (category: string, action: string, timeInSeconds: number) =>
  trackEvent(category, action, 'Time Spent', Math.round(timeInSeconds));

if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentChange', handleConsentChange);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
