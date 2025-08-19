import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Preferences() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const handleManageSubscription = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL}/createPortalSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          returnUrl: window.location.origin + '/preferences',
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  const locale = i18n.resolvedLanguage?.startsWith('pt') ? 'pt-BR' : 'en-US';

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {t('preferences.title')}
          </h1>

          <div className="space-y-8">
            {/* Account Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">{t('preferences.account_info')}</h2>
              <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">{t('preferences.email')}</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">{t('preferences.creation_date')}</span>
                  <span>{user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(locale) : '-'}</span>
                </div>
              </div>
            </div>

            {/* Cookie & Privacy Settings */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-400">Privacy & Cookies</h2>
              <div className="bg-zinc-800/50 rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white mb-1">Cookie Preferences</h3>
                    <p className="text-zinc-400 text-sm">
                      Manage how we collect and use data on our website through cookies.
                    </p>
                  </div>
                  <Link
                    to="/preferences/cookies"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ml-4"
                  >
                    Manage Cookies
                  </Link>
                </div>
                
                <div className="flex items-start justify-between pt-4 border-t border-zinc-700">
                  <div>
                    <h3 className="font-medium text-white mb-1">Privacy Policy</h3>
                    <p className="text-zinc-400 text-sm">
                      Learn about how we collect, use, and protect your personal information.
                    </p>
                  </div>
                  <a
                    href="/privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ml-4 inline-flex items-center gap-2"
                  >
                    View Policy
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                
                <div className="flex items-start justify-between pt-4 border-t border-zinc-700">
                  <div>
                    <h3 className="font-medium text-white mb-1">Terms and Conditions</h3>
                    <p className="text-zinc-400 text-sm">
                      Review our terms of service and user agreement.
                    </p>
                  </div>
                  <a
                    href="/terms-and-conditions.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ml-4 inline-flex items-center gap-2"
                  >
                    View Terms
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Subscription Management (optional) */}
            {/* <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-400">{t('preferences.manage_subscription')}</h2>
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <p className="text-zinc-400 mb-4">
                  {t('preferences.manage_subscription_desc')}
                </p>
                <button
                  onClick={handleManageSubscription}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {t('preferences.manage_subscription')}
                </button>
              </div>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 