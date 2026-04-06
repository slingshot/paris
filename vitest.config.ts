import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: {
            modules: {
                classNameStrategy: 'non-scoped',
            },
        },
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
