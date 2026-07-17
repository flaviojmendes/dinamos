export const MANIFEST_URL = '/content/manifest.json';

export function isForceContentApi(): boolean {
  return import.meta.env.VITE_FORCE_CONTENT_API === 'true';
}
