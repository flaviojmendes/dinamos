import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CookiePreferences from '../components/Common/CookiePreferences';
import { useTranslation } from 'react-i18next';

export default function CookiePreferencesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/preferences"
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Preferences
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Cookie Preferences
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl">
            Control how we use cookies and similar technologies to improve your experience and provide personalized content.
          </p>
        </motion.div>

        <CookiePreferences />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            What are cookies?
          </h2>
          <div className="text-slate-600 dark:text-slate-300 space-y-3 text-sm leading-relaxed">
            <p>
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember information about your visit, which can both make it easier 
              to visit the site again and make the site more useful to you.
            </p>
            <p>
              We use different types of cookies for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Necessary cookies:</strong> Essential for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing cookies:</strong> Used to show you relevant advertisements</li>
            </ul>
            <p>
              You can control these cookies through the preferences above. Note that disabling 
              certain cookies may impact your experience on our website.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
            >
              Terms and Conditions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <span className="text-zinc-500">•</span>
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
            >
              {t('footer.privacy_policy', 'Privacy Policy')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <span className="text-zinc-500">•</span>
            <a
              href="/cookie-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
            >
              Cookie Policy
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <span className="text-zinc-500">•</span>
            <Link
              to="/preferences"
              className="text-brand-600 dark:text-brand-400 hover:text-brand-600 dark:text-brand-300 underline"
            >
              Back to Preferences
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
