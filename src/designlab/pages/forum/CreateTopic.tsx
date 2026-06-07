import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { apiClient } from '../../utils/api';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../contexts/ThemeContext';
import { trackForumTopicCreate } from '../../utils/analytics';
import { ForumCategory } from '../../types';
import { TacticalButton } from '../../components/tactical';

const inputClass =
  'mt-1 block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green dark:rounded-none sm:text-sm py-2 px-3';
const labelClass = 'block text-xs font-sans text-slate-700 dark:text-tactical-dim';

interface PollDraft {
  question: string;
  options: string[];
  allowMultiple: boolean;
  hasEndDate: boolean;
  endsAt: string;
}

const CreateTopic = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  
  // Poll state
  const [showPoll, setShowPoll] = useState(false);
  const [poll, setPoll] = useState<PollDraft>({
    question: '',
    options: ['', ''],
    allowMultiple: false,
    hasEndDate: false,
    endsAt: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/forum/categories');
      const cats = response.data.categories;
      setCategories(cats);
      if (cats.length > 0 && !category) {
        setCategory(cats[0].name);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      const defaultCats = [
        { id: 1, name: 'Dúvida', color: '#FCD34D', order: 0 },
        { id: 2, name: 'Brainstorm', color: '#34D399', order: 1 },
        { id: 3, name: 'Ajuda', color: '#F87171', order: 2 }
      ];
      setCategories(defaultCats);
      setCategory(defaultCats[0].name);
    }
  };

  const addPollOption = () => {
    if (poll.options.length < 10) {
      setPoll({ ...poll, options: [...poll.options, ''] });
    }
  };

  const removePollOption = (index: number) => {
    if (poll.options.length > 2) {
      const newOptions = poll.options.filter((_, i) => i !== index);
      setPoll({ ...poll, options: newOptions });
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...poll.options];
    newOptions[index] = value;
    setPoll({ ...poll, options: newOptions });
  };

  const isPollValid = () => {
    if (!showPoll) return true;
    if (!poll.question.trim()) return false;
    const filledOptions = poll.options.filter(opt => opt.trim());
    return filledOptions.length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (!isPollValid()) {
      alert('A enquete precisa de uma pergunta e pelo menos 2 opções');
      return;
    }

    setLoading(true);
    try {
      // Create topic first
      const topicResponse = await apiClient.post('/api/forum/topics', {
        title,
        content,
        category
      });
      
      const topicId = topicResponse.data.id;
      
      // Create poll if enabled
      if (showPoll && poll.question.trim()) {
        const filteredOptions = poll.options.filter(opt => opt.trim());
        try {
          await apiClient.post(`/api/forum/topics/${topicId}/poll`, {
            question: poll.question,
            options: filteredOptions,
            allow_multiple: poll.allowMultiple,
            ends_at: poll.hasEndDate && poll.endsAt ? new Date(poll.endsAt).toISOString() : null
          });
        } catch (pollError) {
          console.error('Error creating poll:', pollError);
          // Topic was created, just notify about poll failure
          alert('Tópico criado, mas houve um erro ao criar a enquete');
        }
      }
      
      trackForumTopicCreate(category);
      navigate('/forum');
    } catch (error) {
      console.error('Error creating topic:', error);
      alert('Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold font-sans text-slate-900 dark:text-tactical-text mb-8 flex items-center gap-3 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber">
            Criar novo tópico
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 tactical-panel p-6 dark:rounded-none">
            <div>
              <label htmlFor="title" className={labelClass}>
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Resumo do tópico"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div data-color-mode={theme}>
              <label htmlFor="content" className={`${labelClass} mb-2`}>
                Conteúdo
              </label>
              <div className="overflow-hidden border border-slate-300 dark:border-tactical-border dark:rounded-none">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={400}
                  preview="edit"
                />
              </div>
            </div>

            {/* Poll Section */}
            <div className="border-t border-slate-200 dark:border-tactical-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setShowPoll(!showPoll)}
                  className="flex items-center gap-2 text-sm font-sans text-brand-600 dark:text-signal-cyan hover:opacity-80"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {showPoll ? 'Remover enquete' : 'Adicionar enquete'}
                </button>
              </div>

              {showPoll && (
                <div className="rounded-lg border border-signal-cyan/30 bg-signal-cyan/5 dark:bg-tactical-raised p-5 space-y-4 dark:rounded-none">
                  <div>
                    <label className={`${labelClass} mb-1`}>
                      Pergunta da Enquete
                    </label>
                    <input
                      type="text"
                      value={poll.question}
                      onChange={(e) => setPoll({ ...poll, question: e.target.value })}
                      placeholder="O que você quer perguntar?"
                      className={inputClass + ' mt-0'}
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className={`${labelClass} mb-2`}>
                      Opções (2-10)
                    </label>
                    <div className="space-y-2">
                      {poll.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 dark:text-tactical-label w-6 font-mono tabular-nums">{index + 1}.</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            placeholder={`Opção ${index + 1}`}
                            className={inputClass + ' mt-0 flex-1'}
                            maxLength={255}
                          />
                          {poll.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(index)}
                              className="p-2 text-slate-400 dark:text-tactical-label hover:text-signal-red transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {poll.options.length < 10 && (
                      <button
                        type="button"
                        onClick={addPollOption}
                        className="mt-2 text-sm font-sans text-brand-600 dark:text-signal-cyan hover:opacity-80 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar opção
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={poll.allowMultiple}
                        onChange={(e) => setPoll({ ...poll, allowMultiple: e.target.checked })}
                        className="w-4 h-4 text-brand-600 border-slate-300 dark:border-tactical-border rounded focus:ring-brand-500 dark:focus:ring-signal-green"
                      />
                      <span className="text-sm text-slate-700 dark:text-tactical-dim">
                        Permitir múltipla escolha
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={poll.hasEndDate}
                        onChange={(e) => setPoll({ ...poll, hasEndDate: e.target.checked })}
                        className="w-4 h-4 text-brand-600 border-slate-300 dark:border-tactical-border rounded focus:ring-brand-500 dark:focus:ring-signal-green"
                      />
                      <span className="text-sm text-slate-700 dark:text-tactical-dim">
                        Data de encerramento
                      </span>
                    </label>
                  </div>

                  {poll.hasEndDate && (
                    <div>
                      <label className={`${labelClass} mb-1`}>
                        Encerra em
                      </label>
                      <input
                        type="datetime-local"
                        value={poll.endsAt}
                        onChange={(e) => setPoll({ ...poll, endsAt: e.target.value })}
                        min={new Date().toISOString().slice(0, 16)}
                        className={inputClass + ' mt-0'}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-tactical-border">
              <TacticalButton type="button" variant="secondary" onClick={() => navigate('/forum')}>
                Cancelar
              </TacticalButton>
              <TacticalButton
                type="submit"
                variant="primary"
                disabled={loading}
                className={loading ? 'opacity-75 cursor-wait' : ''}
              >
                {loading ? 'Publicando...' : 'Publicar tópico'}
              </TacticalButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTopic;

