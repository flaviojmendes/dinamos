import { readFileSync } from 'node:fs';
import { getTransformedRoutes } from '@vercel/routing-utils';
import { describe, expect, it } from 'vitest';

describe('Vercel route configuration', () => {
  it('passes Vercel source and destination validation', () => {
    const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
    const { error } = getTransformedRoutes(config);

    expect(error, error?.message).toBeNull();
  });
});
