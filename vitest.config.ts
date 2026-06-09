import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Default to Node; DOM-dependent suites opt in with a
    // `// @vitest-environment jsdom` docblock at the top of the file.
    environment: 'node',
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'api/**/*.test.ts',
      'api/**/*.test.tsx',
    ],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Scope coverage to the testable logic surface plus the specific
      // components we exercise. Large presentational React views and static
      // data files (e.g. i18n translations) are intentionally left out so the
      // metric reflects code with meaningful behaviour to test.
      include: [
        'api/app.ts',
        'api/routes/**/*.ts',
        'api/db/repo.ts',
        'api/db/serializers.ts',
        'api/db/client.ts',
        'api/lib/**/*.ts',
        'api/middleware/**/*.ts',
        'src/services/**/*.ts',
        'src/utils/**/*.ts',
        'src/hooks/**/*.ts',
        'src/app/utils/**/*.ts',
        'src/components/SystemEditor/engine/**/*.ts',
        // Components covered by RTL suites.
        'src/contexts/ThemeContext.tsx',
        'src/contexts/AuthContext.tsx',
        'src/contexts/ContentContext.tsx',
        'src/app/components/Stepper.tsx',
        'src/app/components/Typewriter.tsx',
        'src/app/components/VoteButton.tsx',
        'src/app/components/UserBadge.tsx',
        'src/app/components/ThemeToggle.tsx',
        'src/components/Common/ThemeToggle.tsx',
        'src/components/Auth/ProtectedRoute.tsx',
      ],
      exclude: [
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        'src/components/SystemEditor/engine/types.ts',
      ],
    },
  },
});
