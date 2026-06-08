import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { trackLogin } from '../utils/analytics';
import { Panel, TacticalButton } from '../components/tactical';

const inputClass =
  'w-full px-4 py-3 border border-slate-300 dark:border-tactical-border rounded-lg bg-white dark:bg-tactical-surface text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-500 focus:border-transparent transition-colors duration-200';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, loginWithGithub, loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await loginWithEmail(email, password);
      trackLogin('email');
      navigate('/design-lab');
    } catch (err: any) {
      console.error("Email login error:", err);
      if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado. Verifique o email ou crie uma conta.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Verifique o formato.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Credenciais inválidas. Verifique seu email e senha.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Falha ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      trackLogin('google');
      navigate('/design-lab');
    } catch (err: any) {
      setError('Falha ao fazer login com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGithub();
      trackLogin('github');
      navigate('/design-lab');
    } catch (err: any) {
      console.error("GitHub login error:", err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('Uma conta já existe com o mesmo email mas credenciais diferentes.');
      } else {
        setError('Falha ao fazer login com GitHub. Tente novamente.');
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
          <h2 className="mt-2 text-center text-3xl font-sans font-bold text-slate-900 dark:text-tactical-text">
            Bem-vindo ao Lab
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-tactical-dim max-w-sm">
            Entre para acessar seus projetos de system design e desafios.
          </p>
        </div>

        <Panel padded={false} bodyClassName="py-8 px-6" className="rounded-xl shadow-xl dark:shadow-none transition-colors duration-200">
          {error && (
            <div className="mb-6 border border-signal-red/40 text-signal-red bg-signal-red/10 px-4 py-3 text-sm font-sans rounded-lg">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-slate-700 dark:text-tactical-label">
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
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-slate-700 dark:text-tactical-label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm font-sans font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <TacticalButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Entrando...' : 'Entrar com Email'}
            </TacticalButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-tactical-line"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 font-sans text-xs bg-white dark:bg-tactical-surface text-slate-500 dark:text-tactical-label">
                ou continue com
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Google Login */}
            <TacticalButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </TacticalButton>

            {/* GitHub Login */}
            <TacticalButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Continuar com GitHub
            </TacticalButton>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-tactical-dim">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="font-sans font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 dark:text-tactical-label">
              Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
