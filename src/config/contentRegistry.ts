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
import { contentManifest } from './contentManifest';

export type Tier = 'FOUNDATIONAL' | 'CORE' | 'ADVANCED' | 'APPLIED' | 'TOOLS';
export type ContentType = 'lesson' | 'simulator' | 'case' | 'tool';

export interface ModuleDef {
  id: string;
  /** English fallback label (translated via `command_center.modules.<id>`). */
  label: string;
  tier: Tier;
  /** Index/landing path for the module. */
  base: string;
  /** Explicit lesson paths for modules without a shared URL prefix. */
  paths?: string[];
}

export interface ContentItem {
  path: string;
  slug?: string;
  moduleId: string;
  tier: Tier;
  type: ContentType;
  free: boolean;
  prerequisites?: string[];
  related?: string[];
  keywords?: string[];
}

/**
 * Modules in learning order, grouped by tier. Mirrors (and now replaces) the
 * MODULES list that used to live in CommandCenter.
 */
export const MODULES: ModuleDef[] = [
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
    base: '/home',
    paths: ['/home', '/quizzes', '/ranking', '/forum', '/profile', '/notifications'],
  },
];

/** Tier display order, used to group the sidebar and the explore page. */
export const TIER_ORDER: Tier[] = ['FOUNDATIONAL', 'CORE', 'ADVANCED', 'APPLIED', 'TOOLS'];

const moduleById = new Map(MODULES.map((m) => [m.id, m]));

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

function moduleIdForPath(path: string): string {
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
  // Design principles
  '/principios-design/escalabilidade/horizontal/simulator',
  '/principios-design/escalabilidade/vertical/simulator',
  '/principios-design/escalabilidade/simulator',
  '/principios-design/disponibilidade/simulator',
  '/principios-design/tolerancia-falhas/retries/simulator',
  '/principios-design/tolerancia-falhas/circuit-breaker/simulator',
  '/principios-design/tolerancia-falhas/timeout/simulator',
  '/principios-design/eventos/simulator',
  '/principios-design/canary-deployment/simulator',
  '/principios-design/cqrs/simulator',
  '/principios-design/rate-limiting/simulator',
  '/backpressure',
  // Consistency strategies
  '/estrategias-de-consistencia/sincronizacao/algoritmos',
  '/estrategias-de-consistencia/two-phase-commit/simulador',
  '/estrategias-de-consistencia/consenso/simulador',
  '/estrategias-de-consistencia/lamport-timestamps/simulador',
  '/estrategias-de-consistencia/saga/simulator',
  '/estrategias-de-consistencia/delivery-semantics/simulator',
  // Security
  '/seguranca/criptografia/simulador',
  '/seguranca/tokens/simulador',
  '/seguranca/ataques/simulador',
  '/seguranca/prompt-injection/simulador',
  // Monitoring
  '/monitoramento-e-manutencao/logs/simulador',
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
];

// Tools and community destinations.
const TOOL_PATHS: string[] = ['/editor', '/roadmap'];

// Practice Arena: the merged designLab destinations (challenges hub, quizzes,
// ranking, forum, profile, notifications). Registered so they are searchable in
// the command palette and browsable on /explore alongside lessons & simulators.
const PRACTICE_PATHS: { path: string; free: boolean }[] = [
  { path: '/home', free: true },
  { path: '/quizzes', free: true },
  { path: '/ranking', free: true },
  { path: '/forum', free: true },
  { path: '/profile', free: false },
  { path: '/notifications', free: false },
];

function buildRegistry(): ContentItem[] {
  const byPath = new Map<string, ContentItem>();

  // Lessons + cases from the MDX manifest.
  for (const entry of contentManifest) {
    if (ALIAS_PATHS.has(entry.path) || byPath.has(entry.path)) continue;
    const moduleId = moduleIdForPath(entry.path);
    const type: ContentType = entry.path.startsWith('/casos-reais') ? 'case' : 'lesson';
    byPath.set(entry.path, {
      path: entry.path,
      slug: entry.slug,
      moduleId,
      tier: tierForModule(moduleId),
      type,
      free: entry.requiresSubscription === false,
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
      free: false,
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
      free: true,
    });
  }

  // Practice Arena (merged designLab destinations).
  for (const { path, free } of PRACTICE_PATHS) {
    if (byPath.has(path)) continue;
    byPath.set(path, {
      path,
      moduleId: 'practice',
      tier: 'TOOLS',
      type: 'tool',
      free,
    });
  }

  return Array.from(byPath.values());
}

export const contentRegistry: ContentItem[] = buildRegistry();

const registryByPath = new Map(contentRegistry.map((i) => [i.path, i]));

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
