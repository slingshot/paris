import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock as any;

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

class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}
globalThis.IntersectionObserver = IntersectionObserverMock as any;
