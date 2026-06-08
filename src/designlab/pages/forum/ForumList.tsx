import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { formatDate } from '../../utils/dateUtils';
import Navbar from '../../components/Navbar';
import VoteButton from '../../components/VoteButton';
import UserBadge from '../../components/UserBadge';
import { ForumTopic, ForumCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Tag } from '../../components/tactical';

const categoryTagColor = (name: string): 'amber' | 'green' | 'red' | 'cyan' => {
  switch (name) {
    case 'Dúvida': return 'amber';
    case 'Brainstorm': return 'green';
    case 'Ajuda': return 'red';
    default: return 'cyan';
  }
};

const ForumList = () => {
  const { appUser, isSubscribed } = useAuth();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('top');

  useEffect(() => {
    fetchCategories();
    fetchTopics();
  }, [categoryFilter, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/forum/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { id: 1, name: 'Dúvida', color: '#FCD34D', order: 0 },
        { id: 2, name: 'Brainstorm', color: '#34D399', order: 1 },
        { id: 3, name: 'Ajuda', color: '#F87171', order: 2 }
      ]);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const params: any = { sort: sortBy };
      if (categoryFilter) params.category = categoryFilter;
      
      const response = await apiClient.get('/api/forum/topics', { params });
      
      // Fetch user votes
      const topicsData = response.data.topics;
      if (topicsData.length > 0) {
        const topicIds = topicsData.map((t: ForumTopic) => t.id).join(',');
        
        if (topicIds) {
          const votesResponse = await apiClient.get(`/api/forum/user/votes?topic_ids=${topicIds}`);
          const votedTopicIds = votesResponse.data.topics;
          
          // Merge vote status
          const topicsWithVotes = topicsData.map((t: ForumTopic) => ({
            ...t,
            has_voted: votedTopicIds.includes(t.id)
          }));
          setTopics(topicsWithVotes);
        } else {
          setTopics(topicsData);
        }
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (e: React.MouseEvent, topicId: number) => {
    e.preventDefault(); // Prevent navigation
    if (window.confirm('Tem certeza que deseja excluir este tópico?')) {
      try {
        await apiClient.delete(`/api/forum/topics/${topicId}`);
        setTopics(topics.filter(t => t.id !== topicId));
      } catch (error) {
        console.error('Error deleting topic:', error);
        alert('Erro ao excluir tópico.');
      }
    }
  };

  const canDelete = (topic: ForumTopic) => {
    if (!appUser) return false;
    
    // New permission check
    if (appUser.permissions && appUser.permissions.includes('delete_any_topic')) {
        return true;
    }
    
    // Legacy/Fallback check
    return appUser.id === topic.user_id || ['Admin', 'Tutor'].includes(appUser.role);
  };

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-sans text-slate-900 dark:text-tactical-text flex items-center gap-3 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber">
                Fórum de Discussão
              </h1>
              <p className="mt-1 text-slate-600 dark:text-tactical-dim">Compartilhe dúvidas, ideias e colabore com a comunidade.</p>
            </div>
            
            {isSubscribed && (
            <Link
              to="/forum/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-sans font-medium transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-signal-green"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Novo tópico
            </Link>
            )}
          </div>

          {/* Filters and Sorting */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setCategoryFilter('')}
                className={`px-4 py-2 rounded-lg text-xs font-sans transition-colors whitespace-nowrap border ${
                  categoryFilter === '' 
                    ? 'border-signal-green/40 text-signal-green bg-signal-green/10' 
                    : 'border-slate-200 dark:border-tactical-line bg-white dark:bg-tactical-surface text-slate-600 dark:text-tactical-dim hover:border-signal-green/40'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-sans transition-colors whitespace-nowrap border ${
                    categoryFilter === cat.name
                      ? 'border-signal-green/40 text-signal-green bg-signal-green/10'
                      : 'border-slate-200 dark:border-tactical-line bg-white dark:bg-tactical-surface text-slate-600 dark:text-tactical-dim hover:border-signal-green/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-xs font-sans text-slate-500 dark:text-tactical-label">Ordenar por:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 rounded-md text-sm bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text focus:outline-none focus:ring-brand-500 dark:focus:ring-signal-green"
              >
                <option value="top">Mais Votados</option>
                <option value="recent">Mais Recentes</option>
              </select>
            </div>
          </div>

          {/* Topics List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-600 dark:border-signal-green"></div>
              <p className="mt-2 text-slate-500 dark:text-tactical-dim font-sans text-xs">Carregando tópicos...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12 tactical-panel p-8">
              <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-tactical-label" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-sans font-medium text-slate-900 dark:text-tactical-text">Nenhum tópico encontrado</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-tactical-dim">Comece uma nova discussão clicando no botão acima.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <Link 
                  key={topic.id} 
                  to={`/forum/topic/${topic.id}`}
                  className="block tactical-panel p-6 hover:border-slate-400 dark:hover:border-signal-green/40 transition-colors relative group"
                >
                  {canDelete(topic) && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDeleteTopic(e, topic.id)}
                        className="text-slate-400 dark:text-tactical-label hover:text-signal-red transition-colors p-1 rounded-full hover:bg-signal-red/10"
                        title="Excluir tópico"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color={categoryTagColor(topic.category)}>{topic.category}</Tag>
                        <span className="text-xs text-slate-500 dark:text-tactical-label font-mono tabular-nums">
                          {formatDate(topic.created_at)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-tactical-text mb-2 pr-8">
                        {topic.title}
                      </h3>
                      <p className="text-slate-600 dark:text-tactical-dim line-clamp-2 text-sm">
                        {topic.content.replace(/[#*`]/g, '')}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <VoteButton 
                            id={topic.id} 
                            type="topic" 
                            initialUpvotes={topic.upvotes} 
                            initialHasVoted={topic.has_voted} 
                          />
                          
                          <span className="text-xs text-slate-500 dark:text-tactical-label flex items-center font-sans">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {topic.comment_count ?? 0} {(topic.comment_count ?? 0) === 1 ? 'comentário' : 'comentários'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center">
                      <div className="hidden sm:flex flex-col items-end mr-3">
                        <span className="text-sm font-medium text-slate-900 dark:text-tactical-text">
                          {topic.author?.nickname || 'Desconhecido'}
                        </span>
                        {topic.author?.role && (
                          <div className="mt-1">
                            <UserBadge 
                                role={topic.author.role} 
                                color={topic.author.role_color}
                            />
                          </div>
                        )}
                      </div>
                      {topic.author?.avatar_image ? (
                        <img 
                          src={topic.author.avatar_image} 
                          alt="" 
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-tactical-border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-tactical-raised flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-500 dark:text-tactical-dim">
                            {(topic.author?.nickname || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForumList;
