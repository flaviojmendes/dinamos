import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export type AppLocale = 'en' | 'pt';

/** Namespaces required before first paint (landing, auth shell, nav chrome). */
const BOOTSTRAP_NAMESPACES = [
  'common',
  'auth',
  'landing',
  'footer',
  'cookies',
  'badges',
  'status',
  'announcement',
  'protected_route',
  'command_center',
  'heatmap',
  'quick_access',
  'content',
  'preferences',
  'nav',
  'command_palette',
  'menu',
  'annotations',
  'explore',
] as const;

const manifestLoaders: Record<AppLocale, () => Promise<{ default: string[] }>> = {
  en: () => import('../locales/en/namespaces/_manifest.json'),
  pt: () => import('../locales/pt/namespaces/_manifest.json'),
};

const namespaceLoaders = {
  en: import.meta.glob('../locales/en/namespaces/*.json'),
  pt: import.meta.glob('../locales/pt/namespaces/*.json'),
} as Record<AppLocale, Record<string, () => Promise<{ default: Record<string, unknown> }>>>;

const loadedLocales = new Set<string>();
const loadedNamespaces = new Map<string, Set<string>>();
const namespaceLoads = new Map<string, Promise<void>>();
const bootstrapLoads = new Map<AppLocale, Promise<void>>();
let languageChoice = 0;

function localeKey(lng: string): AppLocale {
  return lng.startsWith('pt') ? 'pt' : 'en';
}

function nsKey(lng: AppLocale, namespace: string): string {
  return `${lng}:${namespace}`;
}

async function loadNamespace(lng: AppLocale, namespace: string): Promise<void> {
  if (namespace === '_manifest') return;
  const loaded = loadedNamespaces.get(lng) ?? new Set<string>();
  if (loaded.has(namespace)) return;
  loadedNamespaces.set(lng, loaded);
  const key = nsKey(lng, namespace);
  const pending = namespaceLoads.get(key);
  if (pending) return pending;

  const path = `../locales/${lng}/namespaces/${namespace}.json`;
  const loader = namespaceLoaders[lng][path];
  if (!loader) return;

  const task = (async () => {
    const mod = await loader();
    i18n.addResourceBundle(lng, 'translation', { [namespace]: mod.default }, true, true);
    loaded.add(namespace);
  })();
  namespaceLoads.set(key, task);
  try { await task; } finally { namespaceLoads.delete(key); }
}

export async function loadLocale(lng: string, options?: { extended?: boolean }): Promise<AppLocale> {
  const normalized = localeKey(lng);
  const extended = options?.extended ?? false;

  if (!loadedLocales.has(normalized)) {
    let pending = bootstrapLoads.get(normalized);
    if (!pending) {
      pending = Promise.all(BOOTSTRAP_NAMESPACES.map(ns => loadNamespace(normalized, ns))).then(() => {
        loadedLocales.add(normalized);
      });
      bootstrapLoads.set(normalized, pending);
    }
    try { await pending; } finally { bootstrapLoads.delete(normalized); }
  }

  if (extended) {
    const { default: all } = await manifestLoaders[normalized]();
    const remaining = all.filter(
      (ns) => ns !== '_manifest' && !BOOTSTRAP_NAMESPACES.includes(ns as (typeof BOOTSTRAP_NAMESPACES)[number]),
    );
    await Promise.all(remaining.map((ns) => loadNamespace(normalized, ns)));
  }

  return normalized;
}

/** Commit a language choice only after its UI resources are ready. */
export async function changeAppLanguage(lng: string): Promise<boolean> {
  const choice = ++languageChoice;
  const locale = await loadLocale(lng, { extended: true });
  if (choice !== languageChoice) return false;
  await i18n.changeLanguage(locale);
  try { localStorage.setItem('i18nextLng', locale); } catch { /* private storage */ }
  return true;
}

/** Preload bootstrap namespaces for primary + fallback locale. */
export async function ensureI18nReady(initialLng?: string): Promise<void> {
  const primary = initialLng?.startsWith('pt') ? 'pt' : initialLng?.startsWith('en') ? 'en' : 'pt';
  const fallback: AppLocale = primary === 'pt' ? 'en' : 'pt';
  await Promise.all([loadLocale(primary), loadLocale(fallback)]);
  if (i18n.language !== primary) {
    await i18n.changeLanguage(primary);
  }

  const scheduleExtended = () => {
    void Promise.all([loadLocale(primary, { extended: true }), loadLocale(fallback, { extended: true })]).catch(() => { /* Retry when the locale is requested. */ });
  };
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(scheduleExtended, { timeout: 4000 });
  } else {
    setTimeout(scheduleExtended, 1500);
  }
}

const initPromise = (async () => {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {},
      // A missing English resource must never silently turn into Portuguese.
      fallbackLng: false,
      load: 'languageOnly',
      supportedLngs: ['en', 'pt'],
      nonExplicitSupportedLngs: true,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage'],
        caches: [],
      },
    });

  const updateDocumentLanguage = (lng: string) => {
    if (typeof document !== 'undefined') document.documentElement.lang = localeKey(lng) === 'pt' ? 'pt-BR' : 'en';
  };
  i18n.on('languageChanged', updateDocumentLanguage);

  const detected = i18n.language || 'pt';
  await ensureI18nReady(detected);
  updateDocumentLanguage(i18n.resolvedLanguage || i18n.language);

  i18n.on('languageChanged', (lng) => {
    void loadLocale(lng, { extended: true }).catch(() => { /* Explicit choices surface failures in the switcher. */ });
  });
})();

export async function whenI18nReady(): Promise<typeof i18n> {
  await initPromise;
  return i18n;
}

export default i18n;
