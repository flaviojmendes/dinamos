import { useState } from 'react';
import { Excalidraw, exportToCanvas } from '@excalidraw/excalidraw';
// Excalidraw 0.18 does not auto-inject its styles; without this import the
// toolbar/icons render unstyled at full size.
import '@excalidraw/excalidraw/index.css';

export interface DrawingScene {
  elements: any[];
  appState?: { viewBackgroundColor?: string; [k: string]: any };
  files?: Record<string, any>;
  preview?: string;
}

interface Props {
  initial?: DrawingScene | null;
  onClose: () => void;
  onSave: (scene: DrawingScene) => void;
}

/**
 * Full-screen Excalidraw editor used to author a drawing annotation. Captures
 * the scene plus a PNG preview (so the notes panel can show a thumbnail without
 * mounting a canvas per note). Lazy-loaded so Excalidraw stays out of the main
 * content bundle.
 */
export default function DrawingModal({ initial, onClose, onSave }: Props) {
  const [api, setApi] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!api) return;
    setSaving(true);
    try {
      const elements = api.getSceneElements();
      const appState = api.getAppState();
      const files = api.getFiles();
      let preview = '';
      try {
        const canvas = await exportToCanvas({
          elements,
          appState: { ...appState, exportBackground: true },
          files,
          maxWidthOrHeight: 480,
        });
        preview = canvas.toDataURL('image/png');
      } catch (e) {
        console.error('[annotations] preview export failed:', e);
      }
      onSave({
        elements,
        appState: { viewBackgroundColor: appState?.viewBackgroundColor ?? '#ffffff' },
        files,
        preview,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/50 p-4 sm:p-8" role="dialog" aria-modal="true">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-tactical-bg">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-tactical-border">
          <h2 className="font-sans text-sm font-bold text-slate-900 dark:text-tactical-text">
            {initial ? 'Edit drawing' : 'New drawing'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-tactical-dim dark:hover:bg-tactical-raised"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-signal-green dark:text-black"
            >
              {saving ? 'Saving…' : 'Save drawing'}
            </button>
          </div>
        </header>
        <div className="relative flex-1">
          <Excalidraw
            excalidrawAPI={(a: any) => setApi(a)}
            initialData={
              initial
                ? {
                    elements: (initial.elements ?? []) as any,
                    appState: {
                      ...initial.appState,
                      viewBackgroundColor: initial.appState?.viewBackgroundColor ?? '#ffffff',
                    },
                    files: initial.files as any,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
