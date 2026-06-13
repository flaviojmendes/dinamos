import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SystemEditorV2 from '../components/SystemEditor/SystemEditorV2';
import type { DesignV2 } from '../components/SystemEditor/ui/persistence';
import { apiClient } from '../app/utils/api';

// Read-only, chromeless editor meant to be iframed on external sites. Loads a
// saved architecture by id; only unlisted/public designs resolve for anonymous
// viewers (private ones 404 from the API).
export default function EmbedEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [design, setDesign] = useState<DesignV2 | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!id) {
      setStatus('error');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    apiClient
      .get(`/api/architectures/${id}`)
      .then((res) => {
        if (cancelled) return;
        if (res.data?.design) {
          setDesign(res.data.design);
          setStatus('ready');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-paper dark:bg-tactical-bg">
        <p className="font-sans text-sm text-tactical-dim">
          {t('editor.save.loading', { defaultValue: 'Loading…' })}
        </p>
      </div>
    );
  }

  if (status === 'error' || !design) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-paper dark:bg-tactical-bg p-6 text-center">
        <p className="font-sans text-sm text-tactical-dim">
          {t('editor.save.embed_not_found', {
            defaultValue: 'This architecture is unavailable. It may be private or no longer exist.',
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg">
      <SystemEditorV2 initialDesign={design} readOnly hideChrome />
    </div>
  );
}
