import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver (used by Tilt component)
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock as any;

// Mock matchMedia (used by @headlessui/react)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.IntersectionObserver = IntersectionObserverMock as any;
