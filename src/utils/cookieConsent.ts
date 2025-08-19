export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: number;
}

export const COOKIE_CONSENT_KEY = 'cookie-consent';
export const COOKIE_CONSENT_VERSION = '1.0';

export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true, // Always true - required for basic functionality
  analytics: false,
  functional: false,
  marketing: false,
  timestamp: Date.now()
};

export class CookieConsentManager {
  static getConsent(): CookieConsent | null {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) return null;
      
      const consent = JSON.parse(stored);
      
      // Check if consent is still valid (e.g., not older than 1 year)
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      if (Date.now() - consent.timestamp > oneYear) {
        this.clearConsent();
        return null;
      }
      
      return consent;
    } catch (error) {
      console.error('Error reading cookie consent:', error);
      return null;
    }
  }

  static setConsent(consent: Partial<CookieConsent>): void {
    try {
      const fullConsent: CookieConsent = {
        ...DEFAULT_CONSENT,
        ...consent,
        timestamp: Date.now()
      };
      
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent));
      
      // Trigger custom event for consent change
      window.dispatchEvent(new CustomEvent('cookieConsentChange', { 
        detail: fullConsent 
      }));
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }

  static clearConsent(): void {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      window.dispatchEvent(new CustomEvent('cookieConsentChange', { 
        detail: null 
      }));
    } catch (error) {
      console.error('Error clearing cookie consent:', error);
    }
  }

  static hasConsent(): boolean {
    return this.getConsent() !== null;
  }

  static hasAnalyticsConsent(): boolean {
    const consent = this.getConsent();
    return consent?.analytics === true;
  }

  static hasFunctionalConsent(): boolean {
    const consent = this.getConsent();
    return consent?.functional === true;
  }

  static hasMarketingConsent(): boolean {
    const consent = this.getConsent();
    return consent?.marketing === true;
  }

  static acceptAll(): void {
    this.setConsent({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true
    });
  }

  static rejectAll(): void {
    this.setConsent({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false
    });
  }
}

// Helper to clean up any existing non-essential cookies when consent is withdrawn
export const cleanupCookies = () => {
  const consent = CookieConsentManager.getConsent();
  
  if (!consent?.analytics) {
    // Clear Google Analytics cookies
    const gaCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_ga') || 
      cookie.trim().startsWith('_gid') ||
      cookie.trim().startsWith('_gat')
    );
    
    gaCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }
};
