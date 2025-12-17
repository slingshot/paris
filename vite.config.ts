import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

// Get all component directories from src/stories/
const getComponentEntries = () => {
    const storiesDir = resolve(__dirname, 'src/stories');
    const ignoreDirectories = ['assets'];

    const componentDirs = readdirSync(storiesDir)
        .filter((dir) => {
            const fullPath = resolve(storiesDir, dir);
            return statSync(fullPath).isDirectory() && !ignoreDirectories.includes(dir);
        });

    // Create entry points for each component
    const entries: Record<string, string> = {};
    componentDirs.forEach((dir) => {
        entries[dir] = resolve(storiesDir, dir, 'index.ts');
    });

    return entries;
};

const entries = getComponentEntries();

export default defineConfig({
    plugins: [
        react(),
        // DTS generation is handled by a separate tsc step
        // dts({
        //     tsconfigPath: './tsconfig.build.json',
        //     include: ['src/stories/**/*', 'src/types/**/*', 'src/helpers/**/*', 'src/scss.d.ts'],
        //     exclude: ['**/*.stories.ts', '**/*.stories.tsx', '**/*.test.ts', '**/*.test.tsx'],
        //     outDir: 'dist',
        //     rollupTypes: false,
        //     copyDtsFiles: true,
        //     insertTypesEntry: true,
        // }),
    ],
    css: {
        modules: {
            // Use deterministic class names for consistency
            generateScopedName: '[name]__[local]__[hash:base64:5]',
        },
        preprocessorOptions: {
            scss: {
                // Silence deprecation warnings from dependencies
                silenceDeprecations: ['legacy-js-api'],
            },
        },
    },
    build: {
        lib: {
            entry: entries,
            formats: ['es'],
            fileName: (_, entryName) => `${entryName}/index.js`,
        },
        rollupOptions: {
            external: [
                // React
                'react',
                'react-dom',
                'react/jsx-runtime',
                // Don't externalize other deps - they should be bundled
                // since we're keeping them as dependencies
            ],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: (chunkInfo) => {
                    // Entry points should be stories/component/index.js
                    if (chunkInfo.isEntry) {
                        return `stories/${chunkInfo.name}/index.js`;
                    }
                    return '[name].js';
                },
                chunkFileNames: '[name].js',
                assetFileNames: (assetInfo) => {
                    // Keep CSS files alongside their JS counterparts
                    if (assetInfo.name?.endsWith('.css')) {
                        return '[name][extname]';
                    }
                    return 'assets/[name][extname]';
                },
            },
        },
        cssCodeSplit: true,
        minify: false, // Keep readable for debugging
        sourcemap: true,
        outDir: 'dist',
        emptyDirBeforeWrite: true,
        copyPublicDir: false, // Don't copy public folder to dist
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
