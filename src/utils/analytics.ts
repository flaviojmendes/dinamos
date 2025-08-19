import ReactGA from 'react-ga4';
import { CookieConsentManager } from './cookieConsent';

// Google Analytics Configuration
const GA_TRACKING_ID = 'G-FB645J9ZQH';

// State management
let isAnalyticsInitialized = false;
let pendingEvents: Array<{ type: string; data: any }> = [];

/**
 * Initialize Google Analytics if user has given consent
 */
export const initializeAnalytics = (): void => {
  if (!CookieConsentManager.hasAnalyticsConsent()) {
    console.log('Analytics initialization skipped - no user consent');
    return;
  }

  if (isAnalyticsInitialized) {
    console.log('Analytics already initialized');
    return;
  }

  try {
    // Initialize React GA4
    ReactGA.initialize(GA_TRACKING_ID, {
      gtagOptions: {
        // Anonymize IP addresses for privacy
        anonymize_ip: true,
        // Respect users' Do Not Track preference
        respect_dnt: true,
      }
    });

    isAnalyticsInitialized = true;
    console.log('Google Analytics initialized');

    // Process any pending events
    processPendingEvents();

    // Send initial pageview
    trackPageView(window.location.pathname + window.location.search);
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

/**
 * Disable and cleanup Google Analytics
 */
export const disableAnalytics = (): void => {
  if (!isAnalyticsInitialized) {
    return;
  }

  try {
    // Disable further tracking
    isAnalyticsInitialized = false;
    
    // Clear pending events
    pendingEvents = [];

    // Send GA disable command
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        send_page_view: false
      });
    }

    console.log('Google Analytics disabled');
  } catch (error) {
    console.error('Failed to disable Google Analytics:', error);
  }
};

/**
 * Track page views
 */
export const trackPageView = (page: string): void => {
  if (!CookieConsentManager.hasAnalyticsConsent()) {
    // Store event for later if user hasn't consented yet
    pendingEvents.push({ type: 'pageview', data: page });
    return;
  }

  if (!isAnalyticsInitialized) {
    initializeAnalytics();
  }

  if (isAnalyticsInitialized) {
    try {
      ReactGA.send({
        hitType: 'pageview',
        page: page,
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
};

/**
 * Track custom events
 */
export const trackEvent = (category: string, action: string, label?: string, value?: number): void => {
  if (!CookieConsentManager.hasAnalyticsConsent()) {
    // Store event for later if user hasn't consented yet
    pendingEvents.push({ 
      type: 'event', 
      data: { category, action, label, value } 
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
        value
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }
};

/**
 * Process events that were queued before consent was given
 */
const processPendingEvents = (): void => {
  if (!CookieConsentManager.hasAnalyticsConsent() || !isAnalyticsInitialized) {
    return;
  }

  try {
    pendingEvents.forEach(event => {
      if (event.type === 'pageview') {
        ReactGA.send({
          hitType: 'pageview',
          page: event.data,
        });
      } else if (event.type === 'event') {
        ReactGA.event(event.data);
      }
    });

    // Clear processed events
    pendingEvents = [];
  } catch (error) {
    console.error('Failed to process pending analytics events:', error);
  }
};

/**
 * Handle consent changes
 */
export const handleConsentChange = (): void => {
  if (CookieConsentManager.hasAnalyticsConsent()) {
    // User has given consent - initialize analytics
    initializeAnalytics();
  } else {
    // User has withdrawn consent - disable analytics
    disableAnalytics();
  }
};

// Listen for consent changes
if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentChange', handleConsentChange);
}

// Global type declarations for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
