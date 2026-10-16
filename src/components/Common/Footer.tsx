import { ArrowUpRight, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Brand from './Brand';

const REPO_URL = 'https://github.com/flaviojmendes/dinamos';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-tactical-border bg-white dark:bg-tactical-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-3">
            <Brand linked />
            <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim">
              © {currentYear} Dinamos. {t('footer.all_rights_reserved', 'All rights reserved.')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-xs">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 transition-colors hover:text-brand-700 dark:text-tactical-dim dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              {t('footer.open_source', 'Open source')}
            </a>
            <a
              href="/privacy-policy"
              className="text-slate-500 transition-colors hover:text-brand-700 dark:text-tactical-dim dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {t('footer.privacy_policy', 'Privacy Policy')}
            </a>
            <a
              href="/terms-and-conditions"
              className="text-slate-500 transition-colors hover:text-brand-700 dark:text-tactical-dim dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {t('footer.terms', 'Terms of Service')}
            </a>
          </div>
        </div>
        <div className="mt-7 border-t border-slate-200 pt-5 dark:border-tactical-border">
          <a
            href="https://trilha.info"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Trilha Info
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
