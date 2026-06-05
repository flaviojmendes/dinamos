import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../components/tactical';
import type { ForumCategory } from '../types';

const inputClass =
  'block w-full bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green dark:rounded-none sm:text-sm px-3 py-2';
const labelClass = 'block label-mono text-slate-600 dark:text-tactical-dim mb-1';

const AdminForumCategories = () => {
  const { appUser } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ForumCategory | null>(null);
  const [topicCounts, setTopicCounts] = useState<Record<number, number>>({});
  const [reassignToCategoryId, setReassignToCategoryId] = useState<number | null>(null);
  
  const initialFormData: Partial<ForumCategory> = {
    name: '',
    color: '#6B7280',
    description: '',
    order: 0
  };
  
  const [formData, setFormData] = useState<Partial<ForumCategory>>(initialFormData);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/admin/forum/categories');
      // Sort by order, then by name
      const sorted = response.data.categories.sort((a: ForumCategory, b: ForumCategory) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
      });
      setCategories(sorted);
      
      // Fetch topic counts for each category
      await fetchTopicCounts(sorted);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicCounts = async (cats: ForumCategory[]) => {
    const counts: Record<number, number> = {};
    try {
      await Promise.all(
        cats.map(async (cat) => {
          try {
            const response = await apiClient.get(`/api/admin/forum/categories/${cat.id}/topics-count`);
            counts[cat.id] = response.data.topics_count;
          } catch (err) {
            counts[cat.id] = 0;
          }
        })
      );
      setTopicCounts(counts);
    } catch (err) {
      console.error('Error fetching topic counts:', err);
    }
  };

  const handleEdit = (category: ForumCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      description: category.description || '',
      order: category.order
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData(initialFormData);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData(initialFormData);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validation
    if (!formData.name || formData.name.trim() === '') {
      setError('O nome da categoria é obrigatório');
      return;
    }
    
    if (!formData.color || !/^#[0-9A-F]{6}$/i.test(formData.color)) {
      setError('Cor inválida. Use formato hexadecimal (ex: #6B7280)');
      return;
    }
    
    try {
      const submitData = { ...formData };
      // Remove empty description
      if (!submitData.description || submitData.description.trim() === '') {
        delete submitData.description;
      }

      if (isCreating) {
        await apiClient.post('/api/admin/forum/categories', submitData);
        setSuccess('Categoria criada com sucesso!');
      } else if (editingCategory) {
        await apiClient.put(`/api/admin/forum/categories/${editingCategory.id}`, submitData);
        setSuccess('Categoria atualizada com sucesso!');
      }
      
      setTimeout(() => {
        handleCancel();
        fetchCategories(); // Refresh to get updated order
      }, 1000);
    } catch (err: any) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.detail || 'Erro ao salvar categoria');
    }
  };

  const handleDeleteClick = (category: ForumCategory) => {
    setDeletingCategory(category);
    setReassignToCategoryId(null);
    setError(null);
  };

  const handleDeleteCancel = () => {
    setDeletingCategory(null);
    setReassignToCategoryId(null);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    
    const topicsCount = topicCounts[deletingCategory.id] || 0;
    
    // If there are topics but no reassignment category selected, show error
    if (topicsCount > 0 && !reassignToCategoryId) {
      setError('Por favor, selecione uma categoria para reassinar os tópicos antes de excluir.');
      return;
    }
    
    setError(null);
    try {
      const params: any = {};
      if (reassignToCategoryId) {
        params.reassign_to_category_id = reassignToCategoryId;
      }
      
      await apiClient.delete(`/api/admin/forum/categories/${deletingCategory.id}`, { params });
      setCategories(categories.filter(c => c.id !== deletingCategory.id));
      setSuccess(
        topicsCount > 0 && reassignToCategoryId
          ? `Categoria excluída com sucesso! ${topicsCount} tópico(s) foram reassinados.`
          : 'Categoria excluída com sucesso!'
      );
      setDeletingCategory(null);
      setReassignToCategoryId(null);
      setTimeout(() => setSuccess(null), 3000);
      fetchCategories(); // Refresh to update counts
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.detail || 'Erro ao excluir categoria');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'order' ? parseInt(value) || 0 : value 
    }));
  };

  if (!appUser || appUser.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-tactical-dim">Acesso Negado</p>
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
            <h1 className="text-2xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text flex items-center gap-3 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
              Gerenciar Categorias do Fórum
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
              Crie e edite categorias para organizar os tópicos do fórum.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <TacticalButton variant="primary" onClick={handleCreate}>
              Nova Categoria
            </TacticalButton>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {(isCreating || editingCategory) && (
          <div className="tactical-panel mb-8 p-6 dark:rounded-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono uppercase tracking-wider text-xl font-semibold text-slate-900 dark:text-tactical-text">
                {isCreating ? 'Criar Nova Categoria' : 'Editar Categoria'}
              </h2>
              {editingCategory && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-tactical-label">Preview:</span>
                  <span
                    className="inline-flex items-center px-3 py-1 text-sm font-mono uppercase tracking-wider border dark:rounded-none"
                    style={{
                      backgroundColor: `${formData.color}20`,
                      color: formData.color,
                      border: `1px solid ${formData.color}40`
                    }}
                  >
                    {formData.name || 'Nome da categoria'}
                  </span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Nome da Categoria *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    placeholder="Ex: Dúvida, Brainstorm, Ajuda"
                    maxLength={50}
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">
                    {formData.name?.length || 0}/50 caracteres
                  </p>
                </div>
                
                <div>
                  <label className={labelClass}>
                    Cor da Categoria *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="h-12 w-20 rounded-lg border-2 border-slate-300 dark:border-tactical-border cursor-pointer shadow-sm"
                      title="Selecione uma cor"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="block w-full rounded-md border-slate-300 dark:border-tactical-border shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm px-3 py-2 font-mono"
                        placeholder="#6B7280"
                        required
                        pattern="^#[0-9A-Fa-f]{6}$"
                        title="Formato hexadecimal: #RRGGBB"
                      />
                    </div>
                    <div
                      className="h-12 w-12 rounded-lg border-2 border-slate-300 dark:border-tactical-border shadow-sm"
                      style={{ backgroundColor: formData.color }}
                      title="Preview da cor"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-tactical-label">
                    A cor será usada como badge nos tópicos do fórum
                  </p>
                </div>
                
                <div>
                  <label className={labelClass}>
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className={inputClass}
                    min="0"
                    step="1"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">
                    Categorias são ordenadas por este valor (menor = aparece primeiro)
                  </p>
                </div>
                
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Descrição (Opcional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                    placeholder="Descrição opcional da categoria que aparecerá como dica de ferramenta"
                    maxLength={200}
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">
                    {formData.description?.length || 0}/200 caracteres
                  </p>
                </div>
              </div>
              
              {/* Preview Section */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-tactical-border">
                <p className="text-sm font-medium text-slate-700 dark:text-tactical-text mb-3">Preview:</p>
                <div className="flex flex-wrap gap-3 items-center">
                  <span
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    style={{
                      backgroundColor: `${formData.color}20`,
                      color: formData.color,
                      border: `1px solid ${formData.color}40`
                    }}
                  >
                    {formData.name || 'Nome da categoria'}
                  </span>
                  {formData.description && (
                    <span className="text-sm text-slate-500 dark:text-tactical-label">
                      {formData.description}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <TacticalButton type="button" variant="secondary" onClick={handleCancel}>
                  Cancelar
                </TacticalButton>
                <TacticalButton type="submit" variant="primary">
                  {isCreating ? 'Criar Categoria' : 'Salvar Alterações'}
                </TacticalButton>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
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
                        <th scope="col" className="label-mono px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                          Nome / Cor
                        </th>
                        <th scope="col" className="label-mono px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                          Descrição
                        </th>
                        <th scope="col" className="label-mono px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                          Ordem
                        </th>
                        <th scope="col" className="label-mono px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                          Tópicos
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <p className="text-sm font-medium text-slate-900 dark:text-tactical-text mb-1">
                                Nenhuma categoria encontrada
                              </p>
                              <p className="text-sm text-slate-500 dark:text-tactical-label mb-4">
                                Crie uma nova categoria para começar a organizar os tópicos do fórum
                              </p>
                              <TacticalButton variant="primary" onClick={handleCreate}>
                                Criar Primeira Categoria
                              </TacticalButton>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        categories.map((category) => (
                          <tr key={category.id} className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-5 w-5 rounded-full border-2 border-slate-200 dark:border-tactical-border shadow-sm"
                                  style={{ backgroundColor: category.color }}
                                  title={category.color}
                                />
                                <div>
                                  <div className="text-sm font-medium text-slate-900 dark:text-tactical-text">
                                    {category.name}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-tactical-label font-mono">
                                    {category.color}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-500 dark:text-tactical-label max-w-md">
                                {category.description ? (
                                  <span title={category.description}>
                                    {category.description.length > 60 
                                      ? `${category.description.substring(0, 60)}...` 
                                      : category.description}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 dark:text-gray-600 italic">Sem descrição</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-900 dark:text-tactical-text">
                                  {category.order}
                                </span>
                                {category.order === Math.min(...categories.map(c => c.order)) && (
                                  <span className="text-xs text-gray-400 dark:text-gray-600" title="Aparece primeiro">
                                    ↑
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${
                                  (topicCounts[category.id] || 0) > 0 
                                    ? 'text-slate-900 dark:text-tactical-text' 
                                    : 'text-gray-400 dark:text-gray-600'
                                }`}>
                                  {topicCounts[category.id] || 0}
                                </span>
                                {(topicCounts[category.id] || 0) > 0 && (
                                  <span className="text-xs text-slate-500 dark:text-tactical-label" title="Tópicos usando esta categoria">
                                    tópico(s)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <TacticalButton variant="secondary" size="sm" type="button" onClick={() => handleEdit(category)} title="Editar categoria">
                                  Editar
                                </TacticalButton>
                                <TacticalButton variant="danger" size="sm" type="button" onClick={() => handleDeleteClick(category)} title="Excluir categoria">
                                  Excluir
                                </TacticalButton>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingCategory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50" onClick={handleDeleteCancel}>
            <div className="relative top-20 mx-auto p-5 w-96 tactical-panel dark:rounded-none" onClick={(e) => e.stopPropagation()}>
              <div className="mt-3">
                <h3 className="font-mono uppercase tracking-wider text-lg font-medium text-slate-900 dark:text-tactical-text mb-4">
                  Excluir Categoria
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-slate-600 dark:text-tactical-dim mb-2">
                    Tem certeza que deseja excluir a categoria <strong className="text-slate-900 dark:text-tactical-text">"{deletingCategory.name}"</strong>?
                  </p>
                  
                  {(topicCounts[deletingCategory.id] || 0) > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            Esta categoria possui <strong>{topicCounts[deletingCategory.id]}</strong> tópico(s).
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                            Selecione uma categoria para reassinar esses tópicos antes de excluir:
                          </p>
                          <select
                            value={reassignToCategoryId || ''}
                            onChange={(e) => setReassignToCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                            className={inputClass}
                          >
                            <option value="">-- Selecione uma categoria --</option>
                            {categories
                              .filter(c => c.id !== deletingCategory.id)
                              .map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name} {topicCounts[cat.id] ? `(${topicCounts[cat.id]} tópicos)` : ''}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(topicCounts[deletingCategory.id] || 0) === 0 && (
                    <p className="text-sm text-slate-500 dark:text-tactical-label mt-2">
                      Esta categoria não possui tópicos associados.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <TacticalButton type="button" variant="secondary" onClick={handleDeleteCancel}>
                    Cancelar
                  </TacticalButton>
                  <TacticalButton
                    type="button"
                    variant="danger"
                    onClick={handleDeleteConfirm}
                    disabled={(topicCounts[deletingCategory.id] || 0) > 0 && !reassignToCategoryId}
                  >
                    Excluir
                  </TacticalButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminForumCategories;

