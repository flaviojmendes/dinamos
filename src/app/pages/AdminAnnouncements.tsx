import { useEffect, useState, Suspense } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../../components/tactical';
import MdxRenderer from '../../components/Common/MdxRenderer';

const inputClass =
  'mt-1 block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2';
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-tactical-dim';

interface Announcement {
  id: number;
  title_en: string | null;
  title_pt: string | null;
  body_en: string | null;
  body_pt: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

type FormData = {
  id?: number;
  title_en: string;
  title_pt: string;
  body_en: string;
  body_pt: string;
  published: boolean;
};

const emptyForm: FormData = {
  title_en: '',
  title_pt: '',
  body_en: '',
  body_pt: '',
  // Default to published: creating an announcement is almost always meant to
  // broadcast it. Uncheck to save a draft instead.
  published: true,
};

export default function AdminAnnouncements() {
  const { appUser } = useAuth();
  const { theme } = useTheme();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [activeLang, setActiveLang] = useState<'en' | 'pt'>('pt');
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/admin/announcements');
      setItems(res.data.announcements);
    } catch (err) {
      console.error('Error fetching announcements:', err);
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

  const startEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      id: a.id,
      title_en: a.title_en ?? '',
      title_pt: a.title_pt ?? '',
      body_en: a.body_en ?? '',
      body_pt: a.body_pt ?? '',
      published: a.published,
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
        title_en: form.title_en || null,
        title_pt: form.title_pt || null,
        body_en: form.body_en ?? '',
        body_pt: form.body_pt ?? '',
        published: form.published,
      };
      if (isCreating) {
        await apiClient.post('/api/admin/announcements', payload);
      } else if (editing) {
        await apiClient.put(`/api/admin/announcements/${editing.id}`, payload);
      }
      await fetchItems();
      cancel();
    } catch (err: any) {
      console.error('Error saving announcement:', err);
      alert(err.response?.data?.detail || 'Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Announcement) => {
    if (!window.confirm('Delete this announcement? This cannot be undone.')) return;
    try {
      await apiClient.delete(`/api/admin/announcements/${a.id}`);
      setItems((cur) => cur.filter((x) => x.id !== a.id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Failed to delete announcement');
    }
  };

  const handleResetAcks = async (a: Announcement) => {
    if (
      !window.confirm(
        'Re-trigger this announcement for everyone? All users will see it again on their next visit.'
      )
    )
      return;
    try {
      const res = await apiClient.post(`/api/admin/announcements/${a.id}/reset-acks`);
      alert(`Done — cleared ${res.data.cleared} acknowledgement(s). It will show again to all users.`);
    } catch (err) {
      console.error('Error resetting acknowledgements:', err);
      alert('Failed to reset acknowledgements');
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

  const bodyField = activeLang === 'en' ? 'body_en' : 'body_pt';
  const titleField = activeLang === 'en' ? 'title_en' : 'title_pt';

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Announcements
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
              Broadcast a modal to users (e.g. new content available). Each user sees the latest
              published announcement once, until they acknowledge it.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <TacticalButton variant="primary" onClick={startCreate}>
              New Announcement
            </TacticalButton>
          </div>
        </div>

        {(isCreating || editing) && (
          <div className="tactical-panel mb-8 p-6">
            <h2 className="font-sans text-lg font-medium text-slate-900 dark:text-tactical-text mb-4">
              {isCreating ? 'Create Announcement' : `Edit Announcement #${editing?.id}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-tactical-dim">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  />
                  Published (visible to users)
                </label>
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
                    placeholder="New content available!"
                    className={inputClass}
                  />
                </div>

                <div className={`mt-4 grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                  <div data-color-mode={theme}>
                    <label className={labelClass}>Markdown ({activeLang})</label>
                    <div className="mt-1 overflow-hidden rounded-md border border-slate-300 dark:border-tactical-border">
                      <MDEditor
                        value={(form[bodyField] as string) ?? ''}
                        onChange={(val) => setForm((f) => ({ ...f, [bodyField]: val ?? '' }))}
                        height={360}
                        preview="edit"
                        textareaProps={{ spellCheck: false }}
                      />
                    </div>
                  </div>
                  {showPreview && (
                    <div>
                      <label className={labelClass}>Preview ({activeLang})</label>
                      <div className="mt-1 h-[22.5rem] overflow-y-auto tactical-panel p-4">
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

        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 dark:border-signal-green border-r-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="tactical-panel p-12 text-center text-sm text-slate-500 dark:text-tactical-dim">
            No announcements yet. Create one to broadcast a modal to your users.
          </div>
        ) : (
          <div className="tactical-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-tactical-surface">
                  <tr>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Title
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Status
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Updated
                    </th>
                    <th className="relative px-6 py-3 border-b border-slate-200 dark:border-tactical-border">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised"
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-tactical-text">
                        <div className="text-sm font-medium">
                          {a.title_pt || a.title_en || `Announcement #${a.id}`}
                        </div>
                        <div className="text-xs font-mono text-slate-500 dark:text-tactical-label">
                          #{a.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-mono rounded-full ${
                            a.published
                              ? 'text-signal-green bg-signal-green/10'
                              : 'text-slate-500 bg-slate-200 dark:bg-tactical-surface'
                          }`}
                        >
                          {a.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-tactical-dim">
                        {a.updated_at ? new Date(a.updated_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TacticalButton
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => handleResetAcks(a)}
                          >
                            Re-trigger
                          </TacticalButton>
                          <TacticalButton
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => startEdit(a)}
                          >
                            Edit
                          </TacticalButton>
                          <TacticalButton
                            variant="danger"
                            size="sm"
                            type="button"
                            onClick={() => handleDelete(a)}
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
