import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            © {currentYear} Dinamos. {t('footer.all_rights_reserved', 'All rights reserved.')}
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a 
              href="/privacy-policy" 
              className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {t('footer.privacy_policy', 'Privacy Policy')}
            </a>
            <a 
              href="/terms-and-conditions" 
              className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {t('footer.terms', 'Terms of Service')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

