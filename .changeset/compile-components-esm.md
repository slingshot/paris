---
"paris": minor
---

Compile components to ESM instead of shipping unbundled `.tsx`

Paris now ships precompiled ESM in `dist/` (built with Vite) — each component's CSS is extracted and auto-imported on use, `'use client'` directives are preserved per file for React Server Components, and per-file `.d.ts` types are emitted. Verified against Next.js App Router (RSC) and Vite React.

**Breaking for consumers** (minor while pre-1.0):

- Remove `transpilePackages: ['paris']` from `next.config.js` — no longer needed.
- Remove the `sass` dependency — styles are precompiled, and `sass` is no longer a peer dependency.
- Change `import 'paris/theme/global.scss'` → `import 'paris/theme/global.css'`.

Component import paths (`paris/button`, `paris/text`, etc.) are unchanged.
