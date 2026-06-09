import { describe, it, expect } from 'vitest';
import { formatDate } from '../dateUtils';

describe('formatDate', () => {
  it('returns a dash for an empty value', () => {
    expect(formatDate()).toBe('-');
    expect(formatDate('')).toBe('-');
  });

  it('formats a timestamp from today with "Hoje"', () => {
    const now = new Date();
    now.setHours(9, 5, 0, 0);
    expect(formatDate(now.toISOString())).toMatch(/^Hoje às/);
  });

  it('formats a timestamp from yesterday with "Ontem"', () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(14, 30, 0, 0);
    expect(formatDate(d.toISOString())).toMatch(/^Ontem às/);
  });

  it('formats an older date with the full date', () => {
    const out = formatDate('2020-01-15T10:00:00Z');
    expect(out).toMatch(/às/);
    expect(out).not.toMatch(/^Hoje/);
    expect(out).not.toMatch(/^Ontem/);
  });
});
