/** Shared retry helpers for Arena client sync. */

export const MAX_SYNC_RETRIES = 5;
export const BASE_RETRY_MS = 500;
export const MAX_RETRY_MS = 8000;

export function retryDelayMs(attempt: number): number {
  return Math.min(MAX_RETRY_MS, BASE_RETRY_MS * 2 ** Math.max(0, attempt));
}

export function isRetryableHttpError(err: unknown): boolean {
  const status = (err as { response?: { status?: number } })?.response?.status;
  if (status === 401 || status === 403 || status === 404 || status === 422) return false;
  return true;
}

export function errorDetail(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string; message?: string } } })?.response
    ?.data;
  return detail?.detail ?? detail?.message ?? fallback;
}
