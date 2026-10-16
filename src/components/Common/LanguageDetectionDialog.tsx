import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TacticalButton } from '../tactical';
import { changeAppLanguage } from '../../config/i18n';

const LanguageDetectionDialog: React.FC = () => {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');

  useEffect(() => {
    // Check if user has already made an explicit language choice
    const hasChosenLanguage = localStorage.getItem('language-choice-made');
    
    // Only show dialog if user hasn't made an explicit choice through our dialog
    if (!hasChosenLanguage) {
      try {
        // Get browser language with fallback
        const browserLang = (navigator.language || 'en').toLowerCase();
        const isPortuguese = browserLang.startsWith('pt');
        
        setDetectedLanguage(isPortuguese ? 'pt' : 'en');
        setShowDialog(true);
      } catch (error) {
        // Fallback if navigator.language is not available
        console.warn('Could not detect browser language, defaulting to English');
        setDetectedLanguage('en');
        setShowDialog(true);
      }
    }
  }, []);

  const handleLanguageChoice = async (language: string) => {
    setPending(true);
    setFailed(false);
    try {
      if (await changeAppLanguage(language)) {
        try { localStorage.setItem('language-choice-made', 'true'); } catch { /* private storage */ }
        setShowDialog(false);
      }
    } catch {
      setFailed(true);
    } finally { setPending(false); }
  };

  if (!showDialog) return null;

  const isPortugueseDetected = detectedLanguage === 'pt';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-2xl p-6 sm:p-8 max-w-lg w-full mx-4"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-tactical-text mb-4">
              {t('common.language_dialog.title')}
            </h2>
            <p className="text-slate-600 dark:text-tactical-dim leading-relaxed">
              {t('common.language_dialog.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {isPortugueseDetected ? (
              <>
                <TacticalButton
                  disabled={pending}
                  variant="primary"
                  onClick={() => handleLanguageChoice('pt')}
                  className="flex-1 py-3"
                >
                  {t('common.language_dialog.continue_pt')}
                </TacticalButton>
                <TacticalButton
                  disabled={pending}
                  onClick={() => handleLanguageChoice('en')}
                  className="flex-1 py-3"
                >
                  {t('common.language_dialog.switch_en')}
                </TacticalButton>
              </>
            ) : (
              <>
                <TacticalButton
                  disabled={pending}
                  variant="primary"
                  onClick={() => handleLanguageChoice('en')}
                  className="flex-1 py-3"
                >
                  {t('common.language_dialog.continue_en')}
                </TacticalButton>
                <TacticalButton
                  disabled={pending}
                  onClick={() => handleLanguageChoice('pt')}
                  className="flex-1 py-3"
                >
                  {t('common.language_dialog.switch_pt')}
                </TacticalButton>
              </>
            )}
          </div>
          {failed && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-300">{t('common.language_load_failed')}</p>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LanguageDetectionDialog;
