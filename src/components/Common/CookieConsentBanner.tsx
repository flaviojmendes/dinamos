import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CookieConsentManager, CookieConsent } from '../../utils/cookieConsent';

interface CookieConsentBannerProps {
  onConsentChange?: (consent: CookieConsent) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onConsentChange }) => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [customConsent, setCustomConsent] = useState({
    analytics: false,
    functional: false,
    marketing: false
  });

  useEffect(() => {
    // Show banner if no consent has been given
    if (!CookieConsentManager.hasConsent()) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    CookieConsentManager.acceptAll();
    const consent = CookieConsentManager.getConsent();
    if (consent) {
      onConsentChange?.(consent);
    }
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    CookieConsentManager.rejectAll();
    const consent = CookieConsentManager.getConsent();
    if (consent) {
      onConsentChange?.(consent);
    }
    setShowBanner(false);
  };

  const handleCustomSave = () => {
    CookieConsentManager.setConsent({
      necessary: true,
      ...customConsent
    });
    const consent = CookieConsentManager.getConsent();
    if (consent) {
      onConsentChange?.(consent);
    }
    setShowBanner(false);
  };

  const toggleCustomConsent = (type: keyof typeof customConsent) => {
    setCustomConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/50 p-6 shadow-2xl"
      >
        <div className="max-w-6xl mx-auto">
          {!showDetails ? (
            // Simple banner view
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('cookies.banner.title', 'We use cookies')}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {t('cookies.banner.description', 
                    'We use cookies to enhance your experience, analyze site traffic, and provide personalized content. You can choose which cookies to accept.'
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-white border border-zinc-600 hover:border-zinc-500 rounded-lg transition-colors"
                >
                  {t('cookies.banner.customize', 'Customize')}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-white border border-zinc-600 hover:border-zinc-500 rounded-lg transition-colors"
                >
                  {t('cookies.banner.reject', 'Reject All')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {t('cookies.banner.accept', 'Accept All')}
                </button>
              </div>
            </div>
          ) : (
            // Detailed preferences view
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {t('cookies.preferences.title', 'Cookie Preferences')}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-white rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid gap-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      {t('cookies.necessary.title', 'Necessary Cookies')}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t('cookies.necessary.description', 
                        'Essential for basic website functionality, authentication, and security. Cannot be disabled.'
                      )}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-green-600 rounded-full flex items-center">
                      <div className="w-5 h-5 bg-white rounded-full transform translate-x-6 transition-transform"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      {t('cookies.analytics.title', 'Analytics Cookies')}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t('cookies.analytics.description', 
                        'Help us understand how visitors interact with our website by collecting and reporting information anonymously.'
                      )}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => toggleCustomConsent('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        customConsent.analytics ? 'bg-blue-600' : 'bg-zinc-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        customConsent.analytics ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      {t('cookies.functional.title', 'Functional Cookies')}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t('cookies.functional.description', 
                        'Enable enhanced functionality like remembering your preferences and providing personalized features.'
                      )}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => toggleCustomConsent('functional')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        customConsent.functional ? 'bg-blue-600' : 'bg-zinc-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        customConsent.functional ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      {t('cookies.marketing.title', 'Marketing Cookies')}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {t('cookies.marketing.description', 
                        'Track visitors across websites to display relevant and engaging advertisements.'
                      )}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => toggleCustomConsent('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        customConsent.marketing ? 'bg-blue-600' : 'bg-zinc-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        customConsent.marketing ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-white border border-zinc-600 hover:border-zinc-500 rounded-lg transition-colors"
                >
                  {t('cookies.preferences.reject', 'Reject All')}
                </button>
                <button
                  onClick={handleCustomSave}
                  className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {t('cookies.preferences.save', 'Save Preferences')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  {t('cookies.preferences.accept', 'Accept All')}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  {t('cookies.policy.text', 'For more information, please read our')}{' '}
                  <a 
                    href="/terms-and-conditions" 
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
                  >
                    Terms and Conditions
                  </a>
                  {', '}
                  <a 
                    href="/privacy-policy" 
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
                  >
                    {t('cookies.policy.privacy', 'Privacy Policy')}
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/cookie-policy.html" 
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
                  >
                    {t('cookies.policy.cookies', 'Cookie Policy')}
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
