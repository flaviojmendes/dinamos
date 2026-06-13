import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SystemEditorV2 from '../components/SystemEditor/SystemEditorV2';
import type { DesignV2 } from '../components/SystemEditor/ui/persistence';
import { apiClient } from '../app/utils/api';

export default function SimpleSystemEditorPage() {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  const [initialDesign, setInitialDesign] = useState<DesignV2 | null>(null);
  const [loaded, setLoaded] = useState(false);

  // When linked with ?design=:id, recover that saved architecture into the
  // editor. Owners load their private designs (token attached automatically);
  // anyone can load unlisted/public ones.
  useEffect(() => {
    if (!designId) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    apiClient
      .get(`/api/architectures/${designId}`)
      .then((res) => {
        if (!cancelled) setInitialDesign(res.data?.design ?? null);
      })
      .catch(() => {
        /* not found / no access: fall back to a blank editor */
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [designId]);

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg">
      {/* Wait for the design before mounting so it hydrates exactly once. */}
      {loaded && (
        <SystemEditorV2 key={designId ?? 'blank'} initialDesign={initialDesign} />
      )}
    </div>
  );
}
