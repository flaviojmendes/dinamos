/**
 * contentRegistry — single source of truth for everything that is findable in
 * the app: lessons (MDX), interactive simulators, real-world cases, and tools.
 *
 * The sidebar ([App.tsx]), the command palette, the /explore catalog page, the
 * Command Center dashboard, and on-page breadcrumbs/prev-next all derive from
 * this list, so the navigation surfaces can never drift apart.
 *
 * URLs and i18n keys are preserved: labels are resolved by consumers via
 * `menuKey(path, field)` + `t()`, exactly like the sidebar's MenuLink. The
 * registry itself stays language-agnostic.
 */
export type Tier = 'FOUNDATIONAL' | 'CORE' | 'ADVANCED' | 'APPLIED' | 'TOOLS';
export type ContentType = 'lesson' | 'simulator' | 'case' | 'tool';

/**
 * A lesson page as delivered by the content API (`GET /api/content`). The
 * registry is (re)built from these at runtime via `setRegistryLessons`, since
 * lesson content now lives in the database instead of static MDX files.
 */
export interface LessonEntry {
  path: string;
  slug: string;
  moduleId?: string | null;
  simulatorKey?: string | null;
  orderIndex?: number;
  titleEn?: string | null;
  titlePt?: string | null;
}

export interface ModuleDef {
  id: string;
  /** English fallback label (translated via `command_center.modules.<id>`). */
  label: string;
  tier: Tier;
  /** Index/landing path for the module. */
  base: string;
  /** Explicit lesson paths for modules without a shared URL prefix. */
  paths?: string[];
  /** DB-driven display order (content_modules.order_index). */
  orderIndex?: number;
}

export interface ContentItem {
  path: string;
  slug?: string;
  moduleId: string;
  tier: Tier;
  type: ContentType;
  /** DB-driven display order (content_pages.order_index). */
  orderIndex?: number;
  /** DB-driven titles (content_pages.title_en / title_pt), used for nav labels. */
  titleEn?: string | null;
  titlePt?: string | null;
  prerequisites?: string[];
  related?: string[];
  keywords?: string[];
}

/**
 * Modules in learning order, grouped by tier. Mirrors (and now replaces) the
 * MODULES list that used to live in CommandCenter.
 */
export const DEFAULT_MODULES: ModuleDef[] = [
  { id: 'fundamentals', label: 'Fundamentals', tier: 'FOUNDATIONAL', base: '/intro', paths: ['/intro', '/sistemas-distribuidos-101', '/system-design-101'] },
  { id: 'theory', label: 'Theoretical Foundations', tier: 'FOUNDATIONAL', base: '/theoretical-foundations' },
  { id: 'components', label: 'System Components', tier: 'CORE', base: '/componentes' },
  { id: 'design', label: 'Design Principles', tier: 'CORE', base: '/principios-design' },
  { id: 'data-storage', label: 'Data & Storage', tier: 'CORE', base: '/dados-armazenamento' },
  { id: 'consistency', label: 'Consistency Strategies', tier: 'ADVANCED', base: '/estrategias-de-consistencia' },
  { id: 'security', label: 'Security', tier: 'ADVANCED', base: '/seguranca' },
  { id: 'monitoring', label: 'Monitoring & Maintenance', tier: 'ADVANCED', base: '/monitoramento-e-manutencao' },
  { id: 'ai-systems', label: 'AI & LLM Systems', tier: 'APPLIED', base: '/sistemas-ia' },
  { id: 'cases', label: 'Real-World Cases', tier: 'APPLIED', base: '/casos-reais' },
  { id: 'tools', label: 'Tools & Community', tier: 'TOOLS', base: '/editor' },
  {
    id: 'practice',
    label: 'Practice Arena',
    tier: 'TOOLS',
    base: '/design-lab',
    paths: ['/design-lab', '/quizzes', '/ranking', '/forum', '/profile', '/notifications'],
  },
];

/** Tier display order, used to group the sidebar and the explore page. */
export const TIER_ORDER: Tier[] = ['FOUNDATIONAL', 'CORE', 'ADVANCED', 'APPLIED', 'TOOLS'];

/**
 * The live module list. Initialized with the built-in defaults so the app
 * works before the modules index loads, then replaced from the DB via
 * `setRegistryModules` (see ContentContext). Modules are now CMS-editable.
 */
export let MODULES: ModuleDef[] = DEFAULT_MODULES;

let moduleById = new Map(MODULES.map((m) => [m.id, m]));

/** Replace the live module list from the fetched modules index. */
export function setRegistryModules(modules: ModuleDef[]): void {
  MODULES = modules.length ? modules : DEFAULT_MODULES;
  moduleById = new Map(MODULES.map((m) => [m.id, m]));
}

export function getModule(id: string): ModuleDef | undefined {
  return moduleById.get(id);
}

/** i18n key for a path, matching the sidebar convention (menu.<dotted>.name). */
export function menuKey(path: string, field: 'name' | 'description'): string {
  return `menu.${path.replace(/^\//, '').replace(/\//g, '.')}.${field}`;
}

function prettify(seg: string): string {
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Human label used as the i18n defaultValue when a key is missing. */
export function fallbackLabel(path: string): string {
  const segs = path.split('/').filter(Boolean);
  const tail = segs[segs.length - 1] ?? path;
  if (tail === 'simulator' || tail === 'simulador') {
    const parent = segs[segs.length - 2] ?? tail;
    return `${prettify(parent)} Simulator`;
  }
  return prettify(tail);
}

// Standalone interactive routes that belong to a module other than their URL
// prefix would imply (or have no prefix at all).
const PATH_MODULE_OVERRIDES: Record<string, string> = {
  '/backpressure': 'design',
  '/async-sync': 'design',
  '/circuit-breaker': 'design',
  '/rate-limiter': 'design',
  '/cdn': 'components',
};

export function moduleIdForPath(path: string): string {
  if (PATH_MODULE_OVERRIDES[path]) return PATH_MODULE_OVERRIDES[path];
  if (['/intro', '/sistemas-distribuidos-101', '/system-design-101'].includes(path)) {
    return 'fundamentals';
  }
  const found = MODULES.find(
    (m) => m.id !== 'fundamentals' && m.id !== 'tools' && path.startsWith(m.base),
  );
  return found?.id ?? 'fundamentals';
}

function tierForModule(moduleId: string): Tier {
  return getModule(moduleId)?.tier ?? 'CORE';
}

// Manifest aliases that duplicate a canonical lesson; excluded so they don't
// appear twice in search/browse.
const ALIAS_PATHS = new Set(['/fallback', '/horizontal-scaling']);

// Interactive simulators. These live only as bespoke <Route>s in App.tsx, so
// they must be enumerated here to become searchable/browsable.
const SIMULATOR_PATHS: string[] = [
  // Components
  '/componentes/cache/simulator',
  '/componentes/load-balancer/simulator',
  '/componentes/message-queue/simulator',
  '/componentes/cdn/simulator',
  '/componentes/api-gateway/simulator',
  '/componentes/firewall/simulator',
  '/componentes/polling-webhooks/simulator',
  '/componentes/kafka/simulator',
  '/componentes/api-styles/simulator',
  '/componentes/realtime-push/simulator',
  '/componentes/dead-letter-queue/simulator',
  // Design principles
  '/principios-design/escalabilidade/horizontal/simulator',
  '/principios-design/escalabilidade/vertical/simulator',
  '/principios-design/escalabilidade/simulator',
  '/principios-design/disponibilidade/zonas/simulator',
  '/principios-design/tolerancia-falhas/retries/simulator',
  '/principios-design/tolerancia-falhas/circuit-breaker/simulator',
  '/principios-design/tolerancia-falhas/timeout/simulator',
  '/principios-design/eventos/simulator',
  '/principios-design/canary-deployment/simulator',
  '/principios-design/cqrs/simulator',
  '/principios-design/rate-limiting/simulator',
  '/principios-design/event-sourcing/simulator',
  '/principios-design/outbox/simulator',
  '/principios-design/bulkhead/simulator',
  '/principios-design/blue-green/simulator',
  '/theoretical-foundations/pacelc/simulator',
  '/monitoramento-e-manutencao/chaos-engineering/simulator',
  '/backpressure',
  // Consistency strategies
  '/estrategias-de-consistencia/sincronizacao/algoritmos',
  '/estrategias-de-consistencia/two-phase-commit/simulator',
  '/estrategias-de-consistencia/consenso/simulator',
  '/estrategias-de-consistencia/lamport-timestamps/simulator',
  '/estrategias-de-consistencia/saga/simulator',
  '/estrategias-de-consistencia/delivery-semantics/simulator',
  '/estrategias-de-consistencia/crdts/simulator',
  '/estrategias-de-consistencia/gossip/simulator',
  '/estrategias-de-consistencia/distributed-locks/simulator',
  // Security
  '/seguranca/criptografia/simulator',
  '/seguranca/tokens/simulator',
  '/seguranca/ataques/simulator',
  '/seguranca/prompt-injection/simulator',
  // Monitoring
  '/monitoramento-e-manutencao/logs/simulator',
  '/monitoramento-e-manutencao/logs/tracing',
  // AI systems
  '/sistemas-ia/llm-serving-fundamentals/simulator',
  '/sistemas-ia/rag/simulator',
  '/sistemas-ia/vector-search/simulator',
  '/sistemas-ia/llm-gateway/simulator',
  '/sistemas-ia/gpu-autoscaling/simulator',
  '/sistemas-ia/agentic-systems/simulator',
  // Data & storage
  '/dados-armazenamento/consistent-hashing/simulator',
  '/dados-armazenamento/sharding/simulator',
  '/dados-armazenamento/inverted-index/simulator',
  '/dados-armazenamento/storage-engines/simulator',
  '/dados-armazenamento/bloom-filters/simulator',
  '/dados-armazenamento/replication-quorums/simulator',
  '/dados-armazenamento/cdc/simulator',
];

// Tools and community destinations.
const TOOL_PATHS: string[] = ['/editor', '/roadmap'];

// Practice Arena: the merged designLab destinations (challenges hub, quizzes,
// ranking, forum, profile, notifications). Registered so they are searchable in
// the command palette and browsable on /explore alongside lessons & simulators.
const PRACTICE_PATHS: string[] = [
  '/design-lab',
  '/quizzes',
  '/ranking',
  '/forum',
  '/profile',
  '/notifications',
];

function buildRegistry(lessons: LessonEntry[]): ContentItem[] {
  const byPath = new Map<string, ContentItem>();

  // Lessons + cases from the content API (formerly the static MDX manifest).
  for (const entry of lessons) {
    if (ALIAS_PATHS.has(entry.path) || byPath.has(entry.path)) continue;
    const moduleId = entry.moduleId || moduleIdForPath(entry.path);
    const type: ContentType = entry.path.startsWith('/casos-reais') ? 'case' : 'lesson';
    byPath.set(entry.path, {
      path: entry.path,
      slug: entry.slug,
      moduleId,
      tier: tierForModule(moduleId),
      type,
      orderIndex: entry.orderIndex,
      titleEn: entry.titleEn,
      titlePt: entry.titlePt,
    });
  }

  // Interactive simulators.
  for (const path of SIMULATOR_PATHS) {
    if (byPath.has(path)) continue;
    const moduleId = moduleIdForPath(path);
    byPath.set(path, {
      path,
      moduleId,
      tier: tierForModule(moduleId),
      type: 'simulator',
    });
  }

  // Tools.
  for (const path of TOOL_PATHS) {
    if (byPath.has(path)) continue;
    byPath.set(path, {
      path,
      moduleId: 'tools',
      tier: 'TOOLS',
      type: 'tool',
    });
  }

  // Practice Arena (merged designLab destinations).
  for (const path of PRACTICE_PATHS) {
    if (byPath.has(path)) continue;
    byPath.set(path, {
      path,
      moduleId: 'practice',
      tier: 'TOOLS',
      type: 'tool',
    });
  }

  return Array.from(byPath.values());
}

/**
 * The live registry. Starts empty and is (re)populated by `setRegistryLessons`
 * once the content index has been fetched (see ContentContext). ES module live
 * bindings mean importers always read the latest array on their next render.
 */
export let contentRegistry: ContentItem[] = [];

let registryByPath = new Map<string, ContentItem>();

/** Rebuild the registry from the fetched lesson index. */
export function setRegistryLessons(lessons: LessonEntry[]): void {
  contentRegistry = buildRegistry(lessons);
  registryByPath = new Map(contentRegistry.map((i) => [i.path, i]));
}

export function getItem(path: string): ContentItem | undefined {
  return registryByPath.get(path);
}

export function itemsByModule(moduleId: string): ContentItem[] {
  return contentRegistry.filter((i) => i.moduleId === moduleId);
}

export function itemsByType(type: ContentType): ContentItem[] {
  return contentRegistry.filter((i) => i.type === type);
}

export function moduleOf(path: string): ModuleDef | undefined {
  const item = getItem(path);
  return item ? getModule(item.moduleId) : undefined;
}

/**
 * DB-driven sort rank for a path, used to order the sidebar/roadmap nav.
 * Items are ordered by their module's `order_index`, then the page's
 * `order_index` within that module. Anything without a DB row (simulators,
 * tools, external links) sorts last and keeps its static-tree position via the
 * caller's index tiebreaker. Falls back to the live module array position when
 * a module has no explicit `orderIndex` yet (e.g. before the index loads).
 */
/**
 * DB-driven display title for a path, in the requested language (with fallback
 * to the other language). Lesson/case pages carry their title from the CMS
 * (content_pages.title_en / title_pt); items without a DB title (simulators,
 * tools, module roots) return undefined so callers fall back to i18n keys.
 */
export function titleForPath(path: string, lang: string): string | undefined {
  const item = getItem(path);
  if (!item) return undefined;
  const pt = lang.toLowerCase().startsWith('pt');
  const primary = pt ? item.titlePt : item.titleEn;
  const fallback = pt ? item.titleEn : item.titlePt;
  const resolved = (primary && primary.trim()) || (fallback && fallback.trim()) || '';
  return resolved || undefined;
}

export function orderRank(path: string): { module: number; page: number } {
  const item = getItem(path);
  const moduleId = item?.moduleId ?? moduleIdForPath(path);
  const moduleArrayIdx = MODULES.findIndex((m) => m.id === moduleId);
  const moduleOrder =
    getModule(moduleId)?.orderIndex ??
    (moduleArrayIdx >= 0 ? moduleArrayIdx : Number.MAX_SAFE_INTEGER);
  const pageOrder = item?.orderIndex ?? Number.MAX_SAFE_INTEGER;
  return { module: moduleOrder, page: pageOrder };
}

/**
 * Ordered lessons/simulators within a module (manifest order preserved), used
 * for prev/next on-page navigation. Tools are excluded.
 */
export function moduleSequence(moduleId: string): ContentItem[] {
  return itemsByModule(moduleId).filter((i) => i.type !== 'tool');
}

/** Sibling items in the same module, for the on-page "Related" list. */
export function relatedItems(path: string, limit = 5): ContentItem[] {
  const item = getItem(path);
  if (!item) return [];
  if (item.related?.length) {
    return item.related.map((p) => getItem(p)).filter((i): i is ContentItem => Boolean(i));
  }
  return moduleSequence(item.moduleId)
    .filter((i) => i.path !== path)
    .slice(0, limit);
}
