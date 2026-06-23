// Post-build steps, run after `vite build`:
//
// 1. Ship per-component extracted CSS as PLAIN `.css`, not `.module.css`.
//    Vite names each extracted CSS asset after its `.module.scss` / `.module.css`
//    source, so it lands as `*.module.css`. Consumer bundlers (Next.js, Vite, …)
//    honor the CSS-Modules naming convention and RE-SCOPE those files a second
//    time — rewriting `.paris_button_<hash>` to `.Button-module__<hash>__paris_…`,
//    which no longer matches the literal class names Paris already baked into the
//    compiled JS. Result: every component renders unstyled. The class names are
//    already globally unique (`paris_<local>_<hash>`), so they must NOT be scoped
//    again downstream — we ship the CSS as plain `.css` and fix the side-effect
//    import in each JS proxy to match.
// 2. Compile the global theme SCSS to plain CSS (consumers need no Sass).
// 3. Concatenate every per-component CSS into one aggregate `dist/styles.css`.
import { mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { compile } from 'sass';

const root = resolve(import.meta.dirname, '..');
const distDir = resolve(root, 'dist');

function walk(dir, acc = []) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full, acc);
        else acc.push(full);
    }
    return acc;
}

// 1a) Rename every `*.module.css` asset to plain `*.css` (drop the CSS-Modules
//     marker so downstream bundlers treat it as global, already-scoped CSS).
let renamedCount = 0;
for (const file of walk(distDir)) {
    if (file.endsWith('.module.css')) {
        renameSync(file, file.replace(/\.module\.css$/, '.css'));
        renamedCount++;
    }
}

// 1b) Rewrite the side-effect CSS import in the emitted JS proxies to point at the
//     renamed plain `.css`. The pattern matches only a quoted relative import path
//     that ENDS in `.module.css`, so it never touches the `*.module.scss.js` /
//     `*.module.css.js` proxy module specifiers (which end in `.js`).
let rewrittenCount = 0;
for (const file of walk(distDir)) {
    if (!file.endsWith('.js')) continue;
    const code = readFileSync(file, 'utf8');
    const next = code.replace(/(['"])((?:\.\.?\/)[^'"]*?)\.module\.css\1/g, '$1$2.css$1');
    if (next !== code) {
        writeFileSync(file, next);
        rewrittenCount++;
    }
}
console.log(
    `✓ shipped per-component CSS as plain .css (${renamedCount} files renamed, ${rewrittenCount} imports rewritten)`,
);

// 2) Compile the global theme SCSS (with its @use'd preflight + util) to CSS.
const themeSrc = resolve(root, 'src/stories/theme/global.scss');
const themeOut = resolve(distDir, 'stories/theme/global.css');
const { css } = compile(themeSrc, { style: 'expanded', loadPaths: [dirname(themeSrc)] });
mkdirSync(dirname(themeOut), { recursive: true });
writeFileSync(themeOut, `${css}\n`);
console.log('✓ wrote dist/stories/theme/global.css');

// 3) Concatenate every per-component CSS into one aggregate stylesheet.
const distStories = resolve(distDir, 'stories');
const cssFiles = walk(distStories)
    .filter((f) => f.endsWith('.css') && f !== themeOut)
    .sort();
const aggregate = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
writeFileSync(resolve(distDir, 'styles.css'), aggregate);
console.log(`✓ wrote dist/styles.css (${cssFiles.length} component sheets)`);
