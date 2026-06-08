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
            className={`px-2.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-signal-green ${
              active
                ? 'bg-brand-500 text-white dark:bg-signal-green dark:text-black'
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