import { useEffect, useMemo, useState, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../components/tactical';
import MdxRenderer from '../../components/Common/MdxRenderer';
import { useContent } from '../../contexts/ContentContext';
import { SIMULATOR_OPTIONS } from '../../config/simulatorRegistry';

const inputClass =
  'mt-1 block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2';
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-tactical-dim';

interface ContentPage {
  id: number;
  slug: string;
  path: string;
  module_id: string | null;
  order_index: number;
  simulator_key: string | null;
  published: boolean;
  title_en: string | null;
  title_pt: string | null;
  body_en: string | null;
  body_pt: string | null;
}

type FormData = Omit<ContentPage, 'id'> & { id?: number };

const emptyForm: FormData = {
  slug: '',
  path: '',
  module_id: '',
  order_index: 0,
  simulator_key: '',
  published: true,
  title_en: '',
  title_pt: '',
  body_en: '',
  body_pt: '',
};

export default function AdminContent() {
  const { appUser } = useAuth();
  const { modules, reload } = useContent();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [activeLang, setActiveLang] = useState<'en' | 'pt'>('pt');
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/admin/content');
      setPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching content pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setActiveLang('pt');
    setIsCreating(true);
  };

  const startEdit = (page: ContentPage) => {
    setEditing(page);
    setForm({
      ...page,
      module_id: page.module_id ?? '',
      simulator_key: page.simulator_key ?? '',
      title_en: page.title_en ?? '',
      title_pt: page.title_pt ?? '',
      body_en: page.body_en ?? '',
      body_pt: page.body_pt ?? '',
    });
    setActiveLang('pt');
    setIsCreating(false);
  };

  const cancel = () => {
    setEditing(null);
    setIsCreating(false);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        path: form.path,
        module_id: form.module_id || null,
        order_index: Number(form.order_index) || 0,
        simulator_key: form.simulator_key || null,
        published: form.published,
        title_en: form.title_en || null,
        title_pt: form.title_pt || null,
        body_en: form.body_en ?? '',
        body_pt: form.body_pt ?? '',
      };
      if (isCreating) {
        await apiClient.post('/api/admin/content', payload);
      } else if (editing) {
        await apiClient.put(`/api/admin/content/${editing.id}`, payload);
      }
      await fetchPages();
      reload();
      cancel();
    } catch (err: any) {
      console.error('Error saving content page:', err);
      alert(err.response?.data?.detail || 'Failed to save content page');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (page: ContentPage) => {
    if (!window.confirm(`Delete "${page.slug}"? This cannot be undone.`)) return;
    try {
      await apiClient.delete(`/api/admin/content/${page.id}`);
      setPages((cur) => cur.filter((p) => p.id !== page.id));
      reload();
    } catch (err) {
      console.error('Error deleting content page:', err);
      alert('Failed to delete content page');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pages.filter((p) => {
      if (moduleFilter && (p.module_id ?? '') !== moduleFilter) return false;
      if (publishedFilter === 'published' && !p.published) return false;
      if (publishedFilter === 'draft' && p.published) return false;
      if (q) {
        const hay = `${p.slug} ${p.path} ${p.title_en ?? ''} ${p.title_pt ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [pages, search, moduleFilter, publishedFilter]);

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

  const bodyField = activeLang === 'en' ? 'body_en' : 'body_pt';
  const titleField = activeLang === 'en' ? 'title_en' : 'title_pt';

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Content (CMS)
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
              Create and edit lesson pages. Content is authored in MDX and stored in the database.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <TacticalButton variant="primary" onClick={startCreate}>
              New Page
            </TacticalButton>
          </div>
        </div>

        {(isCreating || editing) && (
          <div className="tactical-panel mb-8 p-6">
            <h2 className="font-sans text-lg font-medium text-slate-900 dark:text-tactical-text mb-4">
              {isCreating ? 'Create New Page' : `Edit Page — ${editing?.slug}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="components/cache"
                    className={`${inputClass} font-mono`}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Path (URL)</label>
                  <input
                    type="text"
                    value={form.path}
                    onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
                    placeholder="/componentes/cache"
                    className={`${inputClass} font-mono`}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Module</label>
                  <select
                    value={form.module_id ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, module_id: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">— none —</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Attach Simulator</label>
                  <select
                    value={form.simulator_key ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, simulator_key: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">— none —</option>
                    {SIMULATOR_OPTIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {form.simulator_key && (
                    <p className="mt-1 text-xs font-mono text-slate-500 dark:text-tactical-label">
                      Route: {form.path || '<path>'}/simulator
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Order</label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end gap-6">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-tactical-dim">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    />
                    Published
                  </label>
                </div>
              </div>

              {/* Language tabs */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-tactical-border">
                  <div className="flex gap-1">
                    {(['pt', 'en'] as const).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => setActiveLang(lng)}
                        className={`px-4 py-2 text-sm font-mono uppercase tracking-wider ${
                          activeLang === lng
                            ? 'border-b-2 border-brand-600 dark:border-signal-green text-slate-900 dark:text-tactical-text'
                            : 'text-slate-500 dark:text-tactical-label'
                        }`}
                      >
                        {lng}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-tactical-dim">
                    <input
                      type="checkbox"
                      checked={showPreview}
                      onChange={(e) => setShowPreview(e.target.checked)}
                    />
                    Live preview
                  </label>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Title ({activeLang})</label>
                  <input
                    type="text"
                    value={(form[titleField] as string) ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, [titleField]: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className={`mt-4 grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                  <div>
                    <label className={labelClass}>MDX Source ({activeLang})</label>
                    <textarea
                      value={(form[bodyField] as string) ?? ''}
                      onChange={(e) => setForm((f) => ({ ...f, [bodyField]: e.target.value }))}
                      rows={24}
                      spellCheck={false}
                      className={`${inputClass} font-mono text-xs leading-relaxed`}
                    />
                  </div>
                  {showPreview && (
                    <div>
                      <label className={labelClass}>Preview ({activeLang})</label>
                      <div className="mt-1 h-[34rem] overflow-y-auto tactical-panel p-4">
                        <Suspense fallback={<div className="text-xs text-slate-500">Compiling…</div>}>
                          <MdxRenderer source={(form[bodyField] as string) ?? ''} />
                        </Suspense>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <TacticalButton type="button" variant="secondary" onClick={cancel}>
                  Cancel
                </TacticalButton>
                <TacticalButton type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </TacticalButton>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slug, path, title…"
            className={`${inputClass} max-w-xs !mt-0`}
          />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className={`${inputClass} max-w-xs !mt-0`}
          >
            <option value="">All modules</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value as typeof publishedFilter)}
            className={`${inputClass} max-w-[10rem] !mt-0`}
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <span className="text-xs font-mono text-slate-500 dark:text-tactical-label">
            {filtered.length} / {pages.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 dark:border-signal-green border-r-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="tactical-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-tactical-surface">
                  <tr>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Title / Slug
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Path
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Module
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Flags
                    </th>
                    <th className="relative px-6 py-3 border-b border-slate-200 dark:border-tactical-border">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((page) => (
                    <tr
                      key={page.id}
                      className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised"
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-tactical-text">
                        <div className="text-sm font-medium">
                          {page.title_pt || page.title_en || page.slug}
                        </div>
                        <div className="text-xs font-mono text-slate-500 dark:text-tactical-label">
                          {page.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-tactical-dim">
                        {page.path}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-tactical-dim">
                        {page.module_id || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`inline-flex px-2 py-0.5 text-[10px] font-mono rounded-full ${
                              page.published
                                ? 'text-signal-green bg-signal-green/10'
                                : 'text-slate-500 bg-slate-200 dark:bg-tactical-surface'
                            }`}
                          >
                            {page.published ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                          {page.simulator_key && (
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-mono rounded-full text-signal-cyan bg-signal-cyan/10">
                              SIM
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TacticalButton
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => startEdit(page)}
                          >
                            Edit
                          </TacticalButton>
                          <TacticalButton
                            variant="danger"
                            size="sm"
                            type="button"
                            onClick={() => handleDelete(page)}
                          >
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
        )}
      </main>
    </div>
  );
}
