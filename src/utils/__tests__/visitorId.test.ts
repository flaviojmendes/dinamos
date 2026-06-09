// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getVisitorId } from '../visitorId';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getVisitorId', () => {
  it('creates and persists a new id', () => {
    const id = getVisitorId();
    expect(id).toBeTruthy();
    expect(localStorage.getItem('analytics-visitor-id')).toBe(id);
  });

  it('returns the existing id on subsequent calls', () => {
    const first = getVisitorId();
    const second = getVisitorId();
    expect(first).toBe(second);
  });

  it('falls back to a manual id when crypto.randomUUID is unavailable', () => {
    localStorage.clear();
    const original = crypto.randomUUID;
    // @ts-expect-error override for the test
    crypto.randomUUID = undefined;
    const id = getVisitorId();
    expect(id.startsWith('v-')).toBe(true);
    crypto.randomUUID = original;
  });

  it('returns a session id when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const id = getVisitorId();
    expect(id).toBeTruthy();
    spy.mockRestore();
  });
});
