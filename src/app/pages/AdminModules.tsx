import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../../components/tactical';
import { TIER_ORDER, type Tier } from '../../config/contentRegistry';
import { useContent } from '../../contexts/ContentContext';

const inputClass =
  'mt-1 block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2';
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-tactical-dim';

interface ContentModule {
  id: number;
  key: string;
  label: string;
  tier: Tier;
  base: string;
  paths: string[] | null;
  order_index: number;
}

interface FormData {
  id?: number;
  key: string;
  label: string;
  tier: Tier;
  base: string;
  pathsText: string;
  order_index: number;
}

const emptyForm: FormData = {
  key: '',
  label: '',
  tier: 'CORE',
  base: '',
  pathsText: '',
  order_index: 0,
};

export default function AdminModules() {
  const { appUser } = useAuth();
  const { reload } = useContent();
  const [modules, setModules] = useState<ContentModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentModule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/admin/modules');
      setModules(res.data.modules);
    } catch (err) {
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order_index: modules.length });
    setIsCreating(true);
  };

  const startEdit = (m: ContentModule) => {
    setEditing(m);
    setForm({
      id: m.id,
      key: m.key,
      label: m.label,
      tier: m.tier,
      base: m.base,
      pathsText: (m.paths ?? []).join('\n'),
      order_index: m.order_index,
    });
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
      const paths = form.pathsText
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);
      const payload = {
        key: form.key,
        label: form.label,
        tier: form.tier,
        base: form.base,
        paths: paths.length ? paths : null,
        order_index: Number(form.order_index) || 0,
      };
      if (isCreating) {
        await apiClient.post('/api/admin/modules', payload);
      } else if (editing) {
        await apiClient.put(`/api/admin/modules/${editing.id}`, payload);
      }
      await fetchModules();
      reload();
      cancel();
    } catch (err: any) {
      console.error('Error saving module:', err);
      alert(err.response?.data?.detail || 'Failed to save module');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: ContentModule) => {
    if (
      !window.confirm(
        `Delete module "${m.label}" (${m.key})? Pages referencing it will keep their module id but lose grouping.`
      )
    )
      return;
    try {
      await apiClient.delete(`/api/admin/modules/${m.id}`);
      setModules((cur) => cur.filter((x) => x.id !== m.id));
      reload();
    } catch (err) {
      console.error('Error deleting module:', err);
      alert('Failed to delete module');
    }
  };

  const sorted = useMemo(
    () => [...modules].sort((a, b) => a.order_index - b.order_index || a.key.localeCompare(b.key)),
    [modules]
  );

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
              Modules
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
              Learning modules group lessons by tier and drive the sidebar, search, and explore
              filters.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <TacticalButton variant="primary" onClick={startCreate}>
              New Module
            </TacticalButton>
          </div>
        </div>

        {(isCreating || editing) && (
          <div className="tactical-panel mb-8 p-6">
            <h2 className="font-sans text-lg font-medium text-slate-900 dark:text-tactical-text mb-4">
              {isCreating ? 'Create New Module' : `Edit Module — ${editing?.key}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Key</label>
                  <input
                    type="text"
                    value={form.key}
                    onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                    placeholder="components"
                    className={`${inputClass} font-mono`}
                    required
                  />
                  <p className="mt-1 text-xs font-mono text-slate-500 dark:text-tactical-label">
                    Referenced by pages as their module id.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Label</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="System Components"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as Tier }))}
                    className={inputClass}
                  >
                    {TIER_ORDER.map((tr) => (
                      <option key={tr} value={tr}>
                        {tr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Base path</label>
                  <input
                    type="text"
                    value={form.base}
                    onChange={(e) => setForm((f) => ({ ...f, base: e.target.value }))}
                    placeholder="/componentes"
                    className={`${inputClass} font-mono`}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Order</label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, order_index: Number(e.target.value) }))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Explicit lesson paths (optional, one per line)</label>
                  <textarea
                    value={form.pathsText}
                    onChange={(e) => setForm((f) => ({ ...f, pathsText: e.target.value }))}
                    rows={4}
                    placeholder={'/intro\n/system-design-101'}
                    className={`${inputClass} font-mono text-xs`}
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">
                    Leave empty to auto-include every page whose path starts with the base path.
                  </p>
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
        ) : (
          <div className="tactical-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-tactical-surface">
                  <tr>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Label / Key
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Tier
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Base
                    </th>
                    <th className="text-xs font-medium text-slate-500 dark:text-tactical-label px-6 py-3 text-right border-b border-slate-200 dark:border-tactical-border">
                      Order
                    </th>
                    <th className="relative px-6 py-3 border-b border-slate-200 dark:border-tactical-border">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised"
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-tactical-text">
                        <div className="text-sm font-medium">{m.label}</div>
                        <div className="text-xs font-mono text-slate-500 dark:text-tactical-label">
                          {m.key}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-tactical-dim">
                        {m.tier}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-tactical-dim">
                        {m.base}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono tabular-nums text-slate-600 dark:text-tactical-dim">
                        {m.order_index}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TacticalButton
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => startEdit(m)}
                          >
                            Edit
                          </TacticalButton>
                          <TacticalButton
                            variant="danger"
                            size="sm"
                            type="button"
                            onClick={() => handleDelete(m)}
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
