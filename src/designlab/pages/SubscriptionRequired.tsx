import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { Panel, TacticalButton, StatusBadge } from '../components/tactical';

export default function SubscriptionRequired() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/design-lab');
  };

  return (
    <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-lg w-full space-y-8">
        {/* Logo at top */}
        <div className="flex justify-center">
          <Logo size="medium" showSubtitle={true} />
        </div>
        
        <Panel padded={false} bodyClassName="p-8" className="rounded-2xl shadow-2xl dark:shadow-none transition-colors duration-200">
          <div className="text-center">
            {/* Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-tactical-raised border border-amber-200 dark:border-signal-amber/40 mb-4">
              <svg
                className="h-10 w-10 text-amber-600 dark:text-signal-amber"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <div className="flex justify-center mb-3">
              <StatusBadge variant="locked" label="Acesso restrito" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-tactical-text mb-2">
              Acesso Restrito
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm text-slate-600 dark:text-tactical-dim mb-6">
              Este conteúdo não está disponível no momento
            </p>

            {/* Description */}
            <div className="border border-signal-amber/40 bg-signal-amber/10 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-slate-700 dark:text-tactical-dim">
                O acesso a este conteúdo está temporariamente restrito. 
                Entre em contato com o administrador da plataforma para mais informações.
              </p>
            </div>

            {/* Features that will be available */}
            <div className="text-left mb-8 space-y-3">
              <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text text-center mb-3">
                ✨ Conteúdo disponível com acesso completo:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-signal-green mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-tactical-dim">Todos os desafios de System Design</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-signal-green mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-tactical-dim">Feedback com IA personalizado</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-signal-green mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-tactical-dim">Todos os quizzes</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-signal-green mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-tactical-dim">Histórico de soluções</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <TacticalButton
                type="button"
                variant="primary"
                size="lg"
                onClick={handleGoHome}
                className="w-full"
              >
                Voltar para o Início
              </TacticalButton>
              
              <TacticalButton
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleLogout}
                className="w-full"
              >
                Sair
              </TacticalButton>
            </div>

            {/* Support info */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-tactical-border">
              <p className="text-xs text-slate-500 dark:text-tactical-label">
                Precisa de ajuda? Entre em contato:<br />
                <a href="mailto:flavio@trilha.info" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                  flavio@trilha.info
                </a>
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
