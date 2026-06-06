import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/api';
import { Notification } from '../types';
import Navbar from '../components/Navbar';
import { 
  Bell, 
  MessageSquare, 
  AlertCircle, 
  Trophy, 
  AtSign,
  CheckCheck,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TacticalButton } from '../components/tactical';

// Message Modal Component
interface MessageModalProps {
  notification: Notification;
  onClose: () => void;
  onDelete: (id: number) => void;
  onNavigate: (notification: Notification) => void;
}

const MessageModal = ({ notification, onClose, onDelete, onNavigate }: MessageModalProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'reply': return <MessageSquare className="h-6 w-6 text-brand-600 dark:text-signal-cyan" />;
      case 'mention': return <AtSign className="h-6 w-6 text-brand-600 dark:text-signal-cyan" />;
      case 'system': return <AlertCircle className="h-6 w-6 text-signal-amber" />;
      case 'achievement': return <Trophy className="h-6 w-6 text-signal-amber" />;
      default: return <Bell className="h-6 w-6 text-slate-400 dark:text-tactical-label" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="tactical-panel dark:rounded-none w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-tactical-surface" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-tactical-border flex justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            {notification.actor_avatar ? (
              <img src={notification.actor_avatar} alt="" className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-tactical-border" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-tactical-raised flex items-center justify-center border border-slate-200 dark:border-tactical-border">
                {getIcon(notification.type)}
              </div>
            )}
            <div>
              <h2 className="font-mono uppercase tracking-wider text-lg font-bold text-slate-900 dark:text-tactical-text leading-tight">
                {notification.title}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-tactical-dim font-mono tabular-nums">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text dark:rounded-none hover:bg-slate-100 dark:hover:bg-tactical-raised transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-tactical-dim whitespace-pre-wrap">
            {notification.message}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-bg flex justify-between items-center gap-3">
           <TacticalButton
            variant="danger"
            size="sm"
            onClick={() => {
                if (confirm('Tem certeza que deseja excluir esta notificação?')) {
                    onDelete(notification.id);
                    onClose();
                }
            }}
            className="dark:rounded-none"
           >
             <Trash2 className="h-4 w-4" />
             Excluir
           </TacticalButton>

           {notification.link_type && notification.link_id && (
             <TacticalButton
                variant="primary"
                onClick={() => {
                    onNavigate(notification);
                    onClose();
                }}
                className="dark:rounded-none"
             >
               <span>Ver Conteúdo</span>
               <ExternalLink className="h-4 w-4" />
             </TacticalButton>
           )}
        </div>
      </div>
    </div>
  );
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/notifications', {
        params: {
          skip: 0,
          limit: 50,
          unread_only: showUnreadOnly
        }
      });
      setNotifications(response.data.notifications);
      setTotal(response.data.total);
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      setError('Erro ao carregar notificações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [showUnreadOnly]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="h-5 w-5 text-brand-600 dark:text-signal-cyan" />;
      case 'mention':
        return <AtSign className="h-5 w-5 text-brand-600 dark:text-signal-cyan" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-signal-amber" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-signal-amber" />;
      default:
        return <Bell className="h-5 w-5 text-slate-400 dark:text-tactical-label" />;
    }
  };

  const getNotificationLink = (notification: Notification): string | null => {
    if (notification.link_type === 'topic' && notification.link_id) {
      return `/forum/topic/${notification.link_id}`;
    }
    if (notification.link_type === 'challenge' && notification.link_id) {
      return `/challenge/${notification.link_id}`;
    }
    return null;
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.is_read) {
      try {
        await apiClient.put(`/api/notifications/${notification.id}/read`);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }

    // Open modal instead of direct navigation for better reading
    setSelectedNotification(notification);
  };

  const handleNavigate = (notification: Notification) => {
     const link = getNotificationLink(notification);
     if (link) {
       navigate(link);
     }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAllRead(true);
      await apiClient.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setTotal(prev => prev - 1);
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/design-lab"
              className="inline-flex items-center font-mono uppercase tracking-wider text-xs text-slate-500 hover:text-slate-700 dark:text-tactical-dim dark:hover:text-tactical-text mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
            
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-signal-cyan/40 bg-signal-cyan/10 dark:rounded-none">
                  <Bell className="h-6 w-6 text-brand-600 dark:text-signal-cyan" />
                </div>
                <div>
                  <h1 className="flex items-center gap-2 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text pl-2">
                    Notificações
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-tactical-dim font-mono tabular-nums mt-1">
                    {unreadCount > 0 ? (
                      <span>{unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}</span>
                    ) : (
                      <span>Todas lidas</span>
                    )}
                  </p>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <TacticalButton
                  variant="secondary"
                  size="sm"
                  onClick={handleMarkAllRead}
                  disabled={markingAllRead}
                  className="dark:rounded-none"
                >
                  {markingAllRead ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCheck className="h-4 w-4" />
                  )}
                  Marcar todas como lidas
                </TacticalButton>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setShowUnreadOnly(false)}
              className={`px-4 py-2 dark:rounded-none text-xs font-mono uppercase tracking-wider font-medium transition-colors border ${
                !showUnreadOnly
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent'
                  : 'bg-transparent text-slate-600 dark:text-tactical-dim border-slate-300 dark:border-tactical-line hover:border-slate-900 dark:hover:border-signal-green'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setShowUnreadOnly(true)}
              className={`px-4 py-2 dark:rounded-none text-xs font-mono uppercase tracking-wider font-medium transition-colors border ${
                showUnreadOnly
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent'
                  : 'bg-transparent text-slate-600 dark:text-tactical-dim border-slate-300 dark:border-tactical-line hover:border-slate-900 dark:hover:border-signal-green'
              }`}
            >
              Não lidas
            </button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-signal-green" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-signal-red mx-auto mb-4" />
              <p className="text-slate-500 dark:text-tactical-dim">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 tactical-panel dark:rounded-none">
              <Bell className="h-12 w-12 text-slate-300 dark:text-tactical-label mx-auto mb-4" />
              <p className="font-mono uppercase tracking-wider text-sm text-slate-500 dark:text-tactical-dim">
                {showUnreadOnly ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </p>
              <p className="text-sm text-slate-500 dark:text-tactical-label mt-1">
                Você será notificado quando alguém responder às suas mensagens
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative p-4 dark:rounded-none border transition-all cursor-pointer tactical-panel ${
                    notification.is_read
                      ? 'bg-white dark:bg-tactical-surface border-slate-200 dark:border-tactical-border hover:border-slate-300 dark:hover:border-tactical-line'
                      : 'bg-brand-50 dark:bg-signal-green/5 border-brand-200 dark:border-signal-green/30 hover:border-brand-300 dark:hover:border-signal-green/50'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon or Avatar */}
                    <div className="flex-shrink-0">
                      {notification.actor_avatar ? (
                        <img
                          src={notification.actor_avatar}
                          alt={notification.actor_nickname || ''}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : notification.actor_nickname ? (
                        <div className="h-10 w-10 rounded-full bg-slate-700 dark:bg-tactical-raised flex items-center justify-center border border-slate-200 dark:border-tactical-border">
                          <span className="text-sm font-bold font-mono text-white dark:text-tactical-text">
                            {notification.actor_nickname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-tactical-raised flex items-center justify-center border border-slate-200 dark:border-tactical-border">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-mono uppercase tracking-wider font-medium ${
                          notification.is_read
                            ? 'text-slate-900 dark:text-tactical-text'
                            : 'text-slate-900 dark:text-signal-green'
                        }`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {!notification.is_read && (
                            <span className="h-2 w-2 rounded-full bg-signal-red flex-shrink-0" aria-hidden />
                          )}
                          <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-tactical-label whitespace-nowrap">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className={`mt-1 text-sm line-clamp-2 ${
                        notification.is_read
                          ? 'text-slate-600 dark:text-tactical-dim'
                          : 'text-slate-700 dark:text-tactical-dim'
                      }`}>
                        {notification.message}
                      </p>
                      
                      {/* Action hint */}
                      {getNotificationLink(notification) && (
                        <p className="mt-2 text-xs text-brand-600 dark:text-signal-cyan font-mono uppercase tracking-wider">
                          Clique para ver →
                        </p>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      className="flex-shrink-0 p-2 dark:rounded-none text-slate-400 dark:text-tactical-dim hover:text-signal-red hover:bg-signal-red/10 opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir notificação"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Total count */}
          {total > notifications.length && (
            <p className="text-center text-sm font-mono tabular-nums text-slate-500 dark:text-tactical-dim mt-6">
              Mostrando {notifications.length} de {total} notificações
            </p>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <MessageModal
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
            onDelete={(id) => handleDeleteNotification({ stopPropagation: () => {} } as any, id)}
            onNavigate={handleNavigate}
        />
      )}
    </>
  );
}

