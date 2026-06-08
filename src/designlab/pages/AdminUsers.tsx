import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { User } from '../types';
import UserBadge from '../components/UserBadge';
import { X, Send, Mail, Loader2, CheckCircle, AlertCircle, RotateCcw, Coins, Brain, History, ChevronLeft, ChevronRight } from 'lucide-react';
// Token Transaction types
interface TokenTransaction {
  id: number;
  amount: number;
  action_type: string;
  action_description: string;
  related_id?: number;
  related_type?: string;
  created_at: string;
}

interface TokenHistoryUser {
  id: string;
  nickname: string;
  email: string;
  tokens: number;
}

// Token History Modal Component
interface TokenHistoryProps {
  user: User;
  onClose: () => void;
}

const TokenHistoryModal = ({ user, onClose }: TokenHistoryProps) => {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState<TokenHistoryUser | null>(null);
  const limit = 15;

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/api/admin/users/${user.id}/token-transactions`, {
        params: { skip: (page - 1) * limit, limit }
      });
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
      setUserData(response.data.user);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  // Get icon/color based on action type
  const getActionStyle = (actionType: string) => {
    if (actionType.includes('UPVOTE')) return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' };
    if (actionType.includes('CREATE') || actionType.includes('REPLY')) return { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300' };
    if (actionType.includes('BONUS') || actionType.includes('APPROVED')) return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' };
    if (actionType.includes('QUIZ')) return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' };
    if (actionType.includes('CHALLENGE')) return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' };
    return { bg: 'bg-gray-100 dark:bg-tactical-raised', text: 'text-gray-700 dark:text-tactical-text' };
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-tactical-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Histórico de DinaCoins</h2>
              <p className="text-sm text-amber-100">{user.nickname || user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-lg">
              <Coins className="h-4 w-4 text-white" />
              <span className="text-white font-semibold">{userData?.tokens || user.tokens || 0}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-tactical-label">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const style = getActionStyle(tx.action_type);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-tactical-raised/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${style.bg}`}>
                        <Coins className={`h-4 w-4 ${style.text}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-tactical-text">
                          {tx.action_description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-tactical-label">
                          {tx.created_at ? new Date(tx.created_at).toLocaleString('pt-BR') : '-'}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold ${
                      tx.amount >= 0 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-tactical-border flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-tactical-dim">
              {total} transações
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-tactical-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-tactical-dim" />
              </button>
              <span className="text-sm text-slate-600 dark:text-tactical-dim min-w-[80px] text-center">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-tactical-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-slate-600 dark:text-tactical-dim" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Message Composer Modal Component
interface MessageComposerProps {
  user: User;
  onClose: () => void;
  onSent: () => void;
}

const MessageComposer = ({ user, onClose, onSent }: MessageComposerProps) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setError('Título e mensagem são obrigatórios');
      return;
    }

    setSending(true);
    setError('');

    try {
      await apiClient.post(`/api/admin/notifications/system?user_id=${user.id}`, {
        title: title.trim(),
        message: message.trim(),
        email_subject: emailSubject.trim() || undefined,
        cta_text: ctaText.trim() || undefined,
        cta_url: ctaUrl.trim() || undefined,
        send_email: sendEmail
      });

      setSuccess(true);
      setTimeout(() => {
        onSent();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao enviar notificação');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-tactical-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <Mail className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Enviar Mensagem</h2>
              <p className="text-sm text-slate-400">para {user.nickname || user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-tactical-text mb-2">
                Mensagem Enviada!
              </h3>
              <p className="text-slate-500 dark:text-tactical-label">
                A notificação foi enviada com sucesso.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-tactical-text mb-2">
                  Título da Notificação *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Bem-vindo ao Design Lab!"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-tactical-border bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-tactical-text mb-2">
                  Mensagem *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem aqui..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-tactical-border bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">
                  Esta mensagem aparecerá na notificação in-app e no email.
                </p>
              </div>

              {/* Email Options */}
              <div className="p-4 bg-gray-50 dark:bg-tactical-raised/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-tactical-text">
                      Enviar também por email
                    </label>
                    <p className="text-xs text-slate-500 dark:text-tactical-label">
                      O usuário receberá um email formatado
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSendEmail(!sendEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      sendEmail ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        sendEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {sendEmail && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-tactical-text mb-1">
                        Assunto do Email (opcional)
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Deixe em branco para usar o título"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-tactical-border bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text text-sm placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-tactical-text mb-1">
                          Texto do Botão (opcional)
                        </label>
                        <input
                          type="text"
                          value={ctaText}
                          onChange={(e) => setCtaText(e.target.value)}
                          placeholder="Ex: Ver Desafios"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-tactical-border bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text text-sm placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-tactical-text mb-1">
                          URL do Botão (opcional)
                        </label>
                        <input
                          type="url"
                          value={ctaUrl}
                          onChange={(e) => setCtaUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-tactical-border bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text text-sm placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-tactical-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-tactical-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !title.trim() || !message.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 font-sans font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Notificação
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Message composer state
  const [messageUser, setMessageUser] = useState<User | null>(null);
  
  // Token history modal state
  const [tokenHistoryUser, setTokenHistoryUser] = useState<User | null>(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  
  // New filters for coins and quiz
  const [minTokens, setMinTokens] = useState<string>('');
  const [maxTokens, setMaxTokens] = useState<string>('');
  const [minQuizAvg, setMinQuizAvg] = useState<string>('');
  const [maxQuizAvg, setMaxQuizAvg] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // For future: Load roles dynamically from backend
  const availableRoles = ["Estudante", "Tutor", "Admin"];

  useEffect(() => {
    // Reset page when filters change
    setPage(1);
  }, [searchTerm, roleFilter, minTokens, maxTokens, minQuizAvg, maxQuizAvg]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, page, sortBy, sortDesc, minTokens, maxTokens, minQuizAvg, maxQuizAvg]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        skip: (page - 1) * limit,
        limit: limit,
        sort_by: sortBy,
        sort_desc: sortDesc
      };
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      
      // Token filters
      if (minTokens) params.min_tokens = parseInt(minTokens);
      if (maxTokens) params.max_tokens = parseInt(maxTokens);
      
      // Quiz average filters
      if (minQuizAvg) params.min_quiz_avg = parseInt(minQuizAvg);
      if (maxQuizAvg) params.max_quiz_avg = parseInt(maxQuizAvg);

      const response = await apiClient.get('/api/admin/users', { params });
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. You might not have permission.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      await apiClient.put(`/api/admin/users/${userId}/role`, { role: newRole });
      
      // Optimistic update
      // Note: In a real app we might want to refetch to get the correct color for the new role
      // For now we'll just update the role name
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      // Optional: Refetch to get updated colors/permissions
      fetchUsers();
      
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const handleResetOnboarding = async (userId: string, nickname: string) => {
    if (!confirm(`Resetar onboarding de ${nickname}? O usuário verá o tour novamente ao acessar a home.`)) {
      return;
    }
    
    setUpdating(userId);
    try {
      await apiClient.put(`/api/admin/users/${userId}/reset-onboarding`);
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, onboarding_completed: false } : u
      ));
      
      alert('Onboarding resetado com sucesso!');
    } catch (err) {
      console.error('Error resetting onboarding:', err);
      alert('Falha ao resetar onboarding');
    } finally {
      setUpdating(null);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <span className="text-gray-400 ml-1">↕</span>;
    return (
      <span className="ml-1 text-sky-600 dark:text-sky-400">
        {sortDesc ? '↓' : '↑'}
      </span>
    );
  };

  if (!appUser || appUser.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h2>
            <p className="text-slate-600 dark:text-tactical-dim">Você não tem permissão para ver esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Gerenciamento de usuários
            </h1>
          </div>
          
          {/* Filters */}
          <div className="tactical-panel p-4 mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <input
                  type="text"
                  id="search"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-4 py-2"
                />
              </div>
              <div className="w-full sm:w-48">
                <label htmlFor="role-filter" className="sr-only">Filtrar por Papel</label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2"
                >
                  <option value="all">Todos os Papéis</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  showAdvancedFilters 
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-tactical-raised dark:text-tactical-text dark:hover:bg-gray-600'
                }`}
              >
                {showAdvancedFilters ? 'Ocultar Filtros' : 'Mais Filtros'}
              </button>
              <div className="w-full sm:w-auto bg-gray-100 dark:bg-tactical-raised px-4 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-tactical-text whitespace-nowrap">
                Total: {totalUsers}
              </div>
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-tactical-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1 flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                    DinaCoins Mín.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minTokens}
                    onChange={(e) => setMinTokens(e.target.value)}
                    placeholder="0"
                    className="block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1 flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5 text-amber-500" />
                    DinaCoins Máx.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                    placeholder="Sem limite"
                    className="block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1 flex items-center gap-1">
                    <Brain className="h-3.5 w-3.5 text-emerald-500" />
                    Média Quiz Mín. (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={minQuizAvg}
                    onChange={(e) => setMinQuizAvg(e.target.value)}
                    placeholder="0"
                    className="block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-tactical-label mb-1 flex items-center gap-1">
                    <Brain className="h-3.5 w-3.5 text-emerald-500" />
                    Média Quiz Máx. (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={maxQuizAvg}
                    onChange={(e) => setMaxQuizAvg(e.target.value)}
                    placeholder="100"
                    className="block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-tactical-label">Carregando usuários...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-red-700 dark:text-red-200">{error}</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="tactical-panel p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 h-12 w-12">
                          {user.avatar_image ? (
                            <img className="h-12 w-12 rounded-full object-cover" src={user.avatar_image} alt="" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-tactical-raised flex items-center justify-center">
                              <span className="text-base font-medium text-slate-500 dark:text-tactical-label">
                                {(user.nickname || user.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <div className="text-base font-medium text-slate-900 dark:text-tactical-text truncate">
                            {user.nickname || 'Sem apelido'}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-tactical-label truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-tactical-label">Papel:</span>
                        <UserBadge role={user.role} color={user.role_color} />
                      </div>
                      
                      {/* Coins and Quiz Stats Row */}
                      <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 dark:bg-tactical-raised/50 rounded-lg">
                        <button
                          onClick={() => setTokenHistoryUser(user)}
                          className="flex items-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-2 py-1 rounded-md transition-colors group"
                          title="Ver histórico de DinaCoins"
                        >
                          <Coins className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium text-slate-900 dark:text-tactical-text">{user.tokens || 0}</span>
                          <History className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center gap-1.5">
                          <Brain className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-slate-900 dark:text-tactical-text">{user.avg_quiz_score || 0}%</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-tactical-label">
                          ({user.quizzes_completed || 0} quiz{(user.quizzes_completed || 0) !== 1 ? 'zes' : ''})
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-tactical-label">Entrou em:</span>
                        <span className="text-sm text-slate-900 dark:text-tactical-text">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-tactical-border">
                        <label className="block text-sm font-medium text-gray-700 dark:text-tactical-text mb-1">
                          Alterar Papel:
                        </label>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updating === user.id || user.id === appUser.id}
                          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-tactical-border focus:outline-none focus:ring-sky-500 focus:border-sky-500 rounded-md dark:bg-tactical-raised dark:text-white disabled:opacity-50"
                        >
                          {availableRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setMessageUser(user)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 text-sm font-sans font-medium transition-all"
                        >
                          <Mail className="h-4 w-4" />
                          Mensagem
                        </button>
                        <button
                          onClick={() => handleResetOnboarding(user.id, user.nickname || user.email)}
                          disabled={updating === user.id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-300 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                          title="Resetar onboarding"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block tactical-panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-tactical-raised/50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-tactical-label cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSort('nickname')}
                        >
                          <div className="flex items-center">
                            Usuário <SortIcon column="nickname" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-tactical-label cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSort('role')}
                        >
                          <div className="flex items-center">
                            Papel <SortIcon column="role" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-tactical-label cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSort('tokens')}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Coins className="h-3.5 w-3.5 text-amber-500" />
                            Coins <SortIcon column="tokens" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-tactical-label cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSort('avg_quiz_score')}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Brain className="h-3.5 w-3.5 text-emerald-500" />
                            Quiz <SortIcon column="avg_quiz_score" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-tactical-label cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSort('created_at')}
                        >
                          <div className="flex items-center">
                            Entrou em <SortIcon column="created_at" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-tactical-label">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-tactical-surface divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.avatar_image ? (
                                  <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_image} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-tactical-raised flex items-center justify-center">
                                    <span className="text-sm font-medium text-slate-500 dark:text-tactical-label">
                                      {(user.nickname || user.email).charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900 dark:text-tactical-text">
                                  {user.nickname || 'Sem apelido'}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-tactical-label">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <UserBadge role={user.role} color={user.role_color} />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => setTokenHistoryUser(user)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors group cursor-pointer"
                              title="Ver histórico de DinaCoins"
                            >
                              <Coins className="h-3.5 w-3.5" />
                              {user.tokens || 0}
                              <History className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex flex-col items-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
                                (user.avg_quiz_score || 0) >= 80 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  : (user.avg_quiz_score || 0) >= 60
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                    : 'bg-gray-100 text-gray-700 dark:bg-tactical-raised dark:text-tactical-text'
                              }`}>
                                <Brain className="h-3.5 w-3.5" />
                                {user.avg_quiz_score || 0}%
                              </span>
                              <span className="text-xs text-slate-500 dark:text-tactical-label mt-0.5">
                                {user.quizzes_completed || 0} quiz{(user.quizzes_completed || 0) !== 1 ? 'zes' : ''}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-tactical-label">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                disabled={updating === user.id || user.id === appUser.id}
                                className="block w-32 pl-3 pr-8 py-2 text-base border-gray-300 dark:border-tactical-border focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md dark:bg-tactical-raised dark:text-white disabled:opacity-50"
                              >
                                {availableRoles.map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => setMessageUser(user)}
                                className="p-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:text-sky-300 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                                title="Enviar mensagem"
                              >
                                <Mail className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleResetOnboarding(user.id, user.nickname || user.email)}
                                disabled={updating === user.id}
                                className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20 rounded-lg transition-colors disabled:opacity-50"
                                title="Resetar onboarding"
                              >
                                <RotateCcw className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Pagination */}
          {totalUsers > limit && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-700 dark:text-tactical-text">
                Mostrando {((page - 1) * limit) + 1} até {Math.min(page * limit, totalUsers)} de {totalUsers} usuários
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-tactical-surface text-sm font-medium text-slate-500 dark:text-tactical-label hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers - simplified logic for now */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Simple sliding window logic could be added here, for now just show first 5 or around current page
                  let p = page;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-medium ${
                        page === p
                          ? 'z-10 bg-sky-50 border-sky-500 text-sky-600 dark:bg-sky-900/20 dark:border-sky-500 dark:text-sky-300'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-tactical-surface dark:border-tactical-border dark:text-tactical-dim dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-tactical-surface text-sm font-medium text-slate-500 dark:text-tactical-label hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="sr-only">Próximo</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
      
      {/* Message Composer Modal */}
      {messageUser && (
        <MessageComposer
          user={messageUser}
          onClose={() => setMessageUser(null)}
          onSent={() => {
            // Optionally refresh or show a toast
          }}
        />
      )}
      
      {/* Token History Modal */}
      {tokenHistoryUser && (
        <TokenHistoryModal
          user={tokenHistoryUser}
          onClose={() => setTokenHistoryUser(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
