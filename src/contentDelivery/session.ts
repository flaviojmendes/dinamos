import { isForceContentApi } from './config';

let preferApi = isForceContentApi();

/** Admin reload and emergency env force subsequent reads through the API. */
export function setPreferContentApi(value: boolean): void {
  preferApi = value || isForceContentApi();
}

export function shouldUseContentApi(): boolean {
  return preferApi || isForceContentApi();
}

export function resetContentSessionForTests(): void {
  preferApi = isForceContentApi();
}
