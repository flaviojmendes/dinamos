import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { apiClient } from '../../utils/api';
import { formatDate } from '../../utils/dateUtils';
import Navbar from '../../components/Navbar';
import VoteButton from '../../components/VoteButton';
import UserBadge from '../../components/UserBadge';
import ExcalidrawViewer from '../../components/ExcalidrawViewer';
import MermaidDiagram from '../../components/MermaidDiagram';
import Poll from '../../components/Poll';
import { ForumTopic, ForumMessage, ForumCategory, Poll as PollType } from '../../types';
import ReactMarkdown from 'react-markdown';
import { Excalidraw } from "@excalidraw/excalidraw";
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { trackForumTopicView, trackForumReply } from '../../utils/analytics';
import { TacticalButton } from '../../components/tactical';

const inputClass =
  'w-full px-3 py-2 rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:ring-brand-500 dark:focus:ring-signal-green';
const labelClass = 'block text-xs font-sans text-slate-700 dark:text-tactical-dim mb-1';
const sectionTitleClass =
  'text-lg font-sans font-medium text-slate-900 dark:text-tactical-text flex items-center gap-2 before:content-[\'\'] before:h-5 before:w-1 before:bg-signal-amber';

// Markdown components defined outside to prevent recreation
const MarkdownComponents: any = {
  code({node, inline, className, children, ...props}: any) {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : '';
    
    // Handle Mermaid diagrams
    if (!inline && language === 'mermaid') {
      return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
    }
    
    // Handle other code blocks with syntax highlighting
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        style={dracula}
        language={language}
        PreTag="div"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
};

// Message component with its own local state for reply form
interface MessageComponentProps {
  message: ForumMessage;
  onReplySubmit: (parentId: number, content: string, diagramData: any) => Promise<void>;
  onEdit: (messageId: number, content: string, diagramData: any) => Promise<void>;
  onDelete: (messageId: number) => void;
  canDeleteFn: (userId: string) => boolean;
  canEditFn: (userId: string) => boolean;
  theme: string;
}

const MessageComponent = memo(({ 
  message, 
  onReplySubmit, 
  onEdit,
  onDelete, 
  canDeleteFn,
  canEditFn,
  theme,
}: MessageComponentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showDiagram, setShowDiagram] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [sending, setSending] = useState(false);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editShowDiagram, setEditShowDiagram] = useState(false);
  const [editExcalidrawAPI, setEditExcalidrawAPI] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const depth = message.depth || 0;
  const canReply = depth < 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!replyContent.trim() && !showDiagram) return;

    setSending(true);
    try {
      let diagramData = null;
      if (showDiagram && excalidrawAPI) {
        const elements = excalidrawAPI.getSceneElements();
        if (elements && elements.length > 0) {
          diagramData = {
            elements: elements,
            appState: { viewBackgroundColor: "#ffffff" }
          };
        }
      }

      await onReplySubmit(message.id, replyContent, diagramData);
      
      // Clear form on success
      setReplyContent('');
      setIsReplying(false);
      setShowDiagram(false);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    setIsReplying(false);
    setReplyContent('');
    setShowDiagram(false);
  };
  
  // Edit handlers
  const handleStartEdit = () => {
    setEditContent(message.content);
    setEditShowDiagram(!!message.diagram_data);
    setIsEditing(true);
    setIsReplying(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
    setEditShowDiagram(false);
  };
  
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editContent.trim()) return;

    setSaving(true);
    try {
      let diagramData = null;
      if (editShowDiagram && editExcalidrawAPI) {
        const elements = editExcalidrawAPI.getSceneElements();
        if (elements && elements.length > 0) {
          diagramData = {
            elements: elements,
            appState: { viewBackgroundColor: "#ffffff" }
          };
        }
      } else if (editShowDiagram && message.diagram_data) {
        // Keep existing diagram if not modified
        diagramData = message.diagram_data;
      }

      await onEdit(message.id, editContent, diagramData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving edit:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4 border-l-2 border-slate-200 dark:border-tactical-border pl-4' : ''}`}>
      <div className="tactical-panel p-6">
        <div className="flex items-center mb-4">
          {message.author?.avatar_image ? (
            <img src={message.author.avatar_image} alt="" className="h-8 w-8 rounded-full object-cover mr-2" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-tactical-raised flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-slate-500 dark:text-tactical-dim">
                {(message.author?.nickname || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-sm flex-1">
            <div className="flex items-center">
              <span className="font-medium text-slate-900 dark:text-tactical-text mr-2">
                {message.author?.nickname || 'Desconhecido'}
              </span>
              {message.author?.role && <UserBadge role={message.author.role} color={message.author.role_color} />}
            </div>
            <span className="text-slate-500 dark:text-tactical-dim">
              respondeu {formatDate(message.created_at)}
              {message.updated_at && message.updated_at !== message.created_at && (
                <span className="ml-1 text-slate-400 dark:text-tactical-label italic">(editado)</span>
              )}
            </span>
          </div>
        </div>

        {/* Show edit form or message content */}
        {isEditing ? (
          <div className="mb-4">
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4" data-color-mode={theme}>
                <MDEditor
                  value={editContent}
                  onChange={(value) => setEditContent(value || '')}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  height={200}
                />
              </div>
              <div className="flex items-center justify-between">
                <TacticalButton type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                  Cancelar
                </TacticalButton>
                <div className="flex items-center gap-2">
                  <TacticalButton type="button" variant="ghost" size="sm" onClick={() => setEditShowDiagram(!editShowDiagram)}>
                    {editShowDiagram ? 'Remover' : 'Adicionar'} Diagrama
                  </TacticalButton>
                  <TacticalButton
                    type="submit"
                    variant="primary"
                    disabled={saving || !editContent.trim()}
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </TacticalButton>
                </div>
              </div>
              {editShowDiagram && (
                <div className="mt-4 border border-slate-200 dark:border-tactical-border overflow-hidden h-[400px]">
                  <Excalidraw
                    excalidrawAPI={(api: any) => setEditExcalidrawAPI(api)}
                    initialData={message.diagram_data ? {
                      elements: message.diagram_data.elements as any,
                      appState: { viewBackgroundColor: "#ffffff" }
                    } : undefined}
                  />
                </div>
              )}
            </form>
          </div>
        ) : (
          <>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-4">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Render Excalidraw Diagram if present */}
            {message.diagram_data && (
              <div className="mt-4">
                <ExcalidrawViewer 
                  diagramData={message.diagram_data}
                  height="400px"
                />
              </div>
            )}
          </>
        )}
        
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-tactical-border flex justify-between items-center">
          <div className="flex items-center gap-4">
            <VoteButton 
              id={message.id} 
              type="message" 
              initialUpvotes={message.upvotes} 
              initialHasVoted={message.has_voted} 
            />
            {canReply && !isEditing && (
              <button
                type="button"
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm font-sans text-brand-600 dark:text-signal-green hover:opacity-80"
              >
                Responder
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {canEditFn(message.user_id) && !isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-slate-400 dark:text-tactical-label hover:text-brand-600 dark:hover:text-signal-cyan transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-tactical-raised"
                title="Editar comentário"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {canDeleteFn(message.user_id) && !isEditing && (
              <button
                type="button"
                onClick={() => onDelete(message.id)}
                className="text-slate-400 dark:text-tactical-label hover:text-signal-red transition-colors p-1 rounded-full hover:bg-signal-red/10"
                title="Excluir comentário"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Reply form for this message - uses local state */}
        {isReplying && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-tactical-border">
            <form onSubmit={handleSubmit}>
              <div className="mb-4" data-color-mode={theme}>
                <MDEditor
                  value={replyContent}
                  onChange={(value) => setReplyContent(value || '')}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  height={200}
                />
              </div>
              <div className="flex items-center justify-between">
                <TacticalButton type="button" variant="ghost" size="sm" onClick={handleCancel}>
                  Cancelar
                </TacticalButton>
                <div className="flex items-center gap-2">
                  <TacticalButton type="button" variant="ghost" size="sm" onClick={() => setShowDiagram(!showDiagram)}>
                    {showDiagram ? 'Ocultar' : 'Adicionar'} Diagrama
                  </TacticalButton>
                  <TacticalButton
                    type="submit"
                    variant="primary"
                    disabled={sending || (!replyContent.trim() && !showDiagram)}
                  >
                    {sending ? 'Enviando...' : 'Responder'}
                  </TacticalButton>
                </div>
              </div>
              {showDiagram && (
                <div className="mt-4 border border-slate-200 dark:border-tactical-border overflow-hidden h-[400px]">
                  <Excalidraw
                    excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                  />
                </div>
              )}
            </form>
          </div>
        )}

        {/* Render nested replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {message.replies.map((reply) => (
              <MessageComponent
                key={reply.id}
                message={reply}
                onReplySubmit={onReplySubmit}
                onEdit={onEdit}
                onDelete={onDelete}
                canDeleteFn={canDeleteFn}
                canEditFn={canEditFn}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const TopicView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appUser } = useAuth();
  const { theme } = useTheme();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [showExcalidraw, setShowExcalidraw] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string>('top');
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [changingCategory, setChangingCategory] = useState(false);
  const [poll, setPoll] = useState<PollType | null>(null);
  
  // Topic editing state
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicContent, setEditTopicContent] = useState('');
  const [savingTopic, setSavingTopic] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTopic();
      fetchPoll();
    }
    fetchCategories();
  }, [id, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/forum/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPoll = async () => {
    try {
      const response = await apiClient.get(`/api/forum/topics/${id}/poll`);
      setPoll(response.data);
    } catch (error) {
      console.error('Error fetching poll:', error);
      setPoll(null);
    }
  };

  const organizeMessages = (messages: ForumMessage[]): ForumMessage[] => {
    // Create a map of messages by ID
    const messageMap = new Map<number, ForumMessage>();
    messages.forEach(msg => {
      messageMap.set(msg.id, { ...msg, replies: [], depth: 0 });
    });

    // Build tree structure
    const rootMessages: ForumMessage[] = [];
    messages.forEach(msg => {
      const message = messageMap.get(msg.id)!;
      if (msg.parent_id && messageMap.has(msg.parent_id)) {
        const parent = messageMap.get(msg.parent_id)!;
        if (!parent.replies) parent.replies = [];
        // Calculate depth
        message.depth = (parent.depth || 0) + 1;
        // Only add if depth <= 2
        if (message.depth <= 2) {
          parent.replies.push(message);
        }
      } else {
        rootMessages.push(message);
      }
    });

    // Sort root messages and nested replies
    const sortMessages = (msgs: ForumMessage[]) => {
      msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      msgs.forEach(msg => {
        if (msg.replies && msg.replies.length > 0) {
          sortMessages(msg.replies);
        }
      });
    };
    sortMessages(rootMessages);
    return rootMessages;
  };

  const fetchTopic = async () => {
    try {
      const response = await apiClient.get(`/api/forum/topics/${id}?sort_messages=${sortBy}`);
      const topicData = response.data.topic;
      const messagesData = response.data.messages;
      
      // Fetch votes
      const messageIds = messagesData.map((m: ForumMessage) => m.id).join(',');
      let votedTopicIds: number[] = [];
      let votedMessageIds: number[] = [];
      
      try {
        const votesResponse = await apiClient.get(`/api/forum/user/votes?topic_ids=${topicData.id}&message_ids=${messageIds}`);
        votedTopicIds = votesResponse.data.topics;
        votedMessageIds = votesResponse.data.messages;
      } catch (e) {
        console.error("Error fetching votes", e);
      }
      
      setTopic({
        ...topicData,
        has_voted: votedTopicIds.includes(topicData.id)
      });
      
      const messagesWithVotes = messagesData.map((m: ForumMessage) => ({
        ...m,
        has_voted: votedMessageIds.includes(m.id)
      }));
      
      // Organize messages into nested structure
      const organizedMessages = organizeMessages(messagesWithVotes);
      setMessages(organizedMessages);
      
      // Track forum topic view
      trackForumTopicView(topicData.id, topicData.title);
      
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    if (!appUser) return false;
    return appUser.role === 'Admin' || (appUser.permissions && appUser.permissions.includes('delete_any_topic'));
  };

  const canDelete = (userId: string) => {
    if (!appUser) return false;
    
    // New permission check
    if (appUser.permissions && appUser.permissions.includes('delete_any_topic')) {
        return true;
    }
    
    // Legacy/Fallback check
    return appUser.id === userId || ['Admin', 'Tutor'].includes(appUser.role);
  };

  const canEdit = (userId: string) => {
    if (!appUser) return false;
    // Only the owner can edit their own message
    return appUser.id === userId;
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    if (!topic || !id) return;
    if (newCategory === topic.category) return;

    setChangingCategory(true);
    try {
      await apiClient.put(`/api/admin/forum/topics/${id}/category`, {
        category: newCategory
      });
      setTopic({ ...topic, category: newCategory });
    } catch (error: any) {
      console.error('Error updating category:', error);
      alert(error.response?.data?.detail || 'Erro ao atualizar categoria');
      // Reset select to original value on error
      e.target.value = topic.category;
    } finally {
      setChangingCategory(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (!topic) return;
    if (window.confirm('Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.')) {
      try {
        await apiClient.delete(`/api/forum/topics/${topic.id}`);
        navigate('/forum');
      } catch (error) {
        console.error('Error deleting topic:', error);
        alert('Erro ao excluir tópico.');
      }
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      try {
        await apiClient.delete(`/api/forum/messages/${messageId}`);
        setMessages(messages.filter(m => m.id !== messageId));
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Erro ao excluir comentário.');
      }
    }
  };

  // Handler for main reply form (no parent)
  const handleMainReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() && !showExcalidraw) return;

    setSending(true);
    try {
      let diagramData = null;
      if (showExcalidraw && excalidrawAPI) {
        const elements = excalidrawAPI.getSceneElements();
        if (elements && elements.length > 0) {
          diagramData = {
            elements: elements,
            appState: { viewBackgroundColor: "#ffffff" }
          };
        }
      }

      await apiClient.post(`/api/forum/topics/${id}/messages`, {
        content: replyContent,
        diagram: diagramData,
        parent_id: null
      });
      
      // Track forum reply
      trackForumReply(id || '');
      
      // Refresh messages to get updated structure
      await fetchTopic();
      
      // Clear form
      setReplyContent('');
      setShowExcalidraw(false);
    } catch (error: any) {
      console.error('Error sending reply:', error);
      alert(error.response?.data?.detail || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  // Handler for nested replies (with parent)
  const handleNestedReply = useCallback(async (parentId: number, content: string, diagramData: any) => {
    await apiClient.post(`/api/forum/topics/${id}/messages`, {
      content: content,
      diagram: diagramData,
      parent_id: parentId
    });
    
    // Track forum reply
    trackForumReply(id || '');
    
    // Refresh messages to get updated structure
    await fetchTopic();
  }, [id]);

  // Handler for editing messages
  const handleEditMessage = useCallback(async (messageId: number, content: string, diagramData: any) => {
    await apiClient.put(`/api/forum/messages/${messageId}`, {
      content: content,
      diagram: diagramData
    });
    
    // Refresh messages to get updated content
    await fetchTopic();
  }, []);

  // Topic editing handlers
  const handleStartEditTopic = () => {
    if (!topic) return;
    setEditTopicTitle(topic.title);
    setEditTopicContent(topic.content);
    setIsEditingTopic(true);
  };

  const handleCancelEditTopic = () => {
    setIsEditingTopic(false);
    setEditTopicTitle('');
    setEditTopicContent('');
  };

  const handleSaveEditTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !editTopicTitle.trim() || !editTopicContent.trim()) return;

    setSavingTopic(true);
    try {
      await apiClient.put(`/api/forum/topics/${topic.id}`, {
        title: editTopicTitle,
        content: editTopicContent
      });
      
      // Refresh topic to get updated content
      await fetchTopic();
      setIsEditingTopic(false);
    } catch (error: any) {
      console.error('Error saving topic:', error);
      alert(error.response?.data?.detail || 'Erro ao salvar tópico');
    } finally {
      setSavingTopic(false);
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    if (category && category.color) {
      // Use dynamic color from category
      return {
        backgroundColor: `${category.color}20`,
        color: category.color,
        borderColor: `${category.color}40`
      };
    }
    // Fallback to default colors
    switch (categoryName) {
      case 'Dúvida': return { className: 'rounded-full border border-signal-amber/40 text-signal-amber bg-signal-amber/10 font-sans text-xs' };
      case 'Brainstorm': return { className: 'rounded-full border border-signal-green/40 text-signal-green bg-signal-green/10 font-sans text-xs' };
      case 'Ajuda': return { className: 'rounded-full border border-signal-red/40 text-signal-red bg-signal-red/10 font-sans text-xs' };
      default: return { className: 'rounded-full border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 font-sans text-xs' };
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 dark:text-tactical-dim font-sans text-xs">Carregando tópico...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-tactical-text mb-2">Tópico não encontrado</h2>
            <Link to="/forum" className="text-brand-600 dark:text-signal-cyan hover:opacity-80">Voltar para o fórum</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-slate-500 dark:text-tactical-dim font-sans">
            <Link to="/forum" className="text-brand-600 dark:text-signal-cyan hover:opacity-80">Fórum</Link>
            <span className="mx-2">/</span>
            <span>{topic.title}</span>
          </div>

          {/* Original Topic */}
          <div className="tactical-panel overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 dark:border-tactical-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  {!isEditingTopic && (
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-tactical-text">{topic.title}</h1>
                  )}
                  {!isEditingTopic && (
                  <div className="mt-2 flex items-center space-x-4">
                    {isAdmin() ? (
                      <div className="relative inline-flex items-center gap-2">
                        <select
                          value={topic.category}
                          onChange={handleCategoryChange}
                          disabled={changingCategory}
                          className={`inline-flex items-center px-2.5 py-0.5 text-xs border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green transition-all ${
                            changingCategory ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                          } ${
                            getCategoryColor(topic.category).className 
                              ? getCategoryColor(topic.category).className 
                              : ''
                          }`}
                          style={
                            !getCategoryColor(topic.category).className
                              ? {
                                  backgroundColor: getCategoryColor(topic.category).backgroundColor,
                                  color: getCategoryColor(topic.category).color,
                                  border: `1px solid ${getCategoryColor(topic.category).borderColor}`
                                }
                              : undefined
                          }
                          title="Clique para alterar a categoria (Admin)"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        {changingCategory && (
                          <span className="text-xs text-slate-500 dark:text-tactical-dim animate-pulse font-sans">
                            <svg className="inline-block h-3 w-3 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Atualizando...
                          </span>
                        )}
                      </div>
                    ) : (
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs ${
                          getCategoryColor(topic.category).className || ''
                        }`}
                        style={
                          !getCategoryColor(topic.category).className
                            ? {
                                backgroundColor: getCategoryColor(topic.category).backgroundColor,
                                color: getCategoryColor(topic.category).color,
                                border: `1px solid ${getCategoryColor(topic.category).borderColor}`
                              }
                            : undefined
                        }
                      >
                        {topic.category}
                      </span>
                    )}
                    <VoteButton 
                      id={topic.id} 
                      type="topic" 
                      initialUpvotes={topic.upvotes} 
                      initialHasVoted={topic.has_voted} 
                    />
                  </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {canEdit(topic.user_id) && !isEditingTopic && (
                    <button
                      onClick={handleStartEditTopic}
                      className="text-slate-400 dark:text-tactical-label hover:text-brand-600 dark:hover:text-signal-cyan transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-tactical-raised"
                      title="Editar tópico"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  {canDelete(topic.user_id) && !isEditingTopic && (
                    <button
                      onClick={handleDeleteTopic}
                      className="text-slate-400 dark:text-tactical-label hover:text-signal-red transition-colors p-2 rounded-full hover:bg-signal-red/10"
                      title="Excluir tópico"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                {topic.author?.avatar_image ? (
                  <img src={topic.author.avatar_image} alt="" className="h-8 w-8 rounded-full object-cover mr-2" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-tactical-raised flex items-center justify-center mr-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-tactical-dim">
                      {(topic.author?.nickname || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-slate-900 dark:text-tactical-text mr-2">
                      {topic.author?.nickname || 'Desconhecido'}
                    </span>
                    {topic.author?.role && (
                        <UserBadge role={topic.author.role} color={topic.author.role_color} />
                    )}
                  </div>
                  <span className="text-slate-500 dark:text-tactical-dim">
                    publicou em {formatDate(topic.created_at)}
                    {topic.updated_at && topic.updated_at !== topic.created_at && (
                      <span className="ml-1 text-slate-400 dark:text-tactical-label italic">(editado)</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Topic content or edit form */}
              {isEditingTopic ? (
                <form onSubmit={handleSaveEditTopic}>
                  <div className="mb-4">
                    <label className={labelClass}>
                      Título
                    </label>
                    <input
                      type="text"
                      value={editTopicTitle}
                      onChange={(e) => setEditTopicTitle(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="mb-4" data-color-mode={theme}>
                    <label className={labelClass}>
                      Conteúdo
                    </label>
                    <MDEditor
                      value={editTopicContent}
                      onChange={(value) => setEditTopicContent(value || '')}
                      preview="edit"
                      height={300}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <TacticalButton type="button" variant="secondary" onClick={handleCancelEditTopic}>
                      Cancelar
                    </TacticalButton>
                    <TacticalButton
                      type="submit"
                      variant="primary"
                      disabled={savingTopic || !editTopicTitle.trim() || !editTopicContent.trim()}
                    >
                      {savingTopic ? 'Salvando...' : 'Salvar'}
                    </TacticalButton>
                  </div>
                </form>
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                  >
                    {topic.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Poll display */}
              {poll && !isEditingTopic && (
                <div className="mt-6">
                  <Poll 
                    poll={poll}
                    onPollUpdate={(updatedPoll) => setPoll(updatedPoll)}
                    canManage={appUser?.id === topic.user_id || (appUser?.permissions?.includes('delete_any_topic') ?? false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Messages List Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className={sectionTitleClass}>
              {messages.length} {messages.length === 1 ? 'Comentário' : 'Comentários'}
            </h3>
            <div className="flex items-center">
              <label htmlFor="sort-messages" className="mr-2 text-xs font-sans text-slate-500 dark:text-tactical-label">Ordenar:</label>
              <select
                id="sort-messages"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-1 rounded-md text-sm bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:outline-none focus:ring-brand-500 dark:focus:ring-signal-green"
              >
                <option value="top">Mais Votados</option>
                <option value="oldest">Mais Antigos</option>
                <option value="recent">Mais Recentes</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-6 mb-8">
            {messages.map((msg) => (
              <MessageComponent 
                key={msg.id} 
                message={msg} 
                onReplySubmit={handleNestedReply}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                canDeleteFn={canDelete}
                canEditFn={canEdit}
                theme={theme}
              />
            ))}
          </div>

          {/* Reply Form */}
          <div className="tactical-panel p-6">
            <h3 className={`${sectionTitleClass} mb-4`}>Adicionar resposta</h3>
            <form onSubmit={handleMainReply}>
              <div className="mb-4" data-color-mode={theme}>
                <div className="overflow-hidden border border-slate-300 dark:border-tactical-border">
                  <MDEditor
                    value={replyContent}
                    onChange={(val) => setReplyContent(val || '')}
                    height={200}
                    preview="edit"
                  />
                </div>
              </div>

              {/* Excalidraw Toggle */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowExcalidraw(!showExcalidraw)}
                  className="text-sm font-sans text-brand-600 dark:text-signal-cyan hover:opacity-80 flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {showExcalidraw ? 'Remover diagrama' : 'Adicionar diagrama Excalidraw'}
                </button>
              </div>

              {showExcalidraw && (
                <div className="h-[500px] border border-slate-200 dark:border-tactical-border mb-4 overflow-hidden">
                  <Excalidraw
                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                    initialData={{ appState: { viewBackgroundColor: "#ffffff" } }}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <TacticalButton
                  type="submit"
                  variant="primary"
                  disabled={sending}
                  className={sending ? 'opacity-75 cursor-wait' : ''}
                >
                  {sending ? 'Enviando...' : 'Responder'}
                </TacticalButton>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicView;