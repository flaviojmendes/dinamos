import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Default to Node; DOM-dependent suites opt in with a
    // `// @vitest-environment jsdom` docblock at the top of the file.
    environment: 'node',
    include: ['src/**/*.test.ts', 'api/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}', 'api/**/*.ts'],
      exclude: [
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.test.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'api/dev-server.ts',
        'api/index.ts',
        'api/scripts/**',
        'api/db/migrations/**',
      ],
    },
  },
});
