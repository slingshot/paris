import { globSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

const root = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// Every published entrypoint: each component's index.ts plus the theme.
// `preserveModules` follows imports from these roots, so only modules that are
// actually reachable from a public entry get emitted (keeps the graph intact,
// no sibling duplication, fully tree-shakeable).
const entries = globSync('src/stories/*/index.ts', { cwd: root });

// Externalize all runtime deps + peers (and their deep subpaths). Only Paris's
// own source compiles; React, Ariakit, Headless UI, Tiptap, framer-motion, pte,
// etc. stay as bare imports for the consumer's bundler to resolve.
const externalPkgs = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];
const isExternal = (id: string): boolean =>
    id === 'react' ||
    id === 'react-dom' ||
    id.startsWith('react/') ||
    id.startsWith('react-dom/') ||
    id.startsWith('node:') ||
    externalPkgs.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
    // JSX is transformed by Vite's built-in esbuild using the automatic runtime
    // (React 17+ JSX transform), so `react/jsx-runtime` is imported and kept
    // external. No @vitejs/plugin-react needed for a library compile.
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
    },
    // Don't copy the docs site's public/ assets into the library dist.
    publicDir: false,
    plugins: [
        // Re-inject the per-component `import './X.css'` that cssCodeSplit drops
        // in library/preserveModules mode, so component CSS auto-loads on import.
        libInjectCss(),
        preserveDirectives(),
        dts({
            tsconfigPath: './tsconfig.build.json',
            entryRoot: 'src',
            // Per-file declarations (default) to mirror preserveModules output.
            insertTypesEntry: false,
            include: ['src/stories/**/*.ts', 'src/stories/**/*.tsx', 'src/helpers/**/*', 'src/types/**/*'],
            exclude: ['**/*.test.*', '**/*.stories.*', '**/*.mdx', 'src/test/**/*'],
        }),
    ],
    css: {
        modules: {
            // Stable, readable, collision-safe scoped class names.
            generateScopedName: 'paris_[local]_[hash:base64:5]',
        },
    },
    build: {
        target: 'esnext',
        minify: false,
        sourcemap: true,
        // Force per-module CSS even in lib mode (lib defaults this to false,
        // which would merge everything into one style.css).
        cssCodeSplit: true,
        outDir: 'dist',
        emptyOutDir: true,
        // `lib` (vs raw rollupOptions.input) makes Vite set a
        // preserveModules-compatible `preserveEntrySignatures`.
        lib: {
            entry: entries,
            formats: ['es'],
        },
        rollupOptions: {
            external: isExternal,
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
            },
        },
    },
});
