# Compile Hazards Report — Vite preserveModules ESM + CSS Modules

## Executive Summary

The codebase is **not yet compile-ready**: while the build pipeline (Vite `preserveModules` ESM output, per-file CSS-Module extraction, `rollup-preserve-directives`, externalized deps) is fundamentally sound and most components are correctly authored, there are **5 blockers** — all the same root cause: components/helpers that use client-only React APIs (`useState`, `useMemo`, event handlers, interactive primitives) ship as standalone subpath entries (`paris/menu`, `paris/accordion`, `paris/field`, etc.) but are **missing the `'use client'` directive**. Under `preserveModules` each file becomes its own directive-less chunk and will throw in the Next.js App Router RSC graph when imported directly. These are quick one-line fixes; once the directives are added (plus a deps-wide subpath-aware `external` predicate and CSS-Modules config covering both `.module.scss` and `.module.css`), the codebase is clear to compile.

## Blockers

| Component | File | Category | Detail | Mitigation |
|-----------|------|----------|--------|------------|
| Menu | `src/stories/menu/Menu.tsx` | use-client | Renders @headlessui/react Menu/MenuButton/MenuItems (client-only, context+hooks), render-prop children, imports `OpenChangeEffect` (useEffect/useRef) — but has NO `'use client'`. Emitted as a directive-less chunk; treated as a Server Component in the App Router and throws at render. | Add `'use client';` as the first line; verify the emitted `dist/.../Menu.js` starts with the banner. |
| OpenChangeEffect | `src/helpers/OpenChangeEffect.tsx` | use-client | Hook-bearing helper (useEffect/useRef) with no `'use client'`. Imported by Menu/Select/Combobox. As a standalone preserveModules chunk it is a server-eligible module touching hooks; breaks if any non-client importer pulls it in. | Add `'use client';` (it is inherently a client-only render-prop effect bridge). |
| InformationalTooltip | `src/stories/informationaltooltip/InformationalTooltip.tsx` | use-client | Uses useState, onClick, @radix-ui/react-tooltip (client primitive), framer-motion AnimatePresence/motion — no `'use client'`. Emitted directive-less; throws on useState/Radix context in RSC. | Add `'use client';` as the first line; verify preserved in output. |
| Accordion | `src/stories/accordion/Accordion.tsx` | use-client | Uses useState + onClick/onKeyDown handlers, no `'use client'`. Works only transitively via Markdown today; a direct `import { Accordion } from 'paris/accordion'` in an RSC/SSR graph throws. | Add `'use client';` as the first line of the file. |
| Field | `src/stories/field/Field.tsx` | use-client | Stateless FC that defines an onClick handler on its container, no `'use client'`. Exported standalone as `paris/field`; a server component importing it throws on the illegal interactive handler. | Add `'use client';` as the first line. |

## Build-config implications

- **`rollup-preserve-directives` is mandatory.** Confirm it is in the Vite plugin list and that every emitted per-file chunk retains its leading `'use client'` banner (verified-correct directives exist on Button, CardButton, Tilt, Dialog, Drawer*, Input, CodeInput, Table, Tag, MarkdownEditor client chunks). Never strip directives during build.
- **Externalize ALL package.json deps + peerDeps via a subpath-aware predicate**, not a hand-listed allowlist. Use a function/RegExp, e.g. `external: (id) => /^@tiptap\//.test(id) || /^@fortawesome\//.test(id) || /^@radix-ui\//.test(id) || ...`. Must specifically cover: `react-tiny-popover`, `@fortawesome/*`, `@ssh/csstypes`, `font-color-contrast`, `ts-deepmerge`, `framer-motion`, `@headlessui/react`, `@radix-ui/*`, `@ariakit/react`, `pte`, `react-markdown`, `rehype-raw`, `remark-gfm`, `react-hot-toast`, `lucide-react`, `clsx`, and **deep subpaths** like `@tiptap/react/menus` and every `@tiptap/extension-*`.
- **CJS interop for `font-color-contrast`.** Set Rollup `output.interop: 'auto'` (or equivalent commonjs handling) so the default import `import fontColorContrast from 'font-color-contrast'` resolves to the function rather than `undefined` at consumer runtime.
- **ESM output condition.** Emit ESM (`import` condition) so pure-ESM deps (`react-markdown` v10, `remark-*`, `rehype-*`) resolve without `require() of ES Module` errors.
- **CSS Modules must match BOTH `.module.scss` AND `.module.css`.** Several components import a shared `.module.css` CSS Module (e.g. `text/Typography.module.css`). Configure `css.modules` and the extraction plugin to treat both extensions as CSS Modules and extract per-file.
- **Deterministic CSS-Module class hashing.** `Typography.module.css` is imported by Text, Tag, Tabs, Table, Toast, Popover; `Input.module.scss` / `Select.module.scss` are shared across Combobox/Select/Input. Use a stable `generateScopedName` so the shared module yields identical class names regardless of importer, and emit each shared CSS asset **once**, referenced by correct relative path across chunks.
- **Ship `theme/global.scss` as a standalone global CSS entry**, excluded from the CSS-Modules transform (it `@use`s tw-preflight.css and util.scss; no `url()`/asset imports).
- **Set `"sideEffects": false`** (or list only `*.scss`/`*.css`) in package.json so Rollup can tree-shake barrels — specifically so `framer-motion` (pulled via the `utility` barrel's `EasingFunctions`) does not leak into the Checkbox chunk.
- **Prefer per-file generated subpath exports.** Keep `generate:exports` emitting per-file subpath exports (e.g. `paris/markdowneditor/features`) so server code can import non-client config without crossing a client boundary via the barrel.
- **Add `'use client'` to all 5 blocker files** (Menu, OpenChangeEffect, InformationalTooltip, Accordion, Field) plus the warn-level client helpers/components below before compiling.
- **No special asset-loader handling needed.** No raw svg/png/json/font imports anywhere (FontAwesome icons are JS objects; Spinner uses inline `dangerouslySetInnerHTML`). No dynamic `import()`. No module-scope `window`/`document` access — `createTheme(LightTheme)` at `themes.ts:1509` is a verified-pure SSR-safe factory.

## Warnings & info

| Component | File | Category | Severity | Note / Mitigation |
|-----------|------|----------|----------|-------------------|
| useControllableState | `src/helpers/useControllableState.ts` | use-client | warn | Hooks, no directive; only client-imported today. Add `'use client';` for robustness under preserveModules. |
| renderEnhancer / MemoizedEnhancer | `src/helpers/renderEnhancer.tsx` | use-client | warn | Uses `React.memo`, no directive; breaks if a server component imports it directly. Add `'use client';`. |
| TextArea | `src/stories/textarea/TextArea.tsx` | use-client | warn | forwardRef + useId, no directive (Input.tsx has one). Add `'use client';`. |
| Avatar | `src/stories/avatar/Avatar.tsx` | use-client | warn | Uses `useMemo`, no directive — crashes in RSC. Add `'use client';` or drop the trivial useMemo. |
| usePagination | `src/stories/pagination/usePagination.ts` | use-client | warn | useState hook, no directive; shipped as `paris/pagination`. Add `'use client';` or document client-only usage. |
| Tag | `src/stories/tag/Tag.tsx` | use-client | warn | Correctly has `'use client'` (needed for trivial useMemo) — must be PRESERVED. Optional refactor: drop useMemo to remove the boundary. |
| Popover | `src/stories/popover/Popover.tsx` | external-dep | warn | `react-tiny-popover` must be externalized (covered by deps-wide predicate). |
| Combobox / Select | `Combobox.tsx` / `Select.tsx` | external-dep | warn | `@fortawesome/*` must be externalized; keep `framer-motion` external. |
| Button | `src/stories/button/Button.tsx` | external-dep | warn | `font-color-contrast` (CJS) must stay external with correct interop (see config). |
| MarkdownEditor / FloatingToolbar | `markdowneditor/FloatingToolbar.tsx` | external-dep | warn | Deep subpath `@tiptap/react/menus` needs a subpath-aware external predicate. |
| Checkbox | `src/stories/checkbox/Checkbox.tsx` | reexport-barrel | warn | Imports from `../utility` barrel which re-exports framer-motion via EasingFunctions. Need `sideEffects:false` so it tree-shakes out of the Checkbox chunk. |
| Toast | `src/stories/toast/Toast.tsx` | reexport-barrel | warn | `export * from 'react-hot-toast'` drags the full client surface through a directive-less wrapper. Switch to explicit named re-exports; keep react-hot-toast external. |
| EasingFunctions | `src/stories/utility/EasingFunctions.ts` | reexport-barrel | warn | Pulls framer-motion root into the utility barrel just for `cubicBezier`. Inline the easing constant or use a pure subpath; keep framer-motion external. |
| Text | `src/stories/text/Text.tsx` | css-modules | warn | Mixed `.module.scss` + `.module.css` in one component; both must be handled as CSS Modules. |
| Popover / Combobox / Select / Tabs / Table / Toast | various | css-modules | info | Valid cross-directory shared CSS Modules (Typography/Input/Select). Verify extract-once + correct relative paths + deterministic hashing across chunks. |
| Combobox / Select / Accordion / CardButton / Checkbox | various | external-dep | info | `@fortawesome/*`, `@ariakit/react`, `@headlessui/react`, `@radix-ui/*` must stay external (covered by deps-wide predicate). Icons are JS objects — no asset loader. |
| Markdown | `src/stories/markdown/Markdown.tsx` | external-dep | info | `react-markdown`/`rehype-raw`/`remark-gfm` are pure ESM — externalize and ship ESM output. Has correct `'use client'`. |
| MarkdownEditor barrel / features | `markdowneditor/index.ts`, `features.ts` | reexport-barrel | info | Barrel mixes client components with non-client config (ALL_FEATURES). Rely on per-file subpath exports + preserveModules. `features.ts` needs no directive (pure config). |
| Drawer / Drawer barrel | `drawer/Drawer.tsx`, `drawer/index.ts` | use-client | info | All subcomponents already carry `'use client'`; portals/ResizeObserver only in effects (SSR-safe). Type-only re-exports use `export type`. Verify banners preserved. |
| Dialog, Input, CodeInput, Button, CardButton, Tilt, StyledLink, Text, Callout, Card | various | use-client | info | Correctly authored — directives present where needed, absent where server-safe. No change; just preserve existing directives. |
| theme | `theme/themes.ts`, `theme/index.ts` | module-scope-side-effect | info | `createTheme(LightTheme)` at module scope is a verified-pure SSR-safe factory (DOM access only in injectTheme/updateTheme/pget). Keep `pte` external; re-verify on pte upgrades. |
| Button | `src/stories/button/Button.tsx` | other | info | Uses Tailwind-style utility class strings — consumer must provide Tailwind/global CSS (documented requirement, no build impact). |
| Icon barrel / Spinner | `icon/index.ts`, `icon/Spinner.tsx` | other | info | Explicit named re-exports (tree-shakeable), no directives needed. Spinner's `dangerouslySetInnerHTML` is SSR-safe. |
