import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure React Testing Library unmounts components between tests so the jsdom
// document does not leak state across cases.
afterEach(() => {
  cleanup();
});
