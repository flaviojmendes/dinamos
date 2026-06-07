import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../components/tactical';
import type { Challenge } from '../types';

const inputClass =
  'mt-1 block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green dark:rounded-none sm:text-sm px-3 py-2';
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-tactical-dim';
import { format } from 'date-fns';

const AdminChallenges = () => {
  const { appUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const initialFormData: Partial<Challenge> = {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    difficulty: 'Fácil',
    category: 'Web Services',
    order: 0,
    evaluation_prompt: '',
    initial_requirements: '',
    video_solution_url: '',
    video_solution_release_date: ''
  };
  
  const [formData, setFormData] = useState<Partial<Challenge>>(initialFormData);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/challenges');
      setChallenges(response.data.challenges);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      ...challenge,
      video_solution_url: challenge.video_solution_url || '',
      video_solution_release_date: challenge.video_solution_release_date || ''
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingChallenge(null);
    setFormData(initialFormData);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingChallenge(null);
    setIsCreating(false);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      // Ensure empty strings are null for optional fields if needed, or just send them
      if (!submitData.video_solution_url) delete submitData.video_solution_url;
      if (!submitData.video_solution_release_date) delete submitData.video_solution_release_date;

      if (isCreating) {
        const response = await apiClient.post('/api/admin/challenges', submitData);
        setChallenges([...challenges, response.data]);
      } else if (editingChallenge) {
        const response = await apiClient.put(`/api/admin/challenges/${editingChallenge.id}`, submitData);
        setChallenges(challenges.map(c => c.id === editingChallenge.id ? response.data : c));
      }
      handleCancel();
    } catch (err: any) {
      console.error('Error saving challenge:', err);
      alert(err.response?.data?.detail || 'Failed to save challenge');
    }
  };

  const handleDelete = async (challengeId: string) => {
    if (!window.confirm('Are you sure? This will delete the challenge and all associated data.')) return;
    
    try {
      await apiClient.delete(`/api/admin/challenges/${challengeId}`);
      setChallenges(challenges.filter(c => c.id !== challengeId));
    } catch (err) {
      console.error('Error deleting challenge:', err);
      alert('Failed to delete challenge');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Gerenciar desafios
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
              Crie e edite desafios de System Design.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <TacticalButton variant="primary" onClick={handleCreate}>
              Novo Desafio
            </TacticalButton>
          </div>
        </div>

        {(isCreating || editingChallenge) && (
          <div className="tactical-panel mb-8 p-6 dark:rounded-none">
            <h2 className="font-sans text-lg font-medium text-slate-900 dark:text-tactical-text mb-4">
              {isCreating ? 'Criar Novo Desafio' : 'Editar Desafio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>ID (Slug)</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    disabled={!isCreating}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Título</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Subtítulo</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Dificuldade</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Categoria</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Ordem</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data de Liberação da Solução (Video)</label>
                  <input
                    type="datetime-local"
                    name="video_solution_release_date"
                    value={formData.video_solution_release_date ? formData.video_solution_release_date.slice(0, 16) : ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>URL da Solução (Video)</label>
                  <input
                    type="text"
                    name="video_solution_url"
                    value={formData.video_solution_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Prompt de Avaliação (AI)</label>
                  <textarea
                    name="evaluation_prompt"
                    value={formData.evaluation_prompt}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Requisitos Iniciais (Markdown)</label>
                  <textarea
                    name="initial_requirements"
                    value={formData.initial_requirements}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <TacticalButton type="button" variant="secondary" onClick={handleCancel}>
                  Cancelar
                </TacticalButton>
                <TacticalButton type="submit" variant="primary">
                  Salvar
                </TacticalButton>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 dark:border-signal-green border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="tactical-panel overflow-hidden dark:rounded-none">
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-tactical-surface">
                      <tr>
                        <th scope="col" className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">ID/Título</th>
                        <th scope="col" className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">Categoria/Diff</th>
                        <th scope="col" className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-right border-b border-slate-200 dark:border-tactical-border">Ordem</th>
                        <th scope="col" className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">Video Release</th>
                        <th scope="col" className="relative px-6 py-3 border-b border-slate-200 dark:border-tactical-border">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {challenges.map((challenge) => (
                        <tr key={challenge.id} className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised">
                          <td className="px-6 py-4 text-slate-800 dark:text-tactical-text">
                            <div className="text-sm font-medium">{challenge.title}</div>
                            <div className="text-xs font-mono text-slate-500 dark:text-tactical-label">{challenge.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-tactical-text">
                            <div className="text-sm">{challenge.category}</div>
                            <span className={`mt-1 inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              challenge.difficulty === 'Fácil' ? 'border-signal-green/40 text-signal-green bg-signal-green/10' :
                              challenge.difficulty === 'Médio' ? 'border-signal-amber/40 text-signal-amber bg-signal-amber/10' :
                              'border-signal-red/40 text-signal-red bg-signal-red/10'
                            } dark:rounded-none`}>
                              {challenge.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono tabular-nums text-right text-slate-600 dark:text-tactical-dim">
                            {challenge.order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-tactical-label">
                            {challenge.video_solution_release_date 
                              ? format(new Date(challenge.video_solution_release_date), 'dd/MM/yyyy HH:mm')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <TacticalButton variant="secondary" size="sm" type="button" onClick={() => handleEdit(challenge)}>
                                Edit
                              </TacticalButton>
                              <TacticalButton variant="danger" size="sm" type="button" onClick={() => handleDelete(challenge.id)}>
                                Delete
                              </TacticalButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminChallenges;

