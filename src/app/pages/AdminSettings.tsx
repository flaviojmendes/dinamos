import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Panel } from '../../components/tactical';

const AdminSettings = () => {
  const { appUser } = useAuth();

  if (!appUser || appUser.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-tactical-dim">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text mb-8">
            Configurações do sistema
          </h1>

          <div className="space-y-6">
            <Panel title="Plataforma gratuita" accent="green" bodyClassName="space-y-2 text-slate-700 dark:text-tactical-dim text-sm">
              <p>
                Toda a plataforma é <strong>gratuita</strong> e está disponível para todos os usuários autenticados.
                Todo o conteúdo abaixo é acessível sem qualquer restrição.
              </p>
              <ul className="space-y-2 mt-4">
                {[
                  'Acesso ilimitado a todos os desafios de System Design',
                  'Todos os quizzes disponíveis',
                  'Feedback com IA personalizado',
                  'Salvamento automático do progresso',
                  'Histórico de soluções e pontuações',
                  'Acesso ao fórum da comunidade',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
