import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../config/i18n';

const LANGS = ['pt', 'en'] as const;

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [pending, setPending] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const current = i18n.resolvedLanguage || i18n.language || 'pt';

  const setLang = async (lng: string) => {
    if (current.startsWith(lng)) return;
    setPending(true);
    setFailed(false);
    try {
      await changeAppLanguage(lng);
    } catch {
      setFailed(true);
    } finally { setPending(false); }
  };

  return (
    <div className="relative">
    <div
      className="inline-flex rounded-lg border border-slate-200 dark:border-tactical-border overflow-hidden"
      role="group"
      aria-label={t('common.ui_language')}
      aria-busy={pending}
    >
      {LANGS.map((lng) => {
        const active = current.startsWith(lng);
        return (
          <button
            key={lng}
            onClick={() => setLang(lng)}
            aria-pressed={active}
            disabled={pending}
            title={t(`common.switch_to_${lng}`)}
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
    {failed && <p role="alert" className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-red-300 bg-white p-3 text-sm text-red-700 dark:border-red-900 dark:bg-tactical-surface dark:text-red-300">{t('common.language_load_failed')}</p>}
    </div>
  );
};

export default LanguageSwitcher;
