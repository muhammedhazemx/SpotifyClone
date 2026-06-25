import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia since it doesn't exist in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Location & History navigation in JSDOM for React Router test flows
let currentPath = '/';
let historyStack = ['/'];
let historyPointer = 0;

Object.defineProperty(window, 'location', {
  value: {
    get pathname() {
      return currentPath;
    },
    set pathname(val) {
      currentPath = val;
      historyStack = [val];
      historyPointer = 0;
    },
    href: 'http://localhost/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  configurable: true,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: {
    back: () => {
      if (historyPointer > 0) {
        historyPointer--;
        currentPath = historyStack[historyPointer];
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
    forward: () => {
      if (historyPointer < historyStack.length - 1) {
        historyPointer++;
        currentPath = historyStack[historyPointer];
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
    go: (delta: number) => {
      const targetPointer = historyPointer + delta;
      if (targetPointer >= 0 && targetPointer < historyStack.length) {
        historyPointer = targetPointer;
        currentPath = historyStack[historyPointer];
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
    pushState: (_state: unknown, _title: string, url: string) => {
      historyStack = historyStack.slice(0, historyPointer + 1);
      historyStack.push(url);
      historyPointer++;
      currentPath = url;
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    replaceState: (_state: unknown, _title: string, url: string) => {
      historyStack[historyPointer] = url;
      currentPath = url;
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    get length() {
      return historyStack.length;
    },
    get state() {
      return null;
    }
  },
  configurable: true,
  writable: true,
});
