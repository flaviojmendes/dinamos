import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { Panel, TacticalButton } from '../components/tactical';

export default function VerifyEmail() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { currentUser, isEmailVerified, resendVerificationEmail, reloadUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check verification status periodically
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If already verified, redirect to home
    if (isEmailVerified) {
      navigate('/design-lab');
      return;
    }

    // Poll for verification status every 3 seconds
    const interval = setInterval(async () => {
      const verified = await reloadUser();
      if (verified) {
        navigate('/design-lab');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser, isEmailVerified, navigate, reloadUser]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await resendVerificationEmail();
      setSuccess('Email de verificação reenviado! Verifique sua caixa de entrada.');
      setCountdown(60); // 60 seconds cooldown
    } catch (err: any) {
      console.error("Resend verification error:", err);
      if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
      } else {
        setError('Falha ao reenviar email. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setLoading(true);
      setError('');
      const verified = await reloadUser();
      if (verified) {
        navigate('/design-lab');
      } else {
        setError('Email ainda não verificado. Por favor, clique no link enviado para seu email.');
      }
    } catch (err) {
      setError('Erro ao verificar status. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo size="large" showSubtitle={true} className="mb-8" />
          <h2 className="mt-2 text-center text-3xl font-sans font-bold text-slate-900 dark:text-tactical-text">
            Verifique seu email
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-tactical-dim max-w-sm">
            Enviamos um email de verificação para você.
          </p>
        </div>

        <Panel padded={false} bodyClassName="py-8 px-6" className="rounded-xl shadow-xl dark:shadow-none transition-colors duration-200">
          {/* Email Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-brand-100 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {error && (
            <div className="mb-6 border border-signal-red/40 text-signal-red bg-signal-red/10 px-4 py-3 text-sm font-sans rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 border border-signal-green/40 text-signal-green bg-signal-green/10 px-4 py-3 text-sm font-sans rounded-lg">
              {success}
            </div>
          )}

          <div className="text-center mb-6">
            <p className="text-slate-600 dark:text-tactical-dim mb-2">
              Enviamos um link de verificação para:
            </p>
            <p className="font-mono text-sm font-medium text-slate-900 dark:text-tactical-text">
              {currentUser?.email}
            </p>
          </div>

          <div className="border border-signal-amber/40 bg-signal-amber/10 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-signal-amber flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-slate-700 dark:text-tactical-dim">
                <p className="font-sans text-xs font-medium text-signal-amber mb-1">Não recebeu o email?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Verifique sua pasta de spam</li>
                  <li>Certifique-se que o email está correto</li>
                  <li>Aguarde alguns minutos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <TacticalButton
              type="button"
              variant="primary"
              size="lg"
              onClick={handleCheckVerification}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Verificando...' : 'Já verifiquei meu email'}
            </TacticalButton>

            <TacticalButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleResendEmail}
              disabled={loading || countdown > 0}
              className="w-full"
            >
              {countdown > 0 
                ? `Reenviar email (${countdown}s)` 
                : loading 
                  ? 'Enviando...' 
                  : 'Reenviar email de verificação'
              }
            </TacticalButton>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-tactical-border">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-center text-sm text-slate-500 dark:text-tactical-dim hover:text-slate-700 dark:hover:text-tactical-text transition-colors"
            >
              Usar outro email? <span className="font-sans font-medium underline text-brand-600 dark:text-brand-400">Sair</span>
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
