import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Panel } from '../tactical';

const linkPrimary =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-sans text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200';
const linkSecondary =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-sans text-sm font-medium transition-colors border border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-100 dark:border-tactical-line dark:text-tactical-text dark:hover:border-signal-green dark:hover:bg-tactical-raised';

export default function Preferences() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage?.startsWith('pt') ? 'pt-BR' : 'en-US';

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <p className="mb-2 font-sans text-sm text-brand-600 dark:text-signal-cyan">Settings</p>
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
            {t('preferences.title')}
          </h1>
        </div>

        {/* Account Information */}
        <Panel title={t('preferences.account_info')} accent="cyan">
          <dl className="divide-y divide-slate-200 dark:divide-tactical-border">
            <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0">
              <dt className="label-mono">{t('preferences.email')}</dt>
              <dd className="font-sans text-sm text-slate-900 dark:text-tactical-text truncate">{user?.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5 last:pb-0">
              <dt className="label-mono">{t('preferences.creation_date')}</dt>
              <dd className="font-sans text-sm text-slate-900 dark:text-tactical-text">
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(locale) : '-'}
              </dd>
            </div>
          </dl>
        </Panel>

        {/* Cookie & Privacy Settings */}
        <Panel title={t('preferences.privacy_cookies_title')} accent="green">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">{t('preferences.cookie_preferences_title')}</h3>
                <p className="font-sans text-xs leading-relaxed text-slate-500 dark:text-tactical-dim">
                  {t('preferences.cookie_preferences_desc')}
                </p>
              </div>
              <Link to="/preferences/cookies" className={`${linkPrimary} sm:ml-4`}>
                {t('preferences.manage_cookies_btn')}
              </Link>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-tactical-border sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">{t('preferences.privacy_policy_title')}</h3>
                <p className="font-sans text-xs leading-relaxed text-slate-500 dark:text-tactical-dim">
                  {t('preferences.privacy_policy_desc')}
                </p>
              </div>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkSecondary} sm:ml-4`}
              >
                {t('preferences.view_policy_btn')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-tactical-border sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">{t('preferences.terms_title')}</h3>
                <p className="font-sans text-xs leading-relaxed text-slate-500 dark:text-tactical-dim">
                  {t('preferences.terms_desc')}
                </p>
              </div>
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkSecondary} sm:ml-4`}
              >
                {t('preferences.view_terms_btn')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
} 