import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = ['pt', 'en'] as const;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language || 'pt';

  const setLang = (lng: string) => {
    if (current.startsWith(lng)) return;
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch {}
  };

  return (
    <div
      className="inline-flex rounded-lg border border-slate-200 dark:border-tactical-border overflow-hidden"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((lng) => {
        const active = current.startsWith(lng);
        return (
          <button
            key={lng}
            onClick={() => setLang(lng)}
            aria-pressed={active}
            title={lng === 'pt' ? 'Mudar para Português' : 'Switch to English'}
            className={`min-h-10 min-w-10 px-2.5 py-1.5 font-sans text-xs font-semibold uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-brand-300 ${
              active
                ? 'bg-brand-100 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-tactical-surface dark:text-tactical-label dark:hover:bg-tactical-raised dark:hover:text-tactical-text'
            }`}
          >
            {lng.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
