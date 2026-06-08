import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../components/tactical';
import { apiClient } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';

const UNASSIGNED = '__unassigned__';

interface AdminPage {
  id: number;
  slug: string;
  path: string;
  module_id: string | null;
  order_index: number;
  title_en: string | null;
  title_pt: string | null;
  published: boolean;
}

interface AdminModule {
  id: number;
  key: string;
  label: string;
  tier: string;
  base: string;
  order_index: number;
}

type Items = Record<string, string[]>; // containerId -> ["item:<pageId>", ...]

const containerId = (key: string) => `container:${key}`;
const itemId = (pageId: number) => `item:${pageId}`;
const keyFromContainer = (id: string) => id.replace(/^container:/, '');
const pageIdFromItem = (id: string) => Number(id.replace(/^item:/, ''));
const isContainer = (id: string) => id.startsWith('container:');

function pageTitle(p: AdminPage): string {
  return p.title_en || p.title_pt || p.slug;
}

// ---------------- Sortable page row ----------------

function SortablePage({ page }: { page: AdminPage }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId(page.id),
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-tactical-border dark:bg-tactical-raised"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-slate-400 hover:text-slate-700 active:cursor-grabbing dark:text-tactical-label dark:hover:text-tactical-text"
        aria-label="Drag lesson"
        {...attributes}
        {...listeners}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M7 5a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0zm8-10a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-800 dark:text-tactical-text">
          {pageTitle(page)}
        </div>
        <div className="truncate font-mono text-xs text-slate-400 dark:text-tactical-label">
          {page.path}
        </div>
      </div>
      {!page.published && (
        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500 dark:bg-tactical-surface dark:text-tactical-label">
          draft
        </span>
      )}
    </div>
  );
}

// ---------------- Module container ----------------

function ModuleContainer({
  id,
  label,
  sublabel,
  count,
  draggable,
  children,
}: {
  id: string;
  label: string;
  sublabel?: string;
  count: number;
  draggable: boolean;
  children: React.ReactNode;
}) {
  // useSortable also registers `id` as a droppable target, so empty modules
  // still accept lessons and we can read `isOver` for highlight styling.
  const sortable = useSortable({ id, data: { type: 'container' }, disabled: !draggable });
  const style = {
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={`rounded-xl border bg-slate-50 p-3 transition-colors dark:bg-tactical-surface ${
        sortable.isOver
          ? 'border-brand-400 ring-2 ring-brand-300/50 dark:border-signal-green dark:ring-signal-green/30'
          : 'border-slate-200 dark:border-tactical-border'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {draggable ? (
          <button
            type="button"
            className="cursor-grab touch-none text-slate-400 hover:text-slate-700 active:cursor-grabbing dark:text-tactical-label dark:hover:text-tactical-text"
            aria-label="Drag module"
            {...sortable.attributes}
            {...sortable.listeners}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path d="M7 5a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0zm8-10a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0zm0 5a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-tactical-text">
            {label}
          </div>
          {sublabel && (
            <div className="truncate font-mono text-[11px] text-slate-400 dark:text-tactical-label">
              {sublabel}
            </div>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-tactical-raised dark:text-tactical-dim">
          {count}
        </span>
      </div>
      <div className="space-y-2 min-h-[44px]">{children}</div>
    </div>
  );
}

// ---------------- Page ----------------

export default function AdminContentTree() {
  const { appUser } = useAuth();
  const { reload } = useContent();
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [pagesById, setPagesById] = useState<Record<number, AdminPage>>({});
  const [containers, setContainers] = useState<string[]>([]);
  const [items, setItems] = useState<Items>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const initialSnapshot = useRef<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [modRes, pageRes] = await Promise.all([
        apiClient.get('/api/admin/modules'),
        apiClient.get('/api/admin/content'),
      ]);
      const mods: AdminModule[] = modRes.data.modules;
      const pages: AdminPage[] = pageRes.data.pages;
      mods.sort((a, b) => a.order_index - b.order_index || a.key.localeCompare(b.key));

      const moduleKeys = new Set(mods.map((m) => m.key));
      const byId: Record<number, AdminPage> = {};
      pages.forEach((p) => {
        byId[p.id] = p;
      });

      const nextContainers = [...mods.map((m) => containerId(m.key)), containerId(UNASSIGNED)];
      const nextItems: Items = {};
      nextContainers.forEach((cid) => {
        nextItems[cid] = [];
      });
      const sortedPages = [...pages].sort(
        (a, b) => a.order_index - b.order_index || a.slug.localeCompare(b.slug)
      );
      sortedPages.forEach((p) => {
        const key = p.module_id && moduleKeys.has(p.module_id) ? p.module_id : UNASSIGNED;
        nextItems[containerId(key)].push(itemId(p.id));
      });

      setModules(mods);
      setPagesById(byId);
      setContainers(nextContainers);
      setItems(nextItems);
      initialSnapshot.current = JSON.stringify({ c: nextContainers, i: nextItems });
      setDirty(false);
    } catch (err) {
      console.error('Error loading content tree:', err);
    } finally {
      setLoading(false);
    }
  };

  const moduleByKey = useMemo(() => {
    const m: Record<string, AdminModule> = {};
    modules.forEach((mod) => {
      m[mod.key] = mod;
    });
    return m;
  }, [modules]);

  const findContainer = (id: string): string | undefined => {
    if (isContainer(id)) return id;
    return containers.find((cid) => items[cid]?.includes(id));
  };

  const markDirty = (nextContainers: string[], nextItems: Items) => {
    setDirty(JSON.stringify({ c: nextContainers, i: nextItems }) !== initialSnapshot.current);
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  };

  const handleDragOver = (e: DragOverEvent) => {
    const activeIdStr = String(e.active.id);
    const overId = e.over ? String(e.over.id) : null;
    if (!overId || isContainer(activeIdStr)) return;

    const activeContainer = findContainer(activeIdStr);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(activeIdStr);
      const overIndex = overItems.indexOf(overId);

      let newIndex: number;
      if (isContainer(overId)) {
        newIndex = overItems.length;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      const next: Items = {
        ...prev,
        [activeContainer]: activeItems.filter((i) => i !== activeIdStr),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeIdStr,
          ...overItems.slice(newIndex),
        ],
      };
      return next;
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const activeIdStr = String(e.active.id);
    const overId = e.over ? String(e.over.id) : null;
    setActiveId(null);
    if (!overId) return;

    // Reordering modules (containers). Never move the Unassigned bucket.
    if (isContainer(activeIdStr)) {
      if (
        activeIdStr === overId ||
        !isContainer(overId) ||
        activeIdStr === containerId(UNASSIGNED) ||
        overId === containerId(UNASSIGNED)
      )
        return;
      const oldIndex = containers.indexOf(activeIdStr);
      const newIndex = containers.indexOf(overId);
      const reordered = arrayMove(containers, oldIndex, newIndex);
      // Keep Unassigned pinned to the end.
      const cleaned = reordered.filter((c) => c !== containerId(UNASSIGNED));
      cleaned.push(containerId(UNASSIGNED));
      setContainers(cleaned);
      markDirty(cleaned, items);
      return;
    }

    // Reordering / finalizing a page within its container.
    const activeContainer = findContainer(activeIdStr);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer) {
      markDirty(containers, items);
      return;
    }
    if (activeContainer === overContainer) {
      const list = items[activeContainer];
      const oldIndex = list.indexOf(activeIdStr);
      const newIndex = isContainer(overId)
        ? list.length - 1
        : list.indexOf(overId);
      if (oldIndex !== newIndex && newIndex >= 0) {
        const next = { ...items, [activeContainer]: arrayMove(list, oldIndex, newIndex) };
        setItems(next);
        markDirty(containers, next);
        return;
      }
    }
    markDirty(containers, items);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const realModules = containers.filter((c) => c !== containerId(UNASSIGNED));
      const modulePayload = realModules.map((cid, idx) => ({
        id: moduleByKey[keyFromContainer(cid)].id,
        order_index: idx,
      }));
      const pagePayload: { id: number; module_id: string | null; order_index: number }[] = [];
      containers.forEach((cid) => {
        const key = keyFromContainer(cid);
        const moduleId = key === UNASSIGNED ? null : key;
        items[cid].forEach((iid, idx) => {
          pagePayload.push({ id: pageIdFromItem(iid), module_id: moduleId, order_index: idx });
        });
      });
      await apiClient.put('/api/admin/content-tree', {
        modules: modulePayload,
        pages: pagePayload,
      });
      initialSnapshot.current = JSON.stringify({ c: containers, i: items });
      setDirty(false);
      reload();
    } catch (err) {
      console.error('Error saving content tree:', err);
      alert('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  const activePage =
    activeId && !isContainer(activeId) ? pagesById[pageIdFromItem(activeId)] : null;
  const activeModule =
    activeId && isContainer(activeId) ? moduleByKey[keyFromContainer(activeId)] : null;

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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Organize Content
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-tactical-dim">
              Drag lessons between modules to re-assign them, and drag the module handles to
              reorder. Changes are saved when you click Save.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 sm:mt-0">
            {dirty && (
              <span className="text-xs font-medium text-signal-amber">Unsaved changes</span>
            )}
            <TacticalButton variant="secondary" onClick={load} disabled={saving || loading}>
              Reset
            </TacticalButton>
            <TacticalButton variant="primary" onClick={handleSave} disabled={!dirty || saving}>
              {saving ? 'Saving…' : 'Save layout'}
            </TacticalButton>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-r-transparent dark:border-signal-green" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {containers.map((cid) => {
                  const key = keyFromContainer(cid);
                  const isUnassigned = key === UNASSIGNED;
                  const mod = moduleByKey[key];
                  const itemIds = items[cid] ?? [];
                  return (
                    <ModuleContainer
                      key={cid}
                      id={cid}
                      label={isUnassigned ? 'Unassigned' : mod?.label ?? key}
                      sublabel={isUnassigned ? 'no module' : `${mod?.tier ?? ''} · ${mod?.base ?? ''}`}
                      count={itemIds.length}
                      draggable={!isUnassigned}
                    >
                      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                        {itemIds.length === 0 ? (
                          <p className="rounded-md border border-dashed border-slate-300 px-3 py-3 text-center text-xs text-slate-400 dark:border-tactical-border dark:text-tactical-label">
                            Drop lessons here
                          </p>
                        ) : (
                          itemIds.map((iid) => {
                            const page = pagesById[pageIdFromItem(iid)];
                            return page ? <SortablePage key={iid} page={page} /> : null;
                          })
                        )}
                      </SortableContext>
                    </ModuleContainer>
                  );
                })}
              </div>
            </SortableContext>

            <DragOverlay>
              {activePage ? (
                <div className="flex items-center gap-2 rounded-md border border-brand-400 bg-white px-3 py-2 shadow-lg dark:border-signal-green dark:bg-tactical-raised">
                  <span className="text-sm font-medium text-slate-800 dark:text-tactical-text">
                    {pageTitle(activePage)}
                  </span>
                </div>
              ) : activeModule ? (
                <div className="rounded-xl border border-brand-400 bg-slate-50 px-4 py-3 shadow-lg dark:border-signal-green dark:bg-tactical-surface">
                  <span className="text-sm font-semibold text-slate-900 dark:text-tactical-text">
                    {activeModule.label}
                  </span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>
    </div>
  );
}
