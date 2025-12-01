import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LanguageDetectionDialog: React.FC = () => {
  const { t, i18n } = useTranslation();
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

  const handleLanguageChoice = (language: string) => {
    // Store the user's explicit choice first
    localStorage.setItem('language-choice-made', 'true');
    localStorage.setItem('i18nextLng', language);
    
    // Set the language (this will now find the localStorage value)
    i18n.changeLanguage(language);
    
    // Close dialog
    setShowDialog(false);
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
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-8 max-w-lg w-full mx-4"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {isPortugueseDetected ? 'Escolha seu Idioma' : 'Choose Your Language'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isPortugueseDetected 
                ? 'Detectamos que seu navegador está em português. Gostaria de continuar em português?'
                : 'We detected that your browser language is English or another language. Would you like to continue in English?'
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {isPortugueseDetected ? (
              <>
                <button
                  onClick={() => handleLanguageChoice('pt')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Continuar em Português
                </button>
                <button
                  onClick={() => handleLanguageChoice('en')}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Mudar para Inglês
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleLanguageChoice('en')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Continue in English
                </button>
                <button
                  onClick={() => handleLanguageChoice('pt')}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Switch to Portuguese
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LanguageDetectionDialog; 