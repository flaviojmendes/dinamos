import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SystemEditorV2 from '../components/SystemEditor/SystemEditorV2';
import type { DesignV2 } from '../components/SystemEditor/ui/persistence';
import { apiClient } from '../app/utils/api';

export default function SimpleSystemEditorPage() {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  const [loaded, setLoaded] = useState<{ id: string | null; design: DesignV2 | null; ready: boolean }>({ id: null, design: null, ready: false });

  // When linked with ?design=:id, recover that saved architecture into the
  // editor. Owners load their private designs (token attached automatically);
  // anyone can load unlisted/public ones.
  useEffect(() => {
    if (!designId) {
      setLoaded({ id: null, design: null, ready: true });
      return;
    }
    let cancelled = false;
    setLoaded({ id: designId, design: null, ready: false });
    apiClient
      .get(`/api/architectures/${designId}`)
      .then((res) => {
        if (!cancelled) setLoaded({ id: designId, design: res.data?.design ?? null, ready: true });
      })
      .catch(() => {
        // Never hydrate the previous design under a different URL.
        if (!cancelled) setLoaded({ id: designId, design: null, ready: true });
      });
    return () => {
      cancelled = true;
    };
  }, [designId]);

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg">
      {/* Wait for the design before mounting so it hydrates exactly once. */}
      {loaded.ready && loaded.id === designId && (
        <SystemEditorV2 key={designId ?? 'blank'} initialDesign={loaded.design} />
      )}
    </div>
  );
}
