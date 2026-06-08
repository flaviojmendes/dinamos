import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../designlab/utils/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  serializeRange,
  findRange,
  highlightRange,
  clearHighlights,
  HIGHLIGHT_ATTR,
  type TextAnchor,
} from '../../utils/annotationAnchor';
import type { DrawingScene } from './DrawingModal';

const DrawingModal = React.lazy(() => import('./DrawingModal'));

interface Annotation {
  id: number;
  slug: string;
  path: string | null;
  kind: 'text' | 'drawing';
  body: string | null;
  drawing: DrawingScene | null;
  anchor: TextAnchor | null;
  color: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Props {
  slug: string;
  path?: string;
  containerRef: React.RefObject<HTMLElement>;
}

const COLORS: { key: string; label: string; dot: string; accent: string }[] = [
  { key: 'amber', label: 'Amber', dot: 'bg-amber-400', accent: 'border-l-amber-400' },
  { key: 'green', label: 'Green', dot: 'bg-emerald-400', accent: 'border-l-emerald-400' },
  { key: 'cyan', label: 'Cyan', dot: 'bg-cyan-400', accent: 'border-l-cyan-400' },
  { key: 'rose', label: 'Rose', dot: 'bg-rose-400', accent: 'border-l-rose-400' },
];

function accentFor(color: string | null): string {
  return COLORS.find((c) => c.key === color)?.accent ?? 'border-l-slate-300 dark:border-l-tactical-border';
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

interface DrawingModalState {
  editId?: number;
  anchor: TextAnchor | null;
  color: string;
  initial: DrawingScene | null;
}

export default function ContentAnnotations({ slug, path, containerRef }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [toolbar, setToolbar] = useState<{ anchor: TextAnchor; top: number; left: number } | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<TextAnchor | null>(null);
  const [draft, setDraft] = useState('');
  const [draftColor, setDraftColor] = useState('amber');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editColor, setEditColor] = useState('amber');
  const [focusId, setFocusId] = useState<number | null>(null);
  const [drawingModal, setDrawingModal] = useState<DrawingModalState | null>(null);

  const composeRef = useRef<HTMLTextAreaElement>(null);
  const annotationsRef = useRef<Annotation[]>([]);
  annotationsRef.current = annotations;
  const observerRef = useRef<MutationObserver | null>(null);
  const reapplyTimer = useRef<number | null>(null);

  // ---------- load ----------
  useEffect(() => {
    if (!user) {
      setAnnotations([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get<{ annotations: Annotation[] }>('/api/annotations', { params: { slug } })
      .then((res) => {
        if (!cancelled) setAnnotations(res.data?.annotations ?? []);
      })
      .catch((err) => {
        if (!cancelled) console.error('[annotations] load failed:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, user]);

  // ---------- highlight rendering ----------
  const applyHighlights = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    observerRef.current?.disconnect();
    clearHighlights(container);
    for (const ann of annotationsRef.current) {
      if (!ann.anchor) continue;
      try {
        const range = findRange(container, ann.anchor);
        if (range) highlightRange(range, ann.id, ann.color);
      } catch (e) {
        console.error('[annotations] highlight failed:', e);
      }
    }
    if (observerRef.current) {
      observerRef.current.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }, [containerRef]);

  // Re-apply when annotations change.
  useEffect(() => {
    applyHighlights();
  }, [annotations, applyHighlights]);

  // Observe content changes (async MDX compile, language switches) and re-apply.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !user) return;
    const observer = new MutationObserver(() => {
      if (reapplyTimer.current) window.clearTimeout(reapplyTimer.current);
      reapplyTimer.current = window.setTimeout(() => applyHighlights(), 200);
    });
    observerRef.current = observer;
    applyHighlights();
    return () => {
      observer.disconnect();
      observerRef.current = null;
      if (reapplyTimer.current) window.clearTimeout(reapplyTimer.current);
      clearHighlights(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, user]);

  // ---------- selection toolbar ----------
  useEffect(() => {
    if (!user) return;
    const onMouseUp = () => {
      const container = containerRef.current;
      const sel = window.getSelection();
      if (!container || !sel || sel.isCollapsed || sel.rangeCount === 0) {
        setToolbar(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setToolbar(null);
        return;
      }
      const anchor = serializeRange(container, range);
      if (!anchor) {
        setToolbar(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      setToolbar({ anchor, top: rect.top, left: rect.left + rect.width / 2 });
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [containerRef, user]);

  if (!user) return null;

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setToolbar(null);
  };

  // ---------- create ----------
  const startTextNote = (anchor: TextAnchor | null) => {
    setPendingAnchor(anchor);
    setOpen(true);
    clearSelection();
    setTimeout(() => composeRef.current?.focus(), 60);
  };

  const createText = async () => {
    const text = draft.trim();
    if (!text) return;
    setSaving(true);
    try {
      const res = await api.post<Annotation>('/api/annotations', {
        slug,
        path,
        kind: 'text',
        body: text,
        anchor: pendingAnchor,
        color: draftColor,
      });
      setAnnotations((cur) => [...cur, res.data]);
      setDraft('');
      setPendingAnchor(null);
    } catch (err) {
      console.error('[annotations] create failed:', err);
      alert(t('annotations.save_error', { defaultValue: 'Could not save note' }));
    } finally {
      setSaving(false);
    }
  };

  const saveDrawing = async (scene: DrawingScene) => {
    if (!drawingModal) return;
    try {
      if (drawingModal.editId) {
        const res = await api.put<Annotation>(`/api/annotations/${drawingModal.editId}`, {
          drawing: scene,
        });
        setAnnotations((cur) => cur.map((a) => (a.id === drawingModal.editId ? res.data : a)));
      } else {
        const res = await api.post<Annotation>('/api/annotations', {
          slug,
          path,
          kind: 'drawing',
          drawing: scene,
          anchor: drawingModal.anchor,
          color: drawingModal.color,
        });
        setAnnotations((cur) => [...cur, res.data]);
        setOpen(true);
      }
    } catch (err) {
      console.error('[annotations] save drawing failed:', err);
      alert(t('annotations.save_error', { defaultValue: 'Could not save note' }));
    } finally {
      setDrawingModal(null);
    }
  };

  // ---------- edit / delete ----------
  const startEdit = (a: Annotation) => {
    setEditingId(a.id);
    setEditBody(a.body ?? '');
    setEditColor(a.color ?? 'amber');
  };

  const saveEdit = async (id: number) => {
    const text = editBody.trim();
    if (!text) return;
    setSaving(true);
    try {
      const res = await api.put<Annotation>(`/api/annotations/${id}`, { body: text, color: editColor });
      setAnnotations((cur) => cur.map((a) => (a.id === id ? res.data : a)));
      setEditingId(null);
    } catch (err) {
      console.error('[annotations] update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm(t('annotations.delete_confirm', { defaultValue: 'Delete this note?' }))) return;
    try {
      await api.delete(`/api/annotations/${id}`);
      setAnnotations((cur) => cur.filter((a) => a.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      console.error('[annotations] delete failed:', err);
    }
  };

  // ---------- highlight click -> open + focus ----------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mark = target.closest(`[${HIGHLIGHT_ATTR}]`);
      if (!mark) return;
      const id = Number(mark.getAttribute(HIGHLIGHT_ATTR));
      if (!id) return;
      setOpen(true);
      setFocusId(id);
      setTimeout(() => {
        document.getElementById(`annotation-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      setTimeout(() => setFocusId(null), 2000);
    };
    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [containerRef]);

  const renderQuote = (anchor: TextAnchor | null) =>
    anchor ? (
      <p className="mb-1.5 line-clamp-2 border-l-2 border-slate-300 pl-2 text-xs italic text-slate-500 dark:border-tactical-border dark:text-tactical-label">
        “{anchor.quote}”
      </p>
    ) : null;

  return (
    <>
      {/* Selection toolbar */}
      {toolbar && (
        <div
          className="fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-tactical-border dark:bg-tactical-surface"
          style={{ top: toolbar.top - 8, left: toolbar.left }}
        >
          <button
            type="button"
            onClick={() => startTextNote(toolbar.anchor)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-tactical-text dark:hover:bg-tactical-raised"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('annotations.note', { defaultValue: 'Note' })}
          </button>
          <span className="h-4 w-px bg-slate-200 dark:bg-tactical-border" />
          <button
            type="button"
            onClick={() => {
              setDrawingModal({ anchor: toolbar.anchor, color: 'amber', initial: null });
              clearSelection();
            }}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-tactical-text dark:hover:bg-tactical-raised"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {t('annotations.draw', { defaultValue: 'Draw' })}
          </button>
        </div>
      )}

      {/* Launcher (bottom-left to clear the completion/reading buttons on the right) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t('annotations.title', { defaultValue: 'My notes' })}
        aria-label={t('annotations.title', { defaultValue: 'My notes' })}
        aria-expanded={open}
        className="fixed bottom-8 left-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-colors hover:bg-slate-50 dark:border-tactical-border dark:bg-tactical-surface dark:text-tactical-text dark:hover:bg-tactical-raised"
    >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {annotations.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white dark:bg-signal-green dark:text-black">
            {annotations.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl dark:border-tactical-border dark:bg-tactical-bg">
            <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-tactical-border">
              <div>
                <h2 className="font-sans text-base font-bold text-slate-900 dark:text-tactical-text">
                  {t('annotations.title', { defaultValue: 'My notes' })}
                </h2>
                <p className="text-xs text-slate-500 dark:text-tactical-label">
                  {t('annotations.subtitle', { defaultValue: 'Select text to attach a note or drawing.' })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('common.close', { defaultValue: 'Close' })}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-tactical-raised dark:hover:text-tactical-text"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Composer */}
            <div className="border-b border-slate-200 p-4 dark:border-tactical-border">
              {pendingAnchor && (
                <div className="mb-2 flex items-start justify-between gap-2 rounded-md bg-amber-50 p-2 dark:bg-signal-amber/10">
                  <p className="line-clamp-2 text-xs italic text-amber-800 dark:text-signal-amber">“{pendingAnchor.quote}”</p>
                  <button
                    type="button"
                    onClick={() => setPendingAnchor(null)}
                    title={t('annotations.detach', { defaultValue: 'Detach from selection' })}
                    className="shrink-0 text-amber-700 hover:text-amber-900 dark:text-signal-amber"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <textarea
                ref={composeRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') createText();
                }}
                rows={3}
                placeholder={t('annotations.placeholder', { defaultValue: 'Write a note…' })}
                className="block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500 dark:border-tactical-border dark:bg-tactical-surface dark:text-tactical-text dark:placeholder:text-tactical-label dark:focus:border-signal-green"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setDraftColor(c.key)}
                      title={c.label}
                      aria-label={c.label}
                      className={`h-5 w-5 rounded-full border ${c.dot} ${
                        draftColor === c.key
                          ? 'ring-2 ring-offset-1 ring-brand-500 dark:ring-signal-green dark:ring-offset-tactical-bg'
                          : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDrawingModal({ anchor: pendingAnchor, color: draftColor, initial: null })}
                    className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-tactical-border dark:text-tactical-text dark:hover:bg-tactical-raised"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    {t('annotations.draw', { defaultValue: 'Draw' })}
                  </button>
                  <button
                    type="button"
                    onClick={createText}
                    disabled={!draft.trim() || saving}
                    className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 dark:bg-signal-green dark:text-black dark:hover:bg-signal-green/90"
                  >
                    {t('annotations.add', { defaultValue: 'Add note' })}
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-r-transparent dark:border-signal-green" />
                </div>
              ) : annotations.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400 dark:text-tactical-label">
                  {t('annotations.empty', { defaultValue: 'No notes yet. Select text in the page or add one above.' })}
                </p>
              ) : (
                <ul className="space-y-3">
                  {annotations.map((a) => (
                    <li
                      key={a.id}
                      id={`annotation-${a.id}`}
                      className={`rounded-md border border-l-4 border-slate-200 bg-white p-3 transition-shadow dark:border-tactical-border dark:bg-tactical-surface ${accentFor(
                        a.color
                      )} ${focusId === a.id ? 'ring-2 ring-brand-400 dark:ring-signal-green' : ''}`}
                    >
                      {renderQuote(a.anchor)}

                      {a.kind === 'drawing' ? (
                        <div>
                          {a.drawing?.preview ? (
                            <button
                              type="button"
                              onClick={() => setDrawingModal({ editId: a.id, anchor: a.anchor, color: a.color ?? 'amber', initial: a.drawing })}
                              className="block w-full overflow-hidden rounded border border-slate-200 dark:border-tactical-border"
                            >
                              <img src={a.drawing.preview} alt="drawing" className="max-h-48 w-full bg-white object-contain" />
                            </button>
                          ) : (
                            <span className="text-sm text-slate-500 dark:text-tactical-dim">Drawing</span>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 dark:text-tactical-label">
                              {formatDate(a.updated_at || a.created_at)}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setDrawingModal({ editId: a.id, anchor: a.anchor, color: a.color ?? 'amber', initial: a.drawing })}
                                className="text-xs font-medium text-slate-500 hover:text-brand-700 dark:text-tactical-label dark:hover:text-signal-green"
                              >
                                {t('common.edit', { defaultValue: 'Edit' })}
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(a.id)}
                                className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-tactical-label dark:hover:text-rose-400"
                              >
                                {t('common.delete', { defaultValue: 'Delete' })}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : editingId === a.id ? (
                        <div>
                          <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={3}
                            className="block w-full resize-y rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-brand-500 dark:border-tactical-border dark:bg-tactical-raised dark:text-tactical-text dark:focus:border-signal-green"
                          />
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {COLORS.map((c) => (
                                <button
                                  key={c.key}
                                  type="button"
                                  onClick={() => setEditColor(c.key)}
                                  title={c.label}
                                  aria-label={c.label}
                                  className={`h-4 w-4 rounded-full border ${c.dot} ${
                                    editColor === c.key ? 'ring-2 ring-brand-500 dark:ring-signal-green' : 'border-transparent'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-tactical-label dark:hover:text-tactical-text"
                              >
                                {t('common.cancel', { defaultValue: 'Cancel' })}
                              </button>
                              <button
                                type="button"
                                onClick={() => saveEdit(a.id)}
                                disabled={!editBody.trim() || saving}
                                className="rounded bg-brand-600 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50 dark:bg-signal-green dark:text-black"
                              >
                                {t('common.save', { defaultValue: 'Save' })}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="whitespace-pre-wrap break-words text-sm text-slate-800 dark:text-tactical-text">{a.body}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 dark:text-tactical-label">
                              {formatDate(a.updated_at || a.created_at)}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => startEdit(a)}
                                className="text-xs font-medium text-slate-500 hover:text-brand-700 dark:text-tactical-label dark:hover:text-signal-green"
                              >
                                {t('common.edit', { defaultValue: 'Edit' })}
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(a.id)}
                                className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-tactical-label dark:hover:text-rose-400"
                              >
                                {t('common.delete', { defaultValue: 'Delete' })}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}

      {drawingModal && (
        <Suspense fallback={null}>
          <DrawingModal
            initial={drawingModal.initial}
            onClose={() => setDrawingModal(null)}
            onSave={saveDrawing}
          />
        </Suspense>
      )}
    </>
  );
}
