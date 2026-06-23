---
"paris": patch
---

Fix: ship per-component CSS as plain `.css` instead of `.module.css`

v0.24.0 emitted each component's extracted CSS as a `*.module.css` file while baking the (already globally-unique) `paris_<local>_<hash>` class names into the compiled JS as literal strings. Consumer bundlers that honor the CSS-Modules naming convention (Next.js and Vite both do) re-scoped those files a second time — rewriting the selector to `.Button-module__<hash>__paris_button_<hash>`, which no longer matched the class Paris applied to the element. The result was that **every component rendered unstyled**.

The build now renames each extracted `*.module.css` to plain `*.css` and rewrites the JS side-effect import to match, so downstream bundlers treat the CSS as global (already-scoped) and leave the class names alone. Class names, the `exports` map, `sideEffects`, and the `paris/styles.css` aggregate are unchanged. Verified end-to-end in Next.js App Router and Vite React (computed `display: flex` on a rendered Button).
