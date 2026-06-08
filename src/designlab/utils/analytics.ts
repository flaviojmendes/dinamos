import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-9BHNRKKDRJ';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      testMode: process.env.NODE_ENV === 'development',
    });
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  ReactGA.send({ hitType: 'pageview', page: path, title });
};

// Track events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track user login
export const trackLogin = (method: string = 'email') => {
  trackEvent('User', 'Login', method);
};

// Track user signup
export const trackSignup = (method: string = 'email') => {
  trackEvent('User', 'Signup', method);
};

// Track challenge view
export const trackChallengeView = (challengeId: string | number, challengeTitle?: string) => {
  trackEvent('Challenge', 'View', challengeTitle || String(challengeId));
};

// Track challenge start
export const trackChallengeStart = (challengeId: string | number, challengeTitle?: string) => {
  trackEvent('Challenge', 'Start', challengeTitle || String(challengeId));
};

// Track challenge submission
export const trackChallengeSubmit = (challengeId: string | number, challengeTitle?: string) => {
  trackEvent('Challenge', 'Submit', challengeTitle || String(challengeId));
};

// Track challenge completion
export const trackChallengeComplete = (challengeId: string | number, challengeTitle?: string) => {
  trackEvent('Challenge', 'Complete', challengeTitle || String(challengeId));
};

// Track forum topic view
export const trackForumTopicView = (topicId: string | number, topicTitle?: string) => {
  trackEvent('Forum', 'View Topic', topicTitle || String(topicId));
};

// Track forum topic creation
export const trackForumTopicCreate = (category?: string) => {
  trackEvent('Forum', 'Create Topic', category);
};

// Track forum reply
export const trackForumReply = (topicId: string | number) => {
  trackEvent('Forum', 'Reply', String(topicId));
};

// Track profile update
export const trackProfileUpdate = (field?: string) => {
  trackEvent('Profile', 'Update', field);
};

// Track search
export const trackSearch = (query: string, resultsCount?: number) => {
  trackEvent('Search', 'Query', query, resultsCount);
};

// Track navigation
export const trackNavigation = (destination: string) => {
  trackEvent('Navigation', 'Navigate', destination);
};

// Track error
export const trackError = (error: string, errorInfo?: string) => {
  trackEvent('Error', 'Occurred', errorInfo || error);
};

// Track time spent
export const trackTimeSpent = (category: string, action: string, timeInSeconds: number) => {
  trackEvent(category, action, 'Time Spent', Math.round(timeInSeconds));
};

