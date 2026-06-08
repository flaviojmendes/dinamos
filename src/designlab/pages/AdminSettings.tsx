import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { Panel, StatusBadge } from '../components/tactical';

interface FreeAccessStatus {
  enabled: boolean;
  description: string;
}

const AdminSettings = () => {
  const { appUser } = useAuth();
  const [freeAccessStatus, setFreeAccessStatus] = useState<FreeAccessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/admin/settings/free-access');
      setFreeAccessStatus(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. You might not have permission.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFreeAccess = async () => {
    if (!freeAccessStatus) return;
    
    setToggling(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const newValue = !freeAccessStatus.enabled;
      const response = await apiClient.put('/api/admin/settings/free-access', { enabled: newValue });
      
      setFreeAccessStatus(prev => prev ? { ...prev, enabled: newValue } : null);
      setSuccessMessage(response.data.message);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Error toggling free access:', err);
      setError(err.response?.data?.detail || 'Failed to toggle free access mode');
    } finally {
      setToggling(false);
    }
  };

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

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-6 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-green-700 dark:text-green-200">{successMessage}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-signal-green"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Free Access Mode Card */}
              <Panel title="Modo de Acesso Gratuito" accent="amber" padded bodyClassName="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 border border-slate-200 dark:border-tactical-border ${freeAccessStatus?.enabled ? 'bg-signal-green/10' : 'bg-slate-100 dark:bg-tactical-raised'}`}>
                          <svg className={`w-6 h-6 ${freeAccessStatus?.enabled ? 'text-signal-green' : 'text-slate-500 dark:text-tactical-label'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <StatusBadge
                          variant={freeAccessStatus?.enabled ? 'active' : 'offline'}
                          label={freeAccessStatus?.enabled ? 'Ativo' : 'Inativo'}
                        />
                      </div>
                      
                      <p className="text-slate-600 dark:text-tactical-dim">
                        {freeAccessStatus?.description || 'Controle o acesso gratuito para todos os usuários da plataforma.'}
                      </p>

                      <div className="mt-4 p-4 border border-signal-amber/40 bg-signal-amber/10">
                        <div className="flex">
                          <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">Nota importante</h3>
                            <p className="mt-1 text-sm text-slate-700 dark:text-tactical-dim">
                              Quando ativado, <strong>todos os usuários</strong> terão acesso completo a todo o conteúdo sem necessidade de assinatura.
                              Isso <strong>não</strong> modifica os dados de assinatura no banco de dados.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <button
                        onClick={handleToggleFreeAccess}
                        disabled={toggling}
                        className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green focus:ring-offset-2 dark:focus:ring-offset-tactical-bg ${
                          freeAccessStatus?.enabled ? 'bg-signal-green' : 'bg-slate-300 dark:bg-tactical-raised'
                        } ${toggling ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        <span className="sr-only">Toggle free access</span>
                        <span
                          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            freeAccessStatus?.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        >
                          {toggling && (
                            <svg className="animate-spin h-5 w-5 text-gray-400 m-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-tactical-raised border-t border-slate-200 dark:border-tactical-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-sm font-medium text-slate-500 dark:text-tactical-label">
                      Status atual:
                    </span>
                    <span className={`text-sm ${freeAccessStatus?.enabled ? 'text-emerald-600 dark:text-signal-green' : 'text-slate-600 dark:text-tactical-dim'}`}>
                      {freeAccessStatus?.enabled 
                        ? '✓ Todos os usuários têm acesso completo' 
                        : '✗ Acesso restrito por assinatura'
                      }
                    </span>
                  </div>
                </div>
              </Panel>

              {/* Features Section */}
              <Panel title="Como funciona" accent="cyan" bodyClassName="space-y-2 text-slate-700 dark:text-tactical-dim text-sm">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-600 dark:text-signal-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quando <strong>ativado</strong>, todos os usuários autenticados são tratados como assinantes
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-600 dark:text-signal-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    O frontend verá <code className="bg-slate-100 dark:bg-tactical-raised px-1 font-mono text-xs">is_subscribed: true</code> para todos os usuários
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-600 dark:text-signal-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <strong>Sem alterações no banco</strong> - status de assinatura dos usuários permanece intocado
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-600 dark:text-signal-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Alterações têm efeito <strong>imediato</strong> - não é necessário reiniciar o servidor
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-600 dark:text-signal-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quando <strong>desativado</strong>, verificações normais de assinatura são retomadas
                  </li>
                </ul>
              </Panel>

              {/* Current Features Available */}
              <Panel title="Recursos incluídos no acesso gratuito" accent="green" bodyClassName="space-y-2 text-slate-700 dark:text-tactical-dim text-sm">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Acesso ilimitado a todos os desafios de System Design
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Todos os quizzes disponíveis
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Feedback com IA personalizado
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvamento automático do progresso
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Histórico de soluções e pontuações
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Acesso ao fórum da comunidade
                  </li>
                </ul>
              </Panel>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
