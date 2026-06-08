import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { Role } from '../types';
import UserBadge from '../components/UserBadge';
import { TacticalButton, StatusBadge, Panel } from '../components/tactical';

const inputClass =
  'w-full px-4 py-3 rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green';
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-tactical-dim mb-2';
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Users,
  Megaphone,
  Shield,
  Search,
  CheckSquare,
  Square,
  MinusSquare
} from 'lucide-react';

interface SelectableUser {
  id: string;
  email: string;
  nickname: string | null;
  avatar_image: string | null;
  is_subscribed: boolean;
  role: string;
  role_color: string;
}

const AdminNotifications = () => {
  const { appUser } = useAuth();
  
  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  
  // Filter state
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Users state
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // UI state
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sendResult, setSendResult] = useState<{
    notifications_created: number;
    emails_sent: number;
  } | null>(null);
  
  // Roles for dropdown
  const [roles, setRoles] = useState<Role[]>([]);

  // Fetch roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiClient.get('/api/admin/roles');
        setRoles(response.data.roles);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };
    fetchRoles();
  }, []);

  // Fetch users when filters change - DON'T clear selection
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const params: any = {};
        if (subscriptionFilter !== 'all') {
          params.subscription_filter = subscriptionFilter;
        }
        if (roleFilter !== 'all') {
          params.role_filter = roleFilter;
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        
        const response = await apiClient.get('/api/admin/notifications/users', { params });
        setUsers(response.data.users);
        // Keep selection - don't reset when filters change
      } catch (err) {
        console.error('Error fetching users:', err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [subscriptionFilter, roleFilter, searchTerm]);

  // Count how many selected users are visible vs hidden
  const visibleUserIds = new Set(users.map(u => u.id));
  const selectedVisibleCount = Array.from(selectedUserIds).filter(id => visibleUserIds.has(id)).length;
  const selectedHiddenCount = selectedUserIds.size - selectedVisibleCount;

  const handleSelectAllVisible = () => {
    const visibleIds = users.map(u => u.id);
    const allVisibleSelected = visibleIds.every(id => selectedUserIds.has(id));
    
    if (allVisibleSelected) {
      // Deselect all visible (keep hidden selections)
      const newSelected = new Set(selectedUserIds);
      visibleIds.forEach(id => newSelected.delete(id));
      setSelectedUserIds(newSelected);
    } else {
      // Select all visible (add to existing selections)
      const newSelected = new Set(selectedUserIds);
      visibleIds.forEach(id => newSelected.add(id));
      setSelectedUserIds(newSelected);
    }
  };

  const getVisibleSelectionState = () => {
    if (users.length === 0) return 'none';
    const visibleSelectedCount = users.filter(u => selectedUserIds.has(u.id)).length;
    if (visibleSelectedCount === 0) return 'none';
    if (visibleSelectedCount === users.length) return 'all';
    return 'partial';
  };

  const handleToggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setError('Título e mensagem são obrigatórios');
      return;
    }

    if (selectedUserIds.size === 0) {
      setError('Selecione pelo menos um usuário');
      return;
    }

    setSending(true);
    setError('');
    setSendResult(null);

    try {
      const payload: any = {
        title: title.trim(),
        message: message.trim(),
        send_email: sendEmail,
        user_ids: Array.from(selectedUserIds)
      };
      
      if (emailSubject.trim()) payload.email_subject = emailSubject.trim();
      if (ctaText.trim()) payload.cta_text = ctaText.trim();
      if (ctaUrl.trim()) payload.cta_url = ctaUrl.trim();

      const response = await apiClient.post('/api/admin/notifications/selected', payload);

      setSendResult({
        notifications_created: response.data.notifications_created,
        emails_sent: response.data.emails_sent
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao enviar notificações');
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setEmailSubject('');
    setCtaText('');
    setCtaUrl('');
    setSendEmail(true);
    setSubscriptionFilter('all');
    setRoleFilter('all');
    setSearchTerm('');
    setSelectedUserIds(new Set());
    setSuccess(false);
    setSendResult(null);
    setError('');
  };


  if (!appUser || appUser.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h2>
            <p className="text-gray-600 dark:text-gray-400">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 border border-signal-amber/40 bg-signal-amber/10">
                <Megaphone className="h-6 w-6 text-signal-amber" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
                  Enviar notificações
                </h1>
                <p className="text-slate-500 dark:text-tactical-label">
                  Selecione os usuários e envie mensagens personalizadas
                </p>
              </div>
            </div>
          </div>

          {success ? (
            /* Success State */
            <div className="tactical-panel p-8 text-center max-w-lg mx-auto">
              <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-tactical-text mb-3">
                Notificações Enviadas!
              </h2>
              {sendResult && (
                <div className="space-y-2 mb-6">
                  <p className="text-slate-600 dark:text-tactical-dim">
                    <span className="font-semibold text-sky-600 dark:text-sky-400">{sendResult.notifications_created}</span> notificação(ões) criada(s)
                  </p>
                  <p className="text-slate-600 dark:text-tactical-dim">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{sendResult.emails_sent}</span> email(s) enviado(s)
                  </p>
                </div>
              )}
              <TacticalButton variant="primary" onClick={resetForm}>
                Enviar Nova Mensagem
              </TacticalButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column: Filters + User List */}
              <div className="space-y-6">
                {/* Filters */}
                <Panel title="Filtrar Usuários" accent="amber">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou email..."
                        className={`${inputClass} pl-9 py-2.5 text-sm`}
                      />
                    </div>

                    {/* Subscription Filter */}
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={subscriptionFilter}
                        onChange={(e) => setSubscriptionFilter(e.target.value)}
                        className={`${inputClass} pl-9 py-2.5 text-sm appearance-none`}
                      >
                        <option value="all">Todos</option>
                        <option value="subscribed">Assinantes</option>
                        <option value="not_subscribed">Não assinantes</option>
                      </select>
                    </div>

                    {/* Role Filter */}
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className={`${inputClass} pl-9 py-2.5 text-sm appearance-none`}
                      >
                        <option value="all">Todos os papéis</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Panel>

                {/* User List */}
                <div className="tactical-panel overflow-hidden">
                  {/* List Header */}
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-tactical-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSelectAllVisible}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          title={getVisibleSelectionState() === 'all' ? 'Desmarcar visíveis' : 'Selecionar visíveis'}
                        >
                          {getVisibleSelectionState() === 'all' ? (
                            <CheckSquare className="h-5 w-5 text-brand-600 dark:text-signal-green" />
                          ) : getVisibleSelectionState() === 'partial' ? (
                            <MinusSquare className="h-5 w-5 text-brand-600 dark:text-signal-green" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {users.length} usuário(s) na lista
                        </span>
                      </div>
                      {selectedUserIds.size > 0 && (
                        <button
                          onClick={() => setSelectedUserIds(new Set())}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Limpar seleção
                        </button>
                      )}
                    </div>
                    
                    {/* Selection summary */}
                    {selectedUserIds.size > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full font-medium">
                          {selectedUserIds.size} selecionado(s) no total
                        </span>
                        {selectedHiddenCount > 0 && (
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                            {selectedHiddenCount} oculto(s) pelo filtro
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User List Content */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {loadingUsers ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-tactical-label">Nenhum usuário encontrado</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map(user => (
                          <label
                            key={user.id}
                            className={`flex items-center gap-4 px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                              selectedUserIds.has(user.id) ? 'bg-sky-50 dark:bg-sky-900/20' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUserIds.has(user.id)}
                              onChange={() => handleToggleUser(user.id)}
                              className="w-4 h-4 text-sky-500 rounded border-gray-300 dark:border-gray-600 focus:ring-sky-500"
                            />
                            
                            {/* Avatar */}
                            {user.avatar_image ? (
                              <img
                                src={user.avatar_image}
                                alt={user.nickname || ''}
                                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-slate-500 dark:text-tactical-label">
                                  {(user.nickname || user.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-900 dark:text-tactical-text truncate">
                                  {user.nickname || 'Sem nome'}
                                </p>
                                <UserBadge role={user.role} color={user.role_color} />
                              </div>
                              <p className="text-xs text-slate-500 dark:text-tactical-label truncate">
                                {user.email}
                              </p>
                            </div>

                            {/* Status */}
                            <div className="flex-shrink-0">
                              {user.is_subscribed ? (
                                <StatusBadge variant="active" label="Assinante" />
                              ) : (
                                <StatusBadge variant="offline" label="Gratuito" />
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Message Composer */}
              <div>
                <Panel title="Compor Mensagem" accent="cyan" className="sticky top-24">

                  {error && (
                    <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <label className={labelClass}>
                        Título da Notificação *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Novidades no Design Lab!"
                        className={inputClass}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClass}>
                        Mensagem *
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escreva sua mensagem aqui..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Email Options */}
                    <div className="p-4 bg-gray-50 dark:bg-tactical-raised/50 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Enviar também por email
                          </label>
                          <p className="text-xs text-slate-500 dark:text-tactical-label">
                            Email individual para cada usuário
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSendEmail(!sendEmail)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            sendEmail ? 'bg-signal-green' : 'bg-slate-300 dark:bg-tactical-raised'
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Assunto do Email (opcional)
                            </label>
                            <input
                              type="text"
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              placeholder="Deixe em branco para usar o título"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text text-sm placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Botão (texto)
                              </label>
                              <input
                                type="text"
                                value={ctaText}
                                onChange={(e) => setCtaText(e.target.value)}
                                placeholder="Ex: Ver Novidades"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text text-sm placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Botão (URL)
                              </label>
                              <input
                                type="url"
                                value={ctaUrl}
                                onChange={(e) => setCtaUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-tactical-raised text-slate-900 dark:text-tactical-text text-sm placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Selected Count & Send Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      {selectedUserIds.size > 0 && (
                        <div className="mb-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                          <p className="text-sm text-sky-700 dark:text-sky-300">
                            <strong>{selectedUserIds.size}</strong> usuário(s) selecionado(s) receberão esta mensagem
                          </p>
                        </div>
                      )}
                      
                      <TacticalButton
                        onClick={handleSend}
                        disabled={sending || !title.trim() || !message.trim() || selectedUserIds.size === 0}
                        variant="primary"
                        className="w-full justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            Enviar para {selectedUserIds.size || 0} usuário(s)
                          </>
                        )}
                      </TacticalButton>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;
