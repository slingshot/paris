# Compile Paris Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Precompile Paris's 32 components from raw `.tsx` + `.module.scss` into shipped ESM + extracted CSS + `.d.ts` in `dist/`, so consumers need no `transpilePackages` and no `sass`, and it works in Next.js App Router (RSC) and Vite React.

**Architecture:** A Vite library build (Rollup under the hood) with `preserveModules` (1 source file → 1 output file) keeps the cross-component import graph intact and tree-shakeable. CSS Modules (`.module.scss` / `.module.css`) are compiled, class-hashed, extracted per-module, and auto-imported as side-effect `import './X.css'`. `'use client'` directives are preserved per file via `rollup-preserve-directives`. Per-file `.d.ts` are emitted by `vite-plugin-dts`. The theme global SCSS is precompiled to plain CSS by a small `sass` script. A two-consumer smoke test (Next 16 + Vite React) is a hard completion gate.

**Tech Stack:** Vite 7, `@vitejs/plugin-react`, `vite-plugin-dts`, `rollup-preserve-directives`, `sass` (dev only), Bun, TypeScript 5, React 19.

## Global Constraints

- **ESM-only output.** `package.json` gets `"type": "module"`. No CJS.
- **Node 22.x** (per `engines`); use Node 22 built-ins (`node:fs` `globSync`) freely.
- **Externalize every runtime dep:** all `dependencies` + `peerDependencies` (and their deep subpaths) must be `external` — only Paris's own source compiles. `pte` stays external. CSS is never externalized.
- **`preserveModulesRoot: 'src'`** so output mirrors `src/` → `dist/stories/...`.
- **Same public import paths.** `import { Button } from 'paris/button'` must keep working; only the resolved target moves from source to `dist`.
- **`'use client'` must survive** in every compiled file that had it (32 files).
- **CSS must not be tree-shaken away:** `package.json` `"sideEffects": ["**/*.css", "**/*.scss"]`.
- **No component API/behavior changes.** This is a build-pipeline change only.
- **Verification gate blocks completion:** both consumer smoke tests (Next + Vite) must pass.
- Package manager is **Bun** (`bun install`, `bun run`). Commit messages follow Conventional Commits (commitlint enforces). No "Claude"/"Co-Authored-By" lines (user rule).

## File Structure

| File | Responsibility |
|---|---|
| `vite.config.ts` (rewrite — currently for docs site? no, new lib build) | The library build: entries, externals, preserveModules, CSS, directives, dts |
| `scripts/buildThemeCss.mjs` (create) | Compile `theme/global.scss` → `dist/stories/theme/global.css` via `sass`, then concat component CSS → `dist/styles.css` |
| `scripts/generateExports.js` (rewrite) | Emit compiled-target `exports` map into `package.json` |
| `package.json` (modify) | `type`, `exports`, `files`, `sideEffects`, `scripts`, move `sass` to devDeps |
| `tsup.config.ts` (delete) | Stale/broken; replaced by Vite |
| `tsconfig.build.json` (create) | Build-only TS config for dts (excludes tests/stories) |
| `CLAUDE.md`, `AGENTS.md`, `public/llms.txt`, `README.md` (modify) | Consumer-integration + architecture docs |
| `verify/next-consumer/` & `verify/vite-consumer/` (create, gitignored) | Throwaway smoke-test apps |

---

### Task 1: Audit compile hazards across all 32 components

**Files:**
- Create: `docs/superpowers/notes/compile-hazards.md` (scratch inventory; may be deleted after)

**Interfaces:**
- Produces: a hazard list consumed by Task 3 (vite config edge cases) — categories: dynamic imports, asset/SVG imports, `.module.css` vs `.module.scss`, circular deps, direct `pte` imports, non-component entrypoints (helpers/types/utility).

- [ ] **Step 1: Inventory entrypoints and styles**

```bash
cd /Users/sanil/Projects/Slingshot/paris
ls -d src/stories/*/ | sed 's#src/stories/##; s#/##'      # component dirs
find src/stories -name "index.ts" | sort                  # entry files
find src/stories -name "*.module.scss" -o -name "*.module.css" | sort
```
Expected: ~32 dirs, ~32 entry `index.ts`, 32 `.module.scss` + 1+ `.module.css` (`text/Typography.module.css`).

- [ ] **Step 2: Scan for compile hazards**

```bash
cd /Users/sanil/Projects/Slingshot/paris
echo "== dynamic imports =="; grep -rn "import(" src/stories | grep -v "//" || echo none
echo "== asset/svg/png/json imports =="; grep -rnE "from '[^']*\.(svg|png|jpe?g|json|woff2?)'" src/stories || echo none
echo "== non-module css/scss imports (besides global) =="; grep -rnE "import .*\.(scss|css)'" src/stories | grep -vE "module\.(scss|css)" || echo none
echo "== direct pte imports (must stay external) =="; grep -rn "from 'pte'" src/stories
echo "== node builtins in component code =="; grep -rnE "from 'node:" src/stories || echo none
echo "== process/window/document top-level (SSR hazards) =="; grep -rn "process.env" src/stories | head
```

- [ ] **Step 3: Detect circular dependencies (informational)**

```bash
cd /Users/sanil/Projects/Slingshot/paris
bunx madge --circular --extensions ts,tsx src/stories 2>/dev/null || echo "madge unavailable; rely on rollup circular warnings during build"
```
Expected: note any cycles; Rollup tolerates them with `preserveModules` but they may warn. Record, don't fix unless the build breaks.

- [ ] **Step 4: Write the hazard inventory**

Record findings in `docs/superpowers/notes/compile-hazards.md` as a short table: hazard → files → mitigation (e.g., "Typography.module.css → handled natively by Vite CSS Modules; no action"). This file informs Task 3.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/notes/compile-hazards.md
git commit -m "chore: inventory compile hazards for library build"
```

---

### Task 2: Add build tooling, remove stale tsup

**Files:**
- Modify: `package.json` (devDependencies)
- Delete: `tsup.config.ts`

**Interfaces:**
- Produces: `vite-plugin-dts`, `rollup-preserve-directives` available to Task 3.

- [ ] **Step 1: Install build plugins (dev)**

```bash
cd /Users/sanil/Projects/Slingshot/paris
bun add -d vite-plugin-dts rollup-preserve-directives
```
Expected: both added to `devDependencies`. (`vite`, `@vitejs/plugin-react`-equivalent, `sass` already present — verify `@vitejs/plugin-react` exists; if not, `bun add -d @vitejs/plugin-react`.)

- [ ] **Step 2: Verify react plugin availability**

```bash
cd /Users/sanil/Projects/Slingshot/paris
ls node_modules/@vitejs/plugin-react node_modules/vite-plugin-dts node_modules/rollup-preserve-directives 2>&1
```
Expected: all three resolve. If `@vitejs/plugin-react` missing, install it.

- [ ] **Step 3: Remove stale tsup config**

```bash
cd /Users/sanil/Projects/Slingshot/paris
git rm tsup.config.ts
bun remove tsup   # drop the unused tsup devDep
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "build: add vite-plugin-dts + preserve-directives, drop tsup"
```

---

### Task 3: Author the Vite library build config

**Files:**
- Create: `vite.config.ts` (library build — distinct from any Storybook vite usage)
- Create: `tsconfig.build.json`

**Interfaces:**
- Consumes: hazard list (Task 1), plugins (Task 2).
- Produces: `dist/stories/<name>/index.js` (+ per-file `.js`, `.css`, `.d.ts`), `'use client'` preserved. Consumed by Tasks 4–8.

- [ ] **Step 1: Create `tsconfig.build.json`**

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist"
  },
  "include": ["src/stories/**/*.ts", "src/stories/**/*.tsx", "src/helpers/**/*", "src/types/**/*"],
  "exclude": [
    "node_modules", "**/*.test.ts", "**/*.test.tsx",
    "**/*.stories.ts", "**/*.stories.tsx", "**/*.mdx", "src/test/**/*"
  ]
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const root = dirname(fileURLToPath(import.meta.url));

// Every published entrypoint: each component's index.ts + theme.
// preserveModules follows imports, so only reachable modules are emitted.
const entries = globSync('src/stories/*/index.ts', { cwd: root }).map((p) =>
  resolve(root, p),
);

// Externalize all runtime deps + peers (and their deep subpaths).
const externalPkgs = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];
const isExternal = (id: string) =>
  externalPkgs.some((dep) => id === dep || id.startsWith(`${dep}/`)) ||
  id.startsWith('react/') ||
  id === 'react' ||
  id === 'react-dom';

export default defineConfig({
  plugins: [
    react(),
    preserveDirectives(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      // per-file declarations to match preserveModules
      rollupTypes: false,
      include: ['src/stories/**/*.ts', 'src/stories/**/*.tsx', 'src/helpers/**/*', 'src/types/**/*'],
      exclude: ['**/*.test.*', '**/*.stories.*', '**/*.mdx', 'src/test/**/*'],
    }),
  ],
  css: {
    modules: {
      // stable, readable, collision-safe scoped names
      generateScopedName: 'paris_[local]_[hash:base64:5]',
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: true,
    cssCodeSplit: true,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: entries,
      external: isExternal,
      output: {
        format: 'es',
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
```

- [ ] **Step 3: Run the build**

```bash
cd /Users/sanil/Projects/Slingshot/paris
bunx vite build
```
Expected: completes; `dist/stories/button/index.js`, `dist/stories/button/Button.js` exist.

- [ ] **Step 4: Assert output shape (the critical checks)**

```bash
cd /Users/sanil/Projects/Slingshot/paris
echo "== per-file JS present =="; test -f dist/stories/button/Button.js && echo OK || echo FAIL
echo "== 'use client' preserved =="; head -1 dist/stories/button/Button.js
echo "== per-component CSS emitted =="; find dist/stories/button -name "*.css"
echo "== CSS auto-import injected into JS =="; grep -rn "\.css'" dist/stories/button/Button.js || echo "NO CSS IMPORT — see fallback"
echo "== dts emitted =="; test -f dist/stories/button/index.d.ts && echo OK || echo FAIL
echo "== siblings not duplicated (Text imported, not inlined) =="; grep -n "from '\.\./text'" dist/stories/button/Button.js || echo "check import path rewrite"
```
Expected: `'use client';` is line 1 of `Button.js`; a `.css` file exists for Button; **the JS imports that CSS**; `index.d.ts` exists; `Text` is imported (relative), not inlined.

- [ ] **Step 5: If CSS import is NOT injected, apply fallback**

If Step 4 shows no `.css` import in the JS (known Vite lib-mode quirk), do NOT block — switch to the combined-stylesheet path: keep `cssCodeSplit: true` (CSS still extracts), and rely on `dist/styles.css` (Task 4) as the documented consumer import. Note this in `docs/superpowers/notes/compile-hazards.md` and adjust docs in Task 9. Re-run Step 4's other assertions.

- [ ] **Step 6: Commit**

```bash
git add vite.config.ts tsconfig.build.json
git commit -m "build: add vite library config with preserveModules + dts + directives"
```

---

### Task 4: Precompile theme global CSS + aggregate stylesheet

**Files:**
- Create: `scripts/buildThemeCss.mjs`
- Modify: `package.json` (`scripts.build` will call it — wired in Task 6)

**Interfaces:**
- Consumes: `dist/` from Task 3.
- Produces: `dist/stories/theme/global.css`, `dist/styles.css`. Consumed by Tasks 5, 7, 8.

- [ ] **Step 1: Write `scripts/buildThemeCss.mjs`**

```js
import { compile } from 'sass';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

// 1) Compile the global theme SCSS (with its @use'd preflight + util) to plain CSS.
const themeSrc = resolve(root, 'src/stories/theme/global.scss');
const themeOut = resolve(root, 'dist/stories/theme/global.css');
const { css } = compile(themeSrc, { style: 'expanded', loadPaths: [dirname(themeSrc)] });
mkdirSync(dirname(themeOut), { recursive: true });
writeFileSync(themeOut, css);
console.log('✓ wrote dist/stories/theme/global.css');

// 2) Concatenate every emitted component CSS into a single aggregate stylesheet.
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith('.css') && full !== themeOut) acc.push(full);
  }
  return acc;
}
const distStories = resolve(root, 'dist/stories');
const cssFiles = walk(distStories).sort();
const aggregate = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
writeFileSync(resolve(root, 'dist/styles.css'), aggregate);
console.log(`✓ wrote dist/styles.css (${cssFiles.length} component sheets)`);
```

- [ ] **Step 2: Run it (after a `vite build`)**

```bash
cd /Users/sanil/Projects/Slingshot/paris
node scripts/buildThemeCss.mjs
test -f dist/stories/theme/global.css && echo "global OK" || echo FAIL
test -f dist/styles.css && echo "aggregate OK" || echo FAIL
head -5 dist/stories/theme/global.css
```
Expected: both files exist; `global.css` contains plain CSS (no `@use`), e.g. the `.paris-container` rule and preflight.

- [ ] **Step 3: Commit**

```bash
git add scripts/buildThemeCss.mjs
git commit -m "build: precompile theme global.scss to css + aggregate stylesheet"
```

---

### Task 5: Rewrite `generateExports.js` for compiled targets

**Files:**
- Modify: `scripts/generateExports.js`

**Interfaces:**
- Consumes: `src/stories/*/` dir list (unchanged scan).
- Produces: a compiled `exports` map in `package.json`. Consumed by Tasks 7, 8.

- [ ] **Step 1: Rewrite the script**

```js
const fs = require('node:fs');
const baseDir = __dirname.split('/scripts')[0];
const componentDirectory = `${baseDir}/src/stories`;
const ignoreDirectories = ['assets'];

const run = async () => {
  const subDirectories = fs
    .readdirSync(componentDirectory, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((d) => !ignoreDirectories.includes(d));

  const packageFile = require(`${baseDir}/package.json`);

  const exportsMap = {
    '.': {
      types: './dist/stories/index.d.ts',
      import: './dist/stories/index.js',
    },
    './styles.css': './dist/styles.css',
    './theme/global.css': './dist/stories/theme/global.css',
  };
  // Root barrel './.' is optional; only include if src/stories/index.ts exists.
  if (!fs.existsSync(`${componentDirectory}/index.ts`)) delete exportsMap['.'];

  for (const dir of subDirectories) {
    exportsMap[`./${dir}`] = {
      types: `./dist/stories/${dir}/index.d.ts`,
      import: `./dist/stories/${dir}/index.js`,
    };
  }
  packageFile.exports = exportsMap;

  await fs.promises.writeFile(
    `${baseDir}/package.json`,
    `${JSON.stringify(packageFile, null, 4)}\n`,
    'utf8',
  );
  return '✅  Compiled exports updated.';
};

run().then(console.log).catch(console.error);
```

- [ ] **Step 2: Run and inspect**

```bash
cd /Users/sanil/Projects/Slingshot/paris
node scripts/generateExports.js
node -e "const e=require('./package.json').exports; console.log(JSON.stringify(e['./button'],null,2)); console.log(e['./theme/global.css'])"
```
Expected: `./button` → `{ types: dist/.../index.d.ts, import: dist/.../index.js }`; `./theme/global.css` present.

- [ ] **Step 3: Commit**

```bash
git add scripts/generateExports.js package.json
git commit -m "build: point generated exports at compiled dist"
```

---

### Task 6: Update `package.json` metadata, scripts, deps

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: exports from Task 5.
- Produces: a publishable, ESM-only `package.json`. Consumed by verification tasks.

- [ ] **Step 1: Apply field changes**

Edit `package.json`:
- Add top-level `"type": "module"`.
- Add `"sideEffects": ["**/*.css", "**/*.scss"]`.
- `"files": ["dist", "README.md", "CHANGELOG.md"]`.
- Move `"sass"` from `peerDependencies` to `devDependencies` (keep version).
- `peerDependencies` keeps only `react`, `react-dom`, `@types/react`, `@types/react-dom`, `typescript`.
- Scripts:
  - `"build": "bun run generate:exports && vite build && node scripts/buildThemeCss.mjs"`
  - `"build:site": "next build"` (preserve old docs-site build)
  - `"prepack": "bun run build"`
  - keep `generate:exports`, `typecheck`, `lint`, etc.

- [ ] **Step 2: Full clean build via the new pipeline**

```bash
cd /Users/sanil/Projects/Slingshot/paris
rm -rf dist
bun run build
echo "== exports resolve to existing files =="
node -e "const e=require('./package.json').exports; const fs=require('fs'); let bad=0; for(const k in e){const v=e[k]; const fp=typeof v==='string'?v:v.import; if(fp&&!fs.existsSync(fp)){console.log('MISSING',k,fp);bad++}} console.log(bad?`${bad} missing`:'all exports resolve')"
```
Expected: build succeeds; "all exports resolve".

- [ ] **Step 3: Typecheck still green**

```bash
cd /Users/sanil/Projects/Slingshot/paris
bun run typecheck
```
Expected: passes (source unchanged; only build config added).

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "build: ship ESM dist, drop sass peer + raw source, wire build pipeline"
```

---

### Task 7: Verification gate A — Next.js 16 App Router consumer

**Files:**
- Create: `verify/next-consumer/` (gitignored throwaway app)
- Modify: `.gitignore` (add `verify/`)

**Interfaces:**
- Consumes: `dist/` + `package.json` exports.
- Produces: proof RSC + `'use client'` + CSS + types work in Next.

- [ ] **Step 1: Pack the library locally**

```bash
cd /Users/sanil/Projects/Slingshot/paris
npm pack --silent   # produces paris-<version>.tgz
ls paris-*.tgz
```

- [ ] **Step 2: Scaffold a minimal Next 16 App Router app**

```bash
cd /Users/sanil/Projects/Slingshot/paris
mkdir -p verify/next-consumer/app
cd verify/next-consumer
# minimal package.json
cat > package.json <<'JSON'
{ "name": "next-consumer", "private": true, "type": "module",
  "scripts": { "build": "next build" } }
JSON
bun add next@16 react@19 react-dom@19 ../paris-*.tgz
```

- [ ] **Step 3: Write an RSC page that uses a client + server component**

`verify/next-consumer/app/layout.tsx`:
```tsx
import 'paris/theme/global.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="paris-container">{children}</body></html>);
}
```
`verify/next-consumer/app/page.tsx` (Server Component by default):
```tsx
import { Button } from 'paris/button';
import { Text } from 'paris/text';
export default function Page() {
  return (<main><Text kind="headingMedium">Hello</Text><Button kind="primary">Click</Button></main>);
}
```
Add a minimal `next.config.js` with **no** `transpilePackages` (proving it's not needed):
```js
/** @type {import('next').NextConfig} */
export default { reactStrictMode: true };
```
Rename to `next.config.mjs` if `type: module` requires it.

- [ ] **Step 4: Build the consumer (the gate)**

```bash
cd /Users/sanil/Projects/Slingshot/paris/verify/next-consumer
bun run build
```
Expected: **build succeeds.** A failure here (e.g. "'use client' missing", "cannot find module 'paris/button'", CSS/SCSS error) is a real defect — fix the library config (Task 3/6), repack (Step 1), reinstall, rebuild. Do not proceed until green.

- [ ] **Step 5: Assert `'use client'` shipped + CSS present**

```bash
cd /Users/sanil/Projects/Slingshot/paris/verify/next-consumer
head -1 node_modules/paris/dist/stories/button/Button.js   # expect: 'use client';
find node_modules/paris/dist -name "*.css" | head           # component CSS shipped
```

- [ ] **Step 6: Add `.gitignore` + commit (app itself stays untracked)**

```bash
cd /Users/sanil/Projects/Slingshot/paris
grep -qxF "verify/" .gitignore || echo "verify/" >> .gitignore
grep -qxF "paris-*.tgz" .gitignore || echo "paris-*.tgz" >> .gitignore
git add .gitignore
git commit -m "test: gitignore local consumer smoke-test apps"
```

---

### Task 8: Verification gate B — Vite React consumer

**Files:**
- Create: `verify/vite-consumer/` (gitignored)

**Interfaces:**
- Consumes: `dist/` + exports.
- Produces: proof ESM + CSS + types work in Vite React.

- [ ] **Step 1: Scaffold minimal Vite React app**

```bash
cd /Users/sanil/Projects/Slingshot/paris/verify
mkdir -p vite-consumer/src && cd vite-consumer
cat > package.json <<'JSON'
{ "name": "vite-consumer", "private": true, "type": "module",
  "scripts": { "build": "vite build" } }
JSON
bun add react@19 react-dom@19 ../paris-*.tgz
bun add -d vite @vitejs/plugin-react typescript
```

- [ ] **Step 2: Write entry + config**

`verify/vite-consumer/index.html`:
```html
<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
```
`verify/vite-consumer/src/main.tsx`:
```tsx
import 'paris/theme/global.css';
import { createRoot } from 'react-dom/client';
import { Button } from 'paris/button';
import { Text } from 'paris/text';
createRoot(document.getElementById('root')!).render(
  <div className="paris-container"><Text kind="headingMedium">Hi</Text><Button>Go</Button></div>,
);
```
`verify/vite-consumer/vite.config.ts`:
```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({ plugins: [react()] });
```

- [ ] **Step 3: Build the consumer (the gate)**

```bash
cd /Users/sanil/Projects/Slingshot/paris/verify/vite-consumer
bun run build
```
Expected: **build succeeds**, and the output bundle includes Paris component CSS. Inspect:
```bash
grep -rl "paris" dist/assets/*.css 2>/dev/null | head || ls dist/assets
```
A failure (unresolved `import './X.css'`, missing types) is a real defect — fix library config, repack, retry.

- [ ] **Step 4: Typecheck resolution sanity**

```bash
cd /Users/sanil/Projects/Slingshot/paris/verify/vite-consumer
bunx tsc --noEmit --moduleResolution bundler --module esnext --jsx react-jsx --skipLibCheck src/main.tsx 2>&1 | head || echo "types resolved"
```
Expected: no "cannot find module 'paris/button'" / no missing-types errors.

- [ ] **Step 5: Commit (note in plan; app stays gitignored)**

```bash
cd /Users/sanil/Projects/Slingshot/paris
git commit --allow-empty -m "test: verify Vite React consumer builds against compiled dist"
```

---

### Task 9: Update documentation

**Files:**
- Modify: `CLAUDE.md`, `AGENTS.md`, `public/llms.txt`, `README.md`

**Interfaces:**
- Consumes: final consumer-integration shape proven in Tasks 7–8.

- [ ] **Step 1: Update `CLAUDE.md`**

- Project Overview: replace "ships as unbundled `.tsx` components with SCSS modules (not pre-compiled)" with the compiled-ESM reality.
- Consumer Integration: remove `transpilePackages: ['paris']` and the `sass` requirement; change `paris/theme/global.scss` → `paris/theme/global.css`; keep `className="paris-container"`; note `moduleResolution: "bundler"` recommended.
- Commands: document `bun run build` produces `dist`.

- [ ] **Step 2: Update `AGENTS.md`** — same consumer-integration + build-command changes; reflect that adding a component now requires a build for consumers (exports auto-generated from `src/stories`).

- [ ] **Step 3: Update `public/llms.txt`** — consumption/install snippet to the new no-`transpilePackages`, CSS-import flow.

- [ ] **Step 4: Update `README.md`** — install + setup steps (delete `transpilePackages`, delete `sass`, import `paris/theme/global.css`).

- [ ] **Step 5: Commit**

```bash
cd /Users/sanil/Projects/Slingshot/paris
git add CLAUDE.md AGENTS.md public/llms.txt README.md
git commit -m "docs: update consumer integration for compiled library"
```

---

### Task 10: Final adversarial review + cleanup

**Files:**
- Modify: as needed from review findings
- Delete: `docs/superpowers/notes/compile-hazards.md` (optional scratch cleanup)

- [ ] **Step 1: Re-run the whole pipeline clean**

```bash
cd /Users/sanil/Projects/Slingshot/paris
rm -rf dist paris-*.tgz
bun run build && bun run typecheck && bun run lint
```
Expected: all green.

- [ ] **Step 2: Adversarial config review** — confirm: (a) no runtime dep got bundled (spot-check `dist/stories/markdowneditor/*.js` does not inline `@tiptap`), (b) every `exports` path resolves to a real file, (c) `'use client'` present in all 32 client files: 
```bash
cd /Users/sanil/Projects/Slingshot/paris
echo "tiptap inlined?"; grep -rl "createEditor\|@tiptap" dist/stories/markdowneditor/*.js | head || echo "external OK"
echo "use-client count:"; grep -rl "use client" dist/stories | wc -l   # expect ~32
```

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "build: finalize compiled-library pipeline" || echo "nothing to fix"
```

---

## Self-Review

**Spec coverage:** preserveModules (T3) ✓; Vite toolchain + externals + directives + dts (T3) ✓; per-component auto CSS + sideEffects + fallback (T3/T4/T6) ✓; theme global.css precompile (T4) ✓; exports/package.json/files/sass-move (T5/T6) ✓; ESM-only `type:module` (T6) ✓; consumer migration proof Next+Vite (T7/T8) ✓; docs (T9) ✓; hazard audit (T1) ✓; remove tsup (T2) ✓; risk/verification gate (T7/T8) ✓.

**Placeholder scan:** no TBD/TODO; all config + scripts shown in full; fallback path concrete (T3 S5 → T4 aggregate).

**Type consistency:** `dist/stories/<name>/index.js|.d.ts` layout used consistently across T3, T5, T6, T7; `buildThemeCss.mjs` outputs (`global.css`, `styles.css`) referenced identically in T4/T5/T6/T9.
