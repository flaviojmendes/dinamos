import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { Tag } from '../components/tactical';

export default function Landing() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, loginWithGoogle, loginWithGithub } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/design-lab');
    }
  }, [currentUser, navigate]);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
      </div>
    );
  }

  // Don't render landing page if user is logged in (will redirect)
  if (currentUser) {
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
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
    <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark transition-colors duration-200">
      {/* Theme Toggle in top right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="border-b border-slate-200 dark:border-tactical-border bg-white/50 dark:bg-tactical-surface/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 dark:opacity-20 pointer-events-none hidden lg:block transform rotate-12">
          <svg width="300" height="200" viewBox="0 0 300 200" fill="none" stroke="currentColor" className="text-slate-900 dark:text-tactical-text">
            <path d="M50,50 C100,20 150,80 200,50" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
            <rect x="220" y="30" width="60" height="40" rx="2" strokeWidth="3" />
            <circle cx="30" cy="50" r="20" strokeWidth="3" />
            <path d="M50,50 L220,50" strokeWidth="2" strokeDasharray="8 4" />
            <path d="M250,70 L250,120" strokeWidth="2" />
            <rect x="200" y="120" width="100" height="60" rx="4" strokeWidth="3" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="text-center mb-12">
            <Logo size="large" showSubtitle={true} className="mb-8 justify-center" />
            <h1 className="text-5xl md:text-7xl font-mono font-bold text-slate-900 dark:text-tactical-text mb-8 tracking-tight">
              Pratique System Design
              <span className="block text-brand-600 dark:text-signal-green mt-2">
                Como um Expert
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-tactical-dim max-w-3xl mx-auto leading-relaxed mb-8">
              O Dinamos Design Lab é um ambiente virtual para praticar System Design e arquitetar sistemas escaláveis.
            </p>
            
            <div className="mb-12">
              <Tag color="green">100% GRATUITO</Tag>
            </div>

            {/* Login Buttons */}
            <div className="max-w-md mx-auto">
              {error && (
                <div className="mb-6 border border-signal-red/40 bg-signal-red/10 text-signal-red px-4 py-3 text-sm font-mono uppercase tracking-wider">
                  {error}
                </div>
              )}

              <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none py-8 px-6 transition-colors duration-200">
                <div className="space-y-4">
                  {/* Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 dark:border-tactical-border bg-white dark:bg-tactical-surface text-sm font-mono uppercase tracking-wider font-medium text-slate-700 dark:text-tactical-text hover:bg-slate-50 dark:hover:bg-tactical-raised focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-signal-green dark:rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                  </button>

                  {/* GitHub Login */}
                  <button
                    onClick={handleGithubLogin}
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent bg-slate-900 dark:bg-white text-sm font-mono uppercase tracking-wider font-medium text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-signal-green dark:rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    Continuar com GitHub
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500 dark:text-tactical-label">
                    Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="flex items-center justify-center gap-3 font-mono uppercase tracking-wider text-3xl md:text-4xl font-bold text-slate-900 dark:text-tactical-text mb-4 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
              Por que escolher o Design Lab?
            </h2>
            <p className="text-lg text-slate-600 dark:text-tactical-dim max-w-2xl mx-auto">
              Uma plataforma completa para desenvolver suas habilidades em arquitetura de sistemas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: 'Desafios Reais',
                description: 'Pratique com problemas de system design baseados em sistemas reais de grandes empresas de tecnologia.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                ),
                title: 'Lousa Virtual',
                description: 'Desenhe diagramas e arquiteturas diretamente no navegador com ferramentas intuitivas e profissionais.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Feedback com IA',
                description: 'Receba análise detalhada da sua solução com sugestões de melhoria e boas práticas usando inteligência artificial.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Quizzes Interativos',
                description: 'Teste seus conhecimentos com quizzes cronometrados sobre System Design, arquitetura e sistemas distribuídos.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: 'Fórum da Comunidade',
                description: 'Tire dúvidas, compartilhe ideias e aprenda com outros desenvolvedores em discussões sobre arquitetura.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: 'Wiki de Sistemas Distribuídos',
                description: 'Acesse uma wiki completa com conceitos de sistemas distribuídos, simuladores interativos e materiais de estudo.',
                color: ''
              }
            ].map((feature, i) => (
              <div key={i} className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-8 transition-colors">
                <div className="w-16 h-16 bg-slate-900 dark:bg-tactical-raised text-white dark:text-signal-green border dark:border-tactical-border flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-tactical-dim leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="border-t border-slate-200 dark:border-tactical-border pt-16">
          <div className="text-center mb-16">
            <h3 className="flex items-center justify-center gap-3 font-mono uppercase tracking-wider text-3xl md:text-4xl font-bold text-slate-900 dark:text-tactical-text mb-4 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
              Como Funciona
            </h3>
            <p className="text-lg text-slate-600 dark:text-tactical-dim max-w-2xl mx-auto">
              Um fluxo simples e eficiente para desenvolver suas habilidades
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-tactical-line -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: '01',
                  title: 'Escolha um Desafio',
                  desc: 'Selecione um problema de system design do nosso catálogo de desafios.'
                },
                {
                  step: '02',
                  title: 'Arquiteture sua Solução',
                  desc: 'Use a lousa virtual para desenhar componentes, fluxos e interações do sistema.'
                },
                {
                  step: '03',
                  title: 'Receba Feedback',
                  desc: 'Obtenha análise automática da sua solução com recomendações de melhoria.'
                }
              ].map((step, i) => (
                <div key={i} className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-8 text-center">
                  <div className="text-4xl font-mono font-bold text-brand-600 dark:text-signal-green mb-4">
                    {step.step}
                  </div>
                  <h4 className="text-xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-3">
                    {step.title}
                  </h4>
                  <p className="text-slate-600 dark:text-tactical-dim">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 tactical-panel dark:rounded-none border-signal-amber/30 p-12 text-center card-shadow dark:shadow-none">
          <div className="mb-6">
            <Tag color="green">100% GRATUITO</Tag>
          </div>
          <h3 className="text-3xl md:text-4xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-4">
            Pronto para começar?
          </h3>
          <p className="text-xl text-slate-600 dark:text-tactical-dim mb-8 max-w-2xl mx-auto">
            Junte-se à comunidade e desenvolva suas habilidades em system design
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="px-8 py-3 bg-slate-900 text-white font-mono uppercase tracking-wider font-medium hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200 dark:rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-signal-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Entrar com Google
            </button>
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="px-8 py-3 bg-transparent text-slate-900 dark:text-tactical-text font-mono uppercase tracking-wider font-medium border border-slate-300 dark:border-tactical-line hover:border-slate-900 dark:hover:border-signal-green dark:rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-signal-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Entrar com GitHub
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

