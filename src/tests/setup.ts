import '@testing-library/jest-dom';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect, vi } from 'vitest';

expect.extend(axeMatchers);

// Unconditionally mock global.fetch to ensure it's a Vitest mock function
global.fetch = vi.fn();

// Polyfill localStorage for Node/JSDOM testing environments
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = String(value); },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); },
  length: 0,
  key: () => null,
};
window.localStorage = global.localStorage;
