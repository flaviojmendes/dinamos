import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Panel } from '../../components/tactical';
import api from '../utils/api';
import { publishPublicSettings } from '../../hooks/usePublicSettings';

interface PlatformSettings {
  dioramas_enabled: boolean;
}

function settingsFromResponse(value: unknown): PlatformSettings {
  if (!value || typeof value !== 'object' || !('dioramas_enabled' in value) || typeof value.dioramas_enabled !== 'boolean') {
    throw new Error('Invalid platform settings');
  }
  return { dioramas_enabled: value.dioramas_enabled };
}

const AdminSettings = () => {
  const { appUser } = useAuth();
  const { t } = useTranslation();
  const isAdmin = appUser?.role === 'Admin';
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(isAdmin);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<'load' | 'save' | null>(null);
  const [saved, setSaved] = useState(false);
  const [reload, setReload] = useState(0);
  const requestVersion = useRef(0);
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const descriptionId = `${fieldId}-description`;
  const statusId = `${fieldId}-status`;

  useEffect(() => {
    const version = ++requestVersion.current;
    setSettings(null);
    setSaving(false);
    setError(null);
    setSaved(false);
    if (!isAdmin) { setLoading(false); return; }
    setLoading(true);
    api.get('/api/admin/settings')
      .then(response => {
        const value = settingsFromResponse(response.data);
        if (requestVersion.current === version) setSettings(value);
      })
      .catch(() => {
        if (requestVersion.current === version) setError('load');
      })
      .finally(() => {
        if (requestVersion.current === version) setLoading(false);
      });
    return () => { requestVersion.current++; };
  }, [isAdmin, appUser?.id, reload]);

  const toggleDioramas = async () => {
    if (!isAdmin || settings === null || saving) return;
    const version = requestVersion.current;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const response = await api.put('/api/admin/settings', { dioramas_enabled: !settings.dioramas_enabled });
      const value = settingsFromResponse(response.data);
      if (requestVersion.current !== version) return;
      setSettings(value);
      publishPublicSettings(value);
      setSaved(true);
    } catch {
      if (requestVersion.current === version) setError('save');
    } finally {
      if (requestVersion.current === version) setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-tactical-dim">{t('admin.access_denied')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text mb-8">
            {t('admin.settings.title')}
          </h1>

          <div className="space-y-6">
            <Panel title={t('admin.settings.lesson_experience')} bodyClassName="space-y-4 text-sm text-slate-700 dark:text-tactical-dim">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <p id={labelId} className="font-semibold text-slate-900 dark:text-tactical-text">{t('admin.settings.dioramas_label')}</p>
                  <p id={descriptionId} className="mt-1 max-w-xl leading-relaxed">{t('admin.settings.dioramas_description')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings?.dioramas_enabled === true}
                  aria-labelledby={labelId}
                  aria-describedby={`${descriptionId} ${statusId}`}
                  aria-busy={loading || saving}
                  disabled={loading || saving || settings === null}
                  onClick={toggleDioramas}
                  className="inline-flex min-h-11 min-w-[60px] shrink-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-tactical-bg"
                >
                  <span aria-hidden="true" className={`flex h-7 w-12 items-center rounded-full border p-0.5 transition-colors motion-reduce:transition-none ${settings?.dioramas_enabled ? 'border-brand-600 bg-brand-600 dark:border-brand-400 dark:bg-brand-400' : 'border-slate-300 bg-slate-200 dark:border-tactical-border dark:bg-tactical-raised'}`}>
                    <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${settings?.dioramas_enabled ? 'translate-x-5 dark:bg-slate-950' : 'translate-x-0'}`} />
                  </span>
                </button>
              </div>
              <p id={statusId} role="status" aria-live="polite" className={saved ? 'font-medium text-green-800 dark:text-signal-green' : ''}>
                {loading ? t('admin.settings.loading') : saving ? t('admin.settings.saving') : settings === null ? t('admin.settings.unknown') : saved ? t(settings.dioramas_enabled ? 'admin.settings.saved_enabled' : 'admin.settings.saved_disabled') : t(settings.dioramas_enabled ? 'admin.settings.enabled' : 'admin.settings.disabled')}
              </p>
              {error && <div className="space-y-2">
                <p role="alert" className="text-red-700 dark:text-red-300">{t(error === 'load' ? 'admin.settings.load_error' : 'admin.settings.save_error')}</p>
                {error === 'load' && <button type="button" onClick={() => setReload(value => value + 1)} className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-tactical-border dark:text-tactical-text dark:hover:bg-tactical-raised">{t('admin.settings.retry')}</button>}
              </div>}
              <p className="text-xs leading-relaxed">{t('admin.settings.dioramas_help')}</p>
            </Panel>

            <Panel title={t('admin.settings.free_title')} accent="green" bodyClassName="space-y-2 text-slate-700 dark:text-tactical-dim text-sm">
              <p>{t('admin.settings.free_description')}</p>
              <ul className="space-y-2 mt-4">
                {[
                  'challenges', 'quizzes', 'ai_feedback', 'progress', 'history', 'community',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg aria-hidden="true" className="w-5 h-5 text-green-700 dark:text-signal-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t(`admin.settings.free_features.${feature}`)}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
