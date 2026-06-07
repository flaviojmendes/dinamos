import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-tactical-border bg-white/80 dark:bg-tactical-surface/90 backdrop-blur">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-sans text-xs text-slate-500 dark:text-tactical-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            © {currentYear} Dinamos
            <span className="text-slate-400 dark:text-tactical-label normal-case">— {t('footer.all_rights_reserved', 'All rights reserved.')}</span>
          </div>
          <div className="flex items-center gap-5 font-sans text-xs">
            <a
              href="/privacy-policy"
              className="text-slate-500 transition-colors hover:text-slate-900 dark:text-tactical-dim dark:hover:text-tactical-text"
            >
              {t('footer.privacy_policy', 'Privacy Policy')}
            </a>
            <a
              href="/terms-and-conditions"
              className="text-slate-500 transition-colors hover:text-slate-900 dark:text-tactical-dim dark:hover:text-tactical-text"
            >
              {t('footer.terms', 'Terms of Service')}
            </a>
          </div>
        </div>
        <div className="mt-5 border-t border-slate-200 pt-5 text-center font-sans text-xs text-slate-500 dark:border-tactical-border dark:text-tactical-dim">
          Made with <span className="text-signal-red">💜</span> by{' '}
          <a
            href="https://instagram.com/trilhainfo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-signal-green dark:hover:text-signal-green/80"
          >
            flaviojmendes
          </a>
        </div>
      </div>
    </footer>
  );
}

