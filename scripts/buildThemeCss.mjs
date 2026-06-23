// Post-build step: compile the global theme SCSS to plain CSS (so consumers no
// longer need a Sass toolchain) and concatenate every per-component CSS sheet
// into a single aggregate `dist/styles.css` for consumers who prefer one import.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { compile } from 'sass';

const root = resolve(import.meta.dirname, '..');

// 1) Compile the global theme SCSS (with its @use'd preflight + util) to CSS.
const themeSrc = resolve(root, 'src/stories/theme/global.scss');
const themeOut = resolve(root, 'dist/stories/theme/global.css');
const { css } = compile(themeSrc, { style: 'expanded', loadPaths: [dirname(themeSrc)] });
mkdirSync(dirname(themeOut), { recursive: true });
writeFileSync(themeOut, `${css}\n`);
console.log('✓ wrote dist/stories/theme/global.css');

// 2) Concatenate every emitted component CSS into one aggregate stylesheet.
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
