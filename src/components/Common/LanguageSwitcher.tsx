import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language || 'pt';

  const toggle = () => {
    const next = current.startsWith('pt') ? 'en' : 'pt';
    i18n.changeLanguage(next);
    try {
      localStorage.setItem('i18nextLng', next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-zinc-700 text-slate-700 dark:text-slate-200 text-sm"
      aria-label="Toggle language"
      title={current.startsWith('pt') ? 'Switch to English' : 'Mudar para Português'}
    >
      {current.startsWith('pt') ? 'PT' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher; 