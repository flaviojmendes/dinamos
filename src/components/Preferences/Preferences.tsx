import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Preferences() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('https://us-central1-systemo-76109.cloudfunctions.net/createPortalSession', {
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