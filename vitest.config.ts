import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
    },
    test: {
        projects: [
            // Fast unit tests (jsdom, ~5s)
            {
                extends: true,
                test: {
                    name: 'unit',
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
            },
            // Story tests (real browser via Playwright)
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        provider: playwright({}),
                        headless: true,
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
    },
});
