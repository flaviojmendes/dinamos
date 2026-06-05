import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { Panel, TacticalButton } from '../components/tactical';

const inputClass =
  'w-full px-4 py-3 border border-slate-300 dark:border-tactical-border rounded-lg dark:rounded-none bg-white dark:bg-tactical-surface text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green focus:border-transparent transition-colors duration-200';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, digite seu email.');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique o formato.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Falha ao enviar email de recuperação. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
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
          <h2 className="mt-2 text-center text-3xl font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-tactical-text">
            Recuperar senha
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-tactical-dim max-w-sm">
            Digite seu email para receber um link de recuperação de senha.
          </p>
        </div>

        <Panel padded={false} bodyClassName="py-8 px-6" className="rounded-xl dark:rounded-none shadow-xl dark:shadow-none transition-colors duration-200">
          {error && (
            <div className="mb-6 border border-signal-red/40 text-signal-red bg-signal-red/10 px-4 py-3 text-sm font-mono dark:rounded-none">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 border border-signal-green/40 text-signal-green bg-signal-green/10 px-4 py-4 dark:rounded-none">
                <svg className="w-12 h-12 mx-auto mb-3 text-signal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-mono uppercase tracking-wider font-medium">Email enviado!</p>
                <p className="text-sm mt-1">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
              </div>
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm font-mono uppercase tracking-wider font-medium text-brand-600 dark:text-signal-cyan hover:text-brand-700 dark:hover:text-signal-cyan/80 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="email" className="label-mono block mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
                <TacticalButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full dark:rounded-none"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </TacticalButton>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm font-mono uppercase tracking-wider font-medium text-brand-600 dark:text-signal-cyan hover:text-brand-700 dark:hover:text-signal-cyan/80 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar para o login
                </Link>
              </div>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}

