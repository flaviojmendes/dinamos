import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError(t('auth.error_google'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGithub();
      navigate('/');
    } catch (error) {
      setError(t('auth.error_github'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg text-slate-900 dark:text-tactical-text flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="tactical-panel">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-tactical-border px-5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-1 bg-signal-amber" aria-hidden />
              <h2 className="font-mono uppercase tracking-wider text-sm font-semibold">
                {t('auth.welcome_title')}
              </h2>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-signal-red">[ACCESS REQUEST]</span>
          </div>

          <div className="p-6">
            <p className="text-slate-500 dark:text-tactical-dim text-center font-mono text-sm mb-8">
              {t('auth.welcome_subtitle')}
            </p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-signal-red/10 border border-signal-red/50 text-signal-red p-3 mb-4 font-mono text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-3 px-4 font-mono text-sm uppercase tracking-wider font-medium hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                )}
                {t('auth.login_google')}
              </button>

              <button
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="w-full bg-transparent border border-slate-300 dark:border-tactical-line text-slate-900 dark:text-tactical-text py-3 px-4 font-mono text-sm uppercase tracking-wider font-medium hover:border-slate-900 dark:hover:border-signal-green hover:bg-slate-100 dark:hover:bg-tactical-raised transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                )}
                {t('auth.login_github')}
              </button>
            </div>

            <p className="font-mono text-[11px] text-slate-400 dark:text-tactical-label text-center mt-8">
              {t('auth.terms_notice')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 