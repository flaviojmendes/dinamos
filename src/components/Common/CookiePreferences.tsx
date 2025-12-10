import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CookieConsentManager, CookieConsent } from '../../utils/cookieConsent';
import { cleanupCookies } from '../../utils/cookieConsent';

interface CookiePreferencesProps {
  onSave?: (consent: CookieConsent) => void;
}

export const CookiePreferences: React.FC<CookiePreferencesProps> = ({ onSave }) => {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentConsent = CookieConsentManager.getConsent();
    if (currentConsent) {
      setConsent(currentConsent);
    } else {
      // Set defaults if no consent has been given
      setConsent({
        necessary: true,
        analytics: false,
        functional: false,
        marketing: false,
        timestamp: Date.now()
      });
    }
  }, []);

  const handleToggle = (type: keyof Omit<CookieConsent, 'timestamp'>) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    
    setConsent(prev => {
      if (!prev) return null;
      const newConsent = { ...prev, [type]: !prev[type] };
      setHasChanges(true);
      return newConsent;
    });
  };

  const handleSave = () => {
    if (!consent) return;
    
    CookieConsentManager.setConsent(consent);
    
    // Clean up cookies if consent was withdrawn
    cleanupCookies();
    
    setHasChanges(false);
    onSave?.(consent);
  };

  const handleAcceptAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
      timestamp: Date.now()
    };
    
    setConsent(newConsent);
    CookieConsentManager.setConsent(newConsent);
    setHasChanges(false);
    onSave?.(newConsent);
  };

  const handleRejectAll = () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
      timestamp: Date.now()
    };
    
    setConsent(newConsent);
    CookieConsentManager.setConsent(newConsent);
    cleanupCookies();
    setHasChanges(false);
    onSave?.(newConsent);
  };

  if (!consent) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-500 dark:text-slate-400">Loading preferences...</div>
      </div>
    );
  }

  const cookieTypes = [
    {
      key: 'necessary' as const,
      title: t('cookies.necessary.title'),
      description: t('cookies.necessary.description'),
      required: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      key: 'analytics' as const,
      title: t('cookies.analytics.title'),
      description: t('cookies.analytics.description'),
      required: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      key: 'functional' as const,
      title: t('cookies.functional.title'),
      description: t('cookies.functional.description'),
      required: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      key: 'marketing' as const,
      title: t('cookies.marketing.title'),
      description: t('cookies.marketing.description'),
      required: false,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('cookies.preferences.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your cookie preferences and control how we collect and use data on our website.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {cookieTypes.map((type) => (
            <div 
              key={type.key}
              className="flex items-start gap-4 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-700/50"
            >
              <div className="flex-shrink-0 p-3 bg-zinc-700/50 rounded-lg text-slate-600 dark:text-slate-300">
                {type.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {type.title}
                  </h3>
                  {type.required ? (
                    <div className="px-3 py-1 bg-green-600/20 border border-green-600/50 rounded-full">
                      <span className="text-green-400 text-sm font-medium">Required</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggle(type.key)}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        consent[type.key] ? 'bg-blue-600' : 'bg-zinc-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        consent[type.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-slate-300 dark:border-slate-700/50">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: {new Date(consent.timestamp).toLocaleDateString()}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-white border border-zinc-600 hover:border-zinc-500 rounded-lg transition-colors"
            >
              {t('cookies.preferences.reject')}
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 text-sm rounded-lg transition-colors ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-zinc-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {t('cookies.preferences.save')}
            </button>
            
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {t('cookies.preferences.accept')}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            {t('cookies.policy.text')}{' '}
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
              {t('cookies.policy.privacy')}
            </a>
            {' '}and{' '}
            <a 
              href="/cookie-policy.html" 
              className="text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
            >
              {t('cookies.policy.cookies')}
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CookiePreferences;
