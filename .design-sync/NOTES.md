# Paris → claude.ai/design sync notes

Project: Paris (`6af26f61-eb1f-408a-a082-09ef618a0dd5`) · shape: storybook · `window.Paris`

## Environment

- **Node**: Storybook 10 (`@storybook/nextjs-vite`) requires Node ≥22.12 (or ≥20.19). The repo's nvm default here is **v22.11.0 (too old)** — the reference-storybook build, the converter, and Playwright are all run with **Homebrew Node v26** (`/opt/homebrew/bin`). The DS `dist/` build itself uses bun+vite and is unaffected. The repo's zsh `node`/`npm`/`npx`/`bun` shell functions (nvm lazy-load) must be `unset -f` before invoking Homebrew binaries.
- **Package manager**: bun (`bun install --frozen-lockfile`). Converter deps isolated in `.ds-sync/` (npm + Playwright chromium).

## [GENERAL] fixes folded into config (re-syncs replay these)

- **No root barrel.** Paris's `package.json` exposes only per-component subpath exports — no `.` export, no `module`/`main`/`types`. The converter needs a single JS entry to build `window.Paris` and a single types entry to enumerate exports/props.
  - `cfg.entry` → `.design-sync/paris-entry.mjs` — generated barrel re-exporting every `dist/stories/<name>/index.js`.
  - `index.d.ts` (repo root) — generated types barrel re-exporting every `dist/stories/<name>/index`. **Must live at repo root**: `projectFor` derives the types entry as `<pkgDir>/index.d.ts` (pkgDir = repo root via the `--entry` walk-up), and `isOwnProp` only keeps a component's `onClick`/`aria-*` props when their `.d.ts` is under pkgDir — so a barrel anywhere else would drop those props.
- **Theme variables + global preflight missing from preview CSS.** Paris components style via CSS vars (`var(--pte-*)`) and rely on a Tailwind preflight (`paris/theme/global.css`) that consumers import separately. Neither is in the per-component CSS the converter bundles, and both are injected at runtime in storybook (so the static scrape misses them). Fix: `cfg.cssEntry` → `.design-sync/preview-base.css` = `generateCSS(LightTheme)` (current tokens — the committed `public/pte.css` is **stale**) + `dist/stories/theme/global.css` (the preflight). Without the preflight, `img`/`box-sizing`/margins diverge from storybook (Avatar rendered a 980px uncropped image instead of a 128px circle).
- **All three inputs above are GENERATED, not hand-maintained.** `.design-sync/gen-sync-inputs.mjs` (run via bun) regenerates `paris-entry.mjs`, the root `index.d.ts`, and `preview-base.css` from the freshly-built `dist/` + `themes.ts`. It is wired into `cfg.buildCmd` (`bun run build && bun .design-sync/gen-sync-inputs.mjs`), so the driver re-derives them on every sync — **adding/removing a component needs no manual step**. All three are **gitignored** (only the generator is committed): the root `index.d.ts` would otherwise enter Paris's broad tsconfig `include` (`**/*.d.ts`) and break `tsc --noEmit` whenever `dist/` isn't built first.
- **Fonts.** `cfg.extraFonts` → `public/graphik/graphik.css` + `public/fira/fira_code.css` (Graphik Web + Fira Code; 24 @font-face rules copied into `fonts/`).
- **Grid overflow.** `cfg.overrides.{Text,Combobox,Input,Select,TextArea}.cardMode = "column"` — full-width input/typography stories crop in the default grid card.

## Accepted warnings (triaged — do not chase)

- **`[TOKENS_MISSING]` (7 vars)**: `--pte-new-colors-content{Positive,Warning,Negative}{Medium,Strong}` (used by `Tag.css`) and `--pte-animations-duration-instant` (used by `AccordionSelect.css`). These are **pre-existing dead references in Paris's own component CSS** — the theme defines `contentPositive` (not `...Medium/Strong`) and has no `duration.instant`. They're undefined in **both** storybook and previews, so renders match (fidelity-neutral). Not a sync problem; would be a Paris CSS fix.
- **`[FONT_MISSING] "JetBrains Mono"`**: only a 3rd-tier fallback in `"SF Mono", "Fira Code", "JetBrains Mono", ui-monospace, monospace` (markdown code blocks). Fira Code (shipped) + SF Mono (system) precede it, so it never renders.
- **`[RENDER_THIN] Dialog`**: Dialog stories are interaction-driven — they render only the trigger button (dialog opens on click). Storybook renders the same closed trigger, so Default/Grey match it faithfully. Not authoring an open-state preview because that would render *more* than the oracle (rubric: a preview rendering more than the gated reference is not a pass).
- **`[REFERENCE_STALE?]`** on compare after a `cssEntry` change: expected — only the converter's preview-CSS assembly changed (adding preflight the reference already has), not the DS source. Reference is correct; no rebuild needed.

## Fan-out results (first sync)

All 29 storied components graded **match** on first capture — **zero owned previews, zero config edits, zero `[GENERAL]` regressions**. The solo-phase global fixes (preflight + theme vars + fonts) carried every component.

- **[GENERAL] Overlays render closed triggers, not open overlays.** Every overlay/portal story (Dialog, Drawer, Menu, Popover, InformationalTooltip, Toast, Select, Combobox) renders only its closed trigger (button/icon/inline text) in Storybook — `useState(false)` default — so the preview's closed trigger matches the oracle. **No `cardMode:"single"` override is needed for any component**, and there's no portal bleed in product cards (`portal:false` in all capture facts). If a future story is authored to default-open an overlay, re-evaluate that one for `cardMode:"single"`.
- **Framing-only differences are not defects** (graded match): Card/CardButton "Raised" elevation renders full-bleed in the Storybook canvas (border/shadow at image edges) vs width-constrained in the preview page; Tilt's resting drop-shadow differs slightly (pointer-driven). Same component/content/styling — judged per the rubric's "ignore framing" rule.

## Re-sync risks (watch-list for the next run)

- **Preview capture viewport is a fixed 900×700**; Storybook captures full-page. Tall stories (e.g. Markdown "Rich Content", sb≈1082px) have trailing content below the preview fold — in-frame content is graded; the off-fold tail (incl. a remote placehold.co banner img) is not a loading failure, just a viewport clamp. If a tall story needs full verification, raise `--max-stories`/inspect the raw PNG.
- **`[STORY_CAP]` tails (verified-by-upload):** Button (7 stories, 6 captured), Input (8/6), Drawer (8/6), Text (24/6) — the uncaptured tail stories are additional sizes/variants of an already-matching component, trusted via the cap. Raise `--max-stories` on a re-sync if any tail variant warrants individual verification.

- **Generated inputs derive from `dist/`** and are regenerated by `cfg.buildCmd` (`gen-sync-inputs.mjs`) on every driver run — so adding/removing components is handled automatically. They're gitignored; only `gen-sync-inputs.mjs` is committed. (If you ever run the bare converter `package-build.mjs` WITHOUT `buildCmd` on a fresh clone, run `bun .design-sync/gen-sync-inputs.mjs` first so the barrels + `preview-base.css` exist.)
- **`public/pte.css` drift**: the repo's committed theme snapshot is stale; the sync deliberately ignores it in favor of a fresh `generateCSS(LightTheme)`. If Paris adds the missing token namespaces to the theme, the `[TOKENS_MISSING]` count should drop on its own.
- **Node version**: if the repo's nvm default is bumped to ≥22.12, the Homebrew-Node workaround becomes unnecessary.
- **Decorator bundle is intentionally NOT used.** `.storybook/preview.ts` imports `.scss`, which the converter's decorator-bundler can't load (no loader knob; would need a fork). Theming is supplied statically via `preview-base.css` instead, which is sufficient (Paris needs no React provider — theme is CSS vars). The `! preview decorator bundle failed` warning is expected.
