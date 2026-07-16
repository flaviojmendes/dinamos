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

  const path = `../locales/${lng}/namespaces/${namespace}.json`;
  const loader = namespaceLoaders[lng][path];
  if (!loader) return;

  const mod = await loader();
  i18n.addResourceBundle(lng, 'translation', { [namespace]: mod.default }, true, true);
  loaded.add(namespace);
  loadedNamespaces.set(lng, loaded);
}

export async function loadLocale(lng: string, options?: { extended?: boolean }): Promise<AppLocale> {
  const normalized = localeKey(lng);
  const extended = options?.extended ?? false;

  if (!loadedLocales.has(normalized)) {
    loadedNamespaces.set(normalized, new Set());
    await Promise.all(BOOTSTRAP_NAMESPACES.map((ns) => loadNamespace(normalized, ns)));
    loadedLocales.add(normalized);
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

/** Preload bootstrap namespaces for primary + fallback locale. */
export async function ensureI18nReady(initialLng?: string): Promise<void> {
  const primary = initialLng?.startsWith('pt') ? 'pt' : initialLng?.startsWith('en') ? 'en' : 'pt';
  const fallback: AppLocale = primary === 'pt' ? 'en' : 'pt';
  await Promise.all([loadLocale(primary), loadLocale(fallback)]);
  if (i18n.language !== primary) {
    await i18n.changeLanguage(primary);
  }

  const scheduleExtended = () => {
    void Promise.all([loadLocale(primary, { extended: true }), loadLocale(fallback, { extended: true })]);
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
      fallbackLng: 'pt',
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

  const detected = i18n.language || 'pt';
  await ensureI18nReady(detected);

  i18n.on('languageChanged', (lng) => {
    void loadLocale(lng, { extended: true });
  });
})();

export async function whenI18nReady(): Promise<typeof i18n> {
  await initPromise;
  return i18n;
}

export default i18n;
